import type { ModuleData } from "@/types";

export const reactEstadoModule: ModuleData = {
  slug: "react-estado-usestate",
  title: "Estado con useState",
  description:
    "Aprende a manejar datos dinamicos en tus componentes con el hook useState, el pilar fundamental del estado en React.",
  order: 205,
  category: "react-fundamentals",
  icon: "database",
  dojo: "react",
  lessons: [
    {
      id: "react05-leccion-01",
      title: "Que es el estado?",
      content: `## Que es el estado en React?

El **estado** (state) son datos que **pueden cambiar con el tiempo** y que, al cambiar, hacen que el componente se **re-renderice** (se vuelva a pintar).

### Diferencia entre props y estado

| Props | Estado |
|---|---|
| Vienen del padre | Son internos del componente |
| Solo lectura | Pueden cambiar |
| El hijo no las puede modificar | El componente puede actualizarlo |

### Por que necesitamos estado?

Las variables normales de JavaScript **no causan re-renderizado**:

\`\`\`jsx
function Contador() {
  let cuenta = 0; // Esto NO funciona como esperarias
  return (
    <div>
      <p>{cuenta}</p>
      <button onClick={() => { cuenta++ }}>+1</button>
    </div>
  );
}
\`\`\`

Al hacer clic, \`cuenta\` cambia en memoria, pero React **no sabe que debe re-renderizar** el componente. Para eso necesitamos \`useState\`.

> **Regla de oro:** Si un dato cambia y debe reflejarse en la UI, debe ser estado.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
function Contador() {
  // useState retorna [valorActual, funcionParaActualizar]
  const [cuenta, setCuenta] = React.useState(0);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Contador</h1>
      <p style={{ fontSize: "48px", margin: "16px 0" }}>{cuenta}</p>
      <button onClick={() => setCuenta(cuenta + 1)} style={{ padding: "8px 16px", fontSize: "18px", marginRight: "8px" }}>
        +1
      </button>
      <button onClick={() => setCuenta(cuenta - 1)} style={{ padding: "8px 16px", fontSize: "18px", marginRight: "8px" }}>
        -1
      </button>
      <button onClick={() => setCuenta(0)} style={{ padding: "8px 16px", fontSize: "18px" }}>
        Reset
      </button>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<Contador />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; } button { cursor: pointer; border-radius: 6px; border: 1px solid #ccc; }',
        editable: true,
      },
      order: 1,
    },
    {
      id: "react05-leccion-02",
      title: "useState en detalle",
      content: `## useState en detalle

### Sintaxis

\`\`\`jsx
const [estado, setEstado] = React.useState(valorInicial);
\`\`\`

- **estado**: el valor actual
- **setEstado**: funcion para actualizar el valor
- **valorInicial**: el valor con el que empieza (puede ser cualquier tipo)

### Convencion de nombres

\`\`\`jsx
const [nombre, setNombre] = React.useState("");
const [edad, setEdad] = React.useState(0);
const [activo, setActivo] = React.useState(true);
const [items, setItems] = React.useState([]);
\`\`\`

La convencion es \`[algo, setAlgo]\` — el setter siempre empieza con "set".

### Multiples estados

Un componente puede tener **multiples llamadas a useState**:

\`\`\`jsx
function Formulario() {
  const [nombre, setNombre] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [edad, setEdad] = React.useState(0);
  // ...
}
\`\`\`

### Reglas de los Hooks

1. Solo llamar Hooks **en el nivel superior** (no dentro de if, for, o funciones anidadas)
2. Solo llamar Hooks en **componentes de funcion** o en **custom hooks**

> **Por que?** React usa el **orden** de las llamadas a Hooks para saber cual es cual. Si el orden cambia entre renderizados, React se confunde.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
function TarjetaPerfil() {
  const [nombre, setNombre] = React.useState("Anonimo");
  const [color, setColor] = React.useState("#2563eb");
  const [likes, setLikes] = React.useState(0);

  return (
    <div style={{ border: \`3px solid \${color}\`, borderRadius: "12px", padding: "20px", maxWidth: "300px" }}>
      <h2 style={{ color }}>{nombre}</h2>
      <p>Likes: {likes}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Tu nombre"
          style={{ padding: "8px" }}
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <button onClick={() => setLikes(likes + 1)} style={{ padding: "8px", cursor: "pointer" }}>
          Me gusta ({likes})
        </button>
      </div>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<TarjetaPerfil />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; }',
        editable: true,
      },
      order: 2,
    },
    {
      id: "react05-leccion-03",
      title: "Estado con objetos y arrays",
      content: `## Estado con objetos y arrays

### Inmutabilidad

En React, **nunca debes mutar el estado directamente**. Siempre debes crear una **copia nueva**:

\`\`\`jsx
// MAL - mutacion directa
usuario.nombre = "Nuevo";
setUsuario(usuario); // React no detecta el cambio!

// BIEN - crear copia nueva
setUsuario({ ...usuario, nombre: "Nuevo" });
\`\`\`

### Estado con objetos

\`\`\`jsx
const [usuario, setUsuario] = React.useState({
  nombre: "Ana",
  edad: 25,
  email: "ana@email.com"
});

// Actualizar una propiedad (spread + sobrescribir)
setUsuario({ ...usuario, edad: 26 });
\`\`\`

### Estado con arrays

\`\`\`jsx
const [items, setItems] = React.useState(["React", "Vue"]);

// Agregar elemento
setItems([...items, "Angular"]);

// Eliminar elemento
setItems(items.filter(item => item !== "Vue"));

// Actualizar elemento
setItems(items.map(item =>
  item === "Vue" ? "Svelte" : item
));
\`\`\`

> **Clave:** Usa spread (\`...\`), \`map()\`, \`filter()\`, y \`concat()\` para crear copias nuevas. Evita \`push()\`, \`pop()\`, \`splice()\` y asignaciones directas.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
function ListaTareas() {
  const [tareas, setTareas] = React.useState([
    { id: 1, texto: "Aprender React", hecha: false },
    { id: 2, texto: "Practicar useState", hecha: false },
  ]);
  const [nueva, setNueva] = React.useState("");

  const agregarTarea = () => {
    if (!nueva.trim()) return;
    setTareas([...tareas, {
      id: Date.now(),
      texto: nueva,
      hecha: false
    }]);
    setNueva("");
  };

  const toggleTarea = (id) => {
    setTareas(tareas.map(t =>
      t.id === id ? { ...t, hecha: !t.hecha } : t
    ));
  };

  const eliminarTarea = (id) => {
    setTareas(tareas.filter(t => t.id !== id));
  };

  return (
    <div>
      <h1>Lista de tareas</h1>
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <input value={nueva} onChange={(e) => setNueva(e.target.value)} placeholder="Nueva tarea..." style={{ padding: "8px", flex: 1 }} />
        <button onClick={agregarTarea} style={{ padding: "8px 16px", cursor: "pointer" }}>Agregar</button>
      </div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tareas.map(tarea => (
          <li key={tarea.id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 0" }}>
            <input type="checkbox" checked={tarea.hecha} onChange={() => toggleTarea(tarea.id)} />
            <span style={{ textDecoration: tarea.hecha ? "line-through" : "none", flex: 1 }}>{tarea.texto}</span>
            <button onClick={() => eliminarTarea(tarea.id)} style={{ cursor: "pointer", color: "red", border: "none", background: "none" }}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<ListaTareas />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; }',
        editable: true,
      },
      order: 3,
    },
    {
      id: "react05-leccion-04",
      title: "Actualizaciones funcionales y lifting state up",
      content: `## Actualizaciones funcionales

Cuando el nuevo estado **depende del estado anterior**, usa la forma funcional:

\`\`\`jsx
// Puede fallar si se llama multiples veces rapidamente
setCuenta(cuenta + 1);

// Forma funcional - siempre correcta
setCuenta(prev => prev + 1);
\`\`\`

### Por que importa?

\`\`\`jsx
// Esto NO suma 3, suma solo 1:
setCuenta(cuenta + 1);
setCuenta(cuenta + 1);
setCuenta(cuenta + 1);

// Esto SI suma 3:
setCuenta(prev => prev + 1);
setCuenta(prev => prev + 1);
setCuenta(prev => prev + 1);
\`\`\`

React agrupa las actualizaciones (**batching**). La forma funcional garantiza que cada actualizacion use el valor mas reciente.

## Levantar estado (Lifting State Up)

Cuando dos componentes hermanos necesitan compartir estado, lo **levantas** al padre comun:

\`\`\`jsx
function Padre() {
  const [valor, setValor] = React.useState("");
  return (
    <>
      <InputHijo valor={valor} onCambio={setValor} />
      <VistaHijo texto={valor} />
    </>
  );
}
\`\`\`

El padre es el **dueno del estado** y lo comparte con los hijos via props.

> **Principio:** El estado debe vivir en el componente mas cercano que sea ancestro comun de todos los componentes que lo necesitan.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
// Lifting State Up: el padre maneja el estado compartido
function ConversorTemperatura() {
  const [celsius, setCelsius] = React.useState(0);

  const fahrenheit = (celsius * 9/5) + 32;
  const kelvin = celsius + 273.15;

  return (
    <div>
      <h1>Conversor de temperatura</h1>
      <div style={{ marginBottom: "16px" }}>
        <label>Celsius: </label>
        <input
          type="number"
          value={celsius}
          onChange={(e) => setCelsius(Number(e.target.value))}
          style={{ padding: "8px", fontSize: "16px", width: "100px" }}
        />
      </div>
      <Resultado label="Fahrenheit" valor={fahrenheit.toFixed(1)} color="#e74c3c" />
      <Resultado label="Kelvin" valor={kelvin.toFixed(1)} color="#2563eb" />
    </div>
  );
}

function Resultado({ label, valor, color }) {
  return (
    <div style={{ padding: "12px", margin: "8px 0", background: "#f5f5f5", borderLeft: \`4px solid \${color}\`, borderRadius: "4px" }}>
      <strong>{label}:</strong> {valor}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ConversorTemperatura />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; }',
        editable: true,
      },
      order: 4,
    },
  ],
  exercises: [
    {
      id: "react05-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "Que retorna el hook useState?",
      options: [
        { id: "a", text: "Solo el valor del estado", isCorrect: false },
        { id: "b", text: "Un array con el valor actual y una funcion para actualizarlo", isCorrect: true },
        { id: "c", text: "Un objeto con propiedades get y set", isCorrect: false },
        { id: "d", text: "Una promesa que resuelve con el estado", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Usamos desestructuracion de array para obtener dos cosas.",
      explanation:
        "useState retorna un array con exactamente dos elementos: [valorActual, funcionSetter]. Se usa desestructuracion de array: const [estado, setEstado] = useState(inicial).",
    },
    {
      id: "react05-ej-02",
      type: "code-completion",
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt: "Completa la declaracion de useState para inicializar un contador en 0:",
      codeTemplate: {
        html: "",
        cssPrefix: "const [cuenta, setCuenta] = React.",
        cssSuffix: "(0);",
        blanks: ["useState"],
      },
      validation: { type: "exact", answer: "useState" },
      hint: "Es un hook que empieza con 'use'.",
      explanation:
        "React.useState(0) crea una variable de estado llamada 'cuenta' con valor inicial 0, y una funcion 'setCuenta' para modificarla.",
    },
    {
      id: "react05-ej-03",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 3,
      prompt: "Por que una variable normal (let) no funciona como estado en React?",
      options: [
        { id: "a", text: "Porque JavaScript no permite cambiar variables con let", isCorrect: false },
        { id: "b", text: "Porque React no detecta el cambio y no re-renderiza el componente", isCorrect: true },
        { id: "c", text: "Porque let no se puede usar dentro de funciones", isCorrect: false },
        { id: "d", text: "Porque let es mas lento que useState", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "React necesita saber cuando algo cambia para actualizar la pantalla.",
      explanation:
        "Cuando cambias una variable con let, React no se entera del cambio y no re-renderiza el componente. useState notifica a React que el estado cambio y debe actualizar la UI.",
    },
    {
      id: "react05-ej-04",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt: "Cual es la forma CORRECTA de actualizar un objeto en el estado?",
      options: [
        { id: "a", text: "usuario.nombre = \"Nuevo\"; setUsuario(usuario);", isCorrect: false },
        { id: "b", text: "setUsuario({ ...usuario, nombre: \"Nuevo\" });", isCorrect: true },
        { id: "c", text: "setUsuario(usuario.nombre = \"Nuevo\");", isCorrect: false },
        { id: "d", text: "usuario = { nombre: \"Nuevo\" }; setUsuario(usuario);", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Debes crear un objeto nuevo, no mutar el existente.",
      explanation:
        "Para actualizar un objeto en el estado, debes crear una copia nueva con spread (...usuario) y sobrescribir la propiedad que cambia. Nunca mutes el objeto directamente.",
    },
    {
      id: "react05-ej-05",
      type: "code-completion",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt: "Completa el codigo para agregar un elemento a un array en el estado sin mutarlo:",
      codeTemplate: {
        html: "",
        cssPrefix: "setItems([",
        cssSuffix: "items, nuevoItem]);",
        blanks: ["..."],
      },
      validation: { type: "exact", answer: "..." },
      hint: "Usa el operador de expansion para copiar los elementos existentes.",
      explanation:
        "El operador spread (...items) crea una copia de todos los elementos existentes del array, y luego se agrega nuevoItem al final. Esto crea un array completamente nuevo.",
    },
    {
      id: "react05-ej-06",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 6,
      prompt: "Clasifica cada operacion segun si es CORRECTA o INCORRECTA para actualizar estado en React:",
      dragItems: [
        { id: "drag-1", content: "setItems([...items, nuevo])", correctZone: "zone-correcto" },
        { id: "drag-2", content: "items.push(nuevo)", correctZone: "zone-incorrecto" },
        { id: "drag-3", content: "setUser({...user, nombre: 'Ana'})", correctZone: "zone-correcto" },
        { id: "drag-4", content: "user.nombre = 'Ana'", correctZone: "zone-incorrecto" },
        { id: "drag-5", content: "setItems(items.filter(i => i.id !== id))", correctZone: "zone-correcto" },
        { id: "drag-6", content: "items.splice(0, 1)", correctZone: "zone-incorrecto" },
      ],
      dropZones: [
        { id: "zone-correcto", label: "Correcto (inmutable)" },
        { id: "zone-incorrecto", label: "Incorrecto (muta estado)" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-correcto",
          "drag-2": "zone-incorrecto",
          "drag-3": "zone-correcto",
          "drag-4": "zone-incorrecto",
          "drag-5": "zone-correcto",
          "drag-6": "zone-incorrecto",
        },
      },
      hint: "Las operaciones correctas siempre crean copias nuevas. Las incorrectas modifican el dato original.",
      explanation:
        "En React, el estado debe actualizarse de forma inmutable. Usa spread (...), map(), filter() para crear copias nuevas. Evita push(), splice(), y asignaciones directas que mutan el original.",
    },
    {
      id: "react05-ej-07",
      type: "code-completion",
      difficulty: 3 ,
      xpReward: 30,
      order: 7,
      prompt: "Completa la actualizacion funcional del estado que usa el valor anterior:",
      codeTemplate: {
        html: "",
        cssPrefix: "setCuenta(",
        cssSuffix: " => prev + 1);",
        blanks: ["prev"],
      },
      validation: { type: "exact", answer: "prev" },
      hint: "La funcion recibe el valor anterior como parametro.",
      explanation:
        "La forma funcional setCuenta(prev => prev + 1) recibe el estado anterior como argumento y retorna el nuevo estado. Es la forma mas segura cuando el nuevo valor depende del anterior.",
    },
    {
      id: "react05-ej-08",
      type: "quiz",
      difficulty: 3 ,
      xpReward: 30,
      order: 8,
      prompt: "Que significa 'levantar el estado' (lifting state up)?",
      options: [
        { id: "a", text: "Mover el estado a un componente hijo", isCorrect: false },
        { id: "b", text: "Mover el estado al componente padre comun mas cercano cuando varios hijos lo necesitan", isCorrect: true },
        { id: "c", text: "Eliminar el estado y usar solo props", isCorrect: false },
        { id: "d", text: "Guardar el estado en localStorage", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Cuando dos hermanos necesitan compartir estado, sube al ancestro comun.",
      explanation:
        "Lifting state up significa mover el estado al componente ancestro comun mas cercano de todos los componentes que lo necesitan. El padre maneja el estado y lo pasa a los hijos via props.",
    },
  ],
};
