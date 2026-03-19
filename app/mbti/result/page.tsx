"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMbtiStore } from "@/stores/mbti-store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getTypeDescription } from "@/lib/mbti/type-descriptions";
import type { MbtiResult } from "@/lib/mbti/scoring";

const DIMENSION_LABELS: Record<string, string> = {
  EI: "外向 E ← → I 内向",
  SN: "实感 S ← → N 直觉",
  TF: "思考 T ← → F 情感",
  JP: "判断 J ← → P 知觉",
};

export default function MbtiResultPage() {
  const { result, mode, setQuestions, hydrate } = useMbtiStore();
  const [displayResult, setDisplayResult] = useState<MbtiResult | null>(result ?? null);

  useEffect(() => {
    const state = useMbtiStore.getState();
    if (state.result) {
      setDisplayResult(state.result);
      return;
    }
    fetch(`/api/mbti/questions?mode=${state.mode}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (!data?.questions?.length) return;
        setQuestions(data.questions, {
          version: data.version,
          questionCount: data.questionCount,
          estimatedMinutes: data.estimatedMinutes,
          mode: data.mode,
          questionType: data.questionType,
        });
        const ok = hydrate();
        if (ok) setDisplayResult(useMbtiStore.getState().result ?? null);
      })
      .catch(() => {});
  }, [setQuestions, hydrate]);
  if (!displayResult) {
    return (
      <main className="min-h-screen p-6 max-w-2xl mx-auto">
        <Card>
          <p className="text-gray-600 dark:text-gray-400">暂无结果，请先完成测试。</p>
          <Link href="/mbti/test" className="mt-4 inline-block">
            <Button variant="primary">去测试</Button>
          </Link>
        </Card>
      </main>
    );
  }

  const desc = getTypeDescription(displayResult.type);

  return (
    <main className="min-h-screen p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">你的 MBTI 类型</h1>
      <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1">{displayResult.type}</p>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{desc.title}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        测试模式：{mode === "deep" ? "深度版（5级量表）" : "快速版（2选1）"}
      </p>

      <Card className="mb-6">
        <h2 className="text-lg font-semibold mb-4">维度分布</h2>
        <div className="space-y-4">
          {(["EI", "SN", "TF", "JP"] as const).map((key) => (
            <div key={key}>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{DIMENSION_LABELS[key]}</p>
              <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${displayResult.dimensionStrength[key]}%` }}
                />
                <div className="h-full flex-1 bg-gray-300 dark:bg-gray-600" />
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{displayResult.dimensionStrength[key]}%</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mb-6">
        <h2 className="text-lg font-semibold mb-2">类型说明</h2>
        <p className="text-gray-700 dark:text-gray-300">{desc.summary}</p>
      </Card>

      <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 mb-8">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          <strong>免责声明：</strong>本测试仅供娱乐与自我探索参考，不能替代专业心理评估或诊断。结果会随情境与时间变化，请理性看待。
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/mbti">
          <Button variant="primary">返回首页</Button>
        </Link>
        <Link href="/mbti/test">
          <Button variant="secondary">再测一次</Button>
        </Link>
        <Link href="/mbti/history">
          <Button variant="ghost">历史记录</Button>
        </Link>
      </div>
    </main>
  );
}
