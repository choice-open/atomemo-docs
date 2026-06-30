---
title: Think Tool Node
description: Provide thinking and reasoning tools for AI Agents, enabling structured reasoning without external data access
---

# Think Tool Node

The Think Tool node provides a dedicated thinking and reasoning capability for AI Agents. Unlike data-fetching or action-oriented tools, the Think Tool does not obtain new information or change any database — it simply records a thought to the execution log. This gives the AI Agent a structured way to perform intermediate reasoning steps, improving decision quality for complex multi-step tasks.

## Core Concepts

### What is a Think Tool?

The Think Tool is a minimal but powerful reasoning aid:

- **No Side Effects** — Does not fetch data, call APIs, or modify state
- **Structured Thinking** — Provides a formal channel for the AI to "think out loud"
- **Execution Transparency** — Thoughts are logged, making the AI's reasoning traceable
- **Cache Memory** — Serves as a scratchpad for intermediate conclusions during multi-step tasks

### When the AI Uses It

```
User: "Compare the total cost of Plan A vs Plan B for a team of 25 people"

AI Agent Reasoning:
  1. [Think Tool] "Plan A: $15/user × 25 = $375; Plan B: $400 flat for up to 30"
  2. [HTTP Tool] Fetch current discount for Plan A
  3. [Think Tool] "Plan A with 10% discount = $337.50. Plan B = $400. Plan A cheaper."
  4. → "Plan A costs $337.50/month, Plan B costs $400/month. Plan A is cheaper."
```

## Use Cases

### Typical Applications

- **Complex Calculations** — Break down multi-step math before answering
- **Option Comparison** — Weigh pros and cons of multiple alternatives
- **Planning** — Outline steps before executing a sequence of tool calls
- **Intermediate Summarization** — Capture interim findings during lengthy research
- **Decision Justification** — Record reasoning behind tool selection choices
- **Memory Aid** — Store temporary conclusions that inform later steps

## Tool vs Action Differences

The Think Tool exists only as a Tool node — there is no corresponding Action node, as its purpose is specifically to support AI Agent reasoning within a tool-calling context.

| Characteristic | Think Tool |
| --- | --- |
| Data Access | None — no external data retrieval |
| Side Effects | None — no state changes |
| Parameters | Single `thought` string parameter |
| Output | Returns the thought as-is |
| Execution Log | Thought is appended to the log for traceability |

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

**Default value**: `THINK_TOOL`

**Configuration Examples**:

```javascript
// 1. Default name
toolName: "THINK_TOOL"

// 2. Purpose-specific name
toolName: "reasoning_scratchpad"

// 3. Multiple think tools for different purposes
toolName: "planning_think"
toolName: "calculation_think"
toolName: "comparison_think"
```

**Naming Recommendations**:

- Use the default `THINK_TOOL` for a single general-purpose think tool
- Use purpose-specific names if registering multiple think tools: `math_reasoning`, `decision_log`
- Keep names concise and descriptive

#### Tool Description (toolDescription)

Describes when and how the AI Agent should use this thinking tool.

**Field Properties**:

- Required field
- Supports expressions
- Supports multi-line text
- Has a sensible **pre-filled default value**

**Default value**:

```
Use the tool to think about something.
It will not obtain new information or change the database, but just append the thought to the log.
Use it when complex reasoning or some cache memory is needed.
```

**Customization Examples**:

```javascript
// 1. Default (recommended for most cases)
toolDescription: "Use the tool to think about something. It will not obtain new information or change the database, but just append the thought to the log. Use it when complex reasoning or some cache memory is needed."

// 2. Math-focused
toolDescription: "Use this tool to work through mathematical calculations step by step. Record intermediate results and verify before finalizing. Use when the user asks for calculations, comparisons, or numerical analysis."

// 3. Decision-making focused
toolDescription: "Use this tool to weigh options before making a decision. Record the pros and cons of each alternative, consider edge cases, and document your final reasoning. Use when choosing between multiple tools or response strategies."

// 4. Planning focused
toolDescription: "Use this tool to plan your next actions. Outline the steps needed to complete the user's request, identify which tools you'll need, and note any assumptions you're making. Use before starting complex multi-step tasks."
```

**When to Customize**:

- If you want the AI to use think in a very specific way
- If you have multiple think tools for different reasoning styles
- For most cases, the default description works well

### Advanced Settings

#### Node Description (nodeDescription)

Add a custom description for documentation purposes:

```yaml
nodeDescription: "General-purpose reasoning scratchpad for the AI Agent."
```

## How It Works

### Internal Mechanism

When the AI Agent calls the Think Tool:

1. **AI invokes** the tool with a `thought` string parameter
2. **The thought is logged** to the execution trace — no external calls, no state changes
3. **The thought is returned** to the AI Agent as the tool's output
4. **AI continues** reasoning with the recorded thought available as context

```javascript
// What happens internally (simplified)
AI calls: THINK_TOOL(thought = "Plan A costs 375, Plan B costs 400")
Tool returns: "Plan A costs 375, Plan B costs 400"
AI continues: "Plan A is cheaper by $25. I should recommend Plan A."
```

