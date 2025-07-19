import React, { useState, useRef, useCallback, useEffect } from "react";
import { useWorkspace } from "@/context/WorkspaceProvider";
import InventoryTree from "./InventoryTree";
import EditorLayout from "../code/EditorLayout";
import SidebarSplitter from "../ui/SidebarSplitter";

const InventoryModule = () => {
  const { 
    editorLayout,
    openFileInPanel,
    activePanelId
  } = useWorkspace();
  
  // Sidebar resizing state
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Handle inventory item selection from tree - opens item as a tab
  const handleInventoryItemSelect = (itemId: string, itemInfo: any) => {
    // Open the inventory item in the editor panel system
    openFileInPanel(itemId);
  };

  // Handle create purchase order button click
  const handleCreatePurchaseOrderClick = () => {
    // Open the purchase order form as an "under development" tab
    openFileInPanel('create-purchase-order');
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
      {/* Inventory Tree with dynamic width */}
      <div style={{ width: sidebarWidth, flexShrink: 0 }} className="h-full overflow-hidden">
        <InventoryTree 
          onInventoryItemSelect={handleInventoryItemSelect}
          onCreatePurchaseOrderClick={handleCreatePurchaseOrderClick}
          selectedItemId={null} // We'll track this through the editor layout now
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

export default InventoryModule; 