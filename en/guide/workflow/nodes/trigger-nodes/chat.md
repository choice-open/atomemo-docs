---
title: Chat Trigger Node
description: Trigger workflows through chat conversations for interactive conversational experiences
---

# Chat Trigger Node

The Chat Trigger node triggers workflow execution through chat conversations. This is the core node for building conversational AI Agents. Each workflow can only have one Chat Trigger.

## Use Cases

- **Intelligent Customer Service** - User messages trigger customer service response flows
- **Conversational Assistants** - Build ChatGPT-like conversational assistants
- **Q&A Systems** - Trigger answer generation based on user questions
- **Task Execution** - Trigger tasks through natural language commands
- **Information Collection** - Conversational forms, collect info through chat
- **Interactive Queries** - Natural language database or API queries

## Node Features

### Basic Characteristics
- **Unique Per Workflow** - One workflow can only have one Chat Trigger
- **Workflow Entry** - Starting point for conversational workflows
- **Real-time Interaction** - Supports real-time user-AI dialogue
- **Session Persistence** - Automatically maintains conversation context and session state
- **Custom Variables** - Can collect additional user-provided information

### Built-in Output Fields

```javascript
$('Chat Trigger').message             // User message content
$('Chat Trigger').userId              // User ID
$('Chat Trigger').sessionId           // Session ID
$('Chat Trigger').timestamp           // Message timestamp
$('Chat Trigger').conversationHistory // Conversation history
```

## Node Configuration

### Basic Settings

#### Custom Variables (customVariables)

Define custom variables to collect additional information.

```javascript
customVariables: [
  {
    label: "User Name",
    variable: "userName",
    type: "string",
    required: true,
    maxLength: 50
  },
  {
    label: "Age",
    variable: "age",
    type: "number",
    required: false
  }
]

// Access custom variables
$('Chat Trigger').userName
$('Chat Trigger').age
```

**Variable Types**: `string`, `number`
**Variable Properties**: label, variable, type, required, maxLength, hidden

## Workflow Examples

### Example 1: Simple Q&A Bot

```
Chat Trigger
  → LLM Node
    System Prompt: "You are a friendly customer service assistant."
    User Prompts: [$('Chat Trigger').message]
  → Answer Node

User: "Hello"
AI: "Hi! How can I help you?"
```

### Example 2: Context-aware Conversation

```
Chat Trigger
  → LLM Node
    User Prompts: $('Chat Trigger').conversationHistory
  → Answer Node

User: "I want to buy a laptop"
AI: "What's your budget?"
User: "Around 8000"  // AI remembers context
AI: "For 8000 yuan, I recommend..."
```

### Example 3: AI Agent Dialogue

```
Chat Trigger
  → AI Agent Node
    System Prompt: "You are an intelligent assistant."
    Tools: [Weather API, Order API, Calculator]
    Conversation History: $('Chat Trigger').conversationHistory
  → Answer Node

User: "What's the weather in Beijing?"
AI: (Calls weather API) "Beijing is sunny, 15°C."

User: "Where's my order?"
AI: (Calls order API) "Your order shipped, arrives tomorrow."
```

### Example 4: Multi-turn Information Collection

```
Chat Trigger
  → AI Agent Node
    System Prompt: "Collect: name, phone, date, room type. Ask step by step."
    Tools: [Entity Recognition Tool]
  → Code Node (Check completeness)
  → Conditional Branch
    → [complete] → Create booking
    → [incomplete] → Ask for missing info
```

## Best Practices

### 1. Design Reasonable Custom Variables

```javascript
// Good - necessary variables only
customVariables: [
  {label: "Member ID", variable: "memberId", type: "string", required: true}
]

// Bad - too many variables
customVariables: [
  // 10+ variables... poor UX
]
```

### 2. Utilize Conversation History

```javascript
// Good - with context
User Prompts: $('Chat Trigger').conversationHistory

// Bad - loses context
User Prompts: [$('Chat Trigger').message]
```

### 3. User Identity Recognition

```javascript
HTTP Request Node
  URL: `https://api.example.com/users/${$('Chat Trigger').userId}`

LLM Node
  System Prompt: `User info: ${$('HTTP Request').body}
Provide personalized service.`
```

## FAQ

### Q: Chat Trigger vs Webhook Trigger?

**A**:
- **Chat Trigger**: Conversational interaction, auto session management, max 1 per workflow
- **Webhook Trigger**: API integration, no session concept, multiple allowed

### Q: How long is conversation history saved?

**A**: Within session, all history accessible. After session ends, may be cleared. Save to database if long-term storage needed:

```javascript
HTTP Request Node
  URL: "https://api.example.com/conversation-logs"
  Body: {
    sessionId: $('Chat Trigger').sessionId,
    history: $('Chat Trigger').conversationHistory
  }
```

### Q: How to implement multi-turn dialogue?

**A**: Use `conversationHistory`:

```javascript
LLM Node
  User Prompts: $('Chat Trigger').conversationHistory
// Includes all history, AI auto understands context
```

### Q: How to test Chat Trigger workflows?

**A**:
- Use "Run" button in node toolbar
- Input test messages
- View execution results

## Next Steps

- [Manual Trigger Node](/en/guide/workflow/nodes/trigger-nodes/manual) - Learn manual trigger
- [AI Agent Node](/en/guide/workflow/nodes/action-nodes/ai-agent) - Build intelligent assistants
- [Answer Node](/en/guide/workflow/nodes/action-nodes/answer) - Reply to users

## Related Resources

- [LLM Node](/en/guide/workflow/nodes/action-nodes/llm) - Generate AI replies
- [Sentiment Analysis](/en/guide/workflow/nodes/action-nodes/sentiment-analysis) - Analyze user emotions
