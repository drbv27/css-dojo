import type { ModuleData } from "@/types";

export const cssGridModule: ModuleData = {
  slug: "css-grid",
  title: "CSS Grid",
  description:
    "Domina el sistema de cuadricula bidimensional mas poderoso de CSS: filas, columnas, areas y disenos responsivos con Grid.",
  order: 16,
  dojo: "css" as const,
  category: "advanced",
  icon: "Grid3X3",
  lessons: [
    {
      id: "16-leccion-01",
      title: "Introduccion a CSS Grid",
      content: `## Introduccion a CSS Grid

CSS Grid es un sistema de **diseno bidimensional** que permite controlar filas y columnas al mismo tiempo. A diferencia de Flexbox (que es unidimensional), Grid trabaja en **dos ejes simultaneamente**.

### Activar Grid

Para crear un contenedor grid, usa \`display: grid\`:

\`\`\`css
.contenedor {
  display: grid;
}
\`\`\`

Todos los hijos directos del contenedor se convierten en **grid items** (elementos de cuadricula).

### Definir columnas y filas

Usa \`grid-template-columns\` y \`grid-template-rows\` para definir la estructura:

\`\`\`css
.contenedor {
  display: grid;
  grid-template-columns: 200px 200px 200px; /* 3 columnas de 200px */
  grid-template-rows: 100px 100px;           /* 2 filas de 100px */
}
\`\`\`

### La unidad fr (fraccion)

La unidad \`fr\` reparte el espacio disponible de forma **proporcional**:

\`\`\`css
.contenedor {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  /* La segunda columna es el doble de ancha que las otras */
}
\`\`\`

Puedes mezclar unidades fijas y flexibles:

\`\`\`css
.layout {
  grid-template-columns: 250px 1fr; /* Sidebar fijo + contenido flexible */
}
\`\`\`

### La funcion repeat()

Para evitar repetir valores, usa \`repeat()\`:

\`\`\`css
.contenedor {
  grid-template-columns: repeat(3, 1fr); /* Equivale a: 1fr 1fr 1fr */
  grid-template-columns: repeat(4, 200px); /* Equivale a: 200px 200px 200px 200px */
}
\`\`\`

> **Consejo:** CSS Grid no reemplaza a Flexbox. Usa Grid para layouts generales de pagina y Flexbox para alinear elementos dentro de componentes.`,
      codeExample: {
        html: `<div class="grid-contenedor">\n  <div class="item">1</div>\n  <div class="item">2</div>\n  <div class="item">3</div>\n  <div class="item">4</div>\n  <div class="item">5</div>\n  <div class="item">6</div>\n</div>`,
        css: `.grid-contenedor {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-rows: 100px 100px;\n  gap: 10px;\n}\n.item {\n  background-color: #4a90d9;\n  color: white;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 1.5rem;\n  font-weight: bold;\n  border-radius: 8px;\n}`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "16-leccion-02",
      title: "Gap, alineacion y posicionamiento",
      content: `## Gap, alineacion y posicionamiento

### Gap: espacio entre celdas

La propiedad \`gap\` define el espacio entre filas y columnas:

\`\`\`css
.contenedor {
  gap: 20px;              /* Mismo espacio en filas y columnas */
  gap: 10px 20px;         /* 10px entre filas, 20px entre columnas */
  row-gap: 10px;          /* Solo entre filas */
  column-gap: 20px;       /* Solo entre columnas */
}
\`\`\`

### Posicionar elementos en la cuadricula

Cada elemento puede ocupar multiples celdas usando \`grid-column\` y \`grid-row\`:

\`\`\`css
.header {
  grid-column: 1 / 4;  /* Desde la linea 1 hasta la 4 (ocupa 3 columnas) */
}
.sidebar {
  grid-row: 2 / 4;     /* Desde la fila 2 hasta la 4 (ocupa 2 filas) */
}
\`\`\`

Tambien puedes usar \`span\` para indicar cuantas celdas ocupa:

\`\`\`css
.header {
  grid-column: span 3;  /* Ocupa 3 columnas desde donde este */
}
.elemento-grande {
  grid-column: span 2;
  grid-row: span 2;     /* Ocupa 2x2 celdas */
}
\`\`\`

### Alineacion del contenido

| Propiedad | Eje | Aplica a |
|-----------|-----|----------|
| \`justify-items\` | Horizontal | Todos los items |
| \`align-items\` | Vertical | Todos los items |
| \`justify-content\` | Horizontal | La cuadricula entera |
| \`align-content\` | Vertical | La cuadricula entera |
| \`justify-self\` | Horizontal | Un item individual |
| \`align-self\` | Vertical | Un item individual |

Los valores comunes son: \`start\`, \`end\`, \`center\`, \`stretch\` (por defecto).

> **Recuerda:** Las lineas de la cuadricula se numeran empezando en 1, no en 0.`,
      codeExample: {
        html: `<div class="layout">\n  <div class="header">Header (3 columnas)</div>\n  <div class="sidebar">Sidebar</div>\n  <div class="main">Contenido principal</div>\n  <div class="footer">Footer (3 columnas)</div>\n</div>`,
        css: `.layout {\n  display: grid;\n  grid-template-columns: 200px 1fr 1fr;\n  grid-template-rows: 60px 200px 50px;\n  gap: 10px;\n}\n.header {\n  grid-column: 1 / 4;\n  background: #2c3e50;\n  color: white;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 6px;\n}\n.sidebar {\n  background: #3498db;\n  color: white;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 6px;\n}\n.main {\n  grid-column: span 2;\n  background: #ecf0f1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 6px;\n}\n.footer {\n  grid-column: 1 / 4;\n  background: #2c3e50;\n  color: white;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 6px;\n}`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "16-leccion-03",
      title: "Grid areas y lineas nombradas",
      content: `## Grid Areas y lineas nombradas

### grid-template-areas

Puedes asignar **nombres a las areas** de la cuadricula para crear layouts de forma visual e intuitiva:

\`\`\`css
.contenedor {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 80px 1fr 60px;
  grid-template-areas:
    "header  header"
    "sidebar main"
    "footer  footer";
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
\`\`\`

Cada cadena entre comillas representa una **fila**. Los nombres repetidos indican que el area ocupa varias celdas. Usa un punto (\`.\`) para celdas vacias:

\`\`\`css
grid-template-areas:
  "header header header"
  "sidebar main ."
  "footer footer footer";
\`\`\`

### Lineas nombradas

Puedes dar nombres a las lineas de la cuadricula entre corchetes:

\`\`\`css
.contenedor {
  grid-template-columns: [inicio] 1fr [centro] 1fr [fin];
  grid-template-rows: [cabecera-inicio] 80px [cabecera-fin contenido-inicio] 1fr [contenido-fin];
}

.elemento {
  grid-column: inicio / centro;
  grid-row: contenido-inicio / contenido-fin;
}
\`\`\`

### Cuando usar areas vs lineas

- **Areas**: Ideal para layouts de pagina completa donde la estructura es clara y descriptiva
- **Lineas con numeros**: Para posicionamiento rapido y preciso
- **Lineas nombradas**: Cuando necesitas referenciar posiciones con nombres significativos

> **Buena practica:** \`grid-template-areas\` es una de las formas mas legibles de definir un layout. Usala siempre que puedas.`,
      codeExample: {
        html: `<div class="pagina">\n  <header class="hd">Encabezado</header>\n  <nav class="nav">Navegacion</nav>\n  <main class="contenido">Contenido principal</main>\n  <aside class="lateral">Lateral</aside>\n  <footer class="pie">Pie de pagina</footer>\n</div>`,
        css: `.pagina {\n  display: grid;\n  grid-template-columns: 180px 1fr 150px;\n  grid-template-rows: 50px 1fr 40px;\n  grid-template-areas:\n    "hd hd hd"\n    "nav contenido lateral"\n    "pie pie pie";\n  gap: 8px;\n  min-height: 300px;\n}\n.hd { grid-area: hd; background: #1abc9c; }\n.nav { grid-area: nav; background: #3498db; }\n.contenido { grid-area: contenido; background: #ecf0f1; }\n.lateral { grid-area: lateral; background: #9b59b6; }\n.pie { grid-area: pie; background: #e74c3c; }\n.pagina > * {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: white;\n  font-weight: bold;\n  border-radius: 6px;\n}\n.contenido { color: #333; }`,
        editable: true,
      },
      order: 3,
    },
    {
      id: "16-leccion-04",
      title: "Grid responsivo: auto-fill, auto-fit y minmax()",
      content: `## Grid responsivo: auto-fill, auto-fit y minmax()

### La funcion minmax()

Define un rango de tamano para columnas o filas:

\`\`\`css
.contenedor {
  grid-template-columns: minmax(200px, 1fr) 2fr;
  /* Primera columna: minimo 200px, maximo 1fr */
}
\`\`\`

### auto-fill y auto-fit

Estas palabras clave dentro de \`repeat()\` crean cuadriculas **responsivas automaticamente**, sin necesidad de media queries:

\`\`\`css
/* auto-fill: crea tantas columnas como quepan */
.contenedor {
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}

/* auto-fit: igual que auto-fill pero colapsa las columnas vacias */
.contenedor {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
\`\`\`

### Diferencia entre auto-fill y auto-fit

- **auto-fill**: Crea columnas incluso si estan vacias. Las columnas vacias ocupan espacio
- **auto-fit**: Colapsa las columnas vacias, permitiendo que las ocupadas se expandan

En la practica, cuando tienes suficientes elementos para llenar todas las columnas, ambos se comportan igual. La diferencia se nota cuando hay **pocos elementos**.

### Grid implicito

Cuando los elementos no caben en la cuadricula definida, se crean filas y columnas **implicitas**:

\`\`\`css
.contenedor {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 150px;  /* Alto de las filas creadas automaticamente */
  grid-auto-flow: dense;   /* Rellena huecos automaticamente */
}
\`\`\`

Valores de \`grid-auto-flow\`:
- \`row\` (por defecto): Nuevos elementos van en filas
- \`column\`: Nuevos elementos van en columnas
- \`dense\`: Intenta rellenar huecos en la cuadricula

> **Patron estrella:** \`repeat(auto-fit, minmax(250px, 1fr))\` es la solucion mas elegante para cuadriculas responsivas. Funciona sin media queries y se adapta a cualquier pantalla.`,
      codeExample: {
        html: `<div class="galeria">\n  <div class="foto">1</div>\n  <div class="foto">2</div>\n  <div class="foto">3</div>\n  <div class="foto">4</div>\n  <div class="foto">5</div>\n  <div class="foto">6</div>\n  <div class="foto">7</div>\n  <div class="foto">8</div>\n</div>`,
        css: `.galeria {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));\n  grid-auto-rows: 100px;\n  gap: 10px;\n}\n.foto {\n  background: linear-gradient(135deg, #667eea, #764ba2);\n  color: white;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 1.5rem;\n  font-weight: bold;\n  border-radius: 8px;\n}`,
        editable: true,
      },
      order: 4,
    },
  ],
  exercises: [
    {
      id: "16-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt:
        "Que propiedad se usa para activar el sistema de cuadricula CSS Grid en un contenedor?",
      options: [
        { id: "a", text: "display: flex", isCorrect: false },
        { id: "b", text: "display: grid", isCorrect: true },
        { id: "c", text: "display: table", isCorrect: false },
        { id: "d", text: "grid-template: on", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Es una propiedad display con un valor especifico para cuadriculas.",
      explanation:
        "Para activar CSS Grid se usa 'display: grid' en el contenedor. Todos sus hijos directos se convierten automaticamente en grid items.",
    },
    {
      id: "16-ej-02",
      type: "code-completion",
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt:
        "Completa la propiedad para crear una cuadricula de 3 columnas iguales usando la unidad fraccion:",
      codeTemplate: {
        html: `<div class="grid">\n  <div>A</div><div>B</div><div>C</div>\n</div>`,
        cssPrefix: ".grid {\n  display: grid;\n  grid-template-columns: ",
        cssSuffix: ";\n}",
        blanks: ["repeat(3, 1fr)"],
      },
      validation: { type: "regex", answer: "repeat\\s*\\(\\s*3\\s*,\\s*1fr\\s*\\)" },
      hint: "Usa la funcion repeat() con 3 repeticiones de 1fr. Tambien podrias escribir '1fr 1fr 1fr'.",
      explanation:
        "La expresion 'repeat(3, 1fr)' crea 3 columnas de igual tamanio. La unidad 'fr' reparte el espacio disponible de forma proporcional. Es equivalente a escribir '1fr 1fr 1fr'.",
    },
    {
      id: "16-ej-03",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 3,
      prompt:
        "Arrastra cada propiedad de Grid a su funcion correcta:",
      dragItems: [
        {
          id: "drag-1",
          content: "grid-template-columns",
          correctZone: "zone-columnas",
        },
        {
          id: "drag-2",
          content: "gap",
          correctZone: "zone-espacio",
        },
        {
          id: "drag-3",
          content: "grid-column: span 2",
          correctZone: "zone-expandir",
        },
        {
          id: "drag-4",
          content: "grid-template-areas",
          correctZone: "zone-areas",
        },
      ],
      dropZones: [
        { id: "zone-columnas", label: "Define el numero y tamano de columnas" },
        { id: "zone-espacio", label: "Espacio entre celdas" },
        { id: "zone-expandir", label: "Hace que un item ocupe 2 columnas" },
        { id: "zone-areas", label: "Nombra las regiones de la cuadricula" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-columnas",
          "drag-2": "zone-espacio",
          "drag-3": "zone-expandir",
          "drag-4": "zone-areas",
        },
      },
      hint: "Piensa en que controla cada propiedad: estructura, espacio, expansion o nombres.",
      explanation:
        "'grid-template-columns' define las columnas. 'gap' controla el espacio entre celdas. 'grid-column: span 2' expande un item a 2 columnas. 'grid-template-areas' permite nombrar regiones visualmente.",
    },
    {
      id: "16-ej-04",
      type: "live-editor",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt:
        "Crea un layout con CSS Grid: un contenedor con clase 'layout' que tenga 3 columnas (200px, 1fr, 1fr), 2 filas de 150px, y un gap de 15px. Agrega display: grid.",
      codeTemplate: {
        html: `<div class="layout">\n  <div class="celda">1</div>\n  <div class="celda">2</div>\n  <div class="celda">3</div>\n  <div class="celda">4</div>\n  <div class="celda">5</div>\n  <div class="celda">6</div>\n</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".layout {\n  display: grid;\n  grid-template-columns: 200px 1fr 1fr;\n  grid-template-rows: 150px 150px;\n  gap: 15px;\n}\n.celda {\n  background: #3498db;\n  color: white;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}",
      validation: {
        type: "includes",
        answer: [
          "display: grid",
          "grid-template-columns",
          "200px",
          "1fr",
          "gap",
          "15px",
        ],
      },
      hint: "Necesitas display: grid, grid-template-columns con 3 valores, grid-template-rows con 2 valores, y gap.",
      explanation:
        "El layout combina display: grid para activar la cuadricula, grid-template-columns: 200px 1fr 1fr para 3 columnas (una fija y dos flexibles), grid-template-rows: 150px 150px para 2 filas, y gap: 15px para el espaciado.",
    },
    {
      id: "16-ej-05",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt:
        "Que hace la declaracion 'grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))'?",
      options: [
        { id: "a", text: "Crea exactamente 4 columnas de 250px", isCorrect: false },
        { id: "b", text: "Crea columnas responsivas que se ajustan automaticamente al espacio disponible", isCorrect: true },
        { id: "c", text: "Crea una sola columna de minimo 250px", isCorrect: false },
        { id: "d", text: "Repite la cuadricula infinitamente", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "auto-fit crea tantas columnas como quepan en el espacio, y minmax define el rango de tamano.",
      explanation:
        "Esta declaracion crea columnas responsivas: auto-fit genera tantas columnas como quepan, cada una con un minimo de 250px y un maximo de 1fr. Se adapta automaticamente sin media queries.",
    },
    {
      id: "16-ej-06",
      type: "code-completion",
      difficulty: 2 ,
      xpReward: 20,
      order: 6,
      prompt:
        "Completa la propiedad para que el elemento .header ocupe desde la columna 1 hasta la columna 4 (las 3 columnas completas):",
      codeTemplate: {
        html: `<div class="grid"><div class="header">Header</div></div>`,
        cssPrefix: ".header {\n  grid-column: ",
        cssSuffix: ";\n}",
        blanks: ["1 / 4"],
      },
      validation: { type: "regex", answer: "1\\s*/\\s*4" },
      hint: "Usa la sintaxis linea-inicio / linea-fin. En una cuadricula de 3 columnas, las lineas van del 1 al 4.",
      explanation:
        "La notacion 'grid-column: 1 / 4' indica que el elemento empieza en la linea 1 y termina en la linea 4. En una cuadricula de 3 columnas, esto hace que ocupe las 3 columnas completas.",
    },
    {
      id: "16-ej-07",
      type: "visual-match",
      difficulty: 3 ,
      xpReward: 30,
      order: 7,
      prompt:
        "Reproduce una galeria responsiva: un contenedor con clase 'galeria' que use Grid con auto-fit, columnas de minimo 150px y maximo 1fr, filas automaticas de 120px, y gap de 12px.",
      codeTemplate: {
        html: `<div class="galeria">\n  <div class="item">1</div>\n  <div class="item">2</div>\n  <div class="item">3</div>\n  <div class="item">4</div>\n  <div class="item">5</div>\n  <div class="item">6</div>\n</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".galeria {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));\n  grid-auto-rows: 120px;\n  gap: 12px;\n}\n.item {\n  background: #8e44ad;\n  color: white;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 8px;\n  font-weight: bold;\n}",
      validation: {
        type: "includes",
        answer: [
          "display: grid",
          "auto-fit",
          "minmax",
          "150px",
          "1fr",
          "gap",
        ],
      },
      hint: "Usa repeat(auto-fit, minmax(150px, 1fr)) para las columnas y grid-auto-rows para las filas automaticas.",
      explanation:
        "La galeria responsiva usa repeat(auto-fit, minmax(150px, 1fr)) para columnas que se adaptan automaticamente, grid-auto-rows: 120px para filas de alto fijo, y gap: 12px para el espaciado entre items.",
    },
    {
      id: "16-ej-08",
      type: "drag-drop",
      difficulty: 3 ,
      xpReward: 30,
      order: 8,
      prompt:
        "Arrastra cada valor a la propiedad grid-template-areas correcta para crear un layout clasico:",
      dragItems: [
        {
          id: "drag-1",
          content: '"header header header"',
          correctZone: "zone-fila1",
        },
        {
          id: "drag-2",
          content: '"sidebar main main"',
          correctZone: "zone-fila2",
        },
        {
          id: "drag-3",
          content: '"footer footer footer"',
          correctZone: "zone-fila3",
        },
      ],
      dropZones: [
        { id: "zone-fila1", label: "Fila 1: Encabezado completo" },
        { id: "zone-fila2", label: "Fila 2: Barra lateral + contenido" },
        { id: "zone-fila3", label: "Fila 3: Pie de pagina completo" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-fila1",
          "drag-2": "zone-fila2",
          "drag-3": "zone-fila3",
        },
      },
      hint: "El header y footer ocupan todas las columnas (nombre repetido). El sidebar ocupa la primera columna y main las demas.",
      explanation:
        "En grid-template-areas, cada string entre comillas es una fila. Repetir un nombre (como 'header header header') indica que esa area ocupa varias columnas. Asi se crea un layout con encabezado completo, sidebar + contenido, y pie completo.",
    },
  ],
};
