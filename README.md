# Mind Mirror - 心理测试探索平台

pnpm monorepo：Next.js 前端 + NestJS API + 共享数据/类型包。

## 技术栈

- **pnpm workspace**（monorepo）
- **Next.js 15**（`apps/web`）
- **NestJS 11 + Prisma**（`apps/api`）
- **TypeScript**、**Tailwind CSS**、**Zustand**
- **MySQL**（仅 API 层通过 Prisma 访问）

## 项目结构

```
├── apps/
│   ├── web/                 @mind-mirror/web   Next.js 前端 (:3000)
│   └── api/                 @mind-mirror/api   NestJS API (:3001)
├── packages/
│   ├── data/                @mind-mirror/data   共享题库 JSON
│   └── shared/              @mind-mirror/shared 跨端类型契约
├── pnpm-workspace.yaml
├── deploy.sh                ECS 单目录部署
└── openspec/
```

## 本地开发

### 前置条件

- Node.js 20+
- pnpm 10+（`corepack enable && corepack prepare pnpm@10.6.5 --activate`）
- MySQL（供 API 使用）

### 配置

1. 复制 `apps/api/.env.example` → `apps/api/.env`，填写 `DATABASE_URL`、JWT 等
2. 可选：在 `apps/web/.env.local` 设置：
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
   ```

### 启动

```bash
pnpm install
pnpm dev          # 并行启动 web :3000 + api :3001
```

访问 [http://localhost:3000](http://localhost:3000)

### 其他命令

```bash
pnpm build        # 构建 shared + web + api
pnpm test         # 各包测试
pnpm sync:data    # 将 packages/data 同步到 web/public/data
```

## 生产部署 (ECS)

单仓库目录执行 `./deploy.sh`：

1. `git pull`
2. `pnpm install`
3. Prisma migrate + generate
4. `pnpm build`
5. pm2 重启 `mind-mirror-web` 与 `mind-mirror-api`

**Nginx**：将同源 `/api/v1/*` 反代至 API `:3001`；或构建 web 时设置 `NEXT_PUBLIC_API_BASE_URL`。

## API 说明

- 前端统一通过 `apps/web/lib/api/client.ts` 调用后端
- 路径映射：`/api/*` → `/api/v1/*`（外部 NestJS）
- 题库数据单一来源：`packages/data`（构建/开发时同步至 `public/data`）

## 测试

```bash
pnpm test
```

## 规范与变更

OpenSpec 变更见 `openspec/changes/`。当前 monorepo 集成：`integrate-web-and-api-monorepo`。
