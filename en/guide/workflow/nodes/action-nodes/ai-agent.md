---
title: AI Agent Node
description: Build intelligent AI Agents that autonomously call tools to complete complex tasks
---

# AI Agent Node

The AI Agent node is the core for building intelligent AI agents. It allows AI to autonomously decide which tools to call and how to combine them to complete complex tasks. This is key to implementing truly intelligent, autonomous AI assistants.

## Core Concepts

### What is an AI Agent?

AI Agent doesn't simply execute predefined flows, but:
- **Autonomous Decision-making** - AI decides what to do based on task needs
- **Tool Calling** - AI can call multiple tools to get info or perform operations
- **Multi-step Reasoning** - AI can perform multiple rounds of thinking and tool calls
- **Goal-oriented** - AI focuses on achieving user goals

**Traditional Flow vs AI Agent**:
```
Traditional (Fixed):
User Input → Call API A → Call API B → Return Result

AI Agent (Intelligent):
User Input → AI Analyzes Needs
  → Need weather? Call weather API
  → Need order info? Call order API
  → Need calculation? Call calculator tool
  → Synthesize info, return result
```

### AI Agent Workflow

1. **Receive Request** - User asks question or task
2. **Understand Intent** - AI analyzes what user really wants
3. **Plan Actions** - AI decides which tools to call
4. **Execute Tools** - Call tools individually or in combination
5. **Synthesize Results** - Integrate all information
6. **Generate Answer** - Return to user in natural language

## Use Cases

- **Intelligent Customer Service** - Auto query orders, inventory, logistics
- **Personal Assistant** - Manage calendar, send emails, query info
- **Data Analysis Assistant** - Query data, generate charts, analyze trends
- **Development Assistant** - Search docs, generate code, run tests
- **Business Process {{PRODUCT_NAME}}** - Auto process tasks per business rules
- **Multi-channel Integration** - Coordinate work across multiple systems

## Node Configuration

### Basic Settings

#### Model (model)
Select LLM model for AI Agent.

**Recommended Models**:
```yaml
GPT-4: Strongest reasoning, suitable for complex Agent tasks
GPT-3.5-turbo: Cost-effective, suitable for simple Agents
Claude 3 Opus: Powerful tool calling, long text processing
Claude 3 Sonnet: Balanced performance, suitable for most scenarios
```

#### User Prompt (userPrompt)
User input or task description (required).

```javascript
// From Chat Trigger
userPrompt: $('Chat Trigger').message

// With context
userPrompt: `User question: ${$('Chat Trigger').message}
User info: VIP Level ${$('User Info').vipLevel}
Provide personalized service.`

// Multi-turn conversation
userPrompt: $('Chat Trigger').conversationHistory
```

#### Enable System Prompt (enableSystemPrompt)
Whether to use system prompt to define Agent role and behavior.

#### System Prompt (systemPrompt)
Define AI Agent's role, capabilities, limits, and behavior guidelines.

```javascript
systemPrompt: `You are an intelligent customer service assistant.

Your capabilities:
- Query order status
- Check product inventory
- Answer FAQs
- Handle returns/exchanges

Your limits:
- Cannot directly modify orders
- Cannot disclose other users' info
- Transfer complex issues to human

Your style:
- Friendly, professional, patient
- Concise answers
- Proactively offer help`
```

#### Structured Output (structuredOutput)
Whether to require AI Agent to return structured JSON data.

#### JSON Schema (jsonSchema)
Define structured output data format (optional, requires structuredOutput enabled).

```json
{
  "type": "object",
  "properties": {
    "intent": {
      "type": "string",
      "enum": ["query_order", "check_stock", "price_inquiry", "complaint"]
    },
    "orderId": {"type": "string"},
    "summary": {"type": "string"},
    "toolsUsed": {
      "type": "array",
      "items": {"type": "string"}
    },
    "needsHumanSupport": {"type": "boolean"}
  }
}
```

#### Max Iterations (maxIterations)
Maximum number of tool call rounds AI Agent can perform (default: 3).

**Configuration Suggestions**:
```yaml
Simple tasks: 2-3 iterations
Medium complexity: 5-8 iterations
Complex tasks: 10-15 iterations
```

