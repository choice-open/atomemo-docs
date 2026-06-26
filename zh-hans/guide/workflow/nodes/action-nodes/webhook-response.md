---
title: Webhook 响应
description: 向 Webhook 调用方发送自定义 HTTP 响应，完全控制状态码、响应头和响应体
---

# Webhook 响应

Webhook 响应节点用于向 [Webhook 触发器](/zh-hans/guide/workflow/nodes/trigger-nodes/webhook) 的调用方发送自定义 HTTP 响应。与默认的"立即响应"或"工作流结束时响应"模式不同，该节点允许你在工作流的**任意位置**精确控制**何时**发送响应、响应**包含什么内容**以及**如何组织**响应结构。

> **前置条件**：Webhook 触发器的**响应方式**必须设置为 **"使用 'Respond to Webhook' 节点"**（`respond: "respond_to_webhook"`），此节点才会生效。

## 使用场景

### 典型应用
- **条件响应** — 根据工作流逻辑返回不同的状态码和响应体（如验证成功返回 `200`，验证失败返回 `400`）
- **提前响应** — 先发送响应确认，后续在后台异步继续处理
- **自定义响应头** — 设置 `Content-Type`、`Location`、`X-Request-ID` 等响应头
- **部分结果返回** — 先返回即时确认，同时继续执行耗时处理
- **API 端点** — 构建完整的 REST API 端点，返回正确的状态码和结构化的 JSON 响应

## 节点配置

### 响应体类型

选择响应体的组织方式。点击类型选择器在三种模式之间切换：

---

#### JSON

手动输入 JSON 格式的响应体。编辑器会实时校验 JSON 语法合法性。

**字段**：`Response Body` — 仅接受合法的 JSON。

```json
{
  "success": true,
  "orderId": "ord_12345",
  "message": "订单创建成功"
}
```

**使用表达式** — 通过 [表达式](/zh-hans/guide/expressions/) 动态构建响应内容：

```javascript
// 表达式模式 — 引用上游节点输出
{
  "status": "ok",
  "userId": {{$('Webhook 触发器').body.userId}},
  "result": {{$('代码').output}},
  "timestamp": {{$('Webhook 触发器').body.timestamp}}
}
```

> **注意**：当前仅支持 JSON 格式。二进制文件和纯文本响应可能在后续版本中提供。

---

#### No Data（无数据）

返回 HTTP `200` 响应，响应体为空。适用于调用方只需要知道请求已被接收的场景。

```
状态码: 200 OK
响应体: (空)
```

常见场景：
- 无需返回结果的"发后即忘"型 Webhook
- 只需确认接收的响应场景

---

#### Key-Value Pairs（键值对）

通过键值对表单构建扁平 JSON 对象作为响应体。

点击**添加键值对**按钮添加一行。每行包含两个均支持表达式的字段：

| 字段 | 说明 |
| --- | --- |
| **Name** | JSON 的键名 |
| **Value** | 该键对应的值（支持表达式） |

**配置示例**：

| Name | Value |
| --- | --- |
| `status` | `"success"` |
| `orderId` | `$('HTTP 请求').body.id` |
| `message` | `"订单已处理"` |
| `timestamp` | `$('Webhook 触发器').body.timestamp` |

**生成的响应体**：
```json
{
  "status": "success",
  "orderId": "ord_12345",
  "message": "订单已处理",
  "timestamp": "2026-01-15T10:30:00Z"
}
```

> **提示**：Name 和 Value 字段均支持完整的 [表达式语法](/zh-hans/guide/expressions/)。使用表达式从任意上游节点提取数据。

## 响应行为

### 执行规则

Webhook 响应节点遵循特定的执行规则，决定最终发送给调用方的响应：

#### 1. 首个响应生效

只有**第一个**被执行的 Webhook 响应节点会发送响应。同一工作流中后续的任何 Webhook 响应节点将被静默忽略。

```
Webhook 触发器 (respond = respond_to_webhook)
  → 条件分支
    → [分支 A] → Webhook 响应 ← ✓ 由它发送响应
    → [分支 B] → Webhook 响应 ← ✗ 被忽略（响应已发送）
```

#### 2. 未执行到 Webhook 响应节点

如果工作流在从未到达任何 Webhook 响应节点的情况下完成执行，系统会返回默认的 `200` 响应和标准消息。

