## ADDED Requirements

### Requirement: 前端 MUST 通过可配置外部 API Base URL 发起业务请求
系统 MUST 提供统一请求入口，使用环境变量配置的外部 API Base URL（本地默认 `http://localhost:3001`），并禁止新增页面/Store 直接拼接硬编码接口地址。删除 Next.js 内嵌 `app/api/*` 后，生产环境 MUST 通过 Nginx 同域反代 `/api/v1/*` 至 API 服务，或显式设置 `NEXT_PUBLIC_API_BASE_URL`；web 应用 SHALL NOT 再提供同源业务 API 回退实现。

#### Scenario: 使用默认本地后端地址
- **WHEN** 前端运行在本地且未覆盖自定义 API 地址配置
- **THEN** 系统 SHALL 将业务请求发送到 `http://localhost:3001` 对应端点
- **THEN** 请求路径 SHALL 保持与既有能力定义一致（如 `/api/tests`、`/api/mbti/questions`）

#### Scenario: 使用环境变量覆盖 API 地址
- **WHEN** 部署环境设置了 API Base URL 环境变量
- **THEN** 系统 SHALL 使用该变量作为所有业务请求前缀
- **THEN** 页面与业务模块 SHALL 无需改动即可切换后端地址

#### Scenario: 生产环境同域反代
- **WHEN** 生产环境未设置 `NEXT_PUBLIC_API_BASE_URL` 且 web 内嵌 API 已移除
- **THEN** 浏览器请求 SHALL 发往同源 `/api/v1/*`
- **AND** 基础设施（如 Nginx）SHALL 将此类请求转发至 API 服务（默认 `:3001`）

### Requirement: 统一请求层 MUST 提供一致的错误语义
系统 MUST 在统一请求层中将网络错误、超时、后端错误响应转换为可预测的错误结构，以便页面与状态管理层执行一致的提示与重试策略。

#### Scenario: 后端返回结构化错误
- **WHEN** 外部 API 返回 4xx/5xx 且包含错误码与消息
- **THEN** 前端统一请求层 SHALL 产出包含状态码、错误码、消息的错误对象
- **THEN** 上层调用方 SHALL 能根据统一错误字段处理展示逻辑

#### Scenario: 请求超时或网络异常
- **WHEN** 请求在超时阈值内未收到响应或发生网络中断
- **THEN** 前端统一请求层 SHALL 返回可识别的网络异常错误类型
- **THEN** 上层调用方 SHALL 可据此触发重试或降级提示
