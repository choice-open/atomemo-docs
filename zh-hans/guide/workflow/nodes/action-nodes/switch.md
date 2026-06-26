---
title: Switch 分支
description: 根据条件将数据路由到多个分支 — 数据会流入所有匹配的分支
---

# Switch 分支

Switch 节点并行评估多个条件，将数据路由到**所有**条件匹配的分支。与 [条件分支](/zh-hans/guide/workflow/nodes/action-nodes/if) 节点（数据只走一条路径）不同，Switch 是**多路匹配**路由器——如果数据满足多个分支的条件，它会同时流入**每一个匹配的分支**。

## 使用场景

### 典型应用
- **多类别标签** — 根据重叠的标准为项目添加多个标签
- **并行通知** — 当多个阈值条件同时满足时向不同渠道发送告警
- **数据路由** — 将传入数据路由到多个下游处理器，每个处理不同的关注点
- **功能开关** — 根据条件同时激活多个功能路径
- **用户分群** — 将用户归类到多个重叠的细分群体中

## 节点配置

### 基础设置（参数面板）

#### 分支

Switch 节点由一个或多个**分支**组成。每个分支有一个索引（从 `0` 开始）、一个可选名称和一个决定数据是否流入的条件。

| 属性 | 说明 |
| --- | --- |
| **Index**（索引） | 自动分配的从 0 开始的位置，由分支在列表中的顺序决定 |
| **Name**（名称） | 可选标签。设置后，输出端口显示此名称而非数字索引 |
| **Condition**（条件） | 定义数据何时进入此分支（见下文） |

**分支操作**：
- **添加分支** — 追加新分支并设置其条件
- **复制分支** — 复制已有分支（包括其条件）
- **删除分支** — 移除分支
- **排序** — 拖拽分支更改顺序（索引自动更新）

> **命名约定**：默认分支显示为 `0`、`1`、`2`…。如果设置了名称（如 `VIP 客户`），输出端口将显示该名称而非 `0`。

#### 条件

每个分支包含一个或多个**条件**，组织在**条件组**中。条件支持多层嵌套以构建复杂逻辑。

##### 条件（Condition）

两个值之间的单个比较：

| 字段 | 说明 |
| --- | --- |
| **Left Value**（左值） | 要测试的值 — 支持 [表达式](/zh-hans/guide/expressions/) |
| **Operator**（运算符） | 比较运算符（见下方表格） |
| **Right Value**（右值） | 要比较的值 — 支持表达式 |

##### 条件组（Condition Group）

使用 `AND` 或 `OR` 组合多个条件的逻辑容器：

```
条件组（AND）
  ├─ 条件：status is_equal_to "active"
  ├─ 条件：age is_greater_than 18
  └─ 条件组（OR）
       ├─ 条件：plan is_equal_to "premium"
       └─ 条件：plan is_equal_to "enterprise"
```

条件组可嵌套任意深度，支持构建任意复杂的条件逻辑。

##### 支持的运算符

运算符按数据类型组织。可用的运算符取决于你选择的类型：

**字符串运算符**（type: `string`）：

| 运算符 | 说明 | 示例 |
| --- | --- | --- |
| `is_equal_to` | 相等 | `"active" is_equal_to "active"` → true |
| `is_not_equal_to` | 不相等 | `"draft" is_not_equal_to "active"` → true |
| `contains` | 包含子串 | `"hello world" contains "world"` → true |
| `does_not_contain` | 不包含 | `"hello" does_not_contain "z"` → true |
| `starts_with` | 以…开头 | `"order_123" starts_with "order_"` → true |
| `does_not_start_with` | 不以…开头 | `"abc" does_not_start_with "z"` → true |
| `ends_with` | 以…结尾 | `"file.pdf" ends_with ".pdf"` → true |
| `does_not_end_with` | 不以…结尾 | `"file.txt" does_not_end_with ".pdf"` → true |
| `matches_regex` | 匹配正则 | `"abc123" matches_regex "^[a-z]+\\d+$"` → true |
| `does_not_match_regex` | 不匹配正则 | `"abc" does_not_match_regex "\\d+"` → true |
| `is_empty` | 为空字符串 | `"" is_empty` → true |
| `is_not_empty` | 不为空 | `"hello" is_not_empty` → true |

**数字运算符**（type: `number`）：

| 运算符 | 说明 |
| --- | --- |
| `is_equal_to` | 等于 |
| `is_not_equal_to` | 不等于 |
| `is_less_than` | 小于 |
| `is_less_than_or_equal_to` | 小于等于 |
| `is_greater_than` | 大于 |
| `is_greater_than_or_equal_to` | 大于等于 |

**日期/时间运算符**（type: `dateTime`）：

| 运算符 | 说明 |
| --- | --- |
| `is_equal_to` | 相同时间 |
| `is_not_equal_to` | 不同时间 |
| `is_less_than` | 早于 |
| `is_less_than_or_equal_to` | 早于或等于 |
| `is_greater_than` | 晚于 |
| `is_greater_than_or_equal_to` | 晚于或等于 |

