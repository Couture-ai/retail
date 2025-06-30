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

interface StoreContentProps {
  selectedStoreId: string | null;
  storeData: any;
  loading: boolean;
  error: string | null;
  hierarchy?: string[];
}

type TabType = 'overview' | 'data' | 'analytics' | 'details';

const StoreContent = ({ selectedStoreId, storeData, loading, error }: StoreContentProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'data', label: 'Data', icon: Database },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'details', label: 'Details', icon: FileText }
  ];
  
  const renderTabContent = () => {
    if (!selectedStoreId) {
      return (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <Database size={48} className="mx-auto mb-4 text-[hsl(var(--dark-4))]" />
            <h2 className="text-xl font-semibold text-white mb-2">No store selected</h2>
            <p className="text-[hsl(var(--dark-3))] mb-4">
              Select a store from the tree to view its information
            </p>
          </div>
        </div>
      );
    }
    
    if (loading) {
      return (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="flex items-center">
            <Loader2 className="animate-spin text-[hsl(var(--primary))] mr-3" size={24} />
            <span className="text-white">Loading store data...</span>
          </div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
            <h2 className="text-xl font-semibold text-white mb-2">Error loading data</h2>
            <p className="text-red-400 mb-4">{error}</p>
          </div>
        </div>
      );
    }
    
    if (!storeData || !storeData.data || storeData.data.length === 0) {
      return (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <Database size={48} className="mx-auto mb-4 text-[hsl(var(--dark-4))]" />
            <h2 className="text-xl font-semibold text-white mb-2">No data available</h2>
            <p className="text-[hsl(var(--dark-3))] mb-4">
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
    const totalRecords = data.length;
    const totalForecastQty = data.reduce((sum: number, row: any) => sum + (row.forecast_qty || 0), 0);
    const totalSoldQty = data.reduce((sum: number, row: any) => sum + (row.sold_qty || 0), 0);
    const uniqueArticles = new Set(data.map((row: any) => row.article_id)).size;
    
    return (
      <div className="p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[hsl(var(--dark-7))] p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[hsl(var(--dark-3))] text-sm">Total Records</p>
                <p className="text-white text-2xl font-semibold">{totalRecords.toLocaleString()}</p>
              </div>
              <FileText className="text-blue-400" size={24} />
            </div>
          </div>
          
          <div className="bg-[hsl(var(--dark-7))] p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[hsl(var(--dark-3))] text-sm">Forecast Qty</p>
                <p className="text-white text-2xl font-semibold">{totalForecastQty.toLocaleString()}</p>
              </div>
              <TrendingUp className="text-green-400" size={24} />
            </div>
          </div>
          
          <div className="bg-[hsl(var(--dark-7))] p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[hsl(var(--dark-3))] text-sm">Sold Qty</p>
                <p className="text-white text-2xl font-semibold">{totalSoldQty.toLocaleString()}</p>
              </div>
              <BarChart3 className="text-purple-400" size={24} />
            </div>
          </div>
          
          <div className="bg-[hsl(var(--dark-7))] p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[hsl(var(--dark-3))] text-sm">Unique Articles</p>
                <p className="text-white text-2xl font-semibold">{uniqueArticles.toLocaleString()}</p>
              </div>
              <Database className="text-orange-400" size={24} />
            </div>
          </div>
        </div>
        
        {/* Sample Data Preview */}
        <div className="bg-[hsl(var(--dark-7))] rounded-lg p-4">
          <h3 className="text-white font-medium mb-3">Recent Records Preview</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left text-[hsl(var(--dark-3))] p-2">Article ID</th>
                  <th className="text-left text-[hsl(var(--dark-3))] p-2">Brand</th>
                  <th className="text-left text-[hsl(var(--dark-3))] p-2">Forecast Qty</th>
                  <th className="text-left text-[hsl(var(--dark-3))] p-2">Sold Qty</th>
                  <th className="text-left text-[hsl(var(--dark-3))] p-2">Week</th>
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 5).map((row: any, index: number) => (
                  <tr key={index} className="border-b border-gray-700/50">
                    <td className="text-white p-2">{row.article_id || 'N/A'}</td>
                    <td className="text-white p-2">{row.brand || 'N/A'}</td>
                    <td className="text-white p-2">{row.forecast_qty || 0}</td>
                    <td className="text-white p-2">{row.sold_qty || 0}</td>
                    <td className="text-white p-2">{row.week_start_date || 'N/A'}</td>
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
        <div className="bg-[hsl(var(--dark-7))] rounded-lg">
          <div className="p-4 border-b border-gray-600">
            <h3 className="text-white font-medium">Complete Data Table</h3>
            <p className="text-[hsl(var(--dark-3))] text-sm mt-1">
              Showing {data.length} records
            </p>
          </div>
          
          <div className="overflow-auto max-h-96">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-[hsl(var(--dark-6))]">
                <tr>
                  {columns.map((column) => (
                    <th key={column} className="text-left text-[hsl(var(--dark-2))] p-2 font-medium">
                      {column.replace(/_/g, ' ').toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row: any, index: number) => (
                  <tr key={index} className="border-b border-gray-700/50 hover:bg-[hsl(var(--dark-8))]">
                    {columns.map((column) => (
                      <td key={column} className="text-white p-2">
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
    const data = storeData.data;
    
    // Calculate some basic analytics
    const brandAnalytics = data.reduce((acc: any, row: any) => {
      const brand = row.brand || 'Unknown';
      if (!acc[brand]) {
        acc[brand] = { count: 0, forecastQty: 0, soldQty: 0 };
      }
      acc[brand].count++;
      acc[brand].forecastQty += row.forecast_qty || 0;
      acc[brand].soldQty += row.sold_qty || 0;
      return acc;
    }, {});
    
    const topBrands = Object.entries(brandAnalytics)
      .sort(([,a]: any, [,b]: any) => b.soldQty - a.soldQty)
      .slice(0, 10);
    
    return (
      <div className="p-6 space-y-6">
        <div className="bg-[hsl(var(--dark-7))] rounded-lg p-4">
          <h3 className="text-white font-medium mb-4">Top Brands by Sales</h3>
          <div className="space-y-3">
            {topBrands.map(([brand, stats]: any, index) => (
              <div key={brand} className="flex items-center justify-between p-3 bg-[hsl(var(--dark-8))] rounded">
                <div className="flex items-center">
                  <span className="text-[hsl(var(--primary))] font-medium mr-3">#{index + 1}</span>
                  <span className="text-white">{brand}</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">{stats.soldQty.toLocaleString()}</div>
                  <div className="text-[hsl(var(--dark-3))] text-sm">{stats.count} items</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  const renderDetails = () => {
    const data = storeData.data;
    const sampleRecord = data[0] || {};
    
    // Define potential location hierarchy fields (in order of hierarchy)
    const potentialLocationFields = ['region', 'state', 'city', 'pin_code', 'store_no'];
    const potentialStoreFields = ['store_type', 'format', 'p1_dc'];
    
    // Filter to only show fields that exist in the data
    const locationFields = potentialLocationFields.filter(field => sampleRecord.hasOwnProperty(field));
    const storeFields = potentialStoreFields.filter(field => sampleRecord.hasOwnProperty(field));
    
    return (
      <div className="p-6">
        <div className="bg-[hsl(var(--dark-7))] rounded-lg p-4">
          <h3 className="text-white font-medium mb-4">Store Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-[hsl(var(--dark-2))] font-medium mb-2">Location Details</h4>
              <div className="space-y-2">
                {locationFields.map(field => (
                  <div key={field} className="flex justify-between">
                    <span className="text-[hsl(var(--dark-3))]">
                      {field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')}:
                    </span>
                    <span className="text-white">{sampleRecord[field] || 'N/A'}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-[hsl(var(--dark-2))] font-medium mb-2">Store Details</h4>
              <div className="space-y-2">
                {storeFields.map(field => (
                  <div key={field} className="flex justify-between">
                    <span className="text-[hsl(var(--dark-3))]">
                      {field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')}:
                    </span>
                    <span className="text-white">{sampleRecord[field] || 'N/A'}</span>
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
    <div className="flex-1 flex flex-col">
      {/* Tabs */}
      <div className="border-b border-gray-700/50 bg-[hsl(var(--dark-8))]">
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
                    : 'border-transparent text-[hsl(var(--dark-3))] hover:text-white hover:border-gray-600'
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

export default StoreContent; 