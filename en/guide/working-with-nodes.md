---
title: Working with Nodes
description: Learn how to add, configure, and connect workflow nodes in {{PRODUCT_NAME}}
---

# Working with Nodes

Nodes are the fundamental building blocks of {{PRODUCT_NAME}} workflows. Each node represents a specific operation or functionality, and by connecting nodes, you define data flow and business logic.

## Node Types

{{PRODUCT_NAME}} provides three types of nodes:

### Trigger Nodes

Triggers are the entry points of workflows, defining when execution starts.

**Available Triggers**:
- **Chat Trigger** - Triggered by user conversations
- **Manual Trigger** - Manually triggered execution
- **Webhook Trigger** - Triggered by HTTP requests

**Characteristics**:
- Each workflow can only have one trigger
- Must be the first node in the workflow
- Defines the context data for the workflow

### Action Nodes

Action nodes execute specific operational tasks.

**Common Action Nodes**:
- **AI Agent** - Build intelligent AI agents
- **LLM** - Call large language models
- **HTTP Request** - Call external APIs
- **Code** - Execute custom code
- **Conditional Branch** - Execute different branches based on conditions
- **Answer** - Return response messages

**Characteristics**:
- Can have multiple Action nodes
- Execute sequentially or in parallel
- Can access data from previous nodes

### Tool Nodes

Tool nodes provide callable tool capabilities for AI Agents.

**Available Tool Nodes**:
- **Code Tool** - Provide code execution capability
- **HTTP Request Tool** - Provide API calling capability
- **Entity Recognition Tool** - Provide information extraction capability

**Characteristics**:
- Can only connect to AI Agent nodes
- Called autonomously by AI Agent
- Extend AI Agent's capability range

## Adding Nodes

{{PRODUCT_NAME}} provides three ways to add nodes to the canvas:

### Method 1: Add from Toolbar

This is the most common way to add nodes.

1. **Click Add Button**
   - Find the "+" button in the top-left corner of canvas
   - Or press `Tab` key to open node panel

2. **Browse Node List**
   - Use search box to quickly find nodes
   - Filter nodes by category tabs:
     - **All** - Show all nodes
     - **Trigger** - Show only trigger nodes
     - **Action** - Show only Action nodes
     - **Tool** - Show only Tool nodes
     - **Plugins** - Show installed plugin nodes

3. **Add Node**
   - **Drag Method**:
     - Drag node card to canvas
     - Release mouse to complete addition
   - **Click Method**:
     - Click node card
     - Node follows mouse movement
     - Click on canvas to place node

**Shortcut**: `Tab` - Open/close node panel

**Example Flow**:
```
1. Press Tab to open node panel
2. Type "HTTP" in search box
3. Find "HTTP Request" node
4. Drag to canvas center
5. Node is added to canvas
```

### Method 2: Add from Context Menu

Quickly add nodes through canvas context menu.

1. **Open Context Menu**
   - Right-click on blank canvas area
   - Select "Add Node" submenu

2. **Select Node**
   - Browse node category menu
   - Click node to add

3. **Node Auto-Created**
   - Node is created at mouse position
   - No dragging needed, directly completed

**Use Cases**:
- Quick node addition
- Create node at specific position
- Don't need to preview node information

**Shortcuts**:
- `Shift + T` - Tidy Up canvas
- `Cmd/Ctrl + A` - Select all nodes

### Method 3: Add from Node Handles

This is the most fluid way to add, creating both node and connection simultaneously.

#### Through Node Handles

Each node has connection points (handles) for connecting to other nodes:

**Right-Side Handle** (Output Port):
- Located on node's right side
- Used to connect to next node
- Displayed as circular button

**Bottom Handle** (Tool Output):
- Located at bottom of AI Agent node
- Used to connect Tool nodes
- Only shown on AI Agent nodes

#### Addition Steps

**Method 1: Drag Handle**

1. **Start Dragging**
   - Find node's output handle (circular button)
   - Click and drag handle
   - Connection line follows mouse

2. **Show Node Menu**
   - Drag to blank area
   - Release mouse
   - Node selection menu automatically pops up

3. **Select Node**
   - Browse available nodes in menu
   - Click node to add
   - Node and connection auto-created

**Method 2: Click Handle**

1. **Click Handle**
   - Directly click node's output handle
   - No dragging needed

2. **Node Menu Pops Up**
   - Menu displays next to handle
   - Shows list of connectable nodes

3. **Select and Add**
   - Click node to add
   - Node is created next to current node
   - Connection automatically established

**Smart Filtering**:
- **Right-Side Output Handle**: Shows Action nodes (excludes triggers and tools)
- **Bottom Output Handle**: Shows only Tool nodes
- Auto-filters based on node type, showing only connectable nodes

