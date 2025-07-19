import React, { useState, useRef, useEffect } from 'react';
import { useAgent } from '@/context/AgentProvider';
import { useWorkspace } from '@/context/WorkspaceProvider';
import { agentService } from '@/services/agentService';
import { X, Send, Sparkles, User, Trash2, AlertCircle, CheckCircle, Wifi, WifiOff } from 'lucide-react';
import { IconButton } from '@/components/ui/icon-button';
import { ChartRenderer } from './ChartRenderer';
import { ContextChip } from './ContextChip';

// Add interface for message with context
interface MessageWithContext {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  contextItems?: Array<{
    id: string;
    title: string;
    type: 'code' | 'docs' | 'chat' | 'task' | 'forecast' | 'analytics' | 'store' | 'product' | 'inventory' | 'article' | 'timeline';
  }>;
}

export const AgentPanel: React.FC = () => {
  const { 
    isAgentPanelOpen, 
    closeAgentPanel, 
    messages, 
    addMessage, 
    isLoading, 
    setIsLoading,
    clearMessages,
    panelWidth,
    contextItems,
    addContextItem,
    removeContextItem,
    clearContextItems,
    dropZone,
    setDropZone
  } = useAgent();
  
  const { getTabData, getFileData } = useWorkspace();
  
  const [inputValue, setInputValue] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'error' | 'no-key' | 'checking'>('checking');
  const [lastError, setLastError] = useState<string | null>(null);
  const [messageContextMap, setMessageContextMap] = useState<Map<string, Array<{id: string; title: string; type: 'code' | 'docs' | 'chat' | 'task' | 'forecast' | 'analytics' | 'store' | 'product' | 'inventory' | 'article' | 'timeline'}>>>(new Map());
  const [nextMessageContext, setNextMessageContext] = useState<Array<{id: string; title: string; type: 'code' | 'docs' | 'chat' | 'task' | 'forecast' | 'analytics' | 'store' | 'product' | 'inventory' | 'article' | 'timeline'}> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isAgentPanelOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isAgentPanelOpen]);

  // Check connection on mount
  useEffect(() => {
    checkConnection();
  }, []);

  // Effect to handle storing context for new messages
  useEffect(() => {
    if (nextMessageContext && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'user') {
        setMessageContextMap(prev => new Map(prev.set(lastMessage.id, nextMessageContext)));
        setNextMessageContext(null);
      }
    }
  }, [messages, nextMessageContext]);

  const checkConnection = async () => {
    setConnectionStatus('checking');
    try {
      const isConnected = await agentService.testConnection();
      setConnectionStatus(isConnected ? 'connected' : 'no-key');
      setLastError(null);
    } catch (error) {
      setConnectionStatus('error');
      setLastError(error instanceof Error ? error.message : 'Connection failed');
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || connectionStatus !== 'connected') return;

    const userMessage = inputValue.trim();
    
    // Store current context items for this message
    const messageContextItems = [...contextItems];
    
    // Build detailed context from context items
    let contextString = '';
    if (contextItems.length > 0) {
      contextString = 'Context:\n';
      
      for (const item of contextItems) {
        contextString += `\n--- ${item.title} (${item.type}) ---\n`;
        
        // Try to get detailed tab data from workspace
        const tabData = getTabData(item.id);
        if (tabData) {
          contextString += `Type: ${tabData.type}\n`;
          contextString += `ID: ${tabData.id}\n`;
          contextString += `Title: ${tabData.title}\n`;
          
          // Add content-specific information based on type
          if (tabData.type === 'code') {
            // For code tabs, try to get file content
            try {
              const fileData = getFileData(item.id);
              if (fileData && fileData.content) {
                contextString += `Content:\n${fileData.content}\n`;
              }
            } catch (error) {
              contextString += `Content: [Unable to retrieve code content]\n`;
            }
          } else if (tabData.type === 'forecast') {
            contextString += `Content Type: Forecast Analysis\n`;
            contextString += `Description: Demand forecasting and trend analysis data\n`;
          } else if (tabData.type === 'analytics') {
            contextString += `Content Type: Analytics Dashboard\n`;
            contextString += `Description: Business metrics and performance analytics\n`;
          } else if (tabData.type === 'store') {
            contextString += `Content Type: Store Management\n`;
            contextString += `Description: Store location and configuration data\n`;
          } else if (tabData.type === 'product') {
            contextString += `Content Type: Product Management\n`;
            contextString += `Description: Product catalog and inventory information\n`;
          } else if (tabData.type === 'inventory') {
            contextString += `Content Type: Inventory Management\n`;
            contextString += `Description: Stock levels and order management data\n`;
          } else if (tabData.type === 'docs') {
            contextString += `Content Type: Documentation\n`;
            contextString += `Description: Project documentation and notes\n`;
          } else if (tabData.type === 'chat') {
            contextString += `Content Type: Chat/Communication\n`;
            contextString += `Description: Chat messages and conversations\n`;
          } else if (tabData.type === 'task') {
            contextString += `Content Type: Task Management\n`;
            contextString += `Description: Project tasks and progress tracking\n`;
          }
        } else {
          // Fallback for items without detailed tab data
          contextString += `Type: ${item.type}\n`;
          contextString += `ID: ${item.id}\n`;
          if (item.content) {
            contextString += `Content: ${item.content}\n`;
          }
        }
        
        contextString += '\n';
      }
      
      contextString += '---\n\n';
    }
    
    const fullMessage = contextString + userMessage;
    
    setInputValue('');
    
    // Set context for the next message that will be added
    if (messageContextItems.length > 0) {
      setNextMessageContext(messageContextItems);
    }
    
    // Add message
    addMessage(userMessage, 'user');
    
    setIsLoading(true);
    setLastError(null);

    try {
      // Build the full conversation history including the current message
      const conversationHistory = [
        // Include all previous messages
        ...messages.map(msg => ({
          content: msg.content,
          sender: msg.sender
        })),
        // Add the current message with full context
        { content: fullMessage, sender: 'user' as const }
      ];
      
      const response = await agentService.sendMessage(conversationHistory);
      addMessage(response.content, 'agent');
      
      // Handle tool calls if present
      if (response.toolCalls && response.toolCalls.length > 0) {
        const toolCallContent = JSON.stringify({ toolCalls: response.toolCalls });
        addMessage(toolCallContent, 'agent');
      }
    } catch (error) {
      setLastError(error instanceof Error ? error.message : 'Failed to send message');
      setConnectionStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDropZone('active');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only clear dropzone if we're leaving the panel entirely
    if (panelRef.current && !panelRef.current.contains(e.relatedTarget as Node)) {
      setDropZone(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDropZone(null);

    try {
      let dragData: string | null = null;
      
      // Try to get drag data from different formats
      if (e.dataTransfer.types.includes('application/json+tab-split')) {
        dragData = e.dataTransfer.getData('application/json+tab-split');
      } else if (e.dataTransfer.types.includes('application/json')) {
        dragData = e.dataTransfer.getData('application/json');
      } else if (e.dataTransfer.types.includes('text/plain')) {
        dragData = e.dataTransfer.getData('text/plain');
      }
      
      if (!dragData) return;

      // Try to parse as JSON first
      let parsedData: any = null;
      try {
        parsedData = JSON.parse(dragData);
      } catch {
        // If JSON parsing fails, treat as plain text (tab ID)
        parsedData = { id: dragData };
      }

      // Extract relevant information based on the data format
      let tabId: string | null = null;
      let tabTitle: string | null = null;
      let tabType: 'code' | 'docs' | 'chat' | 'task' | 'forecast' | 'analytics' | 'store' | 'product' | 'inventory' | 'article' | 'timeline' = 'docs';

      // Handle different drag data formats
      if (parsedData.fileId) {
        // Code tab format: { fileId, sourcePanelId }
        tabId = parsedData.fileId;
        tabType = 'code';
        tabTitle = tabId; // Use ID as title fallback
      } else if (parsedData.id && parsedData.contentType) {
        // Content tab format: { id, contentType, sourcePanelId }
        tabId = parsedData.id;
        tabTitle = parsedData.id;
        // Map contentType to our context type
        switch (parsedData.contentType) {
          case 'code': tabType = 'code'; break;
          case 'docs': tabType = 'docs'; break;
          case 'chat': tabType = 'chat'; break;
          case 'task': tabType = 'task'; break;
          case 'forecast': tabType = 'forecast'; break;
          case 'analytics': tabType = 'analytics'; break;
          case 'store': tabType = 'store'; break;
          case 'product': tabType = 'product'; break;
          case 'inventory': tabType = 'inventory'; break;
          default: tabType = 'docs';
        }
      } else if (parsedData.type === 'store') {
        // Store tree format: { id, type: 'store', level, name, context }
        tabId = parsedData.id;
        tabTitle = parsedData.name || parsedData.id;
        tabType = 'store';
      } else if (parsedData.type === 'product') {
        // Product tree format: { id, type: 'product', level, name, context }
        tabId = parsedData.id;
        tabTitle = parsedData.name || parsedData.id;
        tabType = 'product';
      } else if (parsedData.id) {
        // Generic format with just ID
        tabId = parsedData.id;
        tabTitle = parsedData.id;
        tabType = 'docs'; // Default type
      } else {
        // Plain string format
        tabId = dragData;
        tabTitle = dragData;
        tabType = 'docs';
      }

      // Try to get better tab data from workspace if available
      if (tabId) {
        const tabData = getTabData(tabId);
        if (tabData) {
          tabTitle = tabData.title;
          // Map ContentType to ContextItem type
          const contextType = tabData.type === 'organization' ? 'docs' : tabData.type;
          tabType = contextType as typeof tabType;
        }
        
        addContextItem({
          id: tabId,
          title: tabTitle || tabId,
          type: tabType,
        });
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  const getConnectionIndicator = () => {
    switch (connectionStatus) {
      case 'checking':
        return { icon: <Wifi size={12} className="animate-pulse" />, color: 'text-yellow-500', text: 'Checking...' };
      case 'connected':
        return { icon: <CheckCircle size={12} />, color: 'text-green-500', text: 'Connected' };
      case 'error':
        return { icon: <WifiOff size={12} />, color: 'text-red-500', text: 'Error' };
      case 'no-key':
        return { icon: <AlertCircle size={12} />, color: 'text-orange-500', text: 'No API Key' };
      default:
        return { icon: <WifiOff size={12} />, color: 'text-gray-500', text: 'Unknown' };
    }
  };

  const isToolCallMessage = (content: string) => {
    try {
      const parsed = JSON.parse(content);
      return parsed.toolCalls && Array.isArray(parsed.toolCalls);
    } catch {
      return false;
    }
  };

  if (!isAgentPanelOpen) return null;

  const connectionIndicator = getConnectionIndicator();

  return (
    <div
      className="h-full bg-[hsl(var(--panel-background))] border-l border-[hsl(var(--panel-border))] flex flex-col relative"
      style={{ width: `${panelWidth}px` }}
      ref={panelRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Dropzone overlay */}
      {dropZone === 'active' && (
        <div className="absolute inset-0 bg-blue-500/10 border-2 border-dashed border-blue-500 z-50 flex items-center justify-center">
          <div className="bg-blue-500/20 rounded-lg p-6 text-center">
            <div className="text-blue-600 dark:text-blue-400 text-lg font-medium mb-2">
              Drop content here
            </div>
            <div className="text-blue-600/70 dark:text-blue-400/70 text-sm">
              Add as context for the Business Intelligence Agent
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--panel-border-subtle))]">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-[hsl(var(--primary))] rounded-full flex items-center justify-center mr-3">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <h3 className="text-[hsl(var(--panel-foreground))] font-medium text-sm">Business Intelligence Agent</h3>
            <div className="flex items-center space-x-1">
              <span className="text-[hsl(var(--panel-muted-foreground))] text-xs">Retail Analytics Helper</span>
              <div className={`flex items-center space-x-1 ${connectionIndicator.color}`}>
                {connectionIndicator.icon}
                <span className="text-xs">{connectionIndicator.text}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {(messages.length > 0 || contextItems.length > 0) && (
            <IconButton
              variant="default"
              size="sm"
              onClick={() => {
                clearMessages();
                clearContextItems();
              }}
              className="text-[hsl(var(--panel-muted-foreground))] hover:text-[hsl(var(--panel-foreground))]"
              aria-label="Clear messages and context"
            >
              <Trash2 size={14} />
            </IconButton>
          )}
          <IconButton
            variant="default"
            size="sm"
            onClick={closeAgentPanel}
            className="text-[hsl(var(--panel-muted-foreground))] hover:text-[hsl(var(--panel-foreground))]"
            aria-label="Close agent panel"
          >
            <X size={14} />
          </IconButton>
        </div>
      </div>

      {/* Connection Error Banner */}
      {(connectionStatus === 'error' || connectionStatus === 'no-key') && (
        <div className="bg-red-50 border-b border-red-200 p-3">
          <div className="flex items-start space-x-2">
            <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
            <div className="text-red-700 text-xs">
              {connectionStatus === 'no-key' ? (
                <div>
                  <div className="font-medium">API Key Required</div>
                  <div className="mt-1">
                    Add your Claude API key to <code className="bg-red-100 px-1 rounded">.env.local</code>:
                    <br />
                    <code className="bg-red-100 px-1 rounded text-xs">VITE_CLAUDE_SECRET_KEY=your_key_here</code>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="font-medium">Connection Error</div>
                  <div className="mt-1">{lastError}</div>
                  <button
                    onClick={checkConnection}
                    className="text-red-600 underline hover:text-red-800 mt-1"
                  >
                    Try again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-[hsl(var(--panel-muted-foreground))] py-8">
            <Sparkles size={32} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">Hi! I'm your Business Intelligence Agent.</p>
            <p className="text-xs mt-1">Ask me anything about retail analytics, forecasting, or your data!</p>
            {connectionStatus === 'connected' && (
              <div className="text-xs mt-2 text-green-600">
                <p>✓ Ready to help you with retail insights and create charts</p>
                <p className="mt-1 text-[hsl(var(--panel-muted-foreground))]">
                  Try: "Show me sales by region" or "Create a forecast accuracy chart"
                </p>
              </div>
            )}
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={message.id}>
              {/* Regular message */}
              {!isToolCallMessage(message.content) && (
                <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-[hsl(var(--primary))] text-white'
                        : 'bg-[hsl(var(--panel-accent))] text-[hsl(var(--panel-accent-foreground))]'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.sender === 'agent' && (
                        <Sparkles size={14} className="mt-0.5 flex-shrink-0" />
                      )}
                      {message.sender === 'user' && (
                        <User size={14} className="mt-0.5 flex-shrink-0 text-white" />
                      )}
                      <div className="flex-1">
                        {/* Show context chips for user messages */}
                        {message.sender === 'user' && messageContextMap.has(message.id) && (
                          <div className="flex flex-wrap gap-0.5 mb-1.5">
                            {messageContextMap.get(message.id)?.map((item) => (
                              <div key={item.id} className="inline-flex items-center px-1 py-0.5 rounded text-xs bg-white/20 text-white border border-white/30">
                                <span className="truncate max-w-100 text-xs leading-none" style={{ fontSize: '10px' }}>{item.title}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="text-sm whitespace-pre-wrap break-words">
                          {message.content}
                        </div>
                      </div>
                    </div>
                    <div className={`text-xs mt-1 opacity-70 ${
                      message.sender === 'user' ? 'text-white' : 'text-[hsl(var(--panel-muted-foreground))]'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Tool call message (charts) */}
              {isToolCallMessage(message.content) && message.sender === 'agent' && (
                <div className="flex justify-start">
                  <div className="max-w-[95%] w-full">
                    {(() => {
                      try {
                        const parsed = JSON.parse(message.content);
                        return parsed.toolCalls.map((toolCall: any, index: number) => (
                          <ChartRenderer key={index} toolCall={toolCall} />
                        ));
                      } catch {
                        return null;
                      }
                    })()}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[hsl(var(--panel-accent))] text-[hsl(var(--panel-accent-foreground))] rounded-lg p-3 max-w-[80%]">
              <div className="flex items-center space-x-2">
                <Sparkles size={14} className="flex-shrink-0" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[hsl(var(--panel-border-subtle))]">
        {/* Context chips inline with input */}
        <div className="flex flex-wrap items-center gap-1 mb-2 min-h-[2rem]">
          {contextItems.map((item) => (
            <ContextChip
              key={item.id}
              id={item.id}
              title={item.title}
              type={item.type}
              onRemove={removeContextItem}
            />
          ))}
          {contextItems.length === 0 && (
            <div className="text-xs text-[hsl(var(--panel-muted-foreground))] py-1">
              Drop content tabs here to add context
            </div>
          )}
        </div>

        {/* Example Queries */}
        {connectionStatus === 'connected' && messages.length === 0 && (
          <div className="mb-3">
            <div className="text-xs text-[hsl(var(--panel-muted-foreground))] mb-2">Try these examples:</div>
            <div className="flex flex-wrap gap-1">
              {[
                "Show me sales by region",
                "Create a forecast accuracy chart",
                "Top 10 products by sales",
                "Store performance analysis",
                "Brand comparison chart"
              ].map((query, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInputValue(query);
                    inputRef.current?.focus();
                  }}
                  className="text-xs px-2 py-1 bg-[hsl(var(--panel-accent))] hover:bg-[hsl(var(--panel-border))] text-[hsl(var(--panel-muted-foreground))] rounded border border-[hsl(var(--panel-border-subtle))] transition-colors cursor-pointer"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              connectionStatus === 'connected' 
                ? "Ask me anything about your retail data..." 
                : connectionStatus === 'no-key'
                ? "API key required to chat..."
                : "Connection error - check settings..."
            }
            className="flex-1 bg-[hsl(var(--panel-input-background))] border border-[hsl(var(--panel-input-border))] rounded-md px-3 py-2 text-sm text-[hsl(var(--panel-foreground))] placeholder:text-[hsl(var(--panel-muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent"
            disabled={isLoading || connectionStatus !== 'connected'}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading || connectionStatus !== 'connected'}
            className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md px-3 py-2 flex items-center justify-center transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
        {lastError && (
          <div className="mt-2 text-xs text-red-500 flex items-center space-x-1">
            <AlertCircle size={12} />
            <span>{lastError}</span>
          </div>
        )}
      </div>
    </div>
  );
}; 