import type { ModuleData } from "@/types";

export const nextjsIntroModule: ModuleData = {
  slug: "nextjs-01-introduccion",
  title: "Introducción a Next.js",
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

- **Rendering en el servidor** (SSR) y generación estática (SSG)
- **Routing basado en archivos** — no necesitas React Router
- **Server Components** — componentes que se ejecutan en el servidor
- **API Routes** — backend integrado
- **Optimización automática** — imágenes, fonts, scripts

### App Router vs Pages Router

Next.js tiene dos sistemas de routing:

| Caracteristica | Pages Router (legacy) | App Router (moderno) |
|---------------|----------------------|---------------------|
| Directorio | \`pages/\` | \`app/\` |
| Componentes | Client por defecto | Server por defecto |
| Layouts | Manual | Nativos con layout.tsx |
| Loading states | Manual | loading.tsx |
| Data fetching | getServerSideProps | async/await directo |

> Este curso usa **App Router** — es el estándar desde Next.js 13+.

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
      content: `## page.tsx — cada página es un archivo

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
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "¿Qué es Next.js?",
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
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt: "En App Router, ¿dónde creas la página para la ruta /about?",
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
      difficulty: 2 ,
      xpReward: 20,
      order: 3,
      prompt: "¿Para que sirve layout.tsx en Next.js?",
      options: [
        { id: "a", text: "Para definir estilos CSS", isCorrect: false },
        { id: "b", text: "Para definir la estructura compartida entre páginas", isCorrect: true },
        { id: "c", text: "Para manejar errores", isCorrect: false },
        { id: "d", text: "Para conectar a la base de datos", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Layout = estructura que envuelve las páginas.",
      explanation: "layout.tsx define UI compartida (navbar, sidebar, footer) que persiste entre navegaciones.",
    },
    {
      id: "njs01-ej-04",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt: "Asocia cada archivo con su función en Next.js:",
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
      hint: "page = página, layout = estructura, loading = carga.",
      explanation: "page.tsx es el contenido, layout.tsx es la estructura envolvente, loading.tsx se muestra mientras carga.",
    },
    {
      id: "njs01-ej-05",
      type: "code-completion",
      difficulty: 2,
      xpReward: 20,
      order: 5,
      prompt:
        "En el App Router, una carpeta sola no crea una ruta: hace falta un archivo con un nombre reservado. Completá el nombre para que /blog sea navegable:",
      codeTemplate: {
        html: "",
        cssPrefix: "app/blog/",
        cssSuffix: "\n// -> ahora /blog responde",
        blanks: ["page.tsx"],
      },
      validation: { type: "exact", answer: "page.tsx" },
      hint: "El archivo que convierte una carpeta en una ruta pública. Lleva extensión.",
      explanation:
        "Sin page.tsx la carpeta existe pero la URL da 404, y eso es a propósito: te deja poner componentes, helpers y tests dentro de app/ sin que se vuelvan rutas por accidente. Es la diferencia con el Pages Router, donde cualquier archivo en pages/ era una ruta.",
    },
    {
      id: "njs01-ej-06",
      type: "code-completion",
      difficulty: 2,
      xpReward: 20,
      order: 6,
      prompt:
        "Un layout envuelve a las páginas que están debajo. Completá la prop que recibe el contenido de esas páginas:",
      codeTemplate: {
        html: "",
        cssPrefix: "export default function Layout({ ",
        cssSuffix: " }) {\n  return <section><Menu />{children}</section>;\n}",
        blanks: ["children"],
      },
      validation: { type: "exact", answer: "children" },
      hint: "El nombre estándar de React para el contenido anidado. Es el que ya se usa abajo en el JSX.",
      explanation:
        "El layout recibe la página en children y no se vuelve a montar al navegar entre rutas hermanas: el menú conserva su estado y solo cambia el contenido. Es lo que permite que un sidebar con scroll no salte cada vez que hacés clic en un enlace.",
    },
  ],
};
