---
title: LLM 节点
description: 调用大语言模型生成文本内容
---

# LLM 节点

LLM 节点用于调用大语言模型（Large Language Model）生成文本内容。它是构建 AI 对话、内容生成和智能助手的核心节点，支持多种主流 LLM 提供商和模型。

## 使用场景

### 典型应用
- **智能对话** - 构建聊天机器人，与用户进行自然语言交互
- **内容生成** - 生成文章、邮件、产品描述等文本内容
- **文本总结** - 总结长文档或对话内容
- **文本改写** - 改进、润色或翻译文本
- **问答系统** - 基于上下文回答用户问题
- **代码生成** - 生成、解释或优化代码
- **数据分析** - 分析和解释数据，生成洞察报告
- **创意写作** - 生成故事、诗歌、营销文案等

## 节点配置

### 基础设置（参数面板）

#### 模型 (model)

选择要使用的大语言模型。

**字段属性**:
- 必填字段
- 支持多个 LLM 提供商
- 不同模型有不同的能力和成本

**主流模型提供商**:
- **OpenAI**: GPT-4, GPT-4 Turbo, GPT-3.5-turbo
- **Anthropic**: Claude 3 Opus, Claude 3 Sonnet, Claude 3 Haiku
- **Google**: Gemini Pro, Gemini Ultra
- **其他**: 本地模型（Ollama）、自定义端点

**模型选择建议**:
```yaml
GPT-4: 复杂推理、高质量内容生成
GPT-3.5-turbo: 性价比高、适合大多数场景
Claude 3 Opus: 长文本处理、复杂任务
Claude 3 Sonnet: 平衡性能和成本
Claude 3 Haiku: 快速响应、简单任务
```

#### 系统提示词 (systemPrompt)

定义 AI 的角色、行为和约束条件。

**字段属性**:
- 可选字段
- 支持表达式
- 支持多行文本

**配置示例**:

```javascript
// 1. 定义角色和风格
"你是一个专业的客服助手，友好、耐心、专业。总是以清晰简洁的方式回答问题。"

// 2. 设置回答格式
"你是一个技术支持专家。回答时：
1. 先简要说明问题原因
2. 然后提供解决步骤
3. 最后给出预防建议"

// 3. 添加约束条件
"你是产品推荐助手。规则：
- 只推荐符合用户预算的产品
- 说明推荐理由
- 不推荐库存不足的商品
- 如果不确定，询问更多信息"

// 4. 使用表达式动态设置
`你是${$('AI分类器').class}领域的专家，为用户提供专业建议。`

// 5. 基于知识库内容
`你是客服助手。基于以下知识库内容回答问题：

${$('知识检索').results[0].content}

要求：
- 只使用提供的信息
- 如果信息不足，明确说明
- 引用来源`
```

#### 用户提示词 (userPrompts)

用户消息内容，可以包含多轮对话。

**字段属性**:
- 数组类型，支持多条消息
- 支持表达式
- 按顺序构建对话历史

**配置示例**:

```javascript
// 1. 简单问题
[$('聊天触发器').message]

// 2. 带上下文的问题
[`用户信息：
姓名：${$('用户数据').name}
会员等级：${$('用户数据').vipLevel}

问题：${$('聊天触发器').message}`]

// 3. 多轮对话
[
  "第一轮对话内容",
  "第二轮对话内容",
  $('聊天触发器').message  // 当前问题
]

// 4. 结构化输入
[`请根据以下信息生成产品描述：

产品名称：${$('实体识别').productName}
主要功能：${$('实体识别').features}
目标用户：${$('实体识别').targetAudience}
价格：${$('实体识别').price}

要求：
- 突出产品优势
- 吸引目标用户
- 150-200字`]
```

#### 助手提示词 (assistantPrompts)

助手的历史回复，用于构建多轮对话上下文。

**字段属性**:
- 数组类型，可选
- 与 userPrompts 配对使用
- 提供对话历史

**配置示例**:

```javascript
// 构建对话历史
userPrompts: [
  "什么是机器学习？",
  "它和深度学习有什么区别？"
]

assistantPrompts: [
  "机器学习是一种人工智能技术，让计算机从数据中学习规律..."
  // 第二个问题的回答由当前调用生成
]
```

#### 自定义标签 (customLabels)

为提示词字段提供自定义显示标签。

**字段属性**:
- 可选字段
- 键值对格式
- 仅用于界面显示

### 高级设置（设置面板）

#### 总是输出 (alwaysOutput)

即使生成失败也输出空项。

**默认值**: `false`

#### 仅执行一次 (executeOnce)

是否仅使用第一个输入项执行一次。

**默认值**: `false`

#### 失败重试 (retryOnFail)

生成失败时是否自动重试。

**默认值**: `false`

**建议启用场景**:
- 网络不稳定
- API 限流
- 临时服务故障

#### 最大重试次数 (maxTries)

失败后的最大重试次数。

**默认值**: `3`

#### 重试等待时间 (waitBetweenTries)

每次重试之间的等待时间（毫秒）。

**默认值**: `1000` (1秒)

#### 错误处理 (onError)

生成失败时的处理方式。

**可选值**:
- `stopWorkflow` - 停止整个工作流（默认）
- `continueRegularOutput` - 继续执行
- `continueErrorOutput` - 继续执行，使用错误输出

#### 节点描述 (nodeDescription)

为节点添加自定义描述。

```yaml
nodeDescription: "基于知识库生成客服回复"
```

## 输出数据

LLM 节点返回模型生成的文本内容。

```javascript
// 访问生成的文本
$('LLM').output

// 如果需要进一步处理
$('LLM').output.length
$('LLM').output.toLowerCase()
```

## 工作流示例

### 示例 1: 简单问答机器人

```
聊天触发器
  → LLM节点
    模型: GPT-3.5-turbo
    系统提示词: "你是一个友好的客服助手，帮助用户解答问题。"
    用户提示词: [$('聊天触发器').message]
  → 回答节点
    回答: $('LLM').output
```

### 示例 2: 基于知识库的问答（RAG）

```
聊天触发器
  → 知识检索节点
    查询: $('聊天触发器').message
    知识库: "kb_product_docs"
  → 条件分支
    条件: $('知识检索').results.length > 0
    → [True] → LLM节点
      系统提示词: "你是产品支持专家。基于提供的知识库内容准确回答用户问题。"
      用户提示词: [`知识库内容：

${$('知识检索').results[0].content}

---

用户问题：${$('聊天触发器').message}

要求：
1. 基于知识库内容回答
2. 如果知识库内容不足，明确说明
3. 提供清晰的步骤或说明`]
      → 回答节点
    → [False] → 回答节点
      回答: "抱歉，我没有找到相关信息。请联系人工客服获取帮助。"
```

### 示例 3: 多步骤对话

```
聊天触发器
  → 代码节点（获取对话历史）
    代码:
      function main({currentMessage, conversationHistory}) {
          // 从数据库或缓存获取历史
          const history = conversationHistory || []

          // 构建用户消息数组
          const userMessages = [
              ...history.filter(m => m.role === 'user').map(m => m.content),
              currentMessage
          ]

          // 构建助手消息数组
          const assistantMessages = history
              .filter(m => m.role === 'assistant')
              .map(m => m.content)

          return {
              userMessages,
              assistantMessages
          }
      }
    输出:
      - userMessages: array[string]
      - assistantMessages: array[string]
  → LLM节点
    系统提示词: "你是智能助手，记住对话历史，提供连贯的回复。"
    用户提示词: $('代码').userMessages
    助手提示词: $('代码').assistantMessages
  → 代码节点（保存对话历史）
  → 回答节点
```

### 示例 4: 内容生成

