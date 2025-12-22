---
title: Expressions
description: Learn how to use expressions in {{PRODUCT_NAME}} for data processing and transformation
---

# Expressions

Expressions are a powerful data processing tool in {{PRODUCT_NAME}} that allow you to dynamically access, transform, and manipulate data in your workflows.

## What are Expressions?

Expressions are a special syntax for accessing and manipulating workflow data. With expressions, you can:

- **Access node data** - Reference output data from any node
- **Transform data** - Use built-in methods to process arrays, strings, numbers, etc.
- **Dynamic calculations** - Perform mathematical operations and logical judgments
- **Combine data** - Merge multiple data sources into new outputs

## Basic Syntax

### Accessing Node Data

In {{PRODUCT_NAME}}, expressions must explicitly specify the node name:

```javascript
// Access node outputs
$('Chat Trigger').message
$('HTTP Request').body.userId
$('Entity Recognition').productName

// Use expressions in strings
`User ${$('Chat Trigger').userId} order status: ${$('HTTP Request').body.status}`
```

**Important**: Expression syntax always requires specifying the node name. Shortcuts like `$json.field` are not supported.

### Expression Contexts

Expressions can be used in:

- **Node parameters** - Any input field that supports expressions
- **Conditional logic** - Condition expressions in IF nodes
- **Code nodes** - Access data in JavaScript/Python code
- **HTTP requests** - Dynamically build URLs, headers, body

## Data Types & Methods

The {{PRODUCT_NAME}} expression engine provides rich built-in methods for different data types:

### [Arrays](/en/guide/expressions/arrays)
Methods for processing array data, including filtering, transformation, aggregation, etc.

```javascript
// Examples
$('HTTP Request').body.items.first()
$('HTTP Request').body.prices.average()
$('HTTP Request').body.users.pluck('name')
```

### [Booleans](/en/guide/expressions/booleans)
Boolean conversion and manipulation methods.

```javascript
// Example
$('HTTP Request').body.isActive.toInt()
```

### [Dates](/en/guide/expressions/dates)
Date and time processing methods, including formatting, calculations, comparisons, etc.

```javascript
// Examples
$('Chat Trigger').timestamp.format('yyyy-MM-dd')
$('HTTP Request').body.createdAt.plus(7, 'day')
```

### [Numbers](/en/guide/expressions/numbers)
Number operations and conversion methods.

```javascript
// Examples
$('HTTP Request').body.price.round(2)
$('HTTP Request').body.count.isEven()
```

### [Objects](/en/guide/expressions/objects)
Object manipulation methods, including merging, filtering, transforming, etc.

```javascript
// Examples
$('HTTP Request').body.user.hasField('email')
$('HTTP Request').body.config.merge({ newKey: 'value' })
```

### [Strings](/en/guide/expressions/strings)
String processing methods, including formatting, parsing, validation, etc.

```javascript
// Examples
$('Chat Trigger').message.toUpperCase()
$('HTTP Request').body.email.isEmail()
$('HTTP Request').body.url.extractDomain()
```

## Common Use Cases

### 1. Accessing Nested Data

```javascript
// Access deeply nested object properties
$('HTTP Request').body.user.profile.address.city

// Access array elements
$('HTTP Request').body.items[0].name
$('HTTP Request').body.items[1].price
```

### 2. Data Transformation

```javascript
// Convert string to number
$('Chat Trigger').message.toInt()

// Format date
$('HTTP Request').body.createdAt.format('yyyy-MM-dd HH:mm:ss')

// Convert object to JSON string
$('HTTP Request').body.toJsonString()
```

### 3. Conditional Logic

```javascript
// Check if value exists
$('HTTP Request').body.email.isNotEmpty()

// Check number range
$('HTTP Request').body.age > 18

// Check date range
$('HTTP Request').body.createdAt.isInLast(7, 'day')
```

### 4. Array Operations

```javascript
// Get array length
$('HTTP Request').body.items.length

// Extract specific field
$('HTTP Request').body.users.pluck('email')

// Filter array
$('HTTP Request').body.items.filter(item => item.price > 100)

// Array aggregation
$('HTTP Request').body.prices.sum()
$('HTTP Request').body.scores.average()
```

