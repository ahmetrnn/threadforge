"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EmojiPicker } from "@/components/EmojiPicker";
import type { ThreadMode, ThreadTweet, GroundingSource } from "@/types/thread";

const EMOJI_SUGGESTIONS = ["🚀", "🔥", "🛠️", "💡", "📈", "⚡", "🤝", "✨"];

type ThreadOutputProps = {
  thread: ThreadTweet[];
  onUpdateTweet: (tweetNumber: number, value: string) => void;
  estimatedImpressions?: number;
  publishTips?: string[];
  mode: ThreadMode;
  qualityScore?: number;
  isPro?: boolean;
  sources?: GroundingSource[];
  isGrounded?: boolean;
  isLoading?: boolean;
};

// Character count color helper
const getCharCountColor = (count: number, max: number) => {
  const percentage = (count / max) * 100;
  if (percentage < 70) return "text-green-400";
  if (percentage < 90) return "text-yellow-400";
  if (percentage < 100) return "text-orange-400";
  return "text-red-400";
};

export function ThreadOutput({ thread, onUpdateTweet, estimatedImpressions, publishTips, mode, qualityScore, isPro = false, sources, isGrounded, isLoading }: ThreadOutputProps) {
  const [showSources, setShowSources] = useState(false);
  const maxLength = mode === "single" && isPro ? 4000 : 280;
  const sortedThread = useMemo(
    () => [...thread].sort((a, b) => (a.tweetNumber ?? 0) - (b.tweetNumber ?? 0)),
    [thread]
  );
  const fullThread = useMemo(() => {
    if (mode === "single") {
      return sortedThread[0]?.text ?? "";
    }
    return sortedThread.map((tweet) => `${tweet.tweetNumber ?? ''}. ${tweet.text}`).join("\n\n");
  }, [sortedThread, mode]);
  const [isPosting, setIsPosting] = useState(false);

  const handleCopyAll = async () => {
    if (!navigator?.clipboard) {
      toast.error("Clipboard not available on this device.");
      return;
    }
    await navigator.clipboard.writeText(fullThread);
    toast.success(mode === "thread" ? "Copied entire thread. Go ship it!" : "Copied your single post. Go ship it!");
  };

  const handleExport = () => {
    const blob = new Blob([fullThread], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = mode === "thread" ? "threadforge-thread.txt" : "threadforge-post.txt";
    link.click();
    URL.revokeObjectURL(url);
    toast("TXT file ready for your vault.");
  };

  const handleCopySingle = async (tweet: ThreadTweet) => {
    if (!navigator?.clipboard) {
      toast.error("Clipboard not available on this device.");
      return;
    }
    await navigator.clipboard.writeText(tweet.text);
    toast.success(`Tweet ${tweet.tweetNumber ?? ''} copied`);
  };

  const handlePostThread = async () => {
    if (isPosting) return;

    if (sortedThread.length === 0) {
      toast.error(mode === "thread" ? "Generate a thread before posting." : "Generate a post before shipping.");
      return;
    }

    try {
      setIsPosting(true);

      const response = await fetch("/api/post-thread", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          thread: (mode === "single" ? sortedThread.slice(0, 1) : sortedThread)
            .map((tweet) => ({
              text: tweet.text,
              emojis: tweet.emojis ?? [],
            })),
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Unable to post thread." }));
        toast.error(error.error ?? error.message ?? "X declined the request. Try again.");
        return;
      }

      const data = (await response.json()) as { tweetIds?: string[] };
      toast.success(mode === "thread" ? "Thread posted to X. Go engage!" : "Post shipped to X. Go engage!");

      if (data.tweetIds?.length) {
        const firstTweetId = data.tweetIds[0];
        toast.custom((t) => (
          <div className="flex flex-col gap-2">
            <span>View the live {mode === "thread" ? "thread" : "post"}?</span>
            <button
              type="button"
              className="rounded bg-neutral-900 px-3 py-1 text-sm text-brand underline-offset-2 hover:underline"
              onClick={() => {
                window.open(`https://x.com/i/web/status/${firstTweetId}`, "_blank");
                toast.dismiss(t.id);
              }}
            >
              Open on X
            </button>
          </div>
        ));
      }
    } catch (error) {
      console.error(error);
      toast.error("ThreadForge couldn't reach X. Try again soon.");
    } finally {
      setIsPosting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.01] p-12 text-center backdrop-blur-xl">
        <p className="text-base font-light text-white/50">Generating...</p>
      </div>
    );
  }

  if (sortedThread.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.01] p-12 text-center backdrop-blur-xl">
        <p className="text-base font-light text-white/50">
          {mode === "thread"
            ? "Your AI-crafted thread will show up here. Until then, keep dreaming in public."
            : "Your AI-crafted single post will show up here. Until then, keep dreaming in public."}
        </p>
      </div>
    );
  }

  if (mode === "single") {
    const single = sortedThread[0];
    if (!single) {
      return null;
    }

    return (
      <div className="space-y-6">
        <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-xl transition-all duration-500 hover:border-white/20">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div>
                <h3 className="text-xl font-semibold text-white">Single post preview</h3>
                <p className="mt-1 text-sm font-light text-white/60">One punchy update to drop on X.</p>
              </div>
              {qualityScore !== undefined && (
                <div className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  qualityScore >= 85 ? "bg-green-500/20 text-green-400" :
                  qualityScore >= 70 ? "bg-yellow-500/20 text-yellow-400" :
                  qualityScore >= 60 ? "bg-orange-500/20 text-orange-400" :
                  "bg-red-500/20 text-red-400"
                }`}>
                  Quality: {qualityScore}/100
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handlePostThread}
                disabled={isPosting}
                className="bg-cyan-500 text-black font-semibold shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:bg-cyan-400 hover:shadow-[0_0_40px_rgba(0,255,255,0.5)]"
              >
                {isPosting ? "Posting..." : "Post to X"}
              </Button>
              <Button
                variant="outline"
                onClick={handleCopyAll}
                className="border-white/20 bg-white/5 text-white hover:border-white/40 hover:bg-white/10"
              >
                Copy post
              </Button>
              <Button
                variant="ghost"
                onClick={handleExport}
                className="text-white/70 hover:bg-white/10 hover:text-white"
              >
                Export .txt
              </Button>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="relative">
              <Textarea
                value={single.text}
                onChange={(event) => single.tweetNumber && onUpdateTweet(single.tweetNumber, event.target.value)}
                className="min-h-[200px] border-white/10 bg-transparent text-white placeholder:text-white/40 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                maxLength={maxLength}
              />
              <div className={`absolute bottom-2 right-2 text-xs font-mono ${getCharCountColor(single.text.length, maxLength)}`}>
                {single.text.length}/{maxLength}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {EMOJI_SUGGESTIONS.map((emoji) => (
                <button
                  key={`single-${emoji}`}
                  type="button"
                  onClick={() => single.tweetNumber && onUpdateTweet(single.tweetNumber, `${single.text} ${emoji}`.trim())}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80 transition-all duration-300 hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-400"
                >
                  {emoji}
                </button>
              ))}
              <EmojiPicker onEmojiSelect={(emoji) => single.tweetNumber && onUpdateTweet(single.tweetNumber, `${single.text} ${emoji}`.trim())} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-xl">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-cyan-400">Forecast</h4>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm font-light text-white/70">
            {estimatedImpressions ? (
              <div>
                <span className="text-white/50">Estimated impressions:</span> <span className="text-white">{estimatedImpressions}</span>
              </div>
            ) : null}
            {publishTips ? (
              <div>
                <span className="text-white/50">Publish tip:</span> <span className="text-white">{Array.isArray(publishTips) ? publishTips.join(', ') : publishTips}</span>
              </div>
            ) : null}
            {!estimatedImpressions && !publishTips ? (
              <div className="text-white/50">Post at peak hours and engage fast to spark the algorithm.</div>
            ) : null}
          </div>
        </div>

        {/* Sources Section for Single Posts */}
        {isGrounded && sources && sources.length > 0 && (
          <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold uppercase tracking-wider text-green-400">Grounded with Google Search</span>
                <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-semibold text-green-400">{sources.length} sources</span>
              </div>
              <button
                onClick={() => setShowSources(!showSources)}
                className="text-xs text-white/60 hover:text-white transition-colors"
              >
                {showSources ? "Hide sources" : "Show sources"}
              </button>
            </div>
            {showSources && (
              <div className="mt-4 space-y-3">
                {sources.map((source, idx) => (
                  <div key={idx} className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-cyan-400 hover:text-cyan-300 hover:underline"
                    >
                      {source.title}
                    </a>
                    {source.snippet && (
                      <p className="mt-1 text-xs text-white/60 line-clamp-2">{source.snippet}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-xl transition-all duration-500 hover:border-white/20">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-xl font-semibold text-white">Thread preview</h3>
              <p className="mt-1 text-sm font-light text-white/60">
                Edit copy, sprinkle emojis, then copy or export.
              </p>
            </div>
            {qualityScore !== undefined && (
              <div className={`rounded-full px-3 py-1 text-xs font-semibold ${
                qualityScore >= 85 ? "bg-green-500/20 text-green-400" :
                qualityScore >= 70 ? "bg-yellow-500/20 text-yellow-400" :
                qualityScore >= 60 ? "bg-orange-500/20 text-orange-400" :
                "bg-red-500/20 text-red-400"
              }`}>
                Quality: {qualityScore}/100
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handlePostThread}
              disabled={isPosting}
              className="bg-cyan-500 text-black font-semibold shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:bg-cyan-400 hover:shadow-[0_0_40px_rgba(0,255,255,0.5)]"
            >
              {isPosting ? "Posting..." : "Post to X"}
            </Button>
            <Button
              variant="outline"
              onClick={handleCopyAll}
              className="border-white/20 bg-white/5 text-white hover:border-white/40 hover:bg-white/10"
            >
              Copy all
            </Button>
            <Button
              variant="ghost"
              onClick={handleExport}
              className="text-white/70 hover:bg-white/10 hover:text-white"
            >
              Export .txt
            </Button>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {sortedThread.map((tweet) => (
              <div key={tweet.id} className="group/tweet rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/30 hover:bg-white/[0.07]">
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-sm font-semibold text-cyan-400">
                    #{(tweet.tweetNumber ?? 0) < 10 ? `0${tweet.tweetNumber}` : tweet.tweetNumber}
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => handleCopySingle(tweet)}
                    className="text-white/60 hover:bg-white/10 hover:text-cyan-400"
                  >
                    Copy
                  </Button>
                </div>
                <div className="relative">
                  <Textarea
                    value={tweet.text}
                    onChange={(event) => tweet.tweetNumber && onUpdateTweet(tweet.tweetNumber, event.target.value)}
                    className="min-h-[140px] border-white/10 bg-transparent text-white placeholder:text-white/40 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                    maxLength={280}
                  />
                  <div className={`absolute bottom-2 right-2 text-xs font-mono ${getCharCountColor(tweet.text.length, 280)}`}>
                    {tweet.text.length}/280
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {EMOJI_SUGGESTIONS.map((emoji) => (
                    <button
                      key={`${tweet.id}-${emoji}`}
                      type="button"
                      onClick={() => tweet.tweetNumber && onUpdateTweet(tweet.tweetNumber, `${tweet.text} ${emoji}`.trim())}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80 transition-all duration-300 hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-400"
                    >
                      {emoji}
                    </button>
                  ))}
                  <EmojiPicker onEmojiSelect={(emoji) => tweet.tweetNumber && onUpdateTweet(tweet.tweetNumber, `${tweet.text} ${emoji}`.trim())} />
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-xl">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-cyan-400">
          Forecast
        </h4>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm font-light text-white/70">
          {estimatedImpressions ? (
            <div>
              <span className="text-white/50">Estimated impressions:</span> <span className="text-white">{estimatedImpressions}</span>
            </div>
          ) : null}
          {publishTips ? (
            <div>
              <span className="text-white/50">Publish tip:</span> <span className="text-white">{Array.isArray(publishTips) ? publishTips.join(', ') : publishTips}</span>
            </div>
          ) : null}
          {!estimatedImpressions && !publishTips ? (
            <div className="text-white/50">
              Keep posting at peak hours (9AM EST slaps) and engage within 10 minutes.
            </div>
          ) : null}
        </div>
      </div>

      {/* Sources Section for Threads */}
      {isGrounded && sources && sources.length > 0 && (
        <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold uppercase tracking-wider text-green-400">Grounded with Google Search</span>
              <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-semibold text-green-400">{sources.length} sources</span>
            </div>
            <button
              onClick={() => setShowSources(!showSources)}
              className="text-xs text-white/60 hover:text-white transition-colors"
            >
              {showSources ? "Hide sources" : "Show sources"}
            </button>
          </div>
          {showSources && (
            <div className="mt-4 space-y-3">
              {sources.map((source, idx) => (
                <div key={idx} className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-cyan-400 hover:text-cyan-300 hover:underline"
                  >
                    {source.title}
                  </a>
                  {source.snippet && (
                    <p className="mt-1 text-xs text-white/60 line-clamp-2">{source.snippet}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
