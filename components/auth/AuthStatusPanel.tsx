"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";

export function AuthStatusPanel() {
  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  if (status === "loading") {
    return (
      <div className="text-sm text-white/80 bg-black/20 px-3 py-1.5 rounded-full">
        登录状态加载中...
      </div>
    );
  }

  if (status === "guest" || !user) {
    return (
      <Link
        href="/auth"
        className="text-sm font-medium text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-colors"
      >
        登录 / 注册
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-white bg-black/20 px-3 py-1.5 rounded-full">
        已登录：{user.username}
      </span>
      <button
        type="button"
        onClick={() => logout().catch(() => {})}
        className="text-sm font-medium text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-colors"
      >
        退出
      </button>
    </div>
  );
}
