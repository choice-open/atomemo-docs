---
title: Conditional Branch Node
description: Control workflow execution path based on conditions
---

# Conditional Branch Node

The Conditional Branch node (IF node) is used to control the execution path of workflows based on condition evaluation. It allows you to decide which branch to execute based on data, state, or calculation results, implementing complex business logic and decision-making processes.

## Use Cases

### Typical Applications
- **Data Validation** - Check if data meets requirements, decide to continue processing or return error
- **State Judgment** - Perform different processing based on order status, user level, etc.
- **Error Handling** - Decide to retry or report error based on API response status code
- **Business Rules** - Implement complex business logic judgments (e.g., discount rules, permission control)
- **A/B Testing** - Execute different processing flows based on user grouping
- **Multi-way Routing** - Route to different processing nodes based on classification results
- **Threshold Judgment** - Decide alert level or processing method based on numerical value

## Node Configuration

### Basic Settings (Parameters Panel)

#### Condition (condition)

Define logical rules for condition judgment.

**Field Properties**:
- Required field
- Supports visual condition editor
- Supports nested condition groups
- Supports AND/OR logical operations

**Condition Structure**:
- **Logical Operator**: AND or OR
- **Condition Group**: Can nest multiple layers of condition groups
- **Single Condition**: Composed of left value, operator, right value

**Single Condition Components**:

```javascript
{
  leftValue: $('Node Name').field,    // Left value: data to judge
  operator: "operator",                // Operator: comparison method
  rightValue: "comparison value"       // Right value: target value for comparison
}
```

#### Convert Types When Required (convertTypesWhereRequired)

Whether to automatically convert types when left and right values have different types.

**Default**: `false`

**Usage**:
- `false` - Strict type comparison (recommended)
- `true` - Auto-convert types before comparison

**Example**:
```javascript
// convertTypesWhereRequired = false
"123" === 123  // false (different types)

// convertTypesWhereRequired = true
"123" === 123  // true (auto-converted before comparison)
```

### Operator Details

#### String Operators (String)

| Operator | Description | Requires Right Value | Example |
|----------|-------------|----------------------|---------|
| `is_equal_to` | Equals | Yes | "hello" = "hello" |
| `is_not_equal_to` | Not equals | Yes | "hello" ≠ "world" |
| `contains` | Contains | Yes | "hello world" contains "world" |
| `does_not_contain` | Does not contain | Yes | "hello" does not contain "world" |
| `starts_with` | Starts with | Yes | "hello" starts with "he" |
| `does_not_start_with` | Does not start with | Yes | "hello" does not start with "wo" |
| `ends_with` | Ends with | Yes | "hello" ends with "lo" |
| `does_not_end_with` | Does not end with | Yes | "hello" does not end with "he" |
| `matches_regex` | Matches regex | Yes | "test@email.com" matches `^[\w\.-]+@[\w\.-]+$` |
| `does_not_match_regex` | Does not match regex | Yes | "invalid" does not match email regex |
| `exists` | Field exists | No | Check if field exists |
| `does_not_exist` | Field does not exist | No | Check if field does not exist |
| `is_empty` | Is empty | No | "" or null |
| `is_not_empty` | Is not empty | No | Has value |

#### Number Operators (Number)

| Operator | Description | Requires Right Value | Example |
|----------|-------------|----------------------|---------|
| `is_equal_to` | Equals | Yes | 100 = 100 |
| `is_not_equal_to` | Not equals | Yes | 100 ≠ 200 |
| `is_greater_than` | Greater than | Yes | 100 > 50 |
| `is_greater_than_or_equal_to` | Greater than or equal | Yes | 100 ≥ 100 |
| `is_less_than` | Less than | Yes | 50 < 100 |
| `is_less_than_or_equal_to` | Less than or equal | Yes | 50 ≤ 50 |
| `exists` | Field exists | No | - |
| `does_not_exist` | Field does not exist | No | - |
| `is_empty` | Is empty | No | null or undefined |
| `is_not_empty` | Is not empty | No | Has value |

#### DateTime Operators (DateTime)

