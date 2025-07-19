import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Edit, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Table,
  ChevronDown,
  RefreshCw,
  ChevronUp,
  Save,
  AlertTriangle,
  Move,
  Filter
} from "lucide-react";
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBoxPlot } from '@nivo/boxplot';
import { ForecastRepository } from '../../repository/forecast_repository';
import { AnalyticsRepository } from '../../repository/analytics_repository';
import { useWorkspace } from '../../context/WorkspaceProvider';

interface AnalyticsContentProps {
  analyticsType?: string;
  embedded?: boolean; // New prop for embedded mode
  embeddedArticleId?: string; // New prop to pass article_id directly in embedded mode
  embeddedStoreValue?: string; // New prop to pass store value directly in embedded mode
}

interface GridCell {
  row: number;
  col: number;
}

interface Widget {
  id: string;
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
  title: string;
  description: string;
  widgetType: 'chart' | 'card' | 'heading' | 'table';
  chartType?: 'bar' | 'pie' | 'line' | 'boxplot';
  sqlQuery?: string;
  alignment: 'left' | 'center' | 'right';
  // Table-specific properties
  pageSize?: number;
  enablePagination?: boolean;
}

interface WidgetFormData {
  title: string;
  description: string;
  widgetType: 'chart' | 'card' | 'heading' | 'table';
  chartType: 'bar' | 'pie' | 'line' | 'boxplot';
  sqlQuery: string;
  alignment: 'left' | 'center' | 'right';
  // Table-specific form data
  pageSize: number;
  enablePagination: boolean;
}

interface ChartData {
  [key: string]: any;
}

interface TableData {
  columns: string[];
  rows: any[][];
  totalCount?: number;
  hasMore?: boolean;
}

interface TableState {
  data: any[];
  columns: string[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  totalCount?: number;
}

// New interfaces for column filtering
interface ColumnFilter {
  column: string;
  value: string | null;
  options: string[];
  loading: boolean;
  error: string | null;
}

type DragMode = 'move' | 'resize-nw' | 'resize-ne' | 'resize-sw' | 'resize-se' | 'resize-n' | 'resize-s' | 'resize-w' | 'resize-e';

const GRID_COLS = 16;
const GRID_ROWS = 1000;

const AnalyticsContent: React.FC<AnalyticsContentProps> = ({ analyticsType, embedded = false, embeddedArticleId, embeddedStoreValue }) => {
  const { openFileInPanel } = useWorkspace();
  const [isEditMode, setIsEditMode] = useState(false);
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [selectedStart, setSelectedStart] = useState<GridCell | null>(null);
  const [hoveredEnd, setHoveredEnd] = useState<GridCell | null>(null);
  const [showWidgetForm, setShowWidgetForm] = useState(false);
  const [widgetFormData, setWidgetFormData] = useState<WidgetFormData>({
    title: '',
    description: '',
    widgetType: 'chart',
    chartType: 'bar',
    sqlQuery: '',
    alignment: 'left',
    pageSize: 50,
    enablePagination: true
  });
  const [editingWidget, setEditingWidget] = useState<Widget | null>(null);

  // Widget manipulation state
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<DragMode | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number; widget: Widget } | null>(null);
  const [previewWidget, setPreviewWidget] = useState<Widget | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Chart data state
  const [chartData, setChartData] = useState<Record<string, ChartData[]>>({});
  const [loadingCharts, setLoadingCharts] = useState<Record<string, boolean>>({});
  const [chartErrors, setChartErrors] = useState<Record<string, string>>({});

  // Table data state
  const [tableStates, setTableStates] = useState<Record<string, TableState>>({});

  // Configuration persistence state
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Column filtering state
  const [columnFilters, setColumnFilters] = useState<Record<string, ColumnFilter>>({});
  const [requiredColumns, setRequiredColumns] = useState<string[]>([]);

