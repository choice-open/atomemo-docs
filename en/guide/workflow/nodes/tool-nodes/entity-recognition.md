---
title: Entity Recognition Tool Node
description: Provide AI Agents with structured information extraction capabilities to extract key information from unstructured text
---

# Entity Recognition Tool Node

The Entity Recognition Tool node provides AI Agents with the ability to extract structured information from unstructured text. Unlike the Entity Recognition Action node, the Tool version is called autonomously by AI based on needs.

## Use Cases

### Typical Applications
- **Form Information Extraction** - Extract form fields from natural language user input
- **Order Information Recognition** - Extract order-related information from conversations
- **User Profile Collection** - Collect user information from dialogue
- **Product Information Extraction** - Extract specifications from product descriptions
- **Event Information Extraction** - Extract time, location, people from text
- **Multi-step Information Collection** - AI can call multiple times to collect different information

## Tool vs Action Differences

| Feature | Entity Recognition Action | Entity Recognition Tool |
|---------|--------------------------|------------------------|
| Execution Method | Direct execution | AI calls on demand |
| Use Case | Fixed information extraction flow | AI Agent extracts when needed |
| Call Timing | Always executes | AI decides when to call |
| Multiple Calls | Needs multiple nodes | Same tool can be called multiple times |

**Example Comparison**:
```
Action Method (Fixed Flow):
User Input → Entity Recognition → Process Result

Tool Method (Intelligent Interaction):
User: "I want to order food delivery"
AI: "Sure, what would you like?" (Tool not called)
User: "Kung Pao Chicken, address xxx, phone 138xxx"
AI: (Calls entity recognition tool to extract: dish, address, phone)
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
toolName: "extractOrderInfo"

// 2. Descriptive tool name
toolName: "parseUserProfile"

// 3. Tool name with prefix
toolName: "orderEntityRecognition"
```

**Naming Recommendations**:
- **Use camelCase or underscore**: `extractOrderInfo` or `extract_order_info`
- **Self-explanatory**: Name should clearly express tool functionality
- **Avoid too long**: Recommended within 20 characters
- **Avoid special characters**: Only use letters, numbers, underscores, and hyphens

**Important Notes**:
- AI Agent identifies and calls tools by tool name, not node name
- Tool name must be unique in the workflow; duplicate names will automatically get a suffix
- English naming is recommended for consistency with AI calls

#### Tool Description (toolDescription)

Describes the tool's functionality. AI decides when to call based on description.

**Field Properties**:
- Required field
- Supports expressions

**Configuration Examples**:

```javascript
// 1. Clearly describe extraction target
"Extract order information from user messages including: product name, quantity, delivery address, contact phone. Returns structured order object."

// 2. Explain use cases
"Extract product requirement information from product consultation dialogue.
Extract fields:
- productType: Product type
- budget: Budget range
- requirements: Special requirements
- deliveryDate: Expected delivery date

Call extractProductRequirements tool when user describes product requirements."

// 3. Provide examples
"Extract user personal information for registration.
Fields: name, email, phone, city
Example: User says 'My name is John, email john@example.com, phone 13800138000, in Beijing'
Returns: {name: 'John', email: 'john@example.com', phone: '13800138000', city: 'Beijing'}"
```

#### Model (model)

Select AI model for entity recognition.

**Field Properties**:
- Required field
- Supports mainstream LLM providers

**Recommended Models**:
```yaml
GPT-4: Highest accuracy, suitable for complex structure extraction
GPT-3.5-turbo: Cost-effective, suitable for most scenarios
Claude 3 Sonnet: Balanced performance, suitable for medium complexity
```

#### Input Text (input)

Text content to extract information from.

**Field Properties**:
- Required field
- Supports expressions

**Configuration Examples**:

```javascript
// 1. AI passes from conversation
input: ""  // AI will automatically fill with user message

// 2. Get from context
input: $('Chat Trigger').message

// 3. Combine multiple information sources
input: `Current conversation: ${$('Chat Trigger').message}
Historical info: ${$('Context').history}`
```

#### Instructions (instructions)

Provide additional extraction guidance for AI.

**Field Properties**:
- Optional field
- Supports expressions

**Configuration Examples**:

