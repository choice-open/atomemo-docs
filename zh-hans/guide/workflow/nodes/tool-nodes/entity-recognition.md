---
title: 实体识别工具节点
description: 为 AI Agent 提供结构化信息提取能力，从非结构化文本中提取关键信息
---

# 实体识别工具节点

实体识别工具节点为 AI Agent 提供从非结构化文本中提取结构化信息的能力。与 Entity Recognition Action 节点不同，Tool 版本由 AI 根据需求自主决定是否调用。

## 使用场景

### 典型应用
- **表单信息提取** - 从用户自然语言输入中提取表单字段
- **订单信息识别** - 从对话中提取订单相关信息
- **用户资料采集** - 从对话中收集用户信息
- **产品信息提取** - 从产品描述中提取规格参数
- **事件信息提取** - 从文本中提取时间、地点、人物等要素
- **多步骤信息收集** - AI 可多次调用收集不同信息

## Tool vs Action 的区别

| 特性 | Entity Recognition Action | Entity Recognition Tool |
|------|--------------------------|------------------------|
| 执行方式 | 直接执行 | AI 按需调用 |
| 使用场景 | 固定的信息提取流程 | AI Agent 需要时提取信息 |
| 调用时机 | 每次都执行 | AI 决定何时调用 |
| 多次调用 | 需要多个节点 | 同一个工具可被多次调用 |

**示例对比**:
```
Action 方式 (固定流程):
用户输入 → Entity Recognition → 处理结果

Tool 方式 (智能交互):
用户: "我想订一份外卖"
AI: "好的，您想吃什么?" (未调用工具)
用户: "一份宫保鸡丁，地址是xxx，电话138xxx"
AI: (调用实体识别工具提取：菜品、地址、电话)
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
toolName: "extractOrderInfo"

// 2. 描述性的工具名称
toolName: "parseUserProfile"

// 3. 带前缀的工具名称
toolName: "orderEntityRecognition"
```

**命名建议**:
- **使用小驼峰或下划线**: `extractOrderInfo` 或 `extract_order_info`
- **见名知意**: 名称要清楚表达工具的功能
- **避免过长**: 建议在 20 个字符以内
- **避免特殊字符**: 只使用字母、数字、下划线和连字符

**重要说明**:
- AI Agent 通过工具名称来识别和调用工具，而不是节点名称
- 工具名称在工作流中必须唯一，如果有重复会自动添加后缀
- 建议使用英文命名，以便与 AI 的调用保持一致

#### 工具描述 (toolDescription)

描述工具的功能，AI 根据描述决定何时调用。

**字段属性**:
- 必填字段
- 支持表达式

**配置示例**:

```javascript
// 1. 清晰描述提取目标
"从用户消息中提取订单信息，包括：商品名称、数量、收货地址、联系电话。返回结构化的订单对象。"

// 2. 说明适用场景
"从产品咨询对话中提取产品需求信息。
提取字段：
- productType: 产品类型
- budget: 预算范围
- requirements: 特殊要求
- deliveryDate: 期望交付时间

当用户描述产品需求时调用 extractProductRequirements 工具。"

// 3. 提供示例
"提取用户个人信息用于注册。
字段：name(姓名), email(邮箱), phone(手机号), city(城市)
示例: 用户说'我叫张三，邮箱是zhangsan@example.com，电话13800138000，在北京'
返回: {name: '张三', email: 'zhangsan@example.com', phone: '13800138000', city: '北京'}"
```

#### 模型 (model)

选择用于实体识别的 AI 模型。

**字段属性**:
- 必填字段
- 支持主流 LLM 提供商

**推荐模型**:
```yaml
GPT-4: 最高准确度，适合复杂结构提取
GPT-3.5-turbo: 性价比高，适合大多数场景
Claude 3 Sonnet: 平衡性能，适合中等复杂度
```

#### 输入文本 (input)

要提取信息的文本内容。

**字段属性**:
- 必填字段
- 支持表达式

**配置示例**:

```javascript
// 1. AI 从对话中传入
input: ""  // AI 会自动填充用户消息

// 2. 从上下文获取
input: $('Chat Trigger').message

// 3. 组合多个信息源
input: `当前对话: ${$('Chat Trigger').message}
历史信息: ${$('Context').history}`
```

#### 提取指令 (instructions)

为 AI 提供额外的提取指导。

**字段属性**:
- 可选字段
- 支持表达式

