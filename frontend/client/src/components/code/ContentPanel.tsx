import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useWorkspace } from '@/context/WorkspaceProvider';
import TabsContainer from './TabsContainer';
import CodeEditor from './CodeEditor';
import ChatMessages from '../chat/ChatMessages';
import ChatInput from '../chat/ChatInput';
import { EditorPanelNode, SplitOrientation, LayoutNode, ContentType, TreeNode } from '@/types';
import './style.css'; // Ensure styles are imported
import DirectiveBusChat from '../chat/DirectiveBusChat';
import TaskPanel from '../task/TaskPanel';
import TimelineTab from '../timeline/TimelineTab';
import StoreTab from '../store/StoreTab';
import NewStoreTab from '../store/NewStoreTab';
import ProductTab from '../store/ProductTab';
import ArticleTab from '../store/ArticleTab';
import ForecastContent from '../forecast/ForecastContent';
import AnalyticsContent from '../analytics/AnalyticsContent';
import NewProductTab from '../store/NewProductTab';
import CreatePurchaseOrderTab from '../inventory/CreatePurchaseOrderTab';
import OrderTab from '../inventory/OrderTab';
import { v4 as uuidv4 } from 'uuid';
import { X, ExternalLink, Copy, Maximize2 } from 'lucide-react';

interface ContentPanelProps {
  panelNode: EditorPanelNode;
}

// Helper function to update a node in the layout tree
const updateNodeInLayout = (node: LayoutNode, updatedNode: LayoutNode): LayoutNode => {
  if (node.id === updatedNode.id) {
    return updatedNode;
  }
  if (node.type === 'splitter') {
    return {
      ...node,
      children: [
        updateNodeInLayout(node.children[0], updatedNode),
        updateNodeInLayout(node.children[1], updatedNode)
      ]
    };
  }
  return node;
};

const TAB_BAR_HEIGHT_ESTIMATE = 32; // Reduced estimate based on smaller tab height

