"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { RefreshCw } from "lucide-react";

interface LivePreviewProps {
  html: string;
  css: string;
  className?: string;
}

export default function LivePreview({
  html,
  css,
  className = "",
}: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [key, setKey] = useState(0);
  const [debouncedHtml, setDebouncedHtml] = useState(html);
  const [debouncedCss, setDebouncedCss] = useState(css);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedHtml(html);
      setDebouncedCss(css);
    }, 300);
    return () => clearTimeout(timer);
  }, [html, css]);

  const srcdoc = useMemo(
    () =>
      `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 16px; font-family: system-ui, sans-serif; background: white; }
    ${debouncedCss}
  </style>
</head>
<body>${debouncedHtml}</body>
</html>`,
    [debouncedHtml, debouncedCss]
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
        key={key}
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
