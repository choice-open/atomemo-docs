---
title: Break Loop Node
description: Exit a running loop early based on conditions
---

# Break Loop Node

The Break Loop node allows you to exit a running loop before it completes all iterations. This is useful when you need to stop processing based on a condition or when you've found the desired result.

## Use Cases

### Typical Applications
- **Early Exit** - Stop loop when condition is met
- **Search Operations** - Exit when target item is found
- **Error Recovery** - Exit when too many errors occur
- **Conditional Termination** - Stop based on business logic
- **Performance Optimization** - Exit early to save resources

## Important Restrictions

::: warning Loop Scope Only
**The Break Loop node can only be used inside a Loop & Iterate node.**

- Must be connected to the Loop Start output port
- Cannot be used outside loops
- Only nodes inside the loop can connect to Break Loop node
:::

## Node Configuration

The Break Loop node has minimal configuration - it simply exits the loop when executed.

### Ports and Connections

### Input Ports

- **Input** (port 0)
  - Single connection only (`allowMultiple: false`)
  - Main input trigger
  - Position: Left

### Output Ports

- **Error Output**
  - Handles errors during execution
  - Standard error handling port

**Note**: The Break Loop node does not have a regular output port. When executed, it immediately exits the loop and execution continues from the Loop node's "Done" output.

## How It Works

1. **Execution Flow**:
   ```
   Loop & Iterate Node
     → [Loop Start] → Node A
                      → Node B
                      → Break Loop Node (condition met)
     → [Done] → Continue after loop
   ```

2. **When Break Loop Executes**:
   - Loop immediately stops executing remaining iterations
   - Current iteration completes (nodes before Break Loop finish)
   - Loop node's "Done" output is triggered
   - Any remaining iterations are skipped

3. **Output Handling**:
   - Results from completed iterations are preserved
   - Loop output array contains results from iterations before break
   - Example: If loop breaks at iteration 3 of 10, output contains results from iterations 0, 1, 2

## Workflow Examples

### Example 1: Simple Early Exit

```
Loop & Iterate Node
  Strategy: Loop by Specified Times
  Times: 10
  → [Loop Start] → HTTP Request (Check status)
                   → Conditional Branch
                     Condition: $('HTTP Request').status === "completed"
                     → [True] → Break Loop
                     → [False] → Continue processing
  → [Done] → Answer (Loop exited early)
```

### Example 2: Search Until Found

```
Code Node (Get items to search)
  → Loop & Iterate Node
    Strategy: Iterate Over Array
    Collection: $('Code').items
    → [Loop Start] → Code Node (Check if match)
                     → Conditional Branch
                       Condition: $('Code').isMatch === true
                       → [True] → Break Loop
                                  → Answer (Found: ${$loop.item.name})
                       → [False] → Continue
    → [Done] → Answer (Item not found)
```

### Example 3: Error-Based Exit

```
Loop & Iterate Node
  Strategy: Loop by Specified Times
  Times: 100
  → [Loop Start] → HTTP Request (API call)
                   → Conditional Branch
                     Condition: $('HTTP Request').statusCode >= 500
                     → [True] → Code Node (Increment error count)
                                → Conditional Branch
                                  Condition: $('Code').errorCount >= 5
                                  → [True] → Break Loop
                                  → [False] → Continue
                     → [False] → Process result
  → [Done] → Answer (Processing complete or stopped due to errors)
```

### Example 4: Condition-Based Termination

```
Loop & Iterate Node
  Strategy: Iterate Over Array
  Collection: $('Previous Node').users
  Variables:
    - variable: "processed_count"
      value: 0
      type: "number"
  → [Loop Start] → Code Node (Process user)
                   → Code Node (Increment counter)
                   → Conditional Branch
                     Condition: $loop.vars.processed_count >= 50
                     → [True] → Break Loop
                     → [False] → Continue
  → [Done] → Answer (Processed ${$('Loop').length} users)
```

