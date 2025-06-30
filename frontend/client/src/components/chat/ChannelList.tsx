import { useWorkspace } from "@/context/WorkspaceProvider";
import { Channel } from "@/types";
import { ChevronDown, Play, Pause, Plus, Settings } from "lucide-react";
import UserProfile from "./UserProfile";
import React, { useEffect } from "react";

// Add animation CSS to document head
const addAnimationStyles = () => {
  // Check if style already exists
  if (document.getElementById('channel-list-animations')) return;
  
  const style = document.createElement('style');
  style.id = 'channel-list-animations';
  style.innerHTML = `
    @keyframes borderAnimation {
      0% {
        background-position: 0% 0%;
      }
      100% {
        background-position: 300% 0%;
      }
    }
    
    .active-agent-border {
      position: relative;
    }
    
    .active-agent-border::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 0.375rem; /* matches rounded-md */
      pointer-events: none;
      border: 1px solid rgba(156, 163, 175, 0.15); /* extremely faint gray border */
      z-index: 0;
    }
    
    .active-agent-border::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 0.375rem; /* matches rounded-md */
      pointer-events: none;
      z-index: 1;
      background: linear-gradient(
        90deg, 
        transparent, 
        transparent,
        rgba(99, 102, 241, 0.8),
        transparent,
        transparent
      );
      background-size: 300% 100%;
      animation: borderAnimation 3s linear infinite;
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      border: 1px solid transparent;
    }
  `;
  document.head.appendChild(style);
};

