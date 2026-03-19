"use client";

import { Suspense, FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/stores/auth-store";

type AuthMode = "login" | "register";

function safeNext(raw: string | null): string {
  if (!raw) return "/";
  const t = raw.trim();
  if (!t.startsWith("/") || t.startsWith("//")) return "/";
  if (t.includes("://")) return "/";
  return t;
}

function AuthBackdrop() {
  return (
    <>
      <div
        className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-blue-50/90 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/40"
        aria-hidden
      />
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none opacity-80 dark:opacity-50"
        aria-hidden
      >
        <div className="absolute -top-28 -right-20 h-72 w-72 rounded-full bg-blue-400/25 dark:bg-blue-500/[0.12] blur-3xl" />
        <div className="absolute top-1/3 -left-24 h-80 w-80 rounded-full bg-violet-400/20 dark:bg-violet-500/[0.1] blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-cyan-300/15 dark:bg-cyan-500/[0.08] blur-3xl" />
      </div>
    </>
  );
}

function AuthPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = useMemo(() => safeNext(searchParams.get("next")), [searchParams]);
  const modeFromUrl = searchParams.get("mode") === "register" ? "register" : "login";
  const [mode, setMode] = useState<AuthMode>(modeFromUrl);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);

  useEffect(() => {
    setMode(searchParams.get("mode") === "register" ? "register" : "login");
  }, [searchParams]);

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
      router.push(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "请求失败，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-600 bg-white/90 dark:bg-slate-800/60 px-3.5 py-2.5 text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:ring-blue-400/40 transition-shadow";

  return (
    <main className="relative min-h-dvh flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">
      <AuthBackdrop />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-outfit text-lg font-bold text-slate-800 dark:text-white hover:opacity-85 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg px-1"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-md">
              <Sparkles className="h-4 w-4" aria-hidden />
            </span>
            Mind Mirror
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-600/60 bg-white/85 dark:bg-slate-900/75 backdrop-blur-xl shadow-xl shadow-slate-900/[0.06] dark:shadow-black/40 dark:ring-1 dark:ring-white/10 p-6 sm:p-8">
          <h1 className="font-outfit text-2xl font-bold text-slate-900 dark:text-white mb-1">
            {title}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
            登录后可以长期保存测试数据，随时查看历史记录。
          </p>

          <div
            className="mb-6 inline-flex w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/80 dark:bg-slate-800/40 p-1"
            role="tablist"
            aria-label="登录或注册"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === "login"}
              onClick={() => setMode("login")}
              className={`min-h-[44px] flex-1 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
                mode === "login"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              登录
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "register"}
              onClick={() => setMode("register")}
              className={`min-h-[44px] flex-1 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
                mode === "register"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              注册
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="auth-username"
                className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5"
              >
                用户名
              </label>
              <input
                id="auth-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputClass}
                placeholder="请输入用户名（3-32位）"
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label
                htmlFor="auth-password"
                className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5"
              >
                密码
              </label>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                placeholder="请输入密码（至少6位）"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                required
              />
            </div>
            {error && (
              <p
                className="text-sm text-red-700 dark:text-red-300 rounded-xl bg-red-50 dark:bg-red-950/40 px-3 py-2 border border-red-100 dark:border-red-900/50"
                role="alert"
              >
                {error}
              </p>
            )}
            <Button type="submit" disabled={submitting} className="w-full min-h-[48px] rounded-xl text-base">
              {submitting ? "提交中..." : mode === "login" ? "登录" : "注册并登录"}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-600/60 text-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 min-h-[44px] text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl px-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden />
              返回首页
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <main className="relative min-h-dvh flex items-center justify-center p-6 overflow-hidden">
          <AuthBackdrop />
          <p className="relative z-10 text-slate-600 dark:text-slate-400">加载中…</p>
        </main>
      }
    >
      <AuthPageInner />
    </Suspense>
  );
}
