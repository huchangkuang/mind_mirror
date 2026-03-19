import { getAuthUserFromCookie } from "@/lib/auth/session";
import { isFeedbackModerator } from "@/lib/feedback/admin";
import type { AuthUser } from "@/lib/auth/types";

export interface AuthServerSnapshot {
  authenticated: boolean;
  user: AuthUser | null;
  isFeedbackModerator: boolean;
}

export async function getAuthServerSnapshot(): Promise<AuthServerSnapshot> {
  const user = await getAuthUserFromCookie();
  return {
    authenticated: Boolean(user),
    user,
    isFeedbackModerator: user ? isFeedbackModerator(user.username) : false,
  };
}
