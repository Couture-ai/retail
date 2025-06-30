import React from "react";

interface SidebarSplitterProps {
  onResizeStart: () => void;
  onResize: (newWidth: number) => void;
  onResizeEnd: () => void;
}

const SidebarSplitter: React.FC<SidebarSplitterProps> = ({
  onResizeStart,
  onResize,
  onResizeEnd
}) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    onResizeStart();

    const handleMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      onResize(moveEvent.clientX);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      onResizeEnd();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      className="splitter cursor-col-resize w-1 h-full select-none z-10 flex justify-center items-center bg-black flex-shrink-0"
      onMouseDown={handleMouseDown}
    >
      <div className="splitter-grip h-10 w-[3px] bg-gray-600/50 rounded-full pointer-events-none"></div>
    </div>
  );
};

export default SidebarSplitter; 