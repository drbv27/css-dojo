/**
 * Minimal CSS parser used to grade exercises.
 *
 * Why this exists: exercises used to be graded with `includes`, a case-insensitive
 * substring search over the whole submission against loose tokens such as
 * `["display", "flex", "justify-content", "center"]`. Every one of them could be
 * passed by typing those words as prose -- `"no tengo idea de css p color blue"`
 * scored 100% -- and it could not tell which selector a declaration belonged to,
 * so swapping two rules' bodies also passed.
 *
 * Parsing instead of searching fixes both: prose yields zero rules, and each
 * declaration is keyed to its selector.
 *
 * Scope is deliberately small. This grades short teaching exercises, not
 * arbitrary stylesheets. It understands rules, selector lists, and nested
 * at-rules (`@media`, `@supports`, `@container`), which is what the curriculum
 * uses. It does not resolve the cascade, shorthands, or `@import`.
 */

/** A parsed stylesheet: selector key -> set of normalized declarations. */
export type ReglasCss = Map<string, Set<string>>;

function quitarComentarios(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

/**
 * A CSS identifier, which is what an UNQUOTED attribute value has to be.
 * `https` and `text` qualify; `mailto:` and `.pdf` do not.
 *
 * ASCII only, on purpose. CSS allows non-ASCII in an identifier, but a bare
 * (unquoted) accented attribute value never appears in this curriculum, and the
 * cost of being wrong here is one exercise grading strictly rather than
 * accepting something invalid.
 */
const IDENTIFICADOR = /^-?[a-z_][a-z0-9_-]*$/;

/**
 * `[ href ^= 'https' ]` -> `[href^="https"]`.
 *
 * Why this exists: the value of an attribute selector may be a string in either
 * quote style OR a bare identifier, and the three forms mean the same thing.
 * Keying them separately scored valid CSS as zero. Measured before the fix: a
 * student answering `[href^='https']` against a `[href^="https"]` target got 0%,
 * and so did `[href^=https]`. Three exercises graded that way, all in
 * `attribute-selectors`.
 *
 * A bare value that is NOT a valid identifier is deliberately left alone, so it
 * stays a distinct key and keeps failing. `[href^=mailto:]` is not valid CSS --
 * a colon cannot appear in an unquoted identifier -- and telling a student that
 * invalid CSS is correct is worse than rejecting valid CSS.
 *
 * The case-sensitivity flag survives, because `[a="b" i]` and `[a="b"]` really
 * are different selectors.
 */
function normalizarAtributos(selector: string): string {
  return selector.replace(/\[([^\]]*)\]/g, (bloque, interior: string) => {
    const solo = interior.trim();
    const m = solo.match(
      /^([\w-]+)\s*([~|^$*]?=)\s*(?:"([^"]*)"|'([^']*)'|([^\s"']+))\s*([is])?$/
    );
    // No value (`[required]`), or a shape this minimal parser does not model.
    if (!m) return /^[\w-]+$/.test(solo) ? `[${solo}]` : bloque;

    const [, atributo, operador, dobles, simples, desnudo, bandera] = m;
    let valor: string;
    if (dobles !== undefined) valor = dobles;
    else if (simples !== undefined) valor = simples;
    else if (IDENTIFICADOR.test(desnudo)) valor = desnudo;
    else return bloque; // invalid unquoted value: keep it distinct, keep it failing

    return `[${atributo}${operador}"${valor}"${bandera ? ` ${bandera}` : ""}]`;
  });
}

/**
 * `H1 , .Caja` -> ["h1", ".caja"]. Whitespace inside a compound selector is
 * collapsed to one space so `.a   >   .b` and `.a > .b` are the same key, and
 * attribute selectors are canonicalized so equivalent quoting is one key.
 */
function normalizarSelectores(prelude: string): string[] {
  return prelude
    .split(",")
    .map((s) => normalizarAtributos(s.trim().toLowerCase().replace(/\s+/g, " ")))
    .filter(Boolean);
}

/**
 * `  COLOR :   red ` -> `color: red`. Internal spaces in a value are preserved
 * as single spaces, so `padding: 10px 20px` keeps its two components distinct.
 */