| Operator | Description | Requires Right Value | Example |
|----------|-------------|----------------------|---------|
| `is_equal_to` | Time equals | Yes | 2024-01-01 = 2024-01-01 |
| `is_not_equal_to` | Time not equals | Yes | 2024-01-01 ≠ 2024-01-02 |
| `is_after` | After | Yes | 2024-02-01 > 2024-01-01 |
| `is_after_or_equal_to` | After or equal | Yes | 2024-02-01 ≥ 2024-02-01 |
| `is_before` | Before | Yes | 2024-01-01 < 2024-02-01 |
| `is_before_or_equal_to` | Before or equal | Yes | 2024-01-01 ≤ 2024-01-01 |
| `exists` | Field exists | No | - |
| `does_not_exist` | Field does not exist | No | - |
| `is_empty` | Is empty | No | - |
| `is_not_empty` | Is not empty | No | - |

#### Boolean Operators (Boolean)

| Operator | Description | Requires Right Value | Example |
|----------|-------------|----------------------|---------|
| `is_true` | Is true | No | true |
| `is_false` | Is false | No | false |
| `is_equal_to` | Equals | Yes | true = true |
| `is_not_equal_to` | Not equals | Yes | true ≠ false |
| `exists` | Field exists | No | - |
| `does_not_exist` | Field does not exist | No | - |
| `is_empty` | Is empty | No | - |
| `is_not_empty` | Is not empty | No | - |

#### Array Operators (Array)

| Operator | Description | Requires Right Value | Example |
|----------|-------------|----------------------|---------|
| `contains` | Contains element | Yes | [1,2,3] contains 2 |
| `does_not_contain` | Does not contain element | Yes | [1,2,3] does not contain 4 |
| `length_equal_to` | Length equals | Yes | [1,2,3] length = 3 |
| `length_not_equal_to` | Length not equals | Yes | [1,2,3] length ≠ 2 |
| `length_greater_than` | Length greater than | Yes | [1,2,3] length > 2 |
| `length_greater_than_or_equal_to` | Length greater than or equal | Yes | [1,2,3] length ≥ 3 |
| `length_less_than` | Length less than | Yes | [1,2] length < 3 |
| `length_less_than_or_equal_to` | Length less than or equal | Yes | [1,2] length ≤ 2 |
| `exists` | Field exists | No | - |
| `does_not_exist` | Field does not exist | No | - |
| `is_empty` | Is empty array | No | [] |
| `is_not_empty` | Is not empty array | No | [1,2] |

#### Object Operators (Object)

| Operator | Description | Requires Right Value | Example |
|----------|-------------|----------------------|---------|
| `exists` | Field exists | No | Object exists |
| `does_not_exist` | Field does not exist | No | Object does not exist |
| `is_empty` | Is empty object | No | {} |
| `is_not_empty` | Is not empty object | No | {name: "test"} |

### Logical Operators

#### AND

All conditions must be satisfied.

**Example**:
```javascript
Condition Group (AND):
  - $('User').age >= 18
  - $('User').verified === true
  - $('User').country === "US"

// Result is true only when all three conditions are met
```

#### OR

Any condition satisfied is sufficient.

**Example**:
```javascript
Condition Group (OR):
  - $('Order').amount > 1000
  - $('User').vipLevel === "platinum"
  - $('Promotion').code === "SPECIAL"

// Result is true if any one condition is met
```

### Advanced Settings (Settings Panel)

#### Ignore Case (ignoreCase)

Whether to ignore case when comparing strings.

**Default**: `false`

**Example**:
```javascript
// ignoreCase = false
"Hello" === "hello"  // false

// ignoreCase = true
"Hello" === "hello"  // true
```

#### Always Output (alwaysOutput)

Output empty item even if condition is not met.

**Default**: `false`

#### Execute Once (executeOnce)

Whether to execute only once using the first input item.

**Default**: `false`

#### Retry on Fail (retryOnFail)

Whether to automatically retry when condition evaluation fails.

**Default**: `false`

#### Max Tries (maxTries)

Maximum number of retries after failure.

**Default**: `3`

#### Wait Between Tries (waitBetweenTries)