**布尔运算符**（type: `boolean`）：

| 运算符 | 说明 |
| --- | --- |
| `is_true` | 值为 `true` |
| `is_false` | 值为 `false` |

**数组运算符**（type: `array`）：

| 运算符 | 说明 |
| --- | --- |
| `contains` | 数组包含元素 |
| `does_not_contain` | 数组不包含元素 |
| `is_empty` | 数组为空（`[]`） |
| `is_not_empty` | 数组不为空 |
| `length_equal_to` | 长度等于 N |
| `length_not_equal_to` | 长度不等于 N |
| `length_greater_than` | 长度大于 N |
| `length_greater_than_or_equal_to` | 长度 >= N |
| `length_less_than` | 长度小于 N |
| `length_less_than_or_equal_to` | 长度 <= N |

**对象运算符**（type: `object`）：

| 运算符 | 说明 |
| --- | --- |
| `is_empty` | 对象为空（`{}`） |
| `is_not_empty` | 对象不为空 |

**通用运算符**（适用于所有类型）：

| 运算符 | 说明 |
| --- | --- |
| `exists` | 值不为 `null` / `nil` |
| `does_not_exist` | 值为 `null` / `nil` |
| `is_empty` | 值为空（`""`、`[]`、`{}`、`nil`） |
| `is_not_empty` | 值不为空 |

### 高级设置（设置面板）

#### 节点描述

添加自定义描述，记录分支逻辑：

```yaml
nodeDescription: "按套餐类型和活动状态路由客户。
分支 0: VIP 活跃用户
分支 1: Premium 用户
分支 2: 其他所有用户（兜底）"
```

## 行为

### 多路匹配路由

Switch 节点**独立评估**每个分支的条件。数据流入**所有**条件结果为 `true` 的分支。这与 [条件分支](/zh-hans/guide/workflow/nodes/action-nodes/if) 节点（数据只走第一条匹配路径）有本质区别。

```
Switch 节点
  ├─ 分支 0: plan is_equal_to "premium"        → 匹配 ✓
  ├─ 分支 1: status is_equal_to "active"       → 匹配 ✓
  └─ 分支 2: spend is_greater_than 1000        → 匹配 ✓

结果：数据同时流入分支 0、分支 1 和分支 2
```

### 评估顺序

分支按索引顺序（0 → 1 → 2 → …）评估。但顺序**不影响**哪些分支会匹配——无论前面的结果如何，所有分支都会被评估。

### 错误处理

如果某个分支的条件评估遇到错误（例如用 `is_greater_than` 比较字符串和数字这类不兼容的类型），**整个** Switch 节点会报错。错误不会被静默忽略——它会传播到错误输出端口。

```
Switch 节点
  ├─ 分支 0: name is_greater_than 100           → 错误！（字符串 vs 数字）
  └─ 分支 1: status is_equal_to "active"        → 不会被执行

结果：Switch 节点报错
```

要优雅地处理这种情况，请确保条件类型兼容，或在 Switch 之前使用 [代码节点](/zh-hans/guide/workflow/nodes/action-nodes/code) 预验证数据。

## 工作流示例

### 示例 1：多类别标签

为传入订单添加所有适用的类别标签：

```
Webhook 触发器（POST，订单数据）
  → Switch
      分支 0 "高价值": $('Webhook 触发器').body.total is_greater_than 1000
      分支 1 "新客户": $('Webhook 触发器').body.isNewCustomer is_true
      分支 2 "国际订单": $('Webhook 触发器').body.country is_not_equal_to "CN"

  → 分支 0 "高价值" → 代码节点（添加 "high_value" 标签）
  → 分支 1 "新客户" → 代码节点（添加 "new_customer" 标签）
  → 分支 2 "国际订单" → 代码节点（添加 "international" 标签）
```

### 示例 2：并行通知

当多个条件同时触发时向不同渠道发送告警：

```
定时触发器（每小时）
  → HTTP 请求（获取指标）
  → Switch
      分支 0 "CPU 告警": $('HTTP 请求').body.cpu is_greater_than 90
      分支 1 "内存告警": $('HTTP 请求').body.memory is_greater_than 85
      分支 2 "磁盘告警": $('HTTP 请求').body.disk is_greater_than 95

  → 分支 0 "CPU 告警" → HTTP 请求（飞书 #运维群）
  → 分支 1 "内存告警" → HTTP 请求（飞书 #运维群）
  → 分支 2 "磁盘告警" → HTTP 请求（PagerDuty）
```

### 示例 3：嵌套条件

使用条件组构建复杂逻辑：

```
Webhook 触发器（POST，用户事件）
  → Switch
      分支 0 "VIP 互动":
        条件组（AND）
          ├─ plan is_equal_to "premium"
          └─ 条件组（OR）
               ├─ event is_equal_to "purchase"
               └─ event is_equal_to "upgrade"

      分支 1 "流失风险":
        条件组（AND）
          ├─ status is_equal_to "active"
          ├─ lastLogin is_less_than "2026-01-01"
          └─ spend is_less_than 50
```

