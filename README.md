# Mind Mirror - 心理测试探索平台

基于 Next.js + TypeScript + Tailwind CSS + Zustand + MySQL 的心理测试平台，支持 MBTI 人格测试和城市匹配测试。

## 技术栈

- **Next.js 15**（App Router）
- **TypeScript**
- **Tailwind CSS**
- **Zustand**（状态管理）
- **MySQL**（数据持久化）
- **mysql2**（数据库驱动）
- **Next.js API Routes**（RESTful API）

## 项目结构

```
├── app/
│   ├── api/mbti/          # API：题库、提交答案
│   ├── mbti/               # MBTI 页面：介绍、测试、结果、历史
│   ├── layout.tsx
│   └── page.tsx
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
2. 复制 `.env.local` 并配置数据库连接信息：
   ```
   DATABASE_HOST=localhost
   DATABASE_PORT=3306
   DATABASE_USER=root
   DATABASE_PASSWORD=your-password
   DATABASE_NAME=mind_mirror
   ```
3. 启动应用时会自动创建数据库、表和初始数据

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

## 测试

```bash
npm test
```

覆盖题库加载、打分引擎、API 契约与历史存储等单元测试。

## 端到端自测建议

1. 打开 `/mbti`，点击「开始测试」。
2. 依次作答 4 题，使用「上一题/下一题」可修改答案，最后「提交结果」。
3. 在结果页查看类型、维度分布与免责声明；可「再测一次」或「历史记录」。
4. 刷新结果页或测试页，应能恢复进度或结果（sessionStorage）。
5. 在历史记录页查看列表与展开的维度分布。

## 规范与变更

本功能由 OpenSpec 变更 `mbti-test-website` 驱动，详见 `openspec/changes/mbti-test-website/`。
