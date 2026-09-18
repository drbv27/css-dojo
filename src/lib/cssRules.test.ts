import { describe, it, expect } from "vitest";
import { parseCssRules, compararReglas } from "./cssRules";
import { ALL_MODULES } from "@/data/modules";
import { cssEsperadoDe } from "@/lib/calificar";

describe("parseCssRules", () => {
  it("parses a rule into selector and declarations", () => {
    const r = parseCssRules("h1 { color: red; font-size: 20px; }");
    expect([...r.keys()]).toEqual(["h1"]);
    expect([...r.get("h1")!]).toEqual(["color: red", "font-size: 20px"]);
  });

  it("returns an empty map for prose, which is what makes prose ungradeable", () => {
    expect(parseCssRules("display flex justify-content center").size).toBe(0);
    expect(parseCssRules("no tengo idea de css p color blue").size).toBe(0);
    expect(parseCssRules("").size).toBe(0);
  });

  it("ignores comments so answers cannot be smuggled inside them", () => {
    expect(parseCssRules("/* h1 { color: red } */").size).toBe(0);
  });

  it("folds case on the tag name and on the property, plus whitespace", () => {
    const a = parseCssRules("H1{COLOR:RED}");
    const b = parseCssRules("h1 {\n  color : red ;\n}");
    expect([...a.get("h1")!]).toEqual([...b.get("h1")!]);
  });

  it("preserves internal value spacing for multi-part values", () => {
    const r = parseCssRules("div { padding: 10px   20px; }");
    expect([...r.get("div")!]).toEqual(["padding: 10px 20px"]);
  });

  it("expands a selector list so each selector carries the declarations", () => {
    const r = parseCssRules("h1, h2 { color: red; }");
    expect([...r.keys()].sort()).toEqual(["h1", "h2"]);
    expect([...r.get("h2")!]).toEqual(["color: red"]);
  });

  it("keys declarations inside an at-rule by their condition", () => {
    const r = parseCssRules("@media (max-width: 600px) { .caja { display: none; } }");
    const clave = [...r.keys()][0];
    expect(clave).toContain("@media");
    expect(clave).toContain(".caja");
    expect([...r.get(clave)!]).toEqual(["display: none"]);
  });

  it("does not confuse a declaration inside a media query with one outside it", () => {
    const r = parseCssRules(
      ".caja { display: flex; } @media (max-width: 600px) { .caja { display: none; } }"
    );
    expect([...r.get(".caja")!]).toEqual(["display: flex"]);
    expect(r.size).toBe(2);
  });

  it("survives unbalanced braces without throwing", () => {
    expect(() => parseCssRules("h1 { color: red")).not.toThrow();
    expect(() => parseCssRules("}}} h1 { color: red }")).not.toThrow();
  });

  it("merges declarations when a selector appears twice", () => {
    const r = parseCssRules("p { color: red; } p { margin: 0; }");
    expect([...r.get("p")!].sort()).toEqual(["color: red", "margin: 0"]);
  });
});

describe("selectores de atributo: comillas equivalentes", () => {
  /**
   * Medido antes del arreglo: un alumno que respondia `[href^='https']` contra un
   * target `[href^="https"]` puntuaba 0%, y `[href^=https]` tambien. Las dos
   * formas son CSS valido. Afectaba tres ejercicios, todos de attribute-selectors.
   */
  it("las tres formas de escribir el mismo valor son UNA sola clave", () => {
    const dobles = parseCssRules('a[href^="https"] { color: teal; }');
    const simples = parseCssRules("a[href^='https'] { color: teal; }");
    const desnudo = parseCssRules("a[href^=https] { color: teal; }");
    expect([...simples.keys()]).toEqual([...dobles.keys()]);
    expect([...desnudo.keys()]).toEqual([...dobles.keys()]);
  });

  it("puntua 100 cuando el alumno cambia el estilo de comilla", () => {
    const target = 'a[href^="https"] { color: teal; }';
    expect(compararReglas(target, "a[href^='https'] { color: teal; }").score).toBe(100);
    expect(compararReglas(target, "a[href^=https] { color: teal; }").score).toBe(100);
  });

  it("los espacios dentro del corchete no crean otra clave", () => {
    const target = 'a[href^="https"] { color: teal; }';
    expect(compararReglas(target, 'a[ href ^= "https" ] { color: teal; }').score).toBe(100);
  });

  /**
   * Esta es la mitad que NO se relaja, y es a proposito. `mailto:` sin comillas no
   * es un identificador CSS valido -- los dos puntos no van ahi -- asi que el
   * navegador no lo matchea. Aprobarlo le ensenaria al alumno que funciona.
   */
  it("un valor sin comillas que NO es identificador valido sigue fallando", () => {
    const target = 'a[href^="mailto:"] { color: teal; }';
    expect(compararReglas(target, "a[href^=mailto:] { color: teal; }").score).toBe(0);
    const pdf = 'a[href$=".pdf"] { color: teal; }';
    expect(compararReglas(pdf, "a[href$=.pdf] { color: teal; }").score).toBe(0);
  });

  it("la bandera de insensibilidad sigue distinguiendo, porque cambia el significado", () => {
    const conBandera = 'a[href^="https" i] { color: teal; }';
    const sinBandera = 'a[href^="https"] { color: teal; }';
    expect(compararReglas(sinBandera, conBandera).score).toBe(0);
    // Y entre si, las dos comillas con bandera siguen siendo la misma clave.
    expect(compararReglas(conBandera, "a[href^='https' i] { color: teal; }").score).toBe(100);
  });

  it("un atributo sin valor no se toca", () => {
    const r = parseCssRules("input[required] { border-color: red; }");
    expect([...r.keys()]).toEqual(["input[required]"]);
    expect(compararReglas("input[required] { border-color: red; }", "input[ required ] { border-color: red; }").score).toBe(100);
  });

  it("los cinco operadores sobreviven la normalizacion", () => {
    for (const op of ["=", "^=", "$=", "*=", "|="]) {
      const target = `a[data-x${op}"v"] { color: teal; }`;
      expect(compararReglas(target, `a[data-x${op}'v'] { color: teal; }`).score).toBe(100);
    }
    // Y no se confunden entre si.
    expect(compararReglas('a[data-x^="v"] { color: teal; }', 'a[data-x$="v"] { color: teal; }').score).toBe(0);
  });
});

