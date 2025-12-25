# 🤖 Google Gemini AI 集成说明

本系统已成功集成 **Google Gemini AI**，实现真正的智能语义搜索！

---

## ✨ 功能特性

### 1. 智能语义搜索
- 使用 Gemini `text-embedding-004` 模型生成文本嵌入向量
- 通过余弦相似度计算查询与考题的相关性
- 自动找到最相关的 DSE 考题

### 2. AI 智能解答
- 使用 Gemini `gemini-1.5-flash` 模型生成专业回答
- 基于检索到的考题提供学习建议
- 繁体中文专业解答

### 3. 实时计算
- 所有计算在用户浏览器中完成
- 无需后端服务器
- 保护用户隐私

---

## 🔧 技术实现

### API 配置

```javascript
const GEMINI_API_KEY = 'AIzaSyCwagWVu6Lu6IhshnRF83x8-6XD3duwJ_8';
const GEMINI_EMBEDDING_MODEL = 'models/text-embedding-004';
const GEMINI_CHAT_MODEL = 'models/gemini-1.5-flash';
```

### 工作流程

```
用户查询
   ↓
1. 生成查询的嵌入向量 (Gemini Embedding API)
   ↓
2. 为每道考题生成嵌入向量
   ↓
3. 计算余弦相似度
   ↓
4. 按相似度排序，取前 5 道题
   ↓
5. 使用 Gemini AI 生成专业解答
   ↓
显示结果
```

---

## 📊 使用的 Gemini API

### 1. Embedding API
- **模型**: `text-embedding-004`
- **用途**: 生成文本嵌入向量
- **维度**: 768
- **API 端点**:
  ```
  https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent
  ```

### 2. Generative AI API
- **模型**: `gemini-1.5-flash`
- **用途**: 生成 AI 回答
- **上下文**: 最多包含前 3 道最相关考题
- **API 端点**:
  ```
  https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
  ```

---

## 🎯 使用示例

### 搜索示例

**查询**: "氣候變化"

**处理流程**:
1. 生成查询嵌入向量
2. 计算与 21 道考题的相似度
3. 找到最相关的 5 道题（例如：通识科、地理科关于气候变化的题目）
4. 使用 Gemini AI 生成专业解答

**结果**:
- ✅ 相关考题列表（按相似度排序）
- ✅ AI 专业解答
- ✅ 学习建议

---

## ⚡ 性能说明

### 搜索速度
- **首次查询嵌入**: ~1-2 秒
- **每道题嵌入**: ~0.5-1 秒
- **AI 回答生成**: ~2-3 秒

**总时间（21 道题）**: 约 15-30 秒

### API 限制
- **Embedding API**: 每分钟 60 次请求
- **Generative AI API**: 每分钟 15 次请求

**优化措施**:
- 每道题嵌入后延迟 100ms，避免触发限流
- 仅对筛选后的题目生成嵌入
- 缓存机制（计划中）

---

## 🔒 安全说明

### API Key 管理
⚠️ **注意**: API Key 目前硬编码在前端代码中

**安全建议**:
1. ✅ **当前方案**: API Key 仅限于浏览器使用，有 CORS 限制
2. ✅ **限制范围**: 在 Google Cloud Console 中限制 API Key 的使用范围
3. ⚠️ **生产环境**: 建议将 API 调用移至后端（Cloudflare Workers）

### 推荐的安全配置

在 Google Cloud Console 中：
1. 进入 API Credentials
2. 编辑 API Key
3. 设置应用限制：
   - **HTTP 引用者（网站）**
   - 添加：`https://dse-rag-system.pages.dev/*`
4. 设置 API 限制：
   - Generative Language API

---

## 📈 未来优化

### 计划中的改进

1. **预计算嵌入向量**
   - 预先为所有考题生成嵌入
   - 保存到 JSON 文件
   - 减少搜索时的 API 调用

2. **后端 API**
   - 移至 Cloudflare Workers
   - 保护 API Key
   - 提升性能

3. **缓存机制**
   - 缓存常见查询的结果
   - 使用 LocalStorage 存储嵌入向量

4. **批量处理**
   - 使用 Gemini 批量 embedding API
   - 提升处理速度

---

## 🧪 测试方法

### 测试查询建议

**通识/地理科**:
- "氣候變化"
- "全球化"
- "可持續發展"

**数学科**:
- "二次函數"
- "概率"
- "統計"

**理科**:
- "光合作用"
- "化學鍵"
- "牛頓定律"

**语文科**:
- "作文技巧"
- "議論文"
- "記敘文"

---

## 📞 API 配额

### 免费额度（每天）
- **Embedding API**: 1,500 次请求
- **Generative AI API**: 1,500 次请求

### 成本估算
- 每次搜索（21 道题）: ~22 次 API 调用
- **每天可支持**: 约 68 次搜索（免费额度内）

---

## 🔗 相关文档

- [Google Gemini API 文档](https://ai.google.dev/docs)
- [Embedding API 参考](https://ai.google.dev/api/embeddings)
- [Generative AI API 参考](https://ai.google.dev/api/generate-content)

---

**更新时间**: 2025-12-25
**作者**: @yhliang1648-cmyk
