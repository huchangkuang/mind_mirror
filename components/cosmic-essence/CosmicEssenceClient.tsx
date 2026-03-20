"use client";

import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { COSMIC_QUESTIONS } from "@/lib/cosmic-essence/questions";
import { COSMIC_RESULTS } from "@/lib/cosmic-essence/results";
import { resolveCosmicResult } from "@/lib/cosmic-essence/score";
import type { CosmicDimension, CosmicResultId } from "@/lib/cosmic-essence/types";
import { CosmicStarfield } from "./CosmicStarfield";

type Phase = "intro" | "quiz" | "result";

const PLACEHOLDER_NICK = "星际旅人";
const TOTAL = COSMIC_QUESTIONS.length;

function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/i.test(navigator.userAgent);
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

  const posterRef = useRef<HTMLDivElement>(null);

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

  const capturePoster = useCallback(async () => {
    const el = posterRef.current;
    if (!el) return null;
    const html2canvas = (await import("html2canvas")).default;
    const scale = Math.min(2, typeof window !== "undefined" ? window.devicePixelRatio || 2 : 2);
    return html2canvas(el, {
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
        clonedDoc.querySelectorAll("[data-cosmic-pill]").forEach((el) => {
          const pill = el as HTMLElement;
          pill.style.display = "inline-flex";
          pill.style.alignItems = "center";
          pill.style.justifyContent = "center";
          pill.style.boxSizing = "border-box";
          pill.style.minHeight = "36px";
          pill.style.paddingTop = "8px";
          pill.style.paddingBottom = "8px";
          pill.style.paddingLeft = "16px";
          pill.style.paddingRight = "16px";
          pill.style.lineHeight = "16px";
          pill.style.fontSize = "12px";
        });
      },
    });
  }, []);

  const savePoster = async () => {
    if (!result || saving) return;
    setSaving(true);
    setSaveHint(null);
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    try {
      const canvas = await capturePoster();
      if (!canvas) {
        setSaveHint("生成失败，请稍后重试。");
        return;
      }

      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/png", 0.92),
      );

      if (blob && typeof navigator.share === "function" && typeof navigator.canShare === "function") {
        const file = new File([blob], `宇宙精神原色-${result.name}.png`, {
          type: "image/png",
        });
        if (navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: "宇宙精神原色",
              text: `${displayName} · ${result.name}`,
            });
            setSaveHint("已通过系统分享发出。");
            return;
          } catch (e) {
            if ((e as Error).name === "AbortError") {
              return;
            }
          }
        }
      }

      if (blob && isIos()) {
        setPreviewUrl(URL.createObjectURL(blob));
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
                8 道情境单选题，为你的精神光谱匹配一种宇宙原色。结果可生成海报分享。
              </p>
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-left backdrop-blur-md">
                <label className="text-xs font-medium text-slate-400" htmlFor="cosmic-nick">
                  昵称（用于海报，可留空）
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
                    <span className="inline-flex min-h-9 items-center justify-center rounded-full border border-white/10 bg-black/20 px-4 text-xs font-medium leading-none text-slate-200">
                      {result.rarityLabel}
                    </span>
                    <span className="inline-flex min-h-9 items-center justify-center rounded-full border border-white/10 bg-black/20 px-4 text-xs font-medium leading-none text-slate-200">
                      契合：{result.affinityName}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={savePoster}
                  disabled={saving}
                  className="flex-1 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:opacity-60"
                >
                  {saving ? "生成中…" : "保存海报"}
                </button>
                <button
                  type="button"
                  onClick={startQuiz}
                  className="flex-1 rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-slate-100 hover:bg-white/5"
                >
                  再测一次
                </button>
              </div>
              {saveHint && (
                <p className="text-center text-xs leading-relaxed text-slate-400">{saveHint}</p>
              )}
              {previewUrl && (
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

      {/* 离屏海报：供 html2canvas 渲染 */}
      <div
        className="pointer-events-none fixed left-[-10000px] top-0 z-[-1] h-[960px] w-[540px] overflow-hidden"
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
                  className={`cosmic-poster-no-anim inline-flex items-center justify-center rounded-full leading-none ${posterIsLight ? "bg-[#3f3f46] text-white" : "bg-[#2d2d30] text-white"}`}
                  style={{
                    minHeight: 36,
                    paddingLeft: 16,
                    paddingRight: 16,
                    paddingTop: 8,
                    paddingBottom: 8,
                    fontSize: 12,
                    lineHeight: "16px",
                    fontFamily:
                      'system-ui, -apple-system, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
                    boxSizing: "border-box",
                  }}
                >
                  {result.rarityLabel}
                </div>
                <div
                  data-cosmic-pill
                  className={`cosmic-poster-no-anim inline-flex items-center justify-center rounded-full leading-none ${posterIsLight ? "bg-[#3f3f46] text-white" : "bg-[#2d2d30] text-white"}`}
                  style={{
                    minHeight: 36,
                    paddingLeft: 16,
                    paddingRight: 16,
                    paddingTop: 8,
                    paddingBottom: 8,
                    fontSize: 12,
                    lineHeight: "16px",
                    fontFamily:
                      'system-ui, -apple-system, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
                    boxSizing: "border-box",
                  }}
                >
                  契合：{result.affinityName}
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
                  className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-xl border-2 border-dashed ${posterIsLight ? "border-slate-300 bg-white text-slate-400" : "border-white/25 bg-white/5 text-slate-400"}`}
                >
                  <svg viewBox="0 0 64 64" className="h-16 w-16" aria-hidden>
                    <rect
                      x={4}
                      y={4}
                      width={56}
                      height={56}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      opacity={0.35}
                    />
                    <path
                      d="M12 12h40v40H12z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1}
                      strokeDasharray="4 3"
                      opacity={0.5}
                    />
                    <text
                      x={32}
                      y={36}
                      textAnchor="middle"
                      className="fill-current text-[7px]"
                      style={{ fontSize: 7 }}
                    >
                      QR
                    </text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
