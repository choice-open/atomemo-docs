---
title: Variable Assigner Node
description: Modify global or loop variable values in workflows
---

# Variable Assigner Node

The Variable Assigner node allows you to modify the values of global or loop variables in your workflow, affecting the execution of subsequent nodes. This node provides a flexible way to manage state and data flow throughout your workflow execution.

## Use Cases

### Typical Applications
- **State Management** - Update global variables to track workflow state
- **Loop Variable Modification** - Modify loop variables during iteration
- **Counter Management** - Increment or decrement counters based on conditions
- **Data Accumulation** - Collect and aggregate data across multiple workflow executions
- **Conditional Updates** - Update variables based on conditional logic
- **Configuration Updates** - Dynamically adjust workflow configuration values
- **Batch Processing** - Track progress and status in batch operations

## Node Configuration

### Basic Settings (Parameters Panel)

#### Variable Assignments (items)

Define variable assignments to execute. This is an array parameter where each item represents one variable assignment.

**Field Properties**:
- Array type, can add multiple assignments
- Each assignment contains:
  - `variable` - Variable name (required)
  - `value` - Variable value (required, supports expressions)
- Assignments execute in order
- Defaults to empty array

**Variable Types**:
- **Global Variables** - Available throughout the entire workflow
- **Loop Variables** - Available only within the loop node scope (when node is inside a loop)

**Configuration Examples**:

```javascript
// Assignment 1: Set a global counter
variable: "counter"
value: 0

// Assignment 2: Update user status
variable: "userStatus"
value: $('HTTP Request').body.status

// Assignment 3: Increment counter using expression
variable: "pageNumber"
value: $('Variable Assigner').pageNumber + 1

// Assignment 4: Set from previous node output
variable: "lastProcessedId"
value: $('Code').lastId
```

#### Variable Selection

When selecting a variable, the node automatically detects whether you're inside a loop node:

- **Inside Loop Node**: Shows loop variables from the parent loop node
- **Outside Loop Node**: Shows only global variables

**Note**: The node displays a hint when assigning to loop variables, showing which loop node the variables belong to.

#### Value Input

The value field supports both fixed values and expressions:

**Fixed Value**:
```javascript
// String
"Hello World"

// Number
42

// Boolean
true

// Null
null
```

**Expression Mode**:
```javascript
// Reference upstream node data
$('Chat Trigger').message

// Mathematical operations
$('Code').count * 2

// String concatenation
"User: " + $('HTTP Request').body.username

// Conditional assignment
$('Conditional Branch').isValid ? "valid" : "invalid"

// Array/object operations
$('Code').items.length
```

### Advanced Settings (Settings Panel)

#### Always Output (alwaysOutput)

Whether to output an empty item when output is empty.

**Default**: `false`

**Purpose**: Prevents workflow from terminating at this node, ensuring subsequent nodes can execute.

#### Execute Once (executeOnce)

Whether to execute only once using data from the first input item.

**Default**: `false`

**Purpose**:
- When upstream nodes return multiple items, assignments execute for each item by default
- When enabled, only the first item executes, improving performance for batch operations

#### Retry on Fail (retryOnFail)

Whether to automatically retry when variable assignment fails.

**Default**: `false`

#### Max Tries (maxTries)

Maximum number of retries after failure.

**Default**: `3`

**Prerequisite**: `retryOnFail` must be `true`

#### Wait Between Tries (waitBetweenTries)

Wait time between retries (milliseconds).

**Default**: `1000` (1 second)

**Prerequisite**: `retryOnFail` must be `true`

#### Error Handling (onError)

How to handle variable assignment failures.

**Available Values**:
- `stopWorkflow` - Stop entire workflow (default)
- `continueRegularOutput` - Continue with regular output
- `continueErrorOutput` - Continue with error output

#### Node Description (nodeDescription)

Add custom description for the node.

```yaml
nodeDescription: "Update user counter and status"
```

## Output Data

The Variable Assigner node passes through input data unchanged, allowing subsequent nodes to access the updated variables.

```javascript
// Input data
{
  userId: "user123",
  message: "Hello"
}

// Output after assignment (same data, but variables updated)
{
  userId: "user123",
  message: "Hello"
}

// Updated variables are available globally
$sys.variables.counter  // Updated value
$sys.variables.userStatus  // Updated value
```

**Accessing Updated Variables**:

```javascript
// In subsequent nodes, access updated variables
$sys.variables.counter
$sys.variables.userStatus

// Or reference in expressions
$('Variable Assigner').userId  // Still "user123" (unchanged)
```

## Workflow Examples

### Example 1: Counter Management

```
Chat Trigger
  → Variable Assigner
    Assignments:
      - variable: "messageCount"
        value: $sys.variables.messageCount + 1
  → Conditional Branch
    Condition: $sys.variables.messageCount > 10
    → [True] → Answer ("You've sent 10 messages!")
    → [False] → Answer ("Continue chatting...")
```

**Description**: Track message count and respond when threshold is reached.

### Example 2: Loop Variable Updates

```
Loop Iterate Node (process items)
  → HTTP Request (process item)
  → Variable Assigner
    Assignments:
      - variable: "processedCount"
        value: $sys.variables.processedCount + 1
      - variable: "lastProcessedId"
        value: $('HTTP Request').body.id
  → Next iteration
```

**Description**: Track processing progress within a loop iteration.

### Example 3: Conditional State Updates

