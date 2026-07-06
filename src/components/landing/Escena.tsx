"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import Dojo from "./Dojo";
import Personaje from "./Personaje";
import { SECCIONES, useLanding } from "./useLanding";

// Mueve la cámara según el progreso de scroll (que setea ScrollManager desde el DOM).
function Director() {
  const target = useRef(new THREE.Vector3(0, 1.1, 0));

  useFrame((state) => {
    // lectura NO reactiva del store (no re-renderiza este componente por frame)
    const t = useLanding.getState().progress;

    const angle = t * Math.PI * 0.7 - Math.PI * 0.1;
    const radius = 6 - t * 1.2;
    state.camera.position.lerp(
      new THREE.Vector3(Math.sin(angle) * radius, 1.4 + t * 0.8, Math.cos(angle) * radius),
      0.08
    );
    state.camera.lookAt(target.current);
  });

  return null;
}

function Contenido() {
  const activeSection = useLanding((s) => s.activeSection);
  const color = SECCIONES[activeSection]?.color ?? "#94E2D5";

  return (
    <>
      <ambientLight intensity={0.18} />
      <spotLight position={[0, 6, 4]} angle={0.5} penumbra={0.8} intensity={120} color={color} castShadow />
      <pointLight position={[-4, 2, -2]} intensity={40} color="#89B4FA" />
      <pointLight position={[4, 2, -2]} intensity={40} color="#CBA6F7" />
      <pointLight position={[0, 1.5, 4]} intensity={15} color={color} />

      <Dojo color={color} />
      <Personaje activeSection={activeSection} />
    </>
  );
}

// El Canvas es un FONDO FIJO; el scroll lo maneja el documento (ver ScrollManager).
export default function Escena() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      camera={{ position: [0, 1.4, 6], fov: 35 }}
      style={{ position: "fixed", inset: 0, zIndex: 0 }}
    >
      <color attach="background" args={["#05050a"]} />
      <fog attach="fog" args={["#05050a", 7, 24]} />

      <Suspense fallback={null}>
        <Director />
        <Contenido />

        <EffectComposer>
          <Bloom intensity={0.9} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
          <Vignette eskil={false} offset={0.2} darkness={0.9} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
