import type { MbtiQuestion, DimensionKey, MbtiTestMode } from "./types";

const DIMENSION_KEYS: DimensionKey[] = ["EI", "SN", "TF", "JP"];
const POSITIVE_LETTERS = { EI: "E", SN: "S", TF: "T", JP: "J" } as const;
const NEGATIVE_LETTERS = { EI: "I", SN: "N", TF: "F", JP: "P" } as const;

export interface MbtiResult {
  type: string;
  dimensionScores: Record<DimensionKey, number>;
  dimensionStrength: Record<DimensionKey, number>;
  summary?: string;
}

export interface ScoreInput {
  questions: MbtiQuestion[];
  answers: Record<string, string | number>;
  mode?: MbtiTestMode;
}

/**
 * 根据答题记录与题库计算 MBTI 类型与维度强度。
 * 同一份答案多次调用返回一致结果（可重复、可测）。
 */
export function computeMbtiResult(input: ScoreInput): MbtiResult {
  const { questions, answers } = input;
  const dimensionScores: Record<DimensionKey, number> = { EI: 0, SN: 0, TF: 0, JP: 0 };

  for (const q of questions) {
    const selectedValue = answers[q.id];
    if (selectedValue == null) continue;
    const option = q.options.find((o) => o.value === String(selectedValue));
    if (!option) continue;
    for (const key of DIMENSION_KEYS) {
      dimensionScores[key] += option.dimensionWeights[key];
    }
  }

  const dimensionStrength = computeStrength(dimensionScores, questions);
  const type = DIMENSION_KEYS.map((key) =>
    dimensionScores[key] > 0 ? POSITIVE_LETTERS[key] : dimensionScores[key] < 0 ? NEGATIVE_LETTERS[key] : POSITIVE_LETTERS[key]
  ).join("");

  return { type, dimensionScores, dimensionStrength, summary: undefined };
}

function computeStrength(
  dimensionScores: Record<DimensionKey, number>,
  questions: MbtiQuestion[]
): Record<DimensionKey, number> {
  const maxAbs: Record<DimensionKey, number> = { EI: 0, SN: 0, TF: 0, JP: 0 };
  for (const q of questions) {
    for (const opt of q.options) {
      for (const key of DIMENSION_KEYS) {
        const abs = Math.abs(opt.dimensionWeights[key]);
        if (abs > maxAbs[key]) maxAbs[key] = abs;
      }
    }
  }
  const totalMax: Record<DimensionKey, number> = { EI: 0, SN: 0, TF: 0, JP: 0 };
  for (const key of DIMENSION_KEYS) {
    totalMax[key] = maxAbs[key] * questions.length;
  }

  const dimensionStrength: Record<DimensionKey, number> = { EI: 50, SN: 50, TF: 50, JP: 50 };
  for (const key of DIMENSION_KEYS) {
    const score = dimensionScores[key];
    const cap = totalMax[key] || 1;
    const ratio = score / cap;
    dimensionStrength[key] = Math.round(50 + ratio * 50);
    dimensionStrength[key] = Math.max(0, Math.min(100, dimensionStrength[key]));
  }
  return dimensionStrength;
}
