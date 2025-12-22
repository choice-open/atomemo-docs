---
title: Loop & Iterate Node
description: Repeat workflow execution multiple times with flexible control
---

# Loop & Iterate Node

The Loop & Iterate node allows you to repeat a portion of your workflow multiple times. Unlike systems that separate iteration and loop into two different nodes, we use a single node with intuitive configuration to reduce learning costs. This design has been validated and many logic components can be reused.

## Use Cases

### Typical Applications
- **Batch Processing** - Process multiple items from an array or collection
- **Retry Logic** - Retry failed operations a specified number of times
- **Data Transformation** - Transform each item in a dataset
- **API Polling** - Poll an API until a condition is met
- **Workflow Repetition** - Execute a workflow segment multiple times with different parameters
- **Data Aggregation** - Collect and aggregate results from multiple iterations

## Important Limitations

::: warning Loop Scope Restriction
**The execution results of nodes inside a loop cannot be referenced by nodes outside the loop.**

This means:
- Nodes outside the loop cannot access data from loop iterations
- Use the loop node's output settings to expose data from iterations
- The loop output contains an array of all iteration results
:::

## Node Configuration

### Basic Settings (Parameters Panel)

#### Execution Strategy (strategy)

Choose how the loop will execute.

**Available Options**:

1. **Loop by Specified Times** (`type: "loop"`)
   - Execute the loop a fixed number of times
   - **Configuration**:
     - `times`: Number of iterations (integer)
     - Default: 5
     - Maximum: 100 (if exceeds 100, only 100 iterations will run)
     - Can reference previous node outputs using expressions

   **Example**:
   ```javascript
   {
     type: "loop",
     times: 10  // Execute 10 times
   }
   
   // Or use expression
   {
     type: "loop",
     times: $('Previous Node').count  // Reference previous node output
   }
   ```

2. **Iterate Over Array** (`type: "iteration"`)
   - Iterate through each item in an array
   - **Configuration**:
     - `collection`: Array to iterate (expression)
     - `max_iterations`: Optional maximum iterations limit
       - Default: 1
       - No upper limit
       - Can reference expressions
       - Enable "Limit iterations" toggle to activate

   **Example**:
   ```javascript
   {
     type: "iteration",
     collection: $('Previous Node').items,  // Array from previous node
     max_iterations: 5  // Optional: limit to 5 items
   }
   ```

#### Execution Mode (parallel)

Choose how loop iterations are executed.

**Available Options**:
- **Serial** (`parallel: false`) - Default
  - Execute iterations one by one in sequence
  - If one iteration fails, the loop terminates
  - Suitable for operations that depend on previous iterations

- **Parallel** (`parallel: true`)
  - Execute all iterations simultaneously
  - Each iteration runs independently
  - Failure in one iteration doesn't affect others
  - ⚠️ **Warning**: Modifying global variables in parallel mode results in unpredictable execution order and may cause unknown errors. Use with caution.

**Example**:
```javascript
// Serial execution
{
  parallel: false
}

// Parallel execution
{
  parallel: true
}
```

#### Loop Variables (variables)

Define variables available within the loop scope.

**Field Properties**:
- Optional (can add or remove variables)
- Variables are available throughout the loop iteration
- Can reference previous node outputs
- When iteration mode is "Iterate Over Array", can reference current array item

**Variable Structure**:
```javascript
variables: [
  {
    variable: "var_a",        // Variable name
    value: "var_value",       // Variable value (can be expression)
    type: "string"            // Variable type: string/number/object/boolean/array
  },
  {
    variable: "var_b",
    value: $('Previous Node').count,
    type: "number"
  }
]
```

**Variable Types**:
- `string` - Text values
- `number` - Numeric values
- `object` - JSON objects
- `boolean` - True/false values
- `array` - Arrays/lists

**Special Reference in Iteration Mode**:
When using "Iterate Over Array" mode, you can reference the current array item:
```javascript
{
  variable: "current_item",
  value: $loop.item,  // Current array item in iteration
  type: "object"
}
```

::: warning Parallel Mode Variables
**In parallel mode, modifying global variables results in unpredictable execution order and may cause unknown errors. Please use with caution.**
:::

#### Loop Termination Conditions

Configure when the loop should stop early.

**Termination Triggers**:
1. **Maximum Errors** (`max_errors`)
   - Stop loop after reaching maximum error count
   - Default: 5
   - Maximum: 10000
   - Cannot be removed (always present)

2. **Exit Condition** (`exit_condition`)
   - Stop loop when condition is met
   - Can reference:
     - Previous node outputs
     - Current iteration item (in iteration mode)
     - Custom loop variables
   - Supports condition groups and nested conditions
   - Can use Break Loop node inside loop (see [Break Loop Node](/en/guide/workflow/nodes/control-nodes/break-loop))

**Termination Logic**:
The loop terminates when **any** of the following conditions is met:
- Maximum error count reached
- Exit condition evaluates to true
- Break Loop node is executed inside the loop

