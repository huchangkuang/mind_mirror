"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { readHistory, type HistoryRecord } from "@/lib/mbti/history-storage";

const DIMENSION_LABELS: Record<string, string> = {
  EI: "E / I",
  SN: "S / N",
  TF: "T / F",
  JP: "J / P",
};

export default function MbtiHistoryPage() {
  const [list, setList] = useState<HistoryRecord[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    setList(readHistory().sort((a, b) => b.timestamp - a.timestamp));
  }, []);

  return (
    <main className="min-h-screen p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">历史记录</h1>
      {list.length === 0 ? (
        <Card>
          <p className="text-gray-600 dark:text-gray-400">暂无测试记录，完成一次测试后会自动保存到这里。</p>
          <Link href="/mbti/test" className="mt-4 inline-block">
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
                  className="w-full text-left flex justify-between items-center"
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                >
                  <span className="font-semibold text-lg text-blue-600 dark:text-blue-400">{record.type}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(record.timestamp).toLocaleString("zh-CN")}
                  </span>
                </button>
                {expandedIndex === index && record.dimensionStrength && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">维度分布</p>
                    {(["EI", "SN", "TF", "JP"] as const).map((key) => (
                      <div key={key}>
                        <p className="text-xs text-gray-500">{DIMENSION_LABELS[key]}</p>
                        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                          <div
                            className="h-full bg-blue-500"
                            style={{ width: `${record.dimensionStrength[key] ?? 50}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6">
        <Link href="/mbti">
          <Button variant="secondary">返回首页</Button>
        </Link>
      </div>
    </main>
  );
}
