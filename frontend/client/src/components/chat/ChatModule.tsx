import { useState, useEffect, useRef, useCallback } from "react";
import ChannelList from "./ChannelList";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import DirectiveBusChat from "./DirectiveBusChat";
import UserProfile from "./UserProfile";
import { useWorkspace } from "@/context/WorkspaceProvider";
import { Hash, Users, Bell, Pin, Search, Zap } from "lucide-react";
import { Message } from "@/types";
import SidebarSplitter from "../ui/SidebarSplitter";

const ChatModule = () => {
  const { activeChannelId, chats, addMessage } = useWorkspace();
  const [initialized, setInitialized] = useState<{[key: string]: boolean}>({});
  
  // Sidebar resizing state
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Find active chat - create default messages for primary bot channels if needed
  const activeChat = chats.find(chat => chat.channelId === activeChannelId);
  
  // Check if this is a directive bus channel
  const isDirectiveBus = activeChannelId.includes('to-');

  // Initialize chat with default messages if not already existing
  useEffect(() => {
    // Only for primary bot channels and only once per channel
    if (!isDirectiveBus && !initialized[activeChannelId]) {
      if (!activeChat || activeChat.messages.length === 0) {
        // Set initial user message
        const initialUserMessage = `Hello ${activeChannelId}, can you help me with my project?`;
        addMessage(activeChannelId, initialUserMessage, false);
        
        // Set bot response after a short delay
        setTimeout(() => {
          const botResponse = `Hi there! I'm ${activeChannelId}, and I'm ready to assist you with your project. What would you like to work on today?`;
          addMessage(activeChannelId, botResponse, true);
        }, 800);
        
        // Mark as initialized
        setInitialized(prev => ({...prev, [activeChannelId]: true}));
      }
    }
  }, [activeChannelId, activeChat, addMessage, isDirectiveBus, initialized]);
  
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
  
  // Extract source and target bot IDs for directive buses
  const getDirectiveBusInfo = () => {
    // Parse IDs from channel names like "code-to-design" or directive channel names
    if (activeChannelId === "code-to-design") {
      return { source: "swift-eagle-9042", target: "creative-owl-7238" };
    } else if (activeChannelId === "design-to-deploy") {
      return { source: "creative-owl-7238", target: "clever-fox-3721" };
    } else if (activeChannelId === "dev-to-analytics") {
      return { source: "swift-eagle-9042", target: "precise-deer-5190" };
    }
    return { source: "", target: "" };
  };
  
  const { source, target } = getDirectiveBusInfo();
  
  return (
    <div className="flex-1 flex overflow-hidden" ref={containerRef}>
      {/* Chat Channels List with dynamic width */}
      <div style={{ width: sidebarWidth, flexShrink: 0 }} className="h-full overflow-hidden">
      <ChannelList />
      </div>
      
      {/* Resizer between sidebar and content */}
      <SidebarSplitter 
        isResizing={isResizingSidebar}
        onResizeStart={handleSidebarResizeStart}
      />
      
      {/* Chat Content */}
      <div className="flex-1 flex flex-col bg-[hsl(var(--discord-6))]">
        {/* Chat Header */}
        <div className="h-14 border-b border-gray-700/50 flex items-center px-4">
          <div className="flex items-center">
            {isDirectiveBus ? (
              <Zap className="text-red-400 mr-2" size={18} />
            ) : (
              <Hash className="text-[hsl(var(--dark-2))] mr-2" size={18} />
            )}
            <h3 className="font-medium text-white">{activeChannelId}</h3>
            {isDirectiveBus && (
              <span className="ml-2 text-xs bg-red-900/30 text-red-300 px-2 py-0.5 rounded">
                directive bus
              </span>
            )}
          </div>
          
          <div className="ml-auto flex items-center space-x-3">
            <button className="text-[hsl(var(--dark-2))] hover:text-white">
              <Users size={18} />
            </button>
            <button className="text-[hsl(var(--dark-2))] hover:text-white">
              <Bell size={18} />
            </button>
            <button className="text-[hsl(var(--dark-2))] hover:text-white">
              <Pin size={18} />
            </button>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search" 
                className="bg-[hsl(var(--dark-7))] text-[hsl(var(--dark-1))] text-sm rounded px-3 py-1 w-40 focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Search className="absolute right-2 top-1.5 text-[hsl(var(--dark-2))]" size={16} />
            </div>
          </div>
        </div>
        
        {/* Content based on channel type */}
        {isDirectiveBus ? (
          /* Directive Bus Chat */
          <DirectiveBusChat 
            channelId={activeChannelId} 
            sourceBotId={source} 
            targetBotId={target} 
          />
        ) : (
          /* Regular Chat */
          <>
            <ChatMessages messages={activeChat?.messages || []} />
            <ChatInput channelId={activeChannelId} />
          </>
        )}
      </div>
    </div>
  );
};

export default ChatModule;
