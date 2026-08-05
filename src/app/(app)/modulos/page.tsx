"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaHtml5, FaReact } from "react-icons/fa";
import { SiCss, SiJavascript, SiNextdotjs } from "react-icons/si";
import { ALL_MODULES } from "@/data/modules";
import { categoriesForDojo } from "@/data/moduleCategories";
import { useProgress } from "@/hooks/useProgress";
import { useAuth } from "@/hooks/useAuth";
import { useDojo } from "@/hooks/useDojo";

const dojoIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  html: FaHtml5,
  css: SiCss,
  js: SiJavascript,
  react: FaReact,
  "react-eco": FaReact,
  nextjs: SiNextdotjs,
};

const dojoAccentText: Record<string, string> = {
  html: "text-neon-orange",
  css: "text-css-purple",
  js: "text-neon-yellow",
  react: "text-neon-teal",
  "react-eco": "text-neon-green",
  nextjs: "text-neon-blue",
};

// Category grouping, order and presentation live in @/data/moduleCategories so
// this listing and the teacher panel can never disagree about which categories
// exist. See that file for why.

export default function ModulosPage() {
  const { getModuleProgress } = useProgress();
  const { user } = useAuth();
  const { activeDojo } = useDojo();
  const isTeacher = user?.role === "teacher";
  const [enabledSlugs, setEnabledSlugs] = useState<string[] | null>(null);

  useEffect(() => {
    fetch("/api/modules/enabled")
      .then((res) => res.json())
      .then((data) => setEnabledSlugs(data.enabledSlugs))
      .catch(() => setEnabledSlugs(ALL_MODULES.map((m) => m.slug)));
  }, []);

  const categories = categoriesForDojo(activeDojo);
  const dojoModules = ALL_MODULES.filter((m) => m.dojo === activeDojo);
  const DojoIcon = dojoIcon[activeDojo];
  const accentText = dojoAccentText[activeDojo] ?? "text-neon-blue";

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex items-center gap-3">
        <DojoIcon className={`w-8 h-8 shrink-0 ${accentText}`} />
        <div>
          <h1 className="text-2xl font-bold text-editor-text">
            {activeDojo === "html" ? "HTML" : activeDojo === "css" ? "CSS" : activeDojo === "js" ? "JavaScript" : activeDojo === "react" ? "React" : activeDojo === "react-eco" ? "Ecosistema React" : "Next.js"}
          </h1>
          <p className="text-editor-muted text-sm">
          {activeDojo === "html"
            ? "Aprende HTML desde la estructura basica hasta formularios y semantica avanzada"
            : activeDojo === "css"
            ? "Avanza a tu ritmo desde los fundamentos hasta tecnicas avanzadas de CSS"
            : activeDojo === "js"
            ? "Aprende JavaScript desde cero hasta conceptos avanzados"
            : activeDojo === "react"
            ? "Aprende React desde los fundamentos hasta proyectos completos"
            : activeDojo === "react-eco"
            ? "Domina las herramientas esenciales del ecosistema React"
            : "Aprende Next.js con App Router desde cero"}
          </p>
        </div>
      </div>

      {categories.map(({ key, meta: cat }) => {
        const catModules = dojoModules.filter((m) => m.category === key);
        if (catModules.length === 0) return null;
        return (
          <div key={key}>
            {/* Section header with left accent bar */}
            <div className={`flex items-center gap-3 mb-5 pl-3 border-l-2 ${cat.accent}`}>
              <h2 className={`text-sm font-semibold uppercase tracking-wider ${cat.color}`}>
                {cat.label}
              </h2>
              <span className={`text-xs px-2 py-0.5 rounded font-medium ${cat.badge}`}>
                {catModules.length}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {catModules.map((mod) => {
                const modProgress = getModuleProgress(mod.slug, mod.exercises.length);
                const isEnabled = enabledSlugs === null || enabledSlugs.includes(mod.slug);

                if (!isEnabled && !isTeacher) {
                  return (
                    <div
                      key={mod.slug}
                      className="bg-editor-surface border border-editor-border rounded-xl p-6 opacity-50 cursor-not-allowed select-none relative"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-9 h-9 rounded-lg bg-editor-muted/5 flex items-center justify-center">
                          <svg className="w-4 h-4 text-editor-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                      </div>

                      <h3 className="font-medium text-editor-muted mb-1.5">
                        {mod.title}
                      </h3>
                      <p className="text-xs text-editor-muted/60 mb-3 line-clamp-2">
                        {mod.description}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neon-orange bg-neon-orange/10 px-2.5 py-1 rounded-full">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Próximamente
                      </span>
                    </div>
                  );
                }

                return (
                  <Link
                    key={mod.slug}
                    href={`/modulos/${mod.slug}`}
                    className={`bg-editor-surface border border-editor-border rounded-xl p-6 transition-all group ${cat.hoverBorder} ${cat.hoverBg}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-9 h-9 rounded-lg ${cat.badge} flex items-center justify-center`}>
                        <DojoIcon className="w-4 h-4" />
                      </div>
                      <div className="flex items-center gap-2">
                        {isTeacher && !isEnabled && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-neon-orange/10 text-neon-orange font-medium">
                            No publicado
                          </span>
                        )}
                        <span className="text-[10px] text-editor-muted font-mono">
                          #{mod.order.toString().padStart(2, "0")}
                        </span>
                      </div>
                    </div>

                    <h3 className={`font-semibold text-editor-text transition-colors mb-1.5 ${cat.hoverTitle}`}>
                      {mod.title}
                    </h3>

                    <p className="text-sm text-editor-muted mb-4 line-clamp-2">
                      {mod.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-editor-muted mb-2">
                      <span>{mod.lessons.length} lec. &middot; {mod.exercises.length} ej.</span>
                      <span className={modProgress.percentage > 0 ? "text-editor-text font-medium" : ""}>{modProgress.percentage}%</span>
                    </div>

                    <div className="w-full h-1 bg-editor-bg rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          modProgress.percentage === 100
                            ? "bg-neon-green"
                            : modProgress.percentage > 0
                            ? cat.color.replace("text-", "bg-")
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
