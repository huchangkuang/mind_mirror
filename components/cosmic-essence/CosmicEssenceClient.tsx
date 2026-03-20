"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { COSMIC_QUESTIONS } from "@/lib/cosmic-essence/questions";
import { COSMIC_RESULTS } from "@/lib/cosmic-essence/results";
import { resolveCosmicResult } from "@/lib/cosmic-essence/score";
import type { CosmicDimension, CosmicResultId } from "@/lib/cosmic-essence/types";
import { getDefaultShareUrlFromPageUrl } from "@/lib/shareQrcode";
import { CosmicStarfield } from "./CosmicStarfield";

type Phase = "intro" | "quiz" | "result";

const PLACEHOLDER_NICK = "星际旅人";
const TOTAL = COSMIC_QUESTIONS.length;

/** 站点启用 HTTPS 并验证保存流程后改为 `true` */
const COSMIC_POSTER_SAVE_ENABLED = false;

function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/i.test(navigator.userAgent);
}

/** 将链接绘入 canvas；widthPx 为输出边长（模块矩阵会按比例缩放）。 */
async function paintPosterQrcodeCanvas(
  canvas: HTMLCanvasElement,
  pageUrl: string,
  widthPx = 96,
): Promise<void> {
  const QRCode = (await import("qrcode")).default;
  const target = getDefaultShareUrlFromPageUrl(pageUrl);
  await new Promise<void>((resolve, reject) => {
    QRCode.toCanvas(
      canvas,
      target,
      {
        width: widthPx,
        margin: 1,
        errorCorrectionLevel: "M",
        color: { dark: "#000000", light: "#ffffff" },
      },
      (err) => {
        if (err) reject(err);
        else resolve();
      },
    );
  });
}

/** html2canvas 常截不到离屏/负坐标下的子 canvas；导出后在位图上叠一张高清码。 */
function compositeQrcodeOnPosterCanvas(
  posterCanvas: HTMLCanvasElement,
  posterEl: HTMLElement,
  qrSlotEl: HTMLElement,
  qrSource: HTMLCanvasElement,
  scale: number,
): void {
  const ctx = posterCanvas.getContext("2d");
  if (!ctx) return;
  const pr = posterEl.getBoundingClientRect();
  const sr = qrSlotEl.getBoundingClientRect();
  if (sr.width < 2 || sr.height < 2) return;
  const x = (sr.left - pr.left) * scale;
  const y = (sr.top - pr.top) * scale;
  const w = sr.width * scale;
  const h = sr.height * scale;
  const padCss = 6;
  const p = padCss * scale;
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x, y, w, h);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  const innerW = Math.max(1, w - 2 * p);
  const innerH = Math.max(1, h - 2 * p);
  ctx.drawImage(qrSource, x + p, y + p, innerW, innerH);
  ctx.restore();
}

