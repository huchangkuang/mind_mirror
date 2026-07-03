#!/usr/bin/env bash
# 在 ECS 服务器上于 monorepo 根目录执行。
# 顺序：git pull → pnpm install → prisma migrate → build → pm2 restart
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

WEB_APP="${WEB_APP:-mind-mirror-web}"
API_APP="${API_APP:-mind-mirror-api}"

echo "[deploy] repo: $ROOT"
git pull

# 与 package.json 中 packageManager 字段保持一致
REQUIRED_PNPM="10.6.5"
if ! command -v pnpm >/dev/null 2>&1 || [ "$(pnpm --version)" != "$REQUIRED_PNPM" ]; then
  echo "[deploy] installing pnpm@$REQUIRED_PNPM via corepack..."
  corepack enable
  corepack prepare pnpm@$REQUIRED_PNPM --activate
fi

# 限制 Node 内存避免 OOM，小内存服务器安装大型 monorepo 时容易被 kill
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=512}"
echo "[deploy] pnpm install..."
pnpm install --frozen-lockfile
pnpm --filter @mind-mirror/api prisma:generate
pnpm --filter @mind-mirror/api prisma:migrate:deploy
pnpm build

pm2 restart "$WEB_APP" "$API_APP" || {
  echo "[deploy] pm2 apps missing, start manually:"
  echo "  pm2 start pnpm --name $WEB_APP --cwd $ROOT/apps/web -- start:prod"
  echo "  pm2 start apps/api/dist/main.js --name $API_APP --cwd $ROOT/apps/api"
}

echo "[deploy] done"
