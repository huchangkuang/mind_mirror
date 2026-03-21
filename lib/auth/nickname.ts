import type { AuthUser } from "@/lib/auth/types";

const NICKNAME_MAX_CHARS = 32;

/** 展示昵称：库中为 NULL 或仅空白时等同于登录账号 */
export function resolveDisplayNickname(username: string, nickname: string | null | undefined): string {
  const n = nickname?.trim();
  if (!n) return username;
  return n;
}

export function validateNickname(raw: string): string | null {
  const t = raw.trim();
  if (!t) return "昵称不能为空";
  const len = [...t].length;
  if (len > NICKNAME_MAX_CHARS) return `昵称长度不能超过 ${NICKNAME_MAX_CHARS} 个字符`;
  if (!/^[\p{L}\p{N}\s\-_.·]+$/u.test(t)) {
    return "昵称仅支持字母、数字、空格与 - _ . · 等符号";
  }
  return null;
}

export function toAuthUser(
  id: number,
  username: string,
  nicknameDb: string | null | undefined
): AuthUser {
  return {
    id,
    username,
    nickname: resolveDisplayNickname(username, nicknameDb),
  };
}
