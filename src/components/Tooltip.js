"use client";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

export default function Tooltip({ children, content, side = "top" }) {
  return (
    <TooltipPrimitive.Provider delayDuration={200}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger 
          asChild
          onFocus={(e) => e.preventDefault()} 
        >
          {children}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={6}
            className={`
              z-50 overflow-hidden rounded-md 
              bg-monaco-dark border border-monaco-light py-1.5 px-2 
              text-xs font-medium text-monaco-txt 
              shadow-xl shadow-black/25 
              transition-all 
              data-[state=delayed-open]:(
                animate-in
                fade-in-0
                zoom-in-95
                slide-in-from-bottom-1
              )
            `}
          >
            {content}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
