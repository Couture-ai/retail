import React, { useState, useRef, useCallback, useEffect } from "react";
import GetStartedSidebar from "./GetStartedSidebar";
import OnboardingContent from "./OnboardingContent";
import SidebarSplitter from "../ui/SidebarSplitter";

const GetStartedModule = () => {
  // Sidebar resizing state
  const [sidebarWidth, setSidebarWidth] = useState(350);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Content state
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    title: string;
    description?: string;
    required: boolean;
    type: string;
    dependsOn?: string[];
  } | null>(null);
  
  // Handle checklist item selection from sidebar
  const handleChecklistItemSelect = (itemId: string, itemInfo: any) => {
    setSelectedItem({
      id: itemId,
      title: itemInfo.title,
      description: itemInfo.description,
      required: itemInfo.required,
      type: itemInfo.type,
      dependsOn: itemInfo.dependsOn
    });
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
    const newWidth = Math.max(300, Math.min(600, e.clientX - containerLeft));
    
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
    <div className="flex-1 flex overflow-hidden bg-[hsl(var(--dashboard-background))]" ref={containerRef}>
      {/* Get Started Sidebar with dynamic width */}
      <div style={{ width: sidebarWidth, flexShrink: 0 }} className="h-full overflow-hidden">
        <GetStartedSidebar 
          onChecklistItemSelect={handleChecklistItemSelect}
        />
      </div>
      
      {/* Resizer between sidebar and content */}
      <SidebarSplitter 
        isResizing={isResizingSidebar}
        onResizeStart={handleSidebarResizeStart}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 h-full overflow-hidden">
        {selectedItem ? (
          <OnboardingContent
            itemId={selectedItem.id}
            title={selectedItem.title}
            description={selectedItem.description}
            required={selectedItem.required}
            type={selectedItem.type}
            dependsOn={selectedItem.dependsOn}
          />
        ) : (
          <div className="h-full bg-[hsl(var(--panel-background))] flex flex-col items-center justify-center">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-[hsl(var(--dashboard-primary-blue))] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-[hsl(var(--panel-foreground))] mb-2">
                Welcome to Setup
              </h2>
              <p className="text-[hsl(var(--panel-muted-foreground))] mb-6">
                Select an item from the onboarding checklist to view detailed setup instructions and data format requirements.
              </p>
              <div className="bg-[hsl(var(--dashboard-accent-background))] rounded-lg p-4 text-left">
                <h3 className="font-medium text-[hsl(var(--panel-foreground))] mb-2">Getting Started</h3>
                <ul className="text-sm text-[hsl(var(--panel-muted-foreground))] space-y-1">
                  <li>• Complete required data uploads first</li>
                  <li>• Set up real-time connections (optional)</li>
                  <li>• Configure data processing rules</li>
                  <li>• Launch your retail analytics platform</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetStartedModule; 