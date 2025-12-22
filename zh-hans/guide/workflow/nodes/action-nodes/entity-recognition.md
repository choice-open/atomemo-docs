---
title: 实体识别节点
description: 从文本中提取结构化实体信息
---

# 实体识别节点

实体识别节点使用 AI 模型从非结构化文本中自动识别和提取结构化实体信息，如人名、地点、日期、金额、产品名称等。它将文本转换为结构化数据，便于后续处理和分析。

## 使用场景

### 典型应用
- **客户信息提取** - 从用户消息中提取姓名、电话、邮箱等联系信息
- **订单信息解析** - 识别产品名称、数量、价格、配送地址等订单要素
- **简历解析** - 从简历中提取教育背景、工作经历、技能等结构化信息
- **智能表单填充** - 从对话中提取信息自动填充表单字段
- **文档信息抽取** - 从合同、发票、报告中提取关键字段
- **事件提取** - 识别文本中的时间、地点、人物、事件等要素
- **产品属性提取** - 从商品描述中提取品牌、型号、规格等属性

## 节点配置

### 基础设置（参数面板）

#### 模型 (model)

选择用于实体识别的 AI 模型。

**字段属性**:
- 必填字段
- 支持主流 LLM 提供商（OpenAI、Anthropic、Google 等）
- 模型选择影响识别准确度和成本

**推荐模型**:
- **GPT-4** - 准确度高，适合复杂实体识别
- **GPT-3.5-turbo** - 性价比高，适合简单实体提取
- **Claude** - 适合长文本处理

#### 输入文本 (input)

要进行实体识别的文本内容。

**字段属性**:
- 必填字段
- 支持表达式
- 支持多行文本

**配置示例**:

```javascript
// 1. 引用 Webhook 数据
$('Webhook触发器').body.message

// 2. 引用聊天消息
$('聊天触发器').message

// 3. 引用上游节点输出
$('HTTP请求').body.description

// 4. 拼接多个字段
`姓名：${$('表单').name}
电话：${$('表单').phone}
地址：${$('表单').address}`
```

#### 补充说明 (instructions)

为模型提供额外的识别指导。

**字段属性**:
- 可选字段
- 支持多行文本
- 用于提供上下文或特定要求

**配置示例**:

```javascript
// 示例 1: 指定日期格式
"请将所有日期转换为 YYYY-MM-DD 格式"

// 示例 2: 提供业务上下文
"这是一条客户投诉消息，重点提取问题类型、产品名称和期望解决方案"

// 示例 3: 指定提取规则
"电话号码需要包含国家代码，金额单位统一为人民币"

// 示例 4: 处理模糊情况
"如果地址不完整，尽可能提取省市信息；如果没有明确的时间，标记为 null"
```

#### JSON Schema (jsonSchema)

定义要提取的实体结构和字段。

**字段属性**:
- 可选字段
- 以 JSON Schema 格式定义
- 支持可视化编辑器
- 提供预设模板

**基础示例**:

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "客户姓名"
    },
    "phone": {
      "type": "string",
      "description": "联系电话"
    },
    "email": {
      "type": "string",
      "description": "邮箱地址"
    }
  },
  "required": ["name"]
}
```

**复杂示例**:

```json
{
  "type": "object",
  "properties": {
    "order": {
      "type": "object",
      "properties": {
        "orderId": {
          "type": "string",
          "description": "订单号"
        },
        "items": {
          "type": "array",
          "description": "商品列表",
          "items": {
            "type": "object",
            "properties": {
              "productName": {"type": "string"},
              "quantity": {"type": "number"},
              "price": {"type": "number"}
            }
          }
        },
        "totalAmount": {
          "type": "number",
          "description": "订单总金额"
        },
        "shippingAddress": {
          "type": "object",
          "properties": {
            "province": {"type": "string"},
            "city": {"type": "string"},
            "district": {"type": "string"},
            "detail": {"type": "string"}
          }
        }
      }
    },
    "customer": {
      "type": "object",
      "properties": {
        "name": {"type": "string"},
        "phone": {"type": "string"}
      }
    }
  }
}
```

#### 自定义标签 (customLabels)

为字段提供自定义的显示标签。

**字段属性**:
- 可选字段
- 键值对格式
- 用于前端显示，不影响识别结果

### 高级设置（设置面板）

#### 总是输出 (alwaysOutput)

当识别结果为空时，是否输出空对象。

**默认值**: `false`

**用途**: 防止工作流在此节点终止。

#### 仅执行一次 (executeOnce)

是否仅使用第一个输入项执行一次。

**默认值**: `false`

#### 失败重试 (retryOnFail)

识别失败时是否自动重试。

**默认值**: `false`

#### 最大重试次数 (maxTries)

失败后的最大重试次数。

**默认值**: `3`

#### 重试等待时间 (waitBetweenTries)

每次重试之间的等待时间（毫秒）。

**默认值**: `1000` (1秒)

#### 错误处理 (onError)

识别失败时的处理方式。

**可选值**:
- `stopWorkflow` - 停止整个工作流（默认）
- `continueRegularOutput` - 继续执行，使用常规输出
- `continueErrorOutput` - 继续执行，使用错误输出

#### 节点描述 (nodeDescription)

为节点添加自定义描述。

```yaml
nodeDescription: "从客户消息中提取联系信息和需求"
```

## 输出数据

实体识别节点的输出结构由你定义的 JSON Schema 决定。

```javascript
// 访问提取的实体
$('实体识别').name
$('实体识别').phone
$('实体识别').email

