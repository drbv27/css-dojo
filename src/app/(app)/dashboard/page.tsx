"use client";

import { useAuth } from "@/hooks/useAuth";
import { useProgress } from "@/hooks/useProgress";
import { getRank, getNextRank, getXPProgress } from "@/lib/xp";
import { ALL_MODULES } from "@/data/modules";
import { useDojo } from "@/hooks/useDojo";
import Link from "next/link";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useEffect, useState } from "react";
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

const dojoLabel: Record<string, string> = {
  html: "HTML",
  css: "CSS",
  js: "JavaScript",
  react: "React",
  "react-eco": "Ecosistema React",
  nextjs: "Next.js",
};

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { activeDojo } = useDojo();
  const { getModuleProgress, progress: allProgress, loading: progressLoading } = useProgress();
  const isTeacher = user?.role === "teacher";
  const [enabledSlugs, setEnabledSlugs] = useState<string[] | null>(null);

  useEffect(() => {
    fetch("/api/modules/enabled")
      .then((res) => res.json())
      .then((data) => setEnabledSlugs(data.enabledSlugs))
      .catch(() => setEnabledSlugs(null));
  }, []);

  if (loading || progressLoading) {
    return <LoadingSpinner />;
  }

  const name = user?.name?.split(" ")[0] ?? "Estudiante";
  const xp = user?.xp ?? 0;
  const rank = getRank(xp);
  const nextRank = getNextRank(xp);
  const xpProgress = getXPProgress(xp);
  const streak = user?.currentStreak ?? 0;
  const level = user?.level ?? 1;
  const accentText = dojoAccent[activeDojo] ?? "text-neon-blue";
  const progressColor = dojoProgressColor[activeDojo] ?? "bg-neon-blue";
  const DojoIcon = dojoIcon[activeDojo];

  // Get visible modules for active dojo
  const allDojoModules = ALL_MODULES.filter((m) => m.dojo === activeDojo);
  const visibleModules = isTeacher
    ? allDojoModules
    : enabledSlugs
    ? allDojoModules.filter((m) => enabledSlugs.includes(m.slug))
    : allDojoModules;

  // Calculate overall dojo progress
  const totalExercises = visibleModules.reduce((sum, m) => sum + m.exercises.length, 0);
  const completedExercises = visibleModules.reduce((sum, m) => {
    const mp = getModuleProgress(m.slug, m.exercises.length);
    return sum + mp.completed;
  }, 0);
  const overallPercentage = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;

  // Find the next module to continue (first module with incomplete exercises)
  const nextModule = visibleModules.find((m) => {
    const mp = getModuleProgress(m.slug, m.exercises.length);
    return mp.percentage < 100;
  });

  // Build per-module progress data
  const modulesWithProgress = visibleModules.map((m) => {
    const mp = getModuleProgress(m.slug, m.exercises.length);
    return { ...m, progress: mp };
  });

  // Count fully completed modules
  const completedModules = modulesWithProgress.filter((m) => m.progress.percentage === 100).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Welcome */}
      <div className="flex items-center gap-3">
        <DojoIcon className={`w-8 h-8 shrink-0 ${accentText} opacity-80`} />
        <div>
          <h1 className="text-2xl font-bold text-editor-text">
            Bienvenido, <span className={accentText}>{name}</span>
          </h1>
          <p className="text-editor-muted text-sm mt-0.5">
            Ruta de {dojoLabel[activeDojo] ?? activeDojo}
          </p>
        </div>
      </div>

      {/* Next step card - THE MOST IMPORTANT ELEMENT */}
      {nextModule && (
        <Link
          href={`/modulos/${nextModule.slug}`}
          className={`block bg-editor-surface border border-editor-border rounded-xl p-5 transition-all ${dojoBorderHover[activeDojo]}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs text-editor-muted uppercase tracking-wider mb-1">
                {getModuleProgress(nextModule.slug, nextModule.exercises.length).completed > 0
                  ? "Continuar con"
                  : "Siguiente modulo"}
              </p>
              <h2 className="text-lg font-bold text-editor-text mb-1">{nextModule.title}</h2>
              <p className="text-sm text-editor-muted">
                {getModuleProgress(nextModule.slug, nextModule.exercises.length).completed} de {nextModule.exercises.length} ejercicios completados
                {nextModule.exercises.length - getModuleProgress(nextModule.slug, nextModule.exercises.length).completed > 0 && (
                  <span className={`ml-1 ${accentText}`}>
                    — te faltan {nextModule.exercises.length - getModuleProgress(nextModule.slug, nextModule.exercises.length).completed}
                  </span>
                )}
              </p>
            </div>
            <div className="shrink-0 ml-4">
              <div className={`w-12 h-12 rounded-full border-4 border-editor-border flex items-center justify-center text-sm font-bold ${accentText}`}>
                {getModuleProgress(nextModule.slug, nextModule.exercises.length).percentage}%
              </div>
            </div>
          </div>
          <div className="mt-3 w-full h-2 bg-editor-bg rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${progressColor} transition-all duration-500`}
              style={{ width: `${getModuleProgress(nextModule.slug, nextModule.exercises.length).percentage}%` }}
            />
          </div>
        </Link>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall dojo progress */}
        <div className="bg-editor-surface border border-editor-border rounded-xl p-5">
          <p className="text-xs text-editor-muted uppercase tracking-wider mb-2">Progreso {dojoLabel[activeDojo]}</p>
          <p className="text-3xl font-bold font-mono tabular-nums text-editor-text">{overallPercentage}%</p>
          <div className="mt-2 w-full h-1.5 bg-editor-bg rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${progressColor} transition-all duration-500`}
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
          <p className="text-[11px] text-editor-muted mt-2">
            {completedExercises}/{totalExercises} ejercicios
          </p>
        </div>

        {/* XP */}
        <div className="bg-editor-surface border border-editor-border rounded-xl p-5">
          <p className="text-xs text-editor-muted uppercase tracking-wider mb-2">XP Total</p>
          <p className="text-3xl font-bold font-mono text-neon-yellow tabular-nums">{xp.toLocaleString()}</p>
          <div className="mt-2 w-full h-1.5 bg-editor-bg rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-neon-yellow transition-all duration-700"
              style={{ width: `${xpProgress.percentage}%` }}
            />
          </div>
          <p className="text-[11px] text-editor-muted mt-2">
            {nextRank ? `Siguiente: ${nextRank.name}` : "Rango maximo"}
          </p>
        </div>

        {/* Rank */}
        <div className="bg-editor-surface border border-editor-border rounded-xl p-5">
          <p className="text-xs text-editor-muted uppercase tracking-wider mb-2">Rango</p>
          <p className="text-2xl font-bold leading-tight" style={{ color: rank.color }}>
            {rank.name}
          </p>
          <p className="text-[11px] text-editor-muted mt-3">
            Racha: <span className="text-neon-orange font-semibold">{streak} {streak !== 1 ? "dias" : "dia"}</span>
          </p>
        </div>

        {/* Modules completed */}
        <div className="bg-editor-surface border border-editor-border rounded-xl p-5">
          <p className="text-xs text-editor-muted uppercase tracking-wider mb-2">Modulos</p>
          <p className="text-3xl font-bold font-mono text-editor-text tabular-nums">
            {completedModules}<span className="text-lg text-editor-muted font-normal">/{visibleModules.length}</span>
          </p>
          <p className="text-[11px] text-editor-muted mt-3">
            {completedModules === visibleModules.length
              ? "Todos completados!"
              : `${visibleModules.length - completedModules} por completar`}
          </p>
        </div>
      </div>

      {/* Module grid with REAL progress */}
      {visibleModules.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-editor-muted uppercase tracking-wider mb-4">
            Modulos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modulesWithProgress.map((mod) => {
              const isComplete = mod.progress.percentage === 100;
              const isStarted = mod.progress.completed > 0;

              return (
                <Link
                  key={mod.slug}
                  href={`/modulos/${mod.slug}`}
                  className={`bg-editor-surface border rounded-xl p-5 transition-all cursor-pointer group ${
                    isComplete
                      ? "border-neon-green/30"
                      : "border-editor-border"
                  } ${dojoBorderHover[activeDojo] ?? "hover:border-editor-muted/30"}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-editor-text transition-colors text-sm">
                      {mod.title}
                    </h3>
                    {isComplete && (
                      <span className="text-neon-green text-xs font-bold shrink-0 ml-2">✓</span>
                    )}
                  </div>

                  {/* Progress info */}
                  <div className="flex items-center justify-between text-xs text-editor-muted mb-2">
                    <span>
                      {mod.progress.completed}/{mod.progress.total} ejercicios
                    </span>
                    <span className={isComplete ? "text-neon-green font-semibold" : isStarted ? accentText : ""}>
                      {mod.progress.percentage}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-editor-bg rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isComplete ? "bg-neon-green" : progressColor
                      }`}
                      style={{ width: `${mod.progress.percentage}%` }}
                    />
                  </div>

                  {/* Status text */}
                  {!isStarted && (
                    <p className="text-[11px] text-editor-muted mt-2">Sin comenzar</p>
                  )}
                  {isStarted && !isComplete && (
                    <p className="text-[11px] text-editor-muted mt-2">
                      Faltan <span className={accentText}>{mod.progress.total - mod.progress.completed}</span> ejercicios
                    </p>
                  )}
                  {isComplete && (
                    <p className="text-[11px] text-neon-green mt-2">Completado</p>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {visibleModules.length === 0 && (
        <div className="bg-editor-surface border border-editor-border rounded-xl p-12 text-center">
          <DojoIcon className={`w-12 h-12 mx-auto mb-4 ${accentText} opacity-30`} />
          <h2 className="text-lg font-semibold text-editor-text mb-2">Proximamente</h2>
          <p className="text-editor-muted text-sm max-w-md mx-auto">
            Los modulos de esta ruta aun no estan disponibles. Tu profesor los habilitara pronto.
          </p>
        </div>
      )}
    </div>
  );
}
