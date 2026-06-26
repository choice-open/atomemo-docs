---
title: Subflow Output
description: Return data from a workflow to its caller, the required endpoint for subflow workflows
---

# Subflow Output

The Subflow Output node returns data from a workflow to its caller. It is the **required endpoint** for any workflow that uses a [Subflow Trigger](/en/guide/workflow/nodes/trigger-nodes/subflow) — without it, the parent workflow has no way to receive results from the child workflow.

## Use Cases

- **Return Results** — Send processed data back to the calling workflow
- **Multi-Value Output** — Define multiple named outputs (e.g., `status`, `data`, `message`)
- **Pipeline Handoff** — Pass structured data between workflow stages in a multi-step pipeline
- **Error Signaling** — Use the error output port to signal failure to the caller

## Node Features

### Basic Characteristics
- **Required for Subflows** — Every workflow with a [Subflow Trigger](/en/guide/workflow/nodes/trigger-nodes/subflow) must include at least one Subflow Output node
- **Multiple Outputs** — Define any number of named output variables
- **Error Output Port** — Route error information separately from normal output
- **Parameter Preview** — Canvas shows a summary of defined outputs

### Ports

| Port | Type | Description |
| --- | --- | --- |
| Input | Input | Receives data from the previous node |
| Output | Output (multiple) | Sends output data to the parent workflow |
| Error | Error Output | Routes error information on failure |

## Node Configuration

### Basic Settings (Parameters Panel)

#### Outputs

Define the output variables this workflow returns to its caller. Click **Add Output** to create one, then configure:

| Property | Description |
| --- | --- |
| **Variable** | Name used to access the value in the parent workflow |
| **Value** | Expression for the value to output (e.g., `$('Code').result`) |

**Example Configuration**:

```yaml
outputs:
  - variable: "isValid"
    value: "$('Code').isValid"
  - variable: "message"
    value: "$('Code').message"
  - variable: "processedAt"
    value: "$('Code').timestamp"
```

> **Note**: Output variable names must be unique. The `value` field can use [expressions](/en/guide/expressions/) to reference data from upstream nodes.

### Advanced Settings (Settings Panel)

#### Node Description

Add a description documenting what this output node returns.

## How It Works

### Data Flow

The Subflow Output node is always the **last node** in a subflow workflow. It collects data from upstream nodes and packages it for return to the caller:

```
Subflow Trigger (receives input from parent)
  → Code Node (process data)
  → Subflow Output (return results to parent)
```

### In the Parent Workflow

After the parent workflow calls this subflow via an **Execute Workflow** node, it accesses the outputs like this:

```javascript
// Parent workflow — after Execute Workflow node
$('Execute Workflow').isValid       // from child's output
$('Execute Workflow').message       // from child's output
$('Execute Workflow').processedAt   // from child's output
```

### Multiple Output Nodes

You can have multiple Subflow Output nodes in a single workflow (e.g., in different branches of a conditional). However, **Subflow Output nodes cannot be chained** — a Subflow Output node cannot have another Subflow Output node downstream.

```
Subflow Trigger
  → Conditional Branch
    → [success] → Code Node → Subflow Output (returns success data)
    → [failure] → Subflow Output (returns error data)
```

## Workflow Examples

### Example 1: Simple Validation Return

```
Subflow Trigger
  inputs:
    - orderTotal (number)
  → Code Node
    Code: |
      const total = $('Subflow Trigger').orderTotal;
      return {
        valid: total > 0 && total < 10000,
        reason: total <= 0 ? "Amount must be positive" :
                total >= 10000 ? "Amount exceeds limit" : "OK"
      };
  → Subflow Output
    outputs:
      - variable: "valid"
        value: "$('Code').valid"
      - variable: "reason"
        value: "$('Code').reason"
```

### Example 2: Data Enrichment Subflow

```
Subflow Trigger
  inputs:
    - customerId (string)
  → HTTP Request Node
    URL: "https://api.example.com/customers/{$('Subflow Trigger').customerId}"
  → Code Node
    Code: |
      const data = $('HTTP Request').body;
      return {
        name: data.name,
        tier: data.tier,
        since: data.memberSince
      };
  → Subflow Output
    outputs:
      - variable: "name"
        value: "$('Code').name"
      - variable: "tier"
        value: "$('Code').tier"
      - variable: "since"
        value: "$('Code').since"
```

