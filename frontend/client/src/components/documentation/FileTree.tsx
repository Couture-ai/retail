import { useState, useRef, useEffect } from "react";
import { useWorkspace } from "@/context/WorkspaceProvider";
import { File } from "@/types";
import { 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft, 
  Folder, 
  FileText, 
  FilePlus, 
  FolderPlus, 
  Trash, 
  Edit, 
  ArrowLeft, 
  PackageOpen, 
  Lightbulb, 
  BookOpen,
  Search
} from "lucide-react";

type FileTreeProps = {
  documents: File[];
};

// Special root items with custom icons
const SPECIAL_ROOT_ITEMS = {
  'resources': { name: 'Resource Dump', icon: PackageOpen },
  'ideas': { name: 'Ideas', icon: Lightbulb },
  'research': { name: 'Research', icon: BookOpen }
};

const FileTree = ({ documents }: FileTreeProps) => {
  const { 
    activeDocumentId,
    setActiveDocumentId, 
    createDocument,
    setDocuments,
    deleteDocument
  } = useWorkspace();
  
  // Local state
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [renameItem, setRenameItem] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [contextMenu, setContextMenu] = useState<{id: string, x: number, y: number} | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Refs
  const treeRef = useRef<HTMLDivElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);
  const lastCreatedRef = useRef<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Helper functions
  const findFileById = (files: File[], id: string): File | null => {
    for (const file of files) {
      if (file.id === id) return file;
      if (file.children) {
        const found = findFileById(file.children, id);
        if (found) return found;
      }
    }
    return null;
  };
  
  // Extract ID from name with appended ID for new items
  const extractIdFromName = (name: string) => {
    const match = name.match(/#([^#]+)$/);
    return match ? match[1] : null;
  };
  
  // Cleans name by removing ID suffix used for new items
  const cleanName = (name: string) => {
    return name.replace(/#[^#]+$/, '');
  };
  
  // Add special root items to the displayed hierarchy if not already present
  const getDisplayedContents = (contents: File[]): File[] => {
    if (currentFolderId !== null) {
      return contents; // Only add special items at root level
    }
    
    // Check if special items already exist
    const existingIds = new Set(contents.map(item => item.id));
    const missingSpecialItems: File[] = [];
    
    // Add any missing special items
    Object.entries(SPECIAL_ROOT_ITEMS).forEach(([id, item]) => {
      if (!existingIds.has(id)) {
        missingSpecialItems.push({
          id,
          name: item.name,
          type: 'folder',
          children: []
        });
      }
    });
    
    return [...missingSpecialItems, ...contents];
  };
  
  // Focus rename input when it appears
  useEffect(() => {
    if (renameItem && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renameItem]);
  
  // Handle clicks outside the component
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (treeRef.current && !treeRef.current.contains(e.target as Node)) {
        setSelectedItem(null);
        setContextMenu(null);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  // Watch for the appearance of newly created items
  useEffect(() => {
    if (lastCreatedRef.current) {
      const newItem = findFileById(documents, lastCreatedRef.current);
      if (newItem) {
        setRenameItem(lastCreatedRef.current);
        setRenameValue(newItem.name);
        lastCreatedRef.current = null;
      }
    }
  }, [documents]);
  
  // Get the current folder's contents and breadcrumb info
  const getCurrentFolderContents = () => {
    if (!currentFolderId) {
      // At root level, show all top-level documents
      return documents;
    }
    
    // Find the current folder
    const currentFolder = findFileById(documents, currentFolderId);
    return currentFolder?.children || [];
  };
  
  // Get the parent folder ID
  const getParentFolderId = (folderId: string): string | null => {
    const findParent = (files: File[], targetId: string): string | null => {
      for (const file of files) {
        if (file.children) {
          if (file.children.some(child => child.id === targetId)) {
            return file.id;
          }
          
          const nestedResult = findParent(file.children, targetId);
          if (nestedResult) return nestedResult;
        }
      }
      return null;
    };
    
    return findParent(documents, folderId);
  };
  
  // Get the folder path as an array of folder objects (for breadcrumbs)
  const getFolderPath = (folderId: string | null): File[] => {
    if (!folderId) return [];
    
    // Check if this is a special root folder
    if (Object.keys(SPECIAL_ROOT_ITEMS).includes(folderId)) {
      // For special folders, create a path with just that folder
      return [{
        id: folderId,
        name: SPECIAL_ROOT_ITEMS[folderId as keyof typeof SPECIAL_ROOT_ITEMS].name,
        type: 'folder',
        children: []
      }];
    }
    
    const path: File[] = [];
    let currentId: string | null = folderId;
    
    while (currentId) {
      const folder = findFileById(documents, currentId);
      if (folder) {
        path.unshift(folder);
        const parentId = getParentFolderId(currentId);
        currentId = parentId;
      } else {
        break;
      }
    }
    
    return path;
  };
  
  const rawCurrentFolderContents = getCurrentFolderContents();
  let currentFolderContents = getDisplayedContents(rawCurrentFolderContents);
  
  // Filter files by search term if present
  if (searchTerm.trim() !== "") {
    currentFolderContents = currentFolderContents.filter(file => 
      cleanName(file.name).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  const currentPath = getFolderPath(currentFolderId);
  
  // File tree interaction handlers
  const handleFileClick = (file: File) => {
    setSelectedItem(file.id);
    
    if (file.type === 'file') {
      setActiveDocumentId(file.id);
    }
  };
  
  const handleItemDoubleClick = (file: File) => {
    if (file.type === 'folder') {
      // Navigate into the folder
      setCurrentFolderId(file.id);
      setSelectedItem(null);
      setSearchTerm(""); // Clear search when navigating
    } else {
      // Open the file
      setActiveDocumentId(file.id);
    }
  };
  
  const handleNavigateUp = () => {
    if (currentFolderId) {
      const parentId = getParentFolderId(currentFolderId);
      setCurrentFolderId(parentId);
      setSelectedItem(null);
      setSearchTerm(""); // Clear search when navigating
    }
  };
  
  const handleContextMenu = (e: React.MouseEvent, fileId: string) => {
    // Don't show context menu for special root items
    if (currentFolderId === null && Object.keys(SPECIAL_ROOT_ITEMS).includes(fileId)) {
      return;
    }
    
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      id: fileId,
      x: e.clientX,
      y: e.clientY
    });
  };
  
  // File/folder operations
  const handleNewFile = (parentId?: string) => {
    const id = Date.now().toString();
    lastCreatedRef.current = id;
    createDocument(`New Document.md#${id}`, parentId || currentFolderId || undefined);
    setContextMenu(null);
  };
  
  const handleNewFolder = (parentId?: string) => {
    const id = Date.now().toString();
    lastCreatedRef.current = id;
    createDocument(`New Folder#${id}`, parentId || currentFolderId || undefined);
    setContextMenu(null);
  };
  
  const handleRename = (e: React.KeyboardEvent | React.FocusEvent) => {
    // Skip if not Enter key for keyboard events
    if ('key' in e && e.key !== 'Enter') {
      return;
    }
    
    if (renameItem && renameValue.trim()) {
      // Update the name in the document tree
      const updateFileName = (files: File[]): File[] => {
        return files.map(file => {
          if (file.id === renameItem) {
            return { ...file, name: renameValue };
          }
          if (file.children) {
            return { ...file, children: updateFileName(file.children) };
          }
          return file;
        });
      };
      
      setDocuments(updateFileName(documents));
      setRenameItem(null);
    } else {
      setRenameItem(null);
    }
  };
  
  const handleRenameCancel = () => {
    setRenameItem(null);
  };
  
  const handleDelete = (fileId: string) => {
    deleteDocument(fileId);
    setContextMenu(null);
  };
  
  // Get the appropriate icon for a file or folder
  const getItemIcon = (file: File, size: number = 36) => {
    // Check if it's a special root item
    const isSpecialRoot = currentFolderId === null && Object.keys(SPECIAL_ROOT_ITEMS).includes(file.id);
    
    if (isSpecialRoot) {
      const IconComponent = SPECIAL_ROOT_ITEMS[file.id as keyof typeof SPECIAL_ROOT_ITEMS].icon;
      return <IconComponent className="text-[hsl(var(--dark-1))]" size={size} />;
    }
    
    // Regular file or folder icon
    if (file.type === 'file') {
      return <FileText className="text-[hsl(var(--dark-1))]" size={size} />;
    } else {
      return <Folder className="text-[hsl(var(--dark-1))]" size={size} />;
    }
  };
  
  // Render individual file/folder item
  const renderListItem = (file: File) => {
    const isSelected = file.id === selectedItem;
    const isEditing = file.id === renameItem;
    const displayName = cleanName(file.name);
    const isFile = file.type === 'file';
    const isActive = file.id === activeDocumentId && isFile;
    const isSpecialRoot = currentFolderId === null && Object.keys(SPECIAL_ROOT_ITEMS).includes(file.id);
    
    return (
      <div
        key={file.id}
        className={`
          flex items-center p-2 cursor-pointer rounded-md mb-1
          ${isSelected ? 'bg-[hsl(var(--dark-7))]' : 'hover:bg-[hsl(var(--dark-7))/40]'}
          ${isActive ? 'ring-1 ring-[hsl(var(--primary))]' : ''}
          transition-all duration-150 ease-in-out
        `}
        onClick={() => handleFileClick(file)}
        onDoubleClick={() => handleItemDoubleClick(file)}
        onContextMenu={(e) => handleContextMenu(e, file.id)}
      >
        {/* Icon */}
        <div className="flex justify-center items-center w-10 h-10 mr-3 rounded-md
                      bg-gradient-to-br from-[hsl(var(--dark-6))] to-[hsl(var(--dark-8))]
                      shadow-inner">
          {getItemIcon(file, 20)}
        </div>
        
        {/* Name */}
        <div className="flex-1 overflow-hidden">
          {isEditing && !isSpecialRoot ? (
            <input
              ref={renameInputRef}
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename(e);
                if (e.key === 'Escape') handleRenameCancel();
              }}
              onBlur={handleRename}
              className="bg-[hsl(var(--dark-6))] text-white text-sm p-1 w-full outline-none 
                        border border-[hsl(var(--primary))] rounded shadow-md"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div 
              className={`text-sm font-medium truncate ${
                isActive ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--dark-1))]'
              }`}
              title={displayName}
            >
              {isSpecialRoot ? SPECIAL_ROOT_ITEMS[file.id as keyof typeof SPECIAL_ROOT_ITEMS].name : displayName}
            </div>
          )}
          {isFile && (
            <div className="text-xs text-[hsl(var(--dark-3))]">
              Document
            </div>
          )}
          {!isFile && !isSpecialRoot && (
            <div className="text-xs text-[hsl(var(--dark-3))]">
              Folder
            </div>
          )}
          {isSpecialRoot && (
            <div className="text-xs text-[hsl(var(--dark-3))]">
              Special Folder
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="h-full bg-[hsl(var(--dark-9))] flex flex-col border-r border-gray-800/40 shadow-md" ref={treeRef}>
      {/* Header */}
      <div className="py-3 px-4 border-b border-gray-800/30 bg-gradient-to-r from-[hsl(var(--dark-8))] to-[hsl(var(--dark-9))] flex items-center">
        <h2 className="font-semibold text-white tracking-wide">Documents</h2>
        <div className="ml-auto flex space-x-1">
          <button 
            className="text-[hsl(var(--dark-2))] hover:text-white p-1.5 rounded hover:bg-[hsl(var(--dark-7))]
                      transition-colors duration-150 active:scale-95"
            onClick={() => handleNewFolder()}
            title="New folder"
          >
            <FolderPlus size={16} />
          </button>
          <button 
            className="text-[hsl(var(--dark-2))] hover:text-white p-1.5 rounded hover:bg-[hsl(var(--dark-7))]
                      transition-colors duration-150 active:scale-95"
            onClick={() => handleNewFile()}
            title="New file"
          >
            <FilePlus size={16} />
          </button>
        </div>
      </div>
      
      {/* Search Bar (always shown) */}
      <div className="px-3 py-2 border-b border-gray-800/30 flex items-center bg-[hsl(var(--dark-8))]">
        <div className="relative w-full">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[hsl(var(--dark-3))]" size={14} />
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search files and folders..."
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-[hsl(var(--dark-7))] text-white 
                      rounded-md outline-none border border-[hsl(var(--dark-6))] focus:border-[hsl(var(--primary))]
                      placeholder:text-[hsl(var(--dark-3))] transition-colors"
          />
          {searchTerm && (
            <button 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[hsl(var(--dark-3))] 
                        hover:text-white"
              onClick={() => setSearchTerm("")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {/* Breadcrumb Navigation */}
      {currentFolderId && (
        <div className="flex items-center py-2 px-4 border-b border-gray-800/30 bg-[hsl(var(--dark-8))]">
          <button
            className="flex items-center text-[hsl(var(--dark-2))] hover:text-white p-1 rounded hover:bg-[hsl(var(--dark-7))] mr-2
                      transition-colors duration-150 active:scale-95"
            onClick={handleNavigateUp}
          >
            <ArrowLeft size={16} className="mr-1" />
            <span className="text-sm">Back</span>
          </button>
          
          <div className="flex items-center overflow-x-auto whitespace-nowrap text-sm rounded-md py-1">
            <span 
              className="text-[hsl(var(--dark-1))] hover:text-white cursor-pointer
                        transition-colors"
              onClick={() => setCurrentFolderId(null)}
            >
              ~
            </span>
            
            {currentPath.map((folder, index) => (
              <div key={folder.id} className="flex items-center">
                <span className="mx-1 text-[hsl(var(--dark-4))]">/</span>
                <span 
                  className={`hover:text-white cursor-pointer transition-colors ${
                    index === currentPath.length - 1 
                      ? 'text-white font-medium' 
                      : 'text-[hsl(var(--dark-2))]'
                  }`}
                  onClick={() => setCurrentFolderId(folder.id)}
                >
                  {cleanName(folder.name)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Content View (List View Only) */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-[hsl(var(--dark-5))] scrollbar-track-transparent">
        {currentFolderContents.length > 0 ? (
          <div className="flex flex-col">
            {currentFolderContents.map(item => renderListItem(item))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-[hsl(var(--dark-3))]">
            <Folder size={48} className="mb-4 opacity-70" />
            <p className="text-center mb-2 font-medium">This folder is empty</p>
            {searchTerm && (
              <p className="text-center text-sm text-[hsl(var(--dark-4))] mb-4">
                No files match your search criteria
              </p>
            )}
            <div className="flex flex-col mt-3 space-y-2 w-40">
              <button
                className="w-full px-3 py-2 rounded bg-gradient-to-r from-[hsl(var(--dark-7))] to-[hsl(var(--dark-6))] 
                          hover:from-[hsl(var(--dark-6))] hover:to-[hsl(var(--dark-5))]
                          flex items-center justify-center shadow-md transition-all duration-150 active:scale-95"
                onClick={() => handleNewFolder()}
              >
                <FolderPlus size={14} className="mr-2" />
                <span className="text-sm">New Folder</span>
              </button>
              <button
                className="w-full px-3 py-2 rounded bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary-dark))] 
                          hover:brightness-110 flex items-center justify-center shadow-md transition-all duration-150 active:scale-95"
                onClick={() => handleNewFile()}
              >
                <FilePlus size={14} className="mr-2" />
                <span className="text-sm">New File</span>
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Context Menu */}
      {contextMenu && (
        <div 
          className="fixed bg-[hsl(var(--dark-8))] border border-[hsl(var(--dark-6))] shadow-lg rounded-md z-50 py-1 overflow-hidden
                     backdrop-blur-md bg-opacity-90"
          style={{ 
            left: `${contextMenu.x}px`, 
            top: `${contextMenu.y}px`,
            minWidth: '180px'
          }}
        >
          <button
            className="w-full text-left px-3 py-2 text-sm text-[hsl(var(--dark-1))] hover:bg-[hsl(var(--dark-7))] flex items-center"
            onClick={() => {
              const file = findFileById(documents, contextMenu.id);
              if (file) {
                setRenameItem(contextMenu.id);
                setRenameValue(cleanName(file.name));
                setContextMenu(null);
              }
            }}
          >
            <Edit size={14} className="mr-2" /> Rename
          </button>
          <button
            className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-900/30 hover:text-red-300 flex items-center"
            onClick={() => handleDelete(contextMenu.id)}
          >
            <Trash size={14} className="mr-2" /> Delete
          </button>
          
          {findFileById(documents, contextMenu.id)?.type === 'folder' && (
            <>
              <div className="border-t border-[hsl(var(--dark-6))] my-1"></div>
              <button
                className="w-full text-left px-3 py-2 text-sm text-[hsl(var(--dark-1))] hover:bg-[hsl(var(--dark-7))] flex items-center"
                onClick={() => handleNewFile(contextMenu.id)}
              >
                <FilePlus size={14} className="mr-2" /> New File
              </button>
              <button
                className="w-full text-left px-3 py-2 text-sm text-[hsl(var(--dark-1))] hover:bg-[hsl(var(--dark-7))] flex items-center"
                onClick={() => handleNewFolder(contextMenu.id)}
              >
                <FolderPlus size={14} className="mr-2" /> New Folder
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FileTree;