function normalizarDeclaracion(texto: string): string | null {
  const i = texto.indexOf(":");
  if (i === -1) return null;
  const prop = texto.slice(0, i).trim().toLowerCase();
  const valor = texto
    .slice(i + 1)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/\s*,\s*/g, ", ");
  if (!prop || !valor) return null;
  return `${prop}: ${valor}`;
}

function declaracionesDe(cuerpo: string): string[] {
  return cuerpo
    .split(";")
    .map(normalizarDeclaracion)
    .filter((d): d is string => d !== null);
}

/**
 * Splits `prelude { body }` blocks at the current nesting level, tracking brace
 * depth so a nested at-rule body is returned whole rather than cut at its first
 * inner `}`.
 */
function bloquesDe(css: string): Array<{ prelude: string; cuerpo: string }> {
  const bloques: Array<{ prelude: string; cuerpo: string }> = [];
  let prelude = "";
  let cuerpo = "";
  let profundidad = 0;

  for (const ch of css) {
    if (ch === "{") {
      profundidad++;
      if (profundidad === 1) continue; // opening the block: prelude is complete
    } else if (ch === "}") {
      profundidad--;
      if (profundidad === 0) {
        bloques.push({ prelude: prelude.trim(), cuerpo });
        prelude = "";
        cuerpo = "";
        continue;
      }
      if (profundidad < 0) return bloques; // unbalanced input, stop cleanly
    }
    if (profundidad === 0) prelude += ch;
    else cuerpo += ch;
  }

  return bloques;
}

function acumular(reglas: ReglasCss, clave: string, decls: string[]): void {
  if (decls.length === 0) return;
  const set = reglas.get(clave) ?? new Set<string>();
  for (const d of decls) set.add(d);
  reglas.set(clave, set);
}

function parsearEn(css: string, contexto: string, reglas: ReglasCss): void {
  for (const { prelude, cuerpo } of bloquesDe(css)) {
    if (!prelude) continue;

    // Nested at-rule: recurse, carrying the condition into the key so a
    // declaration inside `@media (max-width: 600px)` is not confused with the
    // same declaration outside it.
    if (prelude.startsWith("@") && cuerpo.includes("{")) {
      const condicion = prelude.toLowerCase().replace(/\s+/g, " ");
      parsearEn(cuerpo, contexto ? `${contexto} ${condicion}` : condicion, reglas);
      continue;
    }

    // At-rule with a flat body (`@font-face`, `@keyframes` step): key it whole.
    if (prelude.startsWith("@")) {
      const clave = `${contexto ? contexto + " " : ""}${prelude
        .toLowerCase()
        .replace(/\s+/g, " ")}`;
      acumular(reglas, clave, declaracionesDe(cuerpo));
      continue;
    }

    const decls = declaracionesDe(cuerpo);
    for (const sel of normalizarSelectores(prelude)) {
      acumular(reglas, contexto ? `${contexto} | ${sel}` : sel, decls);
    }
  }
}

/**
 * Parses a stylesheet into selector -> declarations.
 *
 * Returns an EMPTY map for input containing no rules, which is what makes prose
 * ungradeable: `parseCssRules("display flex center").size === 0`.
 */
export function parseCssRules(css: string): ReglasCss {
  const reglas: ReglasCss = new Map();
  if (!css) return reglas;
  parsearEn(quitarComentarios(css), "", reglas);
  return reglas;
}

/**
 * Grades `enviado` against `esperado`, both raw CSS. Score is the share of
 * expected declarations found under their own selector, so partial work earns
 * partial credit exactly as the old validator did.
 */
export function compararReglas(
  esperado: string,
  enviado: string
): { correct: boolean; score: number; faltantes: string[] } {
  const esp = parseCssRules(esperado);
  const env = parseCssRules(enviado);

  let total = 0;
  let encontradas = 0;
  const faltantes: string[] = [];

  for (const [selector, decls] of esp) {
    const presentes = env.get(selector);
    for (const d of decls) {
      total++;
      if (presentes?.has(d)) encontradas++;
      else faltantes.push(`${selector} { ${d} }`);
    }
  }

  if (total === 0) return { correct: false, score: 0, faltantes };
  return {
    correct: encontradas === total,
    score: Math.round((encontradas / total) * 100),
    faltantes,
  };
}
