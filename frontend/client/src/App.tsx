import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Switch, Route, useLocation } from "wouter";
import Home from "./pages/Home";
import NotFound from "@/pages/not-found";
import { WorkspaceProvider } from "./context/WorkspaceProvider";
import { ThemeProvider } from "./context/ThemeProvider";
import { AgentProvider } from "./context/AgentProvider";
import TopBar from "./components/ui/TopBar";
import React, { useState, useEffect } from 'react';
import { ForecastRepository } from './repository/forecast_repository';

const App: React.FC = () => {
  const [location] = useLocation();
  
  // State for forecast metadata
  const [forecastMetadata, setForecastMetadata] = useState<any>(null);
  const [metadataLoading, setMetadataLoading] = useState<boolean>(false);
  const [metadataError, setMetadataError] = useState<string | null>(null);
  
  // Get the app prefix from environment variables
  const APP_PREFIX = import.meta.env.VITE_APP_PREFIX || '';
  const prefixedPath = (path: string) => APP_PREFIX ? `/${APP_PREFIX}${path}` : path;
  
  // Initialize forecast repository
  console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);
  console.log('App Prefix:', APP_PREFIX);
  const forecastRepo = new ForecastRepository(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000');
  
  // Load metadata on app start
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const stateSetters = {
          setLoading: setMetadataLoading,
          setError: setMetadataError,
          setData: setForecastMetadata
        };
        
        await forecastRepo.getMetadata({}, stateSetters);
      } catch (error) {
        console.error('Failed to load forecast metadata on app start:', error);
      }
    };
    
    loadMetadata();
  }, []);
  
  // Extract module from the current location, handling the app prefix
  const getModuleFromPath = (path: string) => {
    // Remove the app prefix from the path if it exists
    let cleanPath = path;
    if (APP_PREFIX && path.startsWith(`/${APP_PREFIX}`)) {
      cleanPath = path.substring(`/${APP_PREFIX}`.length) || '/';
    }
    
    if (cleanPath === '/') return 'home';
    // if (cleanPath.startsWith('/chat')) return 'chat';
    // if (cleanPath.startsWith('/docs')) return 'docs';
    // if (cleanPath.startsWith('/code')) return 'code';
    if (cleanPath.startsWith('/store')) return 'store';
    if (cleanPath.startsWith('/product')) return 'product';
    if (cleanPath.startsWith('/inventory')) return 'inventory';
    if (cleanPath.startsWith('/forecast')) return 'forecast';
    if (cleanPath.startsWith('/analytics')) return 'analytics';
    // if (cleanPath.startsWith('/organization')) return 'organization';
    // if (cleanPath.startsWith('/chart')) return 'chart';
    // if (cleanPath.startsWith('/budget')) return 'budget';
    if (cleanPath.startsWith('/settings')) return 'settings';
    return 'home';
  };

  const activeModule = getModuleFromPath(location);

  return (
    <ThemeProvider>
      <WorkspaceProvider>
        <AgentProvider>
          <TooltipProvider>
            <TopBar />
            <div className="pt-10">
              <Toaster />
              <Switch>
                {/* Home route will render with the module extracted from the URL */}
                <Route path={prefixedPath("/")} component={() => <Home initialModule={activeModule} />} />
                {/* <Route path={prefixedPath("/chat")} component={() => <Home initialModule="chat" />} /> */}
                {/* <Route path={prefixedPath("/docs")} component={() => <Home initialModule="docs" />} /> */}
                {/* <Route path={prefixedPath("/code")} component={() => <Home initialModule="code" />} /> */}
                <Route path={prefixedPath("/store")} component={() => <Home initialModule="store" />} />
                <Route path={prefixedPath("/product")} component={() => <Home initialModule="product" />} />
                <Route path={prefixedPath("/inventory")} component={() => <Home initialModule="inventory" />} />
                <Route path={prefixedPath("/forecast")} component={() => <Home initialModule="forecast" />} />
                <Route path={prefixedPath("/analytics")} component={() => <Home initialModule="analytics" />} />
                {/* <Route path={prefixedPath("/organization")} component={() => <Home initialModule="organization" />} /> */}
                {/* <Route path={prefixedPath("/chart")} component={() => <Home initialModule="chart" />} /> */}
                {/* <Route path={prefixedPath("/budget")} component={() => <Home initialModule="budget" />} /> */}
                {/* <Route path={prefixedPath("/task")} component={() => <Home initialModule="task" />} /> */}
                <Route path={prefixedPath("/settings")} component={() => <Home initialModule="settings" />} />
                <Route component={NotFound} />
              </Switch>
            </div>
          </TooltipProvider>
        </AgentProvider>
      </WorkspaceProvider>
    </ThemeProvider>
  );
};

export default App;
