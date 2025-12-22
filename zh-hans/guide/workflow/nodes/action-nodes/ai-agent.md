---
title: AI Agent 节点
description: 构建智能 AI Agent，让 AI 自主调用工具完成复杂任务
---

# AI Agent 节点

AI Agent 节点是构建智能 AI 代理的核心节点。它允许 AI 根据用户需求自主决定调用哪些工具、如何组合工具，以完成复杂的任务。这是实现真正智能化、自主化 AI 助手的关键。

## 核心概念

### 什么是 AI Agent？

AI Agent 不是简单地执行预定义的流程，而是：
- **自主决策** - AI 根据任务需求决定做什么
- **工具调用** - AI 可以调用多个工具获取信息或执行操作
- **多步推理** - AI 可以执行多轮思考和工具调用
- **目标导向** - AI 专注于完成用户的目标

**传统流程 vs AI Agent**:
```
传统流程 (固定):
用户输入 → 调用 API A → 调用 API B → 返回结果

AI Agent (智能):
用户输入 → AI 分析需求
  → 需要天气信息? 调用天气 API
  → 需要订单信息? 调用订单 API
  → 需要计算? 调用计算工具
  → 综合信息，返回结果
```

### AI Agent 的工作流程

1. **接收用户请求** - 用户提出问题或任务
2. **理解意图** - AI 分析用户真正想要什么
3. **规划行动** - AI 决定需要调用哪些工具
4. **执行工具** - 逐个或组合调用工具
5. **综合结果** - 整合所有信息
6. **生成回答** - 以自然语言返回给用户

## 使用场景

### 典型应用
- **智能客服** - 自动查询订单、库存、物流等信息
- **个人助理** - 管理日程、发送邮件、查询信息
- **数据分析助手** - 查询数据、生成图表、分析趋势
- **开发助手** - 搜索文档、生成代码、执行测试
- **业务流程自动化** - 根据业务规则自动处理任务
- **多渠道集成** - 跨多个系统协调工作

## 节点配置

### 基础设置(参数面板)

#### 模型 (model)

选择用于 AI Agent 的大语言模型。

**字段属性**:
- 必填字段
- 支持主流 LLM 提供商

**推荐模型**:
```yaml
GPT-4: 最强推理能力，适合复杂 Agent 任务
GPT-3.5-turbo: 性价比高，适合简单 Agent
Claude 3 Opus: 强大的工具调用能力，长文本处理
Claude 3 Sonnet: 平衡性能，适合大多数场景
```

**选择建议**:
- **复杂任务**: GPT-4, Claude 3 Opus (更好的推理和工具选择)
- **简单任务**: GPT-3.5, Claude 3 Haiku (更快更便宜)
- **工具较多**: GPT-4, Claude 3 系列 (更准确的工具选择)

#### 用户提示 (userPrompt)

用户的输入或任务描述。

**字段属性**:
- 必填字段
- 支持表达式

**配置示例**:

```javascript
// 1. 从 Chat Trigger 获取
userPrompt: $('Chat Trigger').message

// 2. 从 Webhook 获取
userPrompt: $('Webhook Trigger').body.query

// 3. 组合上下文
userPrompt: `用户问题: ${$('Chat Trigger').message}

用户信息:
- ID: ${$('Chat Trigger').userId}
- 会员等级: ${$('User Info').vipLevel}

请根据用户等级提供个性化服务。`

// 4. 多轮对话
userPrompt: $('Chat Trigger').conversationHistory
```

#### 启用系统提示 (enableSystemPrompt)

是否使用系统提示词来定义 Agent 的角色和行为。

**字段属性**:
- 布尔值
- 默认值: `false`

#### 系统提示 (systemPrompt)

定义 AI Agent 的角色、能力、限制和行为准则。

**字段属性**:
- 可选字段(需要启用 enableSystemPrompt)
- 支持表达式
- 支持多行文本

**配置示例**:

```javascript
// 1. 基础角色定义
systemPrompt: `你是一个智能客服助手。

