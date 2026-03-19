"use client";

import { useAuthStore } from "@/stores/auth-store";

export function useTestCompletionAuthPrompt() {
  const status = useAuthStore((s) => s.status);
  return {
    shouldShowPrompt: status === "guest",
    isAuthLoading: status === "loading",
  };
}
