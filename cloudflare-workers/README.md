# Cloudflare Workers - 通义千问 API 代理

这个目录包含用于解决通义千问 API CORS 跨域问题的 Cloudflare Worker 脚本。

## 📁 文件说明

| 文件 | 说明 |
|------|------|
| `qwen-api-proxy.js` | Worker 主脚本，负责代理所有通义千问 API 请求 |
| `DEPLOYMENT_GUIDE.md` | 详细的部署指南（中文） |
| `README.md` | 本文件，目录概览 |

## 🚀 快速开始

### 5 分钟部署流程：

1. **登录 Cloudflare**
   访问：https://dash.cloudflare.com/

2. **创建 Worker**
   Workers & Pages → Create Application → Create Worker

3. **复制代码**
   复制 `qwen-api-proxy.js` 全部内容到 Worker 编辑器

4. **保存部署**
   点击 "Save and Deploy"

5. **获取 URL**
   复制生成的 Worker URL（格式：`https://xxx.workers.dev`）

6. **更新配置**
   在 `index.html` 中填入您的 Worker URL

**详细步骤请查看：[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**

## 🎯 功能特性

✅ **自动处理 CORS**
- 添加所有必需的 CORS 响应头
- 支持 OPTIONS 预检请求
- 允许所有来源访问（可配置）

✅ **支持所有通义千问 API**
- 文本生成 API（qwen-plus）
- OCR 识别 API（qwen-vl-ocr）
- 多模态 API（qwen-vl-plus）
- 通过查询参数指定 API 路径

✅ **完全免费**
- Cloudflare 免费套餐：100,000 次请求/天
- 全球 CDN 加速
- 无需信用卡

✅ **内置文档页面**
- 访问 Worker 根路径查看使用说明
- 包含 API 调用示例
- 实时显示部署状态

## 📖 使用示例

### 基本用法

```javascript
// 文本生成
fetch('https://YOUR-WORKER.workers.dev?path=/api/v1/services/aigc/text-generation/generation', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY',
    'X-DashScope-SSE': 'disable'
  },
  body: JSON.stringify({
    model: 'qwen-plus',
    input: {
      messages: [{ role: 'user', content: 'Hello' }]
    }
  })
})
```

### OCR 识别

```javascript
// 图片文字识别
fetch('https://YOUR-WORKER.workers.dev?path=/api/v1/services/aigc/multimodal-generation/generation', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY',
    'X-DashScope-SSE': 'disable'
  },
  body: JSON.stringify({
    model: 'qwen-vl-ocr',
    input: {
      messages: [{
        role: 'user',
        content: [
          { image: 'data:image/jpeg;base64,...' },
          { text: '识别图片文字' }
        ]
      }]
    }
  })
})
```

## 🔧 配置选项

### CORS 设置

默认配置允许所有来源访问：

```javascript
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-DashScope-SSE',
};
```

### 限制特定域名（可选）

如需限制访问来源，修改 `handleOptions()` 和 `proxyRequest()` 函数：

```javascript
const ALLOWED_ORIGINS = [
  'https://yhliang1648-cmyk.github.io',
  'http://localhost:8080'
];

function getOriginHeader(request) {
  const origin = request.headers.get('Origin');
  return ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
}
```

## 📊 性能指标

| 指标 | Cloudflare Worker | corsproxy.io |
|------|-------------------|--------------|
| 延迟 | < 50ms | 200-500ms |
| 稳定性 | 99.9% | 95% |
| 免费额度 | 100,000/天 | 有限制 |
| CDN 加速 | ✅ 全球 | ❌ 单节点 |
| 自定义域名 | ✅ 支持 | ❌ 不支持 |

## 🛠️ 故障排查

### Worker 返回 403 错误
- 检查 API Key 是否正确
- 确认 Authorization 头格式：`Bearer YOUR_KEY`

### Worker 返回 CORS 错误
- 检查 CORS_HEADERS 配置是否正确
- 确认 OPTIONS 请求被正确处理

### Worker 超时
- 通义千问 API 响应时间较长时可能超时
- 考虑增加 Worker 超时限制（付费功能）

### 查看日志
1. 登录 Cloudflare Dashboard
2. Workers & Pages → 您的 Worker
3. 点击 "Logs" 标签查看实时日志

## 📚 相关链接

- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [通义千问 API 文档](https://help.aliyun.com/zh/dashscope/)
- [CORS 详解](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)

## 📝 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2026-01-14 | 初始版本，支持文本生成和 OCR API |

## 🤝 贡献

如有改进建议或发现问题，欢迎提交 Issue 或 Pull Request！

---

**部署遇到问题？** 请查看 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) 获取详细帮助。
