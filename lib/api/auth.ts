import type { AuthUser } from "@/lib/auth/types";
import {
  ApiRequestError,
  apiFetch,
  apiFetchJson,
  getApiErrorMessage,
  readJsonBody,
  stopAuthRefreshSchedule,
  syncAuthRefreshSchedule,
} from "@/lib/api/client";
import { clearAuthTokens, getAccessToken, getRefreshToken, writeAuthTokens } from "@/lib/api/token-store";

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
  // 未登录（本地无 access/refresh）时，不请求受保护接口，直接返回 guest。
  if (!getAccessToken() && !getRefreshToken()) {
    return {
      authenticated: false,
      user: null,
      isFeedbackModerator: false,
    };
  }

  const data = await apiFetchJson<{
    authenticated?: boolean;
    user?: AuthUser | null;
    isFeedbackModerator?: boolean;
  }>("/api/auth/me", { signal, fallbackErrorMessage: "Failed to fetch auth state" });
  return {
    authenticated: Boolean(data.authenticated),
    user: data.user ?? null,
    isFeedbackModerator: Boolean(data.isFeedbackModerator),
  };
}

export async function registerAccount(username: string, password: string): Promise<AuthActionResponse> {
  const body = await apiFetchJson<{
    accessToken?: string;
    refreshToken?: string;
  }>("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!body.accessToken || !body.refreshToken) {
    throw new Error("注册失败");
  }
  writeAuthTokens({
    accessToken: body.accessToken,
    refreshToken: body.refreshToken,
  });
  syncAuthRefreshSchedule();
  const me = await fetchCurrentUser();
  if (!me.user) {
    throw new Error("注册后用户信息获取失败");
  }
  return { user: me.user, isFeedbackModerator: Boolean(me.isFeedbackModerator) };
}

export async function loginAccount(username: string, password: string): Promise<AuthActionResponse> {
  const body = await apiFetchJson<{
    accessToken?: string;
    refreshToken?: string;
  }>("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!body.accessToken || !body.refreshToken) {
    throw new Error("登录失败");
  }
  writeAuthTokens({
    accessToken: body.accessToken,
    refreshToken: body.refreshToken,
  });
  syncAuthRefreshSchedule();
  const me = await fetchCurrentUser();
  if (!me.user) {
    throw new Error("登录后用户信息获取失败");
  }
  return { user: me.user, isFeedbackModerator: Boolean(me.isFeedbackModerator) };
}

export async function logoutAccount(): Promise<void> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearAuthTokens();
    stopAuthRefreshSchedule();
    return;
  }
  const response = await apiFetch("/api/auth/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
    skipAuthRetry: true,
  });
  if (!response.ok) {
    const body = await readJsonBody(response);
    throw new Error(getApiErrorMessage(body, "登出失败"));
  }
  clearAuthTokens();
  stopAuthRefreshSchedule();
}

export async function updateNickname(nickname: string): Promise<AuthUser> {
  const body = await apiFetchJson<{ user?: AuthUser }>("/api/auth/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nickname }),
  });
  if (!body.user) {
    throw new Error("更新昵称失败");
  }
  return body.user;
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  try {
    await apiFetchJson("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  } catch (error) {
    if (error instanceof ApiRequestError) {
      throw new Error(error.message || "修改密码失败");
    }
    throw error;
  }
}
