import type { ModuleData } from "@/types";

export const htmlFormulariosModule: ModuleData = {
  slug: "html-08-formularios-basicos",
  title: "Formularios basicos",
  description:
    "Aprende a crear formularios HTML: la etiqueta form, tipos de input, labels, textarea, select y botones para interactuar con el usuario.",
  order: 8,
  dojo: "html",
  category: "html-fundamentals",
  icon: "file-input",
  lessons: [
    {
      id: "html-08-leccion-01",
      title: "La etiqueta form",
      content: `## La etiqueta form

La etiqueta \`<form>\` es el **contenedor** de todos los elementos de un formulario. Define como y donde se envian los datos.

### Estructura basica

\`\`\`html
<form action="/enviar" method="POST">
  <!-- Aqui van los campos del formulario -->
</form>
\`\`\`

### Atributos principales

#### \`action\`
Especifica la **URL** a donde se envian los datos del formulario:

\`\`\`html
<form action="/procesar-datos">
\`\`\`

Si se omite, los datos se envian a la misma pagina.

#### \`method\`
Define el **metodo HTTP** para enviar los datos:

- **\`GET\`** — Los datos se envian en la URL (visibles). Usado para busquedas.
- **\`POST\`** — Los datos se envian en el cuerpo de la solicitud (ocultos). Usado para formularios con datos sensibles.

\`\`\`html
<!-- Para busquedas -->
<form action="/buscar" method="GET">

<!-- Para registro/login -->
<form action="/registro" method="POST">
\`\`\`

### Diferencias entre GET y POST

| Caracteristica | GET | POST |
|---------------|-----|------|
| Datos en URL | Si | No |
| Marcadores | Se puede guardar | No se puede |
| Limite de datos | ~2000 caracteres | Sin limite practico |
| Seguridad | Menos seguro | Mas seguro |
| Uso tipico | Busquedas, filtros | Login, registro, pagos |

> **Regla de oro:** Usa POST para formularios que envian datos sensibles (contrasenas, datos personales) y GET para busquedas y filtros.`,
      codeExample: {
        html: `<form action="/buscar" method="GET">\n  <label for="query">Buscar:</label>\n  <input type="text" id="query" name="query" placeholder="Escribe aqui...">\n  <button type="submit">Buscar</button>\n</form>`,
        css: `form {\n  font-family: sans-serif;\n  display: flex;\n  gap: 8px;\n  align-items: center;\n}\n\nlabel {\n  color: #2d3748;\n  font-weight: bold;\n}\n\ninput {\n  padding: 8px 12px;\n  border: 2px solid #e2e8f0;\n  border-radius: 6px;\n  font-size: 14px;\n}\n\nbutton {\n  padding: 8px 16px;\n  background-color: #3182ce;\n  color: white;\n  border: none;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 14px;\n}`,
        editable: false,
      },
      order: 1,
    },
    {
      id: "html-08-leccion-02",
      title: "Input types y label",
      content: `## Input types y label

### La etiqueta \`<input>\`

Es el elemento mas versatil de los formularios. El atributo \`type\` define que tipo de dato acepta.

### Tipos comunes de input

#### Texto
\`\`\`html
<input type="text" name="nombre" placeholder="Tu nombre">
\`\`\`

#### Email (valida formato de correo)
\`\`\`html
<input type="email" name="correo" placeholder="tu@correo.com">
\`\`\`

#### Contrasena (oculta los caracteres)
\`\`\`html
<input type="password" name="clave" placeholder="Tu contrasena">
\`\`\`

#### Numero
\`\`\`html
<input type="number" name="edad" min="1" max="120">
\`\`\`

#### Fecha
\`\`\`html
<input type="date" name="nacimiento">
\`\`\`

### La etiqueta \`<label>\`

Asocia un **texto descriptivo** con un campo de formulario. Es esencial para accesibilidad.

#### Uso con \`for\`
El atributo \`for\` del label debe coincidir con el \`id\` del input:

\`\`\`html
<label for="email">Correo electronico:</label>
<input type="email" id="email" name="email">
\`\`\`

Al hacer clic en el label, el cursor se coloca automaticamente en el input asociado.

### Atributos comunes de input

- **\`name\`** — Nombre del campo (se envia con los datos)
- **\`placeholder\`** — Texto de ayuda dentro del campo
- **\`required\`** — Campo obligatorio
- **\`value\`** — Valor predefinido
- **\`disabled\`** — Campo deshabilitado

> **Accesibilidad:** Siempre usa \`<label>\` con \`for\` asociado al \`id\` del input. Sin label, los lectores de pantalla no pueden describir el campo.`,
      codeExample: {
        html: `<form>\n  <div>\n    <label for="nombre">Nombre:</label>\n    <input type="text" id="nombre" name="nombre" placeholder="Juan Garcia" required>\n  </div>\n  <div>\n    <label for="email">Email:</label>\n    <input type="email" id="email" name="email" placeholder="juan@correo.com" required>\n  </div>\n  <div>\n    <label for="pass">Contrasena:</label>\n    <input type="password" id="pass" name="password" placeholder="Minimo 8 caracteres">\n  </div>\n  <div>\n    <label for="edad">Edad:</label>\n    <input type="number" id="edad" name="edad" min="1" max="120">\n  </div>\n  <div>\n    <label for="fecha">Fecha de nacimiento:</label>\n    <input type="date" id="fecha" name="nacimiento">\n  </div>\n</form>`,
        css: `form {\n  font-family: sans-serif;\n  max-width: 350px;\n}\n\ndiv {\n  margin-bottom: 12px;\n}\n\nlabel {\n  display: block;\n  color: #2d3748;\n  font-weight: bold;\n  margin-bottom: 4px;\n  font-size: 14px;\n}\n\ninput {\n  width: 100%;\n  padding: 8px 12px;\n  border: 2px solid #e2e8f0;\n  border-radius: 6px;\n  font-size: 14px;\n  box-sizing: border-box;\n}\n\ninput:focus {\n  border-color: #3182ce;\n  outline: none;\n}`,
        editable: false,
      },
      order: 2,
    },
    {
      id: "html-08-leccion-03",
      title: "textarea y select",
      content: `## textarea y select

### \`<textarea>\` — Area de texto

Para textos largos (comentarios, mensajes, descripciones), usa \`<textarea>\`:

\`\`\`html
<label for="mensaje">Mensaje:</label>
<textarea id="mensaje" name="mensaje" rows="5" cols="40"
  placeholder="Escribe tu mensaje aqui..."></textarea>
\`\`\`

#### Atributos importantes:
- **\`rows\`** — Numero de filas visibles
- **\`cols\`** — Numero de columnas visibles
- **\`placeholder\`** — Texto de ayuda
- **\`maxlength\`** — Limite de caracteres

> **Nota:** A diferencia de \`<input>\`, el \`<textarea>\` tiene etiqueta de cierre. El contenido inicial va entre las etiquetas, no en un atributo \`value\`.

### \`<select>\` — Lista desplegable

Crea un menu de opciones para que el usuario elija:

\`\`\`html
<label for="pais">Pais:</label>
<select id="pais" name="pais">
  <option value="">Selecciona un pais</option>
  <option value="mx">Mexico</option>
  <option value="es">Espana</option>
  <option value="ar">Argentina</option>
  <option value="co">Colombia</option>
</select>
\`\`\`

#### Atributos de \`<option>\`:
- **\`value\`** — El valor que se envia al servidor
- **\`selected\`** — Opcion seleccionada por defecto
- **\`disabled\`** — Opcion no seleccionable

#### Agrupando opciones con \`<optgroup>\`:

\`\`\`html
<select name="curso">
  <optgroup label="Frontend">
    <option value="html">HTML</option>
    <option value="css">CSS</option>
  </optgroup>
  <optgroup label="Backend">
    <option value="node">Node.js</option>
    <option value="python">Python</option>
  </optgroup>
</select>
\`\`\`

> **Tip:** La primera opcion de un select suele ser un placeholder como "Selecciona una opcion" con \`value=""\`.`,
      codeExample: {
        html: `<form>\n  <div>\n    <label for="comentario">Comentario:</label>\n    <textarea id="comentario" name="comentario" rows="4" placeholder="Escribe tu opinion..."></textarea>\n  </div>\n  <div>\n    <label for="lenguaje">Lenguaje favorito:</label>\n    <select id="lenguaje" name="lenguaje">\n      <option value="">Elige uno</option>\n      <optgroup label="Frontend">\n        <option value="html">HTML</option>\n        <option value="css">CSS</option>\n        <option value="js">JavaScript</option>\n      </optgroup>\n      <optgroup label="Backend">\n        <option value="python">Python</option>\n        <option value="java">Java</option>\n      </optgroup>\n    </select>\n  </div>\n</form>`,
        css: `form {\n  font-family: sans-serif;\n  max-width: 350px;\n}\n\ndiv {\n  margin-bottom: 14px;\n}\n\nlabel {\n  display: block;\n  color: #2d3748;\n  font-weight: bold;\n  margin-bottom: 4px;\n  font-size: 14px;\n}\n\ntextarea, select {\n  width: 100%;\n  padding: 8px 12px;\n  border: 2px solid #e2e8f0;\n  border-radius: 6px;\n  font-size: 14px;\n  font-family: sans-serif;\n  box-sizing: border-box;\n}\n\ntextarea:focus, select:focus {\n  border-color: #3182ce;\n  outline: none;\n}`,
        editable: false,
      },
      order: 3,
    },
    {
      id: "html-08-leccion-04",
      title: "Botones en formularios",
      content: `## Botones en formularios

La etiqueta \`<button>\` crea botones interactivos. El atributo \`type\` define su comportamiento.

### Tipos de button

#### \`type="submit"\` — Enviar formulario
Es el tipo por defecto dentro de un \`<form>\`. Envia los datos del formulario:

\`\`\`html
<button type="submit">Enviar</button>
\`\`\`

#### \`type="reset"\` — Limpiar formulario
Restablece todos los campos a sus valores iniciales:

\`\`\`html
<button type="reset">Limpiar</button>
\`\`\`

#### \`type="button"\` — Boton generico
No tiene comportamiento predeterminado. Se usa con JavaScript:

\`\`\`html
<button type="button">Hacer algo</button>
\`\`\`

### \`<button>\` vs \`<input type="submit">\`

Ambos envian el formulario, pero \`<button>\` es mas flexible porque puede contener **HTML dentro** (iconos, texto formateado):

\`\`\`html
<!-- Solo texto -->
<input type="submit" value="Enviar">

<!-- HTML dentro -->
<button type="submit">
  Enviar formulario
</button>
\`\`\`

### Ejemplo completo de formulario

Un formulario tipico incluye campos, validacion basica y botones de accion:

\`\`\`html
<form action="/registro" method="POST">
  <label for="user">Usuario:</label>
  <input type="text" id="user" name="usuario" required>

  <label for="pwd">Contrasena:</label>
  <input type="password" id="pwd" name="contrasena" required>

  <button type="submit">Registrarse</button>
  <button type="reset">Limpiar</button>
</form>
\`\`\`

> **Buena practica:** Siempre especifica el \`type\` en tus botones. Si lo omites dentro de un form, el boton actuara como submit por defecto, lo cual puede causar envios accidentales.`,
      codeExample: {
        html: `<form action="/contacto" method="POST">\n  <div>\n    <label for="name">Nombre completo:</label>\n    <input type="text" id="name" name="nombre" required placeholder="Tu nombre">\n  </div>\n  <div>\n    <label for="mail">Correo:</label>\n    <input type="email" id="mail" name="email" required placeholder="tu@correo.com">\n  </div>\n  <div>\n    <label for="msg">Mensaje:</label>\n    <textarea id="msg" name="mensaje" rows="3" placeholder="Tu mensaje..."></textarea>\n  </div>\n  <div>\n    <label for="prioridad">Prioridad:</label>\n    <select id="prioridad" name="prioridad">\n      <option value="baja">Baja</option>\n      <option value="media" selected>Media</option>\n      <option value="alta">Alta</option>\n    </select>\n  </div>\n  <div class="botones">\n    <button type="submit">Enviar mensaje</button>\n    <button type="reset">Limpiar</button>\n  </div>\n</form>`,
        css: `form {\n  font-family: sans-serif;\n  max-width: 360px;\n}\n\ndiv {\n  margin-bottom: 12px;\n}\n\nlabel {\n  display: block;\n  color: #2d3748;\n  font-weight: bold;\n  margin-bottom: 4px;\n  font-size: 14px;\n}\n\ninput, textarea, select {\n  width: 100%;\n  padding: 8px 12px;\n  border: 2px solid #e2e8f0;\n  border-radius: 6px;\n  font-size: 14px;\n  font-family: sans-serif;\n  box-sizing: border-box;\n}\n\n.botones {\n  display: flex;\n  gap: 8px;\n}\n\nbutton[type="submit"] {\n  padding: 10px 20px;\n  background-color: #38a169;\n  color: white;\n  border: none;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 14px;\n}\n\nbutton[type="reset"] {\n  padding: 10px 20px;\n  background-color: #e2e8f0;\n  color: #4a5568;\n  border: none;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 14px;\n}`,
        editable: false,
      },
      order: 4,
    },
  ],
  exercises: [
    {
      id: "html-08-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "Que atributo de <form> define a donde se envian los datos?",
      options: [
        { id: "a", text: "method", isCorrect: false },
        { id: "b", text: "action", isCorrect: true },
        { id: "c", text: "target", isCorrect: false },
        { id: "d", text: "src", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Es el atributo que especifica la URL de destino.",
      explanation:
        "El atributo action define la URL a donde se envian los datos del formulario cuando se hace submit.",
    },
    {
      id: "html-08-ej-02",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt: "Cual metodo HTTP es mas seguro para enviar contrasenas?",
      options: [
        { id: "a", text: "GET", isCorrect: false },
        { id: "b", text: "POST", isCorrect: true },
        { id: "c", text: "PUT", isCorrect: false },
        { id: "d", text: "Ambos son igual de seguros", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Uno envia datos en la URL (visible) y otro en el cuerpo de la solicitud.",
      explanation:
        "POST envia los datos en el cuerpo de la solicitud HTTP, no en la URL, lo que lo hace mas apropiado para datos sensibles como contrasenas.",
    },
    {
      id: "html-08-ej-03",
      type: "code-completion",
      difficulty: 1 ,
      xpReward: 10,
      order: 3,
      prompt: "Completa el label y el input para que esten correctamente asociados:",
      codeTemplate: {
        html: `<label _____="correo">Email:</label>\n<input type="email" _____="correo" name="email">`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: ["for", "id"],
      },
      validation: { type: "exact", answer: ["for", "id"] },
      hint: "El label usa 'for' y el input usa 'id' con el mismo valor.",
      explanation:
        "El atributo for del <label> debe coincidir con el id del <input> para asociarlos correctamente.",
    },
    {
      id: "html-08-ej-04",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt: "Arrastra cada tipo de input a su uso mas apropiado:",
      dragItems: [
        { id: "d1", content: "type=\"text\"", correctZone: "z1" },
        { id: "d2", content: "type=\"email\"", correctZone: "z2" },
        { id: "d3", content: "type=\"password\"", correctZone: "z3" },
        { id: "d4", content: "type=\"number\"", correctZone: "z4" },
        { id: "d5", content: "type=\"date\"", correctZone: "z5" },
      ],
      dropZones: [
        { id: "z1", label: "Nombre del usuario" },
        { id: "z2", label: "Direccion de correo" },
        { id: "z3", label: "Clave de acceso" },
        { id: "z4", label: "Edad o cantidad" },
        { id: "z5", label: "Fecha de nacimiento" },
      ],
      validation: {
        type: "exact",
        answer: { d1: "z1", d2: "z2", d3: "z3", d4: "z4", d5: "z5" },
      },
      hint: "Cada tipo de input esta disenado para un tipo especifico de dato.",
      explanation:
        "text para nombres, email para correos (con validacion), password para contrasenas (oculta caracteres), number para numeros, y date para fechas.",
    },
    {
      id: "html-08-ej-05",
      type: "code-completion",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt: "Completa el select para crear una lista desplegable con opciones:",
      codeTemplate: {
        html: `<label for="color">Color favorito:</label>\n<_____ id="color" name="color">\n  <option value="">Elige un color</option>\n  <option value="rojo">Rojo</option>\n  <option value="azul">Azul</option>\n</_____>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: ["select", "select"],
      },
      validation: { type: "exact", answer: ["select", "select"] },
      hint: "Es la etiqueta que crea una lista desplegable.",
      explanation:
        "La etiqueta <select> crea un menu desplegable con opciones definidas por <option>.",
    },
    {
      id: "html-08-ej-06",
      type: "live-editor",
      difficulty: 2 ,
      xpReward: 20,
      order: 6,
      prompt:
        "Crea un formulario de registro con: form (action='/registro', method='POST'), un campo de texto para nombre con su label, un campo email con su label, un campo password con su label, y un boton de tipo submit que diga 'Registrarse'.",
      codeTemplate: {
        html: `<!-- Crea el formulario de registro -->`,
        cssPrefix: "",
        cssSuffix: "",
      },
      validation: {
        type: "includes",
        answer: ["<form", "action", "method", "<label", "<input", "type=\"text\"", "type=\"email\"", "type=\"password\"", "<button", "submit"],
      },
      hint: "Estructura: form > (label + input) x 3 + button[type=submit].",
      explanation:
        "Un formulario de registro basico necesita form con action y method, campos con label asociados, y un boton submit.",
    },
    {
      id: "html-08-ej-07",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 7,
      prompt: "Que sucede si un <button> dentro de un <form> no tiene atributo type?",
      options: [
        { id: "a", text: "No hace nada al hacer clic", isCorrect: false },
        { id: "b", text: "Actua como type='button'", isCorrect: false },
        { id: "c", text: "Actua como type='submit' y envia el formulario", isCorrect: true },
        { id: "d", text: "Actua como type='reset' y limpia el formulario", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "El tipo por defecto de un button dentro de un form puede causar envios accidentales.",
      explanation:
        "Dentro de un <form>, un <button> sin type actua como submit por defecto, enviando el formulario al hacer clic.",
    },
    {
      id: "html-08-ej-08",
      type: "live-editor",
      difficulty: 3 ,
      xpReward: 30,
      order: 8,
      prompt:
        "Crea un formulario de contacto completo con: un campo de texto para nombre, un email, un textarea para el mensaje, un select con 3 opciones de asunto, y botones de submit ('Enviar') y reset ('Limpiar'). Cada campo debe tener su label asociado correctamente.",
      codeTemplate: {
        html: `<!-- Crea el formulario de contacto completo -->`,
        cssPrefix: "",
        cssSuffix: "",
      },
      validation: {
        type: "includes",
        answer: ["<form", "<label", "for=", "<input", "<textarea", "<select", "<option", "<button", "submit", "reset"],
      },
      hint: "Asegurate de que cada label tenga for= y cada campo tenga id= con el mismo valor.",
      explanation:
        "Un formulario completo combina diferentes tipos de campos (input, textarea, select) con labels accesibles y botones para enviar o limpiar los datos.",
    },
  ],
};
