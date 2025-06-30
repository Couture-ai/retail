import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Code, Hash, FileText, Settings, Play, ExternalLink, Monitor, Terminal, Command, Download, Apps, Shuffle, FolderOpen } from 'lucide-react';
import { useWorkspace } from '@/context/WorkspaceProvider';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { codeFiles, chats, documents, openFileInPanel } = useWorkspace();
  
  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex(prev => (prev + 1) % commandItems.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex(prev => (prev - 1 + commandItems.length) % commandItems.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (commandItems[activeIndex]) {
            commandItems[activeIndex].action();
          }
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, onClose]);
  
  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setActiveIndex(0);
    }
  }, [isOpen]);
  
  // Command items
  const commandItems = [
    {
      id: 'search',
      icon: <Search size={18} />,
      label: 'Search',
      description: 'Search through your files',
      shortcut: '⌘F',
      action: () => {
        // Implement search functionality
        onClose();
      }
    },
    {
      id: 'run',
      icon: <Play size={18} />,
      label: 'Run',
      description: 'Run the application',
      shortcut: '⌘↩',
      action: () => {
        // Implement run functionality
        onClose();
      }
    },
    {
      id: 'open-url',
      icon: <ExternalLink size={18} />,
      label: 'Open development URL',
      description: 'Open in browser',
      action: () => {
        // Implement URL open
        onClose();
      }
    },
    {
      id: 'desktop-app',
      icon: <Monitor size={18} />,
      label: 'Open in desktop app',
      description: 'Launch desktop application',
      action: () => {
        // Implement desktop app open
        onClose();
      }
    },
    {
      id: 'vscode',
      icon: <Code size={18} />,
      label: 'Open in VS Code',
      description: 'Connect to this project in VS Code',
      action: () => {
        // Implement VS Code open
        onClose();
      }
    },
    {
      id: 'ssh',
      icon: <Terminal size={18} />,
      label: 'Copy SSH Command',
      description: 'Copy shell command to connect',
      action: () => {
        // Implement SSH command copy
        onClose();
      }
    }
  ];
  
  // Recently viewed files
  const recentFiles = [
    { id: 'sidebar', path: 'client/src/components/layout/Sidebar.tsx', icon: <FileText size={18} className="text-blue-400" /> },
    { id: 'icon-button', path: 'client/src/components/ui/icon-button.tsx', icon: <FileText size={18} className="text-blue-400" /> },
    { id: 'channellist', path: 'client/src/components/chat/ChannelList.tsx', icon: <FileText size={18} className="text-blue-400" /> },
    { id: 'userprofile', path: 'client/src/components/chat/UserProfile.tsx', icon: <FileText size={18} className="text-blue-400" /> },
    { id: 'tooltip', path: 'client/src/components/ui/tooltip.tsx', icon: <FileText size={18} className="text-blue-400" /> },
  ];
  
  // Filter items based on search query
  const filteredCommands = searchQuery 
    ? commandItems.filter(item => 
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : commandItems;
    
  const filteredFiles = searchQuery
    ? recentFiles.filter(file => 
        file.path.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : recentFiles;
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-start justify-center pt-16 overflow-hidden backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[hsl(var(--dark-9))] rounded-lg shadow-xl border border-[hsl(var(--dark-7))]" 
          onClick={e => e.stopPropagation()}>
        {/* Search Input */}
        <div className="p-3 flex items-center border-b border-[hsl(var(--dark-7))]">
          <Search className="text-[hsl(var(--dark-2))] mr-2" size={18} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask AI & search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-[hsl(var(--dark-2))]"
          />
          <div className="flex items-center space-x-1 text-[hsl(var(--dark-2))]">
            <kbd className="px-1.5 py-0.5 bg-[hsl(var(--dark-6))] rounded text-xs">⌘</kbd>
            <kbd className="px-1.5 py-0.5 bg-[hsl(var(--dark-6))] rounded text-xs">K</kbd>
          </div>
          <button 
            onClick={onClose}
            className="ml-2 text-[hsl(var(--dark-2))] hover:text-white p-1 rounded-full hover:bg-[hsl(var(--dark-6))]"
          >
            <X size={16} />
          </button>
        </div>
        
        {/* Command List */}
        <div className="max-h-[70vh] overflow-y-auto">
          {filteredCommands.length > 0 && (
            <div className="py-2">
              {filteredCommands.map((command, index) => (
                <div 
                  key={command.id}
                  className={`flex items-center px-3 py-2 hover:bg-[hsl(var(--dark-7))] cursor-pointer ${
                    index === activeIndex ? 'bg-[hsl(var(--dark-7))]' : ''
                  }`}
                  onClick={() => {
                    command.action();
                  }}
                >
                  <div className="w-8 h-8 flex items-center justify-center text-[hsl(var(--dark-2))]">
                    {command.icon}
                  </div>
                  <div className="ml-2 flex-1">
                    <div className="text-white text-sm">{command.label}</div>
                    {command.description && (
                      <div className="text-[hsl(var(--dark-2))] text-xs">{command.description}</div>
                    )}
                  </div>
                  {command.shortcut && (
                    <div className="text-[hsl(var(--dark-2))] text-xs">
                      {command.shortcut.split('').map((key, i) => (
                        <React.Fragment key={i}>
                          {i > 0 && <span className="mx-0.5"></span>}
                          <kbd className="px-1.5 py-0.5 bg-[hsl(var(--dark-6))] rounded text-xs">{key}</kbd>
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Files Section */}
          {filteredFiles.length > 0 && (
            <>
              <div className="px-3 py-1 text-[hsl(var(--dark-2))] text-xs font-semibold">Files</div>
              {filteredFiles.map((file, index) => (
                <div 
                  key={file.id}
                  className={`flex items-center px-3 py-2 hover:bg-[hsl(var(--dark-7))] cursor-pointer ${
                    index + filteredCommands.length === activeIndex ? 'bg-[hsl(var(--dark-7))]' : ''
                  }`}
                  onClick={() => {
                    // Open file action
                    onClose();
                  }}
                >
                  <div className="w-8 h-8 flex items-center justify-center">
                    {file.icon}
                  </div>
                  <div className="ml-2 flex-1 text-white text-sm truncate">
                    {file.path}
                  </div>
                  <div className="text-[hsl(var(--dark-2))] text-xs">
                    Recently opened
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette; 