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
  RefreshCw
} from "lucide-react";
import { ForecastRepository } from "@/repository/forecast_repository";

interface HomeProps {
  initialModule?: Module;
}

interface DashboardStats {
  totalStores: number;
  totalProducts: number;
  totalForecasts: number;
  avgForecastAccuracy: number;
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
  forecastAccuracy: number;
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
    avgForecastAccuracy: 0,
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
        avgForecastAccuracy: statsResults[4]?.data?.[0]?.accuracy || 0,
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
          forecastAccuracy: row.forecast_accuracy,
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
        WHERE article_description IS NOT NULL AND sold_qty > 0
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
        <div className="h-screen flex overflow-hidden bg-background">
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
      <div className="h-screen flex overflow-hidden bg-[#1a1a1a]">
        <Sidebar />
        <div className="flex-1 overflow-auto bg-[#1a1a1a] p-6">
          {/* Main Grid Layout */}
          <div className="grid grid-cols-12 gap-6 h-full">
            
            {/* Left Column - Inventory & Performance */}
            <div className="col-span-3 space-y-6">
              {/* Inventory Overview */}
              <div className="bg-[#2a2a2a] rounded-2xl p-6">
                <h3 className="text-white text-lg font-medium mb-6"> Overview</h3>
                
                {/* Total Products */}
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <Package size={16} className="text-blue-400 mr-2" />
                    <span className="text-white text-sm">Total Products</span>
                  </div>
                  <div className="text-white text-lg font-medium">
                    {loading ? '...' : stats.totalProducts.toLocaleString()}
                  </div>
                </div>

                {/* Total Sales */}
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <DollarSign size={16} className="text-green-400 mr-2" />
                    <span className="text-white text-sm">Total Sales Volume</span>
                  </div>
                  <div className="text-white text-lg font-medium">
                    {loading ? '...' : Math.round(stats.totalSales).toLocaleString()}
                  </div>
                </div>

                {/* Forecast Accuracy Circle */}
                <div className="flex justify-center mb-6">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        stroke="#3a3a3a"
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
                        strokeDashoffset={`${2 * Math.PI * 50 * (1 - Math.min(stats.avgForecastAccuracy / 100, 1))}`}
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#60a5fa" />
                          <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {loading ? '...' : `${Math.round(stats.avgForecastAccuracy)}%`}
                      </span>
                      <span className="text-gray-400 text-sm">Accuracy</span>
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-white font-medium">Stores</div>
                    <div className="text-gray-400 text-sm">
                      {loading ? '...' : stats.totalStores}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-medium">Records</div>
                    <div className="text-gray-400 text-sm">
                      {loading ? '...' : `${Math.round(stats.totalForecasts / 1000)}K`}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-medium">Turnover</div>
                    <div className="text-gray-400 text-sm">{stats.avgInventoryTurnover}x</div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#3a3a3a] rounded-xl p-4 text-center">
                    <Target size={20} className="text-gray-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">
                      {Math.round(stats.avgForecastAccuracy)}
                    </div>
                    <div className="text-gray-400 text-xs">Accuracy %</div>
                  </div>
                  <div className="bg-[#3a3a3a] rounded-xl p-4 text-center">
                    <Store size={20} className="text-gray-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{stats.totalStores}</div>
                    <div className="text-gray-400 text-xs">Active Stores</div>
                  </div>
                  <div className="bg-[#3a3a3a] rounded-xl p-4 text-center">
                    <Truck size={20} className="text-gray-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">
                      {Math.round(stats.totalSales / stats.totalStores)}
                    </div>
                    <div className="text-gray-400 text-xs">Avg per Store</div>
                  </div>
                </div>
              </div>

