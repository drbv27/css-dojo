import type { ModuleData } from "@/types";

export const reactPatronesModule: ModuleData = {
  slug: "react-patrones",
  title: "Patrones de Diseno en React",
  description:
    "Domina los patrones mas usados: composicion, render props, HOCs, compound components y container/presentational.",
  order: 215,
  category: "react-advanced",
  icon: "puzzle",
  dojo: "react",
  lessons: [
    {
      id: "react15-leccion-01",
      title: "Composicion y Children",
      content: `## Patron de Composicion

La **composicion** es el patron fundamental de React. En vez de herencia, React usa composicion para reutilizar codigo.

### Children: el patron mas basico
\`\`\`jsx
function Card({ children, titulo }) {
  return (
    <div className="card">
      <h3>{titulo}</h3>
      <div className="card-body">{children}</div>
    </div>
  );
}

// Uso: puedes poner cualquier cosa dentro
<Card titulo="Mi Card">
  <p>Contenido libre</p>
  <button>Accion</button>
</Card>
\`\`\`

### Slots con props
\`\`\`jsx
function Layout({ header, sidebar, children }) {
  return (
    <div className="layout">
      <header>{header}</header>
      <aside>{sidebar}</aside>
      <main>{children}</main>
    </div>
  );
}

<Layout
  header={<NavBar />}
  sidebar={<Menu />}
>
  <Contenido />
</Layout>
\`\`\`

### Composicion vs Herencia
- React **no usa herencia** entre componentes
- La composicion es mas flexible y predecible
- Puedes pasar componentes como props (slots)

> **Principio:** Favorece la composicion sobre la herencia. Es mas flexible y mas facil de razonar.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const { useState } = React;

// Componente Card reutilizable con composicion
function Card({ children, titulo, accion }) {
  return (
    <div style={{border:'1px solid #ddd', borderRadius:8, overflow:'hidden', marginBottom:12}}>
      <div style={{background:'#89b4fa', color:'#1e1e2e', padding:'8px 12px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <strong>{titulo}</strong>
        {accion}
      </div>
      <div style={{padding:12}}>{children}</div>
    </div>
  );
}

// Modal reutilizable
function Modal({ children, visible, onClose }) {
  if (!visible) return null;
  return (
    <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:10}}>
      <div style={{background:'white', borderRadius:12, padding:20, maxWidth:300, width:'100%'}}>
        {children}
        <button onClick={onClose} style={{marginTop:8, width:'100%'}}>Cerrar</button>
      </div>
    </div>
  );
}

function App() {
  const [showModal, setShowModal] = useState(false);
  return (
    <div>
      <h3>Composicion con Children</h3>
      <Card titulo="Perfil" accion={<button style={{fontSize:12, padding:'2px 8px'}}>Editar</button>}>
        <p>Nombre: Diego</p>
        <p>Rol: Desarrollador</p>
      </Card>
      <Card titulo="Estadisticas">
        <p>Proyectos: 12</p>
        <p>Commits: 847</p>
      </Card>
      <button onClick={() => setShowModal(true)}>Abrir Modal</button>
      <Modal visible={showModal} onClose={() => setShowModal(false)}>
        <h3>Modal Compuesto</h3>
        <p>Este modal acepta cualquier children!</p>
      </Modal>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; } button { padding: 6px 14px; background: #89b4fa; color: #1e1e2e; border: none; border-radius: 6px; cursor: pointer; }',
        editable: true,
      },
      order: 1,
    },
    {
      id: "react15-leccion-02",
      title: "Render Props y HOCs",
      content: `## Render Props

Un **render prop** es una prop que es una funcion que retorna JSX. Permite compartir logica entre componentes.

\`\`\`jsx
function MouseTracker({ render }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e) => {
    setPos({ x: e.clientX, y: e.clientY });
  };

  return <div onMouseMove={handleMove}>{render(pos)}</div>;
}

// Uso
<MouseTracker render={({ x, y }) => (
  <p>Mouse en: {x}, {y}</p>
)} />
\`\`\`

## Higher-Order Components (HOC)

Un HOC es una funcion que recibe un componente y retorna un componente mejorado:

\`\`\`jsx
function withLoader(Component) {
  return function WithLoader({ isLoading, ...props }) {
    if (isLoading) return <p>Cargando...</p>;
    return <Component {...props} />;
  };
}

const ListaConLoader = withLoader(Lista);
<ListaConLoader isLoading={true} items={[]} />
\`\`\`

### Render Props vs HOCs vs Custom Hooks
| Patron | Cuando usar |
|--------|-------------|
| Custom Hooks | **Preferido** para compartir logica |
| Render Props | Cuando necesitas control sobre el render |
| HOCs | Legacy, menos comun en codigo moderno |

> **Nota:** Los custom hooks han reemplazado en gran medida a render props y HOCs en React moderno.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const { useState, useEffect } = React;

// Render Prop: comparte logica de fetch
function DataFetcher({ url, render }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [url]);

  return render({ data, loading, error });
}

// HOC: agrega borde y padding
function withCard(Component) {
  return function WithCard(props) {
    return (
      <div style={{border:'1px solid #ccc', borderRadius:8, padding:12, marginBottom:12}}>
        <Component {...props} />
      </div>
    );
  };
}

function UserInfo({ user }) {
  return (
    <div>
      <strong>{user.name}</strong>
      <p style={{fontSize:13, color:'#666', margin:0}}>{user.email}</p>
    </div>
  );
}

const UserCard = withCard(UserInfo);

function App() {
  return (
    <div>
      <h3>Render Props + HOC</h3>
      <DataFetcher
        url="https://jsonplaceholder.typicode.com/users?_limit=3"
        render={({ data, loading, error }) => {
          if (loading) return <p>Cargando usuarios...</p>;
          if (error) return <p style={{color:'red'}}>Error: {error}</p>;
          return (
            <div>
              {data.map(user => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          );
        }}
      />
      <p style={{fontSize:12, color:'#888'}}>
        DataFetcher usa render prop. UserCard es un HOC.
      </p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; }',
        editable: true,
      },
      order: 2,
    },
    {
      id: "react15-leccion-03",
      title: "Compound Components y patrones avanzados",
      content: `## Compound Components

Los **compound components** trabajan juntos compartiendo estado implicito. Piensa en \`<select>\` y \`<option>\`.

\`\`\`jsx
// API deseada:
<Tabs>
  <Tabs.List>
    <Tabs.Tab index={0}>Tab 1</Tabs.Tab>
    <Tabs.Tab index={1}>Tab 2</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel index={0}>Contenido 1</Tabs.Panel>
  <Tabs.Panel index={1}>Contenido 2</Tabs.Panel>
</Tabs>
\`\`\`

### Implementacion con Context
El componente padre provee el estado via Context, los hijos lo consumen:

\`\`\`jsx
const TabsContext = createContext();

function Tabs({ children }) {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <TabsContext.Provider value={{ activeIndex, setActiveIndex }}>
      {children}
    </TabsContext.Provider>
  );
}

Tabs.Tab = function Tab({ index, children }) {
  const { activeIndex, setActiveIndex } = useContext(TabsContext);
  return (
    <button onClick={() => setActiveIndex(index)}
      className={activeIndex === index ? 'active' : ''}>
      {children}
    </button>
  );
};
\`\`\`

### Controlled vs Uncontrolled Pattern
\`\`\`jsx
// Uncontrolled: maneja su propio estado
<Accordion defaultOpen={0} />

// Controlled: el padre controla el estado
<Accordion open={activePanel} onChange={setActivePanel} />
\`\`\`

> **Compound components** crean APIs declarativas y flexibles, como las que ves en librerias como Radix UI o Headless UI.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const { useState, useContext, createContext } = React;

// Compound Component: Accordion
const AccordionContext = createContext();

function Accordion({ children }) {
  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (index) => setOpenIndex(prev => prev === index ? null : index);
  return (
    <AccordionContext.Provider value={{ openIndex, toggle }}>
      <div style={{border:'1px solid #ddd', borderRadius:8, overflow:'hidden'}}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

Accordion.Item = function AccordionItem({ index, title, children }) {
  const { openIndex, toggle } = useContext(AccordionContext);
  const isOpen = openIndex === index;
  return (
    <div>
      <button onClick={() => toggle(index)}
        style={{
          width:'100%', padding:12, border:'none', borderBottom:'1px solid #eee',
          background: isOpen ? '#89b4fa' : '#f5f5f5',
          color: isOpen ? '#1e1e2e' : '#333',
          cursor:'pointer', textAlign:'left', fontWeight:600, display:'flex', justifyContent:'space-between'
        }}>
        {title}
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div style={{padding:12, background:'white'}}>
          {children}
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <div>
      <h3>Compound Components: Accordion</h3>
      <Accordion>
        <Accordion.Item index={0} title="Que es React?">
          <p>React es una libreria de JavaScript para construir interfaces de usuario.</p>
        </Accordion.Item>
        <Accordion.Item index={1} title="Que son los Hooks?">
          <p>Los Hooks son funciones que permiten usar estado y otras caracteristicas de React en componentes funcionales.</p>
        </Accordion.Item>
        <Accordion.Item index={2} title="Que es JSX?">
          <p>JSX es una extension de sintaxis que permite escribir HTML dentro de JavaScript.</p>
        </Accordion.Item>
      </Accordion>
      <p style={{fontSize:12, color:'#888', marginTop:8}}>
        Los items comparten estado via Context sin props explicitas.
      </p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; }',
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "react15-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "Que patron fundamental usa React en vez de herencia?",
      options: [
        { id: "a", text: "Singleton", isCorrect: false },
        { id: "b", text: "Composicion", isCorrect: true },
        { id: "c", text: "Herencia multiple", isCorrect: false },
        { id: "d", text: "Observer", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Es el principio de combinar componentes simples para crear complejos.",
      explanation: "React favorece la composicion: combinar componentes simples pasando children y props, en vez de crear jerarquias de herencia.",
    },
    {
      id: "react15-ej-02",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt: "Que es la prop especial 'children' en React?",
      options: [
        { id: "a", text: "Un array con los componentes padres", isCorrect: false },
        { id: "b", text: "El contenido que se pone entre las etiquetas del componente", isCorrect: true },
        { id: "c", text: "Una referencia a los elementos del DOM", isCorrect: false },
        { id: "d", text: "Los props de los componentes hijos", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Es lo que va entre <Componente>...aqui...</Componente>.",
      explanation: "children es una prop especial que contiene todo lo que se coloca entre las etiquetas de apertura y cierre de un componente.",
    },
    {
      id: "react15-ej-03",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 3,
      prompt: "Que es un Higher-Order Component (HOC)?",
      options: [
        { id: "a", text: "Un componente que esta en la parte superior del arbol", isCorrect: false },
        { id: "b", text: "Una funcion que recibe un componente y retorna uno nuevo mejorado", isCorrect: true },
        { id: "c", text: "Un componente con mas de 10 props", isCorrect: false },
        { id: "d", text: "Un componente de clase", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "HOC = funcion(componente) => componente mejorado.",
      explanation: "Un HOC es una funcion que toma un componente como argumento y retorna un nuevo componente con funcionalidad adicional.",
    },
    {
      id: "react15-ej-04",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt: "Asocia cada patron con su descripcion:",
      dragItems: [
        { id: "d1", content: "Composicion (children)", correctZone: "contenido" },
        { id: "d2", content: "Render Props", correctZone: "funcion" },
        { id: "d3", content: "HOC", correctZone: "envuelve" },
        { id: "d4", content: "Compound Components", correctZone: "implicito" },
      ],
      dropZones: [
        { id: "contenido", label: "Inyectar contenido flexible" },
        { id: "funcion", label: "Prop que es funcion retornando JSX" },
        { id: "envuelve", label: "Funcion que envuelve un componente" },
        { id: "implicito", label: "Componentes que comparten estado implicito" },
      ],
      validation: { type: "exact", answer: { d1: "contenido", d2: "funcion", d3: "envuelve", d4: "implicito" } },
      hint: "Cada patron tiene un mecanismo diferente para compartir o inyectar funcionalidad.",
      explanation: "Children inyecta contenido, render props usa funciones, HOCs envuelven componentes, y compound components comparten estado via Context implicitamente.",
    },
    {
      id: "react15-ej-05",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt: "En React moderno, que ha reemplazado en gran parte a Render Props y HOCs?",
      options: [
        { id: "a", text: "Componentes de clase", isCorrect: false },
        { id: "b", text: "Custom Hooks", isCorrect: true },
        { id: "c", text: "Context API", isCorrect: false },
        { id: "d", text: "Redux", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Una funcion que empieza con 'use'.",
      explanation: "Los custom hooks permiten compartir logica de forma mas limpia que render props y HOCs, sin modificar el arbol de componentes.",
    },
    {
      id: "react15-ej-06",
      type: "code-completion",
      difficulty: 2 ,
      xpReward: 20,
      order: 6,
      prompt: "Completa el render prop para mostrar las coordenadas del mouse:",
      codeTemplate: {
        html: "",
        cssPrefix: "<MouseTracker\n  render={({ x, y }) => (\n    <p>Mouse en: {x}, {",
        cssSuffix: "}</p>\n  )}\n/>",
        blanks: ["y"],
      },
      validation: { type: "exact", answer: "y" },
      hint: "La coordenada vertical del mouse.",
      explanation: "El render prop recibe un objeto con las coordenadas x e y del mouse, y retorna JSX que las muestra.",
    },
    {
      id: "react15-ej-07",
      type: "quiz",
      difficulty: 3 ,
      xpReward: 30,
      order: 7,
      prompt: "En el patron Compound Components, como comparten estado los componentes hijos?",
      options: [
        { id: "a", text: "A traves de props explicitas", isCorrect: false },
        { id: "b", text: "Via Context internamente", isCorrect: true },
        { id: "c", text: "Con variables globales", isCorrect: false },
        { id: "d", text: "Mediante herencia", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "El padre crea un contexto que los hijos consumen.",
      explanation: "En compound components, el componente padre crea un Context.Provider y los componentes hijos usan useContext para acceder al estado compartido.",
    },
    {
      id: "react15-ej-08",
      type: "quiz",
      difficulty: 3 ,
      xpReward: 30,
      order: 8,
      prompt: "Cual es la diferencia entre el patron Container y Presentational?",
      options: [
        { id: "a", text: "Container maneja logica y datos; Presentational solo renderiza UI", isCorrect: true },
        { id: "b", text: "Container es mas grande; Presentational es mas pequeno", isCorrect: false },
        { id: "c", text: "Container usa hooks; Presentational usa clases", isCorrect: false },
        { id: "d", text: "No hay diferencia real", isCorrect: false },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "Uno se encarga de los datos, otro de la presentacion visual.",
      explanation: "Container components manejan la logica, estado y datos. Presentational components solo reciben props y renderizan la UI, sin logica de negocio.",
    },
  ],
};
