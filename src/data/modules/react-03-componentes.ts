import type { ModuleData } from "@/types";

export const reactComponentesModule: ModuleData = {
  slug: "react-componentes",
  title: "Componentes en React",
  description:
    "Aprende a crear, organizar y componer componentes, los bloques fundamentales de toda aplicacion React.",
  order: 203,
  category: "react-fundamentals",
  icon: "blocks",
  dojo: "react",
  lessons: [
    {
      id: "react03-leccion-01",
      title: "Que es un componente?",
      content: `## Que es un componente?

Un **componente** en React es una **funcion de JavaScript que retorna JSX**. Es el bloque basico de construccion de cualquier aplicacion React.

### Componentes de funcion

\`\`\`jsx
function Saludo() {
  return <h1>Hola Mundo!</h1>;
}
\`\`\`

### Reglas de los componentes

1. **Nombre en PascalCase:** siempre empiezan con mayuscula (\`MiComponente\`, no \`miComponente\`)
2. **Retornan JSX:** deben devolver un elemento JSX (o null)
3. **Son funciones puras** (idealmente): dado el mismo input, producen el mismo output

### Por que PascalCase?

React distingue entre elementos HTML y componentes por la primera letra:

\`\`\`jsx
<div />    // React crea un elemento HTML div
<Saludo /> // React invoca el componente Saludo
\`\`\`

### Componentes de clase (legado)

Antes de React 16.8, se usaban clases. Hoy se prefieren **funciones con Hooks**:

\`\`\`jsx
// No recomendado para codigo nuevo
class Saludo extends React.Component {
  render() {
    return <h1>Hola!</h1>;
  }
}
\`\`\`

> **En este dojo trabajaremos siempre con componentes de funcion**, que son el estandar actual.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
// Un componente es una funcion que retorna JSX
function Tarjeta() {
  return (
    <div style={{
      border: "2px solid steelblue",
      borderRadius: "8px",
      padding: "16px",
      maxWidth: "300px"
    }}>
      <h2>Mi primer componente</h2>
      <p>Los componentes son funciones que retornan JSX.</p>
    </div>
  );
}

function App() {
  return (
    <div>
      <h1>Componentes React</h1>
      <Tarjeta />
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; }',
        editable: true,
      },
      order: 1,
    },
    {
      id: "react03-leccion-02",
      title: "Composicion de componentes",
      content: `## Composicion de componentes

La verdadera potencia de React esta en **componer** componentes: usar componentes dentro de otros componentes.

### Ejemplo basico

\`\`\`jsx
function Titulo() {
  return <h1>Mi App</h1>;
}

function Contenido() {
  return <p>Bienvenido a la aplicacion.</p>;
}

function App() {
  return (
    <div>
      <Titulo />
      <Contenido />
    </div>
  );
}
\`\`\`

### Reutilizacion

Un componente se puede usar **multiples veces**:

\`\`\`jsx
function App() {
  return (
    <div>
      <Tarjeta />
      <Tarjeta />
      <Tarjeta />
    </div>
  );
}
\`\`\`

### Anidacion profunda

Los componentes pueden anidarse tanto como necesites:

\`\`\`
App
  Header
    Logo
    Navegacion
      NavItem
  Main
    ListaProductos
      ProductoCard
  Footer
\`\`\`

> **Principio clave:** Divide tu UI en componentes pequenos y enfocados. Cada componente debe hacer **una sola cosa** bien.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
function Header() {
  return (
    <header style={{ background: "#2563eb", color: "white", padding: "12px 16px" }}>
      <h1 style={{ margin: 0 }}>Mi App</h1>
    </header>
  );
}

function Tarjeta({ titulo, texto }) {
  return (
    <div style={{
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "16px",
      margin: "8px 0"
    }}>
      <h3>{titulo}</h3>
      <p>{texto}</p>
    </div>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: "1px solid #ddd", padding: "12px", color: "#666", marginTop: "16px" }}>
      <p>Dev Dojo 2025</p>
    </footer>
  );
}

function App() {
  return (
    <div>
      <Header />
      <div style={{ padding: "16px" }}>
        <Tarjeta titulo="Componente 1" texto="Los componentes se reutilizan facilmente." />
        <Tarjeta titulo="Componente 2" texto="Cada tarjeta es el mismo componente." />
        <Tarjeta titulo="Componente 3" texto="Pero con datos diferentes!" />
      </div>
      <Footer />
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
</script>`,
        css: '#root { font-family: system-ui; }',
        editable: true,
      },
      order: 2,
    },
    {
      id: "react03-leccion-03",
      title: "Children y estructura de archivos",
      content: `## La prop children

\`children\` es una prop especial que contiene **todo lo que pones entre las etiquetas** de un componente:

\`\`\`jsx
function Caja({ children }) {
  return (
    <div style={{ border: "2px solid blue", padding: "16px" }}>
      {children}
    </div>
  );
}

// Uso:
<Caja>
  <h2>Soy un hijo</h2>
  <p>Yo tambien!</p>
</Caja>
\`\`\`

\`children\` puede ser texto, elementos JSX, otros componentes, o incluso expresiones.

### Componentes wrapper

Un patron muy comun es crear componentes que **envuelven** contenido:

\`\`\`jsx
function Layout({ children }) {
  return (
    <div className="layout">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
\`\`\`

## Estructura de archivos

En proyectos reales, cada componente va en su propio archivo:

\`\`\`
src/
  components/
    Header.jsx
    Footer.jsx
    Tarjeta.jsx
  App.jsx
\`\`\`

Y se importan asi:

\`\`\`jsx
import Header from "./components/Header";
import Tarjeta from "./components/Tarjeta";
\`\`\`

> **Convencion:** Un archivo por componente, nombre del archivo igual al componente, en PascalCase.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
// Componente wrapper que usa children
function Caja({ children, color }) {
  return (
    <div style={{
      border: \`2px solid \${color || "#333"}\`,
      borderRadius: "8px",
      padding: "16px",
      margin: "8px 0"
    }}>
      {children}
    </div>
  );
}

function Alerta({ children }) {
  return (
    <Caja color="#e74c3c">
      <strong style={{ color: "#e74c3c" }}>Alerta:</strong>
      <span> {children}</span>
    </Caja>
  );
}

function App() {
  return (
    <div>
      <h1>Prop children</h1>
      <Caja color="steelblue">
        <h3>Soy contenido dentro de Caja</h3>
        <p>Todo esto es children del componente Caja.</p>
      </Caja>
      <Alerta>Este es un mensaje de alerta importante.</Alerta>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; }',
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "react03-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "Cual es la convencion de nombres para componentes en React?",
      options: [
        { id: "a", text: "camelCase (miComponente)", isCorrect: false },
        { id: "b", text: "PascalCase (MiComponente)", isCorrect: true },
        { id: "c", text: "snake_case (mi_componente)", isCorrect: false },
        { id: "d", text: "kebab-case (mi-componente)", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "La primera letra debe ser mayuscula para que React lo reconozca como componente.",
      explanation:
        "Los componentes en React deben usar PascalCase (primera letra de cada palabra en mayuscula). Esto permite a React distinguir entre componentes y elementos HTML nativos.",
    },
    {
      id: "react03-ej-02",
      type: "code-completion",
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt: "Completa la definicion de un componente de funcion en React:",
      codeTemplate: {
        html: "",
        cssPrefix: "",
        cssSuffix: " Saludo() {\n  return <h1>Hola!</h1>;\n}",
        blanks: ["function"],
      },
      validation: { type: "exact", answer: "function" },
      hint: "Un componente de React es una funcion de JavaScript.",
      explanation:
        "Un componente de funcion es simplemente una funcion de JavaScript que retorna JSX. Se declara con la palabra clave function seguida del nombre en PascalCase.",
    },
    {
      id: "react03-ej-03",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 3,
      prompt: "Como se usa un componente llamado MiBoton dentro de JSX?",
      options: [
        { id: "a", text: "<mi-boton />", isCorrect: false },
        { id: "b", text: "<MiBoton />", isCorrect: true },
        { id: "c", text: "MiBoton()", isCorrect: false },
        { id: "d", text: "{MiBoton}", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Se usa como si fuera una etiqueta HTML pero con el nombre del componente.",
      explanation:
        "Los componentes se usan en JSX como etiquetas HTML: <MiBoton />. El nombre debe ser exactamente igual al de la funcion, incluyendo mayusculas.",
    },
    {
      id: "react03-ej-04",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt: "Que es la prop 'children' en React?",
      options: [
        { id: "a", text: "Una prop que lista los componentes hijos del DOM", isCorrect: false },
        { id: "b", text: "El contenido que se coloca entre las etiquetas de apertura y cierre de un componente", isCorrect: true },
        { id: "c", text: "Un metodo para crear componentes nuevos", isCorrect: false },
        { id: "d", text: "Una funcion para recorrer arrays", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Piensa en lo que va entre <Componente>...aqui...</Componente>.",
      explanation:
        "La prop children contiene todo lo que se coloca entre las etiquetas de apertura y cierre de un componente. Puede ser texto, otros elementos JSX, o componentes.",
    },
    {
      id: "react03-ej-05",
      type: "code-completion",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt: "Completa el componente para que renderice su contenido hijo dentro de un div:",
      codeTemplate: {
        html: "",
        cssPrefix: "function Caja({ ",
        cssSuffix: " }) {\n  return <div className=\"caja\">{children}</div>;\n}",
        blanks: ["children"],
      },
      validation: { type: "exact", answer: "children" },
      hint: "Es una prop especial que contiene lo que va entre las etiquetas del componente.",
      explanation:
        "La prop children se desestructura como cualquier otra prop. Contiene automaticamente todo el contenido que se pasa entre las etiquetas del componente.",
    },
    {
      id: "react03-ej-06",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 6,
      prompt: "Ordena la jerarquia de componentes de una aplicacion tipica, del mas externo al mas interno:",
      dragItems: [
        { id: "drag-1", content: "App", correctZone: "zone-1" },
        { id: "drag-2", content: "Layout", correctZone: "zone-2" },
        { id: "drag-3", content: "ListaProductos", correctZone: "zone-3" },
        { id: "drag-4", content: "ProductoCard", correctZone: "zone-4" },
      ],
      dropZones: [
        { id: "zone-1", label: "Nivel 1 (raiz)" },
        { id: "zone-2", label: "Nivel 2" },
        { id: "zone-3", label: "Nivel 3" },
        { id: "zone-4", label: "Nivel 4 (mas interno)" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-1",
          "drag-2": "zone-2",
          "drag-3": "zone-3",
          "drag-4": "zone-4",
        },
      },
      hint: "App es siempre el componente raiz. Los componentes mas especificos estan mas adentro.",
      explanation:
        "En una aplicacion React tipica, App es el componente raiz, que contiene un Layout, dentro del cual hay secciones como ListaProductos, y cada producto individual es un ProductoCard.",
    },
    {
      id: "react03-ej-07",
      type: "quiz",
      difficulty: 3 ,
      xpReward: 30,
      order: 7,
      prompt: "Por que React recomienda componentes de funcion sobre componentes de clase?",
      options: [
        { id: "a", text: "Las funciones son mas rapidas que las clases en JavaScript", isCorrect: false },
        { id: "b", text: "Los Hooks solo funcionan en componentes de funcion, haciendo el codigo mas simple y reutilizable", isCorrect: true },
        { id: "c", text: "Los componentes de clase fueron eliminados de React", isCorrect: false },
        { id: "d", text: "Las funciones usan menos memoria", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Piensa en la feature que se introdujo en React 16.8.",
      explanation:
        "Desde React 16.8, los Hooks permiten usar estado y otras features en componentes de funcion, resultando en codigo mas simple y facil de reutilizar. Los componentes de clase siguen funcionando pero ya no se recomiendan para codigo nuevo.",
    },
  ],
};
