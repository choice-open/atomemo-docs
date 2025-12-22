---
title: Object Methods
description: Object data transformation methods reference
---

# Object Methods

Object methods are used to process and transform object data.

## Method Reference

### isEmpty()

Checks if an object has no key-value pairs.

**Returns**: `Boolean`

**Examples**:

```javascript
{{ {}.isEmpty() }}
// true

{{ { name: 'Alice' }.isEmpty() }}
// false

{{ $('HTTP Request').body.config.isEmpty() }}
// Check if config object is empty
```

---

### merge(object: Object)

Merges two objects into one, using the first object as the base. If the same keys exist in both objects, the base object's keys take priority.

**Parameters**:
- `object` (Object): Object to merge

**Returns**: `Object`

**Examples**:

```javascript
// Base object takes priority
{{ { a: 1, b: 2 }.merge({ b: 3, c: 4 }) }}
// { "a": 1, "b": 2, "c": 4 }

{{ { name: 'Alice', age: 25 }.merge({ age: 30, city: 'Beijing' }) }}
// { "name": "Alice", "age": 25, "city": "Beijing" }

{{ $('HTTP Request').body.user.merge($('Default Config').defaults) }}
// Merge default config into user data
```

---

### hasField(fieldName: String)

Checks if an object contains a specified field. Only supports top-level keys.

**Parameters**:
- `fieldName` (String): Field name to check

**Returns**: `Boolean`

**Examples**:

```javascript
{{ { name: 'Alice', age: 25 }.hasField('name') }}
// true

{{ { name: 'Alice', age: 25 }.hasField('email') }}
// false

{{ $('HTTP Request').body.user.hasField('email') }}
// Check if user object contains email field
```

---

### removeField(key: String)

Removes a specified field from an object.

**Parameters**:
- `key` (String): Field name to remove

**Returns**: `Object`

**Examples**:

```javascript
{{ { name: 'Alice', age: 25, password: '123456' }.removeField('password') }}
// { "name": "Alice", "age": 25 }

{{ $('HTTP Request').body.user.removeField('internalId') }}
// Remove internal ID field
```

---

### removeFieldsContaining(value: String)

Removes all fields whose values contain the specified string.

**Parameters**:
- `value` (String): String to match in field values

**Returns**: `Object`

**Examples**:

```javascript
{{ { a: "apple", b: "banana", c: "cherry" }.removeFieldsContaining("a") }}
// { "c": "cherry" }
// Removes fields with values containing "a"

{{ { a: "test", b: "production", c: "test_mode" }.removeFieldsContaining("test") }}
// { "b": "production" }

// Using empty string
{{ { a: "apple", b: "banana" }.removeFieldsContaining("") }}
// {}
// All strings contain empty string, so all removed

{{ $('HTTP Request').body.data.removeFieldsContaining("temp") }}
// Remove all temporary fields containing "temp"
```

---

### keepFieldsContaining(value: String)

Removes fields that don't match the given value (keeps fields containing the specified string).

**Parameters**:
- `value` (String): String to match in field values

**Returns**: `Object`

**Examples**:

```javascript
{{ { a: "apple", b: "banana", c: "cherry" }.keepFieldsContaining("a") }}
// { "a": "apple", "b": "banana" }
// Keeps fields with values containing "a"

{{ { a: "apple", b: "banana", c: "cherry" }.keepFieldsContaining("x") }}
// {}
// No field values contain "x"

{{ { a: "apple", b: "banana" }.keepFieldsContaining("") }}
// { "a": "apple", "b": "banana" }
// All strings contain empty string, so all kept

{{ $('HTTP Request').body.data.keepFieldsContaining("prod") }}
// Keep only production-related fields
```

---

### compact()

Removes null values from an object (only removes `null` and `undefined`).

**Returns**: `Object`

**Examples**:

```javascript
{{ { a: 1, b: null, c: undefined, d: "hello" }.compact() }}
// { "a": 1, "d": "hello" }

{{ { a: 0, b: "", c: [], d: {} }.compact() }}
// { "a": 0, "b": "", "c": [], "d": {} }
// Note: 0, empty string, empty array, empty object are not removed

{{ { a: false, b: null, c: undefined }.compact() }}
// { "a": false }

{{ $('HTTP Request').body.user.compact() }}
// Remove null and undefined values from user object
```

---

### toJsonString()

Converts an object to a JSON string. Equivalent to `JSON.stringify`.