// 访问嵌套对象
$('实体识别').order.orderId
$('实体识别').order.totalAmount

// 访问数组
$('实体识别').order.items[0].productName
$('实体识别').order.items.length

// 访问地址信息
$('实体识别').shippingAddress.city
$('实体识别').shippingAddress.detail
```

## 工作流示例

### 示例 1: 客户信息提取

```
聊天触发器
  → 实体识别节点
    模型: GPT-3.5-turbo
    输入: $('聊天触发器').message
    补充说明: "从客户消息中提取联系信息"
    JSON Schema:
      {
        "type": "object",
        "properties": {
          "name": {"type": "string", "description": "客户姓名"},
          "phone": {"type": "string", "description": "手机号码"},
          "email": {"type": "string", "description": "邮箱"},
          "company": {"type": "string", "description": "公司名称"},
          "intent": {"type": "string", "description": "咨询意图"}
        }
      }
  → 条件分支
    → [信息完整] → HTTP请求（创建客户记录）→ 回答
    → [信息不完整] → 回答（请求补充信息）
```

### 示例 2: 订单信息解析

```
Webhook触发器
  → 实体识别节点
    模型: GPT-4
    输入: $('Webhook触发器').body.orderText
    补充说明: "提取订单的完整信息，包括商品、数量、价格和配送地址"
    JSON Schema:
      {
        "type": "object",
        "properties": {
          "items": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "product": {"type": "string"},
                "quantity": {"type": "number"},
                "unitPrice": {"type": "number"}
              }
            }
          },
          "recipient": {"type": "string"},
          "phone": {"type": "string"},
          "address": {
            "type": "object",
            "properties": {
              "province": {"type": "string"},
              "city": {"type": "string"},
              "detail": {"type": "string"}
            }
          },
          "remarks": {"type": "string"}
        }
      }
  → 代码节点（计算订单总额）
  → HTTP请求（创建订单）
  → 回答节点
```

### 示例 3: 简历信息提取

```
HTTP请求（获取简历文本）
  → 实体识别节点
    模型: GPT-4
    输入: $('HTTP请求').body.resumeText
    补充说明: "提取候选人的教育背景、工作经历和技能信息"
    JSON Schema:
      {
        "type": "object",
        "properties": {
          "basicInfo": {
            "type": "object",
            "properties": {
              "name": {"type": "string"},
              "phone": {"type": "string"},
              "email": {"type": "string"},
              "birthYear": {"type": "number"}
            }
          },
          "education": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "school": {"type": "string"},
                "degree": {"type": "string"},
                "major": {"type": "string"},
                "graduationYear": {"type": "number"}
              }
            }
          },
          "workExperience": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "company": {"type": "string"},
                "position": {"type": "string"},
                "startDate": {"type": "string"},
                "endDate": {"type": "string"},
                "responsibilities": {"type": "string"}
              }
            }
          },
          "skills": {
            "type": "array",
            "items": {"type": "string"}
          }
        }
      }
  → HTTP请求（存储到招聘系统）
```

### 示例 4: 智能表单填充

```
聊天触发器
  → 实体识别节点
    模型: GPT-3.5-turbo
    输入: $('聊天触发器').conversationHistory
    补充说明: "从对话历史中提取表单所需的所有信息"
    JSON Schema:
      {
        "type": "object",
        "properties": {
          "formData": {
            "type": "object",
            "properties": {
              "firstName": {"type": "string"},
              "lastName": {"type": "string"},
              "dateOfBirth": {"type": "string"},
              "nationality": {"type": "string"},
              "passportNumber": {"type": "string"},
              "travelDate": {"type": "string"},
              "destination": {"type": "string"},
              "purpose": {"type": "string"}
            }
          },
          "missingFields": {
            "type": "array",
            "items": {"type": "string"},
            "description": "还需要询问的字段"
          }
        }
      }
  → 条件分支
    → [表单完整] → HTTP请求（提交申请）→ 回答
    → [信息缺失] → 回答（询问缺失字段）
