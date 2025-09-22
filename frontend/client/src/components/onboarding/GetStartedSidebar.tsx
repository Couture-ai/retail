import React, { useState } from "react";
import {
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronRight,
  Database,
  Zap,
  Settings,
  Upload,
  Wifi,
  FileText,
  Package,
  Building2,
  Boxes,
  Activity,
  Tag,
  MapPin,
  Calendar,
  DollarSign,
  ShoppingCart,
  Loader,
  Star
} from "lucide-react";

interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  required: boolean;
  completed: boolean;
  subchecklist?: ChecklistItem[];
  icon?: React.ReactNode;
  dependsOn?: string[];
}

interface GetStartedSidebarProps {
  onChecklistItemSelect: (itemId: string, itemInfo: any) => void;
}

const GetStartedSidebar: React.FC<GetStartedSidebarProps> = ({ onChecklistItemSelect }) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['data-upload']));
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());

  // Define the checklist structure
  const checklistData: ChecklistItem[] = [
    {
      id: 'data-upload',
      title: 'Historic Data Setup',
      description: 'Upload essential business data (required)',
      required: true,
      completed: false,
      icon: <Upload className="w-4 h-4" />,
      subchecklist: [
        {
          id: 'upload-catalog',
          title: 'Catalog Data',
          description: 'Product information, categories, and attributes',
          required: true,
          completed: false,
          icon: <Package className="w-4 h-4" />
        },
        {
          id: 'upload-site',
          title: 'Site Data',
          description: 'Store locations, operational details, and configurations',
          required: true,
          completed: false,
          icon: <Building2 className="w-4 h-4" />
        },
        {
          id: 'upload-inventory',
          title: 'Inventory Data',
          description: 'Stock levels, transit quantities, and availability',
          required: true,
          completed: false,
          icon: <Boxes className="w-4 h-4" />
        },
        {
          id: 'upload-interactions',
          title: 'Transaction Data',
          description: 'Sales, procurement, disbursement, and return transactions',
          required: true,
          completed: false,
          icon: <Activity className="w-4 h-4" />
        },
        {
          id: 'upload-pricing',
          title: 'Pricing Data',
          description: 'MRP, selling prices, and cost information',
          required: true,
          completed: false,
          icon: <DollarSign className="w-4 h-4" />
        },
        {
          id: 'upload-promotions',
          title: 'Promotions Data',
          description: 'Marketing campaigns, discounts, and promotional events',
          required: false,
          completed: false,
          icon: <Tag className="w-4 h-4" />
        },
        {
          id: 'upload-metadata',
          title: 'Metadata Configuration',
          description: 'Data schema definitions and attribute configurations',
          required: true,
          completed: false,
          icon: <FileText className="w-4 h-4" />
        }
      ]
    },
    {
      id: 'realtime-data',
      title: 'Delta Data Connections',
      description: 'Connect live data feeds (optional but recommended)',
      required: false,
      completed: false,
      icon: <Wifi className="w-4 h-4" />,
      subchecklist: [
        {
          id: 'realtime-catalog',
          title: 'Delta Catalog Updates',
          description: 'Real-time product information synchronization',
          required: false,
          completed: false,
          icon: <Package className="w-4 h-4" />
        },
        {
          id: 'realtime-store',
          title: 'Store Operations Feed',
          description: 'Live store status and operational updates',
          required: false,
          completed: false,
          icon: <Building2 className="w-4 h-4" />
        },
        {
          id: 'realtime-interactions',
          title: 'Transaction Stream',
          description: 'Real-time sales and interaction data feed',
          required: false,
          completed: false,
          icon: <Activity className="w-4 h-4" />
        },
        {
          id: 'realtime-inventory',
          title: 'Inventory Updates',
          description: 'Live stock level and movement tracking',
          required: false,
          completed: false,
          icon: <Boxes className="w-4 h-4" />
        },
        {
          id: 'realtime-pricing',
          title: 'Dynamic Pricing',
          description: 'Real-time price updates and adjustments',
          required: false,
          completed: false,
          icon: <Tag className="w-4 h-4" />
        }
      ]
    },
    {
      id: 'configuration',
      title: 'Data Configuration',
      description: 'Configure data processing rules (required after data upload)',
      required: true,
      completed: false,
      icon: <Settings className="w-4 h-4" />,
      dependsOn: ['data-upload'],
      subchecklist: [
        {
          id: 'config-site',
          title: 'Site Configuration',
          description: 'Configure store hierarchies, regions, and operational parameters',
          required: true,
          completed: false,
          icon: <MapPin className="w-4 h-4" />
        },
        {
          id: 'config-catalog',
          title: 'Catalog Configuration',
          description: 'Set up product categorization, attributes, and search parameters',
          required: true,
          completed: false,
          icon: <Package className="w-4 h-4" />
        },
        {
          id: 'config-inventory',
          title: 'Inventory Configuration', 
          description: 'Define stock thresholds, reorder points, and inventory policies',
          required: true,
          completed: false,
          icon: <Boxes className="w-4 h-4" />
        },
        {
          id: 'config-interactions',
          title: 'Transaction Configuration',
          description: 'Configure transaction types, validation rules, and processing workflows',
          required: true,
          completed: false,
          icon: <Activity className="w-4 h-4" />
        },
        {
          id: 'config-pricing',
          title: 'Pricing Configuration',
          description: 'Set up pricing rules, margin calculations, and price validation',
          required: true,
          completed: false,
          icon: <DollarSign className="w-4 h-4" />
        },
        {
          id: 'config-forecasting',
          title: 'Forecasting Setup',
          description: 'Configure forecast models, parameters, and scheduling',
          required: true,
          completed: false,
          icon: <Calendar className="w-4 h-4" />
        }
      ]
    }
  ];

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const toggleCompleted = (itemId: string) => {
    const newCompleted = new Set(completedItems);
    if (newCompleted.has(itemId)) {
      newCompleted.delete(itemId);
    } else {
      newCompleted.add(itemId);
    }
    setCompletedItems(newCompleted);
  };

  const handleItemClick = (item: ChecklistItem) => {
    onChecklistItemSelect(item.id, {
      title: item.title,
      description: item.description,
      required: item.required,
      type: 'checklist-item',
      dependsOn: item.dependsOn
    });
  };

  const renderChecklistItem = (item: ChecklistItem, level: number = 0) => {
    const isExpanded = expandedItems.has(item.id);
    const hasSubchecklist = item.subchecklist && item.subchecklist.length > 0;
    const indent = level * 16;

    // For main sections (level 0), calculate completion based on subchecklist
    // For sub-items (level 1), use the direct completion state
    const isCompleted = level === 0 && hasSubchecklist 
      ? item.subchecklist!.every(subItem => completedItems.has(subItem.id))
      : completedItems.has(item.id);

    // Check if dependencies are met - handle both direct items and main sections
    const dependenciesMet = !item.dependsOn || item.dependsOn.every(depId => {
      // Find the dependency item in the checklist data
      const depItem = checklistData.find(checkItem => checkItem.id === depId);
      
      if (depItem && depItem.subchecklist && depItem.subchecklist.length > 0) {
        // If dependency is a main section with subchecklist, check if all sub-items are completed
        return depItem.subchecklist.every(subItem => completedItems.has(subItem.id));
      } else {
        // If dependency is a direct item, check if it's in completedItems
        return completedItems.has(depId);
      }
    });
    const isDisabled = !dependenciesMet;

    return (
      <div key={item.id} className={level === 0 ? "mb-2" : "mb-0.5"}>
        <div
          className={`flex items-center rounded-lg cursor-pointer transition-all duration-200 ${
            level === 0 
              ? 'p-2 bg-[hsl(var(--sidepanel-background))] hover:bg-[hsl(var(--sidepanel-hover))] border border-[hsl(var(--sidepanel-border))]' 
              : 'p-1.5 hover:bg-[hsl(var(--sidepanel-hover-subtle))]'
          } ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}
          style={{ marginLeft: `${indent}px` }}
          onClick={() => handleItemClick(item)}
        >
          {hasSubchecklist && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(item.id);
              }}
              className="mr-2 p-0.5 hover:bg-[hsl(var(--sidepanel-hover))] rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3 text-[hsl(var(--sidepanel-muted-foreground))]" />
              ) : (
                <ChevronRight className="w-3 h-3 text-[hsl(var(--sidepanel-muted-foreground))]" />
              )}
            </button>
          )}

          {level === 0 ? (
            <div className="mr-3 p-0.5">
              {isCompleted ? (
                <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-sm">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : (
                <div className="w-5 h-5 border-2 border-[hsl(var(--sidepanel-muted-foreground))] rounded-full opacity-40"></div>
              )}
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleCompleted(item.id);
              }}
              className="mr-3 p-0.5 hover:bg-[hsl(var(--sidepanel-hover))] rounded transition-all duration-200 group"
            >
              {isCompleted ? (
                <div className="w-4 h-4 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-sm transform group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : (
                <div className="w-4 h-4 border-2 border-[hsl(var(--sidepanel-muted-foreground))] rounded-full hover:border-green-400 transition-colors duration-200 group-hover:shadow-sm"></div>
              )}
            </button>
          )}

          {item.icon && (
            <div className={`${level === 0 ? 'mr-3' : 'mr-2'} ${
              isCompleted 
                ? 'text-[hsl(var(--sidepanel-muted-foreground))] opacity-50' 
                : 'text-[hsl(var(--sidepanel-foreground))]'
            }`}>
              {item.icon}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className={`flex items-center ${level === 0 ? 'gap-2 mb-1' : 'gap-1 mb-0.5'}`}>
              <h4 className={`font-medium ${level === 0 ? 'text-sm' : 'text-xs'} ${
                isCompleted 
                  ? 'text-[hsl(var(--sidepanel-muted-foreground))] line-through' 
                  : 'text-[hsl(var(--sidepanel-foreground))]'
              }`}>
                {item.title}
              </h4>
              {item.required && (
                <Star className="w-3 h-3 text-red-500 fill-red-500" />
              )}
            </div>
            {item.description && (
              <p className={`${level === 0 ? 'text-xs' : 'text-xs'} leading-relaxed ${
                isCompleted 
                  ? 'text-[hsl(var(--sidepanel-muted-foreground))] line-through opacity-60' 
                  : 'text-[hsl(var(--sidepanel-muted-foreground))]'
              }`}>
                {item.description}
              </p>
            )}
            {item.dependsOn && item.dependsOn.length > 0 && (
              <p className="text-xs text-orange-600 mt-1">
                Depends on: {item.dependsOn.join(', ')}
              </p>
            )}
          </div>
        </div>

        {hasSubchecklist && isExpanded && (
          <div className="mt-1 space-y-0.5">
            {item.subchecklist!.map(subItem => renderChecklistItem(subItem, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Calculate completed count based on actual completion state
  const completedCount = checklistData.reduce((count, item) => {
    const hasSubchecklist = item.subchecklist && item.subchecklist.length > 0;
    
    // For main sections, count as completed if all sub-items are done
    const mainSectionCompleted = hasSubchecklist 
      ? item.subchecklist!.every(subItem => completedItems.has(subItem.id))
      : completedItems.has(item.id);
    
    const mainCount = mainSectionCompleted ? 1 : 0;
    
    // Count completed sub-items
    const subCount = hasSubchecklist 
      ? item.subchecklist!.filter(subItem => completedItems.has(subItem.id)).length
      : 0;
    
    return count + mainCount + subCount;
  }, 0);

  const totalCount = checklistData.reduce((count, item) => {
    return count + 1 + (item.subchecklist ? item.subchecklist.length : 0);
  }, 0);

  // Calculate completion count and total for REQUIRED items only (for button logic)
  const requiredCompletedCount = checklistData.reduce((count, item) => {
    const hasSubchecklist = item.subchecklist && item.subchecklist.length > 0;
    
    // For main sections, count as completed if all REQUIRED sub-items are done
    if (hasSubchecklist) {
      const requiredSubItems = item.subchecklist!.filter(subItem => subItem.required);
      const mainSectionCompleted = requiredSubItems.length > 0 
        ? requiredSubItems.every(subItem => completedItems.has(subItem.id))
        : true; // If no required sub-items, consider complete
      
      const mainCount = (item.required && mainSectionCompleted) ? 1 : 0;
      
      // Count completed required sub-items
      const subCount = item.subchecklist!.filter(subItem => 
        subItem.required && completedItems.has(subItem.id)
      ).length;
      
      return count + mainCount + subCount;
    } else {
      // For direct items, count if required and completed
      return count + (item.required && completedItems.has(item.id) ? 1 : 0);
    }
  }, 0);

  const requiredTotalCount = checklistData.reduce((count, item) => {
    const hasSubchecklist = item.subchecklist && item.subchecklist.length > 0;
    const mainCount = item.required ? 1 : 0;
    const subCount = hasSubchecklist 
      ? item.subchecklist!.filter(subItem => subItem.required).length
      : 0;
    return count + mainCount + subCount;
  }, 0);

  // Check if all REQUIRED items are completed (for button display)
  const isChecklistCompleted = requiredCompletedCount === requiredTotalCount;

  return (
    <div className="h-full bg-[hsl(var(--sidepanel-background))] flex flex-col border-r border-[hsl(var(--sidepanel-border))]">
      {/* Header */}
      <div className="p-4 border-b border-[hsl(var(--sidepanel-border))]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-[hsl(var(--sidepanel-foreground))]">
            Getting Started
          </h2>
          <div className="text-sm text-[hsl(var(--sidepanel-muted-foreground))]">
            {completedCount}/{totalCount}
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-[hsl(var(--sidepanel-border))] rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          ></div>
        </div>
        
        <p className="text-sm text-[hsl(var(--sidepanel-muted-foreground))] mt-2">
          {isChecklistCompleted 
            ? "Mandatory points are completed" 
            : "Complete the onboarding checklist to set up your retail analytics platform"
          }
        </p>
        
        {isChecklistCompleted && (
          <button className="w-full mt-4 bg-[hsl(var(--dashboard-primary-blue))] hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Initiate the Project
          </button>
        )}
      </div>

      {/* Checklist Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {checklistData.map(item => renderChecklistItem(item))}
      </div>

      {/* Footer with help */}
      <div className="p-4 border-t border-[hsl(var(--sidepanel-border))] bg-[hsl(var(--sidepanel-accent-background))]">
        <div className="text-xs text-[hsl(var(--sidepanel-muted-foreground))]">
          <p className="mb-2">Need help getting started?</p>
          <p>Click on any checklist item to view detailed setup instructions and data format requirements.</p>
        </div>
      </div>
    </div>
  );
};

export default GetStartedSidebar; 