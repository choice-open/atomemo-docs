---
title: AI Classifier
description: Classify input content using AI models
---

# AI Classifier

The AI Classifier node uses large language models to intelligently classify input text. It can automatically identify content types based on predefined categories, suitable for text classification, sentiment recognition, intent detection, and more.

## Use Cases

### Typical Applications
- **Customer Feedback Classification** - Automatically categorize customer feedback into "Product Issues", "Feature Suggestions", "Usage Questions", etc.
- **Content Moderation** - Identify types of user-generated content (Normal, Spam, Violation, etc.)
- **Intent Recognition** - Identify user intents in dialogue systems (Query, Complaint, Purchase, etc.)
- **Document Classification** - Automatically categorize documents into different topics
- **Sentiment Tendency** - Determine sentiment tendency of text (Positive, Negative, Neutral)

## Node Configuration

### Basic Settings (Parameters Panel)

#### 1. Model

Select the AI model to use for classification.

**Default**: `openai/gpt-4o`

**Supported Models**:
- OpenAI series (GPT-4o, GPT-4, GPT-3.5-turbo, etc.)
- Anthropic Claude series
- Other OpenAI API-compatible models

> **Tip**: For simple classification tasks, use lower-cost models (e.g., GPT-3.5-turbo); complex scenarios recommend GPT-4o.

#### 2. Input Text

The text content to be classified.

**Field Properties**:
- Required field
- Supports expressions
- Supports multi-line text input

**Examples**:
```javascript
// Direct input
"This product quality is excellent, very satisfied"

// Use expression to reference specified node data
$('Webhook Trigger').body.feedback

// Reference other nodes
$('HTTP Request').response.comment
```

#### 3. Classification Classes

Define possible classification categories. The AI will select the most appropriate one from these categories.

**Configuration Requirements**:
- Minimum 1 category required
- Maximum 10 categories supported
- Category names must be unique
- Category names cannot be empty

**Configuration Example**:
```yaml
classes:
  - "Product Issue"
  - "Feature Suggestion"
  - "Usage Question"
  - "Account Problem"
  - "Other"
```

**Best Practices**:
1. Define categories clearly and explicitly, avoid ambiguity or overlap
2. Add an "Other" category as a fallback option
3. Keep categories between 3-7 for optimal accuracy
4. Use descriptive category names for better AI understanding

**Custom Labels**:
- You can rename display labels for each category
- Click the rename button on the category field to modify

### Advanced Settings (Settings Panel)

#### General Settings

**Always Output**
```yaml
alwaysOutput: false  # default false
```
- When enabled, outputs data even if the node fails
- Prevents workflow from stopping at this node

**Execute Once**
```yaml
executeOnce: false  # default false
```
- When enabled, only processes the first item
- Suitable for scenarios requiring single item processing

**Retry on Fail**
```yaml
retryOnFail: false  # default false
maxTries: 3         # maximum retry attempts
waitBetweenTries: 1000  # retry interval (milliseconds)
```
- When enabled, automatically retries on failure
- Configure retry count and interval

**On Error**
```yaml
onError: "stopWorkflow"  # default stop workflow
```

Options:
- **Stop Workflow** - Stops entire workflow on error
- **Continue** - Continues execution with error info as output

**Node Description**
- Add custom description to help team members understand node purpose

## Output Data

### Data Structure

After classification, the node outputs the following data:

```javascript
{
  "class": "Product Issue",   // classification result
  "confidence": 0.95,         // confidence score (0-1)
  "input": "original input"   // original input content
}
```

### Accessing Output Data

Access classification results in subsequent nodes:

```javascript
// Get classification result (reference specified node)
$('AI Classifier').class

// Get confidence score
$('AI Classifier').confidence

// Get original input
$('AI Classifier').input
```

## Workflow Examples

### Example 1: Automatic Customer Feedback Classification and Routing

```
Webhook Trigger (receive feedback)
  → AI Classifier
    classes: ["Product Issue", "Feature Suggestion", "Usage Question", "Account Problem"]
  → Conditional Branch (based on classification)
    → [Product Issue] Notify product team
    → [Feature Suggestion] Add to feature backlog
    → [Usage Question] Send to customer support
    → [Account Problem] Send to technical support
```

### Example 2: Content Moderation Flow

```
Receive User Comment
  → AI Classifier
    classes: ["Normal Content", "Spam", "Violation"]
  → Conditional Branch
    → [Normal Content] Publish comment
    → [Spam] Auto-filter
    → [Violation] Flag and notify moderator
```

### Example 3: Multi-language Intent Recognition

