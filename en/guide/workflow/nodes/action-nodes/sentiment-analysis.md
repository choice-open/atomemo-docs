---
title: Sentiment Analysis Node
description: Analyze emotional tone of text content to understand user sentiment and attitude
---

# Sentiment Analysis Node

The Sentiment Analysis node uses AI models to analyze the emotional tone of text content, helping you understand user sentiment and attitude. It automatically classifies text as positive, negative, or neutral, and provides sentiment intensity scores.

## Use Cases

### Typical Applications
- **Customer Service Optimization** - Identify dissatisfied customers and prioritize response
- **Product Review Analysis** - Automatically analyze product reviews and user feedback
- **Social Media Monitoring** - Track brand reputation and public sentiment
- **Satisfaction Surveys** - Automatically analyze survey responses
- **Content Moderation** - Identify negative or harmful content
- **Emotion-aware Responses** - Adjust reply strategy based on user emotion
- **Market Research** - Analyze consumer sentiment towards products or brands

## Node Configuration

### Basic Settings (Parameters Panel)

#### Model (model)

Select the AI model for sentiment analysis.

**Field Properties**:
- Required field
- Supports mainstream LLM providers
- Different models vary in accuracy and speed

**Mainstream Model Providers**:
- **OpenAI**: GPT-4, GPT-4 Turbo, GPT-3.5-turbo
- **Anthropic**: Claude 3 Opus, Claude 3 Sonnet, Claude 3 Haiku
- **Google**: Gemini Pro, Gemini Ultra
- **Others**: Local models (Ollama), custom endpoints

**Model Selection Guide**:
```yaml
GPT-4: Highest accuracy, best for handling complex emotions, sarcasm
GPT-3.5-turbo: Good balance of cost and performance
Claude 3 Opus: Strong long text processing, nuanced emotion understanding
Claude 3 Sonnet: Balanced performance, suitable for most scenarios
Claude 3 Haiku: Fast response, suitable for high-concurrency simple scenarios
```

#### Input Text (input)

Text content to analyze.

**Field Properties**:
- Required field
- Supports expressions
- Supports multi-line text

**Configuration Examples**:

```javascript
// 1. Analyze user messages directly
$('Chat Trigger').message

// 2. Analyze specific field
$('HTTP Request').body.feedback

// 3. Analyze combined text
`${$('Entity Recognition').title}: ${$('Entity Recognition').description}`

// 4. Analyze historical conversation
$('LLM').userPrompts.join('\n')
```

#### Output Language (outputLanguage)

Language for emotion labels.

**Field Properties**:
- Optional field
- Default: `chinese`

**Available Values**:
- `chinese` - Output Chinese labels (positive/积极, negative/消极, neutral/中性)
- `english` - Output English labels (positive, negative, neutral)

```javascript
// Chinese output
outputLanguage: 'chinese'
// Result label: "积极" | "消极" | "中性"

// English output
outputLanguage: 'english'
// Result label: "positive" | "negative" | "neutral"
```

#### Neutral Lower Bound (neutralLowerBound)

Lower boundary for neutral emotion range.

**Field Properties**:
- Optional field
- Default: `-0.2`
- Range: -1.0 to 1.0
- Must be less than neutralUpperBound

**Emotion Classification Logic**:
```javascript
// Scores below neutralLowerBound are classified as negative
score < neutralLowerBound  → sentiment: "negative"

// Scores within range are classified as neutral
neutralLowerBound ≤ score ≤ neutralUpperBound  → sentiment: "neutral"

// Scores above neutralUpperBound are classified as positive
score > neutralUpperBound  → sentiment: "positive"
```

**Configuration Examples**:
```javascript
// 1. Strict mode - narrow neutral range
neutralLowerBound: -0.1
neutralUpperBound: 0.1
// More sensitive, easily classified as positive or negative

// 2. Lenient mode - wide neutral range (default)
neutralLowerBound: -0.2
neutralUpperBound: 0.2
// More conservative, more neutral classifications

// 3. Extremely strict mode
neutralLowerBound: -0.05
neutralUpperBound: 0.05
// Almost all classified as positive or negative, rarely neutral
```