**配置示例**:

```javascript
// 1. 指定提取规则
"从文本中提取所有提到的产品信息。如果某个字段没有提到，返回 null 而不是猜测。"

// 2. 处理歧义
"如果地址信息不完整，只提取明确提到的部分。如果出现多个电话号码，提取第一个。"

// 3. 格式要求
"日期统一转换为 YYYY-MM-DD 格式，电话号码去除所有空格和横杠。"
```

#### JSON Schema (jsonSchema)

定义要提取的数据结构。

**字段属性**:
- 可选字段
- 支持完整的 JSON Schema 规范

**配置示例**:

```json
{
  "type": "object",
  "properties": {
    "orderInfo": {
      "type": "object",
      "properties": {
        "productName": {
          "type": "string",
          "description": "商品名称"
        },
        "quantity": {
          "type": "number",
          "description": "购买数量"
        },
        "address": {
          "type": "string",
          "description": "收货地址"
        },
        "phone": {
          "type": "string",
          "description": "联系电话"
        }
      },
      "required": ["productName", "quantity"]
    }
  }
}
```

**复杂 Schema 示例**:

```json
{
  "type": "object",
  "properties": {
    "userProfile": {
      "type": "object",
      "properties": {
        "name": {"type": "string"},
        "age": {"type": "number"},
        "interests": {
          "type": "array",
          "items": {"type": "string"}
        },
        "contact": {
          "type": "object",
          "properties": {
            "email": {"type": "string"},
            "phone": {"type": "string"}
          }
        }
      }
    }
  }
}
```

#### 自定义标签 (customLabels)

为 Schema 字段添加友好的中文标签。

**字段属性**:
- 可选字段
- 键值对格式

```javascript
customLabels: {
  "productName": "商品名称",
  "quantity": "数量",
  "address": "收货地址",
  "phone": "联系电话"
}
```

### 高级设置(设置面板)

#### 总是输出 (alwaysOutput)
执行失败时是否也输出空项。**默认**: `false`

#### 仅执行一次 (executeOnce)
是否仅使用第一个输入项执行一次。**默认**: `false`

#### 失败重试 (retryOnFail)
执行失败时是否自动重试。**默认**: `false`

#### 最大重试次数 (maxTries)
失败后最多重试几次。**默认**: `3`

#### 重试间隔 (waitBetweenTries)
重试之间的等待时间(毫秒)。**默认**: `1000`

## 输出数据

输出符合 JSON Schema 定义的结构化数据。

```javascript
// 访问提取的数据
$('Entity Recognition Tool').orderInfo.productName
$('Entity Recognition Tool').orderInfo.quantity
$('Entity Recognition Tool').orderInfo.address
```

## 工作流示例

### 示例 1: 智能订单收集

```
Chat Trigger
  → AI Agent Node
    System Prompt: "你是订餐助手，帮助用户下单。"

    Tools: [Entity Recognition Tool]
      Tool Description: "从用户消息中提取订单信息：菜品(dish)、数量(quantity)、地址(address)、电话(phone)。"
      JSON Schema: {
        "properties": {
          "dish": {"type": "string"},
          "quantity": {"type": "number"},
          "address": {"type": "string"},
          "phone": {"type": "string"}
        }
      }
  → Answer Node

对话示例:
用户: "我想订一份宫保鸡丁"
AI: "好的，请问需要几份？送到哪里？" (未调用工具，信息不全)

用户: "两份，送到xx路xx号，电话138xxxx"
AI: (调用实体识别工具)
提取结果: {
  dish: "宫保鸡丁",
  quantity: 2,
  address: "xx路xx号",
  phone: "138xxxx"
}
AI: "好的，已为您记录订单：2份宫保鸡丁，送到xx路xx号..."
```

### 示例 2: 多步骤信息收集

```
Chat Trigger
  → AI Agent Node
    System Prompt: "你是客服助手，收集用户反馈信息。"

    Tools: [Entity Recognition Tool]
      Tool Description: "从对话中提取用户反馈信息：问题类型(issueType)、产品名称(product)、问题描述(description)、严重程度(severity)。"
      Instructions: "如果信息不完整，返回已提取的部分字段。"
      JSON Schema: {...}
  → Answer Node

对话示例:
用户: "我买的手机有问题"
AI: (调用工具) → 提取: {product: "手机"}
AI: "请问具体是什么问题？"

用户: "充电充不进去，很严重"
AI: (再次调用工具) → 提取: {
  product: "手机",
  description: "充电充不进去",
  severity: "严重"
}
AI: "已记录您的问题，我们会尽快处理..."
```