```
Chat Trigger
  → AI Classifier
    input: $('Chat Trigger').userMessage
    classes: ["Information Query", "Complaint", "Purchase Inquiry", "Technical Support", "Small Talk"]
  → Conditional Branch (route by intent)
    → [Information Query] → Knowledge Base Retrieval
    → [Complaint] → Escalate to human
    → [Purchase Inquiry] → Product Recommendation
    → [Technical Support] → Technical Documentation Search
    → [Small Talk] → LLM Node Reply
```

## Best Practices

### 1. Category Design Principles

**Clear and Mutually Exclusive**
```yaml
# ✅ Good design
classes:
  - "Technical Issue"
  - "Account Problem"
  - "Product Inquiry"

# ❌ Poor design (overlapping categories)
classes:
  - "Issue"
  - "Technical Issue"  # overlaps with "Issue"
  - "Inquiry"
```

**Appropriate Granularity**
```yaml
# ✅ Moderate granularity
classes:
  - "Positive"
  - "Neutral"
  - "Negative"

# ❌ Too granular
classes:
  - "Very Satisfied"
  - "Satisfied"
  - "Somewhat Satisfied"
  - "Neutral"
  - "Somewhat Dissatisfied"
  - "Dissatisfied"
  - "Very Dissatisfied"
```

### 2. Improving Classification Accuracy

**Provide Context Information**
```javascript
// ❌ Only single sentence
input: $('Webhook Trigger').message

// ✅ Include context
input: `User Type: ${$('Webhook Trigger').userType}
History: ${$('Webhook Trigger').history}
Current Message: ${$('Webhook Trigger').message}`
```

**Use Descriptive Category Names**
```yaml
# ❌ Vague
classes: ["Type A", "Type B", "Type C"]

# ✅ Descriptive
classes: ["Product Feature Issue", "Account Login Problem", "Payment Related Issue"]
```

### 3. Performance Optimization

**Choose Appropriate Model**
- Simple classification tasks: Use GPT-3.5-turbo (fast, low cost)
- Complex classification tasks: Use GPT-4o (high accuracy)

**Batch Processing**
- For large volumes of text, consider using loop nodes for batch processing
- Set appropriate concurrency control to avoid API rate limiting

### 4. Error Handling

**Add Confidence Check**
```
AI Classifier
  → Conditional Branch (check confidence)
    → [Confidence > 0.8] Auto-process
    → [Confidence < 0.8] Manual review
```

**Set Retry Strategy**
```yaml
retryOnFail: true
maxTries: 3
waitBetweenTries: 2000
```

## FAQ

### Q1: How to handle low confidence classification results?

**A**: Use conditional branches to check confidence:

```
AI Classifier
  → Conditional Branch
    Condition: $('AI Classifier').confidence > 0.7
    → [Yes] Auto-process
    → [No] Flag for manual review
```

### Q2: Is there a limit on the number of categories?

**A**: Yes, category count is limited to 1-10.

**Reasons**:
- Too many categories reduce classification accuracy
- Increases LLM processing difficulty and cost

**Recommendations**:
- For more categories, consider hierarchical classification
- First layer: Coarse classification (e.g., "Technical", "Business", "Other")
- Second layer: Fine-grained classification within each major category

### Q3: How to handle multi-language text?

**A**: Most modern LLMs support multiple languages:

1. **Single Language**: Use directly
2. **Mixed Languages**: Use corresponding language in category names
3. **Auto-detection**: First use language detection node, then choose different classifiers based on language

### Q4: What if classification results are inaccurate?

**A**: Improvement methods:

1. **Optimize Category Definitions**
   - Use more descriptive category names
   - Ensure categories are clearly mutually exclusive

2. **Provide More Context**
   - Add relevant background information
   - Include user historical behavior

3. **Switch Models**
   - Try more powerful models (e.g., GPT-4o)

4. **Add Examples**
   - Include classification examples in input (few-shot learning)

### Q5: How to log classification history for optimization?

**A**: Recommended flow:

```
AI Classifier
  → Conditional Branch (log low confidence results)
    → Save to Database
      - Original text
      - Classification result
      - Confidence score
      - Timestamp
  → Periodically analyze low confidence samples
  → Adjust category definitions or add training data
```

## Next Steps

- [Conditional Branch Node](/en/guide/workflow/nodes/action-nodes/if) - Execute different logic based on classification results
- [LLM Node](/en/guide/workflow/nodes/action-nodes/llm) - Learn more flexible AI processing methods
- [Expression Syntax](/en/guide/expressions/) - Learn how to process node data

## Related Resources

- [Sentiment Analysis Node](/en/guide/workflow/nodes/action-nodes/sentiment-analysis) - Specialized sentiment analysis features
- [Entity Recognition Node](/en/guide/workflow/nodes/action-nodes/entity-recognition) - Extract entity information from text
