import type { ModuleData } from "@/types";

export const jsProyectoTodoModule: ModuleData = {
  slug: "js-proyecto-todo",
  title: "Proyecto: Lista de Tareas",
  description:
    "Construye una aplicacion completa de Lista de Tareas paso a paso: agregar, completar, eliminar y filtrar tareas, guardar en localStorage y renderizar desde el estado.",
  order: 123,
  category: "js-projects",
  icon: "check-square",
  dojo: "js",
  lessons: [
    {
      id: "js-23-leccion-01",
      title: "Estructura HTML y estado inicial",
      content: `## Proyecto Todo: Estructura y estado

En este proyecto construiremos una **Lista de Tareas completa** paso a paso. Cada leccion agrega funcionalidad nueva.

### Arquitectura de la app

Usaremos un patron simple pero efectivo:
1. **Estado** (datos) -> un array de objetos
2. **Renderizado** -> funcion que convierte estado a HTML
3. **Eventos** -> funciones que modifican el estado y re-renderizan

### El estado

\`\`\`javascript
// Nuestro estado es un array de tareas
let tareas = [
  { id: 1, texto: 'Aprender JavaScript', completada: false },
  { id: 2, texto: 'Construir un proyecto', completada: false },
  { id: 3, texto: 'Practicar diariamente', completada: true },
];
\`\`\`

### La estructura HTML

\`\`\`html
<div id="app">
  <h2>Mi Lista de Tareas</h2>
  <form id="form-tarea">
    <input type="text" id="input-tarea" placeholder="Nueva tarea...">
    <button type="submit">Agregar</button>
  </form>
  <ul id="lista-tareas"></ul>
</div>
\`\`\`

### Funcion de renderizado

\`\`\`javascript
function renderizar() {
  const lista = document.getElementById('lista-tareas');

  lista.innerHTML = tareas.map(tarea => \`
    <li style="
      display: flex;
      align-items: center;
      padding: 8px;
      margin: 4px 0;
      background: \${tarea.completada ? '#e8f5e9' : '#fff'};
      border: 1px solid #ddd;
      border-radius: 4px;
    ">
      <input type="checkbox"
        \${tarea.completada ? 'checked' : ''}
        onchange="toggleTarea(\${tarea.id})"
        style="margin-right: 8px;"
      >
      <span style="
        flex: 1;
        text-decoration: \${tarea.completada ? 'line-through' : 'none'};
        color: \${tarea.completada ? '#888' : '#333'};
      ">\${tarea.texto}</span>
      <button onclick="eliminarTarea(\${tarea.id})"
        style="background: #ff5252; color: white; border: none;
               padding: 4px 8px; border-radius: 4px; cursor: pointer;">
        X
      </button>
    </li>
  \`).join('');
}
\`\`\`

### Ciclo de la app

\`\`\`
Estado cambia -> renderizar() -> Usuario interactua -> Estado cambia -> ...
\`\`\`

El renderizado siempre refleja el estado actual. Nunca manipulamos el DOM directamente para agregar o quitar elementos; siempre modificamos el estado y re-renderizamos.

> **Concepto clave:** Esta arquitectura basada en estado es la base de frameworks como React y Vue. Aprenderla en JavaScript puro te dara una gran ventaja.`,
      order: 1,
    },
    {
      id: "js-23-leccion-02",
      title: "Agregar y eliminar tareas",
      content: `## Agregar y eliminar tareas

### Agregar tareas

\`\`\`javascript
let nextId = 1;

function agregarTarea(texto) {
  // Validar que no este vacio
  if (!texto.trim()) return;

  // Crear nueva tarea
  const nuevaTarea = {
    id: nextId++,
    texto: texto.trim(),
    completada: false,
    creadaEn: new Date()
  };

  // Agregar al estado
  tareas.push(nuevaTarea);

  // Re-renderizar
  renderizar();
}
\`\`\`

### Conectar el formulario

\`\`\`javascript
function inicializarApp() {
  const form = document.getElementById('form-tarea');
  const input = document.getElementById('input-tarea');

  form.addEventListener('submit', function(e) {
    e.preventDefault(); // Evitar recarga de pagina
    agregarTarea(input.value);
    input.value = ''; // Limpiar input
    input.focus();     // Volver al input
  });

  // Renderizado inicial
  renderizar();
}

// Iniciar la app
inicializarApp();
\`\`\`

### Eliminar tareas

\`\`\`javascript
function eliminarTarea(id) {
  // Filtrar la tarea eliminada
  tareas = tareas.filter(tarea => tarea.id !== id);
  renderizar();
}
\`\`\`

### Marcar como completada

\`\`\`javascript
function toggleTarea(id) {
  tareas = tareas.map(tarea => {
    if (tarea.id === id) {
      return { ...tarea, completada: !tarea.completada };
    }
    return tarea;
  });
  renderizar();
}
\`\`\`

### Codigo completo hasta ahora

\`\`\`javascript
let tareas = [];
let nextId = 1;

function agregarTarea(texto) {
  if (!texto.trim()) return;
  tareas.push({
    id: nextId++,
    texto: texto.trim(),
    completada: false
  });
  renderizar();
}

function eliminarTarea(id) {
  tareas = tareas.filter(t => t.id !== id);
  renderizar();
}

function toggleTarea(id) {
  tareas = tareas.map(t =>
    t.id === id ? { ...t, completada: !t.completada } : t
  );
  renderizar();
}

function renderizar() {
  const lista = document.getElementById('lista-tareas');
  if (tareas.length === 0) {
    lista.innerHTML = '<p style="color: #999; text-align: center;">No hay tareas. Agrega una!</p>';
    return;
  }
  // ... (renderizado de la leccion anterior)
}
\`\`\`

> **Patron importante:** Cada funcion de accion sigue el mismo patron: modificar estado -> renderizar. Esto mantiene el codigo predecible.`,
      order: 2,
    },
    {
      id: "js-23-leccion-03",
      title: "Filtros: todas, activas y completadas",
      content: `## Filtros: todas, activas y completadas

### Estado del filtro

\`\`\`javascript
let filtroActual = 'todas'; // 'todas' | 'activas' | 'completadas'
\`\`\`

### Botones de filtro

\`\`\`javascript
function renderizarFiltros() {
  const filtros = ['todas', 'activas', 'completadas'];

  return \`
    <div style="display: flex; gap: 8px; margin: 12px 0;">
      \${filtros.map(filtro => \`
        <button onclick="cambiarFiltro('\${filtro}')"
          style="
            padding: 6px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
            background: \${filtroActual === filtro ? '#1976d2' : '#fff'};
            color: \${filtroActual === filtro ? '#fff' : '#333'};
          ">
          \${filtro.charAt(0).toUpperCase() + filtro.slice(1)}
        </button>
      \`).join('')}
    </div>
    <p style="color: #666; font-size: 14px;">
      \${tareas.filter(t => !t.completada).length} tareas pendientes
    </p>
  \`;
}
\`\`\`

### Funcion para cambiar filtro

\`\`\`javascript
function cambiarFiltro(nuevoFiltro) {
  filtroActual = nuevoFiltro;
  renderizar();
}

function obtenerTareasFiltradas() {
  switch (filtroActual) {
    case 'activas':
      return tareas.filter(t => !t.completada);
    case 'completadas':
      return tareas.filter(t => t.completada);
    default:
      return tareas;
  }
}
\`\`\`

### Renderizado actualizado con filtros

\`\`\`javascript
function renderizar() {
  const app = document.getElementById('app');
  const tareasFiltradas = obtenerTareasFiltradas();

  app.innerHTML = \`
    <form id="form-tarea" style="display: flex; gap: 8px; margin-bottom: 8px;">
      <input type="text" id="input-tarea"
        placeholder="Nueva tarea..."
        style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
      <button type="submit"
        style="padding: 8px 16px; background: #1976d2; color: white;
               border: none; border-radius: 4px; cursor: pointer;">
        Agregar
      </button>
    </form>

    \${renderizarFiltros()}

    <ul id="lista-tareas" style="list-style: none; padding: 0;">
      \${tareasFiltradas.length === 0
        ? '<li style="color: #999; text-align: center; padding: 16px;">No hay tareas en esta categoria</li>'
        : tareasFiltradas.map(tarea => \`
          <li style="display: flex; align-items: center; padding: 8px;
                     margin: 4px 0; background: \${tarea.completada ? '#e8f5e9' : '#fff'};
                     border: 1px solid #ddd; border-radius: 4px;">
            <input type="checkbox"
              \${tarea.completada ? 'checked' : ''}
              onchange="toggleTarea(\${tarea.id})"
              style="margin-right: 8px;">
            <span style="flex: 1; text-decoration: \${tarea.completada ? 'line-through' : 'none'};
                         color: \${tarea.completada ? '#888' : '#333'};">
              \${tarea.texto}
            </span>
            <button onclick="eliminarTarea(\${tarea.id})"
              style="background: #ff5252; color: white; border: none;
                     padding: 4px 8px; border-radius: 4px; cursor: pointer;">
              X
            </button>
          </li>
        \`).join('')
      }
    </ul>
  \`;

  // Re-conectar evento del formulario
  document.getElementById('form-tarea').addEventListener('submit', function(e) {
    e.preventDefault();
    const input = document.getElementById('input-tarea');
    agregarTarea(input.value);
    input.value = '';
  });
}
\`\`\`

> **Nota:** Al re-renderizar todo el HTML, necesitamos volver a conectar los event listeners del formulario. En frameworks como React esto se maneja automaticamente.`,
      order: 3,
    },
    {
      id: "js-23-leccion-04",
      title: "Persistencia con localStorage",
      content: `## Persistencia con localStorage

### El problema

Cada vez que recargamos la pagina, perdemos todas las tareas. **localStorage** nos permite guardar datos en el navegador.

### Guardar tareas

\`\`\`javascript
function guardarTareas() {
  localStorage.setItem('mis-tareas', JSON.stringify(tareas));
  localStorage.setItem('todo-nextId', nextId.toString());
}
\`\`\`

### Cargar tareas

\`\`\`javascript
function cargarTareas() {
  try {
    const guardadas = localStorage.getItem('mis-tareas');
    if (guardadas) {
      tareas = JSON.parse(guardadas);
    }
    const idGuardado = localStorage.getItem('todo-nextId');
    if (idGuardado) {
      nextId = parseInt(idGuardado);
    }
  } catch (error) {
    console.error('Error al cargar tareas:', error);
    tareas = [];
  }
}
\`\`\`

### Integrar persistencia

Ahora cada funcion que modifica el estado tambien guarda:

\`\`\`javascript
function agregarTarea(texto) {
  if (!texto.trim()) return;
  tareas.push({
    id: nextId++,
    texto: texto.trim(),
    completada: false
  });
  guardarTareas(); // Persistir
  renderizar();
}

function eliminarTarea(id) {
  tareas = tareas.filter(t => t.id !== id);
  guardarTareas(); // Persistir
  renderizar();
}

function toggleTarea(id) {
  tareas = tareas.map(t =>
    t.id === id ? { ...t, completada: !t.completada } : t
  );
  guardarTareas(); // Persistir
  renderizar();
}
\`\`\`

### App completa con localStorage

\`\`\`javascript
// === Estado ===
let tareas = [];
let nextId = 1;
let filtroActual = 'todas';

// === Persistencia ===
function guardarTareas() {
  localStorage.setItem('mis-tareas', JSON.stringify(tareas));
  localStorage.setItem('todo-nextId', nextId.toString());
}

function cargarTareas() {
  try {
    const guardadas = localStorage.getItem('mis-tareas');
    if (guardadas) tareas = JSON.parse(guardadas);
    const idGuardado = localStorage.getItem('todo-nextId');
    if (idGuardado) nextId = parseInt(idGuardado);
  } catch (e) {
    console.error('Error cargando tareas:', e);
  }
}

// === Acciones ===
function agregarTarea(texto) {
  if (!texto.trim()) return;
  tareas.push({ id: nextId++, texto: texto.trim(), completada: false });
  guardarTareas();
  renderizar();
}

function eliminarTarea(id) {
  tareas = tareas.filter(t => t.id !== id);
  guardarTareas();
  renderizar();
}

function toggleTarea(id) {
  tareas = tareas.map(t =>
    t.id === id ? { ...t, completada: !t.completada } : t
  );
  guardarTareas();
  renderizar();
}

function cambiarFiltro(filtro) {
  filtroActual = filtro;
  renderizar();
}

// === Inicializacion ===
cargarTareas();
renderizar();
\`\`\`

### Funcionalidad extra: limpiar completadas

\`\`\`javascript
function limpiarCompletadas() {
  tareas = tareas.filter(t => !t.completada);
  guardarTareas();
  renderizar();
}
\`\`\`

> **Felicidades!** Has construido una aplicacion completa con estado, renderizado, interactividad y persistencia. Estos mismos conceptos aplican en React, Vue y Angular.`,
      order: 4,
    },
  ],
  exercises: [
    {
      id: "js-23-ej-01",
      type: "live-editor",
      difficulty: 1,
      xpReward: 20,
      order: 1,
      prompt: "Crea el estado inicial de la app: un array 'tareas' con 2 tareas de ejemplo (cada una con id, texto y completada) y una funcion renderizar() que muestre las tareas como elementos <li> dentro del div #app.",
      codeTemplate: {
        html: `<div style="font-family: system-ui; max-width: 400px; margin: 0 auto; padding: 16px;">
  <h2 style="margin-bottom: 12px;">Mi Lista de Tareas</h2>
  <div id="app"></div>
</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      validation: {
        type: "includes",
        answer: ["tareas", "renderizar", "getElementById", "innerHTML"],
      },
      hint: "Define un array de tareas y una funcion que genere HTML con map() y lo asigne a innerHTML.",
      explanation: "El estado (array de tareas) es la fuente de verdad. La funcion renderizar() convierte ese estado en HTML visible, usando map() para generar un <li> por cada tarea.",
    },
    {
      id: "js-23-ej-02",
      type: "live-editor",
      difficulty: 2,
      xpReward: 25,
      order: 2,
      prompt: "Agrega la funcionalidad de agregar tareas: crea un formulario con input y boton, y la funcion agregarTarea(texto) que anade una nueva tarea al array y re-renderiza.",
      codeTemplate: {
        html: `<div style="font-family: system-ui; max-width: 400px; margin: 0 auto; padding: 16px;">
  <h2 style="margin-bottom: 12px;">Mi Lista de Tareas</h2>
  <div id="app"></div>
</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      validation: {
        type: "includes",
        answer: ["agregarTarea", "push", "renderizar", "submit", "preventDefault"],
      },
      hint: "Usa un formulario con evento submit, preventDefault para evitar recarga, y push para agregar al array.",
      explanation: "El formulario captura el submit, previene la recarga con preventDefault(), llama a agregarTarea() que hace push al array y ejecuta renderizar().",
    },
    {
      id: "js-23-ej-03",
      type: "live-editor",
      difficulty: 2,
      xpReward: 25,
      order: 3,
      prompt: "Implementa la funcion toggleTarea(id) que cambie el estado completada de una tarea (true/false) y la funcion eliminarTarea(id) que la elimine del array. Ambas deben re-renderizar.",
      codeTemplate: {
        html: `<div style="font-family: system-ui; max-width: 400px; margin: 0 auto; padding: 16px;">
  <h2 style="margin-bottom: 12px;">Mi Lista de Tareas</h2>
  <div id="app"></div>
</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      validation: {
        type: "includes",
        answer: ["toggleTarea", "eliminarTarea", "filter", "map", "completada"],
      },
      hint: "Usa map() para toggle (crear copia con completada invertida) y filter() para eliminar.",
      explanation: "toggleTarea usa map() para encontrar la tarea por id y crear una copia con completada invertida. eliminarTarea usa filter() para excluir la tarea del array.",
    },
    {
      id: "js-23-ej-04",
      type: "live-editor",
      difficulty: 2,
      xpReward: 25,
      order: 4,
      prompt: "Agrega filtros a la app: botones para mostrar 'Todas', 'Activas' y 'Completadas'. Crea una variable filtroActual y una funcion obtenerTareasFiltradas() que devuelva solo las tareas del filtro seleccionado.",
      codeTemplate: {
        html: `<div style="font-family: system-ui; max-width: 400px; margin: 0 auto; padding: 16px;">
  <h2 style="margin-bottom: 12px;">Mi Lista de Tareas</h2>
  <div id="app"></div>
</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      validation: {
        type: "includes",
        answer: ["filtroActual", "obtenerTareasFiltradas", "filter", "completada"],
      },
      hint: "Crea una variable filtroActual y usa switch o if para filtrar el array segun el filtro activo.",
      explanation: "filtroActual guarda el filtro seleccionado. obtenerTareasFiltradas() usa filter() para devolver solo las tareas que corresponden al filtro ('activas' = no completadas, 'completadas' = completadas).",
    },
    {
      id: "js-23-ej-05",
      type: "live-editor",
      difficulty: 3,
      xpReward: 30,
      order: 5,
      prompt: "Implementa la persistencia con localStorage: crea guardarTareas() que guarde el array en localStorage y cargarTareas() que lo recupere al iniciar la app. Llama a guardarTareas() cada vez que el estado cambie.",
      codeTemplate: {
        html: `<div style="font-family: system-ui; max-width: 400px; margin: 0 auto; padding: 16px;">
  <h2 style="margin-bottom: 12px;">Mi Lista de Tareas</h2>
  <div id="app"></div>
</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      validation: {
        type: "includes",
        answer: ["localStorage", "setItem", "getItem", "JSON.stringify", "JSON.parse"],
      },
      hint: "Usa localStorage.setItem con JSON.stringify para guardar y getItem con JSON.parse para cargar.",
      explanation: "guardarTareas() serializa el array con JSON.stringify y lo guarda con setItem. cargarTareas() usa getItem y JSON.parse para recuperar los datos al iniciar.",
    },
    {
      id: "js-23-ej-06",
      type: "live-editor",
      difficulty: 3,
      xpReward: 35,
      order: 6,
      prompt: "Crea la app de Todo List completa con todas las funcionalidades: agregar, toggle, eliminar, filtrar (todas/activas/completadas), contador de pendientes y boton 'Limpiar completadas'. Todo el estado debe renderizarse desde el array.",
      codeTemplate: {
        html: `<div style="font-family: system-ui; max-width: 400px; margin: 0 auto; padding: 16px;">
  <h2 style="margin-bottom: 12px;">Mi Lista de Tareas</h2>
  <div id="app"></div>
</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      validation: {
        type: "includes",
        answer: ["agregarTarea", "eliminarTarea", "toggleTarea", "filtro", "renderizar", "limpiarCompletadas"],
      },
      hint: "Combina todo lo aprendido: estado, funciones de accion, filtros y renderizado completo.",
      explanation: "La app completa combina: estado (array + filtro), acciones (agregar, toggle, eliminar, filtrar, limpiar), renderizado (genera todo el HTML desde el estado) y eventos (formulario, checkboxes, botones).",
    },
  ],
};
