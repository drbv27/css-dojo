"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getRank, getNextRank, getXPProgress } from "@/lib/xp";
import { ALL_MODULES } from "@/data/modules";
import { useDojo } from "@/hooks/useDojo";
import Link from "next/link";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { FaHtml5, FaReact } from "react-icons/fa";
import { SiCss, SiJavascript, SiNextdotjs } from "react-icons/si";

const dojoIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  html: FaHtml5,
  css: SiCss,
  js: SiJavascript,
  react: FaReact,
  "react-eco": FaReact,
  nextjs: SiNextdotjs,
};

const dojoAccent: Record<string, string> = {
  html: "text-neon-orange",
  css: "text-css-purple",
  js: "text-neon-yellow",
  react: "text-neon-teal",
  "react-eco": "text-neon-green",
  nextjs: "text-neon-blue",
};

const dojoProgressColor: Record<string, string> = {
  html: "bg-neon-orange",
  css: "bg-css-purple",
  js: "bg-neon-yellow",
  react: "bg-neon-teal",
  "react-eco": "bg-neon-green",
  nextjs: "bg-neon-blue",
};

const dojoBorderHover: Record<string, string> = {
  html: "hover:border-neon-orange/30 hover:bg-neon-orange/[0.03]",
  css: "hover:border-css-purple/30 hover:bg-css-purple/[0.03]",
  js: "hover:border-neon-yellow/30 hover:bg-neon-yellow/[0.03]",
  react: "hover:border-neon-teal/30 hover:bg-neon-teal/[0.03]",
  "react-eco": "hover:border-neon-green/30 hover:bg-neon-green/[0.03]",
  nextjs: "hover:border-neon-blue/30 hover:bg-neon-blue/[0.03]",
};

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { activeDojo } = useDojo();
  const isTeacher = user?.role === "teacher";
  const [enabledSlugs, setEnabledSlugs] = useState<string[] | null>(null);

  useEffect(() => {
    fetch("/api/modules/enabled")
      .then((res) => res.json())
      .then((data) => setEnabledSlugs(data.enabledSlugs))
      .catch(() => setEnabledSlugs(null));
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const name = user?.name?.split(" ")[0] ?? "Estudiante";
  const xp = user?.xp ?? 0;
  const rank = getRank(xp);
  const nextRank = getNextRank(xp);
  const progress = getXPProgress(xp);
  const streak = user?.currentStreak ?? 0;
  const level = user?.level ?? 1;
  const accentText = dojoAccent[activeDojo] ?? "text-neon-blue";
  const DojoIcon = dojoIcon[activeDojo];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome */}
      <div className="flex items-center gap-3">
        <DojoIcon className={`w-8 h-8 shrink-0 ${accentText} opacity-80`} />
        <div>
        <h1 className="text-2xl font-bold text-editor-text">
          Bienvenido de vuelta, <span className={accentText}>{name}</span>
        </h1>
        <p className="text-editor-muted text-sm mt-0.5">
          {activeDojo === "html"
            ? "Continua tu ruta de HTML"
            : activeDojo === "css"
            ? "Continua tu camino hacia el dominio de CSS"
            : activeDojo === "js"
            ? "Continua tu camino hacia el dominio de JavaScript"
            : activeDojo === "react"
            ? "Continua tu ruta de React"
            : activeDojo === "react-eco"
            ? "Domina las herramientas del ecosistema React"
            : "Aprende Next.js con App Router"}
        </p>
        </div>
      </div>

      {/* Stats row — each card has its own treatment */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* XP — featured: shows progress to next rank */}
        <div className="bg-editor-surface border border-editor-border rounded-xl p-5 relative overflow-hidden">
          <p className="text-xs text-editor-muted uppercase tracking-wider mb-2">XP Total</p>
          <p className="text-3xl font-bold font-mono text-neon-yellow tabular-nums">{xp.toLocaleString()}</p>
          <div className="mt-3 space-y-1.5">
            <div className="w-full h-1 bg-editor-bg rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-neon-yellow transition-all duration-700"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
            <p className="text-[11px] text-editor-muted">
              {nextRank ? `→ ${nextRank.name}: ${nextRank.minXP} XP` : "Rango máximo alcanzado"}
            </p>
          </div>
        </div>

        {/* Rank — name in rank color is the hero, not an icon */}
        <div className="bg-editor-surface border border-editor-border rounded-xl p-5">
          <p className="text-xs text-editor-muted uppercase tracking-wider mb-2">Rango</p>
          <p
            className="text-2xl font-bold leading-tight"
            style={{ color: rank.color }}
          >
            {rank.name}
          </p>
          <p className="text-xs text-editor-muted mt-3">
            Nivel <span className="text-editor-text font-semibold">{level}</span>
          </p>
        </div>

        {/* Streak — number is the point, "días" is secondary */}
        <div className="bg-editor-surface border border-editor-border rounded-xl p-5">
          <p className="text-xs text-editor-muted uppercase tracking-wider mb-2">Racha</p>
          <div className="flex items-baseline gap-1.5">
            <p className="text-3xl font-bold font-mono text-neon-orange tabular-nums">{streak}</p>
            <p className="text-sm text-editor-muted">{streak !== 1 ? "días" : "día"}</p>
          </div>
          <p className="text-[11px] text-editor-muted mt-3">
            {streak === 0 ? "Comienza hoy" : streak >= 7 ? "¡Racha impresionante!" : "Sigue así"}
          </p>
        </div>

        {/* Modules in track */}
        <div className="bg-editor-surface border border-editor-border rounded-xl p-5">
          <p className="text-xs text-editor-muted uppercase tracking-wider mb-2">Módulos</p>
          <p className="text-3xl font-bold font-mono text-editor-text tabular-nums">
            {ALL_MODULES.filter((m) => m.dojo === activeDojo).length}
          </p>
          <p className="text-[11px] text-editor-muted mt-3">
            en{" "}
            <span className={`font-medium ${accentText}`}>
              {activeDojo === "html" ? "HTML" : activeDojo === "css" ? "CSS" : activeDojo === "js" ? "JavaScript" : activeDojo === "react" ? "React" : activeDojo === "react-eco" ? "Ecosistema React" : "Next.js"}
            </span>
          </p>
        </div>
      </div>

      {/* Continue learning */}
      {(() => {
        const allDojoModules = ALL_MODULES.filter((m) => m.dojo === activeDojo);
        const visibleModules = isTeacher
          ? allDojoModules
          : enabledSlugs
          ? allDojoModules.filter((m) => enabledSlugs.includes(m.slug))
          : allDojoModules;

        if (visibleModules.length === 0) {
          return (
            <div className="bg-editor-surface border border-editor-border rounded-xl p-12 text-center">
              <DojoIcon className={`w-12 h-12 mx-auto mb-4 ${accentText} opacity-30`} />
              <h2 className="text-lg font-semibold text-editor-text mb-2">Próximamente</h2>
              <p className="text-editor-muted text-sm max-w-md mx-auto">
                Los módulos de esta ruta aún no están disponibles. Tu profesor los habilitará pronto.
              </p>
            </div>
          );
        }

        return (
          <div>
            <h2 className="text-sm font-semibold text-editor-muted uppercase tracking-wider mb-4">
              Continuar aprendiendo
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleModules.map((mod) => (
                <Link
                  key={mod.slug}
                  href={`/modulos/${mod.slug}`}
                  className={`bg-editor-surface border border-editor-border rounded-xl p-5 transition-all cursor-pointer group ${dojoBorderHover[activeDojo] ?? "hover:border-editor-muted/30"}`}
                >
                  <h3 className="font-semibold text-editor-text transition-colors mb-2">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-editor-muted mb-3">
                    {mod.lessons.length} lecciones &middot; {mod.exercises.length} ejercicios
                  </p>
                  <div className="w-full h-1 bg-editor-bg rounded-full overflow-hidden">
                    <div
                      className={`h-full ${dojoProgressColor[activeDojo] ?? "bg-neon-blue"} rounded-full transition-all opacity-60`}
                      style={{ width: "0%" }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
