---
title: Knowledge Retrieval Node
description: Retrieve relevant information from knowledge base
---

# Knowledge Retrieval Node

The Knowledge Retrieval node is used to retrieve relevant information from pre-built knowledge bases. It uses vector search technology to return the most relevant knowledge fragments based on semantic similarity, making it a core node for building RAG (Retrieval-Augmented Generation) systems.

## Use Cases

### Typical Applications
- **Intelligent Q&A** - Retrieve answers from enterprise knowledge base to answer user questions
- **Document Retrieval** - Find relevant content in product manuals and technical documentation
- **Customer Support** - Retrieve FAQs and solutions
- **Content Recommendation** - Recommend related articles or resources based on user queries
- **RAG Systems** - Provide context for LLMs to enhance generation quality
- **Semantic Search** - Intelligent search based on semantic similarity rather than keywords
- **Knowledge Discovery** - Discover knowledge base content related to specific topics

## Node Configuration

### Basic Settings (Parameters Panel)

#### Query Text (query)

The query content to retrieve.

**Field Properties**:
- Required field
- Supports expressions
- Supports multi-line text

**Configuration Examples**:

```javascript
// 1. Reference user question
$('Chat Trigger').message

// 2. Reference Webhook data
$('Webhook Trigger').body.question

// 3. Use extracted entities
$('Entity Recognition').query

// 4. Concatenate multiple fields to build query
`${$('AI Classifier').class} ${$('Chat Trigger').keywords}`

// 5. Use Code node processed query
$('Code').processedQuery
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
"kb_product_manual_2024"

// 2. Dynamic selection based on classification
$('AI Classifier').class === "technical"
  ? "kb_technical_docs"
  : "kb_general_faq"

// 3. Read from configuration
$('Config').knowledgeBaseId
```

### Advanced Settings (Settings Panel)

#### Node Description (nodeDescription)

Add custom description for the node.

```yaml
nodeDescription: "Retrieve relevant content from product manual"
```

## Output Data

The Knowledge Retrieval node returns an array of matched knowledge fragments, each containing content and relevance score.

**Output Structure**:

```javascript
{
  results: [
    {
      content: "Knowledge fragment content",
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
$('Knowledge Retrieval').results

// Get first result content
$('Knowledge Retrieval').results[0].content

// Get first result relevance
$('Knowledge Retrieval').results[0].score

// Get result count
$('Knowledge Retrieval').results.length

// Get metadata
$('Knowledge Retrieval').results[0].metadata.source
$('Knowledge Retrieval').results[0].metadata.title

// Get original query
$('Knowledge Retrieval').query
```

## Workflow Examples

### Example 1: Basic Knowledge Q&A

```
Chat Trigger
  → Knowledge Retrieval Node
    Query: $('Chat Trigger').message
    Knowledge Base: "kb_company_faq"
  → Conditional Branch
    Condition: $('Knowledge Retrieval').results.length > 0
    → [True] → LLM Node
      System Prompt: "Answer user question based on the following knowledge base content"
      Context: $('Knowledge Retrieval').results[0].content
      User Question: $('Chat Trigger').message
      → Answer Node
    → [False] → Answer Node
      Answer: "Sorry, I couldn't find relevant information. Please rephrase your question or contact support."
```

### Example 2: High Quality Result Filtering

```
Chat Trigger
  → Knowledge Retrieval Node
    Query: $('Chat Trigger').message
    Knowledge Base: "kb_technical_docs"
  → Conditional Branch
    Condition (AND):
      - $('Knowledge Retrieval').results.length > 0
      - $('Knowledge Retrieval').results[0].score >= 0.7
    → [True] → LLM Node
      Prompt: `Answer question based on high-relevance content:

      ${$('Knowledge Retrieval').results[0].content}

      Question: ${$('Chat Trigger').message}`
      → Answer Node
    → [False] → Answer Node
      Answer: "Found some related information, but relevance is low. Suggestions:
      1. Try different keywords
      2. Provide more context
      3. Contact professional support"
```

### Example 3: Multiple Results Comprehensive Answer

```
Chat Trigger
  → Knowledge Retrieval Node
    Query: $('Chat Trigger').message
    Knowledge Base: "kb_product_info"
  → Code Node
    Inputs:
      - results: $('Knowledge Retrieval').results
    Code:
      function main({results}) {
          // Filter high score results
          const highScoreResults = results.filter(r => r.score >= 0.6)

          // Limit quantity
          const topResults = highScoreResults.slice(0, 3)

          // Format as context
          const context = topResults
              .map((r, i) => `[Source ${i+1}]: ${r.content}`)
              .join('\n\n')

          return {
              context,
              count: topResults.length
          }
      }
    Outputs:
      - context: string
      - count: number
  → LLM Node
    Prompt: `Based on ${$('Code').count} knowledge base entries, comprehensively answer:

    ${$('Code').context}

    Question: ${$('Chat Trigger').message}

    Requirements:
    1. Synthesize information from multiple sources
    2. Point out contradictions if any
    3. Cite sources`
    → Answer Node
```

