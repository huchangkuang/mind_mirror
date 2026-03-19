"use client";

import Link from "next/link";
import { useTestCompletionAuthPrompt } from "@/hooks/use-test-completion-auth-prompt";

interface TestCompletionLoginPromptProps {
  testName: string;
}

/**
 * Completion prompt contract:
 * 1) Place this component only in test result/completion pages.
 * 2) Pass current test name for copy context.
 * 3) Future tests can reuse it directly without duplicating auth checks.
 */
export function TestCompletionLoginPrompt({ testName }: TestCompletionLoginPromptProps) {
  const { shouldShowPrompt, isAuthLoading } = useTestCompletionAuthPrompt();

  if (isAuthLoading || !shouldShowPrompt) return null;

  return (
    <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4 mb-6">
      <p className="text-sm text-blue-800 dark:text-blue-200">
        你已完成{testName}。登录后可长期保存测试数据，随时查看历史记录并跨设备同步。
      </p>
      <div className="mt-3">
        <Link
          href="/auth"
          className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          立即登录 / 注册
        </Link>
      </div>
    </div>
  );
}
