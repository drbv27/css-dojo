"use client";

import { useEffect, useRef, useState } from "react";
import { FaHtml5, FaReact } from "react-icons/fa";
import { SiCss, SiJavascript, SiNextdotjs } from "react-icons/si";
import { useDojo } from "@/hooks/useDojo";
import { ALL_MODULES } from "@/data/modules";
import type { DojoType } from "@/types";

const tracks: {
  dojo: DojoType;
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  accentBg: string;
  accentBorder: string;
  accentText: string;
}[] = [
  {
    dojo: "html",
    Icon: FaHtml5,
    label: "HTML",
    accentBg: "bg-neon-orange/10",
    accentBorder: "border-neon-orange",
    accentText: "text-neon-orange",
  },
  {
    dojo: "css",
    Icon: SiCss,
    label: "CSS",
    accentBg: "bg-css-purple/10",
    accentBorder: "border-css-purple",
    accentText: "text-css-purple",
  },
  {
    dojo: "js",
    Icon: SiJavascript,
    label: "JavaScript",
    accentBg: "bg-neon-yellow/10",
    accentBorder: "border-neon-yellow",
    accentText: "text-neon-yellow",
  },
  {
    dojo: "react",
    Icon: FaReact,
    label: "React",
    accentBg: "bg-neon-teal/10",
    accentBorder: "border-neon-teal",
    accentText: "text-neon-teal",
  },
  {
    dojo: "react-eco",
    Icon: FaReact,
    label: "Ecosistema React",
    accentBg: "bg-neon-green/10",
    accentBorder: "border-neon-green",
    accentText: "text-neon-green",
  },
  {
    dojo: "nextjs",
    Icon: SiNextdotjs,
    label: "Next.js",
    accentBg: "bg-neon-blue/10",
    accentBorder: "border-neon-blue",
    accentText: "text-neon-blue",
  },
];

export default function DojoSwitcher() {
  const { activeDojo, setActiveDojo } = useDojo();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const counts = Object.fromEntries(
    tracks.map((t) => [t.dojo, ALL_MODULES.filter((m) => m.dojo === t.dojo).length])
  ) as Record<DojoType, number>;

  const active = tracks.find((t) => t.dojo === activeDojo) ?? tracks[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="px-3 py-3 relative">
      <p className="text-xs text-editor-muted uppercase tracking-wider mb-2 px-1">
        Ruta de aprendizaje
      </p>

      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg border-l-[3px] transition-all duration-200 ${active.accentBg} ${active.accentBorder}`}
      >
        <active.Icon className={`w-5 h-5 shrink-0 ${active.accentText}`} />
        <div className="flex flex-col min-w-0 flex-1 text-left">
          <span className={`text-sm font-medium leading-tight ${active.accentText}`}>
            {active.label}
          </span>
          <span className="text-xs text-editor-muted leading-tight">
            {counts[activeDojo]} módulos
          </span>
        </div>
        <svg
          className={`w-3.5 h-3.5 shrink-0 text-editor-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-3 right-3 top-full mt-1 z-50 bg-editor-sidebar border border-editor-border rounded-lg shadow-lg overflow-hidden">
          {tracks.map((track) => {
            const isActive = activeDojo === track.dojo;
            return (
              <button
                key={track.dojo}
                onClick={() => {
                  setActiveDojo(track.dojo);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                  isActive
                    ? `${track.accentBg} ${track.accentText}`
                    : "text-editor-muted hover:bg-editor-hover hover:text-editor-text"
                }`}
              >
                <track.Icon className={`w-4 h-4 shrink-0 ${isActive ? track.accentText : ""}`} />
                <span className="text-sm font-medium flex-1">{track.label}</span>
                <span className="text-xs text-editor-muted">{counts[track.dojo]}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
