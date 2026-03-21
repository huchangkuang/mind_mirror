"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { AuthUser } from "@/lib/auth/types";
import { ApiRequestError, fetchHistory, type HistoryRecord } from "@/lib/api/history";
import { changePassword } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/auth-store";

const PROFILE_PATH = "/profile";

function formatHistoryTime(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString("zh-CN", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return iso;
  }
}

function recordSummary(record: HistoryRecord): string {
  const s = record.result_summary?.trim();
  if (s) return s;
  const r = record.result;
  if (r == null) return "已完成测试";
  if (typeof r === "string") {
    const t = r.trim();
    if (t.length <= 80) return t || "已完成测试";
    return `${t.slice(0, 80)}…`;
  }
  if (typeof r === "object") {
    const o = r as Record<string, unknown>;
    for (const k of ["summary", "type", "title", "label"]) {
      const v = o[k];
      if (typeof v === "string" && v.trim()) return v.trim();
    }
  }
  return "已完成测试";
}

function historyDetailHref(record: HistoryRecord): string | null {
  if (record.href?.startsWith("/")) {
    return `${record.href.replace(/\/$/, "")}/history`;
  }
  return null;
}

interface ProfilePageClientProps {
  initialUser: AuthUser;
}

export function ProfilePageClient({ initialUser }: ProfilePageClientProps) {
  const updateNickname = useAuthStore((s) => s.updateNickname);
  const user = useAuthStore((s) => s.user);
  const syncUser = useAuthStore((s) => s.refreshFromServer);

  const effective = user ?? initialUser;

  const [nickDraft, setNickDraft] = useState(initialUser.nickname);
  const [nickMsg, setNickMsg] = useState<string | null>(null);
  const [nickPending, setNickPending] = useState(false);

  const [curPwd, setCurPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdMsg, setPwdMsg] = useState<string | null>(null);
  const [pwdPending, setPwdPending] = useState(false);

  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [historyRows, setHistoryRows] = useState<HistoryRecord[]>([]);

  useEffect(() => {
    if (user?.nickname) setNickDraft(user.nickname);
  }, [user?.nickname]);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const list = await fetchHistory();
      setHistoryRows(list);
    } catch (e) {
      const msg =
        e instanceof ApiRequestError && e.status === 401
          ? "请重新登录后查看测试记录"
          : "加载测试记录失败";
      setHistoryError(msg);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const grouped = useMemo(() => {
    const map = new Map<string, HistoryRecord[]>();
    for (const r of historyRows) {
      const arr = map.get(r.test_id) ?? [];
      arr.push(r);
      map.set(r.test_id, arr);
    }
    return [...map.entries()].map(([testId, records]) => ({
      testId,
      title: records[0]?.title ?? testId,
      href: records[0]?.href ?? null,
      records,
    }));
  }, [historyRows]);

  const inputClass =
    "w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-600 bg-white/90 dark:bg-slate-800/60 px-3.5 py-2.5 text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:ring-blue-400/40 transition-shadow";

  async function onSaveNickname(e: FormEvent) {
    e.preventDefault();
    setNickMsg(null);
    setNickPending(true);
    try {
      await updateNickname(nickDraft);
      setNickMsg("昵称已更新");
    } catch (err) {
      setNickMsg(err instanceof Error ? err.message : "保存失败");
    } finally {
      setNickPending(false);
    }
  }

  async function onChangePassword(e: FormEvent) {
    e.preventDefault();
    setPwdMsg(null);
    if (newPwd !== confirmPwd) {
      setPwdMsg("两次输入的新密码不一致");
      return;
    }
    setPwdPending(true);
    try {
      await changePassword(curPwd, newPwd);
      setPwdMsg("密码已更新");
      setCurPwd("");
      setNewPwd("");
      setConfirmPwd("");
      await syncUser();
    } catch (err) {
      setPwdMsg(err instanceof Error ? err.message : "修改失败");
    } finally {
      setPwdPending(false);
    }
  }

  return (
    <div className="min-h-dvh flex flex-col bg-gradient-to-br from-slate-100 via-white to-blue-50/90 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/40">
      <SiteHeader returnTo={PROFILE_PATH} variant="bar" />
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-outfit">个人信息</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">管理账号、昵称与密码，查看测试记录摘要。</p>
        </div>

        <Card>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">账号</h2>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">登录账号（不可修改）</label>
          <p className="text-base text-slate-900 dark:text-slate-100 font-mono bg-slate-50 dark:bg-slate-800/80 rounded-lg px-3 py-2 border border-slate-200 dark:border-slate-600">
            {effective.username}
          </p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">昵称</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            未单独设置时与登录账号一致；支持字母、数字、空格与 - _ . ·，最多 32 个字符。
          </p>
          <form onSubmit={onSaveNickname} className="space-y-3">
            <input
              className={inputClass}
              value={nickDraft}
              onChange={(e) => setNickDraft(e.target.value)}
              placeholder={effective.username}
              autoComplete="nickname"
              maxLength={64}
            />
            {nickMsg && (
              <p
                className={
                  nickMsg.includes("失败") || nickMsg.includes("不能")
                    ? "text-sm text-red-600 dark:text-red-400"
                    : "text-sm text-emerald-600 dark:text-emerald-400"
                }
              >
                {nickMsg}
              </p>
            )}
            <Button type="submit" disabled={nickPending}>
              {nickPending ? "保存中…" : "保存昵称"}
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">修改密码</h2>
          <form onSubmit={onChangePassword} className="space-y-3">
            <input
              className={inputClass}
              type="password"
              value={curPwd}
              onChange={(e) => setCurPwd(e.target.value)}
              placeholder="当前密码"
              autoComplete="current-password"
            />
            <input
              className={inputClass}
              type="password"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              placeholder="新密码（6–128 位）"
              autoComplete="new-password"
            />
            <input
              className={inputClass}
              type="password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              placeholder="确认新密码"
              autoComplete="new-password"
            />
            {pwdMsg && (
              <p
                className={
                  pwdMsg.includes("失败") || pwdMsg.includes("不一致") || pwdMsg.includes("不正确")
                    ? "text-sm text-red-600 dark:text-red-400"
                    : "text-sm text-emerald-600 dark:text-emerald-400"
                }
              >
                {pwdMsg}
              </p>
            )}
            <Button type="submit" disabled={pwdPending}>
              {pwdPending ? "提交中…" : "更新密码"}
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">我的测试结果</h2>
          {historyLoading && (
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              加载中…
            </div>
          )}
          {!historyLoading && historyError && (
            <p className="text-sm text-red-600 dark:text-red-400">{historyError}</p>
          )}
          {!historyLoading && !historyError && grouped.length === 0 && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              暂无已保存的测试记录。完成测试并保存结果后，将在此按项目展示摘要。
            </p>
          )}
          {!historyLoading && !historyError && grouped.length > 0 && (
            <ul className="space-y-4">
              {grouped.map(({ testId, title, href, records }) => {
                const latest = records[0];
                const detail = historyDetailHref(latest);
                return (
                  <li
                    key={testId}
                    className="rounded-lg border border-slate-200 dark:border-slate-600 p-4 bg-slate-50/80 dark:bg-slate-800/50"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-medium text-slate-900 dark:text-white">{title}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        共 {records.length} 条 · 最近 {formatHistoryTime(latest.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mt-2">{recordSummary(latest)}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {detail && (
                        <Link
                          href={detail}
                          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          查看该项目历史
                        </Link>
                      )}
                      {href && (
                        <Link
                          href={href}
                          className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:underline"
                        >
                          进入测试
                        </Link>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </main>
    </div>
  );
}
