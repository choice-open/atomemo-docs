---
title: 代码工具节点
description: 为 AI Agent 提供可执行的代码工具,让 AI 能够调用自定义代码逻辑
---

# 代码工具节点

代码工具节点用于为 AI Agent 提供可执行的代码工具。与 Code Action 节点不同,Tool Code 节点不是直接执行,而是作为工具注册到 AI Agent,由 AI 根据用户需求决定是否调用。

## 使用场景

### 典型应用
- **数据处理工具** - 提供复杂的数据转换、计算能力
- **外部系统集成** - 封装与第三方系统的交互逻辑
- **业务规则计算** - 实现特定的业务逻辑(如价格计算、库存检查)
- **格式转换工具** - 提供各种数据格式转换能力
- **验证工具** - 实现复杂的数据验证逻辑
- **定制化功能** - 为 AI Agent 提供项目特定的能力

## Tool vs Action 的区别

### Code Action 节点
- **直接执行**: 在工作流中按顺序执行
- **确定性**: 每次运行都会执行
- **控制流**: 由工作流设计者控制执行时机

### Code Tool 节点
- **按需调用**: 注册为工具,由 AI 决定是否调用
- **智能选择**: AI 根据用户需求和工具描述决定调用
- **多工具协作**: 可以注册多个工具,AI 自主选择合适的工具组合

```
传统 Action 节点流程:
Trigger → Action 1 → Action 2 → Action 3 (固定顺序)

Tool 节点流程:
Trigger → AI Agent (注册了 Tool 1, Tool 2, Tool 3)
  → AI 根据对话内容自主决定:
    - 不调用任何工具
    - 调用 Tool 1
    - 调用 Tool 2 然后 Tool 1
    - 多次调用同一个工具
```

## 节点配置

### 基础设置(参数面板)

#### 工具名称 (toolName)

AI Agent 调用工具时使用的唯一标识符。

**字段属性**:
- 必填字段
- 在工作流中必须唯一
- 不支持表达式
- 格式要求:
  - 只能包含字母、数字、下划线和连字符
  - 必须以字母开头
  - 不能与工作流中其他工具节点的工具名称重复

**配置示例**:

```javascript
// 1. 简洁明确的工具名称
toolName: "calculatePrice"

// 2. 描述性的工具名称
toolName: "validateEmailFormat"

// 3. 带前缀的工具名称
toolName: "productInventoryCheck"

// 4. 带下划线的工具名称
toolName: "user_profile_query"
```

**命名建议**:
- **使用小驼峰或下划线**: `calculatePrice` 或 `calculate_price`
- **见名知意**: 名称要清楚表达工具的功能
- **避免过长**: 建议在 20 个字符以内
- **避免特殊字符**: 只使用字母、数字、下划线和连字符

**重要说明**:
- AI Agent 通过工具名称来识别和调用工具，而不是节点名称
- 工具名称在工作流中必须唯一，如果有重复会自动添加后缀
- 建议使用英文命名，以便与 AI 的调用保持一致

#### 工具描述 (toolDescription)

描述这个工具的功能和使用场景,AI 会根据这个描述决定是否调用工具。

**字段属性**:
- 必填字段
- 支持表达式
- 支持多行文本

**配置示例**:

```javascript
// 1. 清晰描述工具功能
"计算两个数字的和。输入参数: number1(第一个数字), number2(第二个数字)。返回: sum(两数之和)。"

// 2. 说明使用场景
"查询产品库存数量。输入参数: productId(产品ID)。返回: quantity(当前库存数量), lastUpdated(最后更新时间)。适用于回答用户关于产品库存的问题。"

// 3. 提供调用示例
"将文本转换为 Markdown 格式。
输入参数:
- text: 要转换的文本内容
- style: 样式选项 ('simple' | 'detailed')
返回:
- markdown: 转换后的 Markdown 文本

示例: 当用户说"把这段文字转成 Markdown"时调用 convertToMarkdown 工具。"

// 4. 说明限制条件
"计算商品折扣价格。
输入参数:
- originalPrice: 原价(必须大于0)
- discountRate: 折扣率(0-1之间,如0.8表示8折)
返回:
- finalPrice: 折后价格
- savedAmount: 节省金额

注意: 仅适用于正常商品,不适用于特价商品。"
```

