"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/stores/auth-store";

type AuthMode = "login" | "register";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);

  const title = useMemo(() => (mode === "login" ? "登录账号" : "创建账号"), [mode]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (mode === "login") {
        await login(username, password);
      } else {
        await register(username, password);
      }
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "请求失败，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen p-6 max-w-xl mx-auto flex items-center">
      <Card className="w-full">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          登录后可以长期保存测试数据，随时查看历史记录。
        </p>

        <div className="mb-5 inline-flex rounded-lg border border-gray-200 dark:border-gray-700 p-1">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`px-3 py-1.5 rounded-md text-sm ${
              mode === "login"
                ? "bg-blue-600 text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            登录
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`px-3 py-1.5 rounded-md text-sm ${
              mode === "register"
                ? "bg-blue-600 text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            注册
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-200 mb-1">用户名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
              placeholder="请输入用户名（3-32位）"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-200 mb-1">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
              placeholder="请输入密码（至少6位）"
              required
            />
          </div>
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "提交中..." : mode === "login" ? "登录" : "注册并登录"}
          </Button>
        </form>

        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:underline">
            返回首页
          </Link>
        </div>
      </Card>
    </main>
  );
}
