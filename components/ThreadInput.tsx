"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

const VIBES = [
  { value: "funny", label: "Funny" },
  { value: "inspirational", label: "Inspirational" },
  { value: "raw", label: "Raw" },
  { value: "data-driven", label: "Data-driven" },
  { value: "teaser", label: "Teaser" },
];

const TEMPLATES = [
  "Daily Progress",
  "Product Teaser",
  "BTS",
  "AMA",
  "Growth Hack",
];

type ThreadInputValues = {
  topic: string;
  vibe: string;
  template: string;
};

type ThreadInputProps = {
  onGenerate: (values: ThreadInputValues) => Promise<void>;
  isGenerating: boolean;
  remainingCredits: number;
  isPro: boolean;
};

export function ThreadInput({ onGenerate, isGenerating, remainingCredits, isPro }: ThreadInputProps) {
  const [topic, setTopic] = useState("");
  const [vibe, setVibe] = useState(VIBES[0]?.value ?? "funny");
  const [template, setTemplate] = useState(TEMPLATES[0]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!topic.trim()) {
      toast.error("Drop a topic first. ThreadForge needs a spark.");
      return;
    }

    await onGenerate({ topic, vibe, template });
  };

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-6 shadow-lg shadow-brand/5">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-neutral-50">Generate your thread</h2>
          <p className="text-sm text-neutral-400">
            Toss in a topic. ThreadForge will cook up hooks, emojis, cliffhangers — the works.
          </p>
        </div>
        <Badge className="bg-brand/20 text-brand">Vibe check: This hook slaps</Badge>
      </div>

      <div className="mb-5">
        <p className="text-sm text-neutral-400">
          {isPro ? "Pro mode unlocked — generate without limits." : `You have ${Math.max(remainingCredits, 0)} free threads left this month.`}
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-200">Topic</label>
          <Textarea
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="Bootstrapping a micro-SaaS, teasing your next launch, or dissecting a growth lever? Drop it here."
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-200">Vibe</label>
            <Select value={vibe} onChange={(event) => setVibe(event.target.value)}>
              {VIBES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-200">Template</label>
            <Select value={template} onChange={(event) => setTemplate(event.target.value)}>
              {TEMPLATES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isGenerating}>
          {isGenerating ? "Summoning thread magic..." : "Generate thread"}
        </Button>
      </form>
    </div>
  );
}
