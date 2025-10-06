import axios, { AxiosInstance, AxiosResponse } from 'axios';
import monthWiseMockData from "../data/retailMock.json"

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

const FORECAST_BASE_URL = import.meta.env.VITE_RETAIL_API_BASE_URL || "http://localhost:8000/retail"

class ForecastRepository {
    private apiEndpoint: string;
    private project: string;
    private axiosInstance: AxiosInstance;

    constructor(apiEndpoint: string, project: string = '') {
        this.apiEndpoint = apiEndpoint;
        this.project = project;
        this.axiosInstance = axios.create({
            baseURL: apiEndpoint,
            timeout: 30000, // 30 seconds timeout
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }

    /**
     * Transform SQL query based on project
     * For Fashion & Lifestyle, replace 'forecast' table name with 'forecast_fnl'
     * @param {string} sqlQuery - Original SQL query
     * @returns {string} - Transformed SQL query
     */
    private transformSqlForProject(sqlQuery: string): string {
        if (this.project === 'Fashion & Lifestyle') {
            // Replace 'forecast' with 'forecast_fnl' only when it's an independent word
            // This regex matches 'forecast' when it's not surrounded by alphanumeric or underscore characters
            return sqlQuery.replace(/\bforecast\b/g, 'forecast_fnl');
        }
        return sqlQuery;
    }

    /**
     * Transform SQL query to use forecast_new table
     * This replaces 'forecast' with 'forecast_new' when specifically requested
     * @param {string} sqlQuery - Original SQL query
     * @returns {string} - Transformed SQL query
     */
    private transformSqlForForecastNew(sqlQuery: string): string {
        // Replace 'forecast' with 'forecast_new' only when it's an independent word
        // This regex matches 'forecast' when it's not surrounded by alphanumeric or underscore characters
        return sqlQuery.replace(/\bforecast\b/g, 'forecast_new');
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

            // Transform SQL query based on project
            const transformedQuery = this.transformSqlForProject(sql_query);

            // Make API call
            const response: AxiosResponse = await this.axiosInstance.get('/core/forecast-table-sql', {
                params: {
                    sql_query: transformedQuery
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

    async makeAPICall(data: any, stateSetters: StateSetters, type: string = "forecast"): Promise<any> {
        const { setLoading, setError, setData } = stateSetters;
        const URL = `${FORECAST_BASE_URL}/${type}`

        try {
            // Set loading state
            if (setLoading) setLoading(true);
            if (setError) setError(null);
            
            const response = await this.axiosInstance.post(URL, data);

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
     * Execute SQL query against forecast_new table (forecast variants)
     * @param {SqlQueryData} data - Contains sql_query string
     * @param {StateSetters} stateSetters - Contains setLoading, setError, setData methods
     * @returns {Promise<any>} - API response data
     */
    async executeForecastNewSqlQuery(data: SqlQueryData, stateSetters: StateSetters): Promise<any> {
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

            // Transform SQL query to use forecast_new table
            const transformedQuery = this.transformSqlForForecastNew(sql_query);

            // Make API call
            const response: AxiosResponse = await this.axiosInstance.get('/core/forecast-table-sql', {
                params: {
                    sql_query: transformedQuery
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


    async getMetadataFromAPI(data: MetadataData, stateSetters: StateSetters, type: string = "forecast-metadata"): Promise<any> {
        const { setLoading, setError, setData } = stateSetters;
        
        try {
            // Set loading state
            if (setLoading) setLoading(true);
            if (setError) setError(null);

            // Make API call
            const URL = `${FORECAST_BASE_URL}/${type}`
            const response: AxiosResponse = await this.axiosInstance.get(URL, {params: data});

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
