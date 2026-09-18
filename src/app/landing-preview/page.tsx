// Ruta de PREVIEW para iterar la landing 3D sin tocar la home de producción (/).
// No lee cookie ni base de datos: por eso los e2e apuntan acá y no a "/".
//
// Espeja la estructura de app/page.tsx a propósito: base estática renderizada
// en el servidor + capa 3D en el cliente. Si divergiera, la preview dejaría de
// probar lo que realmente se sirve.
import LandingClient from "@/components/landing/LandingClient";
import NavLanding from "@/components/landing/NavLanding";
import LandingEstatica from "@/components/landing/LandingEstatica";

export default function LandingPreviewPage() {
  // En preview asumimos sin sesión (muestra los CTAs de login/registro).
  return (
    <>
      <div id="landing-base">
        <NavLanding hasSession={false} />
        <LandingEstatica hasSession={false} />
      </div>
      <LandingClient hasSession={false} />
    </>
  );
}
