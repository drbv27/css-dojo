// Configuracion del sondeo/pre-lanzamiento de la linea de productos.
// Landing en /cursos (hub con cards) + detalle por curso en /cursos/[slug].
// Ademas validamos el Sandbox (mini-Vercel sobre el VPS de Hostinger + Coolify).
// Todo el contenido/precios editable vive aqui.

export const SURVEY_SLUG = "launch-2026";

// --- Precios de cursos (USD) ---
// Piso real de Diego: $15. Ancla de lanzamiento por encima del piso.
export const LAUNCH_PRICE_USD = 19; // precio de lanzamiento de un curso
export const REGULAR_PRICE_USD = 29; // precio "regular" tachado

// --- Bundle de los 3 cursos ---
export const BUNDLE_LAUNCH_USD = 49; // vs 3 x 29 = 87
export const BUNDLE_REGULAR_USD = 79;

// Tasa aproximada solo para mostrar un equivalente tangible en COP.
const USD_TO_COP = 4000;
export function usdToCop(usd: number): string {
  const cop = Math.round((usd * USD_TO_COP) / 1000) * 1000;
  return cop.toLocaleString("es-CO");
}

// Cierre del sondeo (ISO). Formateamos en es-CO al render.
export const SURVEY_CLOSES_AT = "2026-08-10T23:59:00-05:00";

// Badge + XP por PARTICIPAR (no por decir "si pagaria"), para no contaminar la senal.
export const OPEN_CODE_BADGE = "open-code-pionero";
export const OPEN_CODE_XP_REWARD = 40;

// --- Catalogo de productos (cards de la landing + pregunta de interes) ---
export const PRODUCTS = [
  {
    slug: "open-code",
    name: "Open Code",
    subtitle: "Programar con IA",
    short:
      "Trabaja con agentes, Specs, MCPs y automatizaciones para construir software más rápido y profesional dirigiendo la IA.",
    kind: "course" as const,
  },
  {
    slug: "backend-node",
    name: "Backend con Node.js",
    subtitle: "APIs y servidores con JavaScript",
    short:
      "Del cero al deploy: APIs REST, bases de datos, autenticación y buenas prácticas del lado del servidor.",
    kind: "course" as const,
  },
  {
    slug: "frontend-vue",
    name: "Frontend con Vue",
    subtitle: "Interfaces reactivas con Vue 3",
    short:
      "Crea aplicaciones frontend modernas y mantenibles con Vue 3, su Composition API y el ecosistema Vue.",
    kind: "course" as const,
  },
  {
    slug: "sandbox",
    name: "Sandbox Full Stack",
    subtitle: "Tu mini-Vercel",
    short:
      "Despliega tus MVPs con backend, base de datos y subdominio propio, sin pelear con configuraciones ni tarjetas de crédito.",
    kind: "service" as const,
  },
] as const;

export const COURSE_SLUGS = PRODUCTS.filter((p) => p.kind === "course").map((p) => p.slug);

// --- Que reservaria el alumno (senal dura de intencion de compra) ---
export const BUY_INTENT_OPTIONS = [
  { key: "bundle", label: `El pack completo (3 cursos) por $${BUNDLE_LAUNCH_USD}` },
  { key: "individual", label: "Uno o varios cursos sueltos" },
  { key: "sandbox-only", label: "Solo el Sandbox" },
  { key: "exploring", label: "Solo estoy explorando por ahora" },
] as const;

// --- Cuanto pagarian por el Sandbox (para decidir el modelo de cobro) ---
export const SANDBOX_WTP_OPTIONS = [
  { key: "monthly5", label: "$5 / mes" },
  { key: "yearly39", label: "$39 / año" },
  { key: "onetime15", label: "Pago único de $15" },
  { key: "only-bundle", label: "Solo si viene gratis con un curso" },
  { key: "no", label: "No lo pagaría" },
] as const;

export type ProductSlug = (typeof PRODUCTS)[number]["slug"];
export type BuyIntent = (typeof BUY_INTENT_OPTIONS)[number]["key"];
export type SandboxWtp = (typeof SANDBOX_WTP_OPTIONS)[number]["key"];