export function CosmicEssenceClient() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [nickname, setNickname] = useState("");
  const [answers, setAnswers] = useState<CosmicDimension[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [resultId, setResultId] = useState<CosmicResultId | null>(null);
  const [panelOpacity, setPanelOpacity] = useState(1);
  const [saving, setSaving] = useState(false);
  const [saveHint, setSaveHint] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [posterQrReady, setPosterQrReady] = useState(false);

  const posterHostRef = useRef<HTMLDivElement>(null);
  const posterRef = useRef<HTMLDivElement>(null);
  const posterQrSlotRef = useRef<HTMLDivElement>(null);
  const posterQrCanvasRef = useRef<HTMLCanvasElement>(null);

  const displayName = nickname.trim() || PLACEHOLDER_NICK;
  const result = resultId ? COSMIC_RESULTS[resultId] : null;

  const runFade = useCallback((fn: () => void) => {
    setPanelOpacity(0);
    window.setTimeout(() => {
      fn();
      window.setTimeout(() => setPanelOpacity(1), 20);
    }, 220);
  }, []);

  const startQuiz = () => {
    setAnswers([]);
    setQuestionIndex(0);
    setResultId(null);
    setPhase("quiz");
    setPanelOpacity(1);
  };

  const currentQuestion = COSMIC_QUESTIONS[questionIndex];

  const pickOption = (dimension: CosmicDimension) => {
    const nextAnswers = [...answers, dimension];
    if (questionIndex >= TOTAL - 1) {
      const id = resolveCosmicResult(nextAnswers);
      runFade(() => {
        setAnswers(nextAnswers);
        setResultId(id);
        setPhase("result");
      });
      return;
    }
    runFade(() => {
      setAnswers(nextAnswers);
      setQuestionIndex((i) => i + 1);
    });
  };

  const buildPosterPngCanvas = useCallback(async (): Promise<HTMLCanvasElement | null> => {
    const posterEl = posterRef.current;
    const qrSlotEl = posterQrSlotRef.current;
    const host = posterHostRef.current;
    if (!posterEl || !qrSlotEl || typeof window === "undefined") return null;

    const scale = Math.min(2, window.devicePixelRatio || 2);
    const qrHi = document.createElement("canvas");
    await paintPosterQrcodeCanvas(qrHi, window.location.href, 512);

    if (host) {
      host.style.left = "0px";
      host.style.top = "100vh";
      host.style.zIndex = "2147483646";
    }
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });

    try {
      const html2canvas = (await import("html2canvas")).default;
      const posterCanvas = await html2canvas(posterEl, {
        scale,
        useCORS: true,
        backgroundColor: "#0b1020",
        logging: false,
        onclone(clonedDoc, clonedEl) {
          const node =
            clonedEl instanceof HTMLElement
              ? clonedEl
              : (clonedDoc.querySelector("[data-cosmic-poster]") as HTMLElement | null);
          if (node) {
            node.style.animation = "none";
            node.querySelectorAll(".cosmic-poster-no-anim").forEach((child) => {
              (child as HTMLElement).style.animation = "none";
            });
          }
          clonedDoc.querySelectorAll("[data-cosmic-qr-loading]").forEach((overlay) => {
            (overlay as HTMLElement).style.display = "none";
          });
          clonedDoc.querySelectorAll("[data-cosmic-pill]").forEach((pillEl) => {
            const pill = pillEl as HTMLElement;
            pill.style.display = "inline-table";
            pill.style.height = "36px";
            pill.style.boxSizing = "border-box";
            pill.style.borderCollapse = "separate";
            pill.style.borderSpacing = "0";
            pill.style.overflow = "hidden";
            pill.style.padding = "0";
            const inner = pill.querySelector("span");
            if (inner) {
              const s = inner as HTMLElement;
              s.style.display = "table-cell";
              s.style.verticalAlign = "middle";
              s.style.textAlign = "center";
              s.style.padding = "0 16px";
              s.style.fontSize = "12px";
              s.style.lineHeight = "1.25";
              s.style.whiteSpace = "nowrap";
            }
          });
        },
      });
      compositeQrcodeOnPosterCanvas(posterCanvas, posterEl, qrSlotEl, qrHi, scale);
      return posterCanvas;
    } finally {
      if (host) {
        host.style.left = "";
        host.style.top = "";
        host.style.zIndex = "";
      }
    }
  }, []);

  useEffect(() => {
    if (!COSMIC_POSTER_SAVE_ENABLED) return;
    if (!result || typeof window === "undefined") {
      setPosterQrReady(false);
      return;
    }
    let cancelled = false;
    setPosterQrReady(false);
    const raf = requestAnimationFrame(() => {
      void (async () => {
        const canvas = posterQrCanvasRef.current;
        if (!canvas || cancelled) return;
        try {
          await paintPosterQrcodeCanvas(canvas, window.location.href);
          if (!cancelled) setPosterQrReady(true);
        } catch {
          if (!cancelled) setPosterQrReady(false);
        }
      })();
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [result]);

  const savePoster = async () => {
    if (!COSMIC_POSTER_SAVE_ENABLED || !result || saving) return;
    setSaving(true);
    setSaveHint(null);
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    try {
      const qrCanvas = posterQrCanvasRef.current;
      if (qrCanvas && typeof window !== "undefined") {
        try {
          await paintPosterQrcodeCanvas(qrCanvas, window.location.href);
          setPosterQrReady(true);
        } catch {
          /* 无码时仍尝试导出 */
        }
      }

      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      });

      const canvas = await buildPosterPngCanvas();
      if (!canvas) {
        setSaveHint("生成失败，请稍后重试。");
        return;
      }

      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/png", 0.92),
      );

      if (blob && isIos()) {
        // 避免 <img src="blob:http://..."> 在 HTTP 站点触发「insecure connection」类控制台提示；data: 不经过 blob 协议
        setPreviewUrl(canvas.toDataURL("image/png"));
        setSaveHint("iOS：长按下方图片，选择「存储图像」保存到相册。");
        return;
      }

      if (blob) {
        try {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `宇宙精神原色-${result.name}.png`;
          a.rel = "noopener";
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.setTimeout(() => URL.revokeObjectURL(url), 2000);
          setSaveHint("已开始下载；若未看到文件，请检查浏览器的下载或通知设置。");
          return;
        } catch {
          /* fall through */
        }
      }

      setPreviewUrl(canvas.toDataURL("image/png"));
      setSaveHint("请长按下方图片保存。");
    } catch {
      setSaveHint("导出失败，请重试或截图保存。");
    } finally {
      setSaving(false);
    }
  };

  const posterIsLight = result?.id === "supernova-pearl";

  const posterKeywords = useMemo(
    () => (result ? result.keywords.join(" · ") : ""),
    [result],
  );

  return (
    <>
      <CosmicStarfield />
      <div className="relative z-10 min-h-screen text-slate-100">
        <SiteHeader returnTo="/cosmic-essence" variant="bar" />

        <main className="mx-auto flex max-w-lg flex-col gap-8 px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
          {phase === "intro" && (
            <section className="space-y-6 text-center">
              <p className="text-xs font-medium uppercase tracking-[0.35em] text-sky-300/80">
                2026 Cosmic Essence
              </p>
              <h1 className="font-outfit text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                宇宙精神原色测试
              </h1>
              <p className="text-sm leading-relaxed text-slate-300">
                8 道情境单选题，为你的精神光谱匹配一种宇宙原色。
                {COSMIC_POSTER_SAVE_ENABLED ? " 结果可生成海报分享。" : ""}
              </p>
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-left backdrop-blur-md">
                <label className="text-xs font-medium text-slate-400" htmlFor="cosmic-nick">
                  {COSMIC_POSTER_SAVE_ENABLED ? "昵称（用于海报，可留空）" : "昵称（可留空）"}
                </label>
                <input
                  id="cosmic-nick"
                  type="text"
                  maxLength={24}
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder={PLACEHOLDER_NICK}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none ring-sky-400/40 placeholder:text-slate-500 focus:border-sky-400/50 focus:ring-2"
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={startQuiz}
                  className="rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:brightness-110"
                >
                  开始测试
                </button>
                <Link
                  href="/"
                  className="rounded-full border border-white/15 px-8 py-3 text-center text-sm font-medium text-slate-200 hover:bg-white/5"
                >
                  返回首页
                </Link>
              </div>
            </section>
          )}

          {phase === "quiz" && currentQuestion && (
            <section
              className="space-y-6 transition-opacity duration-300 ease-out"
              style={{ opacity: panelOpacity }}
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>
                  第 {questionIndex + 1} / {TOTAL} 题
                </span>
                <span className="tabular-nums">{Math.round(((questionIndex + 1) / TOTAL) * 100)}%</span>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-400 to-violet-400 transition-all duration-500 ease-out"
                  style={{ width: `${((questionIndex + 1) / TOTAL) * 100}%` }}
                />
              </div>
              <h2 className="font-outfit text-xl font-medium leading-snug text-white sm:text-2xl">
                {currentQuestion.prompt}
              </h2>
              <ul className="flex flex-col gap-3">
                {currentQuestion.options.map((opt) => (
                  <li key={opt.letter}>
                    <button
                      type="button"
                      onClick={() => pickOption(opt.dimension)}
                      className="flex w-full items-start gap-3 rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-4 text-left text-sm text-slate-100 backdrop-blur-md transition hover:border-sky-400/40 hover:bg-slate-900/60"
                    >
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-sky-200">
                        {opt.letter}
                      </span>
                      <span className="leading-relaxed">{opt.text}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {phase === "result" && result && (
            <section
              className="space-y-6 transition-opacity duration-300 ease-out"
              style={{ opacity: panelOpacity }}
            >
              <div
                className="overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/40"
                style={{
                  background: `linear-gradient(145deg, ${result.primaryHex}33 0%, rgba(15,23,42,0.9) 45%, rgba(2,6,23,0.95) 100%)`,
                }}
              >
                <div
                  className="h-28 w-full"
                  style={{
                    background: `linear-gradient(90deg, ${result.primaryHex}, ${result.accentHex})`,
                  }}
                />
                <div className="space-y-4 px-5 py-6">
                  <h2 className="font-outfit text-2xl font-semibold text-white">{result.name}</h2>
                  <p className="text-sm text-sky-200/90">{posterKeywords}</p>
                  <p className="text-sm leading-relaxed text-slate-200">{result.soul}</p>
                  <div className="flex flex-wrap gap-3">
                    <span className="inline-table h-9 rounded-full border border-white/10 bg-black/20 text-xs font-medium text-slate-200">
                      <span className="table-cell h-9 max-h-9 align-middle px-4 leading-[1.25]">
                        {result.rarityLabel}
                      </span>
                    </span>
                    <span className="inline-table h-9 rounded-full border border-white/10 bg-black/20 text-xs font-medium text-slate-200">
                      <span className="table-cell h-9 max-h-9 align-middle px-4 leading-[1.25]">
                        契合：{result.affinityName}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                {COSMIC_POSTER_SAVE_ENABLED && (
                  <button
                    type="button"
                    onClick={savePoster}
                    disabled={saving}
                    className="flex-1 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:opacity-60"
                  >
                    {saving ? "生成中…" : "保存海报"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={startQuiz}
                  className={`rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-slate-100 hover:bg-white/5 ${COSMIC_POSTER_SAVE_ENABLED ? "flex-1" : "w-full"}`}
                >
                  再测一次
                </button>
              </div>
              {COSMIC_POSTER_SAVE_ENABLED && saveHint && (
                <p className="text-center text-xs leading-relaxed text-slate-400">{saveHint}</p>
              )}
              {COSMIC_POSTER_SAVE_ENABLED && previewUrl && (
                <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="海报预览"
                    className="mx-auto max-h-[70vh] w-auto max-w-full rounded-lg"
                  />
                </div>
              )}
            </section>
          )}
        </main>
      </div>

      {COSMIC_POSTER_SAVE_ENABLED && (
      <div
        ref={posterHostRef}
        className="pointer-events-none fixed left-0 top-[100vh] z-[-1] h-[960px] w-[540px] overflow-hidden"
        aria-hidden
      >
        {result && (
          <div
            ref={posterRef}
            data-cosmic-poster
            className="cosmic-poster-no-anim flex flex-col overflow-hidden rounded-3xl"
            style={{
              width: 540,
              height: 960,
              background: "#0b1020",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            <div
              className="cosmic-poster-no-anim h-[280px] w-full shrink-0"
              style={{
                background: `linear-gradient(135deg, ${result.primaryHex}, ${result.accentHex})`,
              }}
            />
            <div
              className={`flex flex-1 flex-col gap-4 px-10 py-10 ${posterIsLight ? "text-slate-900" : "text-white"}`}
              style={{
                background: posterIsLight ? "#f5f5f4" : "#0b1020",
              }}
            >
              <p
                className={`text-xs uppercase tracking-[0.3em] ${posterIsLight ? "text-slate-500" : "text-slate-400"}`}
              >
                Cosmic Essence
              </p>
              <h3
                className="text-[28px] font-bold leading-tight"
                style={{ fontFamily: "Outfit, system-ui, sans-serif" }}
              >
                {result.name}
              </h3>
              <p className={`text-sm ${posterIsLight ? "text-slate-600" : "text-sky-100/90"}`}>
                {posterKeywords}
              </p>
              <p className={`text-[15px] leading-relaxed ${posterIsLight ? "text-slate-700" : "text-slate-100"}`}>
                {result.soul}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <div
                  data-cosmic-pill
                  className={`cosmic-poster-no-anim inline-table rounded-full leading-none ${posterIsLight ? "bg-[#3f3f46] text-white" : "bg-[#2d2d30] text-white"}`}
                  style={{
                    height: 36,
                    borderCollapse: "separate",
                    borderSpacing: 0,
                    fontSize: 12,
                    fontFamily:
                      'system-ui, -apple-system, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
                    boxSizing: "border-box",
                    overflow: "hidden",
                  }}
                >
                  <span className="table-cell align-middle px-4">{result.rarityLabel}</span>
                </div>
                <div
                  data-cosmic-pill
                  className={`cosmic-poster-no-anim inline-table rounded-full leading-none ${posterIsLight ? "bg-[#3f3f46] text-white" : "bg-[#2d2d30] text-white"}`}
                  style={{
                    height: 36,
                    borderCollapse: "separate",
                    borderSpacing: 0,
                    fontSize: 12,
                    fontFamily:
                      'system-ui, -apple-system, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
                    boxSizing: "border-box",
                    overflow: "hidden",
                  }}
                >
                  <span className="table-cell align-middle px-4">契合：{result.affinityName}</span>
                </div>
              </div>
              <div
                className={`mt-auto flex items-end justify-between gap-6 border-t pt-6 ${posterIsLight ? "border-slate-200" : "border-white/10"}`}
              >
                <div>
                  <p className={`text-xs ${posterIsLight ? "text-slate-500" : "text-slate-400"}`}>
                    昵称
                  </p>
                  <p className="text-xl font-semibold">{displayName}</p>
                </div>
                <div
                  ref={posterQrSlotRef}
                  data-cosmic-qr-slot
                  className={`relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 bg-white p-1.5 ${posterIsLight ? "border-slate-200" : "border-white/20"}`}
                >
                  <canvas
                    ref={posterQrCanvasRef}
                    width={96}
                    height={96}
                    className="block h-full w-full max-h-[84px] max-w-[84px]"
                    aria-hidden
                  />
                  {!posterQrReady && (
                    <span
                      data-cosmic-qr-loading
                      className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/90 text-[10px] font-medium text-slate-400"
                    >
                      加载码…
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      )}
    </>
  );
}
