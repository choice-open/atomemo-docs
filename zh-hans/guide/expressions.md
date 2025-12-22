---
title: 表达式
description: 学习如何在 {{PRODUCT_NAME}} 中使用表达式进行数据处理和转换
---

# 表达式

表达式是 {{PRODUCT_NAME}} 中强大的数据处理工具，允许你在工作流中动态访问、转换和处理数据。

## 什么是表达式？

表达式是用于访问和操作工作流数据的特殊语法。通过表达式，你可以：

- **访问节点数据** - 引用任何节点的输出数据
- **转换数据** - 使用内置方法处理数组、字符串、数字等
- **动态计算** - 执行数学运算和逻辑判断
- **组合数据** - 将多个数据源合并为新的输出

## 基本语法

### 访问节点数据

在 {{PRODUCT_NAME}} 中，表达式必须明确指定节点名称：

```javascript
// 访问节点输出
$('Chat Trigger').message
$('HTTP Request').body.userId
$('Entity Recognition').productName

// 在字符串中使用表达式
`用户 ${$('Chat Trigger').userId} 的订单状态: ${$('HTTP Request').body.status}`
```

**重要**: 表达式语法始终需要指定节点名称，不支持 `$json.field` 这样的简写。

### 表达式上下文

表达式可以在以下地方使用：

- **节点参数** - 任何支持表达式的输入字段
- **条件判断** - IF 节点的条件表达式
- **代码节点** - 在 JavaScript/Python 代码中访问数据
- **HTTP 请求** - 动态构建 URL、headers、body

## 数据类型与方法

{{PRODUCT_NAME}} 表达式引擎为不同的数据类型提供了丰富的内置方法：

### [数组 (Arrays)](/zh-hans/guide/expressions/arrays)
处理数组数据的方法，包括过滤、转换、聚合等操作。

```javascript
// 示例
$('HTTP Request').body.items.first()
$('HTTP Request').body.prices.average()
$('HTTP Request').body.users.pluck('name')
```

### [布尔值 (Booleans)](/zh-hans/guide/expressions/booleans)
布尔值转换和操作方法。

```javascript
// 示例
$('HTTP Request').body.isActive.toInt()
```

### [日期 (Dates)](/zh-hans/guide/expressions/dates)
日期时间处理方法，包括格式化、计算、比较等。

```javascript
// 示例
$('Chat Trigger').timestamp.format('yyyy-MM-dd')
$('HTTP Request').body.createdAt.plus(7, 'day')
```

### [数字 (Numbers)](/zh-hans/guide/expressions/numbers)
数字运算和转换方法。

```javascript
// 示例
$('HTTP Request').body.price.round(2)
$('HTTP Request').body.count.isEven()
```

### [对象 (Objects)](/zh-hans/guide/expressions/objects)
对象操作方法，包括合并、过滤、转换等。

```javascript
// 示例
$('HTTP Request').body.user.hasField('email')
$('HTTP Request').body.config.merge({ newKey: 'value' })
```

### [字符串 (Strings)](/zh-hans/guide/expressions/strings)
字符串处理方法，包括格式化、解析、验证等。

```javascript
// 示例
$('Chat Trigger').message.toUpperCase()
$('HTTP Request').body.email.isEmail()
$('HTTP Request').body.url.extractDomain()
```

## 常见用例

### 1. 访问嵌套数据

```javascript
// 访问深层嵌套的对象属性
$('HTTP Request').body.user.profile.address.city

// 访问数组元素
$('HTTP Request').body.items[0].name
$('HTTP Request').body.items[1].price
```

### 2. 数据转换

```javascript
// 将字符串转换为数字
$('Chat Trigger').message.toInt()

// 将日期格式化
$('HTTP Request').body.createdAt.format('yyyy-MM-dd HH:mm:ss')

// 将对象转换为 JSON 字符串
$('HTTP Request').body.toJsonString()
```

### 3. 条件判断

```javascript
// 检查值是否存在
$('HTTP Request').body.email.isNotEmpty()

// 检查数字范围
$('HTTP Request').body.age > 18

// 检查日期范围
$('HTTP Request').body.createdAt.isInLast(7, 'day')
```

### 4. 数组操作

```javascript
// 获取数组长度
$('HTTP Request').body.items.length

// 提取特定字段
$('HTTP Request').body.users.pluck('email')

// 过滤数组
$('HTTP Request').body.items.filter(item => item.price > 100)

// 数组聚合
$('HTTP Request').body.prices.sum()
$('HTTP Request').body.scores.average()
```

