export const THEME_STORAGE_KEY = "mind_mirror_theme_override";

/** 与本地覆盖保存时长一致（12 小时） */
export const THEME_OVERRIDE_TTL_MS = 12 * 60 * 60 * 1000;

export type ThemeMode = "light" | "dark";

export type ThemeOverridePayload = {
  mode: ThemeMode;
  expiresAt: number;
};
