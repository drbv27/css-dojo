"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { PYTHON_WAITLIST_SLUG } from "@/lib/course-launch";

export default function FreeCourseSignup() {
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState(false);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [xp, setXp] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/waitlist?slug=${PYTHON_WAITLIST_SLUG}`)
      .then((r) => r.json())
      .then((d) => {
        setJoined(Boolean(d.joined));
        setComment(d.comment ?? "");
      })
      .finally(() => setLoading(false));
  }, []);

  async function join() {
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: PYTHON_WAITLIST_SLUG,
          comment: comment.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setJoined(true);
      if (data.xpAwarded) setXp(data.xpAwarded);
    } catch {
      setError("No se pudo guardar. Intenta de nuevo en un momento.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return null;

  return (
    <div id="apuntarme" className="scroll-mt-6 rounded-xl border border-neon-green/30 bg-editor-surface p-6 space-y-4">
      {joined ? (
        <>
          <p className="flex items-center gap-2 text-neon-green font-semibold">
            <Check className="w-5 h-5" /> ¡Estás en la lista!
          </p>
          <p className="text-sm text-editor-muted">
            Te avisaremos por correo apenas publiquemos el curso.
            {xp > 0 && <span className="text-neon-green"> +{xp} XP por apuntarte.</span>}
          </p>
        </>
      ) : (
        <>
          <div>
            <h2 className="text-lg font-bold text-editor-text">Apúntate gratis</h2>
            <p className="text-sm text-editor-muted mt-1">
              Déjanos tu interés y te avisamos apenas salga. Sin costo, sin compromiso.
            </p>
          </div>
          <div>
            <label htmlFor="py-comment" className="text-sm font-medium text-editor-text">
              ¿Algo que te gustaría que incluyera?{" "}
              <span className="text-editor-muted font-normal">(opcional)</span>
            </label>
            <textarea
              id="py-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
              maxLength={1000}
              placeholder="Ej: me interesa Django REST, tareas asíncronas, pandas…"
              className="mt-2 w-full rounded-lg border border-editor-border bg-editor-bg px-3 py-2 text-sm text-editor-text placeholder:text-editor-muted/60 focus:border-neon-green/50 focus:outline-none resize-none"
            />
          </div>
          {error && <p className="text-sm text-neon-red">{error}</p>}
          <button
            type="button"
            onClick={join}
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-neon-green px-6 py-3 text-sm font-semibold text-editor-bg transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Guardando…" : "Avísame cuando salga"}
          </button>
        </>
      )}
    </div>
  );
}
