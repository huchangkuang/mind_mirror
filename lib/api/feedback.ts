export type FeedbackSort = "hot" | "recent";

export interface FeedbackComment {
  id: number;
  body: string;
  createdAt: string;
  username: string;
  likeCount: number;
  liked: boolean;
}

export async function fetchFeedbackComments(sort: FeedbackSort): Promise<{
  comments: FeedbackComment[];
  sort: FeedbackSort;
}> {
  const res = await fetch(`/api/feedback/comments?sort=${sort}`, { credentials: "include" });
  const data = (await res.json().catch(() => ({}))) as {
    message?: string;
    comments?: FeedbackComment[];
    sort?: FeedbackSort;
  };
  if (!res.ok) {
    throw new Error(data.message || "加载评论失败");
  }
  return {
    comments: data.comments ?? [],
    sort: data.sort === "recent" ? "recent" : "hot",
  };
}

export async function postFeedbackComment(body: string): Promise<FeedbackComment> {
  const res = await fetch("/api/feedback/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ body }),
  });
  const data = (await res.json().catch(() => ({}))) as {
    message?: string;
    comment?: FeedbackComment;
  };
  if (!res.ok || !data.comment) {
    throw new Error(data.message || "发布失败");
  }
  return data.comment;
}

export async function toggleFeedbackLike(commentId: number): Promise<{ liked: boolean; likeCount: number }> {
  const res = await fetch(`/api/feedback/comments/${commentId}/like`, {
    method: "POST",
    credentials: "include",
  });
  const data = (await res.json().catch(() => ({}))) as {
    message?: string;
    liked?: boolean;
    likeCount?: number;
  };
  if (!res.ok) {
    throw new Error(data.message || "点赞失败");
  }
  return {
    liked: Boolean(data.liked),
    likeCount: Number(data.likeCount ?? 0),
  };
}

export async function deleteFeedbackComment(commentId: number): Promise<void> {
  const res = await fetch(`/api/feedback/comments/${commentId}`, {
    method: "DELETE",
    credentials: "include",
  });
  const data = (await res.json().catch(() => ({}))) as { message?: string };
  if (!res.ok) {
    throw new Error(data.message || "删除失败");
  }
}
