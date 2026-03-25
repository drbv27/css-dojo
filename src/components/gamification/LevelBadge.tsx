"use client";

interface LevelBadgeProps {
  rank: {
    name: string;
    color: string;
    icon: string;
  };
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASSES = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
  lg: "px-4 py-1.5 text-base",
} as const;

export function LevelBadge({ rank, size = "md" }: LevelBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold transition-colors ${SIZE_CLASSES[size]}`}
      style={{
        color: rank.color,
        borderWidth: "1.5px",
        borderColor: `${rank.color}50`,
        backgroundColor: `${rank.color}10`,
      }}
    >
      {rank.name}
    </span>
  );
}
