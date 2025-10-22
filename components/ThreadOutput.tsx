"use client";

import { useMemo } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { ThreadTweet } from "@/types/thread";

const EMOJI_SUGGESTIONS = ["🚀", "🔥", "🛠️", "💡", "📈", "⚡", "🤝", "✨"];

type ThreadOutputProps = {
  thread: ThreadTweet[];
  onUpdateTweet: (tweetNumber: number, value: string) => void;
  estimatedImpressions?: string;
  publishTips?: string;
};

export function ThreadOutput({ thread, onUpdateTweet, estimatedImpressions, publishTips }: ThreadOutputProps) {
  const fullThread = useMemo(
    () =>
      [...thread]
        .sort((a, b) => a.tweetNumber - b.tweetNumber)
        .map((tweet) => `${tweet.tweetNumber}. ${tweet.text}`)
        .join("\n\n"),
    [thread]
  );

  const handleCopyAll = async () => {
    if (!navigator?.clipboard) {
      toast.error("Clipboard not available on this device.");
      return;
    }
    await navigator.clipboard.writeText(fullThread);
    toast.success("Copied entire thread. Go ship it!");
  };

  const handleExport = () => {
    const blob = new Blob([fullThread], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "threadforge-thread.txt";
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

  if (thread.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-800 bg-neutral-950/40 p-8 text-center text-sm text-neutral-500">
        Your AI-crafted thread will show up here. Until then, keep dreaming in public.
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
            <Button variant="outline" onClick={handleCopyAll}>
              Copy all
            </Button>
            <Button variant="ghost" onClick={handleExport}>
              Export .txt
            </Button>
          </div>
        </div>

        <div className="space-y-5">
          {[...thread]
            .sort((a, b) => a.tweetNumber - b.tweetNumber)
            .map((tweet) => (
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
