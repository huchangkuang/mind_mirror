const STORAGE_KEY = "mind_mirror_auth_tokens";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

let memoryTokens: AuthTokens | null = null;

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readAuthTokens(): AuthTokens | null {
  if (canUseStorage()) {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as Partial<AuthTokens>;
      if (!parsed.accessToken || !parsed.refreshToken) return null;
      return {
        accessToken: parsed.accessToken,
        refreshToken: parsed.refreshToken,
      };
    } catch {
      return null;
    }
  }
  return memoryTokens;
}

export function writeAuthTokens(tokens: AuthTokens): void {
  memoryTokens = tokens;
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
}

export function clearAuthTokens(): void {
  memoryTokens = null;
  if (!canUseStorage()) return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function getAccessToken(): string | null {
  return readAuthTokens()?.accessToken ?? null;
}

export function getRefreshToken(): string | null {
  return readAuthTokens()?.refreshToken ?? null;
}
