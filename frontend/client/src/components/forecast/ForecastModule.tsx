import React, { useState, useRef, useCallback, useEffect } from "react";
import { useWorkspace } from "@/context/WorkspaceProvider";
import ForecastSidebar from "./ForecastSidebar";
import EditorLayout from "../code/EditorLayout";
import SidebarSplitter from "../ui/SidebarSplitter";
import { ChevronRight } from "lucide-react";

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

  const handleSidebarItemClick = (itemId: string, itemData: any) => {
    // Create tab for forecast content
    const tabId = `forecast-${itemId}`;
    
    console.log('[ForecastModule] Sidebar item clicked:', { itemId, itemData, tabId });
    
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
      <div className="flex-1 h-full overflow-hidden">
        <EditorLayout layoutNode={editorLayout} />
      </div>
    </div>
  );
};

export default ForecastModule; 