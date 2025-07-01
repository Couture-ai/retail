import React from 'react';
import { LayoutNode } from '@/types';
import ContentPanel from './ContentPanel';
import Splitter from './Splitter';

interface EditorLayoutProps {
  layoutNode: LayoutNode;
}

const EditorLayout: React.FC<EditorLayoutProps> = ({ layoutNode }) => {
  if (layoutNode.type === 'panel') {
    // Render a single content panel
    return <ContentPanel panelNode={layoutNode} />;
  } else if (layoutNode.type === 'splitter') {
    // Render a split view
    const { orientation, children, splitPercentage, id } = layoutNode;
    const flexDir = orientation === 'vertical' ? 'flex-row' : 'flex-col';
    const firstChildStyle = orientation === 'vertical' 
        ? { width: `${splitPercentage}%` } 
        : { height: `${splitPercentage}%` };
    const secondChildStyle = orientation === 'vertical' 
        ? { width: `${100 - splitPercentage}%` } 
        : { height: `${100 - splitPercentage}%` };

    return (
      <div className={`flex ${flexDir} h-full w-full overflow-hidden rounded-lg`}>
        <div 
          className="overflow-hidden relative" // Added relative for potential absolute positioned children
          style={firstChildStyle}
        >
          <EditorLayout layoutNode={children[0]} />
        </div>
        <Splitter 
           splitterId={id}
           orientation={orientation} 
           initialPercentage={splitPercentage}
        />
        <div 
          className="overflow-hidden relative"
          style={secondChildStyle}
        >
          <EditorLayout layoutNode={children[1]} />
        </div>
      </div>
    );
  } else {
    // Should not happen with proper typing, but good to have a fallback
    console.error("Unknown layout node type:", layoutNode);
    return <div className="text-red-500">Error: Unknown layout type</div>;
  }
};

export default EditorLayout; 