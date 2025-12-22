---
title: Editing Nodes
description: Learn how to configure and edit workflow nodes in {{PRODUCT_NAME}}
---

# Editing Nodes

The node editor is the primary interface for configuring node parameters, settings, and behavior. Through the node editor, you can precisely control each node's functionality and data processing methods.

## Opening the Node Editor

### Method 1: Double-click Node

The most common method:

1. Find the node you want to edit on the canvas
2. Double-click the node
3. Node editor opens automatically

### Method 2: Select Node

1. Single-click to select the node
2. Node editor opens on the right or bottom
3. Displays node configuration options

## Editor Layout

The node editor consists of three main panels:

### Left Panel: Context

Displays data available for the current node:

**Main Functions**:
- Shows output data from all upstream nodes
- Provides data preview and browsing
- Supports dragging data to expression fields
- Includes system variables `$sys`

**Execute Upstream Nodes**:
- If no data available, click "Execute Upstream Nodes" button
- Runs all upstream nodes to fetch data
- View real-time execution results

**Use Cases**:
- Check available data structure when writing expressions
- Test node input data
- Debug data flow issues

### Center Panel: Configuration

The main configuration area for the node, containing two tabs:

#### Parameters Tab

Configure the node's core functionality parameters.

**Field Types**:
- **Text Input**: Enter strings or numbers
- **Dropdown Select**: Choose from predefined options
- **Toggle Switch**: Enable or disable features
- **Code Editor**: Write code or expressions
- **File Upload**: Upload files or select resources

**Field Modes**:
- **Fixed Value Mode**: Enter static values
- **Expression Mode**: Click icon on the right of field to switch to expression mode
- **Mixed Mode**: Some fields support string templates

**Using Expressions**:

```javascript
// Reference upstream node data
$('Chat Trigger').message

// Reference HTTP request response
$('HTTP Request').body.userId

// Use string templates
`User ${$('Chat Trigger').userId} order`

// Use system variables
$sys.app_id
```

**Expression Expand Editor**:
- Click expand icon on the right of expression field
- Write complex expressions in full-screen editor
- Enjoy complete code editing experience
- Click back button to save and close

**Grouped Fields**:
- Related parameters are organized in collapsible panels
- Click panel title to expand or collapse
- Required fields marked with red asterisk
- Hover to view field descriptions

#### Settings Tab

Configure node general settings.

**Node Description**:
- Add node functionality description
- Record important information and notes
- Help team members understand node purpose

**Other Settings**:
- Some nodes have special setting options
- Different configurations displayed based on node type

### Right Panel: Output

Displays node execution results and output data.

**View Switching**:
- **Schema View**: Tree structure display of data
- **JSON View**: Raw JSON format

**Pin Data**:
- Click "Edit Output" button to pin test data
- When pinned, node won't actually execute
- Use pinned data for testing downstream nodes
- Click "Unpin Data" to restore normal execution

**Use Cases**:
- Verify node output meets expectations
- Debug data transformation issues
- Provide mock data for downstream nodes

## Editor Position

The node editor supports two display positions:

### Bottom Position

**Characteristics**:
- Editor located at bottom of canvas
- Three panels arranged horizontally
- Wider view for data inspection
- Suitable for data-intensive nodes

**Switch Method**:
1. Click menu button (⋯) in top-right corner of editor
2. Select "Position" → "Bottom"
3. Editor moves to bottom

### Right Position

**Characteristics**:
- Editor located on right side of canvas
- Only shows configuration panel (center panel)
- Context and output require clicking "Context and Output" button to display at bottom
- Preserves more canvas space
- Suitable for daily editing work

**Switch Method**:
1. Click menu button (⋯) in top-right corner of editor
2. Select "Position" → "Sidebar"
3. Editor moves to right side

**View Context and Output**:
1. Click "Context and Output" button in configuration panel
2. Bottom panel pops up showing context and output data
3. Click button again to hide bottom panel

**Tip**: The system remembers your preferred position and uses it automatically next time.

