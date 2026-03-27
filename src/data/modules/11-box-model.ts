import type { ModuleData } from "@/types";

export const boxModelModule: ModuleData = {
  slug: "box-model",
  title: "El modelo de caja",
  description:
    "Comprende como funciona el Box Model de CSS: content, padding, border y margin, y como box-sizing cambia el calculo de dimensiones.",
  order: 11,
  category: "intermediate",
  icon: "Box",
  lessons: [
    {
      id: "11-leccion-01",
      title: "Que es el Box Model",
      content: `## Que es el Box Model

En CSS, **cada elemento es una caja rectangular**. El Box Model (modelo de caja) describe las capas que componen esa caja, desde el centro hacia afuera:

1. **Content** (contenido): el texto, imagenes u otros elementos dentro de la caja
2. **Padding** (relleno): espacio transparente entre el contenido y el borde
3. **Border** (borde): la linea que rodea el padding y el contenido
4. **Margin** (margen): espacio transparente fuera del borde, que separa la caja de otros elementos

### Visualizacion

\`\`\`
+---------------------------+
|         MARGIN            |
|  +---------------------+  |
|  |      BORDER         |  |
|  |  +---------------+  |  |
|  |  |   PADDING     |  |  |
|  |  |  +---------+  |  |  |
|  |  |  | CONTENT |  |  |  |
|  |  |  +---------+  |  |  |
|  |  +---------------+  |  |
|  +---------------------+  |
+---------------------------+
\`\`\`

### Cada capa suma al tamano total

Con el comportamiento por defecto (\`box-sizing: content-box\`), el tamano total de una caja se calcula asi:

\`\`\`
Ancho total = width + padding-left + padding-right + border-left + border-right + margin-left + margin-right
Alto total  = height + padding-top + padding-bottom + border-top + border-bottom + margin-top + margin-bottom
\`\`\`

Por ejemplo, si defines:

\`\`\`css
.caja {
  width: 300px;
  padding: 20px;
  border: 5px solid black;
  margin: 10px;
}
\`\`\`

El ancho total ocupado sera: 300 + 20 + 20 + 5 + 5 + 10 + 10 = **370px**

> **Importante:** Puedes inspeccionar el Box Model de cualquier elemento en las DevTools del navegador (pestaña "Computed" o "Calculado").`,
      codeExample: {
        html: `<div class="caja-modelo">Inspecciona esta caja con DevTools</div>`,
        css: `.caja-modelo {\n  width: 300px;\n  height: 150px;\n  padding: 20px;\n  border: 5px solid #333;\n  margin: 15px;\n  background-color: #e0f0ff;\n  color: #333;\n  font-family: sans-serif;\n}`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "11-leccion-02",
      title: "content-box vs border-box",
      content: `## content-box vs border-box

La propiedad \`box-sizing\` cambia **como se calcula** el ancho y alto de un elemento. Tiene dos valores principales:

### content-box (valor por defecto)

\`width\` y \`height\` solo definen el tamano del **contenido**. El padding y el border se suman por fuera:

\`\`\`css
.caja {
  box-sizing: content-box;
  width: 300px;
  padding: 20px;
  border: 5px solid black;
}
/* Ancho visible = 300 + 20*2 + 5*2 = 350px */
\`\`\`

### border-box

\`width\` y \`height\` incluyen el contenido, el padding **y** el border. El tamano visible es exactamente lo que defines:

\`\`\`css
.caja {
  box-sizing: border-box;
  width: 300px;
  padding: 20px;
  border: 5px solid black;
}
/* Ancho visible = 300px (el contenido se reduce a 250px) */
\`\`\`

### Comparacion directa

| Propiedad | content-box | border-box |
|-----------|------------|------------|
| width define... | Solo el contenido | Contenido + padding + border |
| Ancho visible con padding/border | Mayor que width | Igual a width |
| Calculo mental | Mas complejo | Mas intuitivo |

### Buena practica universal

La gran mayoria de proyectos modernos usan este reset al inicio de sus estilos:

\`\`\`css
*, *::before, *::after {
  box-sizing: border-box;
}
\`\`\`

Esto hace que **todos los elementos** usen \`border-box\`, lo cual simplifica enormemente el calculo de layouts.

> **Recuerda:** El \`margin\` nunca se incluye en el calculo de \`box-sizing\`. Siempre se suma por fuera, sin importar si usas content-box o border-box.`,
      codeExample: {
        html: `<div class="content-box">content-box: 300px + padding + border</div>\n<div class="border-box">border-box: 300px total</div>`,
        css: `.content-box {\n  box-sizing: content-box;\n  width: 300px;\n  padding: 20px;\n  border: 5px solid tomato;\n  background-color: #ffe0e0;\n  margin-bottom: 10px;\n}\n.border-box {\n  box-sizing: border-box;\n  width: 300px;\n  padding: 20px;\n  border: 5px solid steelblue;\n  background-color: #e0e8ff;\n}`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "11-leccion-03",
      title: "Interaccion entre width, padding y border",
      content: `## Interaccion entre width, padding y border

Entender como interactuan \`width\`, \`padding\` y \`border\` es clave para evitar sorpresas en tus layouts.

### Problema clasico: elementos que se desbordan

Imagina que tienes un contenedor de 500px y quieres poner dos cajas de 50% lado a lado:

\`\`\`css
.contenedor { width: 500px; }
.mitad {
  width: 50%;       /* = 250px */
  padding: 10px;
  border: 2px solid;
  float: left;
}
\`\`\`

Con \`content-box\`, cada caja ocupa: 250 + 10*2 + 2*2 = **274px**. Dos cajas = 548px. **No caben** en 500px.

Con \`border-box\`, cada caja ocupa exactamente **250px**. Dos cajas = 500px. **Caben perfectamente**.

### Porcentajes y border-box

Cuando usas anchos en porcentaje, \`border-box\` es especialmente valioso:

\`\`\`css
.columna {
  box-sizing: border-box;
  width: 33.33%;
  padding: 15px;
  border: 1px solid #ddd;
}
\`\`\`

Cada columna ocupa exactamente un tercio del padre, sin importar cuanto padding o border tenga.

### Height y overflow

Si defines un \`height\` fijo y el contenido es mas grande, se desborda:

\`\`\`css
.caja {
  height: 100px;
  overflow: hidden;  /* Corta el contenido */
  overflow: auto;    /* Agrega scroll */
  overflow: visible; /* Por defecto: se desborda */
}
\`\`\`

### min-height como alternativa

En general, es mejor usar \`min-height\` para que la caja crezca si el contenido lo necesita:

\`\`\`css
.tarjeta {
  min-height: 200px;  /* Minimo 200px, pero puede crecer */
}
\`\`\`

> **Tip:** Usa las DevTools para inspeccionar el Box Model. Podras ver exactamente cuanto mide cada capa y detectar problemas rapidamente.`,
      codeExample: {
        html: `<div class="contenedor">\n  <div class="mitad izq">50% con border-box</div>\n  <div class="mitad der">50% con border-box</div>\n</div>`,
        css: `.contenedor {\n  width: 400px;\n  background-color: #f0f0f0;\n  overflow: hidden;\n}\n.mitad {\n  box-sizing: border-box;\n  width: 50%;\n  padding: 15px;\n  border: 3px solid;\n  float: left;\n}\n.izq {\n  background-color: #d4edda;\n  border-color: #28a745;\n}\n.der {\n  background-color: #cce5ff;\n  border-color: #007bff;\n}`,
        editable: true,
      },
      order: 3,
    },
    {
      id: "11-leccion-04",
      title: "Outline y su diferencia con border",
      content: `## Outline y su diferencia con border

Existe otra propiedad que dibuja una linea alrededor de un elemento: \`outline\`. Aunque visualmente se parece al \`border\`, tiene diferencias importantes.

### Sintaxis de outline

\`\`\`css
.elemento {
  outline: 3px solid blue;
  outline-offset: 5px;  /* Separa el outline del borde */
}
\`\`\`

### Diferencias clave entre outline y border

| Caracteristica | border | outline |
|---------------|--------|---------|
| Forma parte del Box Model | Si | No |
| Afecta el tamano del elemento | Si | No |
| Puede tener esquinas redondeadas | Si (border-radius) | Depende del navegador |
| Puede ser diferente en cada lado | Si | No |
| Se puede desplazar con offset | No | Si (outline-offset) |

### Por que importa?

El \`outline\` **no ocupa espacio** en el layout. No mueve otros elementos ni cambia las dimensiones de la caja:

\`\`\`css
.boton:focus {
  outline: 3px solid #4a90d9;
  outline-offset: 2px;
}
\`\`\`

### Accesibilidad

El \`outline\` es fundamental para la **accesibilidad**. Cuando un usuario navega con teclado, el outline indica cual elemento tiene el foco:

\`\`\`css
/* NUNCA hagas esto sin una alternativa: */
* { outline: none; }

/* En su lugar, personaliza el outline: */
:focus-visible {
  outline: 2px solid #4a90d9;
  outline-offset: 2px;
}
\`\`\`

> **Accesibilidad:** Siempre asegurate de que los elementos interactivos tengan un indicador de foco visible. Si quitas el outline por defecto, agrega uno personalizado.`,
      codeExample: {
        html: `<div class="con-border">Tengo border (afecta el tamano)</div>\n<div class="con-outline">Tengo outline (no afecta el tamano)</div>\n<button class="boton-accesible">Haz clic o usa Tab</button>`,
        css: `.con-border {\n  width: 250px;\n  padding: 15px;\n  border: 5px solid tomato;\n  margin-bottom: 10px;\n  background-color: #fff5f5;\n}\n.con-outline {\n  width: 250px;\n  padding: 15px;\n  outline: 5px solid steelblue;\n  outline-offset: 3px;\n  margin-bottom: 20px;\n  background-color: #f5f8ff;\n}\n.boton-accesible {\n  padding: 10px 20px;\n  font-size: 16px;\n  cursor: pointer;\n}\n.boton-accesible:focus-visible {\n  outline: 3px solid #4a90d9;\n  outline-offset: 2px;\n}`,
        editable: true,
      },
      order: 4,
    },
  ],
  exercises: [
    {
      id: "11-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt:
        "Cuales son las 4 capas del Box Model, desde el centro hacia afuera?",
      options: [
        { id: "a", text: "content, padding, border, margin", isCorrect: true },
        { id: "b", text: "margin, border, padding, content", isCorrect: false },
        { id: "c", text: "content, border, padding, margin", isCorrect: false },
        { id: "d", text: "padding, content, margin, border", isCorrect: false },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "Piensa desde el contenido hacia afuera: primero el relleno interior, luego la linea del borde, y finalmente el espacio exterior.",
      explanation:
        "El Box Model tiene 4 capas desde adentro hacia afuera: content (contenido), padding (relleno), border (borde) y margin (margen). Este orden es fundamental para calcular el tamano total de un elemento.",
    },
    {
      id: "11-ej-02",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 2,
      prompt:
        "Un elemento tiene width: 200px, padding: 15px, border: 5px solid black, y usa box-sizing: content-box. Cual es su ancho visible (sin contar margin)?",
      options: [
        { id: "a", text: "200px", isCorrect: false },
        { id: "b", text: "230px", isCorrect: false },
        { id: "c", text: "240px", isCorrect: true },
        { id: "d", text: "220px", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Con content-box, suma width + padding de ambos lados + border de ambos lados: 200 + 15*2 + 5*2.",
      explanation:
        "Con content-box, el ancho visible = width + padding-left + padding-right + border-left + border-right = 200 + 15 + 15 + 5 + 5 = 240px. El margin no se cuenta como parte del ancho visible.",
    },
    {
      id: "11-ej-03",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 3,
      prompt:
        "Completa la propiedad para que el width incluya padding y border en el calculo del tamano:",
      codeTemplate: {
        html: `<div class="caja">Contenido</div>`,
        cssPrefix: ".caja {\n  ",
        cssSuffix: ": border-box;\n  width: 300px;\n  padding: 20px;\n  border: 2px solid #333;\n}",
        blanks: ["box-sizing"],
      },
      validation: { type: "exact", answer: "box-sizing" },
      hint: "Es la propiedad que define como se calcula el tamano de la caja. Dos palabras unidas con guion.",
      explanation:
        "La propiedad 'box-sizing: border-box' hace que width y height incluyan el contenido, el padding y el border. Asi el elemento mide exactamente 300px de ancho visible.",
    },
    {
      id: "11-ej-04",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt:
        "Arrastra cada descripcion a la capa correcta del Box Model:",
      dragItems: [
        {
          id: "drag-1",
          content: "El texto e imagenes del elemento",
          correctZone: "zone-content",
        },
        {
          id: "drag-2",
          content: "Espacio transparente entre el contenido y el borde",
          correctZone: "zone-padding",
        },
        {
          id: "drag-3",
          content: "Linea visible que rodea el elemento",
          correctZone: "zone-border",
        },
        {
          id: "drag-4",
          content: "Espacio exterior que separa de otros elementos",
          correctZone: "zone-margin",
        },
      ],
      dropZones: [
        { id: "zone-content", label: "Content" },
        { id: "zone-padding", label: "Padding" },
        { id: "zone-border", label: "Border" },
        { id: "zone-margin", label: "Margin" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-content",
          "drag-2": "zone-padding",
          "drag-3": "zone-border",
          "drag-4": "zone-margin",
        },
      },
      hint: "El padding es el espacio interior (relleno), el border es la linea visible, y el margin es el espacio exterior.",
      explanation:
        "Content es el contenido real (texto, imagenes). Padding es el espacio transparente entre el contenido y el borde. Border es la linea visible que rodea el padding. Margin es el espacio fuera del borde que separa el elemento de sus vecinos.",
    },
    {
      id: "11-ej-05",
      type: "live-editor",
      difficulty: 2,
      xpReward: 25,
      order: 5,
      prompt:
        "Crea una caja con clase 'tarjeta' que use box-sizing: border-box, width: 350px, padding: 25px, border: 3px solid #333, y background-color: #f9f9f9.",
      codeTemplate: {
        html: `<div class="tarjeta">\n  <h3>Mi tarjeta</h3>\n  <p>Esta tarjeta debe medir exactamente 350px de ancho.</p>\n</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".tarjeta {\n  box-sizing: border-box;\n  width: 350px;\n  padding: 25px;\n  border: 3px solid #333;\n  background-color: #f9f9f9;\n}",
      validation: {
        type: "includes",
        answer: [
          "box-sizing",
          "border-box",
          "width",
          "350px",
          "padding",
          "25px",
          "border",
          "solid",
        ],
      },
      hint: "Necesitas box-sizing: border-box para que el ancho total sea 350px, incluyendo el padding y el border.",
      explanation:
        "Con box-sizing: border-box, el ancho total visible de la tarjeta es exactamente 350px. El contenido se reduce automaticamente para dejar espacio al padding (25px * 2) y al border (3px * 2).",
    },
    {
      id: "11-ej-06",
      type: "visual-match",
      difficulty: 3,
      xpReward: 30,
      order: 6,
      prompt:
        "Reproduce el diseno: dos cajas de 50% de ancho lado a lado dentro de un contenedor. Ambas con padding: 15px, border: 2px solid #666 y box-sizing: border-box. La izquierda con background-color: #d4edda y la derecha con background-color: #cce5ff. Usa float: left en ambas.",
      codeTemplate: {
        html: `<div class="contenedor">\n  <div class="mitad izq">Columna izquierda</div>\n  <div class="mitad der">Columna derecha</div>\n</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".contenedor {\n  width: 100%;\n  overflow: hidden;\n}\n.mitad {\n  box-sizing: border-box;\n  width: 50%;\n  padding: 15px;\n  border: 2px solid #666;\n  float: left;\n}\n.izq {\n  background-color: #d4edda;\n}\n.der {\n  background-color: #cce5ff;\n}",
      validation: {
        type: "includes",
        answer: [
          "box-sizing",
          "border-box",
          "width",
          "50%",
          "padding",
          "15px",
          "border",
          "float",
          "left",
        ],
      },
      hint: "La clave es usar box-sizing: border-box para que el padding y border esten incluidos en el 50%. Sin esto, las cajas no caben en una fila.",
      explanation:
        "Gracias a box-sizing: border-box, cada caja de 50% incluye su padding y border dentro de ese 50%. Sin border-box, cada caja ocuparia mas de 50% y no cabrian en la misma fila.",
    },
    {
      id: "11-ej-07",
      type: "code-completion",
      difficulty: 2,
      xpReward: 15,
      order: 7,
      prompt:
        "Completa el reset universal para que todos los elementos y pseudo-elementos usen border-box:",
      codeTemplate: {
        html: `<div class="caja">Contenido</div>`,
        cssPrefix: "*, *::before, *::after {\n  box-sizing: ",
        cssSuffix: ";\n}",
        blanks: ["border-box"],
      },
      validation: { type: "exact", answer: "border-box" },
      hint: "Es el valor que hace que width y height incluyan padding y border.",
      explanation:
        "El reset universal '*, *::before, *::after { box-sizing: border-box; }' es una practica estandar que simplifica el calculo de dimensiones en todo el proyecto. Se usa en practicamente todos los frameworks CSS modernos.",
    },
    {
      id: "11-ej-08",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 8,
      prompt:
        "Cual es la principal diferencia entre outline y border respecto al Box Model?",
      options: [
        { id: "a", text: "El outline solo puede ser de color negro", isCorrect: false },
        { id: "b", text: "El outline no forma parte del Box Model y no afecta las dimensiones", isCorrect: true },
        { id: "c", text: "El border no puede tener esquinas redondeadas", isCorrect: false },
        { id: "d", text: "No hay diferencia, son sinonimos", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Piensa en que propiedad ocupa espacio en el layout y cual no.",
      explanation:
        "El outline NO forma parte del Box Model: no ocupa espacio, no afecta las dimensiones del elemento ni mueve a otros elementos. El border si forma parte del Box Model y suma al tamano total del elemento.",
    },
  ],
};
