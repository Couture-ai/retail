import { useState, useCallback, useRef, useEffect } from "react";
import { useWorkspace } from "@/context/WorkspaceProvider";
import { BarChart3, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import SidebarSplitter from "../ui/SidebarSplitter";
import EditorLayout from "../code/EditorLayout";
import { AnalyticsRepository } from "../../repository/analytics_repository";

interface AnalyticsPageConfiguration {
  id: number;
  page_name: string;
  attributes?: Record<string, any>;
  page_config?: Record<string, any>;
}

const AnalyticsModule = () => {
  const { 
    editorLayout,
    openFileInPanel
  } = useWorkspace();
  
  // Sidebar resizing state
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Analytics pages state
  const [analyticsPages, setAnalyticsPages] = useState<AnalyticsPageConfiguration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPageName, setNewPageName] = useState("");
  const [editingPage, setEditingPage] = useState<AnalyticsPageConfiguration | null>(null);
  
  // Initialize analytics repository
  const getApiBaseUrl = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    // Add protocol if missing
    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      return `http://${baseUrl}`;
    }
    return baseUrl;
  };
  
  const analyticsRepository = new AnalyticsRepository(getApiBaseUrl());
  
  // Load analytics pages on mount
  useEffect(() => {
    loadAnalyticsPages();
  }, []);
  
  const loadAnalyticsPages = async () => {
    try {
      await analyticsRepository.getAllAnalyticsPages({
        setLoading,
        setError,
        setData: setAnalyticsPages
      });
    } catch (error) {
      console.error('Error loading analytics pages:', error);
    }
  };
  
  const handleCreatePage = async () => {
    if (!newPageName.trim()) return;
    
    try {
      await analyticsRepository.createAnalyticsPage({
        page_name: newPageName.trim(),
        attributes: {},
        page_config: {}
      }, {
        setLoading,
        setError,
        setData: () => {}
      });
      
      setNewPageName("");
      setShowCreateForm(false);
      await loadAnalyticsPages();
    } catch (error) {
      console.error('Error creating analytics page:', error);
    }
  };
  
  const handleDeletePage = async (pageId: number) => {
    if (!confirm('Are you sure you want to delete this analytics page?')) return;
    
    try {
      await analyticsRepository.deleteAnalyticsPage(pageId, {
        setLoading,
        setError,
        setData: () => {}
      });
      
      await loadAnalyticsPages();
    } catch (error) {
      console.error('Error deleting analytics page:', error);
    }
  };
  
  const handleEditPage = (page: AnalyticsPageConfiguration) => {
    setEditingPage(page);
  };
  
  const handleUpdatePage = async () => {
    if (!editingPage || !editingPage.page_name.trim()) return;
    
    try {
      await analyticsRepository.updateAnalyticsPage(editingPage.id, {
        page_name: editingPage.page_name.trim()
      }, {
        setLoading,
        setError,
        setData: () => {}
      });
      
      setEditingPage(null);
      await loadAnalyticsPages();
    } catch (error) {
      console.error('Error updating analytics page:', error);
    }
  };
  
  const handlePageClick = (pageName: string) => {
    // Preserve original case by URL encoding the page name
    openFileInPanel(`analytics-${encodeURIComponent(pageName)}`);
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
      {/* Analytics Side Panel */}
      <div style={{ width: sidebarWidth, flexShrink: 0 }} className="h-full overflow-hidden">
        <div className="h-full bg-[hsl(var(--sidepanel-background))] border-r border-[hsl(var(--sidepanel-border))] flex flex-col">
          {/* Panel Header */}
          <div className="h-12 border-b border-[hsl(var(--sidepanel-border))] flex items-center justify-between px-3">
            <div className="flex items-center">
              <BarChart3 className="text-[hsl(var(--sidepanel-muted-foreground))] mr-2" size={16} />
              <h3 className="font-medium text-[hsl(var(--sidepanel-foreground))] text-sm">Analytics</h3>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="p-1 text-[hsl(var(--sidepanel-muted-foreground))] hover:text-[hsl(var(--sidepanel-foreground))] hover:bg-[hsl(var(--sidepanel-hover))] rounded"
            >
              <Plus size={14} />
            </button>
          </div>
          
          {/* Create Form */}
          {showCreateForm && (
            <div className="p-3 border-b border-[hsl(var(--sidepanel-border))] bg-[hsl(var(--sidepanel-input-background))]">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newPageName}
                  onChange={(e) => setNewPageName(e.target.value)}
                  placeholder="Page name"
                  className="flex-1 px-2 py-1 text-xs bg-[hsl(var(--sidepanel-input-background))] border border-[hsl(var(--sidepanel-input-border))] rounded text-[hsl(var(--sidepanel-foreground))] placeholder-[hsl(var(--sidepanel-muted-foreground))] focus:outline-none focus:border-[hsl(var(--primary))]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreatePage();
                    if (e.key === 'Escape') setShowCreateForm(false);
                  }}
                  autoFocus
                />
                <button
                  onClick={handleCreatePage}
                  disabled={!newPageName.trim() || loading}
                  className="px-2 py-1 text-xs bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 disabled:bg-[hsl(var(--sidepanel-muted-foreground))] text-[hsl(var(--primary-foreground))] rounded"
                >
                  Add
                </button>
              </div>
            </div>
          )}
          
          {/* Analytics Pages List */}
          <div className="flex-1 overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="animate-spin text-[hsl(var(--sidepanel-loading-foreground))]" size={16} />
              </div>
            )}
            
            {error && (
              <div className="p-3 text-xs text-[hsl(var(--sidepanel-error-foreground))] bg-[hsl(var(--sidepanel-error-background))] border-b border-[hsl(var(--sidepanel-error-border))]">
                {error}
              </div>
            )}
            
            <div className="p-2 space-y-1">
              {analyticsPages.map((page) => (
                <div key={page.id} className="group">
                  {editingPage && editingPage.id === page.id ? (
                    <div className="flex items-center space-x-1 p-1">
                      <input
                        type="text"
                        value={editingPage.page_name}
                        onChange={(e) => setEditingPage({ ...editingPage, page_name: e.target.value })}
                        className="flex-1 px-2 py-1 text-xs bg-[hsl(var(--sidepanel-input-background))] border border-[hsl(var(--sidepanel-input-border))] rounded text-[hsl(var(--sidepanel-foreground))] focus:outline-none focus:border-[hsl(var(--primary))]"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleUpdatePage();
                          if (e.key === 'Escape') setEditingPage(null);
                        }}
                        autoFocus
                      />
                      <button
                        onClick={handleUpdatePage}
                        className="p-1 text-green-400 hover:bg-green-500/20 rounded"
                      >
                        <Edit size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-2 hover:bg-[hsl(var(--sidepanel-hover))] rounded cursor-pointer">
                      <div
                        onClick={() => handlePageClick(page.page_name)}
                        className="flex-1 min-w-0"
                      >
                        <div className="text-[hsl(var(--sidepanel-foreground))] text-sm font-medium truncate">
                          # {page.page_name}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditPage(page);
                          }}
                          className="p-1 text-[hsl(var(--sidepanel-muted-foreground))] hover:text-blue-400 hover:bg-blue-500/20 rounded"
                        >
                          <Edit size={12} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePage(page.id);
                          }}
                          className="p-1 text-[hsl(var(--sidepanel-muted-foreground))] hover:text-red-400 hover:bg-red-500/20 rounded"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {analyticsPages.length === 0 && !loading && (
                <div className="p-3 text-xs text-[hsl(var(--sidepanel-muted-foreground))] text-center">
                  No analytics pages yet. Click + to create one.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Resizer between sidebar and content */}
      <SidebarSplitter 
        isResizing={isResizingSidebar}
        onResizeStart={handleSidebarResizeStart}
      />
      
      {/* Editor Layout */}
      <div className="flex-1 h-full overflow-hidden">
        <EditorLayout layoutNode={editorLayout} />
      </div>
    </div>
  );
};

export default AnalyticsModule; 