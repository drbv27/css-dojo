"use client";

import { useState, useMemo } from "react";
import CSSEditor from "@/components/editor/CSSEditor";

type TabKey = "html" | "css" | "js";

interface TabCodeEditorProps {
  html: string;
  css: string;
  js?: string;
  onHTMLChange?: (value: string) => void;
  onCSSChange?: (value: string) => void;
  onJSChange?: (value: string) => void;
  showHTML?: boolean;
  showCSS?: boolean;
  showJS?: boolean;
  readOnlyHTML?: boolean;
  readOnlyCSS?: boolean;
  readOnlyJS?: boolean;
  height?: string;
  activeTab?: TabKey;
}

const TAB_CONFIG: Record<TabKey, { label: string; dotColor: string; borderColor: string; language: string }> = {
  html: { label: "HTML", dotColor: "bg-neon-pink", borderColor: "border-neon-pink", language: "html" },
  css:  { label: "CSS",  dotColor: "bg-neon-blue", borderColor: "border-neon-blue", language: "css" },
  js:   { label: "JS",   dotColor: "bg-neon-yellow", borderColor: "border-neon-yellow", language: "javascript" },
};

export default function TabCodeEditor({
  html,
  css,
  js = "",
  onHTMLChange,
  onCSSChange,
  onJSChange,
  showHTML = true,
  showCSS = true,
  showJS = false,
  readOnlyHTML = false,
  readOnlyCSS = false,
  readOnlyJS = false,
  height = "300px",
  activeTab: controlledTab,
}: TabCodeEditorProps) {
  const visibleTabs = useMemo(() => {
    const tabs: TabKey[] = [];
    if (showHTML) tabs.push("html");
    if (showCSS) tabs.push("css");
    if (showJS) tabs.push("js");
    return tabs;
  }, [showHTML, showCSS, showJS]);

  const defaultTab = controlledTab ?? visibleTabs[0] ?? "css";
  const [internalTab, setInternalTab] = useState<TabKey>(defaultTab);
  const currentTab = visibleTabs.includes(internalTab) ? internalTab : visibleTabs[0] ?? "css";

  const valueMap: Record<TabKey, string> = { html, css, js };
  const readOnlyMap: Record<TabKey, boolean> = {
    html: readOnlyHTML,
    css: readOnlyCSS,
    js: readOnlyJS,
  };
  const onChangeMap: Record<TabKey, ((v: string) => void) | undefined> = {
    html: onHTMLChange,
    css: onCSSChange,
    js: onJSChange,
  };

  const handleChange = (value: string) => {
    onChangeMap[currentTab]?.(value);
  };

  return (
    <div className="flex flex-col rounded-lg overflow-hidden border border-editor-border">
      {/* Tab bar */}
      <div className="flex items-center bg-editor-surface border-b border-editor-border">
        {/* macOS traffic lights */}
        <div className="flex items-center gap-1.5 px-3 py-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        </div>

        {/* Separator */}
        <div className="w-px h-5 bg-editor-border" />

        {/* Tabs */}
        {visibleTabs.map((tab) => {
          const config = TAB_CONFIG[tab];
          const isActive = tab === currentTab;
          return (
            <button
              key={tab}
              onClick={() => setInternalTab(tab)}
              className={`
                relative flex items-center gap-2 px-4 py-2.5 text-xs font-medium uppercase tracking-wider
                transition-colors border-b-2
                ${
                  isActive
                    ? `bg-editor-bg text-editor-text ${config.borderColor}`
                    : "bg-editor-surface text-editor-muted hover:text-editor-text border-transparent"
                }
              `}
            >
              <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
              {config.label}
            </button>
          );
        })}
      </div>

      {/* Editor */}
      <CSSEditor
        value={valueMap[currentTab]}
        onChange={handleChange}
        height={height}
        language={TAB_CONFIG[currentTab].language}
        readOnly={readOnlyMap[currentTab]}
        noBorder
      />
    </div>
  );
}
