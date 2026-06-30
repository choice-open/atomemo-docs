---
title: AI Agent Tool Node
description: Provide callable AI Agent capabilities that enable parent AI Agents to delegate tasks to specialized sub-agents
---

# AI Agent Tool Node

The AI Agent Tool node provides AI Agent capabilities as a callable tool. Unlike the [AI Agent Action node](/en/guide/workflow/nodes/action-nodes/ai-agent) which serves as the main agent in a workflow, the Tool version is registered as a tool and called autonomously by a parent AI Agent to handle specific subtasks. This enables multi-agent collaboration and complex task decomposition.

## Core Concepts

### What is an AI Agent Tool?

An AI Agent Tool is a specialized sub-agent that:

- **Task Delegation** — Parent AI Agent delegates specific subtasks to it
- **Autonomous Execution** — Independently reasons, calls its own tools, and completes assigned tasks
- **Result Return** — Returns execution results to the parent AI Agent for synthesis
- **Nested Capability** — Can register its own sub-tools, enabling deep agent hierarchies

### Multi-Agent Collaboration Pattern

```
User Input → Parent AI Agent (Router / Orchestrator)
  ├─ Analyzes task, decides which sub-agents to call
  ├─ Sub-Agent 1 (Data Fetching Expert)
  │   └─ Calls: HTTP Request Tool, Code Tool
  ├─ Sub-Agent 2 (Analysis Expert)
  │   └─ Calls: Code Tool, Knowledge Retrieval Tool
  └─ Parent synthesizes all results → Final answer
```

## Use Cases

### Typical Applications

- **Multi-Source Data Aggregation** — Sub-agents fetch data from different platforms, parent agent consolidates
- **Complex Task Decomposition** — Break large tasks into specialized sub-tasks handled by dedicated agents
- **Domain-Specific Experts** — Route to sales expert, tech expert, or account expert sub-agents
- **Cross-System Orchestration** — Each sub-agent handles integration with a specific external system
- **Quality Assurance Pipelines** — One agent generates, another reviews, a third refines

## Tool vs Action Differences

| Feature | AI Agent Action | AI Agent Tool |
| --- | --- | --- |
| Role | Main agent in workflow | Sub-agent called as a tool |
| Execution | Directly in workflow sequence | Called on demand by parent AI Agent |
| Stream Output | Supported | Not supported (must return complete result) |
| Structured Output | Supported via JSON Schema | Not supported (tool returns unified result) |
| Tool Connections | Connects to Tool nodes | Can also connect to its own Tool nodes |
| Model Selection | Explicit model selection | Explicit selection or Auto mode (credit-based) |
| Prompt Authoring | Manual input | Manual input or AI-assisted ("Let the model define this parameter") |

## Node Configuration

### Basic Settings

#### Tool Name (toolName)

Unique identifier used by the parent AI Agent to call this tool.

**Field Properties**:

- Required field
- Must be unique within the workflow
- Does not support expressions
- Format requirements:
  - Only letters, numbers, and underscores allowed
  - Must start with a letter
  - Cannot duplicate tool names of other tool nodes in the workflow
  - **Duplicate names show a red error indicator** in the UI

**Default value**: `AI_AGENT_TOOL`

**Configuration Examples**:

```javascript
// 1. Default name
toolName: "AI_AGENT_TOOL"

// 2. Descriptive tool name
toolName: "sales_expert_agent"

// 3. Domain-specific name
toolName: "data_fetching_subagent"

// 4. Role-based name
toolName: "order_processing_agent"
```

**Naming Recommendations**:

- **Use UPPER_SNAKE_CASE or lower_snake_case**: `AI_AGENT_TOOL` or `sales_expert`
- **Self-explanatory**: Name should clearly express the sub-agent's role
- **Avoid too long**: Recommended within 30 characters
- **Avoid hyphens**: Only letters, numbers, and underscores are allowed

**Important Note**:

