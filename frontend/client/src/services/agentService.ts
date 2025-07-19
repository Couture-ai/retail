import Anthropic from '@anthropic-ai/sdk';
import { ForecastRepository } from '@/repository/forecast_repository';

interface Message {
  content: string;
  sender: 'user' | 'agent';
}

interface ToolCall {
  type: 'show_chart';
  chart_type: 'bar' | 'table' | 'pie' | 'line' | 'text' | 'stacked_bar';
  sql_query: string;
  title?: string;
  description?: string;
  chart_config?: any;
}

interface AgentResponse {
  content: string;
  toolCalls?: ToolCall[];
}

class AgentService {
  private anthropic: Anthropic | null = null;
  private apiKey: string;
  private forecastRepo: ForecastRepository;
  private metadata: any = {
    "essential_columns": [
        "p1_dc",
        "format",
        "city",
        "state",
        "store_no",
        "pin_code",
        "region",
        "store_type",
        "segment_code",
        "brick_description",
        "brand",
        "segment",
        "brick_code",
        "division",
        "class_code",
        "article_id",
        "division_code",
        "vertical",
        "batchno",
        "family_code",
        "super_category",
        "article_description",
        "status",
        "consensus_qty",
        "forecast_qty",
        "month_year",
        "wom",
        "sd",
        "kvi",
        "npi",
        "sold_qty"
    ],
    "essential_columns_datatypes": {
        "p1_dc": "string",
        "format": "string",
        "city": "string",
        "state": "string",
        "store_no": "string",
        "pin_code": "string",
        "region": "string",
        "store_type": "string",
        "segment_code": "string",
        "brick_description": "string",
        "brand": "string",
        "segment": "string",
        "brick_code": "string",
        "division": "string",
        "class_code": "string",
        "article_id": "string",
        "division_code": "string",
        "vertical": "string",
        "batchno": "string",
        "family_code": "string",
        "super_category": "string",
        "article_description": "string",
        "status": "string",
        "consensus_qty": "float",
        "forecast_qty": "float",
        "month_year": "string",
        "wom": "integer",
        "sd": "string",
        "kvi": "string",
        "npi": "string",
        "sold_qty": "float"
    },
    "essential_columns_filtertypes": {
        "p1_dc": "discrete",
        "format": "discrete",
        "city": "discrete",
        "state": "discrete",
        "store_no": "discrete",
        "pin_code": "discrete",
        "region": "discrete",
        "store_type": "discrete",
        "segment_code": "discrete",
        "brick_description": "discrete",
        "brand": "discrete",
        "segment": "discrete",
        "brick_code": "discrete",
        "division": "discrete",
        "class_code": "discrete",
        "article_id": "discrete",
        "division_code": "discrete",
        "vertical": "discrete",
        "batchno": "discrete",
        "family_code": "discrete",
        "super_category": "discrete",
        "article_description": "discrete",
        "status": "discrete",
        "consensus_qty": "range",
        "forecast_qty": "range",
        "month_year": "discrete",
        "wom": "discrete",
        "sd": "discrete",
        "kvi": "discrete",
        "npi": "discrete",
        "sold_qty": "range"
    },
    "store_location_hierarchy": [
        "region",
        "state",
        "city",
        "pin_code",
        "store_no"
    ],
    "product_category_hierarchy": [
        "vertical",
        "super_category",
        "segment",
        "article_description",
        "article_id"
    ],
    "store_attributes": [
        "region",
        "state",
        "city",
        "pin_code",
        "p1_dc",
        "store_no",
        "store_type",
        "format"
    ],
    "product_attributes": [
        "super_category",
        "vertical",
        "division",
        "segment",
        "brick_description",
        "class_description",
        "brand",
        "article_description",
        "article_id",
        "segment_code",
        "brick_code",
        "class_code",
        "division_code",
        "family_code",
        "batchno",
        "kvi",
        "npi",
        "sd"
    ],
    "store_card_attributes": [
        "store_no",
        "city",
        "p1_dc"
    ],
    "product_card_attributes": [
        "article_description",
        "article_id",
        "brand"
    ]
};

