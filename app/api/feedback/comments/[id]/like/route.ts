import { NextResponse } from "next/server";
import { getAuthUserFromCookie } from "@/lib/auth/session";
import { execute, insert, queryOne } from "@/lib/db";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUserFromCookie();
    if (!user) {
      return NextResponse.json({ message: "请先登录" }, { status: 401 });
    }

    const { id: raw } = await context.params;
    const commentId = Number.parseInt(raw, 10);
    if (!Number.isFinite(commentId) || commentId <= 0) {
      return NextResponse.json({ message: "无效的评论 ID" }, { status: 400 });
    }

    const comment = await queryOne<{ id: number }>(
      "SELECT id FROM feedback_comments WHERE id = ?",
      [commentId]
    );
    if (!comment) {
      return NextResponse.json({ message: "评论不存在" }, { status: 404 });
    }

    const existing = await queryOne<{ id: number }>(
      "SELECT id FROM feedback_likes WHERE comment_id = ? AND user_id = ?",
      [commentId, user.id]
    );

    if (existing) {
      await execute("DELETE FROM feedback_likes WHERE id = ?", [existing.id]);
    } else {
      await insert("INSERT INTO feedback_likes (comment_id, user_id) VALUES (?, ?)", [
        commentId,
        user.id,
      ]);
    }

    const likeCountRow = await queryOne<{ c: number }>(
      "SELECT COUNT(*) AS c FROM feedback_likes WHERE comment_id = ?",
      [commentId]
    );

    return NextResponse.json({
      liked: !existing,
      likeCount: Number(likeCountRow?.c ?? 0),
    });
  } catch (error) {
    console.error("Feedback like toggle failed:", error);
    return NextResponse.json({ message: "操作失败" }, { status: 500 });
  }
}
