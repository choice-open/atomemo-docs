---
title: Subflow 触发器
description: 当被其他工作流调用时触发执行，支持工作流编排和模块化设计
---

# Subflow 触发器

Subflow 触发器（"被另一个工作流执行时"）允许将工作流作为可复用的模块被其他工作流调用。你可以将复杂逻辑拆分为可复用的组件——"父"工作流调用"子"工作流并传入数据，子工作流处理完成后返回结果。

## 使用场景

### 典型应用
- **工作流编排** - 将多个工作流串联成更大的流程
- **逻辑复用** - 将共享逻辑（如数据验证、通知发送）提取为可调用模块
- **模块化架构** - 通过组合小而专注的工作流构建复杂系统
- **关注点分离** - 将不同业务领域放在独立的工作流中
- **跨团队协作** - 各团队独立构建和维护可互相调用的工作流
- **条件子处理** - 将特定任务路由到专用的子工作流

## 节点特点

### 基本特性
- **被其他工作流调用** - 当另一个工作流调用时触发
- **每个工作流唯一** - 每个工作流仅允许一个 Subflow 触发器（`maxNodes: 1`）
- **输入定义** - 定义父工作流可以传入的数据结构
- **父工作流列表** - 编辑器中直接显示哪些工作流调用了当前工作流
- **配合 Subflow Output** - 必须至少有一个 Subflow Output 节点来返回结果

### 内置输出字段

通过节点名称和变量名访问父工作流传入的数据：

```javascript
$('Subflow Trigger').variableName    // 访问输入变量
$('Subflow Trigger').customerId      // 示例：来自父工作流的客户 ID
$('Subflow Trigger').orderData       // 示例：来自父工作流的订单数据
```

## 节点配置

### 基础设置（参数面板）

#### 父工作流列表

参数面板顶部显示只读的引用列表，展示哪些工作流调用了当前工作流：

> *"这个工作流被以下工作流调用："*
> `[订单处理]` `[发票生成]`

这让你直观了解当前工作流在项目中的使用情况。

#### 输入数据模式

选择如何定义工作流期望从父工作流接收的数据结构：

**在下方定义字段**（`inputSchema`，默认）：

手动定义具名的输入变量并指定类型：

```yaml
inputSource: "inputSchema"
inputs:
  - variable: "customerName"
    type: "string"
  - variable: "orderTotal"
    type: "number"
  - variable: "isPriority"
    type: "boolean"
```

每个输入包含：
- **变量名（Variable）** — 表达式中访问该值的名称（如 `customerName`）
- **类型（Type）** — 数据类型（详见下方）

**JSON 示例**（`jsonExample`）：

提供一个 JSON 示例对象，系统会根据它推断输入结构：

```json
{
  "customerName": "张三",
  "orderTotal": 149.99,
  "isPriority": true,
  "items": ["item1", "item2"]
}
```

适合快速原型开发——粘贴一个真实的示例，工作流就会接受匹配的数据。

> **提示**：生产环境建议使用**在下方定义字段**模式——它为调用方提供明确的文档和类型安全保障。

#### 输入类型

使用**在下方定义字段**模式时，支持以下类型：

| 类型 | UI 显示 | 说明 |
| --- | --- | --- |
| `string` | 字符串 | 文本值 |
| `number` | 数字 | 数值 |
| `boolean` | 布尔值 | 真 / 假 |
| `object` | 对象 | JSON 对象 `{}` |
| `array[string]` | 数组[字符串] | 文本数组 |
| `array[number]` | 数组[数字] | 数值数组 |
| `array[boolean]` | 数组[布尔值] | 布尔值数组 |
| `array[object]` | 数组[对象] | JSON 对象数组 |

> **注意**：输入变量名不能重复。

### 高级设置（设置面板）

#### 节点描述

添加描述，说明此子流程的功能和调用时机。

## 必须配置：Subflow Output 节点

包含 Subflow 触发器的工作流**必须至少有一个 Subflow Output 节点**才能向父工作流返回结果。没有它，父工作流无法获取子工作流的输出。

```
Subflow Trigger
  → [处理节点...]
  → Subflow Output Node
    outputs:
      - variable: "result"
        type: "string"
```

Subflow Output 节点定义了返回给调用方的数据结构。父工作流通过 **Execute Workflow** 节点的输出访问这些数据。

## 数据流转

### 父 → 子（输入）

父工作流调用时传入数据：

```
父工作流:
  Execute Workflow Node
    工作流: "订单验证器"
    输入:
      customerName: "张三"
      orderTotal: 149.99
```

子工作流接收：

```javascript
// 在子工作流中
$('Subflow Trigger').customerName  // "张三"
$('Subflow Trigger').orderTotal    // 149.99
```

### 子 → 父（输出）

子工作流通过 Subflow Output 节点返回数据：

```javascript
// 子工作流的 Subflow Output 节点定义：
outputs:
  - variable: "isValid"
    type: "boolean"
  - variable: "message"
    type: "string"
```

父工作流访问：

```javascript
// 在父工作流中，Execute Workflow 节点之后
$('Execute Workflow').isValid   // true
$('Execute Workflow').message   // "订单验证通过"
```

## 测试

### 手动运行

