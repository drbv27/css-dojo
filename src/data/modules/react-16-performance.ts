import type { ModuleData } from "@/types";

export const reactPerformanceModule: ModuleData = {
  slug: "react-performance",
  title: "Performance y Optimizacion",
  description:
    "Optimiza tus aplicaciones React: React.memo, useMemo, useCallback, lazy loading, code splitting y evita re-renders innecesarios.",
  order: 216,
  category: "react-advanced",
  icon: "zap",
  dojo: "react",
  lessons: [
    {
      id: "react16-leccion-01",
      title: "React.memo y evitar re-renders",
      content: `## Entendiendo Re-renders en React

### Cuando se re-renderiza un componente?
1. Su **estado** cambia (useState, useReducer)
2. Su **padre** se re-renderiza
3. El **contexto** que consume cambia

### React.memo
Envuelve un componente para que solo se re-renderice si sus **props cambian**:

\`\`\`jsx
const MiComponente = React.memo(function MiComponente({ nombre }) {
  console.log('Renderizando...');
  return <p>Hola, {nombre}</p>;
});
\`\`\`

### Como funciona?
- React.memo hace una comparacion **superficial** de props
- Si las props son iguales, **reutiliza** el render anterior
- Si las props cambian, re-renderiza normalmente

### Cuidado con objetos y funciones
\`\`\`jsx
// PROBLEMA: objeto nuevo en cada render
<MemoComponent style={{ color: 'red' }} />

// PROBLEMA: funcion nueva en cada render
<MemoComponent onClick={() => console.log('click')} />
\`\`\`
Cada render crea un nuevo objeto/funcion, haciendo que memo sea inutil.

### Solucion: useMemo + useCallback
\`\`\`jsx
const style = useMemo(() => ({ color: 'red' }), []);
const onClick = useCallback(() => console.log('click'), []);
<MemoComponent style={style} onClick={onClick} />
\`\`\`

> **Regla:** No uses React.memo en todos lados. Usalo cuando un componente es costoso y se re-renderiza frecuentemente con las mismas props.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const { useState, useCallback, memo } = React;

let renderCountNormal = 0;
let renderCountMemo = 0;

// Componente normal: se re-renderiza siempre
function ListaNormal({ items, onRemove }) {
  renderCountNormal++;
  return (
    <div style={{padding:8, background:'#ffcccc', borderRadius:6, marginBottom:8}}>
      <strong>Sin memo (renders: {renderCountNormal})</strong>
      {items.map((item, i) => <p key={i} style={{margin:2}}>{item}</p>)}
    </div>
  );
}

// Componente con memo: solo re-renderiza si props cambian
const ListaMemo = memo(function ListaMemo({ items, onRemove }) {
  renderCountMemo++;
  return (
    <div style={{padding:8, background:'#ccffcc', borderRadius:6, marginBottom:8}}>
      <strong>Con memo (renders: {renderCountMemo})</strong>
      {items.map((item, i) => <p key={i} style={{margin:2}}>{item}</p>)}
    </div>
  );
});

function App() {
  const [count, setCount] = useState(0);
  const items = ['React', 'Vue', 'Angular'];

  // useCallback para estabilizar la funcion
  const handleRemove = useCallback((id) => {
    console.log('remove', id);
  }, []);

  return (
    <div>
      <h3>React.memo Demo</h3>
      <p>Contador: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>
        Incrementar (re-render padre)
      </button>
      <div style={{marginTop:12}}>
        <ListaNormal items={items} onRemove={() => {}} />
        <ListaMemo items={items} onRemove={handleRemove} />
      </div>
      <p style={{fontSize:12, color:'#888'}}>
        Haz click varias veces y compara los contadores de render.
      </p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; } button { padding: 8px 16px; background: #89b4fa; color: #1e1e2e; border: none; border-radius: 6px; cursor: pointer; }',
        editable: true,
      },
      order: 1,
    },
    {
      id: "react16-leccion-02",
      title: "Lazy Loading y Code Splitting",
      content: `## React.lazy y Suspense

### El problema
En aplicaciones grandes, el bundle de JavaScript puede ser enorme. El usuario descarga todo aunque solo visite una pagina.

### Code Splitting con React.lazy
\`\`\`jsx
import { lazy, Suspense } from 'react';

// En vez de: import Dashboard from './Dashboard';
const Dashboard = lazy(() => import('./Dashboard'));
const Settings = lazy(() => import('./Settings'));

function App() {
  return (
    <Suspense fallback={<p>Cargando...</p>}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
\`\`\`

### Suspense
- **Suspense** muestra un fallback mientras el componente lazy se carga
- Puedes anidar Suspense para diferentes secciones
- El fallback puede ser un spinner, skeleton, o cualquier JSX

### Mejores practicas
- Aplica lazy loading en **rutas** (lo mas comun)
- Lazy load en componentes pesados (editores, graficos)
- No uses lazy para componentes pequenos (el overhead no vale)

### Ejemplo con rutas
\`\`\`jsx
<Suspense fallback={<Skeleton />}>
  <Routes>
    <Route path="/" element={<Home />} />  {/* No lazy */}
    <Route path="/admin" element={<LazyAdmin />} />
    <Route path="/reports" element={<LazyReports />} />
  </Routes>
</Suspense>
\`\`\`

> **Tip:** La pagina principal (Home) no deberia ser lazy. Las paginas secundarias si.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const { useState, Suspense } = React;

// Simulacion de lazy loading
function SimuladorLazy() {
  const [pagina, setPagina] = useState('home');
  const [cargando, setCargando] = useState(false);

  const navegar = (pag) => {
    if (pag !== 'home') {
      setCargando(true);
      // Simular carga de chunk
      setTimeout(() => {
        setCargando(false);
        setPagina(pag);
      }, 1000);
    } else {
      setPagina(pag);
    }
  };

  const paginas = {
    home: <div><h4>Inicio</h4><p>Cargada inmediatamente (no lazy)</p></div>,
    dashboard: <div><h4>Dashboard</h4><p>Este componente se cargo bajo demanda (lazy)</p><div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>{[1,2,3,4].map(n => <div key={n} style={{background:'#e8f5e9', padding:12, borderRadius:6}}>Widget {n}</div>)}</div></div>,
    settings: <div><h4>Configuracion</h4><p>Tambien cargado bajo demanda</p><ul><li>Perfil</li><li>Notificaciones</li><li>Privacidad</li></ul></div>,
  };

  return (
    <div>
      <h3>Simulacion de Lazy Loading</h3>
      <nav style={{display:'flex', gap:8, marginBottom:16}}>
        {['home', 'dashboard', 'settings'].map(pag => (
          <button key={pag} onClick={() => navegar(pag)}
            style={{background: pagina === pag ? '#89b4fa' : '#e0e0e0', color: pagina === pag ? '#1e1e2e' : '#333'}}>
            {pag.charAt(0).toUpperCase() + pag.slice(1)}
          </button>
        ))}
      </nav>
      {/* Suspense fallback simulado */}
      {cargando ? (
        <div style={{padding:20, textAlign:'center'}}>
          <div style={{display:'inline-block', width:30, height:30, border:'3px solid #89b4fa', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 1s linear infinite'}} />
          <p>Cargando componente...</p>
          <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
        </div>
      ) : (
        <div style={{background:'#f5f5f5', padding:16, borderRadius:8}}>
          {paginas[pagina]}
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<SimuladorLazy />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; } button { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }',
        editable: true,
      },
      order: 2,
    },
    {
      id: "react16-leccion-03",
      title: "Herramientas y estrategias de optimizacion",
      content: `## Estrategias de Optimizacion

### 1. Mover estado hacia abajo
\`\`\`jsx
// MAL: todo se re-renderiza al escribir
function App() {
  const [text, setText] = useState('');
  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <ListaPesada /> {/* se re-renderiza innecesariamente */}
    </div>
  );
}

// BIEN: aislar el estado en su propio componente
function SearchInput() {
  const [text, setText] = useState('');
  return <input value={text} onChange={e => setText(e.target.value)} />;
}

function App() {
  return (
    <div>
      <SearchInput />
      <ListaPesada /> {/* no se re-renderiza */}
    </div>
  );
}
\`\`\`

### 2. Levantar contenido (lift content up)
\`\`\`jsx
// El children no se re-renderiza cuando ColorPicker cambia
function ColorPicker({ children }) {
  const [color, setColor] = useState('red');
  return <div style={{ color }}>{children}</div>;
}

<ColorPicker>
  <ListaPesada /> {/* No se re-renderiza! */}
</ColorPicker>
\`\`\`

### 3. React DevTools Profiler
- **Components tab:** inspecciona props, estado, contexto
- **Profiler tab:** graba y analiza renders
- **Highlight Updates:** muestra visualmente que se re-renderiza

### Checklist de performance
1. Identifica re-renders innecesarios con DevTools
2. Mueve estado local hacia abajo
3. Usa React.memo en componentes pesados
4. Usa useMemo/useCallback para estabilizar props
5. Lazy load rutas y componentes pesados

> **Recuerda:** Mide antes de optimizar. La optimizacion prematura es la raiz de todo mal.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const { useState, useMemo, memo } = React;

// Simulacion de componente pesado
const ElementoLista = memo(function ElementoLista({ item, index }) {
  // Simular render costoso
  const inicio = performance.now();
  while (performance.now() - inicio < 1) {} // 1ms por item
  return (
    <div style={{padding:4, margin:2, background:'#f0f0f0', borderRadius:4, fontSize:13}}>
      {item}
    </div>
  );
});

function App() {
  const [filtro, setFiltro] = useState('');
  const [count, setCount] = useState(0);

  // Lista grande
  const items = useMemo(() =>
    Array.from({ length: 200 }, (_, i) => \\\`Elemento #\\\${i + 1} - React Performance\\\`),
    []
  );

  // Filtrar con useMemo
  const filtrados = useMemo(() =>
    items.filter(item => item.toLowerCase().includes(filtro.toLowerCase())),
    [items, filtro]
  );

  return (
    <div>
      <h3>Optimizacion de Lista Grande</h3>
      <div style={{display:'flex', gap:8, marginBottom:12}}>
        <input value={filtro} onChange={e => setFiltro(e.target.value)}
          placeholder="Filtrar 200 elementos..."
          style={{flex:1, padding:8}} />
        <button onClick={() => setCount(c => c + 1)}>
          Otro estado: {count}
        </button>
      </div>
      <p style={{fontSize:12, color:'#888'}}>
        Mostrando {filtrados.length} de {items.length} | Cada item tarda ~1ms en renderizar
      </p>
      <div style={{maxHeight:200, overflow:'auto', border:'1px solid #ddd', borderRadius:6}}>
        {filtrados.map((item, i) => (
          <ElementoLista key={item} item={item} index={i} />
        ))}
      </div>
      <p style={{fontSize:11, color:'#aaa', marginTop:8}}>
        memo evita re-render al cambiar "count". useMemo evita recalcular el filtro.
      </p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; } button { padding: 8px 16px; background: #cba6f7; color: #1e1e2e; border: none; border-radius: 6px; cursor: pointer; } input { border: 1px solid #ccc; border-radius: 6px; }',
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "react16-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "Que hace React.memo?",
      options: [
        { id: "a", text: "Memoriza el estado del componente", isCorrect: false },
        { id: "b", text: "Evita re-renders si las props no cambian", isCorrect: true },
        { id: "c", text: "Cachea las peticiones HTTP", isCorrect: false },
        { id: "d", text: "Guarda el componente en localStorage", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Es una optimizacion que compara props.",
      explanation: "React.memo envuelve un componente y hace una comparacion superficial de props. Si son iguales al render anterior, reutiliza el resultado sin re-renderizar.",
    },
    {
      id: "react16-ej-02",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt: "Que componente de React se usa como fallback mientras se carga un componente lazy?",
      options: [
        { id: "a", text: "Loading", isCorrect: false },
        { id: "b", text: "Fallback", isCorrect: false },
        { id: "c", text: "Suspense", isCorrect: true },
        { id: "d", text: "ErrorBoundary", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Su nombre sugiere 'suspenso' o 'espera'.",
      explanation: "Suspense muestra un componente fallback (spinner, skeleton) mientras el componente lazy se descarga y carga.",
    },
    {
      id: "react16-ej-03",
      type: "code-completion",
      difficulty: 2 ,
      xpReward: 20,
      order: 3,
      prompt: "Completa para cargar un componente de forma lazy:",
      codeTemplate: {
        html: "",
        cssPrefix: "const Dashboard = ",
        cssSuffix: "(() => import('./Dashboard'));",
        blanks: ["lazy"],
      },
      validation: { type: "exact", answer: "lazy" },
      hint: "Es la funcion de React para carga diferida.",
      explanation: "React.lazy() permite importar componentes de forma dinamica. Solo se descargan cuando se necesitan, reduciendo el bundle inicial.",
    },
    {
      id: "react16-ej-04",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt: "Asocia cada herramienta de optimizacion con su proposito:",
      dragItems: [
        { id: "d1", content: "React.memo", correctZone: "props" },
        { id: "d2", content: "useMemo", correctZone: "valores" },
        { id: "d3", content: "useCallback", correctZone: "funciones" },
        { id: "d4", content: "React.lazy", correctZone: "carga" },
      ],
      dropZones: [
        { id: "props", label: "Evitar re-render si props no cambian" },
        { id: "valores", label: "Memorizar valores calculados" },
        { id: "funciones", label: "Memorizar referencias de funciones" },
        { id: "carga", label: "Cargar componentes bajo demanda" },
      ],
      validation: { type: "exact", answer: { d1: "props", d2: "valores", d3: "funciones", d4: "carga" } },
      hint: "Cada herramienta optimiza un aspecto diferente.",
      explanation: "React.memo evita re-renders, useMemo memoriza valores, useCallback memoriza funciones, y React.lazy permite code splitting.",
    },
    {
      id: "react16-ej-05",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt: "Por que pasar una funcion inline como prop puede anular el efecto de React.memo?",
      options: [
        { id: "a", text: "Las funciones inline causan errores", isCorrect: false },
        { id: "b", text: "Cada render crea una nueva referencia de funcion, que memo detecta como cambio", isCorrect: true },
        { id: "c", text: "React.memo no funciona con funciones", isCorrect: false },
        { id: "d", text: "Las funciones inline son mas lentas", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Piensa en la comparacion superficial de objetos/funciones.",
      explanation: "Cada render crea una nueva instancia de la funcion con diferente referencia. La comparacion superficial de memo ve que es 'diferente' y re-renderiza.",
    },
    {
      id: "react16-ej-06",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 6,
      prompt: "Cual es la mejor estrategia antes de aplicar optimizaciones?",
      options: [
        { id: "a", text: "Envolver todo en React.memo por precaucion", isCorrect: false },
        { id: "b", text: "Medir con React DevTools Profiler e identificar el problema real", isCorrect: true },
        { id: "c", text: "Usar useMemo en todos los valores", isCorrect: false },
        { id: "d", text: "Convertir todo a componentes de clase", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Mide primero, optimiza despues.",
      explanation: "Siempre mide antes de optimizar. El React DevTools Profiler muestra exactamente que componentes se re-renderizan y cuanto tiempo toman.",
    },
    {
      id: "react16-ej-07",
      type: "code-completion",
      difficulty: 3 ,
      xpReward: 30,
      order: 7,
      prompt: "Completa para memorizar un componente con React.memo:",
      codeTemplate: {
        html: "",
        cssPrefix: "const MiLista = React.",
        cssSuffix: "(function MiLista({ items }) {\n  return items.map(i => <li key={i}>{i}</li>);\n});",
        blanks: ["memo"],
      },
      validation: { type: "exact", answer: "memo" },
      hint: "La funcion de React para memorizar componentes.",
      explanation: "React.memo() envuelve el componente para que solo se re-renderice cuando sus props realmente cambien.",
    },
    {
      id: "react16-ej-08",
      type: "quiz",
      difficulty: 3 ,
      xpReward: 30,
      order: 8,
      prompt: "Que tecnica evita re-renders sin usar memo ni useMemo?",
      options: [
        { id: "a", text: "Usar componentes de clase", isCorrect: false },
        { id: "b", text: "Mover el estado hacia abajo o levantar el contenido", isCorrect: true },
        { id: "c", text: "Usar useRef en vez de useState", isCorrect: false },
        { id: "d", text: "Desactivar el reconciliador de React", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Reorganizar donde vive el estado puede eliminar re-renders.",
      explanation: "Mover estado local al componente que lo necesita (state colocation) o pasar children como props evita re-renders sin herramientas adicionales.",
    },
  ],
};
