---
title: Chat 触发器 API Key 使用指南
description: 了解如何使用 API Key 以编程方式调用已发布的 Chatflow
---

# Chat 触发器 API Key 使用指南

当您发布一个包含 Chat 触发器的工作流后，Atomemo 会暴露一组 HTTP 端点，外部应用程序可以通过这些端点与 Chatflow 进行交互。所有请求都需要使用 **Chatflow API Key** 进行身份验证。

### 基础 URL

```
https://server.atomemo.ai/api
```

### 鉴权

Chat API 使用 `API Key` 进行鉴权。

::: warning
**强烈建议开发者把 `API Key` 放在后端存储，而非分享或者放在客户端存储，以免 `API Key` 泄露，导致未授权访问。**
:::

所有 API 请求都应在 **`X-Api-Key`** HTTP Header 中包含您的 `API Key`：

```
X-Api-Key: {API_KEY}
```

---

## 发送会话消息 {#send-chat-message}

`POST /chat/messages`

发送新消息或继续已有会话。

- **发起新会话**：不需要传 `conversationId` 和 `parentId`。
- **继续会话**：需要传 `conversationId`，`parentId` 必须是上一条消息的 ID。新消息的 `dialogueCount` 会自动递增。

### Request Body

| 名称 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `appId` | string | 是 | 应用 ID |
| `triggerId` | string | 是 | Chat 触发器节点 ID |
| `query` | string \| FileRef | 是 | 用户消息内容。可以是纯文本字符串，也可以是 [FileRef](#fileref) 对象用于发送文件消息。 |
| `userId` | string | 是 | 用户标识，由开发者定义规则，需保证在应用内唯一。 |
| `conversationId` | string (uuid) | 否 | 会话 ID。继续已有会话时必须传入。 |
| `parentId` | string (uuid) | 否 | 上一条消息 ID。继续会话时必须传入，值为上一条消息的 ID。 |
| `inputs` | object | 否 | Chat 触发器节点定义的自定义变量，支持任意键值对。 |
| `source` | string | 否 | 消息来源标签，如 `"original H5"`。 |

### Response

返回 SSE（Server-Sent Events）流，`Content-Type` 为 `text/event-stream`。

每个流式块以 `data:` 开头，块之间以 `\n\n`（两个换行符）分隔：

```
data: {"event": "message_created", "data": {"message_id": "xxx", "conversation_id": "xxx"}}

data: {"event": "chat_message", "data": {"text": "Hello"}}

data: {"event": "execution_finished", "data": {"resource_type": "execution", "resource": {...}}}
```

详见 [SSE 事件](#sse-events) 了解所有事件类型及其数据结构。

### 错误码

| 错误码 | 描述 |
|--------|------|
| `APP_OR_TRIGGER_NOT_FOUND` | 指定的应用或触发器不存在 |
| `CONVERSATION_NOT_FOUND` | 会话 ID 不存在 |
| `CONVERSATION_USER_ID_MISMATCH` | userId 与会话所有者不匹配 |
| `CONVERSATION_MESSAGE_MISMATCH` | parentId 不属于指定的会话 |
| `PARENT_NOT_FOUND` | 上一条消息 ID 不存在 |
| `TRIGGER_INPUTS_ERROR` | 自定义变量输入不合法 |

### 示例

```bash
curl -X POST 'https://server.atomemo.ai/api/chat/messages' \
  --header 'X-Api-Key: {API_KEY}' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "appId": "your-app-id",
    "triggerId": "chat-trigger-node-id",
    "query": "你们产品有什么功能？",
    "userId": "user-123",
    "source": "api"
  }'
```

继续会话：

```bash
curl -X POST 'https://server.atomemo.ai/api/chat/messages' \
  --header 'X-Api-Key: {API_KEY}' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "appId": "your-app-id",
    "triggerId": "chat-trigger-node-id",
    "query": "能详细说说吗",
    "userId": "user-123",
    "conversationId": "conv-uuid",
    "parentId": "prev-message-uuid"
  }'
```

发送文件消息：

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

## SSE 事件 {#sse-events}

调用 `POST /chat/messages` 或 `GET /chat/messages/{id}/resume_stream` 时，服务器返回 Server-Sent Events 流。每个事件根据 `event` 类型有不同的数据结构。

### `message_created`

消息创建事件。当服务器创建新消息或会话时触发。

- `message_id` (string) — 服务器分配的消息 ID
- `conversation_id` (string) — 会话 ID（新建或已有）

```json
{"event": "message_created", "data": {"message_id": "msg-uuid", "conversation_id": "conv-uuid"}}
```

### `chat_message`

LLM 返回文本块事件。累积这些文本块即可构建完整回复。

- `text` (string) — AI 回复的文本片段

```json
{"event": "chat_message", "data": {"text": "你好，"}}
```

### `execution_started`

工作流执行开始事件。

- `resource_type` (string) — `"execution"`
- `resource` (object)
  - `id` (string) — 执行 ID
  - `status` (string) — `"running"`
  - `trigger_id` (string) — 触发器节点 ID
  - `app_version_id` (string) — 应用版本 ID
  - `conversation_id` (string) — 会话 ID
  - `created_at` (string) — ISO 8601 时间戳

```json
{"event": "execution_started", "data": {"resource_type": "execution", "resource": {"id": "exec-uuid", "status": "running", "trigger_id": "trigger-uuid", "app_version_id": "ver-uuid", "conversation_id": "conv-uuid", "created_at": "2025-01-15T10:30:00Z"}}}
```

### `execution_finished`

工作流执行完成事件。

- `resource_type` (string) — `"execution"`
- `resource` (object)
  - `id` (string) — 执行 ID
  - `status` (string) — `"succeeded"` 或 `"failed"`
  - `trigger_id` (string) — 触发器节点 ID
  - `app_version_id` (string) — 应用版本 ID
  - `conversation_id` (string) — 会话 ID

```json
{"event": "execution_finished", "data": {"resource_type": "execution", "resource": {"id": "exec-uuid", "status": "succeeded", "trigger_id": "trigger-uuid", "app_version_id": "ver-uuid", "conversation_id": "conv-uuid"}}}
```

### `node_started`

工作流节点开始执行事件。

- `resource_type` (string) — `"result"`
- `resource` (object)
  - `id` (string) — 节点执行结果 ID
  - `node_id` (string) — 节点 ID
  - `execution_id` (string) — 执行 ID
  - `status` (string) — `"running"`
  - `json_output` (any) — 当前输出（启动时通常为 `null`）
  - `out_ports` (array[number]) — 激活的输出端口索引
  - `error` (string | null) — 错误信息

```json
{"event": "node_started", "data": {"resource_type": "result", "resource": {"id": "result-uuid", "node_id": "node-uuid", "execution_id": "exec-uuid", "status": "running", "json_output": null, "out_ports": [], "error": null}}}
```

### `node_finished`

工作流节点执行完成事件。

- `resource_type` (string) — `"result"`
- `resource` (object)
  - `id` (string) — 节点执行结果 ID
  - `node_id` (string) — 节点 ID
  - `execution_id` (string) — 执行 ID
  - `status` (string) — `"succeeded"`、`"failed"` 或 `"break"`
  - `json_output` (any) — 节点输出数据
  - `out_ports` (array[number]) — 激活的输出端口索引
  - `error` (string | null) — 失败时的错误信息

```json
{"event": "node_finished", "data": {"resource_type": "result", "resource": {"id": "result-uuid", "node_id": "node-uuid", "execution_id": "exec-uuid", "status": "succeeded", "json_output": {"answer": "你好！"}, "out_ports": [0], "error": null}}}
```

### `tool_call_started`

工具调用开始事件，在 AI Agent 节点中触发。

- `resource_type` (string) — `"tool_call"`
- `resource` (object)
  - `id` (string) — 工具调用 ID
  - `node_id` (string) — AI Agent 节点 ID
  - `tool_name` (string) — 被调用的工具名称
  - `args` (object) — 工具调用参数

```json
{"event": "tool_call_started", "data": {"resource_type": "tool_call", "resource": {"id": "tc-uuid", "node_id": "agent-uuid", "tool_name": "http_request", "args": {"url": "https://api.example.com/weather"}}}}
```

### `tool_response`

工具调用返回结果事件。

- `resource_type` (string) — `"tool_response"`
- `resource` (object)
  - `id` (string) — 工具调用 ID
  - `node_id` (string) — AI Agent 节点 ID
  - `tool_name` (string) — 工具名称
  - `result` (string) — 工具调用的返回结果

```json
{"event": "tool_response", "data": {"resource_type": "tool_response", "resource": {"id": "tc-uuid", "node_id": "agent-uuid", "tool_name": "http_request", "result": "{\"temperature\": 15, \"city\": \"Beijing\"}"}}}
```

### `heartbeat`

心跳事件，定期发送以保持连接活跃。无数据载荷。

```json
{"event": "heartbeat"}
```

---

## 获取应用信息 {#get-app-info}

`GET /chat/app/{appId}`

该接口为公开接口，获取应用信息不需要使用 API Key 进行鉴权。

获取当前上线的应用和版本信息。如果应用不存在或已下线，返回 404。

### 路径参数

| 名称 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `appId` | string | 是 | 应用 ID |

### Response

返回 `App` 对象：

| 字段 | 类型 | 描述 |
|------|------|------|
| `id` | string (uuid) | 应用 ID |
| `name` | string | 应用名称 |
| `description` | string \| null | 应用描述 |
| `status` | string | `"active"` 或 `"inactive"` |
| `activeVersionId` | string \| null | 当前上线的版本 ID |
| `activeVersion` | AppVersion | 当前上线的版本详情 |
| `icon` | object | 应用图标配置 |
| `color` | string | 应用颜色 |
| `organizationId` | string | 组织 ID |
| `teamId` | string | 团队 ID |
| `createdAt` | string (datetime) | 创建时间 |
| `updatedAt` | string (datetime) | 更新时间 |

**AppVersion** 对象：

| 字段 | 类型 | 描述 |
|------|------|------|
| `id` | string (uuid) | 版本 ID |
| `appId` | string (uuid) | 关联应用 ID |
| `name` | string | 版本号 |
| `description` | string \| null | 版本描述 |
| `snapshot` | object | 版本快照数据（包含工作流节点） |
| `screenshot` | string \| null | 版本截图 URL |
| `system` | boolean | 是否为系统版本 |
| `createdBy` | string | 创建者用户 ID |
| `createdAt` | string (datetime) | 创建时间 |
| `updatedAt` | string (datetime) | 更新时间 |

### 示例

```bash
curl -X GET 'https://server.atomemo.ai/api/chat/app/{appId}' \
  --header 'X-Api-Key: {API_KEY}'
```

Response：

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "智能客服",
  "description": "AI 驱动的客户支持",
  "status": "active",
  "activeVersionId": "660e8400-e29b-41d4-a716-446655440001",
  "activeVersion": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "appId": "550e8400-e29b-41d4-a716-446655440000",
    "name": "v1.0",
    "description": "初始版本",
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

## 获取会话列表 {#get-conversations}

`GET /chat/conversations`

获取指定应用、触发器和用户的会话列表。

### 查询参数

| 名称 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `appId` | string | 是 | 应用 ID |
| `triggerId` | string | 是 | Chat 触发器节点 ID |
| `userId` | string | 是 | 用户标识 |

### Response

| 字段 | 类型 | 描述 |
|------|------|------|
| `items` | array[Conversation] | 会话列表 |

**Conversation** 对象：

| 字段 | 类型 | 描述 |
|------|------|------|
| `id` | string | 会话 ID |
| `name` | string | 会话名称 |
| `appId` | string (uuid) | 应用 ID |
| `triggerId` | string | Chat 触发器节点 ID |
| `userId` | string | 用户标识 |
| `inputs` | object | 最后一条消息的自定义参数 |
| `startedAt` | string (datetime) | 会话开始时间 |
| `createdAt` | string (datetime) | 创建时间 |
| `updatedAt` | string (datetime) | 更新时间 |

### 示例

```bash
curl -X GET 'https://server.atomemo.ai/api/chat/conversations?appId={appId}&triggerId={triggerId}&userId={userId}' \
  --header 'X-Api-Key: {API_KEY}'
```

Response：

```json
{
  "items": [
    {
      "id": "conv-uuid-1",
      "name": "产品咨询",
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

## 获取消息列表 {#get-messages}

`GET /chat/messages`

获取会话的消息列表。消息以平铺列表的形式返回。

该端点支持消息树模型。当会话中存在分支（例如用户重新提问以获取不同回答）时，消息会形成树状结构：

```
M1 ── M2 ── M4
 │     └─── M5
 └─── M3
```

- 仅传 `conversation_id`：返回所有消息（M1 到 M5），以列表形式给出。
- 配合 `end_message_id=M4` 和 `include_end=false`：返回路径 M1, M2。
- 配合 `end_message_id=M4` 和 `include_end=true`：返回路径 M1, M2, M4。

### 查询参数

| 名称 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `conversation_id` | string | 是 | 会话 ID |
| `end_message_id` | string | 否 | 仅返回以该 ID 为结束消息的路径 |
| `include_end` | boolean | 否 | 是否包含结束消息，默认 `false` |

### Response

| 字段 | 类型 | 描述 |
|------|------|------|
| `items` | array[Message] | 消息列表 |

**Message** 对象：

| 字段 | 类型 | 描述 |
|------|------|------|
| `id` | string | 消息 ID |
| `status` | string | `"querying"`、`"answering"`、`"succeeded"` 或 `"failed"` |
| `query` | string \| FileRef | 用户的提问——字符串或 [FileRef](#fileref) 对象 |
| `answer` | string \| null | AI 的回复内容 |
| `executionId` | string | 工作流运行记录 ID |
| `dialogueCount` | integer | 对话轮数，从 1 开始 |
| `userId` | string | 用户标识 |
| `source` | string \| null | 消息来源 |
| `inputs` | object | 自定义变量值 |
| `parentId` | string \| null | 上一条消息 ID |
| `conversationId` | string | 会话 ID |
| `createdAt` | string (datetime) | 创建时间 |
| `updatedAt` | string (datetime) | 更新时间 |

### 示例

```bash
curl -X GET 'https://server.atomemo.ai/api/chat/messages?conversation_id={conversationId}' \
  --header 'X-Api-Key: {API_KEY}'
```

获取消息树中的指定路径：

```bash
curl -X GET 'https://server.atomemo.ai/api/chat/messages?conversation_id={conversationId}&end_message_id={messageId}&include_end=true' \
  --header 'X-Api-Key: {API_KEY}'
```

Response：

```json
{
  "items": [
    {
      "id": "msg-uuid-1",
      "status": "succeeded",
      "query": "你好，你能做什么？",
      "answer": "我可以帮您进行产品咨询、订单查询等服务！",
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
      "query": "介绍一下定价方案",
      "answer": "我们的方案起价 ¥69/月……",
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

## 恢复消息流 {#resume-stream}

`GET /chat/messages/{id}/resume_stream`

恢复一个仍在处理中的消息的 SSE 流。流在消息完成后保留 **2 分钟**，超过时间后将无法恢复。

当客户端在流式响应过程中断开连接后需要重新连接时，可使用此端点。

### 路径参数

| 名称 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `id` | string | 是 | 消息 ID |

### Response

返回 SSE 流（与[发送会话消息](#send-chat-message)格式相同）。详见 [SSE 事件](#sse-events) 了解事件类型。

### 错误码

| 错误码 | 描述 |
|--------|------|
| `NOT_FOUND` | 消息不存在 |
| `UNRESUMABLE_STREAM` | 流已超过 2 分钟，无法恢复 |

### 示例

```bash
curl -X GET 'https://server.atomemo.ai/api/chat/messages/{messageId}/resume_stream' \
  --header 'X-Api-Key: {API_KEY}'
```

---

## 文件上传 {#file-upload}

Atomemo 支持发送文件作为聊天消息。根据上传方式不同，上传流程涉及多个步骤。

### 方式一：通过 URL 上传 {#upload-by-url}

从第三方 URL 上传文件到 Atomemo 的存储，并获取 [FileRef](#fileref) 对象，可用于[发送会话消息](#send-chat-message)的 `query` 字段。

`POST /chat/media/upload`

#### Request Body

| 名称 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `url` | string (uri) | 是 | 文件的公开 URL |

#### Response

返回 [FileRef](#fileref) 对象。

#### 示例

```bash
curl -X POST 'https://server.atomemo.ai/api/chat/media/upload' \
  --header 'X-Api-Key: {API_KEY}' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "url": "https://example.com/documents/report.pdf"
  }'
```

Response：

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

### 方式二：直接上传（三步流程） {#direct-upload}

上传本地文件的流程分为三步：

**第一步 — 获取上传凭证**

`GET /chat/media/uptoken`

| 名称 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `mimeType` | string (query) | 否 | 上传文件的 MIME 类型 |

Response：

| 字段 | 类型 | 描述 |
|------|------|------|
| `uptoken` | string | 上传凭证 |
| `resKey` | string | 文件的存储资源键 |
| `uploadHost` | string | 上传地址 |

```bash
curl -X GET 'https://server.atomemo.ai/api/chat/media/uptoken?mimeType=application/pdf' \
  --header 'X-Api-Key: {API_KEY}'
```

Response：

```json
{
  "uptoken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "resKey": "workflow_input_files/550e8400.pdf",
  "uploadHost": "https://storage.example.com"
}
```

**第二步 — 上传文件到存储**

使用第一步获取的凭证，将文件直接上传到存储服务：

```bash
curl -X PUT '{uploadHost}/{resKey}?{uptoken}' \
  --header 'Content-Type: application/pdf' \
  --data-binary '@/path/to/local/file.pdf'
```

**第三步 — 获取下载链接**

上传完成后，将 `resKey` 解析为可下载的 URL：

`GET /chat/media/download_url`

| 名称 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `resKey` | string (query) | 是 | 第一步获取的文件资源键 |

```bash
curl -X GET 'https://server.atomemo.ai/api/chat/media/download_url?resKey={resKey}' \
  --header 'X-Api-Key: {API_KEY}'
```

Response：

```json
{
  "data": "https://storage.example.com/abc?e=1762766213&token=..."
}
```

::: info
如果存储中的文件已不存在，返回的 URL 会响应 404：`{"error": "Document not found"}`
:::

现在您可以使用 `resKey` 构建 [FileRef](#fileref) 对象，并通过[发送会话消息](#send-chat-message)发送。

---

## FileRef 对象 {#fileref}

`FileRef` 对象表示存储在 Atomemo 对象存储中的文件。在[发送会话消息](#send-chat-message)中作为 `query` 值发送文件消息时使用，在消息历史中也会返回。

| 字段 | 类型 | 描述 |
|------|------|------|
| `__type__` | string | 固定为 `"file_ref"` |
| `source` | string | 文件来源，目前仅支持 `"oss"` |
| `filename` | string | 完整文件名，包含扩展名 |
| `extension` | string | 文件扩展名，带点号，如 `".pdf"` |
| `mimeType` | string | 文件的 MIME 类型 |
| `size` | integer | 文件大小，单位字节 |
| `resKey` | string | OSS 资源键 |
| `remoteUrl` | string \| null | 直接下载 URL（只读，可能为 null） |

---

## 下一步

- [Chat 触发器节点](/zh-hans/guide/workflow/nodes/trigger-nodes/chat) — 返回 Chat 触发器概览
- [执行工作流](/zh-hans/guide/workflow/execute-workflow) — 在发布前测试工作流
- [Answer 节点](/zh-hans/guide/workflow/nodes/action-nodes/answer) — 控制 API 返回的内容
