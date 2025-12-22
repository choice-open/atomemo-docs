---
title: String Methods
description: String data transformation methods reference
---

# String Methods

String methods are used to process and transform string data.

## Method Reference

### base64Encode()

Encodes a string to Base64.

**Returns**: `String` (Base64 encoded string)

**Examples**:

```javascript
{{ "hello world".base64Encode() }}
// "aGVsbG8gd29ybGQ="

{{ $('Chat Trigger').message.base64Encode() }}
// Encode message to Base64
```

---

### base64Decode()

Converts a Base64 encoded string to a plain string.

**Returns**: `String` (Decoded plain string)

**Examples**:

```javascript
{{ "aGVsbG8gd29ybGQ=".base64Decode() }}
// "hello world"

{{ $('HTTP Request').body.encodedData.base64Decode() }}
// Decode Base64 data
```

---

### extractDomain()

Extracts the domain from a string containing a valid URL. Returns `undefined` if no domain is found.

**Returns**: `String | undefined`

**Examples**:

```javascript
{{ "https://www.example.com/path".extractDomain() }}
// "www.example.com"

{{ "Visit https://github.com for more info".extractDomain() }}
// "github.com"

{{ $('HTTP Request').body.url.extractDomain() }}
// Extract domain from URL
```

---

### extractEmail()

Extracts an email address from a string. Returns `undefined` if none found. Returns the first email if multiple exist.

**Returns**: `String | undefined`

**Examples**:

```javascript
{{ "Contact us at info@example.com".extractEmail() }}
// "info@example.com"

{{ "Email: john@test.com or support@test.com".extractEmail() }}
// "john@test.com" (returns first)

{{ $('Chat Trigger').message.extractEmail() }}
// Extract email from message
```

---

### extractUrl()

Extracts a URL from a string. Returns `undefined` if none found. Returns the first URL if multiple exist. Limited to http(s) protocol.

**Returns**: `String | undefined`

**Examples**:

```javascript
{{ "Visit https://example.com for more".extractUrl() }}
// "https://example.com"

{{ "Check http://test.com and https://demo.com".extractUrl() }}
// "http://test.com" (returns first)

{{ $('Chat Trigger').message.extractUrl() }}
// Extract URL from message
```

---

### extractUrlPath()

Extracts the path from a URL, excluding the root domain.

**Returns**: `String`

**Examples**:

```javascript
{{ "https://example.com/orders/1/details".extractUrlPath() }}
// "/orders/1/details"

{{ "https://api.example.com/v1/users".extractUrlPath() }}
// "/v1/users"

{{ $('HTTP Request').body.url.extractUrlPath() }}
// Extract URL path
```

---

### hash(algo?: Algorithm)

Returns the hash of a string using the specified algorithm.

**Parameters**:
- `algo` (Algorithm, optional): Hash algorithm to use. Values: `md5` (default), `base64`, `sha1`, `sha224`, `sha256`, `sha384`, `sha512`, `sha3`, `ripemd160`

**Returns**: `String`

**Examples**:

```javascript
{{ "hello world".hash() }}
// Default uses md5
// "5eb63bbbe01eeed093cb22bb8f5acdc3"

{{ "hello world".hash("md5") }}
// "5eb63bbbe01eeed093cb22bb8f5acdc3"

{{ "hello world".hash("sha256") }}
// "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9"

{{ $('Chat Trigger').message.hash("sha256") }}
// Generate SHA-256 hash of message
```

---

### isDomain()

Checks if a string is a domain.

**Returns**: `Boolean`

**Examples**:

```javascript
{{ "example.com".isDomain() }}
// true

{{ "www.example.com".isDomain() }}
// true

{{ "not-a-domain".isDomain() }}
// false

{{ "https://example.com".isDomain() }}
// false (contains protocol, not a pure domain)

{{ $('HTTP Request').body.domain.isDomain() }}
// Validate if it's a valid domain
```

---

### isEmail()

Checks if a string is an email address.

**Returns**: `Boolean`

**Examples**:

```javascript
{{ "user@example.com".isEmail() }}
// true

{{ "invalid-email".isEmail() }}
// false

{{ $('HTTP Request').body.email.isEmail() }}
// Validate email format
```

---

### isEmpty()

Checks if a string is empty.

**Returns**: `Boolean`

**Examples**:

```javascript
{{ "".isEmpty() }}
// true

{{ "hello".isEmpty() }}
// false

{{ $('Chat Trigger').message.isEmpty() }}
// Check if message is empty
```