### Execution Transparency

Thoughts are visible in the execution log, making the AI Agent's reasoning auditable:

```
[2024-01-15 14:30:01] Tool call: THINK_TOOL
  → thought: "Analyzing user request: compare shipping options"
[2024-01-15 14:30:02] Tool call: calculate_shipping
  → items: [SKU-1, SKU-2], destination: "90210"
[2024-01-15 14:30:03] Tool call: THINK_TOOL
  → thought: "Standard: $5.99 (3-5 days), Express: $14.99 (1-2 days). User seemed cost-conscious, recommend Standard."
[2024-01-15 14:30:04] AI response: "Standard shipping is $5.99..."
```

## Workflow Examples

### Example 1: Complex Calculation

```
Chat Trigger
  → AI Agent Node
    System Prompt: "You are a financial assistant. Use the think tool to work through calculations before answering."
    User Prompt: $('Chat Trigger').message

    Tools:
      ├─ Think Tool (THINK_TOOL)
      │    toolDescription: "Use this tool to work through calculations step by step."
      │
      └─ Code Tool (Calculator)
           toolName: "calculate"

  → Answer Node

User: "If I invest $5,000 at 7% annual return compounded monthly, what will I have after 10 years?"

AI Execution:
  1. THINK_TOOL: "Formula: A = P(1 + r/n)^(nt). P=5000, r=0.07, n=12, t=10"
  2. THINK_TOOL: "r/n = 0.07/12 = 0.005833... nt = 12×10 = 120"
  3. calculate: (1 + 0.07/12)^120 → 2.00966...
  4. THINK_TOOL: "A = 5000 × 2.00966 = $10,048.31"
  5. → "After 10 years, you'll have approximately $10,048.31"
```

### Example 2: Multi-option Comparison

```
Chat Trigger
  → AI Agent Node
    System Prompt: "You are a product advisor. Use think to compare options before recommending."
    User Prompt: $('Chat Trigger').message

    Tools:
      ├─ Think Tool (THINK_TOOL)
      ├─ HTTP Request Tool (Product Search API)
      └─ HTTP Request Tool (Reviews API)

  → Answer Node

User: "Compare the top 3 noise-cancelling headphones under $300"

AI Execution:
  1. Product Search → Returns 5 models
  2. THINK_TOOL: "Top 3 under $300: Sony WH-1000XM4 ($278), Bose QC45 ($279), Sennheiser M4 ($249)"
  3. Reviews API → Fetch reviews for all 3
  4. THINK_TOOL: "Sony: best ANC, 30hr battery. Bose: most comfortable, 24hr. Sennheiser: best sound, 60hr battery, cheapest."
  5. THINK_TOOL: "Recommendation: Sennheiser for value + battery, Sony for pure ANC quality."
  6. → Detailed comparison with recommendation
```

### Example 3: Planning Before Execution

```
Chat Trigger
  → AI Agent Node
    System Prompt: "You are a task automation agent. Plan before executing complex requests."
    User Prompt: $('Chat Trigger').message

    Tools:
      ├─ Think Tool (THINK_TOOL)
      ├─ Sub-workflow Tool (Data Pipeline)
      ├─ Sub-workflow Tool (Report Generator)
      └─ HTTP Request Tool (Email API)

  → Answer Node

User: "Generate a weekly sales report for the marketing team and email it to them"

AI Execution:
  1. THINK_TOOL: "Plan: (1) Fetch sales data via Data Pipeline, (2) Generate report via Report Generator, (3) Email to marketing@company.com"
  2. Data Pipeline → Returns weekly sales data
  3. THINK_TOOL: "Data received: 1,250 transactions, $89,400 total revenue. Passing to report generator."
  4. Report Generator → Returns formatted report
  5. THINK_TOOL: "Report generated. Sending to marketing@company.com."
  6. Email API → Sends report
  7. → "Weekly sales report has been generated and sent to the marketing team."
```

### Example 4: Debugging and Self-Correction

```
Chat Trigger
  → AI Agent Node
    System Prompt: "You are a data analyst. Use think to check your reasoning."
    User Prompt: $('Chat Trigger').message

    Tools:
      ├─ Think Tool (THINK_TOOL)
      └─ Code Tool (Data Analysis)

  → Answer Node

User: "What's the average customer lifetime value from this dataset?"

AI Execution:
  1. Data Analysis → Returns results
  2. THINK_TOOL: "Got average CLV of $847. But dataset includes outliers — 3 customers with $50K+ purchases. Need to check median."
  3. Data Analysis (adjusted) → Returns median
  4. THINK_TOOL: "Median CLV is $320. The average was skewed by outliers. I should report both but emphasize median."
  5. → "Average CLV is $847, but the median is $320. The average is inflated by a few high-spending customers..."
```

## Best Practices

### 1. Use the Default Description

For most workflows, the default tool description works well. It clearly tells the AI when to use the tool:

