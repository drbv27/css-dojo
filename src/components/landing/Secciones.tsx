"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SECCIONES, useLanding } from "./useLanding";

function CTAHero({ hasSession }: { hasSession: boolean }) {
  return hasSession ? (
    <Link
      href="/dashboard"
      className="inline-flex items-center gap-3 px-8 py-4 bg-neon-blue text-editor-bg font-semibold text-lg rounded-xl hover:bg-neon-blue/90 transition-all hover:scale-105"
    >
      Ir al Dashboard →
    </Link>
  ) : (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <Link
        href="/login"
        className="px-8 py-4 bg-neon-blue text-editor-bg font-semibold text-lg rounded-xl hover:bg-neon-blue/90 transition-all hover:scale-105"
      >
        Iniciar Sesión
      </Link>
      <Link
        href="/registro"
        className="px-8 py-4 bg-editor-surface border border-editor-border text-editor-text font-semibold text-lg rounded-xl hover:border-neon-purple/40 transition-all hover:scale-105"
      >
        Crear Cuenta
      </Link>
    </div>
  );
}

export default function Secciones({ hasSession }: { hasSession: boolean }) {
  const activeSection = useLanding((s) => s.activeSection);

  return (
    <div className="w-full">
      {SECCIONES.map((sec, i) => {
        const activa = activeSection === i;
        const esHero = i === 0;
        const esCTA = sec.id === "cta";
        const alineacion = i % 2 === 0 ? "items-start text-left" : "items-end text-right";

        return (
          <section
            key={sec.id}
            className={`h-screen w-full flex flex-col justify-center px-8 sm:px-16 lg:px-28 ${alineacion}`}
          >
            <motion.div
              animate={{ opacity: activa ? 1 : 0.15, y: activa ? 0 : 30 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-xl"
            >
              {/* badge / track */}
              {!esHero && (
                <span
                  className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
                  style={{ color: sec.color, backgroundColor: `${sec.color}1a`, border: `1px solid ${sec.color}40` }}
                >
                  {sec.id === "cta" ? "Dojo" : `Track · ${sec.id}`}
                </span>
              )}

              <h2
                className={`font-bold tracking-tight mb-4 ${esHero ? "text-6xl sm:text-7xl lg:text-8xl" : "text-4xl sm:text-5xl lg:text-6xl"}`}
                style={
                  esHero
                    ? {
                        backgroundImage:
                          "linear-gradient(135deg, #89B4FA 0%, #CBA6F7 50%, #F5C2E7 100%)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                      }
                    : { color: sec.color }
                }
              >
                {sec.titulo}
              </h2>

              <p className="text-xl sm:text-2xl text-editor-muted mb-8">{sec.subtitulo}</p>

              {esHero && <CTAHero hasSession={hasSession} />}
              {esCTA && (
                <Link
                  href={hasSession ? "/dashboard" : "/registro"}
                  className="inline-flex items-center gap-3 px-8 py-4 font-semibold text-lg rounded-xl transition-all hover:scale-105"
                  style={{ backgroundColor: sec.color, color: "#05050a" }}
                >
                  {hasSession ? "Volver al Dojo →" : "Empezar gratis →"}
                </Link>
              )}
            </motion.div>
          </section>
        );
      })}
    </div>
  );
}
