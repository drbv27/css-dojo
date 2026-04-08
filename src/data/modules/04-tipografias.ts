import type { ModuleData } from "@/types";

export const tipografiasModule: ModuleData = {
  slug: "tipografias",
  title: "Tipografias",
  description:
    "Aprende a controlar las fuentes de tu sitio web: familias tipograficas, tamanos, estilos y pesos.",
  order: 4,
  dojo: "css" as const,
  category: "intro",
  icon: "Type",
  lessons: [
    {
      id: "04-leccion-01",
      title: "Familias tipograficas",
      content: `## Familias tipograficas

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
2. Si no esta disponible, prueba **Times New Roman** (entre comillas porque tiene espacios)
3. Como ultimo recurso, usa cualquier fuente **serif** del sistema

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

### Familias genericas

Siempre termina tu lista con una **familia generica**:
- \`serif\` - Fuentes con remates (Georgia, Times)
- \`sans-serif\` - Fuentes sin remates (Arial, Helvetica)
- \`monospace\` - Fuentes de ancho fijo (Courier, Consolas)
- \`cursive\` - Fuentes que imitan escritura a mano
- \`fantasy\` - Fuentes decorativas

> **Regla de oro:** Siempre incluye al menos una fuente de respaldo y una familia generica al final.`,
      codeExample: {
        html: `<h1>Titulo con Georgia</h1>\n<p class="sans">Texto con Arial (sans-serif)</p>\n<p class="serif">Texto con Georgia (serif)</p>\n<code class="mono">Codigo con Courier New (monospace)</code>`,
        css: `h1 {\n  font-family: Georgia, "Times New Roman", serif;\n}\n.sans {\n  font-family: Arial, Helvetica, sans-serif;\n}\n.serif {\n  font-family: Georgia, serif;\n}\n.mono {\n  font-family: "Courier New", Courier, monospace;\n}`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "04-leccion-02",
      title: "Tamano de fuente",
      content: `## Tamano de fuente

La propiedad \`font-size\` controla el **tamano del texto**. Existen varias unidades que puedes usar.

### Unidades absolutas

#### px (pixeles)
La unidad mas comun y facil de entender:

\`\`\`css
p { font-size: 16px; }
h1 { font-size: 32px; }
\`\`\`

### Unidades relativas

#### rem (root em)
Relativa al tamano de fuente del **elemento raiz** (\`<html>\`). Por defecto, 1rem = 16px:

\`\`\`css
html { font-size: 16px; }  /* Base */
p { font-size: 1rem; }     /* 16px */
h1 { font-size: 2rem; }    /* 32px */
h2 { font-size: 1.5rem; }  /* 24px */
\`\`\`

#### em
Relativa al tamano de fuente del **elemento padre**:

\`\`\`css
.padre { font-size: 20px; }
.hijo { font-size: 1.5em; }  /* 30px (20 x 1.5) */
\`\`\`

> **Cuidado con em:** Se acumula en elementos anidados, lo que puede causar tamanos inesperados.

### Tabla comparativa

| Unidad | Relativa a | Ejemplo | Resultado (base 16px) |
|--------|-----------|---------|----------------------|
| \`px\` | Nada (absoluta) | \`16px\` | 16px |
| \`rem\` | Raiz (html) | \`1.5rem\` | 24px |
| \`em\` | Elemento padre | \`1.5em\` | Depende del padre |
| \`%\` | Elemento padre | \`120%\` | Depende del padre |

### Cual usar?

- **rem** es la unidad **recomendada actualmente** para la mayoria de los casos
- **px** es util cuando necesitas un tamano exacto e inmutable
- **em** es util para componentes que deben escalar proporcionalmente

> **Consejo profesional:** Usa \`rem\` como unidad predeterminada. Facilita la accesibilidad porque respeta las preferencias de tamano de texto del usuario.`,
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

| Valor | Nombre comun |
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

> **Nota:** No todas las fuentes soportan los 9 pesos. Si usas un peso que la fuente no tiene, el navegador usara el mas cercano disponible.`,
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

La distincion mas importante en tipografia es entre fuentes **serif** y **sans-serif**.

### Que es un serif?

Un **serif** (o remate) es un pequeno trazo decorativo al final de las lineas principales de una letra. La palabra "sans" viene del frances y significa "sin".

### Fuentes Serif

Tienen **pequeños remates** en los extremos de las letras.

**Ejemplos:** Georgia, Times New Roman, Garamond, Palatino

**Caracteristicas:**
- Aspecto **clasico y elegante**
- Facilitan la lectura en **textos impresos** largos
- Transmiten **formalidad y tradicion**
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

Cada caracter ocupa el **mismo ancho**. Esenciales para mostrar codigo.

**Ejemplos:** Courier New, Consolas, Fira Code

### Cuando usar cada una?

| Contexto | Recomendacion |
|----------|--------------|
| Cuerpo de texto web | Sans-serif |
| Titulos editoriales | Serif |
| Codigo fuente | Monospace |
| Interfaces de usuario | Sans-serif |
| Invitaciones formales | Serif |

> **Tendencia actual:** La mayoria de sitios web modernos usan sans-serif para el cuerpo del texto y serif para titulos o acentos visuales.`,
      codeExample: {
        html: `<h1 class="serif">Titulo con Serif (Georgia)</h1>\n<p class="sans">Este parrafo usa una fuente sans-serif (Arial). Es limpia y moderna, ideal para interfaces web.</p>\n<pre class="mono">const saludo = "Hola Mundo";\nconsole.log(saludo);</pre>`,
        css: `.serif {\n  font-family: Georgia, "Times New Roman", serif;\n  font-size: 28px;\n}\n.sans {\n  font-family: Arial, Helvetica, sans-serif;\n  font-size: 16px;\n  line-height: 1.6;\n}\n.mono {\n  font-family: "Courier New", Courier, monospace;\n  font-size: 14px;\n  background-color: #f4f4f4;\n  padding: 12px;\n  border-radius: 4px;\n}`,
        editable: false,
      },
      order: 4,
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
        "Que unidad se recomienda actualmente para definir font-size en la mayoria de los casos?",
      options: [
        { id: "a", text: "px", isCorrect: false },
        { id: "b", text: "rem", isCorrect: true },
        { id: "c", text: "cm", isCorrect: false },
        { id: "d", text: "pt", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Es una unidad relativa al tamano de fuente del elemento raiz (html). Tres letras.",
      explanation:
        "La unidad 'rem' (root em) es la recomendada porque es relativa al tamano base del documento, lo que facilita la accesibilidad y el diseno responsivo. Por defecto, 1rem = 16px.",
    },
    {
      id: "04-ej-02",
      type: "code-completion",
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt:
        "Completa la familia generica de respaldo para esta lista de fuentes serif:",
      codeTemplate: {
        html: `<p>Texto con fuente serif</p>`,
        cssPrefix: 'p {\n  font-family: Georgia, "Times New Roman", ',
        cssSuffix: ";\n}",
        blanks: ["serif"],
      },
      validation: { type: "exact", answer: "serif" },
      hint: "Georgia y Times New Roman son fuentes con remates. La familia generica que las agrupa es...",
      explanation:
        "La familia generica 'serif' es el respaldo final para fuentes con remates como Georgia y Times New Roman. Siempre debe ir al final de la lista de font-family.",
    },
    {
      id: "04-ej-03",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 3,
      prompt:
        "Arrastra cada fuente a su categoria tipografica correcta:",
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
        "Arial es sans-serif (sin remates, moderna). Georgia es serif (con remates decorativos, clasica). Courier New es monospace (cada caracter ocupa el mismo ancho, ideal para codigo).",
    },
    {
      id: "04-ej-04",
      type: "live-editor",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt:
        "Aplica a todos los parrafos (<p>): fuente Arial, tamano de 18px, peso 600 y estilo italica.",
      codeTemplate: {
        html: `<p>Primer parrafo de prueba.</p>\n<p>Segundo parrafo de prueba.</p>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        "p {\n  font-family: Arial, sans-serif;\n  font-size: 18px;\n  font-weight: 600;\n  font-style: italic;\n}",
      validation: {
        type: "includes",
        answer: [
          "font-family",
          "Arial",
          "font-size",
          "18px",
          "font-weight",
          "600",
          "font-style",
          "italic",
        ],
      },
      hint: "Necesitas cuatro propiedades: font-family, font-size, font-weight y font-style.",
      explanation:
        "Se combinan cuatro propiedades tipograficas: font-family: Arial para la fuente, font-size: 18px para el tamano, font-weight: 600 para semi-negrita y font-style: italic para cursiva.",
    },
    {
      id: "04-ej-05",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt:
        "Si el tamano base del documento es 16px (valor por defecto), cuanto es 2rem en pixeles?",
      options: [
        { id: "a", text: "24px", isCorrect: false },
        { id: "b", text: "32px", isCorrect: true },
        { id: "c", text: "20px", isCorrect: false },
        { id: "d", text: "8px", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "1rem = 16px. Entonces 2rem = 16px multiplicado por 2.",
      explanation:
        "Como 1rem equivale al tamano de fuente raiz (16px por defecto), 2rem = 16px x 2 = 32px.",
    },
    {
      id: "04-ej-06",
      type: "code-completion",
      difficulty: 1 ,
      xpReward: 10,
      order: 6,
      prompt:
        "El diseno pide que el titulo h1 este en negrita. Completa el valor de font-weight:",
      codeTemplate: {
        html: `<h1>Titulo en negrita</h1>`,
        cssPrefix: "h1 {\n  font-weight: ",
        cssSuffix: ";\n}",
        blanks: ["bold"],
      },
      validation: { type: "exact", answer: "bold" },
      hint: "La palabra clave en ingles para 'negrita' es muy comun y tiene cuatro letras.",
      explanation:
        "El valor 'bold' establece el texto en negrita, equivalente a font-weight: 700. Es la forma mas comun de poner texto en negrita con CSS.",
    },
    {
      id: "04-ej-07",
      type: "visual-match",
      difficulty: 3 ,
      xpReward: 30,
      order: 7,
      prompt:
        "Reproduce el diseno objetivo: h1 con fuente Georgia, tamano 36px y negrita (bold). Parrafos con fuente Arial, tamano 16px y peso normal (400).",
      codeTemplate: {
        html: `<h1>Titulo del articulo</h1>\n<p>Este es el primer parrafo del articulo con fuente sans-serif.</p>\n<p>Este es el segundo parrafo.</p>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        'h1 {\n  font-family: Georgia, serif;\n  font-size: 36px;\n  font-weight: bold;\n}\n\np {\n  font-family: Arial, sans-serif;\n  font-size: 16px;\n  font-weight: 400;\n}',
      validation: {
        type: "includes",
        answer: [
          "h1",
          "font-family",
          "Georgia",
          "font-size",
          "36px",
          "font-weight",
          "bold",
          "p",
          "Arial",
          "16px",
        ],
      },
      hint: "Necesitas dos reglas: una para h1 (Georgia, 36px, bold) y otra para p (Arial, 16px, normal).",
      explanation:
        "Se crean dos reglas: h1 con Georgia serif a 36px en negrita para un titulo clasico, y p con Arial sans-serif a 16px con peso normal para un cuerpo de texto limpio y legible.",
    },
    {
      id: "04-ej-08",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 8,
      prompt: "Que propiedad CSS convierte el texto a cursiva?",
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
  ],
};
