import type { ModuleData } from "@/types";

export const reactQueEsModule: ModuleData = {
  slug: "react-que-es-react",
  title: "Que es React?",
  description:
    "Descubre que es React, como funciona el Virtual DOM, y por que es la libreria mas popular para construir interfaces de usuario.",
  order: 201,
  category: "react-fundamentals",
  icon: "atom",
  dojo: "react",
  lessons: [
    {
      id: "react01-leccion-01",
      title: "Que es React?",
      content: `## Que es React?

**React** es una **libreria de JavaScript** creada por Facebook (ahora Meta) en 2013 para construir **interfaces de usuario** (UI) de forma declarativa y eficiente.

### Por que React?

- **Declarativo:** describes *que* quieres ver, no *como* lograrlo paso a paso
- **Basado en componentes:** divides tu UI en piezas reutilizables
- **Aprende una vez, escribe en cualquier lugar:** React Native para moviles, React para web

### React NO es un framework

A diferencia de Angular o Vue, React es solo una **libreria** enfocada en la capa de vista. Para routing, manejo de estado global, etc., necesitas librerias adicionales o frameworks como **Next.js**.

### Quien usa React?

Facebook, Instagram, Netflix, Airbnb, Uber, WhatsApp Web, Discord y miles de empresas mas.

> **Dato curioso:** React fue creado por Jordan Walke, un ingeniero de Facebook, y se uso por primera vez en el News Feed de Facebook en 2011.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
function App() {
  return (
    <div>
      <h1>Hola React!</h1>
      <p>Mi primera aplicacion con React</p>
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
      id: "react01-leccion-02",
      title: "SPA vs MPA y el Virtual DOM",
      content: `## SPA vs MPA

### MPA (Multi-Page Application)
En una aplicacion tradicional, cada vez que el usuario navega, el servidor envia una **pagina HTML completa**. Esto causa recargas completas del navegador.

### SPA (Single-Page Application)
React permite crear **SPAs**, donde se carga una sola pagina HTML y JavaScript se encarga de **actualizar dinamicamente** el contenido sin recargar. Esto da una experiencia mucho mas fluida.

## El Virtual DOM

El **DOM** (Document Object Model) es la representacion del HTML en memoria que el navegador usa para pintar la pagina. Manipularlo directamente es **lento**.

React resuelve esto con el **Virtual DOM**:

1. React mantiene una **copia ligera** del DOM en memoria (Virtual DOM)
2. Cuando el estado cambia, React crea un **nuevo Virtual DOM**
3. Compara el nuevo con el anterior (**diffing**)
4. Solo actualiza las **partes que realmente cambiaron** en el DOM real (**reconciliacion**)

> **Resultado:** actualizaciones rapidas y eficientes sin que tu tengas que preocuparte por manipular el DOM manualmente.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
function Contador() {
  const [cuenta, setCuenta] = React.useState(0);
  return (
    <div>
      <h2>Contador: {cuenta}</h2>
      <p>Solo este numero se actualiza en el DOM real</p>
      <button onClick={() => setCuenta(cuenta + 1)}>Incrementar</button>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<Contador />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; } button { padding: 8px 16px; font-size: 16px; cursor: pointer; margin-top: 8px; }',
        editable: true,
      },
      order: 2,
    },
    {
      id: "react01-leccion-03",
      title: "Ecosistema y herramientas",
      content: `## Ecosistema de React

React tiene un ecosistema enorme. Estas son las herramientas mas importantes:

### Crear un proyecto React

- **Vite** (recomendado): \`npm create vite@latest mi-app -- --template react\`
- **Create React App** (legado): \`npx create-react-app mi-app\`
- **Next.js**: framework completo con SSR, routing y mas

### Herramientas esenciales

| Herramienta | Funcion |
|---|---|
| **React DevTools** | Extension del navegador para inspeccionar componentes |
| **npm/yarn/pnpm** | Gestores de paquetes |
| **ESLint** | Analisis estatico de codigo |
| **Prettier** | Formateo de codigo |

### Introduccion a JSX

**JSX** (JavaScript XML) es una extension de sintaxis que permite escribir HTML dentro de JavaScript:

\`\`\`jsx
const elemento = <h1>Hola Mundo</h1>;
\`\`\`

Esto NO es HTML ni un string. Es JSX, y Babel lo transforma en llamadas a \`React.createElement()\`. Lo veremos en detalle en el proximo modulo.

> **Importante:** En este dojo, usaremos React directamente en el navegador con Babel para practicar. En proyectos reales, usaras Vite o Next.js.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
// JSX se convierte en React.createElement() internamente
const elemento = <h1 style={{color: "steelblue"}}>Esto es JSX!</h1>;

// Es equivalente a:
// React.createElement("h1", {style: {color: "steelblue"}}, "Esto es JSX!")

function App() {
  return (
    <div>
      {elemento}
      <p>JSX hace que escribir UI sea natural y legible.</p>
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
      id: "react01-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "Que es React?",
      options: [
        { id: "a", text: "Un lenguaje de programacion", isCorrect: false },
        { id: "b", text: "Una libreria de JavaScript para construir interfaces de usuario", isCorrect: true },
        { id: "c", text: "Un framework CSS", isCorrect: false },
        { id: "d", text: "Un sistema operativo", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "React se enfoca en la capa de vista.",
      explanation:
        "React es una libreria de JavaScript creada por Meta (Facebook) para construir interfaces de usuario de forma declarativa y basada en componentes.",
    },
    {
      id: "react01-ej-02",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt: "Que problema resuelve el Virtual DOM?",
      options: [
        { id: "a", text: "Hace que el CSS se cargue mas rapido", isCorrect: false },
        { id: "b", text: "Evita manipular el DOM real directamente, mejorando el rendimiento", isCorrect: true },
        { id: "c", text: "Permite escribir HTML sin etiquetas", isCorrect: false },
        { id: "d", text: "Reemplaza completamente al DOM del navegador", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Tiene que ver con el rendimiento al actualizar la pagina.",
      explanation:
        "El Virtual DOM mantiene una copia ligera del DOM en memoria. React compara los cambios (diffing) y solo actualiza las partes necesarias del DOM real, lo que es mucho mas eficiente.",
    },
    {
      id: "react01-ej-03",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 3,
      prompt: "Que es una SPA (Single-Page Application)?",
      options: [
        { id: "a", text: "Una aplicacion que solo tiene una pagina de contenido", isCorrect: false },
        { id: "b", text: "Una aplicacion que carga un solo HTML y actualiza el contenido dinamicamente sin recargar", isCorrect: true },
        { id: "c", text: "Una aplicacion que no usa JavaScript", isCorrect: false },
        { id: "d", text: "Una aplicacion que solo funciona en moviles", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Piensa en que pasa cuando navegas por la aplicacion.",
      explanation:
        "Una SPA carga una unica pagina HTML y JavaScript se encarga de actualizar el contenido de forma dinamica sin necesidad de recargar el navegador.",
    },
    {
      id: "react01-ej-04",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt: "Clasifica cada concepto segun corresponda a React o al desarrollo web tradicional:",
      dragItems: [
        { id: "drag-1", content: "Virtual DOM", correctZone: "zone-react" },
        { id: "drag-2", content: "document.getElementById()", correctZone: "zone-tradicional" },
        { id: "drag-3", content: "Componentes reutilizables", correctZone: "zone-react" },
        { id: "drag-4", content: "Recarga completa de pagina", correctZone: "zone-tradicional" },
      ],
      dropZones: [
        { id: "zone-react", label: "React" },
        { id: "zone-tradicional", label: "Tradicional" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-react",
          "drag-2": "zone-tradicional",
          "drag-3": "zone-react",
          "drag-4": "zone-tradicional",
        },
      },
      hint: "React introduce conceptos nuevos para evitar la manipulacion directa del DOM.",
      explanation:
        "React usa el Virtual DOM y componentes reutilizables. En el desarrollo tradicional, manipulas el DOM directamente con metodos como getElementById y las paginas se recargan completamente al navegar.",
    },
    {
      id: "react01-ej-05",
      type: "code-completion",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt: "Completa el codigo para renderizar un componente React en el elemento con id 'root':",
      codeTemplate: {
        html: "",
        cssPrefix: "ReactDOM.createRoot(document.getElementById(\"root\")).",
        cssSuffix: "(<App />);",
        blanks: ["render"],
      },
      validation: { type: "exact", answer: "render" },
      hint: "Es el metodo que le dice a React que 'pinte' el componente.",
      explanation:
        "ReactDOM.createRoot() crea la raiz de React y el metodo render() se usa para renderizar el componente principal dentro del elemento del DOM.",
    },
    {
      id: "react01-ej-06",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 6,
      prompt: "Cual es la herramienta recomendada actualmente para crear un nuevo proyecto React?",
      options: [
        { id: "a", text: "Create React App", isCorrect: false },
        { id: "b", text: "Webpack manual", isCorrect: false },
        { id: "c", text: "Vite", isCorrect: true },
        { id: "d", text: "Gulp", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Es una herramienta moderna y muy rapida para el desarrollo.",
      explanation:
        "Vite es la herramienta recomendada actualmente para crear proyectos React. Es mucho mas rapida que Create React App gracias a su uso de ES modules nativos durante el desarrollo.",
    },
  ],
};