```
Webhook触发器
  → 实体识别节点
    输入: $('Webhook触发器').body.requirements
    JSON Schema: {
      "properties": {
        "topic": {"type": "string"},
        "tone": {"type": "string"},
        "length": {"type": "number"},
        "keywords": {"type": "array"}
      }
    }
  → LLM节点
    模型: GPT-4
    系统提示词: "你是专业的内容创作者，擅长撰写吸引人的文章。"
    用户提示词: [`请创作一篇文章：

主题：${$('实体识别').topic}
风格：${$('实体识别').tone}
长度：约${$('实体识别').length}字
关键词：${$('实体识别').keywords.join('、')}

要求：
1. 内容原创
2. 结构清晰
3. 包含引言、正文、结论
4. 自然融入关键词`]
  → 回答节点
```

### 示例 5: 情感化回复

```
聊天触发器
  → 情感分析节点
    输入: $('聊天触发器').message
  → LLM节点
    系统提示词: `你是客服助手。根据用户情感调整回复风格。

当前用户情感：${$('情感分析').sentiment}
情感强度：${$('情感分析').score}

回复指南：
- 如果用户愤怒或沮丧，表示理解和歉意
- 如果用户高兴，分享他们的喜悦
- 如果用户困惑，耐心解释
- 保持专业和同理心`
    用户提示词: [$('聊天触发器').message]
  → 回答节点
```

### 示例 6: 代码生成和解释

```
聊天触发器
  → AI分类器
    输入: $('聊天触发器').message
    类别: ["生成代码", "解释代码", "调试代码", "优化代码"]
  → LLM节点
    模型: GPT-4
    系统提示词: `你是编程专家。

任务类型：${$('AI分类器').class}

指南：
- 生成代码：提供完整可运行的代码，添加注释
- 解释代码：逐行解释，说明原理
- 调试代码：找出问题，提供修复方案
- 优化代码：指出可改进之处，提供优化版本`
    用户提示词: [$('聊天触发器').message]
  → 回答节点
```

### 示例 7: 数据分析和洞察

```
HTTP请求（获取数据）
  → 代码节点（格式化数据）
    代码:
      function main({data}) {
          // 计算统计信息
          const stats = {
              total: data.length,
              average: data.reduce((sum, d) => sum + d.value, 0) / data.length,
              max: Math.max(...data.map(d => d.value)),
              min: Math.min(...data.map(d => d.value))
          }

          // 格式化为表格
          const dataTable = data
              .map(d => `${d.date}: ${d.value}`)
              .join('\n')

          return {stats, dataTable}
      }
    输出:
      - stats: object
      - dataTable: string
  → LLM节点
    模型: GPT-4
    系统提示词: "你是数据分析师，善于发现数据中的趋势和洞察。"
    用户提示词: [`请分析以下数据并提供洞察：

统计信息：
- 总数：${$('代码').stats.total}
- 平均值：${$('代码').stats.average.toFixed(2)}
- 最大值：${$('代码').stats.max}
- 最小值：${$('代码').stats.min}

详细数据：
${$('代码').dataTable}

请提供：
1. 趋势分析
2. 异常值说明
3. 业务建议`]
  → 回答节点
```

### 示例 8: 多语言翻译

```
聊天触发器
  → 实体识别节点
    输入: $('聊天触发器').message
    JSON Schema: {
      "properties": {
        "text": {"type": "string"},
        "targetLanguage": {"type": "string"}
      }
    }
  → LLM节点
    系统提示词: `你是专业翻译。翻译规则：

1. 准确传达原意
2. 符合目标语言习惯
3. 保持语气和风格
4. 专业术语准确
5. 如有歧义，提供多个选项`
    用户提示词: [`将以下文本翻译为${$('实体识别').targetLanguage}：

${$('实体识别').text}`]
  → 回答节点
```

## 最佳实践

### 1. 编写有效的提示词

**清晰的角色定义**
```javascript
// 好的系统提示词
"你是经验丰富的Python开发者。回答时：
- 提供可运行的代码示例
- 解释关键概念
- 指出常见陷阱
- 遵循PEP 8规范"

// 不好的系统提示词
"你是程序员"
```

