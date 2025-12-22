---
title: 变量赋值节点
description: 在工作流中修改全局或循环变量的值
---

# 变量赋值节点

变量赋值节点允许你在工作流中修改全局或循环变量的值，影响后续节点的执行。该节点提供了一种灵活的方式来管理工作流执行过程中的状态和数据流。

## 使用场景

### 典型应用
- **状态管理** - 更新全局变量以跟踪工作流状态
- **循环变量修改** - 在迭代过程中修改循环变量
- **计数器管理** - 根据条件增加或减少计数器
- **数据累积** - 在多次工作流执行中收集和聚合数据
- **条件更新** - 根据条件逻辑更新变量
- **配置更新** - 动态调整工作流配置值
- **批处理** - 在批处理操作中跟踪进度和状态

## 节点配置

### 基础设置（参数面板）

#### 变量赋值 (items)

定义要执行的变量赋值。这是一个数组参数，每个项代表一个变量赋值。

**字段属性**:
- 数组类型，可添加多个赋值
- 每个赋值包含：
  - `variable` - 变量名（必填）
  - `value` - 变量值（必填，支持表达式）
- 赋值按顺序执行
- 默认为空数组

**变量类型**:
- **全局变量** - 在整个工作流中可用
- **循环变量** - 仅在循环节点作用域内可用（当节点位于循环内部时）

**配置示例**:

```javascript
// 赋值 1: 设置全局计数器
variable: "counter"
value: 0

// 赋值 2: 更新用户状态
variable: "userStatus"
value: $('HTTP请求').body.status

// 赋值 3: 使用表达式递增计数器
variable: "pageNumber"
value: $('变量赋值').pageNumber + 1

// 赋值 4: 从前一个节点输出设置
variable: "lastProcessedId"
value: $('代码').lastId
```

#### 变量选择

选择变量时，节点会自动检测你是否在循环节点内：

- **在循环节点内**: 显示来自父循环节点的循环变量
- **在循环节点外**: 仅显示全局变量

**注意**: 当对循环变量进行赋值时，节点会显示提示，说明变量属于哪个循环节点。

#### 值输入

值字段支持固定值和表达式：

**固定值**:
```javascript
// 字符串
"Hello World"

// 数字
42

// 布尔值
true

// 空值
null
```

**表达式模式**:
```javascript
// 引用上游节点数据
$('聊天触发器').message

// 数学运算
$('代码').count * 2

// 字符串拼接
"用户: " + $('HTTP请求').body.username

// 条件赋值
$('条件分支').isValid ? "valid" : "invalid"

// 数组/对象操作
$('代码').items.length
```

### 高级设置（设置面板）

#### 总是输出 (alwaysOutput)

当输出为空时，是否输出一个空项。

**默认值**: `false`

**用途**: 防止工作流在此节点终止，确保后续节点能够执行。

#### 仅执行一次 (executeOnce)

是否仅使用第一个输入项的数据执行一次。

**默认值**: `false`

**用途**:
- 当上游节点返回多个项时，默认会对每个项执行赋值
- 启用后，仅对第一个项执行，提高批处理操作的性能

#### 失败重试 (retryOnFail)

变量赋值失败时是否自动重试。

**默认值**: `false`

#### 最大重试次数 (maxTries)

失败后的最大重试次数。

**默认值**: `3`

**前置条件**: `retryOnFail` 必须为 `true`

#### 重试等待时间 (waitBetweenTries)

每次重试之间的等待时间（毫秒）。

**默认值**: `1000` (1秒)

**前置条件**: `retryOnFail` 必须为 `true`

#### 错误处理 (onError)

变量赋值失败时的处理方式。

**可选值**:
- `stopWorkflow` - 停止整个工作流（默认）
- `continueRegularOutput` - 继续执行，使用常规输出
- `continueErrorOutput` - 继续执行，使用错误输出

#### 节点描述 (nodeDescription)

为节点添加自定义描述。

```yaml
nodeDescription: "更新用户计数器和状态"
```

## 输出数据

变量赋值节点原样传递输入数据，允许后续节点访问更新后的变量。

```javascript
// 输入数据
{
  userId: "user123",
  message: "Hello"
}

// 赋值后的输出（相同数据，但变量已更新）
{
  userId: "user123",
  message: "Hello"
}

// 更新的变量全局可用
$sys.variables.counter  // 更新后的值
$sys.variables.userStatus  // 更新后的值
```

**访问更新的变量**:

```javascript
// 在后续节点中，访问更新的变量
$sys.variables.counter
$sys.variables.userStatus

// 或在表达式中引用
$('变量赋值').userId  // 仍然是 "user123"（未更改）
```

## 工作流示例

### 示例 1: 计数器管理

```
聊天触发器
  → 变量赋值节点
    赋值:
      - variable: "messageCount"
        value: $sys.variables.messageCount + 1
  → 条件分支
    条件: $sys.variables.messageCount > 10
    → [True] → 回答节点 ("您已发送 10 条消息！")
    → [False] → 回答节点 ("继续聊天...")
```

**说明**: 跟踪消息计数，在达到阈值时响应。

### 示例 2: 循环变量更新

```
循环迭代节点（处理项目）
  → HTTP请求（处理项目）
  → 变量赋值节点
    赋值:
      - variable: "processedCount"
        value: $sys.variables.processedCount + 1
      - variable: "lastProcessedId"
        value: $('HTTP请求').body.id
  → 下一次迭代
```

**说明**: 在循环迭代中跟踪处理进度。

### 示例 3: 条件状态更新

```
HTTP请求（获取用户数据）
  → 条件分支
    条件: $('HTTP请求').body.status === "active"
    → [True] → 变量赋值节点
      赋值:
        - variable: "activeUserCount"
          value: $sys.variables.activeUserCount + 1
    → [False] → 变量赋值节点
      赋值:
        - variable: "inactiveUserCount"
          value: $sys.variables.inactiveUserCount + 1
```

