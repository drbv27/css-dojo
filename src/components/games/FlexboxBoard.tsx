"use client";

import { useMemo } from "react";

interface FlexboxBoardProps {
  css: string;
  boardConfig: {
    items: { id: string; color: string; label: string }[];
    targets?: { id: string; gridArea: string }[];
    containerStyle?: Record<string, string>;
  };
  solved?: boolean;
}

function parseCSS(cssText: string): Record<string, string> {
  const styles: Record<string, string> = {};
  const cleaned = cssText.replace(/\/\*[\s\S]*?\*\//g, "");
  const matches = cleaned.matchAll(/([a-z-]+)\s*:\s*([^;]+)/gi);
  for (const match of matches) {
    styles[match[1].trim()] = match[2].trim();
  }
  return styles;
}

// Apprentice face based on state
function ApprenticeFace({ color, label, solved }: { color: string; label: string; solved?: boolean }) {
  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{
        width: "52px",
        height: "52px",
      }}
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-full blur-md opacity-40"
        style={{ backgroundColor: color }}
      />

      {/* Body */}
      <div
        className="relative w-full h-full rounded-full flex flex-col items-center justify-center border-2 transition-all duration-300"
        style={{
          background: `radial-gradient(circle at 35% 35%, ${color}DD, ${color}88)`,
          borderColor: `${color}CC`,
          boxShadow: `0 0 20px ${color}30, inset 0 -4px 8px ${color}40`,
        }}
      >
        {/* Belt */}
        <div
          className="absolute w-full h-[3px] top-[55%] opacity-70"
          style={{ backgroundColor: `${color}FF`, boxShadow: `0 0 6px ${color}80` }}
        />

        {/* Face */}
        <div className="flex items-center gap-[6px] -mt-1">
          {solved ? (
            // Happy face (^ ^)
            <>
              <span className="text-[9px] font-bold text-white/90 leading-none">^</span>
              <span className="text-[9px] font-bold text-white/90 leading-none">^</span>
            </>
          ) : (
            // Normal face (° °)
            <>
              <div className="w-[5px] h-[5px] rounded-full bg-white/90" />
              <div className="w-[5px] h-[5px] rounded-full bg-white/90" />
            </>
          )}
        </div>

        {/* Mouth */}
        <div className={`mt-[2px] ${solved ? "w-2 h-1 rounded-b-full bg-white/60" : "w-1.5 h-1.5 rounded-full bg-white/30"}`} />

        {/* Label */}
        <div
          className="absolute -bottom-5 text-[10px] font-bold tracking-wider"
          style={{ color: color, textShadow: `0 0 8px ${color}60` }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

export default function FlexboxBoard({ css, boardConfig, solved = false }: FlexboxBoardProps) {
  const userStyles = useMemo(() => parseCSS(css), [css]);

  const containerStyle: React.CSSProperties = {
    display: "flex",
    width: "100%",
    height: "100%",
    minHeight: "200px",
    transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
    ...boardConfig.containerStyle,
  };

  const flexProperties = [
    "justify-content", "align-items", "align-content",
    "flex-direction", "flex-wrap", "flex-flow", "gap",
    "row-gap", "column-gap",
  ];

  for (const prop of flexProperties) {
    if (userStyles[prop]) {
      const camelCase = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      (containerStyle as any)[camelCase] = userStyles[prop];
    }
  }

  const getItemStyle = (itemId: string, index: number): React.CSSProperties => {
    const style: React.CSSProperties = {
      transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
    };

    const itemSelector = `#item-${index + 1}`;
    const regex = new RegExp(
      itemSelector.replace("#", "\\#") + "\\s*\\{([^}]+)\\}",
      "i"
    );
    const match = css.match(regex);
    if (match) {
      const itemStyles = parseCSS(match[1]);
      const itemProps = ["order", "align-self", "flex-grow", "flex-shrink", "flex-basis", "flex"];
      for (const prop of itemProps) {
        if (itemStyles[prop]) {
          const camelCase = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
          (style as any)[camelCase] = itemStyles[prop];
        }
      }
    }

    const globalItemProps = ["order", "align-self", "flex-grow", "flex-shrink", "flex-basis", "flex"];
    for (const prop of globalItemProps) {
      if (userStyles[prop] && !match) {
        const camelCase = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        (style as any)[camelCase] = userStyles[prop];
      }
    }

    return style;
  };

  const hasInput = css.trim().length > 0;

  return (
    <div className="w-full h-full p-6 flex items-center justify-center">
      {/* Arena */}
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden relative"
        style={{
          backgroundColor: "#12121f",
          minHeight: "300px",
          border: `2px solid ${solved ? "rgba(166, 227, 161, 0.4)" : hasInput ? "rgba(148, 226, 213, 0.15)" : "rgba(69, 71, 90, 0.5)"}`,
          transition: "all 0.8s ease",
          boxShadow: solved
            ? "0 0 60px rgba(166, 227, 161, 0.15), inset 0 0 80px rgba(166, 227, 161, 0.05)"
            : hasInput
            ? "0 0 40px rgba(148, 226, 213, 0.05), inset 0 0 60px rgba(148, 226, 213, 0.02)"
            : "none",
        }}
      >
        {/* Tatami grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,226,213,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(148,226,213,0.8) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Subtle radial glow in center */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at center, rgba(148,226,213,0.03) 0%, transparent 70%)",
          }}
        />

        {/* Corner decorations */}
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-neon-teal/20 rounded-tl" />
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-neon-teal/20 rounded-tr" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-neon-teal/20 rounded-bl" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-neon-teal/20 rounded-br" />

        {/* Arena label */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-[0.3em] text-neon-teal/20 font-bold">
          arena
        </div>

        {/* Flex container */}
        <div style={containerStyle} className="p-8 relative z-10">
          {boardConfig.items.map((item, i) => (
            <div
              key={item.id}
              style={getItemStyle(item.id, i)}
            >
              <ApprenticeFace
                color={item.color}
                label={item.label}
                solved={solved}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
