import type { ModuleData } from "@/types";

export const jsPatronesModule: ModuleData = {
  slug: "js-patrones",
  title: "Patrones de Diseno",
  description:
    "Conoce los patrones de diseno mas comunes en JavaScript: Module, Observer, Factory y Singleton.",
  order: 122,
  category: "js-advanced",
  icon: "Puzzle",
  dojo: "js",
  lessons: [
    {
      id: "js22-leccion-01",
      title: "Patron Module y IIFE",
      content: `## Patron Module

Encapsula codigo en un modulo con interfaz publica y datos privados.

### IIFE (Immediately Invoked Function Expression)

\`\`\`javascript
const miModulo = (function() {
  // Privado
  let contador = 0;

  // Publico
  return {
    incrementar: function() { contador++; },
    obtener: function() { return contador; }
  };
})();
\`\`\`

### Modulos ES6 (import/export)

\`\`\`javascript
// archivo: utils.js
export function sumar(a, b) { return a + b; }
export const PI = 3.14159;

// archivo: main.js
import { sumar, PI } from "./utils.js";
\`\`\`

### Namespace pattern

Agrupa funcionalidad bajo un objeto global:

\`\`\`javascript
const App = {
  utils: {
    formatear: function(n) { return n.toFixed(2); }
  },
  config: {
    debug: false
  }
};
\`\`\`

> El patron Module es la base de toda arquitectura JavaScript moderna.`,
      codeExample: {
        html: '<button id="inc">Incrementar</button>\n<button id="dec">Decrementar</button>\n<button id="reset">Reset</button>\n<div id="resultado"></div>',
        css: 'button { margin: 2px; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; background: #89b4fa; color: #1e1e2e; } #reset { background: #f38ba8; } #resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #a6e3a1; border-radius: 8px; white-space: pre-line; margin-top: 8px; }',
        js: `// Patron Module con IIFE
var Contador = (function() {
  var valor = 0;
  var historial = [];

  function registrar(accion) {
    historial.push(accion + ": " + valor);
  }

  return {
    incrementar: function() { valor++; registrar("inc"); },
    decrementar: function() { valor--; registrar("dec"); },
    reset: function() { valor = 0; historial = []; registrar("reset"); },
    obtener: function() { return valor; },
    getHistorial: function() { return historial.slice(); }
  };
})();

function mostrar() {
  var resultado = document.getElementById("resultado");
  var salida = ["Valor: " + Contador.obtener(), "", "Historial:"];
  Contador.getHistorial().forEach(function(h) { salida.push("  " + h); });
  resultado.textContent = salida.join("\\n");
}

document.getElementById("inc").addEventListener("click", function() { Contador.incrementar(); mostrar(); });
document.getElementById("dec").addEventListener("click", function() { Contador.decrementar(); mostrar(); });
document.getElementById("reset").addEventListener("click", function() { Contador.reset(); mostrar(); });
mostrar();`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "js22-leccion-02",
      title: "Patron Observer",
      content: `## Patron Observer (Observador)

Un objeto (Subject) mantiene una lista de dependientes (Observers) y les notifica cuando cambia su estado.

\`\`\`javascript
class EventEmitter {
  constructor() {
    this.listeners = {};
  }
  on(evento, callback) {
    if (!this.listeners[evento]) {
      this.listeners[evento] = [];
    }
    this.listeners[evento].push(callback);
  }
  emit(evento, datos) {
    const callbacks = this.listeners[evento] || [];
    callbacks.forEach(cb => cb(datos));
  }
  off(evento, callback) {
    this.listeners[evento] = (this.listeners[evento] || [])
      .filter(cb => cb !== callback);
  }
}
\`\`\`

### Uso
\`\`\`javascript
const emitter = new EventEmitter();
emitter.on("mensaje", function(data) {
  console.log("Recibido:", data);
});
emitter.emit("mensaje", "Hola!"); // "Recibido: Hola!"
\`\`\`

### Donde se usa?
- Eventos del DOM (addEventListener es un Observer)
- Frameworks reactivos (React, Vue)
- Node.js EventEmitter
- Arquitecturas pub/sub

> Este patron desacopla componentes: el emisor no necesita conocer a los observadores.`,
      codeExample: {
        html: '<input id="mensaje" placeholder="Escribe un mensaje" />\n<button id="enviar">Emitir evento</button>\n<div id="log"></div>\n<div id="resultado"></div>',
        css: 'input { padding: 8px; border: 1px solid #45475a; border-radius: 4px; background: #313244; color: #cdd6f4; } button { margin-left: 4px; padding: 8px 12px; background: #a6e3a1; color: #1e1e2e; border: none; border-radius: 4px; cursor: pointer; } #log { padding: 8px; margin-top: 8px; background: #313244; border-radius: 4px; color: #f9e2af; font-size: 13px; } #resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #89b4fa; border-radius: 8px; white-space: pre-line; margin-top: 8px; }',
        js: `// Mini EventEmitter
function EventEmitter() {
  this.listeners = {};
}
EventEmitter.prototype.on = function(evento, cb) {
  if (!this.listeners[evento]) this.listeners[evento] = [];
  this.listeners[evento].push(cb);
};
EventEmitter.prototype.emit = function(evento, datos) {
  (this.listeners[evento] || []).forEach(function(cb) { cb(datos); });
};

var emitter = new EventEmitter();
var mensajes = [];

// Observer 1: Logger
emitter.on("mensaje", function(data) {
  mensajes.push("[Logger] " + data);
});

// Observer 2: Contador
var count = 0;
emitter.on("mensaje", function() {
  count++;
  mensajes.push("[Contador] Total: " + count);
});

// Observer 3: UI
emitter.on("mensaje", function(data) {
  document.getElementById("log").textContent = "Ultimo: " + data;
});

document.getElementById("enviar").addEventListener("click", function() {
  var msg = document.getElementById("mensaje").value || "Mensaje vacio";
  emitter.emit("mensaje", msg);
  document.getElementById("resultado").textContent = mensajes.join("\\n");
  document.getElementById("mensaje").value = "";
});`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "js22-leccion-03",
      title: "Factory y Singleton",
      content: `## Patron Factory (Fabrica)

Crea objetos sin especificar la clase exacta:

\`\`\`javascript
function crearUsuario(tipo, nombre) {
  const base = { nombre, creado: new Date() };
  switch(tipo) {
    case "admin":
      return { ...base, rol: "admin", permisos: ["todo"] };
    case "editor":
      return { ...base, rol: "editor", permisos: ["editar"] };
    default:
      return { ...base, rol: "viewer", permisos: ["ver"] };
  }
}
\`\`\`

## Patron Singleton

Garantiza que solo exista **una instancia** de un objeto:

\`\`\`javascript
const Database = (function() {
  let instance;
  function crear() {
    return { conexion: "activa", queries: 0 };
  }
  return {
    getInstance: function() {
      if (!instance) instance = crear();
      return instance;
    }
  };
})();
\`\`\`

### Cuando usar cada patron?

| Patron | Usar cuando... |
|--------|---------------|
| Module | Necesitas encapsulacion |
| Observer | Comunicar componentes desacoplados |
| Factory | Crear objetos de diferentes tipos |
| Singleton | Solo debe existir una instancia |

> Los patrones son soluciones probadas. Aprenderlos te ayuda a escribir codigo mas mantenible.`,
      codeExample: {
        html: '<button id="crear-admin">Crear Admin</button>\n<button id="crear-editor">Crear Editor</button>\n<button id="crear-viewer">Crear Viewer</button>\n<div id="resultado"></div>',
        css: 'button { margin: 2px; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; } button:nth-child(1) { background: #f38ba8; color: #1e1e2e; } button:nth-child(2) { background: #89b4fa; color: #1e1e2e; } button:nth-child(3) { background: #a6e3a1; color: #1e1e2e; } #resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #f5c2e7; border-radius: 8px; white-space: pre-line; margin-top: 8px; }',
        js: `// Factory Pattern
function crearUsuario(tipo, nombre) {
  var base = { nombre: nombre, id: Math.random().toString(36).substring(7) };
  switch(tipo) {
    case "admin":
      return Object.assign(base, { rol: "Admin", permisos: "Todos los permisos" });
    case "editor":
      return Object.assign(base, { rol: "Editor", permisos: "Editar contenido" });
    default:
      return Object.assign(base, { rol: "Viewer", permisos: "Solo lectura" });
  }
}

var usuarios = [];

function mostrar() {
  var salida = ["Usuarios creados (" + usuarios.length + "):", ""];
  usuarios.forEach(function(u, i) {
    salida.push((i + 1) + ". " + u.nombre + " [" + u.rol + "]");
    salida.push("   ID: " + u.id);
    salida.push("   Permisos: " + u.permisos);
  });
  document.getElementById("resultado").textContent = salida.join("\\n");
}

var nombres = ["Ana", "Luis", "Maria", "Carlos", "Sofia"];
var ni = 0;

document.getElementById("crear-admin").addEventListener("click", function() {
  usuarios.push(crearUsuario("admin", nombres[ni++ % nombres.length]));
  mostrar();
});
document.getElementById("crear-editor").addEventListener("click", function() {
  usuarios.push(crearUsuario("editor", nombres[ni++ % nombres.length]));
  mostrar();
});
document.getElementById("crear-viewer").addEventListener("click", function() {
  usuarios.push(crearUsuario("viewer", nombres[ni++ % nombres.length]));
  mostrar();
});`,
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "js22-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "Que es un IIFE?",
      options: [
        { id: "a", text: "Un tipo de variable", isCorrect: false },
        { id: "b", text: "Una funcion que se ejecuta inmediatamente al definirse", isCorrect: true },
        { id: "c", text: "Un metodo de array", isCorrect: false },
        { id: "d", text: "Un operador logico", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "IIFE = Immediately Invoked Function Expression.",
      explanation: "Un IIFE es una funcion que se define y se ejecuta inmediatamente. Se usa para crear un scope privado.",
    },
    {
      id: "js22-ej-02",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 2,
      prompt: "Que patron se usa cuando necesitas notificar a multiples componentes sobre un cambio?",
      options: [
        { id: "a", text: "Singleton", isCorrect: false },
        { id: "b", text: "Factory", isCorrect: false },
        { id: "c", text: "Observer", isCorrect: true },
        { id: "d", text: "Module", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Los 'observadores' escuchan cambios del 'sujeto'.",
      explanation: "El patron Observer permite que multiples componentes se suscriban a cambios de estado y reciban notificaciones.",
    },
    {
      id: "js22-ej-03",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 3,
      prompt: "Que garantiza el patron Singleton?",
      options: [
        { id: "a", text: "Que un objeto sea inmutable", isCorrect: false },
        { id: "b", text: "Que solo exista una instancia de un objeto", isCorrect: true },
        { id: "c", text: "Que un objeto pueda crear otros objetos", isCorrect: false },
        { id: "d", text: "Que un objeto sea privado", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Singleton = unico, solo uno.",
      explanation: "El patron Singleton garantiza que solo exista una unica instancia de un objeto en toda la aplicacion.",
    },
    {
      id: "js22-ej-04",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt: "Que patron usarias para crear objetos de diferentes tipos con una funcion comun?",
      options: [
        { id: "a", text: "Observer", isCorrect: false },
        { id: "b", text: "Singleton", isCorrect: false },
        { id: "c", text: "Factory", isCorrect: true },
        { id: "d", text: "Module", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Una fabrica produce diferentes productos.",
      explanation: "El patron Factory encapsula la logica de creacion de objetos, decidiendo que tipo crear segun los parametros.",
    },
    {
      id: "js22-ej-05",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt: "addEventListener del DOM es un ejemplo de que patron?",
      options: [
        { id: "a", text: "Factory", isCorrect: false },
        { id: "b", text: "Observer", isCorrect: true },
        { id: "c", text: "Singleton", isCorrect: false },
        { id: "d", text: "Module", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Los event listeners 'observan' eventos.",
      explanation: "addEventListener es una implementacion del patron Observer: suscribes funciones (observers) a eventos del DOM (subject).",
    },
    {
      id: "js22-ej-06",
      type: "drag-drop",
      difficulty: 3 ,
      xpReward: 30,
      order: 6,
      prompt: "Asocia cada patron con su caso de uso principal:",
      dragItems: [
        { id: "drag-1", content: "Module", correctZone: "zone-encapsular" },
        { id: "drag-2", content: "Observer", correctZone: "zone-notificar" },
        { id: "drag-3", content: "Factory", correctZone: "zone-crear" },
      ],
      dropZones: [
        { id: "zone-encapsular", label: "Encapsular datos privados" },
        { id: "zone-notificar", label: "Notificar cambios a suscriptores" },
        { id: "zone-crear", label: "Crear objetos de diferentes tipos" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-encapsular",
          "drag-2": "zone-notificar",
          "drag-3": "zone-crear",
        },
      },
      hint: "Module encapsula, Observer notifica, Factory crea.",
      explanation: "Module encapsula datos privados, Observer notifica cambios a suscriptores, Factory crea objetos de diferentes tipos.",
    },
  ],
};
