---
title: 数据转换节点
description: 使用表达式在工作流步骤之间转换和处理数据
---

# 数据转换节点

数据转换节点用于在工作流步骤之间使用表达式转换和处理数据。它提供了一个简洁的方式来执行数据转换操作，而无需编写完整的代码。

## 使用场景

### 典型应用
- **数据格式转换** - 将数据从一种格式转换为另一种格式
- **字段映射** - 重命名、重组或提取数据字段
- **数据过滤** - 使用表达式过滤数组或对象
- **计算字段** - 基于现有数据计算新字段
- **数据合并** - 合并多个数据源
- **类型转换** - 在字符串、数字、布尔值等类型间转换
- **数据清理** - 清理和规范化数据

## 节点配置

### 基础设置（参数面板）

#### 表达式 (expression)

用于转换数据的表达式。

**字段属性**:
- 必填字段
- 支持表达式语法
- 支持多行表达式
- 可以使用工作流表达式引擎的所有功能

**配置示例**:

```javascript
// 1. 简单的字段提取
$('HTTP Request').body.userId

// 2. 字段重命名和重组
{
  id: $('HTTP Request').body.userId,
  name: $('HTTP Request').body.userName,
  email: $('HTTP Request').body.userEmail
}

// 3. 数据转换和计算
{
  originalPrice: $('HTTP Request').body.price,
  discount: 0.1,
  finalPrice: $('HTTP Request').body.price * 0.9,
  currency: "CNY"
}

// 4. 数组处理
$('HTTP Request').body.items.map(item => ({
  id: item.id,
  name: item.name,
  price: item.price * 0.9  // 应用折扣
}))

// 5. 条件转换
$('HTTP Request').body.status === "active"
  ? { status: "启用", enabled: true }
  : { status: "禁用", enabled: false }

// 6. 多行表达式（返回对象）
{
  userId: $('Chat Trigger').userId,
  message: $('Chat Trigger').message,
  timestamp: new Date().toISOString(),
  processedMessage: $('Chat Trigger').message.toUpperCase()
}

// 7. 字符串格式化
`订单号: ${$('HTTP Request').body.orderId}
金额: ${$('HTTP Request').body.amount} 元
状态: ${$('HTTP Request').body.status}`

// 8. 数组过滤和转换
$('HTTP Request').body.products
  .filter(p => p.inStock === true)
  .map(p => ({
    name: p.name,
    price: p.price,
    category: p.category
  }))
```

**表达式方法**:

数据转换节点支持所有表达式方法，包括：

- **数组方法**: `map()`, `filter()`, `find()`, `reduce()`, `slice()`, `sort()` 等
- **字符串方法**: `toUpperCase()`, `toLowerCase()`, `replace()`, `split()`, `trim()` 等
- **数字方法**: `toFixed()`, `round()`, `floor()`, `ceil()` 等
- **对象方法**: `keys()`, `values()`, `entries()` 等

### 高级设置（设置面板）

#### 总是输出 (alwaysOutput)

当输出为空时，是否输出一个空项。

**默认值**: `false`

**用途**: 防止工作流在此节点终止，确保后续节点能够执行。

#### 仅执行一次 (executeOnce)

是否仅使用第一个输入项的数据执行一次。

**默认值**: `false`

**用途**:
- 当上游节点返回多个项时，默认会对每个项执行转换
- 启用此选项后，只对第一个项执行，提高性能

#### 失败重试 (retryOnFail)

转换失败时是否自动重试。

**默认值**: `false`

#### 最大重试次数 (maxTries)

失败后的最大重试次数。

**默认值**: `3`

#### 重试等待时间 (waitBetweenTries)

每次重试之间的等待时间（毫秒）。

**默认值**: `1000` (1秒)

#### 错误处理 (onError)

转换失败时的处理方式。

**可选值**:
- `stopWorkflow` - 停止整个工作流（默认）
- `continueRegularOutput` - 继续执行
- `continueErrorOutput` - 继续执行，使用错误输出

#### 节点描述 (nodeDescription)

为节点添加自定义描述。

```yaml
nodeDescription: "将订单数据转换为标准格式"
```

## 输出数据

数据转换节点返回表达式求值的结果。返回的数据类型取决于表达式的计算结果。

**输出示例**:

```javascript
// 简单值
"user123"

// 对象
{
  id: "user123",
  name: "张三",
  email: "zhangsan@example.com"
}

// 数组
[
  { id: 1, name: "产品A" },
  { id: 2, name: "产品B" }
]

// 字符串
"订单号: ORD-12345, 金额: 299.00 元"
```

**访问输出**:

