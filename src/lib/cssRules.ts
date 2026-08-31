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
const IDENTIFICADOR = /^-?[a-z_][a-z0-9_-]*$/i;

/**
 * Baja a minusculas SOLO lo que en CSS es case-insensible, y deja intacto lo que
 * no lo es.
 *
 * Antes se bajaba el selector entero con un `.toLowerCase()`, y eso plegaba tres
 * cosas que en CSS SI distinguen mayusculas. Medido con el grader:
 *
 *   `.Caja`          puntuaba 100 contra `.caja`     y no deberia
 *   `#Menu`          puntuaba 100 contra `#menu`     y no deberia
 *   `[href^="HTTPS"]` puntuaba 100 contra `"https"`  y no deberia
 *
 * En HTML el valor de los atributos `class` e `id` es case-sensible, y el valor
 * dentro de un selector de atributo tambien lo es salvo que se pida la bandera
 * `i`. Un alumno que escribia `.Caja` contra un `class="caja"` aprobaba con CSS
 * que el navegador NO matchea.
 *
 * Se sigue bajando, porque ahi CSS/HTML si ignoran la caja: nombres de etiqueta
 * (`DIV`), pseudo-clases y pseudo-elementos (`:HOVER`, `::BEFORE`) y el NOMBRE
 * del atributo (`[HREF]`).
 *
 * EL PRECIO, dicho de frente: HTML define un puñado de atributos legados cuyo
 * valor SI se matchea sin distinguir caja (`type`, `rel`, `method`, `lang`,
 * `target`, `media` y unos cuantos mas). Esta funcion los trata como sensibles,
 * asi que `[type="TEXT"]` deja de matchear `[type="text"]`. Se acepta a
 * conciencia: mantener esa lista a mano es exactamente la clase de dato que
 * deriva, y errar hacia ESTRICTO deja un falso negativo angosto en lugar de un
 * falso positivo que ensena mal. Medido: cero ejercicios del repo usan una
 * mayuscula en un valor de atributo, asi que hoy no afecta a ninguno.
 */
function normalizarCaja(selector: string): string {
  let out = "";
  let i = 0;
  while (i < selector.length) {
    const ch = selector[i];

    // El identificador de una clase o de un id conserva su caja.
    if (ch === "." || ch === "#") {
      const ident = selector.slice(i + 1).match(/^[-\w]+/);
      if (ident) {
        out += ch + ident[0];
        i += 1 + ident[0].length;
        continue;
      }
    }

    // Dentro de un corchete: el nombre del atributo y la bandera bajan, el valor no.
    if (ch === "[") {
      const fin = finDelCorchete(selector, i);
      if (fin === -1) {
        // Corchete sin cerrar: entrada malformada. Se deja el resto INTACTO en
        // lugar de bajarlo, porque plegar lo que no se pudo parsear cambiaba en
        // silencio la caja de las clases y los ids que venian despues, y eso
        // contradecia justo la garantia de esta funcion. Medido antes de este
        // arreglo: `[data-x #Menu` quedaba como `[data-x #menu`.
        out += selector.slice(i);
        break;
      }
      out += cajaDeAtributo(selector.slice(i, fin + 1));
      i = fin + 1;
      continue;
    }

    out += ch.toLowerCase();
    i++;
  }
  return out;
}

/**
 * Indice del `]` que CIERRA el corchete abierto en `desde`, saltando los que
 * viven dentro de comillas. Devuelve -1 si no hay cierre.
 *
 * Un `indexOf("]")` pelado no sirve: `[data-ids="a]b"]` es CSS valido y su primer
 * `]` esta ADENTRO del string. Cortar ahi partia el bloque al medio y el resto
 * caia en la rama que baja caracter por caracter, plegando en silencio la caja de
 * lo que venia despues. Medido antes de este arreglo: `[data-ids="a]B"]` quedaba
 * como `[data-ids="a]b"]`.
 *
 * Y respeta la barra de escape, porque una comilla escapada NO cierra el string.
 * Sin eso, `[data-x="a\"b"] #Menu` perdia el hilo del escaneo y terminaba
 * plegando el `#Menu`.
 */
