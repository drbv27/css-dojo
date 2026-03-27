"use client";

import { useAuth } from "@/hooks/useAuth";
import { useDojo } from "@/hooks/useDojo";
import { getRank, getXPProgress } from "@/lib/xp";
import { ALL_MODULES } from "@/data/modules";
import Link from "next/link";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const iconMap: Record<string, React.ReactNode> = {
  zap: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  star: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  flame: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    </svg>
  ),
  check: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { activeDojo } = useDojo();
  const filteredModules = ALL_MODULES.filter((mod) => mod.dojo === activeDojo);

  if (loading) {
    return <LoadingSpinner />;
  }
  const name = user?.name?.split(" ")[0] ?? "Estudiante";

  const xp = user?.xp ?? 0;
  const rank = getRank(xp);
  const streak = user?.currentStreak ?? 0;

  const stats = [
    { label: "XP Total", value: xp.toLocaleString(), icon: "zap", color: "text-neon-yellow", bg: "bg-neon-yellow/10" },
    { label: "Rango", value: rank.name, icon: "star", color: "text-neon-purple", bg: "bg-neon-purple/10" },
    { label: "Racha", value: `${streak} dia${streak !== 1 ? "s" : ""}`, icon: "flame", color: "text-neon-orange", bg: "bg-neon-orange/10" },
    { label: "Ejercicios", value: "\u2014", icon: "check", color: "text-neon-green", bg: "bg-neon-green/10" },
  ];

  const moduleColors = ["bg-neon-blue", "bg-neon-purple", "bg-neon-green", "bg-neon-pink", "bg-neon-orange"];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-editor-text">
          Bienvenido de vuelta, <span className="text-neon-blue">{name}</span>
        </h1>
        <p className="text-editor-muted mt-1">
          {activeDojo === "css" ? "Continua tu ruta de CSS" : "Continua tu ruta de JavaScript"}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-editor-surface border border-editor-border rounded-xl p-6 transition-colors hover:border-editor-muted/30"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center`}
              >
                {iconMap[stat.icon]}
              </div>
              <div>
                <p className="text-2xl font-bold text-editor-text">{stat.value}</p>
                <p className="text-sm text-editor-muted">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Continue learning */}
      <div>
        <h2 className="text-lg font-semibold text-editor-text mb-4">
          Continuar aprendiendo
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredModules.map((mod, i) => (
            <Link
              key={mod.slug}
              href={`/modulos/${mod.slug}`}
              className="bg-editor-surface border border-editor-border rounded-xl p-5 hover:border-editor-muted/30 transition-all cursor-pointer group"
            >
              <h3 className="font-semibold text-editor-text group-hover:text-neon-blue transition-colors mb-2">
                {mod.title}
              </h3>
              <p className="text-xs text-editor-muted mb-3">
                {mod.lessons.length} lecciones &middot; {mod.exercises.length} ejercicios
              </p>
              {/* Progress bar */}
              <div className="w-full h-1.5 bg-editor-bg rounded-full overflow-hidden">
                <div
                  className={`h-full ${moduleColors[i % moduleColors.length]} rounded-full transition-all`}
                  style={{ width: "0%" }}
                />
              </div>
              <p className="text-xs text-editor-muted mt-2 text-right">
                0%
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
