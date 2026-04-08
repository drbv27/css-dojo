import type { ModuleData } from "@/types";

export const jsLocalStorageModule: ModuleData = {
  slug: "js-localstorage",
  title: "LocalStorage",
  description:
    "Aprende a almacenar datos en el navegador con localStorage: guardar, leer, eliminar y trabajar con JSON.",
  order: 115,
  category: "js-intermediate",
  icon: "Database",
  dojo: "js",
  lessons: [
    {
      id: "js15-leccion-01",
      title: "Introduccion a localStorage",
      content: `## LocalStorage

**localStorage** permite almacenar datos en el navegador que **persisten** incluso al cerrar la ventana.

### Metodos principales

\`\`\`javascript
// Guardar
localStorage.setItem("nombre", "Ana");

// Leer
const nombre = localStorage.getItem("nombre"); // "Ana"

// Eliminar uno
localStorage.removeItem("nombre");

// Eliminar todo
localStorage.clear();
\`\`\`

### Caracteristicas
- Almacena solo **strings**
- Capacidad de ~5MB por dominio
- Los datos **no expiran** (a diferencia de las cookies)
- Es **sincrono** (bloquea el hilo principal)
- Especifico por **origen** (dominio + protocolo + puerto)

### sessionStorage

Similar a localStorage pero los datos se borran al cerrar la pestana:

\`\`\`javascript
sessionStorage.setItem("temp", "valor");
\`\`\`

> **Seguridad:** Nunca guardes informacion sensible (contrasenas, tokens) en localStorage.`,
      codeExample: {
        html: '<input id="input" placeholder="Escribe tu nombre" />\n<button id="guardar">Guardar</button>\n<button id="borrar">Borrar</button>\n<div id="resultado"></div>',
        css: '#input { padding: 8px; border: 1px solid #45475a; border-radius: 4px; background: #313244; color: #cdd6f4; } button { margin: 4px; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; } #guardar { background: #a6e3a1; color: #1e1e2e; } #borrar { background: #f38ba8; color: #1e1e2e; } #resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #a6e3a1; border-radius: 8px; white-space: pre-line; margin-top: 8px; }',
        js: `var resultado = document.getElementById("resultado");

function mostrar() {
  var nombre = localStorage.getItem("dojo_nombre") || "(no guardado)";
  resultado.textContent = "Nombre guardado: " + nombre + "\\nTotal items en localStorage: " + localStorage.length;
}

document.getElementById("guardar").addEventListener("click", function() {
  var valor = document.getElementById("input").value;
  if (valor) {
    localStorage.setItem("dojo_nombre", valor);
    mostrar();
  }
});

document.getElementById("borrar").addEventListener("click", function() {
  localStorage.removeItem("dojo_nombre");
  document.getElementById("input").value = "";
  mostrar();
});

mostrar();`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "js15-leccion-02",
      title: "JSON y localStorage",
      content: `## Almacenar objetos y arrays

localStorage solo acepta strings, pero puedes guardar objetos usando **JSON**:

### JSON.stringify() — Objeto a string
\`\`\`javascript
const usuario = { nombre: "Ana", edad: 25 };
localStorage.setItem("usuario", JSON.stringify(usuario));
// Guarda: '{"nombre":"Ana","edad":25}'
\`\`\`

### JSON.parse() — String a objeto
\`\`\`javascript
const datos = JSON.parse(localStorage.getItem("usuario"));
// { nombre: "Ana", edad: 25 }
\`\`\`

### Patron seguro de lectura
\`\`\`javascript
function leerDatos(clave, valorPorDefecto) {
  try {
    const datos = localStorage.getItem(clave);
    return datos ? JSON.parse(datos) : valorPorDefecto;
  } catch (e) {
    return valorPorDefecto;
  }
}
\`\`\`

### Guardar arrays
\`\`\`javascript
const tareas = ["Estudiar", "Ejercitar", "Cocinar"];
localStorage.setItem("tareas", JSON.stringify(tareas));
\`\`\`

> **Tip:** Siempre usa try/catch al hacer JSON.parse() para manejar datos corruptos.`,
      codeExample: {
        html: '<button id="guardar">Guardar datos</button>\n<button id="leer">Leer datos</button>\n<button id="limpiar">Limpiar</button>\n<div id="resultado"></div>',
        css: 'button { margin: 4px; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; background: #89b4fa; color: #1e1e2e; } #limpiar { background: #f38ba8; } #resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #89b4fa; border-radius: 8px; white-space: pre-line; margin-top: 8px; }',
        js: `var resultado = document.getElementById("resultado");

document.getElementById("guardar").addEventListener("click", function() {
  var datos = {
    usuario: "Estudiante",
    nivel: 5,
    logros: ["primera-leccion", "primer-ejercicio"],
    fecha: new Date().toLocaleDateString()
  };
  localStorage.setItem("dojo_datos", JSON.stringify(datos));
  resultado.textContent = "Datos guardados:\\n" + JSON.stringify(datos, null, 2);
});

document.getElementById("leer").addEventListener("click", function() {
  try {
    var datos = JSON.parse(localStorage.getItem("dojo_datos"));
    if (datos) {
      resultado.textContent = "Datos leidos:\\n  Usuario: " + datos.usuario + "\\n  Nivel: " + datos.nivel + "\\n  Logros: " + datos.logros.join(", ") + "\\n  Fecha: " + datos.fecha;
    } else {
      resultado.textContent = "No hay datos guardados.";
    }
  } catch(e) {
    resultado.textContent = "Error al leer: " + e.message;
  }
});

document.getElementById("limpiar").addEventListener("click", function() {
  localStorage.removeItem("dojo_datos");
  resultado.textContent = "Datos eliminados.";
});`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "js15-leccion-03",
      title: "Patrones practicos",
      content: `## Patrones practicos con localStorage

### Tema oscuro/claro persistente
\`\`\`javascript
// Guardar preferencia
function setTema(tema) {
  document.body.className = tema;
  localStorage.setItem("tema", tema);
}

// Restaurar al cargar
const tema = localStorage.getItem("tema") || "claro";
setTema(tema);
\`\`\`

### Carrito de compras
\`\`\`javascript
function agregarAlCarrito(producto) {
  const carrito = JSON.parse(
    localStorage.getItem("carrito")
  ) || [];
  carrito.push(producto);
  localStorage.setItem("carrito", JSON.stringify(carrito));
}
\`\`\`

### Formulario con borrador automatico
\`\`\`javascript
input.addEventListener("input", function() {
  localStorage.setItem("borrador", input.value);
});
// Restaurar al cargar
input.value = localStorage.getItem("borrador") || "";
\`\`\`

> **Recuerda:** localStorage es ideal para preferencias de usuario, borradores y datos no sensibles.`,
      codeExample: {
        html: '<h3 id="titulo">Mi nota</h3>\n<textarea id="nota" rows="3" placeholder="Escribe una nota..."></textarea>\n<p id="estado"></p>\n<div id="resultado"></div>',
        css: '#nota { width: 100%; padding: 8px; border: 1px solid #45475a; border-radius: 4px; background: #313244; color: #cdd6f4; resize: vertical; box-sizing: border-box; } #estado { font-size: 12px; color: #a6adc8; } #resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #f9e2af; border-radius: 8px; white-space: pre-line; }',
        js: `var nota = document.getElementById("nota");
var estado = document.getElementById("estado");
var resultado = document.getElementById("resultado");

// Restaurar nota guardada
var guardada = localStorage.getItem("dojo_nota");
if (guardada) {
  nota.value = guardada;
  estado.textContent = "Nota restaurada del almacenamiento local.";
}

// Auto-guardar mientras escribe
nota.addEventListener("input", function() {
  localStorage.setItem("dojo_nota", nota.value);
  estado.textContent = "Guardado automatico: " + new Date().toLocaleTimeString();
  resultado.textContent = "Caracteres: " + nota.value.length + "\\nTamano: " + new Blob([nota.value]).size + " bytes";
});`,
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "js15-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "Que metodo se usa para guardar un dato en localStorage?",
      options: [
        { id: "a", text: "localStorage.save()", isCorrect: false },
        { id: "b", text: "localStorage.setItem()", isCorrect: true },
        { id: "c", text: "localStorage.put()", isCorrect: false },
        { id: "d", text: "localStorage.store()", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "set = establecer, Item = elemento.",
      explanation: "localStorage.setItem(clave, valor) guarda un par clave-valor en el almacenamiento local.",
    },
    {
      id: "js15-ej-02",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt: "Que tipo de datos acepta localStorage?",
      options: [
        { id: "a", text: "Cualquier tipo", isCorrect: false },
        { id: "b", text: "Solo strings", isCorrect: true },
        { id: "c", text: "Strings y numeros", isCorrect: false },
        { id: "d", text: "Objetos JSON", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Por eso necesitamos JSON.stringify para guardar objetos.",
      explanation: "localStorage solo almacena strings. Para guardar objetos o arrays, se usa JSON.stringify().",
    },
    {
      id: "js15-ej-03",
      type: "code-completion",
      difficulty: 1 ,
      xpReward: 10,
      order: 3,
      prompt: "Completa para convertir un objeto a string JSON:",
      codeTemplate: {
        html: "",
        cssPrefix: "const texto = JSON.",
        cssSuffix: "(miObjeto);",
        blanks: ["stringify"],
      },
      validation: { type: "exact", answer: "stringify" },
      hint: "stringify = convertir a string.",
      explanation: "JSON.stringify() convierte un objeto JavaScript a una cadena JSON.",
    },
    {
      id: "js15-ej-04",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt: "Que diferencia hay entre localStorage y sessionStorage?",
      options: [
        { id: "a", text: "localStorage es mas grande", isCorrect: false },
        { id: "b", text: "sessionStorage persiste al cerrar la pestana, localStorage no", isCorrect: false },
        { id: "c", text: "localStorage persiste al cerrar el navegador, sessionStorage no", isCorrect: true },
        { id: "d", text: "No hay diferencia", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Session = sesion (temporal), local = permanente.",
      explanation: "localStorage persiste indefinidamente. sessionStorage se borra al cerrar la pestana del navegador.",
    },
    {
      id: "js15-ej-05",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt: "Que metodo convierte un string JSON de vuelta a un objeto?",
      options: [
        { id: "a", text: "JSON.parse()", isCorrect: true },
        { id: "b", text: "JSON.toObject()", isCorrect: false },
        { id: "c", text: "JSON.decode()", isCorrect: false },
        { id: "d", text: "JSON.convert()", isCorrect: false },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "Parse = analizar/interpretar.",
      explanation: "JSON.parse() analiza un string JSON y lo convierte en un objeto JavaScript.",
    },
    {
      id: "js15-ej-06",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 6,
      prompt: "Por que es importante usar try/catch al leer de localStorage?",
      options: [
        { id: "a", text: "Porque localStorage puede estar lleno", isCorrect: false },
        { id: "b", text: "Porque JSON.parse puede fallar con datos corruptos", isCorrect: true },
        { id: "c", text: "Porque localStorage es asincrono", isCorrect: false },
        { id: "d", text: "No es necesario usar try/catch", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Si los datos almacenados no son JSON valido...",
      explanation: "JSON.parse() lanza un error si el string no es JSON valido. El try/catch maneja este caso de forma segura.",
    },
  ],
};
