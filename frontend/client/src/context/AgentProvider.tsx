import React, { createContext, useContext, useState, useCallback } from 'react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

interface ContextItem {
  id: string;
  title: string;
  type: 'code' | 'docs' | 'chat' | 'task' | 'forecast' | 'analytics' | 'store' | 'product' | 'inventory' | 'article' | 'timeline';
  content?: string; // Optional content preview
}

interface AgentContextType {
  isAgentPanelOpen: boolean;
  toggleAgentPanel: () => void;
  closeAgentPanel: () => void;
  openAgentPanel: () => void;
  messages: Message[];
  addMessage: (content: string, sender: 'user' | 'agent') => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  clearMessages: () => void;
  panelWidth: number;
  setPanelWidth: (width: number) => void;
  isResizing: boolean;
  setIsResizing: (resizing: boolean) => void;
  // Context management
  contextItems: ContextItem[];
  addContextItem: (item: ContextItem) => void;
  removeContextItem: (id: string) => void;
  clearContextItems: () => void;
  // Drag and drop
  dropZone: 'active' | null;
  setDropZone: (zone: 'active' | null) => void;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export const useAgent = () => {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgent must be used within an AgentProvider');
  }
  return context;
};

interface AgentProviderProps {
  children: React.ReactNode;
}

const MIN_PANEL_WIDTH = 280;
const MAX_PANEL_WIDTH = 600;
const DEFAULT_PANEL_WIDTH = 400;

export const AgentProvider: React.FC<AgentProviderProps> = ({ children }) => {
  const [isAgentPanelOpen, setIsAgentPanelOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [panelWidth, setPanelWidthState] = useState(DEFAULT_PANEL_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const [contextItems, setContextItems] = useState<ContextItem[]>([]);
  const [dropZone, setDropZone] = useState<'active' | null>(null);

  const toggleAgentPanel = useCallback(() => {
    setIsAgentPanelOpen(prev => !prev);
  }, []);

  const closeAgentPanel = useCallback(() => {
    setIsAgentPanelOpen(false);
  }, []);

  const openAgentPanel = useCallback(() => {
    setIsAgentPanelOpen(true);
  }, []);

  const addMessage = useCallback((content: string, sender: 'user' | 'agent') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const setPanelWidth = useCallback((width: number) => {
    const clampedWidth = Math.max(MIN_PANEL_WIDTH, Math.min(MAX_PANEL_WIDTH, width));
    setPanelWidthState(clampedWidth);
  }, []);

  // Context management functions
  const addContextItem = useCallback((item: ContextItem) => {
    setContextItems(prev => {
      // Check if item already exists
      if (prev.find(existing => existing.id === item.id)) {
        return prev; // Don't add duplicates
      }
      return [...prev, item];
    });
  }, []);

  const removeContextItem = useCallback((id: string) => {
    setContextItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearContextItems = useCallback(() => {
    setContextItems([]);
  }, []);

  const value: AgentContextType = {
    isAgentPanelOpen,
    toggleAgentPanel,
    closeAgentPanel,
    openAgentPanel,
    messages,
    addMessage,
    isLoading,
    setIsLoading,
    clearMessages,
    panelWidth,
    setPanelWidth,
    isResizing,
    setIsResizing,
    contextItems,
    addContextItem,
    removeContextItem,
    clearContextItems,
    dropZone,
    setDropZone,
  };

  return (
    <AgentContext.Provider value={value}>
      {children}
    </AgentContext.Provider>
  );
}; 