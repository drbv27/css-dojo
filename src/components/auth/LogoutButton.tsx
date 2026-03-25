"use client";

import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-editor-muted hover:text-neon-red hover:bg-neon-red/10 transition-colors"
    >
      <LogOut className="w-4 h-4" />
      Cerrar sesion
    </button>
  );
}
