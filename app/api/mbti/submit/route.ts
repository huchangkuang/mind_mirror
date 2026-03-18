import { NextRequest, NextResponse } from "next/server";
import { loadQuestionBankFromFile } from "@/lib/mbti/load-questions";
import { computeMbtiResult } from "@/lib/mbti/scoring";
import { apiErrorResponse, ERROR_CODES } from "@/lib/mbti/api-errors";

interface SubmitBody {
  version: string;
  answers: Record<string, string>;
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
  const { version, answers } = body as SubmitBody;
  if (typeof version !== "string" || !answers || typeof answers !== "object") {
    return apiErrorResponse(400, ERROR_CODES.INVALID_PAYLOAD, "Missing or invalid version or answers");
  }

  let bank;
  try {
    bank = await loadQuestionBankFromFile();
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
  const result = computeMbtiResult({ questions: bank.questions, answers });
  return NextResponse.json({
    type: result.type,
    dimensionScores: result.dimensionScores,
    dimensionStrength: result.dimensionStrength,
    summary: result.summary,
  });
}
