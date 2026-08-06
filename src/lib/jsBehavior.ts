import type { JsBehaviorCase, JsCaseOutcome, JsRunOutcome } from "@/types";

/**
 * Behavioral grading for JavaScript exercises.
 *
 * Grades what the submission DOES, not how it is written. The submission runs in
 * a Web Worker and reports one observation per declared case; this module builds
 * that harness and interprets what comes back.
 *
 * It runs in a WORKER and not in the preview iframe, and that was measured, not
 * assumed. A srcdoc iframe shares its thread with the page, so `while (true)` in
 * a submission froze React, the deadline and the whole tab -- see
 * e2e/js-behavior-worker.spec.ts. A worker has its own thread and `terminate()`
 * genuinely kills a spinning one.
 *
 * Everything here is pure and browser-free on purpose. The comparison in
 * particular lives HERE rather than inside the injected script, so it is
 * reachable from unit tests instead of only from an end-to-end run.
 *
 * What this cannot do, by design:
 * - It does not stop a student from reading `expect` in the module data and
 *   hardcoding a return. Expectations are client-side data, the same limitation
 *   `targetCSS` already has. Closing it needs server-side execution.
 * - It does not detect an infinite loop by itself. A blocking loop means no
 *   message ever arrives, so the caller's deadline is what notices -- and then
 *   `terminate()` actually stops it, which is the whole reason for the worker.
 */

/** Wire format posted by the harness. Never trust its shape: it crosses a thread boundary. */
export interface MensajeCrudo {
  fuente: "js-behavior";
  nonce: string;
  resultado:
    | { kind: "syntax-error"; message: string }
    | { kind: "ok"; observaciones: Observacion[] };
}

/** What the harness saw for one case, already reduced to transportable data. */
export type Observacion =
  | { estado: "valor"; json: string }
  | { estado: "no-definido"; identifier: string }
  | { estado: "error"; message: string }
  | { estado: "no-serializable" };

export interface CasoInvalido {
  indice: number;
  razon: string;
}

// ==================== Authoring validation ====================

/**
 * Rejects malformed authored data before it can produce a misleading grade.
 *
 * `call` has to be a single expression because it gets embedded inside a
 * `return [...]` list. This is a sanity check on content the project itself
 * authors, NOT a security boundary — the sandbox is the boundary.
 */
export function validarCasos(cases: unknown): CasoInvalido[] {
  if (!Array.isArray(cases) || cases.length === 0) {
    return [{ indice: -1, razon: "se requiere al menos un caso" }];
  }

  const problemas: CasoInvalido[] = [];

  cases.forEach((caso, indice) => {
    if (typeof caso !== "object" || caso === null) {
      problemas.push({ indice, razon: "el caso no es un objeto" });
      return;
    }

    const { call, expect } = caso as Partial<JsBehaviorCase>;

    if (typeof call !== "string" || call.trim() === "") {
      problemas.push({ indice, razon: "`call` debe ser una expresion no vacia" });
    } else if (/[;{}]/.test(call)) {
      problemas.push({
        indice,
        razon: "`call` debe ser UNA expresion: sin `;`, `{` ni `}`",
      });
    } else if (!parentesisBalanceados(call)) {
      problemas.push({ indice, razon: "`call` tiene parentesis sin cerrar" });
    }

    // `undefined` no se distingue de "falta la clave" al serializar, asi que se
    // exige explicito: un caso sin expectativa no puede fallar nunca.
    if (!("expect" in (caso as object))) {
      problemas.push({ indice, razon: "falta `expect`" });
    } else if (!esSerializable(expect)) {
      problemas.push({ indice, razon: "`expect` no es serializable" });
    }
  });

  return problemas;
}

function parentesisBalanceados(texto: string): boolean {
  let abiertos = 0;
  for (const c of texto) {
    if (c === "(") abiertos++;
    else if (c === ")") {
      abiertos--;
      if (abiertos < 0) return false;
    }
  }
  return abiertos === 0;
}

function esSerializable(valor: unknown): boolean {
  try {
    JSON.stringify(valor);
    return typeof valor !== "function";
  } catch {
    return false;
  }
}

// ==================== Harness ====================

/**
 * Builds the script that runs inside the iframe.
 *
 * The submission is embedded as DATA and evaluated inside a single
 * `new Function`, rather than being loaded as separate code.
 *
 * That is not a stylistic choice. In a classic script, a top-level `function`
 * declaration becomes a global and would be reachable, but a top-level `const`
 * or `let` goes to script scope and is NOT visible from a separately-constructed
 * `new Function`. A student writing `const sumar = (a, b) => a + b` would look
 * undefined to the grader while working perfectly in the preview. Evaluating the
 * submission and the cases in the same function body removes that whole class of
 * false negative.
 */
