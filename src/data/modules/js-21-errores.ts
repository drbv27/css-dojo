import type { ModuleData } from "@/types";

export const jsErroresModule: ModuleData = {
  slug: "js-errores",
  title: "Manejo de Errores",
  description:
    "Aprende a manejar errores con try/catch, crear errores personalizados y tecnicas de depuracion.",
  order: 121,
  category: "js-advanced",
  icon: "AlertTriangle",
  dojo: "js",
  lessons: [
    {
      id: "js21-leccion-01",
      title: "try/catch/finally",
      content: `## Manejo de errores

### try...catch

Captura errores sin que el programa se detenga:

\`\`\`javascript
try {
  // codigo que puede fallar
  const datos = JSON.parse("texto invalido");
} catch (error) {
  // manejar el error
  console.error("Error:", error.message);
} finally {
  // siempre se ejecuta
  console.log("Limpieza");
}
\`\`\`

### El objeto Error

\`\`\`javascript
error.message   // descripcion del error
error.name      // tipo de error
error.stack     // traza de la pila
\`\`\`

### Tipos de errores comunes

| Tipo | Causa |
|------|-------|
| \`SyntaxError\` | Error de sintaxis |
| \`ReferenceError\` | Variable no definida |
| \`TypeError\` | Tipo incorrecto (ej: null.propiedad) |
| \`RangeError\` | Valor fuera de rango |
| \`URIError\` | Error en funciones URI |

> **Regla:** Solo usa try/catch donde esperas errores (parsing, peticiones de red, acceso a APIs externas). No lo uses para ocultar bugs.`,
      codeExample: {
        html: '<input id="json-input" placeholder=\'Escribe JSON: {"nombre":"Ana"}\' />\n<button id="parsear">Parsear JSON</button>\n<div id="resultado"></div>',
        css: '#json-input { width: 100%; padding: 8px; border: 1px solid #45475a; border-radius: 4px; background: #313244; color: #cdd6f4; box-sizing: border-box; } button { margin: 4px 0; padding: 6px 12px; background: #89b4fa; color: #1e1e2e; border: none; border-radius: 4px; cursor: pointer; } #resultado { font-family: monospace; padding: 16px; background: #1e1e2e; border-radius: 8px; white-space: pre-line; margin-top: 8px; }',
        js: `var resultado = document.getElementById("resultado");

document.getElementById("parsear").addEventListener("click", function() {
  var texto = document.getElementById("json-input").value;

  try {
    var datos = JSON.parse(texto);
    resultado.style.color = "#a6e3a1";
    resultado.textContent = "JSON valido!\\n" + JSON.stringify(datos, null, 2);
  } catch (error) {
    resultado.style.color = "#f38ba8";
    resultado.textContent = "Error: " + error.message + "\\nTipo: " + error.name;
  } finally {
    resultado.textContent += "\\n\\n(finally: siempre se ejecuta)";
  }
});`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "js21-leccion-02",
      title: "throw y errores personalizados",
      content: `## throw — Lanzar errores

Puedes lanzar tus propios errores:

\`\`\`javascript
function dividir(a, b) {
  if (b === 0) {
    throw new Error("No se puede dividir entre cero");
  }
  return a / b;
}
\`\`\`

### Errores personalizados

\`\`\`javascript
class ValidacionError extends Error {
  constructor(campo, mensaje) {
    super(mensaje);
    this.name = "ValidacionError";
    this.campo = campo;
  }
}

function validarEdad(edad) {
  if (edad < 0 || edad > 150) {
    throw new ValidacionError("edad", "Edad no valida: " + edad);
  }
}
\`\`\`

### Capturar tipos especificos

\`\`\`javascript
try {
  validarEdad(-5);
} catch (error) {
  if (error instanceof ValidacionError) {
    console.error("Campo:", error.campo);
  } else {
    throw error; // re-lanzar errores inesperados
  }
}
\`\`\`

> **Buena practica:** Crea errores personalizados para diferentes tipos de fallos en tu aplicacion.`,
      codeExample: {
        html: '<input id="edad" type="number" placeholder="Ingresa una edad" />\n<button id="validar">Validar</button>\n<div id="resultado"></div>',
        css: 'input { padding: 8px; border: 1px solid #45475a; border-radius: 4px; background: #313244; color: #cdd6f4; } button { margin-left: 4px; padding: 8px 12px; background: #a6e3a1; color: #1e1e2e; border: none; border-radius: 4px; cursor: pointer; } #resultado { font-family: monospace; padding: 16px; background: #1e1e2e; border-radius: 8px; white-space: pre-line; margin-top: 8px; }',
        js: `function ValidacionError(campo, mensaje) {
  this.name = "ValidacionError";
  this.message = mensaje;
  this.campo = campo;
}

function validarEdad(edad) {
  if (isNaN(edad)) throw new ValidacionError("edad", "Debe ser un numero");
  if (edad < 0) throw new ValidacionError("edad", "No puede ser negativa");
  if (edad > 150) throw new ValidacionError("edad", "Edad no realista");
  return "Edad valida: " + edad;
}

document.getElementById("validar").addEventListener("click", function() {
  var resultado = document.getElementById("resultado");
  var valor = Number(document.getElementById("edad").value);

  try {
    var msg = validarEdad(valor);
    resultado.style.color = "#a6e3a1";
    resultado.textContent = msg;
  } catch (error) {
    resultado.style.color = "#f38ba8";
    if (error.name === "ValidacionError") {
      resultado.textContent = "Error de validacion\\n  Campo: " + error.campo + "\\n  Mensaje: " + error.message;
    } else {
      resultado.textContent = "Error inesperado: " + error.message;
    }
  }
});`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "js21-leccion-03",
      title: "Tecnicas de depuracion",
      content: `## Depuracion (Debugging)

### console avanzado
\`\`\`javascript
console.log("Mensaje normal");
console.warn("Advertencia");
console.error("Error");
console.table([{a:1}, {a:2}]);  // tabla bonita
console.group("Grupo");
  console.log("Dentro del grupo");
console.groupEnd();
console.time("operacion");
  // ... codigo
console.timeEnd("operacion");  // muestra tiempo
\`\`\`

### Breakpoints

En DevTools (F12):
1. Abre la pestana **Sources**
2. Haz click en el numero de linea para poner un breakpoint
3. El codigo se pausa ahi y puedes inspeccionar variables

### debugger

Agrega \`debugger;\` en tu codigo para pausar la ejecucion:
\`\`\`javascript
function problematica(datos) {
  debugger; // se pausa aqui si DevTools esta abierto
  return datos.map(d => d.valor);
}
\`\`\`

### Patrones defensivos
\`\`\`javascript
// Validar parametros al inicio
function procesar(datos) {
  if (!datos) throw new Error("datos es requerido");
  if (!Array.isArray(datos)) throw new Error("datos debe ser un array");
  // ... logica
}
\`\`\`

> **Consejo:** Aprende a usar DevTools. Es la herramienta mas poderosa para depurar JavaScript.`,
      codeExample: {
        html: '<button id="probar">Probar console methods</button>\n<div id="resultado"></div>',
        css: 'button { padding: 8px 16px; background: #f9e2af; color: #1e1e2e; border: none; border-radius: 4px; cursor: pointer; } #resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #cdd6f4; border-radius: 8px; white-space: pre-line; margin-top: 8px; }',
        js: `document.getElementById("probar").addEventListener("click", function() {
  var resultado = document.getElementById("resultado");
  var salida = [];

  // Simulando diferentes niveles de log
  salida.push("[LOG] Mensaje informativo");
  salida.push("[WARN] Advertencia: variable sin usar");
  salida.push("[ERROR] Error: conexion fallida");

  // Medir tiempo
  var inicio = performance.now();
  var suma = 0;
  for (var i = 0; i < 100000; i++) {
    suma += i;
  }
  var tiempo = (performance.now() - inicio).toFixed(2);
  salida.push("[TIME] Operacion: " + tiempo + "ms");
  salida.push("[RESULT] Suma: " + suma);

  // Validacion defensiva
  function procesar(datos) {
    if (!datos) return "[ERROR] datos es requerido";
    if (!Array.isArray(datos)) return "[ERROR] datos debe ser un array";
    return "[OK] " + datos.length + " elementos procesados";
  }

  salida.push(procesar([1, 2, 3]));
  salida.push(procesar(null));
  salida.push(procesar("texto"));

  resultado.textContent = salida.join("\\n");
});`,
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "js21-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "Que estructura se usa para capturar errores en JavaScript?",
      options: [
        { id: "a", text: "if/else", isCorrect: false },
        { id: "b", text: "try/catch", isCorrect: true },
        { id: "c", text: "switch/case", isCorrect: false },
        { id: "d", text: "for/while", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "try = intentar, catch = capturar.",
      explanation: "try/catch permite ejecutar codigo que puede fallar y capturar el error sin que el programa se detenga.",
    },
    {
      id: "js21-ej-02",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 2,
      prompt: "Que bloque se ejecuta siempre, haya o no haya error?",
      options: [
        { id: "a", text: "try", isCorrect: false },
        { id: "b", text: "catch", isCorrect: false },
        { id: "c", text: "finally", isCorrect: true },
        { id: "d", text: "always", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "finally = finalmente (siempre).",
      explanation: "El bloque finally se ejecuta siempre, sin importar si hubo un error o no. Es ideal para limpieza.",
    },
    {
      id: "js21-ej-03",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 3,
      prompt: "Completa para lanzar un error personalizado:",
      codeTemplate: {
        html: "",
        cssPrefix: "",
        cssSuffix: ' new Error("Valor invalido");',
        blanks: ["throw"],
      },
      validation: { type: "exact", answer: "throw" },
      hint: "La palabra clave para 'lanzar' un error.",
      explanation: "throw lanza un error que puede ser capturado por un bloque catch.",
    },
    {
      id: "js21-ej-04",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 4,
      prompt: "Que tipo de error se produce al acceder a una variable que no existe?",
      options: [
        { id: "a", text: "TypeError", isCorrect: false },
        { id: "b", text: "SyntaxError", isCorrect: false },
        { id: "c", text: "ReferenceError", isCorrect: true },
        { id: "d", text: "RangeError", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "La variable no tiene 'referencia'.",
      explanation: "ReferenceError se produce cuando se intenta acceder a una variable que no ha sido declarada.",
    },
    {
      id: "js21-ej-05",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 5,
      prompt: "Que propiedad del objeto error contiene la descripcion del error?",
      options: [
        { id: "a", text: "error.text", isCorrect: false },
        { id: "b", text: "error.description", isCorrect: false },
        { id: "c", text: "error.message", isCorrect: true },
        { id: "d", text: "error.info", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "message = mensaje.",
      explanation: "error.message contiene la descripcion del error. error.name contiene el tipo.",
    },
    {
      id: "js21-ej-06",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 6,
      prompt: "Que hace la palabra clave debugger en el codigo?",
      options: [
        { id: "a", text: "Elimina todos los bugs automaticamente", isCorrect: false },
        { id: "b", text: "Pausa la ejecucion si DevTools esta abierto", isCorrect: true },
        { id: "c", text: "Muestra un error en la consola", isCorrect: false },
        { id: "d", text: "Activa el modo de depuracion del navegador", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Funciona como un breakpoint programatico.",
      explanation: "debugger pausa la ejecucion del codigo en ese punto si las DevTools del navegador estan abiertas.",
    },
  ],
};
