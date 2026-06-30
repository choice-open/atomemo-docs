---
title: Execute Sub-workflow
description: Call a reusable sub-workflow from another workflow, passing data in and receiving results back
---

# Execute Sub-workflow

The Execute Sub-workflow node allows you to call a reusable workflow (a **sub-workflow**) from within another workflow. This enables modular workflow design — build shared logic once as a sub-workflow, then invoke it from multiple parent workflows.

> **Prerequisites**: The target sub-workflow must be **published** (active) and have a [Subflow Trigger](/en/guide/workflow/nodes/trigger-nodes/subflow) as its entry point. Each workflow can have at most one Subflow Trigger.

## Use Cases

### Typical Applications
- **Reusable Validation** — Centralize input validation logic in a sub-workflow, call it from multiple workflows
- **Data Enrichment** — Call a sub-workflow that fetches and formats data from external APIs
- **Multi-stage Pipelines** — Break complex processes into stages, each implemented as a sub-workflow
- **Error Handling Modules** — Reuse standardized error logging and notification logic
- **Loop Iteration** — Call a sub-workflow inside a [Loop & Iterate](/en/guide/workflow/nodes/control-nodes/loop-iterate) node to process each item

## Node Configuration

### Basic Settings (Parameters Panel)

#### 1. Select Sub-workflow

Choose which sub-workflow to call from the dropdown. Only **active, published workflows** that include a [Subflow Trigger](/en/guide/workflow/nodes/trigger-nodes/subflow) appear in the list.

**Before selection**: All other settings are hidden.
**After selection**: Input fields are automatically populated based on the sub-workflow's defined input schema.

> The node always calls the **latest active version** of the selected sub-workflow. If the sub-workflow's trigger is later changed (e.g., replaced with a Webhook Trigger), the node will error at runtime because the sub-workflow is no longer callable.

#### 2. Input Parameters

After selecting a sub-workflow, its expected input parameters are automatically read and displayed. Each input is a key-value pair:

| Field | Description |
| --- | --- |
| **Variable** | The input name as defined in the sub-workflow |
| **Value** | The value to pass — supports [expressions](/en/guide/expressions/) to reference upstream node outputs |
| **Type** | The expected data type (auto-populated from sub-workflow schema) |

**Supported input types**:
- `text` — String values
- `number` — Numeric values
- `array` — List/array values
- `object` — JSON objects
- `boolean` — `true` / `false`
- `datetime` — Date and time values

**Passing data to the sub-workflow**:

```javascript
// Reference upstream node output
$('Webhook Trigger').body.userId

// Reference multiple upstream nodes
$('Code').processedData

// Pass a literal value
"active"

// Pass a number
42
```

**Required inputs**: If the sub-workflow defines required inputs, you must provide values for them. The sub-workflow itself does **not** validate input types at the boundary — if a value of the wrong type is passed, the sub-workflow will error when a downstream node attempts to use it.

**No required inputs**: If the sub-workflow has no required inputs, you can leave all input fields empty and still execute the node.

#### 3. Wait for Sub-workflow

A toggle that controls whether the parent workflow waits for the sub-workflow to complete or continues immediately.

**On** (default) — The parent workflow pauses until the sub-workflow finishes, then receives its output.

```
Execute Sub-workflow (wait = on)
  → Sub-workflow runs to completion
  → Output returned to parent
  → Parent continues with next node
```

**Off** — The sub-workflow is triggered asynchronously. The parent workflow continues immediately without waiting.

```
Execute Sub-workflow (wait = off)
  → Sub-workflow runs in background
  → Parent continues immediately (no output)
```

> **Warning**: When **Wait for Sub-workflow** is off, the node outputs `null`. If a downstream node references the sub-workflow's output, it will error because no result is available.

### Advanced Settings (Settings Panel)

#### Node Description

Add a custom description to document the sub-workflow call's purpose:

```yaml
nodeDescription: "Calls the Order Validator sub-workflow. 
Returns { isValid: boolean, message: string }."
```

## Output Data

