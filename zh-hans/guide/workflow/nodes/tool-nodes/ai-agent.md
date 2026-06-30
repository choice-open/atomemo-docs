---
title: AI Agent 工具节点
description: 提供可被调用的 AI Agent 能力，让父级 AI Agent 将任务委派给专业子 Agent 处理
---

# AI Agent 工具节点

AI Agent 工具节点将 AI Agent 能力封装为可调用的工具。与作为工作流主 Agent 的 [AI Agent Action 节点](/zh-hans/guide/workflow/nodes/action-nodes/ai-agent) 不同，Tool 版本注册为工具，由父级 AI Agent 根据需求自主调用，处理特定的子任务。这实现了多 Agent 协作和复杂任务拆分。

## 核心概念

### 什么是 AI Agent 工具？

AI Agent 工具是一个专业化的子 Agent，具备以下特征：

- **任务委派** — 父级 AI Agent 将特定子任务委派给它
- **自主执行** — 独立推理、调用自身工具、完成分配的任务
- **结果返回** — 将执行结果返回给父级 AI Agent 进行汇总
- **嵌套能力** — 可以注册自己的子工具，支持深层 Agent 层级

### 多 Agent 协作模式

```
用户输入 → 父级 AI Agent（路由器 / 编排器）
  ├─ 分析任务，决定调用哪些子 Agent
  ├─ 子 Agent 1（数据获取专家）
  │   └─ 调用：HTTP 请求工具、代码工具
  ├─ 子 Agent 2（分析专家）
  │   └─ 调用：代码工具、知识检索工具
  └─ 父 Agent 综合所有结果 → 最终回答
```

## 使用场景

### 典型应用

- **多源数据汇总** — 子 Agent 从不同平台获取数据，父 Agent 汇总整合
- **复杂任务拆分** — 将大型任务分解为多个专业子任务，由各自的子 Agent 处理
- **领域专家路由** — 根据用户意图路由到销售专家、技术专家、账号专家等子 Agent
- **跨系统编排** — 每个子 Agent 负责与特定外部系统的集成
- **质量保证流程** — 一个 Agent 生成内容，另一个审核，第三个优化

## Tool 与 Action 版本对比

| 特性 | AI Agent Action 节点 | AI Agent 工具节点 |
| --- | --- | --- |
| 角色 | 工作流中的主 Agent | 被调用的子 Agent |
| 执行方式 | 工作流中直接执行 | 由父级 AI Agent 按需调用 |
| 流式输出 | 支持 | 不支持（必须返回完整结果） |
| 结构化输出 | 支持 JSON Schema | 不支持（工具返回统一结果） |
| 工具连接 | 可连接 Tool 节点 | 同样可连接自己的 Tool 节点 |
| 模型选择 | 显式选择模型 | 显式选择或 Auto 模式（基于 credit） |
| 提示词编写 | 手动输入 | 手动输入或 AI 辅助（"Let the model define this parameter"） |

## 节点配置

### 基础设置

#### 工具调用名称 (toolName)

父级 AI Agent 用于调用此工具的唯一标识符。

**字段属性**：

- 必填字段
- 同一工作流内必须唯一
- 不支持表达式
- 格式要求：
  - 只能包含字母、数字和下划线
  - 必须以字母开头
  - 不能与工作流中其他工具节点的调用名称重复
  - **重复名称会在 UI 中标红显示错误**

**默认值**：`AI_AGENT_TOOL`

**配置示例**：

```javascript
// 1. 默认名称
toolName: "AI_AGENT_TOOL"

// 2. 描述性工具名称
toolName: "sales_expert_agent"

// 3. 领域特化名称
toolName: "data_fetching_subagent"

// 4. 角色导向名称
toolName: "order_processing_agent"
```

**命名建议**：

- **使用 UPPER_SNAKE_CASE 或 lower_snake_case**：`AI_AGENT_TOOL` 或 `sales_expert`
- **见名知义**：名称应清晰表达子 Agent 的角色
- **避免过长**：建议在 30 个字符以内
- **避免连字符**：仅允许字母、数字和下划线

**重要提示**：

