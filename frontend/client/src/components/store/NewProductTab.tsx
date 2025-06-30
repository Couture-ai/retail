import { useState, useEffect, useRef } from "react";
import { 
  Save, 
  X, 
  ChevronDown, 
  Search,
  Loader2,
  AlertCircle,
  Package,
  Building2
} from "lucide-react";
import { ForecastRepository } from "@/repository/forecast_repository";

interface ProductFormData {
  // Category hierarchy attributes
  super_category: string;
  vertical: string;
  division: string;
  segment: string;
  brick_description: string;
  brand: string;
  article_description: string;
  // Product identifiers and codes - article_id will be input
  article_id: string;
  segment_code: string;
  brick_code: string;
  class_code: string;
  division_code: string;
  family_code: string;
  batchno: string;
  // Product characteristics
  kvi: string;
  npi: string;
  sd: string;
}

interface DropdownOption {
  value: string;
  count?: number;
}

interface AssortmentData {
  store_no: string;
  city: string;
  state: string;
  region: string;
  p1_dc: string;
  avg_forecast_qty: number;
  avg_consensus_qty: number;
  avg_sold_qty: number;
}

interface NewProductTabProps {
  onClose?: () => void;
  onSave?: (productData: ProductFormData) => void;
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
      <label className="block text-sm font-medium text-white">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 bg-[hsl(var(--dark-6))] text-white border border-[hsl(var(--dark-4))] rounded-lg focus:outline-none focus:border-[hsl(var(--primary))] flex items-center justify-between hover:bg-[hsl(var(--dark-5))] transition-colors"
        >
          <span className={value ? "text-white" : "text-[hsl(var(--dark-3))]"}>
            {value || placeholder}
          </span>
          <ChevronDown 
            size={16} 
            className={`text-[hsl(var(--dark-3))] transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>
        
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-[hsl(var(--dark-6))] border border-[hsl(var(--dark-4))] rounded-lg shadow-lg max-h-60 overflow-hidden">
            {searchable && (
              <div className="p-2 border-b border-[hsl(var(--dark-4))]">
                <div className="relative">
                  <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[hsl(var(--dark-3))]" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-1 bg-[hsl(var(--dark-7))] text-white border border-[hsl(var(--dark-5))] rounded focus:outline-none focus:border-[hsl(var(--primary))] text-sm"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}
            
            <div className="max-h-48 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 size={16} className="animate-spin text-[hsl(var(--dark-3))]" />
                  <span className="ml-2 text-[hsl(var(--dark-3))] text-sm">Loading...</span>
                </div>
              ) : filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className="w-full px-3 py-2 text-left text-white hover:bg-[hsl(var(--dark-5))] transition-colors flex items-center justify-between"
                  >
                    <span>{option.value}</span>
                    {option.count && (
                      <span className="text-[hsl(var(--dark-3))] text-xs">
                        ({option.count})
                      </span>
                    )}
                  </button>
                ))
              ) : (
                <div className="p-3 text-[hsl(var(--dark-3))] text-sm text-center">
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

const NewProductTab = ({ onClose, onSave }: NewProductTabProps) => {
  const [formData, setFormData] = useState<ProductFormData>({
    super_category: '',
    vertical: '',
    division: '',
    segment: '',
    brick_description: '',
    brand: '',
    article_description: '',
    article_id: '',
    segment_code: '',
    brick_code: '',
    class_code: '',
    division_code: '',
    family_code: '',
    batchno: '',
    kvi: '',
    npi: '',
    sd: ''
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

  const forecastRepo = new ForecastRepository(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000');

  // Product attributes that should have dropdowns (all except article_id and article_description which are inputs)
  const dropdownFields = [
    'super_category', 'vertical', 'division', 'segment', 'brick_description', 
    'brand', 'segment_code', 'brick_code', 'class_code', 'division_code', 
    'family_code', 'batchno', 'kvi', 'npi', 'sd'
  ];

  // Product category hierarchy for dependent dropdowns
  const productHierarchy = ['vertical', 'super_category', 'segment', 'article_description', 'article_id'];

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

      // Load filter options directly from the filters endpoint
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/core/forecast/filters`);
      const data = await response.json();
      
