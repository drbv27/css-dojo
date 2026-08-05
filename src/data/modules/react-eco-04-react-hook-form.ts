import type { ModuleData } from "@/types";

export const reactEcoHookFormModule: ModuleData = {
  slug: "react-eco-04-react-hook-form",
  title: "React Hook Form",
  description: "Formularios eficientes con React Hook Form: useForm, register, validación con Zod y manejo de errores.",
  order: 204,
  category: "react-eco-forms",
  icon: "code",
  dojo: "react-eco",
  lessons: [
    {
      id: "reco04-leccion-01",
      title: "Formularios con useForm",
      content: `## React Hook Form

Maneja formularios con **mínimos re-renders** y excelente performance.

### Instalación

\`\`\`bash
npm install react-hook-form
\`\`\`

### Formulario básico

\`\`\`jsx
import { useForm } from "react-hook-form";

function ContactForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data); // { nombre: "Ana", email: "ana@mail.com" }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("nombre", { required: "El nombre es obligatorio" })} />
      {errors.nombre && <p>{errors.nombre.message}</p>}

      <input {...register("email", {
        required: "El email es obligatorio",
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i,
          message: "Email invalido"
        }
      })} />
      {errors.email && <p>{errors.email.message}</p>}

      <button type="submit">Enviar</button>
    </form>
  );
}
\`\`\`

### register() — conecta inputs al formulario

\`\`\`jsx
// Spread en el input: name, onChange, onBlur, ref
<input {...register("campo")} />

// Con validacion
<input {...register("edad", {
  required: "Campo obligatorio",
  min: { value: 18, message: "Minimo 18 anos" },
  max: { value: 99, message: "Maximo 99 anos" },
})} />
\`\`\`

> React Hook Form no re-renderiza el formulario completo en cada keystroke — solo el campo que cambia.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #a6e3a1; border-radius: 8px; white-space: pre-line; }',
        editable: true,
      },
      order: 1,
    },
    {
      id: "reco04-leccion-02",
      title: "Validación con Zod",
      content: `## Zod + React Hook Form

Zod permite definir esquemas de validación tipados:

### Instalación

\`\`\`bash
npm install zod @hookform/resolvers
\`\`\`

### Esquema con Zod

\`\`\`typescript
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  nombre: z.string().min(2, "Minimo 2 caracteres"),
  email: z.string().email("Email invalido"),
  edad: z.number().min(18, "Debes ser mayor de edad"),
  password: z.string().min(8, "Minimo 8 caracteres"),
});

type FormData = z.infer<typeof schema>; // tipo automatico!

function RegistroForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data); // totalmente tipado
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("nombre")} />
      {errors.nombre && <span>{errors.nombre.message}</span>}

      <input {...register("email")} />
      {errors.email && <span>{errors.email.message}</span>}

      <button type="submit">Registrar</button>
    </form>
  );
}
\`\`\`

### Ventajas de Zod + RHF

- **Un solo schema** define validación + tipos TypeScript
- \`z.infer<typeof schema>\` genera el tipo automáticamente
- Mensajes de error personalizados por campo
- Validación en cliente y servidor con el mismo schema

> Zod + React Hook Form es la combinación más popular para formularios en React moderno.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #3b82f6; border-radius: 8px; white-space: pre-line; }',
        editable: true,
      },
      order: 2,
    },
  ],
  exercises: [
    {
      id: "reco04-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "¿Qué función de React Hook Form conecta un input al formulario?",
      options: [
        { id: "a", text: "connect()", isCorrect: false },
        { id: "b", text: "register()", isCorrect: true },
        { id: "c", text: "bind()", isCorrect: false },
        { id: "d", text: "attach()", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Se usa como spread: {...register('campo')}",
      explanation: "register() conecta un input al formulario, manejando name, onChange, onBlur y ref.",
    },
    {
      id: "reco04-ej-02",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 2,
      prompt: "¿Qué ventaja tiene React Hook Form sobre manejar formularios con useState?",
      options: [
        { id: "a", text: "Usa menos memoria", isCorrect: false },
        { id: "b", text: "No necesita JavaScript", isCorrect: false },
        { id: "c", text: "Minimiza re-renders del formulario", isCorrect: true },
        { id: "d", text: "Funciona sin React", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Piensa en performance y cuantas veces se re-renderiza.",
      explanation: "React Hook Form usa refs internamente, evitando re-renders en cada keystroke a diferencia de useState controlado.",
    },
    {
      id: "reco04-ej-03",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 3,
      prompt: "¿Qué hace z.infer<typeof schema> con Zod?",
      options: [
        { id: "a", text: "Valida los datos", isCorrect: false },
        { id: "b", text: "Genera automáticamente el tipo TypeScript del schema", isCorrect: true },
        { id: "c", text: "Conecta al formulario", isCorrect: false },
        { id: "d", text: "Crea un componente", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "infer = inferir el tipo.",
      explanation: "z.infer extrae el tipo TypeScript de un schema Zod, evitando definir el tipo manualmente.",
    },
    {
      id: "reco04-ej-04",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt: "Asocia cada concepto con su función:",
      dragItems: [
        { id: "drag-1", content: "register()", correctZone: "zone-connect" },
        { id: "drag-2", content: "handleSubmit()", correctZone: "zone-submit" },
        { id: "drag-3", content: "zodResolver()", correctZone: "zone-valid" },
      ],
      dropZones: [
        { id: "zone-connect", label: "Conectar input al formulario" },
        { id: "zone-submit", label: "Manejar envio con validación" },
        { id: "zone-valid", label: "Conectar Zod con React Hook Form" },
      ],
      validation: {
        type: "exact",
        answer: { "drag-1": "zone-connect", "drag-2": "zone-submit", "drag-3": "zone-valid" },
      },
      hint: "register conecta, handleSubmit valida y envia, zodResolver une Zod con RHF.",
      explanation: "register conecta inputs, handleSubmit maneja la validación/envio, zodResolver integra Zod.",
    },
    {
      id: "reco04-ej-05",
      type: "code-completion",
      difficulty: 2,
      xpReward: 20,
      order: 5,
      prompt:
        "Este input tiene que quedar conectado al formulario bajo el nombre 'email'. Completá lo que falta:",
      codeTemplate: {
        html: "",
        cssPrefix: '<input {...',
        cssSuffix: '("email")} />',
        blanks: ["register"],
      },
      validation: { type: "exact", answer: "register" },
      hint: "La función que devuelve useForm para conectar cada campo. Se esparce con spread porque devuelve varias props a la vez.",
      explanation:
        "register devuelve un objeto con name, onChange, onBlur y ref, y el spread las aplica todas juntas. Por eso react-hook-form no necesita un useState por campo: el valor vive en un ref y el componente no se re-renderiza en cada tecla. Es de donde sale su ventaja de rendimiento en formularios largos.",
    },
    {
      id: "reco04-ej-06",
      type: "code-completion",
      difficulty: 3,
      xpReward: 25,
      order: 6,
      prompt:
        "Ya tenés un esquema de Zod llamado esquema. Completá la opción de useForm que lo conecta como validador:",
      codeTemplate: {
        html: "",
        cssPrefix: "const { register, handleSubmit } = useForm({\n  ",
        cssSuffix: ": zodResolver(esquema),\n});",
        blanks: ["resolver"],
      },
      validation: { type: "exact", answer: "resolver" },
      hint: "La opción que delega la validación a una librería externa.",
      explanation:
        "resolver es el punto de extensión: react-hook-form no sabe nada de Zod, y zodResolver traduce el esquema al formato de errores que el formulario entiende. La ventaja de tener el esquema aparte es que el mismo objeto valida en el servidor, así que las reglas no se escriben dos veces y no pueden quedar desincronizadas.",
    },
  ],
};
