# 智能刷題助手 - 技術實現方案

## 🏗️ 系統架構

```
┌─────────────────┐
│  移動端 App     │ (React Native)
│  Web 前端       │ (React)
└────────┬────────┘
         │ HTTPS/REST API
         ↓
┌─────────────────┐
│   API Gateway   │ (Cloudflare Workers)
└────────┬────────┘
         │
    ┌────┴────┬─────────┬──────────┐
    ↓         ↓         ↓          ↓
┌────────┐┌────────┐┌────────┐┌────────┐
│OCR服務││AI批改││題庫││數據││        ││服務  ││系統  ││分析  │
└────────┘└────────┘└────────┘└────────┘
    │         │         │          │
    └─────────┴─────────┴──────────┘
                 ↓
        ┌──────────────┐
        │ 數據庫集群  │
        │ MongoDB     │
        │ PostgreSQL  │
        │ Redis       │
        └──────────────┘
```

---

## 📸 模組一：OCR識別系統

### 1.1 圖像預處理

#### 前端處理（客戶端）
```javascript
// 使用Canvas API進行圖像預處理
async function preprocessImage(imageFile) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = await loadImage(imageFile);

    // 1. 調整尺寸（最大邊2000px，減少上傳時間）
    const maxSize = 2000;
    const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // 2. 增強對比度
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    enhanceContrast(imageData); // 使用histogram equalization
    ctx.putImageData(imageData, 0, 0);

    // 3. 銳化處理（提升OCR準確率）
    applyUnsharpMask(ctx, canvas.width, canvas.height);

    // 4. 轉Base64上傳
    return canvas.toDataURL('image/jpeg', 0.9);
}
```

#### 後端處理（服務器）
```python
# 使用OpenCV進行高級圖像處理
import cv2
import numpy as np

def server_side_preprocess(image_path):
    # 1. 讀取圖像
    img = cv2.imread(image_path)

    # 2. 灰度轉換
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # 3. 自動邊緣檢測 + 透視校正
    edges = cv2.Canny(gray, 50, 150)
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # 找到最大矩形（試卷邊界）
    largest_contour = max(contours, key=cv2.contourArea)
    rect = cv2.minAreaRect(largest_contour)
    box = cv2.boxPoints(rect)

    # 透視變換（校正拍攝角度）
    warped = four_point_transform(img, box)

    # 4. 去噪（雙邊濾波，保留邊緣）
    denoised = cv2.bilateralFilter(warped, 9, 75, 75)

    # 5. 自適應二值化（處理光線不均）
    binary = cv2.adaptiveThreshold(
        denoised, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY, 11, 2
    )

    return binary
```

### 1.2 OCR引擎選擇與集成

#### 印刷體識別：Google Cloud Vision API
```javascript
// Node.js後端調用示例
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient({
    keyFilename: './google-credentials.json'
});

async function recognizePrintedText(imageBuffer) {
    const [result] = await client.textDetection(imageBuffer);
    const detections = result.textAnnotations;

    if (detections.length === 0) return '';

    // 第一個結果是完整文字，後續是單個字詞及位置
    const fullText = detections[0].description;
    const words = detections.slice(1).map(d => ({
        text: d.description,
        boundingBox: d.boundingPoly.vertices,
        confidence: d.confidence
    }));

    return { fullText, words };
}
```

#### 手寫體識別：Azure Computer Vision
```python
# Python後端調用示例
from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from msrest.authentication import CognitiveServicesCredentials

client = ComputerVisionClient(
    endpoint=os.environ["AZURE_VISION_ENDPOINT"],
    credentials=CognitiveServicesCredentials(os.environ["AZURE_VISION_KEY"])
)

def recognize_handwriting(image_path):
    with open(image_path, 'rb') as image_stream:
        # 提交手寫識別請求
        recognize_result = client.read_in_stream(image_stream, raw=True)
        operation_id = recognize_result.headers["Operation-Location"].split("/")[-1]

        # 等待結果
        while True:
            result = client.get_read_result(operation_id)
            if result.status not in ['notStarted', 'running']:
                break
            time.sleep(1)

        # 提取文字
        if result.status == 'succeeded':
            lines = []
            for page in result.analyze_result.read_results:
                for line in page.lines:
                    lines.append({
                        'text': line.text,
                        'boundingBox': line.bounding_box,
                        'confidence': line.confidence
                    })
            return lines
    return []
```