function finDelCorchete(selector: string, desde: number): number {
  let comilla: string | null = null;
  for (let i = desde + 1; i < selector.length; i++) {
    const ch = selector[i];
    // Una barra invertida escapa al caracter siguiente, incluida la comilla que
    // cerraria el string. `[data-x="a\"b"]` es CSS valido y su comilla del medio
    // NO cierra nada. Sin esto, el escaneo perdia el hilo y devolvia -1.
    if (comilla && ch === "\\") {
      i++;
      continue;
    }
    if (comilla) {
      if (ch === comilla) comilla = null;
      continue;
    }
    if (ch === '"' || ch === "'") comilla = ch;
    else if (ch === "]") return i;
  }
  return -1;
}

/**
 * `[HREF^="HTTPS" I]` -> `[href^="HTTPS" i]`: baja el nombre del atributo y la
 * bandera, y no toca el valor.
 *
 * Se hace por ESTRUCTURA y no con una sola regex que modele el corchete entero, y
 * esa decision salio de la revision. La version anterior era todo-o-nada: si el
 * patron no matcheaba el bloque completo, `replace` devolvia el texto intacto y el
 * NOMBRE del atributo se escapaba del plegado en silencio. Medido, dos formas que
 * caian en ese agujero:
 *
 *   `[DATA-X="a\"b"]`  la comilla escapada rompia la alternativa "[^"]*",
 *                      asi que el nombre quedaba en MAYUSCULA y puntuaba 0
 *                      contra `[data-x="a\"b"]`, cuando el nombre NO distingue caja
 *   `[XML|Lang]`       el `|` de namespace no entra en `[\w-]+`, mismo agujero
 *
 * Perseguir esas formas de una en una era la respuesta equivocada: el problema no
 * era el patron, era que un patron que no matchea NO PLIEGA NADA. Ahora el nombre
 * se ubica como "todo lo que hay antes del primer `=`, menos el operador", sin
 * intentar entender el valor. Cualquier forma que no se modele sigue plegando el
 * nombre, que es la parte que siempre es case-insensible en HTML.
 */
function cajaDeAtributo(bloque: string): string {
  const interior = bloque.slice(1, -1);

  // El primer `=` marca el operador. Antes de el va el nombre, con el prefijo de
  // namespace incluido si lo hay: en `[xml|lang]` el `|` es parte del nombre, y en
  // `[a|=b]` es parte del operador. Los distingue estar pegado al `=`.
  const igual = interior.indexOf("=");
  if (igual === -1) {
    // Sin operador: todo el interior es el nombre. `[required]`, `[xml|lang]`.
    return `[${interior.toLowerCase()}]`;
  }

  const previo = interior[igual - 1] ?? "";
  const corte = "~|^$*".includes(previo) ? igual - 1 : igual;
  const nombre = interior.slice(0, corte);
  const resto = interior.slice(corte); // operador + valor + posible bandera

  // La bandera va SEPARADA por espacio. Exigirlo es lo que evita comerse la ultima
  // letra de un valor sin comillas terminado en i/s.
  const conBandera = resto.match(/^([\s\S]*?)(\s+[isIS])(\s*)$/);
  if (conBandera) {
    const [, cuerpo, bandera, cola] = conBandera;
    return `[${nombre.toLowerCase()}${cuerpo}${bandera.toLowerCase()}${cola}]`;
  }
  return `[${nombre.toLowerCase()}${resto}]`;
}

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
  // Se recorre a mano en lugar de con un `replace(/\[([^\]]*)\]/g)` porque ese
  // patron tambien cortaba en el primer `]`, aunque estuviera entre comillas.
  let out = "";
  let i = 0;
  while (i < selector.length) {
    if (selector[i] !== "[") {
      out += selector[i];
      i++;
      continue;
    }
    const fin = finDelCorchete(selector, i);
    if (fin === -1) {
      out += selector.slice(i);
      break;
    }
    out += unCorchete(selector.slice(i, fin + 1));
    i = fin + 1;
  }
  return out;
}

