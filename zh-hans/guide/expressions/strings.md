---
title: 字符串方法
description: 字符串数据转换方法参考
---

# 字符串方法

字符串方法用于处理和转换字符串数据。

## 方法列表

### base64Encode()

将字符串编码为 Base64。

**返回值**: `String` (Base64 编码的字符串)

**示例**:

```javascript
{{ "hello world".base64Encode() }}
// "aGVsbG8gd29ybGQ="

{{ $('Chat Trigger').message.base64Encode() }}
// 将消息编码为 Base64
```

---

### base64Decode()

将 Base64 编码的字符串转换为普通字符串。

**返回值**: `String` (解码后的普通字符串)

**示例**:

```javascript
{{ "aGVsbG8gd29ybGQ=".base64Decode() }}
// "hello world"

{{ $('HTTP Request').body.encodedData.base64Decode() }}
// 解码 Base64 数据
```

---

### extractDomain()

从包含有效 URL 的字符串中提取域名。如果未找到域名，则返回 `undefined`。

**返回值**: `String | undefined`

**示例**:

```javascript
{{ "https://www.example.com/path".extractDomain() }}
// "www.example.com"

{{ "Visit https://github.com for more info".extractDomain() }}
// "github.com"

{{ $('HTTP Request').body.url.extractDomain() }}
// 提取 URL 中的域名
```

---

### extractEmail()

从字符串中提取电子邮件地址。如果未找到，则返回 `undefined`。如果包含多个邮箱，返回第一个。

**返回值**: `String | undefined`

**示例**:

```javascript
{{ "Contact us at info@example.com".extractEmail() }}
// "info@example.com"

{{ "Email: john@test.com or support@test.com".extractEmail() }}
// "john@test.com" (返回第一个)

{{ $('Chat Trigger').message.extractEmail() }}
// 从消息中提取邮箱地址
```

---

### extractUrl()

从字符串中提取 URL。如果未找到，则返回 `undefined`。如果包含多个 URL，返回第一个。仅限 http(s) 协议。

**返回值**: `String | undefined`

**示例**:

```javascript
{{ "Visit https://example.com for more".extractUrl() }}
// "https://example.com"

{{ "Check http://test.com and https://demo.com".extractUrl() }}
// "http://test.com" (返回第一个)

{{ $('Chat Trigger').message.extractUrl() }}
// 从消息中提取 URL
```

---

### extractUrlPath()

从 URL 中提取路径，但不包含根域名。

**返回值**: `String`

**示例**:

```javascript
{{ "https://example.com/orders/1/details".extractUrlPath() }}
// "/orders/1/details"

{{ "https://api.example.com/v1/users".extractUrlPath() }}
// "/v1/users"

{{ $('HTTP Request').body.url.extractUrlPath() }}
// 提取 URL 路径
```

---

### hash(algo?: Algorithm)

返回使用指定算法生成的字符串哈希值。

**参数**:
- `algo` (Algorithm, 可选): 要使用的哈希算法。枚举值：`md5`（默认）、`base64`、`sha1`、`sha224`、`sha256`、`sha384`、`sha512`、`sha3`、`ripemd160`

**返回值**: `String`

**示例**:

```javascript
{{ "hello world".hash() }}
// 默认使用 md5
// "5eb63bbbe01eeed093cb22bb8f5acdc3"

{{ "hello world".hash("md5") }}
// "5eb63bbbe01eeed093cb22bb8f5acdc3"

{{ "hello world".hash("sha256") }}
// "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9"

{{ $('Chat Trigger').message.hash("sha256") }}
// 生成消息的 SHA-256 哈希
```

---

### isDomain()

检查一个字符串是否为域名。

**返回值**: `Boolean`

**示例**:

```javascript
{{ "example.com".isDomain() }}
// true

{{ "www.example.com".isDomain() }}
// true

{{ "not-a-domain".isDomain() }}
// false

{{ "https://example.com".isDomain() }}
// false (包含协议，不是纯域名)

{{ $('HTTP Request').body.domain.isDomain() }}
// 验证是否为有效域名
```

---

### isEmail()

检查一个字符串是否为电子邮件地址。

**返回值**: `Boolean`

**示例**:

