import { useEffect, useState } from "react";
import { useWorkspace } from "@/context/WorkspaceProvider";
import { useAgent } from "@/context/AgentProvider";
import { useProject } from "@/context/ProjectProvider";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/ui/TopBar";
import { AgentPanel } from "@/components/agent/AgentPanel";
import SidebarSplitter from "@/components/shared/SidebarSplitter";
import ChatModule from "@/components/chat/ChatModule";
import DocumentationModule from "@/components/documentation/DocumentationModule";
import CodeModule from "@/components/code/CodeModule";
import TaskModule from "@/components/task/TaskModule";
import OrganizationModule from "@/components/organization/OrganizationModule";
import StoreModule from "@/components/store/StoreModule";
import ProductModule from "@/components/store/ProductModule";
import ForecastModule from "@/components/forecast/ForecastModule";
import AnalyticsModule from "@/components/analytics/AnalyticsModule";
import InventoryModule from "@/components/inventory/InventoryModule";
import GetStartedModule from "@/components/onboarding/GetStartedModule";
import { Module } from "@/types";
import CommandPalette from "@/components/CommandPalette";
import { useCommandPalette } from "@/hooks/useCommandPalette";
import { useLocation } from "wouter";
import Loader from "@/components/ui/Loader";
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
import india from "@svg-maps/india";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HomeProps {
  initialModule?: Module;
  initialSlug?: string;
}

