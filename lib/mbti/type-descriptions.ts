/**
 * 16 型 MBTI 简要说明（中文），供结果页展示
 */
export const MBTI_TYPE_DESCRIPTIONS: Record<string, { title: string; summary: string }> = {
  INTJ: { title: "建筑师", summary: "独立、战略思维、追求完美与效率，善于长远规划。" },
  INTP: { title: "逻辑学家", summary: "好奇、分析力强、喜欢抽象概念与理论体系。" },
  ENTJ: { title: "指挥官", summary: "果断、有领导力、目标导向，善于组织与决策。" },
  ENTP: { title: "辩论家", summary: "创意多、善于辩论、喜欢挑战与探索新可能。" },
  INFJ: { title: "提倡者", summary: "理想主义、洞察力强、关心他人与意义。" },
  INFP: { title: "调停者", summary: "敏感、价值观鲜明、追求和谐与自我实现。" },
  ENFJ: { title: "主人公", summary: "热情、善于激励他人、重视关系与成长。" },
  ENFP: { title: "竞选者", summary: "热情、富有想象力、喜欢与人连接与探索。" },
  ISTJ: { title: "物流师", summary: "务实、负责、注重事实与秩序。" },
  ISFJ: { title: "守卫者", summary: "体贴、忠诚、善于照顾他人与维护传统。" },
  ESTJ: { title: "总经理", summary: "组织力强、直接、重视规则与效率。" },
  ESFJ: { title: "执政官", summary: "热心、合作、重视和谐与集体。" },
  ISTP: { title: "鉴赏家", summary: "冷静、动手能力强、喜欢分析与实操。" },
  ISFP: { title: "探险家", summary: "温和、审美敏锐、活在当下、随和。" },
  ESTP: { title: "企业家", summary: "行动派、适应力强、喜欢冒险与即时反馈。" },
  ESFP: { title: "表演者", summary: "活泼、爱玩、乐于助人、享受当下。" },
};

export function getTypeDescription(type: string): { title: string; summary: string } {
  const t = type.toUpperCase();
  return MBTI_TYPE_DESCRIPTIONS[t] ?? { title: t, summary: "这是你的 MBTI 类型，可结合各维度强度进一步理解。" };
}
