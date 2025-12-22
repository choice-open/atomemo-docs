---
title: Webhook Trigger
description: Trigger workflow execution via HTTP requests
---

# Webhook Trigger

The Webhook trigger allows your workflows to be triggered by HTTP requests from external systems. This is the most common and flexible triggering method, suitable for receiving event notifications from third-party services, API integration, and real-time data processing.

## Use Cases

### Typical Applications
- **Receive Third-Party Events** - GitHub webhooks, Stripe payment notifications, Slack events, etc.
- **API Integration** - Serve as a custom API endpoint to receive external system requests
- **Data Collection** - Collect data submissions from frontend and mobile applications
- **Real-Time Notifications** - Receive alerts and real-time pushes from monitoring systems
- **AI Agent Triggering** - Trigger AI Agent task execution via HTTP requests

## Node Configuration

### Basic Settings (Parameters Panel)

#### 1. Webhook URLs

After publishing the workflow, the system automatically generates two types of Webhook URLs:

**Test URL**
```
https://your-domain.com/api/test/{node-id}/{path}
```
Used for development and testing stages. You can listen for test events in the editor.

**Production URL**
```
https://your-domain.com/api/{node-id}/{path}
```
Used for production environment. Can be used directly after workflow publication.

> **Tip**: Click the copy button next to the URL to copy the link.

#### 2. HTTP Method

Configure the HTTP request methods the node accepts:

**Supported Methods**:
- `GET` - Suitable for simple triggers and parameter passing
- `POST` - **Recommended**, suitable for transmitting JSON data
- `PUT` - Update operations
- `DELETE` - Delete operations

**Single Selection Mode** (default):
- Only one HTTP method can be selected
- Suitable for most scenarios

**Multiple Selection Mode**:
- Multiple HTTP methods can be selected simultaneously (e.g., `GET`, `POST`)
- Needs to be enabled in the settings panel with "Allow Multiple HTTP Method"

**Configuration Example**:
```yaml
# Single selection mode
methods: ["POST"]

# Multiple selection mode (requires setting enabled)
methods: ["GET", "POST"]
```

#### 3. Path

Customize the Webhook path suffix, supports dynamic values.

**Examples**:
```
Path: customer-signup
Full URL: https://your-domain.com/api/{node-id}/customer-signup

Path: users/:userId
Full URL: https://your-domain.com/api/{node-id}/users/123
```

> **Tip**: The path field supports expressions and can use dynamic variables.

#### 4. Authentication

::: warning Under Development
Authentication features are currently under development and not yet available. Authentication-related configurations are commented out in the current version.
:::

Planned authentication methods:
- **None** - No authentication required (default)
- **Basic Auth** - HTTP basic authentication
- **JWT Auth** - JWT token authentication
- **Header Auth** - Custom header authentication

#### 5. Respond

Controls when to send a response to the HTTP request:

**Immediately** (default)
```yaml
respond: "immediately"
```
- Returns 200 response immediately upon receiving the request
- Workflow executes asynchronously in the background
- Suitable for scenarios that don't need to wait for results

**When Last Node Finishes**
```yaml
respond: "last_node_finishes"
```
- Waits for the entire workflow to complete before responding
- Response includes output data from the last node
- Suitable for scenarios requiring processing results

**Using 'Respond to Webhook' Node**
```yaml
respond: "respond_to_webhook"
```
- Specific nodes in the workflow control response timing and content
- Provides maximum flexibility
- Suitable for complex response logic

### Advanced Settings (Settings Panel)

#### Allow Multiple HTTP Method

When enabled, multiple methods can be selected in the HTTP Method field in the parameters panel.

**Configuration**:
```yaml
allowMultipleHttpMethod: true  # default false
```

#### Node Description

Add a custom description to the node to help team members understand its purpose.

## Testing & Debugging

### Using Built-in Test Tools

1. **Listen for Test Event**
   - Click the "Listen for Test Event" button in the left panel
   - System displays the test URL and required HTTP method
   - Send a request to the test URL
   - Workflow executes automatically and displays results

2. **Stop Listening**
   - Click the "Stop Listening" button to stop receiving test events

3. **Switch Test/Production URL**
   - Use tabs at the top of the parameters panel to switch
   - Test URL: For development and testing
   - Production URL: For actual deployment

### Testing with cURL

```bash
# Basic POST request
curl -X POST https://your-domain.com/api/test/{node-id} \
  -H "Content-Type: application/json" \
  -d '{"userId": "usr_001", "action": "signup"}'

# With path parameters
curl -X POST https://your-domain.com/api/test/{node-id}/customer-signup \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "name": "John Doe"}'

# GET request with query parameters
curl -X GET "https://your-domain.com/api/test/{node-id}?source=test&debug=true"
```

