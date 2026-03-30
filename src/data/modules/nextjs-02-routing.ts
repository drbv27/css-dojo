import type { ModuleData } from "@/types";

export const nextjsRoutingModule: ModuleData = {
  slug: "nextjs-02-routing",
  title: "Routing en Next.js",
  description: "File-based routing, rutas dinamicas, grupos de rutas y archivos especiales.",
  order: 302,
  category: "nextjs-fundamentals",
  icon: "code",
  dojo: "nextjs",
  lessons: [
    {
      id: "njs02-leccion-01",
      title: "Rutas dinamicas y grupos",
      content: `## Rutas dinamicas con [slug]

\`\`\`
app/
  blog/
    [slug]/
      page.tsx    -> /blog/mi-post, /blog/otro-post
\`\`\`

\`\`\`tsx
// app/blog/[slug]/page.tsx
export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <h1>Post: {slug}</h1>;
}
\`\`\`

### Grupos de rutas (route groups)

Organizan rutas **sin afectar la URL**:

\`\`\`
app/
  (auth)/
    login/page.tsx     -> /login
    registro/page.tsx  -> /registro
  (app)/
    dashboard/page.tsx -> /dashboard
    perfil/page.tsx    -> /perfil
\`\`\`

Cada grupo puede tener su propio layout:

\`\`\`tsx
// app/(auth)/layout.tsx — solo para login y registro
export default function AuthLayout({ children }) {
  return <div className="centrado">{children}</div>;
}

// app/(app)/layout.tsx — solo para dashboard y perfil
export default function AppLayout({ children }) {
  return <div className="con-sidebar"><Sidebar />{children}</div>;
}
\`\`\`

### Catch-all routes

\`\`\`
app/docs/[...slug]/page.tsx -> /docs/a, /docs/a/b, /docs/a/b/c
\`\`\`

\`\`\`tsx
// params.slug sera un array: ["a", "b", "c"]
export default async function Docs({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return <p>Path: {slug.join("/")}</p>;
}
\`\`\``,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #89b4fa; border-radius: 8px; white-space: pre-line; }',
        editable: true,
      },
      order: 1,
    },
    {
      id: "njs02-leccion-02",
      title: "Archivos especiales",
      content: `## Archivos especiales de Next.js

Cada carpeta puede tener estos archivos con funciones especificas:

### loading.tsx — skeleton mientras carga

\`\`\`tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <div className="animate-pulse">Cargando dashboard...</div>;
}
\`\`\`

Next.js lo muestra automaticamente mientras page.tsx se renderiza en el servidor.

### error.tsx — manejo de errores

\`\`\`tsx
"use client"; // error.tsx DEBE ser client component

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h2>Algo salio mal</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Reintentar</button>
    </div>
  );
}
\`\`\`

### not-found.tsx — pagina 404

\`\`\`tsx
// app/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h2>404 — Pagina no encontrada</h2>
      <a href="/">Volver al inicio</a>
    </div>
  );
}
\`\`\`

### Jerarquia de archivos

\`\`\`
layout.tsx      <- estructura
  loading.tsx   <- skeleton
    error.tsx   <- boundary de error
      page.tsx  <- contenido
\`\`\`

> Next.js envuelve tu page.tsx automaticamente con Suspense (loading) y ErrorBoundary (error).`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #f38ba8; border-radius: 8px; white-space: pre-line; }',
        editable: true,
      },
      order: 2,
    },
  ],
  exercises: [
    {
      id: "njs02-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "Como creas una ruta dinamica en Next.js App Router?",
      options: [
        { id: "a", text: "Usando :id en el nombre del archivo", isCorrect: false },
        { id: "b", text: "Creando una carpeta con [brackets]", isCorrect: true },
        { id: "c", text: "Con un archivo routes.config.ts", isCorrect: false },
        { id: "d", text: "Usando React Router", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Los corchetes [] indican un segmento dinamico.",
      explanation: "Una carpeta [slug] crea una ruta dinamica. El valor se accede via params.",
    },
    {
      id: "njs02-ej-02",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 2,
      prompt: "Para que sirven los route groups como (auth)?",
      options: [
        { id: "a", text: "Agregan /auth a la URL", isCorrect: false },
        { id: "b", text: "Organizan archivos sin afectar la URL", isCorrect: true },
        { id: "c", text: "Protegen rutas con autenticacion", isCorrect: false },
        { id: "d", text: "Crean APIs", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Los parentesis () se usan para agrupar sin impacto en la URL.",
      explanation: "Route groups (parentesis) organizan carpetas y permiten layouts diferentes sin modificar la URL.",
    },
    {
      id: "njs02-ej-03",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 3,
      prompt: "Que archivo se muestra automaticamente mientras una pagina carga en el servidor?",
      options: [
        { id: "a", text: "skeleton.tsx", isCorrect: false },
        { id: "b", text: "loading.tsx", isCorrect: true },
        { id: "c", text: "fallback.tsx", isCorrect: false },
        { id: "d", text: "spinner.tsx", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "El nombre del archivo describe su funcion.",
      explanation: "loading.tsx se muestra automaticamente como fallback de Suspense mientras page.tsx renderiza.",
    },
    {
      id: "njs02-ej-04",
      type: "drag-drop",
      difficulty: 3,
      xpReward: 20,
      order: 4,
      prompt: "Asocia cada archivo especial con su funcion:",
      dragItems: [
        { id: "drag-1", content: "loading.tsx", correctZone: "zone-load" },
        { id: "drag-2", content: "error.tsx", correctZone: "zone-error" },
        { id: "drag-3", content: "not-found.tsx", correctZone: "zone-404" },
      ],
      dropZones: [
        { id: "zone-load", label: "UI de carga (skeleton)" },
        { id: "zone-error", label: "Manejo de errores de runtime" },
        { id: "zone-404", label: "Pagina no encontrada" },
      ],
      validation: {
        type: "exact",
        answer: { "drag-1": "zone-load", "drag-2": "zone-error", "drag-3": "zone-404" },
      },
      hint: "Cada archivo tiene un nombre descriptivo de su funcion.",
      explanation: "loading = carga, error = errores, not-found = 404.",
    },
  ],
};
