"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useProgress } from "@react-three/drei";

type FaseLoader = "cargando" | "completo" | "error";

export interface LoaderProps {
  /** true when Landing3D's error boundary caught a throw from <Escena /> */
  escenaFallo?: boolean;
  /** Landing3D: () => setModo("estatica") */
  onOmitirEscena: () => void;
}

const HOLD_MS = 600;
const SALIDA_MS = 450;
const HINT_MS = 8_000;
const ESCAPE_MS = 20_000;
const ARRANQUE_MS = 2_500;

const RADIO = 42;
const CIRCUNFERENCIA = 2 * Math.PI * RADIO;

// prefers-reduced-motion is read through useSyncExternalStore rather than
// written into state from an effect. This is the same pattern Landing3D.tsx
// already uses for its WebGL/viewport probe, with one difference: that probe
// never changes after the first read, so its `subscribe` is a no-op. This one
// genuinely can change at runtime, so the listener is what keeps it live —
// satisfying the spec's "re-evaluate reactively, not sampled once at mount".
//
// The earlier implementation used `useState(false)` plus
// `setTimeout(() => setReducido(mq.matches), 0)` inside an effect, purely to
// keep `react-hooks/set-state-in-effect` quiet. That deferred the correction by
// a macrotask, so a reduced-motion visitor could see one animated frame before
// it was suppressed. Reading the value instead of writing it removes both the
// lint dodge and that window.
const consultaReducido = (): MediaQueryList | null =>
  typeof window === "undefined" ? null : window.matchMedia("(prefers-reduced-motion: reduce)");

const suscribirReducido = (alCambiar: () => void) => {
  const mq = consultaReducido();
  if (!mq) return () => {};
  mq.addEventListener("change", alCambiar);
  return () => mq.removeEventListener("change", alCambiar);
};

const leerReducido = () => consultaReducido()?.matches ?? false;

// Server render cannot know the preference; false keeps hydration consistent.
const leerReducidoEnServidor = () => false;

function textoAnuncio(fase: FaseLoader, hito: number | null, lento: boolean): string {
  if (fase === "error") return "No pudimos cargar la escena 3D.";
  if (fase === "completo") return "Dojo listo.";
  if (lento) return "La conexión va lenta, seguimos cargando.";
  if (hito === null || hito === 0) return "Preparando el dojo…";
  return `Preparando el dojo, ${hito} %`;
}

