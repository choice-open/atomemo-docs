---
title: Sentiment Analysis Tool Node
description: Provide AI Agents with sentiment analysis capabilities, enabling AI to identify and understand user emotional states
---

# Sentiment Analysis Tool Node

The Sentiment Analysis Tool node provides AI Agents with the ability to analyze text sentiment tendency and intensity. Unlike the Sentiment Analysis Action node, the Tool version is called autonomously by AI based on conversation needs.

## Use Cases

### Typical Applications
- **Intelligent Customer Service Optimization** - AI identifies user emotions, prioritizes negative feedback
- **Emotional Conversations** - AI adjusts reply style and content based on user sentiment
- **Conversation Routing** - AI routes conversations to different processes based on sentiment
- **Public Opinion Monitoring** - AI automatically analyzes sentiment trends in user feedback
- **Risk Warning** - AI identifies angry or frustrated users, intervenes promptly
- **Satisfaction Assessment** - AI automatically assesses customer satisfaction with products or services

## Tool vs Action Differences

| Feature | Sentiment Analysis Action | Sentiment Analysis Tool |
|---------|--------------------------|------------------------|
| Execution Method | Direct execution | AI calls on demand |
| Use Case | Fixed sentiment analysis flow | AI Agent analyzes sentiment when needed |
| Call Timing | Always executes | AI decides when to call |
| Input Source | Pre-configured | AI extracts text from conversation |

**Example Comparison**:
```
Action Method (Fixed Flow):
User Input → Sentiment Analysis → Process Based on Sentiment

Tool Method (Intelligent Interaction):
User: "This product is terrible, I want a refund!"
AI: (Identifies need to analyze sentiment) → Calls sentiment analysis tool → Identifies negative → Adjusts reply strategy
User: "Amazing, I'm very satisfied!"
AI: (Identifies need to analyze sentiment) → Calls sentiment analysis tool → Identifies positive → Expresses gratitude
```

## Node Configuration

### Basic Settings (Parameters Panel)

#### Tool Name (toolName)

Unique identifier used by AI Agent to call the tool.

**Field Properties**:
- Required field
- Must be unique within the workflow
- Does not support expressions
- Format requirements:
  - Only letters, numbers, underscores, and hyphens allowed
  - Must start with a letter
  - Cannot duplicate tool names of other tool nodes in the workflow

**Configuration Examples**:

```javascript
// 1. Concise and clear tool name
toolName: "analyzeSentiment"

// 2. Descriptive tool name
toolName: "detectUserEmotion"

// 3. Tool name with prefix
toolName: "sentimentAnalysisTool"
```

**Naming Recommendations**:
- **Use camelCase or underscore**: `analyzeSentiment` or `analyze_sentiment`
- **Self-explanatory**: Name should clearly express tool functionality
- **Avoid too long**: Recommended within 20 characters
- **Avoid special characters**: Only use letters, numbers, underscores, and hyphens

**Important Notes**:
- AI Agent identifies and calls tools by tool name, not node name
- Tool name must be unique in the workflow; duplicate names will automatically get a suffix
- English naming is recommended for consistency with AI calls

#### Tool Description (toolDescription)

Describes the tool's functionality and use cases. AI decides when to call based on description.

**Field Properties**:
- Required field
- Supports expressions
- Supports multi-line text

**Configuration Examples**:

```javascript
// 1. Clearly describe tool functionality
"Analyze text sentiment tendency and intensity. Input parameters: input (text to analyze). Returns: sentiment (sentiment classification), score (sentiment intensity), label (sentiment label). Use when identifying user emotional states."

// 2. Explain use cases
"Analyze sentiment tendency of user messages.
Input parameters:
- input: User message text
Returns:
- sentiment: Sentiment classification ("positive" | "negative" | "neutral")
- score: Sentiment intensity score (-1 to 1)
- label: Sentiment label (e.g., "positive", "negative", "neutral")

Call analyzeSentiment tool when need to understand user emotions."

// 3. Explain special purpose
"Identify sentiment tendency of customer feedback for prioritizing negative feedback.
Input: input (customer feedback text)
Returns: sentiment, score, label
Use case: Call detectCustomerSentiment tool when analyzing customer reviews, complaints, suggestions."
```

