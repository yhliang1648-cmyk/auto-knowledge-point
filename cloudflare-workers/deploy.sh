#!/bin/bash

# Cloudflare Worker 一键部署脚本
# 使用 Wrangler CLI 部署 qwen-api-proxy Worker

echo "🚀 Cloudflare Worker 部署脚本"
echo "================================"
echo ""

# 检查是否安装了 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误：未检测到 Node.js"
    echo "请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"

# 检查是否安装了 npm
if ! command -v npm &> /dev/null; then
    echo "❌ 错误：未检测到 npm"
    exit 1
fi

echo "✅ npm 版本: $(npm -v)"
echo ""

# 安装 Wrangler CLI（如果未安装）
if ! command -v wrangler &> /dev/null; then
    echo "📦 正在安装 Wrangler CLI..."
    npm install -g wrangler

    if [ $? -ne 0 ]; then
        echo "❌ Wrangler 安装失败"
        echo "请手动安装: npm install -g wrangler"
        exit 1
    fi

    echo "✅ Wrangler 安装成功"
else
    echo "✅ Wrangler 已安装: $(wrangler --version)"
fi

echo ""
echo "================================"
echo "📋 部署前准备"
echo "================================"
echo ""

# 检查是否已登录 Cloudflare
echo "🔐 正在检查 Cloudflare 登录状态..."
if ! wrangler whoami &> /dev/null; then
    echo ""
    echo "⚠️  您尚未登录 Cloudflare"
    echo ""
    echo "请按以下步骤操作："
    echo "1. 运行命令: wrangler login"
    echo "2. 在浏览器中完成授权"
    echo "3. 重新运行此脚本"
    echo ""
    exit 1
fi

echo "✅ 已登录 Cloudflare"
echo ""

# 显示账户信息
echo "📊 账户信息:"
wrangler whoami
echo ""

# 确认部署
echo "================================"
echo "🎯 准备部署 Worker"
echo "================================"
echo ""
echo "Worker 名称: qwen-api-proxy"
echo "脚本文件: qwen-api-proxy.js"
echo ""
read -p "确认部署？(y/n): " confirm

if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "❌ 部署已取消"
    exit 0
fi

# 切换到 Worker 目录
cd "$(dirname "$0")"

# 部署 Worker
echo ""
echo "🚀 正在部署 Worker..."
echo ""

wrangler deploy

if [ $? -eq 0 ]; then
    echo ""
    echo "================================"
    echo "✅ 部署成功！"
    echo "================================"
    echo ""
    echo "您的 Worker URL:"
    echo "https://qwen-api-proxy.YOUR-USERNAME.workers.dev"
    echo ""
    echo "📝 下一步："
    echo "1. 复制上面的 Worker URL"
    echo "2. 打开 index.html 文件"
    echo "3. 找到第 826-851 行的 API 配置"
    echo "4. 修改以下配置："
    echo ""
    echo "   const USE_CORS_PROXY = false;"
    echo "   const CLOUDFLARE_WORKER_URL = '您的 Worker URL';"
    echo ""
    echo "5. 提交并推送代码到 GitHub"
    echo ""
else
    echo ""
    echo "❌ 部署失败"
    echo ""
    echo "可能的原因："
    echo "1. 账户权限不足"
    echo "2. Worker 名称已被占用"
    echo "3. 网络连接问题"
    echo ""
    echo "请查看上面的错误信息或尝试手动部署："
    echo "https://dash.cloudflare.com/"
    echo ""
    exit 1
fi
