"use client";

import { useCallback } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";

interface CSSEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
  readOnly?: boolean;
  language?: string;
}

export default function CSSEditor({
  value,
  onChange,
  height = "300px",
  readOnly = false,
  language = "css",
}: CSSEditorProps) {
  const handleMount: OnMount = useCallback((editor, monaco) => {
    monaco.editor.defineTheme("css-dojo", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6C7086", fontStyle: "italic" },
        { token: "keyword", foreground: "CBA6F7" },
        { token: "string", foreground: "A6E3A1" },
        { token: "number", foreground: "FAB387" },
        { token: "tag", foreground: "89B4FA" },
        { token: "attribute.name", foreground: "F9E2AF" },
        { token: "attribute.value", foreground: "A6E3A1" },
        { token: "delimiter", foreground: "CDD6F4" },
      ],
      colors: {
        "editor.background": "#1E1E2E",
        "editor.foreground": "#CDD6F4",
        "editor.lineHighlightBackground": "#313244",
        "editor.selectionBackground": "#45475A",
        "editorCursor.foreground": "#89B4FA",
        "editorLineNumber.foreground": "#6C7086",
        "editorLineNumber.activeForeground": "#CDD6F4",
      },
    });
    monaco.editor.setTheme("css-dojo");
  }, []);

  const isFullHeight = height === "100%";

  return (
    <div className={`overflow-hidden ${isFullHeight ? "h-full" : "rounded-lg border border-editor-border"}`}>
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={(val) => onChange(val ?? "")}
        onMount={handleMount}
        theme="vs-dark"
        loading={
          <div
            className="animate-pulse bg-editor-surface"
            style={{ height }}
          />
        }
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          scrollBeyondLastLine: false,
          lineNumbers: "on",
          tabSize: 2,
          wordWrap: "on",
          automaticLayout: true,
          readOnly,
          padding: { top: 12, bottom: 12 },
          renderLineHighlight: "gutter",
          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
        }}
      />
    </div>
  );
}
