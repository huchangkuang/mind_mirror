export function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

export function validateNewPassword(password: string): string | null {
  if (!password) return "密码不能为空";
  if (password.length < 6 || password.length > 128) return "密码长度需在 6-128 个字符之间";
  return null;
}

export function validateCredentials(username: string, password: string): string | null {
  if (!username || !password) return "用户名和密码不能为空";
  if (username.length < 3 || username.length > 32) return "用户名长度需在 3-32 个字符之间";
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return "用户名仅支持字母、数字和下划线";
  const p = validateNewPassword(password);
  if (p) return p;
  return null;
}
