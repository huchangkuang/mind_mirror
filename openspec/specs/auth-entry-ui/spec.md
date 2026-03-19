## ADDED Requirements

### Requirement: 首页顶部 Header 展示认证与反馈入口
系统 MUST 在首页顶部使用透明白/毛玻璃风格 Header 展示统一用户状态区，并根据登录态切换展示内容；Header MUST 包含「反馈与建议」入口。

#### Scenario: 未登录状态展示
- **WHEN** 用户未建立有效会话并访问首页
- **THEN** 系统 SHALL 在 Header 中展示「登录」「注册」入口与「反馈与建议」入口

#### Scenario: 已登录状态展示
- **WHEN** 用户已建立有效会话并访问首页
- **THEN** 系统 SHALL 在 Header 中展示用户信息摘要与「反馈与建议」入口

#### Scenario: 反馈入口可访问
- **WHEN** 用户点击首页 Header 中的「反馈与建议」入口
- **THEN** 系统 SHALL 跳转至反馈与建议页面

### Requirement: 系统提供登录注册页面并支持流程切换
系统 MUST 提供独立认证页面，允许用户在登录与注册流程之间切换且保持可用性一致。

#### Scenario: 从登录切换到注册
- **WHEN** 用户在认证页面点击"去注册"入口
- **THEN** 系统 SHALL 切换到注册表单并展示对应字段与提交动作

#### Scenario: 从注册切换到登录
- **WHEN** 用户在认证页面点击"去登录"入口
- **THEN** 系统 SHALL 切换到登录表单并展示对应字段与提交动作
