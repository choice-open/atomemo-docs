---
title: 条件分支节点
description: 根据条件判断控制工作流执行路径
---

# 条件分支节点

条件分支节点（IF 节点）用于根据条件判断控制工作流的执行路径。它允许你基于数据、状态或计算结果来决定后续执行哪个分支，实现复杂的业务逻辑和决策流程。

## 使用场景

### 典型应用
- **数据验证** - 检查数据是否符合要求，决定继续处理或返回错误
- **状态判断** - 根据订单状态、用户等级等进行不同处理
- **错误处理** - 根据 API 响应状态码决定重试或报错
- **业务规则** - 实现复杂的业务逻辑判断（如折扣规则、权限控制）
- **A/B 测试** - 根据用户分组执行不同的处理流程
- **多路分发** - 根据分类结果路由到不同处理节点
- **阈值判断** - 根据数值大小决定告警级别或处理方式

## 节点配置

### 基础设置（参数面板）

#### 条件 (condition)

定义判断条件的逻辑规则。

**字段属性**:
- 必填字段
- 支持可视化条件编辑器
- 支持嵌套条件组
- 支持 AND/OR 逻辑运算

**条件结构**:
- **逻辑运算符**: AND（与）或 OR（或）
- **条件组**: 可以嵌套多层条件组
- **单个条件**: 由左值、操作符、右值组成

**单个条件组成**:

```javascript
{
  leftValue: $('节点名').字段,      // 左值：要判断的数据
  operator: "操作符",               // 操作符：比较方式
  rightValue: "比较值"              // 右值：比较的目标值
}
```

#### 类型不匹配时自动转换 (convertTypesWhereRequired)

当左值和右值类型不一致时，是否自动进行类型转换。

**默认值**: `false`

**用途**:
- `false` - 严格类型比较（推荐）
- `true` - 自动转换类型后比较

**示例**:
```javascript
// convertTypesWhereRequired = false
"123" === 123  // false（类型不同）

// convertTypesWhereRequired = true
"123" === 123  // true（自动转换后比较）
```

### 操作符详解

#### 字符串操作符 (String)

| 操作符 | 说明 | 需要右值 | 示例 |
|--------|------|----------|------|
| `is_equal_to` | 等于 | 是 | "hello" = "hello" |
| `is_not_equal_to` | 不等于 | 是 | "hello" ≠ "world" |
| `contains` | 包含 | 是 | "hello world" 包含 "world" |
| `does_not_contain` | 不包含 | 是 | "hello" 不包含 "world" |
| `starts_with` | 以...开头 | 是 | "hello" 以 "he" 开头 |
| `does_not_start_with` | 不以...开头 | 是 | "hello" 不以 "wo" 开头 |
| `ends_with` | 以...结尾 | 是 | "hello" 以 "lo" 结尾 |
| `does_not_end_with` | 不以...结尾 | 是 | "hello" 不以 "he" 结尾 |
| `matches_regex` | 匹配正则 | 是 | "test@email.com" 匹配 `^[\w\.-]+@[\w\.-]+$` |
| `does_not_match_regex` | 不匹配正则 | 是 | "invalid" 不匹配邮箱正则 |
| `exists` | 字段存在 | 否 | 检查字段是否存在 |
| `does_not_exist` | 字段不存在 | 否 | 检查字段是否不存在 |
| `is_empty` | 为空 | 否 | "" 或 null |
| `is_not_empty` | 不为空 | 否 | 有值 |

#### 数字操作符 (Number)

| 操作符 | 说明 | 需要右值 | 示例 |
|--------|------|----------|------|
| `is_equal_to` | 等于 | 是 | 100 = 100 |
| `is_not_equal_to` | 不等于 | 是 | 100 ≠ 200 |
| `is_greater_than` | 大于 | 是 | 100 > 50 |
| `is_greater_than_or_equal_to` | 大于等于 | 是 | 100 ≥ 100 |
| `is_less_than` | 小于 | 是 | 50 < 100 |
| `is_less_than_or_equal_to` | 小于等于 | 是 | 50 ≤ 50 |
| `exists` | 字段存在 | 否 | - |
| `does_not_exist` | 字段不存在 | 否 | - |
| `is_empty` | 为空 | 否 | null 或 undefined |
| `is_not_empty` | 不为空 | 否 | 有值 |

