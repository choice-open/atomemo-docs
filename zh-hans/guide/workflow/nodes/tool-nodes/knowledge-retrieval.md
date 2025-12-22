---
title: 知识检索工具节点
description: 为 AI Agent 提供知识库检索能力，让 AI 能够从知识库中查找相关信息
---

# 知识检索工具节点

知识检索工具节点为 AI Agent 提供从知识库中检索相关信息的能力。与 Knowledge Retrieval Action 节点不同，Tool 版本由 AI 根据对话需求自主决定是否调用。

## 使用场景

### 典型应用
- **智能问答助手** - AI 根据用户问题自主检索知识库内容
- **文档查找** - AI 在需要时自动查找产品手册、技术文档
- **客服支持** - AI 根据问题类型自主检索相关解决方案
- **RAG 系统** - 为 AI Agent 提供上下文信息，增强回答质量
- **多知识库切换** - AI 根据问题领域选择不同的知识库检索
- **动态信息补充** - AI 在对话过程中按需检索补充信息

## Tool vs Action 的区别

| 特性 | Knowledge Retrieval Action | Knowledge Retrieval Tool |
|------|----------------------------|--------------------------|
| 执行方式 | 直接执行 | AI 按需调用 |
| 使用场景 | 固定的检索流程 | AI Agent 需要时检索 |
| 调用时机 | 每次都执行 | AI 决定何时调用 |
| 查询来源 | 预先配置 | AI 从对话中提取查询 |

**示例对比**:
```
Action 方式 (固定流程):
用户输入 → 知识检索 → 使用结果

Tool 方式 (智能交互):
用户: "你们的产品有什么特点?"
AI: (识别需要检索产品信息) → 调用知识检索工具 → 返回结果
用户: "价格是多少?"
AI: (识别需要检索价格信息) → 再次调用知识检索工具 → 返回结果
```

## 节点配置

### 基础设置(参数面板)

#### 工具名称 (toolName)

AI Agent 调用工具时使用的唯一标识符。

**字段属性**:
- 必填字段
- 在工作流中必须唯一
- 不支持表达式
- 格式要求:
  - 只能包含字母、数字、下划线和连字符
  - 必须以字母开头
  - 不能与工作流中其他工具节点的工具名称重复

**配置示例**:

```javascript
// 1. 简洁明确的工具名称
toolName: "searchKnowledgeBase"

// 2. 描述性的工具名称
toolName: "queryProductInfo"

// 3. 带前缀的工具名称
toolName: "kbCompanyFAQ"
```

**命名建议**:
- **使用小驼峰或下划线**: `searchKnowledgeBase` 或 `search_knowledge_base`
- **见名知意**: 名称要清楚表达工具的功能
- **避免过长**: 建议在 20 个字符以内
- **避免特殊字符**: 只使用字母、数字、下划线和连字符

**重要说明**:
- AI Agent 通过工具名称来识别和调用工具，而不是节点名称
- 工具名称在工作流中必须唯一，如果有重复会自动添加后缀
- 建议使用英文命名，以便与 AI 的调用保持一致

#### 工具描述 (toolDescription)

描述工具的功能和使用场景，AI 根据描述决定何时调用。

**字段属性**:
- 必填字段
- 支持表达式
- 支持多行文本

**配置示例**:

```javascript
// 1. 清晰描述工具功能
"从知识库中检索与查询相关的内容。输入参数: query(查询文本)。返回: results(检索结果数组), query(原始查询)。适用于回答需要参考知识库的问题。"

// 2. 说明使用场景
"查询产品相关信息。
输入参数:
- query: 查询文本(产品名称、功能、规格等)
返回:
- results: 匹配的知识片段数组
- query: 原始查询文本

当用户询问产品信息时调用 searchProductInfo 工具。"

// 3. 指定知识库范围
"从公司FAQ知识库中检索常见问题答案。
输入参数: query(用户问题)
返回: results(匹配的FAQ条目)
适用场景: 用户询问常见问题时调用 companyFAQSearch 工具。"
```

#### 查询文本 (query)

要检索的查询内容。AI 会从对话中提取并填充此字段。

**字段属性**:
- 必填字段
- 支持表达式
- 支持多行文本
- AI 会自动从对话中提取查询内容

**配置示例**:

```javascript
// 1. AI 从对话中提取
query: ""  // AI 会自动填充用户问题

// 2. 从上下文获取
query: $('Chat Trigger').message

// 3. 组合多个信息源
query: `产品: ${$('Entity Recognition').productName}
查询: ${$('Chat Trigger').message}`
```

#### 知识库 (knowledgeBaseId)

选择要检索的知识库。

