"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  ThumbsUp,
  Trash2,
  Sparkles,
  MessageCircle,
  Flame,
  Clock,
  ArrowLeft,
  Send,
} from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { useAuthStore } from "@/stores/auth-store";
import {
  deleteFeedbackComment,
  fetchFeedbackComments,
  postFeedbackComment,
  toggleFeedbackLike,
  type FeedbackComment,
  type FeedbackSort,
} from "@/lib/api/feedback";

const FEEDBACK_PATH = "/feedback";

function authHrefForFeedback(mode: "login" | "register") {
  const q = new URLSearchParams({
    next: FEEDBACK_PATH,
    mode,
  });
  return `/auth?${q.toString()}`;
}

function avatarLetter(username: string): string {
  const t = username.trim();
  if (!t) return "?";
  const ch = t[0];
  return /[a-zA-Z0-9]/.test(ch) ? ch.toUpperCase() : ch;
}

export default function FeedbackPage() {
  const router = useRouter();
  const status = useAuthStore((s) => s.status);
  const isFeedbackModerator = useAuthStore((s) => s.isFeedbackModerator);

  const [sort, setSort] = useState<FeedbackSort>("hot");
  const [comments, setComments] = useState<FeedbackComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pendingLikeId, setPendingLikeId] = useState<number | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      setListError(null);
      const { comments: next } = await fetchFeedbackComments(sort);
      setComments(next);
    } catch (e) {
      setListError(e instanceof Error ? e.message : "加载失败");
    } finally {
      setLoading(false);
    }
  }, [sort]);

  useEffect(() => {
    setLoading(true);
    void load();
  }, [load]);

  useEffect(() => {
    const id = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState !== "visible") return;
      void load();
    }, 5000);
    return () => clearInterval(id);
  }, [load]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status !== "authenticated") {
      router.push(authHrefForFeedback("login"));
      return;
    }
    const text = draft.trim();
    if (!text) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await postFeedbackComment(text);
      setDraft("");
      await load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "发布失败";
      if (msg.includes("登录")) {
        router.push(authHrefForFeedback("login"));
      } else {
        setSubmitError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function onLike(c: FeedbackComment) {
    if (status !== "authenticated") {
      router.push(authHrefForFeedback("login"));
      return;
    }
    setPendingLikeId(c.id);
    try {
      const { liked, likeCount } = await toggleFeedbackLike(c.id);
      setComments((prev) =>
        prev.map((row) => (row.id === c.id ? { ...row, liked, likeCount } : row))
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("登录")) {
        router.push(authHrefForFeedback("login"));
      }
    } finally {
      setPendingLikeId(null);
    }
  }

  async function onDelete(id: number) {
    if (!isFeedbackModerator) return;
    if (!window.confirm("确定删除这条评论？")) return;
    setPendingDeleteId(id);
    try {
      await deleteFeedbackComment(id);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "删除失败");
    } finally {
      setPendingDeleteId(null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SiteHeader returnTo={FEEDBACK_PATH} variant="scroll-surface" />

      {/* 品牌顶区：固定顶栏叠在渐变上，随滚动过渡到主题表面 */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 gradient-hero" aria-hidden />
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          aria-hidden
        >
          <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute top-1/2 -left-16 w-48 h-48 rounded-full bg-violet-300/30 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 pt-16 sm:pt-20 pb-14 sm:pb-16">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 mb-4">
            <Sparkles className="w-4 h-4 text-amber-200 shrink-0" aria-hidden />
            <span className="text-white/90 text-xs sm:text-sm font-medium">
              你的声音很重要
            </span>
          </div>
          <h1 className="font-outfit text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">
            反馈与建议
          </h1>
          <p className="font-worksans text-white/80 text-sm sm:text-base max-w-xl leading-relaxed">
            欢迎留下想法、问题或改进建议。我们会认真阅读每一条反馈，让 Mind Mirror 变得更好。
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-8 sm:-mt-10 relative z-10 pb-16">
        {/* 撰写区 */}
        <form
          onSubmit={onSubmit}
          className="mb-10 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-xl shadow-slate-900/5 dark:shadow-black/40 ring-1 ring-slate-900/5 dark:ring-white/5 p-5 sm:p-6 motion-reduce:transition-none"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-md">
              <MessageCircle className="w-4 h-4" aria-hidden />
            </div>
            <div>
              <label
                htmlFor="feedback-body"
                className="font-outfit text-base font-semibold text-slate-900 dark:text-white"
              >
                写下你的反馈
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {status === "authenticated"
                  ? "支持多行文本，最多 2000 字"
                  : "登录后即可发布；可先写好再登录"}
              </p>
            </div>
          </div>
          <textarea
            id="feedback-body"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={4}
            maxLength={2000}
            placeholder={
              status === "authenticated"
                ? "例如：希望增加某类测试、遇到卡顿、文案建议…"
                : "先在这里写好内容，登录后点击发布即可"
            }
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50/80 dark:bg-slate-950/50 px-4 py-3 text-base text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-y min-h-[120px] leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-shadow"
          />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs tabular-nums text-slate-500 dark:text-slate-400">
              {draft.length} / 2000
            </span>
            <div className="flex items-center gap-2 sm:gap-3">
              {status !== "authenticated" && (
                <Link
                  href={authHrefForFeedback("login")}
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 min-h-[44px] inline-flex items-center px-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  去登录
                </Link>
              )}
              <button
                type="submit"
                disabled={submitting || !draft.trim()}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 hover:from-blue-500 hover:to-violet-500 disabled:opacity-45 disabled:shadow-none transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-offset-slate-900"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                    发布中…
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" aria-hidden />
                    发布反馈
                  </>
                )}
              </button>
            </div>
          </div>
          {submitError && (
            <p
              className="mt-3 text-sm text-red-600 dark:text-red-400 rounded-xl bg-red-50 dark:bg-red-950/40 px-3 py-2 border border-red-100 dark:border-red-900/50"
              role="alert"
            >
              {submitError}
            </p>
          )}
        </form>

        {/* 列表标题 + 排序 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <h2 className="font-outfit text-xl font-bold text-slate-900 dark:text-white">
            全部反馈
            {!loading && comments.length > 0 && (
              <span className="ml-2 text-sm font-normal text-slate-500 dark:text-slate-400">
                {comments.length} 条
              </span>
            )}
          </h2>
          <div
            className="inline-flex self-start rounded-2xl border border-slate-200 dark:border-slate-600 p-1 bg-white dark:bg-slate-800 shadow-sm"
            role="group"
            aria-label="排序方式"
          >
            {(
              [
                { key: "hot" as const, label: "热度", Icon: Flame },
                { key: "recent" as const, label: "最近", Icon: Clock },
              ] as const
            ).map(({ key, label, Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setSort(key)}
                aria-pressed={sort === key}
                className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-xl px-4 text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
                  sort === key
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0 opacity-80" aria-hidden />
                {label}
              </button>
            ))}
          </div>
        </div>

        {loading && comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/40 py-20 px-6">
            <Loader2
              className="w-10 h-10 text-blue-500 animate-spin mb-3"
              aria-hidden
            />
            <p className="text-sm text-slate-600 dark:text-slate-400">加载反馈中…</p>
          </div>
        ) : listError ? (
          <div className="rounded-3xl border border-red-200 dark:border-red-900/50 bg-red-50/80 dark:bg-red-950/30 px-6 py-10 text-center">
            <p className="text-red-700 dark:text-red-300 font-medium mb-4">{listError}</p>
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                void load();
              }}
              className="inline-flex min-h-[44px] items-center rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
            >
              重试
            </button>
          </div>
        ) : comments.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-900/20 px-6 py-14 sm:py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-950/50 dark:to-violet-950/50">
              <MessageCircle
                className="w-8 h-8 text-blue-600 dark:text-blue-400"
                aria-hidden
              />
            </div>
            <p className="font-outfit text-lg font-semibold text-slate-900 dark:text-white mb-2">
              还没有反馈
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xs mx-auto mb-6">
              做第一个分享想法的人吧，你的建议会帮助更多人。
            </p>
            {status !== "authenticated" ? (
              <Link
                href={authHrefForFeedback("login")}
                className="inline-flex min-h-[44px] items-center rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold px-6 hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                登录后发布
              </Link>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                在上方输入框写下第一条反馈
              </p>
            )}
          </div>
        ) : (
          <ul className="space-y-4 motion-reduce:transition-none">
            {comments.map((c) => (
              <li key={c.id}>
                <article className="group rounded-3xl border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200">
                  <div className="flex gap-3 sm:gap-4">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-bold text-white shadow-md ring-2 ring-white dark:ring-slate-800"
                      aria-hidden
                    >
                      {avatarLetter(c.username)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {c.username}
                          </span>
                          <time
                            className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400 sm:mt-0 sm:ml-2 sm:inline"
                            dateTime={c.createdAt}
                          >
                            {new Date(c.createdAt).toLocaleString("zh-CN")}
                          </time>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => void onLike(c)}
                            disabled={pendingLikeId === c.id}
                            aria-pressed={c.liked}
                            aria-label={
                              c.liked ? "取消点赞" : "点赞"
                            }
                            className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-2xl px-3 text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 ${
                              c.liked
                                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20 hover:bg-blue-500"
                                : "border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                          >
                            <ThumbsUp
                              className={`w-4 h-4 shrink-0 ${c.liked ? "" : "opacity-70"}`}
                              aria-hidden
                            />
                            <span className="tabular-nums">{c.likeCount}</span>
                          </button>
                          {isFeedbackModerator && (
                            <button
                              type="button"
                              onClick={() => void onDelete(c.id)}
                              disabled={pendingDeleteId === c.id}
                              aria-label="删除此条反馈"
                              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-2xl border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 disabled:opacity-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                            >
                              {pendingDeleteId === c.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                              ) : (
                                <Trash2 className="w-4 h-4" aria-hidden />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="mt-3 text-slate-700 dark:text-slate-200 whitespace-pre-wrap text-[15px] sm:text-base leading-relaxed">
                        {c.body}
                      </p>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-12 flex justify-center">
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl px-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden />
            返回首页
          </Link>
        </div>
      </div>
    </main>
  );
}
