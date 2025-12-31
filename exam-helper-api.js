/**
 * 智能刷题助手 - 通义千问API集成
 * 提供OCR识别、AI判题、智能出题功能
 */

class ExamHelperAPI {
  constructor(apiKey) {
    this.apiKey = apiKey || 'sk-e79b72b1a216405c89206aefe865139e';
    this.endpoint = 'https://dashscope.aliyuncs.com';
    this.cache = new Map();
  }

  /**
   * PDF/图片OCR识别
   * @param {string} imageData - Base64编码的图片或图片URL
   * @param {string} type - 'exam' | 'answer' | 'question'
   * @returns {Promise<Object>} OCR识别结果
   */
  async performOCR(imageData, type = 'exam') {
    const prompt = this._getOCRPrompt(type);

    const response = await fetch(`${this.endpoint}/api/v1/services/aigc/multimodal-generation/generation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'X-DashScope-Async': 'enable'
      },
      body: JSON.stringify({
        model: 'qwen-vl-ocr-2025-08-28',
        input: {
          messages: [
            {
              role: 'system',
              content: prompt
            },
            {
              role: 'user',
              content: [
                {
                  image: imageData.startsWith('http') ? imageData : `data:image/jpeg;base64,${imageData}`
                }
              ]
            }
          ]
        },
        parameters: {
          ocr_options: {
            task: 'advanced_recognition'
          }
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OCR API錯誤: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return this._parseOCRResult(data, type);
  }

  /**
   * AI智能判题
   * @param {string} questionImage - 题目图片
   * @param {string} answerImage - 答案图片
   * @param {Object} markingScheme - 评分标准
   * @returns {Promise<Object>} 判题结果
   */
  async gradeAnswer(questionImage, answerImage, markingScheme = {}) {
    // 1. OCR识别题目和答案
    const [questionOCR, answerOCR] = await Promise.all([
      this.performOCR(questionImage, 'question'),
      this.performOCR(answerImage, 'answer')
    ]);

    // 2. 使用qwen-plus进行智能判题
    const gradingPrompt = `你是一位經驗豐富的DSE評卷員。請根據以下信息批改學生答案：

【題目】
${questionOCR.text}

【學生答案】
${answerOCR.text}

【評分準則】
${JSON.stringify(markingScheme, null, 2)}

請提供以下信息：
1. 總分和各步驟得分
2. 答題優點
3. 錯誤分析（指出具體錯誤位置和原因）
4. 改進建議
5. 知識點薄弱分析

請以JSON格式回答：
{
  "totalScore": <分數>,
  "maxScore": <滿分>,
  "stepScores": [{"step": "步驟1", "score": X, "maxScore": Y, "comment": "評語"}],
  "strengths": ["優點1", "優點2"],
  "errors": [{"location": "第X行", "type": "錯誤類型", "description": "錯誤描述", "correction": "正確做法"}],
  "improvements": ["建議1", "建議2"],
  "weakKnowledgePoints": [{"point": "知識點", "severity": "high|medium|low", "suggestion": "強化建議"}],
  "overallComment": "總體評語"
}`;

    const response = await fetch(`${this.endpoint}/compatible-mode/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'qwen-plus',
        messages: [
          {
            role: 'system',
            content: '你是一位專業的DSE評卷員，擅長批改各科目試卷，能夠準確評分並提供詳細的改進建議。'
          },
          {
            role: 'user',
            content: gradingPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 3000,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`判題API錯誤: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return {
      ...result,
      questionOCR,
      answerOCR,
      gradedAt: new Date().toISOString()
    };
  }

  /**
   * 根据薄弱知识点生成类似题目
   * @param {Array} weakPoints - 薄弱知识点列表
   * @param {string} subject - 科目
   * @param {Object} syllabus - 考纲
   * @returns {Promise<Array>} 生成的题目列表
   */
  async generateSimilarQuestions(weakPoints, subject, syllabus = {}) {
    const prompt = `你是一位DSE ${subject}科目的資深出題專家。請根據學生的薄弱知識點出題：

【學生薄弱知識點】
${weakPoints.map((wp, i) => `${i + 1}. ${wp.point} (薄弱程度: ${wp.severity})`).join('\n')}

【考試大綱】
${JSON.stringify(syllabus, null, 2)}

請針對每個薄弱知識點生成2道類似的練習題，題目要求：
1. 難度適中，循序漸進
2. 覆蓋該知識點的核心概念
3. 包含詳細的解題步驟和答案
4. 標註考查的知識點

請以JSON格式回答：
{
  "questions": [
    {
      "id": "生成的唯一ID",
      "knowledgePoint": "對應的知識點",
      "difficulty": "easy|medium|hard",
      "content": "題目內容",
      "options": ["選項A", "選項B", "選項C", "選項D"],  // 如果是選擇題
      "answer": "正確答案",
      "solution": "詳細解題步驟",
      "explanation": "知識點講解",
      "hints": ["提示1", "提示2"],
      "relatedTopics": ["相關主題1", "相關主題2"]
    }
  ]
}`;

    const response = await fetch(`${this.endpoint}/compatible-mode/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'qwen-plus',
        messages: [
          {
            role: 'system',
            content: `你是一位專業的${subject}科目出題專家，精通DSE考試要求和題型。`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 4000,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`出題API錯誤: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return result.questions;
  }

  /**
   * 生成可视化图表（受力分析图、运动动画等）
   * @param {Object} problemData - 题目数据
   * @param {string} visualizationType - 'force' | 'motion' | 'graph'
   * @returns {Promise<Object>} 可视化数据
   */
  async generateVisualization(problemData, visualizationType) {
    const prompt = `請根據以下物理題目生成${this._getVisualizationTypeName(visualizationType)}的描述數據：

【題目】
${problemData.content}

請分析題目並生成可視化所需的數據，以JSON格式回答：

${this._getVisualizationPrompt(visualizationType)}`;

    const response = await fetch(`${this.endpoint}/compatible-mode/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'qwen-plus',
        messages: [
          {
            role: 'system',
            content: '你是一位物理教學專家，擅長將物理問題可視化，幫助學生理解抽象概念。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`可視化API錯誤: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  }

  /**
   * 批量处理PDF试卷
   * @param {File} pdfFile - PDF文件
   * @returns {Promise<Object>} 处理结果
   */
  async processPDFExam(pdfFile) {
    // 注意: 需要前端使用PDF.js将PDF转换为图片
    // 这里假设已经转换完成
    throw new Error('PDF處理需要在前端使用PDF.js轉換為圖片後調用performOCR');
  }

  // ========== 私有方法 ==========

  _getOCRPrompt(type) {
    const prompts = {
      exam: '請識別試卷中的所有文字，包括題號、題目內容、選項等。保持原有格式和結構。',
      answer: '請識別答卷中的所有文字，包括手寫內容、公式、圖表等。特別注意數學公式和特殊符號。',
      question: '請識別題目的完整內容，包括題目文字、數學公式、圖表說明等。'
    };
    return prompts[type] || prompts.exam;
  }

  _parseOCRResult(data, type) {
    const content = data.output.choices[0].message.content;

    // 提取文字和边界框
    const text = Array.isArray(content)
      ? content.filter(c => c.text).map(c => c.text).join('\n')
      : content[0]?.text || '';

    const boxes = Array.isArray(content)
      ? content.filter(c => c.box).map(c => c.box)
      : [];

    return {
      text,
      boxes,
      type,
      timestamp: new Date().toISOString()
    };
  }

  _getVisualizationTypeName(type) {
    const names = {
      force: '受力分析圖',
      motion: '運動軌跡動畫',
      graph: '函數圖像'
    };
    return names[type] || '可視化圖表';
  }

  _getVisualizationPrompt(type) {
    const prompts = {
      force: `{
  "objects": [{"name": "物體名稱", "mass": 質量, "position": {"x": X座標, "y": Y座標}}],
  "forces": [{"name": "力名稱", "magnitude": 大小, "direction": 方向角度, "appliedTo": "作用物體", "color": "顏色"}],
  "surface": {"type": "surface類型", "angle": 傾角, "friction": 摩擦係數},
  "annotations": [{"text": "標註文字", "position": {"x": X, "y": Y}}]
}`,
      motion: `{
  "object": {"name": "物體名稱", "initialPosition": {"x": X, "y": Y}, "initialVelocity": {"x": Vx, "y": Vy}},
  "trajectory": [{"t": 時間, "x": X座標, "y": Y座標, "vx": X速度, "vy": Y速度}],
  "keyFrames": [{"time": 關鍵時刻, "description": "描述", "highlight": true}],
  "environment": {"gravity": 重力加速度, "airResistance": 空氣阻力}
}`,
      graph: `{
  "function": "函數表達式",
  "domain": {"min": 最小值, "max": 最大值},
  "range": {"min": 最小值, "max": 最大值},
  "keyPoints": [{"x": X座標, "y": Y座標, "type": "極值|零點|交點", "label": "標籤"}],
  "asymptotes": [{"type": "vertical|horizontal", "value": 值, "equation": "方程"}]
}`
    };
    return prompts[type] || prompts.force;
  }
}

// 导出API类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ExamHelperAPI;
}