#### Stream (stream)
Whether to enable streaming output (return word by word). Default: `false`

### Connecting Tool Nodes

AI Agent node can connect to multiple Tool nodes:

```
                    → Code Tool (Calculator)
                    ↓
AI Agent Node  → Entity Recognition Tool (Extract info)
                    ↓
                    → HTTP Request Tool (Query API)
```

**Connection Method**:
1. AI Agent node has "Tool" port at bottom
2. Connect Tool port to top of each Tool node
3. AI auto-discovers all connected tools
4. AI decides which to call based on tool descriptions

### Advanced Settings
- **Always Output**: Output empty item on failure (default: false)
- **Execute Once**: Only execute once with first input (default: false)
- **Retry on Fail**: Auto retry on failure (default: false)
- **Max Tries**: Maximum retries (default: 3)
- **Wait Between Tries**: Wait time between retries in ms (default: 1000)
- **On Error**: How to handle failures (stopWorkflow/continueRegularOutput/continueErrorOutput)

## Output Data

```javascript
// AI's final answer
$('AI Agent').output
$('AI Agent').answer

// If structured output enabled
$('AI Agent').structuredData.intent
$('AI Agent').structuredData.orderId

// Execution info
$('AI Agent').toolsUsed      // List of tools used
$('AI Agent').iterations     // Number of iterations executed
```

## Workflow Examples

### Example 1: Intelligent Customer Service

```
Chat Trigger
  → AI Agent Node
    Model: GPT-4
    System Prompt: "You are customer service assistant, can query orders, inventory, handle returns."
    User Prompt: $('Chat Trigger').message
    Max Iterations: 5

    Tools:
      → HTTP Request Tool (Query Order)
        Tool Description: "Query order details by order ID. Input: orderId. Returns: order object."
        URL: "https://api.example.com/orders/{orderId}"

      → HTTP Request Tool (Check Inventory)
        Tool Description: "Check product inventory. Input: productId. Returns: quantity."
        URL: "https://api.example.com/inventory/{productId}"

      → HTTP Request Tool (Create Return)
        Tool Description: "Create return request. Input: orderId, reason. Returns: refundId."
        URL: "https://api.example.com/refunds"

  → Answer Node

Conversation:
User: "My order #12345 hasn't arrived, can I return it?"
AI Execution:
  1. Call "Query Order" → Get order info
  2. Check order status → Found shipped
  3. Reply: "Your order shipped, arrives tomorrow. If not received then, I can help process return."

User: "Never mind, I don't want to wait, process return now"
AI Execution:
  1. Call "Create Return" → Create return request
  2. Reply: "Return request created, refund ID #R67890..."
```

### Example 2: Data Analysis Assistant

```
Chat Trigger
  → AI Agent Node
    System Prompt: "You are data analysis assistant, can query data, generate charts, analyze trends."

    Tools:
      → HTTP Request Tool (Query Sales Data)
      → Code Tool (Data Analysis)
      → Code Tool (Generate Chart)

  → Answer Node

User: "Analyze last month's sales"
AI Executes:
  1. Call "Query Sales Data" (startDate, endDate)
  2. Call "Data Analysis" (salesData)
  3. Call "Generate Chart" (data, chartType)
  4. Comprehensive answer: "Last month sales $xxx, 15% growth...[chart]"
```

### Example 3: Structured Output for {{PRODUCT_NAME}}

```
Chat Trigger
  → AI Agent Node
    Structured Output: true
    JSON Schema: {
      properties: {
        category: {type: "string", enum: ["tech", "account", "payment", "other"]},
        priority: {type: "string", enum: ["low", "medium", "high", "urgent"]},
        summary: {type: "string"},
        suggestedSolution: {type: "string"}
      }
    }

    Tools: [Query History, Query User Info, Extract Issue Details]

  → Code Node (Validate and process)
  → HTTP Request Node (Create ticket)
  → Answer Node

User: "Can't login, showing password error, but I'm sure it's correct, urgent"
AI Analysis Output:
{
  category: "account",
  priority: "high",  // Detected "urgent"
  summary: "User cannot login, possibly account locked",
  suggestedSolution: "Check account status, may need password reset"
}
```

## Best Practices

