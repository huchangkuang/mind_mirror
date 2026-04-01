import { apiFetch, getApiErrorMessage, readJsonBody } from "@/lib/api/client";

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
  const res = await apiFetch(`/api/feedback/comments?sort=${sort}`);
  const data = (await readJsonBody<{
    message?: string;
    comments?: FeedbackComment[];
    sort?: FeedbackSort;
  }>(res)) ?? {};
  if (!res.ok) {
    throw new Error(getApiErrorMessage(data, "加载评论失败"));
  }
  return {
    comments: data.comments ?? [],
    sort: data.sort === "recent" ? "recent" : "hot",
  };
}

export async function postFeedbackComment(body: string): Promise<FeedbackComment> {
  const res = await apiFetch("/api/feedback/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body }),
  });
  const data = (await readJsonBody<{
    message?: string;
    comment?: FeedbackComment;
  }>(res)) ?? {};
  if (!res.ok || !data.comment) {
    throw new Error(getApiErrorMessage(data, "发布失败"));
  }
  return data.comment;
}

export async function toggleFeedbackLike(commentId: number): Promise<{ liked: boolean; likeCount: number }> {
  const res = await apiFetch(`/api/feedback/comments/${commentId}/like`, {
    method: "POST",
  });
  const data = (await readJsonBody<{
    message?: string;
    liked?: boolean;
    likeCount?: number;
  }>(res)) ?? {};
  if (!res.ok) {
    throw new Error(getApiErrorMessage(data, "点赞失败"));
  }
  return {
    liked: Boolean(data.liked),
    likeCount: Number(data.likeCount ?? 0),
  };
}

export async function deleteFeedbackComment(commentId: number): Promise<void> {
  const res = await apiFetch(`/api/feedback/comments/${commentId}`, {
    method: "DELETE",
  });
  const data = (await readJsonBody<{ message?: string }>(res)) ?? {};
  if (!res.ok) {
    throw new Error(getApiErrorMessage(data, "删除失败"));
  }
}