**最佳实践**:
- **描述要具体**: 清楚说明工具做什么
- **参数要详细**: 列出所有输入参数及其含义
- **返回值要明确**: 说明工具返回什么
- **使用场景**: 帮助 AI 理解何时应该调用这个工具
- **限制条件**: 说明工具的适用范围和限制

#### 代码语言 (lang)

选择代码执行的编程语言。

**字段属性**:
- 必选字段
- 默认值: `python3`

**可选值**:
- `python3` - Python 3 代码
- `javascript` - JavaScript 代码

#### 代码 (code)

要执行的代码内容。

**字段属性**:
- 必填字段
- 支持多行文本
- 必须包含 `main` 函数

**Python3 代码模板**:
```python
def main(arg1: str, arg2: str):
    # 你的代码逻辑
    return {
        "result": arg1 + arg2,
    }
```

**JavaScript 代码模板**:
```javascript
function main({arg1, arg2}) {
    // 你的代码逻辑
    return {
        result: arg1 + arg2
    }
}
```

**代码要求**:
1. **必须包含 main 函数**: 代码入口点
2. **参数映射**: main 函数的参数名必须与输入变量名一致
3. **返回对象**: 必须返回对象,对象的 key 与输出变量名一致
4. **无副作用**: 避免修改全局状态
5. **异常处理**: 处理可能的错误情况

#### 输入变量 (inputs)

定义 AI 调用工具时需要传递的参数。

**字段属性**:
- 数组类型
- 每个输入包含: variable(变量名), value(默认值)
- 变量名不能重复
- 默认有两个输入: `arg1`, `arg2`

**配置示例**:

```javascript
// 1. 基础输入定义
inputs: [
  { variable: "text", value: "" },
  { variable: "language", value: "zh-CN" }
]

// 2. 带默认值的输入
inputs: [
  { variable: "query", value: "" },
  { variable: "limit", value: "10" },
  { variable: "offset", value: "0" }
]

// 3. 动态输入值(使用表达式)
inputs: [
  { variable: "userId", value: $('Chat Trigger').userId },
  { variable: "sessionId", value: $('Chat Trigger').sessionId }
]
```

**变量命名规范**:
- 使用小驼峰命名: `productId`, `userName`
- 见名知意: 变量名要清楚表达用途
- 避免缩写: 使用 `quantity` 而非 `qty`

#### 输出变量 (outputs)

定义工具执行后返回给 AI 的数据。

**字段属性**:
- 数组类型
- 每个输出包含: variable(变量名), type(数据类型)
- 变量名不能重复
- 默认有一个输出: `result` (string 类型)

**支持的数据类型**:
```yaml
string: 字符串
number: 数字
boolean: 布尔值
object: 对象
array[string]: 字符串数组
array[number]: 数字数组
array[boolean]: 布尔值数组
array[object]: 对象数组
```

**配置示例**:

```javascript
// 1. 单个输出
outputs: [
  { variable: "result", type: "string" }
]

// 2. 多个输出
outputs: [
  { variable: "success", type: "boolean" },
  { variable: "message", type: "string" },
  { variable: "data", type: "object" }
]

// 3. 数组类型输出
outputs: [
  { variable: "products", type: "array[object]" },
  { variable: "totalCount", type: "number" }
]

// 4. 复杂输出结构
outputs: [
  { variable: "status", type: "string" },
  { variable: "items", type: "array[object]" },
  { variable: "pagination", type: "object" },
  { variable: "hasMore", type: "boolean" }
]
```

