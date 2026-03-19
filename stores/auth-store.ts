"use client";

import { create } from "zustand";
import { fetchCurrentUser, loginAccount, logoutAccount, registerAccount } from "@/lib/api/auth";
import type { AuthStatus, AuthUser } from "@/lib/auth/types";

interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
  error: string | null;
  bootstrapped: boolean;
  bootstrap: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  status: "loading",
  user: null,
  error: null,
  bootstrapped: false,

  async bootstrap() {
    if (get().bootstrapped) return;
    set({ status: "loading", error: null });
    try {
      const response = await fetchCurrentUser();
      set({
        user: response.user,
        status: response.authenticated ? "authenticated" : "guest",
        bootstrapped: true,
      });
    } catch {
      set({ user: null, status: "guest", bootstrapped: true });
    }
  },

  async login(username, password) {
    set({ error: null });
    const { user } = await loginAccount(username, password);
    set({ user, status: "authenticated", bootstrapped: true });
  },

  async register(username, password) {
    set({ error: null });
    const { user } = await registerAccount(username, password);
    set({ user, status: "authenticated", bootstrapped: true });
  },

  async logout() {
    await logoutAccount();
    set({ user: null, status: "guest", bootstrapped: true, error: null });
  },

  clearError() {
    set({ error: null });
  },
}));