Wait time between retries (milliseconds).

**Default**: `1000` (1 second)

#### Error Handling (onError)

How to handle condition evaluation errors.

**Available Values**:
- `stopWorkflow` - Stop entire workflow (default)
- `continueRegularOutput` - Continue execution
- `continueErrorOutput` - Continue with error output

#### Node Description (nodeDescription)

Add custom description for the node.

```yaml
nodeDescription: "Validate user eligibility and route"
```

## Output and Branches

The Conditional Branch node has two output branches:

- **True Branch**: Executed when condition is satisfied
- **False Branch**: Executed when condition is not satisfied

```javascript
// No need to access output via expressions
// Directly connect true/false branches to subsequent nodes
```

## Workflow Examples

### Example 1: Simple Data Validation

```
Entity Recognition Node
  → Conditional Branch Node
    Condition (AND):
      - $('Entity Recognition').email matches regex ^[\w\.-]+@[\w\.-]+\.\w+$
      - $('Entity Recognition').phone matches regex ^1[3-9]\d{9}$
      - $('Entity Recognition').name is not empty
    → [True] → HTTP Request (Create customer) → Answer (Created successfully)
    → [False] → Answer (Incomplete info, please check email and phone format)
```

### Example 2: Order Amount Tier Processing

```
HTTP Request (Get order info)
  → Conditional Branch Node A
    Condition: $('HTTP Request').body.amount >= 10000
    → [True] → Answer (Large order, requires manual review)
    → [False] → Conditional Branch Node B
      Condition: $('HTTP Request').body.amount >= 1000
      → [True] → HTTP Request (Auto review) → Answer (Order approved)
      → [False] → HTTP Request (Fast processing) → Answer (Order processed)
```

### Example 3: User Level Judgment

```
Chat Trigger
  → HTTP Request (Get user info)
  → Conditional Branch Node
    Condition (OR):
      - $('HTTP Request').body.vipLevel === "platinum"
      - $('HTTP Request').body.vipLevel === "gold"
    → [True] → LLM Node (VIP exclusive service) → Answer
    → [False] → LLM Node (Standard service) → Answer
```

### Example 4: Multi-condition Combination

```
AI Classifier
  → Conditional Branch Node
    Condition Group (AND):
      Condition 1: $('AI Classifier').class === "urgent"
      Condition 2 (OR):
        - $('AI Classifier').confidence > 0.8
        - $('Chat Trigger').message contains "urgent"
      Condition 3: $('HTTP Request').userStatus === "active"
    → [True] → HTTP Request (Urgent channel) → Answer (Expedited processing)
    → [False] → HTTP Request (Regular channel) → Answer (Processing normally)
```

### Example 5: API Response Status Handling

```
HTTP Request Node
  → Conditional Branch Node A
    Condition: $('HTTP Request').statusCode === 200
    → [True] → Conditional Branch Node B (Check business status)
      Condition: $('HTTP Request').body.success === true
      → [True] → Answer (Operation successful)
      → [False] → Answer (Business processing failed: ${$('HTTP Request').body.message})
    → [False] → Conditional Branch Node C (Handle HTTP errors)
      Condition: $('HTTP Request').statusCode === 404
      → [True] → Answer (Resource not found)
      → [False] → Conditional Branch Node D
        Condition: $('HTTP Request').statusCode >= 500
        → [True] → Answer (Server error, please try again later)
        → [False] → Answer (Request failed, please check input)
```

### Example 6: Array Length Check

```
Knowledge Retrieval Node
  → Conditional Branch Node
    Condition (AND):
      - $('Knowledge Retrieval').results is not empty
      - $('Knowledge Retrieval').results length greater than 0
    → [True] → Conditional Branch Node (Check result quality)
      Condition: $('Knowledge Retrieval').results[0].score >= 0.7
      → [True] → LLM Node (Generate answer based on knowledge)
      → [False] → Answer (Found related info, but relevance is low, please adjust question)
    → [False] → Answer (No related info found, please rephrase question)
```

### Example 7: Regular Expression Validation

