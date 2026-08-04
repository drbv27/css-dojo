"use client";

import { Component, useState, useSyncExternalStore, type ErrorInfo, type ReactNode } from "react";
import Escena from "./Escena";
import Secciones from "./Secciones";
import ScrollManager from "./ScrollManager";
import LandingEstatica from "./LandingEstatica";
import NavLanding from "./NavLanding";
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

// useSyncExternalStore plumbing for reading a client-only capability without
// writing state from a mount effect. There is nothing to subscribe to (the
// probe never changes after the first read), so `subscribe` is a no-op.
// `soporte` is cached at MODULE scope, so the probe runs once per page load
// rather than once per mount (accepted behaviour delta: crossing the 767px
// breakpoint and client-navigating back to `/` keeps the earlier decision
// until a full reload).
const SIN_SUSCRIPCION = () => () => {};
let soporte: boolean | null = null;
const leerSoporte = () => (soporte ??= debeUsar3D());
const soporteServidor = () => null;

// Atrapa los throws que <Escena /> deja escapar: react-three-fiber re-lanza
// cualquier error de su subárbol hacia el árbol de React exterior
// (`if (error) throw error;` en react-three-fiber.esm.js), así que un .glb
// que falla en 404 tira abajo a Landing3D entero si nadie lo atrapa antes.
class LimiteEscena extends Component<
  { onError: () => void; children: ReactNode },
  { fallo: boolean }
> {
  state = { fallo: false };

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("La escena 3D falló al cargar:", error, info);
    this.setState({ fallo: true });
    this.props.onError();
  }

  render() {
    if (this.state.fallo) return null;
    return this.props.children;
  }
}

export default function Landing3D({ hasSession }: { hasSession: boolean }) {
  // null = not decided yet (matches the hydration render); this is the
  // client-only capability read, derived instead of written from an effect.
  const capaz3D = useSyncExternalStore(SIN_SUSCRIPCION, leerSoporte, soporteServidor);
  const [escenaFallo, setEscenaFallo] = useState(false);
  // Set by Loader's "Continuar sin la escena" action (20s stall or a caught
  // load error) — folded into `modo` alongside the WebGL-capability read, no
  // second source of truth for the render decision.
  const [escapeManual, setEscapeManual] = useState(false);

  const modo: "cargando" | "3d" | "estatica" =
    escapeManual || capaz3D === false ? "estatica" : capaz3D === null ? "cargando" : "3d";

  if (modo === "cargando") return <div className="fixed inset-0 bg-editor-bg" />;
  if (modo === "estatica")
    return (
      <>
        <NavLanding hasSession={hasSession} />
        <LandingEstatica hasSession={hasSession} />
      </>
    );

  return (
    <>
      {/* Barra fija: login siempre visible */}
      <NavLanding hasSession={hasSession} />
      <Loader escenaFallo={escenaFallo} onOmitirEscena={() => setEscapeManual(true)} />
      {/* Canvas 3D como fondo fijo */}
      <LimiteEscena onError={() => setEscenaFallo(true)}>
        <Escena />
      </LimiteEscena>
      {/* Contenido scrolleable por encima (transparente, deja ver la escena) */}
      <main className="relative z-10">
        <Secciones hasSession={hasSession} />
      </main>
      {/* Maneja scroll -> escena, auto-scroll e indicador */}
      <ScrollManager />
    </>
  );
}
