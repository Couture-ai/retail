import { Headphones, Mic, Settings } from "lucide-react";

type UserProfileProps = {
  className?: string;
}

const UserProfile = ({ className }: UserProfileProps) => {
  return (
    <div className={`flex items-center justify-between p-2.5 bg-[hsl(var(--discord-10))] border-t border-gray-700/50 mt-auto ${className || ''}`}>
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
            U
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-[hsl(var(--discord-10))]"></div>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-white">User</span>
          <span className="text-xs text-[hsl(var(--dark-2))]">Online</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <button className="w-7 h-7 rounded-md flex items-center justify-center bg-transparent hover:bg-[hsl(var(--discord-8))] text-[hsl(var(--dark-2))] hover:text-white transition-colors">
          <Mic size={16} />
        </button>
        <button className="w-7 h-7 rounded-md flex items-center justify-center bg-transparent hover:bg-[hsl(var(--discord-8))] text-[hsl(var(--dark-2))] hover:text-white transition-colors">
          <Headphones size={16} />
        </button>
        <button className="w-7 h-7 rounded-md flex items-center justify-center bg-transparent hover:bg-[hsl(var(--discord-8))] text-[hsl(var(--dark-2))] hover:text-white transition-colors">
          <Settings size={16} />
        </button>
      </div>
    </div>
  );
};

export default UserProfile;