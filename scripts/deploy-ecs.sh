#!/usr/bin/env bash
# 在 ECS 服务器上于项目根目录执行（或任意目录：脚本会 cd 到仓库根）。
# 顺序：git pull → npm install → npm run build → pm2 restart mind-mirror
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "[deploy-ecs] repo: $ROOT"
git pull
npm install
npm run build
pm2 restart mind-mirror
echo "[deploy-ecs] done"
