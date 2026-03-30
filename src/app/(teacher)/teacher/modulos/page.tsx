"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FaHtml5, FaReact } from "react-icons/fa";
import { SiCss, SiJavascript, SiNextdotjs } from "react-icons/si";
import { ALL_MODULES } from "@/data/modules";
import type { DojoType, ModuleCategory } from "@/types";

const dojoMeta: Record<DojoType, { Icon: React.ComponentType<{ className?: string }>; label: string; accent: string; accentBg: string; accentBorder: string }> = {
  html: { Icon: FaHtml5, label: "HTML", accent: "text-neon-orange", accentBg: "bg-neon-orange/10", accentBorder: "border-neon-orange/30" },
  css: { Icon: SiCss, label: "CSS", accent: "text-css-purple", accentBg: "bg-css-purple/10", accentBorder: "border-css-purple/30" },
  js: { Icon: SiJavascript, label: "JavaScript", accent: "text-neon-yellow", accentBg: "bg-neon-yellow/10", accentBorder: "border-neon-yellow/30" },
  react: { Icon: FaReact, label: "React", accent: "text-neon-teal", accentBg: "bg-neon-teal/10", accentBorder: "border-neon-teal/30" },
  "react-eco": { Icon: FaReact, label: "Ecosistema React", accent: "text-neon-green", accentBg: "bg-neon-green/10", accentBorder: "border-neon-green/30" },
  nextjs: { Icon: SiNextdotjs, label: "Next.js", accent: "text-neon-blue", accentBg: "bg-neon-blue/10", accentBorder: "border-neon-blue/30" },
};

interface ModuleSetting {
  slug: string;
  enabled: boolean;
}

const htmlCategories: { key: ModuleCategory; label: string; color: string; badge: string }[] = [
  { key: "html-fundamentals", label: "HTML Fundamentos", color: "text-neon-orange", badge: "bg-neon-orange/10 text-neon-orange" },
  { key: "html-intermediate", label: "HTML Intermedio", color: "text-neon-yellow", badge: "bg-neon-yellow/10 text-neon-yellow" },
  { key: "html-advanced", label: "HTML Avanzado", color: "text-neon-red", badge: "bg-neon-red/10 text-neon-red" },
];

const cssCategories: { key: ModuleCategory; label: string; color: string; badge: string }[] = [
  { key: "intro", label: "Introduccion", color: "text-css-purple", badge: "bg-css-purple/10 text-css-purple" },
  { key: "intermediate", label: "Intermedio", color: "text-css-purple", badge: "bg-css-purple/10 text-css-purple" },
  { key: "advanced", label: "Avanzado", color: "text-neon-purple", badge: "bg-neon-purple/10 text-neon-purple" },
  { key: "preprocessors", label: "Preprocesadores", color: "text-neon-pink", badge: "bg-neon-pink/10 text-neon-pink" },
  { key: "frameworks", label: "Frameworks CSS", color: "text-css-purple", badge: "bg-css-purple/10 text-css-purple" },
];

const jsCategories: { key: ModuleCategory; label: string; color: string; badge: string }[] = [
  { key: "js-fundamentals", label: "Fundamentos", color: "text-neon-yellow", badge: "bg-neon-yellow/10 text-neon-yellow" },
  { key: "js-intermediate", label: "Intermedio", color: "text-neon-blue", badge: "bg-neon-blue/10 text-neon-blue" },
  { key: "js-advanced", label: "Avanzado", color: "text-neon-purple", badge: "bg-neon-purple/10 text-neon-purple" },
  { key: "js-async", label: "Asincronia", color: "text-neon-orange", badge: "bg-neon-orange/10 text-neon-orange" },
  { key: "js-dom", label: "DOM y Eventos", color: "text-neon-green", badge: "bg-neon-green/10 text-neon-green" },
  { key: "js-projects", label: "Proyectos", color: "text-neon-pink", badge: "bg-neon-pink/10 text-neon-pink" },
  { key: "js-typescript", label: "TypeScript", color: "text-ts-blue", badge: "bg-ts-blue/10 text-ts-blue" },
];