#### 數學公式識別：Mathpix API
```javascript
// 專門識別數學公式和LaTeX
const axios = require('axios');

async function recognizeMathFormula(imageBuffer) {
    const response = await axios.post('https://api.mathpix.com/v3/text', {
        src: `data:image/jpeg;base64,${imageBuffer.toString('base64')}`,
        formats: ['latex_styled', 'text'],
        include_svg: true
    }, {
        headers: {
            'app_id': process.env.MATHPIX_APP_ID,
            'app_key': process.env.MATHPIX_APP_KEY
        }
    });

    return {
        latex: response.data.latex_styled,
        text: response.data.text,
        confidence: response.data.confidence,
        svg: response.data.svg // 可視化公式
    };
}
```

### 1.3 混合識別策略

```javascript
// 智能選擇OCR引擎
async function smartOCR(imageBuffer, contentType) {
    const results = await Promise.all([
        recognizePrintedText(imageBuffer),  // Google Vision
        recognizeHandwriting(imageBuffer),  // Azure Vision
        recognizeMathFormula(imageBuffer)   // Mathpix
    ]);

    // 融合多個OCR結果
    const merged = mergeOCRResults(results, contentType);

    // 後處理：糾錯、標準化
    const cleaned = postProcess(merged);

    return cleaned;
}

function mergeOCRResults(results, contentType) {
    // 根據內容類型權重融合
    if (contentType === 'math_heavy') {
        return {
            text: results[2].text,      // Mathpix優先
            latex: results[2].latex,
            confidence: results[2].confidence
        };
    } else if (contentType === 'handwritten') {
        return results[1];  // Azure手寫識別
    } else {
        return results[0];  // Google印刷體
    }
}
```

---

## 🤖 模組二：AI批改引擎

### 2.1 GPT-4 Vision批改

```javascript
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function gradeWithGPT4Vision(questionImage, answerImage, markingScheme) {
    const response = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
            {
                role: "system",
                content: `你是一位經驗豐富的DSE評卷員。請根據以下評分準則批改學生答案：

                評分標準：
                ${markingScheme}

                請提供：
                1. 分數（X/總分）
                2. 每個步驟的得分情況
                3. 錯誤原因分析
                4. 改進建議

                格式要求：返回JSON格式`
            },
            {
                role: "user",
                content: [
                    {
                        type: "image_url",
                        image_url: { url: `data:image/jpeg;base64,${questionImage}` }
                    },
                    {
                        type: "text",
                        text: "以上是題目"
                    },
                    {
                        type: "image_url",
                        image_url: { url: `data:image/jpeg;base64,${answerImage}` }
                    },
                    {
                        type: "text",
                        text: "以上是學生答案，請批改"
                    }
                ]
            }
        ],
        max_tokens: 2000,
        temperature: 0.3  // 低temperature保證批改一致性
    });

    // 解析JSON響應
    const gradingResult = JSON.parse(response.choices[0].message.content);
    return gradingResult;
}
```

### 2.2 Claude 3.5 Sonnet批改（長文本優勢）

```javascript
const Anthropic = require('@anthropic-ai/sdk');
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function gradeWithClaude(questionText, answerText, markingScheme) {
    const message = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 4096,
        messages: [
            {
                role: "user",
                content: `請批改以下學生答案：

題目：
${questionText}

學生答案：
${answerText}

評分準則：
${markingScheme}

請以JSON格式返回：
{
  "score": 總分,
  "max_score": 滿分,
  "step_scores": [
    {"step": 1, "score": X, "reason": "..."},
    {"step": 2, "score": X, "reason": "..."}
  ],
  "error_type": "概念錯誤/計算錯誤/審題錯誤",
  "knowledge_point": "二次方程求根",
  "suggestions": ["建議1", "建議2"]
}`
            }
        ]
    });

    return JSON.parse(message.content[0].text);
}
```

### 2.3 本地微調模型（學科專用）

