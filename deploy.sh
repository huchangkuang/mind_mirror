#!/usr/bin/env bash
# 在 ECS 服务器上于 monorepo 根目录执行。
# 顺序：git pull → pnpm install → prisma migrate → build → pm2 restart
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

WEB_APP="${WEB_APP:-mind-mirror-web}"
API_APP="${API_APP:-mind-mirror-api}"
API_ENV="$ROOT/apps/api/.env"

read_env_value() {
  local file="$1"
  local key="$2"
  local line
  line="$(grep -E "^${key}=" "$file" | tail -1 || true)"
  line="${line#${key}=}"
  line="${line%\"}"
  line="${line#\"}"
  line="${line%\'}"
  line="${line#\'}"
  printf '%s' "$line"
}

ensure_api_env() {
  if [[ -f "$API_ENV" ]]; then
    if grep -qE '^DATABASE_URL=' "$API_ENV"; then
      return 0
    fi
    echo "[deploy] error: $API_ENV exists but DATABASE_URL is missing."
    exit 1
  fi

  local legacy_env="$ROOT/../mind_mirror_api/.env"
  if [[ -f "$legacy_env" ]] && grep -qE '^DATABASE_URL=' "$legacy_env"; then
    echo "[deploy] migrating API env from $legacy_env -> $API_ENV"
    mkdir -p "$(dirname "$API_ENV")"
    cp "$legacy_env" "$API_ENV"
    return 0
  fi

  local prod_env="$ROOT/.env.production"
  if [[ -f "$prod_env" ]]; then
    local db_url
    db_url="$(read_env_value "$prod_env" "DATABASE_URL")"
    if [[ -z "$db_url" ]]; then
      local host port user password name
      host="$(read_env_value "$prod_env" "DATABASE_HOST")"
      port="$(read_env_value "$prod_env" "DATABASE_PORT")"
      user="$(read_env_value "$prod_env" "DATABASE_USER")"
      password="$(read_env_value "$prod_env" "DATABASE_PASSWORD")"
      name="$(read_env_value "$prod_env" "DATABASE_NAME")"
      if [[ -n "$host" && -n "$user" && -n "$name" ]]; then
        port="${port:-3306}"
        echo "[deploy] generating $API_ENV from .env.production DATABASE_* vars"
        mkdir -p "$(dirname "$API_ENV")"
        {
          echo "PORT=3001"
          echo "FRONTEND_ORIGIN=${FRONTEND_ORIGIN:-http://localhost:3000}"
          echo "DATABASE_URL=\"mysql://${user}:${password}@${host}:${port}/${name}\""
          if grep -qE '^JWT_SECRET=' "$prod_env"; then
            grep -E '^(JWT_SECRET|JWT_REFRESH_SECRET|JWT_ACCESS_EXPIRES_IN|JWT_REFRESH_EXPIRES_IN)=' "$prod_env"
          else
            echo "# TODO: set JWT secrets"
            echo "JWT_SECRET=replace_me"
            echo "JWT_REFRESH_SECRET=replace_me"
            echo "JWT_ACCESS_EXPIRES_IN=15m"
            echo "JWT_REFRESH_EXPIRES_IN=30d"
          fi
        } > "$API_ENV"
        return 0
      fi
    else
      echo "[deploy] generating $API_ENV from .env.production DATABASE_URL"
      mkdir -p "$(dirname "$API_ENV")"
      cp "$prod_env" "$API_ENV"
      return 0
    fi
  fi

  cat <<EOF
[deploy] error: missing apps/api/.env (DATABASE_URL required for Prisma migrate).

One-time setup on server:
  cp apps/api/.env.example apps/api/.env
  # edit DATABASE_URL, JWT_SECRET, etc.

If you still have the old API repo:
  cp ../mind_mirror_api/.env apps/api/.env

Then re-run: ./deploy.sh
EOF
  exit 1
}

ensure_pm2_app() {
  local name="$1"
  shift
  if pm2 describe "$name" >/dev/null 2>&1; then
    echo "[deploy] pm2 restart $name"
    pm2 restart "$name" --update-env
  else
    echo "[deploy] pm2 start $name (first time)"
    pm2 start "$@" --name "$name" --update-env
  fi
}

echo "[deploy] repo: $ROOT"
git pull

ensure_api_env

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

ensure_pm2_app "$WEB_APP" pnpm --cwd "$ROOT/apps/web" -- start:prod
ensure_pm2_app "$API_APP" "$ROOT/apps/api/dist/main.js" --cwd "$ROOT/apps/api"
pm2 save

echo "[deploy] done"