- 父级 AI Agent 通过工具调用名称（而非节点名称）识别和调用工具
- 工具调用名称必须在工作流中唯一，重复会在 UI 中标红显示

#### 工具描述 (toolDescription)

描述该工具的目的和职责范围。父级 AI Agent 根据此描述判断何时将任务委派给此子 Agent。

**字段属性**：

- 必填字段
- 支持表达式
- 支持多行文本

**配置示例**：

```javascript
// 1. 明确的角色定义
toolDescription: `销售专家子 Agent。

职责范围：
- 处理产品咨询和推荐
- 计算价格和折扣
- 检查库存可用性
- 处理订单相关问题

何时调用：
- 用户询问产品、价格或订单
- 用户需要产品对比或推荐
- 用户需要购买决策帮助`

// 2. 数据汇总 Agent
toolDescription: `多平台数据汇总 Agent。

职责范围：
- 从 CRM 系统获取客户数据
- 从电商平台获取订单历史
- 从客服系统查询工单记录

父 Agent 应提供：
- customer_id: 客户标识
- data_requirements: 需要获取的数据类型

返回整合后的客户档案，包含所有收集到的数据。`

// 3. 内容审核 Agent
toolDescription: `内容质量审核子 Agent。

职责范围：
- 审核生成内容的准确性
- 检查语气和品牌一致性
- 标记潜在问题或改进建议

何时调用：
- AI 生成的内容需要在发送给用户前进行质量检查
- 回复草稿需要润色`
```

**最佳实践**：

- **定义清晰边界**：此子 Agent 处理什么 vs. 父 Agent 应处理什么
- **列出输入期望**：父 Agent 应提供哪些信息
- **描述输出**：此子 Agent 返回什么类型的结果
- **使用指导**：父 Agent 何时应该（和不应该）调用此工具

#### 模型 (model)

选择此子 Agent 使用的 LLM 模型，或使用 Auto 模式。

**连接方式**：

- **连接模型节点**：通过将模型节点连接到 AI Agent 工具节点来显式选择特定模型
- **Auto 模式（默认）**：如果未连接模型节点，系统自动选择合适的模型

**Auto 模式行为**：

- 运行时会从组织账户余额中扣除 credit
- 如果组织 credit 耗尽，工具调用将失败并显示错误：

```
"Your token quota has been exceeded. Please contact support to increase
your quota or wait for your quota to reset at the start of the next
billing cycle"
```

**模型选择建议**：

```yaml
复杂推理任务: GPT-4, Claude 3 Opus
均衡性能: GPT-3.5-turbo, Claude 3 Sonnet
对成本敏感的简单任务: GPT-3.5-turbo, Claude 3 Haiku
```

#### 用户提示 (userPrompt)

父级 AI Agent 传递给此子 Agent 的任务或输入（必填）。

**字段属性**：

- 必填字段
- 支持表达式
- 支持多行文本
- **AI 辅助编写**：点击 "Let the model define this parameter" 让 AI 自动生成提示词

**配置示例**：

```javascript
// 1. 接收父 Agent 委派的任务
userPrompt: $("父 Agent").delegatedTask

// 2. 携带父 Agent 收集的上下文
userPrompt: `客户咨询: ${$("父 Agent").customerQuery}

目前已收集的客户数据:
- ID: ${$("父 Agent").customerId}
- 客户分层: ${$("父 Agent").customerSegment}

请分析并提供建议。`

// 3. 通过 "Let the model define this parameter" 按钮由 AI 定义的提示词
userPrompt: "你是一个销售专家。分析客户需求并从可用产品目录中推荐合适的产品。"
```

#### 系统提示 (systemPrompt)

定义子 Agent 的角色、能力、约束和行为准则。

**字段属性**：

- 可选字段
- 支持表达式
- 支持多行文本
- **AI 辅助编写**：点击 "Let the model define this parameter" 让 AI 自动生成系统提示词

**配置示例**：

```javascript
// 1. 销售专家
systemPrompt: `你是一个销售专家子 Agent。

你的角色:
- 分析客户购买意向
- 推荐符合需求的产品
- 计算价格和适用折扣
- 客观对比产品

