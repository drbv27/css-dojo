export interface FlexboxLevel {
  id: number;
  title: string;
  description: string;
  property: string;
  initialCSS: string;
  solutionCSS: string;
  validateFn: string;
  boardConfig: {
    items: { id: string; color: string; label: string }[];
    targets?: { id: string; gridArea: string }[];
    containerStyle?: Record<string, string>;
  };
  xpReward: number;
  hint: string;
}

export const FLEXBOX_LEVELS: FlexboxLevel[] = [
  // ===== JUSTIFY-CONTENT (1-4) =====
  {
    id: 1,
    title: "Centrar elemento",
    description: "Usa justify-content para centrar el elemento en el contenedor.",
    property: "justify-content",
    initialCSS: "",
    solutionCSS: "justify-content: center;",
    validateFn: "justify-content:center",
    boardConfig: {
      items: [{ id: "i1", color: "#5EEAD4", label: "1" }],
    },
    xpReward: 1,
    hint: "justify-content controla la alineacion horizontal. Prueba con 'center'.",
  },
  {
    id: 2,
    title: "Mover al final",
    description: "Mueve el elemento al extremo derecho del contenedor usando justify-content.",
    property: "justify-content",
    initialCSS: "",
    solutionCSS: "justify-content: flex-end;",
    validateFn: "justify-content:flex-end",
    boardConfig: {
      items: [{ id: "i1", color: "#60A5FA", label: "1" }],
    },
    xpReward: 1,
    hint: "flex-end mueve los elementos al final del eje principal.",
  },
  {
    id: 3,
    title: "Espacio entre elementos",
    description: "Distribuye los 3 elementos con espacio igual entre ellos.",
    property: "justify-content",
    initialCSS: "",
    solutionCSS: "justify-content: space-between;",
    validateFn: "justify-content:space-between",
    boardConfig: {
      items: [
        { id: "i1", color: "#86EFAC", label: "1" },
        { id: "i2", color: "#60A5FA", label: "2" },
        { id: "i3", color: "#C084FC", label: "3" },
      ],
    },
    xpReward: 1,
    hint: "space-between pone el maximo espacio posible entre cada elemento.",
  },
  {
    id: 4,
    title: "Espacio alrededor",
    description: "Distribuye los elementos con espacio igual alrededor de cada uno.",
    property: "justify-content",
    initialCSS: "",
    solutionCSS: "justify-content: space-around;",
    validateFn: "justify-content:space-around",
    boardConfig: {
      items: [
        { id: "i1", color: "#FCD34D", label: "1" },
        { id: "i2", color: "#FB7185", label: "2" },
        { id: "i3", color: "#5EEAD4", label: "3" },
      ],
    },
    xpReward: 1,
    hint: "space-around pone espacio igual a cada lado de cada elemento.",
  },

  // ===== ALIGN-ITEMS (5-8) =====
  {
    id: 5,
    title: "Centrar verticalmente",
    description: "Centra el elemento verticalmente dentro del contenedor.",
    property: "align-items",
    initialCSS: "",
    solutionCSS: "align-items: center;",
    validateFn: "align-items:center",
    boardConfig: {
      items: [{ id: "i1", color: "#C084FC", label: "1" }],
      containerStyle: { minHeight: "250px" },
    },
    xpReward: 1,
    hint: "align-items controla la alineacion en el eje cruzado (vertical por defecto).",
  },
  {
    id: 6,
    title: "Elementos al fondo",
    description: "Mueve todos los elementos al fondo del contenedor.",
    property: "align-items",
    initialCSS: "",
    solutionCSS: "align-items: flex-end;",
    validateFn: "align-items:flex-end",
    boardConfig: {
      items: [
        { id: "i1", color: "#60A5FA", label: "1" },
        { id: "i2", color: "#86EFAC", label: "2" },
      ],
      containerStyle: { minHeight: "250px" },
    },
    xpReward: 1,
    hint: "flex-end en align-items mueve los elementos al final del eje cruzado.",
  },
  {
    id: 7,
    title: "Estirar elementos",
    description: "Haz que los elementos se estiren para ocupar toda la altura del contenedor.",
    property: "align-items",
    initialCSS: "",
    solutionCSS: "align-items: stretch;",
    validateFn: "align-items:stretch",
    boardConfig: {
      items: [
        { id: "i1", color: "#FCD34D", label: "1" },
        { id: "i2", color: "#FB7185", label: "2" },
      ],
      containerStyle: { minHeight: "250px" },
    },
    xpReward: 1,
    hint: "stretch hace que los elementos ocupen todo el espacio disponible en el eje cruzado.",
  },
  {
    id: 8,
    title: "Centro perfecto",
    description: "Centra los elementos tanto horizontal como verticalmente. Necesitas dos propiedades.",
    property: "justify-content + align-items",
    initialCSS: "",
    solutionCSS: "justify-content: center;\nalign-items: center;",
    validateFn: "justify-content:center,align-items:center",
    boardConfig: {
      items: [
        { id: "i1", color: "#5EEAD4", label: "1" },
        { id: "i2", color: "#C084FC", label: "2" },
      ],
      containerStyle: { minHeight: "250px" },
    },
    xpReward: 1,
    hint: "Combina justify-content y align-items, ambos con center.",
  },

  // ===== FLEX-DIRECTION (9-12) =====
  {
    id: 9,
    title: "Columna vertical",
    description: "Cambia la direccion del flujo para que los elementos se apilen verticalmente.",
    property: "flex-direction",
    initialCSS: "",
    solutionCSS: "flex-direction: column;",
    validateFn: "flex-direction:column",
    boardConfig: {
      items: [
        { id: "i1", color: "#60A5FA", label: "1" },
        { id: "i2", color: "#86EFAC", label: "2" },
        { id: "i3", color: "#FB7185", label: "3" },
      ],
    },
    xpReward: 1,
    hint: "flex-direction: column cambia el eje principal a vertical.",
  },
  {
    id: 10,
    title: "Columna invertida",
    description: "Apila los elementos verticalmente pero en orden inverso (3, 2, 1).",
    property: "flex-direction",
    initialCSS: "",
    solutionCSS: "flex-direction: column-reverse;",
    validateFn: "flex-direction:column-reverse",
    boardConfig: {
      items: [
        { id: "i1", color: "#86EFAC", label: "1" },
        { id: "i2", color: "#C084FC", label: "2" },
        { id: "i3", color: "#FCD34D", label: "3" },
      ],
    },
    xpReward: 1,
    hint: "column-reverse invierte el orden vertical: el primero va al fondo.",
  },
  {
    id: 11,
    title: "Fila invertida",
    description: "Mantiene los elementos en fila pero invierte su orden.",
    property: "flex-direction",
    initialCSS: "",
    solutionCSS: "flex-direction: row-reverse;",
    validateFn: "flex-direction:row-reverse",
    boardConfig: {
      items: [
        { id: "i1", color: "#FB7185", label: "1" },
        { id: "i2", color: "#5EEAD4", label: "2" },
        { id: "i3", color: "#60A5FA", label: "3" },
      ],
    },
    xpReward: 1,
    hint: "row-reverse pone los elementos de derecha a izquierda.",
  },
  {
    id: 12,
    title: "Columna centrada",
    description: "Apila los elementos en columna y centralos horizontalmente.",
    property: "flex-direction + justify-content",
    initialCSS: "",
    solutionCSS: "flex-direction: column;\nalign-items: center;",
    validateFn: "flex-direction:column,align-items:center",
    boardConfig: {
      items: [
        { id: "i1", color: "#C084FC", label: "1" },
        { id: "i2", color: "#FCD34D", label: "2" },
        { id: "i3", color: "#86EFAC", label: "3" },
      ],
      containerStyle: { minHeight: "250px" },
    },
    xpReward: 1,
    hint: "En columna, el eje cruzado es horizontal. Usa align-items para centrarlo.",
  },

  // ===== FLEX-WRAP & GAP (13-16) =====
  {
    id: 13,
    title: "Envolver elementos",
    description: "Los 6 elementos no caben en una fila. Haz que salten a la siguiente linea.",
    property: "flex-wrap",
    initialCSS: "",
    solutionCSS: "flex-wrap: wrap;",
    validateFn: "flex-wrap:wrap",
    boardConfig: {
      items: [
        { id: "i1", color: "#60A5FA", label: "1" },
        { id: "i2", color: "#86EFAC", label: "2" },
        { id: "i3", color: "#C084FC", label: "3" },
        { id: "i4", color: "#FCD34D", label: "4" },
        { id: "i5", color: "#FB7185", label: "5" },
        { id: "i6", color: "#5EEAD4", label: "6" },
      ],
    },
    xpReward: 1,
    hint: "flex-wrap: wrap permite que los elementos salten a nuevas lineas.",
  },
  {
    id: 14,
    title: "Envolver invertido",
    description: "Envuelve los elementos pero las nuevas filas van hacia arriba.",
    property: "flex-wrap",
    initialCSS: "",
    solutionCSS: "flex-wrap: wrap-reverse;",
    validateFn: "flex-wrap:wrap-reverse",
    boardConfig: {
      items: [
        { id: "i1", color: "#FB7185", label: "1" },
        { id: "i2", color: "#60A5FA", label: "2" },
        { id: "i3", color: "#86EFAC", label: "3" },
        { id: "i4", color: "#C084FC", label: "4" },
      ],
    },
    xpReward: 1,
    hint: "wrap-reverse invierte la direccion del wrapping.",
  },
  {
    id: 15,
    title: "Espacio con gap",
    description: "Agrega un espacio de 20px entre los elementos usando gap.",
    property: "gap",
    initialCSS: "",
    solutionCSS: "gap: 20px;",
    validateFn: "gap:20px",
    boardConfig: {
      items: [
        { id: "i1", color: "#5EEAD4", label: "1" },
        { id: "i2", color: "#C084FC", label: "2" },
        { id: "i3", color: "#FCD34D", label: "3" },
      ],
    },
    xpReward: 1,
    hint: "La propiedad gap agrega espacio entre elementos flex.",
  },
  {
    id: 16,
    title: "Wrap distribuido",
    description: "Envuelve los elementos y distribuye el espacio entre ellos uniformemente.",
    property: "flex-wrap + justify-content",
    initialCSS: "",
    solutionCSS: "flex-wrap: wrap;\njustify-content: space-evenly;",
    validateFn: "flex-wrap:wrap,justify-content:space-evenly",
    boardConfig: {
      items: [
        { id: "i1", color: "#60A5FA", label: "1" },
        { id: "i2", color: "#86EFAC", label: "2" },
        { id: "i3", color: "#FB7185", label: "3" },
        { id: "i4", color: "#FCD34D", label: "4" },
        { id: "i5", color: "#C084FC", label: "5" },
      ],
    },
    xpReward: 1,
    hint: "Combina flex-wrap: wrap con justify-content: space-evenly.",
  },

  // ===== ITEM PROPERTIES (17-20) =====
  {
    id: 17,
    title: "Cambiar orden",
    description: "El elemento rojo (#item-2) debe aparecer primero. Usa la propiedad order en #item-2.",
    property: "order",
    initialCSS: "#item-2 {\n  \n}",
    solutionCSS: "#item-2 {\n  order: -1;\n}",
    validateFn: "order:-1",
    boardConfig: {
      items: [
        { id: "i1", color: "#60A5FA", label: "1" },
        { id: "i2", color: "#FB7185", label: "2" },
        { id: "i3", color: "#86EFAC", label: "3" },
      ],
    },
    xpReward: 1,
    hint: "order con un valor negativo mueve el elemento antes que los demas (order default es 0).",
  },
  {
    id: 18,
    title: "Alineacion individual",
    description: "Alinea solo el elemento morado (#item-2) al fondo del contenedor con align-self.",
    property: "align-self",
    initialCSS: "align-items: flex-start;\n\n#item-2 {\n  \n}",
    solutionCSS: "align-items: flex-start;\n\n#item-2 {\n  align-self: flex-end;\n}",
    validateFn: "align-self:flex-end",
    boardConfig: {
      items: [
        { id: "i1", color: "#60A5FA", label: "1" },
        { id: "i2", color: "#C084FC", label: "2" },
        { id: "i3", color: "#86EFAC", label: "3" },
      ],
      containerStyle: { minHeight: "250px" },
    },
    xpReward: 1,
    hint: "align-self sobreescribe align-items para un solo elemento.",
  },
  {
    id: 19,
    title: "Crecer para llenar",
    description: "Haz que el elemento verde (#item-2) crezca para ocupar todo el espacio disponible.",
    property: "flex-grow",
    initialCSS: "#item-2 {\n  \n}",
    solutionCSS: "#item-2 {\n  flex-grow: 1;\n}",
    validateFn: "flex-grow:1",
    boardConfig: {
      items: [
        { id: "i1", color: "#60A5FA", label: "1" },
        { id: "i2", color: "#86EFAC", label: "2" },
        { id: "i3", color: "#FB7185", label: "3" },
      ],
    },
    xpReward: 1,
    hint: "flex-grow: 1 hace que el elemento crezca para llenar el espacio sobrante.",
  },
  {
    id: 20,
    title: "Proporcion flexible",
    description: "Haz que el primer elemento ocupe el doble de espacio que los otros dos. Usa flex-grow en los tres items.",
    property: "flex-grow",
    initialCSS: "#item-1 {\n  \n}\n#item-2 {\n  \n}\n#item-3 {\n  \n}",
    solutionCSS: "#item-1 {\n  flex-grow: 2;\n}\n#item-2 {\n  flex-grow: 1;\n}\n#item-3 {\n  flex-grow: 1;\n}",
    validateFn: "flex-grow:2",
    boardConfig: {
      items: [
        { id: "i1", color: "#FCD34D", label: "1" },
        { id: "i2", color: "#C084FC", label: "2" },
        { id: "i3", color: "#5EEAD4", label: "3" },
      ],
    },
    xpReward: 1,
    hint: "flex-grow: 2 en #item-1 lo hace crecer al doble que flex-grow: 1.",
  },

  // ===== ADVANCED COMBOS (21-24) =====
  {
    id: 21,
    title: "Layout envolvente",
    description: "Crea un layout en columna con wrap, centrado horizontal y con 10px de gap.",
    property: "direction + wrap + align",
    initialCSS: "",
    solutionCSS: "flex-direction: column;\nflex-wrap: wrap;\nalign-items: center;\ngap: 10px;",
    validateFn: "flex-direction:column,flex-wrap:wrap,align-items:center,gap:10px",
    boardConfig: {
      items: [
        { id: "i1", color: "#60A5FA", label: "1" },
        { id: "i2", color: "#86EFAC", label: "2" },
        { id: "i3", color: "#C084FC", label: "3" },
        { id: "i4", color: "#FB7185", label: "4" },
      ],
      containerStyle: { minHeight: "200px" },
    },
    xpReward: 1,
    hint: "Necesitas 4 propiedades: flex-direction, flex-wrap, align-items y gap.",
  },
  {
    id: 22,
    title: "Cada uno a su lugar",
    description: "El item 1 al inicio, el 2 al centro y el 3 al final verticalmente. Usa align-self en cada uno.",
    property: "align-self",
    initialCSS: "justify-content: space-around;\n\n#item-1 {\n  \n}\n#item-2 {\n  \n}\n#item-3 {\n  \n}",
    solutionCSS: "justify-content: space-around;\n\n#item-1 {\n  align-self: flex-start;\n}\n#item-2 {\n  align-self: center;\n}\n#item-3 {\n  align-self: flex-end;\n}",
    validateFn: "align-self:flex-start",
    boardConfig: {
      items: [
        { id: "i1", color: "#5EEAD4", label: "1" },
        { id: "i2", color: "#FCD34D", label: "2" },
        { id: "i3", color: "#FB7185", label: "3" },
      ],
      containerStyle: { minHeight: "280px" },
    },
    xpReward: 1,
    hint: "align-self: flex-start, center y flex-end para cada elemento.",
  },
  {
    id: 23,
    title: "Centrado absoluto",
    description: "Centra el unico elemento exactamente en el medio del contenedor. Hay varias formas de hacerlo.",
    property: "centrado total",
    initialCSS: "",
    solutionCSS: "justify-content: center;\nalign-items: center;",
    validateFn: "justify-content:center,align-items:center",
    boardConfig: {
      items: [{ id: "i1", color: "#C084FC", label: "!" }],
      containerStyle: { minHeight: "300px" },
    },
    xpReward: 1,
    hint: "La forma clasica: justify-content: center + align-items: center.",
  },
  {
    id: 24,
    title: "Jefe final: Navbar",
    description: "Crea una barra de navegacion: el logo (1) a la izquierda y los 3 enlaces (2,3,4) agrupados a la derecha. Usa justify-content y haz que #item-1 tenga margin-right: auto.",
    property: "layout completo",
    initialCSS: "#item-1 {\n  \n}",
    solutionCSS: "#item-1 {\n  margin-right: auto;\n}",
    validateFn: "margin-right:auto",
    boardConfig: {
      items: [
        { id: "i1", color: "#60A5FA", label: "Logo" },
        { id: "i2", color: "#86EFAC", label: "A" },
        { id: "i3", color: "#C084FC", label: "B" },
        { id: "i4", color: "#FCD34D", label: "C" },
      ],
    },
    xpReward: 1,
    hint: "margin-right: auto en el primer elemento empuja todo lo demas a la derecha.",
  },
];
