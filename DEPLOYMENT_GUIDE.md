# 🚀 快速部署指南

## 方式 A：通过 Cloudflare Dashboard（推荐，3 分钟完成）

### 步骤 1：访问 Cloudflare Dashboard
打开浏览器，访问：
```
https://dash.cloudflare.com/
```

### 步骤 2：进入 Workers & Pages
1. 登录你的 Cloudflare 账号
2. 点击左侧菜单的 `Workers & Pages`

### 步骤 3：创建 Pages 项目
1. 点击右上角 `Create application` 按钮
2. 选择 **`Pages`** 标签（重要！不是 Workers）
3. 点击 `Connect to Git`

### 步骤 4：连接 GitHub 仓库
1. 授权 Cloudflare 访问你的 GitHub 账号
2. 在仓库列表中选择：`yhliang1648-cmyk/auto-knowledge-point`
3. 点击 `Begin setup`

### 步骤 5：配置项目
```
项目名称 (Project name): dse-rag-system
生产分支 (Production branch): claude/connect-github-repo-Y7Rcj
框架预设 (Framework preset): None
构建命令 (Build command): (留空)
构建输出目录 (Build output directory): .
```

### 步骤 6：部署
1. 点击 `Save and Deploy`
2. 等待 1-2 分钟
3. 部署完成后会得到网站 URL：`https://dse-rag-system.pages.dev`

### 步骤 7：设置环境变量（可选）
如果需要配置 API keys：
1. 进入项目 Settings
2. 点击 `Environment variables`
3. 添加需要的变量

---

## 方式 B：通过命令行（高级用户）

### 前提条件
需要先登录 Cloudflare：
```bash
npx wrangler login
```

### 部署 Pages
```bash
npx wrangler pages deploy . --project-name=dse-rag-system
```

---

## 🔧 配置 Workers 后端（完整 RAG 功能）

要启用完整的 AI 搜索功能，需要部署 Workers API：

### 1. 创建 Vectorize 索引
```bash
npx wrangler vectorize create dse-questions-index \
  --dimensions=768 \
  --metric=cosine
```

### 2. 创建 KV 命名空间
```bash
npx wrangler kv:namespace create DSE_KV
```

记下返回的 ID，更新 `wrangler.toml` 中的：
```toml
[[kv_namespaces]]
binding = "DSE_KV"
id = "你的 KV ID"  # 替换这里
```

### 3. 部署 Workers
```bash
npm run deploy
# 或
npx wrangler deploy
```

### 4. 连接 Pages 和 Workers
在 Cloudflare Dashboard 中：
1. 进入你的 Pages 项目
2. Settings → Functions
3. 设置 Workers 路由

---

## 📋 部署检查清单

- [ ] Pages 已部署，可以访问网站
- [ ] Vectorize 索引已创建
- [ ] KV 命名空间已创建
- [ ] Workers API 已部署
- [ ] Pages 和 Workers 已连接
- [ ] 测试搜索功能正常

---

## 🌐 访问你的网站

部署成功后，你的网站将在以下地址可用：

**主要网址**：
```
https://dse-rag-system.pages.dev
```

**自定义域名**（如果配置）：
```
https://你的域名.com
```

---

## 🔄 自动部署

配置完成后，每次推送到 GitHub，Cloudflare 会自动部署：

```bash
git add .
git commit -m "Update content"
git push origin claude/connect-github-repo-Y7Rcj
```

几分钟后，更改会自动生效！

---

## ❓ 常见问题

### Q: 部署失败怎么办？
A: 检查 Cloudflare Dashboard 中的构建日志，查看具体错误信息。

### Q: 网站可以访问但搜索不工作？
A: 需要部署 Workers API 并连接到 Pages。参考上面的"配置 Workers 后端"部分。

### Q: 如何更新网站内容？
A: 直接修改代码并推送到 GitHub，Cloudflare 会自动重新部署。

### Q: 可以使用自定义域名吗？
A: 可以！在 Pages 项目的 Custom domains 设置中添加。

---

## 📞 获取帮助

- Cloudflare Docs: https://developers.cloudflare.com/pages/
- GitHub Issues: https://github.com/yhliang1648-cmyk/auto-knowledge-point/issues