**具体的指令**
```javascript
// 好的用户提示词
`请分析以下客户反馈并提供：
1. 主要问题点（列表形式）
2. 情感倾向（正面/负面/中性）
3. 优先级建议（高/中/低）
4. 改进建议（具体可行）

客户反馈：${feedback}`

// 不好的用户提示词
"分析这个反馈"
```

**提供示例**
```javascript
`请按以下格式生成产品描述：

示例：
产品：无线耳机
描述：采用主动降噪技术，30小时续航，舒适佩戴，适合通勤和运动。

现在请为以下产品生成描述：
产品：${productName}
特点：${features}`
```

### 2. 优化成本和性能

**选择合适的模型**
```yaml
简单任务: GPT-3.5-turbo, Claude Haiku
复杂推理: GPT-4, Claude Opus
长文本: Claude 3 系列
代码生成: GPT-4
```

**控制输出长度**
```javascript
系统提示词: "回答时保持简洁，不超过200字。"
```

**使用缓存**
```javascript
// 缓存常见问题的回答
代码节点（检查缓存）
  → 条件分支
    → [命中] → 返回缓存结果
    → [未命中] → LLM节点 → 保存到缓存
```

### 3. 提高回答质量

**提供上下文**
```javascript
`用户信息：
- 会员等级：${userLevel}
- 历史购买：${purchaseHistory}
- 偏好：${preferences}

基于以上信息，回答用户问题：${question}`
```

**使用思维链（Chain of Thought）**
```javascript
系统提示词: "在回答前，先分步骤思考：
1. 理解问题核心
2. 列出相关知识点
3. 推理得出结论
4. 组织清晰的回答"
```

**要求引用来源**
```javascript
`基于知识库内容回答问题。
要求：在回答中标注信息来源，如 [来源1]`
```

### 4. 处理错误和边界情况

**设置回退策略**
```javascript
LLM节点
  设置:
    retryOnFail: true
    maxTries: 3
    onError: continueErrorOutput
  → 条件分支
    → [成功] → 回答节点
    → [失败] → 回答节点（回退回答）
```

**验证输出**
```javascript
LLM节点
  → 代码节点（验证输出）
    代码:
      function main({llmOutput}) {
          // 检查输出是否符合预期
          const isValid = llmOutput.length > 10 &&
                         !llmOutput.includes("作为AI")

          return {
              isValid,
              output: isValid ? llmOutput : "输出验证失败"
          }
      }
  → 条件分支
```

### 5. 多轮对话管理

**保存对话状态**
```javascript
// 在代码节点中管理对话历史
function main({newMessage, conversationId}) {
    // 从数据库获取历史
    const history = getHistory(conversationId)

    // 添加新消息
    history.push({
        role: 'user',
        content: newMessage,
        timestamp: Date.now()
    })

    // 限制历史长度（例如最近10轮）
    const recentHistory = history.slice(-20) // user + assistant

    return {
        userMessages: recentHistory.filter(m => m.role === 'user').map(m => m.content),
        assistantMessages: recentHistory.filter(m => m.role === 'assistant').map(m => m.content)
    }
}
```

**清理过时的上下文**
```javascript
// 只保留相关的对话历史
function main({history, currentTopic}) {
    // 过滤出与当前主题相关的历史
    const relevantHistory = history.filter(h =>
        h.topic === currentTopic
    )

    return {relevantHistory}
}
```

### 6. 安全和合规

**内容过滤**
```javascript
系统提示词: "重要规则：
- 不生成有害或危险内容
- 不提供医疗诊断
- 不给出法律建议
- 保护用户隐私
- 遇到不当请求，礼貌拒绝"
```

**敏感信息处理**
```javascript
// 在传给LLM前清理敏感信息
代码节点（脱敏）
  → LLM节点
  → 代码节点（恢复信息）
```

## 常见问题