describe("caja: se pliega donde CSS la ignora, y solo ahi", () => {
  /**
   * Antes se bajaba el selector entero con un `.toLowerCase()`. Eso plegaba la
   * clase, el id y el valor del atributo, que en CSS SI distinguen caja, asi que
   * un alumno que escribia `.Caja` contra un `class="caja"` aprobaba con CSS que
   * el navegador no matchea. Falso positivo.
   */
  it("la ETIQUETA, la pseudo-clase y el pseudo-elemento siguen ignorando la caja", () => {
    expect(compararReglas("DIV { color: red; }", "div { color: red; }").score).toBe(100);
    expect(compararReglas("a:HOVER { color: red; }", "a:hover { color: red; }").score).toBe(100);
    expect(compararReglas("p::BEFORE { color: red; }", "p::before { color: red; }").score).toBe(100);
  });

  it("el NOMBRE del atributo y la bandera siguen ignorando la caja", () => {
    expect(compararReglas("[HREF] { color: red; }", "[href] { color: red; }").score).toBe(100);
    expect(compararReglas('[HREF^="https"] { color: red; }', '[href^="https"] { color: red; }').score).toBe(100);
    expect(compararReglas('[href^="https" I] { color: red; }', '[href^="https" i] { color: red; }').score).toBe(100);
  });

  it("la CLASE distingue caja, porque en HTML el atributo class la distingue", () => {
    expect(compararReglas(".Caja { color: red; }", ".caja { color: red; }").score).toBe(0);
    expect(compararReglas(".caja { color: red; }", ".caja { color: red; }").score).toBe(100);
  });

  it("el ID distingue caja", () => {
    expect(compararReglas("#Menu { color: red; }", "#menu { color: red; }").score).toBe(0);
  });

  it("el VALOR del atributo distingue caja, con comillas y sin ellas", () => {
    expect(compararReglas('[href^="HTTPS"] { color: red; }', '[href^="https"] { color: red; }').score).toBe(0);
    expect(compararReglas("[href^=HTTPS] { color: red; }", "[href^=https] { color: red; }").score).toBe(0);
    // Y el mismo valor con distinta comilla sigue siendo la misma clave.
    expect(compararReglas('[href^="HTTPS"] { color: red; }', "[href^='HTTPS'] { color: red; }").score).toBe(100);
  });

  /**
   * Este test existe por un hallazgo de la revision, y vale contarlo: el test de
   * arriba comparaba `HTTPS` contra `https`, que difiere en las CINCO letras, asi
   * que daba 0% por el `HTTP` inicial y TAPABA un defecto en la ultima. El grupo
   * de la bandera aceptaba cero espacios y el valor se capturaba de forma perezosa,
   * asi que un valor SIN COMILLAS terminado en i/s/I/S perdia su ultima letra: se
   * leia como la bandera y se bajaba a minuscula. `[data-x=aS]` y `[data-x=as]`
   * daban la MISMA clave.
   *
   * Un test que pasa por la razon equivocada es peor que no tenerlo, porque da
   * confianza falsa. Aca la diferencia esta SOLO en el ultimo caracter.
   */
  it("un valor sin comillas terminado en i/s tambien distingue caja", () => {
    for (const [a, b] of [
      ["[data-x=aS]", "[data-x=as]"],
      ["[data-x=aI]", "[data-x=ai]"],
      ["[href^=httpS]", "[href^=https]"],
    ]) {
      expect(compararReglas(`${a} { color: red; }`, `${b} { color: red; }`).score).toBe(0);
    }
  });

  it("sin comillas, la bandera NECESITA un espacio: `[a=bi]` vale `bi`", () => {
    // En CSS `[a=bi]` es el valor `bi`, no el valor `b` con bandera `i`.
    const claves = [...parseCssRules("[data-x=bi] { color: red; }").keys()];
    expect(claves).toEqual(['[data-x="bi"]']);
    // Con el espacio si es bandera, y entonces NO es lo mismo que sin ella.
    expect(compararReglas("[data-x=b i] { color: red; }", "[data-x=b] { color: red; }").score).toBe(0);
    expect(compararReglas("[data-x=b i] { color: red; }", '[data-x="b" i] { color: red; }').score).toBe(100);
  });

  it("un `]` literal dentro de comillas no parte el corchete", () => {
    // `[data-ids="a]b"]` es CSS valido: el primer `]` esta adentro del string.
    // Cortar ahi plegaba en silencio la caja de todo lo que venia despues.
    expect([...parseCssRules('[data-ids="a]B"] { color: red; }').keys()]).toEqual(['[data-ids="a]B"]']);
    expect([...parseCssRules('.Caja[data-ids="a]B"] .Otra { color: red; }').keys()]).toEqual([
      '.Caja[data-ids="a]B"] .Otra',
    ]);
    expect([...parseCssRules('[a="x]y"][b="z]w"] { color: red; }').keys()]).toEqual(['[a="x]y"][b="z]w"]']);
  });

  /**
   * Dos casos que salieron de la SEGUNDA vuelta de revision sobre este mismo
   * cambio. Los dos terminaban en el mismo dano -- la cola del selector se
   * plegaba -- y los dos venian de codigo nuevo.
   */
  it("una comilla escapada no cierra el string, y la cola conserva su caja", () => {
    // `[data-x="a\"b"]` es CSS valido: la comilla del medio esta escapada. Sin
    // tratar la barra, el escaneo del corchete perdia el hilo y devolvia -1.
    expect([...parseCssRules('.Caja[data-x="a\\"b"] #Menu { color: red; }').keys()]).toEqual([
      '.Caja[data-x="a\\"b"] #Menu',
    ]);
    expect([...parseCssRules(".Caja[data-x='a\\'b'] #Menu { color: red; }").keys()]).toEqual([
      ".Caja[data-x='a\\'b'] #Menu",
    ]);
  });

  it("un corchete sin cerrar deja el resto INTACTO en lugar de plegarlo", () => {
    // Entrada malformada. Plegar lo que no se pudo parsear cambiaba en silencio la
    // caja de las clases y los ids que venian despues, justo lo contrario de lo que
    // esta funcion promete.
    expect([...parseCssRules("[data-x #Menu { color: red; }").keys()]).toEqual(["[data-x #Menu"]);
    expect([...parseCssRules(".Caja [data-x #Menu { color: red; }").keys()]).toEqual([
      ".Caja [data-x #Menu",
    ]);
  });

  /**
   * De la CUARTA vuelta de revision, y el hallazgo real no fueron los dos casos de
   * abajo: fue que `cajaDeAtributo` era TODO-O-NADA sobre una sola regex. Si el
   * patron no matcheaba el bloque entero, el texto volvia intacto y el NOMBRE del
   * atributo se escapaba del plegado en silencio. Comilla escapada y namespace
   * caian los dos en ese agujero, y mañana caeria otra forma.
   *
   * El arreglo no fue agregar dos alternativas al patron: fue ubicar el nombre por
   * ESTRUCTURA -- todo lo que hay antes del primer `=`, menos el operador -- sin
   * intentar entender el valor. Asi cualquier forma no modelada sigue plegando el
   * nombre, que es la parte que en HTML nunca distingue caja.
   *
   * Y el test anterior de comilla escapada NO podia detectar esto, porque usaba un
   * nombre ya en minuscula. Es el mismo error que el `HTTPS` de mas arriba: probaba
   * la cola y no el nombre.
   */
  it("el nombre del atributo se pliega aunque la forma del valor sea exotica", () => {
    // Comilla escapada: rompia la alternativa "[^"]*" y el nombre quedaba en MAYUS.
    expect(compararReglas('[DATA-X="a\\"b"] { color: red; }', '[data-x="a\\"b"] { color: red; }').score).toBe(100);
    // Namespace: el `|` no entraba en `[\w-]+` y pasaba lo mismo.
    expect(compararReglas("[XML|Lang] { color: red; }", "[xml|lang] { color: red; }").score).toBe(100);
    expect(compararReglas("[XML|Lang='es'] { color: red; }", "[xml|lang='es'] { color: red; }").score).toBe(100);
    // Y el valor sigue distinguiendo caja aunque haya namespace.
    expect(compararReglas("[xml|lang='ES'] { color: red; }", "[xml|lang='es'] { color: red; }").score).toBe(0);
  });

  it("el `|` de namespace no se confunde con el operador `|=`", () => {
    // En `[xml|lang]` el `|` separa el namespace; en `[lang|=es]` es el operador.
    // Los distingue estar pegado al `=`.
    expect([...parseCssRules("[xml|lang] { color: red; }").keys()]).toEqual(["[xml|lang]"]);
    expect([...parseCssRules("[lang|=es] { color: red; }").keys()]).toEqual(['[lang|="es"]']);
    expect(compararReglas("[lang|=es] { color: red; }", "[lang=es] { color: red; }").score).toBe(0);
  });

  /**
   * BRECHA CONOCIDA Y NO ARREGLADA, para que quede fijada. Con namespace, la
   * comilla NO se canonicaliza: eso lo hace `unCorchete`, cuyo patron de nombre es
   * `[\w-]+` y tampoco admite el `|`. Sin namespace la comilla simple y la doble
   * son la misma clave; con namespace no.
   *
   * No se arregla porque un selector de atributo con namespace necesita una
   * declaracion `@namespace` para funcionar, no aparece en NINGUN ejercicio del
   * repo, y arreglarlo pide repetir en `unCorchete` la misma desambiguacion del
   * `|=`. Mas superficie por una forma que nadie usa.
   */
  it("BRECHA CONOCIDA: con namespace la comilla no se canonicaliza", () => {
    expect(compararReglas("[xml|lang='es'] { color: red; }", '[xml|lang="es"] { color: red; }').score).toBe(0);
    // Sin namespace, lo mismo si funciona.
    expect(compararReglas("[lang='es'] { color: red; }", '[lang="es"] { color: red; }').score).toBe(100);
  });

  it("un selector mezclado pliega cada parte por separado", () => {
    const claves = [...parseCssRules('DIV.Caja #Menu:HOVER[HREF^="HTTPS" I] { color: red; }').keys()];
    expect(claves).toEqual(['div.Caja #Menu:hover[href^="HTTPS" i]']);
  });

  /**
   * EL PRECIO, para que quede fijado y no se descubra por sorpresa. HTML define
   * atributos legados cuyo valor SI se matchea sin distinguir caja, y `type` es
   * uno. Este grader los trata como sensibles, asi que esto puntua 0 aunque el
   * navegador lo aceptaria. Se eligio errar hacia estricto: mantener la lista de
   * esos atributos a mano es la clase de dato que deriva, y un falso negativo
   * angosto es preferible a un falso positivo que ensena mal.
   */
  it("DEUDA CONOCIDA: los atributos legados case-insensibles de HTML se tratan como sensibles", () => {
    expect(compararReglas('[type="TEXT"] { color: red; }', '[type="text"] { color: red; }').score).toBe(0);
  });

  /**
   * DEUDA CONOCIDA, MEDIDA Y NO ARREGLADA: el VALOR de una declaracion se sigue
   * bajando entero. Eso pliega cosas que en CSS distinguen caja -- el nombre de
   * un `@keyframes`, una custom property, un nombre de contador.
   *
   * Por que no se arregla junto con la caja de los selectores: medido sobre los
   * targetCSS del repo, nueve declaraciones traen mayuscula en el valor y OCHO
   * son inofensivas. `Arial` y `Georgia` son nombres de fuente, que los
   * navegadores matchean sin distinguir caja, y `translateY`, `scaleY`, `rotateY`
   * son nombres de FUNCION CSS, que son case-insensibles: `TRANSLATEY(4px)`
   * funciona. Solo una es genuinamente sensible, el `fadeIn` de
   * `animation: fadeIn 1s ease-out forwards`, que nombra un @keyframes.
   *
   * O sea que poner el valor estricto cambiaria UN falso positivo real por VARIOS
   * falsos negativos en nombres de funcion, que son comunes. Va en la direccion
   * contraria. Hacerlo bien exige distinguir, dentro del valor, las palabras
   * clave y funciones (insensibles) de los identificadores que nombran algo que
   * el autor definio (sensibles), y eso es semantica de CSS de verdad, no algo
   * que un grader de ejercicios deba cargar.
   */
  it("DEUDA CONOCIDA: el valor de una declaracion se sigue plegando entero", () => {
    // Esto es correcto y debe seguir aceptandose: `red` es palabra clave.
    expect(compararReglas("a { color: RED; }", "a { color: red; }").score).toBe(100);
    // Y esto NO deberia aceptarse, porque nombra un @keyframes. Queda como deuda.
    expect(compararReglas("a { animation-name: Girar; }", "a { animation-name: girar; }").score).toBe(100);
  });
});

