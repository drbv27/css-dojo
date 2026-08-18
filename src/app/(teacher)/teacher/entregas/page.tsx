"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Eye, X, Inbox } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface Project {
  slug: string;
  title: string;
}
interface Row {
  id: string;
  name: string;
  email: string;
  cohort: number;
  filename: string;
  size: number;
  updatedAt: string;
}
interface Detail {
  name: string;
  email: string;
  filename: string;
  content: string;
  updatedAt: string;
}

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("es-CO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export default function TeacherEntregasPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [project, setProject] = useState<string>("");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const load = useCallback((slug: string) => {
    setLoading(true);
    const qs = slug ? `?projectSlug=${slug}` : "";
    fetch(`/api/teacher/submissions${qs}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.projects) setProjects(d.projects);
        if (d.projects && !slug && d.projects[0]) {
          setProject(d.projects[0].slug);
          return; // el efecto recargara con el proyecto elegido
        }
        setRows(d.submissions ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load("");
  }, [load]);
  useEffect(() => {
    if (project) load(project);
  }, [project, load]);

  async function openDetail(id: string) {
    setLoadingDetail(true);
    try {
      const d = await fetch(`/api/teacher/submissions/${id}`).then((r) => r.json());
      if (d && d.content) setDetail(d);
    } finally {
      setLoadingDetail(false);
    }
  }

  function download(d: Detail) {
    const blob = new Blob([d.content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = d.filename || "entrega.html";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <Link href="/teacher" className="inline-flex items-center gap-2 text-sm text-editor-muted hover:text-neon-green transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Volver al Panel
          </Link>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-editor-text">
            <Inbox className="w-6 h-6 text-neon-green" /> Entregas de proyectos
          </h1>
          <p className="text-editor-muted text-sm mt-1">Revisa los archivos que subieron los alumnos.</p>
        </div>

        {/* Selector de proyecto */}
        {projects.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-editor-muted">Proyecto:</span>
            {projects.map((p) => (
              <button
                key={p.slug}
                onClick={() => setProject(p.slug)}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                  project === p.slug
                    ? "border-neon-green bg-neon-green/10 text-neon-green"
                    : "border-editor-border text-editor-muted hover:text-editor-text"
                }`}
              >
                {p.title}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="rounded-xl border border-editor-border bg-editor-surface overflow-hidden">
            <div className="px-5 py-3 border-b border-editor-border">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-editor-muted">
                Entregas ({rows.length})
              </h2>
            </div>
            {rows.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-editor-muted">
                Aún no hay entregas para este proyecto.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-editor-muted border-b border-editor-border">
                      <th className="px-5 py-3 font-medium">Alumno</th>
                      <th className="px-5 py-3 font-medium">Correo</th>
                      <th className="px-5 py-3 font-medium">Cohorte</th>
                      <th className="px-5 py-3 font-medium">Archivo</th>
                      <th className="px-5 py-3 font-medium">Entregado</th>
                      <th className="px-5 py-3 font-medium">Revisar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.id} className="border-b border-editor-border/50 last:border-0">
                        <td className="px-5 py-3 text-editor-text font-medium whitespace-nowrap">{r.name}</td>
                        <td className="px-5 py-3 text-editor-muted whitespace-nowrap">{r.email}</td>
                        <td className="px-5 py-3 text-editor-muted">{r.cohort}</td>
                        <td className="px-5 py-3 text-editor-muted whitespace-nowrap">{r.filename}</td>
                        <td className="px-5 py-3 text-editor-muted whitespace-nowrap">{fmtDate(r.updatedAt)}</td>
                        <td className="px-5 py-3">
                          <button
                            onClick={() => openDetail(r.id)}
                            className="inline-flex items-center gap-1.5 rounded-md border border-editor-border px-2.5 py-1 text-xs font-medium text-editor-muted hover:text-neon-green hover:border-neon-green/40 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" /> Ver
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de previsualizacion */}
      {(detail || loadingDetail) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setDetail(null)}>
          <div
            className="relative w-full max-w-4xl h-[85vh] flex flex-col rounded-xl border border-editor-border bg-editor-surface shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-editor-border">
              <div className="min-w-0">
                <p className="font-semibold text-editor-text truncate">{detail?.name}</p>
                <p className="text-xs text-editor-muted truncate">{detail?.email} · {detail?.filename}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {detail && (
                  <button
                    onClick={() => download(detail)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-neon-green px-3 py-1.5 text-sm font-semibold text-editor-bg hover:opacity-90"
                  >
                    <Download className="w-4 h-4" /> Descargar
                  </button>
                )}
                <button onClick={() => setDetail(null)} className="rounded-lg p-1.5 text-editor-muted hover:text-editor-text hover:bg-editor-hover">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-white">
              {loadingDetail ? (
                <div className="h-full flex items-center justify-center text-editor-muted">Cargando…</div>
              ) : (
                <iframe
                  title="Previsualizacion de la entrega"
                  srcDoc={detail?.content ?? ""}
                  sandbox=""
                  className="w-full h-full border-0"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
