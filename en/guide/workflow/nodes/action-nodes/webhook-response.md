---
title: Webhook Response
description: Send custom HTTP responses back to Webhook callers with full control over status, headers, and body
---

# Webhook Response

The Webhook Response node sends a custom HTTP response back to the caller of a [Webhook Trigger](/en/guide/workflow/nodes/trigger-nodes/webhook). Unlike the default immediate or end-of-workflow response modes, this node lets you control exactly **when** the response is sent, **what** it contains, and **how** it's structured — from any point in your workflow.

> **Prerequisite**: The Webhook Trigger's **Respond** setting must be set to **"Using 'Respond to Webhook' Node"** (`respond: "respond_to_webhook"`) for this node to take effect.

## Use Cases

### Typical Applications
- **Conditional Responses** — Return different status codes and bodies based on workflow logic (e.g., `200` on success, `400` on validation failure)
- **Early Exit** — Send a response early and continue processing asynchronously in the background
- **Custom Headers** — Set response headers like `Content-Type`, `Location`, or `X-Request-ID`
- **Partial Results** — Return immediate acknowledgment while heavy processing continues
- **API Endpoints** — Build full REST API endpoints with proper status codes and structured JSON responses

## Node Configuration

### Response Body Type

Choose how to structure the response body. Click the type selector to switch between three modes:

---

#### JSON

Manually enter a JSON response body. The editor validates JSON syntax in real time.

**Field**: `Response Body` — accepts valid JSON only.

```json
{
  "success": true,
  "orderId": "ord_12345",
  "message": "Order created successfully"
}
```

**With Expressions** — use [expressions](/en/guide/expressions/) to dynamically build the response:

```javascript
// Expression mode — reference upstream node outputs
{
  "status": "ok",
  "userId": {{$('Webhook Trigger').body.userId}},
  "result": {{$('Code').output}},
  "timestamp": {{$('Webhook Trigger').body.timestamp}}
}
```

> **Note**: Only JSON format is currently supported. Binary files and plain text responses may be available in future releases.

---

#### No Data

Returns an HTTP `200` response with an empty body. Use this when the caller only needs to know the request was received.

```
Status: 200 OK
Body: (empty)
```

Common scenarios:
- Fire-and-forget webhooks where processing happens asynchronously
- Acknowledgement responses when no result data is needed

---

#### Key-Value Pairs

Build the response body as a flat JSON object using key-value fields.

Click **Add Pair** to add a row. Each row has two expression-enabled fields:

| Field | Description |
| --- | --- |
| **Name** | The JSON key name |
| **Value** | The value for that key (supports expressions) |

**Example Configuration**:

| Name | Value |
| --- | --- |
| `status` | `"success"` |
| `orderId` | `$('HTTP Request').body.id` |
| `message` | `"Order processed"` |
| `timestamp` | `$('Webhook Trigger').body.timestamp` |

**Resulting Response Body**:
```json
{
  "status": "success",
  "orderId": "ord_12345",
  "message": "Order processed",
  "timestamp": "2026-01-15T10:30:00Z"
}
```

> **Tip**: Both Name and Value fields support full [expression syntax](/en/guide/expressions/). Use expressions to pull data from any upstream node.

## Response Behavior

### Execution Rules

The Webhook Response node follows specific rules that determine which response is actually sent to the caller:

#### 1. First Response Wins

Only the **first** Webhook Response node that executes sends a response. Any subsequent Webhook Response nodes in the same workflow are silently ignored.

```
Webhook Trigger (respond = respond_to_webhook)
  → Conditional Branch
    → [branch A] → Webhook Response ← ✓ This one sends the response
    → [branch B] → Webhook Response ← ✗ Ignored (response already sent)
```

#### 2. No Webhook Response Executed

If the workflow completes without ever reaching a Webhook Response node, the system returns a default `200` response with a standard message.

