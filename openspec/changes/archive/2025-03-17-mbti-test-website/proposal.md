## Why

为了提供一个简单、有趣、可在浏览器端直接完成的 MBTI 性格测试体验，本项目希望基于现代前端技术栈（Next.js + TypeScript + Tailwind + Zustand + API Router）搭建一个响应迅速、可扩展、易于后续增加题库与分析维度的测试网站。相比于网络上大量低质量或交互陈旧的 MBTI 测试，本网站将更加关注题目质量、测试流程体验和结果可视化呈现。

## What Changes

- 新增一个独立的 MBTI 测试站点，基于 Next.js (App Router) + TypeScript 搭建前端与后端 API。
- 使用 Tailwind CSS 构建现代化、自适应的 UI，包括开始页、测试进行页、结果展示页、历史记录页等。
- 通过 Next.js API Router 暴露测试相关 API（拉取题目、提交答案、获取结果解释），支持前后端分离和未来扩展。
- 使用 Zustand 管理前端测试状态（当前题目索引、用户作答、进度、计时等），保证状态可预测且易于调试。
- 支持基于题目维度得分计算 MBTI 四个字母（E/I、S/N、T/F、J/P），并以图表或分布条形式可视化呈现。
- 支持在浏览器本地存储（如 localStorage）中保存最近几次测试记录，方便用户回顾对比。
- 为未来多语言、不同测试版本（短版/长版）和账号体系预留扩展点。

## Capabilities

### New Capabilities
- `mbti-test-flow`: 定义从进入测试到提交答案、查看结果的完整前端交互和状态流，包括进度控制、题目导航和异常恢复。
- `mbti-question-bank`: 定义 MBTI 题库的结构（题干、选项、维度权重、版本等）及从后端获取题库的方式。
- `mbti-scoring-engine`: 定义如何根据回答选项累加各维度得分，并映射为最终 MBTI 类型及强度百分比。
- `mbti-result-insight`: 定义结果页的呈现方式，包括类型说明、四个维度的分布图、优劣势摘要等。
- `mbti-history-storage`: 定义如何在前端本地存储测试记录（匿名）、读取与展示历史记录列表与详情。
- `mbti-api-contract`: 定义 Next.js API Router 暴露的接口（如 `/api/mbti/questions`、`/api/mbti/submit`）的请求/响应结构与错误约定。

### Modified Capabilities
- `<existing-name>`: <what requirement is changing>

## Impact

- **前端代码**：在 Next.js 应用中新增与 MBTI 测试相关的页面、组件、hooks 和 Zustand store，集成 Tailwind 的设计体系。
- **后端/API**：增加一组 MBTI 测试相关 API Router 端点，负责题库提供、答案接收与结果计算（若采用服务端计算方案）。
- **状态管理**：Zustand 将成为测试流程的核心状态容器，需设计清晰的 store 结构与 action。
- **依赖与配置**：需要在项目中安装与配置 Next.js、TypeScript、Tailwind CSS、Zustand 等依赖，并可能添加图表库（如 Recharts 或 Chart.js）用于结果可视化。
- **后续扩展**：为用户登录、云端存储测试历史、多语言支持等潜在功能预留接口和结构，使后续迭代不破坏当前能力边界。