/** Canonicaliza UN solo `[...]`. Ver `normalizarAtributos`. */
function unCorchete(bloque: string): string {
  return bloque.replace(/^\[([\s\S]*)\]$/, (_b, interior: string) => {
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
 * `H1 , .Caja` -> ["h1", ".Caja"]. Whitespace inside a compound selector is
 * collapsed to one space so `.a   >   .b` and `.a > .b` are the same key, the
 * case is folded only where CSS folds it (ver `normalizarCaja`), y los selectores
 * de atributo se canonicalizan para que las comillas equivalentes sean una clave.
 */
function normalizarSelectores(prelude: string): string[] {
  return prelude
    .split(",")
    .map((s) => normalizarAtributos(normalizarCaja(s.trim().replace(/\s+/g, " "))))
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
 * Un valor que es UN COLOR y nada mas: hex, `rgb()/hsl()` o una sola palabra
 * -un color con nombre, `transparent`, `currentcolor`-.
 *
 * `var(...)` queda AFUERA a proposito, aunque casi siempre tenga un color
 * adentro: una custom property puede contener un degradado, y ahi las dos
 * propiedades dejan de ser lo mismo. Medido sobre el curriculum: 54 valores son
 * un color literal, 5 son `var()` y 2 son degradado o url.
 */
function esColorSolo(valor: string): boolean {
  const v = valor.trim();
  if (!v) return false;
  // `rgb()` y `hsl()` VAN PRIMERO: el normalizador deja `rgb(10, 20, 30)` con
  // espacios despues de las comas, asi que el chequeo de "sin espacios" de mas
  // abajo los descartaria por error. Se midio: daba 0 a un color perfectamente
  // valido.
  if (/^(rgb|hsl)a?\([^()]*\)$/.test(v)) return true;
  if (/\s/.test(v)) return false;                       // multiples valores
  if (/^#[0-9a-f]{3,8}$/.test(v)) return true;          // hex
  if (/^[a-z]+$/.test(v)) return true;                  // nombre, transparent, currentcolor
  return false;                                         // var(), gradient(), url()...
}

/**
 * Las OTRAS formas de escribir la MISMA declaracion.
 *
 * Hoy hay un solo par: `background: <color>` y `background-color: <color>`.
 * Con un color solo pintan exactamente igual -el atajo resetea imagen,
 * posicion y repeticion a sus valores iniciales, que es donde ya estaban- asi
 * que rechazar una de las dos es marcarle un error a CSS correcto.
 *
 * MEDIDO EL 2026-08-31, y por eso existe esto: 49 ejercicios castigaban al
 * alumno que elegia la otra propiedad. 12 esperaban el atajo y bajaban a
 * 78-91; 37 esperaban la especifica y bajaban hasta 0, porque los mini retos
 * son todo o nada. Un alumno que escribia `background: red` donde el ejercicio
 * queria `background-color: red` sacaba CERO con CSS impecable.
 *
 * LA REGLA ES ESTRICTA A PROPOSITO: solo con un color literal. Aceptar de mas
 * aca es aprobar CSS que no hace lo mismo, y eso es peor que rechazar CSS
 * valido.
 */
function equivalentesDe(declaracion: string): string[] {
  const i = declaracion.indexOf(":");
  if (i === -1) return [];
  const prop = declaracion.slice(0, i).trim();
  const valor = declaracion.slice(i + 1).trim();
  if (!esColorSolo(valor)) return [];
  if (prop === "background") return [`background-color: ${valor}`];
  if (prop === "background-color") return [`background: ${valor}`];
  return [];
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
      const hallada =
        presentes?.has(d) || equivalentesDe(d).some((alt) => presentes?.has(alt));
      if (hallada) encontradas++;
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
