import { loadQuestionBankFromFile } from "@/lib/city-match/load-questions";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const bank = await loadQuestionBankFromFile();
    return NextResponse.json({
      meta: {
        version: bank.meta.version,
        questionCount: bank.meta.questionCount,
        estimatedMinutes: bank.meta.estimatedMinutes,
      },
      questions: bank.questions,
    });
  } catch (e) {
    return Response.json(
      {
        errorCode: "QUESTION_BANK_LOAD_FAILED",
        message: e instanceof Error ? e.message : "Failed to load question bank",
      },
      { status: 500 }
    );
  }
}
