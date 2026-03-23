# 资源定位器（Resource Locator）

`PropertyResourceLocator` 允许用户通过三种输入模式之一来选取远程资源（例如数据库记录、项目看板或电子表格行）：从实时 API 拉取的可搜索列表中浏览、粘贴 URL（通过正则表达式自动提取值）或直接输入原始 ID。

### PropertyResourceLocator

```typescript
interface PropertyResourceLocator extends PropertyBase {
  type: "resource_locator"

  /** 可用输入模式。至少需要提供一种模式。 */
  modes: Array<ResourceLocatorMode>

  /** 默认值。 */
  default?: ResourceLocatorValue | null
}
```

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `type` | `"resource_locator"` | Property 类型标识符 |
| `modes` | `ResourceLocatorMode[]` | 可用输入模式，至少需要一种 |
| `default` | `ResourceLocatorValue` | 可选默认值 |

> [!NOTE]
> `resource_locator` 仅在 **Tool（工具）** 参数中受支持。

---

### ResourceLocatorMode

`modes` 数组的每个元素配置一种输入模式，由 `type` 字段决定：

#### `"list"` — 可搜索下拉列表

```typescript
{
  type: "list"

  /** 模式选择器中显示的标签。未设置时回退为 "从列表选择"。建议不超过 5 个字符，超过后可能会被截断。 */
  display_name?: I18nText | null

  /** 输入框的占位提示文本。 */
  placeholder?: I18nText | null

  /** 对应 locator_list 中用于获取列表数据的方法名。 */
  search_list_method: string

  /** 是否在下拉框中显示搜索输入框（默认 false）。 */
  searchable?: boolean | null
}
```

#### `"url"` — URL 正则提取

```typescript
{
  type: "url"

  /** 模式选择器中显示的标签。未设置时回退为 "按链接"。建议不超过 5 个字符，超过后可能会被截断。 */
  display_name?: I18nText | null

  /** URL 输入框的占位提示文本。 */
  placeholder?: I18nText | null

  extract_value: {
    type: "regex"
    /** 使用第 1 个捕获组作为提取值；无捕获组时使用完整匹配。 */
    regex: string
  }
}
```

#### `"id"` — 直接输入 ID

```typescript
{
  type: "id"

  /** 模式选择器中显示的标签。未设置时回退为 "按 ID"。建议不超过 5 个字符，超过后可能会被截断。 */
  display_name?: I18nText | null

  /** ID 输入框的占位提示文本。 */
  placeholder?: I18nText | null
}
```

---

### ResourceLocatorValue

`resource_locator` 参数在运行时存储的值：

```typescript
interface ResourceLocatorValue {
  __type__: "resource_locator"

  /** 用户设置该值时所使用的模式。 */
  mode_name: "list" | "url" | "id"

  /** 提取出的原始值（ID 字符串或 URL，具体取决于模式）。 */
  value: string | null

  /** 从列表选择中缓存的显示标签（仅 list 模式）。 */
  cached_result_label?: string | null

  /** 从列表选择中缓存的资源 URL（仅 list 模式）。 */
  cached_result_url?: string | null
}
```

> `cached_result_label` 与 `cached_result_url` 仅在 `mode_name === "list"` 且用户从下拉框中选择了某项时才会填充。它们仅用于显示目的——在工具逻辑中请始终以 `value` 作为权威标识符。

---

### locator_list 回调

要让 `"list"` 模式正常工作，需要在 `ToolDefinition.locator_list` 中实现一个方法，其键名与模式中声明的 `search_list_method` 字符串一致：

```typescript
type ToolLocatorListFunction = (input: {
  /** 当前工具参数（用于确定 API 调用的上下文，例如读取上级资源 ID）。 */
  parameters: Record<string, unknown>
  credentials: Record<string, InputArgsCredential>
  /** 用户当前的搜索关键词（已防抖 250ms），可为 null 或空字符串。 */
  filter?: string | null
  /** 上一页响应中的分页令牌，首次调用时为 null。 */
  pagination_token?: string | null
}) => Promise<{
  results: {
    label: string        // 下拉列表行中显示的文本
    value: string        // 用户选中后存储的值
    url?: string | null  // 显示在标签旁的可选链接
  }[]
  /** 没有更多页面时省略或设为 null。 */
  pagination_token?: string | null
}>
```

在 `ToolDefinition.locator_list` 中注册该函数：

```typescript
const myTool: ToolDefinition = {
  name: "my-tool",
  parameters: [ /* ... */ ],
  locator_list: {
    search_workspaces: async ({ credentials, filter }) => {
      const token = credentials["my-credential"].api_key
      const workspaces = await apiClient.listWorkspaces(token)
      return {
        results: workspaces
          .filter(w => !filter || w.name.toLowerCase().includes(filter.toLowerCase()))
          .map(w => ({ label: w.name, value: w.id })),
      }
    },
  },
  invoke: async ({ args }) => { /* ... */ },
}
```

