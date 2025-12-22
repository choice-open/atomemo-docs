---
title: LLM Node
description: Call large language models to generate text content
---

# LLM Node

The LLM node is used to call Large Language Models to generate text content. It is the core node for building AI conversations, content generation, and intelligent assistants, supporting multiple mainstream LLM providers and models.

## Use Cases

### Typical Applications
- **Intelligent Conversations** - Build chatbots for natural language interaction with users
- **Content Generation** - Generate articles, emails, product descriptions, and other text content
- **Text Summarization** - Summarize long documents or conversation content
- **Text Rewriting** - Improve, polish, or translate text
- **Q&A Systems** - Answer user questions based on context
- **Code Generation** - Generate, explain, or optimize code
- **Data Analysis** - Analyze and interpret data, generate insight reports
- **Creative Writing** - Generate stories, poetry, marketing copy, etc.

## Node Configuration

### Basic Settings (Parameters Panel)

#### Model (model)

Select the large language model to use.

**Field Properties**:
- Required field
- Supports multiple LLM providers
- Different models have different capabilities and costs

**Mainstream Model Providers**:
- **OpenAI**: GPT-4, GPT-4 Turbo, GPT-3.5-turbo
- **Anthropic**: Claude 3 Opus, Claude 3 Sonnet, Claude 3 Haiku
- **Google**: Gemini Pro, Gemini Ultra
- **Others**: Local models (Ollama), custom endpoints

**Model Selection Guide**:
```yaml
GPT-4: Complex reasoning, high-quality content generation
GPT-3.5-turbo: Cost-effective, suitable for most scenarios
Claude 3 Opus: Long text processing, complex tasks
Claude 3 Sonnet: Balance performance and cost
Claude 3 Haiku: Fast response, simple tasks
```

#### System Prompt (systemPrompt)

Define AI's role, behavior, and constraints.

**Field Properties**:
- Optional field
- Supports expressions
- Supports multi-line text

**Configuration Examples**:

```javascript
// 1. Define role and style
"You are a professional customer service assistant, friendly, patient, and professional. Always answer questions in a clear and concise manner."

// 2. Set answer format
"You are a technical support expert. When answering:
1. Briefly explain the cause
2. Provide solution steps
3. Give prevention advice"

// 3. Add constraints
"You are a product recommendation assistant. Rules:
- Only recommend products within user's budget
- Explain recommendation reasons
- Don't recommend out-of-stock items
- If unsure, ask for more information"

// 4. Use expressions for dynamic setting
`You are an expert in ${$('AI Classifier').class}, providing professional advice.`

// 5. Based on knowledge base content
`You are a customer service assistant. Answer questions based on the following knowledge base content:

${$('Knowledge Retrieval').results[0].content}

Requirements:
- Use only provided information
- Clearly state if information is insufficient
- Cite sources`
```

#### User Prompts (userPrompts)

User message content, can include multiple conversation rounds.

**Field Properties**:
- Array type, supports multiple messages
- Supports expressions
- Builds conversation history in order

**Configuration Examples**:

```javascript
// 1. Simple question
[$('Chat Trigger').message]

// 2. Question with context
[`User information:
Name: ${$('User Data').name}
VIP Level: ${$('User Data').vipLevel}

Question: ${$('Chat Trigger').message}`]

// 3. Multi-turn conversation
[
  "First round conversation",
  "Second round conversation",
  $('Chat Trigger').message  // Current question
]

// 4. Structured input
[`Generate product description based on:

Product Name: ${$('Entity Recognition').productName}
Main Features: ${$('Entity Recognition').features}
Target Audience: ${$('Entity Recognition').targetAudience}
Price: ${$('Entity Recognition').price}

Requirements:
- Highlight advantages
- Appeal to target audience
- 150-200 words`]
```

#### Assistant Prompts (assistantPrompts)

Assistant's historical replies, used to build multi-turn conversation context.

**Field Properties**:
- Array type, optional
- Used with userPrompts
- Provides conversation history

### Advanced Settings (Settings Panel)

