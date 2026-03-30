import type { ModuleData } from "@/types";

export const reactRouterModule: ModuleData = {
  slug: "react-router",
  title: "React Router",
  description:
    "Implementa navegacion en tu aplicacion React con React Router: rutas, enlaces, parametros, rutas anidadas y proteccion de rutas.",
  order: 213,
  category: "react-intermediate",
  icon: "navigation",
  dojo: "react",
  lessons: [
    {
      id: "react13-leccion-01",
      title: "Rutas basicas con React Router",
      content: `## React Router: Navegacion en SPAs

React Router es la libreria estandar para manejar navegacion en aplicaciones React.

### Instalacion
\`\`\`bash
npm install react-router-dom
\`\`\`

### Configuracion basica
\`\`\`jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/about" element={<Acerca />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="*" element={<NoEncontrado />} />
      </Routes>
    </BrowserRouter>
  );
}
\`\`\`

### Componentes clave
- **BrowserRouter** — envuelve la app, habilita el enrutamiento
- **Routes** — contenedor de rutas (solo renderiza la primera que coincida)
- **Route** — define una ruta: path + componente a renderizar
- **path="*"** — ruta comodin para paginas 404

### Link y NavLink
\`\`\`jsx
import { Link, NavLink } from 'react-router-dom';

// Link basico
<Link to="/about">Acerca de</Link>

// NavLink - agrega clase 'active' automaticamente
<NavLink to="/about"
  className={({ isActive }) => isActive ? 'activo' : ''}>
  Acerca de
</NavLink>
\`\`\`

> **Importante:** Nunca uses \`<a href>\` para navegacion interna. Usa \`<Link>\` para evitar recargar la pagina.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const { useState } = React;

// Simulacion de React Router (no funciona con CDN real)
function SimuladorRouter() {
  const [ruta, setRuta] = useState('/');

  const rutas = {
    '/': { titulo: 'Inicio', contenido: 'Bienvenido a la pagina principal!' },
    '/about': { titulo: 'Acerca de', contenido: 'Somos un equipo de desarrolladores.' },
    '/contacto': { titulo: 'Contacto', contenido: 'Email: hola@ejemplo.com' },
  };

  const pagina = rutas[ruta] || { titulo: '404', contenido: 'Pagina no encontrada' };

  return (
    <div>
      <h3>Simulador de React Router</h3>
      <nav style={{display:'flex', gap:8, marginBottom:16, borderBottom:'2px solid #313244', paddingBottom:8}}>
        {Object.keys(rutas).map(path => (
          <button key={path}
            onClick={() => setRuta(path)}
            style={{
              background: ruta === path ? '#89b4fa' : '#45475a',
              color: ruta === path ? '#1e1e2e' : '#cdd6f4',
              border:'none', padding:'8px 16px', borderRadius:6, cursor:'pointer'
            }}>
            {rutas[path].titulo}
          </button>
        ))}
        <button onClick={() => setRuta('/xyz')}
          style={{background:'#45475a', color:'#cdd6f4', border:'none', padding:'8px 16px', borderRadius:6, cursor:'pointer'}}>
          404
        </button>
      </nav>
      <div style={{background:'#313244', padding:20, borderRadius:8, color:'#cdd6f4'}}>
        <h2>{pagina.titulo}</h2>
        <p>{pagina.contenido}</p>
        <p style={{fontSize:12, color:'#888'}}>Ruta actual: {ruta}</p>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<SimuladorRouter />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; background: #1e1e2e; color: #cdd6f4; min-height: 250px; }',
        editable: true,
      },
      order: 1,
    },
    {
      id: "react13-leccion-02",
      title: "useNavigate y useParams",
      content: `## Hooks de React Router

### useNavigate — navegacion programatica
\`\`\`jsx
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // ... logica de login
    navigate('/dashboard'); // Redirigir
    navigate(-1);           // Ir atras
  };
}
\`\`\`

### useParams — leer parametros de la URL
\`\`\`jsx
// Ruta: /usuario/:id
<Route path="/usuario/:id" element={<Perfil />} />

function Perfil() {
  const { id } = useParams();
  // Si la URL es /usuario/42, id = "42"
  return <h1>Perfil del usuario {id}</h1>;
}
\`\`\`

### useSearchParams — query strings
\`\`\`jsx
// URL: /productos?categoria=libros&orden=precio
function Productos() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoria = searchParams.get('categoria');
  const orden = searchParams.get('orden');
}
\`\`\`

### useLocation — informacion de la ubicacion actual
\`\`\`jsx
const location = useLocation();
console.log(location.pathname); // "/usuario/42"
console.log(location.search);   // "?tab=posts"
\`\`\`

> **Tip:** useNavigate reemplaza a useHistory de versiones anteriores de React Router.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const { useState } = React;

// Simulacion de useParams y useNavigate
function SimuladorParams() {
  const [ruta, setRuta] = useState('/productos');
  const [historial, setHistorial] = useState(['/productos']);

  const navigate = (path) => {
    setRuta(path);
    setHistorial(h => [...h, path]);
  };

  const goBack = () => {
    if (historial.length > 1) {
      const newHist = historial.slice(0, -1);
      setHistorial(newHist);
      setRuta(newHist[newHist.length - 1]);
    }
  };

  const productos = [
    { id: 1, nombre: 'React Avanzado', precio: 29.99 },
    { id: 2, nombre: 'JavaScript Pro', precio: 24.99 },
    { id: 3, nombre: 'CSS Mastery', precio: 19.99 },
  ];

  // Extraer parametro :id de la ruta
  const match = ruta.match(/\\/producto\\/(\\d+)/);
  const paramId = match ? parseInt(match[1]) : null;

  const renderContenido = () => {
    if (paramId) {
      const prod = productos.find(p => p.id === paramId);
      if (!prod) return <p>Producto no encontrado</p>;
      return (
        <div>
          <button onClick={goBack} style={{marginBottom:8}}>← Volver</button>
          <h3>{prod.nombre}</h3>
          <p>Precio: \${prod.precio}</p>
          <p style={{fontSize:12, color:'#888'}}>useParams → id: {paramId}</p>
        </div>
      );
    }
    return (
      <div>
        <h3>Productos</h3>
        {productos.map(p => (
          <div key={p.id} onClick={() => navigate(\\\`/producto/\\\${p.id}\\\`)}
            style={{padding:8, margin:4, background:'#45475a', borderRadius:6, cursor:'pointer'}}>
            {p.nombre} - \${p.precio}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div style={{fontSize:12, color:'#888', marginBottom:8}}>
        Ruta: <code>{ruta}</code>
      </div>
      {renderContenido()}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<SimuladorParams />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; background: #1e1e2e; color: #cdd6f4; min-height: 200px; } button { padding: 6px 14px; background: #89b4fa; color: #1e1e2e; border: none; border-radius: 6px; cursor: pointer; } code { background: #313244; padding: 2px 6px; border-radius: 4px; }',
        editable: true,
      },
      order: 2,
    },
    {
      id: "react13-leccion-03",
      title: "Rutas anidadas y proteccion",
      content: `## Rutas Anidadas y Protegidas

### Rutas anidadas
Permiten crear layouts compartidos:

\`\`\`jsx
<Routes>
  <Route path="/dashboard" element={<DashboardLayout />}>
    <Route index element={<DashboardHome />} />
    <Route path="perfil" element={<Perfil />} />
    <Route path="settings" element={<Settings />} />
  </Route>
</Routes>

function DashboardLayout() {
  return (
    <div>
      <nav>...</nav>
      <Outlet /> {/* Aqui se renderizan las rutas hijas */}
    </div>
  );
}
\`\`\`

### Outlet
\`<Outlet />\` es donde se renderizan los componentes de las rutas hijas dentro del layout padre.

### Rutas protegidas
\`\`\`jsx
function RutaProtegida({ children }) {
  const { usuario } = useAuth();
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Uso
<Route path="/dashboard" element={
  <RutaProtegida>
    <Dashboard />
  </RutaProtegida>
} />
\`\`\`

### Navigate
\`\`\`jsx
// Redireccion declarativa
<Navigate to="/login" replace />
// replace evita que el usuario vuelva atras a la ruta protegida
\`\`\`

> **Patron:** Crea un componente RutaProtegida reutilizable que verifique la autenticacion.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const { useState } = React;

function SimuladorRutasAnidadas() {
  const [usuario, setUsuario] = useState(null);
  const [ruta, setRuta] = useState('/');
  const [subRuta, setSubRuta] = useState('inicio');

  const login = () => {
    setUsuario({ nombre: 'Diego' });
    setRuta('/dashboard');
    setSubRuta('inicio');
  };
  const logout = () => { setUsuario(null); setRuta('/'); };

  // Ruta protegida
  if (ruta === '/dashboard' && !usuario) {
    return (
      <div>
        <p style={{color:'#f38ba8'}}>Acceso denegado! Redirigiendo a login...</p>
        <button onClick={() => setRuta('/')}>Ir a login</button>
      </div>
    );
  }

  if (ruta === '/dashboard') {
    return (
      <div>
        <h3>Dashboard (Ruta Protegida)</h3>
        <nav style={{display:'flex', gap:4, marginBottom:12, borderBottom:'2px solid #45475a', paddingBottom:8}}>
          {['inicio', 'perfil', 'config'].map(sub => (
            <button key={sub} onClick={() => setSubRuta(sub)}
              style={{background: subRuta === sub ? '#a6e3a1' : '#45475a', color: subRuta === sub ? '#1e1e2e' : '#cdd6f4'}}>
              {sub.charAt(0).toUpperCase() + sub.slice(1)}
            </button>
          ))}
          <button onClick={logout} style={{marginLeft:'auto', background:'#f38ba8'}}>Salir</button>
        </nav>
        {/* Outlet simulado */}
        <div style={{background:'#313244', padding:16, borderRadius:8}}>
          {subRuta === 'inicio' && <p>Bienvenido al dashboard, {usuario.nombre}!</p>}
          {subRuta === 'perfil' && <p>Perfil de {usuario.nombre}</p>}
          {subRuta === 'config' && <p>Configuracion de la cuenta</p>}
          <p style={{fontSize:11, color:'#888'}}>Ruta: /dashboard/{subRuta} (Outlet renderiza aqui)</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3>Login</h3>
      <p>Necesitas autenticarte para acceder al dashboard.</p>
      <button onClick={login}>Iniciar sesion</button>
      <button onClick={() => setRuta('/dashboard')} style={{marginLeft:8, background:'#f38ba8'}}>
        Ir a dashboard sin login
      </button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<SimuladorRutasAnidadas />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; background: #1e1e2e; color: #cdd6f4; min-height: 200px; } button { padding: 6px 14px; border: none; border-radius: 6px; cursor: pointer; color: #1e1e2e; background: #89b4fa; }',
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "react13-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "Que componente de React Router envuelve toda la aplicacion para habilitar el enrutamiento?",
      options: [
        { id: "a", text: "Routes", isCorrect: false },
        { id: "b", text: "BrowserRouter", isCorrect: true },
        { id: "c", text: "Route", isCorrect: false },
        { id: "d", text: "Router", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Es el componente de mas alto nivel que habilita la navegacion basada en el navegador.",
      explanation: "BrowserRouter envuelve la aplicacion y proporciona el contexto necesario para que funcione la navegacion con la History API del navegador.",
    },
    {
      id: "react13-ej-02",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 2,
      prompt: "Que componente se usa en vez de <a href> para la navegacion interna?",
      options: [
        { id: "a", text: "<Navigate>", isCorrect: false },
        { id: "b", text: "<Anchor>", isCorrect: false },
        { id: "c", text: "<Link>", isCorrect: true },
        { id: "d", text: "<Redirect>", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Su nombre significa 'enlace' en ingles.",
      explanation: "Link de React Router navega sin recargar la pagina (SPA). Usa <a href> solo para enlaces externos.",
    },
    {
      id: "react13-ej-03",
      type: "code-completion",
      difficulty: 2,
      xpReward: 15,
      order: 3,
      prompt: "Completa para definir una ruta con parametro dinamico para el ID de usuario:",
      codeTemplate: {
        html: "",
        cssPrefix: "<Route path=\"/usuario/",
        cssSuffix: "\" element={<Perfil />} />",
        blanks: [":id"],
      },
      validation: { type: "exact", answer: ":id" },
      hint: "Los parametros dinamicos en la ruta empiezan con ':'.",
      explanation: "En React Router, :id define un parametro dinamico en la URL que luego se puede leer con useParams().",
    },
    {
      id: "react13-ej-04",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 4,
      prompt: "Que hook se usa para navegar programaticamente (ej: despues de un login)?",
      options: [
        { id: "a", text: "useRouter", isCorrect: false },
        { id: "b", text: "useNavigate", isCorrect: true },
        { id: "c", text: "useHistory", isCorrect: false },
        { id: "d", text: "useRedirect", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Su nombre describe la accion de ir a otra pagina.",
      explanation: "useNavigate() devuelve una funcion que permite navegar a otra ruta. Reemplazo a useHistory de React Router v5.",
    },
    {
      id: "react13-ej-05",
      type: "code-completion",
      difficulty: 2,
      xpReward: 15,
      order: 5,
      prompt: "Completa para leer el parametro 'id' de la URL /producto/:id:",
      codeTemplate: {
        html: "",
        cssPrefix: "function Producto() {\n  const { id } = ",
        cssSuffix: "();\n  return <h1>Producto {id}</h1>;\n}",
        blanks: ["useParams"],
      },
      validation: { type: "exact", answer: "useParams" },
      hint: "Es el hook para leer parametros de la ruta.",
      explanation: "useParams() devuelve un objeto con todos los parametros dinamicos definidos en la ruta, como :id.",
    },
    {
      id: "react13-ej-06",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 6,
      prompt: "Asocia cada componente/hook con su funcion en React Router:",
      dragItems: [
        { id: "d1", content: "BrowserRouter", correctZone: "envolver" },
        { id: "d2", content: "Route", correctZone: "definir" },
        { id: "d3", content: "Link", correctZone: "navegar" },
        { id: "d4", content: "Outlet", correctZone: "renderizar" },
        { id: "d5", content: "useParams", correctZone: "leer" },
        { id: "d6", content: "Navigate", correctZone: "redirigir" },
      ],
      dropZones: [
        { id: "envolver", label: "Envolver la app" },
        { id: "definir", label: "Definir una ruta" },
        { id: "navegar", label: "Enlace de navegacion" },
        { id: "renderizar", label: "Renderizar ruta hija" },
        { id: "leer", label: "Leer parametros URL" },
        { id: "redirigir", label: "Redireccion declarativa" },
      ],
      validation: { type: "exact", answer: { d1: "envolver", d2: "definir", d3: "navegar", d4: "renderizar", d5: "leer", d6: "redirigir" } },
      hint: "Cada componente tiene una funcion especifica en el sistema de rutas.",
      explanation: "BrowserRouter envuelve la app, Route define rutas, Link navega, Outlet renderiza hijos, useParams lee parametros y Navigate redirige.",
    },
    {
      id: "react13-ej-07",
      type: "quiz",
      difficulty: 3,
      xpReward: 15,
      order: 7,
      prompt: "Que hace path='*' en una ruta de React Router?",
      options: [
        { id: "a", text: "Redirige a la pagina principal", isCorrect: false },
        { id: "b", text: "Captura todas las rutas que no coincidan con ninguna otra (404)", isCorrect: true },
        { id: "c", text: "Renderiza todas las rutas al mismo tiempo", isCorrect: false },
        { id: "d", text: "Protege la ruta con autenticacion", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Es un comodin que captura todo lo demas.",
      explanation: "path='*' es una ruta comodin que coincide con cualquier URL que no haya sido capturada por rutas anteriores. Se usa para paginas 404.",
    },
    {
      id: "react13-ej-08",
      type: "quiz",
      difficulty: 3,
      xpReward: 15,
      order: 8,
      prompt: "En rutas anidadas, que componente se usa dentro del layout padre para renderizar las rutas hijas?",
      options: [
        { id: "a", text: "Children", isCorrect: false },
        { id: "b", text: "Routes", isCorrect: false },
        { id: "c", text: "Outlet", isCorrect: true },
        { id: "d", text: "Portal", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Es como un 'enchufe' donde se conectan las rutas hijas.",
      explanation: "Outlet actua como un placeholder en el componente layout padre. React Router renderiza ahi el componente de la ruta hija que coincida.",
    },
  ],
};
