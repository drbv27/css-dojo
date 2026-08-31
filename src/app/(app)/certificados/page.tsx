"use client";

import { useEffect, useState } from "react";
import { Award, Lock } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface Certificado {
  dojo: string;
  cohort: number;
  modulos: string[];
  ejerciciosPorModulo: Record<string, number>;
  otorgadoEn: string;
  codigo: string;
}

const NOMBRE: Record<string, string> = {
  css: "CSS",
  html: "HTML",
  js: "JavaScript",
  react: "React",
  "react-eco": "Ecosistema React",
  nextjs: "Next.js",
};

function fecha(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("es-CO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default function CertificadosPage() {
  const [certificados, setCertificados] = useState<Certificado[] | null>(null);
  const [abierto, setAbierto] = useState<string | null>(null);

  useEffect(() => {
    let vivo = true;
    fetch("/api/certificados")
      .then((r) => r.json())
      .then((d) => {
        if (vivo) setCertificados(d.certificados ?? []);
      })
      .catch(() => {
        if (vivo) setCertificados([]);
      });
    return () => {
      vivo = false;
    };
  }, []);

  if (certificados === null) return <LoadingSpinner />;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Award size={24} className="text-neon-green" />
          Mis certificados
        </h1>
        <p className="text-editor-muted text-sm mt-1">
          Se otorga uno por ruta cuando completas el 100 % de sus modulos obligatorios.
        </p>
      </header>

      {certificados.length === 0 ? (
        <div className="bg-editor-surface border border-editor-border rounded-xl p-6">
          <p className="text-white font-medium flex items-center gap-2">
            <Lock size={18} className="text-editor-muted" />
            Todavia no tenes ninguno
          </p>
          <p className="text-editor-muted text-sm mt-3">
            El certificado de una ruta se gana completando <strong>todos</strong> los ejercicios
            de <strong>todos</strong> sus modulos obligatorios. Que un modulo todavia no este
            habilitado no achica el requisito: significa que el curso no llego ahi todavia.
          </p>
          <p className="text-editor-muted text-sm mt-3">
            Cuando lo completes, tu profesor lo emite y aparece aca.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {certificados.map((c) => {
            const total = Object.values(c.ejerciciosPorModulo).reduce((a, b) => a + b, 0);
            const abierta = abierto === c.codigo;
            return (
              <li
                key={c.codigo}
                className="bg-editor-surface border border-neon-green/30 rounded-xl p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-editor-muted text-xs uppercase tracking-wide">
                      Certificado de finalizacion
                    </p>
                    <h2 className="text-xl font-bold text-neon-green mt-1">
                      {NOMBRE[c.dojo] ?? c.dojo}
                    </h2>
                    <p className="text-editor-muted text-sm mt-1">
                      Cohorte {c.cohort} &middot; {fecha(c.otorgadoEn)}
                    </p>
                  </div>
                  <p className="font-mono text-sm text-editor-text bg-editor-bg px-3 py-1.5 rounded-lg border border-editor-border">
                    {c.codigo}
                  </p>
                </div>

                <p className="text-editor-text text-sm mt-4">
                  {c.modulos.length} modulos y {total} ejercicios, completos.
                </p>

                <button
                  onClick={() => setAbierto(abierta ? null : c.codigo)}
                  className="mt-3 text-sm text-neon-green hover:underline"
                >
                  {abierta ? "Ocultar el detalle" : "Ver que incluye"}
                </button>

                {abierta && (
                  <>
                    <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                      {c.modulos.map((slug) => (
                        <li key={slug} className="text-xs flex justify-between gap-2">
                          <span className="text-editor-text font-mono">{slug}</span>
                          <span className="text-editor-muted">
                            {c.ejerciciosPorModulo[slug] ?? 0}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-editor-muted text-xs mt-4">
                      Esta lista quedo <strong>congelada</strong> el dia que se emitio. Si despues
                      la ruta creciera, tu certificado no cambia: dice lo que efectivamente
                      completaste.
                    </p>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
