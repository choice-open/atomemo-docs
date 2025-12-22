---
title: 循环与迭代节点
description: 灵活控制工作流重复执行多次
---

# 循环与迭代节点

循环与迭代节点允许你重复执行工作流的一部分多次。不同于将迭代和循环分为两个不同节点的系统，我们使用单一节点配合直观的配置来降低学习成本。该设计已经过验证，许多逻辑组件可以复用。

## 使用场景

### 典型应用
- **批量处理** - 处理数组或集合中的多个项目
- **重试逻辑** - 按指定次数重试失败的操作
- **数据转换** - 转换数据集中的每个项目
- **API 轮询** - 轮询 API 直到满足条件
- **工作流重复** - 使用不同参数多次执行工作流片段
- **数据聚合** - 收集和聚合多次迭代的结果

## 重要限制

::: warning 循环作用域限制
**循环节点内部节点的执行结果不能被循环节点外面的节点引用。**

这意味着：
- 循环外的节点无法访问循环迭代的数据
- 使用循环节点的输出设置来暴露迭代中的数据
- 循环输出包含所有迭代结果的数组
:::

## 节点配置

### 基础设置（参数面板）

#### 执行策略 (strategy)

选择循环的执行方式。

**可选选项**：

1. **按指定次数循环** (`type: "loop"`)
   - 执行固定次数的循环
   - **配置**：
     - `times`: 迭代次数（整数）
     - 默认值：5
     - 最大值：100（如果超过 100，只会运行 100 次）
     - 可以使用表达式引用前序节点输出

   **示例**：
   ```javascript
   {
     type: "loop",
     times: 10  // 执行 10 次
   }
   
   // 或使用表达式
   {
     type: "loop",
     times: $('前序节点').count  // 引用前序节点输出
   }
   ```

2. **遍历一个数组** (`type: "iteration"`)
   - 遍历数组中的每个项目
   - **配置**：
     - `collection`: 要遍历的数组（表达式）
     - `max_iterations`: 可选的最大迭代次数限制
       - 默认值：1
       - 无上限
       - 可以引用表达式
       - 启用"限制迭代次数"开关来激活

   **示例**：
   ```javascript
   {
     type: "iteration",
     collection: $('前序节点').items,  // 来自前序节点的数组
     max_iterations: 5  // 可选：限制为 5 个项目
   }
   ```

#### 执行方式 (parallel)

选择循环迭代的执行方式。

**可选选项**：
- **串行** (`parallel: false`) - 默认
  - 依次执行每次迭代
  - 如果一次迭代失败，循环将终止
  - 适用于依赖前序迭代的操作

- **并行** (`parallel: true`)
  - 同时执行所有迭代
  - 每次迭代独立运行
  - 一次迭代失败不影响其他迭代
  - ⚠️ **警告**：并行模式下修改全局变量会导致执行顺序不可预知，可能造成未知错误。请谨慎使用。

**示例**：
```javascript
// 串行执行
{
  parallel: false
}

// 并行执行
{
  parallel: true
}
```

#### 循环变量 (variables)

定义在循环作用域内可用的变量。

**字段属性**：
- 非必填（可以添加或删除变量）
- 变量在整个循环迭代中可用
- 可以引用前序节点输出
- 当迭代模式为"遍历一个数组"时，可以引用当前数组项目

**变量结构**：
```javascript
variables: [
  {
    variable: "var_a",        // 变量名
    value: "var_value",       // 变量值（可以是表达式）
    type: "string"            // 变量类型：string/number/object/boolean/array
  },
  {
    variable: "var_b",
    value: $('前序节点').count,
    type: "number"
  }
]
```

**变量类型**：
- `string` - 文本值
- `number` - 数值
- `object` - JSON 对象
- `boolean` - 真/假值
- `array` - 数组/列表

**迭代模式中的特殊引用**：
使用"遍历一个数组"模式时，可以引用当前数组项目：
```javascript
{
  variable: "current_item",
  value: $loop.item,  // 迭代中的当前数组项目
  type: "object"
}
```

::: warning 并行模式变量
**并行模式下修改全局变量会导致执行顺序不可预知，可能造成未知错误。请谨慎使用。**
:::

#### 循环终止条件

配置循环何时提前停止。

**终止触发条件**：
1. **最大错误数** (`max_errors`)
   - 达到最大错误数后停止循环
   - 默认值：5
   - 最大值：10000
   - 无法删除（始终存在）

2. **退出条件** (`exit_condition`)
   - 满足条件时停止循环
   - 可以引用：
     - 前序节点输出
     - 当前迭代项目（迭代模式下）
     - 自定义循环变量
   - 支持条件组和嵌套条件
   - 可在循环内使用退出循环节点（参见[退出循环节点](/zh-hans/guide/workflow/nodes/control-nodes/break-loop)）

**终止逻辑**：
满足以下**任一**条件时循环终止：
- 达到最大错误数
- 退出条件评估为真
- 循环内执行了退出循环节点

