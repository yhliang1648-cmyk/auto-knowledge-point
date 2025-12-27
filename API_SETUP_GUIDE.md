# 🔧 Google Gemini API 设置指南

你遇到了 **403 错误**，这是因为需要先在 Google Cloud Console 中启用 API。

---

## ⚠️ 问题原因

**错误**: `Gemini API 错误: 403`

**原因**: API Key 还没有启用 Generative Language API

---

## ✅ 解决方案（5 分钟）

### 步骤 1: 访问 Google AI Studio

**打开这个链接**:
```
https://aistudio.google.com/app/apikey
```

### 步骤 2: 检查 API Key

1. 确认你的 API Key：`AIzaSyCwagWVu6Lu6IhshnRF83x8-6XD3duwJ_8`
2. 如果看到这个 Key，点击它旁边的 **⋮** (三个点)
3. 选择 **View in Google Cloud Console**

### 步骤 3: 启用 API

在 Google Cloud Console 中：

1. **启用 Generative Language API**:
   - 访问：https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
   - 点击 **ENABLE（启用）** 按钮

2. **等待几秒钟**，让 API 激活

### 步骤 4: 测试 API

测试 API 是否工作：

**在浏览器控制台（F12）运行**:
```javascript
fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCwagWVu6Lu6IhshnRF83x8-6XD3duwJ_8', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ parts: [{ text: '你好' }] }]
  })
})
.then(r => r.json())
.then(d => console.log('✅ API 工作正常!', d))
.catch(e => console.error('❌ API 仍有问题:', e));
```

如果看到 `✅ API 工作正常!`，说明修复成功！

---

## 🔄 备选方案：重新创建 API Key

如果上述方法不行，创建一个新的 API Key：

### 方法 1: 使用 Google AI Studio（推荐）

1. **访问**: https://aistudio.google.com/app/apikey
2. 点击 **Create API Key**
3. 选择你的 Google Cloud 项目（或创建新项目）
4. 复制新的 API Key
5. 告诉我新的 Key，我会更新代码

### 方法 2: 使用 Google Cloud Console

1. **访问**: https://console.cloud.google.com/apis/credentials
2. 点击 **+ CREATE CREDENTIALS**
3. 选择 **API Key**
4. 复制 API Key
5. 点击 **RESTRICT KEY**，设置限制：
   - **Application restrictions**: HTTP referrers
   - 添加：`https://dse-rag-system.pages.dev/*`
   - **API restrictions**: Generative Language API
6. 保存

---

## 🧪 快速测试链接

测试你的 API Key 是否已启用：

**复制这个 URL 到浏览器**:
```
https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyCwagWVu6Lu6IhshnRF83x8-6XD3duwJ_8
```

**期望结果**:
- ✅ 显示可用模型列表 = API 已启用
- ❌ 显示 403 错误 = 需要启用 API

---

## 📋 常见问题

### Q1: 我没有 Google Cloud 项目怎么办？
**A**: Google AI Studio 会自动为你创建一个免费项目！
- 访问：https://aistudio.google.com/
- 登录 Google 账号
- 系统会自动设置

### Q2: 需要绑定信用卡吗？
**A**: 不需要！Gemini API 有慷慨的免费额度：
- 每天 1,500 次请求
- 足够个人使用

### Q3: API Key 会过期吗？
**A**: 不会自动过期，除非你手动删除

### Q4: 怎么查看 API 使用量？
**A**: 访问 Google Cloud Console:
- https://console.cloud.google.com/apis/dashboard

---

## 🔒 安全建议

创建 API Key 后，建议设置限制：

### HTTP 引用者限制
```
https://dse-rag-system.pages.dev/*
https://localhost:*
```

### API 限制
只允许：
- Generative Language API

---

## 💡 下一步

完成上述设置后：

1. **刷新网站**: https://dse-rag-system.pages.dev
2. **尝试搜索**: 输入"氣候變化"
3. **查看控制台**（F12）：应该看到成功日志

如果还有问题，**告诉我新的错误信息**！

---

**需要帮助？把截图或错误信息发给我！**
