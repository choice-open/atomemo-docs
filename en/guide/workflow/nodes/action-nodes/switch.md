---
title: Switch
description: Route data into multiple branches based on conditions — data flows to all matching branches
---

# Switch

The Switch node evaluates multiple conditions in parallel and routes data to **all branches** whose conditions match. Unlike the [Conditional Branch](/en/guide/workflow/nodes/action-nodes/if) node (which sends data down only one path), Switch is a **multi-match** router — if data satisfies more than one branch's condition, it flows into **every matching branch** simultaneously.

## Use Cases

### Typical Applications
- **Multi-category Tagging** — Apply multiple tags to an item based on overlapping criteria
- **Parallel Notifications** — Send alerts to different channels when threshold conditions overlap
- **Data Routing** — Route incoming data to multiple downstream processors that each handle a different concern
- **Feature Flags** — Activate multiple feature paths at once based on conditions
- **Audience Segmentation** — Classify users into multiple overlapping segments

## Node Configuration

### Basic Settings (Parameters Panel)

#### Branches

The Switch node consists of one or more **branches**. Each branch has an index (starting from `0`), an optional name, and a condition that determines whether data flows into that branch.

| Property | Description |
| --- | --- |
| **Index** | Auto-assigned 0-based position. Determined by the branch's order in the list. |
| **Name** | Optional label. When set, the output port displays this name instead of the numeric index. |
| **Condition** | Defines when data enters this branch (see below). |

**Branch operations**:
- **Add Branch** — Append a new branch with its own condition
- **Copy Branch** — Duplicate an existing branch (including its conditions)
- **Delete Branch** — Remove a branch
- **Reorder** — Drag branches to change their order (index updates automatically)

> **Naming convention**: Branches are `0`, `1`, `2`… by default. If you set a name (e.g., `VIP Customers`), the output port displays that name instead of `0`.

#### Conditions

Each branch contains one or more **conditions** organized into **condition groups**. Conditions support multi-level nesting for complex logic.

##### Condition

A single comparison between two values:

| Field | Description |
| --- | --- |
| **Left Value** | The value to test — supports [expressions](/en/guide/expressions/) |
| **Operator** | The comparison operator (see table below) |
| **Right Value** | The value to compare against — supports expressions |

##### Condition Group

A logical container that combines multiple conditions with `AND` or `OR`:

```
Condition Group (AND)
  ├─ Condition: status is_equal_to "active"
  ├─ Condition: age is_greater_than 18
  └─ Condition Group (OR)
       ├─ Condition: plan is_equal_to "premium"
       └─ Condition: plan is_equal_to "enterprise"
```

Groups can be nested to any depth, enabling arbitrarily complex branching logic.

##### Supported Operators

Operators are organized by data type. Available operators depend on the type you select:

**String operators** (type: `string`):

| Operator | Description | Example |
| --- | --- | --- |
| `is_equal_to` | Exact match | `"active" is_equal_to "active"` → true |
| `is_not_equal_to` | Not equal | `"draft" is_not_equal_to "active"` → true |
| `contains` | Contains substring | `"hello world" contains "world"` → true |
| `does_not_contain` | Does not contain | `"hello" does_not_contain "z"` → true |
| `starts_with` | Starts with prefix | `"order_123" starts_with "order_"` → true |
| `does_not_start_with` | Does not start with | `"abc" does_not_start_with "z"` → true |
| `ends_with` | Ends with suffix | `"file.pdf" ends_with ".pdf"` → true |
| `does_not_end_with` | Does not end with | `"file.txt" does_not_end_with ".pdf"` → true |
| `matches_regex` | Matches regular expression | `"abc123" matches_regex "^[a-z]+\\d+$"` → true |
| `does_not_match_regex` | Does not match regex | `"abc" does_not_match_regex "\\d+"` → true |
| `is_empty` | Is empty string | `"" is_empty` → true |
| `is_not_empty` | Is not empty string | `"hello" is_not_empty` → true |

**Number operators** (type: `number`):

| Operator | Description |
| --- | --- |
| `is_equal_to` | Equal to |
| `is_not_equal_to` | Not equal to |
| `is_less_than` | Less than |
| `is_less_than_or_equal_to` | Less than or equal to |
| `is_greater_than` | Greater than |
| `is_greater_than_or_equal_to` | Greater than or equal to |

**Date/Time operators** (type: `dateTime`):

| Operator | Description |
| --- | --- |
| `is_equal_to` | Same date/time |
| `is_not_equal_to` | Different date/time |
| `is_less_than` | Earlier than |
| `is_less_than_or_equal_to` | Earlier than or same |
| `is_greater_than` | Later than |
| `is_greater_than_or_equal_to` | Later than or same |

