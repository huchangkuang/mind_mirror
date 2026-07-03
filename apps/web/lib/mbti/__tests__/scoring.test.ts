import { computeMbtiResult } from "../scoring";
import type { MbtiQuestion } from "../types";

const sampleQuestions: MbtiQuestion[] = [
  {
    id: "q1",
    text: "聚会",
    dimensionWeights: { EI: 0, SN: 0, TF: 0, JP: 0 },
    options: [
      { value: "A", label: "多人", dimensionWeights: { EI: 1, SN: 0, TF: 0, JP: 0 } },
      { value: "B", label: "少数", dimensionWeights: { EI: -1, SN: 0, TF: 0, JP: 0 } },
    ],
  },
  {
    id: "q2",
    text: "决定",
    dimensionWeights: { EI: 0, SN: 0, TF: 0, JP: 0 },
    options: [
      { value: "A", label: "逻辑", dimensionWeights: { EI: 0, SN: 0, TF: 1, JP: 0 } },
      { value: "B", label: "感受", dimensionWeights: { EI: 0, SN: 0, TF: -1, JP: 0 } },
    ],
  },
  {
    id: "q3",
    text: "关注",
    dimensionWeights: { EI: 0, SN: 0, TF: 0, JP: 0 },
    options: [
      { value: "A", label: "细节", dimensionWeights: { EI: 0, SN: 1, TF: 0, JP: 0 } },
      { value: "B", label: "概念", dimensionWeights: { EI: 0, SN: -1, TF: 0, JP: 0 } },
    ],
  },
  {
    id: "q4",
    text: "节奏",
    dimensionWeights: { EI: 0, SN: 0, TF: 0, JP: 0 },
    options: [
      { value: "A", label: "有计划", dimensionWeights: { EI: 0, SN: 0, TF: 0, JP: 1 } },
      { value: "B", label: "随性", dimensionWeights: { EI: 0, SN: 0, TF: 0, JP: -1 } },
    ],
  },
];

describe("scoring", () => {
  it("returns same result for same answers (reproducible)", () => {
    const answers = { q1: "A", q2: "A", q3: "A", q4: "A" };
    const r1 = computeMbtiResult({ questions: sampleQuestions, answers });
    const r2 = computeMbtiResult({ questions: sampleQuestions, answers });
    expect(r1.type).toBe(r2.type);
    expect(r1.dimensionScores).toEqual(r2.dimensionScores);
    expect(r1.dimensionStrength).toEqual(r2.dimensionStrength);
  });

  it("computes MBTI type from dimension scores", () => {
    const answers = { q1: "A", q2: "A", q3: "A", q4: "A" };
    const r = computeMbtiResult({ questions: sampleQuestions, answers });
    expect(r.type).toBe("ESTJ");
    expect(r.dimensionScores).toEqual({ EI: 1, SN: 1, TF: 1, JP: 1 });
  });

  it("computes INFP when all B selected", () => {
    const answers = { q1: "B", q2: "B", q3: "B", q4: "B" };
    const r = computeMbtiResult({ questions: sampleQuestions, answers });
    expect(r.type).toBe("INFP");
    expect(r.dimensionScores).toEqual({ EI: -1, SN: -1, TF: -1, JP: -1 });
  });

  it("includes dimension strength 0-100", () => {
    const answers = { q1: "A", q2: "B", q3: "A", q4: "B" };
    const r = computeMbtiResult({ questions: sampleQuestions, answers });
    expect(r.dimensionStrength.EI).toBeGreaterThanOrEqual(0);
    expect(r.dimensionStrength.EI).toBeLessThanOrEqual(100);
    expect(r.type).toBe("ESFP");
  });
});