### 高级设置(设置面板)

#### 总是输出 (alwaysOutput)

执行失败时是否也输出空项。

**默认值**: `false`

#### 仅执行一次 (executeOnce)

是否仅使用第一个输入项执行一次。

**默认值**: `false`

#### 失败重试 (retryOnFail)

执行失败时是否自动重试。

**默认值**: `false`

#### 最大重试次数 (maxTries)

失败后最多重试几次。

**默认值**: `3`

#### 重试间隔 (waitBetweenTries)

重试之间的等待时间(毫秒)。

**默认值**: `1000` (1 秒)

#### 节点描述 (nodeDescription)

为节点添加自定义描述。

```yaml
nodeDescription: "价格计算工具 - 根据原价和折扣计算最终价格"
```

## 代码示例

### 示例 1: 数学计算工具

**Python 版本**:
```python
def main(operation: str, num1: float, num2: float):
    """
    执行数学运算
    """
    if operation == "add":
        result = num1 + num2
    elif operation == "subtract":
        result = num1 - num2
    elif operation == "multiply":
        result = num1 * num2
    elif operation == "divide":
        if num2 == 0:
            return {
                "success": False,
                "error": "除数不能为0"
            }
        result = num1 / num2
    else:
        return {
            "success": False,
            "error": f"不支持的运算: {operation}"
        }

    return {
        "success": True,
        "result": result
    }
```

**输入变量**:
```javascript
[
  { variable: "operation", value: "" },  // "add" | "subtract" | "multiply" | "divide"
  { variable: "num1", value: "0" },
  { variable: "num2", value: "0" }
]
```

**输出变量**:
```javascript
[
  { variable: "success", type: "boolean" },
  { variable: "result", type: "number" },
  { variable: "error", type: "string" }
]
```

**工具描述**:
```
执行基础数学运算(加减乘除)。
输入参数:
- operation: 运算类型 ("add", "subtract", "multiply", "divide")
- num1: 第一个数字
- num2: 第二个数字
返回:
- success: 是否成功
- result: 计算结果(仅成功时有值)
- error: 错误信息(仅失败时有值)
```

### 示例 2: 文本处理工具

**JavaScript 版本**:
```javascript
function main({text, operation, options}) {
    const opts = JSON.parse(options || '{}');

    switch(operation) {
        case 'uppercase':
            return {
                result: text.toUpperCase()
            };

        case 'lowercase':
            return {
                result: text.toLowerCase()
            };

        case 'word_count':
            const words = text.trim().split(/\s+/);
            return {
                result: words.length.toString(),
                words: words
            };

        case 'extract_emails':
            const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
            const emails = text.match(emailRegex) || [];
            return {
                emails: emails,
                count: emails.length
            };

        case 'truncate':
            const maxLength = opts.maxLength || 100;
            const suffix = opts.suffix || '...';
            if (text.length <= maxLength) {
                return { result: text };
            }
            return {
                result: text.substring(0, maxLength - suffix.length) + suffix
            };

        default:
            return {
                error: `不支持的操作: ${operation}`
            };
    }
}
```

**输入变量**:
```javascript
[
  { variable: "text", value: "" },
  { variable: "operation", value: "uppercase" },
  { variable: "options", value: "{}" }  // JSON 格式的选项
]
```

**输出变量**:
```javascript
[
  { variable: "result", type: "string" },
  { variable: "words", type: "array[string]" },
  { variable: "emails", type: "array[string]" },
  { variable: "count", type: "number" },
  { variable: "error", type: "string" }
]
```

### 示例 3: 数据验证工具

