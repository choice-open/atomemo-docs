---
title: Subflow Trigger
description: Trigger workflow execution when invoked by another workflow, enabling modular workflow orchestration
---

# Subflow Trigger

The Subflow Trigger (When Executed by Another Workflow) allows a workflow to be called as a reusable module from other workflows. This enables you to break down complex logic into reusable components — a "parent" workflow invokes the "child" workflow and passes in data, and the child processes it and returns results.

## Use Cases

### Typical Applications
- **Workflow Orchestration** - Chain multiple workflows together into a larger process
- **Reusable Logic** - Extract shared logic (e.g., data validation, notification) into a callable module
- **Modular Architecture** - Build complex systems by composing smaller, focused workflows
- **Separation of Concerns** - Keep distinct business domains in separate workflows
- **Cross-Team Collaboration** - Teams build and maintain independent workflows that call each other
- **Conditional Sub-processing** - Route specific tasks to specialized child workflows

## Node Features

### Basic Characteristics
- **Called by Other Workflows** - Triggered when another workflow invokes it
- **Unique Per Workflow** - Only one Subflow Trigger allowed per workflow (`maxNodes: 1`)
- **Input Definition** - Define what data the parent workflow can send in
- **Parent Workflow List** - See which workflows call this one directly in the editor
- **Paired with Subflow Output** - Requires at least one Subflow Output node to return results

### Built-in Output Fields

Access input data from the parent workflow via the node name and variable names:

```javascript
$('Subflow Trigger').variableName    // Access an input variable
$('Subflow Trigger').customerId      // Example: customer ID from parent
$('Subflow Trigger').orderData       // Example: order data from parent
```

## Node Configuration

### Basic Settings (Parameters Panel)

#### Parent Workflow List

A read-only section at the top of the parameters panel showing which workflows call this one:

> *"This workflow is called by the following workflows:"*
> `[Order Processing]` `[Invoice Generation]`

This provides visibility into how your workflow is used across the project.

#### Input Data Mode

Choose how to define the data structure this workflow expects from parent workflows:

**Define Fields Below** (`inputSchema`, default):

Manually define named input variables with specific types:

```yaml
inputSource: "inputSchema"
inputs:
  - variable: "customerName"
    type: "string"
  - variable: "orderTotal"
    type: "number"
  - variable: "isPriority"
    type: "boolean"
```

Each input has:
- **Variable** — name used to access the value in expressions (e.g., `customerName`)
- **Type** — data type (see below)

**JSON Example** (`jsonExample`):

Provide a sample JSON object. The system infers the input structure from it:

```json
{
  "customerName": "Jane Doe",
  "orderTotal": 149.99,
  "isPriority": true,
  "items": ["item1", "item2"]
}
```

This is useful for quick prototyping — paste a realistic example and the workflow will accept matching data.

> **Tip**: Use **Define Fields Below** for production workflows — it provides explicit documentation and type safety for callers.

#### Input Types

When using the **Define Fields Below** mode, the following types are available:

| Type | UI Label | Description |
| --- | --- | --- |
| `string` | String | Text value |
| `number` | Number | Numeric value |
| `boolean` | Boolean | True / false |
| `object` | Object | JSON object `{}` |
| `array[string]` | Array[String] | Array of text values |
| `array[number]` | Array[Number] | Array of numeric values |
| `array[boolean]` | Array[Boolean] | Array of boolean values |
| `array[object]` | Array[Object] | Array of JSON objects |

> **Note**: Input variable names must be unique. Duplicates are not allowed.

### Advanced Settings (Settings Panel)

#### Node Description

Add a description to document what this subflow does and when to call it.

## Required: Subflow Output Node

A workflow with a Subflow Trigger **must include at least one Subflow Output node** to return results to the parent workflow. Without it, the parent workflow cannot receive the child's output.

```
Subflow Trigger
  → [processing nodes...]
  → Subflow Output Node
    outputs:
      - variable: "result"
        type: "string"
```

The Subflow Output node defines what data is sent back to the calling workflow. The parent can access it via the **Execute Workflow** node's output.

## Data Flow

### Parent → Child (Input)

The parent workflow passes data when invoking the child:

```
Parent Workflow:
  Execute Workflow Node
    Workflow: "Order Validator"
    Input:
      customerName: "Jane Doe"
      orderTotal: 149.99
```

The child receives it:

```javascript
// Inside child workflow
$('Subflow Trigger').customerName  // "Jane Doe"
$('Subflow Trigger').orderTotal    // 149.99
```

### Child → Parent (Output)

The child returns data via the Subflow Output node:

```javascript
// Child workflow's Subflow Output node defines:
outputs:
  - variable: "isValid"
    type: "boolean"
  - variable: "message"
    type: "string"
```

The parent accesses it:

```javascript
// Inside parent workflow, after Execute Workflow node
$('Execute Workflow').isValid   // true
$('Execute Workflow').message   // "Order validated successfully"
```

