import React, { useRef } from 'react';
import { X } from 'lucide-react';
import { TreeNode, ContentType } from '@/types';

interface ContentTabProps {
  id: string;
  title: string;
  contentType: ContentType;
  panelId: string;
  isActive: boolean;
  index: number;
  onActivate: (id: string, panelId: string) => void;
  onClose: (id: string, panelId: string, e: React.MouseEvent) => void;
  onDragStartInternal: (index: number, panelId: string) => void;
  onDragStartExternal: (id: string, panelId: string, e: React.DragEvent) => void;
  onDragEnter: (index: number) => void;
  onDragEndInternal: () => void;
}

const ContentTab: React.FC<ContentTabProps> = ({
  id,
  title,
  contentType,
  panelId,
  isActive,
  index,
  onActivate,
  onClose,
  onDragStartInternal,
  onDragStartExternal,
  onDragEnter,
  onDragEndInternal
}) => {
  const tabRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent) => {
    // Set data in multiple formats to maximize compatibility
    const splitData = JSON.stringify({ fileId: id, contentType, sourcePanelId: panelId });
    
    // For internal reordering within the same panel
    e.dataTransfer.setData('application/json+tab-reorder', 
      JSON.stringify({ index, panelId }));
    
    // For external splitting to another panel - use multiple formats for reliability
    e.dataTransfer.setData('application/json+tab-split', splitData);
    e.dataTransfer.setData('application/json', splitData);
    e.dataTransfer.setData('text/plain', id); // Simplest fallback
    
    // Set allowed effect
    e.dataTransfer.effectAllowed = 'move';
    
    // Set a custom ghost image
    if (tabRef.current) {
      const rect = tabRef.current.getBoundingClientRect();
      e.dataTransfer.setDragImage(tabRef.current, rect.width / 2, rect.height / 2);
      
      // Add dragging class for styling
      setTimeout(() => {
        if (tabRef.current) tabRef.current.classList.add('opacity-50');
      }, 0);
    }
    
    // Notify parent components
    onDragStartInternal(index, panelId);
    onDragStartExternal(id, panelId, e);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault(); // Always prevent default to ensure we get dragover events
    
    // Check if we have reordering data and are from the same panel
    if (e.dataTransfer.types.includes('application/json+tab-reorder')) {
      // During dragenter, we cannot access the data with getData
      // Just notify parent component that we entered this index
      onDragEnter(index);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Must prevent default to allow drop
    
    // Set the drop effect based on source
    if (e.dataTransfer.types.includes('application/json+tab-reorder')) {
      // Cannot access data during dragover either
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDragEnd = () => {
    if (tabRef.current) tabRef.current.classList.remove('opacity-50');
    onDragEndInternal();
  };

  // Determine the icon color based on content type
  const getIconColor = () => {
    switch (contentType) {
      case 'code':
        return 'text-[hsl(var(--tab-indicator-code))]';
      case 'chat':
        return 'text-[hsl(var(--tab-indicator-chat))]';
      case 'docs':
        return 'text-[hsl(var(--tab-indicator-docs))]';
      case 'task':
        return 'text-[hsl(var(--tab-indicator-task))]';
      default:
        return 'text-[hsl(var(--tab-indicator-default))]';
    }
  };

  return (
    <div
      ref={tabRef}
      className={`
        flex items-center px-2.5 py-1.5 cursor-pointer border-r border-[hsl(var(--tab-border))] 
        select-none gap-1.5 max-w-[320px] transition-colors text-[hsl(var(--tab-foreground))]
        ${isActive 
          ? 'bg-[hsl(var(--tab-background-active))] border-t-2 border-t-[hsl(var(--tab-border-active))] border-b-0' 
          : 'bg-[hsl(var(--tab-background-inactive))] hover:bg-[hsl(var(--tab-background-hover))] border-t-2 border-t-transparent'}
      `}
      onClick={() => onActivate(id, panelId)}
      draggable
      onDragStart={handleDragStart}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {/* Content type indicator */}
      <div className={`w-2 h-2 rounded-full ${getIconColor()}`}></div>
      
      <span className="truncate text-xs">{title}</span>
      <button
        className="h-4 w-4 rounded-sm hover:bg-[hsl(var(--tab-close-button-hover))] flex items-center justify-center flex-shrink-0 text-[hsl(var(--tab-foreground-muted))] hover:text-[hsl(var(--tab-foreground))]"
        onClick={(e) => { 
          e.stopPropagation(); // Prevent triggering tab activation
          onClose(id, panelId, e);
        }}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
};

export default ContentTab; 