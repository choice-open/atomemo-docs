---
title: 子工作流工具节点
description: 为 AI 智能体提供调用子工作流的能力，由 AI 根据对话需求自主调用可复用模块
---

# 子工作流工具节点

子工作流工具节点将可复用的子工作流封装为 AI Agent 可调用的工具。与在固定工作流顺序中执行的 [执行子流程 Action 节点](/zh-hans/guide/workflow/nodes/action-nodes/execute-sub-workflow) 不同，Tool 版本注册为工具，由 AI Agent 在判断需要子工作流能力时自主调用。

> **前置条件**：目标子流程必须**已发布**（active 状态）且以 [Subflow 触发器](/zh-hans/guide/workflow/nodes/trigger-nodes/subflow) 作为入口。

## 使用场景

### 典型应用

- **模块化 AI 能力** — 将领域逻辑打包为子流程，作为 AI 可调用的工具暴露
- **可复用数据管道** — 构建一次数据获取 + 转换管道，让 AI Agent 按需调用
- **多步骤业务逻辑** — 将复杂业务流程（订单验证、欺诈检测）封装为工具
- **外部系统包装器** — 将多 API 编排包装为 AI 可调用的单一工具
- **共享工具集** — 集中常见操作（格式化、数据补充、通知）并在多个 AI Agent 间共享

## Tool 与 Action 版本对比

| 特性 | 执行子流程（Action） | 子工作流工具（Tool） |
| --- | --- | --- |
| 执行方式 | 工作流中直接执行 | AI Agent 按需调用 |
| 工具调用名称 / 工具描述 | ❌ 不适用 | ✅ 必填的工具身份 |
| 等待子流程完成 | ✅ 可开关 | ❌ 始终等待（同步，返回结果） |
| 失败重试 | ✅ 支持 | ❌ 不支持 |
| 子流程选择 | ✅ 下拉选择 | ✅ 下拉选择（相同） |
| 输入自动填充 | ✅ 根据 Schema | ✅ 根据 Schema（相同） |
| 节点分类 | Action 节点 | Tool 节点（连接 AI Agent） |

## 节点配置

### 基础设置

#### 工具调用名称 (toolName)

AI Agent 用于调用此工具的唯一标识符。

**字段属性**：

- 必填字段
- 同一工作流内必须唯一
- 不支持表达式
- 格式要求：
  - 只能包含字母、数字和下划线
  - 必须以字母开头
  - 不能与工作流中其他工具节点的调用名称重复
  - **重复名称会在 UI 中标红显示错误**

**默认值**：`SUBFLOW_TOOL`

**配置示例**：

```javascript
// 1. 默认名称
toolName: "SUBFLOW_TOOL"

// 2. 描述性工具名称
toolName: "validate_order"

// 3. 领域特化名称
toolName: "customer_lookup"

// 4. 操作导向名称
toolName: "calculate_shipping_cost"
```

**命名建议**：

- 使用描述性名称：`order_validator`、`customer_enrichment`、`fraud_check`
- 反映子流程的功能，而非实现方式
- 避免通用名称如 `subflow_1` 或 `tool_2`

#### 工具描述 (toolDescription)

描述该工具的功能和使用场景。父级 AI Agent 根据此描述判断何时调用子流程。

**字段属性**：

- 必填字段
- 支持表达式
- 支持多行文本

**配置示例**：

```javascript
// 1. 验证工具
toolDescription: `在处理前验证订单数据。

期望输入：
- orderId (string): 订单标识
- orderTotal (number): 订单总额
- customerId (string): 客户标识

返回：
- isValid (boolean): 订单是否通过验证
- errors (string array): 验证错误信息（如有）

何时调用：用户提交订单需要验证后才能继续处理时。`

// 2. 数据查询工具
toolDescription: `跨所有系统查询完整客户档案。

期望输入：
- customerId (string): 客户标识

返回：
- profile (object): 完整客户档案，包含订单、工单、偏好设置

何时调用：回答问题前需要全面了解客户时。`

// 3. 多步骤处理工具
toolDescription: `计算配送选项和费用。

期望输入：
- items (array): 商品列表，含 productId 和 quantity
- destination (string): 收货地址邮编

返回：
- options (array): 可用配送方式及费用和预计到达时间
- recommended (object): 推荐的配送选项

何时调用：用户询问配送费用或送达时间时。`
```

**最佳实践**：

- **清晰描述输入**：AI Agent 应向子流程传递什么
- **描述输出**：AI Agent 将收到什么返回结果
- **说明调用时机**：帮助 AI Agent 判断何时适合调用此工具
- **区分相似工具**：如果有多个子流程工具，确保它们的功能范围不重叠

#### 选择子流程 (subflowId)

