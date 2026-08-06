"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { RefreshCw } from "lucide-react";
import { construirSrcDoc } from "@/lib/previewDoc";

interface LivePreviewProps {
  html: string;
  css: string;
  js?: string;
  /**
   * Grading harness for a js-behavior exercise. Omitted for every other
   * exercise and for every lesson preview, and `previewDoc.test.ts` pins the
   * document byte for byte in that case -- 28 modules depend on it.
   */
  harness?: string;
  /**
   * Bumping this discards the frame and whatever is running inside it. The
   * timeout path uses it: a blocking loop cannot be interrupted, only abandoned.
   */
  resetSignal?: number;
  className?: string;
}

export default function LivePreview({
  html,
  css,
  js = "",
  harness,
  resetSignal = 0,
  className = "",
}: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [key, setKey] = useState(0);
  const [debouncedHtml, setDebouncedHtml] = useState(html);
  const [debouncedCss, setDebouncedCss] = useState(css);
  const [debouncedJs, setDebouncedJs] = useState(js);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedHtml(html);
      setDebouncedCss(css);
      setDebouncedJs(js);
    }, 300);
    return () => clearTimeout(timer);
  }, [html, css, js]);

  const srcdoc = useMemo(
    () =>
      construirSrcDoc({
        html: debouncedHtml,
        css: debouncedCss,
        js: debouncedJs,
        harness,
      }),
    [debouncedHtml, debouncedCss, debouncedJs, harness]
  );

  return (
    <div
      className={`flex flex-col rounded-lg overflow-hidden border border-editor-border ${className}`}
    >
      <div className="flex items-center justify-between px-4 py-2 bg-editor-surface border-b border-editor-border">
        <span className="text-xs font-medium text-editor-muted uppercase tracking-wider">
          Vista Previa
        </span>
        <button
          onClick={() => setKey((k) => k + 1)}
          className="p-1 rounded hover:bg-editor-hover transition-colors text-editor-muted hover:text-editor-text"
          title="Refrescar"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
      <iframe
        key={`${key}-${resetSignal}`}
        ref={iframeRef}
        srcDoc={srcdoc}
        sandbox="allow-scripts"
        className="w-full flex-1 bg-white"
        style={{ minHeight: "200px" }}
        title="Vista previa CSS"
      />
    </div>
  );
}
