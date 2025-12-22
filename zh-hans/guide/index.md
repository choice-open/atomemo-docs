---
title: 用户指南
description: 学习如何使用 {{PRODUCT_NAME}} 构建 AI 智能体和自动化工作流
---

# 用户指南

欢迎来到 {{PRODUCT_NAME}} 用户指南！本指南将帮助你快速掌握平台的核心功能，从创建第一个 AI Agent 到构建复杂的自动化工作流。

## 快速导航

### 基础入门
- [创建应用](/zh-hans/guide/creating-apps) - 了解如何创建和配置工作流应用
- [使用节点](/zh-hans/guide/working-with-nodes) - 掌握各类节点的使用方法

### 工作流构建
- [使用节点](/zh-hans/guide/working-with-nodes) - 掌握节点的添加、连接和配置
- [编辑节点](/zh-hans/guide/editing-nodes) - 学习节点编辑器的使用方法
- [表达式](/zh-hans/guide/expressions) - 学习数据处理和转换语法
- [版本控制](/zh-hans/guide/workflow/version-control) - 管理工作流的版本历史

#### 触发器节点
工作流的入口，定义何时启动执行：
- [Chat 触发器](/zh-hans/guide/workflow/nodes/trigger-nodes/chat) - 通过用户对话触发工作流
- [Manual 触发器](/zh-hans/guide/workflow/nodes/trigger-nodes/manual) - 手动触发工作流执行
- [Webhook 触发器](/zh-hans/guide/workflow/nodes/trigger-nodes/webhook) - 通过 HTTP 请求触发工作流

#### Action 节点
执行具体的操作任务：
- [AI Agent](/zh-hans/guide/workflow/nodes/action-nodes/ai-agent) - 构建智能 AI 代理，自主调用工具完成任务
- [AI 分类器](/zh-hans/guide/workflow/nodes/action-nodes/ai-classifier) - 使用 AI 对文本进行智能分类
- [回答](/zh-hans/guide/workflow/nodes/action-nodes/answer) - 向用户返回响应消息
- [代码](/zh-hans/guide/workflow/nodes/action-nodes/code) - 执行 Python 或 JavaScript 自定义代码
- [实体识别](/zh-hans/guide/workflow/nodes/action-nodes/entity-recognition) - 从文本中提取结构化信息
- [HTTP 请求](/zh-hans/guide/workflow/nodes/action-nodes/http-request) - 调用外部 API 接口
- [条件分支](/zh-hans/guide/workflow/nodes/action-nodes/if) - 根据条件执行不同分支
- [知识检索](/zh-hans/guide/workflow/nodes/action-nodes/knowledge-retrieval) - 从知识库中检索相关信息
- [LLM](/zh-hans/guide/workflow/nodes/action-nodes/llm) - 调用大语言模型生成文本
- [情感分析](/zh-hans/guide/workflow/nodes/action-nodes/sentiment-analysis) - 分析文本的情感倾向

#### Tool 节点
为 AI Agent 提供可调用的工具能力：
- [代码工具](/zh-hans/guide/workflow/nodes/tool-nodes/code) - 为 AI Agent 提供代码执行能力
- [实体识别工具](/zh-hans/guide/workflow/nodes/tool-nodes/entity-recognition) - 为 AI Agent 提供信息提取能力
- [HTTP 请求工具](/zh-hans/guide/workflow/nodes/tool-nodes/http-request) - 为 AI Agent 提供 API 调用能力

### AI Agent 开发
- [AI Agent 节点](/zh-hans/guide/workflow/nodes/action-nodes/ai-agent) - 构建智能对话和任务处理
- [工具节点](/zh-hans/guide/workflow/nodes/tool-nodes/code) - 为 Agent 添加自定义能力

### 团队协作
- **权限管理（开发中）** - 配置团队成员的访问权限

## 核心概念

### 工作流（Workflow）
工作流是由多个节点组成的自动化流程。每个工作流包含：
- **触发器**：定义工作流何时启动
- **节点**：执行具体的操作
- **连接**：定义数据流动方向

### 节点（Node）
节点是工作流的基本构建单元，分为：
- **Trigger（触发器）**：启动工作流
- **Action（操作）**：执行具体任务
- **Transform（转换）**：处理数据
- **Control（控制）**：流程控制

### 表达式（Expression）
表达式用于动态访问和处理数据：
```javascript
// 访问特定节点的输出（必须指定节点名称）
$('Chat Trigger').message
$('HTTP Request').body.userId

// 访问对象属性
$('Entity Recognition').productName
$('LLM').output

// 在表达式中使用
`用户 ${$('Chat Trigger').userId} 的订单状态: ${$('HTTP Request').body.status}`
```

## 最佳实践

### 1. 合理组织节点
- 使用清晰的节点命名
- 添加注释说明复杂逻辑
- 将相关节点分组

### 2. 错误处理
- 添加错误捕获节点
- 配置重试策略
- 记录错误日志

### 3. 性能优化
- 避免不必要的节点执行
- 使用条件分支减少计算
- 合理设置超时时间

### 4. 安全性
- 使用凭证管理敏感信息
- 验证外部输入数据
- 限制 API 调用频率

## 下一步

### 开始使用
- [创建你的第一个应用](/zh-hans/guide/creating-apps)
- [探索节点类型](/zh-hans/guide/working-with-nodes)
- [学习表达式语法](/zh-hans/guide/expressions)

### 构建你的第一个工作流
- [Chat 触发器](/zh-hans/guide/workflow/nodes/trigger-nodes/chat) - 创建对话式工作流
- [AI Agent](/zh-hans/guide/workflow/nodes/action-nodes/ai-agent) - 构建智能助手
- [LLM 节点](/zh-hans/guide/workflow/nodes/action-nodes/llm) - 生成 AI 回复

### 探索更多节点
- [所有 Action 节点](/zh-hans/guide/workflow/nodes/action-nodes/ai-agent)
- [所有 Tool 节点](/zh-hans/guide/workflow/nodes/tool-nodes/code)
- [所有 Trigger 节点](/zh-hans/guide/workflow/nodes/trigger-nodes/chat)

## 需要帮助？

- 加入我们的社区讨论
- [报告问题]({{GITHUB_REPO_URL}}/issues)
