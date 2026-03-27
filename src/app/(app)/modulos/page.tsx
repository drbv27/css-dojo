"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ALL_MODULES } from "@/data/modules";
import { useProgress } from "@/hooks/useProgress";
import type { ModuleCategory } from "@/types";

const categories = [
  { key: "intro" as const, label: "Introduccion", color: "text-neon-green", badge: "bg-neon-green/10 text-neon-green" },
  { key: "intermediate" as const, label: "Intermedio", color: "text-neon-blue", badge: "bg-neon-blue/10 text-neon-blue" },
  { key: "advanced" as const, label: "Avanzado", color: "text-neon-purple", badge: "bg-neon-purple/10 text-neon-purple" },
  { key: "preprocessors" as const, label: "Preprocesadores", color: "text-neon-pink", badge: "bg-neon-pink/10 text-neon-pink" },
  { key: "frameworks" as const, label: "Frameworks CSS", color: "text-neon-orange", badge: "bg-neon-orange/10 text-neon-orange" },
];

export default function ModulosPage() {
  const { getModuleProgress } = useProgress();
  const [enabledSlugs, setEnabledSlugs] = useState<string[] | null>(null);

  useEffect(() => {
    fetch("/api/modules/enabled")
      .then((res) => res.json())
      .then((data) => setEnabledSlugs(data.enabledSlugs))
      .catch(() => setEnabledSlugs(ALL_MODULES.map((m) => m.slug)));
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-editor-text mb-2">
          Modulos de Aprendizaje
        </h1>
        <p className="text-editor-muted">
          Avanza a tu ritmo desde los fundamentos hasta tecnicas avanzadas de CSS
        </p>
      </div>

      {categories.map((cat) => {
        const catModules = ALL_MODULES.filter((m) => m.category === cat.key);
        if (catModules.length === 0) return null;
        return (
          <div key={cat.key}>
            <div className="flex items-center gap-3 mb-5">
              <h2 className={`text-lg font-semibold ${cat.color}`}>
                {cat.label}
              </h2>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${cat.badge}`}>
                {catModules.length} modulos
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {catModules.map((mod) => {
                const modProgress = getModuleProgress(mod.slug, mod.exercises.length);
                const isEnabled = enabledSlugs === null || enabledSlugs.includes(mod.slug);

                if (!isEnabled) {
                  return (
                    <div
                      key={mod.slug}
                      className="bg-editor-surface border border-editor-border rounded-xl p-6 opacity-50 cursor-not-allowed"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-10 h-10 rounded-lg bg-editor-muted/10 flex items-center justify-center text-lg`}>
                          <svg className="w-5 h-5 text-editor-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <span className="text-xs text-editor-muted font-mono">
                          #{mod.order.toString().padStart(2, "0")}
                        </span>
                      </div>

                      <h3 className="font-semibold text-editor-muted mb-1.5">
                        {mod.title}
                      </h3>

                      <p className="text-sm text-editor-muted mb-4 line-clamp-2">
                        {mod.description}
                      </p>

                      <div className="text-xs font-medium text-neon-orange">
                        Proximamente
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={mod.slug}
                    href={`/modulos/${mod.slug}`}
                    className="bg-editor-surface border border-editor-border rounded-xl p-6 hover:border-editor-muted/50 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-lg ${cat.badge} flex items-center justify-center text-lg`}>
                        <ModuleIcon name={mod.icon} />
                      </div>
                      <span className="text-xs text-editor-muted font-mono">
                        #{mod.order.toString().padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="font-semibold text-editor-text group-hover:text-neon-blue transition-colors mb-1.5">
                      {mod.title}
                    </h3>

                    <p className="text-sm text-editor-muted mb-4 line-clamp-2">
                      {mod.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-editor-muted mb-2">
                      <span>{mod.lessons.length} lecciones &middot; {mod.exercises.length} ejercicios</span>
                      <span>{modProgress.percentage}%</span>
                    </div>

                    <div className="w-full h-1.5 bg-editor-bg rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          modProgress.percentage === 100
                            ? "bg-neon-green"
                            : modProgress.percentage > 0
                            ? "bg-neon-blue"
                            : "bg-transparent"
                        }`}
                        style={{ width: `${modProgress.percentage}%` }}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ModuleIcon({ name }: { name: string }) {
  const iconClass = "w-5 h-5";
  switch (name) {
    case "palette":
      return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>;
    case "target":
      return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth={1.5} /><circle cx="12" cy="12" r="6" strokeWidth={1.5} /><circle cx="12" cy="12" r="2" strokeWidth={1.5} /></svg>;
    case "sliders":
      return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>;
    case "type":
      return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7V4h16v3M9 20h6M12 4v16" /></svg>;
    case "maximize":
      return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>;
    default:
      return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;
  }
}
