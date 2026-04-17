## ADDED Requirements

### Requirement: Hero 区域展示
首页 SHALL 展示 Hero 区域，包含品牌标题、副标题和 CTA 按钮。

#### Scenario: 用户访问首页
- **WHEN** 用户访问首页
- **THEN** 系统 SHALL 显示 Hero 区域
- **AND** Hero 区域包含 "Mind Mirror" 品牌标题
- **AND** 显示副标题 "探索你的性格类型"
- **AND** 显示 "开始测试" CTA 按钮

### Requirement: MBTI 介绍模块
首页 SHALL 包含 MBTI 简介模块，解释 MBTI 的背景和价值。

#### Scenario: 用户滚动到介绍区域
- **WHEN** 用户滚动到 MBTI 介绍区域
- **THEN** 系统 SHALL 显示 MBTI 定义
- **AND** 解释四个维度概念
- **AND** 说明测试的应用场景

### Requirement: 四维度展示
首页 SHALL 以卡片形式展示 MBTI 四个维度。

#### Scenario: 用户查看维度卡片
- **WHEN** 用户查看维度区域
- **THEN** 系统 SHALL 显示四个维度卡片：E/I、S/N、T/F、J/P
- **AND** 每个卡片包含维度名称、两个对立面和简短描述

### Requirement: 特色亮点展示
首页 SHALL 展示测试的特色亮点。

#### Scenario: 用户查看特色区域
- **WHEN** 用户查看特色亮点区域
- **THEN** 系统 SHALL 显示三个特色卡片
- **AND** 包括：科学可靠、快速完成、免费使用

### Requirement: 深色模式支持
首页 SHALL 支持深色模式显示。

#### Scenario: 系统处于深色模式
- **WHEN** 系统偏好为深色模式
- **THEN** 页面 SHALL 自动切换到深色主题
- **AND** 所有文字对比度 SHALL ≥ 4.5:1
- **AND** 玻璃拟态效果 SHALL 保持可见

### Requirement: 响应式布局
首页 SHALL 在移动设备上正常显示。

#### Scenario: 用户在手机上访问
- **WHEN** 视口宽度 < 768px
- **THEN** 页面 SHALL 调整为单列布局
- **AND** 触控目标 SHALL ≥ 44px
- **AND** 文字 SHALL 保持可读性

### Requirement: 首页提供 Android APP 下载模块
首页 SHALL 新增 Android APP 下载模块，并在浅色与深色主题、桌面与移动端下保持可读且可操作；模块 MUST 包含用于直接下载 APK 的可点击入口。

#### Scenario: 首页展示下载模块
- **WHEN** 用户访问首页
- **THEN** 系统 SHALL 在首页渲染 Android 下载模块
- **AND** 模块包含“下载 Android 版”或等价语义按钮

#### Scenario: 移动端下载按钮可触达
- **WHEN** 用户在移动端查看首页下载模块
- **THEN** 下载按钮 SHALL 保持可见且可点击
- **AND** 按钮点击后 SHALL 导航到 APK 下载地址
