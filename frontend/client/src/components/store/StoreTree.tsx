import { useState, useEffect, useCallback, useRef } from "react";
import { 
  ChevronDown, 
  ChevronRight, 
  MapPin, 
  Building, 
  Globe, 
  Map,
  Store,
  Loader2,
  AlertCircle,
  BarChart3,
  Search,
  Plus,
  X
} from "lucide-react";
import { ForecastRepository } from "@/repository/forecast_repository";
import { useProject } from "@/context/ProjectProvider";

interface StoreNode {
  id: string;
  name: string;
  level: string; // Made generic to support dynamic hierarchy
  parent?: string;
  children?: StoreNode[];
  expanded?: boolean;
  loading?: boolean;
  count?: number;
  // Context information for building queries - dynamic based on hierarchy
  context?: Record<string, string>;
  // Search-related properties
  searchActive?: boolean;
  searchTerm?: string;
  allChildren?: StoreNode[]; // Store all children for search filtering
  // Global search properties
  searchMatch?: boolean;
  searchPath?: string; // Full path from root for display
}

interface StoreTreeProps {
  onStoreSelect: (storeId: string, storeInfo: any) => void;
  selectedStoreId: string | null;
  onNewStoreClick?: () => void;
}

const StoreTree = ({ onStoreSelect, selectedStoreId, onNewStoreClick }: StoreTreeProps) => {
  const [treeData, setTreeData] = useState<StoreNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hierarchy, setHierarchy] = useState<string[]>([]);
  
  // Global search state
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [globalSearchResults, setGlobalSearchResults] = useState<StoreNode[]>([]);
  const [isGlobalSearching, setIsGlobalSearching] = useState(false);
  const [showGlobalSearchResults, setShowGlobalSearchResults] = useState(false);
  
  // Initialize forecast repository
  const {forecastRepository: forecastRepo} = useProject();
  // Debounce ref for search
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const globalSearchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Load forecast metadata to get hierarchy
  useEffect(() => {
    loadMetadata();
  }, []);
  
  // Cleanup search timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (globalSearchTimeoutRef.current) {
        clearTimeout(globalSearchTimeoutRef.current);
      }
    };
  }, []);
  
  // Global search effect
  useEffect(() => {
    if (globalSearchTerm.trim()) {
      // Clear existing timeout
      if (globalSearchTimeoutRef.current) {
        clearTimeout(globalSearchTimeoutRef.current);
      }
      
      // Set new timeout for debounced search
      globalSearchTimeoutRef.current = setTimeout(() => {
        performGlobalSearch(globalSearchTerm);
      }, 300); // 300ms debounce
    } else {
      setGlobalSearchResults([]);
      setShowGlobalSearchResults(false);
    }
  }, [globalSearchTerm]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showGlobalSearchResults) {
        setGlobalSearchTerm('');
        setShowGlobalSearchResults(false);
        setGlobalSearchResults([]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showGlobalSearchResults]);
  
  const loadMetadata = async () => {
    try {
      const stateSetters = {
        setLoading: () => {},
        setError: (err: string | null) => setError(err),
        setData: (data: any) => {
          if (data && data.store_location_hierarchy) {
            // Add store_no to the hierarchy if not already present
            const fullHierarchy = [...data.store_location_hierarchy];
            if (!fullHierarchy.includes('store_no')) {
              fullHierarchy.push('store_no');
            }
            setHierarchy(fullHierarchy);
            // Load the first level after getting hierarchy
            loadTopLevel(fullHierarchy[0]);
          }
        }
      };
      
      await forecastRepo.getMetadata({}, stateSetters);
    } catch (err) {
      console.error('Error loading metadata:', err);
      setError('Failed to load metadata');
      setLoading(false);
    }
  };
  
  const loadTopLevel = async (topLevelField: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const sqlQuery = `
        SELECT ${topLevelField}, COUNT(*) as count 
        FROM forecast 
        WHERE ${topLevelField} IS NOT NULL 
        GROUP BY ${topLevelField} 
        ORDER BY ${topLevelField}
      `;
      
      const stateSetters = {
        setLoading: () => {},
        setError: (err: string | null) => setError(err),
        setData: (data: any) => {
          if (data && data.data) {
            const nodes: StoreNode[] = data.data.map((row: any) => ({
              id: `${topLevelField}-${row[topLevelField]}`,
              name: row[topLevelField],
              level: topLevelField,
              count: row.count,
              children: [],
              expanded: false,
              context: { [topLevelField]: row[topLevelField] }
            }));
            setTreeData(nodes);
          }
        }
      };
      
      await forecastRepo.executeSqlQuery({ sql_query: sqlQuery }, stateSetters);
    } catch (err) {
      console.error('Error loading top level:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };
  
  const loadChildren = async (node: StoreNode) => {
    try {
      // Mark node as loading
      setTreeData(prevData => updateNodeInTree(prevData, node.id, { loading: true }));
      
      const currentLevelIndex = hierarchy.indexOf(node.level);
      if (currentLevelIndex === -1 || currentLevelIndex >= hierarchy.length - 1) {
        // No children for this level
        setTreeData(prevData => updateNodeInTree(prevData, node.id, { loading: false }));
        return;
      }
      
      const childLevel = hierarchy[currentLevelIndex + 1];
      
      // Build WHERE clause from node context
      const whereConditions = Object.entries(node.context || {})
        .map(([key, value]) => `${key} = '${value}'`)
        .join(' AND ');
      
      const sqlQuery = `
        SELECT ${childLevel}, COUNT(*) as count 
        FROM forecast 
        WHERE ${whereConditions} AND ${childLevel} IS NOT NULL 
        GROUP BY ${childLevel} 
        ORDER BY ${childLevel}
      `;
      
      const stateSetters = {
        setLoading: () => {},
        setError: (err: string | null) => setError(err),
        setData: (data: any) => {
          if (data && data.data) {
            const children: StoreNode[] = data.data.map((row: any) => ({
              id: `${childLevel}-${node.id}-${row[childLevel]}`,
              name: row[childLevel],
              level: childLevel,
              parent: node.id,
              count: row.count,
              children: childLevel !== 'store_no' ? [] : undefined,
              expanded: false,
              context: {
                ...node.context,
                [childLevel]: row[childLevel]
              }
            }));
            
            // Update the node with children
            setTreeData(prevData => updateNodeInTree(prevData, node.id, { 
              children, 
              allChildren: children, // Store all children for search filtering
              expanded: true, 
              loading: false 
            }));
          }
        }
      };
      
      await forecastRepo.executeSqlQuery({ sql_query: sqlQuery }, stateSetters);
    } catch (err) {
      console.error('Error loading children:', err);
      setError('Failed to load data');
      // Remove loading state
      setTreeData(prevData => updateNodeInTree(prevData, node.id, { loading: false }));
    }
  };
  
  // Helper function to update a node in the tree
  const updateNodeInTree = (nodes: StoreNode[], nodeId: string, updates: Partial<StoreNode>): StoreNode[] => {
    return nodes.map(node => {
      if (node.id === nodeId) {
        return { ...node, ...updates };
      }
      if (node.children) {
        return { ...node, children: updateNodeInTree(node.children, nodeId, updates) };
      }
      return node;
    });
  };
  
  const handleNodeClick = (node: StoreNode) => {
    // For store_no (leaf nodes), open content directly
    if (node.level === 'store_no') {
      onStoreSelect(node.id, node);
      return;
    }
    
    // For other levels, only expand/collapse the tree node, don't open content
    if (!node.children || node.children.length === 0) {
      // Load children if not already loaded
      loadChildren(node);
    } else if (node.children && node.children.length > 0) {
      // Toggle expanded state
      setTreeData(prevData => updateNodeInTree(prevData, node.id, { expanded: !node.expanded }));
    }
  };
  
  const handleAnalyticsClick = (node: StoreNode, e: React.MouseEvent) => {
    e.stopPropagation();
    // Open the analytics content for this node
    onStoreSelect(node.id, node);
  };
  
  const handleStoreDragStart = (e: React.DragEvent, node: StoreNode) => {
    e.stopPropagation();
    // Set drag data with store information
    const dragData = {
      id: node.id,
      type: 'store',
      level: node.level,
      name: node.name,
      context: node.context
    };
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const toggleExpanded = (node: StoreNode, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (node.expanded && node.children && node.children.length > 0) {
      // Collapse - also deactivate and close search if it's active
      if (node.searchActive) {
        // Clear any pending search timeout
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
          searchTimeoutRef.current = null;
        }
      }
      
      setTreeData(prevData => updateNodeInTree(prevData, node.id, { 
        expanded: false,
        searchActive: false,
        searchTerm: '',
        children: node.allChildren || node.children, // Reset to all children when collapsing
        loading: false // Also clear loading state
      }));
    } else {
      // Expand - load children if not already loaded
      if (!node.children || node.children.length === 0) {
        loadChildren(node);
      } else {
        setTreeData(prevData => updateNodeInTree(prevData, node.id, { expanded: true }));
      }
    }
  };
  
  const getIcon = (level: string) => {
    // Map hierarchy levels to icons dynamically
    const levelIndex = hierarchy.indexOf(level);
    const icons = [
      <Globe size={16} className="text-blue-400" />,
      <Map size={16} className="text-green-400" />,
      <Building size={16} className="text-yellow-400" />,
      <MapPin size={16} className="text-purple-400" />,
      <Store size={16} className="text-orange-400" />
    ];
    
    return icons[levelIndex] || <MapPin size={16} className="text-gray-400" />;
  };
  
  const renderNode = (node: StoreNode, depth: number = 0) => {
    const isSelected = selectedStoreId === node.id;
    const hasChildren = node.level !== 'store_no';
    const canExpand = hasChildren && (!node.children || node.children.length > 0 || !node.expanded);
    
    return (
      <div key={node.id}>
        <div
          className={`group flex items-center py-1 px-2 hover:bg-[hsl(var(--sidepanel-hover))] cursor-pointer rounded-sm relative ${
            isSelected ? 'bg-[hsl(var(--sidepanel-selected))] border-l-2 border-[hsl(var(--sidepanel-selected-border))]' : ''
          }`}
          style={{ paddingLeft: `${8 + depth * 16}px` }}
          onClick={() => handleNodeClick(node)}
          draggable
          onDragStart={(e) => handleStoreDragStart(e, node)}
        >
          {/* Expand/Collapse button */}
          <div className="w-4 h-4 flex items-center justify-center mr-1">
            {node.loading ? (
              <Loader2 size={12} className="animate-spin text-[hsl(var(--sidepanel-loading-foreground))]" />
            ) : canExpand ? (
              <button
                onClick={(e) => toggleExpanded(node, e)}
                className="hover:bg-[hsl(var(--sidepanel-button-hover))] rounded p-0.5"
              >
                {node.expanded ? (
                  <ChevronDown size={12} className="text-[hsl(var(--sidepanel-muted-foreground))]" />
                ) : (
                  <ChevronRight size={12} className="text-[hsl(var(--sidepanel-muted-foreground))]" />
                )}
              </button>
            ) : null}
          </div>
          
          {/* Icon - shows search icon on hover for non-leaf nodes */}
          <div className="w-4 h-4 flex items-center justify-center mr-2 relative">
            {getIcon(node.level)}
            {hasChildren && node.expanded && (
              <button
                onClick={(e) => handleSearchClick(node, e)}
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 hover:bg-[hsl(var(--sidepanel-button-hover))] rounded p-0.5 ${
                  node.searchActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
                title="Search"
              >
                <Search size={12} className="text-[hsl(var(--primary))]" />
              </button>
            )}
          </div>
          
          <div className="flex-1 flex items-center justify-between">
            <span className="text-[hsl(var(--sidepanel-foreground))] text-sm truncate">
              {node.level === 'store_no' ? `Store ${node.name}` : node.name}
            </span>
            <div className="flex items-center">
              {node.count && (
                <span className="text-[hsl(var(--sidepanel-muted-foreground))] text-xs mr-2">
                  ({node.count})
                </span>
              )}
              
              {/* Analytics button - shows on hover */}
              <button
                onClick={(e) => handleAnalyticsClick(node, e)}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-[hsl(var(--primary))/20] rounded"
                title="View Analytics"
              >
                <BarChart3 size={14} className="text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))/80]" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Search input - appears when search is active AND node is expanded */}
        {node.searchActive && node.expanded && (
          <div className="relative ml-6 mr-2 mb-2">
            <Search size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[hsl(var(--sidepanel-muted-foreground))]" />
            <input
              type="text"
              placeholder={`Search ${node.level}...`}
              value={node.searchTerm || ''}
              onChange={(e) => handleSearchTermChange(node, e.target.value)}
              className="w-full px-2 py-1 pr-8 text-sm bg-[hsl(var(--sidepanel-input-background))] text-[hsl(var(--sidepanel-foreground))] border border-[hsl(var(--sidepanel-input-border))] rounded focus:outline-none focus:border-[hsl(var(--primary))] placeholder-[hsl(var(--sidepanel-muted-foreground))]"
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSearchClick(node, e);
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[hsl(var(--sidepanel-muted-foreground))] hover:text-[hsl(var(--sidepanel-foreground))]"
            >
              <X size={12} />
            </button>
          </div>
        )}
        
        {/* Render children */}
        {node.expanded && node.children && node.children.map(child => renderNode(child, depth + 1))}
      </div>
    );
  };
  
  // Search functionality
  const handleSearchClick = async (node: StoreNode, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // If search is already active, just toggle it off
    if (node.searchActive) {
      setTreeData(prevData => updateNodeInTree(prevData, node.id, { 
        searchActive: false,
        searchTerm: '',
        children: node.allChildren || node.children // Reset to all children
      }));
      return;
    }
    
    // Activate search mode
    setTreeData(prevData => updateNodeInTree(prevData, node.id, { 
      searchActive: true,
      searchTerm: '',
      expanded: true
    }));
    
    // Load children if not already loaded
    if (!node.children || node.children.length === 0) {
      await loadChildren(node);
    }
  };

  const handleSearchTermChange = async (node: StoreNode, searchTerm: string) => {
    // Update search term immediately for responsive UI
    setTreeData(prevData => updateNodeInTree(prevData, node.id, { 
      searchTerm
    }));

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(node, searchTerm);
    }, 300); // 300ms debounce
  };

  const performSearch = async (node: StoreNode, searchTerm: string) => {
    // Set loading state
    setTreeData(prevData => updateNodeInTree(prevData, node.id, { 
      loading: true
    }));

    try {
      const currentLevelIndex = hierarchy.indexOf(node.level);
      if (currentLevelIndex === -1 || currentLevelIndex >= hierarchy.length - 1) {
        return;
      }
      
      const childLevel = hierarchy[currentLevelIndex + 1];
      
      // Build WHERE clause from node context
      const whereConditions = Object.entries(node.context || {})
        .map(([key, value]) => `${key} = '${value}'`)
        .join(' AND ');
      
      // Add search condition if search term is provided
      const searchCondition = searchTerm.trim() 
        ? ` AND ${childLevel} ILIKE '%${searchTerm.trim()}%'`
        : '';
      
      const sqlQuery = `
        SELECT ${childLevel}, COUNT(*) as count 
        FROM forecast 
        WHERE ${whereConditions} AND ${childLevel} IS NOT NULL${searchCondition}
        GROUP BY ${childLevel} 
        ORDER BY ${childLevel}
      `;
      
      const stateSetters = {
        setLoading: () => {},
        setError: (err: string | null) => setError(err),
        setData: (data: any) => {
          if (data && data.data) {
            const filteredChildren: StoreNode[] = data.data.map((row: any) => ({
              id: `${childLevel}-${node.id}-${row[childLevel]}`,
              name: row[childLevel],
              level: childLevel,
              parent: node.id,
              count: row.count,
              children: childLevel !== 'store_no' ? [] : undefined,
              expanded: false,
              context: {
                ...node.context,
                [childLevel]: row[childLevel]
              }
            }));
            
            // Update the node with filtered children
            setTreeData(prevData => updateNodeInTree(prevData, node.id, { 
              children: filteredChildren,
              loading: false
            }));
          }
        }
      };
      
      await forecastRepo.executeSqlQuery({ sql_query: sqlQuery }, stateSetters);
    } catch (err) {
      console.error('Error searching children:', err);
      setError('Failed to search data');
      setTreeData(prevData => updateNodeInTree(prevData, node.id, { loading: false }));
    }
  };

  const performGlobalSearch = async (searchTerm: string) => {
    setIsGlobalSearching(true);
    setShowGlobalSearchResults(true);
    setGlobalSearchResults([]);

    try {
      // Search through the existing tree data to find matches
      const results: StoreNode[] = [];
      const searchTermLower = searchTerm.toLowerCase();
      
      // Recursive function to search through tree nodes
      const searchInNode = (node: StoreNode, path: string[] = []): void => {
        const currentPath = [...path, node.name];
        
        // Check if current node matches search term
        if (node.name.toLowerCase().includes(searchTermLower)) {
          // For store_no nodes, ensure the name is formatted as "Store $store_no"
          const displayName = node.level === 'store_no' ? `Store ${node.name}` : node.name;
          
          results.push({
            ...node,
            name: displayName,
            searchMatch: true,
            searchPath: currentPath.join(' > '),
            expanded: false
          });
        }
        
        // Recursively search children
        if (node.children) {
          node.children.forEach(child => searchInNode(child, currentPath));
        }
      };
      
      // Search through all top-level nodes
      treeData.forEach(node => searchInNode(node));
      
      // If we have results, show them
      if (results.length > 0) {
        setGlobalSearchResults(results);
      } else {
        // If no results in existing tree, try to load more data and search
        await searchInDatabase(searchTerm);
      }
    } catch (err) {
      console.error('Error performing global search:', err);
      setError('Failed to search stores');
    } finally {
      setIsGlobalSearching(false);
    }
  };

  const searchInDatabase = async (searchTerm: string) => {
    try {
      // Build a comprehensive search query across all hierarchy levels
      const searchConditions = hierarchy.map(level => 
        `${level} ILIKE '%${searchTerm}%'`
      ).join(' OR ');
      
      const sqlQuery = `
        SELECT DISTINCT
          store_no,
          ${hierarchy.join(', ')}
        FROM forecast 
        WHERE (${searchConditions})
        AND store_no IS NOT NULL
        ORDER BY store_no
        LIMIT 100
      `;
      
      const stateSetters = {
        setLoading: () => {},
        setError: (err: string | null) => setError(err),
        setData: (data: any) => {
          if (data && data.data) {
            const results: StoreNode[] = data.data.map((row: any) => {
              // Build the full path from hierarchy data
              const path = hierarchy.map(level => row[level]).filter(Boolean);
              const pathString = path.join(' > ');
              
              return {
                id: `store_no-search-${row.store_no}`,
                name: `Store ${row.store_no}`,
                level: 'store_no',
                count: 1,
                searchMatch: true,
                searchPath: pathString,
                expanded: false,
                searchActive: false,
                searchTerm: '',
                children: [],
                allChildren: [],
                context: hierarchy.reduce((acc, level) => {
                  if (row[level]) acc[level] = row[level];
                  return acc;
                }, {} as Record<string, string>)
              };
            });
            
            setGlobalSearchResults(results);
          }
        }
      };
      
      await forecastRepo.executeSqlQuery({ sql_query: sqlQuery }, stateSetters);
    } catch (err) {
      console.error('Error searching database:', err);
      setError('Failed to search database');
    }
  };

  // Function to expand a node to show its stores without refreshing the tree
  const expandNodeToShowStore = async (node: StoreNode) => {
    try {
      // Find the node in the existing tree data
      const findNodeInTree = (nodes: StoreNode[], targetId: string): StoreNode | null => {
        for (const n of nodes) {
          if (n.id === targetId) return n;
          if (n.children) {
            const found = findNodeInTree(n.children, targetId);
            if (found) return found;
          }
        }
        return null;
      };

      // Find the node in the tree
      const treeNode = findNodeInTree(treeData, node.id);
      if (treeNode) {
        // If node is already expanded, just navigate to it
        if (treeNode.expanded) {
          onStoreSelect(treeNode.id, treeNode);
          return;
        }
        
        // Load children for this node
        await loadChildren(treeNode);
        
        // Navigate to the expanded node
        onStoreSelect(treeNode.id, treeNode);
      } else {
        // If node not found in tree, try to load it
        await loadChildren(node);
        onStoreSelect(node.id, node);
      }
    } catch (err) {
      console.error('Error expanding node:', err);
      setError('Failed to expand node');
    }
  };

  // Function to handle search result clicks without affecting tree state
  const handleSearchResultClick = (node: StoreNode) => {
    if (node.level === 'store_no') {
      // For store_no nodes, open directly
      onStoreSelect(node.id, node);
    } else {
      // For non-store nodes, expand to show stores
      expandNodeToShowStore(node);
    }
  };

  // Function to get the previous category from a search path
  const getPreviousCategory = (searchPath: string): string => {
    if (!searchPath) return '';
    
    const pathParts = searchPath.split(' > ');
    if (pathParts.length >= 2) {
      // Return the second-to-last part (previous category before store_no)
      return pathParts[pathParts.length - 2];
    }
    return '';
  };
  
  if (loading) {
    return (
      <div className="h-full bg-[hsl(var(--sidepanel-background))] p-4">
        <div className="flex items-center justify-center h-32">
          <Loader2 className="animate-spin text-[hsl(var(--sidepanel-loading-foreground))]" size={24} />
          <span className="ml-2 text-[hsl(var(--sidepanel-loading-foreground))]">Loading store hierarchy...</span>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="h-full bg-[hsl(var(--sidepanel-background))] p-4">
        <div className="flex items-center justify-center h-32">
          <AlertCircle className="text-[hsl(var(--sidepanel-error-foreground))]" size={24} />
          <span className="ml-2 text-[hsl(var(--sidepanel-error-foreground))]">{error}</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full bg-[hsl(var(--sidepanel-background))] flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-[hsl(var(--sidepanel-border))] flex items-center justify-between">
        <h3 className="text-sm font-medium text-[hsl(var(--sidepanel-foreground))]">Store Hierarchy</h3>
      </div>
      
      {/* Global Search Bar */}
      <div className="p-3 border-b border-[hsl(var(--sidepanel-border))]">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[hsl(var(--sidepanel-muted-foreground))]" />
          <input
            type="text"
            placeholder="Search stores across all levels..."
            value={globalSearchTerm}
            onChange={(e) => setGlobalSearchTerm(e.target.value)}
            className="w-full pl-10 pr-8 py-2 text-sm bg-[hsl(var(--sidepanel-input-background))] text-[hsl(var(--sidepanel-foreground))] border border-[hsl(var(--sidepanel-input-border))] rounded focus:outline-none focus:border-[hsl(var(--primary))] placeholder-[hsl(var(--sidepanel-muted-foreground))]"
            onClick={(e) => e.stopPropagation()}
          />
          {globalSearchTerm && (
            <button
              onClick={() => {
                setGlobalSearchTerm('');
                setShowGlobalSearchResults(false);
                setGlobalSearchResults([]);
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[hsl(var(--sidepanel-muted-foreground))] hover:text-[hsl(var(--sidepanel-foreground))] p-1"
            >
              <X size={14} />
            </button>
          )}
          {isGlobalSearching && (
            <Loader2 size={16} className="absolute right-8 top-1/2 transform -translate-y-1/2 text-[hsl(var(--sidepanel-loading-foreground))] animate-spin" />
          )}
        </div>
      </div>
      
      {/* Tree content */}
      <div className="flex-1 overflow-auto p-2">
        {showGlobalSearchResults ? (
          <>
            {/* Search Results Header */}
            <div className="mb-3 px-3 py-2 bg-[hsl(var(--sidepanel-accent-background))] rounded-lg border border-[hsl(var(--sidepanel-border))]">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Search size={14} className="text-[hsl(var(--sidepanel-muted-foreground))]" />
                  <span className="text-sm font-medium text-[hsl(var(--sidepanel-foreground))]">
                    Search Results
                  </span>
                </div>
                <span className="text-xs text-[hsl(var(--sidepanel-muted-foreground))] bg-[hsl(var(--sidepanel-background))] px-2 py-1 rounded">
                  {globalSearchResults.length} found
                </span>
              </div>
              <div className="text-xs text-[hsl(var(--sidepanel-muted-foreground))] mt-1">
                Searching for "{globalSearchTerm}" across all store levels
              </div>
            </div>
            
            {/* Search Results */}
            {globalSearchResults.length === 0 ? (
              <div className="text-center py-8 text-[hsl(var(--sidepanel-muted-foreground))]">
                <Search size={24} className="mx-auto mb-2 opacity-50" />
                <div>No stores found for "{globalSearchTerm}"</div>
                <div className="text-xs mt-1">Try a different search term</div>
              </div>
            ) : (
              <div className="space-y-1">
                {globalSearchResults.map((node, index) => (
                  <div
                    key={node.id}
                    className={`group flex items-center py-2 px-3 hover:bg-[hsl(var(--sidepanel-hover))] cursor-pointer rounded-sm relative ${
                      selectedStoreId === node.id ? 'bg-[hsl(var(--sidepanel-selected))] border-l-2 border-[hsl(var(--sidepanel-selected-border))]' : ''
                    }`}
                    onClick={() => handleSearchResultClick(node)}
                    draggable
                    onDragStart={(e) => handleStoreDragStart(e, node)}
                  >
                    <div className="w-4 h-4 flex items-center justify-center mr-3">
                      {getIcon(node.level)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[hsl(var(--sidepanel-foreground))] text-sm font-medium truncate">
                        {node.name}
                      </div>
                      {node.level === 'store_no' && node.searchPath && (
                        <div className="text-[hsl(var(--sidepanel-accent-foreground))] text-xs truncate font-medium">
                          {getPreviousCategory(node.searchPath)}
                        </div>
                      )}
                      {node.level !== 'store_no' && node.searchPath && (
                        <div className="text-[hsl(var(--sidepanel-accent-foreground))] text-xs truncate font-medium">
                          {node.level} level
                        </div>
                      )}
                      <div className="text-[hsl(var(--sidepanel-muted-foreground))] text-xs truncate opacity-75">
                        {node.searchPath}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {node.count && (
                        <span className="text-[hsl(var(--sidepanel-muted-foreground))] text-xs bg-[hsl(var(--sidepanel-accent-background))] px-2 py-1 rounded">
                          {node.count}
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSearchResultClick(node);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-[hsl(var(--primary))/20] rounded"
                        title={node.level === 'store_no' ? "View Store Details" : "Expand to Show Stores"}
                      >
                        {node.level === 'store_no' ? (
                          <BarChart3 size={14} className="text-[hsl(var(--primary))]" />
                        ) : (
                          <ChevronRight size={14} className="text-[hsl(var(--primary))]" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Back to Tree Button */}
            <div className="mt-4 px-2">
              <button
                onClick={() => {
                  setShowGlobalSearchResults(false);
                  setGlobalSearchTerm('');
                  setGlobalSearchResults([]);
                }}
                className="w-full text-center py-2 px-3 text-sm text-[hsl(var(--sidepanel-muted-foreground))] hover:text-[hsl(var(--sidepanel-foreground))] hover:bg-[hsl(var(--sidepanel-hover))] rounded transition-colors duration-200"
              >
                ← Back to Store Tree
              </button>
            </div>
          </>
        ) : (
          /* Regular Tree View */
          treeData.map(node => renderNode(node))
        )}
      </div>
      
      {/* New Store Button at bottom */}
      <div className="p-3 border-t border-[hsl(var(--sidepanel-border))]">
        <button
          onClick={onNewStoreClick}
          className="w-full flex items-center justify-center gap-2 p-2 rounded bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))]/90 transition-colors duration-200 text-sm font-medium"
          title="Add New Store"
        >
          <Plus size={16} />
          New Store
        </button>
      </div>
    </div>
  );
};

export default StoreTree; 