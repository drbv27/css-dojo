"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const GAMES = [
  { slug: "game-flexbox-dojo", title: "Flexbox Dojo", levels: 24, color: "#94E2D5" },
  { slug: "game-grid-dojo", title: "Grid Dojo", levels: 24, color: "#CBA6F7" },
];

export default function TeacherJuegosPage() {
  const [settings, setSettings] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/teacher/games")
      .then((r) => r.json())
      .then((data: any[]) => {
        const map: Record<string, boolean> = {};
        data.forEach((s) => { map[s.slug] = s.enabled; });
        setSettings(map);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleToggle = async (slug: string) => {
    const currentEnabled = settings[slug] ?? true; // default enabled
    const newEnabled = !currentEnabled;
    setToggling(slug);

    try {
      await fetch("/api/teacher/games", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, enabled: newEnabled }),
      });
      setSettings((prev) => ({ ...prev, [slug]: newEnabled }));
    } catch {} finally {
      setToggling(null);
    }
  };

  const isEnabled = (slug: string) => settings[slug] ?? true;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <div>
        <Link
          href="/teacher"
          className="inline-flex items-center gap-2 text-sm text-editor-muted hover:text-neon-blue transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Panel
        </Link>
        <h1 className="text-2xl font-bold text-editor-text mb-2">Gestionar Juegos</h1>
        <p className="text-editor-muted text-sm">
          Activa o desactiva los juegos CSS para tus estudiantes.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-neon-blue border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {GAMES.map((game) => {
            const enabled = isEnabled(game.slug);
            return (
              <div
                key={game.slug}
                className="bg-editor-surface border border-editor-border rounded-xl p-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
                    style={{ background: game.color + "15", color: game.color }}
                  >
                    {game.title.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-editor-text">{game.title}</h3>
                    <p className="text-xs text-editor-muted">{game.levels} niveles &middot; {game.levels + 1} XP total</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(game.slug)}
                  disabled={toggling === game.slug}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    enabled ? "bg-neon-green" : "bg-editor-border"
                  } ${toggling === game.slug ? "opacity-50" : ""}`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      enabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
