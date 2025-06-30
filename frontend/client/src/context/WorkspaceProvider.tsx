import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import {
  Module, ChatData, File, TreeNode, Message, OrgBot, BotConnection,
  LayoutNode, EditorPanelNode, SplitterNode, SplitOrientation, ContentType
} from "../types";
import { mockChats } from "../data/mockChats";
import { mockDocuments } from "../data/mockDocuments";
import { mockCode } from "../data/mockCode";
import { mockOrgBots } from "../data/mockOrgBots";
import { mockOrgConnections } from "../data/mockOrgConnections";
import { v4 as uuidv4 } from 'uuid'; // Need uuid for unique IDs

// Helper function to find a panel node by ID
const findPanelById = (node: LayoutNode, panelId: string): EditorPanelNode | null => {
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

// Helper function to update a node within the layout tree
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

// Helper function to remove a node and potentially its parent splitter
const removeNodeFromLayout = (node: LayoutNode, nodeIdToRemove: string): LayoutNode | null => {
  if (node.id === nodeIdToRemove) {
    return null; // Signal removal
  }
  
  if (node.type === 'splitter') {
    const child1 = removeNodeFromLayout(node.children[0], nodeIdToRemove);
    const child2 = removeNodeFromLayout(node.children[1], nodeIdToRemove);

    if (child1 === null && child2 === null) {
      return null; // Remove splitter if both children are removed
    } else if (child1 === null) {
      return child2; // Promote child2
    } else if (child2 === null) {
      return child1; // Promote child1
    } else {
      // Both children remain, update the splitter node
      return { ...node, children: [child1, child2] };
    }
  }
  
  return node; // Node is not the one to remove and not a splitter containing it
};

// Helper function to find the parent splitter of a node
const findParentSplitter = (node: LayoutNode, childId: string): SplitterNode | null => {
  if (node.type === 'splitter') {
    if (node.children[0].id === childId || node.children[1].id === childId) {
      return node;
    }
    const parent1 = findParentSplitter(node.children[0], childId);
    if (parent1) return parent1;
    const parent2 = findParentSplitter(node.children[1], childId);
    if (parent2) return parent2;
  }
  return null;
};

// Helper function to find and update the content of a specific file node
const findAndUpdateFileContent = (nodes: TreeNode[], fileId: string, newContent: string): TreeNode[] => {
  return nodes.map(node => {
    if (node.type === 'file' && node.id === fileId) {
      return { ...node, content: newContent };
    }
    if (node.children) {
      return { ...node, children: findAndUpdateFileContent(node.children, fileId, newContent) };
    }
    return node;
  });
};

interface WorkspaceContextType {
  activeModule: Module;
  setActiveModule: (module: Module) => void;
  activeChannelId: string;
  setActiveChannelId: (id: string) => void;
  chats: ChatData[];
  addMessage: (channelId: string, content: string, isBotMessage: boolean) => void;
  documents: File[];
  setDocuments: (documents: File[]) => void;
  activeDocumentId: string | null;
  setActiveDocumentId: (id: string | null) => void;
  updateDocumentContent: (id: string, content: string) => void;
  createDocument: (name: string, parentId?: string) => void;
  deleteDocument: (id: string) => void;
  
  // Code specific state
  codeFiles: TreeNode[];
  setCodeFiles: (files: TreeNode[] | ((prev: TreeNode[]) => TreeNode[])) => void;
  editorLayout: LayoutNode;
  setEditorLayout: (layout: LayoutNode | ((prev: LayoutNode) => LayoutNode)) => void;
  activePanelId: string | null; // ID of the panel that currently has focus
  setActivePanelId: (id: string | null) => void;
  
  // Functions to manipulate editor layout
  openFileInPanel: (contentId: string, panelId?: string) => void;
  closeFileInPanel: (contentId: string, panelId: string) => void;
  splitPanel: (panelId: string, contentIdToMove: string, orientation: SplitOrientation, position: 'before' | 'after') => void;
  updateSplitRatio: (splitterId: string, percentage: number) => void;
  getFileData: (fileId: string) => TreeNode | null;
  updateFileContent: (fileId: string, content: string) => void;

  // Organization state
  orgBots: OrgBot[];
  setOrgBots: (bots: OrgBot[]) => void;
  orgConnections: BotConnection[];
  setOrgConnections: (connections: BotConnection[]) => void;
  activeBotId: string | null;
  setActiveBotId: (id: string | null) => void;

  // New getTabData function
  getTabData: (tabId: string) => { id: string; title: string; type: ContentType } | null;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

// Initial editor layout: a single empty panel
const initialPanelId = uuidv4();
const initialLayout: LayoutNode = {
  id: initialPanelId,
  type: 'panel',
  openTabIds: [], // Start with no files open
  activeTabId: null, // No active tab
  contentType: 'code'
};

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  console.log("WorkspaceProvider initialized");
  
  const [activeModule, setActiveModule] = useState<Module>("home"); // Default to home module instead of code
  const [activeChannelId, setActiveChannelId] = useState<string>("assistant-bot");
  const [chats, setChats] = useState<ChatData[]>(mockChats);
  const [documents, setDocuments] = useState<File[]>(mockDocuments);
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>("overview");
  const [codeFiles, setCodeFiles] = useState<TreeNode[]>(mockCode);
  
  // New layout state
  const [editorLayout, setEditorLayout] = useState<LayoutNode>(initialLayout);
  const [activePanelId, setActivePanelId] = useState<string | null>(initialPanelId);

  // Organization state
  const [orgBots, setOrgBots] = useState<OrgBot[]>(mockOrgBots);
  const [orgConnections, setOrgConnections] = useState<BotConnection[]>(mockOrgConnections);
  const [activeBotId, setActiveBotId] = useState<string | null>(null);

  // --- Code File Content Update --- 
  const updateFileContent = useCallback((fileId: string, newContent: string) => {
    setCodeFiles(prevCodeFiles => findAndUpdateFileContent(prevCodeFiles, fileId, newContent));
  }, []);

  // --- Content Management Functions --- 

  const getFileData = useCallback((fileId: string): TreeNode | null => {
    const find = (nodes: TreeNode[]): TreeNode | null => {
      for (const node of nodes) {
        if (node.type === 'file' && node.id === fileId) return node;
        if (node.children) {
          const found = find(node.children);
          if (found) return found;
        }
      }
      return null;
    };
    return find(codeFiles);
  }, [codeFiles]);

  // Central function to get data for any tab ID
  const getTabData = useCallback((tabId: string): { id: string; title: string; type: ContentType } | null => {
    console.log('[getTabData] Checking ID:', tabId, 'Available chats:', chats.map(c => c.channelId));
    
    // Check if it's a forecast item (starts with forecast-)
    if (tabId.startsWith('forecast-')) {
      const forecastType = tabId.replace('forecast-', '');
      let title = 'Forecast';
      
      switch (forecastType) {
        case 'master-table':
          title = 'Master Table';
          break;
        default:
          title = forecastType.charAt(0).toUpperCase() + forecastType.slice(1).replace('-', ' ');
      }
      
      console.log('[getTabData] Forecast tab detected:', { tabId, forecastType, title });
      return { id: tabId, title, type: 'forecast' };
    }
    
    // Check if it's an analytics item (starts with analytics-)
    if (tabId.startsWith('analytics-')) {
      const analyticsType = decodeURIComponent(tabId.replace('analytics-', ''));
      let title = 'Analytics';
      
      if (analyticsType) {
        // Handle special cases
        switch (analyticsType.toLowerCase()) {
          case 'master':
            title = 'Master Analytics';
            break;
          default:
            // For other cases, use the original case from analyticsType
            // If it has spaces, use it as-is, otherwise apply title case formatting
            if (analyticsType.includes(' ')) {
              title = analyticsType;
            } else {
              title = analyticsType.charAt(0).toUpperCase() + analyticsType.slice(1).replace('-', ' ');
            }
        }
      }
      
      console.log('[getTabData] Analytics tab detected:', { tabId, analyticsType, title });
      return { id: tabId, title, type: 'analytics' };
    }
    
    // Check if it's a code file
    const codeFile = getFileData(tabId);
    if (codeFile) {
      return { id: tabId, title: codeFile.name, type: 'code' };
    }
    
    // Check if it's a timeline view
    if (tabId === 'timeline-view') {
      return { id: tabId, title: 'Agent Timeline', type: 'timeline' };
    }
    
    // Check if it's a task (starts with task-)
    if (tabId.startsWith('task-')) {
      return { id: tabId, title: `Task ${tabId.split('-')[1]}`, type: 'task' };
    }

    // Check if it's a product item (starts with level name from product hierarchy)
    // This check must come BEFORE the store check to avoid conflicts
    const productLevels = ['vertical', 'super_category', 'segment', 'article_id'];
    const isProductId = productLevels.some(level => tabId.startsWith(level + '-'));
    
    if (isProductId) {
      const parts = tabId.split('-');
      const level = parts[0];
      const name = parts[parts.length - 1];
      
      let title = 'Product';
      let contentType: ContentType = 'product';
      
      if (level === 'article_id') {
        title = `Article ${name}`;
        contentType = 'article'; // Use article content type for article_id level
      } else {
        title = name;
        contentType = 'product';
      }
      
      console.log('[getTabData] Product tab detected:', { tabId, level, name, title, contentType });
      return { id: tabId, title, type: contentType };
    }

    // Check if it's a store item (more specific pattern matching)
    // Store IDs follow the pattern: store_hierarchy_level-value
    const storeHierarchyLevels = ['region', 'state', 'city', 'pin_code', 'store_no'];
    const isStoreItem = storeHierarchyLevels.some(level => tabId.startsWith(level + '-'));
    
    if (isStoreItem) {
      const parts = tabId.split('-');
      const level = parts[0];
      const name = parts[parts.length - 1];
      const displayLevel = level.charAt(0).toUpperCase() + level.slice(1).replace('_', ' ');
      console.log('[getTabData] Store tab detected:', { tabId, level, name, displayLevel });
      return { id: tabId, title: `${displayLevel}: ${name}`, type: 'store' };
    }

    // Check if it's the new store form
    if (tabId === 'new-store-form') {
      console.log('[getTabData] New store form detected:', { tabId });
      return { id: tabId, title: 'Add New Store', type: 'store' };
    }

    // Check if it's the new product form
    if (tabId === 'new-product-form') {
      console.log('[getTabData] New product form detected:', { tabId });
      return { id: tabId, title: 'Add New Product', type: 'product' };
    }

    // If not a code file or document, assume it's a chat channel ID
    // (This relies on the assumption that only valid IDs are passed to openFileInPanel)
    // We could make this more robust by checking against a known list of channels if needed.
    console.log('[getTabData] Defaulting to chat for:', tabId);
    return { id: tabId, title: tabId, type: 'chat' };
  }, [getFileData, chats]);

  const openFileInPanel = useCallback((contentId: string, panelId?: string) => {
    const targetPanelId = panelId || activePanelId;
    if (!targetPanelId) return; 

    setEditorLayout(prevLayout => {
      const panel = findPanelById(prevLayout, targetPanelId);
      if (!panel) return prevLayout;

      // Get tab data to ensure it's a valid openable item
      const tabData = getTabData(contentId);
      if (!tabData) {
        console.error(`Cannot open item with ID ${contentId}: No data found.`);
        return prevLayout; // Don't modify layout if item doesn't exist
      }

      let updatedPanel: EditorPanelNode;
      if (!panel.openTabIds.includes(contentId)) {
        updatedPanel = {
          ...panel,
          openTabIds: [...panel.openTabIds, contentId],
          activeTabId: contentId, // Make the newly opened content active
          contentType: tabData.type
        };
      } else {
        // Content already open, just make it active
        updatedPanel = { ...panel, activeTabId: contentId, contentType: tabData.type };
      }

      return updateNodeInLayout(prevLayout, updatedPanel);
    });
    setActivePanelId(targetPanelId);
  }, [activePanelId, getTabData]); // Depends on getTabData now

  const closeFileInPanel = useCallback((contentId: string, panelId: string) => {
    setEditorLayout(prevLayout => {
      const panel = findPanelById(prevLayout, panelId);
      if (!panel) return prevLayout;

      const newOpenTabIds = panel.openTabIds.filter(id => id !== contentId);

      if (newOpenTabIds.length === 0) {
        const newLayout = removeNodeFromLayout(prevLayout, panelId);
        if (!newLayout) {
          const newInitialPanelId = uuidv4();
          setActivePanelId(newInitialPanelId);
          return {
            id: newInitialPanelId,
            type: 'panel',
            openTabIds: [],
            activeTabId: null,
            contentType: 'code'
          };
        }
        // If layout becomes null (last panel closed), reset to initial state
        if (!newLayout) {
          const newInitialPanelId = uuidv4();
          setActivePanelId(newInitialPanelId);
          return {
            id: newInitialPanelId,
            type: 'panel',
            openTabIds: [],
            activeTabId: null,
            contentType: 'code'
          };
        } else {
          // Find a remaining panel to activate (e.g., the first one found)
          let newActivePanelId: string | null = null;
          const findFirstPanel = (node: LayoutNode) => {
             if (node.type === 'panel') newActivePanelId = node.id;
             if (node.type === 'splitter' && !newActivePanelId) {
               findFirstPanel(node.children[0]);
               if (!newActivePanelId) findFirstPanel(node.children[1]);
             }
          }
          findFirstPanel(newLayout);
          setActivePanelId(newActivePanelId);
        }
        return newLayout || initialLayout; // Should not be null here based on above logic
      }

      // If the closed content was active, select the previous one or the new last one
      let newActiveTabId = panel.activeTabId;
      if (panel.activeTabId === contentId) {
        const closedIndex = panel.openTabIds.indexOf(contentId);
        newActiveTabId = newOpenTabIds[Math.max(0, closedIndex - 1)] || newOpenTabIds[newOpenTabIds.length - 1] || null;
      }

      const updatedPanel: EditorPanelNode = {
        ...panel,
        openTabIds: newOpenTabIds,
        activeTabId: newActiveTabId,
        contentType: panel.contentType
      };

      return updateNodeInLayout(prevLayout, updatedPanel);
    });
  }, []);

  const splitPanel = useCallback((panelId: string, contentIdToMove: string, orientation: SplitOrientation, position: 'before' | 'after') => {
    
    // Ensure the item being moved actually exists
    const tabDataToMove = getTabData(contentIdToMove);
    if (!tabDataToMove) {
        console.error(`Cannot split panel: No data found for item ID ${contentIdToMove}`);
        // If getTabData isn't in scope here yet due to placement, 
        // you might need to adjust dependencies or pass it.
        // For now, we'll assume it is available or bail out.
        return; // Abort split if the item doesn't exist
    }

    console.log("Split operation - Content data:", tabDataToMove);
    
    setEditorLayout(prevLayout => {
      const panelToSplit = findPanelById(prevLayout, panelId);
      if (!panelToSplit) {
        console.error(`Cannot find panel with ID ${panelId}`);
        return prevLayout;
      }
      
      // For files dragged from the tree, they won't be in openTabIds
      // We check if it exists in the data but not in the panel
      const contentExists = tabDataToMove && tabDataToMove.id === contentIdToMove;
      const isInPanel = panelToSplit.openTabIds.includes(contentIdToMove);
      
      if (!contentExists) {
        console.error(`Item with ID ${contentIdToMove} does not exist.`);
        return prevLayout;
      }
      
      console.log(`Creating split for ${contentIdToMove} from panel ${panelId}, content in panel: ${isInPanel}`);
      
      // Create the new panel with the moved content
      const newPanel: EditorPanelNode = {
        id: uuidv4(),
        type: 'panel',
        openTabIds: [contentIdToMove],
        activeTabId: contentIdToMove,
        contentType: tabDataToMove.type
      };

      // Only remove from original panel if it was already there
      let originalPanelUpdated: EditorPanelNode;
      if (isInPanel) {
        // Update the original panel by removing the content being moved
        originalPanelUpdated = {
          ...panelToSplit,
          openTabIds: panelToSplit.openTabIds.filter(id => id !== contentIdToMove),
          activeTabId: panelToSplit.activeTabId === contentIdToMove
            ? panelToSplit.openTabIds.filter(id => id !== contentIdToMove)[0] || null 
            : panelToSplit.activeTabId,
          contentType: panelToSplit.contentType
        };
      } else {
        // Item not in original panel, just keep the panel as is
        originalPanelUpdated = { ...panelToSplit };
      }
      
      // Create the new splitter node
      const newSplitter: SplitterNode = {
        id: uuidv4(),
        type: 'splitter',
        orientation,
        children: position === 'before' 
          ? [newPanel, originalPanelUpdated] 
          : [originalPanelUpdated, newPanel],
        splitPercentage: 50,
      };
      
      // Replace the original panel with the splitter in the layout tree
      const replacePanelWithSplitter = (node: LayoutNode): LayoutNode => {
         if (node.id === panelToSplit.id) {
           return newSplitter;
         }
         if (node.type === 'splitter') {
           return { 
             ...node, 
             children: [replacePanelWithSplitter(node.children[0]), replacePanelWithSplitter(node.children[1])] 
           };
         }
         return node;
      };

      const newLayout = replacePanelWithSplitter(prevLayout);
      setActivePanelId(newPanel.id); // Activate the new panel
      return newLayout;
    });
  }, [getTabData]);

  const updateSplitRatio = useCallback((splitterId: string, percentage: number) => {
    setEditorLayout(prevLayout => {
      const updateRatio = (node: LayoutNode): LayoutNode => {
        if (node.type === 'splitter') {
          if (node.id === splitterId) {
            return { ...node, splitPercentage: Math.max(5, Math.min(95, percentage)) }; // Clamp 5-95%
          }
          return { ...node, children: [updateRatio(node.children[0]), updateRatio(node.children[1])] };
        }
        return node;
      };
      return updateRatio(prevLayout);
    });
  }, []);

  // --- Other Context Functions (Chat, Docs, etc.) ---
  // ... addMessage, updateDocumentContent, createDocument, deleteDocument remain the same ...
   const addMessage = (channelId: string, content: string, isBotMessage: boolean) => {
    setChats(prev => {
      const channelIndex = prev.findIndex(chat => chat.channelId === channelId);
      
      // Create the message with proper type safety
      const newMessage: Message = {
        id: Date.now().toString(),
        content,
        sender: isBotMessage ? 'bot' : 'user',
        timestamp: new Date(),
        userName: 'User',
        botName: 'AssistantBot'
      };
      
      if (channelIndex === -1) {
        return [...prev, {
          channelId,
          messages: [newMessage]
        }];
      }
      
      const updatedChat = {
        ...prev[channelIndex],
        messages: [
          ...prev[channelIndex].messages,
          newMessage
        ]
      };
      
      const newChats = [...prev];
      newChats[channelIndex] = updatedChat;
      
      return newChats;
    });
  };

  const updateDocumentContent = (id: string, content: string) => {
    const updateContent = (docs: File[]): File[] => {
      return docs.map(doc => {
        if (doc.id === id) {
          return { ...doc, content };
        }
        if (doc.children) {
          return { ...doc, children: updateContent(doc.children) };
        }
        return doc;
      });
    };
    
    setDocuments(prev => updateContent(prev));
  };

  const createDocument = (name: string, parentId?: string) => {
    const newDoc: File = {
      id: Date.now().toString(),
      name,
      type: name.includes('.') ? 'file' : 'folder',
      content: name.includes('.') ? '' : undefined,
      children: name.includes('.') ? undefined : [],
      extension: name.includes('.') ? name.split('.').pop() : undefined
    };
    
    const insertDocument = (docs: File[]): File[] => {
      if (!parentId) {
        return [...docs, newDoc];
      }
      
      return docs.map(doc => {
        if (doc.id === parentId) {
          return {
            ...doc,
            children: [...(doc.children || []), { ...newDoc, parentId }]
          };
        }
        if (doc.children) {
          return { ...doc, children: insertDocument(doc.children) };
        }
        return doc;
      });
    };
    
    setDocuments(prev => insertDocument(prev));
  };

  const deleteDocument = (id: string) => {
    const deleteFromDocs = (docs: File[]): File[] => {
      return docs.filter(doc => {
        if (doc.id === id) {
          // If we're deleting the active document, clear the selection
          if (activeDocumentId === id) {
            setActiveDocumentId(null);
          }
          return false;
        }
        
        if (doc.children) {
          doc.children = deleteFromDocs(doc.children);
        }
        
        return true;
      });
    };
    
    setDocuments(prev => deleteFromDocs(prev));
  };

  return (
    <WorkspaceContext.Provider 
      value={{
        activeModule,
        setActiveModule,
        activeChannelId,
        setActiveChannelId,
        chats,
        addMessage,
        documents,
        setDocuments,
        activeDocumentId,
        setActiveDocumentId,
        updateDocumentContent,
        createDocument,
        deleteDocument,
        codeFiles,
        setCodeFiles,
        editorLayout,
        setEditorLayout,
        activePanelId,
        setActivePanelId,
        openFileInPanel,
        closeFileInPanel,
        splitPanel,
        updateSplitRatio,
        getFileData,
        updateFileContent,
        getTabData,
        orgBots,
        setOrgBots,
        orgConnections,
        setOrgConnections,
        activeBotId,
        setActiveBotId
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
};