const ContentPanel: React.FC<ContentPanelProps> = ({ panelNode }) => {
  const {
    getFileData,
    splitPanel,
    activePanelId,
    setActivePanelId,
    setEditorLayout, 
    closeFileInPanel,
    openFileInPanel,
    updateFileContent,
    // chats, // Keep if needed for other logic
    // activeChannelId, // Keep if needed for other logic
    addMessage,
    getTabData // Get the global getTabData function
  } = useWorkspace();
  
  const [dropZone, setDropZone] = useState<'top' | 'bottom' | 'left' | 'right' | 'center' | null>(null);
  
  // Get the active tab ID from the panel node
  const activeTabId = panelNode.activeTabId;
  
  // Get the active tab's full data using the global function
  const activeTabData = activeTabId ? getTabData(activeTabId) : null;
  
  // Extract the active tab's type
  const activeContentType = activeTabData?.type;

  // Debug logging
  console.log('[ContentPanel] Debug Info:', {
    activeTabId,
    activeTabData,
    activeContentType,
    panelNode
  });

  // Get chat messages ONLY if the active tab is a chat type
  const { chats } = useWorkspace(); // Need chats specifically for message lookup
  const activeChat = activeContentType === 'chat' && activeTabId ? 
    chats.find(chat => chat.channelId === activeTabId) : null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (!e.dataTransfer.types.includes('application/json+tab-split') && 
        !e.dataTransfer.types.includes('application/json')) {
      return; 
    }
    
    const target = e.currentTarget as HTMLDivElement;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const width = rect.width;
    const height = rect.height;

    // Define split zone thresholds (e.g., outer 25%)
    const splitThreshold = 0.25;

    // Check split zones first
    if (x > width * (1 - splitThreshold)) {
      setDropZone('right');
    } else if (y > height * (1 - splitThreshold)) {
      setDropZone('bottom');
    } 
    // Check if cursor is below the estimated tab bar height for center (move) zone
    else if (y > TAB_BAR_HEIGHT_ESTIMATE) {
      setDropZone('center');
    } 
    // Otherwise, no drop zone (likely hovering over tabs or top/left split areas which are disabled)
    else {
      setDropZone(null);
    }
  };
  
  const handleDragLeave = () => {
    setDropZone(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    let dragData;
    try {
      if (e.dataTransfer.types.includes('application/json+tab-split')) {
        dragData = e.dataTransfer.getData('application/json+tab-split');
      } else if (e.dataTransfer.types.includes('application/json')) {
        dragData = e.dataTransfer.getData('application/json');
      } else if (e.dataTransfer.types.includes('text/plain')) {
        dragData = e.dataTransfer.getData('text/plain');
      }
    } catch (error) {
      console.error("Error accessing drag data:", error);
    }
    
    // Reset drop zone
    const currentDropZone = dropZone;
    setDropZone(null);
    
    if (!dragData || !currentDropZone) {
      console.log("No data or dropzone:", dragData, currentDropZone);
      return;
    }
    
    try {
      let id: string;
      let sourcePanelId: string | null = null;

      // Prioritize specific split data if available
      if (e.dataTransfer.types.includes('application/json+tab-split')) {
        const parsed = JSON.parse(e.dataTransfer.getData('application/json+tab-split'));
        id = parsed.id;
        sourcePanelId = parsed.sourcePanelId;
      } else if (e.dataTransfer.types.includes('application/json')) { // General file/item drop
        const parsed = JSON.parse(e.dataTransfer.getData('application/json'));
        id = parsed.id || parsed.fileId; // Support dropping files from tree or other tabs
        sourcePanelId = parsed.sourcePanelId; // May be null if from tree
      } else if (e.dataTransfer.types.includes('text/plain')) { // Fallback
        id = e.dataTransfer.getData('text/plain');
      } else {
         console.log("No compatible drag data found");
         return;
      }
      
      if (!id) {
        console.error("No ID found in drag data");
        return;
      }
      
      if (currentDropZone === 'center') {
        if (sourcePanelId === panelNode.id) return; // Drop onto self
        
        // Open the item (file or channel) in this panel
        openFileInPanel(id, panelNode.id); 
        setActivePanelId(panelNode.id);
        return;
      }
      
      // For splitting (bottom/right dropzones)
      let orientation: SplitOrientation = 'vertical';
      let position: 'before' | 'after' = 'after';

      if (currentDropZone === 'bottom') {
        orientation = 'horizontal';
        position = 'after';
      } else if (currentDropZone === 'right') {
        orientation = 'vertical';
        position = 'after';
      } else {
        return;
      }
      
      splitPanel(panelNode.id, id, orientation, position);
    } catch (error) {
      console.error("Failed to process dragged data:", error, "Raw data:", dragData);
    }
  };

  const handlePanelClick = () => {
    if (panelNode.id !== activePanelId) {
      setActivePanelId(panelNode.id);
    }
  };
  
  // Handler for CodeEditor changes
  const handleEditorContentChange = (newContent: string | undefined) => {
    // Use activeContentType now
    if (activeContentType === 'code' && activeTabId && newContent !== undefined) {
      // We need file data here specifically for the content update
      const activeFileData = getFileData(activeTabId);
      if (activeFileData) {
         updateFileContent(activeTabId, newContent);
      }
    }
  };

  // Render content based on the active tab's type
  const renderContent = () => {
    if (!activeTabId || !activeContentType) { // Check type as well
      return (
        <div className="flex items-center justify-center h-full text-[hsl(var(--dark-3))]">
          No content selected in this panel
        </div>
      );
    }

    switch (activeContentType) { // Switch on activeContentType
      case 'code':
        // Need to get the file data again here for rendering
        const codeFile = getFileData(activeTabId);
        if (!codeFile) return <div className="p-4">Error: Code file not found.</div>;
        
        return (
          <CodeEditor
            key={codeFile.id} 
            fileId={codeFile.id}
            filename={codeFile.name}
            content={codeFile.content || ''} 
            onChange={handleEditorContentChange} 
          />
        );
        
      case 'chat':
        const isDirectiveBus = activeTabId && activeTabId.includes('to-');
        const getDirectiveBusInfo = () => {
          if (activeTabId === "code-to-design") {
            return { source: "swift-eagle-9042", target: "creative-owl-7238" };
          } else if (activeTabId === "design-to-deploy") {
            return { source: "creative-owl-7238", target: "clever-fox-3721" };
          } else if (activeTabId === "dev-to-analytics") {
            return { source: "swift-eagle-9042", target: "precise-deer-5190" };
          }
          return { source: "", target: "" };
        };
        
        const { source, target } = getDirectiveBusInfo();
        
        return (
          <div className="flex flex-col h-full">
            {/* Chat header with channel info */}
            <div className="h-12 border-b border-gray-700/50 flex items-center px-4 bg-[hsl(var(--discord-8))] flex-shrink-0">
              <div className="flex items-center">
                <div className={`w-2 h-2 ${isDirectiveBus ? 'bg-red-500' : 'bg-green-500'} rounded-full mr-2`}></div>
                <span className="text-white font-medium">{activeTabId}</span>
                {isDirectiveBus && (
                  <span className="ml-2 text-xs bg-red-900/30 text-red-300 px-2 py-0.5 rounded">
                    directive bus
                  </span>
                )}
              </div>
            </div>
            
            {/* Chat content area */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {isDirectiveBus ? (
                <DirectiveBusChat 
                  channelId={activeTabId || ''} 
                  sourceBotId={source}
                  targetBotId={target}
                />
              ) : (
                <>
                  <ChatMessages messages={activeChat?.messages || []} />
                  <ChatInput channelId={activeTabId || ''} />
                </>
              )}
            </div>
          </div>
        );
        
      case 'task':
        // Cast with unknown first to prevent type errors
        const taskNode = activeTabData as unknown as TreeNode;
        if (!taskNode) return <div className="p-4">Error: Task not found.</div>;
        
        return <TaskPanel node={taskNode} panelId={panelNode.id} />;
        
      case 'timeline':
        // Handle timeline view
        return <TimelineTab panelId={panelNode.id} />;
        
      case 'store':
        // Check if it's the new store form
        if (activeTabId === 'new-store-form') {
          return (
            <NewStoreTab 
              onClose={() => closeFileInPanel('new-store-form', panelNode.id)}
              onSave={(storeData) => {
                // Handle store creation here - you can add API call
                console.log('New store data:', storeData);
                // Close the form after successful save
                closeFileInPanel('new-store-form', panelNode.id);
              }}
            />
          );
        }
        return <StoreTab storeId={activeTabId || ''} panelId={panelNode.id} />;
        
      case 'product':
        if (activeTabId === 'new-product-form') {
          return (
            <NewProductTab 
              onClose={() => closeFileInPanel('new-product-form', panelNode.id)}
              onSave={(productData: any) => {
                // Handle product creation here - you can add API call
                console.log('New product data:', productData);
                // Close the form after successful save
                closeFileInPanel('new-product-form', panelNode.id);
              }}
            />
          );
        }
        return <ProductTab productId={activeTabId || ''} panelId={panelNode.id} />;
        
      case 'article':
        return <ArticleTab articleId={activeTabId || ''} panelId={panelNode.id} />;
        
      case 'forecast':
        // Extract forecast type from tab ID (format: forecast-{type})
        const forecastType = activeTabId && activeTabId.startsWith('forecast-') 
          ? activeTabId.replace('forecast-', '') 
          : undefined;
        return <ForecastContent forecastType={forecastType} />;
        
      case 'analytics':
        // Extract analytics type from tab ID (format: analytics-{type})
        const analyticsType = activeTabId && activeTabId.startsWith('analytics-') 
          ? decodeURIComponent(activeTabId.replace('analytics-', ''))
          : undefined;
        return <AnalyticsContent analyticsType={analyticsType} />;
        
      case 'inventory':
        // Handle inventory-related tabs
        if (activeTabId === 'create-purchase-order') {
          return (
            <CreatePurchaseOrderTab 
              onClose={() => closeFileInPanel('create-purchase-order', panelNode.id)}
              onSave={(orderData) => {
                // Handle purchase order creation here - you can add API call
                console.log('New purchase order data:', orderData);
                // Close the form after successful save
                closeFileInPanel('create-purchase-order', panelNode.id);
              }}
              selectedDate={new Date().toISOString().split('T')[0]} // Pass current date
            />
          );
        }
        
        // Handle order tabs (format: order-001, order-002, etc.)
        if (activeTabId && activeTabId.startsWith('order-')) {
          // Extract order info from the tab ID
          // This would typically come from your data store/context
          const mockOrderInfo = {
            orderNumber: activeTabId.replace('order-', '#'),
            date: '2024-01-15T10:30:00Z',
            storeManager: 'John Smith',
            storeName: 'Downtown Store',
            status: 'pending' as const
          };
          
          return (
            <OrderTab 
              orderId={activeTabId}
              orderInfo={mockOrderInfo}
              panelId={panelNode.id}
            />
          );
        }
        
        // Default inventory content (for other inventory tabs that might be added later)
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-[hsl(var(--panel-foreground))] text-lg mb-2">
                Inventory & Orders
              </div>
              <div className="text-[hsl(var(--panel-muted-foreground))] text-sm">
                Select an inventory item from the sidebar to view details
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="flex items-center justify-center h-full text-[hsl(var(--dark-3))]">
            Content type {activeContentType} not supported yet
          </div>
        );
    }
  };

  return (
    <div 
      className={`flex flex-col h-full w-full bg-[hsl(var(--dark-9))] relative border 
                  ${activePanelId === panelNode.id ? 'border-[hsl(var(--primary))]/' : 'border-transparent'}`}
      onClick={handlePanelClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <TabsContainer
        panelId={panelNode.id}
        openTabs={panelNode.openTabIds}
        activeTabId={panelNode.activeTabId}
        contentType={activeContentType || 'code'} // Provide a default value
        setActiveTabId={(tabId) => {
          // Update panel's activeTabId directly
          setEditorLayout(layout => updateNodeInLayout(layout, { ...panelNode, activeTabId: tabId }));
          setActivePanelId(panelNode.id);
        }}
        getTabData={getTabData} // Pass the global function from context
        onCloseTab={(tabId, panelId, e) => closeFileInPanel(tabId, panelId)}
      />
      
      {/* Content Path/Title Header (only for code) */}
      {activeContentType === 'code' && activeTabData && (
         <div className="h-8 border-b border-gray-700/50 flex items-center px-3 bg-[hsl(var(--dark-9))] flex-shrink-0">
            <span className="text-white font-medium text-xs truncate">
              {/* Need getFileData again here for path, or enhance getTabData */} 
              { getFileData(activeTabData.id)?.path || activeTabData.title }
            </span>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>

      {/* Drop Zone Indicators */}
      {dropZone && (
        <div 
          className={`absolute inset-0 pointer-events-none z-20 
                      ${dropZone === 'center' 
                        ? 'bg-[hsl(var(--primary))] opacity-20' 
                        : 'border-2 border-dashed border-[hsl(var(--primary))] drop-zone-' + dropZone}`}
          style={dropZone === 'center' ? { top: `${TAB_BAR_HEIGHT_ESTIMATE}px` } : {}}
        >
          {dropZone !== 'center' && <div className="absolute inset-0 bg-[hsl(var(--primary))] opacity-10"></div>}
        </div>
      )}
    </div>
  );
};

export default ContentPanel; 