"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import Footer from "@/components/layout/Footer";
import { LogIn, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-editor-bg">
      <div className="flex-1 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center">
              <span className="text-xl font-bold font-mono text-neon-blue">{"</>"}</span>
            </div>
            <h1 className="text-3xl font-bold text-editor-text">Dev Dojo</h1>
          </div>
          <p className="text-editor-muted">Inicia sesion para continuar</p>
        </div>

        <div className="bg-editor-surface border border-editor-border rounded-xl p-8">
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
                className="w-full px-4 py-3 bg-editor-bg border border-editor-border rounded-lg text-editor-text placeholder-editor-muted focus:outline-none focus:border-neon-blue transition-colors"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-editor-text mb-2">Contrasena</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-editor-bg border border-editor-border rounded-lg text-editor-text placeholder-editor-muted focus:outline-none focus:border-neon-blue transition-colors pr-12"
                  placeholder="Tu contrasena"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-editor-muted hover:text-editor-text transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-neon-blue text-editor-bg font-medium py-3 px-4 rounded-lg hover:bg-neon-blue/90 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
              {loading ? "Iniciando sesion..." : "Iniciar Sesion"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link href="/recuperar" className="text-sm text-editor-muted hover:text-neon-orange transition-colors">
              Olvidaste tu contrasena?
            </Link>
          </div>

          <div className="mt-4 text-center">
            <p className="text-editor-muted text-sm">
              No tienes cuenta?{" "}
              <Link href="/registro" className="text-neon-blue hover:text-neon-blue/80 font-medium transition-colors">
                Registrate aqui
              </Link>
            </p>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}
