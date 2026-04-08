import type { ModuleData } from "@/types";

export const jsProyectoTodoModule: ModuleData = {
  slug: "js-proyecto-todo",
  title: "Proyecto: Lista de Tareas",
  description:
    "Construye una aplicacion de lista de tareas (Todo App) paso a paso: CRUD, localStorage y filtros.",
  order: 123,
  category: "js-projects",
  icon: "CheckSquare",
  dojo: "js",
  lessons: [
    {
      id: "js23-leccion-01",
      title: "Estructura y agregar tareas",
      content: `## Proyecto: Todo App

Vamos a construir una lista de tareas completa paso a paso.

### Funcionalidades
1. Agregar tareas
2. Marcar como completadas
3. Eliminar tareas
4. Persistir en localStorage
5. Filtrar por estado

### Paso 1: Estructura

Necesitamos:
- Un input para escribir la tarea
- Un boton para agregarla
- Una lista para mostrar las tareas
- Un array para almacenar los datos

### El modelo de datos

Cada tarea tendra:
\`\`\`javascript
{
  id: 1,
  texto: "Aprender JavaScript",
  completada: false
}
\`\`\`

### Agregar tareas

El flujo es:
1. Leer el valor del input
2. Crear un objeto tarea
3. Agregarlo al array
4. Renderizar la lista
5. Limpiar el input

> **Principio:** Separa los **datos** (array de tareas) de la **vista** (HTML). Modifica los datos y re-renderiza.`,
      codeExample: {
        html: '<div id="app">\n  <h3>Mi Lista de Tareas</h3>\n  <div class="input-group">\n    <input id="input-tarea" placeholder="Nueva tarea..." />\n    <button id="btn-agregar">Agregar</button>\n  </div>\n  <ul id="lista-tareas"></ul>\n  <p id="info"></p>\n</div>',
        css: '#app { max-width: 400px; } .input-group { display: flex; gap: 4px; margin-bottom: 8px; } #input-tarea { flex: 1; padding: 8px; border: 1px solid #45475a; border-radius: 4px; background: #313244; color: #cdd6f4; } #btn-agregar { padding: 8px 12px; background: #a6e3a1; color: #1e1e2e; border: none; border-radius: 4px; cursor: pointer; } #lista-tareas { list-style: none; padding: 0; } #lista-tareas li { display: flex; align-items: center; gap: 8px; padding: 8px; margin: 2px 0; background: #313244; border-radius: 4px; color: #cdd6f4; } #lista-tareas li.completada { text-decoration: line-through; opacity: 0.6; } .btn-delete { margin-left: auto; background: #f38ba8; color: #1e1e2e; border: none; border-radius: 4px; padding: 2px 8px; cursor: pointer; } #info { font-size: 12px; color: #a6adc8; }',
        js: `var tareas = [];
var nextId = 1;

function renderizar() {
  var lista = document.getElementById("lista-tareas");
  lista.innerHTML = "";

  tareas.forEach(function(tarea) {
    var li = document.createElement("li");
    if (tarea.completada) li.className = "completada";

    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = tarea.completada;
    checkbox.addEventListener("change", function() {
      tarea.completada = !tarea.completada;
      renderizar();
    });

    var span = document.createElement("span");
    span.textContent = tarea.texto;

    var btnDel = document.createElement("button");
    btnDel.className = "btn-delete";
    btnDel.textContent = "X";
    btnDel.addEventListener("click", function() {
      tareas = tareas.filter(function(t) { return t.id !== tarea.id; });
      renderizar();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(btnDel);
    lista.appendChild(li);
  });

  var completadas = tareas.filter(function(t) { return t.completada; }).length;
  document.getElementById("info").textContent = completadas + "/" + tareas.length + " completadas";
}

function agregarTarea() {
  var input = document.getElementById("input-tarea");
  var texto = input.value.trim();
  if (!texto) return;

  tareas.push({ id: nextId++, texto: texto, completada: false });
  input.value = "";
  renderizar();
}

document.getElementById("btn-agregar").addEventListener("click", agregarTarea);
document.getElementById("input-tarea").addEventListener("keydown", function(e) {
  if (e.key === "Enter") agregarTarea();
});

// Tareas iniciales de ejemplo
tareas.push({ id: nextId++, texto: "Aprender JavaScript", completada: true });
tareas.push({ id: nextId++, texto: "Practicar con ejercicios", completada: false });
tareas.push({ id: nextId++, texto: "Construir un proyecto", completada: false });
renderizar();`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "js23-leccion-02",
      title: "localStorage y filtros",
      content: `## Persistencia con localStorage

Para que las tareas no se pierdan al recargar la pagina:

### Guardar
\`\`\`javascript
function guardar() {
  localStorage.setItem("tareas", JSON.stringify(tareas));
}
\`\`\`

### Cargar
\`\`\`javascript
function cargar() {
  try {
    const datos = localStorage.getItem("tareas");
    return datos ? JSON.parse(datos) : [];
  } catch(e) {
    return [];
  }
}
\`\`\`

### Llamar guardar() en cada operacion
Despues de agregar, eliminar o completar una tarea, llama a \`guardar()\`.

## Filtros

Agregar botones para filtrar:
- **Todas:** muestra todas las tareas
- **Activas:** solo las no completadas
- **Completadas:** solo las completadas

\`\`\`javascript
function filtrar(estado) {
  if (estado === "activas") return tareas.filter(t => !t.completada);
  if (estado === "completadas") return tareas.filter(t => t.completada);
  return tareas;
}
\`\`\`

> **Patron:** Datos en memoria + sincronizacion con localStorage en cada cambio.`,
      codeExample: {
        html: '<div id="app2">\n  <h3>Todo App con Persistencia</h3>\n  <div class="input-group">\n    <input id="input2" placeholder="Nueva tarea..." />\n    <button id="add2">+</button>\n  </div>\n  <div class="filtros">\n    <button class="filtro activo" data-filtro="todas">Todas</button>\n    <button class="filtro" data-filtro="activas">Activas</button>\n    <button class="filtro" data-filtro="completadas">Hechas</button>\n  </div>\n  <ul id="lista2"></ul>\n  <p id="info2"></p>\n</div>',
        css: '#app2 { max-width: 400px; } .input-group { display: flex; gap: 4px; } #input2 { flex: 1; padding: 8px; border: 1px solid #45475a; border-radius: 4px; background: #313244; color: #cdd6f4; } #add2 { padding: 8px 14px; background: #a6e3a1; color: #1e1e2e; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; } .filtros { display: flex; gap: 4px; margin: 8px 0; } .filtro { padding: 4px 10px; border: 1px solid #45475a; background: transparent; color: #a6adc8; border-radius: 4px; cursor: pointer; font-size: 12px; } .filtro.activo { background: #89b4fa; color: #1e1e2e; border-color: #89b4fa; } #lista2 { list-style: none; padding: 0; } #lista2 li { display: flex; align-items: center; gap: 8px; padding: 6px 8px; margin: 2px 0; background: #313244; border-radius: 4px; color: #cdd6f4; font-size: 14px; } #lista2 li.done { text-decoration: line-through; opacity: 0.5; } .del { margin-left: auto; background: none; color: #f38ba8; border: none; cursor: pointer; } #info2 { font-size: 12px; color: #a6adc8; }',
        js: `var STORAGE_KEY = "dojo_todo_tareas";
var tareas2 = [];
var filtroActual = "todas";
var nid = 1;

function guardar() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tareas2));
}

function cargar() {
  try {
    var d = localStorage.getItem(STORAGE_KEY);
    return d ? JSON.parse(d) : [];
  } catch(e) { return []; }
}

function render() {
  var lista = document.getElementById("lista2");
  lista.innerHTML = "";
  var filtradas = tareas2;
  if (filtroActual === "activas") filtradas = tareas2.filter(function(t) { return !t.completada; });
  if (filtroActual === "completadas") filtradas = tareas2.filter(function(t) { return t.completada; });

  filtradas.forEach(function(t) {
    var li = document.createElement("li");
    if (t.completada) li.className = "done";
    var cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = t.completada;
    cb.addEventListener("change", function() { t.completada = !t.completada; guardar(); render(); });
    var sp = document.createElement("span");
    sp.textContent = t.texto;
    var del = document.createElement("button");
    del.className = "del";
    del.textContent = "x";
    del.addEventListener("click", function() { tareas2 = tareas2.filter(function(x) { return x.id !== t.id; }); guardar(); render(); });
    li.appendChild(cb); li.appendChild(sp); li.appendChild(del);
    lista.appendChild(li);
  });

  var c = tareas2.filter(function(t) { return t.completada; }).length;
  document.getElementById("info2").textContent = c + "/" + tareas2.length + " completadas";
}

tareas2 = cargar();
if (tareas2.length > 0) nid = Math.max.apply(null, tareas2.map(function(t) { return t.id; })) + 1;

document.getElementById("add2").addEventListener("click", function() {
  var inp = document.getElementById("input2");
  if (!inp.value.trim()) return;
  tareas2.push({ id: nid++, texto: inp.value.trim(), completada: false });
  inp.value = "";
  guardar();
  render();
});

document.querySelectorAll(".filtro").forEach(function(btn) {
  btn.addEventListener("click", function() {
    document.querySelectorAll(".filtro").forEach(function(b) { b.classList.remove("activo"); });
    btn.classList.add("activo");
    filtroActual = btn.dataset.filtro;
    render();
  });
});

render();`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "js23-leccion-03",
      title: "Mejoras y refactorizacion",
      content: `## Mejoras a la Todo App

### 1. Editar tareas
Permitir hacer doble click en una tarea para editarla:
\`\`\`javascript
span.addEventListener("dblclick", function() {
  const input = document.createElement("input");
  input.value = tarea.texto;
  input.addEventListener("blur", function() {
    tarea.texto = input.value;
    guardar();
    render();
  });
  span.replaceWith(input);
  input.focus();
});
\`\`\`

### 2. Contador de tareas
Mostrar cuantas tareas quedan por completar.

### 3. Limpiar completadas
Un boton para eliminar todas las tareas completadas de una vez.

### 4. Drag and drop
Reordenar tareas arrastrándolas.

### Principios aplicados
- **Separacion de responsabilidades:** datos vs. vista
- **Single source of truth:** un unico array como fuente de verdad
- **Persistencia:** localStorage para datos no sensibles
- **Delegacion de eventos:** eficiente para listas dinamicas

> Este proyecto cubre la mayoria de conceptos de JavaScript que hemos aprendido: DOM, eventos, arrays, localStorage y funciones.`,
      codeExample: {
        html: '<div id="app3">\n  <h3>Todo App - Version Final</h3>\n  <div class="input-group">\n    <input id="input3" placeholder="Que necesitas hacer?" />\n    <button id="add3">Agregar</button>\n  </div>\n  <ul id="lista3"></ul>\n  <div class="footer3">\n    <span id="pendientes"></span>\n    <button id="limpiar">Limpiar completadas</button>\n  </div>\n</div>',
        css: '#app3 { max-width: 400px; } .input-group { display: flex; gap: 4px; margin-bottom: 8px; } #input3 { flex: 1; padding: 8px; border: 1px solid #45475a; border-radius: 4px; background: #313244; color: #cdd6f4; } #add3 { padding: 8px 12px; background: #a6e3a1; color: #1e1e2e; border: none; border-radius: 4px; cursor: pointer; } #lista3 { list-style: none; padding: 0; } #lista3 li { display: flex; align-items: center; gap: 8px; padding: 8px; margin: 2px 0; background: #313244; border-radius: 4px; color: #cdd6f4; } #lista3 li.done span { text-decoration: line-through; opacity: 0.5; } #lista3 .del { margin-left: auto; background: none; border: none; color: #f38ba8; cursor: pointer; opacity: 0; } #lista3 li:hover .del { opacity: 1; } .footer3 { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; font-size: 12px; color: #a6adc8; } #limpiar { font-size: 11px; padding: 4px 8px; background: none; color: #a6adc8; border: 1px solid #45475a; border-radius: 4px; cursor: pointer; }',
        js: `var tasks = [
  { id: 1, texto: "Revisar leccion de DOM", completada: true },
  { id: 2, texto: "Hacer ejercicios de arrays", completada: false },
  { id: 3, texto: "Construir todo app", completada: false }
];
var tid = 4;

function renderApp() {
  var lista = document.getElementById("lista3");
  lista.innerHTML = "";
  tasks.forEach(function(t) {
    var li = document.createElement("li");
    if (t.completada) li.className = "done";
    var cb = document.createElement("input");
    cb.type = "checkbox"; cb.checked = t.completada;
    cb.addEventListener("change", function() { t.completada = !t.completada; renderApp(); });
    var sp = document.createElement("span");
    sp.textContent = t.texto;
    var dl = document.createElement("button");
    dl.className = "del"; dl.textContent = "x";
    dl.addEventListener("click", function() { tasks = tasks.filter(function(x) { return x.id !== t.id; }); renderApp(); });
    li.appendChild(cb); li.appendChild(sp); li.appendChild(dl);
    lista.appendChild(li);
  });
  var pend = tasks.filter(function(t) { return !t.completada; }).length;
  document.getElementById("pendientes").textContent = pend + " tarea" + (pend !== 1 ? "s" : "") + " pendiente" + (pend !== 1 ? "s" : "");
}

document.getElementById("add3").addEventListener("click", function() {
  var inp = document.getElementById("input3");
  if (!inp.value.trim()) return;
  tasks.push({ id: tid++, texto: inp.value.trim(), completada: false });
  inp.value = ""; renderApp();
});
document.getElementById("input3").addEventListener("keydown", function(e) { if (e.key === "Enter") document.getElementById("add3").click(); });
document.getElementById("limpiar").addEventListener("click", function() {
  tasks = tasks.filter(function(t) { return !t.completada; });
  renderApp();
});
renderApp();`,
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "js23-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "En una Todo App, cual es el principio de 'single source of truth'?",
      options: [
        { id: "a", text: "Tener multiples copias de los datos", isCorrect: false },
        { id: "b", text: "Un unico array como fuente de verdad para los datos", isCorrect: true },
        { id: "c", text: "Guardar datos solo en el HTML", isCorrect: false },
        { id: "d", text: "No usar variables globales", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Una sola fuente de verdad evita inconsistencias.",
      explanation: "Single source of truth significa tener un unico lugar (el array) donde viven los datos. El HTML se renderiza a partir de el.",
    },
    {
      id: "js23-ej-02",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt: "Que metodo de array se usa para eliminar una tarea por su id?",
      options: [
        { id: "a", text: "splice()", isCorrect: false },
        { id: "b", text: "filter()", isCorrect: true },
        { id: "c", text: "remove()", isCorrect: false },
        { id: "d", text: "delete()", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Crea un nuevo array sin el elemento a eliminar.",
      explanation: "filter() crea un nuevo array excluyendo la tarea con el id dado: tareas.filter(t => t.id !== idAEliminar).",
    },
    {
      id: "js23-ej-03",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 3,
      prompt: "Por que usamos JSON.stringify() antes de guardar en localStorage?",
      options: [
        { id: "a", text: "Para encriptar los datos", isCorrect: false },
        { id: "b", text: "Porque localStorage solo acepta strings", isCorrect: true },
        { id: "c", text: "Para comprimir los datos", isCorrect: false },
        { id: "d", text: "Para validar los datos", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "localStorage tiene una limitacion de tipo de datos.",
      explanation: "localStorage solo acepta strings. JSON.stringify() convierte arrays y objetos a texto para poder guardarlos.",
    },
    {
      id: "js23-ej-04",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt: "Que evento usarias para detectar la tecla Enter en el input?",
      options: [
        { id: "a", text: "click", isCorrect: false },
        { id: "b", text: "keydown con e.key === 'Enter'", isCorrect: true },
        { id: "c", text: "change", isCorrect: false },
        { id: "d", text: "submit", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Necesitas detectar que tecla se presiono.",
      explanation: 'El evento keydown con la verificacion e.key === "Enter" detecta cuando el usuario presiona la tecla Enter.',
    },
    {
      id: "js23-ej-05",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt: "Cual es la ventaja de re-renderizar toda la lista en cada cambio?",
      options: [
        { id: "a", text: "Es mas rapido", isCorrect: false },
        { id: "b", text: "Simplifica el codigo y evita bugs de sincronizacion", isCorrect: true },
        { id: "c", text: "Usa menos memoria", isCorrect: false },
        { id: "d", text: "No hay ventaja", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Siempre muestra el estado actual de los datos.",
      explanation: "Re-renderizar toda la lista asegura que el HTML siempre refleja el estado actual de los datos, evitando inconsistencias.",
    },
    {
      id: "js23-ej-06",
      type: "code-completion",
      difficulty: 2 ,
      xpReward: 20,
      order: 6,
      prompt: "Completa para filtrar solo las tareas no completadas:",
      codeTemplate: {
        html: "",
        cssPrefix: "const pendientes = tareas.filter(function(t) { return ",
        cssSuffix: "; });",
        blanks: ["!t.completada"],
      },
      validation: { type: "exact", answer: "!t.completada" },
      hint: "Necesitas las tareas donde completada sea false.",
      explanation: "!t.completada es true cuando la tarea NO esta completada, filtrando solo las tareas pendientes.",
    },
  ],
};