从下拉列表中选择要调用的子流程。仅显示**已发布（active）且包含 [Subflow 触发器](/zh-hans/guide/workflow/nodes/trigger-nodes/subflow)** 的工作流。

**选择前**：其他设置（除工具调用名称和工具描述外）均隐藏。
**选择后**：根据子流程定义的输入 Schema 自动填充输入字段。

> 节点始终调用所选子流程的**最新 active 版本**。如果子流程的触发器被更改（例如替换为 Webhook 触发器），节点将在运行时报错，因为该子流程不再可被调用。

#### 输入参数 (inputs)

选择子流程后，其预期的输入参数会被自动读取并显示。每个输入是一个键值对：

| 字段 | 说明 |
| --- | --- |
| **Variable**（变量名） | 子流程中定义的输入名称 |
| **Value**（值） | 要传递的值 — 支持 [表达式](/zh-hans/guide/expressions/) |

**支持的输入类型**：
- `text` — 字符串
- `number` — 数值
- `array` — 列表/数组
- `object` — JSON 对象
- `boolean` — `true` / `false`
- `datetime` — 日期时间

**从 AI Agent 传递数据**：

被 AI Agent 调用时，Agent 从对话上下文中提取参数值并传递给子流程。你也可以使用表达式从上游节点传递数据：

```javascript
// 引用上游节点输出
$('Chat 触发器').body.userId

// 传递字面值
"active"

// 传递数值
42
```

**必填输入**：如果子流程定义了必填输入，AI Agent 必须能够从对话中提取这些值，或通过表达式预配置。

### 高级设置

#### 错误处理 (onError)

如何处理子流程执行失败。

**可选值**：

- `stopWorkflow` — 停止整个工作流（默认）
- `continueRegularOutput` — 继续正常输出
- `continueErrorOutput` — 继续并输出错误

#### 节点描述 (nodeDescription)

为节点添加自定义描述，说明工具的用途：

```yaml
nodeDescription: "验证传入订单。返回 { isValid: boolean, errors: string[] }。"
```

## 输出数据

子工作流工具始终等待子流程完成后将其输出返回给调用方 AI Agent。输出结构由被调用子流程中的 [Subflow Output](/zh-hans/guide/workflow/nodes/action-nodes/output) 节点定义。

```javascript
// 父级 AI Agent 接收子流程输出
$("子工作流工具").isValid
$("子工作流工具").customerProfile
$("子工作流工具").shippingOptions
```

:::warning 注意
与 Action 版本不同，子工作流工具**没有**"等待子流程完成"开关。它始终同步执行——子流程运行至完成，结果返回给 AI Agent。
:::

## 工作原理

### 执行流程

```
父工作流：
  Chat 触发器
    → AI Agent 节点
        Tools: [子工作流工具（订单验证器）]
    → Answer 节点

AI 对话过程：
  用户: "能帮我验证订单 #ORD-500 吗？"
  AI Agent:
    1. 识别验证需求
    2. 调用子工作流工具，传入 { orderId: "ORD-500" }
    3. 子流程执行：
         Subflow 触发器 ← 接收输入
           → 处理节点
           → Subflow Output ← 打包结果
    4. 收到 { isValid: true, errors: [] }
    5. 回复: "订单 #ORD-500 已验证通过，可以继续处理。"
```

### 版本选择

节点始终调用所选子流程的**最新 active（已发布）版本**。如果子流程被取消发布或触发器类型被更改为非 Subflow 触发器，节点将在运行时报错 "Subflow not found"。

## 工作流示例

### 示例 1：订单验证工具

```
Chat 触发器
  → AI Agent 节点
    System Prompt: "你是订单处理助手。在确认订单前进行验证。"
    User Prompt: $('Chat 触发器').message

    Tools:
      └─ 子工作流工具（订单验证器）
           toolName: "validate_order"
           toolDescription: "验证订单数据。输入: orderId, orderTotal, customerId。返回: isValid, errors。"
           子流程: "订单验证器"（已发布）
           输入:
             orderId: (AI 从对话中提取)
             orderTotal: (AI 从对话中提取)
             customerId: $('Chat 触发器').customerId

  → Answer 节点

用户: "能帮我处理订单 #ORD-500 吗，总额 $299？"
AI Agent:
  1. 调用 validate_order(orderId="ORD-500", orderTotal=299, customerId="C12345")
  2. 子流程返回: { isValid: true, errors: [] }
  3. 回复: "订单 #ORD-500 验证通过，正在处理。"
```

### 示例 2：客户数据补充

