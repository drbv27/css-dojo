"use client";

// Wrapper client: carga la landing 3D con ssr:false (WebGL no corre en el server).
// page.tsx (server component) lee la sesión y le pasa hasSession por props.
import dynamic from "next/dynamic";

const Landing3D = dynamic(() => import("./Landing3D"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-editor-bg" />,
});

export default function LandingClient({ hasSession }: { hasSession: boolean }) {
  return <Landing3D hasSession={hasSession} />;
}
