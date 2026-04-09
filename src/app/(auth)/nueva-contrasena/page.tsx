"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, KeyRound, CheckCircle2, Loader2, Eye, EyeOff } from "lucide-react";
import Footer from "@/components/layout/Footer";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [saving, setSaving] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-submit OTP when all 6 digits filled
  useEffect(() => {
    const code = otp.join("");
    if (code.length === 6 && !verifying && !resetToken) {
      setVerifying(true);
      setError("");
      fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      })
        .then((r) => r.json().then((d) => ({ ok: r.ok, data: d })))
        .then(({ ok, data }) => {
          if (ok && data.resetToken) {
            setResetToken(data.resetToken);
          } else {
            setError(data.message || "Codigo incorrecto");
            setOtp(Array(6).fill(""));
            inputRefs.current[0]?.focus();
          }
        })
        .catch(() => setError("Error de conexion"))
        .finally(() => setVerifying(false));
    }
  }, [otp, verifying, resetToken, email]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length > 0) {
      const newOtp = Array(6).fill("");
      pasted.split("").forEach((char, i) => { newOtp[i] = char; });
      setOtp(newOtp);
      const focusIndex = Math.min(pasted.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contrasenas no coinciden");
      return;
    }
    if (password.length < 6) {
      setError("La contrasena debe tener al menos 6 caracteres");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Error al restablecer");
        setSaving(false);
        return;
      }
      setDone(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setError("Error de conexion");
      setSaving(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-editor-bg">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-neon-teal/10 border border-neon-teal/20 flex items-center justify-center">
                <KeyRound className="w-6 h-6 text-neon-teal" />
              </div>
              <h1 className="text-3xl font-bold text-editor-text">Dev Dojo</h1>
            </div>
          </div>

          <div className="bg-editor-surface border border-editor-border rounded-xl p-8">
            {done ? (
              <div className="text-center py-4">
                <CheckCircle2 className="w-12 h-12 text-neon-green mx-auto mb-4" />
                <h2 className="text-lg font-bold text-editor-text mb-2">Contrasena actualizada</h2>
                <p className="text-sm text-editor-muted">Redirigiendo al login...</p>
              </div>
            ) : !resetToken ? (
              <>
                <h2 className="text-lg font-bold text-editor-text mb-2">Ingresa el codigo</h2>
                <p className="text-sm text-editor-muted mb-6">
                  Enviamos un codigo de 6 digitos a <strong className="text-editor-text">{email}</strong>
                </p>

                {/* OTP inputs */}
                <div className="flex justify-center gap-2.5 mb-4" onPaste={handleOtpPaste}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-14 rounded-lg border-2 border-editor-border bg-editor-bg text-center text-xl font-bold text-editor-text outline-none transition focus:border-neon-teal"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                {verifying && (
                  <div className="flex items-center justify-center gap-2 text-sm text-editor-muted mb-4">
                    <Loader2 className="w-4 h-4 animate-spin" /> Verificando...
                  </div>
                )}

                {error && (
                  <div className="bg-neon-red/10 border border-neon-red/20 text-neon-red rounded-lg px-4 py-3 text-sm text-center mb-4">
                    {error}
                  </div>
                )}

                <p className="text-xs text-editor-muted text-center">
                  No recibiste el codigo?{" "}
                  <Link href="/recuperar" className="text-neon-blue hover:text-neon-blue/80 transition-colors">
                    Reenviar
                  </Link>
                </p>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold text-editor-text mb-2">Nueva contrasena</h2>
                <p className="text-sm text-editor-muted mb-6">
                  Codigo verificado. Ingresa tu nueva contrasena.
                </p>

                <form onSubmit={handleResetPassword} className="space-y-5">
                  {error && (
                    <div className="bg-neon-red/10 border border-neon-red/20 text-neon-red rounded-lg px-4 py-3 text-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-editor-text mb-2">Nueva contrasena</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-editor-bg border border-editor-border rounded-lg text-editor-text placeholder-editor-muted focus:outline-none focus:border-neon-teal transition-colors pr-12"
                        placeholder="Minimo 6 caracteres"
                        required
                        minLength={6}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-editor-muted">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-editor-text mb-2">Confirmar contrasena</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-editor-bg border border-editor-border rounded-lg text-editor-text placeholder-editor-muted focus:outline-none focus:border-neon-teal transition-colors"
                      placeholder="Repite tu contrasena"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full flex items-center justify-center gap-2 bg-neon-teal text-editor-bg font-medium py-3 px-4 rounded-lg hover:bg-neon-teal/90 transition-colors disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <KeyRound className="w-5 h-5" />}
                    {saving ? "Guardando..." : "Restablecer contrasena"}
                  </button>
                </form>
              </>
            )}

            {!done && (
              <div className="mt-6 text-center">
                <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-editor-muted hover:text-neon-blue transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Volver al login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function NuevaContrasenaPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-editor-bg">
        <Loader2 className="w-8 h-8 text-neon-teal animate-spin" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