### 5. 字符串拼接

```javascript
// 使用模板字符串
`您好，${$('HTTP Request').body.user.name}！`

// 拼接多个值
`订单 ${$('HTTP Request').body.orderId} 状态：${$('HTTP Request').body.status}`
```

## 最佳实践

### 1. 使用清晰的节点命名

```javascript
// 好的做法 - 节点名称清晰
$('Get User Info').body.name
$('Query Orders').body.items

// 不好的做法 - 节点名称不清晰
$('HTTP Request').body.name
$('HTTP Request 1').body.items
```

### 2. 处理可能不存在的数据

```javascript
// 使用可选链操作符
$('HTTP Request').body?.user?.email

// 提供默认值
$('HTTP Request').body.user.name || 'Anonymous'

// 检查是否存在
$('HTTP Request').body.user.hasField('email')
```

### 3. 避免过于复杂的表达式

```javascript
// 好的做法 - 分步处理
// 在代码节点中处理复杂逻辑，然后在其他节点中引用结果
$('Process Data').result

// 不好的做法 - 过于复杂
$('HTTP Request').body.items.filter(item => item.price > 100).pluck('name').join(', ')
```

### 4. 使用类型转换

```javascript
// 确保数据类型正确
$('Chat Trigger').message.toInt()
$('HTTP Request').body.isActive.toBoolean()
$('HTTP Request').body.timestamp.toDate()
```

### 5. 测试表达式

在开发工作流时：
1. 使用代码节点中的 `console.log()` 测试表达式
2. 在节点执行后检查输出数据
3. 使用表达式编辑器的预览功能验证结果

## 错误处理

### 常见错误

1. **节点不存在**
   ```javascript
   // 错误：引用不存在的节点
   $('Nonexistent Node').data

   // 解决：确保节点名称正确
   $('HTTP Request').data
   ```

2. **属性不存在**
   ```javascript
   // 错误：访问不存在的属性
   $('HTTP Request').body.nonexistentField

   // 解决：使用可选链或检查
   $('HTTP Request').body?.nonexistentField
   $('HTTP Request').body.hasField('nonexistentField')
   ```

3. **类型错误**
   ```javascript
   // 错误：在字符串上调用数字方法
   $('Chat Trigger').message.round()

   // 解决：先转换类型
   $('Chat Trigger').message.toInt().round()
   ```

## 调试技巧

### 1. 使用代码节点调试

```javascript
// 在代码节点中打印表达式结果
console.log('User data:', $('HTTP Request').body.user);
console.log('Item count:', $('HTTP Request').body.items.length);
return $('HTTP Request').body;
```

### 2. 分步验证

将复杂表达式拆分为多个步骤，在每个步骤验证结果：

```
HTTP Request Node
  → Code Node (验证和转换数据)
  → IF Node (条件判断)
  → Answer Node (返回结果)
```

### 3. 使用表达式编辑器

表达式编辑器提供：
- 语法高亮
- 自动完成
- 实时预览
- 错误提示

## 性能考虑

### 1. 避免重复计算

```javascript
// 不好 - 重复计算
`${$('HTTP Request').body.items.length} items, total: ${$('HTTP Request').body.items.sum()}`

// 好 - 在代码节点中计算一次，然后引用
$('Calculate Stats').summary
```

### 2. 限制数组大小

处理大型数组时要注意性能：

```javascript
// 对于大数组，考虑先过滤再处理
$('HTTP Request').body.items
  .filter(item => item.active)
  .slice(0, 100)
  .pluck('name')
```

## 下一步

- [数组方法详解](/zh-hans/guide/expressions/arrays)
- [字符串方法详解](/zh-hans/guide/expressions/strings)
- [日期方法详解](/zh-hans/guide/expressions/dates)
- [对象方法详解](/zh-hans/guide/expressions/objects)
- [数字方法详解](/zh-hans/guide/expressions/numbers)
- [布尔值方法详解](/zh-hans/guide/expressions/booleans)

## 相关资源

- [代码节点](/zh-hans/guide/workflow/nodes/action-nodes/code) - 在代码中使用表达式
- [IF 节点](/zh-hans/guide/workflow/nodes/action-nodes/if) - 条件表达式
- [HTTP 请求节点](/zh-hans/guide/workflow/nodes/action-nodes/http-request) - 在 API 调用中使用表达式
