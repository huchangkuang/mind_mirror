## ADDED Requirements

### Requirement: Get all tests endpoint
The system SHALL provide an API endpoint to retrieve all available tests.

#### Scenario: Successful retrieval
- **WHEN** a GET request is made to `/api/tests`
- **THEN** the system SHALL return HTTP 200 with a JSON array of all tests
- **AND** each test object SHALL include: id, test_id, title, description, icon_name, duration, featured, href, color_from, color_to

#### Scenario: Empty database
- **WHEN** a GET request is made to `/api/tests` and no tests exist
- **THEN** the system SHALL return HTTP 200 with an empty array `[]`

### Requirement: Get test by ID endpoint
The system SHALL provide an API endpoint to retrieve a specific test by its test_id.

#### Scenario: Test found
- **WHEN** a GET request is made to `/api/tests?test_id=mbti`
- **THEN** the system SHALL return HTTP 200 with the test object
- **AND** the response SHALL include all test details

#### Scenario: Test not found
- **WHEN** a GET request is made with a non-existent test_id
- **THEN** the system SHALL return HTTP 404 with error message "Test not found"

### Requirement: Response format compatibility
The system SHALL ensure API responses match the current frontend data structure.

#### Scenario: Frontend compatibility
- **WHEN** the frontend receives test data from `/api/tests`
- **THEN** the data structure SHALL be compatible with the existing hardcoded tests array format
- **AND** icon_name SHALL be transformable to the icon component
- **AND** color_from and color_to SHALL be combinable into the gradient color string

### Requirement: 测试列表请求 MUST 通过外部 Node API 获取
前端首页与相关入口在迁移后 MUST 通过外部 API 地址调用 `/api/tests`，并保持原有列表展示字段兼容性。

#### Scenario: 获取全部测试列表
- **WHEN** 前端调用外部 API `GET /api/tests`
- **THEN** 系统 SHALL 返回与现有前端结构兼容的测试数组
- **THEN** 每个测试项 SHALL 继续包含标题、描述、入口、图标与配色等展示字段

#### Scenario: 根据 test_id 获取单项
- **WHEN** 前端调用外部 API `GET /api/tests?test_id=<id>`
- **THEN** 系统 SHALL 保持原有成功与未找到场景的状态码语义
- **THEN** 前端详情入口逻辑 SHALL 无需行为变更

### Requirement: 测试列表接口迁移 MUST 不改变前端空态行为
当前端从外部 API 获取测试数据为空时，系统 MUST 保持与迁移前一致的空态可处理性。

#### Scenario: 外部 API 返回空数组
- **WHEN** `GET /api/tests` 返回 `[]`
- **THEN** 前端 SHALL 正常渲染空列表或空态提示
- **THEN** 页面 SHALL 不发生运行时错误
