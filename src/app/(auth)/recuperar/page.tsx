"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Loader2 } from "lucide-react";
import Footer from "@/components/layout/Footer";

export default function RecuperarPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Error al enviar el codigo");
        setLoading(false);
        return;
      }

      setSent(true);
      setTimeout(() => {
        router.push(`/nueva-contrasena?email=${encodeURIComponent(email)}`);
      }, 1500);
    } catch {
      setError("Error de conexion");
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-editor-bg">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-neon-orange/10 border border-neon-orange/20 flex items-center justify-center">
                <Mail className="w-6 h-6 text-neon-orange" />
              </div>
              <h1 className="text-3xl font-bold text-editor-text">Dev Dojo</h1>
            </div>
            <p className="text-editor-muted">Recupera tu contrasena</p>
          </div>

          <div className="bg-editor-surface border border-editor-border rounded-xl p-8">
            {!sent ? (
              <>
                <p className="text-sm text-editor-muted mb-6">
                  Ingresa tu correo electronico y te enviaremos un codigo de 6 digitos para restablecer tu contrasena.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="bg-neon-red/10 border border-neon-red/20 text-neon-red rounded-lg px-4 py-3 text-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-editor-text mb-2">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-editor-bg border border-editor-border rounded-lg text-editor-text placeholder-editor-muted focus:outline-none focus:border-neon-orange transition-colors"
                      placeholder="tu@email.com"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-neon-orange text-editor-bg font-medium py-3 px-4 rounded-lg hover:bg-neon-orange/90 transition-colors disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
                    {loading ? "Enviando..." : "Enviar codigo"}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-xl bg-neon-green/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-neon-green" />
                </div>
                <p className="text-neon-green font-medium mb-2">Codigo enviado!</p>
                <p className="text-sm text-editor-muted">Redirigiendo para ingresar el codigo...</p>
              </div>
            )}

            <div className="mt-6 text-center">
              <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-editor-muted hover:text-neon-blue transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
                Volver al login
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
