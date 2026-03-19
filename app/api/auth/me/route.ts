import { NextResponse } from "next/server";
import { cleanExpiredSessions, getAuthUserFromCookie } from "@/lib/auth/session";
import { isFeedbackModerator } from "@/lib/feedback/admin";

export async function GET() {
  try {
    await cleanExpiredSessions();
    const user = await getAuthUserFromCookie();
    return NextResponse.json({
      authenticated: Boolean(user),
      user,
      isFeedbackModerator: user ? isFeedbackModerator(user.username) : false,
    });
  } catch (error) {
    console.error("Auth me failed:", error);
    return NextResponse.json(
      { authenticated: false, user: null, isFeedbackModerator: false },
      { status: 200 }
    );
  }
}
