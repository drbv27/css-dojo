"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Terminal } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  BUNDLE_LAUNCH_USD,
  PYTHON_WAITLIST_SLUG,
  BACKEND_PYTHON,
  productName,
  buyIntentLabel,
  sandboxWtpLabel,
} from "@/lib/course-launch";

interface Dist {
  key: string;
  label: string;
  count: number;
}
interface Respondent {
  name: string;
  email: string;
  products: string[];
  buyIntent: string;
  individualPicks: string[];
  sandboxWtp: string;
  comment: string;
  createdAt: string;
}
interface Stats {
  total: number;
  buyers: number;
  products: Dist[];
  buyIntent: Dist[];
  sandboxWtp: Dist[];
  respondents: Respondent[];
}
interface WaitPerson {
  name: string;
  email: string;
  comment: string;
}
interface WaitStats {
  total: number;
  people: WaitPerson[];
}

function DistBars({ data }: { data: Dist[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <div className="space-y-2.5">
      {data.map((d) => (
        <div key={d.key} className="flex items-center gap-3">
          <span className="w-40 shrink-0 text-sm text-editor-muted text-right">{d.label}</span>
          <div className="flex-1 h-6 rounded-md bg-editor-bg overflow-hidden">
            <div
              className="h-full rounded-md bg-gradient-to-r from-neon-pink to-neon-purple transition-all"
              style={{ width: `${(d.count / max) * 100}%` }}
            />
          </div>
          <span className="w-8 shrink-0 font-mono tabular-nums text-sm text-editor-text text-right">
            {d.count}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function TeacherOpenCodePage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [wait, setWait] = useState<WaitStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/course-interest/stats").then((r) => r.json()),
      fetch(`/api/waitlist/stats?slug=${PYTHON_WAITLIST_SLUG}`).then((r) => r.json()),
    ])
      .then(([s, w]) => {
        setStats(s);
        setWait(w);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!stats) return <p className="p-6 text-editor-muted">No se pudieron cargar los datos.</p>;

  const topProduct = [...stats.products].sort((a, b) => b.count - a.count)[0];
  const topSandbox = [...stats.sandboxWtp].sort((a, b) => b.count - a.count)[0];

  return (
    <div className="p-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <Link
            href="/teacher"
            className="inline-flex items-center gap-2 text-sm text-editor-muted hover:text-neon-pink transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Panel
          </Link>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-editor-text">
            <Terminal className="w-6 h-6 text-neon-pink" /> Sondeo de pre-lanzamiento
          </h1>
          <p className="text-editor-muted text-sm mt-1">
            Open Code · Backend Node · Frontend Vue · Sandbox. Pack: ${BUNDLE_LAUNCH_USD} USD.
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-editor-border bg-editor-surface p-5">
            <p className="text-xs uppercase tracking-wider text-editor-muted mb-2">Respuestas</p>
            <p className="text-4xl font-bold font-mono tabular-nums text-editor-text">{stats.total}</p>
          </div>
          <div className="rounded-xl border border-neon-pink/25 bg-editor-surface p-5">
            <p className="text-xs uppercase tracking-wider text-editor-muted mb-2">
              Con intención de compra
            </p>
            <p className="text-4xl font-bold font-mono tabular-nums text-neon-pink">{stats.buyers}</p>
            <p className="text-[11px] text-editor-muted mt-2">Señal dura (no “explorando”)</p>
          </div>
          <div className="rounded-xl border border-editor-border bg-editor-surface p-5">
            <p className="text-xs uppercase tracking-wider text-editor-muted mb-2">Producto más pedido</p>
            <p className="text-lg font-bold text-editor-text leading-tight">
              {topProduct && topProduct.count > 0 ? topProduct.label : "—"}
            </p>
            <p className="text-[11px] text-editor-muted mt-2">
              {topProduct && topProduct.count > 0 ? `${topProduct.count} interesados` : "Sin datos aún"}
            </p>
          </div>
          <div className="rounded-xl border border-neon-purple/25 bg-editor-surface p-5">
            <p className="text-xs uppercase tracking-wider text-editor-muted mb-2">Sandbox: preferencia</p>
            <p className="text-lg font-bold text-editor-text leading-tight">
              {topSandbox && topSandbox.count > 0 ? topSandbox.label : "—"}
            </p>
            <p className="text-[11px] text-editor-muted mt-2">
              {topSandbox && topSandbox.count > 0 ? `${topSandbox.count} votos` : "Sin datos aún"}
            </p>
          </div>
        </div>

        {/* Distribuciones */}
        <div className="grid grid-cols-1 gap-4">
          <div className="rounded-xl border border-editor-border bg-editor-surface p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-editor-muted mb-4">
              Interés por producto
            </h2>
            <DistBars data={stats.products} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-xl border border-editor-border bg-editor-surface p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-editor-muted mb-4">
                ¿Qué reservarían?
              </h2>
              <DistBars data={stats.buyIntent} />
            </div>
            <div className="rounded-xl border border-editor-border bg-editor-surface p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-editor-muted mb-4">
                Disposición a pagar por el Sandbox
              </h2>
              <DistBars data={stats.sandboxWtp} />
            </div>
          </div>
        </div>

        {/* Respondientes */}
        <div className="rounded-xl border border-editor-border bg-editor-surface overflow-hidden">
          <div className="px-5 py-4 border-b border-editor-border">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-editor-muted">
              Interesados ({stats.respondents.length})
            </h2>
          </div>
          {stats.respondents.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-editor-muted">
              Aún nadie ha respondido. El anuncio ya está visible en el dashboard de los alumnos.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-editor-muted border-b border-editor-border">
                    <th className="px-5 py-3 font-medium">Alumno</th>
                    <th className="px-5 py-3 font-medium">Correo</th>
                    <th className="px-5 py-3 font-medium">Reservaría</th>
                    <th className="px-5 py-3 font-medium">Interés</th>
                    <th className="px-5 py-3 font-medium">Sandbox</th>
                    <th className="px-5 py-3 font-medium">Comentario</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.respondents.map((r, i) => (
                    <tr key={i} className="border-b border-editor-border/50 last:border-0 align-top">
                      <td className="px-5 py-3 text-editor-text font-medium whitespace-nowrap">{r.name}</td>
                      <td className="px-5 py-3 text-editor-muted whitespace-nowrap">{r.email}</td>
                      <td className="px-5 py-3 text-editor-text">
                        {buyIntentLabel(r.buyIntent)}
                        {r.buyIntent === "individual" && r.individualPicks.length > 0 && (
                          <span className="block text-[11px] text-editor-muted">
                            {r.individualPicks.map(productName).join(", ")}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-editor-muted">
                        {r.products.length ? r.products.map(productName).join(", ") : "—"}
                      </td>
                      <td className="px-5 py-3 text-editor-muted whitespace-nowrap">
                        {sandboxWtpLabel(r.sandboxWtp)}
                      </td>
                      <td className="px-5 py-3 text-editor-muted max-w-xs">{r.comment || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Curso gratuito: lista de espera */}
        <div className="rounded-xl border border-neon-green/25 bg-editor-surface overflow-hidden">
          <div className="px-5 py-4 border-b border-editor-border flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-editor-muted">
                Curso gratuito · {BACKEND_PYTHON.title}
              </h2>
              <p className="text-xs text-editor-muted mt-0.5">Lista de espera (sin pago)</p>
            </div>
            <span className="font-mono text-3xl font-bold tabular-nums text-neon-green">
              {wait?.total ?? 0}
            </span>
          </div>
          {!wait || wait.people.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-editor-muted">
              Aún nadie se ha apuntado. El banner ya está visible en el dashboard.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-editor-muted border-b border-editor-border">
                    <th className="px-5 py-3 font-medium">Alumno</th>
                    <th className="px-5 py-3 font-medium">Correo</th>
                    <th className="px-5 py-3 font-medium">Comentario</th>
                  </tr>
                </thead>
                <tbody>
                  {wait.people.map((p, i) => (
                    <tr key={i} className="border-b border-editor-border/50 last:border-0">
                      <td className="px-5 py-3 text-editor-text font-medium whitespace-nowrap">{p.name}</td>
                      <td className="px-5 py-3 text-editor-muted whitespace-nowrap">{p.email}</td>
                      <td className="px-5 py-3 text-editor-muted max-w-xs">{p.comment || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
