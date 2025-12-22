---
title: 数组方法
description: 数组数据转换方法参考
---

# 数组方法

数组方法用于处理和转换数组数据。所有方法都可以链式调用。

## 方法列表

### average()

返回数组中数字元素的平均值。

**返回值**: `Number`

**示例**:

```javascript
{{ [1, 2, 3, 4, 5].average() }}
// 3

{{ [10, 20, 30].average() }}
// 20

{{ $('HTTP Request').body.prices.average() }}
// 计算价格平均值
```

---

### chunk(size: Number)

将数组拆分为长度为指定大小的多个块。

**参数**:
- `size` (Number): 每个块的大小

**返回值**: `Array`

**示例**:

```javascript
{{ [1, 2, 3, 4, 5].chunk(2) }}
// [[1, 2], [3, 4], [5]]

{{ ['a', 'b', 'c', 'd', 'e', 'f'].chunk(3) }}
// [['a', 'b', 'c'], ['d', 'e', 'f']]

{{ $('HTTP Request').body.items.chunk(10) }}
// 每次处理 10 个项目
```

---

### compact()

从数组中移除空值（`null` 和 `undefined`）。

**返回值**: `Array`

**示例**:

```javascript
{{ [1, null, 2, undefined, 3].compact() }}
// [1, 2, 3]

{{ [0, false, '', null, undefined, 'hello'].compact() }}
// [0, false, '', 'hello']
// 注意：0、false、'' 不会被移除

{{ $('HTTP Request').body.users.compact() }}
// 移除空用户
```

---

### difference(arr: Array)

比较两个数组，返回基础数组中不在 `arr` 中的所有元素。

**参数**:
- `arr` (Array): 要比较的数组

**返回值**: `Array`

**示例**:

```javascript
{{ [1, 2, 3, 4, 5].difference([3, 4, 5, 6, 7]) }}
// [1, 2]

{{ ['a', 'b', 'c'].difference(['b', 'c', 'd']) }}
// ['a']

{{ $('Current Users').users.difference($('Previous Users').users) }}
// 找出新用户
```

---

### intersection(arr: Array)

比较两个数组，返回基础数组中也存在于 `arr` 的所有元素。

**参数**:
- `arr` (Array): 要比较的数组

**返回值**: `Array`

**示例**:

```javascript
{{ [1, 2, 3, 4, 5].intersection([3, 4, 5, 6, 7]) }}
// [3, 4, 5]

{{ ['a', 'b', 'c'].intersection(['b', 'c', 'd']) }}
// ['b', 'c']

{{ $('List A').items.intersection($('List B').items) }}
// 找出共同项
```

---

### first()

返回数组的第一个元素。数组为空时返回 `undefined`。

**返回值**: `Array item`

**示例**:

```javascript
{{ [1, 2, 3].first() }}
// 1

{{ ['apple', 'banana', 'cherry'].first() }}
// 'apple'

{{ [].first() }}
// undefined

{{ $('HTTP Request').body.items.first() }}
// 第一个项目
```

---

### isEmpty()

检查数组是否为空（没有任何元素）。

**返回值**: `Boolean`

**示例**:

```javascript
{{ [].isEmpty() }}
// true

{{ [1, 2, 3].isEmpty() }}
// false

{{ $('HTTP Request').body.items.isEmpty() }}
// 检查是否有项目
```

---

### isNotEmpty()

检查数组是否包含元素。

**返回值**: `Boolean`

**示例**:

```javascript
{{ [1, 2, 3].isNotEmpty() }}
// true

{{ [].isNotEmpty() }}
// false

{{ $('HTTP Request').body.users.isNotEmpty() }}
// 检查是否有用户
```

---

### last()

返回数组的最后一个元素。数组为空时返回 `undefined`。

**返回值**: `Array item`

**示例**:

```javascript
{{ [1, 2, 3].last() }}
// 3

{{ ['apple', 'banana', 'cherry'].last() }}
// 'cherry'

{{ [].last() }}
// undefined

{{ $('HTTP Request').body.items.last() }}
// 最后一个项目
```

---

### max()

返回数组中的最大值。

**返回值**: `Number`

**示例**:

```javascript
{{ [1, 5, 3, 9, 2].max() }}
// 9

{{ [-10, -5, -20].max() }}
// -5

{{ $('HTTP Request').body.prices.max() }}
// 最高价格
```

---

### merge(arr: Array)

