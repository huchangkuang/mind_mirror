/**
 * 中文文案集中管理，便于后续国际化扩展
 */
export const copy = {
  app: {
    title: "Mind Mirror - MBTI 性格测试",
    description: "简单有趣的 MBTI 性格测试",
  },
  home: {
    title: "探索你的性格类型",
    cta: "进入 MBTI 测试",
  },
  mbti: {
    landing: {
      title: "MBTI 性格测试",
      intro: "通过一系列简单题目，了解你在四个维度上的倾向：外向(E) / 内向(I)、实感(S) / 直觉(N)、思考(T) / 情感(F)、判断(J) / 知觉(P)，从而得到你的 MBTI 类型。",
      meta: "本测试共 4 题，约 2 分钟完成。请根据直觉选择最符合你的选项。",
      startTest: "开始测试",
      viewHistory: "查看历史记录",
    },
    test: {
      progress: "进度",
      next: "下一题",
      prev: "上一题",
      submit: "提交结果",
      restart: "重新开始",
      loading: "加载题目中…",
      noQuestions: "暂无题目，请稍后再试。",
      backHome: "返回首页",
    },
    result: {
      title: "你的 MBTI 类型",
      dimensionTitle: "维度分布",
      typeDescription: "类型说明",
      disclaimer: "本测试仅供娱乐与自我探索参考，不能替代专业心理评估或诊断。结果会随情境与时间变化，请理性看待。",
      backHome: "返回首页",
      retest: "再测一次",
      history: "历史记录",
      noResult: "暂无结果，请先完成测试。",
      goTest: "去测试",
    },
    history: {
      title: "历史记录",
      empty: "暂无测试记录，完成一次测试后会自动保存到这里。",
      goTest: "去测试",
      backHome: "返回首页",
      dimensionLabel: "维度分布",
    },
  },
} as const;