---

### isNotEmpty()

Checks if a string is not empty.

**Returns**: `Boolean`

**Examples**:

```javascript
{{ "hello".isNotEmpty() }}
// true

{{ "".isNotEmpty() }}
// false

{{ $('Chat Trigger').message.isNotEmpty() }}
// Check if message is not empty
```

---

### isNumeric()

Checks if a string contains only numbers (including floats and scientific notation).

**Returns**: `Boolean`

**Examples**:

```javascript
{{ "123".isNumeric() }}
// true

{{ "3.14".isNumeric() }}
// true

{{ "1.2e-3".isNumeric() }}
// true (scientific notation)

{{ "abc".isNumeric() }}
// false

{{ $('Chat Trigger').message.isNumeric() }}
// Check if input is numeric
```

---

### isUrl()

Checks if a string is a valid URL (valid format).

**Returns**: `Boolean`

**Examples**:

```javascript
{{ "https://example.com".isUrl() }}
// true

{{ "http://test.com/path".isUrl() }}
// true

{{ "not-a-url".isUrl() }}
// false

{{ $('HTTP Request').body.url.isUrl() }}
// Validate URL format
```

---

### parseJson()

Equivalent to `JSON.parse()`. Parses a string as a JSON object.

**Returns**: `Object | Array`

**Examples**:

```javascript
{{ '{"name":"Alice","age":25}'.parseJson() }}
// { name: "Alice", age: 25 }

{{ '[1,2,3]'.parseJson() }}
// [1, 2, 3]

{{ $('HTTP Request').body.jsonString.parseJson() }}
// Parse JSON string
```

---

### quote(mark?: String)

Returns a string wrapped in quotes. Default quote is `"`. Automatically handles escaping.

**Parameters**:
- `mark` (String, optional): Quote character. Default: `"`

**Returns**: `String`

**Examples**:

```javascript
{{ "hello".quote() }}
// "\"hello\""

{{ "hello".quote("'") }}
// "'hello'"

{{ 'say "hello"'.quote() }}
// "\"say \\\"hello\\\"\""

{{ $('Chat Trigger').message.quote() }}
// Add quotes to message
```

---

### removeMarkdown()

Removes Markdown formatting from a string.

**Returns**: `String`

**Examples**:

```javascript
{{ "# Hello\n**bold** text".removeMarkdown() }}
// "Hello\nbold text"

{{ $('HTTP Request').body.markdown.removeMarkdown() }}
// Remove Markdown formatting
```

---

### removeTags()

Removes tags from a string, such as HTML or XML tags.

**Returns**: `String`

**Examples**:

```javascript
{{ "<p>Hello <strong>World</strong></p>".removeTags() }}
// "Hello World"

{{ "<div>Test</div>".removeTags() }}
// "Test"

{{ $('HTTP Request').body.html.removeTags() }}
// Remove HTML tags
```

---

### toBoolean()

Converts a string to a boolean. `"false"`, `"0"`, `""`, and `"no"` convert to `false`.

**Returns**: `Boolean`

**Examples**:

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
// Convert string flag to boolean
```

---

### toDecimalNumber()

Converts a string to a decimal number.

**Returns**: `Number`

**Examples**:

```javascript
{{ "3.14".toDecimalNumber() }}
// 3.14

{{ "42".toDecimalNumber() }}
// 42

{{ $('Chat Trigger').message.toDecimalNumber() }}
// Convert input to decimal number
```

---

### toFloat()

Converts a string to a floating-point number.

**Returns**: `Number`

**Examples**:

```javascript
{{ "3.14".toFloat() }}
// 3.14

{{ "42".toFloat() }}
// 42.0

{{ $('HTTP Request').body.price.toFloat() }}
// Convert price string to float
```

---

### toInt()

Converts a string to an integer.

**Returns**: `Number`

**Examples**:

```javascript
{{ "42".toInt() }}
// 42

{{ "3.14".toInt() }}
// 3

{{ "1.2e3".toInt() }}
// 1200

{{ $('Chat Trigger').message.toInt() }}
// Convert input to integer
```

---

### toSentenceCase()

Formats a string to sentence case. Only capitalizes the first letter, rest lowercase.

**Returns**: `String`

**Examples**:

```javascript
{{ "hello world".toSentenceCase() }}
// "Hello world"

{{ "HELLO WORLD".toSentenceCase() }}
// "Hello world"

