import { NextRequest, NextResponse } from "next/server";
import { loadQuestionBankFromFile } from "@/lib/mbti/load-questions";
import { computeMbtiResult } from "@/lib/mbti/scoring";
import { apiErrorResponse, ERROR_CODES } from "@/lib/mbti/api-errors";
import type { MbtiTestMode } from "@/lib/mbti/types";

interface SubmitBody {
  version: string;
  mode: MbtiTestMode;
  answers: Record<string, string | number>;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiErrorResponse(400, ERROR_CODES.INVALID_PAYLOAD, "Invalid JSON body");
  }
  if (!body || typeof body !== "object") {
    return apiErrorResponse(400, ERROR_CODES.INVALID_PAYLOAD, "Missing body");
  }
  const { version, mode, answers } = body as SubmitBody;
  if (
    typeof version !== "string" ||
    (mode !== "quick" && mode !== "deep") ||
    !answers ||
    typeof answers !== "object"
  ) {
    return apiErrorResponse(400, ERROR_CODES.INVALID_PAYLOAD, "Missing or invalid version, mode, or answers");
  }

  let bank;
  try {
    bank = await loadQuestionBankFromFile(mode);
  } catch (e) {
    return apiErrorResponse(
      500,
      ERROR_CODES.QUESTION_BANK_LOAD_FAILED,
      e instanceof Error ? e.message : "Failed to load question bank"
    );
  }
  if (bank.meta.version !== version) {
    return apiErrorResponse(400, ERROR_CODES.VERSION_MISMATCH, "Question bank version does not match");
  }
  if (!isAnswersValidForMode(answers, mode)) {
    return apiErrorResponse(400, ERROR_CODES.INVALID_ANSWER_RANGE, "Answers do not match selected mode");
  }
  const result = computeMbtiResult({ questions: bank.questions, answers, mode });
  return NextResponse.json({
    type: result.type,
    dimensionScores: result.dimensionScores,
    dimensionStrength: result.dimensionStrength,
    summary: result.summary,
    mode,
  });
}

function isAnswersValidForMode(
  answers: Record<string, string | number>,
  mode: MbtiTestMode
): boolean {
  const values = Object.values(answers);
  if (mode === "quick") {
    return values.every((value) => value === "A" || value === "B");
  }
  return values.every((value) => {
    const num = typeof value === "number" ? value : Number(value);
    return Number.isInteger(num) && num >= 1 && num <= 5;
  });
}
