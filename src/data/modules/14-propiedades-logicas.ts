import type { ModuleData } from "@/types";

export const propiedadesLogicasModule: ModuleData = {
  slug: "propiedades-logicas",
  title: "Propiedades logicas",
  description:
    "Aprende las propiedades logicas de CSS que se adaptan automaticamente a diferentes modos de escritura e idiomas, reemplazando width/height por inline-size/block-size.",
  order: 14,
  dojo: "css" as const,
  category: "intermediate",
  icon: "ArrowLeftRight",
  lessons: [
    {
      id: "14-leccion-01",
      title: "Por que propiedades logicas?",
      content: `## Por que propiedades logicas?

Las propiedades tradicionales de CSS como \`width\`, \`height\`, \`margin-left\`, \`padding-top\`, etc., son **fisicas**: se refieren a direcciones fijas (arriba, abajo, izquierda, derecha).

Pero no todos los idiomas se escriben de izquierda a derecha y de arriba abajo. Por ejemplo:

- **Arabe y hebreo**: se escriben de **derecha a izquierda** (RTL)
- **Japones tradicional**: se escribe de **arriba a abajo**
- **Mongol**: se escribe de **arriba a abajo, de izquierda a derecha**

### El problema

Si usas propiedades fisicas, tu layout se rompe al cambiar de idioma:

\`\`\`css
/* Esto funciona bien en espanol (LTR) */
.menu {
  margin-left: 20px;  /* Espacio al inicio */
}
/* Pero en arabe (RTL), el inicio esta a la derecha! */
\`\`\`

### La solucion: propiedades logicas

Las propiedades logicas usan conceptos **relativos al flujo de escritura**:

- **Inline**: la direccion en que fluye el texto (horizontal en espanol)
- **Block**: la direccion en que se apilan los bloques (vertical en espanol)
- **Start**: donde empieza el texto (izquierda en espanol, derecha en arabe)
- **End**: donde termina el texto (derecha en espanol, izquierda en arabe)

\`\`\`css
.menu {
  margin-inline-start: 20px; /* Se adapta automaticamente a LTR o RTL */
}
\`\`\`

### Ejes logicos vs fisicos

| Eje logico | En espanol (LTR) | En arabe (RTL) | En japones vertical |
|-----------|------------------|----------------|-------------------|
| inline | Horizontal | Horizontal | Vertical |
| block | Vertical | Vertical | Horizontal |
| inline-start | Izquierda | Derecha | Arriba |
| inline-end | Derecha | Izquierda | Abajo |

> **Buena practica:** Aunque tu sitio solo sea en espanol, usar propiedades logicas es una buena costumbre. Hace tu CSS mas semántico y preparado para el futuro.`,
      codeExample: {
        html: `<div class="ejemplo-ltr" dir="ltr">\n  <div class="caja">Espanol (LTR) - margin-inline-start</div>\n</div>\n<div class="ejemplo-rtl" dir="rtl">\n  <div class="caja">عربي (RTL) - margin-inline-start</div>\n</div>`,
        css: `.ejemplo-ltr, .ejemplo-rtl {\n  background-color: #f0f0f0;\n  padding: 10px;\n  margin-bottom: 10px;\n  border: 1px solid #ddd;\n}\n.caja {\n  margin-inline-start: 30px;\n  padding: 10px;\n  background-color: steelblue;\n  color: white;\n  border-radius: 4px;\n}`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "14-leccion-02",
      title: "inline-size y block-size",
      content: `## inline-size y block-size

Las propiedades logicas \`inline-size\` y \`block-size\` reemplazan a \`width\` y \`height\`:

### Equivalencias (en modo de escritura horizontal)

| Propiedad fisica | Propiedad logica | Descripcion |
|-----------------|-----------------|-------------|
| \`width\` | \`inline-size\` | Tamano en la direccion inline |
| \`height\` | \`block-size\` | Tamano en la direccion block |
| \`min-width\` | \`min-inline-size\` | Tamano minimo inline |
| \`max-width\` | \`max-inline-size\` | Tamano maximo inline |
| \`min-height\` | \`min-block-size\` | Tamano minimo block |
| \`max-height\` | \`max-block-size\` | Tamano maximo block |

### Ejemplo

\`\`\`css
/* Propiedades fisicas */
.tarjeta {
  width: 300px;
  height: 200px;
  max-width: 100%;
}

/* Equivalente con propiedades logicas */
.tarjeta {
  inline-size: 300px;
  block-size: 200px;
  max-inline-size: 100%;
}
\`\`\`

### Con writing-mode

Cuando cambias el modo de escritura, las propiedades logicas se adaptan automaticamente:

\`\`\`css
.vertical {
  writing-mode: vertical-rl;  /* Texto vertical, de derecha a izquierda */
  inline-size: 200px;         /* Ahora define el ALTO (la direccion inline es vertical) */
  block-size: 300px;          /* Ahora define el ANCHO */
}
\`\`\`

### Patron comun: contenedor responsivo logico

\`\`\`css
.contenedor {
  max-inline-size: 1200px;
  margin-inline: auto;  /* Centra en la direccion inline */
  padding-inline: 20px;
}
\`\`\`

> **Nota:** En la mayoria de sitios en espanol, \`inline-size\` se comporta exactamente igual que \`width\` y \`block-size\` igual que \`height\`. La ventaja aparece al cambiar de idioma o modo de escritura.`,
      codeExample: {
        html: `<div class="horizontal">\n  <p>Modo horizontal: inline-size = ancho</p>\n</div>\n<div class="vertical">\n  <p>Modo vertical: inline-size = alto</p>\n</div>`,
        css: `.horizontal {\n  inline-size: 300px;\n  block-size: 80px;\n  padding: 15px;\n  background-color: #d4edda;\n  border: 2px solid #28a745;\n  margin-bottom: 15px;\n}\n.vertical {\n  writing-mode: vertical-rl;\n  inline-size: 150px;\n  block-size: 200px;\n  padding: 15px;\n  background-color: #cce5ff;\n  border: 2px solid #007bff;\n}`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "14-leccion-03",
      title: "margin, padding y border logicos",
      content: `## margin, padding y border logicos

Las propiedades de margin, padding y border tambien tienen equivalentes logicos.

### Margin logico

| Propiedad fisica | Propiedad logica |
|-----------------|-----------------|
| \`margin-top\` | \`margin-block-start\` |
| \`margin-bottom\` | \`margin-block-end\` |
| \`margin-left\` | \`margin-inline-start\` |
| \`margin-right\` | \`margin-inline-end\` |

### Shorthands logicos

CSS ofrece shorthands muy practicos:

\`\`\`css
.elemento {
  /* Shorthand para ambos lados del eje */
  margin-inline: 20px;      /* margin-left + margin-right */
  margin-block: 10px;       /* margin-top + margin-bottom */
  padding-inline: 15px;     /* padding-left + padding-right */
  padding-block: 10px;      /* padding-top + padding-bottom */
}
\`\`\`

Tambien puedes dar dos valores (start y end):

\`\`\`css
.elemento {
  margin-inline: 10px 20px;  /* start: 10px, end: 20px */
  padding-block: 5px 15px;   /* start: 5px, end: 15px */
}
\`\`\`

### Padding logico

Funciona de la misma forma:

\`\`\`css
.tarjeta {
  padding-inline: 20px;       /* Lados horizontales */
  padding-block: 15px 25px;   /* Arriba: 15px, Abajo: 25px */
}
\`\`\`

### Border logico

\`\`\`css
.seccion {
  border-inline-start: 4px solid blue;   /* Borde izquierdo en LTR */
  border-block-end: 1px solid #ddd;      /* Borde inferior en modo horizontal */
}

/* Shorthands */
.caja {
  border-inline: 2px solid red;    /* Bordes izquierdo y derecho */
  border-block: 1px solid gray;    /* Bordes superior e inferior */
}
\`\`\`

### Patron util: centrado con margin-inline

\`\`\`css
.contenedor {
  max-inline-size: 800px;
  margin-inline: auto;    /* Equivalente a margin-left: auto; margin-right: auto */
}
\`\`\`

> **Ventaja clave:** Las propiedades \`margin-inline\` y \`padding-inline\` son shorthands que no existian con las propiedades fisicas. No hay un \`margin-horizontal\` en CSS fisico!`,
      codeExample: {
        html: `<div class="tarjeta-logica">\n  <h3>Tarjeta con propiedades logicas</h3>\n  <p>Usa margin-inline, padding-block y border-inline-start.</p>\n</div>`,
        css: `.tarjeta-logica {\n  max-inline-size: 400px;\n  margin-inline: auto;\n  padding-inline: 25px;\n  padding-block: 20px 30px;\n  border-inline-start: 5px solid steelblue;\n  border-block-end: 2px solid #ccc;\n  background-color: #f8f9fa;\n  border-radius: 4px;\n}`,
        editable: true,
      },
      order: 3,
    },
    {
      id: "14-leccion-04",
      title: "Writing modes",
      content: `## Writing modes

La propiedad \`writing-mode\` define la **direccion del flujo de texto y bloques**. Es la razon por la que existen las propiedades logicas.

### Valores principales

\`\`\`css
.horizontal {
  writing-mode: horizontal-tb; /* Por defecto: horizontal, de arriba a abajo */
}
.vertical-rl {
  writing-mode: vertical-rl;   /* Vertical, de derecha a izquierda (japones) */
}
.vertical-lr {
  writing-mode: vertical-lr;   /* Vertical, de izquierda a derecha (mongol) */
}
\`\`\`

### Como afecta al layout

| writing-mode | Inline (texto) | Block (bloques) |
|-------------|---------------|----------------|
| horizontal-tb | Horizontal (izq a der) | Vertical (arriba a abajo) |
| vertical-rl | Vertical (arriba a abajo) | Horizontal (der a izq) |
| vertical-lr | Vertical (arriba a abajo) | Horizontal (izq a der) |

### Propiedad direction

Complementa a \`writing-mode\` para definir si el texto va de izquierda a derecha o viceversa:

\`\`\`css
.arabe {
  direction: rtl;  /* Right to left */
}
.espanol {
  direction: ltr;  /* Left to right (por defecto) */
}
\`\`\`

> **Mejor practica:** Usa el atributo HTML \`dir="rtl"\` en lugar de la propiedad CSS \`direction\` para indicar la direccion del texto. El atributo HTML es mas semantico y accesible.

### Uso creativo de writing-mode

Puedes usar \`writing-mode\` para efectos visuales interesantes:

\`\`\`css
.titulo-lateral {
  writing-mode: vertical-lr;
  text-orientation: mixed;
  font-size: 24px;
}
\`\`\`

### text-orientation

Controla la orientacion de los caracteres en texto vertical:

\`\`\`css
.vertical {
  writing-mode: vertical-rl;
  text-orientation: mixed;    /* Gira letras latinas, mantiene CJK */
  text-orientation: upright;  /* Todos los caracteres verticales */
  text-orientation: sideways; /* Todos los caracteres girados */
}
\`\`\`

> **Recuerda:** Las propiedades logicas se adaptan automaticamente al writing-mode. Si cambias el modo de escritura, \`inline-size\`, \`margin-inline\`, etc. cambian de eje automaticamente.`,
      codeExample: {
        html: `<div class="contenedor-wm">\n  <div class="modo-h">horizontal-tb (por defecto)</div>\n  <div class="modo-vrl">vertical-rl</div>\n  <div class="modo-vlr">vertical-lr</div>\n</div>`,
        css: `.contenedor-wm {\n  display: flex;\n  gap: 15px;\n  align-items: flex-start;\n}\n.modo-h, .modo-vrl, .modo-vlr {\n  padding: 15px;\n  border: 2px solid;\n  border-radius: 4px;\n  font-size: 14px;\n}\n.modo-h {\n  writing-mode: horizontal-tb;\n  inline-size: 180px;\n  background-color: #d4edda;\n  border-color: #28a745;\n}\n.modo-vrl {\n  writing-mode: vertical-rl;\n  inline-size: 150px;\n  background-color: #cce5ff;\n  border-color: #007bff;\n}\n.modo-vlr {\n  writing-mode: vertical-lr;\n  inline-size: 150px;\n  background-color: #f8d7da;\n  border-color: #dc3545;\n}`,
        editable: true,
      },
      order: 4,
    },
  ],
  exercises: [
    {
      id: "14-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt:
        "Cual es la propiedad logica equivalente a 'width' en CSS?",
      options: [
        { id: "a", text: "block-size", isCorrect: false },
        { id: "b", text: "inline-size", isCorrect: true },
        { id: "c", text: "logical-width", isCorrect: false },
        { id: "d", text: "flow-size", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "En modo de escritura horizontal, el ancho corresponde a la direccion 'inline' (la direccion del texto).",
      explanation:
        "En modo de escritura horizontal (el por defecto en espanol), 'inline-size' es equivalente a 'width' porque la direccion inline es horizontal. Si el writing-mode fuera vertical, inline-size definiria el alto.",
    },
    {
      id: "14-ej-02",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 2,
      prompt:
        "Arrastra cada propiedad fisica a su equivalente logico:",
      dragItems: [
        {
          id: "drag-1",
          content: "margin-left",
          correctZone: "zone-inline-start",
        },
        {
          id: "drag-2",
          content: "margin-top",
          correctZone: "zone-block-start",
        },
        {
          id: "drag-3",
          content: "width",
          correctZone: "zone-inline-size",
        },
        {
          id: "drag-4",
          content: "height",
          correctZone: "zone-block-size",
        },
      ],
      dropZones: [
        { id: "zone-inline-start", label: "margin-inline-start" },
        { id: "zone-block-start", label: "margin-block-start" },
        { id: "zone-inline-size", label: "inline-size" },
        { id: "zone-block-size", label: "block-size" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-inline-start",
          "drag-2": "zone-block-start",
          "drag-3": "zone-inline-size",
          "drag-4": "zone-block-size",
        },
      },
      hint: "En modo horizontal: inline = horizontal (izquierda/derecha/ancho) y block = vertical (arriba/abajo/alto). Start = inicio del flujo.",
      explanation:
        "En escritura horizontal LTR: margin-left = margin-inline-start (inicio de la linea), margin-top = margin-block-start (inicio del bloque), width = inline-size (tamano en direccion del texto), height = block-size (tamano en direccion de los bloques).",
    },
    {
      id: "14-ej-03",
      type: "code-completion",
      difficulty: 2 ,
      xpReward: 20,
      order: 3,
      prompt:
        "Completa la propiedad logica para centrar horizontalmente este contenedor (equivalente a 'margin-left: auto; margin-right: auto'):",
      codeTemplate: {
        html: `<div class="centrado">Contenido centrado</div>`,
        cssPrefix: ".centrado {\n  max-inline-size: 600px;\n  ",
        cssSuffix: ": auto;\n  padding-inline: 20px;\n}",
        blanks: ["margin-inline"],
      },
      validation: { type: "exact", answer: "margin-inline" },
      hint: "Es el shorthand logico que aplica margen a ambos lados del eje inline (izquierda y derecha en modo horizontal).",
      explanation:
        "margin-inline: auto es el equivalente logico de margin-left: auto; margin-right: auto. Es un shorthand que no existe en las propiedades fisicas (no hay 'margin-horizontal') y centra el elemento en la direccion inline.",
    },
    {
      id: "14-ej-04",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt:
        "En un documento con writing-mode: vertical-rl, que dimension controla inline-size?",
      options: [
        { id: "a", text: "El ancho (horizontal)", isCorrect: false },
        { id: "b", text: "El alto (vertical)", isCorrect: true },
        { id: "c", text: "Ambas dimensiones", isCorrect: false },
        { id: "d", text: "Ninguna, no funciona en modo vertical", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "En modo vertical, la direccion 'inline' (del flujo de texto) es vertical, de arriba a abajo.",
      explanation:
        "En writing-mode: vertical-rl, el texto fluye verticalmente (de arriba a abajo). Por lo tanto, la direccion inline es vertical, e inline-size controla el alto del elemento. Block-size controlaria el ancho.",
    },
    {
      id: "14-ej-05",
      type: "live-editor",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt:
        "Crea una tarjeta (clase 'tarjeta') usando solo propiedades logicas: max-inline-size: 400px, margin-inline: auto, padding-inline: 25px, padding-block: 20px, border-inline-start: 4px solid steelblue, y background-color: #f0f4f8.",
      codeTemplate: {
        html: `<div class="tarjeta">\n  <h3>Tarjeta con propiedades logicas</h3>\n  <p>Todo el espaciado usa propiedades logicas en lugar de fisicas.</p>\n</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".tarjeta {\n  max-inline-size: 400px;\n  margin-inline: auto;\n  padding-inline: 25px;\n  padding-block: 20px;\n  border-inline-start: 4px solid steelblue;\n  background-color: #f0f4f8;\n}",
      validation: {
        type: "includes",
        answer: [
          "max-inline-size",
          "400px",
          "margin-inline",
          "auto",
          "padding-inline",
          "padding-block",
          "border-inline-start",
        ],
      },
      hint: "Usa inline-size en lugar de width, margin-inline en lugar de margin-left/right, padding-inline/padding-block en lugar de padding individual.",
      explanation:
        "Esta tarjeta usa exclusivamente propiedades logicas. Si el sitio se traduce a un idioma RTL, el borde decorativo (border-inline-start) automaticamente se movera al lado derecho, y el centrado con margin-inline: auto seguira funcionando correctamente.",
    },
    {
      id: "14-ej-06",
      type: "code-completion",
      difficulty: 1 ,
      xpReward: 10,
      order: 6,
      prompt:
        "Completa la propiedad para agregar padding de 20px a los lados superior e inferior usando la propiedad logica shorthand:",
      codeTemplate: {
        html: `<div class="seccion">Contenido</div>`,
        cssPrefix: ".seccion {\n  ",
        cssSuffix: ": 20px;\n  background-color: #e8f4e8;\n}",
        blanks: ["padding-block"],
      },
      validation: { type: "exact", answer: "padding-block" },
      hint: "En modo horizontal, 'block' se refiere a la direccion vertical (arriba/abajo). El shorthand aplica a ambos lados del eje.",
      explanation:
        "padding-block: 20px aplica 20px de padding tanto arriba (block-start) como abajo (block-end). Es el equivalente logico de 'padding-top: 20px; padding-bottom: 20px'.",
    },
    {
      id: "14-ej-07",
      type: "drag-drop",
      difficulty: 3 ,
      xpReward: 30,
      order: 7,
      prompt:
        "Arrastra cada shorthand logico a lo que reemplaza en modo de escritura horizontal:",
      dragItems: [
        {
          id: "drag-1",
          content: "margin-inline: 10px 20px",
          correctZone: "zone-margin-lr",
        },
        {
          id: "drag-2",
          content: "padding-block: 5px 15px",
          correctZone: "zone-padding-tb",
        },
        {
          id: "drag-3",
          content: "border-inline: 2px solid red",
          correctZone: "zone-border-lr",
        },
      ],
      dropZones: [
        {
          id: "zone-margin-lr",
          label: "margin-left: 10px; margin-right: 20px",
        },
        {
          id: "zone-padding-tb",
          label: "padding-top: 5px; padding-bottom: 15px",
        },
        {
          id: "zone-border-lr",
          label: "border-left: 2px solid red; border-right: 2px solid red",
        },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-margin-lr",
          "drag-2": "zone-padding-tb",
          "drag-3": "zone-border-lr",
        },
      },
      hint: "Inline = horizontal (left/right) y block = vertical (top/bottom) en modo de escritura horizontal. Dos valores = start y end.",
      explanation:
        "En modo horizontal: margin-inline con dos valores define margin-left (start) y margin-right (end). padding-block con dos valores define padding-top (start) y padding-bottom (end). border-inline con un valor aplica el mismo borde a izquierda y derecha.",
    },
    {
      id: "14-ej-08",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 8,
      prompt:
        "Cual es la ventaja principal de usar margin-inline: auto sobre margin-left: auto; margin-right: auto?",
      options: [
        { id: "a", text: "Es mas rapido de renderizar por el navegador", isCorrect: false },
        { id: "b", text: "Es un shorthand mas conciso que se adapta automaticamente a idiomas RTL", isCorrect: true },
        { id: "c", text: "Solo funciona con Flexbox", isCorrect: false },
        { id: "d", text: "No hay ninguna ventaja, es exactamente lo mismo", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Piensa en que pasa cuando cambias de un idioma LTR a un RTL.",
      explanation:
        "margin-inline: auto tiene dos ventajas: 1) Es un shorthand mas conciso (una linea en lugar de dos). 2) Se adapta automaticamente al modo de escritura, funcionando correctamente tanto en idiomas LTR como RTL sin cambios adicionales.",
    },
  ],
};
