"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Switch } from "@/components/ui/Switch";
import { useAuthStore } from "@/stores/auth-store";

const AUTH_NEXT = (path: string) =>
  `/auth?next=${encodeURIComponent(path)}&mode=login`;
const REGISTER_NEXT = (path: string) =>
  `/auth?next=${encodeURIComponent(path)}&mode=register`;

/** 约 72px 内从透明过渡到 bar 同等不透明度 */
const SCROLL_SURFACE_RANGE_PX = 72;
/** 低于该进度使用 Hero 系前景色，以上切换为 bar 系 */
const SCROLL_SURFACE_HERO_BLEND = 0.42;

function HeaderThemeSwitch({ isHero }: { isHero: boolean }) {
  const { mode, setMode } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span
        className="box-border inline-block h-11 w-[3.25rem] shrink-0 rounded-full bg-transparent"
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
   * `scroll-surface`：首屏透明叠在 Hero 上，随滚动过渡到与 `bar` 一致的亮/暗主题表面（`fixed` 顶栏）
   */
  variant?: "bar" | "hero-overlay" | "scroll-surface";
}

export function SiteHeader({
  returnTo = "/",
  variant = "bar",
}: SiteHeaderProps) {
  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { mode } = useTheme();

  const [scrollT, setScrollT] = useState(0);
  const rafRef = useRef<number | null>(null);

  const isScrollSurface = variant === "scroll-surface";
  const isHeroOverlay = variant === "hero-overlay";
  const isHero =
    isHeroOverlay || (isScrollSurface && scrollT < SCROLL_SURFACE_HERO_BLEND);

  useEffect(() => {
    if (!isScrollSurface || typeof window === "undefined") return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const computeT = () => {
      const y = window.scrollY;
      if (reducedMotion.matches) {
        return y > 12 ? 1 : 0;
      }
      return Math.min(1, y / SCROLL_SURFACE_RANGE_PX);
    };

    const flush = () => {
      rafRef.current = null;
      setScrollT(computeT());
    };

    const onScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = window.requestAnimationFrame(flush);
    };

    flush();
    window.addEventListener("scroll", onScroll, { passive: true });

    const onReduceChange = () => {
      setScrollT(computeT());
    };
    reducedMotion.addEventListener("change", onReduceChange);

    return () => {
      window.removeEventListener("scroll", onScroll);
      reducedMotion.removeEventListener("change", onReduceChange);
      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isScrollSurface]);

  const lightBg = `rgba(255, 255, 255, ${0.4 * scrollT})`;
  const darkBg = `rgba(2, 6, 23, ${0.5 * scrollT})`;
  const lightBorder = `1px solid rgba(255, 255, 255, ${0.3 * scrollT})`;
  const darkBorder = `1px solid rgba(255, 255, 255, ${0.12 * scrollT})`;
  const blurPx = 12 * scrollT;

  const scrollSurfaceStyle: CSSProperties | undefined = isScrollSurface
    ? {
        backgroundColor: mode === "dark" ? darkBg : lightBg,
        backdropFilter: blurPx > 0 ? `blur(${blurPx}px)` : "none",
        WebkitBackdropFilter: blurPx > 0 ? `blur(${blurPx}px)` : "none",
        borderBottom: mode === "dark" ? darkBorder : lightBorder,
      }
    : undefined;

  const headerClass = isScrollSurface
    ? "fixed top-0 left-0 right-0 z-50 pointer-events-none"
    : isHeroOverlay
      ? "absolute top-0 left-0 right-0 z-20 bg-transparent pointer-events-none"
      : "sticky top-0 z-50 border-b border-white/30 bg-white/40 dark:bg-slate-950/50 backdrop-blur-xl";

  const innerClass = `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3${
    isHeroOverlay || isScrollSurface ? " pointer-events-auto" : ""
  }`;

  const brandClass = isHero
    ? "font-outfit font-bold text-white text-lg shrink-0 hover:text-white/90 transition-colors drop-shadow-sm"
    : "font-outfit font-bold text-slate-900 dark:text-white text-lg shrink-0 hover:opacity-80 transition-opacity";

  const feedbackDesktopClass = isHero
    ? "hidden sm:inline text-sm font-medium text-white/90 hover:text-white transition-colors truncate drop-shadow-sm"
    : "hidden sm:inline text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate";

  /** 与 bar 态同宽高的 1px 透明描边，避免滚动切换时因边框出现/消失产生 CLS */
  const navPillBase =
    "inline-flex items-center justify-center min-h-9 box-border text-sm font-medium px-3 py-1.5 rounded-full border transition-colors touch-manipulation";

  const feedbackMobileClass = isHero
    ? `${navPillBase} sm:hidden border-transparent text-white bg-white/20 hover:bg-white/30`
    : `${navPillBase} sm:hidden border-slate-200/70 dark:border-white/15 text-slate-700 dark:text-slate-200 bg-white/45 dark:bg-white/10 hover:bg-white/65 dark:hover:bg-white/18`;

  const pillHero = `${navPillBase} border-transparent text-white bg-white/20 hover:bg-white/30`;
  const pillBar = `${navPillBase} border-white/40 dark:border-white/10 text-slate-800 dark:text-white bg-white/50 dark:bg-white/15 hover:bg-white/70 dark:hover:bg-white/25`;

  const profileDesktopBase =
    "hidden sm:inline-flex items-center max-w-[10rem] md:max-w-[14rem] truncate min-h-9 box-border text-sm px-3 py-1.5 rounded-full border transition-colors touch-manipulation";
  const profileDesktopHero = `${profileDesktopBase} border-transparent text-white bg-black/20 hover:bg-black/30`;
  const profileDesktopBar = `${profileDesktopBase} border-slate-200/80 dark:border-white/15 text-slate-700 dark:text-slate-200 bg-transparent hover:bg-white/50 dark:hover:bg-white/10`;

  const profileMobileHero =
    "sm:hidden inline-flex items-center justify-center max-w-[6rem] truncate min-h-9 box-border text-sm px-3 py-1.5 rounded-full border border-transparent text-white bg-black/20 hover:bg-black/30 transition-colors touch-manipulation";

  return (
    <header className={headerClass} style={scrollSurfaceStyle}>
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
                  ? "inline-flex items-center min-h-9 box-border text-sm text-white/80 bg-black/20 px-3 py-1.5 rounded-full border border-transparent"
                  : "inline-flex items-center min-h-9 box-border text-xs text-slate-500 dark:text-slate-400 bg-slate-100/90 dark:bg-white/10 px-3 py-1.5 rounded-full border border-slate-200/80 dark:border-white/15"
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
              <Link href="/profile" className={isHero ? profileDesktopHero : profileDesktopBar}>
                已登录：{user.nickname}
              </Link>
              <Link href="/profile" className={isHero ? profileMobileHero : "hidden"}>
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
