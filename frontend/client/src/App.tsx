import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Switch, Route, useLocation } from "wouter";
import Home from "./pages/Home";
import NotFound from "@/pages/not-found";
import { WorkspaceProvider } from "./context/WorkspaceProvider";
import { ThemeProvider } from "./context/ThemeProvider";
import React, { useState, useEffect } from 'react';
import { ForecastRepository } from './repository/forecast_repository';

const App: React.FC = () => {
  const [location] = useLocation();
  
  // State for forecast metadata
  const [forecastMetadata, setForecastMetadata] = useState<any>(null);
  const [metadataLoading, setMetadataLoading] = useState<boolean>(false);
  const [metadataError, setMetadataError] = useState<string | null>(null);
  
  // Initialize forecast repository
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
  
  // Extract module from the current location
  const getModuleFromPath = (path: string) => {
    if (path === '/') return 'home';
    // if (path.startsWith('/chat')) return 'chat';
    // if (path.startsWith('/docs')) return 'docs';
    // if (path.startsWith('/code')) return 'code';
    if (path.startsWith('/store')) return 'store';
    if (path.startsWith('/product')) return 'product';
    if (path.startsWith('/forecast')) return 'forecast';
    if (path.startsWith('/analytics')) return 'analytics';
    // if (path.startsWith('/organization')) return 'organization';
    // if (path.startsWith('/chart')) return 'chart';
    // if (path.startsWith('/budget')) return 'budget';
    if (path.startsWith('/settings')) return 'settings';
    return 'home';
  };

  const activeModule = getModuleFromPath(location);

  return (
    <ThemeProvider>
      <WorkspaceProvider>
        <TooltipProvider>
          <Toaster />
          <Switch>
            {/* Home route will render with the module extracted from the URL */}
            <Route path="/" component={() => <Home initialModule={activeModule} />} />
            {/* <Route path="/chat" component={() => <Home initialModule="chat" />} /> */}
            {/* <Route path="/docs" component={() => <Home initialModule="docs" />} /> */}
            {/* <Route path="/code" component={() => <Home initialModule="code" />} /> */}
            <Route path="/store" component={() => <Home initialModule="store" />} />
            <Route path="/product" component={() => <Home initialModule="product" />} />
            <Route path="/forecast" component={() => <Home initialModule="forecast" />} />
            <Route path="/analytics" component={() => <Home initialModule="analytics" />} />
            {/* <Route path="/organization" component={() => <Home initialModule="organization" />} /> */}
            {/* <Route path="/chart" component={() => <Home initialModule="chart" />} /> */}
            {/* <Route path="/budget" component={() => <Home initialModule="budget" />} /> */}
            {/* <Route path="/task" component={() => <Home initialModule="task" />} /> */}
            <Route path="/settings" component={() => <Home initialModule="settings" />} />
            <Route component={NotFound} />
          </Switch>
        </TooltipProvider>
      </WorkspaceProvider>
    </ThemeProvider>
  );
};

export default App;
