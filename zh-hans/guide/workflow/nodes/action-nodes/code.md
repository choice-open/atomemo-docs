---
title: 代码节点
description: 使用 Python 或 JavaScript 代码扩展工作流功能
---

# 代码节点

代码节点允许你在工作流中执行自定义的 Python 或 JavaScript 代码，实现复杂的数据转换、业务逻辑和算法处理。它提供了灵活的输入输出机制，让你可以将工作流数据传递给代码，并获取执行结果。

## 使用场景

### 典型应用
- **复杂数据处理** - 实现工作流表达式无法完成的复杂转换逻辑
- **自定义算法** - 执行特定的计算或算法处理
- **数据验证** - 使用代码实现复杂的数据验证规则
- **格式转换** - 在不同数据格式间进行转换（JSON、XML、CSV 等）
- **业务逻辑** - 实现特定的业务规则和计算逻辑
- **第三方库集成** - 利用 Python/JavaScript 生态中的丰富库

## 节点配置

### 基础设置（参数面板）

#### 代码内容 (code)

要执行的代码。这是必填参数。

**字段属性**:
- 必填字段
- 支持 Python3 和 JavaScript
- 多行代码编辑器
- 语法高亮和自动补全

**Python3 示例**:

```python
def main(arg1: str, arg2: str):
    return {
        "result": arg1 + arg2,
    }
```

**JavaScript 示例**:

```javascript
function main({arg1, arg2}) {
    return {
        result: arg1 + arg2
    }
}
```

#### 编程语言 (lang)

选择代码的编程语言。

**可选值**:
- `python3` - Python 3.x（默认）
- `javascript` - JavaScript (ES6+)

#### 输入参数 (inputs)

定义传递给代码的输入变量。

**字段属性**:
- 数组类型，可添加多个输入
- 每个输入包含：
  - `variable` - 变量名（必填，需符合变量命名规则）
  - `value` - 变量值（必填，支持表达式）
- 变量名不能重复
- 默认提供 `arg1` 和 `arg2` 两个输入

**配置示例**:

```javascript
// 输入 1
variable: "userMessage"
value: $('Webhook触发器').body.message

// 输入 2
variable: "userId"
value: $('Webhook触发器').body.userId

// 输入 3
variable: "timestamp"
value: new Date().toISOString()
```

#### 输出变量 (outputs)

定义代码返回的输出变量及其类型。

**字段属性**:
- 数组类型，可添加多个输出
- 每个输出包含：
  - `variable` - 变量名（必填，需符合变量命名规则）
  - `type` - 数据类型（必填）
- 变量名不能重复
- 默认提供一个 `result` 输出（类型为 string）

**支持的数据类型**:
- `string` - 字符串
- `number` - 数字
- `boolean` - 布尔值
- `object` - 对象
- `array[string]` - 字符串数组
- `array[number]` - 数字数组
- `array[boolean]` - 布尔值数组
- `array[object]` - 对象数组

**配置示例**:

```javascript
// 输出 1
variable: "result"
type: "string"

// 输出 2
variable: "count"
type: "number"

// 输出 3
variable: "items"
type: "array[object]"
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
- 当上游节点返回多个项时，默认会对每个项执行代码
- 启用此选项后，只对第一个项执行，提高性能

#### 失败重试 (retryOnFail)

代码执行失败时是否自动重试。

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

代码执行失败时的处理方式。

**可选值**:
- `stopWorkflow` - 停止整个工作流（默认）
- `continueRegularOutput` - 继续执行，使用常规输出
- `continueErrorOutput` - 继续执行，使用错误输出

#### 节点描述 (nodeDescription)

为节点添加自定义描述。

```yaml
nodeDescription: "处理用户输入并计算推荐结果"
```

## 代码编写指南

### Python3 代码规范

#### 基本结构

```python
def main(arg1, arg2, arg3):
    # 你的代码逻辑

    # 返回字典，键名对应输出变量名
    return {
        "result": "处理结果",
        "count": 42,
        "items": [1, 2, 3]
    }
```

#### 类型注解

```python
def main(user_id: str, score: int) -> dict:
    return {
        "message": f"User {user_id} scored {score}"
    }
```

#### 错误处理

```python
def main(data: str):
    try:
        parsed = json.loads(data)
        return {"result": parsed}
    except Exception as e:
        raise ValueError(f"JSON 解析失败: {str(e)}")
```

#### 使用标准库

```python
import json
import re
from datetime import datetime