## Node Name

### Editing Node Name

Node name is displayed at the top of the editor:

1. Click the node name
2. Enter new name
3. Press Enter to save
4. Or click outside area to save

**Naming Rules**:
- Name must be unique (within same workflow)
- Supports Chinese, English, numbers
- Recommended to use descriptive names
- Tool node names automatically check for duplicates

**Best Practices**:
```
Good naming:
✓ "Query User Info"
✓ "Calculate Order Total"
✓ "Send Email Notification"

Bad naming:
✗ "HTTP Request"
✗ "Code 1"
✗ "Node"
```

### Importance of Names

Node names are used for:
- Referencing node data in expressions: `$('Node Name').field`
- Identifying nodes on canvas
- Displaying in logs and error messages

## Configuring Node Parameters

### Required Parameters

Parameters marked with red asterisk (*) must be filled:

1. Find all required parameters
2. Fill in valid values
3. Can save after parameter validation passes

**Common Validation Rules**:
- Cannot be empty
- Correct format (e.g., URL, email)
- Valid number range
- Correct file type

### Optional Parameters

Parameters without asterisk can be left empty:

- Use default values
- Configure as needed
- Optimize node behavior

### Parameter Hints

Each parameter has descriptive text:

1. Hover over parameter label
2. View detailed description
3. Understand parameter purpose and format
4. Check example values

### Using Expressions

Most parameters support expression mode:

**Switch to Expression Mode**:
1. Find parameter input field
2. Click expression icon on the right
3. Enter or edit expression
4. Switch back to fixed value mode

**Expression Editor Features**:
- Syntax highlighting
- Auto-completion
- Real-time error checking
- Function documentation hints

**Data Dragging**:
1. Select data from left context panel
2. Drag to expression field
3. Automatically generates expression path

### Default Values

Some parameters have preset default values:

- Displayed in input field
- Can be used directly
- Can be modified to other values
- Clears and restores default value

## Testing Nodes

### Test Current Node

Test node during editing:

**For Tool Nodes**:
1. Click "Test Tool" button
2. Fill in required parameters (if any)
3. View test results
4. Verify functionality is correct

**For Action Nodes**:
1. Ensure upstream nodes have executed
2. Use "Test" function at top of canvas
3. View node execution results
4. Check output in right panel

### View Execution Results

View node output after execution:

1. Right panel displays output data
2. Switch between Schema or JSON view
3. Expand data structure to view details
4. Copy data for use elsewhere

### Using Pinned Data

Set test data for node:

1. Click "Edit Output" in right panel
2. Enter or paste JSON data
3. Click "Pin Data" button
4. Node uses pinned data instead of actual execution

**Use Cases**:
- Test downstream nodes without executing upstream
- Simulate API responses
- Debug specific data scenarios
- Save time during development

**Unpin**:
1. Click "Unpin Data" button
2. Node resumes normal execution
3. Pinned data is cleared

## Special Node Features

### Tool Node Testing

Tool nodes have dedicated testing functionality:

**Test Steps**:
1. Configure Tool node parameters
2. Click "Test Tool" button
3. Fill in test values for required parameters if needed
4. View test execution results
5. Debug and optimize configuration

**Test Dialog**:
- Displays all required parameters
- Provides input fields for test values
- Executes actual tool calls
- Shows detailed execution logs

### Plugin Nodes

Nodes from plugins:

**Identifying Plugin Nodes**:
- Parameters tab shows "View on GitHub" link
- Click link to visit plugin repository
- View plugin documentation and source code

**Plugin Node Configuration**:
- Follows parameter structure defined by plugin
- Check plugin documentation for detailed usage
- Parameter validation defined by plugin

## Editor Shortcuts

### Context and Output Panel

In right position mode:

**Show/Hide Panel**:
1. Click "Context and Output" button
2. Context and output panel pops up at bottom
3. Click again to hide panel

**Panel Content**:
- Left side shows context data
- Right side shows output data
- Syncs with content in editor panels

