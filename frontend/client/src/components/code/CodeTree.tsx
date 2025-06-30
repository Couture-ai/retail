import { useState, useRef, useEffect, useCallback } from "react";
import { useWorkspace } from "@/context/WorkspaceProvider";
import { TreeNode, LayoutNode, EditorPanelNode } from "@/types";
import { 
  ChevronDown, 
  ChevronRight, 
  Folder, 
  FileCode, 
  FileJson, 
  File, 
  GitBranch, 
  FolderPlus, 
  FilePlus, 
  ChevronUp, 
  Trash2, 
  PencilLine, 
  MoreVertical,
  ChevronsDownUp,
  ChevronsUpDown,
  GitFork,
  Github
} from "lucide-react";
import { GenericDropdown, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { IconButton } from "@/components/ui/icon-button";
import { SelectionDropdown, Option } from "@/components/ui/selection-dropdown";

type CodeTreeProps = {
  codeFiles: TreeNode[];
  onFileOpen?: (fileId: string) => void;
};

// Helper to find the active file ID in the currently active panel
const findActiveFileInActivePanel = (layout: LayoutNode, activePanelId: string | null): string | null => {
  if (!activePanelId) return null;
  
  const findPanel = (node: LayoutNode): EditorPanelNode | null => {
     if (node.type === 'panel' && node.id === activePanelId) return node;
     if (node.type === 'splitter') {
        const found1 = findPanel(node.children[0]);
        if (found1) return found1;
        return findPanel(node.children[1]);
     }
     return null;
  };
  
  const activePanel = findPanel(layout);
  return activePanel?.activeTabId || null;
};

const DRAG_DATA_TREE_NODE = 'application/json+tree-node';
const DRAG_DATA_EDITOR_FILE = 'application/json'; // Keep existing format for editor drop
const HOVER_EXPAND_DELAY = 700; // milliseconds

type DraggedNodeInfo = {
  id: string;
  type: 'file' | 'folder';
  parentId: string | null;
};

const CodeTree = ({ codeFiles, onFileOpen }: CodeTreeProps) => {
  const { setCodeFiles, editorLayout, activePanelId } = useWorkspace();
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    "src": true,
    "components": true
  });
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [renameItem, setRenameItem] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [showContextMenu, setShowContextMenu] = useState<{id: string, x: number, y: number} | null>(null);
  
  // Drag and Drop State
  const [draggedNodeInfo, setDraggedNodeInfo] = useState<DraggedNodeInfo | null>(null);
  const [dropTargetNodeId, setDropTargetNodeId] = useState<string | null>(null);
  const [isDraggingOverFolder, setIsDraggingOverFolder] = useState(false); // For folder highlight
  const hoverExpandTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const treeRef = useRef<HTMLDivElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);
  
  // Determine the currently active file based on the active panel
  const currentActiveFileId = findActiveFileInActivePanel(editorLayout, activePanelId);
  
  // Repository selection state
  const [selectedRepo, setSelectedRepo] = useState("solar-system");
  
  // Mock repository options
  const repoOptions: Option[] = [
    { value: "solar-system", label: "solar-system-simulator", icon: <Github size={14} /> },
    { value: "cosmos-explorer", label: "cosmos-explorer", icon: <Github size={14} /> },
    { value: "planet-renderer", label: "3d-planet-renderer", icon: <Github size={14} /> },
    { value: "gravity-sim", label: "gravity-simulator", icon: <Github size={14} /> },
    { value: "space-station", label: "iss-tracker", icon: <Github size={14} /> },
  ];
  
  // Handle click outside to deselect folder and hide context menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (treeRef.current && !treeRef.current.contains(e.target as Node)) {
        setSelectedFolder(null);
        setShowContextMenu(null);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  // Focus rename input when renaming
  useEffect(() => {
    if (renameItem && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renameItem]);
  
  const toggleFolder = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };
  
  const handleFolderClick = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFolder(folderId);
  };
  
  const collapseAll = useCallback(() => {
    setExpandedFolders({});
  }, []);
  
  const expandAll = useCallback(() => {
    const allFolders: Record<string, boolean> = {};
    const traverseAndCollect = (nodes: TreeNode[]) => {
      for (const node of nodes) {
        if (node.type === 'folder') {
          allFolders[node.id] = true;
          if (node.children) {
            traverseAndCollect(node.children);
          }
        }
      }
    };
    traverseAndCollect(codeFiles);
    setExpandedFolders(allFolders);
  }, [codeFiles]);
  
  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.json')) {
      return <FileJson className="text-[hsl(var(--dark-2))] mr-2" size={16} />;
    } else if (fileName.endsWith('.js') || fileName.endsWith('.jsx') || fileName.endsWith('.ts') || fileName.endsWith('.tsx')) {
      return <FileCode className="text-[hsl(var(--dark-2))] mr-2" size={16} />;
    } else {
      return <File className="text-[hsl(var(--dark-2))] mr-2" size={16} />;
    }
  };
  
  const handleCreateFile = (parentId: string | null = null) => {
    // If no parent ID provided but a folder is selected, use that as parent
    const effectiveParentId = parentId || selectedFolder;
    
    const newFile: TreeNode = {
      id: Date.now().toString(),
      name: "NewFile.js",
      type: "file",
      path: effectiveParentId ? `/${effectiveParentId}/NewFile.js` : "/NewFile.js"
    };
    
    setCodeFiles((prev: TreeNode[]) => {
      if (!effectiveParentId) {
        return [...prev, newFile];
      }
      
      const updatedFiles = [...prev];
      const updateChildren = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map(node => {
          if (node.id === effectiveParentId) {
            return {
              ...node,
              children: [...(node.children || []), newFile]
            };
          }
          if (node.children) {
            return {
              ...node,
              children: updateChildren(node.children)
            };
          }
          return node;
        });
      };
      
      return updateChildren(updatedFiles);
    });
    
    // Ensure the parent folder is expanded
    if (effectiveParentId) {
      setExpandedFolders(prev => ({
        ...prev,
        [effectiveParentId]: true
      }));
    }
    
    // Start rename immediately
    setTimeout(() => {
      setRenameItem(newFile.id);
      setRenameValue(newFile.name);
    }, 50);
  };
  
  const handleCreateFolder = (parentId: string | null = null) => {
    // If no parent ID provided but a folder is selected, use that as parent
    const effectiveParentId = parentId || selectedFolder;
    
    const newFolder: TreeNode = {
      id: Date.now().toString(),
      name: "NewFolder",
      type: "folder",
      path: effectiveParentId ? `/${effectiveParentId}/NewFolder` : "/NewFolder",
      children: []
    };
    
    setCodeFiles((prev: TreeNode[]) => {
      if (!effectiveParentId) {
        return [...prev, newFolder];
      }
      
      const updatedFiles = [...prev];
      const updateChildren = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map(node => {
          if (node.id === effectiveParentId) {
            return {
              ...node,
              children: [...(node.children || []), newFolder]
            };
          }
          if (node.children) {
            return {
              ...node,
              children: updateChildren(node.children)
            };
          }
          return node;
        });
      };
      
      return updateChildren(updatedFiles);
    });
    
    // Expand the parent folder and the new folder
    if (effectiveParentId) {
      setExpandedFolders(prev => ({
        ...prev,
        [effectiveParentId]: true
      }));
    }
    
    setTimeout(() => {
      setRenameItem(newFolder.id);
      setRenameValue(newFolder.name);
    }, 50);
  };
  
  const handleContextMenu = (e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setShowContextMenu({
      id: nodeId,
      x: e.clientX,
      y: e.clientY
    });
  };
  
  const startRename = (nodeId: string) => {
    const node = findNodeById(codeFiles, nodeId);
    if (node) {
      setRenameItem(nodeId);
      setRenameValue(node.name);
    }
    setShowContextMenu(null);
  };
  
  const handleRename = (e: React.KeyboardEvent | React.FocusEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    
    if (renameItem && renameValue.trim()) {
      setCodeFiles((prev: TreeNode[]) => {
        const updateNodeName = (nodes: TreeNode[]): TreeNode[] => {
          return nodes.map(node => {
            if (node.id === renameItem) {
              return { ...node, name: renameValue };
            }
            if (node.children) {
              return { ...node, children: updateNodeName(node.children) };
            }
            return node;
          });
        };
        
        return updateNodeName(prev);
      });
      
      setRenameItem(null);
    }
  };
  
  const handleDoubleClick = (node: TreeNode, e: React.MouseEvent) => {
    e.stopPropagation();
    // For both files and folders, start rename on double-click
    startRename(node.id);
  };
  
  const handleDelete = (nodeId: string) => {
    // Clear selected folder if deleting the selected folder
    if (nodeId === selectedFolder) {
      setSelectedFolder(null);
    }
    
    // Note: We might need to inform the context to close this file if it's open in any panel.
    // For now, just remove from the tree structure.
    // TODO: Implement closeFileInAllPanels(nodeId) in context?

    setCodeFiles((prev: TreeNode[]) => {
      const deleteNode = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.filter(node => {
          if (node.id === nodeId) {
            return false;
          }
          
          if (node.children) {
            node.children = deleteNode(node.children);
          }
          
          return true;
        });
      };
      
      return deleteNode(prev);
    });
    
    setShowContextMenu(null);
  };
  
  const findNodeById = (nodes: TreeNode[], id: string): TreeNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };
  
  const handleFileDragStart = (e: React.DragEvent, fileId: string) => {
    e.stopPropagation(); // Prevent triggering folder drag/click
    
    // Set the data for the drop target (EditorPanel)
    const dragData = JSON.stringify({ fileId, contentType: 'code' });
    e.dataTransfer.setData('application/json', dragData);
    e.dataTransfer.effectAllowed = 'move';
    
    console.log("File drag started with data:", { fileId, contentType: 'code' });
  };
  
  // --- Helper Functions (Find Parent, Update Tree) ---
  const findParentId = (nodes: TreeNode[], childId: string): string | null => {
    for (const node of nodes) {
      if (node.children?.some(child => child.id === childId)) {
        return node.id;
      }
      if (node.children) {
        const parentId = findParentId(node.children, childId);
        if (parentId) return parentId;
      }
    }
    return null;
  };

  // Recursive function to remove a node by ID
  const removeNode = (nodes: TreeNode[], nodeId: string): TreeNode[] => {
    return nodes.filter(node => {
      if (node.id === nodeId) return false;
      if (node.children) {
        node.children = removeNode(node.children, nodeId);
      }
      return true;
    });
  };

  // Recursive function to insert a node relative to a target node ID
  const insertNode = (nodes: TreeNode[], nodeToInsert: TreeNode, targetId: string, position: 'before' | 'after' | 'inside', targetIsFolder: boolean): TreeNode[] => {
    // Insert into root if target is not found (or handle error)
    let inserted = false;
    const result = nodes.flatMap(node => {
      if (node.id === targetId) {
        inserted = true;
        if (position === 'inside' && targetIsFolder) {
          // Insert inside the target folder
          return [{ ...node, children: [...(node.children || []), nodeToInsert] }];
        } else if (position === 'before') {
          return [nodeToInsert, node];
        } else { // 'after'
          return [node, nodeToInsert];
        }
      }
      if (node.children) {
        const updatedChildren = insertNode(node.children, nodeToInsert, targetId, position, targetIsFolder);
        // Check if insertion happened in children
        if (updatedChildren.length !== node.children.length) inserted = true; 
        return [{ ...node, children: updatedChildren }];
      }
      return [node]; // Return as array for flatMap
    });

    // If the target was not found anywhere, append to root (or handle differently)
    // This case shouldn't happen if targetId is always valid from drag events
    if (!inserted && position === 'inside' && targetIsFolder) {
       console.warn("Target folder for insertion not found, inserting at root - THIS SHOULDNT HAPPEN");
       // This fallback might be wrong depending on desired behavior
       return [...nodes, nodeToInsert]; 
    }
    
    return result;
  };

  // --- Drag and Drop Handlers ---
  const handleDragStart = useCallback((e: React.DragEvent, node: TreeNode) => {
    e.stopPropagation();
    const parentId = findParentId(codeFiles, node.id);
    const info: DraggedNodeInfo = { id: node.id, type: node.type, parentId };
    setDraggedNodeInfo(info);
    
    // Data for tree operations
    e.dataTransfer.setData(DRAG_DATA_TREE_NODE, JSON.stringify(info));
    
    // Data for dropping files onto the editor (only for files)
    if (node.type === 'file') {
      e.dataTransfer.setData(DRAG_DATA_EDITOR_FILE, JSON.stringify({ fileId: node.id }));
    }
    
    e.dataTransfer.effectAllowed = 'move';
  }, [codeFiles]); // Recalculate if codeFiles changes

  const clearHoverTimer = () => {
    if (hoverExpandTimerRef.current) {
      clearTimeout(hoverExpandTimerRef.current);
      hoverExpandTimerRef.current = null;
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent, targetNode: TreeNode) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedNodeInfo || draggedNodeInfo.id === targetNode.id) return;

    e.dataTransfer.dropEffect = 'move';
    setDropTargetNodeId(targetNode.id);

    if (targetNode.type === 'folder') {
      setIsDraggingOverFolder(true);
      // Hover-to-open logic
      if (!expandedFolders[targetNode.id] && !hoverExpandTimerRef.current) {
        hoverExpandTimerRef.current = setTimeout(() => {
          setExpandedFolders(prev => ({ ...prev, [targetNode.id]: true }));
          hoverExpandTimerRef.current = null; 
        }, HOVER_EXPAND_DELAY);
      }
    } else {
      setIsDraggingOverFolder(false);
      clearHoverTimer(); // Clear timer if not hovering over a folder
    }
  }, [draggedNodeInfo, expandedFolders]);

  const handleDragLeave = useCallback((e: React.DragEvent, targetNode: TreeNode) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropTargetNodeId === targetNode.id) {
       setDropTargetNodeId(null);
       setIsDraggingOverFolder(false);
       clearHoverTimer();
    }
  }, [dropTargetNodeId]);

  const handleDrop = useCallback((e: React.DragEvent, targetNode: TreeNode) => {
    e.preventDefault();
    e.stopPropagation();
    clearHoverTimer();
    setIsDraggingOverFolder(false);
    setDropTargetNodeId(null);
    
    const draggedInfoJson = e.dataTransfer.getData(DRAG_DATA_TREE_NODE);
    if (!draggedInfoJson) {
      console.warn("Drop event without expected tree node data");
      setDraggedNodeInfo(null);
      return; // Or handle other drop types if necessary
    }
    
    const draggedInfo: DraggedNodeInfo = JSON.parse(draggedInfoJson);
    if (!draggedInfo || draggedInfo.id === targetNode.id) {
       setDraggedNodeInfo(null);
       return; // Cannot drop onto self
    }

    setCodeFiles(currentCodeFiles => {
      // 1. Find the node being dragged
      const nodeToMove = findNodeById(currentCodeFiles, draggedInfo.id);
      if (!nodeToMove) return currentCodeFiles; // Should not happen

      // 2. Remove the node from its original position
      let tempTree = removeNode(currentCodeFiles, draggedInfo.id);

      // 3. Insert the node at the new position
      let newTree: TreeNode[];
      if (targetNode.type === 'folder') {
        // Dropping onto a folder: insert inside
        newTree = insertNode(tempTree, nodeToMove, targetNode.id, 'inside', true);
        // Ensure target folder is expanded after drop
        setExpandedFolders(prev => ({ ...prev, [targetNode.id]: true }));
      } else {
        // Dropping onto a file: insert before/after within the same parent
        // Determine position based on drop coordinates (simplification: insert 'before')
        // TODO: More precise positioning (before/after based on Y coord)?
        const targetParentId = findParentId(tempTree, targetNode.id);
        if (draggedInfo.parentId === targetParentId) { // Only allow reorder within same parent
           newTree = insertNode(tempTree, nodeToMove, targetNode.id, 'before', false);
        } else {
           // Invalid drop (file onto file in different folder) - revert removal
           console.warn("Invalid drop: file onto file in different folder");
           newTree = currentCodeFiles; 
        }
      }
      return newTree;
    });

    setDraggedNodeInfo(null);
  }, []);

  const handleDragEnd = useCallback(() => {
    // Clear all drag state regardless of drop success
    clearHoverTimer();
    setDraggedNodeInfo(null);
    setDropTargetNodeId(null);
    setIsDraggingOverFolder(false);
  }, []);
  
  const renderNode = (node: TreeNode, depth: number = 0) => {
    const isFolder = node.type === 'folder';
    const isExpanded = expandedFolders[node.id];
    const isActive = node.id === currentActiveFileId;
    const isFolderSelected = node.id === selectedFolder;
    const isRenaming = node.id === renameItem;
    
    const isFile = !isFolder && !isRenaming; 
    
    const isDropTarget = node.id === dropTargetNodeId;
    const showFolderDropHighlight = isDropTarget && isDraggingOverFolder && isFolder;
    const isBeingDragged = node.id === draggedNodeInfo?.id;

    return (
      <div 
        key={node.id} 
        className={`tree-node-wrapper ${isBeingDragged ? 'opacity-50' : ''}`}
      >
        <div 
          draggable={!isRenaming} // Can drag files and folders unless renaming
          onDragStart={!isRenaming ? (e) => handleDragStart(e, node) : undefined}
          onDragEnd={handleDragEnd} // Add drag end to clear state
          // Drag over/leave/drop handlers added here
          onDragEnter={!isRenaming ? (e) => handleDragOver(e, node) : undefined} // Use DragOver for hover detection
          onDragOver={!isRenaming ? (e) => handleDragOver(e, node) : undefined} 
          onDragLeave={!isRenaming ? (e) => handleDragLeave(e, node) : undefined}
          onDrop={!isRenaming ? (e) => handleDrop(e, node) : undefined}
          className={`flex items-center py-1 px-2 rounded cursor-pointer select-none
            ${isActive && isFile ? 'bg-[hsl(var(--dark-7))]' : ''}
            ${isFolderSelected && isFolder ? 'bg-[hsl(var(--dark-7))/40]' : ''}
            ${showFolderDropHighlight ? 'border border-[hsl(var(--primary))] bg-[hsl(var(--primary))/10]' : 'border border-transparent'} 
            hover:bg-[hsl(var(--dark-7))/80]
          `}
          style={{ paddingLeft: `${(depth * 12) + 8}px` }}
          onClick={(e) => {
            if (isRenaming) return; // Prevent actions while renaming
            if (isFolder) {
              handleFolderClick(node.id, e);
            } else {
              if (onFileOpen) {
                onFileOpen(node.id);
              }
              setSelectedFolder(null);
            }
          }}
          onDoubleClick={(e) => {!isRenaming && handleDoubleClick(node, e)}}
          onContextMenu={(e) => {!isRenaming && handleContextMenu(e, node.id)}}
        >
          {isFolder ? (
            <>
              <span 
                className="mr-1 cursor-pointer" 
                onClick={(e) => toggleFolder(node.id, e)}
              >
                {isExpanded ? (
                  <ChevronDown className="text-[hsl(var(--dark-2))]" size={16} />
                ) : (
                  <ChevronRight className="text-[hsl(var(--dark-2))]" size={16} />
                )}
              </span>
              <Folder className={`mr-2 ${isFolderSelected ? 'text-white' : 'text-[hsl(var(--dark-2))]'}`} size={16} />
            </>
          ) : (
            <>
              <span className="w-[16px] mr-1"></span>
              {getFileIcon(node.name)}
            </>
          )}
          
          {isRenaming ? (
            <input
              ref={renameInputRef}
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename(e);
                if (e.key === 'Escape') setRenameItem(null);
              }}
              onBlur={handleRename}
              className="bg-[hsl(var(--dark-6))] text-white text-sm p-0.5 w-full outline-none border border-[hsl(var(--primary))] rounded"
              onClick={(e) => e.stopPropagation()} // Prevent click on row while renaming
            />
          ) : (
            <span className={`text-sm flex-1 truncate ${
              isActive && isFile ? 'text-[hsl(var(--primary))]' : 
              isFolderSelected && isFolder ? 'text-white' : 
              'text-[hsl(var(--dark-1))]'
            }`}>
              {node.name}
            </span>
          )}
        </div>
        
        {isFolder && isExpanded && node.children && (
          <div className="folder-children">
            {node.children.length > 0 ? (
              node.children.map(child => renderNode(child, depth + 1))
            ) : (
              <div 
                className="text-xs text-[hsl(var(--dark-3))] italic pl-2 py-1"
                style={{ paddingLeft: `${((depth + 1) * 12) + 8 + 16 + 8}px` }} // Align with file text
                // Add drop handler for empty folders
                onDragOver={(e) => handleDragOver(e, node)} // Allow dropping INTO the empty folder text
                onDragLeave={(e) => handleDragLeave(e, node)}
                onDrop={(e) => handleDrop(e, node)} // Drop onto the parent folder node
              >
                Folder is empty
              </div>
            )}
          </div>
        )}
      </div>
    );
  };
  
  // Define menu items for the dropdown
  const treeMenuItems = [
    {
      id: 'expand-all',
      label: 'Expand All',
      icon: <ChevronsDownUp size={14} />,
      action: expandAll,
    },
    {
      id: 'collapse-all',
      label: 'Collapse All',
      icon: <ChevronsUpDown size={14} />,
      action: collapseAll,
    },
    // Adding more items to better demonstrate search functionality
    {
      id: 'new-file',
      label: 'New File',
      icon: <FilePlus size={14} />,
      action: () => handleCreateFile(),
    },
    {
      id: 'new-folder',
      label: 'New Folder',
      icon: <FolderPlus size={14} />,
      action: () => handleCreateFolder(),
    }
  ];
  
  // Handler for repository change
  const handleRepoChange = (value: string) => {
    setSelectedRepo(value);
    // In a real app, you would load the files for this repository
    console.log(`Changed to repository: ${value}`);
  };

  return (
    <div className="bg-[hsl(var(--dark-8))] flex flex-col border-r border-gray-700/50 h-full overflow-hidden" ref={treeRef}>
      {/* Repository Header with Dropdown */}
      <div className="p-2 border-b border-gray-700/50 flex items-center justify-between flex-shrink-0">
        <div className="flex-1 mr-2 overflow-hidden max-w-[65%]">
          <SelectionDropdown 
            options={repoOptions}
            value={selectedRepo}
            onChange={handleRepoChange}
            showSearch={true}
            searchPlaceholder="Find repository..."
            buttonClassName="w-full font-medium text-white overflow-hidden"
            showSelectedIcon={false}
          />
        </div>
        <div className="flex items-center space-x-1 flex-shrink-0">
          <IconButton 
            className="p-1 text-[hsl(var(--dark-2))] hover:text-white rounded hover:bg-[hsl(var(--dark-7))]"
            onClick={() => handleCreateFolder()}
            title="New folder"
            size="sm"
          >
            <FolderPlus size={14} />
          </IconButton>
          <IconButton 
            className="p-1 text-[hsl(var(--dark-2))] hover:text-white rounded hover:bg-[hsl(var(--dark-7))]"
            onClick={() => handleCreateFile()}
            title="New file"
            size="sm"
          >
            <FilePlus size={14} />
          </IconButton>
          <GenericDropdown
            trigger={
              <IconButton 
                className="p-1 text-[hsl(var(--dark-2))] hover:text-white rounded hover:bg-[hsl(var(--dark-7))]"
                title="More options"
                size="sm"
              >
                <MoreVertical size={14} />
              </IconButton>
            }
            menuItems={treeMenuItems}
            side="right"
            showSearch={true}
            contentProps={{ sideOffset: 6 }}
          />
        </div>
      </div>
      
      {/* File Tree */}
      <div className="flex-1 overflow-auto p-2 min-w-full">
        <div className="min-w-max">
          {codeFiles.map(file => renderNode(file))}
        </div>
      </div>
      
      {/* Context Menu */}
      {showContextMenu && (
        <div 
          className="fixed bg-[hsl(var(--dark-8))] border border-gray-700 shadow-lg rounded z-50 py-1"
          style={{ 
            left: `${showContextMenu.x}px`, 
            top: `${showContextMenu.y}px`,
            minWidth: '160px'
          }}
        >
          <button
            className="w-full text-left px-3 py-1.5 text-sm text-[hsl(var(--dark-1))] hover:bg-[hsl(var(--dark-7))] flex items-center"
            onClick={() => startRename(showContextMenu.id)}
          >
            <PencilLine size={14} className="mr-2" /> Rename
          </button>
          <button
            className="w-full text-left px-3 py-1.5 text-sm text-[hsl(var(--dark-1))] hover:bg-[hsl(var(--dark-7))] flex items-center"
            onClick={() => handleDelete(showContextMenu.id)}
          >
            <Trash2 size={14} className="mr-2" /> Delete
          </button>
          
          {findNodeById(codeFiles, showContextMenu.id)?.type === 'folder' && (
            <>
              <div className="border-t border-gray-700 my-1"></div>
              <button
                className="w-full text-left px-3 py-1.5 text-sm text-[hsl(var(--dark-1))] hover:bg-[hsl(var(--dark-7))] flex items-center"
                onClick={() => handleCreateFile(showContextMenu.id)}
              >
                <FilePlus size={14} className="mr-2" /> New File
              </button>
              <button
                className="w-full text-left px-3 py-1.5 text-sm text-[hsl(var(--dark-1))] hover:bg-[hsl(var(--dark-7))] flex items-center"
                onClick={() => handleCreateFolder(showContextMenu.id)}
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

export default CodeTree;
