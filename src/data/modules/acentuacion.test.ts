import { describe, expect, it } from "vitest";
import { ALL_MODULES } from "./index";

/**
 * El curriculum se escribio sin tildes ni ñ: 3.030 palabras mal escritas en 101
 * modulos. Este test evita que vuelvan.
 *
 * Cubre las INEQUIVOCAS por diccionario, y ademas las dependientes de contexto
 * cuyo patron sintactico las desambigua sin interpretar nada: `mas` siempre es
 * `más`, `esta` ante participio es el verbo, `como se <verbo>` es pregunta
 * indirecta.
 *
 * Lo que NO se exige, y es a proposito: `esta` ante sustantivo ("esta
 * propiedad") es demostrativo y va SIN tilde, igual que el pronombre ("esta es
 * la que gana") desde 2010. Y `solo` no lleva tilde nunca desde la misma
 * reforma, asi que sus 298 apariciones ya estaban bien. Exigir tilde en esos
 * casos seria un error distinto y peor que la omision.
 *
 * Se mide sobre PROSA. Enmascarar el codigo es imprescindible: `.titulo` como
 * clase CSS, `#boton` como id y `correctZone: "funcion"` como token de
 * validacion NO se acentuan. Sin la mascara habria 169 falsos positivos de
 * `titulo` y 101 de `boton`, todos legitimos.
 */

/**
 * Agudas terminadas en -n o -s: el PLURAL pierde la tilde, porque al sumar -es
 * la palabra pasa a ser llana. `función` -> `funciones`, `común` -> `comunes`,
 * `botón` -> `botones`, `patrón` -> `patrones`. Por eso solo se prohibe la forma
 * singular exacta: buscar `funcion` con plural flexionado da 100+ falsos
 * positivos sobre palabras bien escritas.
 */
const AGUDAS_SINGULAR: [string, string][] = [
  ["funcion", "función"],
  ["patron", "patrón"],
  ["boton", "botón"],
  ["comun", "común"],
  ["razon", "razón"],
  ["version", "versión"],
  ["condicion", "condición"],
  ["opcion", "opción"],
  ["seccion", "sección"],
  ["posicion", "posición"],
  ["direccion", "dirección"],
  ["declaracion", "declaración"],
  ["validacion", "validación"],
  ["navegacion", "navegación"],
  ["descripcion", "descripción"],
  ["animacion", "animación"],
  ["aplicacion", "aplicación"],
  ["combinacion", "combinación"],
  ["dimension", "dimensión"],
  ["atencion", "atención"],
  ["alineacion", "alineación"],
  ["introduccion", "introducción"],
  ["relacion", "relación"],
];

/**
 * Esdrujulas y el resto: la tilde se mantiene en singular y en plural
 * (`código`/`códigos`, `línea`/`líneas`), asi que se prohiben ambas formas.
 */
const CON_FLEXION: [string, string][] = [
  ["codigo", "código"],
  ["pagina", "página"],
  ["linea", "línea"],
  ["metodo", "método"],
  ["titulo", "título"],
  ["parrafo", "párrafo"],
  ["numero", "número"],
  ["parametro", "parámetro"],
  ["tamano", "tamaño"],
  ["diseno", "diseño"],
  ["pequeno", "pequeño"],
  ["anadir", "añadir"],
  ["despues", "después"],
  ["tambien", "también"],
  ["ademas", "además"],
  ["segun", "según"],
  ["ultimo", "último"],
  ["unico", "único"],
  ["minimo", "mínimo"],
  ["maximo", "máximo"],
  ["basico", "básico"],
  ["logico", "lógico"],
  ["multiples", "múltiples"],
  ["automaticamente", "automáticamente"],
  ["semantico", "semántico"],
  ["especifico", "específico"],
  ["arbol", "árbol"],
  ["jerarquia", "jerarquía"],
  ["categoria", "categoría"],
  ["tipografia", "tipografía"],
  ["imagenes", "imágenes"],
  ["margenes", "márgenes"],
  ["indice", "índice"],
  ["limite", "límite"],
  ["pixeles", "píxeles"],
  ["vacio", "vacío"],
  ["vacia", "vacía"],
  ["alla", "allá"],
];

