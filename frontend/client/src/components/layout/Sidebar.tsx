import { useWorkspace } from "@/context/WorkspaceProvider";
import { useTheme } from "@/context/ThemeProvider";
import { useAgent } from "@/context/AgentProvider";
import { IconButton } from "../ui/icon-button";
import { Module } from "@/types";
import { 
  Home, 
  Bot, 
  NotebookText, 
  Code, 
  PieChart, 
  DollarSign, 
  Settings,
  Users,
  Sun,
  Moon,
  BotMessageSquare,
  Network,
  Terminal,
  CheckSquare,
  BrainCircuit,
  Library,
  HeartPulse,
  Activity,
  PiggyBank,
  Palette,
  Sparkles,
  Origami,
  DraftingCompass,
  Store,
  Package,
  TrendingUpDown,
  BarChart3,
  Rabbit,
  Boxes
} from "lucide-react";
import { EnhancedTooltip } from "@/components/ui/enhanced-tooltip";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MovingBorderButton } from "@/components/ui/moving-border";
import { useState, useEffect } from "react";

const Sidebar = () => {
  const { activeModule, setActiveModule } = useWorkspace();
  const { theme, toggleTheme } = useTheme();
  const { toggleAgentPanel, isAgentPanelOpen } = useAgent();

  // Get the app prefix from environment variables
  const APP_PREFIX = import.meta.env.VITE_APP_PREFIX || '';
  const prefixedPath = (path: string) => APP_PREFIX ? `/${APP_PREFIX}${path}` : path;

  const handleModuleClick = (module: Module) => {
    setActiveModule(module);
    // Update the URL to reflect the active module with prefix
    const modulePath = module === "home" ? "" : module;
    window.history.pushState({}, "", prefixedPath(`/${modulePath}`));
  };

  // Creator's Studio icon with beta indicator
  const CreatorStudioIcon = () => (
    <div className="flex items-center justify-center">
      <DraftingCompass size={17} className="text-purple-300" />
    </div>
  );

  const navItems = [
    // { 
    //   id: "chat", 
    //   name: "Channels",
    //   icon: <BotMessageSquare size={17} />, 
    //   module: "chat" as Module,
    //   description: "Chat with Business Intelligence Agents and view conversations between bots" 
    // },
    // { 
    //   id: "docs", 
    //   name: "Plan & Document",
    //   icon: <Library size={17} />, 
    //   module: "docs" as Module,
    //   description: "Create and manage project documentation and notes" 
    // },
    // { 
    //   id: "code", 
    //   name: "Code",
    //   icon: <Code size={17} />, 
    //   module: "code" as Module,
    //   description: "View and edit code files with syntax highlighting" 
    // },
    { 
      id: "forecast", 
      name: "Forecast Center",
      icon: <TrendingUpDown size={18} />, 
      module: "forecast" as Module,
      description: "Advanced AI-powered demand forecasting and trend analysis for optimized inventory planning." 
    },
    { 
      id: "inventory", 
      name: "Inventory & Orders",
      icon: <Boxes size={18} />, 
      module: "inventory" as Module,
      description: "Manage inventory levels, purchase orders, and supplier relationships across your retail network.",
      hasAttention: true
    },
    { 
      id: "product", 
      name: "Products & Categories",
      icon: <Package size={18} />, 
      module: "product" as Module,
      description: "Organize product catalogs, categories, and inventory details across all locations." 
    },
    { 
      id: "store", 
      name: "Stores & Regions",
      icon: <Store size={18} />, 
      module: "store" as Module,
      description: "Manage store locations, configurations, and regional settings for your retail network." 
    },
    { 
      id: "analytics", 
      name: "Analytics Hub",
      icon: <BarChart3 size={18} />, 
      module: "analytics" as Module,
      description: "Deep insights and comprehensive reporting on sales performance, trends, and business metrics." 
    },
    // { 
    //   id: "task", 
    //   name: "Tasks",
    //   icon: <CheckSquare size={17} />, 
    //   module: "task" as Module,
    //   description: "Manage and track tasks and project progress" 
    // },
    // { 
    //   id: "chart", 
    //   name: "Monitor",
    //   icon: <Activity size={17} />, 
    //   module: "chart" as Module,
    //   description: "Visualize metrics and data with interactive charts" 
    // },
    // { 
    //   id: "organization", 
    //   name: "Orchestration",
    //   icon: <BrainCircuit size={17} />, 
    //   module: "organization" as Module,
    //   description: "View the organization structure and bot hierarchy" 
    // },
    // { 
    //   id: "budget", 
    //   name: "Budget",
    //   icon: <PiggyBank size={17} />, 
    //   module: "budget" as Module,
    //   description: "Track and manage project budget and expenses" 
    // },

  ];

  return (
    <TooltipProvider>
      <div className="w-10 bg-[hsl(var(--sidebar-background))] flex flex-col items-center py-4 border-r border-[hsl(var(--sidebar-border))]">
        {/* Home button at top */}
        <EnhancedTooltip 
          trigger={
            <IconButton
              key="home"
              variant={activeModule === "home" ? "active" : "default"}
              onClick={() => handleModuleClick("home")}
              aria-label="home"
              className="mb-6"
            >
              <Home size={18} />
            </IconButton>
          }
          title="Home"
          icon={<Home size={18} />}
          description="Return to the home dashboard view"
        />
        
        {/* Center the main navigation items */}
        <div className="flex flex-col items-center space-y-2 flex-1 justify-center">
          {navItems.map((item) => (
            <EnhancedTooltip
              key={item.id}
              trigger={
                <IconButton
                  variant={"default"}
                  className={`relative`}
                  onClick={() => handleModuleClick(item.module)}
                  aria-label={item.id}
                >
                  {item.icon}
                  {/* Red warning indicator */}
                  {item.hasAttention && (
                    <div className="absolute top-1 left-1 text-red-500 text-sm font-bold">
                      !
                    </div>
                  )}
                  {/* a circle if active */}
                  {activeModule === item.module && (
                    <div className="absolute right-0 w-1 h-1 bg-[hsl(var(--sidebar-primary))] rounded-full"></div>
                  )}
                </IconButton>
              }
              title={item.name}
              icon={item.id === "creator" ? <CreatorStudioIcon /> : item.icon}
              description={item.description}
            >
              {item.hasAttention && (
                <div className="px-3 py-2 border-t border-[hsl(var(--tooltip-border-separator))] bg-red-50 dark:bg-red-950/20">
                  <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                    ⚠️ Needs Attention
                  </div>
                </div>
              )}
            </EnhancedTooltip>
          ))}
        </div>

        {/* Agent toggle button */}
        <EnhancedTooltip
          trigger={
            <MovingBorderButton
              asChild
              containerClassName="w-10 h-10"
              duration={4000}
              className="mb-6"
            >
              <button onClick={toggleAgentPanel} aria-label="Business Intelligence Agent">
                <Sparkles size={18} />
              </button>
            </MovingBorderButton>
          }
          title="Business Intelligence Agent"
          icon={<Sparkles size={18} />}
          description="💭 Try the advanced agent"
        />

        {/* Theme toggle button */}
        <EnhancedTooltip
          trigger={
            <IconButton
              variant="default"
              onClick={toggleTheme}
              className="mb-3 mt-3"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </IconButton>
          }
          title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          icon={theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          description={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        />
        
        {/* Settings button at bottom */}
        <EnhancedTooltip
          trigger={
            <IconButton
              variant={activeModule === "settings" ? "active" : "default"}
              onClick={() => handleModuleClick("settings")}
              aria-label="settings"
            >
              <Settings size={18} />
            </IconButton>
          }
          title="Settings"
          icon={<Settings size={18} />}
          description="Configure application preferences and user settings"
        />
      </div>
    </TooltipProvider>
  );
};

export default Sidebar;
