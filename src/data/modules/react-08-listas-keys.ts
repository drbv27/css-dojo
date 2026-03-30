import type { ModuleData } from "@/types";

export const reactListasModule: ModuleData = {
  slug: "react-listas-keys",
  title: "Listas y Keys",
  description:
    "Aprende a renderizar listas de datos de forma eficiente en React usando map(), keys y patrones de filtrado.",
  order: 208,
  category: "react-fundamentals",
  icon: "list",
  dojo: "react",
  lessons: [
    {
      id: "react08-leccion-01",
      title: "Renderizar listas con map()",
      content: `## Renderizar listas en React

En React, la forma estandar de renderizar una lista de elementos es usando el metodo **map()** de los arrays:

\`\`\`jsx
const frutas = ["Manzana", "Pera", "Uva", "Naranja"];

function ListaFrutas() {
  return (
    <ul>
      {frutas.map((fruta, index) => (
        <li key={index}>{fruta}</li>
      ))}
    </ul>
  );
}
\`\`\`

### Como funciona?

1. \`map()\` recorre cada elemento del array
2. Para cada elemento, retorna un fragmento de JSX
3. React renderiza todos los elementos retornados

### Con datos mas complejos

\`\`\`jsx
const usuarios = [
  { id: 1, nombre: "Ana", email: "ana@mail.com" },
  { id: 2, nombre: "Carlos", email: "carlos@mail.com" },
];

function ListaUsuarios() {
  return (
    <div>
      {usuarios.map((user) => (
        <div key={user.id}>
          <h3>{user.nombre}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}
\`\`\`

### Extraer componentes

Cuando el JSX de cada elemento es complejo, **extraelo en un componente**:

\`\`\`jsx
function UsuarioCard({ usuario }) {
  return (
    <div>
      <h3>{usuario.nombre}</h3>
      <p>{usuario.email}</p>
    </div>
  );
}

// En la lista:
{usuarios.map(user => <UsuarioCard key={user.id} usuario={user} />)}
\`\`\`

> **Regla:** Siempre que renderices una lista con map(), cada elemento necesita una prop \`key\` unica.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const lenguajes = [
  { id: 1, nombre: "JavaScript", color: "#f7df1e", tipo: "Dinamico" },
  { id: 2, nombre: "TypeScript", color: "#3178c6", tipo: "Tipado" },
  { id: 3, nombre: "Python", color: "#3776ab", tipo: "Dinamico" },
  { id: 4, nombre: "Rust", color: "#dea584", tipo: "Tipado" },
  { id: 5, nombre: "Go", color: "#00add8", tipo: "Tipado" },
];

function LenguajeCard({ lenguaje }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "12px",
      padding: "12px", margin: "6px 0",
      border: "1px solid #ddd", borderRadius: "8px",
      borderLeft: \`4px solid \${lenguaje.color}\`
    }}>
      <strong>{lenguaje.nombre}</strong>
      <span style={{ color: "#666" }}>({lenguaje.tipo})</span>
    </div>
  );
}

function App() {
  return (
    <div>
      <h1>Lenguajes de programacion</h1>
      {lenguajes.map(lang => (
        <LenguajeCard key={lang.id} lenguaje={lang} />
      ))}
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
      id: "react08-leccion-02",
      title: "La prop key en profundidad",
      content: `## Por que son importantes las keys?

Las **keys** ayudan a React a **identificar que elementos cambiaron** (se agregaron, eliminaron o reordenaron). Sin keys, React no puede optimizar las actualizaciones de listas.

### Que pasa sin keys?

Sin keys (o con keys incorrectas), React:
- Puede recrear todos los elementos de la lista
- Puede asociar mal el estado de un componente con otro
- Pierde optimizaciones de rendimiento

### Reglas para keys

1. **Deben ser unicas** entre hermanos (no globalmente)
2. **Deben ser estables** (no cambiar entre renderizados)
3. **No deben ser el index** si la lista puede cambiar

### Cuando SI usar index como key

El index esta bien si:
- La lista es **estatica** (no se reordena ni filtra)
- Los elementos **no tienen estado** interno
- Los elementos **no se agregan/eliminan** del medio

### Cuando NO usar index como key

\`\`\`jsx
// PELIGROSO con listas dinamicas:
{items.map((item, index) => (
  <Input key={index} /> // Los inputs pueden "heredar" el valor incorrecto
))}

// CORRECTO:
{items.map((item) => (
  <Input key={item.id} />
))}
\`\`\`

### Generar keys

Si tus datos no tienen ID, generalo al **crear** el dato (no al renderizar):

\`\`\`jsx
// Al agregar un nuevo item:
const nuevoItem = {
  id: crypto.randomUUID(), // o Date.now() como alternativa
  texto: "Nuevo"
};
\`\`\`

> **Nunca uses Math.random() como key** — genera un valor diferente cada renderizado, forzando a React a recrear el elemento.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
function App() {
  const [items, setItems] = React.useState([
    { id: crypto.randomUUID(), nombre: "React" },
    { id: crypto.randomUUID(), nombre: "Vue" },
    { id: crypto.randomUUID(), nombre: "Angular" },
  ]);

  const agregarAlInicio = () => {
    setItems([
      { id: crypto.randomUUID(), nombre: "Svelte" },
      ...items
    ]);
  };

  const eliminar = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const mezclar = () => {
    setItems([...items].sort(() => Math.random() - 0.5));
  };

  return (
    <div>
      <h1>Keys en accion</h1>
      <p style={{ color: "#666" }}>Cada item tiene un ID unico como key. Observa como React maneja los cambios:</p>
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <button onClick={agregarAlInicio} style={{ padding: "8px 16px", cursor: "pointer" }}>Agregar al inicio</button>
        <button onClick={mezclar} style={{ padding: "8px 16px", cursor: "pointer" }}>Mezclar</button>
      </div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map(item => (
          <li key={item.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px", margin: "4px 0", background: "#f5f5f5", borderRadius: "6px" }}>
            <span style={{ flex: 1 }}>{item.nombre}</span>
            <code style={{ fontSize: "10px", color: "#999" }}>{item.id.slice(0, 8)}...</code>
            <button onClick={() => eliminar(item.id)} style={{ cursor: "pointer", border: "none", background: "#e74c3c", color: "white", borderRadius: "4px", padding: "4px 8px" }}>X</button>
          </li>
        ))}
      </ul>
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
      id: "react08-leccion-03",
      title: "Filtrar, ordenar y listas anidadas",
      content: `## Filtrar y ordenar antes de renderizar

Es muy comun **filtrar** o **ordenar** datos antes de pasarlos a \`map()\`:

### Filtrar

\`\`\`jsx
function ListaTareas({ tareas, mostrarCompletas }) {
  const tareasFiltradas = mostrarCompletas
    ? tareas
    : tareas.filter(t => !t.completada);

  return (
    <ul>
      {tareasFiltradas.map(tarea => (
        <li key={tarea.id}>{tarea.texto}</li>
      ))}
    </ul>
  );
}
\`\`\`

### Ordenar

\`\`\`jsx
const productosOrdenados = [...productos].sort((a, b) =>
  a.precio - b.precio
);

return productosOrdenados.map(p => <Producto key={p.id} {...p} />);
\`\`\`

> **Importante:** Siempre crea una copia con \`[...array]\` antes de \`sort()\`, ya que sort muta el array original.

### Listas anidadas

\`\`\`jsx
const categorias = [
  { id: 1, nombre: "Frutas", items: ["Manzana", "Pera"] },
  { id: 2, nombre: "Verduras", items: ["Zanahoria", "Brocoli"] },
];

return categorias.map(cat => (
  <div key={cat.id}>
    <h3>{cat.nombre}</h3>
    <ul>
      {cat.items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  </div>
));
\`\`\`

### Patron: lista vacia

Siempre maneja el caso cuando la lista esta vacia:

\`\`\`jsx
{items.length === 0 ? (
  <p>No hay elementos</p>
) : (
  items.map(item => <Item key={item.id} {...item} />)
)}
\`\`\``,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const productosIniciales = [
  { id: 1, nombre: "Laptop", precio: 999, categoria: "tech" },
  { id: 2, nombre: "Auriculares", precio: 79, categoria: "tech" },
  { id: 3, nombre: "Camiseta", precio: 25, categoria: "ropa" },
  { id: 4, nombre: "Monitor", precio: 350, categoria: "tech" },
  { id: 5, nombre: "Zapatillas", precio: 120, categoria: "ropa" },
  { id: 6, nombre: "Teclado", precio: 65, categoria: "tech" },
];

function App() {
  const [filtro, setFiltro] = React.useState("todos");
  const [orden, setOrden] = React.useState("nombre");
  const [busqueda, setBusqueda] = React.useState("");

  // Filtrar
  let productos = filtro === "todos"
    ? productosIniciales
    : productosIniciales.filter(p => p.categoria === filtro);

  // Buscar
  if (busqueda) {
    productos = productos.filter(p =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
  }

  // Ordenar (crear copia para no mutar)
  productos = [...productos].sort((a, b) => {
    if (orden === "precio") return a.precio - b.precio;
    return a.nombre.localeCompare(b.nombre);
  });

  return (
    <div>
      <h1>Productos</h1>
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
        <input placeholder="Buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} style={{ padding: "8px" }} />
        <select value={filtro} onChange={(e) => setFiltro(e.target.value)} style={{ padding: "8px" }}>
          <option value="todos">Todos</option>
          <option value="tech">Tecnologia</option>
          <option value="ropa">Ropa</option>
        </select>
        <select value={orden} onChange={(e) => setOrden(e.target.value)} style={{ padding: "8px" }}>
          <option value="nombre">Nombre</option>
          <option value="precio">Precio</option>
        </select>
      </div>
      {productos.length === 0 ? (
        <p style={{ color: "#666", fontStyle: "italic" }}>No se encontraron productos.</p>
      ) : (
        productos.map(p => (
          <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px", margin: "4px 0", background: "#f9f9f9", borderRadius: "6px" }}>
            <span><strong>{p.nombre}</strong> <small style={{color: "#888"}}>({p.categoria})</small></span>
            <span style={{ color: "#2563eb", fontWeight: "bold" }}>\${p.precio}</span>
          </div>
        ))
      )}
      <p style={{ color: "#888", marginTop: "12px" }}>{productos.length} producto(s)</p>
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
      id: "react08-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "Que metodo de JavaScript se usa para renderizar listas en React?",
      options: [
        { id: "a", text: "forEach()", isCorrect: false },
        { id: "b", text: "map()", isCorrect: true },
        { id: "c", text: "for...of", isCorrect: false },
        { id: "d", text: "reduce()", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Es un metodo de array que retorna un nuevo array con los resultados.",
      explanation:
        "map() es el metodo estandar para renderizar listas en React porque retorna un nuevo array (de elementos JSX). forEach() no retorna nada, por eso no funciona directamente en JSX.",
    },
    {
      id: "react08-ej-02",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 2,
      prompt: "Completa el codigo para renderizar una lista de nombres con map():",
      codeTemplate: {
        html: "",
        cssPrefix: "nombres.",
        cssSuffix: "((nombre, i) => <li key={i}>{nombre}</li>)",
        blanks: ["map"],
      },
      validation: { type: "exact", answer: "map" },
      hint: "Es el metodo de array que transforma cada elemento en algo nuevo.",
      explanation:
        "map() recorre el array y para cada elemento retorna un nuevo valor (en este caso, un elemento JSX <li>). El resultado es un array de elementos que React renderiza.",
    },
    {
      id: "react08-ej-03",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 3,
      prompt: "Para que sirve la prop 'key' en listas de React?",
      options: [
        { id: "a", text: "Para dar estilo a cada elemento", isCorrect: false },
        { id: "b", text: "Para identificar de forma unica cada elemento y optimizar actualizaciones", isCorrect: true },
        { id: "c", text: "Para ordenar los elementos automaticamente", isCorrect: false },
        { id: "d", text: "Para acceder al elemento desde JavaScript", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "React necesita saber cual elemento cambio, se agrego o se elimino.",
      explanation:
        "La prop key permite a React identificar de forma unica cada elemento de la lista. Gracias a las keys, React puede determinar que elementos cambiaron y actualizar solo los necesarios.",
    },
    {
      id: "react08-ej-04",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 4,
      prompt: "Cuando es SEGURO usar el index como key?",
      options: [
        { id: "a", text: "Siempre, es la forma recomendada", isCorrect: false },
        { id: "b", text: "Nunca, siempre causa problemas", isCorrect: false },
        { id: "c", text: "Cuando la lista es estatica, no se reordena y los items no tienen estado", isCorrect: true },
        { id: "d", text: "Solo cuando la lista tiene menos de 10 elementos", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "El index es problematico cuando el orden de los elementos puede cambiar.",
      explanation:
        "El index como key es seguro solo en listas estaticas que no se reordenan, filtran o modifican dinamicamente. Para listas dinamicas, usa un ID unico y estable.",
    },
    {
      id: "react08-ej-05",
      type: "code-completion",
      difficulty: 2,
      xpReward: 15,
      order: 5,
      prompt: "Completa el codigo para filtrar solo los productos en stock antes de renderizar:",
      codeTemplate: {
        html: "",
        cssPrefix: "const enStock = productos.",
        cssSuffix: "(p => p.disponible);",
        blanks: ["filter"],
      },
      validation: { type: "exact", answer: "filter" },
      hint: "Es un metodo de array que retorna solo los elementos que cumplen una condicion.",
      explanation:
        "filter() crea un nuevo array con solo los elementos que pasan la condicion. En este caso, solo los productos donde 'disponible' es true. Luego puedes usar map() para renderizarlos.",
    },
    {
      id: "react08-ej-06",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 6,
      prompt: "Clasifica cada valor segun si es una BUENA o MALA key para una lista dinamica:",
      dragItems: [
        { id: "drag-1", content: "item.id (de la base de datos)", correctZone: "zone-buena" },
        { id: "drag-2", content: "index del array", correctZone: "zone-mala" },
        { id: "drag-3", content: "Math.random()", correctZone: "zone-mala" },
        { id: "drag-4", content: "crypto.randomUUID() (generado al crear)", correctZone: "zone-buena" },
        { id: "drag-5", content: "item.email (unico)", correctZone: "zone-buena" },
      ],
      dropZones: [
        { id: "zone-buena", label: "Buena key" },
        { id: "zone-mala", label: "Mala key" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-buena",
          "drag-2": "zone-mala",
          "drag-3": "zone-mala",
          "drag-4": "zone-buena",
          "drag-5": "zone-buena",
        },
      },
      hint: "Una buena key es unica y estable (no cambia entre renderizados).",
      explanation:
        "Buenas keys son IDs estables y unicos (de DB, UUID generado al crear, o cualquier valor unico del dato). Malas keys son el index (cambia al reordenar) y Math.random() (cambia cada renderizado).",
    },
    {
      id: "react08-ej-07",
      type: "quiz",
      difficulty: 3,
      xpReward: 10,
      order: 7,
      prompt: "Por que se debe crear una copia del array con [...array] antes de usar sort()?",
      options: [
        { id: "a", text: "Porque sort() no funciona en arrays de React", isCorrect: false },
        { id: "b", text: "Porque sort() muta el array original, violando la inmutabilidad del estado", isCorrect: true },
        { id: "c", text: "Porque sort() necesita un array nuevo para funcionar", isCorrect: false },
        { id: "d", text: "Porque React no detecta arrays ordenados", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Recuerda el principio de inmutabilidad en React.",
      explanation:
        "sort() modifica (muta) el array original. En React, el estado debe ser inmutable. Crear una copia con [...array] permite ordenar sin mutar el estado original, asegurando que React detecte el cambio.",
    },
  ],
};
