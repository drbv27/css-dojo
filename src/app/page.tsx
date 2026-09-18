import type { Metadata } from "next";
import { cookies } from "next/headers";
import LandingClient from "@/components/landing/LandingClient";
import NavLanding from "@/components/landing/NavLanding";
import LandingEstatica from "@/components/landing/LandingEstatica";

export const metadata: Metadata = {
  title: "Dev Dojo — Conviértete en un dev de cinturón negro",
  description:
    "Domina HTML, CSS, JavaScript y React entrenando en el dojo del código. Plataforma interactiva y gamificada.",
  openGraph: {
    title: "Dev Dojo — El dojo del código",
    description:
      "Conviértete en un dev de cinturón negro. Domina HTML, CSS, JavaScript y React paso a paso.",
    type: "website",
    locale: "es_CO",
    siteName: "Dev Dojo",
    // TODO: agregar imagen OG (1200x630) en /public/og-image.png — idealmente un
    // screenshot de la escena 3D. Cuando exista, sumar `images: [...]` aquí y en twitter.
  },
  twitter: {
    card: "summary_large_image",
    title: "Dev Dojo — El dojo del código",
    description: "Conviértete en un dev de cinturón negro. HTML, CSS, JavaScript y React.",
  },
};

export default async function HomePage() {
  // Server Component: lee la sesión para decidir los CTAs (Dashboard vs Login/Registro).
  const hasSession = (await cookies()).has("dev-dojo-token");

  // La landing estatica se renderiza EN EL SERVIDOR y es la base.
  //
  // Antes todo colgaba de un `dynamic(..., { ssr: false })`, y adentro de ese
  // envoltorio estaban la escena, el nav Y la version estatica. Resultado: el
  // HTML servido para "/" no traia un solo caracter de texto — ni h1, ni
  // enlaces, ni secciones. El fallback accesible existia y estaba escondido
  // del servidor sin querer.
  //
  // `ssr: false` es lo que impide renderizar en servidor; `"use client"` no.
  // Ahora la frontera envuelve solo la escena WebGL.
  return (
    <>
      <div id="landing-base">
        <NavLanding hasSession={hasSession} />
        <LandingEstatica hasSession={hasSession} />
      </div>
      <LandingClient hasSession={hasSession} />
    </>
  );
}
