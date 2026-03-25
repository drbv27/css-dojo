"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  Menu,
  X,
  LayoutDashboard,
  BookOpen,
  Code,
  Trophy,
  User,
  GraduationCap,
  Settings,
  Braces,
  LogOut,
} from "lucide-react";
import { NAV_ITEMS, TEACHER_NAV_ITEMS } from "@/lib/constants";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { getRank } from "@/lib/xp";
import type { NavItem } from "@/types";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  BookOpen,
  Code,
  Trophy,
  User,
  GraduationCap,
  Settings,
};

function MobileNavLink({
  item,
  isActive,
  onClick,
}: {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = ICON_MAP[item.icon];

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
        isActive
          ? "bg-editor-hover text-neon-blue"
          : "text-editor-muted hover:text-editor-text hover:bg-editor-hover"
      }`}
    >
      {Icon && <Icon className="h-5 w-5 shrink-0" />}
      <span>{item.label}</span>
    </Link>
  );
}

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isTeacher = user?.role === "teacher";
  const rank = getRank(user?.xp ?? 0);

  // Close drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Hamburger button - only visible on mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden flex items-center justify-center h-10 w-10 rounded-lg text-editor-muted hover:text-editor-text hover:bg-editor-hover transition-colors"
        aria-label="Abrir menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-in drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-editor-sidebar border-r border-editor-border transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-editor-border">
          <div className="flex items-center gap-2">
            <Braces className="h-6 w-6 text-neon-blue" />
            <span className="text-lg font-bold font-mono tracking-tight text-neon-blue">
              CSS <span className="text-editor-text">Dojo</span>
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center h-9 w-9 rounded-lg text-editor-muted hover:text-editor-text hover:bg-editor-hover transition-colors"
            aria-label="Cerrar menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <MobileNavLink
              key={item.href}
              item={item}
              isActive={
                pathname === item.href ||
                pathname.startsWith(item.href + "/")
              }
              onClick={() => setIsOpen(false)}
            />
          ))}

          {isTeacher && (
            <>
              <div className="my-4 border-t border-editor-border" />
              <p className="px-4 pb-1 text-xs font-semibold uppercase tracking-wider text-editor-muted">
                Profesor
              </p>
              {TEACHER_NAV_ITEMS.map((item) => (
                <MobileNavLink
                  key={item.href}
                  item={item}
                  isActive={
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/")
                  }
                  onClick={() => setIsOpen(false)}
                />
              ))}
            </>
          )}
        </nav>

        {/* User mini-profile */}
        {user && (
          <div className="border-t border-editor-border px-4 py-4 space-y-3">
            <div className="flex items-center gap-3">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name ?? "Avatar"}
                  className="h-9 w-9 rounded-full ring-2 ring-editor-border"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-editor-hover ring-2 ring-editor-border">
                  <User className="h-4 w-4 text-editor-muted" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-editor-text truncate">
                  {user.name ?? "Usuario"}
                </p>
                <LevelBadge
                  rank={{
                    name: rank.name,
                    color: rank.color,
                    icon: rank.icon,
                  }}
                  size="sm"
                />
              </div>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-editor-muted hover:text-neon-red hover:bg-editor-hover rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesion
            </button>
          </div>
        )}
      </div>
    </>
  );
}
