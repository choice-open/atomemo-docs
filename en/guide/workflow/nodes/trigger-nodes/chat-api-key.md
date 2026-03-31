---
title: Chat Trigger API Key Usage
description: Learn how to use API keys to call a published chatflow programmatically
---

# Chat Trigger API Key Usage

When you publish a workflow powered by the Chat Trigger, Atomemo exposes a set of HTTP endpoints that external applications can use to interact with the chatflow. All requests must be authenticated with a **chatflow API key**.

### Base URL

```
https://server.atomemo.ai/api
```

### Authentication

The Chat API uses an `API Key` for authentication.

::: warning
**We strongly recommend storing the `API Key` on your backend server. Never expose it in client-side code or share it publicly, as leaking it may result in unauthorized access.**
:::

All API requests must include your `API Key` in the **`X-Api-Key`** HTTP header:

```
X-Api-Key: {API_KEY}
```

---

## Send Chat Message {#send-chat-message}

`POST /chat/messages`

Send a new message or continue an existing conversation.

- **New conversation**: omit `conversationId` and `parentId`.
- **Continue conversation**: pass the `conversationId` and set `parentId` to the last message ID. The `dialogueCount` of the new message auto-increments.

### Request Body

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `appId` | string | Yes | Application ID |
| `triggerId` | string | Yes | Chat Trigger node ID |
| `query` | string \| FileRef | Yes | User message content. Can be a plain text string or a [FileRef](#fileref) object for file messages. |
| `userId` | string | Yes | End-user identifier, defined by the developer. Must be unique within the app. |
| `conversationId` | string (uuid) | No | Conversation ID. Required when continuing an existing conversation. |
| `parentId` | string (uuid) | No | Parent message ID. Required when continuing a conversation — must be the ID of the previous message. |
| `inputs` | object | No | Custom variables defined on the Chat Trigger node. Arbitrary key/value pairs. |
| `source` | string | No | Message source label, e.g. `"original H5"`. |

### Response

The response is an SSE (Server-Sent Events) stream with `Content-Type: text/event-stream`.

Each chunk starts with `data:` and chunks are separated by `\n\n`:

```
data: {"event": "message_created", "data": {"message_id": "xxx", "conversation_id": "xxx"}}

data: {"event": "chat_message", "data": {"text": "Hello"}}

data: {"event": "execution_finished", "data": {"resource_type": "execution", "resource": {...}}}
```

See [SSE Events](#sse-events) for all event types and their data structures.

### Errors

| Code | Description |
|------|-------------|
| `APP_OR_TRIGGER_NOT_FOUND` | The specified app or trigger does not exist |
| `CONVERSATION_NOT_FOUND` | The conversation ID does not exist |
| `CONVERSATION_USER_ID_MISMATCH` | The userId does not match the conversation owner |
| `CONVERSATION_MESSAGE_MISMATCH` | The parentId does not belong to the specified conversation |
| `PARENT_NOT_FOUND` | The parent message ID does not exist |
| `TRIGGER_INPUTS_ERROR` | The custom variable inputs are invalid |

### Example

```bash
curl -X POST 'https://server.atomemo.ai/api/chat/messages' \
  --header 'X-Api-Key: {API_KEY}' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "appId": "your-app-id",
    "triggerId": "chat-trigger-node-id",
    "query": "What are the features of your product?",
    "userId": "user-123",
    "source": "api"
  }'
```

Continue conversation:

```bash
curl -X POST 'https://server.atomemo.ai/api/chat/messages' \
  --header 'X-Api-Key: {API_KEY}' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "appId": "your-app-id",
    "triggerId": "chat-trigger-node-id",
    "query": "Tell me more about that",
    "userId": "user-123",
    "conversationId": "conv-uuid",
    "parentId": "prev-message-uuid"
  }'
```

Send a file message:

```bash
curl -X POST 'https://server.atomemo.ai/api/chat/messages' \
  --header 'X-Api-Key: {API_KEY}' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "appId": "your-app-id",
    "triggerId": "chat-trigger-node-id",
    "query": {
      "__type__": "file_ref",
      "source": "oss",
      "filename": "document.pdf",
      "extension": ".pdf",
      "mimeType": "application/pdf",
      "size": 102400,
      "resKey": "20251020/abc-123.pdf",
      "remoteUrl": null
    },
    "userId": "user-123"
  }'
```

---

## SSE Events {#sse-events}

When calling `POST /chat/messages` or `GET /chat/messages/{id}/resume_stream`, the server returns a stream of Server-Sent Events. Each event has a different structure depending on its `event` type.

### `message_created`

Emitted when a new message and/or conversation is created on the server.

- `message_id` (string) — The server-assigned message ID
- `conversation_id` (string) — The conversation ID (new or existing)

```json
{"event": "message_created", "data": {"message_id": "msg-uuid", "conversation_id": "conv-uuid"}}
```

### `chat_message`

LLM text output chunk. Accumulate these to build the full response.

- `text` (string) — A text fragment of the AI response

```json
{"event": "chat_message", "data": {"text": "Hello, "}}
```

### `execution_started`

Emitted when the workflow execution begins.

- `resource_type` (string) — `"execution"`
- `resource` (object)
  - `id` (string) — Execution ID
  - `status` (string) — `"running"`
  - `trigger_id` (string) — Trigger node ID
  - `app_version_id` (string) — App version ID
  - `conversation_id` (string) — Conversation ID
  - `created_at` (string) — ISO 8601 timestamp

```json
{"event": "execution_started", "data": {"resource_type": "execution", "resource": {"id": "exec-uuid", "status": "running", "trigger_id": "trigger-uuid", "app_version_id": "ver-uuid", "conversation_id": "conv-uuid", "created_at": "2025-01-15T10:30:00Z"}}}
```

### `execution_finished`

Emitted when the workflow execution completes.

- `resource_type` (string) — `"execution"`
- `resource` (object)
  - `id` (string) — Execution ID
  - `status` (string) — `"succeeded"` or `"failed"`
  - `trigger_id` (string) — Trigger node ID
  - `app_version_id` (string) — App version ID
  - `conversation_id` (string) — Conversation ID

```json
{"event": "execution_finished", "data": {"resource_type": "execution", "resource": {"id": "exec-uuid", "status": "succeeded", "trigger_id": "trigger-uuid", "app_version_id": "ver-uuid", "conversation_id": "conv-uuid"}}}
```

### `node_started`

Emitted when a workflow node begins execution.

- `resource_type` (string) — `"result"`
- `resource` (object)
  - `id` (string) — Node execution result ID
  - `node_id` (string) — Node ID
  - `execution_id` (string) — Execution ID
  - `status` (string) — `"running"`
  - `json_output` (any) — Current output (usually `null` at start)
  - `out_ports` (array[number]) — Active output port indices
  - `error` (string | null) — Error message if any

```json
{"event": "node_started", "data": {"resource_type": "result", "resource": {"id": "result-uuid", "node_id": "node-uuid", "execution_id": "exec-uuid", "status": "running", "json_output": null, "out_ports": [], "error": null}}}
```

### `node_finished`

Emitted when a workflow node finishes execution.

- `resource_type` (string) — `"result"`
- `resource` (object)
  - `id` (string) — Node execution result ID
  - `node_id` (string) — Node ID
  - `execution_id` (string) — Execution ID
  - `status` (string) — `"succeeded"`, `"failed"`, or `"break"`
  - `json_output` (any) — Node output data
  - `out_ports` (array[number]) — Active output port indices
  - `error` (string | null) — Error message if failed

```json
{"event": "node_finished", "data": {"resource_type": "result", "resource": {"id": "result-uuid", "node_id": "node-uuid", "execution_id": "exec-uuid", "status": "succeeded", "json_output": {"answer": "Hello!"}, "out_ports": [0], "error": null}}}
```

### `tool_call_started`

Emitted when a tool call begins within an AI Agent node.

- `resource_type` (string) — `"tool_call"`
- `resource` (object)
  - `id` (string) — Tool call ID
  - `node_id` (string) — Node ID of the AI Agent
  - `tool_name` (string) — Name of the tool being called
  - `args` (object) — Tool call arguments

```json
{"event": "tool_call_started", "data": {"resource_type": "tool_call", "resource": {"id": "tc-uuid", "node_id": "agent-uuid", "tool_name": "http_request", "args": {"url": "https://api.example.com/weather"}}}}
```

### `tool_response`

Emitted when a tool call returns a result.

- `resource_type` (string) — `"tool_response"`
- `resource` (object)
  - `id` (string) — Tool call ID
  - `node_id` (string) — Node ID of the AI Agent
  - `tool_name` (string) — Name of the tool
  - `result` (string) — Tool call return value

```json
{"event": "tool_response", "data": {"resource_type": "tool_response", "resource": {"id": "tc-uuid", "node_id": "agent-uuid", "tool_name": "http_request", "result": "{\"temperature\": 15, \"city\": \"Beijing\"}"}}}
```

### `heartbeat`

Sent periodically to keep the connection alive. No data payload.

```json
{"event": "heartbeat"}
```

---

## Get App Info {#get-app-info}

`GET /chat/app/{appId}`

This is a public endpoint. Retrieving app information does not require API key authentication.

Retrieve the currently published app and its active version. Returns 404 if the app does not exist or is offline.

### Path Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `appId` | string | Yes | Application ID |

### Response

Returns an `App` object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string (uuid) | App ID |
| `name` | string | App name |
| `description` | string \| null | App description |
| `status` | string | `"active"` or `"inactive"` |
| `activeVersionId` | string \| null | Currently published version ID |
| `activeVersion` | AppVersion | Currently published version details |
| `icon` | object | App icon configuration |
| `color` | string | App color |
| `organizationId` | string | Organization ID |
| `teamId` | string | Team ID |
| `createdAt` | string (datetime) | Creation timestamp |
| `updatedAt` | string (datetime) | Last update timestamp |

**AppVersion** object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string (uuid) | Version ID |
| `appId` | string (uuid) | Parent app ID |
| `name` | string | Version name |
| `description` | string \| null | Version description |
| `snapshot` | object | Version snapshot data (contains workflow nodes) |
| `screenshot` | string \| null | Version screenshot URL |
| `system` | boolean | Whether this is a system version |
| `createdBy` | string | Creator user ID |
| `createdAt` | string (datetime) | Creation timestamp |
| `updatedAt` | string (datetime) | Last update timestamp |

### Example

```bash
curl -X GET 'https://server.atomemo.ai/api/chat/app/{appId}' \
  --header 'X-Api-Key: {API_KEY}'
```

Response:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Customer Service Bot",
  "description": "AI-powered customer support",
  "status": "active",
  "activeVersionId": "660e8400-e29b-41d4-a716-446655440001",
  "activeVersion": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "appId": "550e8400-e29b-41d4-a716-446655440000",
    "name": "v1.0",
    "description": "Initial release",
    "snapshot": {
      "nodes": { ... }
    },
    "screenshot": null,
    "system": false,
    "createdBy": "user-uuid",
    "createdAt": "2025-01-15T08:00:00Z",
    "updatedAt": "2025-01-15T08:00:00Z"
  },
  "icon": { "emoji": "🤖" },
  "color": "#4F46E5",
  "organizationId": "org-uuid",
  "teamId": "team-uuid",
  "createdAt": "2025-01-10T08:00:00Z",
  "updatedAt": "2025-01-15T08:00:00Z"
}
```

---

## Get Conversation List {#get-conversations}

`GET /chat/conversations`

Retrieve the list of conversations for a given app, trigger, and user.

### Query Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `appId` | string | Yes | Application ID |
| `triggerId` | string | Yes | Chat Trigger node ID |
| `userId` | string | Yes | End-user identifier |

### Response

| Field | Type | Description |
|-------|------|-------------|
| `items` | array[Conversation] | List of conversations |

**Conversation** object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Conversation ID |
| `name` | string | Conversation name |
| `appId` | string (uuid) | Application ID |
| `triggerId` | string | Chat Trigger node ID |
| `userId` | string | End-user identifier |
| `inputs` | object | Custom variables from the last message |
| `startedAt` | string (datetime) | Conversation start time |
| `createdAt` | string (datetime) | Creation timestamp |
| `updatedAt` | string (datetime) | Last update timestamp |

### Example

```bash
curl -X GET 'https://server.atomemo.ai/api/chat/conversations?appId={appId}&triggerId={triggerId}&userId={userId}' \
  --header 'X-Api-Key: {API_KEY}'
