import { useState, useEffect, useRef } from "react";
import { 
  Save, 
  X, 
  ChevronDown, 
  Search,
  Loader2,
  AlertCircle,
  Building2,
  Package
} from "lucide-react";
import { ForecastRepository } from "@/repository/forecast_repository";
import { useProject } from "@/context/ProjectProvider";

interface NewStoreTabProps {
  onClose: () => void;
  onSave?: (storeData: StoreFormData) => void;
}

interface StoreFormData {
  // Location attributes (hierarchical)
  region: string;
  state: string;
  city: string;
  pin_code: string;
  store_no: string; // This will be input field (last in location hierarchy)
  
  // Other store attributes
  p1_dc: string;
  store_type: string;
  format: string;
}

interface DropdownOption {
  value: string;
  count?: number;
}

interface AssortmentData {
  article_id: string;
  article_description: string;
  brand: string;
  segment: string;
  super_category: string;
  avg_forecast_qty: number;
  avg_consensus_qty: number;
  avg_sold_qty: number;
}

interface DropdownProps {
  label: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  loading?: boolean;
  searchable?: boolean;
  placeholder?: string;
  required?: boolean;
}

const Dropdown = ({ 
  label, 
  value, 
  options, 
  onChange, 
  loading = false, 
  searchable = true,
  placeholder = "Select...",
  required = false
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[hsl(var(--panel-foreground))]">
        {label} {required && <span className="text-[hsl(var(--panel-error))]">*</span>}
      </label>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 bg-[hsl(var(--panel-background))] text-[hsl(var(--panel-foreground))] border border-[hsl(var(--panel-border))] rounded-lg focus:outline-none focus:border-[hsl(var(--primary))] flex items-center justify-between hover:bg-[hsl(var(--sidepanel-background))] transition-colors"
        >
          <span className={value ? "text-[hsl(var(--panel-foreground))]" : "text-[hsl(var(--panel-muted-foreground))]"}>
            {value || placeholder}
          </span>
          <ChevronDown 
            size={16} 
            className={`text-[hsl(var(--panel-muted-foreground))] transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>
        
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-[hsl(var(--panel-background))] border border-[hsl(var(--panel-border))] rounded-lg shadow-lg max-h-60 overflow-hidden">
            {searchable && (
              <div className="p-2 border-b border-[hsl(var(--panel-border))]">
                <div className="relative">
                  <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[hsl(var(--panel-muted-foreground))]" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-1 bg-[hsl(var(--sidepanel-background))] text-[hsl(var(--panel-foreground))] border border-[hsl(var(--sidepanel-border))] rounded focus:outline-none focus:border-[hsl(var(--primary))] text-sm"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}
            
            <div className="max-h-48 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 size={16} className="animate-spin text-[hsl(var(--panel-muted-foreground))]" />
                  <span className="ml-2 text-[hsl(var(--panel-muted-foreground))] text-sm">Loading...</span>
                </div>
              ) : filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className="w-full px-3 py-2 text-left text-[hsl(var(--panel-foreground))] hover:bg-[hsl(var(--sidepanel-background))] transition-colors flex items-center justify-between"
                  >
                    <span>{option.value}</span>
                    {option.count && (
                      <span className="text-[hsl(var(--panel-muted-foreground))] text-xs">
                        ({option.count})
                      </span>
                    )}
                  </button>
                ))
              ) : (
                <div className="p-3 text-[hsl(var(--panel-muted-foreground))] text-sm text-center">
                  No options found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const NewStoreTab = ({ onClose, onSave }: NewStoreTabProps) => {
  const [formData, setFormData] = useState<StoreFormData>({
    region: "",
    state: "",
    city: "",
    pin_code: "",
    store_no: "",
    p1_dc: "",
    store_type: "",
    format: ""
  });

  const [dropdownOptions, setDropdownOptions] = useState<Record<string, DropdownOption[]>>({});
  const [loading, setLoading] = useState(true);
  const [loadingFields, setLoadingFields] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Assortment data state
  const [assortmentData, setAssortmentData] = useState<AssortmentData[]>([]);
  const [loadingAssortment, setLoadingAssortment] = useState(false);
  const [assortmentError, setAssortmentError] = useState<string | null>(null);

  const {forecastRepository: forecastRepo} = useProject();

  // Store attributes and location hierarchy
  const storeAttributes = ["region", "state", "city", "pin_code", "p1_dc", "store_no", "store_type", "format"];
  const locationHierarchy = ["region", "state", "city", "pin_code", "store_no"];
  
  // Fields that should have dropdowns (all except store_no which is the last in location hierarchy)
  const dropdownFields = storeAttributes.filter(field => field !== "store_no");

  useEffect(() => {
    loadInitialOptions();
  }, []);

  // Load assortment data when form data changes
  useEffect(() => {
    loadAssortmentData();
  }, [formData]);

  const loadInitialOptions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load options for all non-dependent fields
      const independentFields = ["region", "p1_dc", "store_type", "format"];
      
      for (const field of independentFields) {
        await loadFieldOptions(field);
      }

    } catch (err) {
      console.error('Error loading initial options:', err);
      setError('Failed to load form options');
    } finally {
      setLoading(false);
    }
  };

  const loadFieldOptions = async (field: string, parentValues: Record<string, string> = {}) => {
    try {
      setLoadingFields(prev => new Set(prev).add(field));

      let whereClause = '';
      if (Object.keys(parentValues).length > 0) {
        whereClause = 'WHERE ' + Object.entries(parentValues)
          .map(([key, value]) => `${key} = '${value}'`)
          .join(' AND ');
      }

      const query = `
        SELECT ${field}, COUNT(*) as count
        FROM forecast
        ${whereClause}
        GROUP BY ${field}
        ORDER BY count DESC, ${field}
        LIMIT 100
      `;

      const stateSetters = {
        setLoading: () => {},
        setError: (err: string | null) => setError(err),
        setData: (data: any) => {
          if (data && data.data) {
            const options: DropdownOption[] = data.data.map((row: any) => ({
              value: row[field],
              count: row.count
            }));
            setDropdownOptions(prev => ({ ...prev, [field]: options }));
          }
        }
      };

      await forecastRepo.executeSqlQuery({ sql_query: query }, stateSetters);

    } catch (err) {
      console.error(`Error loading options for ${field}:`, err);
      setError(`Failed to load ${field} options`);
    } finally {
      setLoadingFields(prev => {
        const newSet = new Set(prev);
        newSet.delete(field);
        return newSet;
      });
    }
  };

  const loadDependentOptions = async (field: string, parentValues: Record<string, string>) => {
    await loadFieldOptions(field, parentValues);
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // If this is a location hierarchy field, load dependent options and clear dependent fields
    const fieldIndex = locationHierarchy.indexOf(field);
    if (fieldIndex !== -1 && fieldIndex < locationHierarchy.length - 1) {
      const nextField = locationHierarchy[fieldIndex + 1];
      
      // Clear dependent fields
      const updatedFormData = { ...formData, [field]: value };
      for (let i = fieldIndex + 1; i < locationHierarchy.length; i++) {
        updatedFormData[locationHierarchy[i]] = "";
      }
      setFormData(updatedFormData);

      // Load options for the next field if it's a dropdown field
      if (dropdownFields.includes(nextField)) {
        const parentValues: Record<string, string> = {};
        for (let i = 0; i <= fieldIndex; i++) {
          parentValues[locationHierarchy[i]] = i === fieldIndex ? value : formData[locationHierarchy[i]];
        }
        loadDependentOptions(nextField, parentValues);
      }
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // Validate required fields
      const requiredFields = ["region", "state", "city", "pin_code", "store_no", "p1_dc", "store_type", "format"];
      const emptyFields = requiredFields.filter(field => !formData[field as keyof StoreFormData]);
      
      if (emptyFields.length > 0) {
        setError(`Please fill in all required fields: ${emptyFields.join(', ')}`);
        return;
      }

      // Call the onSave callback if provided
      if (onSave) {
        await onSave(formData);
      }

      // Close the tab after successful save
      if (onClose) {
        onClose();
      }

    } catch (err) {
      console.error('Error saving store:', err);
      setError('Failed to save store data');
    } finally {
      setSaving(false);
    }
  };

  const loadAssortmentData = async () => {
    // Only load if we have some form data
    if (!Object.values(formData).some(v => v)) {
      setAssortmentData([]);
      return;
    }

    try {
      setLoadingAssortment(true);
      setAssortmentError(null);

      // Build WHERE clause from non-empty form fields
      const conditions = Object.entries(formData)
        .filter(([_, value]) => value)
        .map(([key, value]) => `${key} = '${value}'`);

      if (conditions.length === 0) {
        setAssortmentData([]);
        return;
      }

      const sqlQuery = `
        SELECT 
          article_id,
          article_description,
          brand,
          segment,
          super_category,
          AVG(forecast_qty) as avg_forecast_qty,
          AVG(consensus_qty) as avg_consensus_qty,
          AVG(sold_qty) as avg_sold_qty
        FROM forecast
        WHERE ${conditions.join(' AND ')}
        GROUP BY article_id, article_description, brand, segment, super_category
        ORDER BY avg_forecast_qty DESC
        LIMIT 50
      `;

      const stateSetters = {
        setLoading: () => {},
        setError: (err: string | null) => setAssortmentError(err),
        setData: (data: any) => {
          if (data && data.data) {
            const assortment: AssortmentData[] = data.data.map((row: any) => ({
              article_id: row.article_id,
              article_description: row.article_description,
              brand: row.brand,
              segment: row.segment,
              super_category: row.super_category,
              avg_forecast_qty: parseFloat(row.avg_forecast_qty) || 0,
              avg_consensus_qty: parseFloat(row.avg_consensus_qty) || 0,
              avg_sold_qty: parseFloat(row.avg_sold_qty) || 0
            }));
            setAssortmentData(assortment);
          }
        }
      };

      await forecastRepo.executeSqlQuery({ sql_query: sqlQuery }, stateSetters);

    } catch (err) {
      console.error('Error loading assortment data:', err);
      setAssortmentError('Failed to load assortment data');
    } finally {
      setLoadingAssortment(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full bg-[hsl(var(--panel-background))] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={24} className="animate-spin text-[hsl(var(--panel-muted-foreground))] mx-auto mb-2" />
          <span className="text-[hsl(var(--panel-muted-foreground))]">Loading form...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-[hsl(var(--panel-background))] flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-[hsl(var(--panel-border))] flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Building2 size={20} className="text-[hsl(var(--primary))]" />
          <div>
            <h3 className="text-[hsl(var(--panel-foreground))] font-medium text-lg">Add New Store</h3>
            <p className="text-[hsl(var(--panel-muted-foreground))] text-sm">Enter store information and view assortment</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-[hsl(var(--sidepanel-background))] rounded-lg transition-colors"
        >
          <X size={20} className="text-[hsl(var(--panel-muted-foreground))]" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {/* Form Section - Compact at top */}
        <div className="p-4 border-b border-[hsl(var(--panel-border))]">
          {error && (
            <div className="mb-4 p-3 bg-[hsl(var(--panel-error-background))] border border-[hsl(var(--panel-error-border))] rounded-lg flex items-center space-x-2">
              <AlertCircle size={16} className="text-[hsl(var(--panel-error))] flex-shrink-0" />
              <span className="text-[hsl(var(--panel-error))] text-sm">{error}</span>
            </div>
          )}

          {/* Compact Form Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {locationHierarchy.slice(0, -1).map((field) => (
              <Dropdown
                key={field}
                label={field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                value={formData[field as keyof StoreFormData]}
                options={dropdownOptions[field] || []}
                onChange={(value) => handleFieldChange(field, value)}
                loading={loadingFields.has(field)}
                required={true}
                placeholder={`Select ${field.replace(/_/g, ' ')}`}
              />
            ))}
            
            {/* Store Number - Input field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[hsl(var(--panel-foreground))]">
                Store Number <span className="text-[hsl(var(--panel-error))]">*</span>
              </label>
              <input
                type="text"
                value={formData.store_no}
                onChange={(e) => handleFieldChange('store_no', e.target.value)}
                placeholder="Enter store number"
                className="w-full px-3 py-2 bg-[hsl(var(--panel-background))] text-[hsl(var(--panel-foreground))] border border-[hsl(var(--panel-border))] rounded-lg focus:outline-none focus:border-[hsl(var(--primary))] placeholder-[hsl(var(--panel-muted-foreground))]"
              />
            </div>

            {/* Store Details */}
            {["p1_dc", "store_type", "format"].map((field) => (
              <Dropdown
                key={field}
                label={field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                value={formData[field as keyof StoreFormData]}
                options={dropdownOptions[field] || []}
                onChange={(value) => handleFieldChange(field, value)}
                loading={loadingFields.has(field)}
                required={true}
                placeholder={`Select ${field.replace(/_/g, ' ')}`}
              />
            ))}
          </div>
        </div>

        {/* Assortment Table Section */}
        <div className="flex-1 p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Package size={18} className="text-[hsl(var(--primary))]" />
            <h4 className="text-[hsl(var(--panel-foreground))] font-medium text-base">Expected Assortment</h4>
            <span className="text-[hsl(var(--panel-muted-foreground))] text-sm">
              (Predicted)
            </span>
          </div>

          {assortmentError && (
            <div className="mb-4 p-3 bg-[hsl(var(--panel-error-background))] border border-[hsl(var(--panel-error-border))] rounded-lg flex items-center space-x-2">
              <AlertCircle size={16} className="text-[hsl(var(--panel-error))] flex-shrink-0" />
              <span className="text-[hsl(var(--panel-error))] text-sm">{assortmentError}</span>
            </div>
          )}

          {loadingAssortment ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={24} className="animate-spin text-[hsl(var(--panel-muted-foreground))] mr-2" />
              <span className="text-[hsl(var(--panel-muted-foreground))]">Loading assortment data...</span>
            </div>
          ) : (
            <div className="bg-[hsl(var(--dashboard-card-background))] rounded-lg border border-[hsl(var(--dashboard-card-border))] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[hsl(var(--sidepanel-background))] border-b border-[hsl(var(--sidepanel-border))]">
                      <th className="px-4 py-3 text-left text-xs font-medium text-[hsl(var(--panel-muted-foreground))] uppercase tracking-wider">
                        Article ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[hsl(var(--panel-muted-foreground))] uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[hsl(var(--panel-muted-foreground))] uppercase tracking-wider">
                        Brand
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[hsl(var(--panel-muted-foreground))] uppercase tracking-wider">
                        Segment
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[hsl(var(--panel-muted-foreground))] uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-[hsl(var(--panel-muted-foreground))] uppercase tracking-wider">
                        Avg Forecast
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-[hsl(var(--panel-muted-foreground))] uppercase tracking-wider">
                        Avg Consensus
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-[hsl(var(--panel-muted-foreground))] uppercase tracking-wider">
                        Avg Sold
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[hsl(var(--dashboard-card-border))]">
                    {assortmentData.length > 0 ? (
                      assortmentData.map((item, index) => (
                        <tr key={index} className="hover:bg-[hsl(var(--dashboard-card-hover))] transition-colors">
                          <td className="px-4 py-3 text-sm text-[hsl(var(--panel-foreground))] font-mono">
                            {item.article_id}
                          </td>
                          <td className="px-4 py-3 text-sm text-[hsl(var(--panel-foreground))]">
                            <div className="max-w-xs truncate" title={item.article_description}>
                              {item.article_description}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-[hsl(var(--panel-muted-foreground))]">
                            {item.brand}
                          </td>
                          <td className="px-4 py-3 text-sm text-[hsl(var(--panel-muted-foreground))]">
                            {item.segment}
                          </td>
                          <td className="px-4 py-3 text-sm text-[hsl(var(--panel-muted-foreground))]">
                            {item.super_category}
                          </td>
                          <td className="px-4 py-3 text-sm text-[hsl(var(--panel-foreground))] text-right font-mono">
                            {item.avg_forecast_qty.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm text-[hsl(var(--panel-foreground))] text-right font-mono">
                            {item.avg_consensus_qty.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm text-[hsl(var(--panel-foreground))] text-right font-mono">
                            {item.avg_sold_qty.toFixed(2)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-[hsl(var(--panel-muted-foreground))]">
                          {Object.values(formData).some(v => v) 
                            ? "No assortment data found for the selected filters" 
                            : "Enter store details to view expected assortment"
                          }
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer with Actions */}
      <div className="flex-shrink-0 p-4 border-t border-[hsl(var(--panel-border))] flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-[hsl(var(--panel-muted-foreground))] hover:text-[hsl(var(--panel-foreground))] hover:bg-[hsl(var(--sidepanel-background))] rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))/90] disabled:bg-[hsl(var(--sidepanel-background))] disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          {saving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save size={16} />
              <span>Save Store</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default NewStoreTab; 