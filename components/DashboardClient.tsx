"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import { ConnectXButton } from "@/components/ConnectXButton";
import { PricingCard } from "@/components/PricingCard";
import { ThreadInput } from "@/components/ThreadInput";
import { ThreadOutput } from "@/components/ThreadOutput";
import { XAccountConnection } from "@/components/XAccountConnection";
import { Button } from "@/components/ui/button";
import type { ThreadMode, ThreadResponse, ThreadTweet } from "@/types/thread";

const FREE_LIMIT = 100;

type DashboardClientProps = {
  initialThreadCount: number;
  subscriptionStatus: "free" | "pro";
  email: string;
  xUsername?: string | null;
  xConnectedAt?: string | null;
};

export function DashboardClient({ initialThreadCount, subscriptionStatus, email, xUsername, xConnectedAt }: DashboardClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [usageCount, setUsageCount] = useState(initialThreadCount);
  const [thread, setThread] = useState<ThreadTweet[]>([]);
  const [estimatedImpressions, setEstimatedImpressions] = useState<string | undefined>(undefined);
  const [publishTips, setPublishTips] = useState<string | undefined>(undefined);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [mode, setMode] = useState<ThreadMode>("thread");
  const [outputMode, setOutputMode] = useState<ThreadMode>("thread");

  const isPro = subscriptionStatus === "pro";
  const remainingCredits = isPro ? Infinity : Math.max(FREE_LIMIT - usageCount, 0);

  // Handle X OAuth callback
  useEffect(() => {
    const xConnect = searchParams?.get("x_connect");
    if (xConnect === "true") {
      // User just returned from X OAuth, save their connection
      const saveConnection = async () => {
        try {
          const response = await fetch("/api/twitter/connect", {
            method: "POST",
          });

          if (!response.ok) {
            const error = await response.json().catch(() => ({ message: "Failed to connect." }));
            toast.error(error.message ?? "Failed to connect X account.");
            return;
          }

          const data = await response.json();
          toast.success(`X account @${data.username} connected!`);
          router.replace("/dashboard"); // Remove query param
          router.refresh();
        } catch (error) {
          console.error("X connection save error:", error);
          toast.error("Failed to save X connection.");
        }
      };

      saveConnection();
    }
  }, [searchParams, router]);

  const handleGenerate = async (values: { topic: string; vibe: string; template: string }) => {
    try {
      setIsGenerating(true);
      console.log("[DashboardClient] sending /api/generate-thread payload", values);
      const response = await fetch("/api/generate-thread", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      console.log("[DashboardClient] /api/generate-thread status", response.status);

      if (response.status === 402) {
        toast.error("You hit the free limit. Upgrade to keep the momentum.");
        return;
      }

      if (!response.ok) {
        const rawError = await response.text();
        console.warn("[DashboardClient] /api/generate-thread error body", rawError);
        const error = (() => {
          try {
            return JSON.parse(rawError);
          } catch {
            return { message: rawError };
          }
        })();
        toast.error(error.message ?? "ThreadForge hiccup. Try again.");
        return;
      }

      const data: ThreadResponse & { usage: number } = await response.json();
      setThread(data.thread);
      setEstimatedImpressions(data.estimatedImpressions);
      setPublishTips(data.publishTips);
      setUsageCount(data.usage);
      const responseMode = data.mode ?? values.mode;
      setOutputMode(responseMode);
      setMode(responseMode);
      toast.success(responseMode === "thread" ? "Fresh thread drafted. Polish and ship!" : "Single post locked. Polish and ship!");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("ThreadForge crashed the vibe. Try again in a sec.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleModeChange = (nextMode: ThreadMode) => {
    setMode(nextMode);
    setThread([]);
    setEstimatedImpressions(undefined);
    setPublishTips(undefined);
    setOutputMode(nextMode);
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
          <h1 className="text-2xl font-semibold text-neutral-100">Hey {email.split("@")[0]}, let’s forge a {mode === "thread" ? "thread" : "single post"}.</h1>
          <p className="text-sm text-neutral-400">
            {isPro
              ? "Unlimited generations, unlimited experiments."
              : `You have ${Math.max(remainingCredits, 0)} free generations left this month.`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ConnectXButton isConnected={isXConnected} />
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
            mode={mode}
            onModeChange={handleModeChange}
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
            mode={outputMode}
          />
        </div>

        <div className="space-y-6">
          {!isPro && (
            <PricingCard onUpgrade={handleUpgrade} status={subscriptionStatus} />
          )}
          <XAccountConnection xUsername={xUsername} xConnectedAt={xConnectedAt} />
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-6 text-sm text-neutral-400">
            <h3 className="text-base font-semibold text-neutral-100">Thread chef tips</h3>
            <ul className="mt-3 space-y-2">
              <li>• Reply to every comment within 15 minutes for extra reach.</li>
              <li>• Schedule threads for 9AM EST — builder Twitter is caffeinated.</li>
              <li>• Hook, value, CTA. Don't bury the lead.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