**Returns**: `String`

**Examples**:

```javascript
{{ { name: 'Alice', age: 25 }.toJsonString() }}
// '{"name":"Alice","age":25}'

{{ $('HTTP Request').body.user.toJsonString() }}
// Convert user object to JSON string
```

---

### urlEncode()

Converts an object to URL parameters. Only supports top-level keys.

**Returns**: `String`

**Examples**:

```javascript
{{ { name: 'Alice', age: 25 }.urlEncode() }}
// "name=Alice&age=25"

{{ { q: 'hello world', page: 1 }.urlEncode() }}
// "q=hello%20world&page=1"

{{ $('HTTP Request').body.params.urlEncode() }}
// Convert params object to URL query string
```

## Use Cases

### 1. Object Merging

```javascript
// Merge user input with default config
{{ $('User Input').config.merge({
  timeout: 30000,
  retries: 3,
  debug: false
}) }}

// Merge multiple data sources
{{ $('Source A').data.merge($('Source B').data) }}
```

### 2. Field Filtering

```javascript
// Remove sensitive fields
{{ $('HTTP Request').body.user
  .removeField('password')
  .removeField('token') }}

// Keep only specific fields
{{ $('HTTP Request').body.data.keepFieldsContaining("public") }}

// Remove test fields
{{ $('HTTP Request').body.data.removeFieldsContaining("test") }}
```

### 3. Data Cleaning

```javascript
// Remove null values
{{ $('HTTP Request').body.formData.compact() }}

// Remove unwanted fields
{{ $('HTTP Request').body.user
  .removeField('_id')
  .removeField('__v')
  .compact() }}
```

### 4. Data Conversion

```javascript
// Convert to JSON string for storage
{{ $('HTTP Request').body.config.toJsonString() }}

// Convert to URL parameters
{{ $('HTTP Request').body.filters.urlEncode() }}
```

### 5. Field Validation

```javascript
// Check required fields
{{ $('HTTP Request').body.user.hasField('email')
  && $('HTTP Request').body.user.hasField('name') }}

// Check if object is empty
{{ $('HTTP Request').body.result.isEmpty() }}
```

## Method Chaining

Object methods can be chained:

```javascript
// Clean and merge objects
{{ $('HTTP Request').body.user
  .compact()
  .removeField('password')
  .merge({ updatedAt: $now() }) }}

// Filter and convert
{{ $('HTTP Request').body.config
  .keepFieldsContaining("prod")
  .compact()
  .toJsonString() }}
```

## Nested Object Handling

Object methods primarily handle top-level keys. For nested objects, use Code nodes:

```javascript
// Handle nested objects in Code node
const user = $('HTTP Request').body.user;

// Process nested fields
if (user.profile && user.profile.settings) {
  delete user.profile.settings.internalFlag;
}

return user;
```

## Best Practices

### 1. Pay Attention to Order When Merging

```javascript
// Base object values take priority
{{ $('User Data').config.merge($('Default Config').defaults) }}
// User Data values override Default Config values
```

### 2. Use compact to Remove Null Values

```javascript
// Clean data before sending API request
{{ $('HTTP Request').body.params.compact() }}
```

### 3. Remove Sensitive Information

```javascript
// Remove sensitive fields before logging
{{ $('HTTP Request').body.user
  .removeField('password')
  .removeField('creditCard')
  .removeField('ssn') }}
```

### 4. Check Field Existence

```javascript
// Check if field exists before accessing
{{ $('HTTP Request').body.user.hasField('email')
  ? $('HTTP Request').body.user.email
  : 'no-email@example.com' }}
```

### 5. Use urlEncode to Build Query Strings

```javascript
// Build API query parameters
{{ `https://api.example.com/search?${$('HTTP Request').body.filters.urlEncode()}` }}
```

## Combine with Other Methods

```javascript
// Get array of object keys
{{ Object.keys($('HTTP Request').body.user) }}

// Get array of object values
{{ Object.values($('HTTP Request').body.prices) }}

// Use object methods in Code node
const data = $('HTTP Request').body.data;
const cleaned = data.compact().removeField('_internal');
return cleaned;
```

## Related Resources

- [Expressions Overview](/en/guide/expressions)
- [Array Methods](/en/guide/expressions/arrays)
- [String Methods](/en/guide/expressions/strings)
- [Code Node](/en/guide/workflow/nodes/action-nodes/code)
