import { useEffect, useState } from "react";
import { useWorkspace } from "@/context/WorkspaceProvider";
import Sidebar from "@/components/layout/Sidebar";
import ChatModule from "@/components/chat/ChatModule";
import DocumentationModule from "@/components/documentation/DocumentationModule";
import CodeModule from "@/components/code/CodeModule";
import TaskModule from "@/components/task/TaskModule";
import OrganizationModule from "@/components/organization/OrganizationModule";
import StoreModule from "@/components/store/StoreModule";
import ProductModule from "@/components/store/ProductModule";
import ForecastModule from "@/components/forecast/ForecastModule";
import AnalyticsModule from "@/components/analytics/AnalyticsModule";
import { Module } from "@/types";
import CommandPalette from "@/components/CommandPalette";
import { useCommandPalette } from "@/hooks/useCommandPalette";
import { useLocation } from "wouter";
import { 
  Store, 
  Package, 
  TrendingUp, 
  BarChart3, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  Lightbulb,
  Activity,
  Database,
  Zap,
  Target,
  ShoppingCart,
  MapPin,
  Calendar,
  DollarSign,
  TrendingDown,
  Box,
  Truck,
  Timer,
  Award,
  Plus,
  Minus,
  Star,
  Medal,
  Building2,
  Warehouse,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Wifi,
  Server,
  RefreshCw,
  Trophy
} from "lucide-react";
import { ForecastRepository } from "@/repository/forecast_repository";

interface HomeProps {
  initialModule?: Module;
}

interface DashboardStats {
  totalStores: number;
  totalProducts: number;
  totalForecasts: number;
  avgForecastImprovement: number;
  totalSales: number;
  avgInventoryTurnover: number;
}

interface RegionalData {
  region: string;
  stores: number;
  avgSales: number;
  performance: number;
}

interface ProductPerformance {
  category: string;
  forecastImprovement: number;
  salesVolume: number;
  trend: 'up' | 'down' | 'stable';
}

interface WeeklyTrend {
  week: string;
  forecast: number;
  actual: number;
  accuracy: number;
}

