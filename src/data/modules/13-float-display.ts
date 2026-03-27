import type { ModuleData } from "@/types";

export const floatDisplayModule: ModuleData = {
  slug: "float-display",
  title: "Float y Display",
  description:
    "Domina float para envolver contenido alrededor de elementos y display para controlar como se comportan los elementos en el layout.",
  order: 13,
  category: "intermediate",
  icon: "LayoutList",
  lessons: [
    {
      id: "13-leccion-01",
      title: "La propiedad float",
      content: `## La propiedad float

La propiedad \`float\` fue originalmente disenada para **envolver texto alrededor de imagenes**, similar a lo que vemos en revistas y periodicos.

### Valores de float

\`\`\`css
.imagen { float: left; }   /* Flota a la izquierda */
.imagen { float: right; }  /* Flota a la derecha */
.imagen { float: none; }   /* Valor por defecto: no flota */
\`\`\`

### Como funciona float

Cuando un elemento flota:

1. Se **saca parcialmente del flujo** normal
2. Se mueve hacia la izquierda o derecha del contenedor
3. El **texto y elementos en linea** lo rodean
4. Los **elementos de bloque** pasan por debajo (ignoran al float)

### Ejemplo clasico: imagen con texto

\`\`\`css
.imagen {
  float: left;
  margin: 0 15px 10px 0; /* Espacio alrededor de la imagen */
}
\`\`\`

### El problema: contenedores colapsados

Cuando **todos los hijos** de un contenedor flotan, el contenedor **colapsa** (su altura se reduce a 0):

\`\`\`css
.contenedor {
  /* Este contenedor tendra altura 0 si sus hijos flotan */
}
.hijo { float: left; }
\`\`\`

### Solucion: clearfix

El patron \`clearfix\` soluciona este problema:

\`\`\`css
.contenedor::after {
  content: "";
  display: table;
  clear: both;
}
\`\`\`

O mas sencillo, usar \`overflow: hidden\` o \`overflow: auto\` en el padre:

\`\`\`css
.contenedor {
  overflow: hidden; /* Fuerza al contenedor a envolver los floats */
}
\`\`\`

> **Nota historica:** Antes de Flexbox y Grid, \`float\` era la tecnica principal para crear layouts de multiples columnas. Hoy se usa principalmente para envolver texto alrededor de imagenes.`,
      codeExample: {
        html: `<div class="articulo">\n  <div class="img-placeholder">IMG</div>\n  <p>Este texto rodea a la imagen flotada a la izquierda. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>\n</div>`,
        css: `.articulo {\n  overflow: hidden;\n  padding: 15px;\n  background-color: #f9f9f9;\n  border: 1px solid #ddd;\n}\n.img-placeholder {\n  float: left;\n  width: 100px;\n  height: 100px;\n  margin: 0 15px 10px 0;\n  background-color: steelblue;\n  color: white;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-weight: bold;\n  border-radius: 4px;\n}`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "13-leccion-02",
      title: "La propiedad clear",
      content: `## La propiedad clear

La propiedad \`clear\` indica que un elemento **no debe estar al lado de un elemento flotado**. Es como decir "empieza debajo de los floats".

### Valores de clear

\`\`\`css
.elemento { clear: left; }   /* No permite floats a su izquierda */
.elemento { clear: right; }  /* No permite floats a su derecha */
.elemento { clear: both; }   /* No permite floats en ningun lado */
.elemento { clear: none; }   /* Valor por defecto */
\`\`\`

### Uso comun: separar secciones

\`\`\`css
.imagen { float: left; }
.siguiente-seccion {
  clear: both;  /* Se coloca debajo de cualquier float */
}
\`\`\`

### Ejemplo practico: layout con floats

\`\`\`css
.columna-izq {
  float: left;
  width: 70%;
}
.columna-der {
  float: right;
  width: 28%;
}
.footer {
  clear: both;  /* El footer aparece debajo de ambas columnas */
}
\`\`\`

### El patron clearfix moderno

Para contenedores con hijos flotados, el clearfix mas utilizado es:

\`\`\`css
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
\`\`\`

Aplicas la clase \`clearfix\` al contenedor padre y automaticamente se expande para envolver a sus hijos flotados.

> **En la practica moderna:** Para layouts de columnas, usa Flexbox o Grid en lugar de floats. Reserva \`float\` para su proposito original: envolver texto alrededor de elementos.`,
      codeExample: {
        html: `<div class="layout clearfix">\n  <div class="col-izq">Columna izquierda (float: left)</div>\n  <div class="col-der">Columna derecha (float: right)</div>\n</div>\n<div class="footer">Footer (clear: both) - aparece debajo de los floats</div>`,
        css: `.layout {\n  background-color: #f0f0f0;\n  padding: 10px;\n}\n.clearfix::after {\n  content: "";\n  display: block;\n  clear: both;\n}\n.col-izq {\n  float: left;\n  width: 65%;\n  padding: 15px;\n  background-color: #d4edda;\n  box-sizing: border-box;\n}\n.col-der {\n  float: right;\n  width: 33%;\n  padding: 15px;\n  background-color: #cce5ff;\n  box-sizing: border-box;\n}\n.footer {\n  clear: both;\n  padding: 15px;\n  background-color: #333;\n  color: white;\n  text-align: center;\n  margin-top: 10px;\n}`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "13-leccion-03",
      title: "La propiedad display",
      content: `## La propiedad display

La propiedad \`display\` es una de las mas importantes de CSS. Controla **como se comporta un elemento** en el layout y **como se distribuyen sus hijos**.

### Valores principales

#### display: block
El elemento ocupa **todo el ancho disponible** y empieza en una nueva linea:

\`\`\`css
div, p, h1, section, article { display: block; } /* Por defecto */
\`\`\`

- Ocupa el 100% del ancho del padre
- Comienza en nueva linea
- Acepta width, height, margin y padding en todas las direcciones

#### display: inline
El elemento ocupa **solo el espacio de su contenido** y no rompe la linea:

\`\`\`css
span, a, strong, em { display: inline; } /* Por defecto */
\`\`\`

- No acepta width ni height
- margin y padding verticales no empujan a otros elementos
- Se mantiene en la misma linea que el texto circundante

#### display: inline-block
Combina lo mejor de ambos: se comporta como **inline** hacia afuera y como **block** hacia adentro:

\`\`\`css
.boton {
  display: inline-block;
  width: 150px;
  height: 40px;
  padding: 10px;
}
\`\`\`

- Se mantiene en la misma linea que otros elementos
- **Si** acepta width, height, margin y padding
- Ideal para botones, badges y chips

### Tabla comparativa

| Caracteristica | block | inline | inline-block |
|---------------|-------|--------|--------------|
| Nueva linea | Si | No | No |
| Acepta width/height | Si | No | Si |
| Acepta margin vertical | Si | No | Si |
| Ocupa todo el ancho | Si | No | No |

> **Consejo:** Puedes cambiar el display de cualquier elemento. Un \`span\` puede ser block y un \`div\` puede ser inline. El display por defecto es solo una sugerencia del navegador.`,
      codeExample: {
        html: `<div class="bloque">Soy display: block (ocupo todo el ancho)</div>\n<span class="en-linea">inline 1</span>\n<span class="en-linea">inline 2</span>\n<span class="en-linea">inline 3</span>\n<br><br>\n<span class="inline-bloque">inline-block 1</span>\n<span class="inline-bloque">inline-block 2</span>`,
        css: `.bloque {\n  display: block;\n  background-color: #d4edda;\n  padding: 10px;\n  margin-bottom: 10px;\n  border: 2px solid #28a745;\n}\n.en-linea {\n  display: inline;\n  background-color: #cce5ff;\n  padding: 5px 10px;\n  border: 2px solid #007bff;\n}\n.inline-bloque {\n  display: inline-block;\n  width: 150px;\n  height: 60px;\n  background-color: #f8d7da;\n  padding: 10px;\n  border: 2px solid #dc3545;\n  text-align: center;\n  vertical-align: top;\n}`,
        editable: true,
      },
      order: 3,
    },
    {
      id: "13-leccion-04",
      title: "display: none, flex y grid",
      content: `## display: none, flex y grid

Ademas de block, inline e inline-block, existen otros valores de display muy importantes.

### display: none

Oculta completamente el elemento. **No ocupa espacio** en el layout, como si no existiera:

\`\`\`css
.oculto {
  display: none;  /* Invisible y sin espacio */
}
\`\`\`

**Diferencia con visibility: hidden:**

\`\`\`css
.invisible {
  visibility: hidden;  /* Invisible PERO conserva su espacio */
}
\`\`\`

| Propiedad | Visible | Ocupa espacio | Accesible |
|-----------|---------|--------------|-----------|
| display: none | No | No | No |
| visibility: hidden | No | Si | No |
| opacity: 0 | No | Si | Si |

### display: flex

Activa el modelo de layout **Flexbox** en el contenedor. Los hijos se distribuyen automaticamente:

\`\`\`css
.contenedor {
  display: flex;
  gap: 10px;             /* Espacio entre hijos */
  justify-content: center; /* Centra horizontalmente */
  align-items: center;     /* Centra verticalmente */
}
\`\`\`

Flexbox es ideal para layouts **unidimensionales** (fila o columna).

### display: grid

Activa el modelo de layout **CSS Grid** en el contenedor. Permite crear layouts **bidimensionales**:

\`\`\`css
.grilla {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;  /* 3 columnas iguales */
  gap: 10px;
}
\`\`\`

Grid es ideal para layouts complejos con **filas y columnas simultaneamente**.

### display: inline-flex e inline-grid

Son las versiones en linea de flex y grid. El contenedor se comporta como inline hacia afuera:

\`\`\`css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
\`\`\`

> **Importante:** Aprenderemos Flexbox y Grid en profundidad en modulos posteriores. Por ahora, lo importante es saber que \`display: flex\` y \`display: grid\` cambian radicalmente como se distribuyen los hijos de un elemento.`,
      codeExample: {
        html: `<div class="flex-demo">\n  <div class="item">1</div>\n  <div class="item">2</div>\n  <div class="item">3</div>\n</div>\n<p class="visible">Soy visible</p>\n<p class="oculto-none">display: none (no me ves)</p>\n<p class="oculto-hidden">visibility: hidden (no me ves pero ocupo espacio)</p>\n<p class="visible">Soy visible tambien</p>`,
        css: `.flex-demo {\n  display: flex;\n  gap: 10px;\n  margin-bottom: 15px;\n}\n.item {\n  background-color: steelblue;\n  color: white;\n  padding: 20px 30px;\n  border-radius: 8px;\n  font-weight: bold;\n  font-size: 18px;\n}\n.visible {\n  background-color: #d4edda;\n  padding: 8px;\n}\n.oculto-none {\n  display: none;\n}\n.oculto-hidden {\n  visibility: hidden;\n  background-color: #f8d7da;\n  padding: 8px;\n}`,
        editable: true,
      },
      order: 4,
    },
  ],
  exercises: [
    {
      id: "13-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt:
        "Para que fue disenada originalmente la propiedad float?",
      options: [
        { id: "a", text: "Para crear layouts de multiples columnas", isCorrect: false },
        { id: "b", text: "Para envolver texto alrededor de imagenes", isCorrect: true },
        { id: "c", text: "Para centrar elementos en la pagina", isCorrect: false },
        { id: "d", text: "Para animar elementos", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Piensa en como se ven las imagenes en una revista o periodico, con texto fluyendo alrededor.",
      explanation:
        "Float fue disenado originalmente para envolver texto alrededor de imagenes, similar al efecto que vemos en revistas impresas. Aunque se uso mucho para layouts de columnas, hoy Flexbox y Grid son mejores opciones para eso.",
    },
    {
      id: "13-ej-02",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 2,
      prompt:
        "Completa la propiedad para que el footer aparezca debajo de todos los elementos flotados:",
      codeTemplate: {
        html: `<div class="col" style="float:left">Columna</div>\n<footer class="pie">Footer</footer>`,
        cssPrefix: ".pie {\n  ",
        cssSuffix: ": both;\n  padding: 10px;\n  background: #333;\n  color: white;\n}",
        blanks: ["clear"],
      },
      validation: { type: "exact", answer: "clear" },
      hint: "Es la propiedad que evita que un elemento este al lado de elementos flotados. Su valor 'both' limpia ambos lados.",
      explanation:
        "La propiedad 'clear: both' indica que el footer no debe tener elementos flotados ni a su izquierda ni a su derecha, forzandolo a aparecer debajo de todos los floats.",
    },
    {
      id: "13-ej-03",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 3,
      prompt:
        "Arrastra cada valor de display a su comportamiento:",
      dragItems: [
        {
          id: "drag-1",
          content: "block",
          correctZone: "zone-block",
        },
        {
          id: "drag-2",
          content: "inline",
          correctZone: "zone-inline",
        },
        {
          id: "drag-3",
          content: "inline-block",
          correctZone: "zone-inline-block",
        },
        {
          id: "drag-4",
          content: "none",
          correctZone: "zone-none",
        },
      ],
      dropZones: [
        {
          id: "zone-block",
          label: "Ocupa todo el ancho, empieza en nueva linea",
        },
        {
          id: "zone-inline",
          label: "Ocupa solo su contenido, no acepta width/height",
        },
        {
          id: "zone-inline-block",
          label: "Se mantiene en linea pero acepta width/height",
        },
        {
          id: "zone-none",
          label: "El elemento desaparece y no ocupa espacio",
        },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-block",
          "drag-2": "zone-inline",
          "drag-3": "zone-inline-block",
          "drag-4": "zone-none",
        },
      },
      hint: "Block es como un div, inline es como un span, inline-block combina ambos, y none oculta totalmente.",
      explanation:
        "Block ocupa todo el ancho y empieza en nueva linea. Inline fluye con el texto y no acepta dimensiones. Inline-block combina ambos: fluye en linea pero acepta width/height. None oculta el elemento completamente.",
    },
    {
      id: "13-ej-04",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 4,
      prompt:
        "Cual es la diferencia principal entre display: none y visibility: hidden?",
      options: [
        { id: "a", text: "No hay diferencia, ambos ocultan el elemento", isCorrect: false },
        { id: "b", text: "display: none quita el espacio; visibility: hidden conserva el espacio", isCorrect: true },
        { id: "c", text: "visibility: hidden quita el espacio; display: none conserva el espacio", isCorrect: false },
        { id: "d", text: "display: none solo funciona en elementos block", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Piensa en que pasa con el espacio que ocupaba el elemento cuando se oculta.",
      explanation:
        "display: none oculta el elemento Y lo saca del flujo (no ocupa espacio, como si no existiera). visibility: hidden oculta el elemento visualmente pero conserva su espacio en el layout (queda un hueco vacio).",
    },
    {
      id: "13-ej-05",
      type: "live-editor",
      difficulty: 2,
      xpReward: 25,
      order: 5,
      prompt:
        "Crea una imagen (clase 'foto') flotada a la izquierda con float: left, width: 120px, height: 120px, margin: 0 15px 10px 0, y background-color: #4682b4. El contenedor (clase 'articulo') debe tener overflow: hidden para envolver el float.",
      codeTemplate: {
        html: `<div class="articulo">\n  <div class="foto"></div>\n  <p>Este texto debe fluir alrededor de la imagen flotada a la izquierda. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.</p>\n</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".articulo {\n  overflow: hidden;\n  padding: 15px;\n  background-color: #f9f9f9;\n}\n.foto {\n  float: left;\n  width: 120px;\n  height: 120px;\n  margin: 0 15px 10px 0;\n  background-color: #4682b4;\n}",
      validation: {
        type: "includes",
        answer: [
          "float",
          "left",
          "width",
          "120px",
          "overflow",
          "hidden",
        ],
      },
      hint: "La imagen necesita float: left y el contenedor necesita overflow: hidden para evitar el colapso del contenedor.",
      explanation:
        "Float: left mueve la imagen a la izquierda y el texto fluye a su alrededor. Overflow: hidden en el contenedor padre es una tecnica para que el contenedor reconozca la altura del elemento flotado y no colapse.",
    },
    {
      id: "13-ej-06",
      type: "code-completion",
      difficulty: 2,
      xpReward: 15,
      order: 6,
      prompt:
        "Completa el valor de display para que estos span acepten width y height pero se mantengan en la misma linea:",
      codeTemplate: {
        html: `<span class="chip">HTML</span>\n<span class="chip">CSS</span>\n<span class="chip">JS</span>`,
        cssPrefix: ".chip {\n  display: ",
        cssSuffix: ";\n  width: 80px;\n  height: 35px;\n  line-height: 35px;\n  text-align: center;\n  background-color: steelblue;\n  color: white;\n  border-radius: 4px;\n}",
        blanks: ["inline-block"],
      },
      validation: { type: "exact", answer: "inline-block" },
      hint: "Necesitas un display que permita dimensiones (como block) pero que no rompa la linea (como inline).",
      explanation:
        "Display inline-block combina lo mejor de ambos mundos: los elementos se mantienen en la misma linea (como inline) pero aceptan width, height y margin/padding completos (como block).",
    },
    {
      id: "13-ej-07",
      type: "visual-match",
      difficulty: 3,
      xpReward: 30,
      order: 7,
      prompt:
        "Crea tres botones (clase 'btn') en la misma linea usando display: inline-block, con padding: 10px 25px, background-color: #007bff, color: white, border: none, border-radius: 4px, margin: 5px, font-size: 14px y cursor: pointer.",
      codeTemplate: {
        html: `<button class="btn">Aceptar</button>\n<button class="btn">Cancelar</button>\n<button class="btn">Ayuda</button>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".btn {\n  display: inline-block;\n  padding: 10px 25px;\n  background-color: #007bff;\n  color: white;\n  border: none;\n  border-radius: 4px;\n  margin: 5px;\n  font-size: 14px;\n  cursor: pointer;\n}",
      validation: {
        type: "includes",
        answer: [
          "display",
          "inline-block",
          "padding",
          "background-color",
          "border",
          "none",
          "border-radius",
          "cursor",
          "pointer",
        ],
      },
      hint: "Usa display: inline-block para que los botones se mantengan en la misma linea pero acepten padding y dimensiones.",
      explanation:
        "Display inline-block es perfecto para botones que deben estar en la misma linea. Cada boton acepta padding, border-radius y margin completos mientras se mantiene al lado de los otros botones.",
    },
    {
      id: "13-ej-08",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 8,
      prompt:
        "Que propiedad se usa hoy en dia en lugar de float para crear layouts de columnas?",
      options: [
        { id: "a", text: "position: absolute", isCorrect: false },
        { id: "b", text: "display: inline", isCorrect: false },
        { id: "c", text: "display: flex o display: grid", isCorrect: true },
        { id: "d", text: "margin: auto", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Son las dos tecnicas modernas de layout que reemplazaron a float para crear columnas y distribuciones complejas.",
      explanation:
        "Flexbox (display: flex) y CSS Grid (display: grid) son las tecnicas modernas para crear layouts. Flexbox es ideal para layouts unidimensionales (fila o columna) y Grid para bidimensionales (filas y columnas a la vez). Float debe reservarse para envolver texto alrededor de elementos.",
    },
  ],
};
