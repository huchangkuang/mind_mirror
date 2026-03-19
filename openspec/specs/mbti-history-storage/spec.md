## ADDED Requirements

### Requirement: 系统必须在本地存储最近的测试记录
系统 MUST 在未登录状态下将最近若干次测试结果保存在浏览器本地；系统 MUST 在登录状态下将测试结果长期保存到与用户身份绑定的持久化存储，并支持后续查看。

#### Scenario: 未登录用户保存记录
- **WHEN** 未登录用户完成一次测试并生成结果
- **THEN** 系统 SHALL 将本次结果（时间戳、MBTI 类型、维度分数、题库版本等）追加保存到本地存储
- **THEN** 当记录数量超过上限时，系统 SHALL 删除最早的记录以保持数量上限

#### Scenario: 已登录用户保存记录
- **WHEN** 已登录用户完成一次测试并生成结果
- **THEN** 系统 SHALL 将本次结果写入与当前用户账户关联的持久化历史记录存储
- **THEN** 用户在后续会话或其他设备登录后 SHALL 能够读取该条历史记录

### Requirement: 用户可以查看历史测试列表
系统 MUST 提供历史记录列表页面，展示每次测试的时间和 MBTI 类型概要。

#### Scenario: 查看历史列表
- **WHEN** 用户访问历史记录页面
- **THEN** 系统 SHALL 从本地存储读取所有记录并按时间倒序显示
- **THEN** 每条记录 SHALL 至少展示测试时间和 MBTI 类型

### Requirement: 用户可以查看单次测试详情
系统 SHOULD 允许用户查看某次测试的详细结果，包括维度分布等信息。

#### Scenario: 查看某条历史记录详情
- **WHEN** 用户在历史列表中点击某一条记录
- **THEN** 系统 SHALL 显示该次测试的详细信息（如四维度分布、类型说明摘要）
- **THEN** 用户 SHALL 能够从详情页返回到历史列表页

### Requirement: 历史记录必须存储测试模式
系统 MUST 在每条 MBTI 测试记录中保存测试模式字段，以支持结果解释与后续筛选。

#### Scenario: 保存 quick 模式记录
- **WHEN** 用户完成 quick 模式测试并保存记录
- **THEN** 系统 SHALL 在记录中写入 `mode=quick`
- **THEN** 历史列表 SHALL 可展示"快速版（2选1）"标签

#### Scenario: 保存 deep 模式记录
- **WHEN** 用户完成 deep 模式测试并保存记录
- **THEN** 系统 SHALL 在记录中写入 `mode=deep`
- **THEN** 历史列表 SHALL 可展示"深度版（5级量表）"标签

### Requirement: 旧记录读取必须向后兼容
系统 MUST 对历史中缺失模式字段的旧记录提供默认回退，避免读取失败。

#### Scenario: 读取旧格式历史记录
- **WHEN** 历史数据中记录不包含 `mode` 字段
- **THEN** 系统 SHALL 使用默认值（如 `quick`）回填并继续展示
- **THEN** 系统 SHALL 不因字段缺失导致历史页报错
