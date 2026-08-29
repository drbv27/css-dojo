"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Award, CalendarClock, CheckCircle2, Lock, TriangleAlert } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

/**
 * Solo la mitad NO certificable, que es la unica que esta vista dibuja.
 * El campo es `sinClasificar`: un tipo local mas laxo dejaba pasar el
 * typecheck con un nombre inventado y la seccion habria salido vacia.
 */
type Certificabilidad = {
  certificable: false;
  motivo: "sin-clasificar" | "track-vacio";
  sinClasificar?: string[];
};

interface Elegibilidad {
  elegible: boolean;
  motivo?: string;
  detalle?: Certificabilidad;
  faltantes?: Record<string, string[]>;
}

interface Fila {
  userId: string;
  nombre: string;
  email: string;
  cohort: number;
  elegibilidad: Elegibilidad;
  yaCertificado: boolean;
  faltan: number;
  exigidos: number;
  aunNoHabilitados: string[];
}

type Panel =
  | { certificable: false; dojo: string; detalle: Certificabilidad }
  | {
      certificable: true;
      dojo: string;
      modulos: string[];
      exigidos: number;
      filas: Fila[];
      resumen: { alumnos: number; puedenRecibirlo: number; yaLoTienen: number };
    };

const NOMBRE: Record<string, string> = {
  css: "CSS",
  html: "HTML",
  js: "JavaScript",
  react: "React",
  "react-eco": "Ecosistema React",
  nextjs: "Next.js",
};

