"use client";

import { useProgress } from "@react-three/drei";

// Pantalla de carga temática (enso/anillo neón girando) con progreso real.
export default function Loader() {
  const { active, progress } = useProgress();
  if (!active) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-editor-bg">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-2 border-editor-border" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-neon-purple border-r-neon-blue animate-spin" />
      </div>
      <p className="text-editor-muted font-mono text-sm">
        Preparando el dojo… {Math.round(progress)}%
      </p>
    </div>
  );
}
