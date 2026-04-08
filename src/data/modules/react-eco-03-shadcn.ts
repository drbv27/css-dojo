import type { ModuleData } from "@/types";

export const reactEcoShadcnModule: ModuleData = {
  slug: "react-eco-03-shadcn",
  title: "Shadcn/ui",
  description: "Componentes accesibles y personalizables con Shadcn/ui: Button, Input, Card, Dialog y cn().",
  order: 203,
  category: "react-eco-ui",
  icon: "code",
  dojo: "react-eco",
  lessons: [
    {
      id: "reco03-leccion-01",
      title: "Introduccion a Shadcn/ui",
      content: `## Que es Shadcn/ui?

Shadcn/ui **no es una libreria** que instalas. Es una coleccion de componentes que **copias a tu proyecto** y personalizas libremente.

### Por que Shadcn?

- Los componentes son **tuyos** — viven en tu codigo
- Basado en **Radix UI** (accesibilidad) + **Tailwind CSS** (estilos)
- Totalmente personalizable — cambias lo que quieras
- No agrega dependencias pesadas

### Instalacion

\`\`\`bash
npx shadcn@latest init
npx shadcn@latest add button input card
\`\`\`

### Estructura

Los componentes se copian a \`src/components/ui/\`:

\`\`\`
src/
  components/
    ui/
      button.tsx    <- tu componente, tu codigo
      input.tsx
      card.tsx
  lib/
    utils.ts       <- cn() helper
\`\`\`

### La funcion cn()

Combina clases de Tailwind de forma inteligente:

\`\`\`typescript
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Uso
cn("px-4 py-2", isActive && "bg-blue-500", className);
// Resuelve conflictos: cn("px-4", "px-8") => "px-8"
\`\`\`

> Shadcn es ideal para proyectos donde necesitas control total sobre los componentes.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #a6e3a1; border-radius: 8px; white-space: pre-line; }',
        editable: true,
      },
      order: 1,
    },
    {
      id: "reco03-leccion-02",
      title: "Componentes principales",
      content: `## Button

\`\`\`jsx
import { Button } from "@/components/ui/button";

<Button>Default</Button>
<Button variant="destructive">Eliminar</Button>
<Button variant="outline">Cancelar</Button>
<Button variant="ghost">Sutil</Button>
<Button size="sm">Pequeno</Button>
<Button size="lg">Grande</Button>
<Button disabled>Deshabilitado</Button>
\`\`\`

### Input y Label

\`\`\`jsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

<div>
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="tu@email.com" />
</div>
\`\`\`

### Card

\`\`\`jsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Titulo</CardTitle>
    <CardDescription>Descripcion breve</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Contenido principal</p>
  </CardContent>
  <CardFooter>
    <Button>Accion</Button>
  </CardFooter>
</Card>
\`\`\`

### Dialog (Modal)

\`\`\`jsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button>Abrir modal</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirmar accion</DialogTitle>
    </DialogHeader>
    <p>Estas seguro?</p>
  </DialogContent>
</Dialog>
\`\`\`

### Personalizar con variants (CVA)

\`\`\`typescript
// button.tsx usa class-variance-authority
const buttonVariants = cva("inline-flex items-center rounded-md", {
  variants: {
    variant: {
      default: "bg-primary text-white",
      outline: "border border-input bg-transparent",
      // agrega tus propios variants aqui
      neon: "bg-neon-blue/10 text-neon-blue border border-neon-blue/30",
    },
  },
});
\`\`\`

> Shadcn + Tailwind + CVA es la combinacion mas popular en el ecosistema React moderno.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #cba6f7; border-radius: 8px; white-space: pre-line; }',
        editable: true,
      },
      order: 2,
    },
  ],
  exercises: [
    {
      id: "reco03-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "Que diferencia a Shadcn/ui de otras librerias de componentes como MUI?",
      options: [
        { id: "a", text: "Es mas rapido", isCorrect: false },
        { id: "b", text: "Los componentes se copian a tu proyecto y son tuyos", isCorrect: true },
        { id: "c", text: "Tiene mas componentes", isCorrect: false },
        { id: "d", text: "No usa React", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "No se instala como dependencia npm.",
      explanation: "Shadcn copia los componentes a tu proyecto — tienes control total del codigo fuente.",
    },
    {
      id: "reco03-ej-02",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 2,
      prompt: "Que hace la funcion cn() de Shadcn?",
      options: [
        { id: "a", text: "Crea nuevos componentes", isCorrect: false },
        { id: "b", text: "Combina clases de Tailwind resolviendo conflictos", isCorrect: true },
        { id: "c", text: "Conecta a una base de datos", isCorrect: false },
        { id: "d", text: "Compila CSS", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "cn = classNames, combina clases CSS.",
      explanation: "cn() usa clsx + tailwind-merge para combinar clases y resolver conflictos como px-4 vs px-8.",
    },
    {
      id: "reco03-ej-03",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 3,
      prompt: "Sobre que libreria de accesibilidad esta construido Shadcn/ui?",
      options: [
        { id: "a", text: "Headless UI", isCorrect: false },
        { id: "b", text: "Radix UI", isCorrect: true },
        { id: "c", text: "Chakra UI", isCorrect: false },
        { id: "d", text: "Ant Design", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Es una libreria de primitivos accesibles y sin estilos.",
      explanation: "Shadcn usa Radix UI como base — componentes accesibles sin estilos que luego se estilizan con Tailwind.",
    },
    {
      id: "reco03-ej-04",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt: "Asocia cada componente Shadcn con su uso:",
      dragItems: [
        { id: "drag-1", content: "<Button variant='outline'>", correctZone: "zone-accion" },
        { id: "drag-2", content: "<Dialog>", correctZone: "zone-modal" },
        { id: "drag-3", content: "<Card>", correctZone: "zone-contenedor" },
      ],
      dropZones: [
        { id: "zone-accion", label: "Boton con borde sin fondo" },
        { id: "zone-modal", label: "Ventana modal" },
        { id: "zone-contenedor", label: "Contenedor con header/content/footer" },
      ],
      validation: {
        type: "exact",
        answer: { "drag-1": "zone-accion", "drag-2": "zone-modal", "drag-3": "zone-contenedor" },
      },
      hint: "Dialog = modal, Card = contenedor, outline = solo borde.",
      explanation: "Button outline muestra solo borde, Dialog es un modal, Card agrupa contenido con estructura.",
    },
  ],
};
