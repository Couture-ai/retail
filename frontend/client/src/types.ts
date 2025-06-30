export type SidebarItem = {
  id: string;
  icon: React.ReactNode;
  name: string;
  active?: boolean;
};

export type Module = 'home' | 'chat' | 'docs' | 'code' | 'chart' | 'organization' | 'budget' | 'settings' | 'task' | 'store' | 'product' | 'forecast' | 'analytics';

export type Bot = {
  id: string;
  name: string;
  avatar?: string;
};

export type Channel = {
  id: string;
  name: string;
  botId?: string;
  type: 'primary' | 'directive' | 'direct' | 'text';
  active?: boolean;
  botType?: string;
  isActive?: boolean;
  status?: string;
  memberCount?: number;
};

export type Message = {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  botId?: string;
  timestamp: Date;
  userName?: string;
  botName?: string;
};

export type ChatData = {
  channelId: string;
  messages: Message[];
};

export type FileType = 'folder' | 'file';

export type File = {
  id: string;
  name: string;
  type: FileType;
  content?: string;
  children?: File[];
  expanded?: boolean;
  active?: boolean;
  parentId?: string;
  extension?: string;
};

export type TreeNode = {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: TreeNode[];
  path: string;
  expanded?: boolean;
  active?: boolean;
  content?: string;
};

export type BotRole = 'ceo' | 'vp' | 'manager' | 'developer';

export type OrgBot = {
  id: string;
  name: string;
  role: BotRole;
  description?: string;
  position?: { x: number, y: number };
};

export type ConnectionType = 'directive' | 'communication';

export type BotConnection = {
  id: string;
  source: string;
  target: string;
  type: ConnectionType;
};

// --- New types for Editor Layout ---

export type SplitOrientation = 'horizontal' | 'vertical';

// Base node type
interface BaseLayoutNode {
  id: string;
}

// Content type for what can be displayed in editor panels
export type ContentType = 'code' | 'chat' | 'docs' | 'organization' | 'timeline' | 'task' | 'store' | 'forecast' | 'analytics' | 'product' | 'article';

// Content item interface for the new generalized tabs
export interface TabContentItem {
  id: string;
  type: ContentType;
  title: string;
  iconType?: string;
}

// Represents a panel holding editor tabs
export interface EditorPanelNode extends BaseLayoutNode {
  type: 'panel';
  openTabIds: string[];
  activeTabId: string | null;
  contentType: ContentType;
}

// Represents a split between two other nodes
export interface SplitterNode extends BaseLayoutNode {
  type: 'splitter';
  orientation: SplitOrientation;
  children: [LayoutNode, LayoutNode]; // Two children nodes
  splitPercentage: number; // Percentage of space for the first child (0-100)
}

// Union type for any node in the layout tree
export type LayoutNode = EditorPanelNode | SplitterNode;

// --- End of Editor Layout Types ---

interface WorkspaceContextType {
  // ... other properties
  updateSplitRatio: (splitterId: string, percentage: number) => void;
  getFileData: (fileId: string) => TreeNode | null;
  updateFileContent: (fileId: string, content: string) => void;
  getTabData: (tabId: string) => { id: string; title: string; type: ContentType } | null;

  // Organization state
  // ... existing code ...
}
