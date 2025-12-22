---
title: Knowledge Retrieval Tool Node
description: Provide AI Agents with knowledge base retrieval capabilities, enabling AI to search for relevant information from knowledge bases
---

# Knowledge Retrieval Tool Node

The Knowledge Retrieval Tool node provides AI Agents with the ability to retrieve relevant information from knowledge bases. Unlike the Knowledge Retrieval Action node, the Tool version is called autonomously by AI based on conversation needs.

## Use Cases

### Typical Applications
- **Intelligent Q&A Assistant** - AI autonomously retrieves knowledge base content based on user questions
- **Document Search** - AI automatically searches product manuals and technical documents when needed
- **Customer Support** - AI autonomously retrieves relevant solutions based on question types
- **RAG Systems** - Provide context information for AI Agents to enhance answer quality
- **Multi-knowledge Base Switching** - AI selects different knowledge bases based on question domains
- **Dynamic Information Supplement** - AI retrieves additional information on demand during conversations

## Tool vs Action Differences

| Feature | Knowledge Retrieval Action | Knowledge Retrieval Tool |
|---------|----------------------------|--------------------------|
| Execution Method | Direct execution | AI calls on demand |
| Use Case | Fixed retrieval flow | AI Agent retrieves when needed |
| Call Timing | Always executes | AI decides when to call |
| Query Source | Pre-configured | AI extracts from conversation |

**Example Comparison**:
```
Action Method (Fixed Flow):
User Input → Knowledge Retrieval → Use Results

Tool Method (Intelligent Interaction):
User: "What are the features of your product?"
AI: (Identifies need to retrieve product info) → Calls knowledge retrieval tool → Returns results
User: "What's the price?"
AI: (Identifies need to retrieve price info) → Calls knowledge retrieval tool again → Returns results
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
toolName: "searchKnowledgeBase"

// 2. Descriptive tool name
toolName: "queryProductInfo"

// 3. Tool name with prefix
toolName: "kbCompanyFAQ"
```

**Naming Recommendations**:
- **Use camelCase or underscore**: `searchKnowledgeBase` or `search_knowledge_base`
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
"Retrieve content related to query from knowledge base. Input parameters: query (query text). Returns: results (retrieval result array), query (original query). Use when answering questions that require knowledge base reference."

// 2. Explain use cases
"Query product-related information.
Input parameters:
- query: Query text (product name, features, specifications, etc.)
Returns:
- results: Array of matching knowledge snippets
- query: Original query text

Call searchProductInfo tool when user asks about product information."

// 3. Specify knowledge base scope
"Retrieve FAQ answers from company FAQ knowledge base.
Input parameters: query (user question)
Returns: results (matching FAQ entries)
Use case: Call companyFAQSearch tool when user asks common questions."
```

#### Query Text (query)

Query content to retrieve. AI will extract and fill this field from conversation.

**Field Properties**:
- Required field
- Supports expressions
- Supports multi-line text
- AI automatically extracts query content from conversation

**Configuration Examples**:

```javascript
// 1. AI extracts from conversation
query: ""  // AI will automatically fill with user question

// 2. Get from context
query: $('Chat Trigger').message

// 3. Combine multiple information sources
query: `Product: ${$('Entity Recognition').productName}
Query: ${$('Chat Trigger').message}`
```

#### Knowledge Base (knowledgeBaseId)

Select the knowledge base to retrieve from.

**Field Properties**:
- Required field
- Select from created knowledge bases
- Supports expressions (dynamic knowledge base selection)

**Configuration Examples**:

```javascript
// 1. Static selection
knowledgeBaseId: "kb_product_manual_2024"

// 2. Dynamic selection based on classification
knowledgeBaseId: $('AI Classifier').class === "technical"
  ? "kb_technical_docs"
  : "kb_general_faq"

