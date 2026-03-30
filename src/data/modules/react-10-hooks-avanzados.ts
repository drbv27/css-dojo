import type { ModuleData } from "@/types";

export const reactHooksAvanzadosModule: ModuleData = {
  slug: "react-hooks-avanzados",
  title: "Hooks Avanzados",
  description:
    "Aprende useRef, useMemo, useCallback, useId y como crear tus propios custom hooks reutilizables.",
  order: 210,
  category: "react-intermediate",
  icon: "anchor",
  dojo: "react",
  lessons: [
    {
      id: "react10-leccion-01",
      title: "useRef: referencias y valores persistentes",
      content: `## useRef

useRef tiene dos usos principales:
1. **Referenciar elementos del DOM** directamente
2. **Guardar valores mutables** que persisten entre renders sin causar re-render

### Referencia al DOM
\`\`\`jsx
function InputConFoco() {
  const inputRef = useRef(null);

  const enfocar = () => {
    inputRef.current.focus();
  };

  return (
    <>
      <input ref={inputRef} />
      <button onClick={enfocar}>Enfocar</button>
    </>
  );
}
\`\`\`

### Valor persistente sin re-render
\`\`\`jsx
function Cronometro() {
  const intervalRef = useRef(null);
  // intervalRef.current persiste entre renders
  // Cambiar .current NO causa re-render
}
\`\`\`

### useRef vs useState
| useRef | useState |
|--------|----------|
| No causa re-render | Causa re-render |
| .current es mutable | Inmutable (setter) |
| Persiste entre renders | Persiste entre renders |

> **Regla:** Usa useRef cuando necesites un valor que persista pero no necesite re-renderizar la UI.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const { useState, useRef, useEffect } = React;

function Cronometro() {
  const [tiempo, setTiempo] = useState(0);
  const [corriendo, setCorriendo] = useState(false);
  const intervalRef = useRef(null);

  const iniciar = () => {
    if (corriendo) return;
    setCorriendo(true);
    intervalRef.current = setInterval(() => {
      setTiempo(t => t + 10);
    }, 10);
  };

  const pausar = () => {
    clearInterval(intervalRef.current);
    setCorriendo(false);
  };

  const resetear = () => {
    clearInterval(intervalRef.current);
    setCorriendo(false);
    setTiempo(0);
  };

  const formatear = (ms) => {
    const min = Math.floor(ms / 60000);
    const seg = Math.floor((ms % 60000) / 1000);
    const cent = Math.floor((ms % 1000) / 10);
    return \\\`\\\${String(min).padStart(2,'0')}:\\\${String(seg).padStart(2,'0')}.\\\${String(cent).padStart(2,'0')}\\\`;
  };

  return (
    <div style={{textAlign:'center'}}>
      <h3>Cronometro con useRef</h3>
      <p style={{fontSize:48, fontFamily:'monospace', margin:'16px 0'}}>
        {formatear(tiempo)}
      </p>
      <div style={{display:'flex', gap:8, justifyContent:'center'}}>
        <button onClick={iniciar} disabled={corriendo}>Iniciar</button>
        <button onClick={pausar} disabled={!corriendo}>Pausar</button>
        <button onClick={resetear}>Reset</button>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Cronometro />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; } button { padding: 8px 16px; background: #89b4fa; color: #1e1e2e; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; } button:disabled { opacity: 0.5; cursor: not-allowed; }',
        editable: true,
      },
      order: 1,
    },
    {
      id: "react10-leccion-02",
      title: "useMemo y useCallback",
      content: `## useMemo y useCallback: Optimizacion

### useMemo — memorizar valores calculados
\`\`\`jsx
const resultado = useMemo(() => {
  return calculoPesado(datos);
}, [datos]);
\`\`\`
Solo recalcula cuando \`datos\` cambia. Util para calculos costosos.

### useCallback — memorizar funciones
\`\`\`jsx
const handleClick = useCallback(() => {
  setCount(c => c + 1);
}, []);
\`\`\`
Devuelve la misma referencia de funcion entre renders. Util cuando pasas callbacks a componentes hijos optimizados con React.memo.

### Cuando usarlos?

**useMemo:**
- Calculos costosos (filtrar/ordenar listas grandes)
- Evitar recrear objetos/arrays que se pasan como props

**useCallback:**
- Funciones que se pasan como props a componentes memorizados
- Funciones usadas como dependencias en otros hooks

### Cuando NO usarlos?
- Para calculos simples (el costo de memorizar supera el beneficio)
- Si no hay problemas de rendimiento reales

> **Regla:** No optimices prematuramente. Usa useMemo/useCallback solo cuando hay un problema de rendimiento real.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const { useState, useMemo } = React;

function ListaFiltrable() {
  const [filtro, setFiltro] = useState('');
  const [tema, setTema] = useState('claro');

  const frutas = ['Manzana','Banana','Cereza','Durazno','Fresa',
    'Guayaba','Kiwi','Limon','Mango','Naranja','Papaya','Uva'];

  // useMemo: solo recalcula cuando 'filtro' cambia
  const frutasFiltradas = useMemo(() => {
    console.log('Filtrando frutas...');
    return frutas.filter(f =>
      f.toLowerCase().includes(filtro.toLowerCase())
    );
  }, [filtro]);

  const esOscuro = tema === 'oscuro';

  return (
    <div style={{
      background: esOscuro ? '#1e1e2e' : '#fff',
      color: esOscuro ? '#cdd6f4' : '#333',
      padding: 16, borderRadius: 8
    }}>
      <h3>useMemo Demo</h3>
      <button onClick={() => setTema(esOscuro ? 'claro' : 'oscuro')}
        style={{marginBottom:8}}>
        Cambiar tema (no recalcula filtro)
      </button>
      <input
        placeholder="Filtrar frutas..."
        value={filtro}
        onChange={e => setFiltro(e.target.value)}
        style={{display:'block', padding:8, marginBottom:8, width:'100%', boxSizing:'border-box'}}
      />
      <ul>
        {frutasFiltradas.map(f => <li key={f}>{f}</li>)}
      </ul>
      <p style={{fontSize:12}}>Abre la consola para ver cuando se filtra</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ListaFiltrable />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; } button { padding: 6px 14px; background: #cba6f7; color: #1e1e2e; border: none; border-radius: 6px; cursor: pointer; } input { border: 1px solid #ccc; border-radius: 6px; }',
        editable: true,
      },
      order: 2,
    },
    {
      id: "react10-leccion-03",
      title: "Custom Hooks",
      content: `## Custom Hooks: Reutilizando Logica

Un **custom hook** es una funcion que empieza con \`use\` y puede usar otros hooks dentro.

### Por que custom hooks?
- **Reutilizar logica** entre componentes
- **Separar** logica compleja del componente
- **Testear** logica de forma aislada

### Ejemplo: useLocalStorage
\`\`\`jsx
function useLocalStorage(key, valorInicial) {
  const [valor, setValor] = useState(() => {
    const guardado = localStorage.getItem(key);
    return guardado ? JSON.parse(guardado) : valorInicial;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(valor));
  }, [key, valor]);

  return [valor, setValor];
}

// Uso:
const [nombre, setNombre] = useLocalStorage('nombre', '');
\`\`\`

### Reglas de los Hooks
1. Solo llamar hooks en el **nivel superior** (no dentro de if/for/funciones anidadas)
2. Solo llamar hooks en **componentes de React** o **custom hooks**
3. Los custom hooks deben empezar con \`use\`

### useId — IDs unicos
\`\`\`jsx
function CampoEmail() {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>Email</label>
      <input id={id} type="email" />
    </>
  );
}
\`\`\`

> **Tip:** Extraer logica a custom hooks hace tus componentes mas limpios y la logica mas testeable.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const { useState, useEffect, useId } = React;

// Custom Hook: useContador
function useContador(inicial = 0, paso = 1) {
  const [count, setCount] = useState(inicial);
  const incrementar = () => setCount(c => c + paso);
  const decrementar = () => setCount(c => c - paso);
  const resetear = () => setCount(inicial);
  return { count, incrementar, decrementar, resetear };
}

// Custom Hook: useToggle
function useToggle(inicial = false) {
  const [valor, setValor] = useState(inicial);
  const toggle = () => setValor(v => !v);
  return [valor, toggle];
}

function App() {
  const contador1 = useContador(0, 1);
  const contador2 = useContador(100, 10);
  const [visible, toggleVisible] = useToggle(true);
  const id = useId();

  return (
    <div>
      <h3>Custom Hooks</h3>

      <div style={{marginBottom:16}}>
        <h4>Contador (paso 1): {contador1.count}</h4>
        <button onClick={contador1.decrementar}>-1</button>
        <button onClick={contador1.incrementar}>+1</button>
        <button onClick={contador1.resetear}>Reset</button>
      </div>

      <div style={{marginBottom:16}}>
        <h4>Contador (paso 10): {contador2.count}</h4>
        <button onClick={contador2.decrementar}>-10</button>
        <button onClick={contador2.incrementar}>+10</button>
        <button onClick={contador2.resetear}>Reset</button>
      </div>

      <div>
        <button onClick={toggleVisible}>
          {visible ? 'Ocultar' : 'Mostrar'} mensaje
        </button>
        {visible && <p>Este mensaje usa useToggle!</p>}
      </div>

      <p style={{fontSize:12, color:'#888'}}>useId: {id}</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; } button { padding: 6px 12px; margin: 0 4px; background: #f9e2af; color: #1e1e2e; border: none; border-radius: 6px; cursor: pointer; }',
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "react10-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "Que propiedad de useRef se usa para acceder al valor almacenado?",
      options: [
        { id: "a", text: ".value", isCorrect: false },
        { id: "b", text: ".current", isCorrect: true },
        { id: "c", text: ".ref", isCorrect: false },
        { id: "d", text: ".data", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Es una propiedad que suena a 'actual'.",
      explanation: "useRef devuelve un objeto con la propiedad .current que contiene el valor almacenado.",
    },
    {
      id: "react10-ej-02",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 2,
      prompt: "Que pasa cuando cambias el valor de useRef.current?",
      options: [
        { id: "a", text: "El componente se re-renderiza", isCorrect: false },
        { id: "b", text: "Se lanza un error", isCorrect: false },
        { id: "c", text: "El valor cambia pero NO se re-renderiza", isCorrect: true },
        { id: "d", text: "React ignora el cambio", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "A diferencia de useState...",
      explanation: "Cambiar .current de useRef muta el valor directamente sin causar re-render. Por eso es util para valores que no afectan la UI.",
    },
    {
      id: "react10-ej-03",
      type: "code-completion",
      difficulty: 2,
      xpReward: 15,
      order: 3,
      prompt: "Completa para enfocar el input usando useRef:",
      codeTemplate: {
        html: "",
        cssPrefix: "const inputRef = useRef(null);\n\nconst enfocar = () => {\n  inputRef.",
        cssSuffix: ".focus();\n};\n\nreturn <input ref={inputRef} />;",
        blanks: ["current"],
      },
      validation: { type: "exact", answer: "current" },
      hint: "Accede al elemento DOM real a traves de la propiedad del ref.",
      explanation: "inputRef.current contiene el elemento DOM real del input, sobre el cual puedes llamar .focus().",
    },
    {
      id: "react10-ej-04",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 4,
      prompt: "Cual es la diferencia principal entre useMemo y useCallback?",
      options: [
        { id: "a", text: "useMemo es para valores, useCallback es para funciones", isCorrect: true },
        { id: "b", text: "No hay diferencia, son aliases", isCorrect: false },
        { id: "c", text: "useMemo es mas rapido que useCallback", isCorrect: false },
        { id: "d", text: "useCallback es para efectos, useMemo para estado", isCorrect: false },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "Uno memoriza el resultado, otro memoriza la funcion misma.",
      explanation: "useMemo memoriza el valor retornado por una funcion. useCallback memoriza la funcion misma (su referencia).",
    },
    {
      id: "react10-ej-05",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 5,
      prompt: "Clasifica cada hook segun su proposito principal:",
      dragItems: [
        { id: "d1", content: "useRef", correctZone: "sinRerender" },
        { id: "d2", content: "useState", correctZone: "conRerender" },
        { id: "d3", content: "useMemo", correctZone: "optimizacion" },
        { id: "d4", content: "useCallback", correctZone: "optimizacion" },
        { id: "d5", content: "useEffect", correctZone: "conRerender" },
        { id: "d6", content: "useId", correctZone: "sinRerender" },
      ],
      dropZones: [
        { id: "conRerender", label: "Puede causar re-render" },
        { id: "sinRerender", label: "No causa re-render" },
        { id: "optimizacion", label: "Optimizacion de rendimiento" },
      ],
      validation: { type: "exact", answer: { d1: "sinRerender", d2: "conRerender", d3: "optimizacion", d4: "optimizacion", d5: "conRerender", d6: "sinRerender" } },
      hint: "useState y useEffect pueden disparar re-renders. useMemo y useCallback evitan trabajo innecesario.",
      explanation: "useState causa re-render al cambiar. useEffect puede causar re-render si modifica estado. useRef y useId no causan re-renders. useMemo y useCallback optimizan evitando recalculos.",
    },
    {
      id: "react10-ej-06",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 6,
      prompt: "Cual es la regla mas importante de los hooks?",
      options: [
        { id: "a", text: "Siempre usar useEffect despues de useState", isCorrect: false },
        { id: "b", text: "Solo llamar hooks en el nivel superior, nunca dentro de condicionales", isCorrect: true },
        { id: "c", text: "Usar maximo 5 hooks por componente", isCorrect: false },
        { id: "d", text: "Siempre pasar dependencias a todos los hooks", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "React necesita que los hooks se llamen siempre en el mismo orden.",
      explanation: "Los hooks deben llamarse siempre en el nivel superior del componente, nunca dentro de if, for o funciones anidadas, porque React depende del orden de llamada.",
    },
    {
      id: "react10-ej-07",
      type: "code-completion",
      difficulty: 3,
      xpReward: 20,
      order: 7,
      prompt: "Completa el nombre del custom hook (debe empezar con 'use'):",
      codeTemplate: {
        html: "",
        cssPrefix: "function ",
        cssSuffix: "(inicial) {\n  const [valor, setValor] = useState(inicial);\n  const toggle = () => setValor(v => !v);\n  return [valor, toggle];\n}",
        blanks: ["useToggle"],
      },
      validation: { type: "exact", answer: "useToggle" },
      hint: "Un hook que alterna un valor booleano. Debe empezar con 'use'.",
      explanation: "Los custom hooks deben empezar con 'use' para que React pueda verificar que cumplen las reglas de hooks. useToggle describe bien su funcionalidad.",
    },
    {
      id: "react10-ej-08",
      type: "quiz",
      difficulty: 3,
      xpReward: 15,
      order: 8,
      prompt: "Para que sirve el hook useId de React?",
      options: [
        { id: "a", text: "Generar IDs unicos para elementos, compatibles con SSR", isCorrect: true },
        { id: "b", text: "Obtener el ID del componente en el arbol de React", isCorrect: false },
        { id: "c", text: "Crear un identificador para el estado global", isCorrect: false },
        { id: "d", text: "Asignar IDs a los hooks internamente", isCorrect: false },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "Es util para conectar labels con inputs en formularios.",
      explanation: "useId genera IDs unicos y estables que funcionan tanto en cliente como servidor (SSR). Son ideales para atributos htmlFor/id en formularios.",
    },
  ],
};