```javascript
// 1. Specify extraction rules
"Extract all mentioned product information from text. If a field is not mentioned, return null instead of guessing."

// 2. Handle ambiguity
"If address information is incomplete, only extract explicitly mentioned parts. If multiple phone numbers appear, extract the first one."

// 3. Format requirements
"Convert dates to YYYY-MM-DD format uniformly, remove all spaces and dashes from phone numbers."
```

#### JSON Schema (jsonSchema)

Define data structure to extract.

**Field Properties**:
- Optional field
- Supports full JSON Schema specification

**Configuration Examples**:

```json
{
  "type": "object",
  "properties": {
    "orderInfo": {
      "type": "object",
      "properties": {
        "productName": {
          "type": "string",
          "description": "Product name"
        },
        "quantity": {
          "type": "number",
          "description": "Purchase quantity"
        },
        "address": {
          "type": "string",
          "description": "Delivery address"
        },
        "phone": {
          "type": "string",
          "description": "Contact phone"
        }
      },
      "required": ["productName", "quantity"]
    }
  }
}
```

**Complex Schema Example**:

```json
{
  "type": "object",
  "properties": {
    "userProfile": {
      "type": "object",
      "properties": {
        "name": {"type": "string"},
        "age": {"type": "number"},
        "interests": {
          "type": "array",
          "items": {"type": "string"}
        },
        "contact": {
          "type": "object",
          "properties": {
            "email": {"type": "string"},
            "phone": {"type": "string"}
          }
        }
      }
    }
  }
}
```

#### Custom Labels (customLabels)

Add friendly labels for Schema fields.

**Field Properties**:
- Optional field
- Key-value pair format

```javascript
customLabels: {
  "productName": "Product Name",
  "quantity": "Quantity",
  "address": "Delivery Address",
  "phone": "Contact Phone"
}
```

### Advanced Settings (Settings Panel)

#### Always Output (alwaysOutput)
Whether to output empty item on execution failure. **Default**: `false`

#### Execute Once (executeOnce)
Whether to execute only once using first input item. **Default**: `false`

#### Retry on Fail (retryOnFail)
Whether to automatically retry on execution failure. **Default**: `false`

#### Max Tries (maxTries)
Maximum retries after failure. **Default**: `3`

#### Wait Between Tries (waitBetweenTries)
Wait time between retries (milliseconds). **Default**: `1000`

## Output Data

Outputs structured data conforming to JSON Schema definition.

```javascript
// Access extracted data
$('Entity Recognition Tool').orderInfo.productName
$('Entity Recognition Tool').orderInfo.quantity
$('Entity Recognition Tool').orderInfo.address
```

## Workflow Examples

### Example 1: Smart Order Collection

```
Chat Trigger
  → AI Agent Node
    System Prompt: "You are an ordering assistant helping users place orders."

    Tools: [Entity Recognition Tool]
      Tool Description: "Extract order info from user messages: dish, quantity, address, phone."
      JSON Schema: {
        "properties": {
          "dish": {"type": "string"},
          "quantity": {"type": "number"},
          "address": {"type": "string"},
          "phone": {"type": "string"}
        }
      }
  → Answer Node

Conversation example:
User: "I want to order Kung Pao Chicken"
AI: "Sure, how many servings? Where to deliver?" (Tool not called, info incomplete)

User: "Two servings, deliver to xx road xx number, phone 138xxxx"
AI: (Calls entity recognition tool)
Extraction result: {
  dish: "Kung Pao Chicken",
  quantity: 2,
  address: "xx road xx number",
  phone: "138xxxx"
}
AI: "Got it, order recorded: 2 servings of Kung Pao Chicken, deliver to xx road..."
```

### Example 2: Multi-step Information Collection

```
Chat Trigger
  → AI Agent Node
    System Prompt: "You are a customer service assistant collecting user feedback."

    Tools: [Entity Recognition Tool]
      Tool Description: "Extract user feedback from conversation: issueType, product, description, severity."
      Instructions: "If information incomplete, return already extracted partial fields."
      JSON Schema: {...}
  → Answer Node

Conversation example:
User: "My phone has a problem"
AI: (Calls tool) → Extracts: {product: "phone"}
AI: "What specific issue?"

User: "Can't charge, very serious"
AI: (Calls tool again) → Extracts: {
  product: "phone",
  description: "Can't charge",
  severity: "serious"
}
AI: "Issue recorded, we'll handle it ASAP..."
```

