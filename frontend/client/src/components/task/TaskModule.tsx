import React, { useState, useRef, useEffect } from 'react';
import { TreeNode } from '@/types';
import ModulePanel from '../code/ModulePanel';
import EditorLayout from '../code/EditorLayout';
import SidebarSplitter from '../shared/SidebarSplitter';
import { useWorkspace } from '@/context/WorkspaceProvider';
import TaskTree from './TaskTree';

interface TaskModuleProps {
  isActiveModule: boolean;
}

const TaskModule: React.FC<TaskModuleProps> = ({ isActiveModule }) => {
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const taskTreeRef = useRef<HTMLDivElement>(null);
  const resizeContainerRef = useRef<HTMLDivElement>(null);
  const { editorLayout, openFileInPanel } = useWorkspace();

  // Handle opening a task from the task tree
  const handleOpenTask = (taskId: string) => {
    openFileInPanel(taskId);
  };

  // Handle resizing sidebar
  const handleResizeStart = () => {
    if (taskTreeRef.current) {
      taskTreeRef.current.style.pointerEvents = 'none';
    }
  };

  const handleResize = (newWidth: number) => {
    const containerRect = resizeContainerRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    
    // Constrain the sidebar width to reasonable limits
    const newSidebarWidth = Math.max(200, Math.min(400, newWidth));
    setSidebarWidth(newSidebarWidth);
  };

  const handleResizeEnd = () => {
    if (taskTreeRef.current) {
      taskTreeRef.current.style.pointerEvents = 'auto';
    }
  };

  // Listen for dragover events to prevent default behavior (required for drop to work)
  useEffect(() => {
    if (!isActiveModule) return;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    window.addEventListener('dragover', handleDragOver);
    return () => {
      window.removeEventListener('dragover', handleDragOver);
    };
  }, [isActiveModule]);

  return (
    <div className="flex-1 flex overflow-hidden" ref={resizeContainerRef}>
      {/* Sidebar panel */}
      <div style={{ width: sidebarWidth, flexShrink: 0 }} className="h-full overflow-hidden">
        <div className="h-full overflow-hidden" ref={taskTreeRef}>
          <TaskTree onTaskOpen={handleOpenTask} />
        </div>
      </div>
      
      {/* Resizer handle */}
      <SidebarSplitter
        onResizeStart={handleResizeStart}
        onResize={handleResize}
        onResizeEnd={handleResizeEnd}
      />
      
      {/* Editor area */}
      <div className="flex-1 h-full overflow-hidden">
        <EditorLayout layoutNode={editorLayout} />
      </div>
    </div>
  );
};

export default TaskModule; 