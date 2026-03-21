import type { AuthUser } from "@/lib/auth/types";

interface AuthResponse {
  authenticated: boolean;
  user: AuthUser | null;
  isFeedbackModerator: boolean;
}

interface AuthActionResponse {
  user: AuthUser;
  isFeedbackModerator: boolean;
}

export async function fetchCurrentUser(signal?: AbortSignal): Promise<AuthResponse> {
  const response = await fetch("/api/auth/me", { credentials: "include", signal });
  if (!response.ok) {
    throw new Error("Failed to fetch auth state");
  }
  const data = (await response.json()) as {
    authenticated?: boolean;
    user?: AuthUser | null;
    isFeedbackModerator?: boolean;
  };
  return {
    authenticated: Boolean(data.authenticated),
    user: data.user ?? null,
    isFeedbackModerator: Boolean(data.isFeedbackModerator),
  };
}

export async function registerAccount(username: string, password: string): Promise<AuthActionResponse> {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });
  const body = (await response.json()) as {
    message?: string;
    user?: AuthUser;
    isFeedbackModerator?: boolean;
  };
  if (!response.ok || !body.user) {
    throw new Error(body.message || "注册失败");
  }
  return { user: body.user, isFeedbackModerator: Boolean(body.isFeedbackModerator) };
}

export async function loginAccount(username: string, password: string): Promise<AuthActionResponse> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });
  const body = (await response.json()) as {
    message?: string;
    user?: AuthUser;
    isFeedbackModerator?: boolean;
  };
  if (!response.ok || !body.user) {
    throw new Error(body.message || "登录失败");
  }
  return { user: body.user, isFeedbackModerator: Boolean(body.isFeedbackModerator) };
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

export async function updateNickname(nickname: string): Promise<AuthUser> {
  const response = await fetch("/api/auth/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ nickname }),
  });
  const body = (await response.json()) as { message?: string; user?: AuthUser };
  if (!response.ok || !body.user) {
    throw new Error(body.message || "更新昵称失败");
  }
  return body.user;
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  const response = await fetch("/api/auth/change-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  const body = (await response.json().catch(() => ({}))) as { message?: string };
  if (!response.ok) {
    throw new Error(body.message || "修改密码失败");
  }
}
