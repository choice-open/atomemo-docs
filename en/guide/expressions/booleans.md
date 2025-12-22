---
title: Boolean Methods
description: Boolean data transformation methods reference
---

# Boolean Methods

Boolean methods are used to convert and process boolean data.

## Method Reference

### toInt()

Converts a boolean value to a number. `false` converts to `0`, `true` converts to `1`.

**Returns**: `Number`

**Examples**:

```javascript
{{ true.toInt() }}
// 1

{{ false.toInt() }}
// 0

{{ $('HTTP Request').body.isActive.toInt() }}
// Convert boolean status to number for calculations or statistics
```

## Use Cases

### 1. Count Boolean Values

```javascript
// Count number of active users
{{ $('HTTP Request').body.users
  .map(user => user.isActive.toInt())
  .sum() }}
// Returns the count of true values
```

### 2. Conditional Calculations

```javascript
// Calculate discount based on condition
{{ $('HTTP Request').body.isPremium.toInt() * 10 }}
// Returns 10 for Premium users, 0 for regular users
```

### 3. Database Storage

```javascript
// Convert boolean to number for database storage
{{ {
  userId: $('HTTP Request').body.userId,
  isActive: $('HTTP Request').body.isActive.toInt()
} }}
// Some databases use 0/1 to represent boolean values
```

## Best Practices

### 1. Verify Data Type

```javascript
// Ensure value is boolean before converting
{{ $('HTTP Request').body.isActive === true ? 1 : 0 }}

// Or use toInt
{{ $('HTTP Request').body.isActive.toInt() }}
```

### 2. Handle null/undefined

```javascript
// Use default value to handle potentially null boolean
{{ ($('HTTP Request').body.isActive || false).toInt() }}
// null/undefined will be converted to false, then to 0
```

## Related Methods

### Convert Other Types to Boolean

While boolean methods only include `toInt()`, other types have methods to convert to boolean:

```javascript
// Number to boolean
{{ (0).toBoolean() }}        // false
{{ (1).toBoolean() }}        // true
{{ (-5).toBoolean() }}       // true

// String to boolean
{{ "false".toBoolean() }}    // false
{{ "0".toBoolean() }}        // false
{{ "".toBoolean() }}         // false
{{ "no".toBoolean() }}       // false
{{ "true".toBoolean() }}     // true
{{ "hello".toBoolean() }}    // true
```

## Related Resources

- [Expressions Overview](/en/guide/expressions)
- [Number Methods](/en/guide/expressions/numbers)
- [String Methods](/en/guide/expressions/strings)
- [Code Node](/en/guide/workflow/nodes/action-nodes/code)
