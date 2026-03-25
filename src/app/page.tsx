import Link from "next/link";
import { cookies } from "next/headers";
import Footer from "@/components/layout/Footer";

const codeSnippet = `.hero {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    #1E1E2E 0%,
    #313244 100%
  );
  animation: glow 3s ease-in-out
    infinite alternate;
}`;

export default async function HomePage() {
  const cookieStore = await cookies();
  const hasSession = cookieStore.has("css-dojo-token");

  return (
    <div className="h-screen flex flex-col bg-editor-bg overflow-hidden relative">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(137,180,250,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(137,180,250,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-neon-blue/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-neon-purple/10 rounded-full blur-[100px]" />

      {/* Main content - centered */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20 max-w-6xl w-full">
          {/* Left: Text */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full border border-editor-border bg-editor-surface/50 text-xs text-editor-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
              Plataforma interactiva de aprendizaje
            </div>

            {/* Title */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #89B4FA 0%, #CBA6F7 50%, #F5C2E7 100%)",
                }}
              >
                CSS Dojo
              </span>
            </h1>

            {/* Glow bar */}
            <div className="w-64 h-1 mb-6 rounded-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink opacity-60 blur-sm mx-auto lg:mx-0" />

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-editor-muted max-w-lg mb-8 mx-auto lg:mx-0">
              Domina CSS paso a paso con retos interactivos y un editor en tiempo real
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              {hasSession ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-neon-blue text-editor-bg font-semibold text-lg rounded-xl hover:bg-neon-blue/90 transition-all hover:shadow-[0_0_30px_rgba(137,180,250,0.3)] hover:scale-105"
                >
                  Ir al Dashboard
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-neon-blue text-editor-bg font-semibold text-lg rounded-xl hover:bg-neon-blue/90 transition-all hover:shadow-[0_0_30px_rgba(137,180,250,0.3)] hover:scale-105"
                  >
                    Iniciar Sesion
                  </Link>
                  <Link
                    href="/registro"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-editor-surface border border-editor-border text-editor-text font-semibold text-lg rounded-xl hover:bg-editor-hover hover:border-neon-purple/30 transition-all hover:scale-105"
                  >
                    Crear Cuenta
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-10 mt-10 justify-center lg:justify-start">
              {[
                { value: "24", label: "Modulos" },
                { value: "190+", label: "Ejercicios" },
                { value: "5", label: "Tipos de Retos" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-neon-blue mb-1">{stat.value}</div>
                  <div className="text-sm text-editor-muted">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Code card */}
          <div className="w-full max-w-sm lg:max-w-md shrink-0">
            <div className="bg-editor-surface border border-editor-border rounded-xl overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-editor-border bg-editor-sidebar">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-neon-red/70" />
                  <div className="w-3 h-3 rounded-full bg-neon-yellow/70" />
                  <div className="w-3 h-3 rounded-full bg-neon-green/70" />
                </div>
                <span className="text-xs text-editor-muted font-mono ml-2">styles.css</span>
              </div>
              <div className="p-5 font-mono text-sm leading-relaxed">
                {codeSnippet.split("\n").map((line, i) => (
                  <div key={i} className="flex">
                    <span className="w-8 text-right mr-4 text-editor-muted/50 select-none text-xs leading-relaxed">
                      {i + 1}
                    </span>
                    <span>
                      {line.includes("{") || line.includes("}") ? (
                        <span className="text-neon-yellow">{line}</span>
                      ) : line.includes(":") ? (
                        <>
                          <span className="text-neon-blue">{line.split(":")[0]}</span>
                          <span className="text-editor-muted">:</span>
                          <span className="text-neon-green">{line.split(":").slice(1).join(":")}</span>
                        </>
                      ) : line.startsWith(".") ? (
                        <span className="text-neon-purple">{line}</span>
                      ) : (
                        <span className="text-neon-orange">{line}</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
