---
title: Debug Workflow
description: Learn how to use the logs panel to debug and troubleshoot workflow issues
---

# Debug Workflow

The logs panel is the core tool for debugging workflows, providing detailed execution information, node status, data flow, and error diagnostics. Through the logs panel, you can quickly locate issues, analyze data flow, and optimize workflow performance.

## Opening Logs Panel

### Via Bottom Tab

Logs panel is located at the bottom of canvas:

**Opening Method**:
1. Find tab bar at bottom of canvas
2. Click "Logs" tab
3. Logs panel expands to display

**Panel Layout**:
- Left: List of executed nodes
- Right: Detailed information for selected node
- Can adjust panel height

### Auto Open

Logs panel automatically opens in certain situations:

**Auto Open Timing**:
- Automatically expands when executing workflow
- Opens automatically when node execution fails
- Facilitates real-time viewing of execution status

**Manual Close**:
- Click logs tab to collapse panel
- Or click close button at top of panel

## Logs Panel Layout

Logs panel is divided into multiple areas displaying different information.

### Conversation History Area

**Display Conditions**:
- Only displays when viewing Chat trigger execution history
- Shows complete conversation context

**Display Content**:
- Messages sent by user
- AI response content
- Message timestamps
- Conversation flow

**Use Cases**:
- View complete Chat workflow conversation
- Understand AI Agent response logic
- Debug conversation context issues

### Node List Area

Displays all nodes involved in current execution:

**Node Information**:
- **Node Name**: Identifying name of node
- **Node Type**: Trigger, Action, or Tool
- **Execution Status**: Success, failure, executing
- **Execution Time**: Node running duration (milliseconds)

**Status Indicators**:
- **Green Check**: Execution success
- **Red X**: Execution failure
- **Blue Animation**: Currently executing
- **Gray**: Not executed or skipped

**Interactive Operations**:
- Click node to view detailed information
- Selected node highlighted
- Right panel displays that node's data

### Node Details Area

Displays detailed execution information for selected node:

**Header Information**:
- Node name and type
- Execution status icon
- Execution duration

**Context (Input)**:
- Displays input data received by node
- From upstream node outputs
- System variables ($sys)

**Output**:
- Displays output data produced by node
- Shows result data on success
- Shows error information on failure

**View Switching**:
- Schema view: Tree structure
- JSON view: Raw JSON
- Can copy data for debugging

## Viewing Node Execution Information

### Selecting Nodes

Select node to view in node list:

**Selection Method**:
1. Find target node in node list
2. Click node item
3. Right details area updates display

**Quick Selection**:
- Arranged top to bottom in execution order
- Quickly locate failed nodes (red markers)
- View nodes with long execution times

### Viewing Input Data

Understanding data received by node:

**Input Sources**:
- Output data from upstream nodes
- Initial data from trigger
- System variables

**Viewing Method**:
1. After selecting node, input panel displays automatically
2. Expand data structure to view details
3. Schema view shows data types
4. JSON view shows raw data

**Use Cases**:
- Verify upstream node output is correct
- Check data format meets expectations
- Debug data transformation issues

### Viewing Output Data

Understanding results produced by node:

**Output Content**:
- Data processed by node
- HTTP request responses
- Code execution return values
- AI Agent replies

**Viewing Method**:
1. After selecting node, output panel displays automatically
2. Expand to view complete data structure
3. Switch view formats

**Use Cases**:
- Verify node output is correct
- Check data passes to downstream
- Debug data format issues

### Viewing Execution Time

Analyzing node performance:

**Time Information**:
- Displayed next to each node in node list
- Unit in milliseconds (ms)
- Includes complete node execution time

**Performance Optimization**:
- Identify nodes with excessive execution time
- Optimize slow node configurations
- Consider using cache or pin data

**Example**:
```
✓ Chat Trigger      15ms
✓ HTTP Request     1,234ms  ← Long duration
✓ Code             45ms
✓ Answer           23ms
```

## Viewing Execution History

View past execution records.

