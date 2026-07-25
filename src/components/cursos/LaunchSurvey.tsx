"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import {
  PRODUCTS,
  COURSE_SLUGS,
  BUY_INTENT_OPTIONS,
  SANDBOX_WTP_OPTIONS,
  SURVEY_CLOSES_AT,
  productName,
} from "@/lib/course-launch";

interface Interest {
  products: string[];
  buyIntent: string;
  individualPicks: string[];
  sandboxWtp: string;
  comment?: string;
}

function closesLabel() {
  return new Date(SURVEY_CLOSES_AT).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
  });
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-4 py-2.5 text-sm font-medium text-left transition-colors ${
        active
          ? "border-neon-pink bg-neon-pink/10 text-neon-pink"
          : "border-editor-border text-editor-muted hover:border-neon-pink/40 hover:text-editor-text"
      }`}
    >
      {children}
    </button>
  );
}

export default function LaunchSurvey() {
  const [loading, setLoading] = useState(true);
  const [answered, setAnswered] = useState(false);
  const [products, setProducts] = useState<string[]>([]);
  const [buyIntent, setBuyIntent] = useState("");
  const [individualPicks, setIndividualPicks] = useState<string[]>([]);
  const [sandboxWtp, setSandboxWtp] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [justAwarded, setJustAwarded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/course-interest")
      .then((r) => r.json())
      .then((d: { interest: Interest | null }) => {
        if (d.interest) {
          setAnswered(true);
          setProducts(d.interest.products ?? []);
          setBuyIntent(d.interest.buyIntent ?? "");
          setIndividualPicks(d.interest.individualPicks ?? []);
          setSandboxWtp(d.interest.sandboxWtp ?? "");
          setComment(d.interest.comment ?? "");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  function toggle(list: string[], setList: (v: string[]) => void, key: string) {
    setList(list.includes(key) ? list.filter((k) => k !== key) : [...list, key]);
  }

  async function submit() {
    setError("");
    if (!buyIntent) {
      setError("Cuéntanos qué reservarías si abriéramos inscripciones.");
      return;
    }
    if (!sandboxWtp) {
      setError("Falta la pregunta del Sandbox.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/course-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products,
          buyIntent,
          individualPicks: buyIntent === "individual" ? individualPicks : [],
          sandboxWtp,
          comment: comment.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setAnswered(true);
      if (data.awardedBadge) setJustAwarded(true);
    } catch {
      setError("No se pudo guardar. Intenta de nuevo en un momento.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return null;

  return (
    <div id="reservar" className="scroll-mt-6 space-y-6">
      {answered && (
        <div className="rounded-xl border border-neon-green/30 bg-neon-green/[0.05] p-5">
          <p className="flex items-center gap-2 text-neon-green font-semibold">
            <Check className="w-5 h-5" /> ¡Gracias, quedaste en la lista!
          </p>
          <p className="text-sm text-editor-muted mt-1">
            Te avisaremos por correo apenas abramos las inscripciones.
            {justAwarded && (
              <span className="text-neon-pink"> Ganaste la insignia 🚀 Pionero Open Code.</span>
            )}
          </p>
          <p className="text-xs text-editor-muted mt-2">
            ¿Cambiaste de opinión? Ajusta tus respuestas abajo y vuelve a guardar.
          </p>
        </div>
      )}

      <div className="rounded-xl border border-editor-border bg-editor-surface p-6 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-editor-text">
            {answered ? "Tus respuestas" : "Aparta tu cupo"}
          </h2>
          <p className="text-sm text-editor-muted mt-1">
            3 preguntas rápidas. Sin pago ahora — solo queremos saber qué construir para ti.
          </p>
        </div>

        {/* 1. Interes por producto */}
        <fieldset>
          <legend className="text-sm font-medium text-editor-text mb-3">
            ¿Cuáles de estos te interesan?{" "}
            <span className="text-editor-muted font-normal">(los que quieras)</span>
          </legend>
          <div className="grid grid-cols-1 gap-2">
            {PRODUCTS.map((p) => {
              const active = products.includes(p.slug);
              return (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => toggle(products, setProducts, p.slug)}
                  className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
                    active ? "border-neon-pink bg-neon-pink/10" : "border-editor-border hover:border-neon-pink/40"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                      active ? "border-neon-pink bg-neon-pink text-white" : "border-editor-muted"
                    }`}
                  >
                    {active && <Check className="h-3 w-3" />}
                  </span>
                  <span>
                    <span className={`text-sm font-medium ${active ? "text-neon-pink" : "text-editor-text"}`}>
                      {p.name}
                      {p.kind === "service" && (
                        <span className="ml-2 rounded bg-neon-purple/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-neon-purple">
                          Servicio
                        </span>
                      )}
                    </span>
                    <span className="block text-xs text-editor-muted">{p.subtitle}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* 2. Intencion de compra (senal dura) */}
        <fieldset>
          <legend className="text-sm font-medium text-editor-text mb-3">
            Si abriéramos inscripciones hoy, ¿qué reservarías?
          </legend>
          <div className="grid grid-cols-1 gap-2">
            {BUY_INTENT_OPTIONS.map((o) => (
              <Chip key={o.key} active={buyIntent === o.key} onClick={() => setBuyIntent(o.key)}>
                {o.label}
              </Chip>
            ))}
          </div>

          {buyIntent === "individual" && (
            <div className="mt-3 rounded-lg border border-editor-border bg-editor-bg p-3">
              <p className="text-xs text-editor-muted mb-2">¿Cuáles cursos?</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {COURSE_SLUGS.map((slug) => (
                  <Chip
                    key={slug}
                    active={individualPicks.includes(slug)}
                    onClick={() => toggle(individualPicks, setIndividualPicks, slug)}
                  >
                    {productName(slug)}
                  </Chip>
                ))}
              </div>
            </div>
          )}
        </fieldset>

        {/* 3. Precio del sandbox */}
        <fieldset>
          <legend className="text-sm font-medium text-editor-text mb-1">
            Por el <span className="text-neon-purple font-semibold">Sandbox</span> (desplegar tus MVPs con
            backend, base de datos y subdominio propio), ¿qué pagarías?
          </legend>
          <p className="text-xs text-editor-muted mb-3">Esto nos ayuda a decidir cómo cobrarlo.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SANDBOX_WTP_OPTIONS.map((o) => (
              <Chip key={o.key} active={sandboxWtp === o.key} onClick={() => setSandboxWtp(o.key)}>
                {o.label}
              </Chip>
            ))}
          </div>
        </fieldset>

        {/* Comentario */}
        <div>
          <label htmlFor="oc-comment" className="text-sm font-medium text-editor-text">
            ¿Algo que te gustaría que incluyera?{" "}
            <span className="text-editor-muted font-normal">(opcional)</span>
          </label>
          <textarea
            id="oc-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            maxLength={1000}
            placeholder="Ej: me interesa desplegar apps, automatizar tareas, prepararme para entrevistas…"
            className="mt-2 w-full rounded-lg border border-editor-border bg-editor-bg px-3 py-2 text-sm text-editor-text placeholder:text-editor-muted/60 focus:border-neon-pink/50 focus:outline-none resize-none"
          />
        </div>

        {error && <p className="text-sm text-neon-red">{error}</p>}

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-neon-pink to-neon-purple px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Guardando…" : answered ? "Actualizar mis respuestas" : "Reservar mi cupo"}
          </button>
          <p className="text-xs text-editor-muted">
            Sin pago ahora · Reservas abiertas hasta el {closesLabel()}
          </p>
        </div>
      </div>
    </div>
  );
}
