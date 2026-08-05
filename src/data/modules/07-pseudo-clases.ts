import type { ModuleData } from "@/types";

export const pseudoClasesModule: ModuleData = {
  slug: "pseudo-clases",
  title: "Pseudo-clases CSS",
  description:
    "Aprende a usar pseudo-clases para aplicar estilos según el estado (:hover, :focus), la posición (:first-child, :nth-child) y las relaciones (:not) de los elementos.",
  order: 9,
  dojo: "css" as const,
  category: "intermediate",
  icon: "MousePointer",
  lessons: [
    {
      id: "07-leccion-01",
      title: "Pseudo-clases de estado",
      content: `## Pseudo-clases de estado

Las **pseudo-clases** permiten aplicar estilos a un elemento cuando se encuentra en un **estado específico**. Se escriben con **dos puntos (:)** después del selector.

### Sintaxis

\`\`\`css
selector:pseudo-clase {
  propiedad: valor;
}
\`\`\`

### :hover - Al pasar el cursor

Se activa cuando el usuario **pasa el cursor** sobre el elemento:

\`\`\`css
.boton:hover {
  background-color: darkblue;
  cursor: pointer;
}
\`\`\`

### :active - Al hacer clic

Se activa en el **momento del clic** (mientras se mantiene presionado):

\`\`\`css
.boton:active {
  background-color: navy;
  transform: scale(0.98);
}
\`\`\`

### :focus - Al recibir foco

Se activa cuando un elemento **recibe el foco** (al hacer clic o con Tab):

\`\`\`css
input:focus {
  border-color: steelblue;
  outline: none;
  box-shadow: 0 0 4px rgba(70, 130, 180, 0.5);
}
\`\`\`

### Orden recomendado: LVHA

Para enlaces, respeta el orden **L**ink, **V**isited, **H**over, **A**ctive:

\`\`\`css
a:link    { color: blue; }
a:visited { color: purple; }
a:hover   { color: red; }
a:active  { color: orange; }
\`\`\`

> **Consejo:** Las pseudo-clases de estado son fundamentales para crear interfaces interactivas. Todo botón deberia tener al menos un estilo :hover para indicar que es clickeable.`,
      codeExample: {
        html: `<button class="boton">Pasa el cursor aqui</button>\n<br><br>\n<input type="text" placeholder="Haz clic para ver :focus">\n<br><br>\n<a href="#" class="enlace">Enlace interactivo</a>`,
        css: `.boton {\n  background-color: steelblue;\n  color: white;\n  border: none;\n  padding: 12px 24px;\n  font-size: 16px;\n  border-radius: 6px;\n  cursor: pointer;\n}\n.boton:hover {\n  background-color: #3a7cbd;\n}\n.boton:active {\n  background-color: #2a5a8a;\n  transform: scale(0.97);\n}\n\ninput:focus {\n  border: 2px solid steelblue;\n  outline: none;\n  padding: 8px;\n  border-radius: 4px;\n}\n\n.enlace:hover {\n  color: tomato;\n  text-decoration: none;\n}`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "07-leccion-02",
      title: "Pseudo-clases de posición",
      content: `## Pseudo-clases de posición

Estas pseudo-clases seleccionan elementos según su **posición** dentro de su elemento padre.

### :first-child y :last-child

Seleccionan el **primer** o **último** hijo de un padre:

\`\`\`css
li:first-child {
  font-weight: bold;
  color: steelblue;
}

li:last-child {
  border-bottom: none;
}
\`\`\`

### :nth-child(n)

Selecciona elementos según su **posición numérica**:

\`\`\`css
/* El tercer elemento */
li:nth-child(3) { color: red; }

/* Todos los elementos pares */
tr:nth-child(even) { background-color: #f2f2f2; }

/* Todos los elementos impares */
tr:nth-child(odd) { background-color: white; }

/* Cada tercer elemento */
li:nth-child(3n) { font-weight: bold; }

/* A partir del segundo, cada dos */
li:nth-child(2n+1) { color: tomato; }
\`\`\`

### Formulas de :nth-child

| Formula | Selecciona |
|---------|-----------|
| \`:nth-child(3)\` | Solo el tercero |
| \`:nth-child(even)\` | Pares (2, 4, 6...) |
| \`:nth-child(odd)\` | Impares (1, 3, 5...) |
| \`:nth-child(3n)\` | Cada 3 (3, 6, 9...) |
| \`:nth-child(n+4)\` | Del cuarto en adelante |
| \`:nth-child(-n+3)\` | Los primeros 3 |

### :first-of-type y :last-of-type

Seleccionan el primer o último elemento **de un tipo específico**:

\`\`\`css
/* El primer parrafo (ignora otros tipos de elementos) */
p:first-of-type {
  font-size: 20px;
}
\`\`\`

La diferencia con \`:first-child\` es que \`:first-of-type\` busca el primero de su tipo, aunque no sea el primer hijo.

> **Atención:** \`:first-child\` requiere que el elemento sea literalmente el primer hijo. Si hay un \`<h2>\` antes del \`<p>\`, entonces \`p:first-child\` NO seleccionara nada, pero \`p:first-of-type\` si.`,
      codeExample: {
        html: `<ul>\n  <li>Primer item (first-child)</li>\n  <li>Segundo item</li>\n  <li>Tercer item</li>\n  <li>Cuarto item</li>\n  <li>Quinto item (last-child)</li>\n</ul>`,
        css: `li {\n  padding: 8px 12px;\n  border-bottom: 1px solid #eee;\n}\n\nli:first-child {\n  font-weight: bold;\n  color: steelblue;\n}\n\nli:last-child {\n  border-bottom: none;\n  color: tomato;\n}\n\nli:nth-child(even) {\n  background-color: #f5f5f5;\n}`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "07-leccion-03",
      title: "Pseudo-clase :not()",
      content: `## Pseudo-clase :not() - Negación

La pseudo-clase **:not()** selecciona elementos que **NO coinciden** con el selector indicado. Es una pseudo-clase de **relación** o **funcional**.

### Sintaxis

\`\`\`css
selector:not(selector-excluido) {
  propiedad: valor;
}
\`\`\`

### Ejemplos prácticos

\`\`\`css
/* Todos los parrafos excepto los de clase "intro" */
p:not(.intro) {
  color: gray;
}

/* Todos los inputs excepto los de tipo submit */
input:not([type="submit"]) {
  border: 1px solid #ccc;
  padding: 8px;
}

/* Todos los li excepto el ultimo */
li:not(:last-child) {
  border-bottom: 1px solid #eee;
}

/* Todos los enlaces excepto los de clase "activo" */
a:not(.activo) {
  opacity: 0.7;
}
\`\`\`

### Combinando :not() con otras pseudo-clases

\`\`\`css
/* Items que no son el primero ni el ultimo */
li:not(:first-child):not(:last-child) {
  color: gray;
}

/* Parrafos que no estan vacios */
p:not(:empty) {
  margin-bottom: 16px;
}
\`\`\`

### Usos comunes

| Patrón | Descripción |
|--------|-----------|
| \`li:not(:last-child)\` | Borde inferior en todos menos el último |
| \`.btn:not(:disabled)\` | Estilos solo si no esta deshabilitado |
| \`input:not(:focus)\` | Estilos cuando NO tiene foco |
| \`*:not(h1):not(h2)\` | Todo excepto h1 y h2 |

> **Consejo:** \`:not()\` es muy útil para evitar escribir reglas de "reset" al final. En lugar de aplicar un estilo a todos y luego quitarlo al último, aplica directamente a todos menos el último.`,
      codeExample: {
        html: `<ul class="lista">\n  <li class="activo">Inicio</li>\n  <li>Productos</li>\n  <li>Servicios</li>\n  <li>Blog</li>\n  <li>Contacto</li>\n</ul>`,
        css: `li {\n  padding: 10px 16px;\n  cursor: pointer;\n}\n\n/* Borde inferior en todos menos el ultimo */\nli:not(:last-child) {\n  border-bottom: 1px solid #e0e0e0;\n}\n\n/* Todos los li excepto el activo en gris */\nli:not(.activo) {\n  color: #666;\n}\n\n/* El activo resaltado */\nli.activo {\n  color: steelblue;\n  font-weight: bold;\n  background-color: #e8f4fd;\n}`,
        editable: true,
      },
      order: 3,
    },
    {
      id: "07-leccion-04",
      title: "Pseudo-clase :has()",
      content: `## Pseudo-clase :has()

Todo lo que viste hasta acá mira **hacia abajo o hacia el costado**: un selector apunta a un elemento y, como mucho, a sus hijos o a sus hermanos. Nunca hacia arriba.

Eso significaba que esta pregunta no tenía respuesta en CSS:

> "Quiero estilar la tarjeta **si** tiene una imagen adentro."

Con lo que sabés hasta ahora es imposible. Podés estilar la imagen dentro de la tarjeta, pero no la tarjeta según lo que contiene. Fue la función más pedida de CSS durante casi veinte años, y \`:has()\` es la respuesta.

### Cómo funciona

\`\`\`css
.tarjeta:has(img) {
  border: 2px solid steelblue;
}
\`\`\`

Se lee: "las tarjetas **que tengan** una img adentro". El estilo se aplica a **\`.tarjeta\`**, no a la imagen. Eso es lo nuevo: el elemento afectado es el de afuera.

Por eso se lo conoce como **el selector del padre**, aunque el nombre engaña un poco: no mira solo hijos directos, mira todo lo que haya adentro.

### Qué se puede poner adentro

Cualquier selector de los que ya conocés, incluidos los combinadores del módulo anterior:

\`\`\`css
/* Un formulario que contenga algún campo inválido */
form:has(input:invalid) { border-color: crimson; }

/* Una etiqueta cuyo checkbox esté marcado */
label:has(input:checked) { font-weight: bold; }

/* Un artículo que tenga un h2 como hijo directo */
article:has(> h2) { padding-top: 0; }

/* Un título seguido inmediatamente por un párrafo */
h2:has(+ p) { margin-bottom: 4px; }
\`\`\`

### Se combina con :not()

Acá es donde se vuelve realmente útil. Recordá que \`:not()\` invierte:

\`\`\`css
/* Tarjetas que NO tienen imagen */
.tarjeta:not(:has(img)) {
  background-color: #f5f5f5;
}
\`\`\`

Eso es "las tarjetas sin imagen", que antes había que resolver agregando una clase a mano en el HTML. Ahora el CSS solo se da cuenta.

### Dos límites que conviene saber

- **No se puede anidar \`:has()\` dentro de otro \`:has()\`.** El navegador lo rechaza.
- **Aplica el estilo al elemento de afuera**, siempre. Si escribís \`.tarjeta:has(img)\` y esperabas que cambiara la imagen, no va a pasar nada: el objetivo es la tarjeta.

> **La idea para llevarse:** \`:has()\` convierte a CSS en un lenguaje que puede reaccionar a su propio contenido. Muchas cosas que antes exigían JavaScript — agregar una clase al padre según lo que tiene adentro — ahora son una línea de CSS.`,
      codeExample: {
        html: `<div class="tarjeta">\n  <img src="https://placehold.co/80x50" alt="Miniatura" />\n  <p>Esta tarjeta tiene imagen</p>\n</div>\n<div class="tarjeta">\n  <p>Esta tarjeta no tiene imagen</p>\n</div>\n<label class="opcion">\n  <input type="checkbox" checked /> Marcada\n</label>\n<label class="opcion">\n  <input type="checkbox" /> Sin marcar\n</label>`,
        css: `.tarjeta {\n  padding: 12px;\n  margin-bottom: 8px;\n  border: 1px solid #ddd;\n  border-radius: 6px;\n}\n\n/* La tarjeta cambia porque CONTIENE una imagen */\n.tarjeta:has(img) {\n  border-color: steelblue;\n  border-width: 2px;\n}\n\n/* Y las que no la contienen, al reves */\n.tarjeta:not(:has(img)) {\n  background-color: #f5f5f5;\n  color: #666;\n}\n\n/* La etiqueta reacciona al estado de su propio checkbox */\n.opcion:has(input:checked) {\n  font-weight: bold;\n  color: seagreen;\n}`,
        editable: true,
      },
      order: 4,
    },
  ],
  exercises: [
    {
      id: "07-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt:
        "¿Qué pseudo-clase se activa cuando el usuario pasa el cursor sobre un elemento?",
      options: [
        { id: "a", text: ":active", isCorrect: false },
        { id: "b", text: ":focus", isCorrect: false },
        { id: "c", text: ":hover", isCorrect: true },
        { id: "d", text: ":visited", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "En ingles, 'hover' significa 'sobrevolar' o 'posarse sobre algo'.",
      explanation:
        "La pseudo-clase :hover se activa cuando el cursor del mouse esta encima del elemento. :active se activa durante el clic, :focus cuando el elemento recibe foco (teclado o clic), y :visited para enlaces ya visitados.",
    },
    {
      id: "07-ej-02",
      type: "code-completion",
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt:
        "Completa la pseudo-clase para que el botón cambie de color al pasar el cursor:",
      codeTemplate: {
        html: `<button class="btn">Hover me</button>`,
        cssPrefix: `.btn {\n  background: steelblue;\n  color: white;\n  padding: 10px 20px;\n  border: none;\n}\n\n.btn`,
        cssSuffix: ` {\n  background: darkblue;\n}`,
        blanks: [":hover"],
      },
      validation: { type: "exact", answer: ":hover" },
      hint: "La pseudo-clase se escribe con dos puntos (:) seguido del nombre del estado.",
      explanation:
        "La pseudo-clase ':hover' se añade al selector para aplicar estilos cuando el cursor esta sobre el elemento. La sintaxis es selector:hover { ... }.",
    },
    {
      id: "07-ej-03",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 3,
      prompt:
        "¿Cuál es la diferencia entre li:first-child y li:first-of-type?",
      options: [
        {
          id: "a",
          text: "No hay diferencia, son identicos",
          isCorrect: false,
        },
        {
          id: "b",
          text: ":first-child requiere que sea el primer hijo del padre; :first-of-type busca el primer <li> aunque haya otros elementos antes",
          isCorrect: true,
        },
        {
          id: "c",
          text: ":first-of-type solo funciona con clases",
          isCorrect: false,
        },
        {
          id: "d",
          text: ":first-child selecciona todos los primeros, :first-of-type solo uno",
          isCorrect: false,
        },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Piensa en que pasa si antes del <li> hay un <h2>. Uno de los selectores fallaria y el otro no.",
      explanation:
        "li:first-child solo funciona si el <li> es literalmente el primer hijo de su padre. li:first-of-type selecciona el primer <li> sin importar si hay otros tipos de elementos antes. Esta diferencia es clave.",
    },
    {
      id: "07-ej-04",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt:
        "Arrastra cada pseudo-clase a su categoría correspondiente:",
      dragItems: [
        { id: "drag-1", content: ":hover", correctZone: "zone-estado" },
        { id: "drag-2", content: ":first-child", correctZone: "zone-posicion" },
        { id: "drag-3", content: ":focus", correctZone: "zone-estado" },
        { id: "drag-4", content: ":nth-child(2)", correctZone: "zone-posicion" },
        { id: "drag-5", content: ":not(.clase)", correctZone: "zone-relacion" },
        { id: "drag-6", content: ":active", correctZone: "zone-estado" },
      ],
      dropZones: [
        { id: "zone-estado", label: "Estado (interacción)" },
        { id: "zone-posicion", label: "Posición (estructura)" },
        { id: "zone-relacion", label: "Relación (negación)" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-estado",
          "drag-2": "zone-posicion",
          "drag-3": "zone-estado",
          "drag-4": "zone-posicion",
          "drag-5": "zone-relacion",
          "drag-6": "zone-estado",
        },
      },
      hint: ":hover, :focus y :active dependen de la interacción del usuario. :first-child y :nth-child dependen de la posición en el DOM. :not() es una pseudo-clase funcional de negación.",
      explanation:
        "Las pseudo-clases de estado (:hover, :focus, :active) dependen de la interacción del usuario. Las de posición (:first-child, :nth-child) dependen de la ubicación en el DOM. :not() es una pseudo-clase de relación que permite excluir elementos.",
    },
    {
      id: "07-ej-05",
      type: "code-completion",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt:
        "Completa el selector para aplicar un fondo gris a las filas pares de una tabla:",
      codeTemplate: {
        html: `<table>\n  <tr><td>Fila 1</td></tr>\n  <tr><td>Fila 2</td></tr>\n  <tr><td>Fila 3</td></tr>\n  <tr><td>Fila 4</td></tr>\n</table>`,
        cssPrefix: "tr",
        cssSuffix: " {\n  background-color: #f2f2f2;\n}",
        blanks: [":nth-child(even)"],
      },
      validation: { type: "exact", answer: ":nth-child(even)" },
      hint: "Necesitas la pseudo-clase :nth-child con la palabra clave para números pares (2, 4, 6...).",
      explanation:
        "El selector 'tr:nth-child(even)' selecciona todas las filas pares. La palabra clave 'even' equivale a '2n'. También existe 'odd' para las impares.",
    },
    {
      id: "07-ej-06",
      type: "live-editor",
      difficulty: 2 ,
      xpReward: 20,
      order: 6,
      prompt:
        "Escribe CSS para que: 1) Los enlaces cambien a color tomato al pasar el cursor (:hover). 2) El primer <li> de la lista tenga font-weight: bold.",
      codeTemplate: {
        html: `<ul>\n  <li><a href="#">Primer enlace</a></li>\n  <li><a href="#">Segundo enlace</a></li>\n  <li><a href="#">Tercer enlace</a></li>\n</ul>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        "a:hover {\n  color: tomato;\n}\n\nli:first-child {\n  font-weight: bold;\n}",
      validation: {
        // Graded by parsing `targetCSS` into selector -> declarations, not by
        // searching the submission for loose words. See src/lib/cssRules.ts.
        type: "css-rules",
      },
      hint: "Necesitas dos reglas: una con a:hover para el color del enlace y otra con li:first-child para la negrita del primer item.",
      explanation:
        "La regla 'a:hover { color: tomato; }' cambia el color de los enlaces al pasar el cursor. La regla 'li:first-child { font-weight: bold; }' aplica negrita al primer <li> de la lista.",
    },
    {
      id: "07-ej-07",
      type: "quiz",
      difficulty: 3 ,
      xpReward: 30,
      order: 7,
      prompt:
        "¿Qué selecciona el selector li:not(:last-child)?",
      options: [
        { id: "a", text: "Solo el último <li>", isCorrect: false },
        {
          id: "b",
          text: "Todos los <li> excepto el último",
          isCorrect: true,
        },
        { id: "c", text: "Solo el primer <li>", isCorrect: false },
        { id: "d", text: "Ningun <li>", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: ":not() excluye lo que esta dentro del paréntesis. :last-child es el último hijo.",
      explanation:
        "El selector 'li:not(:last-child)' selecciona todos los <li> que NO son el último hijo. Es muy útil para poner separadores (bordes) entre items sin que aparezca uno extra al final.",
    },
    {
      id: "07-ej-08",
      type: "visual-match",
      difficulty: 3 ,
      xpReward: 30,
      order: 8,
      prompt:
        "Reproduce el diseño: una lista donde las filas pares tienen background #f5f5f5, el primer item tiene color steelblue y font-weight bold, y todos los items excepto el último tienen border-bottom: 1px solid #ddd. Cada li debe tener padding: 10px.",
      codeTemplate: {
        html: `<ul class="lista">\n  <li>Elemento uno</li>\n  <li>Elemento dos</li>\n  <li>Elemento tres</li>\n  <li>Elemento cuatro</li>\n  <li>Elemento cinco</li>\n</ul>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".lista li {\n  padding: 10px;\n}\n\n.lista li:nth-child(even) {\n  background: #f5f5f5;\n}\n\n.lista li:first-child {\n  color: steelblue;\n  font-weight: bold;\n}\n\n.lista li:not(:last-child) {\n  border-bottom: 1px solid #ddd;\n}",
      validation: {
        // Graded by parsing `targetCSS` into selector -> declarations, not by
        // searching the submission for loose words. See src/lib/cssRules.ts.
        type: "css-rules",
      },
      hint: "Necesitas 4 reglas: padding general, :nth-child(even) para fondo alterno, :first-child para el primero, y :not(:last-child) para los bordes.",
      explanation:
        "Se combinan varias pseudo-clases: :nth-child(even) para filas alternas, :first-child para destacar el primer item, y :not(:last-child) para poner bordes en todos menos el último.",
    },
    {
      id: "07-ej-09",
      type: "quiz",
      difficulty: 2,
      xpReward: 15,
      order: 9,
      prompt:
        "Escribis .tarjeta:has(img) { border-color: red; }. ¿A que elemento se le aplica el borde rojo?",
      options: [
        { id: "a", text: "A la imagen que esta dentro de la tarjeta", isCorrect: false },
        { id: "b", text: "A la tarjeta que contiene una imagen", isCorrect: true },
        { id: "c", text: "A la tarjeta y a la imagen, a las dos", isCorrect: false },
        { id: "d", text: "A las tarjetas que NO tienen imagen", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "El estilo siempre se aplica al elemento que esta ANTES de :has(). Lo que va entre paréntesis es solo la condición.",
      explanation:
        "El objetivo es el elemento de afuera: la tarjeta. Lo que va dentro de :has() es la condición que debe cumplirse, no el elemento a estilar. Por eso se lo llama el selector del padre.",
    },
    {
      id: "07-ej-10",
      type: "live-editor",
      difficulty: 3,
      xpReward: 25,
      order: 10,
      prompt:
        "Usa :has() para que el CSS reaccione al contenido. Regla 1: a las tarjetas con clase 'tarjeta' que contengan una img, dales border-color: steelblue. Regla 2: a las que NO contengan img, dales background-color: whitesmoke. Regla 3: a las etiquetas con clase 'opción' que contengan un input marcado, dales font-weight: bold.",
      codeTemplate: {
        html: `<div class="tarjeta">\n  <img src="https://placehold.co/60x40" alt="Miniatura" />\n  <p>Con imagen</p>\n</div>\n<div class="tarjeta">\n  <p>Sin imagen</p>\n</div>\n<label class="opcion"><input type="checkbox" checked /> Marcada</label>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".tarjeta:has(img) {\n  border-color: steelblue;\n}\n.tarjeta:not(:has(img)) {\n  background-color: whitesmoke;\n}\n.opcion:has(input:checked) {\n  font-weight: bold;\n}",
      validation: {
        // Graded by parsing `targetCSS` into selector -> declarations, not by
        // searching the submission for loose words. See src/lib/cssRules.ts.
        type: "css-rules",
      },
      hint: "Para la negación, envolve el :has() completo dentro de :not(). Para el checkbox marcado, adentro de :has() va input:checked.",
      explanation:
        "Las tres reglas apuntan al elemento de afuera y usan el contenido como condición. La segunda combina :not() con :has() para expresar 'las que no contienen imagen', algo que antes exigia agregar una clase a mano en el HTML.",
    },
  ],
};
