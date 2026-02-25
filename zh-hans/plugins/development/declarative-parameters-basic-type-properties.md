# 基础类型 Property 详解

### 5.1 PropertyString

```typescript
interface PropertyString extends PropertyBase {
  type: "string"

  /** 固定值。设置后该字段变为只读。 */
  constant?: string

  /** 默认值。 */
  default?: string

  /** 枚举选项。配合 select / radio-group 使用。 */
  enum?: string[]

  /** 最大长度。 */
  max_length?: number

  /** 最小长度。 */
  min_length?: number

  /** UI 配置。 */
  ui?: PropertyUIString
}
```

**可用 UI 组件**（`PropertyUIString`）：

| `component`      | 说明                | 典型场景       |
| ---------------- | ------------------- | -------------- |
| `"input"`        | 单行文本输入 ⭐默认 | 普通文本       |
| `"textarea"`     | 多行文本输入        | 长文本、描述   |
| `"select"`       | 下拉单选            | 需要 `enum`    |
| `"radio-group"`  | 单选按钮组          | 选项少时       |
| `"code-editor"`  | 代码编辑器          | JSON/JS/Python |
| `"emoji-picker"` | 表情符号选择器      | 图标选择       |
| `"color-picker"` | 颜色选择器          | 颜色值         |

**select 组件选项配置**：

```typescript
{
  component: "select",
  options?: {
    searchable?: boolean;   // 是否可搜索
  }
}
```

**code-editor 组件选项配置**：

```typescript
{
  component: "code-editor",
  options?: {
    language?: "json" | "javascript" | "python3" | "html" | "css";
    rows?: number;  // 编辑器行数
  }
}
```

**示例**：基本字符串输入

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

**示例**：下拉选择

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

  /** 固定值。 */
  constant?: number

  /** 默认值。 */
  default?: number

  /** 枚举选项。 */
  enum?: number[]

  /** 最大值。 */
  maximum?: number

  /** 最小值。 */
  minimum?: number

  /** UI 配置。 */
  ui?: PropertyUINumber
}
```

**可用 UI 组件**（`PropertyUINumber`）：

| `component`      | 说明              | 典型场景    |
| ---------------- | ----------------- | ----------- |
| `"number-input"` | 数字输入框 ⭐默认 | 普通数字    |
| `"select"`       | 下拉单选          | 需要 `enum` |
| `"slider"`       | 滑动条            | 范围选择    |

**slider 组件选项配置**：

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

**示例**：

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

  /** 固定值。 */
  constant?: boolean

  /** 默认值。 */
  default?: boolean

  /** UI 配置。 */
  ui?: PropertyUIBoolean
}
```

**可用 UI 组件**（`PropertyUIBoolean`）：

| `component` | 说明        | 典型场景  |
| ----------- | ----------- | --------- |
| `"switch"`  | 开关 ⭐默认 | 启用/禁用 |

**示例**：

```typescript
{
  name: "include_raw_html",
  type: "boolean",
  display_name: t("INCLUDE_RAW_HTML_DISPLAY_NAME"),
  default: false,
  ui: { component: "switch" }
}
```

