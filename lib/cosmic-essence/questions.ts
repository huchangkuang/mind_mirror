import type { CosmicQuestion } from "./types";

export const COSMIC_QUESTIONS: readonly CosmicQuestion[] = [
  {
    id: 1,
    prompt: "深夜航行：前方出现巨大粉色星云",
    options: [
      { letter: "A", text: "立刻加速靠近拍照", dimension: "N" },
      { letter: "B", text: "分析成分", dimension: "IT" },
      { letter: "C", text: "呼叫附近船只分享", dimension: "EF" },
    ],
  },
  {
    id: 2,
    prompt: "降落异星：地面像透明果冻",
    options: [
      { letter: "A", text: "脱鞋踩上去感受", dimension: "EF" },
      { letter: "B", text: "丢石头测试硬度", dimension: "IT" },
      { letter: "C", text: "思考星球重力逻辑", dimension: "N" },
    ],
  },
  {
    id: 3,
    prompt: "星球旋律：低频的嗡鸣声",
    options: [
      { letter: "A", text: "古文明求救信号", dimension: "N" },
      { letter: "B", text: "机械运转底噪", dimension: "IT" },
      { letter: "C", text: "星球呼吸的节奏", dimension: "EF" },
    ],
  },
  {
    id: 4,
    prompt: "记忆碎片：大气层让你想起往事",
    options: [
      { letter: "A", text: "夏日午后欢笑", dimension: "EF" },
      { letter: "B", text: "解开难题的成就感", dimension: "IT" },
      { letter: "C", text: "未对人说的幻想", dimension: "N" },
    ],
  },
  {
    id: 5,
    prompt: "物资采集：发现发光晶体",
    options: [
      { letter: "A", text: "放在实验室分析", dimension: "IT" },
      { letter: "B", text: "当做夜灯陪睡", dimension: "EF" },
      { letter: "C", text: "随手送给陌生生命", dimension: "N" },
    ],
  },
  {
    id: 6,
    prompt: "能量补给：需要手动接线",
    options: [
      { letter: "A", text: "严格按说明书操作", dimension: "IT" },
      { letter: "B", text: "凭感觉尝试组合", dimension: "N" },
      { letter: "C", text: "边哼歌边处理", dimension: "EF" },
    ],
  },
  {
    id: 7,
    prompt: "突发通讯：收到一句跨时空赞美",
    options: [
      { letter: "A", text: "觉得有趣想回信", dimension: "EF" },
      { letter: "B", text: "警惕是否为诱捕", dimension: "IT" },
      { letter: "C", text: "感叹时空的浪漫", dimension: "N" },
    ],
  },
  {
    id: 8,
    prompt: "返航时刻：你想留下什么？",
    options: [
      { letter: "A", text: "你的名字缩写", dimension: "EF" },
      { letter: "B", text: "一组坐标数据", dimension: "IT" },
      { letter: "C", text: "一粒地球的种子", dimension: "N" },
    ],
  },
] as const;
