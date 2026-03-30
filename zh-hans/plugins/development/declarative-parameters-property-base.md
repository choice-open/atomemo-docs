# PropertyBase — 通用基础字段

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
    llm_description?: I18nText
  }

  /** 可选。UI 组件配置。不同 type 可指定的 UI 组件不同。 */
  ui?: PropertyUI

  /** 可选。级联资源字段的上游参数依赖。 */
  depends_on?: string[]

  /** 可选。在值到达插件之前由 Hub 端应用的解码器。 */
  decoder?: "json"
}
```

**字段说明**：

| 字段           | 必填 | 说明                                                        |
| -------------- | ---- | ----------------------------------------------------------- |
| `name`         | ✅   | 参数路径标识。只允许字母、数字、下划线。                    |
| `display_name` | ❌   | 表单标签。不填则使用 `name` 的 humanized 形式。             |
| `required`     | ❌   | 标记必填，表单会显示必填标记。                              |
| `display`      | ❌   | 条件显隐。见 [第 9 节](./declarative-parameters-display-condition.md)。 |
| `ai`           | ❌   | AI Agent 调用工具时的参数描述。                             |
| `ui`           | ❌   | 不填则使用该类型的默认 UI 组件。                            |
| `depends_on`   | ❌   | 级联行为的上游属性名。目前仅在 `resource_locator` 和 `resource_mapper` 上支持。 |
| `decoder`      | ❌   | Hub 端解码器。目前仅支持 `"json"`，适用于对象型属性。 |

> `depends_on` 目前仅在 `resource_locator` 与 `resource_mapper` 上支持。当需要 Hub 在调用插件前将传入的 JSON 字符串解析为对象时，请使用 `decoder: "json"`。

