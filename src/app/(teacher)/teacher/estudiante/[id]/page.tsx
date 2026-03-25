"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { ALL_MODULES } from "@/data/modules";
import { getRank } from "@/lib/xp";
import { ArrowLeft } from "lucide-react";

interface StudentData {
  _id: string;
  name: string;
  email: string;
  xp: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate?: string;
}

interface ProgressEntry {
  moduleId: string;
  exerciseId: string;
  completed: boolean;
  score: number;
  xpEarned: number;
  exerciseType: string;
  lastAttemptAt?: string;
}

export default function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [student, setStudent] = useState<StudentData | null>(null);
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [studentsRes, progressRes] = await Promise.all([
          fetch("/api/teacher/students"),
          fetch(`/api/progress/${id}`),
        ]);

        if (studentsRes.ok) {
          const studentsData = await studentsRes.json();
          const students = Array.isArray(studentsData) ? studentsData : studentsData.students ?? [];
          const found = students.find((s: any) => (s._id || s.id) === id);
          if (found) setStudent(found);
        }

        if (progressRes.ok) {
          const progressData = await progressRes.json();
          setProgress(Array.isArray(progressData) ? progressData : []);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-neon-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-4">
        <Link href="/teacher" className="inline-flex items-center gap-2 text-sm text-editor-muted hover:text-neon-blue transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Volver al panel
        </Link>
        <p className="text-editor-muted">Estudiante no encontrado.</p>
      </div>
    );
  }

  const rank = getRank(student.xp);
  const completedProgress = progress.filter((p) => p.completed);

  // Build module progress
  const moduleProgress = ALL_MODULES.map((mod) => {
    const modProgress = progress.filter((p) => p.moduleId === mod.slug);
    const completed = modProgress.filter((p) => p.completed).length;
    const total = mod.exercises.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { slug: mod.slug, title: mod.title, completed, total, percentage };
  }).filter((m) => m.completed > 0 || m.total > 0);

  // Recent exercises (last 10 completed/attempted)
  const recentExercises = [...progress]
    .sort((a, b) => {
      const dateA = a.lastAttemptAt ? new Date(a.lastAttemptAt).getTime() : 0;
      const dateB = b.lastAttemptAt ? new Date(b.lastAttemptAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 10);

  const lastActive = student.lastActiveDate
    ? new Date(student.lastActiveDate).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
    : "Nunca";

  return (
    <div className="p-4">
      {/* Header */}
      <Link href="/teacher" className="inline-flex items-center gap-2 text-sm text-editor-muted hover:text-neon-blue transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Volver al panel
      </Link>

      <div className="flex items-center gap-5 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-neon-purple/10 border-2 border-neon-purple/30 flex items-center justify-center text-2xl font-bold text-neon-purple">
          {student.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-editor-text">{student.name}</h1>
          <p className="text-editor-muted text-sm">{student.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "XP Total", value: student.xp.toLocaleString(), color: "text-neon-yellow" },
          { label: "Rango", value: rank.name, color: `text-[${rank.color}]` },
          { label: "Racha actual", value: `${student.currentStreak} dias`, color: "text-neon-orange" },
          { label: "Ultima actividad", value: lastActive, color: "text-neon-blue" },
        ].map((stat) => (
          <div key={stat.label} className="bg-editor-surface border border-editor-border rounded-xl p-5">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-editor-muted mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Module progress */}
      <div className="bg-editor-surface border border-editor-border rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-editor-text mb-4">
          Progreso por modulo
        </h2>
        {moduleProgress.length === 0 ? (
          <p className="text-editor-muted text-sm">Este estudiante aun no ha comenzado ningun modulo.</p>
        ) : (
          <div className="space-y-4">
            {moduleProgress.map((mod) => (
              <div key={mod.slug} className="flex items-center gap-4">
                <div className="w-48 shrink-0">
                  <p className="text-sm text-editor-text truncate">{mod.title}</p>
                </div>
                <div className="flex-1 h-2 bg-editor-bg rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      mod.percentage === 100 ? "bg-neon-green" : mod.percentage > 0 ? "bg-neon-blue" : "bg-transparent"
                    }`}
                    style={{ width: `${mod.percentage}%` }}
                  />
                </div>
                <span className="text-xs text-editor-muted font-mono w-12 text-right shrink-0">
                  {mod.completed}/{mod.total}
                </span>
                <span className="text-xs text-editor-muted w-10 text-right shrink-0">
                  {mod.percentage}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent exercises */}
      <div className="bg-editor-surface border border-editor-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-editor-border">
          <h2 className="text-lg font-semibold text-editor-text">
            Ejercicios recientes ({completedProgress.length} completados)
          </h2>
        </div>
        {recentExercises.length === 0 ? (
          <div className="px-6 py-8 text-center text-editor-muted text-sm">
            Este estudiante aun no ha intentado ningun ejercicio.
          </div>
        ) : (
          <div className="divide-y divide-editor-border">
            {recentExercises.map((ex, i) => {
              const mod = ALL_MODULES.find((m) => m.slug === ex.moduleId);
              const exercise = mod?.exercises.find((e) => e.id === ex.exerciseId);
              const date = ex.lastAttemptAt
                ? new Date(ex.lastAttemptAt).toLocaleDateString("es-ES", { day: "numeric", month: "short" })
                : "";
              return (
                <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-editor-hover transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${ex.completed ? "bg-neon-green" : "bg-neon-red"}`} />
                    <div>
                      <p className="text-sm text-editor-text">{exercise?.prompt?.slice(0, 60) || ex.exerciseId}...</p>
                      <p className="text-xs text-editor-muted">{mod?.title || ex.moduleId} &middot; {ex.exerciseType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      ex.completed ? "bg-neon-green/10 text-neon-green" : "bg-neon-red/10 text-neon-red"
                    }`}>
                      {ex.completed ? `${ex.score}%` : "Incompleto"}
                    </span>
                    <span className="text-xs font-mono text-neon-yellow w-16 text-right">
                      {ex.xpEarned > 0 ? `+${ex.xpEarned} XP` : "-"}
                    </span>
                    <span className="text-xs text-editor-muted w-20 text-right">{date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
