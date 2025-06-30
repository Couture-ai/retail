import React from 'react';
import TimelineView from '../task/TimelineView';
import { TreeNode } from '@/types';

interface TimelineTabProps {
  panelId: string;
  node?: TreeNode;
}

const TimelineTab: React.FC<TimelineTabProps> = ({ panelId, node }) => {
  return (
    <div className="h-full overflow-hidden flex flex-col">
      <TimelineView />
    </div>
  );
};

export default TimelineTab; 