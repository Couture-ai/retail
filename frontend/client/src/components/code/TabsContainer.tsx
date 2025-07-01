import React, { useState } from 'react';
import ContentTab from './ContentTab';
import { LayoutNode, ContentType } from '@/types';
import { useWorkspace } from '@/context/WorkspaceProvider'; // Need workspace for setting editor layout
import './style.css';

interface TabsContainerProps {
  panelId: string;
  openTabs: string[];
  activeTabId: string | null;
  contentType: ContentType;
  setActiveTabId: (id: string | null) => void;
  getTabData: (id: string) => { title: string; id: string; type: ContentType } | null;
  onCloseTab: (tabId: string, panelId: string, e: React.MouseEvent) => void;
}

const TabsContainer: React.FC<TabsContainerProps> = ({
  panelId,
  openTabs,
  activeTabId,
  contentType,
  setActiveTabId,
  getTabData,
  onCloseTab
}) => {
  const { setEditorLayout } = useWorkspace();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [dragSourcePanelId, setDragSourcePanelId] = useState<string | null>(null);

  // Handle internal tab reordering (within the same panel)
  const handleDragStartInternal = (index: number, sourcePanelId: string) => {
    setDraggedIndex(index);
    setDragSourcePanelId(sourcePanelId);
  };

  const handleDragEnterInternal = (index: number) => {
    // Only process if this is the same panel as the source
    // and it's a different index than what was dragged
    if (dragSourcePanelId === panelId && 
        draggedIndex !== null && 
        draggedIndex !== index) {
      setDropIndex(index);
    }
  };

  const handleDragEndInternal = () => {
    // Only reorder if all conditions are met
    if (draggedIndex !== null && 
        dropIndex !== null && 
        draggedIndex !== dropIndex &&
        dragSourcePanelId === panelId) {
        
      // Update the layout in the context
      setEditorLayout(layout => {
        if (layout.type === 'panel' && layout.id === panelId) {
          const newOpenTabs = [...layout.openTabIds];
          const [draggedTab] = newOpenTabs.splice(draggedIndex, 1);
          newOpenTabs.splice(dropIndex, 0, draggedTab);
          return { ...layout, openTabIds: newOpenTabs };
        } else if (layout.type === 'splitter') {
          // Need recursive update for splitters
          const updatePanelTabsInSplitter = (node: LayoutNode): LayoutNode => {
            if (node.type === 'panel' && node.id === panelId) {
              const newOpenTabs = [...node.openTabIds];
              const [draggedTab] = newOpenTabs.splice(draggedIndex, 1);
              newOpenTabs.splice(dropIndex, 0, draggedTab);
              return { ...node, openTabIds: newOpenTabs };
            }
            if (node.type === 'splitter') {
              return { 
                ...node, 
                children: [updatePanelTabsInSplitter(node.children[0]), updatePanelTabsInSplitter(node.children[1])] 
              };
            }
            return node;
          };
          return updatePanelTabsInSplitter(layout);
        } 
        return layout; // Should not happen
      });
    }

    // Reset the drag state
    setDraggedIndex(null);
    setDropIndex(null);
    setDragSourcePanelId(null);
  };
  
  // Handler for initiating external drag (split)
  // This component doesn't handle the drop, only initiates
  const handleDragStartExternal = (tabId: string, sourcePanelId: string, e: React.DragEvent) => {
    const tabData = getTabData(tabId);
    if (!tabData) return;

    const dragData = JSON.stringify({ 
      id: tabId, 
      contentType: tabData.type,
      sourcePanelId 
    });
    
    e.dataTransfer.setData('application/json+tab-split', dragData);
    e.dataTransfer.setData('application/json', dragData); 
    e.dataTransfer.setData('text/plain', tabId); 
    e.dataTransfer.effectAllowed = 'move';
  };

  // Activate tab when clicked
  const handleActivateTab = (tabId: string, targetPanelId: string) => {
    if (targetPanelId === panelId) {
      setActiveTabId(tabId);
    }
  };

  // Apply visual drag and drop styles
  const getTabClassName = (index: number) => {
    // Only apply drag effects if this is the source panel
    if (dragSourcePanelId !== panelId) return '';
    
    if (draggedIndex === index) {
      return 'tab-dragging';
    }
    if (dropIndex === index && draggedIndex !== null && draggedIndex !== index) {
      return 'tab-drag-over';
    }
    return '';
  };

  return (
    <div className="flex overflow-x-auto scrollbar-hidden border-b border-[hsl(var(--tab-container-border))] bg-[hsl(var(--tab-container-background))] flex-shrink-0">
      {openTabs.length > 0 ? (
        <div className="flex">
          {openTabs.map((tabId, index) => {
            const tab = getTabData(tabId);
            if (!tab) return null;
            
            const isActive = tabId === activeTabId;
            
            return (
              <div 
                key={tabId} 
                className={`tab-transition ${getTabClassName(index)}`}
              >
                <ContentTab
                  id={tabId}
                  title={tab.title}
                  contentType={tab.type}
                  panelId={panelId}
                  isActive={isActive}
                  index={index}
                  onActivate={handleActivateTab}
                  onClose={onCloseTab}
                  onDragStartInternal={handleDragStartInternal}
                  onDragStartExternal={handleDragStartExternal}
                  onDragEnter={handleDragEnterInternal}
                  onDragEndInternal={handleDragEndInternal}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="px-3 py-2 text-[hsl(var(--tab-foreground-muted))]">No tabs open</div>
      )}
    </div>
  );
};

export default TabsContainer; 