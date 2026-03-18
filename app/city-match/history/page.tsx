"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { readHistory, clearHistory, type CityMatchHistoryRecord } from "@/lib/city-match/history-storage";
import { getDimensionLabel, scoreToPercentage } from "@/lib/city-match/scoring";
import type { DimensionScores } from "@/lib/city-match/types";

const DIMENSION_KEYS: Array<keyof DimensionScores> = ["lifestyle", "social", "environment", "pace"];

export default function CityMatchHistoryPage() {
  const [list, setList] = useState<CityMatchHistoryRecord[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    setList(readHistory().sort((a, b) => b.timestamp - a.timestamp));
  }, []);

  const handleClear = () => {
    if (confirm("确定要清除所有历史记录吗？此操作不可恢复。")) {
      clearHistory();
      setList([]);
    }
  };

  return (
    <main className="min-h-screen p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">测试历史</h1>
        {list.length > 0 && (
          <button
            onClick={handleClear}
            className="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
          >
            清除记录
          </button>
        )}
      </div>

      {list.length === 0 ? (
        <Card>
          <p className="text-gray-600 dark:text-gray-400">暂无测试记录，完成一次测试后会自动保存到这里。</p>
          <Link href="/city-match/test" className="mt-4 inline-block">
            <Button variant="primary">去测试</Button>
          </Link>
        </Card>
      ) : (
        <ul className="space-y-3">
          {list.map((record, index) => (
            <li key={`${record.timestamp}-${index}`}>
              <Card>
                <button
                  type="button"
                  className="w-full text-left"
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-lg text-emerald-600 dark:text-emerald-400">
                        {record.topCity}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                        最佳匹配
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(record.timestamp).toLocaleString("zh-CN")}
                    </span>
                  </div>
                </button>

                {expandedIndex === index && record.dimensionScores && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">性格维度分布</p>
                    {DIMENSION_KEYS.map((key) => {
                      const label = getDimensionLabel(key);
                      const score = record.dimensionScores[key];
                      const percentage = scoreToPercentage(score);

                      return (
                        <div key={key}>
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                            <span>{label.left}</span>
                            <span>{label.right}</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden relative">
                            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-400 dark:bg-gray-500 z-10" />
                            <div
                              className="h-full bg-emerald-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/city-match">
          <Button variant="secondary">返回首页</Button>
        </Link>
        <Link href="/city-match/test">
          <Button variant="primary">重新测试</Button>
        </Link>
      </div>

      {/* Back to Home */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
        >
          返回 Mind Mirror 首页
        </Link>
      </div>
    </main>
  );
}
