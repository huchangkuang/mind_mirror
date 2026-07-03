/**
 * 验证 API 契约：questions 返回结构、submit 结果结构、错误格式约定
 */
import { loadQuestionBankFromFile } from "../load-questions";
import { computeMbtiResult } from "../scoring";
import type { MbtiQuestion } from "../types";

describe("API contract", () => {
  it("question bank has version, questionCount, estimatedMinutes, questions", async () => {
    const bank = await loadQuestionBankFromFile("quick");
    expect(bank.meta).toMatchObject({
      version: expect.any(String),
      questionCount: expect.any(Number),
      estimatedMinutes: expect.any(Number),
      mode: "quick",
      questionType: "binary",
    });
    expect(Array.isArray(bank.questions)).toBe(true);
    for (const q of bank.questions) {
      expect(q).toHaveProperty("id");
      expect(q).toHaveProperty("text");
      expect(q).toHaveProperty("options");
      expect(q).toHaveProperty("dimensionWeights");
      expect(q.dimensionWeights).toMatchObject({ EI: expect.any(Number), SN: expect.any(Number), TF: expect.any(Number), JP: expect.any(Number) });
    }
  });

  it("submit result has type, dimensionScores, dimensionStrength", () => {
    const questions: MbtiQuestion[] = [
      {
        id: "1",
        text: "?",
        dimensionWeights: { EI: 0, SN: 0, TF: 0, JP: 0 },
        options: [
          { value: "A", label: "A", dimensionWeights: { EI: 1, SN: 0, TF: 0, JP: 0 } },
          { value: "B", label: "B", dimensionWeights: { EI: -1, SN: 0, TF: 0, JP: 0 } },
        ],
      },
    ];
    const result = computeMbtiResult({ questions, answers: { "1": "A" } });
    expect(result).toHaveProperty("type");
    expect(result).toHaveProperty("dimensionScores");
    expect(result).toHaveProperty("dimensionStrength");
    expect(typeof result.type).toBe("string");
    expect(result.type.length).toBe(4);
  });

  it("deep mode supports likert answers", () => {
    const questions: MbtiQuestion[] = [
      {
        id: "1",
        text: "?",
        dimensionWeights: { EI: 0, SN: 0, TF: 0, JP: 0 },
        options: [
          { value: "1", label: "非常倾向左侧", dimensionWeights: { EI: 2, SN: 0, TF: 0, JP: 0 } },
          { value: "2", label: "比较倾向左侧", dimensionWeights: { EI: 1, SN: 0, TF: 0, JP: 0 } },
          { value: "3", label: "中立", dimensionWeights: { EI: 0, SN: 0, TF: 0, JP: 0 } },
          { value: "4", label: "比较倾向右侧", dimensionWeights: { EI: -1, SN: 0, TF: 0, JP: 0 } },
          { value: "5", label: "非常倾向右侧", dimensionWeights: { EI: -2, SN: 0, TF: 0, JP: 0 } },
        ],
      },
    ];
    const result = computeMbtiResult({ questions, answers: { "1": 1 }, mode: "deep" });
    expect(result.type.startsWith("E")).toBe(true);
  });
});