#### Always Output (alwaysOutput)

Output empty item even if generation fails.

**Default**: `false`

#### Execute Once (executeOnce)

Whether to execute only once using the first input item.

**Default**: `false`

#### Retry on Fail (retryOnFail)

Whether to automatically retry when generation fails.

**Default**: `false`

#### Max Tries (maxTries)

Maximum number of retries after failure.

**Default**: `3`

#### Wait Between Tries (waitBetweenTries)

Wait time between retries (milliseconds).

**Default**: `1000` (1 second)

#### Error Handling (onError)

How to handle generation failures.

**Available Values**:
- `stopWorkflow` - Stop entire workflow (default)
- `continueRegularOutput` - Continue execution
- `continueErrorOutput` - Continue with error output

#### Node Description (nodeDescription)

Add custom description for the node.

```yaml
nodeDescription: "Generate customer service reply based on knowledge base"
```

## Output Data

The LLM node returns model-generated text content.

```javascript
// Access generated text
$('LLM').output

// If further processing needed
$('LLM').output.length
$('LLM').output.toLowerCase()
```

## Workflow Examples

### Example 1: Simple Q&A Bot

```
Chat Trigger
  → LLM Node
    Model: GPT-3.5-turbo
    System Prompt: "You are a friendly customer service assistant helping users with questions."
    User Prompts: [$('Chat Trigger').message]
  → Answer Node
    Answer: $('LLM').output
```

### Example 2: Knowledge Base Q&A (RAG)

```
Chat Trigger
  → Knowledge Retrieval Node
    Query: $('Chat Trigger').message
    Knowledge Base: "kb_product_docs"
  → Conditional Branch
    Condition: $('Knowledge Retrieval').results.length > 0
    → [True] → LLM Node
      System Prompt: "You are a product support expert. Answer user questions accurately based on provided knowledge base content."
      User Prompts: [`Knowledge base content:

${$('Knowledge Retrieval').results[0].content}

---

User question: ${$('Chat Trigger').message}

Requirements:
1. Answer based on knowledge base
2. Clearly state if content insufficient
3. Provide clear steps or instructions`]
      → Answer Node
    → [False] → Answer Node
      Answer: "Sorry, I couldn't find relevant information. Please contact support."
```

### Example 3: Content Generation

```
Webhook Trigger
  → Entity Recognition Node
    Input: $('Webhook Trigger').body.requirements
    JSON Schema: {
      "properties": {
        "topic": {"type": "string"},
        "tone": {"type": "string"},
        "length": {"type": "number"},
        "keywords": {"type": "array"}
      }
    }
  → LLM Node
    Model: GPT-4
    System Prompt: "You are a professional content creator skilled at writing engaging articles."
    User Prompts: [`Create an article:

Topic: ${$('Entity Recognition').topic}
Style: ${$('Entity Recognition').tone}
Length: About ${$('Entity Recognition').length} words
Keywords: ${$('Entity Recognition').keywords.join(', ')}

Requirements:
1. Original content
2. Clear structure
3. Include introduction, body, conclusion
4. Naturally incorporate keywords`]
  → Answer Node
```

### Example 4: Emotion-aware Response

```
Chat Trigger
  → Sentiment Analysis Node
    Input: $('Chat Trigger').message
  → LLM Node
    System Prompt: `You are a customer service assistant. Adjust response style based on user emotion.

Current user emotion: ${$('Sentiment Analysis').sentiment}
Emotion intensity: ${$('Sentiment Analysis').score}

Response guidelines:
- If user is angry or frustrated, show understanding and apologize
- If user is happy, share their joy
- If user is confused, patiently explain
- Maintain professionalism and empathy`
    User Prompts: [$('Chat Trigger').message]
  → Answer Node
```

## Best Practices

### 1. Write Effective Prompts

**Clear Role Definition**
```javascript
// Good system prompt
"You are an experienced Python developer. When answering:
- Provide runnable code examples
- Explain key concepts
- Point out common pitfalls
- Follow PEP 8 standards"

// Poor system prompt
"You are a programmer"
```

