import type { CityMatchQuestion, DimensionScores, CityMatch, CityMatchResult } from "./types";
import { citiesData } from "./cities-data";

const DIMENSION_KEYS: Array<keyof DimensionScores> = ["lifestyle", "social", "environment", "pace"];

export interface ScoreInput {
  questions: CityMatchQuestion[];
  answers: Record<string, string>;
}

/**
 * 计算用户的维度得分
 * 每个维度的得分范围: -100 到 +100
 */
export function computeDimensionScores(input: ScoreInput): DimensionScores {
  const { questions, answers } = input;

  const rawScores: DimensionScores = {
    lifestyle: 0,
    social: 0,
    environment: 0,
    pace: 0,
  };

  // 累加所有选择的维度权重
  for (const q of questions) {
    const selectedValue = answers[q.id];
    if (!selectedValue) continue;

    const option = q.options.find((o) => o.value === selectedValue);
    if (!option || !option.dimensionWeights) continue;

    for (const key of DIMENSION_KEYS) {
      const weight = option.dimensionWeights[key];
      if (typeof weight === "number") {
        rawScores[key] += weight;
      }
    }
  }

  // 计算每个维度的最大可能得分（用于归一化）
  const maxAbs: DimensionScores = { lifestyle: 0, social: 0, environment: 0, pace: 0 };
  for (const q of questions) {
    for (const opt of q.options) {
      if (!opt.dimensionWeights) continue;
      for (const key of DIMENSION_KEYS) {
        const weight = opt.dimensionWeights[key];
        if (typeof weight === "number") {
          maxAbs[key] = Math.max(maxAbs[key], Math.abs(weight));
        }
      }
    }
  }

  // 归一化到 -100 到 +100 范围
  const normalizedScores: DimensionScores = { lifestyle: 0, social: 0, environment: 0, pace: 0 };
  for (const key of DIMENSION_KEYS) {
    const maxPossible = maxAbs[key] * questions.length;
    if (maxPossible === 0) {
      normalizedScores[key] = 0;
    } else {
      const ratio = rawScores[key] / maxPossible;
      normalizedScores[key] = Math.round(ratio * 100);
      // 限制在 -100 到 100 范围内
      normalizedScores[key] = Math.max(-100, Math.min(100, normalizedScores[key]));
    }
  }

  return normalizedScores;
}

/**
 * 计算两个维度向量之间的余弦相似度
 * 返回 -1 到 1 之间的值
 */
function cosineSimilarity(a: DimensionScores, b: DimensionScores): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (const key of DIMENSION_KEYS) {
    dotProduct += a[key] * b[key];
    normA += a[key] * a[key];
    normB += b[key] * b[key];
  }

  if (normA === 0 || normB === 0) return 0;

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * 将余弦相似度转换为百分比匹配度 (0-100%)
 * 余弦相似度范围 -1 到 1，转换为 0 到 100
 */
function similarityToPercentage(similarity: number): number {
  // 将 -1~1 映射到 0~100
  return Math.round(((similarity + 1) / 2) * 100);
}

/**
 * 匹配用户维度档案与城市档案
 * 返回 TOP 3 匹配城市
 */
export function matchCities(dimensionScores: DimensionScores): CityMatch[] {
  const matches: CityMatch[] = citiesData.map((city) => {
    const similarity = cosineSimilarity(dimensionScores, city.dimensionProfile);
    const matchPercentage = similarityToPercentage(similarity);

    return {
      city,
      matchPercentage,
    };
  });

  // 按匹配度降序排序，取前 3 个
  return matches
    .sort((a, b) => b.matchPercentage - a.matchPercentage)
    .slice(0, 3);
}

/**
 * 计算完整的城市匹配测试结果
 */
export function computeCityMatchResult(input: ScoreInput): CityMatchResult {
  const dimensionScores = computeDimensionScores(input);
  const matches = matchCities(dimensionScores);

  return {
    dimensionScores,
    matches,
    timestamp: Date.now(),
  };
}

/**
 * 获取维度标签（用于展示）
 */
export function getDimensionLabel(key: keyof DimensionScores): { left: string; right: string } {
  const labels: Record<keyof DimensionScores, { left: string; right: string }> = {
    lifestyle: { left: "传统保守", right: "现代开放" },
    social: { left: "独处内向", right: "社交外向" },
    environment: { left: "自然宁静", right: "都市繁华" },
    pace: { left: "慢节奏", right: "快节奏" },
  };

  return labels[key];
}

/**
 * 将维度得分转换为可视化百分比 (0-100%)
 * -100 → 0%, 0 → 50%, +100 → 100%
 */
export function scoreToPercentage(score: number): number {
  return Math.round((score + 100) / 2);
}