## Testing

### Dry Run

Use the **Run** button on the Subflow Trigger to do a dry run:

1. Click **Run** on the Subflow Trigger node
2. Enter test input data matching your defined schema
3. The workflow executes and shows results

This lets you verify the subflow logic independently before other workflows call it.

## Workflow Examples

### Example 1: Order Validation Subflow

```
Subflow Trigger
  Inputs:
    - orderTotal (number)
    - customerTier (string)
  → Code Node
    Code: |
      const total = $('Subflow Trigger').orderTotal;
      const tier = $('Subflow Trigger').customerTier;
      const maxByTier = { "basic": 1000, "premium": 5000, "vip": 10000 };
      return {
        isValid: total <= (maxByTier[tier] ?? 500),
        limit: maxByTier[tier] ?? 500
      };
  → Subflow Output
    outputs:
      - isValid (boolean)
      - limit (number)
```

### Example 2: Notification Dispatcher

```
Subflow Trigger
  Inputs:
    - recipient (string)
    - message (string)
    - channel (string)
  → Conditional Branch
    Condition: $('Subflow Trigger').channel === "email"
    → [email] → HTTP Request Node (send email)
    → [slack] → HTTP Request Node (send Slack message)
    → [sms]   → HTTP Request Node (send SMS)
  → Subflow Output
    outputs:
      - status (string)
      - sentAt (string)
```

### Example 3: Multi-Stage Pipeline

```
Parent Workflow:
  Webhook Trigger
    → Execute Workflow (Stage 1: Validate)
    → Conditional Branch
      Condition: $('Execute Workflow').isValid === true
      → Execute Workflow (Stage 2: Process)
      → Execute Workflow (Stage 3: Notify)
```

## Best Practices

### 1. Rename the Node

Double-click to rename from "When Executed by Another Workflow" to something descriptive:

```
# Bad
[When Executed by Another Workflow]

# Good
[Order Validator]
```

### 2. Use Define Fields Below for Production

```yaml
# Production — explicit schema with types
inputSource: "inputSchema"
inputs:
  - variable: "customerId"
    type: "string"
  - variable: "orderAmount"
    type: "number"
```

JSON Example mode is useful for quick prototyping but less self-documenting for teams.

### 3. Always Include a Subflow Output

Every Subflow Trigger workflow must have at least one Subflow Output node. Otherwise the parent has no way to receive results.

### 4. Keep Subflows Focused

Each subflow should do one thing well:
- **Good**: "Order Validator", "Invoice Generator", "Notification Dispatcher"
- **Bad**: "Order Processing + Invoice + Notification + Cleanup"

### 5. Document the Contract

Use the node description to document what inputs are expected and what outputs are returned. This helps other team members know how to call your subflow.

## FAQ

### Q: How many Subflow Triggers can a workflow have?

**A**: Only **one** per workflow (`maxNodes: 1`). A workflow designed as a subflow cannot also be a standalone trigger-based workflow.

### Q: Can a subflow call another subflow?

**A**: Yes. A child workflow can itself contain an Execute Workflow node that calls another subflow, enabling multi-level orchestration. Avoid circular calls though — Workflow A calling Workflow B which calls Workflow A will cause infinite recursion.

### Q: How does the parent workflow call this subflow?

**A**: Use the **Execute Workflow** node (available in the action nodes palette) to select this workflow and pass input data.

### Q: What happens if the parent sends data that doesn't match the defined schema?

**A**: When using **Define Fields Below**, extra fields from the parent are ignored, and missing fields are `undefined`. Always validate critical inputs in the child workflow.

### Q: Can I see who calls my subflow?

**A**: Yes. The **Parent Workflow List** at the top of the parameters panel shows all workflows that reference this one.

### Q: Subflow Trigger vs Manual Trigger for modular logic?

**A**:

| Feature | Subflow Trigger | Manual Trigger |
| --- | --- | --- |
| Called by | Other workflows (Execute Workflow node) | Human click or API |
| Input | Typed schema or JSON example | Free-form via API |
| Output | Subflow Output node | Last node output |
| Use case | Reusable modules, orchestration | Testing, on-demand tasks |

## Next Steps

- [Subflow Output](/en/guide/workflow/nodes/action-nodes/output) - Learn how to return results from a subflow
- [Execute Workflow](/en/guide/workflow/execute-workflow) - Learn how to call a subflow from a parent workflow
- [Code Node](/en/guide/workflow/nodes/action-nodes/code) - Add custom processing logic in your subflow

## Related Resources

- [Webhook Trigger](/en/guide/workflow/nodes/trigger-nodes/webhook) - Trigger workflows via HTTP
- [HTTP Request Node](/en/guide/workflow/nodes/action-nodes/http-request) - Call external APIs from subflows
- [Conditional Branch Node](/en/guide/workflow/nodes/action-nodes/if) - Add conditional logic
