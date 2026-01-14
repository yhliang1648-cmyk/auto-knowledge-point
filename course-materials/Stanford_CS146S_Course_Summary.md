# 斯坦福 CS146S：现代软件开发者 - 课程总结

## 📚 课程概览

**课程名称**: CS146S: The Modern Software Developer
**开设时间**: 斯坦福大学 2025 年秋季
**授课教师**: Mihail Eric
**课程官网**: https://themodernsoftware.dev
**GitHub 仓库**: https://github.com/mihail911/modern-software-dev-assignments

## 🎯 课程目标

教授学生如何使用最新的 AI 驱动工具进行软件开发，包括新一代 IDE（如 Cursor）、终端（如 Warp）、代码审查和测试平台（如 Coderabbit、Qodo）等，重点关注何时以及为何信任 AI 驱动的工作流程。

## 📖 课程结构（8周）

### **Week 1: Prompting Techniques（提示词技巧）**
**学习目标**: 掌握与大型语言模型交互的核心技术

**主要技术**:
- **K-shot Prompting（K次示例提示）**: 通过提供示例来引导模型行为
- **Chain-of-Thought（思维链）**: 引导模型逐步推理
- **Tool Calling（工具调用）**: 让模型调用外部工具和API
- **Self-Consistency Prompting（自我一致性提示）**: 多次采样以提高准确性
- **RAG（检索增强生成）**: 结合外部知识库进行回答
- **Reflexion（反思）**: 让模型自我评估和改进

**技术栈**:
- Ollama（本地运行LLM）
- Mistral-Nemo 12B、Llama 3.1 8B

**作业要点**:
- 为每种提示技术设计和优化提示词
- 通过测试脚本验证结果
- 了解不同提示技术的适用场景

---

### **Week 2: Action Item Extractor（行动项提取器）**
**学习目标**: 使用 AI 辅助工具（Cursor）构建实际应用

**项目描述**:
构建一个 FastAPI + SQLite 应用，将自由格式的笔记转换为结构化的行动项

**核心任务**:
1. **实现 LLM 驱动的提取功能**: 使用 Ollama 替代基于规则的提取
2. **编写单元测试**: 覆盖多种输入场景
3. **重构代码**: 改善 API 接口、数据库层、错误处理
4. **使用 Agent 模式**: 自动化小任务（添加端点、前端按钮）
5. **生成 README**: 让 AI 自动生成项目文档

**技术栈**:
- FastAPI（后端框架）
- SQLite（数据库）
- Cursor（AI 驱动的 IDE）
- Ollama（本地 LLM）

**关键学习点**:
- 如何使用 AI 工具进行功能开发
- 结构化输出（JSON）的生成
- AI 辅助的代码重构

---

### **Week 3: Build a Custom MCP Server（构建自定义 MCP 服务器）**
**学习目标**: 理解 Model Context Protocol（模型上下文协议）并实现服务器

**项目要求**:
- 设计并实现一个 MCP 服务器，封装真实的外部 API
- 可选择本地（STDIO）或远程（HTTP）部署
- 至少实现两个 MCP 工具
- 加分项：实现身份验证（API keys 或 OAuth2）

**API 选择示例**:
- 天气 API、GitHub Issues、Notion、电影数据库
- 日历、任务管理器、金融/加密货币
- 旅行、体育统计等

**技术要求**:
- 类型化参数和错误处理
- 遵循日志和传输最佳实践
- 速率限制处理
- 清晰的设置文档和示例调用流程

**评分标准**:
- 功能性（35分）：2+工具、正确的API集成
- 可靠性（20分）：输入验证、错误处理、日志
- 开发者体验（20分）：清晰的文档、易于运行
- 代码质量（15分）：可读性、类型提示
- 加分项（10分）：远程 HTTP 服务器 +5、身份验证 +5

---

### **Week 4: The Autonomous Coding Agent IRL（自主编码代理）**
**学习目标**: 使用 Claude Code 构建至少 2 个自动化工作流

**Claude Code 功能**:
1. **自定义斜杠命令**: 在 `.claude/commands/*.md` 中定义可重用工作流
2. **CLAUDE.md 文件**: 提供仓库特定的指导和上下文
3. **SubAgents（子代理）**: 角色专门化的代理协作
4. **MCP 服务器集成**: 集成外部工具和服务

