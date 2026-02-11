# 插件参数声明式定义参考文档

> **Plugin Property & Property-UI Reference**
>
> 本文档面向 Atomemo 插件开发者，旨在提供 **Property**（插件参数）与 **PropertyUI**（参数 UI 组件）的完整参考。
> 阅读本文档后，你将能够使用声明式配置定义出从简单到复杂的工具参数界面。

---

## 目录

- [插件参数声明式定义参考文档](#插件参数声明式定义参考文档)
  - [目录](#目录)
  - [1. 概述与核心概念](#1-概述与核心概念)
  - [2. I18nText — 国际化文本](#2-i18ntext--国际化文本)
  - [3. Property 类型总览](#3-property-类型总览)
  - [4. PropertyBase — 通用基础字段](#4-propertybase--通用基础字段)
  - [5. 基础类型 Property 详解](#5-基础类型-property-详解)
    - [5.1 PropertyString](#51-propertystring)
    - [5.2 PropertyNumber](#52-propertynumber)
    - [5.3 PropertyBoolean](#53-propertyboolean)
  - [6. 复合类型 Property 详解](#6-复合类型-property-详解)
    - [6.1 PropertyObject](#61-propertyobject)
    - [6.2 PropertyArray](#62-propertyarray)
    - [6.3 PropertyDiscriminatedUnion](#63-propertydiscriminatedunion)
  - [7. 特殊类型 Property](#7-特殊类型-property)
    - [7.1 PropertyCredentialId](#71-propertycredentialid)
    - [7.2 PropertyEncryptedString](#72-propertyencryptedstring)
  - [8. PropertyUI 组件参考](#8-propertyui-组件参考)
    - [8.1 PropertyUICommonProps — 通用 UI 属性](#81-propertyuicommonprops--通用-ui-属性)
    - [8.2 String 类型可用 UI 组件](#82-string-类型可用-ui-组件)
    - [8.3 Number 类型可用 UI 组件](#83-number-类型可用-ui-组件)
    - [8.4 Boolean 类型可用 UI 组件](#84-boolean-类型可用-ui-组件)
    - [8.5 Object 类型可用 UI 组件](#85-object-类型可用-ui-组件)
    - [8.6 Array 类型可用 UI 组件](#86-array-类型可用-ui-组件)
    - [8.7 CredentialId 类型可用 UI 组件](#87-credentialid-类型可用-ui-组件)
  - [9. DisplayCondition — 条件显示/隐藏](#9-displaycondition--条件显示隐藏)
    - [基本语法](#基本语法)
    - [条件运算符](#条件运算符)
    - [逻辑运算符](#逻辑运算符)
    - [匹配规则](#匹配规则)
    - [示例](#示例)
  - [10. 实战示例](#10-实战示例)
    - [10.1 基础：字符串参数](#101-基础字符串参数)
    - [10.2 带枚举的下拉选择](#102-带枚举的下拉选择)
    - [10.3 嵌套对象 + 可折叠面板](#103-嵌套对象--可折叠面板)
    - [10.4 数组 + 键值对编辑器](#104-数组--键值对编辑器)
    - [10.5 Discriminated Union — 根据选择切换参数](#105-discriminated-union--根据选择切换参数)
    - [10.6 条件显示：联动参数](#106-条件显示联动参数)
    - [10.7 凭证参数](#107-凭证参数)
    - [10.8 完整工具定义示例](#108-完整工具定义示例)
  - [11. 高级模式与最佳实践](#11-高级模式与最佳实践)
    - [共享参数模式](#共享参数模式)
    - [常量字段（constant）](#常量字段constant)
    - [嵌套 Discriminated Union](#嵌套-discriminated-union)
    - [数组元素为 Discriminated Union](#数组元素为-discriminated-union)
    - [Section UI 布局](#section-ui-布局)
  - [12. 默认 UI 行为](#12-默认-ui-行为)
    - [Array Section 自动模式选择](#array-section-自动模式选择)

---

## 1. 概述与核心概念

Atomemo 插件系统使用 **声明式** 方式定义工具参数。你只需编写 JSON/TypeScript 配置对象，系统会自动渲染对应的表单 UI。

```
┌─────────────────────────────────────────────┐
│              Tool Definition                │
│  ┌───────────────────────────────────────┐  │
│  │  parameters: Property[]               │  │
│  │  ┌─────────────────────────────────┐  │  │
│  │  │  Property                       │  │  │
│  │  │  ├── name            (标识符)    │  │  │
│  │  │  ├── type            (数据类型)  │  │  │
│  │  │  ├── display_name    (显示名称)  │  │  │
│  │  │  ├── required        (是否必填)  │  │  │
│  │  │  ├── display         (条件显隐)  │  │  │
│  │  │  ├── ui              (UI 组件)  │  │  │
│  │  │  └── ...type-specific fields    │  │  │
│  │  └─────────────────────────────────┘  │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

**核心关系**：

| 概念               | 职责                                         | 类比        |
| ------------------ | -------------------------------------------- | ----------- |
| `Property`         | 定义参数的**数据模型**——类型、约束、默认值   | JSON Schema |
| `PropertyUI`       | 定义参数的**渲染方式**——用什么组件、什么样式 | UI Hint     |
| `DisplayCondition` | 定义参数的**显示条件**——何时显示/隐藏        | 条件表达式  |

一个 `Property` 通过 `type` 确定数据类型，通过 `ui` 指定渲染组件。**不同的 `type` 可用的 `ui` 组件不同。**

---

## 2. I18nText — 国际化文本

所有面向用户的文本（显示名称、提示、占位符等）均使用 `I18nText` 类型：

```typescript
type I18nText = {
  en_US: string // 英文 (必填)
  zh_Hans?: string // 简体中文 (可选)
  [locale: string]: string // 其他语言
}
```

**示例**：

```typescript
{
  display_name: {
    en_US: "API Key",
    zh_Hans: "API 密钥"
  }
}
```

> **规则**：`en_US` 始终必填，未提供当前语言时回退到 `en_US`。

---

## 3. Property 类型总览

| `type` 值               | TypeScript 类型              | 说明           | 默认 UI                     |
| ----------------------- | ---------------------------- | -------------- | --------------------------- |
| `"string"`              | `PropertyString`             | 字符串         | `input` (单行输入框)        |
| `"number"`              | `PropertyNumber`             | 数字（含小数） | `number-input` (数字输入框) |
| `"integer"`             | `PropertyNumber`             | 整数           | `number-input`              |
| `"boolean"`             | `PropertyBoolean`            | 布尔值         | `switch` (开关)             |
| `"object"`              | `PropertyObject`             | 嵌套对象       | 平铺子字段                  |
| `"array"`               | `PropertyArray`              | 数组           | `array-section` (数组面板)  |
| `"credential_id"`       | `PropertyCredentialId`       | 凭证引用       | `credential-select`         |
| `"encrypted_string"`    | `PropertyEncryptedString`    | 加密字符串     | `encrypted-input`           |
| `"discriminated_union"` | `PropertyDiscriminatedUnion` | 判别联合       | 选择器 + 变体面板           |

---

## 4. PropertyBase — 通用基础字段

所有 Property 类型共享以下基础字段：

```typescript
interface PropertyBase {
  /** 必填。参数的唯一标识符，用于数据存取。 */
  name: string

  /** 可选。在表单中显示的标签名称。 */
  display_name?: I18nText

  /** 可选。是否为必填参数。默认 false。 */
  required?: boolean

  /** 可选。条件显示/隐藏规则。 */
  display?: {
    show?: DisplayCondition // 满足条件时显示
    hide?: DisplayCondition // 满足条件时隐藏
  }

  /** 可选。AI 相关配置。 */
  ai?: {
    /** 对 LLM 的参数描述，帮助 AI 理解参数用途。 */
    llm_description?: string
  }

  /** 可选。UI 组件配置。不同 type 可指定的 UI 组件不同。 */
  ui?: PropertyUI
}
```

**字段说明**：

| 字段           | 必填 | 说明                                                        |
| -------------- | ---- | ----------------------------------------------------------- |
| `name`         | ✅   | 参数路径标识。只允许字母、数字、下划线。                    |
| `display_name` | ❌   | 表单标签。不填则使用 `name` 的 humanized 形式。             |
| `required`     | ❌   | 标记必填，表单会显示必填标记。                              |
| `display`      | ❌   | 条件显隐。见 [第 9 节](#9-displaycondition--条件显示隐藏)。 |
| `ai`           | ❌   | AI Agent 调用工具时的参数描述。                             |
| `ui`           | ❌   | 不填则使用该类型的默认 UI 组件。                            |

---

## 5. 基础类型 Property 详解

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

---

## 6. 复合类型 Property 详解

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

---

## 7. 特殊类型 Property

### 7.1 PropertyCredentialId

引用已配置的外部服务凭证。

```typescript
interface PropertyCredentialId extends PropertyBase {
  type: "credential_id"

  /** 凭证类型名称。系统会过滤出该类型的已有凭证供选择。 */
  credential_name: string

  /** UI 配置。 */
  ui?: PropertyUICredentialId
}
```

渲染为凭证选择器下拉框，包含：

- 已有凭证列表（按 `credential_name` 过滤）
- 「新建凭证」按钮
- 未配置时的提示信息

**示例**：

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

用于存储敏感信息（密码、Token 等），输入时自动掩码显示。

```typescript
interface PropertyEncryptedString extends PropertyBase {
  type: "encrypted_string"
}
```

渲染为密码输入框（`encrypted-input`），存储时加密处理。

---

## 8. PropertyUI 组件参考

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

---

## 9. DisplayCondition — 条件显示/隐藏

`DisplayCondition` 使用类似 MongoDB 查询语法的条件表达式，根据**同级其他字段**的值控制参数的显示与隐藏。

### 基本语法

```typescript
interface PropertyBase {
  display?: {
    show?: DisplayCondition // 条件为真时显示
    hide?: DisplayCondition // 条件为真时隐藏
  }
}
```

- `show` 和 `hide` 可以同时存在。先评估 `show`，再评估 `hide`。
- 参数默认可见。设置了 `show` 后，只有满足条件才可见。

### 条件运算符

```typescript
type FilterOperators = {
  $eq?: any // 等于
  $ne?: any // 不等于
  $gt?: number // 大于
  $gte?: number // 大于等于
  $lt?: number // 小于
  $lte?: number // 小于等于
  $in?: any[] // 在数组中
  $nin?: any[] // 不在数组中
  $exists?: boolean // 字段是否存在
  $regex?: string // 正则匹配
  $options?: string // 正则选项（如 "i" 忽略大小写）
  $mod?: [number, number] // 取模 [除数, 余数]
  $size?: number // 数组长度
}
```

### 逻辑运算符

```typescript
type DisplayCondition = {
  // 字段级匹配——键为字段名，值为匹配条件
  [fieldName: string]: any | FilterOperators

  // 逻辑组合
  $and?: DisplayCondition[] // 全部满足
  $or?: DisplayCondition[] // 任一满足
  $nor?: DisplayCondition[] // 全部不满足
}
```

### 匹配规则

| 写法                               | 含义                  |
| ---------------------------------- | --------------------- |
| `{ "field": "value" }`             | `field === "value"`   |
| `{ "field": { $eq: "value" } }`    | `field === "value"`   |
| `{ "field": { $ne: "value" } }`    | `field !== "value"`   |
| `{ "field": { $in: ["a", "b"] } }` | `field 是 "a" 或 "b"` |
| `{ "field": { $exists: true } }`   | `field 已设置`        |
| `{ "field": { $gt: 10 } }`         | `field > 10`          |
| `{ "a.b.c": "value" }`             | 支持嵌套路径访问      |

### 示例

**场景 1**：当 `format` 为 `"json"` 时，显示 `schema` 参数

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

**场景 2**：当 `include_links` 为 `true` 时显示链接相关选项

```typescript
{
  name: "link_selector",
  type: "string",
  display: {
    show: { include_links: { $eq: true } }
  }
}
```

**场景 3**：复合条件——格式为 markdown 且启用了 headers

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

**场景 4**：多值匹配——格式为 html 或 markdown

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

## 10. 实战示例

### 10.1 基础：字符串参数

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

**用户输入示例及对应的 invoke 参数**：

```typescript
// 用户填入 URL
const params = {
  url: "https://example.com",
}

// tool.invoke({ args }) 接收到的参数
invoke: async ({ args }) => {
  const { parameters } = args
  console.log(parameters.url) // "https://example.com"
  // 使用 parameters.url 调用 API
  return { success: true, content: "..." }
}
```

### 10.2 带枚举的下拉选择

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

**用户选择示例及对应的 invoke 参数**：

```typescript
// 用户从下拉菜单选择 "html"
const params = {
  format: "html",
}

// invoke 接收到的参数
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

### 10.3 嵌套对象 + 可折叠面板

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

**用户填入示例及对应的 invoke 参数**：

```typescript
// 用户展开可折叠面板，选择国家和输入语言标签
const params = {
  location: {
    country: "CN",
    languages: ["Mandarin", "Cantonese", "English"],
  },
}

// invoke 接收到嵌套对象
invoke: async ({ args }) => {
  const { parameters } = args
  const { country, languages } = parameters.location
  console.log(country) // "CN"
  console.log(languages) // ["Mandarin", "Cantonese", "English"]
  return { success: true }
}
```

### 10.4 数组 + 键值对编辑器

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

**用户添加键值对示例及对应的 invoke 参数**：

```typescript
// 用户在键值对编辑器中添加多条 HTTP Header
const params = {
  headers: [
    { key: "Authorization", value: "Bearer token123" },
    { key: "Content-Type", value: "application/json" },
    { key: "User-Agent", value: "MyApp/1.0" },
  ],
}

// invoke 处理数组
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

### 10.5 Discriminated Union — 根据选择切换参数

这是一个完整的实际场景：根据不同的 scrape format 展示不同配置。

```typescript
const formatsParameter: PropertyDiscriminatedUnion = {
  name: "output",
  type: "discriminated_union",
  display_name: t("OUTPUT_DISPLAY_NAME"),
  discriminator: "type",
  discriminator_ui: { component: "select" },
  any_of: [
    // 变体 1: Markdown
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
        // Markdown 无额外参数
      ],
    },
    // 变体 2: JSON (Extract)
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
    // 变体 3: Screenshot
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

**用户选择不同变体的 invoke 参数示例**：

```typescript
// 变体 1：用户选择 "markdown" - 无额外参数
const params1 = {
  output: {
    type: "markdown",
  },
}

// 变体 2：用户选择 "extract" - 包含 schema 和 system_prompt
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

// 变体 3：用户选择 "screenshot" - 包含 full_page 选项
const params3 = {
  output: {
    type: "screenshot",
    full_page: true,
  },
}

// invoke 根据 type 字段切换处理逻辑
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

### 10.6 条件显示：联动参数

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
  // 仅在 Advanced 模式下显示
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
  // 仅在 Advanced 模式下显示
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

**用户选择不同模式的 invoke 参数示例**：

```typescript
// 场景 1：Simple 模式 - 不会包含 custom_headers 和 retry_count
const paramsSimple = {
  mode: "simple",
}

// 场景 2：Advanced 模式 - 包含隐藏字段
const paramsAdvanced = {
  mode: "advanced",
  custom_headers: {
    "X-Custom-Header": "value1",
    "X-Another-Header": "value2",
  },
  retry_count: 5,
}

// invoke 逻辑
invoke: async ({ args }) => {
  const { parameters } = args
  if (parameters.mode === "simple") {
    // 使用默认配置
    return { success: true, retry_count: 3 }
  } else {
    // 使用用户自定义的高级选项
    return {
      success: true,
      headers: parameters.custom_headers,
      retry_count: parameters.retry_count,
    }
  }
}
```

### 10.7 凭证参数

```typescript
const credentialParameter: PropertyCredentialId = {
  name: "credential_id",
  type: "credential_id",
  display_name: t("CREDENTIAL_DISPLAY_NAME"),
  credential_name: "firecrawl",
  required: true,
}
```

**invoke 接收到的凭证 ID 示例**：

```typescript
interface ToolArgs {
  parameters: { credential_id: string; url?: string }
  credentials: Record<string, { api_key: string }>
}

const params = {
  credential_id: "cred_65f3a2b9d8e1c4f7a9b2e5d1",
}

// invoke 使用凭证直接进行 API 调用
invoke: async ({ args }: { args: ToolArgs }) => {
  const { parameters, credentials } = args
  // 根据 credential_id 从 credentials 中获取对应的凭证
  const credentialId = parameters.credential_id
  const credential = credentials[credentialId]
  // credential = { api_key: "fc-xxxxx..." }

  // 使用凭证调用外部 API
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

### 10.8 完整工具定义示例

以下展示一个类似 Firecrawl Scrape 工具的完整定义：

```typescript
const scrapeTool: ToolDefinition = {
  name: "scrape-a-url",
  display_name: t("SCRAPE_TOOL_DISPLAY_NAME"),
  description: t("SCRAPE_TOOL_DESCRIPTION"),
  icon: "🔥",
  parameters: [
    // 凭证
    {
      name: "credential_id",
      type: "credential_id",
      credential_name: "firecrawl",
      required: true,
    },
    // 基础参数
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
    // 输出格式（多选）
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
    // 高级选项（可折叠）
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
    // HTTP Headers（带额外属性的对象）
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
    // 实际调用逻辑
    const { parameters, credentials } = args
    const { credential_id, url, formats, options, headers } = parameters

    // 构建 API 请求参数
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

    // 根据 credential_id 从 credentials 中获取凭证后调用 API
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

## 11. 高级模式与最佳实践

### 共享参数模式

当多个工具共享相同的参数（如凭证、分页、排序），将它们提取为共享常量：

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
    // ... 其他参数
  ],
  invoke: async ({
    args,
  }: {
    args: { parameters: { [key: string]: any }; credentials: Record<string, { api_key: string }> }
  }) => {
    const { parameters, credentials } = args
    const credential = credentials[parameters.credential_id]
    // 使用凭证调用 Notion API
    return await notionApi.createPage(parameters, credential)
  },
}
```

````

### 表达式支持

允许用户输入动态表达式（引用上游节点数据）：

```typescript
{
  name: "message",
  type: "string",
  ui: {
    component: "textarea",
    support_expression: true  // 开启表达式模式
  }
}
````

**invoke 接收的参数示例**（支持表达式后的值已被解析）：

```typescript
// 用户输入支持表达式的值：{{upstream_node.content}}
// 系统自动将表达式解析，invoke 接收实际值

const params = {
  message: "Hello, the page title is: Example Page",
}

invoke: async ({ args }) => {
  const { parameters } = args
  // parameters.message 包含已解析的内容
  console.log(parameters.message)
  return { sent: true }
}
```

### 常量字段（constant）

将字段设为只读的固定值，常用于 discriminated union：

```typescript
{
  name: "type",
  type: "string",
  constant: "webhook",      // 值固定为 "webhook"
  display_name: t("WEBHOOK_DISPLAY_NAME")
}
```

设置了 `constant` 后：

- 字段显示为只读
- 值在初始化时自动填充
- 不可被用户修改

### 嵌套 Discriminated Union

支持多层嵌套的 discriminated union：

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
        // click 有自己的子 discriminated union
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

**invoke 参数示例（嵌套判别）**：

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

// 或者

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

### 数组元素为 Discriminated Union

数组的每一项可以是不同形态的对象：

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

**invoke 参数示例（数组中的混合类型）**：

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

### Section UI 布局

使用 `section` 在对象顶部显示标题，子属性从上到下依次渲染并缩进：

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

**invoke 参数示例**：

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
  // Section 的数据结构与普通 object 一致，突UI 渲染业不同
  console.log(`Selected country: ${country}`)
  console.log(`Languages available: ${languages.join(", ")}`)
  return { success: true }
}
```

---

## 12. 默认 UI 行为

当不指定 `ui` 时，系统采用以下默认值：

| Property Type         | 默认 UI Component        | 说明                            |
| --------------------- | ------------------------ | ------------------------------- |
| `string`              | `input`                  | 单行文本框                      |
| `number` / `integer`  | `number-input`           | 数字输入框                      |
| `boolean`             | `switch`                 | 开关                            |
| `object`              | _(无容器)_               | 子字段平铺                      |
| `array`               | `array-section`          | 数组面板，自动选择简单/复合模式 |
| `credential_id`       | `credential-select`      | 凭证选择器                      |
| `encrypted_string`    | `encrypted-input`        | 密码输入框                      |
| `discriminated_union` | `select` (discriminator) | 选择器 + 变体面板               |

### Array Section 自动模式选择

当 `array` 类型不指定 UI 或使用 `array-section` 时：

- **Simple 模式**：`items` 为基础类型（string / number / boolean）
  - 每行一个输入框 + 删除按钮
  - 底部有 "添加" 按钮

- **Compound 模式**：`items` 为 object
  - 每项渲染为一个可折叠面板
  - 面板标题显示序号
  - 每项有独立的删除按钮