### Example 4: Dynamic Knowledge Base Selection

```
Chat Trigger
  → AI Classifier
    Input: $('Chat Trigger').message
    Classes: ["Product Inquiry", "Technical Support", "After Sales", "General Question"]
  → Code Node
    Inputs:
      - category: $('AI Classifier').class
    Code:
      function main({category}) {
          const knowledgeBaseMap = {
              "Product Inquiry": "kb_product_catalog",
              "Technical Support": "kb_technical_docs",
              "After Sales": "kb_after_sales",
              "General Question": "kb_general_faq"
          }

          return {
              knowledgeBaseId: knowledgeBaseMap[category] || "kb_general_faq"
          }
      }
    Outputs:
      - knowledgeBaseId: string
  → Knowledge Retrieval Node
    Query: $('Chat Trigger').message
    Knowledge Base: $('Code').knowledgeBaseId
  → LLM Node → Answer Node
```

### Example 5: Result Source Attribution

```
Chat Trigger
  → Knowledge Retrieval Node
    Query: $('Chat Trigger').message
    Knowledge Base: "kb_documentation"
  → Code Node
    Inputs:
      - results: $('Knowledge Retrieval').results
    Code:
      function main({results}) {
          if (results.length === 0) {
              return {
                  hasResults: false,
                  formattedAnswer: ""
              }
          }

          const topResult = results[0]
          const answer = `${topResult.content}\n\n---\nSource: ${topResult.metadata.title}\nPage: ${topResult.metadata.page}\nRelevance: ${(topResult.score * 100).toFixed(0)}%`

          return {
              hasResults: true,
              formattedAnswer: answer,
              sourceUrl: topResult.metadata.url
          }
      }
    Outputs:
      - hasResults: boolean
      - formattedAnswer: string
      - sourceUrl: string
  → Conditional Branch
    Condition: $('Code').hasResults === true
    → [True] → Answer Node
      Answer: `${$('Code').formattedAnswer}

View full documentation: ${$('Code').sourceUrl}`
    → [False] → Answer Node
      Answer: "No relevant information found"
```

### Example 6: Similar Question Recommendations

```
Chat Trigger
  → Knowledge Retrieval Node
    Query: $('Chat Trigger').message
    Knowledge Base: "kb_faq"
  → Code Node
    Inputs:
      - results: $('Knowledge Retrieval').results
      - userQuery: $('Chat Trigger').message
    Code:
      function main({results, userQuery}) {
          if (results.length === 0) {
              return {
                  answer: "No relevant information found",
                  suggestions: []
              }
          }

          const mainResult = results[0]

          // If highest score is very high, return answer directly
          if (mainResult.score >= 0.85) {
              return {
                  answer: mainResult.content,
                  suggestions: []
              }
          }

          // If score is medium, provide answer and related questions
          if (mainResult.score >= 0.6) {
              const suggestions = results
                  .slice(1, 4)
                  .map(r => r.metadata.title)

              return {
                  answer: mainResult.content,
                  suggestions
              }
          }

          // If score is low, only provide related question suggestions
          const suggestions = results
              .slice(0, 5)
              .map(r => r.metadata.title)

          return {
              answer: "No exact match found. You might want to ask:",
              suggestions
          }
      }
    Outputs:
      - answer: string
      - suggestions: array[string]
  → Answer Node
    Answer: `${$('Code').answer}

${$('Code').suggestions.length > 0
  ? '\nRelated questions:\n' + $('Code').suggestions.map((s, i) => `${i+1}. ${s}`).join('\n')
  : ''}`
```

### Example 7: Multi-Knowledge Base Joint Retrieval

```
Chat Trigger
  → Knowledge Retrieval Node A
    Query: $('Chat Trigger').message
    Knowledge Base: "kb_internal_docs"
  → Knowledge Retrieval Node B
    Query: $('Chat Trigger').message
    Knowledge Base: "kb_public_docs"
  → Code Node
    Inputs:
      - resultsA: $('Knowledge Retrieval Node A').results
      - resultsB: $('Knowledge Retrieval Node B').results
    Code:
      function main({resultsA, resultsB}) {
          // Merge results
          const allResults = [
              ...resultsA.map(r => ({...r, source: 'internal'})),
              ...resultsB.map(r => ({...r, source: 'public'}))
          ]

          // Sort by score
          allResults.sort((a, b) => b.score - a.score)

          // Take top 5
          const topResults = allResults.slice(0, 5)

          // Format
          const context = topResults
              .map(r => `[${r.source}] ${r.content}`)
              .join('\n\n')

          return {context}
      }
    Outputs:
      - context: string
  → LLM Node → Answer Node
```

