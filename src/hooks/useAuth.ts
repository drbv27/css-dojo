"use client";

import { createContext, useContext } from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher";
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  badges: string[];
  image?: string;
  approved: boolean;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({}),
  register: async () => ({}),
  logout: async () => {},
  refreshUser: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}
