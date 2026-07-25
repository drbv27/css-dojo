"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Terminal, Sparkles, Check } from "lucide-react";
import LaunchSurvey from "@/components/cursos/LaunchSurvey";
import {
  PRODUCTS,
  COURSE_SLUGS,
  LAUNCH_PRICE_USD,
  REGULAR_PRICE_USD,
  BUNDLE_LAUNCH_USD,
  BUNDLE_REGULAR_USD,
  usdToCop,
  productName,
} from "@/lib/course-launch";

const COURSES = PRODUCTS.filter((p) => p.kind === "course");
const SANDBOX = PRODUCTS.find((p) => p.kind === "service")!;

export default function CursosPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-editor-muted hover:text-neon-pink transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al Dashboard
      </Link>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-xl border border-neon-pink/25 bg-editor-surface">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/[0.07] via-transparent to-neon-purple/[0.07] pointer-events-none" />
        <div className="relative p-6 sm:p-8">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-neon-pink/30 bg-neon-pink/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-neon-pink">
            <Sparkles className="w-3 h-3" /> Pre-lanzamiento · Cupos limitados
          </span>
          <div className="mt-4 flex items-center gap-2 font-mono text-sm text-editor-muted">
            <Terminal className="w-4 h-4 text-neon-pink" />
            <span>
              <span className="text-neon-pink">$</span> dojo --new-courses
            </span>
            <span className="inline-block w-2 h-4 bg-neon-pink/80 animate-pulse" aria-hidden />
          </div>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-editor-text">
            Nuevos cursos{" "}
            <span className="bg-gradient-to-r from-neon-pink to-neon-purple bg-clip-text text-transparent">
              en camino
            </span>
          </h1>
          <p className="mt-3 text-editor-muted leading-relaxed max-w-2xl">
            Estamos preparando tres cursos nuevos y un espacio para desplegar tus proyectos. Mira de qué van,
            aparta tu cupo con precio de lanzamiento y ayúdanos a decidir qué construir primero.
          </p>
        </div>
      </div>

      {/* Cards de cursos */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-editor-muted mb-4">
          Los cursos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {COURSES.map((c) => (
            <div
              key={c.slug}
              className="flex flex-col rounded-xl border border-editor-border bg-editor-surface p-5 transition-colors hover:border-neon-pink/40"
            >
              <h3 className="font-bold text-editor-text">{c.name}</h3>
              <p className="text-xs text-neon-pink font-medium mb-2">{c.subtitle}</p>
              <p className="text-sm text-editor-muted leading-relaxed flex-1">{c.short}</p>
              <Link
                href={`/cursos/${c.slug}`}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-neon-pink hover:gap-2.5 transition-all"
              >
                Ver más <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Pack */}
      <div className="relative overflow-hidden rounded-xl border border-neon-pink/40 bg-editor-surface">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-pink/[0.06] to-neon-purple/[0.06] pointer-events-none" />
        <div className="relative p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex-1">
            <span className="inline-block rounded-full bg-gradient-to-r from-neon-pink to-neon-purple px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              Mejor valor
            </span>
            <h3 className="mt-2 text-xl font-bold text-editor-text">Pack completo · 3 cursos</h3>
            <p className="text-sm text-editor-muted mt-1">
              {COURSE_SLUGS.map(productName).join(" + ")}. Llévate toda la ruta con un solo pago.
            </p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-editor-muted">
              {COURSE_SLUGS.map((slug) => (
                <span key={slug} className="inline-flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-neon-pink" /> {productName(slug)}
                </span>
              ))}
            </div>
          </div>
          <div className="shrink-0 text-left sm:text-right">
            <div className="flex items-baseline gap-2 sm:justify-end">
              <span className="font-mono text-editor-muted line-through tabular-nums">${BUNDLE_REGULAR_USD}</span>
              <span className="font-mono text-4xl font-bold text-neon-pink tabular-nums">${BUNDLE_LAUNCH_USD}</span>
              <span className="text-xs text-editor-muted">USD</span>
            </div>
            <p className="text-[11px] text-editor-muted font-mono">
              ≈ ${usdToCop(BUNDLE_LAUNCH_USD)} COP · vs ${LAUNCH_PRICE_USD * 3} sueltos
            </p>
            <a
              href="#reservar"
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-neon-pink to-neon-purple px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Aparta tu cupo <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Sandbox */}
      <div className="rounded-xl border border-neon-purple/30 bg-editor-surface p-6">
        <div className="flex items-start gap-2 flex-wrap">
          <h3 className="text-lg font-bold text-editor-text">{SANDBOX.name}</h3>
          <span className="rounded bg-neon-purple/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-neon-purple">
            Servicio
          </span>
        </div>
        <p className="text-xs text-neon-purple font-medium">{SANDBOX.subtitle}</p>
        <p className="text-sm text-editor-muted leading-relaxed mt-2 max-w-2xl">{SANDBOX.short}</p>
        <p className="text-xs text-editor-muted mt-3">
          Aún estamos definiendo cómo cobrarlo — en el sondeo de abajo nos dices qué precio te parecería justo.
        </p>
      </div>

      {/* Precio de referencia curso suelto */}
      <p className="text-xs text-editor-muted text-center">
        Cada curso por separado: <span className="font-mono line-through">${REGULAR_PRICE_USD}</span>{" "}
        <span className="font-mono text-editor-text font-semibold">${LAUNCH_PRICE_USD}</span> de lanzamiento ·
        ≈ ${usdToCop(LAUNCH_PRICE_USD)} COP
      </p>

      {/* Sondeo */}
      <LaunchSurvey />
    </div>
  );
}
