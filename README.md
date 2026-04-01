# Mind Mirror - 心理测试探索平台

基于 Next.js + TypeScript + Tailwind CSS + Zustand + MySQL 的心理测试平台，支持 MBTI 人格测试和城市匹配测试。

## 技术栈

- **Next.js 15**（App Router）
- **TypeScript**
- **Tailwind CSS**
- **Zustand**（状态管理）
- **MySQL**（数据持久化）
- **mysql2**（数据库驱动）
- **外部 Node API 服务**（RESTful API，生产默认同源；开发环境回退 `http://localhost:3001`）

## 项目结构

```
├── app/
│   ├── api/               # 兼容层（逐步弃用，详见 app/api/README.md）
│   ├── mbti/               # MBTI 页面：介绍、测试、结果、历史
│   ├── layout.tsx
│   └── page.tsx
├── lib/api/client.ts       # 统一 API 客户端（base URL、超时、错误语义）
├── components/ui/          # 通用 UI：Button、Card、ProgressBar
├── lib/mbti/               # 题库类型、加载、打分、历史存储、类型说明
├── stores/                 # Zustand：mbti-store
├── data/mbti/              # 题库 JSON（服务端）
├── public/data/mbti/       # 题库 JSON（静态/客户端可选）
└── openspec/               # OpenSpec 变更与规范
```

## 数据库配置

数据库会自动初始化，无需手动执行 SQL 脚本。

### 本地开发环境

1. 确保本地 MySQL 已安装并运行
2. 复制 `.env.local` 并配置数据库连接信息与 API 地址：
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
   NEXT_PUBLIC_API_TIMEOUT_MS=10000
   DATABASE_HOST=localhost
   DATABASE_PORT=3306
   DATABASE_USER=root
   DATABASE_PASSWORD=your-password
   DATABASE_NAME=mind_mirror
   ```
3. 确保同级目录 `mind_mirror_api` 已启动（默认 3001 端口）
4. 启动应用时会自动创建数据库、表和初始数据

### 生产环境 (ECS)

1. 复制 `.env.production` 并填写实际配置
2. 确保 ECS 服务器上的 MySQL 可访问
3. 启动应用时会自动完成数据库初始化

## 启动方式

```bash
# 安装依赖
npm install

# 开发
npm run dev

# 构建
npm run build

# 生产运行
npm start
```

开发环境下访问 [http://localhost:3000](http://localhost:3000)，首页可进入 MBTI 测试或城市匹配测试。

## 前后端联调与迁移说明

- 前端所有运行时业务请求统一通过 `lib/api/client.ts` 访问外部后端。
- 若未配置 `NEXT_PUBLIC_API_BASE_URL`，生产默认同源（`/api/...`）；开发环境回退到 `http://localhost:3001`。
- `app/api/*` 仅保留兼容用途，不再作为新增能力入口。
- 迁移清单、字段映射与回滚检查见 `docs/external-api-migration.md`。

## 反馈与建议

- 页面路径：`/feedback`。首页顶部 **Site Header** 可进入「反馈与建议」，并提供 **登录 / 注册**（透明白 + 毛玻璃风格，与原有登录按钮一致）。
- **评论**：登录用户可发布；未登录点击发布或点赞会跳转到 `/auth?next=/feedback&mode=login`（登录成功后回跳）。
- **排序**：默认按 **热度**（点赞数 + 时间衰减）；可切换 **最近**（按发布时间倒序）。
- **实时列表**：页面每约 5 秒轮询刷新（仅在前台标签页时请求）；发布成功后立即刷新。
- **点赞**：登录用户可点赞 / 取消；服务端保证同一用户对同一评论仅一条点赞记录。
- **管理员删除**：用户名白名单见 `lib/feedback/admin.ts`（当前含 `15967537583`，与注册用户名一致）。白名单用户可在反馈页删除评论；删除前写入表 `feedback_moderation_log`，并输出一行结构化 `console.info` 审计日志。

相关 API：`GET/POST /api/feedback/comments`，`POST /api/feedback/comments/[id]/like`，`DELETE /api/feedback/comments/[id]`（仅白名单）。

## 测试

```bash
npm test
```

覆盖题库加载、打分引擎、API 契约、认证路由与反馈模块等单元测试。

## 端到端自测建议

1. 打开 `/mbti`，点击「开始测试」。
2. 依次作答 4 题，使用「上一题/下一题」可修改答案，最后「提交结果」。
3. 在结果页查看类型、维度分布与免责声明；可「再测一次」或「历史记录」。
4. 刷新结果页或测试页，应能恢复进度或结果（sessionStorage）。
5. 在历史记录页查看列表与展开的维度分布。

## 规范与变更

本功能由 OpenSpec 变更 `mbti-test-website` 驱动，详见 `openspec/changes/mbti-test-website/`。
