'use client';

import clsx from 'clsx';

import type { ThreadMode } from '@/types/thread';

type ThreadModeToggleProps = {
  mode: ThreadMode;
  onChange: (mode: ThreadMode) => void;
  className?: string;
};

const MODES: Array<{ value: ThreadMode; title: string; description: string }> = [
  { value: 'thread', title: 'Full Thread', description: '4-6 tweet breakdown' },
  { value: 'single', title: 'Quick Post', description: '1 punchy update' },
];

export function ThreadModeToggle({ mode, onChange, className }: ThreadModeToggleProps) {
  // Toggle for lazy days: Single post, pro days: Full thread
  return (
    <div
      className={clsx(
        'flex flex-wrap gap-2 rounded-xl border border-neutral-800 bg-neutral-950/60 p-2',
        className,
      )}
    >
      {MODES.map((option) => {
        const isActive = mode === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={isActive}
            className={clsx(
              'flex-1 min-w-[140px] rounded-lg px-4 py-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand',
              isActive
                ? 'bg-brand/15 text-brand border border-brand/40 shadow-[0_0_0_1px_rgba(250,204,21,0.3)]'
                : 'border border-transparent text-neutral-300 hover:bg-neutral-900/60',
            )}
          >
            <div className="flex items-center justify-between text-sm font-semibold text-neutral-100">
              <span>{option.title}</span>
              {isActive ? <span className="text-xs uppercase tracking-wide text-brand">Live</span> : null}
            </div>
            <p className="mt-1 text-xs text-neutral-400">{option.description}</p>
          </button>
        );
      })}
    </div>
  );
}