**Example**:
```javascript
{
  max_errors: 10,
  exit_condition: {
    leftValue: $loop.vars.var_a,
    operator: "is_greater_than",
    rightValue: 100
  }
}
```

#### Output Settings (output_item_settings)

Configure what data to output after all iterations complete.

**Output Structure**:
The loop node outputs an array containing results from all iterations:
```javascript
[
  {"output_1": "value1", "output_2": "value2"},  // Iteration 1 results
  {"output_1": "value1", "output_2": "value2"},  // Iteration 2 results
  // ... more iterations
]
```

**Output Item Configuration**:
```javascript
output_item_settings: [
  {
    variable: "output_1",           // Output variable name
    value: $('Loop Node').result,    // Value or expression
    type: "string"                   // Variable type
  },
  {
    variable: "output_2",
    value: $loop.vars.var_a,        // Reference loop variable
    type: "number"
  }
]
```

**Value References**:
- Can reference outputs from nodes inside the loop
- Can reference loop variables
- Can reference current iteration item (`$loop.item`) and index (`$loop.index`)

**Variable Types**:
- `string` - Text values
- `number` - Numeric values
- `object` - JSON objects
- `boolean` - True/false values
- `array` - Arrays/lists

### Advanced Settings (Settings Panel)

#### Error Handling (onError)

How to handle errors during loop execution.

**Available Values**:
- `stopWorkflow` - Stop entire workflow (default)
- `continueRegularOutput` - Continue execution
- `continueErrorOutput` - Continue with error output

#### Node Description (nodeDescription)

Add custom description for the node.

```yaml
nodeDescription: "Process items in batch with retry logic"
```

## Variable Reference Expressions

### Reference Loop Variables

```javascript
// Reference a loop variable
$loop.vars.var_a

// Reference multiple loop variables
$loop.vars.var_a + $loop.vars.var_b
```

### Reference Current Iteration Item and Index

When using "Iterate Over Array" mode:

```javascript
// Reference current array item
$loop.item

// Reference current iteration index (0-based)
$loop.index

// Access properties of current item
$loop.item.name
$loop.item.id
```

### Reference Loop Node Output

```javascript
// Reference entire loop output (array of all iteration results)
$('Loop Node Name')

// Reference specific iteration output
$('Loop Node Name')[0].output_1        // First iteration, output_1
$('Loop Node Name')[1].output_2       // Second iteration, output_2

// Get all values of a specific output across iterations
$('Loop Node Name').map(item => item.output_1)  // All output_1 values
```

## Ports and Connections

### Input Ports

- **Input** (port 0)
  - Single connection only (`allowMultiple: false`)
  - Main input for the loop
  - Position: Left

### Output Ports

- **Done** (port 0)
  - Single connection only (`allowMultiple: false`)
  - Executed after all iterations complete
  - Contains final output array
  - Position: Right

- **Loop Start** (port with `loopstart` role)
  - Multiple connections allowed (`allowMultiple: true`)
  - Nodes connected here execute in each iteration
  - Position: Right
  - ⚠️ **Important**: Only nodes inside the loop can connect to this port

- **Error Output**
  - Handles errors during loop execution
  - Configuration depends on error handling settings

## Workflow Examples

### Example 1: Process Array Items

```
HTTP Request (Get user list)
  → Loop & Iterate Node
    Strategy: Iterate Over Array
    Collection: $('HTTP Request').body.users
    Variables:
      - variable: "current_user"
        value: $loop.item
        type: "object"
    → [Loop Start] → HTTP Request (Process user)
                     → Code Node (Transform data)
    → [Done] → Answer (Processed ${$('Loop').length} users)
```

### Example 2: Retry with Limit

```
HTTP Request (API call)
  → Loop & Iterate Node
    Strategy: Loop by Specified Times
    Times: 3
    Mode: Serial
    Max Errors: 1
    Exit Condition: $('HTTP Request').statusCode === 200
    → [Loop Start] → HTTP Request (Retry API)
    → [Done] → Answer (API call completed)
```

### Example 3: Batch Processing with Parallel Execution

```
Code Node (Generate batch IDs)
  → Loop & Iterate Node
    Strategy: Iterate Over Array
    Collection: $('Code').batchIds
    Mode: Parallel
    Max Iterations: 10
    → [Loop Start] → HTTP Request (Process batch)
                     → Code Node (Transform result)
    → [Done] → Code Node (Aggregate results)
              → Answer (Batch processing complete)
```

### Example 4: Conditional Loop with Variables

```
Code Node (Prepare data)
  → Loop & Iterate Node
    Strategy: Loop by Specified Times
    Times: $('Code').maxIterations
    Variables:
      - variable: "counter"
        value: 0
        type: "number"
      - variable: "total"
        value: $('Code').total
        type: "number"
    Exit Condition: $loop.vars.counter >= $loop.vars.total
    → [Loop Start] → Code Node (Increment counter)
                     → Conditional Branch
                       Condition: $loop.vars.counter < 10
                       → [True] → Process item
                       → [False] → Break Loop
    → [Done] → Answer (Processing complete)
```