使用 Subflow Trigger 上的**运行**按钮进行手动测试：

1. 点击 Subflow Trigger 节点上的**运行**按钮
2. 输入符合定义 schema 的测试数据
3. 工作流执行并显示结果

这样可以在其他工作流调用之前独立验证子流程逻辑。

## 工作流示例

### 示例 1：订单验证子流程

```
Subflow Trigger
  输入:
    - orderTotal (number)
    - customerTier (string)
  → Code Node
    Code: |
      const total = $('Subflow Trigger').orderTotal;
      const tier = $('Subflow Trigger').customerTier;
      const maxByTier = { "basic": 1000, "premium": 5000, "vip": 10000 };
      return {
        isValid: total <= (maxByTier[tier] ?? 500),
        limit: maxByTier[tier] ?? 500
      };
  → Subflow Output
    outputs:
      - isValid (boolean)
      - limit (number)
```

### 示例 2：通知分发器

```
Subflow Trigger
  输入:
    - recipient (string)
    - message (string)
    - channel (string)
  → Conditional Branch
    Condition: $('Subflow Trigger').channel === "email"
    → [email] → HTTP Request Node (发送邮件)
    → [slack] → HTTP Request Node (发送 Slack 消息)
    → [sms]   → HTTP Request Node (发送短信)
  → Subflow Output
    outputs:
      - status (string)
      - sentAt (string)
```

### 示例 3：多阶段流水线

```
父工作流:
  Webhook Trigger
    → Execute Workflow (阶段 1: 验证)
    → Conditional Branch
      Condition: $('Execute Workflow').isValid === true
      → Execute Workflow (阶段 2: 处理)
      → Execute Workflow (阶段 3: 通知)
```

## 最佳实践

### 1. 重命名节点

双击节点标题，将默认的"被另一个工作流执行时"改为有意义的名称：

```
# 不好的实践
[被另一个工作流执行时]

# 好的实践
[订单验证器]
```

### 2. 生产环境使用定义字段模式

```yaml
# 生产环境 — 明确的 schema 和类型
inputSource: "inputSchema"
inputs:
  - variable: "customerId"
    type: "string"
  - variable: "orderAmount"
    type: "number"
```

JSON 示例模式适合快速原型，但对团队协作来说不够自文档化。

### 3. 务必包含 Subflow Output 节点

每个包含 Subflow Trigger 的工作流必须至少有一个 Subflow Output 节点，否则父工作流无法接收结果。

### 4. 保持子流程专注

每个子流程应专注做好一件事：
- **好**："订单验证器"、"发票生成器"、"通知分发器"
- **不好**："订单处理 + 发票 + 通知 + 清理"

### 5. 文档化调用约定

使用节点描述说明期望的输入和返回的输出，帮助其他团队成员了解如何调用你的子流程。

## 常见问题

### Q: 一个工作流可以有几个 Subflow 触发器？

**A**：每个工作流最多**一个**（`maxNodes: 1`）。作为子流程使用的工作流不能同时作为独立的触发器工作流。

### Q: 子流程可以调用另一个子流程吗？

**A**：可以。子工作流中可以包含 Execute Workflow 节点来调用其他子工作流，支持多层编排。但要避免循环调用——工作流 A 调用 B，B 又调用 A，会导致无限递归。

### Q: 父工作流如何调用这个子流程？

**A**：使用 **Execute Workflow** 节点（位于 Action 节点面板中）选择此工作流并传入输入数据。

### Q: 如果父工作流传入的数据与定义的 schema 不匹配会怎样？

**A**：使用**在下方定义字段**模式时，父工作流多传的字段会被忽略，缺失的字段值为 `undefined`。建议在子工作流中对关键输入进行验证。

### Q: 能看到谁调用了我的子流程吗？

**A**：可以。参数面板顶部的**父工作流列表**会显示所有引用了当前工作流的工作流。

### Q: Subflow 触发器 vs Manual 触发器用于模块化逻辑？

**A**：

| 特性 | Subflow 触发器 | Manual 触发器 |
| --- | --- | --- |
| 调用方式 | 其他工作流（Execute Workflow 节点） | 人工点击或 API |
| 输入 | 有类型的 Schema 或 JSON 示例 | 自由格式通过 API |
| 输出 | Subflow Output 节点 | 最后一个节点输出 |
| 适用场景 | 可复用模块、工作流编排 | 测试、按需任务 |

## 下一步

- [Subflow Output](/zh-hans/guide/workflow/nodes/action-nodes/output) - 了解如何从子流程返回结果
- [运行工作流](/zh-hans/guide/workflow/execute-workflow) - 了解如何从父工作流调用子流程
- [Code 节点](/zh-hans/guide/workflow/nodes/action-nodes/code) - 在子流程中添加自定义处理逻辑

## 相关资源

- [Webhook 触发器](/zh-hans/guide/workflow/nodes/trigger-nodes/webhook) - 通过 HTTP 触发工作流
- [HTTP 请求节点](/zh-hans/guide/workflow/nodes/action-nodes/http-request) - 在子流程中调用外部 API
- [If 判断节点](/zh-hans/guide/workflow/nodes/action-nodes/if) - 添加条件逻辑
