"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Terminal, ArrowRight, Check } from "lucide-react";
import { BACKEND_PYTHON, PYTHON_WAITLIST_SLUG } from "@/lib/course-launch";

export default function FreeCourseBanner() {
  const [joined, setJoined] = useState<boolean | null>(null);

  useEffect(() => {
    fetch(`/api/waitlist?slug=${PYTHON_WAITLIST_SLUG}`)
      .then((r) => r.json())
      .then((d) => setJoined(Boolean(d.joined)))
      .catch(() => setJoined(false));
  }, []);

  if (joined === null) return null;

  return (
    <Link
      href="/backend-python"
      className="group relative block overflow-hidden rounded-xl bg-gradient-to-r from-neon-green to-neon-blue shadow-lg shadow-neon-green/20 ring-1 ring-white/10 transition-transform hover:scale-[1.01]"
    >
      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(255,255,255,0.5) 3px, rgba(255,255,255,0.5) 4px)",
        }}
        aria-hidden
      />
      <div className="relative flex items-center gap-4 p-5 sm:p-6">
        <div className="hidden sm:flex shrink-0 h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-white/25">
          <Terminal className="h-6 w-6" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-white/85">
            <span className="rounded bg-white/25 px-1.5 py-0.5">Gratis</span>
            Próximamente
            <span className="inline-block w-1.5 h-3 bg-white/90 animate-pulse" aria-hidden />
          </div>
          <p className="mt-1 text-lg sm:text-xl font-bold text-white">
            {BACKEND_PYTHON.title}
          </p>
          <p className="text-sm text-white/85 truncate">
            {BACKEND_PYTHON.subtitle} — apúntate gratis y te avisamos cuando salga.
          </p>
        </div>

        <div className="shrink-0">
          {joined ? (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-4 py-2.5 text-sm font-bold text-neon-green">
              <Check className="h-4 w-4" /> En la lista
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-neon-green shadow-sm">
              Apúntate gratis
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