export const PRODUCT_SLUGS = PRODUCTS.map((p) => p.slug);
export const BUY_INTENT_KEYS = BUY_INTENT_OPTIONS.map((o) => o.key);
export const SANDBOX_WTP_KEYS = SANDBOX_WTP_OPTIONS.map((o) => o.key);

export function product(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}
export function productName(slug: string): string {
  return product(slug)?.name ?? slug;
}
export function buyIntentLabel(key: string): string {
  return BUY_INTENT_OPTIONS.find((o) => o.key === key)?.label ?? key;
}
export function sandboxWtpLabel(key: string): string {
  return SANDBOX_WTP_OPTIONS.find((o) => o.key === key)?.label ?? key;
}

// --- Contenido completo por curso (pagina de detalle /cursos/[slug]) ---
export interface CourseContent {
  slug: string;
  title: string;
  subtitle: string;
  tagline: string;
  description: string[];
  differentiator: string;
  pillars: { title: string; desc: string }[];
  syllabus: string[];
  outcomes: string[];
  closing: string;
}

export const COURSE_CONTENT: Record<string, CourseContent> = {
  "open-code": {
    slug: "open-code",
    title: "Open Code",
    subtitle: "Programar con IA",
    tagline:
      "Deja de usar la IA como un ayudante ocasional. Aprende a trabajar con agentes, Specs, MCPs y automatizaciones para construir software más rápido, más ordenado y con estándar profesional.",
    description: [
      "Open Code lleva el desarrollo asistido por IA a otro nivel: en lugar de tratar a la inteligencia artificial como un truco puntual, aprenderás a montar un flujo de trabajo donde vive dentro de tu proceso de desarrollo de forma permanente, con agentes, Specs, MCPs, automatizaciones y flujos en paralelo.",
      "Partimos desde cero —instalación y configuración— y llegamos hasta integrar OpenCode en proyectos reales, construyendo aplicaciones completas junto a herramientas modernas del ecosistema JavaScript y servicios en la nube.",
    ],
    differentiator:
      "No se trata solo de “aprender a usar la herramienta”. Aprenderás a diseñar un entorno de desarrollo moderno donde agentes, herramientas y automatizaciones trabajan a tu lado para multiplicar tu productividad, sin que pierdas el control del código ni tu criterio como desarrollador.",
    pillars: [
      { title: "Fundamentos de OpenCode", desc: "Instalación, configuración, la interfaz TUI, comandos clave (/init, /plan, /undo, /redo, /compact) y el Plan Mode." },
      { title: "Desarrollo asistido por IA", desc: "Agents, MCPs, Specs, automatizaciones y flujos en paralelo para producir más en menos tiempo." },
      { title: "Integración profesional", desc: "Git y GitHub (worktrees, revisiones asistidas), Supabase, Vercel y Next.js dentro de tu flujo." },
      { title: "Proyecto Full Stack", desc: "Una aplicación real construida de punta a punta usando IA en todo el ciclo de desarrollo." },
    ],
    syllabus: [
      "OpenCode a fondo: instalación, TUI, comandos, Plan Mode y personalización.",
      "Spec Driven Development (SDD): escribir Specs, implementarlas, verificarlas y definir criterios de aceptación.",
      "Agents y MCPs: Playwright, Context7, Supabase y cómo ampliar capacidades con herramientas externas.",
      "Git y GitHub asistidos: worktrees, comandos personalizados y revisiones de código con IA.",
      "Bases de datos: diseño de esquemas, migraciones y conexión vía MCP.",
      "Automatizaciones: agentes en paralelo, auditorías, accesibilidad, migraciones y tareas programadas.",
      "Proyectos prácticos: desde apps pequeñas hasta una app Full Stack real (Next.js, React, TypeScript, Supabase, Resend y despliegue en Vercel).",
      "Producción: configuración de entornos, despliegues y revisión final.",
    ],
    outcomes: [
      "Integrarás OpenCode de forma profesional en tu día a día.",
      "Usarás agentes, MCPs y automatizaciones para aumentar tu productividad.",
      "Construirás aplicaciones reales usando IA durante todo el ciclo de desarrollo.",
      "Diseñarás procesos modernos con Specs verificables, automatizaciones y despliegues listos para producción.",
    ],
    closing:
      "Al terminar tendrás una visión moderna del desarrollo asistido por IA y sabrás incorporar OpenCode como pieza clave de tu stack — potenciando tu trabajo sin reemplazar tu criterio, sino ampliando lo que eres capaz de construir.",
  },

  "backend-node": {
    slug: "backend-node",
    title: "Backend con Node.js",
    subtitle: "APIs y servidores con JavaScript",
    tagline:
      "Construye el motor de tus aplicaciones: APIs robustas, seguras y escalables con Node.js y el ecosistema moderno del backend.",
    description: [
      "En este curso pasas de escribir scripts sueltos a diseñar servicios de backend serios: APIs REST bien estructuradas, conexión a bases de datos, autenticación y las buenas prácticas que separan un proyecto de juguete de uno listo para producción.",
      "Aprenderás construyendo una API real de principio a fin, entendiendo qué pasa en cada capa —del request al modelo de datos— y por qué, para que puedas sostener y hacer crecer tu propio backend con confianza.",
    ],
    differentiator:
      "No memorizas recetas: entiendes el modelo mental del backend. Al terminar sabrás decidir cómo estructurar rutas, validar datos, manejar errores y proteger tu API, no solo copiar un tutorial.",
    pillars: [
      { title: "Fundamentos de Node.js", desc: "El runtime, módulos, asincronía, npm y cómo funciona un servidor por dentro." },
      { title: "APIs REST", desc: "Rutas, controladores, validación, manejo de errores y buenas prácticas con Express." },
      { title: "Bases de datos", desc: "Modelado de datos, CRUD, relaciones y conexión con una base de datos real." },
      { title: "Autenticación y despliegue", desc: "Registro, login con JWT, seguridad básica y publicar tu API en la nube." },
    ],
    syllabus: [
      "Fundamentos de Node.js: módulos, event loop, asincronía y npm.",
      "Servidor HTTP y Express: rutas, middlewares y estructura de un proyecto.",
      "APIs REST: diseño de endpoints, códigos de estado y buenas prácticas.",
      "Validación y manejo de errores centralizado.",
      "Bases de datos: modelado, CRUD y relaciones.",
      "Autenticación con JWT y protección de rutas.",
      "Variables de entorno, seguridad y buenas prácticas.",
      "Despliegue de la API en la nube y pruebas del flujo completo.",
    ],
    outcomes: [
      "Diseñarás y construirás una API REST completa desde cero.",
      "Conectarás tu backend a una base de datos real y modelarás sus datos.",
      "Implementarás registro y login seguros con JWT.",
      "Publicarás tu API en producción con buenas prácticas.",
    ],
    closing:
      "Al finalizar tendrás el backend que le faltaba a tus proyectos: sabrás levantar servicios propios, conectarlos a datos y exponerlos de forma segura para cualquier frontend o app.",
  },

  "frontend-vue": {
    slug: "frontend-vue",
    title: "Frontend con Vue",
    subtitle: "Interfaces reactivas con Vue 3",
    tagline:
      "Crea aplicaciones frontend modernas, reactivas y mantenibles con Vue 3 y su Composition API.",
    description: [
      "Vue es uno de los frameworks más queridos del frontend por su curva de aprendizaje amable y su potencia. En este curso construyes interfaces reactivas de verdad: componentes, estado, comunicación entre partes y navegación, con las prácticas actuales de Vue 3.",
      "Aprenderás haciendo una aplicación completa, entendiendo la reactividad y la Composition API para escribir código claro, reutilizable y fácil de mantener.",
    ],
    differentiator:
      "En vez de pelear con la sintaxis, entenderás cómo piensa Vue: reactividad, componentes y flujo de datos. Eso te deja construir interfaces complejas sin perder el orden.",
    pillars: [
      { title: "Fundamentos de Vue 3", desc: "Reactividad, plantillas, directivas y el ciclo de vida de un componente." },
      { title: "Componentes", desc: "Props, eventos, slots y composición de interfaces reutilizables." },
      { title: "Composition API", desc: "refs, computed, watch y composables para organizar la lógica." },
      { title: "App real", desc: "Ruteo con Vue Router, estado global y consumo de una API." },
    ],
    syllabus: [
      "Fundamentos de Vue 3: reactividad, plantillas y directivas.",
      "Componentes: props, eventos y slots.",
      "Composition API: setup, ref, reactive, computed y watch.",
      "Composables: extraer y reutilizar lógica.",
      "Vue Router: navegación y rutas dinámicas.",
      "Manejo de estado (Pinia) para apps más grandes.",
      "Consumo de APIs y manejo de datos asíncronos.",
      "Buenas prácticas, estructura de proyecto y despliegue.",
    ],
    outcomes: [
      "Construirás interfaces reactivas con componentes reutilizables.",
      "Dominarás la Composition API para organizar tu lógica.",
      "Navegarás entre vistas y manejarás estado global.",
      "Conectarás tu frontend a una API y desplegarás la app.",
    ],
    closing:
      "Al finalizar sabrás construir frontends modernos con Vue de punta a punta — y, combinado con el backend, tendrás el kit completo para lanzar aplicaciones reales.",
  },
};

