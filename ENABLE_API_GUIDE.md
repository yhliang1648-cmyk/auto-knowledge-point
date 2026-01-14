# 🔧 启用 Google Gemini API 完整指南

## ⚠️ 当前问题

您的 API Key 已创建，但返回 **403 Forbidden** 错误。这是因为 **Generative Language API 还未启用**。

---

## ✅ 解决方案（3 个简单步骤）

### 第 1 步：访问 Google Cloud Console API 库

**点击此链接直接访问：**
```
https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
```

或者手动访问：
1. 打开 https://console.cloud.google.com/
2. 在搜索框输入 "Generative Language API"
3. 点击搜索结果中的 "Generative Language API"

---

### 第 2 步：选择正确的项目

⚠️ **重要**：确保您在页面顶部选择了**创建 API Key 时使用的项目**

- 点击页面顶部的项目选择器（蓝色区域）
- 找到您创建 API Key 的项目
- 点击选择该项目

---

### 第 3 步：启用 API

在 "Generative Language API" 页面：

1. 点击蓝色的 **"ENABLE"（启用）** 按钮
2. 等待几秒钟，页面会显示 "API enabled"（API 已启用）
3. ✅ 完成！

---

## 🧪 验证 API 是否启用成功

### 方法 1：使用网站自带检测功能

1. 我已经更新了您网站的 API Key
2. 访问 https://dse-rag-system.pages.dev（部署后）
3. 查看页面顶部的 **API 状态指示器**
4. 如果显示 🟢 绿色 "API 运行正常"，说明成功！

### 方法 2：使用命令行测试

在浏览器控制台（F12）或终端运行：

```javascript
fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCANPE_nTsqmnuVGfrVo44JBvtY-TuXRYg', {
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

如果返回包含 "candidates" 的 JSON 数据，说明 API 已成功启用！

---

## 🔍 常见问题

### Q1: 找不到 "ENABLE" 按钮？

可能已经启用了。检查按钮是否显示为 "MANAGE"（管理）或 "DISABLE"（禁用）。

### Q2: 启用后仍然 403 错误？

1. 等待 1-2 分钟让更改生效
2. 确认选择的项目与创建 API Key 的项目一致
3. 刷新浏览器缓存并重试

### Q3: 显示需要启用计费？

- 免费版不需要信用卡
- 如果提示需要计费，可能是项目设置问题
- 尝试创建新项目并重新生成 API Key

### Q4: 不同的 API 项目？

如果您有多个 Google Cloud 项目：
1. 访问 https://aistudio.google.com/app/apikey
2. 查看 API Key 属于哪个项目
3. 在 Cloud Console 切换到该项目
4. 在该项目中启用 API

---

## 📞 需要帮助？

如果按照以上步骤仍无法解决：

1. **检查 API Key 的项目**：
   - 访问 https://aistudio.google.com/app/apikey
   - 查看 API Key 旁边显示的项目名称

2. **查看 API 配额**：
   - 访问 https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas
   - 确认是否选择了正确的项目
   - 查看配额是否已用尽

3. **重新创建 API Key**：
   - 如果问题持续，尝试删除旧 Key 并创建新的
   - 确保在创建时项目中已启用 Generative Language API

---

## ✨ 成功后的下一步

API 启用成功后：

1. ✅ 网站的智能搜索功能将正常工作
2. ✅ AI 回答功能将生成专业的解答
3. ✅ 语义搜索将能准确匹配相关考题

祝您使用愉快！🎉