**Python 版本**:
```python
import re
import json

def main(data: str, validation_type: str, rules: str):
    """
    验证数据是否符合规则
    """
    try:
        rules_obj = json.loads(rules) if rules else {}
    except:
        return {
            "valid": False,
            "errors": ["规则格式错误"]
        }

    errors = []

    if validation_type == "email":
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, data):
            errors.append("邮箱格式不正确")

    elif validation_type == "phone":
        phone_pattern = r'^1[3-9]\d{9}$'
        if not re.match(phone_pattern, data):
            errors.append("手机号格式不正确")

    elif validation_type == "url":
        url_pattern = r'^https?://[^\s/$.?#].[^\s]*$'
        if not re.match(url_pattern, data):
            errors.append("URL 格式不正确")

    elif validation_type == "custom":
        # 自定义验证逻辑
        min_length = rules_obj.get("minLength", 0)
        max_length = rules_obj.get("maxLength", float('inf'))
        pattern = rules_obj.get("pattern", "")

        if len(data) < min_length:
            errors.append(f"长度不能少于 {min_length} 个字符")

        if len(data) > max_length:
            errors.append(f"长度不能超过 {max_length} 个字符")

        if pattern and not re.match(pattern, data):
            errors.append("不符合指定的格式要求")

    return {
        "valid": len(errors) == 0,
        "errors": errors,
        "data": data if len(errors) == 0 else None
    }
```

**输入变量**:
```javascript
[
  { variable: "data", value: "" },
  { variable: "validation_type", value: "email" },  // "email" | "phone" | "url" | "custom"
  { variable: "rules", value: "{}" }  // JSON 格式的验证规则
]
```

**输出变量**:
```javascript
[
  { variable: "valid", type: "boolean" },
  { variable: "errors", type: "array[string]" },
  { variable: "data", type: "string" }
]
```

## 工作流示例

### 示例 1: 为 AI Agent 提供计算能力

```
Chat Trigger
  → AI Agent Node
    System Prompt: "你是一个智能助手,可以帮助用户进行数学计算。"
    Tools: [Code Tool - 数学计算器]
      Tool Description: "执行数学计算,支持加减乘除。输入: operation(运算类型), num1(第一个数字), num2(第二个数字)。返回: result(计算结果)。"
      Code: [数学计算 Python 代码]
      Inputs: [operation, num1, num2]
      Outputs: [success, result, error]
  → Answer Node

用户对话示例:
用户: "帮我算一下 123 + 456"
AI: (调用计算工具) → 返回: "123 + 456 = 579"

用户: "1000 除以 7 是多少?"
AI: (调用计算工具) → 返回: "1000 ÷ 7 ≈ 142.857"
```

### 示例 2: 多工具协作 - 订单处理助手

```
Chat Trigger
  → AI Agent Node
    System Prompt: "你是订单处理助手,可以查询订单、检查库存、计算价格。"

    Tools: [
      Tool 1 - 查询订单工具
        Tool Description: "根据订单号查询订单详情。输入: orderId。返回: order(订单对象), found(是否找到)。"

      Tool 2 - 库存检查工具
        Tool Description: "检查商品库存。输入: productId。返回: inStock(是否有货), quantity(库存数量)。"

      Tool 3 - 价格计算工具
        Tool Description: "计算订单总价。输入: items(商品列表), discountCode(折扣码)。返回: totalPrice(总价), discount(折扣金额)。"
    ]
  → Answer Node

用户对话示例:
用户: "我的订单 #12345 到哪里了?"
AI: (调用查询订单工具) → "您的订单已发货,预计明天送达。"

用户: "商品 SKU-999 还有货吗?"
AI: (调用库存检查工具) → "有货,当前库存还有 50 件。"

用户: "帮我算一下这个购物车的总价"
AI: (调用价格计算工具) → "总价是 299 元,使用优惠码后实付 249 元。"
```

### 示例 3: 数据处理助手

