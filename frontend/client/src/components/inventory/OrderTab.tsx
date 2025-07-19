import React, { useState, useEffect } from 'react';
import { FileText, User, MapPin, Calendar, Package, CheckCircle, Clock, AlertCircle, Hash, Loader2 } from 'lucide-react';
import { ForecastRepository } from "@/repository/forecast_repository";

interface OrderTabProps {
  orderId: string;
  orderInfo: {
    orderNumber: string;
    date: string;
    storeManager: string;
    storeName: string;
    status: 'pending' | 'completed' | 'draft';
  };
  panelId: string;
}

interface OrderItem {
  itemId: string;
  itemName: string;
  brand?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

const OrderTab: React.FC<OrderTabProps> = ({ orderId, orderInfo, panelId }) => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize forecast repository
  const forecastRepo = new ForecastRepository(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000');

  useEffect(() => {
    loadOrderItems();
  }, [orderId]);

  const loadOrderItems = async () => {
    try {
      setLoading(true);
      setError(null);

      // SQL query to get 30 items from forecast table with article details
      const sqlQuery = `
        SELECT 
          article_id,
          article_description,
          brand,
          COALESCE(forecast_qty, 0) as forecast_qty,
          week_start_date,
          vertical,
          super_category,
          segment
        FROM forecast 
        WHERE article_id IS NOT NULL 
          AND article_description IS NOT NULL
          AND brand IS NOT NULL
          AND forecast_qty > 0
        ORDER BY RANDOM()
        LIMIT 30
      `;

      const stateSetters = {
        setLoading: () => {},
        setError: (err: string | null) => setError(err),
        setData: (data: any) => {
          if (data && data.data && data.data.length > 0) {
            const items: OrderItem[] = data.data.map((row: any, index: number) => {
              // Generate realistic prices based on category
              const basePrice = generatePrice(row.vertical, row.super_category);
              const quantity = Math.max(1, Math.floor(row.forecast_qty / 10)); // Use portion of forecast as order quantity
              
              return {
                itemId: row.article_id,
                itemName: row.article_description || `${row.brand} Product`,
                brand: row.brand,
                quantity: quantity,
                unitPrice: basePrice,
                totalPrice: basePrice * quantity
              };
            });
            setOrderItems(items);
          }
        }
      };

      await forecastRepo.executeSqlQuery({ sql_query: sqlQuery }, stateSetters);
    } catch (err) {
      console.error('Error loading order items:', err);
      setError('Failed to load order items');
    } finally {
      setLoading(false);
    }
  };

  const generatePrice = (vertical: string, category: string): number => {
    // Generate realistic prices based on product category
    const basePrices: Record<string, number> = {
      'Apparel': 1500,
      'Footwear': 2500,
      'Accessories': 800,
      'Electronics': 5000,
      'Home': 1200,
      'Beauty': 900,
      'Sports': 2000
    };

    const basePrice = basePrices[category] || basePrices[vertical] || 1000;
    // Add some randomization (±30%)
    const variation = (Math.random() - 0.5) * 0.6;
    return Math.round(basePrice * (1 + variation));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} className="text-yellow-500" />;
      case 'completed': return <CheckCircle size={16} className="text-green-500" />;
      case 'draft': return <AlertCircle size={16} className="text-gray-500" />;
      default: return <FileText size={16} className="text-[hsl(var(--panel-muted-foreground))]" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateSubtotal = () => {
    return orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const calculateTax = (subtotal: number) => {
    return subtotal * 0.18; // 18% GST rate for India
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    return subtotal + tax;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="h-full bg-[hsl(var(--panel-background))] flex items-center justify-center">
        <div className="flex items-center">
          <Loader2 className="animate-spin text-[hsl(var(--primary))] mr-3" size={24} />
          <span className="text-[hsl(var(--panel-foreground))]">Loading order details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full bg-[hsl(var(--panel-background))] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-[hsl(var(--panel-error))]" />
          <h2 className="text-xl font-semibold text-[hsl(var(--panel-foreground))] mb-2">Error loading order</h2>
          <p className="text-[hsl(var(--panel-error))] mb-4">{error}</p>
          <button 
            onClick={loadOrderItems}
            className="px-4 py-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded hover:bg-[hsl(var(--primary))]/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const total = calculateTotal();

  return (
    <div className="h-full bg-[hsl(var(--panel-background))] overflow-auto">
      <div className="max-w-2xl mx-auto p-6">
        {/* Receipt Header */}
        <div className="bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] rounded-lg shadow-sm">
          {/* Store Header */}
          <div className="p-6 border-b border-[hsl(var(--dashboard-card-border))]">
            <div className="text-center mb-4">
              <h1 className="text-2xl font-bold text-[hsl(var(--dashboard-foreground))]">Purchase Order</h1>
              <p className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">Purchase Order Receipt</p>
            </div>
            
            {/* Order Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Hash size={16} className="text-[hsl(var(--dashboard-muted-foreground))]" />
                <span className="text-[hsl(var(--dashboard-foreground))] font-semibold">
                  Order {orderInfo.orderNumber}
                </span>
              </div>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(orderInfo.status)}`}>
                {getStatusIcon(orderInfo.status)}
                <span className="text-sm font-medium capitalize">{orderInfo.status}</span>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Calendar size={16} className="text-[hsl(var(--dashboard-muted-foreground))]" />
                  <div>
                    <p className="text-xs text-[hsl(var(--dashboard-muted-foreground))] uppercase tracking-wider">Order Date</p>
                    <p className="text-[hsl(var(--dashboard-foreground))] font-medium">{formatDate(orderInfo.date)}</p>
                    <p className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">{formatTime(orderInfo.date)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <User size={16} className="text-[hsl(var(--dashboard-muted-foreground))]" />
                  <div>
                    <p className="text-xs text-[hsl(var(--dashboard-muted-foreground))] uppercase tracking-wider">Store Manager</p>
                    <p className="text-[hsl(var(--dashboard-foreground))] font-medium">{orderInfo.storeManager}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin size={16} className="text-[hsl(var(--dashboard-muted-foreground))]" />
                  <div>
                    <p className="text-xs text-[hsl(var(--dashboard-muted-foreground))] uppercase tracking-wider">Store Location</p>
                    <p className="text-[hsl(var(--dashboard-foreground))] font-medium">{orderInfo.storeName}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Package size={16} className="text-[hsl(var(--dashboard-muted-foreground))]" />
                  <div>
                    <p className="text-xs text-[hsl(var(--dashboard-muted-foreground))] uppercase tracking-wider">Total Items</p>
                    <p className="text-[hsl(var(--dashboard-foreground))] font-medium">{orderItems.length} items</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-t border-[hsl(var(--dashboard-card-border))]">
            <div className="p-6">
              <h3 className="text-[hsl(var(--dashboard-foreground))] font-semibold mb-4">Order Items</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {orderItems.map((item, index) => (
                  <div key={item.itemId} className="flex items-center justify-between py-3 border-b border-[hsl(var(--dashboard-card-border))]/50 last:border-b-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="text-[hsl(var(--dashboard-muted-foreground))] text-sm w-6">#{index + 1}</span>
                        <div>
                          <p className="text-[hsl(var(--dashboard-foreground))] font-medium">{item.itemName}</p>
                          <p className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">
                            {item.brand} • ID: {item.itemId}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs uppercase tracking-wider">Qty</p>
                          <p className="text-[hsl(var(--dashboard-foreground))] font-medium">{item.quantity}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs uppercase tracking-wider">Unit Price</p>
                          <p className="text-[hsl(var(--dashboard-foreground))] font-medium">{formatCurrency(item.unitPrice)}</p>
                        </div>
                        <div className="text-center min-w-[80px]">
                          <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs uppercase tracking-wider">Total</p>
                          <p className="text-[hsl(var(--dashboard-foreground))] font-semibold">{formatCurrency(item.totalPrice)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t border-[hsl(var(--dashboard-card-border))] bg-[hsl(var(--dashboard-accent-background))]">
            <div className="p-6">
              <h3 className="text-[hsl(var(--dashboard-foreground))] font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[hsl(var(--dashboard-muted-foreground))]">Subtotal</span>
                  <span className="text-[hsl(var(--dashboard-foreground))] font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[hsl(var(--dashboard-muted-foreground))]">GST (18%)</span>
                  <span className="text-[hsl(var(--dashboard-foreground))] font-medium">{formatCurrency(tax)}</span>
                </div>
                <div className="border-t border-[hsl(var(--dashboard-card-border))] pt-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[hsl(var(--dashboard-foreground))] font-semibold text-lg">Total</span>
                    <span className="text-[hsl(var(--dashboard-foreground))] font-bold text-lg">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-[hsl(var(--dashboard-card-border))] p-6 text-center">
            <p className="text-[hsl(var(--dashboard-muted-foreground))] text-sm">
              Thank you for your business! This is a computer generated receipt.
            </p>
            <p className="text-[hsl(var(--dashboard-muted-foreground))] text-xs mt-2">
              Order ID: {orderId} • Generated on {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTab; 