```

Response:

```json
{
  "items": [
    {
      "id": "conv-uuid-1",
      "name": "Product inquiry",
      "appId": "550e8400-e29b-41d4-a716-446655440000",
      "triggerId": "trigger-uuid",
      "userId": "user-123",
      "inputs": {},
      "startedAt": "2025-01-15T10:30:00Z",
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-15T10:35:00Z"
    }
  ]
}
```

---

## Get Message History {#get-messages}

`GET /chat/messages`

Retrieve the message list for a conversation. Messages are returned as a flat list.

The endpoint supports a message-tree model. When the conversation has branching (e.g. the user re-asked a question to generate a different answer), messages form a tree:

```
M1 ── M2 ── M4
 │     └─── M5
 └─── M3
```

- Passing only `conversation_id` returns all messages (M1 through M5) as a flat list.
- Passing `end_message_id=M4` with `include_end=false` returns the path: M1, M2.
- Passing `end_message_id=M4` with `include_end=true` returns the path: M1, M2, M4.

### Query Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `conversation_id` | string | Yes | Conversation ID |
| `end_message_id` | string | No | Only return the path ending at this message ID |
| `include_end` | boolean | No | Whether to include the end message. Default: `false` |

### Response

| Field | Type | Description |
|-------|------|-------------|
| `items` | array[Message] | List of messages |

**Message** object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Message ID |
| `status` | string | `"querying"`, `"answering"`, `"succeeded"`, or `"failed"` |
| `query` | string \| FileRef | User's question — a string or a [FileRef](#fileref) object |
| `answer` | string \| null | AI response content |
| `executionId` | string | Workflow execution record ID |
| `dialogueCount` | integer | Dialogue turn number, starting from 1 |
| `userId` | string | End-user identifier |
| `source` | string \| null | Message source |
| `inputs` | object | Custom variable values |
| `parentId` | string \| null | Parent message ID |
| `conversationId` | string | Conversation ID |
| `createdAt` | string (datetime) | Creation timestamp |
| `updatedAt` | string (datetime) | Last update timestamp |

### Example

```bash
curl -X GET 'https://server.atomemo.ai/api/chat/messages?conversation_id={conversationId}' \
  --header 'X-Api-Key: {API_KEY}'