#### 日期时间操作符 (DateTime)

| 操作符 | 说明 | 需要右值 | 示例 |
|--------|------|----------|------|
| `is_equal_to` | 时间相等 | 是 | 2024-01-01 = 2024-01-01 |
| `is_not_equal_to` | 时间不等 | 是 | 2024-01-01 ≠ 2024-01-02 |
| `is_after` | 晚于 | 是 | 2024-02-01 > 2024-01-01 |
| `is_after_or_equal_to` | 晚于或等于 | 是 | 2024-02-01 ≥ 2024-02-01 |
| `is_before` | 早于 | 是 | 2024-01-01 < 2024-02-01 |
| `is_before_or_equal_to` | 早于或等于 | 是 | 2024-01-01 ≤ 2024-01-01 |
| `exists` | 字段存在 | 否 | - |
| `does_not_exist` | 字段不存在 | 否 | - |
| `is_empty` | 为空 | 否 | - |
| `is_not_empty` | 不为空 | 否 | - |

#### 布尔操作符 (Boolean)

| 操作符 | 说明 | 需要右值 | 示例 |
|--------|------|----------|------|
| `is_true` | 为真 | 否 | true |
| `is_false` | 为假 | 否 | false |
| `is_equal_to` | 等于 | 是 | true = true |
| `is_not_equal_to` | 不等于 | 是 | true ≠ false |
| `exists` | 字段存在 | 否 | - |
| `does_not_exist` | 字段不存在 | 否 | - |
| `is_empty` | 为空 | 否 | - |
| `is_not_empty` | 不为空 | 否 | - |

#### 数组操作符 (Array)

| 操作符 | 说明 | 需要右值 | 示例 |
|--------|------|----------|------|
| `contains` | 包含元素 | 是 | [1,2,3] 包含 2 |
| `does_not_contain` | 不包含元素 | 是 | [1,2,3] 不包含 4 |
| `length_equal_to` | 长度等于 | 是 | [1,2,3] 长度 = 3 |
| `length_not_equal_to` | 长度不等于 | 是 | [1,2,3] 长度 ≠ 2 |
| `length_greater_than` | 长度大于 | 是 | [1,2,3] 长度 > 2 |
| `length_greater_than_or_equal_to` | 长度大于等于 | 是 | [1,2,3] 长度 ≥ 3 |
| `length_less_than` | 长度小于 | 是 | [1,2] 长度 < 3 |
| `length_less_than_or_equal_to` | 长度小于等于 | 是 | [1,2] 长度 ≤ 2 |
| `exists` | 字段存在 | 否 | - |
| `does_not_exist` | 字段不存在 | 否 | - |
| `is_empty` | 为空数组 | 否 | [] |
| `is_not_empty` | 非空数组 | 否 | [1,2] |

#### 对象操作符 (Object)

| 操作符 | 说明 | 需要右值 | 示例 |
|--------|------|----------|------|
| `exists` | 字段存在 | 否 | 对象存在 |
| `does_not_exist` | 字段不存在 | 否 | 对象不存在 |
| `is_empty` | 为空对象 | 否 | {} |
| `is_not_empty` | 非空对象 | 否 | {name: "test"} |

### 逻辑运算符

#### AND（与）

所有条件都必须满足。

**示例**:
```javascript
条件组 (AND):
  - $('用户').age >= 18
  - $('用户').verified === true
  - $('用户').country === "CN"

// 只有当三个条件都满足时，结果才为 true
```

#### OR（或）

任一条件满足即可。

**示例**:
```javascript
条件组 (OR):
  - $('订单').amount > 1000
  - $('用户').vipLevel === "platinum"
  - $('促销').code === "SPECIAL"

// 只要有一个条件满足，结果就为 true
```

### 高级设置（设置面板）

#### 忽略大小写 (ignoreCase)

字符串比较时是否忽略大小写。

**默认值**: `false`

**示例**:
```javascript
// ignoreCase = false
"Hello" === "hello"  // false

// ignoreCase = true
"Hello" === "hello"  // true
```

#### 总是输出 (alwaysOutput)

即使条件不满足也输出空项。

**默认值**: `false`

#### 仅执行一次 (executeOnce)