#### Neutral Upper Bound (neutralUpperBound)

Upper boundary for neutral emotion range.

**Field Properties**:
- Optional field
- Default: `0.2`
- Range: -1.0 to 1.0
- Must be greater than neutralLowerBound

#### Knowledge Base ID (knowledgeBaseId)

Provide domain-specific context knowledge for more accurate analysis.

**Field Properties**:
- Optional field
- Used when specialized domain sentiment analysis needed

**Configuration Examples**:
```javascript
// 1. Medical domain sentiment analysis
knowledgeBaseId: "kb_medical_terminology"
// Better understanding of medical terminology emotional tone

// 2. Financial domain sentiment analysis
knowledgeBaseId: "kb_financial_reports"
// Better understanding of financial reporting sentiment

// 3. Product review analysis
knowledgeBaseId: "kb_product_features"
// Better understanding of user feedback on specific features
```

#### Allow Model to Improvise (allowImprovise)

Whether to allow model to make inferences when knowledge base context insufficient.

**Field Properties**:
- Optional field
- Default: `false`

**Values**:
- `true` - Model can make inferences beyond knowledge base (more flexible, may be less accurate)
- `false` - Strictly use knowledge base context (more conservative, more accurate)

### Advanced Settings (Settings Panel)

#### Always Output (alwaysOutput)

Output empty item even if analysis fails.

**Default**: `false`

#### Execute Once (executeOnce)

Whether to execute only once using the first input item.

**Default**: `false`

#### Retry on Fail (retryOnFail)

Whether to automatically retry when analysis fails.

**Default**: `false`

#### Max Tries (maxTries)

Maximum number of retries after failure.

**Default**: `3`

#### Wait Between Tries (waitBetweenTries)

Wait time between retries (milliseconds).

**Default**: `1000` (1 second)

#### Error Handling (onError)

How to handle analysis failures.

**Available Values**:
- `stopWorkflow` - Stop entire workflow (default)
- `continueRegularOutput` - Continue execution
- `continueErrorOutput` - Continue with error output

#### Node Description (nodeDescription)

Add custom description for the node.

```yaml
nodeDescription: "Analyze customer feedback sentiment, prioritize negative responses"
```

## Output Data

The Sentiment Analysis node returns structured emotion analysis results.

### Output Structure

```typescript
{
  sentiment: "positive" | "negative" | "neutral",  // Emotion classification
  score: number,      // Emotion intensity score: -1 (extremely negative) to 1 (extremely positive)
  label: string       // Emotion label (based on outputLanguage setting)
}
```

### Output Examples

```javascript
// 1. Positive emotion example
{
  sentiment: "positive",
  score: 0.85,
  label: "positive"  // or "积极" (if outputLanguage is chinese)
}

// 2. Negative emotion example
{
  sentiment: "negative",
  score: -0.72,
  label: "negative"  // or "消极" (if outputLanguage is chinese)
}

// 3. Neutral emotion example
{
  sentiment: "neutral",
  score: 0.05,
  label: "neutral"  // or "中性" (if outputLanguage is chinese)
}
```

### Accessing Output Data

```javascript
// Get emotion classification
$('Sentiment Analysis').sentiment
// Returns: "positive" | "negative" | "neutral"

// Get emotion score
$('Sentiment Analysis').score
// Returns: -1 to 1

// Get emotion label
$('Sentiment Analysis').label
// Returns: "positive" | "negative" | "neutral" (or Chinese equivalents)

// Determine emotion intensity
Math.abs($('Sentiment Analysis').score)
// Returns: 0 to 1, higher values indicate stronger emotion

// Determine if strong positive emotion
$('Sentiment Analysis').sentiment === 'positive' && $('Sentiment Analysis').score > 0.7
```

