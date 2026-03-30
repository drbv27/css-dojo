"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaHtml5, FaReact } from "react-icons/fa";
import { SiCss, SiJavascript, SiNextdotjs } from "react-icons/si";
import { ALL_MODULES } from "@/data/modules";
import { useProgress } from "@/hooks/useProgress";
import { useAuth } from "@/hooks/useAuth";
import { useDojo } from "@/hooks/useDojo";
import type { ModuleCategory } from "@/types";

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

const htmlCategories = [
  { key: "html-fundamentals" as const, label: "HTML Fundamentos", color: "text-neon-orange", badge: "bg-neon-orange/10 text-neon-orange", accent: "border-neon-orange/40", hoverBorder: "hover:border-neon-orange/40", hoverBg: "hover:bg-neon-orange/[0.04]", hoverTitle: "group-hover:text-neon-orange" },
  { key: "html-intermediate" as const, label: "HTML Intermedio", color: "text-neon-yellow", badge: "bg-neon-yellow/10 text-neon-yellow", accent: "border-neon-yellow/40", hoverBorder: "hover:border-neon-yellow/40", hoverBg: "hover:bg-neon-yellow/[0.04]", hoverTitle: "group-hover:text-neon-yellow" },
  { key: "html-advanced" as const, label: "HTML Avanzado", color: "text-neon-red", badge: "bg-neon-red/10 text-neon-red", accent: "border-neon-red/40", hoverBorder: "hover:border-neon-red/40", hoverBg: "hover:bg-neon-red/[0.04]", hoverTitle: "group-hover:text-neon-red" },
];

const cssCategories = [
  { key: "intro" as const, label: "Introduccion", color: "text-css-purple", badge: "bg-css-purple/10 text-css-purple", accent: "border-css-purple/40", hoverBorder: "hover:border-css-purple/40", hoverBg: "hover:bg-css-purple/[0.04]", hoverTitle: "group-hover:text-css-purple" },
  { key: "intermediate" as const, label: "Intermedio", color: "text-css-purple", badge: "bg-css-purple/10 text-css-purple", accent: "border-css-purple/40", hoverBorder: "hover:border-css-purple/40", hoverBg: "hover:bg-css-purple/[0.04]", hoverTitle: "group-hover:text-css-purple" },
  { key: "advanced" as const, label: "Avanzado", color: "text-neon-purple", badge: "bg-neon-purple/10 text-neon-purple", accent: "border-neon-purple/40", hoverBorder: "hover:border-neon-purple/40", hoverBg: "hover:bg-neon-purple/[0.04]", hoverTitle: "group-hover:text-neon-purple" },
  { key: "preprocessors" as const, label: "Preprocesadores", color: "text-neon-pink", badge: "bg-neon-pink/10 text-neon-pink", accent: "border-neon-pink/40", hoverBorder: "hover:border-neon-pink/40", hoverBg: "hover:bg-neon-pink/[0.04]", hoverTitle: "group-hover:text-neon-pink" },
  { key: "frameworks" as const, label: "Frameworks CSS", color: "text-css-purple", badge: "bg-css-purple/10 text-css-purple", accent: "border-css-purple/40", hoverBorder: "hover:border-css-purple/40", hoverBg: "hover:bg-css-purple/[0.04]", hoverTitle: "group-hover:text-css-purple" },
];

const jsCategories = [
  { key: "js-fundamentals" as const, label: "Fundamentos", color: "text-neon-yellow", badge: "bg-neon-yellow/10 text-neon-yellow", accent: "border-neon-yellow/40", hoverBorder: "hover:border-neon-yellow/40", hoverBg: "hover:bg-neon-yellow/[0.04]", hoverTitle: "group-hover:text-neon-yellow" },
  { key: "js-intermediate" as const, label: "Intermedio", color: "text-neon-blue", badge: "bg-neon-blue/10 text-neon-blue", accent: "border-neon-blue/40", hoverBorder: "hover:border-neon-blue/40", hoverBg: "hover:bg-neon-blue/[0.04]", hoverTitle: "group-hover:text-neon-blue" },
  { key: "js-advanced" as const, label: "Avanzado", color: "text-neon-purple", badge: "bg-neon-purple/10 text-neon-purple", accent: "border-neon-purple/40", hoverBorder: "hover:border-neon-purple/40", hoverBg: "hover:bg-neon-purple/[0.04]", hoverTitle: "group-hover:text-neon-purple" },
  { key: "js-async" as const, label: "Asincronia", color: "text-neon-orange", badge: "bg-neon-orange/10 text-neon-orange", accent: "border-neon-orange/40", hoverBorder: "hover:border-neon-orange/40", hoverBg: "hover:bg-neon-orange/[0.04]", hoverTitle: "group-hover:text-neon-orange" },
  { key: "js-dom" as const, label: "DOM y Eventos", color: "text-neon-green", badge: "bg-neon-green/10 text-neon-green", accent: "border-neon-green/40", hoverBorder: "hover:border-neon-green/40", hoverBg: "hover:bg-neon-green/[0.04]", hoverTitle: "group-hover:text-neon-green" },
  { key: "js-projects" as const, label: "Proyectos", color: "text-neon-pink", badge: "bg-neon-pink/10 text-neon-pink", accent: "border-neon-pink/40", hoverBorder: "hover:border-neon-pink/40", hoverBg: "hover:bg-neon-pink/[0.04]", hoverTitle: "group-hover:text-neon-pink" },
  { key: "js-typescript" as const, label: "TypeScript", color: "text-ts-blue", badge: "bg-ts-blue/10 text-ts-blue", accent: "border-ts-blue/40", hoverBorder: "hover:border-ts-blue/40", hoverBg: "hover:bg-ts-blue/[0.04]", hoverTitle: "group-hover:text-ts-blue" },
];

