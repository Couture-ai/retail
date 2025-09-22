import React, { useState, useEffect } from 'react';
import { ShoppingBag, BarChart3, TrendingUp, DollarSign, Loader2, AlertCircle, Package, Info, Database, FileText, Calendar, MapPin, Tag } from 'lucide-react';
import { ForecastRepository } from "@/repository/forecast_repository";
import AnalyticsContent from '../analytics/AnalyticsContent';
import { useProject } from '@/context/ProjectProvider';

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
  const {forecastRepository: forecastRepo} = useProject();

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

      // Get comprehensive stats
      const statsQuery = `
        SELECT 
          COUNT(*) as record_count,
          SUM(forecast_qty) as total_forecasted,
          SUM(sold_qty) as total_sold,
          AVG(forecast_qty) as avg_forecast,
          COUNT(DISTINCT store_no) as unique_stores,
          COUNT(DISTINCT week_start_date) as week_count,
          CASE 
            WHEN SUM(forecast_qty) > 0 THEN 
              (1 - ABS(SUM(sold_qty) - SUM(forecast_qty)) / SUM(forecast_qty)) * 100
            ELSE 0 
          END as accuracy_percentage
        FROM forecast 
        WHERE ${whereConditions}
      `;

      // Get recent data for activity table
      const recentDataQuery = `
        SELECT 
          store_no,
          week_start_date,
          forecast_qty,
          sold_qty,
          city
        FROM forecast 
        WHERE ${whereConditions}
        ORDER BY week_start_date DESC
        LIMIT 20
      `;

      // Execute all queries
      let details: any = null;
      let stats: any = null;
      let recentData: any[] = [];

      const detailsStateSetters = {
        setLoading: () => {},
        setError: (err: string | null) => setError(err),
        setData: (data: any) => {
          if (data && data.data && data.data.length > 0) {
            details = data.data[0];
          }
        }
      };

      const statsStateSetters = {
        setLoading: () => {},
        setError: (err: string | null) => setError(err),
        setData: (data: any) => {
          if (data && data.data && data.data.length > 0) {
            stats = data.data[0];
          }
        }
      };

      const recentDataStateSetters = {
        setLoading: () => {},
        setError: (err: string | null) => setError(err),
        setData: (data: any) => {
          if (data && data.data) {
            recentData = data.data;
          }
        }
      };

      await Promise.all([
        forecastRepo.executeSqlQuery({ sql_query: detailsQuery }, detailsStateSetters),
        forecastRepo.executeSqlQuery({ sql_query: statsQuery }, statsStateSetters),
        forecastRepo.executeSqlQuery({ sql_query: recentDataQuery }, recentDataStateSetters)
      ]);

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
          <div className="bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] rounded-lg p-4 hover:bg-[hsl(var(--dashboard-card-hover))] transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">Total Forecasted</p>
                <p className="text-[hsl(var(--dashboard-foreground))] text-xl font-semibold">
                  {formatNumber(articleInfo.stats.totalForecasted)}
                </p>
              </div>
              <TrendingUp className="text-[hsl(var(--dashboard-primary-blue))]" size={20} />
            </div>
          </div>

          {/* Total Sold */}
          <div className="bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] rounded-lg p-4 hover:bg-[hsl(var(--dashboard-card-hover))] transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">Total Sold</p>
                <p className="text-[hsl(var(--dashboard-foreground))] text-xl font-semibold">
                  {formatNumber(articleInfo.stats.totalSold)}
                </p>
              </div>
              <DollarSign className="text-[hsl(var(--dashboard-success))]" size={20} />
            </div>
          </div>

          {/* Forecast Accuracy */}
          <div className="bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] rounded-lg p-4 hover:bg-[hsl(var(--dashboard-card-hover))] transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">Accuracy</p>
                <p className="text-[hsl(var(--dashboard-foreground))] text-xl font-semibold">
                  {articleInfo.stats.accuracy.toFixed(1)}%
                </p>
              </div>
              <BarChart3 className={`${
                articleInfo.stats.accuracy >= 80 ? 'text-[hsl(var(--dashboard-success))]' :
                articleInfo.stats.accuracy >= 60 ? 'text-[hsl(var(--dashboard-warning))]' : 'text-[hsl(var(--dashboard-error))]'
              }`} size={20} />
            </div>
          </div>

          {/* Unique Stores */}
          <div className="bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] rounded-lg p-4 hover:bg-[hsl(var(--dashboard-card-hover))] transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">Stores</p>
                <p className="text-[hsl(var(--dashboard-foreground))] text-xl font-semibold">
                  {formatNumber(articleInfo.stats.uniqueStores)}
                </p>
              </div>
              <MapPin className="text-[hsl(var(--dashboard-primary-purple))]" size={20} />
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] rounded-lg p-6 hover:bg-[hsl(var(--dashboard-card-hover))] transition-colors">
          <h3 className="text-[hsl(var(--dashboard-foreground))] font-semibold mb-4">Performance Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[hsl(var(--dashboard-primary-blue))] mb-1">
                {formatNumber(articleInfo.stats.avgForecast)}
              </div>
              <div className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">Avg Forecast</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[hsl(var(--dashboard-primary-orange))] mb-1">
                {articleInfo.stats.weekCount}
              </div>
              <div className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">Weeks Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[hsl(var(--dashboard-primary-green))] mb-1">
                {articleInfo.stats.recordCount.toLocaleString()}
              </div>
              <div className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">Total Records</div>
            </div>
          </div>
        </div>

        {articleInfo.recentData && articleInfo.recentData.length > 0 && (
          <div className="bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] rounded-lg p-4 hover:bg-[hsl(var(--dashboard-card-hover))] transition-colors">
            <h3 className="text-[hsl(var(--dashboard-foreground))] font-semibold mb-4">Recent Activity</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[hsl(var(--dashboard-card-border))]">
                    <th className="text-left text-[hsl(var(--dashboard-muted-foreground))] p-2">Store</th>
                    <th className="text-left text-[hsl(var(--dashboard-muted-foreground))] p-2">Week</th>
                    <th className="text-left text-[hsl(var(--dashboard-muted-foreground))] p-2">Forecast</th>
                    <th className="text-left text-[hsl(var(--dashboard-muted-foreground))] p-2">Sold</th>
                    <th className="text-left text-[hsl(var(--dashboard-muted-foreground))] p-2">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {articleInfo.recentData.slice(0, 5).map((row: any, index: number) => (
                    <tr key={index} className="border-b border-[hsl(var(--dashboard-card-border))]">
                      <td className="text-[hsl(var(--dashboard-foreground))] p-2">{row.store_no || 'N/A'}</td>
                      <td className="text-[hsl(var(--dashboard-foreground))] p-2">{formatDate(row.week_start_date)}</td>
                      <td className="text-[hsl(var(--dashboard-foreground))] p-2">{row.forecast_qty || 0}</td>
                      <td className="text-[hsl(var(--dashboard-foreground))] p-2">{row.sold_qty || 0}</td>
                      <td className="text-[hsl(var(--dashboard-foreground))] p-2">{row.city || 'N/A'}</td>
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
        <div className="bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] rounded-lg p-6 hover:bg-[hsl(var(--dashboard-card-hover))] transition-colors">
          <h3 className="text-[hsl(var(--dashboard-foreground))] font-semibold mb-6">Article Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-[hsl(var(--dashboard-muted-foreground))] text-sm mb-1">Article ID</p>
                <p className="text-[hsl(var(--dashboard-foreground))] font-mono text-sm bg-[hsl(var(--panel-background))] px-3 py-2 rounded border border-[hsl(var(--panel-border))]">
                  {articleInfo.name}
                </p>
              </div>
              <div>
                <p className="text-[hsl(var(--dashboard-muted-foreground))] text-sm mb-1">Description</p>
                <p className="text-[hsl(var(--dashboard-foreground))] bg-[hsl(var(--panel-background))] px-3 py-2 rounded border border-[hsl(var(--panel-border))]">
                  {articleInfo.details.article_description}
                </p>
              </div>
              <div>
                <p className="text-[hsl(var(--dashboard-muted-foreground))] text-sm mb-1">Brand</p>
                <p className="text-[hsl(var(--dashboard-foreground))] bg-[hsl(var(--panel-background))] px-3 py-2 rounded border border-[hsl(var(--panel-border))]">
                  {articleInfo.details.brand}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[hsl(var(--dashboard-muted-foreground))] text-sm mb-1">Vertical</p>
                <p className="text-[hsl(var(--dashboard-foreground))] bg-[hsl(var(--panel-background))] px-3 py-2 rounded border border-[hsl(var(--panel-border))]">
                  {articleInfo.details.vertical}
                </p>
              </div>
              <div>
                <p className="text-[hsl(var(--dashboard-muted-foreground))] text-sm mb-1">Super Category</p>
                <p className="text-[hsl(var(--dashboard-foreground))] bg-[hsl(var(--panel-background))] px-3 py-2 rounded border border-[hsl(var(--panel-border))]">
                  {articleInfo.details.super_category}
                </p>
              </div>
              <div>
                <p className="text-[hsl(var(--dashboard-muted-foreground))] text-sm mb-1">Segment</p>
                <p className="text-[hsl(var(--dashboard-foreground))] bg-[hsl(var(--panel-background))] px-3 py-2 rounded border border-[hsl(var(--panel-border))]">
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
    // Create a page name that includes the article_id as a parameter
    const pageName = `$article_id`;
    
    return (
      <div className="h-full">
        <AnalyticsContent 
          analyticsType={pageName} 
          embedded={true} 
          embeddedArticleId={articleInfo?.name}
        />
      </div>
    );
  };

  const renderData = () => {
    if (!articleInfo?.recentData) return null;

    return (
      <div className="p-6">
        <div className="bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] rounded-lg overflow-hidden">
          <div className="p-4 border-b border-[hsl(var(--dashboard-card-border))]">
            <h3 className="text-[hsl(var(--dashboard-foreground))] font-semibold">Recent Data</h3>
            <p className="text-[hsl(var(--dashboard-muted-foreground))] text-sm mt-1">
              Latest {articleInfo.recentData.length} records for this article
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[hsl(var(--panel-background))] border-b border-[hsl(var(--panel-border))]">
                  <th className="px-4 py-3 text-left text-xs font-medium text-[hsl(var(--panel-muted-foreground))] uppercase tracking-wider">Store</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[hsl(var(--panel-muted-foreground))] uppercase tracking-wider">Week</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-[hsl(var(--panel-muted-foreground))] uppercase tracking-wider">Forecast</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-[hsl(var(--panel-muted-foreground))] uppercase tracking-wider">Sold</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[hsl(var(--panel-muted-foreground))] uppercase tracking-wider">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[hsl(var(--dashboard-card-border))]">
                {articleInfo.recentData.map((row: any, index: number) => (
                  <tr key={index} className="hover:bg-[hsl(var(--dashboard-card-hover))] transition-colors">
                    <td className="px-4 py-3 text-sm text-[hsl(var(--dashboard-foreground))] font-mono">{row.store_no || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-[hsl(var(--dashboard-foreground))]">{formatDate(row.week_start_date)}</td>
                    <td className="px-4 py-3 text-sm text-[hsl(var(--dashboard-foreground))] text-right font-mono">{row.forecast_qty || 0}</td>
                    <td className="px-4 py-3 text-sm text-[hsl(var(--dashboard-foreground))] text-right font-mono">{row.sold_qty || 0}</td>
                    <td className="px-4 py-3 text-sm text-[hsl(var(--dashboard-muted-foreground))]">{row.city || 'N/A'}</td>
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
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 size={32} className="animate-spin text-[hsl(var(--panel-muted-foreground))] mx-auto mb-4" />
            <p className="text-[hsl(var(--panel-muted-foreground))]">Loading article information...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle size={32} className="text-[hsl(var(--panel-error))] mx-auto mb-4" />
            <p className="text-[hsl(var(--panel-error))] mb-2">Error loading article information</p>
            <p className="text-[hsl(var(--panel-muted-foreground))] text-sm">{error}</p>
          </div>
        </div>
      );
    }

    if (!articleInfo) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Package size={32} className="text-[hsl(var(--panel-muted-foreground))] mx-auto mb-4" />
            <p className="text-[hsl(var(--panel-muted-foreground))]">No article information available</p>
          </div>
        </div>
      );
    }

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

  if (!articleInfo && loading) {
    return (
      <div className="h-full bg-[hsl(var(--panel-background))] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-[hsl(var(--panel-muted-foreground))] mx-auto mb-4" />
          <p className="text-[hsl(var(--panel-muted-foreground))]">Loading article information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-[hsl(var(--panel-background))] flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-[hsl(var(--panel-border))] flex-shrink-0">
        <div className="flex items-center">
          <ShoppingBag className="text-[hsl(var(--dashboard-primary-orange))]" size={24} />
          <div className="ml-4">
            <h1 className="text-[hsl(var(--panel-foreground))] text-xl font-semibold">
              Article {articleInfo?.name}
            </h1>
            <p className="text-[hsl(var(--panel-muted-foreground))] text-sm mt-1">
              {articleInfo?.details?.article_description || 'Product Article'} • {articleInfo?.stats?.recordCount || 0} records
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[hsl(var(--panel-border))] bg-[hsl(var(--sidepanel-background))] flex-shrink-0">
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

export default ArticleTab; 