- Parent AI Agent identifies and calls tools by tool name, not node name
- Tool name must be unique in the workflow; duplicates trigger a red error in the UI

#### Tool Description (toolDescription)

Describes the tool's purpose and scope of responsibility. The parent AI Agent uses this description to decide when to delegate tasks to this sub-agent.

**Field Properties**:

- Required field
- Supports expressions
- Supports multi-line text

**Configuration Examples**:

```javascript
// 1. Clear role definition
toolDescription: `Sales expertise sub-agent.

Responsibilities:
- Handle product inquiries and recommendations
- Calculate pricing and discounts
- Check inventory availability
- Process order-related questions

When to call:
- User asks about products, pricing, or orders
- User wants product comparisons or recommendations
- User needs help with purchase decisions`

// 2. Data aggregation agent
toolDescription: `Multi-platform data aggregation agent.

Responsibilities:
- Fetch customer data from CRM system
- Retrieve order history from e-commerce platform
- Query support tickets from helpdesk

Input from parent agent:
- customer_id: Customer identifier
- data_requirements: What data to fetch

Returns consolidated customer profile with all gathered data.`

// 3. Content review agent
toolDescription: `Content quality review sub-agent.

Responsibilities:
- Review generated content for accuracy
- Check tone and brand alignment
- Flag potential issues or improvements

Call when:
- AI-generated content needs quality check before sending to user
- Draft responses need polishing`
```

**Best Practices**:

- **Define clear boundaries**: What this sub-agent handles vs. what the parent should handle
- **List input expectations**: What information the parent agent should provide
- **Describe output**: What kind of result this sub-agent returns
- **Usage guidance**: When the parent agent should (and should not) call this tool

#### Model (model)

Select the LLM model for this sub-agent, or use Auto mode.

**Connection Method**:

- **Connect a Model node**: Explicitly select a specific model by connecting a Model node to the AI Agent Tool
- **Auto mode (default)**: If no Model node is connected, the system automatically selects an appropriate model

**Auto Mode Behavior**:

- Credits are deducted from the organization's balance at runtime
- If the organization runs out of credits, the tool call fails with the error:

```
"Your token quota has been exceeded. Please contact support to increase
your quota or wait for your quota to reset at the start of the next
billing cycle"
```

**Model Selection Tips**:

```yaml
Complex reasoning tasks: GPT-4, Claude 3 Opus
Balanced performance: GPT-3.5-turbo, Claude 3 Sonnet
Cost-sensitive simple tasks: GPT-3.5-turbo, Claude 3 Haiku
```

#### User Prompt (userPrompt)

The task or input passed to this sub-agent by the parent AI Agent (required).

**Field Properties**:

- Required field
- Supports expressions
- Supports multi-line text
- **AI-Assisted Authoring**: Click "Let the model define this parameter" to have AI auto-generate the prompt

**Configuration Examples**:

```javascript
// 1. Receive task from parent agent
userPrompt: $("Parent Agent").delegatedTask

// 2. With context from parent
userPrompt: `Customer query: ${$("Parent Agent").customerQuery}

Customer data collected so far:
- ID: ${$("Parent Agent").customerId}
- Segment: ${$("Parent Agent").customerSegment}

Please analyze and provide recommendations.`

// 3. AI-defined prompt (via "Let the model define this parameter" button)
userPrompt: "You are a sales expert. Analyze the customer's needs and recommend suitable products from the available catalog."
```

#### System Prompt (systemPrompt)

Define the sub-agent's role, capabilities, constraints, and behavioral guidelines.

**Field Properties**:

- Optional field
- Supports expressions
- Supports multi-line text
- **AI-Assisted Authoring**: Click "Let the model define this parameter" to have AI auto-generate the system prompt

**Configuration Examples**:

```javascript
// 1. Sales expert
systemPrompt: `You are a sales specialist sub-agent.

Your role:
- Analyze customer purchase intent
- Recommend products matching their needs
- Calculate pricing and applicable discounts
- Compare products objectively