// 3. Read from config
knowledgeBaseId: $('Config').knowledgeBaseId
```

### Advanced Settings (Settings Panel)

#### Node Description (nodeDescription)

Add custom description for the node.

```yaml
nodeDescription: "Product information retrieval tool"
```

## Output Data

Returns array of retrieved knowledge snippets.

**Output Structure**:

```javascript
{
  results: [
    {
      content: "Knowledge snippet content",
      score: 0.85,           // Relevance score (0-1)
      metadata: {            // Metadata information
        source: "Document source",
        title: "Document title",
        page: 12,
        url: "https://..."
      }
    },
    // ... more results
  ],
  query: "Original query text"
}
```

**Access Output**:

```javascript
// Get all results
$('Knowledge Retrieval Tool').results

// Get first result content
$('Knowledge Retrieval Tool').results[0].content

// Get first result relevance score
$('Knowledge Retrieval Tool').results[0].score

// Get metadata
$('Knowledge Retrieval Tool').results[0].metadata.source
```

## Workflow Examples

### Example 1: Intelligent Q&A Assistant

```
Chat Trigger
  → AI Agent Node
    System Prompt: "You are an intelligent customer service assistant that can answer various user questions about products."
    
    Tools: [Knowledge Retrieval Tool]
      Tool Name: "searchProductInfo"
      Tool Description: "Retrieve product-related information from product knowledge base. Input: query (query text). Returns: results (retrieval results). Call this tool when user asks about product information."
      Knowledge Base: "kb_product_manual"
      Query: ""  // AI extracts from conversation
  → Answer Node

Conversation example:
User: "What are the features of your product?"
AI: (Calls searchProductInfo tool, query="product features")
Retrieval results: [Knowledge snippets containing product features]
AI: "According to our product manual, our products have the following features:..."

User: "What's the price?"
AI: (Calls searchProductInfo tool, query="price")
Retrieval results: [Knowledge snippets containing price information]
AI: "Product prices vary by configuration, price range is..."
```

### Example 2: Multi-knowledge Base Intelligent Retrieval

```
Chat Trigger
  → AI Agent Node
    System Prompt: "You are an intelligent assistant that can answer technical questions and common questions."
    
    Tools: [
      Tool 1 - Knowledge Retrieval Tool (Technical Docs)
        Tool Name: "searchTechnicalDocs"
        Tool Description: "Retrieve technical question answers from technical documentation library. Input: query. Returns: results. Call when user asks technical questions."
        Knowledge Base: "kb_technical_docs"
      
      Tool 2 - Knowledge Retrieval Tool (FAQ)
        Tool Name: "searchFAQ"
        Tool Description: "Retrieve common question answers from FAQ knowledge base. Input: query. Returns: results. Call when user asks common questions."
        Knowledge Base: "kb_faq"
    ]
  → Answer Node

Conversation example:
User: "How to install?"
AI: (Identifies as technical question) → Calls searchTechnicalDocs
Retrieval results: [Installation steps documentation]
AI: "According to technical documentation, installation steps are:..."

User: "Do you support refunds?"
AI: (Identifies as common question) → Calls searchFAQ
Retrieval results: [Refund policy FAQ]
AI: "According to our FAQ, refund policy is..."
```

### Example 3: Conversational Information Collection

```
Chat Trigger
  → AI Agent Node
    System Prompt: "You are a product consultant helping users understand product information."
    
    Tools: [Knowledge Retrieval Tool]
      Tool Name: "queryProductDetails"
      Tool Description: "Retrieve detailed product information. Input: query (product name or features). Returns: results (product information)."
      Knowledge Base: "kb_products"
  → Answer Node

Conversation example:
User: "I want to learn about laptops"
AI: (Calls queryProductDetails, query="laptops")
Retrieval results: [Multiple laptop product information]
AI: "We have multiple laptop products, including..."

User: "Any lightweight ones?"
AI: (Calls queryProductDetails, query="lightweight laptops")
Retrieval results: [Lightweight model information]
AI: "Yes, we have the following lightweight models:..."
```

## Best Practices

### 1. Write Clear Tool Descriptions

**Good tool description**:
```
"Retrieve product information from product knowledge base.
Input parameters:
- query: Query text (product name, features, specifications, etc.)
Returns:
- results: Array of matching knowledge snippets, each containing content, relevance score, and metadata
- query: Original query text

Use cases:
- User asks about product features
- User asks about product specifications
- User asks about product pricing
- User needs product comparison

