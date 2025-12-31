# 🎓 香港AI教育平台

> 集成多個教育項目的綜合平台 - DSE智能檢索 + AI課程展示 + 科學史探索

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Cloudflare](https://img.shields.io/badge/Powered%20by-Cloudflare-orange)](https://cloudflare.com)

---

## 📋 平台概述

本平台整合了**五大創新教育項目**，為香港學生提供全方位的AI學習體驗：

### 🔍 1. DSE 考題智能檢索系統
基於 RAG（檢索增強生成）的香港中學文憑試歷屆考題知識庫 (2012-2025)

### 📚 2. 斯坦福AI課程（香港版）
基於斯坦福大學 CS146S 課程改編，分為小學、初中、高中三個級別

### 🚀 3. AI創客小達人課程
12週項目制學習(PBL)課程，專為香港中小學生設計，強調炫酷成果展示

### 🌌 4. 認知邊界探索者
基於吳國盛《科學的歷程》，用AI技術重構科學史教育，探索人類認知突破的關鍵節點

### 📸 5. 智能刷題助手
拍照批改、知識診斷、智能出題、可視化講解的AI驅動個性化學習系統，支持移動端App

---

## 🌐 在線訪問

| 項目 | 網址 | 說明 |
|------|------|------|
| **DSE RAG 系統** | [index.html](https://yhliang1648-cmyk.github.io/auto-knowledge-point/index.html) | DSE 考題智能搜索 |
| **斯坦福AI課程** | [ai-course.html](https://yhliang1648-cmyk.github.io/auto-knowledge-point/ai-course.html) | 三級AI課程大綱 |
| **AI創客小達人** | [hk-ai-maker.html](https://yhliang1648-cmyk.github.io/auto-knowledge-point/hk-ai-maker.html) | 12週PBL課程 |
| **認知邊界探索者** | [cognitive-explorer.html](https://yhliang1648-cmyk.github.io/auto-knowledge-point/cognitive-explorer.html) | 科學史AI導師 |
| **智能刷題助手** | [exam-helper.html](https://yhliang1648-cmyk.github.io/auto-knowledge-point/exam-helper.html) | AI批改+出題 |

---

## 📊 項目對比

| 特性 | DSE RAG | 斯坦福課程 | AI創客 | 認知探索者 | 刷題助手 |
|------|---------|-----------|--------|-----------|---------|
| **目標用戶** | DSE考生 | 中小學生 | 中小學生 | 中學生-大學生 | 所有學生 |
| **課程時長** | 按需 | 8-16週 | 12週 | 55-67學時 | 隨時 |
| **學習方式** | 智能檢索 | 理論+實踐 | PBL | 沉浸式體驗 | 拍照批改 |
| **技術難度** | 使用系統 | 中-高 | 低-中 | 中 | 使用系統 |
| **成果展示** | - | 作品集+證書 | 3-5個應用 | 認知博物館 | 成績提升 |
| **特色** | RAG技術 | 斯坦福標準 | 炫酷遊戲化 | AI歷史對話 | OCR+AI批改 |
| **平台** | Web | Web | Web | Web | **Web+App** |

---

## 🎯 項目一：DSE 考題智能檢索系統

### 核心功能

- **🔍 語義搜索**：不僅匹配關鍵詞，更理解問題含義
- **🤖 AI 解答**：基於歷屆考題提供專業建議
- **📊 智能分類**：按科目、年份、難度篩選
- **⚡ 極速響應**：全球 CDN 加速，毫秒級響應

### 技術架構

- **前端**: HTML5 + CSS3 + Vanilla JavaScript
- **後端**: Cloudflare Workers (Edge Computing)
- **數據庫**: Cloudflare D1 + Vectorize (向量數據庫)
- **存儲**: Cloudflare R2 (PDF存儲)
- **AI 模型**: **通義千問 (Qwen)** - OCR、問答、向量化

### 支持科目

中國語文 | 英國語文 | 數學 | 通識教育 | 生物 | 化學 | 物理 | 歷史 | 地理 | 經濟 | 企會財 | ICT

📖 [查看詳細文檔](./DEPLOYMENT_GUIDE.md)

---

## 🎓 項目二：斯坦福AI課程（香港版）

### 課程結構

#### 🎨 小學級別（P4-P6）：AI 小創客
- **課時**：8週 × 1.5小時
- **工具**：Scratch、ChatGPT、Teachable Machine
- **項目**：AI故事創作、圖像識別、聊天機器人
- **成果**：AI小創客證書

#### 🚀 初中級別（S1-S3）：AI 應用開發者
- **課時**：12週 × 2小時
- **工具**：Python、OpenAI API、Streamlit
- **項目**：智能筆記、RAG問答、Web應用
- **成果**：AI應用開發者證書

#### 🎓 高中級別（S4-S6）：AI 工程師
- **課時**：16週 × 3小時
- **工具**：Cursor、Claude Code、Warp
- **項目**：全棧應用、MCP服務器、多技術棧
- **成果**：AI工程師證書 + 作品集

### 核心內容（基於斯坦福 CS146S）

1. **Prompting Techniques** - 提示詞技巧
2. **AI-Assisted Development** - AI輔助開發
3. **Model Context Protocol** - MCP服務器
4. **Autonomous Coding Agent** - 自主編碼代理
5. **Multi-Agent Development** - 多代理開發
6. **Security Scanning** - 安全掃描
7. **AI Code Review** - AI代碼審查
8. **Multi-Stack Development** - 多技術棧開發

📖 [查看詳細課程](./AI_COURSE_README.md)

---

## 🚀 項目三：AI創客小達人課程

### 課程理念

**「學中做，做中學」** - 以項目制學習(PBL)為核心，每週炫酷成果展示

### 六大炫酷特色

1. **🎨 視覺衝擊** - 色彩鮮明、流暢動畫、AR/VR體驗
2. **⚡ 即時反饋** - 視覺/聲音獎勵、成就感爆棚
3. **🎮 遊戲化學習** - 積分、徽章、排行榜
4. **📱 作品集系統** - 在線作品集、隨時查看、一鍵分享
5. **👨‍👩‍👧 家長可見** - 過程記錄、展示日、成長報告
6. **🇭🇰 本地化適配** - 中英粵三語、香港元素、DSE相關

### 課程三階段（12週）

#### 📖 第一階段：AI初體驗（第1-3週）
- Week 1: AI就在我身邊 📱
- Week 2: 和AI聊天真有趣 💬
- Week 3: AI小畫家 🎨

#### 🛠️ 第二階段：AI小工程師（第4-8週）
- Week 4-5: 智能識別小專家 🔍
- Week 6-7: 遊戲AI設計師 🎮
- Week 8: 語音AI小助手 🎤

#### 🏆 第三階段：AI創新項目（第9-12週）
- Week 9: 項目構思工作坊 💡
- Week 10-11: 項目開發衝刺 ⚡
- Week 12: 成果展示日 🎉

### 學生將帶走

- 📂 個人AI作品集（數字版 + 展示視頻）
- 💻 3-5個可運行的AI應用
- 🧠 對AI的基本理解和濃厚興趣
- 🏆 在展示會上獲得的成就感與自信
- 🎓 「AI小創客」證書

📖 [查看詳細課程](./AI_MAKER_README.md)

---

## 🌌 項目四：認知邊界探索者

### 課程理念

**基於吳國盛《科學的歷程》** - 用AI技術重構科學史教育，讓學習者「重走」人類認知突破的關鍵節點

### 核心特色

1. **🕰️ 時間卷軸式學習** - 在科學史時間線上自由穿梭，親歷2500年認知演進
2. **🎯 認知邊界具象化** - 可視化每個時代的「已知世界」與「未知邊界」
3. **🤖 AI歷史導師對話** - 與泰勒斯、伽利略、牛頓、愛因斯坦的AI人格深度對話
4. **🔬 思想實驗工坊** - 重演芝諾悖論、伽利略斜面、薛定諤的貓等經典實驗

### 課程五階段（55-67學時）

#### 📖 模組一：認知的覺醒（8-10學時）
- 神話思維到理性思維
- 柏拉圖學園與亞里士多德傳統
- 數理科學傳統的確立

#### 🌍 模組二：科學革命（10-12學時）
- 宇宙中心的消解（托勒密→哥白尼）
- 新工具的誕生（伽利略實驗）
- 牛頓的「重構世界」

#### 🧪 模組三：認知的分化與專業化（12-15學時）
- 化學革命中的認知重構
- 生命科學的範式革命（達爾文）
- 電磁世界的統一（麥克斯韋）

#### 🌀 模組四：認知基礎的震盪（15-18學時）
- 相對論：時空觀的顛覆
- 量子革命：確定性的終結
- 宇宙學與複雜性

#### 🔮 模組五：當代認知前沿與反思（10-12學時）
- 認知科學革命
- 科學、技術與人類世
- 終極大作業：個人認知邊界突破圖譜

### 學習成果

- 🏛️ **個人認知博物館** - 收集科學思想「標本」，認知突破時間線
- 🗺️ **認知邊界地圖** - 個人「已知-未知-不可知」動態地圖
- 🔬 **思想實驗作品集** - 原創思想實驗設計與分享
- 🧠 **科學思維能力** - 理解科學突破本質，培養認知勇氣

### 技術架構

- **多模態AI導師系統** - 為每位科學家構建獨特AI人格
- **認知邊界可視化引擎** - 動態知識圖譜與突破瞬間再現
- **沉浸式體驗平台** - Unity/Unreal + WebGL，支持VR/AR
- **知識圖譜系統** - 科學史本體構建，中西科學對比

📖 [查看詳細內容](./COGNITIVE_EXPLORER_README.md)

---

## 📁 項目結構

```
auto-knowledge-point/
├── index.html                       # DSE RAG 系統主頁
├── ai-course.html                   # 斯坦福AI課程展示頁
├── hk-ai-maker.html                 # AI創客小達人展示頁
├── cognitive-explorer.html          # 認知邊界探索者展示頁
├── course-materials/                # 課程資料
│   ├── Stanford_CS146S_Course_Summary.md
│   └── HK_Students_AI_Curriculum.md
├── src/
│   └── workers/
│       └── index.js                 # Cloudflare Workers API
├── data/
│   └── questions/
│       └── all-questions.json       # DSE考題數據
├── scripts/
│   └── import-questions.js          # 數據導入腳本
├── docs/                            # 文檔
│   ├── DEPLOYMENT_GUIDE.md
│   ├── API_SETUP_GUIDE.md
│   ├── DATA_MANAGEMENT_GUIDE.md
│   └── MANUAL_DEPLOY.md
├── AI_COURSE_README.md              # 斯坦福課程文檔
├── AI_MAKER_README.md               # 創客課程文檔
├── COGNITIVE_EXPLORER_README.md     # 認知探索者文檔
├── package.json
├── wrangler.toml
└── README.md                        # 本文檔
```

---

## 🚀 快速開始

### 方式一：在線訪問（推薦）

直接訪問以下網址：

- **DSE RAG**: https://yhliang1648-cmyk.github.io/auto-knowledge-point/index.html
- **斯坦福AI課程**: https://yhliang1648-cmyk.github.io/auto-knowledge-point/ai-course.html
- **AI創客小達人**: https://yhliang1648-cmyk.github.io/auto-knowledge-point/hk-ai-maker.html

### 方式二：本地運行

```bash
# 1. 克隆項目
git clone https://github.com/yhliang1648-cmyk/auto-knowledge-point.git
cd auto-knowledge-point

# 2. 用瀏覽器打開HTML文件
# 打開 index.html（DSE系統）
# 打開 ai-course.html（斯坦福課程）
# 打開 hk-ai-maker.html（創客課程）
```

### 方式三：部署到 Cloudflare Pages

1. Fork 本倉庫到你的 GitHub 賬號
2. 訪問 [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. 進入 **Workers & Pages** → **Create application**
4. 選擇 **Pages** → **Connect to Git**
5. 選擇你 fork 的倉庫
6. 點擊 **Save and Deploy**

---

## 📚 文檔導航

### DSE RAG 系統
- [部署指南](./DEPLOYMENT_GUIDE.md)
- [API 設置](./API_SETUP_GUIDE.md)
- [數據管理](./DATA_MANAGEMENT_GUIDE.md)
- [手動部署](./MANUAL_DEPLOY.md)
- [PDF 功能](./PDF_FEATURE_GUIDE.md)

### AI 課程
- [斯坦福AI課程詳情](./AI_COURSE_README.md)
- [AI創客小達人詳情](./AI_MAKER_README.md)
- [課程資料下載](./course-materials/)

---

## 🛠️ 技術棧總覽

### 前端技術
- HTML5 + CSS3 + JavaScript
- 響應式設計
- 動畫效果（CSS Animations）
- 粒子效果（JavaScript Canvas）

### 後端技術
- Cloudflare Workers（Edge Computing）
- Serverless Functions
- RESTful API

### AI 技術
- DeepSeek API（LLM）
- OpenAI API（可選）
- Cloudflare Workers AI
- RAG（檢索增強生成）
- Vector Database（Vectorize）

### 部署平台
- Cloudflare Pages（前端）
- Cloudflare Workers（API）
- GitHub Pages（靜態網站）

---

## 🎯 適用對象

| 項目 | 適用對象 | 學習目標 |
|------|---------|---------|
| **DSE RAG** | DSE考生、教師 | 高效備考、智能檢索 |
| **斯坦福課程** | 中小學生、教師 | 系統學習AI開發 |
| **創客課程** | 中小學生 | 快速成果、趣味學習 |

---

## 💡 使用建議

### 對於學生
1. **備考DSE** → 使用 DSE RAG 系統搜索歷屆考題
2. **學習AI** → 根據年級選擇斯坦福課程級別
3. **快速成果** → 參加AI創客小達人課程

### 對於教師
1. **教學輔助** → 使用 DSE RAG 系統準備教材
2. **課程設計** → 參考斯坦福課程或創客課程大綱
3. **學生展示** → 組織AI作品展示日

### 對於家長
1. **了解AI教育** → 瀏覽課程網站了解內容
2. **監督學習** → 查看孩子的在線作品集
3. **參與展示** → 參加成果展示日活動

---

## 🔒 隱私與安全

- ✅ 不收集用戶個人信息
- ✅ 搜索查詢不存儲
- ✅ 全程 HTTPS 加密
- ✅ 符合 GDPR 和香港隱私條例

---

## 💰 成本估算

### 免費使用（Cloudflare 免費計劃）
- Pages: 免費（無限流量）
- Workers: 100,000 請求/天
- Vectorize: 測試版免費
- Workers AI: 10,000 推理/天

### 付費選項（如需更高配額）
- DeepSeek API: ~0.001 USD/1K tokens
- OpenAI API: ~0.002 USD/1K tokens

---

## 🤝 貢獻指南

歡迎貢獻！你可以：

1. **提交 Bug 報告** - 通過 Issues 反饋問題
2. **貢獻 DSE 考題** - 整理並提交考題數據
3. **改進課程內容** - 提出課程優化建議
4. **翻譯文檔** - 幫助翻譯成其他語言
5. **分享使用體驗** - 告訴我們你的使用感受

### 提交流程

1. Fork 本項目
2. 創建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

---

## 📝 許可證

MIT License © 2025 yhliang1648-cmyk

詳見 [LICENSE](./LICENSE) 文件

---

## 🔗 相關鏈接

### 項目鏈接
- **GitHub 倉庫**: https://github.com/yhliang1648-cmyk/auto-knowledge-point
- **在線演示**: https://yhliang1648-cmyk.github.io/auto-knowledge-point/

### 參考資源
- **斯坦福 CS146S**: https://themodernsoftware.dev
- **Cloudflare 文檔**: https://developers.cloudflare.com/
- **香港考評局**: https://www.hkeaa.edu.hk/
- **通義千問API**: https://help.aliyun.com/zh/model-studio/qwen-api-reference

---

## 🤖 通義千問API集成

本平台已全面集成**阿里雲通義千問（Qwen）API**，提供以下AI能力：

### API功能

| 功能 | 模型 | 應用場景 |
|------|------|---------|
| **OCR識別** | qwen-vl-ocr-2025-08-28 | 試卷識別、答卷批改 |
| **AI問答** | qwen-plus | 智能判題、知識問答 |
| **向量搜索** | text-embedding-v3 | 語義搜索、題目推薦 |
| **內容生成** | qwen-plus | 智能出題、講解生成 |

### 使用示例

```javascript
// OCR識別
const api = new ExamHelperAPI('sk-e79b72b1a216405c89206aefe865139e');
const result = await api.performOCR(imageBase64, 'exam');

// AI判題
const grading = await api.gradeAnswer(questionImage, answerImage);

// 生成練習題
const questions = await api.generateSimilarQuestions(weakPoints, '數學');
```

### 集成文檔

- 📖 [完整集成指南](./QWEN_INTEGRATION_GUIDE.md)
- 🚀 [Cloudflare RAG部署](./cloudflare-rag/README.md)
- 💡 [API使用示例](./exam-helper-api.js)

---

## 📞 聯繫方式

- **GitHub**: [@yhliang1648-cmyk](https://github.com/yhliang1648-cmyk)
- **Issues**: [提交問題](https://github.com/yhliang1648-cmyk/auto-knowledge-point/issues)
- **Email**: [您的郵箱]

---

## 🙏 致謝

- **Cloudflare** - 提供優秀的邊緣計算平台
- **Stanford University** - CS146S 課程靈感來源
- **HKEAA** - 提供官方 DSE 考題資源
- **DeepSeek** - 提供高性價比的 AI API
- **所有貢獻者** - 感謝你們的支持

---

## 📈 項目統計

| 指標 | 數值 |
|------|------|
| ⭐ GitHub Stars | - |
| 🔀 Forks | - |
| 📊 總訪問量 | - |
| 📚 課程數量 | 3個 |
| 🎓 支援級別 | 小學-高中 |
| 🌍 支援語言 | 中文、英文、粵語 |

---

## 🗺️ 發展路線圖

### 已完成 ✅
- [x] DSE RAG 系統基礎功能
- [x] 斯坦福AI課程大綱設計
- [x] AI創客小達人課程設計
- [x] 三個項目的展示網站
- [x] 完整文檔和指南

### 進行中 🚧
- [ ] DSE 考題數據收集（12科 × 14年）
- [ ] 課程視頻教材製作
- [ ] 學生作品集系統開發
- [ ] 家長管理後台開發

### 未來計劃 🔮
- [ ] 移動應用開發（iOS/Android）
- [ ] 在線代碼編輯器集成
- [ ] AI 教學助手聊天機器人
- [ ] 學生社區論壇
- [ ] 線下課程合作

---

**⭐ 如果這個項目對你有幫助，請給個 Star！**

**🚀 讓我們一起用AI改變教育！**

---

© 2025 香港AI教育計劃 | 讓每個孩子都能擁抱AI時代
