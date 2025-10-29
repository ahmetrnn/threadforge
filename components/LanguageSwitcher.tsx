"use client";

import { useLanguage } from "@/lib/i18n/context";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="fixed left-6 top-6 z-50">
      <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-2xl transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,255,0.15)]">
        {/* Rotating cyan light around the frame */}
        <div className="pointer-events-none absolute inset-0 rounded-xl">
          <div
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent blur-sm animate-[spin_3s_linear_infinite]"
            style={{
              maskImage: "linear-gradient(black, black) content-box, linear-gradient(black, black)",
              maskComposite: "exclude",
              WebkitMaskComposite: "xor",
              padding: "1px",
            }}
          />
        </div>

        <div className="relative z-10 flex gap-1 p-1">
          <button
            onClick={() => setLanguage("en")}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-300 ${
              language === "en"
                ? "bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.3)]"
                : "text-white/50 hover:bg-white/5 hover:text-white/80"
            }`}
          >
            <span className="text-sm">🇺🇸</span>
            <span>EN</span>
          </button>
          <button
            onClick={() => setLanguage("tr")}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-300 ${
              language === "tr"
                ? "bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.3)]"
                : "text-white/50 hover:bg-white/5 hover:text-white/80"
            }`}
          >
            <span className="text-sm">🇹🇷</span>
            <span>TR</span>
          </button>
        </div>
      </div>
    </div>
  );
}
