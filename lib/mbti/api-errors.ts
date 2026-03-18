/**
 * 统一 API 错误返回结构（errorCode + message）
 */
export interface ApiErrorBody {
  errorCode: string;
  message: string;
}

export const ERROR_CODES = {
  INVALID_PAYLOAD: "INVALID_PAYLOAD",
  QUESTION_BANK_LOAD_FAILED: "QUESTION_BANK_LOAD_FAILED",
  VERSION_MISMATCH: "VERSION_MISMATCH",
} as const;

export function apiErrorResponse(status: number, errorCode: string, message: string): Response {
  return Response.json({ errorCode, message } satisfies ApiErrorBody, { status });
}