Example: Call searchProductInfo tool when user says 'what features does this product have'."
```

### 2. Reasonably Configure Knowledge Bases

```javascript
// 1. Select knowledge base based on domain
knowledgeBaseId: "kb_product_info"  // Product-related

// 2. Dynamic knowledge base selection
knowledgeBaseId: $('AI Classifier').category === "technical"
  ? "kb_technical"
  : "kb_general"

// 3. Multiple tools use different knowledge bases
Tool 1: knowledgeBaseId: "kb_products"      // Product library
Tool 2: knowledgeBaseId: "kb_support"       // Support library
Tool 3: knowledgeBaseId: "kb_pricing"       // Pricing library
```

### 3. Handle Retrieval Results

```javascript
// AI automatically handles retrieval results, but can guide in System Prompt
System Prompt: `After calling knowledge retrieval tool:
1. Check relevance scores of retrieval results
2. If highest score >= 0.7, use that result to answer
3. If highest score < 0.7, tell user information may not be accurate
4. If results are empty, explain no relevant information in knowledge base`
```

### 4. Optimize Query Extraction

```javascript
// Help AI understand how to extract queries in tool description
toolDescription: `Retrieve product information.
Input parameters: query (keywords extracted from user questions, such as product name, features, specifications, etc.)
Examples:
- User says "what features does this product have" → query="product features"
- User says "what's the price" → query="price"
- User says "what systems are supported" → query="system requirements"`
```

## FAQ

### Q1: How does AI know when to call knowledge retrieval tool?

**A**:
AI decides based on:
1. **Tool description**: Whether it matches user question type
2. **Conversation context**: Whether knowledge base content reference is needed
3. **Question complexity**: Whether additional information is needed to answer

**Optimization advice**:
- Clearly state use cases in tool description
- Provide call examples
- Explain knowledge base scope being retrieved

### Q2: How to handle empty retrieval results?

**A**:
AI automatically handles:
```
If retrieval results are empty:
1. AI will identify no relevant information found
2. Can tell user no relevant content in knowledge base
3. Suggest user try different wording or contact human support
```

### Q3: Can multiple knowledge bases be used simultaneously?

**A**:
Yes! Create multiple knowledge retrieval tool nodes, each using different knowledge base:

```javascript
Tools: [
  Tool 1: knowledgeBaseId: "kb_products"      // Product library
  Tool 2: knowledgeBaseId: "kb_support"       // Support library
  Tool 3: knowledgeBaseId: "kb_pricing"       // Pricing library
]

AI will select appropriate tool to call based on question type.
```

### Q4: How to improve retrieval accuracy?

**A**:

**1. Optimize knowledge base content**
- Ensure knowledge base content is complete and accurate
- Use clear document structure
- Add appropriate metadata

**2. Optimize tool description**
```javascript
toolDescription: `Retrieve technical documentation.
Input parameters: query (technical keywords, such as "installation", "configuration", "troubleshooting", etc.)
Returns: results (relevant technical documentation snippets)
Note: Query should include specific technical keywords`
```

**3. Use relevance scores**
```javascript
System Prompt: `When using knowledge retrieval results:
- Prioritize results with relevance score >= 0.7
- If all results score < 0.7, inform user may need more precise question`
```

### Q5: Can the tool be called multiple times?

**A**:
Yes! AI can call multiple times in same conversation:

```
User: "What features does this product have?"
AI: (1st call) → Retrieves product feature information

User: "What's the price?"
AI: (2nd call) → Retrieves price information

User: "What colors are available?"
AI: (3rd call) → Retrieves color option information
```

## Next Steps

- [AI Agent Node](/en/guide/workflow/nodes/action-nodes/ai-agent) - Learn how to use AI Agents
- [Knowledge Retrieval Action Node](/en/guide/workflow/nodes/action-nodes/knowledge-retrieval) - Learn about Action version
- [HTTP Request Tool Node](/en/guide/workflow/nodes/tool-nodes/http-request) - Combine with API calls

## Related Resources

- [Entity Recognition Tool Node](/en/guide/workflow/nodes/tool-nodes/entity-recognition) - Extract query keywords from conversation
- [Expression Syntax](/en/guide/expressions/) - Learn how to use expressions in configuration

