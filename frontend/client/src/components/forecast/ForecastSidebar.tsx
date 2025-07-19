import { Table, X, Users, Calendar } from "lucide-react";

interface ForecastSidebarProps {
  onItemSelect: (itemId: string, itemData: any) => void;
  onClose?: () => void;
  weekStartDates?: string[];
  selectedWeekStartDate?: string;
  onWeekStartDateChange?: (date: string) => void;
  loadingWeekDates?: boolean;
}

const ForecastSidebar = ({ 
  onItemSelect, 
  onClose,
  weekStartDates = [],
  selectedWeekStartDate = '',
  onWeekStartDateChange,
  loadingWeekDates = false
}: ForecastSidebarProps) => {
  const sidebarItems = [
    {
      id: "master-table",
      title: "Global Store-Article Forecast",
      description: "View comprehensive forecast data in table format",
      icon: <Table size={16} className="text-blue-400" />
    }
  ];

  const handleItemClick = (item: any) => {
    onItemSelect(item.id, {
      title: item.title,
      type: 'master-table'
    });
  };

  const handleConsensusAdjustmentClick = () => {
    // Update the title to include selected date
    const dateDisplay = selectedWeekStartDate ? 
      ` (${new Date(selectedWeekStartDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })})` : '';
    
    onItemSelect("consensus-adjustment", {
      title: "Adjustment" + dateDisplay,
      type: 'consensus-adjustment'
    });
  };

  const handleWeekStartDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (onWeekStartDateChange) {
      onWeekStartDateChange(event.target.value);
    }
  };

  // Generate adjustment items from 20 to 1
  const consensusAuthors = ['You', 'Anvay Karmore', 'Shagun Tyagi', 'Deepanshu Jain', 'Asish M.', 'Shobhit Agarwal'];
  
  const adjustmentItems = Array.from({ length: 20 }, (_, i) => {
    const adjustmentNumber = 20 - i;
    // Use adjustment number as seed for consistent random assignment
    const authorIndex = adjustmentNumber % consensusAuthors.length;
    const author = consensusAuthors[authorIndex];
    
    // Generate consistent random quantity change based on adjustment number
    // Use a proper seeded random function for better distribution
    const seedA = adjustmentNumber * 9301 + 49297;
    const seedB = (seedA % 233280) / 233280;
    const quantityChange = Math.floor((seedB * 2001) - 1000); // Range: -1000 to 1000
    
    return {
      id: `adjustment-${adjustmentNumber}`,
      title: `Adjustment ${adjustmentNumber}`,
      description: `Review adjustment version ${adjustmentNumber}`,
      author: author,
      quantityChange: quantityChange
    };
  });

  return (
    <div className="h-full bg-[hsl(var(--sidepanel-background))] flex flex-col">
      {/* Header with Close Button */}
      <div className="p-3 border-b border-[hsl(var(--sidepanel-border))] flex items-center justify-between flex-shrink-0">
        <div className="flex-1">
          <h3 className="text-[hsl(var(--sidepanel-foreground))] font-medium text-sm">Forecast Data</h3>
          <p className="text-[hsl(var(--sidepanel-muted-foreground))] text-xs mt-1">
            Access forecast analytics and data views
          </p>
        </div>
        
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="ml-2 p-1 rounded hover:bg-[hsl(var(--sidepanel-hover))] transition-colors duration-200 text-[hsl(var(--sidepanel-muted-foreground))] hover:text-[hsl(var(--sidepanel-foreground))]"
            title="Close sidebar"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Month Selector */}
      <div className="p-3 border-b border-[hsl(var(--sidepanel-border))] flex-shrink-0">
        <div className="flex items-center space-x-2">
          <Calendar size={14} className="text-[hsl(var(--sidepanel-muted-foreground))]" />
          <label className="text-[hsl(var(--sidepanel-foreground))] text-xs font-medium">Select Month:</label>
        </div>
        <select
          value={selectedWeekStartDate}
          onChange={handleWeekStartDateChange}
          disabled={loadingWeekDates}
          className="w-full mt-2 px-3 py-2 rounded text-xs bg-[hsl(var(--sidepanel-input-background))] text-[hsl(var(--sidepanel-foreground))] border border-[hsl(var(--sidepanel-input-border))] hover:border-[hsl(var(--sidepanel-border))] focus:border-[hsl(var(--primary))] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingWeekDates ? (
            <option value="">Loading dates...</option>
          ) : (
            <>
              {weekStartDates.length === 0 && (
                <option value="">No dates available</option>
              )}
              {weekStartDates.map((date) => (
                <option key={date} value={date}>
                  {new Date(date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </option>
              ))}
            </>
          )}
        </select>
      </div>
      
      {/* Navigation Items - Take 1/3 of remaining space */}
      <div className="p-2 flex-shrink-0" style={{ height: '33%', minHeight: '120px' }}>
        <div className="h-full overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className="w-full flex items-center p-3 mb-2 rounded-lg hover:bg-[hsl(var(--sidepanel-hover))] transition-colors duration-200 group"
            >
              <div className="mr-3 flex-shrink-0">
                {item.icon}
              </div>
              <div className="text-left flex-1">
                <div className="text-[hsl(var(--sidepanel-foreground))] text-sm font-medium group-hover:text-blue-300 transition-colors">
                  {item.title}
                </div>
                <div className="text-[hsl(var(--sidepanel-muted-foreground))] text-xs mt-1">
                  {item.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Consensus Section - Take 2/3 of remaining space */}
      <div className="border-t border-[hsl(var(--sidepanel-border))] flex-1 flex flex-col" style={{ minHeight: '200px' }}>
        {/* Consensus Header */}
        <div className="p-4 flex-shrink-0">
          <h4 className="text-[hsl(var(--sidepanel-foreground))] font-medium text-sm flex items-center">
            <Users size={14} className="text-amber-400 mr-2" />
            Adjustments
          </h4>
          <p className="text-[hsl(var(--sidepanel-muted-foreground))] text-xs mt-1">
            Collaborative forecast adjustments
          </p>
        </div>
        
        {/* Scrollable Adjustments List */}
        <div className="flex-1 px-4 overflow-y-auto">
          <div className="space-y-2">
            {adjustmentItems.map((adjustment) => (
              <button
                key={adjustment.id}
                onClick={() => onItemSelect(adjustment.id, {
                  title: adjustment.title,
                  type: 'adjustment-diff'
                })}
                className="w-full text-left p-2 rounded hover:bg-[hsl(var(--sidepanel-hover))] transition-colors duration-200 group"
              >
                <div className="flex items-center gap-2">
                  <div className="text-[hsl(var(--sidepanel-foreground))] text-xs font-medium group-hover:text-amber-300 transition-colors">
                    {adjustment.title}
                  </div>
                  <div className={`text-xs font-medium ${
                    adjustment.quantityChange >= 0 
                      ? 'text-green-400' 
                      : 'text-orange-400'
                  }`}>
                    {adjustment.quantityChange >= 0 ? '+' : ''}{adjustment.quantityChange}
                  </div>
                  <div className="text-[hsl(var(--sidepanel-muted-foreground))] text-xs">
                    by {adjustment.author}
                  </div>
                </div>
                <div className="text-[hsl(var(--sidepanel-muted-foreground))] text-xs mt-0.5">
                  {adjustment.description}
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Draft Button - Fixed at bottom */}
        <div className="p-4 flex-shrink-0">
          <button
            onClick={handleConsensusAdjustmentClick}
            className="w-full px-3 py-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-medium rounded-lg hover:bg-[hsl(var(--primary))]/90 transition-colors duration-200 flex items-center justify-center"
          >
            Draft an adjustment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForecastSidebar; 