```javascript
// 获取整个输出
$('数据转换').output

// 获取对象字段
$('数据转换').id
$('数据转换').name

// 获取数组元素
$('数据转换')[0]
$('数据转换')[0].name

// 获取字符串
$('数据转换')
```

## 工作流示例

### 示例 1: 字段重命名和重组

```
HTTP Request
  → Transform 节点
    表达式: {
      orderId: $('HTTP Request').body.order_id,
      customerName: $('HTTP Request').body.customer_name,
      totalAmount: $('HTTP Request').body.total_amount,
      status: $('HTTP Request').body.order_status
    }
  → 数据库节点
    使用转换后的数据插入数据库
```

### 示例 2: 价格计算和格式化

```
HTTP Request
  → Transform 节点
    表达式: {
      originalPrice: $('HTTP Request').body.price,
      discountRate: 0.15,
      discountAmount: $('HTTP Request').body.price * 0.15,
      finalPrice: $('HTTP Request').body.price * 0.85,
      formattedPrice: `¥${($('HTTP Request').body.price * 0.85).toFixed(2)}`
    }
  → 发送邮件节点
    使用格式化后的价格信息
```

### 示例 3: 数组过滤和转换

```
HTTP Request
  → Transform 节点
    表达式: $('HTTP Request').body.products
      .filter(p => p.stock > 0 && p.price <= 1000)
      .map(p => ({
        id: p.product_id,
        name: p.product_name,
        price: p.price,
        discountPrice: p.price * 0.9
      }))
  → 批量操作节点
    处理过滤后的产品列表
```

### 示例 4: 数据合并

```
HTTP Request A
  ↓
HTTP Request B ─→ Transform 节点
                   表达式: {
                     user: {
                       id: $('HTTP Request A').body.userId,
                       name: $('HTTP Request A').body.userName
                     },
                     order: {
                       id: $('HTTP Request B').body.orderId,
                       items: $('HTTP Request B').body.items
                     },
                     timestamp: new Date().toISOString()
                   }
                  → 发送通知节点
```

### 示例 5: 条件转换

```
AI 分类器
  → Transform 节点
    表达式: $('AI 分类器').class === "urgent"
      ? {
          priority: "high",
          subject: `[紧急] ${$('Chat Trigger').message}`,
          channel: "email"
        }
      : {
          priority: "normal",
          subject: $('Chat Trigger').message,
          channel: "chat"
        }
  → 条件分支
    根据 priority 路由到不同处理流程
```

### 示例 6: 字符串格式化

```
实体识别
  → Transform 节点
    表达式: `订单信息：
订单号：${$('实体识别').orderId}
商品：${$('实体识别').productName}
数量：${$('实体识别').quantity}
总价：¥${$('实体识别').totalPrice}
收货地址：${$('实体识别').address}`
  → 回答节点
    返回格式化的订单信息
```

### 示例 7: 类型转换

```
Webhook 触发器
  → Transform 节点
    表达式: {
      userId: String($('Webhook 触发器').body.user_id),
      age: Number($('Webhook 触发器').body.age),
      isVip: Boolean($('Webhook 触发器').body.is_vip),
      score: parseFloat($('Webhook 触发器').body.score)
    }
  → 数据库节点
    插入标准化的数据类型
```

### 示例 8: 数据清理

```
HTTP Request
  → Transform 节点
    表达式: {
      name: $('HTTP Request').body.name.trim(),
      email: $('HTTP Request').body.email.toLowerCase().trim(),
      phone: $('HTTP Request').body.phone.replace(/[^\d]/g, ''),
      address: $('HTTP Request').body.address.replace(/\s+/g, ' ')
    }
  → 验证节点
    使用清理后的数据
```

## 最佳实践

### 1. 保持表达式简洁

**好的实践**:
```javascript
// 清晰简洁
{
  id: $('HTTP Request').body.userId,
  name: $('HTTP Request').body.userName
}
```

**避免**:
```javascript
// 过于复杂，应该使用代码节点
$('HTTP Request').body.items
  .filter(i => i.price > 100)
  .map(i => ({...i, discount: i.price * 0.1}))
  .sort((a, b) => b.discount - a.discount)
  .slice(0, 10)
  .reduce((acc, cur) => ({...acc, [cur.id]: cur}), {})
```

### 2. 处理空值和错误

```javascript
// 使用默认值
{
  name: $('HTTP Request').body.name || "未知",
  email: $('HTTP Request').body.email || "",
  age: $('HTTP Request').body.age || 0
}

// 使用可选链
$('HTTP Request').body?.user?.name || "未知"
```

### 3. 保持数据一致性

