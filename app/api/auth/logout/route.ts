import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { clearSessionCookie, deleteSession, SESSION_COOKIE_NAME } from "@/lib/auth/session";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (token) {
      await deleteSession(token);
    }

    const response = NextResponse.json({ ok: true });
    clearSessionCookie(response);
    return response;
  } catch (error) {
    console.error("Logout failed:", error);
    return NextResponse.json({ message: "登出失败，请稍后重试" }, { status: 500 });
  }
}
