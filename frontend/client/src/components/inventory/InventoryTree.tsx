import React, { useState } from "react";
import { 
  Plus, 
  Search,
  Calendar,
  Warehouse,
  FileText,
  User,
  MapPin
} from "lucide-react";

interface InventoryTreeProps {
  onInventoryItemSelect: (itemId: string, itemInfo: any) => void;
  onCreatePurchaseOrderClick: () => void;
  selectedItemId: string | null;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  storeManager: string;
  storeName: string;
  status: 'pending' | 'completed' | 'draft';
}

const mockOrders: Order[] = [
  {
    id: 'order-001',
    orderNumber: '#45',
    date: '2024-01-15',
    storeManager: 'Ramesh Kumar',
    storeName: 'Downtown Store',
    status: 'pending'
  },
  {
    id: 'order-002',
    orderNumber: '#44',
    date: '2024-01-14',
    storeManager: 'Geeta Chaudhary',
    storeName: 'Mall Branch',
    status: 'completed'
  },
  {
    id: 'order-003',
    orderNumber: '#43',
    date: '2024-01-13',
    storeManager: 'Suresh Bhatt',
    storeName: 'Airport Store',
    status: 'draft'
  },
  {
    id: 'order-004',
    orderNumber: '#42',
    date: '2024-01-12',
    storeManager: 'Rani Meena',
    storeName: 'Central Plaza',
    status: 'completed'
  },
  {
    id: 'order-005',
    orderNumber: '#41',
    date: '2024-01-11',
    storeManager: 'Ramesh Kumar',
    storeName: 'North Side Store',
    status: 'pending'
  },
  {
    id: 'order-006',
    orderNumber: '#40',
    date: '2024-01-10',
    storeManager: 'Geeta Chaudhary',
    storeName: 'East End Branch',
    status: 'completed'
  },
  {
    id: 'order-007',
    orderNumber: '#39',
    date: '2024-01-09',
    storeManager: 'Suresh Bhatt',
    storeName: 'West Side Store',
    status: 'draft'
  }
];

const InventoryTree: React.FC<InventoryTreeProps> = ({ 
  onInventoryItemSelect, 
  onCreatePurchaseOrderClick,
  selectedItemId 
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredOrders = searchTerm 
    ? mockOrders.filter(order => 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.storeManager.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.storeName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : mockOrders;

  const handleOrderClick = (order: Order) => {
    onInventoryItemSelect(order.id, { ...order, type: 'order' });
  };

  return (
    <div className="h-full flex flex-col bg-[hsl(var(--sidepanel-background))]">
      {/* Header */}
      <div className="p-3 border-b border-[hsl(var(--sidepanel-border))]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-[hsl(var(--sidepanel-foreground))]">Inventory & Orders</h2>
          <Warehouse size={16} className="text-[hsl(var(--sidepanel-muted-foreground))]" />
        </div>
        
        {/* Date Selector */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-[hsl(var(--sidepanel-muted-foreground))] mb-1.5">
            Order Date
          </label>
          <div className="relative">
            <Calendar size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[hsl(var(--sidepanel-muted-foreground))] pointer-events-none" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-[hsl(var(--panel-background))] border border-[hsl(var(--panel-border))] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[hsl(var(--panel-foreground))] transition-all duration-200 hover:border-[hsl(var(--panel-border-hover))]"
              style={{
                colorScheme: 'dark'
              }}
            />
          </div>
        </div>
        
        {/* Create Purchase Order Button */}
        <button
          onClick={onCreatePurchaseOrderClick}
          className="w-full flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          <Plus size={16} className="mr-2" />
          Create Purchase Order
        </button>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-[hsl(var(--sidepanel-border))]">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[hsl(var(--sidepanel-muted-foreground))]" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-[hsl(var(--sidepanel-input-background))] border border-[hsl(var(--sidepanel-border))] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[hsl(var(--sidepanel-foreground))] placeholder-[hsl(var(--sidepanel-muted-foreground))]"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3">
          <h3 className="text-xs font-medium text-[hsl(var(--sidepanel-muted-foreground))] mb-3 uppercase tracking-wider">
            Orders
          </h3>
          <div className="space-y-2">
            {filteredOrders.map(order => (
              <div
                key={order.id}
                onClick={() => handleOrderClick(order)}
                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-sm ${
                  selectedItemId === order.id 
                    ? 'bg-[hsl(var(--sidepanel-selected))] border-[hsl(var(--sidepanel-selected-border))]' 
                    : 'bg-[hsl(var(--sidepanel-card-background))] border-[hsl(var(--sidepanel-card-border))] hover:bg-[hsl(var(--sidepanel-hover))]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <FileText size={14} className="text-[hsl(var(--sidepanel-muted-foreground))] mr-2" />
                    <span className="text-sm font-medium text-[hsl(var(--sidepanel-foreground))]">
                      Order {order.orderNumber}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center text-xs text-[hsl(var(--sidepanel-muted-foreground))]">
                    <Calendar size={12} className="mr-1.5" />
                    {formatDate(order.date)}
                  </div>
                  <div className="flex items-center text-xs text-[hsl(var(--sidepanel-muted-foreground))]">
                    <User size={12} className="mr-1.5" />
                    {order.storeManager}
                  </div>
                  <div className="flex items-center text-xs text-[hsl(var(--sidepanel-muted-foreground))]">
                    <MapPin size={12} className="mr-1.5" />
                    {order.storeName}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryTree; 