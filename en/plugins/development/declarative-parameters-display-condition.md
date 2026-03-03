# DisplayCondition — Conditional Show/Hide

`DisplayCondition` uses MongoDB-like query syntax to control parameter visibility based on **value of sibling fields**.

### Basic Syntax

```typescript
interface PropertyBase {
  display?: {
    show?: DisplayCondition // Show when condition true
    hide?: DisplayCondition // Hide when condition true
  }
}
```

- Both `show` and `hide` can coexist. `show` is evaluated first, then `hide`.
- Parameters are visible by default. With `show` set, only visible when condition is met.

### Condition Operators

```typescript
type FilterOperators = {
  $eq?: any // Equal to
  $ne?: any // Not equal to
  $gt?: number // Greater than
  $gte?: number // Greater than or equal
  $lt?: number // Less than
  $lte?: number // Less than or equal
  $in?: any[] // In array
  $nin?: any[] // Not in array
  $exists?: boolean // Field exists
  $regex?: string // Regex match
  $options?: string // Regex options (e.g., "i" case-insensitive)
  $mod?: [number, number] // Modulo [divisor, remainder]
  $size?: number // Array length
}
```

### Logical Operators

```typescript
type DisplayCondition = {
  // Field-level matching — key is field name, value is match condition
  [fieldName: string]: any | FilterOperators

  // Logical combinations
  $and?: DisplayCondition[] // All must be true
  $or?: DisplayCondition[] // Any can be true
  $nor?: DisplayCondition[] // None must be true
}
```

### Matching Rules

| Syntax                             | Meaning                    |
| ---------------------------------- | -------------------------- |
| `{ "field": "value" }`             | `field === "value"`        |
| `{ "field": { $eq: "value" } }`    | `field === "value"`        |
| `{ "field": { $ne: "value" } }`    | `field !== "value"`        |
| `{ "field": { $in: ["a", "b"] } }` | `field` is "a" or "b"      |
| `{ "field": { $exists: true } }`   | `field` is set             |
| `{ "field": { $gt: 10 } }`         | `field > 10`               |
| `{ "a.b.c": "value" }`             | Support nested path access |

### Examples

**Scenario 1**: Show `schema` when `format` is `"json"`

```typescript
{
  name: "schema",
  type: "string",
  display: {
    show: { format: { $eq: "json" } }
  },
  ui: { component: "code-editor", language: "json" }
}
```

**Scenario 2**: Show link-related options when `include_links` is `true`

```typescript
{
  name: "link_selector",
  type: "string",
  display: {
    show: { include_links: { $eq: true } }
  }
}
```

**Scenario 3**: Complex condition — format is markdown AND headers enabled

```typescript
{
  name: "header_level",
  type: "integer",
  display: {
    show: {
      $and: [
        { format: "markdown" },
        { include_headers: true }
      ]
    }
  }
}
```

**Scenario 4**: Multi-value match — format is html or markdown

```typescript
{
  name: "css_selector",
  type: "string",
  display: {
    show: { format: { $in: ["html", "markdown"] } }
  }
}
```