```
Chat 触发器
  → AI Agent 节点
    System Prompt: "你是客服 Agent。在回答客户问题前先查询客户数据。"
    User Prompt: $('Chat 触发器').message

    Tools:
      └─ 子工作流工具（客户查询）
           toolName: "customer_lookup"
           toolDescription: "从所有系统获取完整客户档案。输入: customerId。返回: 包含订单、工单、偏好的客户档案。"
           子流程: "客户数据补充"（已发布）
           输入:
             customerId: $('Chat 触发器').customerId

  → Answer 节点

用户: "我最近的订单状态如何？"
AI Agent:
  1. 调用 customer_lookup(customerId="C12345")
  2. 收到包含 5 个最近订单和 2 个工单的档案
  3. 回复所有订单状态的个性化摘要
```

### 示例 3：多工具 AI Agent 配合子流程

```
Chat 触发器
  → AI Agent 节点
    System Prompt: "你是电商助手。使用可用工具帮助客户。"
    User Prompt: $('Chat 触发器').message

    Tools:
      ├─ 子工作流工具（配送计算器）
      │    toolName: "calculate_shipping"
      │    toolDescription: "计算配送选项和费用。输入: items, destination。返回: 含费用的配送选项。"
      │
      ├─ 子工作流工具（订单验证器）
      │    toolName: "validate_order"
      │    toolDescription: "处理前验证订单。输入: orderId, orderTotal, customerId。返回: isValid, errors。"
      │
      └─ HTTP 请求工具（支付 API）
           toolName: "process_payment"
           toolDescription: "处理订单支付。输入: orderId, amount。返回: transactionId, status。"

  → Answer 节点

用户: "我想买 [商品1, 商品2]，配送到 200120"
AI Agent:
  1. 调用 calculate_shipping(items=[商品1, 商品2], destination="200120")
  2. 向用户展示配送选项
  3. 用户: "标准配送就行"
  4. 调用 validate_order(orderTotal=149, ...)
  5. 调用 process_payment(orderId="ORD-600", amount=149)
  6. 确认订单已下达
```

### 示例 4：复杂业务流程作为工具

```
子流程 "欺诈检测"（已发布）：
  Subflow 触发器
    → HTTP 请求（风险评估 API）
    → HTTP 请求（订单历史 API）
    → 代码节点（计算风险评分）
    → Subflow Output { score, flags, recommendation }

父工作流：
  Chat 触发器
    → AI Agent 节点
      System Prompt: "你是订单处理 Agent。对高价值订单执行欺诈检测。"
      User Prompt: $('Chat 触发器').message

      Tools:
        └─ 子工作流工具（欺诈检测）
             toolName: "fraud_check"
             toolDescription: "执行全面欺诈分析。输入: orderId, customerId, orderTotal。返回: score (0-100), flags, recommendation (approve/review/reject)。"
             子流程: "欺诈检测"
             输入:
               orderId: (AI 提取)
               customerId: (AI 提取)
               orderTotal: (AI 提取)

    → Answer 节点

用户: "处理订单 #ORD-999，$5,000"
AI Agent: "高价值订单——先执行欺诈检测。"
  → 调用 fraud_check → 返回 { score: 12, flags: [], recommendation: "approve" }
  → "欺诈检测通过。正在继续处理您的订单。"
```

## 最佳实践

### 1. 工具名称要有描述性

让工具名称与子流程的用途匹配：

```javascript
// 好的做法
toolName: "order_validator"
toolName: "customer_enrichment"
toolName: "fraud_check"

// 不好的做法
toolName: "SUBFLOW_TOOL"  // 太通用
toolName: "tool_1"         // 无描述性
```

### 2. 编写详细的工具描述

工具描述是 AI Agent 判断何时调用此子流程的唯一依据：

```javascript
toolDescription: `根据业务规则验证传入订单。

检查项：
- 客户账号状态（活跃、已验证）
- 订单金额在信用额度内
- 5 分钟内无重复订单
- 所有商品有库存

AI Agent 应提供：
- orderId (string): 待验证的订单
- orderTotal (number): 预期订单金额
- customerId (string): 待检查的客户

返回：
- isValid (boolean): 通过/失败结果
- errors (string[]): 无效时的问题列表
- warnings (string[]): 非阻塞性问题

何时调用：
- 用户想要下单或确认订单
- 用户询问"我的订单有效吗"
- 高价值订单（超过 ¥500）

不要调用：
- 用户只是在浏览产品
- 用户询问历史订单（改用 customer_lookup）`
```

### 3. 先独立测试子流程

在将子流程注册为工具之前，使用其自身的 Subflow 触发器独立测试：

1. 创建包含 Subflow 触发器的子流程
2. 发布子流程
3. 通过触发器以手动输入测试
4. 验证 Subflow Output 符合预期
5. 然后在父级 AI Agent 工作流中注册为工具

