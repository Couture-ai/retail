import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Define interfaces for better type safety
interface StateSetters {
    setLoading?: (loading: boolean) => void;
    setError?: (error: string | null) => void;
    setData?: (data: any) => void;
}

interface AnalyticsPageConfiguration {
    id?: number;
    page_name: string;
    attributes?: Record<string, any>;
    page_config?: Record<string, any>;
}

interface CreateAnalyticsPageData {
    page_name: string;
    attributes?: Record<string, any>;
    page_config?: Record<string, any>;
}

interface UpdateAnalyticsPageData {
    page_name?: string;
    attributes?: Record<string, any>;
    page_config?: Record<string, any>;
}

interface ApiError {
    response?: {
        data?: {
            detail?: string;
        };
    };
    message?: string;
}

class AnalyticsRepository {
    private apiEndpoint: string;
    private axiosInstance: AxiosInstance;

    constructor(apiEndpoint: string) {
        this.apiEndpoint = apiEndpoint;
        this.axiosInstance = axios.create({
            baseURL: apiEndpoint,
            timeout: 30000, // 30 seconds timeout
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }

    /**
     * Get all analytics page configurations
     * @param {StateSetters} stateSetters - Contains setLoading, setError, setData methods
     * @returns {Promise<AnalyticsPageConfiguration[]>} - Array of analytics page configurations
     */
    async getAllAnalyticsPages(stateSetters: StateSetters): Promise<AnalyticsPageConfiguration[]> {
        const { setLoading, setError, setData } = stateSetters;
        
        try {
            // Set loading state
            if (setLoading) setLoading(true);
            if (setError) setError(null);

            // Make API call
            const response: AxiosResponse<AnalyticsPageConfiguration[]> = await this.axiosInstance.get('/core/analytics-pages');

            // Set success data
            if (setData) setData(response.data);
            
            return response.data;

        } catch (error) {
            // Handle errors
            const apiError = error as ApiError;
            const errorMessage = apiError.response?.data?.detail || apiError.message || 'An error occurred';
            
            if (setError) setError(errorMessage);
            if (setData) setData([]);
            
            throw error;
        } finally {
            // Clear loading state
            if (setLoading) setLoading(false);
        }
    }

    /**
     * Get analytics page configuration by ID
     * @param {number} pageId - The ID of the page to retrieve
     * @param {StateSetters} stateSetters - Contains setLoading, setError, setData methods
     * @returns {Promise<AnalyticsPageConfiguration>} - The analytics page configuration
     */
    async getAnalyticsPageById(pageId: number, stateSetters: StateSetters): Promise<AnalyticsPageConfiguration> {
        const { setLoading, setError, setData } = stateSetters;
        
        try {
            // Set loading state
            if (setLoading) setLoading(true);
            if (setError) setError(null);

            // Make API call
            const response: AxiosResponse<AnalyticsPageConfiguration> = await this.axiosInstance.get(`/core/analytics-pages/${pageId}`);

            // Set success data
            if (setData) setData(response.data);
            
            return response.data;

        } catch (error) {
            // Handle errors
            const apiError = error as ApiError;
            const errorMessage = apiError.response?.data?.detail || apiError.message || 'An error occurred';
            
            if (setError) setError(errorMessage);
            if (setData) setData(null);
            
            throw error;
        } finally {
            // Clear loading state
            if (setLoading) setLoading(false);
        }
    }

    /**
     * Get analytics page configuration by name
     * @param {string} pageName - The name of the page to retrieve
     * @param {StateSetters} stateSetters - Contains setLoading, setError, setData methods
     * @returns {Promise<AnalyticsPageConfiguration>} - The analytics page configuration
     */
    async getAnalyticsPageByName(pageName: string, stateSetters: StateSetters): Promise<AnalyticsPageConfiguration> {
        const { setLoading, setError, setData } = stateSetters;
        
        try {
            // Set loading state
            if (setLoading) setLoading(true);
            if (setError) setError(null);

            // Make API call
            const response: AxiosResponse<AnalyticsPageConfiguration> = await this.axiosInstance.get(`/core/analytics-pages/name/${encodeURIComponent(pageName)}`);

            // Set success data
            if (setData) setData(response.data);
            
            return response.data;

        } catch (error) {
            // Handle errors
            const apiError = error as ApiError;
            const errorMessage = apiError.response?.data?.detail || apiError.message || 'An error occurred';
            
            if (setError) setError(errorMessage);
            if (setData) setData(null);
            
            throw error;
        } finally {
            // Clear loading state
            if (setLoading) setLoading(false);
        }
    }

    /**
     * Create a new analytics page configuration
     * @param {CreateAnalyticsPageData} data - The data for creating the page
     * @param {StateSetters} stateSetters - Contains setLoading, setError, setData methods
     * @returns {Promise<AnalyticsPageConfiguration>} - The created analytics page configuration
     */
    async createAnalyticsPage(data: CreateAnalyticsPageData, stateSetters: StateSetters): Promise<AnalyticsPageConfiguration> {
        const { setLoading, setError, setData } = stateSetters;
        
        try {
            // Set loading state
            if (setLoading) setLoading(true);
            if (setError) setError(null);

            if (!data.page_name) {
                throw new Error('Page name is required');
            }

            // Make API call
            const response: AxiosResponse<AnalyticsPageConfiguration> = await this.axiosInstance.post('/core/analytics-pages', data);

            // Set success data
            if (setData) setData(response.data);
            
            return response.data;

        } catch (error) {
            // Handle errors
            const apiError = error as ApiError;
            const errorMessage = apiError.response?.data?.detail || apiError.message || 'An error occurred';
            
            if (setError) setError(errorMessage);
            if (setData) setData(null);
            
            throw error;
        } finally {
            // Clear loading state
            if (setLoading) setLoading(false);
        }
    }

    /**
     * Update an existing analytics page configuration
     * @param {number} pageId - The ID of the page to update
     * @param {UpdateAnalyticsPageData} data - The data for updating the page
     * @param {StateSetters} stateSetters - Contains setLoading, setError, setData methods
     * @returns {Promise<AnalyticsPageConfiguration>} - The updated analytics page configuration
     */
    async updateAnalyticsPage(pageId: number, data: UpdateAnalyticsPageData, stateSetters: StateSetters): Promise<AnalyticsPageConfiguration> {
        const { setLoading, setError, setData } = stateSetters;
        
        try {
            // Set loading state
            if (setLoading) setLoading(true);
            if (setError) setError(null);

            // Make API call
            const response: AxiosResponse<AnalyticsPageConfiguration> = await this.axiosInstance.put(`/core/analytics-pages/${pageId}`, data);

            // Set success data
            if (setData) setData(response.data);
            
            return response.data;

        } catch (error) {
            // Handle errors
            const apiError = error as ApiError;
            const errorMessage = apiError.response?.data?.detail || apiError.message || 'An error occurred';
            
            if (setError) setError(errorMessage);
            if (setData) setData(null);
            
            throw error;
        } finally {
            // Clear loading state
            if (setLoading) setLoading(false);
        }
    }

    /**
     * Delete an analytics page configuration
     * @param {number} pageId - The ID of the page to delete
     * @param {StateSetters} stateSetters - Contains setLoading, setError, setData methods
     * @returns {Promise<{message: string}>} - Success message
     */
    async deleteAnalyticsPage(pageId: number, stateSetters: StateSetters): Promise<{message: string}> {
        const { setLoading, setError, setData } = stateSetters;
        
        try {
            // Set loading state
            if (setLoading) setLoading(true);
            if (setError) setError(null);

            // Make API call
            const response: AxiosResponse<{message: string}> = await this.axiosInstance.delete(`/core/analytics-pages/${pageId}`);

            // Set success data
            if (setData) setData(response.data);
            
            return response.data;

        } catch (error) {
            // Handle errors
            const apiError = error as ApiError;
            const errorMessage = apiError.response?.data?.detail || apiError.message || 'An error occurred';
            
            if (setError) setError(errorMessage);
            if (setData) setData(null);
            
            throw error;
        } finally {
            // Clear loading state
            if (setLoading) setLoading(false);
        }
    }

    /**
     * Save grid configuration for a specific page
     * @param {string} pageName - The name of the page
     * @param {Record<string, any>} gridConfig - The grid configuration to save
     * @param {StateSetters} stateSetters - Contains setLoading, setError, setData methods
     * @returns {Promise<AnalyticsPageConfiguration>} - The updated analytics page configuration
     */
    async saveGridConfig(pageName: string, gridConfig: Record<string, any>, stateSetters: StateSetters): Promise<AnalyticsPageConfiguration> {
        const { setLoading, setError, setData } = stateSetters;
        
        try {
            // First, try to get the existing page
            let existingPage: AnalyticsPageConfiguration | null = null;
            try {
                existingPage = await this.getAnalyticsPageByName(pageName, { setLoading: () => {}, setError: () => {}, setData: () => {} });
            } catch (error) {
                // Page doesn't exist, we'll create it
            }

            if (existingPage && existingPage.id) {
                // Update existing page
                return await this.updateAnalyticsPage(existingPage.id, {
                    page_config: gridConfig
                }, stateSetters);
            } else {
                // Create new page
                return await this.createAnalyticsPage({
                    page_name: pageName,
                    attributes: {},
                    page_config: gridConfig
                }, stateSetters);
            }

        } catch (error) {
            // Handle errors
            const apiError = error as ApiError;
            const errorMessage = apiError.response?.data?.detail || apiError.message || 'An error occurred';
            
            if (setError) setError(errorMessage);
            if (setData) setData(null);
            
            throw error;
        }
    }

    /**
     * Load grid configuration for a specific page
     * @param {string} pageName - The name of the page
     * @param {StateSetters} stateSetters - Contains setLoading, setError, setData methods
     * @returns {Promise<Record<string, any> | null>} - The grid configuration or null if not found
     */
    async loadGridConfig(pageName: string, stateSetters: StateSetters): Promise<Record<string, any> | null> {
        try {
            const page = await this.getAnalyticsPageByName(pageName, {
                setLoading: stateSetters.setLoading,
                setError: () => {}, // Don't show error for missing page
                setData: () => {}
            });
            
            return page.page_config || null;
        } catch (error) {
            // Page doesn't exist, return null
            return null;
        }
    }
}

// Export both named and default exports for compatibility
export { AnalyticsRepository };
export default AnalyticsRepository;
