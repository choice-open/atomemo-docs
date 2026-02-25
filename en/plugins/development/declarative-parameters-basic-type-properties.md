# Basic Type Property Details

### 5.1 PropertyString

```typescript
interface PropertyString extends PropertyBase {
  type: "string"

  /** Constant value. Field becomes read-only when set. */
  constant?: string

  /** Default value. */
  default?: string

  /** Enum options. Use with select / radio-group. */
  enum?: string[]

  /** Maximum length. */
  max_length?: number

  /** Minimum length. */
  min_length?: number

  /** UI configuration. */
  ui?: PropertyUIString
}
```

**Available UI Components** (`PropertyUIString`):

| `component`      | Description          | Typical Use            |
| ---------------- | -------------------- | ---------------------- |
| `"input"`        | Single-line input ⭐ | Plain text             |
| `"textarea"`     | Multi-line input     | Long text, description |
| `"select"`       | Dropdown selection   | Requires `enum`        |
| `"radio-group"`  | Radio buttons        | Few options            |
| `"code-editor"`  | Code editor          | JSON/JS/Python         |
| `"emoji-picker"` | Emoji picker         | Icon selection         |
| `"color-picker"` | Color picker         | Color values           |

**Select component options**:

```typescript
{
  component: "select",
  options?: {
    searchable?: boolean;   // Enable search
  }
}
```

**Code-editor component options**:

```typescript
{
  component: "code-editor",
  options?: {
    language?: "json" | "javascript" | "python3" | "html" | "css";
    rows?: number;  // Editor row count
  }
}
```

**Example**: Basic string input

```typescript
{
  name: "url",
  type: "string",
  display_name: t("URL_DISPLAY_NAME"),
  required: true,
  ui: {
    component: "input",
    placeholder: t("URL_PLACEHOLDER")
  }
}
```

**Example**: Dropdown selection

```typescript
{
  name: "language",
  type: "string",
  display_name: t("LANGUAGE_DISPLAY_NAME"),
  enum: ["en", "zh", "ja"],
  default: "en",
  ui: { component: "select" }
}
```

### 5.2 PropertyNumber

```typescript
interface PropertyNumber extends PropertyBase {
  type: "number" | "integer"

  /** Constant value. */
  constant?: number

  /** Default value. */
  default?: number

  /** Enum options. */
  enum?: number[]

  /** Maximum value. */
  maximum?: number

  /** Minimum value. */
  minimum?: number

  /** UI configuration. */
  ui?: PropertyUINumber
}
```

**Available UI Components** (`PropertyUINumber`):

| `component`      | Description     | Typical Use     |
| ---------------- | --------------- | --------------- |
| `"number-input"` | Number input ⭐ | Plain numbers   |
| `"select"`       | Dropdown        | Requires `enum` |
| `"slider"`       | Range slider    | Range selection |

**Slider component options**:

```typescript
{
  component: "slider",
  options?: {
    min?: number;
    max?: number;
    step?: number;
  }
}
```

**Example**:

```typescript
{
  name: "timeout",
  type: "integer",
  display_name: t("TIMEOUT_DISPLAY_NAME"),
  default: 30000,
  minimum: 1000,
  maximum: 300000,
  ui: {
    component: "number-input",
    hint: t("TIMEOUT_HINT")
  }
}
```

### 5.3 PropertyBoolean

```typescript
interface PropertyBoolean extends PropertyBase {
  type: "boolean"

  /** Constant value. */
  constant?: boolean

  /** Default value. */
  default?: boolean

  /** UI configuration. */
  ui?: PropertyUIBoolean
}
```

**Available UI Components** (`PropertyUIBoolean`):

| `component` | Description | Typical Use    |
| ----------- | ----------- | -------------- |
| `"switch"`  | Toggle ⭐   | Enable/disable |

**Example**:

```typescript
{
  name: "include_raw_html",
  type: "boolean",
  display_name: t("INCLUDE_RAW_HTML_DISPLAY_NAME"),
  default: false,
  ui: { component: "switch" }
}
```
