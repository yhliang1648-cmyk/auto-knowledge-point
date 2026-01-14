# 📚 DSE 考題數據來源指南

本文檔整理了獲取 DSE 歷屆試題的官方和合法渠道。

## 🏛️ 官方來源（推薦）

### 1. 香港考試及評核局 (HKEAA)

**官方網站**: https://www.hkeaa.edu.hk/tc/public-examinations-and-assessment/hkdse/past-papers/index.html

**獲取方式**：

#### 方式 A：網上訂購
- 訪問 [HKEAA 網上書店](https://www.hkeaa.edu.hk/)
- 購買印刷版或電子版試題專輯
- 支持信用卡、轉數快等支付方式

#### 方式 B：現場購買
- 地址：新蒲崗爵祿街 17 號 3-4 樓
- 辦公時間：週一至五 08:45-17:30（週六 09:00-13:00）
- 可即場購買試題專輯

#### 方式 C：學校訂購
- 學校考生可透過學校統一訂購
- 享有團體優惠價格

**包含科目**：
- 23 科甲類科目完整試題
- 2012-2025 年歷屆試卷
- 包含試題、評分參考、考生表現報告

**價格參考**：
- 印刷版：約 HK$50-80/科/年
- 電子版：約 HK$30-50/科/年

### 2. 樣本試卷（Sample Papers）

**網址**: https://www.hkeaa.edu.hk/en/hkdse/assessment/sample_practice_paper/

**特點**：
- 完全免費
- 包含評分準則
- 適合熟悉考試形式

## 📖 合法第三方資源

### 1. DSE Treasure
- **網址**: https://dsetreasure.com/dse-past-paper/
- **特點**: 整理了 23 科 DSE Past Paper
- **注意**: 部分內容可能需要付費

### 2. DSE.Best
- **網址**: https://dse.best/
- **科目**: 中文、英文、數學、物理、化學、生物等
- **格式**: PDF 下載

### 3. DSE Web
- **網址**: https://www.dseweb.site/past-papers
- **年份**: 2012-2025
- **特點**: 免費下載

## ⚖️ 版權須知

### 重要提醒

1. **HKEAA 擁有所有 DSE 試題的版權**
2. **未經授權不得商業使用**
3. **建議從官方渠道獲取**
4. **教育用途需遵守合理使用原則**

### 本項目使用原則

本 RAG 系統的考題使用遵循以下原則：

✅ **允許**：
- 個人學習和研究
- 非商業性質的教育用途
- 引用小部分內容並標註來源

❌ **不允許**：
- 大量複製完整試卷並公開傳播
- 商業用途（如補習社收費使用）
- 去除版權標記

## 📋 數據收集計劃

### Phase 1: 核心科目（優先）

| 科目 | 年份範圍 | 狀態 | 來源 |
|------|---------|------|------|
| 中國語文 | 2012-2025 | ⏳ 待收集 | HKEAA 官方 |
| 英國語文 | 2012-2025 | ⏳ 待收集 | HKEAA 官方 |
| 數學 | 2012-2025 | ⏳ 待收集 | HKEAA 官方 |
| 通識/公民 | 2012-2025 | ⏳ 待收集 | HKEAA 官方 |

### Phase 2: 選修科目

| 科目 | 年份範圍 | 狀態 | 預計題數 |
|------|---------|------|---------|
| 物理 | 2012-2025 | ⏳ 待收集 | ~500 |
| 化學 | 2012-2025 | ⏳ 待收集 | ~500 |
| 生物 | 2012-2025 | ⏳ 待收集 | ~500 |
| 歷史 | 2012-2025 | ⏳ 待收集 | ~400 |
| 地理 | 2012-2025 | ⏳ 待收集 | ~400 |
| 經濟 | 2012-2025 | ⏳ 待收集 | ~400 |
| BAFS | 2012-2025 | ⏳ 待收集 | ~400 |
| ICT | 2012-2025 | ⏳ 待收集 | ~350 |

## 🔄 數據處理流程

### 1. 獲取原始試卷
```bash
# 從官方渠道下載 PDF
# 或使用已有的試卷文件
```

### 2. 提取題目內容
```bash
# 使用 PDF 提取工具
# 推薦：pdfplumber、PyPDF2、Adobe Acrobat
```

### 3. 整理成 JSON 格式
```json
{
  "id": "dse-2024-math-p1-q1",
  "year": "2024",
  "subject": "數學",
  "paper": "Paper 1",
  "number": "1",
  "content": "題目內容...",
  "keywords": ["關鍵詞"],
  "difficulty": "medium",
  "source": "HKEAA 2024 數學科試題專輯",
  "copyright": "© HKEAA"
}
```

### 4. 導入到向量數據庫
```bash
node scripts/import-questions.js
```

## 🤝 貢獻數據

如果你願意分享合法獲得的考題數據：

### 方式 1: Pull Request
1. Fork 本項目
2. 將數據整理成 JSON 格式
3. 放入 `data/questions/` 目錄
4. 提交 PR

### 方式 2: Issue
1. 在 GitHub 創建 Issue
2. 標題：`[數據貢獻] 科目名稱 年份`
3. 描述數據來源和範圍

### 數據格式模板
```json
[
  {
    "id": "unique-id",
    "year": "YYYY",
    "subject": "科目名稱",
    "paper": "Paper X",
    "number": "題號",
    "content": "完整題目內容",
    "keywords": ["關鍵詞1", "關鍵詞2"],
    "difficulty": "easy|medium|hard",
    "source": "數據來源",
    "copyright": "版權聲明"
  }
]
```

## 📞 聯繫 HKEAA

如需官方授權或有疑問：

- **電話**: (852) 3628 8833
- **電郵**: dse@hkeaa.edu.hk
- **地址**: 香港新蒲崗爵祿街17號
- **辦公時間**: 週一至五 08:45-17:30

## 🔗 相關資源

- [HKEAA 官網](https://www.hkeaa.edu.hk/)
- [DSE 考試報告](https://www.hkeaa.edu.hk/tc/hkdse/assessment/exam_reports/)
- [評分參考](https://www.hkeaa.edu.hk/tc/hkdse/assessment/marking_schemes/)
- [考生表現示例](https://www.hkeaa.edu.hk/tc/hkdse/assessment/candidates_performance/)

---

**更新時間**: 2025-12-25
**維護者**: @yhliang1648-cmyk

Sources:
- [HKEAA DSE Past Papers](https://www.hkeaa.edu.hk/tc/public-examinations-and-assessment/hkdse/past-papers/index.html)
- [DSE 2025 Past Paper](https://blog.hkeaa.edu.hk/blog/DSE-2025-past-paper)
- [DSE.Best Past Papers](https://dse.best/)
- [DSE Web Archive](https://www.dseweb.site/past-papers)
- [DSE Treasure Complete Resource](https://dsetreasure.com/dse-past-paper/)
