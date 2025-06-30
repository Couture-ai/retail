import * as React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type EnhancedTooltipProps = React.ComponentPropsWithoutRef<typeof Tooltip> & {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  children?: React.ReactNode;
};

const EnhancedTooltip = ({
  trigger,
  title,
  description,
  icon,
  side = "right",
  children,
  ...props
}: EnhancedTooltipProps) => {
  return (
    <Tooltip {...props}>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent
        align={"start"}
        alignOffset={-8}
        side={side}
        sideOffset={8}
        className="flex flex-col bg-[#303135] text-white border border-[#5a5a5f] shadow-xl p-0 rounded-lg w-60 overflow-hidden"
        style={{
          boxShadow: "0 0px 10px 0px rgba(0, 0, 0, 0.25)",
          borderRadius: "5px"
        }}
      >
        <div className="flex items-center gap-2 px-3 py-2 border-b border-[#3a3a3f]">
          {icon && <div className="text-blue-400">{icon}</div>}
          <span className="text-xs font-medium">{title}</span>
        </div>
        {description && (
          <div className="px-3 py-2 text-xs text-gray-300">{description}</div>
        )}
        {children}
      </TooltipContent>
    </Tooltip>
  );
};

export { EnhancedTooltip };