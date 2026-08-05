import type { ModuleData } from "@/types";

export const nextjsServerActionsModule: ModuleData = {
  slug: "nextjs-05-server-actions",
  title: "Server Actions",
  description: "Mutaciones del servidor sin API routes: 'use server', formularios con actions y revalidación.",
  order: 305,
  category: "nextjs-advanced",
  icon: "code",
  dojo: "nextjs",
  lessons: [
    {
      id: "njs05-leccion-01",
      title: "Que son Server Actions",
      content: `## Server Actions

Las Server Actions son funciones que se ejecutan en el **servidor** y se pueden llamar directamente desde formularios o Client Components.

### Definir una Server Action

\`\`\`tsx
// app/actions.ts
"use server";

export async function crearPost(formData: FormData) {
  const titulo = formData.get("titulo") as string;
  const contenido = formData.get("contenido") as string;

  await db.post.create({
    data: { titulo, contenido },
  });

  revalidatePath("/posts"); // actualiza la pagina
}
\`\`\`

### Usar en un formulario

\`\`\`tsx
// app/posts/nuevo/page.tsx
import { crearPost } from "../actions";

export default function NuevoPost() {
  return (
    <form action={crearPost}>
      <input name="titulo" placeholder="Titulo" required />
      <textarea name="contenido" placeholder="Contenido" required />
      <button type="submit">Publicar</button>
    </form>
  );
}
\`\`\`

### ¿Cómo funciona?

1. El usuario envia el formulario
2. Next.js serializa el FormData
3. Se envia al servidor (como un POST request automático)
4. La función \`crearPost\` se ejecuta en el servidor
5. \`revalidatePath\` actualiza los datos en la página

> No necesitas crear un API route + fetch + useState. La Server Action hace todo.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #cba6f7; border-radius: 8px; white-space: pre-line; }',
        editable: true,
      },
      order: 1,
    },
    {
      id: "njs05-leccion-02",
      title: "Validación y estados",
      content: `## Validación en Server Actions

\`\`\`tsx
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

const PostSchema = z.object({
  titulo: z.string().min(3, "Minimo 3 caracteres"),
  contenido: z.string().min(10, "Minimo 10 caracteres"),
});

export async function crearPost(formData: FormData) {
  const raw = {
    titulo: formData.get("titulo"),
    contenido: formData.get("contenido"),
  };

  const result = PostSchema.safeParse(raw);
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  await db.post.create({ data: result.data });
  revalidatePath("/posts");
  return { success: true };
}
\`\`\`

### useFormStatus — estado del formulario

\`\`\`tsx
"use client";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Guardando..." : "Guardar"}
    </button>
  );
}
\`\`\`

### useActionState — manejar respuesta

\`\`\`tsx
"use client";
import { useActionState } from "react";
import { crearPost } from "./actions";

function PostForm() {
  const [state, formAction] = useActionState(crearPost, null);

  return (
    <form action={formAction}>
      <input name="titulo" />
      {state?.error?.titulo && <p>{state.error.titulo}</p>}
      <textarea name="contenido" />
      {state?.error?.contenido && <p>{state.error.contenido}</p>}
      <SubmitButton />
    </form>
  );
}
\`\`\`

### revalidatePath vs revalidateTag

\`\`\`typescript
import { revalidatePath, revalidateTag } from "next/cache";

// Revalida una ruta especifica
revalidatePath("/posts");

// Revalida por tag (mas granular)
revalidateTag("posts");
\`\`\`

> Server Actions + Zod + useFormStatus es el patrón moderno para formularios en Next.js.`,
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
      id: "njs05-ej-01",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 1,
      prompt: '¿Qué directiva marca una función como Server Action?',
      options: [
        { id: "a", text: '"use client"', isCorrect: false },
        { id: "b", text: '"use server"', isCorrect: true },
        { id: "c", text: '"use action"', isCorrect: false },
        { id: "d", text: "export server", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Es la contraparte de 'use client'.",
      explanation: '"use server" al inicio del archivo indica que todas las funciones exportadas son Server Actions.',
    },
    {
      id: "njs05-ej-02",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 2,
      prompt: "¿Cómo se conecta una Server Action a un formulario?",
      options: [
        { id: "a", text: "Con onSubmit={action}", isCorrect: false },
        { id: "b", text: "Con action={serverAction}", isCorrect: true },
        { id: "c", text: "Con method='server'", isCorrect: false },
        { id: "d", text: "Con fetch() en useEffect", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Se pasa como prop action del <form>.",
      explanation: "En Next.js, la prop action del form acepta una Server Action directamente. No necesitas fetch.",
    },
    {
      id: "njs05-ej-03",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 3,
      prompt: "¿Qué hace revalidatePath('/posts') después de una Server Action?",
      options: [
        { id: "a", text: "Redirige a /posts", isCorrect: false },
        { id: "b", text: "Borra la página /posts", isCorrect: false },
        { id: "c", text: "Marca los datos de /posts como stale y los re-renderiza", isCorrect: true },
        { id: "d", text: "Crea la ruta /posts", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Revalidar = volver a obtener datos frescos.",
      explanation: "revalidatePath invalida el cache de esa ruta, forzando a Next.js a re-renderizar con datos actualizados.",
    },
    {
      id: "njs05-ej-04",
      type: "drag-drop",
      difficulty: 3 ,
      xpReward: 30,
      order: 4,
      prompt: "Ordena el flujo de una Server Action con formulario:",
      dragItems: [
        { id: "drag-1", content: "revalidatePath actualiza la UI", correctZone: "zone-4" },
        { id: "drag-2", content: "Usuario envia el formulario", correctZone: "zone-1" },
        { id: "drag-3", content: "La funcion se ejecuta en el servidor", correctZone: "zone-3" },
        { id: "drag-4", content: "FormData se serializa y envia", correctZone: "zone-2" },
      ],
      dropZones: [
        { id: "zone-1", label: "Paso 1" },
        { id: "zone-2", label: "Paso 2" },
        { id: "zone-3", label: "Paso 3" },
        { id: "zone-4", label: "Paso 4" },
      ],
      validation: {
        type: "exact",
        answer: { "drag-2": "zone-1", "drag-4": "zone-2", "drag-3": "zone-3", "drag-1": "zone-4" },
      },
      hint: "Empieza con el usuario, termina con la UI actualizada.",
      explanation: "El flujo: submit → serializar FormData → ejecutar en servidor → revalidar y actualizar UI.",
    },
    {
      id: "njs05-ej-05",
      type: "code-completion",
      difficulty: 2,
      xpReward: 20,
      order: 5,
      prompt:
        "Esta función tiene que ejecutarse en el servidor aunque se la llame desde un formulario del cliente. Completá la directiva:",
      codeTemplate: {
        html: "",
        cssPrefix: 'export async function crearPost(formData) {\n  "',
        cssSuffix: '";\n  await db.posts.insert(formData);\n}',
        blanks: ["use server"],
      },
      validation: { type: "exact", answer: "use server" },
      hint: "Dos palabras, en inglés. Es la contraparte de la que marca los componentes de cliente.",
      explanation:
        "La directiva convierte la función en un endpoint que Next.js expone solo, y el cliente recibe una referencia en lugar del código. Por eso adentro podés tocar la base de datos y usar secretos sin que nada de eso llegue al navegador. Y por eso mismo hay que validar los datos que entran: la llamada viene de afuera, como cualquier endpoint.",
    },
    {
      id: "njs05-ej-06",
      type: "code-completion",
      difficulty: 3,
      xpReward: 25,
      order: 6,
      prompt:
        "Después de insertar el post, la lista cacheada quedó vieja. Completá la función que marca esa ruta para volver a generarla:",
      codeTemplate: {
        html: "",
        cssPrefix: "await db.posts.insert(formData);\n",
        cssSuffix: '("/blog");',
        blanks: ["revalidatePath"],
      },
      validation: { type: "exact", answer: "revalidatePath" },
      hint: "Invalida el cache de una ruta concreta. El nombre dice qué revalida.",
      explanation:
        "Sin esto la mutación funciona y la pantalla sigue mostrando la lista vieja, que es el bug más frustrante de depurar: los datos están bien en la base y mal en el navegador. revalidatePath descarta el cache de esa ruta y la próxima visita la regenera. Es el equivalente de invalidateQueries, pero del lado del servidor.",
    },
  ],
};
