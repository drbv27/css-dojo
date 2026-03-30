import type { ModuleData } from "@/types";

export const nextjsIntroModule: ModuleData = {
  slug: "nextjs-01-introduccion",
  title: "Introduccion a Next.js",
  description: "Que es Next.js, App Router vs Pages Router y por que elegirlo sobre React puro.",
  order: 301,
  category: "nextjs-fundamentals",
  icon: "code",
  dojo: "nextjs",
  lessons: [
    {
      id: "njs01-leccion-01",
      title: "Que es Next.js",
      content: `## Next.js — El framework de React

Next.js es un **framework** construido sobre React que agrega:

- **Rendering en el servidor** (SSR) y generacion estatica (SSG)
- **Routing basado en archivos** — no necesitas React Router
- **Server Components** — componentes que se ejecutan en el servidor
- **API Routes** — backend integrado
- **Optimizacion automatica** — imagenes, fonts, scripts

### App Router vs Pages Router

Next.js tiene dos sistemas de routing:

| Caracteristica | Pages Router (legacy) | App Router (moderno) |
|---------------|----------------------|---------------------|
| Directorio | \`pages/\` | \`app/\` |
| Componentes | Client por defecto | Server por defecto |
| Layouts | Manual | Nativos con layout.tsx |
| Loading states | Manual | loading.tsx |
| Data fetching | getServerSideProps | async/await directo |

> Este curso usa **App Router** — es el estandar desde Next.js 13+.

### Crear un proyecto

\`\`\`bash
npx create-next-app@latest mi-app
# Selecciona: TypeScript, Tailwind, App Router
cd mi-app
npm run dev
\`\`\`

### Estructura del proyecto

\`\`\`
mi-app/
  app/
    layout.tsx    <- layout raiz
    page.tsx      <- pagina de inicio (/)
    globals.css
  public/         <- archivos estaticos
  next.config.ts
\`\`\``,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #89b4fa; border-radius: 8px; white-space: pre-line; }',
        editable: true,
      },
      order: 1,
    },
    {
      id: "njs01-leccion-02",
      title: "Pages y Layouts",
      content: `## page.tsx — cada pagina es un archivo

\`\`\`tsx
// app/page.tsx -> ruta: /
export default function Home() {
  return <h1>Bienvenido a mi app</h1>;
}

// app/about/page.tsx -> ruta: /about
export default function About() {
  return <h1>Acerca de</h1>;
}
\`\`\`

### layout.tsx — estructura compartida

\`\`\`tsx
// app/layout.tsx — se aplica a TODAS las paginas
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <nav>Mi Navbar</nav>
        <main>{children}</main>
        <footer>Mi Footer</footer>
      </body>
    </html>
  );
}
\`\`\`

### Layouts anidados

\`\`\`tsx
// app/dashboard/layout.tsx — solo para /dashboard/*
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
\`\`\`

### Metadata

\`\`\`tsx
// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mi App",
  description: "Descripcion de mi aplicacion",
};
\`\`\`

> Next.js renderiza layouts en el servidor — el HTML llega listo al navegador, mejorando SEO y velocidad.`,
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
      id: "njs01-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "Que es Next.js?",
      options: [
        { id: "a", text: "Una libreria de CSS", isCorrect: false },
        { id: "b", text: "Un framework construido sobre React", isCorrect: true },
        { id: "c", text: "Un reemplazo de JavaScript", isCorrect: false },
        { id: "d", text: "Un ORM para bases de datos", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Next.js extiende React con features de servidor.",
      explanation: "Next.js es un framework de React que agrega SSR, routing, API routes y optimizaciones.",
    },
    {
      id: "njs01-ej-02",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 2,
      prompt: "En App Router, donde creas la pagina para la ruta /about?",
      options: [
        { id: "a", text: "pages/about.tsx", isCorrect: false },
        { id: "b", text: "app/about/page.tsx", isCorrect: true },
        { id: "c", text: "routes/about.tsx", isCorrect: false },
        { id: "d", text: "src/about.tsx", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "App Router usa la carpeta app/ y archivos page.tsx.",
      explanation: "En App Router, cada ruta es una carpeta con un archivo page.tsx dentro de app/.",
    },
    {
      id: "njs01-ej-03",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 3,
      prompt: "Para que sirve layout.tsx en Next.js?",
      options: [
        { id: "a", text: "Para definir estilos CSS", isCorrect: false },
        { id: "b", text: "Para definir la estructura compartida entre paginas", isCorrect: true },
        { id: "c", text: "Para manejar errores", isCorrect: false },
        { id: "d", text: "Para conectar a la base de datos", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Layout = estructura que envuelve las paginas.",
      explanation: "layout.tsx define UI compartida (navbar, sidebar, footer) que persiste entre navegaciones.",
    },
    {
      id: "njs01-ej-04",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt: "Asocia cada archivo con su funcion en Next.js:",
      dragItems: [
        { id: "drag-1", content: "page.tsx", correctZone: "zone-page" },
        { id: "drag-2", content: "layout.tsx", correctZone: "zone-layout" },
        { id: "drag-3", content: "loading.tsx", correctZone: "zone-loading" },
      ],
      dropZones: [
        { id: "zone-page", label: "Contenido de una ruta" },
        { id: "zone-layout", label: "Estructura compartida" },
        { id: "zone-loading", label: "UI mientras carga" },
      ],
      validation: {
        type: "exact",
        answer: { "drag-1": "zone-page", "drag-2": "zone-layout", "drag-3": "zone-loading" },
      },
      hint: "page = pagina, layout = estructura, loading = carga.",
      explanation: "page.tsx es el contenido, layout.tsx es la estructura envolvente, loading.tsx se muestra mientras carga.",
    },
  ],
};