### Example 8: Semantic Cache Optimization

```
Chat Trigger
  → Code Node (Query cache)
    Inputs:
      - query: $('Chat Trigger').message
    Code:
      // Simplified example: should connect to cache system
      function main({query}) {
          const cache = {}  // Actually use Redis etc.
          const cached = cache[query]

          return {
              hasCached: !!cached,
              cachedResult: cached || null
          }
      }
    Outputs:
      - hasCached: boolean
      - cachedResult: object
  → Conditional Branch
    Condition: $('Code').hasCached === true
    → [True] → LLM Node (Use cached result) → Answer Node
    → [False] → Knowledge Retrieval Node
      Query: $('Chat Trigger').message
      Knowledge Base: "kb_main"
      → Code Node (Save to cache)
      → LLM Node → Answer Node
```

## Best Practices

### 1. Optimize Query Text

**Clean and Preprocess Query**
```javascript
// Preprocess query in Code node
function main({userMessage}) {
    // Remove special characters
    let query = userMessage.replace(/[^\w\s\u4e00-\u9fa5]/g, '')

    // Remove stop words (language dependent)
    const stopWords = ['the', 'a', 'is', 'in']
    query = query.split(' ')
        .filter(word => !stopWords.includes(word))
        .join(' ')

    // Limit length
    query = query.slice(0, 500)

    return {processedQuery: query}
}
```

**Extract Key Information**
```javascript
// Use entity recognition to extract key info
Chat Trigger
  → Entity Recognition Node (Extract topic, product name, etc.)
  → Code Node (Build precise query)
    Code:
      function main({entities}) {
          // Combine entities to build query
          const query = `${entities.product} ${entities.issue} ${entities.topic}`
          return {query: query.trim()}
      }
  → Knowledge Retrieval Node
```

### 2. Handle Retrieval Results

**Check Result Quality**
```javascript
// Always check result existence and relevance
Conditional Branch (AND):
  - $('Knowledge Retrieval').results is not empty
  - $('Knowledge Retrieval').results[0].score >= 0.7
```

**Filter Low Score Results**
```javascript
function main({results}) {
    const MIN_SCORE = 0.6
    const filteredResults = results.filter(r => r.score >= MIN_SCORE)

    return {
        hasQualityResults: filteredResults.length > 0,
        qualityResults: filteredResults
    }
}
```

**Handle No Results**
```javascript
// Provide useful fallback strategy
Conditional Branch: $('Knowledge Retrieval').results.length === 0
  → [True] → Answer Node
    Answer: `No direct answer found, but you can:
    1. Check our help center: https://help.example.com
    2. Contact support
    3. Try a more specific question like: "How to reset password"`
```

### 3. Format Results

**Prepare Context for LLM**
```javascript
function main({results}) {
    // Format multiple results as structured context
    const context = results
        .slice(0, 3)  // Only take top 3
        .map((r, i) => {
            return `## Reference ${i+1} (Relevance: ${(r.score * 100).toFixed(0)}%)

Source: ${r.metadata.title}
Content: ${r.content}

---`
        })
        .join('\n\n')

    return {formattedContext: context}
}
```

**Add Source Information**
```javascript
// Cite sources in answer
`${$('LLM').output}

---
Information from:
${$('Knowledge Retrieval').results
    .slice(0, 3)
    .map((r, i) => `${i+1}. ${r.metadata.title}`)
    .join('\n')}`
```

### 4. Knowledge Base Management

**Categorize Knowledge Bases by Topic**
```yaml
# Maintain multiple specialized knowledge bases
kb_product_catalog: Product catalog
kb_technical_docs: Technical documentation
kb_faq: Frequently asked questions
kb_troubleshooting: Troubleshooting
```

**Dynamic Knowledge Base Selection**
```javascript
// Select knowledge base based on user intent
const knowledgeBaseMap = {
    "Purchase Inquiry": "kb_product_catalog",
    "Technical Issue": "kb_technical_docs",
    "FAQ": "kb_faq",
    "Troubleshooting": "kb_troubleshooting"
}
```

### 5. Performance Optimization

**Limit Result Count**
```javascript
// Only process necessary number of results
$('Knowledge Retrieval').results.slice(0, 5)
```

