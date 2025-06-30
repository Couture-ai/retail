import { useState, useCallback, useMemo, useEffect } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Edge,
  Connection,
  MarkerType,
  Node,
  Panel,
} from 'reactflow';
import { useWorkspace } from '@/context/WorkspaceProvider';
import { OrgBot } from '@/types';
import BotNodeSidebar from '../organization/BotNodeSidebar';
import BotNode from '../organization/BotNode';
import 'reactflow/dist/style.css';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

// Define custom node types
const nodeTypes = {
  botNode: BotNode,
};

// Function to create horizontal left-to-right hierarchy layout
const generateNodePositions = (bots: OrgBot[]) => {
  const positions = new Map<string, { x: number, y: number }>();
  
  // Define strict horizontal layout with fixed X positions for each role tier
  const roleXPositions: Record<string, number> = {
    'ceo': 50,
    'vp': 350,
    'manager': 650,
    'developer': 950
  };
  
  // Define vertical spacing for each role type
  const roleYSpread: Record<string, number> = {
    'ceo': 80,     // Small spread for CEO (usually just one)
    'vp': 160,     // Medium spread for VPs
    'manager': 130, // Medium spread for managers
    'developer': 110 // Tight spread for developers (usually more of them)
  };
  
  // Group bots by role for vertical distribution
  const botsByRole: Record<string, OrgBot[]> = {};
  bots.forEach(bot => {
    if (!botsByRole[bot.role]) {
      botsByRole[bot.role] = [];
    }
    botsByRole[bot.role].push(bot);
  });
  
  // Assign positions based on role - strict horizontal left-to-right hierarchy
  Object.entries(botsByRole).forEach(([role, roleBots]) => {
    const baseX = roleXPositions[role] || 200;
    const ySpread = roleYSpread[role] || 120;
    
    roleBots.forEach((bot, index) => {
      // Calculate Y position based on the number of bots with this role
      const totalBots = roleBots.length;
      const totalHeight = totalBots * ySpread;
      
      // Center nodes vertically within the view
      const startY = 350 - (totalHeight / 2);
      const y = startY + (index * ySpread);
      
      // Add subtle horizontal variation for each role to prevent perfect alignment
      // CEOs should be perfectly aligned, others can have small variations
      let xVariation = 0;
      if (role !== 'ceo') {
        xVariation = Math.random() * 30 - 15; // Subtle random value between -15 and 15
      }
      
      positions.set(bot.id, { 
        x: baseX + xVariation, 
        y
      });
    });
  });
  
  return positions;
};

const OrganizationModule = () => {
  const { 
    orgBots, 
    orgConnections, 
    activeBotId, 
    setActiveBotId 
  } = useWorkspace();

  // Generate optimized positions for nodes
  const nodePositions = useMemo(() => generateNodePositions(orgBots), [orgBots]);

  // Convert our data to ReactFlow nodes and edges
  const initialNodes: Node[] = useMemo(() => {
    return orgBots.map((bot) => {
      const position = nodePositions.get(bot.id) || bot.position || { x: 0, y: 0 };
      
      return {
        id: bot.id,
        position,
        data: { 
          label: bot.name, 
          role: bot.role, 
          description: bot.description,
          id: bot.id 
        },
        type: 'botNode',
      };
    });
  }, [orgBots, nodePositions]);

  // Simpler edge styling with curved connections and reduced thickness
  const initialEdges: Edge[] = useMemo(() => {
    return orgConnections.map((conn) => ({
      id: conn.id,
      source: conn.source,
      target: conn.target,
      // Animate directive connections to indicate data flow
      animated: conn.type === 'directive',
      // Use smoothstep for better curved appearance
      type: 'smoothstep',
      // Custom edge style based on connection type
      style: {
        // Red for directive bus, Light gray for communication
        stroke: conn.type === 'directive' ? '#ef4444' : '#9ca3af',
        // Thinner connections as requested
        strokeWidth: conn.type === 'directive' ? 1.5 : 1,
        // Dotted/dashed line for communication channels
        strokeDasharray: conn.type === 'communication' ? '3 3' : undefined,
        // Directive buses should be more prominent than communication channels
        opacity: conn.type === 'directive' ? 0.9 : 0.4,
      },
      // Smaller arrow markers based on connection type
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: conn.type === 'directive' ? 12 : 8,
        height: conn.type === 'directive' ? 12 : 8,
        color: conn.type === 'directive' ? '#ef4444' : '#9ca3af',
      },
      // Connect to the appropriate handles on nodes
      sourceHandle: conn.type === 'directive' ? 'directiveSource' : 'communicationSource',
      targetHandle: conn.type === 'directive' ? 'directiveTarget' : 'communicationTarget',
      // No labels as requested
    }));
  }, [orgConnections]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [zoom, setZoom] = useState(1);
  const [rfInstance, setRfInstance] = useState<any>(null);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setActiveBotId(node.id);
  };

  // Handle zoom level changes
  useEffect(() => {
    if (rfInstance) {
      const { zoom } = rfInstance.getViewport();
      setZoom(zoom);
    }
  }, [rfInstance]);

  const handleZoomIn = () => {
    if (rfInstance) {
      const { x, y } = rfInstance.getViewport();
      rfInstance.setViewport({ x, y, zoom: zoom + 0.2 });
    }
  };

  const handleZoomOut = () => {
    if (rfInstance) {
      const { x, y } = rfInstance.getViewport();
      rfInstance.setViewport({ x, y, zoom: Math.max(0.1, zoom - 0.2) });
    }
  };

  const handleReset = () => {
    if (rfInstance) {
      rfInstance.fitView({ padding: 0.2 });
    }
  };

  return (
    <div className="flex flex-1 h-full overflow-hidden bg-gray-900">
      <div className="flex-1 h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          onInit={setRfInstance}
          fitView
          proOptions={{ hideAttribution: true }}
          minZoom={0.2}
          maxZoom={2}
          style={{ background: '#0c0d10' }}
        >
          <Panel position="top-right" className="flex gap-2">
            <button
              onClick={handleZoomIn}
              className="p-2 bg-gray-800 text-gray-200 rounded hover:bg-gray-700 transition-colors"
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 bg-gray-800 text-gray-200 rounded hover:bg-gray-700 transition-colors"
            >
              <ZoomOut size={16} />
            </button>
            <button
              onClick={handleReset}
              className="p-2 bg-gray-800 text-gray-200 rounded hover:bg-gray-700 transition-colors"
            >
              <RefreshCw size={16} />
            </button>
          </Panel>
        </ReactFlow>
      </div>
      {activeBotId && (
        <BotNodeSidebar 
          botId={activeBotId} 
          onClose={() => setActiveBotId(null)} 
        />
      )}
    </div>
  );
};

export default OrganizationModule;