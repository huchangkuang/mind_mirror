export interface AuthUser {
  id: number;
  username: string;
}

export type AuthStatus = "loading" | "authenticated" | "guest";
