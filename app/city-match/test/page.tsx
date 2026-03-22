"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCityMatchStore } from "@/stores/city-match-store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";

function CityMatchTestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedMode = searchParams.get("mode") === "full" ? "full" : "quick";

  const {
    questions,
    meta,
    mode,
    currentIndex,
    answers,
    result,
    isSubmitted,
    isLoading,
    error,
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
  } = useCityMatchStore();

  const [hydrated, setHydrated] = useState(false);
  const [loadKey, setLoadKey] = useState(0);

  useEffect(() => {
    const restart = searchParams.get("restart");
    if (restart === "1" || restart === "true") {
      reset();
      const next = new URLSearchParams(searchParams.toString());
      next.delete("restart");
      const q = next.toString();
      router.replace(`/city-match/test${q ? `?${q}` : ""}`);
      return;
    }

    const state = useCityMatchStore.getState();
    const hasInProgress = Object.keys(state.answers).length > 0 || state.currentIndex > 0;

    if (state.mode !== requestedMode && hasInProgress) {
      const ok = window.confirm("切换测试模式将清空当前进度，是否继续？");
      if (!ok) {
        router.replace(`/city-match/test?mode=${state.mode}`);
        return;
      }
      reset();
    }

    setMode(requestedMode);
    setHydrated(false);
    setLoading(true);
    setError(null);

    fetch(`/api/city-match/questions?mode=${requestedMode}`)
      .then((r) => {
        if (!r.ok) throw new Error("加载题目失败");
        return r.json();
      })
      .then((data) => {
        setQuestions(data.questions, {
          version: data.meta.version,
          questionCount: data.meta.questionCount,
          estimatedMinutes: data.meta.estimatedMinutes,
          mode: data.meta.mode,
        });
        hydrate();
        setHydrated(true);
        setLoading(false);

        const currentState = useCityMatchStore.getState();
        if (currentState.isSubmitted && currentState.result) {
          router.replace("/city-match/result");
        }
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "加载失败");
        setLoading(false);
      });
  }, [
    loadKey,
    requestedMode,
    reset,
    router,
    searchParams,
    setError,
    setLoading,
    setMode,
    setQuestions,
    hydrate,
  ]);

  useEffect(() => {
    // reset() 与本轮 effect 同 commit 时，订阅值尚未更新，需读 getState() 避免误跳结果页
    const { isSubmitted: submitted, result: res } = useCityMatchStore.getState();
    if (submitted && res) {
      router.replace("/city-match/result");
    }
  }, [isSubmitted, result, router]);

  const current = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const canNext = current && answers[current.id];
  const isLast = currentIndex === questions.length - 1;

  if (error) {
    return (
      <main className="min-h-screen p-6 max-w-2xl mx-auto">
        <Card>
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <Link href="/city-match" className="mt-4 inline-block">
            <Button variant="secondary">返回首页</Button>
          </Link>
        </Card>
      </main>
    );
  }

  if (isLoading || !hydrated || !meta) {
    return (
      <main className="min-h-screen p-6 max-w-2xl mx-auto flex items-center justify-center">
        <p className="text-gray-500">加载题目中…</p>
      </main>
    );
  }

  if (!questions.length) {
    return (
      <main className="min-h-screen p-6 max-w-2xl mx-auto">
        <Card>
          <p className="text-gray-600 dark:text-gray-400">暂无题目，请稍后再试。</p>
          <Link href="/city-match" className="mt-4 inline-block">
            <Button variant="secondary">返回首页</Button>
          </Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>{mode === "full" ? "完整版" : "快速版"}</span>
          <span>第 {currentIndex + 1} / {questions.length} 题</span>
        </div>
        <ProgressBar current={answeredCount} total={questions.length} />
      </div>

      <Card>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">{current.text}</h2>
        <ul className="space-y-2">
          {current.options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                onClick={() => answer(current.id, opt.value)}
                className={`w-full text-left px-4 py-3 rounded-lg border transition ${
                  answers[current.id] === opt.value
                    ? "border-teal-600 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300"
                    : "border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex justify-between">
          <Button variant="ghost" onClick={prevQuestion} disabled={currentIndex === 0}>
            上一题
          </Button>
          {isLast ? (
            <Button variant="primary" onClick={submit} disabled={!canNext}>
              提交结果
            </Button>
          ) : (
            <Button variant="primary" onClick={nextQuestion} disabled={!canNext}>
              下一题
            </Button>
          )}
        </div>
      </Card>

      <div className="mt-4 flex items-center justify-center gap-4 text-sm">
        <button
          type="button"
          onClick={() => {
            const ok = window.confirm("确定要放弃当前测试并返回首页吗？");
            if (!ok) return;
            reset();
            router.push("/city-match");
          }}
          className="text-red-500 hover:underline"
        >
          放弃测试
        </button>
        <span className="text-gray-300 dark:text-gray-600">|</span>
        <button
          type="button"
          onClick={() => {
            reset();
            setLoadKey((k) => k + 1);
          }}
          className="text-gray-500 hover:underline"
        >
          重新开始
        </button>
      </div>
    </main>
  );
}

export default function CityMatchTestPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen p-6 max-w-2xl mx-auto flex items-center justify-center">
          <p className="text-gray-500">加载中…</p>
        </main>
      }
    >
      <CityMatchTestContent />
    </Suspense>
  );
}
