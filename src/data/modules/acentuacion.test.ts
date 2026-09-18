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
  // Femeninos y plurales que el sufijo `(s|es|a|as|os)` NO alcanza: se lo pega
  // DETRAS de la palabra, asi que `ultimo` nunca cubre `ultima`.
  ["ultima", "última"],
  ["unica", "única"],
  ["basica", "básica"],
  ["clasico", "clásico"],
  ["clasica", "clásica"],
  ["tipico", "típico"],
  ["tipica", "típica"],
  ["generica", "genérica"],
  ["automatica", "automática"],
  ["dinamica", "dinámica"],
  ["estatica", "estática"],
  ["semantica", "semántica"],
  ["numerica", "numérica"],
  ["electronico", "electrónico"],
  ["electronica", "electrónica"],
  ["jerarquico", "jerárquico"],
  // El resto del vocabulario que este curriculum usa de verdad. Salio de medir
  // la prosa, no de imaginar que palabras podrian aparecer.
  ["cuadricula", "cuadrícula"],
  ["caracteristica", "característica"],
  ["simbolo", "símbolo"],
  ["ingles", "inglés"],
  ["frances", "francés"],
  // `espanol` NO va aca: lo cubre la regla de la ñ, y tenerlo en los dos lados
  // reporta dos fallas por un solo error.
  ["enfasis", "énfasis"],
  ["analisis", "análisis"],
  ["parentesis", "paréntesis"],
  ["bateria", "batería"],
  ["telefono", "teléfono"],
  ["raton", "ratón"],
  // `menu` tampoco: `<menu>` es un elemento HTML real y aparece como opcion de
  // quiz en html-semantica, y `.menu` es una clase corriente. Misma familia que
  // `areas`: la palabra esta demasiado enredada con el codigo que nombra.
  ["demas", "demás"],
  ["detras", "detrás"],
  ["atras", "atrás"],
  ["reves", "revés"],
  ["ahi", "ahí"],
  ["asi", "así"],
  ["aqui", "aquí"],
  ["alli", "allí"],
  ["dia", "día"],
  ["todavia", "todavía"],
  ["habia", "había"],
  ["estan", "están"],
  ["sera", "será"],
  ["seria", "sería"],
  ["haria", "haría"],
  ["podria", "podría"],
  ["deberia", "debería"],
  ["tendria", "tendría"],
  ["tendra", "tendrá"],
  ["cambiara", "cambiará"],
  ["mostrara", "mostrará"],
  ["veras", "verás"],
  ["dinamicamente", "dinámicamente"],
  ["practicamente", "prácticamente"],
  ["rapidamente", "rápidamente"],
  ["explicitamente", "explícitamente"],
  ["implicitamente", "implícitamente"],
  ["especificamente", "específicamente"],
  ["digitos", "dígitos"],
  ["proximo", "próximo"],
  // `areas` NO se puede exigir: `\b` trata el guion como frontera, asi que
  // `grid-template-areas` -- el nombre de la propiedad, que va sin tilde --
  // matchea `areas` y el guard reclama una tilde que arruinaria el codigo.
  // El plural en prosa ("las áreas de la cuadrícula") queda sin cubrir a
  // proposito: es el precio de no romper el nombre de la propiedad.
];

/**
 * ## Reglas por TERMINACION, que van ANTES de la lista
 *
 * El conjunto de palabras mal escritas no es enumerable: depende del
 * vocabulario que alguien use manana. El de terminaciones si lo es, y es chico.
 *
 * Medido el 2026-09-18: el guard tenia 61 formas y el barrido manual 300, y un
 * patron de tres letras (`-cion`) encontro 32 errores que NINGUNO de los dos
 * tenia -- `formacion`, `expansion`, `meditacion`, `leccion`, `negacion`. Por
 * eso el orden importa: si este guard se arma enumerando, nace con el mismo
 * agujero que tenia antes, solo que mas grande y mas dificil de ver.
 *
 * Cada regla trae abajo su control positivo Y su control negativo, en tests
 * distintos: uno prueba que caza lo que tiene que cazar, el otro que no se
 * pasa de rosca. Un solo control no distingue "la regla anda" de "la regla
 * matchea todo".
 */
