## ADDED Requirements

### Requirement: Monorepo MUST use pnpm workspace layout
系统 MUST 在单一 git 仓库内采用 pnpm workspace，并包含 `apps/web`、`apps/api` 两个应用包，包名分别为 `@mind-mirror/web` 与 `@mind-mirror/api`。

#### Scenario: Workspace packages are discoverable
- **WHEN** 开发者在仓库根目录执行 `pnpm install`
- **THEN** pnpm SHALL 链接 workspace 内所有包
- **THEN** `apps/web` 与 `apps/api` SHALL 可通过 `@mind-mirror/*` 引用 `packages/` 下共享包

### Requirement: Root scripts MUST orchestrate dev build and test
根目录 MUST 提供统一脚本，使开发者无需分别进入子目录即可联调与构建。

#### Scenario: Local dual-process development
- **WHEN** 开发者在根目录执行 `pnpm dev`
- **THEN** web 应用 SHALL 监听 `3000` 端口
- **AND** api 应用 SHALL 监听 `3001` 端口
- **THEN** 两个进程 SHALL 并行运行

#### Scenario: Monorepo build
- **WHEN** 开发者在根目录执行 `pnpm build`
- **THEN** 系统 SHALL 构建 `apps/web` 与 `apps/api` 的生产产物
- **THEN** 构建失败时 SHALL 返回非零退出码

### Requirement: ECS deployment MUST use single repository directory
生产部署 MUST 从单一 monorepo 目录完成 pull、install、migrate、build 与进程重启。

#### Scenario: Unified deploy pipeline
- **WHEN** 在 ECS 执行根目录 `deploy.sh`
- **THEN** 脚本 SHALL 执行 `pnpm install`、api 侧 Prisma migrate、全量 build
- **THEN** 脚本 SHALL 通过 pm2 重启 web 与 api 两个进程
