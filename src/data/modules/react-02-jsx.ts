import type { ModuleData } from "@/types";

export const reactJsxModule: ModuleData = {
  slug: "react-jsx",
  title: "JSX en profundidad",
  description:
    "Domina JSX, la sintaxis que combina JavaScript y HTML para crear interfaces de usuario en React.",
  order: 202,
  category: "react-fundamentals",
  icon: "code",
  dojo: "react",
  lessons: [
    {
      id: "react02-leccion-01",
      title: "Que es JSX?",
      content: `## Que es JSX?

**JSX** (JavaScript XML) es una extension de sintaxis para JavaScript que te permite escribir algo muy similar a HTML dentro de tu codigo JavaScript.

### JSX no es HTML

Aunque se parece mucho, JSX tiene diferencias importantes:

\`\`\`jsx
// Esto es JSX, NO HTML
const titulo = <h1 className="principal">Hola Mundo</h1>;
\`\`\`

### Como funciona?

Babel transforma JSX en llamadas a \`React.createElement()\`:

\`\`\`jsx
// Tu escribes esto:
const titulo = <h1>Hola</h1>;

// Babel lo convierte en:
const titulo = React.createElement("h1", null, "Hola");
\`\`\`

### Reglas basicas de JSX

1. **Siempre debes retornar UN solo elemento raiz** (o usar Fragments)
2. **Todas las etiquetas deben cerrarse**: \`<img />\`, \`<br />\`, \`<input />\`
3. **La mayoria de atributos usan camelCase**: \`className\`, \`onClick\`, \`htmlFor\`

> **Recuerda:** JSX es solo azucar sintactica sobre \`React.createElement()\`. Hace tu codigo mas legible y facil de escribir.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
function App() {
  // JSX se parece a HTML pero es JavaScript!
  return (
    <div>
      <h1 className="titulo">Esto es JSX</h1>
      <p>Se parece a HTML pero tiene diferencias clave.</p>
      <img src="https://placekitten.com/100/100" alt="gatito" />
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; } .titulo { color: steelblue; }',
        editable: true,
      },
      order: 1,
    },
    {
      id: "react02-leccion-02",
      title: "Expresiones en JSX",
      content: `## Expresiones en JSX con { }

Dentro de JSX puedes insertar **cualquier expresion de JavaScript** usando llaves \`{ }\`:

### Variables y valores

\`\`\`jsx
const nombre = "Ana";
return <h1>Hola, {nombre}!</h1>;
\`\`\`

### Operaciones

\`\`\`jsx
return <p>Resultado: {2 + 3}</p>; // Muestra: Resultado: 5
\`\`\`

### Llamadas a funciones

\`\`\`jsx
return <p>{nombre.toUpperCase()}</p>;
\`\`\`

### Expresiones ternarias

\`\`\`jsx
const edad = 20;
return <p>{edad >= 18 ? "Mayor de edad" : "Menor de edad"}</p>;
\`\`\`

### Que NO puedes poner en { }

- **Sentencias** como \`if\`, \`for\`, \`while\` (no son expresiones)
- **Objetos** directamente: \`{miObjeto}\` causara error

> **Regla clave:** Si puedes ponerlo a la derecha de un \`=\` en JavaScript, puedes ponerlo dentro de \`{ }\` en JSX.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
function App() {
  const nombre = "Ana";
  const edad = 25;
  const hobbies = ["leer", "programar", "cocinar"];

  return (
    <div>
      <h1>Hola, {nombre}!</h1>
      <p>Edad: {edad} anios</p>
      <p>Es mayor de edad: {edad >= 18 ? "Si" : "No"}</p>
      <p>Hobbies: {hobbies.join(", ")}</p>
      <p>2 + 2 = {2 + 2}</p>
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
      id: "react02-leccion-03",
      title: "Diferencias JSX vs HTML",
      content: `## Diferencias entre JSX y HTML

JSX se parece a HTML, pero hay diferencias importantes que debes conocer:

### 1. className en vez de class

\`\`\`jsx
// HTML: <div class="caja">
// JSX:
<div className="caja">Contenido</div>
\`\`\`

### 2. htmlFor en vez de for

\`\`\`jsx
// HTML: <label for="email">
// JSX:
<label htmlFor="email">Email</label>
\`\`\`

### 3. camelCase para atributos de eventos

\`\`\`jsx
// HTML: onclick, onchange, onsubmit
// JSX: onClick, onChange, onSubmit
<button onClick={handleClick}>Clic</button>
\`\`\`

### 4. style acepta un objeto, no un string

\`\`\`jsx
// HTML: <div style="color: red; font-size: 20px">
// JSX:
<div style={{ color: "red", fontSize: "20px" }}>Texto</div>
\`\`\`

### 5. Todas las etiquetas deben cerrarse

\`\`\`jsx
// HTML: <br> <img src="..."> <input type="text">
// JSX:
<br />
<img src="..." alt="desc" />
<input type="text" />
\`\`\`

> **Tip:** La mayoria de los errores de principiantes en React vienen de usar \`class\` en vez de \`className\`.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
function App() {
  const estilos = {
    color: "white",
    backgroundColor: "steelblue",
    padding: "16px",
    borderRadius: "8px",
    fontSize: "18px"
  };

  return (
    <div>
      <h1 className="titulo">Diferencias JSX vs HTML</h1>
      <div style={estilos}>
        Este div usa style como objeto JavaScript
      </div>
      <br />
      <label htmlFor="nombre">Nombre: </label>
      <input id="nombre" type="text" placeholder="Escribe aqui..." />
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; } .titulo { color: #333; }',
        editable: true,
      },
      order: 3,
    },
    {
      id: "react02-leccion-04",
      title: "Fragments y listas en JSX",
      content: `## Fragments

En JSX debes retornar **un solo elemento raiz**. Si no quieres agregar un \`<div>\` extra, usa **Fragments**:

\`\`\`jsx
// Con Fragment largo:
<React.Fragment>
  <h1>Titulo</h1>
  <p>Parrafo</p>
</React.Fragment>

// Con Fragment corto (recomendado):
<>
  <h1>Titulo</h1>
  <p>Parrafo</p>
</>
\`\`\`

Los Fragments no generan ningun elemento HTML adicional en el DOM.

## Renderizar listas con map()

Para mostrar listas de datos, usamos \`map()\` dentro de JSX:

\`\`\`jsx
const frutas = ["Manzana", "Pera", "Uva"];

return (
  <ul>
    {frutas.map((fruta, index) => (
      <li key={index}>{fruta}</li>
    ))}
  </ul>
);
\`\`\`

### La prop key

Cada elemento de una lista en React **necesita una prop \`key\` unica**. Esto ayuda a React a identificar que elementos cambiaron.

> **Importante:** Usar el \`index\` como key funciona para listas estaticas, pero para listas dinamicas es mejor usar un ID unico.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
function App() {
  const tecnologias = [
    { id: 1, nombre: "React", tipo: "Libreria" },
    { id: 2, nombre: "Vue", tipo: "Framework" },
    { id: 3, nombre: "Angular", tipo: "Framework" },
    { id: 4, nombre: "Svelte", tipo: "Compilador" },
  ];

  return (
    <>
      <h1>Tecnologias Frontend</h1>
      <ul>
        {tecnologias.map((tech) => (
          <li key={tech.id}>
            <strong>{tech.nombre}</strong> - {tech.tipo}
          </li>
        ))}
      </ul>
    </>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; } li { margin: 8px 0; }',
        editable: true,
      },
      order: 4,
    },
  ],
  exercises: [
    {
      id: "react02-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "Que es JSX?",
      options: [
        { id: "a", text: "Un nuevo lenguaje de programacion", isCorrect: false },
        { id: "b", text: "Una extension de sintaxis que permite escribir HTML dentro de JavaScript", isCorrect: true },
        { id: "c", text: "Un preprocesador CSS", isCorrect: false },
        { id: "d", text: "Un formato de datos como JSON", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Combina dos tecnologias que ya conoces.",
      explanation:
        "JSX es una extension de sintaxis para JavaScript que permite escribir marcado similar a HTML dentro del codigo JavaScript. Babel lo transforma en llamadas a React.createElement().",
    },
    {
      id: "react02-ej-02",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 2,
      prompt: "En JSX, cual es el atributo correcto para asignar una clase CSS? Completa: <div ___=\"caja\">",
      codeTemplate: {
        html: "",
        cssPrefix: "<div ",
        cssSuffix: '="caja">Contenido</div>',
        blanks: ["className"],
      },
      validation: { type: "exact", answer: "className" },
      hint: "En JSX no se usa 'class' porque es una palabra reservada en JavaScript.",
      explanation:
        "En JSX se usa className en vez de class porque 'class' es una palabra reservada en JavaScript. Todos los atributos HTML que colisionan con palabras reservadas de JS tienen nombres alternativos en JSX.",
    },
    {
      id: "react02-ej-03",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 3,
      prompt: "Como se inserta una expresion JavaScript dentro de JSX?",
      options: [
        { id: "a", text: "Con doble llaves: {{ expresion }}", isCorrect: false },
        { id: "b", text: "Con llaves simples: { expresion }", isCorrect: true },
        { id: "c", text: "Con parentesis: ( expresion )", isCorrect: false },
        { id: "d", text: "Con comillas: \"expresion\"", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Es un solo par de un tipo de simbolo.",
      explanation:
        "En JSX, las expresiones de JavaScript se insertan usando llaves simples { }. Las dobles llaves {{ }} se usan solo para objetos inline, como en style={{ color: 'red' }}.",
    },
    {
      id: "react02-ej-04",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 4,
      prompt: "Cual de estas opciones es JSX valido?",
      options: [
        { id: "a", text: "<div class=\"caja\"><input type=\"text\"></div>", isCorrect: false },
        { id: "b", text: "<div className=\"caja\"><input type=\"text\" /></div>", isCorrect: true },
        { id: "c", text: "<div className=\"caja\"><input type=\"text\">", isCorrect: false },
        { id: "d", text: "<div class=\"caja\"><input type=\"text\" /></div>", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Recuerda las dos reglas: className y cerrar todas las etiquetas.",
      explanation:
        "JSX requiere usar className en vez de class, y todas las etiquetas deben cerrarse explicitamente (como <input />). La opcion b cumple ambas reglas.",
    },
    {
      id: "react02-ej-05",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 5,
      prompt: "Clasifica cada atributo segun si pertenece a HTML o JSX:",
      dragItems: [
        { id: "drag-1", content: "class", correctZone: "zone-html" },
        { id: "drag-2", content: "className", correctZone: "zone-jsx" },
        { id: "drag-3", content: "for", correctZone: "zone-html" },
        { id: "drag-4", content: "htmlFor", correctZone: "zone-jsx" },
        { id: "drag-5", content: "onclick", correctZone: "zone-html" },
        { id: "drag-6", content: "onClick", correctZone: "zone-jsx" },
      ],
      dropZones: [
        { id: "zone-html", label: "HTML" },
        { id: "zone-jsx", label: "JSX" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-html",
          "drag-2": "zone-jsx",
          "drag-3": "zone-html",
          "drag-4": "zone-jsx",
          "drag-5": "zone-html",
          "drag-6": "zone-jsx",
        },
      },
      hint: "JSX usa camelCase y evita palabras reservadas de JavaScript.",
      explanation:
        "En JSX, class se convierte en className, for en htmlFor, y los eventos usan camelCase (onClick en vez de onclick).",
    },
    {
      id: "react02-ej-06",
      type: "code-completion",
      difficulty: 2,
      xpReward: 15,
      order: 6,
      prompt: "Completa el codigo para usar un Fragment corto que envuelva dos elementos:",
      codeTemplate: {
        html: "",
        cssPrefix: "return (\n  ",
        cssSuffix: "\n    <h1>Titulo</h1>\n    <p>Parrafo</p>\n  </>\n);",
        blanks: ["<>"],
      },
      validation: { type: "exact", answer: "<>" },
      hint: "Es la version corta de React.Fragment.",
      explanation:
        "El Fragment corto <> </> permite retornar multiples elementos sin agregar un nodo extra al DOM. Es equivalente a <React.Fragment> pero mas conciso.",
    },
    {
      id: "react02-ej-07",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 7,
      prompt: "Como se aplica un estilo inline en JSX?",
      options: [
        { id: "a", text: "style=\"color: red\"", isCorrect: false },
        { id: "b", text: "style={{ color: \"red\" }}", isCorrect: true },
        { id: "c", text: "style={color: \"red\"}", isCorrect: false },
        { id: "d", text: "css={{ color: \"red\" }}", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Se necesitan dos pares de llaves: uno para la expresion JSX y otro para el objeto.",
      explanation:
        "En JSX, style acepta un objeto JavaScript (no un string). Las llaves externas son la expresion JSX y las internas son el objeto: style={{ propiedad: \"valor\" }}.",
    },
    {
      id: "react02-ej-08",
      type: "code-completion",
      difficulty: 3,
      xpReward: 15,
      order: 8,
      prompt: "Completa el codigo para renderizar una lista de nombres usando map(). Cada <li> necesita una prop unica:",
      codeTemplate: {
        html: "",
        cssPrefix: "nombres.map((nombre, index) => (\n  <li ",
        cssSuffix: "={index}>{nombre}</li>\n))",
        blanks: ["key"],
      },
      validation: { type: "exact", answer: "key" },
      hint: "React necesita identificar cada elemento de la lista de forma unica.",
      explanation:
        "La prop key es obligatoria en listas de React. Permite a React identificar que elementos cambiaron, se agregaron o se eliminaron para optimizar el renderizado.",
    },
  ],
};
