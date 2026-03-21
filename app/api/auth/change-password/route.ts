import { NextResponse } from "next/server";
import { execute, queryOne } from "@/lib/db";
import { getAuthUserFromCookie } from "@/lib/auth/session";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { validateNewPassword } from "@/lib/auth/validation";

export async function POST(request: Request) {
  try {
    const user = await getAuthUserFromCookie();
    if (!user) {
      return NextResponse.json({ message: "未登录" }, { status: 401 });
    }

    const body = (await request.json()) as { currentPassword?: string; newPassword?: string };
    const currentPassword = body.currentPassword ?? "";
    const newPassword = body.newPassword ?? "";

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: "当前密码和新密码不能为空" }, { status: 400 });
    }

    const pwdErr = validateNewPassword(newPassword);
    if (pwdErr) {
      return NextResponse.json({ message: pwdErr }, { status: 400 });
    }

    const row = await queryOne<{ password_hash: string }>(
      "SELECT password_hash FROM users WHERE id = ?",
      [user.id]
    );
    if (!row) {
      return NextResponse.json({ message: "用户不存在" }, { status: 404 });
    }

    if (!verifyPassword(currentPassword, row.password_hash)) {
      return NextResponse.json({ message: "当前密码不正确" }, { status: 401 });
    }

    await execute("UPDATE users SET password_hash = ? WHERE id = ?", [
      hashPassword(newPassword),
      user.id,
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Change password failed:", error);
    return NextResponse.json({ message: "修改失败，请稍后重试" }, { status: 500 });
  }
}
