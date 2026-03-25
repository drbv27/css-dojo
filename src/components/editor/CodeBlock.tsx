"use client";

import { useState, useMemo } from "react";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
}

function highlightCSS(code: string): string {
  // Order matters: process comments first, then strings, then other tokens
  const tokens: { start: number; end: number; replacement: string }[] = [];

  // Comments: /* ... */
  const commentRe = /\/\*[\s\S]*?\*\//g;
  let match: RegExpExecArray | null;
  while ((match = commentRe.exec(code)) !== null) {
    tokens.push({
      start: match.index,
      end: match.index + match[0].length,
      replacement: `<span class="text-editor-muted italic">${escapeHtml(match[0])}</span>`,
    });
  }

  // Strings: "..." or '...'
  const stringRe = /(["'])(?:(?=(\\?))\2.)*?\1/g;
  while ((match = stringRe.exec(code)) !== null) {
    if (!isOverlapping(tokens, match.index, match.index + match[0].length)) {
      tokens.push({
        start: match.index,
        end: match.index + match[0].length,
        replacement: `<span class="text-neon-green">${escapeHtml(match[0])}</span>`,
      });
    }
  }

  // Selectors: lines/segments before { (simplified: match text at start of line or after } up to {)
  const selectorRe = /(^|\})\s*([^{}@/]+?)(\s*\{)/gm;
  while ((match = selectorRe.exec(code)) !== null) {
    const selectorStart = match.index + match[1].length;
    const selectorText = match[2];
    const trimmedStart = selectorStart + (match[0].indexOf(match[2]) - match[1].length);
    const actualStart = match.index + match[0].indexOf(match[2]);
    const actualEnd = actualStart + selectorText.length;
    if (!isOverlapping(tokens, actualStart, actualEnd)) {
      tokens.push({
        start: actualStart,
        end: actualEnd,
        replacement: `<span class="text-neon-yellow">${escapeHtml(selectorText)}</span>`,
      });
    }
  }

  // Properties: word-word: (inside blocks)
  const propRe = /([\w-]+)(\s*:)/g;
  while ((match = propRe.exec(code)) !== null) {
    const propStart = match.index;
    const propEnd = match.index + match[1].length;
    if (!isOverlapping(tokens, propStart, propEnd)) {
      tokens.push({
        start: propStart,
        end: propEnd,
        replacement: `<span class="text-neon-blue">${escapeHtml(match[1])}</span>`,
      });
    }
  }

  // Values: everything between : and ; (simplified)
  const valueRe = /:\s*([^;{}]+)(;)/g;
  while ((match = valueRe.exec(code)) !== null) {
    const valStart = match.index + match[0].indexOf(match[1]);
    const valEnd = valStart + match[1].length;
    if (!isOverlapping(tokens, valStart, valEnd)) {
      tokens.push({
        start: valStart,
        end: valEnd,
        replacement: `<span class="text-neon-green">${escapeHtml(match[1])}</span>`,
      });
    }
  }

  // Numbers with units
  const numRe = /\b(\d+\.?\d*)(px|rem|em|%|vh|vw|s|ms|deg|fr)?\b/g;
  while ((match = numRe.exec(code)) !== null) {
    if (!isOverlapping(tokens, match.index, match.index + match[0].length)) {
      tokens.push({
        start: match.index,
        end: match.index + match[0].length,
        replacement: `<span class="text-neon-orange">${escapeHtml(match[0])}</span>`,
      });
    }
  }

  // Sort tokens by start position descending so we can replace from end to start
  tokens.sort((a, b) => b.start - a.start);

  let result = escapeHtml(code);

  // We need to rebuild using non-overlapping tokens applied to the original string
  // Reset approach: build from scratch
  tokens.sort((a, b) => a.start - b.start);

  // Remove overlapping tokens (keep earlier ones)
  const filtered: typeof tokens = [];
  let lastEnd = 0;
  for (const t of tokens) {
    if (t.start >= lastEnd) {
      filtered.push(t);
      lastEnd = t.end;
    }
  }

  // Build result
  let built = "";
  let pos = 0;
  for (const t of filtered) {
    built += escapeHtml(code.slice(pos, t.start));
    built += t.replacement;
    pos = t.end;
  }
  built += escapeHtml(code.slice(pos));

  return built;
}

function highlightHTML(code: string): string {
  // Simple HTML highlighting
  let result = escapeHtml(code);
  // Tags
  result = result.replace(
    /&lt;(\/?)([\w-]+)/g,
    '&lt;$1<span class="text-neon-blue">$2</span>'
  );
  // Attributes
  result = result.replace(
    /\s([\w-]+)=/g,
    ' <span class="text-neon-yellow">$1</span>='
  );
  // Strings
  result = result.replace(
    /(&quot;[^&]*&quot;)/g,
    '<span class="text-neon-green">$1</span>'
  );
  return result;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isOverlapping(
  tokens: { start: number; end: number }[],
  start: number,
  end: number
): boolean {
  return tokens.some(
    (t) =>
      (start >= t.start && start < t.end) ||
      (end > t.start && end <= t.end) ||
      (start <= t.start && end >= t.end)
  );
}

export default function CodeBlock({
  code,
  language = "css",
  title,
  showLineNumbers = true,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silently fail
    }
  };

  const lines = code.split("\n");
  const lineNumberWidth = String(lines.length).length;

  const highlighted = useMemo(() => {
    if (language === "html") return highlightHTML(code);
    return highlightCSS(code);
  }, [code, language]);

  const highlightedLines = highlighted.split("\n");

  return (
    <div className="rounded-lg overflow-hidden border border-editor-border">
      {/* Title bar */}
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-editor-surface border-b border-editor-border">
          <span className="text-xs font-medium text-editor-muted uppercase tracking-wider">
            {title}
          </span>
          <button
            onClick={handleCopy}
            className="p-1 rounded hover:bg-editor-hover transition-colors text-editor-muted hover:text-editor-text"
            title="Copiar"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-neon-green" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      )}

      {/* Code area */}
      <div className="relative bg-editor-surface">
        {/* Copy button when no title */}
        {!title && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 z-10 p-1.5 rounded hover:bg-editor-hover transition-colors text-editor-muted hover:text-editor-text"
            title="Copiar"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-neon-green" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        )}

        <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
          <code className="font-mono">
            {highlightedLines.map((line, i) => (
              <div key={i} className="flex">
                {showLineNumbers && (
                  <span
                    className="select-none text-editor-muted text-right mr-4 shrink-0"
                    style={{ minWidth: `${lineNumberWidth}ch` }}
                  >
                    {i + 1}
                  </span>
                )}
                <span
                  className="text-editor-text flex-1"
                  dangerouslySetInnerHTML={{ __html: line || "&nbsp;" }}
                />
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
