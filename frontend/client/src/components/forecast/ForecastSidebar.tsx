import { Table, X } from "lucide-react";

interface ForecastSidebarProps {
  onItemSelect: (itemId: string, itemData: any) => void;
  onClose?: () => void;
}

const ForecastSidebar = ({ onItemSelect, onClose }: ForecastSidebarProps) => {
  const sidebarItems = [
    {
      id: "master-table",
      title: "Master Table",
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

  return (
    <div className="h-full bg-[hsl(var(--dark-8))] overflow-auto">
      {/* Header with Close Button */}
      <div className="p-3 border-b border-gray-700/50 flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-white font-medium text-sm">Forecast Data</h3>
          <p className="text-[hsl(var(--dark-3))] text-xs mt-1">
            Access forecast analytics and data views
          </p>
        </div>
        
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="ml-2 p-1 rounded hover:bg-[hsl(var(--dark-7))] transition-colors duration-200 text-[hsl(var(--dark-3))] hover:text-white"
            title="Close sidebar"
          >
            <X size={16} />
          </button>
        )}
      </div>
      
      {/* Navigation Items */}
      <div className="p-2">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleItemClick(item)}
            className="w-full flex items-center p-3 mb-2 rounded-lg hover:bg-[hsl(var(--dark-7))] transition-colors duration-200 group"
          >
            <div className="mr-3 flex-shrink-0">
              {item.icon}
            </div>
            <div className="text-left flex-1">
              <div className="text-white text-sm font-medium group-hover:text-blue-300 transition-colors">
                {item.title}
              </div>
              <div className="text-[hsl(var(--dark-3))] text-xs mt-1">
                {item.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ForecastSidebar; 