**自动化示例**:
- **测试运行器**: 运行 pytest 并生成覆盖率报告
- **文档同步**: 从 OpenAPI 规范更新 API 文档
- **重构工具**: 重命名模块并更新所有导入
- **多代理协作**: TestAgent + CodeAgent 协作开发

**项目应用**:
使用构建的自动化工具扩展 FastAPI 应用（"开发者指挥中心"）

**交付成果**:
- 2+ 自动化工具
- 详细的设计文档（目标、输入/输出、步骤）
- 使用前后对比（手动 vs 自动化）

---

### **Week 5: Agentic Development with Warp（Warp 代理式开发）**
**学习目标**: 使用 Warp 终端的代理开发环境

**Warp 特性**:
- **Warp Drive**: 保存的提示词、规则、MCP 服务器
- **多代理工作流**: 在不同标签页中并发运行多个代理

**核心任务**:
1. **Warp Drive 自动化**（至少1个）:
   - 测试运行器（带覆盖率和重试）
   - 文档同步
   - 重构工具
   - 发布助手
   - Git MCP 服务器集成

2. **多代理并发**（至少1个）:
   - 在多个 Warp 标签页中同时运行独立任务
   - 使用 `git worktree` 避免冲突

**技术提示**:
- 保持工作流聚焦
- 使用参数传递
- 优先选择幂等性步骤
- 无头/非交互式操作

**自主权级别**:
- 记录使用的代码权限
- 监督策略
- 并发的风险和收益

---

### **Week 6: Scan and Fix Vulnerabilities with Semgrep（漏洞扫描与修复）**
**学习目标**: 使用静态分析工具 Semgrep 发现并修复安全问题

**Semgrep 简介**:
开源静态分析工具，用于查找代码中的错误、安全问题和强制执行编码标准

**扫描范围**:
- 后端 Python（FastAPI）
- 前端 JavaScript
- 依赖项（requirements.txt）
- 配置文件和环境变量（密钥扫描）

**任务要求**:
1. 运行 Semgrep CI 扫描: `semgrep ci --subdir week6`
2. 选择并修复 **3 个**安全问题
3. 使用 AI 编码工具辅助修复
4. 确保应用仍能运行且测试通过

**修复示例**:
- 参数化 SQL 查询（防止 SQL 注入）
- 使用更安全的 API
- 加强加密算法
- 清理 DOM 写入（防止 XSS）
- 限制 CORS 策略
- 升级依赖版本

**交付成果**:
- 发现概述：SAST/Secrets/SCA 分类
- 三个修复的详细说明：
  - 文件和行号
  - Semgrep 规则/类别
  - 风险描述
  - 代码差异和缓解原因

---

### **Week 7: Exploring AI Code Review Using Graphite（AI 代码审查）**
**学习目标**: 对比人工代码审查与 AI 辅助代码审查

**Graphite 简介**:
提供 AI 驱动的代码审查工具（Graphite Diamond）

**任务流程**:
1. 从 `docs/TASKS.md` 实现任务
2. 为每个任务创建独立分支
3. 使用 AI 工具（Cursor、Copilot、Claude）进行一次性提示实现
4. **人工审查**: 逐行检查并修复问题
5. **创建 PR**: 包含问题描述、测试结果、权衡说明
6. **使用 Graphite Diamond**: 生成 AI 辅助审查
7. **对比分析**: 人工审查 vs AI 审查

**审查类型**:
- 正确性
- 性能
- 安全性
- 命名规范
- 测试覆盖
- API 设计
- 用户体验
- 文档

**反思内容**:
- 人工审查的典型评论类型
- AI 审查与人工审查的对比
- AI 审查的优劣势（具体示例）
- 对 AI 审查的信任度和使用启发式

**评分标准**:
- 每个任务 20 分（共 4 个任务）
- 反思报告 20 分

---

### **Week 8: Multi-Stack AI-Accelerated Web App Build（多技术栈应用构建）**
**学习目标**: 使用 AI 应用生成平台快速构建多版本应用

**项目要求**:
使用 **3 个不同的技术栈**构建同一个功能性 Web 应用

**最低功能范围**:
- 创建、读取、更新、删除（CRUD）主要资源
- 持久化存储（数据库或文件）
- 基本验证和错误处理
- 简单但功能性的 UI
- 每个版本的运行说明

