---
title: 知识检索节点
description: 从知识库中检索相关信息
---

# 知识检索节点

知识检索节点用于从预先构建的知识库中检索与查询相关的信息。它使用向量搜索技术，根据语义相似度返回最相关的知识片段，是构建 RAG（检索增强生成）系统的核心节点。

## 使用场景

### 典型应用
- **智能问答** - 从企业知识库中检索答案回答用户问题
- **文档检索** - 查找产品手册、技术文档中的相关内容
- **客服支持** - 检索常见问题和解决方案
- **内容推荐** - 根据用户查询推荐相关文章或资源
- **RAG 系统** - 为 LLM 提供上下文信息，增强生成质量
- **语义搜索** - 基于语义相似度而非关键词的智能搜索
- **知识发现** - 发现知识库中与特定主题相关的内容

## 节点配置

### 基础设置（参数面板）

#### 查询文本 (query)

要检索的查询内容。

**字段属性**:
- 必填字段
- 支持表达式
- 支持多行文本

**配置示例**:

```javascript
// 1. 引用用户问题
$('聊天触发器').message

// 2. 引用 Webhook 数据
$('Webhook触发器').body.question

// 3. 使用提取的实体
$('实体识别').query

// 4. 拼接多个字段构建查询
`${$('AI分类器').class} ${$('聊天触发器').keywords}`

// 5. 使用代码节点处理后的查询
$('代码').processedQuery
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
"kb_product_manual_2024"

// 2. 根据分类动态选择
$('AI分类器').class === "technical"
  ? "kb_technical_docs"
  : "kb_general_faq"

// 3. 从配置中读取
$('配置').knowledgeBaseId
```

### 高级设置（设置面板）

#### 节点描述 (nodeDescription)

为节点添加自定义描述。

```yaml
nodeDescription: "从产品手册检索相关内容"
```

## 输出数据

知识检索节点返回匹配的知识片段数组，每个片段包含内容和相关度评分。

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
$('知识检索').results

// 获取第一个结果的内容
$('知识检索').results[0].content

// 获取第一个结果的相关度
$('知识检索').results[0].score

// 获取结果数量
$('知识检索').results.length

// 获取元数据
$('知识检索').results[0].metadata.source
$('知识检索').results[0].metadata.title

// 获取原始查询
$('知识检索').query
```

## 工作流示例

### 示例 1: 基础知识问答

```
聊天触发器
  → 知识检索节点
    查询: $('聊天触发器').message
    知识库: "kb_company_faq"
  → 条件分支
    条件: $('知识检索').results.length > 0
    → [True] → LLM节点
      系统提示词: "根据以下知识库内容回答用户问题"
      上下文: $('知识检索').results[0].content
      用户问题: $('聊天触发器').message
      → 回答节点
    → [False] → 回答节点
      回答: "抱歉，我没有找到相关信息，请换个方式提问或联系人工客服。"
```

### 示例 2: 高质量结果筛选

```
聊天触发器
  → 知识检索节点
    查询: $('聊天触发器').message
    知识库: "kb_technical_docs"
  → 条件分支
    条件 (AND):
      - $('知识检索').results.length > 0
      - $('知识检索').results[0].score >= 0.7
    → [True] → LLM节点
      提示词: `基于以下高相关度内容回答问题：

      ${$('知识检索').results[0].content}

      问题：${$('聊天触发器').message}`
      → 回答节点
    → [False] → 回答节点
      回答: "找到了一些相关信息，但相关度较低。建议您：
      1. 尝试使用不同的关键词
      2. 提供更多背景信息
      3. 联系专业客服获取帮助"
```

### 示例 3: 多结果综合回答

```
聊天触发器
  → 知识检索节点
    查询: $('聊天触发器').message
    知识库: "kb_product_info"
  → 代码节点
    输入:
      - results: $('知识检索').results
    代码:
      function main({results}) {
          // 筛选高分结果
          const highScoreResults = results.filter(r => r.score >= 0.6)

          // 限制数量
          const topResults = highScoreResults.slice(0, 3)

          // 格式化为上下文
          const context = topResults
              .map((r, i) => `[来源 ${i+1}]: ${r.content}`)
              .join('\n\n')

          return {
              context,
              count: topResults.length
          }
      }
    输出:
      - context: string
      - count: number
  → LLM节点
    提示词: `基于以下 ${$('代码').count} 条知识库内容综合回答用户问题：

    ${$('代码').context}

    问题：${$('聊天触发器').message}

    要求：
    1. 综合多个来源的信息
    2. 如果来源之间有矛盾，请指出
    3. 标注信息来源`
    → 回答节点
