---
title: Subflow Output
description: 将工作流数据返回给调用方，是子流程工作流的必需端点
---

# Subflow Output

Subflow Output 节点将工作流数据返回给调用方。它是任何使用 [Subflow 触发器](/zh-hans/guide/workflow/nodes/trigger-nodes/subflow) 的工作流的**必需端点**——没有它，父工作流无法接收子工作流的处理结果。

## 使用场景

- **返回结果** — 将处理后的数据送回调用方工作流
- **多值输出** — 定义多个具名输出（如 `status`、`data`、`message`）
- **流水线交接** — 在多阶段流水线的工作流之间传递结构化数据
- **错误信号** — 通过错误输出端口向调用方传递失败信息

## 节点特点

### 基本特性
- **子流程必需** — 每个使用 [Subflow 触发器](/zh-hans/guide/workflow/nodes/trigger-nodes/subflow) 的工作流必须至少包含一个 Subflow Output 节点
- **多输出定义** — 可定义任意数量的具名输出变量
- **错误输出端口** — 可将错误信息与正常输出分开路由
- **参数预览** — 画布上显示已定义输出的摘要

### 端口

| 端口 | 类型 | 说明 |
| --- | --- | --- |
| Input | 输入 | 接收上游节点的数据 |
| Output | 输出（可多连） | 将输出数据发送给父工作流 |
| Error | 错误输出 | 失败时路由错误信息 |

## 节点配置

### 基础设置（参数面板）

#### 输出定义

定义此工作流返回给调用方的输出变量。点击**添加输出**创建一个，然后配置：

| 属性 | 说明 |
| --- | --- |
| **变量名（Variable）** | 父工作流中访问该值的名称 |
| **值（Value）** | 输出的表达式（如 `$('Code').result`） |

**配置示例**：

```yaml
outputs:
  - variable: "isValid"
    value: "$('Code').isValid"
  - variable: "message"
    value: "$('Code').message"
  - variable: "processedAt"
    value: "$('Code').timestamp"
```

> **注意**：输出变量名不可重复。`value` 字段支持使用[表达式](/zh-hans/guide/expressions/)引用上游节点数据。

### 高级设置（设置面板）

#### 节点描述

添加描述，说明此输出节点返回的内容。

## 工作原理

### 数据流转

Subflow Output 节点始终是子流程工作流的**最后一个节点**。它收集上游节点的数据并打包返回给调用方：

```
Subflow Trigger (接收父工作流输入)
  → Code Node (处理数据)
  → Subflow Output (向父工作流返回结果)
```

### 在父工作流中

父工作流通过 **Execute Workflow** 节点调用子流程后，这样访问输出：

```javascript
// 父工作流 — Execute Workflow 节点之后
$('Execute Workflow').isValid       // 来自子工作流的输出
$('Execute Workflow').message       // 来自子工作流的输出
$('Execute Workflow').processedAt   // 来自子工作流的输出
```

### 多个输出节点

一个工作流中可以有多个 Subflow Output 节点（例如在条件分支的不同路径中）。但 **Subflow Output 节点不能串联**——一个 Subflow Output 节点的下游不能有另一个 Subflow Output 节点。

```
Subflow Trigger
  → Conditional Branch
    → [成功] → Code Node → Subflow Output (返回成功数据)
    → [失败] → Subflow Output (返回错误数据)
```

## 工作流示例

### 示例 1：简单验证返回

```
Subflow Trigger
  inputs:
    - orderTotal (number)
  → Code Node
    Code: |
      const total = $('Subflow Trigger').orderTotal;
      return {
        valid: total > 0 && total < 10000,
        reason: total <= 0 ? "金额必须为正数" :
                total >= 10000 ? "金额超过上限" : "OK"
      };
  → Subflow Output
    outputs:
      - variable: "valid"
        value: "$('Code').valid"
      - variable: "reason"
        value: "$('Code').reason"
```

### 示例 2：数据补充子流程

```
Subflow Trigger
  inputs:
    - customerId (string)
  → HTTP Request Node
    URL: "https://api.example.com/customers/{$('Subflow Trigger').customerId}"
  → Code Node
    Code: |
      const data = $('HTTP Request').body;
      return {
        name: data.name,
        tier: data.tier,
        since: data.memberSince
      };
  → Subflow Output
    outputs:
      - variable: "name"
        value: "$('Code').name"
      - variable: "tier"
        value: "$('Code').tier"
      - variable: "since"
        value: "$('Code').since"
```

### 示例 3：区分成功/失败输出

