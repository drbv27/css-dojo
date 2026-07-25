"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Terminal, Sparkles } from "lucide-react";
import {
  courseContent,
  LAUNCH_PRICE_USD,
  REGULAR_PRICE_USD,
  BUNDLE_LAUNCH_USD,
  usdToCop,
} from "@/lib/course-launch";

export default function CourseDetailPage() {
  const params = useParams<{ slug: string }>();
  const course = courseContent(params.slug);

  if (!course) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <p className="text-editor-muted">Este curso no existe.</p>
        <Link href="/cursos" className="mt-3 inline-block text-sm text-neon-pink hover:underline">
          Ver todos los cursos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <Link
        href="/cursos"
        className="inline-flex items-center gap-2 text-sm text-editor-muted hover:text-neon-pink transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a los cursos
      </Link>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-xl border border-neon-pink/25 bg-editor-surface">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/[0.07] via-transparent to-neon-purple/[0.07] pointer-events-none" />
        <div className="relative p-6 sm:p-8">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-neon-pink/30 bg-neon-pink/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-neon-pink">
            <Sparkles className="w-3 h-3" /> Próximamente · Cupos limitados
          </span>
          <div className="mt-4 flex items-center gap-2 font-mono text-sm text-editor-muted">
            <Terminal className="w-4 h-4 text-neon-pink" />
            <span>
              <span className="text-neon-pink">$</span> curso {course.slug}
            </span>
            <span className="inline-block w-2 h-4 bg-neon-pink/80 animate-pulse" aria-hidden />
          </div>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-editor-text">
            {course.title}{" "}
            <span className="bg-gradient-to-r from-neon-pink to-neon-purple bg-clip-text text-transparent">
              {course.subtitle}
            </span>
          </h1>
          <p className="mt-3 text-editor-muted leading-relaxed max-w-2xl">{course.tagline}</p>
        </div>
      </div>

      {/* Descripcion */}
      <div className="rounded-xl border border-editor-border bg-editor-surface p-6 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-editor-muted">
          Descripción del curso
        </h2>
        {course.description.map((p) => (
          <p key={p} className="text-sm text-editor-text/90 leading-relaxed">
            {p}
          </p>
        ))}
        <div className="rounded-lg border-l-2 border-neon-pink bg-neon-pink/[0.06] p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-neon-pink mb-1">
            ¿Qué lo hace diferente?
          </p>
          <p className="text-sm text-editor-text/90 leading-relaxed">{course.differentiator}</p>
        </div>
      </div>

      {/* Pilares */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-editor-muted mb-4">
          Cómo está estructurado
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {course.pillars.map((pil, i) => (
            <div
              key={pil.title}
              className="rounded-xl border border-editor-border bg-editor-surface p-5 transition-colors hover:border-neon-pink/40"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs text-neon-pink">0{i + 1}</span>
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
          {course.syllabus.map((s) => (
            <li key={s} className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0 rounded-md bg-neon-pink/10 p-1 text-neon-pink">
                <Check className="w-4 h-4" />
              </span>
              <span className="text-sm text-editor-text leading-relaxed">{s}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Resultados */}
      <div className="rounded-xl border border-neon-purple/25 bg-editor-surface p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-editor-muted mb-4">
          Al finalizar el curso
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {course.outcomes.map((o) => (
            <li key={o} className="flex items-start gap-2.5">
              <span className="mt-1 shrink-0 h-1.5 w-1.5 rounded-full bg-neon-purple" />
              <span className="text-sm text-editor-text/90 leading-relaxed">{o}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex items-start gap-2 text-sm text-editor-text leading-relaxed border-t border-editor-border pt-4">
          <span aria-hidden>🚀</span>
          <span>{course.closing}</span>
        </p>
      </div>

      {/* Precio + CTA */}
      <div className="rounded-xl border border-neon-pink/25 bg-editor-surface p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-editor-muted mb-1">
            Precio de lanzamiento
          </p>
          <div className="flex items-baseline gap-2.5">
            <span className="font-mono text-editor-muted line-through tabular-nums">${REGULAR_PRICE_USD}</span>
            <span className="font-mono text-4xl font-bold text-neon-pink tabular-nums">${LAUNCH_PRICE_USD}</span>
            <span className="text-xs text-editor-muted">USD</span>
          </div>
          <p className="text-[11px] text-editor-muted mt-1 font-mono">
            ≈ ${usdToCop(LAUNCH_PRICE_USD)} COP · o llévate los 3 en el pack por ${BUNDLE_LAUNCH_USD}
          </p>
        </div>
        <Link
          href="/cursos#reservar"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-neon-pink to-neon-purple px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
        >
          Aparta tu cupo <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
