"use client";

import { Moon, Sun } from "lucide-react";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  /** 顶栏 bar 或 Hero 叠层上的对比样式 */
  variant?: "bar" | "hero";
  "aria-label"?: string;
}

export function Switch({
  checked,
  onCheckedChange,
  disabled,
  className = "",
  variant = "bar",
  "aria-label": ariaLabel = "切换浅色或深色主题",
}: SwitchProps) {
  const isHero = variant === "hero";

  const trackHero = checked
    ? "border-white/60 bg-white/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.12)]"
    : "border-white/50 bg-white/18 shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]";
  const trackHeroHover = !disabled && !checked ? "group-hover:border-white/60 group-hover:bg-white/26" : "";
  const trackHeroHoverOn = !disabled && checked ? "group-hover:bg-white/48" : "";

  const trackBar = checked
    ? "border-blue-600/90 bg-gradient-to-b from-blue-500 to-blue-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_2px_rgba(37,99,235,0.35)] dark:from-blue-500 dark:to-blue-700 dark:border-blue-500/90 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_1px_2px_rgba(0,0,0,0.2)]"
    : "border-slate-300/95 bg-gradient-to-b from-slate-100 to-slate-200/95 shadow-[inset_0_1px_2px_rgba(255,255,255,0.85),0_1px_1px_rgba(15,23,42,0.06)] dark:from-slate-600 dark:to-slate-700 dark:border-slate-500/80 dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]";
  const trackBarHover =
    !disabled && !checked
      ? "group-hover:border-slate-400 group-hover:from-slate-50 group-hover:to-slate-200 dark:group-hover:border-slate-400 dark:group-hover:from-slate-500 dark:group-hover:to-slate-600"
      : "";
  const trackBarHoverOn =
    !disabled && checked
      ? "group-hover:from-blue-500 group-hover:to-blue-600 dark:group-hover:from-blue-400 dark:group-hover:to-blue-600"
      : "";

  const focusRing = isHero
    ? "focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none"
    : "focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-900 focus-visible:outline-none";

  const thumbBase =
    "pointer-events-none absolute left-[3px] top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_1px_2px_rgba(15,23,42,0.12),0_0_0_1px_rgba(15,23,42,0.06)] transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.34,1.3,0.64,1)] motion-reduce:duration-75 motion-reduce:ease-linear";
  const thumbOn = checked
    ? "translate-x-4 shadow-[0_2px_4px_rgba(15,23,42,0.14),0_0_0_1px_rgba(255,255,255,0.35)]"
    : "translate-x-0";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => {
        if (!disabled) onCheckedChange(!checked);
      }}
      className={[
        "group relative inline-flex min-h-11 min-w-[3.25rem] shrink-0 cursor-pointer items-center justify-center rounded-full touch-manipulation",
        "motion-safe:active:scale-[0.96] motion-reduce:active:scale-100 transition-transform duration-150 ease-out",
        focusRing,
        disabled ? "cursor-not-allowed opacity-45" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        aria-hidden
        className={[
          "relative h-7 w-[2.75rem] shrink-0 rounded-full border p-[3px] transition-[border-color,background-color,box-shadow] duration-200 ease-out",
          isHero ? [trackHero, trackHeroHover, trackHeroHoverOn].filter(Boolean).join(" ") : "",
          !isHero ? [trackBar, trackBarHover, trackBarHoverOn].filter(Boolean).join(" ") : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <span className={[thumbBase, thumbOn].join(" ")}>
          {checked ? (
            <Moon className="h-3.5 w-3.5 text-indigo-600" strokeWidth={2.25} aria-hidden />
          ) : (
            <Sun className="h-3.5 w-3.5 text-amber-500" strokeWidth={2.25} aria-hidden />
          )}
        </span>
      </span>
    </button>
  );
}
