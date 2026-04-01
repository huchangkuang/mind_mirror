## ADDED Requirements

### Requirement: 提供获取 MBTI 题库的 API
系统 MUST 提供一个 HTTP GET 接口用于返回当前版本的 MBTI 题库及元信息。

#### Scenario: 成功获取题库
- **WHEN** 客户端发送 GET 请求到 `/api/mbti/questions`
- **THEN** 服务端 SHALL 返回 200 状态码
- **THEN** 响应体 SHALL 包含题库版本号、题目数量、预计完成时间和题目数组
- **THEN** 每个题目 SHALL 满足 `mbti-question-bank` 能力定义的结构要求

### Requirement: 提供提交答案并获取结果的 API
系统 MUST 提供一个 HTTP POST 接口，接收用户答案并返回计算后的 MBTI 结果。

#### Scenario: 成功提交答案并获取结果
- **WHEN** 客户端发送 POST 请求到 `/api/mbti/submit`，携带题库版本号和完整答题记录
- **THEN** 服务端 SHALL 校验请求体合法性（题目数量与版本匹配、答案格式正确）
- **THEN** 在校验通过时，服务端 SHALL 调用打分引擎计算 MBTI 类型和维度分数
- **THEN** 响应体 SHALL 包含 MBTI 类型字符串、各维度强度以及简要解释结构

### Requirement: API 必须定义统一的错误返回格式
所有 MBTI 相关 API MUST 使用一致的错误结构，便于前端处理和展示。

#### Scenario: 非法请求返回结构化错误
- **WHEN** 客户端以缺失必要字段或非法格式调用 `/api/mbti/submit`
- **THEN** 服务端 SHALL 返回 4xx 状态码
- **THEN** 响应体 SHALL 至少包含 `errorCode` 和人类可读 `message` 字段
- **THEN** 前端 SHALL 能根据 `errorCode` 进行针对性提示或重试逻辑

### Requirement: 提交接口必须接收并校验测试模式
`POST /api/mbti/submit` MUST 要求请求体包含 `mode` 字段，并执行与模式匹配的答案校验。

#### Scenario: quick 模式提交合法
- **WHEN** 请求体包含 `mode=quick` 且答案仅为 `A/B`
- **THEN** 系统 SHALL 通过校验并返回 quick 模式计分结果

#### Scenario: deep 模式提交合法
- **WHEN** 请求体包含 `mode=deep` 且答案值位于 `1..5`
- **THEN** 系统 SHALL 通过校验并返回 deep 模式计分结果

#### Scenario: 模式与答案值域不匹配
- **WHEN** `mode=quick` 但答案出现 `1..5`，或 `mode=deep` 但答案出现 `A/B`
- **THEN** 系统 SHALL 返回参数错误响应
- **THEN** 错误信息 SHALL 指明模式与答案值域不匹配

### Requirement: 题目接口必须支持按模式拉取题库
`GET /api/mbti/questions` MUST 支持传入模式参数并返回对应模式题目。

#### Scenario: 缺失模式参数时的默认行为
- **WHEN** 客户端未提供模式参数请求题目
- **THEN** 系统 SHALL 按约定默认模式返回（建议 quick）
- **THEN** 响应体 SHALL 明确返回实际使用的模式，避免前端歧义

### Requirement: MBTI 接口调用来源 MUST 可切换为独立后端服务
在保持 `mbti-api-contract` 既有请求/响应契约不变的前提下，前端 MUST 支持通过外部 Node API 服务地址调用 MBTI 题目与提交流程接口。

#### Scenario: 获取题目仍符合原契约
- **WHEN** 前端通过外部 API 地址请求 `GET /api/mbti/questions`
- **THEN** 响应体 SHALL 继续满足既有题库结构与模式字段约束
- **THEN** 前端题目渲染与流程控制 SHALL 与迁移前一致

#### Scenario: 提交答案仍符合原契约
- **WHEN** 前端通过外部 API 地址请求 `POST /api/mbti/submit`
- **THEN** 请求体与响应体 SHALL 保持原有字段语义与校验规则
- **THEN** 结果页解析逻辑 SHALL 无需业务语义变更

### Requirement: MBTI 接口迁移 MUST 保证模式参数语义不回归
前端在迁移到外部 API 后 MUST 继续传递并校验 `mode` 相关字段，确保 quick/deep 两种模式的调用语义一致。

#### Scenario: quick 模式迁移后可用
- **WHEN** 用户以 quick 模式发起题目获取与提交
- **THEN** 系统 SHALL 继续按 quick 模式契约处理答案值域与结果返回

#### Scenario: deep 模式迁移后可用
- **WHEN** 用户以 deep 模式发起题目获取与提交
- **THEN** 系统 SHALL 继续按 deep 模式契约处理评分与结果结构
