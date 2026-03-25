"use client";

import { useAuth } from "@/hooks/useAuth";
import { getRank } from "@/lib/xp";
import { redirect } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

interface TeacherStats {
  totalStudents: number;
  averageProgress: number;
  averageXP: number;
  mostActiveModule: string;
}

interface StudentEntry {
  id: string;
  name: string;
  email: string;
  xp: number;
  level: number;
  modulesCompleted: number;
  lastActive: string;
}

export default function TeacherDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<TeacherStats | null>(null);
  const [students, setStudents] = useState<StudentEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, studentsRes] = await Promise.all([
          fetch("/api/teacher/stats"),
          fetch("/api/teacher/students"),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        if (studentsRes.ok) {
          const studentsData = await studentsRes.json();
          setStudents(studentsData.students ?? studentsData ?? []);
        }
      } catch {
        // Silently fail
      } finally {
        setLoading(false);
      }
    }

    if (user?.role === "teacher") {
      fetchData();
    }
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-editor-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neon-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Role check
  if (!user || user.role !== "teacher") {
    redirect("/dashboard");
  }

  const statsCards = [
    { label: "Total Estudiantes", value: stats?.totalStudents?.toString() ?? "0", icon: "users", color: "text-neon-blue bg-neon-blue/10" },
    { label: "Progreso Promedio", value: stats?.averageProgress != null ? `${stats.averageProgress}%` : "0%", icon: "chart", color: "text-neon-green bg-neon-green/10" },
    { label: "XP Promedio", value: stats?.averageXP?.toLocaleString() ?? "0", icon: "zap", color: "text-neon-yellow bg-neon-yellow/10" },
    { label: "Modulo mas activo", value: stats?.mostActiveModule ?? "--", icon: "fire", color: "text-neon-orange bg-neon-orange/10" },
  ];

  return (
    <div className="p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm text-editor-muted hover:text-neon-blue transition-colors mb-4"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Volver al Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-editor-text mb-1">
              Panel del Profesor
            </h1>
            <p className="text-editor-muted text-sm">
              Supervisa el progreso de tus estudiantes
            </p>
          </div>
          <Link
            href="/teacher/modulos"
            className="px-4 py-2 text-sm font-medium bg-neon-purple/10 border border-neon-purple/20 rounded-lg text-neon-purple hover:bg-neon-purple/20 transition-colors"
          >
            Gestionar Modulos
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat) => (
            <div
              key={stat.label}
              className="bg-editor-surface border border-editor-border rounded-xl p-6"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-editor-text">
                    {stat.value}
                  </p>
                  <p className="text-sm text-editor-muted">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Students table */}
        <div className="bg-editor-surface border border-editor-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-editor-border flex items-center justify-between">
            <h2 className="text-lg font-semibold text-editor-text">
              Estudiantes
            </h2>
            <span className="text-sm text-editor-muted">
              {students.length} estudiante{students.length !== 1 ? "s" : ""}
            </span>
          </div>

          {students.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-editor-bg border border-editor-border flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-editor-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-editor-text mb-2">Aun no hay estudiantes registrados</h3>
              <p className="text-editor-muted text-sm">Los estudiantes apareceran aqui cuando se registren en la plataforma.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-editor-border bg-editor-sidebar/50">
                    <th className="text-left px-6 py-3 text-xs font-medium text-editor-muted uppercase tracking-wider">
                      Estudiante
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-editor-muted uppercase tracking-wider">
                      XP
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-editor-muted uppercase tracking-wider">
                      Rango
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-editor-muted uppercase tracking-wider">
                      Nivel
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-editor-muted uppercase tracking-wider">
                      Ultima actividad
                    </th>
                    <th className="text-center px-6 py-3 text-xs font-medium text-editor-muted uppercase tracking-wider">
                      Acceso
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-editor-muted uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-editor-border">
                  {students.map((student, index) => {
                    const studentRank = getRank(student.xp);
                    return (
                      <tr
                        key={student.id || student.email || index}
                        className="hover:bg-editor-hover transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-neon-purple/10 text-neon-purple flex items-center justify-center text-xs font-bold shrink-0">
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-editor-text">
                                {student.name}
                              </p>
                              <p className="text-xs text-editor-muted">
                                {student.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-mono text-neon-yellow">
                            {student.xp.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-editor-text">
                            {studentRank.name}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-editor-bg border border-editor-border text-xs font-medium text-editor-text">
                            Nv. {student.level}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-editor-muted">
                            {student.lastActive}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={async () => {
                              const sid = (student as any)._id || student.id;
                              const newApproved = !(student as any).approved;
                              try {
                                const res = await fetch("/api/teacher/approve", {
                                  method: "PUT",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ studentId: sid, approved: newApproved }),
                                });
                                if (res.ok) {
                                  setStudents((prev) =>
                                    prev.map((s) =>
                                      ((s as any)._id || s.id) === sid ? { ...s, approved: newApproved } as any : s
                                    )
                                  );
                                } else {
                                  const data = await res.json();
                                  alert("Error: " + (data.error || "No se pudo cambiar el acceso"));
                                }
                              } catch {
                                alert("Error de conexion al cambiar el acceso");
                              }
                            }}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              (student as any).approved ? "bg-neon-green" : "bg-editor-border"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                (student as any).approved ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/teacher/estudiante/${(student as any)._id || student.id}`}
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
