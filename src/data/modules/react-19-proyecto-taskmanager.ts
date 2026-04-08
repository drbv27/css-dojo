import type { ModuleData } from "@/types";

export const reactProyectoTaskModule: ModuleData = {
  slug: "react-proyecto-taskmanager",
  title: "Proyecto: Task Manager",
  description:
    "Construye un gestor de tareas completo con React: componentes, useReducer, filtros, ordenamiento y persistencia con localStorage.",
  order: 219,
  category: "react-projects",
  icon: "check-square",
  dojo: "react",
  lessons: [
    {
      id: "react19-leccion-01",
      title: "Estructura de componentes y estado",
      content: `## Proyecto: Task Manager con React

Vamos a construir un gestor de tareas profesional paso a paso.

### Funcionalidades
1. Agregar, editar y eliminar tareas
2. Marcar como completadas
3. Filtrar por estado (todas, activas, completadas)
4. Ordenar por fecha o prioridad
5. Persistir en localStorage
6. Arquitectura limpia con useReducer

### Arquitectura de Componentes
\`\`\`
App
├── TaskForm (formulario para agregar)
├── TaskFilters (filtros y ordenamiento)
├── TaskList
│   └── TaskItem (cada tarea individual)
└── TaskStats (estadisticas)
\`\`\`

### Modelo de datos
\`\`\`jsx
{
  id: crypto.randomUUID(),
  titulo: "Aprender React",
  descripcion: "Completar el modulo de proyectos",
  prioridad: "alta",  // alta, media, baja
  completada: false,
  creadaEn: new Date().toISOString(),
}
\`\`\`

### Por que useReducer?
- Multiples acciones (agregar, eliminar, editar, toggle, filtrar)
- Estado complejo con sub-valores
- Logica predecible y testeable

> **Principio:** Separa la logica de estado (reducer) de la presentacion (componentes).`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const { useReducer, useState } = React;

// Reducer de tareas
const initialState = {
  tareas: [
    { id: '1', titulo: 'Aprender useReducer', prioridad: 'alta', completada: true, creadaEn: '2024-01-15' },
    { id: '2', titulo: 'Crear componentes', prioridad: 'media', completada: false, creadaEn: '2024-01-16' },
    { id: '3', titulo: 'Implementar filtros', prioridad: 'baja', completada: false, creadaEn: '2024-01-17' },
  ],
  filtro: 'todas',
};

function taskReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return { ...state, tareas: [...state.tareas, action.payload] };
    case 'TOGGLE':
      return {
        ...state,
        tareas: state.tareas.map(t =>
          t.id === action.payload ? { ...t, completada: !t.completada } : t
        ),
      };
    case 'DELETE':
      return { ...state, tareas: state.tareas.filter(t => t.id !== action.payload) };
    case 'SET_FILTER':
      return { ...state, filtro: action.payload };
    default:
      return state;
  }
}

// Componentes
function TaskForm({ dispatch }) {
  const [titulo, setTitulo] = useState('');
  const [prioridad, setPrioridad] = useState('media');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!titulo.trim()) return;
    dispatch({
      type: 'ADD',
      payload: {
        id: String(Date.now()),
        titulo,
        prioridad,
        completada: false,
        creadaEn: new Date().toISOString().split('T')[0],
      },
    });
    setTitulo('');
  };

  const colors = { alta: '#f38ba8', media: '#f9e2af', baja: '#a6e3a1' };

  return (
    <form onSubmit={handleSubmit} style={{display:'flex', gap:8, marginBottom:16}}>
      <input value={titulo} onChange={e => setTitulo(e.target.value)}
        placeholder="Nueva tarea..." style={{flex:1, padding:8, borderRadius:4, border:'1px solid #ccc'}} />
      <select value={prioridad} onChange={e => setPrioridad(e.target.value)}
        style={{padding:8, borderRadius:4, background: colors[prioridad]}}>
        <option value="alta">Alta</option>
        <option value="media">Media</option>
        <option value="baja">Baja</option>
      </select>
      <button type="submit" style={{padding:'8px 16px', background:'#89b4fa', color:'#1e1e2e', border:'none', borderRadius:6, cursor:'pointer'}}>+</button>
    </form>
  );
}

