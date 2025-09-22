import { useWorkspace } from "@/context/WorkspaceProvider";
import { useTheme } from "@/context/ThemeProvider";
import { useAgent } from "@/context/AgentProvider";
import { useProject } from "@/context/ProjectProvider";
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
  Settings2,
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
  Boxes,
  Rocket
} from "lucide-react";
import { EnhancedTooltip } from "@/components/ui/enhanced-tooltip";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MovingBorderButton } from "@/components/ui/moving-border";
import { useState, useEffect } from "react";

// --- Project config logic ---
const projectConfigs: Record<string, { stage: 'get-started' | 'post-get-started' }> = {
  'Reliance Digital': { stage: 'post-get-started' },
  'Reliance Jewels': { stage: 'get-started' },
  'Fashion & Lifestyle': { stage: 'post-get-started' },
};

const Sidebar = () => {
  const { selectedProject, projectToSlug } = useProject();
  const { activeModule, setActiveModule } = useWorkspace();
  const { theme, toggleTheme } = useTheme();
  const { toggleAgentPanel, isAgentPanelOpen } = useAgent();

  // Get the app prefix from environment variables
  const APP_PREFIX = import.meta.env.VITE_APP_PREFIX || '';
  const prefixedPath = (path: string) => APP_PREFIX ? `/${APP_PREFIX}${path}` : path;

  const handleModuleClick = (module: Module) => {
    setActiveModule(module);
    // Update the URL to reflect the active module with slug-based routing
    const slug = projectToSlug(selectedProject);
    const modulePath = module === "home" ? "" : `/${module}`;
    window.history.pushState({}, "", prefixedPath(`/${slug}${modulePath}`));
  };

  // Creator's Studio icon with beta indicator
  const CreatorStudioIcon = () => (
    <div className="flex items-center justify-center">
      <DraftingCompass size={17} className="text-purple-300" />
    </div>
  );

  // Only show navItems if not in get-started stage
  const navItems = [
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
      id: "rules", 
      name: "Business Rules",
      icon: <Settings2 size={18} />, 
      module: "rules" as Module,
      description: "Configure business rules, policies, and automated workflows for your operations." 
    },
    { 
      id: "analytics", 
      name: "Analytics Hub",
      icon: <BarChart3 size={18} />, 
      module: "analytics" as Module,
      description: "Deep insights and comprehensive reporting on sales performance, trends, and business metrics." 
    },
  ];

  const projectConfig = projectConfigs[selectedProject] || { stage: 'post-get-started' };
  const showGetStarted = projectConfig.stage === 'get-started';
  const showNavItems = true; // Always show nav items, but disable if in get-started
  const disableNavItems = projectConfig.stage === 'get-started';

  return (
    <TooltipProvider>
      <div className="w-10 bg-[hsl(var(--sidebar-background))] flex flex-col items-center py-4 border-r border-[hsl(var(--sidebar-border))]">
        {/* Get Started button above Home, only if in get-started stage */}
        {showGetStarted && (
          <EnhancedTooltip 
            trigger={
              <IconButton
                key="get-started"
                variant={activeModule === "get-started" ? "active" : "default"}
                onClick={() => handleModuleClick("get-started" as Module)}
                aria-label="get-started"
                className="mb-3"
              >
                <Rocket size={18} />
              </IconButton>
            }
            title="Get Started"
            icon={<Rocket size={18} />}
            description="Begin onboarding and setup for your project"
          />
        )}
        {/* Home button at top */}
        <EnhancedTooltip 
          trigger={
            <IconButton
              key="home"
              variant={activeModule === "home" ? "active" : "default"}
              onClick={disableNavItems ? undefined : () => handleModuleClick("home")}
              aria-label="home"
              className={`mb-6 ${disableNavItems ? 'opacity-50 pointer-events-none' : ''}`}
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
          {navItems.map((item) => {
            const isDisabled = disableNavItems;
            return (
              <EnhancedTooltip
                key={item.id}
                trigger={
                  <span className={isDisabled ? 'opacity-50' : ''}>
                    <IconButton
                      variant={"default"}
                      className={`relative${isDisabled ? ' pointer-events-none' : ''}`}
                      onClick={isDisabled ? undefined : () => handleModuleClick(item.module)}
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
                  </span>
                }
                title={item.name}
                icon={item.id === "creator" ? <CreatorStudioIcon /> : item.icon}
                description={isDisabled ? (
                  <>
                    <div>{item.description}</div>
                    <div className="text-xs text-red-500 mt-1">Complete the onboarding first.</div>
                  </>
                ) : item.description}
              >
                {item.hasAttention && (
                  <div className="px-3 py-2 border-t border-[hsl(var(--tooltip-border-separator))] bg-red-50 dark:bg-red-950/20">
                    <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                      ⚠️ Needs Attention
                    </div>
                  </div>
                )}
              </EnhancedTooltip>
            );
          })}
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