你的约束:
- 只推荐有库存的产品
- 不超出客户声明的预算
- 不做出公司无法兑现的承诺
- 标记复杂案例供人工审核

回复格式:
- 产品推荐及理由
- 价格明细
- 后续步骤建议`

// 2. 数据汇总 Agent
systemPrompt: `你是一个数据汇总子 Agent。

你的角色:
- 接收父 Agent 的数据需求
- 调用相应的数据源工具
- 将结果整合为统一格式
- 标记任何数据不一致或缺失

你的约束:
- 只访问有权限获取的数据
- 不修改任何源数据
- 透明地向父 Agent 报告错误
- 在 ${maxIterations} 轮工具调用后超时`
```

#### 最大迭代次数 (maxIterations)

此子 Agent 最多可以执行多少轮工具调用。

**字段属性**：

- 数字类型
- 默认值：`3`

**配置建议**：

```yaml
简单子任务: 2-3 次
中等复杂度: 5-8 次
复杂多工具任务: 10-15 次
```

### 连接子工具节点

AI Agent 工具节点支持**嵌套工具连接** — 与主 AI Agent Action 节点一样，它们可以连接自己的 Tool 节点：

```
父级 AI Agent
  └─ AI Agent 工具节点（数据专家）
       ├─ HTTP 请求工具（CRM API）
       ├─ HTTP 请求工具（电商 API）
       └─ 代码工具（数据转换）
```

**连接规则**：

1. AI Agent 工具节点底部有 "Tool" 端口
2. 可连接到任何 Tool 节点（代码工具、HTTP 请求工具、实体识别工具等）
3. 也可以连接到**其他 AI Agent 工具节点**（深层嵌套，需谨慎使用）
4. 子 Agent 自主决定调用其连接的哪些工具

### 高级设置

#### 总是输出 (alwaysOutput)

执行失败时是否也输出空项。

**默认**：`false`

#### 仅执行一次 (executeOnce)

是否仅使用第一个输入项执行一次。

**默认**：`false`

#### 失败重试 (retryOnFail)

执行失败时是否自动重试。

**默认**：`false`

#### 最大重试次数 (maxTries)

失败后最多重试几次。

**默认**：`3`

#### 重试间隔 (waitBetweenTries)

重试之间的等待时间（毫秒）。

**默认**：`1000`（1 秒）

#### 错误处理 (onError)

如何处理执行失败。

**可选值**：

- `stopWorkflow` — 停止整个工作流（默认）
- `continueRegularOutput` — 继续正常输出
- `continueErrorOutput` — 继续并输出错误

## 输出数据

AI Agent 工具节点将其最终回答作为统一输出返回给父级 AI Agent：

```javascript
// 父 Agent 访问子 Agent 的输出
$("AI Agent Tool").output
$("AI Agent Tool").answer

// 执行元数据（如果有）
$("AI Agent Tool").toolsUsed   // 子 Agent 使用的工具列表
$("AI Agent Tool").iterations  // 子 Agent 执行的迭代次数
```

:::warning 注意
与 AI Agent Action 节点不同，Tool 版本**不支持**流式输出和结构化 JSON 输出。作为工具，它必须返回完整结果，供父 Agent 直接使用。
:::

## 工作流示例

### 示例 1：多源数据汇总

```
Chat 触发器
  → AI Agent 节点（主编排器）
    System Prompt: "你是客服编排器。从多个数据源收集信息，提供全面的回答。"
    User Prompt: $('Chat Trigger').message
    Max Iterations: 3

    Tools:
      └─ AI Agent 工具节点（数据汇总器）
           toolName: "data_aggregator"
           toolDescription: "从 CRM、订单和客服系统获取客户数据并进行整合。输入: customer_id。返回整合的客户档案。"
           User Prompt: "获取客户 ${$('父 Agent').customerId} 的所有可用数据"
           System Prompt: "你是数据汇总专家。查询所有可用数据源并整合为单一档案。"

           Sub-Tools:
             ├─ HTTP 请求工具 → CRM API
             ├─ HTTP 请求工具 → 订单历史 API
             └─ HTTP 请求工具 → 工单 API

  → Answer 节点

用户: "告诉我客户 #C12345 的所有信息"
父 Agent: 委派给 data_aggregator
子 Agent:
  1. 调用 CRM API → 获取客户档案
  2. 调用订单历史 API → 获取 15 个订单
  3. 调用工单 API → 获取 3 个工单
  4. 返回整合的客户档案
父 Agent: 综合为自然语言回复
```