def main(text: str):
    # 使用正则提取邮箱
    emails = re.findall(r'[\w\.-]+@[\w\.-]+', text)

    return {
        "emails": emails,
        "count": len(emails),
        "timestamp": datetime.now().isoformat()
    }
```

### JavaScript 代码规范

#### 基本结构

```javascript
function main({arg1, arg2, arg3}) {
    // 你的代码逻辑

    // 返回对象，键名对应输出变量名
    return {
        result: "处理结果",
        count: 42,
        items: [1, 2, 3]
    }
}
```

#### 箭头函数

```javascript
const main = ({userId, score}) => {
    return {
        message: `User ${userId} scored ${score}`
    }
}
```

#### 错误处理

```javascript
function main({data}) {
    try {
        const parsed = JSON.parse(data)
        return {result: parsed}
    } catch (e) {
        throw new Error(`JSON 解析失败: ${e.message}`)
    }
}
```

#### 使用现代 JavaScript

```javascript
function main({items, threshold}) {
    // 数组操作
    const filtered = items.filter(item => item.value > threshold)
    const mapped = filtered.map(item => ({
        ...item,
        processed: true
    }))

    // 对象展开
    const result = {
        items: mapped,
        total: mapped.length,
        timestamp: new Date().toISOString()
    }

    return result
}
```

## 输出数据

代码节点的输出由你在 `outputs` 中定义的变量决定。

```javascript
// 访问单个输出变量
$('代码').result
$('代码').count
$('代码').items

// 访问数组输出
$('代码').items[0]
$('代码').items.length

