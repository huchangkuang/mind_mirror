import { loadQuestionBankFromFile } from "../load-questions";
import { computeMbtiResult } from "../scoring";

describe("mbti test flow modes", () => {
  it("quick/deep 两种模式都可完整走通", async () => {
    const quickBank = await loadQuestionBankFromFile("quick");
    const deepBank = await loadQuestionBankFromFile("deep");

    expect(quickBank.meta.mode).toBe("quick");
    expect(deepBank.meta.mode).toBe("deep");
    expect(quickBank.questions.length).toBeGreaterThan(0);
    expect(deepBank.questions.length).toBeGreaterThan(0);

    const quickAnswers = Object.fromEntries(quickBank.questions.map((q) => [q.id, "A"]));
    const deepAnswers = Object.fromEntries(deepBank.questions.map((q) => [q.id, 3]));

    const quickResult = computeMbtiResult({
      mode: "quick",
      questions: quickBank.questions,
      answers: quickAnswers,
    });
    const deepResult = computeMbtiResult({
      mode: "deep",
      questions: deepBank.questions,
      answers: deepAnswers,
    });

    expect(quickResult.type).toHaveLength(4);
    expect(deepResult.type).toHaveLength(4);
    expect(quickResult.dimensionStrength.EI).toBeGreaterThanOrEqual(0);
    expect(deepResult.dimensionStrength.EI).toBeGreaterThanOrEqual(0);
  });
});
