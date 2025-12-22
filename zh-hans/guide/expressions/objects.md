---
title: 对象方法
description: 对象数据转换方法参考
---

# 对象方法

对象方法用于处理和转换对象数据。

## 方法列表

### isEmpty()

检查对象是否没有任何键值对。

**返回值**: `Boolean`

**示例**:

```javascript
{{ {}.isEmpty() }}
// true

{{ { name: 'Alice' }.isEmpty() }}
// false

{{ $('HTTP Request').body.config.isEmpty() }}
// 检查配置对象是否为空
```

---

### merge(object: Object)

将两个对象合并为一个对象，以第一个对象作为基础。如果两个对象中存在相同的键，基础对象的键优先保留。

**参数**:
- `object` (Object): 要合并的对象

**返回值**: `Object`

**示例**:

```javascript
// 基础对象优先
{{ { a: 1, b: 2 }.merge({ b: 3, c: 4 }) }}
// { "a": 1, "b": 2, "c": 4 }

{{ { name: 'Alice', age: 25 }.merge({ age: 30, city: 'Beijing' }) }}
// { "name": "Alice", "age": 25, "city": "Beijing" }

{{ $('HTTP Request').body.user.merge($('Default Config').defaults) }}
// 将默认配置合并到用户数据
```

---

### hasField(fieldName: String)

检查对象是否包含指定字段。仅支持顶层键。

**参数**:
- `fieldName` (String): 要检查的字段名

**返回值**: `Boolean`

**示例**:

```javascript
{{ { name: 'Alice', age: 25 }.hasField('name') }}
// true

{{ { name: 'Alice', age: 25 }.hasField('email') }}
// false

{{ $('HTTP Request').body.user.hasField('email') }}
// 检查用户对象是否包含邮箱字段
```

---

### removeField(key: String)

从对象中移除指定字段。

**参数**:
- `key` (String): 要移除的字段名

**返回值**: `Object`

**示例**:

```javascript
{{ { name: 'Alice', age: 25, password: '123456' }.removeField('password') }}
// { "name": "Alice", "age": 25 }

{{ $('HTTP Request').body.user.removeField('internalId') }}
// 移除内部 ID 字段
```

---

### removeFieldsContaining(value: String)

从对象中移除所有值包含指定字符串的字段。

**参数**:
- `value` (String): 要删除的字段的字段值（字符串匹配）

**返回值**: `Object`

**示例**:

```javascript
{{ { a: "apple", b: "banana", c: "cherry" }.removeFieldsContaining("a") }}
// { "c": "cherry" }
// 移除值包含 "a" 的字段

{{ { a: "test", b: "production", c: "test_mode" }.removeFieldsContaining("test") }}
// { "b": "production" }

// 将空字符串作为指定值
{{ { a: "apple", b: "banana" }.removeFieldsContaining("") }}
// {}
// 所有字符串都包含空字符串，所以全部移除

{{ $('HTTP Request').body.data.removeFieldsContaining("temp") }}
// 移除所有包含 "temp" 的临时字段
```

---

### keepFieldsContaining(value: String)

从对象中删除与给定值不匹配的字段（保留包含指定字符串的字段）。

**参数**:
- `value` (String): 要保留的字段的字段值（字符串匹配）

**返回值**: `Object`

**示例**:

```javascript
{{ { a: "apple", b: "banana", c: "cherry" }.keepFieldsContaining("a") }}
// { "a": "apple", "b": "banana" }
// 保留值包含 "a" 的字段

{{ { a: "apple", b: "banana", c: "cherry" }.keepFieldsContaining("x") }}
// {}
// 没有字段值包含 "x"

{{ { a: "apple", b: "banana" }.keepFieldsContaining("") }}
// { "a": "apple", "b": "banana" }
// 所有字符串都包含空字符串，所以全部保留

{{ $('HTTP Request').body.data.keepFieldsContaining("prod") }}
// 只保留生产环境相关的字段
```

---

### compact()

从对象中移除空值（只移除 `null` 和 `undefined`）。

**返回值**: `Object`

**示例**:

```javascript
{{ { a: 1, b: null, c: undefined, d: "hello" }.compact() }}
// { "a": 1, "d": "hello" }

{{ { a: 0, b: "", c: [], d: {} }.compact() }}
// { "a": 0, "b": "", "c": [], "d": {} }
// 注意：0、空字符串、空数组、空对象不会被移除

{{ { a: false, b: null, c: undefined }.compact() }}
// { "a": false }

{{ $('HTTP Request').body.user.compact() }}
// 移除用户对象中的 null 和 undefined 值
```

---

### toJsonString()