你的能力:
- 查询订单状态
- 查询产品库存
- 解答常见问题
- 处理退换货请求

你的限制:
- 不能直接修改订单
- 不能透露其他用户信息
- 遇到复杂问题应转人工

你的风格:
- 友好、专业、耐心
- 回答简洁明了
- 主动提供帮助`

// 2. 详细的工作流程
systemPrompt: `你是订单处理助手。

工作流程:
1. 首先确认用户身份和订单号
2. 查询订单状态
3. 根据状态决定下一步:
   - 如果已发货: 提供物流信息
   - 如果未发货: 说明原因和预计时间
   - 如果异常: 提供解决方案
4. 询问是否还需要其他帮助

注意事项:
- 敏感操作需要二次确认
- 记录所有查询和操作
- 异常情况立即上报`

// 3. 带上下文的动态提示
systemPrompt: `你是 ${$('Config').companyName} 的智能助手。

当前时间: ${new Date().toISOString()}
用户等级: ${$('User Info').vipLevel}
可用工具: 订单查询、库存查询、价格计算

根据用户等级调整服务:
- VIP: 优先处理，提供专属优惠
- 普通: 标准服务
- 新用户: 引导和教育`
```

#### 结构化输出 (structuredOutput)

是否要求 AI Agent 返回结构化的 JSON 数据。

**字段属性**:
- 布尔值
- 默认值: `false`

**使用场景**:
- 需要提取特定信息
- 需要后续节点处理
- 需要保存到数据库

#### JSON Schema (jsonSchema)

定义结构化输出的数据格式。

**字段属性**:
- 可选字段(需要启用 structuredOutput)
- 支持完整的 JSON Schema 规范

**配置示例**:

```json
{
  "type": "object",
  "properties": {
    "intent": {
      "type": "string",
      "description": "用户意图",
      "enum": ["查询订单", "查询库存", "咨询价格", "投诉建议"]
    },
    "orderId": {
      "type": "string",
      "description": "订单号(如果涉及订单)"
    },
    "summary": {
      "type": "string",
      "description": "对话总结"
    },
    "toolsUsed": {
      "type": "array",
      "description": "使用的工具列表",
      "items": {"type": "string"}
    },
    "needsHumanSupport": {
      "type": "boolean",
      "description": "是否需要人工支持"
    }
  }
}
```

#### 最大迭代次数 (maxIterations)

AI Agent 最多可以执行多少轮工具调用。

**字段属性**:
- 数字类型
- 默认值: `3`

**说明**:
- 每次工具调用算一次迭代
- 防止 Agent 陷入无限循环
- 超过限制会停止执行

**配置建议**:
```yaml
简单任务: 2-3 次 (查询1-2个信息源)
中等复杂: 5-8 次 (多个工具组合)
复杂任务: 10-15 次 (多步骤推理)
```

#### 流式输出 (stream)

是否启用流式输出(逐字返回)。

**字段属性**:
- 布尔值
- 默认值: `false`

**使用场景**:
- 实时对话体验
- 长文本生成
- 提升用户体验

### 连接工具节点

AI Agent 节点的特殊之处在于可以连接多个 Tool 节点：

```
                    → Code Tool (计算器)
                    ↓
AI Agent Node  → Entity Recognition Tool (提取信息)
                    ↓
                    → HTTP Request Tool (查询 API)
```

**连接方式**:
1. AI Agent 节点底部有 "Tool" 端口
2. 将 Tool 端口连接到各个 Tool 节点的顶部
3. AI 会自动发现所有连接的工具
4. AI 根据工具描述决定调用哪个

### 高级设置(设置面板)

#### 总是输出 (alwaysOutput)
执行失败时是否也输出空项。**默认**: `false`

#### 仅执行一次 (executeOnce)
是否仅使用第一个输入项执行一次。**默认**: `false`

#### 失败重试 (retryOnFail)
执行失败时是否自动重试。**默认**: `false`

#### 最大重试次数 (maxTries)
失败后最多重试几次。**默认**: `3`

#### 重试间隔 (waitBetweenTries)
重试之间的等待时间(毫秒)。**默认**: `1000`