```
Chat Trigger
  → Entity Recognition Node (提取用户输入的数据)
  → AI Agent Node
    System Prompt: "你是数据处理助手,可以对数据进行各种处理和分析。"

    Tools: [
      Tool 1 - 文本处理工具
        Tool Description: "处理文本内容,支持转大写、转小写、统计字数、提取邮箱等操作。"
        Code: [文本处理 JavaScript 代码]

      Tool 2 - 数据验证工具
        Tool Description: "验证数据格式是否正确,支持邮箱、手机号、URL 等格式验证。"
        Code: [数据验证 Python 代码]

      Tool 3 - 格式转换工具
        Tool Description: "转换数据格式,如 JSON、CSV、XML 等。"
        Code: [格式转换代码]
    ]
  → Answer Node

用户对话示例:
用户: "把这段文字转成大写: hello world"
AI: (调用文本处理工具 - uppercase) → "HELLO WORLD"

用户: "帮我检查一下这个邮箱格式对不对: test@example"
AI: (调用数据验证工具 - email) → "邮箱格式不正确,缺少域名后缀。"
```

### 示例 4: 动态工具选择

```
Chat Trigger
  → AI Classifier Node (识别用户意图)
  → Conditional Branch
    → [计算需求] → AI Agent (注册数学工具)
    → [数据处理需求] → AI Agent (注册数据处理工具)
    → [查询需求] → AI Agent (注册查询工具)
  → Answer Node
```

## 最佳实践

### 1. 编写清晰的工具描述

**好的工具描述**:
```
"计算两个日期之间的天数差。
输入参数:
- startDate: 开始日期,格式 YYYY-MM-DD
- endDate: 结束日期,格式 YYYY-MM-DD
返回值:
- days: 相差天数(整数)
- valid: 日期是否有效(布尔值)

使用场景: 当用户询问两个日期相差多少天时调用。
示例: '2024年1月1日到2024年12月31日有多少天?'"
```

**不好的工具描述**:
```
"日期计算"
```

### 2. 合理设计输入输出

**清晰的输入输出设计**:
```javascript
// 输入: 语义明确,有默认值
inputs: [
  { variable: "searchQuery", value: "" },
  { variable: "maxResults", value: "10" },
  { variable: "sortBy", value: "relevance" }
]

// 输出: 类型正确,结构完整
outputs: [
  { variable: "results", type: "array[object]" },
  { variable: "totalCount", type: "number" },
  { variable: "hasMore", type: "boolean" }
]
```

### 3. 处理错误和边界情况

**完善的错误处理**:
```python
def main(numerator: float, denominator: float):
    # 边界情况检查
    if denominator == 0:
        return {
            "success": False,
            "error": "除数不能为0",
            "result": None
        }

    try:
        result = numerator / denominator
        return {
            "success": True,
            "result": result,
            "error": None
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"计算错误: {str(e)}",
            "result": None
        }
```

### 4. 提供合适的默认值

```javascript
// 好的实践
inputs: [
  { variable: "text", value: "" },
  { variable: "maxLength", value: "100" },  // 合理的默认值
  { variable: "language", value: "zh-CN" }  // 常用语言
]

// 不好的实践
inputs: [
  { variable: "text", value: "" },
  { variable: "maxLength", value: "" },  // 缺少默认值
  { variable: "language", value: "" }
]
```

### 5. 工具粒度要适中

**适中的工具粒度**:
```javascript
// 好: 一个工具做一件事
Tool 1: "计算价格 - 根据数量和单价计算总价"
Tool 2: "应用折扣 - 根据折扣码计算折后价"
Tool 3: "计算税费 - 根据地区计算税费"

// 不好: 工具太大,职责不清
Tool 1: "订单处理 - 计算价格、应用折扣、计算税费、生成发票"
```

### 6. 使用类型提示

**Python 类型提示**:
```python
from typing import Dict, List, Optional

def main(
    items: List[Dict],
    discount_rate: float,
    currency: str
) -> Dict[str, any]:
    """
    类型提示让代码更清晰,更易维护
    """
    total = sum(item['price'] * item['quantity'] for item in items)
    discount = total * discount_rate
    final_price = total - discount

    return {
        "total": total,
        "discount": discount,
        "finalPrice": final_price,
        "currency": currency
    }
```

