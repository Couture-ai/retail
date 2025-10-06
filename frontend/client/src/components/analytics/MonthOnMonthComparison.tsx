import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TrendingUp, Calendar, BarChart3, Loader2, AlertCircle, RefreshCw, Search, X, Group, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { useProject } from '@/context/ProjectProvider';
import { sanitizeLabel, debugggg } from '@/lib/utils';

// interface MonthData {
//   month_year: string;
//   week_start_date: string;
//   forecast_qty: {
//     bb?: number; // Business Baseline
//     cb?: number; // Couture Baseline
//   };
//   sold_qty: number;
// }

type MonthData = {
  [key: string]: number | string; // depending on your data
};

interface GroupedForecastRecord {
  // Store details
  store_no: string;
  city: string;
  state: string;
  region: string;
  store_type: string;
  channel: string;
  
  // Product details
  article_id: string;
  article_description: string;
  brand: string;
  super_category: string;
  segment: string;
  division: string;
  vertical: string;
  
  // Aggregated month data
  months: MonthData[];

  // 👇 add this for loose typing
  [key: string]: any;
}

interface ForecastMetadata {
  essential_columns: string[];
  essential_columns_datatypes: { [key: string]: string };
  essential_columns_filtertypes: { [key: string]: string };
  store_location_hierarchy: string[];
  product_category_hierarchy: string[];
  store_attributes: string[];
  product_attributes: string[];
  store_card_attributes: string[];
  product_card_attributes: string[];
}

interface ColumnGroup {
  name: string;
  columns: string[];
  color: string;
  expanded: boolean;
}

interface FilterOption {
  value: string;
  count: number;
}

interface RangeFilter {
  min: number | null;
  max: number | null;
}

interface DiscreteFilter {
  selectedValues: string[];
  availableOptions: FilterOption[];
  loading: boolean;
  hasMore: boolean;
  page: number;
  searchTerm: string;
}

interface SearchFilter {
  value: string;
}

interface AppliedFilter {
  column: string;
  type: 'discrete' | 'range' | 'search';
  displayValue: string;
  sqlCondition: string;
}

interface ForecastRecord {
  [key: string]: any;
}

