import type { ModuleData } from "@/types";

export const reactEcoRouterModule: ModuleData = {
  slug: "react-eco-01-router",
  title: "React Router DOM",
  description: "Navegacion en React con React Router v6: rutas, enlaces, parametros y rutas anidadas.",
  order: 201,
  category: "react-eco-routing",
  icon: "code",
  dojo: "react-eco",
  lessons: [
    {
      id: "reco01-leccion-01",
      title: "Rutas basicas",
      content: `## React Router DOM v6

React Router es la libreria estandar para manejar **navegacion** en aplicaciones React.

### Instalacion

\`\`\`bash
npm install react-router-dom
\`\`\`

### Configuracion basica

\`\`\`jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
\`\`\`

### Link — navegacion sin recargar

\`\`\`jsx
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <Link to="/">Inicio</Link>
      <Link to="/about">Acerca de</Link>
    </nav>
  );
}
\`\`\`

### useNavigate — navegacion programatica

\`\`\`jsx
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const navigate = useNavigate();

  const handleSubmit = () => {
    // ... login logic
    navigate("/dashboard");
  };

  return <button onClick={handleSubmit}>Entrar</button>;
}
\`\`\`

> Link es para clicks del usuario, useNavigate es para redirigir desde codigo.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #a6e3a1; border-radius: 8px; white-space: pre-line; }',
        editable: true,
      },
      order: 1,
    },
    {
      id: "reco01-leccion-02",
      title: "Rutas dinamicas y anidadas",
      content: `## Rutas dinamicas con useParams

\`\`\`jsx
import { useParams } from "react-router-dom";

// Ruta: <Route path="/usuario/:id" element={<UsuarioDetalle />} />

function UsuarioDetalle() {
  const { id } = useParams();
  return <h1>Usuario: {id}</h1>;
}
\`\`\`

### Rutas anidadas (Nested Routes)

\`\`\`jsx
function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="perfil" element={<Perfil />} />
        <Route path="ajustes" element={<Ajustes />} />
      </Route>
    </Routes>
  );
}
\`\`\`

### Outlet — renderizar rutas hijas

\`\`\`jsx
import { Outlet } from "react-router-dom";

function DashboardLayout() {
  return (
    <div>
      <Sidebar />
      <main>
        <Outlet /> {/* Aqui se renderizan las rutas hijas */}
      </main>
    </div>
  );
}
\`\`\`

### useSearchParams — query strings

\`\`\`jsx
import { useSearchParams } from "react-router-dom";

function Busqueda() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  return (
    <input
      value={query}
      onChange={(e) => setSearchParams({ q: e.target.value })}
    />
  );
}
// URL: /buscar?q=react
\`\`\`

> Outlet es como un "slot" donde React Router inyecta el componente hijo.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #89b4fa; border-radius: 8px; white-space: pre-line; }',
        editable: true,
      },
      order: 2,
    },
  ],
  exercises: [
    {
      id: "reco01-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "Que componente se usa para navegar sin recargar la pagina?",
      options: [
        { id: "a", text: "<a href>", isCorrect: false },
        { id: "b", text: "<Link to>", isCorrect: true },
        { id: "c", text: "<Navigate>", isCorrect: false },
        { id: "d", text: "<Redirect>", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Es el reemplazo de <a> en React Router.",
      explanation: "<Link to> navega sin recargar la pagina, manteniendo el estado de la aplicacion.",
    },
    {
      id: "reco01-ej-02",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 2,
      prompt: "Que hook se usa para obtener parametros de la URL como /usuario/:id?",
      options: [
        { id: "a", text: "useNavigate", isCorrect: false },
        { id: "b", text: "useLocation", isCorrect: false },
        { id: "c", text: "useParams", isCorrect: true },
        { id: "d", text: "useSearchParams", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Params = parametros de la ruta.",
      explanation: "useParams() devuelve un objeto con los parametros dinamicos definidos en la ruta (ej: :id).",
    },
    {
      id: "reco01-ej-03",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 3,
      prompt: "Para que sirve <Outlet /> en rutas anidadas?",
      options: [
        { id: "a", text: "Para redirigir a otra pagina", isCorrect: false },
        { id: "b", text: "Para renderizar el componente de la ruta hija activa", isCorrect: true },
        { id: "c", text: "Para mostrar un loading", isCorrect: false },
        { id: "d", text: "Para manejar errores 404", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Es como un slot donde va el contenido hijo.",
      explanation: "Outlet renderiza el componente que corresponde a la ruta hija actualmente activa.",
    },
    {
      id: "reco01-ej-04",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt: "Asocia cada hook con su funcion:",
      dragItems: [
        { id: "drag-1", content: "useNavigate", correctZone: "zone-nav" },
        { id: "drag-2", content: "useParams", correctZone: "zone-params" },
        { id: "drag-3", content: "useSearchParams", correctZone: "zone-query" },
      ],
      dropZones: [
        { id: "zone-nav", label: "Redirigir desde codigo" },
        { id: "zone-params", label: "Leer :id de la URL" },
        { id: "zone-query", label: "Leer ?q=valor de la URL" },
      ],
      validation: {
        type: "exact",
        answer: { "drag-1": "zone-nav", "drag-2": "zone-params", "drag-3": "zone-query" },
      },
      hint: "Navigate = navegar, Params = parametros de ruta, SearchParams = query string.",
      explanation: "Cada hook tiene un proposito especifico para manejar diferentes partes de la URL.",
    },
  ],
};