**Boolean operators** (type: `boolean`):

| Operator | Description |
| --- | --- |
| `is_true` | Value is `true` |
| `is_false` | Value is `false` |

**Array operators** (type: `array`):

| Operator | Description |
| --- | --- |
| `contains` | Array contains element |
| `does_not_contain` | Array does not contain element |
| `is_empty` | Array is empty (`[]`) |
| `is_not_empty` | Array is not empty |
| `length_equal_to` | Length equals N |
| `length_not_equal_to` | Length not equal to N |
| `length_greater_than` | Length greater than N |
| `length_greater_than_or_equal_to` | Length >= N |
| `length_less_than` | Length less than N |
| `length_less_than_or_equal_to` | Length <= N |

**Object operators** (type: `object`):

| Operator | Description |
| --- | --- |
| `is_empty` | Object is empty (`{}`) |
| `is_not_empty` | Object is not empty |

**Universal operators** (work with any type):

| Operator | Description |
| --- | --- |
| `exists` | Value is not `null` / `nil` |
| `does_not_exist` | Value is `null` / `nil` |
| `is_empty` | Value is empty (`""`, `[]`, `{}`, `nil`) |
| `is_not_empty` | Value is not empty |

### Advanced Settings (Settings Panel)

#### Node Description

Add a custom description to document the branching logic:

```yaml
nodeDescription: "Routes customers by plan type and activity status.
Branch 0: VIP active users
Branch 1: Premium users
Branch 2: All others (fallback)"
```

## Behavior

### Multi-Match Routing

The Switch node evaluates **every** branch's condition independently. Data flows into **all** branches whose conditions evaluate to `true`. This is fundamentally different from the [Conditional Branch](/en/guide/workflow/nodes/action-nodes/if) node, which sends data down only the first matching path.

```
Switch Node
  ├─ Branch 0: plan is_equal_to "premium"        → matches ✓
  ├─ Branch 1: status is_equal_to "active"       → matches ✓
  └─ Branch 2: spend is_greater_than 1000        → matches ✓

Result: Data flows into Branch 0, Branch 1, AND Branch 2
```

### Evaluation Order

Branches are evaluated in index order (0 → 1 → 2 → …). However, the order does **not** affect which branches match — all branches are evaluated regardless of earlier results.

### Error Handling

If a condition evaluation encounters an error (e.g., comparing incompatible types like a string against a number with `is_greater_than`), the **entire** Switch node errors. The error is not silently ignored — it propagates to the error output port.

```
Switch Node
  ├─ Branch 0: name is_greater_than 100           → Error! (string vs number)
  └─ Branch 1: status is_equal_to "active"        → Never evaluated

Result: Switch node errors
```

To handle this gracefully, ensure condition types are compatible, or use [Code Node](/en/guide/workflow/nodes/action-nodes/code) to pre-validate data before the Switch.

## Workflow Examples

### Example 1: Multi-category Tagging

Tag an incoming order with all applicable categories:

```
Webhook Trigger (POST, order data)
  → Switch
      Branch 0 "High Value": $('Webhook Trigger').body.total is_greater_than 1000
      Branch 1 "New Customer": $('Webhook Trigger').body.isNewCustomer is_true
      Branch 2 "International": $('Webhook Trigger').body.country is_not_equal_to "US"
  
  → Branch 0 "High Value" → Code Node (add "high_value" tag)
  → Branch 1 "New Customer" → Code Node (add "new_customer" tag)
  → Branch 2 "International" → Code Node (add "international" tag)
```

### Example 2: Parallel Notifications

Send alerts to multiple channels when conditions overlap:

```
Schedule Trigger (hourly)
  → HTTP Request (fetch metrics)
  → Switch
      Branch 0 "CPU Alert": $('HTTP Request').body.cpu is_greater_than 90
      Branch 1 "Memory Alert": $('HTTP Request').body.memory is_greater_than 85
      Branch 2 "Disk Alert": $('HTTP Request').body.disk is_greater_than 95

  → Branch 0 "CPU Alert" → HTTP Request (Slack #ops)
  → Branch 1 "Memory Alert" → HTTP Request (Slack #ops)
  → Branch 2 "Disk Alert" → HTTP Request (PagerDuty)
```

### Example 3: Nested Conditions

Use condition groups for complex logic:

```
Webhook Trigger (POST, user event)
  → Switch
      Branch 0 "VIP Engagement":
        Condition Group (AND)
          ├─ plan is_equal_to "premium"
          └─ Condition Group (OR)
               ├─ event is_equal_to "purchase"
               └─ event is_equal_to "upgrade"

      Branch 1 "At Risk":
        Condition Group (AND)
          ├─ status is_equal_to "active"
          ├─ lastLogin is_less_than "2026-01-01"
          └─ spend is_less_than 50
```