**说明**: 根据条件逻辑更新不同的计数器。

### 示例 4: 数据累积

```
Webhook触发器
  → 变量赋值节点
    赋值:
      - variable: "totalRevenue"
        value: $sys.variables.totalRevenue + $('Webhook触发器').body.amount
      - variable: "transactionCount"
        value: $sys.variables.transactionCount + 1
  → 回答节点
```

**说明**: 在多次 webhook 调用中累积收入和交易计数。

### 示例 5: 动态配置

```
代码节点（计算批次大小）
  → 变量赋值节点
    赋值:
      - variable: "batchSize"
        value: $('代码').optimalBatchSize
      - variable: "maxRetries"
        value: $('代码').calculatedRetries
  → 循环迭代节点
    使用: $sys.variables.batchSize
```

**说明**: 根据计算动态更新配置变量。

### 示例 6: 重置变量

```
变量赋值节点（重置计数器）
  赋值:
    - variable: "counter"
      value: 0
    - variable: "status"
      value: "initialized"
  → 处理工作流
```

**说明**: 在开始新流程之前将变量重置为初始状态。

## 最佳实践

### 1. 变量命名

**使用描述性名称**
```javascript
// 好
variable: "userMessageCount"
variable: "lastProcessedOrderId"
variable: "currentBatchIndex"

// 避免
variable: "c1"
variable: "temp"
variable: "x"
```

**遵循命名约定**
- 使用 camelCase 命名变量
- 使用表明用途的描述性名称
- 除非广泛理解，否则避免缩写

### 2. 初始化变量

**设置初始值**
```javascript
// 在工作流开始时，初始化变量
变量赋值节点:
  - variable: "counter"
    value: 0
  - variable: "status"
    value: "pending"
```

### 3. 使用表达式进行动态更新

**动态计算值**
```javascript
// 而不是硬编码
variable: "nextPage"
value: $sys.variables.currentPage + 1

// 使用条件逻辑
variable: "status"
value: $('HTTP请求').statusCode === 200 ? "success" : "failed"
```

### 4. 避免意外覆盖

**更新前检查**
```javascript
// 使用条件逻辑防止不必要的覆盖
variable: "lastProcessedId"
value: $('HTTP请求').body.id || $sys.variables.lastProcessedId
```

### 5. 记录变量使用

**添加节点描述**
```yaml
nodeDescription: "更新用户计数器并跟踪最后处理的消息 ID"
```

### 6. 性能考虑

**批处理操作使用仅执行一次**
```yaml
# 处理多个项时，更新计数器一次
settings:
  executeOnce: true
```

**最小化变量更新**
- 仅在必要时更新变量
- 考虑将多个更新合并为单个赋值

### 7. 错误处理

**处理赋值失败**
```yaml
settings:
  onError: continueRegularOutput  # 即使赋值失败也继续
  retryOnFail: true
  maxTries: 3
```

## 常见问题

### Q1: 全局变量和循环变量有什么区别？

**A**:
- **全局变量**: 在整个工作流中可用，在所有节点间持久存在
- **循环变量**: 仅在循环节点作用域内可用，每次迭代都会重置

### Q2: 我可以赋值给不存在的变量吗？

**A**: 可以，赋值给不存在的变量会创建它。但建议在工作流开始时初始化变量以提高清晰度。

### Q3: 我可以在变量名中使用表达式吗？

**A**: 不可以，变量名必须是固定字符串。只有值支持表达式。

### Q4: 如果我在一个节点中对同一变量多次赋值会发生什么？

**A**: 赋值按顺序执行，因此对于同一变量，后面的赋值会覆盖前面的赋值。

### Q5: 变量可以在不同的工作流执行之间访问吗？

**A**: 全局变量在单次工作流执行期间持久存在，但在执行之间会重置。对于持久存储，请使用外部存储系统。

### Q6: 如何清除或重置变量？

**A**: 赋值 `null` 或空值：
```javascript
variable: "myVariable"
value: null  // 或字符串用 ""，数字用 0
```

### Q7: 我可以在条件分支中使用变量吗？

**A**: 可以，使用 `$sys.variables.variableName` 引用变量：
```javascript
$sys.variables.counter > 10
$sys.variables.status === "active"
```

### Q8: 如果赋值失败会发生什么？

**A**: 根据 `onError` 设置：
- `stopWorkflow` - 工作流停止（默认）
- `continueRegularOutput` - 继续常规输出
- `continueErrorOutput` - 继续错误输出

### Q9: 我可以赋值复杂对象或数组吗？

**A**: 可以，变量可以保存任何数据类型：
```javascript
variable: "userData"
value: $('HTTP请求').body  // 对象

variable: "items"
value: $('代码').items  // 数组
```

### Q10: 如何递增计数器？

**A**: 使用表达式引用当前值：
```javascript
variable: "counter"
value: $sys.variables.counter + 1
```

## 下一步

- [循环与迭代](/zh-hans/guide/workflow/nodes/control-nodes/loop-iterate) - 了解如何使用循环变量
- [条件分支](/zh-hans/guide/workflow/nodes/action-nodes/if) - 在条件逻辑中使用变量
- [代码节点](/zh-hans/guide/workflow/nodes/action-nodes/code) - 复杂的变量计算
- [表达式语法](/zh-hans/guide/expressions/) - 学习如何在变量值中使用表达式

## 相关资源

- [使用节点](/zh-hans/guide/working-with-nodes) - 通用节点使用指南
- [编辑节点](/zh-hans/guide/editing-nodes) - 了解如何配置节点











