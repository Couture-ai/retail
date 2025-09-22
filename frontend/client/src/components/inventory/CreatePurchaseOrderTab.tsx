import React, { useState, useEffect, useCallback, useRef } from "react";
import { X, Save, Download, Package, AlertCircle, Loader2, Edit2, Check, Minus, Filter, Calendar } from "lucide-react";
import { ForecastRepository } from "@/repository/forecast_repository";
import { useProject } from "@/context/ProjectProvider";

interface CreatePurchaseOrderTabProps {
  onClose?: () => void;
  onSave?: (orderData: PurchaseOrderData[]) => void;
  selectedDate?: string;
}

interface PurchaseOrderData {
  store_id: string;
  pincode: string;
  article_description: string;
  article_id: string;
  forecast_qty: number;
  interim_consensus: number;
  inventory: number;
  amount_to_order: number;
  cycle_end: string;
  cycle_end_days: number;
  isEditing?: boolean;
  tempValue?: string;
}

const CreatePurchaseOrderTab: React.FC<CreatePurchaseOrderTabProps> = ({ 
  onClose, 
  onSave,
  selectedDate
}) => {
  const [allOrderData, setAllOrderData] = useState<PurchaseOrderData[]>([]);
  const [filteredOrderData, setFilteredOrderData] = useState<PurchaseOrderData[]>([]);
  const [displayedData, setDisplayedData] = useState<PurchaseOrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [cycleEndFilter, setCycleEndFilter] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  
  const ITEMS_PER_PAGE = 25;
  const tableRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingTriggerRef = useRef<HTMLDivElement>(null);

  const {forecastRepository: forecastRepo} = useProject();

  useEffect(() => {
    loadInitialData();
  }, []);

  // Apply filter whenever allOrderData or cycleEndFilter changes
  useEffect(() => {
    applyFilters();
  }, [allOrderData, cycleEndFilter]);

  // Reset pagination when filter changes
  useEffect(() => {
    setCurrentPage(1);
    setDisplayedData(filteredOrderData.slice(0, ITEMS_PER_PAGE));
    setHasMoreData(filteredOrderData.length > ITEMS_PER_PAGE);
  }, [filteredOrderData]);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    if (!loadingTriggerRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMoreData && !loadingMore) {
          loadMoreData();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    observerRef.current.observe(loadingTriggerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMoreData, loadingMore]);

  const generateRandomInventory = (interimConsensus: number): number => {
    return Math.floor(Math.random() * (interimConsensus + 1));
  };

  const getCycleEndOptions = (): { label: string; days: number }[] => {
    const options = [];
    
    for (let i = 0; i < 7; i++) {
      if (i === 0) {
        options.push({ label: 'Today', days: 0 });
      } else if (i === 1) {
        options.push({ label: 'Tomorrow', days: 1 });
      } else {
        options.push({ label: `${i} days`, days: i });
      }
    }
    
    return options;
  };

  const applyFilters = () => {
    let filtered = [...allOrderData];

    // Apply cycle end filter
    if (cycleEndFilter !== null) {
      filtered = filtered.filter(item => item.cycle_end_days <= cycleEndFilter);
    }

    setFilteredOrderData(filtered);
  };

  const loadMoreData = useCallback(() => {
    if (loadingMore || !hasMoreData) return;

    setLoadingMore(true);
    
    // Simulate async loading for smooth UX
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      
      const newItems = filteredOrderData.slice(startIndex, endIndex);
      
      if (newItems.length > 0) {
        setDisplayedData(prev => [...prev, ...newItems]);
        setCurrentPage(nextPage);
        
        // Check if there are more items
        setHasMoreData(endIndex < filteredOrderData.length);
      } else {
        setHasMoreData(false);
      }
      
      setLoadingMore(false);
    }, 300); // Small delay for smooth UX
  }, [currentPage, filteredOrderData, loadingMore, hasMoreData]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load more data for better infinite scroll demonstration
      const sqlQuery = `
        SELECT DISTINCT
          store_no as store_id,
          pin_code as pincode,
          article_description,
          article_id,
          AVG(forecast_qty) as forecast_qty,
          AVG(consensus_qty) as interim_consensus
        FROM forecast
        WHERE store_no IS NOT NULL 
          AND pin_code IS NOT NULL 
          AND article_description IS NOT NULL
          AND article_id IS NOT NULL
        GROUP BY store_no, pin_code, article_description, article_id
        ORDER BY AVG(forecast_qty) DESC
        LIMIT 500
      `;

      const stateSetters = {
        setLoading: () => {},
        setError: (err: string | null) => setError(err),
        setData: (data: any) => {
          if (data && data.data) {
            const cycleOptions = getCycleEndOptions();
            
            const purchaseOrders: PurchaseOrderData[] = data.data.map((row: any, index: number) => {
              const forecastQty = parseFloat(row.forecast_qty) || 0;
              const interimConsensus = parseFloat(row.interim_consensus) || 0;
              const inventory = generateRandomInventory(Math.floor(interimConsensus));
              const amountToOrder = Math.max(0, Math.floor(interimConsensus) - inventory);
              const cycleOption = cycleOptions[index % cycleOptions.length];
              
              return {
                store_id: row.store_id || '',
                pincode: row.pincode || '',
                article_description: row.article_description || '',
                article_id: row.article_id || '',
                forecast_qty: Math.round(forecastQty),
                interim_consensus: Math.round(interimConsensus),
                inventory: inventory,
                amount_to_order: amountToOrder,
                cycle_end: cycleOption.label,
                cycle_end_days: cycleOption.days,
                isEditing: false,
                tempValue: ''
              };
            });
            
            setAllOrderData(purchaseOrders);
          }
        }
      };

      await forecastRepo.executeSqlQuery({ sql_query: sqlQuery }, stateSetters);

    } catch (err) {
      console.error('Error loading order data:', err);
      setError('Failed to load order data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (index: number) => {
    const item = displayedData[index];
    
    // Update displayed data
    setDisplayedData(prev => prev.map((item, i) => 
      i === index 
        ? { ...item, isEditing: true, tempValue: item.amount_to_order.toString() }
        : item
    ));
    
    // Update filtered data
    setFilteredOrderData(prev => prev.map((filteredItem) => 
      filteredItem.store_id === item.store_id && filteredItem.article_id === item.article_id
        ? { ...filteredItem, isEditing: true, tempValue: filteredItem.amount_to_order.toString() }
        : filteredItem
    ));
    
    // Update all data
    setAllOrderData(prev => prev.map((allItem) => 
      allItem.store_id === item.store_id && allItem.article_id === item.article_id
        ? { ...allItem, isEditing: true, tempValue: allItem.amount_to_order.toString() }
        : allItem
    ));
  };

  const handleEditSave = (index: number) => {
    const item = displayedData[index];
    const newValue = Math.max(0, parseInt(item.tempValue || '0') || 0);
    
    // Update displayed data
    setDisplayedData(prev => prev.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          amount_to_order: newValue,
          isEditing: false,
          tempValue: ''
        };
      }
      return item;
    }));

    // Update filtered data
    setFilteredOrderData(prev => prev.map((filteredItem) => 
      filteredItem.store_id === item.store_id && filteredItem.article_id === item.article_id
        ? { ...filteredItem, amount_to_order: newValue, isEditing: false, tempValue: '' }
        : filteredItem
    ));

    // Update all data
    setAllOrderData(prev => prev.map((allItem) => 
      allItem.store_id === item.store_id && allItem.article_id === item.article_id
        ? { ...allItem, amount_to_order: newValue, isEditing: false, tempValue: '' }
        : allItem
    ));
  };

  const handleEditCancel = (index: number) => {
    const item = displayedData[index];
    
    // Update displayed data
    setDisplayedData(prev => prev.map((item, i) => 
      i === index 
        ? { ...item, isEditing: false, tempValue: '' }
        : item
    ));
    
    // Update filtered data
    setFilteredOrderData(prev => prev.map((filteredItem) => 
      filteredItem.store_id === item.store_id && filteredItem.article_id === item.article_id
        ? { ...filteredItem, isEditing: false, tempValue: '' }
        : filteredItem
    ));
    
    // Update all data
    setAllOrderData(prev => prev.map((allItem) => 
      allItem.store_id === item.store_id && allItem.article_id === item.article_id
        ? { ...allItem, isEditing: false, tempValue: '' }
        : allItem
    ));
  };

  const handleTempValueChange = (index: number, value: string) => {
    const item = displayedData[index];
    
    // Update displayed data
    setDisplayedData(prev => prev.map((item, i) => 
      i === index 
        ? { ...item, tempValue: value }
        : item
    ));
    
    // Update filtered data
    setFilteredOrderData(prev => prev.map((filteredItem) => 
      filteredItem.store_id === item.store_id && filteredItem.article_id === item.article_id
        ? { ...filteredItem, tempValue: value }
        : filteredItem
    ));
    
    // Update all data
    setAllOrderData(prev => prev.map((allItem) => 
      allItem.store_id === item.store_id && allItem.article_id === item.article_id
        ? { ...allItem, tempValue: value }
        : allItem
    ));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      console.log('Saving purchase order:', allOrderData);
      
      if (onSave) {
        onSave(allOrderData);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (err) {
      console.error('Error saving purchase order:', err);
      setError('Failed to save purchase order');
    } finally {
      setSaving(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const getTotalAmountToOrder = () => {
    return filteredOrderData.reduce((sum, item) => sum + item.amount_to_order, 0);
  };

  const getCycleEndFilterOptions = () => {
    const options = [
      { label: 'All', value: null },
      { label: 'Today only', value: 0 },
      { label: 'Today + 1 day', value: 1 },
      { label: 'Today + 2 days', value: 2 },
      { label: 'Today + 3 days', value: 3 },
      { label: 'Today + 4 days', value: 4 },
      { label: 'Today + 5 days', value: 5 },
      { label: 'Today + 6 days', value: 6 }
    ];
    return options;
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-[hsl(var(--panel-background))]">
        <div className="flex items-center space-x-3">
          <Loader2 size={24} className="animate-spin text-[hsl(var(--primary))]" />
          <span className="text-[hsl(var(--panel-foreground))]">Loading purchase order data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-[hsl(var(--panel-background))] flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-[hsl(var(--panel-border))]">
        <div className="flex items-center space-x-3">
          <Package size={20} className="text-[hsl(var(--primary))]" />
          <div>
            <h3 className="text-[hsl(var(--panel-foreground))] font-semibold text-lg">Create Purchase Order</h3>
            {selectedDate && (
              <p className="text-[hsl(var(--panel-muted-foreground))] text-sm">Order Date: {selectedDate}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center px-3 py-2 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 size={16} className="mr-2 animate-spin" />
            ) : (
              <Save size={16} className="mr-2" />
            )}
            {saving ? 'Saving...' : 'Save Order'}
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[hsl(var(--panel-background))]/60 rounded-lg transition-colors"
          >
            <X size={20} className="text-[hsl(var(--panel-muted-foreground))]" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {error && (
          <div className="mx-4 mt-4 p-3 bg-[hsl(var(--panel-error-background))] border border-[hsl(var(--panel-error-border))] rounded-lg flex items-center space-x-2">
            <AlertCircle size={16} className="text-[hsl(var(--panel-error))] flex-shrink-0" />
            <span className="text-[hsl(var(--panel-error))] text-sm">{error}</span>
          </div>
        )}

        {/* Filters Bar */}
        <div className="mx-4 mt-4 p-3 bg-[hsl(var(--panel-background))] border border-[hsl(var(--panel-border))] rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-[hsl(var(--panel-muted-foreground))]" />
              <span className="text-[hsl(var(--panel-foreground))] text-sm font-medium">Filters:</span>
            </div>
            
            {/* Cycle End Filter */}
            <div className="flex items-center space-x-2">
              <Calendar size={14} className="text-[hsl(var(--panel-muted-foreground))]" />
              <label className="text-[hsl(var(--panel-muted-foreground))] text-sm">Cycle End:</label>
              <select
                value={cycleEndFilter === null ? '' : cycleEndFilter.toString()}
                onChange={(e) => setCycleEndFilter(e.target.value === '' ? null : parseInt(e.target.value))}
                className="px-3 py-1.5 text-sm bg-[hsl(var(--panel-background))] border border-[hsl(var(--panel-border))] rounded-md focus:outline-none focus:border-[hsl(var(--primary))] text-[hsl(var(--panel-foreground))]"
              >
                {getCycleEndFilterOptions().map((option) => (
                  <option key={option.label} value={option.value === null ? '' : option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            {cycleEndFilter !== null && (
              <button
                onClick={() => setCycleEndFilter(null)}
                className="text-xs text-[hsl(var(--panel-muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Summary Bar */}
        <div className="mx-4 mt-4 p-3 bg-[hsl(var(--dashboard-card-background))] border border-[hsl(var(--dashboard-card-border))] rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div>
                <span className="text-[hsl(var(--panel-muted-foreground))] text-sm">Showing:</span>
                <span className="text-[hsl(var(--panel-foreground))] font-semibold ml-2">
                  {displayedData.length} of {filteredOrderData.length}
                </span>
                {filteredOrderData.length !== allOrderData.length && (
                  <span className="text-[hsl(var(--panel-muted-foreground))] text-xs ml-1">
                    (filtered from {allOrderData.length})
                  </span>
                )}
              </div>
              <div>
                <span className="text-[hsl(var(--panel-muted-foreground))] text-sm">Total Amount to Order:</span>
                <span className="text-[hsl(var(--primary))] font-semibold ml-2">{formatNumber(getTotalAmountToOrder())}</span>
              </div>
            </div>
            <button className="flex items-center px-3 py-1.5 bg-[hsl(var(--panel-background))] hover:bg-[hsl(var(--panel-background))]/80 border border-[hsl(var(--panel-border))] text-[hsl(var(--panel-foreground))] text-sm rounded-md transition-colors">
              <Download size={14} className="mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Purchase Order Table */}
        <div className="flex-1 mx-4 mt-4 mb-4 bg-[hsl(var(--dashboard-card-background))] rounded-lg border border-[hsl(var(--dashboard-card-border))] overflow-hidden">
          <div ref={tableRef} className="overflow-auto h-full">
            <table className="w-full">
              <thead className="sticky top-0 bg-[hsl(var(--panel-background))] border-b border-[hsl(var(--panel-border))] z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[hsl(var(--panel-muted-foreground))] uppercase tracking-wider">
                    Store ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[hsl(var(--panel-muted-foreground))] uppercase tracking-wider">
                    Pincode
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[hsl(var(--panel-muted-foreground))] uppercase tracking-wider">
                    Article Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[hsl(var(--panel-muted-foreground))] uppercase tracking-wider">
                    Article ID
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-[hsl(var(--panel-muted-foreground))] uppercase tracking-wider">
                    Forecast Qty
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-[hsl(var(--panel-muted-foreground))] uppercase tracking-wider">
                    Running Adjustment
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-[hsl(var(--panel-muted-foreground))] uppercase tracking-wider">
                    Inventory
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-[hsl(var(--panel-muted-foreground))] uppercase tracking-wider">
                    Amount to Order
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[hsl(var(--panel-muted-foreground))] uppercase tracking-wider">
                    Cycle End
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[hsl(var(--panel-border))]">
                {displayedData.map((item, index) => (
                  <tr 
                    key={`${item.store_id}-${item.article_id}-${index}`}
                    className="hover:bg-[hsl(var(--dashboard-card-hover))] transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-[hsl(var(--panel-foreground))]">
                      {item.store_id}
                    </td>
                    <td className="px-4 py-3 text-sm text-[hsl(var(--panel-foreground))]">
                      {item.pincode}
                    </td>
                    <td className="px-4 py-3 text-sm text-[hsl(var(--panel-foreground))] max-w-xs truncate">
                      <span title={item.article_description}>{item.article_description}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[hsl(var(--panel-foreground))]">
                      {item.article_id}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-[hsl(var(--panel-foreground))]">
                      {formatNumber(item.forecast_qty)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-[hsl(var(--panel-foreground))]">
                      {formatNumber(item.interim_consensus)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-[hsl(var(--panel-foreground))]">
                      {formatNumber(item.inventory)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      {item.isEditing ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            value={item.tempValue}
                            onChange={(e) => handleTempValueChange(index, e.target.value)}
                            className="w-20 px-2 py-1 text-sm bg-[hsl(var(--panel-background))] border border-[hsl(var(--panel-border))] rounded focus:outline-none focus:border-[hsl(var(--primary))] text-[hsl(var(--panel-foreground))]"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleEditSave(index);
                              if (e.key === 'Escape') handleEditCancel(index);
                            }}
                            autoFocus
                          />
                          <button
                            onClick={() => handleEditSave(index)}
                            className="p-1 text-green-500 hover:bg-green-500/10 rounded transition-colors"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => handleEditCancel(index)}
                            className="p-1 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end space-x-2">
                          <span className="text-[hsl(var(--panel-foreground))]">
                            {formatNumber(item.amount_to_order)}
                          </span>
                          <button
                            onClick={() => handleEditClick(index)}
                            className="p-1 text-[hsl(var(--panel-muted-foreground))] hover:text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/10 rounded transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-[hsl(var(--panel-foreground))]">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.cycle_end === 'Today' 
                          ? 'bg-red-500/10 text-red-500' 
                          : item.cycle_end === 'Tomorrow'
                          ? 'bg-orange-500/10 text-orange-500'
                          : 'bg-blue-500/10 text-blue-500'
                      }`}>
                        {item.cycle_end}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Loading More Indicator */}
            {loadingMore && (
              <div className="flex items-center justify-center py-6">
                <div className="flex items-center space-x-2">
                  <Loader2 size={20} className="animate-spin text-[hsl(var(--primary))]" />
                  <span className="text-[hsl(var(--panel-muted-foreground))] text-sm">Loading more items...</span>
                </div>
              </div>
            )}
            
            {/* Infinite Scroll Trigger */}
            {hasMoreData && !loadingMore && (
              <div ref={loadingTriggerRef} className="h-4" />
            )}
            
            {/* End of Data Indicator */}
            {!hasMoreData && displayedData.length > 0 && (
              <div className="flex items-center justify-center py-6 border-t border-[hsl(var(--panel-border))]">
                <span className="text-[hsl(var(--panel-muted-foreground))] text-sm">
                  Showing all {displayedData.length} items
                </span>
              </div>
            )}
            
            {/* Empty State */}
            {filteredOrderData.length === 0 && !loading && (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Calendar size={48} className="mx-auto text-[hsl(var(--panel-muted-foreground))] mb-4" />
                  <p className="text-[hsl(var(--panel-muted-foreground))] text-sm">
                    No items match the selected cycle end filter
                  </p>
                  <button
                    onClick={() => setCycleEndFilter(null)}
                    className="mt-2 text-sm text-[hsl(var(--primary))] hover:underline"
                  >
                    Clear filter to see all items
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePurchaseOrderTab; 