// Pantalla de carga temática ("ensō gate"): anillo SVG con progreso real,
// anuncios de accesibilidad por hitos gruesos, degradación por estancamiento
// y salida animada al completar. Ver design.md de loader-moderno-dojo.
export default function Loader({ escenaFallo = false, onOmitirEscena }: LoaderProps) {
  const { active, progress, errors } = useProgress();

  const [fase, setFase] = useState<FaseLoader>("cargando");
  const [lento, setLento] = useState(false);
  const [visible, setVisible] = useState(true);
  const reducido = useSyncExternalStore(
    suscribirReducido,
    leerReducido,
    leerReducidoEnServidor,
  );

  const terminado = useRef(false);
  const huboActividad = useRef(false);
  const escapeBtnRef = useRef<HTMLButtonElement>(null);

  // Cold-start guard: drei's store starts with `active: false`, so "nothing
  // to load" is indistinguishable from "already done" on the first render.
  // If no activity is ever observed, resolve to "completo" instead of
  // waiting for the 20s stall timer on a page with nothing to load.
  useEffect(() => {
    const t = setTimeout(() => {
      if (!huboActividad.current) setFase("completo");
    }, ARRANQUE_MS);
    return () => clearTimeout(t);
  }, []);

  // Completion: `active` flips false after having been true at least once.
  // `setFase` is deferred via setTimeout so it never runs as a direct
  // statement in the effect body (react-hooks/set-state-in-effect).
  useEffect(() => {
    if (fase !== "cargando") return;
    if (active) huboActividad.current = true;
    // A failed item ends the manager's queue exactly like a successful one, so
    // `active` drops to false on error too. Without this guard the completion
    // timer races the error gate below, and when it wins it latches
    // `terminado`, which then suppresses the error UI for good. Measured: a 404
    // arriving 3.5 s into the load left the visitor on a bare nav — no scene,
    // no message, no escape action. `errors` is written by drei's `onError`
    // before `onLoad` clears `active`, so it is already populated here.
    if (escenaFallo || errors.length > 0) return;
    if (!active && huboActividad.current) {
      const t = setTimeout(() => setFase("completo"), 0);
      return () => clearTimeout(t);
    }
  }, [active, fase, escenaFallo, errors]);

  // Stall / escape timers, anchored to the LAST genuine advance — both are
  // re-armed by the `progress` dependency, so a slow-but-advancing load
  // never fires either threshold (Design Decision 3). The hint retraction
  // is also deferred one tick for the same lint reason as above.
  useEffect(() => {
    if (fase !== "cargando") return;
    const t0 = setTimeout(() => setLento(false), 0); // a genuine advance retracts the hint
    const t1 = setTimeout(() => setLento(true), HINT_MS);
    const t2 = setTimeout(() => setFase("error"), ESCAPE_MS);
    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [progress, fase]);

  // Error gate: boundary catch OR a fresh drei loading error — latched by
  // `terminado` so a stale, never-reset global `errors` array cannot
  // resurrect an overlay that already dismissed itself.
  useEffect(() => {
    if (terminado.current) return;
    if (!(escenaFallo || (errors.length > 0 && fase === "cargando"))) return;
    const t = setTimeout(() => setFase("error"), 0);
    return () => clearTimeout(t);
  }, [escenaFallo, errors, fase]);

  // Exit sequence: hold the closed ring for one beat, then start the fade.
  // The `terminado` latch makes dismissal one-way.
  useEffect(() => {
    if (fase !== "completo" || terminado.current) return;
    terminado.current = true;
    const t = setTimeout(() => setVisible(false), HOLD_MS);
    return () => clearTimeout(t);
  }, [fase]);

  // Move focus to the escape action so keyboard users are not stranded
  // behind the full-screen overlay when the error state appears.
  useEffect(() => {
    if (fase === "error") escapeBtnRef.current?.focus();
  }, [fase]);

  const hito = fase === "cargando" ? Math.floor(Math.min(progress, 100) / 25) * 25 : null;
  const anuncio = useMemo(() => textoAnuncio(fase, hito, lento), [fase, hito, lento]);

  const pct = Math.round(Math.min(progress, 100));
  const offset = CIRCUNFERENCIA * (1 - pct / 100);
  const trazo = fase === "error" ? "var(--color-neon-red)" : "url(#enso-grad)";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={reducido ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducido ? 0 : SALIDA_MS / 1000 }}
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-editor-bg${
            fase === "completo" ? " pointer-events-none" : ""
          }`}
        >
          <div role="status" aria-live="polite" aria-busy={fase === "cargando"} className="sr-only">
            {anuncio}
          </div>

          <div className="relative w-24 h-24">
            {!reducido && (
              <div
                data-testid="enso-pulse"
                className="absolute inset-0 rounded-full bg-neon-blue/10 blur-xl animate-pulse"
              />
            )}
            <svg viewBox="0 0 96 96" className="relative -rotate-90" aria-hidden="true">
              <defs>
                <linearGradient id="enso-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-neon-blue)" />
                  <stop offset="100%" stopColor="var(--color-neon-purple)" />
                </linearGradient>
              </defs>
              <circle
                cx="48"
                cy="48"
                r={RADIO}
                fill="none"
                stroke="var(--color-editor-border)"
                strokeWidth="4"
              />
              <circle
                data-testid="enso-arco"
                cx="48"
                cy="48"
                r={RADIO}
                fill="none"
                stroke={trazo}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={CIRCUNFERENCIA}
                strokeDashoffset={offset}
              />
            </svg>
          </div>

          {/* Hidden in the error phase: drei's progress can reach 100 even when
              an asset failed, so leaving this visible printed "Preparando el
              dojo… 100 %" directly above "No pudimos cargar la escena 3D." The
              sr-only announcement was already correct, so only sighted users saw
              the contradiction. Kept for "completo" so the closed ring holds a
              beat showing 100 % before it dissolves. */}
          {fase !== "error" && (
            <p
              aria-hidden="true"
              data-testid="caption-progreso"
              className="font-mono text-sm text-editor-muted"
            >
              Preparando el dojo… {pct} %
            </p>
          )}

          {lento && fase === "cargando" && (
            <p
              aria-hidden="true"
              data-testid="hint-visible"
              className="font-mono text-xs text-editor-muted"
            >
              La conexión va lenta, seguimos cargando.
            </p>
          )}

          {fase === "error" && (
            <div className="flex flex-col items-center gap-3 text-center px-6">
              <p data-testid="error-visible" className="text-editor-text text-sm">
                No pudimos cargar la escena 3D.
              </p>
              <button
                ref={escapeBtnRef}
                type="button"
                onClick={onOmitirEscena}
                className="px-4 py-2 rounded-lg border border-editor-border text-editor-text font-semibold text-sm hover:border-neon-blue/50 hover:text-neon-blue transition-all"
              >
                Continuar sin la escena
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
