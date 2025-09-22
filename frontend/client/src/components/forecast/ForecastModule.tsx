import React, { useState, useRef, useCallback, useEffect } from "react";
import { useWorkspace } from "@/context/WorkspaceProvider";
import ForecastSidebar from "./ForecastSidebar";
import EditorLayout from "../code/EditorLayout";
import SidebarSplitter from "../ui/SidebarSplitter";
import { ChevronRight } from "lucide-react";
import { ForecastRepository } from "@/repository/forecast_repository";
import { useProject } from "@/context/ProjectProvider";

// Global registry to store forecast tab data
export const forecastTabDataRegistry = new Map<string, {
  selectedWeekStartDate: string;
  forecastType: string;
  title: string;
}>();

const ForecastModule = () => {
  const { 
    editorLayout,
    openFileInPanel,
    activePanelId
  } = useWorkspace();

  // Sidebar state
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Month selector state
  const [weekStartDates, setWeekStartDates] = useState<string[]>([]);
  const [selectedWeekStartDate, setSelectedWeekStartDate] = useState<string>('');
  const [loadingWeekDates, setLoadingWeekDates] = useState(false);

  // Track if we've auto-opened the default tab
  const [hasAutoOpenedDefault, setHasAutoOpenedDefault] = useState(false);

  // Initialize forecast repository
  const {forecastRepository: forecastRepo} = useProject();

  // Load week start dates on mount
  useEffect(() => {
    loadWeekStartDates();
  }, []);

  // Auto-open the default "Global Store-Article Forecast" tab when data is ready
  useEffect(() => {
    if (!hasAutoOpenedDefault && selectedWeekStartDate && weekStartDates.length > 0) {
      // Auto-open the master-table tab
      const itemId = "master-table";
      const itemData = {
        title: "Global Store-Article Forecast",
        type: 'master-table'
      };
      
      handleSidebarItemClick(itemId, itemData);
      setHasAutoOpenedDefault(true);
    }
  }, [selectedWeekStartDate, weekStartDates, hasAutoOpenedDefault]);

  const loadWeekStartDates = async () => {
    try {
      setLoadingWeekDates(true);
      const sqlQuery = `SELECT DISTINCT week_start_date FROM forecast ORDER BY week_start_date ASC`;
      
      const stateSetters = {
        setLoading: () => {},
        setError: (error: string | null) => console.error('Error loading week dates:', error),
        setData: (response: any) => {
          if (response && response.data) {
            const dates = response.data.map((row: any) => row.week_start_date).filter(Boolean);
            setWeekStartDates(dates);
            // Set the earliest date as default
            if (dates.length > 0 && !selectedWeekStartDate) {
              setSelectedWeekStartDate(dates[0]);
            }
          }
        }
      };
      
      await forecastRepo.executeSqlQuery({ sql_query: sqlQuery }, stateSetters);
    } catch (err) {
      console.error('Error loading week start dates:', err);
    } finally {
      setLoadingWeekDates(false);
    }
  };

  const handleWeekStartDateChange = (newDate: string) => {
    setSelectedWeekStartDate(newDate);
    
    // Update all existing forecast tabs with the new date
    forecastTabDataRegistry.forEach((data, tabId) => {
      const dateDisplay = newDate ? 
        ` (${new Date(newDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })})` : '';
      
      const baseTitle = data.forecastType === 'consensus-adjustment' ? 'Adjustment' : 
                        data.forecastType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      forecastTabDataRegistry.set(tabId, {
        ...data,
        selectedWeekStartDate: newDate,
        title: baseTitle + dateDisplay
      });
    });
  };

  const handleSidebarItemClick = (itemId: string, itemData: any) => {
    // Create tab for forecast content
    const tabId = `forecast-${itemId}`;
    
    // Handle different content types
    let baseTitle = itemData.title;
    let fullTitle = baseTitle;
    
    // For adjustment diff views, use the exact title and don't add date
    if (itemData.type === 'adjustment-diff') {
      fullTitle = baseTitle; // Keep adjustment title as is
    } else {
      // For other forecast views, add date display
      const dateDisplay = selectedWeekStartDate ? 
        ` (${new Date(selectedWeekStartDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })})` : '';
      fullTitle = baseTitle + dateDisplay;
    }
    
    // Store forecast-specific data in the registry
    forecastTabDataRegistry.set(tabId, {
      selectedWeekStartDate,
      forecastType: itemId,
      title: fullTitle
    });
    
    console.log('[ForecastModule] Sidebar item clicked:', { itemId, tabId, selectedWeekStartDate, itemData });
    
    // Open the forecast content in the editor panel system
    openFileInPanel(tabId);
  };

  const handleCloseSidebar = () => {
    setSidebarVisible(false);
  };

  const handleToggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Sidebar resize handlers
  const handleSidebarResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizingSidebar(true);
  }, []);
  
  const handleSidebarResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizingSidebar) return;
    
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    
    const containerLeft = containerRect.left;
    const newWidth = Math.max(250, Math.min(500, e.clientX - containerLeft));
    
    setSidebarWidth(newWidth);
  }, [isResizingSidebar]);
  
  const handleSidebarResizeEnd = useCallback(() => {
    setIsResizingSidebar(false);
  }, []);
  
  useEffect(() => {
    if (isResizingSidebar) {
      document.addEventListener('mousemove', handleSidebarResizeMove);
      document.addEventListener('mouseup', handleSidebarResizeEnd);
    } else {
      document.removeEventListener('mousemove', handleSidebarResizeMove);
      document.removeEventListener('mouseup', handleSidebarResizeEnd);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleSidebarResizeMove);
      document.removeEventListener('mouseup', handleSidebarResizeEnd);
    };
  }, [isResizingSidebar, handleSidebarResizeMove, handleSidebarResizeEnd]);

  return (
    <div className="flex-1 flex overflow-hidden" ref={containerRef}>
      {/* Sidebar Toggle Button (when sidebar is closed) */}
      {!sidebarVisible && (
        <div className="flex-shrink-0 w-8 h-full bg-[hsl(var(--dark-8))] border-r border-gray-700/50 flex items-start justify-center pt-4">
          <button
            onClick={handleToggleSidebar}
            className="p-1 rounded hover:bg-[hsl(var(--dark-7))] transition-colors duration-200 text-[hsl(var(--dark-3))] hover:text-white"
            title="Show forecast sidebar"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
      
      {/* Forecast Sidebar with dynamic width */}
      {sidebarVisible && (
        <>
          <div style={{ width: sidebarWidth, flexShrink: 0 }} className="h-full overflow-hidden">
            <ForecastSidebar 
              onItemSelect={handleSidebarItemClick}
              onClose={handleCloseSidebar}
              weekStartDates={weekStartDates}
              selectedWeekStartDate={selectedWeekStartDate}
              onWeekStartDateChange={handleWeekStartDateChange}
              loadingWeekDates={loadingWeekDates}
            />
          </div>
          
          {/* Resizer between sidebar and content */}
          <SidebarSplitter 
            isResizing={isResizingSidebar}
            onResizeStart={handleSidebarResizeStart}
          />
        </>
      )}
      
      {/* Editor Layout */}
      {/* add border radius */}
      <div className="flex-1 h-full overflow-hidden">
        <EditorLayout layoutNode={editorLayout} />
      </div>
    </div>
  );
};

export default ForecastModule; 