### When Wait is On

After the sub-workflow completes, its output data is available under this node's name in the parent workflow. The output structure is defined by the [Subflow Output](/en/guide/workflow/nodes/action-nodes/output) node(s) in the called sub-workflow.

```javascript
// Access sub-workflow output in the parent
$('Execute Sub-workflow').isValid
$('Execute Sub-workflow').message
$('Execute Sub-workflow').processedAt
```

### When Wait is Off

The node outputs `null`. No sub-workflow output is available to downstream nodes.

## How It Works

### Execution Flow

```
Parent Workflow:
  Trigger Node
    → Processing Nodes
    → Execute Sub-workflow Node ← gathers inputs, calls sub-workflow

Sub-workflow (called):
  Subflow Trigger ← receives inputs
    → Processing Nodes
    → Subflow Output ← packages results

Parent Workflow (continued):
    → Subsequent Nodes ← access $('Execute Sub-workflow').outputField
```

### Version Selection

The node always calls the **latest active (published) version** of the selected sub-workflow. If the sub-workflow is unpublished or its trigger type is changed away from Subflow Trigger, the node will error at runtime.

### Nested Sub-workflows

A sub-workflow can itself contain an Execute Sub-workflow node, enabling multi-level orchestration. Avoid circular calls (Workflow A → Workflow B → Workflow A), which will cause a runtime error.

## Workflow Examples

### Example 1: Simple Validation Sub-workflow

```
Parent Workflow:
  Webhook Trigger (POST, order data)
    → Execute Sub-workflow
        Sub-workflow: "Order Validator"
        Inputs:
          orderTotal: $('Webhook Trigger').body.total
          customerId: $('Webhook Trigger').body.customerId
        Wait: On
    → Conditional Branch
        Condition: $('Execute Sub-workflow').isValid === true
        → [valid] → Process Order
        → [invalid] → Return Error Response
```

### Example 2: Data Enrichment with Async Call

```
Parent Workflow:
  Chat Trigger
    → Execute Sub-workflow
        Sub-workflow: "Customer Lookup"
        Inputs:
          customerId: $('Chat Trigger').customerId
        Wait: On
    → LLM Node
        System: "Use the following customer data to personalize your response"
        Context: $('Execute Sub-workflow')
    → Answer Node
```

### Example 3: Fire-and-Forget with Wait Off

```
Parent Workflow:
  Webhook Trigger (POST, log data)
    → Execute Sub-workflow
        Sub-workflow: "Log Processor"
        Inputs:
          logEntry: $('Webhook Trigger').body
        Wait: Off                     ← Don't wait, continue immediately
    → Webhook Response (No Data)     ← Acknowledge immediately
```

### Example 4: Loop Iteration Over Sub-workflow

```
Parent Workflow:
  Webhook Trigger (POST, batch of items)
    → Code Node (parse array)
    → Loop & Iterate
        Over: $('Code').items
        → Execute Sub-workflow
            Sub-workflow: "Item Processor"
            Inputs:
              item: $('Loop & Iterate').currentItem   ← Current iteration item
            Wait: On
    → Aggregate Results
```

## Constraints

### Input Type Validation

The Execute Sub-workflow node does **not** validate that input values match the sub-workflow's expected types. If a value of the wrong type is passed (e.g., a string where a number is expected), the sub-workflow will error at runtime when a downstream node attempts to use that value. Ensure you pass values in the expected format.

### Required Inputs

Required inputs are enforced at the **frontend configuration level** — you must fill in values before the node can be saved. However, the backend does not re-validate required fields at runtime. If a required field is somehow empty at execution time, the sub-workflow itself will likely fail when it tries to use the missing data.

### Single Subflow Trigger per Workflow

Each workflow can have at most one [Subflow Trigger](/en/guide/workflow/nodes/trigger-nodes/subflow). If you need a sub-workflow with multiple entry points, consider creating separate sub-workflows or using conditional branching inside the sub-workflow.

### No Concurrent Same-Subflow Calls with Wait Off

