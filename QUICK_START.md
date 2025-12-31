# 🚀 快速开始指南

欢迎使用智能刷题助手！本指南将帮助您在5分钟内开始使用。

---

## 📋 目录

1. [立即测试](#1-立即测试-0分钟)
2. [部署Cloudflare后端](#2-部署cloudflare后端-10分钟)
3. [使用完整功能](#3-使用完整功能)
4. [常见问题](#4-常见问题)

---

## 1. 立即测试（0分钟）

### 选项A：在线测试演示 ⭐推荐

**无需部署，直接使用！**

1. 打开浏览器访问：
   ```
   test-exam-helper.html
   ```

2. 选择测试题目：
   - 题目35：摩擦力实验
   - 题目33：抛体运动

3. 点击按钮测试功能：
   - 🔍 模拟OCR识别
   - 🤖 模拟AI判题
   - 💡 生成类似练习题

**演示内容**：
- ✅ 完整的UI界面
- ✅ 模拟的API响应
- ✅ 真实的判题结果
- ✅ 智能生成的练习题

### 选项B：使用完整应用

1. 打开：
   ```
   exam-helper-app.html
   ```

2. 上传您自己的试卷图片/PDF

3. 体验真实的AI批改功能

**注意**：此选项需要网络访问通义千问API

---

## 2. 部署Cloudflare后端（10分钟）

### 前置要求

- ✅ 已安装Node.js（v18+）
- ✅ 有Cloudflare账号（免费版即可）
- ✅ 有通义千问API密钥（已提供）

### 一键部署

```bash
cd cloudflare-rag
chmod +x deploy.sh
./deploy.sh
```

脚本会自动完成所有步骤！

### 部署包含什么？

- ✅ D1数据库（存储题目）
- ✅ R2存储（存储PDF）
- ✅ KV缓存（加速查询）
- ✅ Vectorize索引（向量搜索）
- ✅ Worker API（RAG后端）

### 部署后测试

```bash
# 测试健康检查
curl https://your-worker.workers.dev/api/health

# 测试搜索功能
curl -X POST https://your-worker.workers.dev/api/search \
  -H "Content-Type: application/json" \
  -d '{"query":"二次函数","subject":"all","year":"all"}'
```

---

## 3. 使用完整功能

### 功能1：拍照批改

```
1. 打开 exam-helper-app.html
2. 点击"上传题目"
3. 点击"上传答卷"
4. 点击"开始AI判题"
5. 查看评分结果和薄弱知识点
```

### 功能2：错题强化

```
1. 完成判题后
2. 点击"根据薄弱点生成练习题"
3. 完成练习题
4. 点击"查看答案与解析"
```

### 功能3：可视化讲解

```
1. 切换到"可视化讲解"标签
2. 选择类型（受力分析/运动动画/函数图像）
3. 输入题目内容
4. 点击"生成可视化图表"
5. 查看Canvas动画演示
```

---

## 4. 常见问题

### Q1: 如何获取通义千问API密钥？

**A**: 已为您准备好！
- API密钥：`sk-e79b72b1a216405c89206aefe865139e`
- 已配置在所有文件中，无需修改

### Q2: Cloudflare部署失败怎么办？

**A**: 检查以下几点：
1. Node.js版本是否>=18
2. Wrangler是否安装成功：`wrangler --version`
3. 是否成功登录Cloudflare：`wrangler whoami`
4. 查看详细错误日志：`wrangler tail`

### Q3: OCR识别不准确怎么办？

**A**: 改进方法：
1. 确保图片清晰、光线充足
2. 避免图片倾斜
3. 使用高分辨率图片（推荐2000px以上）
4. 手写体尽量清晰工整

### Q4: 成本是多少？

**A**: 非常便宜！
- **Cloudflare**: 免费版完全够用
- **通义千问API**: 约¥15-20/月（1000次查询）
- **总计**: 约¥0.02/次查询

### Q5: 如何添加更多题目到数据库？

**A**:
```bash
# 准备题目JSON文件
# 然后运行导入脚本
cd cloudflare-rag
export CLOUDFLARE_ACCOUNT_ID="your-id"
export CLOUDFLARE_API_TOKEN="your-token"
export DATABASE_ID="your-db-id"
npm run import:questions -- --file=../data/your-questions.json
```

### Q6: 支持哪些科目？

**A**: 目前支持：
- ✅ 物理
- ✅ 数学
- ✅ 化学
- ✅ 生物
- 🔄 更多科目开发中...

### Q7: 可以批量批改吗？

**A**: 可以！
```javascript
// 使用ExamHelperAPI类
const api = new ExamHelperAPI('sk-e79b72b1a216405c89206aefe865139e');

// 批量处理
const results = await Promise.all(
  questionImages.map((qImg, i) =>
    api.gradeAnswer(qImg, answerImages[i])
  )
);
```

### Q8: 如何提升判题准确度？

**A**: 优化方法：
1. 提供详细的评分标准
2. 使用高质量的题目图片
3. 在prompt中增加具体要求
4. 调整temperature参数（降低到0.2-0.3）

---

## 5. 进阶使用

### 集成到您的网站

```html
<!-- 引入API类 -->
<script src="exam-helper-api.js"></script>

<script>
// 初始化
const api = new ExamHelperAPI('sk-e79b72b1a216405c89206aefe865139e');

// OCR识别
const ocrResult = await api.performOCR(imageBase64, 'exam');
console.log('识别文字:', ocrResult.text);

// AI判题
const grading = await api.gradeAnswer(questionImg, answerImg);
console.log('得分:', grading.totalScore);

// 生成练习题
const questions = await api.generateSimilarQuestions(
  [{point: '二次函数', severity: 'high'}],
  '数学'
);
console.log('练习题:', questions);
</script>
```

### 自定义判题标准

```javascript
const grading = await api.gradeAnswer(
  questionImage,
  answerImage,
  {
    subject: '物理',
    totalMarks: 15,
    markingScheme: {
      '步骤1': 3,
      '步骤2': 5,
      '步骤3': 4,
      '答案': 3
    },
    strictness: 'medium'  // low, medium, high
  }
);
```

### 使用Cloudflare RAG API

```javascript
// 搜索相关题目
const response = await fetch('https://your-worker.workers.dev/api/search', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    query: '牛顿第二定律',
    subject: 'physics',
    year: '2024',
    limit: 10
  })
});

const results = await response.json();
console.log('AI答案:', results.aiAnswer);
console.log('相关题目:', results.questions);
```

---

## 6. 获取帮助

### 文档

- 📖 [完整集成指南](QWEN_INTEGRATION_GUIDE.md)
- 🚀 [部署指南](cloudflare-rag/README.md)
- 📊 [测试报告](TEST_REPORT.md)
- 📝 [实施总结](IMPLEMENTATION_SUMMARY.md)

### 在线资源

- **通义千问文档**: https://help.aliyun.com/zh/model-studio/qwen-api-reference
- **Cloudflare文档**: https://developers.cloudflare.com/workers/
- **GitHub仓库**: https://github.com/yhliang1648-cmyk/auto-knowledge-point

### 技术支持

- **GitHub Issues**: https://github.com/yhliang1648-cmyk/auto-knowledge-point/issues
- **Email**: [您的邮箱]

---

## 7. 示例代码

### 示例1：完整的批改流程

```javascript
// 1. 初始化API
const api = new ExamHelperAPI('sk-e79b72b1a216405c89206aefe865139e');

// 2. OCR识别题目
const questionOCR = await api.performOCR(questionImageBase64, 'question');
console.log('题目:', questionOCR.text);

// 3. OCR识别答案
const answerOCR = await api.performOCR(answerImageBase64, 'answer');
console.log('答案:', answerOCR.text);

// 4. AI判题
const grading = await api.gradeAnswer(
  questionImageBase64,
  answerImageBase64,
  {subject: '物理', totalMarks: 10}
);

// 5. 显示结果
console.log('总分:', grading.totalScore, '/', grading.maxScore);
console.log('薄弱知识点:', grading.weakKnowledgePoints);

// 6. 生成练习题
const practiceQuestions = await api.generateSimilarQuestions(
  grading.weakKnowledgePoints,
  '物理'
);

console.log('生成了', practiceQuestions.length, '道练习题');
```

### 示例2：批量批改多道题

```javascript
async function batchGrade(questionsAndAnswers) {
  const api = new ExamHelperAPI('sk-e79b72b1a216405c89206aefe865139e');

  const results = [];

  for (const {question, answer} of questionsAndAnswers) {
    console.log('正在批改第', results.length + 1, '题...');

    const grading = await api.gradeAnswer(question, answer);
    results.push(grading);

    // 避免API限流
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // 生成总报告
  const totalScore = results.reduce((sum, r) => sum + r.totalScore, 0);
  const maxScore = results.reduce((sum, r) => sum + r.maxScore, 0);

  console.log('总分:', totalScore, '/', maxScore);
  console.log('得分率:', (totalScore / maxScore * 100).toFixed(1), '%');

  return results;
}

// 使用
const results = await batchGrade([
  {question: img1, answer: ans1},
  {question: img2, answer: ans2},
  {question: img3, answer: ans3}
]);
```

### 示例3：生成受力分析图

```javascript
// 1. 生成可视化数据
const visData = await api.generateVisualization(
  {
    content: '一个质量为2kg的物体静止在倾角为30°的斜面上，求各个力的大小'
  },
  'force'
);

// 2. 在Canvas上绘制
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// 绘制斜面
ctx.strokeStyle = '#34495e';
ctx.lineWidth = 3;
ctx.beginPath();
ctx.moveTo(100, 500);
ctx.lineTo(700, 500 - 600 * Math.tan(30 * Math.PI / 180));
ctx.stroke();

// 绘制物体
visData.objects.forEach(obj => {
  ctx.fillStyle = '#3498db';
  ctx.fillRect(obj.position.x - 30, obj.position.y - 30, 60, 60);
});

// 绘制力的箭头
visData.forces.forEach(force => {
  drawArrow(
    ctx,
    obj.position.x,
    obj.position.y,
    force.magnitude,
    force.direction,
    force.name
  );
});
```

---

## 8. 最佳实践

### ✅ DO（推荐做法）

1. **使用高质量图片**
   - 分辨率 >= 1500px
   - 光线充足
   - 避免倾斜和模糊

2. **提供详细的评分标准**
   - 明确各步骤分值
   - 给出评分细则
   - 指定重点考查内容

3. **合理使用缓存**
   - 相同题目避免重复识别
   - 使用localStorage存储结果
   - 批量操作减少API调用

4. **错误处理**
   - 添加try-catch捕获异常
   - 提供友好的错误提示
   - 记录错误日志便于调试

### ❌ DON'T（避免做法）

1. **不要频繁调用API**
   - 避免短时间内大量请求
   - 使用节流/防抖
   - 合理设置请求间隔

2. **不要忽略数据安全**
   - 不要将API密钥暴露在前端
   - 使用环境变量管理密钥
   - 定期轮换API密钥

3. **不要直接使用低质量图片**
   - 避免使用过小的图片
   - 不要使用严重倾斜的图片
   - 避免使用模糊不清的图片

---

## 9. 下一步

### 立即开始

```bash
# 1. 克隆项目
git clone https://github.com/yhliang1648-cmyk/auto-knowledge-point.git
cd auto-knowledge-point

# 2. 测试演示
open test-exam-helper.html

# 3. 部署后端（可选）
cd cloudflare-rag
./deploy.sh
```

### 学习更多

- 📖 阅读[完整文档](QWEN_INTEGRATION_GUIDE.md)
- 🎯 查看[测试报告](TEST_REPORT.md)了解性能
- 💡 研究[API源码](exam-helper-api.js)了解实现

### 反馈与贡献

- 🐛 [报告Bug](https://github.com/yhliang1648-cmyk/auto-knowledge-point/issues)
- 💡 [提出建议](https://github.com/yhliang1648-cmyk/auto-knowledge-point/issues)
- 🤝 [贡献代码](https://github.com/yhliang1648-cmyk/auto-knowledge-point/pulls)

---

**祝您使用愉快！🎉**

如有任何问题，请查看[常见问题](#4-常见问题)或[获取帮助](#6-获取帮助)。
