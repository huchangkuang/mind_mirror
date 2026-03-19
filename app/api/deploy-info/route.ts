import { readFileSync } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { isSessionCookieSecure } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

/**
 * 用于确认线上跑的是哪次构建（BUILD_ID），以及会话 Cookie 是否按预期带 Secure。
 * 不含密钥；部署时可设置 APP_GIT_COMMIT 便于对照 Git。
 */
export async function GET() {
  let buildId: string | null = null;
  try {
    buildId = readFileSync(path.join(process.cwd(), ".next", "BUILD_ID"), "utf8").trim();
  } catch {
    buildId = null;
  }

  return NextResponse.json({
    buildId,
    nodeEnv: process.env.NODE_ENV ?? null,
    gitCommit: process.env.APP_GIT_COMMIT ?? process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    sessionCookieSecure: isSessionCookieSecure(),
  });
}