{{ $('Chat Trigger').message.toSentenceCase() }}
// Convert message to sentence case
```

---

### toSnakeCase()

Formats a string to snake_case. Only supports ASCII characters.

**Returns**: `String`

**Examples**:

```javascript
{{ "helloWorld".toSnakeCase() }}
// "hello_world"

{{ "HelloWorld".toSnakeCase() }}
// "hello_world"

{{ "hello-world".toSnakeCase() }}
// "hello_world"

{{ $('HTTP Request').body.fieldName.toSnakeCase() }}
// Convert field name to snake_case
```

---

### toKebabCase()

Formats a string to kebab-case. Spaces and underscores are replaced by hyphens, symbols are removed, all letters are lowercased, and consecutive dashes are collapsed.

**Returns**: `String`

**Examples**:

```javascript
{{ "Hello_world Test".toKebabCase() }}
// "hello-world-test"

{{ "helloWorld".toKebabCase() }}
// "helloworld"

{{ "hello-world".toKebabCase() }}
// "hello-world"

{{ "quick brown $FOX".toKebabCase() }}
// "quick-brown-fox"

{{ $('HTTP Request').body.fieldName.toKebabCase() }}
// Convert field name to kebab-case
```

---

### toCamelCase()

Formats a string to camelCase. The first word is lowercased, and subsequent words have their first letter capitalized. Spaces, underscores, and hyphens are removed, and symbols are stripped.

**Returns**: `String`

**Examples**:

```javascript
{{ "hello_world".toCamelCase() }}
// "helloWorld"

{{ "hello world test".toCamelCase() }}
// "helloWorldTest"

{{ "HelloWorld".toCamelCase() }}
// "helloWorld"

{{ $('HTTP Request').body.fieldName.toCamelCase() }}
// Convert field name to camelCase
```

---

### toPascalCase()

Formats a string to PascalCase. The first letter of each word is capitalized, and all other letters are lowercased. Spaces, underscores, and hyphens are removed, and symbols are stripped.

**Returns**: `String`

**Examples**:

```javascript
{{ "hello_world test".toPascalCase() }}
// "HelloWorldTest"

{{ "hello world".toPascalCase() }}
// "HelloWorld"

{{ "helloWorld".toPascalCase() }}
// "HelloWorld"

{{ $('HTTP Request').body.fieldName.toPascalCase() }}
// Convert field name to PascalCase
```

---

### toWholeNumber()

Converts a string to an integer (whole number). For floats, truncates decimal part.

**Returns**: `Number`

**Examples**:

```javascript
{{ "42".toWholeNumber() }}
// 42

{{ "3.9".toWholeNumber() }}
// 3 (truncates decimal)

{{ "-3.9".toWholeNumber() }}
// -3

{{ $('HTTP Request').body.count.toWholeNumber() }}
// Convert to integer
```

---

### urlDecode(entireString?: Boolean)

Decodes a URL-encoded string.

**Parameters**:
- `entireString` (Boolean, optional): Whether to decode entire string

**Returns**: `String`

**Examples**:

```javascript
{{ "hello%20world".urlDecode() }}
// "hello world"

{{ "name%3DAlice%26age%3D25".urlDecode() }}
// "name=Alice&age=25"

{{ $('HTTP Request').body.encodedParam.urlDecode() }}
// Decode URL parameter
```

---

### urlEncode(entireString?: Boolean)

Encodes a string for use in URLs.

**Parameters**:
- `entireString` (Boolean, optional): Whether to encode entire string

**Returns**: `String`

**Examples**:

```javascript
{{ "hello world".urlEncode() }}
// "hello%20world"

{{ "name=Alice&age=25".urlEncode() }}
// "name%3DAlice%26age%3D25"

{{ $('Chat Trigger').message.urlEncode() }}
// Encode message for URL
```

## Standard String Methods

In addition to custom methods, you can use standard JavaScript string methods:

```javascript
// Case conversion
{{ "hello".toUpperCase() }}        // "HELLO"
{{ "HELLO".toLowerCase() }}        // "hello"

// Trim whitespace
{{ "  hello  ".trim() }}           // "hello"
{{ "hello  ".trimEnd() }}          // "hello"
{{ "  hello".trimStart() }}        // "hello"

// String search
{{ "hello world".includes("world") }}    // true
{{ "hello world".startsWith("hello") }}  // true
{{ "hello world".endsWith("world") }}    // true
{{ "hello world".indexOf("world") }}     // 6

// String replacement
{{ "hello world".replace("world", "there") }}  // "hello there"
{{ "aaa".replaceAll("a", "b") }}               // "bbb"