```python
# 使用Hugging Face Transformers微調BERT模型
from transformers import AutoModelForSequenceClassification, AutoTokenizer, Trainer, TrainingArguments
import torch

# 加載預訓練模型
model_name = "bert-base-chinese"
model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=2)
tokenizer = AutoTokenizer.from_pretrained(model_name)

# 準備數據集（DSE歷屆試題 + 標準答案）
def prepare_dataset(questions, answers, scores):
    encodings = tokenizer(
        questions,
        answers,
        truncation=True,
        padding=True,
        max_length=512
    )

    dataset = {
        'input_ids': encodings['input_ids'],
        'attention_mask': encodings['attention_mask'],
        'labels': scores  # 0-10分
    }
    return dataset

# 訓練
training_args = TrainingArguments(
    output_dir='./dse_grading_model',
    num_train_epochs=10,
    per_device_train_batch_size=8,
    save_steps=1000,
    evaluation_strategy="steps"
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset
)

trainer.train()
```

### 2.4 批改結果後處理

```javascript
function postProcessGradingResult(rawResult, ocrText) {
    // 1. 驗證分數合理性
    if (rawResult.score > rawResult.max_score) {
        rawResult.score = rawResult.max_score;
    }

    // 2. 知識點標準化（映射到知識圖譜）
    rawResult.knowledge_point = normalizeKnowledgePoint(rawResult.knowledge_point);

    // 3. 生成詳細報告
    const report = {
        ...rawResult,
        graded_at: new Date().toISOString(),
        ocr_text: ocrText,
        confidence: calculateConfidence(rawResult),
        next_steps: generateNextSteps(rawResult)
    };

    return report;
}

function calculateConfidence(result) {
    // 基於多個因素計算置信度
    let confidence = 0.8;  // 基礎置信度

    // OCR質量高 → +0.1
    if (result.ocr_quality === 'high') confidence += 0.1;

    // 答案完整 → +0.05
    if (result.answer_completeness === 'full') confidence += 0.05;

    // AI模型一致性 → +0.05
    if (result.model_agreement > 0.9) confidence += 0.05;

    return Math.min(confidence, 1.0);
}
```

---

## 📊 模組三：知識點診斷系統

### 3.1 知識圖譜構建（Neo4j）

```cypher
// 創建知識圖譜
// 學科
CREATE (math:Subject {name: "數學", code: "MATH"})

// 大主題
CREATE (algebra:Topic {name: "代數", level: 1})
CREATE (geometry:Topic {name: "幾何", level: 1})

// 子主題
CREATE (equation:Topic {name: "方程式", level: 2})
CREATE (function:Topic {name: "函數", level: 2})

// 具體知識點
CREATE (quadratic:KnowledgePoint {
  name: "二次方程",
  difficulty: 3,
  dse_frequency: 0.85
})
CREATE (factorization:KnowledgePoint {name: "因式分解"})
CREATE (discriminant:KnowledgePoint {name: "判別式"})

// 建立關係
CREATE (math)-[:CONTAINS]->(algebra)
CREATE (algebra)-[:CONTAINS]->(equation)
CREATE (equation)-[:CONTAINS]->(quadratic)
CREATE (quadratic)-[:REQUIRES]->(factorization)
CREATE (quadratic)-[:RELATED_TO]->(discriminant)
```

### 3.2 薄弱點分析算法

```javascript
// 計算每個知識點的錯誤率
async function analyzeWeakPoints(userId) {
    const query = `
        MATCH (u:User {id: $userId})-[a:ATTEMPTED]->(q:Question)-[:TESTS]->(kp:KnowledgePoint)
        WITH kp,
             COUNT(a) as total_attempts,
             SUM(CASE WHEN a.correct = false THEN 1 ELSE 0 END) as errors
        WHERE total_attempts >= 3  // 至少做過3次
        RETURN kp.name as knowledge_point,
               kp.difficulty as difficulty,
               toFloat(errors) / total_attempts as error_rate,
               total_attempts
        ORDER BY error_rate DESC
        LIMIT 10
    `;

    const result = await neo4j.run(query, { userId });

    // 計算優先級（錯誤率 × 難度 × DSE頻率）
    return result.records.map(r => ({
        knowledge_point: r.get('knowledge_point'),
        error_rate: r.get('error_rate'),
        difficulty: r.get('difficulty'),
        priority: calculatePriority(r),
        recommendation: generateRecommendation(r)
    }));
}

function calculatePriority(record) {
    const errorRate = record.get('error_rate');
    const difficulty = record.get('difficulty');
    const dseFrequency = record.get('dse_frequency') || 0.5;

    // 優先級公式
    return errorRate * 0.5 + difficulty * 0.3 + dseFrequency * 0.2;
}
```

