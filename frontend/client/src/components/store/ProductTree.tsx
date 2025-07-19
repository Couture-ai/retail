import { useState, useEffect, useCallback, useRef } from "react";
import { 
  ChevronDown, 
  ChevronRight, 
  Package, 
  Tag, 
  Layers, 
  Box,
  ShoppingBag,
  Loader2,
  AlertCircle,
  BarChart3,
  Search,
  Plus,
  X
} from "lucide-react";
import { ForecastRepository } from "@/repository/forecast_repository";

interface ProductNode {
  id: string;
  name: string;
  level: string; // Made generic to support dynamic hierarchy
  parent?: string;
  children?: ProductNode[];
  expanded?: boolean;
  loading?: boolean;
  count?: number;
  // Context information for building queries - dynamic based on hierarchy
  context?: Record<string, string>;
  // Search-related properties
  searchActive?: boolean;
  searchTerm?: string;
  allChildren?: ProductNode[]; // Store all children for filtering
}

interface ProductTreeProps {
  onProductSelect: (productId: string, productInfo: any) => void;
  selectedProductId: string | null;
  onNewProductClick?: () => void;
}

const ProductTree = ({ onProductSelect, selectedProductId, onNewProductClick }: ProductTreeProps) => {
  const [treeData, setTreeData] = useState<ProductNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hierarchy, setHierarchy] = useState<string[]>([]);
  
  // Initialize forecast repository
  const forecastRepo = new ForecastRepository(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000');
  
  // Debounce ref for search
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
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
    };
  }, []);
  
  const loadMetadata = async () => {
    try {
      const stateSetters = {
        setLoading: () => {},
        setError: (err: string | null) => setError(err),
        setData: (data: any) => {
          if (data && data.product_category_hierarchy) {
            // Add article_id to the hierarchy if not already present
            const fullHierarchy = [...data.product_category_hierarchy];
            if (!fullHierarchy.includes('article_id')) {
              fullHierarchy.push('article_id');
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
            const nodes: ProductNode[] = data.data.map((row: any) => ({
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
  
  const loadChildren = async (node: ProductNode) => {
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
            const children: ProductNode[] = data.data.map((row: any) => ({
              id: `${childLevel}-${node.id}-${row[childLevel]}`,
              name: row[childLevel],
              level: childLevel,
              parent: node.id,
              count: row.count,
              children: childLevel !== 'article_id' ? [] : undefined,
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
  const updateNodeInTree = (nodes: ProductNode[], nodeId: string, updates: Partial<ProductNode>): ProductNode[] => {
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
  
  const handleNodeClick = (node: ProductNode) => {
    // For article_id (leaf nodes), open content directly
    if (node.level === 'article_id') {
      onProductSelect(node.id, node);
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
  
  const handleAnalyticsClick = (node: ProductNode, e: React.MouseEvent) => {
    e.stopPropagation();
    // Open the analytics content for this node
    onProductSelect(node.id, node);
  };
  
  const handleProductDragStart = (e: React.DragEvent, node: ProductNode) => {
    e.stopPropagation();
    // Set drag data with product information
    const dragData = {
      id: node.id,
      type: 'product',
      level: node.level,
      name: node.name,
      context: node.context
    };
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const toggleExpanded = (node: ProductNode, e: React.MouseEvent) => {
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
      <Layers size={16} className="text-blue-400" />,
      <Package size={16} className="text-green-400" />,
      <Tag size={16} className="text-yellow-400" />,
      <Box size={16} className="text-purple-400" />,
      <ShoppingBag size={16} className="text-orange-400" />
    ];
    
    return icons[levelIndex] || <Package size={16} className="text-gray-400" />;
  };
  
  const renderNode = (node: ProductNode, depth: number = 0) => {
    const isSelected = selectedProductId === node.id;
    const hasChildren = node.level !== 'article_id';
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
          onDragStart={(e) => handleProductDragStart(e, node)}
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
              {node.level === 'article_id' ? `Article ${node.name}` : node.name}
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
  const handleSearchClick = async (node: ProductNode, e: React.MouseEvent) => {
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

  const handleSearchTermChange = async (node: ProductNode, searchTerm: string) => {
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

  const performSearch = async (node: ProductNode, searchTerm: string) => {
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
            const filteredChildren: ProductNode[] = data.data.map((row: any) => ({
              id: `${childLevel}-${node.id}-${row[childLevel]}`,
              name: row[childLevel],
              level: childLevel,
              parent: node.id,
              count: row.count,
              children: childLevel !== 'article_id' ? [] : undefined,
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
  
  if (loading) {
    return (
      <div className="h-full bg-[hsl(var(--sidepanel-background))] p-4">
        <div className="flex items-center justify-center h-32">
          <Loader2 className="animate-spin text-[hsl(var(--sidepanel-loading-foreground))]" size={24} />
          <span className="ml-2 text-[hsl(var(--sidepanel-loading-foreground))]">Loading product hierarchy...</span>
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
        <h3 className="text-sm font-medium text-[hsl(var(--sidepanel-foreground))]">Product Hierarchy</h3>
      </div>
      
      {/* Tree content */}
      <div className="flex-1 overflow-auto p-2">
        {treeData.map(node => renderNode(node))}
      </div>
      
      {/* New Product Button at bottom */}
      <div className="p-3 border-t border-[hsl(var(--sidepanel-border))]">
        <button
          onClick={onNewProductClick}
          className="w-full flex items-center justify-center gap-2 p-2 rounded bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))]/90 transition-colors duration-200 text-sm font-medium"
          title="Add New Product"
        >
          <Plus size={16} />
          New Product
        </button>
      </div>
    </div>
  );
};

export default ProductTree; 