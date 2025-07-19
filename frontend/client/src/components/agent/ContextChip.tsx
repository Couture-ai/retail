import React from 'react';
import { X } from 'lucide-react';

interface ContextChipProps {
  id: string;
  title: string;
  type: 'code' | 'docs' | 'chat' | 'task' | 'forecast' | 'analytics' | 'store' | 'product' | 'inventory' | 'article' | 'timeline';
  onRemove: (id: string) => void;
}

export const ContextChip: React.FC<ContextChipProps> = ({ id, title, type, onRemove }) => {
  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 max-w-45">
      <span className="truncate">{title}</span>
      <button
        onClick={() => onRemove(id)}
        className="ml-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-0.5 transition-colors"
        aria-label={`Remove ${title} context`}
      >
        <X size={10} />
      </button>
    </div>
  );
}; 