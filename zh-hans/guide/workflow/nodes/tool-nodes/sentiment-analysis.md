---
title: 情感分析工具节点
description: 为 AI Agent 提供情感分析能力，让 AI 能够识别和理解用户的情感状态
---

# 情感分析工具节点

情感分析工具节点为 AI Agent 提供分析文本情感倾向和强度的能力。与 Sentiment Analysis Action 节点不同，Tool 版本由 AI 根据对话需求自主决定是否调用。

## 使用场景

### 典型应用
- **智能客服优化** - AI 识别用户情绪，优先处理负面反馈
- **情感化对话** - AI 根据用户情感调整回复风格和内容
- **对话路由** - AI 根据情感将对话路由到不同处理流程
- **舆情监控** - AI 自动分析用户反馈的情感趋势
- **风险预警** - AI 识别愤怒或沮丧的用户，及时介入
- **满意度评估** - AI 自动评估客户对产品或服务的满意度

## Tool vs Action 的区别

| 特性 | Sentiment Analysis Action | Sentiment Analysis Tool |
|------|--------------------------|------------------------|
| 执行方式 | 直接执行 | AI 按需调用 |
| 使用场景 | 固定的情感分析流程 | AI Agent 需要时分析情感 |
| 调用时机 | 每次都执行 | AI 决定何时调用 |
| 输入来源 | 预先配置 | AI 从对话中提取文本 |

**示例对比**:
```
Action 方式 (固定流程):
用户输入 → 情感分析 → 根据情感处理

Tool 方式 (智能交互):
用户: "这个产品真难用！"
AI: (识别需要分析情感) → 调用情感分析工具 → 识别为负面 → 调整回复策略
用户: "太棒了，我很满意！"
AI: (识别需要分析情感) → 调用情感分析工具 → 识别为正面 → 表达感谢
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
toolName: "analyzeSentiment"

// 2. 描述性的工具名称
toolName: "detectUserEmotion"

// 3. 带前缀的工具名称
toolName: "sentimentAnalysisTool"
```

**命名建议**:
- **使用小驼峰或下划线**: `analyzeSentiment` 或 `analyze_sentiment`
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
"分析文本的情感倾向和强度。输入参数: input(要分析的文本)。返回: sentiment(情感分类), score(情感强度), label(情感标签)。适用于识别用户情绪状态。"

// 2. 说明使用场景
"分析用户消息的情感倾向。
输入参数:
- input: 用户消息文本
返回:
- sentiment: 情感分类 ("positive" | "negative" | "neutral")
- score: 情感强度评分 (-1 到 1)
- label: 情感标签 (如"积极"、"消极"、"中性")

当需要了解用户情绪时调用 analyzeSentiment 工具。"

// 3. 说明特殊用途
"识别客户反馈的情感倾向，用于优先处理负面反馈。
输入: input(客户反馈文本)
返回: sentiment, score, label
适用场景: 分析客户评价、投诉、建议时调用 detectCustomerSentiment 工具。"
```

#### 模型 (model)

选择用于情感分析的 AI 模型。

**字段属性**:
- 必填字段
- 支持主流 LLM 提供商
- 模型选择影响分析准确度

**推荐模型**:
```yaml
GPT-3.5-turbo: 性价比高，适合大多数场景
GPT-4: 准确度更高，复杂情感识别
Claude: 擅长细腻情感分析
```

#### 输入文本 (input)

要分析情感的文本内容。AI 会从对话中提取并填充此字段。

**字段属性**:
- 必填字段
- 支持表达式
- 支持多行文本
- AI 会自动从对话中提取文本

**配置示例**:

```javascript
// 1. AI 从对话中提取
input: ""  // AI 会自动填充用户消息

// 2. 从上下文获取
input: $('Chat Trigger').message