### Example 3: Product Consultation Information Extraction

```
Chat Trigger
  → AI Agent Node
    System Prompt: "You are a product consultant helping users choose suitable products."

    Tools: [
      Tool 1 - Entity Recognition Tool
        Tool Description: "Extract product requirement info: budget, size, color, requirements."

      Tool 2 - Code Tool
        Tool Description: "Search matching products based on requirements"
    ]
  → Answer Node

Conversation flow:
User: "I want to buy a laptop, budget around 8000, needs to be lightweight"
AI: (Calls entity recognition tool)
Extracts: {
  productType: "laptop",
  budget: 8000,
  requirements: "lightweight"
}
AI: (Calls product search tool)
AI: "Based on your requirements, I recommend..."
```

### Example 4: Event Information Extraction

```
Chat Trigger
  → AI Agent Node
    System Prompt: "You are a schedule management assistant helping users create schedules."

    Tools: [Entity Recognition Tool]
      Tool Description: "Extract event info from user messages: title, date, time, location, participants."
      Instructions: "Convert dates to YYYY-MM-DD format. If only 'tomorrow' is mentioned, calculate based on today's date."
      JSON Schema: {
        "properties": {
          "title": {"type": "string"},
          "date": {"type": "string"},
          "time": {"type": "string"},
          "location": {"type": "string"},
          "participants": {
            "type": "array",
            "items": {"type": "string"}
          }
        }
      }
  → Answer Node

User: "Tomorrow 3 PM in Conference Room A, project meeting, invite John and Jane"
AI: (Calls tool)
Extracts: {
  title: "Project meeting",
  date: "2024-01-16",  // AI auto-calculates
  time: "15:00",
  location: "Conference Room A",
  participants: ["John", "Jane"]
}
AI: "Schedule created: Tomorrow 3 PM..."
```

## Best Practices

### 1. Write Clear Tool Descriptions

**Good description**:
```
"Extract travel requirement information from user consultation.
Extract fields:
- destination: Destination city
- departureDate: Departure date (YYYY-MM-DD)
- duration: Trip days
- travelers: Number of travelers
- budget: Budget range

Call when user describes travel plans.
Example: 'Want to go to Sanya next month for 5 days, 2 people, budget around 10k'"
```

### 2. Design Reasonable Schema

```json
// Good Schema design
{
  "type": "object",
  "properties": {
    "required_fields": {
      "type": "object",
      "properties": {
        "name": {"type": "string", "description": "Required: Name"}
      },
      "required": ["name"]
    },
    "optional_fields": {
      "type": "object",
      "properties": {
        "age": {"type": "number", "description": "Optional: Age"},
        "city": {"type": "string", "description": "Optional: City"}
      }
    }
  }
}
```

### 3. Provide Clear Extraction Instructions

```javascript
instructions: `Extraction rules:
1. If field not explicitly mentioned, return null
2. Date format unified to YYYY-MM-DD
3. Phone numbers keep digits only
4. Extract numeric part from amounts, unify to yuan
5. If multiple values of same type, take first`
```

### 4. Handle Incomplete Information

```javascript
// AI can call tool multiple times to gradually collect information
System Prompt: `You are an intelligent assistant.
If extracted information incomplete:
1. Call tool to extract available information
2. Identify missing fields
3. Ask user for missing information
4. Call tool again to supplement information`
```

### 5. Validate Extraction Results

```
Chat Trigger
  → AI Agent (Calls Entity Recognition Tool)
  → Code Node (Validate extraction result)
    Code: |
      const data = $('Entity Recognition Tool');

      // Validate required fields
      if (!data.name || !data.phone) {
        return {valid: false, missing: ['name', 'phone']};
      }

      // Validate format
      if (!/^1[3-9]\d{9}$/.test(data.phone)) {
        return {valid: false, error: 'Invalid phone format'};
      }

      return {valid: true, data: data};
  → Conditional Branch
    → [valid] → Continue processing
    → [invalid] → AI asks again
```

## FAQ

