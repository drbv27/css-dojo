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
 * `Georgia, "Times New Roman", serif` y `Georgia, Times New Roman, serif` son
 * la MISMA pila de fuentes, pero antes de este arreglo no puntuaban igual: la
 * comilla quedaba adentro de la clave de comparacion.
 *
 * Lo reporto un alumno de `tipografia-web`: escribio la pila sin comillas,
 * CSS valido, y el grader le dijo "Incorrecto". Medido con `compararReglas`
 * sobre los 5 ejercicios del curriculum que comillan un `font-family` en su
 * target: los 5 fallaban igual sin comillas que con comilla simple --
 * `32-ej-02` (67), `32-ej-05` (67), `32-ej-06` (75), `32-ej-08` (71),
 * `32-ej-reto` (80).
 *
 * Por eso esto vive ACA, acotado a `font-family`, y no en un strip global de
 * comillas sobre el valor: `normalizarDeclaracion` descarta la declaracion si
 * el valor queda vacio, y un strip global se come `content: ""`. Medido: en
 * `pseudo-elementos` el ejercicio `08-ej-06` pasa de 6 a 5 declaraciones
 * esperadas y `08-ej-reto` de 11 a 10 -y `08-ej-reto` es mini-reto, todo o
 * nada, asi que el alumno aprobaria sin escribir `content: ""`- un falso
 * negativo angosto cambiado por un falso positivo que ensena mal.
 *
 * La regla, familia por familia (ya separadas por `, `): se le sacan las
 * comillas SOLO SI la forma sin comillas es CSS valida -cada palabra separada
 * por espacio tiene que ser un identificador (`IDENTIFICADOR`), el mismo
 * criterio que ya usa `unCorchete` para el valor de un selector de atributo-.
 * Si no es valida sin comillas (`"2toons"`, que arranca con un digito, o una
 * cadena vacia `""`), se deja EXACTAMENTE como esta: la clave sigue distinta y
 * sigue fallando. Aceptar CSS invalido es peor que rechazar CSS valido, la
 * misma decision que ya toman `unCorchete` y `canonizarDeclaracion` -- esta
 * ultima con `esColorSolo`, que es lo que impide que `background` se pliegue
 * sobre `background-color` cuando el valor no es un color literal.
 *
 * SEGUNDA VUELTA, medida sobre el arbol con el arreglo de arriba ya puesto:
 * una generica o una palabra clave global ENTRE COMILLAS tambien es un
 * identificador valido -"serif" cumple `IDENTIFICADOR` letra por letra- y la
 * primera version las desnudaba igual que a "Poppins". Eso esta mal: en CSS
 * `font-family: serif` (sin comillas) es LA familia generica, pero
 * `font-family: "serif"` (con comillas) es una familia que se LLAMA "serif",
 * dos cosas distintas. Lo mismo pasa con las palabras clave globales:
 * `inherit` sin comillas es la palabra clave, `"inherit"` es un nombre de
 * fuente literal. Desnudar cualquiera de las dos cambia lo que el CSS hace, y
 * es EXACTAMENTE el error que la leccion existe para prevenir -el hint de
 * `32-ej-02` dice "la generica va ultima, siempre sin comillas"-. Por eso
 * estos dos grupos quedan afuera de la desnudada aunque sean identificadores
 * validos: comillados, la clave tiene que seguir siendo distinta y seguir
 * fallando, igual que `"2toons"`.
 */
const GENERICAS_Y_PALABRAS_CLAVE = new Set([
  // Familias genericas (CSS Fonts Module).
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "fantasy",
  "system-ui",
  "ui-serif",
  "ui-sans-serif",
  "ui-monospace",
  "ui-rounded",
  "math",
  "emoji",
  "fangsong",
  // Palabras clave CSS globales, validas en cualquier propiedad.
  "inherit",
  "initial",
  "unset",
  "revert",
  "revert-layer",
]);