### 示例 2：领域专家路由

```
Chat 触发器
  → AI Agent 节点（路由器）
    System Prompt: "你是路由 Agent。分类用户请求并委派给合适的专家子 Agent。"
    User Prompt: $('Chat Trigger').message
    Max Iterations: 1

    Tools:
      ├─ AI Agent 工具节点（销售专家）
      │    toolName: "sales_expert"
      │    toolDescription: "处理产品咨询、定价、推荐和购买决策。"
      │    System Prompt: "你是销售专家。帮助客户找到合适的产品。"
      │    User Prompt: $('路由器').delegatedTask
      │
      └─ AI Agent 工具节点（技术支持专家）
           toolName: "tech_support_expert"
           toolDescription: "处理技术问题、故障排查和设置指导。"
           System Prompt: "你是技术支持专家。"
           User Prompt: $('路由器').delegatedTask
           Sub-Tools:
             ├─ HTTP 请求工具 → 知识库 API
             └─ HTTP 请求工具 → 工单系统 API

  → Answer 节点

用户: "导出报告时 App 一直崩溃"
路由器: 分类为技术支持 → 委派给 tech_support_expert
技术支持专家:
  1. 调用知识库 API → 找到相关文章
  2. 诊断问题
  3. 返回解决步骤
路由器: 返回格式化回答给用户
```

### 示例 3：内容生成 + 审核流程

```
Chat 触发器
  → AI Agent 节点（内容编排器）
    System Prompt: "你是内容经理。生成内容并通过质量审核流程。"
    User Prompt: $('Chat Trigger').message

    Tools:
      ├─ AI Agent 工具节点（内容创作者）
      │    toolName: "content_writer"
      │    toolDescription: "根据需求起草内容。输入: topic, tone, length 要求。"
      │    System Prompt: "你是专业内容创作者。创作引人入胜、准确的内容。"
      │    User Prompt: "撰写关于: ${$('内容编排器').topic} 的内容"
      │
      └─ AI Agent 工具节点（内容审核员）
           toolName: "content_reviewer"
           toolDescription: "审核内容的准确性、语气和品牌一致性。输入: draft_content。返回审核后的内容及建议。"
           System Prompt: "你是内容审核员。检查准确性、品牌一致性和可读性。返回审核后的内容及必要修改。"
           User Prompt: "请审核此草稿: ${$('content_writer').output}"

  → Answer 节点

用户: "为我们的新功能创建产品公告"
内容编排器:
  1. 调用 content_writer → 获取草稿
  2. 调用 content_reviewer（传入草稿）→ 获取审核版本
  3. 返回润色后的公告
```

### 示例 4：跨平台订单处理

```
Chat 触发器
  → AI Agent 节点（订单编排器）
    System Prompt: "你负责处理跨多个平台的复杂订单操作。"

    Tools:
      ├─ AI Agent 工具节点（库存 Agent）
      │    toolName: "inventory_agent"
      │    toolDescription: "查询所有仓库的库存。输入: product_ids。返回各仓库的可用性。"
      │    System Prompt: "查询所有仓库系统的库存。"
      │    User Prompt: "查询库存: ${$('订单编排器').productIds}"
      │    Sub-Tools:
      │      ├─ HTTP 请求工具 → 仓库 A API
      │      ├─ HTTP 请求工具 → 仓库 B API
      │      └─ 代码工具 → 合并和对比结果
      │
      └─ AI Agent 工具节点（履约 Agent）
           toolName: "fulfillment_agent"
           toolDescription: "基于库存结果创建履约订单。输入: order_details, inventory_results。"
           System Prompt: "根据库存可用性创建最优履约计划。"
           User Prompt: "为订单 ${$('订单编排器').orderId} 创建履约，使用: ${$('inventory_agent').output}"
           Sub-Tools:
             └─ HTTP 请求工具 → 履约 API

  → Answer 节点

用户: "处理订单 #ORD-500，商品 [SKU-1, SKU-2]"
订单编排器:
  1. 调用 inventory_agent → 获取仓库可用性
  2. 调用 fulfillment_agent（传入库存结果）→ 创建发货单
  3. 返回履约摘要给用户
```

