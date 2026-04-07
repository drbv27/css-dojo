"use client";

interface LevelBadgeProps {
  rank: {
    name: string;
    color: string;
    icon: string;
  };
  size?: "sm" | "md" | "lg";
}

function BeltIcon({ color, size }: { color: string; size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Belt band */}
      <rect x="2" y="9" width="20" height="6" rx="1.5" fill={color} opacity="0.9" />
      {/* Knot center */}
      <rect x="9" y="7" width="6" height="10" rx="1.5" fill={color} />
      {/* Knot highlight */}
      <rect x="10.5" y="8.5" width="3" height="7" rx="1" fill="currentColor" opacity="0.15" />
      {/* Belt shine */}
      <rect x="3" y="10" width="5" height="1.5" rx="0.75" fill="white" opacity="0.2" />
      <rect x="16" y="10" width="5" height="1.5" rx="0.75" fill="white" opacity="0.2" />
    </svg>
  );
}

function MasterIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Star/crown shape */}
      <path
        d="M12 2L14.5 8.5L21 9.5L16.5 14L17.5 21L12 17.5L6.5 21L7.5 14L3 9.5L9.5 8.5L12 2Z"
        fill="#FFD700"
        opacity="0.9"
      />
      <path
        d="M12 5L13.8 9.5L18.5 10.2L15.25 13.3L16 18L12 15.8L8 18L8.75 13.3L5.5 10.2L10.2 9.5L12 5Z"
        fill="#FFA500"
        opacity="0.5"
      />
    </svg>
  );
}

const ICON_SIZES = {
  sm: 14,
  md: 18,
  lg: 22,
} as const;

const SIZE_CLASSES = {
  sm: "px-2 py-0.5 text-[11px] gap-1",
  md: "px-2.5 py-1 text-xs gap-1.5",
  lg: "px-3 py-1.5 text-sm gap-2",
} as const;

export function LevelBadge({ rank, size = "md" }: LevelBadgeProps) {
  const iconSize = ICON_SIZES[size];
  const isMaster = rank.icon === "belt-master";

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold transition-colors ${SIZE_CLASSES[size]}`}
      style={{
        color: rank.color,
        borderWidth: "1.5px",
        borderColor: `${rank.color}50`,
        backgroundColor: `${rank.color}10`,
      }}
    >
      {isMaster ? (
        <MasterIcon size={iconSize} />
      ) : (
        <BeltIcon color={rank.color} size={iconSize} />
      )}
      {rank.name}
    </span>
  );
}
