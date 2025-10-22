"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { PricingCard } from "@/components/PricingCard";
import { ThreadInput } from "@/components/ThreadInput";
import { ThreadOutput } from "@/components/ThreadOutput";
import { Button } from "@/components/ui/button";
import type { ThreadResponse, ThreadTweet } from "@/types/thread";

const FREE_LIMIT = 3;

type DashboardClientProps = {
  initialThreadCount: number;
  subscriptionStatus: "free" | "pro";
  email: string;
};

export function DashboardClient({ initialThreadCount, subscriptionStatus, email }: DashboardClientProps) {
  const router = useRouter();
  const [usageCount, setUsageCount] = useState(initialThreadCount);
  const [thread, setThread] = useState<ThreadTweet[]>([]);
  const [estimatedImpressions, setEstimatedImpressions] = useState<string | undefined>(undefined);
  const [publishTips, setPublishTips] = useState<string | undefined>(undefined);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const isPro = subscriptionStatus === "pro";
  const remainingCredits = isPro ? Infinity : Math.max(FREE_LIMIT - usageCount, 0);

  const handleGenerate = async (values: { topic: string; vibe: string; template: string }) => {
    try {
      setIsGenerating(true);
      const response = await fetch("/api/generate-thread", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.status === 402) {
        toast.error("You hit the free limit. Upgrade to keep the momentum.");
        return;
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Unable to generate thread." }));
        toast.error(error.message ?? "ThreadForge hiccup. Try again." );
        return;
      }

      const data: ThreadResponse & { usage: number } = await response.json();
      setThread(data.thread);
      setEstimatedImpressions(data.estimatedImpressions);
      setPublishTips(data.publishTips);
      setUsageCount(data.usage);
      toast.success("Fresh thread drafted. Polish and ship!");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("ThreadForge crashed the vibe. Try again in a sec.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpgrade = async () => {
    try {
      setIsUpgrading(true);
      const response = await fetch("/api/stripe", { method: "POST" });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Unable to start checkout." }));
        toast.error(error.message ?? "Stripe checkout failed.");
        return;
      }
      const data = (await response.json()) as { checkoutUrl: string };
      window.location.href = data.checkoutUrl;
    } catch (error) {
      console.error(error);
      toast.error("Stripe is being moody. Try again soon.");
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-neutral-800 bg-neutral-950/60 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-100">Hey {email.split("@")[0]}, let’s forge a thread.</h1>
          <p className="text-sm text-neutral-400">
            {isPro
              ? "Unlimited threads, unlimited experiments."
              : `You have ${Math.max(remainingCredits, 0)} free threads left this month.`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!isPro && (
            <Button onClick={handleUpgrade} disabled={isUpgrading}>
              {isUpgrading ? "Redirecting..." : "Upgrade to Pro"}
            </Button>
          )}
          <Button
            variant="outline"
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              router.push("/");
              router.refresh();
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <ThreadInput
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            remainingCredits={isPro ? Number.POSITIVE_INFINITY : Math.max(remainingCredits, 0)}
            isPro={isPro}
          />
          <ThreadOutput
            thread={thread}
            onUpdateTweet={(tweetNumber, value) => {
              setThread((prev) =>
                prev.map((tweet) =>
                  tweet.tweetNumber === tweetNumber ? { ...tweet, text: value } : tweet
                )
              );
            }}
            estimatedImpressions={estimatedImpressions}
            publishTips={publishTips}
          />
        </div>

        <div className="space-y-6">
          {!isPro && (
            <PricingCard onUpgrade={handleUpgrade} status={subscriptionStatus} />
          )}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-6 text-sm text-neutral-400">
            <h3 className="text-base font-semibold text-neutral-100">Thread chef tips</h3>
            <ul className="mt-3 space-y-2">
              <li>• Reply to every comment within 15 minutes for extra reach.</li>
              <li>• Schedule threads for 9AM EST — builder Twitter is caffeinated.</li>
              <li>• Hook, value, CTA. Don’t bury the lead.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
