# Resource Mapper

`PropertyResourceMapper` lets users map a remote resource's field schema to custom values. It supports two modes: **manual mode** (a dynamic form where each field gets a typed input, with the field list fetched live from an API) and **auto mode** (a free-form JSON editor with expression support for programmatic mapping).

### PropertyResourceMapper

```typescript
interface PropertyResourceMapper extends PropertyBase {
  type: "resource_mapper"

  /** Name of the method in resource_mapping used to fetch available fields. */
  mapping_method: string

  /** Default value. */
  default?: ResourceMapperValue | null
}
```

| Field | Type | Description |
| ----- | ---- | ----------- |
| `type` | `"resource_mapper"` | Property type identifier |
| `mapping_method` | `string` | References a method in `ToolDefinition.resource_mapping` |
| `default` | `ResourceMapperValue` | Optional default value |

> [!NOTE]
> `resource_mapper` is only supported in **Tool** parameters.

---

### ResourceMapperValue

The value stored at runtime for a `resource_mapper` parameter:

```typescript
interface ResourceMapperValue {
  __type__: "resource_mapper"

  /** The mode that was active when this value was set. */
  mapping_mode: "manual" | "auto"

  /**
   * Manual mode: Record<fieldId, fieldValue> — one entry per mapped field.
   * Auto mode: a JSON object or a string (an expression or input that could not be parsed as an object).
   */
  value: Record<string, unknown> | string | null
}
```

---

### ResourceMapperSchemaField

The structure of each field returned by a `resource_mapping` callback:

```typescript
interface ResourceMapperSchemaField {
  /** Unique field identifier, used as the key in the mapped value. */
  id: string

  /** Human-readable label shown in the UI; falls back to id if not set. */
  display_name?: I18nText | null

  /** Field value type — determines which input component is rendered in manual mode. */
  type: "string" | "number" | "integer" | "boolean" | "object" | "array"

  /** Whether the field is required. Required fields cannot be removed in manual mode. */
  required?: boolean | null
}
```

---

### resource_mapping Callback

Implement a method in `ToolDefinition.resource_mapping` whose key matches `mapping_method`. This function is called when the mapper mounts and whenever an upstream parameter referenced by `depends_on` changes:

```typescript
type ToolResourceMappingFunction = (input: {
  args: {
    /** Current tool parameters, used to query the target resource's schema. */
    parameters: Record<string, unknown>
    credentials: Record<string, InputArgsCredential>
  }
}) => Promise<{
  /** List of available fields the user can map. */
  fields: Array<ResourceMapperSchemaField>
  /** Optional message shown when the field list is empty. */
  empty_fields_notice?: I18nText | null
}>
```

Register the function in `ToolDefinition.resource_mapping`:

```typescript
const myTool: ToolDefinition = {
  name: "my-tool",
  parameters: [ /* ... */ ],
  resource_mapping: {
    map_record_fields: async ({ args }) => {
      const token = args.credentials["my-credential"].api_key
      const tableId = extractResourceLocator(args.parameters.table)
      if (!tableId) {
        return {
          fields: [],
          empty_fields_notice: { en_US: "Select a table first.", zh_Hans: "请先选择一张表。" },
        }
      }
      const schema = await apiClient.getTableSchema(token, tableId)
      return {
        fields: schema.columns.map(col => ({
          id: col.id,
          display_name: { en_US: col.name },
          type: col.dataType,
          required: col.required,
        })),
      }
    },
  },
  invoke: async ({ args }) => { /* ... */ },
}
```

---

### depends_on Cascading

> [!IMPORTANT]
> When the available fields depend on another parameter (e.g., columns of a selected table), always declare `depends_on` on the mapper. This causes the UI to re-fetch the field schema and reset the mapping when the referenced parameter changes.

```typescript
const fieldsParam: PropertyResourceMapper = {
  name: "fields",
  type: "resource_mapper",
  display_name: { en_US: "Fields", zh_Hans: "字段" },
  required: true,
  depends_on: ["workspace", "table"],  // Re-fetch when either changes
  mapping_method: "map_record_fields",
}
```

Read upstream parameters from `parameters` in the `resource_mapping` callback to determine which schema to query:

```typescript
resource_mapping: {
  map_record_fields: async ({ args }) => {
    const tableId = extractResourceLocator(args.parameters.table)
    if (!tableId) return { fields: [], empty_fields_notice: { en_US: "Select a table first.", zh_Hans: "请先选择一张表。" } }
    // Fetch and return the schema for that table
  },
},
```

---

### Using extractResourceMapper

The SDK provides a helper to extract the field mapping object from a `ResourceMapperValue`:

```typescript
import { extractResourceMapper } from "@choiceopen/atomemo-plugin-sdk-js"

invoke: async ({ args }) => {
  const { parameters } = args

  // Returns Record<string, unknown> | null
  const fieldValues = extractResourceMapper(parameters.fields)

  if (fieldValues) {
    // { "name": "Alice", "age": 30, "active": true }
    await apiClient.createRecord(fieldValues)
  }
}
```

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `value` | `unknown` | Raw parameter value (validated internally via Zod) |

Returns `Record<string, unknown> | null`. Throws an error when:

- The value fails schema validation
- The value is a plain string (a string in `ResourceMapperValue.value` represents an expression or input that could not be parsed as an object — if the tool receives a string, the expression was not successfully evaluated to an object, or the editor input was an invalid JSON object)

---

### UI Behavior

The field renders as a block with a **mapping mode** selector:

#### Manual Mode

1. The UI calls `resource_mapping` on mount (and when any `depends_on` parameter changes) to load available fields.
2. Each field renders as a typed input row with a remove button (×):

   | Field type | Input component |
   | ---------- | --------------- |
   | `string` | Text input |
   | `number` / `integer` | Number input |
   | `boolean` | Toggle switch |
   | `object` / `array` | JSON code editor |

3. Required fields cannot be removed.
4. An **Add Field** dropdown lists all optional fields that have been removed, allowing the user to restore them.
5. If no fields are available, the `empty_fields_notice` returned by the callback is displayed.

#### Auto Mode

Renders a JSON code editor with expression input enabled (`support_expression` is always on). The user provides the complete mapping as a JSON object or an expression string.
