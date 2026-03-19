import { loadQuestionBankFromFile } from "@/lib/mbti/load-questions";
import { apiErrorResponse, ERROR_CODES } from "@/lib/mbti/api-errors";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const modeParam = request.nextUrl.searchParams.get("mode");
  const mode = modeParam === "deep" ? "deep" : "quick";
  try {
    const bank = await loadQuestionBankFromFile(mode);
    return NextResponse.json({
      version: bank.meta.version,
      questionCount: bank.meta.questionCount,
      estimatedMinutes: bank.meta.estimatedMinutes,
      mode: bank.meta.mode,
      questionType: bank.meta.questionType,
      questions: bank.questions,
    });
  } catch (e) {
    return apiErrorResponse(
      500,
      ERROR_CODES.QUESTION_BANK_LOAD_FAILED,
      e instanceof Error ? e.message : "Failed to load question bank"
    );
  }
}
