import type { ModuleData } from "@/types";

export const attributeSelectorsModule: ModuleData = {
  slug: "attribute-selectors",
  title: "Selectores de atributo",
  description:
    "Seleccioná elementos por lo que llevan escrito en sus atributos: el tipo de un campo, el destino de un enlace, la extensión de un archivo. La puerta de entrada a los formularios.",
  order: 13,
  dojo: "css" as const,
  nivel: "profundizacion",
  category: "css-selectores",
  icon: "Brackets",
  lessons: [
    {
      id: "28-leccion-01",
      title: "Seleccionar por atributo, y la regla de las comillas",
      content: `## El problema que resuelve

Hasta acá seleccionaste por etiqueta, por clase y por id. Pero mirá este formulario:

\`\`\`html
<input type="text" name="nombre">
<input type="email" name="correo">
<input type="checkbox" name="acepta">
\`\`\`

Tres \`input\` sin una sola clase, y los tres tienen que verse distinto: los dos primeros son cajas de texto anchas, el tercero es un cuadradito. Con \`input\` los agarrás a todos por igual. Y agregarles clases es trabajo de más para una diferencia que **ya está escrita en el HTML**.

Los selectores de atributo leen esa información:

\`\`\`css
input[type="text"] {
  border: 1px solid #ccc;
  padding: 8px;
}
\`\`\`

## Las dos formas básicas

\`\`\`css
/* Tiene el atributo, no importa con qué valor */
[required] {
  border-color: #8b5cf6;
}

/* Tiene el atributo Y el valor es exactamente ese */
[type="email"] {
  background-color: #f5f0ff;
}
\`\`\`

La primera es la que más se olvida y la más útil de las dos: \`[required]\` marca todos los campos obligatorios de un formulario sin tocar el HTML ni inventar una clase.

## La regla de las comillas: usá siempre dobles

En CSS las comillas alrededor del valor son **opcionales** cuando el valor es una palabra simple. Estas tres líneas son CSS válido y hacen exactamente lo mismo:

\`\`\`css
input[type="text"] { }   /* Usa esta */
input[type='text'] { }   /* Valida en CSS, pero el corrector la toma distinta */
input[type=text]   { }   /* Valida solo porque text es una palabra simple */
\`\`\`

Y sin embargo: **escribí siempre la primera.** Dos razones, y la segunda es práctica.

La primera es que las comillas dejan de ser opcionales en cuanto el valor no es una palabra simple. Si tiene un espacio, un punto, empieza con un número o es una ruta, **sin comillas no funciona**:

\`\`\`css
a[href=".pdf"]   { }   /* Bien */
a[href=.pdf]     { }   /* Roto: el punto no es parte de una palabra simple */
\`\`\`

Si la regla es "comillas dobles siempre", nunca te tenés que preguntar en qué caso estás.

La segunda razón es de este dojo, y conviene que la sepas: **los ejercicios comparan el selector tal como lo escribís.** Para el corrector, \`[type="text"]\` y \`[type='text']\` son dos selectores distintos, aunque el navegador los trate igual. Así que en los ejercicios de acá, comilla doble. El enunciado siempre te va a mostrar el selector exacto que se espera.

## Se pueden combinar con todo lo que ya sabés

\`\`\`css
/* Un input de texto que además está enfocado */
input[type="text"]:focus {
  border-color: #8b5cf6;
}

/* Solo los enlaces dentro del bloque de contacto */
.contacto a[href^="mailto:"] {
  font-weight: bold;
}
\`\`\``,
      codeExample: {
        html: `<form>\n  <input type="text" name="nombre" placeholder="Nombre">\n  <input type="email" name="correo" placeholder="Correo" required>\n  <label><input type="checkbox" name="acepta"> Acepto</label>\n</form>`,
        css: `input[type="text"] {\n  border: 2px solid #ccc;\n  padding: 8px;\n  width: 220px;\n}\n\ninput[type="email"] {\n  border: 2px solid #8b5cf6;\n  padding: 8px;\n  width: 220px;\n}\n\n[required] {\n  background-color: #f5f0ff;\n}`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "28-leccion-02",
      title: "Empieza con, termina con, contiene",
      content: `## Tres operadores para trozos de texto

Los tres que vas a usar el 90% de las veces. Todos comparan el **valor** del atributo contra un trozo:

| Operador | Se lee | Ejemplo | Coincide con |
|----------|--------|---------|--------------|
| \`^=\` | empieza con | \`[href^="https"]\` | \`https://sabio.com.co\` |
| \`$=\` | termina con | \`[href$=".pdf"]\` | \`/cv-ana.pdf\` |
| \`*=\` | contiene | \`[href*="linkedin"]\` | \`https://www.linkedin.com/in/ana\` |

Para acordarte de los símbolos: \`^\` es el que en las expresiones regulares marca el principio, \`$\` marca el final, y \`*\` es "cualquier cosa alrededor".

## Los casos que aparecen de verdad

### Marcar los enlaces externos

\`\`\`css
a[href^="https"]::after {
  content: " ↗";
}
\`\`\`

Un enlace que sale del sitio queda avisado, y no hay que acordarse de poner una clase en cada uno.

### Un icono según el tipo de archivo

\`\`\`css
a[href$=".pdf"] {
  color: #c0392b;
}
\`\`\`

### Distinguir el correo del teléfono

\`\`\`css
a[href^="mailto:"] {
  color: #8b5cf6;
}

a[href^="tel:"] {
  color: #27ae60;
}
\`\`\`

Esto es exactamente el bloque de contacto de un CV: dos enlaces que en el HTML son iguales y que se diferencian solo por lo que llevan en \`href\`.

## La diferencia entre ^= y *= importa

Parecen intercambiables y no lo son. Con este enlace:

\`\`\`html
<a href="https://ejemplo.com/pdf-gratis">Descargar</a>
\`\`\`

- \`[href*="pdf"]\` **coincide**, porque "pdf" está en algún lugar del valor.
- \`[href$=".pdf"]\` **no coincide**, porque el valor no termina en ".pdf".

Y ese es justo el caso donde \`*=\` te traiciona: querías archivos PDF y agarraste una página que solo menciona la palabra. Cuando lo que te importa es la extensión, \`$=\` es el correcto. \`*=\` es para cuando de verdad te da igual dónde aparezca.`,
      codeExample: {
        html: `<ul class="enlaces">\n  <li><a href="https://sabio.com.co">Sitio externo</a></li>\n  <li><a href="/cv-ana.pdf">Mi CV en PDF</a></li>\n  <li><a href="mailto:ana@ejemplo.com">Escribime</a></li>\n  <li><a href="tel:+541100000000">Llamame</a></li>\n</ul>`,
        css: `a[href^="https"] {\n  color: #2980b9;\n}\n\na[href$=".pdf"] {\n  color: #c0392b;\n  font-weight: bold;\n}\n\na[href^="mailto:"] {\n  color: #8b5cf6;\n}\n\na[href^="tel:"] {\n  color: #27ae60;\n}`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "28-leccion-03",
      title: "Los dos raros: |= y la bandera i",
      content: `## |= el del idioma

\`|=\` coincide si el valor **es exactamente** lo que pediste, **o** si empieza con eso seguido de un guion.

\`\`\`css
[lang|="es"] {
  quotes: "«" "»";
}
\`\`\`

Eso agarra \`lang="es"\`, \`lang="es-AR"\` y \`lang="es-MX"\`, pero **no** \`lang="estonio"\`.

Ahí está la diferencia con \`^=\`: \`[lang^="es"]\` sí agarraría \`estonio\`, porque solo mira que empiece con esas dos letras. \`|=\` entiende que el guion separa un código de idioma de su variante regional.

Para qué sirve de verdad: es el único operador pensado para los atributos que usan la convención "valor-variante", y en la práctica eso es \`lang\` y poco más. Si lo ves en código ajeno, casi siempre es sobre idiomas.

## La bandera i: ignorar mayúsculas

Por defecto, la comparación del valor **distingue mayúsculas de minúsculas**. Esto:

\`\`\`css
a[href$=".pdf"] {
  color: #c0392b;
}
\`\`\`

no agarra un enlace a \`/informe.PDF\`. Y en un sitio real, con archivos que subió gente distinta, vas a tener las dos formas.

La solución es una \`i\` antes del corchete de cierre, separada por un espacio:

\`\`\`css
a[href$=".pdf" i] {
  color: #c0392b;
}
\`\`\`

Ahora agarra \`.pdf\`, \`.PDF\` y \`.Pdf\`.

### La excepción que confunde

El **nombre** del atributo nunca distinguió mayúsculas en HTML: \`[TYPE="text"]\` y \`[type="text"]\` son lo mismo. Lo que distingue es el **valor**. Por eso la bandera existe: para el valor, y solo para el valor.

Y ojo con un caso especial: el atributo \`type\` de un \`input\` es de los pocos que el propio HTML define como insensible a mayúsculas, así que \`[type="TEXT"]\` funciona igual sin la bandera. Pero no te acostumbres a esa excepción; para todo lo demás la comparación sí distingue.

## Cuándo NO usar un selector de atributo

Vale la pena decirlo, porque la herramienta nueva siempre tienta:

- Si el elemento ya tiene una clase que dice lo mismo, usá la clase. Es más rápida de leer.
- Si la diferencia **no** está escrita en el HTML, no hay atributo que leer, y el selector de atributo no puede inventarlo.

El selector de atributo brilla cuando la información **ya está** ahí y ponerle una clase encima sería repetirla.`,
      codeExample: {
        html: `<p lang="es">Un texto en espanol.</p>\n<p lang="es-AR">Un texto en espanol de Argentina.</p>\n<p lang="en">A text in English.</p>\n<ul>\n  <li><a href="/informe.pdf">informe.pdf</a></li>\n  <li><a href="/resumen.PDF">resumen.PDF</a></li>\n</ul>`,
        css: `[lang|="es"] {\n  border-left: 3px solid #8b5cf6;\n  padding-left: 10px;\n}\n\na[href$=".pdf" i] {\n  color: #c0392b;\n  font-weight: bold;\n}`,
        editable: true,
      },
      order: 3,
    },
    {
      id: "28-leccion-04",
      title: "El formulario y el contacto del CV",
      content: `## Un formulario completo sin una sola clase

\`\`\`css
input[type="text"],
input[type="email"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
}

input[type="checkbox"] {
  width: auto;
}

[required] {
  border-left: 3px solid #8b5cf6;
}

[disabled] {
  background-color: #eee;
  color: #999;
}
\`\`\`

Cuatro reglas y ninguna clase inventada. Todo sale de atributos que el formulario **ya necesitaba** para funcionar: \`type\` para que el navegador sepa qué campo es, \`required\` para que valide, \`disabled\` para que no se pueda tocar.

Ese es el punto del módulo entero: **el HTML ya sabe cosas, y el CSS puede leerlas.**

## El bloque de contacto del CV de Ana

En el CV, el contacto son tres enlaces que en el HTML se ven casi iguales:

\`\`\`html
<div class="contacto">
  <a href="mailto:ana@ejemplo.com">ana@ejemplo.com</a>
  <a href="tel:+541100000000">+54 11 0000 0000</a>
  <a href="https://linkedin.com/in/ana">LinkedIn</a>
</div>
\`\`\`

Y se diferencian solos:

\`\`\`css
.contacto a[href^="mailto:"] {
  color: #8b5cf6;
}

.contacto a[href^="tel:"] {
  color: #27ae60;
}

.contacto a[href^="https"] {
  color: #2980b9;
}
\`\`\`

## Y una cosa que necesitás para el módulo que sigue

El que viene es **especificidad**: cómo decide el navegador cuál regla gana cuando dos se pelean. Y ahí vas a necesitar este dato:

**Un selector de atributo pesa lo mismo que una clase.**

\`\`\`css
input[type="text"] { }   /* una etiqueta + un atributo */
input.campo { }          /* una etiqueta + una clase */
\`\`\`

Esas dos tienen la misma especificidad, así que si las dos apuntan al mismo elemento, gana **la que esté escrita más abajo**. No es un empate raro: es la regla normal de la cascada, y en el módulo siguiente la vas a calcular.

Con esto ya viste todos los tipos de selector que existen: etiqueta, clase, id, descendiente, hermano, pseudo-clase, pseudo-elemento y atributo. Ahora sí tiene sentido preguntarse cuál gana.`,
      codeExample: {
        html: `<form class="formulario">\n  <input type="text" placeholder="Nombre" required>\n  <input type="email" placeholder="Correo">\n  <input type="text" placeholder="No editable" disabled>\n</form>\n<div class="contacto">\n  <a href="mailto:ana@ejemplo.com">ana@ejemplo.com</a>\n  <a href="tel:+541100000000">+54 11 0000 0000</a>\n</div>`,
        css: `input[type="text"],\ninput[type="email"] {\n  display: block;\n  width: 240px;\n  padding: 10px;\n  margin-bottom: 8px;\n  border: 1px solid #ccc;\n}\n\n[required] {\n  border-left: 3px solid #8b5cf6;\n}\n\n[disabled] {\n  background-color: #eee;\n  color: #999;\n}\n\n.contacto a[href^="mailto:"] {\n  color: #8b5cf6;\n}\n\n.contacto a[href^="tel:"] {\n  color: #27ae60;\n}`,
        editable: true,
      },
      order: 4,
    },
  ],
  exercises: [
    {
      id: "28-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: '¿Qué selecciona [required], escrito así, sin ningún valor?',
      options: [
        {
          id: "a",
          text: "Todos los elementos que tienen el atributo required, sin importar su valor",
          isCorrect: true,
        },
        { id: "b", text: "Todos los elementos que tienen la clase required", isCorrect: false },
        { id: "c", text: "Nada: siempre hay que indicar un valor entre comillas", isCorrect: false },
        { id: "d", text: "Solo los input cuyo atributo required vale exactamente true", isCorrect: false },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "Es la forma más corta de las dos que viste, y la que más se olvida: pregunta solo si el atributo está presente.",
      explanation:
        "Los corchetes con solo el nombre del atributo seleccionan por PRESENCIA, sin mirar el valor. Por eso [required] marca todos los campos obligatorios de un formulario sin tocar el HTML ni inventar una clase.",
    },
    {
      id: "28-ej-02",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 2,
      prompt: "Arrastrá cada operador a lo que compara:",
      dragItems: [
        { id: "drag-1", content: "^=", correctZone: "zone-empieza" },
        { id: "drag-2", content: "$=", correctZone: "zone-termina" },
        { id: "drag-3", content: "*=", correctZone: "zone-contiene" },
        { id: "drag-4", content: "|=", correctZone: "zone-idioma" },
        { id: "drag-5", content: "=", correctZone: "zone-exacto" },
      ],
      dropZones: [
        { id: "zone-empieza", label: "El valor empieza con eso" },
        { id: "zone-termina", label: "El valor termina con eso" },
        { id: "zone-contiene", label: "El valor lo contiene en cualquier lugar" },
        { id: "zone-idioma", label: "El valor es eso, o eso seguido de un guion" },
        { id: "zone-exacto", label: "El valor es exactamente eso" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-empieza",
          "drag-2": "zone-termina",
          "drag-3": "zone-contiene",
          "drag-4": "zone-idioma",
          "drag-5": "zone-exacto",
        },
      },
      hint: "Los tres primeros vienen de las expresiones regulares: el acento circunflejo marca el principio, el signo de peso el final, y el asterisco es cualquier cosa alrededor.",
      explanation:
        "El igual solo es coincidencia exacta. El circunflejo marca el principio y el peso el final, igual que en una expresión regular. El asterisco busca en cualquier lugar del valor. Y la barra vertical es la de los idiomas: coincide con el valor exacto o con ese valor seguido de un guion.",
    },
    {
      id: "28-ej-03",
      type: "quiz",
      difficulty: 2,
      xpReward: 20,
      order: 3,
      prompt:
        'Tenés este enlace: <a href="https://ejemplo.com/pdf-gratis">Descargar</a>. ¿Cuál de los dos selectores lo agarra?',
      options: [
        { id: "a", text: 'Los dos, porque en los dos aparece la palabra pdf', isCorrect: false },
        {
          id: "b",
          text: 'Solo [href*="pdf"], porque el valor contiene pdf pero no termina en .pdf',
          isCorrect: true,
        },
        { id: "c", text: 'Solo [href$=".pdf"], porque busca la extensión del archivo', isCorrect: false },
        { id: "d", text: "Ninguno de los dos: el valor tiene una barra y eso lo invalida", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Mirá cómo TERMINA el valor del href. ¿Termina en punto pdf, o termina en pdf-gratis?",
      explanation:
        "El valor es https://ejemplo.com/pdf-gratis, que contiene pdf pero termina en pdf-gratis. Así que el operador de contiene coincide y el de termina con no. Este es el caso donde el asterisco traiciona: querías archivos PDF y agarraste una página que solo menciona la palabra. Cuando importa la extensión, el correcto es el de termina con.",
    },
    {
      id: "28-ej-04",
      type: "code-completion",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt:
        'Completá el operador que hace que este selector agarre los enlaces cuyo href TERMINA en ".pdf":',
      codeTemplate: {
        html: `<a href="/cv-ana.pdf">Mi CV en PDF</a>`,
        cssPrefix: 'a[href',
        cssSuffix: '".pdf"] {\n  color: #c0392b;\n}',
        blanks: ["$="],
      },
      validation: { type: "exact", answer: "$=" },
      hint: "Son dos caracteres: el que marca el final en una expresión regular, seguido del igual.",
      explanation:
        "El operador de termina con es el signo de peso seguido del igual. Viene de las expresiones regulares, donde ese signo marca el final de la cadena.",
    },
    {
      id: "28-ej-05",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 5,
      prompt:
        'Escribí la regla para el selector a[href^="https"] con color: #2980b9 y font-weight: bold. Copiá el selector tal como está acá, con comillas dobles: el corrector compara el selector literalmente.',
      codeTemplate: {
        html: `<a href="https://sabio.com.co">Sitio externo</a>\n<a href="/interna.html">Pagina interna</a>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS: `a[href^="https"] {\n  color: #2980b9;\n  font-weight: bold;\n}`,
      validation: {
        // Graded by parsing `targetCSS` into selector -> declarations, not by
        // searching the submission for loose words. See src/lib/cssRules.ts.
        type: "css-rules",
      },
      hint: 'Comillas DOBLES alrededor de https. El corrector trata [href^="https"] y [href^=\'https\'] como selectores distintos, aunque el navegador los entienda igual.',
      explanation:
        "El operador de empieza con agarra cualquier href que arranque con https, que en la práctica son los enlaces que salen del sitio. Los internos, que empiezan con barra, quedan afuera.",
    },
    {
      id: "28-ej-06",
      type: "quiz",
      difficulty: 2,
      xpReward: 20,
      order: 6,
      prompt:
        'Un selector a[href$=".pdf"] no está agarrando un enlace a "/informe.PDF". ¿Qué le falta?',
      options: [
        { id: "a", text: "Nada: hay que renombrar el archivo a minúsculas", isCorrect: false },
        {
          id: "b",
          text: 'La bandera i antes del corchete de cierre: a[href$=".pdf" i]',
          isCorrect: true,
        },
        { id: "c", text: "Cambiar el operador de termina con por el de contiene", isCorrect: false },
        { id: "d", text: "Sacar las comillas, porque impiden comparar la extensión", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "La comparación del VALOR distingue mayúsculas de minúsculas. Hay una letra que se agrega para que deje de distinguir.",
      explanation:
        "Por defecto la comparación del valor distingue mayúsculas, así que .pdf y .PDF son distintos. La bandera i, escrita antes del corchete de cierre y separada por un espacio, hace que deje de distinguir. Renombrar los archivos no sirve cuando los sube gente distinta.",
    },
    {
      id: "28-ej-07",
      type: "live-editor",
      difficulty: 3,
      xpReward: 30,
      order: 7,
      prompt:
        'Estilá un formulario sin usar clases. Escribí input[type="text"] con border: 1px solid #ccc y padding: 10px; y [required] con border-left: 3px solid #8b5cf6. Usá comillas dobles en el selector de atributo.',
      codeTemplate: {
        html: `<form>\n  <input type="text" placeholder="Nombre" required>\n  <input type="email" placeholder="Correo">\n</form>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS: `input[type="text"] {\n  border: 1px solid #ccc;\n  padding: 10px;\n}\n\n[required] {\n  border-left: 3px solid #8b5cf6;\n}`,
      validation: {
        // Graded by parsing `targetCSS` into selector -> declarations, not by
        // searching the submission for loose words. See src/lib/cssRules.ts.
        type: "css-rules",
      },
      hint: "Son dos reglas. La segunda no lleva etiqueta ni valor: solo el nombre del atributo entre corchetes, porque pregunta si está presente.",
      explanation:
        "Las dos reglas leen información que el formulario ya necesitaba para funcionar: type para que el navegador sepa qué campo es, y required para que valide. Ninguna clase inventada, y el HTML no se toca.",
    },
    {
      id: "28-ej-08",
      type: "visual-match",
      difficulty: 3,
      xpReward: 30,
      order: 8,
      prompt:
        'Reproducí el bloque de contacto del CV. Escribí .contacto a[href^="mailto:"] con color: #8b5cf6, y .contacto a[href^="tel:"] con color: #27ae60. Los dos con comillas dobles y con los dos puntos incluidos dentro del valor.',
      codeTemplate: {
        html: `<div class="contacto">\n  <a href="mailto:ana@ejemplo.com">ana@ejemplo.com</a>\n  <a href="tel:+541100000000">+54 11 0000 0000</a>\n</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS: `.contacto a[href^="mailto:"] {\n  color: #8b5cf6;\n}\n\n.contacto a[href^="tel:"] {\n  color: #27ae60;\n}`,
      validation: {
        // Graded by parsing `targetCSS` into selector -> declarations, not by
        // searching the submission for loose words. See src/lib/cssRules.ts.
        type: "css-rules",
      },
      hint: "Los dos puntos van adentro de las comillas, porque son parte del valor del href. Y el selector arranca con la clase del contenedor.",
      explanation:
        "Dos enlaces que en el HTML son casi iguales se diferencian solos por lo que llevan en href. Los dos puntos son parte del valor, así que van dentro de las comillas. Y arrancar con la clase del contenedor limita el efecto al bloque de contacto en lugar de pintar todos los enlaces de la página.",
    },
  ],
};
