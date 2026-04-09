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

// Apprentice character
function ApprenticeFace({ color, label, solved }: { color: string; label: string; solved?: boolean }) {
  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: "56px", height: "70px" }}
    >
      {/* Glow - bigger when solved */}
      <div
        className="absolute rounded-full transition-all duration-700"
        style={{
          width: solved ? "70px" : "50px",
          height: solved ? "70px" : "50px",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -55%)",
          backgroundColor: color,
          filter: `blur(${solved ? "16px" : "10px"})`,
          opacity: solved ? 0.5 : 0.3,
        }}
      />

      {/* Body with bounce animation when solved */}
      <div
        className="relative rounded-full flex flex-col items-center justify-center border-2"
        style={{
          width: "52px",
          height: "52px",
          background: `radial-gradient(circle at 35% 35%, ${color}DD, ${color}88)`,
          borderColor: `${color}CC`,
          boxShadow: solved
            ? `0 0 30px ${color}50, inset 0 -4px 8px ${color}40`
            : `0 0 16px ${color}25, inset 0 -4px 8px ${color}40`,
          animation: solved ? "apprenticeBounce 0.6s ease-out" : "none",
          transition: "box-shadow 0.5s ease",
        }}
      >
        {/* Belt */}
        <div
          className="absolute w-full h-[3px] top-[55%]"
          style={{ backgroundColor: `${color}CC`, boxShadow: `0 0 6px ${color}60` }}
        />

        {/* Face */}
        {solved ? (
          <>
            {/* Happy eyes: two curved lines like ^  ^ */}
            <div className="flex items-center gap-[8px] -mt-1">
              <div style={{ width: "8px", height: "5px", borderTop: "2.5px solid rgba(255,255,255,0.95)", borderRadius: "50%" }} />
              <div style={{ width: "8px", height: "5px", borderTop: "2.5px solid rgba(255,255,255,0.95)", borderRadius: "50%" }} />
            </div>
            {/* Big smile */}
            <div style={{ width: "12px", height: "6px", borderBottom: "2.5px solid rgba(255,255,255,0.9)", borderRadius: "0 0 50% 50%", marginTop: "3px" }} />
          </>
        ) : (
          <>
            {/* Normal eyes: dots */}
            <div className="flex items-center gap-[8px] -mt-0.5">
              <div className="w-[5px] h-[5px] rounded-full bg-white/90" />
              <div className="w-[5px] h-[5px] rounded-full bg-white/90" />
            </div>
            {/* Small neutral mouth */}
            <div className="w-[6px] h-[2px] rounded-full bg-white/30 mt-[3px]" />
          </>
        )}

        {/* Celebration sparkles when solved */}
        {solved && (
          <>
            <div className="absolute -top-1 -right-1 text-[8px] animate-ping" style={{ animationDuration: "1s" }}>✦</div>
            <div className="absolute -top-2 left-0 text-[6px] animate-ping" style={{ animationDuration: "1.3s", animationDelay: "0.2s" }}>✦</div>
            <div className="absolute top-0 -left-2 text-[7px] animate-ping" style={{ animationDuration: "1.1s", animationDelay: "0.4s" }}>✦</div>
          </>
        )}
      </div>

      {/* Label */}
      <div
        className="absolute -bottom-0 text-[10px] font-bold tracking-wider"
        style={{ color: color, textShadow: `0 0 8px ${color}60` }}
      >
        {label}
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
