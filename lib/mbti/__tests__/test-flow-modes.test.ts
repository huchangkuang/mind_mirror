import { validateQuestionBank } from "../load-questions";
import { computeMbtiResult } from "../scoring";
import * as fs from "fs/promises";
import * as path from "path";

describe("mbti test flow modes", () => {
  it("quick/deep 两种模式都可完整走通", async () => {
    const filePath = path.join(process.cwd(), "data", "mbti", "questions.json");
    const raw = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(raw);

    const quickBank = validateQuestionBank(data, "quick");
    const deepBank = validateQuestionBank(data, "deep");

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
