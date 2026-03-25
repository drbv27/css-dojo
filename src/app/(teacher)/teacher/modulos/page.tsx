"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ALL_MODULES } from "@/data/modules";
import type { ModuleCategory } from "@/types";

interface ModuleSetting {
  slug: string;
  enabled: boolean;
}

const categories: { key: ModuleCategory; label: string; color: string; badge: string }[] = [
  { key: "intro", label: "Introduccion", color: "text-neon-green", badge: "bg-neon-green/10 text-neon-green" },
  { key: "intermediate", label: "Intermedio", color: "text-neon-blue", badge: "bg-neon-blue/10 text-neon-blue" },
  { key: "advanced", label: "Avanzado", color: "text-neon-purple", badge: "bg-neon-purple/10 text-neon-purple" },
];

export default function TeacherModulosPage() {
  const [settings, setSettings] = useState<ModuleSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

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
      </div>

      {categories.map((cat) => {
        const catModules = ALL_MODULES.filter((m) => m.category === cat.key);
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
