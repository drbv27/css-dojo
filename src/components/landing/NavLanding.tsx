"use client";

import Link from "next/link";

// Barra superior FIJA de la landing: el login siempre visible (incluso para
// quienes ya tienen cuenta), sin depender del scroll ni del hero.
export default function NavLanding({ hasSession }: { hasSession: boolean }) {
  return (
    <header className="fixed top-0 inset-x-0 z-30 flex h-16 items-center justify-between px-5 sm:px-8 bg-editor-bg/40 backdrop-blur-md border-b border-editor-border/50">
      <Link
        href="/"
        className="text-xl font-extrabold tracking-tight"
        style={{
          backgroundImage: "linear-gradient(135deg, #89B4FA 0%, #CBA6F7 50%, #F5C2E7 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        Dev Dojo
      </Link>

      <nav className="flex items-center gap-2 sm:gap-3">
        {hasSession ? (
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-lg bg-neon-blue text-editor-bg font-semibold text-sm hover:bg-neon-blue/90 transition-all"
          >
            Ir al Dashboard
          </Link>
        ) : (
          <>
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg border border-editor-border text-editor-text font-semibold text-sm hover:border-neon-blue/50 hover:text-neon-blue transition-all"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/registro"
              className="px-4 py-2 rounded-lg bg-neon-blue text-editor-bg font-semibold text-sm hover:bg-neon-blue/90 transition-all"
            >
              Crear cuenta
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
