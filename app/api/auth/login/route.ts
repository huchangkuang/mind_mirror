import { NextResponse } from "next/server";
import { queryOne } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { cleanExpiredSessions, createSession, setSessionCookie } from "@/lib/auth/session";
import { normalizeUsername, validateCredentials } from "@/lib/auth/validation";
import { isFeedbackModerator } from "@/lib/feedback/admin";
import { toAuthUser } from "@/lib/auth/nickname";

interface UserRow {
  id: number;
  username: string;
  password_hash: string;
  nickname: string | null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { username?: string; password?: string };
    const username = normalizeUsername(body.username ?? "");
    const password = body.password ?? "";

    const validationError = validateCredentials(username, password);
    if (validationError) {
      return NextResponse.json({ message: validationError }, { status: 400 });
    }

    await cleanExpiredSessions();
    const user = await queryOne<UserRow>(
      "SELECT id, username, password_hash, nickname FROM users WHERE username = ?",
      [username]
    );

    if (!user || !verifyPassword(password, user.password_hash)) {
      return NextResponse.json({ message: "用户名或密码错误" }, { status: 401 });
    }

    const token = await createSession(user.id);
    const response = NextResponse.json({
      user: toAuthUser(user.id, user.username, user.nickname),
      isFeedbackModerator: isFeedbackModerator(user.username),
    });
    setSessionCookie(response, token);
    return response;
  } catch (error) {
    console.error("Login failed:", error);
    return NextResponse.json({ message: "登录失败，请稍后重试" }, { status: 500 });
  }
}
