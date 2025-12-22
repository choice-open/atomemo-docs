---
title: HTTP Request Node
description: Call external APIs and web services
---

# HTTP Request Node

The HTTP Request node is used to call external APIs and web services in workflows. It supports all common HTTP methods, authentication methods, custom headers and request bodies, making it the core node for connecting to third-party systems and services.

## Use Cases

### Typical Applications
- **Third-party API Integration** - Call CRM, payment, logistics, and other third-party services
- **Data Queries** - Retrieve data from external databases or services
- **Data Submission** - Send processing results to external systems
- **Webhook Callbacks** - Send event notifications to other systems
- **Microservice Calls** - Call internal services in microservice architectures
- **File Upload/Download** - Upload files to cloud storage or download resources
- **RESTful API Operations** - Perform CRUD operations

## Node Configuration

### Basic Settings (Parameters Panel)

#### Request URL (url)

The API address to request.

**Field Properties**:
- Required field
- Supports expressions
- Supports HTTP and HTTPS protocols

**Configuration Examples**:

```javascript
// 1. Static URL
"https://api.example.com/users"

// 2. Build URL with expressions
`https://api.example.com/users/${$('Entity Recognition').userId}`

// 3. Read from configuration
$('Config Node').apiBaseUrl + "/orders"

// 4. With query parameters (recommend using query params config)
`https://api.example.com/search?q=${$('Chat Trigger').query}`
```

#### Request Method (method)

HTTP request method.

**Available Values**:
- `GET` - Retrieve resource (default: read data)
- `POST` - Create resource (send data to server)
- `PUT` - Update resource (complete replacement)
- `PATCH` - Partially update resource
- `DELETE` - Delete resource
- `HEAD` - Get resource headers (no body returned)

**Default**: `POST`

**Usage Recommendations**:
```yaml
GET: Query data, retrieve lists
POST: Create new records, submit forms
PUT: Complete resource replacement
PATCH: Partial field updates
DELETE: Delete records
HEAD: Check if resource exists
```

#### Authentication (authentication)

API authentication method.

**Available Values**:
- `none` - No authentication required (default)
- `basic_auth` - Basic authentication (username/password)
- `jwt_auth` - JWT Token authentication
- `header_auth` - Custom header authentication (e.g., API Key)

**Default**: `none`

#### Credentials (credentials)

Authentication credentials required.

**Field Properties**:
- Optional (required when authentication is not none)
- Supports expressions
- Format varies by authentication type

**Configuration Examples**:

```javascript
// Basic Auth - Format: username:password
"admin:password123"

// JWT Auth - JWT token
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

// Header Auth - Provide token value directly
$('Config Node').apiKey

// Read from environment variables
$('Environment Variables').API_SECRET_KEY
```

#### Send Headers (sendHeaders)

Whether to include custom headers in the request.

**Default**: `false`

#### Specify Headers (specifyHeaders)

Specify the configuration format for headers.

**Available Values**:
- `keyValuePair` - Key-value pair form (default, visual editing)
- `json` - JSON string form

**Default**: `keyValuePair`

#### Headers (headers)

Custom HTTP request headers.

**Field Properties**:
- Format varies by specifyHeaders
- Supports expressions

**Key-Value Pair Format Example**:

```javascript
// Configure multiple headers
[
  { name: "Content-Type", value: "application/json" },
  { name: "X-API-Key", value: $('Config').apiKey },
  { name: "X-Request-ID", value: $('Webhook Trigger').requestId }
]
```

**JSON Format Example**:

```javascript
// Using JSON string
`{
  "Content-Type": "application/json",
  "Authorization": "Bearer ${$('Config').token}",
  "X-Custom-Header": "${$('Data').customValue}"
}`
```

#### Send Search Parameters (sendSearchParameters)

Whether to include query parameters in the URL.

**Default**: `false`

#### Specify Search Parameters (specifySearchParameters)

Specify the configuration format for query parameters.

**Available Values**:
- `keyValuePair` - Key-value pair form (default)
- `json` - JSON string form

**Default**: `keyValuePair`

#### Query Params (queryParams)

URL query parameters (Query String).

**Field Properties**:
- Format varies by specifySearchParameters
- Supports expressions
- Automatically URL encoded

**Key-Value Pair Format Example**:

```javascript
// Configure multiple query parameters
[
  { name: "page", value: "1" },
  { name: "limit", value: "20" },
  { name: "category", value: $('AI Classifier').class },
  { name: "keyword", value: $('Chat Trigger').query }
]

