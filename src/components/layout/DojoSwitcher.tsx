"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FaHtml5, FaReact, FaVuejs, FaPython, FaNodeJs, FaRobot, FaLaptopCode, FaServer } from "react-icons/fa";
import { SiCss, SiJavascript, SiNextdotjs } from "react-icons/si";
import { useDojo } from "@/hooks/useDojo";
import { ALL_MODULES } from "@/data/modules";
import type { DojoType } from "@/types";

type Estado = "disponible" | "gratis" | "premium";
type IconType = React.ComponentType<{ className?: string }>;

interface Tech {
  label: string;
  Icon: IconType;
  accentText: string;
  dojo?: DojoType; // seleccionable si esta definido
  estado: Estado;
  href?: string; // destino si esta bloqueado
}

interface Ruta {
  id: string;
  label: string;
  Icon: IconType;
  accentText: string;
  accentBg: string;
  accentBorder: string;
  techs: Tech[];
}

const RUTAS: Ruta[] = [
  {
    id: "frontend",
    label: "Frontend",
    Icon: FaLaptopCode,
    accentText: "text-neon-teal",
    accentBg: "bg-neon-teal/10",
    accentBorder: "border-neon-teal",
    techs: [
      { label: "HTML", Icon: FaHtml5, accentText: "text-neon-orange", dojo: "html", estado: "disponible" },
      { label: "CSS", Icon: SiCss, accentText: "text-css-purple", dojo: "css", estado: "disponible" },
      { label: "JavaScript", Icon: SiJavascript, accentText: "text-neon-yellow", dojo: "js", estado: "disponible" },
      { label: "React", Icon: FaReact, accentText: "text-neon-teal", dojo: "react", estado: "disponible" },
      { label: "Ecosistema React", Icon: FaReact, accentText: "text-neon-green", dojo: "react-eco", estado: "disponible" },
      { label: "Next.js", Icon: SiNextdotjs, accentText: "text-neon-blue", dojo: "nextjs", estado: "disponible" },
      { label: "Vue", Icon: FaVuejs, accentText: "text-neon-green", estado: "premium", href: "/cursos" },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    Icon: FaServer,
    accentText: "text-neon-green",
    accentBg: "bg-neon-green/10",
    accentBorder: "border-neon-green",
    techs: [
      { label: "Python — SQL · Django · FastAPI", Icon: FaPython, accentText: "text-neon-green", estado: "gratis", href: "/backend-python" },
      { label: "Node.js", Icon: FaNodeJs, accentText: "text-neon-green", estado: "premium", href: "/cursos" },
    ],
  },
  {
    id: "ia",
    label: "IA Dev",
    Icon: FaRobot,
    accentText: "text-neon-pink",
    accentBg: "bg-neon-pink/10",
    accentBorder: "border-neon-pink",
    techs: [
      { label: "Open Code — programar con IA", Icon: FaRobot, accentText: "text-neon-pink", estado: "premium", href: "/cursos" },
    ],
  },
];

// Todas las tecnologias seleccionables (frontend), para el estado del trigger.
const SELECTABLE = RUTAS.flatMap((r) => r.techs.filter((t) => t.dojo)) as (Tech & { dojo: DojoType })[];

function Badge({ estado }: { estado: Estado }) {
  if (estado === "gratis") {
    return <span className="shrink-0 rounded-full bg-neon-green/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-neon-green">Gratis · Pronto</span>;
  }
  if (estado === "premium") {
    return <span className="shrink-0 rounded-full bg-gradient-to-r from-neon-pink to-neon-purple px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white">Premium · Pronto</span>;
  }
  return null;
}

export default function DojoSwitcher() {
  const { activeDojo, setActiveDojo } = useDojo();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const counts = Object.fromEntries(
    SELECTABLE.map((t) => [t.dojo, ALL_MODULES.filter((m) => m.dojo === t.dojo).length])
  ) as Record<DojoType, number>;

  const activeTech = SELECTABLE.find((t) => t.dojo === activeDojo) ?? SELECTABLE[0];
  const activeRuta = RUTAS.find((r) => r.techs.some((t) => t.dojo === activeDojo)) ?? RUTAS[0];

  // Acordeon: un grupo abierto a la vez; por defecto la ruta de la tecnologia activa.
  const [openRuta, setOpenRuta] = useState<string>(activeRuta.id);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="px-3 py-3 relative">
      <p className="text-xs text-editor-muted uppercase tracking-wider mb-2 px-1">
        Rutas de aprendizaje
      </p>

      {/* Trigger: muestra la tecnologia activa + su ruta */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg border-l-[3px] transition-all duration-200 ${activeRuta.accentBg} ${activeRuta.accentBorder}`}
      >
        <activeTech.Icon className={`w-5 h-5 shrink-0 ${activeTech.accentText}`} />
        <div className="flex flex-col min-w-0 flex-1 text-left">
          <span className={`text-sm font-medium leading-tight ${activeTech.accentText}`}>
            {activeTech.label}
          </span>
          <span className="text-xs text-editor-muted leading-tight">
            {activeRuta.label} · {counts[activeDojo]} módulos
          </span>
        </div>
        <svg
          className={`w-3.5 h-3.5 shrink-0 text-editor-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown: acordeon de rutas; un grupo abierto a la vez */}
      {open && (
        <div className="absolute left-3 right-3 top-full mt-1 z-50 bg-editor-sidebar border border-editor-border rounded-lg shadow-lg overflow-hidden max-h-[70vh] overflow-y-auto">
          {RUTAS.map((ruta) => {
            const isOpenRuta = openRuta === ruta.id;
            return (
              <div key={ruta.id} className="border-b border-editor-border last:border-b-0">
                {/* Cabecera de ruta (clic = expandir/colapsar) */}
                <button
                  onClick={() => setOpenRuta((prev) => (prev === ruta.id ? "" : ruta.id))}
                  aria-expanded={isOpenRuta}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-editor-hover/50 transition-colors"
                >
                  <ruta.Icon className={`w-4 h-4 shrink-0 ${ruta.accentText}`} />
                  <span className={`text-[11px] font-semibold uppercase tracking-wider flex-1 ${ruta.accentText}`}>
                    {ruta.label}
                  </span>
                  <span className="text-[10px] font-mono text-editor-muted">{ruta.techs.length}</span>
                  <svg
                    className={`w-3 h-3 text-editor-muted transition-transform duration-200 ${isOpenRuta ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Tecnologias: indentadas, con linea-guia a la izquierda */}
                {isOpenRuta && (
                  <div className="ml-[21px] mb-2 border-l border-editor-border pl-1.5">
                    {ruta.techs.map((tech) => {
                      // Seleccionable (tiene dojo): cambia de track
                      if (tech.dojo) {
                        const isActive = activeDojo === tech.dojo;
                        return (
                          <button
                            key={tech.dojo}
                            onClick={() => { setActiveDojo(tech.dojo!); setOpen(false); }}
                            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-left transition-colors ${
                              isActive ? `${ruta.accentBg} ${tech.accentText}` : "text-editor-muted hover:bg-editor-hover hover:text-editor-text"
                            }`}
                          >
                            <tech.Icon className={`w-4 h-4 shrink-0 ${isActive ? tech.accentText : ""}`} />
                            <span className="text-sm font-medium flex-1">{tech.label}</span>
                            <span className="text-xs text-editor-muted">{counts[tech.dojo]}</span>
                          </button>
                        );
                      }
                      // Bloqueada: enlaza a su landing / sondeo
                      return (
                        <Link
                          key={tech.label}
                          href={tech.href ?? "/cursos"}
                          onClick={() => setOpen(false)}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-left text-editor-muted/80 hover:bg-editor-hover hover:text-editor-text transition-colors"
                        >
                          <tech.Icon className="w-4 h-4 shrink-0 opacity-70" />
                          <span className="text-sm font-medium flex-1 truncate">{tech.label}</span>
                          <Badge estado={tech.estado} />
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
