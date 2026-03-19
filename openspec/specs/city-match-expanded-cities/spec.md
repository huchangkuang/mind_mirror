## Requirements

### Requirement: 城市档案扩充至 25+ 个市级城市
`cities-data.ts` SHALL 包含至少 25 个城市的档案数据，所有城市 SHALL 为市级行政单位，不包含国家级别条目。

#### Scenario: 城市总数验证
- **WHEN** 读取 citiesData 数组
- **THEN** 数组长度不少于 25

#### Scenario: 城市级别验证
- **WHEN** 检查任一城市的 name 字段
- **THEN** 城市名称为具体城市名（如"北京"、"东京"），而非国家名（如"新加坡"、"日本"）

### Requirement: 中国城市覆盖一线及知名旅游城市
城市档案 SHALL 包含以下中国城市（约 15 个）：北京、上海、广州、深圳、杭州、成都、重庆、长沙、西安、厦门、青岛、苏州、大理、丽江、三亚。

#### Scenario: 中国一线城市覆盖
- **WHEN** 查询城市列表
- **THEN** 包含北京、上海、广州、深圳四个一线城市

#### Scenario: 中国旅游城市覆盖
- **WHEN** 查询城市列表
- **THEN** 包含大理、丽江、三亚等知名旅游城市

### Requirement: 国际城市精选大众熟知代表性城市
城市档案 SHALL 包含以下国际城市（约 10 个）：东京、首尔、曼谷、巴黎、伦敦、纽约、温哥华、墨尔本、清迈、哥本哈根。

#### Scenario: 国际城市覆盖
- **WHEN** 查询城市列表
- **THEN** 包含东京、巴黎、纽约等国际知名城市
- **AND** 每个国际城市的 country 字段为对应国家名

### Requirement: 每个城市档案包含完整的四维度 profile
每个城市 SHALL 包含 id、name、country、description、features 和 dimensionProfile 字段，其中 dimensionProfile 包含 lifestyle、social、environment、pace 四个维度值，范围为 -100 到 +100。

#### Scenario: 城市数据结构完整性
- **WHEN** 检查任一城市档案
- **THEN** 包含 id（kebab-case）、name（中文城市名）、country（中文国家名）
- **AND** description 为 1-2 句城市描述
- **AND** features 为包含 4 个特色标签的数组
- **AND** dimensionProfile 四个维度值均在 [-100, +100] 范围内

### Requirement: 城市维度 profile 具有足够区分度
城市之间的 dimensionProfile SHALL 具有足够的区分度，避免多个城市向量过于相似。

#### Scenario: 四维度空间分布合理
- **WHEN** 计算所有城市两两之间的余弦相似度
- **THEN** 不存在两个城市的相似度超过 0.95

### Requirement: 现有城市 ID 保持不变
已有城市的 id 字段 SHALL 保持不变，确保历史记录中的引用仍然有效。原"新加坡"条目 SHALL 更新 name 为"新加坡市"，id 保持 `singapore`。

#### Scenario: 向后兼容
- **WHEN** 查询已有城市 id（如 `tokyo`、`chengdu`、`singapore`）
- **THEN** 对应城市档案存在且可正常获取
