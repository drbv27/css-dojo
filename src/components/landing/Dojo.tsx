"use client";

import { MeshReflectorMaterial, Grid, Sparkles } from "@react-three/drei";

// Un "torii" (portón japonés) minimalista hecho con cajas emisivas, como marco neón.
function Torii({ color }: { color: string }) {
  const mat = <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />;
  return (
    <group position={[0, 0, -3]}>
      {/* columnas */}
      <mesh position={[-1.6, 1.6, 0]}>
        <boxGeometry args={[0.18, 3.2, 0.18]} />
        {mat}
      </mesh>
      <mesh position={[1.6, 1.6, 0]}>
        <boxGeometry args={[0.18, 3.2, 0.18]} />
        {mat}
      </mesh>
      {/* dintel superior */}
      <mesh position={[0, 3.3, 0]}>
        <boxGeometry args={[4, 0.2, 0.2]} />
        {mat}
      </mesh>
      <mesh position={[0, 2.85, 0]}>
        <boxGeometry args={[3.2, 0.12, 0.16]} />
        {mat}
      </mesh>
    </group>
  );
}

export default function Dojo({ color }: { color: string }) {
  return (
    <group>
      {/* Piso reflectante oscuro */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <MeshReflectorMaterial
          blur={[150, 40]}
          resolution={512}
          mixBlur={1}
          mixStrength={35}
          roughness={0.95}
          depthScale={1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.2}
          color="#0a0a12"
          metalness={0.6}
        />
      </mesh>

      {/* Grilla neón que se desvanece con la distancia */}
      <Grid
        position={[0, 0.01, 0]}
        args={[40, 40]}
        cellSize={0.6}
        cellThickness={0.6}
        cellColor="#1f2a44"
        sectionSize={3}
        sectionThickness={1.1}
        sectionColor={color}
        fadeDistance={26}
        fadeStrength={1.2}
        infiniteGrid
      />

      <Torii color={color} />

      {/* Partículas tipo brasas/glifos flotando */}
      <Sparkles count={40} scale={[10, 6, 10]} size={3} speed={0.3} color={color} opacity={0.6} />
    </group>
  );
}