/**
 * El `\b` final NO alcanza, y esta es la misma trampa que ya documenta
 * `ocurrenciasQueSonError` mas abajo: en JavaScript `\b` es ASCII, asi que
 * entre `n` y `o` HAY frontera de palabra. Sin el lookahead, `-cion\b` matchea
 * DENTRO de `funciono`, `fusiono`, `Seleccionas` e `inspeccionas` -- todas
 * perfectamente escritas -- y el guard reclama una tilde que ya esta puesta.
 *
 * Medido el 2026-09-18: la primera version de estas reglas dio 10 fallas y las
 * 10 eran de esta clase. Cero errores reales. Un guard que rechaza prosa
 * correcta no protege la ortografia: empuja a escribirla peor para callarlo.
 */
const NO_SIGUE_LETRA = "(?![a-záéíóúñüA-ZÁÉÍÓÚÑÜ])";

const REGLAS: { nombre: string; patron: RegExp; excepciones: Set<string> }[] = [
  {
    // `funcion` -> `función`. El PLURAL pierde la tilde (`funciones`), y el
    // \b final ya lo deja afuera.
    nombre: "-cion / -sion en singular llevan tilde",
    patron: new RegExp("\\b[a-záéíóúñ]{2,}[cs]ion\\b" + NO_SIGUE_LETRA, "gi"),
    excepciones: new Set(["ion"]),
  },
  {
    // Familias de sufijo donde la `i` SIEMPRE es tonica. No vale una regla
    // general de `-ia`: `materia`, `historia`, `distancia` y `democracia` van
    // sin tilde, y exigirsela seria un error peor que la omision.
    nombre: "-grafia / -logia / -metria / -nomia / -arquia / -goria llevan tilde",
    patron: new RegExp("\\b[a-záéíóúñ]{2,}(?:grafia|logia|metria|nomia|arquia|goria)\\b" + NO_SIGUE_LETRA, "gi"),
    excepciones: new Set(),
  },
  {
    // Formas que SOLO existen en voseo, asi que sin tilde estan mal siempre.
    // Son invisibles para los dos barridos anteriores: no son tuteo, y no
    // figuran en ningun diccionario armado sobre tuteo. Quedaron cinco vivas
    // en produccion hasta que aparecieron por terminacion.
    // OJO con lo que NO esta: `estas` es demostrativo ("estas propiedades") y
    // `haces`/`sabes`/`puedes` son tuteo valido en castellano, no faltas de
    // tilde. Esas son cuestion de VOZ, no de ortografia, y no son de este guard.
    nombre: "formas de voseo sin su tilde",
    patron: new RegExp("\\b(?:podes|tenes|queres|escribis|decis|elegis|seguis|venis|salis|abris|subis|vivis|medis|pedis|repetis|sentis|dormis|conseguis|preferis)\\b" + NO_SIGUE_LETRA, "gi"),
    excepciones: new Set(),
  },
  {
    // La `ñ` escrita como `n` o `ni`. Es la falta mas grave de todas porque
    // sale en pantalla y se lee como otro idioma.
    nombre: "la ñ escrita como n o ni",
    patron: new RegExp("\\b(?:espanol|contrasena|tamanio|disenio|pequenio|ensena|compania|manana|nino|extrano|sueno|duenio|anios|anos)\\b" + NO_SIGUE_LETRA, "gi"),
    excepciones: new Set(),
  },
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
    // `retoPasos[].instruccion` es PROSA y estuvo fuera de este barrido hasta el
    // 2026-09-18: 92 pasos en 23 modulos que el guard nunca leia. Contenian 35
    // palabras mal escritas, y 16 eran de este mismo diccionario -- o sea que el
    // test pasaba en verde sobre errores que ya sabia reconocer. Un guard afirma
    // sobre el conjunto que esta funcion decide mirar, y ese conjunto se quedo
    // atras cuando el esquema crecio.
    //
    // `esperado` NO va: es el CSS que el alumno tiene que escribir, no prosa.
    for (const p of e.retoPasos ?? []) partes.push(p.instruccion);
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
  // OJO CON `\\b`: en JavaScript es ASCII, asi que entre una letra comun y una
  // acentuada HAY frontera de palabra. Sin el lookahead, buscar `funcion`
  // matchea DENTRO de `funciono` con tilde, que esta perfectamente escrita, y el
  // guard reclama una tilde que ya esta puesta. Medido el 2026-08-31 escribiendo
  // el modulo de tipografia web.
  //
  // Es la forma de defecto que ya conocemos: un guard que rechaza prosa correcta
  // no protege la ortografia, empuja a escribirla peor para callarlo.
  const re = new RegExp(`\\b${mal}${sufijos}\\b(?![a-záéíóúñüA-ZÁÉÍÓÚÑÜ])`, "gi");
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

/** Las palabras de `prosa` que una regla morfologica marca como mal escritas. */
function faltasPorRegla(prosa: string, regla: (typeof REGLAS)[number]): string[] {
  return (prosa.match(regla.patron) ?? []).filter((w) => !regla.excepciones.has(w.toLowerCase()));
}

describe("reglas por terminacion", () => {
  /**
   * Control POSITIVO: la regla caza lo que tiene que cazar. Sin esto, una regla
   * rota devuelve cero y el cero se lee como "esta todo bien".
   */
  it("cada regla detecta una palabra que sabemos mal escrita", () => {
    const casos: [string, string][] = [
      ["-cion / -sion en singular llevan tilde", "la formacion de la expansion"],
      ["-grafia / -logia / -metria / -nomia / -arquia / -goria llevan tilde", "la tipografia y la jerarquia"],
      ["formas de voseo sin su tilde", "si podes, tenes que escribirlo"],
      ["la ñ escrita como n o ni", "en espanol, el tamanio de la contrasena"],
    ];
    for (const [nombre, frase] of casos) {
      const regla = REGLAS.find((r) => r.nombre === nombre)!;
      expect(faltasPorRegla(frase, regla).length).toBeGreaterThan(0);
    }
  });

  /**
   * Control NEGATIVO, en un test DISTINTO del positivo a proposito: una regla
   * que matchea todo tambien pasa el positivo. Hacen falta los dos, y tienen
   * que poder fallar por separado.
   */
  it("ninguna regla marca prosa que ya esta bien escrita", () => {
    const bienEscrito = [
      // Plurales en -ciones: la tilde se PIERDE, exigirla seria el error inverso.
      "las funciones y las declaraciones y las opciones",
      // -ia atono: nada de esto lleva tilde.
      "la materia, la historia, la distancia, la importancia, la democracia",
      // Tuteo valido: es cuestion de voz, no de ortografia.
      "si puedes y sabes lo que haces",
      // Demostrativo, sin tilde desde 2010.
      "estas propiedades y esta regla",
      // Ya acentuado: la regla no puede volver a reclamarlo.
      "la formación, la tipografía, el español, podés, tenés",
    ];
    for (const frase of bienEscrito) {
      for (const regla of REGLAS) {
        expect(faltasPorRegla(frase, regla)).toEqual([]);
      }
    }
  });

  it("ninguna terminacion mal escrita sobrevive en el curriculum", () => {
    const fallas: string[] = [];

    for (const m of ALL_MODULES) {
      const prosa = prosaDe(m);
      for (const regla of REGLAS) {
        for (const w of faltasPorRegla(prosa, regla)) {
          fallas.push(`${m.dojo}/${m.slug}: "${w}" (${regla.nombre})`);
        }
      }
    }

    expect(fallas).toEqual([]);
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
