"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useMbtiStore } from "@/stores/mbti-store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const DEEP_SCALE_LEGEND = ["非常同意", "比较同意", "不确定", "比较不同意", "非常不同意"];

function splitDeepLabel(label: string): { title: string; subtitle: string } {
  const [title, subtitle] = label.split("|");
  return { title: title ?? label, subtitle: subtitle ?? "" };
}

// 使用useSearchParams的子组件
function MbtiTestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedMode = searchParams.get("mode") === "deep" ? "deep" : "quick";
  const {
    questions,
    meta,
    currentIndex,
    answers,
    result,
    isSubmitted,
    isLoading,
    error,
    mode,
    setQuestions,
    setMode,
    setLoading,
    setError,
    answer,
    nextQuestion,
    prevQuestion,
    submit,
    reset,
    hydrate,
  } = useMbtiStore();

  const [hydrated, setHydrated] = useState(false);
  const [loadKey, setLoadKey] = useState(0);

  useEffect(() => {
    const state = useMbtiStore.getState();
    const hasInProgress = Object.keys(state.answers).length > 0 || state.currentIndex > 0;
    if (state.mode !== requestedMode && hasInProgress) {
      const ok = window.confirm("切换测试模式将清空当前进度，是否继续？");
      if (!ok) {
        router.replace(`/mbti/test?mode=${state.mode}`);
        return;
      }
      reset();
    }
    setMode(requestedMode);
    setHydrated(false);
    setLoading(true);
    setError(null);
    fetch(`/api/mbti/questions?mode=${requestedMode}`)
      .then((r) => {
        if (!r.ok) throw new Error("加载题目失败");
        return r.json();
      })
      .then((data) => {
        setQuestions(data.questions, {
          version: data.version,
          questionCount: data.questionCount,
          estimatedMinutes: data.estimatedMinutes,
          mode: data.mode,
          questionType: data.questionType,
        });
        hydrate();
        setHydrated(true);
        setLoading(false);
        const currentState = useMbtiStore.getState();
        if (currentState.isSubmitted && currentState.result) router.replace("/mbti/result");
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "加载失败");
        setLoading(false);
      });
  }, [loadKey, requestedMode, reset, router, setError, setLoading, setMode, setQuestions, hydrate]);

  useEffect(() => {
    if (isSubmitted && result) router.replace("/mbti/result");
  }, [isSubmitted, result, router]);

  const current = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const completionRate = Math.round((answeredCount / Math.max(questions.length, 1)) * 100);
  const canNext = current && answers[current.id];
  const isLast = currentIndex === questions.length - 1;

  if (error) {
    return (
      <main className="min-h-screen p-6 max-w-3xl mx-auto">
        <Card>
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <Link href="/mbti" className="mt-4 inline-block">
            <Button variant="secondary">返回首页</Button>
          </Link>
        </Card>
      </main>
    );
  }

  if (isLoading || !hydrated || !meta) {
    return (
      <main className="min-h-screen p-6 max-w-3xl mx-auto flex items-center justify-center">
        <p className="text-gray-500">加载题目中…</p>
      </main>
    );
  }

  if (!questions.length) {
    return (
      <main className="min-h-screen p-6 max-w-3xl mx-auto">
        <Card>
          <p className="text-gray-600 dark:text-gray-400">暂无题目，请稍后再试。</p>
          <Link href="/mbti" className="mt-4 inline-block">
            <Button variant="secondary">返回首页</Button>
          </Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto">
      <Card>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/40 p-4 mb-5">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <p>第 {currentIndex + 1} 题 / 共 {questions.length} 题</p>
            <p className="font-semibold">已完成 {completionRate}%</p>
          </div>
          <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 mt-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {mode === "deep" && (
          <div className="grid grid-cols-5 gap-2 text-[11px] text-gray-500 dark:text-gray-400 mb-4">
            {DEEP_SCALE_LEGEND.map((item) => (
              <span key={item} className="text-center">{item}</span>
            ))}
          </div>
        )}

        <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/40 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold">
              Q{String(currentIndex + 1).padStart(2, "0")}
            </span>
            {current.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                维度 {current.category}
              </span>
            )}
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 leading-relaxed">{current.text}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            请选择最符合你平时状态的一项，而不是偶尔的例外情况。
          </p>

          {mode === "deep" ? (
            <ul className="space-y-3">
              {current.options.map((opt) => {
                const { title, subtitle } = splitDeepLabel(opt.label);
                return (
                  <li key={opt.value}>
                    <button
                      type="button"
                      onClick={() => answer(current.id, opt.value)}
                      className={`w-full text-left px-4 py-4 rounded-xl border transition ${
                        answers[current.id] === opt.value
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-sm"
                          : "border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/40 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-current text-xs font-bold">
                          {opt.value}
                        </span>
                        <div className="flex flex-col">
                          <span className="font-semibold">{title}</span>
                          {subtitle ? <span className="text-xs opacity-80 mt-0.5">{subtitle}</span> : null}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <ul className="space-y-3">
              {current.options.map((opt) => (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={() => answer(current.id, opt.value)}
                    className={`w-full text-left px-4 py-4 rounded-xl border transition ${
                      answers[current.id] === opt.value
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-sm"
                        : "border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/40 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-current text-xs font-bold mt-0.5">
                        {opt.value}
                      </span>
                      <span className="font-medium leading-relaxed">{opt.label}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="mt-8 flex justify-between">
          <Button variant="ghost" onClick={prevQuestion} disabled={currentIndex === 0}>
            上一题
          </Button>
          {isLast ? (
            <Button
              variant="primary"
              onClick={async () => {
                try {
                  await submit();
                } catch (e) {
                  setError(e instanceof Error ? e.message : "提交失败");
                }
              }}
              disabled={!canNext}
            >
              提交结果
            </Button>
          ) : (
            <Button variant="primary" onClick={nextQuestion} disabled={!canNext}>
              下一题
            </Button>
          )}
        </div>
      </Card>
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => {
            reset();
            setLoadKey((k) => k + 1);
          }}
          className="text-sm text-gray-500 hover:underline"
        >
          重新开始
        </button>
      </div>
    </main>
  );
}

// 导出默认组件，用Suspense包裹
export default function MbtiTestPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen p-6 max-w-3xl mx-auto flex items-center justify-center">
        <p className="text-gray-500">加载中…</p>
      </main>
    }>
      <MbtiTestContent />
    </Suspense>
  );
}