### 3.3 學習路徑生成

```javascript
async function generateLearningPath(userId, targetExamDate) {
    const weakPoints = await analyzeWeakPoints(userId);
    const availableDays = Math.ceil((targetExamDate - new Date()) / (1000 * 60 * 60 * 24));

    // 艾賓浩斯遺忘曲線間隔（天）
    const reviewIntervals = [1, 3, 7, 15, 30];

    const learningPath = [];
    let currentDay = 1;

    for (const wp of weakPoints) {
        // 初次學習
        learningPath.push({
            day: currentDay,
            knowledge_point: wp.knowledge_point,
            activity: 'initial_study',
            duration: 30,  // 分鐘
            resources: await getStudyResources(wp.knowledge_point)
        });

        // 安排複習
        for (const interval of reviewIntervals) {
            if (currentDay + interval <= availableDays) {
                learningPath.push({
                    day: currentDay + interval,
                    knowledge_point: wp.knowledge_point,
                    activity: 'review',
                    duration: 15,
                    question_count: 3
                });
            }
        }

        currentDay += 2;  // 每個知識點間隔2天
    }

    return learningPath.sort((a, b) => a.day - b.day);
}
```

---

## 📝 模組四：智能出題系統

### 4.1 題庫結構

```javascript
// MongoDB題庫Schema
const QuestionSchema = new mongoose.Schema({
    question_id: { type: String, unique: true },
    subject: { type: String, enum: ['math', 'physics', 'chemistry'] },
    knowledge_points: [{ type: String, index: true }],  // 多個知識點
    difficulty: { type: Number, min: 1, max: 5 },
    question_type: { type: String, enum: ['mc', 'short', 'long'] },

    // 題目內容
    question_text: { type: String, required: true },
    question_images: [{ type: String }],  // S3 URLs

    // 答案
    correct_answer: { type: mongoose.Schema.Types.Mixed },
    marking_scheme: { type: String },  // 評分準則

    // 元數據
    source: { type: String },  // DSE 2024, Mock Exam等
    year: { type: Number },
    usage_count: { type: Number, default: 0 },
    avg_correctness: { type: Number, default: 0.5 },

    // 相似題
    similar_questions: [{ type: String }],  // question_ids

    created_at: { type: Date, default: Date.now }
});
```

### 4.2 相似題生成（基於GPT-4）

```javascript
async function generateSimilarQuestions(originalQuestion, count = 3) {
    const prompt = `基於以下原題，生成${count}道相似題目。要求：
1. 保持相同的知識點和難度
2. 改變數值、情境或問法
3. 確保答案不同

原題：
${originalQuestion.question_text}

請以JSON數組格式返回：
[
  {
    "question_text": "...",
    "correct_answer": "...",
    "marking_scheme": "..."
  }
]`;

    const response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
            { role: "system", content: "你是DSE數學出題專家" },
            { role: "user", content: prompt }
        ],
        temperature: 0.8  // 較高temperature增加多樣性
    });

    const generatedQuestions = JSON.parse(response.choices[0].message.content);

    // 保存到題庫
    const savedQuestions = await Promise.all(
        generatedQuestions.map(q => {
            return new Question({
                ...q,
                subject: originalQuestion.subject,
                knowledge_points: originalQuestion.knowledge_points,
                difficulty: originalQuestion.difficulty,
                source: 'ai_generated',
                similar_questions: [originalQuestion.question_id]
            }).save();
        })
    );

    return savedQuestions;
}
```

### 4.3 智能題目匹配

