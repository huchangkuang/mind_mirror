import { loadQuestionBankFromFile } from "@/lib/mbti/load-questions";
import { apiErrorResponse, ERROR_CODES } from "@/lib/mbti/api-errors";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const bank = await loadQuestionBankFromFile();
    return NextResponse.json({
      version: bank.meta.version,
      questionCount: bank.meta.questionCount,
      estimatedMinutes: bank.meta.estimatedMinutes,
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