```

Get a specific path through the message tree:

```bash
curl -X GET 'https://server.atomemo.ai/api/chat/messages?conversation_id={conversationId}&end_message_id={messageId}&include_end=true' \
  --header 'X-Api-Key: {API_KEY}'
```

Response:

```json
{
  "items": [
    {
      "id": "msg-uuid-1",
      "status": "succeeded",
      "query": "Hello, what can you do?",
      "answer": "I can help you with product inquiries, order tracking, and more!",
      "executionId": "exec-uuid-1",
      "dialogueCount": 1,
      "userId": "user-123",
      "source": "api",
      "inputs": {},
      "parentId": null,
      "conversationId": "conv-uuid",
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-15T10:30:05Z"
    },
    {
      "id": "msg-uuid-2",
      "status": "succeeded",
      "query": "Tell me about pricing",
      "answer": "Our plans start at $9.99/month...",
      "executionId": "exec-uuid-2",
      "dialogueCount": 2,
      "userId": "user-123",
      "source": "api",
      "inputs": {},
      "parentId": "msg-uuid-1",
      "conversationId": "conv-uuid",
      "createdAt": "2025-01-15T10:31:00Z",
      "updatedAt": "2025-01-15T10:31:08Z"
    }
  ]
}
```

---

## Resume Message Stream {#resume-stream}

`GET /chat/messages/{id}/resume_stream`

Resume an SSE stream for a message that is still being processed. The stream is preserved for **2 minutes** after the message completes. After that, the stream is no longer resumable.

This is useful when the client loses connection during a streaming response and needs to reconnect.

### Path Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | string | Yes | Message ID |

### Response

Returns an SSE stream (same format as [Send Chat Message](#send-chat-message)). See [SSE Events](#sse-events) for event types.

### Errors

| Code | Description |
|------|-------------|
| `NOT_FOUND` | The message does not exist |
| `UNRESUMABLE_STREAM` | The stream is older than 2 minutes and can no longer be resumed |

### Example

```bash
curl -X GET 'https://server.atomemo.ai/api/chat/messages/{messageId}/resume_stream' \
  --header 'X-Api-Key: {API_KEY}'