Your constraints:
- Only recommend in-stock products
- Stay within the customer's stated budget
- Do not make promises the company cannot keep
- Flag complex cases for human review

Response format:
- Product recommendations with rationale
- Pricing breakdown
- Next steps suggestion`

// 2. Data aggregation agent
systemPrompt: `You are a data aggregation sub-agent.

Your role:
- Receive data requirements from the parent agent
- Call appropriate data source tools
- Consolidate results into a unified format
- Flag any data inconsistencies or gaps

Your constraints:
- Only access data you have permission to retrieve
- Do not modify any source data
- Report errors transparently to the parent agent
- Timeout after ${maxIterations} tool call rounds`
```

#### Max Iterations (maxIterations)

Maximum number of tool call rounds this sub-agent can perform.

**Field Properties**:

- Number type
- Default value: `3`

**Configuration Suggestions**:

```yaml
Simple subtasks: 2-3 iterations
Medium complexity: 5-8 iterations
Complex multi-tool tasks: 10-15 iterations
```

### Connecting Sub-Tool Nodes

AI Agent Tool nodes support **nested tool connections** — just like the main AI Agent Action node, they can connect to their own Tool nodes:

```
Parent AI Agent
  └─ AI Agent Tool (Data Expert)
       ├─ HTTP Request Tool (CRM API)
       ├─ HTTP Request Tool (E-commerce API)
       └─ Code Tool (Data Transform)
```

**Connection Rules**:

1. AI Agent Tool node has a "Tool" port at the bottom
2. Connect to any Tool node (Code Tool, HTTP Request Tool, Entity Recognition Tool, etc.)
3. Can also connect to **other AI Agent Tool nodes** (deep nesting, use with caution)
4. The sub-agent autonomously decides which of its tools to call

### Advanced Settings

#### Always Output (alwaysOutput)

Whether to output an empty item on execution failure.

**Default**: `false`

#### Execute Once (executeOnce)

Whether to execute only once with the first input item.

**Default**: `false`

#### Retry on Fail (retryOnFail)

Whether to automatically retry on execution failure.

**Default**: `false`

#### Max Tries (maxTries)

Maximum number of retries after failure.

**Default**: `3`

#### Wait Between Tries (waitBetweenTries)

Wait time between retries (milliseconds).

**Default**: `1000` (1 second)

#### On Error (onError)

How to handle execution failures.

**Available Values**:

- `stopWorkflow` — Stop the entire workflow (default)
- `continueRegularOutput` — Continue with regular output
- `continueErrorOutput` — Continue and output error

## Output Data

The AI Agent Tool returns its final answer as a unified output to the parent AI Agent:

```javascript
// Parent Agent accesses sub-agent output
$("AI Agent Tool").output
$("AI Agent Tool").answer

// Execution metadata (if available)
$("AI Agent Tool").toolsUsed   // List of tools the sub-agent used
$("AI Agent Tool").iterations  // Number of iterations the sub-agent executed
```

:::warning Note
Unlike the AI Agent Action node, the Tool version does **not** support streaming output or structured JSON output. As a tool, it must return a complete result that the parent agent can consume directly.
:::

## Workflow Examples

### Example 1: Multi-Source Data Aggregation

```
Chat Trigger
  → AI Agent Node (Main Orchestrator)
    System Prompt: "You are a customer service orchestrator. Gather data from multiple sources and provide comprehensive answers."
    User Prompt: $('Chat Trigger').message
    Max Iterations: 3

    Tools:
      └─ AI Agent Tool (Data Aggregator)
           toolName: "data_aggregator"
           toolDescription: "Fetch and consolidate customer data from CRM, orders, and support systems. Input: customer_id. Returns consolidated profile."
           User Prompt: "Fetch all available data for customer: ${$('Parent Agent').customerId}"
           System Prompt: "You are a data aggregation specialist. Query all available data sources and consolidate into a single profile."

           Sub-Tools:
             ├─ HTTP Request Tool → CRM API
             ├─ HTTP Request Tool → Order History API
             └─ HTTP Request Tool → Support Tickets API

  → Answer Node

User: "Tell me everything about customer #C12345"
Parent Agent: Delegates to data_aggregator
Sub-Agent:
  1. Calls CRM API → Gets customer profile
  2. Calls Order History API → Gets 15 orders
  3. Calls Support Tickets API → Gets 3 tickets
  4. Returns consolidated profile
Parent Agent: Synthesizes into natural language response
```

