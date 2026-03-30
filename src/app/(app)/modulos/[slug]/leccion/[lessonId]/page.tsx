"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { ALL_MODULES } from "@/data/modules";
import { useAuth } from "@/hooks/useAuth";
import CodeBlock from "@/components/editor/CodeBlock";
import TabEditorPlayground from "@/components/editor/TabEditorPlayground";

function renderContent(content: string) {
  // Ensure code fences are always separated by double newlines
  // so the block splitter never merges them with adjacent text.
  const normalized = content
    .replace(/([^\n])\n(```)/g, "$1\n\n$2")
    .replace(/(```[^\n]*)\n([^\n])/g, "$1\n\n$2");

  // Split by double newlines into blocks
  const blocks = normalized.split(/\n\n+/);
  const elements: React.ReactNode[] = [];

  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = "css";

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    // Handle code blocks that might span multiple blocks
    if (inCodeBlock) {
      if (block.includes("```")) {
        // End of code block
        const endIdx = block.indexOf("```");
        codeBuffer.push(block.slice(0, endIdx));
        elements.push(
          <CodeBlock key={`code-${i}`} code={codeBuffer.join("\n\n").trim()} language={codeLang} />
        );
        codeBuffer = [];
        inCodeBlock = false;
        // Any remaining text after closing ```
        const remaining = block.slice(endIdx + 3).trim();
        if (remaining) {
          elements.push(<p key={`p-${i}-rest`} className="leading-relaxed text-editor-text">{remaining}</p>);
        }
      } else {
        codeBuffer.push(block);
      }
      continue;
    }

    // Check if block starts a code fence
    if (block.startsWith("```")) {
      const firstLine = block.split("\n")[0];
      codeLang = firstLine.replace("```", "").trim() || "css";
      const rest = block.slice(firstLine.length + 1);
      // Check if code block ends in same block
      const endIdx = rest.indexOf("```");
      if (endIdx !== -1) {
        elements.push(
          <CodeBlock key={`code-${i}`} code={rest.slice(0, endIdx).trim()} language={codeLang} />
        );
      } else {
        inCodeBlock = true;
        codeBuffer.push(rest);
      }
      continue;
    }

    // Headers (check most specific first)
    // If a header block contains more lines (e.g. a code fence right after),
    // only take the first line as the header and re-queue the rest.
    if (block.startsWith("#### ") || block.startsWith("### ") || block.startsWith("## ")) {
      const nlIdx = block.indexOf("\n");
      const headerLine = nlIdx === -1 ? block : block.slice(0, nlIdx);
      const remaining = nlIdx === -1 ? null : block.slice(nlIdx + 1);

      if (headerLine.startsWith("#### ")) {
        elements.push(
          <h4 key={`h4-${i}`} className="text-base font-semibold text-editor-text mt-4 mb-1">
            {renderInline(headerLine.slice(5))}
          </h4>
        );
      } else if (headerLine.startsWith("### ")) {
        elements.push(
          <h3 key={`h3-${i}`} className="text-lg font-semibold text-editor-text mt-6 mb-2">
            {renderInline(headerLine.slice(4))}
          </h3>
        );
      } else {
        elements.push(
          <h2 key={`h2-${i}`} className="text-xl font-bold text-editor-text mt-6 mb-2">
            {renderInline(headerLine.slice(3))}
          </h2>
        );
      }

      // Re-insert remaining content back into the blocks array
      if (remaining && remaining.trim()) {
        blocks.splice(i + 1, 0, remaining);
      }
      continue;
    }

    // Blockquote
    if (block.startsWith("> ")) {
      elements.push(
        <blockquote key={`bq-${i}`} className="border-l-2 border-neon-blue/50 pl-4 py-1 text-editor-muted italic">
          {renderInline(block.slice(2))}
        </blockquote>
      );
      continue;
    }

    // List items (lines starting with -)
    const lines = block.split("\n");
    if (lines.every((l) => l.trim().startsWith("- ") || l.trim() === "")) {
      elements.push(
        <ul key={`ul-${i}`} className="space-y-2 text-editor-muted">
          {lines
            .filter((l) => l.trim().startsWith("- "))
            .map((l, j) => (
              <li key={j} className="flex items-start gap-2">
                <span className="text-neon-green mt-1">&#8226;</span>
                <span>{renderInline(l.trim().slice(2))}</span>
              </li>
            ))}
        </ul>
      );
      continue;
    }

    // Markdown table (lines with |)
    if (lines.length >= 2 && lines[0].includes("|") && lines[1].includes("---")) {
      const headerCells = lines[0].split("|").map((c) => c.trim()).filter(Boolean);
      const bodyRows = lines.slice(2).filter((l) => l.includes("|"));
      elements.push(
        <div key={`table-${i}`} className="overflow-x-auto rounded-lg border border-editor-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-editor-border bg-editor-bg">
                {headerCells.map((cell, j) => (
                  <th key={j} className="px-4 py-2.5 text-left font-semibold text-editor-text">
                    {renderInline(cell)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row, j) => {
                const cells = row.split("|").map((c) => c.trim()).filter(Boolean);
                return (
                  <tr key={j} className="border-b border-editor-border last:border-0">
                    {cells.map((cell, k) => (
                      <td key={k} className="px-4 py-2 text-editor-muted">
                        {renderInline(cell)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Ordered list (lines starting with number.)
    if (lines.every((l) => /^\d+\.\s/.test(l.trim()) || l.trim() === "")) {
      elements.push(
        <ol key={`ol-${i}`} className="space-y-2 text-editor-muted list-decimal list-inside">
          {lines
            .filter((l) => /^\d+\.\s/.test(l.trim()))
            .map((l, j) => (
              <li key={j}>
                {renderInline(l.trim().replace(/^\d+\.\s/, ""))}
              </li>
            ))}
        </ol>
      );
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={`p-${i}`} className="leading-relaxed text-editor-text">
        {renderInline(block)}
      </p>
    );
  }

  return elements;
}

function renderInline(text: string): React.ReactNode {
  // Handle **bold**, `code`, and plain text
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*|`([^`]+)`)/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push(text.slice(lastIdx, match.index));
    }
    if (match[2]) {
      // Bold
      parts.push(<strong key={match.index} className="font-semibold text-editor-text">{match[2]}</strong>);
    } else if (match[3]) {
      // Inline code
      parts.push(
        <code key={match.index} className="font-mono text-neon-blue bg-neon-blue/10 px-1.5 py-0.5 rounded text-sm">
          {match[3]}
        </code>
      );
    }
    lastIdx = match.index + match[0].length;
  }
  if (lastIdx < text.length) {
    parts.push(text.slice(lastIdx));
  }
  return parts.length === 1 ? parts[0] : parts;
}

export default function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>;
}) {
  const { slug, lessonId } = use(params);
  const { user } = useAuth();
  const isTeacher = user?.role === "teacher";
  const [moduleDisabled, setModuleDisabled] = useState(false);
  const [checkingEnabled, setCheckingEnabled] = useState(true);

  useEffect(() => {
    fetch("/api/modules/enabled")
      .then((res) => res.json())
      .then((data) => {
        if (data.enabledSlugs && !data.enabledSlugs.includes(slug)) {
          setModuleDisabled(true);
        }
        setCheckingEnabled(false);
      })
      .catch(() => setCheckingEnabled(false));
  }, [slug]);

  const mod = ALL_MODULES.find((m) => m.slug === slug);
  const lessons = mod ? [...mod.lessons].sort((a, b) => a.order - b.order) : [];
  const lessonIdx = lessons.findIndex((l) => l.id === lessonId);
  const lesson = lessonIdx !== -1 ? lessons[lessonIdx] : null;

  const moduleTitle = mod?.title ?? slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const prevLesson = lessonIdx > 0 ? lessons[lessonIdx - 1] : null;
  const nextLesson = lessonIdx < lessons.length - 1 ? lessons[lessonIdx + 1] : null;
  const firstExercise = mod?.exercises?.length
    ? [...mod.exercises].sort((a, b) => a.order - b.order)[0]
    : null;

  if (checkingEnabled) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="animate-pulse">
          <div className="h-6 w-48 bg-editor-surface rounded mb-4" />
          <div className="h-40 bg-editor-surface rounded-xl" />
        </div>
      </div>
    );
  }

  if (moduleDisabled && !isTeacher) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Link
          href="/modulos"
          className="inline-flex items-center gap-2 text-sm text-editor-muted hover:text-neon-blue transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a modulos
        </Link>
        <div className="bg-editor-surface border border-editor-border rounded-xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-editor-bg border border-editor-border flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-editor-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-editor-text mb-2">Este modulo no esta disponible aun</h1>
          <p className="text-editor-muted">El profesor aun no ha habilitado este modulo. Vuelve pronto.</p>
        </div>
      </div>
    );
  }

  if (!mod || !lesson) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-2 text-sm text-editor-muted">
          <Link href="/modulos" className="hover:text-neon-blue transition-colors">Modulos</Link>
          <span>/</span>
          <Link href={`/modulos/${slug}`} className="hover:text-neon-blue transition-colors">{moduleTitle}</Link>
        </div>
        <div className="bg-editor-surface border border-editor-border rounded-xl p-12 text-center">
          <h1 className="text-xl font-bold text-editor-text mb-2">Leccion no encontrada</h1>
          <p className="text-editor-muted">Esta leccion no existe o aun no esta disponible.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-editor-muted">
        <Link href="/modulos" className="hover:text-neon-blue transition-colors">
          Modulos
        </Link>
        <span>/</span>
        <Link
          href={`/modulos/${slug}`}
          className="hover:text-neon-blue transition-colors"
        >
          {moduleTitle}
        </Link>
        <span>/</span>
        <span className="text-editor-text">{lesson.title}</span>
      </div>

      {/* Lesson header */}
      <div className="bg-editor-surface border border-editor-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs px-2 py-1 rounded-full bg-neon-blue/10 text-neon-blue font-medium">
            Leccion {lessonIdx + 1} de {lessons.length}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-editor-text mb-2">
          {lesson.title}
        </h1>
      </div>

      {/* Lesson content */}
      <div className="bg-editor-surface border border-editor-border rounded-xl p-6 min-h-[300px]">
        <div className="prose prose-invert max-w-none">
          <div className="space-y-4">
            {renderContent(lesson.content)}
          </div>
        </div>
      </div>

      {/* Code example with EditorPlayground */}
      {lesson.codeExample && (
        <div>
          <h3 className="text-sm font-medium text-editor-muted mb-3 uppercase tracking-wider">
            Ejemplo interactivo
          </h3>
          <TabEditorPlayground
            initialHTML={lesson.codeExample.html}
            initialCSS={lesson.codeExample.css}
            initialJS={lesson.codeExample.js ?? ""}
            showHTML={true}
            showCSS={true}
            showJS={mod.dojo === "js"}
            readOnlyHTML={!lesson.codeExample.editable}
            height="300px"
          />
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        {prevLesson ? (
          <Link
            href={`/modulos/${slug}/leccion/${prevLesson.id}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-editor-surface border border-editor-border text-editor-text hover:bg-editor-hover transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Anterior
          </Link>
        ) : (
          <div />
        )}

        {nextLesson ? (
          <Link
            href={`/modulos/${slug}/leccion/${nextLesson.id}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-neon-blue text-editor-bg rounded-lg text-sm font-medium hover:bg-neon-blue/90 transition-colors"
          >
            Siguiente leccion
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : firstExercise ? (
          <Link
            href={`/modulos/${slug}/ejercicio/${firstExercise.id}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-neon-green text-editor-bg rounded-lg text-sm font-medium hover:bg-neon-green/90 transition-colors"
          >
            Ir a ejercicios
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <Link
            href={`/modulos/${slug}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-neon-blue text-editor-bg rounded-lg text-sm font-medium hover:bg-neon-blue/90 transition-colors"
          >
            Volver al modulo
          </Link>
        )}
      </div>
    </div>
  );
}
