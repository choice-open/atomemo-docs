---
title: Manual Trigger Node
description: Manually trigger workflow execution for testing, debugging, and on-demand scenarios
---

# Manual Trigger Node

The Manual Trigger node allows manual workflow execution. This is the simplest trigger type, mainly used for testing, debugging workflows, or scenarios requiring manual intervention.

## Use Cases

- **Workflow Testing** - Manually trigger during development and testing
- **Workflow Debugging** - Step-by-step debugging of workflow logic
- **On-demand Execution** - Trigger specific tasks when needed
- **Periodic Manual Tasks** - Tasks needing standardized process but not automation
- **Demo Presentations** - Manually trigger to demonstrate functionality

## Node Features

- **Simplest Trigger** - No configuration parameters required
- **Manual Control** - Completely user-initiated
- **Flexible Testing** - Quick testing during development
- **Repeatable Execution** - Can trigger same workflow multiple times
- **Immediate Feedback** - View execution results immediately after trigger

### Trigger Methods

**In Editor**: Click "Run" button in node toolbar
**Via API**: Call workflow execution API with parameters

## Node Configuration

### No Parameter Configuration
Manual Trigger is very simple and requires no parameter configuration.

### Advanced Settings
**Node Description (nodeDescription)**: Only configurable item

```yaml
nodeDescription: "Weekly report generation - trigger every Monday"
```

## Output Data

Manual Trigger doesn't output specific data by itself, but can receive data when triggered:

```javascript
// If triggered via API with data
$('Manual Trigger').inputData

// Example: API call passes data
{
  "date": "2024-01-15",
  "reportType": "weekly",
  "userId": "user_123"
}

// Access in workflow
$('Manual Trigger').date
$('Manual Trigger').reportType
```

## Workflow Examples

### Example 1: Simple Test Workflow

```
Manual Trigger
  → Code Node
    Code: |
      return {
        message: "Hello, World!",
        timestamp: new Date().toISOString()
      };
  → HTTP Request Node
    URL: "https://api.example.com/log"
    Method: POST

Purpose: Test if HTTP Request node is configured correctly
Trigger: Click "Run" button on Manual Trigger
```

### Example 2: Data Report Generation

```
Manual Trigger
  → HTTP Request Node (Query data)
    URL: "https://api.example.com/data/weekly"
  → Code Node (Process data)
    Code: |
      const data = $('HTTP Request').body;
      return {
        report: generateReport(data),
        generatedAt: new Date().toISOString()
      };
  → HTTP Request Node (Send report)
    URL: "https://api.example.com/reports/send"
    Method: POST

Purpose: Manually trigger weekly report generation every Monday
Trigger: Admin clicks "Run" button
```

### Example 3: Data Sync Task

```
Manual Trigger
  → HTTP Request (Get data from source)
    URL: "https://source-api.example.com/products"
  → Code Node (Transform data)
    Code: |
      const source = $('HTTP Request').body;
      return {
        products: source.items.map(item => ({
          id: item.productId,
          name: item.productName,
          price: item.price / 100
        }))
      };
  → HTTP Request (Sync to target)
    URL: "https://target-api.example.com/sync"
    Method: POST

Purpose: Periodically sync product data manually
Trigger: Operations staff trigger as needed
```

### Example 4: Development Test Workflow

```
Manual Trigger
  → AI Classifier Node
    Input: "Test classifier: This is a product price inquiry"
    Classes: ["Product", "Price", "Support", "Other"]
  → Entity Recognition Node
    Input: "Test entity: I want 2 apples at $5 each"
    JSON Schema: {
      properties: {
        product: {type: "string"},
        quantity: {type: "number"},
        price: {type: "number"}
      }
    }
  → Code Node (Aggregate test results)
    Code: |
      return {
        classifier: $('AI Classifier').class,
        entityRecognition: $('Entity Recognition'),
        testPassed: $('AI Classifier').class === "Price" &&
                    $('Entity Recognition').product === "apples"
      };

Purpose: Test if AI nodes work correctly
Trigger: Frequent manual triggers during development
```

## Best Practices

### 1. Add Clear Node Descriptions

```yaml
# Good
nodeDescription: "Weekly report task - Execute Monday mornings, generate last week's data report"

# Bad
nodeDescription: ""  # Empty, team doesn't know purpose
```

### 2. Use Manual Trigger During Development

```
Development Flow:
1. Create workflow with Manual Trigger
2. Add nodes incrementally, test after each addition
3. Confirm all nodes work correctly
4. When complete, replace with appropriate trigger (Chat/Webhook)
```

### 3. Prepare Test Data

```javascript
Code Node (right after Manual Trigger)
  Code: |
    // Simulate real data structure
    return {
      userId: "test_user_123",
      message: "Test message",
      timestamp: new Date().toISOString(),
      metadata: {source: "manual_test"}
    };
```

### 4. Log Manual Executions

```javascript
HTTP Request Node
  URL: "https://api.example.com/execution-logs"
  Body: {
    workflowId: "wf_123",
    executedBy: $('Manual Trigger').triggeredBy,
    executedAt: new Date().toISOString()
  }
```

## FAQ

### Q: Manual vs other triggers?

**A**:
- **Manual Trigger**: Click to run, testing, on-demand tasks
- **Chat Trigger**: User messages, conversational interaction
- **Webhook Trigger**: HTTP requests, API integration

### Q: How to pass parameters to Manual Trigger?

**A**: Via API or set defaults in workflow:

```javascript
Code Node
  Code: |
    const trigger = $('Manual Trigger');
    return {
      date: trigger.date || new Date().toISOString(),
      type: trigger.type || 'daily'
    };
```

### Q: Can Manual Trigger be scheduled?

**A**: No. Use external scheduler (cron) or future Schedule Trigger node.

### Q: Is Manual Trigger suitable for production?

**A**: Yes for:
- Periodic manual operations (weekly/monthly reports)
- On-demand tasks (data sync, batch processing)
- Tasks requiring human approval
- Emergency operations (system fixes, data cleanup)

No for:
- Auto-response scenarios (use Chat Trigger)
- Real-time processing (use Webhook Trigger)
- High-frequency execution (use scheduled trigger)

## Next Steps

- [Chat Trigger Node](/en/guide/workflow/nodes/trigger-nodes/chat) - Learn conversational trigger
- [Webhook Trigger Node](/en/guide/workflow/nodes/trigger-nodes/webhook) - Learn API trigger
- [Working with Nodes](/en/guide/working-with-nodes) - Learn workflow design

## Related Resources

- [Expression Syntax](/en/guide/expressions/) - Learn expressions in nodes
- [Code Node](/en/guide/workflow/nodes/action-nodes/code) - Add custom logic