```

### 示例 4: 动态知识库选择

```
聊天触发器
  → AI分类器
    输入: $('聊天触发器').message
    类别: ["产品咨询", "技术支持", "售后服务", "一般问题"]
  → 代码节点
    输入:
      - category: $('AI分类器').class
    代码:
      function main({category}) {
          const knowledgeBaseMap = {
              "产品咨询": "kb_product_catalog",
              "技术支持": "kb_technical_docs",
              "售后服务": "kb_after_sales",
              "一般问题": "kb_general_faq"
          }

          return {
              knowledgeBaseId: knowledgeBaseMap[category] || "kb_general_faq"
          }
      }
    输出:
      - knowledgeBaseId: string
  → 知识检索节点
    查询: $('聊天触发器').message
    知识库: $('代码').knowledgeBaseId
  → LLM节点 → 回答节点
```

### 示例 5: 结果来源标注

```
聊天触发器
  → 知识检索节点
    查询: $('聊天触发器').message
    知识库: "kb_documentation"
  → 代码节点
    输入:
      - results: $('知识检索').results
    代码:
      function main({results}) {
          if (results.length === 0) {
              return {
                  hasResults: false,
                  formattedAnswer: ""
              }
          }

          const topResult = results[0]
          const answer = `${topResult.content}\n\n---\n来源：${topResult.metadata.title}\n页码：${topResult.metadata.page}\n相关度：${(topResult.score * 100).toFixed(0)}%`

          return {
              hasResults: true,
              formattedAnswer: answer,
              sourceUrl: topResult.metadata.url
          }
      }
    输出:
      - hasResults: boolean
      - formattedAnswer: string
      - sourceUrl: string
  → 条件分支
    条件: $('代码').hasResults === true
    → [True] → 回答节点
      回答: `${$('代码').formattedAnswer}

查看完整文档：${$('代码').sourceUrl}`
    → [False] → 回答节点
      回答: "未找到相关信息"
```

### 示例 6: 相似问题推荐

```
聊天触发器
  → 知识检索节点
    查询: $('聊天触发器').message
    知识库: "kb_faq"
  → 代码节点
    输入:
      - results: $('知识检索').results
      - userQuery: $('聊天触发器').message
    代码:
      function main({results, userQuery}) {
          if (results.length === 0) {
              return {
                  answer: "未找到相关信息",
                  suggestions: []
              }
          }

          const mainResult = results[0]

          // 如果最高分数很高，直接返回答案
          if (mainResult.score >= 0.85) {
              return {
                  answer: mainResult.content,
                  suggestions: []
              }
          }

          // 如果分数中等，提供答案和相关问题
          if (mainResult.score >= 0.6) {
              const suggestions = results
                  .slice(1, 4)
                  .map(r => r.metadata.title)

              return {
                  answer: mainResult.content,
                  suggestions
              }
          }

          // 如果分数较低，只提供相关问题建议
          const suggestions = results
              .slice(0, 5)
              .map(r => r.metadata.title)

          return {
              answer: "未找到精确匹配，您可能想问：",
              suggestions
          }
      }
    输出:
      - answer: string
      - suggestions: array[string]
  → 回答节点
    回答: `${$('代码').answer}

${$('代码').suggestions.length > 0
  ? '\n相关问题：\n' + $('代码').suggestions.map((s, i) => `${i+1}. ${s}`).join('\n')
  : ''}`
```

### 示例 7: 多知识库联合检索

```
聊天触发器
  → 知识检索节点 A
    查询: $('聊天触发器').message
    知识库: "kb_internal_docs"
  → 知识检索节点 B
    查询: $('聊天触发器').message
    知识库: "kb_public_docs"
  → 代码节点
    输入:
      - resultsA: $('知识检索节点A').results
      - resultsB: $('知识检索节点B').results
    代码:
      function main({resultsA, resultsB}) {
          // 合并结果
          const allResults = [
              ...resultsA.map(r => ({...r, source: 'internal'})),
              ...resultsB.map(r => ({...r, source: 'public'}))
          ]

          // 按分数排序
          allResults.sort((a, b) => b.score - a.score)

          // 取前5个
          const topResults = allResults.slice(0, 5)

          // 格式化
          const context = topResults
              .map(r => `[${r.source}] ${r.content}`)
              .join('\n\n')

          return {context}
      }
    输出:
      - context: string
  → LLM节点 → 回答节点