---

### depends_on 级联模式

> [!IMPORTANT]
> 当一个资源定位器的列表数据依赖于另一个参数（例如，在某个工作空间内列出项目）时，务必在下游定位器上声明 `depends_on`。这会使 UI 在所引用的上游参数发生变化时自动重置并重新拉取下游定位器的数据。

典型的级联链：

```typescript
// 第 1 级：工作空间——无依赖
const workspaceParam: PropertyResourceLocator = {
  name: "workspace",
  type: "resource_locator",
  display_name: { en_US: "Workspace", zh_Hans: "工作空间" },
  required: true,
  modes: [
    { type: "list", search_list_method: "search_workspaces", searchable: true },
    { type: "id" },
  ],
}

// 第 2 级：项目——工作空间变更时重置
const projectParam: PropertyResourceLocator = {
  name: "project",
  type: "resource_locator",
  display_name: { en_US: "Project", zh_Hans: "项目" },
  required: true,
  depends_on: ["workspace"],
  modes: [
    { type: "list", search_list_method: "search_projects", searchable: true },
    { type: "id" },
  ],
}

// 第 3 级：任务——工作空间或项目任意变更时重置
const taskParam: PropertyResourceLocator = {
  name: "task",
  type: "resource_locator",
  display_name: { en_US: "Task", zh_Hans: "任务" },
  required: true,
  depends_on: ["workspace", "project"],
  modes: [
    { type: "list", search_list_method: "search_tasks", searchable: true },
    { type: "id" },
  ],
}
```

在列表回调中，从 `parameters` 读取上游值以缩小 API 调用范围：

```typescript
locator_list: {
  search_projects: async ({ parameters, credentials, filter }) => {
    const workspaceId = extractResourceLocator(parameters.workspace)
    if (!workspaceId) return { results: [] }
    const projects = await apiClient.listProjects(workspaceId)
    return {
      results: projects
        .filter(p => !filter || p.name.toLowerCase().includes(filter.toLowerCase()))
        .map(p => ({ label: p.name, value: p.id })),
    }
  },
  search_tasks: async ({ parameters, credentials, filter }) => {
    const projectId = extractResourceLocator(parameters.project)
    if (!projectId) return { results: [] }
    const tasks = await apiClient.listTasks(projectId)
    return {
      results: tasks
        .filter(t => !filter || t.title.toLowerCase().includes(filter.toLowerCase()))
        .map(t => ({ label: t.title, value: t.id })),
    }
  },
},
```

---

### 使用 extractResourceLocator

SDK 提供了一个辅助函数，用于从 `ResourceLocatorValue` 对象中提取纯字符串值：

```typescript
import { extractResourceLocator } from "@choiceopen/atomemo-plugin-sdk-js"

invoke: async ({ args }) => {
  const { parameters } = args

  // list 和 id 模式——返回原始值字符串
  const workspaceId = extractResourceLocator(parameters.workspace)

  // url 模式——传入正则表达式从 URL 字符串中提取 ID
  const projectId = extractResourceLocator(
    parameters.project,
    /https:\/\/app\.example\.com\/projects\/([A-Za-z0-9_-]+)/,
  )

  // 两者均返回 string | null
}
```

| 参数 | 类型 | 说明 |
| ---- | ---- | ---- |
| `value` | `unknown` | 原始参数值（内部通过 Zod 验证） |
| `urlRegex` | `RegExp`（可选） | `mode_name === "url"` 时应用；返回第 1 个捕获组，无捕获组时返回完整匹配 |

以下情况会抛出错误：

- 值未通过 Schema 验证
- 提供了 `urlRegex` 但与 URL 字符串不匹配

---

### UI 行为

该字段渲染为一个双部分控件：

- **左侧**：模式选择器下拉框，列出所有已配置模式的 `display_name`（默认标签为"从列表选择"/"按链接"/"按 ID"）。
- **右侧**：根据当前激活模式自适应的输入控件。

| 模式 | 右侧控件 |
| ---- | -------- |
| `list` | 只读输入框，显示已选项目的标签（`cached_result_label`）。点击后打开带无限滚动分页的可搜索下拉框。 |
| `url` | 可编辑文本输入框。正则提取在运行时消费该值时执行。 |
| `id` | 可编辑文本输入框。 |

在 **list 模式**下，下拉框会：

- 打开时立即拉取数据
- 对搜索输入进行防抖处理（250 ms）
- 用户滚动到底部时自动加载下一页
- 初始加载和加载更多时显示加载动画
- 初始加载或分页失败时显示错误提示
