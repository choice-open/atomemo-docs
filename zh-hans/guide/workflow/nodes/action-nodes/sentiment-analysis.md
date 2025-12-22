---
title: 情感分析节点
description: 分析文本的情感倾向和强度
---

# 情感分析节点

情感分析节点使用 AI 模型分析文本的情感倾向和强度，识别用户的情绪状态。它可以帮助你根据用户情感提供个性化的响应和服务，提升用户体验。

## 使用场景

### 典型应用
- **客户服务优化** - 识别客户情绪，优先处理负面反馈
- **舆情监控** - 分析社交媒体和评论的情感趋势
- **对话路由** - 根据情感将对话路由到不同处理流程
- **情感化回复** - 根据用户情绪调整 AI 回复的风格和内容
- **满意度分析** - 评估客户对产品或服务的满意度
- **风险预警** - 识别愤怒或沮丧的用户，及时介入
- **市场研究** - 分析用户对产品或活动的情感反应

## 节点配置

### 基础设置（参数面板）

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

要分析情感的文本内容。

**字段属性**:
- 必填字段
- 支持表达式
- 支持多行文本

**配置示例**:

```javascript
// 1. 引用用户消息
$('聊天触发器').message

// 2. 引用 Webhook 数据
$('Webhook触发器').body.feedback

// 3. 引用 HTTP 请求结果
$('HTTP请求').body.comment

// 4. 拼接多个字段
`标题：${$('数据').title}
内容：${$('数据').content}`
```

#### 输出语言 (outputLanguage)

情感分析结果的输出语言。

**可选值**:
- `chinese` - 中文（默认）
- `english` - 英文

**默认值**: `chinese`

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

### 高级设置（设置面板）

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

#### 错误处理 (onError)

分析失败时的处理方式。

**可选值**:
- `stopWorkflow` - 停止整个工作流（默认）
- `continueRegularOutput` - 继续执行
- `continueErrorOutput` - 继续执行，使用错误输出

#### 节点描述 (nodeDescription)

为节点添加自定义描述。

```yaml
nodeDescription: "分析客户反馈的情感倾向"
```

## 输出数据

情感分析节点返回情感分类和评分。

**输出结构**:

```javascript
{
  sentiment: "positive",  // 情感分类：positive/negative/neutral
  score: 0.85,           // 情感强度评分：-1（极度负面）到 1（极度正面）
  label: "积极"           // 情感标签（根据 outputLanguage）
}
```

**访问输出**:

```javascript
// 获取情感分类
$('情感分析').sentiment

// 获取情感强度
$('情感分析').score

// 获取情感标签
$('情感分析').label

// 条件判断
$('情感分析').sentiment === "positive"
$('情感分析').score > 0.5
```

## 工作流示例

### 示例 1: 客户反馈优先级处理

```
Webhook触发器
  → 情感分析节点
    模型: GPT-3.5-turbo
    输入: $('Webhook触发器').body.feedback
    输出语言: chinese
  → 条件分支
    条件: $('情感分析').sentiment === "negative" AND $('情感分析').score < -0.5
    → [True] → HTTP请求（创建高优先级工单）
      → 回答节点
        回答: "我们非常重视您的反馈，已为您创建高优先级工单，客服将在30分钟内联系您。"
    → [False] → 条件分支（检查正面情感）
      条件: $('情感分析').sentiment === "positive"
      → [True] → 回答节点
        回答: "感谢您的积极反馈！我们会继续努力提供优质服务。"
      → [False] → 回答节点
        回答: "感谢您的反馈，我们已记录您的意见。"
```

### 示例 2: 情感化的 AI 回复

```
聊天触发器
  → 情感分析节点
    模型: GPT-3.5-turbo
    输入: $('聊天触发器').message
  → LLM节点
    系统提示词: `你是客服助手。根据用户的情感状态调整回复风格。

用户情感：${$('情感分析').label}
情感强度：${$('情感分析').score}

回复指南：
- 如果用户愤怒（negative, score < -0.5）：表达真诚的歉意和理解，立即提供解决方案
- 如果用户沮丧（negative, -0.5 <= score < -0.2）：表示同情，耐心帮助
- 如果用户中性（neutral）：保持专业友好，清晰回答
- 如果用户高兴（positive, score > 0.5）：分享喜悦，鼓励继续使用
- 如果用户满意（positive, 0.2 < score <= 0.5）：表达感谢，提供额外帮助`
    用户提示词: [$('聊天触发器').message]
  → 回答节点
```

