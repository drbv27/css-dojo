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

export default function GridBoard({ css, boardConfig }: GridBoardProps) {
  const userStyles = useMemo(() => parseCSS(css), [css]);
  const selectorBlocks = useMemo(() => parseSelectorBlocks(css), [css]);

  // Container grid styles
  const containerStyle: React.CSSProperties = {
    display: "grid",
    width: "100%",
    height: "100%",
    minHeight: "280px",
    gridTemplateColumns: `repeat(${boardConfig.columns}, 1fr)`,
    gridTemplateRows: `repeat(${boardConfig.rows}, 1fr)`,
    gap: "4px",
    padding: "4px",
    transition: "all 0.3s ease",
  };

  // Apply user-written container CSS
  const gridContainerProps = [
    "grid-template-columns", "grid-template-rows", "grid-template-areas",
    "gap", "row-gap", "column-gap", "grid-gap",
    "justify-items", "align-items", "place-items",
    "justify-content", "align-content", "place-content",
    "grid-auto-columns", "grid-auto-rows", "grid-auto-flow",
  ];

  // Check for #grid-container selector block
  const containerBlock = selectorBlocks["#grid-container"] ?? {};

  for (const prop of gridContainerProps) {
    const value = containerBlock[prop] ?? userStyles[prop];
    if (value) {
      const camelCase = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      (containerStyle as any)[camelCase] = value;
    }
  }

  // Build individual item styles
  const getItemStyle = (item: { id: string }, index: number): React.CSSProperties => {
    const style: React.CSSProperties = {
      transition: "all 0.3s ease",
    };

    const itemProps = [
      "grid-column", "grid-column-start", "grid-column-end",
      "grid-row", "grid-row-start", "grid-row-end",
      "grid-area", "justify-self", "align-self", "place-self",
    ];

    // Check for #item-N selector block
    const itemBlock = selectorBlocks[`#item-${index + 1}`] ?? {};

    // Also check for generic item rules (not in a selector block)
    for (const prop of itemProps) {
      const value = itemBlock[prop] ?? (Object.keys(selectorBlocks).length === 0 ? userStyles[prop] : undefined);
      if (value) {
        const camelCase = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        (style as any)[camelCase] = value;
      }
    }

    return style;
  };

  // Generate background grid cells for visual reference
  const totalCells = boardConfig.columns * boardConfig.rows;
  const highlightSet = new Set(boardConfig.highlightCells ?? []);

  return (
    <div className="w-full h-full p-6 flex items-center justify-center">
      <div
        className="w-full max-w-lg rounded-xl border border-editor-border overflow-hidden relative"
        style={{
          backgroundColor: "#1a1a2e",
          minHeight: "280px",
        }}
      >
        {/* Background grid cells */}
        <div
          className="absolute inset-1 grid"
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
                className={`rounded ${isHighlighted ? "bg-neon-purple/10 border border-neon-purple/20" : "bg-editor-border/20"}`}
              />
            );
          })}
        </div>

        {/* Actual grid container with items */}
        <div style={containerStyle} className="relative z-10">
          {boardConfig.items.map((item, i) => (
            <div
              key={item.id}
              style={{
                backgroundColor: item.color,
                ...getItemStyle(item, i),
              }}
              className="rounded-lg flex items-center justify-center text-sm font-bold text-editor-bg shadow-lg min-h-[40px]"
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
