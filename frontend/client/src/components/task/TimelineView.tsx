import React, { useMemo } from 'react';
import Timeline from 'react-calendar-timeline';
import 'react-calendar-timeline/dist/style.css';
import moment from 'moment';
import '@/styles/timeline.css';

// Define minimal types for timeline data
type TimelineGroup = {
  id: string;
  title: string;
  agentType: string;
};

type TaskStatus = 'done' | 'paused' | 'doing';

type TimelineItem = {
  id: string;
  group: string;
  title: string;
  start_time: number;
  end_time: number; // Required by the timeline library
  status: TaskStatus;
  isOngoing?: boolean; // Flag to identify ongoing tasks
};

// Status colors using translucent colors as requested
const statusColors = {
  'done': 'rgba(16, 185, 129, 0.5)', // Translucent green
  'paused': 'rgba(107, 114, 128, 0.7)', // Gray
  'doing': 'rgba(249, 115, 22, 0.8)' // Orange
};

const TimelineView: React.FC = () => {
  // Create mock agent groups
  const groups = useMemo<TimelineGroup[]>(() => [
    { id: '1', title: 'Swift Eagle', agentType: 'Reasoning Agent' },
    { id: '2', title: 'Creative Owl', agentType: 'Design Agent' },
    { id: '3', title: 'Precise Deer', agentType: 'Analysis Agent' },
    { id: '4', title: 'Clever Fox', agentType: 'Implementation Agent' },
    { id: '5', title: 'Wise Owl', agentType: 'Infrastructure Agent' },
    // Additional 10 agents
    { id: '6', title: 'Bold Lion', agentType: 'Security Agent' },
    { id: '7', title: 'Silent Panther', agentType: 'Monitoring Agent' },
    { id: '8', title: 'Quick Falcon', agentType: 'Dispatch Agent' },
    { id: '9', title: 'Steady Turtle', agentType: 'Backup Agent' },
    { id: '10', title: 'Agile Dolphin', agentType: 'Navigation Agent' },
    { id: '11', title: 'Loyal Wolf', agentType: 'Coordination Agent' },
    { id: '12', title: 'Cautious Rabbit', agentType: 'Safety Agent' },
    { id: '13', title: 'Strategic Raven', agentType: 'Planning Agent' },
    { id: '14', title: 'Diligent Beaver', agentType: 'Maintenance Agent' },
    { id: '15', title: 'Attentive Hawk', agentType: 'Surveillance Agent' }
  ], []);

  // Generate mock timeline items
  const items = useMemo<TimelineItem[]>(() => {
    const result: TimelineItem[] = [];
    const now = moment();
    const taskTitles = [
      'Process telemetry data',
      'Optimize route calculations',
      'Analyze driver behavior patterns',
      'Update vehicle diagnostics',
      'Deploy firmware updates',
      'Generate fleet efficiency report',
      'Verify navigation data integrity',
      'Perform risk assessment',
      'Simulate weather conditions impact',
      'Run predictive maintenance checks',
      // Additional task types for more variety
      'Monitor security protocols',
      'Calibrate sensor array',
      'Cross-reference GPS coordinates',
      'Update traffic pattern models',
      'Scan for system vulnerabilities',
      'Synchronize fleet communications',
      'Validate driver credentials',
      'Audit fuel consumption metrics',
      'Test emergency response systems',
      'Compile regulatory compliance data'
    ];
    
    // Choose 2-3 agents to have ongoing tasks
    const totalAgentsCount = groups.length;
    const ongoingTaskAgentCount = Math.floor(Math.random() * 2) + 2; // 2-3 agents
    const agentsWithOngoingTasks = new Set<string>();
    
    // Randomly select agents to have ongoing tasks
    while (agentsWithOngoingTasks.size < ongoingTaskAgentCount) {
      const randomAgentId = String(Math.floor(Math.random() * totalAgentsCount) + 1);
      agentsWithOngoingTasks.add(randomAgentId);
    }
    
    // Create 2-3 tasks for each agent
    groups.forEach(group => {
      const taskCount = Math.floor(Math.random() * 2) + 2;
      const hasOngoingTasks = agentsWithOngoingTasks.has(group.id);
      
      for (let i = 0; i < taskCount; i++) {
        // Determine status based on whether this agent can have ongoing tasks
        let status: TaskStatus;
        if (hasOngoingTasks && i === 0) { // First task for selected agents is "doing"
          status = 'doing';
        } else {
          // Other agents only get 'done' or 'paused' tasks
          status = Math.random() > 0.5 ? 'done' : 'paused';
        }
        
        // Time calculations
        const hoursOffset = Math.floor(Math.random() * 36); // Past or near future
        const startTime = moment(now).subtract(hoursOffset, 'hours');
        
        // Calculate end time based on status
        let endTime: number;
        let isOngoing = false;
        
        if (status === 'doing') {
          // For ongoing tasks, use current time + 2 hours as placeholder end time
          endTime = moment(now).add(2, 'hours').valueOf();
          isOngoing = true; // Mark as ongoing for visual rendering
        } else {
          // For done/paused tasks, use realistic duration
          const durationHours = Math.floor(Math.random() * 8) + 1;
          endTime = moment(startTime).add(durationHours, 'hours').valueOf();
        }
        
        // Select task title
        const title = taskTitles[Math.floor(Math.random() * taskTitles.length)];
        
        // Create the task item with all required properties
        result.push({
          id: `${group.id}-${i}`,
          group: group.id,
          title,
          start_time: startTime.valueOf(),
          end_time: endTime,
          status,
          isOngoing
        });
      }
    });
    
    return result;
  }, [groups]);

  // Define time range (48 hours before now to 24 hours after)
  const timeRange = useMemo(() => {
    const now = moment();
    return {
      start: moment(now).subtract(48, 'hours').valueOf(),
      end: moment(now).add(24, 'hours').valueOf()
    };
  }, []);

  // Custom item renderer for line style tasks with loader for 'doing' tasks
  const itemRenderer = ({ item, getItemProps, itemContext }: any) => {
    const { status, isOngoing } = item as TimelineItem;
    const backgroundColor = statusColors[status as TaskStatus];
    
    // Style specifics for the task line
    const lineHeight = status === 'doing' ? 6 : 4; // Thicker line for active tasks
    
    // Base styling for all task labels
    const labelStyle = {
      position: 'absolute' as const,
      top: `-20px`,
      left: '0',
      fontSize: '11px',
      whiteSpace: 'nowrap' as const,
      color: 'white',
      pointerEvents: 'none' as const
    };
    
    // For 'doing' tasks, we'll need special styling
    if (status === 'doing' && isOngoing) {
      return (
        <div
          {...getItemProps({
            style: {
              overflow: 'visible',
              height: '100%',
              borderRadius: 0,
              border: 0,
              background: 'transparent',
              display: 'flex',
              alignItems: 'center'
            }
          })}
          data-status={status}
        >
          {/* Line for the task */}
          <div 
            className="task-line task-doing"
            style={{
              height: `${lineHeight}px`,
              backgroundColor,
              width: '100%', 
              position: 'relative'
            }}
          >
            {/* Cooler marker at the end - arrow/triangle with glow effect */}
            <div className="task-arrow-marker"></div>
            
            {/* Static task label */}
            <div style={labelStyle}>
              {item.title}
            </div>
          </div>
        </div>
      );
    }
    
    // For done or paused tasks
    return (
      <div
        {...getItemProps({
          style: {
            overflow: 'visible',
            height: '100%',
            borderRadius: 0,
            border: 0,
            background: 'transparent',
            display: 'flex',
            alignItems: 'center'
          }
        })}
        data-status={status}
      >
        {/* Line for the task */}
        <div 
          style={{
            height: `${lineHeight}px`,
            backgroundColor,
            width: '100%',
            position: 'relative'
          }}
        >
          {/* Static task label */}
          <div style={labelStyle}>
          {item.title}
          </div>
        </div>
      </div>
    );
  };

  // Custom group renderer 
  const groupRenderer = ({ group }: { group: TimelineGroup }) => (
    <div className="flex flex-col h-full justify-center px-2">
      <div className="text-sm font-medium">{group.title}</div>
      <div className="text-xs text-gray-400">{group.agentType}</div>
    </div>
  );

  // Custom sidebar header renderer
  const sidebarHeaderRenderer = () => (
    <div 
      className="text-xs font-medium p-2 text-gray-300 bg-[hsl(var(--dark-9))] border-b border-[hsl(var(--dark-6))]"
    >
      Agents
    </div>
  );

  return (
    <div className="h-full bg-[hsl(var(--dark-8))] flex flex-col">
      {/* Fixed header for context - optional */}
      <div className="text-sm font-medium py-2 px-4 bg-[hsl(var(--dark-9))] border-b border-[hsl(var(--dark-6))]">
        Agent Timeline
      </div>

      {/* Scrollable timeline container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden" style={{ height: 'calc(100% - 35px)' }}>
        <Timeline
          groups={groups}
          items={items}
          defaultTimeStart={timeRange.start}
          defaultTimeEnd={timeRange.end}
          stackItems
          lineHeight={50}
          itemHeightRatio={0.65}
          canMove={false}
          canResize={false}
          canChangeGroup={false}
          sidebarWidth={180}
          itemRenderer={itemRenderer}
          groupRenderer={groupRenderer}
          sidebarContent={sidebarHeaderRenderer()}
          className="timeline-component"
          // @ts-ignore
          todayMarkerProps={{
            visible: true,
            style: { backgroundColor: 'hsla(var(--primary), 0.2)' }
          }}
        />
      </div>
      
      <style>{`
        /* Custom timeline styling */
        .react-calendar-timeline .rct-header {
          background-color: hsl(var(--dark-9));
          border-color: hsl(var(--dark-6)) !important;
        }
        
        .react-calendar-timeline .rct-sidebar {
          background-color: hsl(var(--dark-9));
          border-color: hsl(var(--dark-6)) !important;
        }
        
        .react-calendar-timeline .rct-sidebar-row {
          border-color: hsl(var(--dark-6)) !important;
          border-bottom-width: 1px;
          border-bottom-style: solid;
        }
        
        .react-calendar-timeline .rct-vertical-lines .rct-vl {
          border-color: hsl(var(--dark-6)) !important;
        }
        
        .react-calendar-timeline .rct-horizontal-lines .rct-hl {
          border-color: hsl(var(--dark-6)) !important;
        }
        
        .react-calendar-timeline .rct-calendar-header {
          border-color: hsl(var(--dark-6)) !important;
          color: #d1d5db;
        }
        
        /* Fix sidebar header styling */
        .react-calendar-timeline [data-testid="sidebarHeader"] {
          color: hsl(var(--dark-3)) !important;
          background-color: hsl(var(--dark-9));
          border-bottom: 1px solid hsl(var(--dark-6)) !important;
          padding: 6px;
          font-size: 12px;
        }
        
        /* Make even/odd rows more subtle */
        .react-calendar-timeline .rct-sidebar-row-even {
          background-color: hsl(var(--dark-8));
        }
        
        .react-calendar-timeline .rct-sidebar-row-odd {
          background-color: hsl(var(--dark-9));
        }
        
        .react-calendar-timeline .rct-hl-even {
          background-color: hsl(var(--dark-8));
          border-top: 1px solid hsl(var(--dark-6)) !important;
          border-bottom: 1px solid hsl(var(--dark-6)) !important;
        }
        
        .react-calendar-timeline .rct-hl-odd {
          background-color: hsl(var(--dark-9));
          border-top: 1px solid hsl(var(--dark-6)) !important;
          border-bottom: 1px solid hsl(var(--dark-6)) !important;
        }
        
        /* Remove potentially red borders */
        .react-calendar-timeline .rct-vl-first {
          border-color: hsl(var(--dark-6)) !important;
        }
        
        .react-calendar-timeline .rct-dateHeader {
          border-color: hsl(var(--dark-6)) !important;
        }

        /* Fix date header styling - make them dark themed */
        .react-calendar-timeline .rct-dateHeader {
          background-color: hsl(var(--dark-8));
          color: hsl(var(--dark-3));
          border-left: 1px solid hsl(var(--dark-6)) !important;
        }

        .react-calendar-timeline .rct-dateHeader-primary {
          background-color: hsl(var(--dark-9));
          color: #d1d5db;
          border-bottom: 1px solid hsl(var(--dark-6)) !important;
        }
        
        /* Ensure all borders everywhere in the timeline have consistent color */
        .react-calendar-timeline * {
          border-color: hsl(var(--dark-6)) !important;
        }
        
        /* Specific elements that might have their own border styles */
        .react-calendar-timeline .rct-scroll {
          border-color: hsl(var(--dark-6)) !important;
        }
        
        .react-calendar-timeline .rct-item {
          border-color: hsl(var(--dark-6)) !important;
        }
        
        .react-calendar-timeline .rct-today {
          border-color: hsl(var(--dark-6)) !important;
        }
        
        /* Ensure weekends aren't grayed out */
        .react-calendar-timeline .rct-day-6,  /* Saturday */
        .react-calendar-timeline .rct-day-0 { /* Sunday */
          background-color: inherit !important;
          opacity: 1 !important;
          color: inherit !important;
        }
        
        /* Fix any day column styling to be consistent */
        .react-calendar-timeline .rct-vl {
          background-color: transparent !important;
        }
        
        .react-calendar-timeline .rct-day-6 .rct-label,
        .react-calendar-timeline .rct-day-0 .rct-label {
          color: inherit !important;
          opacity: 1 !important;
          font-weight: normal !important;
        }
        
        /* Only keep the growing animation, no pulsing */
        .task-doing {
          animation: grow 60s linear forwards;
          transform-origin: left;
        }
        
        @keyframes grow {
          0% { transform: scaleX(0.01); }
          100% { transform: scaleX(1); }
        }
        
        /* Cool arrow/triangle marker for ongoing tasks */
        .task-arrow-marker {
          position: absolute;
          right: -8px;
          top: -5px;
          height: 16px;
          width: 16px;
          clip-path: polygon(100% 50%, 50% 0, 50% 30%, 0 30%, 0 70%, 50% 70%, 50% 100%);
          background: linear-gradient(270deg, rgba(249, 115, 22, 0.9), rgba(249, 115, 22, 1));
          box-shadow: 0 0 8px rgba(249, 115, 22, 0.7);
          z-index: 10;
        }
        
        /* Make the timeline content taller to ensure it's scrollable */
        .react-calendar-timeline .rct-outer {
          min-height: 600px !important;
        }
        
        /* Ensure scrollbars look nice and consistent */
        .overflow-y-auto {
          scrollbar-width: thin;
          scrollbar-color: hsl(var(--dark-6)) hsl(var(--dark-9));
        }
        
        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: hsl(var(--dark-9));
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background-color: hsl(var(--dark-6));
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default TimelineView; 