const MonthOnMonthComparison: React.FC = () => {
  const [data, setData] = useState<GroupedForecastRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  
  // Search states
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>({});
  const [activeSearches, setActiveSearches] = useState<{ [key: string]: string }>({});
  
  // Unified search state
  const [unifiedSearchValue, setUnifiedSearchValue] = useState<string>('');
  const [activeUnifiedSearch, setActiveUnifiedSearch] = useState<string>('');
  
  // Table ref for infinite scroll
  const tableContainerRef = useRef<HTMLDivElement>(null);
  
  const { forecastRepository } = useProject();

  // Group by state
  const [isGroupByMode, setIsGroupByMode] = useState(false);
  const [showGroupByModal, setShowGroupByModal] = useState(false);
  const [selectedGroupByColumns, setSelectedGroupByColumns] = useState<string[]>([]);
  const [groupByColumns, setGroupByColumns] = useState<string[]>([]);
  
  // Month related filter - separate in UI 
  const [months, setMonths] = useState<string[]>([])
  const [isMonthsLoading, setIsMonthsLoading] = useState<boolean>(false)

  // `selectedMonth` is the temporary state for selections inside the modal
  const [selectedMonth, setSelectedMonth] = useState<string[]>([])
  // `appliedMonths` is the state that triggers the API call
  const [appliedMonths, setAppliedMonths] = useState<string[]>([])
  const [isMonthSelectMode, setIsMonthSelectMode] = useState(false)
  const [showMonthSelectModal, setShowMonthSelectModal] = useState(false)

  // field required for columns, dropdowns
  const [metadata, setMetadata] = useState<ForecastMetadata | null>(null);
  const [columnGroups, setColumnGroups] = useState<ColumnGroup[]>([]);

  // Column selector state
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [visibleColumnSettings, setVisibleColumnSettings] = useState<{ [key: string]: boolean }>({});
  
  // Row selection state
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
  
  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [discreteFilters, setDiscreteFilters] = useState<{ [key: string]: DiscreteFilter }>({});
  const [rangeFilters, setRangeFilters] = useState<{ [key: string]: RangeFilter }>({});
  const [searchFilters, setSearchFilters] = useState<{ [key: string]: SearchFilter }>({});
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [filterRanges, setFilterRanges] = useState<{ [key: string]: { min: number; max: number } }>({});
  
  // Week start date state - use prop if provided, otherwise use local state
  const [weekStartDates, setWeekStartDates] = useState<string[]>([]);
  const [localSelectedWeekStartDate, setLocalSelectedWeekStartDate] = useState<string>('');
  const [loadingWeekDates, setLoadingWeekDates] = useState(false);
  
  // Use prop if provided, otherwise fall back to local state
  const selectedWeekStartDate = localSelectedWeekStartDate;
  const isWeekStartDateControlled = true;

  // Fields decided to show in the table
  const [monthWiseColumns, setMonthWiseColumns] = useState<string[]>([
    "month_year",
    // "week_start_date",
    "sold_qty",
    "couture_baseline",
    "business_baseline",
    "couture_baseline_accuracy",
    "business_baseline_accuracy",
    "revised_baseline_accuracy",
    "business_consensus_accuracy",
    "couture_vs_business_uplift",
    "couture_vs_business_consensus_uplift",
    "revised_vs_business_consensus_uplift",
    "business_vs_business_consensus_uplift",
    "revised_baseline",
    "business_consensus",
  ]);

  // Add a new state for metadata loading
  const [metadataLoading, setMetadataLoading] = useState(true);


  // --- Effect Hooks for Data Loading ---

  // 1. Load metadata and other static data once on component mount.
  useEffect(() => {
    const initializeData = async () => {
      loadMetadata();
      await getListOfMonths();
      if (isWeekStartDateControlled) {
        loadWeekStartDates();
      }
    }
    
    initializeData()
  }, [isWeekStartDateControlled]);

  // 2. Load table data after metadata is ready, and re-load when filters change.
  useEffect(() => {
    // Prevent loading data until metadata is available.
    if (metadataLoading) {
      return;
    }
    loadInitialData();
  }, [activeSearches, activeUnifiedSearch, groupByColumns, appliedMonths, metadataLoading, appliedFilters]);


  const getListOfMonths = async () => {
    // replace this with the API call and downstream processing, placeholders

    const stateSettersNew = {
        setLoading: (loading: boolean) => setLoading(loading),
        setError: (error: string | null) => setError(error),
        setData: (response: any) => {
          if (response && response.items) {
              // now set the possible months
              debugggg("Months Init")
              const monthsList: any = []
              response.items.forEach((item : any) => {
                monthsList.push(item.month_year)
              });
              setMonths(monthsList)
          }
        }
      }

      // only bring the top 20 months -- group by month_year
      const requestBody = {limit: 20, offset: 0, group_by: ["month_year"]}
      await forecastRepository.makeAPICall(requestBody, stateSettersNew);
  }


  // take the total requests body from the API and return a final filters body
  const generateFiltersForAPI = () => {
    // Define the structure for the final request body object.
    const finalRequestBody: Record<string, 
      { type: "discrete"; values: string[] } | 
      { type: "range"; min?: number; max?: number }
    > = {};

    // --- Process Discrete Filters ---
    // Iterate over each entry in the discreteFilters state object.
    Object.entries(discreteFilters).forEach(([column, filterState]) => {
      // Check if the filter has any selected values.
      if (filterState.selectedValues && filterState.selectedValues.length > 0) {
        // If so, add it to the request body in the required format.
        finalRequestBody[column] = {
          type: "discrete",
          values: filterState.selectedValues,
        };
      }
    });

    // --- Process Range Filters ---
    // Iterate over each entry in the rangeFilters state object.
    // Object.entries(rangeFilters).forEach(([column, filterState]) => {
    //   // Check if 'min' or 'max' has a valid, non-null numeric value.
    //   const hasMin = filterState.min !== null && !isNaN(Number(filterState.min));
    //   const hasMax = filterState.max !== null && !isNaN(Number(filterState.max));

    //   // If at least one bound (min or max) is set, create the range filter object.
    //   if (hasMin || hasMax) {
    //     const rangeFilter: { type: "range"; min?: number; max?: number } = { type: "range" };
        
    //     // Add the 'min' value if it exists.
    //     if (hasMin) {
    //       rangeFilter.min = Number(filterState.min);
    //     }
    //     // Add the 'max' value if it exists.
    //     if (hasMax) {
    //       rangeFilter.max = Number(filterState.max);
    //     }
        
    //     // Add the completed range filter to the request body.
    //     finalRequestBody[column] = rangeFilter;
    //   }
    // });

    // Return the final, correctly formatted object.
    return finalRequestBody;
  };

  const generateSelectedMonths = () => {
    return appliedMonths;
  }

  const generateGroupBy = () => {
    return groupByColumns
  }
  

  const setupColumnGroups = (metadata: ForecastMetadata) => {
    // Add trigger_qty and max_qty as client-side columns (not from database)
    // const clientSideColumns = ['trigger_qty', 'max_qty'];
    
    // Don't exclude card attributes - keep them in regular columns too
    const groups: ColumnGroup[] = [
      // {
      //   name: "Store Parameters",
      //   columns: metadata.store_attributes,
      //   color: "bg-blue-500/10 border-blue-500/30",
      //   expanded: true
      // },
      // {
      //   name: "Product Parameters", 
      //   columns: metadata.product_attributes,
      //   color: "bg-green-500/10 border-green-500/30",
      //   expanded: true
      // },
      {
        name: "Forecast Parameters",
        columns: monthWiseColumns,
        color: "bg-purple-500/10 border-purple-500/30",
        expanded: true
      }
    ];
    
    setColumnGroups(groups);
    
    // Initialize column visibility settings - all columns visible by default
    const initialVisibility: { [key: string]: boolean } = {};
    
    // metadata.essential_columns.forEach(col => {
    //   initialVisibility[col] = true;
    // });
    // // Add client-side columns to visibility settings
    // clientSideColumns.forEach(col => {
    //   initialVisibility[col] = true;
    // });

    // Set the initial visbility for the new month wise groups
    monthWiseColumns.forEach(col => {
      initialVisibility[col] = true;
    })
    
    setVisibleColumnSettings(initialVisibility);

  };

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      setPage(0); // Reset page for new filters
      setData([]); // Clear previous data
      setHasMore(true); // Assume there is more data to load
      
      /* --------- API CALL ------- */
      const stateSettersNew = {
        setLoading: (loading: boolean) => setLoading(loading),
        setError: (error: string | null) => setError(error),
        setData: (response: any) => {
          if (response && response.data) {
            // Apply random generation for trigger_qty and max_qty
            const enhancedData = response.data;
            setData(enhancedData);
            setHasMore(response.data.length === 100);
            setPage(1);
          }
        }
      }

      const requestBody = {limit: 100, offset: 0, filters: generateFiltersForAPI(), group_by: generateGroupBy(), selected_months: generateSelectedMonths()}
      await forecastRepository.makeAPICall(requestBody, stateSettersNew, "month-on-month-comparison");



    } catch (err) {
      console.error('Error loading initial data:', err);
      setError('Failed to load data');
    }
  };

  const loadMoreData = useCallback(async () => {
    if (loading || !hasMore) {
      return;
    }
    
    setLoading(true);
    
    try {
      const offset = page * 100;

      // let sqlQuery = `
      //   SELECT 
      //     store_no,
      //     MAX(city) as city,
      //     MAX(state) as state,
      //     MAX(region) as region,
      //     MAX(store_type) as store_type,
      //     MAX(channel) as channel,
      //     article_id,
      //     MAX(article_description) as article_description,
      //     MAX(brand) as brand,
      //     MAX(super_category) as super_category,
      //     MAX(segment) as segment,
      //     MAX(division) as division,
      //     MAX(vertical) as vertical,
      //     ARRAY_AGG(
      //       JSON_BUILD_OBJECT(
      //         'month_year', month_year,
      //         'week_start_date', week_start_date,
      //         'forecast_qty', forecast_qty,
      //         'sold_qty', sold_qty
      //       ) ORDER BY month_year
      //     ) as months
      //   FROM forecast 
      //   WHERE 1=1
      // `;
      
      // // Add search conditions
      // const searchConditions = Object.entries(activeSearches)
      //   .filter(([_, value]) => value.trim() !== '')
      //   .map(([column, value]) => `${column} ILIKE '%${value}%'`);

      // // Add unified search conditions (searches across multiple columns)
      // if (activeUnifiedSearch.trim() !== '') {
      //   // Split by semicolon and trim each term
      //   const searchTerms = activeUnifiedSearch.split(';')
      //     .map(term => term.trim())
      //     .filter(term => term !== '');
        
      //   if (searchTerms.length > 0) {
      //     // Create AND conditions for each search term
      //     const unifiedConditions = searchTerms.map(term => `(
      //       store_no ILIKE '%${term}%' OR 
      //       city ILIKE '%${term}%' OR 
      //       state ILIKE '%${term}%' OR 
      //       region ILIKE '%${term}%' OR 
      //       article_id ILIKE '%${term}%' OR 
      //       article_description ILIKE '%${term}%' OR 
      //       brand ILIKE '%${term}%' OR 
      //       segment ILIKE '%${term}%' OR 
      //       division ILIKE '%${term}%' OR 
      //       vertical ILIKE '%${term}%' OR 
      //       channel ILIKE '%${term}%'
      //     )`);
          
      //     // Join multiple terms with AND
      //     const combinedUnifiedCondition = `(${unifiedConditions.join(' AND ')})`;
      //     searchConditions.push(combinedUnifiedCondition);
      //   }
      // }

      // if (searchConditions.length > 0) {
      //   sqlQuery += ` AND ${searchConditions.join(' AND ')}`;
      // }
      
      // sqlQuery += ` GROUP BY store_no, article_id ORDER BY store_no, article_id LIMIT 50 OFFSET ${offset}`;
      
      // const stateSetters = {
      //   setLoading: () => {},
      //   setError: (error: string | null) => setError(error),
      //   setData: (response: any) => {
      //     if (response && response.data) {
      //       // Process the grouped data
      //       const processedData = response.data.map((record: any) => ({
      //         ...record,
      //         months: record.months.map((monthData: any) => parseMonthData(monthData))
      //       }));
      //       setData(prevData => [...prevData, ...processedData]);
      //       setHasMore(response.data.length === 50);
      //       setPage(prevPage => prevPage + 1);
      //     } else {
      //       setHasMore(false);
      //     }
      //   }
      // };

      const filterBody = generateFiltersForAPI();
      const requestBody = {
        limit: 100,
        offset: offset,
        filters: filterBody,
        group_by: generateGroupBy(),
        selected_months: generateSelectedMonths(),
      };
      debugggg(hasMore);
      debugggg(requestBody);
      
      const stateSettersNew = {
        setLoading: (loading: boolean) => setLoading(loading),
        setError: (error: string | null) => setError(error),
        setData: (response: any) => {
          debugggg(`${Object.keys(requestBody)} - ${Object.keys(response)}`)
          if (response && response.data) {
            // Apply random generation for trigger_qty and max_qty
            const enhancedData = response.data
            setData(prevData => [...prevData, ...enhancedData]);
            setHasMore(response.data.length === 100);
            setPage(prevPage => prevPage + 1);
          }
        }
      }
      
      await forecastRepository.makeAPICall(requestBody, stateSettersNew, "month-on-month-comparison");

    } catch (err) {
      console.error('Error loading more data:', err);
      setError('Failed to load more data');
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, forecastRepository, activeSearches, activeUnifiedSearch]);

  // Set up infinite scroll
  useEffect(() => {
    const container = tableContainerRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      if (loading || !hasMore) return;
      
      const { scrollTop, scrollHeight, clientHeight } = container;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
      
      if (scrollPercentage > 0.8) {
        loadMoreData();
      }
    };
    
    let timeoutId: NodeJS.Timeout;
    const debouncedHandleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 100);
    };
    
    container.addEventListener('scroll', debouncedHandleScroll);
    
    return () => {
      container.removeEventListener('scroll', debouncedHandleScroll);
      clearTimeout(timeoutId);
    };
  }, [loading, hasMore, loadMoreData]);

  // Handle search functionality
  const handleSearchChange = (column: string, value: string) => {
    setSearchValues(prev => ({
      ...prev,
      [column]: value
    }));
  };

  const handleSearchExecute = (column: string) => {
    const searchValue = searchValues[column]?.trim();
    
    if (searchValue) {
      setActiveSearches(prev => ({
        ...prev,
        [column]: searchValue
      }));
    } else {
      setActiveSearches(prev => {
        const newActive = { ...prev };
        delete newActive[column];
        return newActive;
      });
    }
  };

  const handleClearSearch = (column: string) => {
    setSearchValues(prev => ({
      ...prev,
      [column]: ''
    }));
    setActiveSearches(prev => {
      const newActive = { ...prev };
      delete newActive[column];
      return newActive;
    });
  };

  const handleSearchKeyPress = (column: string, event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearchExecute(column);
    }
  };

  // Handle unified search input change
  const handleUnifiedSearchChange = (value: string) => {
    setUnifiedSearchValue(value);
  };

  // Handle unified search execution (on Enter or button click)
  const handleUnifiedSearchExecute = () => {
    const searchValue = unifiedSearchValue.trim();
    setActiveUnifiedSearch(searchValue);
  };

  // Handle clearing unified search
  const handleClearUnifiedSearch = () => {
    setUnifiedSearchValue('');
    setActiveUnifiedSearch('');
  };

  // Handle unified search input key press
  const handleUnifiedSearchKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleUnifiedSearchExecute();
    }
  };

  const formatCellValue = (value: any) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'number') {
      return Math.ceil(value).toLocaleString();
    }
    return String(value);
  };

  const handleGroupByClick = () => {
    setShowGroupByModal(true);
  };
  
  const handleGroupByCancel = () => {
    setShowGroupByModal(false);
    setSelectedGroupByColumns([]);
  };
  
  const handleGroupBySubmit = () => {
    setGroupByColumns([...selectedGroupByColumns]);
    setIsGroupByMode(selectedGroupByColumns.length > 0);
    setShowGroupByModal(false);
    setSelectedGroupByColumns([]);
  };
  
  const handleGroupByColumnToggle = (column: string) => {
    setSelectedGroupByColumns(prev => 
      prev.includes(column) 
        ? prev.filter(col => col !== column)
        : [...prev, column]
    );
  };
  
  const clearGroupBy = () => {
    setIsGroupByMode(false);
    setGroupByColumns([]);
  };
  
  // Get available columns for group by (string type only)
  const getGroupByColumns = () => {
    if (!metadata) return [];
    return metadata.essential_columns.filter(col => 
      metadata.essential_columns_datatypes[col] === 'string'
    );
  };

  // Month Selector Modal options -----------
  const handleMonthSelectClick = () => {
    setSelectedMonth([...appliedMonths]);
    setShowMonthSelectModal(true);
  };

  const handleMonthSelectCancel = () => {
    setShowMonthSelectModal(false);
    // Resetting here means selections are lost on cancel, which is a valid choice.
    setSelectedMonth([]);
  };
  
  const handleMonthSelectSubmit = () => {
    // Apply the selection from the modal's state to the main `appliedMonths` state.
    // This will trigger the `useEffect` to refetch data.
    setAppliedMonths([...selectedMonth]);
    setIsMonthSelectMode(selectedMonth.length > 0);
    setShowMonthSelectModal(false);
  };
  
  const handleMonthSelectColumnToggle = (column: string) => {
    // This only updates the temporary state for the modal.
    setSelectedMonth(prev => 
      prev.includes(column) 
        ? prev.filter(col => col !== column)
        : [...prev, column]
    );
  };
  
  const clearMonthSelct = () => {
    setIsMonthSelectMode(false);
    setSelectedMonth([]);
    // Clearing `appliedMonths` will trigger the `useEffect` to refetch data.
    setAppliedMonths([]);
  };


    // Column selector functions
  const handleColumnSelectorCancel = () => {
    setShowColumnSelector(false);
  };
  
  const handleColumnToggle = (column: string) => {
    setVisibleColumnSettings(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };
  
  const getAvailableColumns = () => {
    // if (!metadata) return { regularColumns: [], aggregatedColumns: [] };
    
    const regularColumns = monthWiseColumns;
    const aggregatedColumns: string[] = [];
    
    // // If in group by mode, also include aggregated columns that would be generated
    // if (isGroupByMode && groupByColumns.length > 0) {
    //   metadata.essential_columns.forEach(col => {
    //     if (!groupByColumns.includes(col)) {
    //       const dataType = metadata.essential_columns_datatypes[col];
    //       if (dataType === 'string') {
    //         aggregatedColumns.push(`#${col}`);
    //       } else if (dataType === 'float' || dataType === 'integer') {
    //         aggregatedColumns.push(`Σ${col}`);
    //       }
    //     }
    //   });
    // }
    
    return { regularColumns, aggregatedColumns };
  };
  
  const selectAllColumns = () => {
    const { regularColumns, aggregatedColumns } = getAvailableColumns();
    const newSettings: { [key: string]: boolean } = {};
    
    regularColumns.forEach(col => {
      newSettings[col] = true;
    });
    
    setVisibleColumnSettings(prev => ({ ...prev, ...newSettings }));
  };
  
  const deselectAllColumns = () => {
    const { regularColumns, aggregatedColumns } = getAvailableColumns();
    const newSettings: { [key: string]: boolean } = {};
    
    regularColumns.forEach(col => {
      newSettings[col] = false;
    });
    
    setVisibleColumnSettings(prev => ({ ...prev, ...newSettings }));
  };

    // Load filter data based on column type
  const loadFilterData = async (column: string) => {
    if (!metadata) return;
    
    const filterType = metadata.essential_columns_filtertypes[column];
    
    if (filterType === 'discrete') {
      await loadDiscreteOptions(column, 0, true);
    } else if (filterType === 'range') {
      await loadRangeValues(column);
    }
  };
  
  // Load discrete filter options with pagination
  const loadDiscreteOptions = async (column: string, page: number = 0, reset: boolean = false) => {
    try {
      if (reset) {
        setDiscreteFilters(prev => ({
          ...prev,
          [column]: {
            selectedValues: [],
            availableOptions: [],
            loading: true,
            hasMore: true,
            page: 0,
            searchTerm: ''
          }
        }));
      } else {
        setDiscreteFilters(prev => ({
          ...prev,
          [column]: {
            ...prev[column],
            loading: true
          }
        }));
      }
      
      const stateSetters = {
        setLoading: () => {},
        setError: (error: string | null) => setError(error),
        setData: (response: any) => {
          if (response && response.filters) {
            const options: FilterOption[] = response.filters.map((row: any) => ({
              value: row[0],
              count: row[1]
            }));
            
            setDiscreteFilters(prev => ({
              ...prev,
              [column]: {
                ...prev[column],
                availableOptions: reset ? options : [...(prev[column]?.availableOptions || []), ...options],
                loading: false,
                hasMore: options.length === 100,
                page: page,
                searchTerm: prev[column]?.searchTerm || ''
              }
            }));
          }
        }
      };
      
      // await forecastRepository.executeSqlQuery({ sql_query: sqlQuery }, stateSetters);
      await forecastRepository.getMetadataFromAPI({filter_name: column}, stateSetters, "get-filters");

    } catch (err) {
      console.error(`Error loading discrete options for ${column}:`, err);
      setDiscreteFilters(prev => ({
        ...prev,
        [column]: {
          ...prev[column],
          loading: false
        }
      }));
    }
  };
  
  // Load range values (min/max) for numeric columns
  const loadRangeValues = async (column: string) => {
    try {
      
      const stateSetters = {
        setLoading: () => {},
        setError: (error: string | null) => setError(error),
        setData: (response: any) => {
          if (response && response.data && response.data[0]) {
            const { min_value, max_value } = response.data[0];
            setFilterRanges(prev => ({
              ...prev,
              [column]: {
                min: parseFloat(min_value) || 0,
                max: parseFloat(max_value) || 0
              }
            }));
            
            // Initialize range filter if not exists
            setRangeFilters(prev => ({
              ...prev,
              [column]: prev[column] || { min: null, max: null }
            }));
          }
        }
      };
      
      await forecastRepository.getMetadataFromAPI({filter_name: column}, stateSetters, "get-filters");

    } catch (err) {
      console.error(`Error loading range values for ${column}:`, err);
    }
  };
  
  // Handle discrete filter selection
  const handleDiscreteFilterChange = (column: string, value: string, checked: boolean) => {
    setDiscreteFilters(prev => {
      const currentFilter = prev[column] || { selectedValues: [], availableOptions: [], loading: false, hasMore: false, page: 0, searchTerm: '' };
      const newSelectedValues = checked 
        ? [...currentFilter.selectedValues, value]
        : currentFilter.selectedValues.filter(v => v !== value);
      
      return {
        ...prev,
        [column]: {
          ...currentFilter,
          selectedValues: newSelectedValues
        }
      };
    });
  };
  
  // Handle range filter change
  const handleRangeFilterChange = (column: string, type: 'min' | 'max', value: number | null) => {
    setRangeFilters(prev => ({
      ...prev,
      [column]: {
        ...prev[column],
        [type]: value
      }
    }));
  };
  
  // Handle search filter change
  const handleSearchFilterChange = (column: string, value: string) => {
    setSearchFilters(prev => ({
      ...prev,
      [column]: { value }
    }));
  };
  
  const handleDiscreteFilterSearch = (column: string, searchTerm: string) => {
    setDiscreteFilters(prev => ({
      ...prev,
      [column]: {
        ...prev[column],
        searchTerm
      }
    }));
  };
  
  // Apply filters and update applied filters list
  const applyFilters = () => {
    const newAppliedFilters: AppliedFilter[] = [];
    
    // Process discrete filters
    Object.entries(discreteFilters).forEach(([column, filter]) => {
      if (filter.selectedValues.length > 0) {
        const displayValue = filter.selectedValues.length === 1 
          ? filter.selectedValues[0]
          : `${filter.selectedValues.length} selected`;
        const sqlCondition = `${column} IN (${filter.selectedValues.map(v => `'${v}'`).join(', ')})`;
        
        newAppliedFilters.push({
          column,
          type: 'discrete',
          displayValue,
          sqlCondition
        });
      }
    });
    
    // Process range filters
    Object.entries(rangeFilters).forEach(([column, filter]) => {
      if (filter.min !== null || filter.max !== null) {
        let displayValue = '';
        let sqlCondition = '';
        
        if (filter.min !== null && filter.max !== null) {
          displayValue = `${filter.min} - ${filter.max}`;
          sqlCondition = `${column} >= ${filter.min} AND ${column} <= ${filter.max}`;
        } else if (filter.min !== null) {
          displayValue = `≥ ${filter.min}`;
          sqlCondition = `${column} >= ${filter.min}`;
        } else if (filter.max !== null) {
          displayValue = `≤ ${filter.max}`;
          sqlCondition = `${column} <= ${filter.max}`;
        }
        
        if (sqlCondition) {
          newAppliedFilters.push({
            column,
            type: 'range',
            displayValue,
            sqlCondition
          });
        }
      }
    });
    
    // Process search filters
    Object.entries(searchFilters).forEach(([column, filter]) => {
      if (filter.value.trim()) {
        const displayValue = `"${filter.value}"`;
        const sqlCondition = `${column} ILIKE '%${filter.value}%'`;
        
        newAppliedFilters.push({
          column,
          type: 'search',
          displayValue,
          sqlCondition
        });
      }
    });
    
    setAppliedFilters(newAppliedFilters);
    
    // Data will reload via the useEffect hook triggered by state changes.
  };
  
  // Remove a specific applied filter
  const removeFilter = (filterToRemove: AppliedFilter) => {
    const { column, type } = filterToRemove;
    
    if (type === 'discrete') {
      setDiscreteFilters(prev => ({
        ...prev,
        [column]: {
          ...prev[column],
          selectedValues: []
        }
      }));
    } else if (type === 'range') {
      setRangeFilters(prev => ({
        ...prev,
        [column]: { min: null, max: null }
      }));
    } else if (type === 'search') {
      setSearchFilters(prev => ({
        ...prev,
        [column]: { value: '' }
      }));
    }
    
    // Remove from applied filters and reload
    const newAppliedFilters = appliedFilters.filter(f => 
      !(f.column === column && f.type === type)
    );
    setAppliedFilters(newAppliedFilters);
    
    // Data will reload via the useEffect hook.
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    setDiscreteFilters({});
    setRangeFilters({});
    setSearchFilters({});
    setAppliedFilters([]);
    
    // Data will reload via the useEffect hook.
  };
  
  // Get columns grouped by parameter type for filter UI
  const getFilterColumnGroups = () => {
    if (!metadata) return { storeColumns: [], productColumns: [], forecastColumns: [] };
    
    const storeColumns = metadata.essential_columns.filter(col => 
      metadata.store_attributes.includes(col)
    );
    
    const productColumns = metadata.essential_columns.filter(col => 
      metadata.product_attributes.includes(col)
    );
    
    const forecastColumns = metadata.essential_columns.filter(col => 
      !metadata.store_attributes.includes(col) && 
      !metadata.product_attributes.includes(col)
    );
    
    return { storeColumns, productColumns, forecastColumns };
  };
  
  // Load more discrete options for infinite scroll in filter dropdowns
  const loadMoreDiscreteOptions = (column: string) => {
    const currentFilter = discreteFilters[column];
    if (currentFilter && currentFilter.hasMore && !currentFilter.loading) {
      loadDiscreteOptions(column, currentFilter.page + 1, false);
    }
  };


  const loadWeekStartDates = async () => {
    try {
      setLoadingWeekDates(true);
      const sqlQuery = `SELECT DISTINCT week_start_date FROM forecast ORDER BY week_start_date ASC`;
      
      const stateSetters = {
        setLoading: () => {},
        setError: (error: string | null) => setError(error),
        setData: (response: any) => {
          if (response && response.data) {
            const dates = response.data.map((row: any) => row.week_start_date).filter(Boolean);
            
            setWeekStartDates(dates);
            // Set the earliest date as default
            if (dates.length > 0 && !selectedWeekStartDate) {
              setLocalSelectedWeekStartDate(dates[0]);
            }
          }
        }
      };

      await forecastRepository.executeSqlQuery({ sql_query: sqlQuery }, stateSetters);
    } catch (err) {
      console.error('Error loading week start dates:', err);
      setError('Failed to load week start dates');
    } finally {
      setLoadingWeekDates(false);
    }
  };

  const loadMetadata = async () => {
    try {
      setMetadataLoading(true);
      const stateSetters = {
        setLoading: (loading: boolean) => setLoading(loading),
        setError: (error: string | null) => setError(error),
        setData: (data: ForecastMetadata) => {
          setMetadata(data);
          setupColumnGroups(data)
        },
      };

      await forecastRepository.getMetadataFromAPI({}, stateSetters);
    } catch (err) {
      console.error("Error loading metadata:", err);
      setError("Failed to load metadata");
    } finally {
      setMetadataLoading(false);
    }
  };

  const handleWeekStartDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newDate = event.target.value;
    setLocalSelectedWeekStartDate(newDate);
  };
  

  if (metadataLoading || (loading && data.length === 0)) {
    return (
      <div className="flex flex-col h-full bg-[hsl(var(--dark-9))] text-[hsl(var(--panel-foreground))]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--panel-border))]">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="text-[hsl(var(--primary))]" size={20} />
              <h1 className="text-lg font-semibold">Month-on-Month Comparison</h1>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-[hsl(var(--panel-muted-foreground))]">
            <Calendar size={14} className="text-[hsl(var(--table-muted-foreground))] mr-2" />
            <select
                value={selectedWeekStartDate}
                onChange={handleWeekStartDateChange}
                disabled={loadingWeekDates || isWeekStartDateControlled}
                className={`px-3 py-1 rounded text-xs border focus:outline-none ${
                  isWeekStartDateControlled 
                    ? 'bg-[hsl(var(--table-input-background))] text-[hsl(var(--table-muted-foreground))] border-[hsl(var(--table-border))] cursor-not-allowed' 
                    : 'bg-[hsl(var(--table-input-background))] text-[hsl(var(--table-foreground))] border-[hsl(var(--table-input-border))] hover:border-[hsl(var(--table-border-strong))] focus:border-[hsl(var(--primary))]'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loadingWeekDates ? (
                  <option value="">Loading dates...</option>
                ) : (
                  <>
                    {weekStartDates.length === 0 && (
                      <option value="">No dates available</option>
                    )}
                    {selectedWeekStartDate && !weekStartDates.includes(selectedWeekStartDate) && (
                      <option value={selectedWeekStartDate}>
                        {new Date(selectedWeekStartDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </option>
                    )}
                    {weekStartDates.map((date) => (
                      <option key={date} value={date}>
                        {new Date(date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </option>
                    ))}
                  </>
                )}
              </select>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center">
            <Loader2 className="animate-spin text-[hsl(var(--primary))] mr-2" size={24} />
            <span className="text-[hsl(var(--panel-foreground))]">Loading forecast data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full bg-[hsl(var(--dark-9))] text-[hsl(var(--panel-foreground))]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--panel-border))]">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="text-[hsl(var(--primary))]" size={20} />
              <h1 className="text-lg font-semibold">Month-on-Month Comparison</h1>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-[hsl(var(--panel-muted-foreground))]">
            <Calendar size={16} />
            <span className="text-sm">Forecast Variants by Month</span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center">
            <AlertCircle className="text-[hsl(var(--panel-error))] mr-2" size={24} />
            <span className="text-[hsl(var(--panel-error))]">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[hsl(var(--dark-9))] text-[hsl(var(--panel-foreground))]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--panel-border))]">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <TrendingUp className="text-[hsl(var(--primary))]" size={20} />
            <h1 className="text-lg font-semibold">Month-on-Month Comparison</h1>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-[hsl(var(--panel-muted-foreground))]">
          {/* Month Selector Button */}
            <button
              onClick={handleMonthSelectClick}
              className={`px-3 py-1 rounded text-xs flex items-center space-x-1 transition-colors ${
                isMonthSelectMode 
                  ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))]/90' 
                  : 'bg-[hsl(var(--table-button-background))] text-[hsl(var(--table-foreground))] border border-[hsl(var(--table-border))] hover:bg-[hsl(var(--table-button-hover))]'
              }`}
            >
              <Calendar size={14} />
              <span>Select Month</span>
              {isMonthSelectMode && appliedMonths.length > 0 && (
                <span className="bg-[hsl(var(--primary))]/30 px-1 rounded text-xs">
                  {appliedMonths.length}
                </span>
              )}
            </button>

            {isMonthSelectMode && (
              <button
                onClick={clearMonthSelct}
                className="px-2 py-1 rounded text-xs bg-[hsl(var(--table-button-background))] text-[hsl(var(--table-foreground))] hover:bg-[hsl(var(--table-button-hover))] flex items-center transition-colors border border-[hsl(var(--table-border))]"
                title="Clear Group By"
              >
                <X size={12} />
              </button>
            )}


            {/* Group By Button */}
            <button
              onClick={handleGroupByClick}
              className={`px-3 py-1 rounded text-xs flex items-center space-x-1 transition-colors ${
                isGroupByMode 
                  ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))]/90' 
                  : 'bg-[hsl(var(--table-button-background))] text-[hsl(var(--table-foreground))] border border-[hsl(var(--table-border))] hover:bg-[hsl(var(--table-button-hover))]'
              }`}
            >
              <Group size={14} />
              <span>Group By</span>
              {isGroupByMode && groupByColumns.length > 0 && (
                <span className="bg-[hsl(var(--primary))]/30 px-1 rounded text-xs">
                  {groupByColumns.length}
                </span>
              )}
            </button>

            {/* Clear Group By Button */}
            {isGroupByMode && (
              <button
                onClick={clearGroupBy}
                className="px-2 py-1 rounded text-xs bg-[hsl(var(--table-button-background))] text-[hsl(var(--table-foreground))] hover:bg-[hsl(var(--table-button-hover))] flex items-center transition-colors border border-[hsl(var(--table-border))]"
                title="Clear Group By"
              >
                <X size={12} />
              </button>
            )}

            {/* Column Selector Button */}
            <button
              onClick={() => setShowColumnSelector(true)}
              className="px-3 py-1 rounded text-xs flex items-center space-x-1 transition-colors bg-[hsl(var(--table-button-background))] text-[hsl(var(--table-foreground))] border border-[hsl(var(--table-border))] hover:bg-[hsl(var(--table-button-hover))]"
            >
              <span>☰</span>
              <span>Columns</span>
            </button>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-1 rounded text-xs flex items-center space-x-1 transition-colors ${
                showFilters || appliedFilters.length > 0
                  ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))]/90' 
                  : 'bg-[hsl(var(--table-button-background))] text-[hsl(var(--table-foreground))] border border-[hsl(var(--table-border))] hover:bg-[hsl(var(--table-button-hover))]'
              }`}
            >
              <Filter size={14} />
              <span>Filters</span>
              {appliedFilters.length > 0 && (
                <span className="bg-[hsl(var(--primary))]/30 px-1 rounded text-xs">
                  {appliedFilters.length}
                </span>
              )}
            </button>

        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3 border-b border-[hsl(var(--panel-border))] bg-[hsl(var(--panel-header-background))]">
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[hsl(var(--panel-muted-foreground))]" />
              <input
                type="text"
                placeholder="Search across store, product, brand, category, channel... (use ; for AND search)"
                value={unifiedSearchValue}
                onChange={(e) => handleUnifiedSearchChange(e.target.value)}
                onKeyPress={handleUnifiedSearchKeyPress}
                className="w-full pl-10 pr-10 py-2 text-sm bg-[hsl(var(--panel-input-background))] border border-[hsl(var(--panel-input-border))] rounded text-[hsl(var(--panel-foreground))] placeholder-[hsl(var(--panel-muted-foreground))] focus:outline-none focus:border-[hsl(var(--primary))] focus:bg-[hsl(var(--panel-background))]"
              />
              {(unifiedSearchValue || activeUnifiedSearch) && (
                <button
                  onClick={handleClearUnifiedSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[hsl(var(--panel-muted-foreground))] hover:text-[hsl(var(--panel-error))] transition-colors"
                  title="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
          <button
            onClick={handleUnifiedSearchExecute}
            disabled={!unifiedSearchValue.trim()}
            className="px-4 py-2 text-sm bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded hover:bg-[hsl(var(--primary))]/90 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Search size={16} />
            <span>Search</span>
          </button>
          {activeUnifiedSearch && (
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-[hsl(var(--panel-muted-foreground))]">Filtering by:</span>
              {activeUnifiedSearch.includes(';') ? (
                <div className="flex flex-wrap gap-1">
                  {activeUnifiedSearch.split(';').map(term => term.trim()).filter(term => term !== '').map((term, index) => (
                    <span key={index} className="px-2 py-1 bg-[hsl(var(--primary))]/20 text-[hsl(var(--primary))] rounded border border-[hsl(var(--primary))]/30 text-xs">
                      "{term}"
                    </span>
                  ))}
                  <span className="text-xs text-[hsl(var(--panel-muted-foreground))] self-center">AND</span>
                </div>
              ) : (
                <span className="px-2 py-1 bg-[hsl(var(--primary))]/20 text-[hsl(var(--primary))] rounded border border-[hsl(var(--primary))]/30">
                  "{activeUnifiedSearch}"
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Month Selector Modal */}
      {showMonthSelectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[hsl(var(--panel-background))] border border-[hsl(var(--panel-border))] rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[hsl(var(--panel-foreground))] font-semibold text-lg">Select Months</h3>
              <button
                onClick={handleMonthSelectCancel}
                className="text-[hsl(var(--panel-muted-foreground))] hover:text-[hsl(var(--panel-foreground))]"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-[hsl(var(--panel-muted-foreground))] text-sm mb-3">
                Select Months to find the analysis
              </p>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {months.map((column) => (
                  <label
                    key={column}
                    className="flex items-center space-x-2 text-sm hover:bg-[hsl(var(--panel-hover))] p-2 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedMonth.includes(column)}
                      onChange={() => handleMonthSelectColumnToggle(column)}
                      className="rounded border-[hsl(var(--panel-input-border))] text-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))] focus:ring-1"
                    />
                    <span className="text-[hsl(var(--panel-foreground))]">
                      {column.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </label>
                ))}

                {months.length === 0 && <div className="text-[hsl(var(--panel-muted-foreground))] text-sm text-center py-4">
                  Loading Months....
                </div>}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-xs text-[hsl(var(--panel-muted-foreground))]">
                {selectedMonth.length} column{selectedMonth.length !== 1 ? 's' : ''} selected
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleMonthSelectCancel}
                  className="px-3 py-2 text-sm bg-[hsl(var(--panel-button-background))] text-[hsl(var(--panel-foreground))] rounded hover:bg-[hsl(var(--panel-button-hover))]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMonthSelectSubmit}
                  disabled={selectedMonth.length === 0}
                  className="px-3 py-2 text-sm bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded hover:bg-[hsl(var(--primary))]/80 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Show Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Group By Modal */}
      {showGroupByModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[hsl(var(--panel-background))] border border-[hsl(var(--panel-border))] rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[hsl(var(--panel-foreground))] font-semibold text-lg">Group By Columns</h3>
              <button
                onClick={handleGroupByCancel}
                className="text-[hsl(var(--panel-muted-foreground))] hover:text-[hsl(var(--panel-foreground))]"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-[hsl(var(--panel-muted-foreground))] text-sm mb-3">
                Select columns to group by. Only string columns are available for grouping.
              </p>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {getGroupByColumns().map((column) => (
                  <label
                    key={column}
                    className="flex items-center space-x-2 text-sm hover:bg-[hsl(var(--panel-hover))] p-2 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedGroupByColumns.includes(column)}
                      onChange={() => handleGroupByColumnToggle(column)}
                      className="rounded border-[hsl(var(--panel-input-border))] text-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))] focus:ring-1"
                    />
                    <span className="text-[hsl(var(--panel-foreground))]">
                      {column.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </label>
                ))}
              </div>
              
              {getGroupByColumns().length === 0 && (
                <div className="text-[hsl(var(--panel-muted-foreground))] text-sm text-center py-4">
                  No string columns available for grouping
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-xs text-[hsl(var(--panel-muted-foreground))]">
                {selectedGroupByColumns.length} column{selectedGroupByColumns.length !== 1 ? 's' : ''} selected
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleGroupByCancel}
                  className="px-3 py-2 text-sm bg-[hsl(var(--panel-button-background))] text-[hsl(var(--panel-foreground))] rounded hover:bg-[hsl(var(--panel-button-hover))]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGroupBySubmit}
                  disabled={selectedGroupByColumns.length === 0}
                  className="px-3 py-2 text-sm bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded hover:bg-[hsl(var(--primary))]/80 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply Group By
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Column Selector Modal */}
      {showColumnSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[hsl(var(--panel-background))] border border-[hsl(var(--panel-border))] rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[hsl(var(--panel-foreground))] font-semibold text-lg">Column Visibility</h3>
              <button
                onClick={handleColumnSelectorCancel}
                className="text-[hsl(var(--panel-muted-foreground))] hover:text-[hsl(var(--panel-foreground))]"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-3">
                <button
                  onClick={selectAllColumns}
                  className="px-3 py-1 text-xs bg-[hsl(var(--panel-success))] text-[hsl(var(--panel-foreground))] rounded hover:bg-[hsl(var(--panel-success))]/80"
                >
                  Select All
                </button>
                <button
                  onClick={deselectAllColumns}
                  className="px-3 py-1 text-xs bg-[hsl(var(--panel-error))] text-[hsl(var(--panel-foreground))] rounded hover:bg-[hsl(var(--panel-error))]/80"
                >
                  Deselect All
                </button>
              </div>
              
              {/* Regular Columns */}
              <div className="mb-6">
                <h4 className="text-[hsl(var(--panel-foreground))] font-medium text-sm mb-3">Data Columns</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Store Parameters */}
                  {/* <div>
                    <h5 className="text-[hsl(var(--table-card-store-border))] font-medium text-xs mb-2 flex items-center">
                      <div className="w-2 h-2 bg-[hsl(var(--table-card-store-border))] rounded mr-1"></div>
                      Store Parameters
                    </h5>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {metadata?.store_attributes.map((column) => (
                        <label
                          key={column}
                          className="flex items-center space-x-2 text-xs hover:bg-[hsl(var(--panel-hover))] p-1 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={visibleColumnSettings[column] !== false}
                            onChange={() => handleColumnToggle(column)}
                            className="rounded border-[hsl(var(--panel-input-border))] text-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))] focus:ring-1"
                          />
                          <span className="text-[hsl(var(--panel-foreground))] flex-1 truncate" title={column}>
                            {column.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div> */}
                  
                  {/* Product Parameters */}
                  {/* <div>
                    <h5 className="text-[hsl(var(--table-card-product-border))] font-medium text-xs mb-2 flex items-center">
                      <div className="w-2 h-2 bg-[hsl(var(--table-card-product-border))] rounded mr-1"></div>
                      Product Parameters
                    </h5>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {metadata?.product_attributes.map((column) => (
                        <label
                          key={column}
                          className="flex items-center space-x-2 text-xs hover:bg-[hsl(var(--panel-hover))] p-1 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={visibleColumnSettings[column] !== false}
                            onChange={() => handleColumnToggle(column)}
                            className="rounded border-[hsl(var(--panel-input-border))] text-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))] focus:ring-1"
                          />
                          <span className="text-[hsl(var(--panel-foreground))] flex-1 truncate" title={column}>
                            {column.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div> */}
                  
                  {/* Forecast Parameters */}
                  <div className='col-span-1 md:col-span-2 lg:col-span-3'>
                    <h5 className="text-[hsl(var(--table-card-forecast-border))] font-medium text-xs mb-2 flex items-center">
                      <div className="h-2 bg-[hsl(var(--table-card-forecast-border))] rounded mr-1"></div>
                      Forecast Parameters
                    </h5>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {/* {metadata?.essential_columns
                        .filter(col => 
                          !metadata.store_attributes.includes(col) && 
                          !metadata.product_attributes.includes(col)
                        )
                        .map((column) => (
                          <label
                            key={column}
                            className="flex items-center space-x-2 text-xs hover:bg-[hsl(var(--panel-hover))] p-1 rounded cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={visibleColumnSettings[column] !== false}
                              onChange={() => handleColumnToggle(column)}
                              className="rounded border-[hsl(var(--panel-input-border))] text-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))] focus:ring-1"
                            />
                            <span className="text-[hsl(var(--panel-foreground))] flex-1 truncate" title={column}>
                              {column.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          </label>
                        ))} */}

                        {monthWiseColumns.map((column) => (
                          <label
                            key={column}
                            className="flex items-center space-x-2 text-xs hover:bg-[hsl(var(--panel-hover))] p-1 rounded cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={visibleColumnSettings[column] !== false}
                              onChange={() => handleColumnToggle(column)}
                              className="rounded border-[hsl(var(--panel-input-border))] text-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))] focus:ring-1"
                            />
                            <span className="text-[hsl(var(--panel-foreground))] flex-1 truncate" title={column}>
                              {column.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          </label>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between border-t border-[hsl(var(--panel-border))] pt-4">
              {/* <div className="text-xs text-[hsl(var(--panel-muted-foreground))]">
                {Object.values(visibleColumnSettings).filter(Boolean).length} of {metadata?.essential_columns.length || 0} columns visible
              </div> */}
              <div className="flex space-x-2">
                <button
                  onClick={handleColumnSelectorCancel}
                  className="px-3 py-2 text-sm bg-[hsl(var(--panel-button-background))] text-[hsl(var(--panel-foreground))] rounded hover:bg-[hsl(var(--panel-button-hover))]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Applied Filters Bar - Always Visible */}
            {appliedFilters.length > 0 && (
              <div className="px-4 py-2 border-b border-[hsl(var(--table-border))] bg-[hsl(var(--table-header-background))]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 flex-wrap">
                    <span className="text-xs text-[hsl(var(--table-muted-foreground))] flex-shrink-0">Applied Filters:</span>
                    {appliedFilters.map((filter, index) => (
                      <div
                        key={`${filter.column}-${filter.type}-${index}`}
                        className="flex items-center space-x-1 bg-[hsl(var(--primary))]/20 text-[hsl(var(--primary))] px-2 py-1 rounded text-xs border border-[hsl(var(--primary))]/30"
                      >
                        <span className="font-medium">
                          {filter.column.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                        </span>
                        <span>{filter.displayValue}</span>
                        <button
                          onClick={() => removeFilter(filter)}
                          className="text-[hsl(var(--panel-error))] hover:text-[hsl(var(--panel-error))]/80 ml-1"
                          title="Remove filter"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-[hsl(var(--panel-error))] hover:text-[hsl(var(--panel-error))]/80 flex items-center space-x-1"
                  >
                    <X size={12} />
                    <span>Clear All</span>
                  </button>
                </div>
              </div>
            )}
            
            {/* Filter Panel - Collapsible */}
            {showFilters && (
              <div className="border-b border-[hsl(var(--table-border))] bg-[hsl(var(--table-header-background))]">
                <div className="p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Store Parameters */}
                    <div className="space-y-3">
                      <h3 className="text-[hsl(var(--table-foreground))] font-medium text-sm flex items-center">
                        <div className="w-3 h-3 bg-[hsl(var(--primary))] rounded mr-2"></div>
                        Store Parameters
                      </h3>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {getFilterColumnGroups().storeColumns.map((column) => (
                          <FilterColumnComponent
                            key={column}
                            column={column}
                            metadata={metadata}
                            discreteFilters={discreteFilters}
                            rangeFilters={rangeFilters}
                            searchFilters={searchFilters}
                            filterRanges={filterRanges}
                            onDiscreteChange={handleDiscreteFilterChange}
                            onRangeChange={handleRangeFilterChange}
                            onSearchChange={handleSearchFilterChange}
                            onLoadFilter={loadFilterData}
                            onLoadMoreDiscrete={loadMoreDiscreteOptions}
                            onDiscreteSearch={handleDiscreteFilterSearch}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Product Parameters */}
                    <div className="space-y-3">
                      <h3 className="text-[hsl(var(--table-foreground))] font-medium text-sm flex items-center">
                        <div className="w-3 h-3 bg-[hsl(var(--panel-success))] rounded mr-2"></div>
                        Product Parameters
                      </h3>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {getFilterColumnGroups().productColumns.map((column) => (
                          <FilterColumnComponent
                            key={column}
                            column={column}
                            metadata={metadata}
                            discreteFilters={discreteFilters}
                            rangeFilters={rangeFilters}
                            searchFilters={searchFilters}
                            filterRanges={filterRanges}
                            onDiscreteChange={handleDiscreteFilterChange}
                            onRangeChange={handleRangeFilterChange}
                            onSearchChange={handleSearchFilterChange}
                            onLoadFilter={loadFilterData}
                            onLoadMoreDiscrete={loadMoreDiscreteOptions}
                            onDiscreteSearch={handleDiscreteFilterSearch}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Forecast Parameters */}
                    <div className="space-y-3">
                      <h3 className="text-[hsl(var(--table-foreground))] font-medium text-sm flex items-center">
                        <div className="w-3 h-3 bg-[hsl(var(--panel-warning))] rounded mr-2"></div>
                        Forecast Parameters
                      </h3>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {getFilterColumnGroups().forecastColumns.map((column) => (
                          <FilterColumnComponent
                            key={column}
                            column={column}
                            metadata={metadata}
                            discreteFilters={discreteFilters}
                            rangeFilters={rangeFilters}
                            searchFilters={searchFilters}
                            filterRanges={filterRanges}
                            onDiscreteChange={handleDiscreteFilterChange}
                            onRangeChange={handleRangeFilterChange}
                            onSearchChange={handleSearchFilterChange}
                            onLoadFilter={loadFilterData}
                            onLoadMoreDiscrete={loadMoreDiscreteOptions}
                            onDiscreteSearch={handleDiscreteFilterSearch}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Apply Filters Button */}
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={applyFilters}
                      className="px-6 py-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded hover:bg-[hsl(var(--primary))]/90"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            )}

      {/* Table Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div 
          ref={tableContainerRef}
          className="flex-1 overflow-y-auto overflow-x-auto"
        >
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 bg-[hsl(var(--panel-header-background))] border-b border-[hsl(var(--panel-border))] z-50">
              <tr className="h-12">

                {/* only show the following columns if you are not in groupByMode */}
                {!isGroupByMode && 
                  <>
                    {/* Store Details Combined */}
                    <th className="px-3 py-2 text-left text-[hsl(var(--panel-header-foreground))] font-medium border-r border-[hsl(var(--panel-border))] bg-[hsl(var(--panel-header-background))] bg-opacity-100 backdrop-blur-md min-w-[200px]">
                      <div className="flex items-center justify-between">
                        <span>Store Details</span>
                        <SearchButton column="store_no" />
                      </div>
                    </th>
                    
                    {/* Product Details Combined */}
                    <th className="px-3 py-2 text-left text-[hsl(var(--panel-header-foreground))] font-medium border-r border-[hsl(var(--panel-border))] bg-[hsl(var(--panel-header-background))] bg-opacity-100 backdrop-blur-md min-w-[250px]">
                      <div className="flex items-center justify-between">
                        <span>Product Details</span>
                        <SearchButton column="article_id" />
                      </div>
                    </th>
                    
                    {/* Brand */}
                    <th className="px-3 py-2 text-left text-[hsl(var(--panel-header-foreground))] font-medium border-r border-[hsl(var(--panel-border))] bg-[hsl(var(--panel-header-background))] bg-opacity-100 backdrop-blur-md min-w-[120px]">
                      <div className="flex items-center justify-between">
                        <span>Brand</span>
                        <SearchButton column="brand" />
                      </div>
                    </th>
                    
                    {/* Category Combined */}
                    <th className="px-3 py-2 text-left text-[hsl(var(--panel-header-foreground))] font-medium border-r border-[hsl(var(--panel-border))] bg-[hsl(var(--panel-header-background))] bg-opacity-100 backdrop-blur-md min-w-[200px]">
                      <div className="flex items-center justify-between">
                        <span>Category</span>
                        <SearchButton column="segment" />
                      </div>
                    </th>
                    
                    {/* Channel */}
                    <th className="px-3 py-2 text-left text-[hsl(var(--panel-header-foreground))] font-medium border-r border-[hsl(var(--panel-border))] bg-[hsl(var(--panel-header-background))] bg-opacity-100 backdrop-blur-md min-w-[100px]">
                      <div className="flex items-center justify-between">
                        <span>Channel</span>
                        <SearchButton column="channel" />
                      </div>
                    </th>
                  </>
                }

                {/* Month Data */}
                {/* <th className="px-3 py-2 text-left text-[hsl(var(--panel-header-foreground))] font-medium border-r border-[hsl(var(--panel-border))] bg-[hsl(var(--panel-header-background))] bg-opacity-100 backdrop-blur-md min-w-[100px]">
                  <span>Month</span>
                </th>
                <th className="px-3 py-2 text-left text-[hsl(var(--panel-header-foreground))] font-medium border-r border-[hsl(var(--panel-border))] bg-[hsl(var(--panel-header-background))] bg-opacity-100 backdrop-blur-md min-w-[130px]">
                  <span>Business Baseline</span>
                </th>
                <th className="px-3 py-2 text-left text-[hsl(var(--panel-header-foreground))] font-medium border-r border-[hsl(var(--panel-border))] bg-[hsl(var(--panel-header-background))] bg-opacity-100 backdrop-blur-md min-w-[130px]">
                  <span>Couture Baseline</span>
                </th>
                <th className="px-3 py-2 text-left text-[hsl(var(--panel-header-foreground))] font-medium border-r border-[hsl(var(--panel-border))] bg-[hsl(var(--panel-header-background))] bg-opacity-100 backdrop-blur-md min-w-[100px]">
                  <span>Sold Qty</span>
                </th> */}

                {/* Only display the Grouped By columns */}{
                  groupByColumns.map((column) => {
                    return <th className="px-3 py-2 text-left text-[hsl(var(--panel-header-foreground))] font-medium border-r border-[hsl(var(--panel-border))] bg-[hsl(var(--panel-header-background))] bg-opacity-100 backdrop-blur-md min-w-[100px]">
                      <div className="flex items-center justify-between">
                        <span>{sanitizeLabel(column)}</span>
                        <SearchButton column="channel" />
                      </div>
                    </th>
                  })
                }

                {/* Dynamic Month data */}
                {monthWiseColumns.map((column) => {
                  return (visibleColumnSettings[column]) ? <th
                    key={column}  // ✅ unique key
                    className="px-3 py-2 text-left text-[hsl(var(--panel-header-foreground))] font-medium border-r border-[hsl(var(--panel-border))] bg-[hsl(var(--panel-header-background))] bg-opacity-100 backdrop-blur-md min-w-[100px]"
                  >
                    <span>{sanitizeLabel(column)}</span>
                  </th> : null
                }
                  
                  
                )}

              </tr>
            </thead>
            
            <tbody>
              {data.map((record, recordIndex) => {
                return record?.months?.map((monthData, monthIndex) => (
                  <tr
                    key={`${record.store_no}-${record.article_id}-${monthData.month_year}`}
                    className={`border-b border-[hsl(var(--panel-border))] hover:bg-[hsl(var(--panel-hover))] transition-colors ${
                      monthIndex === record.months.length - 1
                        ? "border-b-2 border-b-[hsl(var(--panel-border))]"
                        : ""
                    }`}
                  >
                    {/* Store Details - only show on first month row */}
                    {monthIndex === 0 && (
                      <>
                        {/* A. Show these standard columns ONLY IF NOT in group-by mode */}
                        {!isGroupByMode && (
                          <>
                            {/* Store Details */}
                            <td
                              className="px-3 py-2 text-[hsl(var(--panel-foreground))] border-r border-[hsl(var(--panel-border))] bg-[hsl(var(--panel-background))] min-w-[200px] align-top"
                              rowSpan={record.months.length}
                            >
                              <div className="space-y-1">
                                <div className="font-bold text-sm">
                                  {formatCellValue(record.store_no)}
                                </div>
                                <div className="text-xs text-[hsl(var(--panel-muted-foreground))]">
                                  {formatCellValue(record.city)},{" "}
                                  {formatCellValue(record.state)}
                                </div>
                                <div className="text-xs text-[hsl(var(--panel-muted-foreground))]">
                                  {formatCellValue(record.region)}
                                </div>
                              </div>
                            </td>

                            {/* Product Details */}
                            <td
                              className="px-3 py-2 text-[hsl(var(--panel-foreground))] border-r border-[hsl(var(--panel-border))] bg-[hsl(var(--panel-background))] min-w-[250px] align-top"
                              rowSpan={record.months.length}
                            >
                              <div className="space-y-1">
                                <div className="font-bold text-sm">
                                  {formatCellValue(record.article_id)}
                                </div>
                                <div
                                  className="text-xs text-[hsl(var(--panel-muted-foreground))] max-w-[220px] overflow-hidden"
                                  title={record.article_description}
                                >
                                  <div className="break-words">
                                    {formatCellValue(record.article_description)}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Brand */}
                            <td
                              className="px-3 py-2 text-[hsl(var(--panel-foreground))] border-r border-[hsl(var(--panel-border))] bg-[hsl(var(--panel-background))] min-w-[120px] align-top"
                              rowSpan={record.months.length}
                            >
                              {formatCellValue(record.brand)}
                            </td>

                            {/* Category Combined */}
                            <td
                              className="px-3 py-2 text-[hsl(var(--panel-foreground))] border-r border-[hsl(var(--panel-border))] bg-[hsl(var(--panel-background))] min-w-[200px] align-top"
                              rowSpan={record.months.length}
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-medium">
                                  {formatCellValue(record.segment)}
                                </div>
                                <div className="text-xs text-[hsl(var(--panel-muted-foreground))]">
                                  {formatCellValue(record.division)}
                                </div>
                                <div className="text-xs text-[hsl(var(--panel-muted-foreground))]">
                                  {formatCellValue(record.vertical)}
                                </div>
                              </div>
                            </td>

                            {/* Channel */}
                            <td
                              className="px-3 py-2 text-[hsl(var(--panel-foreground))] border-r border-[hsl(var(--panel-border))] bg-[hsl(var(--panel-background))] min-w-[100px] align-top"
                              rowSpan={record.months.length}
                            >
                              {formatCellValue(record.channel)}
                            </td>
                          </>
                        )}

                        {/* B. Show the selected "Group By" columns ONLY IF in group-by mode */}
                        {isGroupByMode &&
                          groupByColumns.map((column) => (
                            <td
                              key={column} // Added a key for React best practices
                              className="px-3 py-2 text-[hsl(var(--panel-foreground))] border-r border-[hsl(var(--panel-border))] bg-[hsl(var(--panel-background))] min-w-[100px] align-top"
                              rowSpan={record.months.length}
                            >
                              <span>{record[column] ? record[column] : null}</span>
                            </td>
                          ))}
                      </>
                    )}
                    {/* Month Data - show for every row */}
                    {/* Dynamic month related data */}
                    {monthWiseColumns.map((column) => {
                      return (visibleColumnSettings[column]) ? (
                        <td
                          key={column}
                          className="px-3 py-2 text-[hsl(var(--panel-foreground))] border-r border-[hsl(var(--panel-border))] bg-[hsl(var(--panel-background))] min-w-[100px]"
                        >
                          <span className="font-medium">
                            {formatCellValue(monthData[column])}
                          </span>
                        </td>
                      ) : null
                    })}
                  </tr>
                ));
              })}
              
              {/* Loading row */}
              {loading && data.length > 0 && (
                <tr>
                  <td colSpan={9} className="px-3 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="animate-spin text-[hsl(var(--primary))] mr-2" size={16} />
                      <span className="text-[hsl(var(--panel-muted-foreground))]">Loading...</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Status bar */}
        <div className="px-4 py-2 border-t border-[hsl(var(--panel-border))] bg-[hsl(var(--panel-header-background))]">
          <div className="flex items-center justify-between text-xs text-[hsl(var(--panel-muted-foreground))]">
            <div className="flex items-center space-x-4">
              {/* <span>
                Showing month-on-month comparison grouped by (Store, Article) pairs
              </span> */}
            </div>
            <div>
              {data.length.toLocaleString()} groups loaded
              {hasMore && " • Scroll down for more"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function SearchButton({ column }: { column: string }) {
    const [isSearching, setIsSearching] = useState(false);
    const isActive = activeSearches[column];
    
    if (isSearching) {
      return (
        <div className="flex items-center space-x-1">
          <input
            type="text"
            placeholder={`Search...`}
            value={searchValues[column] || ''}
            onChange={(e) => handleSearchChange(column, e.target.value)}
            onKeyPress={(e) => handleSearchKeyPress(column, e)}
            onBlur={() => setIsSearching(false)}
            className="flex-1 px-2 py-1 text-xs bg-[hsl(var(--panel-input-background))] border border-[hsl(var(--panel-input-border))] rounded text-[hsl(var(--panel-foreground))] focus:outline-none focus:border-[hsl(var(--primary))] min-w-0"
            autoFocus
          />
          <button
            onClick={() => {
              handleSearchExecute(column);
              setIsSearching(false);
            }}
            className="p-1 text-xs bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded hover:bg-[hsl(var(--primary))]/90"
          >
            <Search size={12} />
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-1">
        {isActive && (
          <div className="flex items-center space-x-1">
            <span className="text-xs text-[hsl(var(--primary))] bg-[hsl(var(--primary))]/20 px-1 rounded">
              "{isActive}"
            </span>
            <button
              onClick={() => handleClearSearch(column)}
              className="text-xs text-[hsl(var(--panel-error))] hover:text-[hsl(var(--panel-error))]/80"
            >
              <X size={12} />
            </button>
          </div>
        )}
        <button
          onClick={() => setIsSearching(true)}
          className="p-1 text-xs bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded hover:bg-[hsl(var(--primary))]/90 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Search size={12} />
        </button>
      </div>
    );
  }
};

// Filter Column Component
interface FilterColumnComponentProps {
  column: string;
  metadata: ForecastMetadata | null;
  discreteFilters: { [key: string]: DiscreteFilter };
  rangeFilters: { [key: string]: RangeFilter };
  searchFilters: { [key: string]: SearchFilter };
  filterRanges: { [key: string]: { min: number; max: number } };
  onDiscreteChange: (column: string, value: string, checked: boolean) => void;
  onRangeChange: (column: string, type: 'min' | 'max', value: number | null) => void;
  onSearchChange: (column: string, value: string) => void;
  onLoadFilter: (column: string) => void;
  onLoadMoreDiscrete: (column: string) => void;
  onDiscreteSearch: (column: string, searchTerm: string) => void;
}

const FilterColumnComponent: React.FC<FilterColumnComponentProps> = ({
  column,
  metadata,
  discreteFilters,
  rangeFilters,
  searchFilters,
  filterRanges,
  onDiscreteChange,
  onRangeChange,
  onSearchChange,
  onLoadFilter,
  onLoadMoreDiscrete,
  onDiscreteSearch
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!metadata) return null;
  
  const filterType = metadata.essential_columns_filtertypes[column];
  const displayName = column.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  const handleToggleExpand = () => {
    if (!isExpanded && filterType !== 'search') {
      onLoadFilter(column);
    }
    setIsExpanded(!isExpanded);
  };
  
  const renderFilterContent = () => {
    if (filterType === 'discrete') {
      const filter = discreteFilters[column];
      if (!filter) return null;
      
      // Filter options based on search term
      const filteredOptions = filter.availableOptions.filter(option =>
        option.value.toLowerCase().includes(filter.searchTerm.toLowerCase())
      );
      
      return (
        <div className="space-y-2">
          {/* Search input for discrete options */}
          <div className="relative">
            <Search size={12} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[hsl(var(--panel-muted-foreground))]" />
            <input
              type="text"
              placeholder={`Search ${displayName.toLowerCase()}...`}
              value={filter.searchTerm}
              onChange={(e) => onDiscreteSearch(column, e.target.value)}
              className="w-full pl-6 pr-2 py-1 text-xs bg-[hsl(var(--panel-input-background))] text-[hsl(var(--panel-foreground))] border border-[hsl(var(--panel-input-border))] rounded focus:border-[hsl(var(--primary))] focus:outline-none"
            />
          </div>
          
          <div className="max-h-40 overflow-y-auto space-y-1">
            {filteredOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center space-x-2 text-xs hover:bg-[hsl(var(--panel-hover))] p-1 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filter.selectedValues.includes(option.value)}
                  onChange={(e) => onDiscreteChange(column, option.value, e.target.checked)}
                  className="rounded border-[hsl(var(--panel-input-border))] text-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))] focus:ring-1"
                />
                <span className="flex-1 truncate text-[hsl(var(--panel-foreground))]" title={option.value}>
                  {option.value}
                </span>
                <span className="text-[hsl(var(--panel-muted-foreground))] text-xs">
                  {option.count.toLocaleString()}
                </span>
              </label>
            ))}
            
            {filter.loading && (
              <div className="flex items-center justify-center p-2">
                <Loader2 size={14} className="animate-spin text-[hsl(var(--panel-muted-foreground))]" />
                <span className="text-xs text-[hsl(var(--panel-muted-foreground))] ml-2">Loading...</span>
              </div>
            )}
            
            {filter.hasMore && !filter.loading && (
              <button
                onClick={() => onLoadMoreDiscrete(column)}
                className="w-full text-xs text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]/80 p-1 text-center"
              >
                Load More...
              </button>
            )}
            
            {filteredOptions.length === 0 && !filter.loading && filter.searchTerm && (
              <div className="text-xs text-[hsl(var(--panel-muted-foreground))] text-center p-2">
                No options match "{filter.searchTerm}"
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center text-xs text-[hsl(var(--panel-muted-foreground))] border-t border-[hsl(var(--panel-border))] pt-2">
            <span>
              {filter.selectedValues.length > 0 ? `${filter.selectedValues.length} selected` : 'None selected'}
            </span>
            {filter.searchTerm && (
              <span>
                {filteredOptions.length} of {filter.availableOptions.length} shown
              </span>
            )}
          </div>
        </div>
      );
    } else if (filterType === 'range') {
      const filter = rangeFilters[column] || { min: null, max: null };
      const range = filterRanges[column];
      
      if (!range) return null;
      
      return (
        <div className="space-y-3">
          <div className="text-xs text-[hsl(var(--panel-muted-foreground))]">
            Range: {range.min.toLocaleString()} - {range.max.toLocaleString()}
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-[hsl(var(--panel-muted-foreground))] block mb-1">Min</label>
              <input
                type="number"
                placeholder={range.min.toString()}
                value={filter.min?.toString() || ''}
                onChange={(e) => onRangeChange(column, 'min', e.target.value ? parseFloat(e.target.value) : null)}
                className="w-full px-2 py-1 text-xs bg-[hsl(var(--panel-input-background))] text-[hsl(var(--panel-foreground))] border border-[hsl(var(--panel-input-border))] rounded focus:border-[hsl(var(--primary))] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-[hsl(var(--panel-muted-foreground))] block mb-1">Max</label>
              <input
                type="number"
                placeholder={range.max.toString()}
                value={filter.max?.toString() || ''}
                onChange={(e) => onRangeChange(column, 'max', e.target.value ? parseFloat(e.target.value) : null)}
                className="w-full px-2 py-1 text-xs bg-[hsl(var(--panel-input-background))] text-[hsl(var(--panel-foreground))] border border-[hsl(var(--panel-input-border))] rounded focus:border-[hsl(var(--primary))] focus:outline-none"
              />
            </div>
          </div>
        </div>
      );
    } else if (filterType === 'search') {
      const filter = searchFilters[column] || { value: '' };
      
      return (
        <div>
          <input
            type="text"
            placeholder={`Search ${displayName.toLowerCase()}...`}
            value={filter.value}
            onChange={(e) => onSearchChange(column, e.target.value)}
            className="w-full px-2 py-1 text-xs bg-[hsl(var(--panel-input-background))] text-[hsl(var(--panel-foreground))] border border-[hsl(var(--panel-input-border))] rounded focus:border-[hsl(var(--primary))] focus:outline-none"
          />
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="border border-[hsl(var(--panel-border))] rounded bg-[hsl(var(--panel-background))]">
      <button
        onClick={handleToggleExpand}
        className="w-full flex items-center justify-between p-2 hover:bg-[hsl(var(--panel-hover))] transition-colors"
      >
        <span className="text-xs text-[hsl(var(--panel-foreground))] font-medium truncate" title={displayName}>
          {displayName}
        </span>
        <div className="flex items-center space-x-1">
          <span className="text-xs text-[hsl(var(--panel-muted-foreground))] capitalize">
            {filterType}
          </span>
          {isExpanded ? (
            <ChevronUp size={12} className="text-[hsl(var(--panel-muted-foreground))]" />
          ) : (
            <ChevronDown size={12} className="text-[hsl(var(--panel-muted-foreground))]" />
          )}
        </div>
      </button>
      
      {isExpanded && (
        <div className="p-2 border-t border-[hsl(var(--panel-border))]">
          {renderFilterContent()}
        </div>
      )}
    </div>
  );
};

export default MonthOnMonthComparison;