const reactCategories = [
  { key: "react-fundamentals" as const, label: "React Fundamentos", color: "text-neon-teal", badge: "bg-neon-teal/10 text-neon-teal", accent: "border-neon-teal/40", hoverBorder: "hover:border-neon-teal/40", hoverBg: "hover:bg-neon-teal/[0.04]", hoverTitle: "group-hover:text-neon-teal" },
  { key: "react-intermediate" as const, label: "React Intermedio", color: "text-neon-blue", badge: "bg-neon-blue/10 text-neon-blue", accent: "border-neon-blue/40", hoverBorder: "hover:border-neon-blue/40", hoverBg: "hover:bg-neon-blue/[0.04]", hoverTitle: "group-hover:text-neon-blue" },
  { key: "react-advanced" as const, label: "React Avanzado", color: "text-neon-purple", badge: "bg-neon-purple/10 text-neon-purple", accent: "border-neon-purple/40", hoverBorder: "hover:border-neon-purple/40", hoverBg: "hover:bg-neon-purple/[0.04]", hoverTitle: "group-hover:text-neon-purple" },
  { key: "react-projects" as const, label: "React Proyectos", color: "text-neon-green", badge: "bg-neon-green/10 text-neon-green", accent: "border-neon-green/40", hoverBorder: "hover:border-neon-green/40", hoverBg: "hover:bg-neon-green/[0.04]", hoverTitle: "group-hover:text-neon-green" },
];

const reactEcoCategories = [
  { key: "react-eco-routing" as const, label: "Routing", color: "text-neon-green", badge: "bg-neon-green/10 text-neon-green", accent: "border-neon-green/40", hoverBorder: "hover:border-neon-green/40", hoverBg: "hover:bg-neon-green/[0.04]", hoverTitle: "group-hover:text-neon-green" },
  { key: "react-eco-state" as const, label: "Estado Global", color: "text-neon-green", badge: "bg-neon-green/10 text-neon-green", accent: "border-neon-green/40", hoverBorder: "hover:border-neon-green/40", hoverBg: "hover:bg-neon-green/[0.04]", hoverTitle: "group-hover:text-neon-green" },
  { key: "react-eco-ui" as const, label: "UI y Componentes", color: "text-neon-green", badge: "bg-neon-green/10 text-neon-green", accent: "border-neon-green/40", hoverBorder: "hover:border-neon-green/40", hoverBg: "hover:bg-neon-green/[0.04]", hoverTitle: "group-hover:text-neon-green" },
  { key: "react-eco-forms" as const, label: "Formularios", color: "text-neon-green", badge: "bg-neon-green/10 text-neon-green", accent: "border-neon-green/40", hoverBorder: "hover:border-neon-green/40", hoverBg: "hover:bg-neon-green/[0.04]", hoverTitle: "group-hover:text-neon-green" },
  { key: "react-eco-data" as const, label: "Data Fetching", color: "text-neon-green", badge: "bg-neon-green/10 text-neon-green", accent: "border-neon-green/40", hoverBorder: "hover:border-neon-green/40", hoverBg: "hover:bg-neon-green/[0.04]", hoverTitle: "group-hover:text-neon-green" },
];

const nextjsCategories = [
  { key: "nextjs-fundamentals" as const, label: "Fundamentos", color: "text-neon-blue", badge: "bg-neon-blue/10 text-neon-blue", accent: "border-neon-blue/40", hoverBorder: "hover:border-neon-blue/40", hoverBg: "hover:bg-neon-blue/[0.04]", hoverTitle: "group-hover:text-neon-blue" },
  { key: "nextjs-intermediate" as const, label: "Intermedio", color: "text-neon-blue", badge: "bg-neon-blue/10 text-neon-blue", accent: "border-neon-blue/40", hoverBorder: "hover:border-neon-blue/40", hoverBg: "hover:bg-neon-blue/[0.04]", hoverTitle: "group-hover:text-neon-blue" },
  { key: "nextjs-advanced" as const, label: "Avanzado", color: "text-neon-purple", badge: "bg-neon-purple/10 text-neon-purple", accent: "border-neon-purple/40", hoverBorder: "hover:border-neon-purple/40", hoverBg: "hover:bg-neon-purple/[0.04]", hoverTitle: "group-hover:text-neon-purple" },
];

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

  const categories = activeDojo === "html" ? htmlCategories : activeDojo === "css" ? cssCategories : activeDojo === "js" ? jsCategories : activeDojo === "react" ? reactCategories : activeDojo === "react-eco" ? reactEcoCategories : nextjsCategories;
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

      {categories.map((cat) => {
        const catModules = dojoModules.filter((m) => m.category === cat.key);
        if (catModules.length === 0) return null;
        return (
          <div key={cat.key}>
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