**Implement Query Caching**
```javascript
// Cache results for common queries
// Avoid repeated retrieval
```

**Use Conditional Logic to Reduce Retrieval**
```javascript
// For simple questions, try rule matching first
Conditional Branch: Simple question match
  → [True] → Direct answer (no retrieval)
  → [False] → Knowledge Retrieval Node
```

### 6. Quality Control

**Validate Retrieval Quality**
```javascript
function main({results, userQuery}) {
    const topScore = results[0]?.score || 0

    return {
        confidence: topScore >= 0.8 ? "high" :
                   topScore >= 0.6 ? "medium" : "low",
        recommendHuman: topScore < 0.6
    }
}
```

**Log Retrieval**
```javascript
// Log queries and results for improvement
{
    query: $('Chat Trigger').message,
    topScore: $('Knowledge Retrieval').results[0].score,
    resultCount: $('Knowledge Retrieval').results.length,
    timestamp: new Date().toISOString()
}
```

## FAQ

### Q1: What data does Knowledge Retrieval node return?

**A**: Returns a results array, each result contains:
- `content`: Matched text content
- `score`: Relevance score (between 0-1)
- `metadata`: Metadata (source, title, page, etc.)

### Q2: How to judge retrieval result quality?

**A**: Mainly look at `score` relevance rating:

```javascript
// Rating standards (for reference)
score >= 0.85  // Highly relevant, can use directly
score >= 0.70  // Relevant, suitable for reference
score >= 0.50  // Possibly relevant, needs human confirmation
score < 0.50   // Low relevance, not recommended
```

### Q3: What to do when retrieval results are empty?

**A**: Implement fallback strategies:

1. **Prompt user to improve query**
   ```javascript
   "No relevant info found, suggestions:
   - Use different keywords
   - Provide more context
   - Simplify or break down question"
   ```

2. **Provide alternatives**
   ```javascript
   "No documents found, you can:
   - Check help center
   - Contact support
   - Browse FAQs"
   ```

3. **Lower relevance threshold** (use cautiously)

### Q4: Can I retrieve from multiple knowledge bases simultaneously?

**A**: Yes, use multiple Knowledge Retrieval nodes:

```javascript
Chat Trigger
  → Knowledge Retrieval Node A (Knowledge base 1)
  → Knowledge Retrieval Node B (Knowledge base 2)
  → Code Node (Merge and sort results)
  → LLM Node
```

### Q5: How to optimize retrieval accuracy?

**A**: Optimize from multiple aspects:

1. **Optimize query text**
   - Extract keywords
   - Remove noise
   - Use entity recognition

2. **Improve knowledge base**
   - Optimize document splitting
   - Add metadata
   - Regular content updates

3. **Adjust relevance threshold**
   - Set based on business needs
   - Balance precision and recall

### Q6: What if retrieval is slow?

**A**: Optimization methods:

1. **Implement query caching**
   ```javascript
   // Cache common query results
   ```

2. **Limit result count**
   ```javascript
   // Only get necessary number of results
   ```

3. **Optimize knowledge base**
   - Reasonable document size
   - Appropriate chunking strategy

### Q7: How to pass retrieval results to LLM?

**A**: Format as clear context:

```javascript
// In LLM node prompt
`Answer question based on knowledge base content:

${$('Knowledge Retrieval').results[0].content}

User question: ${$('Chat Trigger').message}

Requirements:
1. Answer based on provided content
2. Clearly state if content insufficient
3. Don't fabricate information`
```

### Q8: What if there are too many retrieval results?

**A**: Limit and filter:

```javascript
function main({results}) {
    // Only take high-score results
    const topResults = results
        .filter(r => r.score >= 0.7)
        .slice(0, 3)

    return {topResults}
}
```

### Q9: How to handle multilingual retrieval?

**A**:
1. Create separate knowledge bases for different languages
2. Dynamically select knowledge base based on user language
3. Or use multilingual vector models (depends on system support)

## Next Steps

- [LLM Node](/en/guide/workflow/nodes/action-nodes/llm) - Use retrieval results to generate answers
- [AI Classifier](/en/guide/workflow/nodes/action-nodes/ai-classifier) - Select knowledge base based on question type
- [Entity Recognition Node](/en/guide/workflow/nodes/action-nodes/entity-recognition) - Extract key info to optimize query

## Related Resources

- [Conditional Branch](/en/guide/workflow/nodes/action-nodes/if) - Branch based on retrieval result quality
- [Code Node](/en/guide/workflow/nodes/action-nodes/code) - Process and format retrieval results
- [Expression Syntax](/en/guide/expressions/) - Learn how to access retrieval result data
