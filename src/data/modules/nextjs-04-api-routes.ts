import type { ModuleData } from "@/types";

export const nextjsApiRoutesModule: ModuleData = {
  slug: "nextjs-04-api-routes",
  title: "API Routes (Route Handlers)",
  description: "Crea tu backend con Route Handlers: GET, POST, PUT, DELETE con NextRequest y NextResponse.",
  order: 304,
  category: "nextjs-intermediate",
  icon: "code",
  dojo: "nextjs",
  lessons: [
    {
      id: "njs04-leccion-01",
      title: "Route Handlers basicos",
      content: `## Route Handlers — tu API en Next.js

En App Router, las APIs se definen con archivos \`route.ts\`:

\`\`\`
app/
  api/
    usuarios/
      route.ts     -> /api/usuarios (GET, POST)
      [id]/
        route.ts   -> /api/usuarios/123 (GET, PUT, DELETE)
\`\`\`

### GET — leer datos

\`\`\`typescript
// app/api/usuarios/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const usuarios = await db.user.findMany();
  return NextResponse.json(usuarios);
}
\`\`\`

### POST — crear datos

\`\`\`typescript
export async function POST(request: Request) {
  const body = await request.json();

  const usuario = await db.user.create({
    data: { nombre: body.nombre, email: body.email },
  });

  return NextResponse.json(usuario, { status: 201 });
}
\`\`\`

### Ruta dinamica — PUT y DELETE

\`\`\`typescript
// app/api/usuarios/[id]/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const usuario = await db.user.findUnique({ where: { id } });

  if (!usuario) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }
  return NextResponse.json(usuario);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
\`\`\`

> Cada funcion exportada (GET, POST, PUT, DELETE) maneja ese metodo HTTP.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #89b4fa; border-radius: 8px; white-space: pre-line; }',
        editable: true,
      },
      order: 1,
    },
    {
      id: "njs04-leccion-02",
      title: "Validacion y errores",
      content: `## Validar con Zod

\`\`\`typescript
import { NextResponse } from "next/server";
import { z } from "zod";

const CreateUserSchema = z.object({
  nombre: z.string().min(2),
  email: z.string().email(),
});

export async function POST(request: Request) {
  const body = await request.json();

  const result = CreateUserSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Datos invalidos", details: result.error.flatten() },
      { status: 400 }
    );
  }

  const usuario = await db.user.create({ data: result.data });
  return NextResponse.json(usuario, { status: 201 });
}
\`\`\`

### Headers y cookies

\`\`\`typescript
import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";

export async function GET(request: NextRequest) {
  // Leer headers
  const headerStore = await headers();
  const authToken = headerStore.get("authorization");

  // Leer cookies
  const cookieStore = await cookies();
  const session = cookieStore.get("session-token");

  // Leer search params
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") ?? "1";

  return NextResponse.json({ page });
}
\`\`\`

### Respuestas comunes

\`\`\`typescript
// 200 OK con datos
return NextResponse.json(data);

// 201 Created
return NextResponse.json(data, { status: 201 });

// 400 Bad Request
return NextResponse.json({ error: "Datos invalidos" }, { status: 400 });

// 401 Unauthorized
return NextResponse.json({ error: "No autorizado" }, { status: 401 });

// 404 Not Found
return NextResponse.json({ error: "No encontrado" }, { status: 404 });
\`\`\`

> Valida SIEMPRE el body del request. Nunca confies en datos del cliente.`,
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
      id: "njs04-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "Que archivo define una API route en App Router?",
      options: [
        { id: "a", text: "api.ts", isCorrect: false },
        { id: "b", text: "route.ts", isCorrect: true },
        { id: "c", text: "handler.ts", isCorrect: false },
        { id: "d", text: "endpoint.ts", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "El nombre del archivo indica que define una ruta.",
      explanation: "route.ts dentro de app/api/ define los handlers HTTP para esa ruta.",
    },
    {
      id: "njs04-ej-02",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 2,
      prompt: "Como defines un endpoint POST en un Route Handler?",
      options: [
        { id: "a", text: "app.post('/api/users', handler)", isCorrect: false },
        { id: "b", text: "export async function POST(request: Request) { ... }", isCorrect: true },
        { id: "c", text: "router.post(handler)", isCorrect: false },
        { id: "d", text: "export default handler", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Se exporta una funcion con el nombre del metodo HTTP.",
      explanation: "Exportas funciones nombradas GET, POST, PUT, DELETE. Next.js las asocia al metodo HTTP correspondiente.",
    },
    {
      id: "njs04-ej-03",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 3,
      prompt: "Que status code se usa al crear un recurso exitosamente?",
      options: [
        { id: "a", text: "200", isCorrect: false },
        { id: "b", text: "201", isCorrect: true },
        { id: "c", text: "204", isCorrect: false },
        { id: "d", text: "301", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "2XX = exito, pero uno es especifico para 'creado'.",
      explanation: "201 Created indica que el recurso se creo exitosamente. 200 es para respuestas generales.",
    },
    {
      id: "njs04-ej-04",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt: "Asocia cada metodo HTTP con su accion:",
      dragItems: [
        { id: "drag-1", content: "GET", correctZone: "zone-leer" },
        { id: "drag-2", content: "POST", correctZone: "zone-crear" },
        { id: "drag-3", content: "DELETE", correctZone: "zone-borrar" },
      ],
      dropZones: [
        { id: "zone-leer", label: "Leer/obtener datos" },
        { id: "zone-crear", label: "Crear un recurso nuevo" },
        { id: "zone-borrar", label: "Eliminar un recurso" },
      ],
      validation: {
        type: "exact",
        answer: { "drag-1": "zone-leer", "drag-2": "zone-crear", "drag-3": "zone-borrar" },
      },
      hint: "GET = obtener, POST = crear, DELETE = eliminar.",
      explanation: "GET lee datos, POST crea nuevos recursos, DELETE elimina recursos existentes.",
    },
  ],
};
