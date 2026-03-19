import type { CityProfile } from "./types";

/**
 * 预设城市档案库
 * 每个城市在 4 个维度上的特征值范围为 -100 到 +100
 */
export const citiesData: CityProfile[] = [
  {
    id: "beijing",
    name: "北京",
    country: "中国",
    description: "首都核心城市，文化资源密集，机会与竞争并存。",
    features: ["历史底蕴", "教育资源", "机会集中", "四季分明"],
    dimensionProfile: { lifestyle: 45, social: 30, environment: 78, pace: 68 },
  },
  {
    id: "shanghai",
    name: "上海",
    country: "中国",
    description: "国际化与精致生活并重的超大都市，节奏快但效率高。",
    features: ["国际化", "商业繁荣", "精致生活", "交通发达"],
    dimensionProfile: { lifestyle: 88, social: -8, environment: 96, pace: 78 },
  },
  {
    id: "guangzhou",
    name: "广州",
    country: "中国",
    description: "务实开放的岭南大城，美食与商业活力并行。",
    features: ["美食丰富", "商贸活跃", "气候温暖", "包容务实"],
    dimensionProfile: { lifestyle: 32, social: 72, environment: 38, pace: 28 },
  },
  {
    id: "shenzhen",
    name: "深圳",
    country: "中国",
    description: "创新与创业氛围强烈的年轻城市，发展速度快。",
    features: ["创新科技", "年轻活力", "效率导向", "机会密集"],
    dimensionProfile: { lifestyle: 96, social: -35, environment: 35, pace: 98 },
  },
  {
    id: "hangzhou",
    name: "杭州",
    country: "中国",
    description: "西湖山水与数字经济结合，兼顾自然与现代便利。",
    features: ["西湖景观", "互联网产业", "生活舒适", "人文浓厚"],
    dimensionProfile: { lifestyle: 50, social: 20, environment: -20, pace: 10 },
  },
  {
    id: "chengdu",
    name: "成都",
    country: "中国",
    description: "慢节奏与烟火气兼具的西部核心城市，社交氛围友好。",
    features: ["美食之都", "社交友好", "节奏舒缓", "休闲文化"],
    dimensionProfile: { lifestyle: 20, social: 60, environment: 20, pace: -70 },
  },
  {
    id: "chongqing",
    name: "重庆",
    country: "中国",
    description: "山城地貌鲜明，夜景与火锅文化充满个性。",
    features: ["山城夜景", "火锅文化", "立体交通", "热辣氛围"],
    dimensionProfile: { lifestyle: 5, social: 60, environment: 5, pace: 45 },
  },
  {
    id: "changsha",
    name: "长沙",
    country: "中国",
    description: "娱乐与夜生活活跃，年轻氛围强，生活成本相对友好。",
    features: ["夜生活", "娱乐文化", "年轻活力", "成本适中"],
    dimensionProfile: { lifestyle: 45, social: 78, environment: -8, pace: 22 },
  },
  {
    id: "xian",
    name: "西安",
    country: "中国",
    description: "古都文化厚重，现代生活与历史遗产并存。",
    features: ["历史古都", "文化景点", "高校资源", "生活稳健"],
    dimensionProfile: { lifestyle: -22, social: 24, environment: 36, pace: -8 },
  },
  {
    id: "xiamen",
    name: "厦门",
    country: "中国",
    description: "滨海宜居城市，气候舒适，节奏适中偏慢。",
    features: ["海滨风光", "宜居安静", "文艺氛围", "气候温和"],
    dimensionProfile: { lifestyle: 8, social: 18, environment: -62, pace: -46 },
  },
  {
    id: "qingdao",
    name: "青岛",
    country: "中国",
    description: "海洋气质鲜明，生活舒适，工业与旅游并重。",
    features: ["海岸城市", "啤酒文化", "居住舒适", "节奏平衡"],
    dimensionProfile: { lifestyle: -5, social: 0, environment: -10, pace: 10 },
  },
  {
    id: "suzhou",
    name: "苏州",
    country: "中国",
    description: "园林古韵与现代制造业协同，精致而稳定。",
    features: ["园林文化", "制造产业", "生活精致", "通勤便利"],
    dimensionProfile: { lifestyle: -12, social: 0, environment: -2, pace: -8 },
  },
  {
    id: "dali",
    name: "大理",
    country: "中国",
    description: "自然风景与慢生活代表，适合疗愈与远程生活。",
    features: ["洱海风光", "慢节奏", "自由氛围", "文旅丰富"],
    dimensionProfile: { lifestyle: -52, social: 2, environment: -98, pace: -96 },
  },
  {
    id: "lijiang",
    name: "丽江",
    country: "中国",
    description: "古城与雪山共存，度假感强，适合放慢步调。",
    features: ["古城文化", "雪山景观", "旅居热门", "节奏缓慢"],
    dimensionProfile: { lifestyle: -60, social: 40, environment: -40, pace: -70 },
  },
  {
    id: "sanya",
    name: "三亚",
    country: "中国",
    description: "热带海滨城市，度假属性突出，生活节奏轻松。",
    features: ["热带海滩", "度假城市", "阳光气候", "放松疗愈"],
    dimensionProfile: { lifestyle: 42, social: 52, environment: -90, pace: -60 },
  },
  {
    id: "tokyo",
    name: "东京",
    country: "日本",
    description: "传统与科技并行的超大都市，秩序与效率极高。",
    features: ["交通便捷", "美食密集", "文化多元", "秩序良好"],
    dimensionProfile: { lifestyle: 28, social: -18, environment: 82, pace: 54 },
  },
  {
    id: "kyoto",
    name: "京都",
    country: "日本",
    description: "千年古都与季节美景并存，适合文化向慢生活。",
    features: ["传统文化", "寺社众多", "季节感强", "节奏舒缓"],
    dimensionProfile: { lifestyle: -60, social: -20, environment: -30, pace: -60 },
  },
  {
    id: "seoul",
    name: "首尔",
    country: "韩国",
    description: "潮流与效率兼具的亚洲大都市，社交活动丰富。",
    features: ["流行文化", "夜生活活跃", "交通发达", "消费便利"],
    dimensionProfile: { lifestyle: 62, social: 88, environment: -20, pace: 72 },
  },
  {
    id: "singapore",
    name: "新加坡市",
    country: "新加坡",
    description: "高效整洁、规则感强的国际城市，生活品质稳定。",
    features: ["城市整洁", "多元文化", "效率高", "治安稳定"],
    dimensionProfile: { lifestyle: 40, social: -20, environment: 15, pace: -5 },
  },
  {
    id: "bangkok",
    name: "曼谷",
    country: "泰国",
    description: "热带大都市，烟火气与夜生活并重，社交氛围浓。",
    features: ["夜市丰富", "生活多彩", "国际旅居", "热带气候"],
    dimensionProfile: { lifestyle: 10, social: 95, environment: 20, pace: -15 },
  },
  {
    id: "chiang-mai",
    name: "清迈",
    country: "泰国",
    description: "数字游民友好城市，成本较低，生活松弛。",
    features: ["旅居友好", "生活低成本", "寺庙文化", "节奏慢"],
    dimensionProfile: { lifestyle: -20, social: 40, environment: -40, pace: -80 },
  },
  {
    id: "paris",
    name: "巴黎",
    country: "法国",
    description: "艺术与时尚中心，文化体验密集，生活方式讲究。",
    features: ["艺术之都", "时尚前沿", "历史建筑", "城市漫步"],
    dimensionProfile: { lifestyle: 18, social: 22, environment: 30, pace: 2 },
  },
  {
    id: "london",
    name: "伦敦",
    country: "英国",
    description: "国际金融与文化核心，节奏快、资源集中。",
    features: ["国际化", "金融中心", "多元文化", "公共交通"],
    dimensionProfile: { lifestyle: 52, social: -42, environment: 76, pace: 34 },
  },
  {
    id: "new-york",
    name: "纽约",
    country: "美国",
    description: "机会密集的不夜城，适合高压高成长路径。",
    features: ["机会众多", "文化多元", "高竞争", "高密度生活"],
    dimensionProfile: { lifestyle: 74, social: 96, environment: 58, pace: 97 },
  },
  {
    id: "vancouver",
    name: "温哥华",
    country: "加拿大",
    description: "山海环抱的宜居城市，自然和城市平衡明显。",
    features: ["自然环境", "户外丰富", "居住舒适", "多元包容"],
    dimensionProfile: { lifestyle: 40, social: 20, environment: -50, pace: -10 },
  },
  {
    id: "melbourne",
    name: "墨尔本",
    country: "澳大利亚",
    description: "文艺与宜居并重，咖啡文化和社区感浓厚。",
    features: ["咖啡文化", "艺术氛围", "宜居体验", "体育文化"],
    dimensionProfile: { lifestyle: 40, social: 30, environment: 30, pace: -30 },
  },
  {
    id: "copenhagen",
    name: "哥本哈根",
    country: "丹麦",
    description: "北欧简约生活代表，重视环保与幸福感。",
    features: ["环保领先", "骑行友好", "设计美学", "幸福指数高"],
    dimensionProfile: { lifestyle: 30, social: 10, environment: -10, pace: -20 },
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