```javascript
async function findMatchingQuestions(weakPoints, count = 10) {
    // 構建查詢條件
    const pipeline = [
        // 1. 匹配知識點
        {
            $match: {
                knowledge_points: { $in: weakPoints.map(wp => wp.name) }
            }
        },

        // 2. 計算匹配度
        {
            $addFields: {
                match_score: {
                    $let: {
                        vars: {
                            kp_count: { $size: "$knowledge_points" },
                            matched_count: {
                                $size: {
                                    $setIntersection: [
                                        "$knowledge_points",
                                        weakPoints.map(wp => wp.name)
                                    ]
                                }
                            }
                        },
                        in: { $divide: ["$$matched_count", "$$kp_count"] }
                    }
                }
            }
        },

        // 3. 按匹配度和難度排序
        {
            $sort: {
                match_score: -1,
                difficulty: 1,
                usage_count: 1  // 優先推送較少做過的題
            }
        },

        // 4. 限制數量
        { $limit: count }
    ];

    const questions = await Question.aggregate(pipeline);
    return questions;
}
```

---

## 🎨 模組五：可視化生成系統

### 5.1 物理受力分析圖生成

```javascript
// 解析物理題目，提取物體和力
function parsePhysicsProblem(questionText) {
    // 使用GPT-4提取結構化信息
    const prompt = `分析以下物理題目，提取物體和受力信息：

${questionText}

返回JSON格式：
{
  "objects": [
    {
      "name": "小球",
      "mass": 2,
      "position": {"x": 0, "y": 0}
    }
  ],
  "forces": [
    {
      "name": "重力",
      "magnitude": 20,
      "direction": 270,
      "acting_on": "小球"
    }
  ],
  "surface": {
    "type": "inclined_plane",
    "angle": 30
  }
}`;

    return callGPT4(prompt);
}

// 使用Canvas繪製受力分析圖
function drawForceAnalysis(canvas, parsedData) {
    const ctx = canvas.getContext('2d');
    const { objects, forces, surface } = parsedData;

    // 1. 繪製表面（斜面/地面）
    if (surface.type === 'inclined_plane') {
        ctx.beginPath();
        ctx.moveTo(0, 400);
        ctx.lineTo(600, 400 - 600 * Math.tan(surface.angle * Math.PI / 180));
        ctx.stroke();
    }

    // 2. 繪製物體
    objects.forEach(obj => {
        ctx.fillStyle = '#4a90e2';
        ctx.fillRect(obj.position.x - 25, obj.position.y - 25, 50, 50);
        ctx.fillText(obj.name, obj.position.x, obj.position.y + 40);
    });

    // 3. 繪製力向量
    forces.forEach(force => {
        const obj = objects.find(o => o.name === force.acting_on);
        if (!obj) return;

        const arrowLength = force.magnitude * 5;  // 縮放
        const angleRad = force.direction * Math.PI / 180;

        // 箭頭終點
        const endX = obj.position.x + arrowLength * Math.cos(angleRad);
        const endY = obj.position.y + arrowLength * Math.sin(angleRad);

        // 繪製箭頭
        drawArrow(ctx, obj.position.x, obj.position.y, endX, endY, force.name);
    });
}

function drawArrow(ctx, x1, y1, x2, y2, label) {
    // 箭頭主線
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // 箭頭頭部
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const arrowSize = 15;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(
        x2 - arrowSize * Math.cos(angle - Math.PI / 6),
        y2 - arrowSize * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(x2, y2);
    ctx.lineTo(
        x2 - arrowSize * Math.cos(angle + Math.PI / 6),
        y2 - arrowSize * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();

    // 標籤
    ctx.fillStyle = '#000';
    ctx.fillText(label, (x1 + x2) / 2, (y1 + y2) / 2 - 10);
}
```

### 5.2 運動動畫（Three.js）