describe("compararReglas", () => {
  const esperado = "h1 { color: red; }\np { color: blue; }";

  it("accepts a correct answer regardless of formatting", () => {
    expect(compararReglas(esperado, "h1{color:red}p{color:blue}").correct).toBe(true);
    expect(
      compararReglas(esperado, "p {\n color:   BLUE;\n}\nh1 { color: red; }").correct
    ).toBe(true);
  });

  it("REJECTS the prose exploit that passed the old includes validator", () => {
    // These three scored 100% before: the old validator searched the raw text
    // for the loose tokens ["p", "color", "blue", ...].
    for (const trampa of [
      "h1 color red p color blue",
      "no tengo idea de css h1 color red p color blue",
      "/* h1 color red p color blue */",
    ]) {
      const r = compararReglas(esperado, trampa);
      expect(r.correct).toBe(false);
      expect(r.score).toBe(0);
    }
  });

  it("REJECTS declarations placed under the wrong selector", () => {
    // Swapped bodies. The old token-based validator could not see this at all.
    const r = compararReglas(esperado, "h1 { color: blue; } p { color: red; }");
    expect(r.correct).toBe(false);
  });

  it("gives partial credit for partial work", () => {
    const r = compararReglas(esperado, "h1 { color: red; }");
    expect(r.score).toBe(50);
    expect(r.correct).toBe(false);
    expect(r.faltantes).toEqual(["p { color: blue }"]);
  });

  it("ignores extra declarations the student adds beyond what was asked", () => {
    const r = compararReglas(esperado, "h1 { color: red; margin: 0 } p { color: blue }");
    expect(r.correct).toBe(true);
  });

  it("scores 0 when nothing was submitted", () => {
    expect(compararReglas(esperado, "").score).toBe(0);
  });

  it("returns 0 rather than a free pass when the expected CSS is unparseable", () => {
    expect(compararReglas("not css at all", "h1 { color: red }").correct).toBe(false);
  });
});

