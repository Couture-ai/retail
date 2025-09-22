"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

export const MovingBorderButton = React.forwardRef<
  HTMLElement,
  {
    borderRadius?: string;
    children: React.ReactNode;
    as?: any;
    containerClassName?: string;
    borderClassName?: string;
    duration?: number;
    className?: string;
    asChild?: boolean;
    [key: string]: any;
  }
>(({
  borderRadius = "0.5rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration = 3000,
  className,
  asChild = false,
  ...otherProps
}, ref) => {
  if (asChild) {
    // When asChild is true, we need to wrap the child element with our border effects
    return (
      <div
        className={cn(
          "relative overflow-hidden bg-transparent p-1",
          containerClassName,
        )}
        style={{
          borderRadius: borderRadius,
        }}
      >
        {/* Static faint border */}
        <div
          className="absolute inset-1 border border-purple-300/20 dark:border-purple-400/20"
          style={{ borderRadius: `calc(${borderRadius} * 0.8)` }}
        />

        <Slot
          ref={ref}
          className={cn(
            "relative flex h-full w-full items-center justify-center bg-transparent",
            className,
          )}
          style={{
            borderRadius: `calc(${borderRadius} * 0.8)`,
          }}
          {...otherProps}
        >
          {children}
        </Slot>
      </div>
    );
  }

  // Normal behavior when asChild is false
  const Comp = Component;
  
  return (
    <Comp
      ref={ref}
      className={cn(
        "relative overflow-hidden bg-transparent p-1",
        containerClassName,
      )}
      style={{
        borderRadius: borderRadius,
      }}
      {...otherProps}
    >
      {/* Static faint border */}
      <div
        className="absolute inset-1 border border-purple-300/20 dark:border-purple-400/20"
        style={{ borderRadius: `calc(${borderRadius} * 0.8)` }}
      />

      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center bg-transparent",
          className,
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.8)`,
        }}
      >
        {children}
      </div>
    </Comp>
  );
});

MovingBorderButton.displayName = "MovingBorderButton"; 