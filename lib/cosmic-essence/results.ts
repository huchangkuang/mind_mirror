import type { CosmicResultId } from "./types";

export interface CosmicResultCopy {
  id: CosmicResultId;
  name: string;
  keywords: string[];
  soul: string;
  rarityLabel: string;
  affinityName: string;
  /** 主色（UI 与海报色块，使用实色以利于 html2canvas） */
  primaryHex: string;
  /** 次要渐变/点缀 */
  accentHex: string;
}

export const COSMIC_RESULTS: Record<CosmicResultId, CosmicResultCopy> = {
  "solar-flare-red": {
    id: "solar-flare-red",
    name: "恒星爆发红",
    keywords: ["极速", "灼热", "生命力"],
    soul: "你是自带引力的中心。世界对你来说是游乐场，你的字典里没有「被动」二字。",
    rarityLabel: "稀有度 12%",
    affinityName: "冰岛蓝",
    primaryHex: "#e11d48",
    accentHex: "#fb7185",
  },
  "deep-space-rose": {
    id: "deep-space-rose",
    name: "深空玫瑰金",
    keywords: ["浪漫", "细腻", "永恒"],
    soul: "在冰冷的真空中，你保留了最温润的共情力。你是宇宙的叙事者。",
    rarityLabel: "稀有度 15%",
    affinityName: "极光绿",
    primaryHex: "#c08497",
    accentHex: "#fbcfe8",
  },
  "aurora-ufo-green": {
    id: "aurora-ufo-green",
    name: "极光幽浮绿",
    keywords: ["清冷", "独立", "超前"],
    soul: "你的思维领先时代半个光年。不被理解是常态，因为你属于未来。",
    rarityLabel: "稀有度 5%",
    affinityName: "熔岩金",
    primaryHex: "#14b8a6",
    accentHex: "#5eead4",
  },
  "collapsed-dark-matter": {
    id: "collapsed-dark-matter",
    name: "坍缩暗物质",
    keywords: ["沉静", "深邃", "秩序"],
    soul: "你能吸收一切噪音。在你的领域里，逻辑是唯一的真理。",
    rarityLabel: "稀有度 8%",
    affinityName: "恒星红",
    primaryHex: "#312e81",
    accentHex: "#6366f1",
  },
  "neutron-bright-purple": {
    id: "neutron-bright-purple",
    name: "中子星亮紫",
    keywords: ["神秘", "高频", "敏锐"],
    soul: "你有看穿表象的直觉。总能发现别人忽略的频率，是天生的灵感捕手。",
    rarityLabel: "稀有度 10%",
    affinityName: "珍珠白",
    primaryHex: "#9333ea",
    accentHex: "#c084fc",
  },
  "supernova-pearl": {
    id: "supernova-pearl",
    name: "超新星珍珠白",
    keywords: ["纯粹", "包容", "透彻"],
    soul: "历经万物后的简单。你不是没有颜色，而是折射了所有的光。",
    rarityLabel: "稀有度 3%",
    affinityName: "暗物质",
    primaryHex: "#e7e5e4",
    accentHex: "#fafaf9",
  },
};
