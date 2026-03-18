## ADDED Requirements

### Requirement: 系统必须根据维度得分计算 MBTI 四字母类型
系统 MUST 根据用户在各题目的作答和维度权重累加结果，计算出 E/I、S/N、T/F、J/P 四个维度的最终倾向字母。

#### Scenario: 正常计算 MBTI 类型
- **WHEN** 系统接收到一份完整的答题记录
- **THEN** 系统 SHALL 对每题答案应用对应的 `dimensionWeights` 并按维度累加
- **THEN** 对于每个维度（如 EI），若得分 > 0 则取正向字母（E），得分 < 0 取反向字母（I），得分 = 0 则按约定默认一侧
- **THEN** 系统 SHALL 返回四个字母组成的 MBTI 类型字符串（如 `INTJ`）

### Requirement: 系统必须提供维度强度信息
系统 MUST 在结果中包含四个维度的强度比例或分数，以便用于可视化展示。

#### Scenario: 生成维度强度百分比
- **WHEN** 计算得到各维度的原始得分
- **THEN** 系统 SHALL 计算每个维度相对强度（如 0–100%）
- **THEN** 返回结果 SHALL 包含每个维度的强度值，用于前端绘制条形图或雷达图

### Requirement: 打分引擎必须可重复且可测试
同一份答案在任何时间被提交多次时，系统 MUST 始终返回一致的 MBTI 类型和维度分数。

#### Scenario: 重复提交产生相同结果
- **WHEN** 使用同一题库版本和同一份答案请求提交结果多次
- **THEN** 系统 SHALL 每次返回相同的 MBTI 类型和维度强度
- **THEN** 单元测试 SHALL 能够对典型答案组合进行断言验证