// Final URL: https://api.example.com/search?page=1&limit=20&category=tech&keyword=hello
```

**JSON Format Example**:

```javascript
`{
  "page": 1,
  "limit": 20,
  "status": "${$('Form').status}",
  "startDate": "${$('Code').formattedDate}"
}`
```

#### Send Body (sendBody)

Whether to send request body (only valid for POST, PUT, PATCH).

**Default**: `false`

#### Body Content Type (bodyContentType)

Content-Type of the request body.

**Available Values**:
- `application/json` - JSON format (currently the only supported format)

**Default**: `application/json`

#### Specify Body (specifyBody)

Specify the configuration format for request body.

**Available Values**:
- `keyValuePair` - Key-value pair form (default)
- `json` - JSON string form

**Default**: `keyValuePair`

#### Body (body)

HTTP request body content.

**Field Properties**:
- String type
- Supports expressions
- Usually in JSON format

**Configuration Examples**:

```javascript
// 1. Simple JSON object
`{
  "name": "${$('Entity Recognition').name}",
  "email": "${$('Entity Recognition').email}",
  "phone": "${$('Entity Recognition').phone}"
}`

// 2. Nested structure
`{
  "customer": {
    "name": "${$('Form').name}",
    "contact": {
      "email": "${$('Form').email}",
      "phone": "${$('Form').phone}"
    }
  },
  "order": {
    "items": ${JSON.stringify($('Code').items)},
    "total": ${$('Code').totalAmount}
  },
  "metadata": {
    "source": "automation",
    "timestamp": "${new Date().toISOString()}"
  }
}`

// 3. Directly use upstream node data
JSON.stringify($('Entity Recognition'))

// 4. Array format
`[
  {"id": 1, "name": "${$('Data1').name}"},
  {"id": 2, "name": "${$('Data2').name}"}
]`
```

### Advanced Settings (Settings Panel)

#### Always Output (alwaysOutput)

Whether to output an empty item when request fails or has no response.

**Default**: `false`

**Purpose**: Prevents workflow from terminating at this node.

#### Execute Once (executeOnce)

Whether to execute only once using the first input item.

**Default**: `false`

#### Retry on Fail (retryOnFail)

Whether to automatically retry when request fails.

**Default**: `false`

**Recommended Scenarios**:
- Unstable network
- Intermittent external API failures
- 429 errors from rate limiting

#### Max Tries (maxTries)

Maximum number of retries after failure.

**Default**: `3`

**Prerequisite**: `retryOnFail` must be `true`

#### Wait Between Tries (waitBetweenTries)

Wait time between retries (milliseconds).

**Default**: `1000` (1 second)

**Prerequisite**: `retryOnFail` must be `true`

**Recommended Values**:
```yaml
Temporary failures: 500-1000ms
Rate limiting: 2000-5000ms
Service restart: 5000-10000ms
```

#### Error Handling (onError)

How to handle request failures.

**Available Values**:
- `stopWorkflow` - Stop entire workflow (default)
- `continueRegularOutput` - Continue with regular output
- `continueErrorOutput` - Continue with error output

#### Node Description (nodeDescription)

Add custom description for the node.

```yaml
nodeDescription: "Call CRM API to create customer record"
```

## Output Data

The HTTP Request node returns complete response information.

```javascript
// HTTP status code
$('HTTP Request').statusCode

// Response body (usually JSON object)
$('HTTP Request').body

// Response headers
$('HTTP Request').headers

// Access fields in response body
$('HTTP Request').body.id
$('HTTP Request').body.data.users
$('HTTP Request').body.result[0].name

