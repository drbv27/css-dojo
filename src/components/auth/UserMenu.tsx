"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { User, LogOut, ChevronDown } from "lucide-react";

export function UserMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!user) return null;

  const { name, email, image, role } = user;

  return (
    <div ref={menuRef} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-editor-hover"
        aria-label="Menu de usuario"
      >
        {image ? (
          <img
            src={image}
            alt={name ?? "Avatar"}
            className="h-8 w-8 rounded-full ring-2 ring-editor-border"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-editor-hover ring-2 ring-editor-border">
            <User className="h-4 w-4 text-editor-muted" />
          </div>
        )}
        <ChevronDown
          className={`h-4 w-4 text-editor-muted transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-editor-border bg-editor-sidebar shadow-xl shadow-black/30 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* User info */}
          <div className="px-4 py-3 border-b border-editor-border">
            <p className="text-sm font-medium text-editor-text truncate">
              {name ?? "Usuario"}
            </p>
            <p className="text-xs text-editor-muted truncate mt-0.5">
              {email}
            </p>
            <span
              className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                role === "teacher"
                  ? "bg-neon-purple/15 text-neon-purple"
                  : "bg-neon-blue/15 text-neon-blue"
              }`}
            >
              {role === "teacher" ? "Profesor" : "Estudiante"}
            </span>
          </div>

          {/* Actions */}
          <div className="py-1.5">
            <Link
              href="/perfil"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-editor-muted transition-colors hover:text-editor-text hover:bg-editor-hover"
            >
              <User className="h-4 w-4" />
              <span>Perfil</span>
            </Link>
            <button
              onClick={() => logout()}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-neon-red/80 transition-colors hover:text-neon-red hover:bg-editor-hover"
            >
              <LogOut className="h-4 w-4" />
              <span>Cerrar sesion</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