### Example 2: Domain Expert Routing

```
Chat Trigger
  → AI Agent Node (Router)
    System Prompt: "You are a routing agent. Classify the user's request and delegate to the appropriate expert sub-agent."
    User Prompt: $('Chat Trigger').message
    Max Iterations: 1

    Tools:
      ├─ AI Agent Tool (Sales Expert)
      │    toolName: "sales_expert"
      │    toolDescription: "Handle product inquiries, pricing, recommendations, and purchase decisions."
      │    System Prompt: "You are a sales specialist. Help customers find the right products."
      │    User Prompt: $('Router').delegatedTask
      │
      └─ AI Agent Tool (Tech Support Expert)
           toolName: "tech_support_expert"
           toolDescription: "Handle technical issues, troubleshooting, and setup guidance."
           System Prompt: "You are a technical support specialist."
           User Prompt: $('Router').delegatedTask
           Sub-Tools:
             ├─ HTTP Request Tool → Knowledge Base API
             └─ HTTP Request Tool → Ticket System API

  → Answer Node

User: "My app keeps crashing when I try to export reports"
Router: Classifies as tech support → Delegates to tech_support_expert
Tech Support Expert:
  1. Calls Knowledge Base API → Finds related articles
  2. Diagnoses issue
  3. Returns solution steps
Router: Returns formatted answer to user
```

### Example 3: Content Generation + Review Pipeline

```
Chat Trigger
  → AI Agent Node (Content Orchestrator)
    System Prompt: "You are a content manager. Generate content and pass it through quality review."
    User Prompt: $('Chat Trigger').message

    Tools:
      ├─ AI Agent Tool (Content Writer)
      │    toolName: "content_writer"
      │    toolDescription: "Draft content based on requirements. Input: topic, tone, length requirements."
      │    System Prompt: "You are a professional content writer. Create engaging, accurate content."
      │    User Prompt: "Write content about: ${$('Content Orchestrator').topic}"
      │
      └─ AI Agent Tool (Content Reviewer)
           toolName: "content_reviewer"
           toolDescription: "Review content for accuracy, tone, and brand alignment. Input: draft_content. Returns reviewed content with suggestions."
           System Prompt: "You are a content reviewer. Check for accuracy, brand alignment, and readability. Return the reviewed content with any necessary corrections."
           User Prompt: "Review this draft: ${$('content_writer').output}"

  → Answer Node

User: "Create a product announcement for our new feature"
Content Orchestrator:
  1. Calls content_writer → Gets draft
  2. Calls content_reviewer with draft → Gets reviewed version
  3. Returns polished announcement
```

### Example 4: Cross-Platform Order Processing