将两个数组合并为一个数组。对于对象数组，会保留所有元素。

**参数**:
- `arr` (Array): 要合并到基本数组中的数组

**返回值**: `Array`

**示例**:

```javascript
{{ [1, 2, 3].merge([4, 5]) }}
// [1, 2, 3, 4, 5]

{{ [].merge([4, 5]) }}
// [4, 5]

{{ [1, 2, 3].merge([]) }}
// [1, 2, 3]

{{ [].merge([]) }}
// []

{{ [1, 2, 3].merge([3, 2, 5]) }}
// [1, 2, 3, 3, 2, 5]
// 注意：不会自动去重

{{ $('List A').items.merge($('List B').items) }}
// 合并两个列表
```

---

### min()

获取仅包含数字的数组中的最小值。

**返回值**: `Number`

**示例**:

```javascript
{{ [1, 5, 3, 9, 2].min() }}
// 1

{{ [-10, -5, -20].min() }}
// -20

{{ $('HTTP Request').body.prices.min() }}
// 最低价格
```

---

### pluck(fieldName?: String)

返回一个对象数组，其中每个对象只包含指定的字段名作为键。

**参数**:
- `fieldName` (String, 可选): 要提取的字段名

**返回值**: `Array`

**示例**:

```javascript
{{ [
  { id: 1, name: 'Alice', age: 25 },
  { id: 2, name: 'Bob', age: 30 }
].pluck('name') }}
// ['Alice', 'Bob']

{{ [
  { id: 1, name: 'Alice', age: 25 },
  { id: 2, name: 'Bob', age: 30 }
].pluck('age') }}
// [25, 30]

{{ $('HTTP Request').body.users.pluck('email') }}
// 提取所有用户的邮箱
```

---

### randomItem()

从数组中返回一个随机元素。

**返回值**: `Array item`

**示例**:

```javascript
{{ [1, 2, 3, 4, 5].randomItem() }}
// 随机返回一个数字，例如：3

{{ ['red', 'green', 'blue'].randomItem() }}
// 随机返回一个颜色

{{ $('HTTP Request').body.quotes.randomItem() }}
// 随机选择一条引用
```

---

### removeDuplicates(key?: String)

从数组中移除重复元素。

**参数**:
- `key` (String, 可选): 对于对象数组，指定用于判断重复的字段名

**返回值**: `Array`

**示例**:

```javascript
// 简单数组去重
{{ [1, 2, 2, 3, 3, 3, 4].removeDuplicates() }}
// [1, 2, 3, 4]

// 对象数组，根据指定字段去重
{{ [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 1, name: "Alice" }
].removeDuplicates("id") }}
// [
//   { "id": 1, "name": "Alice" },
//   { "id": 2, "name": "Bob" }
// ]

// 对象数组，不指定字段
// 对象引用不同，即使内容相同也不会去掉重复对象
{{ [
  { id: 1, name: "Alice" },
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" }
].removeDuplicates() }}
// [
//   { "id": 1, "name": "Alice" },
//   { "id": 1, "name": "Alice" },
//   { "id": 2, "name": "Bob" }
// ]

{{ $('HTTP Request').body.users.removeDuplicates('email') }}
// 根据邮箱去重
```

---

### renameKeys(from: String, to: String)

重命名数组中所有匹配的键。可以通过输入一系列逗号分隔的字符串来重命名多个键。

**参数**:
- `from` (String): 要重命名的原始键名（逗号分隔）
- `to` (String): 新的键名（逗号分隔）

**返回值**: `Array`

**示例**:

```javascript
// 重命名单个键
{{ [
  { oldName: 'Alice', age: 25 },
  { oldName: 'Bob', age: 30 }
].renameKeys('oldName', 'newName') }}
// [
//   { "newName": "Alice", "age": 25 },
//   { "newName": "Bob", "age": 30 }
// ]

// 重命名多个键
{{ [
  { firstName: 'Alice', lastName: 'Smith' }
].renameKeys('firstName,lastName', 'first,last') }}
// [
//   { "first": "Alice", "last": "Smith" }
// ]

{{ $('HTTP Request').body.users.renameKeys('user_id,user_name', 'id,name') }}
// 将 API 返回的字段名转换为应用内部使用的字段名
```

---

### sum()

返回可解析数字数组中所有值的总和。

**返回值**: `Number`

**示例**:

```javascript
{{ [1, 2, 3, 4, 5].sum() }}
// 15

{{ [10, 20, 30].sum() }}
// 60

{{ $('HTTP Request').body.prices.sum() }}
// 总价格
```

---

### toJsonString()

将数组转换为 JSON 字符串。相当于 `JSON.stringify`。

**返回值**: `String`

**示例**:

```javascript
{{ [1, 2, 3].toJsonString() }}
// "[1,2,3]"

{{ [{ name: 'Alice' }, { name: 'Bob' }].toJsonString() }}
// '[{"name":"Alice"},{"name":"Bob"}]'

{{ $('HTTP Request').body.items.toJsonString() }}
// 将数组转换为 JSON 字符串用于存储或传输
```

---

### union(arr: Array)

将两个数组合并后移除重复项。

**参数**:
- `arr` (Array): 要合并的数组

**返回值**: `Array`

**示例**:

```javascript
{{ [1, 2, 3].union([3, 4, 5]) }}
// [1, 2, 3, 4, 5]

{{ ['a', 'b'].union(['b', 'c']) }}
// ['a', 'b', 'c']

{{ $('List A').items.union($('List B').items) }}
// 合并两个列表并去重
```

---

### unique(key?: String)

从数组中移除重复项。功能与 `removeDuplicates()` 相同。

**参数**:
- `key` (String, 可选): 对于对象数组，指定用于判断重复的字段名

**返回值**: `Array`

**示例**:

```javascript
{{ [1, 1, 2, 2, 3].unique() }}
// [1, 2, 3]

{{ [
  { id: 1, name: 'Alice' },
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
].unique('id') }}
// [
//   { "id": 1, "name": "Alice" },
//   { "id": 2, "name": "Bob" }
// ]
```

## 链式调用

数组方法可以链式调用：

```javascript
{{ $('HTTP Request').body.items
  .filter(item => item.active)
  .pluck('price')
  .compact()
  .average() }}
// 计算所有活跃项目的平均价格
```

## 使用场景

### 1. 数据提取

```javascript
// 提取所有用户的邮箱
{{ $('Get Users').body.users.pluck('email') }}

// 提取第一个和最后一个项目
{{ $('HTTP Request').body.items.first() }}
{{ $('HTTP Request').body.items.last() }}
```

### 2. 数据聚合

```javascript
// 计算总价
{{ $('HTTP Request').body.prices.sum() }}

// 计算平均分
{{ $('HTTP Request').body.scores.average() }}

// 找出最高价和最低价
{{ $('HTTP Request').body.prices.max() }}
{{ $('HTTP Request').body.prices.min() }}
```

### 3. 数据清理

```javascript
// 移除空值
{{ $('HTTP Request').body.items.compact() }}

// 去重
{{ $('HTTP Request').body.users.unique('id') }}

// 重命名字段
{{ $('HTTP Request').body.users.renameKeys('user_id', 'id') }}
```

### 4. 数据合并

```javascript
// 合并两个列表
{{ $('List A').items.merge($('List B').items) }}

// 合并并去重
{{ $('List A').items.union($('List B').items) }}

// 找出共同项
{{ $('List A').items.intersection($('List B').items) }}

// 找出差异
{{ $('List A').items.difference($('List B').items) }}
```

### 5. 数据分组

```javascript
// 将数组分块处理
{{ $('HTTP Request').body.items.chunk(10) }}
// 每次处理 10 个项目
```

## 最佳实践

### 1. 检查数组是否为空

```javascript
// 在处理前检查
{{ $('HTTP Request').body.items.isNotEmpty() }}
```

### 2. 处理可能不存在的字段

```javascript
// 使用 compact 移除空值
{{ $('HTTP Request').body.users.pluck('email').compact() }}
```

### 3. 组合多个方法

```javascript
// 链式调用多个方法
{{ $('HTTP Request').body.items
  .compact()
  .unique('id')
  .pluck('name') }}
```

### 4. 性能考虑

```javascript
// 先过滤再处理，减少数据量
{{ $('HTTP Request').body.items
  .filter(item => item.active)
  .pluck('price')
  .sum() }}
```

## 相关资源

- [表达式概述](/zh-hans/guide/expressions)
- [对象方法](/zh-hans/guide/expressions/objects)
- [字符串方法](/zh-hans/guide/expressions/strings)
- [代码节点](/zh-hans/guide/workflow/nodes/action-nodes/code)