### 1. Write Clear System Prompts

```javascript
// Good
systemPrompt: `You are customer service assistant.

Your role:
- Help users query orders
- Answer product questions
- Handle simple after-sales

Your capabilities (tools):
- Query order status
- Query product info
- Query logistics

Your limits:
- Cannot modify orders
- Cannot directly refund
- Transfer complex issues to human

Workflow:
1. Confirm user identity first
2. Understand user issue
3. Use appropriate tools to get info
4. Provide clear answer
5. Ask if more help needed`

// Bad
systemPrompt: "You are customer service"  // Too simple
```

### 2. Write Good Tool Descriptions

```javascript
// Good
HTTP Request Tool
  Tool Description: `Query detailed order information.

Input params:
- orderId: Order number (required, format: ORD-XXXXX)

Returns:
- orderStatus: Order status ("pending"|"shipped"|"delivered"|"cancelled")
- items: Product list
- totalAmount: Order total
- shippingInfo: Logistics info (if shipped)

Use cases:
- User asks "where's my order"
- User provides order number
- Need order details

Example:
User: "Where's order ORD-12345?"
AI calls: queryOrder(orderId="ORD-12345")`

// Bad
Tool Description: "Query order"  // Too little info
```

### 3. Set Reasonable maxIterations

```javascript
Simple queries: 2-3  // Query 1-2 info sources
Medium tasks: 5-8    // Multiple tool combinations
Complex tasks: 10-15 // Multi-step reasoning
```

### 4. Handle Tool Call Failures

```javascript
System Prompt: `When tool call fails:
1. Don't expose technical errors to users
2. Try alternative approaches
3. If can't continue, politely explain
4. Provide human support option`
```

### 5. Monitor and Optimize

```javascript
// Log Agent execution
HTTP Request Node
  URL: "https://api.example.com/agent-logs"
  Body: {
    userMessage: $('Chat Trigger').message,
    agentOutput: $('AI Agent').output,
    toolsUsed: $('AI Agent').toolsUsed,
    iterations: $('AI Agent').iterations
  }
```

## FAQ

### Q: AI Agent vs LLM Node?

**A**:
- **LLM Node**: Pure text generation, no tool calling, single round
- **AI Agent Node**: Text generation + tool calling, multi-round iteration, autonomous

Use LLM for text replies only, use AI Agent for complex tasks requiring data queries and operations.

### Q: How does AI choose which tool to call?

**A**: Based on:
1. Tool description matches needs
2. Current conversation context
3. Task goal requirements
4. Previous tool calls

Optimize by writing detailed tool descriptions with use cases and examples.

### Q: Can AI Agent get stuck in infinite loop?

**A**: Protected by:
1. **maxIterations** - Limits max iterations
2. **Timeout mechanism** - Execution time limit
3. **Duplicate detection** - Detects repeated tool calls

### Q: How to debug AI Agent?

**A**:
```javascript
Code Node (after Agent)
  Code: |
    console.log('Tools used:', $('AI Agent').toolsUsed);
    console.log('Iterations:', $('AI Agent').iterations);
    console.log('Output:', $('AI Agent').output);
    return $('AI Agent');
```

### Q: Can multiple AI Agents collaborate?

**A**: Yes! Create Agent workflows:

```
Chat Trigger
  → AI Agent 1 (Router)
    Structured Output: {expertType: "sales"|"tech"|"account"}
  → Conditional Branch
    → [sales] → AI Agent 2 (Sales Expert)
    → [tech] → AI Agent 3 (Tech Expert)
    → [account] → AI Agent 4 (Account Expert)
```

## Next Steps

- [Code Tool Node](/en/guide/workflow/nodes/tool-nodes/code) - Add custom tools for Agent
- [HTTP Request Tool Node](/en/guide/workflow/nodes/tool-nodes/http-request) - Add API calling capability
- [Entity Recognition Tool](/en/guide/workflow/nodes/tool-nodes/entity-recognition) - Add info extraction capability

## Related Resources

- [LLM Node](/en/guide/workflow/nodes/action-nodes/llm) - Learn about pure text generation
- [Chat Trigger Node](/en/guide/workflow/nodes/trigger-nodes/chat) - Build conversational Agents