```

### 示例 8: 语义缓存优化

```
聊天触发器
  → 代码节点（查询缓存）
    输入:
      - query: $('聊天触发器').message
    代码:
      // 简化示例：实际应该连接缓存系统
      function main({query}) {
          const cache = {}  // 实际使用 Redis 等
          const cached = cache[query]

          return {
              hasCached: !!cached,
              cachedResult: cached || null
          }
      }
    输出:
      - hasCached: boolean
      - cachedResult: object
  → 条件分支
    条件: $('代码').hasCached === true
    → [True] → LLM节点（使用缓存结果）→ 回答节点
    → [False] → 知识检索节点
      查询: $('聊天触发器').message
      知识库: "kb_main"
      → 代码节点（保存到缓存）
      → LLM节点 → 回答节点
```

## 最佳实践

### 1. 优化查询文本

**清理和预处理查询**
```javascript
// 在代码节点中预处理查询
function main({userMessage}) {
    // 移除特殊字符
    let query = userMessage.replace(/[^\w\s\u4e00-\u9fa5]/g, '')

    // 移除停用词（根据语言）
    const stopWords = ['的', '了', '是', '在']
    query = query.split(' ')
        .filter(word => !stopWords.includes(word))
        .join(' ')

    // 限制长度
    query = query.slice(0, 500)

    return {processedQuery: query}
}
```

**提取关键信息**
```javascript
// 使用实体识别提取关键信息
聊天触发器
  → 实体识别节点（提取主题、产品名等）
  → 代码节点（构建精确查询）
    代码:
      function main({entities}) {
          // 组合实体构建查询
          const query = `${entities.product} ${entities.issue} ${entities.topic}`
          return {query: query.trim()}
      }
  → 知识检索节点
```

### 2. 处理检索结果

**检查结果质量**
```javascript
// 始终检查结果存在性和相关度
条件分支 (AND):
  - $('知识检索').results 不为空
  - $('知识检索').results[0].score >= 0.7
```

**过滤低分结果**
```javascript
function main({results}) {
    const MIN_SCORE = 0.6
    const filteredResults = results.filter(r => r.score >= MIN_SCORE)

    return {
        hasQualityResults: filteredResults.length > 0,
        qualityResults: filteredResults
    }
}
```

**处理无结果情况**
```javascript
// 提供有用的回退策略
条件分支: $('知识检索').results.length === 0
  → [True] → 回答节点
    回答: `未找到直接答案，但您可以：
    1. 查看我们的帮助中心：https://help.example.com
    2. 联系人工客服
    3. 尝试更具体的问题，如："如何重置密码"`
```

### 3. 结果格式化

**为 LLM 准备上下文**
```javascript
function main({results}) {
    // 格式化多个结果为结构化上下文
    const context = results
        .slice(0, 3)  // 只取前3个
        .map((r, i) => {
            return `## 参考资料 ${i+1} (相关度: ${(r.score * 100).toFixed(0)}%)

来源：${r.metadata.title}
内容：${r.content}

---`
        })
        .join('\n\n')

    return {formattedContext: context}
}
```

**添加来源信息**
```javascript
// 在回答中标注信息来源
`${$('LLM').output}

---
以上信息来自：
${$('知识检索').results
    .slice(0, 3)
    .map((r, i) => `${i+1}. ${r.metadata.title}`)
    .join('\n')}`
```

### 4. 知识库管理

**按主题分类知识库**
```yaml
# 维护多个专门知识库
kb_product_catalog: 产品目录
kb_technical_docs: 技术文档
kb_faq: 常见问题
kb_troubleshooting: 故障排除
```

**动态选择知识库**
```javascript
// 根据用户意图选择知识库
const knowledgeBaseMap = {
    "购买咨询": "kb_product_catalog",
    "技术问题": "kb_technical_docs",
    "常见问题": "kb_faq",
    "故障报修": "kb_troubleshooting"
}
```

### 5. 性能优化

**限制结果数量**
```javascript
// 只处理必要数量的结果
$('知识检索').results.slice(0, 5)
```

**实现查询缓存**
```javascript
// 缓存常见查询的结果
// 避免重复检索
```

**使用条件判断减少检索**
```javascript
// 对于简单问题，先尝试规则匹配
条件分支: 简单问题匹配
  → [True] → 直接回答（不检索）
  → [False] → 知识检索节点