### Execution History List

**Access Method**:
- Currently execution history integrated in logs panel
- Current session execution retained in logs
- Test execution history cleared after page refresh

**History Information**:
- Execution timestamp
- Execution status (success/failure)
- Number of executed nodes
- Total execution time

### Viewing Historical Execution Details

**Viewing Method**:
1. Select historical execution in logs panel
2. View all nodes from that execution
3. View input/output for each node
4. Analyze execution flow

**Use Cases**:
- Compare results from different executions
- Find intermittent issues
- Analyze data trend changes

## Debugging Techniques

### 1. Start from Failed Node

Quickly locate issues:

**Debugging Steps**:
1. Find red failed node in node list
2. Click to view error information
3. Check if input data is correct
4. Read error message to understand issue
5. Modify configuration and retest

**Common Errors**:
- Required parameters not filled
- Data format mismatch
- API call failure
- Expression syntax error
- Permission or authentication issues

### 2. Validate Data Node by Node

Ensure data flow is correct:

**Validation Process**:
1. Start from trigger
2. Verify trigger output data
3. Check first Action node input
4. Verify each node's input/output
5. Confirm data passes as expected

**Check Points**:
- Data structure complete
- Field names correct
- Data types match
- Null value handling reasonable

### 3. Compare Expected vs Actual

Discover data differences:

**Comparison Method**:
1. Record expected data format
2. View actual output data
3. Compare to find differences
4. Analyze difference causes
5. Adjust node configuration

**Example**:
```
Expected output:
{
  "userId": "123",
  "amount": 100
}

Actual output:
{
  "userId": 123,        ← Type mismatch
  "total": 100          ← Different field name
}
```

### 4. Check Execution Order

Verify node execution sequence:

**Check Method**:
- Node list arranged in execution order
- Confirm execution order meets expectations
- Check if any nodes were skipped
- Verify conditional branch execution paths

**Common Issues**:
- Incorrect conditional branch selection
- Parallel node execution order uncertain
- Some nodes unexpectedly skipped

### 5. Analyze Execution Time

Optimize performance bottlenecks:

**Analysis Steps**:
1. View execution time for each node
2. Identify longest running nodes
3. Analyze if optimization possible
4. Consider using pin data to skip
5. Optimize HTTP request timeout settings

**Optimization Directions**:
- Reduce API call frequency
- Optimize code execution efficiency
- Use caching mechanism
- Execute independent nodes in parallel

### 6. Use Copy Data

Facilitate external debugging:

**Copy Operations**:
1. In input/output panel
2. Select data to copy
3. Right-click or use copy button
4. Paste to text editor or testing tool

**Use Cases**:
- Test expressions in external tools
- Save data samples for testing
- Share data format with team
- Compare data from different executions

## Logs Panel Settings

### Adjust Panel Size

Customize panel layout:

**Adjustment Method**:
- Drag top edge of panel to adjust height
- Drag middle divider to adjust left/right area width
- System remembers your layout preferences

**Recommended Settings**:
- Increase panel height for large data volumes
- Expand right area when viewing long data
- Shrink right side when only viewing node list

### Show/Hide Areas

Control displayed content:

**Input/Output Toggle**:
- Click toggle button in details area header
- Show or hide input panel
- Show or hide output panel
- Focus on needed data

**Use Cases**:
- Hide input when only need to view output
- Display both when comparing input/output
- Save space to view more data

## Common Debugging Scenarios

### Scenario 1: Node Execution Failed

**Problem**: A node shows red error

**Debugging Steps**:
1. Click failed node
2. View error information in output panel
3. Troubleshoot based on error type:
   - Parameter error: Check required parameters
   - Data error: Check input data format
   - Network error: Check API address and network
   - Permission error: Check authentication configuration
4. Modify configuration and retest

### Scenario 2: Data Transfer Error

**Problem**: Downstream node receives incorrect data

**Debugging Steps**:
1. View upstream node output data
2. Confirm data structure is correct
3. View downstream node input data
4. Compare to find differences
5. Check if expression references are correct
6. Verify data paths and field names

