import React from 'react';
import { useWorkspace } from '@/context/WorkspaceProvider';
import CodeTree from './CodeTree';
import ChannelList from '../chat/ChannelList';
import FileTree from '../documentation/FileTree';
import TaskTree from '../task/TaskTree';
import { Module } from '@/types';

interface ModulePanelProps {
  width: number;
  onFileOpen?: (fileId: string) => void;
}

const ModulePanel: React.FC<ModulePanelProps> = ({ width, onFileOpen }) => {
  const { activeModule, codeFiles, documents } = useWorkspace();

  // Get the background color based on module
  const getBackgroundColor = (module: Module): string => {
    switch (module) {
      case 'chat':
        return 'bg-[hsl(var(--discord-9))]';
      case 'docs':
        return 'bg-[hsl(var(--dark-8))]';
      case 'task':
        return 'bg-[hsl(var(--dark-8))]';
      case 'code':
      default:
        return 'bg-[hsl(var(--dark-8))]';
    }
  };

  // Render the appropriate sidebar based on the active module
  const renderModuleSidebar = (module: Module) => {
    switch (module) {
      case 'code':
        return (
          <CodeTree 
            codeFiles={codeFiles} 
            onFileOpen={onFileOpen} 
          />
        );
      case 'chat':
        return <ChannelList />;
      case 'docs':
        // Use the real FileTree component for docs
        return <FileTree documents={documents} />;
      case 'task':
        return <TaskTree onTaskOpen={onFileOpen} />;
      case 'organization':
        // If you have an OrganizationTree, you would render it here
        return <div className="p-4 text-white">Organization tree not implemented</div>;
      default:
        return <div className="p-4 text-white">No sidebar for this module</div>;
    }
  };

  return (
    <div 
      className={`h-full overflow-hidden ${getBackgroundColor(activeModule)}`}
      style={{ width: `${width}px` }}
    >
      {renderModuleSidebar(activeModule)}
    </div>
  );
};

export default ModulePanel; 