**示例**：
```javascript
{
  max_errors: 10,
  exit_condition: {
    leftValue: $loop.vars.var_a,
    operator: "is_greater_than",
    rightValue: 100
  }
}
```

#### 输出设置 (output_item_settings)

配置所有迭代完成后输出的数据。

**输出结构**：
循环节点输出一个包含所有迭代结果的数组：
```javascript
[
  {"output_1": "value1", "output_2": "value2"},  // 迭代 1 的结果
  {"output_1": "value1", "output_2": "value2"},  // 迭代 2 的结果
  // ... 更多迭代
]
```

**输出项配置**：
```javascript
output_item_settings: [
  {
    variable: "output_1",           // 输出变量名
    value: $('循环节点').result,     // 值或表达式
    type: "string"                   // 变量类型
  },
  {
    variable: "output_2",
    value: $loop.vars.var_a,        // 引用循环变量
    type: "number"
  }
]
```

**值引用**：
- 可以引用循环内节点的输出
- 可以引用循环变量
- 可以引用当前迭代项目 (`$loop.item`) 和索引 (`$loop.index`)

**变量类型**：
- `string` - 文本值
- `number` - 数值
- `object` - JSON 对象
- `boolean` - 真/假值
- `array` - 数组/列表

### 高级设置（设置面板）

#### 错误处理 (onError)

如何处理循环执行期间的错误。

**可选值**：
- `stopWorkflow` - 停止整个工作流（默认）
- `continueRegularOutput` - 继续执行
- `continueErrorOutput` - 继续执行并输出错误

#### 节点描述 (nodeDescription)

为节点添加自定义描述。

```yaml
nodeDescription: "批量处理项目并带重试逻辑"
```

## 变量引用表达式

### 引用循环变量

```javascript
// 引用循环变量
$loop.vars.var_a

// 引用多个循环变量
$loop.vars.var_a + $loop.vars.var_b
```

### 引用当前迭代项目和索引

使用"遍历一个数组"模式时：

```javascript
// 引用当前数组项目
$loop.item

// 引用当前迭代索引（从 0 开始）
$loop.index

// 访问当前项目的属性
$loop.item.name
$loop.item.id
```

### 引用循环节点输出

```javascript
// 引用整个循环输出（所有迭代结果的数组）
$('循环节点名称')

// 引用特定迭代的输出
$('循环节点名称')[0].output_1        // 第一次迭代，output_1
$('循环节点名称')[1].output_2       // 第二次迭代，output_2

// 获取特定输出在所有迭代中的值
$('循环节点名称').map(item => item.output_1)  // 所有 output_1 的值
```

## 端口和连接

### 输入端口

- **Input** (端口 0)
  - 只能单连接 (`allowMultiple: false`)
  - 循环的主输入
  - 位置：左侧

### 输出端口

- **Done** (端口 0)
  - 只能单连接 (`allowMultiple: false`)
  - 所有迭代完成后执行
  - 包含最终输出数组
  - 位置：右侧

- **循环开始** (具有 `loopstart` 角色的端口)
  - 允许多连接 (`allowMultiple: true`)
  - 连接到此端口的节点在每次迭代中执行
  - 位置：右侧
  - ⚠️ **重要**：只有循环内的节点可以连接到此端口

- **错误输出**
  - 处理循环执行期间的错误
  - 配置取决于错误处理设置

## 工作流示例

### 示例 1：处理数组项目

```
HTTP Request (获取用户列表)
  → 循环与迭代节点
    策略：遍历一个数组
    集合：$('HTTP Request').body.users
    变量：
      - variable: "current_user"
        value: $loop.item
        type: "object"
    → [循环开始] → HTTP Request (处理用户)
                   → Code Node (转换数据)
    → [完成] → Answer (已处理 ${$('循环').length} 个用户)
```

### 示例 2：带限制的重试

```
HTTP Request (API 调用)
  → 循环与迭代节点
    策略：按指定次数循环
    次数：3
    模式：串行
    最大错误数：1
    退出条件：$('HTTP Request').statusCode === 200
    → [循环开始] → HTTP Request (重试 API)
    → [完成] → Answer (API 调用完成)
```

### 示例 3：并行执行的批量处理

```
Code Node (生成批次 ID)
  → 循环与迭代节点
    策略：遍历一个数组
    集合：$('Code').batchIds
    模式：并行
    最大迭代次数：10
    → [循环开始] → HTTP Request (处理批次)
                   → Code Node (转换结果)
    → [完成] → Code Node (聚合结果)
              → Answer (批量处理完成)
```

### 示例 4：带变量的条件循环

```
Code Node (准备数据)
  → 循环与迭代节点
    策略：按指定次数循环
    次数：$('Code').maxIterations
    变量：
      - variable: "counter"
        value: 0
        type: "number"
      - variable: "total"
        value: $('Code').total
        type: "number"
    退出条件：$loop.vars.counter >= $loop.vars.total
    → [循环开始] → Code Node (增加计数器)
                   → 条件分支节点
                     条件：$loop.vars.counter < 10
                     → [True] → 处理项目
                     → [False] → 退出循环
    → [完成] → Answer (处理完成)
```

