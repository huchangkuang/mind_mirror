## Context

当前需要从零开始实现一个基于 Next.js + TypeScript 的 MBTI 测试网站，既包含前端交互页面，也包含一部分后端 API 能力。根据 proposal，本项目强调：良好的测试体验（进度、反馈）、可扩展的题库与打分逻辑、结果可视化、以及前端状态管理的清晰性。现有项目中尚未有与 MBTI 相关的模块，因此属于新增垂直能力，但会在整体技术选型和目录结构上影响后续扩展。

主要约束与背景：
- 使用 Next.js（优先使用 App Router），配合 TypeScript 与 Tailwind CSS。
- 使用 Zustand 作为前端状态管理方案。
- API 使用 Next.js 内置的 API Router（`app/api` 或 `pages/api`，优先考虑 App Router 风格）。
- 初期用户匿名访问即可，无登录/鉴权要求，测试记录仅存于浏览器本地。
- 部署目标为静态/边缘友好的 Next.js 部署（如 Vercel），避免复杂的长连接依赖。

## Goals / Non-Goals

**Goals:**
- 实现一个完整的 MBTI 测试流程：从进入测试、作答、提交到查看结果和历史记录。
- 设计清晰的前端架构，包括页面结构、组件划分、hooks 与 Zustand store。
- 定义 MBTI 题库与打分引擎的数据模型，支持多题目版本扩展。
- 通过 Next.js API Router 暴露统一的题目/提交接口，前端通过 fetch/axios 调用。
- 提供现代化的 UI（移动端与桌面端自适应），并为结果提供简单可视化展示。
- 为未来引入用户系统、多语言支持等能力预留清晰的扩展点。

**Non-Goals:**
- 不实现复杂的账号体系、登录注册或第三方 OAuth，只做匿名使用场景。
- 不实现后台管理控制台（如在线编辑题库、可视化数据后台），题库初期以静态配置或简单 JSON 文件形式维护。
- 不做大规模数据分析或推荐算法，仅提供基于 MBTI 维度的基础解释与可视化。
- 不实现 SSR/SEO 极致优化，仅保证主要页面在 Next.js 默认能力下正常渲染。

## Decisions

1. **Next.js App Router + TypeScript 结构**
   - 采用 `app/` 目录结构：`app/(marketing)` 放营销/介绍页，`app/mbti` 放测试相关页面，如 `app/mbti/page.tsx`（介绍/开始）、`app/mbti/test/page.tsx`（测试作答）、`app/mbti/result/page.tsx`（结果展示）、`app/mbti/history/page.tsx`（历史记录）。
   - 优点：利用 App Router 的布局系统和 server component 能力；TS 提升类型安全和协作效率。

2. **Zustand 作为测试流程状态管理**
   - 设计 `useMbtiStore`，存储字段包括：题目列表、当前题目索引、用户答案映射、计算出的维度得分、当前测试会话 ID、是否已提交等。
   - 通过 action 完成：初始化题目、回答某题、跳转下一题/上一题、提交测试、重置测试。
   - 选择 Zustand 而不是 Redux：API 简单、样板代码少、与 Next.js + hooks 配合良好。

3. **题库与打分引擎的数据模型**
   - 题目结构示例：`{ id, text, options: [{ value, label }], dimensionWeights: { EI: +1/-1, SN: ..., TF: ..., JP: ... } }`。
   - 通过对每道题的 `dimensionWeights` 累加，最终得到四个维度的正负得分，再映射为 MBTI 字母（例如 EI > 0 则 E，否则 I）。
   - 初期题库存放在后端（如 `data/mbti/questions.json`），由 API 读取并返回前端；后续可替换为数据库或远端服务。

4. **Next.js API Router 设计**
   - 规划端点：
     - `GET /api/mbti/questions`：返回当前版本题库列表和元信息（版本号、题目数量、预计完成时间）。
     - `POST /api/mbti/submit`：接收用户答案与版本信息，在服务端进行打分并返回结果（MBTI 类型、各维度分数、简单解释）。
   - 请求/响应使用 JSON，错误通过 HTTP 状态码 + `errorCode` 字段统一约定。
   - 初期也可以在前端本地完成打分，仅将 `/api/mbti/questions` 作为后端数据源；是否将打分逻辑放在服务端可在实现阶段再做取舍。

5. **UI 与 Tailwind 设计**
   - 建立基础布局组件（如 `Layout`、`Card`、`Button`、`ProgressBar`），使用 Tailwind 的 utility class。
   - 测试页使用进度条和题目卡片式布局，支持键盘/点击作答。
   - 结果页使用简单图表（如基于纯 CSS 或引入轻量图表库）展示四个维度的强度，并配合文字解释。

6. **本地历史记录存储方案**
   - 使用 `localStorage` 以 key（如 `mbti-test-history`）存储最近 N 次测试结果数组。
   - 每条记录包括：时间戳、MBTI 类型、各维度分数、版本号、可选的备注。
   - 在 `app/mbti/history` 页面读取并渲染，支持简单筛选/排序（按时间倒序）。

## Risks / Trade-offs

- **风险：前后端打分逻辑不一致**
  - 取舍：若既支持前端打分又支持服务端打分，需保证算法完全一致，否则可能出现结果偏差。
  - 缓解：将打分函数抽象为可共享模块（如 `lib/mbti/scoring.ts`），被前端和 API Handler 共同引用。

- **风险：题库扩展后维护成本上升**
  - 取舍：静态 JSON 结构简单，但随着题目版本增多，可能难以管理。
  - 缓解：在题库模型中提前加入 `version`、`category` 等字段，并在代码中以清晰的类型（TypeScript 类型定义）约束结构，未来可以平滑迁移到数据库。

- **风险：Zustand 状态与 URL 路由脱节**
  - 取舍：用户在浏览器前进/后退或刷新时，可能导致状态丢失或不一致。
  - 缓解：在测试关键状态（当前题目、答案）上加上轻量的 URL 参数或 sessionStorage 持久化机制，并在页面加载时尝试恢复状态。

- **风险：UI/UX 复杂度导致实现时间拉长**
  - 取舍：过多动画和复杂图表会增加实现成本和性能风险。
  - 缓解：首版只实现简洁、响应式的布局和基础可视化，复杂特效延后迭代。
