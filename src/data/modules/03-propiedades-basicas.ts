import type { ModuleData } from "@/types";

export const propiedadesBasicasModule: ModuleData = {
  slug: "propiedades-basicas",
  title: "Propiedades basicas",
  description:
    "Domina las propiedades fundamentales de CSS: color de texto, fondos y bordes para dar vida a tus elementos.",
  order: 3,
  dojo: "css" as const,
  category: "intro",
  icon: "Palette",
  lessons: [
    {
      id: "03-leccion-01",
      title: "La propiedad color",
      content: `## La propiedad color

La propiedad \`color\` define el **color del texto** de un elemento. Es una de las propiedades mas usadas en CSS.

### Formas de especificar colores

CSS ofrece varias formas de definir colores:

#### 1. Nombres de color
CSS reconoce **140 nombres de colores** estandar:

\`\`\`css
p { color: red; }
h1 { color: steelblue; }
span { color: tomato; }
\`\`\`

#### 2. Hexadecimal
Usa el formato \`#RRGGBB\` donde cada par representa rojo, verde y azul (00-FF):

\`\`\`css
p { color: #FF0000; }   /* Rojo */
h1 { color: #4682B4; }  /* Steel Blue */
span { color: #000000; } /* Negro */
\`\`\`

Tambien existe la forma abreviada de 3 digitos: \`#F00\` es igual a \`#FF0000\`.

#### 3. RGB y RGBA
Usa valores de 0 a 255 para cada canal. RGBA agrega un canal **alfa** (opacidad) de 0 a 1:

\`\`\`css
p { color: rgb(255, 0, 0); }        /* Rojo */
h1 { color: rgba(0, 0, 0, 0.5); }   /* Negro al 50% de opacidad */
\`\`\`

#### 4. HSL y HSLA
Define colores por **tono** (0-360), **saturacion** (0%-100%) y **luminosidad** (0%-100%):

\`\`\`css
p { color: hsl(0, 100%, 50%); }     /* Rojo */
h1 { color: hsla(210, 50%, 50%, 0.8); } /* Azul semi-transparente */
\`\`\`

> **Consejo:** Los nombres de color son perfectos para prototipos rapidos. Para proyectos profesionales, usa hexadecimal o HSL.`,
      codeExample: {
        html: `<h1>Color hexadecimal</h1>\n<p class="nombre">Color por nombre</p>\n<p class="rgb">Color RGB</p>\n<p class="hsl">Color HSL</p>`,
        css: `h1 {\n  color: #4682B4;\n}\n.nombre {\n  color: tomato;\n}\n.rgb {\n  color: rgb(34, 139, 34);\n}\n.hsl {\n  color: hsl(270, 60%, 50%);\n}`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "03-leccion-02",
      title: "Fondos con background",
      content: `## Fondos con background

Las propiedades de fondo te permiten personalizar lo que aparece **detras del contenido** de un elemento.

### background-color

Define un **color de fondo** solido:

\`\`\`css
body {
  background-color: #f5f5f5;
}
.alerta {
  background-color: rgba(255, 0, 0, 0.1);
}
\`\`\`

### background-image

Permite usar una **imagen** o un **degradado** como fondo:

\`\`\`css
.hero {
  background-image: url('fondo.jpg');
  background-size: cover;
  background-position: center;
}
\`\`\`

### Degradados (gradients)

CSS puede crear degradados sin necesidad de imagenes:

\`\`\`css
.degradado {
  background: linear-gradient(to right, #667eea, #764ba2);
}

.radial {
  background: radial-gradient(circle, #fff, #ccc);
}
\`\`\`

### Propiedad abreviada background

Puedes combinar varias propiedades de fondo en una sola linea:

\`\`\`css
.hero {
  background: url('fondo.jpg') center/cover no-repeat;
}
\`\`\`

> **Recuerda:** \`color\` es para el texto, \`background-color\` es para el fondo. No los confundas.`,
      codeExample: {
        html: `<div class="tarjeta">\n  <h2>Tarjeta con fondo</h2>\n  <p>Contenido de ejemplo.</p>\n</div>\n<div class="degradado">\n  <p>Fondo con degradado</p>\n</div>`,
        css: `.tarjeta {\n  background-color: aliceblue;\n  padding: 20px;\n  margin-bottom: 10px;\n}\n\n.degradado {\n  background: linear-gradient(135deg, #667eea, #764ba2);\n  color: white;\n  padding: 20px;\n}`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "03-leccion-03",
      title: "Bordes con border",
      content: `## Bordes con border

La propiedad \`border\` permite agregar un **borde visible** alrededor de cualquier elemento.

### Propiedad abreviada border

La forma mas comun usa tres valores: **ancho**, **estilo** y **color**:

\`\`\`css
.caja {
  border: 2px solid #333;
}
\`\`\`

### Estilos de borde

| Valor | Resultado |
|-------|-----------|
| \`solid\` | Linea solida continua |
| \`dashed\` | Linea de guiones |
| \`dotted\` | Linea de puntos |
| \`double\` | Linea doble |
| \`none\` | Sin borde |

### Bordes individuales

Puedes definir el borde de cada lado por separado:

\`\`\`css
.elemento {
  border-top: 3px solid red;
  border-bottom: 1px dashed gray;
  border-left: 4px solid blue;
  border-right: none;
}
\`\`\`

### border-radius

Redondea las esquinas de un elemento:

\`\`\`css
.boton {
  border-radius: 8px;     /* Esquinas ligeramente redondeadas */
}
.circulo {
  border-radius: 50%;     /* Forma circular (si es cuadrado) */
}
.mixto {
  border-radius: 10px 0 10px 0; /* Solo dos esquinas */
}
\`\`\`

> **Truco:** \`border-radius: 50%\` convierte un elemento cuadrado en un circulo perfecto. Es muy usado para fotos de perfil.`,
      codeExample: {
        html: `<div class="caja-solida">Borde solido</div>\n<div class="caja-guiones">Borde guiones</div>\n<div class="caja-redondeada">Borde redondeado</div>\n<div class="circulo">Circulo</div>`,
        css: `.caja-solida {\n  border: 2px solid steelblue;\n  padding: 12px;\n  margin-bottom: 8px;\n}\n.caja-guiones {\n  border: 2px dashed tomato;\n  padding: 12px;\n  margin-bottom: 8px;\n}\n.caja-redondeada {\n  border: 2px solid green;\n  border-radius: 12px;\n  padding: 12px;\n  margin-bottom: 8px;\n}\n.circulo {\n  border: 3px solid purple;\n  border-radius: 50%;\n  width: 80px;\n  height: 80px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 12px;\n}`,
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "03-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "Que propiedad CSS cambia el color del texto de un elemento?",
      options: [
        { id: "a", text: "color", isCorrect: true },
        { id: "b", text: "text-color", isCorrect: false },
        { id: "c", text: "font-color", isCorrect: false },
        { id: "d", text: "background-color", isCorrect: false },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "Es la propiedad mas sencilla y directa. No tiene ningun prefijo como 'text-' o 'font-'.",
      explanation:
        "La propiedad 'color' cambia el color del texto. 'text-color' y 'font-color' no existen en CSS. 'background-color' cambia el color de fondo, no del texto.",
    },
    {
      id: "03-ej-02",
      type: "code-completion",
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt:
        "Completa la propiedad CSS para cambiar el color del texto del titulo a rojo (#FF0000):",
      codeTemplate: {
        html: `<h1 class="titulo">Mi titulo rojo</h1>`,
        cssPrefix: ".titulo {\n  ",
        cssSuffix: ": #FF0000;\n}",
        blanks: ["color"],
      },
      validation: { type: "exact", answer: "color" },
      hint: "Es una propiedad de una sola palabra que define el color del texto.",
      explanation:
        "La propiedad 'color' se usa para definir el color del texto. La regla completa es: .titulo { color: #FF0000; }",
    },
    {
      id: "03-ej-03",
      type: "live-editor",
      difficulty: 2 ,
      xpReward: 20,
      order: 3,
      prompt:
        "Aplica color de fondo lightblue al body y color de texto darkblue a todos los parrafos.",
      codeTemplate: {
        html: `<body>\n  <h1>Bienvenido</h1>\n  <p>Primer parrafo.</p>\n  <p>Segundo parrafo.</p>\n</body>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        "body {\n  background-color: lightblue;\n}\n\np {\n  color: darkblue;\n}",
      validation: {
        type: "includes",
        answer: [
          "body",
          "background-color",
          "lightblue",
          "p",
          "color",
          "darkblue",
        ],
      },
      hint: "Necesitas dos reglas: una para 'body' con background-color y otra para 'p' con color.",
      explanation:
        "Se usan dos reglas: 'body { background-color: lightblue; }' para el fondo de la pagina y 'p { color: darkblue; }' para el texto de los parrafos.",
    },
    {
      id: "03-ej-04",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt:
        "Arrastra cada formato de color a su categoria correspondiente:",
      dragItems: [
        { id: "drag-1", content: "#FF0000", correctZone: "zone-hex" },
        { id: "drag-2", content: "red", correctZone: "zone-nombre" },
        {
          id: "drag-3",
          content: "rgb(255, 0, 0)",
          correctZone: "zone-rgb",
        },
      ],
      dropZones: [
        { id: "zone-hex", label: "Hexadecimal" },
        { id: "zone-nombre", label: "Nombre de color" },
        { id: "zone-rgb", label: "RGB" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-hex",
          "drag-2": "zone-nombre",
          "drag-3": "zone-rgb",
        },
      },
      hint: "El formato hexadecimal empieza con #, el RGB usa la funcion rgb(), y los nombres son palabras en ingles.",
      explanation:
        "'#FF0000' es formato hexadecimal (prefijo #). 'red' es un nombre de color estandar. 'rgb(255, 0, 0)' usa la funcion RGB con valores de 0 a 255.",
    },
    {
      id: "03-ej-05",
      type: "code-completion",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt:
        "Completa la propiedad border para que la caja tenga un borde solido rojo. El ancho ya esta definido como 2px:",
      codeTemplate: {
        html: `<div class="caja">Contenido de la caja</div>`,
        cssPrefix: ".caja {\n  border: ",
        cssSuffix: " solid red;\n}",
        blanks: ["2px"],
      },
      validation: { type: "exact", answer: "2px" },
      hint: "El primer valor de border es el ancho. Se expresa en pixeles (px).",
      explanation:
        "La propiedad border abreviada sigue el orden: ancho estilo color. La regla completa es: border: 2px solid red;",
    },
    {
      id: "03-ej-06",
      type: "visual-match",
      difficulty: 3 ,
      xpReward: 30,
      order: 6,
      prompt:
        "Reproduce la tarjeta objetivo: fondo azul (steelblue), texto blanco (white), borde de 2px solido gris (gray) y esquinas redondeadas de 10px. Agrega padding de 20px.",
      codeTemplate: {
        html: `<div class="tarjeta">\n  <h2>Mi Tarjeta</h2>\n  <p>Contenido de la tarjeta.</p>\n</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".tarjeta {\n  background-color: steelblue;\n  color: white;\n  border: 2px solid gray;\n  border-radius: 10px;\n  padding: 20px;\n}",
      validation: {
        type: "includes",
        answer: [
          "background-color",
          "steelblue",
          "color",
          "white",
          "border",
          "solid",
          "gray",
          "border-radius",
          "10px",
          "padding",
          "20px",
        ],
      },
      hint: "Necesitas 5 propiedades: background-color, color, border, border-radius y padding.",
      explanation:
        "La tarjeta combina varias propiedades: background-color para el fondo azul, color para el texto blanco, border para el borde gris, border-radius para las esquinas y padding para el espacio interior.",
    },
    {
      id: "03-ej-07",
      type: "live-editor",
      difficulty: 3 ,
      xpReward: 30,
      order: 7,
      prompt:
        "Crea un boton con: fondo verde (green), texto blanco (white), borde redondeado de 8px (border-radius) y padding de 10px arriba/abajo y 20px izquierda/derecha.",
      codeTemplate: {
        html: `<button class="boton">Hacer clic</button>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".boton {\n  background-color: green;\n  color: white;\n  border-radius: 8px;\n  padding: 10px 20px;\n}",
      validation: {
        type: "includes",
        answer: [
          "background-color",
          "green",
          "color",
          "white",
          "border-radius",
          "8px",
          "padding",
          "10px",
          "20px",
        ],
      },
      hint: "Usa padding con dos valores: el primero para arriba/abajo y el segundo para izquierda/derecha.",
      explanation:
        "El boton usa background-color: green para el fondo, color: white para el texto, border-radius: 8px para esquinas redondeadas y padding: 10px 20px para el espacio interior (vertical y horizontal).",
    },
    {
      id: "03-ej-08",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 8,
      prompt: "Cuantos nombres de colores estandar reconoce CSS?",
      options: [
        { id: "a", text: "16", isCorrect: false },
        { id: "b", text: "50", isCorrect: false },
        { id: "c", text: "140", isCorrect: true },
        { id: "d", text: "256", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Son mas de 100 pero menos de 200. Incluyen desde los basicos (red, blue) hasta los exoticos (papayawhip, rebeccapurple).",
      explanation:
        "CSS reconoce aproximadamente 140 nombres de colores estandar. Algunos ejemplos inusuales: 'papayawhip', 'rebeccapurple', 'lemonchiffon' y 'midnightblue'.",
    },
  ],
};
