"use client";

import { useAuth } from "@/hooks/useAuth";
import { getRank, getXPProgress, getNextRank } from "@/lib/xp";
import { LevelBadge } from "./LevelBadge";
import { StreakCounter } from "./StreakCounter";

export default function SidebarXP() {
  const { user } = useAuth();

  if (!user) return null;

  const rank = getRank(user.xp);
  const nextRank = getNextRank(user.xp);
  const progress = getXPProgress(user.xp);

  return (
    <div className="px-4 py-3 border-t border-editor-border space-y-3">
      {/* Rank badge and streak */}
      <div className="flex items-center justify-between">
        <LevelBadge rank={rank} size="sm" />
        <StreakCounter streak={user.currentStreak} />
      </div>

      {/* XP progress bar */}
      <div className="space-y-1">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-editor-bg">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progress.percentage}%`,
              background: `linear-gradient(90deg, ${rank.color}CC, ${rank.color})`,
              boxShadow: `0 0 6px ${rank.color}40`,
            }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-editor-muted">
          <span>
            <span className="font-semibold text-editor-text">{user.xp}</span> XP
          </span>
          {nextRank ? (
            <span>{nextRank.name}: {nextRank.minXP} XP</span>
          ) : (
            <span>Rango maximo</span>
          )}
        </div>
      </div>
    </div>
  );
}