### Scenario 3: Excessive Execution Time

**Problem**: Workflow executes very slowly

**Debugging Steps**:
1. View execution time for each node
2. Find longest running nodes
3. Analyze reasons:
   - HTTP request timeout too long
   - Low code execution efficiency
   - Data processing volume too large
   - Slow API response
4. Optimize or use pin data

### Scenario 4: Conditional Branch Not Executing as Expected

**Problem**: IF node selected wrong branch

**Debugging Steps**:
1. View IF node input data
2. Check conditional expression
3. Verify expression result
4. Test expression logic externally
5. Modify conditional expression
6. Retest and verify

### Scenario 5: Data Format Mismatch

**Problem**: Node expected data format doesn't match actual

**Debugging Steps**:
1. View node input data
2. Check data type and structure
3. Compare with node required format
4. Add data transformation node
5. Or modify expression for formatting
6. Verify transformed data

## Best Practices

### 1. Pre-Execution Check

**Pre-Test Preparation**:
- Confirm all required parameters filled
- Verify expression syntax correct
- Check node connection relationships
- Prepare test data

### 2. Segmented Testing

**Progressive Debugging**:
- Don't test entire flow at once
- Use "Execute to Specific Node" for step-by-step testing
- Confirm each stage correct before continuing
- Easy to locate when problems occur

### 3. Save Debug Versions

**Version Management**:
- Periodically create versions during debugging
- Mark problem versions for easy rollback
- Record debugging findings and solutions
- Create "Tested" version after test passes

### 4. Record Problem Patterns

**Experience Accumulation**:
- Record common errors and solutions
- Organize data format requirements
- Document debugging techniques
- Share with team members

### 5. Use Pin Data

**Improve Efficiency**:
- Pin data for stable nodes
- Avoid repeated time-consuming operations
- Quickly iterate debugging downstream nodes
- Remember to unpin after completion

## FAQ

### Q: Logs panel not showing nodes?

**A**: Possible reasons:
1. Workflow hasn't executed yet → Click test to run
2. Execution failed at trigger stage → Check trigger configuration
3. Panel not opened → Click "Logs" tab at bottom

### Q: How to view previous execution records?

**A**: Execution history save policy:
- Current session execution retained in logs
- Test history cleared after page refresh
- Production environment execution history saved long-term
- Future versions will enhance history query functionality

### Q: How to view input/output data that's too long?

**A**: Methods for viewing large data:
1. Expand details panel to increase viewing space
2. Use JSON view to see raw data
3. Copy data to external editor for viewing
4. Use search function to quickly locate

### Q: How to debug expression errors?

**A**: Expression debugging methods:
1. View node input data in logs panel
2. Confirm referenced fields exist
3. Check if data types match
4. Test expression in external JavaScript environment
5. Use console.log for debugging complex logic

### Q: What does execution time include?

**A**: Execution time includes:
- Node internal processing time
- HTTP request network time
- Code execution time
- Data serialization and transmission time

Does not include:
- Time waiting for upstream nodes
- System scheduling time

### Q: Can log data be exported?

**A**: Export functionality:
- Currently can copy data manually to save
- Future versions will support export function
- Can export execution history
- Can export node data

### Q: Where is Chat trigger conversation history?

**A**: Conversation history location:
- When viewing execution history, left side shows conversation history area
- Displays complete conversation context
- Includes user messages and AI replies
- Helps understand Chat workflow execution process

### Q: How to view system variables?

**A**: System variable viewing:
- In node's input panel
- Expand `$sys` object
- View all available system variables
- Includes app_id, execution_id, etc.

## Related Resources

- [Execute Workflow](/en/guide/workflow/execute-workflow) - Learn how to test workflows
- [Version Control](/en/guide/workflow/version-control) - Manage debug versions
- [Editing Nodes](/en/guide/editing-nodes) - Modify node configurations
- [Expressions](/en/guide/expressions) - Learn expression debugging
