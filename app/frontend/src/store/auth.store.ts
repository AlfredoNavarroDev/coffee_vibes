"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import { TOKEN_KEY } from "@/lib/api-client";

interface AuthState {
  user: User | null;
  token: string | null;
  isHydrated: boolean;
  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isHydrated: false,
      setAuth: (user, token) => {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(TOKEN_KEY, token);
        }
        set({ user, token });
      },
      setUser: (user) => set({ user }),
      logout: () => {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(TOKEN_KEY);
        }
        set({ user: null, token: null });
      },
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: "cv_auth",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);

export function isStaff(role?: string | null) {
  return role === "OWNER" || role === "ADMIN";
}
