import type { ModuleData } from "@/types";

export const nextjsRoutingModule: ModuleData = {
  slug: "nextjs-02-routing",
  title: "Routing en Next.js",
  description: "File-based routing, rutas dinámicas, grupos de rutas y archivos especiales.",
  order: 302,
  category: "nextjs-fundamentals",
  icon: "code",
  dojo: "nextjs",
  lessons: [
    {
      id: "njs02-leccion-01",
      title: "Rutas dinámicas y grupos",
      content: `## Rutas dinámicas con [slug]

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

Cada carpeta puede tener estos archivos con funciones específicas:

### loading.tsx — skeleton mientras carga

\`\`\`tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <div className="animate-pulse">Cargando dashboard...</div>;
}
\`\`\`

Next.js lo muestra automáticamente mientras page.tsx se renderiza en el servidor.

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

### not-found.tsx — página 404

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

### Jerarquía de archivos

\`\`\`
layout.tsx      <- estructura
  loading.tsx   <- skeleton
    error.tsx   <- boundary de error
      page.tsx  <- contenido
\`\`\`

> Next.js envuelve tu page.tsx automáticamente con Suspense (loading) y ErrorBoundary (error).`,
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
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "¿Cómo creas una ruta dinámica en Next.js App Router?",
      options: [
        { id: "a", text: "Usando :id en el nombre del archivo", isCorrect: false },
        { id: "b", text: "Creando una carpeta con [brackets]", isCorrect: true },
        { id: "c", text: "Con un archivo routes.config.ts", isCorrect: false },
        { id: "d", text: "Usando React Router", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Los corchetes [] indican un segmento dinámico.",
      explanation: "Una carpeta [slug] crea una ruta dinámica. El valor se accede via params.",
    },
    {
      id: "njs02-ej-02",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 2,
      prompt: "¿Para que sirven los route groups como (auth)?",
      options: [
        { id: "a", text: "Agregan /auth a la URL", isCorrect: false },
        { id: "b", text: "Organizan archivos sin afectar la URL", isCorrect: true },
        { id: "c", text: "Protegen rutas con autenticación", isCorrect: false },
        { id: "d", text: "Crean APIs", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Los paréntesis () se usan para agrupar sin impacto en la URL.",
      explanation: "Route groups (paréntesis) organizan carpetas y permiten layouts diferentes sin modificar la URL.",
    },
    {
      id: "njs02-ej-03",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 3,
      prompt: "¿Qué archivo se muestra automáticamente mientras una página carga en el servidor?",
      options: [
        { id: "a", text: "skeleton.tsx", isCorrect: false },
        { id: "b", text: "loading.tsx", isCorrect: true },
        { id: "c", text: "fallback.tsx", isCorrect: false },
        { id: "d", text: "spinner.tsx", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "El nombre del archivo describe su función.",
      explanation: "loading.tsx se muestra automáticamente como fallback de Suspense mientras page.tsx renderiza.",
    },
    {
      id: "njs02-ej-04",
      type: "drag-drop",
      difficulty: 3 ,
      xpReward: 30,
      order: 4,
      prompt: "Asocia cada archivo especial con su función:",
      dragItems: [
        { id: "drag-1", content: "loading.tsx", correctZone: "zone-load" },
        { id: "drag-2", content: "error.tsx", correctZone: "zone-error" },
        { id: "drag-3", content: "not-found.tsx", correctZone: "zone-404" },
      ],
      dropZones: [
        { id: "zone-load", label: "UI de carga (skeleton)" },
        { id: "zone-error", label: "Manejo de errores de runtime" },
        { id: "zone-404", label: "Página no encontrada" },
      ],
      validation: {
        type: "exact",
        answer: { "drag-1": "zone-load", "drag-2": "zone-error", "drag-3": "zone-404" },
      },
      hint: "Cada archivo tiene un nombre descriptivo de su función.",
      explanation: "loading = carga, error = errores, not-found = 404.",
    },
    {
      id: "njs02-ej-05",
      type: "code-completion",
      difficulty: 2,
      xpReward: 20,
      order: 5,
      prompt:
        "Esta ruta tiene que servir /blog/mi-post y cualquier otro slug. Completá el nombre de la carpeta dinámica:",
      codeTemplate: {
        html: "",
        cssPrefix: "app/blog/",
        cssSuffix: "/page.tsx",
        blanks: ["[slug]"],
      },
      validation: { type: "exact", answer: "[slug]" },
      hint: "Los corchetes marcan la parte variable de la URL, y el nombre de adentro es la clave que llega en params.",
      explanation:
        "Los corchetes convierten el tramo en parámetro y el nombre elegido es la clave que llega en params, así que params.slug sale de haber escrito [slug]. Sin corchetes la carpeta responde solo a la URL literal /blog/slug.",
    },
    {
      id: "njs02-ej-06",
      type: "code-completion",
      difficulty: 3,
      xpReward: 25,
      order: 6,
      prompt:
        "Querés agrupar las rutas de autenticación para darles un layout propio, pero SIN que aparezca en la URL: /login tiene que seguir siendo /login. Completá la carpeta:",
      codeTemplate: {
        html: "",
        cssPrefix: "app/",
        cssSuffix: "/login/page.tsx\n// -> la URL sigue siendo /login",
        blanks: ["(auth)"],
      },
      validation: { type: "exact", answer: "(auth)" },
      hint: "Los paréntesis crean un grupo de rutas que se ignora al armar la URL.",
      explanation:
        "Los paréntesis crean un grupo: la carpeta organiza y puede tener su propio layout, pero desaparece de la URL. Con auth/ sin paréntesis la ruta pasaría a ser /auth/login. Es lo que permite que un grupo de rutas comparta layout sin ensuciar las direcciones que ve el usuario.",
    },
  ],
};
