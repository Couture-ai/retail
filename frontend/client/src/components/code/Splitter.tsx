import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useWorkspace } from '@/context/WorkspaceProvider';
import { SplitOrientation } from '@/types';
import './style.css';

interface SplitterProps {
  splitterId: string;
  orientation: SplitOrientation;
  initialPercentage: number;
}

const Splitter: React.FC<SplitterProps> = ({ splitterId, orientation, initialPercentage }) => {
  const { updateSplitRatio } = useWorkspace();
  const [isDragging, setIsDragging] = useState(false);
  const splitterRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement | null>(null);

  // Find parent container on mount
  useEffect(() => {
    if (splitterRef.current) {
      parentRef.current = splitterRef.current.parentElement as HTMLDivElement;
    }
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !parentRef.current) return;
    
    const rect = parentRef.current.getBoundingClientRect();
    let newPercentage: number;
    
    if (orientation === 'vertical') {
      const mouseX = e.clientX;
      const parentX = rect.left;
      const parentWidth = rect.width;
      if (parentWidth === 0) return; // Avoid division by zero
      newPercentage = ((mouseX - parentX) / parentWidth) * 100;
    } else { // horizontal
      const mouseY = e.clientY;
      const parentY = rect.top;
      const parentHeight = rect.height;
      if (parentHeight === 0) return;
      newPercentage = ((mouseY - parentY) / parentHeight) * 100;
    }
    
    // Update the split ratio via context, clamping happens there
    updateSplitRatio(splitterId, newPercentage);
    
  }, [isDragging, orientation, splitterId, updateSplitRatio]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Global event listeners for mouse move/up during drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const cursorClass = orientation === 'vertical' ? 'cursor-col-resize' : 'cursor-row-resize';
  const sizeClass = orientation === 'vertical' ? 'w-1 h-full' : 'h-1 w-full';
  const gripSizeClass = orientation === 'vertical' ? 'h-10 w-[3px]' : 'w-10 h-[3px]';

  return (
    <div
      ref={splitterRef}
      className={`splitter ${cursorClass} ${sizeClass} select-none z-10 flex justify-center items-center 
                 bg-black`}
      onMouseDown={handleMouseDown}
      style={{
        // Position needs to be set by parent layout
        flexShrink: 0,
      }}
    >
      <div className={`splitter-grip ${gripSizeClass} bg-gray-600/50 rounded-full pointer-events-none`}></div>
      
      {/* Overlay during drag */}
       {isDragging && (
          <div className={`fixed inset-0 z-50 ${cursorClass}`} />
        )}
    </div>
  );
};

export default Splitter; 