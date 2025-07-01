import React, { useState, useEffect, useRef } from 'react';
import { IoSearchOutline } from 'react-icons/io5';

interface Command {
  id: string;
  name: string;
  shortcut?: string;
  icon?: string;
  action?: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands?: Command[];
}

export function CommandPalette({ isOpen, onClose, commands = [] }: CommandPaletteProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCommands, setFilteredCommands] = useState<Command[]>(commands);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);
  
  // Reset search when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setFilteredCommands(commands);
    }
  }, [isOpen, commands]);
  
  // Filter commands when search term changes
  useEffect(() => {
    if (searchTerm) {
      const filtered = commands.filter(command => 
        command.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCommands(filtered);
    } else {
      setFilteredCommands(commands);
    }
  }, [searchTerm, commands]);
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black/50 flex justify-center items-start pt-20 z-[1000]"
      onClick={onClose}
    >
      <div 
        className="bg-[hsl(var(--panel-background))] rounded-lg w-[600px] max-w-[90%] shadow-xl overflow-hidden flex flex-col border border-[hsl(var(--panel-border))]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center p-3 border-b border-[hsl(var(--panel-border))]">
          <IoSearchOutline className="text-[hsl(var(--panel-foreground))] text-lg mr-2" />
          <input
            ref={inputRef}
            placeholder="Search commands..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-none text-[hsl(var(--panel-foreground))] text-base flex-grow outline-none placeholder:text-[hsl(var(--panel-muted-foreground))]"
          />
        </div>
        
        <div className="max-h-[400px] overflow-y-auto">
          {filteredCommands.map((command) => (
            <div 
              key={command.id}
              className="p-4 flex items-center cursor-pointer hover:bg-[hsl(var(--panel-hover))] transition-colors"
              onClick={() => {
                if (command.action) {
                  command.action();
                } else {
                  console.log(`Selected: ${command.name}`);
                }
                onClose();
              }}
            >
              <span className="text-[hsl(var(--panel-foreground))] ml-2">{command.name}</span>
              {command.shortcut && (
                <div className="ml-auto flex gap-1">
                  {command.shortcut.split('').map((key, i) => (
                    <span key={i} className="bg-[hsl(var(--panel-accent))] text-[hsl(var(--panel-accent-foreground))] text-xs px-2 py-1 rounded">
                      {key}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {searchTerm && filteredCommands.length === 0 && (
            <div className="p-4 flex items-center">
              <span className="text-[hsl(var(--panel-muted-foreground))] ml-2">No results found</span>
            </div>
          )}
          
          {!searchTerm && filteredCommands.length === 0 && (
            <div className="p-4 flex items-center">
              <span className="text-[hsl(var(--panel-muted-foreground))] ml-2">No commands available</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommandPalette; 