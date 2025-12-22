---
title: Wait Node
description: Pause workflow execution for a specified duration
---

# Wait Node

The Wait node is used to pause workflow execution for a specified duration. It allows you to control the execution rhythm of workflows, enabling delayed execution, scheduled tasks, retry intervals, and more.

## Use Cases

### Typical Applications
- **Delayed Execution** - Wait for a period after an operation before continuing
- **API Rate Limiting** - Wait after API calls to avoid triggering rate limits
- **Retry Intervals** - Add delays between failed retries
- **Scheduled Tasks** - Create workflows that execute at specific times
- **Polling Intervals** - Add wait times between polling operations
- **Batch Processing Buffers** - Add intervals between batch operations to avoid system overload
- **Manual Review Delays** - Wait for manual processing to complete before continuing

## Node Configuration

### Basic Settings (Parameters Panel)

#### Wait Duration (amount)

The numeric value for the wait duration.

**Field Properties**:
- Required field
- Number type
- Minimum value: 0
- Supports expressions

**Default**: `0`

**Configuration Examples**:

```javascript
// 1. Fixed duration (seconds)
5

// 2. Fixed duration (minutes)
30

// 3. Calculate duration using expressions
$('HTTP Request').body.retryDelay

// 4. Set dynamically based on conditions
$('AI Classifier').class === "urgent" ? 0 : 60

// 5. Read from configuration node
$('Config').defaultWaitTime
```

#### Time Unit (unit)

The time unit for the wait duration.

**Available Values**:
- `seconds` - Seconds
- `minutes` - Minutes (default)
- `hours` - Hours
- `days` - Days

**Default**: `minutes`

**Unit Conversions**:
```yaml
1 day = 24 hours = 1440 minutes = 86400 seconds
1 hour = 60 minutes = 3600 seconds
1 minute = 60 seconds
```

**Usage Recommendations**:
```yaml
Short delays (< 1 minute): Use seconds
Medium delays (1-60 minutes): Use minutes (recommended)
Long delays (1-24 hours): Use hours
Very long delays (> 1 day): Use days
```

### Advanced Settings (Settings Panel)

#### Always Output (alwaysOutput)

Whether to output an empty item when output is empty.

**Default**: `false`

**Purpose**: Prevents workflow from terminating at this node.

#### Execute Once (executeOnce)

Whether to execute only once using data from the first item received.

**Default**: `false`

**Purpose**:
- When upstream nodes return multiple items, the node waits for each item by default
- When enabled, only the first item executes, subsequent items skip the wait and output directly

#### Retry on Fail (retryOnFail)

Whether to automatically retry when wait fails.

**Default**: `false`

**Note**: Wait nodes typically don't fail, but may need retries in special circumstances (e.g., system interruption).

#### Max Tries (maxTries)

Maximum number of retries after failure.

**Default**: `3`

**Prerequisite**: `retryOnFail` must be `true`

#### Wait Between Tries (waitBetweenTries)

Wait time between retries (milliseconds).

**Default**: `1000` (1 second)

**Prerequisite**: `retryOnFail` must be `true`

#### Error Handling (onError)

How to handle wait failures.

**Available Values**:
- `stopWorkflow` - Stop entire workflow (default)
- `continueRegularOutput` - Continue with regular output
- `continueErrorOutput` - Continue with error output

#### Node Description (nodeDescription)

Add custom description for the node.

```yaml
nodeDescription: "Wait 5 minutes before continuing processing"
```

## Output Data

The Wait node preserves input data unchanged and outputs it as-is after the specified wait time.

```javascript
// Input data
{
  userId: "user123",
  message: "Hello"
}

// Output after wait (same data)
{
  userId: "user123",
  message: "Hello"
}
```

**Accessing Output**:

```javascript
// Get data after wait
$('Wait').userId
$('Wait').message

// Data is same as input node
$('Wait') === $('HTTP Request')  // Same values
```

## Workflow Examples

### Example 1: API Rate Limiting

```
HTTP Request Node A
  → Wait Node
    Duration: 1
    Unit: seconds
  → HTTP Request Node B
  → Wait Node
    Duration: 1
    Unit: seconds
  → HTTP Request Node C
```

**Description**: Wait 1 second between each API request to avoid triggering rate limits.

### Example 2: Retry Interval

```
HTTP Request Node
  → Conditional Branch
    Condition: $('HTTP Request').statusCode !== 200
    → [True] → Wait Node
      Duration: 5
      Unit: seconds
      → HTTP Request Node (retry)
    → [False] → Answer Node
```

**Description**: If request fails, wait 5 seconds before retrying.

### Example 3: Scheduled Task

```
Webhook Trigger
  → Code Node (calculate next execution time)
  → Wait Node
    Duration: $('Code').minutesUntilNextRun
    Unit: minutes
  → Scheduled Task Node
```

**Description**: Wait based on calculated time, then execute scheduled task.

### Example 4: Batch Processing Interval

```
Loop Iterate Node
  → HTTP Request Node (process single item)
  → Wait Node
    Duration: 2
    Unit: seconds
  → Next iteration
```

**Description**: Wait 2 seconds between processing each batch to avoid overloading the system.

### Example 5: Dynamic Wait Duration

```
HTTP Request Node (get configuration)
  → Wait Node
    Duration: $('HTTP Request').body.retryDelay
    Unit: seconds
  → HTTP Request Node (retry)
```

**Description**: Dynamically set wait duration based on API response configuration.

### Example 6: Multi-Level Delays

```
Operation Node A
  → Wait Node (short delay)
    Duration: 1
    Unit: seconds
  → Operation Node B
  → Wait Node (medium delay)
    Duration: 30
    Unit: seconds
  → Operation Node C
  → Wait Node (long delay)
    Duration: 5
    Unit: minutes
  → Operation Node D
```

