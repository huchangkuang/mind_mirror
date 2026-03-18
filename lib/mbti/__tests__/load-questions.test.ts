import { validateQuestionBank } from "../load-questions";
import * as fs from "fs/promises";
import * as path from "path";

describe("load-questions", () => {
  it("validates and parses question bank JSON with meta and questions", async () => {
    const filePath = path.join(process.cwd(), "data", "mbti", "questions.json");
    const raw = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(raw);
    const bank = validateQuestionBank(data);
    expect(bank.meta.version).toBe("1.0.0");
    expect(bank.meta.questionCount).toBe(4);
    expect(bank.meta.estimatedMinutes).toBe(2);
    expect(bank.questions).toHaveLength(4);
    expect(bank.questions[0].id).toBe("q1");
    expect(bank.questions[0].text).toBe("在聚会中，你通常更倾向于");
    expect(bank.questions[0].options).toHaveLength(2);
    expect(bank.questions[0].options[0].dimensionWeights.EI).toBe(1);
  });

  it("throws on invalid meta", () => {
    expect(() => validateQuestionBank({ meta: {}, questions: [] })).toThrow("Invalid question bank meta");
  });

  it("throws on non-object", () => {
    expect(() => validateQuestionBank(null)).toThrow("Invalid question bank");
  });
});