## Workflow Examples

### Example 1: Customer Feedback Analysis and Routing

```
Chat Trigger
  → Sentiment Analysis Node
    Model: GPT-3.5-turbo
    Input: $('Chat Trigger').message
    Output Language: chinese
    Neutral Lower Bound: -0.2
    Neutral Upper Bound: 0.2
  → Conditional Branch
    Condition 1: $('Sentiment Analysis').sentiment === 'negative' && $('Sentiment Analysis').score < -0.5
      → [True] → Answer Node
        Answer: "We're very sorry for causing you inconvenience. Your feedback has been marked as urgent and will be prioritized by our senior customer service team. We will contact you within 30 minutes."
    Condition 2: $('Sentiment Analysis').sentiment === 'negative'
      → [True] → Answer Node
        Answer: "Thank you for your feedback. We've noted your concerns and will respond soon."
    Condition 3: $('Sentiment Analysis').sentiment === 'positive'
      → [True] → Answer Node
        Answer: "Thank you for your support! We're glad to serve you."
    → [Default] → Answer Node
      Answer: "Thank you for your message, we're processing your request."
```

### Example 2: Emotion-aware Reply

```
Chat Trigger
  → Sentiment Analysis Node
    Model: Claude 3 Sonnet
    Input: $('Chat Trigger').message
  → LLM Node
    System Prompt: `You are a customer service assistant. Adjust reply style based on user emotion.

Current user emotion: ${$('Sentiment Analysis').sentiment}
Emotion intensity: ${$('Sentiment Analysis').score}

Reply guidelines:
- If user angry or frustrated (negative && score < -0.5): Show empathy, apologize sincerely, provide solutions immediately
- If user dissatisfied (negative): Show understanding, explain reasons, provide solutions
- If user satisfied (positive): Express gratitude, maintain enthusiasm
- If user neutral: Be professional, efficient, provide clear information`
    User Prompts: [$('Chat Trigger').message]
  → Answer Node
    Answer: $('LLM').output
```

### Example 3: Real-time Sentiment Monitoring

```
Chat Trigger
  → Sentiment Analysis Node
    Model: GPT-3.5-turbo
    Input: $('Chat Trigger').message
  → Code Node
    Language: JavaScript
    Code: |
      // Record sentiment data
      const sentimentData = {
        userId: $('Chat Trigger').userId,
        message: $('Chat Trigger').message,
        sentiment: $('Sentiment Analysis').sentiment,
        score: $('Sentiment Analysis').score,
        timestamp: new Date().toISOString()
      };

      // If strong negative emotion, trigger alert
      if ($('Sentiment Analysis').sentiment === 'negative' &&
          $('Sentiment Analysis').score < -0.6) {
        sentimentData.alert = true;
        sentimentData.priority = 'high';
      }

      return sentimentData;
  → HTTP Request Node
    Method: POST
    URL: https://api.example.com/sentiment-monitoring
    Body: $('Code').output
```

### Example 4: Dynamic Routing Based on Sentiment

```
Webhook Trigger
  → Entity Recognition Node
    Input: $('Webhook Trigger').body.feedback
    JSON Schema: {
      "properties": {
        "content": {"type": "string"},
        "category": {"type": "string"}
      }
    }
  → Sentiment Analysis Node
    Model: GPT-4
    Input: $('Entity Recognition').content
    Knowledge Base ID: $('Entity Recognition').category === 'product' ? 'kb_product' : 'kb_service'
  → Conditional Branch
    → [negative && score < -0.5] → HTTP Request (Escalate to senior support)
    → [negative] → HTTP Request (Assign to regular support)
    → [neutral] → HTTP Request (Assign to automated reply)
    → [positive] → HTTP Request (Record to satisfaction database)
```

### Example 5: Product Review Batch Analysis

