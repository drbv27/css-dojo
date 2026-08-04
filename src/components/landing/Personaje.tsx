"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { SECCIONES } from "./useLanding";

// ─────────────────────────────────────────────────────────────────────────────
// Cuando Diego suba el MESH del ninja (con piel) a public/models/ninja/ninja.glb,
// poner esto en true. Mientras tanto se muestra un placeholder neón.
export const MESH_DISPONIBLE = true;
const MESH_URL = "/models/ninja/ninja.glb";

// Color inicial del material: la sección 0 es el estado en el primer render.
// Sembrar desde esta constante (en vez de cerrar sobre el `color` reactivo)
// hace que las deps `[]` del useMemo de abajo sean genuinamente correctas.
const COLOR_INICIAL = SECCIONES[0]?.color ?? "#94E2D5";

// Clips de animación (ya convertidos de Mixamo, sin mesh, mismo esqueleto).
const CLIPS = [
  "idle",
  "fighting_idle",
  "bow",
  "punch_combo",
  "quad_punch",
  "kick",
  "sneak_walk",
  "victory",
] as const;

// ─── Personaje REAL (se activa cuando hay mesh) ──────────────────────────────
function PersonajeReal({ activeSection }: { activeSection: number }) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MESH_URL);

  // useGLTF acepta un ARRAY de urls y devuelve un array (una sola llamada de hook).
  // Los clips comparten el esqueleto del mesh (Mixamo) -> se aplican al mismo personaje.
  const urls = CLIPS.map((name) => `/models/ninja/${name}.glb`);
  const gltfs = useGLTF(urls);
  const clips = useMemo(() => {
    return CLIPS.map((name, i) => {
      const clip = gltfs[i]?.animations[0]?.clone();
      if (clip) clip.name = name;
      return clip;
    }).filter(Boolean) as THREE.AnimationClip[];
  }, [gltfs]);

  const { actions } = useAnimations(clips, group);
  const color = SECCIONES[activeSection]?.color ?? "#94E2D5";

  // Material neón compartido (el mesh no trae texturas → lo estilizamos).
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0d0d18",
        emissive: new THREE.Color(COLOR_INICIAL),
        emissiveIntensity: 0.9,
        metalness: 0.4,
        roughness: 0.35,
      }),
    [] // se crea una vez; el color se actualiza abajo (efecto de :72-74)
  );

  // Aplicar el material a todos los meshes del modelo + sombras.
  useEffect(() => {
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.material = material;
        m.castShadow = true;
      }
    });
  }, [scene, material]);

  // Actualizar el color emisivo según la sección activa.
  useEffect(() => {
    material.emissive.set(color);
  }, [color, material]);

  // Al cambiar de sección, crossfade al clip que corresponde.
  useEffect(() => {
    const nombre = SECCIONES[activeSection]?.clip ?? "fighting_idle";
    const next = actions[nombre] ?? actions["fighting_idle"] ?? Object.values(actions)[0];
    if (!next) return;
    next.reset().fadeIn(0.4).play();
    return () => {
      next.fadeOut(0.4);
    };
  }, [activeSection, actions]);

  return (
    <group ref={group} dispose={null}>
      <primitive object={scene} position={[0, 0, 0]} />
    </group>
  );
}

// ─── Placeholder neón (figura estilizada de primitivas) ──────────────────────
function PersonajePlaceholder({ color }: { color: string }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.position.y = Math.sin(t * 1.5) * 0.05; // bob de "respiración"
    group.current.rotation.y = Math.sin(t * 0.4) * 0.2;  // leve vaivén
  });

  const mat = (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={1.4}
      roughness={0.35}
      metalness={0.3}
    />
  );

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* cabeza */}
      <mesh position={[0, 1.62, 0]} castShadow>
        <sphereGeometry args={[0.17, 24, 24]} />
        {mat}
      </mesh>
      {/* torso */}
      <mesh position={[0, 1.15, 0]} castShadow>
        <capsuleGeometry args={[0.18, 0.5, 8, 16]} />
        {mat}
      </mesh>
      {/* brazos en guardia */}
      <mesh position={[-0.28, 1.2, 0.12]} rotation={[0.5, 0, 0.5]} castShadow>
        <capsuleGeometry args={[0.07, 0.45, 6, 12]} />
        {mat}
      </mesh>
      <mesh position={[0.28, 1.2, 0.12]} rotation={[0.5, 0, -0.5]} castShadow>
        <capsuleGeometry args={[0.07, 0.45, 6, 12]} />
        {mat}
      </mesh>
      {/* piernas en postura */}
      <mesh position={[-0.13, 0.45, 0]} rotation={[0, 0, 0.08]} castShadow>
        <capsuleGeometry args={[0.09, 0.6, 6, 12]} />
        {mat}
      </mesh>
      <mesh position={[0.16, 0.45, 0.1]} rotation={[0.2, 0, -0.1]} castShadow>
        <capsuleGeometry args={[0.09, 0.6, 6, 12]} />
        {mat}
      </mesh>
      {/* "cinturón" */}
      <mesh position={[0, 0.92, 0]} castShadow>
        <torusGeometry args={[0.2, 0.04, 12, 24]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

export default function Personaje({ activeSection }: { activeSection: number }) {
  const color = SECCIONES[activeSection]?.color ?? "#94E2D5";
  if (MESH_DISPONIBLE) return <PersonajeReal activeSection={activeSection} />;
  return <PersonajePlaceholder color={color} />;
}

// Precargar el mesh real solo cuando exista.
if (MESH_DISPONIBLE) useGLTF.preload(MESH_URL);