  constructor() {
    this.apiKey = import.meta.env.VITE_CLAUDE_SECRET_KEY;
    this.forecastRepo = new ForecastRepository(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000');
    
    // Always try to load metadata regardless of API key status
    this.loadMetadata().catch(error => {
      console.warn('Initial metadata load failed, using fallback metadata:', error);
    });
    
    if (!this.apiKey) {
      console.group('🤖 Claude AI Agent Setup Required');
      console.log('The AI Agent requires a Claude API key to function.');
      console.log('');
      console.log('Steps to set up:');
      console.log('1. Get your API key from: https://console.anthropic.com/');
      console.log('2. Create a file called .env.local in the frontend/client directory');
      console.log('3. Add this line to the file:');
      console.log('   VITE_CLAUDE_SECRET_KEY=your_claude_api_key_here');
      console.log('4. Replace "your_claude_api_key_here" with your actual API key');
      console.log('5. Restart the development server');
      console.log('');
      console.log('The Business Intelligence Agent will show connection status in the panel.');
      console.groupEnd();
    } else {
      try {
        this.anthropic = new Anthropic({
          apiKey: this.apiKey,
          dangerouslyAllowBrowser: true, // Required for client-side usage
        });
        console.log('🤖 Claude AI Agent initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Anthropic client:', error);
      }
    }
  }

  private async loadMetadata() {
    try {
      console.log('📊 Loading forecast metadata...');
      const result = await this.forecastRepo.getMetadata({}, {
        setLoading: () => {},
        setError: () => {},
        setData: () => {}
      });
      
      // Merge API metadata with fallback metadata, prioritizing API data
      this.metadata = {
        ...this.metadata, // Keep fallback structure
        ...result // Override with API data if available
      };
      
      console.log('📊 Forecast metadata loaded successfully');
      console.log('📊 Available columns:', this.metadata?.essential_columns?.length || 0);
      console.log('📊 Store hierarchy levels:', this.metadata?.store_location_hierarchy?.length || 0);
      console.log('📊 Product hierarchy levels:', this.metadata?.product_category_hierarchy?.length || 0);
    } catch (error) {
      console.error('Failed to load forecast metadata from API, using fallback metadata:', error);
      // Don't throw here, continue with fallback metadata
    }
  }

  // Method to ensure metadata is loaded before sending messages
  private async ensureMetadata() {
    if (!this.metadata || !this.metadata.essential_columns) {
      console.log('📊 Metadata not properly loaded, attempting to load now...');
      await this.loadMetadata();
    }
  }

  private getSystemPrompt(): string {
    const metadataInfo = this.metadata ? `\
    MAKE SURE TO USE TOOL CALLS IF NEEDED

DATABASE SCHEMA AND METADATA:
Table Name: forecast

Available Columns (${this.metadata.essential_columns?.length || 0} total):
${this.metadata.essential_columns ? this.metadata.essential_columns.map((col: string) => {
  const dataType = this.metadata.essential_columns_datatypes?.[col] || 'unknown';
  const filterType = this.metadata.essential_columns_filtertypes?.[col] || 'unknown';
  return `- ${col} (${dataType}, ${filterType})`;
}).join('\n') : 'Loading...'}

Data Types Guide:
- string: Text values (use quotes in SQL)
- float: Decimal numbers (can be aggregated with SUM, AVG)
- integer: Whole numbers (can be aggregated with SUM, AVG, COUNT)

Filter Types Guide:
- discrete: Categorical values (use = or IN operators)
- range: Numeric values (use >, <, BETWEEN operators)

Store Location Hierarchy (from broad to specific):
${this.metadata.store_location_hierarchy ? this.metadata.store_location_hierarchy.join(' → ') : 'Loading...'}

Product Category Hierarchy (from broad to specific):
${this.metadata.product_category_hierarchy ? this.metadata.product_category_hierarchy.join(' → ') : 'Loading...'}

Key Store Attributes:
${this.metadata.store_attributes ? this.metadata.store_attributes.join(', ') : 'Loading...'}

Key Product Attributes:
${this.metadata.product_attributes ? this.metadata.product_attributes.join(', ') : 'Loading...'}

Important Columns for Analysis:
- store_no: Store identifier (string)
- article_id: Product identifier (string)
- forecast_qty: Predicted quantity (float)
- sold_qty: Actual sold quantity (float)
- consensus_qty: Consensus forecast quantity (float)
- month_year: Time period (string)
- region: Geographic region (string)
- super_category: Product category (string)
- brand: Product brand (string)
- article_description: Product description (string)
- city: Store city (string)
- state: Store state (string)

IMPORTANT SQL GUIDELINES:
- Always use the table name 'forecast'
- Filter out NULL values where appropriate using WHERE column IS NOT NULL
- Use appropriate aggregations (SUM, AVG, COUNT) based on data types
- Include meaningful WHERE clauses to filter data
- Limit results to reasonable amounts (typically 10-20 rows for charts)
- For time series, use month_year column
- For performance analysis, compare forecast_qty vs sold_qty vs consensus_qty
- VERY IMPORTANT: When rounding numbers, always cast them as numeric first (e.g., ROUND(CAST(column_name AS NUMERIC), 2))
- Use proper data type casting to avoid type conversion errors
- For string columns, use single quotes in WHERE clauses
- For numeric range filters, use BETWEEN, >, < operators
- For discrete filters, use = or IN operators
- ACCURACY FORMULA when none given: When calculating forecast accuracy, always use this formula: (1 - (SUM(ABS(sold_qty - forecast_qty))/SUM(sold_qty)))*100
- This accuracy formula represents the percentage accuracy by measuring how close forecasts are to actual sales
- Always include if sold_qty = 0, then accuracy = 0, if accuracy < 0, then accuracy = 0 in  clause when calculating accuracy` : '';

    return `You are a helpful Business Intelligence Agent for a retail analytics platform specialized in demand forecasting and inventory management.${metadataInfo}

You can help users with:
- Understanding retail data and forecasting metrics
- Analyzing sales trends and inventory patterns  
- Interpreting store performance and KPIs
- Product analytics and category performance insights
- Forecasting accuracy analysis and improvement recommendations
- Data visualization through charts and tables
- SQL query generation for custom analysis

VISUALIZATION CAPABILITY:
When users request data analysis, charts, or specific metrics, use the show_chart tool to execute SQL queries and display results as interactive visualizations.

Available chart types:
- 'bar': For categorical comparisons (sales by region, performance by store)
- 'line': For time series data (trends over time, monthly performance)
- 'pie': For proportional data (market share, category distribution)
- 'table': For detailed data display (top products, store details)
- 'text': For summary statistics and insights
- 'stacked_bar': For multi-dimensional categorical data with stacking (e.g., product categories within verticals, performance metrics by region and store type)

GUIDELINES:
- Always use the show_chart tool when users request data analysis, metrics, or visualizations
- Choose appropriate chart types based on the data being displayed
- Write efficient SQL queries that return meaningful insights
- Provide context and explanations along with the visualizations
- For complex requests, break them down into multiple targeted queries
- VERY IMPORTANT: When rounding numbers, always cast them as numeric first (e.g., ROUND(CAST(column_name AS NUMERIC), 2))
- For stacked_bar charts, use chart_config to specify the x-axis field (e.g., {"xaxis": "vertical"} when grouping by vertical)
- Stacked_bar charts work best with multi-dimensional categorical data where you want to show composition within categories
- For line charts, use chart_config to enable area fills (e.g., {"area": true} for area charts showing volume or cumulative data)
- Always include helpful titles and descriptions for charts
- Use the hierarchies (store location, product category) to provide meaningful drill-down analysis
- Leverage the different data types and filter types for appropriate query construction

Keep your responses concise and actionable. When discussing metrics, provide practical insights that can improve business operations.`;
  }

  async sendMessage(messages: Message[]): Promise<AgentResponse> {
    // This method now serves as a wrapper for backward compatibility
    return this.sendMessageWithProgressiveUpdates(messages);
  }

  async sendMessageWithProgressiveUpdates(
    messages: Message[], 
    onProgress?: (content: string, sender: 'user' | 'agent') => void
  ): Promise<AgentResponse> {
    if (!this.anthropic) {
      throw new Error('Claude API is not properly configured. Please check your API key.');
    }

    if (!this.apiKey) {
      throw new Error('Claude API key is not configured. Please set VITE_CLAUDE_SECRET_KEY in your environment.');
    }

    // Ensure metadata is loaded before proceeding
    await this.ensureMetadata();

    const maxRetries = 3;
    let currentMessages = [...messages];
    let attempt = 0;

    while (attempt < maxRetries) {
      attempt++;
      
      try {
        // Convert our message format to Anthropic's format
        // Include ALL messages in the conversation history for better context
        const anthropicMessages: Anthropic.Messages.MessageParam[] = currentMessages
          .filter(msg => msg.content.trim() !== '')
          .map(msg => ({
            role: msg.sender === 'agent' ? 'assistant' : 'user',
            content: msg.content
          }));

        // Ensure the conversation ends with a user message
        if (anthropicMessages.length === 0 || anthropicMessages[anthropicMessages.length - 1].role !== 'user') {
          throw new Error('Conversation must end with a user message');
        }

        console.log(`🤖 Sending ${anthropicMessages.length} messages to Claude API (attempt ${attempt})`);
        console.log('📝 Message history:', anthropicMessages.map(msg => {
          const contentPreview = typeof msg.content === 'string' 
            ? msg.content.substring(0, 100) 
            : '[Complex content]';
          return `${msg.role}: ${contentPreview}...`;
        }));

        const tools: Anthropic.Messages.Tool[] = [
          {
            name: 'show_chart',
            description: 'Execute SQL queries and display results as charts or tables. Use this for data analysis and visualization requests.',
            input_schema: {
              type: 'object',
              properties: {
                chart_type: {
                  type: 'string',
                  enum: ['bar', 'line', 'pie', 'table', 'text', 'stacked_bar'],
                  description: 'Type of visualization: bar (categorical), line (time series), pie (proportional), table (detailed data), text (summary), stacked_bar (multi-dimensional categorical with stacking)'
                },
                sql_query: {
                  type: 'string',
                  description: 'SQL query to execute against the forecast table'
                },
                title: {
                  type: 'string',
                  description: 'Title for the chart or table'
                },
                description: {
                  type: 'string',
                  description: 'Brief description of what the visualization shows'
                },
                chart_config: {
                  type: 'object',
                  description: 'Configuration object for chart display, e.g., {"xaxis": "vertical"} for specifying x-axis field in stacked bar charts, {"area": true} for area-filled line charts'
                }
              },
              required: ['chart_type', 'sql_query']
            }
          }
        ];

        const response = await this.anthropic.messages.create({
          model: 'claude-3-5-haiku-latest',
          max_tokens: 2000,
          messages: anthropicMessages,
          system: this.getSystemPrompt(),
          tools: tools,
          tool_choice: { type: 'auto' }
        });

        let content = '';
        const toolCalls: ToolCall[] = [];
        let hasToolExecutionError = false;
        let errorMessage = '';

        // Process response content and tool calls
        for (const block of response.content) {
          if (block.type === 'text') {
            content += block.text;
          } else if (block.type === 'tool_use') {
            if (block.name === 'show_chart') {
              const input = block.input as {
                chart_type: 'bar' | 'table' | 'pie' | 'line' | 'text' | 'stacked_bar';
                sql_query: string;
                title?: string;
                description?: string;
                chart_config?: any;
              };

              // Try to execute the SQL query
              try {
                const queryResult = await this.executeQuery(input.sql_query);
                toolCalls.push({
                  type: 'show_chart',
                  chart_type: input.chart_type,
                  sql_query: input.sql_query,
                  title: input.title,
                  description: input.description,
                  chart_config: input.chart_config
                });
              } catch (sqlError) {
                hasToolExecutionError = true;
                errorMessage = sqlError instanceof Error ? sqlError.message : 'Unknown SQL execution error';
                console.error('SQL execution error:', sqlError);
                
                // If this is not the last attempt, prepare for retry
                if (attempt < maxRetries) {
                  // Add agent response to conversation and UI (if callback provided)
                  const agentContent = content || 'I generated a query for you.';
                  currentMessages.push({
                    content: agentContent,
                    sender: 'agent'
                  });
                  if (onProgress) {
                    onProgress(agentContent, 'agent');
                  }

                  // Add error message to conversation and UI
                  const errorContent = `SQL Query Error: The following SQL query failed with error: "${errorMessage}"

Failed Query:
${input.sql_query}

Please analyze the error message and modify the SQL query to fix this issue. Common issues include:
- Column names that don't exist in the forecast table
- Syntax errors in SQL
- Data type mismatches
- Missing WHERE clauses for large datasets
- Incorrect aggregation functions

Try again with a corrected SQL query.`;
                  currentMessages.push({
                    content: errorContent,
                    sender: 'user'
                  });
                  console.log('🔄 Feeding error details to LLM for retry attempt', attempt, ':', errorContent);
                  if (onProgress) {
                    onProgress(errorContent, 'agent'); // Show as agent message for better UX
                  }
                  
                  break; // Break out of the block processing loop to retry
                } else {
                  // Last attempt, return error
                  throw new Error(`SQL execution failed after ${maxRetries} attempts: ${errorMessage}`);
                }
              }
            }
          }
        }

        // If there was a tool execution error and we're not on the last attempt, continue to retry
        if (hasToolExecutionError && attempt < maxRetries) {
          continue;
        }

        // Check if we have text content that might contain embedded tool calls
        if (content && toolCalls.length === 0) {
          const parsed = this.parseTextWithToolCalls(content);
          if (parsed.toolCalls.length > 0) {
            // We found embedded tool calls in the text, process them
            for (const toolCall of parsed.toolCalls) {
              try {
                const queryResult = await this.executeQuery(toolCall.sql_query);
                toolCalls.push(toolCall);
              } catch (sqlError) {
                hasToolExecutionError = true;
                errorMessage = sqlError instanceof Error ? sqlError.message : 'Unknown SQL execution error';
                console.error('SQL execution error:', sqlError);
                
                // If this is not the last attempt, prepare for retry
                if (attempt < maxRetries) {
                  // Add agent response to conversation and UI (if callback provided)
                  const agentContent = parsed.textParts.join('\n\n').trim() || 'I generated a query for you.';
                  currentMessages.push({
                    content: agentContent,
                    sender: 'agent'
                  });
                  if (onProgress) {
                    onProgress(agentContent, 'agent');
                  }

                  // Add error message to conversation and UI
                  const errorContent = `SQL Query Error: The following SQL query failed with error: "${errorMessage}"

Failed Query:
${toolCall.sql_query}

Please analyze the error message and modify the SQL query to fix this issue. Common issues include:
- Column names that don't exist in the forecast table
- Syntax errors in SQL
- Data type mismatches
- Missing WHERE clauses for large datasets
- Incorrect aggregation functions

Try again with a corrected SQL query.`;
                  currentMessages.push({
                    content: errorContent,
                    sender: 'user'
                  });
                  console.log('🔄 Feeding error details to LLM for retry attempt', attempt, ':', errorContent);
                  if (onProgress) {
                    onProgress(errorContent, 'agent'); // Show as agent message for better UX
                  }
                  
                  break; // Break out of the tool call processing loop to retry
                } else {
                  // Last attempt, return error
                  throw new Error(`SQL execution failed after ${maxRetries} attempts: ${errorMessage}`);
                }
              }
            }
            
            // If there was a tool execution error and we're not on the last attempt, continue to retry
            if (hasToolExecutionError && attempt < maxRetries) {
              continue;
            }
            
            // Update content to only include text parts (without the JSON)
            content = parsed.textParts.join('\n\n').trim();
          }
        }

        // If we reach here, either there was no error or we successfully executed
        return {
          content: content || 'I generated a visualization for you based on your request.',
          toolCalls: toolCalls.length > 0 ? toolCalls : undefined
        };

      } catch (error) {
        // If this is the last attempt or it's not a tool execution error, throw
        if (attempt >= maxRetries || !(error instanceof Error && error.message.includes('SQL execution failed'))) {
          console.error('Error calling Claude API:', error);
          
          // Provide more specific error messages
          if (error instanceof Error) {
            if (error.message.includes('API key')) {
              throw new Error('Invalid API key. Please check your VITE_CLAUDE_SECRET_KEY environment variable.');
            } else if (error.message.includes('rate limit') || error.message.includes('429')) {
              throw new Error('Rate limit exceeded. Please wait a moment before sending another message.');
            } else if (error.message.includes('insufficient credit') || error.message.includes('402')) {
              throw new Error('Insufficient API credits. Please check your Anthropic account billing.');
            } else if (error.message.includes('network') || error.message.includes('fetch')) {
              throw new Error('Network error. Please check your internet connection and try again.');
            } else {
              throw error;
            }
          } else {
            throw new Error('An unknown error occurred while calling the Claude API');
          }
        }
        
        // For SQL execution errors, we've already set up the retry mechanism above
        throw error;
      }
    }

    // This should never be reached, but just in case
    throw new Error(`Failed to complete request after ${maxRetries} attempts`);
  }

  // Execute SQL query and return formatted data for charts
  async executeQuery(sqlQuery: string): Promise<any> {
    try {
      const result = await this.forecastRepo.executeSqlQuery({ sql_query: sqlQuery }, {
        setLoading: () => {},
        setError: () => {},
        setData: () => {}
      });
      
      return result?.data || [];
    } catch (error) {
      console.error('Error executing SQL query:', error);
      
      // Extract detailed error message from API response
      let detailedError = 'Unknown error';
      if (error && typeof error === 'object') {
        const apiError = error as any;
        // Try to get the most detailed error message available
        if (apiError.response?.data?.detail) {
          detailedError = apiError.response.data.detail;
        } else if (apiError.message) {
          detailedError = apiError.message;
        } else if (apiError.toString && typeof apiError.toString === 'function') {
          detailedError = apiError.toString();
        }
      } else if (typeof error === 'string') {
        detailedError = error;
      }
      
      // Preserve the original detailed error for the LLM to learn from
      throw new Error(detailedError);
    }
  }

  // Test connection method
  async testConnection(): Promise<boolean> {
    if (!this.anthropic) {
      return false;
    }

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-haiku-latest',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Hello' }],
        system: 'Respond with just "Hi"'
      });
      
      return response.content.length > 0;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  // Parse mixed text response that might contain embedded JSON tool calls
  private parseTextWithToolCalls(content: string): { textParts: string[], toolCalls: ToolCall[] } {
    const toolCalls: ToolCall[] = [];
    const textParts: string[] = [];
    
    console.log('🔍 Parsing mixed content for embedded tool calls...');
    console.log('📄 Raw content sample:', content.substring(0, 300));
    
    // First, handle escaped newlines and other common escape sequences in the content
    // This is important when content comes from JSON-encoded responses
    let processedContent = content;
    
    // Look for the start pattern {"toolCalls":
    const startPattern = '{"toolCalls":';
    let searchIndex = 0;
    
    while (true) {
      const startIndex = processedContent.indexOf(startPattern, searchIndex);
      if (startIndex === -1) {
        // No more tool calls found, add remaining text
        const remainingText = processedContent.substring(searchIndex).trim();
        if (remainingText) {
          textParts.push(remainingText);
          console.log('📝 Added final text part:', remainingText.substring(0, 100) + '...');
        }
        break;
      }
      
      // Add text before the JSON
      if (startIndex > searchIndex) {
        const textBefore = processedContent.substring(searchIndex, startIndex).trim();
        if (textBefore) {
          textParts.push(textBefore);
          console.log('📝 Added text part before JSON:', textBefore.substring(0, 100) + '...');
        }
      }
      
      // Find the complete JSON object by counting braces
      let braceCount = 0;
      let inString = false;
      let escapeNext = false;
      let jsonEnd = startIndex;
      
      for (let i = startIndex; i < processedContent.length; i++) {
        const char = processedContent[i];
        
        if (escapeNext) {
          escapeNext = false;
          continue;
        }
        
        if (char === '\\') {
          escapeNext = true;
          continue;
        }
        
        if (char === '"') {
          inString = !inString;
          continue;
        }
        
        if (!inString) {
          if (char === '{') {
            braceCount++;
          } else if (char === '}') {
            braceCount--;
            if (braceCount === 0) {
              jsonEnd = i + 1;
              break;
            }
          }
        }
      }
      
      // Extract and parse the JSON
      const jsonString = processedContent.substring(startIndex, jsonEnd);
      console.log('📍 Found JSON structure:', jsonString.substring(0, 200) + '...');
      
      try {
        // Parse the JSON and handle any escaped characters within it
        const jsonObj = JSON.parse(jsonString);
        console.log('✅ Successfully parsed JSON');
        
        if (jsonObj.toolCalls && Array.isArray(jsonObj.toolCalls)) {
          jsonObj.toolCalls.forEach((toolCall: any) => {
            if (toolCall.type === 'show_chart') {
              // Clean up any escaped newlines in the SQL query
              let cleanedSqlQuery = toolCall.sql_query;
              if (typeof cleanedSqlQuery === 'string') {
                // Replace escaped newlines with actual newlines for better readability
                cleanedSqlQuery = cleanedSqlQuery.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
              }
              
              toolCalls.push({
                type: 'show_chart',
                chart_type: toolCall.chart_type,
                sql_query: cleanedSqlQuery,
                title: toolCall.title,
                description: toolCall.description,
                chart_config: toolCall.chart_config
              });
              console.log('🔧 Added tool call:', toolCall.title || 'Untitled');
              console.log('🔍 SQL Query preview:', cleanedSqlQuery.substring(0, 150) + '...');
            }
          });
        }
        
        searchIndex = jsonEnd;
      } catch (error) {
        console.warn('❌ Failed to parse JSON:', error);
        console.warn('📄 Raw JSON string:', jsonString);
        // Skip this potential JSON and continue searching
        searchIndex = startIndex + startPattern.length;
      }
    }
    
    // If no tool calls were found, return the original content as a single text part
    if (toolCalls.length === 0) {
      console.log('🚫 No tool calls found, returning original content as text');
      return { textParts: [content], toolCalls: [] };
    }
    
    console.log('✅ Parsing complete:', { textParts: textParts.length, toolCalls: toolCalls.length });
    return { textParts, toolCalls };
  }

  // Test method to demonstrate mixed content parsing (can be removed in production)
  testMixedContentParsing(): void {
    const testContent = `I'll create an area chart showing sales trends over time:\n\n{"toolCalls":[{"type":"show_chart","chart_type":"line","sql_query":"SELECT \n    month_year,\n    SUM(sold_qty) AS total_sales\nFROM forecast\nWHERE \n    month_year IS NOT NULL \n    AND sold_qty > 0\nGROUP BY month_year\nORDER BY month_year","title":"Sales Trends Over Time (Area Chart)","description":"Area chart showing total sales volume trends by month","chart_config":{"area":true}}]}\n\nThis area chart will show sales volume trends over time with a filled area to emphasize the cumulative nature of the data.`;

    console.log('🧪 Testing mixed content parsing with area chart configuration...');
    const result = this.parseTextWithToolCalls(testContent);
    console.log('🧪 Test result:', {
      textParts: result.textParts.length,
      toolCalls: result.toolCalls.length,
      chartType: result.toolCalls[0]?.chart_type,
      chartConfig: result.toolCalls[0]?.chart_config,
      toolCall: result.toolCalls[0]?.title,
      sqlQueryStart: result.toolCalls[0]?.sql_query?.substring(0, 100)
    });
  }
}

export const agentService = new AgentService(); 