#### Model (model)

Select AI model for sentiment analysis.

**Field Properties**:
- Required field
- Supports mainstream LLM providers
- Model selection affects analysis accuracy

**Recommended Models**:
```yaml
GPT-3.5-turbo: Cost-effective, suitable for most scenarios
GPT-4: Higher accuracy, complex sentiment recognition
Claude: Good at nuanced sentiment analysis
```

#### Input Text (input)

Text content to analyze sentiment. AI will extract and fill this field from conversation.

**Field Properties**:
- Required field
- Supports expressions
- Supports multi-line text
- AI automatically extracts text from conversation

**Configuration Examples**:

```javascript
// 1. AI extracts from conversation
input: ""  // AI will automatically fill with user message

// 2. Get from context
input: $('Chat Trigger').message

// 3. Combine multiple information sources
input: `User feedback: ${$('Chat Trigger').message}
Historical reviews: ${$('Previous Reviews').averageRating}`
```

#### Neutral Sentiment Lower Bound (neutralLowerBound)

Lower bound score for neutral sentiment.

**Field Properties**:
- Number type
- Range: -1 to 1
- Default: `-0.2`

**Description**: Scores within [neutralLowerBound, neutralUpperBound] are classified as neutral sentiment.

#### Neutral Sentiment Upper Bound (neutralUpperBound)

Upper bound score for neutral sentiment.

**Field Properties**:
- Number type
- Range: -1 to 1
- Default: `0.2`

**Description**:
- Score > neutralUpperBound: Positive sentiment
- Score < neutralLowerBound: Negative sentiment
- Score between bounds: Neutral sentiment

#### Knowledge Base (knowledgeBaseId)

Optional, used to provide context reference for sentiment analysis.

**Field Properties**:
- Optional field
- Used for domain-specific sentiment analysis

#### Allow Improvise (allowImprovise)

Whether to allow AI to output custom sentiment labels beyond predefined sentiments.

**Default**: `false`

#### Custom Labels (customLabels)

Provide custom display labels for fields.

**Field Properties**:
- Optional field
- Key-value pair format

### Advanced Settings (Settings Panel)

#### Always Output (alwaysOutput)

Whether to output empty item even on analysis failure.

**Default**: `false`

#### Execute Once (executeOnce)

Whether to execute only once using first input item.

**Default**: `false`

#### Retry on Fail (retryOnFail)

Whether to automatically retry on analysis failure.

**Default**: `false`

#### Max Tries (maxTries)

Maximum retries after failure.

**Default**: `3`

#### Wait Between Tries (waitBetweenTries)

Wait time between retries (milliseconds).

**Default**: `1000` (1 second)

#### Node Description (nodeDescription)

Add custom description for the node.

```yaml
nodeDescription: "Analyze sentiment tendency of customer feedback"
```

## Output Data

Returns sentiment classification and score.

**Output Structure**:

```javascript
{
  sentiment: "positive",  // Sentiment classification: positive/negative/neutral
  score: 0.85,           // Sentiment intensity score: -1 (extremely negative) to 1 (extremely positive)
  label: "Positive"      // Sentiment label
}
```

**Access Output**:

```javascript
// Get sentiment classification
$('Sentiment Analysis Tool').sentiment

// Get sentiment intensity
$('Sentiment Analysis Tool').score

// Get sentiment label
$('Sentiment Analysis Tool').label

// Conditional judgment
$('Sentiment Analysis Tool').sentiment === "positive"
```

## Workflow Examples

### Example 1: Intelligent Customer Service Sentiment Recognition