export default function TeacherCertificadosPage() {
  const [rutas, setRutas] = useState<string[]>([]);
  const [dojo, setDojo] = useState("css");
  const [abierta, setAbierta] = useState<string | null>(null);
  /** El alumno cuyo otorgamiento espera confirmacion. No hay revocacion. */
  const [confirmando, setConfirmando] = useState<Fila | null>(null);
  const [otorgando, setOtorgando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /** Sube al cambiar para forzar una relectura despues de otorgar. */
  const [recarga, setRecarga] = useState(0);

  /**
   * La respuesta se guarda JUNTO CON la ruta que la pidio, y no en dos estados
   * sueltos, por dos motivos:
   *
   * 1. `loading` sale derivado, sin un setState sincrono dentro del efecto.
   * 2. Cierra una carrera real: dos clicks seguidos disparan dos fetch, y si el
   *    primero vuelve ultimo, la tabla termina mostrando la ruta anterior con la
   *    pestania de la nueva marcada. El `vivo` corta la respuesta vieja.
   */
  const [respuesta, setRespuesta] = useState<{
    dojo: string;
    recarga: number;
    panel: Panel | null;
  } | null>(null);

  async function otorgarA(fila: Fila) {
    setOtorgando(true);
    setError(null);
    try {
      const res = await fetch("/api/teacher/certificados", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: fila.userId, dojo }),
      });
      const cuerpo = await res.json().catch(() => null);
      if (!res.ok) {
        // El servidor manda. Un rechazo aca casi siempre significa que el
        // roster de esta pantalla quedo viejo -- entro contenido nuevo a un
        // obligatorio y el alumno se cayo del 100 %. Por eso se recarga.
        setError(
          cuerpo?.motivo === "no-elegible"
            ? `${fila.nombre} ya no cumple el requisito. Se recargo la lista.`
            : "No se pudo otorgar. Se recargo la lista.",
        );
      }
    } catch {
      setError("No se pudo otorgar. Se recargo la lista.");
    } finally {
      setOtorgando(false);
      setConfirmando(null);
      setRecarga((n) => n + 1);
    }
  }

  useEffect(() => {
    let vivo = true;
    fetch(`/api/teacher/certificados?dojo=${dojo}`)
      .then((r) => r.json())
      .then((d) => {
        if (!vivo) return;
        if (d.rutas) setRutas(d.rutas);
        setRespuesta({ dojo, recarga, panel: d.panel ?? null });
      })
      .catch(() => {
        if (vivo) setRespuesta({ dojo, recarga, panel: null });
      });
    return () => {
      vivo = false;
    };
  }, [dojo, recarga]);

  const loading = respuesta?.dojo !== dojo || respuesta?.recarga !== recarga;
  const panel = loading ? null : respuesta?.panel ?? null;



  return (
    <div className="min-h-screen bg-editor-bg p-6">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/teacher"
          className="inline-flex items-center gap-2 text-editor-muted hover:text-white text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Volver al panel
        </Link>

        <header className="mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Award size={24} className="text-neon-green" />
            Certificados
          </h1>
          <p className="text-editor-muted text-sm mt-1">
            Quién puede recibir el certificado de una ruta, y a quién le falta poco.
          </p>
        </header>

        <div className="flex flex-wrap items-center gap-2 mb-6">
          {rutas.map((r) => (
            <button
              key={r}
              onClick={() => setDojo(r)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
                r === dojo
                  ? "bg-neon-green/20 border-neon-green/40 text-neon-green"
                  : "bg-editor-surface border-editor-border text-editor-muted hover:text-white"
              }`}
            >
              {NOMBRE[r] ?? r}
            </button>
          ))}
        </div>

        {loading && <LoadingSpinner />}

        {!loading && panel?.certificable === false && (
          <div className="bg-editor-surface border border-editor-border rounded-xl p-6">
            <p className="text-white font-medium flex items-center gap-2">
              <Lock size={18} className="text-editor-muted" />
              Esta ruta todavía no certifica
            </p>
            <p className="text-editor-muted text-sm mt-2">
              Una ruta certifica sólo cuando <strong>todos</strong> sus módulos declaran si son
              obligatorios u opcionales. Mientras falte uno, el certificado no se puede definir
              sin inventar el requisito.
            </p>
            {panel.detalle?.sinClasificar && panel.detalle.sinClasificar.length > 0 && (
              <p className="text-editor-muted text-sm mt-3">
                Sin clasificar: {panel.detalle.sinClasificar.length} módulo
                {panel.detalle.sinClasificar.length === 1 ? "" : "s"} —{" "}
                <span className="text-editor-text">
                  {panel.detalle.sinClasificar.join(", ")}
                </span>
              </p>
            )}
          </div>
        )}

        {!loading && panel?.certificable === true && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Resumen etiqueta="Alumnos" valor={String(panel.resumen.alumnos)} />
              <Resumen
                etiqueta="Pueden recibirlo"
                valor={String(panel.resumen.puedenRecibirlo)}
                acento={panel.resumen.puedenRecibirlo > 0}
              />
              <Resumen etiqueta="Ya lo tienen" valor={String(panel.resumen.yaLoTienen)} />
              <Resumen
                etiqueta="Ejercicios que exige la ruta"
                valor={`${panel.exigidos} en ${panel.modulos.length} módulos`}
              />
            </div>

            {error && (
              <p className="mb-4 text-sm text-amber-400 flex items-center gap-2">
                <TriangleAlert size={16} />
                {error}
              </p>
            )}

            {panel.filas.length === 0 ? (
              <p className="text-editor-muted text-sm">No hay alumnos cargados.</p>
            ) : (
              <div className="bg-editor-surface border border-editor-border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-editor-bg/60 text-editor-muted">
                    <tr>
                      <th className="text-left font-medium px-4 py-3">Alumno</th>
                      <th className="text-left font-medium px-4 py-3">Cohorte</th>
                      <th className="text-left font-medium px-4 py-3">Le falta</th>
                      <th className="text-left font-medium px-4 py-3">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {panel.filas.map((f) => (
                      <FilaAlumno
                        key={f.userId}
                        fila={f}
                        abierta={abierta === f.userId}
                        alAbrir={() => setAbierta(abierta === f.userId ? null : f.userId)}
                        alOtorgar={() => setConfirmando(f)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {confirmando && (
              <ConfirmarOtorgamiento
                fila={confirmando}
                dojo={NOMBRE[dojo] ?? dojo}
                otorgando={otorgando}
                alCancelar={() => setConfirmando(null)}
                alConfirmar={() => otorgarA(confirmando)}
              />
            )}

            <p className="text-editor-muted text-xs mt-4">
              El certificado exige el 100 % de los ejercicios de <strong>todos</strong> los
              módulos obligatorios de la ruta. Que un módulo todavía no esté habilitado explica
              por qué falta — no achica el requisito.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function Resumen({
  etiqueta,
  valor,
  acento,
}: {
  etiqueta: string;
  valor: string;
  acento?: boolean;
}) {
  return (
    <div className="bg-editor-surface border border-editor-border rounded-xl p-4">
      <p className="text-editor-muted text-xs uppercase tracking-wide">{etiqueta}</p>
      <p className={`text-xl font-bold mt-1 ${acento ? "text-neon-green" : "text-white"}`}>
        {valor}
      </p>
    </div>
  );
}

function FilaAlumno({
  fila,
  abierta,
  alAbrir,
  alOtorgar,
}: {
  fila: Fila;
  abierta: boolean;
  alAbrir: () => void;
  alOtorgar: () => void;
}) {
  const faltantes = fila.elegibilidad.faltantes ?? {};
  const modulosConHueco = Object.keys(faltantes);
  const esperando = fila.aunNoHabilitados.length;

  return (
    <>
      <tr
        onClick={modulosConHueco.length > 0 ? alAbrir : undefined}
        className={`border-t border-editor-border ${
          modulosConHueco.length > 0 ? "cursor-pointer hover:bg-editor-bg/40" : ""
        }`}
      >
        <td className="px-4 py-3">
          <p className="text-white">{fila.nombre}</p>
          <p className="text-editor-muted text-xs">{fila.email}</p>
        </td>
        <td className="px-4 py-3 text-editor-muted">{fila.cohort}</td>
        <td className="px-4 py-3">
          {fila.elegibilidad.elegible ? (
            <span className="text-neon-green">nada</span>
          ) : (
            <span className="text-editor-text">
              {fila.faltan} de {fila.exigidos}
            </span>
          )}
        </td>
        <td className="px-4 py-3">
          {fila.yaCertificado ? (
            <span className="inline-flex items-center gap-1.5 text-editor-muted">
              <CheckCircle2 size={14} />
              ya lo tiene
            </span>
          ) : fila.elegibilidad.elegible ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                alOtorgar();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-neon-green/10 border border-neon-green/30 rounded-lg text-neon-green hover:bg-neon-green/20 transition-colors"
            >
              <Award size={14} />
              Otorgar
            </button>
          ) : esperando > 0 ? (
            <span className="inline-flex items-center gap-1.5 text-editor-muted">
              <CalendarClock size={14} />
              espera {esperando} módulo{esperando === 1 ? "" : "s"} sin abrir
            </span>
          ) : (
            <span className="text-editor-muted">en curso</span>
          )}
        </td>
      </tr>

      {abierta && modulosConHueco.length > 0 && (
        <tr className="border-t border-editor-border bg-editor-bg/40">
          <td colSpan={4} className="px-4 py-3">
            <ul className="space-y-1">
              {modulosConHueco.map((slug) => {
                const sinAbrir = fila.aunNoHabilitados.includes(slug);
                return (
                  <li key={slug} className="text-xs flex items-center gap-2">
                    <span className="text-editor-text font-mono">{slug}</span>
                    <span className="text-editor-muted">
                      faltan {faltantes[slug].length}
                    </span>
                    {sinAbrir && (
                      <span className="inline-flex items-center gap-1 text-editor-muted">
                        <CalendarClock size={12} />
                        todavía no habilitado para esta cohorte
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </td>
        </tr>
      )}
    </>
  );
}

/**
 * La confirmacion antes de otorgar.
 *
 * Existe por una razon concreta y no por costumbre: NO HAY REVOCACION. El
 * disenio la dejo fuera a proposito -- "a certificate awarded is awarded" -- asi
 * que un clic en la fila equivocada es permanente y no hay pantalla que lo
 * deshaga. Y nombra al alumno y la ruta, porque una confirmacion que solo dice
 * "estas seguro?" no ayuda a descubrir que le erraste a la fila.
 */
function ConfirmarOtorgamiento({
  fila,
  dojo,
  otorgando,
  alCancelar,
  alConfirmar,
}: {
  fila: Fila;
  dojo: string;
  otorgando: boolean;
  alCancelar: () => void;
  alConfirmar: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-editor-surface border border-editor-border rounded-xl p-6 max-w-md w-full">
        <h2 className="text-white font-bold text-lg flex items-center gap-2">
          <Award size={18} className="text-neon-green" />
          Otorgar el certificado de {dojo}
        </h2>

        <p className="text-editor-text text-sm mt-3">
          A <strong className="text-white">{fila.nombre}</strong>{" "}
          <span className="text-editor-muted">({fila.email})</span>, cohorte {fila.cohort}.
        </p>

        <p className="text-editor-muted text-sm mt-3">
          Queda congelado lo que la ruta exigía hoy: {fila.exigidos} ejercicios. Si mañana
          crece un módulo obligatorio, este certificado no cambia.
        </p>

        <p className="text-amber-400 text-sm mt-3 flex items-start gap-2">
          <TriangleAlert size={16} className="mt-0.5 shrink-0" />
          <span>No se puede revocar.</span>
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={alCancelar}
            disabled={otorgando}
            className="px-4 py-2 text-sm text-editor-muted hover:text-white transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={alConfirmar}
            disabled={otorgando}
            className="px-4 py-2 text-sm font-medium bg-neon-green/15 border border-neon-green/40 rounded-lg text-neon-green hover:bg-neon-green/25 transition-colors disabled:opacity-50"
          >
            {otorgando ? "Otorgando..." : "Otorgar"}
          </button>
        </div>
      </div>
    </div>
  );
}
