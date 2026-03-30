import type { ModuleData } from "@/types";

export const selectoresDescendientesModule: ModuleData = {
  slug: "selectores-descendientes",
  title: "Selectores descendientes y combinadores",
  description:
    "Domina los selectores descendientes, hijos directos (>), hermanos adyacentes (+) y hermanos generales (~) para crear reglas CSS mas precisas.",
  order: 6,
  dojo: "css" as const,
  category: "intermediate",
  icon: "GitBranch",
  lessons: [
    {
      id: "06-leccion-01",
      title: "Selector descendiente",
      content: `## Selector descendiente (espacio)

El **selector descendiente** selecciona elementos que estan **dentro de** otro elemento, sin importar la profundidad de anidamiento. Se escribe separando los selectores con un **espacio**.

### Sintaxis

\`\`\`css
ancestro descendiente {
  propiedad: valor;
}
\`\`\`

### Ejemplos practicos

\`\`\`css
/* Todos los parrafos dentro de un header */
header p {
  font-size: 14px;
}

/* Todos los enlaces dentro de nav */
header nav a {
  margin: 20px;
  text-decoration: none;
}

/* Parrafos dentro de una seccion con ID */
#principal section p {
  line-height: 1.8;
}
\`\`\`

### Profundidad ilimitada

El selector descendiente busca en **todos los niveles** de anidamiento:

\`\`\`html
<div class="contenedor">
  <article>
    <section>
      <p>Este parrafo TAMBIEN es seleccionado por .contenedor p</p>
    </section>
  </article>
</div>
\`\`\`

El selector \`.contenedor p\` seleccionara ese parrafo aunque haya varios niveles de por medio.

### Combinando con clases e IDs

Puedes combinar selectores de tipo, clase e ID:

\`\`\`css
/* Enlaces con clase destacado dentro de h3 */
h3.destacado a {
  color: tomato;
  font-weight: bold;
}
\`\`\`

> **Atencion:** Evita encadenar demasiados selectores descendientes (mas de 3 niveles). Esto hace el CSS dificil de mantener y aumenta la especificidad innecesariamente.`,
      codeExample: {
        html: `<header>\n  <nav>\n    <a href="#">Inicio</a>\n    <a href="#">Servicios</a>\n    <a href="#">Contacto</a>\n  </nav>\n  <p>Bienvenido al sitio</p>\n</header>\n<p>Este parrafo esta FUERA del header.</p>`,
        css: `header nav a {\n  color: white;\n  background-color: steelblue;\n  padding: 8px 16px;\n  text-decoration: none;\n  margin-right: 4px;\n  border-radius: 4px;\n}\n\nheader p {\n  color: gray;\n  font-style: italic;\n}`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "06-leccion-02",
      title: "Selector hijo directo (>)",
      content: `## Selector hijo directo (>)

El **selector hijo directo** selecciona solo los elementos que son **hijos inmediatos** de otro elemento. Se escribe con el simbolo **mayor que (>)**.

### Sintaxis

\`\`\`css
padre > hijo {
  propiedad: valor;
}
\`\`\`

### Diferencia con el descendiente

\`\`\`html
<ul class="menu">
  <li>Item 1</li>      <!-- Seleccionado por .menu > li -->
  <li>Item 2
    <ul>
      <li>Sub-item</li> <!-- NO seleccionado por .menu > li -->
    </ul>
  </li>
</ul>
\`\`\`

\`\`\`css
/* Solo los <li> directos del menu, no los anidados */
.menu > li {
  font-weight: bold;
  border-bottom: 1px solid #ccc;
}

/* Comparacion: esto SI selecciona los anidados */
.menu li {
  color: darkblue;
}
\`\`\`

### Casos de uso comunes

| Selector | Selecciona |
|----------|-----------|
| \`nav > ul\` | Solo los \`<ul>\` hijos directos de \`<nav>\` |
| \`.card > h2\` | Solo los \`<h2>\` directos dentro de \`.card\` |
| \`#menu > li > a\` | Enlaces directos en items directos del menu |

### Cuando usarlo

- Cuando tienes **estructuras anidadas** (menus con submenus, listas con sublistas)
- Para evitar que los estilos **se filtren** a elementos mas profundos
- Para crear selectores mas **predecibles** y controlados

> **Consejo:** El selector hijo directo es mas especifico y predecible que el descendiente. Usalo cuando solo quieras afectar al primer nivel de hijos.`,
      codeExample: {
        html: `<ul class="menu">\n  <li>Inicio</li>\n  <li>Productos\n    <ul>\n      <li>Categoria A</li>\n      <li>Categoria B</li>\n    </ul>\n  </li>\n  <li>Contacto</li>\n</ul>`,
        css: `/* Solo hijos directos del menu */\n.menu > li {\n  font-weight: bold;\n  padding: 8px;\n  background-color: #e8f4fd;\n  border-bottom: 2px solid steelblue;\n}\n\n/* Los sub-items no se ven afectados */\n.menu ul li {\n  font-weight: normal;\n  padding-left: 20px;\n  background-color: #f8f8f8;\n  border-bottom: 1px solid #ddd;\n}`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "06-leccion-03",
      title: "Selectores de hermanos (+ y ~)",
      content: `## Selectores de hermanos

Los selectores de hermanos seleccionan elementos que **comparten el mismo padre** y estan al **mismo nivel** en el HTML.

### Hermano adyacente (+)

Selecciona el elemento que esta **inmediatamente despues** del primero:

\`\`\`css
h2 + p {
  /* Solo el primer parrafo despues de un h2 */
  font-size: 18px;
  color: gray;
}
\`\`\`

\`\`\`html
<h2>Titulo</h2>
<p>Este SI es seleccionado (inmediatamente despues)</p>
<p>Este NO es seleccionado</p>
\`\`\`

### Hermano general (~)

Selecciona **todos los hermanos** que vienen despues del primero:

\`\`\`css
h2 ~ p {
  /* TODOS los parrafos hermanos que vienen despues de h2 */
  margin-left: 20px;
}
\`\`\`

\`\`\`html
<h2>Titulo</h2>
<p>Este SI es seleccionado</p>
<div>Un div intermedio</div>
<p>Este TAMBIEN es seleccionado</p>
\`\`\`

### Comparacion

| Selector | Significado |
|----------|-----------|
| \`A + B\` | El elemento B **inmediatamente despues** de A |
| \`A ~ B\` | **Todos** los elementos B que vienen despues de A |

### Ejemplos practicos

\`\`\`css
/* Separacion visual despues de imagenes */
img + p {
  margin-top: 12px;
  font-style: italic; /* caption de la imagen */
}

/* Todos los inputs despues de un label con error */
.error ~ input {
  border-color: red;
}
\`\`\`

> **Importante:** Los selectores de hermanos solo miran **hacia adelante** en el DOM. No pueden seleccionar elementos que estan ANTES.`,
      codeExample: {
        html: `<h2>Titulo de seccion</h2>\n<p>Primer parrafo (hermano adyacente al h2)</p>\n<p>Segundo parrafo</p>\n<div class="nota">Una nota intermedia</div>\n<p>Tercer parrafo</p>`,
        css: `/* Hermano adyacente: solo el primer p despues de h2 */\nh2 + p {\n  font-size: 18px;\n  color: steelblue;\n  font-weight: bold;\n}\n\n/* Hermano general: todos los p despues de h2 */\nh2 ~ p {\n  padding-left: 16px;\n  border-left: 3px solid #ddd;\n}`,
        editable: true,
      },
      order: 3,
    },
    {
      id: "06-leccion-04",
      title: "Combinando selectores avanzados",
      content: `## Combinando selectores avanzados

En la practica, los selectores se combinan para crear reglas muy precisas. Veamos patrones comunes del mundo real.

### Selector compuesto con descendientes

\`\`\`css
/* Enlaces dentro de parrafos que estan en la seccion principal */
#principal section p a {
  color: tomato;
  text-decoration: underline;
}

/* Elementos con clase dentro de un contenedor */
.sidebar .widget h3 {
  font-size: 16px;
  text-transform: uppercase;
}
\`\`\`

### Mezclando combinadores

\`\`\`css
/* Primer parrafo directo de cada article dentro de main */
main article > p:first-child {
  font-size: 20px;
}

/* Lista directa del nav, luego items directos */
nav > ul > li {
  display: inline-block;
  margin-right: 10px;
}
\`\`\`

### Selector de tipo con clase

\`\`\`css
/* Solo los h3 que tienen la clase destacado */
h3.destacado {
  color: tomato;
  border-bottom: 2px solid tomato;
}

/* Solo los div con clase card */
div.card {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
\`\`\`

### Patrones del mundo real

| Patron | Uso |
|--------|-----|
| \`nav > ul > li > a\` | Enlaces del menu principal |
| \`.form-group > label + input\` | Input justo despues de su label |
| \`table tbody tr\` | Filas del cuerpo de una tabla |
| \`.card > .card-body p\` | Parrafos en el cuerpo de una tarjeta |

> **Regla de oro:** Un buen selector es lo suficientemente especifico para seleccionar lo que necesitas, pero no mas. Selectores demasiado largos son fragiles y dificiles de mantener.`,
      codeExample: {
        html: `<div id="principal">\n  <section>\n    <h3 class="destacado">Titulo destacado</h3>\n    <p>Primer parrafo con un <a href="#">enlace</a>.</p>\n    <p>Segundo parrafo.</p>\n  </section>\n  <section>\n    <h3>Titulo normal</h3>\n    <p>Otro parrafo.</p>\n  </section>\n</div>`,
        css: `/* Selector con ID, descendiente y tipo+clase */\n#principal section h3.destacado {\n  color: tomato;\n  border-bottom: 2px solid tomato;\n  padding-bottom: 4px;\n}\n\n/* Hermano adyacente del h3 */\nh3 + p {\n  font-weight: bold;\n  color: #333;\n}\n\n/* Enlace dentro de la seccion principal */\n#principal section p a {\n  color: steelblue;\n  font-weight: bold;\n}`,
        editable: true,
      },
      order: 4,
    },
  ],
  exercises: [
    {
      id: "06-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt:
        "Que selector CSS aplica estilos a TODOS los parrafos que estan dentro de un <header>, sin importar la profundidad?",
      options: [
        { id: "a", text: "header > p", isCorrect: false },
        { id: "b", text: "header p", isCorrect: true },
        { id: "c", text: "header + p", isCorrect: false },
        { id: "d", text: "header ~ p", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "El selector descendiente usa un espacio simple entre los dos elementos. No utiliza ningun simbolo especial.",
      explanation:
        "El selector 'header p' (con espacio) es el selector descendiente. Selecciona todos los <p> dentro de <header>, sin importar cuantos niveles de profundidad haya. El selector '>' es solo para hijos directos.",
    },
    {
      id: "06-ej-02",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 2,
      prompt:
        "Completa el selector para aplicar estilos solo a los enlaces (<a>) que estan dentro del <nav>:",
      codeTemplate: {
        html: `<nav>\n  <a href="#">Inicio</a>\n  <a href="#">Acerca</a>\n</nav>\n<a href="#">Enlace fuera del nav</a>`,
        cssPrefix: "",
        cssSuffix: " {\n  color: white;\n  background: steelblue;\n  padding: 8px;\n  text-decoration: none;\n}",
        blanks: ["nav a"],
      },
      validation: { type: "exact", answer: "nav a" },
      hint: "Necesitas un selector descendiente: primero el contenedor, luego un espacio, luego el elemento hijo.",
      explanation:
        "El selector 'nav a' selecciona todos los enlaces (<a>) que estan dentro de un <nav>. El espacio entre 'nav' y 'a' indica una relacion de descendencia.",
    },
    {
      id: "06-ej-03",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 3,
      prompt:
        "Arrastra cada selector al tipo de combinador que representa:",
      dragItems: [
        { id: "drag-1", content: "div p", correctZone: "zone-descendiente" },
        { id: "drag-2", content: "div > p", correctZone: "zone-hijo" },
        { id: "drag-3", content: "div + p", correctZone: "zone-adyacente" },
        { id: "drag-4", content: "div ~ p", correctZone: "zone-general" },
      ],
      dropZones: [
        { id: "zone-descendiente", label: "Descendiente (cualquier nivel)" },
        { id: "zone-hijo", label: "Hijo directo" },
        { id: "zone-adyacente", label: "Hermano adyacente" },
        { id: "zone-general", label: "Hermano general" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-descendiente",
          "drag-2": "zone-hijo",
          "drag-3": "zone-adyacente",
          "drag-4": "zone-general",
        },
      },
      hint: "Espacio = descendiente, > = hijo, + = adyacente (uno), ~ = general (todos los que siguen).",
      explanation:
        "Los cuatro combinadores: espacio (descendiente, cualquier profundidad), > (hijo directo, un nivel), + (hermano adyacente, el inmediatamente siguiente), ~ (hermano general, todos los siguientes).",
    },
    {
      id: "06-ej-04",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 4,
      prompt:
        "Una lista .menu tiene dos items directos: A y B. Dentro de B hay otra lista con un item C. El selector .menu > li selecciona:",
      options: [
        { id: "a", text: "Solo A y B", isCorrect: true },
        { id: "b", text: "A, B y C", isCorrect: false },
        { id: "c", text: "Solo C", isCorrect: false },
        { id: "d", text: "Solo A", isCorrect: false },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "El selector > solo selecciona hijos DIRECTOS, no nietos ni niveles mas profundos.",
      explanation:
        "El selector '.menu > li' solo selecciona los <li> que son hijos directos de .menu, es decir A y B. El <li>C</li> es hijo del <ul> interior, no de .menu directamente.",
    },
    {
      id: "06-ej-05",
      type: "code-completion",
      difficulty: 2,
      xpReward: 15,
      order: 5,
      prompt:
        "Completa el selector para aplicar estilos solo al primer parrafo que aparece inmediatamente despues de un <h2>:",
      codeTemplate: {
        html: `<h2>Titulo</h2>\n<p>Primer parrafo</p>\n<p>Segundo parrafo</p>`,
        cssPrefix: "",
        cssSuffix: " {\n  font-size: 18px;\n  color: steelblue;\n}",
        blanks: ["h2 + p"],
      },
      validation: { type: "exact", answer: "h2 + p" },
      hint: "Necesitas el combinador de hermano adyacente. Es un simbolo matematico que usamos para sumar.",
      explanation:
        "El selector 'h2 + p' usa el combinador de hermano adyacente (+). Selecciona solo el <p> que aparece inmediatamente despues de un <h2>, no los demas parrafos.",
    },
    {
      id: "06-ej-06",
      type: "live-editor",
      difficulty: 2,
      xpReward: 25,
      order: 6,
      prompt:
        "Escribe CSS para que los enlaces (<a>) dentro de #principal tengan color tomato y los <li> hijos directos de .menu tengan font-weight: bold.",
      codeTemplate: {
        html: `<div id="principal">\n  <p>Visita nuestro <a href="#">sitio web</a>.</p>\n</div>\n<ul class="menu">\n  <li>Item 1\n    <ul><li>Sub-item</li></ul>\n  </li>\n  <li>Item 2</li>\n</ul>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        "#principal a {\n  color: tomato;\n}\n\n.menu > li {\n  font-weight: bold;\n}",
      validation: {
        type: "includes",
        answer: ["#principal", "a", "color", "tomato", ".menu", ">", "li", "font-weight", "bold"],
      },
      hint: "Necesitas dos reglas: una con selector descendiente (#principal a) y otra con selector hijo directo (.menu > li).",
      explanation:
        "La primera regla '#principal a' usa un selector descendiente para pintar los enlaces dentro de #principal. La segunda '.menu > li' usa el hijo directo para aplicar negrita solo a los <li> del primer nivel.",
    },
    {
      id: "06-ej-07",
      type: "quiz",
      difficulty: 3,
      xpReward: 15,
      order: 7,
      prompt:
        "Cual es la diferencia entre h2 + p y h2 ~ p?",
      options: [
        {
          id: "a",
          text: "h2 + p selecciona solo el primer p despues de h2; h2 ~ p selecciona todos los p hermanos despues de h2",
          isCorrect: true,
        },
        {
          id: "b",
          text: "h2 + p selecciona hijos; h2 ~ p selecciona descendientes",
          isCorrect: false,
        },
        {
          id: "c",
          text: "No hay diferencia, ambos seleccionan lo mismo",
          isCorrect: false,
        },
        {
          id: "d",
          text: "h2 + p selecciona el p antes de h2; h2 ~ p selecciona el p despues",
          isCorrect: false,
        },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "El + es mas restrictivo (adyacente = inmediatamente al lado), mientras que ~ es mas amplio (general = todos los hermanos siguientes).",
      explanation:
        "El combinador + (adyacente) selecciona SOLO el elemento que esta inmediatamente despues. El combinador ~ (general) selecciona TODOS los hermanos del mismo tipo que vienen despues, sin importar si hay otros elementos entre medio.",
    },
    {
      id: "06-ej-08",
      type: "visual-match",
      difficulty: 3,
      xpReward: 30,
      order: 8,
      prompt:
        "Reproduce el diseno: los enlaces directos del nav deben tener color white, background steelblue y padding 8px 16px. El parrafo inmediatamente despues del nav debe tener color gray y font-style italic.",
      codeTemplate: {
        html: `<nav>\n  <a href="#">Inicio</a>\n  <a href="#">Blog</a>\n  <a href="#">Contacto</a>\n</nav>\n<p>Texto introductorio del sitio.</p>\n<p>Mas informacion general.</p>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        "nav > a {\n  color: white;\n  background: steelblue;\n  padding: 8px 16px;\n}\n\nnav + p {\n  color: gray;\n  font-style: italic;\n}",
      validation: {
        type: "includes",
        answer: [
          "nav",
          ">",
          "a",
          "color",
          "white",
          "background",
          "steelblue",
          "padding",
          "+",
          "p",
          "gray",
          "italic",
        ],
      },
      hint: "Usa nav > a para hijos directos del nav y nav + p para el parrafo inmediatamente despues del nav.",
      explanation:
        "Se usan dos combinadores: 'nav > a' selecciona los enlaces que son hijos directos del nav, y 'nav + p' selecciona el parrafo que esta inmediatamente despues del nav (hermano adyacente).",
    },
  ],
};
