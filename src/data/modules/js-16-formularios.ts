import type { ModuleData } from "@/types";

export const jsFormulariosModule: ModuleData = {
  slug: "js-formularios",
  title: "Formularios",
  description:
    "Aprende a manejar formularios con JavaScript: obtener valores, validacion y envio de datos.",
  order: 116,
  category: "js-intermediate",
  icon: "FormInput",
  dojo: "js",
  lessons: [
    {
      id: "js16-leccion-01",
      title: "Obtener valores de inputs",
      content: `## Formularios en JavaScript

### Acceder a elementos del formulario
\`\`\`javascript
const input = document.getElementById("nombre");
input.value       // obtener valor actual
input.value = ""; // limpiar
\`\`\`

### Tipos de input
| Tipo | Obtener valor |
|------|--------------|
| text, email, password | \`input.value\` |
| checkbox | \`input.checked\` (boolean) |
| radio | \`input.checked\` + \`input.value\` |
| select | \`select.value\` |
| textarea | \`textarea.value\` |

### Evento input vs change
- \`input\` — se dispara con cada tecla
- \`change\` — se dispara al perder el foco (blur)

\`\`\`javascript
campo.addEventListener("input", function(e) {
  console.log(e.target.value); // valor en tiempo real
});
\`\`\`

> **Tip:** El evento \`input\` es ideal para mostrar previsualizaciones en tiempo real.`,
      codeExample: {
        html: '<input id="nombre" placeholder="Tu nombre" />\n<input id="edad" type="number" placeholder="Tu edad" />\n<select id="lenguaje">\n  <option value="">Selecciona...</option>\n  <option value="js">JavaScript</option>\n  <option value="py">Python</option>\n  <option value="ts">TypeScript</option>\n</select>\n<div id="resultado"></div>',
        css: 'input, select { display: block; margin: 4px 0; padding: 8px; border: 1px solid #45475a; border-radius: 4px; background: #313244; color: #cdd6f4; } #resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #a6e3a1; border-radius: 8px; white-space: pre-line; margin-top: 8px; }',
        js: `var campos = ["nombre", "edad", "lenguaje"];
var resultado = document.getElementById("resultado");

function actualizar() {
  var nombre = document.getElementById("nombre").value || "(vacio)";
  var edad = document.getElementById("edad").value || "(vacio)";
  var lenguaje = document.getElementById("lenguaje").value || "(no seleccionado)";
  resultado.textContent = "Nombre: " + nombre + "\\nEdad: " + edad + "\\nLenguaje: " + lenguaje;
}

campos.forEach(function(id) {
  document.getElementById(id).addEventListener("input", actualizar);
});

actualizar();`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "js16-leccion-02",
      title: "Validacion de formularios",
      content: `## Validacion con JavaScript

### Validacion basica
\`\`\`javascript
function validar(valor) {
  if (!valor.trim()) return "El campo es obligatorio";
  if (valor.length < 3) return "Minimo 3 caracteres";
  return null; // sin errores
}
\`\`\`

### Validar email con regex
\`\`\`javascript
function validarEmail(email) {
  const regex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return regex.test(email);
}
\`\`\`

### Mostrar errores
\`\`\`javascript
function mostrarError(campo, mensaje) {
  const error = campo.nextElementSibling;
  error.textContent = mensaje;
  campo.classList.add("invalido");
}
\`\`\`

### Validacion HTML5
HTML5 tiene validacion nativa:
\`\`\`html
<input required minlength="3" maxlength="50">
<input type="email" required>
<input type="number" min="0" max="100">
\`\`\`

Pero JavaScript te da **control total** sobre mensajes y logica.

> **Recuerda:** Siempre valida tambien en el servidor. La validacion del frontend puede ser evadida.`,
      codeExample: {
        html: '<form id="formulario">\n  <input id="email" placeholder="Email" />\n  <span class="error"></span>\n  <input id="pass" type="password" placeholder="Contrasena (min 6)" />\n  <span class="error"></span>\n  <button type="submit">Enviar</button>\n</form>\n<div id="resultado"></div>',
        css: 'form { display: flex; flex-direction: column; gap: 4px; } input { padding: 8px; border: 1px solid #45475a; border-radius: 4px; background: #313244; color: #cdd6f4; } input.invalido { border-color: #f38ba8; } .error { color: #f38ba8; font-size: 12px; min-height: 16px; } button { padding: 8px; background: #a6e3a1; color: #1e1e2e; border: none; border-radius: 4px; cursor: pointer; } #resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #a6e3a1; border-radius: 8px; white-space: pre-line; margin-top: 8px; }',
        js: `var form = document.getElementById("formulario");
var emailInput = document.getElementById("email");
var passInput = document.getElementById("pass");
var errores = document.querySelectorAll(".error");

function validarEmail(email) {
  if (!email) return "Email es obligatorio";
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) return "Email no valido";
  return "";
}

function validarPass(pass) {
  if (!pass) return "Contrasena es obligatoria";
  if (pass.length < 6) return "Minimo 6 caracteres";
  return "";
}

form.addEventListener("submit", function(e) {
  e.preventDefault();
  var errEmail = validarEmail(emailInput.value);
  var errPass = validarPass(passInput.value);

  errores[0].textContent = errEmail;
  errores[1].textContent = errPass;
  emailInput.classList.toggle("invalido", !!errEmail);
  passInput.classList.toggle("invalido", !!errPass);

  if (!errEmail && !errPass) {
    document.getElementById("resultado").textContent = "Formulario valido!\\nEmail: " + emailInput.value;
  }
});`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "js16-leccion-03",
      title: "FormData y envio",
      content: `## FormData

La API **FormData** permite recopilar todos los datos de un formulario facilmente:

\`\`\`javascript
const form = document.getElementById("miForm");
form.addEventListener("submit", function(e) {
  e.preventDefault();
  const datos = new FormData(form);

  // Acceder a valores
  datos.get("nombre");    // valor del campo "nombre"
  datos.getAll("hobby");  // todos los valores de "hobby"

  // Iterar
  for (const [clave, valor] of datos) {
    console.log(clave + ": " + valor);
  }
});
\`\`\`

### Convertir a objeto
\`\`\`javascript
const obj = Object.fromEntries(datos);
\`\`\`

### Reset del formulario
\`\`\`javascript
form.reset(); // limpia todos los campos
\`\`\`

### Deshabilitar campos
\`\`\`javascript
boton.disabled = true;  // deshabilita
boton.disabled = false; // habilita
\`\`\`

> **FormData** es especialmente util con formularios grandes y cuando necesitas enviar datos al servidor.`,
      codeExample: {
        html: '<form id="registro">\n  <input name="nombre" placeholder="Nombre" required />\n  <input name="email" type="email" placeholder="Email" required />\n  <select name="plan">\n    <option value="free">Gratuito</option>\n    <option value="pro">Pro</option>\n    <option value="enterprise">Enterprise</option>\n  </select>\n  <button type="submit">Registrar</button>\n  <button type="button" id="reset">Limpiar</button>\n</form>\n<div id="resultado"></div>',
        css: 'form { display: flex; flex-direction: column; gap: 4px; } input, select { padding: 8px; border: 1px solid #45475a; border-radius: 4px; background: #313244; color: #cdd6f4; } button { padding: 8px; border: none; border-radius: 4px; cursor: pointer; } button[type="submit"] { background: #a6e3a1; color: #1e1e2e; } #reset { background: #45475a; color: #cdd6f4; } #resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #89b4fa; border-radius: 8px; white-space: pre-line; margin-top: 8px; }',
        js: `var form = document.getElementById("registro");
var resultado = document.getElementById("resultado");

form.addEventListener("submit", function(e) {
  e.preventDefault();
  var datos = new FormData(form);
  var salida = ["Datos del formulario:"];

  datos.forEach(function(valor, clave) {
    salida.push("  " + clave + ": " + valor);
  });

  // Convertir a objeto
  var obj = {};
  datos.forEach(function(valor, clave) { obj[clave] = valor; });
  salida.push("\\nComo objeto JSON:");
  salida.push(JSON.stringify(obj, null, 2));

  resultado.textContent = salida.join("\\n");
});

document.getElementById("reset").addEventListener("click", function() {
  form.reset();
  resultado.textContent = "Formulario limpiado.";
});`,
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "js16-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "Que propiedad se usa para obtener el valor de un input de texto?",
      options: [
        { id: "a", text: "input.text", isCorrect: false },
        { id: "b", text: "input.value", isCorrect: true },
        { id: "c", text: "input.content", isCorrect: false },
        { id: "d", text: "input.data", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "value = valor.",
      explanation: "input.value devuelve el texto actual escrito en el campo de entrada.",
    },
    {
      id: "js16-ej-02",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt: "Que metodo previene que un formulario se envie y recargue la pagina?",
      options: [
        { id: "a", text: "e.stopPropagation()", isCorrect: false },
        { id: "b", text: "e.preventDefault()", isCorrect: true },
        { id: "c", text: "e.cancel()", isCorrect: false },
        { id: "d", text: "return false", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Previene el comportamiento por defecto del evento.",
      explanation: "e.preventDefault() evita que el formulario se envie y la pagina se recargue.",
    },
    {
      id: "js16-ej-03",
      type: "code-completion",
      difficulty: 1 ,
      xpReward: 10,
      order: 3,
      prompt: "Completa para obtener si un checkbox esta marcado:",
      codeTemplate: {
        html: "",
        cssPrefix: "const marcado = checkbox.",
        cssSuffix: ";",
        blanks: ["checked"],
      },
      validation: { type: "exact", answer: "checked" },
      hint: "checked = marcado.",
      explanation: "checkbox.checked devuelve true si el checkbox esta marcado, false si no.",
    },
    {
      id: "js16-ej-04",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt: "Cual es la diferencia entre los eventos 'input' y 'change'?",
      options: [
        { id: "a", text: "No hay diferencia", isCorrect: false },
        { id: "b", text: "input se dispara con cada tecla, change al perder foco", isCorrect: true },
        { id: "c", text: "change es para checkboxes, input para textos", isCorrect: false },
        { id: "d", text: "input es para formularios, change para otros elementos", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Uno es en tiempo real, el otro al terminar de editar.",
      explanation: "El evento input se dispara con cada cambio (cada tecla). El evento change se dispara cuando el campo pierde el foco.",
    },
    {
      id: "js16-ej-05",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt: "Que hace form.reset()?",
      options: [
        { id: "a", text: "Elimina el formulario del DOM", isCorrect: false },
        { id: "b", text: "Envia el formulario", isCorrect: false },
        { id: "c", text: "Restaura todos los campos a sus valores iniciales", isCorrect: true },
        { id: "d", text: "Deshabilita todos los campos", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Reset = reiniciar.",
      explanation: "form.reset() restaura todos los campos del formulario a sus valores iniciales/por defecto.",
    },
    {
      id: "js16-ej-06",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 6,
      prompt: "Por que se debe validar en el servidor ademas del frontend?",
      options: [
        { id: "a", text: "Porque JavaScript es lento", isCorrect: false },
        { id: "b", text: "Porque la validacion del frontend puede ser evadida por el usuario", isCorrect: true },
        { id: "c", text: "Porque el navegador no soporta validacion", isCorrect: false },
        { id: "d", text: "No es necesario validar en el servidor", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Un usuario puede desactivar JavaScript o modificar las peticiones.",
      explanation: "La validacion del frontend puede ser evadida desactivando JavaScript o manipulando las peticiones HTTP. La validacion del servidor es imprescindible.",
    },
  ],
};
