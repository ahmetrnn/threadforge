"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const EMOJI_CATEGORIES = {
  "Trending": ["🔥", "🚀", "💪", "⚡", "✨", "🎯", "💡", "📈", "🎉", "👀", "💀", "🤝"],
  "Emotions": ["😊", "😂", "😍", "🤔", "😎", "🥳", "😤", "😬", "🙌", "👏", "🤯", "😱"],
  "Tech": ["💻", "📱", "⌨️", "🖥️", "🛠️", "⚙️", "🔧", "📡", "🔌", "💾", "🖱️", "🤖"],
  "Business": ["💰", "💵", "💸", "📊", "📈", "📉", "💼", "🏆", "📝", "📚", "🎓", "🏢"],
  "Symbols": ["✅", "❌", "⭐", "🌟", "💫", "🎪", "🎨", "🔗", "📌", "🚨", "⚠️", "🔔"],
  "Food": ["☕", "🍕", "🍔", "🍟", "🌮", "🥗", "🍺", "🍷", "🧃", "🥤", "🍪", "🧁"],
  "Objects": ["📦", "🎁", "🔑", "🏠", "🚗", "✈️", "🌍", "🌙", "⏰", "💊", "🧲", "🎯"],
  "Hands": ["👍", "👎", "👊", "✊", "🤝", "🙏", "👋", "✋", "🖐️", "👌", "🤟", "🤘"],
};

type EmojiPickerProps = {
  onEmojiSelect: (emoji: string) => void;
  className?: string;
};

export function EmojiPicker({ onEmojiSelect, className = "" }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<keyof typeof EMOJI_CATEGORIES>("Trending");

  if (!isOpen) {
    return (
      <Button
        type="button"
        variant="ghost"
        onClick={() => setIsOpen(true)}
        className={`text-white/70 hover:bg-white/10 hover:text-white ${className}`}
      >
        😀 Add Emoji
      </Button>
    );
  }

  return (
    <div className="relative inline-block">
      <Button
        type="button"
        variant="ghost"
        onClick={() => setIsOpen(false)}
        className={`text-white/70 hover:bg-white/10 hover:text-white ${className}`}
      >
        Close Picker
      </Button>

      <div className="absolute left-0 top-full z-50 mt-2 w-80 rounded-xl border border-white/10 bg-[#0a0a0a] p-4 shadow-2xl backdrop-blur-xl">
        {/* Category tabs */}
        <div className="mb-3 flex flex-wrap gap-1">
          {Object.keys(EMOJI_CATEGORIES).map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category as keyof typeof EMOJI_CATEGORIES)}
              className={`rounded-lg px-2 py-1 text-xs font-medium transition-all ${
                activeCategory === category
                  ? "bg-cyan-500/20 text-cyan-400"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Emoji grid */}
        <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
          {EMOJI_CATEGORIES[activeCategory].map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => {
                onEmojiSelect(emoji);
                setIsOpen(false);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-2xl transition-all hover:bg-cyan-500/10 hover:scale-110"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
