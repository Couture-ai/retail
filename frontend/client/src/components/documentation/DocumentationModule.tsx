import { useState, useCallback, useRef, useEffect } from "react";
import FileTree from "./FileTree";
import FileEditor from "./FileEditor";
import { useWorkspace } from "@/context/WorkspaceProvider";
import { File } from "@/types";
import { FileText, Share, MoreHorizontal, Plus } from "lucide-react";
import SidebarSplitter from "../ui/SidebarSplitter";

const DocumentationModule = () => {
  const { 
    documents, 
    activeDocumentId, 
    setActiveDocumentId, 
    updateDocumentContent, 
    createDocument 
  } = useWorkspace();
  
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  
  // Sidebar resizing state
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const findDocumentById = (docs: File[], id: string | null): File | undefined => {
    if (!id) return undefined;
    
    for (const doc of docs) {
      if (doc.id === id) return doc;
      if (doc.children) {
        const found = findDocumentById(doc.children, id);
        if (found) return found;
      }
    }
    
    return undefined;
  };
  
  const activeDocument = findDocumentById(documents, activeDocumentId);
  
  const handleCreateNewFile = () => {
    if (newFileName.trim()) {
      createDocument(newFileName);
      setNewFileName("");
      setShowNewFileModal(false);
    }
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
    const newWidth = Math.max(200, Math.min(400, e.clientX - containerLeft));
    
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
      {/* File Tree with dynamic width */}
      <div style={{ width: sidebarWidth, flexShrink: 0 }} className="h-full overflow-hidden">
        <FileTree documents={documents} />
      </div>
      
      {/* Resizer between sidebar and content */}
      <SidebarSplitter 
        isResizing={isResizingSidebar}
        onResizeStart={handleSidebarResizeStart}
      />
      
      {/* Document Content */}
      <div className="flex-1 flex flex-col bg-[hsl(var(--dark-9))]">
        {/* Document Header */}
        {activeDocument ? (
          <div className="h-14 border-b border-gray-700/50 flex items-center px-4">
            <div className="flex items-center">
              <FileText className="text-[hsl(var(--dark-2))] mr-2" size={18} />
              <h3 className="font-medium text-white">{activeDocument.name}</h3>
            </div>
            
            <div className="ml-auto flex items-center space-x-3">
              <button className="text-[hsl(var(--dark-2))] hover:text-white">
                <Share size={18} />
              </button>
              <button className="text-[hsl(var(--dark-2))] hover:text-white">
                <MoreHorizontal size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className="h-14 border-b border-gray-700/50 flex items-center px-4">
            <h3 className="font-medium text-white">No document selected</h3>
            <button 
              className="ml-auto text-[hsl(var(--dark-2))] hover:text-white"
              onClick={() => setShowNewFileModal(true)}
            >
              <Plus size={18} />
            </button>
          </div>
        )}
        
        {/* Document Editor */}
        {activeDocument ? (
          <FileEditor 
            content={activeDocument.content || ""} 
            onChange={(content) => updateDocumentContent(activeDocument.id, content)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <FileText size={48} className="mx-auto mb-4 text-[hsl(var(--dark-4))]" />
              <h2 className="text-xl font-semibold text-white mb-2">No document selected</h2>
              <p className="text-[hsl(var(--dark-3))] mb-4">Select a document from the sidebar or create a new one</p>
              <button 
                className="px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-md hover:bg-[hsl(var(--primary))/90]"
                onClick={() => setShowNewFileModal(true)}
              >
                Create new document
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* New File Modal */}
      {showNewFileModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[hsl(var(--dark-8))] p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">Create New Document</h3>
            <input
              type="text"
              placeholder="File name (e.g. Notes.md)"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="w-full p-2 bg-[hsl(var(--dark-7))] border border-[hsl(var(--dark-6))] rounded text-white mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button 
                className="px-4 py-2 bg-[hsl(var(--dark-6))] text-white rounded hover:bg-[hsl(var(--dark-5))]"
                onClick={() => {
                  setShowNewFileModal(false);
                  setNewFileName("");
                }}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-[hsl(var(--primary))] text-white rounded hover:bg-[hsl(var(--primary))/90]"
                onClick={handleCreateNewFile}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentationModule;
