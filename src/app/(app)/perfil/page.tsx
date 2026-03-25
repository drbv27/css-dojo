"use client";

import { useAuth } from "@/hooks/useAuth";
import { getRank, getXPProgress, getNextRank } from "@/lib/xp";

export default function PerfilPage() {
  const { user } = useAuth();

  const xp = user?.xp ?? 0;
  const rank = getRank(xp);
  const nextRank = getNextRank(xp);
  const xpProgress = getXPProgress(xp);
  const streak = user?.currentStreak ?? 0;
  const longestStreak = user?.longestStreak ?? 0;
  const badges = user?.badges ?? [];

  const profileStats = [
    { label: "XP Total", value: xp.toLocaleString() },
    { label: "Rango", value: rank.name },
    { label: "Racha actual", value: `${streak} dia${streak !== 1 ? "s" : ""}` },
    { label: "Racha maxima", value: `${longestStreak} dia${longestStreak !== 1 ? "s" : ""}` },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Profile header */}
      <div className="bg-editor-surface border border-editor-border rounded-xl p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-neon-purple/10 border-2 border-neon-purple/30 flex items-center justify-center text-3xl font-bold text-neon-purple">
              {user?.name?.charAt(0) ?? "U"}
            </div>
            {/* Level badge */}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-neon-blue flex items-center justify-center text-xs font-bold text-editor-bg">
              {user?.level ?? 1}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-editor-text mb-1">
              {user?.name ?? "Estudiante"}
            </h1>
            <p className="text-editor-muted text-sm mb-4">
              {user?.email ?? "correo@ejemplo.com"}
            </p>

            {/* Rank badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neon-yellow/10 border border-neon-yellow/20">
              <svg className="w-4 h-4 text-neon-yellow" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-sm font-medium text-neon-yellow">
                {rank.name}
              </span>
            </div>
          </div>
        </div>

        {/* XP Progress */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-editor-muted">{rank.name}</span>
            <span className="text-sm font-mono text-editor-muted">
              {nextRank
                ? `${xpProgress.current} / ${xpProgress.needed} XP`
                : `${xp.toLocaleString()} XP (Max)`}
            </span>
          </div>
          <div className="w-full h-3 bg-editor-bg rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-neon-blue to-neon-purple rounded-full transition-all"
              style={{ width: `${xpProgress.percentage}%` }}
            />
          </div>
          <p className="text-xs text-editor-muted mt-1.5">
            {nextRank
              ? `${xpProgress.needed - xpProgress.current} XP para ${nextRank.name}`
              : "Has alcanzado el rango maximo!"}
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {profileStats.map((stat) => (
          <div
            key={stat.label}
            className="bg-editor-surface border border-editor-border rounded-xl p-4 text-center"
          >
            <p className="text-lg font-bold text-editor-text mb-1">
              {stat.value}
            </p>
            <p className="text-xs text-editor-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div>
        <h2 className="text-lg font-semibold text-editor-text mb-4">
          Insignias y logros
        </h2>
        {badges.length === 0 ? (
          <div className="bg-editor-surface border border-editor-border rounded-xl p-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-editor-bg border border-editor-border flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-editor-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>
            <p className="text-editor-muted text-sm">
              Aun no tienes logros. Completa ejercicios para desbloquearlos!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {badges.map((badge) => (
              <div
                key={badge}
                className="flex flex-col items-center p-4 rounded-xl border bg-editor-surface border-editor-border"
              >
                <div
                  className="w-12 h-12 rounded-xl bg-neon-yellow/10 text-neon-yellow flex items-center justify-center mb-3"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
                <span className="text-xs text-center font-medium text-editor-text">
                  {badge}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
