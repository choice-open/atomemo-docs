# 资源映射器（Resource Mapper）

`PropertyResourceMapper` 允许用户将远程资源的字段 Schema 与自定义值进行映射。它支持两种模式：**手动模式**（动态表单，每个字段对应一个有类型的输入项，字段列表从 API 实时拉取）和**自动模式**（支持表达式的自由 JSON 编辑器，用于程序化映射）。

### PropertyResourceMapper

```typescript
interface PropertyResourceMapper extends PropertyBase {
  type: "resource_mapper"

  /** 对应 resource_mapping 中用于获取可用字段的方法名。 */
  mapping_method: string

  /** 默认值。 */
  default?: ResourceMapperValue | null
}
```

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `type` | `"resource_mapper"` | Property 类型标识符 |
| `mapping_method` | `string` | 引用 `ToolDefinition.resource_mapping` 中的一个方法 |
| `default` | `ResourceMapperValue` | 可选默认值 |

> [!NOTE]
> `resource_mapper` 仅在 **Tool（工具）** 参数中受支持。

---

### ResourceMapperValue

`resource_mapper` 参数在运行时存储的值：

```typescript
interface ResourceMapperValue {
  __type__: "resource_mapper"

  /** 设置该值时激活的模式。 */
  mapping_mode: "manual" | "auto"

  /**
   * 手动模式：Record<fieldId, fieldValue>——每个已映射字段对应一条记录。
   * 自动模式：JSON object 或者字符串（表达式或者未能成功解析为 object 的输入内容）。
   */
  value: Record<string, unknown> | string | null
}
```

---

### ToolResourceMappingField

`resource_mapping` 回调返回的每个字段的结构：

```typescript
interface ToolResourceMappingField {
  /** 唯一字段标识符，用作映射值中的键名。 */
  id: string

  /** UI 中显示的可读标签，未设置时回退为 id。 */
  display_name?: I18nText | null

  /** 字段值类型——决定手动模式中渲染哪种输入组件。 */
  type: "string" | "number" | "integer" | "boolean" | "object" | "array"

  /** 该字段是否必填。必填字段在手动模式中不可删除。 */
  required?: boolean | null

  /** 可选字段级提示，会在手动模式下显示在字段标签旁边。 */
  ui?: {
    hint?: I18nText | null
  } | null
}
```

---

### resource_mapping 回调

在 `ToolDefinition.resource_mapping` 中实现一个方法，其键名与 `mapping_method` 一致。该函数在映射器挂载时以及 `depends_on` 引用的上游参数发生变化时被调用：

```typescript
type ToolResourceMappingFunction = (input: {
  args: {
    /** 当前工具参数，用于查询目标资源的 Schema。 */
    parameters: Record<string, unknown>
    credentials: Record<string, InputArgsCredential>
  }
}) => Promise<{
  /** 用户可以映射的可用字段列表。 */
  fields: Array<ToolResourceMappingField>
  /** 字段列表为空时显示的提示信息（可选）。 */
  empty_fields_notice?: I18nText | null
}>
```

在 `ToolDefinition.resource_mapping` 中注册该函数：

```typescript
const myTool: ToolDefinition = {
  name: "my-tool",
  parameters: [ /* ... */ ],
  resource_mapping: {
    map_record_fields: async ({ args }) => {
      const token = args.credentials["my-credential"].api_key
      const tableId = extractResourceLocator(args.parameters.table)
      if (!tableId) {
        return {
          fields: [],
          empty_fields_notice: { en_US: "Select a table first.", zh_Hans: "请先选择一张表。" },
        }
      }
      const schema = await apiClient.getTableSchema(token, tableId)
      return {
        fields: schema.columns.map(col => ({
          id: col.id,
          display_name: { en_US: col.name },
          type: col.dataType,
          required: col.required,
          ui: {
            hint: col.description ? { en_US: col.description } : null,
          },
        })),
      }
    },
  },
  invoke: async ({ args }) => { /* ... */ },
}
```

---

### depends_on 级联模式

> [!IMPORTANT]
> 当可用字段依赖于另一个参数（例如所选表格的列）时，务必在映射器上声明 `depends_on`。这会使 UI 在所引用的参数发生变化时重新拉取字段 Schema 并重置映射。
>
> 按 schema 定义，`depends_on` 只支持声明在 `resource_locator` 和 `resource_mapper` 上；它所依赖的上游参数应为 `string`、`number` / `integer`、`boolean` 或 `resource_locator` 类型。

```typescript
const fieldsParam: PropertyResourceMapper = {
  name: "fields",
  type: "resource_mapper",
  display_name: { en_US: "Fields", zh_Hans: "字段" },
  required: true,
  depends_on: ["workspace", "table"],  // 任意一项变更时重新拉取
  mapping_method: "map_record_fields",
}
```

在 `resource_mapping` 回调中，从 `parameters` 读取上游参数以确定需要查询哪个 Schema：

```typescript
resource_mapping: {
  map_record_fields: async ({ args }) => {
    const tableId = extractResourceLocator(args.parameters.table)
    if (!tableId) return { fields: [], empty_fields_notice: { en_US: "Select a table first.", zh_Hans: "请先选择一张表。" } }
    // 拉取并返回该表格的 Schema
  },
},
```

---

### 使用 extractResourceMapper

SDK 提供了一个辅助函数，用于从 `ResourceMapperValue` 中提取字段映射对象：

```typescript
import { extractResourceMapper } from "@choiceopen/atomemo-plugin-sdk-js"

invoke: async ({ args }) => {
  const { parameters } = args

  // 返回 Record<string, unknown> | null
  const fieldValues = extractResourceMapper(parameters.fields)

  if (fieldValues) {
    // { "name": "Alice", "age": 30, "active": true }
    await apiClient.createRecord(fieldValues)
  }
}
```

| 参数 | 类型 | 说明 |
| ---- | ---- | ---- |
| `value` | `unknown` | 原始参数值（内部通过 Zod 验证） |

返回 `Record<string, unknown> | null`。以下情况会抛出错误：

- 值未通过 Schema 验证
- 值为纯字符串（ResourceMapperValue 中 value 为字符串时，代表的是表达式或未能成功解析为 object 的输入内容。无论如何，插件工具接收到的参数如果是字符串，说明表达式未能成功被计算出 object，或者编辑者在 json editor 中手动输入了无效的 object）

---

### UI 行为

该字段渲染为一个带有**映射模式**选择器的区块：

#### 手动模式

1. UI 在挂载时（以及 `depends_on` 参数发生变化时）调用 `resource_mapping` 以加载可用字段。
2. 每个字段渲染为一行带类型的输入项和删除按钮（×）：

   | 字段类型 | 输入组件 |
   | -------- | -------- |
   | `string` | 文本输入框 |
   | `number` / `integer` | 数字输入框 |
   | `boolean` | 开关 |
   | `object` / `array` | JSON 代码编辑器 |

3. 必填字段不可删除。
4. 如果字段定义中带有 `ui.hint`，会在该字段输入项下方显示提示文本。
5. **添加字段**下拉框列出所有已被删除的可选字段，方便用户恢复。
6. 若无可用字段，则显示回调返回的 `empty_fields_notice` 提示信息。

#### 自动模式

渲染一个支持表达式输入的 JSON 代码编辑器（`support_expression` 始终开启）。用户以 JSON 对象或表达式字符串的形式提供完整的映射内容。
