# PropertyUI 组件参考

### 8.1 PropertyUICommonProps — 通用 UI 属性

所有 UI 组件都支持以下通用属性：

```typescript
interface PropertyUICommonProps {
  /** 是否禁用。 */
  disabled?: boolean

  /** 帮助提示文本，显示在字段下方。 */
  hint?: I18nText

  /** 输入占位符文本。 */
  placeholder?: I18nText

  /** 是否只读。 */
  readonly?: boolean

  /** 是否为敏感数据（值会被掩码显示）。 */
  sensitive?: boolean

  /** 是否支持表达式输入。 */
  support_expression?: boolean

  /** 字段宽度。 */
  width?: "small" | "medium" | "full"

  /** 缩进级别（像素）。偶数，范围 2-80。 */
  indentation?: number

  /** 隐藏但保留在 DOM 中（CSS display:none）。 */
  display_none?: boolean
}
```

**字段详解**：

| 属性                 | 类型     | 说明                                                     |
| -------------------- | -------- | -------------------------------------------------------- |
| `disabled`           | boolean  | 灰色不可交互                                             |
| `hint`               | I18nText | 字段下方的说明文字                                       |
| `placeholder`        | I18nText | 输入框内的提示文字                                       |
| `readonly`           | boolean  | 可见但不可编辑                                           |
| `sensitive`          | boolean  | 值显示为 `••••••`                                        |
| `support_expression` | boolean  | 允许输入动态表达式 `{{xxx}}`                             |
| `width`              | string   | `"small"` 约 1/3 宽, `"medium"` 约 1/2 宽, `"full"` 整行 |
| `indentation`        | number   | 视觉缩进，用于表示层级关系                               |
| `display_none`       | boolean  | CSS 隐藏，但数据不会被清除                               |

### 8.2 String 类型可用 UI 组件

| `component`      | 说明                | 典型场景                 | 特定选项                             |
| ---------------- | ------------------- | ------------------------ | ------------------------------------ |
| `"input"`        | 单行文本输入 ⭐默认 | 普通文本参数             | -                                    |
| `"textarea"`     | 多行文本输入        | 长文本、代码段           | -                                    |
| `"select"`       | 下拉单选            | 需要 `enum` 的参数       | `{ searchable: boolean }`            |
| `"radio-group"`  | 单选按钮组          | 选项少且需要直观展示     | -                                    |
| `"code-editor"`  | 代码编辑器          | JSON、JavaScript、Python | `{ language: string; rows: number }` |
| `"emoji-picker"` | 表情符号选择器      | 图标、符号选择           | -                                    |
| `"color-picker"` | 颜色选择器          | RGB、HEX 颜色值          | -                                    |

### 8.3 Number 类型可用 UI 组件

| `component`      | 说明              | 典型场景                 | 特定选项                                     |
| ---------------- | ----------------- | ------------------------ | -------------------------------------------- |
| `"number-input"` | 数字输入框 ⭐默认 | 普通数字输入             | -                                            |
| `"select"`       | 下拉单选          | 需要 `enum` 的数字选项   | -                                            |
| `"slider"`       | 范围滑动条        | 可视化数值选择、范围限制 | `{ min: number; max: number; step: number }` |

### 8.4 Boolean 类型可用 UI 组件

| `component` | 说明        | 典型场景  |
| ----------- | ----------- | --------- |
| `"switch"`  | 开关 ⭐默认 | 启用/禁用 |

### 8.5 Object 类型可用 UI 组件

| `component`            | 说明               | 渲染效果                                     | 特定选项                             |
| ---------------------- | ------------------ | -------------------------------------------- | ------------------------------------ |
| _(不设置)_             | 平铺渲染 ⭐默认    | 子字段直接排列，无外框                       | -                                    |
| `"collapsible-panel"`  | 可折叠面板         | 带标题的可折叠容器                           | `{ collapsed: boolean }`             |
| `"section"`            | 分区面板           | 顶部显示对象名称下划线，子属性向下渲染并缩进 | -                                    |
| `"code-editor"`        | 代码编辑器         | 整个对象当做 JSON/代码编辑                   | `{ language: string; rows: number }` |
| `"json-schema-editor"` | JSON Schema 编辑器 | Schema 可视化编辑                            | -                                    |
| `"conditions-editor"`  | 条件编辑器         | 条件规则编辑                                 | -                                    |

### 8.6 Array 类型可用 UI 组件

| `component`                | 说明            | 适用场景                            | 特定选项                                     |
| -------------------------- | --------------- | ----------------------------------- | -------------------------------------------- |
| `"array-section"` 或不设置 | 数组面板 ⭐默认 | 通用数组编辑；自动区分简单/复合模式 | -                                            |
| `"multi-select"`           | 多选下拉        | 数组元素为枚举字符串                | -                                            |
| `"tag-input"`              | 标签输入        | 自由输入文本列表                    | -                                            |
| `"slider"`                 | 范围滑动条      | 数值范围 [min, max]                 | `{ min: number; max: number; step: number }` |
| `"key-value-editor"`       | 键值对编辑器    | 数组元素为 `{ key, value }` 对象    | -                                            |

### 8.7 CredentialId 类型可用 UI 组件

| `component`                    | 说明                                           |
| ------------------------------ | ---------------------------------------------- |
| `"credential-select"` ⭐仅选项 | 凭证选择器下拉框（包含已有凭证列表和新建按钮） |

