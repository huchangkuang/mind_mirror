"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

/** 宣传片视频地址；留空时弹窗内显示占位说明 */
export const ABOUT_PROMO_VIDEO_SRC = "/video/about_us.mp4";

const footerNavLinkClass =
  "inline-flex items-center min-h-11 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 underline-offset-4 decoration-transparent hover:underline hover:decoration-current transition-colors duration-200 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900";

function AboutUsVideoModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const stopVideo = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  }, []);

  const handleClose = useCallback(() => {
    stopVideo();
    onClose();
  }, [onClose, stopVideo]);

  useEffect(() => {
    if (!open) {
      stopVideo();
      return;
    }
    const t = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);
    return () => window.clearTimeout(t);
  }, [open, stopVideo]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, handleClose]);

  if (!open) return null;

  const hasVideoSrc = Boolean(ABOUT_PROMO_VIDEO_SRC.trim());

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="home-about-us-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/70 dark:bg-black/75 backdrop-blur-sm"
        aria-label="关闭对话框"
        onClick={handleClose}
      />
      <div
        className="relative z-10 w-full max-w-3xl rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl p-4 sm:p-6"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2
            id="home-about-us-title"
            className="text-lg font-semibold text-slate-900 dark:text-white"
          >
            关于我们
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={handleClose}
            className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            关闭
          </button>
        </div>
        {hasVideoSrc ? (
          <video
            ref={videoRef}
            className="mt-4 w-full max-h-[min(60vh,480px)] rounded-lg bg-black object-contain"
            controls
            playsInline
            preload="metadata"
            src={ABOUT_PROMO_VIDEO_SRC}
            aria-label="Mind Mirror 宣传视频"
          />
        ) : (
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            宣传视频链接待补充，敬请期待。
          </p>
        )}
      </div>
    </div>
  );
}

export function HomeFooter() {
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <>
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <nav
            className="flex flex-wrap items-center justify-start gap-x-6 gap-y-1 text-left"
            aria-label="页脚"
          >
            <Link href="/feedback" className={footerNavLinkClass}>
              反馈与建议
            </Link>
            <button
              type="button"
              className={`${footerNavLinkClass} cursor-pointer bg-transparent border-0 p-0 font-[inherit]`}
              onClick={() => setAboutOpen(true)}
            >
              关于我们
            </button>
          </nav>
          <p className="text-slate-500 dark:text-slate-400 text-sm text-left sm:text-right shrink-0">
            © 2026 Mind Mirror. 探索真实的自己。
          </p>
        </div>
      </footer>
      <AboutUsVideoModal
        open={aboutOpen}
        onClose={() => setAboutOpen(false)}
      />
    </>
  );
}
