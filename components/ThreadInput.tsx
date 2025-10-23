"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ThreadMode } from "@/types/thread";

type ThreadInputProps = {
  onGenerate: (values: { draft: string; refinePrompt?: string; mode: ThreadMode; style: string }) => void;
  isGenerating: boolean;
  remainingCredits: number;
  isPro: boolean;
  mode: ThreadMode;
  onModeChange: (mode: ThreadMode) => void;
};

export function ThreadInput({
  onGenerate,
  isGenerating,
  remainingCredits,
  isPro,
  mode,
  onModeChange,
}: ThreadInputProps) {
  const [draft, setDraft] = useState("");
  const [refinePrompt, setRefinePrompt] = useState("");
  const [selectedMode, setSelectedMode] = useState<ThreadMode>(mode);
  const [style, setStyle] = useState("raw");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setSelectedMode(mode);
  }, [mode]);

  const submissionsLocked = !isPro && remainingCredits <= 0;

  const handleModeSelection = (nextMode: ThreadMode) => {
    setSelectedMode(nextMode);
    onModeChange(nextMode);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedDraft = draft.trim();
    const trimmedRefine = refinePrompt.trim();

    const payload = {
      draft: trimmedDraft,
      refinePrompt: trimmedRefine ? trimmedRefine : undefined,
      mode: selectedMode,
      style,
    };

    console.log("[ThreadInput] handleSubmit triggered – payload:", payload);

    if (!trimmedDraft) {
      setError("Draft boş olamaz, önce kaba halini yaz!");
      return;
    }

    setError("");
    onGenerate(payload);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-950/60 p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="draft" className="text-sm font-medium text-neutral-200">
            Draft tweet'in (kaba halini yaz)
          </label>
          <Textarea
            id="draft"
            placeholder="Örn: Vibe coding kaosu, bug'lar her yerde ama Pomodoro tweak yaptım..."
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value);
              console.log("[ThreadInput] Draft change:", event.target.value);
            }}
            rows={6}
            disabled={isGenerating}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="refinePrompt" className="text-sm font-medium text-neutral-200">
            Refine prompt (opsiyonel — örn: &quot;funny yap, thread'e çevir&quot;)
          </label>
          <Input
            id="refinePrompt"
            placeholder="Opsiyonel: örn. 'funny yap, CTA DM olsun'"
            value={refinePrompt}
            onChange={(event) => {
              setRefinePrompt(event.target.value);
              console.log("[ThreadInput] Refine prompt change:", event.target.value);
            }}
            disabled={isGenerating}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="mode" className="text-sm font-medium text-neutral-200">
            Mode
          </label>
          <Select
            value={selectedMode}
            onValueChange={(val) => handleModeSelection(val as ThreadMode)}
            disabled={isGenerating}
          >
            <SelectTrigger id="mode">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thread">Full Thread (4-6 tweet)</SelectItem>
              <SelectItem value="single">Quick Single Post</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="style" className="text-sm font-medium text-neutral-200">
            Style
          </label>
          <Select
            value={style}
            onValueChange={(val) => setStyle(val)}
            disabled={isGenerating}
          >
            <SelectTrigger id="style">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="raw">Raw narrative</SelectItem>
              <SelectItem value="funny">Funny (self-deprecating)</SelectItem>
              <SelectItem value="inspirational">Inspirational journey</SelectItem>
              <SelectItem value="data-driven">Data-driven listicle</SelectItem>
              <SelectItem value="teaser">Teaser mystery</SelectItem>
              <SelectItem value="narrative">Narrative story</SelectItem>
              <SelectItem value="listicle">Listicle hacks</SelectItem>
              <SelectItem value="question-based">Question-based cliffhanger</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {error ? (
          <p className="rounded bg-red-900/20 p-2 text-sm text-red-500">{error}</p>
        ) : null}

        <Button
          type="submit"
          disabled={isGenerating || submissionsLocked || !draft.trim()}
          className="w-full"
        >
          {isGenerating
            ? "Forging..."
            : submissionsLocked
              ? "Out of Credits – Upgrade!"
              : `Forge ${selectedMode === "thread" ? "Thread" : "Post"}`}
        </Button>

        {submissionsLocked && !isPro ? (
          <p className="text-sm text-orange-400">
            Free limit hit. Pro'ya geç, unlimited vibe!
          </p>
        ) : null}
      </form>
    </div>
  );
}
