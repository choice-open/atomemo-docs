# Resource Locator

`PropertyResourceLocator` lets users select a remote resource (e.g., a database record, project board, or spreadsheet row) through one of three input modes: browsing a searchable list fetched live from an API, pasting a URL (with the value auto-extracted via regex), or typing a raw ID directly.

### PropertyResourceLocator

```typescript
interface PropertyResourceLocator extends PropertyBase {
  type: "resource_locator"

  /** Available input modes. At least one mode must be provided. */
  modes: Array<ResourceLocatorMode>

  /** Default value. */
  default?: ResourceLocatorValue | null
}
```

| Field | Type | Description |
| ----- | ---- | ----------- |
| `type` | `"resource_locator"` | Property type identifier |
| `modes` | `ResourceLocatorMode[]` | Available input modes; at least one required |
| `default` | `ResourceLocatorValue` | Optional default value |

> [!NOTE]
> `resource_locator` is only supported in **Tool** parameters.

---

### ResourceLocatorMode

Each element in the `modes` array configures one input mode, determined by its `type` field:

#### `"list"` — Searchable Dropdown

```typescript
{
  type: "list"

  /** Label shown in the mode selector. Falls back to "From List" if not set. Recommended max 5 characters; longer values may be truncated. */
  display_name?: I18nText | null

  /** Placeholder text for the input. */
  placeholder?: I18nText | null

  /** Name of the method in locator_list used to fetch list data. */
  search_list_method: string

  /** Whether to show a search input inside the dropdown (default false). */
  searchable?: boolean | null
}
```

#### `"url"` — URL Regex Extraction

```typescript
{
  type: "url"

  /** Label shown in the mode selector. Falls back to "By Url" if not set. Recommended max 5 characters; longer values may be truncated. */
  display_name?: I18nText | null

  /** Placeholder text for the URL input. */
  placeholder?: I18nText | null

  extract_value: {
    type: "regex"
    /** Uses the 1st capture group as the extracted value; falls back to the full match if there are no capture groups. */
    regex: string
  }
}
```

#### `"id"` — Direct ID Input

```typescript
{
  type: "id"

  /** Label shown in the mode selector. Falls back to "By ID" if not set. Recommended max 5 characters; longer values may be truncated. */
  display_name?: I18nText | null

  /** Placeholder text for the ID input. */
  placeholder?: I18nText | null
}
```

---

### ResourceLocatorValue

The value stored at runtime for a `resource_locator` parameter:

```typescript
interface ResourceLocatorValue {
  __type__: "resource_locator"

  /** The mode the user was in when setting this value. */
  mode_name: "list" | "url" | "id"

  /** The extracted raw value (an ID string or URL, depending on the mode). */
  value: string | null

  /** Cached display label from a list selection (list mode only). */
  cached_result_label?: string | null

  /** Cached resource URL from a list selection (list mode only). */
  cached_result_url?: string | null
}
```

> `cached_result_label` and `cached_result_url` are only populated when `mode_name === "list"` and the user selected an item from the dropdown. They are for display purposes only — always use `value` as the authoritative identifier in tool logic.

---

### locator_list Callback

To make the `"list"` mode work, implement a method in `ToolDefinition.locator_list` whose key matches the `search_list_method` string declared in the mode:

```typescript
type ToolLocatorListFunction = (input: {
  /** Current tool parameters (used to determine API call context, e.g., reading a parent resource ID). */
  parameters: Record<string, unknown>
  credentials: Record<string, InputArgsCredential>
  /** The user's current search query (debounced 250ms); may be null or empty string. */
  filter?: string | null
  /** Pagination token from the previous page's response; null on the first call. */
  pagination_token?: string | null
}) => Promise<{
  results: {
    label: string        // Text displayed in the dropdown row
    value: string        // Value stored when the user selects this item
    url?: string | null  // Optional link displayed alongside the label
  }[]
  /** Omit or set to null when there are no more pages. */
  pagination_token?: string | null
}>
```

Register the function in `ToolDefinition.locator_list`:

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

### depends_on Cascading

> [!IMPORTANT]
> When a resource locator's list data depends on another parameter (e.g., listing projects within a workspace), always declare `depends_on` on the downstream locator. This causes the UI to automatically reset and re-fetch the downstream locator's data when the referenced upstream parameter changes.

Typical cascade chain:

```typescript
// Level 1: Workspace — no dependencies
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

// Level 2: Project — reset when workspace changes
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

// Level 3: Task — reset when either workspace or project changes
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

Read upstream values from `parameters` in list callbacks to narrow the API call:

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

### Using extractResourceLocator

The SDK provides a helper to extract a plain string value from a `ResourceLocatorValue` object:

```typescript
import { extractResourceLocator } from "@choiceopen/atomemo-plugin-sdk-js"

invoke: async ({ args }) => {
  const { parameters } = args

  // list and id modes — returns the raw value string
  const workspaceId = extractResourceLocator(parameters.workspace)

  // url mode — pass a regex to extract an ID from the URL string
  const projectId = extractResourceLocator(
    parameters.project,
    /https:\/\/app\.example\.com\/projects\/([A-Za-z0-9_-]+)/,
  )

  // Both return string | null
}
```

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `value` | `unknown` | Raw parameter value (validated internally via Zod) |
| `urlRegex` | `RegExp` (optional) | Applied when `mode_name === "url"`; returns the 1st capture group, or the full match if there are no capture groups |

Throws an error when:

- The value fails schema validation
- `urlRegex` is provided but does not match the URL string

---

### UI Behavior

The field renders as a two-part control:

- **Left**: A mode selector dropdown listing the `display_name` of all configured modes (defaults: "From List" / "By Url" / "By ID").
- **Right**: An adaptive input control based on the currently active mode.

| Mode | Right-side control |
| ---- | ------------------ |
| `list` | Read-only input showing the selected item's label (`cached_result_label`). Clicking opens a searchable dropdown with infinite-scroll pagination. |
| `url` | Editable text input. Regex extraction is applied when the value is consumed at runtime. |
| `id` | Editable text input. |

In **list mode**, the dropdown will:

- Fetch data immediately on open
- Debounce search input (250 ms)
- Automatically load the next page when the user scrolls to the bottom
- Show a loading indicator during initial load and pagination
- Display an error message on initial load or pagination failure
