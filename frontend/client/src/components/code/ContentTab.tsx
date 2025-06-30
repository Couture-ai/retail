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
        return 'text-blue-400';
      case 'chat':
        return 'text-green-400';
      case 'docs':
        return 'text-amber-400';
      case 'task':
        return 'text-purple-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div
      ref={tabRef}
      className={`
        flex items-center px-2.5 py-1.5 cursor-pointer border-r border-gray-700/50 
        select-none gap-1.5 max-w-[160px] transition-colors
        ${isActive 
          ? 'bg-[hsl(var(--dark-6))] border-t-2 border-t-[hsl(var(--primary))] border-b-0' 
          : 'hover:bg-[hsl(var(--dark-6))/50] border-t-2 border-t-transparent'}
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
        className="h-4 w-4 rounded-sm hover:bg-[hsl(var(--dark-8))] flex items-center justify-center flex-shrink-0"
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