```
Subflow Trigger
  inputs:
    - url (string)
  → HTTP Request Node
    URL: $('Subflow Trigger').url
    错误处理: 继续（使用错误输出）
  → Conditional Branch
    Condition: $('HTTP Request').status < 400
    → [成功] → Subflow Output
      outputs:
        - variable: "data"
          value: "$('HTTP Request').body"
        - variable: "success"
          value: "true"
    → [失败] → Subflow Output
      outputs:
        - variable: "error"
          value: "$('HTTP Request').error"
        - variable: "success"
          value: "false"
```

## 使用限制

### 不允许下游串联

Subflow Output 节点**不能**后接另一个 Subflow Output 节点。以下用法无效：

```
# ❌ 无效 — 串联的 Subflow Output 节点
Subflow Output → Subflow Output
```

但不同分支中各自以 Subflow Output 结尾是允许的：

```
# ✓ 有效 — 不同分支各自以 Subflow Output 结尾
Conditional Branch
  → [分支 A] → Subflow Output
  → [分支 B] → Subflow Output
```

## 最佳实践

### 1. 重命名节点

双击节点标题，将"子流程输出"改为有意义的名称：

```
# 不好的实践
[子流程输出]

# 好的实践
[返回验证结果]
```

### 2. 使用描述性的变量名

```yaml
# 好的实践 — 自文档化
outputs:
  - variable: "validationStatus"
  - variable: "errorMessage"

# 不好的实践 — 含义不明
outputs:
  - variable: "out1"
  - variable: "out2"
```

### 3. 始终提供错误输出

即使子流程通常都能成功，也建议提供错误输出让调用方优雅处理失败：

```yaml
outputs:
  - variable: "success"
    value: "true"
  - variable: "data"
    value: "$('Code').result"
  - variable: "error"
    value: "''"   # 成功时为空，错误分支中填充
```

### 4. 文档化输出约定

使用节点描述说明调用方可预期的输出：

```yaml
nodeDescription: "返回: { valid: boolean, reason: string }。
调用方应先检查 'valid' 再使用下游数据。"
```

## 常见问题

### Q: 一个工作流需要几个 Subflow Output 节点？

**A**：至少**一个**。使用 [Subflow 触发器](/zh-hans/guide/workflow/nodes/trigger-nodes/subflow) 的工作流若没有 Subflow Output 节点将执行失败——父工作流无法接收任何结果。

### Q: 可以有多个 Subflow Output 节点吗？

**A**：可以，只要它们位于**不同的分支**中（如成功路径和错误路径）。它们不能串联。

### Q: Subflow Output 节点会处理数据吗？

**A**：不会。它只打包和返回上游节点的数据。请使用 [Code 节点](/zh-hans/guide/workflow/nodes/action-nodes/code)、[数据转换节点](/zh-hans/guide/workflow/nodes/action-nodes/transform) 或其他 Action 节点在输出之前处理数据。

### Q: 父工作流如何访问多个输出？

**A**：所有输出变量在父工作流中都可以通过 Execute Workflow 节点的名称访问：

```javascript
$('Execute Workflow').变量名
```

### Q: 输出值可以使用表达式吗？

**A**：可以。`value` 字段支持完整的[表达式语法](/zh-hans/guide/expressions/)，可以引用任何上游节点的输出。

### Q: Subflow Output vs Answer 节点？

**A**：

| 特性 | Subflow Output | Answer |
| --- | --- | --- |
| 用途 | 向调用方工作流返回数据 | 向终端用户发送回复 |
| 触发方式 | [Subflow 触发器](/zh-hans/guide/workflow/nodes/trigger-nodes/subflow) | Chat 触发器 |
| 输出消费者 | 另一个工作流 | 人类用户 |
| 多值 | 支持多个具名变量 | 单个文本回复 |

## 下一步

- [Subflow 触发器](/zh-hans/guide/workflow/nodes/trigger-nodes/subflow) — 了解如何接收父工作流的调用
- [运行工作流](/zh-hans/guide/workflow/execute-workflow) — 了解如何从父工作流调用子流程
- [Code 节点](/zh-hans/guide/workflow/nodes/action-nodes/code) — 在输出前处理数据

## 相关资源

- [表达式语法](/zh-hans/guide/expressions/) — 了解如何在输出值中引用数据
- [数据转换节点](/zh-hans/guide/workflow/nodes/action-nodes/transform) — 用表达式转换数据
- [条件分支节点](/zh-hans/guide/workflow/nodes/action-nodes/if) — 根据条件路由到不同的输出节点
