# 🎓 香港中小學生 AI 課程

基於斯坦福大學 CS146S《現代軟件開發者》課程改編，專為香港中小學生設計。

## 📚 項目簡介

本項目提供完整的 AI 課程體系，分為三個級別：
- **小學級別（P4-P6）**：AI 小創客
- **初中級別（S1-S3）**：AI 應用開發者
- **高中級別（S4-S6）**：AI 工程師

## 🌐 在線訪問

**課程展示網站**：[訪問課程主頁](ai-course.html)

**GitHub 倉庫**：https://github.com/yhliang1648-cmyk/auto-knowledge-point

## 📖 課程特色

✅ **循序漸進**：從玩具項目到實用工具再到專業應用
✅ **實踐為主**：80% 動手項目 + 20% 理論知識
✅ **前沿技術**：與斯坦福課程同步，使用最新 AI 工具
✅ **本地適配**：結合 DSE、香港教育特色
✅ **安全優先**：各級別都強調網絡安全和倫理

## 🛠️ 技術棧

### 小學級別
- Scratch
- ChatGPT
- Teachable Machine
- Craiyon / AutoDraw
- CodePen

### 初中級別
- Python
- OpenAI API / Claude API
- Streamlit
- LangChain
- FAISS / ChromaDB
- Flask
- HTML/CSS/JavaScript

### 高中級別
- Cursor IDE
- Claude Code
- Warp Terminal
- FastAPI
- Model Context Protocol (MCP)
- Semgrep
- Graphite
- Bolt.new
- MERN / Django / Rails

## 📥 課程資料下載

所有課程材料均已保存在 `course-materials/` 文件夾：

1. **Stanford_CS146S_Course_Summary.md**
   斯坦福原課程詳細總結（8週完整內容）

2. **HK_Students_AI_Curriculum.md**
   香港學生 AI 課程大綱（三級完整教案）

您也可以通過課程網站的下載按鈕獲取這些資料。

## 📊 課程結構對比

| 維度 | 小學 P4-P6 | 初中 S1-S3 | 高中 S4-S6 |
|------|------------|------------|------------|
| **課時** | 8週 × 1.5小時 | 12週 × 2小時 | 16週 × 3小時 |
| **編程語言** | Scratch、簡單HTML | Python | Python + JavaScript |
| **AI工具** | ChatGPT、Teachable Machine | OpenAI API、Streamlit | Cursor、Claude Code、Warp |
| **項目複雜度** | 互動故事、簡單分類器 | Web應用、聊天機器人 | 全棧應用、多技術棧 |
| **核心技能** | 計算思維、基礎提示 | 編程基礎、AI集成 | 軟件工程、AI工作流 |
| **最終成果** | 創意作品展示 | 實用工具應用 | 完整產品 + 技術報告 |

## 🎯 學習目標

### 小學（P4-P6）
- 認識 AI 和編程的基本概念
- 學會與 AI 對話來解決問題
- 培養計算思維和創造力
- 完成簡單的互動項目

### 初中（S1-S3）
- 掌握基礎編程概念（Python）
- 學習多種 AI 提示技術
- 開發實用的 AI 應用
- 培養問題解決能力

### 高中（S4-S6）
- 掌握專業級 AI 開發工具
- 理解 AI 工作流程和最佳實踐
- 構建可部署的 AI 應用
- 培養工程思維和創新能力

## 🏛️ 斯坦福 CS146S 課程

本課程基於斯坦福大學 2025 年秋季開設的 CS146S：

**課程名稱**：The Modern Software Developer
**授課教師**：Mihail Eric
**官方網站**：https://themodernsoftware.dev
**GitHub 倉庫**：https://github.com/mihail911/modern-software-dev-assignments

### 8 週課程內容

1. **Week 1**: Prompting Techniques（提示詞技巧）
2. **Week 2**: Action Item Extractor（行動項提取器）
3. **Week 3**: Build a Custom MCP Server（MCP 服務器）
4. **Week 4**: The Autonomous Coding Agent（自主編碼代理）
5. **Week 5**: Agentic Development with Warp（Warp 開發）
6. **Week 6**: Scan and Fix Vulnerabilities（漏洞掃描）
7. **Week 7**: AI Code Review Using Graphite（AI 代碼審查）
8. **Week 8**: Multi-Stack Web App Build（多技術棧應用）

## 🚀 部署說明

### Cloudflare Pages 部署

1. 訪問 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 進入 **Workers & Pages** → **Create application**
3. 選擇 **Pages** → **Connect to Git**
4. 連接 GitHub 倉庫：`yhliang1648-cmyk/auto-knowledge-point`
5. 設置構建配置：
   - **Build command**: 留空（靜態網站）
   - **Build output directory**: `/`
   - **Root directory**: `/`
6. 點擊 **Save and Deploy**

部署完成後，可通過 Cloudflare 提供的 URL 訪問。

### 本地運行

1. 克隆倉庫：
```bash
git clone https://github.com/yhliang1648-cmyk/auto-knowledge-point.git
cd auto-knowledge-point
```

2. 用瀏覽器打開 `ai-course.html` 即可

## 📁 項目結構

```
auto-knowledge-point/
├── ai-course.html                 # AI 課程展示主頁
├── course-materials/              # 課程資料文件夾
│   ├── Stanford_CS146S_Course_Summary.md
│   └── HK_Students_AI_Curriculum.md
├── index.html                     # DSE RAG 系統（之前的項目）
├── MANUAL_DEPLOY.md               # 部署指南
├── PDF_FEATURE_GUIDE.md           # PDF 功能指南
└── AI_COURSE_README.md            # 本文件

注：桌面文件夾 ~/Desktop/stanford-ai-hk-course/ 包含課程資料的本地副本
```

## 🎓 證書與升學

完成課程後，學生可獲得：
- **小學**：AI 小創客證書
- **初中**：AI 應用開發者證書
- **高中**：AI 工程師證書 + 項目作品集

## 📞 聯繫方式

如需更多課程資料或技術支持，請通過以下方式聯繫：

- **GitHub Issues**: 在本倉庫提交 Issue
- **Email**: [您的聯繫郵箱]

## 📄 許可證

本項目基於斯坦福 CS146S 課程改編，僅供教育用途。

---

**© 2025 香港 AI 教育計劃**

基於斯坦福大學 CS146S 課程 | 適合香港中小學生
