import type { ModuleData } from "@/types";

export const jsAsincronismoModule: ModuleData = {
  slug: "js-asincronismo",
  title: "Asincronismo",
  description:
    "Comprende el modelo asincrono de JavaScript: callbacks, Promises y async/await.",
  order: 117,
  category: "js-advanced",
  icon: "Clock",
  dojo: "js",
  lessons: [
    {
      id: "js17-leccion-01",
      title: "JavaScript asincrono",
      content: `## Asincronismo en JavaScript

JavaScript es **single-threaded** (un solo hilo), pero puede manejar operaciones asincronas gracias al **Event Loop**.

### Operaciones asincronas comunes
- Peticiones de red (fetch, AJAX)
- Temporizadores (setTimeout, setInterval)
- Lectura de archivos
- Interacciones del usuario

### setTimeout y setInterval

\`\`\`javascript
// Ejecutar una vez despues de 2 segundos
setTimeout(function() {
  console.log("2 segundos despues");
}, 2000);

// Ejecutar cada segundo
const id = setInterval(function() {
  console.log("Cada segundo");
}, 1000);

// Detener el intervalo
clearInterval(id);
\`\`\`

### Callbacks

Un **callback** es una funcion que se pasa como argumento para ejecutarse despues:

\`\`\`javascript
function hacerAlgo(callback) {
  setTimeout(function() {
    callback("Listo!");
  }, 1000);
}
hacerAlgo(function(resultado) {
  console.log(resultado);
});
\`\`\`

> **Callback Hell:** Anidar muchos callbacks crea codigo dificil de leer. Promises resuelven este problema.`,
      codeExample: {
        html: '<button id="iniciar">Iniciar secuencia</button>\n<div id="resultado"></div>',
        css: '#iniciar { padding: 8px 16px; background: #89b4fa; color: #1e1e2e; border: none; border-radius: 4px; cursor: pointer; } #resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #a6e3a1; border-radius: 8px; white-space: pre-line; margin-top: 8px; min-height: 100px; }',
        js: `var resultado = document.getElementById("resultado");
var lineas = [];

function agregar(texto) {
  lineas.push(texto);
  resultado.textContent = lineas.join("\\n");
}

document.getElementById("iniciar").addEventListener("click", function() {
  lineas = [];
  agregar("Inicio: " + new Date().toLocaleTimeString());

  setTimeout(function() {
    agregar("Paso 1 (despues de 500ms)");

    setTimeout(function() {
      agregar("Paso 2 (despues de 1000ms)");

      setTimeout(function() {
        agregar("Paso 3 (despues de 1500ms)");
        agregar("Secuencia completada!");
      }, 500);
    }, 500);
  }, 500);
});`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "js17-leccion-02",
      title: "Promises",
      content: `## Promises (Promesas)

Una **Promise** representa un valor que estara disponible en el futuro.

### Estados de una Promise
1. **pending** — en espera
2. **fulfilled** — resuelta exitosamente
3. **rejected** — rechazada con error

### Crear una Promise
\`\`\`javascript
const promesa = new Promise(function(resolve, reject) {
  setTimeout(function() {
    resolve("Exito!");
    // o reject("Error!");
  }, 1000);
});
\`\`\`

### Consumir una Promise
\`\`\`javascript
promesa
  .then(function(resultado) {
    console.log(resultado); // "Exito!"
  })
  .catch(function(error) {
    console.error(error);
  })
  .finally(function() {
    console.log("Siempre se ejecuta");
  });
\`\`\`

### Encadenar Promises
\`\`\`javascript
fetch(url)
  .then(function(res) { return res.json(); })
  .then(function(datos) { console.log(datos); })
  .catch(function(err) { console.error(err); });
\`\`\`

> Las Promises eliminan el callback hell y hacen el codigo asincrono mas legible.`,
      codeExample: {
        html: '<button id="ejecutar">Ejecutar Promise</button>\n<div id="resultado"></div>',
        css: '#ejecutar { padding: 8px 16px; background: #a6e3a1; color: #1e1e2e; border: none; border-radius: 4px; cursor: pointer; } #resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #89b4fa; border-radius: 8px; white-space: pre-line; margin-top: 8px; min-height: 80px; }',
        js: `var resultado = document.getElementById("resultado");

function simularPeticion(exito) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      if (exito) {
        resolve({ usuario: "Ana", nivel: 5 });
      } else {
        reject("Error de conexion");
      }
    }, 1000);
  });
}

document.getElementById("ejecutar").addEventListener("click", function() {
  resultado.textContent = "Cargando...";

  simularPeticion(true)
    .then(function(datos) {
      resultado.textContent = "Exito!\\nUsuario: " + datos.usuario + "\\nNivel: " + datos.nivel;
      return "Datos procesados";
    })
    .then(function(mensaje) {
      resultado.textContent += "\\n" + mensaje;
    })
    .catch(function(error) {
      resultado.textContent = "Error: " + error;
    })
    .finally(function() {
      resultado.textContent += "\\n(Peticion finalizada)";
    });
});`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "js17-leccion-03",
      title: "async/await",
      content: `## async/await

**async/await** es una forma mas limpia de trabajar con Promises:

### Funcion async
\`\`\`javascript
async function obtenerDatos() {
  const resultado = await fetch(url);
  const datos = await resultado.json();
  return datos;
}
\`\`\`

### Manejo de errores
\`\`\`javascript
async function cargar() {
  try {
    const datos = await obtenerDatos();
    console.log(datos);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    console.log("Finalizado");
  }
}
\`\`\`

### Reglas
- \`await\` solo se puede usar dentro de funciones \`async\`
- Una funcion \`async\` siempre devuelve una Promise
- \`await\` pausa la ejecucion hasta que la Promise se resuelva

### Promise.all — Ejecutar en paralelo
\`\`\`javascript
const [usuarios, productos] = await Promise.all([
  fetch("/api/usuarios").then(r => r.json()),
  fetch("/api/productos").then(r => r.json())
]);
\`\`\`

> **async/await** es la forma preferida de manejar codigo asincrono en JavaScript moderno.`,
      codeExample: {
        html: '<button id="cargar">Cargar datos</button>\n<div id="resultado"></div>',
        css: '#cargar { padding: 8px 16px; background: #f9e2af; color: #1e1e2e; border: none; border-radius: 4px; cursor: pointer; } #resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #f5c2e7; border-radius: 8px; white-space: pre-line; margin-top: 8px; min-height: 80px; }',
        js: `var resultado = document.getElementById("resultado");

function esperar(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms);
  });
}

async function cargarDatos() {
  resultado.textContent = "Cargando paso 1...";
  await esperar(500);

  resultado.textContent += "\\nPaso 1 completado!";
  resultado.textContent += "\\nCargando paso 2...";
  await esperar(500);

  resultado.textContent += "\\nPaso 2 completado!";
  resultado.textContent += "\\nCargando paso 3...";
  await esperar(500);

  resultado.textContent += "\\nPaso 3 completado!";
  resultado.textContent += "\\n\\nTodos los datos cargados con async/await!";
}

document.getElementById("cargar").addEventListener("click", function() {
  cargarDatos().catch(function(err) {
    resultado.textContent = "Error: " + err.message;
  });
});`,
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "js17-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "Cuantos hilos de ejecucion tiene JavaScript?",
      options: [
        { id: "a", text: "Multiples hilos", isCorrect: false },
        { id: "b", text: "Un solo hilo (single-threaded)", isCorrect: true },
        { id: "c", text: "Depende del navegador", isCorrect: false },
        { id: "d", text: "Dos hilos", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "JavaScript es single-threaded.",
      explanation: "JavaScript tiene un solo hilo de ejecucion. Maneja la asincronia con el Event Loop, no con multiples hilos.",
    },
    {
      id: "js17-ej-02",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt: "Cuales son los tres estados de una Promise?",
      options: [
        { id: "a", text: "open, closed, error", isCorrect: false },
        { id: "b", text: "pending, fulfilled, rejected", isCorrect: true },
        { id: "c", text: "start, running, done", isCorrect: false },
        { id: "d", text: "loading, success, failure", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "pending (pendiente), fulfilled (cumplida), rejected (rechazada).",
      explanation: "Una Promise puede estar pending (en espera), fulfilled (resuelta con exito) o rejected (rechazada con error).",
    },
    {
      id: "js17-ej-03",
      type: "code-completion",
      difficulty: 2 ,
      xpReward: 20,
      order: 3,
      prompt: "Completa la palabra clave para declarar una funcion asincrona:",
      codeTemplate: {
        html: "",
        cssPrefix: "",
        cssSuffix: " function obtenerDatos() {\n  const res = await fetch(url);\n}",
        blanks: ["async"],
      },
      validation: { type: "exact", answer: "async" },
      hint: "Es la palabra clave que permite usar await dentro de la funcion.",
      explanation: "async declara una funcion asincrona que puede usar await para esperar Promises.",
    },
    {
      id: "js17-ej-04",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt: "Que metodo de Promise se usa para manejar errores?",
      options: [
        { id: "a", text: ".error()", isCorrect: false },
        { id: "b", text: ".catch()", isCorrect: true },
        { id: "c", text: ".fail()", isCorrect: false },
        { id: "d", text: ".reject()", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "catch = capturar (errores).",
      explanation: ".catch() captura cualquier error que ocurra en la cadena de Promises.",
    },
    {
      id: "js17-ej-05",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt: "Que hace Promise.all()?",
      options: [
        { id: "a", text: "Ejecuta Promises una despues de otra", isCorrect: false },
        { id: "b", text: "Ejecuta multiples Promises en paralelo y espera a todas", isCorrect: true },
        { id: "c", text: "Cancela todas las Promises pendientes", isCorrect: false },
        { id: "d", text: "Devuelve la primera Promise que se resuelva", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "all = todas.",
      explanation: "Promise.all() ejecuta multiples Promises en paralelo y se resuelve cuando TODAS terminan.",
    },
    {
      id: "js17-ej-06",
      type: "quiz",
      difficulty: 3 ,
      xpReward: 30,
      order: 6,
      prompt: "Que sucede si usas await fuera de una funcion async?",
      options: [
        { id: "a", text: "Funciona normalmente", isCorrect: false },
        { id: "b", text: "Error de sintaxis", isCorrect: true },
        { id: "c", text: "Se ignora silenciosamente", isCorrect: false },
        { id: "d", text: "Se convierte en una Promise", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "await solo es valido dentro de funciones async (o modulos de nivel superior).",
      explanation: "await solo puede usarse dentro de funciones marcadas como async. Fuera de ellas, produce un error de sintaxis.",
    },
  ],
};
