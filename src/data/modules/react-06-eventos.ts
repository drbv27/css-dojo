import type { ModuleData } from "@/types";

export const reactEventosModule: ModuleData = {
  slug: "react-eventos",
  title: "Eventos en React",
  description:
    "Aprende a manejar interacciones del usuario con eventos en React: clics, formularios, teclado y mas.",
  order: 206,
  category: "react-fundamentals",
  icon: "mouse-pointer",
  dojo: "react",
  lessons: [
    {
      id: "react06-leccion-01",
      title: "Manejo de eventos basico",
      content: `## Eventos en React

Los eventos en React funcionan de forma similar a los eventos del DOM, pero con diferencias de sintaxis:

### Diferencias con HTML

| HTML | React (JSX) |
|---|---|
| \`onclick="handleClick()"\` | \`onClick={handleClick}\` |
| \`onchange\` | \`onChange\` |
| \`onsubmit\` | \`onSubmit\` |
| Strings | Funciones |
| minusculas | camelCase |

### Ejemplo basico

\`\`\`jsx
function Boton() {
  function handleClick() {
    alert("Hiciste clic!");
  }

  return <button onClick={handleClick}>Clic aqui</button>;
}
\`\`\`

### Errores comunes

\`\`\`jsx
// CORRECTO: pasar la funcion como referencia
<button onClick={handleClick}>Clic</button>

// INCORRECTO: esto ejecuta la funcion inmediatamente!
<button onClick={handleClick()}>Clic</button>
\`\`\`

### Funciones inline

Tambien puedes usar funciones de flecha directamente:

\`\`\`jsx
<button onClick={() => alert("Hola!")}>Clic</button>
\`\`\`

> **Convencion:** Los nombres de los handlers suelen empezar con "handle": \`handleClick\`, \`handleSubmit\`, \`handleChange\`.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
function App() {
  const [mensaje, setMensaje] = React.useState("Haz clic en un boton");

  function handleSaludo() {
    setMensaje("Hola! Hiciste clic en Saludar");
  }

  function handleDespedida() {
    setMensaje("Adios! Hasta la proxima");
  }

  return (
    <div>
      <h1>Eventos basicos</h1>
      <p style={{ fontSize: "20px", padding: "12px", background: "#f0f0f0", borderRadius: "8px" }}>
        {mensaje}
      </p>
      <div style={{ display: "flex", gap: "8px" }}>
        <button onClick={handleSaludo} style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}>
          Saludar
        </button>
        <button onClick={handleDespedida} style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}>
          Despedirse
        </button>
        <button onClick={() => setMensaje("Funcion inline!")} style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}>
          Inline
        </button>
      </div>
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
      id: "react06-leccion-02",
      title: "Eventos sinteticos y argumentos",
      content: `## Eventos sinteticos (SyntheticEvent)

React no usa los eventos nativos del DOM directamente. Crea **eventos sinteticos** que funcionan de forma identica en todos los navegadores.

### El objeto evento

\`\`\`jsx
function Input() {
  function handleChange(e) {
    console.log(e.target.value); // Valor del input
    console.log(e.type);          // "change"
  }

  return <input onChange={handleChange} />;
}
\`\`\`

El parametro \`e\` (o \`event\`) se pasa automaticamente al handler.

### preventDefault()

Para evitar el comportamiento por defecto del navegador:

\`\`\`jsx
function Formulario() {
  function handleSubmit(e) {
    e.preventDefault(); // Evita la recarga de la pagina
    // Procesar formulario...
  }

  return <form onSubmit={handleSubmit}>...</form>;
}
\`\`\`

### Pasar argumentos a handlers

\`\`\`jsx
// Con funcion de flecha
<button onClick={() => eliminar(item.id)}>X</button>

// Tambien valido
<button onClick={(e) => handleClick(item.id, e)}>X</button>
\`\`\`

### Eventos comunes en React

- **onClick** — clic del mouse
- **onChange** — cambio en inputs, selects, textareas
- **onSubmit** — envio de formulario
- **onKeyDown / onKeyUp** — presionar/soltar teclas
- **onFocus / onBlur** — ganar/perder el foco
- **onMouseEnter / onMouseLeave** — mouse entra/sale

> **Tip:** Siempre usa \`e.preventDefault()\` en formularios para evitar la recarga de pagina.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
function App() {
  const [log, setLog] = React.useState([]);

  const agregarLog = (msg) => {
    setLog(prev => [\`[\${new Date().toLocaleTimeString()}] \${msg}\`, ...prev].slice(0, 8));
  };

  return (
    <div>
      <h1>Eventos sinteticos</h1>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
        <button onClick={(e) => agregarLog(\`Click en posicion: \${e.clientX}, \${e.clientY}\`)} style={{ padding: "8px 16px", cursor: "pointer" }}>
          onClick (posicion)
        </button>
        <input
          placeholder="Escribe algo..."
          onKeyDown={(e) => agregarLog(\`Tecla presionada: \${e.key}\`)}
          style={{ padding: "8px" }}
        />
        <input
          placeholder="Focus/Blur..."
          onFocus={() => agregarLog("Input recibio el foco")}
          onBlur={() => agregarLog("Input perdio el foco")}
          style={{ padding: "8px" }}
        />
      </div>
      <div style={{ background: "#1e1e2e", color: "#a6e3a1", padding: "16px", borderRadius: "8px", fontFamily: "monospace", fontSize: "13px" }}>
        <p style={{ color: "#888", margin: "0 0 8px" }}>Event Log:</p>
        {log.length === 0 && <p style={{color: "#666"}}>Interactua con los elementos de arriba...</p>}
        {log.map((entry, i) => <div key={i}>{entry}</div>)}
      </div>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; }',
        editable: true,
      },
      order: 2,
    },
    {
      id: "react06-leccion-03",
      title: "Formularios con estado",
      content: `## Formularios controlados

Un **componente controlado** es un input cuyo valor es controlado por el estado de React:

\`\`\`jsx
function Formulario() {
  const [nombre, setNombre] = React.useState("");

  return (
    <input
      value={nombre}           // Valor del estado
      onChange={(e) => setNombre(e.target.value)}  // Actualizar estado
    />
  );
}
\`\`\`

### Por que controlados?

- **Una sola fuente de verdad:** el estado de React
- **Validacion en tiempo real** mientras el usuario escribe
- **Formatear** los datos antes de mostrarlos
- **Deshabilitar** el boton de envio hasta que sea valido

### Formulario completo

\`\`\`jsx
function Registro() {
  const [datos, setDatos] = React.useState({
    nombre: "",
    email: "",
    acepta: false
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setDatos(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Datos enviados:", datos);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="nombre" value={datos.nombre} onChange={handleChange} />
      <input name="email" value={datos.email} onChange={handleChange} />
      <input name="acepta" type="checkbox" checked={datos.acepta} onChange={handleChange} />
      <button type="submit">Enviar</button>
    </form>
  );
}
\`\`\`

> **Patron clave:** Usa \`[name]\` como propiedad computada para manejar multiples inputs con un solo handler.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
function FormularioContacto() {
  const [datos, setDatos] = React.useState({
    nombre: "",
    email: "",
    mensaje: "",
  });
  const [enviado, setEnviado] = React.useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setDatos(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setEnviado(true);
  }

  if (enviado) {
    return (
      <div style={{ padding: "20px", background: "#d4edda", borderRadius: "8px" }}>
        <h2>Gracias, {datos.nombre}!</h2>
        <p>Te contactaremos a {datos.email}</p>
        <button onClick={() => { setEnviado(false); setDatos({ nombre: "", email: "", mensaje: "" }); }} style={{ padding: "8px 16px", cursor: "pointer" }}>
          Enviar otro
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Contacto</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "400px" }}>
        <input name="nombre" value={datos.nombre} onChange={handleChange} placeholder="Nombre" required style={{ padding: "10px" }} />
        <input name="email" type="email" value={datos.email} onChange={handleChange} placeholder="Email" required style={{ padding: "10px" }} />
        <textarea name="mensaje" value={datos.mensaje} onChange={handleChange} placeholder="Mensaje" rows={4} required style={{ padding: "10px" }} />
        <button type="submit" style={{ padding: "12px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "16px" }}>
          Enviar
        </button>
      </div>
    </form>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<FormularioContacto />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; }',
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "react06-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "Como se escribe un evento de clic en JSX?",
      options: [
        { id: "a", text: "onclick={handleClick}", isCorrect: false },
        { id: "b", text: "onClick={handleClick}", isCorrect: true },
        { id: "c", text: "onClick=\"handleClick()\"", isCorrect: false },
        { id: "d", text: "on-click={handleClick}", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "En JSX los eventos usan camelCase y reciben funciones, no strings.",
      explanation:
        "En JSX, los eventos se escriben en camelCase (onClick, no onclick) y reciben una referencia a funcion como valor (entre llaves), no un string.",
    },
    {
      id: "react06-ej-02",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 2,
      prompt: "Cual es el error en este codigo? <button onClick={handleClick()}>Clic</button>",
      options: [
        { id: "a", text: "Falta el atributo type en el button", isCorrect: false },
        { id: "b", text: "handleClick() se ejecuta inmediatamente en vez de al hacer clic", isCorrect: true },
        { id: "c", text: "onClick deberia ser onclick", isCorrect: false },
        { id: "d", text: "No hay ningun error", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Observa los parentesis despues de handleClick.",
      explanation:
        "Al escribir handleClick() con parentesis, la funcion se ejecuta inmediatamente durante el renderizado. Se debe pasar como referencia sin parentesis: handleClick.",
    },
    {
      id: "react06-ej-03",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 3,
      prompt: "Completa el handler para prevenir el comportamiento por defecto del formulario:",
      codeTemplate: {
        html: "",
        cssPrefix: "function handleSubmit(e) {\n  e.",
        cssSuffix: "();\n  // procesar formulario\n}",
        blanks: ["preventDefault"],
      },
      validation: { type: "exact", answer: "preventDefault" },
      hint: "Es un metodo del objeto evento que evita la accion por defecto.",
      explanation:
        "e.preventDefault() evita el comportamiento por defecto del navegador. En formularios, previene la recarga de la pagina al enviar.",
    },
    {
      id: "react06-ej-04",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 4,
      prompt: "Que es un componente controlado en React?",
      options: [
        { id: "a", text: "Un componente que no acepta props", isCorrect: false },
        { id: "b", text: "Un input cuyo valor es manejado por el estado de React", isCorrect: true },
        { id: "c", text: "Un componente que controla a otros componentes", isCorrect: false },
        { id: "d", text: "Un componente que no se puede re-renderizar", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "El estado de React es la 'fuente de verdad' para el valor del input.",
      explanation:
        "Un componente controlado es un input cuyo valor esta vinculado al estado de React (value={estado}) y se actualiza mediante un handler (onChange). React es la fuente unica de verdad.",
    },
    {
      id: "react06-ej-05",
      type: "code-completion",
      difficulty: 2,
      xpReward: 15,
      order: 5,
      prompt: "Completa el input controlado para que actualice el estado 'nombre' al cambiar:",
      codeTemplate: {
        html: "",
        cssPrefix: "<input\n  value={nombre}\n  onChange={(e) => setNombre(e.",
        cssSuffix: ".value)}\n/>",
        blanks: ["target"],
      },
      validation: { type: "exact", answer: "target" },
      hint: "El valor del input se obtiene del elemento que disparo el evento.",
      explanation:
        "e.target es el elemento del DOM que disparo el evento (el input). e.target.value contiene el texto actual del input.",
    },
    {
      id: "react06-ej-06",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 6,
      prompt: "Asocia cada evento de React con su caso de uso principal:",
      dragItems: [
        { id: "drag-1", content: "onClick", correctZone: "zone-boton" },
        { id: "drag-2", content: "onChange", correctZone: "zone-input" },
        { id: "drag-3", content: "onSubmit", correctZone: "zone-form" },
        { id: "drag-4", content: "onKeyDown", correctZone: "zone-teclado" },
      ],
      dropZones: [
        { id: "zone-boton", label: "Clic en boton" },
        { id: "zone-input", label: "Cambio en input" },
        { id: "zone-form", label: "Envio de formulario" },
        { id: "zone-teclado", label: "Tecla presionada" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-boton",
          "drag-2": "zone-input",
          "drag-3": "zone-form",
          "drag-4": "zone-teclado",
        },
      },
      hint: "Cada evento tiene un caso de uso principal muy intuitivo.",
      explanation:
        "onClick se usa para clics, onChange para detectar cambios en inputs/selects, onSubmit para el envio de formularios, y onKeyDown para detectar teclas presionadas.",
    },
    {
      id: "react06-ej-07",
      type: "quiz",
      difficulty: 3,
      xpReward: 10,
      order: 7,
      prompt: "Como pasas un argumento adicional a un event handler en JSX?",
      options: [
        { id: "a", text: "onClick={handleDelete, item.id}", isCorrect: false },
        { id: "b", text: "onClick={() => handleDelete(item.id)}", isCorrect: true },
        { id: "c", text: "onClick={handleDelete(item.id)}", isCorrect: false },
        { id: "d", text: "onClick={handleDelete} args={item.id}", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Envuelve la llamada en una funcion de flecha para evitar la ejecucion inmediata.",
      explanation:
        "Para pasar argumentos a un handler, envuelvelo en una funcion de flecha: onClick={() => handleDelete(item.id)}. Esto crea una funcion nueva que se ejecutara solo al hacer clic.",
    },
  ],
};