// 访问对象输出
$('代码').data.name
$('代码').data.age
```

## 工作流示例

### 示例 1: 数据清洗和验证

```
Webhook触发器
  → 代码节点
    语言: Python3
    输入:
      - email: $('Webhook触发器').body.email
      - phone: $('Webhook触发器').body.phone
    代码:
      import re

      def main(email: str, phone: str):
          # 验证邮箱
          email_valid = bool(re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', email))

          # 清洗电话号码（移除非数字字符）
          phone_clean = re.sub(r'\D', '', phone)
          phone_valid = len(phone_clean) == 11

          return {
              "email_valid": email_valid,
              "phone_valid": phone_valid,
              "phone_clean": phone_clean,
              "all_valid": email_valid and phone_valid
          }
    输出:
      - email_valid: boolean
      - phone_valid: boolean
      - phone_clean: string
      - all_valid: boolean
  → 条件分支
    条件: $('代码').all_valid === true
```

### 示例 2: 复杂业务计算

```
HTTP请求（查询订单数据）
  → 代码节点
    语言: JavaScript
    输入:
      - orders: $('HTTP请求').body.orders
      - taxRate: 0.13
    代码:
      function main({orders, taxRate}) {
          // 计算订单统计
          const stats = orders.reduce((acc, order) => {
              const subtotal = order.items.reduce((sum, item) =>
                  sum + (item.price * item.quantity), 0)
              const tax = subtotal * taxRate
              const total = subtotal + tax

              return {
                  count: acc.count + 1,
                  subtotal: acc.subtotal + subtotal,
                  tax: acc.tax + tax,
                  total: acc.total + total
              }
          }, {count: 0, subtotal: 0, tax: 0, total: 0})

          return {
              orderCount: stats.count,
              subtotal: stats.subtotal.toFixed(2),
              tax: stats.tax.toFixed(2),
              total: stats.total.toFixed(2),
              avgOrderValue: (stats.total / stats.count).toFixed(2)
          }
      }
    输出:
      - orderCount: number
      - subtotal: string
      - tax: string
      - total: string
      - avgOrderValue: string
  → 回答节点
```

### 示例 3: 文本处理和分析

```
聊天触发器
  → 代码节点
    语言: Python3
    输入:
      - text: $('聊天触发器').message
    代码:
      import re
      from collections import Counter

      def main(text: str):
          # 清理文本
          text_clean = re.sub(r'[^\w\s]', '', text.lower())

          # 分词（简单按空格分割）
          words = text_clean.split()

          # 统计词频
          word_freq = Counter(words)
          top_words = word_freq.most_common(5)

          # 基础统计
          stats = {
              "char_count": len(text),
              "word_count": len(words),
              "unique_words": len(word_freq),
              "top_words": [{"word": w, "count": c} for w, c in top_words],
              "avg_word_length": sum(len(w) for w in words) / len(words) if words else 0
          }

          return stats
    输出:
      - char_count: number
      - word_count: number
      - unique_words: number
      - top_words: array[object]
      - avg_word_length: number
  → LLM节点（基于分析结果生成回复）
```

### 示例 4: JSON 转换

```
Webhook触发器
  → 代码节点
    语言: JavaScript
    输入:
      - data: $('Webhook触发器').body
    代码:
      function main({data}) {
          // 将扁平结构转换为嵌套结构
          const transformed = {
              user: {
                  id: data.user_id,
                  name: data.user_name,
                  email: data.user_email,
                  profile: {
                      age: data.age,
                      gender: data.gender
                  }
              },
              order: {
                  id: data.order_id,
                  amount: data.amount,
                  status: data.status
              },
              meta: {
                  timestamp: new Date().toISOString(),
                  source: 'webhook'
              }
          }

          return {result: transformed}
      }
    输出:
      - result: object
  → HTTP请求（发送转换后的数据）
```

### 示例 5: 数据过滤和排序

```
知识检索
  → 代码节点
    语言: Python3
    输入:
      - results: $('知识检索').results
      - minScore: 0.7
      - maxResults: 5
    代码:
      def main(results: list, minScore: float, maxResults: int):
          # 过滤低分结果
          filtered = [r for r in results if r.get('score', 0) >= minScore]

          # 按分数排序
          sorted_results = sorted(filtered, key=lambda x: x.get('score', 0), reverse=True)

          # 限制数量
          top_results = sorted_results[:maxResults]

          # 格式化输出
          formatted = [
              {
                  "title": r.get('title', ''),
                  "content": r.get('content', '')[:200],  # 截取前200字符
                  "score": round(r.get('score', 0), 3),
                  "source": r.get('metadata', {}).get('source', 'unknown')
              }
              for r in top_results
          ]

          return {
              "results": formatted,
              "total": len(formatted),
              "filtered_count": len(filtered) - len(top_results)
          }
    输出:
      - results: array[object]
      - total: number
      - filtered_count: number
  → LLM节点
```

## 最佳实践

### 1. 合理使用输入输出

**明确定义输入输出**
```python
# 清晰的输入输出定义
输入:
  - userId: $('Webhook触发器').body.userId
  - action: $('Webhook触发器').body.action
  - timestamp: new Date().getTime()

输出:
  - success: boolean
  - message: string
  - data: object
```

**避免过多输入**
```javascript
// 过多输入 - 将相关数据组合成对象传入
inputs: ["field1", "field2", "field3", ...] // 太多

// 更好的方式
input: "userData"
value: {
  field1: $('节点').field1,
  field2: $('节点').field2,
  // ...
}
```

### 2. 错误处理

**使用 try-catch**
```python
def main(data: str):
    try:
        result = complex_operation(data)
        return {"success": True, "result": result}
    except ValueError as e:
        return {"success": False, "error": f"数据验证失败: {str(e)}"}
    except Exception as e:
        return {"success": False, "error": f"未知错误: {str(e)}"}
```

**验证输入**
```javascript
function main({email, age}) {
    // 输入验证
    if (!email || typeof email !== 'string') {
        throw new Error('email 必须是非空字符串')
    }

    if (typeof age !== 'number' || age < 0) {
        throw new Error('age 必须是非负数')
    }

    // 业务逻辑
    return {result: 'ok'}
}
```

### 3. 性能优化

**避免不必要的循环**
```javascript
// 不高效
function main({items}) {
    let result = []
    for (let i = 0; i < items.length; i++) {
        for (let j = 0; j < items.length; j++) {
            // O(n²) 复杂度
        }
    }
    return {result}
}

// 更好的方式
function main({items}) {
    const result = items.map(item => process(item)) // O(n)
    return {result}
}
```

**使用仅执行一次选项**
```yaml
# 当只需要处理第一个项时
settings:
  executeOnce: true
```

### 4. 代码可读性

**添加注释**
```python
def main(order_data: dict):
    # 步骤 1: 验证订单数据
    if not validate_order(order_data):
        raise ValueError("订单数据无效")

    # 步骤 2: 计算折扣
    discount = calculate_discount(order_data)

    # 步骤 3: 应用折扣并返回
    final_amount = order_data['amount'] * (1 - discount)

    return {
        "discount": discount,
        "final_amount": round(final_amount, 2)
    }
```

**使用有意义的变量名**
```javascript
// 不好
function main({x, y}) {
    const z = x + y
    return {r: z}
}

// 好
function main({price, tax}) {
    const totalAmount = price + tax
    return {totalAmount}
}
```

### 5. 安全考虑

**不要在代码中硬编码敏感信息**
```python
# 不要这样做
def main(data: str):
    api_key = "sk-xxxxxxxxxxxxx"  # 硬编码
    # ...

# 应该通过输入参数传递
def main(data: str, api_key: str):
    # 使用 api_key
    # ...
```

**输入验证和清洗**
```javascript
function main({userInput}) {
    // 清洗用户输入，防止注入攻击
    const cleaned = userInput.replace(/[<>]/g, '')

    return {cleaned}
}
```

## 常见问题

### Q1: 代码节点支持哪些 Python/JavaScript 版本？

**A**:
- **Python**: Python 3.x（具体版本取决于运行环境）
- **JavaScript**: ES6+ 语法，支持现代 JavaScript 特性

### Q2: 可以在代码中使用第三方库吗？

**A**: 取决于运行环境的配置：
- **Python**: 通常支持标准库（json, re, datetime 等）
- **JavaScript**: 支持 ES6+ 内置对象和方法
- 第三方库支持需要运行环境预装

### Q3: 代码执行有时间限制吗？

**A**: 是的，通常有执行超时限制（如 30 秒），防止代码无限执行。编写代码时应：
- 避免无限循环
- 优化算法复杂度
- 处理大数据集时使用分批处理

### Q4: 输入输出变量的命名有什么规则？

**A**:
- 必须以字母或下划线开头
- 只能包含字母、数字、下划线
- 不能使用 Python/JavaScript 保留字
- 区分大小写
- 建议使用有意义的驼峰或下划线命名

**有效示例**:
```
userId, user_name, _temp, data1
```

**无效示例**:
```
1user (数字开头)
user-name (包含连字符)
class (保留字)
```

### Q5: 代码返回值必须与输出定义完全匹配吗？

**A**: 是的。代码返回的对象的键名必须与 `outputs` 中定义的 `variable` 名称一致。

**示例**:
```javascript
// 输出定义
outputs: [
  {variable: "result", type: "string"},
  {variable: "count", type: "number"}
]

// 代码必须返回
return {
  result: "some string",
  count: 42
}

// 缺少字段或字段名不匹配会导致错误
```

### Q6: Python 和 JavaScript 该如何选择？

**A**: 考虑因素：
- **Python**:
  - 更适合数据处理和科学计算
  - 代码更简洁易读
  - 标准库功能丰富（正则、日期处理等）

- **JavaScript**:
  - 更适合 JSON 数据操作
  - 对象和数组操作更灵活
  - 与前端数据结构更匹配

建议：如果团队对某种语言更熟悉，优先选择该语言。

### Q7: 代码节点可以调用外部 API 吗？

**A**: 通常不建议在代码节点中直接调用外部 API：
- 使用 **HTTP 请求节点**来调用外部 API
- 代码节点专注于数据处理和转换逻辑
- 这样可以更好地利用 HTTP 节点的错误处理、重试等功能

### Q8: 如何调试代码节点？

**A**: 调试建议：
1. **使用回答节点输出中间结果**
   ```python
   def main(data: str):
       intermediate = process_step1(data)
       # 返回中间结果查看
       return {"intermediate": str(intermediate)}
   ```

2. **添加详细的错误信息**
   ```python
   try:
       result = process(data)
   except Exception as e:
       return {"error": f"处理失败: {str(e)}, 数据: {data}"}
   ```

3. **分步骤返回**
   ```python
   return {
       "step1_result": step1,
       "step2_result": step2,
       "final_result": final
   }
   ```

4. **使用工作流日志** - 查看节点执行日志和错误详情

## 下一步

- [HTTP 请求节点](/zh-hans/guide/workflow/nodes/action-nodes/http-request) - 了解如何调用外部 API
- [条件分支](/zh-hans/guide/workflow/nodes/action-nodes/if) - 根据代码执行结果进行条件分支
- [表达式语法](/zh-hans/guide/expressions/) - 学习如何在输入参数中使用表达式

## 相关资源

- [Webhook 触发器](/zh-hans/guide/workflow/nodes/trigger-nodes/webhook) - 了解如何接收外部数据
- [LLM 节点](/zh-hans/guide/workflow/nodes/action-nodes/llm) - 结合代码节点和 AI 能力