**Advantages**:
- One operation completes addition and connection
- Auto-calculates node position
- Keeps workflow tidy
- Improves build efficiency

## Node Configuration

After adding a node, you need to configure node parameters.

### Select Node

1. **Click Node**
   - Click node on canvas
   - Node border highlights
   - Configuration panel displays on right

2. **Configuration Panel**
   - Displays all node parameters
   - Each parameter has description
   - Supports expressions and fixed values

### Configure Parameters

**Basic Parameters**:
- **Required Parameters**: Marked with red asterisk
- **Optional Parameters**: Can be left empty
- **Default Values**: Some parameters have preset values

**Parameter Types**:
- **Text Input**: Enter string or number
- **Dropdown Select**: Choose from options
- **Code Editor**: Enter code or expressions
- **File Upload**: Upload files
- **Toggle**: Enable or disable feature

**Using Expressions**:
- Click expression icon on right of parameter
- Enter expression to reference other node data
- Use `$('NodeName').fieldName` syntax
- Supports string templates and function calls

**Examples**:
```javascript
// Reference trigger message
$('Chat Trigger').message

// Reference HTTP request response
$('HTTP Request').body.data

// Use string template
`User ${$('Chat Trigger').userId} order`

// Use methods
$('HTTP Request').body.items.length
```

### Node Settings

Click menu icon in top-right of node to access node settings:

**Common Settings**:
- **Rename Node**: Modify node display name
- **Add Notes**: Add description to node
- **Error Handling**: Configure behavior on failure
- **Retry Strategy**: Set retry count and interval
- **Timeout Setting**: Set node execution timeout

## Connecting Nodes

Nodes are connected by connection lines to define data flow.

### Create Connection

**Method 1: Drag Connection**

1. Drag from source node's output handle
2. Drag to target node's input handle
3. Release mouse to complete connection

**Method 2: Click Connection**

1. Click source node's output handle
2. Click target node's input handle
3. Connection auto-created

### Connection Rules

**Basic Rules**:
- Trigger nodes can only connect to Action nodes
- Action nodes can connect to other Action nodes
- Tool nodes can only connect to AI Agent nodes
- Cannot form circular connections

**Connection Limits**:
- Each input port usually accepts only one connection
- Output ports can connect to multiple nodes
- Some nodes support multiple inputs (e.g., Merge node)

### Manage Connections

**Delete Connection**:
- Select connection line
- Press `Delete` or `Backspace` key
- Or right-click and select "Delete"

**Reconnect**:
- Delete old connection
- Create new connection

## Node Operations

### Move Nodes

**Single Node**:
- Click and drag node
- Release mouse to place node

**Multiple Nodes**:
- Hold `Shift` and click to select multiple nodes
- Or drag selection box to select area
- Drag any selected node to move all nodes

### Copy Nodes

**Shortcuts**:
- `Cmd/Ctrl + C` - Copy
- `Cmd/Ctrl + V` - Paste
- `Cmd/Ctrl + D` - Duplicate

**Context Menu**:
- Right-click node
- Select "Copy"
- Select "Paste" at target location

### Delete Nodes

**Delete Single Node**:
- Select node
- Press `Delete` or `Backspace` key
- Or right-click and select "Delete"

**Delete Multiple Nodes**:
- Select multiple nodes
- Press `Delete` or `Backspace` key

**Smart Delete** (`Shift + Delete`):
- Deletes node and auto-reconnects surrounding nodes
- Maintains workflow continuity

### Tidy Canvas

**Auto Tidy**:
- Press `Shift + T` key
- Or select "Tidy" in context menu
- Nodes automatically arrange neatly

**Manual Adjust**:
- Drag nodes to ideal positions
- Use alignment guides
- Keep consistent node spacing

## Node Status

Nodes display different states during execution:

### Execution States

**Waiting** (Gray):
- Node not yet executed
- Waiting for preceding nodes to complete

**Executing** (Blue Animation):
- Node is executing
- Shows loading animation

**Success** (Green):
- Node execution completed
- Shows checkmark icon

**Failed** (Red):
- Node execution error
- Shows error icon
- Click to view error details

### View Data

In the node editor, you can view input and output data:

**Context** (Left Panel):
- Shows output data from all upstream nodes
- Available for expression references
- Support executing upstream nodes to view data

**Output** (Right Panel):
- Shows current node's output data
- Supports Schema and JSON view switching
- Can pin data for testing

**Execution Time**:
- Node shows execution duration
- Helps identify performance bottlenecks

## Node Creator Panel

### Search Nodes

In search box at top of node panel:

**Search by Name**:
```
Input: "HTTP"
Results: HTTP Request, HTTP Request Tool
```

**Search by Function**:
```
Input: "AI"
Results: AI Agent, AI Classifier
```

**Search by Description**:
```
Input: "call API"
Results: HTTP Request
```

