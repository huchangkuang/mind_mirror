## ADDED Requirements

### Requirement: 用户可以注册并创建可用账户
系统 MUST 提供注册能力，并在输入有效且账户未被占用时创建新用户。

#### Scenario: 注册成功
- **WHEN** 用户在注册表单提交合法的账号信息（如用户名/邮箱与密码）
- **THEN** 系统 SHALL 创建新用户账户并返回可用登录状态或登录引导

#### Scenario: 注册被拒绝
- **WHEN** 用户提交已存在的账号标识或不满足密码规则的输入
- **THEN** 系统 SHALL 返回明确错误信息且不得创建账户

### Requirement: 用户可以登录并建立会话
系统 MUST 在用户凭证正确时创建会话，并在后续请求中识别该登录状态。

#### Scenario: 登录成功
- **WHEN** 用户提交正确账号凭证
- **THEN** 系统 SHALL 创建有效会话并将用户标记为已登录

#### Scenario: 登录失败
- **WHEN** 用户提交错误账号或密码
- **THEN** 系统 SHALL 返回认证失败信息且不得创建会话

### Requirement: 用户可以登出并终止会话
系统 MUST 支持主动登出，并在登出后使当前会话失效。

#### Scenario: 登出成功
- **WHEN** 已登录用户执行登出操作
- **THEN** 系统 SHALL 失效当前会话并在后续请求中将用户识别为未登录

### Requirement: 认证用户信息包含展示用昵称

系统 MUST 在登录成功、注册成功及 `/api/auth/me` 响应中，为已认证用户返回 `nickname` 字段；该字段 SHALL 为展示用昵称：若用户未设置昵称，则其值 SHALL 等于 `username`。

#### Scenario: 未设置昵称时 me 与登录响应

- **WHEN** 用户数据库中昵称为空且用户已完成登录或调用 `/api/auth/me`
- **THEN** 响应中的 `user.nickname` SHALL 等于 `user.username`

#### Scenario: 已设置昵称时 me 响应

- **WHEN** 用户已保存自定义昵称
- **THEN** `/api/auth/me` 返回的 `user.nickname` SHALL 等于该自定义昵称
- **AND** `user.username` SHALL 仍为登录账号

### Requirement: 已登录用户可通过 API 更新昵称

系统 MUST 提供需认证的接口，使已登录用户能够更新自己的展示昵称；更新成功后后续 `/api/auth/me` SHALL 反映新值。

#### Scenario: 更新昵称成功

- **WHEN** 已登录用户提交合法昵称
- **THEN** 系统 SHALL 持久化并返回成功
- **AND** 下一次 `/api/auth/me` SHALL 返回更新后的 `nickname`

#### Scenario: 未认证不得更新

- **WHEN** 未携带有效会话的请求尝试更新昵称
- **THEN** 系统 SHALL 拒绝请求（如 HTTP 401）
- **AND** 用户数据 SHALL 不被修改

### Requirement: 已登录用户可通过 API 修改密码

系统 MUST 提供需认证的接口，使用当前密码与新密码修改账户密码哈希；规则 SHALL 与注册密码校验一致或更严。

#### Scenario: 修改密码成功

- **WHEN** 已登录用户提供正确当前密码与合法新密码
- **THEN** 系统 SHALL 更新 `password_hash`
- **AND** 旧密码 SHALL 不再可用于登录

#### Scenario: 当前密码错误

- **WHEN** 当前密码不匹配
- **THEN** 系统 SHALL 拒绝请求且不更新哈希

### Requirement: 整页刷新后会话驱动的客户端状态与服务器一致

在用户使用浏览器整页刷新（含首次导航后硬刷新）时，系统 MUST 依据当前有效的服务端会话（与 Cookie 关联）恢复客户端所展示的登录状态；只要会话未过期且未被撤销，界面 SHALL 将用户识别为已登录并展示与 `/api/auth/me` 一致的用户信息（包含 `username` 与展示用 `nickname`）。

#### Scenario: 有效会话下刷新后仍为已登录

- **WHEN** 用户已登录且会话 Cookie 仍然有效
- **THEN** 用户执行整页刷新后，客户端 SHALL 在完成会话校验后呈现已登录状态，且用户名与昵称等信息与服务器返回一致

#### Scenario: 无会话或会话失效时刷新后为未登录

- **WHEN** 用户未持有有效会话 Cookie，或会话已过期/已登出
- **THEN** 用户执行整页刷新后，客户端 SHALL 呈现未登录状态，且不得显示上一用户的敏感身份细节

### Requirement: 认证接口 MUST 支持跨域外部 API 调用并维持会话一致性
前端注册、登录、登出、会话查询与资料更新在迁移到外部 Node API 后 MUST 保持既有认证语义，并满足跨域凭证传递要求。

#### Scenario: 登录后会话可被继续识别
- **WHEN** 前端通过外部 API 完成登录并携带凭证策略发起后续请求
- **THEN** `/api/auth/me` SHALL 返回已登录用户信息
- **THEN** 客户端登录状态 SHALL 与服务器会话状态一致

#### Scenario: 登出后会话失效
- **WHEN** 前端通过外部 API 调用登出接口
- **THEN** 当前会话 SHALL 被服务端失效
- **THEN** 后续会话查询 SHALL 返回未登录状态

### Requirement: 认证失败响应 MUST 维持可处理错误语义
迁移后若认证请求失败，系统 MUST 返回可识别的错误响应，确保前端可继续使用既有提示与拦截逻辑。

#### Scenario: 凭证无效或会话过期
- **WHEN** 前端调用需认证接口但凭证无效
- **THEN** 系统 SHALL 返回明确的认证失败状态（如 401）
- **THEN** 前端 SHALL 能触发统一未登录处理流程
