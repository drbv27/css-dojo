import type { ModuleData } from "@/types";

export const reactEcoZustandModule: ModuleData = {
  slug: "react-eco-02-zustand",
  title: "Zustand",
  description: "Estado global simple y ligero con Zustand: stores, acciones, selectores y persistencia.",
  order: 202,
  category: "react-eco-state",
  icon: "code",
  dojo: "react-eco",
  lessons: [
    {
      id: "reco02-leccion-01",
      title: "Crear un Store",
      content: `## Zustand — Estado global simple

Zustand es una alternativa ligera a Redux y Context para manejar estado global.

### Instalacion

\`\`\`bash
npm install zustand
\`\`\`

### Tu primer store

\`\`\`typescript
import { create } from "zustand";

interface CounterStore {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

const useCounter = create<CounterStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));
\`\`\`

### Usar en componentes

\`\`\`jsx
function Counter() {
  const { count, increment, decrement } = useCounter();

  return (
    <div>
      <p>{count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}
\`\`\`

### Selectores — solo re-renderizar lo necesario

\`\`\`jsx
// Solo se re-renderiza cuando cambia count
const count = useCounter((state) => state.count);

// Solo se re-renderiza cuando cambia increment
const increment = useCounter((state) => state.increment);
\`\`\`

> Zustand no necesita Provider. El store es accesible desde cualquier componente.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #a6e3a1; border-radius: 8px; white-space: pre-line; }',
        editable: true,
      },
      order: 1,
    },
    {
      id: "reco02-leccion-02",
      title: "Persistencia y patrones",
      content: `## Persist Middleware

Guarda el estado en localStorage automaticamente:

\`\`\`typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeStore {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const useTheme = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: "dark",
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "dark" ? "light" : "dark",
        })),
    }),
    { name: "theme-storage" } // clave en localStorage
  )
);
\`\`\`

### Store con datos async

\`\`\`typescript
interface UsersStore {
  users: User[];
  loading: boolean;
  fetchUsers: () => Promise<void>;
}

const useUsers = create<UsersStore>((set) => ({
  users: [],
  loading: false,
  fetchUsers: async () => {
    set({ loading: true });
    const res = await fetch("/api/users");
    const users = await res.json();
    set({ users, loading: false });
  },
}));
\`\`\`

### Zustand vs Context

| Caracteristica | Context | Zustand |
|---------------|---------|---------|
| Boilerplate | Mucho (Provider, reducer) | Minimo |
| Re-renders | Todo el arbol bajo Provider | Solo componentes suscritos |
| Async | Manual | Directo en acciones |
| DevTools | No built-in | Si (middleware) |
| Persistencia | Manual | persist() middleware |

> Zustand brilla por su simplicidad: menos codigo, menos re-renders, menos configuracion.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #f9e2af; border-radius: 8px; white-space: pre-line; }',
        editable: true,
      },
      order: 2,
    },
  ],
  exercises: [
    {
      id: "reco02-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "Que funcion se usa para crear un store en Zustand?",
      options: [
        { id: "a", text: "createStore()", isCorrect: false },
        { id: "b", text: "create()", isCorrect: true },
        { id: "c", text: "useStore()", isCorrect: false },
        { id: "d", text: "new Store()", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Se importa de 'zustand'.",
      explanation: "La funcion create() de Zustand crea un hook personalizado que es tu store.",
    },
    {
      id: "reco02-ej-02",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 2,
      prompt: "Cual es la ventaja principal de usar selectores en Zustand?",
      options: [
        { id: "a", text: "Hace el codigo mas corto", isCorrect: false },
        { id: "b", text: "Solo re-renderiza el componente cuando cambia el dato seleccionado", isCorrect: true },
        { id: "c", text: "Permite usar TypeScript", isCorrect: false },
        { id: "d", text: "Agrega validacion automatica", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Tiene que ver con el rendimiento y re-renders.",
      explanation: "Los selectores evitan re-renders innecesarios: el componente solo se actualiza si cambia el dato que selecciono.",
    },
    {
      id: "reco02-ej-03",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 3,
      prompt: "Que middleware de Zustand guarda el estado en localStorage?",
      options: [
        { id: "a", text: "devtools", isCorrect: false },
        { id: "b", text: "immer", isCorrect: false },
        { id: "c", text: "persist", isCorrect: true },
        { id: "d", text: "storage", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Persistir = guardar para que sobreviva al recargar.",
      explanation: "El middleware persist() guarda y restaura el estado automaticamente desde localStorage.",
    },
    {
      id: "reco02-ej-04",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt: "Asocia cada caracteristica con la solucion correcta:",
      dragItems: [
        { id: "drag-1", content: "Necesita Provider", correctZone: "zone-context" },
        { id: "drag-2", content: "Selectores para evitar re-renders", correctZone: "zone-zustand" },
        { id: "drag-3", content: "persist() para localStorage", correctZone: "zone-zustand" },
      ],
      dropZones: [
        { id: "zone-context", label: "React Context" },
        { id: "zone-zustand", label: "Zustand" },
      ],
      validation: {
        type: "exact",
        answer: { "drag-1": "zone-context", "drag-2": "zone-zustand", "drag-3": "zone-zustand" },
      },
      hint: "Context requiere Provider, Zustand tiene selectores y persist built-in.",
      explanation: "Context necesita envolver componentes en Provider. Zustand ofrece selectores y persistencia sin boilerplate.",
    },
  ],
};