// Response headers examples
$('HTTP Request').headers['content-type']
$('HTTP Request').headers['x-rate-limit-remaining']
```

## Workflow Examples

### Example 1: Create Customer Record

```
Entity Recognition Node (Extract customer info)
  → HTTP Request Node
    URL: "https://api.crm.com/customers"
    Method: POST
    Authentication: header_auth
    Credentials: $('Config').crmApiKey
    Send Headers: true
    Headers:
      - name: "Authorization"
        value: `Bearer ${$('Config').crmApiKey}`
      - name: "Content-Type"
        value: "application/json"
    Send Body: true
    Body:
      `{
        "name": "${$('Entity Recognition').name}",
        "email": "${$('Entity Recognition').email}",
        "phone": "${$('Entity Recognition').phone}",
        "source": "chatbot",
        "tags": ["lead", "automation"]
      }`
  → Conditional Branch
    → [Success: statusCode === 201] → Answer (Created successfully)
    → [Failure] → Answer (Creation failed, please try again)
```

### Example 2: Query Order Status

```
Chat Trigger
  → Entity Recognition Node (Extract order ID)
  → HTTP Request Node
    URL: `https://api.shop.com/orders/${$('Entity Recognition').orderId}`
    Method: GET
    Authentication: header_auth
    Send Headers: true
    Headers:
      - name: "X-API-Key"
        value: $('Config').shopApiKey
    Send Search Parameters: false
  → Code Node (Format order info)
  → Answer Node
```

### Example 3: Batch Update Data

```
Database Query Node (Get records to update)
  → HTTP Request Node
    URL: "https://api.service.com/batch-update"
    Method: POST
    Send Body: true
    Body:
      `{
        "records": ${JSON.stringify($('Database Query').results)},
        "updateFields": ["status", "updatedAt"],
        "batchSize": 100
      }`
    Settings:
      retryOnFail: true
      maxTries: 3
      waitBetweenTries: 2000
  → Conditional Branch
    → [Success] → Log
    → [Failure] → Alert Notification
```

### Example 4: File Upload

```
Webhook Trigger (Receive file)
  → HTTP Request Node
    URL: "https://storage.example.com/upload"
    Method: POST
    Send Headers: true
    Headers:
      - name: "Content-Type"
        value: "multipart/form-data"
      - name: "Authorization"
        value: `Bearer ${$('Config').storageToken}`
    Send Body: true
    Body:
      `{
        "file": "${$('Webhook Trigger').body.fileBase64}",
        "filename": "${$('Webhook Trigger').body.filename}",
        "folder": "uploads/chatbot"
      }`
  → Answer Node
    Answer: `File uploaded successfully! Access link: ${$('HTTP Request').body.url}`
```

### Example 5: Microservice Chain Calls

```
Chat Trigger
  → HTTP Request Node A (User Service - Get user info)
    URL: `https://user-service.internal/users/${$('Chat Trigger').userId}`
    Method: GET
  → HTTP Request Node B (Order Service - Get order list)
    URL: "https://order-service.internal/orders"
    Method: GET
    Query Params:
      - name: "userId"
        value: $('HTTP Request Node A').body.id
      - name: "status"
        value: "active"
  → HTTP Request Node C (Recommendation Service - Get product recommendations)
    URL: "https://recommendation-service.internal/recommend"
    Method: POST
    Body:
      `{
        "userId": "${$('HTTP Request Node A').body.id}",
        "orderHistory": ${JSON.stringify($('HTTP Request Node B').body.orders)},
        "limit": 5
      }`
  → LLM Node (Generate personalized response)
  → Answer Node
```

### Example 6: Webhook Notification

```
Workflow Completion Node
  → HTTP Request Node
    URL: $('Config').webhookUrl
    Method: POST
    Send Headers: true
    Headers:
      - name: "Content-Type"
        value: "application/json"
      - name: "X-Webhook-Signature"
        value: $('Code').signature
    Send Body: true
    Body:
      `{
        "event": "workflow.completed",
        "workflowId": "${$('Workflow Info').id}",
        "status": "success",
        "result": ${JSON.stringify($('Final Result'))},
        "timestamp": "${new Date().toISOString()}"
      }`
    Settings:
      retryOnFail: true
      maxTries: 5
      onError: continueRegularOutput
