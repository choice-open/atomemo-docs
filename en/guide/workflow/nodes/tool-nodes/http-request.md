---
title: HTTP Request Tool Node
description: Provide AI Agents with the ability to call external APIs and integrate with third-party services
---

# HTTP Request Tool Node

The HTTP Request Tool node provides AI Agents with the ability to call external APIs. Unlike the HTTP Request Action node, the Tool version is called autonomously by AI based on conversation needs.

## Use Cases

- **Data Queries** - Query weather, exchange rates, inventory in real-time
- **Order Operations** - Create, query, update order status
- **User Management** - Query user info, update profiles
- **Third-party Integration** - Call payment, logistics, SMS services
- **Data Synchronization** - Sync data to external systems
- **Intelligent Decisions** - AI fetches external data to assist decisions

## Tool vs Action Differences

| Feature | HTTP Request Action | HTTP Request Tool |
|---------|---------------------|-------------------|
| Execution | Direct execution | AI calls on demand |
| Use Case | Fixed API call flow | AI Agent calls when needed |
| Call Timing | Always executes | AI decides when to call |
| Parameter Passing | Pre-configured | AI extracts from conversation |

## Node Configuration

### Basic Settings

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
toolName: "queryWeather"

// 2. Descriptive tool name
toolName: "createOrder"

// 3. Tool name with prefix
toolName: "apiProductSearch"
```

**Naming Recommendations**:
- **Use camelCase or underscore**: `queryWeather` or `query_weather`
- **Self-explanatory**: Name should clearly express tool functionality
- **Avoid too long**: Recommended within 20 characters
- **Avoid special characters**: Only use letters, numbers, underscores, and hyphens

**Important Notes**:
- AI Agent identifies and calls tools by tool name, not node name
- Tool name must be unique in the workflow; duplicate names will automatically get a suffix
- English naming is recommended for consistency with AI calls

#### Tool Description (toolDescription)
Describes API functionality. AI decides when to call based on this description.

```javascript
"Query weather info for specified city.
Input: city (city name)
Returns: temperature, weather, humidity
Use case: Call when user asks about weather."
```

#### URL, Method, Authentication
Same as HTTP Request Action node. Supports:
- **Methods**: GET, POST, PUT, PATCH, DELETE, HEAD
- **Auth**: None, Basic Auth, JWT, Header Auth

#### Headers, Query Params, Body
Configure request headers, URL parameters, and request body.

## Workflow Examples

### Example 1: Weather Query Assistant

```
Chat Trigger
  → AI Agent
    Tools: [HTTP Request Tool - Weather API]
      Tool Description: "Query city weather. Input: city. Returns: temperature, weather, humidity."
      URL: "https://api.weather.com/v1/current"
      Method: GET
      Query Params: [{name: "city", value: ""}]  // AI fills this
  → Answer Node

User: "What's the weather in Beijing?"
AI: (Calls weather API with city="Beijing")
AI: "Beijing is sunny today, 15°C, 45% humidity."
```

### Example 2: Order Management

```
Chat Trigger
  → AI Agent
    Tools: [
      Tool 1 - Query Order API
      Tool 2 - Create Order API
    ]
  → Answer Node

User: "Where's my order #12345?"
AI: (Calls Tool 1) → "Your order has shipped, arrives tomorrow."

User: "I want to order 2 items, address xx, phone 138xxx"
AI: (Calls Tool 2) → "Order created, #67890, arrives in 30 min."
```

## Best Practices

### 1. Clear Tool Descriptions

```javascript
toolDescription: `Query product inventory.

Required params:
- productId: Product ID (e.g., "SKU-123")

Returns:
- available: In stock (boolean)
- quantity: Stock quantity (number)

AI extracts productId from conversation and calls this API.`
```

### 2. Handle API Errors

```javascript
Code Node (after API call):
  const response = $('HTTP Request Tool');
  if (response.statusCode >= 400) {
    return {success: false, error: response.body.message};
  }
  return {success: true, data: response.body.data};
```

### 3. Secure Sensitive Info

```javascript
// ❌ Wrong - hardcoded
headers: [{name: "X-API-Key", value: "sk-1234..."}]

// ✅ Correct - from config
headers: [{name: "X-API-Key", value: $('Config').apiKey}]
```

## FAQ

### Q: How does AI know what parameters the API needs?

**A**: Specify clearly in tool description:

```javascript
toolDescription: `Query product inventory.
Required params: productId (Product ID)
Returns: available, quantity
AI extracts productId from user messages.`
```

### Q: How to handle dynamic URLs?

**A**:
```javascript
// Method 1: Path parameters (AI auto-replaces)
url: "https://api.example.com/users/{userId}/orders"

// Method 2: Expressions
url: `https://api.example.com/users/${$('Chat Trigger').userId}/orders`

// Method 3: Query params
url: "https://api.example.com/search"
queryParams: [{name: "q", value: ""}]  // AI fills
```

### Q: How to debug API calls?

**A**:
```javascript
System Prompt: `After calling API, show me:
- Request URL
- Request params
- Response status
- Response data`
```

## Next Steps

- [AI Agent Node](/en/guide/workflow/nodes/action-nodes/ai-agent) - Learn AI Agent configuration
- [Code Tool Node](/en/guide/workflow/nodes/tool-nodes/code) - Process API response data
- [Entity Recognition Tool](/en/guide/workflow/nodes/tool-nodes/entity-recognition) - Extract API params from conversation

## Related Resources

- [HTTP Request Action Node](/en/guide/workflow/nodes/action-nodes/http-request) - Learn about Action version
- [Expression Syntax](/en/guide/expressions/) - Learn expressions in configuration
