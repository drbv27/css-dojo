import { cookies } from "next/headers";
import NavLanding from "@/components/landing/NavLanding";
import Footer from "@/components/layout/Footer";

// Carcasa de paginas publicas de contenido (fuera de (app), sin sesion
// requerida). Mismo patron de sesion que src/app/page.tsx: solo se lee la
// cookie de sesion para decidir el CTA del header, nunca se toca la base de
// datos.
export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasSession = (await cookies()).has("dev-dojo-token");

  return (
    <div className="min-h-screen flex flex-col bg-editor-bg text-editor-text">
      <NavLanding hasSession={hasSession} />
      {/* pt-16 compensa el header fixed h-16 de NavLanding */}
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  );
}
