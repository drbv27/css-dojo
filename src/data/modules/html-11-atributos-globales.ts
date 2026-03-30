import type { ModuleData } from "@/types";

export const htmlAtributosModule: ModuleData = {
  slug: "html-atributos-globales",
  title: "Atributos Globales de HTML",
  description:
    "Aprende sobre los atributos globales que puedes usar en cualquier elemento HTML: id, class, data-*, contenteditable, tabindex y mas.",
  order: 11,
  category: "html-intermediate",
  icon: "tag",
  dojo: "html",
  lessons: [
    {
      id: "html11-leccion-01",
      title: "id, class y style",
      content: `## id, class y style

Los **atributos globales** son atributos que se pueden usar en **cualquier elemento HTML**. Los tres mas comunes son:

### id

Identificador **unico** para un elemento. No debe repetirse en la pagina.

\`\`\`html
<div id="mi-seccion">Contenido unico</div>
\`\`\`

**Usos:** enlazar con CSS (\`#mi-seccion\`), anclas en la URL (\`#mi-seccion\`), seleccionar con JavaScript.

### class

Permite asignar una o varias clases a un elemento. Se pueden repetir en multiples elementos.

\`\`\`html
<p class="texto-grande resaltado">Hola</p>
\`\`\`

**Usos:** aplicar estilos CSS (\`.texto-grande\`), agrupar elementos similares.

### style

Aplica estilos CSS directamente en el elemento (estilos en linea).

\`\`\`html
<p style="color: red; font-size: 20px;">Texto rojo</p>
\`\`\`

> **Nota:** Se recomienda usar clases CSS en lugar de estilos en linea para mantener el codigo limpio y reutilizable.

### title

Muestra un tooltip cuando el usuario pasa el raton sobre el elemento:

\`\`\`html
<abbr title="Hypertext Markup Language">HTML</abbr>
\`\`\``,
      codeExample: {
        html: `<h2 id="titulo-principal" class="titulo" title="Este es el titulo principal">
  Atributos Globales
</h2>

<p class="parrafo destacado" style="color: #6c5ce7;">
  Este parrafo tiene dos clases y un estilo en linea.
</p>

<p class="parrafo">
  Este parrafo comparte la clase "parrafo".
</p>

<p>Pasa el raton sobre esta abreviatura:
  <abbr title="Hypertext Markup Language">HTML</abbr>
</p>`,
        css: `.titulo {
  font-family: sans-serif;
  border-bottom: 3px solid #6c5ce7;
  padding-bottom: 8px;
}
.parrafo {
  font-family: sans-serif;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
  margin: 8px 0;
}
.destacado {
  font-weight: bold;
  border-left: 4px solid #6c5ce7;
}
abbr {
  text-decoration: underline dotted;
  cursor: help;
}`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "html11-leccion-02",
      title: "data-*, hidden y contenteditable",
      content: `## data-*, hidden y contenteditable

### Atributos data-*

Los atributos \`data-*\` permiten almacenar **datos personalizados** en cualquier elemento. Son perfectos para pasar informacion al JavaScript.

\`\`\`html
<div data-user-id="42" data-role="admin">Usuario</div>
\`\`\`

En JavaScript se acceden con \`element.dataset\`:
\`\`\`javascript
element.dataset.userId  // "42"
element.dataset.role    // "admin"
\`\`\`

### hidden

Oculta un elemento de la pagina. Es como \`display: none\` pero semantico.

\`\`\`html
<p hidden>Este texto no se muestra</p>
\`\`\`

### contenteditable

Hace que el contenido de un elemento sea **editable** directamente por el usuario.

\`\`\`html
<div contenteditable="true">Haz clic y edita este texto</div>
\`\`\`

### draggable

Hace que un elemento sea arrastrable con el raton:

\`\`\`html
<div draggable="true">Arrastrame</div>
\`\`\`

> **Tip:** Los atributos data-* son muy utiles para evitar contaminar el HTML con clases o IDs que solo existen para JavaScript.`,
      codeExample: {
        html: `<div
  id="producto"
  data-precio="29.99"
  data-categoria="tecnologia"
  data-stock="15"
  style="background:#f8f9fa;padding:16px;border-radius:8px;margin-bottom:12px;"
>
  <h3>Producto con data attributes</h3>
  <p>Precio, categoria y stock almacenados en data-*</p>
  <button onclick="mostrarDatos()">Ver datos</button>
  <p id="resultado"></p>
</div>

<div contenteditable="true" style="border:2px dashed #6c5ce7;padding:12px;border-radius:8px;margin-bottom:12px;">
  Este texto es editable. Haz clic y modifica el contenido!
</div>

<p hidden id="secreto">Este parrafo esta oculto con el atributo hidden.</p>
<button onclick="document.getElementById('secreto').hidden = false">Mostrar texto oculto</button>`,
        css: `body { font-family: sans-serif; padding: 16px; }
button {
  background: #6c5ce7;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}`,
        js: `function mostrarDatos() {
  const el = document.getElementById("producto");
  const info = "Precio: $" + el.dataset.precio +
    "\\nCategoria: " + el.dataset.categoria +
    "\\nStock: " + el.dataset.stock;
  document.getElementById("resultado").textContent = info;
}`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "html11-leccion-03",
      title: "tabindex, lang y dir",
      content: `## tabindex, lang y dir

### tabindex

Controla el **orden de tabulacion** al navegar con la tecla Tab. Es clave para la accesibilidad.

| Valor | Comportamiento |
|-------|---------------|
| \`tabindex="0"\` | El elemento es enfocable en el orden natural |
| \`tabindex="-1"\` | Enfocable solo por JavaScript, no con Tab |
| \`tabindex="1+"\` | Orden personalizado (no recomendado) |

\`\`\`html
<div tabindex="0">Este div es enfocable con Tab</div>
\`\`\`

### lang

Define el **idioma** del contenido. Es esencial para lectores de pantalla y SEO.

\`\`\`html
<html lang="es">
<p lang="en">This paragraph is in English.</p>
\`\`\`

### dir

Establece la **direccion del texto**: \`ltr\` (izquierda a derecha) o \`rtl\` (derecha a izquierda).

\`\`\`html
<p dir="rtl">Este texto va de derecha a izquierda</p>
\`\`\`

### Resumen de atributos globales

| Atributo | Funcion |
|----------|---------|
| \`id\` | Identificador unico |
| \`class\` | Clases CSS |
| \`style\` | Estilos en linea |
| \`title\` | Tooltip |
| \`data-*\` | Datos personalizados |
| \`hidden\` | Ocultar elemento |
| \`contenteditable\` | Contenido editable |
| \`draggable\` | Elemento arrastrable |
| \`tabindex\` | Orden de tabulacion |
| \`lang\` | Idioma del contenido |
| \`dir\` | Direccion del texto |`,
      codeExample: {
        html: `<h3>Prueba de tabindex</h3>
<p>Presiona Tab para navegar entre estos elementos:</p>

<button tabindex="1" style="margin:4px;">Primero (tabindex=1)</button>
<button tabindex="3" style="margin:4px;">Tercero (tabindex=3)</button>
<button tabindex="2" style="margin:4px;">Segundo (tabindex=2)</button>

<div tabindex="0" style="margin-top:16px;padding:12px;background:#dfe6e9;border-radius:8px;outline:none;"
  onfocus="this.style.boxShadow='0 0 0 3px #6c5ce7'" onblur="this.style.boxShadow='none'">
  Este div es enfocable (tabindex="0"). Haz Tab hasta llegar aqui.
</div>

<hr>

<h3>Atributo lang</h3>
<p lang="es">Este parrafo esta en espanol.</p>
<p lang="en">This paragraph is in English.</p>
<p lang="fr">Ce paragraphe est en francais.</p>

<hr>

<h3>Atributo dir</h3>
<p dir="ltr">Texto de izquierda a derecha (LTR)</p>
<p dir="rtl">Texto de derecha a izquierda (RTL)</p>`,
        css: `body { font-family: sans-serif; padding: 16px; }
button {
  padding: 10px 20px;
  background: #6c5ce7;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}
button:focus {
  outline: 3px solid #a29bfe;
  outline-offset: 2px;
}`,
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "html11-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "Que atributo global crea un identificador unico para un elemento HTML?",
      options: [
        { id: "a", text: "class", isCorrect: false },
        { id: "b", text: "name", isCorrect: false },
        { id: "c", text: "id", isCorrect: true },
        { id: "d", text: "key", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Es un atributo de dos letras que no debe repetirse en la pagina.",
      explanation:
        'El atributo id asigna un identificador unico a un elemento. No debe haber dos elementos con el mismo id en una pagina.',
    },
    {
      id: "html11-ej-02",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 2,
      prompt: "Cual es la diferencia principal entre id y class?",
      options: [
        { id: "a", text: "id puede repetirse, class no", isCorrect: false },
        { id: "b", text: "id es unico por pagina, class puede repetirse", isCorrect: true },
        { id: "c", text: "class solo funciona con CSS, id solo con JavaScript", isCorrect: false },
        { id: "d", text: "No hay diferencia significativa", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Piensa en cuantas veces puedes usar cada uno.",
      explanation:
        "El atributo id debe ser unico en toda la pagina, mientras que class puede repetirse en multiples elementos para agruparlos.",
    },
    {
      id: "html11-ej-03",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 3,
      prompt: "Completa el atributo para almacenar un precio personalizado en el elemento:",
      codeTemplate: {
        html: "",
        cssPrefix: '<div ',
        cssSuffix: '="49.99">Producto</div>',
        blanks: ["data-precio"],
      },
      validation: { type: "exact", answer: "data-precio" },
      hint: "Los atributos personalizados empiezan con data- seguido de un nombre.",
      explanation:
        'Los atributos data-* permiten almacenar datos personalizados. En JavaScript se accede con element.dataset.precio.',
    },
    {
      id: "html11-ej-04",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 4,
      prompt: "Que atributo hace que el contenido de un elemento sea editable por el usuario?",
      options: [
        { id: "a", text: "editable", isCorrect: false },
        { id: "b", text: "contenteditable", isCorrect: true },
        { id: "c", text: "editable-content", isCorrect: false },
        { id: "d", text: "writable", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Combina 'content' y 'editable' en una sola palabra.",
      explanation:
        'contenteditable="true" permite que el usuario edite el contenido de cualquier elemento directamente en el navegador.',
    },
    {
      id: "html11-ej-05",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 5,
      prompt: "Clasifica cada atributo global segun su proposito:",
      dragItems: [
        { id: "drag-1", content: "id", correctZone: "zone-identificacion" },
        { id: "drag-2", content: "class", correctZone: "zone-identificacion" },
        { id: "drag-3", content: "lang", correctZone: "zone-accesibilidad" },
        { id: "drag-4", content: "tabindex", correctZone: "zone-accesibilidad" },
        { id: "drag-5", content: "data-*", correctZone: "zone-datos" },
      ],
      dropZones: [
        { id: "zone-identificacion", label: "Identificacion/Estilo" },
        { id: "zone-accesibilidad", label: "Accesibilidad" },
        { id: "zone-datos", label: "Datos personalizados" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-identificacion",
          "drag-2": "zone-identificacion",
          "drag-3": "zone-accesibilidad",
          "drag-4": "zone-accesibilidad",
          "drag-5": "zone-datos",
        },
      },
      hint: "Piensa en para que se usa cada atributo principalmente.",
      explanation:
        "id y class se usan para identificar y estilizar elementos. lang y tabindex mejoran la accesibilidad. data-* almacena datos personalizados.",
    },
    {
      id: "html11-ej-06",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 6,
      prompt: 'Que valor de tabindex hace que un elemento sea enfocable solo por JavaScript pero NO con la tecla Tab?',
      options: [
        { id: "a", text: 'tabindex="0"', isCorrect: false },
        { id: "b", text: 'tabindex="1"', isCorrect: false },
        { id: "c", text: 'tabindex="-1"', isCorrect: true },
        { id: "d", text: 'tabindex="none"', isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Es un valor negativo.",
      explanation:
        'tabindex="-1" permite enfocar el elemento con JavaScript (element.focus()) pero lo excluye del orden de tabulacion con la tecla Tab.',
    },
    {
      id: "html11-ej-07",
      type: "code-completion",
      difficulty: 3,
      xpReward: 15,
      order: 7,
      prompt: "Completa el atributo para ocultar un elemento de la pagina:",
      codeTemplate: {
        html: "",
        cssPrefix: "<p ",
        cssSuffix: ">Este texto esta oculto</p>",
        blanks: ["hidden"],
      },
      validation: { type: "exact", answer: "hidden" },
      hint: "Es un atributo booleano que hace el elemento invisible.",
      explanation:
        "El atributo hidden oculta un elemento de la pagina. Es el equivalente semantico de display: none en CSS.",
    },
  ],
};