将对象转换为 JSON 字符串。相当于 `JSON.stringify`。

**返回值**: `String`

**示例**:

```javascript
{{ { name: 'Alice', age: 25 }.toJsonString() }}
// '{"name":"Alice","age":25}'

{{ $('HTTP Request').body.user.toJsonString() }}
// 将用户对象转换为 JSON 字符串
```

---

### urlEncode()

将对象转换为 URL 参数。仅支持顶层键。

**返回值**: `String`

**示例**:

```javascript
{{ { name: 'Alice', age: 25 }.urlEncode() }}
// "name=Alice&age=25"

{{ { q: 'hello world', page: 1 }.urlEncode() }}
// "q=hello%20world&page=1"

{{ $('HTTP Request').body.params.urlEncode() }}
// 将参数对象转换为 URL 查询字符串
```

## 使用场景

### 1. 对象合并

```javascript
// 合并用户输入和默认配置
{{ $('User Input').config.merge({
  timeout: 30000,
  retries: 3,
  debug: false
}) }}

// 合并多个数据源
{{ $('Source A').data.merge($('Source B').data) }}
```

### 2. 字段过滤

```javascript
// 移除敏感字段
{{ $('HTTP Request').body.user
  .removeField('password')
  .removeField('token') }}

// 只保留特定字段
{{ $('HTTP Request').body.data.keepFieldsContaining("public") }}

// 移除测试字段
{{ $('HTTP Request').body.data.removeFieldsContaining("test") }}
```

### 3. 数据清理

```javascript
// 移除空值
{{ $('HTTP Request').body.formData.compact() }}

// 移除不需要的字段
{{ $('HTTP Request').body.user
  .removeField('_id')
  .removeField('__v')
  .compact() }}
```

### 4. 数据转换

```javascript
// 转换为 JSON 字符串存储
{{ $('HTTP Request').body.config.toJsonString() }}

// 转换为 URL 参数
{{ $('HTTP Request').body.filters.urlEncode() }}
```

### 5. 字段验证

```javascript
// 检查必需字段
{{ $('HTTP Request').body.user.hasField('email')
  && $('HTTP Request').body.user.hasField('name') }}

// 检查对象是否为空
{{ $('HTTP Request').body.result.isEmpty() }}
```

## 链式调用

对象方法可以链式调用：

```javascript
// 清理和合并对象
{{ $('HTTP Request').body.user
  .compact()
  .removeField('password')
  .merge({ updatedAt: $now() }) }}

// 过滤和转换
{{ $('HTTP Request').body.config
  .keepFieldsContaining("prod")
  .compact()
  .toJsonString() }}
```

## 嵌套对象处理

对象方法主要处理顶层键。对于嵌套对象，建议使用代码节点：

```javascript
// 在代码节点中处理嵌套对象
const user = $('HTTP Request').body.user;

// 处理嵌套字段
if (user.profile && user.profile.settings) {
  delete user.profile.settings.internalFlag;
}

return user;
```

## 最佳实践

### 1. 合并对象时注意顺序

```javascript
// 基础对象的值优先
{{ $('User Data').config.merge($('Default Config').defaults) }}
// User Data 的值会覆盖 Default Config 的值
```

### 2. 使用 compact 移除空值

```javascript
// 在发送 API 请求前清理数据
{{ $('HTTP Request').body.params.compact() }}
```

### 3. 移除敏感信息

```javascript
// 在记录日志前移除敏感字段
{{ $('HTTP Request').body.user
  .removeField('password')
  .removeField('creditCard')
  .removeField('ssn') }}
```

### 4. 检查字段存在性

```javascript
// 在访问前检查字段是否存在
{{ $('HTTP Request').body.user.hasField('email')
  ? $('HTTP Request').body.user.email
  : 'no-email@example.com' }}
```

### 5. 使用 urlEncode 构建查询字符串

```javascript
// 构建 API 查询参数
{{ `https://api.example.com/search?${$('HTTP Request').body.filters.urlEncode()}` }}
```

## 与其他方法结合

```javascript
// 获取对象的键数组
{{ Object.keys($('HTTP Request').body.user) }}

// 获取对象的值数组
{{ Object.values($('HTTP Request').body.prices) }}

// 在代码节点中使用对象方法
const data = $('HTTP Request').body.data;
const cleaned = data.compact().removeField('_internal');
return cleaned;
```

## 相关资源

- [表达式概述](/zh-hans/guide/expressions)
- [数组方法](/zh-hans/guide/expressions/arrays)
- [字符串方法](/zh-hans/guide/expressions/strings)
- [代码节点](/zh-hans/guide/workflow/nodes/action-nodes/code)