### Q1: Should I choose Tool or Action version?

**A**:
- **Use Action**: Fixed flow, always extract information
  - Example: Immediately extract data after form submission
- **Use Tool**: AI interaction scenario, extract on demand
  - Example: Conversational information collection, AI decides when to extract

### Q2: How does AI know when to call the tool?

**A**:
AI decides based on:
1. Whether tool description matches current conversation needs
2. Whether user message contains extractable information
3. Whether conversation context needs structured information

**Optimization advice**:
- Tool description should clearly state use cases
- Provide call examples
- Explain extracted fields and their purposes

### Q3: How to handle missing partial information?

**A**:

**Option 1: Set Schema as optional**
```json
{
  "properties": {
    "name": {"type": "string"},  // Required
    "phone": {"type": "string"},  // Optional (not in required)
    "email": {"type": "string"}   // Optional
  },
  "required": ["name"]
}
```

**Option 2: Instructions explain handling**
```javascript
instructions: "If a field is not mentioned, return null. Don't guess or use defaults."
```

**Option 3: AI auto asks**
```javascript
System Prompt: "If extracted info missing required fields, ask user for missing information."
```

### Q4: Can lists or arrays be extracted?

**A**:
Yes, use `array` type:

```json
{
  "properties": {
    "products": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {"type": "string"},
          "quantity": {"type": "number"}
        }
      }
    }
  }
}
```

**Example**:
```
User: "I want 3 apples, 2 oranges, 5 bananas"
Extraction result: {
  products: [
    {name: "apples", quantity: 3},
    {name: "oranges", quantity: 2},
    {name: "bananas", quantity: 5}
  ]
}
```

### Q5: How to improve extraction accuracy?

**A**:

**1. Use more powerful model**
```javascript
model: "GPT-4"  // Instead of GPT-3.5
```

**2. Provide detailed field descriptions**
```json
{
  "properties": {
    "date": {
      "type": "string",
      "description": "Date in YYYY-MM-DD format. If user says 'tomorrow', calculate specific date"
    }
  }
}
```

**3. Use Instructions to clarify rules**
```javascript
instructions: "Strictly extract according to Schema, don't speculate unmentioned information."
```

**4. Provide extraction examples**
```javascript
toolDescription: `Extract user address information.
Example input: "I live at xx road xx number, Chaoyang District, Beijing"
Example output: {
  province: "Beijing",
  district: "Chaoyang District",
  street: "xx road xx number"
}`
```

### Q6: Can the tool be called multiple times?

**A**:
Yes! This is a Tool advantage:

```
Conversation flow:
User: "I want to order food delivery"
AI: "Sure, what would you like?" (Don't call tool)

User: "Kung Pao Chicken"
AI: (1st call) → Extracts: {dish: "Kung Pao Chicken"}
AI: "Where to deliver?"

User: "xx road xx number, phone 138xxx"
AI: (2nd call) → Extracts: {dish: "Kung Pao Chicken", address: "xx road", phone: "138xxx"}
AI: "Order confirmed..."
```

AI autonomously decides whether to call again based on information completeness.

### Q7: How to handle format conversion?

**A**:
Explain in Instructions:

```javascript
instructions: `Format conversion rules:
- Date: Unify to YYYY-MM-DD (e.g., "tomorrow" → "2024-01-16")
- Phone: Remove spaces, dashes (e.g., "138-0000-0000" → "13800000000")
- Amount: Extract number, unify to yuan (e.g., "99.9 yuan" → 99.9)
- Boolean: "yes/ok/want" → true, "no/don't want" → false`
```

AI will automatically convert formats according to rules.

## Next Steps

- [AI Agent Node](/en/guide/workflow/nodes/action-nodes/ai-agent) - Learn how to use AI Agents
- [Code Tool Node](/en/guide/workflow/nodes/tool-nodes/code) - Process extracted data
- [HTTP Request Tool Node](/en/guide/workflow/nodes/tool-nodes/http-request) - Combine with API calls

## Related Resources

- [Entity Recognition Action Node](/en/guide/workflow/nodes/action-nodes/entity-recognition) - Learn about Action version
- [JSON Schema Specification](https://json-schema.org/) - Learn JSON Schema syntax
