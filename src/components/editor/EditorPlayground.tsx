"use client";

import { useState, useCallback } from "react";
import { RotateCcw, Copy, Check } from "lucide-react";
import CSSEditor from "./CSSEditor";
import LivePreview from "./LivePreview";

interface EditorPlaygroundProps {
  initialHTML: string;
  initialCSS: string;
  editableHTML?: boolean;
  height?: string;
  onCSSChange?: (css: string) => void;
}

export default function EditorPlayground({
  initialHTML,
  initialCSS,
  editableHTML = false,
  height = "400px",
  onCSSChange,
}: EditorPlaygroundProps) {
  const [html, setHtml] = useState(initialHTML);
  const [css, setCss] = useState(initialCSS);
  const [copied, setCopied] = useState(false);

  const handleCSSChange = useCallback(
    (value: string) => {
      setCss(value);
      onCSSChange?.(value);
    },
    [onCSSChange]
  );

  const handleHTMLChange = useCallback((value: string) => {
    setHtml(value);
  }, []);

  const handleReset = useCallback(() => {
    setHtml(initialHTML);
    setCss(initialCSS);
    onCSSChange?.(initialCSS);
  }, [initialHTML, initialCSS, onCSSChange]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: silently fail
    }
  }, [css]);

  const editorHeight = editableHTML
    ? `calc(${height} / 2 - 16px)`
    : height;

  return (
    <div className="flex flex-col gap-2">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
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
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md
                     bg-editor-surface border border-editor-border text-editor-muted
                     hover:bg-editor-hover hover:text-editor-text transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-neon-green" />
              <span className="text-neon-green">Copiado</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              Copiar CSS
            </>
          )}
        </button>
      </div>

      {/* Editor + Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Left: Editor(s) */}
        <div className="flex flex-col gap-3">
          {editableHTML && (
            <div className="flex flex-col">
              <div className="flex items-center px-3 py-1.5 bg-editor-surface rounded-t-lg border border-b-0 border-editor-border">
                <span className="text-xs font-medium text-neon-orange uppercase tracking-wider">
                  HTML
                </span>
              </div>
              <CSSEditor
                value={html}
                onChange={handleHTMLChange}
                height={editorHeight}
                language="html"
              />
            </div>
          )}
          <div className="flex flex-col">
            <div className="flex items-center px-3 py-1.5 bg-editor-surface rounded-t-lg border border-b-0 border-editor-border">
              <span className="text-xs font-medium text-neon-blue uppercase tracking-wider">
                CSS
              </span>
            </div>
            <CSSEditor
              value={css}
              onChange={handleCSSChange}
              height={editableHTML ? editorHeight : height}
              language="css"
            />
          </div>
        </div>

        {/* Right: Preview */}
        <LivePreview html={html} css={css} className="h-full" />
      </div>
    </div>
  );
}
