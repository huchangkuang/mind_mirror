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

### Requirement: 打分引擎必须基于模式选择计分模型
系统 MUST 根据 `mode` 选择对应计分模型，确保二选一与 5 级量表不会混用同一权重解释。

#### Scenario: quick 模式使用二选一计分
- **WHEN** 提交请求中的 `mode=quick`
- **THEN** 系统 SHALL 按二选一权重规则累加维度得分
- **THEN** 系统 SHALL 产出四维分数、强度与 MBTI 类型

#### Scenario: deep 模式使用 5 级量表计分
- **WHEN** 提交请求中的 `mode=deep`
- **THEN** 系统 SHALL 按 5 级量表映射规则计算维度得分
- **THEN** 系统 SHALL 对维度强度执行归一化后输出 MBTI 类型与强度

### Requirement: 两种计分模型均必须保持可重复性
在同一题库版本、同一模式、同一答案输入下，系统 MUST 始终输出一致结果。

#### Scenario: deep 模式重复提交得到一致结果
- **WHEN** 使用同一份 deep 模式答案重复提交多次
- **THEN** 系统 SHALL 返回完全一致的类型与维度强度
- **THEN** 自动化测试 SHALL 覆盖 quick 与 deep 两种模式的确定性验证