**Description**: Use different delay lengths between different operations.

### Example 7: Conditional Delay

```
AI Classifier
  → Conditional Branch
    Condition: $('AI Classifier').class === "urgent"
    → [True] → Wait Node
      Duration: 0
      Unit: seconds
      → Process immediately
    → [False] → Wait Node
      Duration: 60
      Unit: seconds
      → Delayed processing
```

**Description**: Decide whether to delay processing based on classification result.

### Example 8: Polling Wait

```
HTTP Request Node (check status)
  → Conditional Branch
    Condition: $('HTTP Request').body.status === "processing"
    → [True] → Wait Node
      Duration: 10
      Unit: seconds
      → HTTP Request Node (check again)
    → [False] → Process Complete Node
```

**Description**: If task is still processing, wait 10 seconds before checking status again.

## Best Practices

### 1. Set Appropriate Wait Durations

**API Rate Limiting**
```yaml
# Check API documentation for rate limits
# Example: 60 requests per minute
Duration: 1
Unit: seconds  # Wait 1 second after each request
```

**System Load Control**
```yaml
# Between batch operations
Duration: 2-5
Unit: seconds
```

**Retry Intervals**
```yaml
# Exponential backoff strategy
First retry: 1 second
Second retry: 2 seconds
Third retry: 4 seconds
```

### 2. Use Expressions for Dynamic Duration

**Adjust Based on Response**
```javascript
// Set based on API retry-after header
$('HTTP Request').headers['retry-after'] || 60

// Set different delays based on error type
$('HTTP Request').statusCode === 429 ? 60 : 5
```

**Time Calculations**
```javascript
// Wait until next hour
Code Node: Calculate minutes
Wait Node: Use calculation result
```

### 3. Avoid Excessively Long Wait Times

**Not Recommended**:
```yaml
Duration: 10080  # 7 days (too long)
Unit: minutes
```

**Recommended**: Use scheduled triggers or external scheduling systems for long waits.

### 4. Combine with Conditional Branches

**Smart Waiting**
```
Conditional Branch
  → [Needs wait] → Wait Node → Process
  → [No wait needed] → Process directly
```

### 5. Testing and Debugging

**Test Different Durations**
```yaml
Development: 1-5 seconds
Testing: 10-30 seconds
Production: Based on actual requirements
```

**Monitor Wait Times**
```
Wait Node
  → Code Node (record wait start time)
  → ...waiting...
  → Code Node (record wait end time, calculate actual wait duration)
```

### 6. Performance Considerations

**Avoid Unnecessary Waits**
```javascript
// Only wait when needed
$('Condition').needsWait ? 30 : 0
```

**Batch Processing Optimization**
```yaml
# Use executeOnce to avoid repeated waits
executeOnce: true
```

## FAQ

### Q1: Does the Wait node block the entire workflow?

**A**: Yes, the Wait node pauses the current execution path, but does not affect other parallel branches. After waiting completes, subsequent nodes continue executing.

### Q2: Can I use expressions to dynamically set wait duration?

**A**: Yes, the `amount` field supports expressions:

```javascript
// Dynamically calculate wait duration
$('HTTP Request').body.waitTime

// Conditional judgment
$('Condition').isUrgent ? 0 : 60

// Mathematical calculation
$('Config').baseWaitTime * 2
```

### Q3: What's the maximum wait time?

**A**: Technically there's no upper limit, but recommendations:
- **Short delays** (< 1 hour): Use Wait node
- **Long delays** (> 1 hour): Consider using scheduled triggers or external scheduling systems

### Q4: Does the workflow consume resources during wait?

**A**: Workflow execution pauses during wait, consuming no compute resources. Waits are implemented server-side and don't consume client resources.

### Q5: How to get current time after waiting?

**A**: Use Code node after Wait node to get time:

```
Wait Node
  → Code Node
    Code:
      function main() {
          return {
              waitedUntil: new Date().toISOString()
          }
      }
```

### Q6: Does Wait node affect workflow execution time statistics?

**A**: Yes, wait time is included in the workflow's total execution time.

### Q7: Can I cancel a workflow that's waiting?

**A**: Yes, you can cancel executing workflows including waiting workflows through the workflow management interface.

### Q8: Can multiple Wait nodes be chained?

**A**: Yes, multiple Wait nodes execute sequentially:

```
Node A → Wait 1 second → Node B → Wait 2 seconds → Node C
```

Total wait time = 1 second + 2 seconds = 3 seconds.

### Q9: Can Wait node be used for scheduled tasks?

**A**: Yes, for simple scheduled tasks, but for complex scheduling needs (e.g., daily fixed time execution), consider using scheduled triggers or external scheduling systems.

### Q10: How to implement exponential backoff retry?

**A**: Combine Code node and Wait node:

```
Code Node (calculate backoff time)
  Code:
    function main({retryCount}) {
        return {
            waitTime: Math.pow(2, retryCount)  // 1, 2, 4, 8...
        }
    }
  → Wait Node
    Duration: $('Code').waitTime
    Unit: seconds
  → HTTP Request Node (retry)
```

## Next Steps

- [Conditional Branch](/en/guide/workflow/nodes/action-nodes/if) - Decide whether to wait based on conditions
- [HTTP Request Node](/en/guide/workflow/nodes/action-nodes/http-request) - Add delays between API calls
- [Loop & Iterate](/en/guide/workflow/nodes/control-nodes/loop-iterate) - Add wait intervals in loops

## Related Resources

- [Code Node](/en/guide/workflow/nodes/action-nodes/code) - Calculate dynamic wait duration
- [Expression Syntax](/en/guide/expressions/) - Learn how to use expressions in wait duration