When **Wait for Sub-workflow** is off, the sub-workflow runs asynchronously. If the parent workflow calls the same sub-workflow multiple times with wait off, multiple concurrent executions are spawned. Ensure the sub-workflow is designed for concurrent execution.

## Best Practices

### 1. Rename the Node

Double-click to rename from "Execute Sub-workflow" to a meaningful name:

```
[Execute Sub-workflow]        ← Default
[Validate Order]               ← Better
[Lookup Customer Profile]      ← Best
```

### 2. Document the Output Contract

Use the node description to document what outputs callers can expect:

```yaml
nodeDescription: "Returns { isValid: boolean, errors: string[] }.
Check `isValid` before using downstream data."
```

### 3. Use Wait Only When You Need Output

If you don't need the sub-workflow's output, turn **Wait for Sub-workflow** off. This keeps the parent workflow fast:

```yaml
# Need output — keep wait on
Wait: On → $('Execute Sub-workflow').result

# Fire-and-forget — turn wait off
Wait: Off → Parent continues immediately
```

### 4. Handle Sub-workflow Errors

The Execute Sub-workflow node has an error output port. Connect it to error handling nodes:

```
Execute Sub-workflow
  → [Success Port 0] → Continue processing
  → [Error Port] → Log Error → Send Alert
```

### 5. Test Sub-workflows Independently First

Before calling a sub-workflow from a parent, test it independently using its own trigger to ensure it works correctly. This isolates issues and speeds up debugging.

## FAQ

### Q1: Can I call a workflow that doesn't have a Subflow Trigger?

**A**: No. The target workflow must have a [Subflow Trigger](/en/guide/workflow/nodes/trigger-nodes/subflow). If the workflow's trigger is changed away from Subflow Trigger, the node will error with "Subflow not found".

### Q2: What happens if the sub-workflow fails?

**A**: When **Wait** is on, the node outputs an error through its error port. You can connect the error port to logging, notification, or fallback nodes. When **Wait** is off, the failure happens asynchronously and does not affect the parent workflow.

### Q3: How are sub-workflow versions handled?

**A**: The node always calls the **latest active (published) version** of the selected sub-workflow. If you publish a new version of the sub-workflow, the node will automatically use it on the next execution. There is no way to pin to a specific version.

### Q4: Can I pass complex objects as inputs?

**A**: Yes. Use expressions to reference objects, arrays, or any upstream data:

```javascript
// Pass an object
$('Code').customerProfile

// Pass an array
$('Code').itemList

// Pass a nested field
$('HTTP Request').body.data.attributes
```

### Q5: What if I need to pass many inputs?

**A**: Consider using a [Code Node](/en/guide/workflow/nodes/action-nodes/code) to aggregate data into a single object before passing it to the sub-workflow. This keeps the Execute Sub-workflow node's input list manageable.

### Q6: Can I call the same sub-workflow multiple times in one parent?

**A**: Yes. You can place multiple Execute Sub-workflow nodes in the same parent workflow, each with different inputs. When **Wait** is on, they execute sequentially. When **Wait** is off, they run concurrently.

## Next Steps

- [Sub-workflow Tool Node](/en/guide/workflow/nodes/tool-nodes/subflow) — Register sub-workflows as AI-callable tools
- [Subflow Trigger](/en/guide/workflow/nodes/trigger-nodes/subflow) — Learn how to create a callable sub-workflow
- [Subflow Output](/en/guide/workflow/nodes/action-nodes/output) — Learn how sub-workflows return results
- [Loop & Iterate](/en/guide/workflow/nodes/control-nodes/loop-iterate) — Call a sub-workflow for each item in a list

## Related Resources

- [Webhook Response Node](/en/guide/workflow/nodes/action-nodes/webhook-response) — Send custom HTTP responses
- [Code Node](/en/guide/workflow/nodes/action-nodes/code) — Process data before passing to sub-workflow
- [Conditional Branch](/en/guide/workflow/nodes/action-nodes/if) — Route based on sub-workflow output
