"use client";

import { useEffect, useState } from "react";
import Escena from "./Escena";
import Secciones from "./Secciones";
import ScrollManager from "./ScrollManager";
import LandingEstatica from "./LandingEstatica";
import Loader from "./Loader";

// Decide si corremos la escena WebGL o el fallback estático.
// Static cuando: pantalla chica (mobile), prefers-reduced-motion, o no hay WebGL.
function debeUsar3D(): boolean {
  if (typeof window === "undefined") return false;
  const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const chico = window.matchMedia("(max-width: 767px)").matches;
  let webgl = false;
  try {
    const c = document.createElement("canvas");
    webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    webgl = false;
  }
  return webgl && !reducido && !chico;
}

export default function Landing3D({ hasSession }: { hasSession: boolean }) {
  // 'cargando' evita el flash hasta decidir en el cliente.
  const [modo, setModo] = useState<"cargando" | "3d" | "estatica">("cargando");

  useEffect(() => {
    setModo(debeUsar3D() ? "3d" : "estatica");
  }, []);

  if (modo === "cargando") return <div className="fixed inset-0 bg-editor-bg" />;
  if (modo === "estatica") return <LandingEstatica hasSession={hasSession} />;

  return (
    <>
      <Loader />
      {/* Canvas 3D como fondo fijo */}
      <Escena />
      {/* Contenido scrolleable por encima (transparente, deja ver la escena) */}
      <main className="relative z-10">
        <Secciones hasSession={hasSession} />
      </main>
      {/* Maneja scroll -> escena, auto-scroll e indicador */}
      <ScrollManager />
    </>
  );
}