/** Reemplaza el codigo por espacios, conservando las posiciones. */
function sinCodigo(texto: string): string {
  let out = texto;
  const tapar = (re: RegExp) => {
    out = out.replace(re, (m) => " ".repeat(m.length));
  };
  tapar(/```[\s\S]*?```/g);
  tapar(/`[^`\n]*`/g);
  tapar(/\{[^{}\n]*\}/g);
  // Un token pegado a `.`, `#` o `$` es codigo: clase CSS, id o variable Sass.
  // `.titulo` no se acentua porque tiene que coincidir con class="titulo" en el
  // HTML. Es la misma clase de falso positivo que hace imprescindible la
  // mascara: sin ella `titulo` reporta 169 casos, todos selectores legitimos.
  // El punto final de una oracion no matchea, porque le sigue un espacio.
  tapar(/(?<![\w])[.#$][A-Za-z_][\w-]*/g);
  // Un identificador PEGADO a un parentesis de apertura es una llamada, o sea
  // codigo: `ultimo([1, 2])` en un enunciado es el nombre de la funcion que el
  // alumno tiene que escribir, y acentuarlo la volveria irreproducible. Se exige
  // que no haya espacio, para no tapar prosa como "la funcion (que devuelve...)".
  tapar(/\b[A-Za-z_]\w*\(/g);
  return out;
}

function prosaDe(m: (typeof ALL_MODULES)[number]): string {
  const partes: string[] = [m.title, m.description];
  for (const l of m.lessons) partes.push(l.title, l.content);
  for (const e of m.exercises) {
    partes.push(e.prompt, e.hint ?? "", e.explanation ?? "");
    for (const o of e.options ?? []) partes.push(o.text);
    for (const z of e.dropZones ?? []) partes.push(z.label);
  }
  return partes.map(sinCodigo).join("\n");
}

/**
 * Palabras de CON_FLEXION que ADEMAS son una forma verbal escrita SIN tilde. El
 * sustantivo `limite` lleva tilde, pero el subjuntivo de `limitar` no la lleva y
 * se escribe igual: "un ancho que limite el crecimiento". Igual pasa con la
 * primera persona de `titular`, `numerar` y `especificar`, y con la tercera de
 * `paginar`.
 *
 * MEDIDO, porque el registro del cambio anterior se equivocaba en las dos
 * direcciones. Nombraba `limite`, `habilite`, `deposite` y `milite`: de esas,
 * solo `limite` puede disparar el guard, porque las otras tres NO contienen la
 * subcadena. Y no nombraba las cuatro que si pueden, que son las de abajo.
 */
const AMBIGUAS_CON_VERBO = new Set(["limite", "titulo", "numero", "especifico", "pagina"]);

/**
 * Palabras que, delante de una ambigua, la vuelven verbo. No es un analizador
 * sintactico: es la lista corta de posiciones donde la forma verbal aparece de
 * verdad en prosa didactica ("que limite", "que no limite", "que se limite a",
 * "yo titulo").
 *
 * EL PRECIO, dicho de frente: una tilde realmente faltante justo despues de una
 * de estas cuatro palabras deja de detectarse. Se paga porque el falso positivo
 * era peor: BLOQUEABA escribir bien. Al redactar el modulo de transformaciones
 * hubo que esquivar la palabra `limite` entera para que este guard pasara, y un
 * guard que obliga a escribir peor esta trabajando en contra.
 */
const ANTES_LA_VUELVE_VERBO = new Set(["que", "no", "se", "yo"]);

/** La palabra inmediatamente anterior a la posicion `i`, en minusculas. */
function palabraAnterior(texto: string, i: number): string {
  const m = texto.slice(Math.max(0, i - 40), i).match(/([\wáéíóúñ]+)[^\wáéíóúñ]*$/i);
  return m ? m[1].toLowerCase() : "";
}

/**
 * Cuenta las apariciones de una palabra sin tilde que SI son un error, saltando
 * las que estan en posicion de verbo cuando la palabra es ambigua.
 */
function ocurrenciasQueSonError(prosa: string, mal: string, sufijos: string): number {
  const re = new RegExp(`\\b${mal}${sufijos}\\b`, "gi");
  let n = 0;
  for (const hit of prosa.matchAll(re)) {
    if (AMBIGUAS_CON_VERBO.has(mal) && ANTES_LA_VUELVE_VERBO.has(palabraAnterior(prosa, hit.index))) continue;
    n++;
  }
  return n;
}

describe("palabras que son sustantivo con tilde y verbo sin tilde", () => {
  const SUF = "(s|es|a|as|os)?";

  it("el subjuntivo de limitar NO es un error", () => {
    for (const frase of [
      "un ancho que limite el crecimiento",
      "un valor que no limite la caja",
      "conviene que se limite a dos columnas",
      "elegi un tope que limites vos mismo",
    ]) {
      expect(ocurrenciasQueSonError(frase, "limite", SUF)).toBe(0);
    }
  });

  it("el sustantivo limite SIGUE exigiendo su tilde", () => {
    for (const frase of [
      "el limite de ancho",
      "su limite superior",
      "los limites del contenedor",
      "sin limite",
      "hasta el limite",
    ]) {
      expect(ocurrenciasQueSonError(frase, "limite", SUF)).toBe(1);
    }
  });

  it("`sin limite` sigue detectandose, o sea que la regla NO es 'solo tras articulo'", () => {
    // Si la excepcion se hubiera escrito como "exigir la tilde solo despues de un
    // determinante", esta frase se habria escapado. La regla mira si la palabra
    // anterior la vuelve VERBO, que es mas angosto y deja el sustantivo cubierto.
    expect(ocurrenciasQueSonError("sin limite de ancho", "limite", SUF)).toBe(1);
  });

  it("las otras cuatro ambiguas tambien quedan exentas en posicion de verbo", () => {
    expect(ocurrenciasQueSonError("yo titulo la seccion", "titulo", SUF)).toBe(0);
    expect(ocurrenciasQueSonError("yo numero los pasos", "numero", SUF)).toBe(0);
    expect(ocurrenciasQueSonError("yo especifico el ancho", "especifico", SUF)).toBe(0);
    expect(ocurrenciasQueSonError("el indice que pagina el contenido", "pagina", SUF)).toBe(0);
    // Y como sustantivo siguen exigiendo tilde.
    expect(ocurrenciasQueSonError("el titulo de la pagina", "titulo", SUF)).toBe(1);
    expect(ocurrenciasQueSonError("el numero de columnas", "numero", SUF)).toBe(1);
  });

  it("una palabra NO ambigua no se exime aunque le toque un `que` delante", () => {
    // `codigo` no es forma verbal de nada, asi que la excepcion no la alcanza.
    expect(ocurrenciasQueSonError("el fragmento que codigo aparece", "codigo", SUF)).toBe(1);
  });

  it("la excepcion es POR OCURRENCIA, no por texto", () => {
    // Lo que importa de verdad: que una aparicion exenta no absuelva a las otras.
    expect(ocurrenciasQueSonError("un ancho que limite el limite superior", "limite", SUF)).toBe(1);
    expect(ocurrenciasQueSonError("el limite que limite", "limite", SUF)).toBe(1);
    expect(ocurrenciasQueSonError("que limite y que limite", "limite", SUF)).toBe(0);
    expect(ocurrenciasQueSonError("el limite y el limite", "limite", SUF)).toBe(2);
    // Al principio del texto no hay palabra anterior, asi que no se exime.
    expect(ocurrenciasQueSonError("limite de ancho", "limite", SUF)).toBe(1);
  });

  it("las tres palabras que el registro nombraba de mas nunca matcheaban", () => {
    // El registro del cambio anterior decia que `habilite`, `deposite` y `milite`
    // sufrian el mismo falso positivo. No: ninguna contiene la subcadena `limite`.
    for (const frase of ["que habilite el modulo", "que deposite el valor", "que milite ahi"]) {
      expect(ocurrenciasQueSonError(frase, "limite", SUF)).toBe(0);
    }
  });
});

describe("acentuacion del contenido", () => {
  it("ninguna palabra inequivoca aparece sin su tilde o su ñ", () => {
    const fallas: string[] = [];

    for (const m of ALL_MODULES) {
      const prosa = prosaDe(m);
      for (const [mal, bien] of AGUDAS_SINGULAR) {
        const n = ocurrenciasQueSonError(prosa, mal, "");
        if (n > 0) fallas.push(`${m.dojo}/${m.slug}: "${mal}" x${n} (va "${bien}")`);
      }
      for (const [mal, bien] of CON_FLEXION) {
        const n = ocurrenciasQueSonError(prosa, mal, "(s|es|a|as|os)?");
        if (n > 0) fallas.push(`${m.dojo}/${m.slug}: "${mal}" x${n} (va "${bien}")`);
      }
    }

    expect(fallas).toEqual([]);
  });

  it("los plurales en -ciones y -siones NO llevan tilde", () => {
    // `función` la lleva, `funciones` no: al sumar -es la palabra pasa a ser
    // llana terminada en s. Acentuar el plural es tan defecto como no acentuar
    // el singular, y es el error que un barrido automatico introduce facil.
    const fallas: string[] = [];

    for (const m of ALL_MODULES) {
      const prosa = prosaDe(m);
      for (const w of prosa.match(/\b[a-záéíóúñA-Z]*[cs]iónes\b/gi) ?? []) {
        fallas.push(`${m.dojo}/${m.slug}: "${w}"`);
      }
    }

    expect(fallas).toEqual([]);
  });

  /**
   * Las tres que siguen exigen palabras dependientes del contexto, y se pueden
   * exigir porque el patron sintactico las desambigua. Cada una se reviso contra
   * todas sus apariciones en el corpus antes de escribirla.
   */
  it("`mas` siempre es `más`: la conjuncion arcaica no aparece", () => {
    // Revisadas las 300 apariciones: todas comparativas o cuantificadores. La
    // unica precedida de coma era "mas confianza te dan", tambien comparativa.
    // `mas` = "pero" es literario y no se usa en prosa tecnica.
    const fallas: string[] = [];
    for (const m of ALL_MODULES) {
      const n = (prosaDe(m).match(/\bmas\b/gi) ?? []).length;
      if (n > 0) fallas.push(`${m.dojo}/${m.slug}: "mas" x${n}`);
    }
    expect(fallas).toEqual([]);
  });

  it("`esta` ante participio o preposicion es el verbo `está`", () => {
    // Solo la forma verbal. Ante sustantivo es demostrativo y va sin tilde.
    const verbal =
      /\besta\s+(en|dentro|entre|escrit[oa]s?|disponibles?|definid[oa]s?|pasando|diseñad[oa]s?|abiert[oa]|activ[oa]|marcad[oa]|construid[oa]|bien|vací[oa]|inmediatamente)\b/gi;
    const fallas: string[] = [];
    for (const m of ALL_MODULES) {
      for (const w of prosaDe(m).match(verbal) ?? []) {
        fallas.push(`${m.dojo}/${m.slug}: "${w}"`);
      }
    }
    expect(fallas).toEqual([]);
  });

  it("`como se <verbo>` es pregunta indirecta y lleva tilde", () => {
    // "define cómo se calcula", "controla cómo se comporta", "piensa en cómo se
    // ven". El comparativo no toma esta forma en el corpus.
    const fallas: string[] = [];
    for (const m of ALL_MODULES) {
      for (const w of prosaDe(m).match(/\bcomo\s+se\s+[a-záéíóúñ]+/gi) ?? []) {
        fallas.push(`${m.dojo}/${m.slug}: "${w}"`);
      }
    }
    expect(fallas).toEqual([]);
  });

  it("toda interrogativa dentro de una pregunta lleva tilde", () => {
    // Una vez abierta la pregunta con ¿, la interrogativa que la sigue SIEMPRE
    // se acentua. No depende del contexto, asi que se puede exigir.
    const sinTilde = /¿\s*(que|cual|cuales|cuanto|cuanta|cuantos|cuantas|como|cuando|donde|quien|quienes)\b/gi;
    const fallas: string[] = [];

    for (const m of ALL_MODULES) {
      const prosa = prosaDe(m);
      for (const w of prosa.match(sinTilde) ?? []) {
        fallas.push(`${m.dojo}/${m.slug}: "${w.trim()}"`);
      }
    }

    expect(fallas).toEqual([]);
  });
});
