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

describe("acentuacion del contenido", () => {
  it("ninguna palabra inequivoca aparece sin su tilde o su ñ", () => {
    const fallas: string[] = [];

    for (const m of ALL_MODULES) {
      const prosa = prosaDe(m);
      for (const [mal, bien] of AGUDAS_SINGULAR) {
        const n = (prosa.match(new RegExp(`\\b${mal}\\b`, "gi")) ?? []).length;
        if (n > 0) fallas.push(`${m.dojo}/${m.slug}: "${mal}" x${n} (va "${bien}")`);
      }
      for (const [mal, bien] of CON_FLEXION) {
        const n = (prosa.match(new RegExp(`\\b${mal}(s|es|a|as|os)?\\b`, "gi")) ?? []).length;
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
