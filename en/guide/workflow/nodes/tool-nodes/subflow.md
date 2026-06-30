---
title: Sub-workflow Tool Node
description: Provide AI Agents with the ability to execute sub-workflows as reusable modules, called autonomously based on conversation needs
---

# Sub-workflow Tool Node

The Sub-workflow Tool node provides AI Agents with the ability to execute reusable sub-workflows as callable tools. Unlike the [Execute Sub-workflow Action node](/en/guide/workflow/nodes/action-nodes/execute-sub-workflow) which executes in a fixed workflow sequence, the Tool version is registered as a tool and called autonomously by an AI Agent when it determines that a sub-workflow's capability is needed.

> **Prerequisites**: The target sub-workflow must be **published** (active) and have a [Subflow Trigger](/en/guide/workflow/nodes/trigger-nodes/subflow) as its entry point.

## Use Cases

### Typical Applications

- **Modular AI Capabilities** — Package domain logic as sub-workflows and expose them as AI-callable tools
- **Reusable Data Pipelines** — Build data fetch + transform pipelines once, let AI Agents call them on demand
- **Multi-step Business Logic** — Encapsulate complex business processes (order validation, fraud checks) as tools
- **External System Wrappers** — Wrap multi-API orchestration into a single tool the AI can invoke
- **Shared Utilities** — Centralize common operations (formatting, enrichment, notifications) and share across AI Agents

## Tool vs Action Differences

| Feature | Execute Sub-workflow (Action) | Sub-workflow Tool |
| --- | --- | --- |
| Execution | Directly in workflow sequence | AI Agent calls on demand |
| toolName / toolDescription | ❌ Not applicable | ✅ Required tool identity |
| Wait for Sub-workflow | ✅ Toggle on/off | ❌ Always waits (synchronous, returns result) |
| retryOnFail / maxTries | ✅ Supported | ❌ Not available |
| Sub-workflow Selection | ✅ Dropdown | ✅ Dropdown (same) |
| Input Auto-population | ✅ From schema | ✅ From schema (same) |
| Category | Action node | Tool node (connects to AI Agent) |

## Node Configuration

### Basic Settings

#### Tool Name (toolName)

Unique identifier used by AI Agent to call this tool.

**Field Properties**:

- Required field
- Must be unique within the workflow
- Does not support expressions
- Format requirements:
  - Only letters, numbers, and underscores allowed
  - Must start with a letter
  - Cannot duplicate tool names of other tool nodes in the workflow
  - **Duplicate names show a red error indicator** in the UI

**Default value**: `SUBFLOW_TOOL`

**Configuration Examples**:

```javascript
// 1. Default name
toolName: "SUBFLOW_TOOL"

// 2. Descriptive tool name
toolName: "validate_order"

// 3. Domain-specific name
toolName: "customer_lookup"

// 4. Action-oriented name
toolName: "calculate_shipping_cost"
```

**Naming Recommendations**:

- Use descriptive names: `order_validator`, `customer_enrichment`, `fraud_check`
- Reflect what the sub-workflow does, not how it's implemented
- Avoid generic names like `subflow_1` or `tool_2`

#### Tool Description (toolDescription)

Describes the tool's functionality and use cases. The parent AI Agent uses this description to decide when to call the sub-workflow.

**Field Properties**:

- Required field
- Supports expressions
- Supports multi-line text

**Configuration Examples**:

```javascript
// 1. Validation tool
toolDescription: `Validate order data before processing.

Input expected:
- orderId (string): Order identifier
- orderTotal (number): Order total amount
- customerId (string): Customer identifier

Returns:
- isValid (boolean): Whether order passes validation
- errors (string array): Validation error messages if any

Call when: User submits an order that needs validation before proceeding.`

// 2. Data lookup tool
toolDescription: `Look up complete customer profile across all systems.

Input expected:
- customerId (string): Customer identifier

Returns:
- profile (object): Full customer profile with orders, support tickets, preferences

Call when: You need a complete view of a customer before answering their question.`

// 3. Multi-step process tool
toolDescription: `Calculate shipping options and costs.

Input expected:
- items (array): List of items with productId and quantity
- destination (string): Shipping address postal code

Returns:
- options (array): Available shipping methods with costs and ETA
- recommended (object): Recommended shipping option

Call when: User wants to know shipping costs or delivery time for their order.`
```

**Best Practices**:

- **Describe inputs clearly**: What the AI Agent should pass to the sub-workflow
- **Describe outputs**: What the AI Agent will receive back
- **Clarify when to call**: Help the AI Agent decide when this tool is appropriate
- **Distinguish from similar tools**: If you have multiple sub-workflow tools, make their scopes non-overlapping

