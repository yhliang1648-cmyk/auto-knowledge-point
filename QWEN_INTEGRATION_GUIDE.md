# 通义千问API集成指南

## 概述

本项目已成功集成通义千问（Qwen）API，为DSE考题智能检索系统和智能刷题助手提供：

- ✅ **OCR识别**：qwen-vl-ocr-2025-08-28（识别PDF、图片中的文字和公式）
- ✅ **AI问答**：qwen-plus（智能判题、出题、生成答案）
- ✅ **向量搜索**：text-embedding-v3（1536维语义搜索）

**API密钥**：`sk-e79b72b1a216405c89206aefe865139e`

---

## 一、DSE考题智能检索系统

### 架构设计

```
┌─────────────┐
│ index.html  │ → 前端界面
└──────┬──────┘
       │
       ▼
┌──────────────────────────────┐
│ Cloudflare Workers (RAG API) │
│ - 向量搜索 (Vectorize)        │
│ - 数据存储 (D1 + R2)          │
│ - AI问答 (通义千问)           │
└──────────────────────────────┘
```

### 部署步骤

#### 1. 安装依赖

```bash
cd cloudflare-rag
npm install
```

#### 2. 配置Cloudflare账号

```bash
# 登录Cloudflare
wrangler login

# 一键创建所有资源
npm run setup
```

这会自动创建：
- D1数据库（存储题目元数据）
- R2存储桶（存储PDF文件）
- KV命名空间（缓存查询结果）
- Vectorize索引（向量搜索）

#### 3. 更新配置文件

根据setup命令的输出，更新`wrangler.toml`中的ID：

```toml
[[d1_databases]]
database_id = "替换为实际的database_id"

[[kv_namespaces]]
id = "替换为实际的kv_namespace_id"
```

#### 4. 初始化数据库

```bash
npm run db:init
```

#### 5. 导入考题数据

```bash
# 设置环境变量
export CLOUDFLARE_ACCOUNT_ID="你的账号ID"
export CLOUDFLARE_API_TOKEN="你的API Token"
export DATABASE_ID="D1数据库ID"

# 导入数据
npm run import:questions
```

#### 6. 部署Worker

```bash
npm run deploy
```

部署成功后会得到一个URL，例如：
```
https://dse-rag-api.your-subdomain.workers.dev
```

#### 7. 更新前端配置

编辑`index.html`，在`<script>`标签中添加：

```javascript
// 配置API端点
const API_BASE_URL = 'https://dse-rag-api.your-subdomain.workers.dev';

// 替换原有的search函数
async function search() {
  const query = document.getElementById('searchInput').value.trim();
  const subjectFilter = document.getElementById('subjectFilter').value;
  const yearFilter = document.getElementById('yearFilter').value;

  if (!query) {
    alert('請輸入搜索關鍵詞');
    return;
  }

  showLoading();

  try {
    // 调用Cloudflare Workers API
    const response = await fetch(`${API_BASE_URL}/api/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        subject: subjectFilter,
        year: yearFilter,
        limit: 5
      })
    });

    if (!response.ok) {
      throw new Error(`API錯誤: ${response.status}`);
    }

    const results = await response.json();
    displayResults(results);

  } catch (error) {
    console.error('搜索錯誤:', error);
    showError('搜索失敗：' + error.message);
  }
}
```

### PDF上传与OCR

在`index.html`中添加PDF上传功能：

```html
<div class="upload-section">
  <h3>上傳PDF試卷</h3>
  <input type="file" id="pdfUpload" accept="application/pdf">
  <button onclick="uploadPDF()">上傳並識別</button>
</div>