### 4. 保持子流程聚焦

每个子流程工具应做好一件事：

```yaml
✅ 好的: "订单验证器" — 验证，返回通过/失败 + 错误
✅ 好的: "配送计算器" — 计算配送选项和费用
✅ 好的: "客户查询" — 获取客户档案

❌ 不好的: "订单处理器" — 验证、计算配送、处理支付、发送邮件
```

### 5. 优雅处理错误

适当配置**错误处理**设置，并指导 AI Agent 如何处理失败：

```javascript
// AI Agent 系统提示
systemPrompt: `当子流程工具返回错误时:
1. 不要向用户暴露原始错误信息
2. 如有替代工具，尝试其他方法
3. 如果子流程无法完成，说明还需要什么信息
4. 对复杂问题提供转人工支持的选项`
```

### 6. 记录输出约定

使用节点描述字段记录子流程的返回内容：

```yaml
nodeDescription: "返回 { isValid: boolean, errors: string[], warnings: string[] }。
确认订单前先检查 `isValid`。`warnings` 为非阻塞性问题。"
```

## 常见问题

### Q1: 子工作流工具和执行子流程有什么区别？

**A**：

| 场景 | 使用 |
| --- | --- |
| 固定工作流顺序 | 执行子流程（Action） |
| AI Agent 决定何时调用 | 子工作流工具（Tool） |
| 需要发后即忘（异步） | 执行子流程（Action），关闭等待 |
| 始终需要结果 | 两者均可（Tool 始终等待） |
| 需要失败重试 | 执行子流程（Action） |

### Q2: AI Agent 可以多次调用同一个子流程吗？

**A**：可以。AI Agent 可以在一次对话中多次调用同一个子工作流工具，每次可能使用不同的输入。AI Agent 节点的 `maxIterations` 设置控制工具调用轮次的总数。

### Q3: AI Agent 如何知道要传递什么输入？

**A**：AI Agent 从以下来源提取参数值：

1. **工具描述** — 定义子流程期望的输入
2. **对话上下文** — 用户的消息和对话历史
3. **输入变量名称** — 见名知义的名称帮助 AI 映射值
4. **预配置值** — 如 `$('Chat 触发器').customerId` 的表达式自动传递

如果无法确定必填输入，AI Agent 通常会向用户询问澄清。

### Q4: 作为工具调用的子流程可以包含 AI Agent 节点吗？

**A**：可以。子流程可以包含任何节点，包括 AI Agent 节点。这支持复杂的多层 Agent 架构。但需要注意执行时间和成本——每增加一层都会带来延迟和潜在的 credit 消耗。

### Q5: 为什么 Tool 版本没有"等待"开关？

**A**：作为 AI Agent 调用的工具，子流程必须返回结果供 Agent 使用。发后即忘的执行在工具上下文中没有意义——Agent 需要输出来继续推理。如果需要异步执行，请使用执行子流程 Action 节点。

### Q6: 如果子流程被取消发布会怎样？

**A**：节点将在运行时报错 "Subflow not found"。错误根据**错误处理**设置处理。始终确保被任何 Tool 或 Action 节点引用的子流程保持已发布状态。

### Q7: 可以从上游节点向子流程传递数据吗？

**A**：可以。在输入值字段中使用表达式：

```javascript
// 从上游节点传递数据
$('HTTP 请求').body.data
$('代码').processedResult

// 传递触发器上下文
$('Chat 触发器').customerId
$('Chat 触发器').sessionId

// AI 提取 + 预配置组合
// AI 从对话中提取 productId
// customerId 从触发器预配置
```

## 下一步

- [执行子流程 Action 节点](/zh-hans/guide/workflow/nodes/action-nodes/execute-sub-workflow) — 了解 Action 版本
- [Subflow 触发器](/zh-hans/guide/workflow/nodes/trigger-nodes/subflow) — 了解如何创建可被调用的子流程
- [Subflow Output](/zh-hans/guide/workflow/nodes/action-nodes/output) — 了解子流程如何返回结果
- [AI Agent 工具节点](/zh-hans/guide/workflow/nodes/tool-nodes/ai-agent) — 将任务委派给专业子 Agent
- [思考工具节点](/zh-hans/guide/workflow/nodes/tool-nodes/think) — 为 AI Agent 添加结构化推理能力

## 相关资源

- [AI Agent 节点](/zh-hans/guide/workflow/nodes/action-nodes/ai-agent) — 了解 AI Agent 配置
- [代码工具节点](/zh-hans/guide/workflow/nodes/tool-nodes/code) — 添加自定义代码工具
- [HTTP 请求工具节点](/zh-hans/guide/workflow/nodes/tool-nodes/http-request) — 提供 API 访问能力
