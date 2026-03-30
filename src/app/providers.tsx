"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AuthContext, type AuthUser } from "@/hooks/useAuth";
import { DojoContext } from "@/hooks/useDojo";
import type { DojoType } from "@/types";

export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeDojo, setActiveDojo] = useState<DojoType>("html");
  const router = useRouter();

  // Persist dojo selection in localStorage
  useEffect(() => {
    const saved = localStorage.getItem("dev-dojo-active-dojo");
    if (saved === "html" || saved === "css" || saved === "js" || saved === "react" || saved === "react-eco" || saved === "nextjs") {
      setActiveDojo(saved);
    }
  }, []);

  const handleSetActiveDojo = useCallback((dojo: DojoType) => {
    setActiveDojo(dojo);
    localStorage.setItem("dev-dojo-active-dojo", dojo);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error };
    await refreshUser();
    router.push("/dashboard");
    return {};
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error };
    await refreshUser();
    router.push("/dashboard");
    return {};
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      <DojoContext.Provider value={{ activeDojo, setActiveDojo: handleSetActiveDojo }}>
        {children}
      </DojoContext.Provider>
    </AuthContext.Provider>
  );
}