const reactCategories: { key: ModuleCategory; label: string; color: string; badge: string }[] = [
  { key: "react-fundamentals", label: "React Fundamentos", color: "text-neon-teal", badge: "bg-neon-teal/10 text-neon-teal" },
  { key: "react-intermediate", label: "React Intermedio", color: "text-neon-blue", badge: "bg-neon-blue/10 text-neon-blue" },
  { key: "react-advanced", label: "React Avanzado", color: "text-neon-purple", badge: "bg-neon-purple/10 text-neon-purple" },
  { key: "react-projects", label: "React Proyectos", color: "text-neon-green", badge: "bg-neon-green/10 text-neon-green" },
];

const reactEcoCategories: { key: ModuleCategory; label: string; color: string; badge: string }[] = [
  { key: "react-eco-routing", label: "Routing", color: "text-neon-green", badge: "bg-neon-green/10 text-neon-green" },
  { key: "react-eco-state", label: "Estado Global", color: "text-neon-green", badge: "bg-neon-green/10 text-neon-green" },
  { key: "react-eco-ui", label: "UI y Componentes", color: "text-neon-green", badge: "bg-neon-green/10 text-neon-green" },
  { key: "react-eco-forms", label: "Formularios", color: "text-neon-green", badge: "bg-neon-green/10 text-neon-green" },
  { key: "react-eco-data", label: "Data Fetching", color: "text-neon-green", badge: "bg-neon-green/10 text-neon-green" },
];

const nextjsCategories: { key: ModuleCategory; label: string; color: string; badge: string }[] = [
  { key: "nextjs-fundamentals", label: "Fundamentos", color: "text-neon-blue", badge: "bg-neon-blue/10 text-neon-blue" },
  { key: "nextjs-intermediate", label: "Intermedio", color: "text-neon-blue", badge: "bg-neon-blue/10 text-neon-blue" },
  { key: "nextjs-advanced", label: "Avanzado", color: "text-neon-purple", badge: "bg-neon-purple/10 text-neon-purple" },
];

