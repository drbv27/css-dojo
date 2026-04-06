"use client";

import Link from "next/link";
import { use, useState, useEffect } from "react";
import { ALL_MODULES } from "@/data/modules";
import { useAuth } from "@/hooks/useAuth";
import { useProgress } from "@/hooks/useProgress";
import type { ExerciseType } from "@/types";

const exerciseTypeLabels: Record<ExerciseType, { label: string; icon: string; color: string }> = {
  quiz: { label: "Quiz", icon: "?", color: "text-neon-blue bg-neon-blue/10" },
  "code-completion": { label: "Codigo", icon: "_", color: "text-neon-green bg-neon-green/10" },
  "live-editor": { label: "Editor", icon: "<>", color: "text-neon-orange bg-neon-orange/10" },
  "visual-match": { label: "Visual", icon: "V", color: "text-neon-purple bg-neon-purple/10" },
  "drag-drop": { label: "Drag & Drop", icon: "D", color: "text-neon-pink bg-neon-pink/10" },
};

export default function ModuleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { user } = useAuth();
  const { progress, getModuleProgress } = useProgress();
  const isTeacher = user?.role === "teacher";
  const [activeTab, setActiveTab] = useState<"lecciones" | "ejercicios">("lecciones");
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

  if (checkingEnabled) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-editor-surface rounded mb-4" />
          <div className="h-40 bg-editor-surface rounded-xl" />
        </div>
      </div>
    );
  }

  if (moduleDisabled && !isTeacher) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
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

  if (!mod) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
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
          <h1 className="text-xl font-bold text-editor-text mb-2">Proximamente</h1>
          <p className="text-editor-muted">Este modulo aun no esta disponible. Vuelve pronto.</p>
        </div>
      </div>
    );
  }

  const lessons = [...mod.lessons].sort((a, b) => a.order - b.order);
  const exercises = [...mod.exercises].sort((a, b) => a.order - b.order);
  const modProgress = getModuleProgress(mod.slug, exercises.length);
  const progressPercent = modProgress.percentage;

  // Build a map of exerciseId -> progress entry for status indicators
  const exerciseProgressMap = new Map<string, { completed: boolean; score: number; xpEarned: number; attempts: number }>();
  for (const p of progress) {
    if (p.moduleId === slug) {
      exerciseProgressMap.set(p.exerciseId, {
        completed: p.completed,
        score: p.score,
        xpEarned: p.xpEarned,
        attempts: p.attempts,
      });
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/modulos"
          className="inline-flex items-center gap-2 text-sm text-editor-muted hover:text-neon-blue transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a modulos
        </Link>

        <h1 className="text-2xl font-bold text-editor-text mb-2">{mod.title}</h1>
        <p className="text-editor-muted mb-4">
          {mod.description}
        </p>

        {/* Progress bar */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-2 bg-editor-surface rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                progressPercent === 100 ? "bg-neon-green" : "bg-neon-blue"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className={`text-sm font-mono whitespace-nowrap ${
            progressPercent === 100 ? "text-neon-green font-semibold" : "text-editor-muted"
          }`}>
            {progressPercent}% completado
          </span>
        </div>

        {/* Progress summary */}
        {modProgress.completed > 0 && (
          <p className="text-xs text-editor-muted mt-2">
            {modProgress.completed} de {modProgress.total} ejercicios completados
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-editor-surface rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("lecciones")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "lecciones"
              ? "bg-editor-bg text-neon-blue"
              : "text-editor-muted hover:text-editor-text"
          }`}
        >
          Lecciones ({lessons.length})
        </button>
        <button
          onClick={() => setActiveTab("ejercicios")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "ejercicios"
              ? "bg-editor-bg text-neon-blue"
              : "text-editor-muted hover:text-editor-text"
          }`}
        >
          Ejercicios ({exercises.length})
        </button>
      </div>

      {/* Tab content */}
      {activeTab === "lecciones" ? (
        <div className="space-y-2">
          {lessons.map((lesson, i) => (
            <Link
              key={lesson.id}
              href={`/modulos/${slug}/leccion/${lesson.id}`}
              className="flex items-center gap-4 p-4 bg-editor-surface border border-editor-border rounded-xl hover:border-editor-muted/50 transition-all group"
            >
              {/* Step number */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 bg-editor-bg text-editor-muted"
              >
                {i + 1}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-editor-text group-hover:text-neon-blue transition-colors">
                  {lesson.title}
                </h3>
              </div>

              {/* Arrow */}
              <svg className="w-4 h-4 text-editor-muted group-hover:text-neon-blue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {exercises.map((exercise) => {
            const typeInfo = exerciseTypeLabels[exercise.type] ?? exerciseTypeLabels.quiz;
            const ep = exerciseProgressMap.get(exercise.id);
            // Status: completed (score >= 70), attempted (has attempts but not completed), pending
            const status = ep?.completed ? "completed" : ep?.attempts ? "attempted" : "pending";

            return (
              <Link
                key={exercise.id}
                href={`/modulos/${slug}/ejercicio/${exercise.id}`}
                className={`bg-editor-surface border rounded-xl p-5 hover:border-editor-muted/50 transition-all group ${
                  status === "completed"
                    ? "border-neon-green/30"
                    : status === "attempted"
                    ? "border-neon-orange/30"
                    : "border-editor-border"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  {/* Type icon */}
                  <div
                    className={`w-8 h-8 rounded-lg ${typeInfo.color} flex items-center justify-center text-xs font-mono font-bold`}
                  >
                    {typeInfo.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Status indicator */}
                    {status === "completed" && (
                      <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-neon-green/10 text-neon-green font-medium">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        Completado
                      </span>
                    )}
                    {status === "attempted" && (
                      <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-neon-orange/10 text-neon-orange font-medium">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />
                        </svg>
                        Intentado
                      </span>
                    )}
                    {/* Type badge */}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeInfo.color}`}>
                      {typeInfo.label}
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-medium text-editor-text group-hover:text-neon-blue transition-colors mb-2">
                  {exercise.prompt.length > 80
                    ? exercise.prompt.slice(0, 80) + "..."
                    : exercise.prompt}
                </h3>

                <div className="flex items-center justify-between">
                  {/* Difficulty stars */}
                  <div className="flex gap-0.5">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < exercise.difficulty
                            ? "text-neon-yellow"
                            : "text-editor-border"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  {/* XP */}
                  <span className={`text-xs font-mono ${
                    status === "completed" ? "text-neon-green" : "text-neon-yellow"
                  }`}>
                    {status === "completed" ? (
                      <>+{ep?.xpEarned ?? exercise.xpReward} XP</>
                    ) : (
                      <>+{exercise.xpReward} XP</>
                    )}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
