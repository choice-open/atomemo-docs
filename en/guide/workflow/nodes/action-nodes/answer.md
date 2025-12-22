---
title: Answer Node
description: Return final answer to users
---

# Answer Node

The Answer node is used to return a final answer to users in a workflow. It typically serves as the endpoint of chat flows or conversational workflows, sending processed results back to users.

## Use Cases

### Typical Applications
- **Chatbot Replies** - Return AI-generated responses in conversation workflows
- **Q&A Systems** - Return answers from knowledge base retrieval or LLM generation
- **Form Processing Feedback** - Return submission confirmation to users
- **Query Result Display** - Show data query or calculation results
- **Workflow Status Notifications** - Inform users of operation execution status

## Node Configuration

### Basic Settings (Parameters Panel)

#### Answer Content

The content to return to users. This is the only required parameter.

**Field Properties**:
- Required field
- Supports expressions
- Supports multi-line text input
- Supports Markdown format

**Configuration Examples**:

```javascript
// 1. Direct text input
"Thank you for your submission, we'll process it shortly."

// 2. Reference LLM node output
$('LLM').output

// 3. Combine data from multiple nodes
`Hello ${$('Chat Trigger').userName}!

Based on your query, we found the following information:
${$('Knowledge Retrieval').result}

Feel free to reach out if you need further assistance.`

// 4. Use conditional expressions
$('AI Classifier').class === 'urgent'
  ? 'We have marked your issue as urgent. Customer service will contact you within 10 minutes.'
  : 'Thank you for your feedback, we will respond within 24 hours.'

// 5. Format data display
`Query Results:

- Order ID: ${$('HTTP Request').orderId}
- Status: ${$('HTTP Request').status}
- Amount: $${$('HTTP Request').amount}
- Created: ${$('HTTP Request').createdAt}`
```

### Advanced Settings (Settings Panel)

#### Node Description

Add custom description to help team members understand node purpose.

```yaml
nodeDescription: "Return order query results to user"
```

## Output Data

The Answer node typically serves as the workflow endpoint with no subsequent nodes. However, if you need to record or process the returned content, you can access its output:

```javascript
// Get the returned answer content
$('Answer').answer
```

## Workflow Examples

### Example 1: Simple Q&A Bot

```
Chat Trigger
  → LLM Node
    System Prompt: "You are a friendly customer service assistant"
    User Prompt: $('Chat Trigger').userMessage
  → Answer Node
    Answer: $('LLM').output
```

### Example 2: Knowledge Base Q&A System

```
Chat Trigger
  → Knowledge Retrieval
    Query: $('Chat Trigger').question
  → LLM Node
    System Prompt: "Answer user questions based on the following knowledge base content"
    Context: $('Knowledge Retrieval').results
    User Question: $('Chat Trigger').question
  → Answer Node
    Answer: $('LLM').output
```

### Example 3: Differentiated Replies After Classification

```
Chat Trigger
  → AI Classifier
    Input: $('Chat Trigger').message
    Classes: ["Technical Issue", "Account Problem", "General Inquiry"]
  → Conditional Branch
    → [Technical Issue] → LLM (Technical Expert Role) → Answer
    → [Account Problem] → Knowledge Retrieval (Account Docs) → LLM → Answer
    → [General Inquiry] → LLM (Customer Service Role) → Answer
```

### Example 4: Multi-step Task Completion Notification

```
Chat Trigger
  → HTTP Request (Create Order)
  → HTTP Request (Send Confirmation Email)
  → HTTP Request (Update CRM)
  → Answer Node
    Answer: `Your order has been created successfully!

Order Details:
- Order ID: ${$('HTTP Request').orderId}
- Total Amount: $${$('HTTP Request').totalAmount}
- Estimated Delivery: ${$('HTTP Request').estimatedDelivery}

A confirmation email has been sent to your inbox.`
```

### Example 5: Error Handling with Friendly Messages

```
Chat Trigger
  → Conditional Branch (Validate Input)
    → [Valid] → Processing Logic → Answer (Success Message)
    → [Invalid] → Answer Node
      Answer: "Sorry, your input format is incorrect. Please provide a valid order number (format: ORD-XXXXXX)."
```

## Best Practices

### 1. Clear and Friendly Content

**Use Structured Format**
```javascript
// ✅ Good answer - Clear structure
`Query completed!

Your account information:
- Username: ${$('Data Query').username}
- Membership Level: ${$('Data Query').level}
- Points Balance: ${$('Data Query').points}

For help, type "help"`

// ❌ Poor answer - Information dump
`${$('Data Query').username} ${$('Data Query').level} ${$('Data Query').points}`
```

