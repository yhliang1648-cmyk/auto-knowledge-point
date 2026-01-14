# Cloudflare Worker 部署指南 📘

本指南将帮助您部署通义千问 API 代理 Worker，彻底解决 CORS 跨域问题。

## 📋 前置要求

- Cloudflare 账号（免费账号即可）
- 通义千问 API Key：`sk-5848f54f1c3f4771b869f73e220715ca`

## 🚀 部署步骤

### 第 1 步：登录 Cloudflare

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 使用您的账号登录
3. 如果没有账号，请先注册（完全免费）

### 第 2 步：创建 Worker

1. 在左侧菜单栏找到 **Workers & Pages**
2. 点击 **Create Application**
3. 选择 **Create Worker**
4. 给 Worker 起一个名字，例如：`qwen-api-proxy`
5. 点击 **Deploy** 创建初始 Worker

### 第 3 步：编辑 Worker 代码

1. 部署完成后，点击 **Edit Code** 或 **Quick Edit**
2. 删除默认的所有代码
3. 复制 `qwen-api-proxy.js` 文件中的全部代码
4. 粘贴到 Worker 编辑器中
5. 点击右上角 **Save and Deploy** 保存并部署

### 第 4 步：获取 Worker URL

部署成功后，您会看到 Worker URL，格式类似：
```
https://qwen-api-proxy.YOUR-USERNAME.workers.dev
```

**请复制并保存这个 URL，稍后需要使用！**

### 第 5 步：测试 Worker

1. 在浏览器中打开您的 Worker URL
2. 您应该会看到一个使用说明页面
3. 如果看到这个页面，说明 Worker 已成功部署！

### 第 6 步：更新 index.html 配置

现在需要更新您的网站配置来使用自己的 Worker：

1. 打开 `/home/user/auto-knowledge-point/index.html`
2. 找到第 826-851 行的 API 配置部分
3. 修改以下配置：

```javascript
// 【修改前】
const USE_CORS_PROXY = true;
const CORS_PROXY = 'https://corsproxy.io/?';
const CLOUDFLARE_WORKER_URL = ''; // 空的

// 【修改后】
const USE_CORS_PROXY = false; // 改为 false
const CORS_PROXY = ''; // 清空
const CLOUDFLARE_WORKER_URL = 'https://qwen-api-proxy.YOUR-USERNAME.workers.dev'; // 填入您的 Worker URL
```

4. 保存文件

### 第 7 步：提交并推送更新

```bash
git add index.html
git commit -m "Switch to Cloudflare Worker proxy for Qwen API"
git push -u origin claude/connect-github-repo-Y7Rcj
```

### 第 8 步：验证部署

1. 等待 2-5 分钟让 GitHub Pages 完成部署
2. 访问：https://yhliang1648-cmyk.github.io/auto-knowledge-point/index.html
3. 按 **Ctrl+Shift+R** 强制刷新浏览器缓存
4. 检查页面底部的 API 状态，应该显示：**✅ 通义千问 API 運行正常**
5. 尝试上传 PDF/Word/图片文件测试功能

## 🎯 优势对比

| 方案 | 速度 | 稳定性 | 免费额度 | 推荐 |
|------|------|--------|----------|------|
| **corsproxy.io（临时）** | 较慢 | 一般 | 有限制 | ⚠️ 临时使用 |
| **Cloudflare Worker（推荐）** | 快 | 极好 | 100,000 次/天 | ✅ 强烈推荐 |

## 📊 Worker 性能指标

Cloudflare Workers 免费套餐：
- ✅ **100,000 次请求/天**
- ✅ **全球 CDN 加速**
- ✅ **低延迟（< 50ms）**
- ✅ **99.9% 可用性**
- ✅ **无需信用卡**

## 🔧 Worker API 使用方法

部署完成后，您的 Worker 支持以下两种 API：

### 1. 文本生成 API（qwen-plus）

```javascript
fetch('https://YOUR-WORKER-URL.workers.dev?path=/api/v1/services/aigc/text-generation/generation', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer sk-5848f54f1c3f4771b869f73e220715ca',
    'X-DashScope-SSE': 'disable'
  },
  body: JSON.stringify({
    model: 'qwen-plus',
    input: {
      messages: [{ role: 'user', content: '你好' }]
    },
    parameters: {
      result_format: 'message'
    }
  })
})
```

### 2. OCR 识别 API（qwen-vl-ocr）

```javascript
fetch('https://YOUR-WORKER-URL.workers.dev?path=/api/v1/services/aigc/multimodal-generation/generation', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer sk-5848f54f1c3f4771b869f73e220715ca',
    'X-DashScope-SSE': 'disable'
  },
  body: JSON.stringify({
    model: 'qwen-vl-ocr',
    input: {
      messages: [{
        role: 'user',
        content: [
          { image: 'data:image/jpeg;base64,...' },
          { text: '请识别图片文字' }
        ]
      }]
    }
  })
})
```

## ❓ 常见问题

### Q1: Worker 部署后显示 "Service Unavailable"？
**A:** 等待 1-2 分钟，Cloudflare 需要时间在全球边缘节点同步。

### Q2: API 调用返回 403 错误？
**A:** 检查通义千问 API Key 是否正确，确保 Authorization 头格式为 `Bearer YOUR_API_KEY`。

### Q3: Worker 每天 100,000 次请求够用吗？
**A:** 完全够用！即使每分钟上传 10 个文件，一天也只需要约 14,400 次请求。

### Q4: 如何查看 Worker 使用统计？
**A:** 登录 Cloudflare Dashboard → Workers & Pages → 点击您的 Worker → 查看 Metrics 标签。

### Q5: Worker 可以同时支持多个网站吗？
**A:** 可以！Worker 已配置 `Access-Control-Allow-Origin: *`，任何网站都可以调用。

## 🔒 安全建议

虽然当前配置允许任何来源访问（CORS: *），但您可以通过以下方式增强安全性：

1. **限制来源域名：**
```javascript
const ALLOWED_ORIGINS = [
  'https://yhliang1648-cmyk.github.io',
  'http://localhost:8080'
];
```

2. **添加速率限制：**
```javascript
// Cloudflare Workers 支持内置 KV 存储来实现速率限制
```

3. **使用环境变量存储 API Key：**
- 在 Cloudflare Dashboard 中配置环境变量
- 不在代码中硬编码 API Key

## 📞 获取帮助

如果遇到问题：

1. 查看 Worker 日志：Dashboard → Workers → 您的 Worker → Logs
2. 检查浏览器控制台错误信息
3. 访问 [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
4. 查看通义千问 [API 文档](https://help.aliyun.com/zh/dashscope/)

## ✅ 部署完成清单

完成以下所有步骤即完成部署：

- [ ] 创建 Cloudflare Worker
- [ ] 复制并部署 `qwen-api-proxy.js` 代码
- [ ] 获取 Worker URL
- [ ] 更新 `index.html` 配置
- [ ] 提交并推送代码到 GitHub
- [ ] 强制刷新浏览器缓存（Ctrl+Shift+R）
- [ ] 测试 API 状态显示正常
- [ ] 上传测试文件验证功能

---

**🎉 祝部署顺利！** 如有任何问题，请随时查看此文档或查看 Worker 日志排查问题。