#### Select Sub-workflow (subflowId)

Choose which sub-workflow to call from the dropdown. Only **active, published workflows** that include a [Subflow Trigger](/en/guide/workflow/nodes/trigger-nodes/subflow) appear in the list.

**Before selection**: All other settings (except toolName and toolDescription) are hidden.
**After selection**: Input fields are automatically populated based on the sub-workflow's defined input schema.

> The node always calls the **latest active version** of the selected sub-workflow. If the sub-workflow's trigger is later changed (e.g., replaced with a Webhook Trigger), the node will error at runtime because the sub-workflow is no longer callable.

#### Input Parameters (inputs)

After selecting a sub-workflow, its expected input parameters are automatically read and displayed. Each input is a key-value pair:

| Field | Description |
| --- | --- |
| **Variable** | The input name as defined in the sub-workflow |
| **Value** | The value to pass — supports [expressions](/en/guide/expressions/) |

**Supported input types**:
- `text` — String values
- `number` — Numeric values
- `array` — List/array values
- `object` — JSON objects
- `boolean` — `true` / `false`
- `datetime` — Date and time values

**Passing data from the AI Agent**:

When called by an AI Agent, the agent extracts parameter values from the conversation context and passes them to the sub-workflow. You can also use expressions to pass data from upstream nodes:

```javascript
// Reference upstream node output
$('Chat Trigger').body.userId

// Pass a literal value
"active"

// Pass a number
42
```

**Required inputs**: If the sub-workflow defines required inputs, the AI Agent must be able to extract them from the conversation or they must be pre-configured via expressions.

### Advanced Settings

#### On Error (onError)

How to handle sub-workflow execution failures.

**Available Values**:

- `stopWorkflow` — Stop the entire workflow (default)
- `continueRegularOutput` — Continue with regular output
- `continueErrorOutput` — Continue and output error

#### Node Description (nodeDescription)

Add a custom description to document the tool's purpose:

```yaml
nodeDescription: "Validates incoming orders. Returns { isValid: boolean, errors: string[] }."
```

## Output Data

The Sub-workflow Tool always waits for the sub-workflow to complete and returns its output to the calling AI Agent. The output structure is defined by the [Subflow Output](/en/guide/workflow/nodes/action-nodes/output) node(s) in the called sub-workflow.

```javascript
// Parent AI Agent receives sub-workflow output
$("Sub-workflow Tool").isValid
$("Sub-workflow Tool").customerProfile
$("Sub-workflow Tool").shippingOptions
```

:::warning Note
Unlike the Action version, the Sub-workflow Tool does **not** have a "Wait for Sub-workflow" toggle. It always executes synchronously — the sub-workflow runs to completion and the result is returned to the AI Agent.
:::

## How It Works

### Execution Flow

```
Parent Workflow:
  Chat Trigger
    → AI Agent Node
        Tools: [Sub-workflow Tool (Order Validator)]
    → Answer Node

AI Conversation:
  User: "Can you validate order #ORD-500?"
  AI Agent:
    1. Recognizes validation need
    2. Calls Sub-workflow Tool with { orderId: "ORD-500" }
    3. Sub-workflow executes:
         Subflow Trigger ← receives inputs
           → Processing Nodes
           → Subflow Output ← packages results
    4. Receives { isValid: true, errors: [] }
    5. Replies: "Order #ORD-500 has been validated and is ready to process."
```

### Version Selection

The node always calls the **latest active (published) version** of the selected sub-workflow. If the sub-workflow is unpublished or its trigger type is changed away from Subflow Trigger, the node will error with "Subflow not found" at runtime.

## Workflow Examples

### Example 1: Order Validation Tool

```
Chat Trigger
  → AI Agent Node
    System Prompt: "You are an order processing assistant. Validate orders before confirming them."
    User Prompt: $('Chat Trigger').message

    Tools:
      └─ Sub-workflow Tool (Order Validator)
           toolName: "validate_order"
           toolDescription: "Validate order data. Input: orderId, orderTotal, customerId. Returns: isValid, errors."
           Sub-workflow: "Order Validator" (published)
           Inputs:
             orderId: (AI extracts from conversation)
             orderTotal: (AI extracts from conversation)
             customerId: $('Chat Trigger').customerId

  → Answer Node

User: "Can you process order #ORD-500, total $299?"
AI Agent:
  1. Calls validate_order(orderId="ORD-500", orderTotal=299, customerId="C12345")
  2. Sub-workflow returns: { isValid: true, errors: [] }
  3. Replies: "Order #ORD-500 is valid. Proceeding with processing."
```

### Example 2: Customer Data Enrichment

