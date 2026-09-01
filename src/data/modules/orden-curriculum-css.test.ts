import { describe, it, expect } from "vitest";
import { ALL_MODULES } from "@/data/modules";
import { DOJO_CATEGORY_ORDER } from "@/data/moduleCategories";
import type { ModuleCategory } from "@/types";

/**
 * Guards the TEACHING ORDER of the CSS track.
 *
 * The track had two ordering defects that this test now pins down:
 *
 * - `dimensiones` explained `box-sizing` in terms of "sin incluir padding ni
 *   border", six modules before `box-model` taught padding and border. The
 *   explanation was correct and unreadable at the same time.
 * - `unidades-css` uses padding and margin 45 times as its examples, so it
 *   cannot come before the module that introduces them.
 *
 * Both are resolved by putting `box-model` at 4 and `unidades-css` at 5.
 *
 * IMPORTANT: the app DOES sort by the `order` field -- `index.ts` ends in
 * `.sort((a, b) => a.order - b.order)`. So `order` is what a student actually
 * walks, and the array order in `index.ts` is documental. Both have to agree
 * anyway, and the tests below are what keep them honest: changing one without
 * the other leaves a comment or a listing lying about the real path.
 *
 * This paragraph used to say the exact opposite. It was wrong, and it is the
 * kind of wrong that re-sets the trap: a plan written from it would append a
 * module at the end and assume the number was only a label.
 */
const cssModules = ALL_MODULES.filter((m) => m.dojo === "css");

