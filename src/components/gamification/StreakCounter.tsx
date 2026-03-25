"use client";

import { Flame } from "lucide-react";

interface StreakCounterProps {
  streak: number;
}

export function StreakCounter({ streak }: StreakCounterProps) {
  const isActive = streak > 0;

  return (
    <div className="flex items-center gap-1.5">
      <Flame
        className={`h-5 w-5 transition-colors ${
          isActive ? "text-neon-orange drop-shadow-[0_0_4px_var(--color-neon-orange)]" : "text-editor-muted"
        }`}
      />
      <span
        className={`text-sm font-bold tabular-nums ${
          isActive ? "text-editor-text" : "text-editor-muted"
        }`}
      >
        {streak}
      </span>
    </div>
  );
}
