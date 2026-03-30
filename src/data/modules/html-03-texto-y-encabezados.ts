import type { ModuleData } from "@/types";

export const htmlTextoModule: ModuleData = {
  slug: "html-03-texto-y-encabezados",
  title: "Texto y encabezados",
  description:
    "Domina las etiquetas de texto en HTML: encabezados h1-h6, parrafos, saltos de linea, lineas horizontales, formato de texto y citas.",
  order: 3,
  dojo: "html",
  category: "html-fundamentals",
  icon: "heading",
  lessons: [
    {
      id: "html-03-leccion-01",
      title: "Encabezados h1 a h6",
      content: `## Encabezados h1 a h6

Los encabezados definen la **jerarquia** del contenido en una pagina web. HTML ofrece seis niveles de encabezados, desde \`<h1>\` (el mas importante) hasta \`<h6>\` (el menos importante).

### Jerarquia de encabezados

- \`<h1>\` — Titulo principal de la pagina (solo debe haber **uno** por pagina)
- \`<h2>\` — Secciones principales
- \`<h3>\` — Subsecciones
- \`<h4>\` — Sub-subsecciones
- \`<h5>\` — Detalles menores
- \`<h6>\` — Nivel mas bajo de encabezado

### Reglas importantes

1. **No saltes niveles**: despues de un \`<h2>\` usa \`<h3>\`, no \`<h4>\`
2. **Un solo h1 por pagina**: es importante para SEO y accesibilidad
3. **No uses encabezados solo por tamano**: si quieres texto grande, usa CSS

> **Para accesibilidad:** Los lectores de pantalla generan un indice de la pagina basandose en los encabezados. Una jerarquia correcta facilita la navegacion.`,
      codeExample: {
        html: `<h1>Titulo principal (h1)</h1>\n<h2>Seccion importante (h2)</h2>\n<h3>Subseccion (h3)</h3>\n<h4>Detalle (h4)</h4>\n<h5>Sub-detalle (h5)</h5>\n<h6>Nivel minimo (h6)</h6>`,
        css: `h1, h2, h3, h4, h5, h6 {\n  font-family: sans-serif;\n  color: #2d3748;\n  margin: 8px 0;\n}\n\nh1 { color: #2b6cb0; }\nh2 { color: #2c7a7b; }\nh3 { color: #276749; }`,
        editable: false,
      },
      order: 1,
    },
    {
      id: "html-03-leccion-02",
      title: "Parrafos, saltos de linea y lineas horizontales",
      content: `## Parrafos, saltos de linea y lineas horizontales

### Parrafos: \`<p>\`

La etiqueta \`<p>\` define un **parrafo de texto**. El navegador automaticamente agrega un espacio (margen) antes y despues de cada parrafo.

\`\`\`html
<p>Este es un parrafo.</p>
<p>Este es otro parrafo.</p>
\`\`\`

> **Nota:** HTML ignora los espacios y saltos de linea multiples en el codigo fuente. Varios espacios seguidos se muestran como uno solo.

### Salto de linea: \`<br>\`

La etiqueta \`<br>\` inserta un **salto de linea** dentro de un parrafo. Es una etiqueta **auto-cerrada** (no tiene etiqueta de cierre).

\`\`\`html
<p>Primera linea<br>Segunda linea</p>
\`\`\`

### Linea horizontal: \`<hr>\`

La etiqueta \`<hr>\` inserta una **linea divisoria horizontal**. Se usa para separar secciones de contenido. Tambien es auto-cerrada.

\`\`\`html
<p>Seccion uno</p>
<hr>
<p>Seccion dos</p>
\`\`\`

> **Buena practica:** Evita usar \`<br>\` para crear espacios entre parrafos. Usa multiples etiquetas \`<p>\` en su lugar.`,
      codeExample: {
        html: `<p>HTML es el lenguaje de la web.</p>\n<p>Con el puedes estructurar contenido<br>y crear paginas increibles.</p>\n<hr>\n<p>Esta seccion esta separada por una linea horizontal.</p>`,
        css: `p {\n  font-family: sans-serif;\n  color: #4a5568;\n  line-height: 1.6;\n}\n\nhr {\n  border: none;\n  border-top: 2px solid #e2e8f0;\n  margin: 16px 0;\n}`,
        editable: false,
      },
      order: 2,
    },
    {
      id: "html-03-leccion-03",
      title: "Formato de texto: strong, em, mark y small",
      content: `## Formato de texto

HTML ofrece etiquetas para dar **significado semantico** al texto, no solo apariencia visual.

### \`<strong>\` — Importancia fuerte
Indica que el texto es de **gran importancia**. Los navegadores lo muestran en **negrita**.

\`\`\`html
<p><strong>Advertencia:</strong> No borres este archivo.</p>
\`\`\`

### \`<em>\` — Enfasis
Da **enfasis** al texto. Los navegadores lo muestran en *cursiva*.

\`\`\`html
<p>Debes <em>siempre</em> guardar tus cambios.</p>
\`\`\`

### \`<mark>\` — Texto resaltado
**Resalta** texto como si estuviera marcado con un resaltador amarillo.

\`\`\`html
<p>El resultado fue <mark>aprobado</mark>.</p>
\`\`\`

### \`<small>\` — Texto pequeno
Representa texto de **menor importancia**, como notas al pie o texto legal.

\`\`\`html
<p><small>Terminos y condiciones aplican.</small></p>
\`\`\`

### Diferencia entre semantica y presentacion

- \`<strong>\` significa importancia (no solo negrita)
- \`<em>\` significa enfasis (no solo cursiva)
- Usa CSS si solo quieres cambiar la apariencia sin anadir significado

> **Importante:** Evita usar \`<b>\` y \`<i>\` cuando quieres dar significado al texto. Usa \`<strong>\` y \`<em>\` respectivamente.`,
      codeExample: {
        html: `<p><strong>Importante:</strong> Siempre guarda tu trabajo.</p>\n<p>Debes <em>verificar</em> antes de enviar.</p>\n<p>Tu calificacion: <mark>Excelente</mark></p>\n<p><small>Ultima actualizacion: marzo 2026</small></p>`,
        css: `p {\n  font-family: sans-serif;\n  color: #4a5568;\n  line-height: 1.8;\n  margin: 8px 0;\n}\n\nmark {\n  background-color: #fefcbf;\n  padding: 2px 4px;\n  border-radius: 3px;\n}`,
        editable: false,
      },
      order: 3,
    },
    {
      id: "html-03-leccion-04",
      title: "Citas, codigo preformateado y bloques de codigo",
      content: `## Citas, codigo preformateado y bloques de codigo

### \`<blockquote>\` — Citas en bloque
Se usa para citas largas de otras fuentes. El atributo \`cite\` puede incluir la URL de la fuente.

\`\`\`html
<blockquote cite="https://ejemplo.com">
  <p>La mejor forma de predecir el futuro es inventarlo.</p>
</blockquote>
\`\`\`

### \`<pre>\` — Texto preformateado
Muestra el texto **exactamente como esta escrito** en el codigo fuente, incluyendo espacios y saltos de linea.

\`\`\`html
<pre>
  Linea 1
  Linea 2
    Indentada
</pre>
\`\`\`

### \`<code>\` — Codigo en linea
Representa un fragmento de **codigo informatico** dentro del texto.

\`\`\`html
<p>Usa la etiqueta <code>&lt;p&gt;</code> para parrafos.</p>
\`\`\`

### Combinando \`<pre>\` y \`<code>\`

Para mostrar bloques de codigo con formato, combina ambas etiquetas:

\`\`\`html
<pre><code>&lt;h1&gt;Hola mundo&lt;/h1&gt;
&lt;p&gt;Mi primer parrafo&lt;/p&gt;</code></pre>
\`\`\`

> **Tip:** Para mostrar etiquetas HTML como texto, usa \`&lt;\` en lugar de \`<\` y \`&gt;\` en lugar de \`>\`. Estas son **entidades HTML**.`,
      codeExample: {
        html: `<blockquote>\n  <p>La simplicidad es la maxima sofisticacion.</p>\n  <small>— Leonardo da Vinci</small>\n</blockquote>\n\n<p>Para negrita usa <code>&lt;strong&gt;</code>.</p>\n\n<pre><code>&lt;html&gt;\n  &lt;body&gt;\n    &lt;p&gt;Hola&lt;/p&gt;\n  &lt;/body&gt;\n&lt;/html&gt;</code></pre>`,
        css: `blockquote {\n  border-left: 4px solid #4299e1;\n  margin: 12px 0;\n  padding: 8px 16px;\n  background-color: #ebf8ff;\n  border-radius: 0 8px 8px 0;\n}\n\ncode {\n  background-color: #edf2f7;\n  padding: 2px 6px;\n  border-radius: 4px;\n  font-size: 14px;\n}\n\npre {\n  background-color: #2d3748;\n  color: #e2e8f0;\n  padding: 16px;\n  border-radius: 8px;\n  overflow-x: auto;\n}\n\npre code {\n  background: none;\n  color: inherit;\n}\n\np {\n  font-family: sans-serif;\n  color: #4a5568;\n}`,
        editable: false,
      },
      order: 4,
    },
  ],
  exercises: [
    {
      id: "html-03-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "Cuantos niveles de encabezados tiene HTML?",
      options: [
        { id: "a", text: "4 niveles (h1 a h4)", isCorrect: false },
        { id: "b", text: "6 niveles (h1 a h6)", isCorrect: true },
        { id: "c", text: "3 niveles (h1 a h3)", isCorrect: false },
        { id: "d", text: "10 niveles (h1 a h10)", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Los encabezados van desde el mas importante hasta el menos importante.",
      explanation:
        "HTML tiene 6 niveles de encabezados: h1 (mas importante) hasta h6 (menos importante).",
    },
    {
      id: "html-03-ej-02",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 2,
      prompt: "Cual es la diferencia principal entre <strong> y <b>?",
      options: [
        { id: "a", text: "No hay diferencia, son identicos", isCorrect: false },
        { id: "b", text: "<strong> tiene significado semantico de importancia, <b> solo es visual", isCorrect: true },
        { id: "c", text: "<b> es mas moderno que <strong>", isCorrect: false },
        { id: "d", text: "<strong> solo funciona en HTML5", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Una etiqueta tiene significado semantico y la otra es puramente visual.",
      explanation:
        "<strong> indica que el texto es de gran importancia (semantico). <b> solo aplica negrita visual sin significado adicional.",
    },
    {
      id: "html-03-ej-03",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 3,
      prompt: "Completa la etiqueta para crear un encabezado de nivel 2:",
      codeTemplate: {
        html: `<h1>Titulo principal</h1>\n<_____>Seccion secundaria</_____>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: ["h2", "h2"],
      },
      validation: { type: "exact", answer: ["h2", "h2"] },
      hint: "Los encabezados de segundo nivel usan el numero 2.",
      explanation:
        "La etiqueta <h2> crea un encabezado de segundo nivel, ideal para secciones principales debajo del h1.",
    },
    {
      id: "html-03-ej-04",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt: "Arrastra cada etiqueta a su funcion correcta:",
      dragItems: [
        { id: "d1", content: "<strong>", correctZone: "z1" },
        { id: "d2", content: "<em>", correctZone: "z2" },
        { id: "d3", content: "<mark>", correctZone: "z3" },
        { id: "d4", content: "<small>", correctZone: "z4" },
        { id: "d5", content: "<blockquote>", correctZone: "z5" },
      ],
      dropZones: [
        { id: "z1", label: "Texto de gran importancia" },
        { id: "z2", label: "Texto con enfasis" },
        { id: "z3", label: "Texto resaltado" },
        { id: "z4", label: "Texto de menor importancia" },
        { id: "z5", label: "Cita en bloque" },
      ],
      validation: {
        type: "exact",
        answer: { d1: "z1", d2: "z2", d3: "z3", d4: "z4", d5: "z5" },
      },
      hint: "Recuerda el significado semantico de cada etiqueta.",
      explanation:
        "Cada etiqueta de formato tiene un significado semantico especifico: strong para importancia, em para enfasis, mark para resaltado, small para menor relevancia y blockquote para citas.",
    },
    {
      id: "html-03-ej-05",
      type: "live-editor",
      difficulty: 2,
      xpReward: 25,
      order: 5,
      prompt:
        "Crea una pagina con: un h1 que diga 'Mi Blog', un h2 que diga 'Primer Articulo', un parrafo con texto que incluya una palabra en negrita usando <strong>, y una linea horizontal <hr> seguida de otro parrafo.",
      codeTemplate: {
        html: `<!-- Crea la estructura pedida -->`,
        cssPrefix: "",
        cssSuffix: "",
      },
      validation: {
        type: "includes",
        answer: ["<h1>", "</h1>", "<h2>", "</h2>", "<p>", "<strong>", "</strong>", "<hr>"],
      },
      hint: "Usa h1, h2, p con strong dentro, hr, y otro p.",
      explanation:
        "La combinacion de encabezados, parrafos con formato y lineas horizontales crea una estructura clara y legible.",
    },
    {
      id: "html-03-ej-06",
      type: "code-completion",
      difficulty: 2,
      xpReward: 15,
      order: 6,
      prompt: "Completa el codigo para mostrar una cita en bloque:",
      codeTemplate: {
        html: `<_____>\n  <p>El conocimiento es poder.</p>\n</_____>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: ["blockquote", "blockquote"],
      },
      validation: { type: "exact", answer: ["blockquote", "blockquote"] },
      hint: "Es una etiqueta para citas largas, su nombre combina 'block' y 'quote'.",
      explanation:
        "La etiqueta <blockquote> se usa para citas en bloque, normalmente de fuentes externas.",
    },
    {
      id: "html-03-ej-07",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 7,
      prompt: "Que etiqueta se usa para insertar un salto de linea dentro de un parrafo?",
      options: [
        { id: "a", text: "<break>", isCorrect: false },
        { id: "b", text: "<lb>", isCorrect: false },
        { id: "c", text: "<br>", isCorrect: true },
        { id: "d", text: "<newline>", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Es una abreviatura de 'line break'.",
      explanation:
        "La etiqueta <br> (break) inserta un salto de linea. Es una etiqueta auto-cerrada que no necesita etiqueta de cierre.",
    },
    {
      id: "html-03-ej-08",
      type: "live-editor",
      difficulty: 3,
      xpReward: 30,
      order: 8,
      prompt:
        "Crea un bloque de texto preformateado usando <pre> y <code> que muestre el siguiente codigo HTML como texto: <h1>Hola</h1>. Recuerda usar &lt; y &gt; para las entidades HTML.",
      codeTemplate: {
        html: `<!-- Muestra codigo HTML como texto preformateado -->`,
        cssPrefix: "",
        cssSuffix: "",
      },
      validation: {
        type: "includes",
        answer: ["<pre>", "<code>", "&lt;", "&gt;", "</code>", "</pre>"],
      },
      hint: "Usa <pre><code> y reemplaza < por &lt; y > por &gt;.",
      explanation:
        "Para mostrar etiquetas HTML como texto, se usan las entidades &lt; y &gt; dentro de <pre><code>.",
    },
  ],
};