      if (data && data.filter_options) {
        const options: Record<string, DropdownOption[]> = {};
        
        dropdownFields.forEach(field => {
          if (data.filter_options[field]) {
            options[field] = data.filter_options[field].map((item: any) => ({
              value: item.value,
              count: item.count
            }));
          }
        });
        
        setDropdownOptions(options);
      }

    } catch (err) {
      console.error('Error loading options:', err);
      setError('Failed to load form options');
    } finally {
      setLoading(false);
    }
  };

  const loadDependentOptions = async (field: string, parentValues: Record<string, string>) => {
    try {
      setLoadingFields(prev => new Set(prev).add(field));

      // Build WHERE clause from parent values
      const whereConditions = Object.entries(parentValues)
        .filter(([_, value]) => value) // Only include non-empty values
        .map(([key, value]) => `${key} = '${value}'`)
        .join(' AND ');

      const sqlQuery = `
        SELECT ${field}, COUNT(*) as count 
        FROM forecast 
        WHERE ${whereConditions} AND ${field} IS NOT NULL 
        GROUP BY ${field} 
        ORDER BY ${field}
      `;

      const stateSetters = {
        setLoading: () => {},
        setError: (err: string | null) => setError(err),
        setData: (data: any) => {
          if (data && data.data) {
            const options = data.data.map((row: any) => ({
              value: row[field],
              count: row.count
            }));
            
            setDropdownOptions(prev => ({
              ...prev,
              [field]: options
            }));
          }
        }
      };

      await forecastRepo.executeSqlQuery({ sql_query: sqlQuery }, stateSetters);

    } catch (err) {
      console.error(`Error loading options for ${field}:`, err);
    } finally {
      setLoadingFields(prev => {
        const newSet = new Set(prev);
        newSet.delete(field);
        return newSet;
      });
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // If this is a product hierarchy field, load dependent options and clear dependent fields
    const fieldIndex = productHierarchy.indexOf(field);
    if (fieldIndex !== -1 && fieldIndex < productHierarchy.length - 1) {
      const nextField = productHierarchy[fieldIndex + 1];
      
      // Clear dependent fields
      const updatedFormData = { ...formData, [field]: value };
      for (let i = fieldIndex + 1; i < productHierarchy.length; i++) {
        updatedFormData[productHierarchy[i]] = "";
      }
      setFormData(updatedFormData);

      // Load options for the next field if it's a dropdown field
      if (dropdownFields.includes(nextField)) {
        const parentValues: Record<string, string> = {};
        for (let i = 0; i <= fieldIndex; i++) {
          parentValues[productHierarchy[i]] = i === fieldIndex ? value : formData[productHierarchy[i]];
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
      const requiredFields = ['vertical', 'super_category', 'segment', 'article_description', 'article_id'];
      const emptyFields = requiredFields.filter(field => !formData[field as keyof ProductFormData]);
      
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
      console.error('Error saving product:', err);
      setError('Failed to save product data');
    } finally {
      setSaving(false);
    }
  };

  const loadAssortmentData = async () => {
    try {
      setLoadingAssortment(true);
      setAssortmentError(null);

      // Build WHERE clause from form data (only include non-empty values)
      const whereConditions = Object.entries(formData)
        .filter(([_, value]) => value && value.trim() !== "")
        .map(([key, value]) => `${key} = '${value.replace(/'/g, "''")}'`)
        .join(' AND ');

      // If no filters applied, show sample data
      const whereClause = whereConditions ? `WHERE ${whereConditions}` : '';

      const sqlQuery = `
        SELECT 
          store_no, city, state, region, p1_dc,
          ROUND(CAST(AVG(forecast_qty) AS NUMERIC), 2) as avg_forecast_qty,
          ROUND(CAST(AVG(consensus_qty) AS NUMERIC), 2) as avg_consensus_qty,
          ROUND(CAST(AVG(sold_qty) AS NUMERIC), 2) as avg_sold_qty
        FROM forecast 
        ${whereClause}
        GROUP BY store_no, city, state, region, p1_dc
        ORDER BY avg_forecast_qty DESC
        LIMIT 100
      `;

      const stateSetters = {
        setLoading: () => {},
        setError: (err: string | null) => setAssortmentError(err),
        setData: (data: any) => {
          if (data && data.data) {
            const assortment: AssortmentData[] = data.data.map((row: any) => ({
              store_no: row.store_no,
              city: row.city,
              state: row.state,
              region: row.region,
              p1_dc: row.p1_dc,
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
      <div className="h-full flex items-center justify-center bg-[hsl(var(--dark-8))]">
        <div className="flex items-center space-x-3">
          <Loader2 size={24} className="animate-spin text-[hsl(var(--primary))]" />
          <span className="text-white">Loading product form...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-[hsl(var(--dark-8))] flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-700/50">
        <div className="flex items-center space-x-3">
          <Package size={20} className="text-[hsl(var(--primary))]" />
          <h3 className="text-white font-semibold text-lg">Add New Product</h3>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-[hsl(var(--dark-6))] rounded-lg transition-colors"
        >
          <X size={20} className="text-[hsl(var(--dark-3))]" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {/* Form Section - Compact at top */}
        <div className="p-4 border-b border-gray-700/30">
          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-800/30 rounded-lg flex items-center space-x-2">
              <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}

          {/* Compact Form Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Product Hierarchy Fields */}
            {productHierarchy.slice(0, -2).map((field) => (
              <Dropdown
                key={field}
                label={field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                value={formData[field as keyof ProductFormData]}
                options={dropdownOptions[field] || []}
                onChange={(value) => handleFieldChange(field, value)}
                loading={loadingFields.has(field)}
                required={true}
                placeholder={`Select ${field.replace(/_/g, ' ')}`}
              />
            ))}
            
            {/* Article Description - Input field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white">
                Article Description <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.article_description}
                onChange={(e) => handleFieldChange('article_description', e.target.value)}
                placeholder="Enter article description"
                className="w-full px-3 py-2 bg-[hsl(var(--dark-6))] text-white border border-[hsl(var(--dark-4))] rounded-lg focus:outline-none focus:border-[hsl(var(--primary))] placeholder-[hsl(var(--dark-3))]"
              />
            </div>

            {/* Article ID - Input field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white">
                Article ID <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.article_id}
                onChange={(e) => handleFieldChange('article_id', e.target.value)}
                placeholder="Enter article ID"
                className="w-full px-3 py-2 bg-[hsl(var(--dark-6))] text-white border border-[hsl(var(--dark-4))] rounded-lg focus:outline-none focus:border-[hsl(var(--primary))] placeholder-[hsl(var(--dark-3))]"
              />
            </div>

            {/* Other Product Attributes */}
            {['brand', 'brick_description', 'division'].map((field) => (
              <Dropdown
                key={field}
                label={field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                value={formData[field as keyof ProductFormData]}
                options={dropdownOptions[field] || []}
                onChange={(value) => handleFieldChange(field, value)}
                loading={loadingFields.has(field)}
                placeholder={`Select ${field.replace(/_/g, ' ')}`}
              />
            ))}

            {/* Product Codes */}
            {['segment_code', 'brick_code', 'class_code', 'division_code', 'family_code'].map((field) => (
              <Dropdown
                key={field}
                label={field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                value={formData[field as keyof ProductFormData]}
                options={dropdownOptions[field] || []}
                onChange={(value) => handleFieldChange(field, value)}
                loading={loadingFields.has(field)}
                placeholder={`Select ${field.replace(/_/g, ' ')}`}
              />
            ))}

            {/* Product Characteristics */}
            {['batchno', 'kvi', 'npi', 'sd'].map((field) => (
              <Dropdown
                key={field}
                label={field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                value={formData[field as keyof ProductFormData]}
                options={dropdownOptions[field] || []}
                onChange={(value) => handleFieldChange(field, value)}
                loading={loadingFields.has(field)}
                placeholder={`Select ${field.replace(/_/g, ' ')}`}
              />
            ))}
          </div>
        </div>

        {/* Store-wise Assortment Table Section */}
        <div className="flex-1 p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Building2 size={18} className="text-[hsl(var(--primary))]" />
            <h4 className="text-white font-medium text-base">Store-wise Assortment</h4>
            <span className="text-[hsl(var(--dark-3))] text-sm">
              (Forecast Data)
            </span>
          </div>

          {assortmentError && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-800/30 rounded-lg flex items-center space-x-2">
              <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
              <span className="text-red-400 text-sm">{assortmentError}</span>
            </div>
          )}

          {loadingAssortment ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={24} className="animate-spin text-[hsl(var(--dark-3))] mr-2" />
              <span className="text-[hsl(var(--dark-3))]">Loading assortment data...</span>
            </div>
          ) : (
            <div className="bg-[hsl(var(--dark-7))] rounded-lg border border-gray-700/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[hsl(var(--dark-6))] border-b border-gray-700/50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-[hsl(var(--dark-2))] uppercase tracking-wider">
                        Store No
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[hsl(var(--dark-2))] uppercase tracking-wider">
                        City
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[hsl(var(--dark-2))] uppercase tracking-wider">
                        State
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[hsl(var(--dark-2))] uppercase tracking-wider">
                        Region
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[hsl(var(--dark-2))] uppercase tracking-wider">
                        P1 DC
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-[hsl(var(--dark-2))] uppercase tracking-wider">
                        Avg Forecast
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-[hsl(var(--dark-2))] uppercase tracking-wider">
                        Avg Consensus
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-[hsl(var(--dark-2))] uppercase tracking-wider">
                        Avg Sold
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {assortmentData.length > 0 ? (
                      assortmentData.map((item, index) => (
                        <tr key={index} className="hover:bg-[hsl(var(--dark-6))] transition-colors">
                          <td className="px-4 py-3 text-sm text-white font-mono">
                            {item.store_no}
                          </td>
                          <td className="px-4 py-3 text-sm text-white">
                            {item.city}
                          </td>
                          <td className="px-4 py-3 text-sm text-[hsl(var(--dark-2))]">
                            {item.state}
                          </td>
                          <td className="px-4 py-3 text-sm text-[hsl(var(--dark-2))]">
                            {item.region}
                          </td>
                          <td className="px-4 py-3 text-sm text-[hsl(var(--dark-2))]">
                            {item.p1_dc}
                          </td>
                          <td className="px-4 py-3 text-sm text-white text-right font-mono">
                            {item.avg_forecast_qty.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm text-white text-right font-mono">
                            {item.avg_consensus_qty.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm text-white text-right font-mono">
                            {item.avg_sold_qty.toFixed(2)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-[hsl(var(--dark-3))]">
                          {Object.values(formData).some(v => v) 
                            ? "No assortment data found for the selected filters" 
                            : "Enter product details to view store-wise assortment"
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
      <div className="flex-shrink-0 p-4 border-t border-gray-700/50 flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-[hsl(var(--dark-2))] hover:text-white hover:bg-[hsl(var(--dark-6))] rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))/90] disabled:bg-[hsl(var(--dark-6))] disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          {saving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save size={16} />
              <span>Save Product</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default NewProductTab; 