"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getRank, getXPProgress, getNextRank } from "@/lib/xp";
import { SEED_ACHIEVEMENTS } from "@/lib/achievements-list";
import { Eye, EyeOff, Lock, Check } from "lucide-react";

export default function PerfilPage() {
  const { user } = useAuth();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const xp = user?.xp ?? 0;
  const rank = getRank(xp);
  const nextRank = getNextRank(xp);
  const xpProgress = getXPProgress(xp);
  const streak = user?.currentStreak ?? 0;
  const longestStreak = user?.longestStreak ?? 0;
  const badges = user?.badges ?? [];

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      setPasswordError("Las contrasenas no coinciden");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("La nueva contrasena debe tener al menos 6 caracteres");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPasswordError(data.error || "Error al cambiar la contrasena");
      } else {
        setPasswordSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          setShowPasswordForm(false);
          setPasswordSuccess(false);
        }, 2000);
      }
    } catch {
      setPasswordError("Error de conexion");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Profile header */}
      <div className="bg-editor-surface border border-editor-border rounded-xl p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold" style={{ background: rank.color + "15", color: rank.color, border: `2px solid ${rank.color}40` }}>
            {user?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) ?? "U"}
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-editor-text mb-1">
              {user?.name ?? "Estudiante"}
            </h1>
            <p className="text-editor-muted text-sm mb-4">
              {user?.email ?? ""}
            </p>

            {/* Rank badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: rank.color + "15", border: `1px solid ${rank.color}30` }}>
              <span className="text-sm font-medium" style={{ color: rank.color }}>
                {rank.name}
              </span>
            </div>
          </div>
        </div>

        {/* XP Progress */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-editor-muted">{xp.toLocaleString()} XP</span>
            <span className="text-sm font-mono text-editor-muted">
              {nextRank
                ? `Faltan ${nextRank.minXP - xp} para ${nextRank.name}`
                : "Rango maximo alcanzado"}
            </span>
          </div>
          <div className="w-full h-3 bg-editor-bg rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${xpProgress.percentage}%`, background: `linear-gradient(90deg, ${rank.color}CC, ${rank.color})` }}
            />
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-editor-surface border border-editor-border rounded-xl p-4 text-center">
          <p className="text-lg font-bold text-neon-yellow">{xp.toLocaleString()}</p>
          <p className="text-xs text-editor-muted">XP Total</p>
        </div>
        <div className="bg-editor-surface border border-editor-border rounded-xl p-4 text-center">
          <p className="text-lg font-bold" style={{ color: rank.color }}>{rank.name.split(" ")[1] ?? rank.name}</p>
          <p className="text-xs text-editor-muted">Rango</p>
        </div>
        <div className="bg-editor-surface border border-editor-border rounded-xl p-4 text-center">
          <p className="text-lg font-bold text-neon-orange">{streak}</p>
          <p className="text-xs text-editor-muted">Racha actual</p>
        </div>
        <div className="bg-editor-surface border border-editor-border rounded-xl p-4 text-center">
          <p className="text-lg font-bold text-editor-text">{longestStreak}</p>
          <p className="text-xs text-editor-muted">Racha maxima</p>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h2 className="text-lg font-semibold text-editor-text mb-4">
          Insignias ({badges.length}/{SEED_ACHIEVEMENTS.length})
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          {SEED_ACHIEVEMENTS.map((achievement) => {
            const earned = badges.includes(achievement.slug);
            return (
              <div
                key={achievement.slug}
                className={`flex flex-col items-center p-4 rounded-xl border text-center transition-all ${
                  earned
                    ? "bg-neon-yellow/5 border-neon-yellow/20 hover:border-neon-yellow/40"
                    : "bg-editor-surface border-editor-border opacity-40 grayscale"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 text-2xl ${
                  earned ? "bg-editor-bg" : "bg-editor-bg"
                }`}>
                  {earned ? (
                    <span>{achievement.icon}</span>
                  ) : (
                    <Lock className="w-5 h-5 text-editor-muted" />
                  )}
                </div>
                <span className={`text-xs font-semibold mb-1 ${earned ? "text-editor-text" : "text-editor-muted"}`}>
                  {achievement.title}
                </span>
                <span className="text-[10px] text-editor-muted leading-tight">
                  {achievement.description}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Change password */}
      <div className="bg-editor-surface border border-editor-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-editor-text">Seguridad</h2>
          {!showPasswordForm && (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="text-sm text-neon-blue hover:text-neon-blue/80 transition-colors font-medium"
            >
              Cambiar contrasena
            </button>
          )}
        </div>

        {showPasswordForm && (
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-sm">
            {passwordError && (
              <div className="bg-neon-red/10 border border-neon-red/20 text-neon-red rounded-lg px-4 py-3 text-sm">
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="bg-neon-green/10 border border-neon-green/20 text-neon-green rounded-lg px-4 py-3 text-sm">
                Contrasena actualizada correctamente
              </div>
            )}

            <div>
              <label className="block text-sm text-editor-muted mb-1">Contrasena actual</label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-editor-bg border border-editor-border rounded-lg text-editor-text text-sm focus:outline-none focus:border-neon-blue transition-colors pr-10"
                  required
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-editor-muted">
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-editor-muted mb-1">Nueva contrasena</label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-editor-bg border border-editor-border rounded-lg text-editor-text text-sm focus:outline-none focus:border-neon-blue transition-colors pr-10"
                  required
                  minLength={6}
                  placeholder="Minimo 6 caracteres"
                />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-editor-muted">
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-editor-muted mb-1">Confirmar nueva contrasena</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-editor-bg border border-editor-border rounded-lg text-editor-text text-sm focus:outline-none focus:border-neon-blue transition-colors"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-neon-blue text-editor-bg text-sm font-medium rounded-lg hover:bg-neon-blue/90 transition-colors disabled:opacity-50"
              >
                {saving ? "Guardando..." : "Guardar"}
              </button>
              <button
                type="button"
                onClick={() => { setShowPasswordForm(false); setPasswordError(""); setPasswordSuccess(false); }}
                className="px-5 py-2.5 bg-editor-bg border border-editor-border text-editor-muted text-sm font-medium rounded-lg hover:text-editor-text transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {!showPasswordForm && !passwordSuccess && (
          <p className="text-sm text-editor-muted">Tu contrasena fue configurada al registrarte.</p>
        )}
      </div>
    </div>
  );
}