```javascript
// Default — works great for general reasoning
toolDescription: "Use the tool to think about something. It will not obtain new information or change the database, but just append the thought to the log. Use it when complex reasoning or some cache memory is needed."
```

### 2. Place Think Tool Early in the Tool List

If you have multiple tools registered with the AI Agent, list the Think Tool first. This encourages the AI to reason before acting:

```
AI Agent
  Tools:
    1. Think Tool        ← Reasoning first
    2. HTTP Request Tool  ← Then data
    3. Code Tool          ← Then processing
```

### 3. Encourage Thinking in the System Prompt

Reinforce the use of the Think Tool in the AI Agent's system prompt:

```javascript
systemPrompt: `You are a careful and methodical assistant.

Before answering complex questions:
1. Use the think tool to break down the problem
2. Identify what information you need
3. Plan your tool calls
4. Execute and verify

Do NOT skip the thinking step for multi-step problems.`
```

### 4. Use Multiple Think Tools for Different Purposes

For complex agents, register multiple think tools with different descriptions:

```javascript
Tools:
  ├─ Think Tool (PLANNING)
  │    toolDescription: "Use at the START of complex tasks to plan your approach."
  │
  ├─ Think Tool (CALCULATION)
  │    toolDescription: "Use when working through mathematical or logical steps."
  │
  └─ Think Tool (DECISION)
       toolDescription: "Use before making a final recommendation to weigh options."
```

### 5. Review Think Logs for Debugging

Thoughts are logged — use them to understand and improve your AI Agent's behavior:

- **Why did the AI choose tool X over tool Y?** → Check the think log for reasoning
- **Why did the AI give an incorrect answer?** → Check if the reasoning step was flawed
- **How can I improve the system prompt?** → Look for patterns in the AI's thinking

### 6. Don't Over-require Thinking

For simple, straightforward questions, the AI should answer directly:

```javascript
systemPrompt: `Use the think tool when:
- The task requires 2+ steps
- You need to compare options
- You're unsure about the best approach
- Calculations are involved

Skip the think tool for:
- Simple factual questions ("What's your name?")
- Direct, single-tool lookups ("What's order #12345's status?")
- Greetings and small talk`
```

## FAQ

### Q1: Does the Think Tool access any external data?

**A**: No. The Think Tool is completely self-contained. It accepts a thought string and returns it as-is. It does not call any APIs, query any databases, or modify any state. Its sole purpose is to record the AI's reasoning to the execution log.

### Q2: When should I use Think Tool vs. just letting the AI think internally?

**A**: The AI can reason internally (in its chain of thought), but the Think Tool provides:

- **Transparency** — Thoughts are visible in execution logs for debugging
- **Structure** — Forces explicit reasoning steps
- **Persistence** — Thoughts persist across tool calls in the execution context
- **Auditability** — You can review exactly what the AI was "thinking"

Use the Think Tool when you need visibility into the AI's reasoning process.

### Q3: Can I have multiple Think Tools in one workflow?

**A**: Yes. You can register multiple Think Tool nodes with different tool names and descriptions. This is useful when you want the AI to use different reasoning styles for different purposes (e.g., planning vs. calculation vs. decision-making).

### Q4: Does using the Think Tool consume extra credits?

**A**: The Think Tool itself doesn't consume credits (no API calls). However, it counts as a tool call iteration toward the AI Agent's `maxIterations` limit. It also adds tokens to the conversation context, which may slightly increase the LLM API cost for subsequent calls.

### Q5: Can the Think Tool's output be used by downstream nodes?

**A**: The Think Tool's output is primarily for the AI Agent's internal use. While the thought is technically available as `$("Think Tool").output`, it's not designed for downstream processing. Use the [Code Tool](/en/guide/workflow/nodes/tool-nodes/code) or [Variable Assigner](/en/guide/workflow/nodes/action-nodes/variable-assigner) if you need to store data for downstream nodes.

### Q6: How is Think Tool different from the AI's internal reasoning?

**A**:

| Aspect | Internal Reasoning | Think Tool |
| --- | --- | --- |
| Visibility | Hidden (model's internal state) | Visible in logs |
| Persistence | May be lost between tool calls | Preserved in execution trace |
| Audit Trail | Not available | Fully auditable |
| Token Cost | Part of normal generation | Adds a tool call round |
| Debugging | Cannot inspect | Full thought history |

## Next Steps

- [AI Agent Node](/en/guide/workflow/nodes/action-nodes/ai-agent) — Learn about the main AI Agent node
- [Code Tool Node](/en/guide/workflow/nodes/tool-nodes/code) — Add custom code execution tools
- [Sub-workflow Tool Node](/en/guide/workflow/nodes/tool-nodes/subflow) — Register sub-workflows as tools

## Related Resources

- [Working with Nodes](/en/guide/working-with-nodes) — Understand node types and connections
- [AI Agent Tool Node](/en/guide/workflow/nodes/tool-nodes/ai-agent) — Delegate tasks to sub-agents
- [Debug Workflow](/en/guide/workflow/debug-workflow) — Use think logs for debugging