describe("orden del track CSS", () => {
  it("el campo order coincide con la posicion en el array", () => {
    // Si esto falla, alguien movio un modulo en index.ts sin actualizar su
    // `order`, o al reves. La UI mostraria un numero que no corresponde.
    const desincronizados = cssModules
      .map((m, i) => ({ slug: m.slug, order: m.order, posicion: i + 1 }))
      .filter((x) => x.order !== x.posicion);
    expect(desincronizados).toEqual([]);
  });

  it("no hay numeros de orden repetidos ni huecos", () => {
    const ordenes = cssModules.map((m) => m.order).sort((a, b) => a - b);
    expect(ordenes).toEqual(Array.from({ length: cssModules.length }, (_, i) => i + 1));
  });

  /**
   * Una media query RESPONSIVE -- la que pregunta por el tamano del viewport --
   * es una referencia adelantada al modulo `media-queries`. Una media feature de
   * accesibilidad o de tema NO lo es: `prefers-reduced-motion` se ensena dentro
   * de animaciones y `prefers-color-scheme` dentro de variables, que es
   * exactamente donde corresponde, porque el concepto de esos modulos no es el
   * breakpoint. `print` tampoco.
   *
   * El patron viejo era `/@media/` a secas y no distinguia. Contaba deuda que no
   * existe, y "arreglarla" habria significado borrar la accesibilidad de
   * `transiciones-animaciones` y el dark mode de `variables-css`, que son los
   * mejores ejemplos que tienen esos dos modulos. La condicion tiene que estar
   * antes de la llave de apertura, que es donde vive.
   *
   * Pregunta por `width` y `height` PELADOS, no por `min-width`/`max-width`. Dos
   * razones: el `\b` despues del guion los subsume igual, y ademas cubre la
   * sintaxis de rango moderna -- `@media (width >= 48rem)` y
   * `@media (400px <= width <= 700px)` -- que una alternacion de
   * `min-`/`max-` deja pasar. Ese hueco lo encontro la revision acotada del
   * slice 1 sobre la primera version de este patron: hacerlo mas preciso en un
   * eje lo habia hecho mas debil en otro.
   *
   * Los dos tests de abajo comparten esta definicion a proposito: si uno cuenta
   * un `@media` como deuda y el otro no, el proximo que lea el archivo no sabe
   * cual de los dos miente.
   */
  const MEDIA_RESPONSIVE = String.raw`@media[^{]*\b(?:width|height|orientation)\b`;

  /**
   * Fails loudly on a slug typo instead of returning 0 and making a
   * `toBeLessThan` assertion pass or fail for the wrong reason. Worth having:
   * the slugs are not guessable from the filenames -- `23-bootstrap.ts` is
   * `bootstrap-5` and `24-tailwind.ts` is `tailwind-css`.
   */
  const posicionDe = (slug: string) => {
    const i = cssModules.findIndex((m) => m.slug === slug);
    if (i === -1) throw new Error(`No existe un modulo CSS con slug "${slug}"`);
    return i + 1;
  };

  /**
   * EL ORDEN DE ENSENANZA, ESCRITO A MANO Y A PROPOSITO.
   *
   * Reemplaza a un ledger de slugs sueltos que solo exigia `length ===
   * cssModules.length`: ese contaba, no ordenaba. Un modulo agregado en el lugar
   * equivocado pasaba, y un reordenamiento DENTRO de una seccion pasaba tambien,
   * porque el walk agrupado deriva el orden intra-seccion del array. Asi se
   * colaron las dos inversiones que este archivo existe para atrapar.
   *
   * Escrita a mano y NO derivada de `order` ni de las categorias: derivarla
   * seria tautologico -- pasaria con cualquier renumeracion internamente
   * coherente, que es justo el modo de falla que hay que atrapar. El precio es
   * que agregar un modulo obliga a editar esta lista, y ese precio es el punto.
   */
  const SECUENCIA = [
  "que-es-css",
  "selectores",
  "propiedades-basicas",
  "box-model",
  "unidades-css",
  "dimensiones",
  "overflow",   // NUEVO, Fase 2 del plan
  "math-functions",
  "tipografias",
  "tipografia-web",   // NUEVO, Fase 2 del plan
  "advanced-text",
  "selectores-descendientes",
  "pseudo-clases",
  "pseudo-elementos",
  "attribute-selectors",
  "especificidad",
  "herencia-valores-globales",   // NUEVO, Fase 2 del plan
  "float-display",
  "posicionamiento",
  "flexbox",
  "css-grid",
  "propiedades-logicas",
  "imagenes-y-medios",   // NUEVO, Fase 2 del plan
  "lists-and-tables",
  "shadows-gradients-filters",
  "transforms",
  "transiciones-animaciones",
  "variables-css",
  "accesibilidad-visual",
  "media-queries",
  "depurar-con-devtools",
  "sass-fundamentos",
  "sass-avanzado",
  "bootstrap-5",
  "tailwind-css",
  "proyecto-cv-css",
];

  it("la secuencia de ensenanza es exactamente la fijada", () => {
    // Falla por LARGO si alguien agrego o borro un modulo, y por ELEMENTO si lo
    // puso en otro lugar. El ledger viejo solo atrapaba lo primero.
    expect(cssModules.map((m) => m.slug)).toEqual(SECUENCIA);
  });

  it("cada order es su posicion en la secuencia fijada", () => {
    const mal = SECUENCIA
      .map((slug, i) => ({ slug, esperado: i + 1, real: cssModules.find((m) => m.slug === slug)?.order }))
      .filter((x) => x.real !== x.esperado);
    expect(mal).toEqual([]);
  });

  it("agrupar por seccion reproduce la misma secuencia", () => {
    // La tercera forma, y la que cierra el agujero: el alumno no camina el
    // array, camina las secciones. Si agrupar por categoria da otro recorrido,
    // el numero de la tarjeta y el lugar donde aparece dicen cosas distintas.
    const porSeccion = ORDEN_CATEGORIAS.flatMap((c) =>
      cssModules.filter((m) => m.category === c).map((m) => m.slug)
    );
    expect(porSeccion).toEqual(SECUENCIA);
  });

  /**
   * The test that was missing, and the reason a reorder can look done and not be.
   *
   * Both listings render group by group and only order by array position INSIDE
   * each group. So moving a module up the array without moving its `category`
   * changes nothing on screen: box-model sat at position 4 while still marked
   * `intermediate`, so the student kept seeing typography and dimensions before
   * it. Every ordering assertion in this file passed while the UI showed the old
   * sequence.
   *
   * DERIVED, not hardcoded. This used to be a parallel copy of
   * `DOJO_CATEGORY_ORDER.css`, so a section change meant editing two files and
   * whoever edited one of them got a green suite and a wrong track. Reading the
   * real thing means the section order can only be wrong in one place.
   */
  const ORDEN_CATEGORIAS = DOJO_CATEGORY_ORDER.css;

  it("la categoria no contradice el orden: el track se lee igual en pantalla que en el array", () => {
    const rango = (c: string) => ORDEN_CATEGORIAS.indexOf(c as ModuleCategory);

    const desconocidas = cssModules.filter((m) => rango(m.category) === -1);
    expect(desconocidas.map((m) => `${m.slug} (${m.category})`)).toEqual([]);

    // La secuencia que ve el alumno: agrupada por categoria, y dentro de cada
    // grupo por posicion en el array.
    const enPantalla = ORDEN_CATEGORIAS.flatMap((c) =>
      cssModules.filter((m) => m.category === c)
    );

    const inconsistencias = enPantalla
      .map((m, i) => ({ slug: m.slug, order: m.order, enPantalla: i + 1 }))
      .filter((x) => x.order !== x.enPantalla);

    expect(inconsistencias).toEqual([]);
  });

  it("el proyecto final se renderiza al final, despues de los frameworks", () => {
    // Como `advanced` quedaba entre shadows y sass. Un cierre integrador tiene
    // que venir despues de todo lo que integra.
    const proyecto = cssModules.find((m) => m.slug === "proyecto-cv-css")!;
    expect(proyecto.category).toBe("css-proyecto");
    expect(ORDEN_CATEGORIAS.indexOf(proyecto.category)).toBe(ORDEN_CATEGORIAS.length - 1);
  });

  it("box-model viene antes de dimensiones", () => {
    // dimensiones explica box-sizing usando padding y border, que box-model ensena.
    expect(posicionDe("box-model")).toBeLessThan(posicionDe("dimensiones"));
  });

  it("box-model viene antes de unidades-css", () => {
    // unidades-css usa padding/margin/border como ejemplos de cada unidad.
    expect(posicionDe("box-model")).toBeLessThan(posicionDe("unidades-css"));
  });

  it("unidades-css viene antes de tipografias y dimensiones", () => {
    // tipografias usa rem/em; dimensiones usa %, vw y max-width.
    expect(posicionDe("unidades-css")).toBeLessThan(posicionDe("tipografias"));
    expect(posicionDe("unidades-css")).toBeLessThan(posicionDe("dimensiones"));
  });

  it("los selectores avanzados vienen despues de los basicos, y especificidad al final de esa serie", () => {
    expect(posicionDe("selectores")).toBeLessThan(posicionDe("selectores-descendientes"));
    expect(posicionDe("selectores-descendientes")).toBeLessThan(posicionDe("especificidad"));
    expect(posicionDe("pseudo-clases")).toBeLessThan(posicionDe("especificidad"));
  });

  it("el layout moderno viene despues del box model y las unidades", () => {
    for (const layout of ["flexbox", "css-grid", "posicionamiento"]) {
      expect(posicionDe("box-model")).toBeLessThan(posicionDe(layout));
      expect(posicionDe("unidades-css")).toBeLessThan(posicionDe(layout));
    }
  });

  it("media-queries viene despues de flexbox y grid", () => {
    // Un layout responsive se explica sobre un layout que el alumno ya sabe hacer.
    expect(posicionDe("flexbox")).toBeLessThan(posicionDe("media-queries"));
    expect(posicionDe("css-grid")).toBeLessThan(posicionDe("media-queries"));
  });

  it("los frameworks y el proyecto cierran el track", () => {
    const ultimo = cssModules.length;
    expect(posicionDe("proyecto-cv-css")).toBe(ultimo);
    for (const base of ["flexbox", "css-grid", "media-queries", "variables-css"]) {
      expect(posicionDe(base)).toBeLessThan(posicionDe("bootstrap-5"));
      expect(posicionDe(base)).toBeLessThan(posicionDe("tailwind-css"));
      expect(posicionDe(base)).toBeLessThan(posicionDe("proyecto-cv-css"));
    }
  });

  it("los preprocesadores vienen despues de todo el CSS nativo", () => {
    for (const nativo of ["variables-css", "shadows-gradients-filters"]) {
      expect(posicionDe(nativo)).toBeLessThan(posicionDe("sass-fundamentos"));
    }
    expect(posicionDe("sass-fundamentos")).toBeLessThan(posicionDe("sass-avanzado"));
  });

  /**
   * The distinction this file originally missed.
   *
   * A first pass counted every mention of a not-yet-taught property and reported
   * 24 "forward references". Most were not defects:
   *
   * - A lesson example cannot be written with no properties at all. Seeing
   *   `padding: 20px` inside a demo one module before the box model explains it
   *   is normal, the same way `color: red` precedes any colour theory.
   * - `float-display` previews `display: flex` and `display: grid` on purpose and
   *   says so in the text: "Aprenderemos Flexbox y Grid en profundidad en modulos
   *   posteriores." That is good teaching, not debt.
   * - Units and dimensions are genuinely CIRCULAR. You cannot teach `width`
   *   without a unit, nor demonstrate `vw` without a property to put it on. No
   *   ordering resolves it; the resolution is pedagogical -- introduce `px` and
   *   `%` informally, then deepen them in the units module.
   *
   * What IS a defect is an EXERCISE that requires a concept taught much later,
   * because the student cannot solve it from what they know. `10-ej-08` asked for
   * `display: flex`, `align-items` and `justify-content` -- taught ten modules
   * later -- with the three properties dictated in the prompt, so the only way
   * through was transcription. It was rewritten to centre with the units the
   * module actually teaches.
   */
  it("ningun EJERCICIO exige un concepto que se ensena mucho despues", () => {
    // Solo propiedades que definen una tecnica, no valores basicos. Y un umbral
    // de 3 modulos: un salto corto es tolerable, diez no.
    const TECNICAS: Array<[RegExp, string]> = [
      [/display:\s*flex|\bflex-direction\b|\bjustify-content\b|\balign-items\b/i, "flexbox"],
      [/display:\s*grid|\bgrid-template\b|\bgrid-column\b/i, "css-grid"],
      [new RegExp(MEDIA_RESPONSIVE, "i"), "media-queries"],
      [/\btransition\s*:|@keyframes/i, "transiciones-animaciones"],
      [/\bvar\(--/i, "variables-css"],
      [/\bbox-shadow\s*:|linear-gradient\(/i, "shadows-gradients-filters"],
    ];
    const SALTO_TOLERADO = 3;

    const defectos: string[] = [];
    for (const m of cssModules) {
      for (const e of m.exercises) {
        // Lo que el alumno tiene que producir o leer para resolverlo.
        const requerido = `${e.prompt} ${e.targetCSS ?? ""} ${e.hint ?? ""}`;
        for (const [patron, tecnica] of TECNICAS) {
          const destino = posicionDe(tecnica);
          if (m.order >= destino) continue;
          if (destino - m.order <= SALTO_TOLERADO) continue;
          if (patron.test(requerido)) {
            defectos.push(`${m.slug}/${e.id} exige ${tecnica} (se ensena en ${destino}, faltan ${destino - m.order} modulos)`);
          }
        }
      }
    }
    expect(defectos).toEqual([]);
  });

  it("MIDE la deuda restante en lecciones, que es tolerable pero no invisible", () => {
    // Este test no falla: mide. El curriculum nunca se escribio con un orden de
    // dependencias estricto, y arreglarlo del todo es editar CONTENIDO, no
    // reordenar. El reorden resolvio las dos inversiones estructurales; esto
    // deja el resto medido para que deje de ser invisible.
    //
    // El caso dominante es `display: flex`, usado en 6 modulos antes del 15.
    const ENSENA: Array<[RegExp, string, string]> = [
      [/\bbox-sizing\b/g, "box-sizing", "box-model"],
      [/\bpadding\s*:/g, "padding:", "box-model"],
      [/\bmargin\s*:/g, "margin:", "box-model"],
      [/\bline-height\s*:/g, "line-height:", "tipografias"],
      [/\bfont-family\s*:/g, "font-family:", "tipografias"],
      [/\btext-align\s*:/g, "text-align:", "tipografias"],
      [/\bmax-width\s*:/g, "max-width:", "dimensiones"],
      [/\baspect-ratio\s*:/g, "aspect-ratio:", "dimensiones"],
      [/:has\(/g, ":has(", "pseudo-clases"],
      [/:is\(/g, ":is(", "especificidad"],
      [/:where\(/g, ":where(", "especificidad"],
      [/@layer\b/g, "@layer", "especificidad"],
      [/\bsubgrid\b/g, "subgrid", "css-grid"],
      [/@container\b/g, "@container", "media-queries"],
      [/@supports\b/g, "@supports", "media-queries"],
      [/display:\s*flex/g, "display:flex", "flexbox"],
      [/\bjustify-content\s*:/g, "justify-content:", "flexbox"],
      [/display:\s*grid/g, "display:grid", "css-grid"],
      [new RegExp(MEDIA_RESPONSIVE, "g"), "@media responsive", "media-queries"],
      [/\btransition\s*:/g, "transition:", "transiciones-animaciones"],
    ];

    const casos: string[] = [];
    for (const m of cssModules) {
      const texto =
        m.lessons.map((l) => l.content + JSON.stringify(l.codeExample ?? {})).join("\n") +
        JSON.stringify(m.exercises);
      for (const [patron, nombre, dondeSeEnsena] of ENSENA) {
        const destino = posicionDe(dondeSeEnsena);
        if (m.order >= destino) continue;
        const n = texto.match(patron)?.length ?? 0;
        if (n > 0) casos.push(`mod ${m.order} ${m.slug} usa ${nombre} x${n} (se ensena en ${destino})`);
      }
    }

    // Umbral, no cero: baja este numero cuando arregles contenido, y nunca lo
    // subas. Si sube, alguien introdujo una referencia hacia adelante nueva.
    //
    // 24 -> 23. El valor real medido con shell era EXACTAMENTE 24, o sea que el
    // techo no tenia ni un caso de margen: cualquier renumeracion lo rompia. Al
    // agrupar en secciones css-* la posicion de `media-queries` y de
    // `tipografias` se movio y el conteo subio a 26; afinar el patron de @media
    // a las media queries responsive lo dejo en 23, que es el numero de abajo.
    // Un techo flojo por la cantidad exacta de una regresion no es un techo.
    expect(casos.length).toBeLessThanOrEqual(23);
  });
});
