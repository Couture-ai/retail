import React, { useState, useRef, useEffect } from 'react';
import icon from '../../assets/img/icon.png';

const TopBar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Reliance Digital');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        handleSearchClick();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

  const handleSearchClick = () => {
    // Command K functionality - placeholder for now
    console.log('Search opened (Command+K)');
  };

  return (
    <div className="h-10 bg-[hsl(var(--sidebar-background))] flex items-center px-3 fixed top-0 left-0 right-0 z-50 border-b border-[hsl(var(--sidebar-border))]">
      <div className="flex items-center space-x-3">
        <img 
          src={icon}
          alt="Couture Demand Icon" 
          className="w-5 h-5"
        />
        
        {/* Dropdown moved to left side */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 text-[hsl(var(--sidebar-foreground))] text-sm font-normal hover:text-[hsl(var(--sidebar-accent-foreground))] transition-all duration-300 focus:outline-none opacity-70 hover:opacity-90 px-3 py-1.5 rounded-md hover:bg-[hsl(var(--sidebar-accent))]"
          >
            <span className="whitespace-nowrap">{selectedOption}</span>
            <svg
              className={`w-3 h-3 transition-all duration-300 ${isDropdownOpen ? 'rotate-180 text-[hsl(var(--sidebar-accent-foreground))]' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full mt-2 left-0 bg-[hsl(var(--topbar-dropdown-background))] border border-[hsl(var(--sidebar-border))] rounded-lg shadow-2xl backdrop-blur-sm min-w-[140px] z-50 animate-in fade-in-0 zoom-in-95 duration-200">
              <div className="py-1">
                <button
                  onClick={() => handleOptionSelect('Reliance Digital')}
                  className="w-full px-4 py-2.5 text-left text-sm text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))] transition-all duration-200 focus:outline-none focus:bg-[hsl(var(--sidebar-accent))] first:rounded-t-lg last:rounded-b-lg"
                >
                  <span className="font-medium">Reliance Digital</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Spacer to push right side icons to the right */}
      <div className="flex-1"></div>

      {/* Right side icons */}
      <div className="flex items-center space-x-2">
        {/* Search button with Command+K */}
        <button
          onClick={handleSearchClick}
          className="flex items-center space-x-1.5 text-[hsl(var(--sidebar-foreground))] hover:text-[hsl(var(--sidebar-accent-foreground))] transition-all duration-300 focus:outline-none opacity-70 hover:opacity-90 px-2 py-1.5 rounded-md hover:bg-[hsl(var(--sidebar-accent))] group"
          title="Search (⌘K)"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-xs text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--sidebar-accent-foreground))] transition-colors duration-300 font-mono">⌘K</span>
        </button>

        {/* Account icon */}
        <button
          className="text-[hsl(var(--sidebar-foreground))] hover:text-[hsl(var(--sidebar-accent-foreground))] transition-all duration-300 focus:outline-none opacity-70 hover:opacity-90 p-1.5 rounded-md hover:bg-[hsl(var(--sidebar-accent))]"
          title="Account"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TopBar; 