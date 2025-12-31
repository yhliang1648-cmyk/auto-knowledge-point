# DSE RAG API - Cloudflare Workers部署指南

## 概述

这是一个基于Cloudflare Workers的RAG（检索增强生成）后端服务，为DSE考题智能检索系统提供：

- ✅ 智能向量搜索（Cloudflare Vectorize）
- ✅ PDF OCR识别（通义千问 qwen-vl-ocr）
- ✅ AI问答生成（通义千问 qwen-plus）
- ✅ 题目数据管理（Cloudflare D1）
- ✅ PDF文件存储（Cloudflare R2）
- ✅ 结果缓存（Cloudflare KV）

## 架构图

```
┌─────────────┐
│  前端页面   │ (index.html)
└──────┬──────┘
       │ HTTPS
       ▼
┌─────────────────────────────────────┐
│   Cloudflare Workers                │
│   (worker.js)                       │
│   - /api/search     搜索接口        │
│   - /api/upload-pdf  PDF上传        │
│   - /api/ocr         OCR识别        │
│   - /api/embed       生成向量       │
└──┬────┬────┬────┬───────────────────┘
   │    │    │    │
   ▼    ▼    ▼    ▼
  D1  R2  KV  Vectorize  Qwen API
```

## 前置要求

1. **Cloudflare账号**（免费版即可）
2. **Wrangler CLI**
   ```bash
   npm install -g wrangler
   ```
3. **通义千问API密钥**（已提供：sk-e79b72b1a216405c89206aefe865139e）

## 部署步骤

### 第一步：登录Cloudflare

```bash
wrangler login
```

### 第二步：创建D1数据库

```bash
# 创建数据库
wrangler d1 create dse_questions_db

# 记录输出的database_id，替换wrangler.toml中的database_id
# 输出示例：
# database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### 第三步：初始化数据库Schema

```bash
# 执行schema.sql创建表结构
wrangler d1 execute dse_questions_db --file=schema.sql
```

### 第四步：创建R2存储桶

```bash
# 创建R2 bucket用于存储PDF
wrangler r2 bucket create dse-pdfs
```

### 第五步：创建KV命名空间

```bash
# 创建KV命名空间用于缓存
wrangler kv:namespace create "CACHE"

# 记录输出的id，替换wrangler.toml中的kv_namespaces.id
# 输出示例：
# id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### 第六步：创建Vectorize索引

```bash
# 创建向量索引（1536维，适配text-embedding-v3）
wrangler vectorize create dse-questions-index \
  --dimensions=1536 \
  --metric=cosine
```

### 第七步：更新wrangler.toml

编辑`wrangler.toml`文件，替换以下内容：

```toml
[[d1_databases]]
binding = "DB"
database_name = "dse_questions_db"
database_id = "替换为第二步获得的database_id"

[[kv_namespaces]]
binding = "CACHE"
id = "替换为第五步获得的id"
```

### 第八步：部署Worker

```bash
# 部署到Cloudflare
wrangler deploy

# 输出示例：
# Published dse-rag-api (0.01 sec)
#   https://dse-rag-api.your-subdomain.workers.dev
```

### 第九步：测试API

```bash
# 测试健康检查
curl https://dse-rag-api.your-subdomain.workers.dev/api/health

# 测试搜索功能
curl -X POST https://dse-rag-api.your-subdomain.workers.dev/api/search \
  -H "Content-Type: application/json" \
  -d '{"query":"二次函數最值","subject":"all","year":"all","limit":5}'
```

### 第十步：导入历史题目数据

```bash
# 创建导入脚本
node scripts/import-questions.js

# 或者使用wrangler执行SQL导入
wrangler d1 execute dse_questions_db --file=data/questions.sql
```

## 通义千问API使用说明

### API密钥配置

已在`wrangler.toml`中配置：
```toml
QWEN_API_KEY = "sk-e79b72b1a216405c89206aefe865139e"
```

### 可用模型

1. **qwen-vl-ocr-2025-08-28**：OCR文字识别
2. **qwen-plus**：智能问答
3. **text-embedding-v3**：文本向量化（1536维）

