import { memo, useState, useEffect } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Bot, Terminal, Network, BrainCircuit, Zap } from 'lucide-react';
import { useWorkspace } from '@/context/WorkspaceProvider';
import { useTheme } from '@/context/ThemeProvider';

type BotNodeData = {
  label: string;
  role: string;
  description?: string;
  id: string;
};

// Get role-specific styling
const getRoleConfig = (role: string, isActive: boolean, isDarkMode: boolean) => {
  const activeState = isActive ? 'active' : 'inactive';
  
  // Base styling that changes with dark/light mode
  const baseColors = {
    dark: {
      bg: 'bg-gray-800',
      border: 'border-gray-700',
      text: 'text-gray-100',
      subtext: 'text-gray-300'
    },
    light: {
      bg: 'bg-gray-100',
      border: 'border-gray-300',
      text: 'text-gray-800',
      subtext: 'text-gray-600'
    }
  };
  
  const mode = isDarkMode ? 'dark' : 'light';
  
  // Role-specific configurations
  const configs: Record<string, any> = {
    ceo: {
      icon: <BrainCircuit size={16} className={`${isActive ? 'text-purple-400' : 'text-gray-400'}`} />,
      color: `${isActive ? 'border-purple-500' : baseColors[mode].border}`,
      bgColor: isDarkMode ? 'bg-purple-950/20' : 'bg-purple-50',
      roleLabel: 'CEO',
      iconBg: isDarkMode ? 'bg-purple-900/50' : 'bg-purple-100'
    },
    vp: {
      icon: <Network size={16} className={`${isActive ? 'text-blue-400' : 'text-gray-400'}`} />,
      color: `${isActive ? 'border-blue-500' : baseColors[mode].border}`,
      bgColor: isDarkMode ? 'bg-blue-950/20' : 'bg-blue-50',
      roleLabel: 'VP AI',
      iconBg: isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100'
    },
    manager: {
      icon: <Zap size={16} className={`${isActive ? 'text-green-400' : 'text-gray-400'}`} />,
      color: `${isActive ? 'border-green-500' : baseColors[mode].border}`,
      bgColor: isDarkMode ? 'bg-green-950/20' : 'bg-green-50',
      roleLabel: 'Manager AI',
      iconBg: isDarkMode ? 'bg-green-900/50' : 'bg-green-100'
    },
    developer: {
      icon: <Terminal size={16} className={`${isActive ? 'text-amber-400' : 'text-gray-400'}`} />,
      color: `${isActive ? 'border-amber-500' : baseColors[mode].border}`,
      bgColor: isDarkMode ? 'bg-amber-950/20' : 'bg-amber-50',
      roleLabel: 'Developer AI',
      iconBg: isDarkMode ? 'bg-amber-900/50' : 'bg-amber-100'
    }
  };
  
  return {
    ...configs[role] || configs.developer,
    baseColors: baseColors[mode]
  };
};

const BotNode = ({ data, selected, id }: NodeProps<BotNodeData>) => {
  const { label, role } = data;
  const { activeBotId } = useWorkspace();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const [isActive, setIsActive] = useState(false);
  
  // Randomly determine if this node is active (for the pulsating effect)
  useEffect(() => {
    setIsActive(Math.random() > 0.5);
  }, []);
  
  const config = getRoleConfig(role, isActive, isDarkMode);
  
  return (
    <div 
      className={`p-0 rounded-md border shadow-lg min-w-[180px] relative transition-all duration-300
        ${config.bgColor} ${config.color} overflow-hidden
        ${selected ? '!border-orange-500 shadow-orange-500/20' : ''}`}
    >
      {/* Active border effect */}
      {activeBotId === id && (
        <div className="absolute inset-0 rounded-md border-2 border-primary/80 animate-pulse pointer-events-none"></div>
      )}
      
      {/* Pulsating border effect for active bots */}
      {isActive && (
        <div className="absolute inset-0 rounded-md border-2 border-opacity-50 pointer-events-none pulsate-border"
          style={{
            borderColor: isDarkMode ? 
              `${activeBotId === id ? 'rgb(var(--primary))' : config.color.includes('border-') ? config.color.replace('border-', 'rgb(') + ')' : 'rgba(107, 114, 128, 0.5)'}` : 
              `${activeBotId === id ? 'rgb(var(--primary))' : 'rgba(107, 114, 128, 0.5)'}`
          }}
        ></div>
      )}
      
      {/* Directive and communication handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="directiveTarget"
        style={{ top: '35%', background: '#ef4444', width: '10px', height: '10px' }}
        isConnectable={true}
        className="!border-2 !border-red-950"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="directiveSource"
        style={{ top: '35%', background: '#ef4444', width: '10px', height: '10px' }}
        isConnectable={true}
        className="!border-2 !border-red-950"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="communicationTarget"
        style={{ top: '75%', background: '#9ca3af', width: '10px', height: '10px' }}
        isConnectable={true}
        className="!border-2 !border-gray-800"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="communicationSource"
        style={{ top: '75%', background: '#9ca3af', width: '10px', height: '10px' }}
        isConnectable={true}
        className="!border-2 !border-gray-800"
      />
      
      {/* Bot header with role indication */}
      <div className={`flex items-center justify-between px-3 py-2 border-b ${config.border}`}>
        <div className="flex items-center gap-2">
          <div className={`w-5 h-5 rounded-full ${config.iconBg} flex items-center justify-center`}>
            {config.icon}
          </div>
          <span className={`text-xs font-medium ${config.baseColors.subtext}`}>{config.roleLabel}</span>
        </div>
        
        {/* Status indicator */}
        {isActive ? (
          <div className="relative">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="absolute inset-0 w-2 h-2 bg-green-400/50 rounded-full animate-ping"></div>
          </div>
        ) : (
          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
        )}
      </div>
      
      {/* Bot content */}
      <div className="p-3">
        <div className={`text-sm font-medium mb-0.5 ${config.baseColors.text}`}>{label}</div>
        
        {/* Additional information like division */}
        <div className="flex flex-col mt-1">
          <div className={`text-xs ${config.baseColors.subtext} opacity-70`}>
            {role === 'ceo' && 'Master AI'}
            {role === 'vp' && ['Technology Division', 'Operations Division', 'Strategy Division'][Math.floor(Math.random() * 3)]}
            {role === 'manager' && ['Infrastructure Team Lead', 'Development Team Lead', 'Product Team Lead'][Math.floor(Math.random() * 3)]}
            {role === 'developer' && ['Frontend Services', 'Data Analytics', 'Security Services', 'Cloud Infrastructure', 'Network Services'][Math.floor(Math.random() * 5)]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(BotNode);