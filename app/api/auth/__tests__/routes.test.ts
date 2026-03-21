import { POST as registerPost } from "@/app/api/auth/register/route";
import { POST as loginPost } from "@/app/api/auth/login/route";
import { POST as logoutPost } from "@/app/api/auth/logout/route";
import { GET as meGet } from "@/app/api/auth/me/route";
import { queryOne, insert } from "@/lib/db";
import {
  cleanExpiredSessions,
  createSession,
  deleteSession,
  getAuthUserFromCookie,
  setSessionCookie,
} from "@/lib/auth/session";
import { verifyPassword } from "@/lib/auth/password";
import { cookies } from "next/headers";

jest.mock("@/lib/db", () => ({
  queryOne: jest.fn(),
  insert: jest.fn(),
  execute: jest.fn(),
}));

jest.mock("@/lib/auth/session", () => ({
  cleanExpiredSessions: jest.fn(),
  createSession: jest.fn(),
  deleteSession: jest.fn(),
  getAuthUserFromCookie: jest.fn(),
  setSessionCookie: jest.fn(),
  clearSessionCookie: jest.fn(),
  SESSION_COOKIE_NAME: "mm_session",
}));

jest.mock("@/lib/auth/password", () => ({
  hashPassword: jest.fn(() => "salt:hash"),
  verifyPassword: jest.fn(),
}));

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

const mockedQueryOne = queryOne as jest.MockedFunction<typeof queryOne>;
const mockedInsert = insert as jest.MockedFunction<typeof insert>;
const mockedCreateSession = createSession as jest.MockedFunction<typeof createSession>;
const mockedSetSessionCookie = setSessionCookie as jest.MockedFunction<typeof setSessionCookie>;
const mockedVerifyPassword = verifyPassword as jest.MockedFunction<typeof verifyPassword>;
const mockedCleanExpiredSessions = cleanExpiredSessions as jest.MockedFunction<typeof cleanExpiredSessions>;
const mockedGetAuthUserFromCookie = getAuthUserFromCookie as jest.MockedFunction<typeof getAuthUserFromCookie>;
const mockedDeleteSession = deleteSession as jest.MockedFunction<typeof deleteSession>;
const mockedCookies = cookies as jest.MockedFunction<typeof cookies>;

describe("auth routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedCookies.mockResolvedValue({
      get: jest.fn(() => undefined),
    } as unknown as Awaited<ReturnType<typeof cookies>>);
  });

  it("register success creates session and cookie", async () => {
    mockedQueryOne.mockResolvedValueOnce(null);
    mockedInsert.mockResolvedValueOnce(1001);
    mockedCreateSession.mockResolvedValueOnce("token-1");

    const req = new Request("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ username: "new_user", password: "password123" }),
    });
    const res = await registerPost(req);
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.user).toEqual({ id: 1001, username: "new_user", nickname: "new_user" });
    expect(body.isFeedbackModerator).toBe(false);
    expect(mockedSetSessionCookie).toHaveBeenCalled();
  });

  it("login invalid password returns 401", async () => {
    mockedCleanExpiredSessions.mockResolvedValueOnce(undefined);
    mockedQueryOne.mockResolvedValueOnce({
      id: 1,
      username: "user1",
      password_hash: "salt:hash",
      nickname: null,
    });
    mockedVerifyPassword.mockReturnValueOnce(false);

    const req = new Request("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username: "user1", password: "wrong123" }),
    });
    const res = await loginPost(req);

    expect(res.status).toBe(401);
  });

  it("logout handles missing token safely", async () => {
    const res = await logoutPost();
    expect(res.status).toBe(200);
    expect(mockedDeleteSession).not.toHaveBeenCalled();
  });

  it("me returns authenticated user payload", async () => {
    mockedCleanExpiredSessions.mockResolvedValueOnce(undefined);
    mockedGetAuthUserFromCookie.mockResolvedValueOnce({
      id: 9,
      username: "alice",
      nickname: "Alice",
    });

    const res = await meGet();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.authenticated).toBe(true);
    expect(body.user).toEqual({ id: 9, username: "alice", nickname: "Alice" });
    expect(body.isFeedbackModerator).toBe(false);
  });

  it("me marks feedback moderator for whitelist username", async () => {
    mockedCleanExpiredSessions.mockResolvedValueOnce(undefined);
    mockedGetAuthUserFromCookie.mockResolvedValueOnce({
      id: 1,
      username: "15967537583",
      nickname: "15967537583",
    });

    const res = await meGet();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.isFeedbackModerator).toBe(true);
  });
});
