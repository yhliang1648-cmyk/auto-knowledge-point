# 🎓 DSE 考題智能檢索系統

> 基於 RAG（檢索增強生成）的香港中學文憑試歷屆考題知識庫 (2012-2025)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Cloudflare](https://img.shields.io/badge/Powered%20by-Cloudflare-orange)](https://cloudflare.com)

## 📋 項目簡介

這是一個智能 DSE 考題檢索系統，使用先進的 RAG 技術，結合向量數據庫和 AI 模型，為學生提供：

- **🔍 語義搜索**：不僅匹配關鍵詞，更理解問題含義
- **🤖 AI 解答**：基於歷屆考題提供專業建議
- **📊 智能分類**：按科目、年份、難度篩選
- **⚡ 極速響應**：全球 CDN 加速，毫秒級響應

## 🏗️ 技術架構

```
┌─────────────────────────────────────────────────────┐
│              前端 (Cloudflare Pages)                │
│  • 響應式 UI • 搜索界面 • 結果展示                   │
└──────────────────┬──────────────────────────────────┘
                   │ HTTPS
                   ↓
┌─────────────────────────────────────────────────────┐
│           API 層 (Cloudflare Workers)               │
│  • RESTful API • 查詢處理 • CORS 支持              │
└──────────────────┬──────────────────────────────────┘
                   │
         ┌─────────┴─────────┐
         ↓                   ↓
┌──────────────────┐  ┌──────────────────┐
│  Vectorize 數據庫│  │   Workers AI     │
│  • 向量存儲      │  │  • 文本嵌入      │
│  • 相似度搜索    │  │  • 答案生成      │
└──────────────────┘  └──────────────────┘
```

### 核心技術棧

- **前端**: HTML5 + CSS3 + Vanilla JavaScript
- **後端**: Cloudflare Workers (Edge Computing)
- **數據庫**: Cloudflare Vectorize (向量數據庫)
- **AI 模型**:
  - `@cf/baai/bge-base-en-v1.5` - 文本嵌入
  - `@cf/meta/llama-2-7b-chat-int8` - 答案生成
- **部署**: Cloudflare Pages + Workers

## 📁 項目結構

```
auto-knowledge-point/
├── index.html                 # 前端主頁面
├── src/
│   └── workers/
│       └── index.js          # Workers API 代碼
├── data/
│   └── questions/
│       └── all-questions.json # 考題數據
├── scripts/
│   └── import-questions.js   # 數據導入腳本
├── package.json              # 項目配置
├── wrangler.toml             # Cloudflare 配置
└── README.md                 # 本文檔
```

## 🚀 快速開始

### 1. 克隆項目

```bash
git clone https://github.com/yhliang1648-cmyk/auto-knowledge-point.git
cd auto-knowledge-point
```

### 2. 安裝依賴

```bash
npm install
```

### 3. 配置 Cloudflare

#### 3.1 登錄 Cloudflare

```bash
npx wrangler login
```

#### 3.2 創建 Vectorize 索引

```bash
npx wrangler vectorize create dse-questions-index \
  --dimensions=768 \
  --metric=cosine
```

#### 3.3 創建 KV 命名空間

```bash
npx wrangler kv:namespace create DSE_KV
```

記下返回的 ID，更新 `wrangler.toml` 中的 `id` 字段。

### 4. 本地開發

```bash
npm run dev
```

訪問 `http://localhost:8787` 查看效果。

### 5. 部署

```bash
# 部署 Workers
npm run deploy

# 部署 Pages（推送到 GitHub 自動部署）
git add .
git commit -m "Deploy DSE RAG System"
git push origin main
```

## 📚 數據導入

### 準備考題數據

考題數據格式（JSON）：

```json
[
  {
    "id": "dse-2024-math-p1-q1",
    "year": "2024",
    "subject": "數學",
    "paper": "Paper 1",
    "number": "1",
    "content": "題目內容...",
    "keywords": ["關鍵詞1", "關鍵詞2"],
    "difficulty": "medium"
  }
]
```

### 導入數據

```bash
node scripts/import-questions.js
```

## 🎯 功能特性

### 1. 智能搜索

- **語義理解**：理解問題含義，不僅匹配關鍵詞
- **相關性排序**：按相似度排序結果
- **多維篩選**：支持科目、年份、難度篩選

### 2. AI 回答

- **上下文感知**：基於檢索到的考題生成回答
- **專業建議**：提供學習要點和解題思路
- **繁體中文**：適合香港學生閱讀

### 3. 性能優化

- **全球 CDN**：Cloudflare 200+ 邊緣節點
- **智能緩存**：常見查詢結果緩存
- **並行處理**：向量搜索和 AI 生成並行執行

## 📖 API 文檔

### POST /api/search

搜索考題並獲取 AI 回答。

**請求體：**

```json
{
  "query": "氣候變化",
  "subject": "geography",
  "year": "2024"
}
```

**響應：**

```json
{
  "success": true,
  "query": "氣候變化",
  "aiAnswer": "AI 生成的回答...",
  "questions": [
    {
      "year": "2024",
      "subject": "地理",
      "paper": "Paper 1",
      "number": "5",
      "content": "題目內容...",
      "score": 0.95
    }
  ],
  "total": 10
}
```

### GET /api/stats

獲取系統統計數據。

**響應：**

```json
{
  "totalQuestions": 1247,
  "subjects": 12,
  "years": 14
}
```

## 🗂️ DSE 科目列表

系統支持以下科目：

| 科目代碼 | 中文名稱 | 英文名稱 |
|---------|---------|----------|
| chinese | 中國語文 | Chinese Language |
| english | 英國語文 | English Language |
| math | 數學 | Mathematics |
| liberal | 通識教育 | Liberal Studies |
| biology | 生物 | Biology |
| chemistry | 化學 | Chemistry |
| physics | 物理 | Physics |
| history | 歷史 | History |
| geography | 地理 | Geography |
| economics | 經濟 | Economics |
| bafs | 企會財 | BAFS |
| ict | 資訊及通訊科技 | ICT |

## 📊 數據收集計劃

### 已收集（示例數據）
- 2024 通識教育 Paper 1
- 2024 數學 Paper 1
- 2023 英國語文 Paper 3

### 待收集科目

#### 核心科目（優先）
- [ ] 中國語文 (2012-2025)
- [ ] 英國語文 (2012-2025)
- [ ] 數學 (2012-2025)
- [ ] 通識教育 / 公民與社會發展 (2012-2025)

#### 選修科目
- [ ] 生物 (2012-2025)
- [ ] 化學 (2012-2025)
- [ ] 物理 (2012-2025)
- [ ] 歷史 (2012-2025)
- [ ] 地理 (2012-2025)
- [ ] 經濟 (2012-2025)
- [ ] 企業、會計與財務概論 (2012-2025)
- [ ] 資訊及通訊科技 (2012-2025)

### 數據來源

1. **香港考試及評核局 (HKEAA)** - 官方試題
   - 網址：https://www.hkeaa.edu.hk/
   - 提供歷屆試卷下載

2. **教育局資源中心** - 教學資源
   - 網址：https://www.edb.gov.hk/

3. **學校資源** - 學校提供的模擬試題

## 🛠️ 開發指南

### 添加新科目

1. 更新 `index.html` 中的科目下拉菜單
2. 準備該科目的考題數據
3. 運行導入腳本

### 自定義 AI 提示詞

編輯 `src/workers/index.js` 中的 `generateAnswer` 函數：

```javascript
const prompt = `你的自定義提示詞...`;
```

### 調整搜索參數

在 `src/workers/index.js` 中修改：

```javascript
const searchResults = await env.VECTORIZE.query(queryEmbedding, {
  topK: 10,  // 返回結果數量
  returnMetadata: true
});
```

## 🔒 隱私與安全

- ✅ 不收集用戶個人信息
- ✅ 搜索查詢不存儲
- ✅ 全程 HTTPS 加密
- ✅ 符合 GDPR 要求

## 💰 成本估算

基於 Cloudflare 免費計劃：

- **Pages**: 免費（無限流量）
- **Workers**: 100,000 請求/天 免費
- **Vectorize**: 測試版免費
- **Workers AI**: 10,000 推理/天 免費

**估計成本：0 USD/月**（中小規模使用）

## 🤝 貢獻指南

歡迎貢獻！

1. Fork 本項目
2. 創建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

### 貢獻考題數據

如果你有 DSE 考題資源，歡迎：

1. 整理成 JSON 格式
2. 提交 Pull Request
3. 或發 Issue 告知

## 📝 許可證

MIT License © 2025 yhliang1648-cmyk

## 🔗 相關鏈接

- **在線演示**: https://auto-knowledge-point.pages.dev
- **GitHub**: https://github.com/yhliang1648-cmyk/auto-knowledge-point
- **Cloudflare Docs**: https://developers.cloudflare.com/

## 📞 聯繫方式

- GitHub: [@yhliang1648-cmyk](https://github.com/yhliang1648-cmyk)
- Issues: [提交問題](https://github.com/yhliang1648-cmyk/auto-knowledge-point/issues)

## 🙏 致謝

- Cloudflare - 提供優秀的邊緣計算平台
- HKEAA - 提供官方考題資源
- 所有貢獻者 - 感謝你們的支持

---

**⭐ 如果這個項目對你有幫助，請給個 Star！**
