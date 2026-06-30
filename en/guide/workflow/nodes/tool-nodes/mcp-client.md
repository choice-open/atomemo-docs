---
title: MCP Client Tool Node
description: Connect to MCP servers and expose their tools to AI Agents, enabling AI to call external tools via the Model Context Protocol
---

# MCP Client Tool Node

The MCP Client Tool node connects to an [MCP (Model Context Protocol)](https://modelcontextprotocol.io/) server and exposes its tools to AI Agents. Unlike built-in Tool nodes, MCP Client Tool dynamically imports remote tools at runtime — the AI Agent can call any tool registered on the connected MCP server, enabling integration with a vast ecosystem of external services and custom tooling.

> **Prerequisites**: You must have at least one MCP server configured in your workspace. If no servers are available, you'll be prompted to add one via the **MCP Server Management** page.

## Core Concepts

### What is MCP?

The Model Context Protocol is an open standard that enables AI applications to connect with external tools and data sources through a unified interface. An MCP server can expose anything from database queries to API integrations as callable "tools" that AI Agents can discover and invoke.

### How the MCP Client Tool Works

```
MCP Server (external)                    Your Workflow
┌─────────────────────┐                  ┌──────────────────────┐
│  Tools registered:  │   JSON-RPC       │  Chat Trigger        │
│  - get_weather      │ ←────────────── →│    → AI Agent Node   │
│  - search_docs      │                  │        Tools:        │
│  - create_ticket    │                  │          MCP Client  │
│  - query_database   │                  │            Tool      │
└─────────────────────┘                  │    → Answer Node     │
                                         └──────────────────────┘
```

1. The MCP Client Tool connects to the MCP server at runtime
2. Available tools are discovered and registered with the AI Agent
3. The AI Agent calls the appropriate MCP tool based on user needs
4. Results are returned to the AI Agent for synthesis

## Use Cases

### Typical Applications

- **External API Integration** — Connect to third-party services via their MCP servers (e.g., weather, maps, email)
- **Database Access** — Let AI Agents query databases through MCP database servers
- **Custom Internal Tools** — Expose company-specific tools and data sources
- **File System Operations** — Allow AI Agents to read and manage files via filesystem MCP servers
- **Cross-Platform Orchestration** — Bridge multiple services through different MCP servers in one workflow

## Node Configuration

### Setup Workflow

Configuring the MCP Client Tool involves four steps:

1. **Select an MCP server** — Pick from installed servers or add a new one
2. **Choose which tools to include** — All tools, specific tools, or all except specific ones
3. **Select tools** (if applicable) — Pick individual tools from the server's catalog
4. **Set timeout** — Configure how long to wait for MCP tool responses

### Basic Settings

#### MCP Server (mcpServerId)

Select the MCP server whose tools you want to expose to the AI Agent.

**Field Properties**:

- Required field
- Dropdown populated from installed MCP servers in your workspace
- If no servers are available, the dropdown is empty

**If no MCP servers are available**:

A **"Manage MCP Servers"** link button appears below the dropdown. Click it to open the MCP Server Management page where you can:

- Install community MCP servers from the catalog
- Create custom MCP servers with your own endpoints
- Configure authentication credentials for MCP servers

The page opens in a new tab, so you can configure servers without leaving your workflow.

**After selecting a server**: The available tools are fetched from the server. The **Include Tools** setting becomes active.

#### Include Tools (include)

Control which tools from the MCP server are exposed to the AI Agent.

**Available Options**:

| Option | EN Label | CN Label | Description |
| --- | --- | --- | --- |
| `all` | All Tools | 全部工具 | Expose all tools from the MCP server (default) |
| `selected` | Selected Tools | 选定工具 | Only expose specifically chosen tools |
| `except` | All Except Selected | 全部（排除选定） | Expose all tools except those excluded |

**Recommendations**:

```yaml
Simple servers (≤10 tools): Use "All Tools"
  → AI Agent has full access, simpler configuration

Many tools or sensitive ones: Use "Selected Tools" or "All Except Selected"
  → Fine-grained control over which tools are available
  → Prevents AI from accidentally calling inappropriate tools

Example:
  Server with 50+ tools → "Selected Tools" → pick 5-8 relevant ones
  Server with 10 tools but 2 are admin-only → "All Except Selected" → exclude admin tools
```

#### Tools (tools)

When **Include Tools** is set to `selected` or `except`, a tool picker appears:

- **Selected Tools mode**: Check the tools you want the AI Agent to be able to call (required — at least one must be selected)
- **All Except Selected mode**: Check the tools you want to **exclude** from the AI Agent

Tool names and descriptions from the MCP server are displayed to help you choose.

#### Timeout (timeout)

Maximum time in milliseconds to wait for a response from the MCP server when a tool is called.

**Field Properties**:

- Number type (positive integer)
- Default value: `60000` (60 seconds)
- Supports expressions

**Configuration Suggestions**:

```yaml
Fast tools (simple queries):     10000-30000  (10-30s)
Medium tools (API calls):        30000-60000  (30-60s, default)
Slow tools (complex processing): 60000-120000 (60-120s)
```

> **Note**: If the MCP server doesn't respond within the timeout, the tool call fails and the error is returned to the AI Agent.

### Advanced Settings

#### Node Description (nodeDescription)

Add a custom description for documentation purposes:

```yaml
nodeDescription: "Connects to the Weather MCP server. Provides get_weather and get_forecast tools."
```

## How It Works

### Runtime Flow

```
1. Workflow reaches MCP Client Tool node
     ↓
2. Node connects to MCP server via JSON-RPC
     ↓
3. MCP session initialized (handshake + protocol negotiation)
     ↓
4. Available tools fetched from server
     ↓
5. Tools filtered based on "Include Tools" setting
     ↓
6. Filtered tools registered with parent AI Agent
     ↓
7. AI Agent can now call these tools by name
     ↓
8. When called: request forwarded to MCP server → response returned to AI
```

### Tool Naming Convention

Tools from MCP servers are registered with a composite name:

```
{nodeId}--{toolName}
```

For example, if your MCP Client Tool node's ID is `abc123` and the server has a tool named `get_weather`, the AI Agent calls it as `abc123--get_weather`. This prevents naming conflicts between multiple MCP Client Tool nodes.

> You don't need to worry about this — the AI Agent handles tool naming automatically.

### Error Handling

If the MCP server is unreachable or a tool call fails:

- **Server not found** — Returns an error: "MCP server not found"
- **Request timeout** — Returns an error if the server doesn't respond within the configured timeout
- **Tool call error** — If the MCP tool itself returns an error, the error content is returned to the AI Agent
- **Invalid credential** — Returns an error if the server requires authentication with an unsupported credential type

The AI Agent typically handles these gracefully — it will try alternative approaches or inform the user of the limitation.

## Workflow Examples

### Example 1: Weather-Aware AI Agent

```
Chat Trigger
  → AI Agent Node
    System Prompt: "You are a helpful assistant with access to weather data."
    User Prompt: $('Chat Trigger').message

    Tools:
      └─ MCP Client Tool (Weather Server)
           mcpServerId: "weather-mcp-server"
           include: "all"
           timeout: 30000

  → Answer Node

User: "What's the weather like in Tokyo?"
AI Agent:
  1. Calls MCP tool: abc123--get_weather({ city: "Tokyo" })
  2. MCP server returns: { temperature: 22, condition: "sunny", humidity: 55 }
  3. AI: "Tokyo is sunny and 22°C with 55% humidity today."
```

### Example 2: Multi-Tool MCP with Selective Access

```
Chat Trigger
  → AI Agent Node
    System Prompt: "You are a customer support agent. Use available tools to help customers."
    User Prompt: $('Chat Trigger').message

    Tools:
      └─ MCP Client Tool (Internal Tools Server)
           mcpServerId: "internal-tools-mcp"
           include: "selected"
           tools: ["query_customer", "lookup_order", "check_inventory"]
           timeout: 60000

      Note: The server has 20 tools, but only 3 are selected.
            Tools like "delete_order" and "modify_pricing" are not exposed.

  → Answer Node

User: "What's the status of my order #12345?"
AI Agent:
  1. Calls MCP tool: lookup_order({ orderId: "12345" })
  2. Returns order status
  3. AI: "Your order #12345 is shipped and arriving tomorrow."
```

### Example 3: Multiple MCP Servers

```
Chat Trigger
  → AI Agent Node
    System Prompt: "You have access to multiple service platforms. Use the right tool for each task."
    User Prompt: $('Chat Trigger').message

    Tools:
      ├─ MCP Client Tool (CRM Server)
      │    mcpServerId: "salesforce-mcp"
      │    include: "selected"
      │    tools: ["search_contacts", "get_opportunity"]
      │    timeout: 60000
      │
      ├─ MCP Client Tool (Email Server)
      │    mcpServerId: "gmail-mcp"
      │    include: "all"
      │    timeout: 30000
      │
      └─ MCP Client Tool (Filesystem Server)
           mcpServerId: "filesystem-mcp"
           include: "all"
           timeout: 15000

  → Answer Node

User: "Find John Doe in CRM, draft an email for him, and save it as a draft"
AI Agent:
  1. Calls CRM tool: search_contacts({ name: "John Doe" }) → Finds contact
  2. Calls Email tool: create_draft({ to: "john@example.com", ... }) → Draft created
  3. AI: "I found John Doe (john@example.com) and saved an email draft."
```

### Example 4: Secure Data Access with Filtering

```
Chat Trigger
  → AI Agent Node
    System Prompt: "You are a data analyst. Query the database but never modify or delete data."
    User Prompt: $('Chat Trigger').message

    Tools:
      └─ MCP Client Tool (Database Server)
           mcpServerId: "postgres-mcp"
           include: "except"
           tools: ["delete_records", "drop_table", "truncate_table", "alter_schema"]
           timeout: 60000

      Note: Using "All Except Selected" to exclude dangerous admin tools.
            The AI can query and read data, but cannot modify or delete.

  → Answer Node

User: "Show me the top 10 customers by revenue this quarter"
AI Agent:
  1. Calls MCP tool: run_query({ sql: "SELECT ... FROM customers ... ORDER BY revenue DESC LIMIT 10" })
  2. Returns formatted results
```

## Best Practices

### 1. Use Selected Mode for Production

In production workflows, avoid `all` mode. Explicitly select which tools the AI Agent can access:

```javascript
// Good: Explicit selection
include: "selected"
tools: ["get_weather", "get_forecast", "get_alerts"]

// Risky: Full access in production
include: "all"
// AI might accidentally call admin or destructive tools
```

### 2. Set Appropriate Timeouts

Match the timeout to your MCP server's typical response time:

```javascript
// Local/lightweight servers
timeout: 15000  // 15 seconds

// External API servers
timeout: 30000  // 30 seconds

// Complex processing servers
timeout: 60000  // 60 seconds (default)

// Long-running operations
timeout: 120000  // 2 minutes
```

### 3. Pre-install MCP Servers Before Building Workflows

Configure your MCP servers in the MCP Server Management page **before** building your workflow:

1. Go to **MCP Servers** in the workspace settings
2. Add the servers you need (from catalog or custom)
3. Test the connection
4. Then use them in MCP Client Tool nodes

### 4. Use Multiple MCP Client Tool Nodes for Different Purposes

If your AI Agent needs tools from multiple MCP servers, use separate MCP Client Tool nodes — one per server. This gives you:

- Independent tool selection per server
- Different timeouts per server
- Clearer configuration and debugging

### 5. Test MCP Tools Before Production

Test each MCP tool individually before exposing it to the AI Agent:

1. Register the tool with an AI Agent in a test workflow
2. Ask the AI to call the tool with test inputs
3. Verify the response format and timing
4. Adjust tool selection and timeout as needed

### 6. Monitor MCP Tool Usage

Use workflow execution logs to track MCP tool calls:

- Which tools are being called most frequently?
- Are any tools consistently timing out?
- Are there tools the AI never uses (candidates for removal)?
- What errors are occurring?

## FAQ

### Q1: What's the difference between MCP Client Tool and HTTP Request Tool?

**A**:

| Aspect | HTTP Request Tool | MCP Client Tool |
| --- | --- | --- |
| Protocol | Direct HTTP REST calls | JSON-RPC via MCP protocol |
| Tool Discovery | Manual configuration | Automatic from MCP server |
| Multi-tool | One tool = one endpoint | One node = many tools |
| Standardization | Custom per API | Standard MCP tool schema |
| Best For | Simple API calls | Complex tool servers with many endpoints |

### Q2: How do I add an MCP server?

**A**: Click the **"Manage MCP Servers"** button in the MCP Client Tool node, or navigate to the MCP Servers page from workspace settings. From there you can:

- **Browse catalog** — Install community MCP servers (e.g., filesystem, GitHub, Slack)
- **Create custom** — Add your own MCP server by providing a URL and optional credentials
- **Configure credentials** — Set up authentication for servers that require it

### Q3: Can I connect to multiple MCP servers in one workflow?

**A**: Yes. Add one MCP Client Tool node per server. Each node connects to one MCP server and exposes its tools. The AI Agent can call tools from any connected server.

### Q4: What happens if the MCP server is unreachable?

**A**: If the MCP server cannot be reached at runtime, the tool call fails with an error message. The AI Agent typically handles this gracefully — it will try alternative approaches or tell the user the service is temporarily unavailable. Check your **On Error** settings on the parent AI Agent node.

### Q5: Does the AI Agent know which tools are available?

**A**: Yes. When the MCP Client Tool registers with the AI Agent, all tools (filtered by your `include`/`tools` settings) are added to the AI's available tool list with their names and descriptions. The AI uses this information to decide which tool to call for each user request.

### Q6: Can I use expressions in the timeout field?

**A**: Yes. The timeout field supports expressions, allowing dynamic timeout values:

```javascript
// Dynamic timeout based on workflow context
$('Config').mcpTimeout || 60000

// Conditional timeout
$('Chat Trigger').isPriority ? 15000 : 60000
```

## Next Steps

- [AI Agent Node](/en/guide/workflow/nodes/action-nodes/ai-agent) — Learn about the main AI Agent node
- [HTTP Request Tool Node](/en/guide/workflow/nodes/tool-nodes/http-request) — Add direct API calling capability
- [Code Tool Node](/en/guide/workflow/nodes/tool-nodes/code) — Add custom code tools

## Related Resources

- [MCP Server Management](/en/plugins/marketplace) — Install and configure MCP servers
- [Think Tool Node](/en/guide/workflow/nodes/tool-nodes/think) — Add structured reasoning for AI Agents
- [Sub-workflow Tool Node](/en/guide/workflow/nodes/tool-nodes/subflow) — Register sub-workflows as tools
