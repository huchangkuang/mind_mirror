#!/bin/bash
# ============================================
# 阿里云 Serverless FC 部署打包脚本
# ============================================

set -e  # 遇到错误立即退出

echo "🚀 开始构建 Next.js 应用..."
npm run build

echo "📦 准备部署包..."

# 清理旧的打包目录
rm -rf deploy-dist
mkdir -p deploy-dist

# ============================================
# 复制 standalone 运行所需文件
# ============================================

# 1. 复制 standalone 目录的所有内容（使用 . 确保包含隐藏文件）
#    注意：standalone 模式下 .next 目录包含关键的运行时文件
cd .next/standalone
cp -r * .[^.]* ../../deploy-dist/ 2>/dev/null || cp -r * ../../deploy-dist/
cd ../..

# 2. 复制静态资源（从外层 .next/static 复制，用于客户端静态文件）
#    这会合并到 .next/static 目录
cp -r .next/static deploy-dist/.next/ 2>/dev/null || true

# 3. 复制 public 目录的静态资源（如果存在）
cp -r public deploy-dist/ 2>/dev/null || true

# 4. 复制 package.json（用于依赖信息）
cp package.json deploy-dist/

# 5. 复制阿里云 FC 启动文件 bootstrap
cp bootstrap deploy-dist/
chmod +x deploy-dist/bootstrap

echo "📦 打包中..."
cd deploy-dist

# 创建 zip 包（用于阿里云 FC 代码包上传）
zip -r ../deploy.zip .

cd ..

# 输出包信息
echo ""
echo "✅ 打包完成！"
echo "📄 文件: deploy.zip"
echo "📊 大小: $(du -h deploy.zip | cut -f1)"
echo ""
echo "📤 部署步骤:"
echo "   1. 登录阿里云 FC 控制台 (https://fc.console.aliyun.com)"
echo "   2. 创建服务，然后创建函数"
echo "   3. 运行时选择: Custom Runtime"
echo "   4. 上传 deploy.zip 代码包"
echo "   5. 创建 HTTP 触发器"
echo ""
echo "🔧 函数配置:"
echo "   - 运行命令: 无需填写（使用 bootstrap 文件）"
echo "   - 监听端口: 9000"
echo "   - 内存: 512MB 或更高"
echo "   - 超时: 60秒"
echo ""
echo "🌐 访问: 创建HTTP触发器后会自动生成公网访问地址"
echo ""
echo "📋 启动命令说明:"
echo "   阿里云 FC Custom Runtime 会自动执行 bootstrap 文件"
echo "   bootstrap 内容: node server.js（监听 9000 端口）"