describe("background y background-color son la misma declaracion con un color", () => {
  /**
   * Lo reporto un alumno el 2026-08-31: escribio `background-color: #f5f5f5`
   * donde el ejercicio esperaba `background: #f5f5f5` y le dijo "Incorrecto".
   *
   * Medido sobre el curriculum: NO era un ejercicio, eran 49. Doce esperaban el
   * atajo y bajaban a 78-91; treinta y siete esperaban la especifica y bajaban
   * HASTA 0, porque los mini retos son todo o nada. Un alumno que escribia
   * `background: red` donde el ejercicio queria `background-color: red` sacaba
   * cero con CSS impecable.
   *
   * Con un color solo las dos pintan igual: el atajo resetea imagen, posicion y
   * repeticion a sus valores iniciales, que es donde ya estaban.
   */
  it("las acepta en las DOS direcciones", () => {
    expect(compararReglas(".a { background: #f5f5f5; }", ".a { background-color: #f5f5f5; }").score).toBe(100);
    expect(compararReglas(".a { background-color: #f5f5f5; }", ".a { background: #f5f5f5; }").score).toBe(100);
  });

  it("vale para hex, nombre, rgb, hsl y transparent", () => {
    const pares: [string, string][] = [
      ["steelblue", "steelblue"],
      ["rgb(10, 20, 30)", "rgb(10, 20, 30)"],
      ["rgba(0, 0, 0, 0.5)", "rgba(0, 0, 0, 0.5)"],
      ["hsl(200, 50%, 40%)", "hsl(200, 50%, 40%)"],
      ["transparent", "transparent"],
    ];
    for (const [a, b] of pares) {
      expect(compararReglas(`.a { background: ${a}; }`, `.a { background-color: ${b}; }`).score).toBe(100);
    }
  });

  it("OJO CON rgb(): el normalizador le deja espacios y casi lo descarta", () => {
    // `rgb(10, 20, 30)` tiene espacios despues de las comas. La primera version
    // de esta equivalencia chequeaba "sin espacios" ANTES que la forma rgb(), y
    // le daba 0 a un color perfectamente valido.
    expect(compararReglas(".a { background: rgb(1, 2, 3); }", ".a { background-color: rgb(1, 2, 3); }").score).toBe(100);
  });

  it("NO las acepta cuando el valor no es un color solo", () => {
    // Aca esta el limite, y es lo que separa relajar de romper. Aceptar de mas
    // seria aprobar CSS que NO hace lo mismo.
    const invalidos: [string, string][] = [
      // background-color con un degradado no es CSS valido
      [".a { background: linear-gradient(red, blue); }", ".a { background-color: linear-gradient(red, blue); }"],
      // una custom property puede tener un degradado adentro
      [".a { background: var(--f); }", ".a { background-color: var(--f); }"],
      // multiples valores: el atajo tambien pone la imagen
      [".a { background: red url(x.png); }", ".a { background-color: red url(x.png); }"],
    ];
    for (const [esperado, enviado] of invalidos) {
      expect(compararReglas(esperado, enviado).score).toBe(0);
    }
  });

  it("un color DISTINTO sigue estando mal", () => {
    expect(compararReglas(".a { background: red; }", ".a { background-color: blue; }").score).toBe(0);
  });

  it("la equivalencia no se derrama a otras propiedades", () => {
    expect(compararReglas(".a { color: red; }", ".a { background-color: red; }").score).toBe(0);
    expect(compararReglas(".a { border-color: red; }", ".a { border: red; }").score).toBe(0);
  });
});

