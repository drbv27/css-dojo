import { describe, it, expect } from "vitest";
import { parseCssRules, compararReglas } from "./cssRules";

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
