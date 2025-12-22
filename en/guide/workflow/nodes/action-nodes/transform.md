---
title: Transform Node
description: Transform and process data between workflow steps using expressions
---

# Transform Node

The Transform node is used to transform and process data between workflow steps using expressions. It provides a concise way to perform data transformation operations without writing complete code.

## Use Cases

### Typical Applications
- **Data Format Conversion** - Convert data from one format to another
- **Field Mapping** - Rename, reorganize, or extract data fields
- **Data Filtering** - Filter arrays or objects using expressions
- **Calculated Fields** - Calculate new fields based on existing data
- **Data Merging** - Merge multiple data sources
- **Type Conversion** - Convert between strings, numbers, booleans, etc.
- **Data Cleaning** - Clean and normalize data

## Node Configuration

### Basic Settings (Parameters Panel)

#### Expression (expression)

Expression used to transform data.

**Field Properties**:
- Required field
- Supports expression syntax
- Supports multi-line expressions
- Can use all features of workflow expression engine

**Configuration Examples**:

```javascript
// 1. Simple field extraction
$('HTTP Request').body.userId

// 2. Field renaming and reorganization
{
  id: $('HTTP Request').body.userId,
  name: $('HTTP Request').body.userName,
  email: $('HTTP Request').body.userEmail
}

// 3. Data transformation and calculation
{
  originalPrice: $('HTTP Request').body.price,
  discount: 0.1,
  finalPrice: $('HTTP Request').body.price * 0.9,
  currency: "USD"
}

// 4. Array processing
$('HTTP Request').body.items.map(item => ({
  id: item.id,
  name: item.name,
  price: item.price * 0.9  // Apply discount
}))

// 5. Conditional transformation
$('HTTP Request').body.status === "active"
  ? { status: "Enabled", enabled: true }
  : { status: "Disabled", enabled: false }

// 6. Multi-line expression (returning object)
{
  userId: $('Chat Trigger').userId,
  message: $('Chat Trigger').message,
  timestamp: new Date().toISOString(),
  processedMessage: $('Chat Trigger').message.toUpperCase()
}

// 7. String formatting
`Order ID: ${$('HTTP Request').body.orderId}
Amount: $${$('HTTP Request').body.amount}
Status: ${$('HTTP Request').body.status}`

// 8. Array filtering and transformation
$('HTTP Request').body.products
  .filter(p => p.inStock === true)
  .map(p => ({
    name: p.name,
    price: p.price,
    category: p.category
  }))
```

**Expression Methods**:

The Transform node supports all expression methods, including:

- **Array methods**: `map()`, `filter()`, `find()`, `reduce()`, `slice()`, `sort()`, etc.
- **String methods**: `toUpperCase()`, `toLowerCase()`, `replace()`, `split()`, `trim()`, etc.
- **Number methods**: `toFixed()`, `round()`, `floor()`, `ceil()`, etc.
- **Object methods**: `keys()`, `values()`, `entries()`, etc.

### Advanced Settings (Settings Panel)

#### Always Output (alwaysOutput)

Whether to output an empty item when output is empty.

**Default**: `false`

**Purpose**: Prevents workflow from terminating at this node, ensuring subsequent nodes can execute.

#### Execute Once (executeOnce)

Whether to execute only once using data from the first item received.

**Default**: `false`

**Purpose**:
- When upstream node returns multiple items, defaults to executing transformation for each item
- After enabling this option, only executes for first item, improving performance

#### Retry on Fail (retryOnFail)

Whether to automatically retry on transformation failure.

**Default**: `false`

#### Max Tries (maxTries)

Maximum retries after failure.

**Default**: `3`

#### Wait Between Tries (waitBetweenTries)

Wait time between retries (milliseconds).

**Default**: `1000` (1 second)

#### Error Handling (onError)

How to handle transformation failures.

**Available Values**:
- `stopWorkflow` - Stop entire workflow (default)
- `continueRegularOutput` - Continue execution
- `continueErrorOutput` - Continue execution, use error output

#### Node Description (nodeDescription)

Add custom description for the node.

```yaml
nodeDescription: "Transform order data to standard format"
```

## Output Data

The Transform node returns the result of expression evaluation. The returned data type depends on the expression's calculation result.

**Output Examples**:

```javascript
// Simple value
"user123"

// Object
{
  id: "user123",
  name: "John",
  email: "john@example.com"
}

// Array
[
  { id: 1, name: "Product A" },
  { id: 2, name: "Product B" }
]

// String
"Order ID: ORD-12345, Amount: $299.00"
```

**Access Output**:

```javascript
// Get entire output
$('Transform').output

// Get object fields
$('Transform').id
$('Transform').name

// Get array elements
$('Transform')[0]
$('Transform')[0].name

// Get string
$('Transform')
```

