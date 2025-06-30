import React, { useState, useRef, useCallback, useEffect } from "react";
import { useWorkspace } from "@/context/WorkspaceProvider";
import ProductTree from "./ProductTree";
import EditorLayout from "../code/EditorLayout";
import SidebarSplitter from "../ui/SidebarSplitter";

const ProductModule = () => {
  const { 
    editorLayout,
    openFileInPanel,
    activePanelId
  } = useWorkspace();
  
  // Sidebar resizing state
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Handle product selection from tree - opens product as a tab
  const handleProductSelect = (productId: string, productInfo: any) => {
    // Open the product in the editor panel system
    openFileInPanel(productId);
  };

  // Handle new product button click
  const handleNewProductClick = () => {
    // Open the new product form
    openFileInPanel('new-product-form');
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
      {/* Product Tree with dynamic width */}
      <div style={{ width: sidebarWidth, flexShrink: 0 }} className="h-full overflow-hidden">
        <ProductTree 
          onProductSelect={handleProductSelect}
          selectedProductId={null} // We'll track this through the editor layout now
          onNewProductClick={handleNewProductClick}
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

export default ProductModule; 