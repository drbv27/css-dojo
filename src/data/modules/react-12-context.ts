import type { ModuleData } from "@/types";

export const reactContextModule: ModuleData = {
  slug: "react-context",
  title: "Context API",
  description:
    "Aprende a compartir datos entre componentes sin prop drilling usando createContext, useContext y el patron Provider.",
  order: 212,
  category: "react-intermediate",
  icon: "share-2",
  dojo: "react",
  lessons: [
    {
      id: "react12-leccion-01",
      title: "El problema del prop drilling",
      content: `## Prop Drilling y Context API

### El problema
Cuando necesitas pasar datos a componentes profundamente anidados, tienes que pasarlos por cada nivel intermedio:

\`\`\`jsx
<App usuario={usuario}>
  <Layout usuario={usuario}>
    <Sidebar usuario={usuario}>
      <Avatar usuario={usuario} />  // El unico que lo necesita
    </Sidebar>
  </Layout>
</App>
\`\`\`

Esto se llama **prop drilling** y hace el codigo dificil de mantener.

### La solucion: Context API

Context permite compartir valores entre componentes sin pasar props manualmente por cada nivel.

### Tres pasos:
1. **Crear** el contexto con \`createContext\`
2. **Proveer** el valor con \`<Context.Provider>\`
3. **Consumir** el valor con \`useContext\`

\`\`\`jsx
// 1. Crear
const TemaContext = createContext('claro');

// 2. Proveer
<TemaContext.Provider value="oscuro">
  <MiApp />
</TemaContext.Provider>

// 3. Consumir (en cualquier componente hijo)
function Boton() {
  const tema = useContext(TemaContext);
  return <button className={tema}>Click</button>;
}
\`\`\`

> **Regla:** Context es ideal para datos "globales" como tema, idioma, usuario autenticado.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const { useState, useContext, createContext } = React;

// 1. Crear contexto
const TemaContext = createContext('claro');

// Componente que consume el contexto
function Tarjeta() {
  const tema = useContext(TemaContext);
  const esOscuro = tema === 'oscuro';
  return (
    <div style={{
      background: esOscuro ? '#313244' : '#fff',
      color: esOscuro ? '#cdd6f4' : '#333',
      padding: 16, borderRadius: 8, margin: 8,
      border: '1px solid ' + (esOscuro ? '#45475a' : '#ddd')
    }}>
      <h4>Tarjeta</h4>
      <p>Tema actual: <strong>{tema}</strong></p>
      <p>No recibi el tema como prop!</p>
    </div>
  );
}

function Contenido() {
  return (
    <div>
      <h4>Contenido (no pasa props)</h4>
      <Tarjeta />
      <Tarjeta />
    </div>
  );
}

function App() {
  const [tema, setTema] = useState('claro');
  return (
    // 2. Proveer
    <TemaContext.Provider value={tema}>
      <div style={{
        background: tema === 'oscuro' ? '#1e1e2e' : '#f5f5f5',
        padding: 16, borderRadius: 8, minHeight: 200
      }}>
        <button onClick={() => setTema(t => t === 'claro' ? 'oscuro' : 'claro')}>
          Cambiar tema
        </button>
        <Contenido />
      </div>
    </TemaContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; } button { padding: 8px 16px; background: #cba6f7; color: #1e1e2e; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }',
        editable: true,
      },
      order: 1,
    },
    {
      id: "react12-leccion-02",
      title: "Context con estado",
      content: `## Context + Estado: El Patron Completo

### Patron recomendado
Crea un componente Provider que encapsule el estado y las funciones:

\`\`\`jsx
const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  const login = (datos) => setUsuario(datos);
  const logout = () => setUsuario(null);

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook para consumir
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
\`\`\`

### Uso
\`\`\`jsx
// En App
<AuthProvider>
  <MiApp />
</AuthProvider>

// En cualquier componente
function Perfil() {
  const { usuario, logout } = useAuth();
  return <button onClick={logout}>Cerrar sesion</button>;
}
\`\`\`

### Multiples Contexts
Puedes anidar varios Providers para diferentes datos:
\`\`\`jsx
<AuthProvider>
  <TemaProvider>
    <IdiomaProvider>
      <App />
    </IdiomaProvider>
  </TemaProvider>
</AuthProvider>
\`\`\`

> **Tip:** Crea un custom hook (como useAuth) para cada contexto. Facilita el uso y agrega validacion.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const { useState, useContext, createContext } = React;

// Context de autenticacion
const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const login = (nombre) => setUsuario({ nombre, rol: 'admin' });
  const logout = () => setUsuario(null);

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

// Componentes que consumen el contexto
function Header() {
  const { usuario, logout } = useAuth();
  return (
    <div style={{display:'flex', justifyContent:'space-between', padding:8, background:'#313244', borderRadius:8, color:'#cdd6f4'}}>
      <span>{usuario ? \\\`Hola, \\\${usuario.nombre}!\\\` : 'No autenticado'}</span>
      {usuario && <button onClick={logout} style={{background:'#f38ba8', border:'none', borderRadius:4, padding:'4px 8px', cursor:'pointer'}}>Salir</button>}
    </div>
  );
}

function LoginForm() {
  const { usuario, login } = useAuth();
  const [nombre, setNombre] = useState('');

  if (usuario) return <p style={{color:'#a6e3a1'}}>Sesion activa como {usuario.nombre} ({usuario.rol})</p>;

  return (
    <div style={{marginTop:12}}>
      <input value={nombre} onChange={e => setNombre(e.target.value)}
        placeholder="Tu nombre" style={{padding:8, marginRight:8}} />
      <button onClick={() => nombre && login(nombre)}>Iniciar sesion</button>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <div>
        <h3>Context con Estado</h3>
        <Header />
        <LoginForm />
      </div>
    </AuthProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; } button { padding: 8px 16px; background: #89b4fa; color: #1e1e2e; border: none; border-radius: 6px; cursor: pointer; } input { border: 1px solid #ccc; border-radius: 4px; }',
        editable: true,
      },
      order: 2,
    },
    {
      id: "react12-leccion-03",
      title: "Cuando usar Context vs Props",
      content: `## Context vs Props: Cuando Usar Cada Uno

### Usa Props cuando:
- Los datos solo bajan 1-2 niveles
- Los componentes intermedios necesitan los datos
- Quieres componentes reutilizables (reciben props explicitas)

### Usa Context cuando:
- Muchos componentes en diferentes niveles necesitan el mismo dato
- Los datos son "globales" (tema, idioma, usuario, preferencias)
- El prop drilling hace el codigo dificil de mantener

### Alternativa: Composicion
Antes de usar Context, considera la **composicion**:

\`\`\`jsx
// En vez de pasar usuario por 3 niveles...
<Layout>
  <Sidebar>
    <Avatar usuario={usuario} />
  </Sidebar>
</Layout>

// Pasa el componente ya construido
<Layout sidebar={<Avatar usuario={usuario} />} />
\`\`\`

### Cuidado con Context
- **No para todo:** No pongas todo el estado en Context
- **Re-renders:** Todos los consumidores se re-renderizan cuando el valor cambia
- **Separar:** Usa diferentes contexts para datos no relacionados

\`\`\`jsx
// MAL: un contexto gigante
<AppContext.Provider value={{ tema, usuario, carrito, idioma }}>

// BIEN: contextos separados
<TemaProvider>
  <AuthProvider>
    <CarritoProvider>
\`\`\`

> **Recuerda:** Props para datos locales, Context para datos compartidos ampliamente.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const { useState, useContext, createContext } = React;

// Contexto de idioma
const IdiomaContext = createContext('es');
// Contexto de tema
const TemaContext = createContext('claro');

const traducciones = {
  es: { saludo: 'Hola Mundo', boton: 'Cambiar idioma', tema: 'Cambiar tema' },
  en: { saludo: 'Hello World', boton: 'Change language', tema: 'Change theme' },
  fr: { saludo: 'Bonjour le Monde', boton: 'Changer la langue', tema: 'Changer le theme' },
};

function Contenido() {
  const idioma = useContext(IdiomaContext);
  const tema = useContext(TemaContext);
  const t = traducciones[idioma];
  const oscuro = tema === 'oscuro';

  return (
    <div style={{
      background: oscuro ? '#313244' : '#fff',
      color: oscuro ? '#cdd6f4' : '#333',
      padding: 20, borderRadius: 8, marginTop: 12, textAlign: 'center'
    }}>
      <h2>{t.saludo}</h2>
      <p>Idioma: <strong>{idioma}</strong> | Tema: <strong>{tema}</strong></p>
      <p style={{fontSize:12}}>Este componente usa 2 contextos diferentes!</p>
    </div>
  );
}

function App() {
  const [idioma, setIdioma] = useState('es');
  const [tema, setTema] = useState('claro');
  const idiomas = ['es', 'en', 'fr'];

  return (
    <IdiomaContext.Provider value={idioma}>
      <TemaContext.Provider value={tema}>
        <div>
          <h3>Multiples Contexts</h3>
          <div style={{display:'flex', gap:8}}>
            <button onClick={() => setIdioma(idiomas[(idiomas.indexOf(idioma) + 1) % 3])}>
              {traducciones[idioma].boton}
            </button>
            <button onClick={() => setTema(t => t === 'claro' ? 'oscuro' : 'claro')}>
              {traducciones[idioma].tema}
            </button>
          </div>
          <Contenido />
        </div>
      </TemaContext.Provider>
    </IdiomaContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; } button { padding: 8px 16px; background: #f9e2af; color: #1e1e2e; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }',
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "react12-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "Que problema resuelve la Context API de React?",
      options: [
        { id: "a", text: "Manejo de rutas en la aplicacion", isCorrect: false },
        { id: "b", text: "Prop drilling (pasar props por muchos niveles)", isCorrect: true },
        { id: "c", text: "Animaciones de componentes", isCorrect: false },
        { id: "d", text: "Peticiones HTTP al servidor", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Es un problema de pasar datos a traves de muchos componentes intermedios.",
      explanation: "Context resuelve el prop drilling, permitiendo compartir datos con componentes profundos sin pasar props por cada nivel intermedio.",
    },
    {
      id: "react12-ej-02",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt: "Cuales son los tres pasos para usar Context?",
      options: [
        { id: "a", text: "import, export, render", isCorrect: false },
        { id: "b", text: "createContext, Provider, useContext", isCorrect: true },
        { id: "c", text: "useState, useEffect, useRef", isCorrect: false },
        { id: "d", text: "create, update, delete", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Crear, proveer, consumir.",
      explanation: "Los tres pasos son: 1) createContext para crear, 2) Provider para proveer el valor, 3) useContext para consumirlo.",
    },
    {
      id: "react12-ej-03",
      type: "code-completion",
      difficulty: 2 ,
      xpReward: 20,
      order: 3,
      prompt: "Completa para consumir el contexto de tema dentro de un componente:",
      codeTemplate: {
        html: "",
        cssPrefix: "const TemaContext = createContext('claro');\n\nfunction Boton() {\n  const tema = ",
        cssSuffix: "(TemaContext);\n  return <button className={tema}>Click</button>;\n}",
        blanks: ["useContext"],
      },
      validation: { type: "exact", answer: "useContext" },
      hint: "Es el hook para consumir un contexto.",
      explanation: "useContext(TemaContext) lee el valor actual del contexto mas cercano TemaContext.Provider en el arbol de componentes.",
    },
    {
      id: "react12-ej-04",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt: "Clasifica: es mejor usar Props o Context para este caso?",
      dragItems: [
        { id: "d1", content: "Tema oscuro/claro de toda la app", correctZone: "context" },
        { id: "d2", content: "Titulo de un boton", correctZone: "props" },
        { id: "d3", content: "Usuario autenticado", correctZone: "context" },
        { id: "d4", content: "Color de un componente Card", correctZone: "props" },
        { id: "d5", content: "Idioma de la aplicacion", correctZone: "context" },
        { id: "d6", content: "Lista de items para un componente Lista", correctZone: "props" },
      ],
      dropZones: [
        { id: "props", label: "Props" },
        { id: "context", label: "Context" },
      ],
      validation: { type: "exact", answer: { d1: "context", d2: "props", d3: "context", d4: "props", d5: "context", d6: "props" } },
      hint: "Context para datos globales, Props para datos especificos del componente.",
      explanation: "Context es ideal para datos globales (tema, usuario, idioma). Props son mejores para datos locales y especificos de un componente.",
    },
    {
      id: "react12-ej-05",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt: "Que pasa cuando cambia el value del Provider?",
      options: [
        { id: "a", text: "Solo el Provider se re-renderiza", isCorrect: false },
        { id: "b", text: "Todos los componentes de la app se re-renderizan", isCorrect: false },
        { id: "c", text: "Todos los consumidores (useContext) se re-renderizan", isCorrect: true },
        { id: "d", text: "Nada cambia hasta el siguiente render manual", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Los componentes que leen el contexto necesitan actualizarse.",
      explanation: "Cuando el value del Provider cambia, todos los componentes que usan useContext con ese contexto se re-renderizan automaticamente.",
    },
    {
      id: "react12-ej-06",
      type: "code-completion",
      difficulty: 2 ,
      xpReward: 20,
      order: 6,
      prompt: "Completa el Provider para pasar el valor del tema:",
      codeTemplate: {
        html: "",
        cssPrefix: "const TemaContext = createContext('claro');\n\nfunction App() {\n  const [tema, setTema] = useState('oscuro');\n  return (\n    <TemaContext.",
        cssSuffix: " value={tema}>\n      <MiApp />\n    </TemaContext.Provider>\n  );\n}",
        blanks: ["Provider"],
      },
      validation: { type: "exact", answer: "Provider" },
      hint: "Es el componente que provee el valor a los hijos.",
      explanation: "Context.Provider es el componente que envuelve a los hijos y les provee el valor del contexto a traves del atributo value.",
    },
    {
      id: "react12-ej-07",
      type: "quiz",
      difficulty: 3 ,
      xpReward: 30,
      order: 7,
      prompt: "Por que es mejor separar contextos no relacionados en lugar de tener uno solo?",
      options: [
        { id: "a", text: "React no permite multiples valores en un Provider", isCorrect: false },
        { id: "b", text: "Evita re-renders innecesarios en consumidores que no usan todos los datos", isCorrect: true },
        { id: "c", text: "Es obligatorio por las reglas de React", isCorrect: false },
        { id: "d", text: "Reduce el tamano del bundle", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Piensa en que pasa cuando cambia solo uno de los valores.",
      explanation: "Si cambias el tema en un contexto que tambien tiene carrito e idioma, TODOS los consumidores se re-renderizan. Separando, solo los que leen el tema se actualizan.",
    },
    {
      id: "react12-ej-08",
      type: "quiz",
      difficulty: 3 ,
      xpReward: 30,
      order: 8,
      prompt: "Cual es una buena practica al crear un contexto con estado?",
      options: [
        { id: "a", text: "Siempre usar Redux en vez de Context", isCorrect: false },
        { id: "b", text: "Crear un custom hook (useAuth, useTema) que valide el contexto", isCorrect: true },
        { id: "c", text: "Exportar el contexto directamente y usar useContext en cada componente", isCorrect: false },
        { id: "d", text: "Poner todo el estado de la app en un solo contexto", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Encapsular la logica del contexto en un hook facilita el uso.",
      explanation: "Crear un custom hook como useAuth() encapsula useContext, agrega validacion (error si no hay Provider), y proporciona una API mas limpia.",
    },
  ],
};
