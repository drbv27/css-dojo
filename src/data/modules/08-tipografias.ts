import type { ModuleData } from "@/types";

export const tipografiasModule: ModuleData = {
  slug: "tipografias",
  title: "Tipografías",
  description:
    "Aprende a controlar las fuentes de tu sitio web: familias tipográficas, tamaños, estilos y pesos.",
  order: 9,
  dojo: "css" as const,
  nivel: "obligatorio",
  category: "css-texto",
  icon: "Type",
  lessons: [
    {
      id: "04-leccion-01",
      title: "Familias tipográficas",
      content: `## Familias tipográficas

La propiedad \`font-family\` define que **fuente** se usa para mostrar el texto de un elemento.

### Sintaxis

\`\`\`css
p {
  font-family: Arial, Helvetica, sans-serif;
}
\`\`\`

### Fuentes de respaldo (fallback)

Es fundamental declarar **varias fuentes en orden de preferencia**. Si el navegador no encuentra la primera, prueba la siguiente:

\`\`\`css
h1 {
  font-family: Georgia, "Times New Roman", serif;
}
\`\`\`

1. Intenta usar **Georgia**
2. Si no está disponible, prueba **Times New Roman** (entre comillas porque tiene espacios)
3. Como último recurso, usa cualquier fuente **serif** del sistema

### Fuentes seguras para la web (web safe fonts)

Estas fuentes estan disponibles en practicamente todos los dispositivos:

| Fuente | Tipo |
|--------|------|
| Arial | Sans-serif |
| Verdana | Sans-serif |
| Helvetica | Sans-serif |
| Georgia | Serif |
| Times New Roman | Serif |
| Courier New | Monospace |

### Familias genéricas

Siempre termina tu lista con una **familia genérica**:
- \`serif\` - Fuentes con remates (Georgia, Times)
- \`sans-serif\` - Fuentes sin remates (Arial, Helvetica)
- \`monospace\` - Fuentes de ancho fijo (Courier, Consolas)
- \`cursive\` - Fuentes que imitan escritura a mano
- \`fantasy\` - Fuentes decorativas

> **Regla de oro:** Siempre incluye al menos una fuente de respaldo y una familia genérica al final.`,
      codeExample: {
        html: `<h1>Titulo con Georgia</h1>\n<p class="sans">Texto con Arial (sans-serif)</p>\n<p class="serif">Texto con Georgia (serif)</p>\n<code class="mono">Codigo con Courier New (monospace)</code>`,
        css: `h1 {\n  font-family: Georgia, "Times New Roman", serif;\n}\n.sans {\n  font-family: Arial, Helvetica, sans-serif;\n}\n.serif {\n  font-family: Georgia, serif;\n}\n.mono {\n  font-family: "Courier New", Courier, monospace;\n}`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "04-leccion-02",
      title: "Tamaño de fuente",
      content: `## Tamaño de fuente

La propiedad \`font-size\` controla el **tamaño del texto**. Existen varias unidades que puedes usar.

### Unidades absolutas

#### px (píxeles)
La unidad más común y fácil de entender:

\`\`\`css
p { font-size: 16px; }
h1 { font-size: 32px; }
\`\`\`

### Unidades relativas

#### rem (root em)
Relativa al tamaño de fuente del **elemento raíz** (\`<html>\`). Por defecto, 1rem = 16px:

\`\`\`css
html { font-size: 16px; }  /* Base */
p { font-size: 1rem; }     /* 16px */
h1 { font-size: 2rem; }    /* 32px */
h2 { font-size: 1.5rem; }  /* 24px */
\`\`\`

#### em
Relativa al tamaño de fuente del **elemento padre**:

\`\`\`css
.padre { font-size: 20px; }
.hijo { font-size: 1.5em; }  /* 30px (20 x 1.5) */
\`\`\`

> **Cuidado con em:** Se acumula en elementos anidados, lo que puede causar tamaños inesperados.

### Tabla comparativa

| Unidad | Relativa a | Ejemplo | Resultado (base 16px) |
|--------|-----------|---------|----------------------|
| \`px\` | Nada (absoluta) | \`16px\` | 16px |
| \`rem\` | Raíz (html) | \`1.5rem\` | 24px |
| \`em\` | Elemento padre | \`1.5em\` | Depende del padre |
| \`%\` | Elemento padre | \`120%\` | Depende del padre |

### ¿Cuál usar?

- **rem** es la unidad **recomendada actualmente** para la mayoria de los casos
- **px** es útil cuando necesitas un tamaño exacto e inmutable
- **em** es útil para componentes que deben escalar proporcionalmente

> **Consejo profesional:** Usa \`rem\` como unidad predeterminada. Facilita la accesibilidad porque respeta las preferencias de tamaño de texto del usuario.`,
      codeExample: {
        html: `<h1>Titulo en 2rem (32px)</h1>\n<h2>Subtitulo en 1.5rem (24px)</h2>\n<p>Parrafo en 1rem (16px)</p>\n<small>Texto pequeno en 0.875rem (14px)</small>`,
        css: `h1 {\n  font-size: 2rem;\n}\nh2 {\n  font-size: 1.5rem;\n}\np {\n  font-size: 1rem;\n}\nsmall {\n  font-size: 0.875rem;\n}`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "04-leccion-03",
      title: "Estilo y peso de fuente",
      content: `## Estilo y peso de fuente

Dos propiedades clave para controlar la **apariencia** del texto: \`font-style\` y \`font-weight\`.

---

### font-style

Controla si el texto se muestra en **cursiva** o normal:

| Valor | Efecto |
|-------|--------|
| \`normal\` | Texto normal (predeterminado) |
| \`italic\` | Texto en cursiva |
| \`oblique\` | Texto inclinado (similar a italic pero forzado) |

\`\`\`css
.cita { font-style: italic; }
.normal { font-style: normal; }
\`\`\`

---

### font-weight

Controla el **grosor** (peso) del texto:

#### Valores con palabras clave
\`\`\`css
p { font-weight: normal; }  /* Equivale a 400 */
strong { font-weight: bold; } /* Equivale a 700 */
\`\`\`

#### Valores numericos (100-900)

| Valor | Nombre común |
|-------|-------------|
| 100 | Thin (ultra fina) |
| 200 | Extra Light |
| 300 | Light |
| **400** | **Normal / Regular** |
| 500 | Medium |
| 600 | Semi Bold |
| **700** | **Bold (Negrita)** |
| 800 | Extra Bold |
| 900 | Black (ultra gruesa) |

\`\`\`css
.light { font-weight: 300; }
.regular { font-weight: 400; }
.semibold { font-weight: 600; }
.bold { font-weight: 700; }
\`\`\`

> **Nota:** No todas las fuentes soportan los 9 pesos. Si usas un peso que la fuente no tiene, el navegador usara el más cercano disponible.`,
      codeExample: {
        html: `<p class="light">Texto Light (300)</p>\n<p class="regular">Texto Regular (400)</p>\n<p class="semibold">Texto Semi Bold (600)</p>\n<p class="bold">Texto Bold (700)</p>\n<p class="italica">Texto en cursiva</p>`,
        css: `.light { font-weight: 300; }\n.regular { font-weight: 400; }\n.semibold { font-weight: 600; }\n.bold { font-weight: 700; }\n.italica {\n  font-style: italic;\n  color: slategray;\n}`,
        editable: true,
      },
      order: 3,
    },
    {
      id: "04-leccion-04",
      title: "Serif vs Sans-serif",
      content: `## Serif vs Sans-serif

La distinción más importante en tipografía es entre fuentes **serif** y **sans-serif**.

### ¿Qué es un serif?

Un **serif** (o remate) es un pequeño trazo decorativo al final de las líneas principales de una letra. La palabra "sans" viene del frances y significa "sin".

### Fuentes Serif

Tienen **pequeños remates** en los extremos de las letras.

**Ejemplos:** Georgia, Times New Roman, Garamond, Palatino

**Caracteristicas:**
- Aspecto **clasico y elegante**
- Facilitan la lectura en **textos impresos** largos
- Transmiten **formalidad y tradición**
- Ideales para: editoriales, sitios de noticias, blogs literarios

### Fuentes Sans-serif

**No tienen remates**. Sus trazos son limpios y uniformes.

**Ejemplos:** Arial, Helvetica, Verdana, Roboto, Open Sans

**Caracteristicas:**
- Aspecto **moderno y limpio**
- Excelente **legibilidad en pantallas**
- Transmiten **simplicidad y modernidad**
- Ideales para: aplicaciones web, startups, interfaces de usuario

### Monospace

Cada carácter ocupa el **mismo ancho**. Esenciales para mostrar código.

**Ejemplos:** Courier New, Consolas, Fira Code

### ¿Cuándo usar cada una?

| Contexto | Recomendación |
|----------|--------------|
| Cuerpo de texto web | Sans-serif |
| Títulos editoriales | Serif |
| Código fuente | Monospace |
| Interfaces de usuario | Sans-serif |
| Invitaciones formales | Serif |

> **Tendencia actual:** La mayoria de sitios web modernos usan sans-serif para el cuerpo del texto y serif para títulos o acentos visuales.`,
      codeExample: {
        html: `<h1 class="serif">Titulo con Serif (Georgia)</h1>\n<p class="sans">Este parrafo usa una fuente sans-serif (Arial). Es limpia y moderna, ideal para interfaces web.</p>\n<pre class="mono">const saludo = "Hola Mundo";\nconsole.log(saludo);</pre>`,
        css: `.serif {\n  font-family: Georgia, "Times New Roman", serif;\n  font-size: 28px;\n}\n.sans {\n  font-family: Arial, Helvetica, sans-serif;\n  font-size: 16px;\n  line-height: 1.6;\n}\n.mono {\n  font-family: "Courier New", Courier, monospace;\n  font-size: 14px;\n  background-color: #f4f4f4;\n  padding: 12px;\n  border-radius: 4px;\n}`,
        editable: false,
      },
      order: 4,
    },
    {
      id: "04-leccion-05",
      title: "Alinear el texto",
      content: `## Alinear el texto

Hasta ahora elegimos **qué** fuente usar y de **qué tamaño**. Falta decidir **dónde** se apoya el texto dentro de su espacio. Eso lo hace \`text-align\`.

Vas a ver esta propiedad en casi todos los ejemplos del curso, así que conviene entenderla bien ahora.

### Los cuatro valores

\`\`\`css
p { text-align: left; }     /* pegado a la izquierda (por defecto) */
p { text-align: right; }    /* pegado a la derecha */
p { text-align: center; }   /* centrado */
p { text-align: justify; }  /* estirado para que ambos bordes queden rectos */
\`\`\`

### La trampa que atrapa a todo el mundo

Esta es la parte importante, y la que genera más confusión al empezar:

> \`text-align\` alinea el **contenido que va dentro** de una caja. **No mueve la caja.**

Si tenés un \`div\` de 300px dentro de una página de 1000px y le ponés \`text-align: center\`, el div **no se centra**. Lo que se centra es el texto **adentro** del div, que sigue estando a la izquierda de la página.

Para centrar la caja en sí hace falta otra técnica, y la vas a ver en el próximo módulo. Por ahora quedate con la distinción:

| Querés centrar... | Herramienta |
|---|---|
| el **texto** dentro de una caja | \`text-align: center\` |
| la **caja** dentro de su contenedor | otra cosa (próximo módulo) |

### Se hereda

\`text-align\` es **heredable**: si la aplicás a un contenedor, todo el texto de los elementos que están adentro se alinea igual, sin repetirla en cada uno.

\`\`\`css
.tarjeta { text-align: center; }
/* el h3 y el p que estén dentro de .tarjeta quedan centrados */
\`\`\`

Por eso la vas a ver aplicada a contenedores y no a cada párrafo: se escribe una vez y baja sola.

### Sobre \`justify\`

\`justify\` estira los espacios entre palabras para que el borde derecho quede recto, como en un diario. Se ve prolijo en columnas anchas, pero en columnas angostas abre huecos enormes entre palabras — los tipógrafos les dicen **ríos**. Usalo con cuidado: en pantallas, \`left\` casi siempre se lee mejor.

> **Regla práctica:** \`left\` para cuerpos de texto, \`center\` para títulos y tarjetas, \`right\` para números y fechas, \`justify\` casi nunca.`,
      codeExample: {
        html: `<div class="tarjeta">\n  <h3>Título centrado</h3>\n  <p>Este párrafo hereda el centrado de la tarjeta.</p>\n</div>\n<p class="fecha">12 de marzo</p>\n<p class="cuerpo">Un cuerpo de texto largo se lee mejor alineado a la izquierda, porque el ojo siempre encuentra el mismo punto de partida en cada línea nueva.</p>`,
        css: `.tarjeta {\n  text-align: center;\n  font-family: Arial, sans-serif;\n}\n.fecha {\n  text-align: right;\n  font-size: 14px;\n}\n.cuerpo {\n  text-align: left;\n  line-height: 1.6;\n}`,
        editable: true,
      },
      order: 5,
    },
  ],
  exercises: [
    {
      id: "04-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt:
        "¿Qué unidad se recomienda actualmente para definir font-size en la mayoria de los casos?",
      options: [
        { id: "a", text: "px", isCorrect: false },
        { id: "b", text: "rem", isCorrect: true },
        { id: "c", text: "cm", isCorrect: false },
        { id: "d", text: "pt", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Es una unidad relativa al tamaño de fuente del elemento raíz (html). Tres letras.",
      explanation:
        "La unidad 'rem' (root em) es la recomendada porque es relativa al tamaño base del documento, lo que facilita la accesibilidad y el diseño responsivo. Por defecto, 1rem = 16px.",
    },
    {
      id: "04-ej-02",
      type: "code-completion",
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt:
        "Completa la familia genérica de respaldo para esta lista de fuentes serif:",
      codeTemplate: {
        html: `<p>Texto con fuente serif</p>`,
        cssPrefix: 'p {\n  font-family: Georgia, "Times New Roman", ',
        cssSuffix: ";\n}",
        blanks: ["serif"],
      },
      validation: { type: "exact", answer: "serif" },
      hint: "Georgia y Times New Roman son fuentes con remates. La familia genérica que las agrupa es...",
      explanation:
        "La familia genérica 'serif' es el respaldo final para fuentes con remates como Georgia y Times New Roman. Siempre debe ir al final de la lista de font-family.",
    },
    {
      id: "04-ej-03",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 3,
      prompt:
        "Arrastra cada fuente a su categoría tipográfica correcta:",
      dragItems: [
        { id: "drag-1", content: "Arial", correctZone: "zone-sans" },
        { id: "drag-2", content: "Georgia", correctZone: "zone-serif" },
        {
          id: "drag-3",
          content: "Courier New",
          correctZone: "zone-mono",
        },
      ],
      dropZones: [
        { id: "zone-sans", label: "Sans-serif" },
        { id: "zone-serif", label: "Serif" },
        { id: "zone-mono", label: "Monospace" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-sans",
          "drag-2": "zone-serif",
          "drag-3": "zone-mono",
        },
      },
      hint: "Arial no tiene remates (sans-serif), Georgia tiene remates decorativos (serif), y Courier New tiene caracteres de ancho fijo (monospace).",
      explanation:
        "Arial es sans-serif (sin remates, moderna). Georgia es serif (con remates decorativos, clasica). Courier New es monospace (cada carácter ocupa el mismo ancho, ideal para código).",
    },
    {
      id: "04-ej-04",
      type: "live-editor",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt:
        "Aplica a todos los párrafos (<p>): la pila Arial, sans-serif, tamaño de 18px, peso 600 y estilo italica.",
      codeTemplate: {
        html: `<p>Primer parrafo de prueba.</p>\n<p>Segundo parrafo de prueba.</p>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        "p {\n  font-family: Arial, sans-serif;\n  font-size: 18px;\n  font-weight: 600;\n  font-style: italic;\n}",
      validation: {
        // Graded by parsing `targetCSS` into selector -> declarations, not by
        // searching the submission for loose words. See src/lib/cssRules.ts.
        type: "css-rules",
      },
      hint: "Necesitas cuatro propiedades: font-family, font-size, font-weight y font-style.",
      explanation:
        "Se combinan cuatro propiedades tipográficas: font-family: Arial para la fuente, font-size: 18px para el tamaño, font-weight: 600 para semi-negrita y font-style: italic para cursiva.",
    },
    {
      id: "04-ej-05",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt:
        "Si el tamaño base del documento es 16px (valor por defecto), ¿cuánto es 2rem en píxeles?",
      options: [
        { id: "a", text: "24px", isCorrect: false },
        { id: "b", text: "32px", isCorrect: true },
        { id: "c", text: "20px", isCorrect: false },
        { id: "d", text: "8px", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "1rem = 16px. Entonces 2rem = 16px multiplicado por 2.",
      explanation:
        "Como 1rem equivale al tamaño de fuente raíz (16px por defecto), 2rem = 16px x 2 = 32px.",
    },
    {
      id: "04-ej-06",
      type: "code-completion",
      difficulty: 1 ,
      xpReward: 10,
      order: 6,
      prompt:
        "El diseño pide que el título h1 este en negrita. Completa el valor de font-weight:",
      codeTemplate: {
        html: `<h1>Titulo en negrita</h1>`,
        cssPrefix: "h1 {\n  font-weight: ",
        cssSuffix: ";\n}",
        blanks: ["bold"],
      },
      validation: { type: "exact", answer: "bold" },
      hint: "La palabra clave en ingles para 'negrita' es muy común y tiene cuatro letras.",
      explanation:
        "El valor 'bold' establece el texto en negrita, equivalente a font-weight: 700. Es la forma más común de poner texto en negrita con CSS.",
    },
    {
      id: "04-ej-07",
      type: "visual-match",
      difficulty: 3 ,
      xpReward: 30,
      order: 7,
      prompt:
        "Reproduce el diseño objetivo: h1 con la pila Georgia, serif, tamaño 36px y negrita (bold). Párrafos con la pila Arial, sans-serif, tamaño 16px y peso normal (400).",
      codeTemplate: {
        html: `<h1>Titulo del articulo</h1>\n<p>Este es el primer parrafo del articulo con fuente sans-serif.</p>\n<p>Este es el segundo parrafo.</p>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        'h1 {\n  font-family: Georgia, serif;\n  font-size: 36px;\n  font-weight: bold;\n}\n\np {\n  font-family: Arial, sans-serif;\n  font-size: 16px;\n  font-weight: 400;\n}',
      validation: {
        // Graded by parsing `targetCSS` into selector -> declarations, not by
        // searching the submission for loose words. See src/lib/cssRules.ts.
        type: "css-rules",
      },
      hint: "Necesitas dos reglas: una para h1 (Georgia, 36px, bold) y otra para p (Arial, 16px, normal).",
      explanation:
        "Se crean dos reglas: h1 con Georgia serif a 36px en negrita para un título clasico, y p con Arial sans-serif a 16px con peso normal para un cuerpo de texto limpio y legible.",
    },
    {
      id: "04-ej-08",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 8,
      prompt: "¿Qué propiedad CSS convierte el texto a cursiva?",
      options: [
        { id: "a", text: "font-style", isCorrect: true },
        { id: "b", text: "font-weight", isCorrect: false },
        { id: "c", text: "text-decoration", isCorrect: false },
        { id: "d", text: "font-variant", isCorrect: false },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "La propiedad empieza con 'font-' y su valor para cursiva es 'italic'.",
      explanation:
        "La propiedad 'font-style' con el valor 'italic' convierte el texto a cursiva. 'font-weight' controla el grosor, 'text-decoration' agrega subrayado/tachado, y 'font-variant' controla variantes como versalitas.",
    },
    {
      id: "04-ej-09",
      type: "quiz",
      difficulty: 2,
      xpReward: 15,
      order: 9,
      prompt:
        "Un div de 300px de ancho está dentro de una página de 1000px. Le aplicás text-align: center. ¿Qué pasa?",
      options: [
        {
          id: "a",
          text: "El div se mueve al centro de la página",
          isCorrect: false,
        },
        {
          id: "b",
          text: "El texto se centra dentro del div, pero el div no se mueve",
          isCorrect: true,
        },
        { id: "c", text: "Se centran el div y su texto", isCorrect: false },
        { id: "d", text: "No pasa nada, hace falta un ancho mayor", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "La propiedad se llama text-align. Pensá en qué palabra tiene: alinea texto, no cajas.",
      explanation:
        "text-align alinea el contenido que va DENTRO de la caja; no mueve la caja. El div sigue pegado a la izquierda de la página y su texto queda centrado en esos 300px. Para centrar la caja hace falta otra técnica, que ves en el modulo de dimensiones.",
    },
    {
      id: "04-ej-10",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 10,
      prompt:
        "Arma el encabezado de una nota. A la clase `.titulo` dale text-align: center y font-size: 28px. A la clase `.firma` dale text-align: right y font-style: italic. Al párrafo con clase `.cuerpo` dale text-align: left y line-height: 1.6.",
      codeTemplate: {
        html: `<h2 class="titulo">Cronica de un lunes</h2>\n<p class="cuerpo">El texto del cuerpo se lee mejor alineado a la izquierda, porque el ojo encuentra el mismo punto de partida en cada linea.</p>\n<p class="firma">Por Ana Martinez</p>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".titulo {\n  text-align: center;\n  font-size: 28px;\n}\n.firma {\n  text-align: right;\n  font-style: italic;\n}\n.cuerpo {\n  text-align: left;\n  line-height: 1.6;\n}",
      validation: {
        // Graded by parsing `targetCSS` into selector -> declarations, not by
        // searching the submission for loose words. See src/lib/cssRules.ts.
        type: "css-rules",
      },
      hint: "Son tres reglas separadas, una por clase. Cada una lleva su text-align más la segunda propiedad que pide el enunciado.",
      explanation:
        "Cada alineación responde a su contenido: los títulos centrados equilibran el bloque, las firmas y fechas a la derecha se leen como un cierre, y el cuerpo a la izquierda es lo que mejor se lee en pantalla.",
    },
    {
      /** EL RETO INTEGRADOR del modulo. Ver src/lib/calificar.ts. */
      id: "04-ej-reto",
      type: "live-editor",
      difficulty: 3,
      xpReward: 60,
      order: 11,
      prompt:
        "Reto integrador. Un bloque de texto legible se arma con cuatro decisiones: la familia, el tamaño, el peso y cómo se alinea.",
      retoPasos: [
        {
          instruccion:
            "Dale a .nota la familia Georgia con serif como respaldo. Siempre se declara una alternativa generica por si la primera no esta.",
          esperado: ".nota { font-family: Georgia, serif; }",
        },
        {
          instruccion:
            "Dale a `.nota p` un tamaño de 17px y un interlineado de 1.7. El interlineado es lo que más cambia la legibilidad de un párrafo largo.",
          esperado: ".nota p { font-size: 17px; line-height: 1.7; }",
        },
        {
          instruccion:
            "Dale a `.nota h3` un peso de 700 y un estilo italic.",
          esperado: ".nota h3 { font-weight: 700; font-style: italic; }",
        },
        {
          instruccion:
            "Justifica `.nota p` con text-align.",
          esperado: ".nota p { text-align: justify; }",
        },
      ],
      codeTemplate: {
        html: `<article class="nota">\n  <h3>Un título con carácter</h3>\n  <p>El cuerpo del texto es donde se gana o se pierde la legibilidad.</p>\n</article>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      validation: {
        type: "css-rules",
      },
      referenceSolution:
        ".nota {\n  font-family: Georgia, serif;\n}\n\n.nota p {\n  font-size: 17px;\n  line-height: 1.7;\n  text-align: justify;\n}\n\n.nota h3 {\n  font-weight: 700;\n  font-style: italic;\n}",
      hint: "La familia se hereda: declarandola en .nota alcanza al h3 y al párrafo sin repetirla.",
      explanation:
        "La familia se declara una vez en el contenedor y se hereda hacia adentro, por eso no hace falta repetirla. El tamaño y el interlineado son la pareja que decide si un párrafo se lee comodo: 1.7 de interlineado da aire suficiente. Y el peso y el estilo distinguen al título del cuerpo sin cambiar de familia.",
    },
  ],
};
