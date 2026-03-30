"use client";

import { useState, useCallback } from "react";
import { RotateCcw } from "lucide-react";
import TabCodeEditor from "./TabCodeEditor";
import LivePreview from "./LivePreview";

interface TabEditorPlaygroundProps {
  initialHTML: string;
  initialCSS: string;
  initialJS?: string;
  showHTML?: boolean;
  showCSS?: boolean;
  showJS?: boolean;
  readOnlyHTML?: boolean;
  readOnlyCSS?: boolean;
  readOnlyJS?: boolean;
  height?: string;
  onCSSChange?: (css: string) => void;
  onJSChange?: (js: string) => void;
}

export default function TabEditorPlayground({
  initialHTML,
  initialCSS,
  initialJS = "",
  showHTML = true,
  showCSS = true,
  showJS = false,
  readOnlyHTML = false,
  readOnlyCSS = false,
  readOnlyJS = false,
  height = "400px",
  onCSSChange,
  onJSChange,
}: TabEditorPlaygroundProps) {
  const [html, setHtml] = useState(initialHTML);
  const [css, setCss] = useState(initialCSS);
  const [js, setJs] = useState(initialJS);

  const handleHTMLChange = useCallback((value: string) => {
    setHtml(value);
  }, []);

  const handleCSSChange = useCallback(
    (value: string) => {
      setCss(value);
      onCSSChange?.(value);
    },
    [onCSSChange]
  );

  const handleJSChange = useCallback(
    (value: string) => {
      setJs(value);
      onJSChange?.(value);
    },
    [onJSChange]
  );

  const handleReset = useCallback(() => {
    setHtml(initialHTML);
    setCss(initialCSS);
    setJs(initialJS);
    onCSSChange?.(initialCSS);
    onJSChange?.(initialJS);
  }, [initialHTML, initialCSS, initialJS, onCSSChange, onJSChange]);

  return (
    <div className="flex flex-col gap-2">
      {/* Toolbar */}
      <div className="flex items-center px-1">
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md
                     bg-editor-surface border border-editor-border text-editor-muted
                     hover:bg-editor-hover hover:text-editor-text transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reiniciar
        </button>
      </div>

      {/* Editor + Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Left: Tab Editor */}
        <TabCodeEditor
          html={html}
          css={css}
          js={js}
          onHTMLChange={handleHTMLChange}
          onCSSChange={handleCSSChange}
          onJSChange={handleJSChange}
          showHTML={showHTML}
          showCSS={showCSS}
          showJS={showJS}
          readOnlyHTML={readOnlyHTML}
          readOnlyCSS={readOnlyCSS}
          readOnlyJS={readOnlyJS}
          height={height}
        />

        {/* Right: Preview */}
        <LivePreview html={html} css={css} js={js} className="h-full" />
      </div>
    </div>
  );
}
