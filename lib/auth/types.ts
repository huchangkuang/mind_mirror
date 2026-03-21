export interface AuthUser {
  id: number;
  username: string;
  /** 展示用昵称；未设置时与 username 相同 */
  nickname: string;
}

export type AuthStatus = "loading" | "authenticated" | "guest";