```javascript
import * as THREE from 'three';

function createMotionAnimation(motionData) {
    // 創建場景
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 創建物體（小球）
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshPhongMaterial({ color: 0x4a90e2 });
    const ball = new THREE.Mesh(geometry, material);
    scene.add(ball);

    // 創建軌跡線
    const trajectory = new THREE.BufferGeometry();
    const trajectoryMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 2 });
    const trajectoryLine = new THREE.Line(trajectory, trajectoryMaterial);
    scene.add(trajectoryLine);

    // 光源
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    camera.position.z = 10;

    // 動畫循環
    let t = 0;
    const points = [];

    function animate() {
        requestAnimationFrame(animate);

        // 根據運動方程更新位置
        const { v0, angle, g } = motionData;
        const v0x = v0 * Math.cos(angle);
        const v0y = v0 * Math.sin(angle);

        // 拋物線運動
        ball.position.x = v0x * t;
        ball.position.y = v0y * t - 0.5 * g * t * t;

        // 記錄軌跡
        points.push(new THREE.Vector3(ball.position.x, ball.position.y, 0));
        trajectory.setFromPoints(points);

        // 如果著地，重置
        if (ball.position.y < 0) {
            t = 0;
            points.length = 0;
        }

        t += 0.016;  // 60fps

        renderer.render(scene, camera);
    }

    animate();
}
```

---

## 📱 模組六：移動端App開發

### 6.1 React Native項目結構

```
exam-helper-app/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── CameraScreen.tsx
│   │   ├── GradingResultScreen.tsx
│   │   ├── WrongQuestionScreen.tsx
│   │   └── PracticeScreen.tsx
│   ├── components/
│   │   ├── QuestionCard.tsx
│   │   ├── ForceAnalysisDiagram.tsx
│   │   └── ProgressChart.tsx
│   ├── services/
│   │   ├── api.ts
│   │   ├── ocr.ts
│   │   └── storage.ts
│   ├── store/
│   │   └── redux/
│   └── utils/
├── android/
├── ios/
└── package.json
```

### 6.2 拍照功能實現

```typescript
// CameraScreen.tsx
import { Camera, CameraType } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';

export function CameraScreen() {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [type, setType] = useState(CameraType.back);
    const cameraRef = useRef<Camera>(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const takePicture = async () => {
        if (!cameraRef.current) return;

        // 拍照
        const photo = await cameraRef.current.takePictureAsync({
            quality: 0.9,
            base64: true,
            skipProcessing: false
        });

        // 圖像處理
        const manipResult = await ImageManipulator.manipulateAsync(
            photo.uri,
            [
                { resize: { width: 2000 } },  // 調整尺寸
                { rotate: 0 }  // 可自動檢測旋轉
            ],
            { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
        );

        // 上傳OCR
        uploadToOCR(manipResult.uri);
    };

    return (
        <View style={styles.container}>
            <Camera style={styles.camera} type={type} ref={cameraRef}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={takePicture}>
                        <Text style={styles.text}>拍照批改</Text>
                    </TouchableOpacity>
                </View>
            </Camera>
        </View>
    );
}
```

### 6.3 離線功能（本地數據庫）

```typescript
// 使用Realm或AsyncStorage
import Realm from 'realm';

const QuestionSchema = {
    name: 'Question',
    primaryKey: '_id',
    properties: {
        _id: 'string',
        question_text: 'string',
        answer: 'string',
        knowledge_point: 'string',
        completed: { type: 'bool', default: false },
        created_at: 'date'
    }
};

const realm = await Realm.open({ schema: [QuestionSchema] });

// 保存離線題目
function saveOfflineQuestion(question) {
    realm.write(() => {
        realm.create('Question', question);
    });
}

// 同步到雲端
async function syncToCloud() {
    const offlineQuestions = realm.objects('Question').filtered('synced = false');

    for (const q of offlineQuestions) {
        await api.uploadQuestion(q);
        realm.write(() => {
            q.synced = true;
        });
    }
}
```

---

## 🚀 部署方案

### 前端部署（Cloudflare Pages）
```yaml
# wrangler.toml
name = "exam-helper"
type = "webpack"
account_id = "your-account-id"
workers_dev = true
route = ""
zone_id = ""

[site]
bucket = "./build"
entry-point = "workers-site"

[build]
command = "npm run build"
```

### 後端部署（Vercel / Railway）
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    { "src": "/api/ocr", "dest": "/server.js" },
    { "src": "/api/grade", "dest": "/server.js" },
    { "src": "/api/questions", "dest": "/server.js" }
  ],
  "env": {
    "OPENAI_API_KEY": "@openai-key",
    "MONGODB_URI": "@mongodb-uri"
  }
}
```

---

**文檔版本**：v1.0
**最後更新**：2024年
**項目GitHub**：https://github.com/yhliang1648-cmyk/auto-knowledge-point
