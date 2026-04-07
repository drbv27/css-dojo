"use client";

import { useMemo } from "react";

interface FlexboxBoardProps {
  css: string;
  boardConfig: {
    items: { id: string; color: string; label: string }[];
    targets?: { id: string; gridArea: string }[];
    containerStyle?: Record<string, string>;
  };
}

function parseCSS(cssText: string): Record<string, string> {
  const styles: Record<string, string> = {};
  // Remove comments
  const cleaned = cssText.replace(/\/\*[\s\S]*?\*\//g, "");
  // Extract property:value pairs
  const matches = cleaned.matchAll(/([a-z-]+)\s*:\s*([^;]+)/gi);
  for (const match of matches) {
    styles[match[1].trim()] = match[2].trim();
  }
  return styles;
}

export default function FlexboxBoard({ css, boardConfig }: FlexboxBoardProps) {
  const userStyles = useMemo(() => parseCSS(css), [css]);

  // Merge user CSS with any base container styles
  const containerStyle: React.CSSProperties = {
    display: "flex",
    width: "100%",
    height: "100%",
    minHeight: "200px",
    transition: "all 0.3s ease",
    ...boardConfig.containerStyle,
  };

  // Apply user-written CSS properties to the container
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

  // Build individual item styles from CSS (for order, align-self, flex-grow, etc.)
  const getItemStyle = (itemId: string, index: number): React.CSSProperties => {
    const style: React.CSSProperties = {
      transition: "all 0.3s ease",
    };

    // Check for item-specific rules like #item-1 { order: 2 }
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

    // Also check global item properties
    const globalItemProps = ["order", "align-self", "flex-grow", "flex-shrink", "flex-basis", "flex"];
    for (const prop of globalItemProps) {
      if (userStyles[prop] && !match) {
        const camelCase = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        (style as any)[camelCase] = userStyles[prop];
      }
    }

    return style;
  };

  return (
    <div className="w-full h-full p-6 flex items-center justify-center">
      {/* Game area with subtle grid pattern */}
      <div
        className="w-full max-w-lg rounded-xl border border-editor-border overflow-hidden relative"
        style={{
          backgroundColor: "#1a1a2e",
          backgroundImage:
            "linear-gradient(rgba(137,180,250,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(137,180,250,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          minHeight: "280px",
        }}
      >
        {/* Flex container */}
        <div style={containerStyle} className="p-4">
          {boardConfig.items.map((item, i) => (
            <div
              key={item.id}
              style={{
                backgroundColor: item.color,
                ...getItemStyle(item.id, i),
              }}
              className="w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold text-editor-bg shadow-lg shrink-0"
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
