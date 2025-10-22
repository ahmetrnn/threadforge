"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const perks = [
  "Unlimited thread generations",
  "Power prompts + saved templates",
  "Priority support from fellow builders",
];

type PricingCardProps = {
  onUpgrade: () => Promise<void>;
  status: "free" | "pro";
  compact?: boolean;
};

export function PricingCard({ onUpgrade, status, compact }: PricingCardProps) {
  const isPro = status === "pro";

  return (
    <div
      className={cn(
        "rounded-2xl border border-neutral-800 bg-neutral-950/60 p-6",
        compact ? "space-y-4" : "space-y-6"
      )}
    >
      <div>
        <h3 className="text-xl font-semibold text-neutral-100">ThreadForge Pro</h3>
        <p className="mt-1 text-sm text-neutral-400">
          Unlock unlimited AI threads, saved vibes, and more maker-grade sauce.
        </p>
      </div>
      <div className="flex items-baseline gap-2 text-neutral-50">
        <span className="text-3xl font-bold">$9</span>
        <span className="text-sm text-neutral-500">/ month</span>
      </div>
      <ul className="space-y-2 text-sm text-neutral-300">
        {perks.map((perk) => (
          <li key={perk} className="leading-relaxed">
            • {perk}
          </li>
        ))}
      </ul>
      <Button
        className="w-full"
        onClick={onUpgrade}
        disabled={isPro}
      >
        {isPro ? "You’re already Pro" : "Upgrade for $9/mo"}
      </Button>
    </div>
  );
}
