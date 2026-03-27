import type { ModuleData } from "@/types";

export const flexboxModule: ModuleData = {
  slug: "flexbox",
  title: "Flexbox",
  description:
    "Domina Flexbox, el sistema de layout unidimensional mas utilizado en CSS moderno: flex-direction, justify-content, align-items, flex-wrap, gap y mas.",
  order: 15,
  dojo: "css" as const,
  category: "advanced",
  icon: "Columns",
  lessons: [
    {
      id: "15-leccion-01",
      title: "Introduccion a Flexbox",
      content: `## Introduccion a Flexbox

Flexbox (Flexible Box Layout) es un sistema de layout **unidimensional** que facilita distribuir, alinear y organizar elementos dentro de un contenedor.

### Activar Flexbox

Para usar Flexbox, aplica \`display: flex\` al contenedor padre:

\`\`\`css
.contenedor {
  display: flex;
}
\`\`\`

Esto convierte a todos los **hijos directos** en "flex items" (elementos flex).

### Conceptos fundamentales

- **Flex container**: el elemento padre con \`display: flex\`
- **Flex items**: los hijos directos del contenedor
- **Main axis** (eje principal): la direccion principal de distribucion (por defecto, horizontal)
- **Cross axis** (eje cruzado): perpendicular al eje principal (por defecto, vertical)

### Que cambia al activar Flexbox?

Sin Flexbox, los hijos se apilan verticalmente (como bloques). Con Flexbox:

1. Los hijos se colocan **en fila** (horizontal por defecto)
2. Los hijos se **ajustan al contenido** (no ocupan todo el ancho)
3. Los hijos tienen la **misma altura** (se estiran en el eje cruzado)
4. No hay colapso de margenes entre flex items

### flex-direction

Define la direccion del **eje principal**:

\`\`\`css
.contenedor {
  display: flex;
  flex-direction: row;            /* Horizontal, izq a der (por defecto) */
  flex-direction: row-reverse;    /* Horizontal, der a izq */
  flex-direction: column;         /* Vertical, arriba a abajo */
  flex-direction: column-reverse; /* Vertical, abajo a arriba */
}
\`\`\`

### Diferencia entre display: flex e inline-flex

\`\`\`css
.bloque { display: flex; }        /* El contenedor es un bloque */
.en-linea { display: inline-flex; } /* El contenedor es inline */
\`\`\`

> **Clave:** Flexbox trabaja en **una sola dimension** a la vez: fila O columna. Si necesitas filas Y columnas simultaneamente, considera CSS Grid.`,
      codeExample: {
        html: `<div class="flex-row">\n  <div class="item">1</div>\n  <div class="item">2</div>\n  <div class="item">3</div>\n</div>\n<h4>flex-direction: column</h4>\n<div class="flex-col">\n  <div class="item">A</div>\n  <div class="item">B</div>\n  <div class="item">C</div>\n</div>`,
        css: `.flex-row {\n  display: flex;\n  flex-direction: row;\n  gap: 10px;\n  margin-bottom: 15px;\n}\n.flex-col {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.item {\n  background-color: steelblue;\n  color: white;\n  padding: 15px 25px;\n  border-radius: 6px;\n  font-weight: bold;\n  font-size: 18px;\n  text-align: center;\n}`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "15-leccion-02",
      title: "Alineacion: justify-content y align-items",
      content: `## Alineacion: justify-content y align-items

Flexbox ofrece un control poderoso sobre la alineacion de los elementos, tanto en el eje principal como en el cruzado.

### justify-content (eje principal)

Controla como se distribuyen los items a lo largo del **eje principal**:

\`\`\`css
.contenedor {
  display: flex;
  justify-content: flex-start;     /* Inicio (por defecto) */
  justify-content: flex-end;       /* Final */
  justify-content: center;         /* Centro */
  justify-content: space-between;  /* Espacio entre items (sin espacio en bordes) */
  justify-content: space-around;   /* Espacio alrededor de cada item */
  justify-content: space-evenly;   /* Espacio igual entre todos */
}
\`\`\`

### Diferencia entre space-between, space-around y space-evenly

- **space-between**: primer item al inicio, ultimo al final, espacio igual entre ellos
- **space-around**: cada item tiene el mismo espacio alrededor (los bordes tienen la mitad)
- **space-evenly**: espacio exactamente igual entre todos los items y los bordes

### align-items (eje cruzado)

Controla la alineacion en el **eje cruzado** (perpendicular al principal):

\`\`\`css
.contenedor {
  display: flex;
  align-items: stretch;      /* Se estiran para llenar (por defecto) */
  align-items: flex-start;   /* Alineados al inicio */
  align-items: flex-end;     /* Alineados al final */
  align-items: center;       /* Centrados */
  align-items: baseline;     /* Alineados por la linea base del texto */
}
\`\`\`

### El truco del centrado perfecto

Con solo 3 lineas, puedes centrar un elemento **vertical y horizontalmente**:

\`\`\`css
.centrado-perfecto {
  display: flex;
  justify-content: center;  /* Centra en eje principal */
  align-items: center;      /* Centra en eje cruzado */
}
\`\`\`

Este es uno de los patrones mas usados en CSS moderno.

### align-self (por item individual)

Un item puede sobreescribir el \`align-items\` del contenedor:

\`\`\`css
.item-especial {
  align-self: flex-end;  /* Solo este item se alinea al final */
}
\`\`\`

> **Recuerda:** justify-content trabaja en el eje principal (horizontal en row, vertical en column). align-items trabaja en el eje cruzado.`,
      codeExample: {
        html: `<h4>justify-content: space-between</h4>\n<div class="demo-justify">\n  <div class="item">1</div>\n  <div class="item">2</div>\n  <div class="item">3</div>\n</div>\n<h4>align-items: center (con alturas diferentes)</h4>\n<div class="demo-align">\n  <div class="item alto">Alto</div>\n  <div class="item">Normal</div>\n  <div class="item bajo">Bajo</div>\n</div>`,
        css: `.demo-justify {\n  display: flex;\n  justify-content: space-between;\n  background-color: #f0f0f0;\n  padding: 10px;\n  margin-bottom: 15px;\n  border-radius: 6px;\n}\n.demo-align {\n  display: flex;\n  align-items: center;\n  height: 150px;\n  background-color: #f0f0f0;\n  padding: 10px;\n  gap: 10px;\n  border-radius: 6px;\n}\n.item {\n  background-color: steelblue;\n  color: white;\n  padding: 15px 25px;\n  border-radius: 6px;\n  font-weight: bold;\n}\n.alto { padding: 30px 25px; }\n.bajo { padding: 8px 25px; }`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "15-leccion-03",
      title: "flex-wrap y gap",
      content: `## flex-wrap y gap

### flex-wrap

Por defecto, los flex items intentan caber en **una sola linea**, incluso si eso significa reducir su tamano. Con \`flex-wrap\` puedes permitir que se muevan a la siguiente linea:

\`\`\`css
.contenedor {
  display: flex;
  flex-wrap: nowrap;       /* Todo en una linea (por defecto) */
  flex-wrap: wrap;         /* Se mueven a la siguiente linea si no caben */
  flex-wrap: wrap-reverse; /* Wrap pero las nuevas lineas van arriba */
}
\`\`\`

### Ejemplo practico

\`\`\`css
.galeria {
  display: flex;
  flex-wrap: wrap;
}
.foto {
  width: 200px;  /* Si no caben, bajan a la siguiente fila */
}
\`\`\`

### flex-flow (shorthand)

Combina \`flex-direction\` y \`flex-wrap\` en una sola propiedad:

\`\`\`css
.contenedor {
  flex-flow: row wrap;       /* Direccion: fila, con wrap */
  flex-flow: column nowrap;  /* Direccion: columna, sin wrap */
}
\`\`\`

### gap

La propiedad \`gap\` define el **espacio entre** los flex items. Es mucho mas limpio que usar margenes:

\`\`\`css
.contenedor {
  display: flex;
  gap: 20px;             /* Mismo espacio horizontal y vertical */
  gap: 10px 20px;        /* row-gap: 10px, column-gap: 20px */
  row-gap: 10px;         /* Solo espacio vertical (entre filas) */
  column-gap: 20px;      /* Solo espacio horizontal (entre columnas) */
}
\`\`\`

### Ventajas de gap sobre margin

- No crea espacio extra en los bordes del contenedor
- No necesitas selectores como \`:last-child\` para quitar el margen final
- Es mas facil de mantener y modificar

### align-content (multiples lineas)

Cuando hay wrap y multiples lineas, \`align-content\` controla la distribucion de las **lineas** en el eje cruzado:

\`\`\`css
.contenedor {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;    /* Lineas agrupadas al inicio */
  align-content: center;        /* Lineas centradas */
  align-content: space-between; /* Espacio entre lineas */
}
\`\`\`

> **Diferencia:** \`align-items\` alinea items dentro de su linea. \`align-content\` alinea las lineas dentro del contenedor (solo funciona con wrap y multiples lineas).`,
      codeExample: {
        html: `<div class="galeria">\n  <div class="foto">1</div>\n  <div class="foto">2</div>\n  <div class="foto">3</div>\n  <div class="foto">4</div>\n  <div class="foto">5</div>\n  <div class="foto">6</div>\n  <div class="foto">7</div>\n</div>`,
        css: `.galeria {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 10px;\n  padding: 10px;\n  background-color: #f0f0f0;\n  border-radius: 8px;\n}\n.foto {\n  width: 80px;\n  height: 80px;\n  background-color: steelblue;\n  color: white;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 6px;\n  font-weight: bold;\n  font-size: 20px;\n}`,
        editable: true,
      },
      order: 3,
    },
    {
      id: "15-leccion-04",
      title: "flex-grow, flex-shrink, flex-basis y order",
      content: `## flex-grow, flex-shrink, flex-basis y order

Estas propiedades se aplican a los **flex items** (hijos) para controlar como crecen, se reducen y se ordenan.

### flex-grow

Define cuanto **crece** un item para llenar el espacio disponible:

\`\`\`css
.item { flex-grow: 0; }  /* No crece (por defecto) */
.item { flex-grow: 1; }  /* Crece para llenar espacio disponible */
.item { flex-grow: 2; }  /* Crece el doble que un item con flex-grow: 1 */
\`\`\`

Si hay 3 items y uno tiene \`flex-grow: 2\` mientras los otros tienen \`flex-grow: 1\`, el primero tomara el doble de espacio extra.

### flex-shrink

Define cuanto **se reduce** un item cuando no hay suficiente espacio:

\`\`\`css
.item { flex-shrink: 1; }  /* Se reduce normalmente (por defecto) */
.item { flex-shrink: 0; }  /* Nunca se reduce (mantiene su tamano) */
.item { flex-shrink: 2; }  /* Se reduce el doble que otros */
\`\`\`

### flex-basis

Define el **tamano base** del item antes de aplicar grow/shrink:

\`\`\`css
.item { flex-basis: auto; }   /* Usa el width/height del item (por defecto) */
.item { flex-basis: 200px; }  /* Tamano base de 200px */
.item { flex-basis: 30%; }    /* 30% del contenedor como base */
.item { flex-basis: 0; }      /* Sin tamano base, todo depende de flex-grow */
\`\`\`

### flex (shorthand)

La propiedad \`flex\` combina grow, shrink y basis:

\`\`\`css
.item { flex: 0 1 auto; }   /* Valores por defecto */
.item { flex: 1; }           /* flex-grow: 1, shrink: 1, basis: 0 */
.item { flex: 1 1 200px; }  /* Crece, se reduce, base de 200px */
.item { flex: none; }        /* No crece ni se reduce (0 0 auto) */
\`\`\`

### order

Cambia el **orden visual** de los items sin modificar el HTML:

\`\`\`css
.item { order: 0; }   /* Orden por defecto */
.item-primero { order: -1; }  /* Se muestra primero */
.item-ultimo { order: 99; }   /* Se muestra ultimo */
\`\`\`

Los items se ordenan de menor a mayor valor de \`order\`. Items con el mismo \`order\` mantienen su orden del DOM.

### Patron comun: layout clasico con sidebar

\`\`\`css
.layout { display: flex; }
.sidebar { flex: 0 0 250px; }   /* Ancho fijo de 250px */
.contenido { flex: 1; }          /* Ocupa todo el espacio restante */
\`\`\`

> **Buena practica:** Usa el shorthand \`flex\` en lugar de las propiedades individuales. Los valores mas comunes son \`flex: 1\` (crece para llenar) y \`flex: none\` (tamano fijo).`,
      codeExample: {
        html: `<div class="layout">\n  <aside class="sidebar">Sidebar (flex: 0 0 150px)</aside>\n  <main class="contenido">Contenido principal (flex: 1)</main>\n  <aside class="panel">Panel (flex: 0 0 100px)</aside>\n</div>`,
        css: `.layout {\n  display: flex;\n  gap: 10px;\n  height: 150px;\n}\n.sidebar {\n  flex: 0 0 150px;\n  background-color: #2c3e50;\n  color: white;\n  padding: 15px;\n  border-radius: 6px;\n}\n.contenido {\n  flex: 1;\n  background-color: #ecf0f1;\n  padding: 15px;\n  border-radius: 6px;\n}\n.panel {\n  flex: 0 0 100px;\n  background-color: #3498db;\n  color: white;\n  padding: 15px;\n  border-radius: 6px;\n}`,
        editable: true,
      },
      order: 4,
    },
  ],
  exercises: [
    {
      id: "15-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt:
        "Que propiedad activa Flexbox en un contenedor?",
      options: [
        { id: "a", text: "flex: 1", isCorrect: false },
        { id: "b", text: "display: flex", isCorrect: true },
        { id: "c", text: "flexbox: true", isCorrect: false },
        { id: "d", text: "position: flex", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Se aplica al contenedor padre usando la propiedad display.",
      explanation:
        "display: flex activa Flexbox en el contenedor. Todos los hijos directos del contenedor se convierten en flex items y se distribuyen automaticamente en fila.",
    },
    {
      id: "15-ej-02",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 2,
      prompt:
        "Completa la propiedad para centrar los items horizontalmente en el eje principal:",
      codeTemplate: {
        html: `<div class="contenedor">\n  <div class="item">1</div>\n  <div class="item">2</div>\n</div>`,
        cssPrefix: ".contenedor {\n  display: flex;\n  ",
        cssSuffix: ": center;\n}",
        blanks: ["justify-content"],
      },
      validation: { type: "exact", answer: "justify-content" },
      hint: "Es la propiedad que controla la distribucion de items en el eje principal. Empieza con 'justify'.",
      explanation:
        "justify-content: center centra los items a lo largo del eje principal. En flex-direction: row (por defecto), esto centra horizontalmente. En column, centraria verticalmente.",
    },
    {
      id: "15-ej-03",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 3,
      prompt:
        "Arrastra cada valor de justify-content a su descripcion:",
      dragItems: [
        {
          id: "drag-1",
          content: "flex-start",
          correctZone: "zone-start",
        },
        {
          id: "drag-2",
          content: "center",
          correctZone: "zone-center",
        },
        {
          id: "drag-3",
          content: "space-between",
          correctZone: "zone-between",
        },
        {
          id: "drag-4",
          content: "space-evenly",
          correctZone: "zone-evenly",
        },
      ],
      dropZones: [
        {
          id: "zone-start",
          label: "Items agrupados al inicio del eje",
        },
        {
          id: "zone-center",
          label: "Items centrados en el eje",
        },
        {
          id: "zone-between",
          label: "Primer item al inicio, ultimo al final, espacio igual entre ellos",
        },
        {
          id: "zone-evenly",
          label: "Espacio exactamente igual entre todos los items y los bordes",
        },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-start",
          "drag-2": "zone-center",
          "drag-3": "zone-between",
          "drag-4": "zone-evenly",
        },
      },
      hint: "Space-between no tiene espacio en los bordes. Space-evenly tiene espacio igual en todas partes, incluyendo los bordes.",
      explanation:
        "flex-start agrupa al inicio. center centra todo. space-between deja el primer y ultimo item en los bordes con espacio igual entre ellos. space-evenly distribuye espacio perfectamente igual entre items y bordes.",
    },
    {
      id: "15-ej-04",
      type: "live-editor",
      difficulty: 2,
      xpReward: 25,
      order: 4,
      prompt:
        "Crea un centrado perfecto: el contenedor (clase 'centrado') debe usar display: flex, justify-content: center, align-items: center, height: 200px, y background-color: #f0f0f0. El item (clase 'caja') debe tener padding: 20px, background-color: steelblue, color: white y border-radius: 8px.",
      codeTemplate: {
        html: `<div class="centrado">\n  <div class="caja">Centrado perfecto</div>\n</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".centrado {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 200px;\n  background-color: #f0f0f0;\n}\n.caja {\n  padding: 20px;\n  background-color: steelblue;\n  color: white;\n  border-radius: 8px;\n}",
      validation: {
        type: "includes",
        answer: [
          "display",
          "flex",
          "justify-content",
          "center",
          "align-items",
          "height",
          "200px",
        ],
      },
      hint: "Necesitas display: flex en el contenedor, junto con justify-content: center y align-items: center para centrar en ambos ejes.",
      explanation:
        "El centrado perfecto con Flexbox requiere solo 3 propiedades: display: flex activa Flexbox, justify-content: center centra en el eje principal (horizontal), y align-items: center centra en el eje cruzado (vertical). El contenedor necesita altura definida para que el centrado vertical sea visible.",
    },
    {
      id: "15-ej-05",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 5,
      prompt:
        "Que hace flex-wrap: wrap en un contenedor flex?",
      options: [
        { id: "a", text: "Invierte el orden de los items", isCorrect: false },
        { id: "b", text: "Permite que los items pasen a la siguiente linea si no caben", isCorrect: true },
        { id: "c", text: "Hace que los items se superpongan", isCorrect: false },
        { id: "d", text: "Centra los items automaticamente", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Piensa en que pasa cuando los items son demasiado anchos para caber en una sola linea.",
      explanation:
        "flex-wrap: wrap permite que los items que no caben en una linea bajen a la siguiente, creando multiples filas. Sin wrap (nowrap por defecto), los items se comprimen para caber en una sola linea.",
    },
    {
      id: "15-ej-06",
      type: "code-completion",
      difficulty: 2,
      xpReward: 15,
      order: 6,
      prompt:
        "Completa el shorthand flex para que el sidebar tenga un ancho fijo de 250px sin crecer ni encogerse:",
      codeTemplate: {
        html: `<div class="layout">\n  <aside class="sidebar">Sidebar</aside>\n  <main class="contenido">Main</main>\n</div>`,
        cssPrefix: ".layout { display: flex; gap: 15px; }\n.sidebar {\n  flex: ",
        cssSuffix: ";\n}\n.contenido { flex: 1; }",
        blanks: ["0 0 250px"],
      },
      validation: { type: "exact", answer: "0 0 250px" },
      hint: "El shorthand flex recibe tres valores: grow, shrink y basis. Para un ancho fijo, grow y shrink deben ser 0 y basis el tamano deseado.",
      explanation:
        "flex: 0 0 250px significa: flex-grow: 0 (no crece), flex-shrink: 0 (no se encoge), flex-basis: 250px (tamano base fijo). Esto crea un sidebar de exactamente 250px que no cambia de tamano.",
    },
    {
      id: "15-ej-07",
      type: "visual-match",
      difficulty: 3,
      xpReward: 30,
      order: 7,
      prompt:
        "Crea una barra de navegacion con Flexbox. El contenedor (clase 'nav') debe usar display: flex, justify-content: space-between, align-items: center, padding: 10px 20px, background-color: #2c3e50. El logo (clase 'logo') con color: white, font-size: 20px, font-weight: bold. Los links (clase 'links') con display: flex y gap: 15px. Cada link (clase 'link') con color: #ecf0f1 y text-decoration: none.",
      codeTemplate: {
        html: `<nav class="nav">\n  <div class="logo">MiSitio</div>\n  <div class="links">\n    <a class="link" href="#">Inicio</a>\n    <a class="link" href="#">Sobre</a>\n    <a class="link" href="#">Contacto</a>\n  </div>\n</nav>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".nav {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 10px 20px;\n  background-color: #2c3e50;\n}\n.logo {\n  color: white;\n  font-size: 20px;\n  font-weight: bold;\n}\n.links {\n  display: flex;\n  gap: 15px;\n}\n.link {\n  color: #ecf0f1;\n  text-decoration: none;\n}",
      validation: {
        type: "includes",
        answer: [
          "display",
          "flex",
          "justify-content",
          "space-between",
          "align-items",
          "center",
          "gap",
          "15px",
          "text-decoration",
          "none",
        ],
      },
      hint: "La nav usa Flexbox con space-between para separar el logo y los links. El contenedor de links tambien usa Flexbox con gap para espaciar los enlaces.",
      explanation:
        "Este es un patron muy comun: Flexbox anidado. La barra de navegacion usa justify-content: space-between para poner el logo a la izquierda y los links a la derecha. Los links a su vez usan otro flex container con gap para espaciarse uniformemente.",
    },
    {
      id: "15-ej-08",
      type: "drag-drop",
      difficulty: 3,
      xpReward: 25,
      order: 8,
      prompt:
        "Arrastra cada propiedad flex al elemento donde se aplica (contenedor o item):",
      dragItems: [
        {
          id: "drag-1",
          content: "justify-content",
          correctZone: "zone-contenedor",
        },
        {
          id: "drag-2",
          content: "flex-grow",
          correctZone: "zone-item",
        },
        {
          id: "drag-3",
          content: "flex-wrap",
          correctZone: "zone-contenedor",
        },
        {
          id: "drag-4",
          content: "align-self",
          correctZone: "zone-item",
        },
        {
          id: "drag-5",
          content: "order",
          correctZone: "zone-item",
        },
      ],
      dropZones: [
        { id: "zone-contenedor", label: "Flex container (padre)" },
        { id: "zone-item", label: "Flex item (hijo)" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-contenedor",
          "drag-2": "zone-item",
          "drag-3": "zone-contenedor",
          "drag-4": "zone-item",
          "drag-5": "zone-item",
        },
      },
      hint: "Las propiedades de distribucion y alineacion general van en el contenedor. Las propiedades de tamano individual, auto-alineacion y orden van en los items.",
      explanation:
        "Propiedades del contenedor: justify-content (distribucion en eje principal), flex-wrap (salto de linea), align-items, gap. Propiedades del item: flex-grow (cuanto crece), flex-shrink, flex-basis, align-self (alineacion individual), order (orden visual).",
    },
  ],
};