### 7. 测试工具功能

**测试策略**:
1. **单元测试**: 测试各种输入情况
2. **边界测试**: 测试极端值和边界条件
3. **错误测试**: 测试错误输入的处理
4. **集成测试**: 在 AI Agent 中测试工具调用

```python
# 测试用例示例
def main(value: str, operation: str):
    # 测试: 空值处理
    if not value:
        return {"error": "输入不能为空"}

    # 测试: 操作类型检查
    if operation not in ["uppercase", "lowercase", "capitalize"]:
        return {"error": "不支持的操作"}

    # 正常处理
    if operation == "uppercase":
        return {"result": value.upper()}
    elif operation == "lowercase":
        return {"result": value.lower()}
    else:
        return {"result": value.capitalize()}
```

## 常见问题

### Q1: Code Tool 和 Code Action 有什么区别?

**A**:

| 特性 | Code Action | Code Tool |
|------|------------|-----------|
| 执行方式 | 直接执行 | AI 按需调用 |
| 使用场景 | 固定的数据处理流程 | AI Agent 需要的能力 |
| 执行时机 | 每次都执行 | AI 决定是否执行 |
| 适用于 | 确定的业务流程 | 不确定的交互场景 |

**选择建议**:
- 如果是固定流程(如"每次都要验证输入"),使用 **Code Action**
- 如果是按需能力(如"AI 可能需要计算价格"),使用 **Code Tool**

### Q2: AI 如何决定是否调用工具?

**A**:
AI 根据以下因素决定:
1. **工具描述**: 描述是否匹配用户需求
2. **对话上下文**: 当前对话是否需要这个能力
3. **输入参数**: 是否能从对话中提取所需参数
4. **可用工具**: 比较多个工具,选择最合适的

**优化 AI 工具选择**:
- 编写清晰准确的工具描述
- 提供使用场景和示例
- 合理命名输入输出变量
- 避免工具功能重叠

### Q3: 如何处理工具调用失败?

**A**:

**方案 1: 在代码中处理**
```python
def main(value: str):
    try:
        result = complex_operation(value)
        return {
            "success": True,
            "data": result
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "data": None
        }
```

**方案 2: 使用重试设置**
```javascript
Settings:
  retryOnFail: true
  maxTries: 3
  waitBetweenTries: 1000
```

**方案 3: AI 自动处理**
```
AI 调用工具失败后,会:
1. 识别失败原因(从 error 输出)
2. 调整参数重试
3. 或者尝试其他工具
4. 或者告诉用户无法完成
```

### Q4: 工具可以调用外部 API 吗?

**A**:
不建议在 Code Tool 中直接调用外部 API,原因:
1. **性能**: 同步调用会阻塞 AI
2. **可靠性**: 外部 API 可能不稳定
3. **架构**: 应该使用 HTTP Request Tool

**推荐方案**:
```
Chat Trigger
  → AI Agent
    Tools: [
      HTTP Request Tool (调用外部 API)
      Code Tool (处理 API 返回的数据)
    ]
```

AI 会先调用 HTTP Request Tool 获取数据,然后调用 Code Tool 处理数据。

### Q5: 可以注册多少个工具?

**A**:
技术上没有硬性限制,但建议:
- **3-5 个工具**: 最佳实践
- **最多 10 个工具**: 超过可能影响 AI 选择准确性

**优化策略**:
```javascript
// 方案 1: 用一个工具支持多种操作
Tool: "文本处理"
Input: operation ("uppercase" | "lowercase" | "trim" | ...)

// 方案 2: 动态注册工具
Conditional Branch
  → [场景 A] → AI Agent (注册工具 1, 2, 3)
  → [场景 B] → AI Agent (注册工具 4, 5, 6)
```

### Q6: 工具输入参数如何传递?

**A**:

