## ADDED Requirements

### Requirement: 用户可以在开始测试前选择测试模式
系统 MUST 在 MBTI 测试入口提供两种可选模式，并在用户确认后进入对应测试流程。

#### Scenario: 入口展示模式选择卡片
- **WHEN** 用户进入 MBTI 测试入口页
- **THEN** 系统 SHALL 展示两个模式选项：`快速版（2选1）` 与 `深度版（5级量表）`
- **THEN** 每个选项 SHALL 显示简短说明，帮助用户理解耗时与评估粒度差异

#### Scenario: 选择模式后进入对应流程
- **WHEN** 用户选择任一模式并点击开始测试
- **THEN** 系统 SHALL 将所选模式写入测试会话状态
- **THEN** 系统 SHALL 导航到与该模式匹配的答题流程

### Requirement: 系统必须在测试全链路保留模式上下文
系统 MUST 在题目拉取、提交结果、结果展示与历史记录中保留同一 `mode` 上下文。

#### Scenario: 模式上下文在请求链路中保持一致
- **WHEN** 用户从入口选择 `quick` 或 `deep` 模式后开始作答
- **THEN** 后续题目请求与提交请求 SHALL 携带相同 `mode`
- **THEN** 结果页与历史记录 SHALL 展示与该 `mode` 一致的标签文案