是否仅使用第一个输入项执行一次。

**默认值**: `false`

#### 失败重试 (retryOnFail)

条件判断失败时是否自动重试。

**默认值**: `false`

#### 最大重试次数 (maxTries)

失败后的最大重试次数。

**默认值**: `3`

#### 重试等待时间 (waitBetweenTries)

每次重试之间的等待时间（毫秒）。

**默认值**: `1000` (1秒)

#### 错误处理 (onError)

条件判断出错时的处理方式。

**可选值**:
- `stopWorkflow` - 停止整个工作流（默认）
- `continueRegularOutput` - 继续执行
- `continueErrorOutput` - 继续执行，使用错误输出

#### 节点描述 (nodeDescription)

为节点添加自定义描述。

```yaml
nodeDescription: "验证用户资格并分流"
```

## 输出和分支

条件分支节点有两个输出分支：

- **True 分支**: 条件满足时执行
- **False 分支**: 条件不满足时执行

```javascript
// 无需通过表达式访问输出
// 直接连接 true/false 分支到后续节点
```

## 工作流示例

### 示例 1: 简单数据验证

```
实体识别节点
  → 条件分支节点
    条件 (AND):
      - $('实体识别').email 匹配正则 ^[\w\.-]+@[\w\.-]+\.\w+$
      - $('实体识别').phone 匹配正则 ^1[3-9]\d{9}$
      - $('实体识别').name 不为空
    → [True] → HTTP请求（创建客户）→ 回答（创建成功）
    → [False] → 回答（信息不完整，请检查邮箱和电话格式）
```

### 示例 2: 订单金额分级处理

```
HTTP请求（获取订单信息）
  → 条件分支节点 A
    条件: $('HTTP请求').body.amount >= 10000
    → [True] → 回答（大额订单，需要人工审核）
    → [False] → 条件分支节点 B
      条件: $('HTTP请求').body.amount >= 1000
      → [True] → HTTP请求（自动审核）→ 回答（订单已审核通过）
      → [False] → HTTP请求（快速处理）→ 回答（订单已处理）
```

### 示例 3: 用户等级判断

```
聊天触发器
  → HTTP请求（获取用户信息）
  → 条件分支节点
    条件 (OR):
      - $('HTTP请求').body.vipLevel === "platinum"
      - $('HTTP请求').body.vipLevel === "gold"
    → [True] → LLM节点（VIP专属服务）→ 回答
    → [False] → LLM节点（标准服务）→ 回答
```

### 示例 4: 多条件组合判断

```
AI分类器
  → 条件分支节点
    条件组 (AND):
      条件 1: $('AI分类器').class === "urgent"
      条件 2 (OR):
        - $('AI分类器').confidence > 0.8
        - $('聊天触发器').message 包含 "紧急"
      条件 3: $('HTTP请求').userStatus === "active"
    → [True] → HTTP请求（紧急通道）→ 回答（已加急处理）
    → [False] → HTTP请求（普通通道）→ 回答（正常处理中）
```

### 示例 5: API 响应状态处理

```
HTTP请求节点
  → 条件分支节点 A
    条件: $('HTTP请求').statusCode === 200
    → [True] → 条件分支节点 B（检查业务状态）
      条件: $('HTTP请求').body.success === true
      → [True] → 回答（操作成功）
      → [False] → 回答（业务处理失败：${$('HTTP请求').body.message}）
    → [False] → 条件分支节点 C（处理 HTTP 错误）
      条件: $('HTTP请求').statusCode === 404
      → [True] → 回答（资源未找到）
      → [False] → 条件分支节点 D
        条件: $('HTTP请求').statusCode >= 500
        → [True] → 回答（服务器错误，请稍后重试）
        → [False] → 回答（请求失败，请检查输入）
```

### 示例 6: 数组长度检查

```
知识检索节点
  → 条件分支节点
    条件 (AND):
      - $('知识检索').results 不为空
      - $('知识检索').results 长度大于 0
    → [True] → 条件分支节点（检查结果质量）
      条件: $('知识检索').results[0].score >= 0.7
      → [True] → LLM节点（基于知识生成回答）
      → [False] → 回答（找到相关信息，但相关度较低，请调整问题）
    → [False] → 回答（未找到相关信息，请换个方式提问）
```