## Workflow Examples

### Example 1: Field Renaming and Reorganization

```
HTTP Request
  → Transform Node
    Expression: {
      orderId: $('HTTP Request').body.order_id,
      customerName: $('HTTP Request').body.customer_name,
      totalAmount: $('HTTP Request').body.total_amount,
      status: $('HTTP Request').body.order_status
    }
  → Database Node
    Insert transformed data into database
```

### Example 2: Price Calculation and Formatting

```
HTTP Request
  → Transform Node
    Expression: {
      originalPrice: $('HTTP Request').body.price,
      discountRate: 0.15,
      discountAmount: $('HTTP Request').body.price * 0.15,
      finalPrice: $('HTTP Request').body.price * 0.85,
      formattedPrice: `$${($('HTTP Request').body.price * 0.85).toFixed(2)}`
    }
  → Send Email Node
    Use formatted price information
```

### Example 3: Array Filtering and Transformation

```
HTTP Request
  → Transform Node
    Expression: $('HTTP Request').body.products
      .filter(p => p.stock > 0 && p.price <= 1000)
      .map(p => ({
        id: p.product_id,
        name: p.product_name,
        price: p.price,
        discountPrice: p.price * 0.9
      }))
  → Batch Operation Node
    Process filtered product list
```

### Example 4: Data Merging

```
HTTP Request A
  ↓
HTTP Request B ─→ Transform Node
                   Expression: {
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
                  → Send Notification Node
```

### Example 5: Conditional Transformation

```
AI Classifier
  → Transform Node
    Expression: $('AI Classifier').class === "urgent"
      ? {
          priority: "high",
          subject: `[Urgent] ${$('Chat Trigger').message}`,
          channel: "email"
        }
      : {
          priority: "normal",
          subject: $('Chat Trigger').message,
          channel: "chat"
        }
  → Conditional Branch
    Route to different processes based on priority
```

## Best Practices

### 1. Keep Expressions Concise

**Good Practice**:
```javascript
// Clear and concise
{
  id: $('HTTP Request').body.userId,
  name: $('HTTP Request').body.userName
}
```

**Avoid**:
```javascript
// Too complex, should use Code node
$('HTTP Request').body.items
  .filter(i => i.price > 100)
  .map(i => ({...i, discount: i.price * 0.1}))
  .sort((a, b) => b.discount - a.discount)
  .slice(0, 10)
  .reduce((acc, cur) => ({...acc, [cur.id]: cur}), {})
```

### 2. Handle Null Values and Errors

```javascript
// Use default values
{
  name: $('HTTP Request').body.name || "Unknown",
  email: $('HTTP Request').body.email || "",
  age: $('HTTP Request').body.age || 0
}

// Use optional chaining
$('HTTP Request').body?.user?.name || "Unknown"
```

### 3. Maintain Data Consistency

```javascript
// Unified field naming style
{
  userId: $('HTTP Request').body.user_id,  // Unified to camelCase
  userName: $('HTTP Request').body.user_name,
  userEmail: $('HTTP Request').body.user_email
}
```

## FAQ

### Q1: What's the difference between Transform node and Code node?

**A**:

| Feature | Transform Node | Code Node |
|---------|---------------|-----------|
| Syntax | Expression syntax | Python/JavaScript code |
| Complexity | Suitable for simple transformations | Suitable for complex logic |
| Performance | Faster | Slightly slower (needs code execution) |
| Debugging | Expression evaluation | Code execution |
| Use Case | Field mapping, simple calculations | Complex algorithms, business logic |

**Selection Advice**:
- **Simple transformations** (field renaming, simple calculations) → Use Transform node
- **Complex logic** (loops, conditionals, complex algorithms) → Use Code node

### Q2: How to handle array data?

**A**: Use array methods:

```javascript
// Filter
$('HTTP Request').body.items.filter(item => item.stock > 0)

// Map transformation
$('HTTP Request').body.items.map(item => ({
  id: item.id,
  name: item.name,
  price: item.price * 0.9
}))

// Find
$('HTTP Request').body.items.find(item => item.id === "123")

// Slice
$('HTTP Request').body.items.slice(0, 10)
```

### Q3: How to merge multiple data sources?

**A**: Reference multiple nodes in expression:

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

## Next Steps

- [Code Node](/en/guide/workflow/nodes/action-nodes/code) - Learn about more complex data processing
- [Expression Syntax](/en/guide/expressions/) - Learn full expression capabilities
- [IF Node](/en/guide/workflow/nodes/action-nodes/if) - Conditional branching based on transformation results

## Related Resources

- [HTTP Request Node](/en/guide/workflow/nodes/action-nodes/http-request) - Get data to transform
- [Database Node](/en/guide/workflow/nodes/action-nodes/database) - Use transformed data

