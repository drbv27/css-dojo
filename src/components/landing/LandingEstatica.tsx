"use client";

// Fallback para mobile / sin-WebGL / prefers-reduced-motion.
// NADA de Three.js: imagen/figura estática + animaciones CSS (vía framer-motion + Tailwind).
import Link from "next/link";
import { motion } from "framer-motion";
import { SECCIONES } from "./useLanding";

export default function LandingEstatica({ hasSession }: { hasSession: boolean }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-editor-bg">
      {/* glow orbs animados (CSS) */}
      <div className="pointer-events-none fixed top-[-10%] left-[-10%] w-80 h-80 rounded-full bg-neon-blue/10 blur-[110px] animate-pulse" />
      <div className="pointer-events-none fixed bottom-[-10%] right-[-10%] w-80 h-80 rounded-full bg-neon-purple/10 blur-[110px] animate-pulse" />

      {/* HERO */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6">
        {/* figura del ninja: placeholder con glow (reemplazar por <img> del render cuando esté) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8 grid place-items-center w-40 h-40 rounded-3xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 border border-editor-border"
          style={{ boxShadow: "0 0 60px rgba(137,180,250,0.25)" }}
        >
          <span className="text-7xl" role="img" aria-label="ninja">🥷</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="text-5xl sm:text-6xl font-bold tracking-tight mb-4"
          style={{
            backgroundImage: "linear-gradient(135deg, #89B4FA 0%, #CBA6F7 50%, #F5C2E7 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Dev Dojo
        </motion.h1>
        <p className="text-lg text-editor-muted max-w-md mb-8">
          Conviértete en un dev de cinturón negro. Domina HTML, CSS, JavaScript y React.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          {hasSession ? (
            <Link href="/dashboard" className="px-7 py-3.5 bg-neon-blue text-editor-bg font-semibold rounded-xl hover:scale-105 transition-all">
              Ir al Dashboard →
            </Link>
          ) : (
            <>
              <Link href="/login" className="px-7 py-3.5 bg-neon-blue text-editor-bg font-semibold rounded-xl hover:scale-105 transition-all">
                Iniciar Sesión
              </Link>
              <Link href="/registro" className="px-7 py-3.5 bg-editor-surface border border-editor-border font-semibold rounded-xl hover:scale-105 transition-all">
                Crear Cuenta
              </Link>
            </>
          )}
        </div>
      </section>

      {/* TRACKS (reveal al entrar en viewport — scroll real) */}
      <section className="px-6 pb-24 max-w-md mx-auto flex flex-col gap-4">
        {SECCIONES.filter((s) => s.id !== "hero" && s.id !== "cta").map((sec) => (
          <motion.div
            key={sec.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl p-6 bg-editor-surface/60 border border-editor-border"
            style={{ borderLeft: `3px solid ${sec.color}` }}
          >
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: sec.color }}>
              Track · {sec.id}
            </span>
            <h3 className="text-2xl font-bold mt-1 mb-1" style={{ color: sec.color }}>{sec.titulo}</h3>
            <p className="text-editor-muted">{sec.subtitulo}</p>
          </motion.div>
        ))}

        <Link
          href={hasSession ? "/dashboard" : "/registro"}
          className="mt-4 text-center px-7 py-4 font-semibold rounded-xl hover:scale-105 transition-all"
          style={{ backgroundColor: "#CBA6F7", color: "#05050a" }}
        >
          {hasSession ? "Volver al Dojo →" : "Empezar gratis →"}
        </Link>
      </section>
    </div>
  );
}
