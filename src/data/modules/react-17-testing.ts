import type { ModuleData } from "@/types";

export const reactTestingModule: ModuleData = {
  slug: "react-testing",
  title: "Testing en React",
  description:
    "Aprende a testear componentes React con Vitest/Jest y React Testing Library: render, screen, eventos, async y mocking.",
  order: 217,
  category: "react-advanced",
  icon: "check-circle",
  dojo: "react",
  lessons: [
    {
      id: "react17-leccion-01",
      title: "Filosofia de testing y herramientas",
      content: `## Testing en React

### Por que testear?
- Detectar bugs antes de que lleguen a produccion
- Documentar el comportamiento esperado
- Refactorizar con confianza
- Prevenir regresiones

### Tipos de tests
1. **Unitarios** — testean funciones o componentes aislados
2. **De integracion** — testean multiples componentes juntos
3. **End-to-end (E2E)** — testean flujos completos del usuario

### Herramientas
| Herramienta | Proposito |
|-------------|-----------|
| **Vitest** | Test runner rapido (compatible con Vite) |
| **Jest** | Test runner clasico |
| **React Testing Library** | Renderizar y consultar componentes |
| **Playwright/Cypress** | Tests E2E |

### React Testing Library: Filosofia
> "Cuanto mas se parecen tus tests a como el usuario usa tu software, mas confianza te dan."

**No testees detalles de implementacion.** Testea el comportamiento:
- Lo que el usuario **ve** (texto, botones)
- Lo que el usuario **hace** (clicks, escribir)
- Lo que **resulta** (cambios en pantalla)

### Configuracion basica
\`\`\`bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
\`\`\`

\`\`\`jsx
// Contador.test.jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Contador from './Contador';

test('incrementa el contador al hacer click', async () => {
  render(<Contador />);
  const boton = screen.getByRole('button', { name: /incrementar/i });
  await userEvent.click(boton);
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
\`\`\`

> **Tip:** Nombra tus tests describiendo el comportamiento, no la implementacion.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const { useState } = React;

// Componente a testear
function Contador({ inicial = 0 }) {
  const [count, setCount] = useState(inicial);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Incrementar</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// Simulacion visual de tests
function TestRunner() {
  const [resultados, setResultados] = useState([]);

  const ejecutarTests = () => {
    const tests = [];

    // Test 1: Renderiza valor inicial
    tests.push({
      nombre: 'muestra el valor inicial',
      paso: true,
      detalle: 'Encuentra texto "Count: 0" en el DOM'
    });

    // Test 2: Incrementa al click
    tests.push({
      nombre: 'incrementa al hacer click en "Incrementar"',
      paso: true,
      detalle: 'Click en boton → texto cambia a "Count: 1"'
    });

    // Test 3: Reset funciona
    tests.push({
      nombre: 'resetea a 0 al hacer click en "Reset"',
      paso: true,
      detalle: 'Click en Reset → texto vuelve a "Count: 0"'
    });

    // Test 4: Valor inicial custom
    tests.push({
      nombre: 'acepta prop inicial personalizada',
      paso: true,
      detalle: 'render(<Contador inicial={5} />) → "Count: 5"'
    });

    setResultados(tests);
  };

  return (
    <div>
      <h3>Simulador de Test Runner</h3>
      <div style={{display:'flex', gap:12}}>
        <div style={{flex:1}}>
          <h4>Componente:</h4>
          <Contador />
        </div>
        <div style={{flex:1}}>
          <h4>Tests:</h4>
          <button onClick={ejecutarTests} style={{marginBottom:8}}>
            Ejecutar tests
          </button>
          {resultados.map((t, i) => (
            <div key={i} style={{padding:6, margin:4, background: t.paso ? '#e8f5e9' : '#ffebee', borderRadius:4, fontSize:13}}>
              <span>{t.paso ? '✓' : '✗'}</span> {t.nombre}
              <p style={{fontSize:11, color:'#666', margin:0}}>{t.detalle}</p>
            </div>
          ))}
          {resultados.length > 0 && (
            <p style={{color:'#4caf50', fontWeight:600, fontSize:13}}>
              {resultados.filter(t => t.paso).length}/{resultados.length} tests pasaron
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<TestRunner />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; } button { padding: 6px 14px; background: #a6e3a1; color: #1e1e2e; border: none; border-radius: 6px; cursor: pointer; margin: 2px; }',
        editable: true,
      },
      order: 1,
    },
    {
      id: "react17-leccion-02",
      title: "Queries y eventos con Testing Library",
      content: `## Queries: Encontrando Elementos

### Prioridad de queries (de mejor a peor)
1. **getByRole** — accesible, como un usuario real
2. **getByLabelText** — para inputs de formulario
3. **getByPlaceholderText** — para inputs
4. **getByText** — para texto visible
5. **getByTestId** — ultimo recurso

\`\`\`jsx
// Preferido: por rol accesible
screen.getByRole('button', { name: /enviar/i });
screen.getByRole('textbox', { name: /email/i });
screen.getByRole('heading', { level: 2 });

// Por texto
screen.getByText(/bienvenido/i);

// Por label
screen.getByLabelText(/nombre/i);

// Ultimo recurso
screen.getByTestId('mi-componente');
\`\`\`

### Variantes de query
| Prefijo | 0 matches | 1 match | N matches |
|---------|-----------|---------|-----------|
| getBy | Error | Retorna | Error |
| queryBy | null | Retorna | Error |
| findBy | Error | Retorna | Error |

- **getBy** — cuando esperas que exista
- **queryBy** — cuando puede NO existir
- **findBy** — para elementos **async** (retorna Promise)

### Eventos con userEvent
\`\`\`jsx
import userEvent from '@testing-library/user-event';

const user = userEvent.setup();
await user.click(boton);
await user.type(input, 'texto');
await user.clear(input);
await user.selectOptions(select, 'opcion');
\`\`\`

> **Prefiere userEvent sobre fireEvent** — simula mejor el comportamiento real del usuario.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const { useState } = React;

function FormularioLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email.includes('@')) {
      setError('Email invalido');
      return;
    }
    if (password.length < 6) {
      setError('Password debe tener al menos 6 caracteres');
      return;
    }
    setExito(true);
  };

  if (exito) return <p role="alert" style={{color:'#4caf50'}}>Login exitoso!</p>;

  return (
    <form onSubmit={handleSubmit}>
      <div style={{marginBottom:8}}>
        <label htmlFor="email">Email:</label><br/>
        <input id="email" type="email" value={email} placeholder="tu@email.com"
          onChange={e => setEmail(e.target.value)} />
      </div>
      <div style={{marginBottom:8}}>
        <label htmlFor="password">Password:</label><br/>
        <input id="password" type="password" value={password}
          onChange={e => setPassword(e.target.value)} />
      </div>
      {error && <p role="alert" style={{color:'#f38ba8', fontSize:13}}>{error}</p>}
      <button type="submit">Iniciar sesion</button>
    </form>
  );
}

function TestVisual() {
  const [tests] = useState([
    { query: 'getByRole("textbox", { name: /email/i })', desc: 'Encuentra el input email por su label' },
    { query: 'getByLabelText(/password/i)', desc: 'Encuentra el input password por su label' },
    { query: 'getByRole("button", { name: /iniciar/i })', desc: 'Encuentra el boton de submit' },
    { query: 'queryByRole("alert")', desc: 'Verifica si hay mensaje de error (puede no existir)' },
  ]);

  return (
    <div style={{display:'flex', gap:16}}>
      <div style={{flex:1}}>
        <h4>Componente:</h4>
        <FormularioLogin />
      </div>
      <div style={{flex:1}}>
        <h4>Queries utilizadas:</h4>
        {tests.map((t, i) => (
          <div key={i} style={{padding:6, margin:4, background:'#f0f0f0', borderRadius:4, fontSize:12}}>
            <code style={{color:'#89b4fa'}}>{t.query}</code>
            <p style={{margin:0, color:'#666'}}>{t.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <div>
      <h3>Testing: Queries y Eventos</h3>
      <TestVisual />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; } input { padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 100%; box-sizing: border-box; margin-top: 4px; } button { padding: 8px 16px; background: #89b4fa; color: #1e1e2e; border: none; border-radius: 6px; cursor: pointer; } label { font-size: 14px; font-weight: 600; }',
        editable: true,
      },
      order: 2,
    },
    {
      id: "react17-leccion-03",
      title: "Testing async y mocking",
      content: `## Testing Asincrono y Mocking

### Componentes async con findBy
\`\`\`jsx
test('carga y muestra usuarios', async () => {
  render(<ListaUsuarios />);

  // findBy espera hasta que el elemento aparezca
  const items = await screen.findAllByRole('listitem');
  expect(items).toHaveLength(3);
});
\`\`\`

### waitFor para aserciones
\`\`\`jsx
import { waitFor } from '@testing-library/react';

test('muestra error despues de submit', async () => {
  render(<Formulario />);
  await userEvent.click(screen.getByRole('button'));

  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
\`\`\`

### Mocking de fetch
\`\`\`jsx
// Mock global de fetch
beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([
        { id: 1, name: 'Diego' }
      ]),
    })
  );
});

afterEach(() => {
  vi.restoreAllMocks();
});

test('carga datos de la API', async () => {
  render(<Usuarios />);
  expect(await screen.findByText('Diego')).toBeInTheDocument();
  expect(fetch).toHaveBeenCalledWith('/api/users');
});
\`\`\`

### Mocking de modulos
\`\`\`jsx
// Mock de un modulo completo
vi.mock('./api', () => ({
  getUsers: vi.fn(() => Promise.resolve([
    { id: 1, name: 'Test' }
  ])),
}));
\`\`\`

> **Tip:** Mockea las dependencias externas (API, localStorage), pero no mockees React ni los hooks.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const { useState, useEffect } = React;

// Componente con datos async
function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users?_limit=4')
      .then(r => r.json())
      .then(data => { setUsuarios(data); setCargando(false); })
      .catch(e => { setError(e.message); setCargando(false); });
  }, []);

  if (cargando) return <p>Cargando...</p>;
  if (error) return <p role="alert">Error: {error}</p>;

  return (
    <ul>
      {usuarios.map(u => (
        <li key={u.id}>{u.name} - {u.email}</li>
      ))}
    </ul>
  );
}

function TestAsync() {
  const [tests] = useState([
    { nombre: 'muestra "Cargando..." inicialmente', codigo: 'expect(screen.getByText("Cargando...")).toBeInTheDocument()' },
    { nombre: 'muestra usuarios despues de cargar', codigo: 'const items = await screen.findAllByRole("listitem");\nexpect(items.length).toBeGreaterThan(0)' },
    { nombre: 'muestra error si fetch falla', codigo: 'global.fetch = vi.fn(() => Promise.reject("Error"));\nrender(<ListaUsuarios />);\nawait screen.findByRole("alert")' },
    { nombre: 'llama a fetch con la URL correcta', codigo: 'expect(fetch).toHaveBeenCalledWith(\n  expect.stringContaining("/users")\n)' },
  ]);

  return (
    <div style={{display:'flex', gap:16}}>
      <div style={{flex:1}}>
        <h4>Componente async:</h4>
        <ListaUsuarios />
      </div>
      <div style={{flex:1}}>
        <h4>Tests con mock:</h4>
        {tests.map((t, i) => (
          <div key={i} style={{padding:6, margin:4, background:'#e8f5e9', borderRadius:4, fontSize:12}}>
            <span style={{color:'#4caf50'}}>✓</span> {t.nombre}
            <pre style={{background:'#f5f5f5', padding:4, borderRadius:4, margin:'4px 0 0', fontSize:11, overflow:'auto'}}>
              {t.codigo}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <div>
      <h3>Testing Async + Mocking</h3>
      <TestAsync />
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
      id: "react17-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "Cual es la filosofia principal de React Testing Library?",
      options: [
        { id: "a", text: "Testear cada funcion interna del componente", isCorrect: false },
        { id: "b", text: "Testear como el usuario interactua con el componente", isCorrect: true },
        { id: "c", text: "Testear solo el estado interno", isCorrect: false },
        { id: "d", text: "Testear la estructura del DOM generado", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Los tests deben parecerse a como el usuario usa el software.",
      explanation: "React Testing Library promueve testear el comportamiento visible, no los detalles de implementacion. Tests que simulan lo que el usuario ve y hace.",
    },
    {
      id: "react17-ej-02",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 2,
      prompt: "Cual es la query preferida en React Testing Library?",
      options: [
        { id: "a", text: "getByTestId", isCorrect: false },
        { id: "b", text: "getByClassName", isCorrect: false },
        { id: "c", text: "getByRole", isCorrect: true },
        { id: "d", text: "querySelector", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Busca elementos por su rol accesible, como lo haria un usuario con lector de pantalla.",
      explanation: "getByRole es la query preferida porque usa roles accesibles (button, textbox, heading), lo que tambien verifica la accesibilidad del componente.",
    },
    {
      id: "react17-ej-03",
      type: "code-completion",
      difficulty: 2,
      xpReward: 15,
      order: 3,
      prompt: "Completa para encontrar un boton con el texto 'Enviar':",
      codeTemplate: {
        html: "",
        cssPrefix: "const boton = screen.",
        cssSuffix: "('button', { name: /enviar/i });",
        blanks: ["getByRole"],
      },
      validation: { type: "exact", answer: "getByRole" },
      hint: "La query que busca por rol accesible.",
      explanation: "getByRole('button', { name: /enviar/i }) encuentra un boton cuyo nombre accesible coincide con 'enviar' (case insensitive).",
    },
    {
      id: "react17-ej-04",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt: "Asocia cada query con su caso de uso:",
      dragItems: [
        { id: "d1", content: "getByRole", correctZone: "accesible" },
        { id: "d2", content: "getByLabelText", correctZone: "formulario" },
        { id: "d3", content: "findByText", correctZone: "async" },
        { id: "d4", content: "queryByText", correctZone: "noExiste" },
      ],
      dropZones: [
        { id: "accesible", label: "Buscar por rol accesible" },
        { id: "formulario", label: "Buscar inputs de formulario" },
        { id: "async", label: "Buscar elementos que aparecen async" },
        { id: "noExiste", label: "Verificar que algo NO existe" },
      ],
      validation: { type: "exact", answer: { d1: "accesible", d2: "formulario", d3: "async", d4: "noExiste" } },
      hint: "Cada variante de query tiene su escenario ideal.",
      explanation: "getByRole para accesibilidad, getByLabelText para formularios, findBy para async (retorna Promise), queryBy retorna null si no existe.",
    },
    {
      id: "react17-ej-05",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 5,
      prompt: "Que es preferible usar para simular interacciones del usuario: fireEvent o userEvent?",
      options: [
        { id: "a", text: "fireEvent porque es mas rapido", isCorrect: false },
        { id: "b", text: "userEvent porque simula mejor el comportamiento real del usuario", isCorrect: true },
        { id: "c", text: "Son exactamente iguales", isCorrect: false },
        { id: "d", text: "Ninguno, se debe usar click() nativo", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Uno simula eventos del DOM, otro simula el comportamiento completo del usuario.",
      explanation: "userEvent simula el flujo completo del usuario (hover, focus, keydown, etc.), no solo el evento final. Esto detecta mas bugs reales.",
    },
    {
      id: "react17-ej-06",
      type: "code-completion",
      difficulty: 3,
      xpReward: 20,
      order: 6,
      prompt: "Completa para esperar a que aparezca un elemento asincrono:",
      codeTemplate: {
        html: "",
        cssPrefix: "const usuario = await screen.",
        cssSuffix: "(/diego/i);",
        blanks: ["findByText"],
      },
      validation: { type: "exact", answer: "findByText" },
      hint: "La variante de query que retorna una Promise y espera.",
      explanation: "findByText retorna una Promise que se resuelve cuando el elemento aparece en el DOM. Ideal para contenido que se carga asincronamente.",
    },
    {
      id: "react17-ej-07",
      type: "quiz",
      difficulty: 3,
      xpReward: 15,
      order: 7,
      prompt: "Que debes mockear al testear un componente que hace fetch?",
      options: [
        { id: "a", text: "Los hooks de React", isCorrect: false },
        { id: "b", text: "La funcion fetch o el modulo de API", isCorrect: true },
        { id: "c", text: "El componente completo", isCorrect: false },
        { id: "d", text: "React DOM", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Mockea las dependencias externas, no React.",
      explanation: "Se mockea fetch o el modulo de API para controlar las respuestas sin hacer peticiones reales. Nunca mockees React ni sus hooks.",
    },
    {
      id: "react17-ej-08",
      type: "quiz",
      difficulty: 3,
      xpReward: 15,
      order: 8,
      prompt: "Que tipo de testing da mas confianza pero es mas lento y fragil?",
      options: [
        { id: "a", text: "Tests unitarios", isCorrect: false },
        { id: "b", text: "Tests de integracion", isCorrect: false },
        { id: "c", text: "Tests end-to-end (E2E)", isCorrect: true },
        { id: "d", text: "Tests de snapshot", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Son tests que simulan el flujo completo del usuario en el navegador.",
      explanation: "Los tests E2E (Playwright, Cypress) testean flujos completos y dan mucha confianza, pero son mas lentos, fragiles y costosos de mantener.",
    },
  ],
};
