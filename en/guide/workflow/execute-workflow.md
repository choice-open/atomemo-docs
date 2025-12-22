---
title: Execute Workflow
description: Learn how to test and run workflows
---

# Execute Workflow

The execute workflow feature allows you to run workflows during development and testing phases, verify node configurations are correct, and check if data flow meets expectations. Through test execution, you can discover and resolve issues before deploying to production.

## Test Execution Methods

{{PRODUCT_NAME}} provides multiple test execution methods to adapt to different development and debugging needs.

### Execute Entire Workflow

Run the complete workflow from trigger to the last node:

**Execution Method**:
1. Find canvas top toolbar
2. Click "Test" button
3. If multiple triggers exist, select which trigger to use
4. Workflow starts executing

**Auto Save**:
- System automatically saves workflow before clicking test
- Ensures executing latest configuration
- No manual save needed

**Execution Flow**:
```
Trigger Node → Action Node 1 → Action Node 2 → ... → Last Node
```

### Execute to Specific Node

Run workflow up to a specific node, useful for testing partial flows:

**Use Cases**:
- Only want to test first half of flow
- Debug specific node's input data
- Save execution time for subsequent nodes

**Execution Method**:
1. In node editor's left panel (context panel)
2. Click "Execute Upstream Nodes" button
3. System executes all upstream nodes from trigger to current node
4. Current node's context panel displays execution results

**Example Flow**:
```
Goal: Test input data for Node C
Execute: Trigger → Node A → Node B → Node C
Result: Node C's context panel shows data from A and B
```

### Execute Single Trigger

Directly run a specific trigger node:

**Applicable Scenarios**:
- Workflow has multiple triggers
- Want to test specific trigger configuration
- Debug trigger node itself

**Execution Method**:
1. Double-click to open trigger node editor
2. In node configuration panel
3. Look for node-specific test button (if available)
4. Or use test button at top of canvas

## Trigger Type Handling

Different trigger types have different execution methods.

### Chat Trigger

Chat trigger opens chat preview interface:

**Execution Flow**:
1. Click test button
2. Right chat panel automatically opens
3. Enter message in chat input box
4. Send message to trigger workflow execution
5. View execution results in chat interface

**Characteristics**:
- Simulates real conversation scenarios
- Can send multiple messages consecutively
- Supports contextual conversation
- View AI responses in real-time

**Usage Tips**:
- Input box supports multi-line text (Shift + Enter for new line)
- Can test different user inputs
- View AI Agent response effectiveness

### Manual Trigger

Manual trigger requires configuring input data:

**Execution Flow**:
1. Click test button
2. If trigger has configured input fields, displays input dialog
3. Fill in test data
4. Click execute to start running
5. View results in logs panel

**Configure Input**:
- Trigger can define required input fields
- Manually fill these fields during testing
- Data passes to downstream nodes

### Webhook Trigger

Webhook trigger can test run:

**Execution Method**:
1. Click test button
2. Uses trigger's configured default data
3. Or configure test data in trigger node
4. Execute workflow

**Production Use**:
- After testing passes, copy Webhook URL
- Configure to external system
- External system sends HTTP request to trigger workflow

## Multiple Trigger Selection

Handling when workflow contains multiple triggers.

### Trigger Selection Dialog

When multiple triggers exist, system asks which to use:

**Selection Interface**:
1. Click test button
2. Trigger selection dialog appears
3. Displays list of all available triggers
4. Use radio buttons to select a trigger
5. Click confirm to execute

**Dialog Content**:
```
Select Trigger

Please select the trigger node to execute:

○ Chat Trigger
○ Manual Trigger
○ Webhook Trigger

[Cancel] [Confirm]
```

**Trigger Information**:
- Displays trigger node names
- Sorted by node creation order
- Clearly identifies trigger type

### Avoiding Selection

If don't want to select trigger every time:

**Recommended Approach**:
1. Keep only one trigger during development
2. Add other triggers after testing passes
3. Or use "Execute to Specific Node" feature

**Multiple Trigger Scenarios**:
- Production environment needs multiple entry points
- Different channels use different triggers
- Can temporarily remove extra triggers during development

## Stop Execution

Terminate a running workflow.

### Manual Stop

Stop during workflow execution:

**Operation Method**:
1. Find "Stop" button at top of canvas
2. Click stop button
3. System terminates current execution
4. Already executed nodes retain results
5. Unexecuted nodes marked as not run

**Use Cases**:
- Found configuration error need immediate stop
- Execution time too long
- Need to modify configuration and retest
- Node stuck in infinite loop

**Stop Effect**:
- Currently executing node will be interrupted
- Subsequent nodes won't execute
- Execution history retains partial results
- Can view executed nodes in logs panel

### Execution Status

Understanding workflow execution status:

**Executing**:
- Test button changes to "Stop" button
- Nodes display execution animation
- Node status updates in real-time on canvas

**Execution Complete**:
- Stop button reverts to test button
- All nodes display execution results
- Successful nodes show green check
- Failed nodes show red error icon

**Execution Failed**:
- A node execution errored
- Subsequent nodes no longer execute
- Error node displays error message
- Click node to view detailed error

## Viewing Execution Results

View node operation and data after execution.

### Node Status Indicators

During and after execution, nodes display different states:

**Waiting** (Gray):
- Node hasn't started executing yet
- Waiting for upstream nodes to complete

**Executing** (Blue Animation):
- Node is currently executing
- Shows loading animation

**Success** (Green):
- Node execution completed
- Shows green check icon
- Click to view output data

**Failed** (Red):
- Node execution errored
- Shows red error icon
- Click to view error information

### View in Node Editor

Open node editor to view detailed results:

