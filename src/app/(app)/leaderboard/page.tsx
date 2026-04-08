"use client";

import { useAuth } from "@/hooks/useAuth";
import { getRank } from "@/lib/xp";
import { RANKS } from "@/lib/constants";
import { useEffect, useState } from "react";
import { FaHtml5, FaReact } from "react-icons/fa";
import { SiCss, SiJavascript, SiNextdotjs } from "react-icons/si";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import type { DojoType } from "@/types";

interface LeaderboardEntry {
  _id: string;
  name: string;
  xp: number;
  level?: number;
  exercisesCompleted?: number;
}

const rankColors: Record<number, { bg: string; text: string; ring: string }> = {
  1: { bg: "bg-neon-yellow/10", text: "text-neon-yellow", ring: "ring-neon-yellow/30" },
  2: { bg: "bg-[#C0C0C0]/10", text: "text-[#D1D5DB]", ring: "ring-[#C0C0C0]/30" },
  3: { bg: "bg-neon-orange/10", text: "text-neon-orange", ring: "ring-neon-orange/30" },
};

const filters: { key: DojoType | "general"; label: string; Icon?: React.ComponentType<{ className?: string }>; accent: string; accentBg: string }[] = [
  { key: "general", label: "General", accent: "text-neon-yellow", accentBg: "bg-neon-yellow/10" },
  { key: "html", label: "HTML", Icon: FaHtml5, accent: "text-neon-orange", accentBg: "bg-neon-orange/10" },
  { key: "css", label: "CSS", Icon: SiCss, accent: "text-css-purple", accentBg: "bg-css-purple/10" },
  { key: "js", label: "JS", Icon: SiJavascript, accent: "text-neon-yellow", accentBg: "bg-neon-yellow/10" },
  { key: "react", label: "React", Icon: FaReact, accent: "text-neon-teal", accentBg: "bg-neon-teal/10" },
  { key: "react-eco", label: "Ecosistema", Icon: FaReact, accent: "text-neon-green", accentBg: "bg-neon-green/10" },
  { key: "nextjs", label: "Next.js", Icon: SiNextdotjs, accent: "text-neon-blue", accentBg: "bg-neon-blue/10" },
];

function RanksDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Dialog */}
      <div className="relative bg-editor-surface border border-editor-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-editor-border flex items-center justify-between">
          <h2 className="text-lg font-bold text-editor-text">Sistema de Rangos</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-editor-hover text-editor-muted hover:text-editor-text transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Ranks list */}
        <div className="px-6 py-4 space-y-3 max-h-[60vh] overflow-y-auto">
          <p className="text-xs text-editor-muted mb-4">
            Completa ejercicios para ganar XP y subir de rango. Cada cinturon representa tu progreso como desarrollador.
          </p>
          {RANKS.map((rank, i) => {
            const nextRank = RANKS[i + 1];
            const xpRange = nextRank
              ? `${rank.minXP.toLocaleString()} - ${(nextRank.minXP - 1).toLocaleString()} XP`
              : `${rank.minXP.toLocaleString()}+ XP`;

            return (
              <div
                key={rank.name}
                className="flex items-center gap-3 p-3 rounded-xl border border-editor-border bg-editor-bg"
              >
                <LevelBadge rank={rank} size="md" />
                <span className="ml-auto text-xs font-mono text-editor-muted">{xpRange}</span>
              </div>
            );
          })}

          <div className="pt-3 border-t border-editor-border">
            <p className="text-[11px] text-editor-muted leading-relaxed">
              <span className="font-semibold text-editor-text">XP por ejercicio:</span>{" "}
              Dificultad 1 = 10 XP, Dificultad 2 = 20 XP, Dificultad 3 = 30 XP
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<DojoType | "general">("general");
  const [ranksOpen, setRanksOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const url = activeFilter === "general"
      ? "/api/leaderboard"
      : `/api/leaderboard?dojo=${activeFilter}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setEntries(data.leaderboard ?? data ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [activeFilter]);

  const getAvatar = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const activeFilterMeta = filters.find((f) => f.key === activeFilter) ?? filters[0];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-editor-text mb-2">
            Tabla de Posiciones
          </h1>
          <p className="text-editor-muted">
            Compite con otros estudiantes y sube en el ranking
          </p>
        </div>
        <button
          onClick={() => setRanksOpen(true)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-editor-surface border border-editor-border text-xs font-medium text-editor-muted hover:text-editor-text hover:border-editor-muted/50 transition-colors shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          Ver rangos
        </button>
      </div>

      {/* Ranks dialog */}
      <RanksDialog open={ranksOpen} onClose={() => setRanksOpen(false)} />

      {/* Filter tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {filters.map((f) => {
          const active = activeFilter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                active
                  ? `${f.accentBg} ${f.accent} border border-current/20`
                  : "bg-editor-surface text-editor-muted border border-editor-border hover:text-editor-text"
              }`}
            >
              {f.Icon && <f.Icon className="w-3.5 h-3.5" />}
              {f.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : entries.length === 0 ? (
        <div className="bg-editor-surface border border-editor-border rounded-xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-neon-yellow/10 border border-neon-yellow/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-neon-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-editor-text mb-2">
            {activeFilter === "general" ? "Aun no hay datos" : `Sin actividad en ${activeFilterMeta.label}`}
          </h2>
          <p className="text-editor-muted">
            Completa ejercicios para aparecer aqui!
          </p>
        </div>
      ) : (
        <>
          {/* Top 3 podium */}
          {entries.length >= 3 && (
            <div className="grid grid-cols-3 gap-4 items-end">
              {[entries[1] ?? null, entries[0] ?? null, entries[2] ?? null].map((entry, i) => {
                if (!entry) return <div key={`empty-${i}`} />;
                const order = [2, 1, 3][i];
                const colors = rankColors[order] ?? { bg: "bg-editor-surface", text: "text-editor-muted", ring: "" };
                const isFirst = order === 1;
                const isSecond = order === 2;
                const entryRank = getRank(entry.xp);
                // Heights: 1st = tallest, 2nd = medium, 3rd = shortest
                const podiumHeight = isFirst ? "pb-8" : isSecond ? "pb-4" : "pb-2";
                const avatarSize = isFirst ? "w-16 h-16 text-xl" : "w-14 h-14 text-lg";

                return (
                  <div
                    key={`podium-${entry._id}-${i}`}
                    className={`flex flex-col items-center p-5 ${podiumHeight} rounded-xl border border-editor-border bg-editor-surface ${
                      isFirst ? "ring-1 ring-neon-yellow/20" : ""
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full ${colors.bg} ${colors.text} flex items-center justify-center text-sm font-bold mb-3`}>
                      {order}
                    </div>
                    <div className={`${avatarSize} rounded-full ${colors.bg} ${colors.text} flex items-center justify-center font-bold mb-3 ring-2 ${colors.ring}`}>
                      {getAvatar(entry.name)}
                    </div>
                    <h3 className="font-semibold text-editor-text text-sm text-center mb-2">
                      {entry.name}
                    </h3>
                    <LevelBadge rank={entryRank} size="sm" />
                    <p className={`text-sm font-mono font-medium mt-2 ${activeFilterMeta.accent}`}>
                      {entry.xp.toLocaleString()} XP
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Full list */}
          <div className="bg-editor-surface border border-editor-border rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-editor-border flex items-center justify-between">
              <h2 className="text-sm font-semibold text-editor-text">
                {activeFilter === "general" ? "Clasificacion general" : `Ranking de ${activeFilterMeta.label}`}
              </h2>
              {activeFilter !== "general" && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${activeFilterMeta.accentBg} ${activeFilterMeta.accent}`}>
                  Solo XP de esta ruta
                </span>
              )}
            </div>

            <div className="divide-y divide-editor-border">
              {entries.map((entry, idx) => {
                const rank = idx + 1;
                const isCurrentUser = entry._id === user?.id;
                const entryRank = getRank(entry.xp);

                return (
                  <div
                    key={`list-${entry._id}`}
                    className={`flex items-center gap-4 px-6 py-4 transition-colors ${
                      isCurrentUser
                        ? "bg-neon-blue/5 border-l-2 border-l-neon-blue"
                        : "hover:bg-editor-hover"
                    }`}
                  >
                    <div className="w-8 text-center">
                      {rank <= 3 ? (
                        <span className={`text-lg font-bold ${rankColors[rank]?.text ?? "text-editor-muted"}`}>
                          {rank}
                        </span>
                      ) : (
                        <span className="text-sm text-editor-muted font-mono">{rank}</span>
                      )}
                    </div>

                    <div className="w-10 h-10 rounded-full bg-neon-purple/10 text-neon-purple flex items-center justify-center text-sm font-bold shrink-0">
                      {getAvatar(entry.name)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-editor-text text-sm truncate">
                          {entry.name}
                        </h3>
                        {isCurrentUser && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-neon-blue/10 text-neon-blue font-medium">
                            Tu
                          </span>
                        )}
                      </div>
                      <div className="mt-1">
                        <LevelBadge rank={entryRank} size="sm" />
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`text-sm font-mono font-medium ${activeFilterMeta.accent}`}>
                        {entry.xp.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-editor-muted">XP</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