#### 错误处理 (onError)
如何处理执行失败。

**可选值**:
- `stopWorkflow` - 停止整个工作流(默认)
- `continueRegularOutput` - 继续执行
- `continueErrorOutput` - 继续并输出错误

## 输出数据

AI Agent 节点的输出包含:

```javascript
// 1. AI 的最终回答
$('AI Agent').output
$('AI Agent').answer

// 2. 如果启用结构化输出
$('AI Agent').structuredData.intent
$('AI Agent').structuredData.orderId

// 3. 执行信息(可能包含)
$('AI Agent').toolsUsed      // 使用的工具列表
$('AI Agent').iterations     // 执行的迭代次数
$('AI Agent').thinkingProcess // 思考过程(如果启用)
```

## 工作流示例

### 示例 1: 智能客服助手

```
Chat Trigger
  → AI Agent Node
    Model: GPT-4
    System Prompt: "你是客服助手，可以查询订单、库存、处理退换货。"
    User Prompt: $('Chat Trigger').message
    Max Iterations: 5

    Tools:
      → HTTP Request Tool (查询订单)
        Tool Description: "根据订单号查询订单详情。输入: orderId。返回: 订单对象。"
        URL: "https://api.example.com/orders/{orderId}"

      → HTTP Request Tool (查询库存)
        Tool Description: "查询商品库存。输入: productId。返回: quantity。"
        URL: "https://api.example.com/inventory/{productId}"

      → HTTP Request Tool (创建退货)
        Tool Description: "创建退货申请。输入: orderId, reason。返回: refundId。"
        URL: "https://api.example.com/refunds"
        Method: POST

  → Answer Node
    Answer: $('AI Agent').output

对话示例:
用户: "我的订单 #12345 还没到，能退货吗?"
AI 执行流程:
  1. 调用"查询订单"工具 → 获取订单信息
  2. 检查订单状态 → 发现已发货
  3. 回复: "您的订单已发货，预计明天送达。如果到时未收到，我可以帮您处理。"

用户: "算了，我不等了，直接退货"
AI 执行流程:
  1. 调用"创建退货"工具 → 创建退货申请
  2. 回复: "已为您创建退货申请，退款单号 #R67890..."
```

### 示例 2: 数据分析助手

```
Chat Trigger
  → AI Agent Node
    Model: GPT-4
    System Prompt: "你是数据分析助手，可以查询数据、生成图表、分析趋势。"
    User Prompt: $('Chat Trigger').message

    Tools:
      → HTTP Request Tool (查询销售数据)
        Tool Description: "查询指定时间范围的销售数据。输入: startDate, endDate。"

      → Code Tool (数据分析)
        Tool Description: "分析销售数据，计算增长率、趋势等。输入: salesData。"
        Code: |
          def main(salesData):
              # 分析逻辑
              growth_rate = calculate_growth(salesData)
              trend = analyze_trend(salesData)
              return {
                  "growth_rate": growth_rate,
                  "trend": trend
              }

      → Code Tool (生成图表)
        Tool Description: "根据数据生成图表URL。输入: data, chartType。"

  → Answer Node

用户: "分析一下上个月的销售情况"
AI 执行:
  1. 调用"查询销售数据"(startDate="2024-01-01", endDate="2024-01-31")
  2. 调用"数据分析"(salesData=查询结果)
  3. 调用"生成图表"(data=分析结果, chartType="line")
  4. 综合回答: "上月销售额xxx元，环比增长15%...[图表]"
```

### 示例 3: 多步骤任务执行

```
Chat Trigger
  → AI Agent Node
    Model: GPT-4
    System Prompt: `你是自动化助手，可以执行多步骤任务。

任务类型:
- 数据同步: 从A系统获取数据，转换格式，保存到B系统
- 报表生成: 收集数据，分析，生成报表，发送邮件
- 批量处理: 获取列表，逐个处理，记录结果