```
Chat Trigger
  → AI Agent Node
    System Prompt: "You are a customer service agent. Look up customer data before answering questions."
    User Prompt: $('Chat Trigger').message

    Tools:
      └─ Sub-workflow Tool (Customer Lookup)
           toolName: "customer_lookup"
           toolDescription: "Fetch complete customer profile from all systems. Input: customerId. Returns: profile with orders, tickets, preferences."
           Sub-workflow: "Customer Enrichment" (published)
           Inputs:
             customerId: $('Chat Trigger').customerId

  → Answer Node

User: "What's the status of my recent orders?"
AI Agent:
  1. Calls customer_lookup(customerId="C12345")
  2. Receives profile with 5 recent orders and 2 support tickets
  3. Replies with personalized summary of all order statuses
```

### Example 3: Multi-Tool AI Agent with Sub-workflow

```
Chat Trigger
  → AI Agent Node
    System Prompt: "You are an e-commerce assistant. Use available tools to help customers."
    User Prompt: $('Chat Trigger').message

    Tools:
      ├─ Sub-workflow Tool (Shipping Calculator)
      │    toolName: "calculate_shipping"
      │    toolDescription: "Calculate shipping options and costs. Input: items, destination. Returns: shipping options with costs."
      │
      ├─ Sub-workflow Tool (Order Validator)
      │    toolName: "validate_order"
      │    toolDescription: "Validate order before processing. Input: orderId, orderTotal, customerId. Returns: isValid, errors."
      │
      └─ HTTP Request Tool (Payment API)
           toolName: "process_payment"
           toolDescription: "Process payment for an order. Input: orderId, amount. Returns: transactionId, status."

  → Answer Node

User: "I want to order [item1, item2] shipped to 90210"
AI Agent:
  1. Calls calculate_shipping(items=[item1, item2], destination="90210")
  2. Presents shipping options to user
  3. User: "Standard shipping is fine"
  4. Calls validate_order(orderTotal=149, ...)
  5. Calls process_payment(orderId="ORD-600", amount=149)
  6. Confirms order placed
```

### Example 4: Complex Business Process as Tool

```
Sub-workflow "Fraud Check" (published):
  Subflow Trigger
    → HTTP Request (Risk Scoring API)
    → HTTP Request (Order History API)
    → Code Node (Calculate Risk Score)
    → Subflow Output { score, flags, recommendation }

Parent Workflow:
  Chat Trigger
    → AI Agent Node
      System Prompt: "You are an order processing agent. Run fraud checks on high-value orders."
      User Prompt: $('Chat Trigger').message

      Tools:
        └─ Sub-workflow Tool (Fraud Check)
             toolName: "fraud_check"
             toolDescription: "Run comprehensive fraud analysis. Input: orderId, customerId, orderTotal. Returns: score (0-100), flags, recommendation (approve/review/reject)."
             Sub-workflow: "Fraud Check"
             Inputs:
               orderId: (AI extracts)
               customerId: (AI extracts)
               orderTotal: (AI extracts)

    → Answer Node

User: "Process order #ORD-999, $5,000"
AI Agent: "High-value order — running fraud check first."
  → Calls fraud_check → Returns { score: 12, flags: [], recommendation: "approve" }
  → "Fraud check passed. Proceeding with your order."
```

## Best Practices

### 1. Name Tools Descriptively

Match the tool name to the sub-workflow's purpose:

```javascript
// Good
toolName: "order_validator"
toolName: "customer_enrichment"
toolName: "fraud_check"

// Bad
toolName: "SUBFLOW_TOOL"  // Too generic
toolName: "tool_1"         // Not descriptive
```

### 2. Write Detailed Tool Descriptions

The tool description is the AI Agent's only guide for when to call this sub-workflow:

```javascript
toolDescription: `Validate incoming orders against business rules.

Checks performed:
- Customer account status (active, verified)
- Order total within credit limit
- No duplicate orders within 5 minutes
- All items in stock

Input from AI Agent:
- orderId (string): Order to validate
- orderTotal (number): Expected order total
- customerId (string): Customer to check

Returns:
- isValid (boolean): Pass/fail result
- errors (string[]): List of issues if invalid
- warnings (string[]): Non-blocking concerns

Call when:
- User wants to place or confirm an order
- User asks "is my order valid"
- High-value orders (over $500)

Do NOT call when:
- User is just browsing products
- User is asking about past orders (use customer_lookup instead)`
```

### 3. Test Sub-workflows Independently

Before registering a sub-workflow as a tool, test it independently using its own Subflow Trigger:

1. Create the sub-workflow with Subflow Trigger
2. Publish the sub-workflow
3. Test with manual inputs via its trigger
4. Verify the Subflow Output matches expectations
5. Then register it as a tool in a parent AI Agent workflow