```
HTTP Request Trigger
  → Code Node (Split reviews into array)
  → Sentiment Analysis Node
    Execute Once: false  // Process all reviews
    Input: $('Code').reviews[0].text
  → Code Node
    Language: JavaScript
    Code: |
      // Aggregate sentiment analysis results
      const reviews = $('Code').reviews;
      const sentiments = $('Sentiment Analysis');

      const analysis = {
        total: reviews.length,
        positive: sentiments.filter(s => s.sentiment === 'positive').length,
        negative: sentiments.filter(s => s.sentiment === 'negative').length,
        neutral: sentiments.filter(s => s.sentiment === 'neutral').length,
        avgScore: sentiments.reduce((sum, s) => sum + s.score, 0) / sentiments.length,
        negativeReviews: reviews.filter((r, i) =>
          sentiments[i].sentiment === 'negative' && sentiments[i].score < -0.5
        )
      };

      return analysis;
  → Answer Node
```

### Example 6: Satisfaction Survey Analysis

```
Webhook Trigger
  → Entity Recognition Node
    Input: $('Webhook Trigger').body.surveyResponse
    JSON Schema: {
      "properties": {
        "overallExperience": {"type": "string"},
        "suggestions": {"type": "string"},
        "improvementAreas": {"type": "string"}
      }
    }
  → Sentiment Analysis Node (Overall Experience)
    Input: $('Entity Recognition').overallExperience
  → Sentiment Analysis Node (Suggestions)
    Input: $('Entity Recognition').suggestions
  → Sentiment Analysis Node (Improvement Areas)
    Input: $('Entity Recognition').improvementAreas
  → Code Node
    Language: JavaScript
    Code: |
      return {
        userId: $('Webhook Trigger').body.userId,
        overallSentiment: $('Sentiment Analysis')[0].sentiment,
        overallScore: $('Sentiment Analysis')[0].score,
        suggestionsSentiment: $('Sentiment Analysis')[1].sentiment,
        improvementSentiment: $('Sentiment Analysis')[2].sentiment,
        needsFollowup: $('Sentiment Analysis')[0].score < -0.3
      };
  → HTTP Request Node (Save to database)
```

### Example 7: Multilingual Sentiment Analysis

```
Chat Trigger
  → AI Classifier Node
    Input: $('Chat Trigger').message
    Classes: ["English", "Chinese", "Japanese", "Spanish"]
  → Sentiment Analysis Node
    Model: GPT-4  // Better multilingual support
    Input: $('Chat Trigger').message
    Output Language: $('AI Classifier').class === 'Chinese' ? 'chinese' : 'english'
  → LLM Node
    System Prompt: `Reply in ${$('AI Classifier').class} language. Adjust tone based on user emotion: ${$('Sentiment Analysis').sentiment}`
    User Prompts: [$('Chat Trigger').message]
  → Answer Node
```

## Best Practices

### 1. Choose Appropriate Neutral Range

**Understand Business Requirements**
```javascript
// Customer service scenario - use wider neutral range
// Avoid over-reacting to slightly negative feedback
neutralLowerBound: -0.25
neutralUpperBound: 0.25

// Content moderation scenario - use narrower neutral range
// More sensitive to negative content
neutralLowerBound: -0.15
neutralUpperBound: 0.15

// Market research scenario - use moderate neutral range
// Balance accuracy and sensitivity
neutralLowerBound: -0.2
neutralUpperBound: 0.2
```

### 2. Combine Sentiment Classification and Intensity Score

**Multi-dimensional Analysis**
```javascript
// Don't rely solely on classification
if ($('Sentiment Analysis').sentiment === 'negative') {
  if ($('Sentiment Analysis').score < -0.7) {
    // Strongly negative - immediate attention
  } else if ($('Sentiment Analysis').score < -0.3) {
    // Moderately negative - routine handling
  } else {
    // Slightly negative - monitor
  }
}

// Consider both positive and intensity
if ($('Sentiment Analysis').sentiment === 'positive' &&
    $('Sentiment Analysis').score > 0.8) {
  // Very satisfied customer - potential brand advocate
}
```