**字段属性**:
- 必填字段
- 从已创建的知识库中选择
- 支持表达式（动态选择知识库）

**配置示例**:

```javascript
// 1. 静态选择
knowledgeBaseId: "kb_product_manual_2024"

// 2. 根据分类动态选择
knowledgeBaseId: $('AI Classifier').class === "technical"
  ? "kb_technical_docs"
  : "kb_general_faq"

// 3. 从配置中读取
knowledgeBaseId: $('Config').knowledgeBaseId
```

### 高级设置(设置面板)

#### 节点描述 (nodeDescription)

为节点添加自定义描述。

```yaml
nodeDescription: "产品信息检索工具"
```

## 输出数据

返回检索到的知识片段数组。

**输出结构**:

```javascript
{
  results: [
    {
      content: "知识片段内容",
      score: 0.85,           // 相关度评分 (0-1)
      metadata: {            // 元数据信息
        source: "文档来源",
        title: "文档标题",
        page: 12,
        url: "https://..."
      }
    },
    // ... 更多结果
  ],
  query: "原始查询文本"
}
```

**访问输出**:

```javascript
// 获取所有结果
$('Knowledge Retrieval Tool').results

// 获取第一个结果的内容
$('Knowledge Retrieval Tool').results[0].content

// 获取第一个结果的相关度
$('Knowledge Retrieval Tool').results[0].score

// 获取元数据
$('Knowledge Retrieval Tool').results[0].metadata.source
```

## 工作流示例

### 示例 1: 智能问答助手

```
Chat Trigger
  → AI Agent Node
    System Prompt: "你是智能客服助手，可以回答用户关于产品的各种问题。"
    
    Tools: [Knowledge Retrieval Tool]
      Tool Name: "searchProductInfo"
      Tool Description: "从产品知识库中检索产品相关信息。输入: query(查询文本)。返回: results(检索结果)。当用户询问产品信息时调用此工具。"
      Knowledge Base: "kb_product_manual"
      Query: ""  // AI 从对话中提取
  → Answer Node

对话示例:
用户: "你们的产品有什么特点?"
AI: (调用 searchProductInfo 工具, query="产品特点")
检索结果: [包含产品特点的知识片段]
AI: "根据我们的产品手册，我们的产品具有以下特点：..."

用户: "价格是多少?"
AI: (调用 searchProductInfo 工具, query="价格")
检索结果: [包含价格信息的知识片段]
AI: "产品价格根据配置不同，价格范围是..."
```

### 示例 2: 多知识库智能检索

```
Chat Trigger
  → AI Agent Node
    System Prompt: "你是智能助手，可以回答技术问题和常见问题。"
    
    Tools: [
      Tool 1 - Knowledge Retrieval Tool (技术文档)
        Tool Name: "searchTechnicalDocs"
        Tool Description: "从技术文档库检索技术问题答案。输入: query。返回: results。当用户询问技术问题时调用。"
        Knowledge Base: "kb_technical_docs"
      
      Tool 2 - Knowledge Retrieval Tool (FAQ)
        Tool Name: "searchFAQ"
        Tool Description: "从FAQ知识库检索常见问题答案。输入: query。返回: results。当用户询问常见问题时调用。"
        Knowledge Base: "kb_faq"
    ]
  → Answer Node

对话示例:
用户: "如何安装?"
AI: (识别为技术问题) → 调用 searchTechnicalDocs
检索结果: [安装步骤文档]
AI: "根据技术文档，安装步骤如下：..."

用户: "你们支持退款吗?"
AI: (识别为常见问题) → 调用 searchFAQ
检索结果: [退款政策FAQ]
AI: "根据我们的FAQ，退款政策是..."
```

### 示例 3: 对话式信息收集

```
Chat Trigger
  → AI Agent Node
    System Prompt: "你是产品顾问，帮助用户了解产品信息。"
    
    Tools: [Knowledge Retrieval Tool]
      Tool Name: "queryProductDetails"
      Tool Description: "检索产品详细信息。输入: query(产品名称或特性)。返回: results(产品信息)。"
      Knowledge Base: "kb_products"
  → Answer Node

对话示例:
用户: "我想了解一下笔记本电脑"
AI: (调用 queryProductDetails, query="笔记本电脑")
检索结果: [多款笔记本电脑信息]
AI: "我们有多款笔记本电脑产品，包括..."

用户: "有轻薄的吗?"
AI: (调用 queryProductDetails, query="轻薄笔记本电脑")
检索结果: [轻薄型号信息]
AI: "有的，我们有以下轻薄型号：..."
```

## 最佳实践

### 1. 编写清晰的工具描述

