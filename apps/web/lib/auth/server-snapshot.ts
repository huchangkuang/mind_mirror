import type { AuthUser } from "@/lib/auth/types";

export interface AuthServerSnapshot {
  authenticated: boolean;
  user: AuthUser | null;
  isFeedbackModerator: boolean;
}

export async function getAuthServerSnapshot(): Promise<AuthServerSnapshot> {
  // Frontend auth has migrated to external API + client token store.
  // Keep server snapshot as guest to avoid touching local DB runtime.
  const user: AuthUser | null = null;
  return {
    authenticated: false,
    user,
    isFeedbackModerator: false,
  };
}
