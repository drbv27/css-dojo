"use client";

import { useAuth } from "@/hooks/useAuth";
import { getRank } from "@/lib/xp";
import { redirect } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

interface TeacherStats {
  totalStudents: number;
  approvedStudents: number;
  avgXP: number;
  avgProgress: number;
  activeToday: number;
  mostActiveModule: string;
  totalExercisesCompleted: number;
  totalExercisesInScope: number;
}

interface StudentEntry {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  xp: number;
  currentStreak?: number;
  lastActiveDate?: string;
  exercisesCompleted?: number;
  approved?: boolean;
}

const dojoTabs = [
  { key: null, label: "General", color: "text-editor-text", bg: "bg-editor-text/10" },
  { key: "html", label: "HTML", color: "text-neon-orange", bg: "bg-neon-orange/10" },
  { key: "css", label: "CSS", color: "text-css-purple", bg: "bg-css-purple/10" },
  { key: "js", label: "JS", color: "text-neon-yellow", bg: "bg-neon-yellow/10" },
  { key: "react", label: "React", color: "text-neon-teal", bg: "bg-neon-teal/10" },
] as const;

export default function TeacherDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<TeacherStats | null>(null);
  const [students, setStudents] = useState<StudentEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDojo, setActiveDojo] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const dojoParam = activeDojo ? `?dojo=${activeDojo}` : "";
        const [statsRes, studentsRes] = await Promise.all([
          fetch(`/api/teacher/stats${dojoParam}`),
          fetch("/api/teacher/students"),
        ]);

        if (statsRes.ok) setStats(await statsRes.json());
        if (studentsRes.ok) {
          const data = await studentsRes.json();
          setStudents(Array.isArray(data) ? data : data.students ?? []);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }

    if (user?.role === "teacher") fetchData();
  }, [user, activeDojo]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-neon-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== "teacher") redirect("/dashboard");

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Nunca";
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Hoy";
    if (diffDays === 1) return "Ayer";
    if (diffDays < 7) return `Hace ${diffDays} dias`;
    return d.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm text-editor-muted hover:text-neon-blue transition-colors mb-4"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver al Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-editor-text mb-1">Panel del Profesor</h1>
            <p className="text-editor-muted text-sm">Supervisa el progreso de tus estudiantes</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/teacher/juegos"
              className="px-4 py-2 text-sm font-medium bg-neon-teal/10 border border-neon-teal/20 rounded-lg text-neon-teal hover:bg-neon-teal/20 transition-colors"
            >
              Gestionar Juegos
            </Link>
            <Link
              href="/teacher/modulos"
              className="px-4 py-2 text-sm font-medium bg-neon-purple/10 border border-neon-purple/20 rounded-lg text-neon-purple hover:bg-neon-purple/20 transition-colors"
            >
              Gestionar Modulos
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Dojo tabs */}
        <div className="flex gap-2 flex-wrap">
          {dojoTabs.map((tab) => (
            <button
              key={tab.key ?? "general"}
              onClick={() => { setActiveDojo(tab.key); setLoading(true); }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeDojo === tab.key
                  ? `${tab.bg} ${tab.color}`
                  : "text-editor-muted hover:text-editor-text hover:bg-editor-hover"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-editor-surface border border-editor-border rounded-xl p-5">
            <p className="text-xs text-editor-muted uppercase tracking-wider mb-1">Estudiantes</p>
            <p className="text-2xl font-bold text-editor-text">
              {stats?.approvedStudents ?? 0}<span className="text-sm text-editor-muted font-normal">/{stats?.totalStudents ?? 0}</span>
            </p>
            <p className="text-[11px] text-editor-muted mt-1">aprobados</p>
          </div>

          <div className="bg-editor-surface border border-editor-border rounded-xl p-5">
            <p className="text-xs text-editor-muted uppercase tracking-wider mb-1">Progreso Promedio</p>
            <p className="text-2xl font-bold text-neon-green">{stats?.avgProgress ?? 0}%</p>
            <div className="mt-2 w-full h-1.5 bg-editor-bg rounded-full overflow-hidden">
              <div className="h-full bg-neon-green rounded-full transition-all" style={{ width: `${stats?.avgProgress ?? 0}%` }} />
            </div>
          </div>

          <div className="bg-editor-surface border border-editor-border rounded-xl p-5">
            <p className="text-xs text-editor-muted uppercase tracking-wider mb-1">XP Promedio</p>
            <p className="text-2xl font-bold text-neon-yellow">{(stats?.avgXP ?? 0).toLocaleString()}</p>
            <p className="text-[11px] text-editor-muted mt-1">por estudiante</p>
          </div>

          <div className="bg-editor-surface border border-editor-border rounded-xl p-5">
            <p className="text-xs text-editor-muted uppercase tracking-wider mb-1">Ejercicios Resueltos</p>
            <p className="text-2xl font-bold text-neon-blue">
              {stats?.totalExercisesCompleted ?? 0}
            </p>
            <p className="text-[11px] text-editor-muted mt-1">
              de {stats?.totalExercisesInScope ?? 0} disponibles
            </p>
          </div>

          <div className="bg-editor-surface border border-editor-border rounded-xl p-5">
            <p className="text-xs text-editor-muted uppercase tracking-wider mb-1">Modulo Mas Activo</p>
            <p className="text-sm font-bold text-neon-orange leading-tight mt-1">{stats?.mostActiveModule ?? "—"}</p>
            <p className="text-[11px] text-editor-muted mt-1">
              {stats?.activeToday ?? 0} activos hoy
            </p>
          </div>
        </div>

        {/* Students table */}
        <div className="bg-editor-surface border border-editor-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-editor-border flex items-center justify-between">
            <h2 className="text-lg font-semibold text-editor-text">Estudiantes</h2>
            <span className="text-sm text-editor-muted">{students.length} registrados</span>
          </div>

          {students.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-editor-muted">Aun no hay estudiantes registrados.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-editor-border bg-editor-sidebar/50">
                    <th className="text-left px-6 py-3 text-xs font-medium text-editor-muted uppercase tracking-wider">Estudiante</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-editor-muted uppercase tracking-wider">XP</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-editor-muted uppercase tracking-wider">Rango</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-editor-muted uppercase tracking-wider">Ejercicios</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-editor-muted uppercase tracking-wider">Racha</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-editor-muted uppercase tracking-wider">Ultima actividad</th>
                    <th className="text-center px-6 py-3 text-xs font-medium text-editor-muted uppercase tracking-wider">Acceso</th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-editor-muted uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-editor-border">
                  {students.map((student, index) => {
                    const studentRank = getRank(student.xp);
                    const sid = (student as any)._id || student.id;
                    return (
                      <tr key={sid || student.email || index} className="hover:bg-editor-hover transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: studentRank.color + "20", color: studentRank.color }}>
                              {student.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-editor-text">{student.name}</p>
                              <p className="text-xs text-editor-muted">{student.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-mono text-neon-yellow">{student.xp.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs px-2 py-1 rounded-md font-medium" style={{ background: studentRank.color + "15", color: studentRank.color }}>
                            {studentRank.name}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-editor-text">{(student as any).exercisesCompleted ?? 0}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-sm font-mono ${(student.currentStreak ?? 0) > 0 ? "text-neon-orange" : "text-editor-muted"}`}>
                            {student.currentStreak ?? 0}d
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-editor-muted">{formatDate(student.lastActiveDate)}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={async () => {
                              const newApproved = !student.approved;
                              try {
                                const res = await fetch("/api/teacher/approve", {
                                  method: "PUT",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ studentId: sid, approved: newApproved }),
                                });
                                if (res.ok) {
                                  setStudents((prev) =>
                                    prev.map((s) =>
                                      ((s as any)._id || s.id) === sid ? { ...s, approved: newApproved } : s
                                    )
                                  );
                                }
                              } catch {}
                            }}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              student.approved ? "bg-neon-green" : "bg-editor-border"
                            }`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              student.approved ? "translate-x-6" : "translate-x-1"
                            }`} />
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/teacher/estudiante/${sid}`}
                            className="text-sm text-neon-blue hover:text-neon-blue/80 transition-colors font-medium"
                          >
                            Ver detalle
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
