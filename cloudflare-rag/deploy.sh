#!/bin/bash
# Cloudflare RAG后端自动部署脚本
# 使用方法: chmod +x deploy.sh && ./deploy.sh

set -e  # 遇到错误立即退出

echo "======================================"
echo "  Cloudflare RAG 后端自动部署工具"
echo "======================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 步骤1: 检查依赖
echo -e "${YELLOW}[步骤 1/10]${NC} 检查依赖..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ 错误: 未安装 Node.js${NC}"
    echo "请访问 https://nodejs.org 安装 Node.js"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ 错误: 未安装 npm${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js 和 npm 已安装${NC}"
echo "   Node 版本: $(node --version)"
echo "   npm 版本: $(npm --version)"
echo ""

# 步骤2: 进入目录
echo -e "${YELLOW}[步骤 2/10]${NC} 进入 cloudflare-rag 目录..."
cd cloudflare-rag || {
    echo -e "${RED}❌ 错误: cloudflare-rag 目录不存在${NC}"
    exit 1
}
echo -e "${GREEN}✅ 成功进入目录${NC}"
echo ""

# 步骤3: 安装依赖
echo -e "${YELLOW}[步骤 3/10]${NC} 安装 npm 依赖..."
npm install
echo -e "${GREEN}✅ 依赖安装完成${NC}"
echo ""

# 步骤4: 安装wrangler
echo -e "${YELLOW}[步骤 4/10]${NC} 安装 Wrangler CLI..."
if ! command -v wrangler &> /dev/null; then
    npm install -g wrangler
fi
echo -e "${GREEN}✅ Wrangler 已安装${NC}"
echo "   Wrangler 版本: $(wrangler --version)"
echo ""

# 步骤5: 登录Cloudflare
echo -e "${YELLOW}[步骤 5/10]${NC} 登录 Cloudflare..."
echo "   请在浏览器中完成登录..."
wrangler login

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Cloudflare 登录成功${NC}"
else
    echo -e "${RED}❌ 登录失败，请重试${NC}"
    exit 1
fi
echo ""

# 步骤6: 创建D1数据库
echo -e "${YELLOW}[步骤 6/10]${NC} 创建 D1 数据库..."
echo "   正在创建数据库 dse_questions_db..."

D1_OUTPUT=$(wrangler d1 create dse_questions_db 2>&1)
echo "$D1_OUTPUT"

# 提取database_id
DATABASE_ID=$(echo "$D1_OUTPUT" | grep -oP 'database_id = "\K[^"]+' | head -1)

if [ -z "$DATABASE_ID" ]; then
    echo -e "${YELLOW}⚠️  数据库可能已存在，尝试获取现有数据库ID...${NC}"
    # 如果数据库已存在，尝试列出现有数据库
    wrangler d1 list
    echo ""
    echo -e "${YELLOW}请手动复制 dse_questions_db 的 database_id 并更新 wrangler.toml${NC}"
else
    echo -e "${GREEN}✅ D1 数据库创建成功${NC}"
    echo "   Database ID: $DATABASE_ID"

    # 更新wrangler.toml
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/database_id = \".*\"/database_id = \"$DATABASE_ID\"/" wrangler.toml
    else
        # Linux
        sed -i "s/database_id = \".*\"/database_id = \"$DATABASE_ID\"/" wrangler.toml
    fi
    echo -e "${GREEN}✅ wrangler.toml 已更新${NC}"
fi
echo ""

# 步骤7: 初始化数据库Schema
echo -e "${YELLOW}[步骤 7/10]${NC} 初始化数据库 Schema..."
wrangler d1 execute dse_questions_db --file=schema.sql

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 数据库 Schema 初始化成功${NC}"
else
    echo -e "${YELLOW}⚠️  Schema 初始化失败，可能已经初始化过${NC}"
fi
echo ""

# 步骤8: 创建R2存储桶
echo -e "${YELLOW}[步骤 8/10]${NC} 创建 R2 存储桶..."
wrangler r2 bucket create dse-pdfs 2>&1 || echo -e "${YELLOW}⚠️  存储桶可能已存在${NC}"
echo -e "${GREEN}✅ R2 存储桶就绪${NC}"
echo ""

# 步骤9: 创建KV命名空间
echo -e "${YELLOW}[步骤 9/10]${NC} 创建 KV 命名空间..."
KV_OUTPUT=$(wrangler kv:namespace create "CACHE" 2>&1)
echo "$KV_OUTPUT"

# 提取KV ID
KV_ID=$(echo "$KV_OUTPUT" | grep -oP 'id = "\K[^"]+' | head -1)

if [ -z "$KV_ID" ]; then
    echo -e "${YELLOW}⚠️  KV命名空间可能已存在，请手动更新 wrangler.toml${NC}"
else
    echo -e "${GREEN}✅ KV 命名空间创建成功${NC}"
    echo "   KV ID: $KV_ID"

    # 更新wrangler.toml
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/id = \"your-kv-namespace-id\"/id = \"$KV_ID\"/" wrangler.toml
    else
        sed -i "s/id = \"your-kv-namespace-id\"/id = \"$KV_ID\"/" wrangler.toml
    fi
    echo -e "${GREEN}✅ wrangler.toml 已更新${NC}"
fi
echo ""

# 步骤10: 创建Vectorize索引
echo -e "${YELLOW}[步骤 10/10]${NC} 创建 Vectorize 索引..."
wrangler vectorize create dse-questions-index \
  --dimensions=1536 \
  --metric=cosine 2>&1 || echo -e "${YELLOW}⚠️  Vectorize索引可能已存在${NC}"
echo -e "${GREEN}✅ Vectorize 索引就绪${NC}"
echo ""

# 显示最终配置
echo "======================================"
echo -e "${GREEN}  配置摘要${NC}"
echo "======================================"
echo "Database ID: $DATABASE_ID"
echo "KV ID: $KV_ID"
echo "R2 Bucket: dse-pdfs"
echo "Vectorize Index: dse-questions-index"
echo ""

# 询问是否部署
echo -e "${YELLOW}是否现在部署 Worker? (y/n)${NC}"
read -r deploy_now

if [ "$deploy_now" = "y" ] || [ "$deploy_now" = "Y" ]; then
    echo ""
    echo -e "${YELLOW}正在部署 Worker...${NC}"
    wrangler deploy

    if [ $? -eq 0 ]; then
        echo ""
        echo "======================================"
        echo -e "${GREEN}  🎉 部署成功！${NC}"
        echo "======================================"
        echo ""
        echo "您的 API 现在已经可以使用了！"
        echo ""
        echo "测试命令："
        echo "  curl https://dse-rag-api.your-subdomain.workers.dev/api/health"
        echo ""
    else
        echo -e "${RED}❌ 部署失败${NC}"
        exit 1
    fi
else
    echo ""
    echo "稍后可以运行以下命令部署："
    echo "  cd cloudflare-rag && wrangler deploy"
    echo ""
fi

echo "======================================"
echo -e "${GREEN}  ✅ 完成！${NC}"
echo "======================================"
echo ""
echo "接下来的步骤："
echo "1. 导入考题数据："
echo "   export CLOUDFLARE_ACCOUNT_ID=\"your-account-id\""
echo "   export CLOUDFLARE_API_TOKEN=\"your-api-token\""
echo "   export DATABASE_ID=\"$DATABASE_ID\""
echo "   npm run import:questions"
echo ""
echo "2. 查看完整文档："
echo "   cat README.md"
echo ""
echo "3. 监控 Worker 日志："
echo "   wrangler tail"
echo ""
