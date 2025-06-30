import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { 
  Loader2, 
  AlertCircle, 
  RefreshCw, 
  Filter,
  ChevronDown,
  ChevronRight,
  Calendar,
  Search,
  Group,
  X,
  ChevronUp,
  Check,
  Minus,
  Plus
} from "lucide-react";
import { ForecastRepository } from "@/repository/forecast_repository";

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

interface ForecastRecord {
  [key: string]: any;
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

const ForecastMasterTable = () => {
  const [data, setData] = useState<ForecastRecord[]>([]);
  const [metadata, setMetadata] = useState<ForecastMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [columnGroups, setColumnGroups] = useState<ColumnGroup[]>([]);
  
  // Week start date state
  const [weekStartDates, setWeekStartDates] = useState<string[]>([]);
  const [selectedWeekStartDate, setSelectedWeekStartDate] = useState<string>('');
  const [loadingWeekDates, setLoadingWeekDates] = useState(false);
  
  // Search and sort state
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>({});
  const [activeSearches, setActiveSearches] = useState<{ [key: string]: string }>({});
  const [sortState, setSortState] = useState<{ column: string | null; direction: 'asc' | 'desc' | null }>({
    column: null,
    direction: null
  });
  
  // Group by state
  const [isGroupByMode, setIsGroupByMode] = useState(false);
  const [showGroupByModal, setShowGroupByModal] = useState(false);
  const [selectedGroupByColumns, setSelectedGroupByColumns] = useState<string[]>([]);
  const [groupByColumns, setGroupByColumns] = useState<string[]>([]);
  
  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [discreteFilters, setDiscreteFilters] = useState<{ [key: string]: DiscreteFilter }>({});
  const [rangeFilters, setRangeFilters] = useState<{ [key: string]: RangeFilter }>({});
  const [searchFilters, setSearchFilters] = useState<{ [key: string]: SearchFilter }>({});
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [filterRanges, setFilterRanges] = useState<{ [key: string]: { min: number; max: number } }>({});
  
  // Refs for infinite scroll
  const tableContainerRef = useRef<HTMLDivElement>(null);
  
  // Initialize forecast repository - use useMemo to prevent recreation on every render
  const forecastRepo = useMemo(() => 
    new ForecastRepository(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'),
    []
  );
  
  // Load metadata and week dates on component mount
  useEffect(() => {
    loadMetadata();
    loadWeekStartDates();
  }, []);
  
  // Load initial data when week start date changes
  useEffect(() => {
    if (selectedWeekStartDate && metadata) {
      loadInitialData();
    }
  }, [selectedWeekStartDate, metadata]);
  
  // Reload data when search or sort changes
  useEffect(() => {
    if (selectedWeekStartDate && metadata) {
      loadInitialData();
    }
  }, [activeSearches, sortState, isGroupByMode, groupByColumns, appliedFilters]);
  
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
              setSelectedWeekStartDate(dates[0]);
            }
          }
        }
      };
      
      await forecastRepo.executeSqlQuery({ sql_query: sqlQuery }, stateSetters);
    } catch (err) {
      console.error('Error loading week start dates:', err);
      setError('Failed to load week start dates');
    } finally {
      setLoadingWeekDates(false);
    }
  };
  
  const loadMoreData = useCallback(async () => {
    console.log('[ForecastMasterTable] loadMoreData called:', { loadingMore, hasMore, page });
    
    if (loadingMore || !hasMore || !selectedWeekStartDate) {
      console.log('[ForecastMasterTable] Skipping load more - already loading, no more data, or no date selected');
      return;
    }
    
    setLoadingMore(true);
    
    try {
      const offset = page * 100;
      let sqlQuery = '';
      
      if (isGroupByMode && groupByColumns.length > 0) {
        // Build GROUP BY query
        const selectColumns = [...groupByColumns];
        const aggregateColumns: string[] = [];
        
        // Add aggregates for non-grouped columns
        if (metadata) {
          metadata.essential_columns.forEach(col => {
            if (!groupByColumns.includes(col)) {
              const dataType = metadata.essential_columns_datatypes[col];
              if (dataType === 'string') {
                selectColumns.push(`COUNT(DISTINCT ${col}) as "#${col}"`);
                aggregateColumns.push(`#${col}`);
              } else if (dataType === 'float' || dataType === 'integer') {
                selectColumns.push(`SUM(${col}) as "Σ${col}"`);
                aggregateColumns.push(`Σ${col}`);
              }
            }
          });
        }
        
        sqlQuery = `SELECT ${selectColumns.join(', ')} FROM forecast WHERE week_start_date = '${selectedWeekStartDate}'`;
        
        // Add applied filter conditions
        const filterConditions = appliedFilters.map(filter => filter.sqlCondition);
        if (filterConditions.length > 0) {
          sqlQuery += ` AND ${filterConditions.join(' AND ')}`;
        }
        
        // Add search conditions for grouped columns only
        const searchConditions = Object.entries(activeSearches)
          .filter(([column, value]) => value.trim() !== '' && groupByColumns.includes(column))
          .map(([column, value]) => `${column} ILIKE '%${value}%'`);
        
        if (searchConditions.length > 0) {
          sqlQuery += ` AND ${searchConditions.join(' AND ')}`;
        }
        
        sqlQuery += ` GROUP BY ${groupByColumns.join(', ')}`;
        
        // Add sorting
        if (sortState.column && sortState.direction) {
          const sortExpression = getSortColumnExpression(sortState.column);
          sqlQuery += ` ORDER BY ${sortExpression} ${sortState.direction.toUpperCase()}`;
        } else {
          sqlQuery += ` ORDER BY ${groupByColumns[0]}`;
        }
        
        sqlQuery += ` LIMIT 100 OFFSET ${offset}`;
      } else {
        // Regular query
        sqlQuery = `SELECT * FROM forecast WHERE week_start_date = '${selectedWeekStartDate}'`;
        
        // Add applied filter conditions
        const filterConditions = appliedFilters.map(filter => filter.sqlCondition);
        if (filterConditions.length > 0) {
          sqlQuery += ` AND ${filterConditions.join(' AND ')}`;
        }
        
        // Add search conditions
        const searchConditions = Object.entries(activeSearches)
          .filter(([_, value]) => value.trim() !== '')
          .map(([column, value]) => `${column} ILIKE '%${value}%'`);
        
        if (searchConditions.length > 0) {
          sqlQuery += ` AND ${searchConditions.join(' AND ')}`;
        }
        
        // Add sorting
        if (sortState.column && sortState.direction) {
          sqlQuery += ` ORDER BY ${sortState.column} ${sortState.direction.toUpperCase()}`;
        } else {
          sqlQuery += ` ORDER BY id`;
        }
        
        sqlQuery += ` LIMIT 100 OFFSET ${offset}`;
      }
      
      console.log('[ForecastMasterTable] Executing SQL query:', sqlQuery);
      
      const stateSetters = {
        setLoading: () => {},
        setError: (error: string | null) => setError(error),
        setData: (response: any) => {
          console.log('[ForecastMasterTable] Received response:', response);
          if (response && response.data) {
            console.log('[ForecastMasterTable] Adding data:', response.data.length, 'records');
            setData(prevData => [...prevData, ...response.data]);
            setHasMore(response.data.length === 100);
            setPage(prevPage => prevPage + 1);
          } else {
            console.log('[ForecastMasterTable] No data in response');
            setHasMore(false);
          }
        }
      };
      
      await forecastRepo.executeSqlQuery({ sql_query: sqlQuery }, stateSetters);
    } catch (err) {
      console.error('[ForecastMasterTable] Error loading more data:', err);
      setError('Failed to load more data');
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, page, selectedWeekStartDate, forecastRepo, activeSearches, sortState, isGroupByMode, groupByColumns, metadata, appliedFilters]);
  
  // Set up infinite scroll with proper dependencies
  useEffect(() => {
    const container = tableContainerRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      if (loadingMore || !hasMore) return;
      
      // Check scroll on the main container
      const { scrollTop, scrollHeight, clientHeight } = container;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
      
      console.log('[ForecastMasterTable] Scroll info:', {
        scrollTop,
        scrollHeight,
        clientHeight,
        scrollPercentage,
        loadingMore,
        hasMore
      });
      
      // Load more when scrolled to 80% of the content
      if (scrollPercentage > 0.8) {
        console.log('[ForecastMasterTable] Triggering load more data');
        loadMoreData();
      }
    };
    
    // Add debouncing to prevent too many calls
    let timeoutId: NodeJS.Timeout;
    const debouncedHandleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 100);
    };
    
    // Add scroll listener to the main container
    container.addEventListener('scroll', debouncedHandleScroll);
    
    // Also add scroll listener to any scrollable child elements
    const scrollableDiv = container.querySelector('.overflow-x-auto');
    if (scrollableDiv) {
      scrollableDiv.addEventListener('scroll', debouncedHandleScroll);
    }
    
    return () => {
      container.removeEventListener('scroll', debouncedHandleScroll);
      if (scrollableDiv) {
        scrollableDiv.removeEventListener('scroll', debouncedHandleScroll);
      }
      clearTimeout(timeoutId);
    };
  }, [loadingMore, hasMore, loadMoreData]);
  
  const loadMetadata = async () => {
    try {
      const stateSetters = {
        setLoading: (loading: boolean) => setLoading(loading),
        setError: (error: string | null) => setError(error),
        setData: (data: ForecastMetadata) => {
          setMetadata(data);
          setupColumnGroups(data);
          // Load initial data after metadata is loaded
          loadInitialData();
        }
      };
      
      await forecastRepo.getMetadata({}, stateSetters);
    } catch (err) {
      console.error('Error loading metadata:', err);
      setError('Failed to load metadata');
      setLoading(false);
    }
  };
  
  const setupColumnGroups = (metadata: ForecastMetadata) => {
    // Don't exclude card attributes - keep them in regular columns too
    const groups: ColumnGroup[] = [
      {
        name: "Store Parameters",
        columns: metadata.store_attributes,
        color: "bg-blue-500/10 border-blue-500/30",
        expanded: true
      },
      {
        name: "Product Parameters", 
        columns: metadata.product_attributes,
        color: "bg-green-500/10 border-green-500/30",
        expanded: true
      },
      {
        name: "Forecast Parameters",
        columns: metadata.essential_columns.filter(col => 
          !metadata.store_attributes.includes(col) && 
          !metadata.product_attributes.includes(col)
        ),
        color: "bg-purple-500/10 border-purple-500/30",
        expanded: true
      }
    ];
    
    setColumnGroups(groups);
  };
  
  const loadInitialData = async () => {
    if (!selectedWeekStartDate) return;
    
    try {
      setLoading(true);
      setError(null);
      setPage(0);
      
      let sqlQuery = '';
      
      if (isGroupByMode && groupByColumns.length > 0) {
        // Build GROUP BY query
        const selectColumns = [...groupByColumns];
        const aggregateColumns: string[] = [];
        
        // Add aggregates for non-grouped columns
        if (metadata) {
          metadata.essential_columns.forEach(col => {
            if (!groupByColumns.includes(col)) {
              const dataType = metadata.essential_columns_datatypes[col];
              if (dataType === 'string') {
                selectColumns.push(`COUNT(DISTINCT ${col}) as "#${col}"`);
                aggregateColumns.push(`#${col}`);
              } else if (dataType === 'float' || dataType === 'integer') {
                selectColumns.push(`SUM(${col}) as "Σ${col}"`);
                aggregateColumns.push(`Σ${col}`);
              }
            }
          });
        }
        
        sqlQuery = `SELECT ${selectColumns.join(', ')} FROM forecast WHERE week_start_date = '${selectedWeekStartDate}'`;
        
        // Add applied filter conditions
        const filterConditions = appliedFilters.map(filter => filter.sqlCondition);
        if (filterConditions.length > 0) {
          sqlQuery += ` AND ${filterConditions.join(' AND ')}`;
        }
        
        // Add search conditions for grouped columns only
        const searchConditions = Object.entries(activeSearches)
          .filter(([column, value]) => value.trim() !== '' && groupByColumns.includes(column))
          .map(([column, value]) => `${column} ILIKE '%${value}%'`);
        
        if (searchConditions.length > 0) {
          sqlQuery += ` AND ${searchConditions.join(' AND ')}`;
        }
        
        sqlQuery += ` GROUP BY ${groupByColumns.join(', ')}`;
        
        // Add sorting
        if (sortState.column && sortState.direction) {
          const sortExpression = getSortColumnExpression(sortState.column);
          sqlQuery += ` ORDER BY ${sortExpression} ${sortState.direction.toUpperCase()}`;
        } else {
          sqlQuery += ` ORDER BY ${groupByColumns[0]}`;
        }
        
        sqlQuery += ` LIMIT 100`;
      } else {
        // Regular query
        sqlQuery = `SELECT * FROM forecast WHERE week_start_date = '${selectedWeekStartDate}'`;
        
        // Add applied filter conditions
        const filterConditions = appliedFilters.map(filter => filter.sqlCondition);
        if (filterConditions.length > 0) {
          sqlQuery += ` AND ${filterConditions.join(' AND ')}`;
        }
        
        // Add search conditions
        const searchConditions = Object.entries(activeSearches)
          .filter(([_, value]) => value.trim() !== '')
          .map(([column, value]) => `${column} ILIKE '%${value}%'`);
        
        if (searchConditions.length > 0) {
          sqlQuery += ` AND ${searchConditions.join(' AND ')}`;
        }
        
        // Add sorting
        if (sortState.column && sortState.direction) {
          sqlQuery += ` ORDER BY ${sortState.column} ${sortState.direction.toUpperCase()}`;
        } else {
          sqlQuery += ` ORDER BY id`;
        }
        
        sqlQuery += ` LIMIT 100`;
      }
      
      const stateSetters = {
        setLoading: (loading: boolean) => setLoading(loading),
        setError: (error: string | null) => setError(error),
        setData: (response: any) => {
          if (response && response.data) {
            setData(response.data);
            setHasMore(response.data.length === 100);
            setPage(1);
          }
        }
      };
      
      await forecastRepo.executeSqlQuery({ sql_query: sqlQuery }, stateSetters);
    } catch (err) {
      console.error('Error loading initial data:', err);
      setError('Failed to load data');
    }
  };
  
  const toggleColumnGroup = (groupIndex: number) => {
    setColumnGroups(prev => prev.map((group, index) => 
      index === groupIndex 
        ? { ...group, expanded: !group.expanded }
        : group
    ));
  };
  
  const getAllVisibleColumns = () => {
    return columnGroups
      .filter(group => group.expanded)
      .flatMap(group => group.columns);
  };
  
  // Separate columns into pinned and scrollable sections
  const getColumnSections = () => {
    if (isGroupByMode && groupByColumns.length > 0) {
      // In group by mode, different column layout
      const leftPinnedColumns = [...groupByColumns];
      const rightPinnedColumns = ['Σconsensus_qty'];
      
      // Get all columns from data (since they include aggregated columns)
      const allDataColumns = data.length > 0 ? Object.keys(data[0]) : [];
      const scrollableColumns = allDataColumns.filter(col => 
        !leftPinnedColumns.includes(col) && 
        !rightPinnedColumns.includes(col)
      );
      
      // Only include right pinned columns if they exist in data
      const visibleRightPinnedColumns = rightPinnedColumns.filter(col => allDataColumns.includes(col));
      
      return {
        leftPinnedColumns,
        scrollableColumns,
        rightPinnedColumns: visibleRightPinnedColumns
      };
    } else {
      // Regular mode
      const allVisibleColumns = getAllVisibleColumns();
      
      // Only pin forecast_qty column on the right
      const pinnedRightColumns = ['forecast_qty'];
      
      // All other columns go to the scrollable middle section
      const scrollableColumns = allVisibleColumns.filter(col => !pinnedRightColumns.includes(col));
      
      // Only include forecast_qty if it's actually visible
      const visiblePinnedRightColumns = pinnedRightColumns.filter(col => allVisibleColumns.includes(col));
      
      return {
        leftPinnedColumns: [], // No left pinned columns in regular mode
        scrollableColumns,
        rightPinnedColumns: visiblePinnedRightColumns
      };
    }
  };
  
  const formatCellValue = (value: any) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    return String(value);
  };
  
  const handleWeekStartDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newDate = event.target.value;
    setSelectedWeekStartDate(newDate);
    // Reset pagination
    setData([]);
    setPage(0);
    setHasMore(true);
  };
  
  // Handle column sorting
  const handleColumnSort = (column: string) => {
    let newDirection: 'asc' | 'desc' | null = 'asc';
    
    if (sortState.column === column) {
      if (sortState.direction === 'asc') {
        newDirection = 'desc';
      } else if (sortState.direction === 'desc') {
        newDirection = null; // unsorted
      } else {
        newDirection = 'asc';
      }
    }
    
    setSortState({
      column: newDirection ? column : null,
      direction: newDirection
    });
    
    // Reset data and reload
    setData([]);
    setPage(0);
    setHasMore(true);
  };
  
  // Handle search input change
  const handleSearchChange = (column: string, value: string) => {
    setSearchValues(prev => ({
      ...prev,
      [column]: value
    }));
  };
  
  // Handle search execution (on Enter or button click)
  const handleSearchExecute = (column: string) => {
    const searchValue = searchValues[column]?.trim();
    
    if (searchValue) {
      setActiveSearches(prev => ({
        ...prev,
        [column]: searchValue
      }));
    } else {
      // Remove search if empty
      setActiveSearches(prev => {
        const newActive = { ...prev };
        delete newActive[column];
        return newActive;
      });
    }
    
    // Reset data and reload
    setData([]);
    setPage(0);
    setHasMore(true);
  };
  
  // Handle clearing a search
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
    
    // Reset data and reload
    setData([]);
    setPage(0);
    setHasMore(true);
  };
  
  // Handle search input key press
  const handleSearchKeyPress = (column: string, event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearchExecute(column);
    }
  };
  
  // Check if column is searchable (string type)
  const isColumnSearchable = (column: string): boolean => {
    return metadata?.essential_columns_datatypes?.[column] === 'string';
  };
  
  // Get sort icon for column
  const getSortIcon = (column: string) => {
    if (sortState.column !== column) return null;
    if (sortState.direction === 'asc') return '↑';
    if (sortState.direction === 'desc') return '↓';
    return null;
  };
  
  // Handle group by modal
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
    // Reset data and reload
    setData([]);
    setPage(0);
    setHasMore(true);
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
    // Reset data and reload
    setData([]);
    setPage(0);
    setHasMore(true);
  };
  
  // Get available columns for group by (string type only)
  const getGroupByColumns = () => {
    if (!metadata) return [];
    return metadata.essential_columns.filter(col => 
      metadata.essential_columns_datatypes[col] === 'string'
    );
  };
  
  // Helper function to convert column name to proper SQL expression for sorting in group by mode
  const getSortColumnExpression = (column: string): string => {
    if (!isGroupByMode || !metadata) {
      return column;
    }
    
    // If it's a grouped column, use it directly
    if (groupByColumns.includes(column)) {
      return column;
    }
    
    // If it's an aggregate column, convert to proper SQL expression
    if (column.startsWith('#')) {
      const originalColumn = column.substring(1);
      return `COUNT(DISTINCT ${originalColumn})`;
    } else if (column.startsWith('Σ')) {
      const originalColumn = column.substring(1);
      return `SUM(${originalColumn})`;
    }
    
    // For any other column in group by mode, try to determine the appropriate aggregate
    const dataType = metadata.essential_columns_datatypes[column];
    if (dataType === 'string') {
      return `COUNT(DISTINCT ${column})`;
    } else if (dataType === 'float' || dataType === 'integer') {
      return `SUM(${column})`;
    }
    
    return column;
  };
  
  // Helper function to render card content
  const renderCardContent = (record: ForecastRecord, attributes: string[]) => {
    if (!attributes || attributes.length === 0) {
      return <div className="text-xs text-red-400">No attributes</div>;
    }
    
    const [primaryAttribute, ...secondaryAttributes] = attributes;
    const primaryValue = formatCellValue(record[primaryAttribute]);
    
    // Show debug info if primary value is empty
    if (!primaryValue) {
      return (
        <div className="text-xs text-yellow-400">
          Missing: {primaryAttribute}
        </div>
      );
    }
    
    return (
      <div className="space-y-0">
        <div className="font-semibold text-white text-xs leading-tight truncate" title={`${primaryAttribute}: ${primaryValue}`}>
          {primaryValue}
        </div>
        {secondaryAttributes.map((attr) => {
          const value = formatCellValue(record[attr]);
          return value ? (
            <div 
              key={attr} 
              className="text-[10px] text-[hsl(var(--dark-3))] leading-tight truncate" 
              title={`${attr}: ${value}`}
            >
              {value}
            </div>
          ) : null;
        })}
      </div>
    );
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
      
      const offset = page * 100;
      const sqlQuery = `
        SELECT ${column} as value, COUNT(*) as count 
        FROM forecast 
        WHERE ${column} IS NOT NULL AND ${column} != '' 
        GROUP BY ${column} 
        ORDER BY count DESC, ${column} ASC 
        LIMIT 100 OFFSET ${offset}
      `;
      
      const stateSetters = {
        setLoading: () => {},
        setError: (error: string | null) => setError(error),
        setData: (response: any) => {
          if (response && response.data) {
            const options: FilterOption[] = response.data.map((row: any) => ({
              value: row.value,
              count: parseInt(row.count)
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
      
      await forecastRepo.executeSqlQuery({ sql_query: sqlQuery }, stateSetters);
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
      const sqlQuery = `
        SELECT 
          MIN(${column}) as min_value, 
          MAX(${column}) as max_value 
        FROM forecast 
        WHERE ${column} IS NOT NULL
      `;
      
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
      
      await forecastRepo.executeSqlQuery({ sql_query: sqlQuery }, stateSetters);
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
    
    // Reset data and reload
    setData([]);
    setPage(0);
    setHasMore(true);
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
    
    // Reset data and reload
    setData([]);
    setPage(0);
    setHasMore(true);
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    setDiscreteFilters({});
    setRangeFilters({});
    setSearchFilters({});
    setAppliedFilters([]);
    
    // Reset data and reload
    setData([]);
    setPage(0);
    setHasMore(true);
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
  
  if (loading && data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-[hsl(var(--dark-8))]">
        <div className="flex items-center">
          <Loader2 className="animate-spin text-[hsl(var(--primary))] mr-2" size={24} />
          <span className="text-white">Loading forecast data...</span>
        </div>
      </div>
    );
  }
  
  if (error && data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-[hsl(var(--dark-8))]">
        <div className="text-center">
          <AlertCircle className="text-red-400 mb-2 mx-auto" size={24} />
          <div className="text-red-400 mb-2">{error}</div>
          <button 
            onClick={loadMetadata}
            className="px-4 py-2 bg-[hsl(var(--primary))] text-white rounded hover:bg-[hsl(var(--primary))/90] flex items-center mx-auto"
          >
            <RefreshCw size={16} className="mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  const visibleColumns = getAllVisibleColumns();
  const { leftPinnedColumns, scrollableColumns, rightPinnedColumns } = getColumnSections();
  
  return (
    <div className="h-full flex flex-col bg-[hsl(var(--dark-8))]">
      {/* Header */}
      <div className="p-4 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white font-semibold text-lg">Forecast Master Table</h2>
            <p className="text-[hsl(var(--dark-3))] text-sm mt-1">
              {data.length.toLocaleString()} records loaded
              {hasMore && " (loading more as you scroll)"}
            </p>
          </div>
          
          {/* Column Group Controls and Manual Load Button */}
          <div className="flex items-center space-x-2">
            {/* Group By Button */}
            <button
              onClick={handleGroupByClick}
              className={`px-3 py-1 rounded text-xs flex items-center space-x-1 transition-colors ${
                isGroupByMode 
                  ? 'bg-purple-600 text-white hover:bg-purple-700' 
                  : 'bg-[hsl(var(--dark-7))] text-white border border-gray-600 hover:border-gray-500'
              }`}
            >
              <Group size={14} />
              <span>Group By</span>
              {isGroupByMode && groupByColumns.length > 0 && (
                <span className="bg-purple-500/30 px-1 rounded text-xs">
                  {groupByColumns.length}
                </span>
              )}
            </button>
            
            {/* Clear Group By Button */}
            {isGroupByMode && (
              <button
                onClick={clearGroupBy}
                className="px-2 py-1 rounded text-xs bg-red-600 text-white hover:bg-red-700 flex items-center"
                title="Clear Group By"
              >
                <X size={12} />
              </button>
            )}
            
            {/* Week Start Date Dropdown */}
            <div className="flex items-center">
              <Calendar size={14} className="text-[hsl(var(--dark-3))] mr-2" />
              <select
                value={selectedWeekStartDate}
                onChange={handleWeekStartDateChange}
                disabled={loadingWeekDates}
                className="px-3 py-1 rounded text-xs bg-[hsl(var(--dark-7))] text-white border border-gray-600 hover:border-gray-500 focus:border-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingWeekDates ? (
                  <option value="">Loading dates...</option>
                ) : (
                  <>
                    {weekStartDates.length === 0 && (
                      <option value="">No dates available</option>
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
            
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-1 rounded text-xs flex items-center space-x-1 transition-colors ${
                showFilters || appliedFilters.length > 0
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-[hsl(var(--dark-7))] text-white border border-gray-600 hover:border-gray-500'
              }`}
            >
              <Filter size={14} />
              <span>Filters</span>
              {appliedFilters.length > 0 && (
                <span className="bg-blue-500/30 px-1 rounded text-xs">
                  {appliedFilters.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Applied Filters Bar - Always Visible */}
      {appliedFilters.length > 0 && (
        <div className="px-4 py-2 border-b border-gray-700/50 bg-[hsl(var(--dark-7))]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-wrap">
              <span className="text-xs text-[hsl(var(--dark-3))] flex-shrink-0">Applied Filters:</span>
              {appliedFilters.map((filter, index) => (
                <div
                  key={`${filter.column}-${filter.type}-${index}`}
                  className="flex items-center space-x-1 bg-blue-600/20 text-blue-300 px-2 py-1 rounded text-xs border border-blue-600/30"
                >
                  <span className="font-medium">
                    {filter.column.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                  </span>
                  <span>{filter.displayValue}</span>
                  <button
                    onClick={() => removeFilter(filter)}
                    className="text-red-400 hover:text-red-300 ml-1"
                    title="Remove filter"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={clearAllFilters}
              className="text-xs text-red-400 hover:text-red-300 flex items-center space-x-1"
            >
              <X size={12} />
              <span>Clear All</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Filter Panel - Collapsible */}
      {showFilters && (
        <div className="border-b border-gray-700/50 bg-[hsl(var(--dark-7))]">
          <div className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Store Parameters */}
              <div className="space-y-3">
                <h3 className="text-white font-medium text-sm flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
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
                <h3 className="text-white font-medium text-sm flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
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
                <h3 className="text-white font-medium text-sm flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>
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
            
            {/* Filter Actions */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700/50">
              <div className="text-xs text-[hsl(var(--dark-3))]">
                {Object.keys(discreteFilters).reduce((acc, col) => acc + discreteFilters[col].selectedValues.length, 0) +
                 Object.keys(rangeFilters).reduce((acc, col) => acc + (rangeFilters[col].min !== null || rangeFilters[col].max !== null ? 1 : 0), 0) +
                 Object.keys(searchFilters).reduce((acc, col) => acc + (searchFilters[col].value.trim() ? 1 : 0), 0)} filters configured
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    applyFilters();
                    setShowFilters(false);
                  }}
                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Table Container with pinned columns */}
      <div 
        ref={tableContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden relative"
        style={{ minHeight: '400px' }}
      >
        <div className="flex h-fit min-h-full">
          {/* Left Pinned Columns */}
          <div className="flex-shrink-0 bg-[hsl(var(--dark-8))] border-r border-gray-700/50 z-20">
            <table className="text-sm h-full">
              <thead className="sticky top-0 bg-[hsl(var(--dark-7))] border-b border-gray-700/50 z-50">
                <tr className="h-10">
                  {!isGroupByMode && (
                    <>
                      {/* Row number column */}
                      <th className="px-2 py-2 text-left text-[hsl(var(--dark-2))] font-medium w-[60px] border-r border-gray-700/50">
                        #
                      </th>
                      
                      {/* Store Card Column */}
                      <th className="px-2 py-2 text-left text-white font-medium w-[150px] border-r border-gray-700/50 bg-blue-500/10 border-blue-500/30">
                        <div className="flex items-center">
                          <span className="truncate" title="Store Information">
                            Store
                          </span>
                        </div>
                      </th>
                      
                      {/* Product Card Column */}
                      <th className="px-2 py-2 text-left text-white font-medium w-[200px] border-r border-gray-700/50 bg-green-500/10 border-green-500/30">
                        <div className="flex items-center">
                          <span className="truncate" title="Product Information">
                            Product
                          </span>
                        </div>
                      </th>
                    </>
                  )}
                  
                  {/* Group By Columns */}
                  {leftPinnedColumns.map((column) => {
                    const isSearchable = isColumnSearchable(column);
                    const sortIcon = getSortIcon(column);
                    
                    return (
                      <th 
                        key={column}
                        className="px-2 py-2 text-left text-white font-medium min-w-[120px] border-r border-gray-700/50 bg-purple-500/10 border-purple-500/30 relative cursor-pointer hover:bg-opacity-80 transition-colors"
                        onMouseEnter={() => setHoveredColumn(column)}
                        onMouseLeave={() => setHoveredColumn(null)}
                        onClick={() => handleColumnSort(column)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            <span className="truncate" title={column}>
                              {column.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                            {/* Show active search term inline */}
                            {activeSearches[column] && (
                              <div className="flex items-center space-x-1">
                                <span className="text-xs text-blue-300 bg-blue-500/20 px-1 rounded whitespace-nowrap">
                                  "{activeSearches[column]}"
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleClearSearch(column);
                                  }}
                                  className="text-xs text-red-400 hover:text-red-300 flex-shrink-0"
                                  title="Clear search"
                                >
                                  ×
                                </button>
                              </div>
                            )}
                          </div>
                          {sortIcon && (
                            <span className="ml-1 text-xs font-bold flex-shrink-0">{sortIcon}</span>
                          )}
                        </div>
                        
                        {/* Search input for string columns */}
                        {isSearchable && hoveredColumn === column && (
                          <div className="absolute top-full left-0 w-full z-50 p-2 bg-[hsl(var(--dark-6))] border border-gray-600 rounded-b shadow-lg">
                            <div className="flex items-center space-x-1">
                              <input
                                type="text"
                                placeholder={`Search...`}
                                value={searchValues[column] || ''}
                                onChange={(e) => handleSearchChange(column, e.target.value)}
                                onKeyPress={(e) => handleSearchKeyPress(column, e)}
                                onClick={(e) => e.stopPropagation()}
                                className="flex-1 px-2 py-1 text-xs bg-[hsl(var(--dark-8))] text-white border border-gray-600 rounded focus:border-blue-500 focus:outline-none min-w-0"
                                autoFocus
                              />
                              {searchValues[column]?.trim() && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSearchExecute(column);
                                  }}
                                  className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none flex-shrink-0 h-[26px] flex items-center justify-center"
                                  title="Search"
                                >
                                  <Search size={12} />
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              
              <tbody>
                {data.map((record, index) => (
                  <tr 
                    key={record.id || index}
                    className="border-b border-gray-700/30 hover:bg-[hsl(var(--dark-7))/50] transition-colors"
                  >
                    {!isGroupByMode && (
                      <>
                        {/* Row number */}
                        <td className="px-2 py-1 text-[hsl(var(--dark-3))] border-r border-gray-700/50 font-mono text-xs w-[60px]">
                          {index + 1}
                        </td>
                        
                        {/* Store Card */}
                        <td className="px-2 py-1 border-r border-gray-700/50 w-[150px] bg-blue-500/5 align-top">
                          {metadata?.store_card_attributes ? (
                            renderCardContent(record, metadata.store_card_attributes)
                          ) : (
                            <div className="text-xs text-gray-400">No store metadata</div>
                          )}
                        </td>
                        
                        {/* Product Card */}
                        <td className="px-2 py-1 border-r border-gray-700/50 w-[200px] bg-green-500/5 align-top">
                          {metadata?.product_card_attributes ? (
                            renderCardContent(record, metadata.product_card_attributes)
                          ) : (
                            <div className="text-xs text-gray-400">No product metadata</div>
                          )}
                        </td>
                      </>
                    )}
                    
                    {/* Group By Columns */}
                    {leftPinnedColumns.map((column) => (
                      <td 
                        key={column}
                        className="px-2 py-1 text-white border-r border-gray-700/50 max-w-[200px] bg-purple-500/5"
                      >
                        <div className="truncate" title={formatCellValue(record[column])}>
                          {formatCellValue(record[column])}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
                
                {/* Loading row for left columns */}
                {loadingMore && (
                  <tr>
                    <td colSpan={!isGroupByMode ? 3 + leftPinnedColumns.length : leftPinnedColumns.length} className="px-3 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <Loader2 className="animate-spin text-[hsl(var(--primary))] mr-2" size={16} />
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Scrollable Middle Columns */}
          <div className="flex-1 overflow-x-auto relative">
            <table className="w-full text-sm h-full">
              <thead className="sticky top-0 bg-[hsl(var(--dark-7))] border-b border-gray-700/50 z-40">
                <tr className="h-10">
                  {scrollableColumns.map((column) => {
                    const group = columnGroups.find(g => g.columns.includes(column));
                    const isSearchable = isColumnSearchable(column);
                    const sortIcon = getSortIcon(column);
                    
                    return (
                      <th 
                        key={column}
                        className={`px-2 py-2 text-left text-white font-medium min-w-[120px] border-r border-gray-700/50 ${group?.color || ''} relative cursor-pointer hover:bg-opacity-80 transition-colors`}
                        onMouseEnter={() => setHoveredColumn(column)}
                        onMouseLeave={() => setHoveredColumn(null)}
                        onClick={() => handleColumnSort(column)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            <span className="truncate" title={column}>
                              {column.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                            {/* Show active search term inline */}
                            {activeSearches[column] && (
                              <div className="flex items-center space-x-1">
                                <span className="text-xs text-blue-300 bg-blue-500/20 px-1 rounded whitespace-nowrap">
                                  "{activeSearches[column]}"
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleClearSearch(column);
                                  }}
                                  className="text-xs text-red-400 hover:text-red-300 flex-shrink-0"
                                  title="Clear search"
                                >
                                  ×
                                </button>
                              </div>
                            )}
                          </div>
                          {sortIcon && (
                            <span className="ml-1 text-xs font-bold flex-shrink-0">{sortIcon}</span>
                          )}
                        </div>
                        
                        {/* Search input for string columns - positioned to stay in bounds */}
                        {isSearchable && hoveredColumn === column && (
                          <div className="absolute top-full left-0 w-full z-50 p-2 bg-[hsl(var(--dark-6))] border border-gray-600 rounded-b shadow-lg">
                            <div className="flex items-center space-x-1">
                              <input
                                type="text"
                                placeholder={`Search...`}
                                value={searchValues[column] || ''}
                                onChange={(e) => handleSearchChange(column, e.target.value)}
                                onKeyPress={(e) => handleSearchKeyPress(column, e)}
                                onClick={(e) => e.stopPropagation()}
                                className="flex-1 px-2 py-1 text-xs bg-[hsl(var(--dark-8))] text-white border border-gray-600 rounded focus:border-blue-500 focus:outline-none min-w-0"
                                autoFocus
                              />
                              {searchValues[column]?.trim() && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSearchExecute(column);
                                  }}
                                  className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none flex-shrink-0 h-[26px] flex items-center justify-center"
                                  title="Search"
                                >
                                  <Search size={12} />
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              
              <tbody>
                {data.map((record, index) => (
                  <tr 
                    key={record.id || index}
                    className="border-b border-gray-700/30 hover:bg-[hsl(var(--dark-7))/50] transition-colors"
                  >
                    {scrollableColumns.map((column) => (
                      <td 
                        key={column}
                        className="px-2 py-1 text-white border-r border-gray-700/50 max-w-[200px]"
                      >
                        <div className="truncate" title={formatCellValue(record[column])}>
                          {formatCellValue(record[column])}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
                
                {/* Loading row for middle columns */}
                {loadingMore && (
                  <tr>
                    <td colSpan={scrollableColumns.length} className="px-3 py-4 text-center">
                      <span className="text-[hsl(var(--dark-3))]">Loading...</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Right Pinned Columns (Forecast Qty) */}
          {rightPinnedColumns.length > 0 && (
            <div className="flex-shrink-0 bg-[hsl(var(--dark-8))] border-l border-gray-700/50 z-20">
              <table className="text-sm h-full">
                <thead className="sticky top-0 bg-[hsl(var(--dark-7))] border-b border-gray-700/50 z-50">
                  <tr className="h-10">
                    {rightPinnedColumns.map((column) => {
                      const isSearchable = isColumnSearchable(column);
                      const sortIcon = getSortIcon(column);
                      
                      return (
                        <th 
                          key={column}
                          className="px-2 py-2 text-left text-white font-medium min-w-[120px] border-r border-gray-700/50 bg-amber-500/10 border-amber-500/30 relative cursor-pointer hover:bg-opacity-80 transition-colors"
                          onMouseEnter={() => setHoveredColumn(column)}
                          onMouseLeave={() => setHoveredColumn(null)}
                          onClick={() => handleColumnSort(column)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 flex-1 min-w-0">
                              <span className="truncate" title={column}>
                                {column === 'forecast_qty' ? 'Forecast Qty' : column.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </span>
                              {/* Show active search term inline */}
                              {activeSearches[column] && (
                                <div className="flex items-center space-x-1">
                                  <span className="text-xs text-blue-300 bg-blue-500/20 px-1 rounded whitespace-nowrap">
                                    "{activeSearches[column]}"
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleClearSearch(column);
                                    }}
                                    className="text-xs text-red-400 hover:text-red-300 flex-shrink-0"
                                    title="Clear search"
                                  >
                                    ×
                                  </button>
                                </div>
                              )}
                            </div>
                            {sortIcon && (
                              <span className="ml-1 text-xs font-bold flex-shrink-0">{sortIcon}</span>
                            )}
                          </div>
                          
                          {/* Search input for string columns - positioned to stay in bounds */}
                          {isSearchable && hoveredColumn === column && (
                            <div className="absolute top-full left-0 w-full z-50 p-2 bg-[hsl(var(--dark-6))] border border-gray-600 rounded-b shadow-lg">
                              <div className="flex items-center space-x-1">
                                <input
                                  type="text"
                                  placeholder={`Search...`}
                                  value={searchValues[column] || ''}
                                  onChange={(e) => handleSearchChange(column, e.target.value)}
                                  onKeyPress={(e) => handleSearchKeyPress(column, e)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex-1 px-2 py-1 text-xs bg-[hsl(var(--dark-8))] text-white border border-gray-600 rounded focus:border-blue-500 focus:outline-none min-w-0"
                                  autoFocus
                                />
                                {searchValues[column]?.trim() && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSearchExecute(column);
                                    }}
                                    className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none flex-shrink-0 h-[26px] flex items-center justify-center"
                                    title="Search"
                                  >
                                    <Search size={12} />
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                
                <tbody>
                  {data.map((record, index) => (
                    <tr 
                      key={record.id || index}
                      className="border-b border-gray-700/30 hover:bg-[hsl(var(--dark-7))/50] transition-colors"
                    >
                      {rightPinnedColumns.map((column) => (
                        <td 
                          key={column}
                          className="px-2 py-1 text-white border-r border-gray-700/50 max-w-[200px] font-semibold bg-amber-500/5"
                        >
                          <div className="truncate" title={formatCellValue(record[column])}>
                            {formatCellValue(record[column])}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                  
                  {/* Loading row for right columns */}
                  {loadingMore && (
                    <tr>
                      <td colSpan={rightPinnedColumns.length} className="px-3 py-4 text-center">
                        <span className="text-[hsl(var(--dark-3))]">Loading...</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {/* Status bar */}
      <div className="px-4 py-2 border-t border-gray-700/50 bg-[hsl(var(--dark-7))]">
        <div className="flex items-center justify-between text-xs text-[hsl(var(--dark-3))]">
          <div className="flex items-center space-x-4">
            {isGroupByMode ? (
              <span>
                Grouped by {groupByColumns.length} column{groupByColumns.length !== 1 ? 's' : ''}: {groupByColumns.join(', ')}
              </span>
            ) : (
              <span>
                Showing {visibleColumns.length + 2} columns ({scrollableColumns.length} scrollable + {rightPinnedColumns.length} pinned + 2 cards) of {(metadata?.essential_columns.length || 0) + 2} total
              </span>
            )}
            {selectedWeekStartDate && (
              <span className="flex items-center">
                <Calendar size={12} className="mr-1" />
                Week: {new Date(selectedWeekStartDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            )}
          </div>
          <div>
            {data.length.toLocaleString()} {isGroupByMode ? 'groups' : 'rows'} loaded
            {hasMore && " • Scroll down for more"}
          </div>
        </div>
      </div>
      
      {/* Group By Modal */}
      {showGroupByModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[hsl(var(--dark-7))] border border-gray-600 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-lg">Group By Columns</h3>
              <button
                onClick={handleGroupByCancel}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <p className="text-[hsl(var(--dark-3))] text-sm mb-4">
              Select string columns to group by. Aggregated values will be calculated for other columns.
            </p>
            
            <div className="max-h-60 overflow-y-auto mb-4">
              <div className="space-y-2">
                {getGroupByColumns().map((column) => (
                  <label
                    key={column}
                    className="flex items-center space-x-2 p-2 rounded hover:bg-[hsl(var(--dark-6))] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedGroupByColumns.includes(column)}
                      onChange={() => handleGroupByColumnToggle(column)}
                      className="rounded border-gray-600 text-purple-600 focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="text-white text-sm">
                      {column.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-xs text-[hsl(var(--dark-3))]">
                {selectedGroupByColumns.length} column{selectedGroupByColumns.length !== 1 ? 's' : ''} selected
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleGroupByCancel}
                  className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGroupBySubmit}
                  disabled={selectedGroupByColumns.length === 0}
                  className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply Group By
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
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
            <Search size={12} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[hsl(var(--dark-3))]" />
            <input
              type="text"
              placeholder={`Search ${displayName.toLowerCase()}...`}
              value={filter.searchTerm}
              onChange={(e) => onDiscreteSearch(column, e.target.value)}
              className="w-full pl-6 pr-2 py-1 text-xs bg-[hsl(var(--dark-7))] text-white border border-gray-600 rounded focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <div className="max-h-40 overflow-y-auto space-y-1">
            {filteredOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center space-x-2 text-xs hover:bg-[hsl(var(--dark-6))] p-1 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filter.selectedValues.includes(option.value)}
                  onChange={(e) => onDiscreteChange(column, option.value, e.target.checked)}
                  className="rounded border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-1"
                />
                <span className="flex-1 truncate text-white" title={option.value}>
                  {option.value}
                </span>
                <span className="text-[hsl(var(--dark-3))] text-xs">
                  {option.count.toLocaleString()}
                </span>
              </label>
            ))}
            
            {filter.loading && (
              <div className="flex items-center justify-center p-2">
                <Loader2 size={14} className="animate-spin text-[hsl(var(--dark-3))]" />
                <span className="text-xs text-[hsl(var(--dark-3))] ml-2">Loading...</span>
              </div>
            )}
            
            {filter.hasMore && !filter.loading && (
              <button
                onClick={() => onLoadMoreDiscrete(column)}
                className="w-full text-xs text-blue-400 hover:text-blue-300 p-1 text-center"
              >
                Load More...
              </button>
            )}
            
            {filteredOptions.length === 0 && !filter.loading && filter.searchTerm && (
              <div className="text-xs text-[hsl(var(--dark-3))] text-center p-2">
                No options match "{filter.searchTerm}"
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center text-xs text-[hsl(var(--dark-3))] border-t border-gray-700/50 pt-2">
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
          <div className="text-xs text-[hsl(var(--dark-3))]">
            Range: {range.min.toLocaleString()} - {range.max.toLocaleString()}
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-[hsl(var(--dark-3))] block mb-1">Min</label>
              <input
                type="number"
                placeholder={range.min.toString()}
                value={filter.min?.toString() || ''}
                onChange={(e) => onRangeChange(column, 'min', e.target.value ? parseFloat(e.target.value) : null)}
                className="w-full px-2 py-1 text-xs bg-[hsl(var(--dark-8))] text-white border border-gray-600 rounded focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-[hsl(var(--dark-3))] block mb-1">Max</label>
              <input
                type="number"
                placeholder={range.max.toString()}
                value={filter.max?.toString() || ''}
                onChange={(e) => onRangeChange(column, 'max', e.target.value ? parseFloat(e.target.value) : null)}
                className="w-full px-2 py-1 text-xs bg-[hsl(var(--dark-8))] text-white border border-gray-600 rounded focus:border-blue-500 focus:outline-none"
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
            className="w-full px-2 py-1 text-xs bg-[hsl(var(--dark-8))] text-white border border-gray-600 rounded focus:border-blue-500 focus:outline-none"
          />
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="border border-gray-700/50 rounded bg-[hsl(var(--dark-8))]">
      <button
        onClick={handleToggleExpand}
        className="w-full flex items-center justify-between p-2 hover:bg-[hsl(var(--dark-6))] transition-colors"
      >
        <span className="text-xs text-white font-medium truncate" title={displayName}>
          {displayName}
        </span>
        <div className="flex items-center space-x-1">
          <span className="text-xs text-[hsl(var(--dark-3))] capitalize">
            {filterType}
          </span>
          {isExpanded ? (
            <ChevronUp size={12} className="text-[hsl(var(--dark-3))]" />
          ) : (
            <ChevronDown size={12} className="text-[hsl(var(--dark-3))]" />
          )}
        </div>
      </button>
      
      {isExpanded && (
        <div className="p-2 border-t border-gray-700/50">
          {renderFilterContent()}
        </div>
      )}
    </div>
  );
};

export default ForecastMasterTable; 