import {
  THEME_OVERRIDE_TTL_MS,
  THEME_STORAGE_KEY,
  type ThemeMode,
  type ThemeOverridePayload,
} from "./constants";

function isThemeMode(v: unknown): v is ThemeMode {
  return v === "light" || v === "dark";
}

/** 读取未过期覆盖；过期或非法则移除并返回 null */
export function readValidOverride(): ThemeOverridePayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw) as unknown;
    if (!o || typeof o !== "object") return null;
    const rec = o as Record<string, unknown>;
    const expiresAt = rec.expiresAt;
    const mode = rec.mode;
    if (typeof expiresAt !== "number" || !isThemeMode(mode)) {
      localStorage.removeItem(THEME_STORAGE_KEY);
      return null;
    }
    if (Date.now() > expiresAt) {
      localStorage.removeItem(THEME_STORAGE_KEY);
      return null;
    }
    return { mode, expiresAt };
  } catch {
    try {
      localStorage.removeItem(THEME_STORAGE_KEY);
    } catch {
      /* ignore */
    }
    return null;
  }
}

export function getSystemMode(): ThemeMode {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function resolveEffectiveMode(
  override: ThemeOverridePayload | null,
  system: ThemeMode,
): ThemeMode {
  if (override && Date.now() <= override.expiresAt) return override.mode;
  return system;
}

export function persistUserThemeChoice(mode: ThemeMode, system: ThemeMode): void {
  if (typeof window === "undefined") return;
  try {
    if (mode === system) {
      localStorage.removeItem(THEME_STORAGE_KEY);
      return;
    }
    const payload: ThemeOverridePayload = {
      mode,
      expiresAt: Date.now() + THEME_OVERRIDE_TTL_MS,
    };
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* private mode / quota */
  }
}

export function applyThemeClass(mode: ThemeMode): void {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", mode === "dark");
}
