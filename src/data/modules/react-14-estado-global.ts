import type { ModuleData } from "@/types";

export const reactEstadoGlobalModule: ModuleData = {
  slug: "react-estado-global",
  title: "Estado Global y useReducer",
  description:
    "Aprende patrones de manejo de estado global: useReducer, useReducer + Context y una introduccion a Zustand.",
  order: 214,
  category: "react-advanced",
  icon: "globe",
  dojo: "react",
  lessons: [
    {
      id: "react14-leccion-01",
      title: "useReducer: estado complejo",
      content: `## useReducer: Alternativa a useState

useReducer es ideal cuando:
- El estado tiene **multiples sub-valores**
- La **logica de actualizacion** es compleja
- Las actualizaciones dependen del **estado anterior**

### Sintaxis
\`\`\`jsx
const [state, dispatch] = useReducer(reducer, initialState);
\`\`\`

### El patron Reducer
\`\`\`jsx
// Estado inicial
const initialState = { count: 0, error: null };

// Funcion reducer: (estado, accion) => nuevo estado
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1 };
    case 'decrement':
      return { ...state, count: state.count - 1 };
    case 'reset':
      return initialState;
    default:
      throw new Error('Accion desconocida: ' + action.type);
  }
}

// Uso
dispatch({ type: 'increment' });
dispatch({ type: 'reset' });
\`\`\`

### useReducer vs useState
| useState | useReducer |
|----------|------------|
| Estado simple | Estado complejo |
| Pocas actualizaciones | Muchas acciones |
| Logica simple | Logica predecible |

> **Regla:** Si tienes mas de 3-4 setState relacionados, considera useReducer.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const { useReducer } = React;

const initialState = {
  items: [],
  total: 0,
  descuento: false,
};

function carritoReducer(state, action) {
  switch (action.type) {
    case 'agregar': {
      const items = [...state.items, action.payload];
      const total = items.reduce((sum, i) => sum + i.precio, 0);
      return { ...state, items, total };
    }
    case 'eliminar': {
      const items = state.items.filter((_, i) => i !== action.payload);
      const total = items.reduce((sum, i) => sum + i.precio, 0);
      return { ...state, items, total };
    }
    case 'toggle_descuento':
      return { ...state, descuento: !state.descuento };
    case 'vaciar':
      return initialState;
    default:
      return state;
  }
}

const productos = [
  { nombre: 'React Pro', precio: 29.99 },
  { nombre: 'CSS Master', precio: 19.99 },
  { nombre: 'JS Avanzado', precio: 24.99 },
];

function Carrito() {
  const [state, dispatch] = useReducer(carritoReducer, initialState);
  const totalFinal = state.descuento ? state.total * 0.8 : state.total;

  return (
    <div>
      <h3>Carrito con useReducer</h3>
      <div style={{display:'flex', gap:8, marginBottom:12}}>
        {productos.map((p, i) => (
          <button key={i} onClick={() => dispatch({ type: 'agregar', payload: p })}>
            + {p.nombre} (\${p.precio})
          </button>
        ))}
      </div>
      <ul style={{listStyle:'none', padding:0}}>
        {state.items.map((item, i) => (
          <li key={i} style={{display:'flex', justifyContent:'space-between', padding:4, background:'#f0f0f0', margin:2, borderRadius:4}}>
            <span>{item.nombre} - \${item.precio}</span>
            <button onClick={() => dispatch({ type: 'eliminar', payload: i })} style={{background:'#f38ba8', padding:'2px 8px'}}>X</button>
          </li>
        ))}
      </ul>
      <div style={{marginTop:8}}>
        <label>
          <input type="checkbox" checked={state.descuento}
            onChange={() => dispatch({ type: 'toggle_descuento' })} />
          {' '}Aplicar 20% descuento
        </label>
      </div>
      <p><strong>Total: \${totalFinal.toFixed(2)}</strong></p>
      <button onClick={() => dispatch({ type: 'vaciar' })} style={{background:'#cba6f7'}}>Vaciar carrito</button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Carrito />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; } button { padding: 6px 12px; background: #89b4fa; color: #1e1e2e; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }',
        editable: true,
      },
      order: 1,
    },
    {
      id: "react14-leccion-02",
      title: "useReducer + Context",
      content: `## Combinando useReducer + Context

El patron mas poderoso para estado global sin librerias externas:

### Paso 1: Crear el contexto y reducer
\`\`\`jsx
const AppContext = createContext(null);

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER': return { ...state, user: action.payload };
    case 'SET_THEME': return { ...state, theme: action.payload };
    default: return state;
  }
}
\`\`\`

### Paso 2: Provider con useReducer
\`\`\`jsx
function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, {
    user: null, theme: 'light'
  });

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}
\`\`\`

### Paso 3: Custom hook
\`\`\`jsx
function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('Usar dentro de AppProvider');
  return context;
}
\`\`\`

### Ventajas
- Sin dependencias externas
- Acciones predecibles y testeables
- Estado centralizado accesible desde cualquier componente

> **Este patron** es la base de como funcionan Redux y otras librerias de estado.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const { useReducer, useContext, createContext, useState } = React;

// Context + Reducer
const TodoContext = createContext(null);

function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [...state, { id: Date.now(), text: action.payload, done: false }];
    case 'TOGGLE':
      return state.map(t => t.id === action.payload ? { ...t, done: !t.done } : t);
    case 'DELETE':
      return state.filter(t => t.id !== action.payload);
    default:
      return state;
  }
}

function TodoProvider({ children }) {
  const [todos, dispatch] = useReducer(todoReducer, [
    { id: 1, text: 'Aprender useReducer', done: true },
    { id: 2, text: 'Combinar con Context', done: false },
  ]);
  return (
    <TodoContext.Provider value={{ todos, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
}

function useTodos() {
  return useContext(TodoContext);
}

// Componentes
function AddTodo() {
  const { dispatch } = useTodos();
  const [text, setText] = useState('');
  const handleAdd = () => {
    if (!text.trim()) return;
    dispatch({ type: 'ADD', payload: text });
    setText('');
  };
  return (
    <div style={{display:'flex', gap:8, marginBottom:12}}>
      <input value={text} onChange={e => setText(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleAdd()}
        placeholder="Nueva tarea..." style={{flex:1, padding:8}} />
      <button onClick={handleAdd}>Agregar</button>
    </div>
  );
}

function TodoList() {
  const { todos, dispatch } = useTodos();
  return (
    <ul style={{listStyle:'none', padding:0}}>
      {todos.map(t => (
        <li key={t.id} style={{display:'flex', alignItems:'center', gap:8, padding:6, margin:2, background:'#f0f0f0', borderRadius:4}}>
          <input type="checkbox" checked={t.done}
            onChange={() => dispatch({ type: 'TOGGLE', payload: t.id })} />
          <span style={{flex:1, textDecoration: t.done ? 'line-through' : 'none', opacity: t.done ? 0.5 : 1}}>
            {t.text}
          </span>
          <button onClick={() => dispatch({ type: 'DELETE', payload: t.id })}
            style={{background:'#f38ba8', padding:'2px 8px', fontSize:12}}>X</button>
        </li>
      ))}
    </ul>
  );
}

function Stats() {
  const { todos } = useTodos();
  const done = todos.filter(t => t.done).length;
  return <p style={{fontSize:13, color:'#666'}}>{done}/{todos.length} completadas</p>;
}

function App() {
  return (
    <TodoProvider>
      <h3>Todos: useReducer + Context</h3>
      <AddTodo />
      <TodoList />
      <Stats />
    </TodoProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; } button { padding: 6px 14px; background: #a6e3a1; color: #1e1e2e; border: none; border-radius: 6px; cursor: pointer; } input[type="text"], input:not([type]) { border: 1px solid #ccc; border-radius: 4px; }',
        editable: true,
      },
      order: 2,
    },
    {
      id: "react14-leccion-03",
      title: "Introduccion a Zustand",
      content: `## Zustand: Estado Global Simple

Zustand es una libreria de estado global minimalista y poderosa.

### Por que Zustand?
- **Minimo boilerplate** (mucho menos que Redux)
- **Sin Providers** necesarios
- **Selectores** para evitar re-renders innecesarios
- Solo **~1KB** de tamano

### Instalacion
\`\`\`bash
npm install zustand
\`\`\`

### Crear un store
\`\`\`jsx
import { create } from 'zustand';

const useStore = create((set) => ({
  // Estado
  count: 0,
  nombre: 'Diego',

  // Acciones
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  setNombre: (nombre) => set({ nombre }),
}));
\`\`\`

### Usar el store
\`\`\`jsx
function Contador() {
  // Selector: solo se re-renderiza cuando count cambia
  const count = useStore((state) => state.count);
  const increment = useStore((state) => state.increment);

  return <button onClick={increment}>Count: {count}</button>;
}
\`\`\`

### Cuando usar que?
| Solucion | Cuando usar |
|----------|-------------|
| useState | Estado local simple |
| useReducer | Estado local complejo |
| Context | Pocos datos globales (tema, auth) |
| Zustand | Estado global frecuentemente actualizado |

> **Zustand** es la opcion preferida en la comunidad React moderna por su simplicidad y rendimiento.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const { useState, useCallback, useSyncExternalStore } = React;

// Simulacion simplificada de Zustand
function createStore(initializer) {
  let state;
  const listeners = new Set();
  const set = (partial) => {
    const next = typeof partial === 'function' ? partial(state) : partial;
    state = { ...state, ...next };
    listeners.forEach(l => l());
  };
  state = initializer(set);
  const getState = () => state;
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const useStore = (selector) => {
    return useSyncExternalStore(subscribe, () => selector(getState()));
  };
  return useStore;
}

// Crear store (similar a Zustand)
const useStore = createStore((set) => ({
  tareas: ['Aprender React', 'Estudiar Zustand'],
  filtro: '',
  agregar: (tarea) => set((s) => ({ tareas: [...s.tareas, tarea] })),
  eliminar: (idx) => set((s) => ({ tareas: s.tareas.filter((_, i) => i !== idx) })),
  setFiltro: (filtro) => set({ filtro }),
}));

function AgregarTarea() {
  const agregar = useStore(s => s.agregar);
  const [texto, setTexto] = useState('');
  const handleAdd = () => {
    if (texto.trim()) { agregar(texto); setTexto(''); }
  };
  return (
    <div style={{display:'flex', gap:8, marginBottom:12}}>
      <input value={texto} onChange={e => setTexto(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleAdd()}
        placeholder="Nueva tarea..." style={{flex:1, padding:8}} />
      <button onClick={handleAdd}>+</button>
    </div>
  );
}

function ListaTareas() {
  const tareas = useStore(s => s.tareas);
  const filtro = useStore(s => s.filtro);
  const eliminar = useStore(s => s.eliminar);
  const setFiltro = useStore(s => s.setFiltro);

  const filtradas = tareas.filter(t =>
    t.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div>
      <input value={filtro} onChange={e => setFiltro(e.target.value)}
        placeholder="Filtrar..." style={{padding:8, marginBottom:8, width:'100%', boxSizing:'border-box'}} />
      <ul style={{listStyle:'none', padding:0}}>
        {filtradas.map((t, i) => (
          <li key={i} style={{display:'flex', justifyContent:'space-between', padding:6, margin:2, background:'#f0f0f0', borderRadius:4}}>
            <span>{t}</span>
            <button onClick={() => eliminar(tareas.indexOf(t))} style={{background:'#f38ba8', padding:'2px 8px'}}>X</button>
          </li>
        ))}
      </ul>
      <p style={{fontSize:12, color:'#888'}}>{filtradas.length} tareas encontradas</p>
    </div>
  );
}

function App() {
  return (
    <div>
      <h3>Store tipo Zustand (simulado)</h3>
      <AgregarTarea />
      <ListaTareas />
      <p style={{fontSize:11, color:'#aaa'}}>Sin Provider! Los componentes leen directamente del store.</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; } button { padding: 6px 14px; background: #89b4fa; color: #1e1e2e; border: none; border-radius: 6px; cursor: pointer; } input { border: 1px solid #ccc; border-radius: 4px; }',
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "react14-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "Que devuelve el hook useReducer?",
      options: [
        { id: "a", text: "Un valor y un setter, como useState", isCorrect: false },
        { id: "b", text: "El estado actual y una funcion dispatch", isCorrect: true },
        { id: "c", text: "Solo el estado actual", isCorrect: false },
        { id: "d", text: "Un objeto con get y set", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Similar a useState pero con dispatch en vez de setter.",
      explanation: "useReducer devuelve [state, dispatch]. Dispatch envia acciones al reducer que calcula el nuevo estado.",
    },
    {
      id: "react14-ej-02",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt: "Que parametros recibe una funcion reducer?",
      options: [
        { id: "a", text: "props y state", isCorrect: false },
        { id: "b", text: "state y action", isCorrect: true },
        { id: "c", text: "action y dispatch", isCorrect: false },
        { id: "d", text: "prevState y nextState", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "El estado actual y la accion a realizar.",
      explanation: "Un reducer recibe el estado actual (state) y una accion (action), y retorna el nuevo estado.",
    },
    {
      id: "react14-ej-03",
      type: "code-completion",
      difficulty: 2 ,
      xpReward: 20,
      order: 3,
      prompt: "Completa para despachar una accion de tipo 'increment':",
      codeTemplate: {
        html: "",
        cssPrefix: "const [state, dispatch] = useReducer(reducer, { count: 0 });\n\n// Incrementar:\n",
        cssSuffix: "({ type: 'increment' });",
        blanks: ["dispatch"],
      },
      validation: { type: "exact", answer: "dispatch" },
      hint: "Es la funcion que envia acciones al reducer.",
      explanation: "dispatch() envia una accion al reducer. El reducer recibe el estado actual y la accion, y retorna el nuevo estado.",
    },
    {
      id: "react14-ej-04",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt: "Asocia cada solucion de estado con su caso de uso ideal:",
      dragItems: [
        { id: "d1", content: "useState", correctZone: "simple" },
        { id: "d2", content: "useReducer", correctZone: "complejo" },
        { id: "d3", content: "Context", correctZone: "global" },
        { id: "d4", content: "Zustand", correctZone: "frecuente" },
      ],
      dropZones: [
        { id: "simple", label: "Estado local simple" },
        { id: "complejo", label: "Estado local con logica compleja" },
        { id: "global", label: "Pocos datos globales (tema, auth)" },
        { id: "frecuente", label: "Estado global frecuentemente actualizado" },
      ],
      validation: { type: "exact", answer: { d1: "simple", d2: "complejo", d3: "global", d4: "frecuente" } },
      hint: "Cada herramienta tiene su escenario ideal.",
      explanation: "useState para lo simple, useReducer para logica compleja, Context para pocos datos globales, Zustand para estado global con muchas actualizaciones.",
    },
    {
      id: "react14-ej-05",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt: "Que ventaja tiene Zustand sobre Context para estado global?",
      options: [
        { id: "a", text: "Es mas grande y tiene mas funcionalidades", isCorrect: false },
        { id: "b", text: "No necesita Provider y tiene selectores para evitar re-renders", isCorrect: true },
        { id: "c", text: "Es parte de React, no necesita instalacion", isCorrect: false },
        { id: "d", text: "Solo funciona con TypeScript", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Zustand resuelve dos problemas comunes de Context.",
      explanation: "Zustand no requiere un Provider envolvente y los selectores permiten que solo se re-rendericen los componentes que usan la parte del estado que cambio.",
    },
    {
      id: "react14-ej-06",
      type: "code-completion",
      difficulty: 3 ,
      xpReward: 30,
      order: 6,
      prompt: "Completa el case del reducer para agregar un item al carrito:",
      codeTemplate: {
        html: "",
        cssPrefix: "case 'ADD_ITEM':\n  return { ...state, items: [...state.items, ",
        cssSuffix: "] };",
        blanks: ["action.payload"],
      },
      validation: { type: "exact", answer: "action.payload" },
      hint: "El dato del item viene dentro de la accion.",
      explanation: "action.payload es la convencion para enviar datos junto con la accion. El reducer usa esos datos para calcular el nuevo estado.",
    },
    {
      id: "react14-ej-07",
      type: "quiz",
      difficulty: 3 ,
      xpReward: 30,
      order: 7,
      prompt: "Por que el patron useReducer + Context es similar a Redux?",
      options: [
        { id: "a", text: "Ambos usan el mismo codigo internamente", isCorrect: false },
        { id: "b", text: "Ambos tienen store, reducer, dispatch y acceso global al estado", isCorrect: true },
        { id: "c", text: "Redux esta construido sobre useReducer", isCorrect: false },
        { id: "d", text: "No tienen nada en comun", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Los conceptos fundamentales son los mismos.",
      explanation: "Ambos siguen el patron Flux: un store centralizado, reducers puros que calculan nuevo estado, y dispatch para enviar acciones. Context reemplaza al Provider de Redux.",
    },
    {
      id: "react14-ej-08",
      type: "quiz",
      difficulty: 3 ,
      xpReward: 30,
      order: 8,
      prompt: "En Zustand, como se evitan re-renders innecesarios al leer del store?",
      options: [
        { id: "a", text: "Usando React.memo en todos los componentes", isCorrect: false },
        { id: "b", text: "Usando selectores: useStore(state => state.count)", isCorrect: true },
        { id: "c", text: "Zustand nunca causa re-renders", isCorrect: false },
        { id: "d", text: "Envolviendo el store en useMemo", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Solo suscribirse a la parte del estado que necesitas.",
      explanation: "Los selectores en Zustand solo suscriben al componente a la parte del estado que seleccionan. Si otras partes cambian, el componente no se re-renderiza.",
    },
  ],
};