**技术栈示例**:
- MERN（MongoDB + Express + React + Node.js）
- MEVN（MongoDB + Express + Vue.js + Node.js）
- Django + React（或 Vue）
- Flask + Vanilla JS（或 React）
- Next.js + Node（或 NestJS）
- Ruby on Rails（全栈）

**强制要求**:
1. **至少一个版本使用 Bolt.new**: AI 应用生成平台
2. **至少一个版本使用非 JavaScript 语言**: Python/Django、Ruby/Rails

**Bolt.new 简介**:
AI 辅助开发平台，从自然语言提示生成完整的 Web 应用、网站和移动应用

**使用提示**:
- 从清晰的应用概念提示开始
- 明确描述数据模型和关系
- 迭代优化提示（数据模型、CRUD 端点、UI 组件）
- 保持每个版本独立，避免依赖冲突
- 导出代码并提交到独立项目文件夹

**交付成果**:
1. 三个项目文件夹（每个版本一个）
   - 源代码
   - README.md（先决条件、安装、运行、环境配置）
   - 偏差说明、已知问题、手动修复
2. 完成的 writeup.md
   - 应用概念
   - 3 个应用描述

**评分标准**（100 分）:
- 应用概念符合最低功能范围（10 分）
- 三个不同技术栈（10 分）
- 使用 Bolt（10 分）
- 使用非 JS 语言（10 分）
- 三个应用版本（各 20 分）

---

## 🛠️ 核心技术栈

### 开发工具
- **Cursor**: AI 驱动的 IDE
- **Warp**: AI 增强的终端
- **Claude Code**: 自主编码代理
- **Graphite**: AI 代码审查平台
- **Bolt.new**: AI 应用生成平台

### AI 模型和平台
- **Ollama**: 本地运行 LLM（Mistral-Nemo、Llama 3.1）
- **Claude**: Anthropic 的 AI 助手
- **GitHub Copilot**: AI 代码补全

### 安全和质量工具
- **Semgrep**: 静态代码分析和安全扫描

### 后端技术
- **FastAPI**: 现代 Python Web 框架
- **SQLite/SQLAlchemy**: 数据库和 ORM
- **Django**: Python 全栈框架
- **Ruby on Rails**: Ruby 全栈框架

### 前端技术
- **React**: UI 库
- **Vue.js**: 渐进式框架
- **Next.js**: React 全栈框架

### 开发流程
- **Poetry**: Python 依赖管理
- **Conda**: Python 环境管理
- **Pytest**: Python 测试框架
- **Pre-commit**: Git hooks（black + ruff）
- **Git**: 版本控制

---

## 🎓 关键学习成果

1. **AI 驱动的开发工作流**: 掌握使用 Cursor、Warp、Claude Code 等工具
2. **提示工程**: 理解并应用各种提示技术（CoT、RAG、Reflexion）
3. **AI 代理协作**: 设计和管理多代理工作流
4. **安全意识**: 使用 Semgrep 识别和修复漏洞
5. **代码审查**: 对比人工和 AI 审查的优劣
6. **快速原型开发**: 使用 AI 平台快速构建多版本应用
7. **MCP 协议**: 理解和实现模型上下文协议服务器

---

## 📊 课程特色

- **实践导向**: 每周都有动手项目
- **前沿工具**: 使用最新的 AI 开发工具
- **行业嘉宾**: Cognition（Russell Kaplan）、Warp（Zach Lloyd）、a16z（Martin Casado）
- **人机协作**: 强调"人类-代理工程"而非"vibe coding"
- **全栈覆盖**: 从提示词到部署的完整开发流程

---

## 🔗 相关资源

- **课程官网**: https://themodernsoftware.dev
- **GitHub 仓库**: https://github.com/mihail911/modern-software-dev-assignments
- **Cursor**: https://cursor.com
- **Warp**: https://warp.dev
- **Bolt.new**: https://bolt.new
- **Semgrep**: https://semgrep.dev
- **Graphite**: https://graphite.dev

---

## 📝 总结

CS146S 是斯坦福大学首个专注于 AI 软件开发的课程，旨在培养学生成为"AI 代理实习生的管理者"，而非简单的代码编写者。课程通过 8 周的递进式学习，从基础的提示技术到复杂的多代理系统，全面覆盖现代 AI 驱动的软件开发流程。

**核心理念**: 不仅要知道如何使用 AI 工具，更要理解何时以及为何信任它们。