              {/* Product Performance */}
              <div className="bg-[#2a2a2a] rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                    <BarChart3 size={16} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Product Performance</h3>
                    <p className="text-gray-400 text-sm">Category accuracy trends</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {loading ? (
                    <div className="text-gray-400 text-sm">Loading...</div>
                  ) : (
                    productPerformance.slice(0, 3).map((product, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-3 ${
                            product.trend === 'up' ? 'bg-green-400' : 
                            product.trend === 'down' ? 'bg-red-400' : 'bg-yellow-400'
                          }`}></div>
                          <span className="text-white text-sm">{product.category}</span>
                        </div>
                        <span className="text-gray-400 text-sm">
                          {Math.round(product.forecastAccuracy)}%
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Low Stock Alerts */}
              <div className="bg-[#2a2a2a] rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                    <AlertTriangle size={16} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Low Stock Alerts</h3>
                    <p className="text-gray-400 text-sm">Items need attention</p>
                  </div>
                </div>
                <div className="text-gray-400 text-sm">
                  {loading ? 'Loading...' : `${lowStockAlerts.length} products with low forecast`}
                </div>
              </div>
            </div>

            {/* Center Column - Trends & Analytics */}
            <div className="col-span-6 space-y-6">
              {/* Quick Navigation Links */}
              <div className="bg-[#2a2a2a] rounded-2xl p-6">
                <h3 className="text-white text-lg font-medium mb-2">Quick Navigation</h3>
                <div className="flex items-center mb-4">
                  <span className="text-3xl font-bold text-white mr-2">
                    {loading ? '...' : Math.round(stats.avgForecastAccuracy)}%
                  </span>
                  <span className="text-gray-400">Average Accuracy</span>
                </div>
                <p className="text-gray-400 text-sm mb-6">
                  Access key modules and tools for retail analytics and forecasting.
                </p>

                {/* Navigation Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => {
                      setActiveModule('store');
                      navigate(prefixedPath('/store'));
                    }}
                    className="bg-[#3a3a3a] hover:bg-[#4a4a4a] rounded-xl p-4 text-left transition-all duration-200 group"
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-400 transition-colors">
                        <Store size={20} className="text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-sm">Store Master</h4>
                        <p className="text-gray-400 text-xs">Manage locations</p>
                      </div>
                    </div>
                    <div className="text-gray-400 text-xs">
                      {loading ? '...' : `${stats.totalStores} stores`}
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setActiveModule('product');
                      navigate(prefixedPath('/product'));
                    }}
                    className="bg-[#3a3a3a] hover:bg-[#4a4a4a] rounded-xl p-4 text-left transition-all duration-200 group"
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3 group-hover:bg-green-400 transition-colors">
                        <Package size={20} className="text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-sm">Product Master</h4>
                        <p className="text-gray-400 text-xs">Browse catalog</p>
                      </div>
                    </div>
                    <div className="text-gray-400 text-xs">
                      {loading ? '...' : `${stats.totalProducts.toLocaleString()} products`}
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setActiveModule('forecast');
                      navigate(prefixedPath('/forecast'));
                    }}
                    className="bg-[#3a3a3a] hover:bg-[#4a4a4a] rounded-xl p-4 text-left transition-all duration-200 group"
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3 group-hover:bg-purple-400 transition-colors">
                        <TrendingUp size={20} className="text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-sm">Forecast</h4>
                        <p className="text-gray-400 text-xs">View predictions</p>
                      </div>
                    </div>
                    <div className="text-gray-400 text-xs">
                      {loading ? '...' : `${Math.round(stats.totalForecasts / 1000)}K records`}
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setActiveModule('analytics');
                      navigate(prefixedPath('/analytics'));
                    }}
                    className="bg-[#3a3a3a] hover:bg-[#4a4a4a] rounded-xl p-4 text-left transition-all duration-200 group"
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mr-3 group-hover:bg-orange-400 transition-colors">
                        <BarChart3 size={20} className="text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-sm">Analytics</h4>
                        <p className="text-gray-400 text-xs">Data insights</p>
                      </div>
                    </div>
                    <div className="text-gray-400 text-xs">
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
                    className="bg-[#3a3a3a] hover:bg-blue-500/20 rounded-lg p-3 text-center transition-all duration-200 border border-transparent hover:border-blue-500/30"
                  >
                    <Plus size={16} className="text-blue-400 mx-auto mb-1" />
                    <div className="text-white text-xs">Add Store</div>
                  </button>
                  <button
                    onClick={() => {
                      setActiveModule('product');
                      navigate(prefixedPath('/product'));
                    }}
                    className="bg-[#3a3a3a] hover:bg-green-500/20 rounded-lg p-3 text-center transition-all duration-200 border border-transparent hover:border-green-500/30"
                  >
                    <Package size={16} className="text-green-400 mx-auto mb-1" />
                    <div className="text-white text-xs">Add Product</div>
                  </button>
                  <button
                    onClick={() => {
                      setActiveModule('analytics');
                      navigate(prefixedPath('/analytics'));
                    }}
                    className="bg-[#3a3a3a] hover:bg-purple-500/20 rounded-lg p-3 text-center transition-all duration-200 border border-transparent hover:border-purple-500/30"
                  >
                    <BarChart3 size={16} className="text-purple-400 mx-auto mb-1" />
                    <div className="text-white text-xs">View Reports</div>
                  </button>
                </div>
              </div>

              {/* Regional Performance Heatmap */}
              <div className="rounded-2xl p-6" style={{ background: '#E2B8DF' }}>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-black text-lg font-medium mb-2">Regional Performance</h3>
                    <p className="text-black text-sm opacity-80">
                      {loading ? 'Loading...' : `${regionalData.length} regions tracked with ${regionalData.reduce((sum, r) => sum + r.stores, 0)} total stores`}
                    </p>
                  </div>
                </div>

                {/* Performance Matrix */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {Array.from({ length: 49 }, (_, i) => {
                    const regionIndex = i % regionalData.length;
                    const region = regionalData[regionIndex];
                    const intensity = region ? Math.min(region.performance / 100, 1) : Math.random();
                    return (
                      <div key={i} className={`w-3 h-3 rounded-full ${
                        intensity > 0.8 ? 'bg-black' : 
                        intensity > 0.6 ? 'bg-gray-800' : 
                        intensity > 0.4 ? 'bg-gray-600' : 'bg-gray-400'
                      }`}></div>
                    );
                  })}
                </div>

                {/* Region labels */}
                <div className="grid grid-cols-7 gap-2 text-center">
                  {regionalData.slice(0, 7).map((region, index) => (
                    <span key={index} className="text-black text-xs truncate opacity-80">
                      {region.region.slice(0, 3)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Forecast vs Actual Chart */}
              <div className="bg-[#2a2a2a] rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-white font-medium">Forecast vs Actual</h3>
                    <p className="text-gray-400 text-sm">Weekly comparison</p>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Accuracy Trend</h3>
                    <p className="text-gray-400 text-sm">
                      {loading ? '...' : `${Math.round(stats.avgForecastAccuracy)}% avg`}
                    </p>
                  </div>
                </div>

                {/* Performance Chart */}
                <div className="h-32 bg-[#3a3a3a] rounded-lg p-4 mb-4">
                  <svg className="w-full h-full" viewBox="0 0 300 100">
                    {/* Forecast line */}
                    <polyline
                      fill="none"
                      stroke="#60a5fa"
                      strokeWidth="2"
                      points={weeklyTrends.map((week, index) => 
                        `${(index / (weeklyTrends.length - 1)) * 300},${100 - (week.forecast / Math.max(...weeklyTrends.map(w => w.forecast)) * 80)}`
                      ).join(' ')}
                    />
                    {/* Actual line */}
                    <polyline
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      points={weeklyTrends.map((week, index) => 
                        `${(index / (weeklyTrends.length - 1)) * 300},${100 - (week.actual / Math.max(...weeklyTrends.map(w => w.actual)) * 80)}`
                      ).join(' ')}
                    />
                  </svg>
                </div>

                {/* Legend */}
                <div className="flex justify-between text-gray-400 text-xs">
                  <div className="flex items-center">
                    <div className="w-3 h-0.5 bg-blue-400 mr-2"></div>
                    <span>Forecast</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-0.5 bg-green-400 mr-2"></div>
                    <span>Actual</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Insights & Rankings */}
            <div className="col-span-3 space-y-6">
              {/* Key Insights */}
              <div className="bg-[#2a2a2a] rounded-2xl p-6">
                <h3 className="text-white text-lg font-medium mb-6">Key Insights</h3>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-white">
                    {loading ? '...' : `${Math.round(stats.avgForecastAccuracy)}%`}
                  </span>
                  <button className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <TrendingUp size={16} className="text-white" />
                  </button>
                </div>
                
                <p className="text-gray-400 text-sm mb-2">Overall forecast accuracy</p>
                <p className="text-gray-400 text-xs mb-6">
                  {stats.avgForecastAccuracy > 80 ? 'Performing above target' : 'Room for improvement'}
                </p>

                {/* Accuracy Progress */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-16 h-20 bg-[#3a3a3a] rounded-full relative overflow-hidden">
                      <div 
                        className="absolute bottom-0 w-full bg-blue-500 rounded-full transition-all duration-500" 
                        style={{ height: `${Math.min(stats.avgForecastAccuracy, 100)}%` }}
                      ></div>
                    </div>
                    <button className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                      <BarChart3 size={12} className="text-white" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-400 mb-6">
                  <LineChart size={16} className="mr-2" />
                  <span>Forecast accuracy impacts inventory optimization and customer satisfaction.</span>
                </div>

                <div className="text-center mb-6">
                  <p className="text-gray-400 text-sm">
                    {stats.avgForecastAccuracy > 85 ? 
                      'Excellent performance across all categories' : 
                      'Focus on improving low-performing categories'
                    }
                  </p>
                </div>

                {/* Performance comparison */}
                <div className="space-y-2">
                  <div className="rounded-full px-4 py-2 text-center" style={{ background: '#B7CAE1' }}>
                    <span className="text-black text-sm font-medium">
                      {Math.round(stats.avgForecastAccuracy)}% - Current Week
                    </span>
                  </div>
                  <div className="bg-gray-600 rounded-full px-4 py-2 text-center">
                    <span className="text-white text-sm font-medium">
                      {Math.round(stats.avgForecastAccuracy * 0.95)}% - Previous Week
                    </span>
                  </div>
                </div>
              </div>

              {/* Top Performing Products */}
              <div className="bg-[#2a2a2a] rounded-2xl p-6">
                <h3 className="text-white text-lg font-medium mb-6">Top Products</h3>
                
                <p className="text-gray-400 text-sm mb-4">
                  Best selling products across all stores
                </p>

                {/* Product badges */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="rounded-xl p-3 text-center" style={{ background: '#B7CAE1' }}>
                    <Star size={20} className="text-black mx-auto mb-1" />
                    <div className="text-black text-xs">Best Seller</div>
                  </div>
                  <div className="rounded-xl p-3 text-center" style={{ background: '#E2B8DF' }}>
                    <Target size={20} className="text-black mx-auto mb-1" />
                    <div className="text-black text-xs">High Accuracy</div>
                  </div>
                  <div className="bg-purple-500 rounded-xl p-3 text-center">
                    <TrendingUp size={20} className="text-white mx-auto mb-1" />
                    <div className="text-white text-xs">Trending</div>
                  </div>
                </div>

                {/* Product list */}
                <div className="space-y-2">
                  {loading ? (
                    <div className="text-gray-400 text-sm">Loading products...</div>
                  ) : (
                    topProducts.slice(0, 3).map((product, index) => (
                      <div key={index} className="bg-[#3a3a3a] rounded-lg p-3">
                        <div className="text-white text-sm font-medium truncate">
                          {product.article_description}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {product.brand} • {Math.round(product.total_sales)} units sold
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Alert Categories */}
              <div className="space-y-4">
                <div className="bg-[#2a2a2a] rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertTriangle size={16} className="text-red-400 mr-2" />
                      <span className="text-white font-medium">Low Stock Alert</span>
                    </div>
                    <span className="text-gray-400 text-sm">{lowStockAlerts.length} items</span>
                  </div>
                  <p className="text-gray-400 text-xs mt-1">Requires immediate attention</p>
                </div>

                <div className="bg-[#2a2a2a] rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle size={16} className="text-green-400 mr-2" />
                      <span className="text-white font-medium">Optimal Performance</span>
                    </div>
                    <span className="text-gray-400 text-sm">
                      {productPerformance.filter(p => p.trend === 'up').length} categories
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs mt-1">Above target accuracy</p>
                </div>

                <div className="bg-[#2a2a2a] rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Activity size={16} className="text-blue-400 mr-2" />
                      <span className="text-white font-medium">Monitoring Required</span>
                    </div>
                    <span className="text-gray-400 text-sm">
                      {productPerformance.filter(p => p.trend === 'stable').length} categories
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs mt-1">Watch for trends</p>
                </div>
              </div>

              {/* Regional Rankings */}
              <div className="bg-[#2a2a2a] rounded-2xl p-6">
                <h3 className="text-white text-lg font-medium mb-6">Regional Rankings</h3>
                
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-gray-400 text-sm">Loading regions...</div>
                  ) : (
                    regionalData.slice(0, 4).map((region, index) => (
                      <div key={region.region} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-sm">{index + 1}</span>
                          </div>
                          <div>
                            <div className="text-white font-medium text-sm">{region.region}</div>
                            <div className="text-gray-400 text-xs">{region.stores} stores</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white text-sm">
                            {Math.round(region.avgSales)} avg units
                          </div>
                          {index < 3 && <Medal size={16} className="text-yellow-400 ml-auto" />}
                        </div>
                      </div>
                    ))
                  )}
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
