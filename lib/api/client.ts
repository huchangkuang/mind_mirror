import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  writeAuthTokens,
} from "@/lib/api/token-store";
import { redirectToAuthIfProtectedPath } from "@/lib/auth/protected-routes";

const DEFAULT_API_BASE_URL = "http://localhost:3001";
const DEFAULT_TIMEOUT_MS = 10000;
const API_VERSION_PREFIX = "/api/v1";
const DEFAULT_REFRESH_SKEW_MS = 120_000;

export class ApiRequestError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.code = code;
  }
}

interface EnvelopePayload<T> {
  code?: string;
  message?: string;
  data?: T;
}

let refreshPromise: Promise<string | null> | null = null;
let proactiveRefreshTimer: ReturnType<typeof setTimeout> | null = null;

function getApiBaseUrl(): string {
  const envBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  const rawBaseUrl = envBaseUrl || DEFAULT_API_BASE_URL;
  return rawBaseUrl.endsWith("/") ? rawBaseUrl.slice(0, -1) : rawBaseUrl;
}

function getTimeoutMs(input?: number): number {
  if (typeof input === "number" && Number.isFinite(input) && input > 0) {
    return input;
  }
  const envValue = Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS);
  if (Number.isFinite(envValue) && envValue > 0) {
    return envValue;
  }
  return DEFAULT_TIMEOUT_MS;
}

function getRefreshSkewMs(): number {
  const envValue = Number(process.env.NEXT_PUBLIC_AUTH_REFRESH_SKEW_MS);
  if (Number.isFinite(envValue) && envValue > 0) {
    return envValue;
  }
  return DEFAULT_REFRESH_SKEW_MS;
}

export function buildApiUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const resolvedPath = resolveApiPath(normalizedPath);
  return `${getApiBaseUrl()}${resolvedPath}`;
}

export function getApiErrorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") {
    return fallback;
  }
  const record = payload as Record<string, unknown>;
  if (typeof record.message === "string" && record.message.trim()) {
    return record.message;
  }
  if (typeof record.error === "string" && record.error.trim()) {
    return record.error;
  }
  return fallback;
}

function getApiErrorCode(payload: unknown): string | undefined {
  if (!payload || typeof payload !== "object") {
    return undefined;
  }
  const record = payload as Record<string, unknown>;
  if (typeof record.errorCode === "string" && record.errorCode.trim()) {
    return record.errorCode;
  }
  if (typeof record.code === "string" && record.code.trim()) {
    return record.code;
  }
  return undefined;
}

function isEnvelopePayload(payload: unknown): payload is EnvelopePayload<unknown> {
  return Boolean(
    payload &&
    typeof payload === "object" &&
    ("code" in payload || "data" in payload || "message" in payload)
  );
}

function unwrapPayload<T>(payload: unknown): T | null {
  if (isEnvelopePayload(payload)) {
    return ((payload.data ?? null) as T | null) ?? null;
  }
  return (payload as T | null) ?? null;
}

function resolveApiPath(path: string): string {
  const [pathname, query = ""] = path.split("?");
  if (pathname.startsWith("/api/history")) {
    const params = new URLSearchParams(query);
    const recordId = params.get("id");
    if (recordId) {
      return `${API_VERSION_PREFIX}/tests/history/${recordId}`;
    }
    const testId = params.get("test_id");
    if (testId) {
      return `${API_VERSION_PREFIX}/tests/history?test_id=${encodeURIComponent(testId)}`;
    }
    return `${API_VERSION_PREFIX}/tests/history`;
  }

  if (pathname.startsWith("/api/tests/history")) {
    return pathname.replace(/^\/api\/tests\/history/, `${API_VERSION_PREFIX}/tests/history`) + (query ? `?${query}` : "");
  }

  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/v")) {
    const suffix = pathname.slice("/api".length);
    return `${API_VERSION_PREFIX}${suffix}${query ? `?${query}` : ""}`;
  }

  return query ? `${pathname}?${query}` : pathname;
}

function decodeJwtExpMs(token: string | null): number | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const atobFn =
      typeof window !== "undefined" && typeof window.atob === "function"
        ? window.atob.bind(window)
        : typeof globalThis.atob === "function"
          ? globalThis.atob.bind(globalThis)
          : null;
    if (!atobFn) return null;
    const payload = atobFn(padded);
    const parsed = JSON.parse(payload) as { exp?: number };
    if (!parsed.exp || !Number.isFinite(parsed.exp)) return null;
    return parsed.exp * 1000;
  } catch {
    return null;
  }
}

function notifyAuthExpired(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("mindmirror:auth-expired"));
  }
}

