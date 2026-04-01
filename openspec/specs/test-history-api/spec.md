## ADDED Requirements

### Requirement: Save test result endpoint
The system SHALL provide an API endpoint to save a test result.

#### Scenario: Successful save
- **WHEN** a POST request is made to `/api/history` with body containing `{test_id, result, result_summary}`
- **THEN** the system SHALL insert a new record into `test_history` table
- **AND** return HTTP 201 with the created record including its `id` and `created_at`

#### Scenario: Missing required fields
- **WHEN** a POST request is made without required fields (test_id, result)
- **THEN** the system SHALL return HTTP 400 with error message "Missing required fields: test_id, result"

#### Scenario: Invalid test_id
- **WHEN** a POST request is made with a test_id that doesn't exist in tests table
- **THEN** the system SHALL return HTTP 400 with error message "Invalid test_id"

### Requirement: Get test history endpoint
The system SHALL provide an API endpoint to retrieve test history.

#### Scenario: Get all history
- **WHEN** a GET request is made to `/api/history`
- **THEN** the system SHALL return HTTP 200 with a JSON array of all history records
- **AND** records SHALL be ordered by `created_at` DESC (newest first)
- **AND** each record SHALL include: id, test_id, test_title (joined from tests), result, result_summary, created_at

#### Scenario: Get history by test_id
- **WHEN** a GET request is made to `/api/history?test_id=mbti`
- **THEN** the system SHALL return HTTP 200 with history records filtered by the specified test_id
- **AND** records SHALL be ordered by `created_at` DESC

#### Scenario: Empty history
- **WHEN** a GET request is made and no history records exist
- **THEN** the system SHALL return HTTP 200 with an empty array `[]`

### Requirement: Delete test history endpoint
The system SHALL provide an API endpoint to delete a specific history record.

#### Scenario: Successful deletion
- **WHEN** a DELETE request is made to `/api/history?id=123`
- **THEN** the system SHALL delete the record with the specified id
- **AND** return HTTP 200 with message "Record deleted successfully"

#### Scenario: Record not found
- **WHEN** a DELETE request is made with a non-existent id
- **THEN** the system SHALL return HTTP 404 with error message "Record not found"

### Requirement: Clear all history endpoint
The system SHALL provide an API endpoint to clear all history records.

#### Scenario: Successful clear
- **WHEN** a DELETE request is made to `/api/history` without id parameter
- **THEN** the system SHALL delete all records from test_history table
- **AND** return HTTP 200 with message "All history cleared" and count of deleted records

### Requirement: 历史记录接口 MUST 迁移到外部 API 并保持行为一致
前端历史记录查询、保存、删除与清空能力 MUST 通过外部 Node API 调用，且保留原有请求参数与响应语义。

#### Scenario: 查询历史记录
- **WHEN** 前端调用外部 API `GET /api/history`（可选 `test_id`）
- **THEN** 系统 SHALL 返回按创建时间倒序的记录列表
- **THEN** 返回结构 SHALL 继续满足前端历史页渲染需求

#### Scenario: 保存历史记录
- **WHEN** 前端调用外部 API `POST /api/history` 并提交测试结果
- **THEN** 系统 SHALL 返回创建成功响应与新记录标识
- **THEN** 前端 SHALL 能立即将新记录纳入展示或后续查询

#### Scenario: 删除或清空历史记录
- **WHEN** 前端调用外部 API `DELETE /api/history?id=<id>` 或 `DELETE /api/history`
- **THEN** 系统 SHALL 保持原有删除成功与异常场景语义
- **THEN** 前端历史界面 SHALL 与迁移前交互一致
