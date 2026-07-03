/**
 * 需要登录后才能访问的路由。新增「仅登录可见」页面时，将路径前缀或精确路径加入列表。
 * 匹配规则：pathname 等于某项，或以 `项 + '/'` 为前缀（子路由一并保护）。
 */
const AUTH_REQUIRED_PREFIXES: string[] = ["/profile"];

function normalizePathname(pathname: string): string {
  const base = pathname.split("?")[0] ?? pathname;
  if (!base || base === "/") return base;
  return base.endsWith("/") && base.length > 1 ? base.slice(0, -1) : base;
}

export function isAuthRequiredPath(pathname: string): boolean {
  const p = normalizePathname(pathname);
  return AUTH_REQUIRED_PREFIXES.some(
    (prefix) => p === prefix || p.startsWith(`${prefix}/`)
  );
}

/** 构建带登录后回跳地址的认证页链接（仅站内 path+search） */
export function authEntryHref(returnPath: string, mode: "login" | "register" = "login"): string {
  const next = encodeURIComponent(returnPath);
  return `/auth?next=${next}&mode=${mode}`;
}

/**
 * 若当前 URL 属于受保护路由，则用整页跳转打开登录页并带上 next（用于登出等需立即离开的场景）。
 */
export function redirectToAuthIfProtectedPath(): void {
  if (typeof window === "undefined") return;
  const returnPath = window.location.pathname + window.location.search;
  if (!isAuthRequiredPath(window.location.pathname)) return;
  window.location.replace(authEntryHref(returnPath, "login"));
}