function normalizarFontFamily(valor: string): string {
  return valor
    .split(", ")
    .map((familia) => {
      const comilla = familia[0];
      if (
        (comilla !== '"' && comilla !== "'") ||
        familia[familia.length - 1] !== comilla ||
        familia.length < 2
      ) {
        return familia; // no viene entre comillas: ya es la forma canonica
      }
      const interior = familia.slice(1, -1);
      if (GENERICAS_Y_PALABRAS_CLAVE.has(interior)) return familia; // ver comentario de arriba
      const palabras = interior.split(" ");
      const validaSinComillas =
        interior.length > 0 && palabras.every((p) => IDENTIFICADOR.test(p));
      return validaSinComillas ? interior : familia;
    })
    .join(", ");
}

/**
 * `  COLOR :   red ` -> `color: red`. Internal spaces in a value are preserved
 * as single spaces, so `padding: 10px 20px` keeps its two components distinct.
 */
function normalizarDeclaracion(texto: string): string | null {
  const i = texto.indexOf(":");
  if (i === -1) return null;
  const prop = texto.slice(0, i).trim().toLowerCase();
  let valor = texto
    .slice(i + 1)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/\s*,\s*/g, ", ");
  if (prop === "font-family") valor = normalizarFontFamily(valor);
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
 * CANONICALIZACION DE DECLARACIONES: las OTRAS formas de escribir lo mismo.
 *
 * `normalizarDeclaracion` deja la declaracion en una forma estable -minusculas,
 * espacios, comas, comillas de `font-family`- pero sigue comparando CADENAS. Y
 * CSS tiene muchas maneras de escribir exactamente el mismo estilo: `padding:
 * 16px` y `padding: 16px 16px 16px 16px`, `border: 1px solid red` y `border:
 * solid 1px red`, `#fff` y `#ffffff`, `bold` y `700`. Comparar cadenas las
 * rechaza todas.
 *
 * MEDIDO EL 2026-09-18 corriendo el corrector real sobre los 652 ejercicios de
 * css/js/html: 71 de los 120 ejercicios `css-rules` rechazaban al menos una
 * forma equivalente, con 157 rechazos en total. TRECE de esos son mini retos,
 * que puntuan cien o cero: ahi una sola declaracion escrita en su otra forma
 * valida no bajaba el puntaje, lo borraba. Informe en `informes/ejercicios.md`.
 *
 * COMO SE APLICA, y por que asi: `compararReglas` prueba PRIMERO la igualdad
 * exacta y solo despues la canonica. La forma canonica unicamente AGREGA
 * aceptaciones, nunca quita ninguna, asi que ningun alumno que antes sacaba 100
 * puede sacar menos por esto.
 *
 * EL LIMITE, que es el mismo de siempre: se acepta lo EQUIVALENTE, nunca lo
 * INVALIDO. Un grader que aprueba CSS invalido le ensena algo falso al alumno y
 * lo descubre recien cuando no le funciona en el navegador. Cada regla de abajo
 * falla CERRADA: si no puede probar que las dos formas hacen lo mismo, deja la
 * declaracion como estaba y la comparacion sigue siendo estricta.
 */

/**
 * Palabras clave validas en CUALQUIER propiedad. Tienen que ir solas, asi que
 * bloquean la expansion de un shorthand: `padding: inherit` es valido y
 * `padding: inherit inherit inherit inherit` no lo es.
 */
const PALABRAS_CLAVE_GLOBALES = new Set([
  "inherit",
  "initial",
  "unset",
  "revert",
  "revert-layer",
]);

/**
 * Propiedades de CAJA que aceptan de 1 a 4 valores y los reparten por los
 * cuatro lados. Expandirlas a sus cuatro valores vuelve identicas todas sus
 * escrituras: `16px`, `16px 16px`, `16px 16px 16px` y `16px 16px 16px 16px`.
 */
