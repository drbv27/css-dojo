"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Terminal } from "lucide-react";
import FreeCourseSignup from "@/components/cursos/FreeCourseSignup";
import { BACKEND_PYTHON } from "@/lib/course-launch";

const c = BACKEND_PYTHON;

export default function BackendPythonPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-editor-muted hover:text-neon-green transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al Dashboard
      </Link>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-xl border border-neon-green/30 bg-editor-surface">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-green/[0.08] via-transparent to-neon-blue/[0.06] pointer-events-none" />
        <div className="relative p-6 sm:p-8">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-neon-green/30 bg-neon-green/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-neon-green">
            Gratis · Próximamente
          </span>
          <div className="mt-4 flex items-center gap-2 font-mono text-sm text-editor-muted">
            <Terminal className="w-4 h-4 text-neon-green" />
            <span>
              <span className="text-neon-green">$</span> python -m backend
            </span>
            <span className="inline-block w-2 h-4 bg-neon-green/80 animate-pulse" aria-hidden />
          </div>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-editor-text">
            {c.title}{" "}
            <span className="bg-gradient-to-r from-neon-green to-neon-blue bg-clip-text text-transparent">
              {c.subtitle}
            </span>
          </h1>
          <p className="mt-3 text-editor-muted leading-relaxed max-w-2xl">{c.tagline}</p>
          <a
            href="#apuntarme"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-neon-green px-5 py-2.5 text-sm font-semibold text-editor-bg hover:opacity-90 transition-opacity"
          >
            Apúntate gratis <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Descripcion */}
      <div className="rounded-xl border border-editor-border bg-editor-surface p-6 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-editor-muted">
          Descripción del curso
        </h2>
        {c.description.map((p) => (
          <p key={p} className="text-sm text-editor-text/90 leading-relaxed">
            {p}
          </p>
        ))}
        <div className="rounded-lg border-l-2 border-neon-green bg-neon-green/[0.06] p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-neon-green mb-1">
            ¿Qué lo hace diferente?
          </p>
          <p className="text-sm text-editor-text/90 leading-relaxed">{c.differentiator}</p>
        </div>
      </div>

      {/* Pilares */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-editor-muted mb-4">
          Cómo está estructurado
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {c.pillars.map((pil, i) => (
            <div
              key={pil.title}
              className="rounded-xl border border-editor-border bg-editor-surface p-5 transition-colors hover:border-neon-green/40"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs text-neon-green">0{i + 1}</span>
                <h3 className="font-semibold text-editor-text">{pil.title}</h3>
              </div>
              <p className="text-sm text-editor-muted leading-relaxed">{pil.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Temario */}
      <div className="rounded-xl border border-editor-border bg-editor-surface p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-editor-muted mb-4">
          Lo que vas a desarrollar
        </h2>
        <ul className="space-y-3">
          {c.syllabus.map((s) => (
            <li key={s} className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0 rounded-md bg-neon-green/10 p-1 text-neon-green">
                <Check className="w-4 h-4" />
              </span>
              <span className="text-sm text-editor-text leading-relaxed">{s}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Resultados */}
      <div className="rounded-xl border border-neon-green/25 bg-editor-surface p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-editor-muted mb-4">
          Al finalizar el curso
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {c.outcomes.map((o) => (
            <li key={o} className="flex items-start gap-2.5">
              <span className="mt-1 shrink-0 h-1.5 w-1.5 rounded-full bg-neon-green" />
              <span className="text-sm text-editor-text/90 leading-relaxed">{o}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex items-start gap-2 text-sm text-editor-text leading-relaxed border-t border-editor-border pt-4">
          <span aria-hidden>🐍</span>
          <span>{c.closing}</span>
        </p>
      </div>

      {/* Inscripcion gratuita */}
      <FreeCourseSignup />
    </div>
  );
}
