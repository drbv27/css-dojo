import { create } from "zustand";

// Store global de la landing (estado de UI, no del render 3D).
interface LandingState {
  activeSection: number;    // sección activa según el scroll (0..N)
  progress: number;         // progreso de scroll 0..1 (alimenta la cámara)
  autoplay: boolean;        // true mientras el auto-scroll está activo
  setActiveSection: (i: number) => void;
  setProgress: (p: number) => void;
  setAutoplay: (v: boolean) => void;
}

export const useLanding = create<LandingState>((set) => ({
  activeSection: 0,
  progress: 0,
  autoplay: true,
  setActiveSection: (i) => set({ activeSection: i }),
  setProgress: (p) => set({ progress: p }),
  setAutoplay: (v) => set({ autoplay: v }),
}));

// Las secciones de la landing = los "tracks" del dojo, cada uno con su color neón.
// (los colores salen de los tokens de globals.css)
export interface Seccion {
  id: string;
  titulo: string;
  subtitulo: string;
  color: string;   // hex del neón del track
  clip: string;    // nombre del clip de animación que toca en esta sección
}

export const SECCIONES: Seccion[] = [
  { id: "hero", titulo: "Dev Dojo", subtitulo: "Conviértete en un dev de cinturón negro", color: "#89B4FA", clip: "fighting_idle" },
  { id: "html", titulo: "Fundamentos", subtitulo: "HTML — la base de todo dojo", color: "#FAB387", clip: "bow" },
  { id: "css", titulo: "Estilo", subtitulo: "CSS — la forma y la elegancia", color: "#A855F7", clip: "idle" },
  { id: "js", titulo: "Lógica", subtitulo: "JavaScript + TypeScript — el golpe certero", color: "#F9E2AF", clip: "punch_combo" },
  { id: "react", titulo: "Componentes", subtitulo: "React — la técnica que lo cambia todo", color: "#94E2D5", clip: "kick" },
  { id: "cta", titulo: "Empezá tu entrenamiento", subtitulo: "Sumate al dojo y subí de cinturón", color: "#CBA6F7", clip: "victory" },
];
