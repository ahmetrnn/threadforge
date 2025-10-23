"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { ThreadMode, ThreadTweet } from "@/types/thread";

const EMOJI_SUGGESTIONS = ["🚀", "🔥", "🛠️", "💡", "📈", "⚡", "🤝", "✨"];

type ThreadOutputProps = {
  thread: ThreadTweet[];
  onUpdateTweet: (tweetNumber: number, value: string) => void;
  estimatedImpressions?: string;
  publishTips?: string;
  mode: ThreadMode;
};

export function ThreadOutput({ thread, onUpdateTweet, estimatedImpressions, publishTips, mode }: ThreadOutputProps) {
  const sortedThread = useMemo(
    () => [...thread].sort((a, b) => a.tweetNumber - b.tweetNumber),
    [thread]
  );
  const fullThread = useMemo(() => {
    if (mode === "single") {
      return sortedThread[0]?.text ?? "";
    }
    return sortedThread.map((tweet) => `${tweet.tweetNumber}. ${tweet.text}`).join("\n\n");
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
    toast.success(`Tweet ${tweet.tweetNumber} copied`);
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
        const error = await response.json().catch(() => ({ message: "Unable to post thread." }));
        toast.error(error.message ?? "X declined the request. Try again.");
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

  if (sortedThread.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-800 bg-neutral-950/40 p-8 text-center text-sm text-neutral-500">
        {mode === "thread"
          ? "Your AI-crafted thread will show up here. Until then, keep dreaming in public."
          : "Your AI-crafted single post will show up here. Until then, keep dreaming in public."}
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
        <div className="flex flex-col gap-3 rounded-2xl border border-neutral-800 bg-neutral-950/60 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-neutral-50">Single post preview</h3>
              <p className="text-sm text-neutral-400">One punchy update to drop on X.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handlePostThread} disabled={isPosting}>
                {isPosting ? "Posting..." : "Post to X"}
              </Button>
              <Button variant="outline" onClick={handleCopyAll}>
                Copy post
              </Button>
              <Button variant="ghost" onClick={handleExport}>
                Export .txt
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-950/80 p-4">
            <Textarea
              value={single.text}
              onChange={(event) => onUpdateTweet(single.tweetNumber, event.target.value)}
              className="min-h-[200px]"
            />
            <div className="mt-3 flex flex-wrap gap-2 text-sm text-neutral-400">
              {EMOJI_SUGGESTIONS.map((emoji) => (
                <button
                  key={`single-${emoji}`}
                  type="button"
                  onClick={() => onUpdateTweet(single.tweetNumber, `${single.text} ${emoji}`.trim())}
                  className="rounded-full bg-neutral-900 px-3 py-1 text-neutral-300 transition hover:bg-brand/20 hover:text-brand"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-6">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">Forecast</h4>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-neutral-300">
            {estimatedImpressions ? (
              <div>
                <span className="text-neutral-500">Estimated impressions:</span> {estimatedImpressions}
              </div>
            ) : null}
            {publishTips ? (
              <div>
                <span className="text-neutral-500">Publish tip:</span> {publishTips}
              </div>
            ) : null}
            {!estimatedImpressions && !publishTips ? (
              <div className="text-neutral-500">Post at peak hours and engage fast to spark the algorithm.</div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-neutral-800 bg-neutral-950/60 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-neutral-50">Thread preview</h3>
            <p className="text-sm text-neutral-400">
              Edit copy, sprinkle emojis, then copy or export.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handlePostThread} disabled={isPosting}>
              {isPosting ? "Posting..." : "Post to X"}
            </Button>
            <Button variant="outline" onClick={handleCopyAll}>
              Copy all
            </Button>
            <Button variant="ghost" onClick={handleExport}>
              Export .txt
            </Button>
          </div>
        </div>

        <div className="space-y-5">
          {sortedThread.map((tweet) => (
              <div key={tweet.tweetNumber} className="rounded-xl border border-neutral-800 bg-neutral-950/80 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-sm font-semibold text-brand">
                    #{tweet.tweetNumber < 10 ? `0${tweet.tweetNumber}` : tweet.tweetNumber}
                  </div>
                  <Button variant="ghost" onClick={() => handleCopySingle(tweet)}>
                    Copy
                  </Button>
                </div>
                <Textarea
                  value={tweet.text}
                  onChange={(event) => onUpdateTweet(tweet.tweetNumber, event.target.value)}
                  className="min-h-[140px]"
                />
                <div className="mt-3 flex flex-wrap gap-2 text-sm text-neutral-400">
                  {EMOJI_SUGGESTIONS.map((emoji) => (
                    <button
                      key={`${tweet.tweetNumber}-${emoji}`}
                      type="button"
                      onClick={() => onUpdateTweet(tweet.tweetNumber, `${tweet.text} ${emoji}`.trim())}
                      className="rounded-full bg-neutral-900 px-3 py-1 text-neutral-300 transition hover:bg-brand/20 hover:text-brand"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-6">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">
          Forecast
        </h4>
        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-neutral-300">
          {estimatedImpressions ? (
            <div>
              <span className="text-neutral-500">Estimated impressions:</span> {estimatedImpressions}
            </div>
          ) : null}
          {publishTips ? (
            <div>
              <span className="text-neutral-500">Publish tip:</span> {publishTips}
            </div>
          ) : null}
          {!estimatedImpressions && !publishTips ? (
            <div className="text-neutral-500">
              Keep posting at peak hours (9AM EST slaps) and engage within 10 minutes.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
