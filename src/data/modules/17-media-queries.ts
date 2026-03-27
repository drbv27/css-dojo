import type { ModuleData } from "@/types";

export const mediaQueriesModule: ModuleData = {
  slug: "media-queries",
  title: "Media Queries y Diseno Responsivo",
  description:
    "Aprende a crear sitios web que se adaptan a cualquier dispositivo usando media queries, breakpoints y el enfoque mobile-first.",
  order: 17,
  category: "advanced",
  icon: "Smartphone",
  lessons: [
    {
      id: "17-leccion-01",
      title: "Introduccion a Media Queries",
      content: `## Introduccion a Media Queries

Las **media queries** permiten aplicar estilos CSS solo cuando se cumplen ciertas condiciones, como el ancho de la pantalla, la orientacion del dispositivo o la resolucion.

### Sintaxis basica

\`\`\`css
@media (condicion) {
  /* Estilos que se aplican cuando la condicion es verdadera */
}
\`\`\`

### Ejemplo con ancho de pantalla

\`\`\`css
/* Estilos base para todas las pantallas */
.contenedor {
  padding: 10px;
}

/* Estilos para pantallas de 768px o mas */
@media (min-width: 768px) {
  .contenedor {
    padding: 20px;
    max-width: 720px;
    margin: 0 auto;
  }
}
\`\`\`

### Tipos de media

Puedes especificar el tipo de medio:

\`\`\`css
@media screen and (min-width: 768px) { /* Solo pantallas */ }
@media print { /* Solo al imprimir */ }
@media all and (min-width: 768px) { /* Todos los medios */ }
\`\`\`

### Operadores logicos

| Operador | Descripcion | Ejemplo |
|----------|------------|---------|
| \`and\` | Ambas condiciones deben cumplirse | \`(min-width: 768px) and (max-width: 1024px)\` |
| \`or\` / \`,\` | Al menos una condicion | \`(max-width: 600px), (orientation: portrait)\` |
| \`not\` | Niega la condicion | \`not (min-width: 768px)\` |

### Ejemplo combinado

\`\`\`css
/* Solo pantallas entre 768px y 1024px */
@media screen and (min-width: 768px) and (max-width: 1024px) {
  .sidebar {
    display: none;
  }
}
\`\`\`

> **Importante:** Las media queries no agregan especificidad extra. Los estilos dentro de ellas siguen las reglas normales de cascada.`,
      codeExample: {
        html: `<div class="caja">\n  <h2>Redimensiona la ventana</h2>\n  <p>Esta caja cambia de color segun el ancho de la pantalla.</p>\n</div>`,
        css: `.caja {\n  padding: 20px;\n  background-color: #e74c3c;\n  color: white;\n  border-radius: 8px;\n  text-align: center;\n  transition: background-color 0.3s;\n}\n\n@media (min-width: 500px) {\n  .caja {\n    background-color: #f39c12;\n  }\n}\n\n@media (min-width: 800px) {\n  .caja {\n    background-color: #27ae60;\n  }\n}`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "17-leccion-02",
      title: "Breakpoints y enfoque Mobile-First",
      content: `## Breakpoints y enfoque Mobile-First

### Que son los breakpoints?

Los **breakpoints** son los puntos de ancho donde el diseno cambia para adaptarse mejor al dispositivo. Son los valores que usas en tus media queries.

### Breakpoints comunes

| Nombre | Ancho | Dispositivo tipico |
|--------|-------|-------------------|
| sm | 640px | Moviles grandes |
| md | 768px | Tablets |
| lg | 1024px | Laptops |
| xl | 1280px | Escritorio |
| 2xl | 1536px | Pantallas grandes |

### Enfoque Mobile-First

La estrategia **mobile-first** consiste en escribir los estilos base para moviles y luego agregar complejidad para pantallas mas grandes con \`min-width\`:

\`\`\`css
/* Base: movil (1 columna) */
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

/* Tablet: 2 columnas */
@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Escritorio: 3 columnas */
@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
\`\`\`

### Enfoque Desktop-First (alternativa)

Usa \`max-width\` para empezar desde escritorio y reducir:

\`\`\`css
/* Base: escritorio */
.grid {
  grid-template-columns: repeat(3, 1fr);
}

/* Tablet y menor */
@media (max-width: 1023px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Movil */
@media (max-width: 767px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
\`\`\`

### Por que preferir Mobile-First?

1. **Rendimiento**: Los moviles cargan solo los estilos basicos
2. **Simplicidad**: Empiezas con lo mas simple y agregas complejidad
3. **Progresivo**: Es mas facil agregar que quitar
4. **Estandar**: Es la convencion de la industria (Tailwind, Bootstrap)

> **Buena practica:** Siempre usa mobile-first (\`min-width\`) a menos que tengas una razon especifica para no hacerlo. Ordena tus media queries de menor a mayor.`,
      codeExample: {
        html: `<div class="tarjetas">\n  <div class="tarjeta">Tarjeta 1</div>\n  <div class="tarjeta">Tarjeta 2</div>\n  <div class="tarjeta">Tarjeta 3</div>\n  <div class="tarjeta">Tarjeta 4</div>\n</div>`,
        css: `/* Mobile-first: base = 1 columna */\n.tarjetas {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 12px;\n}\n\n.tarjeta {\n  background: #3498db;\n  color: white;\n  padding: 24px;\n  border-radius: 8px;\n  text-align: center;\n  font-weight: bold;\n}\n\n/* Tablet: 2 columnas */\n@media (min-width: 500px) {\n  .tarjetas {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n\n/* Desktop: 4 columnas */\n@media (min-width: 800px) {\n  .tarjetas {\n    grid-template-columns: repeat(4, 1fr);\n  }\n}`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "17-leccion-03",
      title: "Unidades responsivas y patrones comunes",
      content: `## Unidades responsivas y patrones comunes

### Unidades relativas clave

| Unidad | Relativa a | Uso comun |
|--------|-----------|-----------|
| \`%\` | Elemento padre | Anchos flexibles |
| \`vw\` | Ancho del viewport | Tipografia fluida, secciones full-width |
| \`vh\` | Alto del viewport | Secciones de pantalla completa |
| \`rem\` | Font-size del root (html) | Espaciado consistente |
| \`em\` | Font-size del elemento padre | Espaciado relativo al texto |

### Tipografia fluida con clamp()

La funcion \`clamp()\` define un valor con minimo, ideal y maximo:

\`\`\`css
h1 {
  /* Minimo 1.5rem, ideal 4vw, maximo 3rem */
  font-size: clamp(1.5rem, 4vw, 3rem);
}

.contenedor {
  /* Padding que se adapta */
  padding: clamp(1rem, 3vw, 3rem);
}
\`\`\`

### Patron: contenedor responsivo

\`\`\`css
.contenedor {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(1rem, 3vw, 2rem);
}
\`\`\`

### Patron: navegacion responsiva

\`\`\`css
.nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

@media (min-width: 768px) {
  .nav {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
\`\`\`

### Patron: ocultar/mostrar elementos

\`\`\`css
.menu-movil { display: block; }
.menu-escritorio { display: none; }

@media (min-width: 768px) {
  .menu-movil { display: none; }
  .menu-escritorio { display: flex; }
}
\`\`\`

### Patron: imagenes responsivas

\`\`\`css
img {
  max-width: 100%;  /* Nunca excede su contenedor */
  height: auto;     /* Mantiene proporcion */
}
\`\`\`

> **Consejo:** Combina unidades relativas con media queries para crear disenos verdaderamente fluidos que se adaptan a cualquier tamano de pantalla.`,
      codeExample: {
        html: `<div class="contenedor-responsivo">\n  <h1 class="titulo-fluido">Titulo Responsivo</h1>\n  <p class="texto">Este contenedor usa clamp() para el padding y la tipografia se adapta fluidamente al tamano de la pantalla.</p>\n  <div class="acciones">\n    <button class="btn">Accion 1</button>\n    <button class="btn">Accion 2</button>\n  </div>\n</div>`,
        css: `.contenedor-responsivo {\n  max-width: 800px;\n  margin: 0 auto;\n  padding: clamp(1rem, 3vw, 2.5rem);\n  background: #f8f9fa;\n  border-radius: 12px;\n}\n\n.titulo-fluido {\n  font-size: clamp(1.25rem, 4vw, 2.5rem);\n  color: #2c3e50;\n  margin-bottom: 1rem;\n}\n\n.texto {\n  font-size: clamp(0.875rem, 2vw, 1.125rem);\n  line-height: 1.6;\n  color: #555;\n}\n\n.acciones {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  margin-top: 1.5rem;\n}\n\n@media (min-width: 500px) {\n  .acciones {\n    flex-direction: row;\n  }\n}\n\n.btn {\n  padding: 10px 24px;\n  background: #3498db;\n  color: white;\n  border: none;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 1rem;\n}`,
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "17-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt:
        "Que regla CSS se usa para aplicar estilos segun el tamano de la pantalla?",
      options: [
        { id: "a", text: "@screen", isCorrect: false },
        { id: "b", text: "@responsive", isCorrect: false },
        { id: "c", text: "@media", isCorrect: true },
        { id: "d", text: "@breakpoint", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Es una regla que empieza con @ y se refiere al 'medio' o dispositivo.",
      explanation:
        "La regla @media permite aplicar estilos condicionalmente segun las caracteristicas del dispositivo, como el ancho de la pantalla, la orientacion o la resolucion.",
    },
    {
      id: "17-ej-02",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 2,
      prompt:
        "Completa la media query para que los estilos se apliquen en pantallas de 768px o mas (enfoque mobile-first):",
      codeTemplate: {
        html: `<div class="contenedor">Contenido</div>`,
        cssPrefix: "@media (",
        cssSuffix: ": 768px) {\n  .contenedor {\n    max-width: 720px;\n  }\n}",
        blanks: ["min-width"],
      },
      validation: { type: "exact", answer: "min-width" },
      hint: "En mobile-first usamos un 'ancho minimo' para aplicar estilos desde cierto punto hacia arriba.",
      explanation:
        "En el enfoque mobile-first se usa 'min-width' para aplicar estilos cuando la pantalla es de al menos X pixeles de ancho. Los estilos se 'activan' a partir de ese punto.",
    },
    {
      id: "17-ej-03",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 3,
      prompt:
        "En un enfoque mobile-first, cual es el orden correcto de las media queries?",
      options: [
        { id: "a", text: "De mayor a menor: 1280px, 1024px, 768px", isCorrect: false },
        { id: "b", text: "De menor a mayor: 640px, 768px, 1024px", isCorrect: true },
        { id: "c", text: "No importa el orden", isCorrect: false },
        { id: "d", text: "Solo se usa una media query", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Mobile-first empieza con los estilos base para movil y va agregando para pantallas mas grandes.",
      explanation:
        "En mobile-first, las media queries con min-width deben ir de menor a mayor (640px, 768px, 1024px...) para que cada breakpoint sobreescriba al anterior correctamente.",
    },
    {
      id: "17-ej-04",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt:
        "Arrastra cada breakpoint comun al tipo de dispositivo que representa:",
      dragItems: [
        { id: "drag-1", content: "640px", correctZone: "zone-movil" },
        { id: "drag-2", content: "768px", correctZone: "zone-tablet" },
        { id: "drag-3", content: "1024px", correctZone: "zone-laptop" },
        { id: "drag-4", content: "1280px", correctZone: "zone-escritorio" },
      ],
      dropZones: [
        { id: "zone-movil", label: "Moviles grandes (sm)" },
        { id: "zone-tablet", label: "Tablets (md)" },
        { id: "zone-laptop", label: "Laptops (lg)" },
        { id: "zone-escritorio", label: "Escritorio (xl)" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-movil",
          "drag-2": "zone-tablet",
          "drag-3": "zone-laptop",
          "drag-4": "zone-escritorio",
        },
      },
      hint: "Los breakpoints van de menor a mayor: 640 para moviles grandes, 768 para tablets, 1024 para laptops y 1280 para escritorio.",
      explanation:
        "Estos son los breakpoints estandar usados por frameworks como Tailwind CSS: sm=640px (moviles grandes), md=768px (tablets), lg=1024px (laptops), xl=1280px (escritorio).",
    },
    {
      id: "17-ej-05",
      type: "live-editor",
      difficulty: 2,
      xpReward: 25,
      order: 5,
      prompt:
        "Escribe una media query mobile-first que cambie el background-color de .caja a #27ae60 cuando la pantalla sea de al menos 600px. Los estilos base de .caja son: padding: 20px; background-color: #e74c3c; color: white;",
      codeTemplate: {
        html: `<div class="caja">Cambia de color en pantallas grandes</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".caja {\n  padding: 20px;\n  background-color: #e74c3c;\n  color: white;\n}\n\n@media (min-width: 600px) {\n  .caja {\n    background-color: #27ae60;\n  }\n}",
      validation: {
        type: "includes",
        answer: [
          "@media",
          "min-width",
          "600px",
          "background-color",
          "#27ae60",
        ],
      },
      hint: "Primero escribe los estilos base de .caja, luego una @media con min-width: 600px que cambie el background-color.",
      explanation:
        "Se definen los estilos base (movil) fuera de la media query. Luego con @media (min-width: 600px) se sobreescribe el background-color para pantallas de 600px o mas.",
    },
    {
      id: "17-ej-06",
      type: "code-completion",
      difficulty: 2,
      xpReward: 15,
      order: 6,
      prompt:
        "Completa la funcion CSS para crear un font-size fluido con un minimo de 1rem, un valor ideal de 3vw, y un maximo de 2rem:",
      codeTemplate: {
        html: `<h1 class="titulo">Titulo fluido</h1>`,
        cssPrefix: ".titulo {\n  font-size: ",
        cssSuffix: "(1rem, 3vw, 2rem);\n}",
        blanks: ["clamp"],
      },
      validation: { type: "exact", answer: "clamp" },
      hint: "Es una funcion CSS que recibe tres valores: minimo, preferido y maximo. Su nombre significa 'sujetar'.",
      explanation:
        "La funcion clamp() acepta tres parametros: un minimo, un valor preferido y un maximo. El navegador usa el valor preferido pero nunca baja del minimo ni sube del maximo. Ideal para tipografia responsiva.",
    },
    {
      id: "17-ej-07",
      type: "visual-match",
      difficulty: 3,
      xpReward: 30,
      order: 7,
      prompt:
        "Crea un layout responsivo mobile-first: una cuadricula con clase 'grid-responsivo' que tenga 1 columna por defecto, 2 columnas a partir de 500px y 3 columnas a partir de 800px. Usa gap de 16px y display: grid.",
      codeTemplate: {
        html: `<div class="grid-responsivo">\n  <div class="item">1</div>\n  <div class="item">2</div>\n  <div class="item">3</div>\n  <div class="item">4</div>\n  <div class="item">5</div>\n  <div class="item">6</div>\n</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".grid-responsivo {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 16px;\n}\n.item {\n  background: #8e44ad;\n  color: white;\n  padding: 20px;\n  text-align: center;\n  border-radius: 8px;\n}\n@media (min-width: 500px) {\n  .grid-responsivo {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n@media (min-width: 800px) {\n  .grid-responsivo {\n    grid-template-columns: repeat(3, 1fr);\n  }\n}",
      validation: {
        type: "includes",
        answer: [
          "display: grid",
          "1fr",
          "@media",
          "min-width",
          "500px",
          "800px",
          "repeat",
        ],
      },
      hint: "Empieza con estilos base de 1 columna, luego agrega media queries para 500px (2 columnas) y 800px (3 columnas).",
      explanation:
        "El patron mobile-first define la base con 1 columna (grid-template-columns: 1fr), luego agrega columnas en breakpoints mayores: 2 columnas a 500px y 3 a 800px, usando @media (min-width).",
    },
    {
      id: "17-ej-08",
      type: "quiz",
      difficulty: 3,
      xpReward: 10,
      order: 8,
      prompt:
        "Que hace la declaracion 'font-size: clamp(1rem, 2.5vw, 2rem)'?",
      options: [
        { id: "a", text: "Fija el tamano en 2.5vw siempre", isCorrect: false },
        { id: "b", text: "Alterna entre 1rem y 2rem segun el viewport", isCorrect: false },
        { id: "c", text: "Usa 2.5vw pero nunca baja de 1rem ni sube de 2rem", isCorrect: true },
        { id: "d", text: "Aplica 1rem en movil y 2rem en escritorio", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "clamp() toma tres valores: minimo, preferido y maximo. El navegador usa el del medio respetando los limites.",
      explanation:
        "clamp(1rem, 2.5vw, 2rem) indica: usa 2.5vw como tamano ideal, pero nunca menor a 1rem ni mayor a 2rem. Esto crea una tipografia fluida con limites seguros.",
    },
  ],
};
