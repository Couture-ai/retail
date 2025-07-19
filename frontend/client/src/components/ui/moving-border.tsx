"use client";
import React from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
} from "framer-motion";
import { useRef } from "react";
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
        
        {/* Moving border container */}
        <div
          className="absolute inset-1"
          style={{ borderRadius: `calc(${borderRadius} * 0.8)` }}
        >
          <MovingBorder duration={duration} rx="15%" ry="15%" />
        </div>

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
      
      {/* Moving border container */}
      <div
        className="absolute inset-1"
        style={{ borderRadius: `calc(${borderRadius} * 0.8)` }}
      >
        <MovingBorder duration={duration} rx="15%" ry="15%" />
      </div>

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

export const MovingBorder = ({
  duration = 3000,
  rx,
  ry,
  ...otherProps
}: {
  duration?: number;
  rx?: string;
  ry?: string;
  [key: string]: any;
}) => {
  const pathRef = useRef<SVGRectElement>(null);
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      className="absolute h-full w-full"
      width="100%"
      height="100%"
      {...otherProps}
    >
      <motion.rect
        fill="none"
        width="100%"
        height="100%"
        rx={rx}
        ry={ry}
        ref={pathRef}
        stroke="#a855f7"
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="20 80"
        animate={{
          strokeDashoffset: [0, -100],
        }}
        transition={{
          duration: duration / 1000,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </svg>
  );
}; 