const CAJA_CUATRO_VALORES = new Set([
  "margin",
  "padding",
  "inset",
  "border-width",
  "border-style",
  "border-color",
  "border-radius",
  "scroll-margin",
  "scroll-padding",
]);

/** Propiedades de caja que reparten 1 o 2 valores sobre un solo eje. */
const CAJA_DOS_VALORES = new Set([
  "gap",
  "overflow",
  "margin-inline",
  "margin-block",
  "padding-inline",
  "padding-block",
  "inset-inline",
  "inset-block",
  "scroll-margin-inline",
  "scroll-margin-block",
  "scroll-padding-inline",
  "scroll-padding-block",
]);

/**
 * Atajos cuyos tres componentes -ancho, estilo y color- NO tienen orden fijo.
 * `border: 1px solid red` y `border: solid red 1px` son la misma declaracion.
 */
const ATAJOS_DE_LINEA = new Set([
  "border",
  "border-top",
  "border-right",
  "border-bottom",
  "border-left",
  "border-inline",
  "border-block",
  "border-inline-start",
  "border-inline-end",
  "border-block-start",
  "border-block-end",
  "outline",
  "column-rule",
]);

/**
 * Propiedades donde un `0` suelto SOLO puede ser una longitud, y por lo tanto
 * `0` y `0px` son el mismo valor.
 *
 * La lista es corta a proposito. `opacity`, `z-index`, `line-height`,
 * `flex-grow`, `flex-shrink` y `order` NO estan, y no pueden estar: ahi el `0`
 * es un numero y `0px` es directamente invalido. Aceptarlo seria aprobar CSS
 * que el navegador descarta.
 */
const LONGITUD_PURA = new Set([
  ...CAJA_CUATRO_VALORES,
  ...CAJA_DOS_VALORES,
  ...ATAJOS_DE_LINEA,
  "top",
  "right",
  "bottom",
  "left",
  // Los lados sueltos. Estaban `margin` y `padding` pero no `margin-top`, y esa
  // asimetria dejaba un rechazo vivo en `25-ej-02`: medido, no supuesto.
  "margin-top",
  "margin-right",
  "margin-bottom",
  "margin-left",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "margin-inline-start",
  "margin-inline-end",
  "margin-block-start",
  "margin-block-end",
  "padding-inline-start",
  "padding-inline-end",
  "padding-block-start",
  "padding-block-end",
  "inset-inline-start",
  "inset-inline-end",
  "inset-block-start",
  "inset-block-end",
  "width",
  "height",
  "min-width",
  "min-height",
  "max-width",
  "max-height",
  "row-gap",
  "column-gap",
  "border-top-width",
  "border-right-width",
  "border-bottom-width",
  "border-left-width",
  "outline-width",
  "outline-offset",
  "text-indent",
  "letter-spacing",
  "word-spacing",
  "box-shadow",
  "text-shadow",
]);

/** Propiedades cuyo valor puede llevar un color con nombre. Ver `canonizarColor`. */
const LLEVAN_COLOR = new Set([
  ...ATAJOS_DE_LINEA,
  "color",
  "background",
  "background-color",
  "border-color",
  "border-top-color",
  "border-right-color",
  "border-bottom-color",
  "border-left-color",
  "outline-color",
  "column-rule-color",
  "text-decoration",
  "text-decoration-color",
  "caret-color",
  "box-shadow",
  "text-shadow",
  "fill",
  "stroke",
]);

/** Estilos de linea (`border-style`), para clasificar los tokens de un atajo. */
const ESTILOS_DE_LINEA = new Set([
  "none",
  "hidden",
  "dotted",
  "dashed",
  "solid",
  "double",
  "groove",
  "ridge",
  "inset",
  "outset",
]);

/** Anchos con nombre (`border-width`), para lo mismo. */
const ANCHOS_CON_NOMBRE = new Set(["thin", "medium", "thick"]);

/** Una longitud cero con unidad: `0px`, `0rem`, `0vh`. `0%` NO, ver `canonizarCero`. */
const CERO_CON_UNIDAD =
  /^0(px|em|rem|ex|ch|vh|vw|vmin|vmax|cm|mm|in|pt|pc|q)$/;

