import React from 'react';

interface ChatTabProps {
  channelId: string;
  messages: any[];
}

const ChatTab: React.FC<ChatTabProps> = ({ channelId, messages }) => {
  return (
    <div className="flex flex-col h-full bg-[hsl(var(--dark-9))]">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div key={index} className="mb-4">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-[hsl(var(--primary))] flex items-center justify-center text-white mr-2">
                  {message.sender === 'user' ? 'U' : 'B'}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-white">
                    {message.sender === 'user' ? 'You' : message.botName || 'Bot'}
                  </div>
                  <div className="text-gray-300 mt-1">{message.content}</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 mt-8">
            No messages in this channel yet.
          </div>
        )}
      </div>
      <div className="border-t border-gray-700 p-3">
        <input
          type="text"
          placeholder="Type a message..."
          className="w-full bg-[hsl(var(--dark-7))] text-white rounded px-3 py-2 outline-none"
        />
      </div>
    </div>
  );
};

export default ChatTab; 