```
Webhook 触发器 (respond = respond_to_webhook)
  → 代码节点
  → 结束                      ← 没有命中 Webhook 响应节点
                                → 返回 200 + 默认消息
```

#### 3. 响应前发生错误

如果工作流在**任何** Webhook 响应节点执行之前发生错误，系统返回 HTTP `500` 错误。

```
Webhook 触发器 (respond = respond_to_webhook)
  → 代码节点（抛出异常）              ← 出错！
                                        → 返回 500
```

#### 4. 工作流中无 Webhook 触发器

如果 Webhook 响应节点被放置在**没有** Webhook 触发器的工作流中（或触发器的响应模式未设为 `respond_to_webhook`），该节点会被静默忽略并输出 `null`。

```
聊天触发器                          ← 不是 Webhook 触发器
  → Webhook 响应                    ← 被忽略，输出 null
```

#### 5. 客户端已断开连接

如果 HTTP 客户端在工作流到达 Webhook 响应节点之前断开连接，节点会输出：

```
"Client has disconnected or has been responsed by another webhook response node"
```

这可能发生在客户端超时或在处理过程中取消请求的情况下。

### 规则汇总表

| 场景 | 结果 |
| --- | --- |
| 工作流执行到 Webhook 响应节点 | 发送自定义响应（首个节点生效） |
| 工作流完成但未执行 Webhook 响应节点 | `200` + 默认消息 |
| 任何 Webhook 响应节点之前出错 | `500` 错误 |
| 工作流中无 Webhook 触发器 | 节点被忽略，输出 `null` |
| 响应前客户端已断开 | 节点输出错误信息 |

## 工作流示例

### 示例 1：带验证的条件响应

验证通过返回 `200`，验证失败返回 `400`：

```
Webhook 触发器（POST JSON body）
  → 代码节点
    校验必填字段（userId、email）
    返回 { valid: true/false, errors: [...] }
  → 条件分支
    条件：$('代码').valid === true
    → [通过] → Webhook 响应（JSON）
        {
          "success": true,
          "message": "用户数据已接收"
        }
    → [失败] → Webhook 响应（JSON）
        {
          "success": false,
          "errors": {{$('代码').errors}}
        }
```

### 示例 2：提前确认 + 后台处理

立即确认请求接收，后续继续处理：

```
Webhook 触发器（respond = respond_to_webhook）
  → Webhook 响应（JSON）
      {
        "status": "received",
        "requestId": {{$('Webhook 触发器').body.requestId}}
      }
  → HTTP 请求（调用外部服务）
  → 代码节点（处理结果）
  → HTTP 请求（发送通知）
```

> 调用方立刻收到确认响应，工作流其余部分异步继续执行。

### 示例 3：REST API 端点

构建带资源查找的完整 REST 端点：

```
Webhook 触发器（GET，路径：/users/:userId）
  → HTTP 请求
    URL: https://api.internal/users/{{$('Webhook 触发器').params.userId}}
  → 条件分支
    条件：$('HTTP 请求').status === 200
    → [找到] → Webhook 响应（键值对）
        status: "success"
        user: $('HTTP 请求').body
    → [未找到] → Webhook 响应（JSON）
        {
          "error": "用户不存在",
          "userId": {{$('Webhook 触发器').params.userId}}
        }
```

### 示例 4：无数据响应用于发后即忘场景

```
Webhook 触发器（POST，respond = respond_to_webhook）
  → Webhook 响应（No Data）     ← 立即确认
  → 代码节点（重处理）
  → HTTP 请求（存储结果）
```

## 约束条件

### 单一有效响应

每次工作流执行只能有一个 Webhook 响应节点发送响应。**第一个**被执行的节点生效——其余全部忽略：

```yaml
# ✓ 有效 — 只有一个分支会被执行
条件分支
  → [分支 A] → Webhook 响应
  → [分支 B] → Webhook 响应

# ✗ 避免 — 第二个节点永远不会发送响应
Webhook 响应
  → 代码节点
  → Webhook 响应  ← 永不发送
```

### 内容类型限制

当前版本仅支持 **JSON** 响应体（`application/json`）。纯文本、HTML、二进制等内容类型暂不可用。

## 最佳实践

### 1. 放在数据处理之后

将 Webhook 响应节点放在产生需要返回的数据的节点**之后**：

