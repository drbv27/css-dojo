import type { Metadata } from "next";
import { cookies } from "next/headers";
import LandingClient from "@/components/landing/LandingClient";

export const metadata: Metadata = {
  title: "Dev Dojo — Conviértete en un dev de cinturón negro",
  description:
    "Domina HTML, CSS, JavaScript y React entrenando en el dojo del código. Plataforma interactiva y gamificada.",
  openGraph: {
    title: "Dev Dojo — El dojo del código",
    description:
      "Conviértete en un dev de cinturón negro. Domina HTML, CSS, JavaScript y React paso a paso.",
    type: "website",
    locale: "es_ES",
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
  return <LandingClient hasSession={hasSession} />;
}