```javascript
// 统一字段命名风格
{
  userId: $('HTTP Request').body.user_id,  // 统一为驼峰
  userName: $('HTTP Request').body.user_name,
  userEmail: $('HTTP Request').body.user_email
}
```

### 4. 使用注释（多行表达式）

```javascript
// 多行表达式中可以添加注释说明
{
  // 基础信息
  id: $('HTTP Request').body.id,
  name: $('HTTP Request').body.name,
  
  // 计算字段
  totalPrice: $('HTTP Request').body.price * $('HTTP Request').body.quantity,
  discountPrice: $('HTTP Request').body.price * $('HTTP Request').body.quantity * 0.9
}
```

### 5. 性能考虑

```javascript
// 避免在表达式中执行复杂计算
// 复杂逻辑应该使用代码节点

// 简单转换 ✅
{
  price: $('HTTP Request').body.price * 0.9
}

// 复杂处理 ❌（应该使用代码节点）
$('HTTP Request').body.items
  .map(item => {
    // 大量计算逻辑...
  })
```

## 常见问题

### Q1: 数据转换节点和代码节点有什么区别？

**A**:

| 特性 | 数据转换节点 | 代码节点 |
|------|------------|---------|
| 语法 | 表达式语法 | Python/JavaScript 代码 |
| 复杂度 | 适合简单转换 | 适合复杂逻辑 |
| 性能 | 更快 | 稍慢（需要执行代码） |
| 调试 | 表达式求值 | 代码执行 |
| 适用场景 | 字段映射、简单计算 | 复杂算法、业务逻辑 |

**选择建议**:
- **简单转换**（字段重命名、简单计算）→ 使用数据转换节点
- **复杂逻辑**（循环、条件判断、复杂算法）→ 使用代码节点

### Q2: 如何处理数组数据？

**A**: 使用数组方法：

```javascript
// 过滤
$('HTTP Request').body.items.filter(item => item.stock > 0)

// 映射转换
$('HTTP Request').body.items.map(item => ({
  id: item.id,
  name: item.name,
  price: item.price * 0.9
}))

// 查找
$('HTTP Request').body.items.find(item => item.id === "123")

// 切片
$('HTTP Request').body.items.slice(0, 10)
```

### Q3: 如何合并多个数据源？

**A**: 在表达式中引用多个节点：

```javascript
{
  userInfo: {
    id: $('HTTP Request A').body.userId,
    name: $('HTTP Request A').body.userName
  },
  orderInfo: {
    id: $('HTTP Request B').body.orderId,
    items: $('HTTP Request B').body.items
  },
  timestamp: new Date().toISOString()
}
```

### Q4: 表达式执行失败怎么办？

**A**: 配置错误处理：

```yaml
Settings:
  onError: "continueRegularOutput"  # 继续执行，输出空值
  # 或
  onError: "continueErrorOutput"   # 继续执行，输出错误信息
  retryOnFail: true                 # 启用重试
  maxTries: 3                       # 最多重试3次
```

### Q5: 如何调试表达式？

**A**:

1. **检查语法**: 确保表达式语法正确
2. **测试简单表达式**: 先测试简单的字段访问
3. **逐步构建**: 从简单到复杂逐步构建表达式
4. **查看输出**: 运行工作流查看实际输出

### Q6: 可以返回多个输出吗？

**A**: 可以，返回对象包含多个字段：

```javascript
{
  result1: $('HTTP Request').body.field1,
  result2: $('HTTP Request').body.field2,
  result3: $('HTTP Request').body.field3
}
```

后续节点可以通过 `$('数据转换').result1` 等方式访问。

### Q7: 如何处理嵌套对象？

**A**: 使用点号访问嵌套属性：

```javascript
{
  userId: $('HTTP Request').body.user.id,
  userName: $('HTTP Request').body.user.name,
  userEmail: $('HTTP Request').body.user.email
}
```

### Q8: 表达式太长怎么办？

**A**: 可以考虑：

1. **使用代码节点**: 如果逻辑复杂，使用代码节点更清晰
2. **拆分多个转换节点**: 将复杂转换拆分为多个步骤
3. **提取公共部分**: 在代码节点中预处理数据

## 下一步

- [代码节点](/zh-hans/guide/workflow/nodes/action-nodes/code) - 了解更复杂的数据处理
- [表达式语法](/zh-hans/guide/expressions/) - 学习表达式的完整功能
- [条件分支](/zh-hans/guide/workflow/nodes/action-nodes/if) - 根据转换结果进行条件判断

## 相关资源

- [HTTP Request 节点](/zh-hans/guide/workflow/nodes/action-nodes/http-request) - 获取需要转换的数据
- [数据库节点](/zh-hans/guide/workflow/nodes/action-nodes/database) - 使用转换后的数据

