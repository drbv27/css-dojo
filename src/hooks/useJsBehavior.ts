"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ejecutarRun, LIMITE_MS } from "@/lib/jsRunner";
import { puntuar, type Puntaje } from "@/lib/jsBehavior";
import type { JsBehaviorCase, JsRunOutcome } from "@/types";

export type EstadoJs = "inactivo" | "corriendo" | "listo";

/**
 * Runs a js-behavior exercise and reports what happened.
 *
 * All the transport lives in `ejecutarRun`; this only owns React state. The
 * executor is a Web Worker rather than the preview iframe, and that was measured:
 * an iframe shares its thread with the page, so a `while (true)` froze the whole
 * tab. A worker keeps the page responsive and can actually be terminated.
 */
export function useJsBehavior(cases: JsBehaviorCase[], limiteMs: number = LIMITE_MS) {
  const [estado, setEstado] = useState<EstadoJs>("inactivo");
  const [resultado, setResultado] = useState<JsRunOutcome | null>(null);

  // A run started before unmount must not call setState afterwards.
  const vivoRef = useRef(true);
  useEffect(() => {
    vivoRef.current = true;
    return () => {
      vivoRef.current = false;
    };
  }, []);

  const casosRef = useRef(cases);
  useEffect(() => {
    casosRef.current = cases;
  }, [cases]);

  const ejecutar = useCallback(
    async (codigo: string) => {
      setResultado(null);
      setEstado("corriendo");
      const outcome = await ejecutarRun(codigo, casosRef.current, { limiteMs });
      if (!vivoRef.current) return;
      setResultado(outcome);
      setEstado("listo");
    },
    [limiteMs]
  );

  const puntaje: Puntaje | null = resultado ? puntuar(resultado) : null;

  return { estado, resultado, puntaje, ejecutar };
}