### Q1: LLM 节点和其他 AI 节点有什么区别？

**A**:
- **LLM 节点**: 通用文本生成，适合开放式任务
- **AI 分类器**: 专门用于分类，输出是预定义类别
- **实体识别**: 专门提取结构化信息，输出符合 JSON Schema
- **情感分析**: 专门分析情感倾向

**选择建议**: 如果任务可以用专门节点完成，优先使用专门节点（更准确、更快、更便宜）。

### Q2: 如何控制 LLM 输出格式？

**A**: 在提示词中明确指定格式：

```javascript
`请以以下 JSON 格式输出：
{
  "summary": "总结内容",
  "keyPoints": ["要点1", "要点2"],
  "sentiment": "positive/negative/neutral"
}

不要输出其他内容。`
```

或使用代码节点解析输出：

```javascript
function main({llmOutput}) {
    // 提取 JSON
    const jsonMatch = llmOutput.match(/\{[\s\S]*\}/)
    const data = JSON.parse(jsonMatch[0])
    return data
}
```

### Q3: LLM 输出不稳定怎么办？

**A**: 多种方法提高稳定性：

1. **更明确的提示词**
2. **提供示例**（Few-shot learning）
3. **使用更强大的模型**（如 GPT-4）
4. **降低 temperature**（如果 API 支持）
5. **后处理验证和修正**

### Q4: 如何实现流式输出？

**A**: 取决于系统支持。如果支持流式API：
- 输出会逐步返回
- 可以实现打字机效果
- 提升用户体验

### Q5: LLM 调用很慢怎么办？

**A**: 优化方法：

1. **选择更快的模型**（如 Claude Haiku）
2. **缩短提示词**
3. **限制输出长度**
4. **使用缓存**
5. **并行调用**（多个独立任务）

### Q6: 如何处理 Token 限制？

**A**:
1. **精简提示词**
2. **分段处理长文本**
3. **总结后再处理**
4. **选择更大上下文的模型**

```javascript
// 分段处理示例
function main({longText}) {
    const chunkSize = 2000
    const chunks = []

    for (let i = 0; i < longText.length; i += chunkSize) {
        chunks.push(longText.slice(i, i + chunkSize))
    }

    return {chunks}
}

// 然后对每个 chunk 调用 LLM
```

### Q7: LLM 生成的内容不准确怎么办？

**A**:
1. **使用 RAG**（检索增强生成）
   ```javascript
   知识检索 → LLM（基于检索结果）
   ```

2. **明确要求引用来源**
3. **使用更强大的模型**
4. **后处理验证**
5. **添加人工审核**

### Q8: 如何防止 LLM 生成有害内容？

**A**:
1. **在系统提示词中设置规则**
2. **使用内容审核 API**
3. **后处理过滤**
4. **记录和监控**

### Q9: 多轮对话如何保持上下文？

**A**: 使用 `userPrompts` 和 `assistantPrompts` 数组：

```javascript
userPrompts: [
  "第一个问题",
  "第二个问题",
  "当前问题"
]

assistantPrompts: [
  "第一个回答",
  "第二个回答"
  // 当前回答由本次生成
]
```

## 下一步

- [知识检索节点](/zh-hans/guide/workflow/nodes/action-nodes/knowledge-retrieval) - 为 LLM 提供上下文
- [AI 分类器](/zh-hans/guide/workflow/nodes/action-nodes/ai-classifier) - 路由到不同的提示词模板
- [情感分析节点](/zh-hans/guide/workflow/nodes/action-nodes/sentiment-analysis) - 根据情感调整 LLM 回复

## 相关资源

- [回答节点](/zh-hans/guide/workflow/nodes/action-nodes/answer) - 将 LLM 输出返回给用户
- [代码节点](/zh-hans/guide/workflow/nodes/action-nodes/code) - 处理和验证 LLM 输出
- [表达式语法](/zh-hans/guide/expressions/) - 学习如何在提示词中使用表达式
