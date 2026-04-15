"use client";

import { useMemo } from "react";

interface GridBoardProps {
  css: string;
  boardConfig: {
    columns: number;
    rows: number;
    items: { id: string; color: string; label: string; targetArea?: string }[];
    highlightCells?: string[];
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

function parseSelectorBlocks(cssText: string): Record<string, Record<string, string>> {
  const blocks: Record<string, Record<string, string>> = {};
  const cleaned = cssText.replace(/\/\*[\s\S]*?\*\//g, "");
  const regex = /([^{]+)\{([^}]+)\}/g;
  let match;
  while ((match = regex.exec(cleaned)) !== null) {
    const selector = match[1].trim();
    const props = parseCSS(match[2]);
    blocks[selector] = props;
  }
  return blocks;
}

// Apprentice character (same as FlexboxBoard)
function ApprenticeFace({ color, label, solved }: { color: string; label: string; solved?: boolean }) {
  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: "100%", height: "100%", minHeight: "48px", minWidth: "48px" }}
    >
      {/* Glow */}
      <div
        className="absolute rounded-full transition-all duration-700"
        style={{
          width: solved ? "60px" : "44px",
          height: solved ? "60px" : "44px",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: color,
          filter: `blur(${solved ? "14px" : "8px"})`,
          opacity: solved ? 0.5 : 0.3,
        }}
      />

      {/* Body */}
      <div
        className="relative rounded-full flex flex-col items-center justify-center border-2"
        style={{
          width: "46px",
          height: "46px",
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
            <div className="flex items-center gap-[7px] -mt-1">
              <div style={{ width: "7px", height: "4px", borderTop: "2px solid rgba(255,255,255,0.95)", borderRadius: "50%" }} />
              <div style={{ width: "7px", height: "4px", borderTop: "2px solid rgba(255,255,255,0.95)", borderRadius: "50%" }} />
            </div>
            <div style={{ width: "10px", height: "5px", borderBottom: "2px solid rgba(255,255,255,0.9)", borderRadius: "0 0 50% 50%", marginTop: "2px" }} />
          </>
        ) : (
          <>
            <div className="flex items-center gap-[7px] -mt-0.5">
              <div className="w-[4px] h-[4px] rounded-full bg-white/90" />
              <div className="w-[4px] h-[4px] rounded-full bg-white/90" />
            </div>
            <div className="w-[5px] h-[2px] rounded-full bg-white/30 mt-[2px]" />
          </>
        )}

        {/* Celebration sparkles */}
        {solved && (
          <>
            <div className="absolute -top-1 -right-1 text-[7px] animate-ping" style={{ animationDuration: "1s" }}>✦</div>
            <div className="absolute -top-2 left-0 text-[5px] animate-ping" style={{ animationDuration: "1.3s", animationDelay: "0.2s" }}>✦</div>
          </>
        )}
      </div>

      {/* Label */}
      <div
        className="absolute -bottom-1 text-[9px] font-bold tracking-wider"
        style={{ color: color, textShadow: `0 0 8px ${color}60` }}
      >
        {label}
      </div>
    </div>
  );
}

export default function GridBoard({ css, boardConfig, solved = false }: GridBoardProps) {
  const userStyles = useMemo(() => parseCSS(css), [css]);
  const selectorBlocks = useMemo(() => parseSelectorBlocks(css), [css]);

  const containerStyle: React.CSSProperties = {
    display: "grid",
    width: "100%",
    height: "100%",
    minHeight: "280px",
    gridTemplateColumns: `repeat(${boardConfig.columns}, 1fr)`,
    gridTemplateRows: `repeat(${boardConfig.rows}, 1fr)`,
    gap: "4px",
    padding: "8px",
    transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
  };

  const gridContainerProps = [
    "grid-template-columns", "grid-template-rows", "grid-template-areas",
    "gap", "row-gap", "column-gap", "grid-gap",
    "justify-items", "align-items", "place-items",
    "justify-content", "align-content", "place-content",
    "grid-auto-columns", "grid-auto-rows", "grid-auto-flow",
  ];

  const containerBlock = selectorBlocks["#grid-container"] ?? {};

  for (const prop of gridContainerProps) {
    const value = containerBlock[prop] ?? userStyles[prop];
    if (value) {
      const camelCase = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      (containerStyle as any)[camelCase] = value;
    }
  }

  const getItemStyle = (item: { id: string }, index: number): React.CSSProperties => {
    const style: React.CSSProperties = {
      transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
    };

    const itemProps = [
      "grid-column", "grid-column-start", "grid-column-end",
      "grid-row", "grid-row-start", "grid-row-end",
      "grid-area", "justify-self", "align-self", "place-self",
    ];

    const itemBlock = selectorBlocks[`#item-${index + 1}`] ?? {};

    for (const prop of itemProps) {
      const value = itemBlock[prop] ?? (Object.keys(selectorBlocks).length === 0 ? userStyles[prop] : undefined);
      if (value) {
        const camelCase = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        (style as any)[camelCase] = value;
      }
    }

    return style;
  };

  const totalCells = boardConfig.columns * boardConfig.rows;
  const highlightSet = new Set(boardConfig.highlightCells ?? []);
  const hasInput = css.trim().length > 0;

  return (
    <div className="w-full h-full p-6 flex items-center justify-center">
      {/* Arena */}
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden relative"
        style={{
          backgroundColor: "#12121f",
          minHeight: "300px",
          border: `2px solid ${solved ? "rgba(203, 166, 247, 0.4)" : hasInput ? "rgba(203, 166, 247, 0.15)" : "rgba(69, 71, 90, 0.5)"}`,
          transition: "all 0.8s ease",
          boxShadow: solved
            ? "0 0 60px rgba(203, 166, 247, 0.15), inset 0 0 80px rgba(203, 166, 247, 0.05)"
            : hasInput
            ? "0 0 40px rgba(203, 166, 247, 0.05), inset 0 0 60px rgba(203, 166, 247, 0.02)"
            : "none",
        }}
      >
        {/* Tatami grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(203,166,247,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(203,166,247,0.8) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Radial glow */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at center, rgba(203,166,247,0.03) 0%, transparent 70%)",
          }}
        />

        {/* Corner decorations */}
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-neon-purple/20 rounded-tl" />
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-neon-purple/20 rounded-tr" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-neon-purple/20 rounded-bl" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-neon-purple/20 rounded-br" />

        {/* Arena label */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-[0.3em] text-neon-purple/20 font-bold">
          arena
        </div>

        {/* Background grid cells */}
        <div
          className="absolute inset-2 grid z-0"
          style={{
            gridTemplateColumns: `repeat(${boardConfig.columns}, 1fr)`,
            gridTemplateRows: `repeat(${boardConfig.rows}, 1fr)`,
            gap: "4px",
          }}
        >
          {Array.from({ length: totalCells }).map((_, i) => {
            const col = (i % boardConfig.columns) + 1;
            const row = Math.floor(i / boardConfig.columns) + 1;
            const cellKey = `${col}-${row}`;
            const isHighlighted = highlightSet.has(cellKey);
            return (
              <div
                key={i}
                className={`rounded-lg ${isHighlighted ? "bg-neon-purple/10 border border-neon-purple/20" : "bg-white/[0.02] border border-white/[0.03]"}`}
              />
            );
          })}
        </div>

        {/* Actual grid container with apprentices */}
        <div style={containerStyle} className="relative z-10">
          {boardConfig.items.map((item, i) => (
            <div
              key={item.id}
              style={getItemStyle(item, i)}
              className="flex items-center justify-center"
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
