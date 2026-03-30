import type { ModuleData } from "@/types";

export const htmlFormulariosAvanzadosModule: ModuleData = {
  slug: "html-formularios-avanzados",
  title: "Formularios Avanzados",
  description:
    "Domina los tipos de input avanzados, validacion nativa, atributos de formulario y elementos como datalist, fieldset y legend.",
  order: 9,
  category: "html-intermediate",
  icon: "settings",
  dojo: "html",
  lessons: [
    {
      id: "html09-leccion-01",
      title: "Tipos de input avanzados",
      content: `## Tipos de input avanzados

HTML5 introdujo muchos tipos de input nuevos que facilitan la captura de datos y mejoran la experiencia del usuario.

### Tipos mas utiles

| Tipo | Descripcion |
|------|-------------|
| \`range\` | Control deslizante para seleccionar un valor numerico |
| \`color\` | Selector de color |
| \`file\` | Permite subir archivos |
| \`hidden\` | Campo oculto (no visible para el usuario) |
| \`search\` | Campo optimizado para busquedas |
| \`date\` | Selector de fecha |
| \`time\` | Selector de hora |
| \`number\` | Solo acepta numeros |

### Ventajas

- **Validacion nativa:** el navegador valida automaticamente el formato
- **Mejor UX en moviles:** el teclado se adapta al tipo de input
- **Sin JavaScript:** muchas validaciones funcionan sin codigo adicional

> **Tip:** Siempre usa el tipo de input mas especifico posible. Esto mejora la accesibilidad y la experiencia del usuario.`,
      codeExample: {
        html: `<form>
  <label>Color favorito:</label><br>
  <input type="color" value="#6c5ce7"><br><br>

  <label>Volumen:</label><br>
  <input type="range" min="0" max="100" value="50"><br><br>

  <label>Buscar:</label><br>
  <input type="search" placeholder="Escribe aqui..."><br><br>

  <label>Fecha:</label><br>
  <input type="date"><br><br>

  <label>Archivo:</label><br>
  <input type="file" accept="image/*">
</form>`,
        css: `form {
  font-family: sans-serif;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}
label {
  font-weight: bold;
  color: #2d3436;
}
input {
  margin-top: 4px;
}`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "html09-leccion-02",
      title: "Datalist, fieldset y legend",
      content: `## Datalist, fieldset y legend

### Datalist

El elemento \`<datalist>\` proporciona una lista de sugerencias para un input. El usuario puede elegir una sugerencia o escribir su propio valor.

\`\`\`html
<input list="frutas" placeholder="Elige una fruta">
<datalist id="frutas">
  <option value="Manzana">
  <option value="Banana">
  <option value="Cereza">
</datalist>
\`\`\`

### Fieldset y legend

\`<fieldset>\` agrupa campos relacionados dentro de un formulario, y \`<legend>\` le da un titulo al grupo.

\`\`\`html
<fieldset>
  <legend>Datos personales</legend>
  <input type="text" placeholder="Nombre">
  <input type="email" placeholder="Email">
</fieldset>
\`\`\`

### Por que usar fieldset?

- **Organiza** formularios largos en secciones
- **Mejora la accesibilidad:** los lectores de pantalla anuncian el legend al entrar al grupo
- **Estilo visual:** agrega un borde automatico alrededor del grupo`,
      codeExample: {
        html: `<form>
  <fieldset>
    <legend>Informacion personal</legend>
    <label>Nombre:</label><br>
    <input type="text" placeholder="Tu nombre"><br><br>
    <label>Pais:</label><br>
    <input list="paises" placeholder="Selecciona o escribe">
    <datalist id="paises">
      <option value="Mexico">
      <option value="Argentina">
      <option value="Colombia">
      <option value="Espana">
      <option value="Chile">
    </datalist>
  </fieldset>

  <fieldset>
    <legend>Preferencias</legend>
    <label>Color favorito:</label><br>
    <input type="color" value="#00b894">
  </fieldset>
</form>`,
        css: `form {
  font-family: sans-serif;
  max-width: 400px;
}
fieldset {
  margin-bottom: 16px;
  padding: 16px;
  border: 2px solid #6c5ce7;
  border-radius: 8px;
}
legend {
  font-weight: bold;
  color: #6c5ce7;
  padding: 0 8px;
}
input {
  padding: 6px;
  margin-top: 4px;
}`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "html09-leccion-03",
      title: "Validacion y atributos de formulario",
      content: `## Validacion y atributos de formulario

HTML5 incluye atributos poderosos para validar formularios sin JavaScript.

### Atributos de validacion

| Atributo | Funcion |
|----------|---------|
| \`required\` | El campo es obligatorio |
| \`pattern\` | Expresion regular que el valor debe cumplir |
| \`min\` / \`max\` | Valor minimo y maximo (numeros y fechas) |
| \`step\` | Incremento permitido |
| \`minlength\` / \`maxlength\` | Longitud minima y maxima del texto |

### Atributos de comportamiento

| Atributo | Funcion |
|----------|---------|
| \`placeholder\` | Texto de ayuda dentro del campo |
| \`disabled\` | Desactiva el campo (no se envia) |
| \`readonly\` | Solo lectura (si se envia) |
| \`autofocus\` | El campo recibe foco automaticamente |
| \`autocomplete\` | Activa o desactiva el autocompletado (\`on\`/\`off\`) |

### Ejemplo de pattern

\`\`\`html
<input type="text" pattern="[A-Za-z]{3,}" title="Minimo 3 letras">
\`\`\`

> **Importante:** La validacion HTML es una primera linea de defensa. Siempre valida tambien en el servidor.`,
      codeExample: {
        html: `<form onsubmit="event.preventDefault(); document.getElementById('msg').textContent='Formulario valido!'">
  <label>Usuario (solo letras, min 3):</label><br>
  <input type="text" pattern="[A-Za-z]{3,}" title="Minimo 3 letras" required><br><br>

  <label>Edad (18-99):</label><br>
  <input type="number" min="18" max="99" step="1" required><br><br>

  <label>Email:</label><br>
  <input type="email" required placeholder="tu@email.com"><br><br>

  <label>Campo de solo lectura:</label><br>
  <input type="text" value="No puedes editar esto" readonly><br><br>

  <button type="submit">Enviar</button>
  <p id="msg" style="color: green; font-weight: bold;"></p>
</form>`,
        css: `form {
  font-family: sans-serif;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  max-width: 400px;
}
label { font-weight: bold; }
input {
  padding: 8px;
  margin-top: 4px;
  border: 2px solid #ddd;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
}
input:valid { border-color: #00b894; }
input:invalid { border-color: #e17055; }
button {
  margin-top: 12px;
  padding: 10px 24px;
  background: #6c5ce7;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}`,
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "html09-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "Que tipo de input muestra un control deslizante para seleccionar un valor numerico?",
      options: [
        { id: "a", text: 'type="slider"', isCorrect: false },
        { id: "b", text: 'type="range"', isCorrect: true },
        { id: "c", text: 'type="number"', isCorrect: false },
        { id: "d", text: 'type="scale"', isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Este tipo crea una barra deslizable entre un min y un max.",
      explanation:
        'El tipo "range" genera un control deslizante. Se usa junto con los atributos min, max y step para controlar el rango de valores.',
    },
    {
      id: "html09-ej-02",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 2,
      prompt: "Que elemento HTML proporciona una lista de sugerencias para un campo de texto?",
      options: [
        { id: "a", text: "<select>", isCorrect: false },
        { id: "b", text: "<options>", isCorrect: false },
        { id: "c", text: "<datalist>", isCorrect: true },
        { id: "d", text: "<suggestions>", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Se conecta al input mediante el atributo list.",
      explanation:
        "<datalist> proporciona sugerencias de autocompletado para un input. A diferencia de <select>, el usuario puede escribir cualquier valor.",
    },
    {
      id: "html09-ej-03",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 3,
      prompt: "Completa el codigo para hacer que el campo de email sea obligatorio:",
      codeTemplate: {
        html: "",
        cssPrefix: '<input type="email" ',
        cssSuffix: ">",
        blanks: ["required"],
      },
      validation: { type: "exact", answer: "required" },
      hint: "Es un atributo booleano que indica que el campo debe completarse.",
      explanation:
        "El atributo required hace que el navegador no permita enviar el formulario si el campo esta vacio.",
    },
    {
      id: "html09-ej-04",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 4,
      prompt: "Cual es la diferencia entre disabled y readonly en un input?",
      options: [
        { id: "a", text: "No hay diferencia, son sinonimos", isCorrect: false },
        { id: "b", text: "disabled no envia el valor; readonly si lo envia", isCorrect: true },
        { id: "c", text: "readonly no envia el valor; disabled si lo envia", isCorrect: false },
        { id: "d", text: "disabled solo funciona en inputs de texto", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Piensa en que pasa cuando se envia el formulario.",
      explanation:
        "Un campo disabled no se puede editar NI se envia con el formulario. Un campo readonly no se puede editar pero SI se envia su valor.",
    },
    {
      id: "html09-ej-05",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 5,
      prompt: "Clasifica cada atributo segun su funcion en formularios:",
      dragItems: [
        { id: "drag-1", content: "required", correctZone: "zone-validacion" },
        { id: "drag-2", content: "pattern", correctZone: "zone-validacion" },
        { id: "drag-3", content: "placeholder", correctZone: "zone-ux" },
        { id: "drag-4", content: "autofocus", correctZone: "zone-ux" },
      ],
      dropZones: [
        { id: "zone-validacion", label: "Validacion" },
        { id: "zone-ux", label: "Experiencia de usuario" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-validacion",
          "drag-2": "zone-validacion",
          "drag-3": "zone-ux",
          "drag-4": "zone-ux",
        },
      },
      hint: "Piensa en cuales atributos impiden enviar el formulario y cuales mejoran la interfaz.",
      explanation:
        "required y pattern son atributos de validacion que impiden enviar datos incorrectos. placeholder y autofocus mejoran la experiencia del usuario sin validar nada.",
    },
    {
      id: "html09-ej-06",
      type: "code-completion",
      difficulty: 2,
      xpReward: 15,
      order: 6,
      prompt: "Completa el atributo para que el input solo acepte numeros entre 1 y 10:",
      codeTemplate: {
        html: "",
        cssPrefix: '<input type="number" min="1" ',
        cssSuffix: '="10">',
        blanks: ["max"],
      },
      validation: { type: "exact", answer: "max" },
      hint: "Es el atributo que define el valor maximo permitido.",
      explanation:
        "El atributo max establece el valor maximo que se puede ingresar en un input de tipo number, range o date.",
    },
    {
      id: "html09-ej-07",
      type: "quiz",
      difficulty: 3,
      xpReward: 15,
      order: 7,
      prompt: "Que hace el atributo pattern en un campo de texto?",
      options: [
        { id: "a", text: "Define el estilo visual del campo", isCorrect: false },
        { id: "b", text: "Establece una expresion regular que el valor debe cumplir", isCorrect: true },
        { id: "c", text: "Agrega un patron de fondo al input", isCorrect: false },
        { id: "d", text: "Define el orden de tabulacion", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Esta relacionado con la validacion del formato del texto ingresado.",
      explanation:
        'El atributo pattern acepta una expresion regular. Por ejemplo, pattern="[0-9]{5}" solo permite exactamente 5 digitos.',
    },
  ],
};