  // Initialize repositories
  const getApiBaseUrl = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    // Add protocol if missing
    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      return `http://${baseUrl}`;
    }
    return baseUrl;
  };
  
  const forecastRepository = new ForecastRepository(getApiBaseUrl());
  const analyticsRepository = new AnalyticsRepository(getApiBaseUrl());

  // Get page name for saving configuration
  const getPageName = () => {
    // Use the exact analyticsType to preserve case sensitivity
    const pageName = analyticsType || 'default';
    console.log('[AnalyticsContent] Using page name for config:', pageName);
    return pageName;
  };

  // Parse required columns from page title
  const parseRequiredColumns = (title: string): string[] => {
    const columnPattern = /\$([a-zA-Z_][a-zA-Z0-9_]*)/g;
    const matches = title.match(columnPattern);
    if (!matches) return [];
    
    // Extract column names without the $ prefix
    const columns = matches.map(match => match.substring(1));
    console.log('[AnalyticsContent] Parsed columns from title:', title, '->', columns);
    return columns;
  };

  // Get the current parameter value from props or URL for embedded mode
  const getCurrentParameterValue = (): string | null => {
    if (embedded && analyticsType) {
      // First, check if value is passed directly as a prop
      if (embeddedArticleId) {
        console.log('[AnalyticsContent] Using embeddedArticleId prop:', embeddedArticleId);
        return embeddedArticleId;
      }
      
      if (embeddedStoreValue) {
        console.log('[AnalyticsContent] Using embeddedStoreValue prop:', embeddedStoreValue);
        return embeddedStoreValue;
      }
      
      // Extract parameter value from the current URL or context
      // This assumes the parameter value is available in the URL or we can get it from the parent component
      // For now, we'll try to get it from the URL path
      const pathParts = window.location.pathname.split('/');
      const paramIndex = pathParts.findIndex(part => part.startsWith('article_id-') || part.startsWith('store_id-'));
      if (paramIndex !== -1) {
        const paramPart = pathParts[paramIndex];
        const paramValue = paramPart.replace('article_id-', '').replace('store_id-', '');
        console.log('[AnalyticsContent] Extracted parameter value from URL:', paramValue);
        return paramValue;
      }
      
      // Fallback: try to get from URL search params
      const urlParams = new URLSearchParams(window.location.search);
      const paramValue = urlParams.get('article_id') || urlParams.get('store_id');
      if (paramValue) {
        console.log('[AnalyticsContent] Extracted parameter value from URL params:', paramValue);
        return paramValue;
      }
    }
    return null;
  };

  // Load column options for a specific column
  const loadColumnOptions = async (column: string) => {
    try {
      setColumnFilters(prev => ({
        ...prev,
        [column]: {
          ...prev[column],
          loading: true,
          error: null
        }
      }));

      const query = `SELECT DISTINCT ${column} FROM forecast WHERE ${column} IS NOT NULL ORDER BY ${column} LIMIT 1000`;
      
      await forecastRepository.executeSqlQuery(
        { sql_query: query },
        {
          setLoading: () => {},
          setError: (error: string | null) => {
            setColumnFilters(prev => ({
              ...prev,
              [column]: {
                ...prev[column],
                error: error || null,
                loading: false
              }
            }));
          },
          setData: (data: any) => {
            if (data && data.data) {
              const options = data.data.map((row: any) => String(row[column])).filter(Boolean);
              setColumnFilters(prev => ({
                ...prev,
                [column]: {
                  ...prev[column],
                  options,
                  loading: false,
                  error: null
                }
              }));
            }
          }
        }
      );
    } catch (error) {
      console.error(`Error loading options for column ${column}:`, error);
      setColumnFilters(prev => ({
        ...prev,
        [column]: {
          ...prev[column],
          error: 'Failed to load options',
          loading: false
        }
      }));
    }
  };

  // Initialize column filters when page loads
  useEffect(() => {
    const pageName = getPageName();
    const columns = parseRequiredColumns(pageName);
    setRequiredColumns(columns);
    
    console.log('[AnalyticsContent] Initializing filters for columns:', columns);
    
    // Initialize filter state for each required column
    const initialFilters: Record<string, ColumnFilter> = {};
    columns.forEach(column => {
      // For embedded mode, automatically set the parameter value
      if (embedded && analyticsType && analyticsType.includes(`$${column}`)) {
        const currentValue = getCurrentParameterValue();
        if (currentValue) {
          initialFilters[column] = {
            column,
            value: currentValue,
            options: [currentValue], // Set the current value as the only option
            loading: false,
            error: null
          };
          console.log(`[AnalyticsContent] Auto-set ${column} filter to:`, currentValue);
        } else {
          initialFilters[column] = {
            column,
            value: null,
            options: [],
            loading: false,
            error: null
          };
        }
      } else {
        initialFilters[column] = {
          column,
          value: null,
          options: [],
          loading: false,
          error: null
        };
      }
    });
    setColumnFilters(initialFilters);
    
    // Load options for each column (except auto-set parameters in embedded mode)
    columns.forEach(column => {
      if (!(embedded && analyticsType && analyticsType.includes(`$${column}`))) {
        loadColumnOptions(column);
      }
    });
  }, [analyticsType, embedded]);

  // Check if all required filters are selected
  const areAllFiltersSelected = (): boolean => {
    return requiredColumns.every(column => {
      const filter = columnFilters[column];
      return filter && filter.value !== null && filter.value !== '';
    });
  };

  // Substitute variables in SQL query
  const substituteVariables = (sqlQuery: string): string => {
    let substitutedQuery = sqlQuery;
    
    requiredColumns.forEach(column => {
      const filter = columnFilters[column];
      if (filter && filter.value) {
        const placeholder = `$${column}`;
        // Always wrap string values in quotes for SQL
        const value = `'${filter.value}'`;
        // Use global regex to replace all occurrences, escaping special regex characters
        const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        substitutedQuery = substitutedQuery.replace(regex, value);
        
        // Log the substitution for debugging
        console.log(`[AnalyticsContent] Substituting ${placeholder} with ${value}`);
      }
    });
    
    // Validate that all required variables have been substituted
    const remainingVariables = substitutedQuery.match(/\$[a-zA-Z_][a-zA-Z0-9_]*/g);
    if (remainingVariables && remainingVariables.length > 0) {
      console.warn('[AnalyticsContent] Warning: Some variables were not substituted:', remainingVariables);
    }
    
    return substitutedQuery;
  };



  // Load grid configuration on mount
  useEffect(() => {
    loadGridConfiguration();
  }, [analyticsType]);

  // Save grid configuration whenever widgets change
  useEffect(() => {
    if (widgets.length > 0) {
      saveGridConfiguration();
    }
  }, [widgets]);

  // Re-execute queries when filters change
  useEffect(() => {
    if (areAllFiltersSelected()) {
      widgets.forEach(widget => {
        if ((widget.widgetType === 'chart' || widget.widgetType === 'card') && widget.sqlQuery) {
          executeQuery(widget.id, widget.sqlQuery);
        }
        if (widget.widgetType === 'table' && widget.sqlQuery) {
          initializeTableState(widget.id);
          executeTableQuery(widget.id, widget.sqlQuery, 0, widget.pageSize || 50, widget.enablePagination || true);
        }
      });
    }
  }, [columnFilters, widgets]);

  const loadGridConfiguration = async () => {
    try {
      const pageName = getPageName();
      console.log('[AnalyticsContent] Loading grid configuration for page:', pageName);
      
      const config = await analyticsRepository.loadGridConfig(pageName, {
        setLoading: () => {},
        setError: () => {},
        setData: () => {}
      });
      
      console.log('[AnalyticsContent] Loaded config:', config);
      
      if (config && config.widgets) {
        console.log('[AnalyticsContent] Setting widgets:', config.widgets);
        setWidgets(config.widgets);
        // Don't execute queries here - they will be executed when filters are selected
      } else {
        console.log('[AnalyticsContent] No config found, using empty widgets array');
        setWidgets([]);
      }
    } catch (error) {
      console.error('Error loading grid configuration:', error);
      setWidgets([]);
    }
  };

  const saveGridConfiguration = async () => {
    try {
      setSaving(true);
      setSaveError(null);
      
      const pageName = getPageName();
      const gridConfig = {
        widgets: widgets,
        lastModified: new Date().toISOString()
      };
      
      console.log('[AnalyticsContent] Saving grid configuration for page:', pageName);
      console.log('[AnalyticsContent] Grid config to save:', gridConfig);
      
      await analyticsRepository.saveGridConfig(pageName, gridConfig, {
        setLoading: () => {},
        setError: (error: string | null) => {
          if (error) setSaveError(error);
        },
        setData: () => {}
      });
      
      console.log('[AnalyticsContent] Grid configuration saved successfully');
    } catch (error) {
      console.error('Error saving grid configuration:', error);
      setSaveError('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const getAnalyticsTitle = () => {
    if (!analyticsType) return 'Analytics';
    
    // Handle special cases
    switch (analyticsType.toLowerCase()) {
      case 'master':
        return 'Master Analytics';
      default:
        // For other cases, use the original case from analyticsType
        // If it looks like it was URL encoded and has spaces, use it as-is
        // Otherwise, apply basic title case formatting
        if (analyticsType.includes(' ')) {
          // Already properly formatted (e.g., "Sales Dashboard")
          return analyticsType;
        } else {
          // Apply title case formatting (e.g., "sales-dashboard" -> "Sales Dashboard")
          return analyticsType.charAt(0).toUpperCase() + analyticsType.slice(1).replace('-', ' ');
        }
    }
  };

  // Execute SQL query against forecast API with variable substitution
  const executeQuery = async (widgetId: string, sqlQuery: string) => {
    if (!sqlQuery.trim()) return;
    
    // Check if all required filters are selected
    if (!areAllFiltersSelected()) {
      console.log('[AnalyticsContent] Skipping query execution - not all filters selected');
      return;
    }
    
    try {
      const substitutedQuery = substituteVariables(sqlQuery);
      console.log('[AnalyticsContent] Original query:', sqlQuery);
      console.log('[AnalyticsContent] Substituted query:', substitutedQuery);
      console.log('[AnalyticsContent] Current filters:', columnFilters);
      
      await forecastRepository.executeSqlQuery(
        { sql_query: substitutedQuery },
        {
          setLoading: (loading: boolean) => {
            setLoadingCharts(prev => ({ ...prev, [widgetId]: loading }));
          },
          setError: (error: string | null) => {
            setChartErrors(prev => ({ ...prev, [widgetId]: error || '' }));
          },
          setData: (data: any) => {
            if (data && data.data) {
              setChartData(prev => ({ ...prev, [widgetId]: data.data }));
            }
          }
        }
      );
    } catch (error) {
      console.error('Error executing query:', error);
    }
  };

  // Execute SQL query for table widget with pagination and variable substitution
  const executeTableQuery = async (widgetId: string, sqlQuery: string, page: number = 0, pageSize: number = 50, enablePagination: boolean = true) => {
    if (!sqlQuery.trim()) return;
    
    // Check if all required filters are selected
    if (!areAllFiltersSelected()) {
      console.log('[AnalyticsContent] Skipping table query execution - not all filters selected');
      return;
    }
    
    try {
      // Substitute variables first
      let finalQuery = substituteVariables(sqlQuery.trim());
      
      // Modify query to add LIMIT and OFFSET if pagination is enabled
      if (enablePagination) {
        // Remove existing LIMIT/OFFSET if present
        finalQuery = finalQuery.replace(/\s+LIMIT\s+\d+(\s+OFFSET\s+\d+)?$/i, '');
        // Add new LIMIT and OFFSET
        const offset = page * pageSize;
        finalQuery += ` LIMIT ${pageSize} OFFSET ${offset}`;
      }

      console.log('[AnalyticsContent] Original table query:', sqlQuery);
      console.log('[AnalyticsContent] Substituted table query:', finalQuery);
      console.log('[AnalyticsContent] Current filters for table:', columnFilters);

      await forecastRepository.executeSqlQuery(
        { sql_query: finalQuery },
        {
          setLoading: (loading: boolean) => {
            setTableStates(prev => ({
              ...prev,
              [widgetId]: {
                ...prev[widgetId],
                loading
              }
            }));
          },
          setError: (error: string | null) => {
            setTableStates(prev => ({
              ...prev,
              [widgetId]: {
                ...prev[widgetId],
                error: error || null,
                loading: false
              }
            }));
          },
          setData: (data: any) => {
            if (data && data.data) {
              const newData = data.data;
              const columns = newData.length > 0 ? Object.keys(newData[0]) : [];
              
              setTableStates(prev => {
                const currentState = prev[widgetId] || {
                  data: [],
                  columns: [],
                  loading: false,
                  error: null,
                  hasMore: true,
                  currentPage: 0
                };

                // If it's the first page, replace data; otherwise, append
                const updatedData = page === 0 ? newData : [...currentState.data, ...newData];
                const hasMore = enablePagination ? newData.length === pageSize : false;

                return {
                  ...prev,
                  [widgetId]: {
                    ...currentState,
                    data: updatedData,
                    columns,
                    loading: false,
                    error: null,
                    hasMore,
                    currentPage: page
                  }
                };
              });
            }
          }
        }
      );
    } catch (error) {
      console.error('Error executing table query:', error);
      setTableStates(prev => ({
        ...prev,
        [widgetId]: {
          ...prev[widgetId],
          error: 'Failed to execute query',
          loading: false
        }
      }));
    }
  };

  // Handle filter change
  const handleFilterChange = (column: string, value: string | null) => {
    console.log(`[AnalyticsContent] Filter changed: ${column} = ${value}`);
    setColumnFilters(prev => ({
      ...prev,
      [column]: {
        ...prev[column],
        value
      }
    }));
  };

  // Render filter dropdowns
  const renderFilterDropdowns = () => {
    if (requiredColumns.length === 0) return null;

    return (
      <div className="flex items-center space-x-4 px-4 py-2 bg-[hsl(var(--dashboard-accent-background))] border-b border-[hsl(var(--dashboard-card-border))]">
        <div className="flex items-center space-x-2">
          <Filter size={14} className="text-[hsl(var(--dashboard-muted-foreground))]" />
          <span className="text-xs text-[hsl(var(--dashboard-muted-foreground))] font-medium">Parameters:</span>
        </div>
        
        {requiredColumns.map(column => {
          const filter = columnFilters[column];
          if (!filter) return null;
          
          return (
            <div key={column} className="flex items-center space-x-2">
              <label className="text-xs text-[hsl(var(--dashboard-muted-foreground))] font-medium">
                {column.replace(/_/g, ' ')}:
              </label>
              <select
                value={filter.value || ''}
                onChange={(e) => handleFilterChange(column, e.target.value || null)}
                className="px-2 py-1 text-xs bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] rounded text-[hsl(var(--dashboard-card-foreground))] focus:outline-none focus:border-[hsl(var(--dashboard-primary-blue))] min-w-[120px]"
                disabled={filter.loading}
              >
                <option value="">Select {column.replace(/_/g, ' ')}</option>
                {filter.options.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {filter.loading && (
                <div className="w-3 h-3 border border-[hsl(var(--dashboard-primary-blue))] border-t-transparent rounded-full animate-spin"></div>
              )}
              {filter.error && (
                <div className="text-xs text-[hsl(var(--dashboard-error))]">
                  {filter.error}
                </div>
              )}
            </div>
          );
        })}
        
        {!areAllFiltersSelected() && (
          <div className="text-xs text-[hsl(var(--dashboard-warning))] bg-[hsl(var(--dashboard-warning))]/10 px-2 py-1 rounded border border-[hsl(var(--dashboard-warning))]/20">
            Please select all required parameters to view charts
          </div>
        )}
        

      </div>
    );
  };

  // Load more data for table widget
  const loadMoreTableData = async (widgetId: string, widget: Widget) => {
    if (!widget.sqlQuery || !widget.enablePagination) return;
    
    const currentState = tableStates[widgetId];
    if (!currentState || currentState.loading || !currentState.hasMore) return;

    const nextPage = currentState.currentPage + 1;
    await executeTableQuery(widgetId, widget.sqlQuery, nextPage, widget.pageSize || 50, widget.enablePagination || true);
  };

  // Initialize table state for new table widgets
  const initializeTableState = (widgetId: string) => {
    setTableStates(prev => ({
      ...prev,
      [widgetId]: {
        data: [],
        columns: [],
        loading: false,
        error: null,
        hasMore: true,
        currentPage: 0
      }
    }));
  };

  // Initialize table states for table widgets
  useEffect(() => {
    widgets.forEach(widget => {
      if (widget.widgetType === 'table' && widget.sqlQuery && !tableStates[widget.id]) {
        initializeTableState(widget.id);
        executeTableQuery(widget.id, widget.sqlQuery, 0, widget.pageSize || 50, widget.enablePagination || true);
      }
    });
  }, [widgets]);

  // Transform data for different chart types
  const transformDataForChart = (data: ChartData[], chartType: 'bar' | 'pie' | 'line' | 'boxplot') => {
    if (!data || data.length === 0) return [];

    const firstRow = data[0];
    const keys = Object.keys(firstRow);
    
    if (keys.length < 2) return [];

    const xKey = keys[0]; // First column as X-axis/category
    const yKey = keys[1]; // Second column as Y-axis/value

    switch (chartType) {
      case 'bar':
        return data.map(row => ({
          [xKey]: String(row[xKey] || ''),
          [yKey]: Number(row[yKey]) || 0
        }));
      
      case 'pie':
        return data.map(row => ({
          id: String(row[xKey] || ''),
          label: String(row[xKey] || ''),
          value: Number(row[yKey]) || 0
        }));
      
      case 'line':
        const groupedData = new Map();
        
        // If we have 3+ columns, use the third column for grouping
        const groupKey = keys.length > 2 ? keys[2] : null;
        
        data.forEach(row => {
          const group = groupKey ? String(row[groupKey]) : 'Series 1';
          if (!groupedData.has(group)) {
            groupedData.set(group, []);
          }
          groupedData.get(group).push({
            x: String(row[xKey] || ''),
            y: Number(row[yKey]) || 0
          });
        });
        
        return Array.from(groupedData.entries()).map(([id, data]) => ({
          id,
          data
        }));
      
      case 'boxplot':
        // For boxplot, we expect data with statistical values
        // Transform to Nivo boxplot format: { group: string, values: {min, q1, median, q3, max} }
        const boxplotGroups = new Map();
        
        data.forEach(row => {
          const group = String(row[xKey] || 'Group');
          if (!boxplotGroups.has(group)) {
            boxplotGroups.set(group, []);
          }
          
          // Add all numeric values from the row
          keys.slice(1).forEach(key => {
            const value = Number(row[key]);
            if (!isNaN(value)) {
              boxplotGroups.get(group).push(value);
            }
          });
        });
        
        // Convert to Nivo format with calculated statistics
        return Array.from(boxplotGroups.entries()).map(([group, values]) => {
          const sorted = (values as number[]).sort((a: number, b: number) => a - b);
          const q1Index = Math.floor(sorted.length * 0.25);
          const medianIndex = Math.floor(sorted.length * 0.5);
          const q3Index = Math.floor(sorted.length * 0.75);
          
          return {
            group,
            mu: sorted[medianIndex],
            sd: Math.sqrt(values.reduce((sum: number, val: number) => sum + Math.pow(val - sorted[medianIndex], 2), 0) / values.length),
            n: values.length,
            outliers: [] // For simplicity, not calculating outliers
          };
        });
      
      default:
        return [];
    }
  };

  const handleEnterEditMode = () => {
    // If in embedded mode, open a new analytics tab in non-embedded mode
    if (embedded && analyticsType) {
      // Create a new analytics tab with the same type but in non-embedded mode
      openFileInPanel(`analytics-${encodeURIComponent(analyticsType)}`);
      return;
    }
    
    setIsEditMode(true);
  };

  const handleExitEditMode = () => {
    setIsEditMode(false);
    setSelectedStart(null);
    setHoveredEnd(null);
    setShowWidgetForm(false);
    setSelectedWidget(null);
    setIsDragging(false);
    setDragMode(null);
    setPreviewWidget(null);
  };

  const getSelectionBounds = () => {
    if (!selectedStart || !hoveredEnd) return null;
    
    return {
      startRow: Math.min(selectedStart.row, hoveredEnd.row),
      endRow: Math.max(selectedStart.row, hoveredEnd.row),
      startCol: Math.min(selectedStart.col, hoveredEnd.col),
      endCol: Math.max(selectedStart.col, hoveredEnd.col)
    };
  };

  const isWidgetCell = (row: number, col: number, excludeWidgetId?: string) => {
    return widgets.some(widget => 
      widget.id !== excludeWidgetId &&
      row >= widget.startRow && row <= widget.endRow &&
      col >= widget.startCol && col <= widget.endCol
    );
  };

  const hasOverlapWithExistingWidgets = (bounds: { startRow: number; endRow: number; startCol: number; endCol: number }, excludeWidgetId?: string) => {
    return widgets.some(widget => {
      if (widget.id === excludeWidgetId) return false;
      // Check if the bounds overlap with any existing widget
      return !(bounds.endRow < widget.startRow || 
               bounds.startRow > widget.endRow || 
               bounds.endCol < widget.startCol || 
               bounds.startCol > widget.endCol);
    });
  };

  const isCellInSelection = (row: number, col: number) => {
    const bounds = getSelectionBounds();
    if (!bounds) return false;
    
    return row >= bounds.startRow && row <= bounds.endRow && 
           col >= bounds.startCol && col <= bounds.endCol;
  };

  const isSelectionValid = () => {
    const bounds = getSelectionBounds();
    if (!bounds) return true;
    
    return !hasOverlapWithExistingWidgets(bounds);
  };

  const getGridPosition = (clientX: number, clientY: number) => {
    if (!gridRef.current) return null;
    
    const rect = gridRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    const cellWidth = rect.width / GRID_COLS;
    const cellHeight = 25; // Approximate cell height including gap
    
    const col = Math.floor(x / cellWidth);
    const row = Math.floor(y / cellHeight);
    
    return {
      row: Math.max(0, Math.min(GRID_ROWS - 1, row)),
      col: Math.max(0, Math.min(GRID_COLS - 1, col))
    };
  };

  const calculateNewBounds = (widget: Widget, deltaRow: number, deltaCol: number, mode: DragMode) => {
    switch (mode) {
      case 'move':
        return {
          startRow: Math.max(0, widget.startRow + deltaRow),
          endRow: Math.min(GRID_ROWS - 1, widget.endRow + deltaRow),
          startCol: Math.max(0, widget.startCol + deltaCol),
          endCol: Math.min(GRID_COLS - 1, widget.endCol + deltaCol)
        };
      case 'resize-se':
        return {
          startRow: widget.startRow,
          startCol: widget.startCol,
          endRow: Math.min(GRID_ROWS - 1, Math.max(widget.startRow, widget.endRow + deltaRow)),
          endCol: Math.min(GRID_COLS - 1, Math.max(widget.startCol, widget.endCol + deltaCol))
        };
      case 'resize-nw':
        return {
          startRow: Math.max(0, Math.min(widget.endRow, widget.startRow + deltaRow)),
          startCol: Math.max(0, Math.min(widget.endCol, widget.startCol + deltaCol)),
          endRow: widget.endRow,
          endCol: widget.endCol
        };
      case 'resize-ne':
        return {
          startRow: Math.max(0, Math.min(widget.endRow, widget.startRow + deltaRow)),
          startCol: widget.startCol,
          endRow: widget.endRow,
          endCol: Math.min(GRID_COLS - 1, Math.max(widget.startCol, widget.endCol + deltaCol))
        };
      case 'resize-sw':
        return {
          startRow: widget.startRow,
          startCol: Math.max(0, Math.min(widget.endCol, widget.startCol + deltaCol)),
          endRow: Math.min(GRID_ROWS - 1, Math.max(widget.startRow, widget.endRow + deltaRow)),
          endCol: widget.endCol
        };
      case 'resize-n':
        return {
          startRow: Math.max(0, Math.min(widget.endRow, widget.startRow + deltaRow)),
          startCol: widget.startCol,
          endRow: widget.endRow,
          endCol: widget.endCol
        };
      case 'resize-s':
        return {
          startRow: widget.startRow,
          startCol: widget.startCol,
          endRow: Math.min(GRID_ROWS - 1, Math.max(widget.startRow, widget.endRow + deltaRow)),
          endCol: widget.endCol
        };
      case 'resize-w':
        return {
          startRow: widget.startRow,
          startCol: Math.max(0, Math.min(widget.endCol, widget.startCol + deltaCol)),
          endRow: widget.endRow,
          endCol: widget.endCol
        };
      case 'resize-e':
        return {
          startRow: widget.startRow,
          startCol: widget.startCol,
          endRow: widget.endRow,
          endCol: Math.min(GRID_COLS - 1, Math.max(widget.startCol, widget.endCol + deltaCol))
        };
      default:
        return widget;
    }
  };

  const handleMouseDown = (e: React.MouseEvent, widgetId: string, mode: DragMode) => {
    e.preventDefault();
    e.stopPropagation();
    
    const widget = widgets.find(w => w.id === widgetId);
    if (!widget) return;
    
    setSelectedWidget(widgetId);
    setIsDragging(true);
    setDragMode(mode);
    setDragStart({ x: e.clientX, y: e.clientY, widget });
    setPreviewWidget(widget);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !dragStart || !dragMode) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    // Convert pixel delta to grid delta (approximate)
    const cellWidth = gridRef.current ? gridRef.current.getBoundingClientRect().width / GRID_COLS : 50;
    const cellHeight = 25;
    
    const deltaCol = Math.round(deltaX / cellWidth);
    const deltaRow = Math.round(deltaY / cellHeight);
    
    const newBounds = calculateNewBounds(dragStart.widget, deltaRow, deltaCol, dragMode);
    
    // Check if the new position is valid
    const isValid = !hasOverlapWithExistingWidgets(newBounds, dragStart.widget.id);
    
    setPreviewWidget({
      ...dragStart.widget,
      ...newBounds,
      // Add a flag to indicate if this is a valid position
      isValidPreview: isValid
    } as Widget & { isValidPreview: boolean });
  }, [isDragging, dragStart, dragMode, widgets]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging || !previewWidget || !dragStart) return;
    
    const isValid = !hasOverlapWithExistingWidgets(previewWidget, dragStart.widget.id);
    
    if (isValid) {
      setWidgets(prev => prev.map(w => 
        w.id === dragStart.widget.id ? {
          ...w,
          startRow: previewWidget.startRow,
          startCol: previewWidget.startCol,
          endRow: previewWidget.endRow,
          endCol: previewWidget.endCol
        } : w
      ));
    }
    
    setIsDragging(false);
    setDragMode(null);
    setDragStart(null);
    setPreviewWidget(null);
  }, [isDragging, previewWidget, dragStart, widgets]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isEditMode || !selectedWidget) return;
      
      const widget = widgets.find(w => w.id === selectedWidget);
      if (!widget) return;
      
      let deltaRow = 0;
      let deltaCol = 0;
      
      switch (e.key) {
        case 'ArrowUp':
          deltaRow = -1;
          break;
        case 'ArrowDown':
          deltaRow = 1;
          break;
        case 'ArrowLeft':
          deltaCol = -1;
          break;
        case 'ArrowRight':
          deltaCol = 1;
          break;
        case 'Delete':
        case 'Backspace':
          handleDeleteWidget(selectedWidget);
          return;
        default:
          return;
      }
      
      e.preventDefault();
      
      const newBounds = calculateNewBounds(widget, deltaRow, deltaCol, 'move');
      const isValid = !hasOverlapWithExistingWidgets(newBounds, selectedWidget);
      
      if (isValid) {
        setWidgets(prev => prev.map(w => 
          w.id === selectedWidget ? { ...w, ...newBounds } : w
        ));
      }
    };
    
    if (isEditMode) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isEditMode, selectedWidget, widgets]);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (!isEditMode || isDragging) return;

    // Don't allow clicking on existing widget cells for new selection
    if (isWidgetCell(row, col)) return;

    if (!selectedStart) {
      // First click - select start cell
      setSelectedStart({ row, col });
      setSelectedWidget(null);
    } else {
      // Second click - check if selection is valid before showing form
      if (isSelectionValid()) {
        setShowWidgetForm(true);
      }
    }
  }, [isEditMode, selectedStart, widgets, isDragging]);

  const handleCellHover = useCallback((row: number, col: number) => {
    if (!isEditMode || !selectedStart || isDragging) return;
    setHoveredEnd({ row, col });
  }, [isEditMode, selectedStart, isDragging]);

  const handleWidgetClick = (e: React.MouseEvent, widgetId: string) => {
    e.stopPropagation();
    setSelectedWidget(selectedWidget === widgetId ? null : widgetId);
    setSelectedStart(null);
    setHoveredEnd(null);
  };

  const handleDeleteWidget = (widgetId: string) => {
    setWidgets(prev => prev.filter(w => w.id !== widgetId));
    setSelectedWidget(null);
  };

  const handleEditWidget = (widgetId: string) => {
    const widget = widgets.find(w => w.id === widgetId);
    if (!widget) return;
    
    setEditingWidget(widget);
    setWidgetFormData({
      title: widget.title,
      description: widget.description,
      widgetType: widget.widgetType,
      chartType: widget.chartType || 'bar',
      sqlQuery: widget.sqlQuery || '',
      alignment: widget.alignment,
      pageSize: widget.pageSize || 50,
      enablePagination: widget.enablePagination || true
    });
    setShowWidgetForm(true);
  };

  const handleCreateWidget = () => {
    if (!selectedStart || !hoveredEnd) return;

    const bounds = getSelectionBounds();
    if (!bounds || !isSelectionValid()) return;

    const newWidget: Widget = {
      id: Date.now().toString(),
      startRow: bounds.startRow,
      startCol: bounds.startCol,
      endRow: bounds.endRow,
      endCol: bounds.endCol,
      ...widgetFormData
    };

    setWidgets(prev => [...prev, newWidget]);
    setShowWidgetForm(false);
    setSelectedStart(null);
    setHoveredEnd(null);
    setWidgetFormData({
      title: '',
      description: '',
      widgetType: 'chart',
      chartType: 'bar',
      sqlQuery: '',
      alignment: 'left',
      pageSize: 50,
      enablePagination: true
    });
  };

  const handleSaveWidget = () => {
    if (editingWidget) {
      // Update existing widget
      setWidgets(prev => prev.map(w => 
        w.id === editingWidget.id ? {
          ...w,
          title: widgetFormData.title,
          description: widgetFormData.description,
          widgetType: widgetFormData.widgetType,
          chartType: widgetFormData.chartType,
          sqlQuery: widgetFormData.sqlQuery,
          alignment: widgetFormData.alignment,
          pageSize: widgetFormData.pageSize,
          enablePagination: widgetFormData.enablePagination
        } : w
      ));
      
      // Re-execute query if it changed and widget supports queries
      if ((widgetFormData.widgetType === 'chart' || widgetFormData.widgetType === 'card') && 
          widgetFormData.sqlQuery !== editingWidget.sqlQuery) {
        executeQuery(editingWidget.id, widgetFormData.sqlQuery);
      }
    } else {
      // Create new widget
      if (!selectedStart || !hoveredEnd) return;

      const bounds = getSelectionBounds();
      if (!bounds || !isSelectionValid()) return;

      const newWidget: Widget = {
        id: Date.now().toString(),
        startRow: bounds.startRow,
        startCol: bounds.startCol,
        endRow: bounds.endRow,
        endCol: bounds.endCol,
        ...widgetFormData
      };

      setWidgets(prev => [...prev, newWidget]);
      
      // Execute query for new widget if it supports queries
      if ((widgetFormData.widgetType === 'chart' || widgetFormData.widgetType === 'card') && 
          widgetFormData.sqlQuery) {
        executeQuery(newWidget.id, widgetFormData.sqlQuery);
      }
      
      setSelectedStart(null);
      setHoveredEnd(null);
    }

    setShowWidgetForm(false);
    setEditingWidget(null);
    setWidgetFormData({
      title: '',
      description: '',
      widgetType: 'chart',
      chartType: 'bar',
      sqlQuery: '',
      alignment: 'left',
      pageSize: 50,
      enablePagination: true
    });
  };

  const handleCancelWidget = () => {
    setShowWidgetForm(false);
    setSelectedStart(null);
    setHoveredEnd(null);
    setEditingWidget(null);
    setWidgetFormData({
      title: '',
      description: '',
      widgetType: 'chart',
      chartType: 'bar',
      sqlQuery: '',
      alignment: 'left',
      pageSize: 50,
      enablePagination: true
    });
  };

  const getAlignmentClass = (alignment: 'left' | 'center' | 'right') => {
    switch (alignment) {
      case 'center':
        return 'text-center items-center justify-center';
      case 'right':
        return 'text-right items-end justify-end';
      default:
        return 'text-left items-start justify-start';
    }
  };

  const renderWidgetContent = (widget: Widget) => {
    const alignmentClass = getAlignmentClass(widget.alignment);
    
    switch (widget.widgetType) {
      case 'heading':
        return (
          <div className={`flex flex-col h-full ${alignmentClass}`}>
            <h1 className="text-[hsl(var(--dashboard-card-foreground))] font-bold text-2xl mb-1 leading-tight">{widget.title}</h1>
            {widget.description && (
              <p className="text-[hsl(var(--dashboard-muted-foreground))] text-base leading-relaxed">{widget.description}</p>
            )}
          </div>
        );
      
      case 'card':
        return (
          <div className="w-full h-full flex flex-col">
            {/* Card header */}
            <div className={`flex-shrink-0 p-4 border-b border-[hsl(var(--dashboard-card-border))] ${alignmentClass}`}>
              <h3 className="text-[hsl(var(--dashboard-card-foreground))] font-semibold text-lg truncate">{widget.title}</h3>
              {widget.description && (
                <p className="text-[hsl(var(--dashboard-muted-foreground))] text-sm truncate mt-1">{widget.description}</p>
              )}
            </div>
            
            {/* Card content */}
            <div className="flex-1 min-h-0 p-4">
              {widget.sqlQuery ? (
                <div className="h-full">
                  {renderCardContent(widget)}
                </div>
              ) : (
                <div className={`flex h-full ${alignmentClass}`}>
                  <div className="text-center">
                    <BarChart3 size={48} className="text-[hsl(var(--dashboard-muted-foreground))] mx-auto mb-3" />
                    <div className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">No SQL query defined</div>
                    <div className="text-[hsl(var(--dashboard-muted-foreground))]/70 text-xs mt-1">Click edit to add a query</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'table':
        return (
          <div className="w-full h-full flex flex-col relative">
            {/* Table header */}
            <div className={`flex-shrink-0 p-4 border-b border-[hsl(var(--dashboard-card-border))] ${alignmentClass}`}>
              <h3 className="text-[hsl(var(--dashboard-card-foreground))] font-semibold text-lg truncate">{widget.title}</h3>
              {widget.description && (
                <p className="text-[hsl(var(--dashboard-muted-foreground))] text-sm truncate mt-1">{widget.description}</p>
              )}
            </div>
            
            {/* Table content - positioned absolutely to respect height */}
            <div className="flex-1 min-h-0 relative">
              {widget.sqlQuery ? (
                renderTableContent(widget)
              ) : (
                <div className={`absolute inset-0 flex items-center justify-center ${alignmentClass}`}>
                  <div className="text-center">
                    <Table size={48} className="text-[hsl(var(--dashboard-muted-foreground))] mx-auto mb-3" />
                    <div className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">No SQL query defined</div>
                    <div className="text-[hsl(var(--dashboard-muted-foreground))]/70 text-xs mt-1">Click edit to add a query</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      
      case 'chart':
      default:
        return (
          <div className="w-full h-full flex flex-col">
            {/* Chart header */}
            <div className={`flex-shrink-0 p-3 border-b border-[hsl(var(--dashboard-card-border))] ${alignmentClass}`}>
              <h3 className="text-[hsl(var(--dashboard-card-foreground))] font-semibold text-base truncate">{widget.title}</h3>
              {widget.description && (
                <p className="text-[hsl(var(--dashboard-muted-foreground))] text-sm truncate mt-1">{widget.description}</p>
              )}
            </div>
            
            {/* Chart area - increased padding to prevent clipping */}
            <div className="flex-1 min-h-0 p-6">
              {widget.sqlQuery ? (
                renderChart(widget)
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <BarChart3 size={48} className="text-[hsl(var(--dashboard-muted-foreground))] mx-auto mb-3" />
                    <div className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">No SQL query defined</div>
                    <div className="text-[hsl(var(--dashboard-muted-foreground))]/70 text-xs mt-1">Click edit to add a query</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  const renderWidgets = () => {
    return widgets.map(widget => {
      const isSelected = selectedWidget === widget.id;
      const isPreview = previewWidget?.id === widget.id;
      const displayWidget = isPreview ? previewWidget : widget;
      const isValidPreview = !isPreview || !(previewWidget as any)?.isValidPreview === false;
      
      // Different styling for heading widgets
      const isHeading = widget.widgetType === 'heading';
      
      return (
        <div
          key={widget.id}
          className={`
            ${isHeading ? 'bg-transparent border-transparent' : 'bg-[hsl(var(--dashboard-card-background))] border-[hsl(var(--dashboard-card-border))]'} border rounded-xl relative overflow-hidden
            ${isSelected ? 'border-[hsl(var(--dashboard-primary-blue))]/60 ring-2 ring-[hsl(var(--dashboard-primary-blue))]/20' : ''}
            ${isPreview && !isValidPreview ? 'border-[hsl(var(--dashboard-error))]/60 bg-[hsl(var(--dashboard-error))]/10' : ''}
            ${!isDragging ? 'cursor-pointer transition-all duration-200' : ''}
            ${isEditMode ? '' : (isHeading ? 'hover:scale-[1.01]' : 'hover:scale-[1.01] hover:bg-[hsl(var(--dashboard-card-hover))]')}
            ${!isHeading ? 'shadow-lg hover:shadow-xl' : ''}
          `}
          style={{
            gridColumn: `${displayWidget.startCol + 1} / ${displayWidget.endCol + 2}`,
            gridRow: `${displayWidget.startRow + 1} / ${displayWidget.endRow + 2}`,
            minHeight: '24px',
            opacity: isPreview && !isValidPreview ? 0.5 : 1
          }}
          onClick={(e) => isEditMode && handleWidgetClick(e, widget.id)}
        >
          {/* Move handle - only in edit mode */}
          {isSelected && isEditMode && (
            <div
              className="absolute top-3 left-3 w-8 h-8 bg-[hsl(var(--dashboard-primary-blue))]/90 hover:bg-[hsl(var(--dashboard-primary-blue))] text-white rounded-lg cursor-move flex items-center justify-center transition-colors z-10 backdrop-blur-sm shadow-lg"
              onMouseDown={(e) => handleMouseDown(e, widget.id, 'move')}
            >
              <Move size={14} />
            </div>
          )}
          
          {/* Action buttons - only in edit mode */}
          {isSelected && isEditMode && (
            <div className="absolute top-3 right-3 flex space-x-2 z-10">
              {((widget.widgetType === 'chart' || widget.widgetType === 'card') && widget.sqlQuery) && (
                <button
                  className="w-8 h-8 bg-[hsl(var(--dashboard-success))]/90 hover:bg-[hsl(var(--dashboard-success))] text-white rounded-lg flex items-center justify-center transition-colors backdrop-blur-sm shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    executeQuery(widget.id, widget.sqlQuery!);
                  }}
                  title="Refresh Data"
                >
                  <BarChart3 size={14} />
                </button>
              )}
              {(widget.widgetType === 'table' && widget.sqlQuery) && (
                <button
                  className="w-8 h-8 bg-[hsl(var(--dashboard-success))]/90 hover:bg-[hsl(var(--dashboard-success))] text-white rounded-lg flex items-center justify-center transition-colors backdrop-blur-sm shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    initializeTableState(widget.id);
                    executeTableQuery(widget.id, widget.sqlQuery!, 0, widget.pageSize || 50, widget.enablePagination || true);
                  }}
                  title="Refresh Table Data"
                >
                  <Table size={14} />
                </button>
              )}
              <button
                className="w-8 h-8 bg-[hsl(var(--dashboard-primary-blue))]/90 hover:bg-[hsl(var(--dashboard-primary-blue))] text-white rounded-lg flex items-center justify-center transition-colors backdrop-blur-sm shadow-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditWidget(widget.id);
                }}
                title="Edit Widget"
              >
                <Edit size={14} />
              </button>
              <button
                className="w-8 h-8 bg-[hsl(var(--dashboard-error))]/90 hover:bg-[hsl(var(--dashboard-error))] text-white rounded-lg flex items-center justify-center transition-colors backdrop-blur-sm shadow-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteWidget(widget.id);
                }}
                title="Delete Widget"
              >
                <X size={14} />
              </button>
            </div>
          )}
          
          {/* Resize handles - only in edit mode */}
          {isSelected && isEditMode && (
            <>
              {/* Corner handles */}
              <div
                className="absolute -top-1 -left-1 w-4 h-4 bg-[hsl(var(--dashboard-primary-blue))] rounded-full cursor-nw-resize z-10 shadow-lg"
                onMouseDown={(e) => handleMouseDown(e, widget.id, 'resize-nw')}
              />
              <div
                className="absolute -top-1 -right-1 w-4 h-4 bg-[hsl(var(--dashboard-primary-blue))] rounded-full cursor-ne-resize z-10 shadow-lg"
                onMouseDown={(e) => handleMouseDown(e, widget.id, 'resize-ne')}
              />
              <div
                className="absolute -bottom-1 -left-1 w-4 h-4 bg-[hsl(var(--dashboard-primary-blue))] rounded-full cursor-sw-resize z-10 shadow-lg"
                onMouseDown={(e) => handleMouseDown(e, widget.id, 'resize-sw')}
              />
              <div
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-[hsl(var(--dashboard-primary-blue))] rounded-full cursor-se-resize z-10 shadow-lg"
                onMouseDown={(e) => handleMouseDown(e, widget.id, 'resize-se')}
              />
              
              {/* Edge handles */}
              <div
                className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-[hsl(var(--dashboard-primary-blue))] rounded-full cursor-n-resize z-10 shadow-lg"
                onMouseDown={(e) => handleMouseDown(e, widget.id, 'resize-n')}
              />
              <div
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-[hsl(var(--dashboard-primary-blue))] rounded-full cursor-s-resize z-10 shadow-lg"
                onMouseDown={(e) => handleMouseDown(e, widget.id, 'resize-s')}
              />
              <div
                className="absolute -left-1 top-1/2 -translate-y-1/2 w-4 h-4 bg-[hsl(var(--dashboard-primary-blue))] rounded-full cursor-w-resize z-10 shadow-lg"
                onMouseDown={(e) => handleMouseDown(e, widget.id, 'resize-w')}
              />
              <div
                className="absolute -right-1 top-1/2 -translate-y-1/2 w-4 h-4 bg-[hsl(var(--dashboard-primary-blue))] rounded-full cursor-e-resize z-10 shadow-lg"
                onMouseDown={(e) => handleMouseDown(e, widget.id, 'resize-e')}
              />
            </>
          )}
          
          {/* Widget content */}
          <div className="pointer-events-none w-full h-full flex flex-col">
            {renderWidgetContent(displayWidget)}
          </div>
        </div>
      );
    });
  };

  const renderGrid = () => {
    const cells = [];
    const selectionValid = isSelectionValid();
    
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const isSelected = selectedStart?.row === row && selectedStart?.col === col;
        const isInSelection = isCellInSelection(row, col);
        const isWidget = isWidgetCell(row, col);
        
        cells.push(
          <div
            key={`${row}-${col}`}
            className={`
              border border-[hsl(var(--dashboard-card-border))]/30 cursor-pointer transition-all duration-150
              ${isSelected ? 'bg-[hsl(var(--dashboard-primary-blue))]/50 border-[hsl(var(--dashboard-primary-blue))]' : ''}
              ${isInSelection && !isSelected && selectionValid ? 'bg-[hsl(var(--dashboard-primary-blue))]/20 border-[hsl(var(--dashboard-primary-blue))]/60' : ''}
              ${isInSelection && !isSelected && !selectionValid ? 'bg-[hsl(var(--dashboard-error))]/20 border-[hsl(var(--dashboard-error))]' : ''}
              ${!isInSelection && !isSelected && !isWidget ? 'bg-[hsl(var(--dashboard-accent-background))]/50 hover:bg-[hsl(var(--dashboard-card-hover))]/60' : ''}
              ${isWidget ? 'opacity-0' : ''}
            `}
            style={{
              gridColumn: col + 1,
              gridRow: row + 1,
              minHeight: '24px'
            }}
            onClick={() => handleCellClick(row, col)}
            onMouseEnter={() => handleCellHover(row, col)}
          />
        );
      }
    }
    
    return cells;
  };

  // Remove the getThemeColor utility function and update chart theming
  const renderChart = (widget: Widget) => {
    const data = chartData[widget.id];
    const isLoading = loadingCharts[widget.id];
    const error = chartErrors[widget.id];
    const chartType = widget.chartType || 'bar';

    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--dashboard-primary-blue))]"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-full p-2">
          <div className="text-[hsl(var(--dashboard-error))] text-xs text-center">
            <div className="font-medium mb-1">Query Error</div>
            <div className="opacity-80">{error}</div>
          </div>
        </div>
      );
    }

    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">No data available</div>
        </div>
      );
    }

    const transformedData = transformDataForChart(data, chartType);

    if (!transformedData || transformedData.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">Invalid data format</div>
        </div>
      );
    }

    const commonProps = {
      theme: {
        background: 'transparent',
        text: {
          fill: 'hsl(var(--dashboard-card-foreground))',
          fontSize: 11
        },
        axis: {
          domain: {
            line: {
              stroke: 'hsl(var(--dashboard-chart-grid))',
              strokeWidth: 1
            }
          },
          legend: {
            text: {
              fill: 'hsl(var(--dashboard-card-foreground))',
              fontSize: 12
            }
          },
          ticks: {
            line: {
              stroke: 'hsl(var(--dashboard-chart-grid))',
              strokeWidth: 1
            },
            text: {
              fill: 'hsl(var(--dashboard-muted-foreground))',
              fontSize: 10
            }
          }
        },
        grid: {
          line: {
            stroke: 'hsl(var(--dashboard-chart-grid))',
            strokeWidth: 1
          }
        },
        tooltip: {
          container: {
            background: 'hsl(var(--dashboard-card-background))',
            color: 'hsl(var(--dashboard-card-foreground))',
            fontSize: 12,
            borderRadius: 8,
            border: '1px solid hsl(var(--dashboard-card-border))',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
          }
        }
      }
    };

    // Theme-aware chart colors
    const chartColors = [
      'hsl(var(--dashboard-primary-blue))',
      'hsl(var(--dashboard-primary-green))', 
      'hsl(var(--dashboard-primary-purple))',
      'hsl(var(--dashboard-primary-orange))',
      'hsl(var(--dashboard-error))',
      'hsl(var(--dashboard-warning))',
      'hsl(var(--dashboard-success))'
    ];

    switch (chartType) {
      case 'bar':
        const barData = transformedData as Array<{[key: string]: string | number}>;
        if (!barData.length) return null;
        
        const firstDataPoint = barData[0];
        const keys = Object.keys(firstDataPoint).filter(key => typeof firstDataPoint[key] === 'number');
        
        return (
          <ResponsiveBar
            data={barData}
            keys={keys}
            indexBy={Object.keys(firstDataPoint).find(key => typeof firstDataPoint[key] === 'string') || 'id'}
            margin={{ top: 30, right: 30, bottom: 60, left: 80 }}
            padding={0.3}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            
            borderRadius={4}
            borderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              legendPosition: 'middle',
              legendOffset: 45
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legendPosition: 'middle',
              legendOffset: -60
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor="hsl(var(--dashboard-card-background))"
            animate={true}
            {...commonProps}
          />
        );

      case 'pie':
        const pieData = transformedData as Array<{id: string; label: string; value: number}>;
        return (
          <ResponsivePie
            data={pieData}
            margin={{ top: 30, right: 30, bottom: 30, left: 30 }}
            innerRadius={0.4}
            padAngle={2}
            cornerRadius={4}
            activeOuterRadiusOffset={8}
            borderWidth={2}
            borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
            
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="hsl(var(--dashboard-card-foreground))"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor="hsl(var(--dashboard-card-background))"
            animate={true}
            {...commonProps}
          />
        );

      case 'line':
        const lineData = transformedData as Array<{id: string; data: Array<{x: string; y: number}>}>;
        return (
          <ResponsiveLine
            data={lineData}
            margin={{ top: 30, right: 30, bottom: 60, left: 80 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
            yFormat=" >-.2f"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              legendPosition: 'middle',
              legendOffset: 45
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legendPosition: 'middle',
              legendOffset: -60
            }}
            pointSize={8}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
            
            animate={true}
            {...commonProps}
          />
        );

      case 'boxplot':
        const boxplotData = transformedData as any[];
        return (
          <ResponsiveBoxPlot
            data={boxplotData}
            margin={{ top: 30, right: 30, bottom: 60, left: 80 }}
            minValue="auto"
            maxValue="auto"
            padding={0.12}
            enableGridX={true}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              legendPosition: 'middle',
              legendOffset: 45
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legendPosition: 'middle',
              legendOffset: -60
            }}
            
            borderRadius={2}
            borderWidth={2}
            borderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
            medianWidth={2}
            medianColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
            whiskerEndSize={0.6}
            whiskerColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
            animate={true}
          />
        );

      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">Unsupported chart type</div>
          </div>
        );
    }
  };

  const renderCardContent = (widget: Widget) => {
    const data = chartData[widget.id];
    const isLoading = loadingCharts[widget.id];
    const error = chartErrors[widget.id];
    const alignmentClass = getAlignmentClass(widget.alignment);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--dashboard-primary-blue))]"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-full p-3">
          <div className="text-[hsl(var(--dashboard-error))] text-sm text-center bg-[hsl(var(--dashboard-error))]/10 p-3 rounded-lg border border-[hsl(var(--dashboard-error))]/20">
            <div className="font-medium mb-1">Query Error</div>
            <div className="opacity-80 text-xs">{error}</div>
          </div>
        </div>
      );
    }

    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">No data available</div>
        </div>
      );
    }

    // Handle the data format: [{ "total_stores": 697055, "avg_forecast": 1.7624784874900556 }]
    const firstRow = data[0];
    const entries = Object.entries(firstRow);

    return (
      <div className={`h-full flex flex-col justify-center space-y-4 ${alignmentClass}`}>
        {entries.map(([key, value], index) => {
          // Format the key to be more readable
          const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          
          // Format the value based on its type
          let formattedValue = value;
          if (typeof value === 'number') {
            // Format large numbers with commas and round decimals
            if (value > 1000) {
              formattedValue = value.toLocaleString();
            } else if (value % 1 !== 0) {
              formattedValue = value.toFixed(2);
            }
          }

          // Theme-aware color scheme for different metrics
          const colors = [
            'text-[hsl(var(--dashboard-primary-blue))]',
            'text-[hsl(var(--dashboard-primary-green))]', 
            'text-[hsl(var(--dashboard-primary-purple))]',
            'text-[hsl(var(--dashboard-primary-orange))]',
            'text-[hsl(var(--dashboard-error))]',
            'text-[hsl(var(--dashboard-warning))]'
          ];

          return (
            <div key={index} className="flex flex-col space-y-2">
              <div className="text-[hsl(var(--dashboard-muted-foreground))] text-xs font-medium uppercase tracking-wider">
                {formattedKey}
              </div>
              <div className={`text-2xl font-bold ${colors[index % colors.length]}`}>
                {formattedValue}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderTableContent = (widget: Widget) => {
    const tableState = tableStates[widget.id];
    const alignmentClass = getAlignmentClass(widget.alignment);

    if (!tableState) {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--dashboard-primary-blue))]"></div>
        </div>
      );
    }

    if (tableState.loading && tableState.data.length === 0) {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--dashboard-primary-blue))]"></div>
        </div>
      );
    }

    if (tableState.error) {
      return (
        <div className="absolute inset-0 flex items-center justify-center p-3">
          <div className="text-[hsl(var(--dashboard-error))] text-sm text-center bg-[hsl(var(--dashboard-error))]/10 p-3 rounded-lg border border-[hsl(var(--dashboard-error))]/20">
            <div className="font-medium mb-1">Query Error</div>
            <div className="opacity-80 text-xs">{tableState.error}</div>
          </div>
        </div>
      );
    }

    if (!tableState.data || tableState.data.length === 0) {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">No data available</div>
        </div>
      );
    }

    const { data, columns, loading, hasMore } = tableState;

    return (
      <div className="absolute inset-0 flex flex-col">
        {/* Table container with scroll - takes most of the available height */}
        <div className="flex-1 overflow-auto min-h-0">
          <table className="w-full">
            {/* Table header */}
            <thead className="sticky top-0 bg-[hsl(var(--table-header-background))] backdrop-blur-sm border-b border-[hsl(var(--table-border))] z-10">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className={`px-4 py-3 text-left text-xs font-medium text-[hsl(var(--table-header-foreground))] uppercase tracking-wider ${alignmentClass}`}
                  >
                    {column.replace(/_/g, ' ')}
                  </th>
                ))}
              </tr>
            </thead>
            
            {/* Table body */}
            <tbody className="divide-y divide-[hsl(var(--table-border))]">
              {data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-[hsl(var(--table-row-hover))] transition-colors"
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-4 py-3 text-sm text-[hsl(var(--table-foreground))] ${alignmentClass}`}
                    >
                      {row[column] !== null && row[column] !== undefined 
                        ? String(row[column]) 
                        : '-'
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Load more button for infinite pagination - fixed height at bottom */}
        {widget.enablePagination && hasMore && (
          <div className="flex-shrink-0 p-3 border-t border-[hsl(var(--table-border))] bg-[hsl(var(--table-header-background))]/50">
            <button
              onClick={() => loadMoreTableData(widget.id, widget)}
              disabled={loading}
              className="w-full px-3 py-2 bg-[hsl(var(--dashboard-primary-blue))]/80 hover:bg-[hsl(var(--dashboard-primary-blue))] disabled:bg-[hsl(var(--dashboard-muted-foreground))] disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <ChevronDown size={14} />
                  <span>Load More ({widget.pageSize || 50} rows)</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Show loading indicator when loading more data - fixed height overlay */}
        {loading && data.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-[hsl(var(--table-border))] bg-[hsl(var(--table-header-background))]/90 backdrop-blur-sm">
            <div className="flex items-center justify-center space-x-2 text-[hsl(var(--table-muted-foreground))] text-sm">
              <RefreshCw size={12} className="animate-spin" />
              <span>Loading more data...</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!isEditMode) {
    // View mode - show widgets without grid if any exist
    if (widgets.length > 0) {
      return (
        <div className="flex-1 flex flex-col h-full bg-[hsl(var(--dashboard-background))]">
          {/* View Mode Header - only show if not embedded */}
          {!embedded && (
            <div className="h-12 bg-[hsl(var(--dashboard-card-background))] border-b border-[hsl(var(--dashboard-card-border))] flex items-center justify-between px-4 flex-shrink-0">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-[hsl(var(--dashboard-primary-blue))] rounded flex items-center justify-center mr-3">
                  <span className="text-white text-xs font-bold">#</span>
                </div>
                <h1 className="text-[hsl(var(--dashboard-card-foreground))] font-medium text-base">{getAnalyticsTitle()}</h1>
              </div>
              <div className="flex items-center space-x-2">
                {/* Save Status Indicator */}
                {saving && (
                  <div className="w-1.5 h-1.5 bg-[hsl(var(--dashboard-primary-blue))] rounded-full animate-pulse"></div>
                )}
                {saveError && (
                  <div className="w-1.5 h-1.5 bg-[hsl(var(--dashboard-error))] rounded-full"></div>
                )}
                <button
                  onClick={handleEnterEditMode}
                  className="w-7 h-7 bg-[hsl(var(--dashboard-accent-background))] hover:bg-[hsl(var(--dashboard-card-hover))] text-[hsl(var(--dashboard-muted-foreground))] hover:text-[hsl(var(--dashboard-card-foreground))] rounded transition-all duration-200 flex items-center justify-center border border-[hsl(var(--dashboard-card-border))]"
                >
                  <Edit size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Filter Dropdowns - only show if not embedded */}
          {!embedded && renderFilterDropdowns()}

          {/* Widgets Container - View Mode */}
          <div className="flex-1 overflow-auto p-6">
            <div 
              className="grid gap-4 w-full relative"
              style={{
                gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
                gridTemplateRows: `repeat(${GRID_ROWS}, minmax(24px, auto))`
              }}
            >
              {widgets.map(widget => {
                const isHeading = widget.widgetType === 'heading';
                
                // Check if widget should be rendered based on filter requirements
                const shouldRenderWidget = () => {
                  // Always render heading widgets
                  if (isHeading) return true;
                  
                  // For embedded mode, always render widgets (filters are auto-set)
                  if (embedded) return true;
                  
                  // For other widgets, only render if all required filters are selected
                  return areAllFiltersSelected();
                };
                
                if (!shouldRenderWidget()) {
                  return (
                    <div
                      key={widget.id}
                      className="bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] rounded-xl relative overflow-hidden"
                      style={{
                        gridColumn: `${widget.startCol + 1} / ${widget.endCol + 2}`,
                        gridRow: `${widget.startRow + 1} / ${widget.endRow + 2}`,
                        minHeight: '24px'
                      }}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                                              <div className="text-center">
                        <Filter size={48} className="text-[hsl(var(--dashboard-muted-foreground))] mx-auto mb-3" />
                        <div className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">Select parameters to view chart</div>
                        <div className="text-[hsl(var(--dashboard-muted-foreground))]/70 text-xs mt-1">Required: {requiredColumns.join(', ')}</div>
                      </div>
                      </div>
                    </div>
                  );
                }
                
                return (
                  <div
                    key={widget.id}
                    className={`
                      ${isHeading ? 'bg-transparent border-transparent' : 'bg-[hsl(var(--dashboard-card-background))] border-[hsl(var(--dashboard-card-border))]'} 
                      border rounded-xl relative overflow-hidden transition-all duration-200
                      ${isHeading ? 'hover:scale-[1.01]' : 'hover:scale-[1.01] hover:bg-[hsl(var(--dashboard-card-hover))] shadow-lg hover:shadow-xl'}
                    `}
                    style={{
                      gridColumn: `${widget.startCol + 1} / ${widget.endCol + 2}`,
                      gridRow: `${widget.startRow + 1} / ${widget.endRow + 2}`,
                      minHeight: '24px'
                    }}
                  >
                    {/* Widget content - View Mode */}
                    <div className="w-full h-full flex flex-col">
                      {renderWidgetContent(widget)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // Empty state when no widgets exist
    return (
      <div className="flex-1 h-full flex items-center justify-center bg-[hsl(var(--dashboard-background))]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[hsl(var(--dashboard-card-foreground))] mb-3">
            {getAnalyticsTitle()}
          </h2>
          
          <p className="text-[hsl(var(--dashboard-muted-foreground))] mb-8 text-sm max-w-md">
            Create your first analytics dashboard by adding charts, cards, and visualizations to track your data.
          </p>
        
          <button
            onClick={handleEnterEditMode}
            className="px-6 py-3 bg-[hsl(var(--dashboard-card-background))] hover:bg-[hsl(var(--dashboard-card-hover))] text-[hsl(var(--dashboard-card-foreground))] rounded-lg text-sm transition-all duration-200 border border-[hsl(var(--dashboard-card-border))] shadow-sm hover:shadow-md"
          >
            <Plus size={16} className="inline mr-2" />
            Create Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[hsl(var(--dashboard-background))]">
      {/* Edit Mode Header - only show if not embedded */}
      {!embedded && (
        <div className="h-12 bg-[hsl(var(--dashboard-card-background))] border-b border-[hsl(var(--dashboard-card-border))] flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-[hsl(var(--dashboard-warning))] rounded flex items-center justify-center mr-3">
              <span className="text-white text-xs font-bold">#</span>
            </div>
            <h1 className="text-[hsl(var(--dashboard-card-foreground))] font-medium text-base">{getAnalyticsTitle()}</h1>
            <span className="ml-2 px-2 py-0.5 bg-[hsl(var(--dashboard-warning))]/20 text-[hsl(var(--dashboard-warning))] text-xs rounded-full border border-[hsl(var(--dashboard-warning))]/30">Edit</span>
          </div>
          <button
            onClick={handleExitEditMode}
            className="px-3 py-1.5 bg-[hsl(var(--dashboard-accent-background))] hover:bg-[hsl(var(--dashboard-card-hover))] text-[hsl(var(--dashboard-muted-foreground))] hover:text-[hsl(var(--dashboard-card-foreground))] rounded text-sm transition-all duration-200 flex items-center border border-[hsl(var(--dashboard-card-border))]"
          >
            <X size={14} className="mr-1" />
            Done
          </button>
        </div>
      )}

      {/* Filter Dropdowns - only show if not embedded */}
      {!embedded && renderFilterDropdowns()}

      {/* Minimal Instructions - only show if not embedded */}
      {!embedded && (
        <>
          {selectedWidget ? (
            <div className="bg-[hsl(var(--dashboard-accent-background))] border-b border-[hsl(var(--dashboard-card-border))] px-4 py-2 text-xs text-[hsl(var(--dashboard-muted-foreground))] flex-shrink-0">
              Move with arrow keys or drag • Resize with handles • Delete with backspace
            </div>
          ) : !selectedStart ? (
            <div className="bg-[hsl(var(--dashboard-accent-background))] border-b border-[hsl(var(--dashboard-card-border))] px-4 py-2 text-xs text-[hsl(var(--dashboard-muted-foreground))] flex-shrink-0">
              Select area to create widget • Click existing widgets to edit
            </div>
          ) : isSelectionValid() ? (
            <div className="bg-[hsl(var(--dashboard-accent-background))] border-b border-[hsl(var(--dashboard-card-border))] px-4 py-2 text-xs text-[hsl(var(--dashboard-muted-foreground))] flex-shrink-0">
              Click to complete selection
            </div>
          ) : (
            <div className="bg-[hsl(var(--dashboard-error))]/10 border-b border-[hsl(var(--dashboard-error))]/20 px-4 py-2 text-xs text-[hsl(var(--dashboard-error))] flex-shrink-0">
              Selection overlaps • Choose different area
            </div>
          )}
        </>
      )}

      {/* Grid Container */}
      <div className="flex-1 overflow-auto p-6">
        <div 
          ref={gridRef}
          className="grid gap-1 w-full relative"
          style={{
            gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_ROWS}, minmax(24px, auto))`
          }}
        >
          {renderGrid()}
          {renderWidgets()}
        </div>
      </div>

      {/* Widget Creation Form Modal */}
      {showWidgetForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] rounded-lg w-full max-w-4xl flex shadow-2xl">
            {/* Left Panel - Form */}
            <div className="flex-1 p-6">
              <h3 className="text-[hsl(var(--dashboard-card-foreground))] font-medium text-lg mb-4">
                {editingWidget ? 'Edit Widget' : 'Create Widget'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[hsl(var(--dashboard-card-foreground))] text-sm mb-1">Widget Type</label>
                  <select
                    value={widgetFormData.widgetType}
                    onChange={(e) => setWidgetFormData(prev => ({ ...prev, widgetType: e.target.value as 'chart' | 'card' | 'heading' | 'table' }))}
                    className="w-full px-3 py-2 bg-[hsl(var(--dashboard-accent-background))] border border-[hsl(var(--dashboard-card-border))] rounded text-[hsl(var(--dashboard-card-foreground))] text-sm focus:outline-none focus:border-[hsl(var(--dashboard-primary-blue))] focus:ring-1 focus:ring-[hsl(var(--dashboard-primary-blue))]"
                  >
                    <option value="chart">Chart</option>
                    <option value="card">Card</option>
                    <option value="heading">Heading</option>
                    <option value="table">Table</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[hsl(var(--dashboard-card-foreground))] text-sm mb-1">Title</label>
                  <input
                    type="text"
                    value={widgetFormData.title}
                    onChange={(e) => setWidgetFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 bg-[hsl(var(--dashboard-accent-background))] border border-[hsl(var(--dashboard-card-border))] rounded text-[hsl(var(--dashboard-card-foreground))] placeholder-[hsl(var(--dashboard-muted-foreground))] text-sm focus:outline-none focus:border-[hsl(var(--dashboard-primary-blue))] focus:ring-1 focus:ring-[hsl(var(--dashboard-primary-blue))]"
                    placeholder="Enter title"
                  />
                </div>

                <div>
                  <label className="block text-[hsl(var(--dashboard-card-foreground))] text-sm mb-1">Description</label>
                  <textarea
                    value={widgetFormData.description}
                    onChange={(e) => setWidgetFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 bg-[hsl(var(--dashboard-accent-background))] border border-[hsl(var(--dashboard-card-border))] rounded text-[hsl(var(--dashboard-card-foreground))] placeholder-[hsl(var(--dashboard-muted-foreground))] text-sm focus:outline-none focus:border-[hsl(var(--dashboard-primary-blue))] focus:ring-1 focus:ring-[hsl(var(--dashboard-primary-blue))] resize-none"
                    placeholder="Enter description"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-[hsl(var(--dashboard-card-foreground))] text-sm mb-1">Alignment</label>
                  <select
                    value={widgetFormData.alignment}
                    onChange={(e) => setWidgetFormData(prev => ({ ...prev, alignment: e.target.value as 'left' | 'center' | 'right' }))}
                    className="w-full px-3 py-2 bg-[hsl(var(--dashboard-accent-background))] border border-[hsl(var(--dashboard-card-border))] rounded text-[hsl(var(--dashboard-card-foreground))] text-sm focus:outline-none focus:border-[hsl(var(--dashboard-primary-blue))] focus:ring-1 focus:ring-[hsl(var(--dashboard-primary-blue))]"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>

                {widgetFormData.widgetType === 'chart' && (
                  <div>
                    <label className="block text-[hsl(var(--dashboard-card-foreground))] text-sm mb-1">Chart Type</label>
                    <select
                      value={widgetFormData.chartType}
                      onChange={(e) => setWidgetFormData(prev => ({ ...prev, chartType: e.target.value as 'bar' | 'pie' | 'line' | 'boxplot' }))}
                      className="w-full px-3 py-2 bg-[hsl(var(--dashboard-accent-background))] border border-[hsl(var(--dashboard-card-border))] rounded text-[hsl(var(--dashboard-card-foreground))] text-sm focus:outline-none focus:border-[hsl(var(--dashboard-primary-blue))] focus:ring-1 focus:ring-[hsl(var(--dashboard-primary-blue))]"
                    >
                      <option value="bar">Bar Chart</option>
                      <option value="pie">Pie Chart</option>
                      <option value="line">Line Chart</option>
                      <option value="boxplot">Box Plot</option>
                    </select>
                  </div>
                )}

                {(widgetFormData.widgetType === 'chart' || widgetFormData.widgetType === 'card' || widgetFormData.widgetType === 'table') && (
                  <div>
                    <label className="block text-[hsl(var(--dashboard-card-foreground))] text-sm mb-1">SQL Query</label>
                    <textarea
                      value={widgetFormData.sqlQuery}
                      onChange={(e) => setWidgetFormData(prev => ({ ...prev, sqlQuery: e.target.value }))}
                      className="w-full px-3 py-2 bg-[hsl(var(--dashboard-accent-background))] border border-[hsl(var(--dashboard-card-border))] rounded text-[hsl(var(--dashboard-card-foreground))] placeholder-[hsl(var(--dashboard-muted-foreground))] font-mono text-xs focus:outline-none focus:border-[hsl(var(--dashboard-primary-blue))] focus:ring-1 focus:ring-[hsl(var(--dashboard-primary-blue))] resize-none"
                      placeholder="SELECT column1, column2 FROM forecast"
                      rows={4}
                    />
                  </div>
                )}

                {widgetFormData.widgetType === 'table' && (
                  <div>
                    <label className="block text-[hsl(var(--dashboard-card-foreground))] text-sm mb-1">Page Size</label>
                    <input
                      type="number"
                      value={widgetFormData.pageSize}
                      onChange={(e) => setWidgetFormData(prev => ({ ...prev, pageSize: Number(e.target.value) }))}
                      className="w-full px-3 py-2 bg-[hsl(var(--dashboard-accent-background))] border border-[hsl(var(--dashboard-card-border))] rounded text-[hsl(var(--dashboard-card-foreground))] text-sm focus:outline-none focus:border-[hsl(var(--dashboard-primary-blue))] focus:ring-1 focus:ring-[hsl(var(--dashboard-primary-blue))]"
                    />
                  </div>
                )}

                {widgetFormData.widgetType === 'table' && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={widgetFormData.enablePagination}
                      onChange={(e) => setWidgetFormData(prev => ({ ...prev, enablePagination: e.target.checked }))}
                      className="mr-2 text-[hsl(var(--dashboard-primary-blue))] focus:ring-[hsl(var(--dashboard-primary-blue))]"
                    />
                    <label className="text-[hsl(var(--dashboard-card-foreground))] text-sm">Enable Pagination</label>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleCancelWidget}
                  className="px-4 py-2 bg-[hsl(var(--dashboard-accent-background))] hover:bg-[hsl(var(--dashboard-card-hover))] text-[hsl(var(--dashboard-muted-foreground))] hover:text-[hsl(var(--dashboard-card-foreground))] rounded text-sm transition-colors border border-[hsl(var(--dashboard-card-border))]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveWidget}
                  className="px-4 py-2 bg-[hsl(var(--dashboard-primary-blue))] hover:bg-[hsl(var(--dashboard-primary-blue))]/90 text-white rounded text-sm transition-colors shadow-sm hover:shadow-md"
                >
                  {editingWidget ? 'Update' : 'Create'}
                </button>
              </div>
            </div>

            {/* Right Panel - Examples */}
            <div className="w-80 bg-[hsl(var(--dashboard-accent-background))] border-l border-[hsl(var(--dashboard-card-border))] p-6 flex flex-col">
              <h4 className="text-[hsl(var(--dashboard-card-foreground))] font-medium text-base mb-4 flex-shrink-0">Example SQL Queries</h4>
              
              {/* Scrollable container for examples */}
              <div className="flex-1 overflow-y-auto pr-2 space-y-6" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                {/* Variable Usage Info */}
                <div>
                  <h5 className="text-[hsl(var(--dashboard-success))] font-medium text-sm mb-3 sticky top-0 bg-[hsl(var(--dashboard-accent-background))] py-1">Variable Usage</h5>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs mb-2">Page Title with Variables</p>
                      <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs mb-2">Use $column_name in page title to create filters</p>
                      <code className="block text-xs bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] p-3 rounded text-[hsl(var(--dashboard-success))] leading-relaxed">
                        Page Title: "$brand;$store_no"<br/>
                        Creates dropdowns for brand and store_no
                      </code>
                    </div>
                                         <div>
                       <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs mb-2">SQL Query Variables</p>
                       <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs mb-2">Use $column_name in SQL queries for dynamic filtering</p>
                       <code className="block text-xs bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] p-3 rounded text-[hsl(var(--dashboard-success))] leading-relaxed">
                         SELECT * FROM forecast WHERE brand = $brand AND store_no = $store_no<br/>
                         <span className="text-[hsl(var(--dashboard-muted-foreground))]">Becomes: SELECT * FROM forecast WHERE brand = 'Nike' AND store_no = '12345'</span>
                       </code>
                     </div>
                  </div>
                </div>

                {/* Bar Chart Examples */}
                <div>
                  <h5 className="text-[hsl(var(--dashboard-primary-blue))] font-medium text-sm mb-3 sticky top-0 bg-[hsl(var(--dashboard-accent-background))] py-1">Bar Chart</h5>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs mb-2">Forecast Quantity by Region</p>
                      <code className="block text-xs bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] p-3 rounded text-[hsl(var(--dashboard-success))] leading-relaxed">
                        SELECT region, SUM(forecast_qty) as total_forecast FROM forecast GROUP BY region ORDER BY total_forecast DESC
                      </code>
                    </div>
                    <div>
                      <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs mb-2">Sales by Super Category (with filter)</p>
                      <code className="block text-xs bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] p-3 rounded text-[hsl(var(--dashboard-success))] leading-relaxed">
                        SELECT super_category, SUM(sold_qty) as total_sales FROM forecast WHERE brand = $brand GROUP BY super_category ORDER BY total_sales DESC
                      </code>
                    </div>
                    <div>
                      <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs mb-2">Store Performance (with multiple filters)</p>
                      <code className="block text-xs bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] p-3 rounded text-[hsl(var(--dashboard-success))] leading-relaxed">
                        SELECT state, COUNT(DISTINCT store_no) as store_count, AVG(forecast_qty) as avg_forecast FROM forecast WHERE brand = $brand AND region = $region GROUP BY state ORDER BY avg_forecast DESC
                      </code>
                    </div>
                    <div>
                      <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs mb-2">Store Performance by State</p>
                      <code className="block text-xs bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] p-3 rounded text-[hsl(var(--dashboard-success))] leading-relaxed">
                        SELECT state, COUNT(DISTINCT store_no) as store_count, AVG(forecast_qty) as avg_forecast FROM forecast GROUP BY state ORDER BY avg_forecast DESC
                      </code>
                    </div>
                    <div>
                      <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs mb-2">Top Brands by Sales Volume (with filters)</p>
                      <code className="block text-xs bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] p-3 rounded text-[hsl(var(--dashboard-success))] leading-relaxed">
                        SELECT brand, SUM(sold_qty) as total_sales FROM forecast WHERE brand IS NOT NULL AND region = $region AND store_no = $store_no GROUP BY brand ORDER BY total_sales DESC LIMIT 10
                      </code>
                    </div>
                  </div>
                </div>

                {/* Pie Chart Examples */}
                <div>
                  <h5 className="text-[hsl(var(--dashboard-primary-purple))] font-medium text-sm mb-3 sticky top-0 bg-[hsl(var(--dashboard-accent-background))] py-1">Pie Chart</h5>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs mb-2">Sales Distribution by Store Type</p>
                      <code className="block text-xs bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] p-3 rounded text-[hsl(var(--dashboard-success))] leading-relaxed">
                        SELECT store_type, SUM(sold_qty) as total_sales FROM forecast GROUP BY store_type
                      </code>
                    </div>
                    <div>
                      <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs mb-2">Revenue Distribution by Vertical (with filter)</p>
                      <code className="block text-xs bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] p-3 rounded text-[hsl(var(--dashboard-success))] leading-relaxed">
                        SELECT vertical, SUM(forecast_qty) as total_forecast FROM forecast WHERE vertical IS NOT NULL AND brand = $brand GROUP BY vertical
                      </code>
                    </div>
                    <div>
                      <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs mb-2">Product Segment Distribution</p>
                      <code className="block text-xs bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] p-3 rounded text-[hsl(var(--dashboard-success))] leading-relaxed">
                        SELECT segment, COUNT(*) as product_count FROM forecast WHERE segment IS NOT NULL GROUP BY segment
                      </code>
                    </div>
                  </div>
                </div>

                {/* Line Chart Examples */}
                <div>
                  <h5 className="text-[hsl(var(--dashboard-primary-green))] font-medium text-sm mb-3 sticky top-0 bg-[hsl(var(--dashboard-accent-background))] py-1">Line Chart</h5>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs mb-2">Monthly Sales Trend</p>
                      <code className="block text-xs bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] p-3 rounded text-[hsl(var(--dashboard-success))] leading-relaxed">
                        SELECT month_year, SUM(sold_qty) as total_sales, 'Actual Sales' as series FROM forecast GROUP BY month_year ORDER BY month_year
                      </code>
                    </div>
                    <div>
                      <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs mb-2">Brand Performance Trend (with filter)</p>
                      <code className="block text-xs bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] p-3 rounded text-[hsl(var(--dashboard-success))] leading-relaxed">
                        SELECT month_year, SUM(sold_qty) as total_sales, 'Brand Sales' as series FROM forecast WHERE brand = $brand GROUP BY month_year ORDER BY month_year
                      </code>
                    </div>
                    <div>
                      <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs mb-2">Forecast vs Actual Comparison</p>
                      <code className="block text-xs bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] p-3 rounded text-[hsl(var(--dashboard-success))] leading-relaxed">
                        SELECT month_year, SUM(forecast_qty) as value, 'Forecast' as series FROM forecast GROUP BY month_year UNION ALL SELECT month_year, SUM(sold_qty), 'Actual' FROM forecast GROUP BY month_year ORDER BY month_year
                      </code>
                    </div>
                    <div>
                      <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs mb-2">Regional Sales Trends</p>
                      <code className="block text-xs bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] p-3 rounded text-[hsl(var(--dashboard-success))] leading-relaxed">
                        SELECT month_year, SUM(sold_qty) as total_sales, region FROM forecast WHERE region IN ('North', 'South', 'East', 'West') GROUP BY month_year, region ORDER BY month_year
                      </code>
                    </div>
                    <div>
                      <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs mb-2">Week-over-Week Performance</p>
                      <code className="block text-xs bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] p-3 rounded text-[hsl(var(--dashboard-success))] leading-relaxed">
                        SELECT wom as week, AVG(sold_qty) as avg_sales, 'Weekly Average' as series FROM forecast GROUP BY wom ORDER BY wom
                      </code>
                    </div>
                  </div>
                </div>

                {/* Box Plot Examples */}
                <div>
                  <h5 className="text-[hsl(var(--dashboard-primary-orange))] font-medium text-sm mb-3 sticky top-0 bg-[hsl(var(--dashboard-accent-background))] py-1">Box Plot</h5>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs mb-2">Forecast Accuracy Distribution by Region</p>
                      <code className="block text-xs bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] p-3 rounded text-[hsl(var(--dashboard-success))] leading-relaxed">
                        SELECT region, (sold_qty - forecast_qty) as forecast_error FROM forecast WHERE sold_qty IS NOT NULL AND forecast_qty IS NOT NULL
                      </code>
                    </div>
                    <div>
                      <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs mb-2">Sales Performance by Store Type</p>
                      <code className="block text-xs bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] p-3 rounded text-[hsl(var(--dashboard-success))] leading-relaxed">
                        SELECT store_type, sold_qty as sales_value FROM forecast WHERE sold_qty IS NOT NULL AND store_type IS NOT NULL
                      </code>
                    </div>
                    <div>
                      <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs mb-2">Consensus vs Forecast Distribution</p>
                      <code className="block text-xs bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] p-3 rounded text-[hsl(var(--dashboard-success))] leading-relaxed">
                        SELECT 'Consensus' as metric, consensus_qty as value FROM forecast WHERE consensus_qty IS NOT NULL UNION ALL SELECT 'Forecast', forecast_qty FROM forecast WHERE forecast_qty IS NOT NULL
                      </code>
                    </div>
                  </div>
                </div>

                {/* Card Examples */}
                <div>
                  <h5 className="text-[hsl(var(--dashboard-success))] font-medium text-sm mb-3 sticky top-0 bg-[hsl(var(--dashboard-accent-background))] py-1">Card Widget</h5>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs mb-2">Key Business Metrics</p>
                      <code className="block text-xs bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] p-3 rounded text-[hsl(var(--dashboard-success))] leading-relaxed">
                        SELECT COUNT(DISTINCT store_no) as total_stores, COUNT(DISTINCT article_id) as total_products, SUM(sold_qty) as total_sales FROM forecast
                      </code>
                    </div>
                    <div>
                      <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs mb-2">Brand-Specific Metrics (with filter)</p>
                      <code className="block text-xs bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] p-3 rounded text-[hsl(var(--dashboard-success))] leading-relaxed">
                        SELECT COUNT(DISTINCT store_no) as total_stores, COUNT(DISTINCT article_id) as total_products, SUM(sold_qty) as total_sales FROM forecast WHERE brand = $brand
                      </code>
                    </div>
                    <div>
                      <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs mb-2">Forecast Accuracy Summary</p>
                      <code className="block text-xs bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] p-3 rounded text-[hsl(var(--dashboard-success))] leading-relaxed">
                        SELECT AVG(forecast_qty) as avg_forecast, AVG(sold_qty) as avg_actual, AVG(ABS(forecast_qty - sold_qty)) as avg_error FROM forecast WHERE forecast_qty IS NOT NULL AND sold_qty IS NOT NULL
                      </code>
                    </div>
                    <div>
                      <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs mb-2">Regional Performance</p>
                      <code className="block text-xs bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] p-3 rounded text-[hsl(var(--dashboard-success))] leading-relaxed">
                        SELECT COUNT(DISTINCT region) as total_regions, COUNT(DISTINCT state) as total_states, COUNT(DISTINCT city) as total_cities FROM forecast
                      </code>
                    </div>
                    <div>
                      <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs mb-2">Product Portfolio Overview</p>
                      <code className="block text-xs bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] p-3 rounded text-[hsl(var(--dashboard-success))] leading-relaxed">
                        SELECT COUNT(DISTINCT super_category) as categories, COUNT(DISTINCT brand) as brands, COUNT(DISTINCT vertical) as verticals FROM forecast
                      </code>
                    </div>
                  </div>
                </div>

                {/* Table Examples */}
                <div>
                  <h5 className="text-[hsl(var(--dashboard-primary-blue))] font-medium text-sm mb-3 sticky top-0 bg-[hsl(var(--dashboard-accent-background))] py-1">Table Widget</h5>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs mb-2">Forecast Data Overview</p>
                      <code className="block text-xs bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] p-3 rounded text-[hsl(var(--dashboard-success))] leading-relaxed">
                        SELECT store_no, article_id, forecast_qty, sold_qty, region, state FROM forecast ORDER BY forecast_qty DESC
                      </code>
                    </div>
                    <div>
                      <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs mb-2">Product Performance Table</p>
                      <code className="block text-xs bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] p-3 rounded text-[hsl(var(--dashboard-success))] leading-relaxed">
                        SELECT article_id, brand, super_category, SUM(forecast_qty) as total_forecast, SUM(sold_qty) as total_sold, COUNT(*) as store_count FROM forecast GROUP BY article_id, brand, super_category ORDER BY total_forecast DESC
                      </code>
                    </div>
                    <div>
                      <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs mb-2">Store Performance Analysis</p>
                      <code className="block text-xs bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] p-3 rounded text-[hsl(var(--dashboard-success))] leading-relaxed">
                        SELECT store_no, region, state, city, store_type, COUNT(DISTINCT article_id) as unique_products, AVG(forecast_qty) as avg_forecast, AVG(sold_qty) as avg_sold FROM forecast GROUP BY store_no, region, state, city, store_type ORDER BY avg_forecast DESC
                      </code>
                    </div>
                    <div>
                      <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs mb-2">Monthly Sales Breakdown</p>
                      <code className="block text-xs bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] p-3 rounded text-[hsl(var(--dashboard-success))] leading-relaxed">
                        SELECT month_year, region, super_category, SUM(forecast_qty) as forecast_total, SUM(sold_qty) as sold_total, COUNT(*) as record_count FROM forecast GROUP BY month_year, region, super_category ORDER BY month_year DESC, forecast_total DESC
                      </code>
                    </div>
                    <div>
                      <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs mb-2">Detailed Article Information</p>
                      <code className="block text-xs bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] p-3 rounded text-[hsl(var(--dashboard-success))] leading-relaxed">
                        SELECT article_id, article_description, brand, vertical, super_category, segment, division, forecast_qty, sold_qty, consensus_qty, month_year FROM forecast WHERE article_description IS NOT NULL ORDER BY forecast_qty DESC
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsContent; 