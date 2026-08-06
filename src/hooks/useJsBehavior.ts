"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  construirHarness,
  interpretarMensaje,
  puntuar,
  type Puntaje,
} from "@/lib/jsBehavior";
import type { JsBehaviorCase, JsRunOutcome } from "@/types";

export type EstadoJs = "inactivo" | "corriendo" | "listo";

/**
 * Default deadline. LivePreview debounces its srcdoc by 300ms, so roughly that
 * much of this budget is spent before the submission starts running at all.
 * Three seconds leaves plenty for real work while still catching a loop fast
 * enough that the student does not think the page broke.
 */
const LIMITE_MS = 3000;

/**
 * Runs a js-behavior exercise and reports what happened.
 *
 * The deadline is not a nicety: a blocking loop occupies the frame's only
 * thread, so no message can ever arrive and the timeout is the ONLY signal
 * available. On expiry the frame is discarded through `resetSignal` rather than
 * interrupted, because an iframe cannot be interrupted from outside.
 */
export function useJsBehavior(cases: JsBehaviorCase[], limiteMs: number = LIMITE_MS) {
  const [estado, setEstado] = useState<EstadoJs>("inactivo");
  const [resultado, setResultado] = useState<JsRunOutcome | null>(null);
  const [harness, setHarness] = useState<string | undefined>(undefined);
  const [resetSignal, setResetSignal] = useState(0);

  const nonceRef = useRef("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // The listener and the deadline both need the CURRENT cases without being
  // re-created every time the array identity changes, so they read a ref. It is
  // written in an effect rather than during render, which React forbids.
  const casosRef = useRef(cases);
  useEffect(() => {
    casosRef.current = cases;
  }, [cases]);

  const cancelarTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    function alMensaje(ev: MessageEvent) {
      // The frame has an opaque origin, so ev.origin is the string "null" and
      // cannot identify the sender. The nonce is what matches a message to the
      // run waiting for it, and it also drops results from a superseded run.
      const outcome = interpretarMensaje(ev.data, nonceRef.current, casosRef.current);
      if (!outcome) return;
      cancelarTimer();
      setResultado(outcome);
      setEstado("listo");
    }

    window.addEventListener("message", alMensaje);
    return () => {
      window.removeEventListener("message", alMensaje);
      cancelarTimer();
    };
  }, [cancelarTimer]);

  const ejecutar = useCallback(
    (codigo: string) => {
      cancelarTimer();
      // A fresh nonce per run is what makes a late message from the previous run
      // identifiable as stale instead of being scored against these cases.
      const nonce = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      nonceRef.current = nonce;
      setResultado(null);
      setEstado("corriendo");
      setHarness(construirHarness(codigo, casosRef.current, nonce));

      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        // Invalidate the nonce first: if the loop ever finishes and posts, that
        // message must not overwrite the timeout the student was already shown.
        nonceRef.current = "";
        setResultado({ kind: "timeout" });
        setEstado("listo");
        setHarness(undefined);
        // Discard the frame and whatever is still spinning inside it.
        setResetSignal((s) => s + 1);
      }, limiteMs);
    },
    [cancelarTimer, limiteMs]
  );

  const puntaje: Puntaje | null = resultado ? puntuar(resultado) : null;

  return { estado, resultado, puntaje, harness, resetSignal, ejecutar };
}
