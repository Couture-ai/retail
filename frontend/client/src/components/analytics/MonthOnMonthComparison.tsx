import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TrendingUp, Calendar, BarChart3, Loader2, AlertCircle, RefreshCw, Search, X } from 'lucide-react';
import { useProject } from '@/context/ProjectProvider';

interface MonthData {
  month_year: string;
  week_start_date: string;
  forecast_qty: {
    bb?: number; // Business Baseline
    cb?: number; // Couture Baseline
  };
  sold_qty: number;
}

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

  // Load initial data on component mount
  useEffect(() => {
    loadInitialData();
  }, [activeSearches, activeUnifiedSearch]);

  const parseStringifiedForecastQty = (forecastQtyString: string | any): { bb?: number; cb?: number } => {
    try {
      if (typeof forecastQtyString === 'object' && forecastQtyString !== null) {
        return {
          bb: forecastQtyString.bb || undefined,
          cb: forecastQtyString.cb || undefined
        };
      }
      
      if (typeof forecastQtyString === 'string') {
        const parsed = JSON.parse(forecastQtyString);
        return {
          bb: parsed.bb || undefined,
          cb: parsed.cb || undefined
        };
      }
      
      return { bb: undefined, cb: undefined };
    } catch (error) {
      console.warn('Failed to parse forecast_qty:', forecastQtyString, error);
      return { bb: undefined, cb: undefined };
    }
  };

  const parseMonthData = (monthDataString: string | any): MonthData => {
    try {
      // If it's already an object, return it
      if (typeof monthDataString === 'object' && monthDataString !== null) {
        return {
          month_year: monthDataString.month_year || '',
          week_start_date: monthDataString.week_start_date || '',
          forecast_qty: parseStringifiedForecastQty(monthDataString.forecast_qty),
          sold_qty: monthDataString.sold_qty || 0
        };
      }
      
      // If it's a string, parse it
      if (typeof monthDataString === 'string') {
        const parsed = JSON.parse(monthDataString);
        return {
          month_year: parsed.month_year || '',
          week_start_date: parsed.week_start_date || '',
          forecast_qty: parseStringifiedForecastQty(parsed.forecast_qty),
          sold_qty: parsed.sold_qty || 0
        };
      }
      
      return {
        month_year: '',
        week_start_date: '',
        forecast_qty: { bb: undefined, cb: undefined },
        sold_qty: 0
      };
    } catch (error) {
      console.warn('Failed to parse month data:', monthDataString, error);
      return {
        month_year: '',
        week_start_date: '',
        forecast_qty: { bb: undefined, cb: undefined },
        sold_qty: 0
      };
    }
  };

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      setPage(0);
      
      let sqlQuery = `
        SELECT 
          store_no,
          MAX(city) as city,
          MAX(state) as state,
          MAX(region) as region,
          MAX(store_type) as store_type,
          MAX(channel) as channel,
          article_id,
          MAX(article_description) as article_description,
          MAX(brand) as brand,
          MAX(super_category) as super_category,
          MAX(segment) as segment,
          MAX(division) as division,
          MAX(vertical) as vertical,
          ARRAY_AGG(
            JSON_BUILD_OBJECT(
              'month_year', month_year,
              'week_start_date', week_start_date,
              'forecast_qty', forecast_qty,
              'sold_qty', sold_qty
            ) ORDER BY month_year
          ) as months
        FROM forecast 
        WHERE 1=1
      `;
      
      // Add search conditions
      const searchConditions = Object.entries(activeSearches)
        .filter(([_, value]) => value.trim() !== '')
        .map(([column, value]) => `${column} ILIKE '%${value}%'`);

      // Add unified search conditions (searches across multiple columns)
      if (activeUnifiedSearch.trim() !== '') {
        // Split by semicolon and trim each term
        const searchTerms = activeUnifiedSearch.split(';')
          .map(term => term.trim())
          .filter(term => term !== '');
        
        if (searchTerms.length > 0) {
          // Create AND conditions for each search term
          const unifiedConditions = searchTerms.map(term => `(
            store_no ILIKE '%${term}%' OR 
            city ILIKE '%${term}%' OR 
            state ILIKE '%${term}%' OR 
            region ILIKE '%${term}%' OR 
            article_id ILIKE '%${term}%' OR 
            article_description ILIKE '%${term}%' OR 
            brand ILIKE '%${term}%' OR 
            segment ILIKE '%${term}%' OR 
            division ILIKE '%${term}%' OR 
            vertical ILIKE '%${term}%' OR 
            channel ILIKE '%${term}%'
          )`);
          
          // Join multiple terms with AND
          const combinedUnifiedCondition = `(${unifiedConditions.join(' AND ')})`;
          searchConditions.push(combinedUnifiedCondition);
        }
      }

      if (searchConditions.length > 0) {
        sqlQuery += ` AND ${searchConditions.join(' AND ')}`;
      }
      
      sqlQuery += ` GROUP BY store_no, article_id ORDER BY store_no, article_id LIMIT 50`;
      
      const stateSetters = {
        setLoading: (loading: boolean) => setLoading(loading),
        setError: (error: string | null) => setError(error),
        setData: (response: any) => {
          if (response && response.data) {
            // Process the grouped data
            console.log('Raw response data:', response.data);
            const processedData = response.data.map((record: any) => {
              console.log('Processing record:', record);
              console.log('Raw months array:', record.months);
              
              const processedRecord = {
                ...record,
                months: record.months.map((monthData: any) => {
                  console.log('Raw month data:', monthData);
                  const parsed = parseMonthData(monthData);
                  console.log('Parsed month data:', parsed);
                  return parsed;
                })
              };
              
              console.log('Final processed record:', processedRecord);
              return processedRecord;
            });
            setData(processedData);
            setHasMore(response.data.length === 50);
            setPage(1);
          }
        }
      };
      
      await forecastRepository.executeForecastNewSqlQuery({ sql_query: sqlQuery }, stateSetters);
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
      const offset = page * 50;
      let sqlQuery = `
        SELECT 
          store_no,
          MAX(city) as city,
          MAX(state) as state,
          MAX(region) as region,
          MAX(store_type) as store_type,
          MAX(channel) as channel,
          article_id,
          MAX(article_description) as article_description,
          MAX(brand) as brand,
          MAX(super_category) as super_category,
          MAX(segment) as segment,
          MAX(division) as division,
          MAX(vertical) as vertical,
          ARRAY_AGG(
            JSON_BUILD_OBJECT(
              'month_year', month_year,
              'week_start_date', week_start_date,
              'forecast_qty', forecast_qty,
              'sold_qty', sold_qty
            ) ORDER BY month_year
          ) as months
        FROM forecast 
        WHERE 1=1
      `;
      
      // Add search conditions
      const searchConditions = Object.entries(activeSearches)
        .filter(([_, value]) => value.trim() !== '')
        .map(([column, value]) => `${column} ILIKE '%${value}%'`);

      // Add unified search conditions (searches across multiple columns)
      if (activeUnifiedSearch.trim() !== '') {
        // Split by semicolon and trim each term
        const searchTerms = activeUnifiedSearch.split(';')
          .map(term => term.trim())
          .filter(term => term !== '');
        
        if (searchTerms.length > 0) {
          // Create AND conditions for each search term
          const unifiedConditions = searchTerms.map(term => `(
            store_no ILIKE '%${term}%' OR 
            city ILIKE '%${term}%' OR 
            state ILIKE '%${term}%' OR 
            region ILIKE '%${term}%' OR 
            article_id ILIKE '%${term}%' OR 
            article_description ILIKE '%${term}%' OR 
            brand ILIKE '%${term}%' OR 
            segment ILIKE '%${term}%' OR 
            division ILIKE '%${term}%' OR 
            vertical ILIKE '%${term}%' OR 
            channel ILIKE '%${term}%'
          )`);
          
          // Join multiple terms with AND
          const combinedUnifiedCondition = `(${unifiedConditions.join(' AND ')})`;
          searchConditions.push(combinedUnifiedCondition);
        }
      }

      if (searchConditions.length > 0) {
        sqlQuery += ` AND ${searchConditions.join(' AND ')}`;
      }
      
      sqlQuery += ` GROUP BY store_no, article_id ORDER BY store_no, article_id LIMIT 50 OFFSET ${offset}`;
      
      const stateSetters = {
        setLoading: () => {},
        setError: (error: string | null) => setError(error),
        setData: (response: any) => {
          if (response && response.data) {
            // Process the grouped data
            const processedData = response.data.map((record: any) => ({
              ...record,
              months: record.months.map((monthData: any) => parseMonthData(monthData))
            }));
            setData(prevData => [...prevData, ...processedData]);
            setHasMore(response.data.length === 50);
            setPage(prevPage => prevPage + 1);
          } else {
            setHasMore(false);
          }
        }
      };
      
      await forecastRepository.executeForecastNewSqlQuery({ sql_query: sqlQuery }, stateSetters);
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
    
    // Reset data and reload
    setData([]);
    setPage(0);
    setHasMore(true);
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
    
    // Reset data and reload
    setData([]);
    setPage(0);
    setHasMore(true);
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
    
    // Reset data and reload
    setData([]);
    setPage(0);
    setHasMore(true);
  };

  // Handle clearing unified search
  const handleClearUnifiedSearch = () => {
    setUnifiedSearchValue('');
    setActiveUnifiedSearch('');
    
    // Reset data and reload
    setData([]);
    setPage(0);
    setHasMore(true);
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

  if (loading && data.length === 0) {
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
          <Calendar size={16} />
          <span className="text-sm">Grouped by Store & Article</span>
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

      {/* Table Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div 
          ref={tableContainerRef}
          className="flex-1 overflow-y-auto overflow-x-auto"
        >
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 bg-[hsl(var(--panel-header-background))] border-b border-[hsl(var(--panel-border))] z-50">
              <tr className="h-12">
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
                
                {/* Month Data */}
                <th className="px-3 py-2 text-left text-[hsl(var(--panel-header-foreground))] font-medium border-r border-[hsl(var(--panel-border))] bg-[hsl(var(--panel-header-background))] bg-opacity-100 backdrop-blur-md min-w-[100px]">
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
                </th>
              </tr>
            </thead>
            
            <tbody>
              {data.map((record, recordIndex) => {
                return record.months.map((monthData, monthIndex) => (
                  <tr 
                    key={`${record.store_no}-${record.article_id}-${monthData.month_year}`}
                    className={`border-b border-[hsl(var(--panel-border))] hover:bg-[hsl(var(--panel-hover))] transition-colors ${
                      monthIndex === record.months.length - 1 ? 'border-b-2 border-b-[hsl(var(--panel-border))]' : ''
                    }`}
                  >
                    {/* Store Details - only show on first month row */}
                    {monthIndex === 0 ? (
                      <>
                        <td 
                          className="px-3 py-2 text-[hsl(var(--panel-foreground))] border-r border-[hsl(var(--panel-border))] bg-[hsl(var(--panel-background))] min-w-[200px] align-top"
                          rowSpan={record.months.length}
                        >
                          <div className="space-y-1">
                            <div className="font-bold text-sm">{formatCellValue(record.store_no)}</div>
                            <div className="text-xs text-[hsl(var(--panel-muted-foreground))]">
                              {formatCellValue(record.city)}, {formatCellValue(record.state)}
                            </div>
                            <div className="text-xs text-[hsl(var(--panel-muted-foreground))]">
                              {formatCellValue(record.region)}
                            </div>
                          </div>
                        </td>
                        
                        {/* Product Details - only show on first month row */}
                        <td 
                          className="px-3 py-2 text-[hsl(var(--panel-foreground))] border-r border-[hsl(var(--panel-border))] bg-[hsl(var(--panel-background))] min-w-[250px] align-top"
                          rowSpan={record.months.length}
                        >
                          <div className="space-y-1">
                            <div className="font-bold text-sm">{formatCellValue(record.article_id)}</div>
                            <div className="text-xs text-[hsl(var(--panel-muted-foreground))] max-w-[220px] overflow-hidden" title={record.article_description}>
                              <div className="break-words">{formatCellValue(record.article_description)}</div>
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
                            <div className="text-sm font-medium">{formatCellValue(record.segment)}</div>
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
                    ) : null}
                    
                    {/* Month Data - show for every row */}
                    <td className="px-3 py-2 text-[hsl(var(--panel-foreground))] border-r border-[hsl(var(--panel-border))] bg-[hsl(var(--panel-background))] min-w-[100px]">
                      <span className="font-medium">{formatCellValue(monthData.month_year)}</span>
                    </td>
                    <td className="px-3 py-2 text-[hsl(var(--panel-foreground))] border-r border-[hsl(var(--panel-border))] font-semibold bg-[hsl(var(--panel-background))] min-w-[130px] text-right">
                      {monthData.forecast_qty.bb !== null && monthData.forecast_qty.bb !== undefined ? formatCellValue(monthData.forecast_qty.bb) : '-'}
                    </td>
                    <td className="px-3 py-2 text-[hsl(var(--panel-foreground))] border-r border-[hsl(var(--panel-border))] font-semibold bg-[hsl(var(--panel-background))] min-w-[130px] text-right">
                      {monthData.forecast_qty.cb !== null && monthData.forecast_qty.cb !== undefined ? formatCellValue(monthData.forecast_qty.cb) : '-'}
                    </td>
                    <td className="px-3 py-2 text-[hsl(var(--panel-foreground))] border-r border-[hsl(var(--panel-border))] font-semibold bg-[hsl(var(--panel-background))] min-w-[100px] text-right">
                      {formatCellValue(monthData.sold_qty)}
                    </td>
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
              <span>
                Showing month-on-month comparison grouped by (Store, Article) pairs
              </span>
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

export default MonthOnMonthComparison; 