```
Chat Trigger
  → AI Agent Node
    System Prompt: "You are an intelligent customer service assistant that needs to identify user emotions and provide corresponding service."
    
    Tools: [Sentiment Analysis Tool]
      Tool Name: "analyzeSentiment"
      Tool Description: "Analyze sentiment tendency of user messages. Input: input (user message). Returns: sentiment (sentiment classification), score (sentiment intensity), label (sentiment label). Call this tool when need to understand user emotions."
      Model: "GPT-3.5-turbo"
      Input: ""  // AI extracts from conversation
  → Answer Node

Conversation example:
User: "This product is terrible, I want a refund!"
AI: (Calls analyzeSentiment tool)
Analysis result: {sentiment: "negative", score: -0.8, label: "Negative"}
AI: "I'm very sorry for the inconvenience. I understand your dissatisfaction, let me handle the refund for you immediately..."

User: "Amazing, I'm very satisfied with this feature!"
AI: (Calls analyzeSentiment tool)
Analysis result: {sentiment: "positive", score: 0.9, label: "Positive"}
AI: "Glad to hear you're satisfied! Thank you for your feedback, we'll continue to work hard..."
```

### Example 2: Emotional Conversation Routing

```
Chat Trigger
  → AI Agent Node
    System Prompt: "You are a customer service assistant providing different services based on user sentiment."
    
    Tools: [Sentiment Analysis Tool]
      Tool Name: "detectEmotion"
      Tool Description: "Detect user emotional state. Input: input. Returns: sentiment, score."
      Model: "GPT-4"
  → Conditional Branch
    Condition: $('Sentiment Analysis Tool').sentiment === "negative" && $('Sentiment Analysis Tool').score < -0.7
    → [True] → AI Agent (Urgent handling flow)
      System Prompt: "User emotion is very negative, need immediate comfort and problem solving"
    → [False] → Answer Node (Normal flow)
```

### Example 3: Satisfaction Assessment

```
Chat Trigger
  → AI Agent Node
    System Prompt: "You are a customer satisfaction survey assistant."
    
    Tools: [Sentiment Analysis Tool]
      Tool Name: "evaluateSatisfaction"
      Tool Description: "Assess customer satisfaction. Input: input (customer feedback). Returns: sentiment, score."
      Model: "GPT-3.5-turbo"
  → Code Node
    Code: |
      const sentiment = $('Sentiment Analysis Tool');
      const satisfaction = sentiment.sentiment === "positive" && sentiment.score > 0.6
        ? "high"
        : sentiment.sentiment === "negative" && sentiment.score < -0.6
        ? "low"
        : "medium";
      
      return { satisfaction, ...sentiment };
  → Answer Node
```

## Best Practices

### 1. Write Clear Tool Descriptions

**Good tool description**:
```
"Analyze sentiment tendency and intensity of user messages.
Input parameters:
- input: User message text
Returns:
- sentiment: Sentiment classification ("positive" | "negative" | "neutral")
- score: Sentiment intensity score (-1 to 1)
- label: Sentiment label

Use cases:
- Identify user emotional states
- Determine if urgent handling is needed
- Adjust reply strategy and tone

Example: Call analyzeSentiment tool when user expresses strong dissatisfaction or satisfaction."
```

### 2. Reasonably Set Neutral Sentiment Range

```javascript
// 1. Default settings (relatively loose)
neutralLowerBound: -0.2
neutralUpperBound: 0.2

// 2. Strict settings (more biased toward clear sentiment)
neutralLowerBound: -0.1
neutralUpperBound: 0.1

// 3. Loose settings (more neutral judgments)
neutralLowerBound: -0.3
neutralUpperBound: 0.3
```

### 3. Guide AI Usage in System Prompt

```javascript
System Prompt: `After calling sentiment analysis tool:
1. If sentiment === "negative" && score < -0.7:
   - Express understanding and apology
   - Provide solutions
   - Ask if further help is needed

