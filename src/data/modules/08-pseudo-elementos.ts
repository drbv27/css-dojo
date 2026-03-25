import type { ModuleData } from "@/types";

export const pseudoElementosModule: ModuleData = {
  slug: "pseudo-elementos",
  title: "Pseudo-elementos CSS",
  description:
    "Aprende a usar pseudo-elementos como ::first-letter, ::first-line, ::before y ::after para estilizar partes especificas del contenido sin modificar el HTML.",
  order: 8,
  category: "intermediate",
  icon: "Sparkles",
  lessons: [
    {
      id: "08-leccion-01",
      title: "Que son los pseudo-elementos",
      content: `## Que son los pseudo-elementos

Los **pseudo-elementos** permiten estilizar **partes especificas** de un elemento sin necesidad de agregar HTML adicional. Se escriben con **doble dos puntos (::)**.

### Sintaxis

\`\`\`css
selector::pseudo-elemento {
  propiedad: valor;
}
\`\`\`

### Diferencia con pseudo-clases

| Caracteristica | Pseudo-clase (:) | Pseudo-elemento (::) |
|---------------|-------------------|----------------------|
| Notacion | Un dos puntos \`:hover\` | Dos puntos \`::before\` |
| Que hace | Selecciona estados o posiciones | Crea/estiliza partes del elemento |
| Ejemplo | \`:hover\`, \`:first-child\` | \`::before\`, \`::first-letter\` |

### Regla importante

> Un selector solo puede tener **un pseudo-elemento**. No puedes escribir \`p::first-letter::before\`. Pero si puedes combinar pseudo-clases con un pseudo-elemento: \`p:first-child::first-letter\`.

### Pseudo-elementos principales

Los pseudo-elementos mas utilizados son:
- \`::first-letter\` - La primera letra
- \`::first-line\` - La primera linea
- \`::before\` - Contenido antes del elemento
- \`::after\` - Contenido despues del elemento
- \`::selection\` - Texto seleccionado por el usuario

> **Nota historica:** La notacion antigua usaba un solo dos puntos (\`:before\`). La notacion moderna con doble dos puntos (\`::before\`) se introdujo en CSS3 para diferenciar pseudo-elementos de pseudo-clases. Ambas funcionan, pero se recomienda usar \`::\`.`,
      codeExample: {
        html: `<p class="intro">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>`,
        css: `/* Primera letra grande y decorativa */\n.intro::first-letter {\n  font-size: 48px;\n  font-weight: bold;\n  color: steelblue;\n  float: left;\n  margin-right: 8px;\n  line-height: 1;\n}\n\n/* Primera linea en mayusculas */\n.intro::first-line {\n  text-transform: uppercase;\n  letter-spacing: 1px;\n}\n\n/* Texto seleccionado */\n.intro::selection {\n  background-color: steelblue;\n  color: white;\n}`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "08-leccion-02",
      title: "::first-letter y ::first-line",
      content: `## Pseudo-elementos tipograficos

### ::first-letter

Selecciona la **primera letra** de un elemento de bloque. Es perfecto para crear **capitulares** (letras iniciales decorativas como en libros):

\`\`\`css
article p:first-of-type::first-letter {
  font-size: 3em;
  font-weight: bold;
  color: darkred;
  float: left;
  margin-right: 6px;
  line-height: 0.8;
}
\`\`\`

### Propiedades validas para ::first-letter

Solo estas categorias de propiedades funcionan con \`::first-letter\`:
- **Tipografia:** font, font-size, font-weight, font-style, font-family, line-height, letter-spacing
- **Color y fondo:** color, background, background-color
- **Bordes:** border, border-radius
- **Margenes y padding:** margin, padding
- **Decoracion:** text-decoration, text-transform

### ::first-line

Selecciona la **primera linea visible** de un elemento de bloque. La seleccion es **dinamica**: si el ancho cambia, la primera linea cambia:

\`\`\`css
p::first-line {
  font-weight: bold;
  text-transform: uppercase;
  color: #333;
}
\`\`\`

### Propiedades validas para ::first-line

Las propiedades disponibles son mas limitadas que \`::first-letter\`:
- **Tipografia:** font, line-height, letter-spacing, word-spacing
- **Color y fondo:** color, background
- **Decoracion:** text-decoration, text-transform

### Combinando ambos

\`\`\`css
.articulo p::first-letter {
  font-size: 2.5em;
  color: crimson;
}

.articulo p::first-line {
  font-variant: small-caps;
}
\`\`\`

> **Atencion:** Estos pseudo-elementos solo funcionan en **elementos de bloque** (como \`<p>\`, \`<div>\`, \`<article>\`). No funcionan en elementos en linea como \`<span>\`.`,
      codeExample: {
        html: `<article class="articulo">\n  <p>Esta es la historia de un desarrollador que aprendio CSS. Todo comenzo con una simple etiqueta HTML y una curiosidad enorme por personalizar la apariencia de sus paginas web.</p>\n  <p>El segundo parrafo no tiene capitular, demostrando como podemos ser selectivos con los pseudo-elementos.</p>\n</article>`,
        css: `.articulo p:first-of-type::first-letter {\n  font-size: 3em;\n  font-weight: bold;\n  color: crimson;\n  float: left;\n  margin-right: 8px;\n  line-height: 0.85;\n}\n\n.articulo p::first-line {\n  font-weight: bold;\n  color: #333;\n}\n\n.articulo p {\n  font-size: 16px;\n  line-height: 1.7;\n  color: #555;\n  margin-bottom: 16px;\n}`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "08-leccion-03",
      title: "::before y ::after",
      content: `## ::before y ::after

Los pseudo-elementos **::before** y **::after** insertan contenido **antes** o **despues** del contenido de un elemento, sin modificar el HTML.

### Requisito obligatorio: content

Estos pseudo-elementos **siempre** necesitan la propiedad \`content\`. Sin ella, no se mostraran:

\`\`\`css
.aviso::before {
  content: "Importante: ";
  font-weight: bold;
  color: red;
}
\`\`\`

### Valores de content

| Valor | Resultado |
|-------|----------|
| \`content: "texto"\` | Inserta texto |
| \`content: ""\` | No inserta texto (pero el elemento existe) |
| \`content: attr(data-info)\` | Inserta el valor de un atributo HTML |
| \`content: counter(nombre)\` | Inserta un contador CSS |

### Content vacio para decoraciones

El uso mas comun es \`content: ""\` combinado con posicionamiento para crear **decoraciones visuales**:

\`\`\`css
.titulo::after {
  content: "";
  display: block;
  width: 60px;
  height: 3px;
  background-color: tomato;
  margin-top: 8px;
}
\`\`\`

### Ejemplo: iconos decorativos

\`\`\`css
.enlace-externo::after {
  content: " ↗";
  font-size: 0.8em;
}

.precio::before {
  content: "$";
  font-weight: bold;
}

.requerido::after {
  content: " *";
  color: red;
}
\`\`\`

### Importante sobre ::before y ::after

- Son **hijos** del elemento (no hermanos)
- Por defecto son elementos **en linea** (\`display: inline\`)
- **No aparecen** en el DOM real (no los puedes seleccionar como texto)
- No funcionan en elementos **vacios** como \`<img>\`, \`<input>\`, \`<br>\`

> **Buena practica:** Usa ::before y ::after para decoraciones visuales, no para contenido importante. El contenido insertado con \`content\` no es accesible para lectores de pantalla de la misma manera que el HTML real.`,
      codeExample: {
        html: `<h2 class="titulo">Nuestros Servicios</h2>\n<p class="nota">Este es un mensaje informativo.</p>\n<label class="requerido">Nombre completo</label>\n<br>\n<a href="#" class="enlace-ext">Documentacion oficial</a>`,
        css: `.titulo::after {\n  content: "";\n  display: block;\n  width: 60px;\n  height: 3px;\n  background-color: tomato;\n  margin-top: 8px;\n}\n\n.nota::before {\n  content: "ℹ ";\n  color: steelblue;\n  font-weight: bold;\n}\n\n.requerido::after {\n  content: " *";\n  color: red;\n  font-weight: bold;\n}\n\n.enlace-ext::after {\n  content: " ↗";\n  font-size: 0.8em;\n  color: gray;\n}`,
        editable: true,
      },
      order: 3,
    },
    {
      id: "08-leccion-04",
      title: "Usos avanzados de ::before y ::after",
      content: `## Usos avanzados de ::before y ::after

Estos pseudo-elementos son extremadamente versatiles. Veamos patrones avanzados usados en la practica.

### Comillas decorativas

\`\`\`css
blockquote::before {
  content: open-quote;
  font-size: 3em;
  color: steelblue;
  line-height: 0;
  vertical-align: -0.4em;
}

blockquote::after {
  content: close-quote;
}
\`\`\`

### Overlay con ::after

Crear una capa semitransparente sobre una imagen:

\`\`\`css
.hero {
  position: relative;
}

.hero::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
}
\`\`\`

### Etiquetas automaticas con attr()

\`\`\`html
<a href="https://ejemplo.com" data-tooltip="Visitar sitio">Enlace</a>
\`\`\`

\`\`\`css
a[data-tooltip]::after {
  content: attr(data-tooltip);
  position: absolute;
  background: #333;
  color: white;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
}
\`\`\`

### Limpiar floats (clearfix)

Un patron clasico para contener elementos flotantes:

\`\`\`css
.clearfix::after {
  content: "";
  display: table;
  clear: both;
}
\`\`\`

### Decoraciones geometricas

Crear triangulos, circulos y otras formas:

\`\`\`css
.flecha::after {
  content: "";
  display: inline-block;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 8px solid currentColor;
  margin-left: 6px;
}
\`\`\`

> **Resumen:** ::before y ::after son dos de las herramientas mas poderosas de CSS. Dominandolos puedes crear interfaces ricas sin agregar HTML extra.`,
      codeExample: {
        html: `<blockquote class="cita">\n  El unico modo de hacer un gran trabajo es amar lo que haces.\n</blockquote>\n<div class="etiqueta" data-estado="Nuevo">Producto Premium</div>`,
        css: `.cita {\n  font-style: italic;\n  font-size: 18px;\n  color: #555;\n  padding: 16px 24px;\n  border-left: 4px solid steelblue;\n  position: relative;\n}\n\n.cita::before {\n  content: "\\201C";\n  font-size: 4em;\n  color: steelblue;\n  position: absolute;\n  top: -10px;\n  left: 8px;\n  opacity: 0.3;\n}\n\n.etiqueta {\n  display: inline-block;\n  padding: 8px 16px;\n  background: #f0f0f0;\n  border-radius: 4px;\n  margin-top: 20px;\n}\n\n.etiqueta::before {\n  content: attr(data-estado);\n  background: tomato;\n  color: white;\n  padding: 2px 8px;\n  border-radius: 3px;\n  font-size: 12px;\n  margin-right: 8px;\n}`,
        editable: true,
      },
      order: 4,
    },
  ],
  exercises: [
    {
      id: "08-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt:
        "Cuantos dos puntos se usan para escribir un pseudo-elemento en la notacion moderna de CSS3?",
      options: [
        { id: "a", text: "Uno (:)", isCorrect: false },
        { id: "b", text: "Dos (::)", isCorrect: true },
        { id: "c", text: "Tres (:::)", isCorrect: false },
        { id: "d", text: "Ninguno", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "CSS3 introdujo una notacion con doble simbolo para diferenciarlos de las pseudo-clases.",
      explanation:
        "Los pseudo-elementos usan doble dos puntos (::) en CSS3, como ::before, ::after, ::first-letter. Esto los diferencia de las pseudo-clases que usan un solo dos puntos (:hover, :focus).",
    },
    {
      id: "08-ej-02",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 2,
      prompt:
        "Completa el pseudo-elemento para estilizar la primera letra de los parrafos:",
      codeTemplate: {
        html: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>`,
        cssPrefix: "p::",
        cssSuffix: " {\n  font-size: 2em;\n  font-weight: bold;\n  color: crimson;\n}",
        blanks: ["first-letter"],
      },
      validation: { type: "exact", answer: "first-letter" },
      hint: "El nombre del pseudo-elemento describe lo que selecciona: la primera (first) letra (letter).",
      explanation:
        "El pseudo-elemento '::first-letter' selecciona la primera letra de un elemento de bloque. Se usa comunmente para crear capitulares decorativas en articulos y libros.",
    },
    {
      id: "08-ej-03",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 3,
      prompt:
        "Que propiedad es OBLIGATORIA para que ::before y ::after se muestren?",
      options: [
        { id: "a", text: "display", isCorrect: false },
        { id: "b", text: "position", isCorrect: false },
        { id: "c", text: "content", isCorrect: true },
        { id: "d", text: "visibility", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Es la propiedad que define QUE contenido se inserta. Sin ella, el pseudo-elemento no existe.",
      explanation:
        "La propiedad 'content' es absolutamente obligatoria para ::before y ::after. Incluso si no quieres mostrar texto, necesitas content: \"\" (cadena vacia). Sin esta propiedad, el pseudo-elemento simplemente no se renderiza.",
    },
    {
      id: "08-ej-04",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt:
        "Arrastra cada pseudo-elemento a su descripcion correcta:",
      dragItems: [
        { id: "drag-1", content: "::first-letter", correctZone: "zone-letra" },
        { id: "drag-2", content: "::first-line", correctZone: "zone-linea" },
        { id: "drag-3", content: "::before", correctZone: "zone-antes" },
        { id: "drag-4", content: "::after", correctZone: "zone-despues" },
      ],
      dropZones: [
        { id: "zone-letra", label: "Estiliza la primera letra" },
        { id: "zone-linea", label: "Estiliza la primera linea" },
        { id: "zone-antes", label: "Inserta contenido antes" },
        { id: "zone-despues", label: "Inserta contenido despues" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-letra",
          "drag-2": "zone-linea",
          "drag-3": "zone-antes",
          "drag-4": "zone-despues",
        },
      },
      hint: "Los nombres de los pseudo-elementos son descriptivos: first-letter = primera letra, before = antes, after = despues.",
      explanation:
        "::first-letter estiliza la primera letra de un bloque, ::first-line la primera linea visible, ::before inserta contenido antes del contenido del elemento, y ::after inserta contenido despues.",
    },
    {
      id: "08-ej-05",
      type: "code-completion",
      difficulty: 2,
      xpReward: 15,
      order: 5,
      prompt:
        "Completa la propiedad para que ::after muestre un asterisco rojo despues del label:",
      codeTemplate: {
        html: `<label class="requerido">Email</label>`,
        cssPrefix: `.requerido::after {\n  `,
        cssSuffix: `: " *";\n  color: red;\n  font-weight: bold;\n}`,
        blanks: ["content"],
      },
      validation: { type: "exact", answer: "content" },
      hint: "Es la propiedad obligatoria que define que texto o contenido se inserta en el pseudo-elemento.",
      explanation:
        "La propiedad 'content' define el contenido que se inserta. En este caso, content: \" *\" inserta un espacio seguido de un asterisco, indicando visualmente que el campo es obligatorio.",
    },
    {
      id: "08-ej-06",
      type: "live-editor",
      difficulty: 2,
      xpReward: 25,
      order: 6,
      prompt:
        "Escribe CSS para crear una linea decorativa despues del h2 usando ::after. La linea debe ser un bloque (display: block) con width: 80px, height: 3px, background-color: tomato y margin-top: 8px. Recuerda la propiedad content.",
      codeTemplate: {
        html: `<h2 class="titulo">Seccion Importante</h2>\n<p>Contenido de la seccion.</p>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".titulo::after {\n  content: \"\";\n  display: block;\n  width: 80px;\n  height: 3px;\n  background-color: tomato;\n  margin-top: 8px;\n}",
      validation: {
        type: "includes",
        answer: ["::after", "content", "display", "block", "width", "80px", "height", "3px", "background-color", "tomato"],
      },
      hint: "Usa .titulo::after con content: \"\" (vacio, solo queremos la linea visual). Luego display: block para que ocupe su propia linea, y las dimensiones indicadas.",
      explanation:
        "Se usa ::after con content: \"\" para crear un elemento visual sin texto. display: block hace que ocupe su propia linea. Luego se define el tamano (width/height) y el color de fondo para crear la linea decorativa.",
    },
    {
      id: "08-ej-07",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 7,
      prompt:
        "En que tipo de elementos NO funcionan ::before y ::after?",
      options: [
        { id: "a", text: "Elementos de bloque como <div>", isCorrect: false },
        { id: "b", text: "Elementos en linea como <span>", isCorrect: false },
        {
          id: "c",
          text: "Elementos vacios como <img>, <input> y <br>",
          isCorrect: true,
        },
        { id: "d", text: "Elementos con clase", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Son elementos que no pueden tener contenido hijo. No tienen etiqueta de cierre.",
      explanation:
        "::before y ::after se insertan DENTRO del elemento, como hijos. Los elementos vacios (void elements) como <img>, <input>, <br> y <hr> no pueden tener contenido hijo, por lo que estos pseudo-elementos no funcionan en ellos.",
    },
    {
      id: "08-ej-08",
      type: "visual-match",
      difficulty: 3,
      xpReward: 30,
      order: 8,
      prompt:
        "Reproduce el diseno: un parrafo con la primera letra de tamano 2.5em, color steelblue y font-weight bold. Ademas, el texto del parrafo debe tener font-size: 16px, line-height: 1.7 y color: #555.",
      codeTemplate: {
        html: `<p class="editorial">Habia una vez un desarrollador web que descubrio el poder de los pseudo-elementos CSS. Desde entonces, sus paginas nunca volvieron a ser las mismas. Cada detalle tipografico contaba una historia visual.</p>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".editorial {\n  font-size: 16px;\n  line-height: 1.7;\n  color: #555;\n}\n\n.editorial::first-letter {\n  font-size: 2.5em;\n  color: steelblue;\n  font-weight: bold;\n}",
      validation: {
        type: "includes",
        answer: [
          "::first-letter",
          "font-size",
          "2.5em",
          "steelblue",
          "font-weight",
          "bold",
          "16px",
          "line-height",
          "1.7",
          "#555",
        ],
      },
      hint: "Necesitas dos reglas: una para el parrafo (.editorial) con sus estilos base, y otra para .editorial::first-letter con la capitular decorativa.",
      explanation:
        "Se combina el estilo base del parrafo con el pseudo-elemento ::first-letter para crear una capitular. La primera letra se muestra grande (2.5em), en color steelblue y negrita, mientras el resto del texto mantiene sus estilos normales.",
    },
  ],
};