export function construirHarness(
  codigo: string,
  cases: JsBehaviorCase[],
  nonce: string
): string {
  const evaluaciones = cases
    .map(
      (caso) => `(function () {
      try { return { estado: "valor", valor: (${caso.call}) }; }
      catch (e) { return { estado: "excepcion", nombre: (e && e.name) || "", mensaje: String((e && e.message) || e) }; }
    })()`
    )
    .join(",\n    ");

  return `(function () {
  var NONCE = ${JSON.stringify(nonce)};
  var CODIGO = ${JSON.stringify(codigo)};

  function avisar(resultado) {
    self.postMessage({ fuente: "js-behavior", nonce: NONCE, resultado: resultado });
  }

  var corridas;
  try {
    // El codigo del alumno y los casos comparten cuerpo, asi que const y let
    // declarados arriba quedan visibles para las expresiones de abajo.
    corridas = new Function(CODIGO + "\\n;return [\\n    " + ${JSON.stringify(evaluaciones)} + "\\n  ];")();
  } catch (e) {
    // new Function lanza SyntaxError al construirse, antes de ejecutar nada.
    avisar({ kind: "syntax-error", message: String((e && e.message) || e) });
    return;
  }

  var observaciones = corridas.map(function (r) {
    if (r.estado === "excepcion") {
      if (r.nombre === "ReferenceError") {
        var m = /^(\\w+) is not defined/.exec(r.mensaje);
        return { estado: "no-definido", identifier: m ? m[1] : "" };
      }
      return { estado: "error", message: r.mensaje };
    }
    try {
      var json = JSON.stringify(r.valor);
      if (json === undefined || typeof r.valor === "function") {
        return { estado: "no-serializable" };
      }
      return { estado: "valor", json: json };
    } catch (e) {
      return { estado: "no-serializable" };
    }
  });

  avisar({ kind: "ok", observaciones: observaciones });
})();`;
}

// ==================== Interpretation ====================

/**
 * Turns a raw message into a run outcome, or null when the message is not ours.
 *
 * Returns null rather than throwing for anything unexpected. The frame has an
 * opaque origin, so `event.origin` arrives as the string "null" and cannot
 * identify the sender; the nonce is what matches a message to the run waiting
 * for it, and it also drops late results from a superseded run.
 */
export function interpretarMensaje(
  raw: unknown,
  nonce: string,
  cases: JsBehaviorCase[]
): JsRunOutcome | null {
  if (typeof raw !== "object" || raw === null) return null;

  const mensaje = raw as Partial<MensajeCrudo>;
  if (mensaje.fuente !== "js-behavior") return null;
  if (typeof mensaje.nonce !== "string" || mensaje.nonce !== nonce) return null;

  const resultado = mensaje.resultado;
  if (typeof resultado !== "object" || resultado === null) return null;

  if (resultado.kind === "syntax-error") {
    const message =
      typeof resultado.message === "string" ? resultado.message : "error de sintaxis";
    return { kind: "syntax-error", message };
  }

  if (resultado.kind !== "ok" || !Array.isArray(resultado.observaciones)) return null;
  // Una cantidad distinta de observaciones significa que el harness y los casos
  // no son del mismo run: no se puede puntuar sin emparejarlos.
  if (resultado.observaciones.length !== cases.length) return null;

  const outcomes = resultado.observaciones.map((obs, i) =>
    interpretarObservacion(obs, cases[i].expect)
  );

  return { kind: "ok", cases: outcomes };
}

function interpretarObservacion(obs: unknown, esperado: unknown): JsCaseOutcome {
  if (typeof obs !== "object" || obs === null) {
    return { kind: "runtime-error", message: "observacion malformada" };
  }

  const o = obs as Observacion;

  switch (o.estado) {
    case "no-definido":
      return { kind: "not-defined", identifier: typeof o.identifier === "string" ? o.identifier : "" };
    case "error":
      return { kind: "runtime-error", message: typeof o.message === "string" ? o.message : "" };
    case "no-serializable":
      return { kind: "unserializable" };
    case "valor": {
      if (typeof o.json !== "string") {
        return { kind: "runtime-error", message: "observacion malformada" };
      }
      let observado: unknown;
      try {
        observado = JSON.parse(o.json);
      } catch {
        return { kind: "runtime-error", message: "observacion malformada" };
      }
      return sonIguales(observado, esperado) ? { kind: "pass" } : { kind: "fail", observed: observado };
    }
    default:
      return { kind: "runtime-error", message: "observacion malformada" };
  }
}

// ==================== Comparison ====================

/**
 * Deep structural equality with NO type coercion: `"3"` does not equal `3`.
 *
 * The strictness is pedagogical. A student whose function returns a string where
 * a number was asked for has a real bug, and a validator that accepts it teaches
 * them the bug is fine.
 */
export function sonIguales(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  // NaN === NaN is false, but two NaN observations are the same result.
  if (typeof a === "number" && typeof b === "number") {
    return Number.isNaN(a) && Number.isNaN(b);
  }
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return false;
  if (typeof a !== "object") return false;

  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    return a.every((item, i) => sonIguales(item, b[i]));
  }

  const ca = a as Record<string, unknown>;
  const cb = b as Record<string, unknown>;
  const clavesA = Object.keys(ca);
  const clavesB = Object.keys(cb);
  if (clavesA.length !== clavesB.length) return false;
  return clavesA.every(
    (clave) => Object.prototype.hasOwnProperty.call(cb, clave) && sonIguales(ca[clave], cb[clave])
  );
}

// ==================== Scoring ====================

export interface Puntaje {
  score: number;
  correct: boolean;
  /** Indices of the cases that did not pass, for pointing the student at them. */
  fallidos: number[];
}

/**
 * Share of cases that passed, rounded, so partial work earns partial credit the
 * same way `compararReglas` does for CSS.
 *
 * A run-level failure scores 0: a syntax error or a timeout produced no evidence
 * that anything works, which is different from failing some cases.
 */
export function puntuar(outcome: JsRunOutcome): Puntaje {
  if (outcome.kind !== "ok") {
    return { score: 0, correct: false, fallidos: [] };
  }

  const fallidos = outcome.cases
    .map((c, i) => (c.kind === "pass" ? -1 : i))
    .filter((i) => i >= 0);

  const total = outcome.cases.length;
  if (total === 0) return { score: 0, correct: false, fallidos: [] };

  const pasados = total - fallidos.length;
  return {
    score: Math.round((pasados / total) * 100),
    correct: fallidos.length === 0,
    fallidos,
  };
}