describe("font-family comillado no penaliza CSS valido", () => {
  /**
   * Lo reporto un alumno de `tipografia-web`: escribio la pila de fuentes sin
   * comillas o con comilla simple, CSS valido, y el grader le dijo
   * "Incorrecto". La causa: `normalizarDeclaracion` bajaba el valor a
   * minusculas y normalizaba comas, pero no las comillas, asi que en
   * `font-family` la comilla quedaba adentro de la clave de comparacion.
   *
   * Medido con `compararReglas` contra los targets reales del curriculum,
   * ANTES de este arreglo: las cinco `font-family` comilladas del curriculum
   * fallaban igual sin comillas que con comilla simple -- `32-ej-02` daba 67,
   * `32-ej-05` daba 67, `32-ej-06` daba 75, `32-ej-08` daba 71 y `32-ej-reto`
   * daba 80. Las cinco viven en `tipografia-web`.
   */
  it("acepta comilla simple y sin comillas contra un target que comilla un nombre con espacios", () => {
    const target =
      '.titular { font-family: Georgia, "Times New Roman", serif; font-size: 32px; color: #2c2c2c; }';
    const variantes = [
      ".titular { font-family: Georgia, 'Times New Roman', serif; font-size: 32px; color: #2c2c2c; }",
      ".titular { font-family: Georgia, Times New Roman, serif; font-size: 32px; color: #2c2c2c; }",
    ];
    for (const enviado of variantes) {
      expect(compararReglas(target, enviado).score).toBe(100);
    }
  });

  it("acepta la pila que literalmente pide el enunciado de 32-ej-05", () => {
    const target =
      '.cuerpo { font-family: "Poppins", "Segoe UI", sans-serif; font-size: 17px; line-height: 1.7; }';
    const variantes = [
      // Lo que el enunciado le pide textualmente al alumno: "Poppins", 'Segoe UI', sans-serif.
      '.cuerpo { font-family: Poppins, "Segoe UI", sans-serif; font-size: 17px; line-height: 1.7; }',
      ".cuerpo { font-family: 'Poppins', 'Segoe UI', sans-serif; font-size: 17px; line-height: 1.7; }",
      ".cuerpo { font-family: Poppins, Segoe UI, sans-serif; font-size: 17px; line-height: 1.7; }",
    ];
    for (const enviado of variantes) {
      expect(compararReglas(target, enviado).score).toBe(100);
    }
  });

  it("vale tambien para el font-family de adentro de un @font-face", () => {
    const target = '@font-face { font-family: "MiFuente"; }';
    expect(compararReglas(target, "@font-face { font-family: MiFuente; }").score).toBe(100);
  });

  // A partir de aca, los controles de que NO nos pasamos de rosca. Viven en
  // `it`s separados de los de arriba a proposito: si vivieran en el mismo
  // test, el segundo assert no probaria nada -- ver `dos_controles_que_fallan_en_tests_distintos`.

  it("NO lo acepta cuando el nombre sin comillas seria CSS invalido", () => {
    // "2Toons" arranca con un digito: sin comillas no es un identificador
    // valido, asi que sacarle la comilla seria aprobar CSS que el navegador
    // no acepta. Tiene que seguir siendo una clave distinta.
    const target = '.a { font-family: "2Toons", serif; }';
    expect(compararReglas(target, ".a { font-family: 2Toons, serif; }").score).not.toBe(100);
  });

  it("una pila de fuentes DISTINTA sigue estando mal", () => {
    expect(compararReglas(".a { font-family: Georgia, serif; }", ".a { font-family: Arial, serif; }").score).toBe(0);
  });

  it("la normalizacion no se derrama a otras propiedades", () => {
    // Solo font-family le saca la comilla a su valor. Cualquier otra
    // propiedad con un valor entre comillas sigue distinguiendo la comilla.
    expect(compararReglas('.a { content: "abc"; }', ".a { content: abc; }").score).toBe(0);
  });

  it('content: "" sigue existiendo como declaracion (no es un strip global de comillas)', () => {
    const r = parseCssRules('.a::after { content: ""; }');
    expect([...r.get(".a::after")!]).toEqual(['content: ""']);
  });

  it("08-ej-06 de pseudo-elementos sigue pidiendo sus 6 declaraciones", () => {
    const modulo = ALL_MODULES.find((m) => m.slug === "pseudo-elementos")!;
    const ejercicio = modulo.exercises.find((e) => e.id === "08-ej-06")!;
    const esperado = parseCssRules(cssEsperadoDe(ejercicio));
    const totalDeclaraciones = [...esperado.values()].reduce((n, decls) => n + decls.size, 0);
    expect(totalDeclaraciones).toBe(6);
  });

  it("NO desnuda una generica ni una palabra clave global comillada -- es el error que el modulo ensena a evitar", () => {
    // Comillar la generica o la keyword CAMBIA lo que el CSS hace: `serif` es
    // LA familia generica, `"serif"` es una familia que se llama "serif".
    // Mismo caso con `inherit` vs `"inherit"`. Las cuatro tienen que seguir
    // siendo CLAVES DISTINTAS y por lo tanto seguir puntuando por debajo de
    // 100, aunque "serif"/"inherit" sean identificadores validos por si solos.
    expect(
      compararReglas(
        '.a { font-family: Georgia, "Times New Roman", serif; }',
        '.a { font-family: Georgia, "Times New Roman", "serif"; }'
      ).score
    ).not.toBe(100);

    expect(
      compararReglas(
        '.a { font-family: "Poppins", sans-serif; }',
        '.a { font-family: Poppins, "sans-serif"; }'
      ).score
    ).not.toBe(100);

    expect(
      compararReglas(".a { font-family: monospace; }", '.a { font-family: "monospace"; }').score
    ).not.toBe(100);

    expect(
      compararReglas(".a { font-family: inherit; }", '.a { font-family: "inherit"; }').score
    ).not.toBe(100);
  });

  it("las 14 declaraciones reales del curriculum siguen aceptando comillar SOLO el nombre de la fuente", () => {
    // Ancla contra regresion del arreglo de arriba: comillar el nombre de la
    // fuente (lo que SI hay que aceptar) no se tiene que romper por acotar la
    // desnudada a genericas/keywords.
    const tipografias = ALL_MODULES.find((m) => m.slug === "tipografias")!;
    const target0407 = cssEsperadoDe(tipografias.exercises.find((e) => e.id === "04-ej-07")!);
    const variante0407 =
      'h1 {\n  font-family: "Georgia", serif;\n  font-size: 36px;\n  font-weight: bold;\n}\n\np {\n  font-family: "Arial", sans-serif;\n  font-size: 16px;\n  font-weight: 400;\n}';
    expect(compararReglas(target0407, variante0407).score).toBe(100);

    const herencia = ALL_MODULES.find((m) => m.slug === "herencia-valores-globales")!;
    const target3307 = cssEsperadoDe(herencia.exercises.find((e) => e.id === "33-ej-07")!);
    const variante3307 =
      '.tarjeta {\n  color: #2c2c2c;\n  font-family: "Georgia", serif;\n}\n.tarjeta a {\n  color: inherit;\n  font-family: inherit;\n}';
    expect(compararReglas(target3307, variante3307).score).toBe(100);

    const tipografiaWeb = ALL_MODULES.find((m) => m.slug === "tipografia-web")!;
    const target3208 = cssEsperadoDe(tipografiaWeb.exercises.find((e) => e.id === "32-ej-08")!);
    // El target ya comilla solo el nombre ("Poppins"); la comilla simple es la
    // misma decision con el otro caracter de comilla.
    const variante3208 = target3208.replace(/"Poppins"/g, "'Poppins'");
    expect(compararReglas(target3208, variante3208).score).toBe(100);
  });
});