### 示例 3: 舆情监控和告警

```
定时触发器（每小时执行）
  → HTTP请求（获取社交媒体评论）
  → 代码节点（遍历评论）
    代码:
      function main({comments}) {
          return {
              commentsList: comments.map(c => ({
                  id: c.id,
                  text: c.text,
                  author: c.author
              }))
          }
      }
  → 情感分析节点
    输入: $('代码').commentsList.text
  → 代码节点（统计和分析）
    代码:
      function main({sentiments, comments}) {
          // 计算负面比例
          const negative = sentiments.filter(s => s.sentiment === "negative")
          const negativeRatio = negative.length / sentiments.length

          // 找出极度负面评论
          const severeNegative = sentiments.filter(s => s.score < -0.7)

          // 计算平均情感分数
          const avgScore = sentiments.reduce((sum, s) => sum + s.score, 0) / sentiments.length

          return {
              total: sentiments.length,
              negativeCount: negative.length,
              negativeRatio: negativeRatio.toFixed(2),
              severeNegativeCount: severeNegative.length,
              avgScore: avgScore.toFixed(2),
              needAlert: negativeRatio > 0.3 || severeNegative.length > 5
          }
      }
  → 条件分支
    条件: $('代码').needAlert === true
    → [True] → HTTP请求（发送告警通知）
      请求体:
        `{
          "alert_type": "sentiment_warning",
          "summary": "负面评论比例异常",
          "details": {
            "total": ${$('代码').total},
            "negative_count": ${$('代码').negativeCount},
            "negative_ratio": "${$('代码').negativeRatio}",
            "severe_negative": ${$('代码').severeNegativeCount},
            "avg_score": "${$('代码').avgScore}"
          }
        }`
    → [False] → 日志记录节点
```

### 示例 4: 动态对话路由

```
聊天触发器
  → 情感分析节点
    输入: $('聊天触发器').message
  → 条件分支 A（检查负面情感）
    条件: $('情感分析').sentiment === "negative"
    → [True] → 条件分支 B（检查严重程度）
      条件: $('情感分析').score < -0.6
      → [True] → HTTP请求（转人工客服）
        → 回答节点
          回答: "我理解您的感受，正在为您转接人工客服..."
      → [False] → LLM节点（安抚性回复）
        → 知识检索节点
        → 回答节点
    → [False] → LLM节点（标准回复）
      → 回答节点
```

### 示例 5: 产品评论分析

```
Webhook触发器
  → 实体识别节点
    输入: $('Webhook触发器').body.review
    JSON Schema: {
      "properties": {
        "productName": {"type": "string"},
        "reviewText": {"type": "string"}
      }
    }
  → 情感分析节点
    输入: $('实体识别').reviewText
  → 代码节点（生成分析报告）
    代码:
      function main({sentiment, productName}) {
          let recommendation = ""

          if (sentiment.sentiment === "positive") {
              if (sentiment.score > 0.7) {
                  recommendation = "优质好评，建议推送到首页"
              } else {
                  recommendation = "正面评价，标准展示"
              }
          } else if (sentiment.sentiment === "negative") {
              if (sentiment.score < -0.5) {
                  recommendation = "负面评价，建议联系客户了解详情"
              } else {
                  recommendation = "轻微负面，建议关注"
              }
          } else {
              recommendation = "中性评价，正常展示"
          }

          return {
              productName,
              sentiment: sentiment.label,
              score: sentiment.score,
              recommendation
          }
      }
  → HTTP请求（保存分析结果）
  → 回答节点
```

### 示例 6: 满意度调查分析

