import axios from 'axios';

const API_URL = import.meta.env.VITE_API_STUDIO_URL || '';

/**
 * Fetch forecast data with pagination, search, and filters
 * @param {number} limit - Number of records to fetch
 * @param {number} offset - Offset for pagination
 * @param {object} search - Search criteria
 * @param {object} filters - Filter criteria
 * @param {object} sort - Sort criteria
 * @returns {Promise<{items: Array, total: number}>}
 */
export const getForecastData = async (limit = 10, offset = 0, search = null, filters = null, sort = null) => {
  try {
    // Build API URL with query parameters
    let url = `${API_URL}/core/forecast?limit=${limit}&offset=${offset}`;
    
    // Add search parameter if provided
    if (search) {
      url += `&search=${encodeURIComponent(JSON.stringify(search))}`;
    }
    
    // Add filters parameter if provided
    if (filters && Object.keys(filters).length > 0) {
      // Process all filters to ensure proper format
      const processedFilters = { ...filters };
      
      // Handle specific filter types
      Object.entries(processedFilters).forEach(([field, filter]) => {
        // Process date fields
        if (field === 'week_start_date' && filter.type === 'discrete') {
          // Ensure dates are in proper format (YYYY-MM-DD)
          const processedValues = filter.values.map(dateStr => {
            // If already in ISO format, keep as is
            if (typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
              return dateStr;
            }
            
            // Try to parse and format the date
            try {
              const date = new Date(dateStr);
              return date.toISOString().split('T')[0]; // Get YYYY-MM-DD part
            } catch (e) {
              return dateStr; // Keep original if parsing fails
            }
          });
          
          processedFilters[field] = {
            ...filter,
            values: processedValues
          };
        }
        
        // Handle empty arrays - should remove the filter
        if (filter.type === 'discrete' && (!filter.values || filter.values.length === 0)) {
          delete processedFilters[field];
        }
        
        // Handle range filters with invalid values
        if (filter.type === 'range') {
          // Ensure min and max are numbers
          if (filter.min !== undefined && isNaN(Number(filter.min))) {
            processedFilters[field].min = 0;
          }
          if (filter.max !== undefined && isNaN(Number(filter.max))) {
            processedFilters[field].max = 9999999;
          }
          
          // If both min and max are undefined, remove the filter
          if (filter.min === undefined && filter.max === undefined) {
            delete processedFilters[field];
          }
        }
      });
      
      // Only add filters parameter if there are valid filters left
      if (Object.keys(processedFilters).length > 0) {
        url += `&filters=${encodeURIComponent(JSON.stringify(processedFilters))}`;
      }
    }
    
    // Add sort parameter if provided
    if (sort && sort.field) {
      url += `&sort=${encodeURIComponent(JSON.stringify(sort))}`;
    }
    
    // Make API request
    const token = localStorage.getItem('access_token');
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    throw error;
  }
};

/**
 * Fetch filter options for forecast data
 * @param {Object} filters - Filter criteria
 * @returns {Promise<object>}
 */
export const getForecastFilterOptions = async (filters = null) => {
  try {
    const token = localStorage.getItem('access_token');
    
    // Prepare query parameters
    const params = new URLSearchParams();
    
    // Add filters parameter if provided
    if (filters) {
      params.append('filters', JSON.stringify(filters));
    }
    
    const response = await axios.get(`${API_URL}/core/forecast/filters`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: params
    });
    
    return response.data.filter_options;
  } catch (error) {
    console.error('Error fetching filter options:', error);
    throw error;
  }
};

/**
 * Fetch statistics for forecast data
 * @returns {Promise<object>}
 */
export const getForecastStats = async () => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.get(`${API_URL}/core/forecast/stats`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching forecast stats:', error);
    throw error;
  }
};

/**
 * Fetch forecast metrics comparing model vs baseline accuracy
 * @returns {Promise<object>} - Metrics data
 */
export const getForecastMetrics = async () => {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await axios.get(`${API_URL}/core/forecast/metrics`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching forecast metrics:', error);
    throw error;
  }
}; 