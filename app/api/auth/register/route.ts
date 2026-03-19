import { NextResponse } from "next/server";
import { insert, queryOne } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { createSession, setSessionCookie } from "@/lib/auth/session";
import { normalizeUsername, validateCredentials } from "@/lib/auth/validation";

interface UserRow {
  id: number;
  username: string;
  password_hash: string;
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

    const existing = await queryOne<UserRow>("SELECT id, username, password_hash FROM users WHERE username = ?", [
      username,
    ]);
    if (existing) {
      return NextResponse.json({ message: "用户名已存在" }, { status: 409 });
    }

    const userId = await insert("INSERT INTO users (username, password_hash) VALUES (?, ?)", [
      username,
      hashPassword(password),
    ]);

    const token = await createSession(userId);
    const response = NextResponse.json({ user: { id: userId, username } }, { status: 201 });
    setSessionCookie(response, token);
    return response;
  } catch (error) {
    console.error("Register failed:", error);
    return NextResponse.json({ message: "注册失败，请稍后重试" }, { status: 500 });
  }
}
