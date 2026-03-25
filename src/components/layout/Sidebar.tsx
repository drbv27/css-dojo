"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  BookOpen,
  Code,
  Trophy,
  User,
  GraduationCap,
  Braces,
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
};

function NavLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const Icon = ICON_MAP[item.icon];

  return (
    <Link
      href={item.href}
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

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const isTeacher = user?.role === "teacher";
  const userXP = 0; // Will be fetched from user data in context
  const rank = getRank(userXP);

  return (
    <aside className="fixed left-0 top-0 z-40 hidden lg:flex h-screen w-64 flex-col bg-editor-sidebar border-r border-editor-border">
      {/* Brand */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-editor-border">
        <Braces className="h-7 w-7 text-neon-blue" />
        <span className="text-xl font-bold font-mono tracking-tight text-neon-blue">
          CSS <span className="text-editor-text">Dojo</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            isActive={pathname === item.href || pathname.startsWith(item.href + "/")}
          />
        ))}

        {isTeacher && (
          <>
            <div className="my-4 border-t border-editor-border" />
            <p className="px-4 pb-1 text-xs font-semibold uppercase tracking-wider text-editor-muted">
              Profesor
            </p>
            {TEACHER_NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                isActive={pathname === item.href || pathname.startsWith(item.href + "/")}
              />
            ))}
          </>
        )}
      </nav>

      {/* User mini-profile */}
      {user && (
        <div className="border-t border-editor-border px-4 py-4">
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
                rank={{ name: rank.name, color: rank.color, icon: rank.icon }}
                size="sm"
              />
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