```

## Best Practices

### 1. Securely Handle Sensitive Information

**Don't Hardcode API Keys**
```javascript
// Don't do this
credentials: "sk-1234567890abcdef"

// Should use config node or environment variables
credentials: $('Config').apiKey
credentials: $('Environment Variables').API_SECRET_KEY
```

**Use Appropriate Authentication Methods**
```yaml
# Choose based on API requirements
Basic Auth: Traditional APIs, username/password
JWT: Modern web apps, token authentication
Header Auth: RESTful APIs, API Key
```

### 2. Error Handling and Retries

**Configure Retry Strategy Properly**
```yaml
# Network requests
retryOnFail: true
maxTries: 3
waitBetweenTries: 1000

# Critical business operations
retryOnFail: true
maxTries: 5
waitBetweenTries: 2000
onError: continueErrorOutput  # Log error but continue
```

**Check Response Status**
```javascript
// Use conditional branch to check status code
Condition: $('HTTP Request').statusCode >= 200 && $('HTTP Request').statusCode < 300

// Check business status
Condition: $('HTTP Request').body.success === true

// Handle different errors
Condition: $('HTTP Request').statusCode === 404
  → Answer: "Record not found"
Condition: $('HTTP Request').statusCode === 429
  → Answer: "Too many requests, please try again later"
Condition: $('HTTP Request').statusCode >= 500
  → Answer: "Service temporarily unavailable, please try again later"
```

### 3. Performance Optimization

**Use executeOnce to Avoid Duplicate Requests**
```yaml
# When upstream returns multiple items but only need one request
executeOnce: true
```

**Set Reasonable Timeout**
```javascript
// Set timeout in headers
headers: [
  { name: "X-Timeout", value: "5000" }
]
```

**Optimize Batch Operations**
```javascript
// Bad: Loop call API multiple times
Each user → HTTP Request Node

// Good: Batch processing
Code Node (Aggregate data) → HTTP Request Node (Batch API)
```

### 4. Data Format Handling

**Correctly Build JSON Request Body**
```javascript
// Simple object
`{
  "name": "${$('Node').name}",
  "age": ${$('Node').age}
}`

// Include arrays
`{
  "items": ${JSON.stringify($('Node').items)}
}`

// Escape special characters
`{
  "description": "${$('Node').text.replace(/"/g, '\\"')}"
}`
```

**Handle Query Parameter Encoding**
```javascript
// System automatically performs URL encoding
queryParams: [
  { name: "search", value: "hello world" }  // Automatically encoded to hello%20world
]
```

### 5. Request Header Best Practices

**Set Appropriate Content-Type**
```javascript
headers: [
  { name: "Content-Type", value: "application/json" },
  { name: "Accept", value: "application/json" }
]
```

**Add Tracking Identifiers**
```javascript
headers: [
  { name: "X-Request-ID", value: $('Webhook Trigger').requestId },
  { name: "X-Source", value: "automation-workflow" }
]
```

### 6. Debugging Tips

**Log Request Details**
```
HTTP Request Node
  → Code Node (Log)
    Code:
      function main({request, response}) {
          console.log('Request URL:', request.url)
          console.log('Status Code:', response.statusCode)
          console.log('Response Body:', JSON.stringify(response.body))
          return {logged: true}
      }
```

**Use Test Endpoints**
```javascript
// Use test URL in development environment
url: $('Environment Variables').ENV === 'production'
  ? 'https://api.example.com/v1'
  : 'https://api-dev.example.com/v1'
