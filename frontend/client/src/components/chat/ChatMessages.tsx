import { useEffect, useRef, useState } from "react";
import { Message } from "@/types";
import { formatDate } from "@/lib/utils";
import { 
  Bot, 
  MessageSquareText, 
  Code, 
  Search, 
  FileText, 
  Play, 
  StopCircle, 
  Terminal,
  Database,
  Globe,
  RefreshCw,
  FileEdit,
  ExternalLink,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type ChatMessagesProps = {
  messages: Message[];
};

type GenerationType = "code" | "search" | "file" | "database" | "api";

type GenerationStep = {
  id: string;
  text: string;
  type: 'thinking' | 'output' | 'action';
  status: 'completed' | 'in-progress' | 'pending';
  icon?: React.ReactNode;
};

const ChatMessages = ({ messages }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [generationType, setGenerationType] = useState<GenerationType>("code");
  const [steps, setSteps] = useState<GenerationStep[]>([]);
  const [isStopped, setIsStopped] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Generate unique ID
  const generateId = () => Math.random().toString(36).substring(2, 9);
  
  // Generate steps based on generation type
  const generateSteps = (type: GenerationType): GenerationStep[] => {
    switch (type) {
      case "code":
        return [
          {
            id: generateId(),
            text: "Analyzing code requirements",
            type: "thinking",
            status: "completed",
            icon: <Terminal size={14} className="text-green-400" />
          },
          {
            id: generateId(),
            text: "Designing solution approach",
            type: "thinking",
            status: "in-progress",
            icon: <Code size={14} className="text-blue-400" />
          },
          {
            id: generateId(),
            text: "Implementing solution",
            type: "thinking",
            status: "pending",
            icon: <Terminal size={14} className="text-blue-400" />
          },
          {
            id: generateId(),
            text: "function processUserData(input) {\n  // Analyzing user request\n  const result = input.map(item => {\n    return transformData(item);\n  });\n  return result;\n}",
            type: "output",
            status: "pending"
          },
          {
            id: generateId(),
            text: "Run code",
            type: "action",
            status: "pending",
            icon: <Play size={14} className="text-green-500" />
          }
        ];
      case "search":
        return [
          {
            id: generateId(),
            text: "Formulating search query",
            type: "thinking",
            status: "completed",
            icon: <Search size={14} className="text-green-400" />
          },
          {
            id: generateId(),
            text: "Searching web resources",
            type: "thinking",
            status: "in-progress",
            icon: <Globe size={14} className="text-blue-400" />
          },
          {
            id: generateId(),
            text: "Analyzing search results",
            type: "thinking",
            status: "pending",
            icon: <RefreshCw size={14} className="text-blue-400" />
          },
          {
            id: generateId(),
            text: "Searching for: 'latest web development frameworks'\nFound results:\n1. Next.js 14.0 - Full-stack React framework\n2. SvelteKit 2.0 - Svelte meta-framework\n3. Remix 2.0 - React-based framework with nested routing",
            type: "output",
            status: "pending"
          },
          {
            id: generateId(),
            text: "View source",
            type: "action",
            status: "pending",
            icon: <ExternalLink size={14} className="text-blue-500" />
          }
        ];
      case "file":
        return [
          {
            id: generateId(),
            text: "Analyzing file requirements",
            type: "thinking",
            status: "completed",
            icon: <FileText size={14} className="text-green-400" />
          },
          {
            id: generateId(),
            text: "Preparing file content",
            type: "thinking",
            status: "in-progress",
            icon: <FileEdit size={14} className="text-blue-400" />
          },
          {
            id: generateId(),
            text: "Formatting document",
            type: "thinking",
            status: "pending",
            icon: <FileText size={14} className="text-blue-400" />
          },
          {
            id: generateId(),
            text: "# Project Architecture\n\n## Microservices Implementation\n\n* User Service\n* Payment Service\n* Notification Service\n\n## Deployment Strategy\n\n* Docker containerization\n* Kubernetes orchestration",
            type: "output",
            status: "pending"
          },
          {
            id: generateId(),
            text: "Save to project-architecture.md",
            type: "action",
            status: "pending",
            icon: <ArrowRight size={14} className="text-green-500" />
          }
        ];
      case "database":
        return [
          {
            id: generateId(),
            text: "Analyzing database schema",
            type: "thinking",
            status: "completed",
            icon: <Database size={14} className="text-green-400" />
          },
          {
            id: generateId(),
            text: "Generating SQL query",
            type: "thinking",
            status: "in-progress",
            icon: <Code size={14} className="text-blue-400" />
          },
          {
            id: generateId(),
            text: "Optimizing query performance",
            type: "thinking",
            status: "pending",
            icon: <RefreshCw size={14} className="text-blue-400" />
          },
          {
            id: generateId(),
            text: "SELECT u.name, COUNT(o.id) as order_count\nFROM users u\nJOIN orders o ON u.id = o.user_id\nGROUP BY u.id\nHAVING COUNT(o.id) > 5\nORDER BY order_count DESC;",
            type: "output",
            status: "pending"
          },
          {
            id: generateId(),
            text: "Execute query",
            type: "action",
            status: "pending",
            icon: <Play size={14} className="text-green-500" />
          }
        ];
      case "api":
        return [
          {
            id: generateId(),
            text: "Analyzing API requirements",
            type: "thinking",
            status: "completed",
            icon: <Globe size={14} className="text-green-400" />
          },
          {
            id: generateId(),
            text: "Preparing API request",
            type: "thinking",
            status: "in-progress",
            icon: <Code size={14} className="text-blue-400" />
          },
          {
            id: generateId(),
            text: "Setting up authentication",
            type: "thinking",
            status: "pending",
            icon: <RefreshCw size={14} className="text-blue-400" />
          },
          {
            id: generateId(),
            text: "fetch('https://api.example.com/data', {\n  method: 'POST',\n  headers: {\n    'Content-Type': 'application/json',\n    'Authorization': 'Bearer ${apiKey}'\n  },\n  body: JSON.stringify({\n    query: 'user data',\n    limit: 10\n  })\n})",
            type: "output",
            status: "pending"
          },
          {
            id: generateId(),
            text: "Test API call",
            type: "action",
            status: "pending",
            icon: <Play size={14} className="text-green-500" />
          }
        ];
      default:
        return [];
    }
  };
  
  // Auto-generate content based on message content
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Determine which type of generation to show
    const types: GenerationType[] = ["code", "search", "file", "database", "api"];
    const randomType = types[Math.floor(Math.random() * types.length)];
    setGenerationType(randomType);
    
    // Generate steps for this type
    const generationSteps = generateSteps(randomType);
    setSteps(generationSteps);
    
    // Reset generation state
    setIsGenerating(true);
    setIsStopped(false);
    setGenerationProgress(0);
    
    // Start auto-progression of steps
    let progress = 0;
    intervalRef.current = setInterval(() => {
      if (progress < 100) {
        progress += 5;
        setGenerationProgress(progress);
        
        // Update step statuses based on progress
        const updatedSteps = [...generationSteps].map((step, index) => {
          if (index === 0) return { ...step, status: 'completed' as const };
          if (index === 1 && progress >= 20) return { ...step, status: 'completed' as const };
          if (index === 2 && progress >= 40) return { ...step, status: 'completed' as const };
          if (index === 3 && progress >= 60) return { ...step, status: 'completed' as const };
          if (index === 4 && progress >= 80) return { ...step, status: 'completed' as const };
          return step;
        });
        
        setSteps(updatedSteps);
      } else {
        // Clear the interval when generation is complete
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, 600);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [messages]);
  
  // Handler for stopping generation
  const handleStop = () => {
    setIsStopped(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  
  // Handler for resuming generation
  const handleResume = () => {
    setIsStopped(false);
    // Continue generation from where it left off
    let progress = generationProgress;
    intervalRef.current = setInterval(() => {
      if (progress < 100) {
        progress += 5;
        setGenerationProgress(progress);
        
        // Update step statuses based on progress
        const updatedSteps = [...steps].map((step, index) => {
          if (index === 0) return { ...step, status: 'completed' as const };
          if (index === 1 && progress >= 20) return { ...step, status: 'completed' as const };
          if (index === 2 && progress >= 40) return { ...step, status: 'completed' as const };
          if (index === 3 && progress >= 60) return { ...step, status: 'completed' as const };
          if (index === 4 && progress >= 80) return { ...step, status: 'completed' as const };
          return step;
        });
        
        setSteps(updatedSteps);
      } else {
        // Clear the interval when generation is complete
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, 600);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating, steps]);
  
  // Empty state
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Bot size={48} className="mx-auto mb-4 text-[hsl(var(--primary))]" />
          <h3 className="text-lg font-medium text-white mb-2">No messages yet</h3>
          <p className="text-[hsl(var(--dark-2))]">Start a conversation with this bot!</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* Message history */}
      {messages.map((message) => (
        <div key={message.id} className="flex">
          <div 
            className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white ${
              message.sender === 'bot' 
                ? 'bg-blue-900/30 border border-blue-500/30' 
                : 'bg-[hsl(var(--primary))]'
            }`}
          >
            {message.sender === 'bot' ? (
              <MessageSquareText size={18} className="text-blue-300" />
            ) : (
              <span className="font-medium">U</span>
            )}
          </div>
          <div className="ml-3 flex-1">
            <div className="flex items-center">
              <span className={`font-medium ${
                message.sender === 'bot' 
                  ? 'text-blue-400'
                  : 'text-white'
              }`}>
                {message.sender === 'bot' ? (message.botName || 'clever-fox-3721') : (message.userName || 'User')}
              </span>
              <span className="text-xs text-[hsl(var(--dark-3))] ml-2">
                {formatDate(message.timestamp)}
              </span>
            </div>
            <div className="mt-1 text-[hsl(var(--dark-1))]">
              {message.content.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-2">{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      ))}
      
      {/* Bot generating response UI - Enhanced version */}
      {isGenerating && (
        <div className="flex">
          <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center bg-blue-900/30 border border-blue-500/30">
            {generationType === "code" && <Code size={18} className="text-blue-300" />}
            {generationType === "search" && <Search size={18} className="text-blue-300" />}
            {generationType === "file" && <FileText size={18} className="text-blue-300" />}
            {generationType === "database" && <Database size={18} className="text-blue-300" />}
            {generationType === "api" && <Globe size={18} className="text-blue-300" />}
          </div>
          <div className="ml-3 flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="font-medium text-blue-400">clever-fox-3721</span>
                <Badge className="ml-2 bg-blue-500/20 text-blue-200 border-none text-[10px]">
                  {generationType === "code" ? "coding" : 
                   generationType === "search" ? "searching" : 
                   generationType === "file" ? "editing file" :
                   generationType === "database" ? "querying db" : "calling api"}
                </Badge>
                {/* Progress indicator */}
                <div className="ml-2 w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-green-400 rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${generationProgress}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {!isStopped ? (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 rounded-full bg-red-950/30 text-red-400 hover:bg-red-900/30"
                    onClick={handleStop}
                  >
                    <StopCircle size={14} />
                  </Button>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 rounded-full bg-green-950/30 text-green-400 hover:bg-green-900/30"
                    onClick={handleResume}
                  >
                    <Play size={14} />
                  </Button>
                )}
              </div>
            </div>
            
            <div className="mt-2 overflow-hidden rounded-md border border-gray-700/50">
              {/* Steps progress */}
              <div className="bg-gray-800/30 p-2 space-y-1.5 border-b border-gray-700/50">
                {steps.filter(step => step.type === 'thinking').map((step) => (
                  <div key={step.id} className="flex items-center text-xs gap-2">
                    <div className={`${
                      step.status === 'completed' 
                        ? 'text-green-400' 
                        : step.status === 'in-progress' 
                          ? 'text-blue-400' 
                          : 'text-gray-400'
                    } flex items-center`}>
                      {step.icon || <Terminal size={14} />}
                      {step.status === 'in-progress' && (
                        <span className="ml-1 w-1 h-1 bg-blue-400 rounded-full animate-ping"></span>
                      )}
                    </div>
                    <span className={`${
                      step.status === 'completed' 
                        ? 'text-green-300' 
                        : step.status === 'in-progress' 
                          ? 'text-blue-300' 
                          : 'text-gray-400'
                    }`}>
                      {step.text}
                    </span>
                    {step.status === 'in-progress' && (
                      <span className="text-blue-300 animate-pulse">...</span>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Output content */}
              {steps.filter(step => step.type === 'output').map((step) => (
                <div 
                  key={step.id}
                  className="p-3 bg-gray-900/50 text-gray-200 font-mono text-xs whitespace-pre-wrap"
                >
                  {generationProgress > 60 ? step.text : step.text.substring(0, Math.floor(step.text.length * (generationProgress / 100)))}
                  {generationProgress < 80 && <span className="inline-block w-1.5 h-3.5 bg-blue-400 ml-1 animate-pulse"></span>}
                </div>
              ))}
              
              {/* Action buttons */}
              <div className="bg-gray-800/50 p-2 flex flex-wrap gap-2 border-t border-gray-700/50">
                {steps.filter(step => step.type === 'action').map((step) => (
                  <Button 
                    key={step.id}
                    variant="outline"
                    size="sm"
                    className={`h-7 text-xs bg-gray-900/50 hover:bg-gray-700/50 border-gray-700/50 flex items-center gap-1 ${
                      generationProgress < 80 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={generationProgress < 80}
                  >
                    {step.icon}
                    <span>{step.text}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
