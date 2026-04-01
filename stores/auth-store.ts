"use client";

import { create } from "zustand";
import {
  fetchCurrentUser,
  loginAccount,
  logoutAccount,
  registerAccount,
  updateNickname as updateNicknameApi,
} from "@/lib/api/auth";
import type { AuthStatus, AuthUser } from "@/lib/auth/types";
import { redirectToAuthIfProtectedPath } from "@/lib/auth/protected-routes";

let bootstrapRequestId = 0;
let bootstrapAbort: AbortController | null = null;

interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
  isFeedbackModerator: boolean;
  error: string | null;
  bootstrapped: boolean;
  bootstrap: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshFromServer: () => Promise<void>;
  updateNickname: (nickname: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  status: "loading",
  user: null,
  isFeedbackModerator: false,
  error: null,
  bootstrapped: false,

  async bootstrap() {
    bootstrapAbort?.abort();
    const controller = new AbortController();
    bootstrapAbort = controller;
    const signal = controller.signal;
    const id = ++bootstrapRequestId;

    const optimisticAuth = get().status === "authenticated" && get().user !== null;
    if (!optimisticAuth) {
      set({ status: "loading", error: null });
    }

    try {
      const response = await fetchCurrentUser(signal);
      if (id !== bootstrapRequestId) return;
      set({
        user: response.user,
        isFeedbackModerator: response.isFeedbackModerator,
        status: response.authenticated ? "authenticated" : "guest",
        bootstrapped: true,
      });
    } catch (e) {
      if (id !== bootstrapRequestId) return;
      if (e instanceof Error && e.name === "AbortError") return;
      const prev = get();
      if (prev.status === "authenticated" && prev.user) {
        set({ bootstrapped: true });
        return;
      }
      set({ user: null, isFeedbackModerator: false, status: "guest", bootstrapped: true });
    }
  },

  async login(username, password) {
    set({ error: null });
    const { user, isFeedbackModerator } = await loginAccount(username, password);
    set({ user, isFeedbackModerator, status: "authenticated", bootstrapped: true });
  },

  async register(username, password) {
    set({ error: null });
    const { user, isFeedbackModerator } = await registerAccount(username, password);
    set({ user, isFeedbackModerator, status: "authenticated", bootstrapped: true });
  },

  async logout() {
    await logoutAccount();
    set({
      user: null,
      isFeedbackModerator: false,
      status: "guest",
      bootstrapped: true,
      error: null,
    });
    redirectToAuthIfProtectedPath();
  },

  clearError() {
    set({ error: null });
  },

  async refreshFromServer() {
    try {
      const response = await fetchCurrentUser();
      set({
        user: response.user,
        isFeedbackModerator: response.isFeedbackModerator,
        status: response.authenticated ? "authenticated" : "guest",
        bootstrapped: true,
      });
    } catch {
      /* keep current state */
    }
  },

  async updateNickname(nickname) {
    set({ error: null });
    const user = await updateNicknameApi(nickname);
    set({ user });
  },
}));

if (typeof window !== "undefined") {
  const flagKey = "__mindmirror_auth_expired_listener_bound__";
  const globalWindow = window as Window & { [flagKey]?: boolean };
  if (!globalWindow[flagKey]) {
    globalWindow[flagKey] = true;
    window.addEventListener("mindmirror:auth-expired", () => {
      useAuthStore.setState({
        user: null,
        isFeedbackModerator: false,
        status: "guest",
        bootstrapped: true,
        error: null,
      });
    });
  }
}
