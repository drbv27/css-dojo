import type { ModuleData } from "@/types";

export const shadowsGradientsFiltersModule: ModuleData = {
  slug: "shadows-gradients-filters",
  title: "Sombras, Degradados y Filtros",
  description:
    "Domina los efectos visuales de CSS: sombras en cajas y texto, degradados lineales y radiales, y filtros como blur, brightness y grayscale.",
  order: 20,
  category: "advanced",
  icon: "Palette",
  lessons: [
    {
      id: "20-leccion-01",
      title: "Sombras: box-shadow y text-shadow",
      content: `## Sombras: box-shadow y text-shadow

Las sombras agregan profundidad y dimension a los elementos, creando interfaces mas atractivas y con jerarquia visual.

### box-shadow

Agrega sombra a la **caja** del elemento:

\`\`\`css
.tarjeta {
  /* box-shadow: offset-x offset-y blur spread color */
  box-shadow: 4px 4px 10px 0px rgba(0, 0, 0, 0.2);
}
\`\`\`

| Parametro | Descripcion | Ejemplo |
|-----------|------------|---------|
| \`offset-x\` | Desplazamiento horizontal | \`4px\` (derecha), \`-4px\` (izquierda) |
| \`offset-y\` | Desplazamiento vertical | \`4px\` (abajo), \`-4px\` (arriba) |
| \`blur\` | Radio de desenfoque | \`10px\` (mas suave), \`0\` (solida) |
| \`spread\` | Expansion de la sombra | \`2px\` (mas grande), \`-2px\` (mas pequena) |
| \`color\` | Color de la sombra | \`rgba(0,0,0,0.2)\` |

### Sombra interior (inset)

\`\`\`css
.input {
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}
\`\`\`

### Sombras multiples

Separa varias sombras con comas:

\`\`\`css
.boton {
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.1),
    0 8px 16px rgba(0, 0, 0, 0.1);
}
\`\`\`

### text-shadow

Agrega sombra al **texto**:

\`\`\`css
h1 {
  /* text-shadow: offset-x offset-y blur color */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}
\`\`\`

A diferencia de box-shadow, text-shadow **no tiene** spread ni inset.

### Sombras comunes en diseno

\`\`\`css
/* Sombra sutil (tarjetas) */
box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);

/* Sombra media (hover) */
box-shadow: 0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06);

/* Sombra fuerte (modales, dropdowns) */
box-shadow: 0 20px 60px rgba(0,0,0,0.3);

/* Efecto glow (resplandor) */
box-shadow: 0 0 20px rgba(52, 152, 219, 0.5);
\`\`\`

> **Consejo:** Usa siempre colores con transparencia (rgba o hsla) para sombras. Nunca uses negro puro, queda muy artificial.`,
      codeExample: {
        html: `<div class="demo-sombras">\n  <div class="sombra-sutil">Sutil</div>\n  <div class="sombra-media">Media</div>\n  <div class="sombra-fuerte">Fuerte</div>\n  <div class="sombra-glow">Glow</div>\n  <h2 class="texto-sombra">Texto con sombra</h2>\n</div>`,
        css: `.demo-sombras {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 20px;\n  align-items: center;\n}\n\n.demo-sombras > div {\n  padding: 20px 28px;\n  background: white;\n  border-radius: 12px;\n  font-weight: bold;\n  color: #333;\n}\n\n.sombra-sutil {\n  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);\n}\n.sombra-media {\n  box-shadow: 0 4px 12px rgba(0,0,0,0.15);\n}\n.sombra-fuerte {\n  box-shadow: 0 12px 40px rgba(0,0,0,0.25);\n}\n.sombra-glow {\n  box-shadow: 0 0 20px rgba(52, 152, 219, 0.6);\n  color: #3498db;\n}\n.texto-sombra {\n  font-size: 2rem;\n  color: #2c3e50;\n  text-shadow: 2px 2px 6px rgba(0,0,0,0.2);\n}`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "20-leccion-02",
      title: "Degradados: linear-gradient y radial-gradient",
      content: `## Degradados: linear-gradient y radial-gradient

Los degradados crean transiciones suaves entre dos o mas colores, usados como valor de \`background\` o \`background-image\`.

### linear-gradient

Crea un degradado en linea recta:

\`\`\`css
.elemento {
  background: linear-gradient(direccion, color1, color2, ...);
}
\`\`\`

#### Direcciones

\`\`\`css
/* Por angulo */
background: linear-gradient(45deg, #3498db, #8e44ad);

/* Por palabras clave */
background: linear-gradient(to right, #3498db, #8e44ad);
background: linear-gradient(to bottom right, red, blue);
\`\`\`

| Direccion | Descripcion |
|-----------|------------|
| \`to right\` | De izquierda a derecha |
| \`to bottom\` | De arriba a abajo (por defecto) |
| \`to top right\` | Diagonal hacia arriba-derecha |
| \`45deg\` | Angulo de 45 grados |
| \`180deg\` | Igual que \`to bottom\` |

#### Paradas de color (color stops)

Controla donde empieza y termina cada color:

\`\`\`css
background: linear-gradient(to right,
  #3498db 0%,
  #3498db 30%,    /* Azul solido hasta el 30% */
  #8e44ad 70%,    /* Transicion del 30% al 70% */
  #8e44ad 100%    /* Morado solido desde el 70% */
);
\`\`\`

### radial-gradient

Crea un degradado circular o eliptico:

\`\`\`css
.elemento {
  background: radial-gradient(circle, #3498db, #1a1a2e);
  background: radial-gradient(ellipse at top left, #f39c12, transparent);
}
\`\`\`

### Degradados multiples

Puedes superponer degradados:

\`\`\`css
.fondo {
  background:
    linear-gradient(45deg, rgba(52,152,219,0.5), transparent),
    linear-gradient(135deg, rgba(142,68,173,0.5), transparent),
    #1a1a2e;
}
\`\`\`

### Degradados repetitivos

\`\`\`css
.rayas {
  background: repeating-linear-gradient(
    45deg,
    #3498db 0px,
    #3498db 10px,
    #2980b9 10px,
    #2980b9 20px
  );
}
\`\`\`

> **Recuerda:** Los degradados son valores de \`background-image\`, no de \`background-color\`. Por eso usamos la propiedad abreviada \`background\`.`,
      codeExample: {
        html: `<div class="demo-gradientes">\n  <div class="grad-lineal">Linear</div>\n  <div class="grad-angulo">45deg</div>\n  <div class="grad-radial">Radial</div>\n  <div class="grad-multi">Multi</div>\n  <div class="grad-rayas">Rayas</div>\n</div>`,
        css: `.demo-gradientes {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 16px;\n}\n\n.demo-gradientes > div {\n  width: 130px;\n  height: 100px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 12px;\n  color: white;\n  font-weight: bold;\n  font-size: 0.9rem;\n}\n\n.grad-lineal {\n  background: linear-gradient(to right, #3498db, #8e44ad);\n}\n.grad-angulo {\n  background: linear-gradient(45deg, #e74c3c, #f39c12);\n}\n.grad-radial {\n  background: radial-gradient(circle, #1abc9c, #16213e);\n}\n.grad-multi {\n  background:\n    linear-gradient(45deg, rgba(231,76,60,0.7), transparent),\n    linear-gradient(135deg, rgba(52,152,219,0.7), transparent),\n    #2c3e50;\n}\n.grad-rayas {\n  background: repeating-linear-gradient(\n    45deg,\n    #9b59b6 0px, #9b59b6 10px,\n    #8e44ad 10px, #8e44ad 20px\n  );\n}`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "20-leccion-03",
      title: "Filtros CSS: filter y backdrop-filter",
      content: `## Filtros CSS: filter y backdrop-filter

### La propiedad filter

Aplica efectos visuales a un elemento, similares a los filtros de aplicaciones de fotos:

\`\`\`css
.imagen {
  filter: funcion(valor);
}
\`\`\`

### Funciones de filtro disponibles

| Funcion | Descripcion | Rango | Ejemplo |
|---------|------------|-------|---------|
| \`blur()\` | Desenfoque gaussiano | \`0px\` a \`Npx\` | \`blur(5px)\` |
| \`brightness()\` | Brillo | \`0\` (negro) a \`2+\` (brillante) | \`brightness(1.2)\` |
| \`contrast()\` | Contraste | \`0\` (gris) a \`2+\` (alto contraste) | \`contrast(1.5)\` |
| \`grayscale()\` | Escala de grises | \`0\` (color) a \`1\` (gris) | \`grayscale(1)\` |
| \`sepia()\` | Tono sepia | \`0\` a \`1\` | \`sepia(0.8)\` |
| \`saturate()\` | Saturacion | \`0\` (desaturado) a \`2+\` | \`saturate(2)\` |
| \`hue-rotate()\` | Rotacion de tono | \`0deg\` a \`360deg\` | \`hue-rotate(90deg)\` |
| \`invert()\` | Invertir colores | \`0\` a \`1\` | \`invert(1)\` |
| \`drop-shadow()\` | Sombra que sigue la forma | Similar a box-shadow | \`drop-shadow(4px 4px 6px rgba(0,0,0,0.3))\` |

### Filtros multiples

Combina varios filtros separados por espacio:

\`\`\`css
.imagen {
  filter: brightness(1.1) contrast(1.2) saturate(1.3);
}

.avatar-inactivo {
  filter: grayscale(1) opacity(0.6);
}
\`\`\`

### backdrop-filter

Aplica filtros al **fondo detras** del elemento (no al elemento mismo). Ideal para efectos de cristal esmerilado:

\`\`\`css
.barra-navegacion {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
}

.modal-overlay {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
}
\`\`\`

### La propiedad opacity

Controla la transparencia de un elemento completo (incluidos sus hijos):

\`\`\`css
.elemento {
  opacity: 1;     /* Totalmente visible */
  opacity: 0.5;   /* 50% transparente */
  opacity: 0;     /* Invisible (pero sigue en el flujo) */
}
\`\`\`

> **Diferencia importante:** \`opacity\` afecta al elemento Y todos sus hijos. Si solo quieres transparencia en el fondo, usa \`rgba()\` o \`hsla()\` en el background-color.

### Filtros en hover

Los filtros son excelentes para interacciones:

\`\`\`css
.imagen:hover {
  filter: brightness(1.1) saturate(1.2);
  transition: filter 0.3s ease;
}

.tarjeta-deshabilitada {
  filter: grayscale(1) opacity(0.5);
  pointer-events: none;
}
\`\`\`

> **Consejo:** \`backdrop-filter: blur()\` es la base del efecto "glassmorphism" tan popular en interfaces modernas. Combinalo con un fondo semi-transparente.`,
      codeExample: {
        html: `<div class="demo-filtros">\n  <div class="filtro original">Original</div>\n  <div class="filtro f-blur">Blur</div>\n  <div class="filtro f-grayscale">Grayscale</div>\n  <div class="filtro f-sepia">Sepia</div>\n  <div class="filtro f-brightness">Brightness</div>\n  <div class="filtro f-contrast">Contrast</div>\n</div>\n<div class="glass-demo">\n  <div class="glass-card">Efecto Glassmorphism con backdrop-filter</div>\n</div>`,
        css: `.demo-filtros {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 12px;\n  margin-bottom: 20px;\n}\n\n.filtro {\n  width: 110px;\n  height: 80px;\n  background: linear-gradient(135deg, #e74c3c, #3498db, #2ecc71);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 10px;\n  color: white;\n  font-weight: bold;\n  font-size: 0.8rem;\n}\n\n.f-blur { filter: blur(2px); }\n.f-grayscale { filter: grayscale(1); }\n.f-sepia { filter: sepia(1); }\n.f-brightness { filter: brightness(1.5); }\n.f-contrast { filter: contrast(2); }\n\n.glass-demo {\n  background: linear-gradient(135deg, #667eea, #764ba2);\n  padding: 40px;\n  border-radius: 12px;\n}\n\n.glass-card {\n  background: rgba(255, 255, 255, 0.15);\n  backdrop-filter: blur(10px);\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  border-radius: 12px;\n  padding: 24px;\n  color: white;\n  font-weight: bold;\n  text-align: center;\n}`,
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "20-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt:
        "Cual es el orden correcto de los valores en box-shadow?",
      options: [
        { id: "a", text: "color offset-x offset-y blur", isCorrect: false },
        { id: "b", text: "offset-x offset-y blur spread color", isCorrect: true },
        { id: "c", text: "blur spread offset-x offset-y color", isCorrect: false },
        { id: "d", text: "spread blur color offset-x offset-y", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Primero van los desplazamientos (x, y), luego el desenfoque, luego la expansion y finalmente el color.",
      explanation:
        "El orden de box-shadow es: offset-x (desplazamiento horizontal), offset-y (desplazamiento vertical), blur (desenfoque), spread (expansion, opcional) y color. Ejemplo: box-shadow: 4px 4px 10px 0px rgba(0,0,0,0.2).",
    },
    {
      id: "20-ej-02",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 2,
      prompt:
        "Completa la propiedad para agregar una sombra de caja con 4px de desplazamiento horizontal, 4px vertical, 10px de desenfoque y color negro con 20% de opacidad:",
      codeTemplate: {
        html: `<div class="tarjeta">Tarjeta con sombra</div>`,
        cssPrefix: ".tarjeta {\n  padding: 20px;\n  background: white;\n  border-radius: 8px;\n  ",
        cssSuffix: ": 4px 4px 10px rgba(0, 0, 0, 0.2);\n}",
        blanks: ["box-shadow"],
      },
      validation: { type: "exact", answer: "box-shadow" },
      hint: "Es la propiedad que agrega sombra a la 'caja' de un elemento. Son dos palabras unidas con guion.",
      explanation:
        "La propiedad 'box-shadow' agrega sombras a la caja del elemento. Los valores 4px 4px son los desplazamientos, 10px el desenfoque y rgba(0,0,0,0.2) un negro al 20% de opacidad.",
    },
    {
      id: "20-ej-03",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 3,
      prompt:
        "Arrastra cada funcion de filtro CSS a su efecto visual:",
      dragItems: [
        { id: "drag-1", content: "blur(5px)", correctZone: "zone-desenfoque" },
        { id: "drag-2", content: "grayscale(1)", correctZone: "zone-gris" },
        { id: "drag-3", content: "brightness(1.5)", correctZone: "zone-brillo" },
        { id: "drag-4", content: "sepia(1)", correctZone: "zone-sepia" },
      ],
      dropZones: [
        { id: "zone-desenfoque", label: "Desenfoque gaussiano" },
        { id: "zone-gris", label: "Convierte a escala de grises" },
        { id: "zone-brillo", label: "Aumenta el brillo al 150%" },
        { id: "zone-sepia", label: "Aplica tono envejecido amarillento" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-desenfoque",
          "drag-2": "zone-gris",
          "drag-3": "zone-brillo",
          "drag-4": "zone-sepia",
        },
      },
      hint: "blur = desenfoque, grayscale = grises, brightness = brillo, sepia = tono envejecido.",
      explanation:
        "blur() aplica desenfoque. grayscale(1) elimina todo el color. brightness(1.5) aumenta el brillo un 50% sobre el normal. sepia(1) aplica un tono amarillento similar a fotos antiguas.",
    },
    {
      id: "20-ej-04",
      type: "code-completion",
      difficulty: 2,
      xpReward: 15,
      order: 4,
      prompt:
        "Completa el valor para crear un degradado lineal de izquierda a derecha, de #3498db a #8e44ad:",
      codeTemplate: {
        html: `<div class="caja-gradiente">Degradado</div>`,
        cssPrefix: ".caja-gradiente {\n  background: linear-gradient(",
        cssSuffix: ", #3498db, #8e44ad);\n  padding: 30px;\n  color: white;\n  border-radius: 8px;\n}",
        blanks: ["to right"],
      },
      validation: { type: "regex", answer: "to\\s+right" },
      hint: "Necesitas indicar la direccion con las palabras clave 'to' y la direccion en ingles.",
      explanation:
        "La direccion 'to right' indica que el degradado va de izquierda a derecha. Otras opciones son 'to bottom' (por defecto), 'to top', 'to left' o angulos como '90deg' (equivale a 'to right').",
    },
    {
      id: "20-ej-05",
      type: "live-editor",
      difficulty: 2,
      xpReward: 25,
      order: 5,
      prompt:
        "Crea un efecto de glassmorphism: un contenedor .glass-container con fondo de degradado, y dentro un .glass-card con background rgba(255,255,255,0.15), backdrop-filter: blur(10px), border de 1px solid rgba(255,255,255,0.2), padding de 24px y border-radius de 12px.",
      codeTemplate: {
        html: `<div class="glass-container">\n  <div class="glass-card">\n    <h3>Glassmorphism</h3>\n    <p>Efecto de cristal esmerilado</p>\n  </div>\n</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".glass-container {\n  background: linear-gradient(135deg, #667eea, #764ba2);\n  padding: 40px;\n  border-radius: 12px;\n}\n\n.glass-card {\n  background: rgba(255, 255, 255, 0.15);\n  backdrop-filter: blur(10px);\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  padding: 24px;\n  border-radius: 12px;\n  color: white;\n}",
      validation: {
        type: "includes",
        answer: [
          "backdrop-filter",
          "blur",
          "rgba",
          "border-radius",
          "linear-gradient",
        ],
      },
      hint: "El contenedor necesita un fondo con degradado. El card usa backdrop-filter: blur(10px) y un background semi-transparente con rgba.",
      explanation:
        "El efecto glassmorphism se crea con: un contenedor con fondo colorido (degradado), y un card hijo con fondo semi-transparente (rgba con baja opacidad), backdrop-filter: blur() para desenfocar lo que hay detras, y un borde sutil semi-transparente.",
    },
    {
      id: "20-ej-06",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 6,
      prompt:
        "Cual es la diferencia entre 'filter' y 'backdrop-filter'?",
      options: [
        { id: "a", text: "No hay diferencia, son sinonimos", isCorrect: false },
        { id: "b", text: "filter afecta al elemento; backdrop-filter afecta al fondo detras del elemento", isCorrect: true },
        { id: "c", text: "filter es para imagenes; backdrop-filter es para texto", isCorrect: false },
        { id: "d", text: "backdrop-filter no existe en CSS", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "'backdrop' significa 'telon de fondo'. Piensa en que parte del elemento afecta cada propiedad.",
      explanation:
        "'filter' aplica efectos visuales directamente al elemento y su contenido. 'backdrop-filter' aplica efectos al area detras del elemento, visible a traves de fondos semi-transparentes. Esto es la base del efecto glassmorphism.",
    },
    {
      id: "20-ej-07",
      type: "visual-match",
      difficulty: 3,
      xpReward: 30,
      order: 7,
      prompt:
        "Crea una tarjeta con clase 'tarjeta-visual' que tenga: fondo blanco, border-radius de 16px, padding de 24px, una sombra de caja sutil (0 4px 15px rgba(0,0,0,0.1)), y que al hacer hover suba 4px (translateY(-4px)) y tenga sombra mas fuerte (0 12px 30px rgba(0,0,0,0.15)). Agrega transicion de 0.3s.",
      codeTemplate: {
        html: `<div class="tarjeta-visual">\n  <h3>Tarjeta con efectos</h3>\n  <p>Hover para ver la animacion de sombra</p>\n</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".tarjeta-visual {\n  background: white;\n  border-radius: 16px;\n  padding: 24px;\n  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);\n  transition: transform 0.3s ease, box-shadow 0.3s ease;\n}\n\n.tarjeta-visual:hover {\n  transform: translateY(-4px);\n  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);\n}",
      validation: {
        type: "includes",
        answer: [
          "box-shadow",
          "border-radius",
          "16px",
          "transition",
          "transform",
          "translateY",
          ":hover",
        ],
      },
      hint: "Define los estilos base con box-shadow sutil y transition, luego en :hover aumenta la sombra y agrega translateY negativo para que 'suba'.",
      explanation:
        "La tarjeta combina box-shadow para profundidad, transition para suavidad, y en :hover usa translateY(-4px) para elevarla y una sombra mas grande. Este patron es muy usado en interfaces modernas para indicar interactividad.",
    },
    {
      id: "20-ej-08",
      type: "live-editor",
      difficulty: 3,
      xpReward: 25,
      order: 8,
      prompt:
        "Crea un elemento con clase 'imagen-filtro' que tenga un fondo de degradado (simulando una imagen), y al hacer hover aplique los filtros brightness(1.1) y saturate(1.3). Agrega transition: filter 0.3s ease. Tamano: 200px por 150px con border-radius de 12px.",
      codeTemplate: {
        html: `<div class="imagen-filtro"></div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".imagen-filtro {\n  width: 200px;\n  height: 150px;\n  background: linear-gradient(135deg, #e74c3c, #3498db, #2ecc71);\n  border-radius: 12px;\n  transition: filter 0.3s ease;\n}\n\n.imagen-filtro:hover {\n  filter: brightness(1.1) saturate(1.3);\n}",
      validation: {
        type: "includes",
        answer: [
          "filter",
          "brightness",
          "saturate",
          "transition",
          ":hover",
          "linear-gradient",
          "border-radius",
        ],
      },
      hint: "Define el elemento con tamano fijo, fondo de degradado y transition para filter. En :hover aplica los dos filtros separados por espacio.",
      explanation:
        "El elemento usa un degradado como fondo y transition: filter 0.3s para animar suavemente los filtros. Al hover, brightness(1.1) aumenta el brillo 10% y saturate(1.3) intensifica los colores 30%. Los filtros multiples se separan con espacio.",
    },
  ],
};
