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
        "group relative overflow-hidden rounded-2xl border-l-4 border-purple-500 bg-gradient-to-br from-purple-950/30 to-white/[0.02] p-8 shadow-[0_0_30px_rgba(124,58,237,0.2)] backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(124,58,237,0.4)]",
        compact ? "space-y-4" : "space-y-6"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-white">ThreadForge Pro</h3>
        <p className="mt-2 text-sm font-light leading-relaxed text-white/70">
          Unlock unlimited AI threads, saved vibes, and more maker-grade sauce.
        </p>
      </div>

      <div className="relative z-10 flex items-baseline gap-2">
        <span className="text-4xl font-bold text-white">$9</span>
        <span className="text-base font-light text-white/50">/ month</span>
      </div>

      <ul className="relative z-10 space-y-3 text-sm font-light text-white/90">
        {perks.map((perk) => (
          <li key={perk} className="flex items-start gap-3 leading-relaxed">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
            <span>{perk}</span>
          </li>
        ))}
      </ul>

      <Button
        className="relative z-10 w-full bg-gradient-to-r from-purple-600 to-purple-700 font-semibold text-white shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(124,58,237,0.5)]"
        onClick={onUpgrade}
        disabled={isPro}
      >
        {isPro ? "You're already Pro" : "Upgrade for $9/mo"}
      </Button>
    </div>
  );
}
