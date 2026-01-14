# 🚀 Cloudflare Pages 手动部署指南

## 方法一：通过 Cloudflare Dashboard 部署（推荐）

### 步骤 1：登录 Cloudflare Dashboard

访问：https://dash.cloudflare.com/

使用您的 Cloudflare 账号登录

---

### 步骤 2：进入 Pages 项目

1. 点击左侧菜单的 **"Workers & Pages"**
2. 找到您的项目 **"dse-rag-system"**
3. 点击进入项目详情页面

如果项目不存在，请参考 **方法二：创建新项目**

---

### 步骤 3：连接 GitHub 仓库（如果尚未连接）

1. 在项目页面点击 **"Settings"**（设置）
2. 选择 **"Builds & deployments"**
3. 点击 **"Connect to Git"**
4. 选择 **GitHub**
5. 授权 Cloudflare 访问您的 GitHub 账号
6. 选择仓库：**yhliang1648-cmyk/auto-knowledge-point**
7. 选择分支：**claude/connect-github-repo-Y7Rcj** 或 **main**

---

### 步骤 4：配置构建设置

在 **"Builds & deployments"** 页面：

| 配置项 | 值 |
|--------|-----|
| **Production branch** | `claude/connect-github-repo-Y7Rcj` 或 `main` |
| **Build command** | 留空（不需要构建） |
| **Build output directory** | `/` 或 `.` |
| **Root directory** | 留空 |

**重要**：因为这是静态 HTML 项目，不需要构建步骤！

---

### 步骤 5：触发部署

**方式 A：自动部署**
- 保存设置后，Cloudflare Pages 会自动检测 GitHub 仓库的更新
- 每次推送代码到配置的分支都会自动触发部署

**方式 B：手动部署**
1. 回到项目主页
2. 点击 **"Create deployment"** 按钮
3. 选择分支：**claude/connect-github-repo-Y7Rcj**
4. 点击 **"Save and Deploy"**

---

### 步骤 6：等待部署完成

- 部署通常需要 **1-3 分钟**
- 可以在 **"Deployments"** 标签查看部署状态
- 状态变为 **"Success"** 后即部署完成

---

### 步骤 7：访问网站

部署成功后，访问：

```
https://dse-rag-system.pages.dev
```

---

## 方法二：创建新的 Cloudflare Pages 项目

如果您还没有创建项目，请按照以下步骤操作：

### 步骤 1：进入 Cloudflare Pages

1. 登录 https://dash.cloudflare.com/
2. 点击 **"Workers & Pages"**
3. 点击 **"Create application"**
4. 选择 **"Pages"** 标签
5. 点击 **"Connect to Git"**

---

### 步骤 2：连接 GitHub 仓库

1. 选择 **GitHub**
2. 授权 Cloudflare（如需要）
3. 选择仓库：**yhliang1648-cmyk/auto-knowledge-point**
4. 点击 **"Begin setup"**

---

### 步骤 3：配置项目

| 配置项 | 值 |
|--------|-----|
| **Project name** | `dse-rag-system` |
| **Production branch** | `claude/connect-github-repo-Y7Rcj` 或 `main` |
| **Framework preset** | **None** |
| **Build command** | 留空 |
| **Build output directory** | `/` |
| **Root directory** | 留空 |

---

### 步骤 4：部署

1. 点击 **"Save and Deploy"**
2. 等待部署完成（1-3 分钟）
3. 访问生成的 URL：`https://dse-rag-system.pages.dev`

---

## 方法三：通过拖拽上传部署

如果无法连接 GitHub，可以直接上传文件：

### 步骤 1：准备文件

将以下文件和文件夹打包：
```
index.html
data/
  questions/
    all-questions.json
```

### 步骤 2：上传部署

1. 访问 https://dash.cloudflare.com/
2. 进入 **Workers & Pages**
3. 点击 **"Create application"** → **"Pages"**
4. 选择 **"Upload assets"**
5. 拖拽整个项目文件夹或选择文件
6. 输入项目名称：`dse-rag-system`
7. 点击 **"Deploy site"**

---

## ✅ 验证部署成功

### 1. 访问网站
打开：https://dse-rag-system.pages.dev

### 2. 检查 API 状态
页面顶部应该显示：
- 🟢 **"DeepSeek API 运行正常"**（绿色圆点）
- 显示响应时间和模型信息

### 3. 测试搜索功能
1. 在搜索框输入：**"数学概率"**
2. 点击 **"智能搜索"**
3. 应该能看到：
   - AI 智能解答（紫色背景区域）
   - 5 道相关考题列表

### 4. 查看控制台（F12）
打开浏览器开发者工具（按 F12），控制台应显示：
```
🚀 DSE RAG 系統啟動中...
🔑 DeepSeek API 已配置
✅ API 測試成功: {latency: "XXXms", ...}
✅ 已加載 21 道考題
✅ 系統就緒！
```

---

## 🐛 常见问题

### Q1: 部署失败，显示 "Build failed"
**原因**：配置了不必要的构建命令

**解决**：
1. 进入项目 Settings → Builds & deployments
2. 确保 **Build command** 为空
3. 确保 **Build output directory** 设置为 `/` 或 `.`
4. 重新部署

### Q2: 部署成功但访问 404
**原因**：输出目录配置错误

**解决**：
1. 检查 **Build output directory** 是否为 `/` 或 `.`
2. 确保 `index.html` 在项目根目录
3. 重新部署

### Q3: 网站打开但显示 "无法加载考题数据"
**原因**：`data/questions/all-questions.json` 文件缺失或路径错误

**解决**：
1. 检查 GitHub 仓库中是否包含 `data/questions/all-questions.json`
2. 确保文件路径正确
3. 重新部署

### Q4: API 状态显示红色错误
**原因**：
- DeepSeek API Key 无效
- 网络 CORS 问题
- API 配额用尽

**解决**：
1. 检查 API Key 是否正确（在 `index.html` 第 416 行）
2. 在浏览器控制台查看详细错误信息
3. 访问 https://www.deepseek.com/ 检查 API 状态

### Q5: 自动部署未触发
**原因**：GitHub 集成未正确配置

**解决**：
1. 检查 Settings → Builds & deployments
2. 确保 **Production branch** 设置正确
3. 手动点击 **"Retry deployment"**

---

## 📞 需要帮助？

如果遇到其他问题：

1. **查看部署日志**：
   - 在 Cloudflare Dashboard 的 Deployments 页面
   - 点击具体的部署记录查看详细日志

2. **Cloudflare 文档**：
   - https://developers.cloudflare.com/pages/

3. **GitHub 仓库**：
   - https://github.com/yhliang1648-cmyk/auto-knowledge-point

---

## 🎉 部署成功后

恭喜！您的 DSE 考题智能检索系统已经成功部署！

**网站地址**：https://dse-rag-system.pages.dev

**主要功能**：
- ✅ 智能关键词搜索
- ✅ DeepSeek AI 生成专业解答
- ✅ 科目和年份筛选
- ✅ 21 道 DSE 历届考题
- ✅ 实时 API 状态监控

**下一步**：
- 添加更多考题到 `data/questions/all-questions.json`
- 自定义网站样式
- 优化搜索算法

祝您使用愉快！🎓
