#!/usr/bin/env bash
# 兼容旧路径：转发到仓库根目录 deploy.sh
exec "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/deploy.sh"