export default function Home({ initialModule }: HomeProps) {
  const { activeModule, setActiveModule } = useWorkspace();
  const { isOpen, close } = useCommandPalette();
  const [, navigate] = useLocation();
  const [stats, setStats] = useState<DashboardStats>({ 
    totalStores: 0, 
    totalProducts: 0, 
    totalForecasts: 0, 
    avgForecastImprovement: 0,
    totalSales: 0,
    avgInventoryTurnover: 0
  });
  const [regionalData, setRegionalData] = useState<RegionalData[]>([]);
  const [productPerformance, setProductPerformance] = useState<ProductPerformance[]>([]);
  const [weeklyTrends, setWeeklyTrends] = useState<WeeklyTrend[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [lowStockAlerts, setLowStockAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Get the app prefix from environment variables
  const APP_PREFIX = import.meta.env.VITE_APP_PREFIX || '';
  const prefixedPath = (path: string) => APP_PREFIX ? `/${APP_PREFIX}${path}` : path;

  const forecastRepo = new ForecastRepository(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000');
  
  // Set the active module from the URL when the component mounts
  useEffect(() => {
    if (initialModule && initialModule !== activeModule) {
      setActiveModule(initialModule);
    }
  }, [initialModule, activeModule, setActiveModule]);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load basic stats
      const statsQueries = [
        // Total stores count
        "SELECT COUNT(DISTINCT store_no) as count FROM forecast WHERE store_no IS NOT NULL",
        // Total products count  
        "SELECT COUNT(DISTINCT article_id) as count FROM forecast WHERE article_id IS NOT NULL",
        // Total forecast records
        "SELECT COUNT(*) as count FROM forecast",
        // Total sales volume
        "SELECT SUM(sold_qty) as total_sales FROM forecast WHERE sold_qty > 0",
        // Average forecast accuracy
        "SELECT AVG(CASE WHEN sold_qty > 0 AND forecast_qty > 0 THEN LEAST((sold_qty / forecast_qty) * 100, 200) ELSE 0 END) as accuracy FROM forecast WHERE sold_qty > 0 AND forecast_qty > 0"
      ];

      const statsPromises = statsQueries.map(query => 
        forecastRepo.executeSqlQuery({ sql_query: query }, {
          setLoading: () => {},
          setError: () => {},
          setData: () => {}
        })
      );

      const statsResults = await Promise.all(statsPromises);
      
      setStats({
        totalStores: statsResults[0]?.data?.[0]?.count || 0,
        totalProducts: statsResults[1]?.data?.[0]?.count || 0,
        totalForecasts: statsResults[2]?.data?.[0]?.count || 0,
        totalSales: statsResults[3]?.data?.[0]?.total_sales || 0,
        avgForecastImprovement: statsResults[4]?.data?.[0]?.accuracy || 0,
        avgInventoryTurnover: 4.2 // Mock value for now
      });

      // Load regional performance data
      await loadRegionalData();
      
      // Load product performance data
      await loadProductPerformance();
      
      // Load weekly trends
      await loadWeeklyTrends();
      
      // Load top products and alerts
      await loadTopProducts();
      await loadLowStockAlerts();

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRegionalData = async () => {
    try {
      const query = `
        SELECT 
          region,
          COUNT(DISTINCT store_no) as stores,
          AVG(sold_qty) as avg_sales,
          AVG(CASE WHEN forecast_qty > 0 THEN (sold_qty / forecast_qty) * 100 ELSE 0 END) as performance
        FROM forecast 
        WHERE region IS NOT NULL AND sold_qty > 0
        GROUP BY region
        ORDER BY avg_sales DESC
        LIMIT 7
      `;
      
      const result = await forecastRepo.executeSqlQuery({ sql_query: query }, {
        setLoading: () => {}, setError: () => {}, setData: () => {}
      });
      
      if (result?.data) {
        setRegionalData(result.data.map((row: any) => ({
          region: row.region,
          stores: row.stores,
          avgSales: row.avg_sales,
          performance: row.performance
        })));
      }
    } catch (error) {
      console.error('Error loading regional data:', error);
    }
  };

  const loadProductPerformance = async () => {
    try {
      const query = `
        SELECT 
          super_category as category,
          AVG(CASE WHEN forecast_qty > 0 THEN LEAST((sold_qty / forecast_qty) * 100, 200) ELSE 0 END) as forecast_accuracy,
          SUM(sold_qty) as sales_volume
        FROM forecast 
        WHERE super_category IS NOT NULL AND sold_qty > 0 AND forecast_qty > 0
        GROUP BY super_category
        ORDER BY sales_volume DESC
        LIMIT 5
      `;
      
      const result = await forecastRepo.executeSqlQuery({ sql_query: query }, {
        setLoading: () => {}, setError: () => {}, setData: () => {}
      });
      
      if (result?.data) {
        setProductPerformance(result.data.map((row: any) => ({
          category: row.category,
          forecastImprovement: row.forecast_accuracy,
          salesVolume: row.sales_volume,
          trend: row.forecast_accuracy > 85 ? 'up' : row.forecast_accuracy < 70 ? 'down' : 'stable'
        })));
      }
    } catch (error) {
      console.error('Error loading product performance:', error);
    }
  };

  const loadWeeklyTrends = async () => {
    try {
      const query = `
        SELECT 
          week_start_date,
          AVG(forecast_qty) as avg_forecast,
          AVG(sold_qty) as avg_actual,
          AVG(CASE WHEN forecast_qty > 0 THEN (sold_qty / forecast_qty) * 100 ELSE 0 END) as accuracy
        FROM forecast 
        WHERE week_start_date IS NOT NULL AND sold_qty > 0 AND forecast_qty > 0
        GROUP BY week_start_date
        ORDER BY week_start_date DESC
        LIMIT 7
      `;
      
      const result = await forecastRepo.executeSqlQuery({ sql_query: query }, {
        setLoading: () => {}, setError: () => {}, setData: () => {}
      });
      
      if (result?.data) {
        setWeeklyTrends(result.data.map((row: any) => ({
          week: new Date(row.week_start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          forecast: row.avg_forecast,
          actual: row.avg_actual,
          accuracy: row.accuracy
        })).reverse());
      }
    } catch (error) {
      console.error('Error loading weekly trends:', error);
    }
  };

  const loadTopProducts = async () => {
    try {
      const query = `
        SELECT 
          article_description,
          brand,
          SUM(sold_qty) as total_sales,
          AVG(forecast_qty) as avg_forecast,
          COUNT(DISTINCT store_no) as store_count
        FROM forecast 
        WHERE article_description IS NOT NULL AND sold_qty > 0 AND article_description != 'dummy'
        GROUP BY article_description, brand
        ORDER BY total_sales DESC
        LIMIT 5
      `;
      
      const result = await forecastRepo.executeSqlQuery({ sql_query: query }, {
        setLoading: () => {}, setError: () => {}, setData: () => {}
      });
      
      if (result?.data) {
        setTopProducts(result.data);
      }
    } catch (error) {
      console.error('Error loading top products:', error);
    }
  };

  const loadLowStockAlerts = async () => {
    try {
      const query = `
        SELECT 
          article_description,
          brand,
          AVG(forecast_qty) as avg_forecast,
          COUNT(DISTINCT store_no) as affected_stores
        FROM forecast 
        WHERE article_description IS NOT NULL AND forecast_qty > 0 AND forecast_qty < 20
        GROUP BY article_description, brand
        ORDER BY avg_forecast ASC
        LIMIT 4
      `;
      
      const result = await forecastRepo.executeSqlQuery({ sql_query: query }, {
        setLoading: () => {}, setError: () => {}, setData: () => {}
      });
      
      if (result?.data) {
        setLowStockAlerts(result.data);
      }
    } catch (error) {
      console.error('Error loading low stock alerts:', error);
    }
  };

  // We're using the unified CodeModule for chat, code and docs
  const shouldUseCodeModule = (module: Module) => 
    module === "code" || module === "chat" || module === "docs";

  const commands = [
    // Navigation commands - only uncommented modules from AppBar
    { 
      id: 'goto-home', 
      name: 'Go to Home', 
      shortcut: '⌘H', 
      action: () => navigate(prefixedPath('/')) 
    },
    { 
      id: 'goto-store', 
      name: 'Go to Store Master', 
      shortcut: '⌘1', 
      action: () => navigate(prefixedPath('/store')) 
    },
    { 
      id: 'goto-product', 
      name: 'Go to Product Master', 
      shortcut: '⌘2', 
      action: () => navigate(prefixedPath('/product')) 
    },
    { 
      id: 'goto-forecast', 
      name: 'Go to Forecast', 
      shortcut: '⌘3', 
      action: () => navigate(prefixedPath('/forecast')) 
    },
    { 
      id: 'goto-analytics', 
      name: 'Go to Analytics', 
      shortcut: '⌘4', 
      action: () => navigate(prefixedPath('/analytics')) 
    },
    
    // Action commands
    { 
      id: 'settings', 
      name: 'Open Settings', 
      shortcut: '⌘,', 
      action: () => navigate(prefixedPath('/settings')) 
    }
  ];

  if (activeModule !== "home") {
    return (
      <>
        <div className="h-[calc(100vh-3rem)] flex overflow-hidden bg-[hsl(var(--dashboard-background))]">
          <Sidebar />
          <div className="flex-1 flex overflow-hidden">
            {shouldUseCodeModule(activeModule) ? (
              <CodeModule />
            ) : activeModule === "organization" ? (
              <OrganizationModule />
            ) : activeModule === "task" ? (
              <TaskModule isActiveModule={true} />
            ) : activeModule === "store" ? (
              <StoreModule />
            ) : activeModule === "product" ? (
              <ProductModule />
            ) : activeModule === "forecast" ? (
              <ForecastModule />
            ) : activeModule === "analytics" ? (
              <AnalyticsModule />
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-bold mb-4">This module is under development</h1>
                  <p className="text-muted-foreground">Please check back later</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <CommandPalette 
          isOpen={isOpen} 
          onClose={close} 
          commands={commands} 
        />
      </>
    );
  }

  return (
    <>
      <div className="h-[calc(100vh-3rem)] flex overflow-hidden bg-[hsl(var(--dashboard-background))]">
        <Sidebar />
        <div className="flex-1 overflow-auto bg-[hsl(var(--dashboard-background))] p-6">
          {/* Main Grid Layout */}
          <div className="grid grid-cols-12 gap-6 h-full">
            
            {/* Left Column - Inventory & Performance */}
            <div className="col-span-3 space-y-6">
              {/* Inventory Overview */}
              <div className="bg-[hsl(var(--dashboard-card-background))] rounded-2xl p-6 border border-[hsl(var(--dashboard-card-border))]">
                <h3 className="text-[hsl(var(--dashboard-card-foreground))] text-lg font-medium mb-6"> Overview</h3>
                
                {/* Total Products */}
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <Package size={16} className="text-[hsl(var(--dashboard-primary-blue))] mr-2" />
                    <span className="text-[hsl(var(--dashboard-card-foreground))] text-sm">Total Products</span>
                  </div>
                  <div className="text-[hsl(var(--dashboard-card-foreground))] text-lg font-medium">
                    {loading ? '...' : stats.totalProducts.toLocaleString()}
                  </div>
                </div>

                {/* Total Sales */}
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    ₹
                    <span className="text-[hsl(var(--dashboard-card-foreground))] text-sm">Total Sales Volume</span>
                  </div>
                  <div className="text-[hsl(var(--dashboard-card-foreground))] text-lg font-medium">
                    {loading ? '...' : Math.round(stats.totalSales).toLocaleString()}
                  </div>
                </div>

                {/* Forecast Improvement Circle */}
                <div className="flex justify-center mb-6">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        stroke="hsl(var(--dashboard-accent-background))"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 50}`}
                        strokeDashoffset={`${2 * Math.PI * 50 * (1 - Math.min(stats.avgForecastImprovement / 100, 1))}`}
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="hsl(var(--dashboard-primary-blue))" />
                          <stop offset="100%" stopColor="hsl(var(--primary))" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[hsl(var(--dashboard-card-foreground))] text-2xl font-bold">
                        {loading ? '...' : `${Math.round(stats.avgForecastImprovement)}%`}
                      </span>
                      <span className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">Improvement</span>
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-[hsl(var(--dashboard-card-foreground))] font-medium">Stores</div>
                    <div className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">
                      {loading ? '...' : stats.totalStores}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-[hsl(var(--dashboard-card-foreground))] font-medium">Records</div>
                    <div className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">
                      {loading ? '...' : `${Math.round(stats.totalForecasts / 1000)}K`}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-[hsl(var(--dashboard-card-foreground))] font-medium">Turnover</div>
                    <div className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">{stats.avgInventoryTurnover}x</div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[hsl(var(--dashboard-accent-background))] rounded-xl p-4 text-center border border-[hsl(var(--dashboard-card-border))]">
                    <Target size={20} className="text-[hsl(var(--dashboard-muted-foreground))] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-[hsl(var(--dashboard-card-foreground))]">
                      {Math.round(stats.avgForecastImprovement)}
                    </div>
                    <div className="text-[hsl(var(--dashboard-muted-foreground))] text-xs">Improvement %</div>
                  </div>
                  <div className="bg-[hsl(var(--dashboard-accent-background))] rounded-xl p-4 text-center border border-[hsl(var(--dashboard-card-border))]">
                    <Store size={20} className="text-[hsl(var(--dashboard-muted-foreground))] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-[hsl(var(--dashboard-card-foreground))]">{stats.totalStores}</div>
                    <div className="text-[hsl(var(--dashboard-muted-foreground))] text-xs">Active Stores</div>
                  </div>
                  <div className="bg-[hsl(var(--dashboard-accent-background))] rounded-xl p-4 text-center border border-[hsl(var(--dashboard-card-border))]">
                    <Truck size={20} className="text-[hsl(var(--dashboard-muted-foreground))] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-[hsl(var(--dashboard-card-foreground))]">
                      {Math.round(stats.totalSales / stats.totalStores)}
                    </div>
                    <div className="text-[hsl(var(--dashboard-muted-foreground))] text-xs">Avg per Store</div>
                  </div>
                </div>
              </div>

              {/* Product Performance */}
              <div className="bg-[hsl(var(--dashboard-card-background))] rounded-2xl p-6 border border-[hsl(var(--dashboard-card-border))]">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-[hsl(var(--dashboard-primary-purple))] rounded-full flex items-center justify-center mr-3">
                    <BarChart3 size={16} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-[hsl(var(--dashboard-card-foreground))] font-medium">Product Performance</h3>
                    <p className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">Category accuracy trends</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {loading ? (
                    <div className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">Loading...</div>
                  ) : (
                    productPerformance.slice(0, 3).map((product, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-3 ${
                            product.trend === 'up' ? 'bg-[hsl(var(--dashboard-success))]' : 
                            product.trend === 'down' ? 'bg-[hsl(var(--dashboard-error))]' : 'bg-[hsl(var(--dashboard-warning))]'
                          }`}></div>
                          <span className="text-[hsl(var(--dashboard-card-foreground))] text-sm">{product.category}</span>
                        </div>
                        <span className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">
                          {Math.round(product.forecastImprovement)}%
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Low Stock Alerts */}
              <div className="bg-[hsl(var(--dashboard-card-background))] rounded-2xl p-6 border border-[hsl(var(--dashboard-card-border))]">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-[hsl(var(--dashboard-error))] rounded-full flex items-center justify-center mr-3">
                    <AlertTriangle size={16} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-[hsl(var(--dashboard-card-foreground))] font-medium">Low Stock Alerts</h3>
                    <p className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">Items need attention</p>
                  </div>
                </div>
                <div className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">
                  {loading ? 'Loading...' : `${lowStockAlerts.length} products with low forecast`}
                </div>
              </div>
            </div>

            {/* Center Column - Trends & Analytics */}
            <div className="col-span-6 space-y-6">
              {/* Quick Navigation Links */}
              <div className="bg-[hsl(var(--dashboard-card-background))] rounded-2xl p-6 border border-[hsl(var(--dashboard-card-border))]">
                <h3 className="text-[hsl(var(--dashboard-card-foreground))] text-lg font-medium mb-2">Quick Navigation</h3>
                <p className="text-[hsl(var(--dashboard-muted-foreground))] text-sm mb-6">
                  Access key modules and tools for retail analytics and forecasting.
                </p>

                {/* Navigation Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => {
                      setActiveModule('store');
                      navigate(prefixedPath('/store'));
                    }}
                    className="bg-[hsl(var(--dashboard-accent-background))] hover:bg-[hsl(var(--dashboard-card-hover))] rounded-xl p-4 text-left transition-all duration-200 group border border-[hsl(var(--dashboard-card-border))]"
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-[hsl(var(--dashboard-primary-blue))] rounded-lg flex items-center justify-center mr-3 group-hover:opacity-90 transition-opacity">
                        <Store size={20} className="text-white" />
                      </div>
                      <div>
                        <h4 className="text-[hsl(var(--dashboard-card-foreground))] font-medium text-sm">Store Master</h4>
                        <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs">Manage locations</p>
                      </div>
                    </div>
                    <div className="text-[hsl(var(--dashboard-muted-foreground))] text-xs">
                      {loading ? '...' : `${stats.totalStores} stores`}
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setActiveModule('product');
                      navigate(prefixedPath('/product'));
                    }}
                    className="bg-[hsl(var(--dashboard-accent-background))] hover:bg-[hsl(var(--dashboard-card-hover))] rounded-xl p-4 text-left transition-all duration-200 group border border-[hsl(var(--dashboard-card-border))]"
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-[hsl(var(--dashboard-primary-green))] rounded-lg flex items-center justify-center mr-3 group-hover:opacity-90 transition-opacity">
                        <Package size={20} className="text-white" />
                      </div>
                      <div>
                        <h4 className="text-[hsl(var(--dashboard-card-foreground))] font-medium text-sm">Product Master</h4>
                        <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs">Browse catalog</p>
                      </div>
                    </div>
                    <div className="text-[hsl(var(--dashboard-muted-foreground))] text-xs">
                      {loading ? '...' : `${stats.totalProducts.toLocaleString()} products`}
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setActiveModule('forecast');
                      navigate(prefixedPath('/forecast'));
                    }}
                    className="bg-[hsl(var(--dashboard-accent-background))] hover:bg-[hsl(var(--dashboard-card-hover))] rounded-xl p-4 text-left transition-all duration-200 group border border-[hsl(var(--dashboard-card-border))]"
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-[hsl(var(--dashboard-primary-purple))] rounded-lg flex items-center justify-center mr-3 group-hover:opacity-90 transition-opacity">
                        <TrendingUp size={20} className="text-white" />
                      </div>
                      <div>
                        <h4 className="text-[hsl(var(--dashboard-card-foreground))] font-medium text-sm">Forecast</h4>
                        <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs">View predictions</p>
                      </div>
                    </div>
                    <div className="text-[hsl(var(--dashboard-muted-foreground))] text-xs">
                      {loading ? '...' : `${Math.round(stats.totalForecasts / 1000)}K records`}
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setActiveModule('analytics');
                      navigate(prefixedPath('/analytics'));
                    }}
                    className="bg-[hsl(var(--dashboard-accent-background))] hover:bg-[hsl(var(--dashboard-card-hover))] rounded-xl p-4 text-left transition-all duration-200 group border border-[hsl(var(--dashboard-card-border))]"
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-[hsl(var(--dashboard-primary-orange))] rounded-lg flex items-center justify-center mr-3 group-hover:opacity-90 transition-opacity">
                        <BarChart3 size={20} className="text-white" />
                      </div>
                      <div>
                        <h4 className="text-[hsl(var(--dashboard-card-foreground))] font-medium text-sm">Analytics</h4>
                        <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs">Data insights</p>
                      </div>
                    </div>
                    <div className="text-[hsl(var(--dashboard-muted-foreground))] text-xs">
                      Advanced reports
                    </div>
                  </button>
                </div>

                {/* Additional Quick Actions */}
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => {
                      setActiveModule('store');
                      navigate(prefixedPath('/store'));
                    }}
                    className="bg-[hsl(var(--dashboard-accent-background))] hover:bg-[hsl(var(--dashboard-primary-blue))]/20 rounded-lg p-3 text-center transition-all duration-200 border border-transparent hover:border-[hsl(var(--dashboard-primary-blue))]/30"
                  >
                    <Plus size={16} className="text-[hsl(var(--dashboard-primary-blue))] mx-auto mb-1" />
                    <div className="text-[hsl(var(--dashboard-card-foreground))] text-xs">Add Store</div>
                  </button>
                  <button
                    onClick={() => {
                      setActiveModule('product');
                      navigate(prefixedPath('/product'));
                    }}
                    className="bg-[hsl(var(--dashboard-accent-background))] hover:bg-[hsl(var(--dashboard-primary-green))]/20 rounded-lg p-3 text-center transition-all duration-200 border border-transparent hover:border-[hsl(var(--dashboard-primary-green))]/30"
                  >
                    <Package size={16} className="text-[hsl(var(--dashboard-primary-green))] mx-auto mb-1" />
                    <div className="text-[hsl(var(--dashboard-card-foreground))] text-xs">Add Product</div>
                  </button>
                  <button
                    onClick={() => {
                      setActiveModule('analytics');
                      navigate(prefixedPath('/analytics'));
                    }}
                    className="bg-[hsl(var(--dashboard-accent-background))] hover:bg-[hsl(var(--dashboard-primary-purple))]/20 rounded-lg p-3 text-center transition-all duration-200 border border-transparent hover:border-[hsl(var(--dashboard-primary-purple))]/30"
                  >
                    <BarChart3 size={16} className="text-[hsl(var(--dashboard-primary-purple))] mx-auto mb-1" />
                    <div className="text-[hsl(var(--dashboard-card-foreground))] text-xs">View Reports</div>
                  </button>
                </div>
              </div>

              {/* Regional Distribution Heatmap */}
              <div className="rounded-2xl p-6 bg-[hsl(var(--dashboard-regional-pink))] border border-[hsl(var(--dashboard-card-border))]">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-[hsl(var(--dashboard-card-foreground))] text-lg font-medium mb-2">Regional Distribution</h3>
                    <p className="text-[hsl(var(--dashboard-card-foreground))] text-sm opacity-80">
                      {loading ? 'Loading...' : `${regionalData.length} regions with ${regionalData.reduce((sum, r) => sum + r.stores, 0)} stores • Avg accuracy: ${Math.round(regionalData.length > 0 ? regionalData.reduce((sum, r) => sum + r.performance, 0) / regionalData.length : 0)}%`}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-[hsl(var(--dashboard-card-foreground))] text-sm font-medium">
                      {loading ? '...' : `${Math.round(regionalData.reduce((sum, r) => sum + r.avgSales, 0))} total units`}
                    </div>
                    <div className="text-[hsl(var(--dashboard-card-foreground))] text-xs opacity-70">across all regions</div>
                  </div>
                </div>

                {/* Enhanced Performance Matrix */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {Array.from({ length: 49 }, (_, i) => {
                    const regionIndex = regionalData.length > 0 ? i % regionalData.length : 0;
                    const region = regionalData[regionIndex];
                    const intensity = region ? Math.min(region.performance / 100, 1) : 0.3;
                    const hasData = region && region.performance > 0;
                    const performance = region ? region.performance : 0;
                    return (
                      <div 
                        key={i} 
                        className={`w-3 h-3 rounded-full transition-all duration-200 hover:scale-125 ${
                          !hasData ? 'bg-[hsl(var(--dashboard-muted-foreground))]/30' :
                          performance > 95 ? 'bg-[hsl(var(--dashboard-success))]/80' : 
                          performance > 90 ? 'bg-[hsl(var(--dashboard-success))]/60' : 
                          performance > 85 ? 'bg-[hsl(var(--dashboard-warning))]/60' : 
                          performance > 80 ? 'bg-[hsl(var(--dashboard-warning))]/80' : 'bg-[hsl(var(--dashboard-error))]/80'
                        }`}
                        title={hasData ? `${region.region}: ${Math.round(region.performance)}% performance` : 'No data'}
                      ></div>
                    );
                  })}
                </div>

                {/* Enhanced Region labels with metrics */}
                <div className="grid grid-cols-7 gap-2 text-center mb-4">
                  {regionalData.slice(0, 7).map((region, index) => (
                    <div key={index} className="text-[hsl(var(--dashboard-card-foreground))] text-xs">
                      <div className="font-medium truncate opacity-90">
                        {region.region.slice(0, 6)}
                      </div>
                      <div className="opacity-70">
                        {region.stores}s • {Math.round(region.performance)}%
                      </div>
                    </div>
                  ))}
                </div>

                {/* Performance legend */}
                <div className="flex items-center justify-between text-[hsl(var(--dashboard-card-foreground))] text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-[hsl(var(--dashboard-error))]/80 rounded-full mr-1"></div>
                      <span className="opacity-80">Below 80%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-[hsl(var(--dashboard-warning))]/80 rounded-full mr-1"></div>
                      <span className="opacity-80">80-85%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-[hsl(var(--dashboard-warning))]/60 rounded-full mr-1"></div>
                      <span className="opacity-80">85-90%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-[hsl(var(--dashboard-success))]/60 rounded-full mr-1"></div>
                      <span className="opacity-80">90-95%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-[hsl(var(--dashboard-success))]/80 rounded-full mr-1"></div>
                      <span className="opacity-80">Above 95%</span>
                    </div>
                  </div>
                  <div className="opacity-70">
                    s = stores
                  </div>
                </div>
              </div>

              {/* Forecast vs Actual Chart */}
              <div className="bg-[hsl(var(--dashboard-card-background))] rounded-2xl p-6 border border-[hsl(var(--dashboard-card-border))]">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-[hsl(var(--dashboard-card-foreground))] font-medium">Forecast vs Actual</h3>
                    <p className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">Weekly comparison</p>
                  </div>
                  <div>
                    <h3 className="text-[hsl(var(--dashboard-card-foreground))] font-medium">Improvement Trend</h3>
                    <p className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">
                      {loading ? '...' : `${Math.round(stats.avgForecastImprovement)}% avg`}
                    </p>
                  </div>
                </div>

                {/* Performance Chart */}
                <div className="h-32 bg-[hsl(var(--dashboard-chart-background))] rounded-lg p-4 mb-4 border border-[hsl(var(--dashboard-card-border))]">
                  <svg className="w-full h-full" viewBox="0 0 300 100">
                    {weeklyTrends.length > 1 && (
                      <>
                    {/* Forecast line */}
                    <polyline
                      fill="none"
                          stroke="hsl(var(--dashboard-primary-blue))"
                      strokeWidth="2"
                      points={weeklyTrends.map((week, index) => 
                        `${(index / (weeklyTrends.length - 1)) * 300},${100 - (week.forecast / Math.max(...weeklyTrends.map(w => w.forecast)) * 80)}`
                      ).join(' ')}
                    />
                    {/* Actual line */}
                    <polyline
                      fill="none"
                          stroke="hsl(var(--dashboard-success))"
                      strokeWidth="2"
                      points={weeklyTrends.map((week, index) => 
                        `${(index / (weeklyTrends.length - 1)) * 300},${100 - (week.actual / Math.max(...weeklyTrends.map(w => w.actual)) * 80)}`
                      ).join(' ')}
                    />
                      </>
                    )}
                    {weeklyTrends.length === 0 && (
                      <text x="150" y="50" textAnchor="middle" className="text-[hsl(var(--dashboard-muted-foreground))] text-xs">
                        No data available
                      </text>
                    )}
                  </svg>
                </div>

                {/* Legend */}
                <div className="flex justify-between text-[hsl(var(--dashboard-muted-foreground))] text-xs">
                  <div className="flex items-center">
                    <div className="w-3 h-0.5 bg-[hsl(var(--dashboard-primary-blue))] mr-2"></div>
                    <span>Forecast</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-0.5 bg-[hsl(var(--dashboard-success))] mr-2"></div>
                    <span>Actual</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Insights & Rankings */}
            <div className="col-span-3 space-y-6">
              {/* Quick Actions */}
              <div className="bg-[hsl(var(--dashboard-card-background))] rounded-2xl p-6 border border-[hsl(var(--dashboard-card-border))]">
                <h3 className="text-[hsl(var(--dashboard-card-foreground))] text-lg font-medium mb-6">Quick Actions</h3>
                
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      setActiveModule('forecast');
                      navigate(prefixedPath('/forecast'));
                    }}
                    className="w-full bg-[hsl(var(--dashboard-accent-background))] hover:bg-[hsl(var(--dashboard-card-hover))] rounded-xl p-4 text-left transition-all duration-200 group border border-[hsl(var(--dashboard-card-border))] hover:border-[hsl(var(--dashboard-primary-blue))]/30"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[hsl(var(--dashboard-primary-blue))] rounded-lg flex items-center justify-center mr-3 group-hover:opacity-90 transition-opacity">
                        <TrendingUp size={20} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[hsl(var(--dashboard-card-foreground))] font-medium text-sm">View Forecasts</h4>
                        <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs">Analyze predictions</p>
                      </div>
                      <div className="text-[hsl(var(--dashboard-muted-foreground))] text-xs">
                        {loading ? '...' : `${Math.round(stats.totalForecasts / 1000)}K`}
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setActiveModule('analytics');
                      navigate(prefixedPath('/analytics'));
                    }}
                    className="w-full bg-[hsl(var(--dashboard-accent-background))] hover:bg-[hsl(var(--dashboard-card-hover))] rounded-xl p-4 text-left transition-all duration-200 group border border-[hsl(var(--dashboard-card-border))] hover:border-[hsl(var(--dashboard-primary-purple))]/30"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[hsl(var(--dashboard-primary-purple))] rounded-lg flex items-center justify-center mr-3 group-hover:opacity-90 transition-opacity">
                        <BarChart3 size={20} className="text-white" />
                  </div>
                      <div className="flex-1">
                        <h4 className="text-[hsl(var(--dashboard-card-foreground))] font-medium text-sm">Analytics</h4>
                        <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs">Deep insights</p>
                  </div>
                      <div className="text-[hsl(var(--dashboard-muted-foreground))] text-xs">
                        Reports
                  </div>
                </div>
                  </button>

                  <button
                    onClick={() => {
                      setActiveModule('product');
                      navigate(prefixedPath('/product'));
                    }}
                    className="w-full bg-[hsl(var(--dashboard-accent-background))] hover:bg-[hsl(var(--dashboard-card-hover))] rounded-xl p-4 text-left transition-all duration-200 group border border-[hsl(var(--dashboard-card-border))] hover:border-[hsl(var(--dashboard-primary-green))]/30"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[hsl(var(--dashboard-primary-green))] rounded-lg flex items-center justify-center mr-3 group-hover:opacity-90 transition-opacity">
                        <Package size={20} className="text-white" />
                        </div>
                      <div className="flex-1">
                        <h4 className="text-[hsl(var(--dashboard-card-foreground))] font-medium text-sm">Manage Products</h4>
                        <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs">Catalog tools</p>
                        </div>
                      <div className="text-[hsl(var(--dashboard-muted-foreground))] text-xs">
                        {loading ? '...' : `${Math.round(stats.totalProducts / 1000)}K`}
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Advanced Analytics */}
              <div className="bg-[hsl(var(--dashboard-card-background))] rounded-2xl p-6 border border-[hsl(var(--dashboard-card-border))]">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-[hsl(var(--dashboard-primary-blue))] rounded-full flex items-center justify-center mr-3">
                    <TrendingUp size={16} className="text-white" />
                    </div>
                  <div>
                    <h3 className="text-[hsl(var(--dashboard-card-foreground))] font-medium">Advanced Analytics</h3>
                    <p className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">AI-powered insights</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-[hsl(var(--dashboard-accent-background))] rounded-lg p-4 border border-[hsl(var(--dashboard-card-border))]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[hsl(var(--dashboard-card-foreground))] text-sm font-medium">Forecast Accuracy</span>
                      <span className="text-[hsl(var(--dashboard-primary-blue))] text-sm font-bold">
                        {loading ? '...' : `${Math.round(stats.avgForecastImprovement)}%`}
                      </span>
                    </div>
                    <div className="w-full bg-[hsl(var(--dashboard-chart-grid))] rounded-full h-2">
                      <div 
                        className="bg-[hsl(var(--dashboard-primary-blue))] h-2 rounded-full transition-all duration-500"
                        style={{ width: loading ? '0%' : `${Math.min(stats.avgForecastImprovement, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-[hsl(var(--dashboard-accent-background))] rounded-lg p-4 border border-[hsl(var(--dashboard-card-border))]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[hsl(var(--dashboard-card-foreground))] text-sm font-medium">Inventory Turnover</span>
                      <span className="text-[hsl(var(--dashboard-primary-green))] text-sm font-bold">
                        {loading ? '...' : `${stats.avgInventoryTurnover}x`}
                    </span>
                  </div>
                    <div className="w-full bg-[hsl(var(--dashboard-chart-grid))] rounded-full h-2">
                      <div 
                        className="bg-[hsl(var(--dashboard-primary-green))] h-2 rounded-full transition-all duration-500"
                        style={{ width: loading ? '0%' : `${Math.min(stats.avgInventoryTurnover * 10, 100)}%` }}
                      ></div>
                    </div>
                </div>

                  <div className="bg-[hsl(var(--dashboard-accent-background))] rounded-lg p-4 border border-[hsl(var(--dashboard-card-border))]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[hsl(var(--dashboard-card-foreground))] text-sm font-medium">System Performance</span>
                      <span className="text-[hsl(var(--dashboard-primary-purple))] text-sm font-bold">98%</span>
                    </div>
                    <div className="w-full bg-[hsl(var(--dashboard-chart-grid))] rounded-full h-2">
                      <div className="bg-[hsl(var(--dashboard-primary-purple))] h-2 rounded-full w-[98%] transition-all duration-500"></div>
                  </div>
                  </div>
                </div>
              </div>

              {/* Top Performing Products */}
              <div className="bg-[hsl(var(--dashboard-card-background))] rounded-2xl p-6 border border-[hsl(var(--dashboard-card-border))]">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-[hsl(var(--dashboard-primary-green))] rounded-full flex items-center justify-center mr-3">
                    <Trophy size={16} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-[hsl(var(--dashboard-card-foreground))] font-medium">Top Performing Products</h3>
                    <p className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">Forecast accuracy leaders</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">Loading...</div>
                  ) : (
                    topProducts.slice(0, 4).map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-[hsl(var(--dashboard-accent-background))] rounded-lg border border-[hsl(var(--dashboard-card-border))]">
                        <div className="flex items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mr-3 ${
                            index === 0 ? 'bg-[hsl(var(--dashboard-warning))]' : 
                            index === 1 ? 'bg-[hsl(var(--dashboard-chart-grid))]' : 
                            index === 2 ? 'bg-[hsl(var(--dashboard-primary-orange))]' : 'bg-[hsl(var(--dashboard-muted-foreground))]'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <div className="text-[hsl(var(--dashboard-card-foreground))] text-sm font-medium">
                              {product.article_description && product.article_description.length > 20 ? 
                                `${product.article_description.substring(0, 20)}...` : 
                                product.article_description || 'Unknown Product'}
                            </div>
                            <div className="text-[hsl(var(--dashboard-muted-foreground))] text-xs">
                              {product.brand || 'Unknown Brand'}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[hsl(var(--dashboard-success))] text-sm font-bold">
                            {Math.round(product.total_sales || 0)}
                          </div>
                          <div className="text-[hsl(var(--dashboard-muted-foreground))] text-xs">
                            sales
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-[hsl(var(--dashboard-card-background))] rounded-2xl p-6 border border-[hsl(var(--dashboard-card-border))]">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-[hsl(var(--dashboard-primary-orange))] rounded-full flex items-center justify-center mr-3">
                    <Activity size={16} className="text-white" />
            </div>
                  <div>
                    <h3 className="text-[hsl(var(--dashboard-card-foreground))] font-medium">Recent Activity</h3>
                    <p className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">System updates</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-[hsl(var(--dashboard-success))] rounded-full mt-2 mr-3"></div>
                    <div>
                      <div className="text-[hsl(var(--dashboard-card-foreground))] text-sm">Forecast updated</div>
                      <div className="text-[hsl(var(--dashboard-muted-foreground))] text-xs">2 hours ago</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-[hsl(var(--dashboard-primary-blue))] rounded-full mt-2 mr-3"></div>
                    <div>
                      <div className="text-[hsl(var(--dashboard-card-foreground))] text-sm">New products added</div>
                      <div className="text-[hsl(var(--dashboard-muted-foreground))] text-xs">4 hours ago</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-[hsl(var(--dashboard-warning))] rounded-full mt-2 mr-3"></div>
                    <div>
                      <div className="text-[hsl(var(--dashboard-card-foreground))] text-sm">System maintenance</div>
                      <div className="text-[hsl(var(--dashboard-muted-foreground))] text-xs">Yesterday</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CommandPalette 
        isOpen={isOpen} 
        onClose={close} 
        commands={commands} 
      />
    </>
  );
}

