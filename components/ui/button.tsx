"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

const variantStyles = {
  default:
    "bg-brand text-brand-foreground hover:bg-brand/90 focus-visible:ring-2 focus-visible:ring-brand/70",
  outline:
    "border border-neutral-700 bg-transparent text-neutral-100 hover:bg-neutral-900",
  ghost: "bg-transparent text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variantStyles;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60",
          variantStyles[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
