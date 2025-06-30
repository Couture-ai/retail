import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Define interfaces for better type safety
interface StateSetters {
    setLoading?: (loading: boolean) => void;
    setError?: (error: string | null) => void;
    setData?: (data: any) => void;
}

interface SqlQueryData {
    sql_query: string;
}

interface MetadataData {
    // Empty interface as metadata endpoint doesn't need input data
}

interface ApiError {
    response?: {
        data?: {
            detail?: string;
        };
    };
    message?: string;
}

class ForecastRepository {
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
     * Execute SQL query against forecast table
     * @param {SqlQueryData} data - Contains sql_query string
     * @param {StateSetters} stateSetters - Contains setLoading, setError, setData methods
     * @returns {Promise<any>} - API response data
     */
    async executeSqlQuery(data: SqlQueryData, stateSetters: StateSetters): Promise<any> {
        const { setLoading, setError, setData } = stateSetters;
        
        try {
            // Set loading state
            if (setLoading) setLoading(true);
            if (setError) setError(null);

            // Extract sql_query from data
            const { sql_query } = data;
            
            if (!sql_query) {
                throw new Error('SQL query is required');
            }

            // Make API call
            const response: AxiosResponse = await this.axiosInstance.get('/core/forecast-table-sql', {
                params: {
                    sql_query: sql_query
                }
            });

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
     * Get forecast metadata including column names and hierarchies
     * @param {MetadataData} data - Empty object (no data needed for metadata)
     * @param {StateSetters} stateSetters - Contains setLoading, setError, setData methods
     * @returns {Promise<any>} - API response data
     */
    async getMetadata(data: MetadataData, stateSetters: StateSetters): Promise<any> {
        const { setLoading, setError, setData } = stateSetters;
        
        try {
            // Set loading state
            if (setLoading) setLoading(true);
            if (setError) setError(null);

            // Make API call
            const response: AxiosResponse = await this.axiosInstance.get('/core/forecast-metadata');

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
}

// Export both named and default exports for compatibility
export { ForecastRepository };
export default ForecastRepository;
