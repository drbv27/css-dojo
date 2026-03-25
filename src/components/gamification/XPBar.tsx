"use client";

interface XPBarProps {
  currentXP: number;
  nextLevelXP: number;
  rankName: string;
  rankColor: string;
}

export function XPBar({ currentXP, nextLevelXP, rankName, rankColor }: XPBarProps) {
  const percentage = nextLevelXP > 0 ? Math.min((currentXP / nextLevelXP) * 100, 100) : 100;

  return (
    <div className="w-full space-y-1.5">
      {/* Rank label */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold" style={{ color: rankColor }}>
          {rankName}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-editor-surface">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${rankColor}CC, ${rankColor})`,
            boxShadow: `0 0 8px ${rankColor}40`,
          }}
        />
      </div>

      {/* XP text */}
      <p className="text-xs text-editor-muted">
        <span className="font-semibold text-editor-text">{currentXP.toLocaleString()}</span>
        {" / "}
        <span>{nextLevelXP > 0 ? nextLevelXP.toLocaleString() : "MAX"}</span>
        {" XP"}
      </p>
    </div>
  );
}