### Example 4: Empty Fallback Branch

Create a "catch-all" branch that always matches by using `is_not_empty` on a field that is always present:

```
Webhook Trigger
  → Switch
      Branch 0 "Special": type is_equal_to "special"
      Branch 1 "Normal": type is_equal_to "normal"
      Branch 2 "Other": type exists   ← Always true if 'type' field exists
```

## Constraints

### No Built-in Fallback

The Switch node does **not** have a built-in "else" or "default" branch. If no conditions match, no output ports are activated and data stops at the Switch. To simulate a fallback, add a branch with a condition that is always true (e.g., `1 is_equal_to 1`).

### Condition Evaluation is All-or-Nothing

If **any** branch's condition throws an evaluation error, the entire Switch node errors. All branches — even those that would have matched — are skipped.

### Output Ports Based on Match

Only matching branches produce output. Downstream nodes connected to non-matching branches will not execute. Ensure all connected downstream paths handle the case where they might not receive data.

## Best Practices

### 1. Name Your Branches

Use descriptive names instead of numeric indices:

```
[Switch]                     ← Default
  ├─ 0: first branch
  ├─ 1: second branch

[Customer Router]            ← Better
  ├─ VIP Active: plan is_equal_to "premium" AND status is_equal_to "active"
  ├─ At Risk: lastLogin is_less_than "2026-01-01"
```

### 2. Keep Conditions Type-Safe

Ensure left and right values have compatible types to avoid evaluation errors:

```yaml
# ✓ Safe — both strings
left: $('Webhook Trigger').body.status
operator: string.is_equal_to
right: "active"

# ✗ Risky — comparing string to number
left: $('Webhook Trigger').body.name
operator: number.is_greater_than
right: 100
```

### 3. Add a Fallback Branch for Diagnostics

Even when you think all cases are covered, add a diagnostic branch:

```
Branch N "Unmatched": 1 is_equal_to 1
  → Log "Unexpected data: " + $json → Webhook Response (200)
```

This helps catch edge cases during development.

### 4. Document Complex Conditions

Use the node description to explain the branching logic for team members:

```yaml
nodeDescription: "Routes orders:
- Branch 0: High-value (total > $1000)
- Branch 1: Requires review (international + new customer)
- Branch 2: Standard processing (everything else via fallback)"
```

## FAQ

### Q1: How is Switch different from Conditional Branch?

**A**:

| Feature | Switch | Conditional Branch |
| --- | --- | --- |
| Branches | N branches (unlimited) | 2 branches (true/false) |
| Matching | **All** matching branches receive data | **Only first** match receives data |
| Use case | Multi-category routing, parallel processing | If/else binary decisions |
| Fallback | No built-in else (use universal condition) | Built-in else branch |

### Q2: What happens if no branches match?

**A**: No output ports are activated. Data stops at the Switch node and downstream nodes do not execute. Add a fallback branch with an always-true condition if you need to handle unmatched cases.

### Q3: Can a branch have no conditions?

**A**: No. The `conditions` field is required for the Switch node. Each branch must have at least one condition or condition group.

### Q4: Is there a limit on nesting depth for condition groups?

**A**: No hard limit. Condition groups can be nested to any depth (`ConditionGroup` → `ConditionGroup` → …). However, deeply nested conditions can be hard to read — consider using a [Code Node](/en/guide/workflow/nodes/action-nodes/code) for extremely complex logic.

### Q5: Does branch order affect which branches match?

**A**: No. All branches are evaluated independently. Order only affects the output port indices (and the execution order of downstream nodes if multiple branches match).

### Q6: Can I use expressions in condition values?

**A**: Yes. Both `left_value` and `right_value` support full [expression syntax](/en/guide/expressions/). Reference any upstream node's output.

## Next Steps

- [Conditional Branch](/en/guide/workflow/nodes/action-nodes/if) — Binary if/else routing
- [Code Node](/en/guide/workflow/nodes/action-nodes/code) — Pre-process data before branching
- [Expression Syntax](/en/guide/expressions/) — Build dynamic condition values

## Related Resources

- [Execute Sub-workflow](/en/guide/workflow/nodes/action-nodes/execute-sub-workflow) — Call sub-workflows from matched branches
- [Loop & Iterate](/en/guide/workflow/nodes/control-nodes/loop-iterate) — Iterate over data after branching
- [Webhook Response](/en/guide/workflow/nodes/action-nodes/webhook-response) — Send different responses per branch