export function courseContent(slug: string): CourseContent | undefined {
  return COURSE_CONTENT[slug];
}

// --- Curso GRATUITO: Backend con Python (lista de espera, sin pago) ---
export const PYTHON_WAITLIST_SLUG = "backend-python";
export const PYTHON_XP_REWARD = 15; // XP por apuntarse a la lista

export const BACKEND_PYTHON: CourseContent = {
  slug: "backend-python",
  title: "Backend con Python",
  subtitle: "SQL, Django y FastAPI",
  tagline:
    "Aprende backend de verdad con Python: bases de datos con SQL, aplicaciones completas con Django y APIs modernas con FastAPI. 100% gratis.",
  description: [
    "Python es uno de los lenguajes más pedidos del mundo y una puerta de entrada perfecta al backend. En este curso gratuito construyes desde una base de datos bien diseñada hasta aplicaciones y APIs listas para el mundo real.",
    "Empezamos con SQL para que entiendas cómo se guardan y relacionan los datos, seguimos con Django para levantar aplicaciones completas (con su ORM, panel de administración y autenticación incluidos) y cerramos con FastAPI para construir APIs modernas, rápidas y tipadas.",
  ],
  differentiator:
    "No es un tutorial suelto: es una ruta ordenada de datos → aplicación → API. Al terminar entenderás cuándo usar un framework completo como Django y cuándo un micro-framework de APIs como FastAPI, y sabrás construir ambos.",
  pillars: [
    { title: "Fundamentos y SQL", desc: "Python para backend y bases de datos relacionales: tablas, relaciones, consultas y modelado con SQL." },
    { title: "Django", desc: "Aplicaciones completas: modelos y ORM, migraciones, panel de administración, autenticación y vistas." },
    { title: "APIs con FastAPI", desc: "Endpoints async, validación con Pydantic, documentación automática (OpenAPI/Swagger) y buenas prácticas." },
    { title: "Proyecto y despliegue", desc: "Un proyecto real de punta a punta y su publicación en la nube." },
  ],
  syllabus: [
    "Fundamentos de Python orientados al backend.",
    "SQL: tablas, relaciones, consultas, JOINs y modelado de datos.",
    "Django: proyecto, apps, modelos y el ORM.",
    "Migraciones, panel de administración y autenticación con Django.",
    "Vistas, plantillas y formularios.",
    "APIs con FastAPI: rutas, Pydantic y validación.",
    "Documentación automática y manejo de errores.",
    "Proyecto final y despliegue en la nube.",
  ],
  outcomes: [
    "Diseñarás y consultarás bases de datos con SQL.",
    "Construirás aplicaciones completas con Django y su ORM.",
    "Crearás APIs modernas y documentadas con FastAPI.",
    "Publicarás un proyecto de backend real en producción.",
  ],
  closing:
    "Al terminar tendrás una base sólida de backend con Python — el complemento perfecto para dar el salto, más adelante, a los cursos premium de la ruta.",
};
