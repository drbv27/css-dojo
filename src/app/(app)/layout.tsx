import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import LogoutButton from "@/components/auth/LogoutButton";
import SidebarXP from "@/components/gamification/SidebarXP";
import { MobileMenu } from "@/components/layout/MobileMenu";
import ApprovalGate from "@/components/auth/ApprovalGate";
import DojoSwitcher from "@/components/layout/DojoSwitcher";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const navItems = [
    { href: "/dashboard", icon: "home", label: "Dashboard" },
    { href: "/modulos", icon: "book", label: "Modulos" },
    { href: "/playground", icon: "code", label: "Playground" },
    { href: "/leaderboard", icon: "trophy", label: "Leaderboard" },
    { href: "/perfil", icon: "user", label: "Perfil" },
  ];

  const teacherItems = [
    { href: "/teacher", icon: "teacher", label: "Panel Profesor" },
    { href: "/teacher/modulos", icon: "settings", label: "Gestionar Modulos" },
  ];

  return (
    <ApprovalGate>
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-editor-sidebar border-r border-editor-border shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 h-16 border-b border-editor-border">
          <div className="w-8 h-8 rounded-lg bg-neon-teal/10 border border-neon-teal/20 flex items-center justify-center">
            <span className="text-sm font-bold font-mono text-neon-teal">{"</>"}</span>
          </div>
          <span className="text-lg font-bold text-editor-text">Dev Dojo</span>
        </div>

        {/* Track Selector */}
        <DojoSwitcher />

        <div className="mx-3 border-t border-editor-border" />

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-editor-muted hover:text-editor-text hover:bg-editor-hover transition-colors text-sm font-medium"
            >
              <NavIcon name={item.icon} />
              {item.label}
            </Link>
          ))}

          {session.role === "teacher" && (
            <>
              <div className="my-3 border-t border-editor-border" />
              {teacherItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neon-purple hover:bg-editor-hover transition-colors text-sm font-medium"
                >
                  <NavIcon name={item.icon} />
                  {item.label}
                </Link>
              ))}
            </>
          )}
        </nav>

        {/* XP & Rank */}
        <SidebarXP />

        {/* User section */}
        <div className="px-4 py-4 border-t border-editor-border space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-neon-purple/20 flex items-center justify-center text-sm font-medium text-neon-purple">
              {session.name?.charAt(0).toUpperCase() ?? "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-editor-text truncate">{session.name}</p>
              <p className="text-xs text-editor-muted truncate">{session.email}</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Mobile menu button - only on mobile */}
        <div className="lg:hidden fixed top-3 left-3 z-50">
          <MobileMenu />
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-editor-bg p-6">
          {children}
        </main>
      </div>
    </div>
    </ApprovalGate>
  );
}

function NavIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    home: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    book: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    code: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    trophy: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 21h8m-4-4v4m-4.5-9.5L12 7l4.5 4.5M5 3h14a1 1 0 011 1v3a6 6 0 01-6 6h-4a6 6 0 01-6-6V4a1 1 0 011-1z" />
      </svg>
    ),
    user: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    teacher: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    settings: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  };
  return <>{icons[name] ?? null}</>;
}
