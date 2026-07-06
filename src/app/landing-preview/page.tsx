"use client";

// Ruta de PREVIEW para iterar la landing 3D sin tocar la home de producción (/).
// Cuando esté lista, el contenido de Landing3D se mueve a app/page.tsx.
import Landing3D from "@/components/landing/Landing3D";

export default function LandingPreviewPage() {
  // En preview asumimos sin sesión (muestra los CTAs de login/registro).
  return <Landing3D hasSession={false} />;
}
