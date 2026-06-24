---
title: Schedule Trigger
description: Trigger workflow execution on a recurring schedule using cron expressions
---

# Schedule Trigger

The Schedule Trigger allows workflows to execute automatically on a recurring schedule defined by a cron expression. This is the ideal trigger for periodic automation tasks such as daily reports, data syncs, and regular maintenance jobs.

## Use Cases

### Typical Applications
- **Scheduled Reports** - Generate and send daily, weekly, or monthly reports
- **Data Synchronization** - Periodically sync data between systems
- **Regular Maintenance** - Clean up old records, refresh caches, archive logs
- **Periodic Checks** - Monitor system health, check for expired items
- **Batch Processing** - Process queued items at regular intervals
- **Knowledge Base Updates** - Refresh knowledge base content on a schedule

## Node Features

### Basic Characteristics
- **Automatic Execution** - No manual intervention required after setup
- **Cron-Based Scheduling** - Flexible scheduling using standard cron expressions
- **Unique Per Workflow** - Only one Schedule Trigger allowed per workflow
- **App-Level Timezone** - Executes according to the app's configured timezone
- **Dry Run Support** - Test manually with the Run button, ignoring the schedule

### Built-in Output Fields

The Schedule Trigger produces a single output port (`Head`). The output data is empty by default — use the trigger solely as a workflow entry point.

## Node Configuration

### Basic Settings (Parameters Panel)

#### Cron Expression

The core configuration is a cron expression that defines when the workflow executes.

**Format**: Extended crontab syntax with optional seconds field:

```
second minute hour day month weekday year
```

- Fields are space-separated
- The `second` field is optional (omit for minute-granularity scheduling)
- The `year` field is optional

**Supported Syntax**:

| Feature | Example | Description |
| --- | --- | --- |
| Exact value | `0 9 * * *` | At minute 0 of hour 9 (9:00 AM) daily |
| Wildcard `*` | `* * * * *` | Every minute |
| Step `/` | `*/15 * * * *` | Every 15 minutes |
| Range `-` | `0 9-17 * * *` | Every hour from 9 AM to 5 PM |
| List `,` | `0 9,12,18 * * *` | At 9 AM, 12 PM, and 6 PM |
| Special `@` | `@daily` | Once per day at midnight |

**Special Expressions**:

| Expression | Equivalent | Description |
| --- | --- | --- |
| `@yearly` / `@annually` | `0 0 1 1 *` | Once per year on Jan 1 at midnight |
| `@monthly` | `0 0 1 * *` | Once per month on the 1st at midnight |
| `@weekly` | `0 0 * * 0` | Once per week on Sunday at midnight |
| `@daily` / `@midnight` | `0 0 * * *` | Once per day at midnight |
| `@hourly` | `0 * * * *` | Once per hour at minute 0 |
| `@minutely` | `* * * * *` | Once per minute |
| `@secondly` | `* * * * * *` | Once per second |

> **Note**: `@reboot` is **not supported**.

**Common Examples**:

| Expression | Description |
| --- | --- |
| `0 9 * * 1` | Every Monday at 9:00 AM |
| `0 8,18 * * 1-5` | Every weekday at 8:00 AM and 6:00 PM |
| `*/5 * * * *` | Every 5 minutes |
| `0 9-17 * * 1-5` | Every hour, 9 AM–5 PM, Monday–Friday |
| `0 0 1,15 * *` | Midnight on the 1st and 15th of each month |
| `0 6 * * *` | Every day at 6:00 AM |
| `@daily` | Once per day at midnight |

> **Note**: The cron input field does not support inline comments (e.g., `# comment`). Only enter the expression itself.