执行要求:
- 显示当前进度
- 处理错误继续执行
- 最后提供总结`

    Tools:
      → HTTP Request Tool (获取数据)
      → Code Tool (转换数据)
      → HTTP Request Tool (保存数据)
      → HTTP Request Tool (发送通知)

  → Answer Node

用户: "把A系统的用户数据同步到B系统"
AI 执行:
  1. 调用"获取数据" → 获取用户列表
  2. 调用"转换数据" → 转换格式
  3. 对每个用户调用"保存数据"
  4. 调用"发送通知" → 通知完成
  5. 回复: "同步完成，共处理 150 个用户，成功 148 个，失败 2 个..."
```

### 示例 4: 智能决策助手

```
Chat Trigger
  → Entity Recognition Tool (提取需求)
    Tool Description: "从用户消息中提取需求信息。"

  → AI Agent Node
    Model: GPT-4
    System Prompt: `你是产品推荐助手。

决策流程:
1. 理解用户需求(预算、特性、用途)
2. 查询库存和价格
3. 根据需求筛选产品
4. 比较和排序
5. 推荐最合适的3-5款
6. 解释推荐理由`

    User Prompt: `用户需求: ${$('Entity Recognition Tool')}
请为用户推荐合适的产品。`

    Tools:
      → HTTP Request Tool (搜索产品)
      → HTTP Request Tool (查询价格)
      → HTTP Request Tool (查询库存)
      → Code Tool (评分排序)

  → Answer Node

用户: "我想买个笔记本，预算8000左右，主要写代码，要轻薄"
AI 执行:
  1. 调用"搜索产品"(category="笔记本", priceRange=[7000, 9000])
  2. 调用"查询库存"(批量查询)
  3. 调用"评分排序"(按需求打分)
  4. 综合推荐: "根据您的需求，我推荐以下几款..."
```

### 示例 5: 结构化输出用于后续处理

```
Chat Trigger
  → AI Agent Node
    Model: GPT-4
    System Prompt: "你是工单处理助手，分析用户问题并创建工单。"
    User Prompt: $('Chat Trigger').message
    Structured Output: true
    JSON Schema: {
      properties: {
        category: {type: "string", enum: ["技术问题", "账号问题", "支付问题", "其他"]},
        priority: {type: "string", enum: ["低", "中", "高", "紧急"]},
        summary: {type: "string"},
        needsInfo: {type: "array", items: {type: "string"}},
        suggestedSolution: {type: "string"}
      }
    }

    Tools:
      → HTTP Request Tool (查询历史工单)
      → HTTP Request Tool (查询用户信息)
      → Entity Recognition Tool (提取问题详情)

  → Code Node (验证和处理)
    Code: |
      const ticket = $('AI Agent').structuredData;

      // 自动分配处理人
      const assignee = assignTicket(ticket.category, ticket.priority);

      return {
        ...ticket,
        assignee,
        ticketId: generateTicketId(),
        createdAt: new Date().toISOString()
      };

  → HTTP Request Node (创建工单)
    URL: "https://api.example.com/tickets"
    Method: POST
    Body: $('Code').output

  → Answer Node
    Answer: `工单已创建:
ID: ${$('Code').ticketId}
类别: ${$('AI Agent').structuredData.category}
优先级: ${$('AI Agent').structuredData.priority}
处理人: ${$('Code').assignee}
预计响应时间: 2小时`

用户: "登录一直失败，显示密码错误，但我确定密码是对的，很着急"
AI 分析并输出:
{
  category: "账号问题",
  priority: "高",  // 识别到"很着急"
  summary: "用户无法登录，疑似账号锁定",
  needsInfo: ["用户ID", "最后登录时间"],
  suggestedSolution: "检查账号状态，可能需要重置密码"
}
```

## 最佳实践

### 1. 编写清晰的 System Prompt

```javascript
// 好的 System Prompt
systemPrompt: `你是客服助手。

你的角色:
- 帮助用户查询订单
- 解答产品问题
- 处理简单的售后

你的能力(工具):
- 查询订单状态
- 查询产品信息
- 查询物流信息

你的限制:
- 不能修改订单
- 不能直接退款
- 复杂问题转人工

