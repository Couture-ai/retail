import { useState, useEffect } from 'react';

interface CommandPaletteHookOptions {
  editorSelector?: string; // CSS selector for Monaco editor
}

export function useCommandPalette(options: CommandPaletteHookOptions = {}) {
  const [isOpen, setIsOpen] = useState(false);
  
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(prev => !prev);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      // Use toLowerCase() to handle case insensitively
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggle();
      }
      
      // Close with Escape key
      if (e.key === 'Escape' && isOpen) {
        close();
      }
    };

    // Add keyboard event listener
    window.addEventListener('keydown', handleKeyDown);
    
    // If editorSelector is provided, handle Monaco editor focus
    if (options.editorSelector) {
      // This is a simplified approach - in a real implementation you might
      // need to integrate with the Monaco editor's API more directly
      const monacoElements = document.querySelectorAll(options.editorSelector);
      
      monacoElements.forEach(element => {
        element.addEventListener('keydown', handleKeyDown);
      });
      
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        monacoElements.forEach(element => {
          element.removeEventListener('keydown', handleKeyDown);
        });
      };
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [options.editorSelector, isOpen]);

  return { isOpen, open, close, toggle };
}

export default useCommandPalette; 