import type { ModuleData } from "@/types";

export const tsTsReactModule: ModuleData = {
  slug: "ts-04-typescript-react",
  title: "TypeScript con React",
  description: "Tipar props, useState, eventos y hooks personalizados en React con TypeScript.",
  order: 129,
  category: "js-typescript",
  icon: "code",
  dojo: "js",
  lessons: [
    {
      id: "ts04-leccion-01",
      title: "Props y Estado tipados",
      content: `## Props con TypeScript

\`\`\`typescript
// Definir las props con interface
interface CardProps {
  titulo: string;
  descripcion: string;
  imagen?: string; // opcional
  onClick: () => void;
}

function Card({ titulo, descripcion, imagen, onClick }: CardProps) {
  return (
    <div onClick={onClick}>
      {imagen && <img src={imagen} alt={titulo} />}
      <h2>{titulo}</h2>
      <p>{descripcion}</p>
    </div>
  );
}
\`\`\`

### children tipado

\`\`\`typescript
interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

function Layout({ children, className }: LayoutProps) {
  return <div className={className}>{children}</div>;
}
\`\`\`

### useState con tipos

\`\`\`typescript
// TypeScript infiere el tipo del valor inicial
const [count, setCount] = useState(0); // number
const [name, setName] = useState(""); // string

// Para tipos complejos, especifica el generic
interface Usuario { id: string; nombre: string; }
const [user, setUser] = useState<Usuario | null>(null);

// Arrays tipados
const [items, setItems] = useState<string[]>([]);
\`\`\`

> Tipar props es la mejora mas inmediata al usar TypeScript con React.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #3b82f6; border-radius: 8px; white-space: pre-line; }',
        editable: true,
      },
      order: 1,
    },
    {
      id: "ts04-leccion-02",
      title: "Eventos y Hooks tipados",
      content: `## Eventos tipados

React provee tipos para cada evento:

\`\`\`typescript
function Formulario() {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // procesar formulario
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("click en", e.clientX, e.clientY);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} />
      <button onClick={handleClick}>Enviar</button>
    </form>
  );
}
\`\`\`

### Tipos de eventos comunes

| Evento | Tipo React |
|--------|-----------|
| onChange (input) | React.ChangeEvent<HTMLInputElement> |
| onSubmit (form) | React.FormEvent<HTMLFormElement> |
| onClick (button) | React.MouseEvent<HTMLButtonElement> |
| onKeyDown | React.KeyboardEvent<HTMLElement> |

### Custom hooks tipados

\`\`\`typescript
function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initial;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

// Uso
const [tema, setTema] = useLocalStorage("tema", "dark");
\`\`\`

> El \`as const\` al final asegura que TypeScript infiera un tuple, no un array.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #f5c2e7; border-radius: 8px; white-space: pre-line; }',
        editable: true,
      },
      order: 2,
    },
  ],
  exercises: [
    {
      id: "ts04-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "Como se tipan las props de un componente React en TypeScript?",
      options: [
        { id: "a", text: "Con PropTypes", isCorrect: false },
        { id: "b", text: "Con una interface o type", isCorrect: true },
        { id: "c", text: "Con typeof", isCorrect: false },
        { id: "d", text: "No se pueden tipar", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Se define la forma de las props antes del componente.",
      explanation: "En TypeScript, las props se tipan con interface o type que describe cada propiedad esperada.",
    },
    {
      id: "ts04-ej-02",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 2,
      prompt: "Como tipas un useState que puede ser un objeto Usuario o null?",
      options: [
        { id: "a", text: "useState(null)", isCorrect: false },
        { id: "b", text: "useState<Usuario>(null)", isCorrect: false },
        { id: "c", text: "useState<Usuario | null>(null)", isCorrect: true },
        { id: "d", text: "useState<any>(null)", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Necesitas un union type que incluya null.",
      explanation: "useState<Usuario | null>(null) indica que el estado puede ser un Usuario o null.",
    },
    {
      id: "ts04-ej-03",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 3,
      prompt: "Cual es el tipo correcto para el evento onChange de un input?",
      options: [
        { id: "a", text: "React.MouseEvent<HTMLInputElement>", isCorrect: false },
        { id: "b", text: "React.ChangeEvent<HTMLInputElement>", isCorrect: true },
        { id: "c", text: "React.InputEvent<HTMLInputElement>", isCorrect: false },
        { id: "d", text: "Event", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Change = cambio, y es sobre un HTMLInputElement.",
      explanation: "React.ChangeEvent<HTMLInputElement> es el tipo correcto para onChange en inputs.",
    },
    {
      id: "ts04-ej-04",
      type: "drag-drop",
      difficulty: 3,
      xpReward: 20,
      order: 4,
      prompt: "Asocia cada evento con su tipo React:",
      dragItems: [
        { id: "drag-1", content: "onChange (input)", correctZone: "zone-change" },
        { id: "drag-2", content: "onSubmit (form)", correctZone: "zone-form" },
        { id: "drag-3", content: "onClick (button)", correctZone: "zone-click" },
      ],
      dropZones: [
        { id: "zone-change", label: "React.ChangeEvent<HTMLInputElement>" },
        { id: "zone-form", label: "React.FormEvent<HTMLFormElement>" },
        { id: "zone-click", label: "React.MouseEvent<HTMLButtonElement>" },
      ],
      validation: {
        type: "exact",
        answer: { "drag-1": "zone-change", "drag-2": "zone-form", "drag-3": "zone-click" },
      },
      hint: "Cada evento tiene un tipo que coincide con su nombre y elemento HTML.",
      explanation: "React provee tipos especificos para cada combinacion de evento y elemento HTML.",
    },
    {
      id: "ts04-ej-05",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 5,
      prompt: "Que tipo se usa para la prop children en React con TypeScript?",
      options: [
        { id: "a", text: "React.Children", isCorrect: false },
        { id: "b", text: "JSX.Element", isCorrect: false },
        { id: "c", text: "React.ReactNode", isCorrect: true },
        { id: "d", text: "string", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Es el tipo mas flexible para children — acepta elementos, strings, numeros, etc.",
      explanation: "React.ReactNode acepta cualquier contenido valido en JSX: elementos, texto, numeros, null, etc.",
    },
  ],
};
