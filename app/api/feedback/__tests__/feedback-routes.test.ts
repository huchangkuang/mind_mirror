import { GET as commentsGet, POST as commentsPost } from "@/app/api/feedback/comments/route";
import { POST as likePost } from "@/app/api/feedback/comments/[id]/like/route";
import { DELETE as commentDelete } from "@/app/api/feedback/comments/[id]/route";
import { getAuthUserFromCookie } from "@/lib/auth/session";
import { execute, insert, query, queryOne } from "@/lib/db";

jest.mock("@/lib/db", () => ({
  query: jest.fn(),
  queryOne: jest.fn(),
  insert: jest.fn(),
  execute: jest.fn(),
}));

jest.mock("@/lib/auth/session", () => ({
  getAuthUserFromCookie: jest.fn(),
}));

const mockedQuery = query as jest.MockedFunction<typeof query>;
const mockedQueryOne = queryOne as jest.MockedFunction<typeof queryOne>;
const mockedInsert = insert as jest.MockedFunction<typeof insert>;
const mockedExecute = execute as jest.MockedFunction<typeof execute>;
const mockedGetAuthUserFromCookie = getAuthUserFromCookie as jest.MockedFunction<
  typeof getAuthUserFromCookie
>;

describe("feedback routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET comments returns mapped list", async () => {
    mockedGetAuthUserFromCookie.mockResolvedValueOnce({ id: 2, username: "u2" });
    mockedQuery.mockResolvedValueOnce([
      {
        id: 1,
        body: "hello",
        created_at: "2025-01-01T00:00:00.000Z",
        username: "u1",
        like_count: 3,
        liked: 1,
      },
    ]);

    const res = await commentsGet(
      new Request("http://localhost/api/feedback/comments?sort=hot")
    );
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.comments).toHaveLength(1);
    expect(body.comments[0].likeCount).toBe(3);
    expect(body.comments[0].liked).toBe(true);
    expect(mockedQuery).toHaveBeenCalled();
  });

  it("POST comment requires login", async () => {
    mockedGetAuthUserFromCookie.mockResolvedValueOnce(null);

    const res = await commentsPost(
      new Request("http://localhost/api/feedback/comments", {
        method: "POST",
        body: JSON.stringify({ body: "x" }),
      })
    );

    expect(res.status).toBe(401);
  });

  it("POST like requires login", async () => {
    mockedGetAuthUserFromCookie.mockResolvedValueOnce(null);

    const res = await likePost(new Request("http://localhost"), {
      params: Promise.resolve({ id: "9" }),
    });

    expect(res.status).toBe(401);
  });

  it("DELETE comment rejects non-moderator", async () => {
    mockedGetAuthUserFromCookie.mockResolvedValueOnce({ id: 1, username: "user" });

    const res = await commentDelete(new Request("http://localhost"), {
      params: Promise.resolve({ id: "9" }),
    });

    expect(res.status).toBe(403);
  });

  it("DELETE comment allows moderator whitelist user", async () => {
    mockedGetAuthUserFromCookie.mockResolvedValueOnce({
      id: 99,
      username: "15967537583",
    });
    mockedQueryOne.mockResolvedValueOnce({ id: 9 });
    mockedInsert.mockResolvedValueOnce(1);
    mockedExecute.mockResolvedValueOnce(1);

    const res = await commentDelete(new Request("http://localhost"), {
      params: Promise.resolve({ id: "9" }),
    });

    expect(res.status).toBe(200);
    expect(mockedInsert).toHaveBeenCalled();
    expect(mockedExecute).toHaveBeenCalled();
  });
});
