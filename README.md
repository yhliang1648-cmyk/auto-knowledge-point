# 🎓 香港AI教育平台

> 集成多個教育項目的綜合平台 - DSE智能檢索 + AI課程展示 + 科學史探索

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Cloudflare](https://img.shields.io/badge/Powered%20by-Cloudflare-orange)](https://cloudflare.com)

---

## 📋 平台概述

本平台整合了**八大創新教育項目**，為香港學生和教師提供全方位的AI學習與教學體驗：

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

### 📖 6. 教材試卷評估系統
教師專用AI評估工具，上傳教材和試卷即可獲得考點覆蓋率、難度分析、適應性評估報告

### 🧪 7. API測試系統
開發者工具，支持測試各類API端點，實時顯示響應結果、請求歷史和性能統計

### 🌟 8. 香港未來學校 ⭐ (最新)
參考埃隆·馬斯克Ad Astra理念，問題導向學習、打破年級制度、項目制教學，培養星際時代的人才

---

## 🌐 在線訪問

| 項目 | 網址 | 說明 |
|------|------|------|
| **DSE RAG 系統** | [index.html](https://yhliang1648-cmyk.github.io/auto-knowledge-point/index.html) | DSE 考題智能搜索 |
| **斯坦福AI課程** | [ai-course.html](https://yhliang1648-cmyk.github.io/auto-knowledge-point/ai-course.html) | 三級AI課程大綱 |
| **AI創客小達人** | [hk-ai-maker.html](https://yhliang1648-cmyk.github.io/auto-knowledge-point/hk-ai-maker.html) | 12週PBL課程 |
| **認知邊界探索者** | [cognitive-explorer.html](https://yhliang1648-cmyk.github.io/auto-knowledge-point/cognitive-explorer.html) | 科學史AI導師 |
| **智能刷題助手** | [exam-helper.html](https://yhliang1648-cmyk.github.io/auto-knowledge-point/exam-helper.html) | AI批改+出題 |
| **教材評估系統** | [textbook-eval.html](https://yhliang1648-cmyk.github.io/auto-knowledge-point/textbook-eval.html) | 教材考點評估 |
| **API測試系統** | [api-tester.html](https://yhliang1648-cmyk.github.io/auto-knowledge-point/api-tester.html) | API端點測試 |
| **香港未來學校** ⭐ | [future-school.html](https://yhliang1648-cmyk.github.io/auto-knowledge-point/future-school.html) | 馬斯克式教育 |

---

## 📊 項目對比

| 特性 | DSE RAG | 斯坦福課程 | AI創客 | 認知探索者 | 刷題助手 | 教材評估 | API測試 | 未來學校 |
|------|---------|-----------|--------|-----------|---------|---------|---------|---------|
| **目標用戶** | DSE考生 | 中小學生 | 中小學生 | 中學生-大學生 | 所有學生 | 教師 | 開發者 | 7-16歲學生 |
| **課程時長** | 按需 | 8-16週 | 12週 | 55-67學時 | 隨時 | 按需 | 按需 | 2年制 |
| **學習方式** | 智能檢索 | 理論+實踐 | PBL | 沉浸式體驗 | 拍照批改 | 上傳評估 | API測試 | 問題導向PBL |
| **技術難度** | 使用系統 | 中-高 | 低-中 | 中 | 使用系統 | 使用系統 | 開發工具 | 中-高 |
| **成果展示** | - | 作品集+證書 | 3-5個應用 | 認知博物館 | 成績提升 | 評估報告 | API狀態 | Capstone項目 |
| **特色** | RAG技術 | 斯坦福標準 | 炫酷遊戲化 | AI歷史對話 | OCR+AI批改 | AI智能評估 | 實時測試 | 馬斯克理念 |
| **平台** | Web | Web | Web | Web | **Web+App** | Web | Web | 實體學校 |

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

## 📖 項目六：教材試卷評估系統

### 系統概述

**教材試卷評估系統**是專為教師設計的AI評估工具，幫助教師快速評估教材質量和試卷難度。

### 核心功能

#### 📤 1. 教材上傳與管理
- **拖拽上傳** - 支持PDF、圖片格式教材和試卷
- **自動OCR** - 使用通義千問OCR提取文字和公式
- **智能分類** - 教材、試卷、練習冊、教學大綱自動分類
- **知識點提取** - AI自動識別教材中的知識點和主題

#### 📊 2. AI智能評估
- **考點覆蓋率分析**
  - 已覆蓋的DSE考點列表
  - 缺失的重要考點提醒
  - 覆蓋率百分比可視化

- **難度分布分析**
  - 簡單/中等/困難題目比例
  - 難度曲線圖表展示
  - 難度平衡建議

- **適應性評估**
  - 教材與香港課程大綱的匹配度
  - 適合的年級和學生水平
  - 優點與不足分析
  - 改進建議

#### 📚 3. RAG知識庫建設
- **自動向量化** - 教材內容自動生成embedding向量
- **語義檢索** - 基於Cloudflare Vectorize的相似度搜索
- **知識關聯** - 自動關聯相關教材和歷年考題
- **持續優化** - 隨著上傳教材增多，評估越來越準確

#### 📈 4. 統計與報告
- **評估歷史** - 查看所有評估記錄
- **趨勢分析** - 教材質量趨勢圖表
- **導出報告** - PDF格式評估報告下載
- **對比分析** - 多個教材橫向對比

### 使用場景

1. **教材選擇** - 幫助學校選擇最適合的教材
2. **試卷編制** - 評估自編試卷的質量和難度
3. **教學準備** - 快速了解教材的知識點分布
4. **質量監控** - 持續監控教學資料質量

### 技術特點

- **OCR識別** - qwen-vl-ocr-2025-08-28，支持手寫體和數學公式
- **AI評估** - qwen-plus模型，專業教育評估分析
- **向量搜索** - text-embedding-v3 + Cloudflare Vectorize
- **實時處理** - 邊緣計算，毫秒級響應

📖 [立即試用](https://yhliang1648-cmyk.github.io/auto-knowledge-point/textbook-eval.html)

---

## 🧪 項目七：API測試系統

### 系統概述

**API測試系統**是開發者專用工具，提供便捷的API端點測試和調試功能。

### 核心功能

#### 🔧 1. 多方法支持
- **GET** - 獲取資源
- **POST** - 創建資源
- **PUT** - 更新資源
- **DELETE** - 刪除資源

#### 📝 2. 請求配置
- **URL輸入** - 支持任意HTTP/HTTPS端點
- **請求頭配置** - JSON格式自定義Headers
- **請求體編輯** - JSON格式請求數據
- **參數驗證** - 實時JSON格式校驗

#### 📊 3. 響應分析
- **響應數據** - 自動格式化JSON/文本響應
- **響應頭查看** - 完整HTTP響應頭展示
- **狀態碼顯示** - 成功/錯誤/警告狀態標識
- **響應時間** - 毫秒級性能監控

#### 📚 4. 歷史與統計
- **請求歷史** - 自動保存所有請求記錄
- **歷史回放** - 一鍵重發歷史請求
- **統計數據**
  - 總請求數
  - 成功率百分比
  - 平均響應時間
  - 最快/最慢請求記錄

#### ⚡ 5. 快速測試模板
- **本地健康檢查** - `localhost:8080/api/health`
- **通義千問API** - Qwen API測試
- **GitHub API** - 公共API測試
- **JSONPlaceholder** - RESTful API示例

### 使用場景

1. **API開發調試** - 快速測試開發中的API端點
2. **第三方API驗證** - 檢查外部API是否可用
3. **性能監控** - 追踪API響應時間
4. **問題排查** - 查看詳細錯誤信息和響應頭
5. **API文檔測試** - 驗證API文檔的正確性

### 技術特點

- **CORS支持** - 自動處理跨域請求
- **錯誤處理** - 詳細的錯誤信息展示
- **本地存儲** - LocalStorage持久化歷史記錄
- **實時驗證** - JSON格式實時校驗
- **響應式設計** - 適配各種屏幕尺寸

### 特色功能

- **狀態徽章** - 直觀顯示API狀態（綠色=成功，紅色=失敗）
- **語法高亮** - JSON數據自動格式化和高亮
- **一鍵清除** - 快速清空請求配置
- **歷史管理** - 查看、重發、清除歷史記錄

📖 [立即試用](https://yhliang1648-cmyk.github.io/auto-knowledge-point/api-tester.html)

---

## 🌟 項目八：香港未來學校

### 系統概述

**香港未來學校**參考埃隆·馬斯克Ad Astra/Astra Nova的創新教育理念，打破傳統學校的束縛，實現問題導向學習、打破年級制度、項目制教學，培養星際時代的創新人才。

> **"Per Aspera Ad Astra"** - 歷經坎坷，終抵群星

### 核心理念（10大Ad Astra特點）

#### 1️⃣ 問題導向學習
從真實世界的問題出發，而非從學科出發。
- **例子**：如何設計火星殖民地？這個問題自然涉及物理、化學、工程、生物等多學科知識。

#### 2️⃣ 打破年級制度
根據能力而非年齡分組，數學能力強的8歲孩子可以和12歲孩子一起上高級課程。

#### 3️⃣ 項目制學習（PBL）
每個項目都是跨學科的真實挑戰，學生在解決問題中學習。

#### 4️⃣ STEM為核心
強調科學、技術、工程、數學，培養未來工程師和科學家。

#### 5️⃣ 倫理與批判性思維
不只教知識，更教如何思考、質疑、判斷是非。

#### 6️⃣ 遊戲化與模擬
把學習變成遊戲和模擬，在玩中學，在學中玩。

#### 7️⃣ 小班教學
每班8-15人，保證每個學生得到充分關注。

#### 8️⃣ 個性化學習路徑
每個學生的學習計劃都是量身定制的，沒有統一的教科書。

#### 9️⃣ 跨學科整合
物理、數學、編程、工程不是分開的科目，而是解決問題的工具。

🔟 第一原則思維
從基本假設出發，挑戰常識，重新構建解決方案。

### 香港特色（6大優勢）

#### 🗣️ 1. 三語教學環境
**中文（繁體）+ 英文 + 粵語**
- 國際視野與本地文化結合
- DSE與國際課程雙軌準備
- 真正的國際化人才培養

#### 🌊 2. 維港創新生態
- 鄰近香港科學園、數碼港
- 定期參訪科技公司和實驗室
- 企業導師計劃

#### 🌏 3. 大灣區資源整合
- 深圳、廣州科技企業合作
- 跨境創新項目
- 灣區人才交流

#### 🎓 4. DSE + 國際雙軌
- 傳統DSE升學路徑
- 國際大學申請支持
- 多元升學選擇

#### 💼 5. 金融與科技中心
- 獨特的金融科技教育
- 創業與商業思維培養
- 真實商業案例學習

#### 🔬 6. 亞洲科技樞紐
- 與亞洲頂尖大學聯動
- AI、機器人、生物科技資源
- 國際競賽平台

### 核心課程模塊（6個）

#### 🚀 模塊1：火星計劃 Mars Project

**核心問題**：如何在火星上建立人類殖民地？

**涉及學科**：物理（重力、大氣壓力）、化學（生命維持系統）、工程（建築設計）、生物（植物栽培）、數學（資源計算）

**項目成果**：
- 設計火星基地3D模型
- 計算資源需求和成本
- 提出生命維持系統方案
- 團隊演示答辯

**學習時長**：8-10週

#### ⚡ 模塊2：能源革命 Energy Revolution

**核心問題**：如何讓香港實現100%清潔能源？

**涉及學科**：物理（能量轉換）、工程（太陽能、風能）、經濟（成本效益）、政治（政策制定）

**項目成果**：
- 香港能源轉型方案
- 成本收益分析報告
- 可行性研究

**學習時長**：6-8週

#### 🤖 模塊3：AI倫理實驗室 AI Ethics Lab

**核心問題**：AI會取代人類嗎？我們應該如何監管AI？

**涉及學科**：編程（AI開發）、哲學（倫理思考）、法律（監管政策）、社會學（影響分析）

**項目成果**：
- 構建AI倫理框架
- 編寫AI監管建議書
- AI辯論賽

**學習時長**：4-6週

#### 🛠️ 模塊4：創客工坊 Maker Lab

**核心問題**：如何用科技解決生活中的實際問題？

**涉及學科**：工程、編程、3D打印、電子電路

**項目成果**：
- 設計並製造實用產品
- 申請專利（如果創新）
- 產品展示與推廣

**學習時長**：持續進行

#### 💰 模塊5：商業模擬 Business Simulation

**核心問題**：如何創辦並運營一家科技公司？

**涉及學科**：商業、經濟、市場營銷、財務管理

**項目成果**：
- 商業計劃書
- 模擬公司運營
- 投資者路演

**學習時長**：6-8週

#### 🌍 模塊6：全球挑戰 Global Challenges

**核心問題**：如何解決氣候變化、糧食危機、水資源短缺等全球問題？

**涉及學科**：環境科學、工程、經濟、政治、國際關係

**項目成果**：
- 全球問題解決方案
- 聯合國模擬提案
- 國際合作項目

**學習時長**：8-10週

### 學習路徑（2年制）

#### 📍 第1-3個月：探索期
- 完成個性化能力評估
- 參與多個試探性項目
- 學習基本工具使用（編程、3D建模等）
- 找到自己的興趣方向

#### 📍 第4-12個月：深化期
- 選擇2-3個核心項目深入學習
- 掌握跨學科知識整合能力
- 開始獨立提出問題和解決方案
- 參與團隊協作項目

#### 📍 第13-18個月：專精期
- 選定1-2個領域專精
- 參與複雜的綜合性項目
- 導師一對一指導
- 準備Capstone項目

#### 📍 第19-24個月：突破期
- 完成Capstone畢業項目
- 申請專利或發表論文
- 參加國際競賽
- 升學準備（DSE或國際大學）

### 傳統學校 vs 未來學校

| 對比維度 | 傳統學校 | 香港未來學校 |
|---------|---------|-------------|
| **教學方式** | 從工具（學科）出發 | 從問題出發 |
| **班級設置** | 按年齡分班 | 按能力分組 |
| **課程設置** | 固定課表、統一教材 | 個性化學習路徑 |
| **評估方式** | 考試分數 | 項目成果+能力評估 |
| **學習目標** | 記住知識 | 解決問題+創新思維 |
| **師生關系** | 教師講授 | 導師引導 |
| **學習環境** | 教室為主 | 實驗室、工作坊、企業參訪 |
| **成果展示** | 試卷成績 | 實物作品+演示答辯 |
| **升學準備** | DSE應試 | DSE + 國際大學雙軌 |
| **培養目標** | 考試型人才 | 創新型領袖 |

### 招生與費用

#### 👥 招生對象
- **年齡**：7-16歲（小一至中四年級）
- **能力**：通過入學評估（非應試考試，重點評估好奇心、創造力、學習潛力）
- **語言**：中英文基本溝通能力

#### 💰 學費參考（年度）
- **全日制課程**：HKD 180,000 - 250,000/年
- **半日制課程**：HKD 100,000 - 150,000/年
- **週末創客營**：HKD 30,000 - 50,000/年

#### 🎓 獎學金計劃
- 全額獎學金（1-2名/年）：覆蓋100%學費
- 半額獎學金（3-5名/年）：覆蓋50%學費
- 項目獎學金：根據項目表現發放

### 使用場景

1. **替代傳統學校** - 全日制創新教育
2. **創新教育試點** - 與傳統學校合作開設實驗班
3. **課外補充** - 週末和假期的項目制學習
4. **升學準備** - DSE與國際大學申請雙軌支持
5. **企業人才培養** - 科技公司定向培養計劃

### 技術特點

- **在線學習平台** - 個性化學習儀表板、項目管理系統
- **AI學習助手** - 24/7問答支持、學習路徑推薦
- **虛擬實驗室** - VR/AR沉浸式學習體驗
- **作品集系統** - 數字化項目成果展示
- **家長端應用** - 實時了解孩子學習進度

### 教育成果預期

**知識層面**：
- 深度理解科學、工程、商業的本質
- 掌握跨學科知識整合能力
- 養成終身學習習慣

**能力層面**：
- 複雜問題解決能力
- 批判性思維與創新能力
- 團隊協作與領導力
- 溝通表達與演示能力

**升學路徑**：
- 香港DSE考試（如需要）
- 國際大學申請（美國、英國、加拿大等）
- 科技公司實習機會
- 創業孵化支持

📖 [立即了解](https://yhliang1648-cmyk.github.io/auto-knowledge-point/future-school.html)

---

## 📁 項目結構

```
auto-knowledge-point/
├── index.html                       # DSE RAG 系統主頁
├── ai-course.html                   # 斯坦福AI課程展示頁
├── hk-ai-maker.html                 # AI創客小達人展示頁
├── cognitive-explorer.html          # 認知邊界探索者展示頁
├── exam-helper-app.html             # 智能刷題助手完整版
├── textbook-eval.html               # 教材試卷評估系統
├── api-tester.html                  # API測試系統
├── future-school.html               # 香港未來學校 ⭐ (最新)
├── exam-helper-api.js               # 通義千問API封裝類
├── cloudflare-rag/                  # Cloudflare RAG後端
│   ├── src/
│   │   └── worker.js                # Workers API (已更新)
│   ├── scripts/
│   │   └── import-questions.js      # 數據導入腳本
│   ├── schema.sql                   # D1數據庫Schema (已更新)
│   ├── wrangler.toml                # Workers配置
│   ├── package.json
│   ├── deploy.sh                    # 一鍵部署腳本
│   └── README.md                    # 部署指南
├── course-materials/                # 課程資料
│   ├── Stanford_CS146S_Course_Summary.md
│   └── HK_Students_AI_Curriculum.md
├── data/
│   └── questions/
│       └── all-questions.json       # DSE考題數據
├── docs/                            # 文檔
│   ├── DEPLOYMENT_GUIDE.md
│   ├── API_SETUP_GUIDE.md
│   ├── DATA_MANAGEMENT_GUIDE.md
│   └── MANUAL_DEPLOY.md
├── AI_COURSE_README.md              # 斯坦福課程文檔
├── AI_MAKER_README.md               # 創客課程文檔
├── COGNITIVE_EXPLORER_README.md     # 認知探索者文檔
├── QWEN_INTEGRATION_GUIDE.md        # 通義千問集成指南
├── IMPLEMENTATION_SUMMARY.md        # 實施總結
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
| **認知探索者** | 中學生-大學生 | 科學思維、認知突破 |
| **刷題助手** | 所有學生 | AI批改、成績提升 |
| **教材評估** | 教師、教研人員 | 教材質量評估、試卷編制 |
| **API測試** | 開發者、技術人員 | API調試、性能監控 |
| **未來學校** | 7-16歲學生 | 問題導向、創新思維、未來人才 |

---

## 💡 使用建議

### 對於學生
1. **備考DSE** → 使用 DSE RAG 系統搜索歷屆考題
2. **學習AI** → 根據年級選擇斯坦福課程級別
3. **快速成果** → 參加AI創客小達人課程
4. **提升成績** → 使用智能刷題助手拍照批改、生成練習題

### 對於教師
1. **教學輔助** → 使用 DSE RAG 系統準備教材
2. **課程設計** → 參考斯坦福課程或創客課程大綱
3. **學生展示** → 組織AI作品展示日
4. **教材評估** → 使用教材評估系統分析教材質量和試卷難度
5. **備課準備** → 快速了解教材知識點分布和考點覆蓋率

### 對於家長
1. **了解AI教育** → 瀏覽課程網站了解內容
2. **監督學習** → 查看孩子的在線作品集
3. **參與展示** → 參加成果展示日活動

### 對於開發者
1. **API測試** → 使用API測試系統調試各類API端點
2. **性能監控** → 追踪API響應時間和成功率
3. **問題排查** → 查看詳細錯誤信息和響應頭

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
| 📚 系統數量 | 8個 |
| 🎓 支援級別 | 小學-高中-大學 |
| 👥 目標用戶 | 學生、教師、開發者 |
| 🌍 支援語言 | 中文、英文、粵語 |

---

## 🗺️ 發展路線圖

### 已完成 ✅
- [x] DSE RAG 系統基礎功能
- [x] 斯坦福AI課程大綱設計
- [x] AI創客小達人課程設計
- [x] 認知邊界探索者課程設計
- [x] 智能刷題助手（通義千問API集成）
- [x] 教材試卷評估系統
- [x] API測試系統
- [x] 香港未來學校（Ad Astra模式） ⭐ (最新)
- [x] Cloudflare RAG後端實現
- [x] 八個項目的展示網站
- [x] 完整文檔和指南

### 進行中 🚧
- [ ] DSE 考題數據收集（12科 × 14年）
- [ ] Cloudflare Workers實際部署
- [ ] 教材評估系統RAG數據庫建設
- [ ] 課程視頻教材製作
- [ ] 學生作品集系統開發
- [ ] 家長管理後台開發

### 未來計劃 🔮
- [ ] 移動應用開發（iOS/Android）
- [ ] 在線代碼編輯器集成
- [ ] AI 教學助手聊天機器人
- [ ] 學生社區論壇
- [ ] 線下課程合作
- [ ] 教師管理後台（教材庫、學生管理）

---

**⭐ 如果這個項目對你有幫助，請給個 Star！**

**🚀 讓我們一起用AI改變教育！**

---

© 2025 香港AI教育計劃 | 讓每個孩子都能擁抱AI時代
