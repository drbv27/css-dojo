"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Lock } from "lucide-react";

const games = [
  {
    href: "/juegos/flexbox",
    slug: "game-flexbox-dojo",
    title: "Flexbox Dojo",
    description: "Domina Flexbox moviendo elementos a su posicion correcta",
    levels: 24,
    xpTotal: 25,
    accent: "neon-teal",
    accentBg: "bg-neon-teal",
    icon: (
      <svg className="w-10 h-10 text-neon-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h8m-8 6h16" />
      </svg>
    ),
    preview: (
      <div className="flex items-center justify-center gap-2 h-full">
        <div className="w-6 h-6 rounded bg-neon-teal/60" />
        <div className="w-6 h-6 rounded bg-neon-teal/40" />
        <div className="w-6 h-6 rounded bg-neon-teal/20" />
      </div>
    ),
  },
  {
    href: "/juegos/grid",
    slug: "game-grid-dojo",
    title: "Grid Dojo",
    description: "Aprende CSS Grid posicionando elementos en la cuadricula",
    levels: 24,
    xpTotal: 25,
    accent: "neon-purple",
    accentBg: "bg-neon-purple",
    icon: (
      <svg className="w-10 h-10 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z" />
      </svg>
    ),
    preview: (
      <div className="grid grid-cols-3 grid-rows-2 gap-1.5 h-full p-1">
        <div className="rounded bg-neon-purple/50 col-span-2" />
        <div className="rounded bg-neon-purple/30" />
        <div className="rounded bg-neon-purple/20" />
        <div className="rounded bg-neon-purple/40 col-span-2" />
      </div>
    ),
  },
];

export default function JuegosPage() {
  const { user } = useAuth();
  const isTeacher = user?.role === "teacher";
  const [disabledSlugs, setDisabledSlugs] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/games/enabled")
      .then((r) => r.json())
      .then((data) => setDisabledSlugs(data.disabledSlugs ?? []))
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-editor-text mb-2">Juegos CSS</h1>
        <p className="text-editor-muted">
          Aprende CSS de forma interactiva con juegos progresivos. 1 XP por nivel + 1 XP bonus al completar todo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {games.map((game) => {
          const isDisabled = !isTeacher && disabledSlugs.includes(game.slug);

          if (isDisabled) {
            return (
              <div
                key={game.href}
                className="bg-editor-surface border border-editor-border rounded-xl overflow-hidden opacity-50 cursor-not-allowed"
              >
                <div className="h-32 bg-editor-bg border-b border-editor-border p-6 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-editor-muted" />
                </div>
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-editor-bg border border-editor-border flex items-center justify-center shrink-0">
                      {game.icon}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-editor-muted mb-1">{game.title}</h2>
                      <p className="text-sm text-editor-muted mb-3">{game.description}</p>
                      <span className="text-xs text-editor-muted italic">Proximamente</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <Link
              key={game.href}
              href={game.href}
              className="group bg-editor-surface border border-editor-border rounded-xl overflow-hidden hover:border-editor-muted/50 transition-all"
            >
              <div className="h-32 bg-editor-bg border-b border-editor-border p-6">
                {game.preview}
              </div>
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-${game.accent}/10 border border-${game.accent}/20 flex items-center justify-center shrink-0`}>
                    {game.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className={`text-lg font-bold text-editor-text group-hover:text-${game.accent} transition-colors mb-1`}>
                      {game.title}
                    </h2>
                    <p className="text-sm text-editor-muted mb-3">{game.description}</p>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full bg-${game.accent}/10 text-${game.accent}`}>
                        {game.levels} niveles
                      </span>
                      <span className="text-xs text-editor-muted">{game.xpTotal} XP total</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
