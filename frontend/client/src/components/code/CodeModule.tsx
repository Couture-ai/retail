import React, { useState, useRef, useCallback, useEffect } from "react";
import { useWorkspace } from "@/context/WorkspaceProvider";
import ModulePanel from "./ModulePanel";
import EditorLayout from "./EditorLayout";
import SidebarSplitter from "../shared/SidebarSplitter";

const CodeModule = () => {
  const { 
    codeFiles,
    editorLayout,
    openFileInPanel,
    activeModule,
    setActiveChannelId,
    activePanelId,
    chats
  } = useWorkspace();
  
  const [treeWidth, setTreeWidth] = useState(250);
  const [isResizingTree, setIsResizingTree] = useState(false);
  const resizeContainerRef = useRef<HTMLDivElement>(null);
  
  // Helper to find a panel by ID in the layout (might be needed elsewhere or removed)
  const findPanelById = (node: any, panelId: string): any => {
    if (node.type === 'panel' && node.id === panelId) {
      return node;
    }
    if (node.type === 'splitter') {
      const foundInChild1 = findPanelById(node.children[0], panelId);
      if (foundInChild1) return foundInChild1;
      const foundInChild2 = findPanelById(node.children[1], panelId);
      if (foundInChild2) return foundInChild2;
    }
    return null;
  };
  
  // Handle opening content from the sidebar
  const handleContentOpen = (id: string) => {
    // Based on the active module, we can potentially hint the content type
    // but openFileInPanel ultimately decides based on the id and context.
    if (activeModule === 'chat') {
      setActiveChannelId(id); 
    }
    // Regardless of module, open the item. WorkspaceProvider determines type.
    openFileInPanel(id);
  };

  // --- Tree Resizing Logic --- 
  const handleTreeResizeStart = useCallback((e?: React.MouseEvent) => {
    // Check if event exists before trying to use it
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsResizingTree(true);
  }, []);
  
  const handleTreeResizeMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizingTree) return;
    
    const containerRect = resizeContainerRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    
    const containerLeft = containerRect.left;
    const newWidth = Math.max(150, Math.min(800, e.clientX - containerLeft));
    
    setTreeWidth(newWidth);
  }, [isResizingTree]);
  
  const handleTreeResizeMouseUp = useCallback(() => {
    setIsResizingTree(false);
  }, []);
  
  useEffect(() => {
    if (isResizingTree) {
      document.addEventListener('mousemove', handleTreeResizeMouseMove);
      document.addEventListener('mouseup', handleTreeResizeMouseUp);
    } else {
      document.removeEventListener('mousemove', handleTreeResizeMouseMove);
      document.removeEventListener('mouseup', handleTreeResizeMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleTreeResizeMouseMove);
      document.removeEventListener('mouseup', handleTreeResizeMouseUp);
    };
  }, [isResizingTree, handleTreeResizeMouseMove, handleTreeResizeMouseUp]);
  
  return (
    <div className="flex-1 flex overflow-hidden" ref={resizeContainerRef}>
      {/* Module-specific sidebar - changes based on activeModule */}
      <div style={{ width: treeWidth, flexShrink: 0 }} className="h-full overflow-hidden">
        <ModulePanel 
          width={treeWidth} 
          onFileOpen={handleContentOpen} 
        />
      </div>
      
      {/* Resizer handle using the SidebarSplitter component */}
      <SidebarSplitter 
        onResizeStart={handleTreeResizeStart}
        onResize={(width) => setTreeWidth(width)}
        onResizeEnd={handleTreeResizeMouseUp}
      />
      
      {/* Editor area */}
      <div className="flex-1 h-full overflow-hidden">
        <EditorLayout layoutNode={editorLayout} />
      </div>
    </div>
  );
};

export default CodeModule;