### 3. Provide Sufficient Context

**Use Knowledge Base**
```javascript
// For specialized domain analysis, provide domain knowledge base
Sentiment Analysis Node
  Knowledge Base ID: "kb_medical_terminology"
  Input: $('Chat Trigger').message

// Or include context directly in input
Sentiment Analysis Node
  Input: `Product: ${$('Entity Recognition').product}
User Level: ${$('User Data').vipLevel}
Feedback: ${$('Chat Trigger').message}`
```

### 4. Validate and Handle Edge Cases

**Multi-level Validation**
```javascript
Code Node
  Language: JavaScript
  Code: |
    const sentiment = $('Sentiment Analysis');

    // Validate output structure
    if (!sentiment || !sentiment.sentiment || sentiment.score === undefined) {
      return { error: 'Invalid sentiment analysis result' };
    }

    // Handle edge cases
    if (sentiment.sentiment === 'neutral' && Math.abs(sentiment.score) > 0.5) {
      // Classification and score inconsistent, may need reanalysis
      return { warning: 'Sentiment classification inconsistent with score' };
    }

    return sentiment;
```

### 5. Handle Short Text and Mixed Emotions

**Short Text Processing**
```javascript
// For very short text, provide more context
if ($('Chat Trigger').message.length < 10) {
  Sentiment Analysis Node
    Input: `Context: Customer service conversation
Previous messages: ${conversationHistory}
Current message: ${$('Chat Trigger').message}`
}

// For mixed emotions, consider using more powerful model
Sentiment Analysis Node
  Model: GPT-4  // Better at understanding complex emotions
```

### 6. Batch Processing Optimization

**Performance Optimization**
```javascript
// Process multiple texts in batches
Sentiment Analysis Node
  Execute Once: false  // Process all items
  Settings:
    retryOnFail: true
    maxTries: 2

// In Code node, batch process results
Code Node
  Language: JavaScript
  Code: |
    const items = $('Input').items;
    const sentiments = $('Sentiment Analysis');

    // Aggregate statistics
    const stats = {
      totalPositive: sentiments.filter(s => s.sentiment === 'positive').length,
      totalNegative: sentiments.filter(s => s.sentiment === 'negative').length,
      avgScore: sentiments.reduce((sum, s) => sum + s.score, 0) / sentiments.length
    };

    return stats;
```

### 7. Record and Monitor Analysis Results

**Build Sentiment Dataset**
```javascript
Code Node
  Language: JavaScript
  Code: |
    return {
      timestamp: new Date().toISOString(),
      input: $('Chat Trigger').message,
      sentiment: $('Sentiment Analysis').sentiment,
      score: $('Sentiment Analysis').score,
      model: 'GPT-3.5-turbo',
      userId: $('Chat Trigger').userId
    };

HTTP Request Node
  Method: POST
  URL: https://api.example.com/sentiment-logs
  Body: $('Code').output
```

## FAQ

### Q1: How accurate is Sentiment Analysis?

**A**:
Accuracy depends on multiple factors:
1. **Model Selection**: GPT-4 > GPT-3.5 > other models
2. **Text Quality**: Clear, complete text has higher accuracy
3. **Domain Knowledge**: Providing knowledge base improves domain-specific accuracy
4. **Text Length**: Medium-length text (50-500 characters) typically more accurate
5. **Language**: Mainstream languages (English, Chinese) have higher accuracy

**Improve Accuracy**:
- Use more powerful models (GPT-4, Claude 3 Opus)
- Provide domain context via Knowledge Base
- Ensure input text is complete and clear
- For specialized domains, provide sample data for model learning

### Q2: How to handle mixed emotions?

