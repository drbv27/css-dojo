import type { ModuleData } from "@/types";

export const listsAndTablesModule: ModuleData = {
  slug: "lists-and-tables",
  title: "Listas y tablas",
  description:
    "Dale forma a las listas y a las tablas: viñetas, numeraciones, bordes que no se duplican, anchos de columna y la tabla que sobrevive en un teléfono.",
  order: 20,
  dojo: "css" as const,
  nivel: "profundizacion",
  category: "css-visual",
  icon: "Table",
  lessons: [
    {
      id: "29-leccion-01",
      title: "Listas: la viñeta y su lugar",
      content: `## Tres propiedades y una abreviada

Una lista trae viñeta por defecto, y CSS te deja cambiar tres cosas de ella.

### list-style-type: qué viñeta

\`\`\`css
.habilidades {
  list-style-type: square;
}
\`\`\`

| Valor | Se ve |
|-------|-------|
| \`disc\` | Círculo lleno, el que viene por defecto |
| \`circle\` | Círculo vacío |
| \`square\` | Cuadradito |
| \`decimal\` | 1. 2. 3. |
| \`lower-alpha\` | a. b. c. |
| \`upper-roman\` | I. II. III. |
| \`none\` | Sin viñeta |

Fijate que \`decimal\` y compañía funcionan en una \`<ul>\` también: la etiqueta decide el **significado** (una lista ordenada o no), el CSS decide **cómo se ve**. Son dos preguntas distintas y conviene no mezclarlas.

### list-style-position: adentro o afuera

Esta es la que casi nadie conoce y la que arregla un desalineado que vas a ver seguido:

\`\`\`css
.lista {
  list-style-position: outside;  /* por defecto */
}
\`\`\`

Con \`outside\`, la viñeta cuelga **por fuera** de la caja del \`<li>\`. Con \`inside\`, entra adentro y el texto de la segunda línea arranca **debajo de la viñeta** en lugar de alinearse con la primera línea de texto.

La diferencia se nota solo cuando un ítem ocupa más de una línea. Y ahí \`outside\` casi siempre se lee mejor, porque el bloque de texto queda parejo.

Lo que sí importa saber: con \`outside\` la viñeta puede quedar **fuera del área visible** si el contenedor tiene \`overflow: hidden\` o si el \`padding-left\` es cero. Cuando "desaparecieron las viñetas", esto es lo primero que hay que mirar.

### list-style-image: una imagen como viñeta

\`\`\`css
.checklist {
  list-style-image: url("tilde.svg");
}
\`\`\`

Funciona, pero tiene poco control: no podés cambiarle el tamaño ni la posición. Por eso en la práctica casi siempre se resuelve con \`::marker\`, que es la lección siguiente.

### La forma abreviada

\`\`\`css
.lista {
  list-style: square inside;
}
\`\`\`

Acepta las tres partes en cualquier orden: tipo, posición e imagen. Y \`list-style: none\` es la forma corta de sacar la viñeta, que es lo que se usa para un menú de navegación hecho con \`<ul>\`.`,
      codeExample: {
        html: `<ul class="cuadrados">\n  <li>Un item corto</li>\n  <li>Un item bastante mas largo que ocupa mas de una linea para que se vea la diferencia</li>\n</ul>\n<ul class="adentro">\n  <li>Un item corto</li>\n  <li>Un item bastante mas largo que ocupa mas de una linea para que se vea la diferencia</li>\n</ul>`,
        css: `.cuadrados {\n  list-style: square outside;\n  max-width: 320px;\n}\n\n.adentro {\n  list-style: square inside;\n  max-width: 320px;\n}`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "29-leccion-02",
      title: "::marker: darle estilo a la viñeta misma",
      content: `## El pseudo-elemento que faltaba

Durante años la viñeta fue intocable: podías elegir cuál, no cómo se veía. Si querías una viñeta violeta con el texto negro, había que sacar la viñeta y falsificarla con \`::before\`.

\`::marker\` resolvió eso:

\`\`\`css
.habilidades li::marker {
  color: #8b5cf6;
  font-size: 1.2em;
}
\`\`\`

Viñeta violeta, texto sin tocar. Una regla.

## Lo que acepta y lo que no

Y acá está el detalle que importa, porque es una limitación real y no un olvido: \`::marker\` **solo acepta unas pocas propiedades**. Las principales:

- \`color\`
- \`font-size\`, \`font-family\`, \`font-weight\` y el resto de las de fuente
- \`content\`

Lo que **no** acepta, y es lo que más se intenta: \`background-color\`, \`padding\`, \`margin\`, \`width\`. No es que no funcione bien, es que el navegador las ignora. Si necesitás una viñeta con fondo o con tamaño de caja propio, ahí sí volvés al \`::before\`.

## content: cambiar la viñeta por lo que quieras

\`\`\`css
.checklist li::marker {
  content: "✓ ";
  color: #27ae60;
}
\`\`\`

Eso te da una lista de tildes verdes sin una imagen y sin tocar el HTML. Es el caso que reemplaza a \`list-style-image\` en la práctica, porque acá sí podés controlar color y tamaño.

Y con \`content\` podés incluso variar según la posición, combinándolo con lo que ya sabés de pseudo-clases:

\`\`\`css
.pasos li:first-child::marker {
  content: "→ ";
}
\`\`\`

## Cuándo NO usarlo

Si la lista es un menú de navegación, no le pongas estilo a la viñeta: sacala con \`list-style: none\`. La viñeta ahí no comunica nada, es ruido heredado de que un menú se marca como lista por razones de significado, no de diseño.`,
      codeExample: {
        html: `<ul class="habilidades">\n  <li>HTML semantico</li>\n  <li>CSS moderno</li>\n</ul>\n<ul class="checklist">\n  <li>Perfil escrito</li>\n  <li>Experiencia cargada</li>\n</ul>`,
        css: `.habilidades li::marker {\n  color: #8b5cf6;\n  font-size: 1.3em;\n}\n\n.checklist {\n  list-style-type: none;\n}\n\n.checklist li::marker {\n  content: "✓ ";\n  color: #27ae60;\n}`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "29-leccion-03",
      title: "Tablas: bordes que no se duplican y columnas que obedecen",
      content: `## El problema de los bordes dobles

Escribí una tabla con bordes y mirá lo que pasa:

\`\`\`css
table, th, td {
  border: 1px solid #ccc;
}
\`\`\`

Entre dos celdas vecinas hay **dos** bordes de 1px pegados, así que la línea del medio se ve del doble de gruesa que la del borde exterior. Queda sucio y es lo primero que delata una tabla sin trabajar.

### border-collapse

\`\`\`css
table {
  border-collapse: collapse;
}
\`\`\`

Eso fusiona los bordes vecinos en uno solo. Es la primera línea que se escribe en cualquier tabla, y con eso ya se ve mil veces mejor.

El otro valor es \`separate\`, que es el que viene por defecto y el que causa el problema. Pero tiene su uso, porque habilita la propiedad siguiente.

### border-spacing: separar las celdas a propósito

\`\`\`css
table {
  border-collapse: separate;
  border-spacing: 8px;
}
\`\`\`

Con \`separate\` las celdas tienen espacio entre ellas, y \`border-spacing\` decide cuánto. Acepta dos valores, horizontal y vertical:

\`\`\`css
table {
  border-spacing: 12px 4px;
}
\`\`\`

**Ojo con esto:** \`border-spacing\` solo funciona con \`separate\`. Con \`collapse\` se ignora, porque si los bordes están fusionados no hay espacio que repartir. Las dos propiedades son excluyentes por definición, no por capricho.

Y \`border-spacing\` **no es** \`padding\`: el padding es el aire adentro de la celda, el spacing es el aire entre celdas.

## Anchos de columna

El ancho se pone en la **primera fila** y el resto lo hereda:

\`\`\`css
th:first-child {
  width: 40%;
}
\`\`\`

Pero por defecto el navegador reparte el ancho **según el contenido**: una celda con texto largo se lleva más. Eso a veces conviene y a veces no.

Para que obedezca lo que le pedís:

\`\`\`css
table {
  table-layout: fixed;
  width: 100%;
}
\`\`\`

Con \`fixed\`, el navegador usa los anchos de la primera fila y no mira el contenido. La tabla se dibuja más rápido y, sobre todo, **las columnas dejan de moverse** cuando cambia el texto. Para una tabla de datos con anchos pensados, es lo correcto.

## La alineación

\`text-align\` se hereda por columna si lo aplicás al \`th\`, y hay una convención que conviene seguir: **texto a la izquierda, números a la derecha.** Los números alineados a la derecha se comparan de un vistazo porque las unidades quedan una debajo de la otra.`,
      codeExample: {
        html: `<table class="datos">\n  <thead>\n    <tr><th>Tecnologia</th><th>Anios</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>HTML y CSS</td><td>3</td></tr>\n    <tr><td>JavaScript</td><td>2</td></tr>\n  </tbody>\n</table>`,
        css: `.datos {\n  border-collapse: collapse;\n  table-layout: fixed;\n  width: 100%;\n}\n\n.datos th,\n.datos td {\n  border: 1px solid #ccc;\n  padding: 10px;\n}\n\n.datos th {\n  background-color: #f5f0ff;\n  text-align: left;\n}\n\n.datos th:last-child,\n.datos td:last-child {\n  width: 30%;\n  text-align: right;\n}`,
        editable: true,
      },
      order: 3,
    },
    {
      id: "29-leccion-04",
      title: "La tabla en un teléfono, y la del CV de Ana",
      content: `## El problema

Una tabla de cinco columnas no cabe en 360px de ancho. Y no hay forma de que quepa: una tabla es una cuadrícula de datos donde cada columna significa algo, así que apretarla hasta que entre la vuelve ilegible.

Lo que **no** hay que hacer es dejar que desborde y se salga de la pantalla. Eso rompe el layout de toda la página: aparece una barra de scroll horizontal en el documento entero y el usuario termina moviendo el sitio completo para leer una celda.

## La solución: un envoltorio con scroll propio

\`\`\`html
<div class="tabla-scroll">
  <table class="datos">
    ...
  </table>
</div>
\`\`\`

\`\`\`css
.tabla-scroll {
  overflow-x: auto;
}

.datos {
  min-width: 480px;
}
\`\`\`

Dos reglas y tres decisiones:

**El envoltorio, y no la tabla.** El scroll va en el \`div\` de afuera. Una tabla es un elemento con layout propio y no se comporta como una caja normal para esto; el envoltorio sí. Es la razón por la que este patrón siempre lleva un \`div\` de más.

**\`auto\` y no \`scroll\`.** Con \`auto\` la barra aparece solo si hace falta. Con \`scroll\` está siempre, incluso en un monitor donde la tabla entra de sobra.

**El \`min-width\` en la tabla es lo que hace que funcione.** Sin él la tabla se encoge hasta caber, las columnas se aprietan y nunca hay desborde que scrollear. Ese ancho mínimo es el que dice "por debajo de acá, mejor scroll que apretujado". Es la misma idea que viste en el recorte de texto: el desborde tiene que existir para poder manejarlo.

## La tabla de habilidades del CV de Ana

En el CV hay una tabla de tecnologías y años de experiencia. Con todo lo del módulo:

\`\`\`css
.tabla-scroll {
  overflow-x: auto;
}

.habilidades-tabla {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
  min-width: 420px;
}

.habilidades-tabla th,
.habilidades-tabla td {
  border-bottom: 1px solid #e0e0e0;
  padding: 12px;
  text-align: left;
}

.habilidades-tabla td:last-child {
  text-align: right;
}
\`\`\`

Fijate que el borde es solo \`border-bottom\` y no un borde completo. Una tabla de datos se lee mejor con líneas horizontales solamente: las verticales son ruido, porque las columnas ya se distinguen por la alineación y el espacio.

## Lo que conviene que te lleves

Las tres cosas que hacen que una tabla se vea trabajada, en orden de cuánto rinden:

1. \`border-collapse: collapse\`, siempre.
2. Padding generoso en las celdas. Una tabla apretada se lee mal aunque los bordes estén perfectos.
3. Solo líneas horizontales, y números a la derecha.

Y para el móvil, el envoltorio con \`overflow-x: auto\` más un \`min-width\` en la tabla.`,
      codeExample: {
        html: `<div class="tabla-scroll">\n  <table class="habilidades-tabla">\n    <thead>\n      <tr><th>Tecnologia</th><th>Nivel</th><th>Anios</th></tr>\n    </thead>\n    <tbody>\n      <tr><td>HTML semantico</td><td>Avanzado</td><td>3</td></tr>\n      <tr><td>CSS moderno</td><td>Avanzado</td><td>3</td></tr>\n      <tr><td>JavaScript</td><td>Intermedio</td><td>2</td></tr>\n    </tbody>\n  </table>\n</div>`,
        css: `.tabla-scroll {\n  overflow-x: auto;\n}\n\n.habilidades-tabla {\n  border-collapse: collapse;\n  table-layout: fixed;\n  width: 100%;\n  min-width: 420px;\n}\n\n.habilidades-tabla th,\n.habilidades-tabla td {\n  border-bottom: 1px solid #e0e0e0;\n  padding: 12px;\n  text-align: left;\n}\n\n.habilidades-tabla th {\n  background-color: #f5f0ff;\n}\n\n.habilidades-tabla td:last-child,\n.habilidades-tabla th:last-child {\n  text-align: right;\n}`,
        editable: true,
      },
      order: 4,
    },
  ],
  exercises: [
    {
      id: "29-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt:
        "¿Qué problema resuelve border-collapse: collapse en una tabla con bordes?",
      options: [
        {
          id: "a",
          text: "Los bordes de dos celdas vecinas se fusionan en uno, así la línea del medio no queda del doble de gruesa",
          isCorrect: true,
        },
        { id: "b", text: "Agrega espacio entre las celdas para que respiren", isCorrect: false },
        { id: "c", text: "Hace que la tabla ocupe todo el ancho disponible", isCorrect: false },
        { id: "d", text: "Reparte el ancho de las columnas en partes iguales", isCorrect: false },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "Pensá en lo que pasa entre dos celdas: cada una pone su propio borde de 1px, y quedan pegados.",
      explanation:
        "Con el valor separate, que es el que viene por defecto, cada celda dibuja su propio borde. Entre dos celdas vecinas quedan dos bordes de 1px pegados, así que la línea interior se ve del doble de gruesa que la exterior. Con collapse los bordes vecinos se fusionan en uno solo.",
    },
    {
      id: "29-ej-02",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 2,
      prompt: "Arrastrá cada valor de list-style-type a lo que dibuja:",
      dragItems: [
        { id: "drag-1", content: "disc", correctZone: "zone-lleno" },
        { id: "drag-2", content: "circle", correctZone: "zone-vacio" },
        { id: "drag-3", content: "square", correctZone: "zone-cuadrado" },
        { id: "drag-4", content: "decimal", correctZone: "zone-numeros" },
        { id: "drag-5", content: "none", correctZone: "zone-nada" },
      ],
      dropZones: [
        { id: "zone-lleno", label: "Círculo lleno, el valor por defecto" },
        { id: "zone-vacio", label: "Círculo vacío" },
        { id: "zone-cuadrado", label: "Cuadradito" },
        { id: "zone-numeros", label: "1. 2. 3." },
        { id: "zone-nada", label: "Sin viñeta" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-lleno",
          "drag-2": "zone-vacio",
          "drag-3": "zone-cuadrado",
          "drag-4": "zone-numeros",
          "drag-5": "zone-nada",
        },
      },
      hint: "Ojo con los dos primeros, que son los que se confunden: disc es el lleno y circle es el vacío, al revés de lo que sugieren los nombres.",
      explanation:
        "disc es el círculo lleno y viene por defecto. circle es el vacío, y ese par es el que más se confunde. square es el cuadradito, decimal numera, y none saca la viñeta, que es lo que se usa para un menú hecho con una lista.",
    },
    {
      id: "29-ej-03",
      type: "quiz",
      difficulty: 2,
      xpReward: 20,
      order: 3,
      prompt:
        "Pusiste border-collapse: collapse y además border-spacing: 10px, pero el espacio entre celdas no aparece. ¿Por qué?",
      options: [
        { id: "a", text: "Porque border-spacing necesita un valor en porcentaje", isCorrect: false },
        {
          id: "b",
          text: "Porque border-spacing solo funciona con border-collapse: separate: si los bordes están fusionados no hay espacio que repartir",
          isCorrect: true,
        },
        { id: "c", text: "Porque hay que aplicarlo a las celdas y no a la tabla", isCorrect: false },
        { id: "d", text: "Porque border-spacing fue reemplazado por padding", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Las dos propiedades hablan de lo mismo desde lados opuestos: una fusiona los bordes y la otra los separa.",
      explanation:
        "Las dos propiedades son excluyentes por definición, no por capricho: border-spacing reparte el espacio ENTRE celdas, y si collapse ya fusionó los bordes no queda espacio que repartir. Para usar border-spacing hay que dejar border-collapse en separate.",
    },
    {
      id: "29-ej-04",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt:
        "Construí una tabla estilada desde cero. Escribí la clase 'datos' con border-collapse: collapse y width: 100%; y una regla para '.datos th, .datos td' con border: 1px solid #ccc y padding: 10px.",
      codeTemplate: {
        html: `<table class="datos">\n  <thead>\n    <tr><th>Tecnologia</th><th>Anios</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>CSS moderno</td><td>3</td></tr>\n  </tbody>\n</table>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".datos {\n  border-collapse: collapse;\n  width: 100%;\n}\n\n.datos th, .datos td {\n  border: 1px solid #ccc;\n  padding: 10px;\n}",
      validation: {
        // Graded by parsing `targetCSS` into selector -> declarations, not by
        // searching the submission for loose words. See src/lib/cssRules.ts.
        type: "css-rules",
      },
      hint: "Son dos reglas. La segunda apunta a las celdas de encabezado y de cuerpo a la vez, separadas por coma.",
      explanation:
        "Esas dos reglas son el punto de partida de cualquier tabla: collapse para que los bordes no se dupliquen, y padding para que las celdas respiren. Una tabla apretada se lee mal aunque los bordes estén perfectos.",
    },
    {
      id: "29-ej-05",
      type: "quiz",
      difficulty: 2,
      xpReward: 20,
      order: 5,
      prompt:
        "¿Cuándo se nota la diferencia entre list-style-position: outside e inside?",
      options: [
        { id: "a", text: "Solo cuando la lista está dentro de una tabla", isCorrect: false },
        {
          id: "b",
          text: "Cuando un ítem ocupa más de una línea: con inside la segunda línea arranca debajo de la viñeta, con outside se alinea con el texto",
          isCorrect: true,
        },
        { id: "c", text: "Solo con listas numeradas, nunca con viñetas", isCorrect: false },
        { id: "d", text: "Nunca: son dos nombres para el mismo comportamiento", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Con un ítem de una sola línea las dos se ven igual. Probá con un texto largo.",
      explanation:
        "Con outside, que es el valor por defecto, la viñeta cuelga fuera de la caja del elemento y el bloque de texto queda parejo. Con inside la viñeta entra adentro, así que la segunda línea arranca debajo de ella. La diferencia solo se ve cuando el ítem pasa de una línea.",
    },
    {
      id: "29-ej-06",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 6,
      prompt:
        "Dale estilo a la viñeta con ::marker. Escribí la regla '.habilidades li::marker' con color: #8b5cf6 y font-size: 1.3em.",
      codeTemplate: {
        html: `<ul class="habilidades">\n  <li>HTML semantico</li>\n  <li>CSS moderno</li>\n</ul>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS: ".habilidades li::marker {\n  color: #8b5cf6;\n  font-size: 1.3em;\n}",
      validation: {
        // Graded by parsing `targetCSS` into selector -> declarations, not by
        // searching the submission for loose words. See src/lib/cssRules.ts.
        type: "css-rules",
      },
      hint: "Los dos puntos dobles van pegados al li, no a la clase: la viñeta pertenece a cada ítem, no a la lista.",
      explanation:
        "::marker apunta a la viñeta misma, así que la podés pintar sin tocar el color del texto. Antes de que existiera había que sacar la viñeta y falsificarla con ::before. Y ojo: ::marker solo acepta color, propiedades de fuente y content; ignora background-color, padding y width.",
    },
    {
      id: "29-ej-07",
      type: "quiz",
      difficulty: 3,
      xpReward: 30,
      order: 7,
      prompt:
        "Para que una tabla ancha pueda scrollearse en un teléfono, ¿por qué hace falta un min-width en la tabla y no solo overflow-x: auto en el envoltorio?",
      options: [
        { id: "a", text: "Porque overflow-x: auto no funciona sin un ancho declarado", isCorrect: false },
        {
          id: "b",
          text: "Porque sin min-width la tabla se encoge hasta caber, y si no hay desborde no hay nada que scrollear",
          isCorrect: true,
        },
        { id: "c", text: "Porque el min-width reemplaza al table-layout: fixed", isCorrect: false },
        { id: "d", text: "Porque el envoltorio necesita saber el ancho de la tabla para dibujar la barra", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Es la misma idea que el recorte de texto con puntos suspensivos: el desborde tiene que existir antes de poder manejarlo.",
      explanation:
        "Sin min-width la tabla se encoge hasta entrar en la pantalla, las columnas se aprietan y nunca hay desborde. El min-width es el que dice por debajo de qué ancho conviene scrollear en lugar de apretujar. Y el overflow va en el envoltorio y no en la tabla porque una tabla tiene layout propio y no se comporta como una caja normal para esto.",
    },
    {
      id: "29-ej-08",
      type: "visual-match",
      difficulty: 3,
      xpReward: 30,
      order: 8,
      prompt:
        "Reproducí la tabla de habilidades del CV. Escribí '.tabla-scroll' con overflow-x: auto; y '.habilidades-tabla' con border-collapse: collapse, width: 100% y min-width: 420px.",
      codeTemplate: {
        html: `<div class="tabla-scroll">\n  <table class="habilidades-tabla">\n    <thead>\n      <tr><th>Tecnologia</th><th>Nivel</th><th>Anios</th></tr>\n    </thead>\n    <tbody>\n      <tr><td>CSS moderno</td><td>Avanzado</td><td>3</td></tr>\n    </tbody>\n  </table>\n</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".tabla-scroll {\n  overflow-x: auto;\n}\n\n.habilidades-tabla {\n  border-collapse: collapse;\n  width: 100%;\n  min-width: 420px;\n}",
      validation: {
        // Graded by parsing `targetCSS` into selector -> declarations, not by
        // searching the submission for loose words. See src/lib/cssRules.ts.
        type: "css-rules",
      },
      hint: "El overflow va en el envoltorio de afuera y el ancho mínimo en la tabla de adentro. Las dos cosas juntas son lo que hace funcionar el scroll.",
      explanation:
        "El envoltorio con overflow-x: auto le da a la tabla su propia barra de scroll, así el desborde no rompe el layout de toda la página. Y el min-width en la tabla es lo que crea ese desborde: sin él la tabla se encoge y no hay nada que scrollear. auto en lugar de scroll para que la barra aparezca solo cuando hace falta.",
    },
  ],
};
