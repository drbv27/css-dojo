import type { ModuleData } from "@/types";

export const jsFetchApiModule: ModuleData = {
  slug: "js-fetch-api",
  title: "Fetch API",
  description:
    "Aprende a hacer peticiones HTTP con fetch: GET, POST, manejar respuestas JSON y errores de red.",
  order: 118,
  category: "js-advanced",
  icon: "Globe",
  dojo: "js",
  lessons: [
    {
      id: "js18-leccion-01",
      title: "Peticiones GET con fetch",
      content: `## Fetch API

**fetch()** es la forma moderna de hacer peticiones HTTP desde el navegador.

### Sintaxis basica
\`\`\`javascript
fetch("https://api.ejemplo.com/datos")
  .then(function(response) { return response.json(); })
  .then(function(datos) { console.log(datos); })
  .catch(function(error) { console.error(error); });
\`\`\`

### Con async/await
\`\`\`javascript
async function obtenerDatos() {
  try {
    const response = await fetch(url);
    const datos = await response.json();
    return datos;
  } catch (error) {
    console.error("Error:", error);
  }
}
\`\`\`

### El objeto Response
\`\`\`javascript
response.ok        // true si status 200-299
response.status    // codigo HTTP (200, 404, etc.)
response.json()    // parsear como JSON
response.text()    // obtener como texto
response.headers   // headers de respuesta
\`\`\`

> **Nota:** fetch NO rechaza la Promise en errores HTTP (404, 500). Solo rechaza en errores de red. Debes verificar \`response.ok\`.`,
      codeExample: {
        html: '<button id="cargar">Cargar usuarios</button>\n<div id="resultado"></div>',
        css: '#cargar { padding: 8px 16px; background: #89b4fa; color: #1e1e2e; border: none; border-radius: 4px; cursor: pointer; } #resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #a6e3a1; border-radius: 8px; white-space: pre-line; margin-top: 8px; min-height: 80px; font-size: 13px; }',
        js: `var resultado = document.getElementById("resultado");

document.getElementById("cargar").addEventListener("click", function() {
  resultado.textContent = "Cargando...";

  fetch("https://jsonplaceholder.typicode.com/users?_limit=3")
    .then(function(response) {
      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }
      return response.json();
    })
    .then(function(usuarios) {
      var salida = ["Usuarios cargados:"];
      usuarios.forEach(function(u) {
        salida.push("  " + u.id + ". " + u.name + " (" + u.email + ")");
      });
      resultado.textContent = salida.join("\\n");
    })
    .catch(function(error) {
      resultado.textContent = "Error: " + error.message;
    });
});`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "js18-leccion-02",
      title: "Peticiones POST",
      content: `## Peticiones POST con fetch

Para enviar datos al servidor:

\`\`\`javascript
fetch("https://api.ejemplo.com/datos", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    nombre: "Ana",
    email: "ana@email.com"
  })
})
\`\`\`

### Opciones de fetch
| Opcion | Descripcion |
|--------|-------------|
| \`method\` | GET, POST, PUT, DELETE, PATCH |
| \`headers\` | Headers de la peticion |
| \`body\` | Datos a enviar (string o FormData) |
| \`mode\` | cors, no-cors, same-origin |
| \`credentials\` | include, same-origin, omit |

### Otros metodos HTTP
\`\`\`javascript
// PUT - actualizar
fetch(url, { method: "PUT", body: JSON.stringify(datos) })

// DELETE - eliminar
fetch(url, { method: "DELETE" })

// PATCH - actualizar parcialmente
fetch(url, { method: "PATCH", body: JSON.stringify(cambios) })
\`\`\`

> **Content-Type** debe ser "application/json" cuando envias JSON. Si usas FormData, no lo pongas (el navegador lo configura automaticamente).`,
      codeExample: {
        html: '<input id="titulo" placeholder="Titulo del post" />\n<textarea id="cuerpo" placeholder="Contenido..." rows="2"></textarea>\n<button id="enviar">Enviar POST</button>\n<div id="resultado"></div>',
        css: 'input, textarea { display: block; width: 100%; margin: 4px 0; padding: 8px; border: 1px solid #45475a; border-radius: 4px; background: #313244; color: #cdd6f4; box-sizing: border-box; } #enviar { padding: 8px 16px; background: #a6e3a1; color: #1e1e2e; border: none; border-radius: 4px; cursor: pointer; margin-top: 4px; } #resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #89b4fa; border-radius: 8px; white-space: pre-line; margin-top: 8px; font-size: 13px; }',
        js: `var resultado = document.getElementById("resultado");

document.getElementById("enviar").addEventListener("click", function() {
  var titulo = document.getElementById("titulo").value || "Sin titulo";
  var cuerpo = document.getElementById("cuerpo").value || "Sin contenido";

  resultado.textContent = "Enviando...";

  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: titulo,
      body: cuerpo,
      userId: 1
    })
  })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      resultado.textContent = "Post creado!\\n" + JSON.stringify(data, null, 2);
    })
    .catch(function(err) {
      resultado.textContent = "Error: " + err.message;
    });
});`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "js18-leccion-03",
      title: "Manejo avanzado de errores",
      content: `## Manejo robusto de errores

### Patron recomendado

\`\`\`javascript
async function fetchConManejo(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("HTTP " + response.status + ": " + response.statusText);
    }

    const datos = await response.json();
    return datos;
  } catch (error) {
    if (error.name === "TypeError") {
      // Error de red (sin conexion)
      console.error("Sin conexion a internet");
    } else {
      console.error(error.message);
    }
    throw error;
  }
}
\`\`\`

### Estados de carga

Un buen UX necesita manejar 3 estados:
1. **Cargando** — spinner o skeleton
2. **Exito** — mostrar datos
3. **Error** — mensaje de error

### AbortController — Cancelar peticiones

\`\`\`javascript
const controller = new AbortController();
fetch(url, { signal: controller.signal });
controller.abort(); // cancela la peticion
\`\`\`

> Siempre muestra al usuario que esta pasando: cargando, exito o error.`,
      codeExample: {
        html: '<button id="exito">Peticion exitosa</button>\n<button id="error">Peticion con error</button>\n<div id="resultado"></div>',
        css: 'button { margin: 4px; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; } #exito { background: #a6e3a1; color: #1e1e2e; } #error { background: #f38ba8; color: #1e1e2e; } #resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #f9e2af; border-radius: 8px; white-space: pre-line; margin-top: 8px; min-height: 60px; }',
        js: `var resultado = document.getElementById("resultado");

async function hacerPeticion(url) {
  resultado.textContent = "Cargando...";
  resultado.style.color = "#f9e2af";

  try {
    var response = await fetch(url);
    if (!response.ok) {
      throw new Error("HTTP " + response.status);
    }
    var datos = await response.json();
    resultado.style.color = "#a6e3a1";
    resultado.textContent = "Exito! Se obtuvieron " + (Array.isArray(datos) ? datos.length : 1) + " registros.\\nPrimer dato: " + JSON.stringify(datos[0] || datos).substring(0, 100) + "...";
  } catch (error) {
    resultado.style.color = "#f38ba8";
    resultado.textContent = "Error: " + error.message;
  }
}

document.getElementById("exito").addEventListener("click", function() {
  hacerPeticion("https://jsonplaceholder.typicode.com/posts?_limit=5");
});

document.getElementById("error").addEventListener("click", function() {
  hacerPeticion("https://jsonplaceholder.typicode.com/noexiste");
});`,
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "js18-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "Que metodo se usa para hacer peticiones HTTP en JavaScript moderno?",
      options: [
        { id: "a", text: "XMLHttpRequest", isCorrect: false },
        { id: "b", text: "fetch()", isCorrect: true },
        { id: "c", text: "http.get()", isCorrect: false },
        { id: "d", text: "ajax()", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Es una API nativa del navegador.",
      explanation: "fetch() es la API moderna para hacer peticiones HTTP. XMLHttpRequest es la forma antigua.",
    },
    {
      id: "js18-ej-02",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 2,
      prompt: "Que metodo convierte la respuesta de fetch a un objeto JavaScript?",
      options: [
        { id: "a", text: "response.parse()", isCorrect: false },
        { id: "b", text: "response.json()", isCorrect: true },
        { id: "c", text: "response.toJSON()", isCorrect: false },
        { id: "d", text: "JSON.parse(response)", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Es un metodo del objeto Response.",
      explanation: "response.json() parsea el cuerpo de la respuesta como JSON y devuelve una Promise con el objeto resultante.",
    },
    {
      id: "js18-ej-03",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 3,
      prompt: "fetch rechaza la Promise cuando el servidor devuelve un error 404?",
      options: [
        { id: "a", text: "Si, siempre rechaza en errores HTTP", isCorrect: false },
        { id: "b", text: "No, solo rechaza en errores de red", isCorrect: true },
        { id: "c", text: "Depende del navegador", isCorrect: false },
        { id: "d", text: "Solo si se configura explicitamente", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Debes verificar response.ok manualmente.",
      explanation: "fetch solo rechaza la Promise en errores de red (sin conexion). Para errores HTTP (404, 500), debes verificar response.ok.",
    },
    {
      id: "js18-ej-04",
      type: "code-completion",
      difficulty: 2,
      xpReward: 15,
      order: 4,
      prompt: "Completa el header para indicar que envias datos JSON:",
      codeTemplate: {
        html: "",
        cssPrefix: 'headers: { "Content-Type": "application/',
        cssSuffix: '" }',
        blanks: ["json"],
      },
      validation: { type: "exact", answer: "json" },
      hint: "El tipo de contenido para JSON.",
      explanation: '"application/json" indica al servidor que el cuerpo de la peticion contiene datos en formato JSON.',
    },
    {
      id: "js18-ej-05",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 5,
      prompt: "Que propiedad de response indica si la peticion fue exitosa (status 200-299)?",
      options: [
        { id: "a", text: "response.success", isCorrect: false },
        { id: "b", text: "response.ok", isCorrect: true },
        { id: "c", text: "response.valid", isCorrect: false },
        { id: "d", text: "response.done", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Es un booleano simple: ok o no ok.",
      explanation: "response.ok es true si el status HTTP esta entre 200 y 299.",
    },
    {
      id: "js18-ej-06",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 6,
      prompt: "Que metodo HTTP se usa para enviar nuevos datos al servidor?",
      options: [
        { id: "a", text: "GET", isCorrect: false },
        { id: "b", text: "POST", isCorrect: true },
        { id: "c", text: "PUT", isCorrect: false },
        { id: "d", text: "DELETE", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "POST = enviar/crear nuevos datos.",
      explanation: "POST se usa para crear nuevos recursos. GET para leer, PUT para actualizar, DELETE para eliminar.",
    },
  ],
};