### 示例 3: 产品咨询信息提取

```
Chat Trigger
  → AI Agent Node
    System Prompt: "你是产品顾问，帮助用户选择合适的产品。"

    Tools: [
      Tool 1 - Entity Recognition Tool
        Tool Description: "提取产品需求信息：预算(budget)、尺寸(size)、颜色(color)、特殊需求(requirements)。"

      Tool 2 - Code Tool
        Tool Description: "根据需求搜索匹配的产品"
    ]
  → Answer Node

对话流程:
用户: "我想买个笔记本电脑，预算8000左右，要轻薄的"
AI: (调用实体识别工具)
提取: {
  productType: "笔记本电脑",
  budget: 8000,
  requirements: "轻薄"
}
AI: (调用产品搜索工具)
AI: "根据您的需求，我推荐以下几款..."
```

### 示例 4: 事件信息提取

```
Chat Trigger
  → AI Agent Node
    System Prompt: "你是日程管理助手，帮助用户创建日程。"

    Tools: [Entity Recognition Tool]
      Tool Description: "从用户消息中提取事件信息：标题(title)、日期(date)、时间(time)、地点(location)、参与者(participants)。"
      Instructions: "日期转换为 YYYY-MM-DD 格式，如果只说'明天'，根据今天日期计算。"
      JSON Schema: {
        "properties": {
          "title": {"type": "string"},
          "date": {"type": "string"},
          "time": {"type": "string"},
          "location": {"type": "string"},
          "participants": {
            "type": "array",
            "items": {"type": "string"}
          }
        }
      }
  → Answer Node

用户: "明天下午3点在会议室A开项目会议，叫上张三和李四"
AI: (调用工具)
提取: {
  title: "项目会议",
  date: "2024-01-16",  // AI 自动计算
  time: "15:00",
  location: "会议室A",
  participants: ["张三", "李四"]
}
AI: "已为您创建日程：明天下午3点..."
```

## 最佳实践

### 1. 编写清晰的工具描述

**好的描述**:
```
"从用户咨询中提取旅游需求信息。
提取字段：
- destination: 目的地城市
- departureDate: 出发日期 (YYYY-MM-DD)
- duration: 行程天数
- travelers: 出行人数
- budget: 预算范围

当用户描述旅游计划时调用。
示例: '我想下个月去三亚玩5天，两个人，预算1万左右'"
```

### 2. 设计合理的 Schema

```json
// 好的 Schema 设计
{
  "type": "object",
  "properties": {
    "required_fields": {
      "type": "object",
      "properties": {
        "name": {"type": "string", "description": "必填：姓名"}
      },
      "required": ["name"]
    },
    "optional_fields": {
      "type": "object",
      "properties": {
        "age": {"type": "number", "description": "可选：年龄"},
        "city": {"type": "string", "description": "可选：城市"}
      }
    }
  }
}
```

### 3. 提供清晰的提取指令

```javascript
instructions: `提取规则：
1. 如果字段未明确提到，返回 null
2. 日期格式统一为 YYYY-MM-DD
3. 电话号码只保留数字
4. 金额提取数字部分，单位统一为元
5. 如果有多个相同类型的值，取第一个`
```

### 4. 处理不完整信息

```javascript
// AI 可以多次调用工具逐步收集信息
System Prompt: `你是智能助手。
如果提取的信息不完整：
1. 调用工具提取已有信息
2. 识别缺失字段
3. 向用户询问缺失信息
4. 再次调用工具补充信息`
```

### 5. 验证提取结果

```
Chat Trigger
  → AI Agent (调用 Entity Recognition Tool)
  → Code Node (验证提取结果)
    Code: |
      const data = $('Entity Recognition Tool');

      // 验证必填字段
      if (!data.name || !data.phone) {
        return {valid: false, missing: ['name', 'phone']};
      }

      // 验证格式
      if (!/^1[3-9]\d{9}$/.test(data.phone)) {
        return {valid: false, error: '手机号格式错误'};
      }

      return {valid: true, data: data};
  → Conditional Branch
    → [valid] → 继续处理
    → [invalid] → AI 重新询问
```

## 常见问题

