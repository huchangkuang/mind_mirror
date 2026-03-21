import { NextResponse } from "next/server";
import { execute, queryOne } from "@/lib/db";
import { getAuthUserFromCookie } from "@/lib/auth/session";
import { toAuthUser, validateNickname } from "@/lib/auth/nickname";

export async function PATCH(request: Request) {
  try {
    const user = await getAuthUserFromCookie();
    if (!user) {
      return NextResponse.json({ message: "未登录" }, { status: 401 });
    }

    const body = (await request.json()) as { nickname?: string };
    const raw = body.nickname ?? "";
    const err = validateNickname(raw);
    if (err) {
      return NextResponse.json({ message: err }, { status: 400 });
    }

    const trimmed = raw.trim();
    await execute("UPDATE users SET nickname = ? WHERE id = ?", [trimmed, user.id]);

    const row = await queryOne<{ username: string; nickname: string | null }>(
      "SELECT username, nickname FROM users WHERE id = ?",
      [user.id]
    );
    if (!row) {
      return NextResponse.json({ message: "用户不存在" }, { status: 404 });
    }

    return NextResponse.json({
      user: toAuthUser(user.id, row.username, row.nickname),
    });
  } catch (error) {
    console.error("Update profile failed:", error);
    return NextResponse.json({ message: "更新失败，请稍后重试" }, { status: 500 });
  }
}
