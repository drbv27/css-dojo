import type { Metadata } from "next";

/**
 * `/landing-preview` es una ruta de desarrollo, y es PUBLICA: cualquiera la
 * alcanza sin sesion. Sin esto, un buscador la indexa como una landing mas y
 * compite con la home por el mismo contenido.
 *
 * Vive en un layout porque la pagina es `"use client"` y un componente de
 * cliente no puede exportar `metadata`.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function LandingPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
