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
  Plus,
  ChevronLeft,
  Unlink,
  PackagePlus,
  Trash2,
  Send
} from "lucide-react";
import { ForecastRepository } from "@/repository/forecast_repository";
import { ResponsiveBar } from '@nivo/bar';
import SalesChart from './SalesChart';
import AdjustmentDiffView, { DiffRow } from './AdjustmentDiffView';

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

interface ForecastMasterTableProps {
  consensusMode?: boolean;
  selectedWeekStartDate?: string;
}

// TypeScript interfaces for waterfall chart data
interface WaterfallDataPoint {
  id: string;
  value: number;
  start?: number;
  color: string;
  isTotal?: boolean;
}

interface WaterfallChartData {
  [key: string]: number | string;
  id: string;
  value: number;
  start: number;
  color: string;
  spacer: number;
  totalValue: number;
}

const ForecastMasterTable = ({ consensusMode = false, selectedWeekStartDate: propSelectedWeekStartDate }: ForecastMasterTableProps) => {
  const [data, setData] = useState<ForecastRecord[]>([]);
  const [metadata, setMetadata] = useState<ForecastMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [columnGroups, setColumnGroups] = useState<ColumnGroup[]>([]);
  
  // Week start date state - use prop if provided, otherwise use local state
  const [weekStartDates, setWeekStartDates] = useState<string[]>([]);
  const [localSelectedWeekStartDate, setLocalSelectedWeekStartDate] = useState<string>('');
  const [loadingWeekDates, setLoadingWeekDates] = useState(false);
  
  // Use prop if provided, otherwise fall back to local state
  const selectedWeekStartDate = propSelectedWeekStartDate || localSelectedWeekStartDate;
  const isWeekStartDateControlled = !!propSelectedWeekStartDate;
  
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
  
  // Bottom panel state for consensus mode
  const [activeBottomTab, setActiveBottomTab] = useState<'sales' | 'waterfall'>('sales');
  
  // Adjustment values for consensus mode - keyed by row identifier
  const [adjustmentValues, setAdjustmentValues] = useState<{ [key: string]: number | null }>({});
  
  // State to track which rows are in editing mode for adjustment column
  const [adjustmentEditingRows, setAdjustmentEditingRows] = useState<Set<string>>(new Set());
  
  // Submit popup state
  const [showSubmitPopup, setShowSubmitPopup] = useState(false);
  const [submittingAdjustment, setSubmittingAdjustment] = useState(false);
  
  // Helper function to get adjustment value for a row
  const getAdjustmentValue = (record: ForecastRecord, index: number): number | null => {
    const rowId = record.id || `${record.store_no || ''}-${record.article_id || ''}-${index}`;
    return adjustmentValues[rowId] || null;
  };
  
  // Calculate the difference between Adjusted Consensus and Interim Consensus
  const getAdjustmentDifference = (record: ForecastRecord, index: number): number | null => {
    const adjustedValue = getAdjustmentValue(record, index);
    if (adjustedValue === null || adjustedValue === 0) return null;
    
    // Use aggregated value in group by mode
    const consensusValue = isGroupByMode ? (record['Σconsensus_qty'] || 0) : (record.consensus_qty || 0);
    const interimConsensus = consensusValue;
    return adjustedValue - interimConsensus;
  };
  
  // Mock sales data for 2024 weeks 1-40 + forecast for weeks 41-52
  const salesData = useMemo(() => {
    // Get the selected row to influence the sales pattern
    const selectedRecord = data.find((record, index) => {
      const rowId = record.id || `${record.store_no || ''}-${record.article_id || ''}-${index}`;
      return selectedRows.has(rowId);
    });
    
    // Create a seed based on selected row properties for consistent but different patterns
    const getSeedFromRecord = (record: ForecastRecord | undefined): number => {
      if (!record) return 1; // Default seed
      
      // Create a numeric seed from various record properties
      const storeNo = record.store_no ? String(record.store_no).charCodeAt(0) : 100;
      const articleId = record.article_id ? String(record.article_id).charCodeAt(0) : 200;
      const forecastQty = record.forecast_qty || 1000;
      
      return (storeNo + articleId + forecastQty) % 1000 + 1; // Ensure positive seed
    };
    
    const seed = getSeedFromRecord(selectedRecord);
    
    // Simple seeded random function
    const seededRandom = (seed: number, iteration: number): number => {
      const x = Math.sin(seed * iteration) * 10000;
      return x - Math.floor(x);
    };
    
    const salesWeeks = [];
    const forecastWeeks = [];
    
    // Base sales level influenced by selected row
    const baseSalesMultiplier = selectedRecord ? 
      (1 + ((selectedRecord.forecast_qty || 10000) / 20000)) : 1.2; // Scale based on forecast qty
    
    // Generate sales data for weeks 1-40 (historical)
    for (let week = 1; week <= 40; week++) {
      // Generate mock sales data with some seasonal patterns and holiday effects
      let baseSales = (15000 * baseSalesMultiplier) + Math.sin((week / 52) * 2 * Math.PI) * 3000; // Seasonal pattern
      
      // Add holiday spikes and dips
      if ([11, 12, 13].includes(week)) baseSales *= 1.3; // Q1 holiday spike
      if ([19, 20].includes(week)) baseSales *= 0.8; // Spring dip
      if ([26, 27, 28].includes(week)) baseSales *= 1.4; // Summer spike
      if ([36, 37, 38].includes(week)) baseSales *= 1.5; // Back-to-school spike
      if ([15, 16].includes(week)) baseSales *= 0.7; // Mid-year dip
      
      // Add seeded randomness based on selected row
      baseSales += (seededRandom(seed, week) - 0.5) * 2000;
      
      salesWeeks.push({
        x: `W${week}`,
        y: Math.round(Math.max(baseSales, 1000)), // Ensure minimum sales
        week: week
      });
    }
    
    // Generate forecast data for weeks 41-52 (future)
    for (let week = 41; week <= 52; week++) {
      // Generate forecast data with slightly different pattern (more optimistic)
      let baseForecast = (16000 * baseSalesMultiplier) + Math.sin((week / 52) * 2 * Math.PI) * 3500; // Seasonal pattern
      
      // Add holiday forecast spikes for end of year
      if ([47, 48, 49, 50].includes(week)) baseForecast *= 1.6; // Black Friday / Holiday season
      if ([52].includes(week)) baseForecast *= 1.2; // New Year
      
      // Add seeded variance but less than historical
      baseForecast += (seededRandom(seed, week + 100) - 0.5) * 1000;
      
      forecastWeeks.push({
        x: `W${week}`,
        y: Math.round(Math.max(baseForecast, 1200)), // Ensure minimum forecast
        week: week
      });
    }
    
    return [
      {
        id: 'sales',
        color: '#3b82f6', // blue for sales
        data: salesWeeks
      },
      {
        id: 'forecast', 
        color: '#10b981', // green for forecast
        data: forecastWeeks
      }
    ];
  }, [data, selectedRows]); // Now depends on selectedRows to regenerate when selection changes
  
  // Waterfall data for consensus adjustments
  const waterfallData = useMemo(() => {
    // Get the selected row's forecast quantity or use default
    const selectedRecord = data.find((record, index) => {
      const rowId = record.id || `${record.store_no || ''}-${record.article_id || ''}-${index}`;
      return selectedRows.has(rowId);
    });
    
    const forecastQty =  10000; // Default 10,000 units
    
    // Generate mock adjustment data ensuring final value never goes below 0
    // and adjustments are in range (-4000, 4000)
    const generateSafeAdjustments = (initialValue: number, count: number) => {
      const adjustments = [];
      let runningTotal = initialValue;
      
      for (let i = 1; i <= count; i++) {
        // Generate adjustment in range (-4000, 4000)
        let adjustment = Math.floor(Math.random() * 8000) - 4000;
        
        // Ensure final value never goes below 0
        if (runningTotal + adjustment < 0) {
          adjustment = Math.max(-runningTotal + 100, -4000); // Keep at least 100 units
        }
        
        runningTotal += adjustment;
        adjustments.push({
          x: `Adjustment ${i}`,
          y: adjustment
        });
      }
      
      return adjustments;
    };
    
    const adjustments = generateSafeAdjustments(forecastQty, 20);
    
    // Get current adjustment from user input
    const currentAdjustment = selectedRecord ? getAdjustmentValue(selectedRecord, 0) || 0 : 0;
    
    // Create proper waterfall data with cascading effect using spacers
    const createWaterfallData = (): WaterfallChartData[] => {
      const result: WaterfallChartData[] = [];
      let cumulativeValue = 0;
      
      // Starting forecast bar (always starts from 0)
      result.push({
        id: 'Forecast Qty',
        value: forecastQty,
        spacer: 0, // No spacer for first bar
        start: 0,
        color: '#3b82f6', // blue for starting forecast
        totalValue: forecastQty
      });
      cumulativeValue = forecastQty;
      
      // Add adjustment bars (each starts where previous ended)
      adjustments.forEach((adj, index) => {
        const adjustmentValue = adj.y;
        const startPosition = cumulativeValue;
        
        if (adjustmentValue >= 0) {
          // Positive adjustment: spacer up to current level, then positive bar
          result.push({
            id: adj.x,
            value: adjustmentValue,
            spacer: startPosition,
            start: startPosition,
            color: '#10b981', // green for positive
            totalValue: startPosition + adjustmentValue
          });
        } else {
          // Negative adjustment: spacer up to final level, then positive bar representing the decrease
          const finalLevel = startPosition + adjustmentValue;
          result.push({
            id: adj.x,
            value: Math.abs(adjustmentValue),
            spacer: finalLevel,
            start: finalLevel,
            color: '#ef4444', // red for negative
            totalValue: finalLevel
          });
        }
        
        cumulativeValue += adjustmentValue;
      });
      
      // Add current adjustment if any
      if (currentAdjustment !== 0) {
        const startPosition = cumulativeValue;
        
        if (currentAdjustment >= 0) {
          result.push({
            id: 'Current Adjustment',
            value: currentAdjustment,
            spacer: startPosition,
            start: startPosition,
            color: '#10b981',
            totalValue: startPosition + currentAdjustment
          });
        } else {
          const finalLevel = startPosition + currentAdjustment;
          result.push({
            id: 'Current Adjustment',
            value: Math.abs(currentAdjustment),
            spacer: finalLevel,
            start: finalLevel,
            color: '#ef4444',
            totalValue: finalLevel
          });
        }
        
        cumulativeValue += currentAdjustment;
      }
      
      // Final total bar
      result.push({
        id: 'Final Total',
        value: cumulativeValue,
        spacer: 0,
        start: 0,
        color: '#8b5cf6', // purple for final total
        totalValue: cumulativeValue
      });
      
      return result;
    };

    return createWaterfallData();
  }, [data, selectedRows, adjustmentValues]);
  
  // Color function for waterfall chart
  const setWaterfallColor = ({ id, data: _data }: { id: string; data: any }) => {
    const transparent = "rgba(0,0,0,0)";
    return id !== "subtotal" || !!_data.paintSubtotal ? _data.color : transparent;
  };
  
  // Helper function to get display names for consensus mode
  const getDisplayColumnName = (column: string): string => {
    // Return display names for consensus mode
    if (consensusMode) {
      if (column === 'forecast_qty') {
        return 'Forecasted Qty';
      }
      if (column === 'consensus_qty') {
        return 'Interim Consensus';
      }
      if (column === 'Adjustment') {
        return 'Adjusted Consensus';
      }
      // Handle sigma columns for consensus mode
      if (column.startsWith('σ_forecast_qty')) {
        return column.replace('σ_forecast_qty', 'Σ Forecasted Qty');
      }
      if (column.startsWith('σ_consensus_qty')) {
        return column.replace('σ_consensus_qty', 'Σ Interim Consensus');
      }
      if (column.startsWith('Σforecast_qty')) {
        return column.replace('Σforecast_qty', 'Σ Forecasted Qty');
      }
      if (column.startsWith('Σconsensus_qty')) {
        return column.replace('Σconsensus_qty', 'Σ Interim Consensus');
      }
    }
    
    // Handle general sigma prefixes for group by mode (non-consensus)
    if (column.startsWith('Σ')) {
      return column; // Already has sigma prefix
    }
    
    // Handle consensus_qty in non-consensus mode (shouldn't normally appear but just in case)
    if (column === 'consensus_qty') {
      return 'Interim Consensus';
    }
    
    return column;
  };
  
  // Holiday indicators
  const holidayIndicators = [
    { week: 11, type: 'spike', label: 'Valentine\'s Day' },
    { week: 12, type: 'spike', label: 'Presidents Day' },
    { week: 19, type: 'dip', label: 'Spring Slowdown' },
    { week: 26, type: 'spike', label: 'Memorial Day' },
    { week: 27, type: 'spike', label: 'Summer Start' },
    { week: 36, type: 'spike', label: 'Back to School' },
    { week: 37, type: 'spike', label: 'Labor Day' },
    { week: 15, type: 'dip', label: 'Mid-Year Dip' }
  ];
  
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
    // Only load week dates if not controlled by props
    if (!isWeekStartDateControlled) {
      loadWeekStartDates();
    }
  }, [isWeekStartDateControlled]);
  
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
              setLocalSelectedWeekStartDate(dates[0]);
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
        
        // Add data quality filters to exclude invalid rows
        sqlQuery += ` AND store_no != 'nan' AND article_description != 'dummy' AND article_description != 'nan'`;
        
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
        
        // Add data quality filters to exclude invalid rows
        sqlQuery += ` AND store_no != 'nan' AND article_description != 'dummy' AND article_description != 'nan'`;
        
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
    
    // Initialize column visibility settings - all columns visible by default
    const initialVisibility: { [key: string]: boolean } = {};
    metadata.essential_columns.forEach(col => {
      initialVisibility[col] = true;
    });
    setVisibleColumnSettings(initialVisibility);
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
        
        // Add data quality filters to exclude invalid rows
        sqlQuery += ` AND store_no != 'nan' AND article_description != 'dummy' AND article_description != 'nan'`;
        
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
        
        // Add data quality filters to exclude invalid rows
        sqlQuery += ` AND store_no != 'nan' AND article_description != 'dummy' AND article_description != 'nan'`;
        
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
      .flatMap(group => group.columns)
      .filter(column => visibleColumnSettings[column] !== false);
  };
  
  // Separate columns into pinned and scrollable sections
  const getColumnSections = () => {
    if (isGroupByMode && groupByColumns.length > 0) {
      // In group by mode, only show grouped columns and sigma columns
      const pinnedColumns = [...groupByColumns];
      
      // Always pin sigma columns after group columns (both in consensus and non-consensus mode)
      pinnedColumns.push('Σforecast_qty', 'Σconsensus_qty');
      
      // Add adjustment column to the end of pinned columns in consensus mode
      const finalColumns = consensusMode ? [...pinnedColumns, 'Adjustment'] : [...pinnedColumns];
      
      return {
        allColumns: finalColumns
      };
    } else {
      // Regular mode
      const allVisibleColumns = getAllVisibleColumns();
      
      // Pin both forecast_qty and consensus_qty columns at the start if they're visible
      const pinnedColumns = ['forecast_qty', 'consensus_qty'].filter(col => visibleColumnSettings[col] !== false);
      
      // All other columns go after the pinned columns
      const scrollableColumns = allVisibleColumns.filter(col => !pinnedColumns.includes(col));
      
      // Only include pinned columns if they're actually visible
      const visiblePinnedColumns = pinnedColumns.filter(col => allVisibleColumns.includes(col));
      
      // Add adjustment column to the end of pinned columns in consensus mode
      const finalColumns = consensusMode ? [...visiblePinnedColumns, 'Adjustment', ...scrollableColumns] : [...visiblePinnedColumns, ...scrollableColumns];
      
      return {
        allColumns: finalColumns
      };
    }
  };
  
  const formatCellValue = (value: any, column?: string) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'number') {
      // Round up forecast_qty and consensus_qty to integers
      if (column === 'forecast_qty' || column === 'consensus_qty' || 
          column === 'Σforecast_qty' || column === 'Σconsensus_qty') {
        return Math.ceil(value).toLocaleString();
      }
      return value.toLocaleString();
    }
    return String(value);
  };
  
  const handleWeekStartDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newDate = event.target.value;
    setLocalSelectedWeekStartDate(newDate);
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
    if (!metadata) return { regularColumns: [], aggregatedColumns: [] };
    
    const regularColumns = metadata.essential_columns;
    const aggregatedColumns: string[] = [];
    
    // If in group by mode, also include aggregated columns that would be generated
    if (isGroupByMode && groupByColumns.length > 0) {
      metadata.essential_columns.forEach(col => {
        if (!groupByColumns.includes(col)) {
          const dataType = metadata.essential_columns_datatypes[col];
          if (dataType === 'string') {
            aggregatedColumns.push(`#${col}`);
          } else if (dataType === 'float' || dataType === 'integer') {
            aggregatedColumns.push(`Σ${col}`);
          }
        }
      });
    }
    
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
  
  // Row selection functions
  const handleRowClick = (record: ForecastRecord, index: number) => {
    const rowId = record.id || `${record.store_no || ''}-${record.article_id || ''}-${index}`;
    
    // Single selection - clear previous and select new
    setSelectedRows(new Set([rowId]));
  };
  
  const clearRowSelection = () => {
    setSelectedRows(new Set());
  };
  
  const isRowSelected = (record: ForecastRecord, index: number): boolean => {
    const rowId = record.id || `${record.store_no || ''}-${record.article_id || ''}-${index}`;
    return selectedRows.has(rowId);
  };
  
  // Handle adjustment value changes
  const handleAdjustmentChange = (record: ForecastRecord, index: number, value: string) => {
    const rowId = record.id || `${record.store_no || ''}-${record.article_id || ''}-${index}`;
    
    // Handle empty string as null (clear adjustment)
    if (value === '') {
      setAdjustmentValues(prev => ({
        ...prev,
        [rowId]: null
      }));
      return;
    }
    
    // Parse integer value
    const numValue = parseInt(value, 10);
    
    // Validate the input
    if (isNaN(numValue)) {
      // Invalid input - don't update
      return;
    }
    
    // Apply reasonable bounds (-999999 to 999999)
    const clampedValue = Math.max(-999999, Math.min(999999, numValue));
    
    // Update the adjustment value
    setAdjustmentValues(prev => ({
      ...prev,
      [rowId]: clampedValue
    }));
    
    // If the value was clamped, optionally show feedback
    if (clampedValue !== numValue) {
      console.warn(`Adjustment value clamped from ${numValue} to ${clampedValue}`);
    }
  };
  
  // Handle unlink button click (interim consensus is non-zero)
  const handleUnlinkClick = (record: ForecastRecord, index: number) => {
    const rowId = record.id || `${record.store_no || ''}-${record.article_id || ''}-${index}`;
    
    // Set the adjustment value to rounded up interim consensus
    // Use aggregated value in group by mode
    const consensusValue = isGroupByMode ? (record['Σconsensus_qty'] || 0) : (record.consensus_qty || 0);
    const interimConsensus = Math.ceil(consensusValue);
    setAdjustmentValues(prev => ({
      ...prev,
      [rowId]: interimConsensus
    }));
    
    // Enter editing mode for this row
    setAdjustmentEditingRows(prev => new Set(Array.from(prev).concat(rowId)));
  };
  
  // Handle package-plus button click (interim consensus is zero)
  const handlePackagePlusClick = (record: ForecastRecord, index: number) => {
    const rowId = record.id || `${record.store_no || ''}-${record.article_id || ''}-${index}`;
    
    // Set the adjustment value to rounded up forecast qty
    // Use aggregated value in group by mode
    const forecastValue = isGroupByMode ? (record['Σforecast_qty'] || 0) : (record.forecast_qty || 0);
    const forecastQty = Math.ceil(forecastValue);
    setAdjustmentValues(prev => ({
      ...prev,
      [rowId]: forecastQty
    }));
    
    // Enter editing mode for this row
    setAdjustmentEditingRows(prev => new Set(Array.from(prev).concat(rowId)));
  };
  
  // Handle delete button click (restore to icon buttons)
  const handleDeleteAdjustmentClick = (record: ForecastRecord, index: number) => {
    const rowId = record.id || `${record.store_no || ''}-${record.article_id || ''}-${index}`;
    
    // Clear the adjustment value
    setAdjustmentValues(prev => ({
      ...prev,
      [rowId]: null
    }));
    
    // Exit editing mode for this row
    setAdjustmentEditingRows(prev => {
      const newSet = new Set(prev);
      newSet.delete(rowId);
      return newSet;
    });
  };
  
  // Check if a row is in editing mode
  const isAdjustmentEditing = (record: ForecastRecord, index: number): boolean => {
    const rowId = record.id || `${record.store_no || ''}-${record.article_id || ''}-${index}`;
    return adjustmentEditingRows.has(rowId);
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
      return <div className="text-xs text-[hsl(var(--panel-error))]">No attributes</div>;
    }
    
    const [primaryAttribute, ...secondaryAttributes] = attributes;
    const primaryValue = formatCellValue(record[primaryAttribute], primaryAttribute);
    
    // Show debug info if primary value is empty
    if (!primaryValue) {
      return (
        <div className="text-xs text-[hsl(var(--panel-warning))]">
          Missing: {primaryAttribute}
        </div>
      );
    }
    
    return (
      <div className="space-y-0">
        <span className="font-semibold text-[hsl(var(--table-foreground))] text-xs leading-tight truncate" title={`${primaryAttribute}: ${primaryValue}`}>
          {primaryValue}{' '}
        </span>
        {secondaryAttributes.map((attr, index) => {
          const value = formatCellValue(record[attr], attr);
          return value ? (
            <span 
              key={attr} 
              className="text-[10px] text-[hsl(var(--table-muted-foreground))] leading-tight truncate" 
              title={`${attr}: ${value}`}
            >
              {index==0?'( ':''}{value}{index==secondaryAttributes.length-1 ?' )':', '}
            </span>
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
  
  // Handle submit button click to show popup
  const handleSubmitClick = () => {
    setShowSubmitPopup(true);
  };
  
  // Generate diff data from current adjustments
  const generateDiffData = () => {
    const diffRows: DiffRow[] = [];
    
    // Go through all loaded data and check for adjustments
    data.forEach((record, index) => {
      const adjustmentValue = getAdjustmentValue(record, index);
      const originalValue = record.forecast_qty || 0;
      
      if (adjustmentValue !== null && adjustmentValue !== originalValue) {
        const diff = adjustmentValue - originalValue;
        diffRows.push({
          storeNo: record.store_no || 'Unknown',
          storeName: `Store ${record.store_no || 'Unknown'}`,
          articleId: record.article_id || 'Unknown',
          articleDescription: record.article_description || 'Unknown Product',
          brand: record.brand || 'Unknown Brand',
          previousQty: originalValue,
          newQty: adjustmentValue,
          diff: diff,
          changeType: diff > 0 ? 'added' : diff < 0 ? 'removed' : 'modified'
        });
      }
    });
    
    // Sort by absolute diff value (largest changes first)
    return diffRows.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));
  };
  
  // Handle apply adjustment
  const handleApplyAdjustment = () => {
    setSubmittingAdjustment(true);
    // Simulate API call
    setTimeout(() => {
      setSubmittingAdjustment(false);
      setShowSubmitPopup(false);
      // Reset any adjustments if needed
      // In a real implementation, you would submit the adjustments to the backend
      console.log('Adjustments applied successfully');
    }, 2000);
  };
  
  // Handle discard adjustment
  const handleDiscardAdjustment = () => {
    setShowSubmitPopup(false);
  };
  
  if (loading && data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-[hsl(var(--table-background))]">
        <div className="flex items-center">
          <Loader2 className="animate-spin text-[hsl(var(--primary))] mr-2" size={24} />
          <span className="text-[hsl(var(--table-foreground))]">Loading forecast data...</span>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-[hsl(var(--table-background))]">
        <div className="flex items-center">
          <span className="text-[hsl(var(--panel-error))]">{error}</span>
        </div>
      </div>
    );
  }
  
  const visibleColumns = getAllVisibleColumns();
  const { allColumns } = getColumnSections();
  
  return (
    <div className="h-full flex flex-col bg-[hsl(var(--table-background))]">
      {/* Header */}
      <div className="p-4 border-b border-[hsl(var(--table-border))]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[hsl(var(--table-foreground))] font-semibold text-lg">
              {/* write month instead of week start date, also year */}
              {(consensusMode ? 'Adjustment' : 'Global Store-Article Forecast') + ' - ' + new Date(selectedWeekStartDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <p className="text-[hsl(var(--table-muted-foreground))] text-sm mt-1">
              {consensusMode ? "Click on a row to proceed" : "The main table shows the global store-article forecast. You can group by and filter as per your needs."}
              {selectedRows.size > 0 && (
                <span className="ml-2 text-[hsl(var(--primary))]">
                  • 1 row selected
                  {consensusMode && " - Consensus panel available below"}
                </span>
              )}
            </p>
          </div>
          
          
          {/* Column Group Controls and Manual Load Button */}
          <div className="flex items-center space-x-2">
             {/* Week Start Date Dropdown */}
             <div className="flex items-center">
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
            
            {/* Clear Selection Button */}
            {selectedRows.size > 0 && (
              <button
                onClick={clearRowSelection}
                className="px-3 py-1 rounded text-xs bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))]/90 flex items-center space-x-1"
                title="Clear selected row"
              >
                <X size={12} />
                <span>Clear Selection</span>
              </button>
            )}
            
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

            {/* Submit Button - Only show in consensus mode */}
            {consensusMode && (
              <button
                onClick={handleSubmitClick}
                className="px-3 py-1 rounded text-xs flex items-center space-x-1 transition-colors bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))]/90"
              >
                <Send size={14} />
                <span>Submit</span>
              </button>
            )}
          </div>
        </div>
      </div>
      
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
      
      {/* Main Content Area with Table and Bottom Panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Table Container with dynamic height based on consensus panel */}
        <div 
          ref={tableContainerRef}
          className="flex-1 overflow-y-auto overflow-x-auto relative"
          style={{ 
            height: consensusMode && selectedRows.size > 0 ? '100%' : '100%',
            minHeight: '300px'
          }}
        >
          {/* Single Table */}
          <div className="w-full">
            <table className="w-full text-sm">
                <thead className="sticky top-0 bg-[hsl(var(--table-header-background))] border-b border-[hsl(var(--table-border))] z-50">
                  <tr className="h-10">
                    {!isGroupByMode && (
                      <>
                        {/* Row number column */}
                        <th className="px-2 py-2 text-left text-[hsl(var(--table-muted-foreground))] font-medium w-[60px] border-r border-[hsl(var(--table-border))]">
                          #
                        </th>
                        
                        {/* Store Card Column */}
                        <th className="px-2 py-2 text-left text-[hsl(var(--table-header-foreground))] font-medium w-[150px] border-r border-[hsl(var(--table-border))] bg-[hsl(var(--table-card-store-background))] border-[hsl(var(--table-card-store-border))]">
                          <div className="flex items-center">
                            <span className="truncate" title="Store Information">
                              Store
                            </span>
                          </div>
                        </th>
                        
                        {/* Product Card Column */}
                        <th className="px-2 py-2 text-left text-[hsl(var(--table-header-foreground))] font-medium w-[150px] border-r border-[hsl(var(--table-border))] bg-[hsl(var(--table-card-product-background))] border-[hsl(var(--table-card-product-border))]">
                          <div className="flex items-center">
                            <span className="truncate" title="Product Information">
                              Product
                            </span>
                          </div>
                        </th>
                      </>
                    )}
                    
                  {/* All Data Columns */}
                  {allColumns.map((column) => {
                      const group = columnGroups.find(g => g.columns.includes(column));
                      const isSearchActive = activeSearches[column];
                    const isPinnedColumn = isGroupByMode ? 
                      (groupByColumns.includes(column) || ['Σforecast_qty', 'Σconsensus_qty'].includes(column)) : 
                      ['forecast_qty', 'consensus_qty'].includes(column);
                    const isAdjustmentColumn = column === 'Adjustment';
                      
                      return (
                        <th 
                          key={column}
                        className={`px-2 py-2 text-left text-[hsl(var(--table-header-foreground))] font-medium min-w-[120px] border-r border-[hsl(var(--table-border))] relative cursor-pointer hover:bg-[hsl(var(--table-row-hover))] transition-colors ${
                          isPinnedColumn 
                            ? 'bg-[hsl(var(--table-card-forecast-background))] border-[hsl(var(--table-card-forecast-border))]' 
                            : isAdjustmentColumn
                            ? 'bg-[hsl(var(--table-card-adjustment-background))] border-[hsl(var(--table-card-adjustment-border))]'
                            : group?.color || ''
                        }`}
                        onClick={isAdjustmentColumn ? undefined : () => handleColumnSort(column)}
                        >
                          {!isSearchActive ? (
                            <div className="flex items-center justify-between group">
                              <div className="flex items-center flex-1 min-w-0">
                                <span className="truncate hover:text-[hsl(var(--primary))]" title={getDisplayColumnName(column)}>
                                  {getDisplayColumnName(column)}
                                </span>
                                {/* Show active search term inline */}
                                {activeSearches[column] && (
                                  <div className="flex items-center space-x-1 ml-2">
                                    <span className="text-xs text-[hsl(var(--primary))] bg-[hsl(var(--primary))]/20 px-1 rounded whitespace-nowrap">
                                      "{activeSearches[column]}"
                                    </span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleClearSearch(column);
                                      }}
                                      className="text-xs text-[hsl(var(--panel-error))] hover:text-[hsl(var(--panel-error))]/80 flex-shrink-0"
                                      title="Clear search"
                                    >
                                      ×
                                    </button>
                                  </div>
                                )}
                                {sortState.column === column && (
                                  <span className="ml-1 text-xs font-bold text-[hsl(var(--primary))] flex-shrink-0">{getSortIcon(column)}</span>
                                )}
                              </div>
                              <div className="flex items-center ml-1">
                              {isColumnSearchable(column) && !isAdjustmentColumn && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const searchValue = searchValues[column];
                                      if (searchValue?.trim()) {
                                        handleSearchExecute(column);
                                      } else {
                                        setSearchValues({ ...searchValues, [column]: '' });
                                        const searchContainer = e.currentTarget.closest('th');
                                        const searchInput = searchContainer?.querySelector('input');
                                        setTimeout(() => searchInput?.focus(), 0);
                                      }
                                    }}
                                    className="px-2 py-1 text-xs bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded hover:bg-[hsl(var(--primary))]/90 focus:outline-none flex-shrink-0 h-[26px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Search"
                                  >
                                    <Search size={12} />
                                  </button>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1">
                              <input
                                type="text"
                                placeholder={`Search ${getDisplayColumnName(column)}...`}
                                value={searchValues[column] || ''}
                                onChange={(e) => handleSearchChange(column, e.target.value)}
                                onKeyPress={(e) => handleSearchKeyPress(column, e)}
                                className="flex-1 px-2 py-1 text-xs bg-[hsl(var(--table-input-background))] border border-[hsl(var(--table-input-border))] rounded text-[hsl(var(--table-foreground))] placeholder-[hsl(var(--table-muted-foreground))] focus:outline-none focus:border-[hsl(var(--primary))] min-w-0"
                                autoFocus
                              />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSearchExecute(column);
                                }}
                                className="px-2 py-1 text-xs bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded hover:bg-[hsl(var(--primary))]/90 focus:outline-none flex-shrink-0 h-[26px] flex items-center justify-center"
                                title="Search"
                              >
                                <Search size={12} />
                              </button>
                            </div>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                
                <tbody>
                  {data.map((record, index) => {
                    const isSelected = isRowSelected(record, index);
                    return (
                      <tr 
                        key={record.id || index}
                        className={`border-b border-[hsl(var(--table-border))] transition-colors cursor-pointer ${
                          isSelected 
                            ? 'bg-[hsl(var(--table-row-selected))] border-t border-t-[hsl(var(--table-row-selected-border))]' 
                            : 'hover:bg-[hsl(var(--table-row-hover))]'
                        }`}
                        onClick={() => handleRowClick(record, index)}
                      >
                      {!isGroupByMode && (
                        <>
                          {/* Row number */}
                          <td className="px-2 py-1 text-[hsl(var(--table-muted-foreground))] border-r border-[hsl(var(--table-border))] font-mono text-xs w-[60px]">
                            {index + 1}
                          </td>
                  
                          {/* Store Card */}
                          <td className="px-2 py-1 border-r border-[hsl(var(--table-border))] w-[150px] bg-[hsl(var(--table-card-store-background))] align-top">
                            {metadata?.store_card_attributes ? (
                              renderCardContent(record, metadata.store_card_attributes)
                            ) : (
                              <div className="text-xs text-[hsl(var(--table-muted-foreground))]">No store metadata</div>
                            )}
                          </td>
                          
                          {/* Product Card */}
                          <td className="px-2 py-1 border-r border-[hsl(var(--table-border))] w-[150px] bg-[hsl(var(--table-card-product-background))] align-top">
                            {metadata?.product_card_attributes ? (
                              renderCardContent(record, metadata.product_card_attributes)
                            ) : (
                              <div className="text-xs text-[hsl(var(--table-muted-foreground))]">No product metadata</div>
                                  )}
                          </td>
                        </>
                      )}
                      
                      {/* All Data Columns */}
                      {allColumns.map((column) => {
                        const isPinnedColumn = isGroupByMode ? 
                          (groupByColumns.includes(column) || ['Σforecast_qty', 'Σconsensus_qty'].includes(column)) : 
                          ['forecast_qty', 'consensus_qty'].includes(column);
                        const isAdjustmentColumn = column === 'Adjustment';
                        
                      return (
                            <td 
                              key={column}
                            className={`px-2 py-1 text-[hsl(var(--table-foreground))] border-r border-[hsl(var(--table-border))] max-w-[200px] ${
                              isPinnedColumn ? 'font-semibold bg-[hsl(var(--table-card-forecast-background))]' : 
                              isAdjustmentColumn ? 'font-semibold bg-[hsl(var(--table-card-adjustment-background))]' : ''
                            }`}
                          >
                            {isAdjustmentColumn ? (
                              // Adjustment column content
                              <div className="relative">
                                {isAdjustmentEditing(record, index) ? (
                                  // Editing mode: show input with add/subtract/delete buttons
                                  <div className="flex items-center space-x-1">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Select the row first
                                        handleRowClick(record, index);
                                        const currentValue = getAdjustmentValue(record, index) || 0;
                                        handleAdjustmentChange(record, index, String(currentValue - 1));
                                      }}
                                      className="p-1 text-xs bg-[hsl(var(--table-button-background))] text-[hsl(var(--table-foreground))] rounded hover:bg-[hsl(var(--table-button-hover))] focus:outline-none flex-shrink-0 h-[24px] w-[24px] flex items-center justify-center border border-[hsl(var(--table-border))]"
                                      title="Subtract 1"
                                    >
                                      <Minus size={12} />
                                    </button>
                                    <input
                                      type="number"
                                      value={getAdjustmentValue(record, index) || ''}
                                      onChange={(e) => handleAdjustmentChange(record, index, e.target.value)}
                                      onClick={(e) => {
                                        // Select the row when clicking on the input
                                        handleRowClick(record, index);
                                      }}
                                      onMouseDown={(e) => {
                                        // Prevent row click during actual input interaction
                                        e.stopPropagation();
                                      }}
                                      onFocus={(e) => e.target.select()}
                                      className={`flex-1 px-2 py-1 text-xs border rounded-md focus:outline-none transition-all duration-200 text-center font-medium min-w-0 ${
                                        (() => {
                                          const difference = getAdjustmentDifference(record, index);
                                          if (difference === null) return 'bg-[hsl(var(--table-input-background))] border-[hsl(var(--table-input-border))] text-[hsl(var(--table-foreground))] focus:border-[hsl(var(--primary))] focus:bg-[hsl(var(--table-input-background))]';
                                          if (difference > 0) return 'bg-[hsl(var(--panel-success))]/20 border-[hsl(var(--panel-success))]/50 text-[hsl(var(--panel-success))] focus:border-[hsl(var(--panel-success))] focus:bg-[hsl(var(--panel-success))]/30';
                                          if (difference < 0) return 'bg-[hsl(var(--panel-error))]/20 border-[hsl(var(--panel-error))]/50 text-[hsl(var(--panel-error))] focus:border-[hsl(var(--panel-error))] focus:bg-[hsl(var(--panel-error))]/30';
                                          return 'bg-[hsl(var(--table-input-background))] border-[hsl(var(--table-input-border))] text-[hsl(var(--table-foreground))] focus:border-[hsl(var(--primary))] focus:bg-[hsl(var(--table-input-background))]';
                                        })()
                                      }`}
                                      placeholder="0"
                                      step="1"
                                    />
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Select the row first
                                        handleRowClick(record, index);
                                        const currentValue = getAdjustmentValue(record, index) || 0;
                                        handleAdjustmentChange(record, index, String(currentValue + 1));
                                      }}
                                      className="p-1 text-xs bg-[hsl(var(--table-button-background))] text-[hsl(var(--table-foreground))] rounded hover:bg-[hsl(var(--table-button-hover))] focus:outline-none flex-shrink-0 h-[24px] w-[24px] flex items-center justify-center border border-[hsl(var(--table-border))]"
                                      title="Add 1"
                                    >
                                      <Plus size={12} />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Select the row first
                                        handleRowClick(record, index);
                                        handleDeleteAdjustmentClick(record, index);
                                      }}
                                      className="p-1 text-xs bg-[hsl(var(--panel-muted))] text-[hsl(var(--panel-muted-foreground))] rounded hover:bg-[hsl(var(--panel-muted))]/90 focus:outline-none flex-shrink-0 h-[24px] w-[24px] flex items-center justify-center"
                                      title="Cancel"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                ) : (
                                  // Default mode: show icon buttons
                                  <div className="flex items-center justify-center">
                                    {(() => {
                                      // Use aggregated value in group by mode
                                      const consensusValue = isGroupByMode ? (record['Σconsensus_qty'] || 0) : (record.consensus_qty || 0);
                                      return consensusValue !== 0 ? (
                                        // Show unlink button when interim consensus is non-zero
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            // Select the row first
                                            handleRowClick(record, index);
                                            handleUnlinkClick(record, index);
                                          }}
                                          className="p-1 text-xs bg-[hsl(var(--table-button-background))] text-[hsl(var(--table-foreground))] rounded hover:bg-[hsl(var(--table-button-hover))] focus:outline-none flex-shrink-0 h-[28px] w-[28px] flex items-center justify-center border border-[hsl(var(--table-border))]"
                                          title="Adjust from Interim Consensus"
                                        >
                                          <Unlink size={14} />
                                        </button>
                                      ) : (
                                        // Show package-plus button when interim consensus is zero
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            // Select the row first
                                            handleRowClick(record, index);
                                            handlePackagePlusClick(record, index);
                                          }}
                                          className="p-1 text-xs bg-[hsl(var(--table-button-background))] text-[hsl(var(--table-foreground))] rounded hover:bg-[hsl(var(--table-button-hover))] focus:outline-none flex-shrink-0 h-[28px] w-[28px] flex items-center justify-center border border-[hsl(var(--table-border))]"
                                          title="Adjust from Forecast Qty"
                                        >
                                          <PackagePlus size={14} />
                                        </button>
                                      );
                                    })()}
                                  </div>
                                )}
                              </div>
                            ) : (
                              // Regular column content
                              <div className="truncate" title={formatCellValue(record[column], column)}>
                                {formatCellValue(record[column], column)}
                              </div>
                            )}
                            </td>
                        );
                      })}
                        </tr>
                      );
                    })}
                    
                {/* Loading row */}
                    {loadingMore && (
                      <tr>
                    <td colSpan={(!isGroupByMode ? 3 : 0) + allColumns.length} className="px-3 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <Loader2 className="animate-spin text-[hsl(var(--primary))] mr-2" size={16} />
                          <span className="text-[hsl(var(--table-muted-foreground))]">Loading...</span>
                      </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
          </div>
        </div>
        
        {/* Status bar */}
        <div className="px-4 py-2 border-t border-[hsl(var(--table-border))] bg-[hsl(var(--table-header-background))]">
          <div className="flex items-center justify-between text-xs text-[hsl(var(--table-muted-foreground))]">
            <div className="flex items-center space-x-4">
              {isGroupByMode ? (
                <span>
                  Grouped by {groupByColumns.length} column{groupByColumns.length !== 1 ? 's' : ''}: {groupByColumns.join(', ')}
                </span>
              ) : (
                <span>
                  Showing {allColumns.length + (!isGroupByMode ? 2 : 0)} columns of {(metadata?.essential_columns.length || 0) + (!isGroupByMode ? 2 : 0) + (consensusMode ? 1 : 0)} total
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
        
        {/* Consensus Bottom Panel - Only show in consensus mode when a row is selected */}
        {consensusMode && selectedRows.size > 0 && (
          <div className="border-t border-[hsl(var(--table-border))] bg-[hsl(var(--table-header-background))] flex flex-col" style={{ height: '50%' }}>
            {/* Tab Header */}
            <div className="flex border-b border-[hsl(var(--table-border))] bg-[hsl(var(--table-background))]">
              <button
                onClick={() => setActiveBottomTab('sales')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeBottomTab === 'sales'
                    ? 'text-[hsl(var(--table-foreground))] border-b-2 border-[hsl(var(--primary))] bg-[hsl(var(--table-row-hover))]'
                    : 'text-[hsl(var(--table-muted-foreground))] hover:text-[hsl(var(--table-foreground))] hover:bg-[hsl(var(--table-row-hover))]'
                }`}
              >
                Sales
              </button>
              <button
                onClick={() => setActiveBottomTab('waterfall')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeBottomTab === 'waterfall'
                    ? 'text-[hsl(var(--table-foreground))] border-b-2 border-[hsl(var(--primary))] bg-[hsl(var(--table-row-hover))]'
                    : 'text-[hsl(var(--table-muted-foreground))] hover:text-[hsl(var(--table-foreground))] hover:bg-[hsl(var(--table-row-hover))]'
                }`}
              >
                Consensus Waterfall
              </button>
            </div>
            
            {/* Tab Content */}
            <div className="flex-1 p-4 overflow-hidden">
              {activeBottomTab === 'sales' ? (
                <div className="h-full flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-[hsl(var(--table-foreground))] font-medium text-lg mb-1">Weekly Sales Data 2024</h3>
                    <p className="text-[hsl(var(--table-muted-foreground))] text-sm">
                      Sales performance across weeks 1-40 with holiday indicators
                    </p>
                  </div>
                  
                  <div className="flex-1 relative">
                    <SalesChart 
                      data={data} 
                      selectedRows={selectedRows}
                      selectedRecord={data.find((record, index) => {
                        const rowId = record.id || `${record.store_no || ''}-${record.article_id || ''}-${index}`;
                        return selectedRows.has(rowId);
                      })}
                    />
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-[hsl(var(--table-foreground))] font-medium text-lg mb-1">Consensus Waterfall</h3>
                    <p className="text-[hsl(var(--table-muted-foreground))] text-sm">
                      Forecast adjustments breakdown showing cumulative impact
                    </p>
                  </div>
                  
                  <div className="flex-1 relative mb-4">
                    <ResponsiveBar
                      data={waterfallData}
                      keys={['spacer', 'value']}
                      indexBy="id"
                      layout="horizontal"
                      margin={{ top: 20, right: 80, bottom: 60, left: 150 }}
                      padding={0.3}
                      valueScale={{ type: 'linear' }}
                      indexScale={{ type: 'band', round: true }}
                      colors={({ id, data }) => {
                        if (id === 'spacer') return 'transparent';
                        return data.color;
                      }}
                      borderColor={{
                        from: 'color',
                        modifiers: [['darker', 0]]
                      }}
                      borderWidth={0}
                      enableLabel={false}
                      axisTop={null}
                      axisRight={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Quantity',
                        legendPosition: 'middle',
                        legendOffset: 60,
                        format: value => `${(Number(value) / 1000).toFixed(0)}K`
                      }}
                      axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Quantity',
                        legendPosition: 'middle',
                        legendOffset: 50,
                        format: value => `${(Number(value) / 1000).toFixed(0)}K`
                      }}
                      axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Adjustment Steps',
                        legendPosition: 'middle',
                        legendOffset: -120
                      }}
                      layers={['grid', 'axes', 'bars', 'markers', 'legends']}
                      theme={{
                        background: 'transparent',
                        text: {
                          fontSize: 11,
                          fill: '#9ca3af',
                          outlineWidth: 0,
                          outlineColor: 'transparent'
                        },
                        axis: {
                          domain: {
                            line: {
                              stroke: '#374151',
                              strokeWidth: 1
                            }
                          },
                          legend: {
                            text: {
                              fontSize: 12,
                              fill: '#9ca3af'
                            }
                          },
                          ticks: {
                            line: {
                              stroke: '#374151',
                              strokeWidth: 1
                            },
                            text: {
                              fontSize: 11,
                              fill: '#9ca3af'
                            }
                          }
                        },
                        grid: {
                          line: {
                            stroke: '#374151',
                            strokeWidth: 1,
                            strokeOpacity: 0.3
                          }
                        },
                        tooltip: {
                          container: {
                            background: '#1f2937',
                            color: '#ffffff',
                            fontSize: '12px',
                            border: '1px solid #374151',
                            borderRadius: '4px'
                          }
                        }
                      }}
                      tooltip={({ data, value, id }) => {
                        const barData = data as WaterfallChartData;
                        if (id === 'spacer') return null; // Don't show tooltip for spacer bars
                        
                        return (
                          <div className="bg-[hsl(var(--panel-background))] p-3 rounded border border-[hsl(var(--panel-border))] text-[hsl(var(--panel-foreground))] text-xs">
                            <div className="font-medium mb-1">{barData.id}</div>
                            {barData.id === 'Forecast Qty' || barData.id === 'Final Total' ? (
                              <div>Total Amount: {Number(barData.totalValue).toLocaleString()}</div>
                            ) : (
                              <>
                                <div className={`${barData.color === '#10b981' ? 'text-[hsl(var(--panel-success))]' : 'text-[hsl(var(--panel-error))]'}`}>
                                  {barData.color === '#10b981' ? '+' : '-'}{Number(barData.value).toLocaleString()}
                                </div>
                                <div className="text-[hsl(var(--panel-muted-foreground))]">
                                  Running Total: {Number(barData.totalValue).toLocaleString()}
                                </div>
                              </>
                            )}
                          </div>
                        );
                      }}
                      animate={true}
                      motionConfig="wobbly"
                    />
                  </div>
                  
                  {/* Legend positioned below the chart */}
                  <div className="flex justify-center">
                    <div className="bg-[hsl(var(--panel-background))] p-3 rounded border border-[hsl(var(--panel-border))] flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-[hsl(var(--primary))] rounded"></div>
                        <span className="text-[hsl(var(--primary))] text-xs">Forecast</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-[hsl(var(--panel-success))] rounded"></div>
                        <span className="text-[hsl(var(--panel-success))] text-xs">Positive Adj.</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-[hsl(var(--panel-error))] rounded"></div>
                        <span className="text-[hsl(var(--panel-error))] text-xs">Negative Adj.</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-[hsl(var(--secondary))] rounded"></div>
                        <span className="text-[hsl(var(--secondary))] text-xs">Final Total</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
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
                  <div>
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
                  </div>
                  
                  {/* Product Parameters */}
                  <div>
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
                  </div>
                  
                  {/* Forecast Parameters */}
                  <div>
                    <h5 className="text-[hsl(var(--table-card-forecast-border))] font-medium text-xs mb-2 flex items-center">
                      <div className="w-2 h-2 bg-[hsl(var(--table-card-forecast-border))] rounded mr-1"></div>
                      Forecast Parameters
                    </h5>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {metadata?.essential_columns
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
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between border-t border-[hsl(var(--panel-border))] pt-4">
              <div className="text-xs text-[hsl(var(--panel-muted-foreground))]">
                {Object.values(visibleColumnSettings).filter(Boolean).length} of {metadata?.essential_columns.length || 0} columns visible
              </div>
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
      
      {/* Submit Popup */}
      {showSubmitPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[hsl(var(--table-background))] rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden mx-4">
            {/* Popup Header */}
            <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--table-border))]">
              <div>
                <h2 className="text-[hsl(var(--table-foreground))] font-semibold text-lg">
                  Adjustment Preview
                </h2>
                <p className="text-[hsl(var(--table-muted-foreground))] text-sm mt-1">
                  Review changes before submitting
                </p>
              </div>
              <button
                onClick={handleDiscardAdjustment}
                className="text-[hsl(var(--table-muted-foreground))] hover:text-[hsl(var(--table-foreground))] transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Popup Content */}
            <div className="flex-1 overflow-auto max-h-[70vh]">
              <AdjustmentDiffView
                adjustmentId="consensus-preview"
                adjustmentTitle="Adjustment Preview"
                selectedWeekStartDate={selectedWeekStartDate}
                manualDiffData={generateDiffData()}
              />
            </div>
            
            {/* Popup Actions */}
            <div className="flex items-center justify-end space-x-3 p-4 border-t border-[hsl(var(--table-border))] bg-[hsl(var(--table-header-background))]">
              <button
                onClick={handleDiscardAdjustment}
                disabled={submittingAdjustment}
                className="px-4 py-2 text-sm border border-[hsl(var(--table-border))] text-[hsl(var(--table-foreground))] hover:bg-[hsl(var(--table-button-hover))] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Discard
              </button>
              <button
                onClick={handleApplyAdjustment}
                disabled={submittingAdjustment}
                className="px-4 py-2 text-sm bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))]/90 rounded transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingAdjustment && <Loader2 size={16} className="animate-spin" />}
                <span>{submittingAdjustment ? 'Applying...' : 'Apply Adjustment'}</span>
              </button>
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

export default ForecastMasterTable; 