```javascript
{{ "user@example.com".isEmail() }}
// true

{{ "invalid-email".isEmail() }}
// false

{{ $('HTTP Request').body.email.isEmail() }}
// 验证邮箱格式
```

---

### isEmpty()

检查一个字符串是否为空。

**返回值**: `Boolean`

**示例**:

```javascript
{{ "".isEmpty() }}
// true

{{ "hello".isEmpty() }}
// false

{{ $('Chat Trigger').message.isEmpty() }}
// 检查消息是否为空
```

---

### isNotEmpty()

检查一个字符串是否不为空。

**返回值**: `Boolean`

**示例**:

```javascript
{{ "hello".isNotEmpty() }}
// true

{{ "".isNotEmpty() }}
// false

{{ $('Chat Trigger').message.isNotEmpty() }}
// 检查消息是否不为空
```

---

### isNumeric()

检查一个字符串是否仅包含数字（包括浮点数和科学计数法）。

**返回值**: `Boolean`

**示例**:

```javascript
{{ "123".isNumeric() }}
// true

{{ "3.14".isNumeric() }}
// true

{{ "1.2e-3".isNumeric() }}
// true (科学计数法)

{{ "abc".isNumeric() }}
// false

{{ $('Chat Trigger').message.isNumeric() }}
// 检查输入是否为数字
```

---

### isUrl()

检查一个字符串是否为有效的 URL（格式有效即可）。

**返回值**: `Boolean`

**示例**:

```javascript
{{ "https://example.com".isUrl() }}
// true

{{ "http://test.com/path".isUrl() }}
// true

{{ "not-a-url".isUrl() }}
// false

{{ $('HTTP Request').body.url.isUrl() }}
// 验证 URL 格式
```

---

### parseJson()

等同于 `JSON.parse()`。将字符串解析为 JSON 对象。

**返回值**: `Object | Array`

**示例**:

```javascript
{{ '{"name":"Alice","age":25}'.parseJson() }}
// { name: "Alice", age: 25 }

{{ '[1,2,3]'.parseJson() }}
// [1, 2, 3]

{{ $('HTTP Request').body.jsonString.parseJson() }}
// 解析 JSON 字符串
```

---

### quote(mark?: String)

返回一个被引号包裹的字符串。默认引号为 `"`。会自动处理转义。

**参数**:
- `mark` (String, 可选): 引号字符。默认为 `"`

**返回值**: `String`

**示例**:

```javascript
{{ "hello".quote() }}
// "\"hello\""

{{ "hello".quote("'") }}
// "'hello'"

{{ 'say "hello"'.quote() }}
// "\"say \\\"hello\\\"\""

{{ $('Chat Trigger').message.quote() }}
// 给消息添加引号
```

---

### removeMarkdown()

从字符串中移除 Markdown 格式。

**返回值**: `String`

**示例**:

```javascript
{{ "# Hello\n**bold** text".removeMarkdown() }}
// "Hello\nbold text"

{{ $('HTTP Request').body.markdown.removeMarkdown() }}
// 移除 Markdown 格式
```

---

### removeTags()

从字符串中移除标签，例如 HTML 或 XML 标签。

**返回值**: `String`

**示例**:

```javascript
{{ "<p>Hello <strong>World</strong></p>".removeTags() }}
// "Hello World"

{{ "<div>Test</div>".removeTags() }}
// "Test"

{{ $('HTTP Request').body.html.removeTags() }}
// 移除 HTML 标签
```

---

### toBoolean()

将字符串转换为布尔值。`"false"`、`"0"`、`""` 和 `"no"` 会被转换为 `false`。

**返回值**: `Boolean`

**示例**:

```javascript
{{ "true".toBoolean() }}
// true

{{ "false".toBoolean() }}
// false

{{ "0".toBoolean() }}
// false

{{ "".toBoolean() }}
// false

{{ "no".toBoolean() }}
// false

{{ "yes".toBoolean() }}
// true

{{ "hello".toBoolean() }}
// true

{{ $('HTTP Request').body.flag.toBoolean() }}
// 将字符串标志转换为布尔值
```

---

### toDecimalNumber()

将字符串转换为十进制数字。

**返回值**: `Number`

**示例**:

```javascript
{{ "3.14".toDecimalNumber() }}
// 3.14

{{ "42".toDecimalNumber() }}
// 42

{{ $('Chat Trigger').message.toDecimalNumber() }}
// 将输入转换为十进制数
```

---

### toFloat()

将字符串转换为浮点数。

**返回值**: `Number`

**示例**:

```javascript
{{ "3.14".toFloat() }}
// 3.14

{{ "42".toFloat() }}
// 42.0

{{ $('HTTP Request').body.price.toFloat() }}
// 将价格字符串转换为浮点数
```

---

### toInt()

将字符串转换为整数。

**返回值**: `Number`

**示例**:

```javascript
{{ "42".toInt() }}
// 42

{{ "3.14".toInt() }}
// 3

{{ "1.2e3".toInt() }}
// 1200

{{ $('Chat Trigger').message.toInt() }}
// 将输入转换为整数
```

---

### toSentenceCase()

将字符串格式化为句首大写（Sentence Case）。只将第一个字母大写，其余小写。

**返回值**: `String`

**示例**:

```javascript
{{ "hello world".toSentenceCase() }}
// "Hello world"

{{ "HELLO WORLD".toSentenceCase() }}
// "Hello world"

{{ "你好，世界".toSentenceCase() }}
// "你好，世界" (中文不变)

{{ $('Chat Trigger').message.toSentenceCase() }}
// 将消息转换为句首大写
```

---

### toSnakeCase()

将字符串格式化为蛇形命名（snake_case）。仅支持 ASCII 字符。

**返回值**: `String`

**示例**:

```javascript
{{ "helloWorld".toSnakeCase() }}
// "hello_world"

{{ "HelloWorld".toSnakeCase() }}
// "hello_world"

{{ "hello-world".toSnakeCase() }}
// "hello_world"

{{ $('HTTP Request').body.fieldName.toSnakeCase() }}
// 转换字段名为蛇形命名
```

---

### toWholeNumber()

将字符串转换为整数（Whole Number）。对于浮点数，直接截断小数部分。

**返回值**: `Number`

**示例**:

```javascript
{{ "42".toWholeNumber() }}
// 42

{{ "3.9".toWholeNumber() }}
// 3 (截断小数)

{{ "-3.9".toWholeNumber() }}
// -3

{{ $('HTTP Request').body.count.toWholeNumber() }}
// 转换为整数
```

---

### urlDecode(entireString?: Boolean)

解码 URL 编码的字符串。

**参数**:
- `entireString` (Boolean, 可选): 是否解码整个字符串

**返回值**: `String`

**示例**:

```javascript
{{ "hello%20world".urlDecode() }}
// "hello world"

{{ "name%3DAlice%26age%3D25".urlDecode() }}
// "name=Alice&age=25"

{{ $('HTTP Request').body.encodedParam.urlDecode() }}
// 解码 URL 参数
```

---

### urlEncode(entireString?: Boolean)

将字符串编码以便在 URL 中使用或包含。

**参数**:
- `entireString` (Boolean, 可选): 是否编码整个字符串

**返回值**: `String`

**示例**:

```javascript
{{ "hello world".urlEncode() }}
// "hello%20world"

{{ "name=Alice&age=25".urlEncode() }}
// "name%3DAlice%26age%3D25"

{{ $('Chat Trigger').message.urlEncode() }}
// 编码消息用于 URL
```

## 标准字符串方法

除了上述自定义方法，你还可以使用 JavaScript 标准字符串方法：

```javascript
// 大小写转换
{{ "hello".toUpperCase() }}        // "HELLO"
{{ "HELLO".toLowerCase() }}        // "hello"

// 去除空格
{{ "  hello  ".trim() }}           // "hello"
{{ "hello  ".trimEnd() }}          // "hello"
{{ "  hello".trimStart() }}        // "hello"

// 字符串查找
{{ "hello world".includes("world") }}    // true
{{ "hello world".startsWith("hello") }}  // true
{{ "hello world".endsWith("world") }}    // true
{{ "hello world".indexOf("world") }}     // 6

// 字符串替换
{{ "hello world".replace("world", "there") }}  // "hello there"
{{ "aaa".replaceAll("a", "b") }}               // "bbb"

// 字符串分割和连接
{{ "a,b,c".split(",") }}           // ["a", "b", "c"]
{{ ["a", "b", "c"].join("-") }}    // "a-b-c"

// 字符串截取
{{ "hello".substring(0, 2) }}      // "he"
{{ "hello".slice(1, 4) }}          // "ell"

// 重复
{{ "ha".repeat(3) }}               // "hahaha"

// 长度
{{ "hello".length }}               // 5
```