```

## FAQ

### Q1: Which HTTP methods are supported?

**A**: All common HTTP methods are supported:
- **GET** - Retrieve resource
- **POST** - Create resource
- **PUT** - Complete resource update
- **PATCH** - Partial resource update
- **DELETE** - Delete resource
- **HEAD** - Get headers

### Q2: How to handle API rate limiting?

**A**: Methods to handle rate limiting:

1. **Check response headers**
   ```javascript
   $('HTTP Request').headers['x-rate-limit-remaining']
   $('HTTP Request').headers['x-rate-limit-reset']
   ```

2. **Configure retry strategy**
   ```yaml
   retryOnFail: true
   maxTries: 3
   waitBetweenTries: 5000  # Wait 5 seconds
   ```

3. **Use conditional branch**
   ```javascript
   Condition: $('HTTP Request').statusCode === 429
     → Wait Node (Delay execution)
     → Retry request
   ```

### Q3: How to handle large file uploads?

**A**: Recommendations for large file uploads:

1. **Chunked upload**
   ```javascript
   // Use Code node to split file
   // Call HTTP Request node multiple times to upload chunks
   ```

2. **Use pre-signed URLs**
   ```javascript
   // First get pre-signed URL
   HTTP Request Node A (Get upload URL)
   // Upload directly to cloud storage
   → HTTP Request Node B (Upload file)
   ```

3. **Consider timeout settings**
   - Increase retry wait time
   - Use streaming upload (if API supports)

### Q4: How to send multipart/form-data requests?

**A**: Current version primarily supports JSON format. For multipart/form-data:

```javascript
// Method 1: Use base64 encoding
body: `{
  "file": "${$('Node').fileBase64}",
  "filename": "${$('Node').filename}"
}`

// Method 2: Use Code node to build
Code Node (Build multipart data)
  → HTTP Request Node
```

### Q5: What if response is not JSON format?

**A**: HTTP Request node is optimized for JSON APIs. For other formats:

```javascript
// Text response
$('HTTP Request').body  // String form

// Process in Code node
function main({response}) {
    // XML parsing
    const parser = new DOMParser()
    const xml = parser.parseFromString(response.body, 'text/xml')

    // CSV parsing
    const rows = response.body.split('\n')

    return {parsed: data}
}
```

### Q6: How to handle CORS issues?

**A**: CORS is usually a browser restriction:

1. **Server-to-server requests**
   - Workflows execute on server, not subject to CORS

2. **If you do encounter CORS**
   - Check target API's CORS configuration
   - Contact API provider to add allowed origins
   - Use proxy service

### Q7: How to debug HTTP requests?

**A**: Debugging tips:

1. **Use webhook.site for testing**
   ```javascript
   url: "https://webhook.site/your-unique-url"
   // View complete request details
   ```

2. **Log request/response**
   ```javascript
   HTTP Request Node
     → Code Node
       function main({response}) {
           console.log('Status:', response.statusCode)
           console.log('Body:', response.body)
           console.log('Headers:', response.headers)
           return {debug: true}
       }
   ```

3. **Use conditional branch to check status**
   ```javascript
   Condition: $('HTTP Request').statusCode !== 200
     → Answer Node (Show error message)
   ```

### Q8: Are self-signed certificates supported?

**A**: Usually needs to be configured in runtime environment:
- Production should use valid SSL certificates
- Development can allow self-signed certificates in server config
- Not recommended to ignore certificate validation in workflows

### Q9: How to implement request caching?

**A**: Ways to implement caching:

```javascript
// Use conditional branch to check cache
Condition: $('Cache Check').exists === false
  → HTTP Request Node
    → Code Node (Store to cache)

// Or use HTTP headers
headers: [
  { name: "Cache-Control", value: "max-age=3600" }
]
```

## Next Steps

- [Code Node](/en/guide/workflow/nodes/action-nodes/code) - Process HTTP response data
- [Conditional Branch](/en/guide/workflow/nodes/action-nodes/if) - Branch based on response status
- [Webhook Trigger](/en/guide/workflow/nodes/trigger-nodes/webhook) - Receive external HTTP requests

## Related Resources

- [Entity Recognition Node](/en/guide/workflow/nodes/action-nodes/entity-recognition) - Process API returned data
- [Answer Node](/en/guide/workflow/nodes/action-nodes/answer) - Return API results to users
- [Expression Syntax](/en/guide/expressions/) - Learn how to build dynamic requests
