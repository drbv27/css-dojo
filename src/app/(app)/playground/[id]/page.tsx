"use client";

import { useState, useEffect, useRef, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CSSEditor from "@/components/editor/CSSEditor";
import LivePreview from "@/components/editor/LivePreview";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const STARTER_HTML = `<div class="container">
  <h1>Hola Mundo</h1>
  <p>Empieza a escribir tu CSS!</p>
</div>`;

const STARTER_CSS = `.container {
  padding: 2rem;
  text-align: center;
}

h1 {
  color: #89B4FA;
}`;

export default function PlaygroundEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [html, setHtml] = useState(STARTER_HTML);
  const [css, setCss] = useState(STARTER_CSS);
  const [title, setTitle] = useState("Playground sin titulo");
  const [playgroundId, setPlaygroundId] = useState<string | null>(
    id === "new" ? null : id
  );
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstLoad = useRef(true);

  // Fetch or create playground
  useEffect(() => {
    async function init() {
      if (id === "new") {
        // Create a fresh playground
        try {
          const res = await fetch("/api/playgrounds", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: "Playground sin titulo",
              html: STARTER_HTML,
              css: STARTER_CSS,
            }),
          });
          if (res.ok) {
            const data = await res.json();
            setPlaygroundId(data.playground._id);
            // Replace URL without adding to history
            window.history.replaceState(
              null,
              "",
              `/playground/${data.playground._id}`
            );
          }
        } catch {
          // silently fail
        }
      } else {
        // Fetch existing playground
        try {
          const res = await fetch(`/api/playgrounds/${id}`);
          if (res.ok) {
            const data = await res.json();
            const pg = data.playground;
            setHtml(pg.html || STARTER_HTML);
            setCss(pg.css || STARTER_CSS);
            setTitle(pg.title || "Playground sin titulo");
          } else {
            router.push("/playground");
            return;
          }
        } catch {
          router.push("/playground");
          return;
        }
      }
      setLoading(false);
      isFirstLoad.current = false;
    }
    init();
  }, [id, router]);

  // Auto-save with debounce
  const savePlayground = useCallback(
    async (currentTitle: string, currentHtml: string, currentCss: string) => {
      if (!playgroundId) return;
      try {
        await fetch(`/api/playgrounds/${playgroundId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: currentTitle,
            html: currentHtml,
            css: currentCss,
          }),
        });
        setSaved(true);
      } catch {
        // silently fail
      }
    },
    [playgroundId]
  );

  useEffect(() => {
    if (isFirstLoad.current || !playgroundId) return;

    setSaved(false);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      savePlayground(title, html, css);
    }, 2000);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [html, css, title, playgroundId, savePlayground]);

  async function handleDelete() {
    if (!playgroundId) return;
    if (!confirm("Seguro que quieres eliminar este playground?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/playgrounds/${playgroundId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/playground");
      }
    } catch {
      // silently fail
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-editor-surface border-b border-editor-border rounded-t-xl shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/playground"
            className="p-1.5 rounded-md hover:bg-editor-hover transition-colors text-editor-muted hover:text-editor-text"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-transparent border-none outline-none text-sm font-medium text-editor-text placeholder-editor-muted focus:ring-1 focus:ring-neon-blue/50 rounded px-2 py-1 w-48 sm:w-64"
            placeholder="Titulo del playground"
          />
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2 py-1 rounded ${
              saved
                ? "text-neon-green bg-neon-green/10"
                : "text-neon-yellow bg-neon-yellow/10"
            }`}
          >
            {saved ? "Guardado" : "Guardando..."}
          </span>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-3 py-1.5 text-xs font-medium rounded-md bg-editor-bg border border-editor-border text-neon-red hover:bg-neon-red/10 hover:border-neon-red/30 transition-colors disabled:opacity-50"
          >
            {deleting ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>

      {/* Split view */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 border border-t-0 border-editor-border rounded-b-xl overflow-hidden">
        {/* Editor panel - left half */}
        <div className="flex-1 flex flex-col min-h-0 border-b lg:border-b-0 lg:border-r border-editor-border">
          {/* HTML Editor */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="px-4 py-2 border-b border-editor-border bg-editor-sidebar shrink-0">
              <span className="text-xs text-editor-muted font-mono">
                index.html
              </span>
            </div>
            <div className="flex-1 min-h-0">
              <CSSEditor
                value={html}
                onChange={setHtml}
                height="100%"
                language="html"
              />
            </div>
          </div>

          {/* CSS Editor */}
          <div className="flex-1 flex flex-col min-h-0 border-t border-editor-border">
            <div className="px-4 py-2 border-b border-editor-border bg-editor-sidebar shrink-0">
              <span className="text-xs text-editor-muted font-mono">
                styles.css
              </span>
            </div>
            <div className="flex-1 min-h-0">
              <CSSEditor value={css} onChange={setCss} height="100%" />
            </div>
          </div>
        </div>

        {/* Preview panel - right half */}
        <div className="flex-1 flex flex-col min-h-0">
          <LivePreview html={html} css={css} className="flex-1 h-full border-0 rounded-none" />
        </div>
      </div>
    </div>
  );
}
