import type { ModuleData } from "@/types";

export const reactPropsModule: ModuleData = {
  slug: "react-props",
  title: "Props en React",
  description:
    "Aprende a pasar datos entre componentes usando props, el mecanismo fundamental de comunicacion en React.",
  order: 204,
  category: "react-fundamentals",
  icon: "arrow-right",
  dojo: "react",
  lessons: [
    {
      id: "react04-leccion-01",
      title: "Que son las props?",
      content: `## Que son las props?

**Props** (abreviatura de "properties") son la forma de **pasar datos de un componente padre a un componente hijo**. Son como los argumentos de una funcion.

### Sintaxis basica

\`\`\`jsx
// Padre pasa datos via props
<Saludo nombre="Ana" edad={25} />

// Hijo recibe props como un objeto
function Saludo(props) {
  return <h1>Hola, {props.nombre}! Tienes {props.edad} anios.</h1>;
}
\`\`\`

### Desestructuracion de props (recomendado)

\`\`\`jsx
function Saludo({ nombre, edad }) {
  return <h1>Hola, {nombre}! Tienes {edad} anios.</h1>;
}
\`\`\`

### Regla fundamental: las props son de solo lectura

Un componente **nunca debe modificar sus propias props**. Las props fluyen en una sola direccion: de padre a hijo.

\`\`\`jsx
// NUNCA hagas esto:
function Saludo({ nombre }) {
  nombre = "Otro"; // ERROR conceptual!
  return <h1>{nombre}</h1>;
}
\`\`\`

> **Piensa en las props como parametros de una funcion:** los recibes, los usas, pero no los modificas.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
function PerfilUsuario({ nombre, rol, activo }) {
  return (
    <div style={{
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "16px",
      margin: "8px 0"
    }}>
      <h3>{nombre}</h3>
      <p>Rol: {rol}</p>
      <p>Estado: {activo ? "Activo" : "Inactivo"}</p>
    </div>
  );
}

function App() {
  return (
    <div>
      <h1>Equipo de desarrollo</h1>
      <PerfilUsuario nombre="Ana" rol="Frontend" activo={true} />
      <PerfilUsuario nombre="Carlos" rol="Backend" activo={true} />
      <PerfilUsuario nombre="Maria" rol="Disenadora" activo={false} />
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
      id: "react04-leccion-02",
      title: "Tipos de datos en props",
      content: `## Tipos de datos que puedes pasar como props

### Strings
Se pasan con comillas (sin llaves):
\`\`\`jsx
<Componente titulo="Hola Mundo" />
\`\`\`

### Numeros, booleanos, arrays, objetos
Se pasan con llaves:
\`\`\`jsx
<Componente
  edad={25}
  activo={true}
  colores={["rojo", "azul"]}
  usuario={{ nombre: "Ana", rol: "dev" }}
/>
\`\`\`

### Funciones
\`\`\`jsx
<Boton onClick={() => alert("Clic!")} />
\`\`\`

### Shorthand para booleanos true
\`\`\`jsx
// Estas dos formas son equivalentes:
<Input deshabilitado={true} />
<Input deshabilitado />
\`\`\`

### Spread de props
Puedes pasar todas las propiedades de un objeto con el operador spread:
\`\`\`jsx
const datos = { nombre: "Ana", edad: 25, rol: "dev" };
<Perfil {...datos} />
// Equivale a: <Perfil nombre="Ana" edad={25} rol="dev" />
\`\`\`

> **Tip:** El spread de props es util pero usalo con moderacion. Puede hacer dificil saber que props recibe un componente.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
function Producto({ nombre, precio, categorias, enStock, onComprar }) {
  return (
    <div style={{
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "16px",
      margin: "8px 0",
      opacity: enStock ? 1 : 0.5
    }}>
      <h3>{nombre}</h3>
      <p style={{ fontSize: "24px", color: "#2563eb" }}>\${precio}</p>
      <p>Categorias: {categorias.join(", ")}</p>
      <p>{enStock ? "En stock" : "Agotado"}</p>
      <button
        onClick={onComprar}
        disabled={!enStock}
        style={{ padding: "8px 16px", cursor: enStock ? "pointer" : "not-allowed" }}
      >
        Comprar
      </button>
    </div>
  );
}

function App() {
  return (
    <div>
      <h1>Tienda</h1>
      <Producto
        nombre="Laptop Pro"
        precio={999}
        categorias={["tecnologia", "computacion"]}
        enStock={true}
        onComprar={() => alert("Laptop agregada al carrito!")}
      />
      <Producto
        nombre="Teclado Mecanico"
        precio={150}
        categorias={["accesorios"]}
        enStock={false}
        onComprar={() => {}}
      />
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
      id: "react04-leccion-03",
      title: "Valores por defecto",
      content: `## Valores por defecto en props

Puedes asignar **valores por defecto** a las props usando la sintaxis de desestructuracion de JavaScript:

\`\`\`jsx
function Boton({ texto = "Clic aqui", color = "blue", tamano = "md" }) {
  return (
    <button style={{ backgroundColor: color }}>
      {texto}
    </button>
  );
}

// Uso sin pasar props (usa valores por defecto):
<Boton />

// Uso sobrescribiendo algunos valores:
<Boton texto="Enviar" color="green" />
\`\`\`

### defaultProps (legado)

Antes se usaba \`defaultProps\`, pero ya no se recomienda:

\`\`\`jsx
// No recomendado
Boton.defaultProps = {
  texto: "Clic aqui",
  color: "blue"
};
\`\`\`

### Props opcionales vs requeridas

En JavaScript puro no hay forma de forzar que una prop sea requerida. Para eso se usa **TypeScript** o **PropTypes**:

\`\`\`jsx
// Con PropTypes (basico)
import PropTypes from 'prop-types';

Boton.propTypes = {
  texto: PropTypes.string,
  onClick: PropTypes.func.isRequired
};
\`\`\`

> **Buena practica:** Siempre proporciona valores por defecto para props opcionales. Esto evita errores cuando el componente se usa sin pasar todas las props.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
function Boton({ texto = "Clic aqui", variante = "primary", tamano = "md" }) {
  const estilos = {
    primary: { backgroundColor: "#2563eb", color: "white" },
    secondary: { backgroundColor: "#6b7280", color: "white" },
    danger: { backgroundColor: "#dc2626", color: "white" },
  };
  const tamanos = {
    sm: { padding: "4px 8px", fontSize: "12px" },
    md: { padding: "8px 16px", fontSize: "14px" },
    lg: { padding: "12px 24px", fontSize: "18px" },
  };

  return (
    <button style={{
      ...estilos[variante],
      ...tamanos[tamano],
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      margin: "4px"
    }}>
      {texto}
    </button>
  );
}

function App() {
  return (
    <div>
      <h1>Componente Boton reutilizable</h1>
      <div>
        <Boton />
        <Boton texto="Guardar" variante="primary" tamano="lg" />
        <Boton texto="Cancelar" variante="secondary" />
        <Boton texto="Eliminar" variante="danger" tamano="sm" />
      </div>
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
    {
      id: "react04-leccion-04",
      title: "Prop drilling",
      content: `## Prop drilling

**Prop drilling** ocurre cuando necesitas pasar datos a traves de **muchos niveles** de componentes que no los necesitan directamente.

### El problema

\`\`\`jsx
function App() {
  const usuario = { nombre: "Ana" };
  return <Layout usuario={usuario} />;     // Nivel 1
}

function Layout({ usuario }) {
  return <Sidebar usuario={usuario} />;    // Nivel 2 (no usa usuario)
}

function Sidebar({ usuario }) {
  return <Perfil usuario={usuario} />;     // Nivel 3 (no usa usuario)
}

function Perfil({ usuario }) {
  return <h2>{usuario.nombre}</h2>;        // Nivel 4 (quien realmente lo usa)
}
\`\`\`

Layout y Sidebar **solo pasan la prop sin usarla**. Esto es prop drilling.

### Por que es un problema?

- Hace el codigo **dificil de mantener**
- Los componentes intermedios se acoplan a datos que no necesitan
- Cambiar la estructura de datos requiere modificar muchos componentes

### Soluciones (las veremos mas adelante)

1. **Context API** — compartir datos sin pasar props manualmente
2. **Composicion** — reestructurar componentes para evitar niveles innecesarios
3. **Librerias de estado global** — Redux, Zustand, etc.

> **Por ahora:** el prop drilling es normal y aceptable para 2-3 niveles. Solo se vuelve problema con niveles mas profundos.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
// Ejemplo de prop drilling (aceptable en pocos niveles)
function Avatar({ nombre, tamano }) {
  const inicial = nombre.charAt(0).toUpperCase();
  return (
    <div style={{
      width: tamano, height: tamano,
      borderRadius: "50%",
      backgroundColor: "#2563eb", color: "white",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: parseInt(tamano) / 2
    }}>
      {inicial}
    </div>
  );
}

function InfoUsuario({ nombre, email }) {
  return (
    <div style={{ display: "flex", gap: "12px", alignItems: "center", padding: "12px", border: "1px solid #ddd", borderRadius: "8px", margin: "8px 0" }}>
      <Avatar nombre={nombre} tamano="48px" />
      <div>
        <strong>{nombre}</strong>
        <p style={{ margin: 0, color: "#666" }}>{email}</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <div>
      <h1>Flujo de props</h1>
      <p>App pasa nombre a InfoUsuario, que pasa nombre a Avatar.</p>
      <InfoUsuario nombre="Ana Garcia" email="ana@email.com" />
      <InfoUsuario nombre="Carlos Lopez" email="carlos@email.com" />
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; }',
        editable: true,
      },
      order: 4,
    },
  ],
  exercises: [
    {
      id: "react04-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "Que son las props en React?",
      options: [
        { id: "a", text: "Variables globales de la aplicacion", isCorrect: false },
        { id: "b", text: "Datos que un componente padre pasa a un componente hijo", isCorrect: true },
        { id: "c", text: "Estilos CSS del componente", isCorrect: false },
        { id: "d", text: "Eventos del navegador", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Las props fluyen en una sola direccion.",
      explanation:
        "Las props son el mecanismo para pasar datos de un componente padre a un componente hijo. Fluyen de arriba hacia abajo (unidireccional) y son de solo lectura.",
    },
    {
      id: "react04-ej-02",
      type: "code-completion",
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt: "Completa la desestructuracion de props en este componente:",
      codeTemplate: {
        html: "",
        cssPrefix: "function Saludo(",
        cssSuffix: ") {\n  return <h1>Hola, {nombre}!</h1>;\n}",
        blanks: ["{ nombre }"],
      },
      validation: { type: "exact", answer: "{ nombre }" },
      hint: "Las props se desestructuran usando llaves en el parametro de la funcion.",
      explanation:
        "La desestructuracion { nombre } extrae la propiedad 'nombre' directamente del objeto props, permitiendo usarla sin escribir props.nombre.",
    },
    {
      id: "react04-ej-03",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 3,
      prompt: "Como se pasa un numero como prop en JSX?",
      options: [
        { id: "a", text: "<Comp edad=\"25\" />", isCorrect: false },
        { id: "b", text: "<Comp edad={25} />", isCorrect: true },
        { id: "c", text: "<Comp edad=25 />", isCorrect: false },
        { id: "d", text: "<Comp edad=(25) />", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Los valores que no son strings necesitan llaves.",
      explanation:
        "En JSX, los valores que no son strings (numeros, booleanos, arrays, objetos) se pasan entre llaves { }. Con comillas se pasaria el string \"25\" en vez del numero 25.",
    },
    {
      id: "react04-ej-04",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt: "Puede un componente hijo modificar las props que recibe?",
      options: [
        { id: "a", text: "Si, las props son mutables", isCorrect: false },
        { id: "b", text: "No, las props son de solo lectura", isCorrect: true },
        { id: "c", text: "Solo si el padre lo permite", isCorrect: false },
        { id: "d", text: "Solo con el metodo setProps()", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Las props son inmutables para el componente que las recibe.",
      explanation:
        "Las props son de solo lectura (inmutables). Un componente nunca debe modificar sus propias props. Si necesita cambiar datos, debe usar estado (useState).",
    },
    {
      id: "react04-ej-05",
      type: "code-completion",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt: "Completa la prop con un valor por defecto de \"Invitado\":",
      codeTemplate: {
        html: "",
        cssPrefix: "function Saludo({ nombre ",
        cssSuffix: " \"Invitado\" }) {\n  return <h1>Hola, {nombre}!</h1>;\n}",
        blanks: ["="],
      },
      validation: { type: "exact", answer: "=" },
      hint: "Es la sintaxis estandar de JavaScript para valores por defecto en desestructuracion.",
      explanation:
        "Los valores por defecto se asignan con = en la desestructuracion: { nombre = \"Invitado\" }. Si no se pasa la prop nombre, se usara \"Invitado\".",
    },
    {
      id: "react04-ej-06",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 6,
      prompt: "Clasifica cada tipo de valor segun como se pasa en JSX (con comillas o con llaves):",
      dragItems: [
        { id: "drag-1", content: "\"Hola Mundo\"", correctZone: "zone-comillas" },
        { id: "drag-2", content: "{42}", correctZone: "zone-llaves" },
        { id: "drag-3", content: "{true}", correctZone: "zone-llaves" },
        { id: "drag-4", content: "\"texto\"", correctZone: "zone-comillas" },
        { id: "drag-5", content: "{[1, 2, 3]}", correctZone: "zone-llaves" },
        { id: "drag-6", content: "{() => alert('hola')}", correctZone: "zone-llaves" },
      ],
      dropZones: [
        { id: "zone-comillas", label: "Con comillas (strings)" },
        { id: "zone-llaves", label: "Con llaves { } (expresiones)" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-comillas",
          "drag-2": "zone-llaves",
          "drag-3": "zone-llaves",
          "drag-4": "zone-comillas",
          "drag-5": "zone-llaves",
          "drag-6": "zone-llaves",
        },
      },
      hint: "Solo los textos literales (strings) van con comillas. Todo lo demas va con llaves.",
      explanation:
        "En JSX, los strings se pasan con comillas. Los numeros, booleanos, arrays, objetos y funciones se pasan entre llaves porque son expresiones JavaScript.",
    },
    {
      id: "react04-ej-07",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 7,
      prompt: "Que es el prop drilling?",
      options: [
        { id: "a", text: "Un patron para validar props automaticamente", isCorrect: false },
        { id: "b", text: "Pasar props a traves de muchos niveles de componentes intermedios que no las usan", isCorrect: true },
        { id: "c", text: "Una tecnica para optimizar el rendimiento de props", isCorrect: false },
        { id: "d", text: "Un metodo para crear props dinamicas", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Se llama 'drilling' porque las props 'perforan' muchos niveles.",
      explanation:
        "El prop drilling ocurre cuando datos se pasan a traves de multiples niveles de componentes que no necesitan esos datos, solo para que lleguen al componente que realmente los usa. Se puede resolver con Context API o librerias de estado.",
    },
    {
      id: "react04-ej-08",
      type: "code-completion",
      difficulty: 3 ,
      xpReward: 30,
      order: 8,
      prompt: "Completa el codigo para pasar todas las propiedades del objeto 'datos' como props al componente:",
      codeTemplate: {
        html: "",
        cssPrefix: "const datos = { nombre: \"Ana\", edad: 25 };\n<Perfil ",
        cssSuffix: "datos} />",
        blanks: ["{..."],
      },
      validation: { type: "exact", answer: "{..." },
      hint: "Usa el operador spread de JavaScript dentro de llaves JSX.",
      explanation:
        "El operador spread {...datos} expande todas las propiedades del objeto datos como props individuales. Es equivalente a <Perfil nombre=\"Ana\" edad={25} />.",
    },
  ],
};
