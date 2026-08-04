/**
 * Structural grading for HTML exercises.
 *
 * Why this exists: HTML exercises were graded with `includes`, a case-insensitive
 * substring search against tag fragments such as
 * `["<table>", "<thead>", "<th>", "<tbody>", "<td>"]`. Two problems:
 *
 * - It cannot see NESTING. `<td></td><table></table>` contains every token, so a
 *   table with its cells outside it scored 100%.
 * - Some tokens were single characters or bare numbers. `html17-ej-04` expected
 *   `["<meter", "8", "0", "10", "</meter>"]`, and `"0"` matches any text
 *   containing a zero. `html16-ej-01` expected `"es"` for `lang="es"`, which
 *   matches "test" and "Martinez".
 *
 * Parsing the submission into a real DOM and querying it fixes both: structure is
 * verified by selector, and attributes are compared as attributes.
 *
 * Expectations are written as one of four forms:
 *
 *   "table > caption"           at least one element matches the selector
 *   "ul > li >> 3"              at least 3 elements match
 *   "pre > code :: <h1>"        a match exists whose textContent includes "<h1>"
 *   "!doctype"                  the document declares <!DOCTYPE html>
 *
 * Selectors are ordinary CSS, so nesting, attributes and attribute values are all
 * expressible: `figure > img[alt]`, `html[lang="es"]`, `input[type="email"]`.
 */

export interface ResultadoEstructura {
  correct: boolean;
  score: number;
  faltantes: string[];
}

type Expectativa =
  | { clase: "doctype" }
  | { clase: "selector"; selector: string; minimo: number }
  | { clase: "texto"; selector: string; texto: string };

function parsearExpectativa(raw: string): Expectativa | null {
  const e = raw.trim();
  if (!e) return null;
  if (e.toLowerCase() === "!doctype") return { clase: "doctype" };

  const conTexto = e.split("::");
  if (conTexto.length === 2) {
    const selector = conTexto[0].trim();
    const texto = conTexto[1].trim();
    if (!selector || !texto) return null;
    return { clase: "texto", selector, texto };
  }

  const conConteo = e.split(">>");
  if (conConteo.length === 2) {
    const selector = conConteo[0].trim();
    const minimo = Number.parseInt(conConteo[1].trim(), 10);
    if (!selector || !Number.isFinite(minimo) || minimo < 1) return null;
    return { clase: "selector", selector, minimo };
  }

  return { clase: "selector", selector: e, minimo: 1 };
}

/**
 * Parses HTML the way a browser would. Returns null when no DOMParser is
 * available, which callers treat as "cannot grade" rather than "passed".
 */
export function parsearHtml(html: string): Document | null {
  if (typeof DOMParser === "undefined") return null;
  try {
    return new DOMParser().parseFromString(html ?? "", "text/html");
  } catch {
    return null;
  }
}

/**
 * True when the submission contains no element the student could have written.
 * DOMParser always synthesizes html/head/body, so their presence proves nothing;
 * prose becomes a lone text node inside body and leaves it empty of children.
 */
function sinContenidoReal(doc: Document): boolean {
  const body = doc.body;
  const head = doc.head;
  const enBody = body ? body.children.length : 0;
  // <title>, <meta> and friends land in head even when written bare.
  const enHead = head ? head.children.length : 0;
  return enBody === 0 && enHead === 0 && !doc.doctype;
}

export function compararEstructura(
  expectativas: string[],
  enviado: string
): ResultadoEstructura {
  const parsed = expectativas
    .map(parsearExpectativa)
    .filter((e): e is Expectativa => e !== null);

  if (parsed.length === 0) {
    return { correct: false, score: 0, faltantes: ["(sin expectativas validas)"] };
  }

  const doc = parsearHtml(enviado);
  if (!doc || sinContenidoReal(doc)) {
    return { correct: false, score: 0, faltantes: expectativas };
  }

  const faltantes: string[] = [];
  let cumplidas = 0;

  for (let i = 0; i < parsed.length; i++) {
    const exp = parsed[i];
    const etiqueta = expectativas[i];
    let ok = false;

    try {
      if (exp.clase === "doctype") {
        ok = doc.doctype !== null && doc.doctype.name.toLowerCase() === "html";
      } else if (exp.clase === "selector") {
        ok = doc.querySelectorAll(exp.selector).length >= exp.minimo;
      } else {
        const buscado = exp.texto.toLowerCase();
        ok = Array.from(doc.querySelectorAll(exp.selector)).some((el) =>
          (el.textContent ?? "").toLowerCase().includes(buscado)
        );
      }
    } catch {
      // An invalid selector is an authoring bug, not a student mistake. Count it
      // as unmet and surface it so the audit test catches it.
      ok = false;
    }

    if (ok) cumplidas++;
    else faltantes.push(etiqueta);
  }

  const score = Math.round((cumplidas / parsed.length) * 100);
  return { correct: cumplidas === parsed.length, score, faltantes };
}