/**
 * Las OTRAS formas de escribir la MISMA declaracion.
 *
 * MEDIDO EL 2026-09-18 corriendo `calificar()` sobre los 652 ejercicios de
 * css/js/html: 71 de los 120 `css-rules` rechazaban al menos una forma
 * equivalente, 157 rechazos en total, y TRECE eran mini retos -- que puntuan
 * cien o cero, asi que ahi una declaracion escrita en su otra forma valida no
 * bajaba el puntaje, lo borraba. Despues del arreglo: 0 rechazos, 0 regresiones
 * sobre los 618 controles positivos. Informe en `informes/ejercicios.md`.
 *
 * CADA RELAJACION TIENE DOS TESTS, y el segundo es el que importa: uno prueba
 * que la forma equivalente ahora pasa, y otro prueba que aflojar la regla de mas
 * pone el guard en ROJO. Sin el segundo, la regla se ensancha sola con el tiempo
 * hasta aprobar CSS invalido, y un grader que aprueba CSS invalido le ensena
 * algo falso al alumno: lo descubre recien cuando no le funciona en el navegador.
 */
describe("atajos de caja: 16px y 16px 16px 16px 16px son la misma declaracion", () => {
  it("acepta las cuatro escrituras del mismo padding", () => {
    const target = ".a { padding: 16px; }";
    for (const v of ["16px", "16px 16px", "16px 16px 16px", "16px 16px 16px 16px"]) {
      expect(compararReglas(target, `.a { padding: ${v}; }`).score).toBe(100);
    }
  });

  it("acepta la forma larga de un margin de dos valores, que es la que escribe quien duda", () => {
    expect(compararReglas(".a { margin: 0 auto; }", ".a { margin: 0 auto 0 auto; }").score).toBe(100);
    expect(compararReglas(".a { margin: 10px 20px; }", ".a { margin: 10px 20px 10px 20px; }").score).toBe(100);
  });

  it("tambien pliega las de dos lados: gap y overflow", () => {
    expect(compararReglas(".a { gap: 12px; }", ".a { gap: 12px 12px; }").score).toBe(100);
    expect(compararReglas(".a { overflow: hidden; }", ".a { overflow: hidden hidden; }").score).toBe(100);
  });

  it("GUARD: valores distintos siguen estando mal, que es lo que la expansion NO puede borrar", () => {
    // Si la expansion se hiciera mal -- por ejemplo repitiendo el primer valor
    // en lugar de alternar -- estos dos empezarian a dar 100.
    expect(compararReglas(".a { padding: 10px 20px; }", ".a { padding: 20px 10px; }").score).toBe(0);
    expect(compararReglas(".a { padding: 10px 20px; }", ".a { padding: 10px 20px 30px 40px; }").score).toBe(0);
    // Tres valores reparten a-b-c-b: el de abajo deja 17px arriba, no 16px.
    expect(compararReglas(".a { padding: 16px; }", ".a { padding: 17px 16px 16px; }").score).toBe(0);
    // Cinco valores no son un shorthand valido, y no se canonizan.
    expect(compararReglas(".a { padding: 16px; }", ".a { padding: 16px 16px 16px 16px 16px; }").score).toBe(0);
  });

  it("GUARD: NO expande un var(), porque una custom property puede traer dos valores", () => {
    // `--e: 10px 20px` hace que `padding: var(--e)` valga dos valores, y
    // repetirlo cuatro veces produciria una declaracion que no es CSS valido.
    expect(
      compararReglas(".a { padding: var(--e); }", ".a { padding: var(--e) var(--e) var(--e) var(--e); }").score
    ).toBe(0);
  });

  it("GUARD: NO expande una palabra clave global, que tiene que ir sola", () => {
    // `padding: inherit` es valido; `padding: inherit inherit inherit inherit` no.
    // La regla vive en DOS lugares -- el corte temprano de `canonizarValor` y el
    // chequeo de `expandirCaja` -- y alcanza con cualquiera de los dos.
    // Verificado por mutacion: sacando los dos, este par salta de 0 a 100.
    expect(
      compararReglas(".a { padding: inherit; }", ".a { padding: inherit inherit inherit inherit; }").score
    ).toBe(0);
    expect(compararReglas(".a { margin: initial; }", ".a { margin: initial initial; }").score).toBe(0);
  });

  it("GUARD: NO expande un border-radius con barra, que lleva dos radios por esquina", () => {
    expect(
      compararReglas(".a { border-radius: 10px / 20px; }", ".a { border-radius: 10px 10px 10px 10px; }").score
    ).toBe(0);
    // El par que de verdad prueba el chequeo de la barra: sin el, los tres
    // tokens `10px / 20px` se reparten como a-b-c-b y producen `10px / 20px /`,
    // que pasaria a valer lo mismo. Verificado por mutacion: 0 -> 100.
    expect(
      compararReglas(".a { border-radius: 10px / 20px; }", ".a { border-radius: 10px / 20px /; }").score
    ).toBe(0);
  });
});