interface DashboardStats {
  totalStores: number;
  totalProducts: number;
  totalForecasts: number;
  avgForecastImprovement: number;
  totalSales: number;
  avgInventoryTurnover: number;
  avgSegmentAccuracy: number;
  avgBrandAccuracy: number;
  avgSuperCategoryAccuracy: number;
  avgRegionAccuracy: number;
  avgStateAccuracy: number;
  avgStoreAccuracy: number;
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

interface StateForecastData {
  state: string;
  totalForecast: number;
  totalActual: number;
  accuracy: number;
  storeCount: number;
}

interface ReplenishmentData {
  superCategory: string;
  region: string;
  forecastQty: number;
  inventory: number;
  replenishment: number;
}

export default function Home({ initialModule, initialSlug }: HomeProps) {
  const { selectedProject, setSelectedProject, projectToSlug } = useProject();
  const { activeModule, setActiveModule } = useWorkspace();
  const { isAgentPanelOpen, panelWidth, setPanelWidth, isResizing, setIsResizing } = useAgent();
  const { isOpen, close } = useCommandPalette();
  const [, navigate] = useLocation();
  const [stats, setStats] = useState<DashboardStats>({ 
    totalStores: 0, 
    totalProducts: 0, 
    totalForecasts: 0, 
    avgForecastImprovement: 0,
    totalSales: 0,
    avgInventoryTurnover: 0,
    avgSegmentAccuracy: 0,
    avgBrandAccuracy: 0,
    avgSuperCategoryAccuracy: 0,
    avgRegionAccuracy: 0,
    avgStateAccuracy: 0,
    avgStoreAccuracy: 0
  });
  const [regionalData, setRegionalData] = useState<RegionalData[]>([]);
  const [productPerformance, setProductPerformance] = useState<ProductPerformance[]>([]);
  const [weeklyTrends, setWeeklyTrends] = useState<WeeklyTrend[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [lowStockAlerts, setLowStockAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stateForecastData, setStateForecastData] = useState<StateForecastData[]>([]);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [newestDate, setNewestDate] = useState<string>('');
  
  // Month selection state
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [loadingMonths, setLoadingMonths] = useState(false);
  
  // Replenishment data state
  const [replenishmentData, setReplenishmentData] = useState<ReplenishmentData[]>([]);
  const [loadingReplenishment, setLoadingReplenishment] = useState(false);

  // Get the app prefix from environment variables
  const APP_PREFIX = import.meta.env.VITE_APP_PREFIX || '';
  const prefixedPath = (path: string) => APP_PREFIX ? `/${APP_PREFIX}${path}` : path;

  const forecastRepo = new ForecastRepository(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000', selectedProject);
  
  // Set the active module from the URL when the component mounts
  useEffect(() => {
    if (initialModule && initialModule !== activeModule) {
      setActiveModule(initialModule);
    }
  }, [initialModule, activeModule, setActiveModule]);

  // Redirect to get-started if in get-started mode and trying to access other modules
  useEffect(() => {
    const projectConfig = selectedProject === 'Reliance Jewels' ? { stage: 'get-started' } : { stage: 'post-get-started' };
    
    // If in get-started mode and not on get-started module, redirect
    if (projectConfig.stage === 'get-started' && activeModule !== 'get-started') {
      const slug = projectToSlug(selectedProject);
      navigate(prefixedPath(`/${slug}/get-started`));
      setActiveModule('get-started');
    }
  }, [selectedProject, activeModule, navigate, prefixedPath, setActiveModule]);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Load available months when component mounts
  useEffect(() => {
    loadAvailableMonths();
  }, []);

  // Reload state forecast data when selected month changes
  useEffect(() => {
    if (selectedMonth) {
      loadStateForecastData();
      loadReplenishmentData();
    }
  }, [selectedMonth]);

  // Splitter resize handlers
  const handleResizeStart = () => {
    setIsResizing(true);
  };

  const handleResize = (clientX: number) => {
    if (!isAgentPanelOpen) return;
    const windowWidth = window.innerWidth;
    const newWidth = windowWidth - clientX;
    setPanelWidth(newWidth);
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
  };

  const loadAvailableMonths = async () => {
    try {
      setLoadingMonths(true);
      
      const query = `
        SELECT DISTINCT week_start_date 
        FROM forecast 
        WHERE week_start_date IS NOT NULL 
        ORDER BY week_start_date DESC
      `;
      
      const result = await forecastRepo.executeSqlQuery({ sql_query: query }, {
        setLoading: () => {}, setError: () => {}, setData: () => {}
      });
      
      if (result?.data) {
        const months = result.data.map((row: any) => row.week_start_date);
        setAvailableMonths(months);
        
        // Set the first (most recent) month as selected by default
        if (months.length > 0 && !selectedMonth) {
          setSelectedMonth(months[0]);
        }
      }
    } catch (error) {
      console.error('Error loading available months:', error);
    } finally {
      setLoadingMonths(false);
    }
  };

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
        // Total sales volume for the most recent month
        "SELECT SUM(sold_qty) as total_sales FROM forecast WHERE sold_qty > 0 AND month_year = (SELECT MAX(month_year) FROM forecast WHERE month_year IS NOT NULL)"
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
        avgForecastImprovement: 85, // Mock value for now
        avgInventoryTurnover: 4.2, // Mock value for now
        avgSegmentAccuracy: 0,
        avgBrandAccuracy: 0,
        avgSuperCategoryAccuracy: 0,
        avgRegionAccuracy: 0,
        avgStateAccuracy: 0,
        avgStoreAccuracy: 0
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

      // Load state-level forecast data
      await loadStateForecastData();

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
          (1 - (SUM(ABS(sold_qty - forecast_qty))/SUM(sold_qty)))*100 as performance
        FROM forecast 
        WHERE region IS NOT NULL AND sold_qty > 0 AND forecast_qty > 0
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
          (1 - (SUM(ABS(sold_qty - forecast_qty))/SUM(sold_qty)))*100 as forecast_accuracy,
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
          (1 - (SUM(ABS(sold_qty - forecast_qty))/SUM(sold_qty)))*100 as accuracy
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

  const loadReplenishmentData = async () => {
    try {
      setLoadingReplenishment(true);
      
      // Use selected month if available, otherwise get the newest date
      let targetDate = selectedMonth;
      
      if (!targetDate) {
        const dateQuery = `
          SELECT MAX(week_start_date) as newest_date
          FROM forecast 
          WHERE week_start_date IS NOT NULL
        `;
        
        const dateResult = await forecastRepo.executeSqlQuery({ sql_query: dateQuery }, {
          setLoading: () => {}, setError: () => {}, setData: () => {}
        });
        
        if (dateResult?.data?.[0]?.newest_date) {
          targetDate = dateResult.data[0].newest_date;
        }
      }

      // Get replenishment data grouped by super_category and region
      const query = `
        SELECT 
          super_category,
          region,
          SUM(forecast_qty) as forecast_qty
        FROM forecast 
        WHERE super_category IS NOT NULL AND region IS NOT NULL AND forecast_qty > 0
        ${targetDate ? `AND week_start_date = '${targetDate}'` : ''}
        GROUP BY super_category, region
        ORDER BY forecast_qty DESC
        LIMIT 20
      `;
      
      const result = await forecastRepo.executeSqlQuery({ sql_query: query }, {
        setLoading: () => {}, setError: () => {}, setData: () => {}
      });
      
      if (result?.data) {
        const replenishmentData: ReplenishmentData[] = result.data.map((row: any) => {
          const forecastQty = parseFloat(row.forecast_qty) || 0;
          const inventory = Math.floor(Math.random() * forecastQty); // Random inventory between 0 and forecast_qty
          const replenishment = forecastQty - inventory;
          
          return {
            superCategory: row.super_category,
            region: row.region,
            forecastQty,
            inventory,
            replenishment
          };
        });
        
        // Sort by replenishment in descending order
        replenishmentData.sort((a, b) => b.replenishment - a.replenishment);
        
        setReplenishmentData(replenishmentData);
      }
    } catch (error) {
      console.error('Error loading replenishment data:', error);
    } finally {
      setLoadingReplenishment(false);
    }
  };

  const loadStateForecastData = async () => {
    try {
      // Use selected month if available, otherwise get the newest date
      let targetDate = selectedMonth;
      
      if (!targetDate) {
        const dateQuery = `
          SELECT MAX(week_start_date) as newest_date
          FROM forecast 
          WHERE week_start_date IS NOT NULL
        `;
        
        const dateResult = await forecastRepo.executeSqlQuery({ sql_query: dateQuery }, {
          setLoading: () => {}, setError: () => {}, setData: () => {}
        });
        
        if (dateResult?.data?.[0]?.newest_date) {
          targetDate = dateResult.data[0].newest_date;
          setNewestDate(targetDate);
        }
      } else {
        setNewestDate(targetDate);
      }

      // Then get state-level data for the selected date
      const query = `
        SELECT 
          state,
          SUM(forecast_qty) as total_forecast,
          SUM(sold_qty) as total_actual,
          (1 - (SUM(ABS(sold_qty - forecast_qty))/SUM(sold_qty)))*100 as accuracy,
          COUNT(DISTINCT store_no) as store_count
        FROM forecast 
        WHERE state IS NOT NULL AND sold_qty > 0 AND forecast_qty > 0
        ${targetDate ? `AND week_start_date = '${targetDate}'` : ''}
        GROUP BY state
        ORDER BY total_forecast DESC
      `;
      
      const result = await forecastRepo.executeSqlQuery({ sql_query: query }, {
        setLoading: () => {}, setError: () => {}, setData: () => {}
      });
      
      if (result?.data) {
        setStateForecastData(result.data.map((row: any) => ({
          state: row.state,
          totalForecast: row.total_forecast,
          totalActual: row.total_actual,
          accuracy: row.accuracy,
          storeCount: row.store_count
        })));
        
        // Debug logging
        console.log('State forecast data loaded:', result.data);
        console.log('Mapped data:', result.data.map((row: any) => ({
          state: row.state,
          totalForecast: row.total_forecast,
          totalActual: row.total_actual,
          accuracy: row.accuracy,
          storeCount: row.store_count,
          mappedId: mapStateNameToId(row.state)
        })));
      }
    } catch (error) {
      console.error('Error loading state forecast data:', error);
    }
  };

  // Map database state names to SVG map IDs
  const mapStateNameToId = (stateName: string): string => {
    const stateMapping: { [key: string]: string } = {
      'Andhra Pradesh': 'ap',
      'Arunachal Pradesh': 'ar',
      'Assam': 'as',
      'Bihar': 'br',
      'Chattisgarh': 'ct',
      'Delhi': 'dl',
      'Goa': 'ga',
      'Gujarat': 'gj',
      'Haryana': 'hr',
      'Himachal Pradesh': 'hp',
      'Jammu And Kashmir': 'jk',
      'Jharkhand': 'jh',
      'Karnataka': 'ka',
      'Kerala': 'kl',
      'Madhya Pradesh': 'mp',
      'Maharashtra': 'mh',
      'Meghalaya': 'ml',
      'Mizoram': 'mz',
      'Nagaland': 'nl',
      'Orissa': 'or',
      'Pondicherry': 'py',
      'Punjab': 'pb',
      'Rajasthan': 'rj',
      'Sikkim': 'sk',
      'Tamil Nadu': 'tn',
      'Telangana': 'tg',
      'Tripura': 'tr',
      'Uttarakhand': 'ut',
      'Uttar Pradesh': 'up',
      'West Bengal': 'wb'
    };
    return stateMapping[stateName] || '';
  };

  // Get forecast data for a specific state
  const getStateData = (stateName: string) => {
    return stateForecastData.find(data => data.state === stateName);
  };

  // Get color based on forecast quantity
  const getStateColor = (forecastQty: number): string => {
    if (forecastQty >= 50000) return '#065f46'; // Dark green for high forecast volume
    if (forecastQty >= 20000) return '#047857'; // Medium-dark green for medium-high forecast volume
    if (forecastQty >= 5000) return '#10b981'; // Medium green for medium forecast volume
    if (forecastQty >= 1000) return '#34d399'; // Light green for low forecast volume
    return '#a7f3d0'; // Very light green for very low forecast volume
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
      action: () => navigate(prefixedPath(`/${projectToSlug(selectedProject)}`)) 
    },
    { 
      id: 'goto-store', 
      name: 'Go to Store Master', 
      shortcut: '⌘1', 
      action: () => navigate(prefixedPath(`/${projectToSlug(selectedProject)}/store`)) 
    },
    { 
      id: 'goto-product', 
      name: 'Go to Product Master', 
      shortcut: '⌘2', 
      action: () => navigate(prefixedPath(`/${projectToSlug(selectedProject)}/product`)) 
    },
    { 
      id: 'goto-inventory', 
      name: 'Go to Inventory & Orders', 
      shortcut: '⌘3', 
      action: () => navigate(prefixedPath(`/${projectToSlug(selectedProject)}/inventory`)) 
    },
    { 
      id: 'goto-forecast', 
      name: 'Go to Forecast', 
      shortcut: '⌘4', 
      action: () => navigate(prefixedPath(`/${projectToSlug(selectedProject)}/forecast`)) 
    },
    { 
      id: 'goto-analytics', 
      name: 'Go to Analytics', 
      shortcut: '⌘5', 
      action: () => navigate(prefixedPath(`/${projectToSlug(selectedProject)}/analytics`)) 
    },
    
    // Action commands
    { 
      id: 'settings', 
      name: 'Open Settings', 
      shortcut: '⌘,', 
      action: () => navigate(prefixedPath(`/${projectToSlug(selectedProject)}/settings`)) 
    }
  ];



  return (
    <>
      <TopBar />
      <div className="h-[calc(100vh-3rem)] flex overflow-hidden bg-[hsl(var(--dashboard-background))]">
        <Sidebar />
        {activeModule !== "home" ? (
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
            ) : activeModule === "inventory" ? (
              <InventoryModule />
            ) : activeModule === "get-started" ? (
              <GetStartedModule />
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-bold mb-4">This module is under development</h1>
                  <p className="text-muted-foreground">Please check back later</p>
                </div>
              </div>
            )}
            {/* Agent Panel with Splitter */}
            {isAgentPanelOpen && (
              <>
                <SidebarSplitter
                  onResizeStart={handleResizeStart}
                  onResize={handleResize}
                  onResizeEnd={handleResizeEnd}
                />
                <AgentPanel />
              </>
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-auto bg-[hsl(var(--dashboard-background))] p-4 md:p-6">
            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 h-full">
              {/* Left Column - Inventory & Performance */}
              <div className="lg:col-span-3 space-y-4 md:space-y-6">
                {/* Month Selector above Overview */}
                <div className="w-full mb-2">
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-full h-8 p-5 text-xs bg-[hsl(var(--dashboard-card-background))] border-[hsl(var(--dashboard-card-border))] hover:bg-[hsl(var(--dashboard-card-hover))]" style={{borderRadius: '5px'}}>
                      <SelectValue placeholder={loadingMonths ? <Loader size="sm" /> : "Month"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableMonths.map((month) => (
                        <SelectItem key={month} value={month}>
                          {new Date(month).toLocaleDateString('en-US', { 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Inventory Overview */}
                <div className="bg-[hsl(var(--dashboard-card-background))] rounded-2xl p-4 md:p-6 border border-[hsl(var(--dashboard-card-border))]">
                  <h3 className="text-[hsl(var(--dashboard-card-foreground))] text-base md:text-lg font-medium mb-4 md:mb-6">Overview</h3>
                  
                  {/* Total Products */}
                  <div className="mb-4 md:mb-6">
                    <div className="flex items-center mb-2">
                      <Package size={16} className="text-[hsl(var(--dashboard-primary-blue))] mr-2" />
                      <span className="text-[hsl(var(--dashboard-card-foreground))] text-xs md:text-sm">Total Products in Catalog</span>
                    </div>
                    <div className="text-[hsl(var(--dashboard-card-foreground))] text-base md:text-lg font-medium">
                      {loading ? <Loader size="sm" className="text-[hsl(var(--dashboard-muted-foreground))]" /> : stats.totalProducts.toLocaleString()}
                    </div>
                  </div>

                  {/* Total Sales */}
                  <div className="mb-4 md:mb-6">
                    <div className="flex items-center mb-2">
                      <span className="text-[hsl(var(--dashboard-card-foreground))] text-xs md:text-sm">Total Sales Volume in the Selected Month</span>
                    </div>
                    <div className="text-[hsl(var(--dashboard-card-foreground))] text-base md:text-lg font-medium">
                      {loading ? <Loader size="sm" className="text-[hsl(var(--dashboard-muted-foreground))]" /> : `${Math.round(stats.totalSales).toLocaleString()}`}
                    </div>
                  </div>



                  {/* Stats Row */}
                  <div className="grid grid-cols-1 gap-2 md:gap-4">
                    <div className="bg-[hsl(var(--dashboard-accent-background))] rounded-xl p-3 md:p-4 text-center border border-[hsl(var(--dashboard-card-border))]">
                      <Target size={20} className="text-[hsl(var(--dashboard-muted-foreground))] mx-auto mb-2" />
                      <div className="text-lg md:text-2xl font-bold text-[hsl(var(--dashboard-card-foreground))]">
                        {Math.round(stats.avgForecastImprovement)}
                      </div>
                      <div className="text-[hsl(var(--dashboard-muted-foreground))] text-xs">Accuracy in Super Categories</div>
                    </div>
                    <div className="bg-[hsl(var(--dashboard-accent-background))] rounded-xl p-3 md:p-4 text-center border border-[hsl(var(--dashboard-card-border))]">
                      <Store size={20} className="text-[hsl(var(--dashboard-muted-foreground))] mx-auto mb-2" />
                      <div className="text-lg md:text-2xl font-bold text-[hsl(var(--dashboard-card-foreground))]">{stats.totalStores}</div>
                      <div className="text-[hsl(var(--dashboard-muted-foreground))] text-xs">Active Stores</div>
                    </div>
                    <div className="bg-[hsl(var(--dashboard-accent-background))] rounded-xl p-3 md:p-4 text-center border border-[hsl(var(--dashboard-card-border))]">
                      <Truck size={20} className="text-[hsl(var(--dashboard-muted-foreground))] mx-auto mb-2" />
                      <div className="text-lg md:text-2xl font-bold text-[hsl(var(--dashboard-card-foreground))]">
                        {Math.round(stats.totalSales / stats.totalStores)}
                      </div>
                      <div className="text-[hsl(var(--dashboard-muted-foreground))] text-xs">Average Sales per Store</div>
                    </div>
                  </div>
                </div>

                {/* Top Performing Products */}
                <div className="bg-[hsl(var(--dashboard-card-background))] rounded-2xl p-4 md:p-6 border border-[hsl(var(--dashboard-card-border))]">
                  <div className="flex items-center mb-4 md:mb-6">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-[hsl(var(--dashboard-primary-green))] rounded-full flex items-center justify-center mr-3">
                      <Trophy size={16} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-[hsl(var(--dashboard-card-foreground))] text-sm md:text-base font-medium">Products with Highest Predicted Sales</h3>
                    </div>
                  </div>
                  
                  <div className="space-y-3 md:space-y-4">
                    {loading ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader size="sm" className="text-[hsl(var(--dashboard-muted-foreground))]" />
                      </div>
                    ) : (
                      topProducts.slice(0, 4).map((product, index) => (
                        <div key={index} className="flex items-center justify-between p-2 md:p-3 bg-[hsl(var(--dashboard-accent-background))] rounded-lg border border-[hsl(var(--dashboard-card-border))]">
                          <div className="flex items-center">
                            <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mr-2 md:mr-3 ${
                              index === 0 ? 'bg-[hsl(var(--dashboard-warning))]' : 
                              index === 1 ? 'bg-[hsl(var(--dashboard-chart-grid))]' : 
                              index === 2 ? 'bg-[hsl(var(--dashboard-primary-orange))]' : 'bg-[hsl(var(--dashboard-muted-foreground))]'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <div className="text-[hsl(var(--dashboard-card-foreground))] text-xs md:text-sm font-medium">
                                {product.article_description && product.article_description.length > 15 ? 
                                  `${product.article_description.substring(0, 15)}...` : 
                                  product.article_description || 'Unknown Product'}
                              </div>
                              <div className="text-[hsl(var(--dashboard-muted-foreground))] text-xs">
                                {product.brand || 'Unknown Brand'}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-[hsl(var(--dashboard-success))] text-xs md:text-sm font-bold">
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
              </div>

              {/* Center Column - Trends & Analytics */}
              <div className="lg:col-span-6 space-y-4 md:space-y-6">
              

                {/* India State-Level Forecast Map */}
                <div className="bg-[hsl(var(--dashboard-card-background))] rounded-2xl p-4 md:p-6 border border-[hsl(var(--dashboard-card-border))]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[hsl(var(--dashboard-card-foreground))] text-sm md:text-base font-medium">State-Level Forecast</h3>
                  </div>

                  {/* India Map */}
                  <div className="relative h-96 md:h-[500px] bg-[hsl(var(--dashboard-chart-background))] rounded-lg p-3 md:p-4 mb-3 md:mb-4 border border-[hsl(var(--dashboard-card-border))] overflow-hidden">
                    {loading ? (
                      <div className="flex items-center justify-center h-full">
                        <Loader size="md" className="text-[hsl(var(--dashboard-muted-foreground))]" />
                      </div>
                    ) : (
                      <div className="relative w-full h-full">
                        <svg
                          viewBox={india.viewBox}
                          className="w-full h-full"
                          style={{ maxWidth: '100%', maxHeight: '100%' }}
                        >
                          {india.locations.map((location) => {
                            // Find matching state data
                            const stateData = stateForecastData.find(data => 
                              mapStateNameToId(data.state) === location.id
                            );
                            
                            const fillColor = stateData 
                              ? getStateColor(stateData.totalForecast)
                              : '#e5e7eb'; // Default gray for states without data

                            // Debug logging for first few locations
                            if (stateForecastData.length > 0 && Math.random() < 0.1) {
                              console.log('Location debug:', {
                                locationId: location.id,
                                locationName: location.name,
                                stateData,
                                fillColor,
                                forecastQty: stateData?.totalForecast,
                                allStates: stateForecastData.map(d => d.state)
                              });
                            }

                            return (
                              <path
                                key={location.id}
                                d={location.path}
                                fill={fillColor}
                                stroke="#ffffff"
                                strokeWidth="0.5"
                                className="transition-all duration-200 hover:stroke-2 cursor-pointer"
                                onMouseEnter={(e) => {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  setSelectedState(location.name);
                                }}
                                onMouseLeave={() => setSelectedState(null)}
                                style={{
                                  filter: selectedState === location.name ? 'brightness(1.2)' : 'none'
                                }}
                              />
                            );
                          })}
                        </svg>
                        
                        {/* Tooltip */}
                        {selectedState && (
                          <div className="absolute top-2 left-2 bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] rounded-lg p-3 shadow-lg z-10 max-w-xs">
                            {(() => {
                              const stateData = stateForecastData.find(data => data.state === selectedState);
                              return stateData ? (
                                <div>
                                  <div className="font-medium text-[hsl(var(--dashboard-card-foreground))] text-xs md:text-sm mb-1">
                                    {selectedState}
                                  </div>
                                  <div className="space-y-1 text-xs">
                                    <div className="flex justify-between">
                                      <span className="text-[hsl(var(--dashboard-muted-foreground))]">Forecast Qty:</span>
                                      <span className="text-[hsl(var(--dashboard-card-foreground))] font-medium">
                                        {Math.round(stateData.totalForecast).toLocaleString()}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-[hsl(var(--dashboard-muted-foreground))]">Accuracy:</span>
                                      <span className="text-[hsl(var(--dashboard-card-foreground))]">
                                        {Math.round(stateData.accuracy)}%
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-[hsl(var(--dashboard-muted-foreground))]">Stores:</span>
                                      <span className="text-[hsl(var(--dashboard-card-foreground))]">{stateData.storeCount}</span>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div className="font-medium text-[hsl(var(--dashboard-card-foreground))] text-xs md:text-sm">
                                    {selectedState}
                                  </div>
                                  <div className="text-[hsl(var(--dashboard-muted-foreground))] text-xs">
                                    No forecast data available
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap justify-between items-center text-[hsl(var(--dashboard-muted-foreground))] text-xs gap-2">
                    <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: '#065f46' }}></div>
                        <span className="ml-1">Highest (50K+)</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: '#047857' }}></div>
                        <span className="ml-1">High (20K-50K)</span>
                    </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: '#10b981' }}></div>
                        <span className="ml-1">Medium (5K-20K)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: '#34d399' }}></div>
                        <span className="ml-1">Low (1K-5K)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: '#a7f3d0' }}></div>
                        <span className="ml-1">Lowest (&lt;1K)</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span>Forecast Quantity</span>
                    </div>
                  </div>
                </div>
                {/* Quick Navigation Links */}
                <div className="bg-[hsl(var(--dashboard-card-background))] rounded-2xl p-4 md:p-6 border border-[hsl(var(--dashboard-card-border))]">
                  <h3 className="text-[hsl(var(--dashboard-card-foreground))] text-base md:text-lg font-medium mb-2">Quick Navigation</h3>
                  <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs md:text-sm mb-4 md:mb-6">
                    Access key modules and tools for retail analytics and forecasting.
                  </p>

                  {/* Navigation Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                    <button
                      onClick={() => {
                        setActiveModule('store');
                        navigate(prefixedPath(`/${projectToSlug(selectedProject)}/store`));
                      }}
                      className="bg-[hsl(var(--dashboard-accent-background))] hover:bg-[hsl(var(--dashboard-card-hover))] rounded-xl p-3 md:p-4 text-left transition-all duration-200 group border border-[hsl(var(--dashboard-card-border))]"
                    >
                      <div className="flex items-center mb-2 md:mb-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-[hsl(var(--dashboard-primary-blue))] rounded-lg flex items-center justify-center mr-3 group-hover:opacity-90 transition-opacity">
                          <Store size={18} className="text-white" />
                        </div>
                        <div>
                          <h4 className="text-[hsl(var(--dashboard-card-foreground))] font-medium text-xs md:text-sm">Store Master</h4>
                          <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs">Manage locations</p>
                        </div>
                      </div>
                      <div className="text-[hsl(var(--dashboard-muted-foreground))] text-xs">
                        {loading ? <Loader size="sm" className="text-[hsl(var(--dashboard-muted-foreground))]" /> : `${stats.totalStores} stores`}
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setActiveModule('product');
                        navigate(prefixedPath(`/${projectToSlug(selectedProject)}/product`));
                      }}
                      className="bg-[hsl(var(--dashboard-accent-background))] hover:bg-[hsl(var(--dashboard-card-hover))] rounded-xl p-3 md:p-4 text-left transition-all duration-200 group border border-[hsl(var(--dashboard-card-border))]"
                    >
                      <div className="flex items-center mb-2 md:mb-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-[hsl(var(--dashboard-primary-green))] rounded-lg flex items-center justify-center mr-3 group-hover:opacity-90 transition-opacity">
                          <Package size={18} className="text-white" />
                        </div>
                        <div>
                          <h4 className="text-[hsl(var(--dashboard-card-foreground))] font-medium text-xs md:text-sm">Product Master</h4>
                          <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs">Browse catalog</p>
                        </div>
                      </div>
                      <div className="text-[hsl(var(--dashboard-muted-foreground))] text-xs">
                        {loading ? <Loader size="sm" className="text-[hsl(var(--dashboard-muted-foreground))]" /> : `${stats.totalProducts.toLocaleString()} products`}
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setActiveModule('forecast');
                        navigate(prefixedPath(`/${projectToSlug(selectedProject)}/forecast`));
                      }}
                      className="bg-[hsl(var(--dashboard-accent-background))] hover:bg-[hsl(var(--dashboard-card-hover))] rounded-xl p-3 md:p-4 text-left transition-all duration-200 group border border-[hsl(var(--dashboard-card-border))]"
                    >
                      <div className="flex items-center mb-2 md:mb-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-[hsl(var(--dashboard-primary-purple))] rounded-lg flex items-center justify-center mr-3 group-hover:opacity-90 transition-opacity">
                          <TrendingUp size={18} className="text-white" />
                        </div>
                        <div>
                          <h4 className="text-[hsl(var(--dashboard-card-foreground))] font-medium text-xs md:text-sm">Forecast</h4>
                          <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs">View predictions</p>
                        </div>
                      </div>
                      <div className="text-[hsl(var(--dashboard-muted-foreground))] text-xs">
                        {loading ? <Loader size="sm" className="text-[hsl(var(--dashboard-muted-foreground))]" /> : `${Math.round(stats.totalForecasts / 1000)}K records`}
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setActiveModule('analytics');
                        navigate(prefixedPath(`/${projectToSlug(selectedProject)}/analytics`));
                      }}
                      className="bg-[hsl(var(--dashboard-accent-background))] hover:bg-[hsl(var(--dashboard-card-hover))] rounded-xl p-3 md:p-4 text-left transition-all duration-200 group border border-[hsl(var(--dashboard-card-border))]"
                    >
                      <div className="flex items-center mb-2 md:mb-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-[hsl(var(--dashboard-primary-orange))] rounded-lg flex items-center justify-center mr-3 group-hover:opacity-90 transition-opacity">
                          <BarChart3 size={18} className="text-white" />
                        </div>
                        <div>
                          <h4 className="text-[hsl(var(--dashboard-card-foreground))] font-medium text-xs md:text-sm">Analytics</h4>
                          <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs">Data insights</p>
                        </div>
                      </div>
                      <div className="text-[hsl(var(--dashboard-muted-foreground))] text-xs">
                        Advanced reports
                      </div>
                    </button>
                  </div>

                  {/* Additional Quick Actions */}
                  <div className="grid grid-cols-3 gap-2 md:gap-3">
                    <button
                      onClick={() => {
                        setActiveModule('store');
                        navigate(prefixedPath(`/${projectToSlug(selectedProject)}/store`));
                      }}
                      className="bg-[hsl(var(--dashboard-accent-background))] hover:bg-[hsl(var(--dashboard-primary-blue))]/20 rounded-lg p-2 md:p-3 text-center transition-all duration-200 border border-transparent hover:border-[hsl(var(--dashboard-primary-blue))]/30"
                    >
                      <Plus size={14} className="text-[hsl(var(--dashboard-primary-blue))] mx-auto mb-1" />
                      <div className="text-[hsl(var(--dashboard-card-foreground))] text-xs">Add Store</div>
                    </button>
                    <button
                      onClick={() => {
                        setActiveModule('product');
                        navigate(prefixedPath(`/${projectToSlug(selectedProject)}/product`));
                      }}
                      className="bg-[hsl(var(--dashboard-accent-background))] hover:bg-[hsl(var(--dashboard-primary-green))]/20 rounded-lg p-2 md:p-3 text-center transition-all duration-200 border border-transparent hover:border-[hsl(var(--dashboard-primary-green))]/30"
                    >
                      <Package size={14} className="text-[hsl(var(--dashboard-primary-green))] mx-auto mb-1" />
                      <div className="text-[hsl(var(--dashboard-card-foreground))] text-xs">Add Product</div>
                    </button>
                    <button
                      onClick={() => {
                        setActiveModule('analytics');
                        navigate(prefixedPath(`/${projectToSlug(selectedProject)}/analytics`));
                      }}
                      className="bg-[hsl(var(--dashboard-accent-background))] hover:bg-[hsl(var(--dashboard-primary-purple))]/20 rounded-lg p-2 md:p-3 text-center transition-all duration-200 border border-transparent hover:border-[hsl(var(--dashboard-primary-purple))]/30"
                    >
                      <BarChart3 size={14} className="text-[hsl(var(--dashboard-primary-purple))] mx-auto mb-1" />
                      <div className="text-[hsl(var(--dashboard-card-foreground))] text-xs">View Reports</div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Insights & Rankings */}
              <div className="lg:col-span-3 space-y-4 md:space-y-6">

                {/* Replenishment Chart */}
                <div className="bg-[hsl(var(--dashboard-card-background))] rounded-2xl p-4 md:p-6 border border-[hsl(var(--dashboard-card-border))]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[hsl(var(--dashboard-card-foreground))] text-sm md:text-base font-medium">Supply Gaps</h3>
                  </div>

                  <div className="space-y-2">
                    {loadingReplenishment ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader size="sm" className="text-[hsl(var(--dashboard-muted-foreground))]" />
                      </div>
                    ) : (
                      replenishmentData.slice(0,15).map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded-lg border border-[hsl(var(--dashboard-card-border))]">
                          <div className="flex-1 min-w-0">
                            <div className="text-[hsl(var(--dashboard-card-foreground))] text-xs font-medium truncate">
                              {item.superCategory}
                            </div>
                            <div className="text-[hsl(var(--dashboard-muted-foreground))] text-xs truncate">
                              {item.region}
                            </div>
                          </div>
                          <div className="text-right ml-3">
                            <div className="text-[hsl(var(--dashboard-primary-blue))] text-xs font-bold">
                              {Math.round(item.replenishment).toLocaleString()}
                            </div>
                            <div className="text-[hsl(var(--dashboard-muted-foreground))] text-xs">
                              {Math.round(item.inventory).toLocaleString()} inv
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

               
              </div>
            </div>
          </div>
        )}
      </div>
      <CommandPalette 
        isOpen={isOpen} 
        onClose={close} 
        commands={commands} 
      />
    </>
  );
}

