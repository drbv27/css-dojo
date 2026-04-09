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
    title: "Centro del tatami",
    description: "Guia al aprendiz al centro de la arena usando justify-content.",
    property: "justify-content",
    initialCSS: "",
    solutionCSS: "justify-content: center;",
    validateFn: "justify-content:center",
    boardConfig: {
      items: [{ id: "i1", color: "#5EEAD4", label: "1" }],
    },
    xpReward: 1,
    hint: "justify-content controla la alineacion horizontal del aprendiz. Prueba con 'center'.",
  },
  {
    id: 2,
    title: "Posicion final",
    description: "Envia al aprendiz al extremo derecho de la arena con justify-content.",
    property: "justify-content",
    initialCSS: "",
    solutionCSS: "justify-content: flex-end;",
    validateFn: "justify-content:flex-end",
    boardConfig: {
      items: [{ id: "i1", color: "#60A5FA", label: "1" }],
    },
    xpReward: 1,
    hint: "flex-end mueve a los aprendices al final del eje principal.",
  },
  {
    id: 3,
    title: "Formacion abierta",
    description: "Distribuye a los 3 aprendices con espacio igual entre ellos usando justify-content.",
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
    hint: "space-between pone el maximo espacio posible entre cada aprendiz.",
  },
  {
    id: 4,
    title: "Kata circular",
    description: "Distribuye a los aprendices con espacio igual alrededor de cada uno usando justify-content.",
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
    hint: "space-around pone espacio igual a cada lado de cada aprendiz.",
  },

  // ===== ALIGN-ITEMS (5-8) =====
  {
    id: 5,
    title: "Equilibrio vertical",
    description: "Alinea al aprendiz en el centro vertical de la arena con align-items.",
    property: "align-items",
    initialCSS: "",
    solutionCSS: "align-items: center;",
    validateFn: "align-items:center",
    boardConfig: {
      items: [{ id: "i1", color: "#C084FC", label: "1" }],
      containerStyle: { minHeight: "250px" },
    },
    xpReward: 1,
    hint: "align-items controla la alineacion vertical del aprendiz en la arena (eje cruzado).",
  },
  {
    id: 6,
    title: "Aprendices al suelo",
    description: "Envia a los aprendices al fondo de la arena con align-items.",
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
    hint: "flex-end en align-items mueve a los aprendices al final del eje cruzado.",
  },
  {
    id: 7,
    title: "Expansion de ki",
    description: "Haz que los aprendices se estiren para ocupar toda la altura de la arena con align-items.",
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
    hint: "stretch hace que los aprendices ocupen todo el espacio disponible en el eje cruzado.",
  },
  {
    id: 8,
    title: "Armonia total",
    description: "Centra a los aprendices horizontal y verticalmente en la arena combinando dos propiedades.",
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
    hint: "Combina justify-content y align-items, ambos con center, para centrar a los aprendices.",
  },

  // ===== FLEX-DIRECTION (9-12) =====
  {
    id: 9,
    title: "Formacion en columna",
    description: "Ordena a los aprendices en columna vertical usando flex-direction.",
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
    hint: "flex-direction: column alinea a los aprendices en el eje vertical.",
  },
  {
    id: 10,
    title: "Columna invertida",
    description: "Apila a los aprendices verticalmente en orden inverso (3, 2, 1) con flex-direction.",
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
    hint: "column-reverse invierte la formacion: el primer aprendiz va al fondo.",
  },
  {
    id: 11,
    title: "Fila de retroceso",
    description: "Mantiene a los aprendices en fila pero invierte su orden con flex-direction.",
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
    hint: "row-reverse pone a los aprendices de derecha a izquierda.",
  },
  {
    id: 12,
    title: "Kata en columna",
    description: "Apila a los aprendices en columna y centralos horizontalmente en la arena.",
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
    hint: "En columna, el eje cruzado es horizontal. Usa align-items para centrar a los aprendices.",
  },

  // ===== FLEX-WRAP & GAP (13-16) =====
  {
    id: 13,
    title: "Salto de linea",
    description: "Los 6 aprendices no caben en una fila; haz que salten a la siguiente con flex-wrap.",
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
    hint: "flex-wrap: wrap permite que los aprendices salten a nuevas lineas.",
  },
  {
    id: 14,
    title: "Salto invertido",
    description: "Envuelve a los aprendices pero las nuevas filas van hacia arriba con flex-wrap.",
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
    title: "Distancia de combate",
    description: "Separa a los aprendices con 20px de distancia entre ellos usando gap.",
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
    hint: "La propiedad gap agrega espacio entre los aprendices en la arena.",
  },
  {
    id: 16,
    title: "Formacion envolvente",
    description: "Envuelve a los aprendices y distribuye el espacio uniformemente con wrap y justify-content.",
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
    title: "Cambiar de rango",
    description: "El aprendiz rojo (#item-2) debe liderar la formacion usando la propiedad order.",
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
    hint: "order con un valor negativo mueve al aprendiz antes que los demas (order default es 0).",
  },
  {
    id: 18,
    title: "Entrenamiento individual",
    description: "Alinea solo al aprendiz morado (#item-2) al fondo de la arena con align-self.",
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
    hint: "align-self sobreescribe align-items para un solo aprendiz.",
  },
  {
    id: 19,
    title: "Expansion del aprendiz",
    description: "Haz que el aprendiz verde (#item-2) crezca para dominar todo el espacio disponible con flex-grow.",
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
    hint: "flex-grow: 1 hace que el aprendiz crezca para llenar el espacio sobrante.",
  },
  {
    id: 20,
    title: "Jerarquia de poder",
    description: "El primer aprendiz debe ocupar el doble de espacio que los otros dos usando flex-grow en los tres.",
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
    title: "Kata avanzada",
    description: "Forma a los aprendices en columna con wrap, centrados y con 10px de gap entre ellos.",
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
    title: "Posiciones de combate",
    description: "Asigna a cada aprendiz su posicion vertical: inicio, centro y final con align-self.",
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
    hint: "align-self: flex-start, center y flex-end para cada aprendiz.",
  },
  {
    id: 23,
    title: "Meditacion central",
    description: "Centra al aprendiz exactamente en el medio de la arena; hay varias formas de lograrlo.",
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
    description: "El maestro (1) se queda a la izquierda y los 3 aprendices (2,3,4) se agrupan a la derecha; usa margin-right: auto en #item-1.",
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
    hint: "margin-right: auto en el primer aprendiz empuja a todos los demas a la derecha.",
  },
];
