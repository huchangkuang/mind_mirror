"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCityMatchStore } from "@/stores/city-match-store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MapPin, Building2, ArrowRight } from "lucide-react";
import type { CityMatchResult, DimensionScores } from "@/lib/city-match/types";
import { getDimensionLabel, scoreToPercentage } from "@/lib/city-match/scoring";
import { TestCompletionLoginPrompt } from "@/components/auth/TestCompletionLoginPrompt";

const DIMENSION_KEYS: Array<keyof DimensionScores> = ["lifestyle", "social", "environment", "pace"];

export default function CityMatchResultPage() {
  const { result, setQuestions, hydrate } = useCityMatchStore();
  const [displayResult, setDisplayResult] = useState<CityMatchResult | null>(result ?? null);

  useEffect(() => {
    const state = useCityMatchStore.getState();
    if (state.result) {
      setDisplayResult(state.result);
      return;
    }

    fetch("/api/city-match/questions")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data?.questions?.length) return;
        setQuestions(data.questions, {
          version: data.meta.version,
          questionCount: data.meta.questionCount,
          estimatedMinutes: data.meta.estimatedMinutes,
        });
        const ok = hydrate();
        if (ok) setDisplayResult(useCityMatchStore.getState().result ?? null);
      })
      .catch(() => {});
  }, [setQuestions, hydrate]);

  if (!displayResult) {
    return (
      <main className="min-h-screen p-6 max-w-2xl mx-auto">
        <Card>
          <p className="text-gray-600 dark:text-gray-400">暂无结果，请先完成测试。</p>
          <Link href="/city-match/test" className="mt-4 inline-block">
            <Button variant="primary">去测试</Button>
          </Link>
        </Card>
      </main>
    );
  }

  const topMatch = displayResult.matches[0];
  const otherMatches = displayResult.matches.slice(1);

  return (
    <main className="min-h-screen p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">你的理想城市</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">根据你的性格特征分析，以下城市最适合你</p>

      {/* Top Match */}
      {topMatch && (
        <Card className="mb-6 relative overflow-hidden">
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-medium">
              <MapPin className="w-3 h-3" />
              最佳匹配 {topMatch.matchPercentage}%
            </span>
          </div>

          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg flex-shrink-0">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {topMatch.city.name}
              </h2>
              <p className="text-lg text-gray-500 dark:text-gray-400">{topMatch.city.country}</p>
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            {topMatch.city.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {topMatch.city.features.map((feature, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm"
              >
                {feature}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Other Matches */}
      {otherMatches.length > 0 && (
        <Card className="mb-6">
          <h2 className="text-lg font-semibold mb-4">其他推荐城市</h2>
          <div className="space-y-3">
            {otherMatches.map((match, idx) => (
              <div
                key={match.city.id}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-sm font-medium flex items-center justify-center">
                    {idx + 2}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{match.city.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{match.city.country}</p>
                  </div>
                </div>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  {match.matchPercentage}% 匹配
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Dimension Distribution */}
      <Card className="mb-6">
        <h2 className="text-lg font-semibold mb-4">你的性格维度</h2>
        <div className="space-y-4">
          {DIMENSION_KEYS.map((key) => {
            const label = getDimensionLabel(key);
            const score = displayResult.dimensionScores[key];
            const percentage = scoreToPercentage(score);

            return (
              <div key={key}>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>{label.left}</span>
                  <span>{label.right}</span>
                </div>
                <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden relative">
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-400 dark:bg-gray-500 z-10" />
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all absolute left-0"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <TestCompletionLoginPrompt testName="性格匹配城市测试" />

      {/* Disclaimer */}
      <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 mb-8">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          <strong>免责声明：</strong>本测试结果仅供娱乐和参考，城市选择还需综合考虑工作机会、生活成本、签证等实际因素。
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Link href="/city-match">
          <Button variant="primary">返回首页</Button>
        </Link>
        <Link href="/city-match/test">
          <Button variant="secondary">重新测试</Button>
        </Link>
        <Link href="/city-match/history">
          <Button variant="ghost">历史记录</Button>
        </Link>
      </div>

      {/* Back to Home */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          返回 Mind Mirror 首页
        </Link>
      </div>
    </main>
  );
}