**Viewing Method**:
1. Double-click executed node
2. Node editor opens
3. Right panel displays output data
4. Left panel displays context data

**Data Views**:
- Schema view: Tree structure display
- JSON view: Raw JSON format
- Can copy data for debugging

### View in Logs Panel

Use logs panel to view complete execution history:

**Open Logs Panel**:
1. "Logs" tab at bottom of canvas
2. Click to open logs panel
3. View all executed nodes
4. Click node to view detailed information

**Detailed Content**:
- See [Debug Workflow](/en/guide/workflow/debug-workflow) documentation

## Pre-Execution Checks

System automatically checks if workflow can execute.

### Required Trigger

Workflow must have at least one trigger:

**Check Rules**:
- Automatically checks when clicking test
- If no trigger node exists
- Displays error prompt: "No triggers found"
- Cannot execute workflow

**Solution**:
1. Add a trigger node to canvas
2. Configure trigger parameters
3. Connect trigger to Action node
4. Click test again

### Auto Save

Automatically saves current configuration before execution:

**Save Timing**:
- Every time test button is clicked
- System automatically saves workflow
- Saves all node configurations and connections

**Save Content**:
- Node configuration changes
- Connection relationship changes
- Canvas layout changes

**Failure Handling**:
- If save fails, won't execute
- Displays save failure error
- Need to resolve save issue before retrying

## Test Data

Use test data to simulate real execution.

### Pin Data

Set fixed test data for nodes:

**Usage Method**:
1. Open node editor
2. In right output panel
3. Click "Edit Output"
4. Enter test JSON data
5. Click "Pin Data"

**Pin Effect**:
- Node won't actually execute
- Directly uses pinned data as output
- Downstream nodes receive pinned data
- Speeds up testing

**Use Cases**:
- HTTP request node avoids repeated API calls
- Simulate specific response data
- Test downstream node data processing
- Debug exceptional data situations

### Trigger Test Data

Configure test input for triggers:

**Manual Trigger**:
- Configure input field definitions
- Fill field values during testing
- Data passes to workflow

**Webhook Trigger**:
- Configure example request Body
- Use example data during testing
- Simulate Webhook request

**Chat Trigger**:
- Enter message in chat interface
- Message as trigger data
- Passes to AI Agent for processing

## Best Practices

### 1. Progressive Testing

**Recommended Flow**:
1. First test single node configuration
2. After test passes, connect next node
3. Test data flow between two nodes
4. Gradually add and test more nodes
5. Finally test complete workflow

**Benefits**:
- Quickly locate issues
- Reduce debugging time
- Ensure each node is correct

### 2. Use Pin Data

**Testing Tips**:
- Pin data for time-consuming nodes
- Avoid repeated external API calls
- Simulate various data situations
- Test exceptional data handling

**Clean Pin Data**:
- Unpin after testing completes
- Ensure production environment executes normally
- Pin data only for testing

### 3. Check Every Node

**Post-Execution Check**:
1. View each node's status
2. Confirm all show green success status
3. Open node to view output data
4. Verify data format and content
5. Check if meets expectations

### 4. Test Edge Cases

**Test Coverage**:
- Normal data flow
- Empty and null data
- Exceptionally large or small values
- Special characters and formats
- Incorrect data types

### 5. Save Test Versions

**Version Management**:
- Create version after test passes
- Mark "Test Passed" status
- Record test scenarios and results
- Facilitate future comparison and rollback

### 6. Test Different Triggers

**Multiple Trigger Testing**:
- Test each trigger separately
- Ensure all entry points work normally
- Verify data formats for different triggers
- Test trigger-specific configurations

## FAQ

### Q: No response when clicking test?

**A**: Possible reasons:
1. Workflow has no trigger node → Add trigger
2. Trigger configuration incomplete → Check required parameters
3. Network connection issue → Check network status
4. Workflow save failed → View error prompt

### Q: Execution takes very long?

**A**: Optimization suggestions:
1. Use "Execute to Specific Node" to test partial flow
2. Set pin data for time-consuming nodes
3. Check for infinite loops or repeated calls
4. Optimize HTTP request timeout settings
5. Click stop button to terminate if necessary

### Q: How to debug failed node execution?

**A**: Debugging steps:
1. Click failed node to view error message
2. Check if required parameters are filled
3. View node's input data correctness
4. Test upstream node output data
5. Modify configuration based on error message
6. Retest after modification

### Q: How to test part of workflow?

**A**: Two methods:
1. Use "Execute to Specific Node" feature
2. Set pin data for certain nodes to skip actual execution

### Q: How to test Chat trigger?

**A**: Testing method:
1. Click test button to open chat panel
2. Enter test message in input box
3. Send message to trigger execution
4. View AI reply and workflow results
5. Can continue conversation to test context

### Q: Will testing affect production data?

**A**: Depends on node configuration:
- HTTP request node will actually call API
- Database operations will actually modify data
- Recommend test environment use test API and database
- Use caution or pin data for production API testing

### Q: How long is execution history saved?

**A**: Execution history save policy:
- Test execution saved in current session
- Test history cleared after page refresh
- Production execution history saved long-term
- Can view history execution in logs panel

### Q: How to select default for multiple triggers?

**A**: Selection recommendations:
- System has no default trigger concept
- Need to select every time
- Recommend keeping only one trigger during development
- Or use most commonly used trigger for testing

## Related Resources

- [Debug Workflow](/en/guide/workflow/debug-workflow) - Learn debugging techniques
- [Version Control](/en/guide/workflow/version-control) - Manage workflow versions
- [Editing Nodes](/en/guide/editing-nodes) - Configure node parameters
- [Chat Trigger](/en/guide/workflow/nodes/trigger-nodes/chat) - Learn about chat trigger