```

### 示例 5: 发票信息提取

```
Webhook触发器（接收发票图片）
  → LLM节点（OCR 识别发票文本）
  → 实体识别节点
    模型: GPT-4
    输入: $('LLM').ocrText
    补充说明: "从发票文本中提取结构化信息，日期格式为 YYYY-MM-DD"
    JSON Schema:
      {
        "type": "object",
        "properties": {
          "invoiceNumber": {"type": "string"},
          "invoiceDate": {"type": "string"},
          "sellerInfo": {
            "type": "object",
            "properties": {
              "name": {"type": "string"},
              "taxId": {"type": "string"},
              "address": {"type": "string"}
            }
          },
          "buyerInfo": {
            "type": "object",
            "properties": {
              "name": {"type": "string"},
              "taxId": {"type": "string"}
            }
          },
          "items": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "description": {"type": "string"},
                "quantity": {"type": "number"},
                "unitPrice": {"type": "number"},
                "amount": {"type": "number"}
              }
            }
          },
          "totalAmount": {"type": "number"},
          "taxAmount": {"type": "number"}
        }
      }
  → HTTP请求（存储到财务系统）
```

## 最佳实践

### 1. 设计良好的 JSON Schema

**明确字段描述**
```json
{
  "properties": {
    "phone": {
      "type": "string",
      "description": "客户手机号码，11位数字，格式如：13812345678"
    },
    "amount": {
      "type": "number",
      "description": "订单金额，单位为人民币元，保留两位小数"
    }
  }
}
```

**使用合适的数据类型**
```json
{
  "properties": {
    "quantity": {"type": "number"},        // 使用 number 而非 string
    "isVip": {"type": "boolean"},          // 使用 boolean
    "tags": {
      "type": "array",
      "items": {"type": "string"}          // 明确数组元素类型
    }
  }
}
```

**标记必填字段**
```json
{
  "type": "object",
  "properties": {
    "name": {"type": "string"},
    "phone": {"type": "string"},
    "email": {"type": "string"}
  },
  "required": ["name", "phone"]            // 指定必填字段
}
```

### 2. 提供有效的补充说明

**包含上下文信息**
```javascript
// 好的说明
"这是客户的退款申请，请提取订单号、退款原因和退款金额"

// 不好的说明
"提取信息"
```

**说明特殊格式要求**
```javascript
"日期格式统一为 YYYY-MM-DD，金额保留两位小数，电话号码包含国家代码"
```

**处理歧义情况**
```javascript
"如果文本中同时出现多个地址，优先提取标记为'收货地址'的内容；如果未明确标记，提取最后一个出现的地址"
```

### 3. 合理选择模型

**根据任务复杂度选择**
```yaml
# 简单实体提取 - 使用较小模型
model: GPT-3.5-turbo
场景: 提取姓名、电话、邮箱等明确字段

# 复杂结构提取 - 使用强大模型
model: GPT-4
场景: 嵌套结构、需要理解上下文、模糊信息推断
```

**成本与准确度平衡**
```yaml
# 成本敏感场景
- 先用 GPT-3.5-turbo 尝试
- 失败后降级到规则提取或人工处理

# 准确度优先场景
- 直接使用 GPT-4
- 启用重试机制
```

### 4. 处理提取失败

**验证提取结果**
```
实体识别节点
  → 代码节点（验证提取的数据完整性）
    代码:
      function main({entities}) {
          const required = ['name', 'phone', 'email']
          const missing = required.filter(field => !entities[field])

          return {
              isValid: missing.length === 0,
              missingFields: missing
          }
      }
  → 条件分支
    → [有效] → 继续处理
    → [无效] → 请求补充信息
```

**设置重试策略**
```yaml
settings:
  retryOnFail: true
  maxTries: 2                     # 适度重试
  waitBetweenTries: 1000
```

### 5. 优化输入文本

**清理冗余信息**
```javascript
// 使用代码节点预处理文本
function main({rawText}) {
    // 移除多余空白
    const cleaned = rawText.replace(/\s+/g, ' ').trim()

    // 移除 HTML 标签
    const noHtml = cleaned.replace(/<[^>]*>/g, '')

    return {processedText: noHtml}
}
```

**提供结构化输入**
```javascript
// 当有多个来源时，提供清晰的结构
`客户信息：
姓名：${$('表单').name}
电话：${$('表单').phone}

咨询内容：
${$('表单').message}

历史记录：
${$('数据库').history}`
```

### 6. 处理数组和嵌套结构

**访问数组元素**
```javascript
// 获取第一个商品
$('实体识别').items[0].productName

