import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { execute, insert, queryOne } from "@/lib/db";
import type { AuthUser } from "@/lib/auth/types";
import { toAuthUser } from "@/lib/auth/nickname";

export const SESSION_COOKIE_NAME = "mm_session";
const SESSION_TTL_DAYS = 30;

/**
 * 生产环境默认 `Secure` Cookie（仅 HTTPS 有效）。
 * ECS/内网若用 HTTP 访问，浏览器会拒收或拒发 Cookie，表现为「刷新掉登录」。
 * 此时设置环境变量：`COOKIE_SECURE=false`
 * todo 有证书后这个安全配置需要删掉
 */
export function isSessionCookieSecure(): boolean {
  const v = process.env.COOKIE_SECURE?.toLowerCase();
  if (v === "false" || v === "0") return false;
  if (v === "true" || v === "1") return true;
  return process.env.NODE_ENV === "production";
}

interface UserSessionRow {
  user_id: number;
  username: string;
  nickname: string | null;
  expires_at: string;
}

export async function createSession(userId: number): Promise<string> {
  const token = randomBytes(48).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
  await insert(
    "INSERT INTO user_sessions (user_id, token, expires_at) VALUES (?, ?, ?)",
    [userId, token, expiresAt]
  );
  return token;
}

export async function deleteSession(token: string): Promise<void> {
  await execute("DELETE FROM user_sessions WHERE token = ?", [token]);
}

export async function getAuthUserFromCookie(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const row = await queryOne<UserSessionRow>(
    `SELECT s.user_id, u.username, u.nickname, s.expires_at
     FROM user_sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token = ?`,
    [token]
  );

  if (!row) return null;
  if (new Date(row.expires_at).getTime() <= Date.now()) {
    await deleteSession(token);
    return null;
  }

  return toAuthUser(row.user_id, row.username, row.nickname);
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: isSessionCookieSecure(),
    path: "/",
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: isSessionCookieSecure(),
    path: "/",
    maxAge: 0,
  });
}

export async function cleanExpiredSessions(): Promise<void> {
  await execute("DELETE FROM user_sessions WHERE expires_at <= NOW()");
}
