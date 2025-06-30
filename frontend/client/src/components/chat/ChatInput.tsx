import { useState } from "react";
import { useWorkspace } from "@/context/WorkspaceProvider";
import { StopCircle, Play, Send, Sparkles } from "lucide-react";

type ChatInputProps = {
  channelId: string;
};

const ChatInput = ({ channelId }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isStopped, setIsStopped] = useState(false);
  const { addMessage } = useWorkspace();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim()) {
      addMessage(channelId, message, false);
      
      // Simulate bot response (only if not stopped)
      if (!isStopped) {
        setTimeout(() => {
          let botResponse = "Thanks for your message! I'm here to help with any questions you have.";
          
          if (message.toLowerCase().includes("hello") || message.toLowerCase().includes("hi")) {
            botResponse = "Hello there! How can I assist you today?";
          } else if (message.toLowerCase().includes("help")) {
            botResponse = "I'd be happy to help! Could you please provide more details about what you need assistance with?";
          } else if (message.toLowerCase().includes("code") || message.toLowerCase().includes("programming")) {
            botResponse = "I can help with coding questions! What programming language or framework are you working with?";
          }
          
          addMessage(channelId, botResponse, true);
        }, 1000);
      }
      
      setMessage("");
    }
  };

  const toggleBotStatus = () => {
    setIsStopped(!isStopped);
  };

  return (
    <div className="p-4 border-t border-gray-700/50">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input 
            type="text" 
            placeholder={`Message ${channelId}`} 
            className="bg-[hsl(var(--discord-7))] rounded-md text-[hsl(var(--dark-1))] py-2.5 px-4 w-full focus:outline-none focus:ring-1 focus:ring-primary pr-24"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="absolute right-2 top-2 flex space-x-2 items-center">
            <button 
              type="button" 
              className={`${isStopped ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'} rounded-full p-1 hover:bg-opacity-30 transition-colors`}
              onClick={toggleBotStatus}
              title={isStopped ? "Resume bot" : "Pause bot"}
            >
              {isStopped ? <Play size={16} /> : <StopCircle size={16} />}
            </button>
            
            <button 
              type="button" 
              className="bg-blue-600/20 text-blue-400 rounded-full p-1 hover:bg-opacity-30 transition-colors"
              title="Generate with AI"
            >
              <Sparkles size={16} />
            </button>
            
            <button 
              type="submit" 
              className="bg-purple-600/30 text-purple-300 rounded-full p-1 hover:bg-opacity-50 transition-colors"
              title="Send message"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
