# 复合类型 Property 详解

### 6.1 PropertyObject

用于定义嵌套的参数组。

```typescript
interface PropertyObject extends PropertyBase {
  type: "object"

  /** 子属性列表（有序）。 */
  properties: Property[]

  /** 是否允许用户添加额外的键值对。 */
  additional_properties?: boolean

  /** UI 配置。 */
  ui?: PropertyUIObject
}
```

**可用 UI 组件**（`PropertyUIObject`）：

| `component`            | 说明               | 渲染效果               |
| ---------------------- | ------------------ | ---------------------- |
| _(不设置)_             | 平铺渲染 ⭐默认    | 子字段直接排列，无外框 |
| `"collapsible-panel"`  | 可折叠面板         | 带标题的可折叠区域     |
| `"section"`            | 分区面板           | 带页眉/页脚的分区      |
| `"code-editor"`        | 代码编辑器         | 整个对象当 JSON 编辑   |
| `"json-schema-editor"` | JSON Schema 编辑器 | Schema 可视化编辑      |
| `"conditions-editor"`  | 条件编辑器         | 条件规则编辑           |

**collapsible-panel 选项**：

```typescript
{
  component: "collapsible-panel",
  options?: {
    collapsed?: boolean;  // 是否默认折叠
  }
}
```

**section 选项**：

```typescript
{
  component: "section"
}
```

> **说明**：使用 `section` 时，对象顶部显示对象名称和下划线，子属性从上到下依次渲染，且所有子属性都会有缩进。

**示例**：可折叠面板

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

**示例**：带额外键值对的对象（如 HTTP Headers）

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

用于定义列表/多选类型参数。

```typescript
interface PropertyArray extends PropertyBase {
  type: "array"

  /** 数组元素的类型定义。 */
  items: Property

  /** 最大项数。 */
  max_items?: number

  /** 最小项数。 */
  min_items?: number

  /** UI 配置。 */
  ui?: PropertyUIArray
}
```

**可用 UI 组件**（`PropertyUIArray`）：

| `component`                     | 说明            | 典型场景                   |
| ------------------------------- | --------------- | -------------------------- |
| _(不设置)_ 或 `"array-section"` | 数组面板 ⭐默认 | 通用数组编辑               |
| `"multi-select"`                | 多选下拉        | 元素为枚举字符串           |
| `"tag-input"`                   | 标签输入        | 自由文本列表               |
| `"slider"`                      | 范围滑动条      | 数值范围 [min, max]        |
| `"key-value-editor"`            | 键值对编辑器    | 元素为 { key, value } 对象 |

**array-section 的渲染逻辑**：

- 若 `items` 是基础类型（string/number/boolean） → 简单列表（每行一个输入框 + 删除按钮）
- 若 `items` 是 object → 复合列表（每项为一个可折叠面板）

**multi-select 组件**—需要 `items` 有 `enum`：

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

**tag-input 组件**：

```typescript
{
  name: "tags",
  type: "array",
  display_name: t("TAGS_DISPLAY_NAME"),
  items: { name: "tag", type: "string" },
  ui: { component: "tag-input" }
}
```

**key-value-editor 组件**：

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

**复合数组（每项为对象）**：

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

根据一个"判别字段"的值，切换显示不同的参数集合。这是最强大的组合模式。

```typescript
interface PropertyDiscriminatedUnion extends PropertyBase {
  type: "discriminated_union"

  /** 判别字段名——必须在每个 any_of 变体中存在同名的 enum 字段。 */
  discriminator: string

  /** 所有可能的变体（每个变体是一个 PropertyObject）。 */
  any_of: PropertyObject[]

  /** 判别字段的 UI 组件。 */
  discriminator_ui?: {
    component: "select" | "switch" | "radio-group"
  }
}
```

**工作原理**：

1. 系统从每个变体中提取 `discriminator` 同名字段的 `constant` 值
2. 生成一个选择器（默认 `select`，可改为 `switch`/`radio-group`）
3. 用户选择后，显示对应变体的其余字段

**示例**：根据格式选择不同参数

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

> **关键**：每个变体（`any_of` 中的对象）必须包含一个与 `discriminator` 同名的字段，且该字段必须设置 `constant` 值作为判别依据。