```

---

## File Upload {#file-upload}

Atomemo supports sending files as chat messages. The upload process involves multiple steps depending on the upload method.

### Method 1: Upload by URL {#upload-by-url}

Upload a file from a third-party URL to Atomemo's storage, and receive a [FileRef](#fileref) object that can be used as the `query` in [Send Chat Message](#send-chat-message).

`POST /chat/media/upload`

#### Request Body

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `url` | string (uri) | Yes | Public URL of the file to upload |

#### Response

Returns a [FileRef](#fileref) object.

#### Example

```bash
curl -X POST 'https://server.atomemo.ai/api/chat/media/upload' \
  --header 'X-Api-Key: {API_KEY}' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "url": "https://example.com/documents/report.pdf"
  }'
```

Response:

```json
{
  "__type__": "file_ref",
  "source": "oss",
  "filename": "report.pdf",
  "extension": ".pdf",
  "mimeType": "application/pdf",
  "size": 102400,
  "resKey": "20251020/abc-123.pdf",
  "remoteUrl": "https://storage.example.com/20251020/abc-123.pdf?token=..."
}
```

### Method 2: Direct Upload (3-Step Flow) {#direct-upload}

For uploading local files, the process has three steps:

**Step 1 — Get upload credentials**

`GET /chat/media/uptoken`

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `mimeType` | string (query) | No | MIME type of the file to upload |

Response:

| Field | Type | Description |
|-------|------|-------------|
| `uptoken` | string | Upload authentication token |
| `resKey` | string | Storage resource key for the file |
| `uploadHost` | string | Upload endpoint URL |

```bash
curl -X GET 'https://server.atomemo.ai/api/chat/media/uptoken?mimeType=application/pdf' \
  --header 'X-Api-Key: {API_KEY}'
