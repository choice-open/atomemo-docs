---
title: 布尔值方法
description: 布尔值数据转换方法参考
---

# 布尔值方法

布尔值方法用于转换和处理布尔值数据。

## 方法列表

### toInt()

将布尔值转换为数字。`false` 转换为 `0`,`true` 转换为 `1`。

**返回值**: `Number`

**示例**:

```javascript
{{ true.toInt() }}
// 1

{{ false.toInt() }}
// 0

{{ $('HTTP Request').body.isActive.toInt() }}
// 将布尔值状态转换为数字，用于计算或统计
```

## 使用场景

### 1. 统计布尔值

```javascript
// 统计激活用户数量
{{ $('HTTP Request').body.users
  .map(user => user.isActive.toInt())
  .sum() }}
// 返回 true 值的数量
```

### 2. 条件计算

```javascript
// 根据条件计算折扣
{{ $('HTTP Request').body.isPremium.toInt() * 10 }}
// Premium 用户返回 10，普通用户返回 0
```

### 3. 数据库存储

```javascript
// 将布尔值转换为数字存储到数据库
{{ {
  userId: $('HTTP Request').body.userId,
  isActive: $('HTTP Request').body.isActive.toInt()
} }}
// 某些数据库使用 0/1 表示布尔值
```

## 最佳实践

### 1. 确认数据类型

```javascript
// 确保值是布尔类型再转换
{{ $('HTTP Request').body.isActive === true ? 1 : 0 }}

// 或使用 toInt
{{ $('HTTP Request').body.isActive.toInt() }}
```

### 2. 处理 null/undefined

```javascript
// 使用默认值处理可能为 null 的布尔值
{{ ($('HTTP Request').body.isActive || false).toInt() }}
// null/undefined 会被转换为 false，然后转换为 0
```

## 相关方法

### 其他类型转换为布尔值

虽然布尔值方法只有 `toInt()`，但其他类型有转换为布尔值的方法：

```javascript
// 数字转布尔
{{ (0).toBoolean() }}        // false
{{ (1).toBoolean() }}        // true
{{ (-5).toBoolean() }}       // true

// 字符串转布尔
{{ "false".toBoolean() }}    // false
{{ "0".toBoolean() }}        // false
{{ "".toBoolean() }}         // false
{{ "no".toBoolean() }}       // false
{{ "true".toBoolean() }}     // true
{{ "hello".toBoolean() }}    // true
```

## 相关资源

- [表达式概述](/zh-hans/guide/expressions)
- [数字方法](/zh-hans/guide/expressions/numbers)
- [字符串方法](/zh-hans/guide/expressions/strings)
- [代码节点](/zh-hans/guide/workflow/nodes/action-nodes/code)
