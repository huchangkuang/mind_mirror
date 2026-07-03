import { loadQuestionBankFromFile, validateQuestionBank } from "../load-questions";

describe("load-questions", () => {
  it("validates and parses quick mode question bank", async () => {
    const bank = await loadQuestionBankFromFile("quick");
    expect(bank.meta.version).toEqual(expect.any(String));
    expect(bank.meta.mode).toBe("quick");
    expect(bank.meta.questionType).toBe("binary");
    expect(bank.meta.questionCount).toBeGreaterThan(0);
    expect(bank.questions).toHaveLength(bank.meta.questionCount);
    expect(bank.questions[0].id).toBe("q1");
    expect(bank.questions[0].options).toHaveLength(2);
    const weights = bank.questions[0].options[0].dimensionWeights;
    const absSum = Math.abs(weights.EI) + Math.abs(weights.SN) + Math.abs(weights.TF) + Math.abs(weights.JP);
    expect(absSum).toBeGreaterThan(0);
  });

  it("builds deep mode question bank from same source", async () => {
    const bank = await loadQuestionBankFromFile("deep");
    expect(bank.meta.mode).toBe("deep");
    expect(bank.meta.questionType).toBe("likert5");
    expect(bank.questions.length).toBeGreaterThan(0);
    expect(bank.questions[0].options).toHaveLength(5);
    expect(bank.questions[0].options[0].value).toBe("1");
    expect(bank.questions[0].options[4].value).toBe("5");
  });

  it("throws on invalid meta", () => {
    expect(() => validateQuestionBank({ meta: {}, questions: [] })).toThrow("Invalid question bank meta");
  });

  it("throws on non-object", () => {
    expect(() => validateQuestionBank(null)).toThrow("Invalid question bank");
  });
});
