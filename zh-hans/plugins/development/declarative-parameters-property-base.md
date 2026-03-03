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

