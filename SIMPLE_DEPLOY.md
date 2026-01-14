# 🚀 超简单部署指南

## 5 分钟完成部署！

### 第 1 步：打开 Cloudflare

在浏览器中打开：**https://dash.cloudflare.com/**

登录你的账号（没有账号就免费注册一个）

---

### 第 2 步：进入 Workers & Pages

在左侧菜单找到并点击：**Workers & Pages**

---

### 第 3 步：创建新项目

1. 点击右上角蓝色按钮：**Create application**
2. **重要！** 选择顶部的 **Pages** 标签（不是 Workers）
3. 点击：**Connect to Git**

---

### 第 4 步：连接 GitHub

1. 点击 **Connect GitHub** 或 **Connect account**
2. 授权 Cloudflare 访问你的 GitHub
3. 在仓库列表中找到：`yhliang1648-cmyk/auto-knowledge-point`
4. 点击旁边的 **Begin setup** 按钮

---

### 第 5 步：配置项目

复制粘贴以下配置：

```
Project name: dse-rag-system
Production branch: claude/connect-github-repo-Y7Rcj
Framework preset: None
Build command: (留空，不填)
Build output directory: .
```

**重要提示：**
- Build output directory 只填一个点：`.`
- Build command 留空

---

### 第 6 步：点击部署

点击底部的 **Save and Deploy** 按钮

等待 1-2 分钟...

---

### 🎉 完成！

部署成功后，你会看到一个绿色的成功消息和网址：

```
https://dse-rag-system.pages.dev
```

或者类似的网址。**这就是你的 DSE RAG 系统！**

点击网址就能访问了！

---

## 💡 测试网站

打开网站后：

1. 在搜索框输入："氣候變化"
2. 点击 "智能搜索"
3. 查看搜索结果（目前使用模拟数据）

---

## 🔄 以后更新

每次你推送代码到 GitHub，Cloudflare 会自动重新部署！

非常方便！

---

## ❓ 遇到问题？

### 问题 1：找不到 GitHub 仓库
**解决**：点击 "Configure GitHub App"，重新授权

### 问题 2：部署失败
**检查**：
- Build output directory 是否填写为 `.`
- Production branch 是否正确

### 问题 3：网站空白
**解决**：
- 重新检查 Build output directory 设置
- 重新部署一次

---

## 📞 需要帮助

完成后告诉我结果：
- ✅ 部署成功 → 发给我网址，我帮你测试
- ❌ 遇到问题 → 告诉我错误信息

祝你部署顺利！🚀
