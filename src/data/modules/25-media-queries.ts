import type { ModuleData } from "@/types";

export const mediaQueriesModule: ModuleData = {
  slug: "media-queries",
  title: "Media Queries y Diseño Responsivo",
  description:
    "Aprende a crear sitios web que se adaptan a cualquier dispositivo usando media queries, breakpoints y el enfoque mobile-first.",
  order: 30,
  dojo: "css" as const,
  nivel: "obligatorio",
  category: "css-responsive",
  icon: "Smartphone",
  lessons: [
    {
      id: "17-leccion-01",
      title: "Introducción a Media Queries",
      content: `## Introducción a Media Queries

Las **media queries** permiten aplicar estilos CSS solo cuando se cumplen ciertas condiciones, como el ancho de la pantalla, la orientación del dispositivo o la resolución.

### Sintaxis básica

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

### Operadores lógicos

| Operador | Descripción | Ejemplo |
|----------|------------|---------|
| \`and\` | Ambas condiciones deben cumplirse | \`(min-width: 768px) and (max-width: 1024px)\` |
| \`or\` / \`,\` | Al menos una condición | \`(max-width: 600px), (orientation: portrait)\` |
| \`not\` | Niega la condición | \`not (min-width: 768px)\` |

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

### ¿Qué son los breakpoints?

Los **breakpoints** son los puntos de ancho donde el diseño cambia para adaptarse mejor al dispositivo. Son los valores que usas en tus media queries.

### Breakpoints comunes

| Nombre | Ancho | Dispositivo tipico |
|--------|-------|-------------------|
| sm | 640px | Móviles grandes |
| md | 768px | Tablets |
| lg | 1024px | Laptops |
| xl | 1280px | Escritorio |
| 2xl | 1536px | Pantallas grandes |

### Enfoque Mobile-First

La estrategia **mobile-first** consiste en escribir los estilos base para móviles y luego agregar complejidad para pantallas más grandes con \`min-width\`:

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

### ¿Por que preferir Mobile-First?

1. **Rendimiento**: Los móviles cargan solo los estilos básicos
2. **Simplicidad**: Empiezas con lo más simple y agregas complejidad
3. **Progresivo**: Es más fácil agregar que quitar
4. **Estándar**: Es la convención de la industria (Tailwind, Bootstrap)

> **Buena práctica:** Siempre usa mobile-first (\`min-width\`) a menos que tengas una razón específica para no hacerlo. Ordena tus media queries de menor a mayor.`,
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

| Unidad | Relativa a | Uso común |
|--------|-----------|-----------|
| \`%\` | Elemento padre | Anchos flexibles |
| \`vw\` | Ancho del viewport | Tipografía fluida, secciones full-width |
| \`vh\` | Alto del viewport | Secciones de pantalla completa |
| \`rem\` | Font-size del root (html) | Espaciado consistente |
| \`em\` | Font-size del elemento padre | Espaciado relativo al texto |

### Tipografía fluida con clamp()

La función \`clamp()\` define un valor con mínimo, ideal y máximo:

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

### Patrón: contenedor responsivo

\`\`\`css
.contenedor {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(1rem, 3vw, 2rem);
}
\`\`\`

### Patrón: navegación responsiva

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

### Patrón: ocultar/mostrar elementos

\`\`\`css
.menu-movil { display: block; }
.menu-escritorio { display: none; }

@media (min-width: 768px) {
  .menu-movil { display: none; }
  .menu-escritorio { display: flex; }
}
\`\`\`

### Patrón: imágenes responsivas

\`\`\`css
img {
  max-width: 100%;  /* Nunca excede su contenedor */
  height: auto;     /* Mantiene proporcion */
}
\`\`\`

> **Consejo:** Combina unidades relativas con media queries para crear diseños verdaderamente fluidos que se adaptan a cualquier tamaño de pantalla.`,
      codeExample: {
        html: `<div class="contenedor-responsivo">\n  <h1 class="titulo-fluido">Titulo Responsivo</h1>\n  <p class="texto">Este contenedor usa clamp() para el padding y la tipografia se adapta fluidamente al tamano de la pantalla.</p>\n  <div class="acciones">\n    <button class="btn">Accion 1</button>\n    <button class="btn">Accion 2</button>\n  </div>\n</div>`,
        css: `.contenedor-responsivo {\n  max-width: 800px;\n  margin: 0 auto;\n  padding: clamp(1rem, 3vw, 2.5rem);\n  background: #f8f9fa;\n  border-radius: 12px;\n}\n\n.titulo-fluido {\n  font-size: clamp(1.25rem, 4vw, 2.5rem);\n  color: #2c3e50;\n  margin-bottom: 1rem;\n}\n\n.texto {\n  font-size: clamp(0.875rem, 2vw, 1.125rem);\n  line-height: 1.6;\n  color: #555;\n}\n\n.acciones {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  margin-top: 1.5rem;\n}\n\n@media (min-width: 500px) {\n  .acciones {\n    flex-direction: row;\n  }\n}\n\n.btn {\n  padding: 10px 24px;\n  background: #3498db;\n  color: white;\n  border: none;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 1rem;\n}`,
        editable: true,
      },
      order: 3,
    },
    {
      id: "17-leccion-04",
      title: "@container: consultar el espacio real",
      content: `## @container: consultar el espacio real

Las media queries preguntan por **la ventana del navegador**. Eso es lo que te limita, aunque no se note al principio.

### El problema

Escribís una tarjeta que en pantalla ancha se muestra horizontal y en pantalla angosta vertical:

\`\`\`css
.tarjeta { display: block; }

@media (min-width: 800px) {
  .tarjeta { display: flex; }
}
\`\`\`

Funciona. Hasta que ponés esa misma tarjeta dentro de una barra lateral de 250px, **en una pantalla de 1400px**. La media query dice "pantalla ancha, poneme horizontal", la tarjeta se estira a lo ancho de 250px y se rompe.

El problema de fondo: la tarjeta preguntó por el tamaño de la **pantalla**, cuando lo que necesitaba saber era cuánto espacio tiene **ella**.

Y no había forma de preguntar eso. Un componente no podía saber cuánto lugar le dieron.

### La solución

Dos pasos. Primero se declara que un elemento es un **contenedor consultable**:

\`\`\`css
.columna {
  container-type: inline-size;
}
\`\`\`

Y después se pregunta por **ese** contenedor, no por la pantalla:

\`\`\`css
@container (min-width: 400px) {
  .tarjeta { display: flex; }
}
\`\`\`

Ahora la tarjeta se adapta al espacio que realmente tiene. La misma tarjeta, sin cambiarle una línea, se ve horizontal en el contenido principal y vertical en la barra lateral — **en la misma pantalla, al mismo tiempo**.

### Los dos errores típicos

**Olvidarse de \`container-type\`.** Sin eso no hay contenedor que consultar, la \`@container\` no coincide con nada y no pasa absolutamente nada. No hay error: simplemente se ignora.

**Querer consultar el propio elemento.** El contenedor tiene que ser un **ancestro** del que estás estilando. Esto no funciona:

\`\`\`css
.tarjeta {
  container-type: inline-size;
}
@container (min-width: 400px) {
  .tarjeta { display: flex; }   /* la tarjeta no puede consultarse a si misma */
}
\`\`\`

La razón es lógica: si el tamaño del contenedor dependiera de las reglas que se aplican dentro de él, y esas reglas cambiaran su tamaño, no habría respuesta estable. Por eso hace falta un elemento que envuelva.

### Qué valor de \`container-type\` usar

| Valor | Qué permite consultar |
|---|---|
| \`inline-size\` | solo el ancho. Es el que se usa casi siempre |
| \`size\` | ancho y alto, pero te obliga a fijarle un alto |
| \`normal\` | ninguno. Es el valor por defecto |

Empezá siempre con \`inline-size\`.

### Contenedores con nombre

Si hay contenedores anidados, por defecto se consulta **el más cercano**. Para elegir otro, se le pone nombre:

\`\`\`css
.pagina {
  container-type: inline-size;
  container-name: pagina;
}

@container pagina (min-width: 900px) {
  .tarjeta { font-size: 1.25rem; }
}
\`\`\`

> **La diferencia en una frase:** \`@media\` pregunta "cómo es la pantalla", \`@container\` pregunta "cuánto lugar tengo". Para un componente que se reutiliza en varios lugares, la segunda es casi siempre la pregunta correcta.`,
      codeExample: {
        html: `<div class="ancho">\n  <p class="etiqueta">Contenedor de 100%</p>\n  <article class="tarjeta">\n    <img src="https://placehold.co/80x80" alt="Miniatura" />\n    <div><h4>Tarjeta horizontal</h4><p>Hay lugar, se acomoda en fila.</p></div>\n  </article>\n</div>\n\n<div class="angosto">\n  <p class="etiqueta">Contenedor de 220px</p>\n  <article class="tarjeta">\n    <img src="https://placehold.co/80x80" alt="Miniatura" />\n    <div><h4>La misma tarjeta</h4><p>Sin lugar, se apila.</p></div>\n  </article>\n</div>`,
        css: `/* Los dos son contenedores consultables */\n.ancho,\n.angosto {\n  container-type: inline-size;\n  border: 1px dashed #bbb;\n  padding: 8px;\n  margin-bottom: 16px;\n}\n\n.angosto {\n  width: 220px;\n}\n\n.tarjeta {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n\n/* Una sola regla, y cada tarjeta responde al lugar que TIENE */\n@container (min-width: 400px) {\n  .tarjeta {\n    flex-direction: row;\n    align-items: center;\n  }\n}\n\n.etiqueta {\n  font-size: 12px;\n  color: #666;\n  margin: 0 0 8px;\n}\n\n.tarjeta h4 {\n  margin: 0 0 4px;\n}`,
        editable: true,
      },
      order: 4,
    },
    {
      id: "17-leccion-05",
      title: "@supports: preguntar antes de usar",
      content: `## @supports: preguntar antes de usar

Te queda una pregunta práctica: si CSS suma funciones nuevas todo el tiempo, **¿cómo las usás sin romper a quien tiene un navegador viejo?**

### Lo que pasa por defecto

CSS ya es tolerante: si un navegador no entiende una declaración, **la ignora y sigue**. Eso alcanza en muchos casos:

\`\`\`css
.caja {
  background: gray;              /* lo entiende todo el mundo */
  background: color-mix(in srgb, blue 40%, white);  /* si no lo entiende, queda gray */
}
\`\`\`

Pero no alcanza cuando el cambio implica **varias reglas juntas**. Si vas a montar un layout con \`subgrid\`, no querés que se aplique la mitad.

### La solución

\`@supports\` pregunta si el navegador entiende algo, **antes** de aplicar el bloque:

\`\`\`css
@supports (grid-template-rows: subgrid) {
  .tarjeta {
    grid-row: span 3;
    grid-template-rows: subgrid;
  }
}
\`\`\`

Se escribe una propiedad y un valor entre paréntesis. Si el navegador entiende esa combinación, aplica todo el bloque. Si no, lo saltea entero.

### Preguntar por lo contrario

\`not\` invierte, y sirve para dar la alternativa:

\`\`\`css
@supports not (grid-template-rows: subgrid) {
  .tarjeta { min-height: 220px; }  /* el apano de siempre */
}
\`\`\`

### Combinar condiciones

\`\`\`css
@supports (display: grid) and (gap: 1rem) { }
@supports (position: sticky) or (position: -webkit-sticky) { }
\`\`\`

### Preguntar por un selector

Las propiedades se preguntan con paréntesis comunes. Para **selectores** hay una forma aparte:

\`\`\`css
@supports selector(:has(*)) {
  .tarjeta:has(img) { border-color: steelblue; }
}
\`\`\`

Eso te deja usar \`:has()\` con red de contención.

### Cuándo vale la pena

No hace falta envolver todo. Usalo cuando:

- El cambio necesita **varias declaraciones juntas** para tener sentido.
- Sin la función, el diseño no queda peor sino **roto**.
- Querés dar una alternativa concreta con \`not\`.

Para un color o una sombra que degrada solo, no lo necesitás: la tolerancia natural de CSS ya te cubre.

> **La idea para llevarse:** \`@supports\` es lo que te permite usar CSS moderno sin esperar años. ¿No preguntás "qué navegador es" — preguntás "entendés esto?", que es la única pregunta que no envejece.`,
      codeExample: {
        html: `<div class="galeria">\n  <article class="tarjeta"><h4>Una</h4><p>Texto corto.</p><button>Ver</button></article>\n  <article class="tarjeta"><h4>Un titulo de dos lineas para desalinear</h4><p>Texto.</p><button>Ver</button></article>\n</div>\n<p class="nota">Si tu navegador soporta subgrid, los botones estan alineados. Si no, cada tarjeta usa una altura minima.</p>`,
        css: `.galeria {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  grid-template-rows: auto 1fr auto;\n  gap: 12px;\n}\n\n.tarjeta {\n  display: grid;\n  gap: 8px;\n  padding: 12px;\n  border: 1px solid #ddd;\n  border-radius: 8px;\n}\n\n/* Camino moderno: las tarjetas comparten las filas del padre */\n@supports (grid-template-rows: subgrid) {\n  .tarjeta {\n    grid-row: span 3;\n    grid-template-rows: subgrid;\n  }\n}\n\n/* Alternativa para quien no lo soporta */\n@supports not (grid-template-rows: subgrid) {\n  .tarjeta {\n    min-height: 180px;\n  }\n}\n\n.tarjeta h4 {\n  margin: 0;\n}\n\n.nota {\n  font-size: 13px;\n  color: #666;\n}`,
        editable: true,
      },
      order: 5,
    },
  ],
  exercises: [
    {
      id: "17-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt:
        "¿Qué regla CSS se usa para aplicar estilos según el tamaño de la pantalla?",
      options: [
        { id: "a", text: "@screen", isCorrect: false },
        { id: "b", text: "@responsive", isCorrect: false },
        { id: "c", text: "@media", isCorrect: true },
        { id: "d", text: "@breakpoint", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Es una regla que empieza con @ y se refiere al 'medio' o dispositivo.",
      explanation:
        "La regla @media permite aplicar estilos condicionalmente según las caracteristicas del dispositivo, como el ancho de la pantalla, la orientación o la resolución.",
    },
    {
      id: "17-ej-02",
      type: "code-completion",
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt:
        "Completa la media query para que los estilos se apliquen en pantallas de 768px o más (enfoque mobile-first):",
      codeTemplate: {
        html: `<div class="contenedor">Contenido</div>`,
        cssPrefix: "@media (",
        cssSuffix: ": 768px) {\n  .contenedor {\n    max-width: 720px;\n  }\n}",
        blanks: ["min-width"],
      },
      validation: { type: "exact", answer: "min-width" },
      hint: "En mobile-first usamos un 'ancho mínimo' para aplicar estilos desde cierto punto hacia arriba.",
      explanation:
        "En el enfoque mobile-first se usa 'min-width' para aplicar estilos cuando la pantalla es de al menos X píxeles de ancho. Los estilos se 'activan' a partir de ese punto.",
    },
    {
      id: "17-ej-03",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 3,
      prompt:
        "En un enfoque mobile-first, ¿cuál es el orden correcto de las media queries?",
      options: [
        { id: "a", text: "De mayor a menor: 1280px, 1024px, 768px", isCorrect: false },
        { id: "b", text: "De menor a mayor: 640px, 768px, 1024px", isCorrect: true },
        { id: "c", text: "No importa el orden", isCorrect: false },
        { id: "d", text: "Solo se usa una media query", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Mobile-first empieza con los estilos base para móvil y va agregando para pantallas más grandes.",
      explanation:
        "En mobile-first, las media queries con min-width deben ir de menor a mayor (640px, 768px, 1024px...) para que cada breakpoint sobreescriba al anterior correctamente.",
    },
    {
      id: "17-ej-04",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt:
        "Arrastra cada breakpoint común al tipo de dispositivo que representa:",
      dragItems: [
        { id: "drag-1", content: "640px", correctZone: "zone-movil" },
        { id: "drag-2", content: "768px", correctZone: "zone-tablet" },
        { id: "drag-3", content: "1024px", correctZone: "zone-laptop" },
        { id: "drag-4", content: "1280px", correctZone: "zone-escritorio" },
      ],
      dropZones: [
        { id: "zone-movil", label: "Móviles grandes (sm)" },
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
      hint: "Los breakpoints van de menor a mayor: 640 para móviles grandes, 768 para tablets, 1024 para laptops y 1280 para escritorio.",
      explanation:
        "Estos son los breakpoints estándar usados por frameworks como Tailwind CSS: sm=640px (móviles grandes), md=768px (tablets), lg=1024px (laptops), xl=1280px (escritorio).",
    },
    {
      id: "17-ej-05",
      type: "live-editor",
      difficulty: 2 ,
      xpReward: 20,
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
        // Graded by parsing `targetCSS` into selector -> declarations, not by
        // searching the submission for loose words. See src/lib/cssRules.ts.
        type: "css-rules",
      },
      hint: "Primero escribe los estilos base de .caja, luego una @media con min-width: 600px que cambie el background-color.",
      explanation:
        "Se definen los estilos base (móvil) fuera de la media query. Luego con @media (min-width: 600px) se sobreescribe el background-color para pantallas de 600px o más.",
    },
    {
      id: "17-ej-06",
      type: "code-completion",
      difficulty: 2 ,
      xpReward: 20,
      order: 6,
      prompt:
        "Completa la función CSS para crear un font-size fluido con un mínimo de 1rem, un valor ideal de 3vw, y un máximo de 2rem:",
      codeTemplate: {
        html: `<h1 class="titulo">Titulo fluido</h1>`,
        cssPrefix: ".titulo {\n  font-size: ",
        cssSuffix: "(1rem, 3vw, 2rem);\n}",
        blanks: ["clamp"],
      },
      validation: { type: "exact", answer: "clamp" },
      hint: "Es una función CSS que recibe tres valores: mínimo, preferido y máximo. Su nombre significa 'sujetar'.",
      explanation:
        "La función clamp() acepta tres parámetros: un mínimo, un valor preferido y un máximo. El navegador usa el valor preferido pero nunca baja del mínimo ni sube del máximo. Ideal para tipografía responsiva.",
    },
    {
      id: "17-ej-07",
      type: "visual-match",
      difficulty: 3 ,
      xpReward: 30,
      order: 7,
      prompt:
        "Crea un layout responsivo mobile-first: una cuadricula con clase 'grid-responsivo' que tenga 1 columna por defecto, 2 columnas a partir de 500px y 3 columnas a partir de 800px. Usa gap de 16px y display: grid.",
      codeTemplate: {
        html: `<div class="grid-responsivo">\n  <div class="item">1</div>\n  <div class="item">2</div>\n  <div class="item">3</div>\n  <div class="item">4</div>\n  <div class="item">5</div>\n  <div class="item">6</div>\n</div>`,
        cssPrefix: ".item {\n  background: #8e44ad;\n  color: white;\n  padding: 20px;\n  text-align: center;\n  border-radius: 8px;\n}\n\n",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".grid-responsivo {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 16px;\n}\n.item {\n  background: #8e44ad;\n  color: white;\n  padding: 20px;\n  text-align: center;\n  border-radius: 8px;\n}\n@media (min-width: 500px) {\n  .grid-responsivo {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n@media (min-width: 800px) {\n  .grid-responsivo {\n    grid-template-columns: repeat(3, 1fr);\n  }\n}",
      validation: {
        // Graded by parsing `targetCSS` into selector -> declarations, not by
        // searching the submission for loose words. See src/lib/cssRules.ts.
        type: "css-rules",
      },
      hint: "Empieza con estilos base de 1 columna, luego agrega media queries para 500px (2 columnas) y 800px (3 columnas).",
      explanation:
        "El patrón mobile-first define la base con 1 columna (grid-template-columns: 1fr), luego agrega columnas en breakpoints mayores: 2 columnas a 500px y 3 a 800px, usando @media (min-width).",
    },
    {
      id: "17-ej-08",
      type: "quiz",
      difficulty: 3 ,
      xpReward: 30,
      order: 8,
      prompt:
        "¿Qué hace la declaración 'font-size: clamp(1rem, 2.5vw, 2rem)'?",
      options: [
        { id: "a", text: "Fija el tamaño en 2.5vw siempre", isCorrect: false },
        { id: "b", text: "Alterna entre 1rem y 2rem según el viewport", isCorrect: false },
        { id: "c", text: "Usa 2.5vw pero nunca baja de 1rem ni sube de 2rem", isCorrect: true },
        { id: "d", text: "Aplica 1rem en móvil y 2rem en escritorio", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "clamp() toma tres valores: mínimo, preferido y máximo. El navegador usa el del medio respetando los límites.",
      explanation:
        "clamp(1rem, 2.5vw, 2rem) indica: usa 2.5vw como tamaño ideal, pero nunca menor a 1rem ni mayor a 2rem. Esto crea una tipografía fluida con límites seguros.",
    },
    {
      id: "17-ej-09",
      type: "quiz",
      difficulty: 3,
      xpReward: 20,
      order: 9,
      prompt:
        "Escribis @container (min-width: 400px) { .tarjeta { display: flex; } } pero ningun elemento tiene container-type. ¿Qué pasa?",
      options: [
        {
          id: "a",
          text: "Funciona como una media query normal, midiendo la pantalla",
          isCorrect: false,
        },
        {
          id: "b",
          text: "No pasa nada: sin contenedor declarado la consulta no coincide con nada",
          isCorrect: true,
        },
        { id: "c", text: "Toma el body como contenedor por defecto", isCorrect: false },
        { id: "d", text: "El navegador lanza un error de sintaxis", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "@container consulta a un ancestro que se haya declarado consultable. Si nadie se declaro, no hay a quien preguntarle.",
      explanation:
        "Hacen falta los dos pasos: declarar container-type en un ancestro y después consultarlo. Sin el primero la regla se ignora en silencio, sin error, que es lo que la hace difícil de depurar. Y ojo: el contenedor tiene que ser un ancestro, un elemento no puede consultarse a si mismo.",
    },
    {
      id: "17-ej-10",
      type: "live-editor",
      difficulty: 3,
      xpReward: 25,
      order: 10,
      prompt:
        "Haz que la tarjeta responda al espacio que tiene, no a la pantalla. A la clase 'columna' dale container-type: inline-size. A 'tarjeta' dale display: flex y flex-direction: column. Y dentro de un @container (min-width: 400px), a 'tarjeta' dale flex-direction: row.",
      codeTemplate: {
        html: `<div class="columna">\n  <article class="tarjeta">\n    <img src="https://placehold.co/60x60" alt="Miniatura" />\n    <p>Se acomoda segun el lugar de la columna.</p>\n  </article>\n</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".columna {\n  container-type: inline-size;\n}\n.tarjeta {\n  display: flex;\n  flex-direction: column;\n}\n@container (min-width: 400px) {\n  .tarjeta {\n    flex-direction: row;\n  }\n}",
      validation: {
        // Graded by parsing `targetCSS` into selector -> declarations, not by
        // searching the submission for loose words. See src/lib/cssRules.ts.
        type: "css-rules",
      },
      hint: "Primero el ancestro se declara consultable con container-type. Después la consulta @container va por fuera, envolviendo la regla de la tarjeta.",
      explanation:
        "La columna se declara contenedor con container-type: inline-size, y la tarjeta arranca apilada. Dentro del @container, cuando la columna mide 400px o más, pasa a fila. La misma tarjeta se ve distinta en una barra lateral y en el contenido principal, en la misma pantalla, porque pregunta por su espacio y no por el viewport.",
    },
    {
      id: "17-ej-11",
      type: "live-editor",
      difficulty: 3,
      xpReward: 25,
      order: 11,
      prompt:
        "Usa subgrid con red de contención. Dentro de un @supports (grid-template-rows: subgrid), a la clase 'tarjeta' dale grid-row: span 3 y grid-template-rows: subgrid. Y dentro de un @supports not (grid-template-rows: subgrid), dale min-height: 180px.",
      codeTemplate: {
        html: `<div class="galeria">\n  <article class="tarjeta"><h4>Una</h4><p>Texto.</p><button>Ver</button></article>\n  <article class="tarjeta"><h4>Un titulo de dos lineas</h4><p>Texto.</p><button>Ver</button></article>\n</div>`,
        cssPrefix: ".galeria {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  grid-template-rows: auto 1fr auto;\n  gap: 12px;\n}\n.tarjeta {\n  display: grid;\n  gap: 8px;\n}\n\n",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        "@supports (grid-template-rows: subgrid) {\n  .tarjeta {\n    grid-row: span 3;\n    grid-template-rows: subgrid;\n  }\n}\n@supports not (grid-template-rows: subgrid) {\n  .tarjeta {\n    min-height: 180px;\n  }\n}",
      validation: {
        // Graded by parsing `targetCSS` into selector -> declarations, not by
        // searching the submission for loose words. See src/lib/cssRules.ts.
        type: "css-rules",
      },
      hint: "Son dos bloques @supports separados: uno con la condición y otro con not. Cada uno lleva adentro la regla .tarjeta.",
      explanation:
        "El primer bloque aplica subgrid solo si el navegador lo entiende, y como necesita dos declaraciones juntas para tener sentido, envolverlas es lo correcto. El segundo da la alternativa para quien no lo soporta. ¿Preguntar 'entendes esto?' en lugar de 'que navegador sos' es lo que no envejece.",
    },
    {
      /** EL RETO INTEGRADOR del modulo. Ver src/lib/calificar.ts. */
      id: "17-ej-reto",
      type: "live-editor",
      difficulty: 3,
      xpReward: 60,
      order: 12,
      prompt:
        "Reto integrador. Mobile-first de verdad: primero lo chico, y después lo que cambia al haber lugar. Nunca al reves.",
      retoPasos: [
        {
          instruccion:
            "Arranca por lo CHICO: con `.tarjetas`, apila las tarjetas en una columna con display flex y flex-direction column, con un gap de 12px.",
          esperado: ".tarjetas { display: flex; flex-direction: column; gap: 12px; }",
        },
        {
          instruccion:
            "Con `.tarjeta`, dale un padding de 16px y un fondo #eef2f7. Esto vale en todos los tamaños, asi que va afuera de cualquier media query.",
          esperado: ".tarjeta { padding: 16px; background-color: #eef2f7; }",
        },
        {
          instruccion:
            "Ahora lo que cambia con espacio: adentro de `@media (min-width: 600px)`, hace que `.tarjetas` pase a fila con flex-direction row. `min-width` es lo que hace que esto sea mobile-first.",
          esperado: "@media (min-width: 600px) { .tarjetas { flex-direction: row; } }",
        },
        {
          instruccion:
            "Preguntá antes de usar: adentro de `@supports (display: grid)`, dale a `.tarjetas` display grid con tres columnas iguales. Si el navegador no soporta grid, se queda con el flex de los pasos anteriores.",
          esperado: "@supports (display: grid) { .tarjetas { display: grid; grid-template-columns: repeat(3, 1fr); } }",
        },
      ],
      codeTemplate: {
        html: "<div class=\"tarjetas\">\n  <div class=\"tarjeta\">Una</div>\n  <div class=\"tarjeta\">Dos</div>\n  <div class=\"tarjeta\">Tres</div>\n</div>",
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      validation: {
        type: "css-rules",
      },
      referenceSolution:
        ".tarjetas {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n\n.tarjeta {\n  padding: 16px;\n  background-color: #eef2f7;\n}\n\n@media (min-width: 600px) {\n  .tarjetas {\n    flex-direction: row;\n  }\n}\n\n@supports (display: grid) {\n  .tarjetas {\n    display: grid;\n    grid-template-columns: repeat(3, 1fr);\n  }\n}",
      hint: "Mobile-first significa que el CSS de base es el de pantalla chica y las media queries AGREGAN, con `min-width`. Al reves -empezar grande y restar con `max-width`- se llama desktop-first y obliga a deshacer estilos.",
      explanation:
        "El orden de los pasos ES la leccion. Los pasos 1 y 2 son la base, la que ve cualquier dispositivo. El 3 agrega lo que solo tiene sentido con ancho. Y el 4 muestra `@supports`, que pregunta si una propiedad existe antes de usarla: la diferencia con una media query es que una pregunta por el TAMAÑO y la otra por la CAPACIDAD.",
    },
  ],
};