### Filter Nodes

Use category tabs for quick filtering:

**Trigger**:
- Show only trigger nodes
- Used to start building workflow

**Action**:
- Show all Action nodes
- Most commonly used node type

**Tool**:
- Show Tool nodes
- Used to extend AI Agent capabilities

**Plugins**:
- Show installed plugin nodes
- Custom and third-party nodes

### Node Information

Each node card displays:

**Basic Info**:
- **Icon**: Node type identifier
- **Name**: Node name
- **Description**: Brief function description

**Category Colors**:
- **Blue**: Trigger nodes
- **Purple**: Action nodes
- **Green**: Tool nodes
- **Gray**: Plugin nodes

## Keyboard Shortcuts

### Node Operations

| Shortcut | Function |
|----------|----------|
| `Tab` | Open/close node panel |
| `Cmd/Ctrl + C` | Copy node |
| `Cmd/Ctrl + V` | Paste node |
| `Cmd/Ctrl + D` | Duplicate |
| `Delete` / `Backspace` | Delete node |
| `Shift + Delete` | Smart delete (reconnect) |

### Canvas Operations

| Shortcut | Function |
|----------|----------|
| `Cmd/Ctrl + A` | Select all nodes |
| `Shift + T` | Tidy canvas |
| `Cmd/Ctrl + Z` | Undo |
| `Cmd/Ctrl + Shift + Z` | Redo |
| `Space + Drag` | Pan canvas |
| `Cmd/Ctrl + Scroll` | Zoom canvas |

## Best Practices

### 1. Organize Nodes Properly

**Linear Flow**:
```
Chat Trigger → LLM → Answer
```

**Branching Flow**:
```
Chat Trigger → AI Classifier
              ↓
              ├→ [Support] → Answer
              ├→ [Sales] → Answer
              └→ [Technical] → Answer
```

**Complex Flow**:
```
Chat Trigger → Entity Recognition → HTTP Request → Code → Answer
```

### 2. Name Nodes

**Use Descriptive Names**:
```
✓ "Query User Info"
✓ "Calculate Order Total"
✓ "Send Email Notification"

✗ "HTTP Request"
✗ "Code 1"
✗ "Node"
```

### 3. Add Comments

Add comments for complex nodes:
- Explain node purpose
- Document important logic
- Mark important notes

### 4. Keep Tidy

**Regular Tidying**:
- Use `Shift + T` for auto-tidying
- Keep nodes aligned
- Avoid crossing connection lines

**Group Related Nodes**:
- Place related nodes together
- Use visual separation
- Easy to understand and maintain

### 5. Test Nodes

**Test Individually**:
- Test each node's configuration
- Verify input/output data
- Ensure logic is correct

**Progressive Building**:
- Build core flow first
- Add features gradually
- Test after each addition

## FAQ

### Q: Why can't I connect nodes after adding?

**A**: Check the following:
- Tool nodes can only connect to AI Agent's bottom port
- Trigger nodes cannot connect to another trigger
- Some ports may have reached connection limit
- Ensure connection direction is correct (output→input)

### Q: How to pass data between nodes?

**A**: Use expression syntax:
```javascript
// Reference data from previous nodes
$('NodeName').fieldName

// Examples
$('HTTP Request').body.userId
$('Chat Trigger').message
```

### Q: Node panel won't open?

**A**:
- Press `Tab` key to toggle panel state
- Click "+" button in top-left
- Refresh page and retry

### Q: How to delete node but keep connection?

**A**: Use smart delete:
- Select node to delete
- Press `Shift + Delete`
- Node deleted, surrounding nodes auto-reconnect

### Q: Lost node configuration?

**A**:
- Use `Cmd/Ctrl + Z` to undo operation
- Check version history to restore previous state
- System auto-saves, try refreshing page

### Q: How to copy entire workflow branch?

**A**:
1. Hold `Shift` to select multiple nodes
2. Press `Cmd/Ctrl + C` to copy
3. Press `Cmd/Ctrl + V` to paste
4. All nodes and connections will be copied

## Next Steps

- [Expressions](/en/guide/expressions) - Learn how to use expressions for data processing
- [Chat Trigger](/en/guide/workflow/nodes/trigger-nodes/chat) - Learn about trigger nodes
- [AI Agent](/en/guide/workflow/nodes/action-nodes/ai-agent) - Build intelligent agents
- [HTTP Request](/en/guide/workflow/nodes/action-nodes/http-request) - Call external APIs

## Related Resources

- [Node Type Documentation](/en/guide/workflow/nodes/trigger-nodes/chat) - View all available nodes
- [Keyboard Shortcuts](/en/guide/shortcuts) - Complete shortcut list
- [Expression Syntax](/en/guide/expressions) - Data processing reference
