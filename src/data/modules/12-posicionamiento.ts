import type { ModuleData } from "@/types";

export const posicionamientoModule: ModuleData = {
  slug: "posicionamiento",
  title: "Posicionamiento CSS",
  description:
    "Aprende a controlar la posicion de los elementos con position: static, relative, absolute, fixed y sticky, junto con z-index.",
  order: 12,
  dojo: "css" as const,
  category: "intermediate",
  icon: "Move",
  lessons: [
    {
      id: "12-leccion-01",
      title: "Position static y relative",
      content: `## Position static y relative

La propiedad \`position\` determina **como se posiciona un elemento** en la pagina. Por defecto todos los elementos tienen \`position: static\`.

### position: static (por defecto)

El elemento sigue el **flujo normal** del documento. Las propiedades \`top\`, \`right\`, \`bottom\`, \`left\` y \`z-index\` **no tienen efecto**:

\`\`\`css
.normal {
  position: static; /* Valor por defecto, no hace falta escribirlo */
}
\`\`\`

### position: relative

El elemento **permanece en el flujo normal**, pero se puede desplazar respecto a su **posicion original** usando \`top\`, \`right\`, \`bottom\` y \`left\`:

\`\`\`css
.desplazado {
  position: relative;
  top: 20px;    /* Se mueve 20px hacia abajo */
  left: 30px;   /* Se mueve 30px hacia la derecha */
}
\`\`\`

### Caracteristicas clave de relative

- El espacio original del elemento **se conserva** en el flujo (los demas elementos no se mueven)
- El desplazamiento es **visual**, no afecta a otros elementos
- Crea un **contexto de posicionamiento** para hijos con \`position: absolute\`

### Direccion de los desplazamientos

| Propiedad | Valor positivo | Valor negativo |
|-----------|---------------|----------------|
| \`top\` | Mueve hacia abajo | Mueve hacia arriba |
| \`bottom\` | Mueve hacia arriba | Mueve hacia abajo |
| \`left\` | Mueve hacia la derecha | Mueve hacia la izquierda |
| \`right\` | Mueve hacia la izquierda | Mueve hacia la derecha |

> **Nota:** \`top\` y \`bottom\` son opuestos. Si defines ambos, \`top\` tiene prioridad. Lo mismo con \`left\` y \`right\` (gana \`left\`).`,
      codeExample: {
        html: `<div class="caja">Caja normal (static)</div>\n<div class="caja relativa">Caja relative (desplazada 20px abajo y 30px derecha)</div>\n<div class="caja">Caja normal (no se mueve aunque la anterior se desplazo)</div>`,
        css: `.caja {\n  padding: 15px;\n  margin: 10px;\n  background-color: #e0e0e0;\n  border: 2px solid #999;\n}\n.relativa {\n  position: relative;\n  top: 20px;\n  left: 30px;\n  background-color: #cce5ff;\n  border-color: #007bff;\n}`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "12-leccion-02",
      title: "Position absolute",
      content: `## Position absolute

Un elemento con \`position: absolute\` se **saca del flujo normal** del documento. Los demas elementos actuan como si no existiera.

### Como funciona

\`\`\`css
.absoluto {
  position: absolute;
  top: 0;
  right: 0;
}
\`\`\`

El elemento se posiciona respecto al **ancestro posicionado mas cercano** (cualquier ancestro con \`position\` distinto de \`static\`). Si no hay ninguno, se posiciona respecto al \`<html>\`.

### El patron padre relative + hijo absolute

Este es uno de los patrones mas usados en CSS:

\`\`\`css
.contenedor {
  position: relative;  /* Crea contexto de posicionamiento */
}
.badge {
  position: absolute;  /* Se posiciona respecto al contenedor */
  top: -10px;
  right: -10px;
}
\`\`\`

### Caracteristicas de absolute

- El elemento **sale del flujo**: no ocupa espacio
- Se posiciona respecto al **ancestro posicionado** mas cercano
- Puedes usar \`top\`, \`right\`, \`bottom\`, \`left\` para ubicarlo
- Pierde su ancho de bloque: se ajusta al contenido (como un inline)
- Si defines \`top\` y \`bottom\` simultaneamente (o \`left\` y \`right\`), el elemento se **estira**

### Truco: centrado con absolute

\`\`\`css
.centrado {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
\`\`\`

Esto centra el elemento **vertical y horizontalmente** respecto a su contenedor posicionado.

> **Cuidado:** Los elementos absolutos pueden superponerse a otros elementos. Usa \`z-index\` para controlar cual se muestra encima.`,
      codeExample: {
        html: `<div class="contenedor">\n  <div class="badge">3</div>\n  <p>Tarjeta con badge posicionado en la esquina</p>\n</div>`,
        css: `.contenedor {\n  position: relative;\n  padding: 30px;\n  background-color: #f0f0f0;\n  border: 2px solid #ccc;\n  border-radius: 8px;\n  margin: 20px;\n}\n.badge {\n  position: absolute;\n  top: -12px;\n  right: -12px;\n  width: 30px;\n  height: 30px;\n  background-color: tomato;\n  color: white;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-weight: bold;\n  font-size: 14px;\n}`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "12-leccion-03",
      title: "Position fixed y sticky",
      content: `## Position fixed y sticky

### position: fixed

El elemento se posiciona respecto al **viewport** (la ventana del navegador). No se mueve aunque hagas scroll:

\`\`\`css
.barra-superior {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}
\`\`\`

**Usos comunes:**
- Barras de navegacion fijas
- Botones flotantes (como "volver arriba")
- Modales y overlays

**Caracteristicas de fixed:**
- Sale del flujo normal
- Se posiciona respecto al viewport (o al ancestro con \`transform\`, \`filter\` o \`perspective\`)
- No se mueve con el scroll
- Hay que dejar espacio manual (margin/padding en el body) para que no tape contenido

### position: sticky

Es un **hibrido** entre relative y fixed. El elemento se comporta como \`relative\` hasta que alcanza un umbral de scroll, momento en que se "pega" como \`fixed\`:

\`\`\`css
.encabezado {
  position: sticky;
  top: 0;          /* Se pega cuando llega al top del contenedor */
  background: white;
  z-index: 10;
}
\`\`\`

**Caracteristicas de sticky:**
- Permanece en el flujo normal (como relative)
- Se "pega" al alcanzar la posicion definida en \`top\`, \`bottom\`, \`left\` o \`right\`
- Solo funciona dentro de su **contenedor padre** (no se pega mas alla del padre)
- Requiere al menos una propiedad de offset (\`top\`, \`bottom\`, etc.)

### Requisitos para que sticky funcione

1. Debe tener \`top\`, \`bottom\`, \`left\` o \`right\` definido
2. El padre **no debe** tener \`overflow: hidden\` o \`overflow: auto\`
3. El padre debe ser mas alto que el elemento sticky

> **Consejo:** Si \`sticky\` no funciona, revisa que ningun ancestro tenga \`overflow: hidden\` o \`overflow: auto\`.`,
      codeExample: {
        html: `<div class="pagina">\n  <header class="sticky-header">Encabezado sticky (haz scroll)</header>\n  <p>Parrafo 1: Lorem ipsum dolor sit amet consectetur.</p>\n  <p>Parrafo 2: Sed do eiusmod tempor incididunt.</p>\n  <p>Parrafo 3: Ut enim ad minim veniam quis nostrud.</p>\n  <p>Parrafo 4: Duis aute irure dolor in reprehenderit.</p>\n  <p>Parrafo 5: Excepteur sint occaecat cupidatat.</p>\n</div>`,
        css: `.pagina {\n  height: 200px;\n  overflow: auto;\n  border: 2px solid #ccc;\n  padding: 0 15px;\n}\n.sticky-header {\n  position: sticky;\n  top: 0;\n  background-color: steelblue;\n  color: white;\n  padding: 12px 15px;\n  margin: 0 -15px;\n  font-weight: bold;\n  z-index: 10;\n}\np {\n  padding: 15px 0;\n  border-bottom: 1px solid #eee;\n}`,
        editable: true,
      },
      order: 3,
    },
    {
      id: "12-leccion-04",
      title: "z-index y contexto de apilamiento",
      content: `## z-index y contexto de apilamiento

La propiedad \`z-index\` controla el **orden de apilamiento** de los elementos posicionados. Determina cual elemento se muestra encima o debajo de otros.

### Sintaxis

\`\`\`css
.encima {
  position: relative;
  z-index: 10;     /* Numero mayor = mas arriba */
}
.debajo {
  position: relative;
  z-index: 1;      /* Numero menor = mas abajo */
}
\`\`\`

### Reglas fundamentales

1. **Solo funciona en elementos posicionados** (relative, absolute, fixed, sticky)
2. Los valores mas altos se muestran **encima** de los mas bajos
3. Acepta valores **negativos** (\`z-index: -1\`)
4. Sin z-index, los elementos se apilan en **orden del DOM** (los ultimos quedan encima)

### Contexto de apilamiento (stacking context)

Un contexto de apilamiento es un **grupo aislado**. Los z-index dentro de un contexto no compiten con los de otro:

\`\`\`css
.grupo-A {
  position: relative;
  z-index: 1;  /* Crea un contexto de apilamiento */
}
.grupo-A .hijo {
  position: relative;
  z-index: 999; /* Solo compite dentro de grupo-A */
}
.grupo-B {
  position: relative;
  z-index: 2;  /* grupo-B siempre esta encima de grupo-A */
}
\`\`\`

El \`.hijo\` con z-index: 999 nunca se mostrara encima de \`.grupo-B\` porque su contexto padre (\`.grupo-A\`) tiene z-index: 1.

### Que crea un nuevo contexto de apilamiento?

- \`position\` + \`z-index\` (distinto de auto)
- \`opacity\` menor a 1
- \`transform\`, \`filter\`, \`perspective\`
- \`isolation: isolate\`

### Buena practica: escala de z-index

Define una escala organizada para tu proyecto:

\`\`\`css
:root {
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal: 300;
  --z-tooltip: 400;
}
\`\`\`

> **Error comun:** Usar z-index: 9999 no siempre funciona. Si el elemento esta dentro de un contexto de apilamiento con z-index bajo, ningun valor lo sacara de ahi.`,
      codeExample: {
        html: `<div class="capa capa-1">z-index: 1</div>\n<div class="capa capa-2">z-index: 2</div>\n<div class="capa capa-3">z-index: 3</div>`,
        css: `.capa {\n  position: absolute;\n  width: 150px;\n  height: 150px;\n  padding: 10px;\n  font-weight: bold;\n  color: white;\n  border: 2px solid rgba(0,0,0,0.3);\n  border-radius: 8px;\n}\n.capa-1 {\n  z-index: 1;\n  top: 10px;\n  left: 10px;\n  background-color: tomato;\n}\n.capa-2 {\n  z-index: 2;\n  top: 40px;\n  left: 40px;\n  background-color: steelblue;\n}\n.capa-3 {\n  z-index: 3;\n  top: 70px;\n  left: 70px;\n  background-color: seagreen;\n}`,
        editable: true,
      },
      order: 4,
    },
  ],
  exercises: [
    {
      id: "12-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt:
        "Cual es el valor por defecto de la propiedad position?",
      options: [
        { id: "a", text: "relative", isCorrect: false },
        { id: "b", text: "absolute", isCorrect: false },
        { id: "c", text: "static", isCorrect: true },
        { id: "d", text: "fixed", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Es el valor que no permite usar top, right, bottom, left ni z-index.",
      explanation:
        "El valor por defecto es 'static'. En este modo, el elemento sigue el flujo normal del documento y las propiedades top, right, bottom, left y z-index no tienen efecto.",
    },
    {
      id: "12-ej-02",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 2,
      prompt:
        "Arrastra cada valor de position a su descripcion correcta:",
      dragItems: [
        {
          id: "drag-1",
          content: "relative",
          correctZone: "zone-relative",
        },
        {
          id: "drag-2",
          content: "absolute",
          correctZone: "zone-absolute",
        },
        {
          id: "drag-3",
          content: "fixed",
          correctZone: "zone-fixed",
        },
        {
          id: "drag-4",
          content: "sticky",
          correctZone: "zone-sticky",
        },
      ],
      dropZones: [
        {
          id: "zone-relative",
          label: "Se desplaza respecto a su posicion original, sin salir del flujo",
        },
        {
          id: "zone-absolute",
          label: "Sale del flujo y se posiciona respecto al ancestro posicionado",
        },
        {
          id: "zone-fixed",
          label: "Se posiciona respecto al viewport y no se mueve con scroll",
        },
        {
          id: "zone-sticky",
          label: "Hibrido: relative hasta un umbral de scroll, luego se pega",
        },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-relative",
          "drag-2": "zone-absolute",
          "drag-3": "zone-fixed",
          "drag-4": "zone-sticky",
        },
      },
      hint: "Fixed se queda quieto al hacer scroll. Absolute sale del flujo completamente. Sticky se pega en cierto punto. Relative se desplaza pero conserva su espacio.",
      explanation:
        "Relative desplaza visualmente sin salir del flujo. Absolute sale del flujo y se posiciona respecto al ancestro posicionado. Fixed se posiciona respecto al viewport. Sticky combina relative y fixed segun el scroll.",
    },
    {
      id: "12-ej-03",
      type: "code-completion",
      difficulty: 2 ,
      xpReward: 20,
      order: 3,
      prompt:
        "Completa la propiedad del contenedor para que su hijo absoluto se posicione respecto a el, no respecto al viewport:",
      codeTemplate: {
        html: `<div class="contenedor">\n  <div class="hijo">Absoluto</div>\n</div>`,
        cssPrefix: ".contenedor {\n  position: ",
        cssSuffix: ";\n  width: 300px;\n  height: 200px;\n}\n.hijo {\n  position: absolute;\n  top: 0;\n  right: 0;\n}",
        blanks: ["relative"],
      },
      validation: { type: "exact", answer: "relative" },
      hint: "El padre necesita un valor de position que lo convierta en un 'ancestro posicionado' sin sacarlo del flujo.",
      explanation:
        "Al usar position: relative en el contenedor, se crea un contexto de posicionamiento. Los hijos con position: absolute se posicionan respecto a este contenedor en lugar del viewport. Este patron padre-relative/hijo-absolute es uno de los mas usados en CSS.",
    },
    {
      id: "12-ej-04",
      type: "live-editor",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt:
        "Crea un boton flotante fijo en la esquina inferior derecha. Usa position: fixed, bottom: 20px, right: 20px. Dale padding: 15px 20px, background-color: tomato, color: white, border: none y border-radius: 50%.",
      codeTemplate: {
        html: `<button class="btn-flotante">+</button>\n<p>Contenido de la pagina. El boton debe permanecer fijo en la esquina inferior derecha.</p>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".btn-flotante {\n  position: fixed;\n  bottom: 20px;\n  right: 20px;\n  padding: 15px 20px;\n  background-color: tomato;\n  color: white;\n  border: none;\n  border-radius: 50%;\n}",
      validation: {
        type: "includes",
        answer: [
          "position",
          "fixed",
          "bottom",
          "20px",
          "right",
          "border-radius",
          "50%",
        ],
      },
      hint: "Necesitas position: fixed para que el boton no se mueva con el scroll. Usa bottom y right para posicionarlo en la esquina inferior derecha.",
      explanation:
        "Position fixed posiciona el elemento respecto al viewport. Con bottom: 20px y right: 20px, el boton queda a 20px del borde inferior y derecho de la ventana, sin moverse al hacer scroll.",
    },
    {
      id: "12-ej-05",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt:
        "Un elemento tiene position: absolute y esta dentro de un div con position: static, que a su vez esta dentro de un div con position: relative. Respecto a cual se posiciona?",
      options: [
        { id: "a", text: "Respecto al div con position: static", isCorrect: false },
        { id: "b", text: "Respecto al div con position: relative", isCorrect: true },
        { id: "c", text: "Respecto al viewport", isCorrect: false },
        { id: "d", text: "Respecto al body", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Un elemento absoluto busca el ancestro posicionado mas cercano. 'Posicionado' significa que tiene position distinto de static.",
      explanation:
        "Un elemento con position: absolute busca el ancestro posicionado mas cercano (con position diferente de static). El div con static se ignora y sube hasta el div con relative, que es el que sirve como referencia.",
    },
    {
      id: "12-ej-06",
      type: "code-completion",
      difficulty: 2 ,
      xpReward: 20,
      order: 6,
      prompt:
        "Completa la propiedad para crear un encabezado que se pegue al top del contenedor al hacer scroll:",
      codeTemplate: {
        html: `<header class="encabezado">Menu de navegacion</header>`,
        cssPrefix: ".encabezado {\n  position: ",
        cssSuffix: ";\n  top: 0;\n  background: white;\n  padding: 10px;\n  z-index: 100;\n}",
        blanks: ["sticky"],
      },
      validation: { type: "exact", answer: "sticky" },
      hint: "Es el valor que combina el comportamiento de relative y fixed. Se pega al alcanzar cierta posicion de scroll.",
      explanation:
        "Position sticky hace que el encabezado se comporte como relative en su posicion normal, pero cuando el usuario hace scroll y el elemento llega a top: 0, se 'pega' ahi como si fuera fixed.",
    },
    {
      id: "12-ej-07",
      type: "visual-match",
      difficulty: 3 ,
      xpReward: 30,
      order: 7,
      prompt:
        "Crea una tarjeta (clase 'tarjeta') con position: relative, width: 300px, height: 180px, background-color: #f0f0f0, border: 1px solid #ddd, border-radius: 8px y padding: 20px. Dentro, posiciona un badge (clase 'badge') con position: absolute, top: -10px, right: -10px, background-color: #e74c3c, color: white, width: 28px, height: 28px, border-radius: 50%, text-align: center, y line-height: 28px.",
      codeTemplate: {
        html: `<div class="tarjeta">\n  <span class="badge">5</span>\n  <h3>Notificaciones</h3>\n  <p>Tienes mensajes nuevos</p>\n</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".tarjeta {\n  position: relative;\n  width: 300px;\n  height: 180px;\n  background-color: #f0f0f0;\n  border: 1px solid #ddd;\n  border-radius: 8px;\n  padding: 20px;\n}\n.badge {\n  position: absolute;\n  top: -10px;\n  right: -10px;\n  background-color: #e74c3c;\n  color: white;\n  width: 28px;\n  height: 28px;\n  border-radius: 50%;\n  text-align: center;\n  line-height: 28px;\n}",
      validation: {
        type: "includes",
        answer: [
          "position",
          "relative",
          "absolute",
          "top",
          "-10px",
          "right",
          "border-radius",
          "50%",
        ],
      },
      hint: "La tarjeta necesita position: relative para ser el contexto de posicionamiento. El badge usa absolute para salirse de la caja y posicionarse en la esquina.",
      explanation:
        "El patron clasico padre-relative/hijo-absolute permite posicionar el badge en la esquina de la tarjeta. Con top: -10px y right: -10px, el badge se sale parcialmente de la tarjeta creando un efecto de notificacion.",
    },
    {
      id: "12-ej-08",
      type: "quiz",
      difficulty: 3 ,
      xpReward: 30,
      order: 8,
      prompt:
        "Si un elemento con z-index: 999 esta dentro de un padre con z-index: 1, y otro elemento tiene z-index: 2, cual se muestra encima?",
      options: [
        { id: "a", text: "El elemento con z-index: 999", isCorrect: false },
        { id: "b", text: "El elemento con z-index: 2", isCorrect: true },
        { id: "c", text: "Depende del orden en el DOM", isCorrect: false },
        { id: "d", text: "Ambos se muestran al mismo nivel", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Piensa en contextos de apilamiento. El hijo esta limitado por el z-index de su padre.",
      explanation:
        "El z-index: 999 solo aplica dentro del contexto de su padre (z-index: 1). Como el padre tiene z-index: 1 y el otro elemento tiene z-index: 2, este ultimo siempre se mostrara encima, sin importar el z-index del hijo. Los contextos de apilamiento son aislados.",
    },
  ],
};