**好的工具描述**:
```
"从产品知识库中检索产品信息。
输入参数:
- query: 查询文本(产品名称、功能、规格等)
返回:
- results: 匹配的知识片段数组，每个片段包含内容、相关度评分和元数据
- query: 原始查询文本

使用场景:
- 用户询问产品功能
- 用户询问产品规格
- 用户询问产品价格
- 用户需要产品对比

示例: 当用户说'这个产品有什么功能'时调用 searchProductInfo 工具。"
```

### 2. 合理配置知识库

```javascript
// 1. 根据领域选择知识库
knowledgeBaseId: "kb_product_info"  // 产品相关

// 2. 动态选择知识库
knowledgeBaseId: $('AI Classifier').category === "technical"
  ? "kb_technical"
  : "kb_general"

// 3. 多个工具使用不同知识库
Tool 1: knowledgeBaseId: "kb_products"      // 产品库
Tool 2: knowledgeBaseId: "kb_support"       // 支持库
Tool 3: knowledgeBaseId: "kb_pricing"       // 价格库
```

### 3. 处理检索结果

```javascript
// AI 会自动处理检索结果，但可以在 System Prompt 中指导
System Prompt: `当你调用知识检索工具后:
1. 检查检索结果的相关度评分
2. 如果最高分 >= 0.7，使用该结果回答
3. 如果最高分 < 0.7，告诉用户信息可能不够准确
4. 如果结果为空，说明知识库中没有相关信息`
```

### 4. 优化查询提取

```javascript
// 在工具描述中帮助 AI 理解如何提取查询
toolDescription: `检索产品信息。
输入参数: query (从用户问题中提取的关键词，如产品名称、功能、规格等)
示例:
- 用户说"这个产品有什么功能" → query="产品功能"
- 用户说"价格多少" → query="价格"
- 用户说"支持哪些系统" → query="系统要求"`
```

## 常见问题

### Q1: AI 如何知道何时调用知识检索工具?

**A**:
AI 根据以下因素决定:
1. **工具描述**: 是否匹配用户问题类型
2. **对话上下文**: 是否需要参考知识库内容
3. **问题复杂度**: 是否需要额外信息才能回答

**优化建议**:
- 在工具描述中明确说明适用场景
- 提供调用示例
- 说明检索的知识库范围

### Q2: 如何处理检索结果为空?

**A**:
AI 会自动处理:
```
如果检索结果为空:
1. AI 会识别没有找到相关信息
2. 可以告诉用户知识库中没有相关内容
3. 建议用户换个方式提问或联系人工客服
```

### Q3: 可以同时使用多个知识库吗?

**A**:
可以！创建多个知识检索工具节点，每个使用不同的知识库:

```javascript
Tools: [
  Tool 1: knowledgeBaseId: "kb_products"      // 产品库
  Tool 2: knowledgeBaseId: "kb_support"     // 支持库
  Tool 3: knowledgeBaseId: "kb_pricing"      // 价格库
]

AI 会根据问题类型选择合适的工具调用。
```

### Q4: 如何提高检索准确性?

**A**:

**1. 优化知识库内容**
- 确保知识库内容完整、准确
- 使用清晰的文档结构
- 添加适当的元数据

**2. 优化工具描述**
```javascript
toolDescription: `检索产品技术文档。
输入参数: query (技术关键词，如"安装"、"配置"、"故障排除"等)
返回: results (相关技术文档片段)
注意: 查询应该包含具体的技术关键词`
```

**3. 使用相关度评分**
```javascript
System Prompt: `使用知识检索结果时:
- 优先使用相关度评分 >= 0.7 的结果
- 如果所有结果评分 < 0.7，告知用户可能需要更精确的问题`
```

### Q5: 工具可以多次调用吗?

**A**:
可以！AI 可以在同一对话中多次调用:

```
用户: "这个产品有什么功能?"
AI: (第1次调用) → 检索产品功能信息

用户: "价格是多少?"
AI: (第2次调用) → 检索价格信息

用户: "有什么颜色可选?"
AI: (第3次调用) → 检索颜色选项信息
```

## 下一步

- [AI Agent 节点](/zh-hans/guide/workflow/nodes/action-nodes/ai-agent) - 了解如何使用 AI Agent
- [知识检索 Action 节点](/zh-hans/guide/workflow/nodes/action-nodes/knowledge-retrieval) - 了解 Action 版本
- [HTTP Request Tool 节点](/zh-hans/guide/workflow/nodes/tool-nodes/http-request) - 结合 API 调用

## 相关资源

- [Entity Recognition Tool 节点](/zh-hans/guide/workflow/nodes/tool-nodes/entity-recognition) - 从对话提取查询关键词
- [表达式语法](/zh-hans/guide/expressions/) - 学习如何在配置中使用表达式

