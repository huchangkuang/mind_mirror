/**
 * 性格匹配城市测试类型定义
 */

// 四个维度
export type DimensionKey = "lifestyle" | "social" | "environment" | "pace";

// 维度权重
export interface DimensionWeights {
  lifestyle: number; // 生活方式: 传统(-) ←→ 现代(+)
  social: number;    // 社交偏好: 独处(-) ←→ 社交(+)
  environment: number; // 环境偏好: 自然(-) ←→ 都市(+)
  pace: number;      // 节奏偏好: 慢节奏(-) ←→ 快节奏(+)
}

// 题目选项
export interface QuestionOption {
  value: string;
  label: string;
  dimensionWeights: Partial<DimensionWeights>;
}

// 题目
export interface CityMatchQuestion {
  id: string;
  text: string;
  options: QuestionOption[];
}

// 题库元数据
export interface QuestionBankMeta {
  version: string;
  questionCount: number;
  estimatedMinutes: number;
}

// 题库
export interface QuestionBank {
  meta: QuestionBankMeta;
  questions: CityMatchQuestion[];
}

// 城市档案
export interface CityProfile {
  id: string;
  name: string;
  country: string;
  description: string;
  features: string[];
  dimensionProfile: DimensionWeights;
  image?: string;
}

// 维度得分
export interface DimensionScores {
  lifestyle: number;
  social: number;
  environment: number;
  pace: number;
}

// 城市匹配结果
export interface CityMatch {
  city: CityProfile;
  matchPercentage: number;
}

// 测试结果
export interface CityMatchResult {
  dimensionScores: DimensionScores;
  matches: CityMatch[];
  timestamp: number;
}

// 历史记录
export interface CityMatchHistoryRecord {
  timestamp: number;
  dimensionScores: DimensionScores;
  topCity: string;
  version?: string;
}