describe("atajos de linea: border no tiene orden fijo", () => {
  it("acepta los seis ordenes de ancho, estilo y color", () => {
    const target = ".a { border: 1px solid red; }";
    const ordenes = [
      "1px solid red",
      "1px red solid",
      "solid 1px red",
      "solid red 1px",
      "red 1px solid",
      "red solid 1px",
    ];
    for (const v of ordenes) {
      expect(compararReglas(target, `.a { border: ${v}; }`).score).toBe(100);
    }
  });

  it("ordena aunque el color sea un var(), que es como lo escribe el curriculum", () => {
    expect(
      compararReglas(
        ".a { border: 2px solid var(--acento); }",
        ".a { border: solid 2px var(--acento); }"
      ).score
    ).toBe(100);
    expect(
      compararReglas(
        ".a { border-bottom: 3px solid var(--cv-acento); }",
        ".a { border-bottom: solid var(--cv-acento) 3px; }"
      ).score
    ).toBe(100);
  });

  it("vale para los otros atajos que se escriben igual", () => {
    expect(compararReglas(".a { outline: 2px dashed blue; }", ".a { outline: dashed blue 2px; }").score).toBe(100);
  });

  it("GUARD: reordenar no puede tapar un componente DISTINTO", () => {
    expect(compararReglas(".a { border: 1px solid red; }", ".a { border: 2px solid red; }").score).toBe(0);
    expect(compararReglas(".a { border: 1px solid red; }", ".a { border: 1px dashed red; }").score).toBe(0);
    expect(compararReglas(".a { border: 1px solid red; }", ".a { border: 1px solid blue; }").score).toBe(0);
  });

  it("GUARD: un atajo que NO es CSS valido no se ordena ni se acepta", () => {
    // Dos estilos, o dos anchos, no son un `border`. Si la clasificacion
    // aceptara repetidos, el segundo pisaria al primero y un atajo INVALIDO
    // quedaria igual a uno valido: verificado por mutacion, sacando el chequeo
    // de repetidos este par salta de 0 a 100.
    expect(compararReglas(".a { border: solid red; }", ".a { border: solid solid red; }").score).toBe(0);
    expect(compararReglas(".a { border: 1px red; }", ".a { border: 1px 2px red; }").score).toBe(0);
    expect(compararReglas(".a { border: 1px solid red; }", ".a { border: solid solid red; }").score).toBe(0);
    expect(compararReglas(".a { border: 1px solid red; }", ".a { border: 1px 2px solid; }").score).toBe(0);
  });

  it("GUARD: el orden libre NO se derrama a border-width, que SI reparte por lado", () => {
    // `border-width: 1px 2px` es arriba/abajo y costados, no ancho y estilo.
    expect(compararReglas(".a { border-width: 1px 2px; }", ".a { border-width: 2px 1px; }").score).toBe(0);
  });
});

describe("colores: el mismo color escrito de otra manera", () => {
  it("acepta el hex corto contra el largo, y al reves", () => {
    expect(compararReglas(".a { color: #ffffff; }", ".a { color: #fff; }").score).toBe(100);
    expect(compararReglas(".a { color: #fff; }", ".a { color: #ffffff; }").score).toBe(100);
    expect(compararReglas(".a { border: 1px solid #cccccc; }", ".a { border: 1px solid #ccc; }").score).toBe(100);
  });

  it("acepta el nombre contra su hex en las propiedades que llevan color", () => {
    expect(compararReglas(".a { color: white; }", ".a { color: #ffffff; }").score).toBe(100);
    expect(compararReglas(".a { background-color: #ff0000; }", ".a { background-color: red; }").score).toBe(100);
    expect(compararReglas(".a { border: 1px solid steelblue; }", ".a { border: 1px solid #4682b4; }").score).toBe(100);
  });

  it("GUARD: dos colores DISTINTOS no se confunden, aunque se parezcan de nombre", () => {
    // Una sola entrada mal copiada en la tabla de 148 nombres aprobaria un color
    // que no es el pedido, que es el error caro. Por eso la tabla se genero
    // desde `color-name` y se contrasto entera contra la de Three.js.
    expect(compararReglas(".a { color: red; }", ".a { color: darkred; }").score).toBe(0);
    expect(compararReglas(".a { color: #ffffff; }", ".a { color: #fffffe; }").score).toBe(0);
    expect(compararReglas(".a { color: gray; }", ".a { color: darkgray; }").score).toBe(0);
  });

  it("GUARD: un nombre de color NO se traduce fuera de una propiedad de color", () => {
    // `Tomato` es una fuente que se llama Tomato, y `tomato` puede ser el nombre
    // de una animacion. Traducirlos a #ff6347 cambiaria lo que dicen.
    expect(compararReglas(".a { font-family: tomato; }", ".a { font-family: #ff6347; }").score).toBe(0);
    expect(compararReglas(".a { animation-name: tomato; }", ".a { animation-name: #ff6347; }").score).toBe(0);
  });
});

