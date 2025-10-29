"use client";

type CreditsDisplayProps = {
  remainingCredits: number;
  isPro: boolean;
};

export function CreditsDisplay({ remainingCredits, isPro }: CreditsDisplayProps) {
  return (
    <div className="fixed right-6 top-6 z-50">
      <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-3 backdrop-blur-2xl transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(124,58,237,0.3)]">
        {/* Rotating purple light around the frame */}
        <div className="pointer-events-none absolute inset-0 rounded-xl">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-purple-500/60 to-transparent blur-sm animate-[spin_3s_linear_infinite]"
               style={{
                 maskImage: 'linear-gradient(black, black) content-box, linear-gradient(black, black)',
                 maskComposite: 'exclude',
                 WebkitMaskComposite: 'xor',
                 padding: '1px'
               }}
          />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          {/* Icon */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/10 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <svg
              className="h-4 w-4 text-cyan-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>

          {/* Credits Info */}
          <div className="flex flex-col">
            <span className="text-[10px] font-medium uppercase tracking-wider text-white/50">
              {isPro ? "Pro" : "Credits"}
            </span>
            <div className="flex items-baseline gap-1.5">
              {isPro ? (
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-xl font-bold leading-none text-transparent">
                  ∞
                </span>
              ) : (
                <>
                  <span className="text-xl font-bold leading-none text-white">
                    {remainingCredits}
                  </span>
                  <span className="text-xs font-light text-white/50">/100</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Progress bar for free users */}
        {!isPro && (
          <div className="relative mt-2.5 h-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 shadow-[0_0_8px_rgba(0,255,255,0.5)] transition-all duration-500"
              style={{ width: `${(remainingCredits / 100) * 100}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
