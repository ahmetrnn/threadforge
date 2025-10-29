"use client";

import { forwardRef, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full min-h-[120px] rounded-md border border-white/10 bg-[#0a0a0a] px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus-visible:border-cyan-500/50 focus-visible:ring-1 focus-visible:ring-cyan-500/50 transition-colors",
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
