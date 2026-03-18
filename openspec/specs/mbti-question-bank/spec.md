## ADDED Requirements

### Requirement: 题库必须支持多维度权重配置
系统 MUST 为每一道 MBTI 题目提供维度权重配置，用于映射到 E/I、S/N、T/F、J/P 四个维度。

#### Scenario: 题目包含维度权重字段
- **WHEN** 客户端或服务端读取题库数据
- **THEN** 每个题目对象 SHALL 至少包含题干、选项数组和 `dimensionWeights` 字段
- **THEN** `dimensionWeights` SHALL 包含 EI、SN、TF、JP 四个键，对应数值可为正负或零

### Requirement: 题库必须支持版本与元信息
系统 MUST 为题库提供版本号与基础元信息，以便后续扩展不同长度或风格的题集。

#### Scenario: 题库元信息可被读取
- **WHEN** 客户端调用获取题库的接口
- **THEN** 响应体 SHALL 包含当前题库版本号、题目数量和推荐完成时间等元信息
- **THEN** 客户端 SHALL 能据此展示「共 N 题，预计 X 分钟完成」提示

### Requirement: 题库结构稳定且可扩展
题库格式 MUST 在字段命名和结构上保持向后兼容，以便以后扩展字段（如类别、标签、多语言文本）。

#### Scenario: 扩展字段不影响现有消费方
- **WHEN** 在题目结构中新增可选字段（如 `category`、`tags`）
- **THEN** 现有依赖题库的前端和打分逻辑 SHALL 在缺失该字段时仍能正常工作
- **THEN** 依赖方 SHALL 通过类型定义或运行时校验确保只使用已约定的必需字段