```
Webhook 触发器
  → LLM（生成内容）
  → 代码节点（格式化输出）
  → Webhook 响应 ← 返回格式化后的结果
```

### 2. 始终处理错误分支

在错误分支中也放置 Webhook 响应节点，确保调用方始终能收到有意义的响应：

```javascript
// 成功分支
→ Webhook 响应（JSON）{ "status": "ok", "data": ... }

// 错误分支
→ Webhook 响应（JSON）{ "status": "error", "message": "..." }
```

如果不这样做，错误分支将导致 `500`（未发送自定义响应）。

### 3. 重命名节点

双击节点标题为其设置描述性名称：

```
[Webhook 响应]          ← 默认名称
[返回订单结果]           ← 更好的命名
[发送 400 验证错误]      ← 错误分支的最佳命名
```

### 4. 尽早验证输入

将验证逻辑和返回错误的 Webhook 响应节点放在工作流**靠前**的位置，实现快速失败：

```
Webhook 触发器
  → 代码节点（验证）
  → 条件分支
    → [无效] → Webhook 响应（返回错误）  ← 快速失败
    → [有效] → ...继续处理...
```

### 5. 记录响应 Schema

使用节点描述字段记录调用方可预期的响应结构：

```yaml
nodeDescription: "返回 { success: boolean, orderId: string }。
验证失败时返回 { success: false, errors: string[] }。"
```

## 常见问题

### Q1: Webhook 响应节点和 Answer 节点有什么区别？

**A**:

| 特性 | Webhook 响应 | Answer |
| --- | --- | --- |
| 触发方式 | [Webhook 触发器](/zh-hans/guide/workflow/nodes/trigger-nodes/webhook) | 聊天触发器 |
| 响应对象 | HTTP 客户端 / API 调用方 | 聊天中的最终用户 |
| 内容类型 | JSON（结构化数据） | Markdown / 纯文本 |
| 状态码 | 可控（200/500/...） | 不适用 |

### Q2: 如果放置了 Webhook 响应节点，但触发器的响应模式未设为 respond_to_webhook，会发生什么？

**A**: 该节点会被静默忽略并输出 `null`。你必须将 Webhook 触发器的**响应方式**选项设为 **"使用 'Respond to Webhook' 节点"**，节点才会生效。

### Q3: 能否设置自定义 HTTP 状态码（如 201 或 404）？

**A**: 当前版本中，响应状态由执行路径决定：
- Webhook 响应节点执行 → `200`
- Webhook 响应节点之前出错 → `500`

自定义状态码（201、400、404 等）暂不支持通过独立字段配置。

### Q4: Response Body JSON 中可以使用表达式吗？

**A**: 可以。JSON 字段支持完整的 [表达式语法](/zh-hans/guide/expressions/)。使用 `{{ }}` 嵌入动态值：

```javascript
{
  "userId": {{$('Webhook 触发器').body.userId}},
  "result": {{$('LLM').output}}
}
```

键值对模式中的 Name 和 Value 字段也都支持表达式。

### Q5: 如果工作流有多个分支，每个分支都有一个 Webhook 响应节点会怎样？

**A**: 这是推荐的使用模式。只有实际执行的那个分支会发送响应。第一个被到达的 Webhook 响应节点发送响应；其他条件分支中的并行节点不会被执行到。

### Q6: Webhook 响应节点之后工作流会停止吗？

**A**: **不会。** Webhook 响应节点之后工作流会继续执行。这支持"提前确认、后续处理"的模式：

```
Webhook 响应（发送 200） → HTTP 请求 → 代码 → ...
```

但后续的 Webhook 响应节点会被忽略——第一个响应已经发送。

## 下一步

- [Webhook 触发器](/zh-hans/guide/workflow/nodes/trigger-nodes/webhook) — 配置接收请求的 Webhook 端点
- [HTTP 请求节点](/zh-hans/guide/workflow/nodes/action-nodes/http-request) — 从工作流中调用外部 API
- [条件分支节点](/zh-hans/guide/workflow/nodes/action-nodes/if) — 根据不同逻辑路由到不同响应节点

## 相关资源

- [表达式语法](/zh-hans/guide/expressions/) — 构建动态响应内容
- [代码节点](/zh-hans/guide/workflow/nodes/action-nodes/code) — 在发送响应前处理数据
- [数据转换节点](/zh-hans/guide/workflow/nodes/action-nodes/transform) — 使用表达式转换数据
