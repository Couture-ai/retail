import React, { useCallback, useEffect, useRef } from "react";

interface SidebarSplitterProps {
  isResizing: boolean;
  onResizeStart: (e: React.MouseEvent) => void;
  className?: string;
}

const SidebarSplitter: React.FC<SidebarSplitterProps> = ({
  isResizing,
  onResizeStart,
  className
}) => {
  return (
    <div
      className={`splitter cursor-col-resize w-1 h-full select-none z-10 flex justify-center items-center bg-[hsl(var(--splitter-background))] flex-shrink-0 ${className || ''}`}
      onMouseDown={onResizeStart}
    >
      <div className="splitter-grip h-10 w-[3px] bg-[hsl(var(--splitter-grip))] rounded-full pointer-events-none"></div>
      
      {isResizing && (
        <div className="fixed inset-0 z-50 cursor-col-resize" />
      )}
    </div>
  );
};

export default SidebarSplitter; 