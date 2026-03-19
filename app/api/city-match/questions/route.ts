import { loadQuestionBankFromFile } from "@/lib/city-match/load-questions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const modeParam = request.nextUrl.searchParams.get("mode");
  const mode = modeParam === "full" ? "full" : "quick";
  try {
    const bank = await loadQuestionBankFromFile(mode);
    return NextResponse.json({
      meta: {
        version: bank.meta.version,
        questionCount: bank.meta.questionCount,
        estimatedMinutes: bank.meta.estimatedMinutes,
        mode: bank.meta.mode,
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