// 3. 组合多个信息源
input: `用户反馈: ${$('Chat Trigger').message}
历史评价: ${$('Previous Reviews').averageRating}`
```

#### 中性情感范围下限 (neutralLowerBound)

中性情感的评分下限。

**字段属性**:
- 数字类型
- 范围：-1 到 1
- 默认值：`-0.2`

**说明**: 评分在 [neutralLowerBound, neutralUpperBound] 范围内的被判定为中性情感。

#### 中性情感范围上限 (neutralUpperBound)

中性情感的评分上限。

**字段属性**:
- 数字类型
- 范围：-1 到 1
- 默认值：`0.2`

**说明**:
- 评分 > neutralUpperBound：正面情感
- 评分 < neutralLowerBound：负面情感
- 评分在两者之间：中性情感

#### 知识库 (knowledgeBaseId)

可选，用于提供情感分析的上下文参考。

**字段属性**:
- 可选字段
- 用于特定领域的情感分析

#### 允许自由发挥 (allowImprovise)

是否允许 AI 在预定义情感之外输出自定义情感标签。

**默认值**: `false`

#### 自定义标签 (customLabels)

为字段提供自定义显示标签。

**字段属性**:
- 可选字段
- 键值对格式

### 高级设置(设置面板)

#### 总是输出 (alwaysOutput)

即使分析失败也输出空项。

**默认值**: `false`

#### 仅执行一次 (executeOnce)

是否仅使用第一个输入项执行一次。

**默认值**: `false`

#### 失败重试 (retryOnFail)

分析失败时是否自动重试。

**默认值**: `false`

#### 最大重试次数 (maxTries)

失败后的最大重试次数。

**默认值**: `3`

#### 重试等待时间 (waitBetweenTries)

每次重试之间的等待时间（毫秒）。

**默认值**: `1000` (1秒)

#### 节点描述 (nodeDescription)

为节点添加自定义描述。

```yaml
nodeDescription: "分析客户反馈的情感倾向"
```

## 输出数据

返回情感分类和评分。

**输出结构**:

```javascript
{
  sentiment: "positive",  // 情感分类：positive/negative/neutral
  score: 0.85,           // 情感强度评分：-1（极度负面）到 1（极度正面）
  label: "积极"           // 情感标签
}
```

**访问输出**:

```javascript
// 获取情感分类
$('Sentiment Analysis Tool').sentiment

// 获取情感强度
$('Sentiment Analysis Tool').score

// 获取情感标签
$('Sentiment Analysis Tool').label

// 条件判断
$('Sentiment Analysis Tool').sentiment === "positive"
```

## 工作流示例

### 示例 1: 智能客服情感识别

```
Chat Trigger
  → AI Agent Node
    System Prompt: "你是智能客服助手，需要识别用户情绪并提供相应的服务。"
    
    Tools: [Sentiment Analysis Tool]
      Tool Name: "analyzeSentiment"
      Tool Description: "分析用户消息的情感倾向。输入: input(用户消息)。返回: sentiment(情感分类), score(情感强度), label(情感标签)。当需要了解用户情绪时调用此工具。"
      Model: "GPT-3.5-turbo"
      Input: ""  // AI 从对话中提取
  → Answer Node

对话示例:
用户: "这个产品太难用了，我要退货！"
AI: (调用 analyzeSentiment 工具)
分析结果: {sentiment: "negative", score: -0.8, label: "消极"}
AI: "非常抱歉给您带来不便。我理解您的不满，让我立即为您处理退货事宜..."

用户: "太棒了，这个功能我很满意！"
AI: (调用 analyzeSentiment 工具)
分析结果: {sentiment: "positive", score: 0.9, label: "积极"}
AI: "很高兴听到您的满意！感谢您的反馈，我们会继续努力..."
```

### 示例 2: 情感化对话路由

```
Chat Trigger
  → AI Agent Node
    System Prompt: "你是客服助手，根据用户情感提供不同服务。"
    
    Tools: [Sentiment Analysis Tool]
      Tool Name: "detectEmotion"
      Tool Description: "检测用户情感状态。输入: input。返回: sentiment, score。"
      Model: "GPT-4"
  → Conditional Branch
    条件: $('Sentiment Analysis Tool').sentiment === "negative" && $('Sentiment Analysis Tool').score < -0.7
    → [True] → AI Agent (紧急处理流程)
      系统提示: "用户情绪非常负面，需要立即安抚和解决问题"
    → [False] → Answer Node (正常流程)
```

### 示例 3: 满意度评估

```
Chat Trigger
  → AI Agent Node
    System Prompt: "你是客户满意度调查助手。"
    
    Tools: [Sentiment Analysis Tool]
      Tool Name: "evaluateSatisfaction"
      Tool Description: "评估客户满意度。输入: input(客户反馈)。返回: sentiment, score。"
      Model: "GPT-3.5-turbo"
  → Code Node
    代码: |
      const sentiment = $('Sentiment Analysis Tool');
      const satisfaction = sentiment.sentiment === "positive" && sentiment.score > 0.6
        ? "high"
        : sentiment.sentiment === "negative" && sentiment.score < -0.6
        ? "low"
        : "medium";
      
      return { satisfaction, ...sentiment };
  → Answer Node
```

## 最佳实践

### 1. 编写清晰的工具描述

**好的工具描述**:
```
"分析用户消息的情感倾向和强度。
输入参数:
- input: 用户消息文本
返回:
- sentiment: 情感分类 ("positive" | "negative" | "neutral")
- score: 情感强度评分 (-1 到 1)
- label: 情感标签

