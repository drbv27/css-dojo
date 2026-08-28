import { JSDOM } from "jsdom";
import type { ParserHtml } from "@/lib/calificar";

/**
 * El parser de HTML del lado del servidor, para los 24 ejercicios
 * `html-structure`.
 *
 * SE PASA POR PARAMETRO, no se asigna a `globalThis.DOMParser`. Asignarlo
 * funciona, y hace que el comportamiento de un modulo de servidor dependa de
 * una asignacion que ocurrio en otro archivo: se rompe el dia que alguien
 * importa el corrector desde una segunda ruta y se olvida del conjuro.
 *
 * SOLO PARA SERVIDOR. Importar esto desde un componente cliente arrastraria
 * jsdom al bundle del navegador, que ya tiene su propio DOMParser.
 */
export const parserHtmlServidor: ParserHtml = (html: string) => {
  try {
    return new JSDOM(html ?? "").window.document as unknown as Document;
  } catch {
    // Un HTML que ni jsdom puede parsear no es una correccion fallida: es una
    // correccion que no se pudo hacer. Devolver null hace que
    // `compararEstructura` no otorgue nada, que es lo correcto.
    return null;
  }
};