### 5. String Concatenation

```javascript
// Use template strings
`Hello, ${$('HTTP Request').body.user.name}!`

// Concatenate multiple values
`Order ${$('HTTP Request').body.orderId} status: ${$('HTTP Request').body.status}`
```

## Best Practices

### 1. Use Clear Node Names

```javascript
// Good - Clear node names
$('Get User Info').body.name
$('Query Orders').body.items

// Bad - Unclear node names
$('HTTP Request').body.name
$('HTTP Request 1').body.items
```

### 2. Handle Potentially Missing Data

```javascript
// Use optional chaining
$('HTTP Request').body?.user?.email

// Provide default values
$('HTTP Request').body.user.name || 'Anonymous'

// Check existence
$('HTTP Request').body.user.hasField('email')
```

### 3. Avoid Overly Complex Expressions

```javascript
// Good - Process in steps
// Handle complex logic in Code node, then reference results
$('Process Data').result

// Bad - Too complex
$('HTTP Request').body.items.filter(item => item.price > 100).pluck('name').join(', ')
```

### 4. Use Type Conversion

```javascript
// Ensure correct data types
$('Chat Trigger').message.toInt()
$('HTTP Request').body.isActive.toBoolean()
$('HTTP Request').body.timestamp.toDate()
```

### 5. Test Expressions

When developing workflows:
1. Use `console.log()` in Code nodes to test expressions
2. Check output data after node execution
3. Use expression editor's preview feature to verify results

## Error Handling

### Common Errors

1. **Node doesn't exist**
   ```javascript
   // Error: Referencing non-existent node
   $('Nonexistent Node').data

   // Solution: Ensure node name is correct
   $('HTTP Request').data
   ```

2. **Property doesn't exist**
   ```javascript
   // Error: Accessing non-existent property
   $('HTTP Request').body.nonexistentField

   // Solution: Use optional chaining or check
   $('HTTP Request').body?.nonexistentField
   $('HTTP Request').body.hasField('nonexistentField')
   ```

3. **Type error**
   ```javascript
   // Error: Calling number method on string
   $('Chat Trigger').message.round()

   // Solution: Convert type first
   $('Chat Trigger').message.toInt().round()
   ```

## Debugging Tips

### 1. Use Code Node for Debugging

```javascript
// Print expression results in Code node
console.log('User data:', $('HTTP Request').body.user);
console.log('Item count:', $('HTTP Request').body.items.length);
return $('HTTP Request').body;
```

### 2. Step-by-Step Validation

Break complex expressions into multiple steps, validating results at each step:

```
HTTP Request Node
  → Code Node (Validate and transform data)
  → IF Node (Conditional logic)
  → Answer Node (Return result)
```

### 3. Use Expression Editor

The expression editor provides:
- Syntax highlighting
- Auto-completion
- Live preview
- Error hints

## Performance Considerations

### 1. Avoid Repeated Calculations

```javascript
// Bad - Repeated calculations
`${$('HTTP Request').body.items.length} items, total: ${$('HTTP Request').body.items.sum()}`

// Good - Calculate once in Code node, then reference
$('Calculate Stats').summary
```

### 2. Limit Array Size

Be mindful of performance when processing large arrays:

```javascript
// For large arrays, consider filtering first
$('HTTP Request').body.items
  .filter(item => item.active)
  .slice(0, 100)
  .pluck('name')
```

## Next Steps

- [Array Methods Reference](/en/guide/expressions/arrays)
- [String Methods Reference](/en/guide/expressions/strings)
- [Date Methods Reference](/en/guide/expressions/dates)
- [Object Methods Reference](/en/guide/expressions/objects)
- [Number Methods Reference](/en/guide/expressions/numbers)
- [Boolean Methods Reference](/en/guide/expressions/booleans)

## Related Resources

- [Code Node](/en/guide/workflow/nodes/action-nodes/code) - Use expressions in code
- [IF Node](/en/guide/workflow/nodes/action-nodes/if) - Conditional expressions
- [HTTP Request Node](/en/guide/workflow/nodes/action-nodes/http-request) - Use expressions in API calls
