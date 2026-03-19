## Requirements

### Requirement: 完整版题库包含 25+ 道题
完整版城市匹配测试 SHALL 包含至少 25 道题目，覆盖 lifestyle、social、environment、pace 四个维度，每个维度至少有 5 道题目覆盖。

#### Scenario: 完整版题目数量和维度覆盖
- **WHEN** 系统加载完整版题库
- **THEN** 题目总数不少于 25 道
- **AND** 每道题的选项 SHALL 包含 dimensionWeights 字段
- **AND** 四个维度（lifestyle、social、environment、pace）各自被至少 5 道题的选项权重覆盖

### Requirement: 快速版精选 8 道核心题目
快速版 SHALL 包含 8 道从完整版精选的核心题目，选取维度区分度最高的题目。

#### Scenario: 快速版题目数量
- **WHEN** 系统加载快速版题库
- **THEN** 题目总数为 8 道
- **AND** 四个维度均有覆盖

### Requirement: 新增题目覆盖多元生活场景
完整版新增题目 SHALL 覆盖以下额外场景维度：气候和天气偏好、饮食文化和口味、生活成本态度、文化消费与娱乐、居住空间偏好、交通出行习惯。

#### Scenario: 气候偏好题目
- **WHEN** 完整版包含气候相关题目
- **THEN** 题目选项 SHALL 影响 environment 和/或 lifestyle 维度

#### Scenario: 饮食文化题目
- **WHEN** 完整版包含饮食相关题目
- **THEN** 题目选项 SHALL 影响 lifestyle 和/或 social 维度

### Requirement: 题目选项权重范围合理
所有题目选项的 dimensionWeights 单维度值 SHALL 在 -15 到 +15 范围内，与现有题库保持一致。

#### Scenario: 权重范围校验
- **WHEN** 任一题目选项的 dimensionWeights 被检查
- **THEN** 每个维度权重值在 [-15, +15] 范围内

### Requirement: 题库数据结构按模式组织
`data/city-match/questions.json` SHALL 采用 modes 分模式结构，每个模式包含独立的 questionCount、estimatedMinutes 和 questions 数组。

#### Scenario: JSON 数据结构验证
- **WHEN** 读取 questions.json 文件
- **THEN** 根级包含 `meta` 和 `modes` 字段
- **AND** `modes.quick` 包含 questionCount=8 和 questions 数组
- **AND** `modes.full` 包含 questionCount>=25 和 questions 数组