## 最佳实践

### 1. 定义清晰的角色边界

```javascript
// 好的做法：明确范围
toolDescription: `销售专家子 Agent。
处理：产品咨询、定价、推荐。
不处理：技术支持、账号管理、账单问题。
何时调用：用户询问产品相关或想要购买时。`

// 不好的做法：模糊范围
toolDescription: "帮忙处理事情"  // 父 Agent 不知道何时调用
```

### 2. 保持子任务聚焦

每个 AI Agent 工具应有单一、明确的职责：

```javascript
// 好的做法：聚焦的 Agent
AI Agent 工具 1: "从 CRM 获取客户数据"
AI Agent 工具 2: "分析购买历史并推荐产品"
AI Agent 工具 3: "生成个性化邮件内容"

// 不好的做法：过载的 Agent
AI Agent 工具 1: "获取数据、分析、生成内容、发送邮件、记录结果"
```

### 3. 管理嵌套深度

避免过深的 Agent 层级：

```yaml
推荐: 1-2 层嵌套
  父 Agent → 子 Agent → Tool 节点

谨慎: 3 层
  父 Agent → 子 Agent → 孙 Agent → Tool 节点

避免: 4 层以上
  调试和延迟变得困难
```

### 4. 合理设置 maxIterations

```javascript
// 子 Agent 的迭代次数应计入其自身的工具调用
简单子 Agent（1-2 个数据源）:    maxIterations = 2-3
中等子 Agent（3-5 个工具）:      maxIterations = 5-8
复杂子 Agent（多步骤逻辑）:      maxIterations = 10-15

// 父 Agent 的迭代次数应计入子 Agent 调用
// 每次子 Agent 调用算作父 Agent 的一次迭代
```

### 5. 在 User Prompt 中提供充足上下文

```javascript
// 好的做法：传递给子 Agent 丰富的上下文
userPrompt: `任务: 分析客户 ${customerId} 的追加销售机会。

客户档案:
- 分层: 企业版
- 当前套餐: Premium
- 使用量: 套餐上限的 85%
- 最近工单: 本月 3 个

可追加销售的产品:
${JSON.stringify(availableProducts)}

提供: 前 3 个推荐及理由。`

// 不好的做法：上下文不足
userPrompt: "分析客户"  // 子 Agent 没有信息可供使用
```

### 6. 使用 AI 辅助编写提示词

对于复杂的子 Agent 角色，使用 "Let the model define this parameter" 按钮：

1. 在**工具描述**中描述子 Agent 的用途
2. 点击**系统提示**上的 AI 按钮，自动生成全面的系统提示词
3. 点击**用户提示**上的 AI 按钮，自动生成接收任务的模板
4. 审核并优化生成的提示词

### 7. 监控 Credit 消耗

Auto 模式的子 Agent 在运行时消耗 credit：

```javascript
// 通过工作流日志监控
System Prompt: `每次子 Agent 调用后，记录:
- 调用了哪个子 Agent
- 使用了多少次迭代
- 使用 Auto 模式还是显式模型`
```

## 常见问题

### Q1: 何时使用 AI Agent 工具 vs. 普通 Tool 节点？

**A**：

| 场景 | 使用 |
| --- | --- |
| 简单数据获取或计算 | 代码工具 / HTTP 请求工具 |
| 需要推理和多步骤决策 | AI Agent 工具 |
| 固定逻辑，始终相同流程 | 代码工具 |
| 需要判断的动态任务 | AI Agent 工具 |
| 单次 API 调用 | HTTP 请求工具 |
| 多源汇总并综合分析 | AI Agent 工具 |

