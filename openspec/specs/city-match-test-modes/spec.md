## Requirements

### Requirement: 城市匹配落地页提供模式选择
城市匹配落地页 (`/city-match`) SHALL 显示两个测试入口：快速版和完整版，分别链接到 `/city-match/test?mode=quick` 和 `/city-match/test?mode=full`。

#### Scenario: 落地页显示双模式入口
- **WHEN** 用户访问 `/city-match`
- **THEN** 页面显示"快速版"入口（标注约 3 分钟、8 道题）
- **AND** 页面显示"完整版"入口（标注约 8 分钟、25+ 道题）
- **AND** 每个入口清晰标识题目数量和预计用时

### Requirement: 测试页通过 URL 参数区分模式
城市匹配测试页 SHALL 通过 URL query parameter `mode` 区分测试模式。

#### Scenario: 快速模式测试
- **WHEN** 用户访问 `/city-match/test?mode=quick`
- **THEN** 系统加载快速版题目（8 题）

#### Scenario: 完整模式测试
- **WHEN** 用户访问 `/city-match/test?mode=full`
- **THEN** 系统加载完整版题目（25+ 题）

#### Scenario: 无 mode 参数时默认快速版
- **WHEN** 用户访问 `/city-match/test`（无 mode 参数）
- **THEN** 系统默认使用快速版模式

### Requirement: API 支持 mode 参数
`/api/city-match/questions` API SHALL 接受 `mode` query parameter，返回对应模式的题目。

#### Scenario: API 返回快速版题目
- **WHEN** 客户端请求 `GET /api/city-match/questions?mode=quick`
- **THEN** 返回快速版题目数据，包含 8 道题目
- **AND** 响应中 meta.mode 为 "quick"

#### Scenario: API 返回完整版题目
- **WHEN** 客户端请求 `GET /api/city-match/questions?mode=full`
- **THEN** 返回完整版题目数据，包含 25+ 道题目
- **AND** 响应中 meta.mode 为 "full"

### Requirement: 模式切换时保护进度
当用户在已有答题进度时切换模式，系统 SHALL 弹出确认对话框。

#### Scenario: 有进度时切换模式需确认
- **WHEN** 用户在快速版已答题
- **AND** 切换到完整版 URL
- **THEN** 弹出确认框"切换测试模式将清空当前进度，是否继续？"
- **AND** 用户确认后清空进度并加载新模式题目
- **AND** 用户取消后保持当前模式和进度

### Requirement: Store 按模式隔离状态
城市匹配的 Zustand store SHALL 包含 mode 字段，sessionStorage 持久化 key SHALL 按模式隔离。

#### Scenario: 不同模式的进度独立
- **WHEN** 用户在快速版答了 3 题后切换到完整版
- **AND** 在完整版答了 5 题后切回快速版
- **THEN** 快速版恢复之前 3 题的进度