```
HTTP请求（获取调查反馈）
  → 代码节点（提取反馈文本）
    代码:
      function main({surveys}) {
          return {
              feedbackList: surveys.map(s => ({
                  id: s.id,
                  text: s.openEndedResponse,
                  rating: s.rating
              }))
          }
      }
  → 情感分析节点
    输入: $('代码').feedbackList.text
  → 代码节点（综合分析）
    代码:
      function main({sentiments, surveys}) {
          // 情感与评分一致性检查
          const analysis = surveys.map((s, i) => {
              const sent = sentiments[i]
              const ratingPositive = s.rating >= 4
              const sentimentPositive = sent.sentiment === "positive"
              const consistent = ratingPositive === sentimentPositive

              return {
                  id: s.id,
                  rating: s.rating,
                  sentiment: sent.label,
                  score: sent.score,
                  consistent,
                  needReview: !consistent  // 不一致的需要人工复核
              }
          })

          // 统计
          const stats = {
              total: analysis.length,
              positive: analysis.filter(a => a.sentiment === "积极").length,
              negative: analysis.filter(a => a.sentiment === "消极").length,
              neutral: analysis.filter(a => a.sentiment === "中性").length,
              inconsistent: analysis.filter(a => !a.consistent).length
          }

          return {analysis, stats}
      }
  → HTTP请求（保存分析结果到数据库）
  → LLM节点（生成总结报告）
    用户提示词: [`请根据以下满意度调查情感分析结果生成总结报告：

总体统计：
- 总反馈数：${$('代码').stats.total}
- 积极反馈：${$('代码').stats.positive} (${($('代码').stats.positive / $('代码').stats.total * 100).toFixed(1)}%)
- 消极反馈：${$('代码').stats.negative} (${($('代码').stats.negative / $('代码').stats.total * 100).toFixed(1)}%)
- 中性反馈：${$('代码').stats.neutral}
- 评分与情感不一致：${$('代码').stats.inconsistent}

请提供：
1. 整体满意度评估
2. 主要发现和趋势
3. 需要关注的问题
4. 改进建议`]
  → 回答节点
```

### 示例 7: 多语言情感分析

```
聊天触发器
  → 代码节点（检测语言）
    代码:
      function main({message}) {
          // 简单的语言检测（实际应该使用专门的语言检测库）
          const hasChineseChars = /[\u4e00-\u9fa5]/.test(message)
          const language = hasChineseChars ? "chinese" : "english"

          return {language}
      }
  → 情感分析节点
    输入: $('聊天触发器').message
    输出语言: $('代码').language
  → LLM节点
    系统提示词: `回复使用${$('代码').language === 'chinese' ? '中文' : '英文'}。
根据用户情感（${$('情感分析').label}）调整回复。`
    用户提示词: [$('聊天触发器').message]
  → 回答节点
```

## 最佳实践

### 1. 选择合适的中性范围

**根据业务调整阈值**
```javascript
// 严格的情感区分（更敏感）
neutralLowerBound: -0.1
neutralUpperBound: 0.1

// 宽松的情感区分（更包容）
neutralLowerBound: -0.3
neutralUpperBound: 0.3

// 根据场景选择：
客户服务: 使用严格阈值（及早发现负面情绪）
社交媒体监控: 使用宽松阈值（减少误报）
```

### 2. 结合情感分类和评分

**更精细的判断**
```javascript
// 不仅看分类，还要看强度
条件分支 (AND):
  - $('情感分析').sentiment === "negative"
  - $('情感分析').score < -0.7  // 极度负面

// 分级处理
if (score < -0.7) -> 紧急处理
else if (score < -0.4) -> 优先处理
else if (score < -0.2) -> 正常处理
```

### 3. 提供上下文

**包含相关信息**
```javascript
// 好的输入
`客户反馈：
订单号：${orderId}
产品：${productName}
评论：${comment}`

// 比单纯的评论文本提供更准确的情感分析
```

### 4. 验证分析结果

**后处理检查**
```javascript
代码节点:
  function main({sentiment, originalText}) {
      // 基本验证
      const isValid = sentiment && sentiment.score !== undefined

      // 合理性检查
      const textLength = originalText.length
      const tooShort = textLength < 5  // 文本太短可能不准确

      return {
          isValid,
          needManualReview: tooShort,
          sentiment: isValid ? sentiment : null
      }
  }
```

### 5. 处理边界情况

**短文本处理**
```javascript
// 对于极短文本，可能需要降级处理
条件分支: $('聊天触发器').message.length < 10
  → [True] → 使用规则匹配（不用情感分析）
  → [False] → 情感分析节点
```

**纯表情符号**
```javascript
// 检测是否只有表情符号
代码节点:
  function main({text}) {
      const onlyEmoji = /^[\u{1F300}-\u{1F9FF}\s]+$/u.test(text)
      return {onlyEmoji}
  }
```

### 6. 批量分析优化

