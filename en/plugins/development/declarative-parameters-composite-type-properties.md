# Composite Type Property Details

### 6.1 PropertyObject

Used to define nested parameter groups.

```typescript
interface PropertyObject extends PropertyBase {
  type: "object"

  /** Ordered list of child properties. */
  properties: Property[]

  /**
   * Schema for additional properties beyond those defined in `properties`.
   * Supports dynamic keys with values conforming to the specified property schema.
   */
  additional_properties?: Property | PropertyDiscriminatedUnion

  /** UI configuration. */
  ui?: PropertyUIObject
}
```

**Available UI Components** (`PropertyUIObject`):

| `component`            | Description        | Rendering Effect                 |
| ---------------------- | ------------------ | -------------------------------- |
| _(not set)_            | Flat render ⭐     | Child fields laid out directly   |
| `"collapsible-panel"`  | Collapsible panel  | Collapsible container with title |
| `"section"`            | Section panel      | Partitioned with header/footer   |
| `"code-editor"`        | Code editor        | Edit entire object as JSON       |
| `"json-schema-editor"` | JSON Schema editor | Visual schema editing            |
| `"conditions-editor"`  | Conditions editor  | Condition rule editing           |

**Collapsible-panel options**:

```typescript
{
  component: "collapsible-panel",
  default_collapsed?: boolean;  // Whether to collapse by default
  collapsible?: boolean;        // Whether the panel can be toggled
  panel_title?: I18nText;       // Optional panel title
  sortable?: boolean;           // Whether items can be reordered
}
```

**Section options**:

```typescript
{
  component: "section"
}
```

> **Note**: When using `section`, object name with underline is displayed at the top, and child properties are rendered from top to bottom with indentation.

**Example**: Collapsible panel

```typescript
{
  name: "advanced_options",
  type: "object",
  display_name: { en_US: "Advanced Options" },
  ui: {
    component: "collapsible-panel",
    default_collapsed: true
  },
  properties: [
    {
      name: "retry_count",
      type: "integer",
      display_name: { en_US: "Retry Count" },
      default: 3
    },
    {
      name: "timeout",
      type: "integer",
      display_name: { en_US: "Timeout" },
      default: 30000
    }
  ]
}
```

**Example**: Object with additional key-value pairs (e.g., HTTP Headers)

```typescript
{
  name: "headers",
  type: "object",
  display_name: { en_US: "Headers" },
  additional_properties: { name: "value", type: "string" },
  properties: []
}
```

### 6.2 PropertyArray

Used to define list/multi-select type parameters.

```typescript
interface PropertyArray extends PropertyBase {
  type: "array"

  /** Type definition for array elements. */
  items: Property | PropertyDiscriminatedUnion

  /** Maximum number of items. */
  max_items?: number

  /** Minimum number of items. */
  min_items?: number

  /** UI configuration. */
  ui?: PropertyUIArray
}
```

**Available UI Components** (`PropertyUIArray`):

| `component`                      | Description      | Typical Use                    |
| -------------------------------- | ---------------- | ------------------------------ |
| _(not set)_ or `"array-section"` | Array panel ⭐   | Generic array editing          |
| `"multi-select"`                 | Multi-select     | Enum string elements           |
| `"tag-input"`                    | Tag input        | Free text list                 |
| `"slider"`                       | Range slider     | Numeric range [min, max]       |
| `"key-value-editor"`             | Key-value editor | { key, value } object elements |

**Array-section rendering logic**:

- If `items` is basic type (string/number/boolean) → Simple list (one input per row + delete button)
- If `items` is object → Compound list (each item as collapsible panel)

**Multi-select component** — requires `items` to have `enum`:

```typescript
{
  name: "formats",
  type: "array",
  display_name: { en_US: "Formats" },
  items: {
    name: "format",
    type: "string",
    enum: ["markdown", "html", "plaintext"]
  },
  ui: { component: "multi-select" }
}
```

**Tag-input component**:

```typescript
{
  name: "tags",
  type: "array",
  display_name: { en_US: "Tags" },
  items: { name: "tag", type: "string" },
  ui: { component: "tag-input" }
}
```

**Key-value-editor component**:

```typescript
{
  name: "query_params",
  type: "array",
  display_name: { en_US: "Query Parameters" },
  items: {
    name: "param",
    type: "object",
    properties: [
      { name: "key", type: "string" },
      { name: "value", type: "string" }
    ]
  },
  ui: { component: "key-value-editor" }
}
```

**Compound array (items as objects)**:

```typescript
{
  name: "actions",
  type: "array",
  display_name: { en_US: "Actions" },
  items: {
    name: "action",
    type: "object",
    properties: [
      {
        name: "type",
        type: "string",
        display_name: { en_US: "Type" },
        enum: ["click", "scroll", "wait"],
        ui: {
          component: "select",
          options: [
            { label: { en_US: "Click" }, value: "click" },
            { label: { en_US: "Scroll" }, value: "scroll" },
            { label: { en_US: "Wait" }, value: "wait" },
          ],
        }
      },
      {
        name: "selector",
        type: "string",
        display_name: { en_US: "Selector" }
      }
    ]
  }
}
```

### 6.3 PropertyDiscriminatedUnion

Switch between different parameter sets based on a "discriminator field" value. This is the most powerful combination pattern.

```typescript
interface PropertyDiscriminatedUnion extends PropertyBase {
  type: "discriminated_union"

  /** Discriminator field name — must exist with same name in each any_of variant. */
  discriminator: string

  /** All possible variants (each variant is a PropertyObject). */
  any_of: PropertyObject[]

  /** UI component for discriminator field. */
  discriminator_ui?: {
    component: "select" | "switch" | "radio-group"
  }
}
```

**How it works**:

1. System extracts `constant` value of the `discriminator` field from each variant
2. Generates a selector (default `select`, can be `switch`/`radio-group`)
3. When user selects, displays remaining fields of corresponding variant

**Example**: Select different parameters based on format

```typescript
{
  name: "output_config",
  type: "discriminated_union",
  display_name: { en_US: "Output Config" },
  discriminator: "format",
  discriminator_ui: { component: "select" },
  any_of: [
    {
      name: "markdown_option",
      type: "object",
      properties: [
        {
          name: "format",
          type: "string",
          constant: "markdown",
          display_name: { en_US: "Markdown" }
        },
        {
          name: "include_toc",
          type: "boolean",
          display_name: { en_US: "Include Table of Contents" },
          default: false
        }
      ]
    },
    {
      name: "json_option",
      type: "object",
      properties: [
        {
          name: "format",
          type: "string",
          constant: "json",
          display_name: { en_US: "JSON" }
        },
        {
          name: "schema",
          type: "object",
          display_name: { en_US: "Schema" },
          ui: { component: "code-editor", language: "json" },
          properties: []
        }
      ]
    }
  ]
}
```

> **Key**: Each variant (object in `any_of`) must contain a field with the same name as `discriminator`, and that field must set a `constant` value as the discriminator basis.

