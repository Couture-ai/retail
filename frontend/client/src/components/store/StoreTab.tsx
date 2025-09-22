import { useState, useEffect } from "react";
import { 
  Table, 
  BarChart3, 
  Info, 
  Loader2, 
  AlertCircle,
  FileText,
  Database,
  TrendingUp
} from "lucide-react";
import { ForecastRepository } from "@/repository/forecast_repository";
import AnalyticsContent from '../analytics/AnalyticsContent';
import { useProject } from "@/context/ProjectProvider";

interface StoreTabProps {
  storeId: string;
  panelId: string;
}

type TabType = 'overview' | 'data' | 'analytics' | 'details';

const StoreTab = ({ storeId, panelId }: StoreTabProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [storeData, setStoreData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hierarchy, setHierarchy] = useState<string[]>([]);
  
  // Initialize forecast repository
  const {forecastRepository: forecastRepo} = useProject();
  
  // Load hierarchy metadata first
  useEffect(() => {
    loadMetadata();
  }, []);
  
  // Load store data when storeId or hierarchy changes
  useEffect(() => {
    if (storeId && hierarchy.length > 0) {
      loadStoreData();
    }
  }, [storeId, hierarchy]);
  
  const loadMetadata = async () => {
    try {
      const stateSetters = {
        setLoading: () => {},
        setError: (err: string | null) => setError(err),
        setData: (data: any) => {
          if (data && data.store_location_hierarchy) {
            // Add store_no to the hierarchy if not already present
            const fullHierarchy = [...data.store_location_hierarchy];
            if (!fullHierarchy.includes('store_no')) {
              fullHierarchy.push('store_no');
            }
            setHierarchy(fullHierarchy);
          }
        }
      };
      
      await forecastRepo.getMetadata({}, stateSetters);
    } catch (err) {
      console.error('Error loading metadata:', err);
      setError('Failed to load metadata');
    }
  };
  
  // Parse store ID to extract hierarchy information dynamically
  // Store ID format:
  // - Top-level: "level-value" (e.g., "region-North")
  // - Child: "level-parentNodeId-value" (e.g., "state-region-North-Maharashtra")
  // - Nested: "level-parentNodeId-value" where parentNodeId itself contains the full parent chain
  //   (e.g., "city-state-region-North-Maharashtra-Mumbai")
  const parseStoreId = (id: string) => {
    const parts = id.split('-');
    if (parts.length < 2) return null;
    
    const level = parts[0];
    const name = parts[parts.length - 1];
    
    // Extract context from the ID structure
    const context: Record<string, string> = {};
    
    // Find the level in hierarchy
    const levelIndex = hierarchy.indexOf(level);
    if (levelIndex === -1) return null;
    
    // For top-level nodes: level-value (e.g., region-North)
    if (parts.length === 2) {
      context[level] = name;
      return { level, name, context };
    }
    
    // For child nodes: level-parentNodeId-value (e.g., state-region-North-Maharashtra)
    // We need to parse the parent node ID to extract parent context
    if (parts.length >= 3) {
      // Extract parent node ID (everything except first and last part)
      const parentNodeId = parts.slice(1, -1).join('-');
      
      // Recursively parse parent node to get its context
      const parentInfo = parseStoreId(parentNodeId);
      if (parentInfo) {
        // Copy parent context
        Object.assign(context, parentInfo.context);
      }
      
      // Add current level to context
      context[level] = name;
    }
    
    return { level, name, context };
  };
  
  const loadStoreData = async () => {
    const storeInfo = parseStoreId(storeId);
    if (!storeInfo) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Build WHERE clause from context
      const whereConditions = Object.entries(storeInfo.context)
        .map(([key, value]) => `${key} = '${value}'`)
        .join(' AND ');
      
      const sqlQuery = `SELECT * FROM forecast WHERE ${whereConditions} LIMIT 100`;
      
      const stateSetters = {
        setLoading,
        setError,
        setData: setStoreData
      };
      
      await forecastRepo.executeSqlQuery({ sql_query: sqlQuery }, stateSetters);
    } catch (err) {
      console.error('Error fetching store data:', err);
    }
  };
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'data', label: 'Data', icon: Database },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'details', label: 'Details', icon: FileText }
  ];
  
  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="flex items-center">
            <Loader2 className="animate-spin text-[hsl(var(--primary))] mr-3" size={24} />
            <span className="text-[hsl(var(--panel-foreground))]">Loading store data...</span>
          </div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <AlertCircle size={48} className="mx-auto mb-4 text-[hsl(var(--panel-error))]" />
            <h2 className="text-xl font-semibold text-[hsl(var(--panel-foreground))] mb-2">Error loading data</h2>
            <p className="text-[hsl(var(--panel-error))] mb-4">{error}</p>
          </div>
        </div>
      );
    }
    
    if (!storeData || !storeData.data || storeData.data.length === 0) {
      return (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <Database size={48} className="mx-auto mb-4 text-[hsl(var(--panel-muted-foreground))]" />
            <h2 className="text-xl font-semibold text-[hsl(var(--panel-foreground))] mb-2">No data available</h2>
            <p className="text-[hsl(var(--panel-muted-foreground))] mb-4">
              No forecast data found for the selected store
            </p>
          </div>
        </div>
      );
    }
    
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'data':
        return renderDataTable();
      case 'analytics':
        return renderAnalytics();
      case 'details':
        return renderDetails();
      default:
        return renderOverview();
    }
  };
  
  const renderOverview = () => {
    const data = storeData.data;
    
    // Calculate basic stats
    const totalRecords = data.length;
    const totalForecast = data.reduce((sum: number, row: any) => sum + (row.forecast_qty || 0), 0);
    const totalSold = data.reduce((sum: number, row: any) => sum + (row.sold_qty || 0), 0);
    const uniqueArticles = new Set(data.map((row: any) => row.article_id)).size;
    const uniqueBrands = new Set(data.map((row: any) => row.brand)).size;
    
    return (
      <div className="p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">Total Records</p>
                <p className="text-[hsl(var(--dashboard-foreground))] text-xl font-semibold">{totalRecords}</p>
              </div>
              <Database className="text-[hsl(var(--dashboard-primary-blue))]" size={20} />
            </div>
          </div>
          
          <div className="bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">Total Forecast</p>
                <p className="text-[hsl(var(--dashboard-foreground))] text-xl font-semibold">{totalForecast.toLocaleString()}</p>
              </div>
              <TrendingUp className="text-[hsl(var(--dashboard-primary-blue))]" size={20} />
            </div>
          </div>
          
          <div className="bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">Total Sold</p>
                <p className="text-[hsl(var(--dashboard-foreground))] text-xl font-semibold">{totalSold.toLocaleString()}</p>
              </div>
              <BarChart3 className="text-[hsl(var(--dashboard-success))]" size={20} />
            </div>
          </div>
          
          <div className="bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">Unique Articles</p>
                <p className="text-[hsl(var(--dashboard-foreground))] text-xl font-semibold">{uniqueArticles}</p>
              </div>
              <Table className="text-[hsl(var(--dashboard-primary-purple))]" size={20} />
            </div>
          </div>
        </div>
        
        {/* Sample Data Preview */}
        <div className="bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] rounded-lg p-4">
          <h3 className="text-[hsl(var(--dashboard-foreground))] font-medium mb-3">Recent Records Preview</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[hsl(var(--dashboard-card-border))]">
                  <th className="text-left text-[hsl(var(--dashboard-muted-foreground))] p-2">Article ID</th>
                  <th className="text-left text-[hsl(var(--dashboard-muted-foreground))] p-2">Brand</th>
                  <th className="text-left text-[hsl(var(--dashboard-muted-foreground))] p-2">Forecast Qty</th>
                  <th className="text-left text-[hsl(var(--dashboard-muted-foreground))] p-2">Sold Qty</th>
                  <th className="text-left text-[hsl(var(--dashboard-muted-foreground))] p-2">Week</th>
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 5).map((row: any, index: number) => (
                  <tr key={index} className="border-b border-[hsl(var(--dashboard-card-border))]/50 hover:bg-[hsl(var(--dashboard-card-hover))] transition-colors">
                    <td className="text-[hsl(var(--dashboard-foreground))] p-2">{row.article_id || 'N/A'}</td>
                    <td className="text-[hsl(var(--dashboard-foreground))] p-2">{row.brand || 'N/A'}</td>
                    <td className="text-[hsl(var(--dashboard-foreground))] p-2">{row.forecast_qty || 0}</td>
                    <td className="text-[hsl(var(--dashboard-foreground))] p-2">{row.sold_qty || 0}</td>
                    <td className="text-[hsl(var(--dashboard-foreground))] p-2">{row.week_start_date || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };
  
  const renderDataTable = () => {
    const data = storeData.data;
    const columns = Object.keys(data[0] || {});
    
    return (
      <div className="p-6">
        <div className="bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] rounded-lg">
          <div className="p-4 border-b border-[hsl(var(--dashboard-card-border))]">
            <h3 className="text-[hsl(var(--dashboard-foreground))] font-medium">Complete Data Table</h3>
            <p className="text-[hsl(var(--dashboard-muted-foreground))] text-sm mt-1">
              Showing {data.length} records
            </p>
          </div>
          
          <div className="overflow-auto max-h-96">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-[hsl(var(--dashboard-accent-background))]">
                <tr>
                  {columns.map((column) => (
                    <th key={column} className="text-left text-[hsl(var(--dashboard-foreground))] p-2 font-medium">
                      {column.replace(/_/g, ' ').toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row: any, index: number) => (
                  <tr key={index} className="border-b border-[hsl(var(--dashboard-card-border))]/50 hover:bg-[hsl(var(--dashboard-card-hover))] transition-colors">
                    {columns.map((column) => (
                      <td key={column} className="text-[hsl(var(--dashboard-foreground))] p-2">
                        {row[column] !== null && row[column] !== undefined ? String(row[column]) : 'N/A'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };
  
  const renderAnalytics = () => {
    // Get store info to determine the level and create appropriate parameter
    const storeInfo = parseStoreId(storeId);
    if (!storeInfo) {
      return (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <AlertCircle size={48} className="mx-auto mb-4 text-[hsl(var(--panel-error))]" />
            <h2 className="text-xl font-semibold text-[hsl(var(--panel-foreground))] mb-2">Invalid store ID</h2>
            <p className="text-[hsl(var(--panel-error))] mb-4">Could not parse store information</p>
          </div>
        </div>
      );
    }
    
    // Create page name with the appropriate parameter based on store level
    const pageName = `$${storeInfo.level}`;
    
    return (
      <div className="h-full">
        <AnalyticsContent 
          analyticsType={pageName} 
          embedded={true} 
          embeddedStoreValue={storeInfo.name}
        />
      </div>
    );
  };
  
  const renderDetails = () => {
    const data = storeData.data;
    const sampleRecord = data[0] || {};
    
    // Get store attributes from the sample record dynamically
    const storeLocationFields = hierarchy.filter(field => sampleRecord.hasOwnProperty(field));
    const otherStoreFields = ['store_type', 'format', 'p1_dc'].filter(field => sampleRecord.hasOwnProperty(field));
    
    return (
      <div className="p-6">
        <div className="bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] rounded-lg p-4">
          <h3 className="text-[hsl(var(--dashboard-foreground))] font-medium mb-4">Store Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-[hsl(var(--dashboard-foreground))] font-medium mb-2">Location Details</h4>
              <div className="space-y-2">
                {storeLocationFields.map(field => (
                  <div key={field} className="flex justify-between">
                    <span className="text-[hsl(var(--dashboard-muted-foreground))]">
                      {field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')}:
                    </span>
                    <span className="text-[hsl(var(--dashboard-foreground))]">{sampleRecord[field] || 'N/A'}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-[hsl(var(--dashboard-foreground))] font-medium mb-2">Store Details</h4>
              <div className="space-y-2">
                {otherStoreFields.map(field => (
                  <div key={field} className="flex justify-between">
                    <span className="text-[hsl(var(--dashboard-muted-foreground))]">
                      {field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')}:
                    </span>
                    <span className="text-[hsl(var(--dashboard-foreground))]">{sampleRecord[field] || 'N/A'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex-1 flex flex-col h-full bg-[hsl(var(--panel-background))]">
      {/* Tabs */}
      <div className="border-b border-[hsl(var(--panel-border))] bg-[hsl(var(--dashboard-accent-background))] flex-shrink-0">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[hsl(var(--primary))] text-[hsl(var(--primary))]'
                    : 'border-transparent text-[hsl(var(--panel-muted-foreground))] hover:text-[hsl(var(--panel-foreground))] hover:border-[hsl(var(--panel-border))]'
                }`}
              >
                <Icon size={16} className="mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default StoreTab; 