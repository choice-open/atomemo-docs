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
| `"code-editor"`  | 代码编辑器          | JSON/JS/Python/Markdown |
| `"emoji-picker"` | 表情符号选择器      | 图标选择       |
| `"color-picker"` | 颜色选择器          | 颜色值         |

**select 组件选项配置**：

```typescript
{
  component: "select",
  searchable?: boolean;   // 是否可搜索
  clearable?: boolean;    // 是否显示清除按钮
  options?: Array<PropertyUIOption>;  // 自定义选项（含图标和标签）
}
```

**PropertyUIOption 结构**：

```typescript
interface PropertyUIOption {
  icon?: string;           // 可选的图标标识
  label: I18nText;         // 显示标签（支持多语言）
  value: string | number | boolean;  // 选项值
}
```

**code-editor 组件选项配置**：

```typescript
{
  component: "code-editor",
  language?: "json" | "javascript" | "python3" | "markdown";
  rows?: number;           // 编辑器行数
  line_numbers?: boolean;  // 是否显示行号
  line_wrapping?: boolean; // 是否启用自动换行
}
```

**示例**：基本字符串输入

```typescript
{
  name: "url",
  type: "string",
  display_name: { en_US: "URL", zh_Hans: "URL" },
  required: true,
  ui: {
    component: "input",
    placeholder: { en_US: "https://example.com", zh_Hans: "https://example.com" }
  }
}
```

**示例**：下拉选择

```typescript
{
  name: "language",
  type: "string",
  display_name: { en_US: "Language", zh_Hans: "语言" },
  enum: ["en", "zh", "ja"],
  default: "en",
  ui: {
    component: "select",
    options: [
      { label: { en_US: "English", zh_Hans: "英语" }, value: "en" },
      { label: { en_US: "Chinese", zh_Hans: "中文" }, value: "zh" },
      { label: { en_US: "Japanese", zh_Hans: "日语" }, value: "ja" },
    ],
  }
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
| `"slider"`       | 滑动条            | 范围选择    |

**slider 组件选项配置**：

```typescript
{
  component: "slider",
  step?: number;  // 步进值
}
```

**示例**：

```typescript
{
  name: "timeout",
  type: "integer",
  display_name: { en_US: "Timeout", zh_Hans: "超时" },
  default: 30000,
  minimum: 1000,
  maximum: 300000,
  ui: {
    component: "number-input",
    hint: { en_US: "Timeout in milliseconds", zh_Hans: "超时时间（毫秒）" }
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
  display_name: { en_US: "Include Raw HTML", zh_Hans: "包含原始 HTML" },
  default: false,
  ui: { component: "switch" }
}
```