### 示例 7: 正则表达式验证

```
聊天触发器
  → 条件分支节点
    条件 (OR):
      - $('聊天触发器').message 匹配正则 ORD-\d{6}
      - $('聊天触发器').message 匹配正则 订单号[:：]\s*(\d{6})
    → [True] → 实体识别节点（提取订单号）
      → HTTP请求（查询订单）
      → 回答（订单详情）
    → [False] → 回答（请提供正确的订单号，格式如：ORD-123456）
```

### 示例 8: 时间范围判断

```
Webhook触发器
  → 代码节点（获取当前时间和工作时间）
  → 条件分支节点
    条件 (AND):
      - $('代码').currentHour >= 9
      - $('代码').currentHour < 18
      - $('代码').isWeekday === true
    → [True] → HTTP请求（人工客服）→ 回答（已转接人工客服）
    → [False] → LLM节点（AI客服）→ 回答（当前非工作时间，AI为您服务）
```

## 最佳实践

### 1. 合理组织条件逻辑

**使用条件组简化复杂逻辑**
```javascript
// 清晰的条件组织
条件组 (AND):
  条件组 A (OR):  // VIP 用户
    - vipLevel === "platinum"
    - vipLevel === "gold"
  条件组 B (AND):  // 订单条件
    - amount > 1000
    - status === "pending"
```

**避免过度嵌套**
```javascript
// 不好 - 过度嵌套
IF (条件A)
  → IF (条件B)
    → IF (条件C)
      → IF (条件D)

// 好 - 使用条件组
IF (条件A AND 条件B AND 条件C AND 条件D)
```

### 2. 选择合适的操作符

**字符串比较**
```javascript
// 精确匹配
$('节点').status === "completed"

// 模糊匹配
$('节点').message 包含 "错误"

// 正则匹配（复杂模式）
$('节点').email 匹配正则 ^[\w\.-]+@[\w\.-]+\.\w+$
```

**数字比较**
```javascript
// 范围判断 - 使用 AND 组合
$('节点').score >= 60 AND $('节点').score <= 100

// 阈值判断
$('节点').temperature > 100  // 超过阈值
```

### 3. 处理空值和不存在的字段

**先检查字段存在性**
```javascript
// 好的做法
条件组 (AND):
  - $('节点').data 存在
  - $('节点').data.value > 0

// 不好的做法（可能报错）
$('节点').data.value > 0  // 如果 data 不存在会报错
```

**使用 is_empty 和 is_not_empty**
```javascript
// 检查字符串非空
$('节点').name 不为空

// 检查数组非空
$('节点').items 不为空
```

### 4. 优化条件性能

**将最常见的条件放在前面（OR）**
```javascript
// OR 条件：先判断最常见的情况
条件组 (OR):
  - status === "active"     // 最常见，80%
  - status === "pending"    // 较常见，15%
  - status === "trial"      // 不常见，5%
```

**将最快失败的条件放在前面（AND）**
```javascript
// AND 条件：先判断最可能失败的
条件组 (AND):
  - type === "premium"      // 快速判断，容易失败
  - amount > 10000          // 数字比较
  - validateComplexRule()   // 复杂验证，放最后
```

### 5. 使用有意义的条件分组命名

```javascript
// 在可视化编辑器中为条件组命名
条件组 "VIP 用户检查" (OR):
  - vipLevel === "platinum"
  - vipLevel === "gold"

条件组 "订单金额验证" (AND):
  - amount > 0
  - amount <= 100000
```

### 6. 处理边界情况

**数字边界**
```javascript
// 明确边界条件
条件组 "有效分数" (AND):
  - score >= 0
  - score <= 100
```

**日期边界**
```javascript
// 日期范围判断
条件组 "活动期间" (AND):
  - currentDate >= startDate
  - currentDate <= endDate
```

### 7. 布尔逻辑简化

**直接使用布尔操作符**
```javascript
// 好
$('节点').isActive 为真

// 不好
$('节点').isActive === true
```

**利用 OR 简化多个相等判断**
```javascript
// 使用 OR
条件组 (OR):
  - status === "completed"
  - status === "success"
  - status === "done"

// 或者使用数组包含（在代码节点中预处理）
["completed", "success", "done"].includes($('节点').status)
```

## 常见问题

