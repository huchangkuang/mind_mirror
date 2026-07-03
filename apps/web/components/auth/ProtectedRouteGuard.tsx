"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { authEntryHref, isAuthRequiredPath } from "@/lib/auth/protected-routes";

/**
 * 客户端守卫：在受保护路由上，若已确认未登录（bootstrap 完成且为 guest），则统一跳到登录页并带上 next。
 * 与服务器端 redirect（如 profile/page）互补，覆盖会话过期、多端登出、纯客户端导航等场景。
 */
export function ProtectedRouteGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const bootstrapped = useAuthStore((s) => s.bootstrapped);
  const status = useAuthStore((s) => s.status);

  useEffect(() => {
    if (!bootstrapped || status !== "guest") return;
    if (pathname === "/auth" || pathname.startsWith("/auth/")) return;
    if (!isAuthRequiredPath(pathname)) return;

    const returnPath =
      typeof window !== "undefined"
        ? window.location.pathname + window.location.search
        : pathname;

    router.replace(authEntryHref(returnPath, "login"));
  }, [bootstrapped, status, pathname, router]);

  return null;
}
