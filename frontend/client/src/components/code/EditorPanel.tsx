import React, { useState } from 'react';
import { useWorkspace } from '@/context/WorkspaceProvider';
import TabsContainer from './TabsContainer';
import CodeEditor from './CodeEditor';
import ChatMessages from '../chat/ChatMessages';
import ChatInput from '../chat/ChatInput';
import { EditorPanelNode, SplitOrientation, LayoutNode, ContentType, TreeNode } from '@/types';
import './style.css'; // Ensure styles are imported
import { Editor } from '@monaco-editor/react';
import ChatTab from '../chat/ChatTab';
import TaskTab from '../task/TaskTab';

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
    setEditorLayout, // Needed for direct manipulation in complex cases
    closeFileInPanel,
    openFileInPanel,
    updateFileContent,
    chats,
    activeChannelId,
    addMessage
  } = useWorkspace();
  
  const [dropZone, setDropZone] = useState<'top' | 'bottom' | 'left' | 'right' | 'center' | null>(null);
  
  // Get the active content based on panel content type
  const activeTabId = panelNode.activeTabId;
  const contentType = panelNode.contentType;

  // Extract data based on content type
  const activeContent = activeTabId ? 
    contentType === 'code' ? getFileData(activeTabId) : 
    contentType === 'chat' ? { id: activeTabId, name: activeTabId } : 
    null : null;

  const getTabData = (id: string) => {
    if (contentType === 'code') {
      const file = getFileData(id);
      return file ? { 
        id: file.id, 
        title: file.name, 
        type: 'code' as ContentType 
      } : null;
    } 
    else if (contentType === 'chat') {
      // For chat tabs, the ID is the channel ID
      return { 
        id: id, 
        title: id, 
        type: 'chat' as ContentType 
      };
    }
    return null;
  };
  
  // Get chat messages for chat content type
  const activeChat = contentType === 'chat' && activeTabId ? 
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
      let contentType: ContentType = 'code'; // Default to code
      let sourcePanelId: string | null = null;
      
      try {
        const parsed = JSON.parse(dragData);
        id = parsed.id || parsed.fileId; // Support both new and old format
        contentType = parsed.contentType || 'code';
        sourcePanelId = parsed.sourcePanelId;
      } catch (parseError) {
        id = dragData;
      }
      
      if (!id) {
        console.error("No ID found in drag data");
        return;
      }
      
      // Handle moving content to this panel vs splitting the panel
      if (currentDropZone === 'center') {
        // If it's the same panel, do nothing
        if (sourcePanelId === panelNode.id) {
          return;
        }
        
        // Move content to this panel (open it here and close from source panel if needed)
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
    if (contentType === 'code' && activeContent && newContent !== undefined) {
      updateFileContent(activeContent.id, newContent);
    }
  };

  // Render content based on content type
  const renderContent = () => {
    if (!activeTabId) {
      return (
        <div className="flex items-center justify-center h-full text-[hsl(var(--dark-3))]">
          No content selected in this panel
        </div>
      );
    }

    switch (contentType) {
      case 'code':
        if (!activeContent) return null;
        
        // Type guard to ensure the file content can be accessed
        const codeFile = activeContent as TreeNode;
        
        return (
          <Editor
            height="100%"
            theme="vs-dark"
            path={codeFile.id}
            defaultLanguage="typescript"
            defaultValue={codeFile.content || ''}
            onChange={handleEditorContentChange}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        );
        
      case 'chat':
        return (
          <div className="flex flex-col h-full">
            <ChatMessages messages={activeChat?.messages || []} />
            <ChatInput channelId={activeTabId} />
          </div>
        );
      case 'task':
        return <TaskTab tab={activeContent as TreeNode} panelId={panelNode.id} />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-[hsl(var(--dark-3))]">
            Content type {contentType} not supported yet
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
        contentType={panelNode.contentType}
        setActiveTabId={(tabId) => {
          setEditorLayout(layout => updateNodeInLayout(layout, { ...panelNode, activeTabId: tabId }));
          setActivePanelId(panelNode.id);
        }}
        getTabData={getTabData}
        onCloseTab={(tabId, panelId, e) => closeFileInPanel(tabId, panelId)}
      />
      
      {/* Content Path/Title Header (if used) */}
      {activeContent && contentType === 'code' && (
         <div className="h-8 border-b border-gray-700/50 flex items-center px-3 bg-[hsl(var(--dark-9))] flex-shrink-0">
            <span className="text-white font-medium text-xs truncate">
              {(activeContent as any).path || activeContent.name}
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