2. If sentiment === "positive" && score > 0.7:
   - Express gratitude and happiness
   - Encourage continued use
   - Can recommend related products

3. If sentiment === "neutral":
   - Maintain professional and friendly tone
   - Answer questions normally`
```

### 4. Combine with Other Tools

```javascript
Tools: [
  Tool 1 - Sentiment Analysis Tool
    Tool Name: "analyzeSentiment"
    Tool Description: "Analyze user sentiment"
  
  Tool 2 - HTTP Request Tool
    Tool Name: "escalateToHuman"
    Tool Description: "Escalate to human customer service"
  
  Tool 3 - Code Tool
    Tool Name: "recordFeedback"
    Tool Description: "Record user feedback"
]

// AI will decide whether to escalate to human or record feedback based on sentiment analysis results
```

## FAQ

### Q1: How does AI know when to call sentiment analysis tool?

**A**:
AI decides based on:
1. **Tool description**: Whether it mentions need to identify user emotions
2. **Conversation context**: Whether user messages express strong emotions
3. **Task requirements**: Whether need to adjust strategy based on sentiment

**Optimization advice**:
- Clearly state use cases in tool description
- Provide call examples
- Explain sentiment types being analyzed

### Q2: How to handle mixed sentiment?

**A**:
Sentiment analysis tool returns overall sentiment tendency:
```javascript
// If user says "Product quality is good, but customer service attitude is poor"
// Tool will analyze overall sentiment, may return:
{
  sentiment: "negative",  // Overall biased toward negative
  score: -0.3,           // Medium negative intensity
  label: "Negative"
}
```

### Q3: How to improve sentiment analysis accuracy?

**A**:

**1. Choose appropriate model**
```javascript
// Use stronger model for complex sentiment analysis
model: "GPT-4"  // Instead of GPT-3.5
```

**2. Use knowledge base to provide context**
```javascript
knowledgeBaseId: "kb_customer_feedback"  // Domain-specific sentiment analysis
```

**3. Adjust neutral sentiment range**
```javascript
// Adjust based on business requirements
neutralLowerBound: -0.1  // Stricter neutral judgment
neutralUpperBound: 0.1
```

### Q4: Can sentiment analysis tool be called multiple times?

**A**:
Yes! AI can call multiple times in same conversation:

```
User: "This product doesn't work well"
AI: (1st call) → Identifies negative sentiment
AI: "Sorry, can you describe the problem in detail?"

User: "Much better now, thanks!"
AI: (2nd call) → Identifies positive sentiment
AI: "Glad the problem is solved!"
```

### Q5: How to take action based on sentiment analysis results?

**A**:

**Option 1: Guide in System Prompt**
```javascript
System Prompt: `Based on sentiment analysis results:
- Negative and strong (score < -0.7): Immediately provide solutions, escalate to human if necessary
- Positive and strong (score > 0.7): Express gratitude, can recommend related products
- Neutral: Handle normally`
```

**Option 2: Combine with conditional branch**
```
AI Agent (Calls sentiment analysis tool)
  → Conditional Branch
    Condition: sentiment === "negative" && score < -0.7
    → [True] → Escalate to human customer service
    → [False] → Continue conversation
```

## Next Steps

- [AI Agent Node](/en/guide/workflow/nodes/action-nodes/ai-agent) - Learn how to use AI Agents
- [Sentiment Analysis Action Node](/en/guide/workflow/nodes/action-nodes/sentiment-analysis) - Learn about Action version
- [Entity Recognition Tool Node](/en/guide/workflow/nodes/tool-nodes/entity-recognition) - Extract information from conversation

## Related Resources

- [HTTP Request Tool Node](/en/guide/workflow/nodes/tool-nodes/http-request) - Combine with API calls
- [Expression Syntax](/en/guide/expressions/) - Learn how to use expressions in configuration

