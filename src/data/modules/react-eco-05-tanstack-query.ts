import type { ModuleData } from "@/types";

export const reactEcoTanstackModule: ModuleData = {
  slug: "react-eco-05-tanstack-query",
  title: "TanStack Query",
  description: "Data fetching profesional con TanStack Query: useQuery, useMutation, cache y estados de carga.",
  order: 205,
  category: "react-eco-data",
  icon: "code",
  dojo: "react-eco",
  lessons: [
    {
      id: "reco05-leccion-01",
      title: "useQuery — leer datos",
      content: `## TanStack Query (React Query)

Maneja **data fetching, caching y sincronizacion** de datos del servidor.

### Instalacion

\`\`\`bash
npm install @tanstack/react-query
\`\`\`

### Setup — QueryClientProvider

\`\`\`jsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MiApp />
    </QueryClientProvider>
  );
}
\`\`\`

### useQuery — obtener datos

\`\`\`jsx
import { useQuery } from "@tanstack/react-query";

function Usuarios() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["usuarios"],
    queryFn: async () => {
      const res = await fetch("/api/usuarios");
      return res.json();
    },
  });

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.map(user => <li key={user.id}>{user.nombre}</li>)}
    </ul>
  );
}
\`\`\`

### queryKey — identifica y cachea

\`\`\`jsx
// Clave simple
useQuery({ queryKey: ["usuarios"], queryFn: fetchUsuarios });

// Clave con parametros — se re-fetcha si cambia el id
useQuery({ queryKey: ["usuario", id], queryFn: () => fetchUsuario(id) });

// Clave con filtros
useQuery({ queryKey: ["usuarios", { rol: "admin" }], queryFn: ... });
\`\`\`

> TanStack Query cachea automaticamente: si ya tienes los datos, los muestra al instante mientras re-valida en background.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #a6e3a1; border-radius: 8px; white-space: pre-line; }',
        editable: true,
      },
      order: 1,
    },
    {
      id: "reco05-leccion-02",
      title: "useMutation y cache",
      content: `## useMutation — modificar datos

\`\`\`jsx
import { useMutation, useQueryClient } from "@tanstack/react-query";

function CrearUsuario() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (nuevoUsuario) => {
      const res = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoUsuario),
      });
      return res.json();
    },
    onSuccess: () => {
      // Invalida el cache para que se re-fetchen los datos
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
  });

  return (
    <button
      onClick={() => mutation.mutate({ nombre: "Ana" })}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? "Creando..." : "Crear usuario"}
    </button>
  );
}
\`\`\`

### Estados de una mutation

\`\`\`jsx
const { mutate, isPending, isError, isSuccess, error } = useMutation({...});

// isPending — la peticion esta en curso
// isError — hubo un error
// isSuccess — se completo exitosamente
\`\`\`

### Stale time y refetch

\`\`\`jsx
useQuery({
  queryKey: ["usuarios"],
  queryFn: fetchUsuarios,
  staleTime: 5 * 60 * 1000, // 5 minutos: no re-fetcha si los datos tienen menos de 5 min
  refetchOnWindowFocus: true, // re-fetcha cuando el usuario vuelve a la pestana
});
\`\`\`

### TanStack Query vs useEffect + fetch

| Caracteristica | useEffect + fetch | TanStack Query |
|---------------|------------------|----------------|
| Cache | Manual | Automatico |
| Loading/Error | Manual con useState | Built-in |
| Refetch automatico | No | Si |
| Deduplicacion | No | Si (misma queryKey) |
| Optimistic updates | Manual | Built-in |

> TanStack Query elimina el 90% del codigo de data fetching que escribirias con useEffect.`,
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
      id: "reco05-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "Que hook de TanStack Query se usa para LEER datos del servidor?",
      options: [
        { id: "a", text: "useMutation", isCorrect: false },
        { id: "b", text: "useQuery", isCorrect: true },
        { id: "c", text: "useFetch", isCorrect: false },
        { id: "d", text: "useData", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Query = consulta, leer datos.",
      explanation: "useQuery se usa para leer/obtener datos del servidor con cache automatico.",
    },
    {
      id: "reco05-ej-02",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 2,
      prompt: "Para que sirve queryKey en useQuery?",
      options: [
        { id: "a", text: "Para encriptar los datos", isCorrect: false },
        { id: "b", text: "Para identificar y cachear la query de forma unica", isCorrect: true },
        { id: "c", text: "Para autenticar la peticion", isCorrect: false },
        { id: "d", text: "Para ordenar los resultados", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Es la clave que identifica estos datos en el cache.",
      explanation: "queryKey identifica la query de forma unica. Sirve para cachear, invalidar y deduplicar peticiones.",
    },
    {
      id: "reco05-ej-03",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 3,
      prompt: "Despues de crear un usuario con useMutation, como actualizas la lista?",
      options: [
        { id: "a", text: "window.location.reload()", isCorrect: false },
        { id: "b", text: "queryClient.invalidateQueries()", isCorrect: true },
        { id: "c", text: "useQuery.refetch()", isCorrect: false },
        { id: "d", text: "setState()", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Invalidas el cache para que se re-fetchen los datos.",
      explanation: "invalidateQueries marca el cache como stale, provocando un re-fetch automatico de los datos.",
    },
    {
      id: "reco05-ej-04",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt: "Asocia cada hook con su proposito:",
      dragItems: [
        { id: "drag-1", content: "useQuery", correctZone: "zone-leer" },
        { id: "drag-2", content: "useMutation", correctZone: "zone-escribir" },
        { id: "drag-3", content: "useQueryClient", correctZone: "zone-cache" },
      ],
      dropZones: [
        { id: "zone-leer", label: "Leer datos (GET)" },
        { id: "zone-escribir", label: "Modificar datos (POST/PUT/DELETE)" },
        { id: "zone-cache", label: "Acceder al cache para invalidar" },
      ],
      validation: {
        type: "exact",
        answer: { "drag-1": "zone-leer", "drag-2": "zone-escribir", "drag-3": "zone-cache" },
      },
      hint: "Query = leer, Mutation = modificar, QueryClient = gestionar cache.",
      explanation: "useQuery lee datos, useMutation los modifica, useQueryClient da acceso al cache.",
    },
  ],
};
