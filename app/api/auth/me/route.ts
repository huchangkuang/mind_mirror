import { NextResponse } from "next/server";
import { cleanExpiredSessions, getAuthUserFromCookie } from "@/lib/auth/session";

export async function GET() {
  try {
    await cleanExpiredSessions();
    const user = await getAuthUserFromCookie();
    return NextResponse.json({
      authenticated: Boolean(user),
      user,
    });
  } catch (error) {
    console.error("Auth me failed:", error);
    return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
  }
}
