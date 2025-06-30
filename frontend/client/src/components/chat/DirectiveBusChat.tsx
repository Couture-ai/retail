import { useState, useEffect, useRef } from "react";
import { ArrowRight, Trash2, PencilLine, Info, Send, ChevronDown, ChevronUp, AlertTriangle, Terminal, CornerDownRight, ExternalLink, Pause, Play } from "lucide-react";

type Instruction = {
  id: string;
  text: string;
  context: string;
  source: string;
  target: string;
};

type DirectiveBusChatProps = {
  channelId: string;
  sourceBotId: string;
  targetBotId: string;
};

// Generate a simple ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Example instructions for demonstration
const mockInstructions: Instruction[] = [
  {
    id: generateId(),
    text: "Analyze user requirements and create component specifications",
    context: `# User Requirements Analysis\n\n## User Stories\n- As a user, I want to filter products by category\n- As a user, I want to search for products by name\n- As a user, I want to save items to a wishlist\n\n## Acceptance Criteria\n- Filter function shows only products from selected category\n- Search returns products with names containing search term\n- Wishlist persists between sessions\n\n## Technical Considerations\n- Implement client-side filtering for performance\n- Consider search optimization for large product catalogs\n- Use local storage for wishlist persistence`,
    source: "swift-eagle-9042",
    target: "creative-owl-7238"
  },
  {
    id: generateId(),
    text: "Design UI components according to specifications and brand guidelines",
    context: `# UI Component Design\n\n## Brand Guidelines\n- Primary color: #3E63DD\n- Secondary color: #1B2559\n- Font: Inter, sans-serif\n\n## Components Needed\n- ProductCard\n- FilterSidebar\n- SearchBar\n- WishlistButton\n\n## Design Principles\n- Maintain consistent spacing (8px grid)\n- Ensure all interactive elements have hover/focus states\n- Components should be responsive for mobile, tablet, and desktop`,
    source: "swift-eagle-9042",
    target: "creative-owl-7238"
  },
  {
    id: generateId(),
    text: "Optimize component rendering for performance improvements",
    context: `# Performance Optimization\n\n## Current Issues\n- ProductList re-renders too frequently\n- Search function has high latency on large datasets\n- Page load time exceeds 2s on mobile devices\n\n## Optimization Strategies\n- Implement React.memo for ProductCard components\n- Add debounce to search input (300ms)\n- Virtualize long product lists using react-window\n- Implement code splitting to reduce initial bundle size\n\n## Expected Outcomes\n- Reduce re-renders by 60%\n- Improve search response time to under 100ms\n- Achieve page load under 1.5s on 3G connections`,
    source: "swift-eagle-9042",
    target: "creative-owl-7238"
  }
];