```

### 6. 质量控制

**验证检索质量**
```javascript
function main({results, userQuery}) {
    const topScore = results[0]?.score || 0

    return {
        confidence: topScore >= 0.8 ? "high" :
                   topScore >= 0.6 ? "medium" : "low",
        recommendHuman: topScore < 0.6
    }
}
```

**记录检索日志**
```javascript
// 记录查询和结果用于改进
{
    query: $('聊天触发器').message,
    topScore: $('知识检索').results[0].score,
    resultCount: $('知识检索').results.length,
    timestamp: new Date().toISOString()
}
```

## 常见问题

### Q1: 知识检索节点返回什么数据？

**A**: 返回一个结果数组，每个结果包含：
- `content`: 匹配的文本内容
- `score`: 相关度评分（0-1之间）
- `metadata`: 元数据（来源、标题、页码等）

### Q2: 如何判断检索结果的质量？

**A**: 主要看 `score` 相关度评分：

```javascript
// 评分标准（仅供参考）
score >= 0.85  // 高度相关，可直接使用
score >= 0.70  // 相关，适合作为参考
score >= 0.50  // 可能相关，需要人工确认
score < 0.50   // 相关度低，不建议使用
```

### Q3: 检索结果为空怎么办？

**A**: 实现回退策略：

1. **提示用户改进查询**
   ```javascript
   "未找到相关信息，建议：
   - 使用不同的关键词
   - 提供更多上下文
   - 简化或拆分问题"
   ```

2. **提供替代选项**
   ```javascript
   "没有找到相关文档，您可以：
   - 查看帮助中心
   - 联系人工客服
   - 浏览常见问题"
   ```

3. **降低相关度阈值**（谨慎使用）

### Q4: 可以同时检索多个知识库吗？

**A**: 可以，使用多个知识检索节点：

```javascript
聊天触发器
  → 知识检索节点 A（知识库1）
  → 知识检索节点 B（知识库2）
  → 代码节点（合并和排序结果）
  → LLM节点
```

### Q5: 如何优化检索准确度？

**A**: 多方面优化：

1. **优化查询文本**
   - 提取关键词
   - 移除噪音
   - 使用实体识别

2. **改进知识库**
   - 优化文档分割
   - 添加元数据
   - 定期更新内容

3. **调整相关度阈值**
   - 根据业务需求设置
   - 平衡准确度和召回率

### Q6: 检索速度慢怎么办？

**A**: 优化方法：

1. **实现查询缓存**
   ```javascript
   // 缓存常见查询结果
   ```

2. **限制结果数量**
   ```javascript
   // 只获取必要数量的结果
   ```

3. **优化知识库**
   - 合理的文档大小
   - 适当的分块策略

### Q7: 如何将检索结果传给 LLM？

**A**: 格式化为清晰的上下文：

```javascript
// 在 LLM 节点的提示词中
`基于以下知识库内容回答问题：

${$('知识检索').results[0].content}

用户问题：${$('聊天触发器').message}

要求：
1. 基于提供的内容回答
2. 如果内容不足以回答，明确说明
3. 不要编造信息`
```

### Q8: 检索结果太多怎么办？

**A**: 限制和筛选：

```javascript
function main({results}) {
    // 只取高分结果
    const topResults = results
        .filter(r => r.score >= 0.7)
        .slice(0, 3)

    return {topResults}
}
```

### Q9: 如何处理多语言检索？

**A**:
1. 为不同语言创建独立知识库
2. 根据用户语言动态选择知识库
3. 或使用多语言向量模型（取决于系统支持）

## 下一步

- [LLM 节点](/zh-hans/guide/workflow/nodes/action-nodes/llm) - 将检索结果用于生成回答
- [AI 分类器](/zh-hans/guide/workflow/nodes/action-nodes/ai-classifier) - 根据问题类型选择知识库
- [实体识别节点](/zh-hans/guide/workflow/nodes/action-nodes/entity-recognition) - 提取关键信息优化查询

## 相关资源

- [条件分支](/zh-hans/guide/workflow/nodes/action-nodes/if) - 根据检索结果质量进行分支
- [代码节点](/zh-hans/guide/workflow/nodes/action-nodes/code) - 处理和格式化检索结果
- [表达式语法](/zh-hans/guide/expressions/) - 学习如何访问检索结果数据
