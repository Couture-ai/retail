import * as React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type EnhancedTooltipProps = React.ComponentPropsWithoutRef<typeof Tooltip> & {
  trigger: React.ReactNode;
  title: string;
  description?: React.ReactNode;
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
        className="flex flex-col bg-[hsl(var(--tooltip-background))] text-[hsl(var(--tooltip-foreground))] border border-[hsl(var(--tooltip-border))] shadow-xl p-0 rounded-lg w-60 overflow-hidden"
        style={{
          boxShadow: "0 0px 10px 0px hsl(var(--tooltip-shadow))",
          borderRadius: "5px"
        }}
      >
        <div className="flex items-center gap-2 px-3 py-2 border-b border-[hsl(var(--tooltip-border-separator))]">
          {icon && <div className="text-[hsl(var(--tooltip-icon-color))]">{icon}</div>}
          <span className="text-xs font-medium">{title}</span>
        </div>
        {description && (
          <div className="px-3 py-2 text-xs text-[hsl(var(--tooltip-description-foreground))]">{description}</div>
        )}
        {children}
      </TooltipContent>
    </Tooltip>
  );
};

export { EnhancedTooltip };