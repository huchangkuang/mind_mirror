import { NextResponse } from "next/server";
import { getAuthUserFromCookie } from "@/lib/auth/session";
import { insert, query } from "@/lib/db";

const MAX_BODY = 2000;

type CommentRow = {
  id: number;
  body: string;
  created_at: Date | string;
  username: string;
  like_count: number;
  liked: number | boolean;
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const sort = url.searchParams.get("sort") === "recent" ? "recent" : "hot";
    const user = await getAuthUserFromCookie();
    const uid = user?.id ?? 0;

    const orderBy =
      sort === "recent"
        ? "ORDER BY c.created_at DESC"
        : `ORDER BY (
             (SELECT COUNT(*) FROM feedback_likes l WHERE l.comment_id = c.id)
             / POW(GREATEST(TIMESTAMPDIFF(HOUR, c.created_at, UTC_TIMESTAMP()), 0) + 2, 1.2)
           ) DESC, c.created_at DESC`;

    const rows = await query<CommentRow>(
      `SELECT c.id, c.body, c.created_at, u.username,
        (SELECT COUNT(*) FROM feedback_likes l WHERE l.comment_id = c.id) AS like_count,
        (SELECT COUNT(*) FROM feedback_likes l2 WHERE l2.comment_id = c.id AND l2.user_id = ?) > 0 AS liked
       FROM feedback_comments c
       JOIN users u ON u.id = c.user_id
       ${orderBy}`,
      [uid]
    );

    return NextResponse.json({
      comments: rows.map((r) => ({
        id: r.id,
        body: r.body,
        createdAt:
          r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
        username: r.username,
        likeCount: Number(r.like_count),
        liked: Boolean(r.liked),
      })),
      sort,
    });
  } catch (error) {
    console.error("Feedback list failed:", error);
    return NextResponse.json({ message: "加载失败" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUserFromCookie();
    if (!user) {
      return NextResponse.json({ message: "请先登录" }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ message: "无效的 JSON" }, { status: 400 });
    }

    const text =
      typeof body === "object" && body && "body" in body
        ? String((body as { body: unknown }).body)
        : "";
    const trimmed = text.trim();

    if (!trimmed) {
      return NextResponse.json({ message: "评论内容不能为空" }, { status: 400 });
    }
    if (trimmed.length > MAX_BODY) {
      return NextResponse.json({ message: `评论过长，最多 ${MAX_BODY} 字` }, { status: 400 });
    }

    const id = await insert("INSERT INTO feedback_comments (user_id, body) VALUES (?, ?)", [
      user.id,
      trimmed,
    ]);

    return NextResponse.json(
      {
        comment: {
          id,
          body: trimmed,
          createdAt: new Date().toISOString(),
          username: user.username,
          likeCount: 0,
          liked: false,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Feedback create failed:", error);
    return NextResponse.json({ message: "发布失败" }, { status: 500 });
  }
}