**Specific Instructions**
```javascript
// Good user prompt
`Analyze the following customer feedback and provide:
1. Main issues (list format)
2. Sentiment (positive/negative/neutral)
3. Priority recommendation (high/medium/low)
4. Improvement suggestions (specific and actionable)

Customer feedback: ${feedback}`

// Poor user prompt
"Analyze this feedback"
```

### 2. Optimize Cost and Performance

**Choose Appropriate Model**
```yaml
Simple tasks: GPT-3.5-turbo, Claude Haiku
Complex reasoning: GPT-4, Claude Opus
Long text: Claude 3 series
Code generation: GPT-4
```

**Control Output Length**
```javascript
System Prompt: "Keep answers concise, under 200 words."
```

### 3. Improve Answer Quality

**Provide Context**
```javascript
`User information:
- Membership level: ${userLevel}
- Purchase history: ${purchaseHistory}
- Preferences: ${preferences}

Based on above information, answer user question: ${question}`
```

**Use Chain of Thought**
```javascript
System Prompt: "Before answering, think step by step:
1. Understand the core question
2. List relevant knowledge
3. Reason to conclusion
4. Organize clear answer"
```

### 4. Handle Errors and Edge Cases

**Set Fallback Strategy**
```javascript
LLM Node
  Settings:
    retryOnFail: true
    maxTries: 3
    onError: continueErrorOutput
  → Conditional Branch
    → [Success] → Answer Node
    → [Failure] → Answer Node (Fallback answer)
```

## FAQ

### Q1: What's the difference between LLM node and other AI nodes?

**A**:
- **LLM Node**: General text generation, suitable for open-ended tasks
- **AI Classifier**: Specifically for classification, outputs predefined categories
- **Entity Recognition**: Specifically extracts structured information, outputs conform to JSON Schema
- **Sentiment Analysis**: Specifically analyzes sentiment

**Selection Tip**: If task can be done with specialized node, prefer specialized node (more accurate, faster, cheaper).

### Q2: How to control LLM output format?

**A**: Specify format clearly in prompt:

```javascript
`Output in the following JSON format:
{
  "summary": "Summary content",
  "keyPoints": ["Point 1", "Point 2"],
  "sentiment": "positive/negative/neutral"
}

Do not output anything else.`
```

### Q3: What if LLM output is unstable?

**A**: Multiple methods to improve stability:

1. **More explicit prompts**
2. **Provide examples** (Few-shot learning)
3. **Use more powerful model** (like GPT-4)
4. **Lower temperature** (if API supports)
5. **Post-processing validation and correction**

### Q4: How to handle Token limits?

**A**:
1. **Streamline prompts**
2. **Process long text in segments**
3. **Summarize before processing**
4. **Choose models with larger context**

### Q5: How to prevent LLM from generating harmful content?

**A**:
1. **Set rules in system prompt**
2. **Use content moderation API**
3. **Post-processing filtering**
4. **Logging and monitoring**

### Q6: How to maintain context in multi-turn conversations?

**A**: Use `userPrompts` and `assistantPrompts` arrays:

```javascript
userPrompts: [
  "First question",
  "Second question",
  "Current question"
]

assistantPrompts: [
  "First answer",
  "Second answer"
  // Current answer generated this time
]
```

## Next Steps

- [Knowledge Retrieval Node](/en/guide/workflow/nodes/action-nodes/knowledge-retrieval) - Provide context for LLM
- [AI Classifier](/en/guide/workflow/nodes/action-nodes/ai-classifier) - Route to different prompt templates
- [Sentiment Analysis Node](/en/guide/workflow/nodes/action-nodes/sentiment-analysis) - Adjust LLM response based on sentiment

## Related Resources

- [Answer Node](/en/guide/workflow/nodes/action-nodes/answer) - Return LLM output to users
- [Code Node](/en/guide/workflow/nodes/action-nodes/code) - Process and validate LLM output
- [Expression Syntax](/en/guide/expressions/) - Learn how to use expressions in prompts