<script>
async function uploadPDF() {
  const fileInput = document.getElementById('pdfUpload');
  const file = fileInput.files[0];

  if (!file) {
    alert('請選擇PDF文件');
    return;
  }

  const formData = new FormData();
  formData.append('pdf', file);

  try {
    const response = await fetch(`${API_BASE_URL}/api/upload-pdf`, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    console.log('OCR結果:', result.ocrResults);
    alert('PDF上傳成功！');

  } catch (error) {
    console.error('上傳錯誤:', error);
    alert('上傳失敗：' + error.message);
  }
}
</script>
```

---

## 二、智能刷题助手

### 使用方法

智能刷题助手已整合通义千问API，提供以下功能：

#### 1. 打开应用

访问：`exam-helper-app.html`

#### 2. AI判题功能

```
步骤1: 上传题目图片/PDF
   ↓
步骤2: 上传答卷图片/PDF
   ↓
步骤3: 点击"开始AI判题"
   ↓
步骤4: 查看评分结果和薄弱知识点
```

**技术实现**：
- 使用`qwen-vl-ocr-2025-08-28`识别题目和答案
- 使用`qwen-plus`进行智能评分
- 自动分析错误原因和薄弱知识点

#### 3. 错题强化功能

```
步骤1: 完成AI判题
   ↓
步骤2: 系统识别薄弱知识点
   ↓
步骤3: 点击"生成练习题"
   ↓
步骤4: 完成针对性练习
```

**技术实现**：
- 使用`qwen-plus`根据薄弱知识点生成相似题目
- 包含详细的解题步骤和知识点讲解

#### 4. 可视化讲解功能

```
步骤1: 选择可视化类型（受力分析/运动动画/函数图像）
   ↓
步骤2: 输入题目内容
   ↓
步骤3: 点击"生成可视化图表"
   ↓
步骤4: 查看Canvas动画演示
```

**技术实现**：
- 使用`qwen-plus`分析题目并生成可视化数据
- 前端Canvas绘制受力图、运动轨迹、函数图像

### API使用示例

#### 示例1：OCR识别

```javascript
const api = new ExamHelperAPI('sk-e79b72b1a216405c89206aefe865139e');

// 识别图片中的文字
const result = await api.performOCR(imageBase64, 'exam');
console.log('识别文字:', result.text);
console.log('边界框:', result.boxes);
```

#### 示例2：AI判题

```javascript
// 判题
const gradingResult = await api.gradeAnswer(
  questionImageBase64,
  answerImageBase64,
  {
    subject: '數學',
    totalMarks: 10
  }
);

console.log('總分:', gradingResult.totalScore);
console.log('薄弱知識點:', gradingResult.weakKnowledgePoints);
```

#### 示例3：生成练习题

```javascript
const weakPoints = [
  { point: '二次函數配方法', severity: 'high' },
  { point: '不等式求解', severity: 'medium' }
];

const questions = await api.generateSimilarQuestions(
  weakPoints,
  '數學',
  { syllabus: 'DSE 2024' }
);

console.log('生成題目:', questions);
```

#### 示例4：生成可视化

```javascript
const visData = await api.generateVisualization(
  {
    content: '一個質量為2kg的物體靜止在傾角為30°的斜面上...'
  },
  'force'
);

console.log('受力數據:', visData);
// 使用Canvas绘制
drawForceAnalysis(canvas.getContext('2d'), visData);
```

---

## 三、API参考

### 通义千问API端点

| 功能 | 模型 | 端点 |
|------|------|------|
| OCR识别 | qwen-vl-ocr-2025-08-28 | `/api/v1/services/aigc/multimodal-generation/generation` |
| AI问答 | qwen-plus | `/compatible-mode/v1/chat/completions` |
| 文本向量 | text-embedding-v3 | `/api/v1/services/embeddings/text-embedding/text-embedding` |

### 认证方式

```javascript
headers: {
  'Authorization': 'Bearer sk-e79b72b1a216405c89206aefe865139e',
  'Content-Type': 'application/json'
}
```

### 请求示例

#### OCR请求

```json
{
  "model": "qwen-vl-ocr-2025-08-28",
  "input": {
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "image": "data:image/jpeg;base64,..."
          }
        ]
      }
    ]
  },
  "parameters": {
    "ocr_options": {
      "task": "advanced_recognition"
    }
  }
}
```

#### AI问答请求

```json
{
  "model": "qwen-plus",
  "messages": [
    {
      "role": "system",
      "content": "你是一位DSE評卷專家"
    },
    {
      "role": "user",
      "content": "請批改以下答案..."
    }
  ],
  "temperature": 0.3,
  "max_tokens": 3000
}
```

#### Embedding请求

```json
{
  "model": "text-embedding-v3",
  "input": {
    "texts": ["需要向量化的文本"]
  }
}
```

---

## 四、成本估算

### Cloudflare（免费版）

| 服务 | 免费额度 | 预估使用 | 费用 |
|------|---------|---------|------|
| Workers | 100,000请求/天 | ~1,000/天 | 免费 |
| D1 | 5GB存储 | ~100MB | 免费 |
| R2 | 10GB存储 | ~1GB | 免费 |
| Vectorize | 1000万查询/月 | ~10万/月 | 免费 |
| KV | 10万读取/天 | ~5000/天 | 免费 |

### 通义千问API

| 功能 | 计费单价 | 预估用量 | 月成本 |
|------|---------|---------|--------|
| OCR | ¥0.008/次 | 500次 | ¥4 |
| qwen-plus | ¥0.004/1k tokens (输入) | 50万tokens | ¥2 |
| qwen-plus | ¥0.008/1k tokens (输出) | 100万tokens | ¥8 |
| Embedding | ¥0.0007/1k tokens | 100万tokens | ¥0.7 |

**总计月成本**：约 ¥15-20（1000次查询）

---

## 五、故障排除

### 问题1：OCR识别不准确

**原因**：图片质量差、角度倾斜、光线不足

**解决方案**：
1. 使用前端进行图片预处理（调整对比度、去噪、边缘检测）
2. 提示用户拍摄清晰、正面的照片
3. 使用PDF.js将PDF转为高分辨率图片

### 问题2：API调用失败

**原因**：API密钥错误、网络问题、请求格式错误

**解决方案**：
```javascript
try {
  const response = await fetch(endpoint, options);
  if (!response.ok) {
    const error = await response.text();
    console.error('API错误:', error);
  }
} catch (error) {
  console.error('网络错误:', error);
}
```

### 问题3：Cloudflare Workers部署失败

**原因**：配置文件错误、资源ID不匹配

**解决方案**：
1. 检查`wrangler.toml`中的所有ID是否正确
2. 运行`wrangler d1 list`确认数据库已创建
3. 运行`wrangler vectorize list`确认向量索引已创建

### 问题4：向量搜索结果不相关

**原因**：embedding质量差、向量维度不匹配

**解决方案**：
1. 确保使用相同的embedding模型（text-embedding-v3）
2. 检查Vectorize索引维度设置为1536
3. 调整相似度阈值和topK参数

---

## 六、扩展建议

### 1. 增强OCR准确度

- 集成多个OCR服务（Google Vision、Azure）进行结果比对
- 添加人工校对界面
- 使用后处理算法修正常见错误

### 2. 优化判题算法

- 训练自定义模型识别手写体
- 添加公式识别专用模型（Mathpix）
- 实现多步骤评分细粒度控制

### 3. 增强可视化

- 使用Three.js实现3D物理模拟
- 添加交互式动画控制
- 支持导出视频格式

### 4. 移动端支持

- 开发React Native移动App
- 集成相机直接拍照上传
- 添加离线模式支持

---

## 七、相关文档

- [Cloudflare Workers部署指南](cloudflare-rag/README.md)
- [通义千问API文档](https://help.aliyun.com/zh/model-studio/qwen-api-reference)
- [通义千问OCR文档](https://help.aliyun.com/zh/model-studio/qwen-vl-ocr)
- [Cloudflare Vectorize文档](https://developers.cloudflare.com/vectorize/)

---

**更新日期**: 2025-12-31
**版本**: 1.0.0
**维护者**: DSE RAG Team

## 参考资料来源

- [通义千问模型列表 - 阿里云](https://www.alibabacloud.com/help/zh/model-studio/models)
- [通义千问API参考 - 阿里云](https://help.aliyun.com/zh/model-studio/qwen-api-reference)
- [Qwen-VL-OCR文档 - 阿里云](https://help.aliyun.com/zh/model-studio/qwen-vl-ocr)
- [DashScope API - liteLLM](https://docs.litellm.ai/docs/providers/dashscope)
