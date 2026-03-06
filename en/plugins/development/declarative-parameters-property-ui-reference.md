# PropertyUI Component Reference

### 8.1 PropertyUICommonProps — Common UI Properties

All UI components support the following common properties:

```typescript
interface PropertyUICommonProps {
  /** Whether disabled. */
  disabled?: boolean

  /** Help hint text displayed below field. */
  hint?: I18nText

  /** Input placeholder text. */
  placeholder?: I18nText

  /** Whether read-only. */
  readonly?: boolean

  /** Whether sensitive data (value masked). */
  sensitive?: boolean

  /** Whether to support expression input. */
  support_expression?: boolean

  /** Field width. */
  width?: "small" | "medium" | "full"

  /** Indentation level (pixels). Even number, range 2-80. */
  indentation?: number

  /** Hidden but retained in DOM (CSS display:none). */
  display_none?: boolean
}
```

**Field Details**:

| Property             | Type     | Description                                              |
| -------------------- | -------- | -------------------------------------------------------- |
| `disabled`           | boolean  | Grayed out, not interactive                              |
| `hint`               | I18nText | Explanatory text below field                             |
| `placeholder`        | I18nText | Hint text inside input                                   |
| `readonly`           | boolean  | Visible but not editable                                 |
| `sensitive`          | boolean  | Value displayed as `••••••`                              |
| `support_expression` | boolean  | Allow dynamic expression input `{{xxx}}`                 |
| `width`              | string   | `"small"` ~1/3 width, `"medium"` ~1/2, `"full"` full row |
| `indentation`        | number   | Visual indentation for hierarchy representation          |
| `display_none`       | boolean  | CSS hidden, but data not cleared                         |

### 8.2 Available UI Components for String Type

| `component`           | Description          | Typical Use                       | Specific Options                                    |
| --------------------- | -------------------- | --------------------------------- | --------------------------------------------------- |
| `"input"`             | Single-line input ⭐ | Plain text parameter              | -                                                   |
| `"textarea"`          | Multi-line input     | Long text, code snippets          | `min_height`, `max_height`                          |
| `"select"`            | Dropdown selection   | Parameters requiring `enum`       | `options`, `searchable`, `clearable`                |
| `"radio-group"`       | Radio buttons        | Few options, intuitive            | `options`, `searchable`, `clearable`                |
| `"code-editor"`       | Code editor          | JSON, JavaScript, Python, Markdown | `language`, `rows`, `line_numbers`, `line_wrapping`, `min_height`, `max_height` |
| `"emoji-picker"`      | Emoji picker         | Icon/symbol selection             | `size`                                              |
| `"color-picker"`      | Color picker         | RGB/HEX color values              | -                                                   |

### 8.3 Available UI Components for Number Type

| `component`      | Description     | Typical Use                         | Specific Options                               |
| ---------------- | --------------- | ----------------------------------- | ---------------------------------------------- |
| `"number-input"` | Number input ⭐ | Plain number input                  | `step`, `suffix`                               |
| `"slider"`       | Range slider    | Visual value selection, range limit | `step`                  |

### 8.4 Available UI Components for Boolean Type

| `component` | Description | Typical Use    |
| ----------- | ----------- | -------------- |
| `"switch"`  | Toggle ⭐   | Enable/disable |

### 8.5 Available UI Components for Object Type

| `component`            | Description        | Rendering Effect                                                                     | Specific Options                     |
| ---------------------- | ------------------ | ------------------------------------------------------------------------------------ | ------------------------------------ |
| _(not set)_            | Flat render ⭐     | Child fields laid out directly                                                       | -                                    |
| `"collapsible-panel"`  | Collapsible panel  | Collapsible container                                                                | `default_collapsed`, `collapsible`, `panel_title`, `sortable` |
| `"section"`            | Section panel      | Object name with underline at top, child properties render downward with indentation | -                                    |
| `"code-editor"`        | Code editor        | Edit entire object as JSON                                                           | `language`, `rows`, `line_numbers`, `line_wrapping`   |
| `"json-schema-editor"` | JSON Schema editor | Visual schema editing                                                                | -                                    |
| `"conditions-editor"`  | Conditions editor  | Condition rule editing                                                               | -                                    |

### 8.6 Available UI Components for Array Type

| `component`                | Description      | Applicable Scenarios                       | Specific Options                             |
| -------------------------- | ---------------- | ------------------------------------------ | -------------------------------------------- |
| `"array-section"` or unset | Array panel ⭐   | Generic array editing; auto-detect mode    | -                                            |
| `"multi-select"`           | Multi-select     | Array elements as enum strings             | -                                            |
| `"tag-input"`              | Tag input        | Free text list                             | -                                            |
| `"slider"`                 | Range slider     | Numeric range [min, max]                   | `step`   |
| `"key-value-editor"`       | Key-value editor | Array elements as `{ key, value }` objects | -                                            |

### 8.7 Available UI Components for CredentialId Type

| `component`                  | Description                                           |
| ---------------------------- | ----------------------------------------------------- |
| `"credential-select"` ⭐only | Credential selector dropdown with list and new button |
