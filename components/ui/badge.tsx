import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export type BadgeProps = HTMLAttributes<HTMLSpanElement>;

export function Badge({ className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs uppercase tracking-wide text-neutral-300",
        className
      )}
      {...props}
    />
  );
}
