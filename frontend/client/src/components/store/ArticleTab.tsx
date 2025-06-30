import React, { useState, useEffect } from 'react';
import { ShoppingBag, BarChart3, TrendingUp, DollarSign, Loader2, AlertCircle, Package, Info, Database, FileText, Calendar, MapPin, Tag } from 'lucide-react';
import { ForecastRepository } from "@/repository/forecast_repository";

interface ArticleTabProps {
  articleId: string;
  panelId: string;
}

interface ArticleInfo {
  id: string;
  name: string;
  level: string;
  context: Record<string, string>;
  details?: {
    article_description: string;
    brand: string;
    segment: string;
    super_category: string;
    vertical: string;
    division: string;
  };
  stats?: {
    totalForecasted: number;
    totalSold: number;
    accuracy: number;
    avgForecast: number;
    recordCount: number;
    uniqueStores: number;
    weekCount: number;
  };
  recentData?: any[];
}

type TabType = 'overview' | 'details' | 'analytics' | 'data';

const ArticleTab: React.FC<ArticleTabProps> = ({ articleId, panelId }) => {
  const [articleInfo, setArticleInfo] = useState<ArticleInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Initialize forecast repository
  const forecastRepo = new ForecastRepository(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000');

  useEffect(() => {
    loadArticleInfo();
  }, [articleId]);

  const loadArticleInfo = async () => {
    try {
      setLoading(true);
      setError(null);

      // Parse article ID to extract context
      const parts = articleId.split('-');
      const level = parts[0];
      const name = parts[parts.length - 1];
      
      // Build context for article_id level
      const context: Record<string, string> = {
        [level]: name
      };

      // Load comprehensive article information
      const whereConditions = Object.entries(context)
        .map(([key, value]) => `${key} = '${value}'`)
        .join(' AND ');

      // Get detailed article information with all relevant fields
      const detailsQuery = `
        SELECT DISTINCT
          article_id,
          article_description,
          brand,
          segment,
          super_category,
          vertical,
          division
        FROM forecast 
        WHERE ${whereConditions}
        LIMIT 1
      `;

      // Get comprehensive statistics
      const statsQuery = `
        SELECT 
          COUNT(*) as record_count,
          COUNT(DISTINCT store_no) as unique_stores,
          COUNT(DISTINCT week_start_date) as week_count,
          COALESCE(SUM(forecast_qty), 0) as total_forecasted,
          COALESCE(SUM(sold_qty), 0) as total_sold,
          COALESCE(AVG(forecast_qty), 0) as avg_forecast,
          CASE 
            WHEN SUM(sold_qty) > 0 THEN 
              100 - (ABS(SUM(forecast_qty) - SUM(sold_qty)) * 100.0 / SUM(sold_qty))
            ELSE 0 
          END as accuracy_percentage
        FROM forecast 
        WHERE ${whereConditions}
      `;

      // Get recent data for preview
      const recentDataQuery = `
        SELECT 
          store_no,
          week_start_date,
          forecast_qty,
          sold_qty,
          region,
          city,
          store_type
        FROM forecast 
        WHERE ${whereConditions}
        ORDER BY week_start_date DESC
        LIMIT 10
      `;

      // Execute all queries
      const [detailsResult, statsResult, recentDataResult] = await Promise.all([
        forecastRepo.executeSqlQuery({ sql_query: detailsQuery }, { setLoading: () => {}, setError: () => {}, setData: () => {} }),
        forecastRepo.executeSqlQuery({ sql_query: statsQuery }, { setLoading: () => {}, setError: () => {}, setData: () => {} }),
        forecastRepo.executeSqlQuery({ sql_query: recentDataQuery }, { setLoading: () => {}, setError: () => {}, setData: () => {} })
      ]);

      // Process results
      const details = detailsResult?.data?.[0];
      const stats = statsResult?.data?.[0];
      const recentData = recentDataResult?.data || [];

      setArticleInfo({
        id: articleId,
        name: name,
        level: level,
        context: context,
        details: details ? {
          article_description: details.article_description || 'N/A',
          brand: details.brand || 'N/A',
          segment: details.segment || 'N/A',
          super_category: details.super_category || 'N/A',
          vertical: details.vertical || 'N/A',
          division: details.division || 'N/A'
        } : undefined,
        stats: stats ? {
          totalForecasted: parseFloat(stats.total_forecasted) || 0,
          totalSold: parseFloat(stats.total_sold) || 0,
          accuracy: parseFloat(stats.accuracy_percentage) || 0,
          avgForecast: parseFloat(stats.avg_forecast) || 0,
          recordCount: parseInt(stats.record_count) || 0,
          uniqueStores: parseInt(stats.unique_stores) || 0,
          weekCount: parseInt(stats.week_count) || 0
        } : undefined,
        recentData: recentData
      });

    } catch (err) {
      console.error('Error loading article info:', err);
      setError('Failed to load article information');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toFixed(0);
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'details', label: 'Details', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'data', label: 'Data', icon: Database }
  ];

  const renderOverview = () => {
    if (!articleInfo?.stats) return null;

    return (
      <div className="p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Forecasted */}
          <div className="bg-[hsl(var(--dark-8))] border border-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[hsl(var(--dark-3))] text-sm">Total Forecasted</p>
                <p className="text-white text-xl font-semibold">
                  {formatNumber(articleInfo.stats.totalForecasted)}
                </p>
              </div>
              <TrendingUp className="text-blue-400" size={20} />
            </div>
          </div>

          {/* Total Sold */}
          <div className="bg-[hsl(var(--dark-8))] border border-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[hsl(var(--dark-3))] text-sm">Total Sold</p>
                <p className="text-white text-xl font-semibold">
                  {formatNumber(articleInfo.stats.totalSold)}
                </p>
              </div>
              <DollarSign className="text-green-400" size={20} />
            </div>
          </div>

          {/* Forecast Accuracy */}
          <div className="bg-[hsl(var(--dark-8))] border border-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[hsl(var(--dark-3))] text-sm">Accuracy</p>
                <p className="text-white text-xl font-semibold">
                  {articleInfo.stats.accuracy.toFixed(1)}%
                </p>
              </div>
              <BarChart3 className={`${
                articleInfo.stats.accuracy >= 80 ? 'text-green-400' :
                articleInfo.stats.accuracy >= 60 ? 'text-yellow-400' : 'text-red-400'
              }`} size={20} />
            </div>
          </div>

          {/* Unique Stores */}
          <div className="bg-[hsl(var(--dark-8))] border border-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[hsl(var(--dark-3))] text-sm">Stores</p>
                <p className="text-white text-xl font-semibold">
                  {formatNumber(articleInfo.stats.uniqueStores)}
                </p>
              </div>
              <MapPin className="text-purple-400" size={20} />
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-[hsl(var(--dark-8))] border border-gray-700/50 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-4">Performance Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-[hsl(var(--dark-3))] text-sm">Total Records</p>
              <p className="text-white text-lg">{articleInfo.stats.recordCount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[hsl(var(--dark-3))] text-sm">Weeks Tracked</p>
              <p className="text-white text-lg">{articleInfo.stats.weekCount}</p>
            </div>
            <div>
              <p className="text-[hsl(var(--dark-3))] text-sm">Avg Forecast</p>
              <p className="text-white text-lg">{formatNumber(articleInfo.stats.avgForecast)}</p>
            </div>
          </div>
        </div>

        {/* Recent Activity Preview */}
        {articleInfo.recentData && articleInfo.recentData.length > 0 && (
          <div className="bg-[hsl(var(--dark-8))] border border-gray-700/50 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left text-[hsl(var(--dark-3))] p-2">Store</th>
                    <th className="text-left text-[hsl(var(--dark-3))] p-2">Week</th>
                    <th className="text-left text-[hsl(var(--dark-3))] p-2">Forecast</th>
                    <th className="text-left text-[hsl(var(--dark-3))] p-2">Sold</th>
                    <th className="text-left text-[hsl(var(--dark-3))] p-2">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {articleInfo.recentData.slice(0, 5).map((row: any, index: number) => (
                    <tr key={index} className="border-b border-gray-700/50">
                      <td className="text-white p-2">{row.store_no || 'N/A'}</td>
                      <td className="text-white p-2">{formatDate(row.week_start_date)}</td>
                      <td className="text-white p-2">{row.forecast_qty || 0}</td>
                      <td className="text-white p-2">{row.sold_qty || 0}</td>
                      <td className="text-white p-2">{row.city || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderDetails = () => {
    if (!articleInfo?.details) return null;

    return (
      <div className="p-6 space-y-6">
        <div className="bg-[hsl(var(--dark-8))] border border-gray-700/50 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-6">Article Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-[hsl(var(--dark-3))] text-sm mb-1">Article ID</p>
                <p className="text-white font-mono text-sm bg-[hsl(var(--dark-7))] px-3 py-2 rounded">
                  {articleInfo.name}
                </p>
              </div>
              <div>
                <p className="text-[hsl(var(--dark-3))] text-sm mb-1">Description</p>
                <p className="text-white bg-[hsl(var(--dark-7))] px-3 py-2 rounded">
                  {articleInfo.details.article_description}
                </p>
              </div>
              <div>
                <p className="text-[hsl(var(--dark-3))] text-sm mb-1">Brand</p>
                <p className="text-white bg-[hsl(var(--dark-7))] px-3 py-2 rounded">
                  {articleInfo.details.brand}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[hsl(var(--dark-3))] text-sm mb-1">Vertical</p>
                <p className="text-white bg-[hsl(var(--dark-7))] px-3 py-2 rounded">
                  {articleInfo.details.vertical}
                </p>
              </div>
              <div>
                <p className="text-[hsl(var(--dark-3))] text-sm mb-1">Super Category</p>
                <p className="text-white bg-[hsl(var(--dark-7))] px-3 py-2 rounded">
                  {articleInfo.details.super_category}
                </p>
              </div>
              <div>
                <p className="text-[hsl(var(--dark-3))] text-sm mb-1">Segment</p>
                <p className="text-white bg-[hsl(var(--dark-7))] px-3 py-2 rounded">
                  {articleInfo.details.segment}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAnalytics = () => {
    if (!articleInfo?.recentData) return null;

    // Calculate analytics from recent data
    const storeAnalytics = articleInfo.recentData.reduce((acc: any, row: any) => {
      const store = row.store_no || 'Unknown';
      if (!acc[store]) {
        acc[store] = { count: 0, forecastQty: 0, soldQty: 0, city: row.city || 'N/A' };
      }
      acc[store].count++;
      acc[store].forecastQty += row.forecast_qty || 0;
      acc[store].soldQty += row.sold_qty || 0;
      return acc;
    }, {});

    const topStores = Object.entries(storeAnalytics)
      .sort(([,a]: any, [,b]: any) => b.soldQty - a.soldQty)
      .slice(0, 10);

    return (
      <div className="p-6 space-y-6">
        <div className="bg-[hsl(var(--dark-8))] border border-gray-700/50 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-4">Top Performing Stores</h3>
          <div className="space-y-3">
            {topStores.map(([store, stats]: any, index) => (
              <div key={store} className="flex items-center justify-between p-3 bg-[hsl(var(--dark-7))] rounded">
                <div className="flex items-center">
                  <span className="text-[hsl(var(--primary))] font-medium mr-3">#{index + 1}</span>
                  <div>
                    <span className="text-white">{store}</span>
                    <p className="text-[hsl(var(--dark-3))] text-sm">{stats.city}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">{stats.soldQty.toLocaleString()}</div>
                  <div className="text-[hsl(var(--dark-3))] text-sm">{stats.count} records</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderData = () => {
    if (!articleInfo?.recentData) return null;

    return (
      <div className="p-6">
        <div className="bg-[hsl(var(--dark-8))] border border-gray-700/50 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-4">Recent Data Records</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left text-[hsl(var(--dark-3))] p-2">Store</th>
                  <th className="text-left text-[hsl(var(--dark-3))] p-2">Week</th>
                  <th className="text-left text-[hsl(var(--dark-3))] p-2">Forecast</th>
                  <th className="text-left text-[hsl(var(--dark-3))] p-2">Sold</th>
                  <th className="text-left text-[hsl(var(--dark-3))] p-2">Region</th>
                  <th className="text-left text-[hsl(var(--dark-3))] p-2">City</th>
                  <th className="text-left text-[hsl(var(--dark-3))] p-2">Store Type</th>
                </tr>
              </thead>
              <tbody>
                {articleInfo.recentData.map((row: any, index: number) => (
                  <tr key={index} className="border-b border-gray-700/50">
                    <td className="text-white p-2">{row.store_no || 'N/A'}</td>
                    <td className="text-white p-2">{formatDate(row.week_start_date)}</td>
                    <td className="text-white p-2">{row.forecast_qty || 0}</td>
                    <td className="text-white p-2">{row.sold_qty || 0}</td>
                    <td className="text-white p-2">{row.region || 'N/A'}</td>
                    <td className="text-white p-2">{row.city || 'N/A'}</td>
                    <td className="text-white p-2">{row.store_type || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'details':
        return renderDetails();
      case 'analytics':
        return renderAnalytics();
      case 'data':
        return renderData();
      default:
        return renderOverview();
    }
  };

  if (loading) {
    return (
      <div className="h-full bg-[hsl(var(--dark-9))] flex items-center justify-center">
        <div className="flex items-center">
          <Loader2 className="animate-spin text-[hsl(var(--dark-3))] mr-2" size={20} />
          <span className="text-[hsl(var(--dark-3))]">Loading article information...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full bg-[hsl(var(--dark-9))] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <AlertCircle className="text-red-400 mb-2" size={24} />
          <span className="text-red-400 text-sm text-center">{error}</span>
          <button 
            onClick={loadArticleInfo}
            className="mt-2 px-3 py-1 bg-[hsl(var(--primary))] text-white text-xs rounded hover:bg-[hsl(var(--primary))/90]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!articleInfo) {
    return (
      <div className="h-full bg-[hsl(var(--dark-9))] flex items-center justify-center">
        <span className="text-[hsl(var(--dark-3))]">Article not found</span>
      </div>
    );
  }

  return (
    <div className="h-full bg-[hsl(var(--dark-9))] flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700/50 flex-shrink-0">
        <div className="flex items-center">
          <ShoppingBag className="text-orange-400" size={24} />
          <div className="ml-4">
            <h1 className="text-white text-xl font-semibold">
              Article {articleInfo.name}
            </h1>
            <p className="text-[hsl(var(--dark-3))] text-sm mt-1">
              {articleInfo.details?.article_description || 'Product Article'} • {articleInfo.stats?.recordCount || 0} records
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700/50 bg-[hsl(var(--dark-8))] flex-shrink-0">
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

export default ArticleTab; 