const DirectiveBusChat = ({ channelId, sourceBotId, targetBotId }: DirectiveBusChatProps) => {
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [expandedContexts, setExpandedContexts] = useState<Record<string, boolean>>({});
  const [editingContext, setEditingContext] = useState<string | null>(null);
  const [editContextText, setEditContextText] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize with mock data
  useEffect(() => {
    setInstructions(mockInstructions);
  }, []);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [instructions, editingId]);
  
  // Add new instruction from chat input
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newMessage.trim() === "") return;
    
    const instruction: Instruction = {
      id: generateId(),
      text: newMessage,
      context: "# New Directive Context\n\nAdd detailed specifications and requirements for this directive.",
      source: sourceBotId,
      target: targetBotId
    };
    
    setInstructions([...instructions, instruction]);
    setNewMessage("");
  };
  
  // Toggle context expansion
  const toggleContext = (id: string) => {
    setExpandedContexts(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // Start editing an instruction
  const startEditing = (instruction: Instruction) => {
    setEditingId(instruction.id);
    setEditText(instruction.text);
  };
  
  // Save edited instruction
  const saveEdit = () => {
    if (!editingId) return;
    
    setInstructions(
      instructions.map(instruction => 
        instruction.id === editingId 
          ? { ...instruction, text: editText } 
          : instruction
      )
    );
    
    setEditingId(null);
    setEditText("");
  };
  
  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };
  
  // Start editing context
  const startEditingContext = (instruction: Instruction) => {
    setEditingContext(instruction.id);
    setEditContextText(instruction.context);
  };
  
  // Save edited context
  const saveContextEdit = () => {
    if (!editingContext) return;
    
    setInstructions(
      instructions.map(instruction => 
        instruction.id === editingContext 
          ? { ...instruction, context: editContextText } 
          : instruction
      )
    );
    
    setEditingContext(null);
    setEditContextText("");
  };
  
  // Cancel context editing
  const cancelContextEdit = () => {
    setEditingContext(null);
    setEditContextText("");
  };
  
  // Delete instruction
  const deleteInstruction = (id: string) => {
    setInstructions(instructions.filter(instruction => instruction.id !== id));
  };
  
  // Toggle pause/play
  const togglePausePlay = () => {
    setIsPaused(!isPaused);
  };
  
  return (
    <div className="flex-1 flex flex-col h-full bg-gray-900">
      {/* Header with connection info */}
      <div className="p-3 border-b border-red-800/50 bg-gray-900 flex items-center justify-between">
        <div className="flex items-center">
          <AlertTriangle size={14} className="text-red-500 mr-2" />
          <h3 className="text-sm font-medium mr-2 text-red-400">DIRECTIVE BUS</h3>
          <div className="flex items-center text-xs text-gray-400">
            <span className="text-blue-400 font-mono">{sourceBotId}</span>
            <ArrowRight size={12} className="mx-1 text-gray-600" />
            <span className="text-green-400 font-mono">{targetBotId}</span>
          </div>
        </div>
        <button
          className={`p-1.5 rounded ${isPaused ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'} hover:bg-opacity-50`}
          onClick={togglePausePlay}
          title={isPaused ? "Resume directive bus" : "Pause directive bus"}
        >
          {isPaused ? <Play size={14} /> : <Pause size={14} />}
        </button>
      </div>
      
      {/* Instructions list */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-900">
        {instructions.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            <Terminal className="mx-auto text-gray-600 mb-2" size={24} />
            <p>No active directives in this command bus.</p>
            <p className="text-xs mt-1">Issue new directives using the command input below.</p>
          </div>
        ) : (
          instructions.map((instruction, index) => (
            <div key={instruction.id} className="rounded-md overflow-hidden border border-gray-700/50 bg-gray-800/20">
              {editingId === instruction.id ? (
                <div className="p-3">
                  <div className="flex items-center mb-2">
                    <span className="text-xs font-mono text-gray-500 mr-2">EDIT DIRECTIVE #{index + 1}</span>
                  </div>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full bg-gray-900/80 border border-gray-700 rounded p-2 text-gray-200 text-sm mb-2 resize-none"
                    rows={2}
                    autoFocus
                  />
                  <div className="flex justify-end space-x-2">
                    <button 
                      className="px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded border border-gray-700"
                      onClick={cancelEdit}
                    >
                      CANCEL
                    </button>
                    <button 
                      className="px-3 py-1 text-xs bg-red-900/80 hover:bg-red-800 text-red-300 rounded border border-red-800"
                      onClick={saveEdit}
                    >
                      UPDATE
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col">
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Terminal size={12} className="text-red-500 mr-1" />
                        <span className="text-xs font-mono text-gray-500">DIRECTIVE #{index + 1}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-mono mr-1">
                          {new Date().toISOString().split('T')[0]}
                        </span>
                        <button 
                          className="p-1 text-gray-500 hover:text-blue-400 hover:bg-gray-800 rounded"
                          onClick={() => startEditing(instruction)}
                          title="Edit directive"
                        >
                          <PencilLine size={14} />
                        </button>
                        <button 
                          className="p-1 text-gray-500 hover:text-red-400 hover:bg-gray-800 rounded"
                          onClick={() => deleteInstruction(instruction.id)}
                          title="Delete directive"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="flex mt-1">
                      <CornerDownRight size={16} className="text-gray-600 mr-1 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-200 font-medium">{instruction.text}</p>
                    </div>
                  </div>
                  
                  {/* Context section */}
                  <div>
                    <button 
                      className="w-full p-1.5 flex items-center justify-between bg-gray-800/40 hover:bg-gray-800/60 text-gray-400 text-xs font-mono border-t border-gray-700/30"
                      onClick={() => toggleContext(instruction.id)}
                    >
                      <div className="flex items-center">
                        <span className="text-[10px] opacity-70">CONTEXT</span>
                      </div>
                      {expandedContexts[instruction.id] ? 
                        <ChevronUp size={12} /> : 
                        <ChevronDown size={12} />
                      }
                    </button>
                    
                    {expandedContexts[instruction.id] && (
                      <div className="p-2 bg-gray-900/60 border-t border-gray-800/50">
                        {editingContext === instruction.id ? (
                          <div>
                            <textarea
                              value={editContextText}
                              onChange={(e) => setEditContextText(e.target.value)}
                              className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-gray-300 text-xs font-mono mb-2 resize-none"
                              rows={8}
                              autoFocus
                            />
                            <div className="flex justify-end space-x-2 mt-2">
                              <button 
                                className="px-2 py-0.5 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded border border-gray-700"
                                onClick={cancelContextEdit}
                              >
                                CANCEL
                              </button>
                              <button 
                                className="px-2 py-0.5 text-xs bg-blue-900/70 hover:bg-blue-800 text-blue-300 rounded border border-blue-900/50"
                                onClick={saveContextEdit}
                              >
                                UPDATE
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <pre className="whitespace-pre-wrap text-[10px] font-mono text-gray-400 max-h-60 overflow-y-auto p-2 bg-black/30 rounded border border-gray-800/50">
                              {instruction.context}
                            </pre>
                            <div className="mt-2 flex justify-end">
                              <button 
                                className="px-2 py-0.5 text-[10px] bg-gray-800/70 hover:bg-gray-700 text-blue-300/80 rounded border border-gray-700/50 flex items-center gap-1"
                                onClick={() => startEditingContext(instruction)}
                              >
                                <PencilLine size={10} />
                                <span>EDIT</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>
      
      {/* Message input */}
      <div className="p-4 border-t border-red-800/50 bg-gray-900">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <div className="absolute left-0 top-0 bottom-0 flex items-center pl-3 pointer-events-none">
              <Terminal size={16} className="text-red-500" />
            </div>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Issue new directive..."
              className="w-full bg-gray-800 border border-gray-700 rounded-md text-gray-200 py-2.5 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-red-700 focus:border-red-700 font-mono"
              disabled={isPaused}
            />
          </div>
          <button
            type="submit"
            className="bg-red-900 hover:bg-red-800 text-white p-2 rounded-md border border-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!newMessage.trim() || isPaused}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default DirectiveBusChat;