import type { ModuleData } from "@/types";

export const nextjsServerComponentsModule: ModuleData = {
  slug: "nextjs-03-server-components",
  title: "Server y Client Components",
  description: "Server Components vs Client Components: cuando usar cada uno, 'use client' y data fetching.",
  order: 303,
  category: "nextjs-intermediate",
  icon: "code",
  dojo: "nextjs",
  lessons: [
    {
      id: "njs03-leccion-01",
      title: "Server vs Client Components",
      content: `## Server Components (por defecto)

En App Router, **todos los componentes son Server Components** por defecto.

### Que pueden hacer los Server Components?

\`\`\`tsx
// Esto se ejecuta en el SERVIDOR, no en el navegador
export default async function Usuarios() {
  // Acceso directo a base de datos
  const users = await db.user.findMany();

  // Acceso a variables de entorno del servidor
  const apiKey = process.env.SECRET_API_KEY;

  // Fetch sin useEffect
  const res = await fetch("https://api.example.com/data");
  const data = await res.json();

  return (
    <ul>
      {users.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
}
\`\`\`

### Que NO pueden hacer?

- No pueden usar \`useState\`, \`useEffect\`, ni ningun hook de React
- No pueden usar event handlers (\`onClick\`, \`onChange\`)
- No pueden acceder a APIs del navegador (\`window\`, \`localStorage\`)

### Client Components — "use client"

\`\`\`tsx
"use client"; // esta directiva lo convierte en Client Component

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
\`\`\`

### Regla de oro

> **Server por defecto.** Solo usa "use client" cuando necesites interactividad, hooks o APIs del navegador.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #89b4fa; border-radius: 8px; white-space: pre-line; }',
        editable: true,
      },
      order: 1,
    },
    {
      id: "njs03-leccion-02",
      title: "Patrones de composicion",
      content: `## Combinar Server y Client Components

El patron mas importante: **Server Component como padre, Client Component como hijo**.

\`\`\`tsx
// app/dashboard/page.tsx — Server Component
import { getUser } from "@/lib/db";
import InteractiveChart from "@/components/InteractiveChart";

export default async function Dashboard() {
  const user = await getUser(); // server-side

  return (
    <div>
      <h1>Hola, {user.name}</h1>          {/* Server: sin JS */}
      <InteractiveChart data={user.stats} /> {/* Client: con JS */}
    </div>
  );
}
\`\`\`

\`\`\`tsx
// components/InteractiveChart.tsx — Client Component
"use client";
import { useState } from "react";

export default function InteractiveChart({ data }) {
  const [zoom, setZoom] = useState(1);
  return <div onClick={() => setZoom(z => z + 1)}>...</div>;
}
\`\`\`

### Pasar Server data a Client Components via props

\`\`\`tsx
// Server Component
const data = await fetchExpensiveData(); // se ejecuta en el servidor
return <ClientChart data={data} />; // data se serializa y se envia al cliente
\`\`\`

### Cuando usar cada uno?

| Necesitas... | Server Component | Client Component |
|-------------|-----------------|-----------------|
| Fetch de datos | Si | No (usa TanStack Query) |
| Acceso a DB | Si | No |
| useState/useEffect | No | Si |
| onClick/onChange | No | Si |
| localStorage/window | No | Si |

> Piensa en los Server Components como el "backend" de tu UI y los Client Components como las partes interactivas.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #a6e3a1; border-radius: 8px; white-space: pre-line; }',
        editable: true,
      },
      order: 2,
    },
  ],
  exercises: [
    {
      id: "njs03-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "En Next.js App Router, los componentes son Server o Client por defecto?",
      options: [
        { id: "a", text: "Client Components por defecto", isCorrect: false },
        { id: "b", text: "Server Components por defecto", isCorrect: true },
        { id: "c", text: "Depende del archivo", isCorrect: false },
        { id: "d", text: "Ambos por igual", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Es lo opuesto a React puro.",
      explanation: "En App Router todo es Server Component por defecto. Usas 'use client' para opt-in a Client Component.",
    },
    {
      id: "njs03-ej-02",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 2,
      prompt: 'Que directiva convierte un componente en Client Component?',
      options: [
        { id: "a", text: '"use server"', isCorrect: false },
        { id: "b", text: '"use client"', isCorrect: true },
        { id: "c", text: '"use browser"', isCorrect: false },
        { id: "d", text: "export client", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Va al inicio del archivo.",
      explanation: '"use client" al inicio del archivo indica que ese componente (y sus hijos importados) se ejecutan en el navegador.',
    },
    {
      id: "njs03-ej-03",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 3,
      prompt: "Clasifica cada funcionalidad como Server o Client Component:",
      dragItems: [
        { id: "drag-1", content: "Acceso a base de datos", correctZone: "zone-server" },
        { id: "drag-2", content: "useState y useEffect", correctZone: "zone-client" },
        { id: "drag-3", content: "onClick handlers", correctZone: "zone-client" },
        { id: "drag-4", content: "fetch con async/await directo", correctZone: "zone-server" },
      ],
      dropZones: [
        { id: "zone-server", label: "Server Component" },
        { id: "zone-client", label: "Client Component" },
      ],
      validation: {
        type: "exact",
        answer: { "drag-1": "zone-server", "drag-2": "zone-client", "drag-3": "zone-client", "drag-4": "zone-server" },
      },
      hint: "Server = datos, Client = interactividad.",
      explanation: "Server Components manejan datos y acceso a recursos del servidor. Client Components manejan interactividad del usuario.",
    },
    {
      id: "njs03-ej-04",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt: "Cual es el patron recomendado para combinar Server y Client Components?",
      options: [
        { id: "a", text: "Todo Client Component con useEffect para fetch", isCorrect: false },
        { id: "b", text: "Server Component como padre que pasa datos a Client Components hijos", isCorrect: true },
        { id: "c", text: "Separar en dos aplicaciones diferentes", isCorrect: false },
        { id: "d", text: "Usar solo Server Components", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "El padre obtiene los datos, el hijo maneja la interactividad.",
      explanation: "El patron ideal: Server Component obtiene datos y los pasa como props a Client Components interactivos.",
    },
  ],
};
