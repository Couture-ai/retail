import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Switch, Route, useLocation } from "wouter";
import Home from "./pages/Home";
import NotFound from "@/pages/not-found";
import { WorkspaceProvider } from "./context/WorkspaceProvider";
import { ThemeProvider } from "./context/ThemeProvider";
import { AgentProvider } from "./context/AgentProvider";
import { ProjectProvider } from "@/context/ProjectProvider";
import React, { useState, useEffect } from 'react';
import { ForecastRepository } from './repository/forecast_repository';
import { Module } from "./types";

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
  const getModuleFromPath = (path: string): Module => {
    // Remove the app prefix from the path if it exists
    let cleanPath = path;
    if (APP_PREFIX && path.startsWith(`/${APP_PREFIX}`)) {
      cleanPath = path.substring(`/${APP_PREFIX}`.length) || '/';
    }
    
    // Handle slug-based routing: /<slug>/<module>
    const pathSegments = cleanPath.split('/').filter(Boolean);
    
    // If no segments, default to home
    if (pathSegments.length === 0) return 'home';
    
    // If only one segment, it should be the slug, default to home module
    if (pathSegments.length === 1) return 'home';
    
    // If two or more segments, second segment is the module
    const module = pathSegments[1];
    
      // Validate module names
  const validModules: Module[] = ['home', 'get-started', 'store', 'product', 'inventory', 'forecast', 'analytics', 'settings'];
  if (validModules.includes(module as Module)) {
    return module as Module;
  }
  
  return 'home';
  };

  // Extract slug from the current location
  const getSlugFromPath = (path: string) => {
    // Remove the app prefix from the path if it exists
    let cleanPath = path;
    if (APP_PREFIX && path.startsWith(`/${APP_PREFIX}`)) {
      cleanPath = path.substring(`/${APP_PREFIX}`.length) || '/';
    }
    
    const pathSegments = cleanPath.split('/').filter(Boolean);
    
    // First segment should be the slug
    if (pathSegments.length > 0) {
      const slug = pathSegments[0];
      // Validate slug
      if (slug === 'reliance-digital' || slug === 'reliance-jewels' || slug === 'fashion-and-lifestyle') {
        return slug;
      }
    }
    
    // Default to reliance-digital if no valid slug found
    return 'reliance-digital';
  };

  const activeModule = getModuleFromPath(location);
  const activeSlug = getSlugFromPath(location);

  return (
    <ThemeProvider>
      <WorkspaceProvider>
        <AgentProvider>
          <TooltipProvider>
            <div className="pt-10">
              <Toaster />
              <Switch>
                {/* Slug-based routes: /<slug>/<module> */}
                <Route path={prefixedPath("/reliance-digital")} component={() => (
                  <ProjectProvider initialSlug="reliance-digital">
                    <Home initialModule="home" initialSlug="reliance-digital" />
                  </ProjectProvider>
                )} />
                <Route path={prefixedPath("/reliance-digital/:module")} component={() => (
                  <ProjectProvider initialSlug="reliance-digital">
                    <Home initialModule={activeModule} initialSlug="reliance-digital" />
                  </ProjectProvider>
                )} />
                <Route path={prefixedPath("/reliance-jewels")} component={() => (
                  <ProjectProvider initialSlug="reliance-jewels">
                    <Home initialModule="home" initialSlug="reliance-jewels" />
                  </ProjectProvider>
                )} />
                <Route path={prefixedPath("/reliance-jewels/:module")} component={() => (
                  <ProjectProvider initialSlug="reliance-jewels">
                    <Home initialModule={activeModule} initialSlug="reliance-jewels" />
                  </ProjectProvider>
                )} />
                <Route path={prefixedPath("/fashion-and-lifestyle")} component={() => (
                  <ProjectProvider initialSlug="fashion-and-lifestyle">
                    <Home initialModule="home" initialSlug="fashion-and-lifestyle" />
                  </ProjectProvider>
                )} />
                <Route path={prefixedPath("/fashion-and-lifestyle/:module")} component={() => (
                  <ProjectProvider initialSlug="fashion-and-lifestyle">
                    <Home initialModule={activeModule} initialSlug="fashion-and-lifestyle" />
                  </ProjectProvider>
                )} />
                {/* Default redirect to reliance-digital */}
                <Route path={prefixedPath("/")} component={() => (
                  <ProjectProvider initialSlug="reliance-digital">
                    <Home initialModule="home" initialSlug="reliance-digital" />
                  </ProjectProvider>
                )} />
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