## 使用场景

### 1. URL 处理

```javascript
// 提取域名
{{ $('HTTP Request').body.url.extractDomain() }}

// 提取路径
{{ $('HTTP Request').body.url.extractUrlPath() }}

// 验证 URL
{{ $('HTTP Request').body.url.isUrl() }}

// URL 编解码
{{ $('HTTP Request').body.query.urlEncode() }}
{{ $('HTTP Request').body.encodedQuery.urlDecode() }}
```

### 2. 数据验证

```javascript
// 验证邮箱
{{ $('HTTP Request').body.email.isEmail() }}

// 验证域名
{{ $('HTTP Request').body.domain.isDomain() }}

// 验证数字
{{ $('Chat Trigger').message.isNumeric() }}

// 检查是否为空
{{ $('Chat Trigger').message.isEmpty() }}
```

### 3. 数据提取

```javascript
// 提取邮箱
{{ $('Chat Trigger').message.extractEmail() }}

// 提取 URL
{{ $('Chat Trigger').message.extractUrl() }}

// 提取域名
{{ $('Chat Trigger').message.extractDomain() }}
```

### 4. 编码解码

```javascript
// Base64 编码
{{ $('HTTP Request').body.data.base64Encode() }}

// Base64 解码
{{ $('HTTP Request').body.encodedData.base64Decode() }}

// JSON 解析
{{ $('HTTP Request').body.jsonString.parseJson() }}
```

### 5. 格式化

```javascript
// 句首大写
{{ $('Chat Trigger').message.toSentenceCase() }}

// 转换为蛇形命名
{{ $('HTTP Request').body.fieldName.toSnakeCase() }}

// 移除标签
{{ $('HTTP Request').body.html.removeTags() }}

// 移除 Markdown
{{ $('HTTP Request').body.markdown.removeMarkdown() }}
```

### 6. 类型转换

```javascript
// 转换为数字
{{ $('Chat Trigger').message.toInt() }}
{{ $('Chat Trigger').message.toFloat() }}

// 转换为布尔值
{{ $('HTTP Request').body.flag.toBoolean() }}
```

### 7. 哈希和加密

```javascript
// MD5 哈希
{{ $('Chat Trigger').message.hash() }}

// SHA-256 哈希
{{ $('Chat Trigger').message.hash("sha256") }}
```

## 链式调用

字符串方法可以链式调用：

```javascript
// 提取、格式化、转换
{{ $('Chat Trigger').message
  .trim()
  .toLowerCase()
  .toSentenceCase() }}

// 清理 HTML 并提取内容
{{ $('HTTP Request').body.html
  .removeTags()
  .trim() }}

// URL 处理链
{{ $('HTTP Request').body.url
  .extractDomain()
  .toLowerCase() }}
```

## 最佳实践

### 1. 验证后再处理

```javascript
// 验证邮箱格式后再使用
{{ $('HTTP Request').body.email.isEmail()
  ? $('HTTP Request').body.email.toLowerCase()
  : 'invalid@example.com' }}
```

### 2. 处理可能为空的字符串

```javascript
// 检查是否为空
{{ $('Chat Trigger').message.isNotEmpty()
  ? $('Chat Trigger').message
  : '未提供消息' }}
```

### 3. 组合多个方法

```javascript
// 清理和格式化用户输入
{{ $('Chat Trigger').message
  .trim()
  .removeTags()
  .toSentenceCase() }}
```

### 4. 安全地解析 JSON

```javascript
// 在代码节点中安全解析
try {
  const data = $('HTTP Request').body.jsonString.parseJson();
  return data;
} catch (e) {
  return { error: 'Invalid JSON' };
}
```

## 相关资源

- [表达式概述](/zh-hans/guide/expressions)
- [数组方法](/zh-hans/guide/expressions/arrays)
- [对象方法](/zh-hans/guide/expressions/objects)
- [代码节点](/zh-hans/guide/workflow/nodes/action-nodes/code)
