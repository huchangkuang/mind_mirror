"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCityMatchStore } from "@/stores/city-match-store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";

export default function CityMatchTestPage() {
  const router = useRouter();
  const {
    questions,
    meta,
    currentIndex,
    answers,
    result,
    isSubmitted,
    isLoading,
    error,
    setQuestions,
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
    setHydrated(false);
    setLoading(true);
    setError(null);

    fetch("/api/city-match/questions")
      .then((r) => {
        if (!r.ok) throw new Error("加载题目失败");
        return r.json();
      })
      .then((data) => {
        setQuestions(data.questions, {
          version: data.meta.version,
          questionCount: data.meta.questionCount,
          estimatedMinutes: data.meta.estimatedMinutes,
        });
        hydrate();
        setHydrated(true);
        setLoading(false);

        const state = useCityMatchStore.getState();
        if (state.isSubmitted && state.result) {
          router.replace("/city-match/result");
        }
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "加载失败");
        setLoading(false);
      });
  }, [loadKey]);

  useEffect(() => {
    if (isSubmitted && result) {
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
        <ProgressBar current={answeredCount} total={questions.length} />
      </div>
      <Card>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          第 {currentIndex + 1} / {questions.length} 题
        </p>
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