**Use Friendly Tone**
```javascript
// ✅ Friendly
"Thank you for your patience! I've found the relevant information for you..."

// ❌ Blunt
"Query results below:"
```

### 2. Handle Different Scenarios

**Different Feedback for Success and Failure**
```javascript
$('HTTP Request').statusCode === 200
  ? `Operation successful! Your request has been processed.`
  : `Operation failed: ${$('HTTP Request').error.message}

Please try again later or contact support for assistance.`
```

**Adjust Reply Based on Data Volume**
```javascript
$('Knowledge Retrieval').results.length > 0
  ? `Found ${$('Knowledge Retrieval').results.length} relevant items:

${$('Knowledge Retrieval').results.map(r => `- ${r.title}`).join('\n')}`
  : `Sorry, no relevant information found.

You can:
- Try different keywords
- Contact human support
- Visit help center`
```

### 3. Keep It Concise

**Avoid Overly Long Replies**
```javascript
// ✅ Concise and clear
`Order ${$('Query').orderId} status: ${$('Query').status}

Estimated delivery: ${$('Query').eta}`

// ❌ Too verbose
// Contains excessive unnecessary details...
```

**Use Step-by-step Guidance**
```javascript
// For complex operations, guide users step by step
`Step 1 complete! ✓

Next, please provide your contact information to continue.`
```

### 4. Support Multi-language

```javascript
// Return different content based on user language
$('Chat Trigger').language === 'zh'
  ? `您好！${$('LLM').output}`
  : `Hello! ${$('LLM').output_en}`
```

### 5. Add Follow-up Guidance

```javascript
`${$('LLM').output}

---
💡 Other useful commands:
- Type "menu" to view all features
- Type "support" to contact human support
- Type "history" to view conversation history`
```

## FAQ

### Q1: What's the difference between Answer node and LLM node?

**A**:
- **LLM Node**: Calls large language model to generate content, an intermediate processing step
- **Answer Node**: Returns final results to users, the workflow endpoint

**Typical Usage**:
```
LLM Node (Generate Content) → Answer Node (Return to User)
```

### Q2: Can I use multiple Answer nodes in one workflow?

**A**: Yes, you can use multiple Answer nodes in different conditional branches.

**Example**:
```
AI Classifier
  → Conditional Branch
    → [Type A] → Answer Node (Reply A)
    → [Type B] → Answer Node (Reply B)
    → [Type C] → Answer Node (Reply C)
```

Only the Answer node in the executed branch will take effect.

### Q3: What formats does the Answer node support?

**A**: The Answer node supports:
- **Plain Text**: Regular text
- **Markdown**: Formatted text (depending on frontend support)
- **Expressions**: Dynamic content and conditional logic
- **Multi-line Text**: Using template strings

### Q4: How to include line breaks in answers?

**A**: Use template strings (backticks):

```javascript
`First line
Second line
Third line`
```

Or use `\n`:
```javascript
"First line\nSecond line\nThird line"
```

### Q5: Will long answer content be truncated?

**A**: Depends on frontend display limits. Recommendations:
- Break long content into sections
- Provide summary + detail links
- Use pagination or "see more" approach

```javascript
// Provide summary
`Found ${$('Search').total} results, here are the first 5:

${$('Search').results.slice(0, 5).map(r => r.title).join('\n')}

Type "more" to view complete list`
```

### Q6: How to handle special characters in answers?

**A**: Be careful with escaping in expressions:

```javascript
// Use template strings to avoid escaping issues
`Price: $${$('Product').price}
Discount: ${$('Product').discount}%
Description: ${$('Product').description}`
```

### Q7: Can I embed links or buttons in answers?

**A**: Depends on frontend support. If Markdown is supported:

```javascript
`Operation successful!

[View Details](https://example.com/order/${$('Order').id})
[Contact Support](https://example.com/support)`
```

If not supported, use plain text links:
```javascript
`Operation successful!

View Details: https://example.com/order/${$('Order').id}
Contact Support: https://example.com/support`
```

## Next Steps

- [LLM Node](/en/guide/workflow/nodes/action-nodes/llm) - Learn how to generate AI responses
- [Conditional Branch](/en/guide/workflow/nodes/action-nodes/if) - Implement differentiated replies for different conditions
- [Knowledge Retrieval](/en/guide/workflow/nodes/action-nodes/knowledge-retrieval) - Get answer content from knowledge base

## Related Resources

- [Chat Trigger](/en/guide/workflow/nodes/trigger-nodes/chat) - Learn how to receive user messages
- [Expression Syntax](/en/guide/expressions/) - Learn how to dynamically generate answer content
