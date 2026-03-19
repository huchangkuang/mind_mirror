import { NextResponse } from "next/server";
import { getAuthUserFromCookie } from "@/lib/auth/session";
import { isFeedbackModerator } from "@/lib/feedback/admin";
import { execute, insert, queryOne } from "@/lib/db";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUserFromCookie();
    if (!user) {
      return NextResponse.json({ message: "请先登录" }, { status: 401 });
    }
    if (!isFeedbackModerator(user.username)) {
      return NextResponse.json({ message: "无权限删除" }, { status: 403 });
    }

    const { id: raw } = await context.params;
    const commentId = Number.parseInt(raw, 10);
    if (!Number.isFinite(commentId) || commentId <= 0) {
      return NextResponse.json({ message: "无效的评论 ID" }, { status: 400 });
    }

    const exists = await queryOne<{ id: number }>(
      "SELECT id FROM feedback_comments WHERE id = ?",
      [commentId]
    );
    if (!exists) {
      return NextResponse.json({ message: "评论不存在" }, { status: 404 });
    }

    await insert(
      "INSERT INTO feedback_moderation_log (actor_user_id, comment_id, action) VALUES (?, ?, ?)",
      [user.id, commentId, "delete"]
    );

    await execute("DELETE FROM feedback_comments WHERE id = ?", [commentId]);

    console.info(
      JSON.stringify({
        type: "feedback_moderation",
        action: "delete",
        actorUserId: user.id,
        actorUsername: user.username,
        commentId,
        at: new Date().toISOString(),
      })
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Feedback delete failed:", error);
    return NextResponse.json({ message: "删除失败" }, { status: 500 });
  }
}
