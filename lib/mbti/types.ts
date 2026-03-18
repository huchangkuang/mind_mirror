/**
 * MBTI 题目与题库类型（符合 mbti-question-bank 规范）
 * dimensionWeights 支持 EI、SN、TF、JP 四维度，数值可为正负或零。
 * 可选字段 category、tags 等便于扩展，消费方仅依赖必需字段。
 */
export type DimensionKey = "EI" | "SN" | "TF" | "JP";

export interface DimensionWeights {
  EI: number;
  SN: number;
  TF: number;
  JP: number;
}

export interface QuestionOption {
  value: string;
  label: string;
  /** 该选项对应的四维度权重，用于累加得分 */
  dimensionWeights: DimensionWeights;
}

export interface MbtiQuestion {
  id: string;
  text: string;
  options: QuestionOption[];
  /** 题目级别的维度信息（与 options[].dimensionWeights 一致即可，便于展示） */
  dimensionWeights: DimensionWeights;
  category?: string;
  tags?: string[];
}

export interface QuestionBankMeta {
  version: string;
  questionCount: number;
  estimatedMinutes: number;
}

export interface QuestionBank {
  meta: QuestionBankMeta;
  questions: MbtiQuestion[];
}
