import type { AuthUser } from "@/lib/auth/types";

interface AuthResponse {
  authenticated: boolean;
  user: AuthUser | null;
}

interface AuthActionResponse {
  user: AuthUser;
}

export async function fetchCurrentUser(): Promise<AuthResponse> {
  const response = await fetch("/api/auth/me", { credentials: "include" });
  if (!response.ok) {
    throw new Error("Failed to fetch auth state");
  }
  return (await response.json()) as AuthResponse;
}

export async function registerAccount(username: string, password: string): Promise<AuthActionResponse> {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });
  const body = (await response.json()) as { message?: string; user?: AuthUser };
  if (!response.ok || !body.user) {
    throw new Error(body.message || "注册失败");
  }
  return { user: body.user };
}

export async function loginAccount(username: string, password: string): Promise<AuthActionResponse> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });
  const body = (await response.json()) as { message?: string; user?: AuthUser };
  if (!response.ok || !body.user) {
    throw new Error(body.message || "登录失败");
  }
  return { user: body.user };
}

export async function logoutAccount(): Promise<void> {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message || "登出失败");
  }
}