### 示例 5：嵌套数据处理

```
HTTP Request (获取订单)
  → 循环与迭代节点（外层循环）
    策略：遍历一个数组
    集合：$('HTTP Request').body.orders
    → [循环开始] → 循环与迭代节点（内层循环）
                  策略：遍历一个数组
                  集合：$loop.item.items
                  → [循环开始] → 处理订单项目
                  → [完成] → 聚合订单项目
    → [完成] → Answer (所有订单已处理)
```

## 最佳实践

### 1. 选择合适的执行模式

**使用串行模式当**：
- 操作依赖前序迭代
- 修改共享状态或全局变量
- 执行顺序很重要
- 一次处理一个项目更安全

**使用并行模式当**：
- 操作相互独立
- 性能至关重要
- 不修改共享状态
- 可以单独处理失败

### 2. 设置合理的限制

```javascript
// 好 - 设置最大迭代次数
{
  type: "iteration",
  collection: $('节点').items,
  max_iterations: 100  // 防止无限循环
}

// 不好 - 无限制（有风险）
{
  type: "iteration",
  collection: $('节点').items
  // 如果数组非常大，可能永远循环
}
```

### 3. 正确处理错误

```javascript
// 设置适当的最大错误数
{
  max_errors: 5,  // 5 个错误后停止
  exit_condition: {
    // 提前退出条件
  }
}
```

### 4. 有效使用循环变量

```javascript
// 初始化变量
variables: [
  {
    variable: "total_processed",
    value: 0,
    type: "number"
  },
  {
    variable: "current_item",
    value: $loop.item,  // 迭代模式下
    type: "object"
  }
]
```

### 5. 优化输出设置

```javascript
// 只输出必要的数据
output_item_settings: [
  {
    variable: "result",
    value: $('处理节点').output,  // 引用循环节点输出
    type: "object"
  }
]

// 然后在循环外访问结果
$('循环节点')[0].result  // 第一次迭代结果
$('循环节点').length      // 总迭代次数
```

### 6. 避免在并行模式下修改全局状态

::: warning
**并行模式下修改全局变量会导致执行顺序不可预知。使用串行模式或避免修改全局状态。**
:::

### 7. 使用退出循环节点实现提前退出

不要使用复杂的退出条件，在循环内使用退出循环节点可以获得更清晰的控制流。

## FAQ

### Q1: "按指定次数循环"和"遍历一个数组"有什么区别？

**A**：
- **按指定次数循环**：执行固定次数，与数据无关
- **遍历一个数组**：对数组中的每个项目执行一次

**选择指导**：
```yaml
按指定次数循环：重试逻辑、固定重复、轮询
遍历一个数组：处理数据项目、转换集合、批量操作
```

### Q2: 我可以在循环外访问循环结果吗？

**A**：可以，使用循环节点的输出：
```javascript
// 获取所有结果
$('循环节点')

// 获取特定迭代结果
$('循环节点')[0]  // 第一次迭代

// 获取所有迭代中的特定输出
$('循环节点').map(item => item.output_1)
```

### Q3: 如果一次迭代失败会怎样？

**A**：取决于设置：
- **串行模式**：循环立即终止
- **并行模式**：失败的迭代不影响其他迭代
- **最大错误数**：错误数达到限制时循环停止
- **错误处理**：决定工作流行为

### Q4: 我可以在循环内使用退出循环节点吗？

**A**：可以！退出循环节点可以在循环内使用以提前退出。详见[退出循环节点](/zh-hans/guide/workflow/nodes/control-nodes/break-loop)。

### Q5: 如何引用当前迭代编号？

**A**：使用 `$loop.index`：
```javascript
// 当前迭代索引（从 0 开始）
$loop.index

// 从 1 开始的索引
$loop.index + 1
```

### Q6: 可以嵌套循环吗？

**A**：可以，循环可以嵌套。内层循环在外层循环的每次迭代中执行。

### Q7: 最大迭代次数是多少？

**A**：
- **按指定次数循环**：最大 100（如果超过，只会运行 100 次）
- **遍历一个数组**：无硬性限制，但考虑使用 `max_iterations` 以保证安全

### Q8: 如何在退出条件中引用循环变量？

**A**：使用 `$loop.vars.变量名`：
```javascript
exit_condition: {
  leftValue: $loop.vars.counter,
  operator: "is_greater_than",
  rightValue: 100
}
```

## 下一步

- [退出循环节点](/zh-hans/guide/workflow/nodes/control-nodes/break-loop) - 提前退出循环
- [条件分支节点](/zh-hans/guide/workflow/nodes/action-nodes/if) - 在循环内添加条件逻辑
- [Code 节点](/zh-hans/guide/workflow/nodes/action-nodes/code) - 在循环中进行复杂数据处理

## 相关资源

- [表达式语法](/zh-hans/guide/expressions/) - 了解如何在循环配置中使用表达式
- [使用节点](/zh-hans/guide/working-with-nodes) - 通用节点操作指南

