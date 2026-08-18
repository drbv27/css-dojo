"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, Check, FileCode } from "lucide-react";

interface SubMeta {
  filename: string;
  size: number;
  updatedAt: string;
}

const MAX_SIZE = 2_000_000;

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("es-CO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export default function ProjectSubmission({ slug }: { slug: string }) {
  const [current, setCurrent] = useState<SubMeta | null>(null);
  const [file, setFile] = useState<{ name: string; content: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [justSent, setJustSent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`/api/submissions?projectSlug=${slug}`)
      .then((r) => r.json())
      .then((d) => setCurrent(d.submission ?? null))
      .catch(() => {});
  }, [slug]);

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    setError("");
    setJustSent(false);
    const f = e.target.files?.[0];
    if (!f) return;
    if (!/\.html?$/i.test(f.name)) {
      setError("El archivo debe ser .html");
      return;
    }
    if (f.size > MAX_SIZE) {
      setError("El archivo es demasiado grande (max 2 MB).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setFile({ name: f.name, content: String(reader.result ?? "") });
    reader.onerror = () => setError("No se pudo leer el archivo.");
    reader.readAsText(f);
  }

  async function submit() {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectSlug: slug, filename: file.name, content: file.content }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "No se pudo subir.");
        return;
      }
      setCurrent({ filename: file.name, size: file.content.length, updatedAt: new Date().toISOString() });
      setFile(null);
      setJustSent(true);
      if (inputRef.current) inputRef.current.value = "";
    } catch {
      setError("Error de red. Intenta de nuevo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border border-neon-green/30 bg-editor-surface p-5">
      <div className="flex items-center gap-2 mb-1">
        <FileCode className="w-5 h-5 text-neon-green" />
        <h3 className="font-semibold text-editor-text">Entregar el proyecto</h3>
      </div>
      <p className="text-sm text-editor-muted mb-4">
        Sube tu archivo <code className="text-neon-green">index.html</code> terminado. Tu profe lo revisará.
        Puedes volver a subirlo para reemplazarlo.
      </p>

      {current && (
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-neon-green/20 bg-neon-green/[0.06] px-3 py-2 text-sm">
          <Check className="w-4 h-4 text-neon-green shrink-0" />
          <span className="text-editor-text font-medium">{current.filename}</span>
          <span className="text-editor-muted">· entregado {fmtDate(current.updatedAt)}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept=".html,.htm,text/html"
          onChange={onPick}
          className="text-sm text-editor-muted file:mr-3 file:rounded-lg file:border-0 file:bg-editor-hover file:px-4 file:py-2 file:text-sm file:font-medium file:text-editor-text hover:file:bg-editor-border"
        />
        <button
          type="button"
          onClick={submit}
          disabled={!file || busy}
          className="inline-flex items-center gap-2 rounded-lg bg-neon-green px-5 py-2 text-sm font-semibold text-editor-bg transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          <Upload className="w-4 h-4" />
          {busy ? "Subiendo…" : current ? "Reemplazar entrega" : "Subir entrega"}
        </button>
      </div>

      {file && <p className="mt-2 text-xs text-editor-muted">Listo para subir: {file.name}</p>}
      {error && <p className="mt-2 text-sm text-neon-red">{error}</p>}
      {justSent && <p className="mt-2 text-sm text-neon-green">¡Entrega subida! Tu profe ya puede verla.</p>}
    </div>
  );
}
