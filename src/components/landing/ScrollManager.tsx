"use client";

import { useEffect, useState } from "react";
import { SECCIONES, useLanding } from "./useLanding";

// Maneja el scroll nativo del documento:
//  - traduce scrollY -> progress (0..1) y sección activa (alimenta la escena 3D)
//  - AUTO-SCROLL suave al cargar, que se cancela apenas el usuario interactúa
//  - muestra un indicador animado de "scrollea" mientras estás arriba
export default function ScrollManager() {
  const [oculto, setOculto] = useState(false);

  // scroll -> store
  useEffect(() => {
    const { setProgress, setActiveSection } = useLanding.getState();
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      setProgress(p);
      setActiveSection(Math.min(SECCIONES.length - 1, Math.round(p * (SECCIONES.length - 1))));
      if (window.scrollY > 10) setOculto(true);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // auto-scroll (se cancela con cualquier interacción del usuario)
  useEffect(() => {
    let raf = 0;
    let last = 0;
    let arranque = 0;
    let cancelado = false;

    const cancelar = () => {
      cancelado = true;
      useLanding.getState().setAutoplay(false);
    };
    const eventos: (keyof WindowEventMap)[] = ["wheel", "touchstart", "keydown", "pointerdown"];
    eventos.forEach((e) => window.addEventListener(e, cancelar, { passive: true }));

    const tick = (ts: number) => {
      if (cancelado) return;
      if (!arranque) arranque = ts;
      if (!last) last = ts;
      const dt = ts - last;
      last = ts;

      // esperar ~1.3s antes de empezar a moverse
      if (ts - arranque > 1300) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (window.scrollY < max - 2) {
          window.scrollBy(0, (dt / 1000) * 120); // ~120px/seg, suave
        } else {
          useLanding.getState().setAutoplay(false);
          return; // llegó al final (CTA) -> detener
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      eventos.forEach((e) => window.removeEventListener(e, cancelar));
    };
  }, []);

  if (oculto) return null;

  return (
    <div className="fixed bottom-8 left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
      {/* "mouse" con rueda que baja */}
      <div className="relative h-9 w-6 rounded-full border-2 border-editor-muted/70">
        <span className="absolute left-1/2 top-1.5 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-neon-blue animate-bounce" />
      </div>
      <span className="text-xs text-editor-muted font-mono tracking-wide">scrollea para entrenar</span>
    </div>
  );
}
