import type { ModuleData } from "@/types";

export const reactRenderizadoModule: ModuleData = {
  slug: "react-renderizado-condicional",
  title: "Renderizado condicional",
  description:
    "Domina las diferentes formas de mostrar u ocultar elementos en React segun condiciones.",
  order: 207,
  category: "react-fundamentals",
  icon: "git-branch",
  dojo: "react",
  lessons: [
    {
      id: "react07-leccion-01",
      title: "Operador ternario y &&",
      content: `## Renderizado condicional en JSX

En React, frecuentemente necesitas mostrar diferentes cosas segun una condicion. Como JSX no soporta \`if/else\` directamente, usamos **expresiones**.

### Operador ternario

\`\`\`jsx
function Saludo({ logueado }) {
  return (
    <div>
      {logueado ? <h1>Bienvenido!</h1> : <h1>Inicia sesion</h1>}
    </div>
  );
}
\`\`\`

El ternario es ideal cuando tienes **dos opciones**: si es verdadero muestra A, si no muestra B.

### Operador && (AND logico)

\`\`\`jsx
function Alerta({ mostrar, mensaje }) {
  return (
    <div>
      {mostrar && <p className="alerta">{mensaje}</p>}
    </div>
  );
}
\`\`\`

\`&&\` es ideal cuando quieres mostrar algo **o nada**. Si la condicion es \`true\`, renderiza lo de la derecha. Si es \`false\`, no renderiza nada.

### Cuidado con && y numeros

\`\`\`jsx
// PELIGRO: si count es 0, muestra "0" en pantalla!
{count && <p>Tienes {count} items</p>}

// CORRECTO:
{count > 0 && <p>Tienes {count} items</p>}
\`\`\`

> **Regla:** Con \`&&\`, asegurate de que la parte izquierda sea un booleano real. Los numeros \`0\` y strings vacios \`""\` son falsy pero se muestran en pantalla.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
function App() {
  const [logueado, setLogueado] = React.useState(false);
  const [mensajes, setMensajes] = React.useState(3);

  return (
    <div>
      <h1>Renderizado condicional</h1>

      {/* Ternario: muestra A o B */}
      <div style={{ padding: "12px", background: logueado ? "#d4edda" : "#f8d7da", borderRadius: "8px", margin: "8px 0" }}>
        {logueado ? <p>Bienvenido, usuario!</p> : <p>No has iniciado sesion</p>}
      </div>

      {/* && muestra algo o nada */}
      {mensajes > 0 && (
        <div style={{ padding: "12px", background: "#cce5ff", borderRadius: "8px", margin: "8px 0" }}>
          Tienes {mensajes} mensajes sin leer
        </div>
      )}

      <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
        <button onClick={() => setLogueado(!logueado)} style={{ padding: "8px 16px", cursor: "pointer" }}>
          {logueado ? "Cerrar sesion" : "Iniciar sesion"}
        </button>
        <button onClick={() => setMensajes(0)} style={{ padding: "8px 16px", cursor: "pointer" }}>
          Marcar leidos
        </button>
        <button onClick={() => setMensajes(5)} style={{ padding: "8px 16px", cursor: "pointer" }}>
          Nuevos mensajes
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
      id: "react07-leccion-02",
      title: "if/else y retornos tempranos",
      content: `## if/else fuera de JSX

Aunque no puedes usar \`if/else\` dentro de JSX, puedes usarlo **antes del return**:

\`\`\`jsx
function Pagina({ estado }) {
  if (estado === "cargando") {
    return <p>Cargando...</p>;
  }

  if (estado === "error") {
    return <p>Ocurrio un error</p>;
  }

  return <p>Contenido cargado!</p>;
}
\`\`\`

### Retornos tempranos (Early returns)

Son una forma elegante de manejar casos especiales **al inicio** del componente:

\`\`\`jsx
function PerfilUsuario({ usuario }) {
  // Retorno temprano si no hay usuario
  if (!usuario) {
    return <p>No se encontro el usuario</p>;
  }

  // El codigo principal continua sin anidacion
  return (
    <div>
      <h2>{usuario.nombre}</h2>
      <p>{usuario.email}</p>
    </div>
  );
}
\`\`\`

### Retornar null

Si un componente no debe renderizar nada, retorna \`null\`:

\`\`\`jsx
function Notificacion({ visible, texto }) {
  if (!visible) return null;

  return <div className="notificacion">{texto}</div>;
}
\`\`\`

> **Tip:** Los retornos tempranos hacen tu codigo mas legible al evitar anidacion excesiva de if/else.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
function EstadoCarga({ estado }) {
  // Retornos tempranos para cada caso
  if (estado === "cargando") {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
        Cargando datos...
      </div>
    );
  }

  if (estado === "error") {
    return (
      <div style={{ padding: "20px", background: "#f8d7da", color: "#721c24", borderRadius: "8px" }}>
        Error: No se pudieron cargar los datos
      </div>
    );
  }

  if (estado === "vacio") {
    return (
      <div style={{ padding: "20px", background: "#fff3cd", color: "#856404", borderRadius: "8px" }}>
        No hay datos disponibles
      </div>
    );
  }

  // Caso exitoso
  return (
    <div style={{ padding: "20px", background: "#d4edda", color: "#155724", borderRadius: "8px" }}>
      Datos cargados correctamente!
    </div>
  );
}

function App() {
  const [estado, setEstado] = React.useState("cargando");

  return (
    <div>
      <h1>Retornos tempranos</h1>
      <EstadoCarga estado={estado} />
      <div style={{ display: "flex", gap: "8px", marginTop: "16px", flexWrap: "wrap" }}>
        {["cargando", "error", "vacio", "exito"].map(e => (
          <button key={e} onClick={() => setEstado(e)}
            style={{ padding: "8px 16px", cursor: "pointer", fontWeight: estado === e ? "bold" : "normal", background: estado === e ? "#2563eb" : "#f0f0f0", color: estado === e ? "white" : "#333", border: "none", borderRadius: "6px" }}>
            {e}
          </button>
        ))}
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
      id: "react07-leccion-03",
      title: "Clases CSS condicionales y patrones avanzados",
      content: `## Clases CSS condicionales

Una de las formas mas comunes de renderizado condicional es **aplicar clases CSS** segun el estado:

### Concatenacion de strings

\`\`\`jsx
<div className={\`tarjeta \${activo ? "tarjeta-activa" : ""}\`}>
\`\`\`

### Template literals

\`\`\`jsx
<button className={\`btn btn-\${variante}\`}>
  {texto}
</button>
\`\`\`

### Multiples clases condicionales

\`\`\`jsx
<div className={[
  "base",
  activo && "activo",
  grande && "grande",
  deshabilitado && "deshabilitado"
].filter(Boolean).join(" ")}>
\`\`\`

## Patron: componente de renderizado condicional

\`\`\`jsx
function MostrarSi({ condicion, children, fallback = null }) {
  return condicion ? children : fallback;
}

// Uso:
<MostrarSi condicion={logueado} fallback={<LoginForm />}>
  <Dashboard />
</MostrarSi>
\`\`\`

## Patron: switch con objeto

\`\`\`jsx
const iconos = {
  exito: "checkmark",
  error: "X",
  info: "i",
};

return <span>{iconos[tipo]}</span>;
\`\`\`

> **Tip:** Para proyectos grandes, la libreria \`clsx\` o \`classnames\` simplifica el manejo de clases condicionales.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
function Pestana({ etiquetas }) {
  const [activa, setActiva] = React.useState(0);

  const contenido = {
    0: "Contenido de la pestana Inicio. Aqui iria la pagina principal.",
    1: "Contenido de la pestana Productos. Lista de productos disponibles.",
    2: "Contenido de la pestana Contacto. Formulario de contacto.",
  };

  return (
    <div>
      <div style={{ display: "flex", borderBottom: "2px solid #ddd" }}>
        {etiquetas.map((etiqueta, index) => (
          <button
            key={index}
            onClick={() => setActiva(index)}
            style={{
              padding: "12px 24px",
              border: "none",
              borderBottom: activa === index ? "3px solid #2563eb" : "3px solid transparent",
              background: activa === index ? "#eff6ff" : "transparent",
              color: activa === index ? "#2563eb" : "#666",
              fontWeight: activa === index ? "bold" : "normal",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            {etiqueta}
          </button>
        ))}
      </div>
      <div style={{ padding: "20px" }}>
        {contenido[activa]}
      </div>
    </div>
  );
}

function App() {
  return (
    <div>
      <h1>Clases y estilos condicionales</h1>
      <Pestana etiquetas={["Inicio", "Productos", "Contacto"]} />
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
      id: "react07-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "Cual es la forma correcta de mostrar un elemento solo si una condicion es verdadera en JSX?",
      options: [
        { id: "a", text: "{if (condicion) <p>Texto</p>}", isCorrect: false },
        { id: "b", text: "{condicion && <p>Texto</p>}", isCorrect: true },
        { id: "c", text: "{condicion ? <p>Texto</p>}", isCorrect: false },
        { id: "d", text: "<if condicion><p>Texto</p></if>", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Necesitas un operador logico que evalua la parte derecha solo si la izquierda es verdadera.",
      explanation:
        "El operador && renderiza el elemento de la derecha solo si la condicion de la izquierda es verdadera. Es la forma mas comun de renderizar 'algo o nada' en JSX.",
    },
    {
      id: "react07-ej-02",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 2,
      prompt: "Cuando es mejor usar el operador ternario en vez de && para renderizado condicional?",
      options: [
        { id: "a", text: "Cuando necesitas mostrar una cosa u otra alternativa", isCorrect: true },
        { id: "b", text: "Cuando solo quieres mostrar algo o nada", isCorrect: false },
        { id: "c", text: "Cuando la condicion es un numero", isCorrect: false },
        { id: "d", text: "Siempre se debe usar ternario", isCorrect: false },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "El ternario tiene dos ramas: una para verdadero y otra para falso.",
      explanation:
        "El operador ternario (condicion ? A : B) es ideal cuando necesitas mostrar un elemento u otro alternativo. El operador && es mejor cuando quieres mostrar algo o nada.",
    },
    {
      id: "react07-ej-03",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 3,
      prompt: "Completa el renderizado condicional: si 'logueado' es true muestra 'Dashboard', si no muestra 'Login':",
      codeTemplate: {
        html: "",
        cssPrefix: "{logueado ",
        cssSuffix: " <Dashboard /> : <Login />}",
        blanks: ["?"],
      },
      validation: { type: "exact", answer: "?" },
      hint: "Es el operador que tiene tres partes: condicion, valor si verdadero, valor si falso.",
      explanation:
        "El operador ternario (?) permite elegir entre dos opciones: {condicion ? elementoSiTrue : elementoSiFalse}. Es la forma mas usada de renderizado condicional con dos alternativas.",
    },
    {
      id: "react07-ej-04",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 4,
      prompt: "Que problema tiene este codigo? {count && <p>Items: {count}</p>}",
      options: [
        { id: "a", text: "No tiene ningun problema", isCorrect: false },
        { id: "b", text: "Si count es 0, se muestra '0' en pantalla en vez de nada", isCorrect: true },
        { id: "c", text: "Causa un error de sintaxis", isCorrect: false },
        { id: "d", text: "No funciona con numeros", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Piensa en que pasa cuando count es 0. El numero 0 es falsy pero...",
      explanation:
        "Cuando count es 0, JavaScript evalua 0 && ... y retorna 0 (no false). React renderiza el numero 0 en pantalla. La solucion es usar count > 0 && ... para asegurar un booleano.",
    },
    {
      id: "react07-ej-05",
      type: "code-completion",
      difficulty: 2,
      xpReward: 15,
      order: 5,
      prompt: "Completa el retorno temprano para cuando no hay usuario:",
      codeTemplate: {
        html: "",
        cssPrefix: "function Perfil({ usuario }) {\n  if (!usuario) return ",
        cssSuffix: ";\n\n  return <h2>{usuario.nombre}</h2>;\n}",
        blanks: ["null"],
      },
      validation: { type: "exact", answer: "null" },
      hint: "Que valor retornas cuando un componente no debe renderizar nada?",
      explanation:
        "Retornar null indica a React que este componente no debe renderizar nada. Es util en retornos tempranos cuando no hay datos para mostrar.",
    },
    {
      id: "react07-ej-06",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 6,
      prompt: "Asocia cada patron de renderizado condicional con su caso de uso:",
      dragItems: [
        { id: "drag-1", content: "operador &&", correctZone: "zone-algo-nada" },
        { id: "drag-2", content: "operador ternario ?:", correctZone: "zone-a-o-b" },
        { id: "drag-3", content: "retorno temprano", correctZone: "zone-guard" },
        { id: "drag-4", content: "retornar null", correctZone: "zone-ocultar" },
      ],
      dropZones: [
        { id: "zone-algo-nada", label: "Mostrar algo o nada" },
        { id: "zone-a-o-b", label: "Mostrar A o B" },
        { id: "zone-guard", label: "Manejar casos especiales al inicio" },
        { id: "zone-ocultar", label: "No renderizar nada" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-algo-nada",
          "drag-2": "zone-a-o-b",
          "drag-3": "zone-guard",
          "drag-4": "zone-ocultar",
        },
      },
      hint: "Cada patron tiene un caso de uso donde es la mejor opcion.",
      explanation:
        "El operador && es para mostrar algo o nada, el ternario para elegir entre dos opciones, el retorno temprano para manejar casos especiales al inicio del componente, y null para no renderizar nada.",
    },
    {
      id: "react07-ej-07",
      type: "quiz",
      difficulty: 3,
      xpReward: 10,
      order: 7,
      prompt: "Cual es la forma correcta de aplicar una clase CSS condicional en JSX?",
      options: [
        { id: "a", text: "className={activo ? \"btn activo\" : \"btn\"}", isCorrect: true },
        { id: "b", text: "class={activo && \"activo\"}", isCorrect: false },
        { id: "c", text: "className={if (activo) \"btn activo\"}", isCorrect: false },
        { id: "d", text: "style.className = activo ? \"activo\" : \"\"", isCorrect: false },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "Usa className con una expresion ternaria o template literal.",
      explanation:
        "className acepta un string, y puedes usar una expresion ternaria para elegir entre dos strings de clases. Tambien puedes usar template literals: className={`btn \${activo ? 'activo' : ''}`}.",
    },
  ],
};