工作流程:
1. 先确认用户身份
2. 理解用户问题
3. 使用合适的工具获取信息
4. 提供清晰的答案
5. 询问是否还需要帮助

注意事项:
- 保护用户隐私
- 记录所有操作
- 敏感操作需确认`

// 不好的 System Prompt
systemPrompt: "你是客服"  // 太简单，Agent 不知道该做什么
```

### 2. 为每个工具写好描述

```javascript
// 好的工具描述
HTTP Request Tool
  Tool Description: `查询订单详细信息。

输入参数:
- orderId: 订单号(必填，格式: ORD-XXXXX)

返回数据:
- orderStatus: 订单状态("pending"|"shipped"|"delivered"|"cancelled")
- items: 商品列表
- totalAmount: 订单总额
- shippingInfo: 物流信息(如果已发货)

使用场景:
- 用户询问"我的订单在哪"
- 用户提供订单号
- 需要查看订单详情时

示例:
用户: "订单 ORD-12345 到哪了?"
AI 调用: queryOrder(orderId="ORD-12345")`

// 不好的工具描述
Tool Description: "查询订单"  // 信息太少，AI 不知道何时调用
```

### 3. 合理设置 maxIterations

```javascript
// 根据任务复杂度设置
简单查询: maxIterations = 2-3
// 查询1-2个信息源就够了

中等任务: maxIterations = 5-8
// 可能需要多个工具组合

复杂任务: maxIterations = 10-15
// 多步骤推理和验证

// 监控实际使用
Code Node
  Code: |
    const agent = $('AI Agent');
    if (agent.iterations >= maxIterations * 0.8) {
      console.warn('Agent 接近迭代上限');
    }
    return agent;
```

### 4. 处理工具调用失败

```javascript
System Prompt: `当工具调用失败时:
1. 不要直接暴露技术错误给用户
2. 尝试使用替代方案
3. 如果无法继续，礼貌地说明情况
4. 提供人工支持选项

示例:
如果订单查询失败:
不要说: "API 返回 500 错误"
应该说: "抱歉，暂时无法查询订单信息，请稍后重试或联系人工客服"`

// 在后续节点验证
Code Node
  Code: |
    const agent = $('AI Agent');

    // 检查是否有工具失败
    if (agent.toolErrors && agent.toolErrors.length > 0) {
      // 记录错误
      logErrors(agent.toolErrors);

      // 发送警报
      if (agent.toolErrors.length >= 3) {
        sendAlert('AI Agent 工具调用频繁失败');
      }
    }

    return agent;
```

### 5. 使用结构化输出用于自动化

```javascript
// 结构化输出 + 条件分支
AI Agent
  Structured Output: true
  JSON Schema: {
    properties: {
      needsHumanSupport: {type: "boolean"},
      urgency: {type: "string", enum: ["low", "medium", "high"]},
      category: {type: "string"}
    }
  }

Conditional Branch
  → [needsHumanSupport === true] → 转人工
  → [urgency === "high"] → 立即处理
  → [urgency === "medium"] → 正常队列
  → [urgency === "low"] → 延迟处理
```

### 6. 监控和优化

```javascript
// 记录 Agent 执行情况
Code Node
  Code: |
    return {
      sessionId: $('Chat Trigger').sessionId,
      userMessage: $('Chat Trigger').message,
      agentOutput: $('AI Agent').output,
      toolsUsed: $('AI Agent').toolsUsed,
      iterations: $('AI Agent').iterations,
      executionTime: $('AI Agent').executionTime,
      model: $('AI Agent').model,
      timestamp: new Date().toISOString()
    };

HTTP Request Node
  URL: "https://api.example.com/agent-logs"
  Method: POST
  Body: $('Code').output

// 定期分析日志:
// - 哪些工具使用最频繁?
// - 平均需要几次迭代?
// - 哪些场景 Agent 表现不好?
// - 用户满意度如何?
```

### 7. 成本控制