export default function TeacherModulosPage() {
  const [settings, setSettings] = useState<ModuleSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [bulkToggling, setBulkToggling] = useState(false);
  const [activeDojoFilter, setActiveDojoFilter] = useState<DojoType>("html");

  useEffect(() => {
    fetch("/api/teacher/modules")
      .then((res) => res.json())
      .then((data: ModuleSetting[]) => {
        setSettings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const isEnabled = (slug: string): boolean => {
    const setting = settings.find((s) => s.slug === slug);
    // If no setting exists, module is enabled by default
    return setting ? setting.enabled : true;
  };

  const handleToggle = async (slug: string) => {
    const currentEnabled = isEnabled(slug);
    const newEnabled = !currentEnabled;
    setToggling(slug);

    try {
      await fetch("/api/teacher/modules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, enabled: newEnabled }),
      });

      setSettings((prev) => {
        const existing = prev.find((s) => s.slug === slug);
        if (existing) {
          return prev.map((s) => (s.slug === slug ? { ...s, enabled: newEnabled } : s));
        }
        return [...prev, { slug, enabled: newEnabled }];
      });
    } catch {
      // Silently fail
    } finally {
      setToggling(null);
    }
  };

  const isTrackEnabled = (dojo: DojoType): boolean => {
    const trackModules = ALL_MODULES.filter((m) => m.dojo === dojo);
    return trackModules.every((m) => isEnabled(m.slug));
  };

  const handleBulkToggle = async (dojo: DojoType) => {
    const newEnabled = !isTrackEnabled(dojo);
    setBulkToggling(true);

    try {
      await fetch("/api/teacher/modules/bulk", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dojo, enabled: newEnabled }),
      });

      const trackSlugs = ALL_MODULES.filter((m) => m.dojo === dojo).map((m) => m.slug);

      setSettings((prev) => {
        const updated = prev.map((s) =>
          trackSlugs.includes(s.slug) ? { ...s, enabled: newEnabled } : s
        );
        const existingSlugs = new Set(updated.map((s) => s.slug));
        const newEntries = trackSlugs
          .filter((slug) => !existingSlugs.has(slug))
          .map((slug) => ({ slug, enabled: newEnabled }));
        return [...updated, ...newEntries];
      });
    } catch {
      // Silently fail
    } finally {
      setBulkToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 bg-editor-surface rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 bg-editor-surface rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 p-4">
      <div>
        <Link
          href="/teacher"
          className="inline-flex items-center gap-2 text-sm text-editor-muted hover:text-neon-blue transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Panel
        </Link>
        <h1 className="text-2xl font-bold text-editor-text mb-2">
          Gestionar Modulos
        </h1>
        <p className="text-editor-muted">
          Activa o desactiva modulos para tus estudiantes. Los modulos desactivados se muestran como &quot;Proximamente&quot;.
        </p>

        {/* Dojo filter tabs */}
        <div className="flex gap-2 mt-4">
          {(["html", "css", "js", "react", "react-eco", "nextjs"] as DojoType[]).map((dojo) => {
            const meta = dojoMeta[dojo];
            const active = activeDojoFilter === dojo;
            return (
              <button
                key={dojo}
                onClick={() => setActiveDojoFilter(dojo)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? `${meta.accentBg} ${meta.accent} border ${meta.accentBorder}`
                    : "bg-editor-surface text-editor-muted border border-editor-border hover:text-editor-text"
                }`}
              >
                <meta.Icon className="w-4 h-4" />
                {meta.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Master track toggle */}
      {(() => {
        const meta = dojoMeta[activeDojoFilter];
        const trackModules = ALL_MODULES.filter((m) => m.dojo === activeDojoFilter);
        const trackEnabled = isTrackEnabled(activeDojoFilter);
        const enabledCount = trackModules.filter((m) => isEnabled(m.slug)).length;

        return (
          <div className={`flex items-center justify-between p-4 rounded-xl border ${trackEnabled ? "border-editor-border bg-editor-surface" : "border-neon-red/20 bg-neon-red/[0.03]"}`}>
            <div className="flex items-center gap-3">
              <meta.Icon className={`w-6 h-6 ${trackEnabled ? meta.accent : "text-editor-muted"}`} />
              <div>
                <p className="text-sm font-semibold text-editor-text">
                  Ruta de {meta.label}
                </p>
                <p className="text-xs text-editor-muted">
                  {enabledCount} de {trackModules.length} módulos activos
                </p>
              </div>
            </div>
            <button
              onClick={() => handleBulkToggle(activeDojoFilter)}
              disabled={bulkToggling}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                trackEnabled ? "bg-neon-green" : "bg-editor-muted/30"
              } ${bulkToggling ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
              aria-label={trackEnabled ? `Desactivar toda la ruta de ${meta.label}` : `Activar toda la ruta de ${meta.label}`}
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-white transition-transform ${
                  trackEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        );
      })()}

      {(activeDojoFilter === "html" ? htmlCategories : activeDojoFilter === "css" ? cssCategories : activeDojoFilter === "js" ? jsCategories : activeDojoFilter === "react" ? reactCategories : activeDojoFilter === "react-eco" ? reactEcoCategories : nextjsCategories).map((cat) => {
        const catModules = ALL_MODULES.filter((m) => m.dojo === activeDojoFilter && m.category === cat.key);
        if (catModules.length === 0) return null;

        return (
          <div key={cat.key}>
            <div className="flex items-center gap-3 mb-5">
              <h2 className={`text-lg font-semibold ${cat.color}`}>{cat.label}</h2>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${cat.badge}`}>
                {catModules.length} modulos
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {catModules.map((mod) => {
                const enabled = isEnabled(mod.slug);
                const isToggling = toggling === mod.slug;

                return (
                  <div
                    key={mod.slug}
                    className={`bg-editor-surface border rounded-xl p-6 transition-all ${
                      enabled
                        ? "border-editor-border"
                        : "border-editor-border opacity-60"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-editor-text mb-1">
                          {mod.title}
                        </h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cat.badge}`}>
                          {cat.label}
                        </span>
                      </div>

                      {/* Toggle switch */}
                      <button
                        onClick={() => handleToggle(mod.slug)}
                        disabled={isToggling}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${
                          enabled
                            ? "bg-neon-green"
                            : "bg-editor-muted/30"
                        } ${isToggling ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
                        aria-label={enabled ? "Desactivar modulo" : "Activar modulo"}
                      >
                        <span
                          className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                            enabled ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    <p className="text-sm text-editor-muted mb-3 line-clamp-2">
                      {mod.description}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-editor-muted">
                      <span>{mod.lessons.length} lecciones</span>
                      <span>&middot;</span>
                      <span>{mod.exercises.length} ejercicios</span>
                    </div>

                    {!enabled && (
                      <div className="mt-3 text-xs text-neon-orange font-medium">
                        Desactivado - Los estudiantes veran &quot;Proximamente&quot;
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