// String split and join
{{ "a,b,c".split(",") }}           // ["a", "b", "c"]
{{ ["a", "b", "c"].join("-") }}    // "a-b-c"

// String extraction
{{ "hello".substring(0, 2) }}      // "he"
{{ "hello".slice(1, 4) }}          // "ell"

// Repeat
{{ "ha".repeat(3) }}               // "hahaha"

// Length
{{ "hello".length }}               // 5
```

## Use Cases

### 1. URL Processing

```javascript
// Extract domain
{{ $('HTTP Request').body.url.extractDomain() }}

// Extract path
{{ $('HTTP Request').body.url.extractUrlPath() }}

// Validate URL
{{ $('HTTP Request').body.url.isUrl() }}

// URL encode/decode
{{ $('HTTP Request').body.query.urlEncode() }}
{{ $('HTTP Request').body.encodedQuery.urlDecode() }}
```

### 2. Data Validation

```javascript
// Validate email
{{ $('HTTP Request').body.email.isEmail() }}

// Validate domain
{{ $('HTTP Request').body.domain.isDomain() }}

// Validate number
{{ $('Chat Trigger').message.isNumeric() }}

// Check if empty
{{ $('Chat Trigger').message.isEmpty() }}
```

### 3. Data Extraction

```javascript
// Extract email
{{ $('Chat Trigger').message.extractEmail() }}

// Extract URL
{{ $('Chat Trigger').message.extractUrl() }}

// Extract domain
{{ $('Chat Trigger').message.extractDomain() }}
```

### 4. Encoding/Decoding

```javascript
// Base64 encode
{{ $('HTTP Request').body.data.base64Encode() }}

// Base64 decode
{{ $('HTTP Request').body.encodedData.base64Decode() }}

// JSON parse
{{ $('HTTP Request').body.jsonString.parseJson() }}
```

### 5. Formatting

```javascript
// Sentence case
{{ $('Chat Trigger').message.toSentenceCase() }}

// Snake case
{{ $('HTTP Request').body.fieldName.toSnakeCase() }}

// Kebab case
{{ $('HTTP Request').body.fieldName.toKebabCase() }}

// Camel case
{{ $('HTTP Request').body.fieldName.toCamelCase() }}

// Pascal case
{{ $('HTTP Request').body.fieldName.toPascalCase() }}

// Remove tags
{{ $('HTTP Request').body.html.removeTags() }}

// Remove Markdown
{{ $('HTTP Request').body.markdown.removeMarkdown() }}
```

### 6. Type Conversion

```javascript
// Convert to number
{{ $('Chat Trigger').message.toInt() }}
{{ $('Chat Trigger').message.toFloat() }}

// Convert to boolean
{{ $('HTTP Request').body.flag.toBoolean() }}
```

### 7. Hashing

```javascript
// MD5 hash
{{ $('Chat Trigger').message.hash() }}

// SHA-256 hash
{{ $('Chat Trigger').message.hash("sha256") }}
```

## Method Chaining

String methods can be chained:

```javascript
// Extract, format, convert
{{ $('Chat Trigger').message
  .trim()
  .toLowerCase()
  .toSentenceCase() }}

// Clean HTML and extract content
{{ $('HTTP Request').body.html
  .removeTags()
  .trim() }}

// URL processing chain
{{ $('HTTP Request').body.url
  .extractDomain()
  .toLowerCase() }}
```

## Best Practices

### 1. Validate Before Processing

```javascript
// Validate email format before using
{{ $('HTTP Request').body.email.isEmail()
  ? $('HTTP Request').body.email.toLowerCase()
  : 'invalid@example.com' }}
```

### 2. Handle Potentially Empty Strings

```javascript
// Check if empty
{{ $('Chat Trigger').message.isNotEmpty()
  ? $('Chat Trigger').message
  : 'No message provided' }}
```

### 3. Combine Multiple Methods

```javascript
// Clean and format user input
{{ $('Chat Trigger').message
  .trim()
  .removeTags()
  .toSentenceCase() }}
```

### 4. Safely Parse JSON

```javascript
// Safely parse in Code node
try {
  const data = $('HTTP Request').body.jsonString.parseJson();
  return data;
} catch (e) {
  return { error: 'Invalid JSON' };
}
```

## Related Resources

- [Expressions Overview](/en/guide/expressions)
- [Array Methods](/en/guide/expressions/arrays)
- [Object Methods](/en/guide/expressions/objects)
- [Code Node](/en/guide/workflow/nodes/action-nodes/code)