```javascript
// 1. 使用合适的模型
简单任务: GPT-3.5-turbo  // 便宜
复杂任务: GPT-4  // 贵但准确

// 2. 控制迭代次数
maxIterations: 5  // 防止过多调用

// 3. 缓存常见查询
Code Tool
  Tool Description: "查询FAQ，返回缓存的答案"
  Code: |
    const cache = {
      "营业时间": "...",
      "退货政策": "...",
      // ...
    };
    if (cache[question]) {
      return {cached: true, answer: cache[question]};
    }

// 4. 监控成本
Code Node
  Code: |
    const cost = estimateCost(
      model: 'gpt-4',
      inputTokens: 500,
      outputTokens: 200,
      toolCalls: 3
    );

    if (cost > threshold) {
      sendAlert('Agent 成本过高');
    }
```

## 常见问题

### Q1: AI Agent 和 LLM 节点有什么区别?

**A**:

| 特性 | LLM 节点 | AI Agent 节点 |
|------|---------|--------------|
| 功能 | 纯文本生成 | 文本生成 + 工具调用 |
| 工具调用 | 不支持 | 核心功能 |
| 多步推理 | 单轮 | 多轮迭代 |
| 适用场景 | 对话、内容生成 | 复杂任务、自动化 |
| 自主性 | 无，按提示生成 | 高，自主决策 |

**选择建议**:
- 只需要文本回复 → 使用 **LLM 节点**
- 需要查询数据、执行操作 → 使用 **AI Agent 节点**

### Q2: AI Agent 如何选择调用哪个工具?

**A**:
AI 根据以下因素决定:
1. **工具描述** - 工具功能是否匹配需求
2. **当前上下文** - 对话中提到了什么
3. **任务目标** - 完成任务需要什么信息
4. **之前的调用** - 已经获取了什么信息

**优化工具选择**:
- 工具描述要详细明确
- 说明使用场景和示例
- 区分相似工具的差异
- 避免工具功能重叠

### Q3: AI Agent 会陷入无限循环吗?

**A**:
有保护机制:
1. **maxIterations** - 限制最大迭代次数
2. **超时机制** - 执行时间上限
3. **重复检测** - 检测是否重复调用同一工具

**预防措施**:
```javascript
System Prompt: `工具调用规则:
- 同一工具不要重复调用超过2次
- 如果获取不到需要的信息，不要继续尝试
- 3次迭代内无法完成任务，说明情况并转人工`

maxIterations: 5  // 设置合理上限
```

### Q4: 如何处理工具返回的大量数据?

**A**:

**方案 1: 使用 Code Tool 预处理**
```
HTTP Request Tool (返回大量数据)
  → Code Tool (提取关键信息)
    Code: |
      def main(apiResponse):
          # 只返回AI需要的字段
          return {
              "summary": extract_summary(apiResponse),
              "key_points": extract_key_points(apiResponse)
          }
```

**方案 2: 在工具描述中说明**
```javascript
Tool Description: `查询产品列表。
返回: 最多10个产品，包含 id, name, price, inStock
注意: 数据已经过滤，只返回有库存的产品`
```

**方案 3: 分页查询**
```javascript
Tool Description: `搜索产品，支持分页。
输入: query, page (默认1), limit (默认10)
返回: products 数组，totalCount，hasMore`
```

### Q5: AI Agent 的响应速度慢怎么办?

**A**:

**优化策略**:

**1. 使用更快的模型**
```javascript
简单场景: GPT-3.5-turbo, Claude 3 Haiku
// 响应更快
```

**2. 减少工具数量**
```javascript
// 只注册必要的工具，不超过5-8个
// 工具太多会增加选择时间
```

**3. 优化工具性能**
```javascript
// 确保工具 API 响应快
// 使用缓存
// 避免工具内部的复杂计算
```

**4. 启用流式输出**
```javascript
stream: true
// 边生成边返回，提升用户体验
```

**5. 异步处理**
```javascript
// 对于非紧急任务，后台处理
System Prompt: "如果任务需要较长时间，告诉用户'正在处理，稍后通知您'"
```