```
Webhook Trigger (respond = respond_to_webhook)
  → Code Node
  → End                     ← No Webhook Response node was hit
                             → Returns 200 with default message
```

#### 3. Error Before Response

If the workflow encounters an error **before** any Webhook Response node executes, the system returns an HTTP `500` error.

```
Webhook Trigger (respond = respond_to_webhook)
  → Code Node (throws error)       ← Error!
                                     → Returns 500
```

#### 4. No Webhook Trigger in Workflow

If a Webhook Response node is placed in a workflow that does **not** have a Webhook Trigger (or the trigger's respond mode is not set to `respond_to_webhook`), the node is silently ignored and outputs `null`.

```
Chat Trigger                       ← Not a Webhook Trigger
  → Webhook Response               ← Ignored, outputs null
```

#### 5. Client Disconnected

If the HTTP client disconnects before the workflow reaches a Webhook Response node, the node outputs:

```
"Client has disconnected or has been responsed by another webhook response node"
```

This can happen if the client times out or cancels the request while the workflow is still processing.

### Summary Table

| Scenario | Result |
| --- | --- |
| Workflow hits Webhook Response | Custom response sent (first node wins) |
| Workflow finishes without Webhook Response | `200` with default message |
| Error before any Webhook Response | `500` error |
| No Webhook Trigger in workflow | Node ignored, outputs `null` |
| Client disconnected before response | Error message in node output |

## Workflow Examples

### Example 1: Conditional Responses with Validation

Return `200` when valid or `400` when input is invalid:

```
Webhook Trigger (POST JSON body)
  → Code Node
    Validate required fields (userId, email)
    Returns { valid: true/false, errors: [...] }
  → Conditional Branch
    Condition: $('Code').valid === true
    → [success] → Webhook Response (JSON)
        {
          "success": true,
          "message": "User data accepted"
        }
    → [failure] → Webhook Response (JSON)
        {
          "success": false,
          "errors": {{$('Code').errors}}
        }
```

### Example 2: Early Acknowledgment + Background Processing

Acknowledge the request immediately, then continue processing:

```
Webhook Trigger (respond = respond_to_webhook)
  → Webhook Response (JSON)
      {
        "status": "received",
        "requestId": {{$('Webhook Trigger').body.requestId}}
      }
  → HTTP Request (call external service)
  → Code Node (process results)
  → HTTP Request (send notification)
```

> The caller receives the acknowledgment right away. The rest of the workflow continues asynchronously.

### Example 3: REST API Endpoint

Build a proper REST endpoint with resource lookup:

```
Webhook Trigger (GET, path: /users/:userId)
  → HTTP Request
    URL: https://api.internal/users/{{$('Webhook Trigger').params.userId}}
  → Conditional Branch
    Condition: $('HTTP Request').status === 200
    → [found] → Webhook Response (Key-Value Pairs)
        status: "success"
        user: $('HTTP Request').body
    → [not found] → Webhook Response (JSON)
        {
          "error": "User not found",
          "userId": {{$('Webhook Trigger').params.userId}}
        }
```

### Example 4: No Data Response for Fire-and-Forget

```
Webhook Trigger (POST, respond = respond_to_webhook)
  → Webhook Response (No Data)    ← Acknowledges immediately
  → Code Node (heavy processing)
  → HTTP Request (store results)
```

## Constraints

### Single Effective Response

Only one Webhook Response node can send a response per workflow execution. The **first** one to execute wins — all others are ignored. This means:

```yaml
# ✓ Valid — only one branch executes
Conditional Branch
  → [branch A] → Webhook Response
  → [branch B] → Webhook Response

# ✗ Avoid — second node will be ignored
Webhook Response
  → Code Node
  → Webhook Response  ← Never sends
```

### Content Type Limitation

Currently, only **JSON** response bodies are supported (`application/json`). Plain text, HTML, binary, and other content types are not available in this version.

## Best Practices

### 1. Place After Data Processing

Position the Webhook Response node **after** the nodes that produce the data you want to return:

```
Webhook Trigger
  → LLM (generate content)
  → Code Node (format output)
  → Webhook Response ← Returns the formatted result
```

### 2. Always Handle Error Branches

Include a Webhook Response node in error branches so callers always get a meaningful response:

```javascript
// Success branch
→ Webhook Response (JSON) { "status": "ok", "data": ... }

// Error branch
→ Webhook Response (JSON) { "status": "error", "message": "..." }
```

Without this, the error branch would result in a `500` (no custom response sent).

### 3. Rename the Node

Double-click the node title to give it a descriptive name:

```
[Webhook Response]     ← Default
[Return Order Result]  ← Better
[Send 400 Validation Error] ← Best for error branches
```

### 4. Validate Input Early

Place validation logic and the error-returning Webhook Response **early** in the workflow to fail fast:

```
Webhook Trigger
  → Code Node (validate)
  → Conditional Branch
    → [invalid] → Webhook Response (400 error)  ← Fail fast
    → [valid] → ...continue processing...
```

### 5. Document the Response Schema

Use the node description field to document what callers can expect:

```yaml
nodeDescription: "Returns { success: boolean, orderId: string }.
On validation failure returns { success: false, errors: string[] }."
```

## FAQ

### Q1: What's the difference between Webhook Response and Answer nodes?

**A**:

| Feature | Webhook Response | Answer |
| --- | --- | --- |
| Triggered by | [Webhook Trigger](/en/guide/workflow/nodes/trigger-nodes/webhook) | Chat Trigger |
| Response consumer | HTTP client / API caller | End user in chat |
| Content types | JSON (structured) | Markdown / text |
| Status codes | Controllable (200/500/...) | N/A |

### Q2: What happens if I have a Webhook Response but the trigger respond mode is not set to respond_to_webhook?

**A**: The node is silently ignored and outputs `null`. You must set the Webhook Trigger's **Respond** option to **"Using 'Respond to Webhook' Node"** for the node to work.

### Q3: Can I set custom HTTP status codes like 201 or 404?

**A**: In the current version, the response status is determined by the execution path:
- Webhook Response node executes → `200`
- Error before any Webhook Response → `500`

Custom status codes (201, 400, 404, etc.) are not yet configurable through a dedicated field.

### Q4: Can I use expressions in the Response Body JSON?

**A**: Yes. The JSON field supports full [expression syntax](/en/guide/expressions/). Use `{{ }}` to embed dynamic values:

```javascript
{
  "userId": {{$('Webhook Trigger').body.userId}},
  "result": {{$('LLM').output}}
}
```

The Key-Value Pairs mode also supports expressions in both the Name and Value fields.

### Q5: What if my workflow has multiple branches, each with a Webhook Response?

**A**: This is the intended pattern. Only the branch that actually executes will send its response. The first Webhook Response node reached sends the response; parallel branches in other conditions are not reached.

### Q6: Does the workflow stop after a Webhook Response node?

**A**: **No.** The workflow continues executing after a Webhook Response node. This allows patterns like "acknowledge early, process later":

```
Webhook Response (send 200) → HTTP Request → Code → ...
```

However, subsequent Webhook Response nodes are ignored — the first response has already been sent.

## Next Steps

- [Webhook Trigger](/en/guide/workflow/nodes/trigger-nodes/webhook) — Configure the Webhook endpoint that receives incoming requests
- [HTTP Request Node](/en/guide/workflow/nodes/action-nodes/http-request) — Call external APIs from your workflow
- [Conditional Branch](/en/guide/workflow/nodes/action-nodes/if) — Route to different response nodes based on logic

## Related Resources

- [Expression Syntax](/en/guide/expressions/) — Build dynamic response content
- [Code Node](/en/guide/workflow/nodes/action-nodes/code) — Process data before sending responses
- [Transform Node](/en/guide/workflow/nodes/action-nodes/transform) — Transform data with expressions