### Q1: 条件分支和代码节点中的 if 语句有什么区别？

**A**:
- **条件分支节点**: 可视化配置，工作流图清晰，适合简单到中等复杂度的条件判断
- **代码节点**: 编程实现，适合复杂逻辑、多重判断、需要计算的条件

**选择建议**:
```yaml
条件分支节点: 数据比较、状态判断、阈值检查
代码节点: 复杂算法、多步骤判断、需要循环的逻辑
```

### Q2: 如何实现多路分支（超过 2 个分支）？

**A**: 使用嵌套的条件分支节点：

```
条件分支 A
  → [True] → 处理 A
  → [False] → 条件分支 B
    → [True] → 处理 B
    → [False] → 条件分支 C
      → [True] → 处理 C
      → [False] → 默认处理
```

或者使用 AI 分类器节点进行多路分类。

### Q3: 正则表达式怎么写？

**A**: 常用正则表达式示例：

```javascript
// 邮箱
^[\w\.-]+@[\w\.-]+\.\w+$

// 中国大陆手机号
^1[3-9]\d{9}$

// 身份证号
^\d{17}[\dXx]$

// URL
^https?:\/\/.+

// 订单号（自定义格式）
^ORD-\d{6}$

// 日期 YYYY-MM-DD
^\d{4}-\d{2}-\d{2}$
```

### Q4: 如何调试条件不生效的问题？

**A**: 调试步骤：

1. **检查左值是否有值**
   ```javascript
   添加回答节点显示左值：
   $('节点').字段
   ```

2. **检查数据类型**
   ```javascript
   // 在代码节点中检查类型
   typeof $('节点').字段
   ```

3. **启用类型自动转换**
   ```yaml
   convertTypesWhereRequired: true
   ```

4. **使用代码节点打印完整数据**
   ```javascript
   JSON.stringify($('节点'))
   ```

### Q5: 条件中可以使用函数或计算吗？

**A**: 不能直接在条件中使用复杂表达式。解决方案：

```javascript
// 先在代码节点中计算
代码节点:
  function main({value}) {
      return {
          isValid: value > 100 && value < 1000,
          category: value > 500 ? "high" : "low"
      }
  }

// 然后在条件分支中判断
条件分支:
  $('代码').isValid === true
```

### Q6: 如何实现"不等于任何一个值"的判断？

**A**: 使用 AND 组合多个不等于：

```javascript
条件组 (AND):
  - status 不等于 "draft"
  - status 不等于 "deleted"
  - status 不等于 "archived"
```

或在代码节点中使用数组：

```javascript
!["draft", "deleted", "archived"].includes($('节点').status)
```

### Q7: 条件中的字符串比较区分大小写吗？

**A**: 默认区分大小写。如需忽略大小写：

1. **启用 ignoreCase 设置**
   ```yaml
   ignoreCase: true
   ```

2. **在代码节点中转换**
   ```javascript
   $('节点').value.toLowerCase()
   ```

### Q8: 如何判断数组是否包含某个对象？

**A**:
- 简单值：直接使用"包含"操作符
- 复杂对象：使用代码节点

```javascript
// 代码节点
function main({items, targetId}) {
    const found = items.some(item => item.id === targetId)
    return {found}
}

// 条件分支
$('代码').found === true
```

### Q9: 可以在一个条件分支节点中使用多个 OR 和 AND 吗？

**A**: 可以，使用嵌套条件组：

```javascript
条件组 (AND):
  条件组 A (OR):
    - condition1
    - condition2
  条件组 B (OR):
    - condition3
    - condition4
```

这相当于：`(condition1 OR condition2) AND (condition3 OR condition4)`

## 下一步

- [代码节点](/zh-hans/guide/workflow/nodes/action-nodes/code) - 实现复杂条件逻辑
- [AI 分类器](/zh-hans/guide/workflow/nodes/action-nodes/ai-classifier) - 智能多路分类
- [HTTP 请求节点](/zh-hans/guide/workflow/nodes/action-nodes/http-request) - 获取判断所需的数据

## 相关资源

- [表达式语法](/zh-hans/guide/expressions/) - 学习如何在条件中使用表达式
- [回答节点](/zh-hans/guide/workflow/nodes/action-nodes/answer) - 根据条件返回不同回复