### Q6: 如何调试 AI Agent?

**A**:

**调试技巧**:

**1. 启用详细日志**
```javascript
Code Node (在 Agent 之后)
  Code: |
    const agent = $('AI Agent');
    console.log('===== AI AGENT DEBUG =====');
    console.log('Input:', $('Chat Trigger').message);
    console.log('Tools used:', agent.toolsUsed);
    console.log('Iterations:', agent.iterations);
    console.log('Tool calls:', JSON.stringify(agent.toolCalls, null, 2));
    console.log('Output:', agent.output);
    console.log('==========================');
    return agent;
```

**2. 测试单个工具**
```
// 先单独测试每个工具是否正常工作
Manual Trigger
  → HTTP Request Tool (测试工具)
  → Code Node (查看输出)
```

**3. 简化场景测试**
```javascript
// 从简单场景开始
userPrompt: "查询订单 ORD-12345"  // 明确的单一任务

// 逐步增加复杂度
userPrompt: "我的订单到哪了? 如果还没发货能加急吗?"
```

**4. 查看中间步骤**
```javascript
// 如果模型支持，启用 verbose 模式
// 查看 Agent 的思考过程
```

### Q7: 多个 AI Agent 可以协作吗?

**A**:
可以！创建 Agent 工作流:

```
Chat Trigger
  → AI Agent 1 (路由 Agent)
    System Prompt: "你是路由助手，分析用户问题类型，决定由哪个专家处理。"
    Structured Output: true
    JSON Schema: {
      properties: {
        expertType: {enum: ["sales", "tech", "account"]}
      }
    }

  → Conditional Branch
    → [expertType === "sales"] → AI Agent 2 (销售专家)
      Tools: [产品查询, 价格计算, 库存查询]

    → [expertType === "tech"] → AI Agent 3 (技术专家)
      Tools: [问题诊断, 日志查询, 解决方案]

    → [expertType === "account"] → AI Agent 4 (账号专家)
      Tools: [用户查询, 权限管理, 密码重置]

  → Answer Node
```

### Q8: AI Agent 如何处理敏感信息?

**A**:

**安全措施**:

**1. 在 System Prompt 中明确规则**
```javascript
systemPrompt: `安全规则:
- 不要显示完整的密码、信用卡号
- 用户信息需要验证身份后才能查询
- 不要记录敏感操作日志到公共渠道
- 敏感操作需要二次确认`
```

**2. 工具层面控制**
```javascript
// 工具描述中说明权限要求
Tool Description: `查询用户详细信息(需要管理员权限)。
输入: userId, adminToken
返回: 用户完整信息(包含敏感数据)`

// 在工具内验证
Code Tool
  Code: |
    def main(userId, adminToken):
        if not verify_admin(adminToken):
            return {"error": "无权限"}
        return query_user(userId)
```

**3. 输出过滤**
```javascript
Code Node (在 Agent 之后)
  Code: |
    const output = $('AI Agent').output;

    // 过滤敏感信息
    const filtered = output
      .replace(/\d{4}-\d{4}-\d{4}-\d{4}/g, '****-****-****-****')  // 信用卡
      .replace(/password:\s*\S+/gi, 'password: ******');  // 密码

    return {output: filtered};
```

## 下一步

- [Code Tool 节点](/zh-hans/guide/workflow/nodes/tool-nodes/code) - 为 Agent 添加自定义工具
- [HTTP Request Tool 节点](/zh-hans/guide/workflow/nodes/tool-nodes/http-request) - 为 Agent 添加 API 调用能力
- [Entity Recognition Tool 节点](/zh-hans/guide/workflow/nodes/tool-nodes/entity-recognition) - 为 Agent 添加信息提取能力

## 相关资源

- [LLM 节点](/zh-hans/guide/workflow/nodes/action-nodes/llm) - 了解纯文本生成
- [Chat Trigger 节点](/zh-hans/guide/workflow/nodes/trigger-nodes/chat) - 构建对话式 Agent
- [表达式语法](/zh-hans/guide/expressions/) - 学习表达式的使用