/** Un numero con unidad de longitud, o un cero pelado: sirve de ancho en un atajo. */
const ES_LONGITUD = /^-?(\d+(\.\d+)?|\.\d+)(px|em|rem|ex|ch|vh|vw|vmin|vmax|cm|mm|in|pt|pc|q|%)?$/;

/**
 * Los 148 colores con nombre de CSS y su hex.
 *
 * NO se escribio de memoria. Se genero desde `color-name` y se contrasto entera
 * contra la tabla independiente de Three.js: 148 nombres cada una, CERO
 * discrepancias. Importa que sea exacta, porque una entrada equivocada no
 * rechaza de mas: aprueba un color que no es el pedido, que es el error caro.
 *
 * Un nombre que no este aca se deja intacto y no gana equivalencia, que es el
 * modo correcto de fallar.
 */
const COLORES_CON_NOMBRE: Record<string, string> = {
  aliceblue: "#f0f8ff",
  antiquewhite: "#faebd7",
  aqua: "#00ffff",
  aquamarine: "#7fffd4",
  azure: "#f0ffff",
  beige: "#f5f5dc",
  bisque: "#ffe4c4",
  black: "#000000",
  blanchedalmond: "#ffebcd",
  blue: "#0000ff",
  blueviolet: "#8a2be2",
  brown: "#a52a2a",
  burlywood: "#deb887",
  cadetblue: "#5f9ea0",
  chartreuse: "#7fff00",
  chocolate: "#d2691e",
  coral: "#ff7f50",
  cornflowerblue: "#6495ed",
  cornsilk: "#fff8dc",
  crimson: "#dc143c",
  cyan: "#00ffff",
  darkblue: "#00008b",
  darkcyan: "#008b8b",
  darkgoldenrod: "#b8860b",
  darkgray: "#a9a9a9",
  darkgreen: "#006400",
  darkgrey: "#a9a9a9",
  darkkhaki: "#bdb76b",
  darkmagenta: "#8b008b",
  darkolivegreen: "#556b2f",
  darkorange: "#ff8c00",
  darkorchid: "#9932cc",
  darkred: "#8b0000",
  darksalmon: "#e9967a",
  darkseagreen: "#8fbc8f",
  darkslateblue: "#483d8b",
  darkslategray: "#2f4f4f",
  darkslategrey: "#2f4f4f",
  darkturquoise: "#00ced1",
  darkviolet: "#9400d3",
  deeppink: "#ff1493",
  deepskyblue: "#00bfff",
  dimgray: "#696969",
  dimgrey: "#696969",
  dodgerblue: "#1e90ff",
  firebrick: "#b22222",
  floralwhite: "#fffaf0",
  forestgreen: "#228b22",
  fuchsia: "#ff00ff",
  gainsboro: "#dcdcdc",
  ghostwhite: "#f8f8ff",
  gold: "#ffd700",
  goldenrod: "#daa520",
  gray: "#808080",
  green: "#008000",
  greenyellow: "#adff2f",
  grey: "#808080",
  honeydew: "#f0fff0",
  hotpink: "#ff69b4",
  indianred: "#cd5c5c",
  indigo: "#4b0082",
  ivory: "#fffff0",
  khaki: "#f0e68c",
  lavender: "#e6e6fa",
  lavenderblush: "#fff0f5",
  lawngreen: "#7cfc00",
  lemonchiffon: "#fffacd",
  lightblue: "#add8e6",
  lightcoral: "#f08080",
  lightcyan: "#e0ffff",
  lightgoldenrodyellow: "#fafad2",
  lightgray: "#d3d3d3",
  lightgreen: "#90ee90",
  lightgrey: "#d3d3d3",
  lightpink: "#ffb6c1",
  lightsalmon: "#ffa07a",
  lightseagreen: "#20b2aa",
  lightskyblue: "#87cefa",
  lightslategray: "#778899",
  lightslategrey: "#778899",
  lightsteelblue: "#b0c4de",
  lightyellow: "#ffffe0",
  lime: "#00ff00",
  limegreen: "#32cd32",
  linen: "#faf0e6",
  magenta: "#ff00ff",
  maroon: "#800000",
  mediumaquamarine: "#66cdaa",
  mediumblue: "#0000cd",
  mediumorchid: "#ba55d3",
  mediumpurple: "#9370db",
  mediumseagreen: "#3cb371",
  mediumslateblue: "#7b68ee",
  mediumspringgreen: "#00fa9a",
  mediumturquoise: "#48d1cc",
  mediumvioletred: "#c71585",
  midnightblue: "#191970",
  mintcream: "#f5fffa",
  mistyrose: "#ffe4e1",
  moccasin: "#ffe4b5",
  navajowhite: "#ffdead",
  navy: "#000080",
  oldlace: "#fdf5e6",
  olive: "#808000",
  olivedrab: "#6b8e23",
  orange: "#ffa500",
  orangered: "#ff4500",
  orchid: "#da70d6",
  palegoldenrod: "#eee8aa",
  palegreen: "#98fb98",
  paleturquoise: "#afeeee",
  palevioletred: "#db7093",
  papayawhip: "#ffefd5",
  peachpuff: "#ffdab9",
  peru: "#cd853f",
  pink: "#ffc0cb",
  plum: "#dda0dd",
  powderblue: "#b0e0e6",
  purple: "#800080",
  rebeccapurple: "#663399",
  red: "#ff0000",
  rosybrown: "#bc8f8f",
  royalblue: "#4169e1",
  saddlebrown: "#8b4513",
  salmon: "#fa8072",
  sandybrown: "#f4a460",
  seagreen: "#2e8b57",
  seashell: "#fff5ee",
  sienna: "#a0522d",
  silver: "#c0c0c0",
  skyblue: "#87ceeb",
  slateblue: "#6a5acd",
  slategray: "#708090",
  slategrey: "#708090",
  snow: "#fffafa",
  springgreen: "#00ff7f",
  steelblue: "#4682b4",
  tan: "#d2b48c",
  teal: "#008080",
  thistle: "#d8bfd8",
  tomato: "#ff6347",
  turquoise: "#40e0d0",
  violet: "#ee82ee",
  wheat: "#f5deb3",
  white: "#ffffff",
  whitesmoke: "#f5f5f5",
  yellow: "#ffff00",
  yellowgreen: "#9acd32",
};