function TaskItem({ tarea, dispatch }) {
  const colors = { alta: '#f38ba8', media: '#f9e2af', baja: '#a6e3a1' };
  return (
    <div style={{display:'flex', alignItems:'center', gap:8, padding:8, margin:4, background:'#f5f5f5', borderRadius:6, borderLeft:\`4px solid \${colors[tarea.prioridad]}\`}}>
      <input type="checkbox" checked={tarea.completada}
        onChange={() => dispatch({ type: 'TOGGLE', payload: tarea.id })} />
      <span style={{flex:1, textDecoration: tarea.completada ? 'line-through' : 'none', opacity: tarea.completada ? 0.5 : 1}}>
        {tarea.titulo}
      </span>
      <span style={{fontSize:11, color:'#888'}}>{tarea.prioridad}</span>
      <button onClick={() => dispatch({ type: 'DELETE', payload: tarea.id })}
        style={{background:'#f38ba8', color:'#fff', border:'none', borderRadius:4, padding:'2px 8px', cursor:'pointer'}}>X</button>
    </div>
  );
}

function App() {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const { tareas, filtro } = state;

  const filtradas = tareas.filter(t => {
    if (filtro === 'activas') return !t.completada;
    if (filtro === 'completadas') return t.completada;
    return true;
  });

  const completadas = tareas.filter(t => t.completada).length;

  return (
    <div>
      <h3>Task Manager</h3>
      <TaskForm dispatch={dispatch} />
      <div style={{display:'flex', gap:4, marginBottom:12}}>
        {['todas', 'activas', 'completadas'].map(f => (
          <button key={f} onClick={() => dispatch({ type: 'SET_FILTER', payload: f })}
            style={{padding:'4px 12px', background: filtro === f ? '#89b4fa' : '#e0e0e0', color: filtro === f ? '#1e1e2e' : '#333', border:'none', borderRadius:4, cursor:'pointer', fontSize:13}}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      {filtradas.map(t => <TaskItem key={t.id} tarea={t} dispatch={dispatch} />)}
      <p style={{fontSize:12, color:'#888', marginTop:8}}>{completadas}/{tareas.length} completadas</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; max-width: 500px; }',
        editable: true,
      },
      order: 1,
    },
    {
      id: "react19-leccion-02",
      title: "Persistencia con localStorage",
      content: `## Persistiendo el Estado en localStorage

### Custom Hook: useLocalStorage
\`\`\`jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
\`\`\`

### Integrando con useReducer
\`\`\`jsx
function useReducerWithStorage(key, reducer, initialState) {
  const [state, dispatch] = useReducer(reducer, initialState, () => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialState;
    } catch {
      return initialState;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, dispatch];
}
\`\`\`

### Consideraciones
- **Serializar:** Solo datos serializables (no funciones ni Dates)
- **Tamano:** localStorage tiene limite de ~5MB
- **Performance:** No guardar en cada keystroke (usa debounce)
- **Migracion:** Maneja versiones del esquema de datos

> **Tip:** Crea un custom hook generico y reutilizalo en todos tus proyectos.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const { useReducer, useEffect, useState } = React;

// useReducer con persistencia
function useReducerConStorage(key, reducer, initialState) {
  const [state, dispatch] = useReducer(reducer, initialState, () => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialState;
    } catch {
      return initialState;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, dispatch];
}

function notasReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [...state, { id: Date.now(), texto: action.payload, fecha: new Date().toLocaleDateString() }];
    case 'DELETE':
      return state.filter(n => n.id !== action.payload);
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

function NotasApp() {
  const [notas, dispatch] = useReducerConStorage('notas-app', notasReducer, []);
  const [texto, setTexto] = useState('');

  const agregar = () => {
    if (!texto.trim()) return;
    dispatch({ type: 'ADD', payload: texto });
    setTexto('');
  };

  return (
    <div>
      <h3>Notas con localStorage</h3>
      <p style={{fontSize:12, color:'#888'}}>Las notas persisten al recargar la pagina!</p>
      <div style={{display:'flex', gap:8, marginBottom:12}}>
        <input value={texto} onChange={e => setTexto(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && agregar()}
          placeholder="Nueva nota..." style={{flex:1, padding:8, borderRadius:4, border:'1px solid #ccc'}} />
        <button onClick={agregar}>Agregar</button>
      </div>
      {notas.length === 0 ? (
        <p style={{color:'#888', textAlign:'center'}}>No hay notas. Agrega una!</p>
      ) : (
        notas.map(n => (
          <div key={n.id} style={{display:'flex', justifyContent:'space-between', padding:8, margin:4, background:'#f9e2af', borderRadius:6}}>
            <div>
              <span>{n.texto}</span>
              <span style={{fontSize:11, color:'#888', marginLeft:8}}>{n.fecha}</span>
            </div>
            <button onClick={() => dispatch({ type: 'DELETE', payload: n.id })}
              style={{background:'#f38ba8', padding:'2px 8px', fontSize:12}}>X</button>
          </div>
        ))
      )}
      {notas.length > 0 && (
        <button onClick={() => dispatch({ type: 'CLEAR' })}
          style={{marginTop:8, background:'#cba6f7', fontSize:12}}>
          Borrar todas ({notas.length})
        </button>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<NotasApp />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; } button { padding: 6px 14px; background: #a6e3a1; color: #1e1e2e; border: none; border-radius: 6px; cursor: pointer; }',
        editable: true,
      },
      order: 2,
    },
    {
      id: "react19-leccion-03",
      title: "Filtros, ordenamiento y edicion",
      content: `## Filtros Avanzados y Edicion

### Filtros multiples
\`\`\`jsx
function filtrarTareas(tareas, filtros) {
  return tareas
    .filter(t => {
      if (filtros.estado === 'activas') return !t.completada;
      if (filtros.estado === 'completadas') return t.completada;
      return true;
    })
    .filter(t => {
      if (filtros.prioridad !== 'todas') return t.prioridad === filtros.prioridad;
      return true;
    })
    .filter(t =>
      t.titulo.toLowerCase().includes(filtros.busqueda.toLowerCase())
    );
}
\`\`\`

### Ordenamiento
\`\`\`jsx
function ordenarTareas(tareas, criterio) {
  return [...tareas].sort((a, b) => {
    if (criterio === 'fecha') return new Date(b.creadaEn) - new Date(a.creadaEn);
    if (criterio === 'prioridad') {
      const orden = { alta: 0, media: 1, baja: 2 };
      return orden[a.prioridad] - orden[b.prioridad];
    }
    return a.titulo.localeCompare(b.titulo);
  });
}
\`\`\`

### Edicion inline
\`\`\`jsx
function TaskItem({ tarea, onUpdate }) {
  const [editando, setEditando] = useState(false);
  const [texto, setTexto] = useState(tarea.titulo);

  const guardar = () => {
    onUpdate(tarea.id, texto);
    setEditando(false);
  };

  if (editando) {
    return (
      <input value={texto}
        onChange={e => setTexto(e.target.value)}
        onBlur={guardar}
        onKeyDown={e => e.key === 'Enter' && guardar()}
        autoFocus />
    );
  }
  return <span onDoubleClick={() => setEditando(true)}>{tarea.titulo}</span>;
}
\`\`\`

> **Tip:** Mantener los filtros y ordenamiento como funciones puras fuera del componente facilita el testing.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const { useReducer, useState, useMemo } = React;

const tareasIniciales = [
  { id: '1', titulo: 'Revisar pull requests', prioridad: 'alta', completada: false, creadaEn: '2024-03-01' },
  { id: '2', titulo: 'Escribir documentacion', prioridad: 'media', completada: true, creadaEn: '2024-03-02' },
  { id: '3', titulo: 'Actualizar dependencias', prioridad: 'baja', completada: false, creadaEn: '2024-03-03' },
  { id: '4', titulo: 'Corregir bug critico', prioridad: 'alta', completada: false, creadaEn: '2024-03-04' },
  { id: '5', titulo: 'Reuncion de equipo', prioridad: 'media', completada: true, creadaEn: '2024-03-05' },
];

function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE': return state.map(t => t.id === action.id ? { ...t, completada: !t.completada } : t);
    case 'EDIT': return state.map(t => t.id === action.id ? { ...t, titulo: action.titulo } : t);
    case 'DELETE': return state.filter(t => t.id !== action.id);
    default: return state;
  }
}

function EditableTask({ tarea, dispatch }) {
  const [editando, setEditando] = useState(false);
  const [texto, setTexto] = useState(tarea.titulo);
  const colors = { alta: '#f38ba8', media: '#f9e2af', baja: '#a6e3a1' };

  const guardar = () => {
    dispatch({ type: 'EDIT', id: tarea.id, titulo: texto });
    setEditando(false);
  };

  return (
    <div style={{display:'flex', alignItems:'center', gap:8, padding:8, margin:3, background:'#f5f5f5', borderRadius:6, borderLeft:\`4px solid \${colors[tarea.prioridad]}\`}}>
      <input type="checkbox" checked={tarea.completada}
        onChange={() => dispatch({ type: 'TOGGLE', id: tarea.id })} />
      {editando ? (
        <input value={texto} onChange={e => setTexto(e.target.value)}
          onBlur={guardar} onKeyDown={e => e.key === 'Enter' && guardar()}
          autoFocus style={{flex:1, padding:4, border:'1px solid #89b4fa', borderRadius:4}} />
      ) : (
        <span onDoubleClick={() => setEditando(true)}
          style={{flex:1, textDecoration: tarea.completada ? 'line-through' : 'none', opacity: tarea.completada ? 0.5 : 1, cursor:'pointer'}}
          title="Doble click para editar">
          {tarea.titulo}
        </span>
      )}
      <span style={{fontSize:10, padding:'2px 6px', background: colors[tarea.prioridad], borderRadius:4}}>{tarea.prioridad}</span>
      <button onClick={() => dispatch({ type: 'DELETE', id: tarea.id })}
        style={{background:'#f38ba8', color:'#fff', border:'none', borderRadius:4, padding:'2px 6px', cursor:'pointer', fontSize:11}}>X</button>
    </div>
  );
}

function App() {
  const [tareas, dispatch] = useReducer(reducer, tareasIniciales);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [filtroPrioridad, setFiltroPrioridad] = useState('todas');
  const [orden, setOrden] = useState('fecha');

  const resultado = useMemo(() => {
    let filtradas = tareas
      .filter(t => {
        if (filtroEstado === 'activas') return !t.completada;
        if (filtroEstado === 'completadas') return t.completada;
        return true;
      })
      .filter(t => filtroPrioridad === 'todas' || t.prioridad === filtroPrioridad)
      .filter(t => t.titulo.toLowerCase().includes(busqueda.toLowerCase()));

    return [...filtradas].sort((a, b) => {
      if (orden === 'fecha') return b.creadaEn.localeCompare(a.creadaEn);
      if (orden === 'prioridad') {
        const o = { alta: 0, media: 1, baja: 2 };
        return o[a.prioridad] - o[b.prioridad];
      }
      return a.titulo.localeCompare(b.titulo);
    });
  }, [tareas, busqueda, filtroEstado, filtroPrioridad, orden]);

  return (
    <div>
      <h3>Task Manager: Filtros y Edicion</h3>
      <input value={busqueda} onChange={e => setBusqueda(e.target.value)}
        placeholder="Buscar tarea..." style={{width:'100%', padding:8, marginBottom:8, borderRadius:4, border:'1px solid #ccc', boxSizing:'border-box'}} />
      <div style={{display:'flex', gap:4, flexWrap:'wrap', marginBottom:8, fontSize:12}}>
        {['todas','activas','completadas'].map(f => (
          <button key={f} onClick={() => setFiltroEstado(f)}
            style={{padding:'3px 10px', background: filtroEstado === f ? '#89b4fa' : '#e0e0e0', border:'none', borderRadius:4, cursor:'pointer', fontSize:11}}>
            {f}
          </button>
        ))}
        <span style={{color:'#aaa'}}>|</span>
        {['todas','alta','media','baja'].map(p => (
          <button key={p} onClick={() => setFiltroPrioridad(p)}
            style={{padding:'3px 10px', background: filtroPrioridad === p ? '#cba6f7' : '#e0e0e0', border:'none', borderRadius:4, cursor:'pointer', fontSize:11}}>
            {p}
          </button>
        ))}
        <span style={{color:'#aaa'}}>|</span>
        <select value={orden} onChange={e => setOrden(e.target.value)} style={{fontSize:11, padding:2}}>
          <option value="fecha">Fecha</option>
          <option value="prioridad">Prioridad</option>
          <option value="nombre">Nombre</option>
        </select>
      </div>
      {resultado.map(t => <EditableTask key={t.id} tarea={t} dispatch={dispatch} />)}
      <p style={{fontSize:11, color:'#888', marginTop:8}}>{resultado.length} tareas | Doble click para editar</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; max-width: 500px; }',
        editable: true,
      },
      order: 3,
    },
    {
      id: "react19-leccion-04",
      title: "Arquitectura limpia y mejores practicas",
      content: `## Arquitectura Limpia en React

### Estructura de carpetas recomendada
\`\`\`
src/
├── components/        # Componentes de UI
│   ├── TaskForm.jsx
│   ├── TaskItem.jsx
│   ├── TaskList.jsx
│   └── TaskFilters.jsx
├── hooks/             # Custom hooks
│   ├── useLocalStorage.js
│   └── useTasks.js
├── reducers/          # Logica de estado
│   └── taskReducer.js
├── utils/             # Funciones puras
│   ├── filterTasks.js
│   └── sortTasks.js
├── types/             # TypeScript types
│   └── task.ts
└── App.jsx
\`\`\`

### Principios aplicados
1. **Separacion de responsabilidades** — cada archivo tiene un solo proposito
2. **Custom hooks** — encapsulan logica de estado reutilizable
3. **Funciones puras** — filtros y ordenamiento son testeables
4. **Componentes presentacionales** — solo reciben props y renderizan

### Custom hook: useTasks
\`\`\`jsx
function useTasks() {
  const [state, dispatch] = useReducerConStorage(
    'tasks', taskReducer, initialState
  );

  const addTask = (titulo, prioridad) => {
    dispatch({ type: 'ADD', payload: { titulo, prioridad } });
  };

  const toggleTask = (id) => dispatch({ type: 'TOGGLE', payload: id });
  const deleteTask = (id) => dispatch({ type: 'DELETE', payload: id });

  return { tasks: state.tasks, addTask, toggleTask, deleteTask };
}
\`\`\`

### Mejores practicas
- **No mezclar** logica de negocio con presentacion
- **Nombrar** acciones del reducer de forma descriptiva
- **Tipar** todo con TypeScript en proyectos reales
- **Testear** el reducer y las funciones de filtro por separado

> **Regla de oro:** Si un archivo tiene mas de 100-150 lineas, probablemente necesita dividirse.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const { useReducer, useEffect, useState, useMemo } = React;

// === REDUCER (reducers/taskReducer.js) ===
function taskReducer(state, action) {
  switch (action.type) {
    case 'ADD_TASK':
      return { ...state, tareas: [...state.tareas, {
        id: String(Date.now()), titulo: action.payload.titulo,
        prioridad: action.payload.prioridad, completada: false,
        creadaEn: new Date().toISOString().split('T')[0]
      }]};
    case 'TOGGLE_TASK':
      return { ...state, tareas: state.tareas.map(t => t.id === action.payload ? { ...t, completada: !t.completada } : t) };
    case 'DELETE_TASK':
      return { ...state, tareas: state.tareas.filter(t => t.id !== action.payload) };
    default: return state;
  }
}

// === CUSTOM HOOK (hooks/useTasks.js) ===
function useTasks() {
  const [state, dispatch] = useReducer(taskReducer, { tareas: [
    { id: '1', titulo: 'Disenar arquitectura', prioridad: 'alta', completada: true, creadaEn: '2024-03-01' },
    { id: '2', titulo: 'Crear componentes', prioridad: 'alta', completada: true, creadaEn: '2024-03-02' },
    { id: '3', titulo: 'Agregar filtros', prioridad: 'media', completada: false, creadaEn: '2024-03-03' },
    { id: '4', titulo: 'Persistir datos', prioridad: 'media', completada: false, creadaEn: '2024-03-04' },
    { id: '5', titulo: 'Deploy a produccion', prioridad: 'baja', completada: false, creadaEn: '2024-03-05' },
  ]});

  return {
    tareas: state.tareas,
    addTask: (titulo, prioridad) => dispatch({ type: 'ADD_TASK', payload: { titulo, prioridad } }),
    toggleTask: (id) => dispatch({ type: 'TOGGLE_TASK', payload: id }),
    deleteTask: (id) => dispatch({ type: 'DELETE_TASK', payload: id }),
  };
}

// === COMPONENTES (components/) ===
function TaskForm({ onAdd }) {
  const [titulo, setTitulo] = useState('');
  const handleSubmit = (e) => { e.preventDefault(); if (titulo.trim()) { onAdd(titulo, 'media'); setTitulo(''); } };
  return (
    <form onSubmit={handleSubmit} style={{display:'flex', gap:8, marginBottom:16}}>
      <input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Nueva tarea..."
        style={{flex:1, padding:8, borderRadius:6, border:'1px solid #ddd'}} />
      <button type="submit">Agregar</button>
    </form>
  );
}

function TaskItem({ tarea, onToggle, onDelete }) {
  const colors = { alta: '#f38ba8', media: '#f9e2af', baja: '#a6e3a1' };
  return (
    <div style={{display:'flex', alignItems:'center', gap:8, padding:10, margin:4, background:'#fafafa', borderRadius:8, borderLeft:\`4px solid \${colors[tarea.prioridad]}\`}}>
      <input type="checkbox" checked={tarea.completada} onChange={() => onToggle(tarea.id)} />
      <span style={{flex:1, textDecoration: tarea.completada ? 'line-through' : 'none', opacity: tarea.completada ? 0.5 : 1}}>
        {tarea.titulo}
      </span>
      <button onClick={() => onDelete(tarea.id)} style={{background:'#f38ba8', color:'#fff', border:'none', borderRadius:4, padding:'2px 8px', cursor:'pointer', fontSize:11}}>X</button>
    </div>
  );
}

function TaskStats({ tareas }) {
  const total = tareas.length;
  const completadas = tareas.filter(t => t.completada).length;
  const porcentaje = total > 0 ? Math.round((completadas / total) * 100) : 0;
  return (
    <div style={{display:'flex', justifyContent:'space-between', padding:8, fontSize:13, color:'#666', marginTop:8}}>
      <span>{completadas}/{total} completadas</span>
      <div style={{width:120, height:8, background:'#eee', borderRadius:4, overflow:'hidden'}}>
        <div style={{width:\`\${porcentaje}%\`, height:'100%', background:'#a6e3a1', borderRadius:4, transition:'width 0.3s'}} />
      </div>
      <span>{porcentaje}%</span>
    </div>
  );
}

// === APP (App.jsx) ===
function App() {
  const { tareas, addTask, toggleTask, deleteTask } = useTasks();
  return (
    <div>
      <h3>Task Manager — Arquitectura Limpia</h3>
      <TaskForm onAdd={addTask} />
      {tareas.map(t => <TaskItem key={t.id} tarea={t} onToggle={toggleTask} onDelete={deleteTask} />)}
      <TaskStats tareas={tareas} />
      <div style={{marginTop:12, padding:8, background:'#e3f2fd', borderRadius:6, fontSize:11}}>
        <strong>Estructura:</strong> Reducer + Custom Hook + Componentes puros
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; max-width: 500px; } button { padding: 8px 16px; background: #89b4fa; color: #1e1e2e; border: none; border-radius: 6px; cursor: pointer; }',
        editable: true,
      },
      order: 4,
    },
  ],
  exercises: [
    {
      id: "react19-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "Por que useReducer es mejor que useState para un Task Manager?",
      options: [
        { id: "a", text: "Es mas rapido que useState", isCorrect: false },
        { id: "b", text: "Tiene multiples acciones y estado complejo con sub-valores", isCorrect: true },
        { id: "c", text: "useState no funciona con arrays", isCorrect: false },
        { id: "d", text: "useReducer no necesita re-renders", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Piensa en cuantas acciones diferentes tiene un Task Manager.",
      explanation: "Un Task Manager tiene muchas acciones (agregar, editar, eliminar, toggle, filtrar) y estado complejo, lo que hace a useReducer mas organizado y predecible.",
    },
    {
      id: "react19-ej-02",
      type: "code-completion",
      difficulty: 2 ,
      xpReward: 20,
      order: 2,
      prompt: "Completa la accion del reducer para marcar una tarea como completada/no completada:",
      codeTemplate: {
        html: "",
        cssPrefix: "case 'TOGGLE':\n  return state.map(t =>\n    t.id === action.payload\n      ? { ...t, completada: ",
        cssSuffix: " }\n      : t\n  );",
        blanks: ["!t.completada"],
      },
      validation: { type: "exact", answer: "!t.completada" },
      hint: "Invierte el valor booleano actual.",
      explanation: "!t.completada invierte el valor: si era true pasa a false y viceversa. Es el patron toggle clasico.",
    },
    {
      id: "react19-ej-03",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 3,
      prompt: "Como se inicializa useReducer leyendo de localStorage?",
      options: [
        { id: "a", text: "Con un useEffect que lea localStorage", isCorrect: false },
        { id: "b", text: "Pasando una funcion inicializadora como tercer argumento de useReducer", isCorrect: true },
        { id: "c", text: "Llamando a localStorage antes del componente", isCorrect: false },
        { id: "d", text: "No es posible combinarlos", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "useReducer acepta tres argumentos: reducer, initialArg, init.",
      explanation: "El tercer argumento de useReducer es una funcion inicializadora que se ejecuta solo una vez. Ahi puedes leer de localStorage para hidratar el estado.",
    },
    {
      id: "react19-ej-04",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt: "Ordena la estructura de carpetas correcta para un proyecto React limpio:",
      dragItems: [
        { id: "d1", content: "components/ (TaskForm, TaskItem)", correctZone: "ui" },
        { id: "d2", content: "hooks/ (useTasks, useLocalStorage)", correctZone: "logica" },
        { id: "d3", content: "reducers/ (taskReducer)", correctZone: "estado" },
        { id: "d4", content: "utils/ (filterTasks, sortTasks)", correctZone: "utilidades" },
      ],
      dropZones: [
        { id: "ui", label: "Interfaz de usuario" },
        { id: "logica", label: "Logica reutilizable" },
        { id: "estado", label: "Manejo de estado" },
        { id: "utilidades", label: "Funciones puras auxiliares" },
      ],
      validation: { type: "exact", answer: { d1: "ui", d2: "logica", d3: "estado", d4: "utilidades" } },
      hint: "Cada carpeta tiene un proposito especifico.",
      explanation: "components/ para UI, hooks/ para logica reutilizable, reducers/ para estado, utils/ para funciones puras. Esta separacion facilita el testing y mantenimiento.",
    },
    {
      id: "react19-ej-05",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt: "Cual es la ventaja de usar funciones puras para filtrar y ordenar tareas?",
      options: [
        { id: "a", text: "Son mas rapidas que los metodos de array", isCorrect: false },
        { id: "b", text: "Son faciles de testear y reutilizar sin depender de React", isCorrect: true },
        { id: "c", text: "React las ejecuta automaticamente", isCorrect: false },
        { id: "d", text: "No necesitan importarse", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Funciones puras no dependen de estado externo.",
      explanation: "Las funciones puras reciben datos y retornan datos, sin efectos secundarios. Son faciles de testear con cualquier test runner sin necesidad de renderizar componentes.",
    },
    {
      id: "react19-ej-06",
      type: "code-completion",
      difficulty: 3 ,
      xpReward: 30,
      order: 6,
      prompt: "Completa para guardar el estado en localStorage cada vez que cambie:",
      codeTemplate: {
        html: "",
        cssPrefix: "useEffect(() => {\n  localStorage.",
        cssSuffix: "(key, JSON.stringify(state));\n}, [key, state]);",
        blanks: ["setItem"],
      },
      validation: { type: "exact", answer: "setItem" },
      hint: "Es el metodo de localStorage para guardar datos.",
      explanation: "localStorage.setItem(key, value) guarda un par clave-valor. Dentro del useEffect, se ejecuta cada vez que el estado cambia.",
    },
  ],
};