### Example 5: Combined with Exit Condition

```
Loop & Iterate Node
  Strategy: Iterate Over Array
  Collection: $('Node').items
  Exit Condition: $loop.vars.totalValue > 1000
  → [Loop Start] → Code Node (Process item)
                   → Conditional Branch
                     Condition: $('Code').isInvalid === true
                     → [True] → Break Loop (Exit on invalid item)
                     → [False] → Continue
  → [Done] → Answer (Processing stopped: ${reason})
```

## Best Practices

### 1. Use Break Loop for Clear Control Flow

```javascript
// Good - Clear intent
Conditional Branch
  Condition: found === true
  → [True] → Break Loop
  → [False] → Continue processing

// Less clear - Using complex exit conditions
// (Sometimes exit conditions are better, but Break Loop is clearer for explicit exits)
```

### 2. Place Break Loop After Critical Operations

```javascript
// Good - Complete critical operation before breaking
Process Data
  → Save Results
  → Break Loop

// Less ideal - Break before saving
Process Data
  → Break Loop
  → Save Results (might not execute)
```

### 3. Combine with Conditional Branch

```javascript
// Always use Conditional Branch before Break Loop
Conditional Branch
  Condition: shouldExit === true
  → [True] → Break Loop
  → [False] → Continue
```

### 4. Document Break Conditions

Use node descriptions to explain why the loop might break:
```yaml
nodeDescription: "Exit loop when target item found or error occurs"
```

### 5. Handle Results After Break

```javascript
// Check loop output length to know if it broke early
$('Loop Node').length < expectedIterations  // Loop broke early
```

## Comparison: Break Loop vs Exit Condition

### Break Loop Node
- **When to use**: Explicit exit points, conditional exits within loop body
- **Advantages**: Clear control flow, easy to understand, can be conditional
- **Limitations**: Must be inside loop, can only exit when executed

### Exit Condition
- **When to use**: Automatic termination based on loop state
- **Advantages**: Evaluated each iteration, can reference loop variables
- **Limitations**: Only checks at start of iteration

**Recommendation**: Use Break Loop for explicit exit points, use Exit Condition for automatic termination based on loop state.

## FAQ

### Q1: Can I use multiple Break Loop nodes in one loop?

**A**: Yes, but only the first one executed will break the loop. Others won't execute.

### Q2: What happens to nodes after Break Loop in the same iteration?

**A**: They don't execute. Break Loop immediately exits the loop when executed.

### Q3: Can I use Break Loop outside a loop?

**A**: No. Break Loop can only be used inside Loop & Iterate nodes.

### Q4: How do I know if a loop was broken early?

**A**: Compare loop output length with expected iterations:
```javascript
// Expected 10 iterations, but only 5 results
$('Loop Node').length < 10  // Loop broke early
```

### Q5: Can Break Loop be used in parallel loops?

**A**: Yes, but behavior may be unpredictable. In parallel mode, multiple iterations run simultaneously, so the break timing depends on execution order.

### Q6: What's the difference between Break Loop and Exit Condition?

**A**:
- **Break Loop**: Explicit exit point, executed when condition in loop body is met
- **Exit Condition**: Automatic check at start of each iteration, evaluates loop state

### Q7: Will completed iterations before break be included in output?

**A**: Yes. The loop output array contains all results from iterations that completed before the break.

## Next Steps

- [Loop & Iterate Node](/en/guide/workflow/nodes/control-nodes/loop-iterate) - Learn about loop configuration
- [Conditional Branch Node](/en/guide/workflow/nodes/action-nodes/if) - Add conditions before breaking
- [Code Node](/en/guide/workflow/nodes/action-nodes/code) - Process data before breaking

## Related Resources

- [Expression Syntax](/en/guide/expressions/) - Learn how to use expressions in break conditions
- [Working with Nodes](/en/guide/working-with-nodes) - General node operations guide

