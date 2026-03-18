import type { CityProfile } from "./types";

/**
 * 预设城市档案库
 * 每个城市在 4 个维度上的特征值范围为 -100 到 +100
 */
export const citiesData: CityProfile[] = [
  {
    id: "tokyo",
    name: "东京",
    country: "日本",
    description: "传统与现代完美交融的国际大都市，既有千年古寺也有霓虹闪烁的街头。适合追求精致生活、喜欢都市繁华但又不失文化底蕴的人。",
    features: ["交通极其便利", "美食天堂", "治安良好", "文化丰富"],
    dimensionProfile: {
      lifestyle: 60,    // 偏现代但保留传统
      social: 40,       // 社交友好但有距离感
      environment: 80,  // 高度都市化
      pace: 70,         // 快节奏
    },
  },
  {
    id: "kyoto",
    name: "京都",
    country: "日本",
    description: "千年古都，寺庙神社林立，四季风景如画。适合喜欢传统文化、追求内心平静、享受慢生活的人。",
    features: ["传统文化浓厚", "四季分明", "生活节奏慢", "人文气息重"],
    dimensionProfile: {
      lifestyle: -60,   // 偏传统
      social: -20,      // 偏独处
      environment: -30, // 自然与传统建筑结合
      pace: -60,        // 慢节奏
    },
  },
  {
    id: "singapore",
    name: "新加坡",
    country: "新加坡",
    description: "花园城市，高效现代的都市典范。多元文化交融，秩序井然。适合追求高效生活、喜欢热带气候、重视规则的人。",
    features: ["绿化覆盖率高", "多元文化", "高效便利", "安全整洁"],
    dimensionProfile: {
      lifestyle: 80,    // 高度现代
      social: 50,       // 社交活跃
      environment: 60,   // 花园城市
      pace: 60,         // 偏快节奏
    },
  },
  {
    id: "chengdu",
    name: "成都",
    country: "中国",
    description: "天府之国，悠闲自在的生活哲学。美食、茶馆、熊猫，一切都让人感到放松。适合追求慢生活、热爱美食、享受社交的人。",
    features: ["美食之都", "生活节奏慢", "包容友好", "文化底蕴"],
    dimensionProfile: {
      lifestyle: 20,    // 平衡
      social: 60,       // 爱社交
      environment: 20,   // 城市与自然平衡
      pace: -70,        // 很慢
    },
  },
  {
    id: "hangzhou",
    name: "杭州",
    country: "中国",
    description: "人间天堂，西湖美景与互联网之都的完美结合。适合追求工作与生活平衡、喜欢自然又不失现代便利的人。",
    features: ["西湖美景", "互联网发达", "生活便利", "人文自然和谐"],
    dimensionProfile: {
      lifestyle: 50,    // 偏现代
      social: 20,       // 适中
      environment: -20, // 自然与城市平衡
      pace: 10,         // 适中
    },
  },
  {
    id: "melbourne",
    name: "墨尔本",
    country: "澳大利亚",
    description: "全球最宜居城市之一，文艺气息浓厚，咖啡文化盛行。适合追求高品质生活、热爱艺术、喜欢悠闲节奏的人。",
    features: ["咖啡文化", "艺术氛围", "宜居舒适", "体育文化"],
    dimensionProfile: {
      lifestyle: 40,    // 现代但悠闲
      social: 30,       // 适中
      environment: 30,  // 城市绿化好
      pace: -30,        // 偏慢
    },
  },
  {
    id: "copenhagen",
    name: "哥本哈根",
    country: "丹麦",
    description: "北欧幸福典范，自行车之城，简约设计的源头。适合追求简约生活、重视环保、喜欢小而美城市的人。",
    features: ["自行车友好", "设计之都", "幸福指数高", "环保领先"],
    dimensionProfile: {
      lifestyle: 30,    // 现代但简约
      social: 10,       // 适中
      environment: -10, // 城市与自然和谐
      pace: -20,        // 偏慢
    },
  },
  {
    id: "chiang-mai",
    name: "清迈",
    country: "泰国",
    description: "泰北玫瑰，数字游民的天堂。物价低廉，氛围轻松，适合追求自由生活、远程工作、喜欢热带慢节奏的人。",
    features: ["物价低廉", "数字游民聚集地", "寺庙众多", "氛围轻松"],
    dimensionProfile: {
      lifestyle: -20,   // 传统与现代结合
      social: 40,       // 社交活跃
      environment: -40, // 自然环境好
      pace: -80,        // 非常慢
    },
  },
  {
    id: "new-york",
    name: "纽约",
    country: "美国",
    description: "不夜城，世界中心。机遇与挑战并存，适合追求卓越、不惧竞争、渴望在高压环境中快速成长的人。",
    features: ["机会众多", "文化多元", "永不眠息", "世界中心"],
    dimensionProfile: {
      lifestyle: 90,    // 高度现代
      social: 70,       // 高度社交
      environment: 90,  // 高度都市化
      pace: 90,         // 极快节奏
    },
  },
  {
    id: "vancouver",
    name: "温哥华",
    country: "加拿大",
    description: "山海之间的宜居城市，华人友好，户外活动丰富。适合追求自然与都市平衡、热爱户外运动、重视家庭生活的人。",
    features: ["山海景观", "户外活动丰富", "华人友好", "宜居安全"],
    dimensionProfile: {
      lifestyle: 40,    // 现代
      social: 20,       // 适中
      environment: -50, // 自然环境优越
      pace: -10,        // 适中偏慢
    },
  },
];

/**
 * 根据城市 ID 获取城市档案
 */
export function getCityById(id: string): CityProfile | undefined {
  return citiesData.find((city) => city.id === id);
}

/**
 * 获取所有城市档案
 */
export function getAllCities(): CityProfile[] {
  return citiesData;
}