```
Chat Trigger
  → Conditional Branch Node
    Condition (OR):
      - $('Chat Trigger').message matches regex ORD-\d{6}
      - $('Chat Trigger').message matches regex Order ID[:：]\s*(\d{6})
    → [True] → Entity Recognition Node (Extract order ID)
      → HTTP Request (Query order)
      → Answer (Order details)
    → [False] → Answer (Please provide correct order ID, format: ORD-123456)
```

### Example 8: Time Range Judgment

```
Webhook Trigger
  → Code Node (Get current time and working hours)
  → Conditional Branch Node
    Condition (AND):
      - $('Code').currentHour >= 9
      - $('Code').currentHour < 18
      - $('Code').isWeekday === true
    → [True] → HTTP Request (Human service) → Answer (Transferred to human agent)
    → [False] → LLM Node (AI service) → Answer (Non-working hours, AI at your service)
```

## Best Practices

### 1. Organize Condition Logic Properly

**Use Condition Groups to Simplify Complex Logic**
```javascript
// Clear condition organization
Condition Group (AND):
  Condition Group A (OR):  // VIP user
    - vipLevel === "platinum"
    - vipLevel === "gold"
  Condition Group B (AND):  // Order conditions
    - amount > 1000
    - status === "pending"
```

**Avoid Over-nesting**
```javascript
// Bad - Over-nested
IF (Condition A)
  → IF (Condition B)
    → IF (Condition C)
      → IF (Condition D)

// Good - Use condition groups
IF (Condition A AND Condition B AND Condition C AND Condition D)
```

### 2. Choose Appropriate Operators

**String Comparison**
```javascript
// Exact match
$('Node').status === "completed"

// Fuzzy match
$('Node').message contains "error"

// Regex match (complex patterns)
$('Node').email matches regex ^[\w\.-]+@[\w\.-]+\.\w+$
```

**Number Comparison**
```javascript
// Range check - Use AND combination
$('Node').score >= 60 AND $('Node').score <= 100

// Threshold check
$('Node').temperature > 100  // Exceeds threshold
```

### 3. Handle Null Values and Non-existent Fields

**Check Field Existence First**
```javascript
// Good practice
Condition Group (AND):
  - $('Node').data exists
  - $('Node').data.value > 0

// Bad practice (may error)
$('Node').data.value > 0  // Will error if data doesn't exist
```

**Use is_empty and is_not_empty**
```javascript
// Check string not empty
$('Node').name is not empty

// Check array not empty
$('Node').items is not empty
```

### 4. Optimize Condition Performance

**Put Most Common Conditions First (OR)**
```javascript
// OR conditions: Check most common cases first
Condition Group (OR):
  - status === "active"     // Most common, 80%
  - status === "pending"    // Fairly common, 15%
  - status === "trial"      // Uncommon, 5%
```

**Put Fastest Failing Conditions First (AND)**
```javascript
// AND conditions: Check most likely to fail first
Condition Group (AND):
  - type === "premium"      // Quick check, likely to fail
  - amount > 10000          // Number comparison
  - validateComplexRule()   // Complex validation, last
```

### 5. Use Meaningful Condition Group Names

```javascript
// Name condition groups in visual editor
Condition Group "VIP User Check" (OR):
  - vipLevel === "platinum"
  - vipLevel === "gold"

Condition Group "Order Amount Validation" (AND):
  - amount > 0
  - amount <= 100000
```

### 6. Handle Edge Cases

**Number Boundaries**
```javascript
// Explicit boundary conditions
Condition Group "Valid Score" (AND):
  - score >= 0
  - score <= 100
```

**Date Boundaries**
```javascript
// Date range check
Condition Group "Event Period" (AND):
  - currentDate >= startDate
  - currentDate <= endDate
```

### 7. Boolean Logic Simplification

**Use Boolean Operators Directly**
```javascript
// Good
$('Node').isActive is true

// Not ideal
$('Node').isActive === true
```

**Use OR to Simplify Multiple Equality Checks**
```javascript
// Using OR
Condition Group (OR):
  - status === "completed"
  - status === "success"
  - status === "done"

// Or use array contains (pre-process in Code node)
["completed", "success", "done"].includes($('Node').status)
```

