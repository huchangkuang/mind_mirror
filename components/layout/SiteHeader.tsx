"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Switch } from "@/components/ui/Switch";
import { useAuthStore } from "@/stores/auth-store";

const AUTH_NEXT = (path: string) =>
  `/auth?next=${encodeURIComponent(path)}&mode=login`;
const REGISTER_NEXT = (path: string) =>
  `/auth?next=${encodeURIComponent(path)}&mode=register`;

function HeaderThemeSwitch({ isHero }: { isHero: boolean }) {
  const { mode, setMode } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span
        className="inline-block min-h-11 min-w-[3.25rem] shrink-0 rounded-full bg-transparent"
        aria-hidden
      />
    );
  }

  const label = mode === "dark" ? "切换到浅色模式" : "切换到深色模式";

  return (
    <Switch
      variant={isHero ? "hero" : "bar"}
      checked={mode === "dark"}
      onCheckedChange={(on) => setMode(on ? "dark" : "light")}
      aria-label={label}
      className="shrink-0"
    />
  );
}

interface SiteHeaderProps {
  /** 用于登录/注册回跳，例如 `/` 或 `/feedback` */
  returnTo?: string;
  /**
   * `bar`：独立粘性顶栏（反馈页、首页加载/错误态）
   * `hero-overlay`：透明叠在首页渐变 Hero 上，按钮样式对齐原 AuthStatusPanel
   */
  variant?: "bar" | "hero-overlay";
}

export function SiteHeader({ returnTo = "/", variant = "bar" }: SiteHeaderProps) {
  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const isHero = variant === "hero-overlay";

  const headerClass = isHero
    ? "absolute top-0 left-0 right-0 z-20 bg-transparent pointer-events-none"
    : "sticky top-0 z-50 border-b border-white/30 bg-white/40 dark:bg-slate-950/50 backdrop-blur-xl";

  const innerClass = `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3${
    isHero ? " pointer-events-auto" : ""
  }`;

  const brandClass = isHero
    ? "font-outfit font-bold text-white text-lg shrink-0 hover:text-white/90 transition-colors drop-shadow-sm"
    : "font-outfit font-bold text-slate-900 dark:text-white text-lg shrink-0 hover:opacity-80 transition-opacity";

  const feedbackDesktopClass = isHero
    ? "hidden sm:inline text-sm font-medium text-white/90 hover:text-white transition-colors truncate drop-shadow-sm"
    : "hidden sm:inline text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate";

  const feedbackMobileClass = isHero
    ? "sm:hidden text-sm font-medium text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-colors"
    : "sm:hidden text-sm font-medium text-slate-700 dark:text-slate-200 px-2 py-1 rounded-full hover:bg-white/40 dark:hover:bg-white/10";

  const pillHero = "text-sm font-medium text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-colors";
  const pillBar =
    "text-sm font-medium text-slate-800 dark:text-white bg-white/50 dark:bg-white/15 hover:bg-white/70 dark:hover:bg-white/25 px-3 py-1.5 rounded-full border border-white/40 dark:border-white/10 transition-colors";

  return (
    <header className={headerClass}>
      <div className={innerClass}>
        <div className="flex items-center gap-4 min-w-0">
          <Link href="/" className={brandClass}>
            Mind Mirror
          </Link>
          <Link href="/feedback" className={feedbackDesktopClass}>
            反馈与建议
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link href="/feedback" className={feedbackMobileClass}>
            反馈
          </Link>

          <HeaderThemeSwitch isHero={isHero} />

          {status === "loading" && (
            <span
              className={
                isHero
                  ? "text-sm text-white/80 bg-black/20 px-3 py-1.5 rounded-full"
                  : "text-xs text-slate-500 dark:text-slate-400 px-2"
              }
            >
              {isHero ? "登录状态加载中…" : "加载中…"}
            </span>
          )}

          {status === "guest" && (
            <>
              <Link href={AUTH_NEXT(returnTo)} className={isHero ? pillHero : pillBar}>
                登录
              </Link>
              <Link href={REGISTER_NEXT(returnTo)} className={isHero ? pillHero : pillBar}>
                注册
              </Link>
            </>
          )}

          {status === "authenticated" && user && (
            <>
              <Link
                href="/profile"
                className={
                  isHero
                    ? "hidden sm:inline max-w-[10rem] md:max-w-[14rem] truncate text-sm text-white bg-black/20 px-3 py-1.5 rounded-full hover:bg-black/30 transition-colors"
                    : "hidden sm:inline max-w-[10rem] md:max-w-[14rem] truncate text-sm text-slate-700 dark:text-slate-200 px-2 py-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
                }
              >
                已登录：{user.nickname}
              </Link>
              <Link
                href="/profile"
                className={
                  isHero
                    ? "sm:hidden max-w-[6rem] truncate text-sm text-white bg-black/20 px-3 py-1.5 rounded-full hover:bg-black/30 transition-colors"
                    : "hidden"
                }
              >
                {user.nickname}
              </Link>
              <button
                type="button"
                onClick={() => logout().catch(() => {})}
                className={isHero ? pillHero : pillBar}
              >
                退出
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
