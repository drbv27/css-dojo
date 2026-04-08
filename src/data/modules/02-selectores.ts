import type { ModuleData } from "@/types";

export const selectoresModule: ModuleData = {
  slug: "selectores",
  title: "Selectores CSS",
  description:
    "Aprende a seleccionar elementos HTML con selectores de tipo, clase e ID para aplicarles estilos.",
  order: 2,
  dojo: "css" as const,
  category: "intro",
  icon: "MousePointerClick",
  lessons: [
    {
      id: "02-leccion-01",
      title: "Selectores de tipo",
      content: `## Selectores de tipo

El **selector de tipo** (tambien llamado selector de etiqueta) selecciona **todos los elementos** que coincidan con el nombre de una etiqueta HTML.

### Sintaxis

\`\`\`css
nombre-etiqueta {
  propiedad: valor;
}
\`\`\`

### Ejemplos comunes

| Selector | Selecciona |
|----------|-----------|
| \`p\` | Todos los parrafos |
| \`h1\` | Todos los titulos h1 |
| \`div\` | Todos los div |
| \`a\` | Todos los enlaces |
| \`body\` | El elemento body (solo hay uno) |

### Cuando usarlos

Los selectores de tipo son utiles para definir **estilos base** que aplican a todos los elementos de un tipo. Por ejemplo, definir la tipografia base de todos los parrafos.

> **Atencion:** Como seleccionan TODOS los elementos de ese tipo, usarlos en exceso puede causar estilos no deseados. Es mejor combinarlos con selectores mas especificos.`,
      codeExample: {
        html: `<h1>Titulo principal</h1>\n<p>Este es el primer parrafo.</p>\n<p>Este es el segundo parrafo.</p>\n<p>Todos los parrafos tienen el mismo estilo.</p>`,
        css: `p {\n  color: firebrick;\n  font-size: 16px;\n  line-height: 1.6;\n}`,
        editable: false,
      },
      order: 1,
    },
    {
      id: "02-leccion-02",
      title: "Selectores de clase",
      content: `## Selectores de clase

El **selector de clase** selecciona todos los elementos que tengan un atributo \`class\` con el nombre indicado. Se escribe con un **punto (.)** seguido del nombre de la clase.

### Sintaxis

\`\`\`css
.nombre-clase {
  propiedad: valor;
}
\`\`\`

### En el HTML

\`\`\`html
<p class="destacado">Este parrafo esta destacado.</p>
<p>Este parrafo NO esta destacado.</p>
\`\`\`

### Ventajas de las clases

- **Reutilizables:** Puedes aplicar la misma clase a multiples elementos
- **Multiples clases:** Un elemento puede tener varias clases separadas por espacios: \`class="destacado grande"\`
- **Flexibles:** Funcionan con cualquier elemento HTML

### Buenas practicas para nombrar clases

- Usa nombres **descriptivos**: \`.boton-primario\` en vez de \`.bp\`
- Usa **guiones** para separar palabras: \`.tarjeta-producto\`
- Evita nombres que describan el estilo: \`.texto-rojo\` (si luego lo cambias a azul, el nombre pierde sentido)

> **Convencion:** Los selectores de clase son los mas utilizados en CSS profesional. Dominarlos es fundamental.`,
      codeExample: {
        html: `<p>Parrafo normal.</p>\n<p class="destacado">Parrafo destacado.</p>\n<p>Otro parrafo normal.</p>\n<p class="destacado">Otro parrafo destacado.</p>`,
        css: `.destacado {\n  color: white;\n  background-color: tomato;\n  padding: 8px 16px;\n  border-radius: 4px;\n}`,
        editable: false,
      },
      order: 2,
    },
    {
      id: "02-leccion-03",
      title: "Selectores de ID",
      content: `## Selectores de ID

El **selector de ID** selecciona un elemento unico que tenga el atributo \`id\` especificado. Se escribe con un **numeral (#)** seguido del nombre del ID.

### Sintaxis

\`\`\`css
#nombre-id {
  propiedad: valor;
}
\`\`\`

### En el HTML

\`\`\`html
<div id="primario">Contenido unico</div>
\`\`\`

### Regla fundamental

> **Un ID debe ser unico en toda la pagina.** No puede haber dos elementos con el mismo ID. Si necesitas aplicar el mismo estilo a varios elementos, usa una clase en su lugar.

### ID vs Clase

| Caracteristica | ID (\`#\`) | Clase (\`.\`) |
|----------------|-----------|--------------|
| Unicidad | Unico por pagina | Reutilizable |
| Especificidad | Alta (1,0,0) | Media (0,1,0) |
| Uso recomendado | Elementos unicos | Estilos reutilizables |

### Cuando usar ID

- Para el **encabezado principal** de la pagina
- Para **secciones unicas** como el pie de pagina
- Para elementos que necesitan ser **referenciados** por JavaScript o enlaces ancla

> **Consejo profesional:** En CSS moderno, se recomienda usar clases incluso para elementos unicos, ya que tienen menor especificidad y son mas faciles de sobreescribir.`,
      codeExample: {
        html: `<div id="primario">\n  <h2>Seccion principal</h2>\n  <p>Este div tiene un ID unico.</p>\n</div>`,
        css: `#primario {\n  color: blue;\n  padding: 20px;\n  background-color: aliceblue;\n  border-left: 4px solid blue;\n}`,
        editable: false,
      },
      order: 3,
    },
    {
      id: "02-leccion-04",
      title: "Combinando selectores",
      content: `## Combinando selectores

En CSS puedes combinar selectores de distintas formas para crear reglas mas precisas y eficientes.

### Agrupacion con comas

Aplica los **mismos estilos** a multiples selectores separandolos con comas:

\`\`\`css
h1, h2, h3 {
  font-family: Georgia, serif;
  color: darkslateblue;
}
\`\`\`

### Selector multiple (sin espacio)

Selecciona elementos que cumplan **ambas condiciones**:

\`\`\`css
p.destacado {
  /* Solo parrafos con clase "destacado" */
  font-weight: bold;
}
\`\`\`

### Selector descendiente (con espacio)

Selecciona elementos **dentro de** otro elemento:

\`\`\`css
article p {
  /* Solo parrafos dentro de un article */
  line-height: 1.8;
}
\`\`\`

### Selector universal (\`*\`)

Selecciona **todos** los elementos. Util para resets:

\`\`\`css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
\`\`\`

> **Resumen:** Combinar selectores te da un control preciso sobre que elementos reciben estilos. Empieza simple y combina solo cuando sea necesario.`,
      codeExample: {
        html: `<article>\n  <h1>Titulo</h1>\n  <p class="intro">Parrafo introductorio.</p>\n  <p>Parrafo regular.</p>\n</article>\n<p>Parrafo fuera del article.</p>`,
        css: `/* Agrupacion */\nh1, .intro {\n  color: darkslateblue;\n}\n\n/* Descendiente */\narticle p {\n  font-size: 18px;\n  line-height: 1.6;\n}\n\n/* Selector multiple */\np.intro {\n  font-weight: bold;\n  border-left: 3px solid tomato;\n  padding-left: 12px;\n}`,
        editable: false,
      },
      order: 4,
    },
  ],
  exercises: [
    {
      id: "02-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "Cual selector selecciona todos los elementos <h1> de la pagina?",
      options: [
        { id: "a", text: ".h1", isCorrect: false },
        { id: "b", text: "#h1", isCorrect: false },
        { id: "c", text: "h1", isCorrect: true },
        { id: "d", text: "*h1", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Un selector de tipo usa directamente el nombre de la etiqueta, sin ningun simbolo delante.",
      explanation:
        "El selector de tipo 'h1' (sin ningun prefijo) selecciona todos los elementos <h1>. El punto (.) es para clases, el numeral (#) para IDs, y el asterisco (*) es el selector universal.",
    },
    {
      id: "02-ej-02",
      type: "code-completion",
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt:
        "Completa el selector de clase para aplicar color rojo a los elementos con la clase 'destacado':",
      codeTemplate: {
        html: `<p class="destacado">Texto destacado</p>\n<p>Texto normal</p>`,
        cssPrefix: "",
        cssSuffix: " {\n  color: red;\n}",
        blanks: [".destacado"],
      },
      validation: { type: "exact", answer: ".destacado" },
      hint: "Los selectores de clase empiezan con un punto (.) seguido del nombre de la clase.",
      explanation:
        "El selector '.destacado' usa el punto como prefijo para indicar que es un selector de clase. Selecciona todos los elementos que tengan class=\"destacado\".",
    },
    {
      id: "02-ej-03",
      type: "code-completion",
      difficulty: 1 ,
      xpReward: 10,
      order: 3,
      prompt:
        "Completa el selector de ID para aplicar padding al elemento con id 'primario':",
      codeTemplate: {
        html: `<div id="primario">Contenido principal</div>`,
        cssPrefix: "",
        cssSuffix: " {\n  padding: 20px;\n}",
        blanks: ["#primario"],
      },
      validation: { type: "exact", answer: "#primario" },
      hint: "Los selectores de ID empiezan con el simbolo numeral (#) seguido del nombre del ID.",
      explanation:
        "El selector '#primario' usa el numeral (#) como prefijo para indicar que es un selector de ID. Selecciona el elemento unico que tenga id=\"primario\".",
    },
    {
      id: "02-ej-04",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt:
        "Arrastra cada selector a su tipo correspondiente:",
      dragItems: [
        { id: "drag-1", content: "p", correctZone: "zone-tipo" },
        { id: "drag-2", content: ".card", correctZone: "zone-clase" },
        { id: "drag-3", content: "#header", correctZone: "zone-id" },
      ],
      dropZones: [
        { id: "zone-tipo", label: "Selector de tipo" },
        { id: "zone-clase", label: "Selector de clase" },
        { id: "zone-id", label: "Selector de ID" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-tipo",
          "drag-2": "zone-clase",
          "drag-3": "zone-id",
        },
      },
      hint: "El punto (.) es para clases, el numeral (#) es para IDs. Si no tiene prefijo, es un selector de tipo.",
      explanation:
        "'p' es un selector de tipo (sin prefijo, selecciona etiquetas <p>). '.card' es un selector de clase (prefijo punto). '#header' es un selector de ID (prefijo numeral).",
    },
    {
      id: "02-ej-05",
      type: "live-editor",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt:
        "Escribe una regla CSS para que todos los parrafos (<p>) tengan color azul (blue).",
      codeTemplate: {
        html: `<p>Primer parrafo</p>\n<p>Segundo parrafo</p>\n<p>Tercer parrafo</p>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS: "p {\n  color: blue;\n}",
      validation: {
        type: "includes",
        answer: ["p", "color", "blue"],
      },
      hint: "Necesitas un selector de tipo 'p' y la propiedad 'color' con valor 'blue'.",
      explanation:
        "La regla 'p { color: blue; }' usa un selector de tipo para aplicar el color azul a todos los elementos <p>.",
    },
    {
      id: "02-ej-06",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 6,
      prompt: "Que prefijo usa un selector de clase en CSS?",
      options: [
        { id: "a", text: ". (punto)", isCorrect: true },
        { id: "b", text: "# (numeral)", isCorrect: false },
        { id: "c", text: "@ (arroba)", isCorrect: false },
        { id: "d", text: "* (asterisco)", isCorrect: false },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "Piensa en la notacion que usamos en el ejemplo: .destacado { ... }",
      explanation:
        "Los selectores de clase usan el punto (.) como prefijo. Por ejemplo, '.mi-clase' selecciona todos los elementos con class=\"mi-clase\".",
    },
    {
      id: "02-ej-07",
      type: "live-editor",
      difficulty: 3 ,
      xpReward: 30,
      order: 7,
      prompt:
        "Escribe CSS para: 1) Aplicar color verde (green) al elemento con clase 'activo'. 2) Aplicar font-size de 20px al elemento con id 'titulo'.",
      codeTemplate: {
        html: `<h1 id="titulo">Bienvenido</h1>\n<p class="activo">Elemento activo</p>\n<p>Elemento inactivo</p>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".activo {\n  color: green;\n}\n\n#titulo {\n  font-size: 20px;\n}",
      validation: {
        type: "includes",
        answer: [".activo", "color", "green", "#titulo", "font-size", "20px"],
      },
      hint: "Necesitas dos reglas: una con selector de clase (.activo) y otra con selector de ID (#titulo).",
      explanation:
        "Se necesitan dos reglas: '.activo { color: green; }' usa un selector de clase, y '#titulo { font-size: 20px; }' usa un selector de ID.",
    },
    {
      id: "02-ej-08",
      type: "visual-match",
      difficulty: 3 ,
      xpReward: 30,
      order: 8,
      prompt:
        "Observa el resultado objetivo: el <h1> debe ser de color rojo (red) y los parrafos de color azul (blue). Escribe el CSS necesario para lograr ese resultado.",
      codeTemplate: {
        html: `<h1>Titulo Importante</h1>\n<p>Primer parrafo del contenido.</p>\n<p>Segundo parrafo del contenido.</p>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS: "h1 {\n  color: red;\n}\n\np {\n  color: blue;\n}",
      validation: {
        type: "includes",
        answer: ["h1", "color", "red", "p", "blue"],
      },
      hint: "Necesitas dos selectores de tipo: uno para h1 y otro para p, cada uno con su propiedad color.",
      explanation:
        "Se usan dos selectores de tipo: 'h1 { color: red; }' para el titulo en rojo y 'p { color: blue; }' para los parrafos en azul.",
    },
  ],
};
