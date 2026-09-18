import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Acerca de Dev Dojo",
  description:
    "Dev Dojo es una plataforma para aprender desarrollo web escribiendo código, no mirando videos. Conocé el proyecto y quién está detrás.",
  openGraph: {
    title: "Acerca de Dev Dojo",
    description:
      "Un lugar para aprender a programar practicando, no mirando. Conocé el proyecto y quién está detrás.",
    type: "website",
    locale: "es_CO",
    siteName: "Dev Dojo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Acerca de Dev Dojo",
    description: "Un lugar para aprender a programar practicando, no mirando.",
  },
};

const FEATURES = [
  {
    title: "Cinturones y XP",
    body: "El progreso se mide en evidencia, no en horas sentado. Cada ejercicio resuelto suma, y el cinturón que mostrás es el que te ganaste.",
  },
  {
    title: "Playground",
    body: "Un editor libre para probar ideas sin romper nada. Porque entender se entiende rompiendo cosas.",
  },
  {
    title: "Juegos de CSS",
    body: "Flexbox y Grid no se aprenden leyendo la documentación. Se aprenden jugando hasta que la intuición hace clic.",
  },
  {
    title: "Certificados por ruta",
    body: "Cuando terminás una ruta completa, queda constancia. No por el papel: por lo que tuviste que hacer para conseguirlo.",
  },
];

export default function AcercaPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 sm:px-8 py-16 sm:py-24 space-y-20 sm:space-y-28">
      {/* Hero */}
      <section className="flex flex-col items-center text-center gap-6">
        <img
          src="/img/logo-devdojo.webp"
          alt="Logo de Dev Dojo: un ninja programando bajo un torii, cinturón negro, en morados y magentas neón"
          width={128}
          height={128}
          className="w-24 h-24 sm:w-32 sm:h-32"
        />
        <h1 className="font-sans font-extrabold text-3xl sm:text-5xl tracking-tight">
          Acerca de{" "}
          <span
            style={{
              backgroundImage: "linear-gradient(135deg, #CBA6F7 0%, #F5C2E7 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Dev Dojo
          </span>
        </h1>
        <p className="text-editor-muted text-lg sm:text-xl max-w-xl">
          Un lugar para aprender a programar practicando, no mirando.
        </p>
      </section>

      {/* Qué es Dev Dojo */}
      <section className="space-y-10">
        <div className="space-y-4 text-editor-text/90 text-base sm:text-lg leading-relaxed">
          <h2 className="font-sans font-bold text-2xl sm:text-3xl text-editor-text">
            Qué es Dev Dojo
          </h2>
          <p>
            Dev Dojo es una plataforma para aprender desarrollo web escribiendo
            código. No hay videos que se miran en 2x ni casillas que se marcan
            solas: cada módulo se cierra resolviendo un ejercicio real en el
            editor, y el sistema lo corrige.
          </p>
          <p>
            Seis rutas, del primer <code className="font-mono text-neon-pink">&lt;div&gt;</code>{" "}
            a una aplicación completa: HTML, CSS, JavaScript, React, el
            ecosistema de React y Next.js.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-editor-border bg-editor-surface p-5 space-y-2"
            >
              <h3 className="font-sans font-semibold text-neon-purple text-base">
                {feature.title}
              </h3>
              <p className="text-editor-muted text-sm leading-relaxed">{feature.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Por qué un dojo */}
      <section className="space-y-4 text-editor-text/90 text-base sm:text-lg leading-relaxed">
        <h2 className="font-sans font-bold text-2xl sm:text-3xl text-editor-text">
          Por qué un dojo
        </h2>
        <p>
          En un dojo nadie sube de cinturón por asistir. Sube cuando puede
          demostrar lo que sabe, delante de alguien que se da cuenta si no lo
          sabe.
        </p>
        <p>
          Aprender a programar funciona igual. Se puede mirar un curso entero
          de React y no ser capaz de escribir un componente desde cero. Por eso
          acá el orden es otro: primero el concepto, después el código. Nadie
          escribe una línea hasta que puede explicar qué hace.
        </p>
        <p>
          La repetición no es castigo. Es la única forma conocida de que algo
          deje de costarte.
        </p>
      </section>

      {/* Quién está detrás */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-10">
          <div className="flex-1 space-y-4 text-editor-text/90 text-base sm:text-lg leading-relaxed">
            <h2 className="font-sans font-bold text-2xl sm:text-3xl text-editor-text">
              Diego Bonilla
            </h2>
            <p>
              Ingeniero Electrónico por la Universidad de Antioquia y
              Especialista en Gestión de la Innovación. Más de quince años de
              trayectoria profesional, hoy en Medellín, Colombia.
            </p>
            <p>
              Llegué al desarrollo web por el lado largo: electrónica primero,
              innovación después, y en el medio la docencia, que es lo que
              terminó quedándose. Doy clases de desarrollo web y construí Dev
              Dojo con la plataforma que me hubiera gustado tener cuando
              empece.
            </p>
            <p>
              El nombre no es decoración. En la universidad fui presidente del
              club de Karate-do, y ahí aprendí algo que sirve igual para el
              código: no hay atajo que reemplace a la repetición, y el
              cinturón no te lo da el profesor, te lo dan las horas.
            </p>

            <div className="flex items-center gap-1.5 pt-2 text-sm text-editor-muted">
              <a
                href="mailto:drbv27@gmail.com"
                className="hover:text-neon-red transition-colors inline-flex items-center gap-1"
                title="drbv27@gmail.com"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
                </svg>
                <span>drbv27</span>
              </a>
              <span className="text-editor-border mx-1">|</span>
              <a
                href="https://github.com/drbv27"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-neon-blue transition-colors inline-flex items-center gap-1"
                title="github.com/drbv27"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>drbv27</span>
              </a>
            </div>
          </div>

          <img
            src="/img/diego-bonilla.webp"
            alt="Diego Bonilla, creador de Dev Dojo: un primer plano suyo de fondo y una figura de cuerpo entero enmarcada en luz neón"
            width={460}
            height={975}
            loading="lazy"
            className="w-full max-w-[260px] sm:max-w-[280px] mx-auto md:mx-0 rounded-2xl border border-editor-border shrink-0"
          />
        </div>
      </section>

      {/* CTA final */}
      <section className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          href="/registro"
          className="px-6 py-3 rounded-lg bg-neon-blue text-editor-bg font-semibold text-sm hover:bg-neon-blue/90 transition-all"
        >
          Crear cuenta
        </Link>
        <Link
          href="/modulos"
          className="px-6 py-3 rounded-lg border border-editor-border text-editor-text font-semibold text-sm hover:border-neon-purple/50 hover:text-neon-purple transition-all"
        >
          Ver las rutas
        </Link>
      </section>
    </div>
  );
}
