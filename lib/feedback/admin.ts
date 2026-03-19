/**
 * 反馈区管理员白名单（用户名与注册时一致，例如手机号账号）。
 * 后续可迁移至数据库角色或后台配置。
 */
export const FEEDBACK_MODERATOR_USERNAMES = new Set<string>(["15967537583"]);

export function isFeedbackModerator(username: string | null | undefined): boolean {
  if (!username) return false;
  return FEEDBACK_MODERATOR_USERNAMES.has(username.trim());
}
