"use client";

import { useAuth } from "@/hooks/useAuth";
import { getRank } from "@/lib/xp";
import { useEffect, useState } from "react";
import { FaHtml5, FaReact } from "react-icons/fa";
import { SiCss, SiJavascript, SiNextdotjs } from "react-icons/si";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
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
  2: { bg: "bg-editor-muted/10", text: "text-editor-muted", ring: "ring-editor-muted/30" },
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

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<DojoType | "general">("general");

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
      <div>
        <h1 className="text-2xl font-bold text-editor-text mb-2">
          Tabla de Posiciones
        </h1>
        <p className="text-editor-muted">
          Compite con otros estudiantes y sube en el ranking
        </p>
      </div>

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
            <div className="grid grid-cols-3 gap-4">
              {[entries[1] ?? null, entries[0] ?? null, entries[2] ?? null].map((entry, i) => {
                if (!entry) return <div key={`empty-${i}`} />;
                const order = [2, 1, 3][i];
                const colors = rankColors[order] ?? { bg: "bg-editor-surface", text: "text-editor-muted", ring: "" };
                const isFirst = order === 1;
                const entryRank = getRank(entry.xp);

                return (
                  <div
                    key={`podium-${entry._id}-${i}`}
                    className={`flex flex-col items-center p-5 rounded-xl border border-editor-border bg-editor-surface ${
                      isFirst ? "ring-1 ring-neon-yellow/20 -mt-4" : "mt-0"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full ${colors.bg} ${colors.text} flex items-center justify-center text-sm font-bold mb-3`}>
                      {order}
                    </div>
                    <div className={`w-14 h-14 rounded-full ${colors.bg} ${colors.text} flex items-center justify-center text-lg font-bold mb-3 ring-2 ${colors.ring}`}>
                      {getAvatar(entry.name)}
                    </div>
                    <h3 className="font-semibold text-editor-text text-sm text-center mb-1">
                      {entry.name}
                    </h3>
                    <p className="text-xs text-editor-muted mb-2">{entryRank.name}</p>
                    <p className={`text-sm font-mono font-medium ${activeFilterMeta.accent}`}>
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
                      <p className="text-xs text-editor-muted">
                        {entryRank.name}
                        {entry.exercisesCompleted != null && ` · ${entry.exercisesCompleted} ej.`}
                      </p>
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