/**
 * Parte un valor por sus espacios de PRIMER NIVEL, sin entrar en parentesis ni
 * en comillas: `0 4px rgba(0, 0, 0, 0.1)` son tres tokens, no cinco.
 *
 * Devuelve `null` si las comillas o los parentesis quedan sin cerrar, para que
 * quien llama deje el valor como estaba en vez de canonizar algo mal partido.
 */
function tokenizarValor(valor: string): string[] | null {
  const tokens: string[] = [];
  let actual = "";
  let profundidad = 0;
  let comilla: string | null = null;

  for (let i = 0; i < valor.length; i++) {
    const c = valor[i];
    if (comilla) {
      actual += c;
      if (c === "\\") {
        if (i + 1 < valor.length) actual += valor[++i];
      } else if (c === comilla) {
        comilla = null;
      }
      continue;
    }
    if (c === '"' || c === "'") {
      comilla = c;
      actual += c;
      continue;
    }
    if (c === "(") profundidad++;
    if (c === ")") profundidad--;
    if (c === " " && profundidad === 0) {
      if (actual) tokens.push(actual);
      actual = "";
      continue;
    }
    actual += c;
  }
  if (comilla || profundidad !== 0) return null;
  if (actual) tokens.push(actual);
  return tokens;
}

/**
 * Unifica el CARACTER de comilla de cada string a `"`, sin sacarla nunca.
 *
 * Sacarla estaria mal y ya se midio por que: `content: ""` desaparece si se
 * desnuda -`normalizarDeclaracion` descarta la declaracion de valor vacio- y
 * `08-ej-06` bajaba de 6 declaraciones esperadas a 5. Aca solo cambia el
 * caracter, asi que `content: ''` y `content: ""` se encuentran y `content: ""`
 * sigue existiendo.
 *
 * Un string que ya contiene una comilla doble o una barra de escape se deja
 * como esta: reescribirlo cambiaria el escapado, y eso ya no es la misma cadena.
 */
