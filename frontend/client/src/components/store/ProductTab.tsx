import React, { useState, useEffect } from 'react';
import { Package, Tag, Layers, Box, ShoppingBag, BarChart3, TrendingUp, DollarSign, Loader2, AlertCircle } from 'lucide-react';
import { ForecastRepository } from "@/repository/forecast_repository";
import { useProject } from '@/context/ProjectProvider';

interface ProductTabProps {
  productId: string;
  panelId: string;
}

interface ProductInfo {
  id: string;
  name: string;
  level: string;
  context: Record<string, string>;
  stats?: {
    totalForecasted: number;
    totalSold: number;
    accuracy: number;
    avgForecast: number;
    recordCount: number;
  };
}

const ProductTab: React.FC<ProductTabProps> = ({ productId, panelId }) => {
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize forecast repository
  const {forecastRepository: forecastRepo} = useProject();

  useEffect(() => {
    loadProductInfo();
  }, [productId]);

  const loadProductInfo = async () => {
    try {
      setLoading(true);
      setError(null);

      // Parse product ID to extract level and context
      const parts = productId.split('-');
      const level = parts[0];
      
      // For complex IDs, we need to reconstruct the context
      // This is a simplified version - in a real app, you'd want to store this info
      const name = parts[parts.length - 1];
      
      // Build a basic context - this would ideally come from the tree selection
      const context: Record<string, string> = {
        [level]: name
      };

      // Load product statistics
      const whereConditions = Object.entries(context)
        .map(([key, value]) => `${key} = '${value}'`)
        .join(' AND ');

      const statsQuery = `
        SELECT 
          COUNT(*) as record_count,
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

      const stateSetters = {
        setLoading: () => {},
        setError: (err: string | null) => setError(err),
        setData: (data: any) => {
          if (data && data.data && data.data.length > 0) {
            const stats = data.data[0];
            setProductInfo({
              id: productId,
              name: name,
              level: level,
              context: context,
              stats: {
                totalForecasted: parseFloat(stats.total_forecasted) || 0,
                totalSold: parseFloat(stats.total_sold) || 0,
                accuracy: parseFloat(stats.accuracy_percentage) || 0,
                avgForecast: parseFloat(stats.avg_forecast) || 0,
                recordCount: parseInt(stats.record_count) || 0
              }
            });
          }
        }
      };

      await forecastRepo.executeSqlQuery({ sql_query: statsQuery }, stateSetters);
    } catch (err) {
      console.error('Error loading product info:', err);
      setError('Failed to load product information');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (level: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'vertical': <Layers size={20} className="text-[hsl(var(--dashboard-primary-blue))]" />,
      'super_category': <Package size={20} className="text-[hsl(var(--dashboard-primary-green))]" />,
      'segment': <Tag size={20} className="text-[hsl(var(--dashboard-primary-orange))]" />,
      'article_id': <ShoppingBag size={20} className="text-[hsl(var(--dashboard-primary-purple))]" />
    };
    return iconMap[level] || <Box size={20} className="text-[hsl(var(--panel-muted-foreground))]" />;
  };

  const getLevelDisplayName = (level: string) => {
    const displayNames: Record<string, string> = {
      'vertical': 'Vertical',
      'super_category': 'Super Category',
      'segment': 'Segment',
      'article_id': 'Article'
    };
    return displayNames[level] || level.charAt(0).toUpperCase() + level.slice(1).replace('_', ' ');
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toFixed(0);
  };

  if (loading) {
    return (
      <div className="h-full bg-[hsl(var(--panel-background))] flex items-center justify-center">
        <div className="flex items-center">
          <Loader2 className="animate-spin text-[hsl(var(--panel-muted-foreground))] mr-2" size={20} />
          <span className="text-[hsl(var(--panel-muted-foreground))]">Loading product information...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full bg-[hsl(var(--panel-background))] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <AlertCircle className="text-[hsl(var(--panel-error))] mb-2" size={24} />
          <span className="text-[hsl(var(--panel-error))] text-sm text-center">{error}</span>
          <button 
            onClick={loadProductInfo}
            className="mt-2 px-3 py-1 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-xs rounded hover:bg-[hsl(var(--primary))]/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!productInfo) {
    return (
      <div className="h-full bg-[hsl(var(--panel-background))] flex items-center justify-center">
        <span className="text-[hsl(var(--panel-muted-foreground))]">Product not found</span>
      </div>
    );
  }

  return (
    <div className="h-full bg-[hsl(var(--panel-background))] overflow-auto">
      {/* Header */}
      <div className="p-6 border-b border-[hsl(var(--panel-border))]">
        <div className="flex items-center">
          {getIcon(productInfo.level)}
          <div className="ml-4">
            <h1 className="text-[hsl(var(--panel-foreground))] text-xl font-semibold">
              {productInfo.level === 'article_id' ? `Article ${productInfo.name}` : productInfo.name}
            </h1>
            <p className="text-[hsl(var(--panel-muted-foreground))] text-sm mt-1">
              {getLevelDisplayName(productInfo.level)} • {productInfo.stats?.recordCount || 0} records
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {productInfo.stats && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Forecasted */}
            <div className="bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] rounded-lg p-4 hover:bg-[hsl(var(--dashboard-card-hover))] transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">Total Forecasted</p>
                  <p className="text-[hsl(var(--dashboard-foreground))] text-xl font-semibold">
                    {formatNumber(productInfo.stats.totalForecasted)}
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
                    {formatNumber(productInfo.stats.totalSold)}
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
                    {productInfo.stats.accuracy.toFixed(1)}%
                  </p>
                </div>
                <BarChart3 className="text-[hsl(var(--dashboard-primary-purple))]" size={20} />
              </div>
            </div>

            {/* Average Forecast */}
            <div className="bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] rounded-lg p-4 hover:bg-[hsl(var(--dashboard-card-hover))] transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">Avg Forecast</p>
                  <p className="text-[hsl(var(--dashboard-foreground))] text-xl font-semibold">
                    {formatNumber(productInfo.stats.avgForecast)}
                  </p>
                </div>
                <Package className="text-[hsl(var(--dashboard-primary-orange))]" size={20} />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] rounded-lg p-4">
            <h3 className="text-[hsl(var(--dashboard-foreground))] font-semibold mb-4">Product Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">Level</p>
                <p className="text-[hsl(var(--dashboard-foreground))]">{getLevelDisplayName(productInfo.level)}</p>
              </div>
              <div>
                <p className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">Identifier</p>
                <p className="text-[hsl(var(--dashboard-foreground))] font-mono text-sm">{productInfo.name}</p>
              </div>
              <div>
                <p className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">Records</p>
                <p className="text-[hsl(var(--dashboard-foreground))]">{productInfo.stats.recordCount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">Performance</p>
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    productInfo.stats.accuracy >= 80 ? 'bg-[hsl(var(--dashboard-success))]' :
                    productInfo.stats.accuracy >= 60 ? 'bg-[hsl(var(--dashboard-warning))]' : 'bg-[hsl(var(--dashboard-error))]'
                  }`}></div>
                  <span className="text-[hsl(var(--dashboard-foreground))] text-sm">
                    {productInfo.stats.accuracy >= 80 ? 'High' :
                     productInfo.stats.accuracy >= 60 ? 'Medium' : 'Low'} Accuracy
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTab; 