function clearProactiveRefreshTimer(): void {
  if (proactiveRefreshTimer) {
    clearTimeout(proactiveRefreshTimer);
    proactiveRefreshTimer = null;
  }
}

function handleRefreshFailure(): void {
  clearAuthTokens();
  clearProactiveRefreshTimer();
  notifyAuthExpired();
  redirectToAuthIfProtectedPath();
}

function scheduleProactiveRefresh(accessToken: string | null): void {
  clearProactiveRefreshTimer();
  const expAtMs = decodeJwtExpMs(accessToken);
  if (!expAtMs) return;

  const triggerIn = Math.max(0, expAtMs - Date.now() - getRefreshSkewMs());
  proactiveRefreshTimer = setTimeout(() => {
    void attemptRefreshToken();
  }, triggerIn);
}

export function syncAuthRefreshSchedule(): void {
  scheduleProactiveRefresh(getAccessToken());
}

export function stopAuthRefreshSchedule(): void {
  clearProactiveRefreshTimer();
}

async function attemptRefreshToken(): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    handleRefreshFailure();
    return null;
  }

  refreshPromise = (async () => {
    try {
      const response = await fetch(buildApiUrl("/api/auth/refresh"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      const payload = (await response.json().catch(() => null)) as EnvelopePayload<{
        accessToken?: string;
        refreshToken?: string;
      }> | null;
      if (!response.ok || !payload?.data?.accessToken || !payload.data.refreshToken) {
        handleRefreshFailure();
        return null;
      }
      writeAuthTokens({
        accessToken: payload.data.accessToken,
        refreshToken: payload.data.refreshToken,
      });
      scheduleProactiveRefresh(payload.data.accessToken);
      return payload.data.accessToken;
    } catch {
      handleRefreshFailure();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

function shouldAttemptRefresh(path: string): boolean {
  return !path.includes("/api/auth/login")
    && !path.includes("/api/auth/register")
    && !path.includes("/api/auth/refresh");
}

function withAuthHeader(headers: Headers, token: string | null): Headers {
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
}

export async function readJsonBody<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function apiFetch(
  path: string,
  init: RequestInit & { timeoutMs?: number; skipAuthRetry?: boolean } = {}
): Promise<Response> {
  const { timeoutMs, signal, credentials, skipAuthRetry, ...rest } = init;
  const currentAccessToken = getAccessToken();
  if (currentAccessToken) {
    scheduleProactiveRefresh(currentAccessToken);
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort("timeout"), getTimeoutMs(timeoutMs));
  const headers = withAuthHeader(new Headers(rest.headers ?? {}), currentAccessToken);

  const abortHandler = () => controller.abort(signal?.reason);
  if (signal) {
    signal.addEventListener("abort", abortHandler, { once: true });
  }

  try {
    const response = await fetch(buildApiUrl(path), {
      ...rest,
      headers,
      signal: controller.signal,
      credentials: credentials ?? "include",
    });
    if (
      response.status === 401 &&
      !skipAuthRetry &&
      shouldAttemptRefresh(path)
    ) {
      const nextAccessToken = await attemptRefreshToken();
      if (nextAccessToken) {
        const retryHeaders = withAuthHeader(new Headers(rest.headers ?? {}), nextAccessToken);
        const retryResponse = await fetch(buildApiUrl(path), {
          ...rest,
          headers: retryHeaders,
          signal: controller.signal,
          credentials: credentials ?? "include",
        });
        if (retryResponse.status === 401) {
          handleRefreshFailure();
        }
        return retryResponse;
      }
      handleRefreshFailure();
    }
    return response;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      if (signal?.aborted) {
        throw error;
      }
      throw new ApiRequestError("请求超时，请稍后重试", 408, "REQUEST_TIMEOUT");
    }
    throw new ApiRequestError("网络连接失败，请检查后端服务是否可用", 503, "NETWORK_ERROR");
  } finally {
    clearTimeout(timeout);
    if (signal) {
      signal.removeEventListener("abort", abortHandler);
    }
  }
}

export async function apiFetchJson<T>(
  path: string,
  init: RequestInit & { timeoutMs?: number; fallbackErrorMessage?: string } = {}
): Promise<T> {
  const { fallbackErrorMessage = "请求失败", ...rest } = init;
  const response = await apiFetch(path, rest);
  const rawBody = await readJsonBody<EnvelopePayload<T> & Record<string, unknown>>(response);
  if (!response.ok) {
    throw new ApiRequestError(
      getApiErrorMessage(rawBody, fallbackErrorMessage),
      response.status,
      getApiErrorCode(rawBody)
    );
  }
  const body = unwrapPayload<T>(rawBody);
  return (body ?? ({} as T)) as T;
}