## FAQ

### Q1: What's the difference between Conditional Branch node and if statements in Code node?

**A**:
- **Conditional Branch Node**: Visual configuration, clear workflow diagram, suitable for simple to medium complexity conditions
- **Code Node**: Programming implementation, suitable for complex logic, multiple judgments, conditions requiring calculation

**Selection Guidance**:
```yaml
Conditional Branch Node: Data comparison, state judgment, threshold checking
Code Node: Complex algorithms, multi-step judgment, logic requiring loops
```

### Q2: How to implement multi-way branching (more than 2 branches)?

**A**: Use nested conditional branch nodes:

```
Conditional Branch A
  → [True] → Process A
  → [False] → Conditional Branch B
    → [True] → Process B
    → [False] → Conditional Branch C
      → [True] → Process C
      → [False] → Default process
```

Or use AI Classifier node for multi-way classification.

### Q3: How to write regular expressions?

**A**: Common regex examples:

```javascript
// Email
^[\w\.-]+@[\w\.-]+\.\w+$

// China mainland mobile
^1[3-9]\d{9}$

// ID card number
^\d{17}[\dXx]$

// URL
^https?:\/\/.+

// Order number (custom format)
^ORD-\d{6}$

// Date YYYY-MM-DD
^\d{4}-\d{2}-\d{2}$
```

### Q4: How to debug conditions not working?

**A**: Debugging steps:

1. **Check if left value has value**
   ```javascript
   Add Answer node to display left value:
   $('Node').field
   ```

2. **Check data type**
   ```javascript
   // Check type in Code node
   typeof $('Node').field
   ```

3. **Enable auto type conversion**
   ```yaml
   convertTypesWhereRequired: true
   ```

4. **Use Code node to print complete data**
   ```javascript
   JSON.stringify($('Node'))
   ```

### Q5: Can I use functions or calculations in conditions?

**A**: Cannot directly use complex expressions in conditions. Solutions:

```javascript
// First calculate in Code node
Code Node:
  function main({value}) {
      return {
          isValid: value > 100 && value < 1000,
          category: value > 500 ? "high" : "low"
      }
  }

// Then judge in Conditional Branch
Conditional Branch:
  $('Code').isValid === true
```

### Q6: How to implement "not equal to any value" judgment?

**A**: Use AND to combine multiple not equals:

```javascript
Condition Group (AND):
  - status not equals "draft"
  - status not equals "deleted"
  - status not equals "archived"
```

Or use array in Code node:

```javascript
!["draft", "deleted", "archived"].includes($('Node').status)
```

### Q7: Is string comparison in conditions case-sensitive?

**A**: Case-sensitive by default. To ignore case:

1. **Enable ignoreCase setting**
   ```yaml
   ignoreCase: true
   ```

2. **Convert in Code node**
   ```javascript
   $('Node').value.toLowerCase()
   ```

### Q8: How to check if array contains a specific object?

**A**:
- Simple values: Use "contains" operator directly
- Complex objects: Use Code node

```javascript
// Code node
function main({items, targetId}) {
    const found = items.some(item => item.id === targetId)
    return {found}
}

// Conditional Branch
$('Code').found === true
```

### Q9: Can I use multiple OR and AND in one Conditional Branch node?

**A**: Yes, use nested condition groups:

```javascript
Condition Group (AND):
  Condition Group A (OR):
    - condition1
    - condition2
  Condition Group B (OR):
    - condition3
    - condition4
```

This is equivalent to: `(condition1 OR condition2) AND (condition3 OR condition4)`

## Next Steps

- [Code Node](/en/guide/workflow/nodes/action-nodes/code) - Implement complex conditional logic
- [AI Classifier](/en/guide/workflow/nodes/action-nodes/ai-classifier) - Intelligent multi-way classification
- [HTTP Request Node](/en/guide/workflow/nodes/action-nodes/http-request) - Get data needed for judgment

## Related Resources

- [Expression Syntax](/en/guide/expressions/) - Learn how to use expressions in conditions
- [Answer Node](/en/guide/workflow/nodes/action-nodes/answer) - Return different responses based on conditions