```

Response:

```json
{
  "uptoken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "resKey": "workflow_input_files/550e8400.pdf",
  "uploadHost": "https://storage.example.com"
}
```

**Step 2 — Upload the file to storage**

Use the credentials from Step 1 to upload the file directly to the storage provider:

```bash
curl -X PUT '{uploadHost}/{resKey}?{uptoken}' \
  --header 'Content-Type: application/pdf' \
  --data-binary '@/path/to/local/file.pdf'
```

**Step 3 — Get the download URL**

After upload, resolve the `resKey` to a downloadable URL:

`GET /chat/media/download_url`

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `resKey` | string (query) | Yes | File resource key from Step 1 |

```bash
curl -X GET 'https://server.atomemo.ai/api/chat/media/download_url?resKey={resKey}' \
  --header 'X-Api-Key: {API_KEY}'
```

Response:

```json
{
  "data": "https://storage.example.com/abc?e=1762766213&token=..."
}
```

::: info
If the file no longer exists in storage, the returned URL will respond with 404: `{"error": "Document not found"}`
:::

You can now construct a [FileRef](#fileref) object using the `resKey` and send it via [Send Chat Message](#send-chat-message).

---

## FileRef Object {#fileref}

The `FileRef` object represents a file stored in Atomemo's object storage. It is used as the `query` value in [Send Chat Message](#send-chat-message) when sending a file instead of text, and is returned in message history.

| Field | Type | Description |
|-------|------|-------------|
| `__type__` | string | Always `"file_ref"` |
| `source` | string | File source. Currently only `"oss"` |
| `filename` | string | Full filename including extension |
| `extension` | string | File extension with dot, e.g. `".pdf"` |
| `mimeType` | string | MIME type of the file |
| `size` | integer | File size in bytes |
| `resKey` | string | OSS resource key |
| `remoteUrl` | string \| null | Direct download URL (read-only, may be null) |

---

## Next Steps

- [Chat Trigger Node](/en/guide/workflow/nodes/trigger-nodes/chat) — Back to the Chat Trigger overview
- [Execute Workflow](/en/guide/workflow/execute-workflow) — Test workflows before publishing
- [Answer Node](/en/guide/workflow/nodes/action-nodes/answer) — Control what the API returns