// 遍历所有商品（在代码节点中）
$('实体识别').items.map(item => item.productName).join(', ')

// 计算总价
$('实体识别').items.reduce((sum, item) => sum + item.price * item.quantity, 0)
```

**访问嵌套对象**
```javascript
// 多层嵌套访问
$('实体识别').order.shippingAddress.city

// 使用可选链（在代码节点中）
$('实体识别').order?.shippingAddress?.city || '未提供'
```

## 常见问题

### Q1: 实体识别节点和 LLM 节点有什么区别？

**A**:
- **实体识别节点**: 专门用于从文本中提取结构化数据，输出格式由 JSON Schema 严格定义
- **LLM 节点**: 通用的文本生成，输出是自由文本

**使用建议**:
- 需要结构化数据提取 → 使用实体识别节点
- 需要文本生成或对话 → 使用 LLM 节点

### Q2: 识别准确率不高怎么办？

**A**: 提高准确率的方法：

1. **优化 JSON Schema 描述**
   ```json
   {
     "phone": {
       "type": "string",
       "description": "中国大陆手机号码，11位数字，1开头"
     }
   }
   ```

2. **提供更详细的补充说明**
   ```javascript
   "这是一条客户咨询消息，背景：客户想了解产品价格和配送信息"
   ```

3. **使用更强大的模型**（如 GPT-4）

4. **预处理输入文本**，移除干扰信息

5. **启用重试机制**

### Q3: 可以提取多少个字段？

**A**: 理论上没有严格限制，但建议：
- **简单提取**: 5-10 个字段
- **复杂提取**: 不超过 20 个字段
- **嵌套结构**: 总层级不超过 3-4 层

字段过多会：
- 增加 API 成本
- 降低识别准确率
- 增加响应时间

**解决方案**: 分多次提取，每次聚焦特定领域

### Q4: 如何处理可选字段？

**A**: 在 JSON Schema 中不要将可选字段放入 `required` 数组：

```json
{
  "type": "object",
  "properties": {
    "name": {"type": "string"},          // 必填
    "phone": {"type": "string"},         // 必填
    "email": {"type": "string"},         // 可选
    "company": {"type": "string"}        // 可选
  },
  "required": ["name", "phone"]
}
```

提取结果中，可选字段可能不存在或为 `null`。

### Q5: 文本中没有某些字段怎么办？

**A**: 模型会尝试：
- 返回 `null` 或空值
- 不返回该字段（如果是可选字段）

**处理建议**:
```javascript
// 使用条件分支检查
$('实体识别').email !== null && $('实体识别').email !== ""

// 在代码节点中提供默认值
function main({entities}) {
    return {
        email: entities.email || '未提供',
        phone: entities.phone || '未提供'
    }
}
```

### Q6: 支持哪些语言？

**A**: 取决于所选模型，主流模型通常支持：
- 中文
- 英文
- 日语
- 韩语
- 多种欧洲语言

多语言混合文本也能处理，但准确率可能略有下降。

### Q7: 实体识别的成本如何？

**A**: 成本取决于：
- **模型选择**: GPT-4 > Claude > GPT-3.5-turbo
- **输入长度**: 更长的文本成本更高
- **Schema 复杂度**: 复杂 Schema 可能需要更多 tokens

**成本优化建议**:
- 预处理文本，移除无关内容
- 使用性价比更高的模型（如 GPT-3.5-turbo）
- 启用 `executeOnce` 避免重复执行

### Q8: 可以提取图片或 PDF 中的信息吗？

**A**: 实体识别节点本身只处理文本。要处理图片或 PDF：

```
1. 使用 OCR 工具或多模态 LLM（如 GPT-4 Vision）提取文本
2. 将提取的文本传递给实体识别节点
3. 实体识别节点提取结构化信息
```

**工作流示例**:
```
Webhook触发器（接收图片）
  → LLM节点（GPT-4 Vision，提取文本）
  → 实体识别节点（提取结构化数据）
  → 后续处理
```

## 下一步

- [AI 分类器](/zh-hans/guide/workflow/nodes/action-nodes/ai-classifier) - 了解如何对文本进行分类
- [LLM 节点](/zh-hans/guide/workflow/nodes/action-nodes/llm) - 了解如何生成 AI 回复
- [代码节点](/zh-hans/guide/workflow/nodes/action-nodes/code) - 学习如何处理提取的结构化数据

## 相关资源

- [条件分支](/zh-hans/guide/workflow/nodes/action-nodes/if) - 根据提取结果进行条件判断
- [HTTP 请求节点](/zh-hans/guide/workflow/nodes/action-nodes/http-request) - 将提取的数据发送到外部系统
- [表达式语法](/zh-hans/guide/expressions/) - 学习如何访问提取的实体数据
