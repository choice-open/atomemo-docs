# 复合类型 Property 详解

### 6.1 PropertyObject

用于定义嵌套的参数组。

```typescript
interface PropertyObject extends PropertyBase {
  type: "object"

  /** 子属性列表（有序）。 */
  properties: Property[]

  /**
   * 用于约束 `properties` 以外附加属性的 schema。
   * 支持动态键，值需符合指定的属性 schema。
   */
  additional_properties?: Property | PropertyDiscriminatedUnion

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
  default_collapsed?: boolean;  // 是否默认折叠
  collapsible?: boolean;        // 面板是否可折叠切换
  panel_title?: I18nText;       // 可选面板标题
  sortable?: boolean;           // 是否支持拖拽排序
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
  display_name: { en_US: "Advanced Options", zh_Hans: "高级选项" },
  ui: {
    component: "collapsible-panel",
    default_collapsed: true
  },
  properties: [
    {
      name: "retry_count",
      type: "integer",
      display_name: { en_US: "Retry Count", zh_Hans: "重试次数" },
      default: 3
    },
    {
      name: "timeout",
      type: "integer",
      display_name: { en_US: "Timeout", zh_Hans: "超时" },
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
  display_name: { en_US: "Headers", zh_Hans: "请求头" },
  additional_properties: { name: "value", type: "string" },
  properties: []
}
```

### 6.2 PropertyArray

用于定义列表/多选类型参数。

```typescript
interface PropertyArray extends PropertyBase {
  type: "array"

  /** 数组元素的类型定义。 */
  items: Property | PropertyDiscriminatedUnion

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
  display_name: { en_US: "Formats", zh_Hans: "格式" },
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
  display_name: { en_US: "Tags", zh_Hans: "标签" },
  items: { name: "tag", type: "string" },
  ui: { component: "tag-input" }
}
```

**key-value-editor 组件**：

```typescript
{
  name: "query_params",
  type: "array",
  display_name: { en_US: "Query Parameters", zh_Hans: "查询参数" },
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
  display_name: { en_US: "Actions", zh_Hans: "动作" },
  items: {
    name: "action",
    type: "object",
    properties: [
      {
        name: "type",
        type: "string",
        display_name: { en_US: "Type", zh_Hans: "类型" },
        enum: ["click", "scroll", "wait"],
        ui: {
          component: "select",
          options: [
            { label: { en_US: "Click", zh_Hans: "点击" }, value: "click" },
            { label: { en_US: "Scroll", zh_Hans: "滚动" }, value: "scroll" },
            { label: { en_US: "Wait", zh_Hans: "等待" }, value: "wait" },
          ],
        }
      },
      {
        name: "selector",
        type: "string",
        display_name: { en_US: "Selector", zh_Hans: "选择器" }
      }
    ]
  }
}
```

### 6.3 PropertyDiscriminatedUnion

根据判别字段的值在不同参数集合之间切换。

`PropertyDiscriminatedUnion` **不是** `parameters` 数组中的顶层属性。目前它只能出现在明确允许使用的位置：

- `PropertyArray.items`
- `PropertyObject.additional_properties`

```typescript
interface PropertyDiscriminatedUnion {
  type: "discriminated_union"

  /** 判别字段名——必须在每个 any_of 变体中存在同名字段。 */
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

**示例**：在 `array.items` 内包裹判别联合，使单个配置项能根据 format 切换形态

```typescript
{
  name: "output_configs",
  type: "array",
  display_name: { en_US: "Output Config", zh_Hans: "输出配置" },
  min_items: 1,
  max_items: 1,
  items: {
    type: "discriminated_union",
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
            display_name: { en_US: "Markdown", zh_Hans: "Markdown" }
          },
          {
            name: "include_toc",
            type: "boolean",
            display_name: { en_US: "Include Table of Contents", zh_Hans: "包含目录" },
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
            display_name: { en_US: "JSON", zh_Hans: "JSON" }
          },
          {
            name: "schema",
            type: "object",
            display_name: { en_US: "Schema", zh_Hans: "数据结构" },
            ui: { component: "code-editor", language: "json" },
            properties: []
          }
        ]
      }
    ]
  }
}
```

> **关键**：每个变体（`any_of` 中的对象）必须包含一个与 `discriminator` 同名的字段，且该字段必须设置 `constant` 值作为判别依据。若需要类似单个选择器的效果，可将外层数组约束为 `min_items: 1` 和 `max_items: 1`。

