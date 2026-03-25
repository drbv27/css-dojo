"use client";

import { useAuth } from "@/hooks/useAuth";
import LogoutButton from "./LogoutButton";

export default function ApprovalGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-editor-bg">
        <div className="w-8 h-8 border-2 border-neon-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user && user.role === "student" && !user.approved) {
    return (
      <div className="h-screen flex items-center justify-center bg-editor-bg px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-neon-yellow/10 border-2 border-neon-yellow/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-neon-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-editor-text mb-3">
            Esperando aprobacion
          </h1>
          <p className="text-editor-muted mb-2">
            Tu cuenta ha sido creada exitosamente.
          </p>
          <p className="text-editor-muted mb-8">
            El profesor aun no ha autorizado tu acceso. Por favor, espera a que te habilite para poder ingresar a la plataforma.
          </p>
          <div className="bg-editor-surface border border-editor-border rounded-xl p-4 mb-6">
            <p className="text-sm text-editor-muted">
              Registrado como: <span className="text-editor-text font-medium">{user.name}</span>
            </p>
            <p className="text-xs text-editor-muted mt-1">{user.email}</p>
          </div>
          <div className="flex justify-center">
            <LogoutButton />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