**A**:
Mixed emotion text (both positive and negative elements) may result in neutral classification:

```javascript
// Example: "Product is good but shipping is slow"
Sentiment Analysis Result: {
  sentiment: "neutral",
  score: 0.1  // Slightly positive but close to neutral
}

// Handling strategy 1: Adjust neutral range
neutralLowerBound: -0.1
neutralUpperBound: 0.1
// Narrower neutral range makes classification more sensitive

// Handling strategy 2: Split text analysis
Entity Recognition Node (Extract positive and negative aspects)
  → Sentiment Analysis Node (Analyze separately)

// Handling strategy 3: Use LLM for detailed analysis
LLM Node
  System Prompt: "Analyze text sentiment in detail, explain positive and negative aspects separately"
```

### Q3: Can Sentiment Analysis handle very short text?

**A**:
Short text (less than 10 characters) may be difficult to accurately analyze. Solutions:

```javascript
// 1. Provide more context
if ($('Chat Trigger').message.length < 10) {
  Sentiment Analysis Node
    Input: `Conversation history: ${conversationHistory}
Current message: ${$('Chat Trigger').message}`
}

// 2. Combine with other information
Sentiment Analysis Node
  Input: `User: ${$('User Data').name} (VIP Level: ${$('User Data').level})
Message: ${$('Chat Trigger').message}
Previous sentiment: ${previousSentiment}`

// 3. Set default handling strategy
Code Node
  Code: |
    if ($('Chat Trigger').message.length < 5) {
      return { sentiment: 'neutral', score: 0, note: 'Text too short' };
    }
    return $('Sentiment Analysis');
```

### Q4: How to detect sarcasm or irony?

**A**:
Sarcasm detection is difficult, recommended approaches:

```javascript
// 1. Use more powerful model
Sentiment Analysis Node
  Model: GPT-4  // Better at understanding sarcasm and irony

// 2. Provide cultural context
Sentiment Analysis Node
  Knowledge Base ID: "kb_cultural_context"

// 3. Double verification with LLM
LLM Node
  System Prompt: "Does this text contain sarcasm or irony? If yes, explain true emotional tone."
  User Prompts: [$('Chat Trigger').message]

// 4. Combine other signals
Code Node
  Code: |
    // If literal sentiment conflicts with overall context, may be sarcasm
    const textSentiment = $('Sentiment Analysis').score;
    const contextSentiment = $('Context Analysis').score;

    if (Math.abs(textSentiment - contextSentiment) > 0.5) {
      return { possibleSarcasm: true };
    }
```

### Q5: How is Sentiment Analysis performance and cost?

**A**:

**Performance**:
```yaml
GPT-3.5-turbo: ~1-2 seconds per request
GPT-4: ~2-4 seconds per request
Claude 3 Haiku: ~0.5-1 seconds per request
Claude 3 Sonnet: ~1-2 seconds per request
```

**Cost** (approximate, actual varies by provider):
```yaml
GPT-3.5-turbo: ~$0.001 per analysis
GPT-4: ~$0.03 per analysis
Claude 3 Haiku: ~$0.0005 per analysis
Claude 3 Sonnet: ~$0.003 per analysis
```

**Optimization Recommendations**:
1. For simple scenarios use faster, cheaper models (GPT-3.5, Haiku)
2. For complex emotions or specialized domains use more powerful models
3. For high concurrency, consider caching common queries
4. Use batch processing to improve efficiency

### Q6: Does Sentiment Analysis support multiple languages?

**A**:
Yes, most models support multilingual sentiment analysis:

```javascript
// Automatic language detection and analysis
Sentiment Analysis Node
  Model: GPT-4  // Best multilingual support
  Input: $('Chat Trigger').message  // Any language
  Output Language: 'english'  // Unified output language

// Specify language for better accuracy
AI Classifier Node (Detect language first)
  → Sentiment Analysis Node
    Knowledge Base ID: $('AI Classifier').class === 'Chinese' ? 'kb_zh' : 'kb_en'
```