**分批处理**
```javascript
// 对于大量文本，分批分析
代码节点:
  function main({texts}) {
      const batchSize = 10
      const batches = []

      for (let i = 0; i < texts.length; i += batchSize) {
          batches.push(texts.slice(i, i + batchSize))
      }

      return {batches}
  }

// 然后对每个 batch 调用情感分析
```

### 7. 记录和监控

**记录分析结果**
```javascript
// 用于后续优化和分析
{
  timestamp: Date.now(),
  input: $('输入').text,
  sentiment: $('情感分析').sentiment,
  score: $('情感分析').score,
  action: "转人工" // 记录采取的行动
}
```

## 常见问题

### Q1: 情感分析节点的准确率如何？

**A**: 准确率取决于多个因素：
- **模型选择**: GPT-4 > GPT-3.5-turbo
- **文本质量**: 清晰完整的文本 > 碎片化文本
- **文本长度**: 适中长度（20-200字）最准确
- **语言**: 英文和中文准确度通常较高

**建议**: 对于关键业务，结合人工审核。

### Q2: 如何处理混合情感的文本？

**A**: 情感分析节点返回的是整体情感倾向。对于混合情感：

```javascript
// 使用 LLM 节点进行更细致的分析
LLM节点:
  系统提示词: "分析文本中的多重情感，分别说明对哪些方面的情感"
  用户提示词: $('输入').text
```

### Q3: 短文本（如"好"、"谢谢"）能准确分析吗？

**A**: 短文本可能不够准确。建议：

1. **设置最小长度**
   ```javascript
   条件: $('输入').text.length >= 10
   ```

2. **使用规则匹配辅助**
   ```javascript
   if (text === "好" || text === "谢谢") -> positive
   ```

3. **结合上下文**
   ```javascript
   `${conversationHistory}\n当前消息：${currentMessage}`
   ```

### Q4: 如何处理讽刺和反讽？

**A**: 讽刺识别比较困难，可以：

1. **使用更强大的模型**（GPT-4）
2. **提供上下文**
3. **在系统提示词中说明**
   ```javascript
   "注意识别讽刺和反讽，这类表述通常表达负面情感"
   ```

### Q5: 情感分析很慢怎么办？

**A**: 优化方法：

1. **选择更快的模型**（GPT-3.5-turbo）
2. **缓存常见文本的结果**
3. **批量处理**
4. **并行分析多个文本**

### Q6: 支持哪些语言？

**A**: 主流模型通常支持：
- 中文
- 英文
- 日语
- 韩语
- 多种欧洲语言

具体支持取决于所选模型。

### Q7: 如何调整情感灵敏度？

**A**: 通过调整中性范围：

```javascript
// 更灵敏（更容易判定为正面或负面）
neutralLowerBound: -0.1
neutralUpperBound: 0.1

// 更不敏感（更多判定为中性）
neutralLowerBound: -0.4
neutralUpperBound: 0.4
```

### Q8: 评分（score）的含义是什么？

**A**:
- **范围**: -1（极度负面）到 1（极度正面）
- **0**: 完全中性
- **绝对值**: 表示情感强度

**参考标准**:
```
> 0.7: 非常积极
0.4 - 0.7: 积极
0.2 - 0.4: 轻微积极
-0.2 - 0.2: 中性
-0.4 - -0.2: 轻微消极
-0.7 - -0.4: 消极
< -0.7: 非常消极
```

### Q9: 能分析语音或图片中的情感吗？

**A**: 情感分析节点本身只分析文本。要分析语音或图片：

```javascript
语音输入 → 语音转文字 → 情感分析
图片输入 → OCR/多模态LLM提取文字 → 情感分析
```

## 下一步

- [LLM 节点](/zh-hans/guide/workflow/nodes/action-nodes/llm) - 根据情感调整 AI 回复
- [条件分支](/zh-hans/guide/workflow/nodes/action-nodes/if) - 根据情感分析结果分流
- [AI 分类器](/zh-hans/guide/workflow/nodes/action-nodes/ai-classifier) - 情感加分类的组合使用

## 相关资源

- [HTTP 请求节点](/zh-hans/guide/workflow/nodes/action-nodes/http-request) - 发送情感分析结果到外部系统
- [代码节点](/zh-hans/guide/workflow/nodes/action-nodes/code) - 处理和统计情感分析结果
- [表达式语法](/zh-hans/guide/expressions/) - 学习如何访问情感分析结果