### 4. Keep Sub-workflows Focused

Each sub-workflow tool should do one thing well:

```yaml
✅ Good: "Order Validator" — validates, returns pass/fail + errors
✅ Good: "Shipping Calculator" — calculates shipping options and costs
✅ Good: "Customer Lookup" — fetches customer profile

❌ Bad: "Order Processor" — validates, calculates shipping, processes payment, sends email
```

### 5. Handle Errors Gracefully

Configure the **On Error** setting appropriately and instruct the AI Agent how to handle failures:

```javascript
// AI Agent System Prompt
systemPrompt: `When a sub-workflow tool returns an error:
1. Do not expose raw error messages to the user
2. Try alternative tools if available
3. If the sub-workflow cannot complete, explain what information is still needed
4. Offer to escalate to human support for complex issues`
```

### 6. Document the Output Contract

Use the node description to document what the sub-workflow returns:

```yaml
nodeDescription: "Returns { isValid: boolean, errors: string[], warnings: string[] }.
Check `isValid` before confirming order. `warnings` are non-blocking."
```

## FAQ

### Q1: What's the difference between Sub-workflow Tool and Execute Sub-workflow?

**A**:

| Scenario | Use |
| --- | --- |
| Fixed workflow sequence | Execute Sub-workflow (Action) |
| AI Agent decides when to call | Sub-workflow Tool |
| Need fire-and-forget (async) | Execute Sub-workflow (Action) with Wait off |
| Always need the result | Either (Tool always waits) |
| Need retry on failure | Execute Sub-workflow (Action) |

### Q2: Can the AI Agent call the sub-workflow multiple times?

**A**: Yes. The AI Agent can call the same Sub-workflow Tool multiple times within a single conversation, potentially with different inputs each time. The `maxIterations` setting on the AI Agent node controls the total number of tool call rounds.

### Q3: How does the AI Agent know what inputs to pass?

**A**: The AI Agent extracts parameter values from:

1. **Tool description** — Defines what inputs the sub-workflow expects
2. **Conversation context** — The user's message and conversation history
3. **Input variable names** — Self-explanatory names help the AI map values
4. **Pre-configured values** — Expressions like `$('Chat Trigger').customerId` are automatically passed

If a required input cannot be determined, the AI Agent will typically ask the user for clarification.

### Q4: Can a sub-workflow called as a tool contain AI Agent nodes?

**A**: Yes. Sub-workflows can contain any nodes, including AI Agent nodes. This enables complex multi-level agent architectures. However, be mindful of execution time and cost — each level adds latency and potential credit consumption.

### Q5: Why doesn't the Tool version have a "Wait" toggle?

**A**: As a tool called by an AI Agent, the sub-workflow must return a result for the agent to use. Fire-and-forget execution is not meaningful in a tool context — the agent needs the output to continue reasoning. Use the Execute Sub-workflow Action node if you need asynchronous execution.

### Q6: What happens if the sub-workflow is unpublished?

**A**: The node will error at runtime with "Subflow not found". The error is handled according to the **On Error** setting. Always ensure your sub-workflows remain published while they are referenced by any Tool or Action nodes.

### Q7: Can I pass data from upstream nodes to the sub-workflow?

**A**: Yes. Use expressions in the input value fields:

```javascript
// Pass data from upstream nodes
$('HTTP Request').body.data
$('Code').processedResult

// Pass trigger context
$('Chat Trigger').customerId
$('Chat Trigger').sessionId

// Combination of AI-extracted and pre-configured
// AI extracts productId from conversation
// customerId is pre-configured from trigger
```

## Next Steps

- [Execute Sub-workflow Action Node](/en/guide/workflow/nodes/action-nodes/execute-sub-workflow) — Learn about the Action version
- [Subflow Trigger](/en/guide/workflow/nodes/trigger-nodes/subflow) — Learn how to create a callable sub-workflow
- [Subflow Output](/en/guide/workflow/nodes/action-nodes/output) — Learn how sub-workflows return results
- [AI Agent Tool Node](/en/guide/workflow/nodes/tool-nodes/ai-agent) — Delegate tasks to specialized sub-agents
- [Think Tool Node](/en/guide/workflow/nodes/tool-nodes/think) — Add structured reasoning for AI Agents

## Related Resources

- [AI Agent Node](/en/guide/workflow/nodes/action-nodes/ai-agent) — Learn AI Agent configuration
- [Code Tool Node](/en/guide/workflow/nodes/tool-nodes/code) — Add custom code tools
- [HTTP Request Tool Node](/en/guide/workflow/nodes/tool-nodes/http-request) — Provide API access