**Supported Languages**:
- Mainstream models support: English, Chinese, Japanese, Korean, Spanish, French, German, etc.
- GPT-4 and Claude 3 series have best multilingual support
- For specialized languages, test accuracy and consider providing language-specific knowledge base

### Q7: How to adjust Sentiment Analysis sensitivity?

**A**:
Adjust sensitivity via neutral range and model selection:

```javascript
// Low sensitivity (conservative, more neutral)
neutralLowerBound: -0.3
neutralUpperBound: 0.3
// Suitable for: avoiding over-reaction, need clear extreme emotion

// Medium sensitivity (default)
neutralLowerBound: -0.2
neutralUpperBound: 0.2
// Suitable for: most scenarios, balanced approach

// High sensitivity (aggressive, less neutral)
neutralLowerBound: -0.1
neutralUpperBound: 0.1
// Suitable for: need to capture slight emotion changes, content moderation

// Extreme sensitivity (almost no neutral)
neutralLowerBound: -0.05
neutralUpperBound: 0.05
// Suitable for: specialized scenarios, need distinction for any slight emotion
```

### Q8: What do different score ranges mean?

**A**:
Sentiment score interpretation guide:

```javascript
// Extremely negative
score < -0.7: Very strong negative emotion (anger, extreme dissatisfaction)
// Strongly negative
-0.7 ≤ score < -0.5: Clear negative emotion (dissatisfaction, complaint)
// Moderately negative
-0.5 ≤ score < -0.2: Slight negative tendency (concern, doubt)
// Neutral
-0.2 ≤ score ≤ 0.2: Neutral emotion (statement, inquiry)
// Moderately positive
0.2 < score ≤ 0.5: Slight positive tendency (satisfaction, approval)
// Strongly positive
0.5 < score ≤ 0.7: Clear positive emotion (happy, praise)
// Extremely positive
score > 0.7: Very strong positive emotion (excitement, gratitude)
```

**Business Application**:
```javascript
// Customer service priority
if (score < -0.5) {
  priority = 'urgent';  // High-priority handling
} else if (score < -0.2) {
  priority = 'normal';  // Routine handling
} else if (score > 0.7) {
  action = 'collect_testimonial';  // May become brand advocate
}
```

### Q9: Can Sentiment Analysis handle images or audio?

**A**:
Current Sentiment Analysis node only supports text. For multimodal analysis:

```javascript
// Image emotion analysis
// 1. First extract text from image
Image Recognition Node (OCR)
  → Sentiment Analysis Node

// 2. Or use specialized image emotion analysis API
HTTP Request Node
  URL: https://api.example.com/image-emotion

// Audio emotion analysis
// 1. First convert audio to text
Speech-to-Text Node
  → Sentiment Analysis Node

// 2. Or analyze audio emotion directly (tone, speed, volume)
HTTP Request Node
  URL: https://api.example.com/audio-emotion
```

**Future Support**:
Multimodal sentiment analysis (image + text, audio + text) may be supported in future versions, stay tuned for updates.

## Next Steps

- [LLM Node](/en/guide/workflow/nodes/action-nodes/llm) - Generate emotion-aware replies
- [AI Classifier](/en/guide/workflow/nodes/action-nodes/ai-classifier) - Combine sentiment classification with category classification
- [Conditional Branch Node](/en/guide/workflow/nodes/action-nodes/if) - Route based on sentiment results

## Related Resources

- [Knowledge Retrieval Node](/en/guide/workflow/nodes/action-nodes/knowledge-retrieval) - Provide domain context
- [Entity Recognition Node](/en/guide/workflow/nodes/action-nodes/entity-recognition) - Extract structured information from text
- [Code Node](/en/guide/workflow/nodes/action-nodes/code) - Custom sentiment result processing logic
