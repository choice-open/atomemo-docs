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
| `"code-editor"`  | Code editor          | JSON/JS/Python/Markdown |
| `"emoji-picker"` | Emoji picker         | Icon selection         |
| `"color-picker"` | Color picker         | Color values           |

**Select component options**:

```typescript
{
  component: "select",
  searchable?: boolean;   // Enable search
  clearable?: boolean;    // Show clear button
  options?: Array<PropertyUIOption>;  // Custom options with icons and labels
}
```

**PropertyUIOption structure**:

```typescript
interface PropertyUIOption {
  icon?: string;           // Optional icon identifier
  label: I18nText;         // Display label (supports i18n)
  value: string | number | boolean;  // Option value
}
```

**Code-editor component options**:

```typescript
{
  component: "code-editor",
  language?: "json" | "javascript" | "python3" | "markdown";
  rows?: number;          // Editor row count
  line_numbers?: boolean; // Show line numbers
  line_wrapping?: boolean; // Enable line wrapping
}
```

**Example**: Basic string input

```typescript
{
  name: "url",
  type: "string",
  display_name: { en_US: "URL" },
  required: true,
  ui: {
    component: "input",
    placeholder: { en_US: "https://example.com" }
  }
}
```

**Example**: Dropdown selection

```typescript
{
  name: "language",
  type: "string",
  display_name: { en_US: "Language" },
  enum: ["en", "zh", "ja"],
  default: "en",
  ui: {
    component: "select",
    options: [
      { label: { en_US: "English" }, value: "en" },
      { label: { en_US: "Chinese" }, value: "zh" },
      { label: { en_US: "Japanese" }, value: "ja" },
    ],
  }
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
| `"slider"`       | Range slider    | Range selection |

**Slider component options**:

```typescript
{
  component: "slider",
  step?: number;  // Step increment
}
```

**Example**:

```typescript
{
  name: "timeout",
  type: "integer",
  display_name: { en_US: "Timeout" },
  default: 30000,
  minimum: 1000,
  maximum: 300000,
  ui: {
    component: "number-input",
    hint: { en_US: "Timeout in milliseconds" }
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
  display_name: { en_US: "Include Raw HTML" },
  default: false,
  ui: { component: "switch" }
}
```