**AI 从对话中提取参数**:
```
用户: "帮我算一下 100 加 200"
AI 分析:
  - 需要调用计算工具
  - operation = "add"
  - num1 = 100
  - num2 = 200
  → 调用工具
```

**如果参数不够,AI 会追问**:
```
用户: "帮我算一下"
AI: "好的,您需要计算什么?比如加法、减法?"
用户: "100 加 200"
AI: → 调用工具
```

**也可以从上下文获取**:
```javascript
// 配置工具时设置默认值
inputs: [
  { variable: "userId", value: $('Chat Trigger').userId },  // 从对话上下文
  { variable: "value", value: "" }  // AI 从对话中提取
]
```

### Q7: Code Tool 的代码有哪些限制?

**A**:

**限制**:
1. **执行时间**: 通常有超时限制(如 30 秒)
2. **内存使用**: 有内存限制
3. **网络访问**: 可能不允许外部网络调用
4. **文件系统**: 可能不允许文件读写
5. **库依赖**: 仅支持标准库或预安装的库

**最佳实践**:
- 编写高效的代码
- 避免复杂计算
- 不依赖外部资源
- 处理超时情况

```python
def main(data: str):
    # 好: 简单直接
    return {"result": data.upper()}

    # 不好: 复杂耗时
    # for i in range(1000000):
    #     complex_calculation()
```

### Q8: 如何调试 Code Tool?

**A**:

**调试策略**:

**1. 日志输出**
```python
def main(value: str):
    # Python 使用 print
    print(f"Debug: input value = {value}")

    result = process(value)
    print(f"Debug: result = {result}")

    return {"result": result}
```

```javascript
// JavaScript 使用 console.log
function main({value}) {
    console.log('Debug: input value =', value);

    const result = process(value);
    console.log('Debug: result =', result);

    return { result };
}
```

**2. 返回调试信息**
```python
def main(value: str):
    debug_info = []
    debug_info.append(f"输入: {value}")

    result = process(value)
    debug_info.append(f"处理结果: {result}")

    return {
        "result": result,
        "debug": debug_info  // 临时输出变量
    }
```

**3. 先在 Code Action 中测试**
```
开发流程:
1. 先在 Code Action 中编写和测试代码
2. 确认代码正确后,复制到 Code Tool
3. 添加工具描述
4. 在 AI Agent 中测试
```

### Q9: 工具可以返回复杂对象吗?

**A**:
可以,使用 `object` 或 `array[object]` 类型:

```python
def main(product_id: str):
    # 返回复杂对象
    product = {
        "id": product_id,
        "name": "示例商品",
        "price": 99.99,
        "inStock": True,
        "tags": ["电子", "热门"],
        "specs": {
            "weight": "500g",
            "dimensions": "10x10x10cm"
        }
    }

    return {
        "product": product,  // object 类型
        "success": True
    }
```

**输出变量配置**:
```javascript
outputs: [
  { variable: "product", type: "object" },
  { variable: "success", type: "boolean" }
]
```

**AI 可以访问对象属性**:
```
AI 获取到 product 对象后,可以:
- 读取 product.name
- 读取 product.price
- 读取 product.specs.weight
- 向用户呈现信息
```

## 下一步

- [AI Agent 节点](/zh-hans/guide/workflow/nodes/action-nodes/ai-agent) - 了解如何使用 AI Agent
- [HTTP Request Tool 节点](/zh-hans/guide/workflow/nodes/tool-nodes/http-request) - 为 AI 提供 API 调用能力
- [Entity Recognition Tool 节点](/zh-hans/guide/workflow/nodes/tool-nodes/entity-recognition) - 为 AI 提供结构化提取能力

## 相关资源

- [Code Action 节点](/zh-hans/guide/workflow/nodes/action-nodes/code) - 了解 Action 和 Tool 的区别
- [表达式语法](/zh-hans/guide/expressions/) - 学习如何在配置中使用表达式
