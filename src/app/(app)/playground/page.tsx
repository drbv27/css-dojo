"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface PlaygroundItem {
  _id: string;
  title: string;
  html: string;
  css: string;
  createdAt: string;
  updatedAt: string;
}

export default function PlaygroundListPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [playgrounds, setPlaygrounds] = useState<PlaygroundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    async function fetchPlaygrounds() {
      try {
        const res = await fetch("/api/playgrounds");
        if (res.ok) {
          const data = await res.json();
          setPlaygrounds(data.playgrounds ?? []);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    if (user) fetchPlaygrounds();
    else if (!authLoading) setLoading(false);
  }, [user, authLoading]);

  async function handleCreate() {
    setCreating(true);
    try {
      const res = await fetch("/api/playgrounds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Playground sin titulo",
          html: '<div class="container">\n  <h1>Hola Mundo</h1>\n  <p>Empieza a escribir tu CSS!</p>\n</div>',
          css: ".container {\n  padding: 2rem;\n  text-align: center;\n}\n\nh1 {\n  color: #89B4FA;\n}",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/playground/${data.playground._id}`);
      }
    } catch {
      // silently fail
    } finally {
      setCreating(false);
    }
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "Hace un momento";
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
    if (diffDays < 7) return `Hace ${diffDays} dia${diffDays > 1 ? "s" : ""}`;
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
  }

  function getPreviewSnippet(css: string) {
    if (!css) return "/* vacio */";
    return css.slice(0, 80) + (css.length > 80 ? "..." : "");
  }

  if (loading || authLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-editor-text mb-1">
            CSS Playground
          </h1>
          <p className="text-editor-muted">
            Experimenta con CSS en un entorno libre
          </p>
        </div>
        <button
          onClick={handleCreate}
          disabled={creating}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-neon-blue text-editor-bg rounded-lg text-sm font-medium hover:bg-neon-blue/90 transition-colors disabled:opacity-50"
        >
          {creating ? (
            <div className="w-4 h-4 border-2 border-editor-bg border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          )}
          Nuevo Playground
        </button>
      </div>

      {/* Empty state */}
      {playgrounds.length === 0 && (
        <div className="bg-editor-surface border border-editor-border rounded-xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-editor-text mb-2">
            No tienes playgrounds aun
          </h2>
          <p className="text-editor-muted mb-6">
            Crea tu primer playground para experimentar con HTML y CSS libremente
          </p>
          <button
            onClick={handleCreate}
            disabled={creating}
            className="inline-flex items-center gap-2 px-6 py-3 bg-neon-blue text-editor-bg rounded-lg text-sm font-medium hover:bg-neon-blue/90 transition-colors disabled:opacity-50"
          >
            Crear mi primer Playground
          </button>
        </div>
      )}

      {/* Playgrounds grid */}
      {playgrounds.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {playgrounds.map((pg) => (
            <Link
              key={pg._id}
              href={`/playground/${pg._id}`}
              className="bg-editor-surface border border-editor-border rounded-xl overflow-hidden hover:border-editor-muted/50 transition-all group"
            >
              {/* Preview area */}
              <div className="h-36 bg-editor-bg border-b border-editor-border p-4 overflow-hidden">
                <pre className="text-[10px] leading-relaxed font-mono text-editor-muted/60 whitespace-pre-wrap">
                  {getPreviewSnippet(pg.css)}
                </pre>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-medium text-editor-text group-hover:text-neon-blue transition-colors mb-1 truncate">
                  {pg.title}
                </h3>
                <p className="text-xs text-editor-muted">
                  {formatDate(pg.updatedAt)}
                </p>
              </div>
            </Link>
          ))}

          {/* New card */}
          <button
            onClick={handleCreate}
            disabled={creating}
            className="bg-editor-surface/50 border border-dashed border-editor-border rounded-xl flex flex-col items-center justify-center min-h-[220px] hover:border-neon-blue/30 hover:bg-editor-surface transition-all group disabled:opacity-50"
          >
            <div className="w-12 h-12 rounded-xl bg-editor-bg border border-editor-border flex items-center justify-center mb-3 group-hover:border-neon-blue/30 transition-colors">
              <svg className="w-6 h-6 text-editor-muted group-hover:text-neon-blue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-sm text-editor-muted group-hover:text-neon-blue transition-colors">
              Crear playground
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