const ChannelList = () => {
  const { activeChannelId, setActiveChannelId, openFileInPanel } = useWorkspace();

  // Add animation styles when component mounts
  useEffect(() => {
    addAnimationStyles();
    // Clean up style when component unmounts
    return () => {
      const style = document.getElementById('channel-list-animations');
      if (style) style.remove();
    };
  }, []);

  const primaryChannels: Channel[] = [
    { 
      id: "clever-fox-3721", 
      name: "clever-fox-3721", 
      type: "primary", 
      active: activeChannelId === "clever-fox-3721", 
      botType: "Assistant AI", 
      isActive: true 
    },
    { 
      id: "swift-eagle-9042", 
      name: "swift-eagle-9042", 
      type: "primary", 
      active: activeChannelId === "swift-eagle-9042", 
      botType: "Code Helper AI", 
      isActive: false 
    },
    { 
      id: "creative-owl-7238", 
      name: "creative-owl-7238", 
      type: "primary", 
      active: activeChannelId === "creative-owl-7238", 
      botType: "Design AI", 
      isActive: true 
    },
    { 
      id: "precise-deer-5190", 
      name: "precise-deer-5190", 
      type: "primary", 
      active: activeChannelId === "precise-deer-5190", 
      botType: "Data Analyst AI", 
      isActive: false 
    },
  ];

  const directiveChannels: Channel[] = [
    { 
      id: "code-to-design", 
      name: "swift-eagle-9042 → creative-owl-7238", 
      type: "directive", 
      active: activeChannelId === "code-to-design",
      isActive: true
    },
    { 
      id: "design-to-deploy", 
      name: "creative-owl-7238 → clever-fox-3721", 
      type: "directive", 
      active: activeChannelId === "design-to-deploy",
      isActive: false
    },
    { 
      id: "dev-to-analytics", 
      name: "swift-eagle-9042 → precise-deer-5190", 
      type: "directive", 
      active: activeChannelId === "dev-to-analytics",
      isActive: true
    },
  ];

  const directMessages: Channel[] = [
    { 
      id: "dm-alex",
      name: "Alex Kim",
      type: "direct",
      active: activeChannelId === "dm-alex",
      status: "online"
    },
    { 
      id: "dm-taylor",
      name: "Taylor Chen",
      type: "direct",
      active: activeChannelId === "dm-taylor",
      status: "away"
    },
    { 
      id: "dm-jordan",
      name: "Jordan Patel",
      type: "direct",
      active: activeChannelId === "dm-jordan",
      status: "offline"
    },
  ];

  const textChannels: Channel[] = [
    { 
      id: "channel-general",
      name: "general",
      type: "text",
      active: activeChannelId === "channel-general",
      memberCount: 18
    },
    { 
      id: "channel-development",
      name: "development",
      type: "text",
      active: activeChannelId === "channel-development",
      memberCount: 12
    },
    { 
      id: "channel-design",
      name: "design",
      type: "text",
      active: activeChannelId === "channel-design",
      memberCount: 8
    },
  ];

  const handleChannelClick = (channelId: string) => {
    // Set the selected channel as the active channel
    setActiveChannelId(channelId);
    
    // Open the channel in the editor layout with the proper content type
    openFileInPanel(channelId);
  };

  // Simple status indicator for directive channels
  const SimpleStatusIndicator = ({ isActive }: { isActive: boolean }) => {
    return (
      <div className="relative flex-shrink-0 w-2 h-2 mr-2">
        <div className={`absolute inset-0 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-gray-500'}`}></div>
      </div>
    );
  };

  // Simple status indicator for direct messages
  const UserStatusIndicator = ({ status }: { status: string }) => {
    const statusColor = 
      status === "online" ? "bg-emerald-500" : 
      status === "away" ? "bg-amber-500" : 
      "bg-gray-500";
    
    return (
      <div className="relative flex-shrink-0 w-2 h-2 mr-2">
        <div className={`absolute inset-0 rounded-full ${statusColor}`}></div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-[hsl(var(--dark-8))] w-full min-w-[180px] max-w-[320px] transition-all duration-300">
      {/* Header */}
      <div className="p-3 border-b border-gray-700/50">
        <h2 className="text-white font-semibold text-base">Channels</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-2 px-3">
        {/* Agentic Channels Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-[10px] font-semibold text-[hsl(var(--dark-2))] py-1">
            <div className="flex items-center gap-1">
              <ChevronDown size={10} />
              <span className="tracking-wider">Agentic Channels</span>
            </div>
            <button className="hover:text-white transition-colors hover:bg-[hsl(var(--dark-7))] rounded p-1">
              <Plus size={12} />
            </button>
          </div>
          
          <div className="space-y-1">
            {primaryChannels.map((channel) => (
              <div
                key={channel.id}
                onClick={() => handleChannelClick(channel.id)}
                className={`
                  relative flex items-center px-2 py-1.5 rounded-md group
                  hover:bg-[hsl(var(--dark-7))] 
                  ${channel.active ? 'bg-[hsl(var(--dark-7))] text-white' : 'text-[hsl(var(--dark-2))]'}
                  hover:text-white transition-colors cursor-pointer
                  ${channel.isActive ? 'active-agent-border' : ''}
                `}
              >
                <div className="flex-1 min-w-0 truncate text-xs font-medium">
                  {channel.name}
                  {channel.botType && (
                    <div className="text-[10px] text-[hsl(var(--dark-3))] truncate">
                      {channel.botType}
                    </div>
                  )}
                </div>
                
                <div className={`${channel.active ? 'flex' : 'hidden group-hover:flex'} text-[hsl(var(--dark-2))] space-x-1`}>
                  <button className="hover:text-white p-0.5 rounded hover:bg-[hsl(var(--dark-6))] transition-colors">
                    {channel.isActive ? <Pause size={12} /> : <Play size={12} />}
                  </button>
                  <button className="hover:text-white p-0.5 rounded hover:bg-[hsl(var(--dark-6))] transition-colors">
                    <Settings size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Directive Channels Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-[10px] font-semibold text-[hsl(var(--dark-2))] py-1">
            <div className="flex items-center gap-1">
              <ChevronDown size={10} />
              <span className="tracking-wider">Directive Channels</span>
            </div>
            <button className="hover:text-white transition-colors hover:bg-[hsl(var(--dark-7))] rounded p-1">
              <Plus size={12} />
            </button>
          </div>
          
          <div className="space-y-1">
            {directiveChannels.map((channel) => {
              // Extract source and target for better display
              const parts = channel.name.split(' → ');
              const sourceName = parts[0];
              const targetName = parts[1];
              
              return (
                <div
                  key={channel.id}
                  onClick={() => handleChannelClick(channel.id)}
                  className={`flex items-center px-2 py-1.5 rounded-md group
                    hover:bg-[hsl(var(--dark-7))] 
                    ${channel.active ? 'bg-[hsl(var(--dark-7))] text-white' : 'text-[hsl(var(--dark-2))]'}
                    hover:text-white transition-colors cursor-pointer`}
                >
                  <SimpleStatusIndicator isActive={channel.isActive ?? false} />
                  
                  <div className="flex-1 min-w-0 text-xs font-medium">
                    <div className="truncate">
                      {channel.id}
                    </div>
                    <div className="text-[10px] text-[hsl(var(--dark-3))] truncate">
                      {sourceName} → {targetName}
                    </div>
                  </div>
                  
                  <div className={`${channel.active ? 'flex' : 'hidden group-hover:flex'} text-[hsl(var(--dark-2))] space-x-1`}>
                    <button className="hover:text-white p-0.5 rounded hover:bg-[hsl(var(--dark-6))] transition-colors">
                      {channel.isActive ? <Pause size={12} /> : <Play size={12} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Direct Messages Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-[10px] font-semibold text-[hsl(var(--dark-2))] py-1">
            <div className="flex items-center gap-1">
              <ChevronDown size={10} />
              <span className="tracking-wider">Direct Messages</span>
            </div>
            <button className="hover:text-white transition-colors hover:bg-[hsl(var(--dark-7))] rounded p-1">
              <Plus size={12} />
            </button>
          </div>
          
          <div className="space-y-1">
            {directMessages.map((channel) => (
              <div
                key={channel.id}
                onClick={() => handleChannelClick(channel.id)}
                className={`flex items-center px-2 py-1.5 rounded-md group
                  hover:bg-[hsl(var(--dark-7))] 
                  ${channel.active ? 'bg-[hsl(var(--dark-7))] text-white' : 'text-[hsl(var(--dark-2))]'}
                  hover:text-white transition-colors cursor-pointer`}
              >
                <UserStatusIndicator status={channel.status || 'offline'} />
                
                <div className="flex-1 min-w-0 truncate text-xs font-medium">
                  {channel.name}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Text Channels Section */}
        <div>
          <div className="flex items-center justify-between text-[10px] font-semibold text-[hsl(var(--dark-2))] py-1">
            <div className="flex items-center gap-1">
              <ChevronDown size={10} />
              <span className="tracking-wider">Text Channels</span>
            </div>
            <button className="hover:text-white transition-colors hover:bg-[hsl(var(--dark-7))] rounded p-1">
              <Plus size={12} />
            </button>
          </div>
          
          <div className="space-y-1">
            {textChannels.map((channel) => (
              <div
                key={channel.id}
                onClick={() => handleChannelClick(channel.id)}
                className={`flex items-center px-2 py-1.5 rounded-md group
                  hover:bg-[hsl(var(--dark-7))] 
                  ${channel.active ? 'bg-[hsl(var(--dark-7))] text-white' : 'text-[hsl(var(--dark-2))]'}
                  hover:text-white transition-colors cursor-pointer`}
              >
                <div className="flex-1 min-w-0 text-xs font-medium">
                  <div className="truncate">
                    #{channel.name}
                  </div>
                  {channel.memberCount && (
                    <div className="text-[10px] text-[hsl(var(--dark-3))] truncate">
                      {channel.memberCount} members
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* User Profile fixed at bottom */}
      <UserProfile />
    </div>
  );
};

export default ChannelList;