### Example 5: Nested Data Processing

```
HTTP Request (Get orders)
  → Loop & Iterate Node (Outer Loop)
    Strategy: Iterate Over Array
    Collection: $('HTTP Request').body.orders
    → [Loop Start] → Loop & Iterate Node (Inner Loop)
                      Strategy: Iterate Over Array
                      Collection: $loop.item.items
                      → [Loop Start] → Process order item
                      → [Done] → Aggregate order items
    → [Done] → Answer (All orders processed)
```

## Best Practices

### 1. Choose Appropriate Execution Mode

**Use Serial Mode When**:
- Operations depend on previous iterations
- Modifying shared state or global variables
- Order of execution matters
- Processing one item at a time is safer

**Use Parallel Mode When**:
- Operations are independent
- Performance is critical
- No shared state modifications
- Can handle failures individually

### 2. Set Reasonable Limits

```javascript
// Good - Set maximum iterations
{
  type: "iteration",
  collection: $('Node').items,
  max_iterations: 100  // Prevent infinite loops
}

// Bad - No limit (risky)
{
  type: "iteration",
  collection: $('Node').items
  // Could loop forever if array is very large
}
```

### 3. Handle Errors Properly

```javascript
// Set appropriate max_errors
{
  max_errors: 5,  // Stop after 5 errors
  exit_condition: {
    // Early exit condition
  }
}
```

### 4. Use Loop Variables Effectively

```javascript
// Initialize variables
variables: [
  {
    variable: "total_processed",
    value: 0,
    type: "number"
  },
  {
    variable: "current_item",
    value: $loop.item,  // In iteration mode
    type: "object"
  }
]
```

### 5. Optimize Output Settings

```javascript
// Only output necessary data
output_item_settings: [
  {
    variable: "result",
    value: $('Process Node').output,  // Reference loop node output
    type: "object"
  }
]

// Then access results outside loop
$('Loop Node')[0].result  // First iteration result
$('Loop Node').length      // Total iterations
```

### 6. Avoid Modifying Global State in Parallel Mode

::: warning
**In parallel mode, modifying global variables results in unpredictable execution order. Use serial mode or avoid global state modifications.**
:::

### 7. Use Break Loop Node for Early Exit

Instead of complex exit conditions, use the Break Loop node inside the loop for clearer control flow.

## FAQ

### Q1: What's the difference between "Loop by Specified Times" and "Iterate Over Array"?

**A**:
- **Loop by Specified Times**: Executes a fixed number of times, regardless of data
- **Iterate Over Array**: Executes once for each item in an array

**Selection Guidance**:
```yaml
Loop by Specified Times: Retry logic, fixed repetition, polling
Iterate Over Array: Process data items, transform collections, batch operations
```

### Q2: Can I access loop results outside the loop?

**A**: Yes, use the loop node's output:
```javascript
// Get all results
$('Loop Node')

// Get specific iteration result
$('Loop Node')[0]  // First iteration

// Get specific output across all iterations
$('Loop Node').map(item => item.output_1)
```

### Q3: What happens if an iteration fails?

**A**: Depends on settings:
- **Serial mode**: Loop terminates immediately
- **Parallel mode**: Failed iteration doesn't affect others
- **Max errors**: Loop stops when error count reaches limit
- **Error handling**: Determines workflow behavior

### Q4: Can I use Break Loop node inside a loop?

**A**: Yes! The Break Loop node can be used inside loops to exit early. See [Break Loop Node](/en/guide/workflow/nodes/control-nodes/break-loop) for details.

### Q5: How do I reference the current iteration number?

**A**: Use `$loop.index`:
```javascript
// Current iteration index (0-based)
$loop.index

// 1-based index
$loop.index + 1
```

### Q6: Can I nest loops?

**A**: Yes, loops can be nested. Inner loops execute for each iteration of outer loops.

### Q7: What's the maximum number of iterations?

**A**:
- **Loop by Specified Times**: Maximum 100 (if exceeds, only 100 will run)
- **Iterate Over Array**: No hard limit, but consider using `max_iterations` for safety

### Q8: How do I reference loop variables in exit conditions?

**A**: Use `$loop.vars.variable_name`:
```javascript
exit_condition: {
  leftValue: $loop.vars.counter,
  operator: "is_greater_than",
  rightValue: 100
}
```

## Next Steps

- [Break Loop Node](/en/guide/workflow/nodes/control-nodes/break-loop) - Exit loops early
- [Conditional Branch Node](/en/guide/workflow/nodes/action-nodes/if) - Add conditional logic inside loops
- [Code Node](/en/guide/workflow/nodes/action-nodes/code) - Complex data processing in loops

## Related Resources

- [Expression Syntax](/en/guide/expressions/) - Learn how to use expressions in loop configurations
- [Working with Nodes](/en/guide/working-with-nodes) - General node operations guide