使用场景:
- 识别用户情绪状态
- 判断是否需要紧急处理
- 调整回复策略和语气

示例: 当用户表达强烈不满或满意时调用 analyzeSentiment 工具。"
```

### 2. 合理设置中性情感范围

```javascript
// 1. 默认设置（较宽松）
neutralLowerBound: -0.2
neutralUpperBound: 0.2

// 2. 严格设置（更偏向明确的情感）
neutralLowerBound: -0.1
neutralUpperBound: 0.1

// 3. 宽松设置（更多中性判断）
neutralLowerBound: -0.3
neutralUpperBound: 0.3
```

### 3. 在 System Prompt 中指导 AI 使用

```javascript
System Prompt: `当你调用情感分析工具后:
1. 如果 sentiment === "negative" 且 score < -0.7:
   - 表达理解和歉意
   - 提供解决方案
   - 询问是否需要进一步帮助

2. 如果 sentiment === "positive" 且 score > 0.7:
   - 表达感谢和高兴
   - 鼓励用户继续使用
   - 可以推荐相关产品

3. 如果 sentiment === "neutral":
   - 保持专业和友好的语气
   - 正常回答问题`
```

### 4. 结合其他工具使用

```javascript
Tools: [
  Tool 1 - Sentiment Analysis Tool
    Tool Name: "analyzeSentiment"
    Tool Description: "分析用户情感"
  
  Tool 2 - HTTP Request Tool
    Tool Name: "escalateToHuman"
    Tool Description: "转接人工客服"
  
  Tool 3 - Code Tool
    Tool Name: "recordFeedback"
    Tool Description: "记录用户反馈"
]

// AI 会根据情感分析结果决定是否转接人工或记录反馈
```

## 常见问题

### Q1: AI 如何知道何时调用情感分析工具?

**A**:
AI 根据以下因素决定:
1. **工具描述**: 是否提到需要识别用户情绪
2. **对话上下文**: 用户消息是否表达强烈情感
3. **任务需求**: 是否需要根据情感调整策略

**优化建议**:
- 在工具描述中明确说明适用场景
- 提供调用示例
- 说明分析的情感类型

### Q2: 如何处理混合情感?

**A**:
情感分析工具会返回整体情感倾向:
```javascript
// 如果用户说"产品质量不错，但客服态度很差"
// 工具会分析整体情感，可能返回:
{
  sentiment: "negative",  // 整体偏向负面
  score: -0.3,           // 中等负面强度
  label: "消极"
}
```

### Q3: 情感分析准确度如何提高?

**A**:

**1. 选择合适的模型**
```javascript
// 复杂情感分析使用更强的模型
model: "GPT-4"  // 而非 GPT-3.5
```

**2. 使用知识库提供上下文**
```javascript
knowledgeBaseId: "kb_customer_feedback"  // 特定领域的情感分析
```

**3. 调整中性情感范围**
```javascript
// 根据业务需求调整
neutralLowerBound: -0.1  // 更严格的中性判断
neutralUpperBound: 0.1
```

### Q4: 可以多次调用情感分析工具吗?

**A**:
可以！AI 可以在同一对话中多次调用:

```
用户: "这个产品不好用"
AI: (第1次调用) → 识别为负面情感
AI: "抱歉，能详细说明一下问题吗？"

用户: "现在好多了，谢谢！"
AI: (第2次调用) → 识别为正面情感
AI: "很高兴问题解决了！"
```

### Q5: 如何根据情感分析结果采取行动?

**A**:

**方案 1: 在 System Prompt 中指导**
```javascript
System Prompt: `根据情感分析结果:
- 负面且强烈 (score < -0.7): 立即提供解决方案，必要时转人工
- 正面且强烈 (score > 0.7): 表达感谢，可以推荐相关产品
- 中性: 正常处理`
```

**方案 2: 结合条件分支**
```
AI Agent (调用情感分析工具)
  → Conditional Branch
    条件: sentiment === "negative" && score < -0.7
    → [True] → 转人工客服
    → [False] → 继续对话
```

## 下一步

- [AI Agent 节点](/zh-hans/guide/workflow/nodes/action-nodes/ai-agent) - 了解如何使用 AI Agent
- [情感分析 Action 节点](/zh-hans/guide/workflow/nodes/action-nodes/sentiment-analysis) - 了解 Action 版本
- [Entity Recognition Tool 节点](/zh-hans/guide/workflow/nodes/tool-nodes/entity-recognition) - 从对话提取信息

## 相关资源

- [HTTP Request Tool 节点](/zh-hans/guide/workflow/nodes/tool-nodes/http-request) - 结合 API 调用
- [表达式语法](/zh-hans/guide/expressions/) - 学习如何在配置中使用表达式