> **Reference**: Full cron expression syntax at [Crontab HexDocs](https://hexdocs.pm/crontab/cron_notation.html)

#### Timezone

The Schedule Trigger uses the **app-level timezone** setting. If no timezone is configured for the app, it defaults to your local timezone.

### Advanced Settings (Settings Panel)

#### Node Description

Add a custom description to help team members understand the trigger's purpose:

```yaml
nodeDescription: "Daily report generation - runs every weekday at 9 AM"
```

## Testing & Debugging

### Dry Run

The Schedule Trigger includes a **Run** button in its toolbar for immediate manual execution:

1. Click the **Run** button on the Schedule Trigger node
2. The workflow executes immediately, **ignoring the cron schedule**
3. View execution results to verify workflow logic

This is useful for:
- Testing the workflow before letting it run on schedule
- Manually triggering an off-schedule execution when needed

> **Tip**: Dry run executions do not affect the cron schedule — the next scheduled run proceeds as normal.

## Workflow Examples

### Example 1: Daily Report

```
Schedule Trigger
  Cron: 0 9 * * 1-5 (weekdays at 9 AM)
  → HTTP Request Node
    URL: "https://api.example.com/reports/daily"
    Method: POST
  → Answer Node
    Answer: "Daily report generated and sent"
```

### Example 2: Data Sync Every 30 Minutes

```
Schedule Trigger
  Cron: */30 * * * * (every 30 minutes)
  → HTTP Request Node
    URL: "https://source-api.example.com/data"
    Method: GET
  → Code Node (transform)
    Code: |
      const source = $('HTTP Request').body;
      return source.items.map(item => ({
        id: item.uid,
        name: item.title,
        updated: item.modifiedAt
      }));
  → HTTP Request Node (sync to target)
    URL: "https://target-api.example.com/bulk-import"
    Method: POST
    Body: $('Code').output
```

### Example 3: Weekly Knowledge Base Update

```
Schedule Trigger
  Cron: @weekly (Sunday at midnight)
  → HTTP Request Node (fetch latest docs)
    URL: "https://api.example.com/docs/latest"
    Method: GET
  → Knowledge Ingestion Node
    Document: $('HTTP Request').body
  → Answer Node
    Answer: "Knowledge base updated for the week"
```

### Example 4: End-of-Month Cleanup

```
Schedule Trigger
  Cron: 0 0 28-31 * * (last days of each month)
  → Code Node (check if last day)
    Code: |
      const today = new Date();
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      return { isLastDay: today.getDate() === lastDay };
  → Conditional Branch
    Condition: $('Code').isLastDay === true
    → [Yes] → HTTP Request Node (run cleanup)
      URL: "https://api.example.com/maintenance/cleanup"
      Method: POST
    → [No] → End
```

## Best Practices

### 1. Rename the Node for Clarity

The cron input field only accepts the expression itself — inline comments like `# Every Monday` are **not supported** and will cause a parse error. Instead, **rename the node** directly on the canvas to make the schedule obvious at a glance:

```
# Bad — generic name, unclear purpose
[Schedule Trigger]

# Good — rename to describe what it does
[Every Monday 9AM — Weekly Report]
```

Double-click the node title to rename it. The new name appears on the canvas and in execution logs, making it immediately clear what each trigger does.

### 2. Validate Before Publishing

Always use **dry run** to test the workflow before relying on the schedule:

```
1. Configure cron expression
2. Click "Run" for a dry run
3. Verify all nodes execute correctly
4. Publish the workflow
5. Monitor the first scheduled execution
```

### 3. Add Error Handling

```
Schedule Trigger
  → Try/Catch
    → Main workflow logic
    → [Error] → Send notification to admin
```

### 4. Consider Timezone

Ensure the app-level timezone is correctly set, especially for time-sensitive tasks:

- Business hours reports → use the relevant business timezone
- Midnight tasks → be aware of which midnight the cron refers to

### 5. Avoid Overlapping Executions

For long-running workflows, consider whether a new execution should start before the previous one finishes:

```yaml
# If your workflow takes 10 minutes, don't schedule every 5 minutes
cron: "*/5 * * * *"   # ⚠️ may cause overlap

# Instead, leave enough gap
cron: "*/30 * * * *"  # ✓ safe for a 10-min workflow
```

> **Note**: The `#` comments above are for documentation only — do not paste them into the cron input field.

## FAQ

### Q: How many Schedule Triggers can a workflow have?

**A**: Only **one** Schedule Trigger per workflow. If you need multiple schedules for the same logic, create separate workflows.

### Q: What happens if a scheduled execution is missed?

**A**: The cron scheduler does not retroactively execute missed runs. If the system is down at the scheduled time, that execution is skipped. The next scheduled run proceeds as normal.

**Recommendation**: For critical tasks, add a monitoring workflow or external health check.

### Q: Can I manually skip a scheduled execution?

**A**: No. The Schedule Trigger strictly follows the cron expression. To skip an execution, you can temporarily deactivate the workflow before the scheduled time and reactivate it afterward.

### Q: How do I test a Schedule Trigger workflow?

**A**: Use the **Run** button (dry run) in the node toolbar. It executes the workflow immediately, bypassing the cron schedule, so you can verify logic and outputs without waiting.

### Q: Does the Schedule Trigger output any data?

**A**: The Schedule Trigger currently outputs no data. Use it purely as a workflow entry point. If you need timestamp information, use a Code Node with `new Date()` in your workflow.

### Q: Which timezone does the Schedule Trigger use?

**A**: It uses the **app-level timezone** setting. If not configured, it falls back to your local timezone. Check your app settings to confirm the correct timezone is set.

### Q: Schedule Trigger vs external cron (e.g., Linux crontab + Webhook)?

**A**:

| Feature | Schedule Trigger | External Cron + Webhook |
| --- | --- | --- |
| Setup | Built-in, no external systems | Requires cron and API call setup |
| Monitoring | Integrated with app logs | Separate monitoring needed |
| Timezone | App-level timezone | System timezone |
| Security | Internal execution | Exposes Webhook endpoint |
| Dry Run | Built-in Run button | Manual curl command |

**Recommendation**: Use Schedule Trigger for straightforward periodic tasks within {{PRODUCT_NAME}}. Use external cron + Webhook only when you need cross-system orchestration.

## Next Steps

- [Webhook Trigger](/en/guide/workflow/nodes/trigger-nodes/webhook) - Learn about HTTP-based triggering
- [Working with Nodes](/en/guide/working-with-nodes) - Learn workflow design fundamentals
- [Expression Syntax](/en/guide/expressions/) - Learn how to use expressions in nodes

## Related Resources

- [HTTP Request Node](/en/guide/workflow/nodes/action-nodes/http-request) - Send HTTP requests in your workflow
- [Wait Node](/en/guide/workflow/nodes/action-nodes/wait) - Add delays between workflow steps
- [Crontab HexDocs](https://hexdocs.pm/crontab/cron_notation.html) - Full cron expression reference
