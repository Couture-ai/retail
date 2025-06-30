import React, { useState, useRef, useCallback, useEffect } from "react";
import { useWorkspace } from "@/context/WorkspaceProvider";
import StoreTree from "./StoreTree";
import EditorLayout from "../code/EditorLayout";
import SidebarSplitter from "../ui/SidebarSplitter";

const StoreModule = () => {
  const { 
    editorLayout,
    openFileInPanel,
    activePanelId
  } = useWorkspace();
  
  // Sidebar resizing state
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Handle store selection from tree - opens store as a tab
  const handleStoreSelect = (storeId: string, storeInfo: any) => {
    // Open the store in the editor panel system
    openFileInPanel(storeId);
  };
  
  // Handle new store button click - opens new store form
  const handleNewStoreClick = () => {
    // Use a special ID to identify the new store form
    openFileInPanel('new-store-form');
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
      {/* Store Tree with dynamic width */}
      <div style={{ width: sidebarWidth, flexShrink: 0 }} className="h-full overflow-hidden">
        <StoreTree 
          onStoreSelect={handleStoreSelect}
          onNewStoreClick={handleNewStoreClick}
          selectedStoreId={null} // We'll track this through the editor layout now
        />
      </div>
      
      {/* Resizer between sidebar and content */}
      <SidebarSplitter 
        isResizing={isResizingSidebar}
        onResizeStart={handleSidebarResizeStart}
      />
      
      {/* Editor Layout */}
      <div className="flex-1 h-full overflow-hidden">
        <EditorLayout layoutNode={editorLayout} />
      </div>
    </div>
  );
};

export default StoreModule; 