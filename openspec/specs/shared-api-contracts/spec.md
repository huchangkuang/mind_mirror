## ADDED Requirements

### Requirement: Shared API contracts MUST be exported from packages/shared
跨端共用的 API 响应 envelope、认证用户结构与测试 mode 类型 MUST 定义在 `@mind-mirror/shared` 并由 web 与 api 引用。

#### Scenario: ApiResponse envelope type
- **WHEN** 前端或后端代码引用 API 响应 envelope 类型
- **THEN** 系统 SHALL 从 `@mind-mirror/shared` 导入 `ApiResponse<T>` 定义
- **THEN** 类型 SHALL 包含 `code`、`message`、`data` 字段

#### Scenario: Auth user type consistency
- **WHEN** web 展示用户信息或 api 返回 auth 载荷
- **THEN** 共享 `AuthUser` 类型 SHALL 包含 `id`、`username`、`nickname` 字段

#### Scenario: MBTI mode type
- **WHEN** 代码表示 MBTI 测试模式
- **THEN** 共享 `MbtiTestMode` 类型 SHALL 限定为 `quick` 或 `deep`