### Expression Expand Editor

For complex expressions:

1. Click expand icon in expression field
2. Enter full-screen expression editor
3. Use complete editing features
4. Click "Back" to save and close

**Full-screen Editor Advantages**:
- Larger editing space
- Full code editor functionality
- Focus on writing complex logic
- View context data simultaneously

### Closing Editor

**Method 1: Click Outside**
- Click canvas area outside editor
- Editor closes automatically
- Changes save automatically

**Method 2: Press Esc Key**
- Press Esc to close editor
- Quick exit from edit mode

**Method 3: Select Another Node**
- Click another node on canvas
- Automatically switches to new node's editor

## FAQ

### Q: When do parameter changes save?

**A**: Parameter changes save automatically, no manual save operation needed.

### Q: How to view available expression functions?

**A**:
- Auto-completion hints appear when typing in expression editor
- Check expression documentation for all available methods
- Hover over functions to view descriptions

### Q: Why is the context panel empty?

**A**: Possible reasons:
- Upstream nodes haven't executed yet
- Upstream nodes execution failed
- No upstream nodes connected

Solution: Click "Execute Upstream Nodes" button to run upstream nodes.

### Q: What's the difference between pinned data and execution data?

**A**:
- **Execution Data**: Output produced by actual node execution
- **Pinned Data**: Manually set test data, node won't actually execute

Pinned data takes priority over execution data, used for testing scenarios.

### Q: How to copy node configuration to another node?

**A**:
1. Copy node on canvas (Cmd/Ctrl + C)
2. Paste node (Cmd/Ctrl + V)
3. New node inherits all configuration
4. Modify node name and specific parameters

### Q: Will editor position setting be saved?

**A**: Yes, the system remembers your chosen editor position and automatically uses the same position next time.

### Q: What if Tool node test fails?

**A**: Check the following:
1. Are all required parameters filled?
2. Are parameter value formats correct?
3. Is tool configuration valid?
4. Check error messages for debugging

### Q: How to detect expression syntax errors?

**A**:
- Expression editor shows red wavy lines
- Hover to view error details
- Check if syntax and references are correct
- Ensure referenced node names exist

## Best Practices

### 1. Progressive Configuration

**Start Simple**:
1. Configure required parameters first
2. Test basic functionality
3. Gradually add optional parameters
4. Optimize and adjust configuration

### 2. Fully Utilize Context Panel

**Improve Efficiency**:
- Check data structure before writing expressions
- Drag data to fields to auto-generate expressions
- Execute upstream nodes to get real data
- Avoid writing expressions blindly

### 3. Use Pinned Data to Accelerate Development

**Testing Tips**:
- Pin test data for key nodes
- Avoid repeatedly executing time-consuming upstream nodes
- Quickly iterate and debug downstream nodes
- Remember to unpin after completion

### 4. Add Node Descriptions

**Document Workflows**:
- Add descriptions for complex nodes
- Record important configuration decisions
- Explain data processing logic
- Help team members understand

### 5. Name Nodes Appropriately

**Clear Naming**:
```
Scenario-oriented:
✓ "Query User Points"
✓ "Validate Order Status"
✓ "Generate PDF Report"

Function-oriented:
✓ "User Data Transform"
✓ "Error Notification"
✓ "Data Formatting"
```

### 6. Validate Expressions

**Avoid Errors**:
- Test execution after writing expressions
- Check if data types match
- Handle possible null value cases
- Use optional chaining operator `?.`

### 7. Use Appropriate Editor Position

**Choose Based on Scenario**:
- Data-intensive nodes → Bottom position (wider view)
- Simple configuration nodes → Right position (save space)
- Need to view canvas simultaneously → Right position

## Related Resources

- [Working with Nodes](/en/guide/working-with-nodes) - Learn node basic operations
- [Expressions](/en/guide/expressions) - Learn expression syntax and functions
- [Chat Trigger](/en/guide/workflow/nodes/trigger-nodes/chat) - View node documentation
