import type { ModuleData } from "@/types";

export const unidadesCSSModule: ModuleData = {
  slug: "unidades-css",
  title: "Unidades CSS",
  description:
    "Conoce todas las unidades de medida en CSS: absolutas (px, cm, pt), relativas (%, em, rem) y de viewport (vw, vh). Aprende cuando usar cada una.",
  order: 5,
  dojo: "css" as const,
  nivel: "obligatorio",
  category: "css-caja",
  icon: "Scaling",
  lessons: [
    {
      id: "10-leccion-01",
      title: "Unidades absolutas",
      content: `## Unidades absolutas

Las unidades **absolutas** tienen un tamaño fijo que **no cambia** según el contexto. Siempre representan la misma medida.

### Unidades absolutas en CSS

| Unidad | Nombre | Equivalencia |
|--------|--------|-------------|
| \`px\` | Píxeles | 1px = 1/96 de pulgada |
| \`cm\` | Centimetros | 1cm = 37.8px |
| \`mm\` | Milimetros | 1mm = 3.78px |
| \`in\` | Pulgadas | 1in = 96px |
| \`pt\` | Puntos | 1pt = 1/72 de pulgada = 1.33px |
| \`pc\` | Picas | 1pc = 12pt = 16px |

### El pixel (px): la unidad más usada

El **pixel CSS** no es exactamente un pixel fisico de la pantalla. Es una unidad de referencia que equivale a **1/96 de pulgada**. En pantallas de alta resolución (Retina), un pixel CSS puede equivaler a 2 o más píxeles fisicos.

\`\`\`css
.caja {
  width: 300px;
  height: 200px;
  font-size: 16px;
  border: 1px solid #ccc;
}
\`\`\`

### Cuando usar unidades absolutas

- **px**: Para bordes, sombras, tamaños que no deben cambiar
- **pt**: Para hojas de estilos de impresión (\`@media print\`)
- **cm, mm, in**: Casi exclusivamente para impresión

### Limitaciones de las unidades absolutas

Las unidades absolutas **no se adaptan** al tamaño de la pantalla o las preferencias del usuario:

\`\`\`css
/* PROBLEMA: 300px puede ser muy ancho en moviles */
.tarjeta {
  width: 300px; /* No se adapta */
}

/* MEJOR: usar unidades relativas */
.tarjeta {
  width: 90%;
  max-width: 300px;
}
\`\`\`

> **Consejo:** Usa \`px\` para detalles pequeños (bordes, sombras, border-radius) y unidades relativas para tamaños de texto, anchos y alturas.`,
      codeExample: {
        html: `<div class="caja-px">300px de ancho</div>\n<div class="caja-pt">Texto en 14pt</div>\n<div class="borde-demo">Borde de 2px solido</div>`,
        css: `.caja-px {\n  width: 300px;\n  padding: 16px;\n  background-color: lightblue;\n  margin-bottom: 8px;\n}\n\n.caja-pt {\n  font-size: 14pt;\n  padding: 16px;\n  background-color: lightyellow;\n  margin-bottom: 8px;\n}\n\n.borde-demo {\n  border: 2px solid steelblue;\n  border-radius: 8px;\n  padding: 16px;\n  box-shadow: 0 2px 4px rgba(0,0,0,0.1);\n}`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "10-leccion-02",
      title: "Unidades relativas: %, em, rem",
      content: `## Unidades relativas

Las unidades **relativas** se calculan en función de **otro valor de referencia**, lo que las hace ideales para diseños flexibles y accesibles.

### Porcentaje (%)

Se calcula relativo al **elemento padre**:

\`\`\`css
.padre {
  width: 800px;
}
.hijo {
  width: 50%; /* = 400px (50% del padre) */
}
\`\`\`

Para \`font-size\`, el porcentaje es relativo al tamaño de fuente del padre:

\`\`\`css
body { font-size: 16px; }
h1 { font-size: 200%; } /* = 32px (200% de 16px) */
\`\`\`

### em

La unidad \`em\` es relativa al **tamaño de fuente del elemento** (o del padre si se usa en font-size):

\`\`\`css
.texto {
  font-size: 16px;
  padding: 1.5em;    /* = 24px (1.5 x 16px) */
  margin-bottom: 1em; /* = 16px (1 x 16px) */
}
\`\`\`

**Cuidado con la herencia compuesta:**

\`\`\`css
.padre { font-size: 1.2em; }  /* Si body=16px -> 19.2px */
.hijo { font-size: 1.2em; }   /* 1.2 x 19.2px = 23.04px */
.nieto { font-size: 1.2em; }  /* 1.2 x 23.04px = 27.65px */
/* El tamano crece descontroladamente! */
\`\`\`

### rem (root em)

La unidad \`rem\` es relativa al **tamaño de fuente del elemento raíz** (\`<html>\`), evitando el problema de la herencia compuesta:

\`\`\`css
html { font-size: 16px; } /* Base: 16px */
h1 { font-size: 2rem; }   /* Siempre 32px */
h2 { font-size: 1.5rem; } /* Siempre 24px */
p { font-size: 1rem; }    /* Siempre 16px */
\`\`\`

### em vs rem

| Caracteristica | em | rem |
|---------------|-----|-----|
| Referencia | Fuente del elemento/padre | Fuente del \`<html>\` |
| Herencia compuesta | Si (puede acumularse) | No (siempre relativo a root) |
| Uso ideal | Padding/margin proporcionales | Tamaños de fuente consistentes |

> **Buena práctica:** Usa \`rem\` para tamaños de fuente y \`em\` para padding y margin que deben escalar proporcionalmente al texto del componente.`,
      codeExample: {
        html: `<div class="contenedor">\n  <h2>Titulo en rem</h2>\n  <p class="grande">Texto grande con padding en em</p>\n  <p class="normal">Texto normal</p>\n  <div class="hijo">Hijo al 80% del ancho</div>\n</div>`,
        css: `html { font-size: 16px; }\n\n.contenedor {\n  width: 100%;\n  max-width: 600px;\n  padding: 1rem;\n  background: #f9f9f9;\n  border: 1px solid #ddd;\n}\n\nh2 { font-size: 1.75rem; } /* 28px */\n\n.grande {\n  font-size: 1.25rem; /* 20px */\n  padding: 1em; /* 20px (relativo a su font-size) */\n  background: lightblue;\n}\n\n.normal {\n  font-size: 1rem; /* 16px */\n  padding: 1em; /* 16px */\n  background: lightyellow;\n}\n\n.hijo {\n  width: 80%;\n  padding: 0.5rem;\n  background: lightgreen;\n  margin-top: 8px;\n}`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "10-leccion-03",
      title: "Unidades de viewport",
      content: `## Unidades de viewport

Las unidades de **viewport** son relativas al tamaño de la **ventana del navegador**. Son fundamentales para el diseño responsivo.

### Las cuatro unidades de viewport

| Unidad | Significado | Referencia |
|--------|-----------|-----------|
| \`vw\` | Viewport Width | 1vw = 1% del ancho de la ventana |
| \`vh\` | Viewport Height | 1vh = 1% del alto de la ventana |
| \`vmin\` | Viewport Minimum | 1vmin = 1% del lado más corto |
| \`vmax\` | Viewport Maximum | 1vmax = 1% del lado más largo |

### Ejemplo: ventana de 1200px x 800px

\`\`\`
1vw   = 12px    (1% de 1200px)
1vh   = 8px     (1% de 800px)
1vmin = 8px     (1% de 800px, el lado menor)
1vmax = 12px    (1% de 1200px, el lado mayor)
\`\`\`

### Uso común: secciones de pantalla completa

\`\`\`css
.hero {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
\`\`\`

### Tipografía fluida con vw

\`\`\`css
/* El titulo crece y decrece con la ventana */
h1 {
  font-size: 5vw; /* En 1200px = 60px, en 375px = 18.75px */
}
\`\`\`

**Problema:** En pantallas muy grandes el texto sera enorme, y en muy pequeñas sera diminuto.

**Solución con clamp():**

\`\`\`css
h1 {
  font-size: clamp(24px, 5vw, 64px);
  /* Minimo 24px, ideal 5vw, maximo 64px */
}
\`\`\`

### vmin y vmax

Son útiles para elementos que deben adaptarse a la orientación:

\`\`\`css
/* Un cuadrado que siempre cabe en la pantalla */
.cuadrado {
  width: 50vmin;
  height: 50vmin;
  /* Siempre sera 50% del lado mas corto */
}
\`\`\`

### El problema de \`100vh\` en el celular

En una computadora, \`100vh\` es exactamente la altura de la ventana y no hay más que decir. En un celular hay un problema real: la barra de direcciones del navegador **aparece y desaparece** mientras el usuario hace scroll.

\`vh\` mide contra el viewport **grande**: la ventana como si la barra estuviera oculta. Entonces, mientras la barra está visible, un bloque con \`height: 100vh\` es más alto que el espacio disponible, y su parte de abajo queda tapada. Es el motivo por el que tantos sitios tienen un botón que no se puede tocar en el celular y se ve perfecto en la computadora.

### Las tres unidades dinámicas

CSS resolvió esto agregando tres variantes. Se escriben igual que \`vh\`, con una letra adelante:

| Unidad | Mide contra | Cuándo conviene |
|---|---|---|
| \`lvh\` | El viewport **grande** (barra oculta) | Lo mismo que hace \`vh\` hoy |
| \`svh\` | El viewport **chico** (barra visible) | Cuando nada puede quedar tapado, nunca |
| \`dvh\` | El viewport **actual**, y cambia solo | Un bloque a pantalla completa |

Las tres existen también para el ancho: \`svw\`, \`lvw\` y \`dvw\`. Se usan mucho menos, porque la barra de direcciones cambia la altura y no el ancho.

\`\`\`css
/* Antes: en el celular, la parte de abajo queda tapada */
.portada {
  height: 100vh;
}

/* Ahora: la altura sigue a la ventana real, con barra o sin ella */
.portada {
  height: 100dvh;
}
\`\`\`

**\`dvh\` es el que vas a querer casi siempre**, porque se ajusta solo cuando la barra aparece o se va. Usá \`svh\` cuando prefieras que el bloque sea siempre el más chico y nunca se mueva: \`dvh\` se actualiza mientras el usuario scrollea, y ese movimiento a veces se nota.

> **Atención:** \`100vh\` sigue siendo válido y no está roto en la computadora. El problema aparece solo donde hay una barra que se mueve, así que la costumbre útil es escribir \`dvh\` en cualquier bloque a pantalla completa.`,
      codeExample: {
        html: `<div class="seccion-hero">\n  <h1>Titulo Responsivo</h1>\n  <p>Esta seccion ocupa toda la ventana</p>\n</div>\n<div class="caja-vmin">Cuadrado con vmin</div>`,
        css: `.seccion-hero {\n  width: 100%;\n  height: 50vh;\n  background: linear-gradient(135deg, steelblue, #2c3e50);\n  color: white;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n}\n\n.seccion-hero h1 {\n  font-size: clamp(20px, 4vw, 48px);\n}\n\n.seccion-hero p {\n  font-size: clamp(14px, 2vw, 20px);\n  opacity: 0.8;\n}\n\n.caja-vmin {\n  width: 30vmin;\n  height: 30vmin;\n  background: tomato;\n  color: white;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin: 16px;\n  border-radius: 8px;\n}`,
        editable: true,
      },
      order: 3,
    },
    {
      id: "10-leccion-04",
      title: "Cuando usar cada unidad",
      content: `## Guia práctica: cuando usar cada unidad

### Resumen por caso de uso

| Caso de uso | Unidad recomendada | Razón |
|------------|-------------------|-------|
| **Tamaño de fuente base** | \`rem\` | Consistente, respeta preferencias del usuario |
| **Tamaño de fuente fluido** | \`clamp(rem, vw, rem)\` | Se adapta a la pantalla con límites |
| **Padding y margin** | \`em\` o \`rem\` | Escala con el texto |
| **Ancho de contenedores** | \`%\` + \`max-width\` en px | Flexible con límite |
| **Bordes y sombras** | \`px\` | Tamaño fijo y preciso |
| **Border-radius** | \`px\` o \`%\` | px para sutil, % para circulos |
| **Altura de secciones** | \`vh\` o \`auto\` | Relativa a la ventana |
| **Media queries** | \`em\` | Consistente entre navegadores |
| **Impresión** | \`pt\`, \`cm\`, \`mm\` | Unidades fisicas reales |

### Patrón moderno para fuentes base

\`\`\`css
html {
  /* Respeta la configuracion del navegador */
  font-size: 100%; /* Normalmente 16px */
}

body {
  font-size: 1rem; /* = 16px base */
  line-height: 1.6; /* Sin unidad = relativa al font-size */
}

h1 { font-size: 2.5rem; }    /* 40px */
h2 { font-size: 2rem; }      /* 32px */
h3 { font-size: 1.5rem; }    /* 24px */
small { font-size: 0.875rem; } /* 14px */
\`\`\`

### Patrón para contenedores responsivos

\`\`\`css
.contenedor {
  width: 90%;         /* Flexible */
  max-width: 1200px;  /* Con limite */
  margin: 0 auto;     /* Centrado */
  padding: 0 1rem;    /* Espacio interior escalable */
}
\`\`\`

### Accesibilidad y unidades

Usar \`rem\` para fuentes es una cuestion de **accesibilidad**. Si un usuario aumenta el tamaño de fuente base en su navegador:

- Con \`px\`: El texto NO cambia (ignora la preferencia)
- Con \`rem\`: El texto SI crece proporcionalmente

> **Regla final:** No hay una unidad "correcta" universal. La clave es elegir la unidad adecuada para cada situación, priorizando la flexibilidad y la accesibilidad.`,
      codeExample: {
        html: `<div class="contenedor">\n  <h1>Titulo Principal</h1>\n  <h2>Subtitulo</h2>\n  <p>Este parrafo usa unidades rem para que el tamano de fuente respete las preferencias del navegador.</p>\n  <button class="btn">Boton con em</button>\n</div>`,
        css: `html { font-size: 100%; }\n\n.contenedor {\n  width: 90%;\n  max-width: 600px;\n  margin: 0 auto;\n  padding: 1.5rem;\n}\n\nh1 { font-size: 2rem; } /* 32px */\nh2 { font-size: 1.5rem; } /* 24px */\n\np {\n  font-size: 1rem; /* 16px */\n  line-height: 1.6;\n  margin-bottom: 1rem;\n}\n\n.btn {\n  font-size: 1rem;\n  padding: 0.75em 1.5em; /* em: escala con el font-size del boton */\n  background: steelblue;\n  color: white;\n  border: 2px solid transparent; /* px: borde fijo */\n  border-radius: 4px; /* px: radio fijo */\n  cursor: pointer;\n}`,
        editable: true,
      },
      order: 4,
    },
  ],
  exercises: [
    {
      id: "10-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "¿Cuál de las siguientes es una unidad ABSOLUTA en CSS?",
      options: [
        { id: "a", text: "em", isCorrect: false },
        { id: "b", text: "%", isCorrect: false },
        { id: "c", text: "px", isCorrect: true },
        { id: "d", text: "rem", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Las unidades absolutas tienen un tamaño fijo que no depende de ningun otro elemento. Es la unidad más básica y común.",
      explanation:
        "El pixel (px) es una unidad absoluta: siempre representa 1/96 de pulgada, sin importar el contexto. Las unidades em, rem y % son relativas: su valor depende de otro elemento.",
    },
    {
      id: "10-ej-02",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 2,
      prompt:
        "Arrastra cada unidad a su categoría correspondiente:",
      dragItems: [
        { id: "drag-1", content: "px", correctZone: "zone-absoluta" },
        { id: "drag-2", content: "rem", correctZone: "zone-relativa" },
        { id: "drag-3", content: "vw", correctZone: "zone-viewport" },
        { id: "drag-4", content: "%", correctZone: "zone-relativa" },
        { id: "drag-5", content: "vh", correctZone: "zone-viewport" },
        { id: "drag-6", content: "pt", correctZone: "zone-absoluta" },
      ],
      dropZones: [
        { id: "zone-absoluta", label: "Absoluta (tamaño fijo)" },
        { id: "zone-relativa", label: "Relativa (depende de otro valor)" },
        { id: "zone-viewport", label: "Viewport (depende de la ventana)" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-absoluta",
          "drag-2": "zone-relativa",
          "drag-3": "zone-viewport",
          "drag-4": "zone-relativa",
          "drag-5": "zone-viewport",
          "drag-6": "zone-absoluta",
        },
      },
      hint: "px y pt tienen tamaños fijos. rem y % dependen de otros elementos. vw y vh dependen del tamaño de la ventana del navegador.",
      explanation:
        "px y pt son absolutas (tamaño fijo). rem y % son relativas (rem al root, % al padre). vw y vh son de viewport (relativas al tamaño de la ventana del navegador).",
    },
    {
      id: "10-ej-03",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 3,
      prompt:
        "Si html { font-size: 16px; }, ¿cuánto equivale 1.5rem?",
      options: [
        { id: "a", text: "15px", isCorrect: false },
        { id: "b", text: "24px", isCorrect: true },
        { id: "c", text: "16px", isCorrect: false },
        { id: "d", text: "32px", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "rem significa 'root em'. Se calcula multiplicando el valor por el font-size del elemento raíz (html).",
      explanation:
        "1.5rem = 1.5 x 16px = 24px. La unidad rem siempre se calcula en relación al font-size del elemento <html> (el root), que por defecto es 16px en la mayoria de navegadores.",
    },
    {
      id: "10-ej-04",
      type: "code-completion",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt:
        "Completa la unidad para que la sección hero ocupe exactamente el 100% de la altura de la ventana:",
      codeTemplate: {
        html: `<section class="hero">Seccion a pantalla completa</section>`,
        cssPrefix: ".hero {\n  width: 100%;\n  height: 100",
        cssSuffix: ";\n  background: steelblue;\n  color: white;\n}",
        blanks: ["vh"],
      },
      validation: { type: "exact", answer: "vh" },
      hint: "Necesitas una unidad de viewport que represente el alto (height) de la ventana. 100 de esta unidad = todo el alto.",
      explanation:
        "La unidad 'vh' (viewport height) representa el 1% de la altura de la ventana. 100vh = 100% de la altura visible del navegador, creando una sección de pantalla completa.",
    },
    {
      id: "10-ej-05",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt:
        "¿Cuál es la diferencia principal entre em y rem?",
      options: [
        {
          id: "a",
          text: "em es relativa al font-size del elemento/padre; rem es relativa al font-size del html (root)",
          isCorrect: true,
        },
        {
          id: "b",
          text: "em es más grande que rem",
          isCorrect: false,
        },
        {
          id: "c",
          text: "rem no funciona en todos los navegadores",
          isCorrect: false,
        },
        {
          id: "d",
          text: "No hay diferencia, son sinonimos",
          isCorrect: false,
        },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "La 'r' en rem significa 'root'. Piensa en que es la referencia de calculo para cada unidad.",
      explanation:
        "em se calcula relativa al font-size del propio elemento (o del padre si se usa en font-size). rem ('root em') siempre se calcula relativa al font-size del <html>. Esto hace que rem sea más predecible y evite la acumulación de herencia.",
    },
    {
      id: "10-ej-06",
      type: "live-editor",
      difficulty: 2 ,
      xpReward: 20,
      order: 6,
      prompt:
        "Crea un contenedor responsivo con clase 'contenedor' que use: width: 90%, max-width: 800px, margin: 0 auto, padding: 1.5rem. Agrega un h1 con font-size: 2rem y un párrafo con font-size: 1rem y line-height: 1.6.",
      codeTemplate: {
        html: `<div class="contenedor">\n  <h1>Titulo Responsivo</h1>\n  <p>Este contenedor se adapta al tamano de la pantalla usando unidades relativas.</p>\n</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".contenedor {\n  width: 90%;\n  max-width: 800px;\n  margin: 0 auto;\n  padding: 1.5rem;\n}\n\nh1 {\n  font-size: 2rem;\n}\n\np {\n  font-size: 1rem;\n  line-height: 1.6;\n}",
      validation: {
        // Graded by parsing `targetCSS` into selector -> declarations, not by
        // searching the submission for loose words. See src/lib/cssRules.ts.
        type: "css-rules",
      },
      hint: "Necesitas tres reglas: .contenedor con ancho relativo y máximo fijo, h1 con fuente grande en rem, y p con fuente base en rem.",
      explanation:
        "El contenedor combina width: 90% (flexible) con max-width: 800px (límite). Las fuentes usan rem para respetar las preferencias del usuario. Este es un patrón muy común en diseño web moderno.",
    },
    {
      id: "10-ej-07",
      type: "code-completion",
      difficulty: 3 ,
      xpReward: 30,
      order: 7,
      prompt:
        "Completa la unidad del padding para que escale proporcionalmente con el font-size del propio botón (no con el root):",
      codeTemplate: {
        html: `<button class="btn">Boton escalable</button>`,
        cssPrefix: ".btn {\n  font-size: 1.25rem;\n  padding: 0.75",
        cssSuffix: " 1.5em;\n  background: steelblue;\n  color: white;\n  border: none;\n  border-radius: 4px;\n}",
        blanks: ["em"],
      },
      validation: { type: "exact", answer: "em" },
      hint: "Necesitas una unidad relativa al font-size del PROPIO elemento, no del root. Es una unidad de dos letras.",
      explanation:
        "La unidad 'em' hace que el padding sea proporcional al font-size del botón (1.25rem = 20px). Así, 0.75em = 15px y 1.5em = 30px. Si cambias el font-size del botón, el padding se ajusta automáticamente.",
    },
    {
      id: "10-ej-08",
      type: "visual-match",
      difficulty: 3 ,
      xpReward: 30,
      order: 8,
      // Este ejercicio pedia display:flex, align-items y justify-content para
      // centrar -- flexbox se ensena diez modulos despues, en el 15. El enunciado
      // dictaba las tres propiedades, asi que el alumno las copiaba sin entender:
      // eso no es aprender, es transcribir. El centrado se hace ahora con las
      // unidades que este modulo si ensena, de modo que el espaciado pasa a ser
      // otra leccion de unidades en vez de un desvio hacia flexbox.
      prompt:
        "Reproduce el diseño: una sección hero (clase 'hero') con un mínimo de 50vh de alto, background steelblue y color white. Dale un padding de 10vh arriba y abajo y 5% a los costados, para que el espaciado crezca con la ventana. El título debe usar font-size: clamp(1.5rem, 4vw, 3rem) y margin: 0. Ojo: NO le pongas width, y en la explicación vas a ver por que.",
      codeTemplate: {
        html: `<section class="hero">\n  <h1>Bienvenido al Sitio</h1>\n</section>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".hero {\n  min-height: 50vh;\n  background: steelblue;\n  color: white;\n  padding: 10vh 5%;\n}\n\n.hero h1 {\n  font-size: clamp(1.5rem, 4vw, 3rem);\n  margin: 0;\n}",
      validation: {
        // Graded by parsing `targetCSS` into selector -> declarations, not by
        // searching the submission for loose words. See src/lib/cssRules.ts.
        type: "css-rules",
      },
      hint: "Tres unidades en un solo ejercicio: vh para el alto y el padding vertical, % para el padding horizontal, y clamp() con rem y vw en el título. El padding acepta dos valores: primero vertical, después horizontal.",
      explanation:
        "Cada unidad está elegida a propósito. El vh del min-height y del padding vertical es relativo a la altura de la ventana, así que el aire crece en pantallas grandes. El % del padding se calcula sobre el ANCHO del elemento -- incluso en padding-top y padding-bottom, un detalle que sorprende a casi todos. Y clamp(1.5rem, 4vw, 3rem) da tipografía fluida con piso y techo: crece con la ventana pero nunca baja de 1.5rem ni pasa de 3rem.\n\nDos decisiones que valen más que las unidades. Primero: min-height en vez de height, para que el contenido pueda crecer sin desbordar. Segundo, y por eso el enunciado te lo pidio: NO hay width. Un <section> es un elemento de bloque, así que ya ocupa todo el ancho disponible -- escribir width: 100% es redundante, y encima se pelea con el padding, porque por defecto el ancho mide solo el contenido y el padding se suma por fuera. Menos código, menos sorpresas. Si necesitas width y padding juntos, ahi es donde entra el box-sizing: border-box del modulo anterior.",
    },
    {
      id: "10-ej-09",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 9,
      prompt:
        "Una portada con `height: 100vh` se ve perfecta en la computadora, pero en el celular el botón de abajo queda tapado por la barra de direcciones. ¿Por qué pasa?",
      options: [
        {
          id: "a",
          text: "Porque `vh` mide contra el viewport grande, o sea la ventana como si la barra estuviera oculta",
          isCorrect: true,
        },
        {
          id: "b",
          text: "Porque `vh` no funciona en celulares y hay que usar porcentajes",
          isCorrect: false,
        },
        {
          id: "c",
          text: "Porque 100vh siempre da más de 100% y desborda en cualquier pantalla",
          isCorrect: false,
        },
        {
          id: "d",
          text: "Porque el celular tiene menos píxeles y el cálculo se redondea mal",
          isCorrect: false,
        },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "La barra de direcciones aparece y desaparece con el scroll. Pensá contra cuál de los dos tamaños mide `vh`: el de la ventana con la barra visible, o el de la ventana sin ella.",
      explanation:
        "`vh` mide contra el viewport GRANDE: la ventana como si la barra de direcciones estuviera oculta. Mientras la barra está visible, el espacio real es menor, así que un bloque de 100vh es más alto de lo que entra y su parte de abajo queda tapada.\n\nNo está roto ni le pasa solo al celular por ser celular: le pasa a cualquier navegador con una barra que se mueve. En la computadora no hay barra que aparezca y desaparezca, y por eso ahí se ve bien. Esa es exactamente la razón por la que existen `svh`, `lvh` y `dvh`.",
    },
    {
      id: "10-ej-10",
      type: "code-completion",
      difficulty: 2 ,
      xpReward: 25,
      order: 10,
      prompt:
        "Esta portada debe ocupar la ventana entera y ajustarse sola cuando la barra de direcciones del celular aparece o se va. Completá la unidad:",
      codeTemplate: {
        html: `<section class="portada">\n  <h1>Mi portafolio</h1>\n  <a class="cta" href="#proyectos">Ver proyectos</a>\n</section>`,
        cssPrefix: ".portada {\n  height: 100",
        cssSuffix: ";\n  background: steelblue;\n  color: white;\n  padding: 8vh 5%;\n}",
        blanks: ["dvh"],
      },
      validation: { type: "exact", answer: "dvh" },
      hint: "Son tres letras y termina en `vh`. Querés la que sigue al viewport ACTUAL, no la que siempre mide el grande ni la que siempre mide el chico.",
      explanation:
        "`dvh` es el viewport dinámico: mide contra la ventana tal como está en este momento y se actualiza sola cuando la barra aparece o se va. Por eso el botón nunca queda tapado.\n\nLas otras dos existen para cuando no querés ese ajuste. `lvh` mide siempre contra el viewport grande -- es lo que hace `vh` hoy, y por eso `lvh` no arregla nada. `svh` mide siempre contra el chico: el bloque queda un poco más bajo, pero no se mueve nunca, y a veces eso es preferible porque `dvh` se recalcula mientras el usuario scrollea y el salto se nota.\n\nRegla práctica: `dvh` para casi todo lo que va a pantalla completa, `svh` cuando la estabilidad importe más que aprovechar cada píxel.",
    },
    {
      /** EL RETO INTEGRADOR del modulo. Ver src/lib/calificar.ts. */
      id: "10-ej-reto",
      type: "live-editor",
      difficulty: 3,
      xpReward: 60,
      order: 11,
      prompt:
        "Reto integrador. Cada paso pide una unidad DISTINTA, y no es capricho: cada una se eligio por lo que hace bien.",
      retoPasos: [
        {
          instruccion:
            "Dale a .hero una altura de 60vh. Una unidad de viewport es la que sirve cuando queres una fraccion de la PANTALLA.",
          esperado: ".hero { height: 60vh; }",
        },
        {
          instruccion:
            "Limita su ancho a 80% del contenedor. El porcentaje es relativo al PADRE.",
          esperado: ".hero { width: 80%; }",
        },
        {
          instruccion:
            "Dale un padding de 2rem. `rem` es relativo a la raiz, asi que no se encadena aunque anides elementos.",
          esperado: ".hero { padding: 2rem; }",
        },
        {
          instruccion:
            "Ahora al titulo, con el selector descendente `.hero h1`: dale un tamaño de 2.5em. `em` SI es relativo a su propio contexto, y esa es la diferencia con rem.",
          esperado: ".hero h1 { font-size: 2.5em; }",
        },
      ],
      codeTemplate: {
        html: `<section class="hero">\n  <h1>Ancho completo</h1>\n  <p>Un texto que se adapta.</p>\n</section>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      validation: {
        type: "css-rules",
      },
      referenceSolution:
        ".hero {\n  height: 60vh;\n  width: 80%;\n  padding: 2rem;\n}\n\n.hero h1 {\n  font-size: 2.5em;\n}",
      hint: "Los cuatro pasos son la respuesta a la leccion 4: `vh` para la pantalla, `%` para el padre, `rem` para la raiz y `em` para el contexto propio.",
      explanation:
        "Elegir la unidad es elegir CONTRA QUE se mide. `vh` mide contra la ventana, `%` contra el elemento padre, `rem` contra la raiz del documento y `em` contra el tamaño del propio elemento. Por eso `rem` no se encadena al anidar y `em` si: es la unica diferencia entre las dos, y es la que decide cual usar.",
    },
  ],
};