### Q2: 子 Agent 可以调用另一个子 Agent 吗？

**A**：可以。AI Agent 工具节点可以连接其他 AI Agent 工具节点，实现嵌套 Agent 层级。但请注意：

- **保持深度 ≤ 2 层**以便维护
- 每层嵌套都会增加延迟
- 深度嵌套的 Agent 更难调试
- 考虑一个配备更多工具的单个 Agent 是否可以达到同样效果

### Q3: 父 Agent 如何知道子 Agent 能做什么？

**A**：父 Agent 完全依赖 **toolDescription** 字段。把它当作给另一个开发者的 API 文档来写：

```javascript
toolDescription: `从所有平台获取整合的客户档案。

父 Agent 应提供:
- customer_id (string): 客户标识
- platforms (string array, 可选): 查询哪些平台，默认全部

返回:
- profile: 合并数据后的客户档案对象
- data_sources: 成功查询的平台列表
- errors: 查询失败的平台列表

何时调用: 需要跨所有系统获取客户完整视图时。`
```

### Q4: 为什么不支持流式输出和结构化输出？

**A**：作为工具，AI Agent 工具必须返回**完整结果**，供父 Agent 一次性使用。流式输出会延迟父 Agent 的执行，而结构化输出不是必需的，因为父 Agent 可以解析自然语言结果。

如果需要子 Agent 返回结构化数据，在系统提示中指示它以特定格式返回：

```javascript
systemPrompt: `始终在回复末尾附带 JSON 摘要块：
\`\`\`json
{
  "primary_intent": "...",
  "confidence": 0.0-1.0,
  "actions_taken": [...],
  "requires_followup": true/false
}
\`\`\``
```

### Q5: 子 Agent 失败怎么办？

**A**：取决于**错误处理**设置：

- `stopWorkflow`（默认）：整个工作流停止
- `continueRegularOutput`：父 Agent 收到错误，可以决定如何处理
- `continueErrorOutput`：父 Agent 收到错误详情

**推荐方式**：

```javascript
// 父 Agent 系统提示
systemPrompt: `如果子 Agent 返回错误:
1. 不要向用户暴露技术错误
2. 如有替代方案，尝试其他方法
3. 如果无法继续，礼貌地说明情况
4. 适当时转人工支持`
```

### Q6: 嵌套 Agent 的 credit 计费如何工作？

**A**：每个使用 Auto 模式的 AI Agent 工具独立消耗 credit：

```
父 Agent（显式模型）         → 向模型提供商计费
  └─ 子 Agent 1（auto 模式）    → 从组织 credit 扣除
       └─ 子 Agent 2（auto 模式） → 从组织 credit 扣除
```

控制成本的建议：
- 使用显式模型以获得可预测的计费
- 为每个 Agent 设置合理的 `maxIterations`
- 监控 credit 消耗模式
- 对简单的子任务使用更简单的模型

## 下一步

- [AI Agent Action 节点](/zh-hans/guide/workflow/nodes/action-nodes/ai-agent) — 了解主 AI Agent 节点
- [子工作流工具节点](/zh-hans/guide/workflow/nodes/tool-nodes/subflow) — 将子流程注册为 AI 可调用的工具
- [思考工具节点](/zh-hans/guide/workflow/nodes/tool-nodes/think) — 添加结构化推理能力
- [MCP 客户端工具节点](/zh-hans/guide/workflow/nodes/tool-nodes/mcp-client) — 连接外部 MCP 服务器工具
- [代码工具节点](/zh-hans/guide/workflow/nodes/tool-nodes/code) — 为子 Agent 添加自定义代码工具
- [HTTP 请求工具节点](/zh-hans/guide/workflow/nodes/tool-nodes/http-request) — 为子 Agent 提供 API 访问能力

## 相关资源

- [使用节点](/zh-hans/guide/working-with-nodes) — 了解节点类型和连接方式
- [Chat 触发器节点](/zh-hans/guide/workflow/nodes/trigger-nodes/chat) — 构建对话式多 Agent 系统
- [表达式语法](/zh-hans/guide/expressions/) — 在父 Agent 和子 Agent 之间传递数据
