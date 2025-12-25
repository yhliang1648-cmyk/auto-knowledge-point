# 🚀 Auto Knowledge Point

自动化知识点生成与管理系统 - 基于 AI 的智能知识整理工具

## 📋 项目简介

Auto Knowledge Point 是一个自动化知识点提取、整理和管理的系统。通过 AI 技术，可以：

- ✅ 自动提取和整理知识点
- ✅ 智能分类和标签管理
- ✅ 支持多种格式导出
- ✅ 基于 AI 的内容分析
- ✅ 可视化知识图谱

## 🌐 在线访问

部署在 Cloudflare Pages，访问速度快，全球可达！

**网站地址：** `https://auto-knowledge-point.pages.dev`（部署后自动生成）

## 🚀 部署到 Cloudflare Pages

### 方法 1：通过 Cloudflare Dashboard（推荐）

1. **登录 Cloudflare**
   - 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - 登录你的账号

2. **创建 Pages 项目**
   - 在左侧菜单选择 `Workers & Pages`
   - 点击 `Create application`
   - 选择 `Pages` 标签
   - 点击 `Connect to Git`

3. **连接 GitHub 仓库**
   - 授权 Cloudflare 访问 GitHub
   - 选择仓库：`yhliang1648-cmyk/auto-knowledge-point`
   - 点击 `Begin setup`

4. **配置构建设置**
   ```
   项目名称: auto-knowledge-point（或自定义）
   生产分支: claude/connect-github-repo-Y7Rcj（或 main）
   构建命令: （留空）
   构建输出目录: .
   ```

5. **部署**
   - 点击 `Save and Deploy`
   - 等待几分钟，部署完成后会得到一个 URL
   - 例如：`https://auto-knowledge-point.pages.dev`

### 方法 2：使用 Wrangler CLI

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 部署项目
wrangler pages deploy . --project-name=auto-knowledge-point
```

## 🔧 本地开发

由于这是一个静态网站，可以直接用浏览器打开 `index.html`，或使用简单的 HTTP 服务器：

```bash
# Python 3
python -m http.server 8000

# Node.js (需要先安装 http-server)
npx http-server -p 8000
```

然后访问 `http://localhost:8000`

## 📁 项目结构

```
auto-knowledge-point/
├── index.html                    # 主页面
├── .cloudflare-pages.json       # Cloudflare Pages 配置
├── README.md                     # 项目说明
└── LICENSE                       # MIT 许可证
```

## 🔄 自动部署

配置完成后，每次推送到 GitHub 的指定分支，Cloudflare Pages 会自动构建和部署：

1. 推送代码到 GitHub
   ```bash
   git add .
   git commit -m "Update content"
   git push origin claude/connect-github-repo-Y7Rcj
   ```

2. Cloudflare 自动检测变更并部署
3. 几分钟后，更新就会生效

## 🎨 自定义域名（可选）

在 Cloudflare Pages 项目设置中，可以添加自定义域名：

1. 进入项目的 `Custom domains` 设置
2. 点击 `Set up a custom domain`
3. 输入你的域名（需要在 Cloudflare 管理 DNS）
4. 按照提示完成配置

## 📊 功能特性

- 🎯 **响应式设计** - 支持手机、平板、电脑等各种设备
- ⚡ **快速加载** - 静态 HTML，无需后端，加载速度极快
- 🌍 **全球 CDN** - Cloudflare 全球边缘节点，访问速度快
- 🔒 **自动 HTTPS** - Cloudflare 自动提供 SSL 证书

## 📝 许可证

MIT License © 2025 yhliang1648-cmyk

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📮 联系方式

- GitHub: [@yhliang1648-cmyk](https://github.com/yhliang1648-cmyk)
- 项目地址: [auto-knowledge-point](https://github.com/yhliang1648-cmyk/auto-knowledge-point)

---

**Powered by Claude AI & Cloudflare Pages** 🚀
