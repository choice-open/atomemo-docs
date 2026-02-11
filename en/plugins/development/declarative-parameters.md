# Plugin Parameter Declarative Definition Reference

> **Plugin Property & Property-UI Reference**
>
> This documentation is for Atomemo plugin developers and provides a comprehensive reference for **Property** (plugin parameters) and **PropertyUI** (parameter UI components).
> After reading this document, you will be able to use declarative configuration to define tool parameter interfaces ranging from simple to complex.

---

## Table of Contents

- [Plugin Parameter Declarative Definition Reference](#plugin-parameter-declarative-definition-reference)
  - [Table of Contents](#table-of-contents)
  - [1. Overview and Core Concepts](#1-overview-and-core-concepts)
  - [2. I18nText — Internationalized Text](#2-i18ntext--internationalized-text)
  - [3. Property Type Overview](#3-property-type-overview)
  - [4. PropertyBase — Common Base Fields](#4-propertybase--common-base-fields)
  - [5. Basic Type Property Details](#5-basic-type-property-details)
    - [5.1 PropertyString](#51-propertystring)
    - [5.2 PropertyNumber](#52-propertynumber)
    - [5.3 PropertyBoolean](#53-propertyboolean)
  - [6. Composite Type Property Details](#6-composite-type-property-details)
    - [6.1 PropertyObject](#61-propertyobject)
    - [6.2 PropertyArray](#62-propertyarray)
    - [6.3 PropertyDiscriminatedUnion](#63-propertydiscriminatedunion)
  - [7. Special Type Properties](#7-special-type-properties)
    - [7.1 PropertyCredentialId](#71-propertycredentialid)
    - [7.2 PropertyEncryptedString](#72-propertyencryptedstring)
  - [8. PropertyUI Component Reference](#8-propertyui-component-reference)
    - [8.1 PropertyUICommonProps — Common UI Properties](#81-propertyuicommonprops--common-ui-properties)
    - [8.2 Available UI Components for String Type](#82-available-ui-components-for-string-type)
    - [8.3 Available UI Components for Number Type](#83-available-ui-components-for-number-type)
    - [8.4 Available UI Components for Boolean Type](#84-available-ui-components-for-boolean-type)
    - [8.5 Available UI Components for Object Type](#85-available-ui-components-for-object-type)
    - [8.6 Available UI Components for Array Type](#86-available-ui-components-for-array-type)
    - [8.7 Available UI Components for CredentialId Type](#87-available-ui-components-for-credentialid-type)
  - [9. DisplayCondition — Conditional Show/Hide](#9-displaycondition--conditional-showhide)
    - [Basic Syntax](#basic-syntax)
    - [Condition Operators](#condition-operators)
    - [Logical Operators](#logical-operators)
    - [Matching Rules](#matching-rules)
    - [Examples](#examples)
  - [10. Practical Examples](#10-practical-examples)
    - [10.1 Basic: String Parameter](#101-basic-string-parameter)
    - [10.2 Enum Dropdown Selection](#102-enum-dropdown-selection)
    - [10.3 Nested Object + Collapsible Panel](#103-nested-object--collapsible-panel)
    - [10.4 Array + Key-Value Editor](#104-array--key-value-editor)
    - [10.5 Discriminated Union — Switch Parameters by Selection](#105-discriminated-union--switch-parameters-by-selection)
    - [10.6 Conditional Display: Linked Parameters](#106-conditional-display-linked-parameters)
    - [10.7 Credential Parameters](#107-credential-parameters)
    - [10.8 Complete Tool Definition Example](#108-complete-tool-definition-example)
  - [11. Advanced Patterns and Best Practices](#11-advanced-patterns-and-best-practices)
    - [Shared Parameters Pattern](#shared-parameters-pattern)
    - [Expression Support](#expression-support)
    - [Constant Fields](#constant-fields)
    - [Nested Discriminated Union](#nested-discriminated-union)
    - [Array Elements as Discriminated Union](#array-elements-as-discriminated-union)
    - [Section UI Layout](#section-ui-layout)
  - [12. Default UI Behavior](#12-default-ui-behavior)
    - [Array Section Auto Mode Selection](#array-section-auto-mode-selection)

---

## 1. Overview and Core Concepts

The Atomemo plugin system uses a **declarative** approach to define tool parameters. You only need to write a JSON/TypeScript configuration object, and the system will automatically render the corresponding form UI.

```
┌─────────────────────────────────────────────┐
│              Tool Definition                │
│  ┌───────────────────────────────────────┐  │
│  │  parameters: Property[]               │  │
│  │  ┌─────────────────────────────────┐  │  │
│  │  │  Property                       │  │  │
│  │  │  ├── name            (identifier) │  │
│  │  │  ├── type            (data type)  │  │
│  │  │  ├── display_name    (display)    │  │
│  │  │  ├── required        (required)   │  │
│  │  │  ├── display         (visibility) │  │
│  │  │  ├── ui              (UI component)│ │
│  │  │  └── ...type-specific fields    │  │  │
│  │  └─────────────────────────────────┘  │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

**Core Relationships**:

| Concept            | Responsibility                                                | Analogy                |
| ------------------ | ------------------------------------------------------------- | ---------------------- |
| `Property`         | Define parameter **data model** — type, constraints, defaults | JSON Schema            |
| `PropertyUI`       | Define parameter **rendering method** — component, style      | UI Hint                |
| `DisplayCondition` | Define parameter **visibility** — when to show/hide           | Conditional expression |

A `Property` determines its data type via `type` and specifies rendering component via `ui`. **Different `type` values support different `ui` components.**

---

## 2. I18nText — Internationalized Text

All user-facing text (display names, hints, placeholders, etc.) uses the `I18nText` type:

```typescript
type I18nText = {
  en_US: string // English (required)
  zh_Hans?: string // Simplified Chinese (optional)
  [locale: string]: string // Other languages
}
```

**Example**:

```typescript
{
  display_name: {
    en_US: "API Key",
    zh_Hans: "API 密钥"
  }
}
```

> **Rule**: `en_US` is always required. When the current language is not provided, it falls back to `en_US`.

---

## 3. Property Type Overview

| `type` Value            | TypeScript Type              | Description          | Default UI                  |
| ----------------------- | ---------------------------- | -------------------- | --------------------------- |
| `"string"`              | `PropertyString`             | String               | `input` (single-line input) |
| `"number"`              | `PropertyNumber`             | Number (decimal)     | `number-input`              |
| `"integer"`             | `PropertyNumber`             | Integer              | `number-input`              |
| `"boolean"`             | `PropertyBoolean`            | Boolean              | `switch`                    |
| `"object"`              | `PropertyObject`             | Nested object        | Flat child fields           |
| `"array"`               | `PropertyArray`              | Array                | `array-section` (panel)     |
| `"credential_id"`       | `PropertyCredentialId`       | Credential reference | `credential-select`         |
| `"encrypted_string"`    | `PropertyEncryptedString`    | Encrypted string     | `encrypted-input`           |
| `"discriminated_union"` | `PropertyDiscriminatedUnion` | Discriminated union  | Selector + variant panel    |

---

## 4. PropertyBase — Common Base Fields

All Property types share the following base fields:

```typescript
interface PropertyBase {
  /** Required. Unique identifier for the parameter, used for data access. */
  name: string

  /** Optional. Label name displayed in the form. */
  display_name?: I18nText

  /** Optional. Whether the parameter is required. Default: false. */
  required?: boolean

  /** Optional. Conditional show/hide rules. */
  display?: {
    show?: DisplayCondition // Show when condition is true
    hide?: DisplayCondition // Hide when condition is true
  }

  /** Optional. AI-related configuration. */
  ai?: {
    /** Parameter description for LLM, helping AI understand parameter purpose. */
    llm_description?: string
  }

  /** Optional. UI component configuration. Different types support different UI components. */
  ui?: PropertyUI
}
```

**Field Description**:

| Field          | Required | Description                                                                         |
| -------------- | -------- | ----------------------------------------------------------------------------------- |
| `name`         | ✅       | Parameter path identifier. Only alphanumeric and underscore.                        |
| `display_name` | ❌       | Form label. Uses humanized `name` if not provided.                                  |
| `required`     | ❌       | Mark as required; form will show required indicator.                                |
| `display`      | ❌       | Conditional visibility. See [Section 9](#9-displaycondition--conditional-showhide). |
| `ai`           | ❌       | Parameter description when AI Agent calls tool.                                     |
| `ui`           | ❌       | Uses type's default UI component if not provided.                                   |

---

## 5. Basic Type Property Details

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

---

## 6. Composite Type Property Details

### 6.1 PropertyObject

Used to define nested parameter groups.

```typescript
interface PropertyObject extends PropertyBase {
  type: "object"

  /** Ordered list of child properties. */
  properties: Property[]

  /** Whether to allow users to add additional key-value pairs. */
  additional_properties?: boolean

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
  options?: {
    collapsed?: boolean;  // Collapse by default
  }
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
  display_name: t("ADVANCED_OPTIONS_DISPLAY_NAME"),
  ui: {
    component: "collapsible-panel",
    options: { collapsed: true }
  },
  properties: [
    {
      name: "retry_count",
      type: "integer",
      display_name: t("RETRY_COUNT_DISPLAY_NAME"),
      default: 3
    },
    {
      name: "timeout",
      type: "integer",
      display_name: t("TIMEOUT_DISPLAY_NAME"),
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
  display_name: t("HEADERS_DISPLAY_NAME"),
  additional_properties: true,
  properties: []
}
```

### 6.2 PropertyArray

Used to define list/multi-select type parameters.

```typescript
interface PropertyArray extends PropertyBase {
  type: "array"

  /** Type definition for array elements. */
  items: Property

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
  display_name: t("FORMATS_DISPLAY_NAME"),
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
  display_name: t("TAGS_DISPLAY_NAME"),
  items: { name: "tag", type: "string" },
  ui: { component: "tag-input" }
}
```

**Key-value-editor component**:

```typescript
{
  name: "query_params",
  type: "array",
  display_name: t("QUERY_PARAMS_DISPLAY_NAME"),
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
  display_name: t("ACTIONS_DISPLAY_NAME"),
  items: {
    name: "action",
    type: "object",
    properties: [
      {
        name: "type",
        type: "string",
        display_name: t("TYPE_DISPLAY_NAME"),
        enum: ["click", "scroll", "wait"],
        ui: { component: "select" }
      },
      {
        name: "selector",
        type: "string",
        display_name: t("SELECTOR_DISPLAY_NAME")
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
  display_name: t("OUTPUT_CONFIG_DISPLAY_NAME"),
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
          display_name: t("MARKDOWN_LABEL")
        },
        {
          name: "include_toc",
          type: "boolean",
          display_name: t("INCLUDE_TOC_DISPLAY_NAME"),
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
          display_name: t("JSON_LABEL")
        },
        {
          name: "schema",
          type: "object",
          display_name: t("SCHEMA_DISPLAY_NAME"),
          ui: { component: "code-editor", options: { language: "json" } },
          properties: []
        }
      ]
    }
  ]
}
```

> **Key**: Each variant (object in `any_of`) must contain a field with the same name as `discriminator`, and that field must set a `constant` value as the discriminator basis.

---

## 7. Special Type Properties

### 7.1 PropertyCredentialId

Reference to pre-configured external service credentials.

```typescript
interface PropertyCredentialId extends PropertyBase {
  type: "credential_id"

  /** Credential type name. System filters available credentials by this type. */
  credential_name: string

  /** UI configuration. */
  ui?: PropertyUICredentialId
}
```

Renders as a credential selector dropdown containing:

- List of available credentials (filtered by `credential_name`)
- "New Credential" button
- Prompt when not configured

**Example**:

```typescript
{
  name: "credential_id",
  type: "credential_id",
  display_name: t("CREDENTIAL_DISPLAY_NAME"),
  credential_name: "firecrawl",
  required: true
}
```

### 7.2 PropertyEncryptedString

For storing sensitive information (passwords, tokens, etc.), automatically masked on input.

```typescript
interface PropertyEncryptedString extends PropertyBase {
  type: "encrypted_string"
}
```

Renders as a password input field (`encrypted-input`), encrypted when stored.

---

## 8. PropertyUI Component Reference

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

| `component`      | Description          | Typical Use                 | Specific Options                     |
| ---------------- | -------------------- | --------------------------- | ------------------------------------ |
| `"input"`        | Single-line input ⭐ | Plain text parameter        | -                                    |
| `"textarea"`     | Multi-line input     | Long text, code snippets    | -                                    |
| `"select"`       | Dropdown selection   | Parameters requiring `enum` | `{ searchable: boolean }`            |
| `"radio-group"`  | Radio buttons        | Few options, intuitive      | -                                    |
| `"code-editor"`  | Code editor          | JSON, JavaScript, Python    | `{ language: string; rows: number }` |
| `"emoji-picker"` | Emoji picker         | Icon/symbol selection       | -                                    |
| `"color-picker"` | Color picker         | RGB/HEX color values        | -                                    |

### 8.3 Available UI Components for Number Type

| `component`      | Description     | Typical Use                         | Specific Options                             |
| ---------------- | --------------- | ----------------------------------- | -------------------------------------------- |
| `"number-input"` | Number input ⭐ | Plain number input                  | -                                            |
| `"select"`       | Dropdown        | Numeric options with `enum`         | -                                            |
| `"slider"`       | Range slider    | Visual value selection, range limit | `{ min: number; max: number; step: number }` |

### 8.4 Available UI Components for Boolean Type

| `component` | Description | Typical Use    |
| ----------- | ----------- | -------------- |
| `"switch"`  | Toggle ⭐   | Enable/disable |

### 8.5 Available UI Components for Object Type

| `component`            | Description        | Rendering Effect                                                                     | Specific Options                     |
| ---------------------- | ------------------ | ------------------------------------------------------------------------------------ | ------------------------------------ |
| _(not set)_            | Flat render ⭐     | Child fields laid out directly                                                       | -                                    |
| `"collapsible-panel"`  | Collapsible panel  | Collapsible container                                                                | `{ collapsed: boolean }`             |
| `"section"`            | Section panel      | Object name with underline at top, child properties render downward with indentation | -                                    |
| `"code-editor"`        | Code editor        | Edit entire object as JSON                                                           | `{ language: string; rows: number }` |
| `"json-schema-editor"` | JSON Schema editor | Visual schema editing                                                                | -                                    |
| `"conditions-editor"`  | Conditions editor  | Condition rule editing                                                               | -                                    |

### 8.6 Available UI Components for Array Type

| `component`                | Description      | Applicable Scenarios                       | Specific Options                             |
| -------------------------- | ---------------- | ------------------------------------------ | -------------------------------------------- |
| `"array-section"` or unset | Array panel ⭐   | Generic array editing; auto-detect mode    | -                                            |
| `"multi-select"`           | Multi-select     | Array elements as enum strings             | -                                            |
| `"tag-input"`              | Tag input        | Free text list                             | -                                            |
| `"slider"`                 | Range slider     | Numeric range [min, max]                   | `{ min: number; max: number; step: number }` |
| `"key-value-editor"`       | Key-value editor | Array elements as `{ key, value }` objects | -                                            |

### 8.7 Available UI Components for CredentialId Type

| `component`                  | Description                                           |
| ---------------------------- | ----------------------------------------------------- |
| `"credential-select"` ⭐only | Credential selector dropdown with list and new button |

---

## 9. DisplayCondition — Conditional Show/Hide

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
  ui: { component: "code-editor", options: { language: "json" } }
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

---

## 10. Practical Examples

### 10.1 Basic: String Parameter

```typescript
const urlParameter: PropertyString = {
  name: "url",
  type: "string",
  display_name: t("URL_DISPLAY_NAME"),
  required: true,
  ui: {
    component: "input",
    placeholder: t("URL_PLACEHOLDER"),
    hint: t("URL_HINT"),
  },
}
```

**User input example and corresponding invoke parameters**:

```typescript
// User enters URL
const params = {
  url: "https://example.com",
}

// tool.invoke({ args }) receives the parameters
invoke: async ({ args }) => {
  const { parameters } = args
  console.log(parameters.url) // "https://example.com"
  // Use parameters.url to call API
  return { success: true, content: "..." }
}
```

### 10.2 Enum Dropdown Selection

```typescript
const formatParameter: PropertyString = {
  name: "format",
  type: "string",
  display_name: t("FORMAT_DISPLAY_NAME"),
  enum: ["markdown", "html", "rawHtml", "screenshot", "links"],
  default: "markdown",
  ui: {
    component: "select",
    options: { searchable: true },
  },
}
```

**User selection example and corresponding invoke parameters**:

```typescript
// User selects "html" from dropdown
const params = {
  format: "html",
}

// invoke receives the parameters
invoke: async ({ args }) => {
  const { parameters } = args
  switch (parameters.format) {
    case "markdown":
      return { content: "# Title\n..." }
    case "html":
      return { content: "<h1>Title</h1>..." }
    case "screenshot":
      return { content: "base64://..." }
    default:
      return { content: "" }
  }
}
```

### 10.3 Nested Object + Collapsible Panel

```typescript
const locationParameter: PropertyObject = {
  name: "location",
  type: "object",
  display_name: t("LOCATION_DISPLAY_NAME"),
  ui: {
    component: "collapsible-panel",
    options: { collapsed: true },
  },
  properties: [
    {
      name: "country",
      type: "string",
      display_name: t("COUNTRY_DISPLAY_NAME"),
      default: "US",
      ui: { component: "select" },
      enum: ["US", "CN", "JP"],
    },
    {
      name: "languages",
      type: "array",
      display_name: t("LANGUAGES_DISPLAY_NAME"),
      items: { name: "lang", type: "string" },
      ui: { component: "tag-input" },
    },
  ],
}
```

**User input example and corresponding invoke parameters**:

```typescript
// User expands collapsible panel, selects country and enters language tags
const params = {
  location: {
    country: "CN",
    languages: ["Mandarin", "Cantonese", "English"],
  },
}

// invoke receives nested object
invoke: async ({ args }) => {
  const { parameters } = args
  const { country, languages } = parameters.location
  console.log(country) // "CN"
  console.log(languages) // ["Mandarin", "Cantonese", "English"]
  return { success: true }
}
```

### 10.4 Array + Key-Value Editor

```typescript
const headersParameter: PropertyArray = {
  name: "headers",
  type: "array",
  display_name: t("HEADERS_DISPLAY_NAME"),
  items: {
    name: "header",
    type: "object",
    properties: [
      {
        name: "key",
        type: "string",
        display_name: t("KEY_DISPLAY_NAME"),
      },
      {
        name: "value",
        type: "string",
        display_name: t("VALUE_DISPLAY_NAME"),
      },
    ],
  },
  ui: { component: "key-value-editor" },
}
```

**User adds key-value pairs example and corresponding invoke parameters**:

```typescript
// User adds multiple HTTP Headers in key-value editor
const params = {
  headers: [
    { key: "Authorization", value: "Bearer token123" },
    { key: "Content-Type", value: "application/json" },
    { key: "User-Agent", value: "MyApp/1.0" },
  ],
}

// invoke processes array
invoke: async ({ args }) => {
  const { parameters } = args
  const headerObject = {}
  parameters.headers.forEach((h) => {
    headerObject[h.key] = h.value
  })
  // headerObject = { Authorization: "Bearer token123", ... }
  const response = await fetch(url, { headers: headerObject })
  return { success: true }
}
```

### 10.5 Discriminated Union — Switch Parameters by Selection

A complete real-world scenario: display different configurations based on scrape format.

```typescript
const formatsParameter: PropertyDiscriminatedUnion = {
  name: "output",
  type: "discriminated_union",
  display_name: t("OUTPUT_DISPLAY_NAME"),
  discriminator: "type",
  discriminator_ui: { component: "select" },
  any_of: [
    // Variant 1: Markdown
    {
      name: "markdown_variant",
      type: "object",
      properties: [
        {
          name: "type",
          type: "string",
          constant: "markdown",
          display_name: t("MARKDOWN_LABEL"),
        },
        // Markdown has no additional parameters
      ],
    },
    // Variant 2: JSON (Extract)
    {
      name: "extract_variant",
      type: "object",
      properties: [
        {
          name: "type",
          type: "string",
          constant: "extract",
          display_name: t("STRUCTURED_EXTRACT_LABEL"),
        },
        {
          name: "schema",
          type: "object",
          display_name: t("SCHEMA_DISPLAY_NAME"),
          ui: { component: "code-editor", options: { language: "json" } },
          properties: [],
        },
        {
          name: "system_prompt",
          type: "string",
          display_name: t("SYSTEM_PROMPT_DISPLAY_NAME"),
          ui: { component: "textarea" },
        },
      ],
    },
    // Variant 3: Screenshot
    {
      name: "screenshot_variant",
      type: "object",
      properties: [
        {
          name: "type",
          type: "string",
          constant: "screenshot",
          display_name: t("SCREENSHOT_LABEL"),
        },
        {
          name: "full_page",
          type: "boolean",
          display_name: t("FULL_PAGE_DISPLAY_NAME"),
          default: false,
        },
      ],
    },
  ],
}
```

**User selects different variant invoke parameter examples**:

```typescript
// Variant 1: User selects "markdown" - no additional parameters
const params1 = {
  output: {
    type: "markdown",
  },
}

// Variant 2: User selects "extract" - includes schema and system_prompt
const params2 = {
  output: {
    type: "extract",
    schema: {
      type: "object",
      properties: {
        title: { type: "string" },
        price: { type: "number" },
      },
    },
    system_prompt: "Extract product information accurately",
  },
}

// Variant 3: User selects "screenshot" - includes full_page option
const params3 = {
  output: {
    type: "screenshot",
    full_page: true,
  },
}

// invoke switches logic based on type field
invoke: async ({ args }) => {
  const { parameters } = args
  const { type, ...rest } = parameters.output

  switch (type) {
    case "markdown":
      return { content: "# Title\n..." }
    case "extract":
      const schema = rest.schema
      return { data: { title: "...", price: 99.9 } }
    case "screenshot":
      const fullPage = rest.full_page
      return { image: "base64://..." }
  }
}
```

### 10.6 Conditional Display: Linked Parameters

```typescript
const parameters: Property[] = [
  {
    name: "mode",
    type: "string",
    display_name: t("MODE_DISPLAY_NAME"),
    enum: ["simple", "advanced"],
    default: "simple",
    ui: { component: "radio-group" },
  },
  // Show only in Advanced mode
  {
    name: "custom_headers",
    type: "object",
    display_name: t("CUSTOM_HEADERS_DISPLAY_NAME"),
    additional_properties: true,
    properties: [],
    display: {
      show: { mode: "advanced" },
    },
  },
  // Show only in Advanced mode
  {
    name: "retry_count",
    type: "integer",
    display_name: t("RETRY_COUNT_DISPLAY_NAME"),
    default: 3,
    minimum: 0,
    maximum: 10,
    display: {
      show: { mode: "advanced" },
    },
  },
]
```

**User selects different mode invoke parameter examples**:

```typescript
// Scenario 1: Simple mode - won't include custom_headers and retry_count
const paramsSimple = {
  mode: "simple",
}

// Scenario 2: Advanced mode - includes hidden fields
const paramsAdvanced = {
  mode: "advanced",
  custom_headers: {
    "X-Custom-Header": "value1",
    "X-Another-Header": "value2",
  },
  retry_count: 5,
}

// invoke logic
invoke: async ({ args }) => {
  const { parameters } = args
  if (parameters.mode === "simple") {
    // Use default configuration
    return { success: true, retry_count: 3 }
  } else {
    // Use user-defined advanced options
    return {
      success: true,
      headers: parameters.custom_headers,
      retry_count: parameters.retry_count,
    }
  }
}
```

### 10.7 Credential Parameters

```typescript
const credentialParameter: PropertyCredentialId = {
  name: "credential_id",
  type: "credential_id",
  display_name: t("CREDENTIAL_DISPLAY_NAME"),
  credential_name: "firecrawl",
  required: true,
}
```

**invoke receives credential ID example**:

```typescript
interface ToolArgs {
  parameters: { credential_id: string; url?: string }
  credentials: Record<string, { api_key: string }>
}

const params = {
  credential_id: "cred_65f3a2b9d8e1c4f7a9b2e5d1",
}

// invoke makes API call using credential
invoke: async ({ args }: { args: ToolArgs }) => {
  const { parameters, credentials } = args
  // Get credential by credential_id from credentials object
  const credentialId = parameters.credential_id
  const credential = credentials[credentialId]
  // credential = { api_key: "fc-xxxxx..." }

  // Use credential to call external API
  const response = await firecrawlApi.scrape(
    {
      url: parameters.url,
    },
    {
      auth: credential.api_key,
    },
  )

  return { success: true, data: response.data }
}
```

### 10.8 Complete Tool Definition Example

Below is an example of a complete tool definition similar to Firecrawl Scrape:

```typescript
const scrapeTool: ToolDefinition = {
  name: "scrape-a-url",
  display_name: t("SCRAPE_TOOL_DISPLAY_NAME"),
  description: t("SCRAPE_TOOL_DESCRIPTION"),
  icon: "🔥",
  parameters: [
    // Credential
    {
      name: "credential_id",
      type: "credential_id",
      credential_name: "firecrawl",
      required: true,
    },
    // Basic parameter
    {
      name: "url",
      type: "string",
      display_name: t("URL_DISPLAY_NAME"),
      required: true,
      ui: {
        component: "input",
        placeholder: t("URL_PLACEHOLDER"),
      },
    },
    // Output formats (multi-select)
    {
      name: "formats",
      type: "array",
      display_name: t("FORMATS_DISPLAY_NAME"),
      items: {
        name: "format",
        type: "string",
        enum: ["markdown", "html", "screenshot"],
      },
      default: ["markdown"],
      ui: { component: "multi-select" },
    },
    // Advanced options (collapsible)
    {
      name: "options",
      type: "object",
      display_name: t("OPTIONS_DISPLAY_NAME"),
      ui: {
        component: "collapsible-panel",
        options: { collapsed: true },
      },
      properties: [
        {
          name: "include_tags",
          type: "array",
          display_name: t("INCLUDE_TAGS_DISPLAY_NAME"),
          items: { name: "tag", type: "string" },
          ui: { component: "tag-input" },
          ai: { llm_description: "HTML tags to include in the output" },
        },
        {
          name: "exclude_tags",
          type: "array",
          display_name: t("EXCLUDE_TAGS_DISPLAY_NAME"),
          items: { name: "tag", type: "string" },
          ui: { component: "tag-input" },
        },
        {
          name: "wait_for",
          type: "integer",
          display_name: t("WAIT_FOR_DISPLAY_NAME"),
          default: 0,
          minimum: 0,
          ui: {
            hint: t("WAIT_FOR_HINT"),
          },
        },
        {
          name: "timeout",
          type: "integer",
          display_name: t("TIMEOUT_DISPLAY_NAME"),
          default: 30000,
        },
        {
          name: "only_main_content",
          type: "boolean",
          display_name: t("ONLY_MAIN_CONTENT_DISPLAY_NAME"),
          default: true,
          ui: { component: "switch" },
        },
      ],
    },
    // HTTP Headers (object with additional properties)
    {
      name: "headers",
      type: "object",
      display_name: t("HEADERS_DISPLAY_NAME"),
      additional_properties: true,
      properties: [],
      ui: {
        component: "collapsible-panel",
        options: { collapsed: true },
      },
    },
  ],
  invoke: async ({
    args,
  }: {
    args: { parameters: any; credentials: Record<string, { api_key: string }> }
  }) => {
    // Actual call logic
    const { parameters, credentials } = args
    const { credential_id, url, formats, options, headers } = parameters

    // Build API request parameters
    const requestParams = {
      url: url,
      formats: formats, // ["markdown", "html"]
      include_tags: options.include_tags,
      exclude_tags: options.exclude_tags,
      wait_for: options.wait_for,
      timeout: options.timeout,
      only_main_content: options.only_main_content,
      headers: headers, // { "Authorization": "...", ... }
    }

    // Get credential by credential_id from credentials, then call API
    const credential = credentials[credential_id]
    const response = await firecrawlApi.scrape(requestParams, credential.api_key)

    return {
      success: true,
      content: response.data,
      formats: formats,
    }
  },
}
```

---

## 11. Advanced Patterns and Best Practices

### Shared Parameters Pattern

When multiple tools share the same parameters (e.g., credentials, pagination, sorting), extract them as shared constants:

```typescript
// _shared-parameters/credential.ts
export const credentialParameter: PropertyCredentialId = {
  name: "credential_id",
  type: "credential_id",
  credential_name: "notion",
  required: true,
}

// tools/create-page.ts
import { credentialParameter } from "../_shared-parameters/credential"

const createPageTool: ToolDefinition = {
  name: "create-page",
  parameters: [
    credentialParameter,
    // ... other parameters
  ],
  invoke: async ({
    args,
  }: {
    args: { parameters: { [key: string]: any }; credentials: Record<string, { api_key: string }> }
  }) => {
    const { parameters, credentials } = args
    const credential = credentials[parameters.credential_id]
    // Use credential to call Notion API
    return await notionApi.createPage(parameters, credential)
  },
}
```

### Expression Support

Allow users to input dynamic expressions (reference upstream node data):

```typescript
{
  name: "message",
  type: "string",
  ui: {
    component: "textarea",
    support_expression: true  // Enable expression mode
  }
}
```

**invoke parameter example** (expression values already parsed):

```typescript
// User input expression: {{upstream_node.content}}
// System auto-parses expression, invoke receives actual value

const params = {
  message: "Hello, the page title is: Example Page",
}

invoke: async ({ args }) => {
  const { parameters } = args
  // parameters.message contains parsed content
  console.log(parameters.message)
  return { sent: true }
}
```

### Constant Fields

Set field as read-only fixed value, commonly used in discriminated union:

```typescript
{
  name: "type",
  type: "string",
  constant: "webhook",      // Value fixed as "webhook"
  display_name: t("WEBHOOK_DISPLAY_NAME")
}
```

When `constant` is set:

- Field displays as read-only
- Value auto-populated on initialization
- Cannot be modified by user

### Nested Discriminated Union

Support multi-level nested discriminated unions:

```typescript
{
  name: "action",
  type: "discriminated_union",
  discriminator: "type",
  any_of: [
    {
      name: "click",
      type: "object",
      properties: [
        { name: "type", type: "string", constant: "click" },
        // click has its own child discriminated union
        {
          name: "target",
          type: "discriminated_union",
          discriminator: "method",
          any_of: [
            {
              name: "css",
              type: "object",
              properties: [
                { name: "method", type: "string", constant: "css" },
                { name: "selector", type: "string" }
              ]
            },
            {
              name: "xpath",
              type: "object",
              properties: [
                { name: "method", type: "string", constant: "xpath" },
                { name: "expression", type: "string" }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

**invoke parameter example (nested discrimination)**:

```typescript
const params = {
  action: {
    type: "click",
    target: {
      method: "css",
      selector: ".submit-button",
    },
  },
}

// Or

const params2 = {
  action: {
    type: "click",
    target: {
      method: "xpath",
      expression: "//button[@id='submit']",
    },
  },
}

invoke: async ({ args }) => {
  const { parameters } = args
  const action = parameters.action
  if (action.type === "click") {
    const selector =
      action.target.method === "css" ? action.target.selector : action.target.expression
    await clickElement(selector, action.target.method)
  }
  return { success: true }
}
```

### Array Elements as Discriminated Union

Each array item can be different object forms:

```typescript
{
  name: "actions",
  type: "array",
  display_name: t("ACTIONS_DISPLAY_NAME"),
  items: {
    name: "action",
    type: "discriminated_union",
    discriminator: "type",
    any_of: [
      {
        name: "wait",
        type: "object",
        properties: [
          { name: "type", type: "string", constant: "wait", display_name: t("WAIT_LABEL") },
          { name: "milliseconds", type: "integer", default: 1000 }
        ]
      },
      {
        name: "click",
        type: "object",
        properties: [
          { name: "type", type: "string", constant: "click", display_name: t("CLICK_LABEL") },
          { name: "selector", type: "string", display_name: t("SELECTOR_DISPLAY_NAME") }
        ]
      },
      {
        name: "scroll",
        type: "object",
        properties: [
          { name: "type", type: "string", constant: "scroll", display_name: t("SCROLL_LABEL") },
          { name: "direction", type: "string", enum: ["down", "up"], default: "down" }
        ]
      }
    ]
  }
}
```

**invoke parameter example (mixed types in array)**:

```typescript
const params = {
  actions: [
    {
      type: "wait",
      milliseconds: 2000,
    },
    {
      type: "click",
      selector: ".next-button",
    },
    {
      type: "scroll",
      direction: "down",
    },
    {
      type: "wait",
      milliseconds: 1000,
    },
    {
      type: "click",
      selector: ".load-more",
    },
  ],
}

invoke: async ({ args }) => {
  const { parameters } = args
  for (const action of parameters.actions) {
    switch (action.type) {
      case "wait":
        await sleep(action.milliseconds)
        break
      case "click":
        await clickElement(action.selector)
        break
      case "scroll":
        await scrollPage(action.direction)
        break
    }
  }
  return { success: true, actionsExecuted: parameters.actions.length }
}
```

### Section UI Layout

Use `section` to display object name with underline at top, rendering child properties from top to bottom with indentation:

```typescript
{
  name: "location",
  type: "object",
  display_name: t("LOCATION_DISPLAY_NAME"),
  ui: {
    component: "section"
  },
  properties: [
    { name: "country", type: "string", display_name: t("COUNTRY_DISPLAY_NAME") },
    { name: "languages", type: "array", items: { name: "l", type: "string" }, ui: { component: "tag-input" } }
  ]
}
```

**invoke parameter example**:

```typescript
const params = {
  location: {
    country: "US",
    languages: ["English", "Spanish"],
  },
}

invoke: async ({ args }) => {
  const { parameters } = args
  const { country, languages } = parameters.location
  // Data structure is identical to normal object, UI display is different
  console.log(`Selected country: ${country}`)
  console.log(`Languages available: ${languages.join(", ")}`)
  return { success: true }
}
```

---

## 12. Default UI Behavior

When `ui` is not specified, the system uses these defaults:

| Property Type         | Default UI Component     | Description                      |
| --------------------- | ------------------------ | -------------------------------- |
| `string`              | `input`                  | Single-line text box             |
| `number` / `integer`  | `number-input`           | Number input box                 |
| `boolean`             | `switch`                 | Toggle switch                    |
| `object`              | _(no container)_         | Child fields laid out flat       |
| `array`               | `array-section`          | Array panel, auto mode detection |
| `credential_id`       | `credential-select`      | Credential selector              |
| `encrypted_string`    | `encrypted-input`        | Password input box               |
| `discriminated_union` | `select` (discriminator) | Selector + variant panel         |

### Array Section Auto Mode Selection

When array type has no UI specified or uses `array-section`:

- **Simple mode**: `items` is basic type (string / number / boolean)
  - One input per row + delete button
  - "Add" button at bottom

- **Compound mode**: `items` is object
  - Each item renders as collapsible panel
  - Panel title shows sequence number
  - Each item has independent delete button