### API端点

- **通用接口**：https://dashscope.aliyuncs.com
- **兼容OpenAI**：https://dashscope.aliyuncs.com/compatible-mode/v1

### OCR示例

```javascript
// 识别图片中的文字
const response = await fetch('/api/ocr', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    imageBase64: '...'  // 或 imageUrl: 'https://...'
  })
});

const result = await response.json();
console.log('识别文字:', result.text);
console.log('边界框:', result.boxes);
```

## 前端集成

### 更新index.html配置

```javascript
// 在index.html中添加
const API_BASE_URL = 'https://dse-rag-api.your-subdomain.workers.dev';

// 替换原有的search函数
async function search() {
  const query = document.getElementById('searchInput').value.trim();
  const response = await fetch(`${API_BASE_URL}/api/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      subject: document.getElementById('subjectFilter').value,
      year: document.getElementById('yearFilter').value,
      limit: 5
    })
  });

  const results = await response.json();
  displayResults(results);
}
```

## 成本估算（Cloudflare免费版额度）

| 服务 | 免费额度 | 预计使用量 | 费用 |
|------|---------|-----------|------|
| Workers | 100,000请求/天 | ~1,000/天 | **免费** |
| D1 数据库 | 5GB存储 | ~100MB | **免费** |
| R2 存储 | 10GB存储 | ~1GB | **免费** |
| Vectorize | 1000万向量查询/月 | ~10万/月 | **免费** |
| KV | 10万读取/天 | ~5000/天 | **免费** |

**通义千问API成本**：
- Embedding：¥0.0007/1k tokens
- qwen-plus：¥0.004/1k tokens（输入），¥0.008/1k tokens（输出）
- OCR：¥0.008/次

预计月成本：~¥50-100（1000次查询）

## 监控与调试

### 查看Worker日志

```bash
wrangler tail
```

### 查看D1数据库

```bash
# 查询所有题目
wrangler d1 execute dse_questions_db --command="SELECT * FROM questions LIMIT 10"

# 查看表结构
wrangler d1 execute dse_questions_db --command="SELECT sql FROM sqlite_master WHERE type='table'"
```

### 查看R2文件列表

```bash
wrangler r2 object list dse-pdfs
```

### 查看KV缓存

```bash
wrangler kv:key list --namespace-id=your-kv-namespace-id
```

## 常见问题

### Q: PDF OCR功能如何实现？

A: 由于Cloudflare Workers无法直接处理PDF，有两种方案：
1. **前端方案**：使用PDF.js在浏览器中将PDF转为图片，再调用OCR API
2. **混合方案**：使用Cloudflare Images或第三方服务（如Cloudinary）转换PDF

建议使用前端方案，示例代码见`scripts/pdf-to-image.js`

### Q: 如何导入大量历史题目？

A: 使用批量导入脚本：
```bash
node scripts/batch-import.js --file=data/all-questions.json
```

### Q: 向量搜索准确度如何优化？

A:
1. 调整相似度阈值
2. 增加topK数量
3. 使用更好的embedding模型
4. 添加元数据过滤

### Q: API速度慢怎么办？

A:
1. 启用KV缓存（已实现）
2. 使用Cloudflare边缘网络加速
3. 优化数据库索引
4. 减少API调用次数

## 相关文档

- [Cloudflare Workers文档](https://developers.cloudflare.com/workers/)
- [Cloudflare D1文档](https://developers.cloudflare.com/d1/)
- [Cloudflare Vectorize文档](https://developers.cloudflare.com/vectorize/)
- [通义千问API文档](https://help.aliyun.com/zh/model-studio/qwen-api-reference)
- [通义千问OCR文档](https://help.aliyun.com/zh/model-studio/qwen-vl-ocr)

## 技术支持

如有问题，请查看：
1. Worker日志：`wrangler tail`
2. D1数据库：`wrangler d1 execute`
3. GitHub Issues: https://github.com/yhliang1648-cmyk/auto-knowledge-point/issues

---

**部署日期**: 2025-12-31
**版本**: 1.0.0