### Example 3: Error-Aware Output

```
Subflow Trigger
  inputs:
    - url (string)
  → HTTP Request Node
    URL: $('Subflow Trigger').url
    On Error: Continue (using error output)
  → Conditional Branch
    Condition: $('HTTP Request').status < 400
    → [success] → Subflow Output
      outputs:
        - variable: "data"
          value: "$('HTTP Request').body"
        - variable: "success"
          value: "true"
    → [failure] → Subflow Output
      outputs:
        - variable: "error"
          value: "$('HTTP Request').error"
        - variable: "success"
          value: "false"
```

## Constraints

### No Downstream Subflow Output Nodes

A Subflow Output node **cannot** be followed by another Subflow Output node. The following is invalid:

```
# ❌ Invalid — chained Subflow Output nodes
Subflow Output → Subflow Output
```

However, parallel Subflow Output nodes in different branches are valid:

```
# ✓ Valid — parallel branches, each ending with Subflow Output
Conditional Branch
  → [branch A] → Subflow Output
  → [branch B] → Subflow Output
```

## Best Practices

### 1. Rename the Node

Double-click to rename from "Subflow Output" to something meaningful:

```
# Bad
[Subflow Output]

# Good
[Return Validation Result]
```

### 2. Use Descriptive Variable Names

```yaml
# Good — self-documenting
outputs:
  - variable: "validationStatus"
  - variable: "errorMessage"

# Bad — cryptic
outputs:
  - variable: "out1"
  - variable: "out2"
```

### 3. Always Provide Error Outputs

Even if your subflow usually succeeds, include error outputs so callers can handle failures gracefully:

```yaml
outputs:
  - variable: "success"
    value: "true"
  - variable: "data"
    value: "$('Code').result"
  - variable: "error"
    value: "''"   # empty on success, populated in error branch
```

### 4. Document the Output Contract

Use the node description to document what outputs callers can expect:

```yaml
nodeDescription: "Returns: { valid: boolean, reason: string }. 
Callers should check 'valid' before using downstream data."
```

## FAQ

### Q: How many Subflow Output nodes does a workflow need?

**A**: At least **one**. A workflow with a [Subflow Trigger](/en/guide/workflow/nodes/trigger-nodes/subflow) that has no Subflow Output node will fail — the parent workflow cannot receive any results.

### Q: Can I have multiple Subflow Output nodes?

**A**: Yes, as long as they are in **separate branches** (e.g., success and error paths). They cannot be chained sequentially.

### Q: Does the Subflow Output node process data?

**A**: No. It only packages and returns data from upstream nodes. Use [Code Node](/en/guide/workflow/nodes/action-nodes/code), [Transform Node](/en/guide/workflow/nodes/action-nodes/transform), or other action nodes to process data before the output node.

### Q: How does the parent access multiple outputs?

**A**: All output variables are available under the Execute Workflow node's name in the parent workflow:

```javascript
$('Execute Workflow').variableName
```

### Q: Can outputs use expressions?

**A**: Yes. The `value` field supports full [expression syntax](/en/guide/expressions/), so you can reference any upstream node's output.

### Q: Subflow Output vs Answer node?

**A**:

| Feature | Subflow Output | Answer |
| --- | --- | --- |
| Purpose | Return data to caller workflow | Send response to end user |
| Called by | [Subflow Trigger](/en/guide/workflow/nodes/trigger-nodes/subflow) | Chat Trigger |
| Output consumer | Another workflow | Human user |
| Multiple values | Yes, multiple named variables | Single text answer |

## Next Steps

- [Subflow Trigger](/en/guide/workflow/nodes/trigger-nodes/subflow) — Learn how to receive calls from parent workflows
- [Execute Sub-workflow](/en/guide/workflow/nodes/action-nodes/execute-sub-workflow) — Learn how to call a subflow from a parent workflow
- [Code Node](/en/guide/workflow/nodes/action-nodes/code) — Process data before sending it to the output

## Related Resources

- [Expression Syntax](/en/guide/expressions/) — Learn how to reference data in output values
- [Transform Node](/en/guide/workflow/nodes/action-nodes/transform) — Transform data with expressions
- [Conditional Branch Node](/en/guide/workflow/nodes/action-nodes/if) — Route to different output nodes based on conditions
