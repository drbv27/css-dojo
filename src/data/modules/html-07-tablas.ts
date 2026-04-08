import type { ModuleData } from "@/types";

export const htmlTablasModule: ModuleData = {
  slug: "html-07-tablas",
  title: "Tablas en HTML",
  description:
    "Aprende a crear tablas en HTML con thead, tbody, tfoot, colspan, rowspan, caption y atributos de accesibilidad como scope.",
  order: 7,
  dojo: "html",
  category: "html-fundamentals",
  icon: "table",
  lessons: [
    {
      id: "html-07-leccion-01",
      title: "Estructura basica de una tabla",
      content: `## Estructura basica de una tabla

Las tablas en HTML se usan para mostrar **datos tabulares** (informacion organizada en filas y columnas).

### Etiquetas fundamentales

- \`<table>\` — Contenedor de la tabla
- \`<tr>\` — Table Row (fila)
- \`<th>\` — Table Header (celda de encabezado)
- \`<td>\` — Table Data (celda de datos)

### Ejemplo basico

\`\`\`html
<table>
  <tr>
    <th>Nombre</th>
    <th>Edad</th>
  </tr>
  <tr>
    <td>Ana</td>
    <td>25</td>
  </tr>
  <tr>
    <td>Carlos</td>
    <td>30</td>
  </tr>
</table>
\`\`\`

### Diferencia entre \`<th>\` y \`<td>\`

- \`<th>\` se muestra en **negrita y centrado** por defecto. Representa un encabezado.
- \`<td>\` se muestra en texto normal. Representa datos.

> **Importante:** Las tablas son para **datos tabulares**, no para disenar layouts. Usar tablas para disenar la maquetacion de una pagina es una practica obsoleta. Usa CSS Grid o Flexbox para layouts.`,
      codeExample: {
        html: `<table>\n  <tr>\n    <th>Producto</th>\n    <th>Precio</th>\n    <th>Stock</th>\n  </tr>\n  <tr>\n    <td>Laptop</td>\n    <td>$999</td>\n    <td>15</td>\n  </tr>\n  <tr>\n    <td>Mouse</td>\n    <td>$25</td>\n    <td>150</td>\n  </tr>\n  <tr>\n    <td>Teclado</td>\n    <td>$75</td>\n    <td>80</td>\n  </tr>\n</table>`,
        css: `table {\n  border-collapse: collapse;\n  width: 100%;\n  font-family: sans-serif;\n}\n\nth, td {\n  border: 1px solid #e2e8f0;\n  padding: 10px 14px;\n  text-align: left;\n}\n\nth {\n  background-color: #2b6cb0;\n  color: white;\n}\n\ntr:nth-child(even) {\n  background-color: #f7fafc;\n}`,
        editable: false,
      },
      order: 1,
    },
    {
      id: "html-07-leccion-02",
      title: "thead, tbody, tfoot y caption",
      content: `## Secciones de tabla: thead, tbody, tfoot

Para tablas bien estructuradas, divide el contenido en **secciones semanticas**:

### \`<thead>\` — Encabezado de la tabla
Contiene las filas de encabezado:

\`\`\`html
<thead>
  <tr>
    <th>Columna 1</th>
    <th>Columna 2</th>
  </tr>
</thead>
\`\`\`

### \`<tbody>\` — Cuerpo de la tabla
Contiene las filas de datos principales:

\`\`\`html
<tbody>
  <tr>
    <td>Dato 1</td>
    <td>Dato 2</td>
  </tr>
</tbody>
\`\`\`

### \`<tfoot>\` — Pie de la tabla
Contiene filas de resumen o totales:

\`\`\`html
<tfoot>
  <tr>
    <td>Total</td>
    <td>$1,099</td>
  </tr>
</tfoot>
\`\`\`

### \`<caption>\` — Titulo de la tabla
Proporciona un **titulo descriptivo** para la tabla. Va justo despues de \`<table>\`:

\`\`\`html
<table>
  <caption>Ventas del trimestre</caption>
  ...
</table>
\`\`\`

> **Accesibilidad:** Usa siempre \`<caption>\` para describir el proposito de la tabla. Los lectores de pantalla lo anuncian antes de leer los datos.`,
      codeExample: {
        html: `<table>\n  <caption>Reporte de ventas - Marzo 2026</caption>\n  <thead>\n    <tr>\n      <th>Producto</th>\n      <th>Unidades</th>\n      <th>Ingreso</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Curso HTML</td>\n      <td>120</td>\n      <td>$2,400</td>\n    </tr>\n    <tr>\n      <td>Curso CSS</td>\n      <td>95</td>\n      <td>$1,900</td>\n    </tr>\n    <tr>\n      <td>Curso JS</td>\n      <td>80</td>\n      <td>$2,000</td>\n    </tr>\n  </tbody>\n  <tfoot>\n    <tr>\n      <td>Total</td>\n      <td>295</td>\n      <td>$6,300</td>\n    </tr>\n  </tfoot>\n</table>`,
        css: `table {\n  border-collapse: collapse;\n  width: 100%;\n  font-family: sans-serif;\n}\n\ncaption {\n  font-weight: bold;\n  font-size: 16px;\n  margin-bottom: 8px;\n  color: #2d3748;\n}\n\nth, td {\n  border: 1px solid #e2e8f0;\n  padding: 10px 14px;\n  text-align: left;\n}\n\nthead th {\n  background-color: #2b6cb0;\n  color: white;\n}\n\ntfoot td {\n  background-color: #edf2f7;\n  font-weight: bold;\n}\n\ntbody tr:nth-child(even) {\n  background-color: #f7fafc;\n}`,
        editable: false,
      },
      order: 2,
    },
    {
      id: "html-07-leccion-03",
      title: "colspan, rowspan y scope",
      content: `## colspan, rowspan y scope

### \`colspan\` — Unir columnas
Hace que una celda ocupe **multiples columnas**:

\`\`\`html
<tr>
  <td colspan="2">Esta celda ocupa 2 columnas</td>
</tr>
\`\`\`

### \`rowspan\` — Unir filas
Hace que una celda ocupe **multiples filas**:

\`\`\`html
<td rowspan="3">Esta celda ocupa 3 filas</td>
\`\`\`

### Combinando colspan y rowspan

Puedes usar ambos en la misma celda para crear celdas que abarquen varias filas y columnas simultaneamente.

### \`scope\` — Accesibilidad en tablas

El atributo \`scope\` en las celdas \`<th>\` indica si el encabezado aplica a una **columna** o una **fila**:

- \`scope="col"\` — El encabezado aplica a toda la columna
- \`scope="row"\` — El encabezado aplica a toda la fila
- \`scope="colgroup"\` — Aplica a un grupo de columnas
- \`scope="rowgroup"\` — Aplica a un grupo de filas

\`\`\`html
<thead>
  <tr>
    <th scope="col">Nombre</th>
    <th scope="col">Nota</th>
  </tr>
</thead>
<tbody>
  <tr>
    <th scope="row">Maria</th>
    <td>9.5</td>
  </tr>
</tbody>
\`\`\`

> **Buena practica:** Siempre usa \`scope\` en tus encabezados \`<th>\`. Mejora enormemente la accesibilidad para usuarios de lectores de pantalla.`,
      codeExample: {
        html: `<table>\n  <caption>Horario de clases</caption>\n  <thead>\n    <tr>\n      <th scope="col">Hora</th>\n      <th scope="col">Lunes</th>\n      <th scope="col">Martes</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <th scope="row">9:00</th>\n      <td colspan="2">Matematicas (ambos dias)</td>\n    </tr>\n    <tr>\n      <th scope="row">10:00</th>\n      <td>Historia</td>\n      <td rowspan="2">Laboratorio de ciencias</td>\n    </tr>\n    <tr>\n      <th scope="row">11:00</th>\n      <td>Ingles</td>\n    </tr>\n  </tbody>\n</table>`,
        css: `table {\n  border-collapse: collapse;\n  width: 100%;\n  font-family: sans-serif;\n}\n\ncaption {\n  font-weight: bold;\n  font-size: 16px;\n  margin-bottom: 8px;\n  color: #2d3748;\n}\n\nth, td {\n  border: 1px solid #cbd5e0;\n  padding: 10px 14px;\n  text-align: center;\n}\n\nthead th {\n  background-color: #2b6cb0;\n  color: white;\n}\n\ntbody th {\n  background-color: #ebf8ff;\n  color: #2b6cb0;\n}\n\ntd[colspan] {\n  background-color: #fefcbf;\n}\n\ntd[rowspan] {\n  background-color: #f0fff4;\n}`,
        editable: false,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "html-07-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "Que etiqueta define una celda de encabezado en una tabla HTML?",
      options: [
        { id: "a", text: "<td>", isCorrect: false },
        { id: "b", text: "<th>", isCorrect: true },
        { id: "c", text: "<tr>", isCorrect: false },
        { id: "d", text: "<header>", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Es la abreviatura de 'table header'.",
      explanation:
        "La etiqueta <th> (table header) define una celda de encabezado que se muestra en negrita y centrada por defecto.",
    },
    {
      id: "html-07-ej-02",
      type: "code-completion",
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt: "Completa la estructura para crear una fila con dos celdas de datos:",
      codeTemplate: {
        html: `<table>\n  <_____>\n    <td>Celda 1</td>\n    <td>Celda 2</td>\n  </_____>\n</table>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: ["tr", "tr"],
      },
      validation: { type: "exact", answer: ["tr", "tr"] },
      hint: "Es la etiqueta que crea una fila (table row).",
      explanation:
        "La etiqueta <tr> (table row) crea una fila en la tabla. Cada fila contiene celdas <td> o <th>.",
    },
    {
      id: "html-07-ej-03",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 3,
      prompt: "Que atributo permite que una celda ocupe multiples columnas?",
      options: [
        { id: "a", text: "rowspan", isCorrect: false },
        { id: "b", text: "multicolumn", isCorrect: false },
        { id: "c", text: "colspan", isCorrect: true },
        { id: "d", text: "span", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Combina las palabras 'column' y 'span'.",
      explanation:
        "El atributo colspan indica cuantas columnas debe abarcar una celda. Por ejemplo, colspan='2' ocupa 2 columnas.",
    },
    {
      id: "html-07-ej-04",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt: "Arrastra cada seccion de tabla a su funcion:",
      dragItems: [
        { id: "d1", content: "<thead>", correctZone: "z1" },
        { id: "d2", content: "<tbody>", correctZone: "z2" },
        { id: "d3", content: "<tfoot>", correctZone: "z3" },
        { id: "d4", content: "<caption>", correctZone: "z4" },
      ],
      dropZones: [
        { id: "z1", label: "Filas de encabezado" },
        { id: "z2", label: "Filas de datos principales" },
        { id: "z3", label: "Filas de resumen o totales" },
        { id: "z4", label: "Titulo descriptivo de la tabla" },
      ],
      validation: {
        type: "exact",
        answer: { d1: "z1", d2: "z2", d3: "z3", d4: "z4" },
      },
      hint: "thead = head (encabezado), tbody = body (cuerpo), tfoot = foot (pie).",
      explanation:
        "thead agrupa encabezados, tbody agrupa los datos principales, tfoot los totales/resumen, y caption proporciona un titulo.",
    },
    {
      id: "html-07-ej-05",
      type: "live-editor",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt:
        "Crea una tabla con caption 'Notas del curso', thead con una fila de 3 encabezados (Estudiante, Nota, Estado), y tbody con al menos 2 filas de datos.",
      codeTemplate: {
        html: `<!-- Crea la tabla completa -->`,
        cssPrefix: "",
        cssSuffix: "",
      },
      validation: {
        type: "includes",
        answer: ["<table>", "<caption>", "<thead>", "<th>", "</th>", "<tbody>", "<td>", "</td>", "</tbody>", "</table>"],
      },
      hint: "Usa table > caption + thead (con tr y th) + tbody (con tr y td).",
      explanation:
        "Una tabla bien estructurada incluye caption para el titulo, thead para encabezados y tbody para los datos.",
    },
    {
      id: "html-07-ej-06",
      type: "code-completion",
      difficulty: 2 ,
      xpReward: 20,
      order: 6,
      prompt: "Completa el atributo para que esta celda ocupe 3 filas:",
      codeTemplate: {
        html: `<table>\n  <tr>\n    <td _____="3">Celda expandida</td>\n    <td>Fila 1</td>\n  </tr>\n  <tr>\n    <td>Fila 2</td>\n  </tr>\n  <tr>\n    <td>Fila 3</td>\n  </tr>\n</table>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: ["rowspan"],
      },
      validation: { type: "exact", answer: ["rowspan"] },
      hint: "Combina 'row' (fila) con 'span' (abarcar).",
      explanation:
        "El atributo rowspan='3' hace que la celda se extienda verticalmente ocupando 3 filas.",
    },
    {
      id: "html-07-ej-07",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 7,
      prompt: "Para que sirve el atributo scope en un <th>?",
      options: [
        { id: "a", text: "Para definir el ancho de la columna", isCorrect: false },
        { id: "b", text: "Para indicar si el encabezado aplica a una columna o fila (accesibilidad)", isCorrect: true },
        { id: "c", text: "Para aplicar estilos CSS especificos", isCorrect: false },
        { id: "d", text: "Para fusionar celdas adyacentes", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Es un atributo relacionado con la accesibilidad de las tablas.",
      explanation:
        "El atributo scope indica si un <th> es encabezado de columna (col) o fila (row), lo que ayuda a los lectores de pantalla a asociar datos con sus encabezados.",
    },
  ],
};