```
HTTP Request (fetch user data)
  → Conditional Branch
    Condition: $('HTTP Request').body.status === "active"
    → [True] → Variable Assigner
      Assignments:
        - variable: "activeUserCount"
          value: $sys.variables.activeUserCount + 1
    → [False] → Variable Assigner
      Assignments:
        - variable: "inactiveUserCount"
          value: $sys.variables.inactiveUserCount + 1
```

**Description**: Update different counters based on conditional logic.

### Example 4: Data Accumulation

```
Webhook Trigger
  → Variable Assigner
    Assignments:
      - variable: "totalRevenue"
        value: $sys.variables.totalRevenue + $('Webhook Trigger').body.amount
      - variable: "transactionCount"
        value: $sys.variables.transactionCount + 1
  → Answer Node
```

**Description**: Accumulate revenue and transaction counts across multiple webhook calls.

### Example 5: Dynamic Configuration

```
Code Node (calculate batch size)
  → Variable Assigner
    Assignments:
      - variable: "batchSize"
        value: $('Code').optimalBatchSize
      - variable: "maxRetries"
        value: $('Code').calculatedRetries
  → Loop Iterate Node
    Uses: $sys.variables.batchSize
```

**Description**: Dynamically update configuration variables based on calculations.

### Example 6: Reset Variables

```
Variable Assigner (reset counters)
  Assignments:
    - variable: "counter"
      value: 0
    - variable: "status"
      value: "initialized"
  → Process Workflow
```

**Description**: Reset variables to initial state before starting a new process.

## Best Practices

### 1. Variable Naming

**Use Descriptive Names**
```javascript
// Good
variable: "userMessageCount"
variable: "lastProcessedOrderId"
variable: "currentBatchIndex"

// Avoid
variable: "c1"
variable: "temp"
variable: "x"
```

**Follow Naming Conventions**
- Use camelCase for variable names
- Use descriptive names that indicate purpose
- Avoid abbreviations unless widely understood

### 2. Initialize Variables

**Set Initial Values**
```javascript
// At workflow start, initialize variables
Variable Assigner:
  - variable: "counter"
    value: 0
  - variable: "status"
    value: "pending"
```

### 3. Use Expressions for Dynamic Updates

**Calculate Values Dynamically**
```javascript
// Instead of hardcoding
variable: "nextPage"
value: $sys.variables.currentPage + 1

// Use conditional logic
variable: "status"
value: $('HTTP Request').statusCode === 200 ? "success" : "failed"
```

### 4. Avoid Overwriting Unintentionally

**Check Before Updating**
```javascript
// Use conditional logic to prevent unwanted overwrites
variable: "lastProcessedId"
value: $('HTTP Request').body.id || $sys.variables.lastProcessedId
```

### 5. Document Variable Usage

**Add Node Descriptions**
```yaml
nodeDescription: "Update user counter and track last processed message ID"
```

### 6. Performance Considerations

**Use Execute Once for Batch Operations**
```yaml
# When processing multiple items, update counter once
settings:
  executeOnce: true
```

**Minimize Variable Updates**
- Only update variables when necessary
- Consider combining multiple updates into single assignments

### 7. Error Handling

**Handle Assignment Failures**
```yaml
settings:
  onError: continueRegularOutput  # Continue even if assignment fails
  retryOnFail: true
  maxTries: 3
```

## FAQ

### Q1: What's the difference between global and loop variables?

**A**:
- **Global Variables**: Available throughout the entire workflow, persist across all nodes
- **Loop Variables**: Available only within the scope of a loop node, reset for each iteration

### Q2: Can I assign to variables that don't exist yet?

**A**: Yes, assigning to a non-existent variable creates it. However, it's recommended to initialize variables at workflow start for clarity.

### Q3: Can I use expressions in variable names?

**A**: No, variable names must be fixed strings. Only the value supports expressions.

### Q4: What happens if I assign to the same variable multiple times in one node?

**A**: Assignments execute in order, so later assignments overwrite earlier ones for the same variable.

### Q5: Can variables be accessed across different workflow executions?

**A**: Global variables persist during a single workflow execution but are reset between executions. For persistent storage, use external storage systems.

### Q6: How do I clear or reset a variable?

**A**: Assign `null` or an empty value:
```javascript
variable: "myVariable"
value: null  // or "" for strings, 0 for numbers
```

### Q7: Can I use variables in conditional branches?

**A**: Yes, reference variables using `$sys.variables.variableName`:
```javascript
$sys.variables.counter > 10
$sys.variables.status === "active"
```

### Q8: What happens if assignment fails?

**A**: Based on `onError` setting:
- `stopWorkflow` - Workflow stops (default)
- `continueRegularOutput` - Continues with regular output
- `continueErrorOutput` - Continues with error output

### Q9: Can I assign complex objects or arrays?

**A**: Yes, variables can hold any data type:
```javascript
variable: "userData"
value: $('HTTP Request').body  // Object

variable: "items"
value: $('Code').items  // Array
```

### Q10: How do I increment a counter?

**A**: Use expressions to reference the current value:
```javascript
variable: "counter"
value: $sys.variables.counter + 1
```

## Next Steps

- [Loop & Iterate](/en/guide/workflow/nodes/control-nodes/loop-iterate) - Learn how to use loop variables
- [Conditional Branch](/en/guide/workflow/nodes/action-nodes/if) - Use variables in conditional logic
- [Code Node](/en/guide/workflow/nodes/action-nodes/code) - Complex variable calculations
- [Expression Syntax](/en/guide/expressions/) - Learn how to use expressions in variable values

## Related Resources

- [Working with Nodes](/en/guide/working-with-nodes) - General node usage guide
- [Editing Nodes](/en/guide/editing-nodes) - Learn how to configure nodes











