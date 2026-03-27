import type { ModuleData } from "@/types";

export const jsFormulariosModule: ModuleData = {
  slug: "js-formularios",
  title: "Formularios en JavaScript",
  description:
    "Aprende a obtener valores de formularios, validar datos con regex, implementar validacion en tiempo real y usar la API FormData.",
  order: 116,
  dojo: "js",
  category: "js-intermediate",
  icon: "file-input",
  lessons: [
    {
      id: "js16-leccion-01",
      title: "Obtener valores de formularios",
      content: `## Obtener valores de formularios

Los formularios son la principal forma de interaccion del usuario con una aplicacion web. JavaScript nos permite capturar y procesar esos datos.

### Acceder a valores de inputs

\`\`\`javascript
// Por el valor de un input
const nombre = document.querySelector("#nombre").value;
const email = document.querySelector("#email").value;

// Checkbox
const aceptar = document.querySelector("#terminos").checked; // true o false

// Radio buttons
const genero = document.querySelector('input[name="genero"]:checked')?.value;

// Select
const pais = document.querySelector("#pais").value;
\`\`\`

### Evento submit del formulario

\`\`\`javascript
const form = document.querySelector("#mi-formulario");

form.addEventListener("submit", (e) => {
  e.preventDefault(); // Evitar recarga de pagina

  const datos = {
    nombre: document.querySelector("#nombre").value,
    email: document.querySelector("#email").value,
    mensaje: document.querySelector("#mensaje").value
  };

  console.log("Datos del formulario:", datos);
});
\`\`\`

### Limpiar un formulario

\`\`\`javascript
form.reset(); // Reinicia todos los campos a sus valores iniciales
\`\`\`

### Enfocar un campo

\`\`\`javascript
document.querySelector("#nombre").focus();
\`\`\`

> **Siempre** usa \`e.preventDefault()\` en el submit para manejar el formulario con JavaScript y evitar la recarga de la pagina.`,
      codeExample: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <form id="formulario">
    <input id="nombre" type="text" placeholder="Nombre" style="padding: 8px; margin: 4px; display: block; width: 95%;">
    <input id="email" type="email" placeholder="Email" style="padding: 8px; margin: 4px; display: block; width: 95%;">
    <button type="submit" style="padding: 8px 16px; margin: 4px; cursor: pointer;">Enviar</button>
  </form>
  <div id="resultado" style="margin-top: 12px;"></div>
</div>
<script>
document.getElementById("formulario").addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;
  document.getElementById("resultado").textContent =
    "Nombre: " + nombre + " | Email: " + email;
});
</script>`,
        css: "",
        editable: false,
      },
      order: 1,
    },
    {
      id: "js16-leccion-02",
      title: "Validacion con expresiones regulares",
      content: `## Validacion con expresiones regulares

Las **expresiones regulares** (regex) permiten validar que los datos del usuario cumplan con un formato especifico.

### Crear una expresion regular

\`\`\`javascript
// Literal
const patron = /^[a-z]+$/;

// Constructor
const patron2 = new RegExp("^[a-z]+$");
\`\`\`

### Metodo test()

Retorna \`true\` o \`false\`:

\`\`\`javascript
const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
console.log(emailRegex.test("ana@correo.com")); // true
console.log(emailRegex.test("invalido"));        // false
\`\`\`

### Patrones comunes de validacion

\`\`\`javascript
// Email
const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

// Telefono (10 digitos)
const telefonoRegex = /^\\d{10}$/;

// Solo letras y espacios
const nombreRegex = /^[a-zA-ZaeiouAEIOU\\s]+$/;

// Contrasena (min 8 caracteres, una mayuscula, un numero)
const passRegex = /^(?=.*[A-Z])(?=.*\\d).{8,}$/;

// URL
const urlRegex = /^https?:\\/\\/.+/;
\`\`\`

### Ejemplo de validacion

\`\`\`javascript
function validarEmail(email) {
  const regex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return regex.test(email);
}

function validarTelefono(telefono) {
  const regex = /^\\d{10}$/;
  return regex.test(telefono);
}

console.log(validarEmail("ana@correo.com")); // true
console.log(validarTelefono("5512345678"));  // true
\`\`\`

> **Tip:** No intentes validar todo con regex. Para validaciones complejas, usa bibliotecas especializadas.`,
      codeExample: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <input id="email" type="text" placeholder="Ingresa un email" style="padding: 8px; font-size: 16px; width: 100%; box-sizing: border-box;">
  <div id="resultado" style="margin-top: 12px;"></div>
</div>
<script>
const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
document.getElementById("email").addEventListener("input", (e) => {
  const valido = emailRegex.test(e.target.value);
  const resultado = document.getElementById("resultado");
  resultado.textContent = valido ? "Email valido" : "Email invalido";
  resultado.style.color = valido ? "green" : "red";
});
</script>`,
        css: "",
        editable: false,
      },
      order: 2,
    },
    {
      id: "js16-leccion-03",
      title: "Validacion en tiempo real y FormData",
      content: `## Validacion en tiempo real y FormData

### Validacion en tiempo real

Valida mientras el usuario escribe, usando el evento \`input\`:

\`\`\`javascript
const nombreInput = document.querySelector("#nombre");
const errorSpan = document.querySelector("#nombre-error");

nombreInput.addEventListener("input", (e) => {
  const valor = e.target.value;

  if (valor.length < 3) {
    errorSpan.textContent = "El nombre debe tener al menos 3 caracteres";
    nombreInput.style.borderColor = "red";
  } else if (!/^[a-zA-Z\\s]+$/.test(valor)) {
    errorSpan.textContent = "Solo se permiten letras y espacios";
    nombreInput.style.borderColor = "red";
  } else {
    errorSpan.textContent = "";
    nombreInput.style.borderColor = "green";
  }
});
\`\`\`

### Validar antes de enviar

\`\`\`javascript
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const errores = [];

  if (!nombre.value.trim()) errores.push("El nombre es obligatorio");
  if (!emailRegex.test(email.value)) errores.push("Email invalido");
  if (mensaje.value.length < 10) errores.push("Mensaje muy corto");

  if (errores.length > 0) {
    mostrarErrores(errores);
    return;
  }

  // Enviar datos...
});
\`\`\`

### FormData API

\`FormData\` extrae automaticamente todos los valores de un formulario:

\`\`\`javascript
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);

  // Obtener un valor
  const nombre = formData.get("nombre");

  // Iterar todos los campos
  for (const [clave, valor] of formData) {
    console.log(clave + ": " + valor);
  }

  // Convertir a objeto
  const datos = Object.fromEntries(formData);
  console.log(datos);
  // { nombre: "Ana", email: "ana@correo.com", ... }
});
\`\`\`

> **Ventaja de FormData:** No necesitas seleccionar cada input individualmente. FormData los captura todos si tienen atributo \`name\`.`,
      codeExample: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <form id="registro">
    <input name="nombre" placeholder="Nombre (min 3 caracteres)" style="padding: 8px; margin: 4px; display: block; width: 95%;">
    <input name="email" placeholder="Email" style="padding: 8px; margin: 4px; display: block; width: 95%;">
    <input name="telefono" placeholder="Telefono (10 digitos)" style="padding: 8px; margin: 4px; display: block; width: 95%;">
    <button type="submit" style="padding: 8px 16px; margin: 4px; cursor: pointer;">Registrar</button>
  </form>
  <div id="resultado" style="margin-top: 12px;"></div>
</div>
<script>
document.getElementById("registro").addEventListener("submit", (e) => {
  e.preventDefault();
  const datos = Object.fromEntries(new FormData(e.target));
  const errores = [];
  if (datos.nombre.length < 3) errores.push("Nombre muy corto");
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(datos.email)) errores.push("Email invalido");
  if (!/^\\d{10}$/.test(datos.telefono)) errores.push("Telefono invalido");
  const resultado = document.getElementById("resultado");
  if (errores.length) {
    resultado.innerHTML = "<span style='color:red'>" + errores.join("<br>") + "</span>";
  } else {
    resultado.innerHTML = "<span style='color:green'>Datos validos: " + JSON.stringify(datos) + "</span>";
  }
});
</script>`,
        css: "",
        editable: false,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "js16-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "¿Que debes hacer siempre en el evento submit de un formulario manejado con JavaScript?",
      options: [
        { id: "a", text: "Llamar a form.reset()", isCorrect: false },
        { id: "b", text: "Llamar a e.preventDefault()", isCorrect: true },
        { id: "c", text: "Llamar a e.stopPropagation()", isCorrect: false },
        { id: "d", text: "Llamar a form.submit()", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Necesitas evitar el comportamiento por defecto del formulario.",
      explanation: "`e.preventDefault()` evita que el formulario se envie y recargue la pagina.",
    },
    {
      id: "js16-ej-02",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 2,
      prompt: "Obtiene el valor del input con id 'email'.",
      codeTemplate: {
        html: "",
        cssPrefix: 'const email = document.querySelector("#email").',
        cssSuffix: ";\nconsole.log(email);",
        blanks: ["value"],
      },
      validation: { type: "exact", answer: "value" },
      hint: "La propiedad que contiene el texto escrito en un input.",
      explanation: "La propiedad `value` contiene el valor actual de un campo de formulario.",
    },
    {
      id: "js16-ej-03",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 3,
      prompt: "¿Que metodo de las expresiones regulares retorna true o false?",
      options: [
        { id: "a", text: "regex.match(string)", isCorrect: false },
        { id: "b", text: "regex.test(string)", isCorrect: true },
        { id: "c", text: "regex.exec(string)", isCorrect: false },
        { id: "d", text: "regex.validate(string)", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Es un metodo que 'prueba' si el string cumple con el patron.",
      explanation: "`regex.test(string)` retorna `true` si el string coincide con la expresion regular.",
    },
    {
      id: "js16-ej-04",
      type: "code-completion",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt: "Valida que el email tenga un formato correcto usando regex.test().",
      codeTemplate: {
        html: "",
        cssPrefix: 'const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\nconst email = "ana@correo.com";\nconst esValido = emailRegex.',
        cssSuffix: ";\nconsole.log(esValido); // true",
        blanks: ["test(email)"],
      },
      validation: { type: "regex", answer: "test\\s*\\(\\s*email\\s*\\)" },
      hint: "Usa el metodo test pasando el string a validar.",
      explanation: "`emailRegex.test(email)` verifica si el email cumple con el patron regex.",
    },
    {
      id: "js16-ej-05",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 5,
      prompt: "Relaciona cada expresion regular con lo que valida.",
      dragItems: [
        { id: "d1", content: "/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/", correctZone: "email" },
        { id: "d2", content: "/^\\d{10}$/", correctZone: "telefono" },
        { id: "d3", content: "/^[a-zA-Z\\s]+$/", correctZone: "nombre" },
        { id: "d4", content: "/^.{8,}$/", correctZone: "password" },
      ],
      dropZones: [
        { id: "email", label: "Formato de email" },
        { id: "telefono", label: "Telefono de 10 digitos" },
        { id: "nombre", label: "Solo letras y espacios" },
        { id: "password", label: "Minimo 8 caracteres" },
      ],
      validation: { type: "exact", answer: { d1: "email", d2: "telefono", d3: "nombre", d4: "password" } },
      hint: "Analiza los simbolos: @ indica email, \\d digitos, [a-zA-Z] letras, {8,} minimo 8.",
      explanation: "Cada regex tiene patrones especificos: @ para email, \\d{10} para 10 digitos, [a-zA-Z] para letras.",
    },
    {
      id: "js16-ej-06",
      type: "code-completion",
      difficulty: 2,
      xpReward: 20,
      order: 6,
      prompt: "Usa FormData para obtener todos los datos del formulario como un objeto.",
      codeTemplate: {
        html: "",
        cssPrefix: 'const form = document.querySelector("#mi-form");\nform.addEventListener("submit", (e) => {\n  e.preventDefault();\n  const datos = Object.fromEntries(',
        cssSuffix: ");\n  console.log(datos);\n});",
        blanks: ["new FormData(form)"],
      },
      validation: { type: "regex", answer: "new\\s+FormData\\s*\\(\\s*(form|e\\.target)\\s*\\)" },
      hint: "Crea un nuevo FormData pasando el formulario como argumento.",
      explanation: "`new FormData(form)` extrae todos los campos y `Object.fromEntries` lo convierte a objeto.",
    },
    {
      id: "js16-ej-07",
      type: "live-editor",
      difficulty: 3,
      xpReward: 30,
      order: 7,
      prompt: "Crea un formulario con validacion en tiempo real: el campo nombre debe tener al menos 3 caracteres y el email debe ser valido. Muestra mensajes de error debajo de cada campo.",
      codeTemplate: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <form id="formulario">
    <div style="margin-bottom: 12px;">
      <input id="nombre" type="text" placeholder="Nombre" style="padding: 8px; width: 100%; box-sizing: border-box;">
      <div id="error-nombre" style="color: red; font-size: 12px; margin-top: 4px;"></div>
    </div>
    <div style="margin-bottom: 12px;">
      <input id="email" type="text" placeholder="Email" style="padding: 8px; width: 100%; box-sizing: border-box;">
      <div id="error-email" style="color: red; font-size: 12px; margin-top: 4px;"></div>
    </div>
    <button type="submit" style="padding: 8px 16px; cursor: pointer;">Enviar</button>
  </form>
  <div id="resultado" style="margin-top: 12px;"></div>
</div>
<script>
const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

// Agrega validacion en tiempo real al campo nombre

// Agrega validacion en tiempo real al campo email

// Valida todo al enviar el formulario

</script>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      validation: { type: "includes", answer: "addEventListener" },
      hint: "Usa el evento 'input' en cada campo para validar mientras el usuario escribe.",
      explanation: "Escucha el evento 'input' en cada campo, valida con regex/longitud y muestra errores en los divs correspondientes.",
    },
  ],
};