### Q1: Tool 和 Action 版本应该选哪个？

**A**:
- **使用 Action**: 固定流程，每次都要提取信息
  - 示例: 表单提交后立即提取数据
- **使用 Tool**: AI 交互场景，按需提取
  - 示例: 对话式信息收集，AI 决定何时提取

### Q2: AI 如何知道何时调用工具？

**A**:
AI 根据以下因素决定:
1. 工具描述是否匹配当前对话需求
2. 用户消息是否包含可提取的信息
3. 对话上下文是否需要结构化信息

**优化建议**:
- 工具描述要清晰说明适用场景
- 提供调用示例
- 说明提取的字段及用途

### Q3: 如何处理部分信息缺失？

**A**:

**方案 1: Schema 设置为可选**
```json
{
  "properties": {
    "name": {"type": "string"},  // 必填
    "phone": {"type": "string"},  // 可选(不在 required 中)
    "email": {"type": "string"}   // 可选
  },
  "required": ["name"]
}
```

**方案 2: Instructions 说明处理方式**
```javascript
instructions: "如果某字段未提及，返回 null。不要猜测或使用默认值。"
```

**方案 3: AI 自动追问**
```javascript
System Prompt: "如果提取的信息缺少必填字段，向用户询问缺失信息。"
```

### Q4: 可以提取列表或数组吗？

**A**:
可以，使用 `array` 类型:

```json
{
  "properties": {
    "products": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {"type": "string"},
          "quantity": {"type": "number"}
        }
      }
    }
  }
}
```

**示例**:
```
用户: "我要买3个苹果，2个橙子，5个香蕉"
提取结果: {
  products: [
    {name: "苹果", quantity: 3},
    {name: "橙子", quantity: 2},
    {name: "香蕉", quantity: 5}
  ]
}
```

### Q5: 如何提高提取准确度？

**A**:

**1. 使用更强大的模型**
```javascript
model: "GPT-4"  // 而非 GPT-3.5
```

**2. 提供详细的字段描述**
```json
{
  "properties": {
    "date": {
      "type": "string",
      "description": "日期，格式 YYYY-MM-DD，如果用户说'明天'，计算具体日期"
    }
  }
}
```

**3. 使用 Instructions 明确规则**
```javascript
instructions: "严格按照 Schema 提取，不要推测未提及的信息。"
```

**4. 提供提取示例**
```javascript
toolDescription: `提取用户地址信息。
示例输入: "我住在北京市朝阳区xx路xx号"
示例输出: {
  province: "北京市",
  district: "朝阳区",
  street: "xx路xx号"
}`
```

### Q6: 工具可以被多次调用吗？

**A**:
可以！这正是 Tool 的优势：

```
对话流程:
用户: "我想订外卖"
AI: "好的，您想吃什么？" (不调用工具)

用户: "一份宫保鸡丁"
AI: (第1次调用) → 提取: {dish: "宫保鸡丁"}
AI: "请问送到哪里？"

用户: "xx路xx号，电话138xxx"
AI: (第2次调用) → 提取: {dish: "宫保鸡丁", address: "xx路xx号", phone: "138xxx"}
AI: "订单已确认..."
```

AI 可以根据信息完整度自主决定是否需要再次调用。

### Q7: 如何处理格式转换？

**A**:
在 Instructions 中说明:

```javascript
instructions: `格式转换规则：
- 日期: 统一转为 YYYY-MM-DD (如"明天" → "2024-01-16")
- 电话: 去除空格、横杠 (如"138-0000-0000" → "13800000000")
- 金额: 提取数字，统一为元 (如"99.9元" → 99.9)
- 布尔值: "是/好的/要" → true, "否/不要" → false`
```

AI 会根据规则自动转换格式。

## 下一步

- [AI Agent 节点](/zh-hans/guide/workflow/nodes/action-nodes/ai-agent) - 了解如何使用 AI Agent
- [Code Tool 节点](/zh-hans/guide/workflow/nodes/tool-nodes/code) - 处理提取后的数据
- [HTTP Request Tool 节点](/zh-hans/guide/workflow/nodes/tool-nodes/http-request) - 结合 API 调用

## 相关资源

- [Entity Recognition Action 节点](/zh-hans/guide/workflow/nodes/action-nodes/entity-recognition) - 了解 Action 版本
- [JSON Schema 规范](https://json-schema.org/) - 学习 JSON Schema 语法