describe("cero: 0 y 0px son la misma longitud, y solo donde es una longitud", () => {
  it("acepta el cero con unidad y sin ella", () => {
    expect(compararReglas(".a { margin: 0 auto; }", ".a { margin: 0px auto; }").score).toBe(100);
    expect(compararReglas(".a { margin-top: 0; }", ".a { margin-top: 0px; }").score).toBe(100);
    expect(compararReglas(".a { box-shadow: 0 4px 15px red; }", ".a { box-shadow: 0px 4px 15px red; }").score).toBe(100);
  });

  it("GUARD: donde el cero es un NUMERO, 0px es invalido y tiene que seguir fallando", () => {
    // El navegador descarta `opacity: 0px`. Aceptarlo seria ensenarle al alumno
    // que esa declaracion funciona.
    expect(compararReglas(".a { opacity: 0; }", ".a { opacity: 0px; }").score).toBe(0);
    expect(compararReglas(".a { z-index: 0; }", ".a { z-index: 0px; }").score).toBe(0);
    expect(compararReglas(".a { line-height: 0; }", ".a { line-height: 0px; }").score).toBe(0);
    expect(compararReglas(".a { flex-grow: 0; }", ".a { flex-grow: 0px; }").score).toBe(0);
    expect(compararReglas(".a { flex: 0 0 250px; }", ".a { flex: 0px 0px 250px; }").score).toBe(0);
  });

  it("GUARD: 0% NO es 0, porque un porcentaje se resuelve contra otra medida", () => {
    expect(compararReglas(".a { width: 0; }", ".a { width: 0%; }").score).toBe(0);
  });

  it("GUARD: un cero no se come un valor que no lo es", () => {
    expect(compararReglas(".a { margin: 0; }", ".a { margin: 1px; }").score).toBe(0);
  });
});

describe("font-weight: bold y 700 son el mismo peso", () => {
  it("acepta la palabra contra el numero", () => {
    expect(compararReglas(".a { font-weight: bold; }", ".a { font-weight: 700; }").score).toBe(100);
    expect(compararReglas(".a { font-weight: 700; }", ".a { font-weight: bold; }").score).toBe(100);
    expect(compararReglas(".a { font-weight: normal; }", ".a { font-weight: 400; }").score).toBe(100);
  });

  it("GUARD: dos pesos distintos siguen siendo distintos", () => {
    expect(compararReglas(".a { font-weight: bold; }", ".a { font-weight: 800; }").score).toBe(0);
    expect(compararReglas(".a { font-weight: normal; }", ".a { font-weight: 300; }").score).toBe(0);
  });

  it("GUARD: la equivalencia NO se derrama a otras propiedades", () => {
    expect(compararReglas(".a { --peso: bold; }", ".a { --peso: 700; }").score).toBe(0);
  });
});

describe("comillas fuera de font-family: se unifica el caracter, NUNCA se saca", () => {
  it("acepta comilla simple en content, url y format", () => {
    expect(compararReglas('.a::after { content: ""; }', ".a::after { content: ''; }").score).toBe(100);
    expect(compararReglas('.a::before { content: "— "; }', ".a::before { content: '— '; }").score).toBe(100);
    expect(
      compararReglas(
        '@font-face { font-family: "Nota"; src: url("/f/n.woff2") format("woff2"); }',
        "@font-face { font-family: 'Nota'; src: url('/f/n.woff2') format('woff2'); }"
      ).score
    ).toBe(100);
  });

  it("GUARD: la comilla NO se saca, asi que content vacio SIGUE EXISTIENDO", () => {
    // Desnudar la comilla evaporaria `content: ""`: `normalizarDeclaracion`
    // descarta la declaracion de valor vacio, y `08-ej-06` bajaria de 6
    // declaraciones esperadas a 5 -- se mediria como ejercicio mas facil, no
    // como bug. Si `content` desapareciera, quien no lo escribe sacaria 100.
    expect(compararReglas('.a::after { content: ""; display: block; }', ".a::after { display: block; }").score).toBe(50);
  });

  it("GUARD: la generica comillada sigue siendo distinta de la generica, que es lo que la leccion ensena", () => {
    // `font-family: serif` es LA generica; `font-family: "serif"` es una familia
    // que se llama serif. El hint de 32-ej-02 dice "la generica va ultima,
    // siempre sin comillas".
    expect(compararReglas('.a { font-family: "serif"; }', ".a { font-family: serif; }").score).toBe(0);
    expect(compararReglas('.a { font-family: "inherit"; }', ".a { font-family: inherit; }").score).toBe(0);
  });

  it("GUARD: dos strings distintos siguen siendo distintos", () => {
    expect(compararReglas('.a::after { content: "x"; }', ".a::after { content: 'y'; }").score).toBe(0);
  });
});

describe("la canonicalizacion solo AGREGA aceptaciones", () => {
  it("todo ejercicio css-rules del curriculum sigue puntuando 100 con su propia respuesta", () => {
    // El control positivo, adentro de la suite. Si una regla de canonicalizacion
    // rompiera una declaracion en vez de plegarla, el target dejaria de
    // encontrarse a si mismo y esto se pondria rojo antes de llegar a un alumno.
    const ejercicios = ALL_MODULES.flatMap((m) =>
      m.exercises
        .filter((e) => e.validation.type === "css-rules")
        .map((e) => ({ slug: m.slug, id: e.id, target: cssEsperadoDe(e) }))
    ).filter((x) => x.target.trim());

    expect(ejercicios.length).toBeGreaterThan(100);

    const rotos = ejercicios
      .filter((x) => compararReglas(x.target, x.target).score !== 100)
      .map((x) => `${x.slug}/${x.id}`);

    expect(rotos).toEqual([]);
  });
});

describe("BRECHA CONOCIDA: un color con nombre dentro de una custom property", () => {
  /**
   * `--fondo: white` NO puntua contra `--fondo: #ffffff`, y queda asi a
   * proposito. Una custom property es un flujo de tokens, no un valor tipado:
   * `--animacion: tomato` puede ser el nombre de una animacion, y traducirlo a
   * `#ff6347` cambiaria lo que dice. El hex SI se pliega -- `#fff` y `#ffffff`
   * son el mismo token en cualquier lado -- porque ahi no hay ambiguedad.
   *
   * Afecta a dos ejercicios de `variables-css` (19-ej-07 y 19-ej-reto). Se
   * deja documentado en vez de arreglado: cerrarlo pide decidir que una
   * custom property siempre lleva un color, y eso no es cierto.
   */
  it("el hex se pliega dentro de una custom property", () => {
    expect(compararReglas(".a { --fondo: #ffffff; }", ".a { --fondo: #fff; }").score).toBe(100);
  });

  it("el NOMBRE no, y por eso esto sigue en cero", () => {
    expect(compararReglas(".a { --fondo: #ffffff; }", ".a { --fondo: white; }").score).toBe(0);
  });
});