function canonizarComillas(valor: string): string {
  return valor.replace(/'([^'\\"]*)'/g, '"$1"');
}

/** `#fff` -> `#ffffff` y `#ffff` -> `#ffffffff`. Un hex es un color en cualquier propiedad. */
function canonizarHex(token: string): string {
  const m = /^#([0-9a-f]{3,4})$/.exec(token);
  if (!m) return token;
  return "#" + [...m[1]].map((c) => c + c).join("");
}

/**
 * Un color con nombre a su hex, SOLO en propiedades que llevan color.
 *
 * La restriccion no es decorativa: `font-family: Tomato` es una fuente que se
 * llama Tomato, y `animation-name: tomato` es el nombre de una animacion.
 * Convertirlos a `#ff6347` cambiaria lo que la declaracion significa.
 */
function canonizarColor(prop: string, token: string): string {
  if (!LLEVAN_COLOR.has(prop)) return token;
  return COLORES_CON_NOMBRE[token] ?? token;
}

/**
 * `0px` -> `0`, solo donde el cero no puede ser otra cosa que una longitud.
 *
 * `0%` queda afuera: un porcentaje se resuelve contra otra medida y no siempre
 * vale lo mismo que un cero absoluto.
 */
function canonizarCero(prop: string, token: string): string {
  if (!LONGITUD_PURA.has(prop)) return token;
  return CERO_CON_UNIDAD.test(token) ? "0" : token;
}

/**
 * Reparte los valores de un atajo de caja sobre sus cuatro -o dos- lados.
 *
 * Devuelve `null` cuando no puede probar que la expansion conserva el
 * significado: con `var()` adentro -una custom property puede traer dos valores
 * y la expansion multiplicaria basura-, con una palabra clave global, con una
 * barra -`border-radius: 10px / 20px` tiene dos radios por esquina- o con una
 * cantidad de valores que CSS no admite.
 */
function expandirCaja(tokens: string[], lados: 2 | 4): string[] | null {
  if (tokens.some((t) => t.includes("var(") || t === "/")) return null;
  if (tokens.some((t) => PALABRAS_CLAVE_GLOBALES.has(t))) return null;

  if (lados === 2) {
    if (tokens.length === 1) return [tokens[0], tokens[0]];
    if (tokens.length === 2) return tokens;
    return null;
  }
  const [a, b, c, d] = tokens;
  if (tokens.length === 1) return [a, a, a, a];
  if (tokens.length === 2) return [a, b, a, b];
  if (tokens.length === 3) return [a, b, c, b];
  if (tokens.length === 4) return [a, b, c, d];
  return null;
}

/**
 * Ordena los componentes de un atajo de linea como ancho, estilo y color.
 *
 * Clasifica lo que reconoce y, si queda UN token sin clasificar y el lugar del
 * color esta libre, ese token es el color: asi `border: 2px solid
 * var(--acento)` tambien se ordena. Si algo se repite o quedan dos sin
 * clasificar, devuelve `null` y la comparacion sigue siendo estricta -no hay
 * forma de saber que quiso decir, y `border: solid solid red` no es CSS valido-.
 */
function ordenarAtajoDeLinea(tokens: string[]): string[] | null {
  if (tokens.length === 0 || tokens.length > 3) return null;
  if (tokens.some((t) => PALABRAS_CLAVE_GLOBALES.has(t))) return null;

  let ancho: string | null = null;
  let estilo: string | null = null;
  let color: string | null = null;
  const sinClasificar: string[] = [];

  for (const t of tokens) {
    if (ESTILOS_DE_LINEA.has(t)) {
      if (estilo) return null;
      estilo = t;
    } else if (ANCHOS_CON_NOMBRE.has(t) || ES_LONGITUD.test(t)) {
      if (ancho) return null;
      ancho = t;
    } else if (t.startsWith("#") || t.includes("(") || t in COLORES_CON_NOMBRE) {
      if (color) return null;
      color = t;
    } else {
      sinClasificar.push(t);
    }
  }

  if (sinClasificar.length > 1) return null;
  if (sinClasificar.length === 1) {
    if (color) return null;
    color = sinClasificar[0];
  }
  return [ancho, estilo, color].filter((x): x is string => x !== null);
}

/**
 * La forma canonica del VALOR de una declaracion. Ver el comentario grande de
 * arriba para el limite que respeta cada paso.
 */
function canonizarValor(prop: string, valor: string): string {
  const conComillas = canonizarComillas(valor);
  if (PALABRAS_CLAVE_GLOBALES.has(conComillas)) return conComillas;

  const tokens = tokenizarValor(conComillas);
  if (!tokens) return conComillas;

  let canon = tokens.map((t) =>
    canonizarColor(prop, canonizarCero(prop, canonizarHex(t)))
  );

  if (prop === "font-weight") {
    if (canon.length === 1 && canon[0] === "bold") canon = ["700"];
    else if (canon.length === 1 && canon[0] === "normal") canon = ["400"];
  }

  if (CAJA_CUATRO_VALORES.has(prop)) canon = expandirCaja(canon, 4) ?? canon;
  else if (CAJA_DOS_VALORES.has(prop)) canon = expandirCaja(canon, 2) ?? canon;
  else if (ATAJOS_DE_LINEA.has(prop)) canon = ordenarAtajoDeLinea(canon) ?? canon;

  return canon.join(" ");
}

/**
 * La forma canonica de una declaracion entera, ya normalizada.
 *
 * El ultimo paso pliega `background` sobre `background-color` cuando el valor es
 * un color literal. Antes esto vivia en una funcion aparte que enumeraba
 * alternativas; es la misma regla y la misma restriccion, escrita una sola vez.
 *
 * MEDIDO EL 2026-08-31, y por eso existe: 49 ejercicios castigaban al alumno que
 * elegia la otra propiedad. 12 esperaban el atajo y bajaban a 78-91; 37
 * esperaban la especifica y bajaban HASTA 0, porque los mini retos son todo o
 * nada. Lo reporto un alumno, que es la peor forma de enterarse.
 *
 * Sigue valiendo SOLO con un color literal. Con un color solo las dos pintan
 * igual, porque el atajo resetea imagen, posicion y repeticion a sus valores
 * iniciales, que es donde ya estaban. Quedan afuera los degradados y `url()`
 * -`background-color: linear-gradient(...)` ni siquiera es CSS valido- y
 * `var(...)`, porque una custom property puede contener un degradado y el
 * comparador no puede saberlo.
 */
function canonizarDeclaracion(declaracion: string): string {
  const i = declaracion.indexOf(":");
  if (i === -1) return declaracion;
  const prop = declaracion.slice(0, i).trim();
  const valor = canonizarValor(prop, declaracion.slice(i + 1).trim());
  if (prop === "background" && esColorSolo(valor)) return `background-color: ${valor}`;
  return `${prop}: ${valor}`;
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
    // Una sola vez por selector, no una por declaracion.
    const canonicas = presentes
      ? new Set([...presentes].map(canonizarDeclaracion))
      : null;
    for (const d of decls) {
      total++;
      const hallada =
        presentes?.has(d) || canonicas?.has(canonizarDeclaracion(d));
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
