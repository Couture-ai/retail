import React from 'react';
import { TreeNode } from '@/types';
import TimelineView from './TimelineView';
import TaskTab from './TaskTab';

interface TaskPanelProps {
  node: TreeNode;
  panelId: string;
}

const TaskPanel: React.FC<TaskPanelProps> = ({ node, panelId }) => {
  // Check if this is a special timeline-view node
  if (node.id === 'timeline-view') {
    return <TimelineView />;
  }
  
  // Otherwise, render the regular task tab
  return <TaskTab node={node} panelId={panelId} />;
};

export default TaskPanel; 