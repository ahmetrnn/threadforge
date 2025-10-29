"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import { ConnectXButton } from "@/components/ConnectXButton";
import { CreditsDisplay } from "@/components/CreditsDisplay";
import { PricingCard } from "@/components/PricingCard";
import { ThreadInput } from "@/components/ThreadInput";
import { ThreadOutput } from "@/components/ThreadOutput";
import { XAccountConnection } from "@/components/XAccountConnection";
import { Button } from "@/components/ui/button";
import type { ThreadMode, ThreadResponse, ThreadTweet, GroundingSource } from "@/types/thread";

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
  const [estimatedImpressions, setEstimatedImpressions] = useState<number | undefined>(undefined);
  const [publishTips, setPublishTips] = useState<string[] | undefined>(undefined);
  const [qualityScore, setQualityScore] = useState<number | undefined>(undefined);
  const [sources, setSources] = useState<GroundingSource[] | undefined>(undefined);
  const [isGrounded, setIsGrounded] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [mode, setMode] = useState<ThreadMode>("thread");
  const [uiMode, setUiMode] = useState<"basic" | "advanced">("advanced");
  const [outputMode, setOutputMode] = useState<ThreadMode>("thread");

  const isPro = subscriptionStatus === "pro";
  const remainingCredits = isPro ? Infinity : Math.max(FREE_LIMIT - usageCount, 0);
  const isXConnected = !!xUsername && !!xConnectedAt;

  // Handle X OAuth callback
  useEffect(() => {
    const xConnect = searchParams?.get("x_connect");
    if (xConnect === "true") {
      toast.success("X account connected successfully!");
      router.replace("/dashboard"); // Remove query param
      router.refresh();
    }
  }, [searchParams, router]);

  const handleGenerate = async (topic: string, emojis: boolean, hashtags: boolean, isHighQuality?: boolean, language?: string) => {
    try {
      setIsGenerating(true);
      const payload = {
        topic,
        emojis,
        hashtags,
        mode,
        language: language || 'en', // Use provided language or default to English
        isHighQuality,
      };
      console.log("[DashboardClient] sending /api/generate-thread payload", payload);
      const response = await fetch("/api/generate-thread", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
      setQualityScore(data.qualityScore);
      setSources(data.sources);
      setIsGrounded(data.isGrounded ?? false);
      setUsageCount(data.usage);
      const responseMode = data.mode ?? mode;
      setOutputMode(responseMode);
      setMode(responseMode);

      const successMsg = responseMode === "thread" ? "Fresh thread drafted. Polish and ship!" : "Single post locked. Polish and ship!";
      const groundingMsg = data.isGrounded ? " (Grounded with Google Search)" : "";
      toast.success(successMsg + groundingMsg);
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
    setQualityScore(undefined);
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
    <div className="space-y-8">
      {/* Credits Display - Fixed Top Right */}
      <CreditsDisplay remainingCredits={Math.max(remainingCredits, 0)} isPro={isPro} />

      <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-8 backdrop-blur-xl transition-all duration-500 hover:border-white/20">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Hey <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">{email.split("@")[0]}</span>, let's forge a {mode === "thread" ? "thread" : "single post"}.
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ConnectXButton isConnected={isXConnected} />
            {!isPro && (
              <Button
                onClick={handleUpgrade}
                disabled={isUpgrading}
                className="bg-gradient-to-r from-purple-600 to-purple-700 shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(124,58,237,0.5)]"
              >
                {isUpgrading ? "Redirecting..." : "Upgrade to Pro"}
              </Button>
            )}
            <Button
              variant="outline"
              className="border-white/20 bg-white/5 text-white backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/10"
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
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <ThreadInput
            onGenerate={handleGenerate}
            isLoading={isGenerating}
            mode={uiMode}
            isHighQuality={false}
            onHighQualityChange={() => {}}
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
            qualityScore={qualityScore}
            isPro={isPro}
            sources={sources}
            isGrounded={isGrounded}
          />
        </div>

        <div className="space-y-6">
          {!isPro && (
            <PricingCard onUpgrade={handleUpgrade} status={subscriptionStatus} />
          )}
          <XAccountConnection xUsername={xUsername} xConnectedAt={xConnectedAt} />
          <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-xl transition-all duration-500 hover:border-cyan-500/30 hover:bg-white/[0.05]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <h3 className="text-lg font-semibold text-white">Thread chef tips</h3>
            <ul className="mt-4 space-y-3 text-sm font-light text-white/70">
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,255,255,0.6)]" />
                <span>Reply to every comment within 15 minutes for extra reach.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,255,255,0.6)]" />
                <span>Schedule threads for 9AM EST — builder Twitter is caffeinated.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,255,255,0.6)]" />
                <span>Hook, value, CTA. Don't bury the lead.</span>
              </li>
            </ul>
          </div>

          {/* Quality Score Tutorial */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-xl transition-all duration-500 hover:border-purple-500/30 hover:bg-white/[0.05]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <h3 className="text-lg font-semibold text-white">Quality score guide</h3>
            <div className="mt-4 space-y-4 text-sm font-light text-white/70">
              <div>
                <div className="font-medium text-white/90 mb-2">The 5 Critical Elements:</div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(147,51,234,0.6)]" />
                    <span><strong>Hook (30pts):</strong> Start with number + struggle + surprise</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(147,51,234,0.6)]" />
                    <span><strong>Numbers (20pts):</strong> 3+ specific metrics (revenue, users, %)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(147,51,234,0.6)]" />
                    <span><strong>Vulnerability (15pts):</strong> Share real failures/doubts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(147,51,234,0.6)]" />
                    <span><strong>CTA (15pts):</strong> Clear ask offering value</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(147,51,234,0.6)]" />
                    <span><strong>Flow (10pts):</strong> Natural story, no labels</span>
                  </li>
                </ul>
              </div>
              <div className="border-t border-white/10 pt-4">
                <div className="font-medium text-white/90 mb-2">Score Ranges:</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-400"></span>
                    <span>85-100: Excellent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-yellow-400"></span>
                    <span>70-84: Good</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-orange-400"></span>
                    <span>60-69: Needs work</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-400"></span>
                    <span>&lt;60: Major issues</span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-white/60 mt-3">
                Pro tip: Authenticity + specificity + value = viral threads
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