```
Chat Trigger
  → AI Agent Node (Order Orchestrator)
    System Prompt: "You handle complex order operations across multiple platforms."

    Tools:
      ├─ AI Agent Tool (Inventory Agent)
      │    toolName: "inventory_agent"
      │    toolDescription: "Check inventory across all warehouses. Input: product_ids. Returns per-warehouse availability."
      │    System Prompt: "Check inventory across all warehouse systems."
      │    User Prompt: "Check inventory for: ${$('Order Orchestrator').productIds}"
      │    Sub-Tools:
      │      ├─ HTTP Request Tool → Warehouse A API
      │      ├─ HTTP Request Tool → Warehouse B API
      │      └─ Code Tool → Merge and compare results
      │
      └─ AI Agent Tool (Fulfillment Agent)
           toolName: "fulfillment_agent"
           toolDescription: "Create fulfillment orders based on inventory results. Input: order_details, inventory_results."
           System Prompt: "Create optimal fulfillment plan based on inventory availability."
           User Prompt: "Create fulfillment for order ${$('Order Orchestrator').orderId} using: ${$('inventory_agent').output}"
           Sub-Tools:
             └─ HTTP Request Tool → Fulfillment API

  → Answer Node

User: "Process order #ORD-500 with items [SKU-1, SKU-2]"
Order Orchestrator:
  1. Calls inventory_agent → Gets warehouse availability
  2. Calls fulfillment_agent with inventory results → Creates shipments
  3. Returns fulfillment summary to user
```

## Best Practices

### 1. Define Clear Role Boundaries

```javascript
// Good: Clear scope
toolDescription: `Sales expert sub-agent.
Handles: product inquiries, pricing, recommendations.
Does NOT handle: technical support, account management, billing.
Call when: user asks about products or wants to make a purchase.`

// Bad: Vague scope
toolDescription: "Helps with stuff"  // Parent agent won't know when to call
```

### 2. Keep Sub-Task Focused

Each AI Agent Tool should have a single, well-defined responsibility:

```javascript
// Good: Focused agents
AI Agent Tool 1: "Fetch customer data from CRM"
AI Agent Tool 2: "Analyze purchase history and recommend products"
AI Agent Tool 3: "Generate personalized email content"

// Bad: Overloaded agent
AI Agent Tool 1: "Fetch data, analyze, generate content, send email, log results"
```

### 3. Manage Nesting Depth

Avoid excessively deep agent hierarchies:

```yaml
Recommended: 1-2 levels of nesting
  Parent → Sub-Agent → Tool nodes

Caution: 3 levels
  Parent → Sub-Agent → Sub-Sub-Agent → Tool nodes

Avoid: 4+ levels
  Debugging and latency become challenging
```

### 4. Set Reasonable maxIterations

```javascript
// Sub-agent iterations should account for its own tool calls
Simple sub-agent (1-2 data sources):    maxIterations = 2-3
Medium sub-agent (3-5 tools):           maxIterations = 5-8
Complex sub-agent (multi-step logic):   maxIterations = 10-15

// Parent agent iterations should account for sub-agent calls
// Each sub-agent call counts as one iteration for the parent
```

### 5. Provide Good Context in User Prompt

```javascript
// Good: Rich context passed to sub-agent
userPrompt: `Task: Analyze customer ${customerId} for upsell opportunities.

Customer profile:
- Segment: Enterprise
- Current plan: Premium
- Usage: 85% of plan limit
- Recent tickets: 3 in last month

Available products for upsell:
${JSON.stringify(availableProducts)}

Provide: Top 3 recommendations with reasoning.`

// Bad: Minimal context
userPrompt: "Analyze customer"  // Sub-agent has no information to work with
```

### 6. Use AI-Assisted Prompt Authoring

For complex sub-agent roles, use the "Let the model define this parameter" button:

1. Describe the sub-agent's purpose in the **Tool Description**
2. Click the AI button on **System Prompt** to auto-generate a comprehensive system prompt
3. Click the AI button on **User Prompt** to auto-generate a template for receiving tasks
4. Review and refine the generated prompts

### 7. Monitor Credit Usage

Auto mode sub-agents consume credits at runtime:

```javascript
// Monitor via workflow logs
System Prompt: `After each sub-agent call, note:
- Which sub-agent was called
- How many iterations it used
- Whether auto mode or explicit model was used`
```

## FAQ

### Q1: When should I use AI Agent Tool vs. a regular Tool node?

**A**:

| Scenario | Use |
| --- | --- |
| Simple data fetch or calculation | Code Tool / HTTP Request Tool |
| Need reasoning and multi-step decisions | AI Agent Tool |
| Fixed logic, always same flow | Code Tool |
| Dynamic task requiring judgment | AI Agent Tool |
| Single API call | HTTP Request Tool |
| Multi-source aggregation with synthesis | AI Agent Tool |

### Q2: Can a sub-agent call another sub-agent?

**A**: Yes. AI Agent Tool nodes can connect to other AI Agent Tool nodes, enabling nested agent hierarchies. However:

- **Keep depth ≤ 2 levels** for maintainability
- Each nesting level adds latency
- Deeply nested agents are harder to debug
- Consider whether a single agent with more tools could achieve the same result

### Q3: How does the parent agent know what the sub-agent can do?

**A**: The parent agent relies entirely on the **toolDescription** field. Write it as if you're documenting an API for another developer:

```javascript
toolDescription: `Fetch consolidated customer profile from all platforms.

Input expected from parent:
- customer_id (string): Customer identifier
- platforms (string array, optional): Which platforms to query. Default: all available.

Returns:
- profile: Customer profile object with merged data
- data_sources: List of platforms successfully queried
- errors: List of any platforms that failed

Call when: You need a complete view of a customer across all systems.`
```

### Q4: Why no streaming or structured output?

**A**: As a tool, the AI Agent Tool must return a **complete result** that the parent agent can consume in a single step. Streaming output would delay the parent agent's execution, and structured output is unnecessary since the parent agent can parse the natural language result.

If you need structured data from a sub-agent, instruct it in the System Prompt to return data in a specific format:

```javascript
systemPrompt: `Always end your response with a JSON summary block:
\`\`\`json
{
  "primary_intent": "...",
  "confidence": 0.0-1.0,
  "actions_taken": [...],
  "requires_followup": true/false
}
\`\`\``
```

### Q5: What happens if the sub-agent fails?

**A**: Depends on the **On Error** setting:

- `stopWorkflow` (default): The entire workflow stops
- `continueRegularOutput`: Parent agent receives the error and can decide how to handle it
- `continueErrorOutput`: Parent agent receives error details

**Recommended approach**:

```javascript
// Parent System Prompt
systemPrompt: `If a sub-agent returns an error:
1. Do not expose technical errors to the user
2. Try alternative approaches if available
3. If unable to continue, politely explain the situation
4. Escalate to human support if appropriate`
```

### Q6: How does credit billing work with nested agents?

**A**: Each AI Agent Tool that uses Auto mode consumes credits independently:

```
Parent Agent (explicit model)     → Billed to model provider
  └─ Sub-Agent 1 (auto mode)      → Deducts from org credits
       └─ Sub-Agent 2 (auto mode) → Deducts from org credits
```

To control costs:
- Use explicit models for predictable billing
- Set reasonable `maxIterations` on each agent
- Monitor credit consumption patterns
- Use simpler models for straightforward sub-tasks

## Next Steps

- [AI Agent Action Node](/en/guide/workflow/nodes/action-nodes/ai-agent) — Learn about the main AI Agent node
- [Sub-workflow Tool Node](/en/guide/workflow/nodes/tool-nodes/subflow) — Register sub-workflows as AI-callable tools
- [Think Tool Node](/en/guide/workflow/nodes/tool-nodes/think) — Add structured reasoning capability
- [MCP Client Tool Node](/en/guide/workflow/nodes/tool-nodes/mcp-client) — Connect external MCP server tools
- [Code Tool Node](/en/guide/workflow/nodes/tool-nodes/code) — Add custom code tools for sub-agents
- [HTTP Request Tool Node](/en/guide/workflow/nodes/tool-nodes/http-request) — Provide API access to sub-agents

## Related Resources

- [Working with Nodes](/en/guide/working-with-nodes) — Understand node types and connections
- [Chat Trigger Node](/en/guide/workflow/nodes/trigger-nodes/chat) — Build conversational multi-agent systems
- [Expression Syntax](/en/guide/expressions/) — Pass data between parent and sub-agents
