#!/usr/bin/env bash
# 在 ECS 服务器上于项目根目录执行。
# 顺序：git pull → npm install → npm run build → pm2 restart mind-mirror
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

echo "[deploy] repo: $ROOT"
git pull
npm install
npm run build
pm2 restart mind-mirror
echo "[deploy] done"