### Using Postman/Insomnia

1. Create a new request
2. Copy the Webhook URL from the editor
3. Select the corresponding HTTP method
4. Add headers and body (if needed)
5. Send the request and view results

## Data Access

### Request Data Structure

After webhook trigger, you can access request data via `$json`:

```javascript
{
  // HTTP method
  "method": "POST",

  // Request headers
  "headers": {
    "content-type": "application/json",
    "user-agent": "Mozilla/5.0..."
  },

  // Request body
  "body": {
    "userId": "usr_12345",
    "email": "user@example.com",
    "name": "John Doe"
  },

  // URL query parameters
  "query": {
    "source": "mobile_app",
    "version": "2.1.0"
  },

  // Path parameters (if using dynamic paths)
  "params": {
    "userId": "123"
  }
}
```

### Common Expressions

Access Webhook data in subsequent nodes:

```javascript
// Access request body fields (need to specify node name)
$('Webhook Trigger').body.email
$('Webhook Trigger').body.userId

// Access URL parameters
$('Webhook Trigger').query.source
$('Webhook Trigger').query.page

// Access request headers
$('Webhook Trigger').headers['content-type']
$('Webhook Trigger').headers['user-agent']

// Access HTTP method
$('Webhook Trigger').method
```

## Workflow Design Recommendations

### 1. Data Validation

Validate data format before processing Webhook data:

```
Webhook Trigger
  → Conditional Branch (validate required fields)
    → [Yes] Process data
    → [No] Return error response
```

### 2. Error Handling

Add error handling mechanisms for Webhook workflows:

```
Webhook Trigger
  → Try/Catch
    → Main processing logic
    → [Failed] Log error
    → [Failed] Send alert notification
```

### 3. Async Processing for Long Tasks

For time-consuming operations, use "immediately" response mode:

```yaml
respond: "immediately"
```

This allows for quick response and avoids client timeout.

## FAQ

### Q1: Will the Webhook URL change?

**A**: Each node's ID is fixed, so the Webhook URL remains unchanged after workflow creation. However, the URL will change in these cases:
- Delete and recreate the node
- Copy node to another workflow

**Recommendation**: Use environment variables or configuration files to store Webhook URLs for easier management.

### Q2: How to handle high request volumes?

**A**: {{PRODUCT_NAME}} is built on Elixir, naturally supporting high concurrency:
- Single node handles 10,000+ concurrent requests
- Automatic queuing and backpressure mechanisms
- Horizontal scaling via K8s

For extremely high concurrency scenarios, recommend:
- Use "immediately" response mode
- Add load balancing at the frontend
- Monitor system performance metrics

### Q3: What's the difference between Test URL and Production URL?

**A**:
- **Test URL** (`/api/test/{node-id}`):
  - Only effective when listening in the editor
  - Used for development and debugging
  - Can view execution results in real-time

- **Production URL** (`/api/{node-id}`):
  - Can be used after workflow publication
  - No need to listen in the editor
  - Used for actual production environment

### Q4: How to protect Webhook security?

**A**: Recommended security measures in the current version:

1. **Use HTTPS**
   - Webhook URL uses HTTPS encrypted transmission by default

2. **Limit Access Sources**
   - Configure IP whitelist at gateway layer
   - Use firewall rules to restrict access

3. **Validate Request Data**
   - Add data validation logic in workflow
   - Use conditional branches to check required fields

4. **Monitor Abnormal Requests**
   - Log all request logs
   - Set up alert rules

> **Tip**: Authentication features are under development. Future versions will support more comprehensive security mechanisms.

### Q5: How to implement idempotency?

**A**: Implement idempotency checks in the workflow:

```
Webhook Trigger
  → Extract idempotency key (e.g., order ID)
  → Check if already processed
    → [Yes] Return already processed response
    → [No] Continue processing
      → Mark as processed
```

## Next Steps

- [Expression Syntax](/en/guide/expressions/) - Learn how to process Webhook data
- [Action Nodes](/en/guide/workflow/nodes/action-nodes/) - Learn how to process received data
- [Conditional Branch Node](/en/guide/workflow/nodes/control-nodes/if) - Implement conditional logic

## Related Resources

- [HTTP Request Node](/en/guide/workflow/nodes/action-nodes/http-request) - Send HTTP requests
- [Workflow Best Practices](/en/guide/best-practices) - Workflow design guide
- [Expression Reference](/en/guide/expressions-reference) - Complete expression syntax
