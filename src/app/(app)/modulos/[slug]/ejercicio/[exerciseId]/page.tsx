"use client";

import Link from "next/link";
import { use, useCallback, useState, useEffect } from "react";
import { ALL_MODULES } from "@/data/modules";
import ExerciseRenderer from "@/components/exercises/ExerciseRenderer";
import AchievementToast from "@/components/gamification/AchievementToast";
import { useAuth } from "@/hooks/useAuth";

export default function ExercisePage({
  params,
}: {
  params: Promise<{ slug: string; exerciseId: string }>;
}) {
  const { slug, exerciseId } = use(params);
  const [completed, setCompleted] = useState(false);
  const [achievement, setAchievement] = useState<{ title: string; description: string; icon: string } | null>(null);
  const [moduleDisabled, setModuleDisabled] = useState(false);
  const [checkingEnabled, setCheckingEnabled] = useState(true);
  const { refreshUser } = useAuth();

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
  const exercises = mod ? [...mod.exercises].sort((a, b) => a.order - b.order) : [];
  const exerciseIdx = exercises.findIndex((e) => e.id === exerciseId);
  const exercise = exerciseIdx !== -1 ? exercises[exerciseIdx] : null;

  const moduleTitle = mod?.title ?? slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const nextExercise = exerciseIdx < exercises.length - 1 ? exercises[exerciseIdx + 1] : null;
  const prevExercise = exerciseIdx > 0 ? exercises[exerciseIdx - 1] : null;

  const handleComplete = useCallback(
    async (result: { correct: boolean; score: number; xpEarned: number; userAnswer: any }) => {
      setCompleted(true);
      try {
        await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            moduleSlug: slug,
            exerciseId,
            correct: result.correct,
            score: result.score,
            xpEarned: result.xpEarned,
            userAnswer: result.userAnswer,
          }),
        });

        // Refresh user data so sidebar XP updates
        await refreshUser();

        // Check for new achievements
        const achRes = await fetch("/api/achievements", { method: "POST" });
        if (achRes.ok) {
          const { newAchievements } = await achRes.json();
          if (newAchievements && newAchievements.length > 0) {
            setAchievement(newAchievements[0]);
          }
        }
      } catch {
        // Silently fail - progress will be saved next time
      }
    },
    [slug, exerciseId, refreshUser]
  );

  if (checkingEnabled) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="animate-pulse">
          <div className="h-6 w-48 bg-editor-surface rounded mb-4" />
          <div className="h-40 bg-editor-surface rounded-xl" />
        </div>
      </div>
    );
  }

  if (moduleDisabled) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
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

  if (!mod || !exercise) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-2 text-sm text-editor-muted">
          <Link href="/modulos" className="hover:text-neon-blue transition-colors">Modulos</Link>
          <span>/</span>
          <Link href={`/modulos/${slug}`} className="hover:text-neon-blue transition-colors">{moduleTitle}</Link>
        </div>
        <div className="bg-editor-surface border border-editor-border rounded-xl p-12 text-center">
          <h1 className="text-xl font-bold text-editor-text mb-2">Ejercicio no encontrado</h1>
          <p className="text-editor-muted">Este ejercicio no existe o aun no esta disponible.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-editor-muted">
        <Link href="/modulos" className="hover:text-neon-blue transition-colors">
          Modulos
        </Link>
        <span>/</span>
        <Link
          href={`/modulos/${slug}`}
          className="hover:text-neon-blue transition-colors"
        >
          {moduleTitle}
        </Link>
        <span>/</span>
        <span className="text-editor-text">Ejercicio {exerciseIdx + 1} de {exercises.length}</span>
      </div>

      {/* Exercise header */}
      <div className="bg-editor-surface border border-editor-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-xs px-2 py-1 rounded-full bg-neon-orange/10 text-neon-orange font-medium">
              Ejercicio {exerciseIdx + 1}
            </span>
            {/* Difficulty */}
            <div className="flex gap-0.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <svg
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < exercise.difficulty ? "text-neon-yellow" : "text-editor-border"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
          </div>
          <span className="text-sm font-mono text-neon-yellow">+{exercise.xpReward} XP</span>
        </div>

        <h1 className="text-xl font-bold text-editor-text mb-2">
          {exercise.prompt}
        </h1>
      </div>

      {/* Exercise renderer */}
      <div className="bg-editor-surface border border-editor-border rounded-xl overflow-hidden p-6">
        <ExerciseRenderer exercise={exercise} onComplete={handleComplete} />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        {prevExercise ? (
          <Link
            href={`/modulos/${slug}/ejercicio/${prevExercise.id}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-editor-surface border border-editor-border rounded-lg text-sm font-medium text-editor-text hover:bg-editor-hover transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Anterior
          </Link>
        ) : (
          <Link
            href={`/modulos/${slug}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-editor-surface border border-editor-border rounded-lg text-sm font-medium text-editor-text hover:bg-editor-hover transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver al modulo
          </Link>
        )}

        {nextExercise ? (
          <Link
            href={`/modulos/${slug}/ejercicio/${nextExercise.id}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-neon-blue text-editor-bg rounded-lg text-sm font-medium hover:bg-neon-blue/90 transition-colors"
          >
            Siguiente ejercicio
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <Link
            href={`/modulos/${slug}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-neon-green text-editor-bg rounded-lg text-sm font-medium hover:bg-neon-green/90 transition-colors"
          >
            Finalizar modulo
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </Link>
        )}
      </div>

      {/* Achievement toast */}
      {achievement && (
        <AchievementToast
          achievement={achievement}
          onClose={() => setAchievement(null)}
        />
      )}
    </div>
  );
}
