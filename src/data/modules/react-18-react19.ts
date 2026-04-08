import type { ModuleData } from "@/types";

export const react19Module: ModuleData = {
  slug: "react-19-nuevas-features",
  title: "React 19: Nuevas Caracteristicas",
  description:
    "Explora las novedades de React 19: React Compiler, hook use(), Actions, useActionState, useFormStatus, useOptimistic, ref como prop, metadata y mas.",
  order: 218,
  category: "react-advanced",
  icon: "sparkles",
  dojo: "react",
  lessons: [
    {
      id: "react18-leccion-01",
      title: "React Compiler y el hook use()",
      content: `## React 19: Una Nueva Era

React 19 es la actualizacion mas grande desde los Hooks. Simplifica muchos patrones y elimina codigo repetitivo.

### React Compiler (React Forget)

Antes de React 19, optimizar rendimiento requeria usar manualmente \`useMemo\`, \`useCallback\` y \`React.memo\`. El **React Compiler** hace esto automaticamente.

#### Antes (React 18):
\`\`\`jsx
function Componente({ items, filtro }) {
  // Manual: memorizar calculo
  const filtrados = useMemo(
    () => items.filter(i => i.includes(filtro)),
    [items, filtro]
  );

  // Manual: memorizar funcion
  const handleClick = useCallback(() => {
    console.log(filtrados);
  }, [filtrados]);

  return <Lista items={filtrados} onClick={handleClick} />;
}
\`\`\`

#### Despues (React 19 con Compiler):
\`\`\`jsx
function Componente({ items, filtro }) {
  // El Compiler memoriza automaticamente!
  const filtrados = items.filter(i => i.includes(filtro));

  const handleClick = () => {
    console.log(filtrados);
  };

  return <Lista items={filtrados} onClick={handleClick} />;
}
\`\`\`

El compilador analiza tu codigo y agrega memorizacion donde sea beneficioso. **No necesitas cambiar tu codigo.**

### El hook use()

\`use()\` es un nuevo hook especial que puede:
1. **Leer el valor de una Promise** (reemplaza useEffect para data fetching)
2. **Leer Context** de forma condicional

\`\`\`jsx
// Leer una Promise (con Suspense)
function Comentarios({ commentsPromise }) {
  const comments = use(commentsPromise);
  return comments.map(c => <p key={c.id}>{c.body}</p>);
}

// Uso con Suspense
<Suspense fallback={<p>Cargando...</p>}>
  <Comentarios commentsPromise={fetchComments()} />
</Suspense>
\`\`\`

\`\`\`jsx
// Leer Context condicionalmente (antes imposible)
function Tema({ isAdmin }) {
  if (isAdmin) {
    const tema = use(TemaContext); // Valido en React 19!
    return <AdminPanel tema={tema} />;
  }
  return <UserPanel />;
}
\`\`\`

### Diferencia clave: use() vs useContext()
- \`useContext()\` solo puede llamarse en el nivel superior
- \`use()\` puede llamarse dentro de condicionales y loops
- \`use()\` tambien funciona con Promises

> **El React Compiler elimina la necesidad de useMemo, useCallback y React.memo en la mayoria de los casos.** Es la mejora mas impactante de React 19.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const { useState, useMemo, useCallback, memo } = React;

// Simulacion: Antes vs Despues del React Compiler
function DemoCompiler() {
  const [count, setCount] = useState(0);
  const [query, setQuery] = useState('');

  const items = ['React', 'Angular', 'Vue', 'Svelte', 'Solid', 'Next.js', 'Remix'];

  // En React 18: necesitas useMemo para evitar recalculos
  // En React 19: el Compiler lo hace automaticamente
  const filtrados = useMemo(
    () => items.filter(i => i.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  // En React 18: necesitas useCallback
  // En React 19: el Compiler lo hace automaticamente
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);

  return (
    <div>
      <h3>React Compiler: Memorizacion Automatica</h3>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
        <div style={{padding:12, background:'#ffebee', borderRadius:8}}>
          <h4 style={{color:'#c62828'}}>React 18 (manual)</h4>
          <pre style={{fontSize:11, background:'#fff', padding:8, borderRadius:4, overflow:'auto'}}>
{\`const filtrados = useMemo(
  () => items.filter(...),
  [query]
);

const handleClick = useCallback(
  () => setCount(c => c + 1),
  []
);\`}
          </pre>
        </div>
        <div style={{padding:12, background:'#e8f5e9', borderRadius:8}}>
          <h4 style={{color:'#2e7d32'}}>React 19 (automatico)</h4>
          <pre style={{fontSize:11, background:'#fff', padding:8, borderRadius:4, overflow:'auto'}}>
{\`// Sin useMemo ni useCallback!
const filtrados = items.filter(...);

const handleClick = () => {
  setCount(c => c + 1);
};\`}
          </pre>
        </div>
      </div>

      <div style={{marginTop:16}}>
        <input value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Filtrar frameworks..." style={{padding:8, marginRight:8}} />
        <button onClick={handleClick}>Clicks: {count}</button>
        <ul>{filtrados.map(f => <li key={f}>{f}</li>)}</ul>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<DemoCompiler />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; } button { padding: 8px 16px; background: #89b4fa; color: #1e1e2e; border: none; border-radius: 6px; cursor: pointer; } input { border: 1px solid #ccc; border-radius: 6px; }',
        editable: true,
      },
      order: 1,
    },
    {
      id: "react18-leccion-02",
      title: "Actions: useActionState y useFormStatus",
      content: `## Actions en React 19

Las **Actions** simplifican el manejo de formularios y mutaciones de datos. Eliminan la necesidad de manejar manualmente estados de carga, errores y optimismo.

### useActionState (antes useFormState)

Reemplaza el patron comun de \`useState\` + \`setLoading\` + \`setError\`:

\`\`\`jsx
// React 19
import { useActionState } from 'react';

function FormularioLogin() {
  const [state, formAction, isPending] = useActionState(
    async (prevState, formData) => {
      const email = formData.get('email');
      const password = formData.get('password');

      try {
        await loginAPI(email, password);
        return { success: true, error: null };
      } catch (err) {
        return { success: false, error: err.message };
      }
    },
    { success: false, error: null } // estado inicial
  );

  return (
    <form action={formAction}>
      <input name="email" type="email" />
      <input name="password" type="password" />
      {state.error && <p>{state.error}</p>}
      <button disabled={isPending}>
        {isPending ? 'Enviando...' : 'Login'}
      </button>
    </form>
  );
}
\`\`\`

### useFormStatus

Permite a componentes **hijos** del formulario conocer el estado de envio:

\`\`\`jsx
import { useFormStatus } from 'react-dom';

function BotonSubmit() {
  const { pending, data, method } = useFormStatus();
  return (
    <button disabled={pending}>
      {pending ? 'Enviando...' : 'Enviar'}
    </button>
  );
}

// Uso: debe estar DENTRO de un <form>
<form action={miAccion}>
  <input name="nombre" />
  <BotonSubmit /> {/* Automaticamente sabe si el form esta enviando */}
</form>
\`\`\`

### form action con funciones

En React 19, el atributo \`action\` de un \`<form>\` puede ser una funcion:

\`\`\`jsx
<form action={async (formData) => {
  await guardarDatos(formData);
}}>
\`\`\`

### Diferencia clave con React 18

| React 18 | React 19 |
|----------|----------|
| useState para loading | isPending automatico |
| useState para errores | Estado en useActionState |
| onSubmit + preventDefault | action={funcion} |
| Manejo manual de FormData | FormData automatico |

> **Las Actions transforman como manejamos formularios.** Menos codigo, menos bugs, mejor UX.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const { useState } = React;

// Simulacion de Actions (React 19 pattern)
function SimuladorActions() {
  // Simulando useActionState
  const [state, setState] = useState({ data: null, error: null });
  const [isPending, setIsPending] = useState(false);

  const handleAction = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const nombre = formData.get('nombre');
    const email = formData.get('email');

    setIsPending(true);
    setState({ data: null, error: null });

    // Simular API call
    await new Promise(r => setTimeout(r, 1500));

    if (!email.includes('@')) {
      setState({ data: null, error: 'Email invalido' });
      setIsPending(false);
      return;
    }

    setState({ data: { nombre, email }, error: null });
    setIsPending(false);
  };

  return (
    <div>
      <h3>Actions en React 19 (simulado)</h3>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
        <div>
          <h4>Formulario con Actions:</h4>
          <form onSubmit={handleAction}>
            <div style={{marginBottom:8}}>
              <label>Nombre:</label><br/>
              <input name="nombre" defaultValue="Diego" required
                style={{padding:8, width:'100%', boxSizing:'border-box'}} />
            </div>
            <div style={{marginBottom:8}}>
              <label>Email:</label><br/>
              <input name="email" defaultValue="diego@react.dev" required
                style={{padding:8, width:'100%', boxSizing:'border-box'}} />
            </div>
            {state.error && (
              <p style={{color:'#f38ba8', fontSize:13, padding:4, background:'#ffebee', borderRadius:4}}>
                {state.error}
              </p>
            )}
            <button disabled={isPending} style={{opacity: isPending ? 0.6 : 1}}>
              {isPending ? 'Enviando...' : 'Guardar'}
            </button>
          </form>
          {state.data && (
            <div style={{marginTop:8, padding:8, background:'#e8f5e9', borderRadius:6}}>
              Guardado: {state.data.nombre} ({state.data.email})
            </div>
          )}
        </div>

        <div>
          <h4>Codigo React 19:</h4>
          <pre style={{fontSize:11, background:'#1e1e2e', color:'#cdd6f4', padding:12, borderRadius:8, overflow:'auto'}}>
{\`// useActionState maneja todo
const [state, action, isPending] =
  useActionState(async (prev, formData) => {
    const email = formData.get('email');
    const res = await saveUser(formData);
    if (res.error) return { error: res.error };
    return { data: res.data };
  }, { data: null, error: null });

// form action en vez de onSubmit
<form action={action}>
  <input name="email" />
  <SubmitButton /> {/* useFormStatus */}
</form>\`}
          </pre>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<SimuladorActions />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; } button { padding: 8px 20px; background: #a6e3a1; color: #1e1e2e; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; } label { font-weight: 600; font-size: 14px; } input { border: 1px solid #ccc; border-radius: 4px; }',
        editable: true,
      },
      order: 2,
    },
    {
      id: "react18-leccion-03",
      title: "useOptimistic y ref como prop",
      content: `## useOptimistic: Actualizaciones Optimistas

Una **actualizacion optimista** muestra el resultado esperado inmediatamente, antes de que el servidor confirme.

### useOptimistic
\`\`\`jsx
import { useOptimistic } from 'react';

function ListaMensajes({ mensajes, enviarMensaje }) {
  const [mensajesOptimistas, addOptimistic] = useOptimistic(
    mensajes,
    // Funcion que combina estado actual + nuevo valor optimista
    (currentMensajes, nuevoMensaje) => [
      ...currentMensajes,
      { text: nuevoMensaje, sending: true } // marcado como "enviando"
    ]
  );

  async function handleSend(formData) {
    const text = formData.get('mensaje');
    addOptimistic(text); // Aparece inmediatamente
    await enviarMensaje(text); // Se confirma despues
  }

  return (
    <form action={handleSend}>
      {mensajesOptimistas.map((msg, i) => (
        <p key={i} style={{ opacity: msg.sending ? 0.5 : 1 }}>
          {msg.text} {msg.sending && '(enviando...)'}
        </p>
      ))}
      <input name="mensaje" />
    </form>
  );
}
\`\`\`

### ref como prop (sin forwardRef!)

En React 19, ya **no necesitas forwardRef**. Los refs se pasan como props normales:

#### Antes (React 18):
\`\`\`jsx
const MiInput = forwardRef(function MiInput(props, ref) {
  return <input ref={ref} {...props} />;
});
\`\`\`

#### Despues (React 19):
\`\`\`jsx
function MiInput({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}
// forwardRef ya no es necesario!
\`\`\`

### Beneficios
- Codigo mas simple y legible
- Menos indirecciones
- \`forwardRef\` sera deprecado en futuras versiones

> **useOptimistic** mejora drasticamente la experiencia del usuario al eliminar la sensacion de espera en operaciones de red.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const { useState, useRef } = React;

// Simulacion de useOptimistic
function useOptimisticSimulado(estado, fn) {
  const [optimistas, setOptimistas] = useState([]);

  const addOptimistic = (valor) => {
    setOptimistas(prev => [...prev, valor]);
  };

  const clearOptimistic = (valor) => {
    setOptimistas(prev => prev.filter(v => v !== valor));
  };

  const combined = fn ? optimistas.reduce((acc, val) => fn(acc, val), estado) : estado;
  return [combined, addOptimistic, clearOptimistic];
}

function Chat() {
  const [mensajes, setMensajes] = useState([
    { text: 'Hola! Como estas?', sending: false },
    { text: 'Todo bien, aprendiendo React 19!', sending: false },
  ]);

  const [optimisticMsgs, addOptimistic, clearOptimistic] = useOptimisticSimulado(
    mensajes,
    (current, nuevoTexto) => [...current, { text: nuevoTexto, sending: true }]
  );

  const [input, setInput] = useState('');

  const enviar = async () => {
    if (!input.trim()) return;
    const texto = input;
    setInput('');

    // Mostrar inmediatamente (optimista)
    addOptimistic(texto);

    // Simular envio al servidor
    await new Promise(r => setTimeout(r, 2000));

    // Confirmar: agregar real y limpiar optimista
    setMensajes(prev => [...prev, { text: texto, sending: false }]);
    clearOptimistic(texto);
  };

  return (
    <div>
      <h3>useOptimistic: Chat en Tiempo Real</h3>
      <div style={{background:'#f5f5f5', padding:12, borderRadius:8, maxHeight:200, overflow:'auto', marginBottom:8}}>
        {optimisticMsgs.map((msg, i) => (
          <div key={i} style={{
            padding:8, margin:4, borderRadius:6,
            background: msg.sending ? '#fff3e0' : '#e3f2fd',
            opacity: msg.sending ? 0.7 : 1,
            fontSize: 14
          }}>
            {msg.text}
            {msg.sending && <span style={{fontSize:11, color:'#ff9800'}}> (enviando...)</span>}
          </div>
        ))}
      </div>
      <div style={{display:'flex', gap:8}}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && enviar()}
          placeholder="Escribe un mensaje..."
          style={{flex:1, padding:8}} />
        <button onClick={enviar}>Enviar</button>
      </div>
      <p style={{fontSize:11, color:'#888', marginTop:8}}>
        El mensaje aparece inmediatamente (optimista) y se confirma despues de 2s.
      </p>

      <div style={{marginTop:16, padding:12, background:'#e8f5e9', borderRadius:8}}>
        <h4>ref como prop (React 19)</h4>
        <pre style={{fontSize:12, background:'#fff', padding:8, borderRadius:4}}>
{\`// React 18: necesitas forwardRef
const Input = forwardRef((props, ref) => {
  return <input ref={ref} {...props} />;
});

// React 19: ref es una prop normal!
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}\`}
        </pre>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Chat />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; } button { padding: 8px 16px; background: #89b4fa; color: #1e1e2e; border: none; border-radius: 6px; cursor: pointer; } input { border: 1px solid #ccc; border-radius: 6px; }',
        editable: true,
      },
      order: 3,
    },
    {
      id: "react18-leccion-04",
      title: "Metadata, Server Components y manejo de errores",
      content: `## Mas Novedades de React 19

### Document Metadata en Componentes

En React 19, puedes renderizar \`<title>\`, \`<meta>\` y \`<link>\` directamente en tus componentes. React los eleva automaticamente al \`<head>\` del documento.

\`\`\`jsx
function PaginaProducto({ producto }) {
  return (
    <article>
      <title>{producto.nombre} - Mi Tienda</title>
      <meta name="description" content={producto.descripcion} />
      <link rel="canonical" href={\\\`/productos/\\\${producto.id}\\\`} />

      <h1>{producto.nombre}</h1>
      <p>{producto.descripcion}</p>
    </article>
  );
}
\`\`\`

Ya no necesitas \`react-helmet\` o \`next/head\` para esto!

### Server Components (Concepto)

Los **React Server Components (RSC)** se ejecutan en el servidor y envian HTML renderizado al cliente:

\`\`\`jsx
// Componente del servidor (no se envia JS al cliente)
async function ListaProductos() {
  const productos = await db.query('SELECT * FROM productos');
  return (
    <ul>
      {productos.map(p => <li key={p.id}>{p.nombre}</li>)}
    </ul>
  );
}
\`\`\`

**Caracteristicas de los Server Components:**
- Acceden directamente a la base de datos
- No envian JavaScript al cliente (bundle mas pequeno)
- Pueden ser \`async\` directamente
- No pueden tener estado ni efectos (no useState, no useEffect)
- Se complementan con Client Components (\`"use client"\`)

### Manejo de Errores Mejorado

React 19 mejora el manejo de errores de hidratacion y errores en general:

\`\`\`jsx
// Mejor reporte de errores de hidratacion
// React 19 muestra diffs claros entre server y client

// Error boundaries mejorados
<ErrorBoundary fallback={<p>Algo salio mal</p>}>
  <MiComponente />
</ErrorBoundary>
\`\`\`

### Soporte nativo para Stylesheets
\`\`\`jsx
// React maneja la carga de stylesheets
function Componente() {
  return (
    <>
      <link rel="stylesheet" href="/estilos.css" precedence="default" />
      <div className="mi-estilo">Contenido</div>
    </>
  );
}
\`\`\`

### Resumen de React 19

| Feature | Beneficio |
|---------|-----------|
| React Compiler | Elimina useMemo/useCallback manuales |
| use() | Lee Promises y Context condicionalmente |
| useActionState | Simplifica formularios y mutaciones |
| useFormStatus | Estado del form en componentes hijos |
| useOptimistic | Updates optimistas nativos |
| ref como prop | Elimina forwardRef |
| Metadata | title/meta directamente en componentes |
| Server Components | Menos JS al cliente |
| Mejor errores | Diffs de hidratacion claros |

> **React 19 marca un cambio de paradigma.** Muchos patrones que requerían codigo manual ahora son automaticos o tienen APIs dedicadas.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const { useState } = React;

function ResumenReact19() {
  const [featureActiva, setFeatureActiva] = useState(0);

  const features = [
    {
      nombre: 'React Compiler',
      icono: '⚡',
      desc: 'Memorizacion automatica. Elimina useMemo, useCallback y React.memo manuales.',
      codigo: \\\`// React 19: solo escribe codigo normal
function App({ items, query }) {
  // El compiler memoriza automaticamente
  const filtered = items.filter(
    i => i.includes(query)
  );
  return <List items={filtered} />;
}\\\`,
    },
    {
      nombre: 'use() hook',
      icono: '🔄',
      desc: 'Lee Promises y Context. Puede usarse dentro de condicionales.',
      codigo: \\\`// Leer Promise con Suspense
function Comments({ promise }) {
  const comments = use(promise);
  return comments.map(c => <p>{c}</p>);
}

// Context condicional
if (isAdmin) {
  const theme = use(ThemeContext);
}\\\`,
    },
    {
      nombre: 'Actions',
      icono: '📋',
      desc: 'useActionState + useFormStatus simplifican formularios con estado de carga automatico.',
      codigo: \\\`const [state, action, isPending] =
  useActionState(async (prev, formData) => {
    const result = await saveData(formData);
    return result;
  }, initialState);

<form action={action}>
  <input name="email" />
  <SubmitButton /> // useFormStatus()
</form>\\\`,
    },
    {
      nombre: 'useOptimistic',
      icono: '✨',
      desc: 'Muestra cambios inmediatamente, antes de la confirmacion del servidor.',
      codigo: \\\`const [optimistic, addOptimistic] =
  useOptimistic(messages, (state, newMsg) =>
    [...state, { text: newMsg, pending: true }]
  );

addOptimistic("Hola!"); // Aparece al instante\\\`,
    },
    {
      nombre: 'ref como prop',
      icono: '🎯',
      desc: 'Pasa ref directamente como prop. forwardRef ya no es necesario.',
      codigo: \\\`// Antes: forwardRef obligatorio
const Input = forwardRef((props, ref) => {
  return <input ref={ref} {...props} />;
});

// React 19: ref es una prop normal
function Input({ ref, placeholder }) {
  return <input ref={ref} placeholder={placeholder} />;
}\\\`,
    },
    {
      nombre: 'Document Metadata',
      icono: '📄',
      desc: 'Renderiza title, meta y link directamente en componentes.',
      codigo: \\\`function ProductPage({ product }) {
  return (
    <article>
      <title>{product.name} - Store</title>
      <meta name="description"
        content={product.desc} />
      <h1>{product.name}</h1>
    </article>
  );
}\\\`,
    },
  ];

  const f = features[featureActiva];

  return (
    <div>
      <h3>React 19: Todas las Features</h3>
      <div style={{display:'flex', gap:4, flexWrap:'wrap', marginBottom:12}}>
        {features.map((feat, i) => (
          <button key={i} onClick={() => setFeatureActiva(i)}
            style={{
              background: i === featureActiva ? '#89b4fa' : '#e0e0e0',
              color: i === featureActiva ? '#1e1e2e' : '#333',
              padding: '6px 10px', fontSize: 12
            }}>
            {feat.icono} {feat.nombre}
          </button>
        ))}
      </div>
      <div style={{background:'#f5f5f5', padding:16, borderRadius:8}}>
        <h4>{f.icono} {f.nombre}</h4>
        <p style={{color:'#555'}}>{f.desc}</p>
        <pre style={{background:'#1e1e2e', color:'#a6e3a1', padding:12, borderRadius:6, fontSize:12, overflow:'auto'}}>
          {f.codigo}
        </pre>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ResumenReact19 />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; } button { border: none; border-radius: 6px; cursor: pointer; }',
        editable: true,
      },
      order: 4,
    },
  ],
  exercises: [
    {
      id: "react18-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "Que hace el React Compiler (React Forget)?",
      options: [
        { id: "a", text: "Compila React a codigo nativo", isCorrect: false },
        { id: "b", text: "Agrega memorizacion automatica (elimina useMemo/useCallback manuales)", isCorrect: true },
        { id: "c", text: "Convierte componentes de clase a funcionales", isCorrect: false },
        { id: "d", text: "Minifica el codigo automaticamente", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Automatiza algo que antes hacias manualmente para optimizar rendimiento.",
      explanation: "El React Compiler analiza tu codigo y agrega automaticamente useMemo, useCallback y React.memo donde sean beneficiosos, eliminando la necesidad de escribirlos manualmente.",
    },
    {
      id: "react18-ej-02",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt: "Cual es una ventaja del hook use() sobre useContext?",
      options: [
        { id: "a", text: "use() es mas rapido", isCorrect: false },
        { id: "b", text: "use() puede llamarse dentro de condicionales y loops", isCorrect: true },
        { id: "c", text: "use() no necesita un Provider", isCorrect: false },
        { id: "d", text: "use() reemplaza todos los hooks", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Rompe una de las reglas clasicas de los hooks.",
      explanation: "A diferencia de useContext que solo puede llamarse en el nivel superior, use() puede usarse dentro de if, for y otras estructuras condicionales.",
    },
    {
      id: "react18-ej-03",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 3,
      prompt: "Que devuelve useActionState?",
      options: [
        { id: "a", text: "[state, setState]", isCorrect: false },
        { id: "b", text: "[state, dispatch]", isCorrect: false },
        { id: "c", text: "[state, formAction, isPending]", isCorrect: true },
        { id: "d", text: "[formData, submit, reset]", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Devuelve tres valores: el estado, la accion para el form, y un booleano.",
      explanation: "useActionState retorna: state (resultado de la accion), formAction (funcion para el atributo action del form), e isPending (booleano de si esta procesando).",
    },
    {
      id: "react18-ej-04",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt: "Asocia cada feature de React 19 con lo que reemplaza o elimina:",
      dragItems: [
        { id: "d1", content: "React Compiler", correctZone: "memo" },
        { id: "d2", content: "use()", correctZone: "useeffect" },
        { id: "d3", content: "useActionState", correctZone: "usestate" },
        { id: "d4", content: "ref como prop", correctZone: "forwardref" },
        { id: "d5", content: "Document Metadata", correctZone: "helmet" },
        { id: "d6", content: "useOptimistic", correctZone: "manual" },
      ],
      dropZones: [
        { id: "memo", label: "Elimina useMemo/useCallback manuales" },
        { id: "useeffect", label: "Reemplaza useEffect para data fetching" },
        { id: "usestate", label: "Reemplaza useState para loading/error en forms" },
        { id: "forwardref", label: "Elimina la necesidad de forwardRef" },
        { id: "helmet", label: "Reemplaza react-helmet/next-head" },
        { id: "manual", label: "Reemplaza updates optimistas manuales" },
      ],
      validation: { type: "exact", answer: { d1: "memo", d2: "useeffect", d3: "usestate", d4: "forwardref", d5: "helmet", d6: "manual" } },
      hint: "Cada feature de React 19 simplifica o elimina un patron comun de React 18.",
      explanation: "React 19 sistematicamente simplifica patrones: Compiler memoriza automaticamente, use() reemplaza useEffect para fetch, Actions manejan forms, ref es prop normal, metadata nativo, y optimismo integrado.",
    },
    {
      id: "react18-ej-05",
      type: "code-completion",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt: "Completa para pasar ref como prop normal en React 19 (sin forwardRef):",
      codeTemplate: {
        html: "",
        cssPrefix: "function MiInput({ ",
        cssSuffix: ", placeholder }) {\n  return <input ref={ref} placeholder={placeholder} />;\n}",
        blanks: ["ref"],
      },
      validation: { type: "exact", answer: "ref" },
      hint: "En React 19, ref se pasa como cualquier otra prop.",
      explanation: "En React 19, ref es una prop regular que se desestructura como cualquier otra. Ya no necesitas forwardRef para recibirla.",
    },
    {
      id: "react18-ej-06",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 6,
      prompt: "Para que sirve useFormStatus de React 19?",
      options: [
        { id: "a", text: "Validar campos del formulario", isCorrect: false },
        { id: "b", text: "Obtener el estado de envio del formulario padre en componentes hijos", isCorrect: true },
        { id: "c", text: "Crear formularios automaticamente", isCorrect: false },
        { id: "d", text: "Serializar los datos del formulario", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Permite que un boton dentro del form sepa si se esta enviando.",
      explanation: "useFormStatus permite a componentes hijos del form (como un boton) saber si el formulario esta en proceso de envio (pending), sin pasar props manualmente.",
    },
    {
      id: "react18-ej-07",
      type: "quiz",
      difficulty: 3 ,
      xpReward: 30,
      order: 7,
      prompt: "Que caracteristica tienen los Server Components que los Client Components no?",
      options: [
        { id: "a", text: "Pueden usar useState y useEffect", isCorrect: false },
        { id: "b", text: "Pueden ser funciones async y acceder a la base de datos directamente", isCorrect: true },
        { id: "c", text: "Se ejecutan en el navegador del usuario", isCorrect: false },
        { id: "d", text: "Pueden manejar eventos del usuario como onClick", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Se ejecutan en el servidor, asi que pueden acceder a recursos del servidor.",
      explanation: "Los Server Components se ejecutan en el servidor, pueden ser async, acceder a bases de datos y APIs internas sin enviar JavaScript al cliente. No pueden tener estado ni manejar eventos.",
    },
    {
      id: "react18-ej-08",
      type: "code-completion",
      difficulty: 3 ,
      xpReward: 30,
      order: 8,
      prompt: "Completa para renderizar metadata directamente en un componente React 19:",
      codeTemplate: {
        html: "",
        cssPrefix: "function Pagina({ titulo }) {\n  return (\n    <article>\n      <",
        cssSuffix: ">{titulo} - Mi App</title>\n      <h1>{titulo}</h1>\n    </article>\n  );\n}",
        blanks: ["title"],
      },
      validation: { type: "exact", answer: "title" },
      hint: "Es la etiqueta HTML que define el titulo de la pagina.",
      explanation: "En React 19, puedes renderizar <title> directamente dentro de tus componentes. React automaticamente lo eleva al <head> del documento.",
    },
  ],
};