### 示例 4：兜底分支

使用一个始终为真的条件创建"兜底"分支来捕获所有未匹配的情况：

```
Webhook 触发器
  → Switch
      分支 0 "特殊处理": type is_equal_to "special"
      分支 1 "常规处理": type is_equal_to "normal"
      分支 2 "其他": type exists   ← 只要 'type' 字段存在就始终为真
```

## 约束条件

### 无内建兜底

Switch 节点**没有**内建的 "else" 或 "default" 分支。如果没有条件匹配，则不会激活任何输出端口，数据在 Switch 处停止。如需兜底，添加一个始终为真的条件分支（如 `1 is_equal_to 1`）。

### 条件评估是"全有或全无"

如果**任意**分支的条件抛出评估错误，整个 Switch 节点报错。所有分支——包括那些本应匹配的分支——都会被跳过。

### 输出端口基于匹配

只有匹配的分支才产生输出。连接到未匹配分支的下游节点不会执行。确保所有连接的下游路径能够处理可能收不到数据的情况。

## 最佳实践

### 1. 为分支命名

使用描述性名称而非数字索引：

```
[Switch]                    ← 默认
  ├─ 0: 第一个分支
  ├─ 1: 第二个分支

[客户路由]                   ← 更好
  ├─ VIP 活跃: plan is_equal_to "premium" AND status is_equal_to "active"
  ├─ 流失风险: lastLogin is_less_than "2026-01-01"
```

### 2. 保持条件类型安全

确保左右值的类型兼容，避免评估错误：

```yaml
# ✓ 安全 — 同为字符串
left: $('Webhook 触发器').body.status
operator: string.is_equal_to
right: "active"

# ✗ 有风险 — 将字符串与数字比较
left: $('Webhook 触发器').body.name
operator: number.is_greater_than
right: 100
```

### 3. 添加诊断用兜底分支

即使你认为已覆盖所有情况，也添加一个诊断分支：

```
分支 N "未匹配": 1 is_equal_to 1
  → 记录 "意外数据: " + $json → Webhook 响应（200）
```

这有助于在开发期间捕获边缘情况。

### 4. 记录复杂条件

使用节点描述向团队成员解释分支逻辑：

```yaml
nodeDescription: "订单路由:
- 分支 0: 高价值（总额 > ¥1000）
- 分支 1: 需审核（国际订单 + 新客户）
- 分支 2: 标准处理（其他通过兜底分支处理）"
```

## 常见问题

### Q1: Switch 和条件分支节点有什么区别？

**A**：

| 特性 | Switch | 条件分支 |
| --- | --- | --- |
| 分支数 | N 个分支（无限制） | 2 个分支（true/false） |
| 匹配方式 | **所有**匹配分支都接收数据 | 只有**第一个**匹配路径接收数据 |
| 使用场景 | 多类别路由、并行处理 | If/else 二元决策 |
| 兜底 | 无内建 else（使用通用条件） | 内建 else 分支 |

### Q2: 如果没有分支匹配会怎样？

**A**: 不会激活任何输出端口。数据在 Switch 节点停止，下游节点不执行。如果需要处理未匹配的情况，添加一个始终为真的兜底条件分支。

### Q3: 分支可以不设条件吗？

**A**: 不能。Switch 节点的 `conditions` 字段是必填的。每个分支必须至少有一个条件或条件组。

### Q4: 条件组的嵌套深度有限制吗？

**A**: 没有硬性限制。条件组可嵌套任意深度（`ConditionGroup` → `ConditionGroup` → …）。但深度嵌套的条件难以阅读——对于极其复杂的逻辑，考虑使用 [代码节点](/zh-hans/guide/workflow/nodes/action-nodes/code)。

### Q5: 分支顺序会影响哪些分支匹配吗？

**A**: 不会。所有分支独立评估。顺序仅影响输出端口索引（以及多分支匹配时下游节点的执行顺序）。

### Q6: 条件值中可以使用表达式吗？

**A**: 可以。`left_value` 和 `right_value` 都支持完整的 [表达式语法](/zh-hans/guide/expressions/)。可以引用任意上游节点的输出。

## 下一步

- [条件分支](/zh-hans/guide/workflow/nodes/action-nodes/if) — 二元 if/else 路由
- [代码节点](/zh-hans/guide/workflow/nodes/action-nodes/code) — 在分支前预验证数据
- [表达式语法](/zh-hans/guide/expressions/) — 构建动态条件值

## 相关资源

- [执行子流程](/zh-hans/guide/workflow/nodes/action-nodes/execute-sub-workflow) — 从匹配分支中调用子流程
- [循环与迭代](/zh-hans/guide/workflow/nodes/control-nodes/loop-iterate) — 分支后对数据执行循环
- [Webhook 响应](/zh-hans/guide/workflow/nodes/action-nodes/webhook-response) — 按分支返回不同响应
