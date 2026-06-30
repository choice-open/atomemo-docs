---
title: MCP 客户端工具节点
description: 连接 MCP 服务器并将其工具暴露给 AI Agent，让 AI 能够通过模型上下文协议调用外部工具
---

# MCP 客户端工具节点

MCP 客户端工具节点连接到 [MCP（模型上下文协议）](https://modelcontextprotocol.io/) 服务器，并将其工具暴露给 AI Agent。与内置 Tool 节点不同，MCP 客户端工具在运行时动态导入远程工具——AI Agent 可以调用所连接 MCP 服务器上注册的任何工具，实现与庞大的外部服务和自定义工具生态系统的集成。

> **前置条件**：你的工作区中必须至少配置了一个 MCP 服务器。如果没有可用的服务器，系统会提示你通过 **MCP 服务器管理** 页面添加。

## 核心概念

### 什么是 MCP？

模型上下文协议（Model Context Protocol）是一个开放标准，使 AI 应用能够通过统一接口连接外部工具和数据源。MCP 服务器可以将从数据库查询到 API 集成的任何功能暴露为 AI Agent 可以发现和调用的"工具"。

### MCP 客户端工具的工作原理

```
MCP 服务器（外部）                      你的工作流
┌─────────────────────┐               ┌──────────────────────┐
│  注册的工具：        │   JSON-RPC    │  Chat 触发器          │
│  - get_weather      │ ←─────────── →│    → AI Agent 节点    │
│  - search_docs      │               │        Tools:         │
│  - create_ticket    │               │          MCP 客户端工具 │
│  - query_database   │               │    → Answer 节点       │
└─────────────────────┘               └──────────────────────┘
```

1. MCP 客户端工具在运行时连接到 MCP 服务器
2. 发现可用工具并注册给 AI Agent
3. AI Agent 根据用户需求调用合适的 MCP 工具
4. 结果返回给 AI Agent 进行综合

## 使用场景

### 典型应用

- **外部 API 集成** — 通过 MCP 服务器连接第三方服务（如天气、地图、邮件）
- **数据库访问** — 让 AI Agent 通过 MCP 数据库服务器查询数据
- **自定义内部工具** — 暴露公司特有的工具和数据源
- **文件系统操作** — 允许 AI Agent 通过文件系统 MCP 服务器读写文件
- **跨平台编排** — 在一个工作流中通过不同的 MCP 服务器桥接多个服务

## 节点配置

### 配置流程

配置 MCP 客户端工具包含四个步骤：

1. **选择 MCP 服务器** — 从已安装的服务器中选择，或添加新的
2. **选择包含的工具范围** — 全部工具、指定工具、或排除指定工具
3. **选择工具**（如适用）— 从服务器工具目录中选择单个工具
4. **设置超时时间** — 配置等待 MCP 工具响应的时长

### 基础设置

#### MCP 服务器 (mcpServerId)

选择要将其工具暴露给 AI Agent 的 MCP 服务器。

**字段属性**：

- 必填字段
- 下拉列表由工作区中已安装的 MCP 服务器填充
- 如果没有可用服务器，下拉列表为空

**如果没有 MCP 服务器**：

下拉列表下方会出现 **"管理 MCP 服务器"** 链接按钮。点击它打开 MCP 服务器管理页面，你可以：

- 从目录安装社区 MCP 服务器
- 使用自己的端点创建自定义 MCP 服务器
- 为 MCP 服务器配置认证凭证

该页面在新标签页中打开，因此你可以在不离开工作流的情况下配置服务器。

**选择服务器后**：系统从服务器获取可用工具。**包含工具** 设置变为可用。

#### 包含工具 (include)

控制将 MCP 服务器中的哪些工具暴露给 AI Agent。

**可用选项**：

| 选项 | 中文标签 | 说明 |
| --- | --- | --- |
| `all` | 全部工具 | 暴露 MCP 服务器中的所有工具（默认） |
| `selected` | 选定工具 | 仅暴露特定选择的工具 |
| `except` | 全部（排除选定） | 暴露除排除项外的所有工具 |

**推荐策略**：

```yaml
简单服务器（≤10 个工具）: 使用"全部工具"
  → AI Agent 拥有完整访问权限，配置简单

工具众多或包含敏感工具: 使用"选定工具"或"全部（排除选定）"
  → 精细控制哪些工具可用
  → 防止 AI 意外调用不合适的工具

示例:
  50+ 工具的服务器 → "选定工具" → 选择 5-8 个相关工具
  10 个工具但 2 个是管理专用的 → "全部（排除选定）" → 排除管理工具
```

#### 工具 (tools)

当**包含工具**设置为 `selected` 或 `except` 时，出现工具选择器：

- **选定工具模式**：勾选你希望 AI Agent 能够调用的工具（必填——至少选择一个）
- **全部（排除选定）模式**：勾选你希望从 AI Agent 中**排除**的工具

显示来自 MCP 服务器的工具名称和描述，帮助你做出选择。

#### 超时时间 (timeout)

等待 MCP 服务器响应工具调用的最长时间（毫秒）。

**字段属性**：

- 数字类型（正整数）
- 默认值：`60000`（60 秒）
- 支持表达式

**配置建议**：

```yaml
快速工具（简单查询）:     10000-30000  （10-30 秒）
中等工具（API 调用）:     30000-60000  （30-60 秒，默认值）
慢速工具（复杂处理）:     60000-120000 （60-120 秒）
```

> **注意**：如果 MCP 服务器在超时时间内未响应，工具调用失败，错误将返回给 AI Agent。

### 高级设置

#### 节点描述 (nodeDescription)

为节点添加自定义描述，用于文档记录：

```yaml
nodeDescription: "连接天气 MCP 服务器。提供 get_weather 和 get_forecast 工具。"
```

## 工作原理

### 运行时流程

```
1. 工作流到达 MCP 客户端工具节点
     ↓
2. 节点通过 JSON-RPC 连接 MCP 服务器
     ↓
3. MCP 会话初始化（握手 + 协议协商）
     ↓
4. 从服务器获取可用工具
     ↓
5. 根据"包含工具"设置过滤工具
     ↓
6. 过滤后的工具注册给父级 AI Agent
     ↓
7. AI Agent 现在可以通过名称调用这些工具
     ↓
8. 调用时：请求转发到 MCP 服务器 → 响应返回给 AI
```

### 工具命名约定

来自 MCP 服务器的工具使用组合名称注册：

```
{nodeId}--{toolName}
```

例如，如果你的 MCP 客户端工具节点 ID 为 `abc123`，服务器有一个名为 `get_weather` 的工具，AI Agent 调用时为 `abc123--get_weather`。这防止了多个 MCP 客户端工具节点之间的命名冲突。

> 你不需要担心这个——AI Agent 会自动处理工具命名。

### 错误处理

如果 MCP 服务器不可达或工具调用失败：

- **服务器未找到** — 返回错误："MCP server not found"
- **请求超时** — 如果服务器在配置的超时时间内未响应，返回错误
- **工具调用错误** — 如果 MCP 工具本身返回错误，错误内容将返回给 AI Agent
- **无效凭证** — 如果服务器需要认证但使用了不支持的凭证类型，返回错误

AI Agent 通常会优雅地处理这些情况——尝试替代方法或告知用户限制。

## 工作流示例

### 示例 1：天气感知 AI Agent

```
Chat 触发器
  → AI Agent 节点
    System Prompt: "你是一个可以访问天气数据的有用助手。"
    User Prompt: $('Chat 触发器').message

    Tools:
      └─ MCP 客户端工具（天气服务器）
           mcpServerId: "weather-mcp-server"
           include: "all"
           timeout: 30000

  → Answer 节点

用户: "东京今天天气怎么样？"
AI Agent:
  1. 调用 MCP 工具: abc123--get_weather({ city: "Tokyo" })
  2. MCP 服务器返回: { temperature: 22, condition: "晴天", humidity: 55 }
  3. AI: "东京今天晴天，22°C，湿度 55%。"
```

### 示例 2：选择性访问的多工具 MCP

```
Chat 触发器
  → AI Agent 节点
    System Prompt: "你是客户支持 Agent。使用可用工具帮助客户。"
    User Prompt: $('Chat 触发器').message

    Tools:
      └─ MCP 客户端工具（内部工具服务器）
           mcpServerId: "internal-tools-mcp"
           include: "selected"
           tools: ["query_customer", "lookup_order", "check_inventory"]
           timeout: 60000

      注意: 服务器有 20 个工具，但只选择了 3 个。
            像 "delete_order" 和 "modify_pricing" 等工具不会被暴露。

  → Answer 节点

用户: "我的订单 #12345 状态如何？"
AI Agent:
  1. 调用 MCP 工具: lookup_order({ orderId: "12345" })
  2. 返回订单状态
  3. AI: "您的订单 #12345 已发货，预计明天送达。"
```

### 示例 3：多个 MCP 服务器

```
Chat 触发器
  → AI Agent 节点
    System Prompt: "你可以访问多个服务平台。为每个任务使用正确的工具。"
    User Prompt: $('Chat 触发器').message

    Tools:
      ├─ MCP 客户端工具（CRM 服务器）
      │    mcpServerId: "salesforce-mcp"
      │    include: "selected"
      │    tools: ["search_contacts", "get_opportunity"]
      │    timeout: 60000
      │
      ├─ MCP 客户端工具（邮件服务器）
      │    mcpServerId: "gmail-mcp"
      │    include: "all"
      │    timeout: 30000
      │
      └─ MCP 客户端工具（文件系统服务器）
           mcpServerId: "filesystem-mcp"
           include: "all"
           timeout: 15000

  → Answer 节点

用户: "在 CRM 中找到 John Doe，为他起草一封邮件并保存为草稿"
AI Agent:
  1. 调用 CRM 工具: search_contacts({ name: "John Doe" }) → 找到联系人
  2. 调用邮件工具: create_draft({ to: "john@example.com", ... }) → 草稿已创建
  3. AI: "已找到 John Doe（john@example.com）并保存了邮件草稿。"
```

### 示例 4：带过滤的安全数据访问

```
Chat 触发器
  → AI Agent 节点
    System Prompt: "你是数据分析师。可以查询数据库但绝不能修改或删除数据。"
    User Prompt: $('Chat 触发器').message

    Tools:
      └─ MCP 客户端工具（数据库服务器）
           mcpServerId: "postgres-mcp"
           include: "except"
           tools: ["delete_records", "drop_table", "truncate_table", "alter_schema"]
           timeout: 60000

      注意: 使用"全部（排除选定）"排除危险的管理工具。
            AI 可以查询和读取数据，但不能修改或删除。

  → Answer 节点

用户: "显示本季度收入前 10 名客户"
AI Agent:
  1. 调用 MCP 工具: run_query({ sql: "SELECT ... FROM customers ... ORDER BY revenue DESC LIMIT 10" })
  2. 返回格式化结果
```

## 最佳实践

### 1. 生产环境使用选定模式

在生产工作流中，避免使用 `all` 模式。明确选择 AI Agent 可以访问的工具：

```javascript
// 好的做法：明确选择
include: "selected"
tools: ["get_weather", "get_forecast", "get_alerts"]

// 有风险：生产环境中的完全访问
include: "all"
// AI 可能意外调用管理或破坏性工具
```

### 2. 设置合适的超时时间

让超时时间与 MCP 服务器的典型响应时间匹配：

```javascript
// 本地/轻量服务器
timeout: 15000  // 15 秒

// 外部 API 服务器
timeout: 30000  // 30 秒

// 复杂处理服务器
timeout: 60000  // 60 秒（默认）

// 长时间运行的操作
timeout: 120000  // 2 分钟
```

### 3. 在构建工作流前预先安装 MCP 服务器

在构建工作流**之前**在 MCP 服务器管理页面配置你的 MCP 服务器：

1. 前往工作区设置中的 **MCP 服务器**
2. 添加你需要的服务器（从目录或自定义）
3. 测试连接
4. 然后在 MCP 客户端工具节点中使用

### 4. 为不同目的使用多个 MCP 客户端工具节点

如果你的 AI Agent 需要来自多个 MCP 服务器的工具，使用单独的 MCP 客户端工具节点——每个服务器一个。这样做可以：

- 每个服务器独立的工具选择
- 每个服务器不同的超时时间
- 更清晰的配置和调试

### 5. 在生产前测试 MCP 工具

在将每个 MCP 工具暴露给 AI Agent 之前单独测试：

1. 在测试工作流中将工具注册给 AI Agent
2. 要求 AI 使用测试输入调用该工具
3. 验证响应格式和时机
4. 根据需要调整工具选择和超时时间

### 6. 监控 MCP 工具使用情况

使用工作流执行日志跟踪 MCP 工具调用：

- 哪些工具被调用最频繁？
- 是否有工具持续超时？
- 是否有 AI 从不使用的工具（可以考虑移除）？
- 发生了哪些错误？

## 常见问题

### Q1: MCP 客户端工具和 HTTP 请求工具有什么区别？

**A**：

| 方面 | HTTP 请求工具 | MCP 客户端工具 |
| --- | --- | --- |
| 协议 | 直接 HTTP REST 调用 | 通过 MCP 协议的 JSON-RPC |
| 工具发现 | 手动配置 | 从 MCP 服务器自动获取 |
| 多工具 | 一个工具 = 一个端点 | 一个节点 = 多个工具 |
| 标准化 | 每个 API 自定义 | 标准 MCP 工具 Schema |
| 最适合 | 简单 API 调用 | 具有多个端点的复杂工具服务器 |

### Q2: 如何添加 MCP 服务器？

**A**：点击 MCP 客户端工具节点中的 **"管理 MCP 服务器"** 按钮，或从工作区设置导航到 MCP 服务器页面。你可以：

- **浏览目录** — 安装社区 MCP 服务器（如文件系统、GitHub、Slack）
- **创建自定义** — 通过提供 URL 和可选凭证添加你自己的 MCP 服务器
- **配置凭证** — 为需要认证的服务器设置身份验证

### Q3: 可以在一个工作流中连接多个 MCP 服务器吗？

**A**：可以。每个 MCP 客户端工具节点连接一个 MCP 服务器并暴露其工具。AI Agent 可以调用任何已连接服务器的工具。

### Q4: 如果 MCP 服务器不可达会怎样？

**A**：如果 MCP 服务器在运行时无法访问，工具调用将失败并返回错误消息。AI Agent 通常会优雅地处理这种情况——尝试替代方法或告知用户服务暂时不可用。检查父级 AI Agent 节点的**错误处理**设置。

### Q5: AI Agent 知道有哪些工具可用吗？

**A**：是的。当 MCP 客户端工具注册到 AI Agent 时，所有工具（根据你的 `include`/`tools` 设置过滤）都会以其名称和描述添加到 AI 的可用工具列表中。AI 使用这些信息来决定为每个用户请求调用哪个工具。

### Q6: 可以在超时字段中使用表达式吗？

**A**：可以。超时字段支持表达式，允许动态超时值：

```javascript
// 基于工作流上下文的动态超时
$('Config').mcpTimeout || 60000

// 条件超时
$('Chat 触发器').isPriority ? 15000 : 60000
```

## 下一步

- [AI Agent 节点](/zh-hans/guide/workflow/nodes/action-nodes/ai-agent) — 了解主 AI Agent 节点
- [HTTP 请求工具节点](/zh-hans/guide/workflow/nodes/tool-nodes/http-request) — 添加直接 API 调用能力
- [代码工具节点](/zh-hans/guide/workflow/nodes/tool-nodes/code) — 添加自定义代码工具

## 相关资源

- [MCP 服务器管理](/zh-hans/plugins/marketplace) — 安装和配置 MCP 服务器
- [思考工具节点](/zh-hans/guide/workflow/nodes/tool-nodes/think) — 为 AI Agent 添加结构化推理能力
- [子工作流工具节点](/zh-hans/guide/workflow/nodes/tool-nodes/subflow) — 将子流程注册为工具
