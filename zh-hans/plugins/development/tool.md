# 开发工具

工具是指可由 Atomemo 应用调用的第三方服务或本地函数，提供完整的 API 实现能力。例如，添加在线搜索、图像生成等额外功能。

在本指南中，我们将使用 `演示工具` 作为示例来演示如何开发工具插件。

## 目录结构

工具通常位于插件项目的 `src/tools/` 目录中。

```
my-plugin/
  src/
    tools/
      demo.ts
      search.ts
```

## 开发工具

要创建工具，需要定义一个满足 `ToolDefinition` 接口的对象。

### 1. 导入依赖

首先，导入必要的类型和实用工具。

```typescript
import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
```

### 2. 定义工具

工具定义需要以下几个关键属性：

- **name**: 工具的唯一标识符（例如 "demo-tool"）。必须在插件内唯一。
- **display_name**: 向用户显示的名称（支持 i18n）。
- **description**: 工具功能的简要描述（支持 i18n）。
- **icon**: 代表该工具的表情符号或图像 URL。
- **parameters**: 工具所需的输入参数列表。
- **invoke**: 执行工具逻辑的异步函数。
- **skill**: 描述工具输入与输出的说明文档（字符串，可选，建议使用 Markdown 格式）。

### 3. 参数

参数使用 `parameters` 数组定义。每个参数描述一个用户可以配置的输入字段或 AI 可以填充的字段。

```typescript
parameters: [
  {
    name: "location",
    type: "string",
    required: true, // 参数是否为必需
    display_name: { en_US: "Location", zh_Hans: "位置" },
    ui: {
      component: "input", // UI 组件类型（例如 input、select、textarea）
      hint: { en_US: "Enter a city, region, or country", zh_Hans: "输入城市、地区或国家" },
      placeholder: { en_US: "New York", zh_Hans: "上海" },
      support_expression: true, // 允许使用变量/表达式
      width: "full",
    },
  },
]
```

> **完整指南** ：有关使用不同类型的字段、UI 组件和验证规则定义参数，请参见 [声明式参数定义参考文档](./declarative-parameters.md)。

### 4. 实现（Invoke）

`invoke` 函数是逻辑所在的地方。它接收应用传递的参数，同时还会注入一个由 SDK 提供的运行时上下文对象，并返回一个 JSON 可序列化的结果。

在当前 SDK / Schema 中，`invoke` 的完整函数签名是：

```typescript
async invoke({ args, context }) {
  // ...
}
```

- **`args`**：本次调用的输入数据
  - `args.parameters`：根据你在 `parameters` 中定义的字段解析后的参数值
  - `args.credentials`：根据 `credential_id` 类型参数解析出来的凭证数据（以 `credential_id` 值作为 key）
- **`context`**：由 SDK 注入的运行时辅助工具，目前主要提供安全处理文件引用的 `files` 能力

一个最基础的示例：

```typescript
async invoke({ args, context }) {
  // 通过 args.parameters 访问参数
  const location = args.parameters.location

  // 如需使用 context.files，可以在这里调用（见下一节）

  // 返回一个 JSON 可序列化的对象
  return {
    message: `Testing the plugin with location: ${location}`,
  }
}
```

### 5. 使用 `context.files` 处理文件

当工具的参数中包含 `file_ref` 类型，或者你希望从工具中返回一个文件结果时，应使用 `context.files` 提供的辅助方法，而不是将文件当作普通对象随意读写。

当前 SDK 中，`context.files` 暴露的主要方法包括：

- `context.files.parseFileRef(input)`：校验未知输入并将其收窄为合法的 `file_ref`
- `context.files.download(fileRef)`：从 OSS / 远程存储下载文件内容，返回带有 `content` 的 `file_ref`
- `context.files.attachRemoteUrl(fileRef)`：为 OSS 文件引用补充可下载的远程 URL
- `context.files.upload(fileRef, { prefixKey? })`：上传内存中的文件，并返回带有 `res_key` / `remote_url` 的 OSS 文件引用

#### 5.1 从参数中读取文件并下载内容

以官方 Google Drive「上传文件」工具为例（`google-drive-upload-file`），其参数中包含一个 `file_ref` 类型的 `file` 字段：

```typescript
const fileRef = context.files.parseFileRef(p.file)
const downloaded = await context.files.download(fileRef)

const originalFilename = downloaded.filename
const bytes = new Uint8Array(
  Buffer.from(downloaded.content ?? "", "base64"),
)
```

这里有几个关键点：

- **先使用 `parseFileRef`**：确保传入的参数确实是一个符合 Schema 的 `file_ref`
- **再调用 `download`**：获取真实的文件内容（Base64 编码）的同时，仍然保持类型安全

你的自定义工具如果也需要读取文件内容，可以采用同样的模式：

```typescript
async invoke({ args, context }) {
  const fileRef = context.files.parseFileRef(args.parameters.file)
  const downloaded = await context.files.download(fileRef)

  return {
    filename: downloaded.filename,
    mime_type: downloaded.mime_type,
    size: downloaded.size,
  }
}
```

#### 5.2 在工具中生成文件并作为结果返回

如果你的工具在内存中生成了一个文件（例如从 Google Drive 下载一个文件，再交给 Atomemo 继续使用），你可以构造一个 `source: "mem"` 的 `file_ref`，然后通过 `context.files.upload` 交给 Atomemo 管理：

官方 Google Drive「下载文件」工具（`google-drive-download-file`）的核心逻辑示例：

```typescript
const bytes = new Uint8Array(arrayBuffer)
const contentBase64 = Buffer.from(bytes).toString("base64")

const fileRef: FileRef = {
  __type__: "file_ref",
  source: "mem",
  filename,
  content: contentBase64,
  mime_type: contentType,
  extension,
  size: bytes.length,
  res_key: null,
  remote_url: null,
}

const uploadResult = await context.files.upload(fileRef, {})
return uploadResult
```

在你自己的工具中，只要遵循相同的结构即可：

```typescript
async invoke({ args, context }) {
  const fileRef = {
    __type__: "file_ref",
    source: "mem",
    filename: "report.txt",
    extension: ".txt",
    mime_type: "text/plain",
    size: Buffer.byteLength("hello"),
    content: Buffer.from("hello").toString("base64"),
    res_key: null,
    remote_url: null,
  }

  // 将内存中的文件交给 Atomemo 管理，并返回一个持久化的 file_ref
  return await context.files.upload(fileRef, { prefixKey: "reports/" })
}
```

> **实践建议**：当你的工具需要处理文件（无论是作为输入还是输出）时，优先参考官方 Google Drive 插件的 `upload-a-file` 和 `download-a-file` 实现，保持与官方插件同样的模式和约定，可以最大化复用 Atomemo 已有的文件存储与权限体系。

## 完整示例

以下是 `src/tools/demo.ts` 的完整代码：

```typescript
import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"

export const demoTool = {
  name: "demo-tool",
  display_name: { en_US: "Demo Tool", zh_Hans: "演示工具" },
  description: { en_US: "A demo tool for testing", zh_Hans: "用于测试的演示工具" },
  icon: "🧰",
  parameters: [
    {
      name: "location",
      type: "string",
      required: true,
      display_name: { en_US: "Location", zh_Hans: "位置" },
      ui: {
        component: "input",
        hint: { en_US: "Enter a city, region, or country", zh_Hans: "输入城市、地区或国家" },
        placeholder: { en_US: "New York", zh_Hans: "上海" },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args, context }) {
    return {
      message: `Testing the plugin with location: ${args.parameters.location}`,
    }
  },
} satisfies ToolDefinition
```

## 注册工具

定义完成后，你需要在插件的主入口文件（通常是 `src/index.ts`）中注册该工具。

```typescript
import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import { demoTool } from "./tools/demo"

// ... 初始化插件
const plugin = await createPlugin({
  // ...
})

// 注册工具
plugin.addTool(demoTool)

// 运行插件
plugin.run()
```

## 参考

- **类型定义**: [`@choiceopen/atomemo-plugin-schema/types`](https://github.com/choice-open/atomemo-plugin-schema/tree/main/src/types) 中的 `ToolDefinition`
- **Schema**: [`@choiceopen/atomemo-plugin-schema/schema`](https://github.com/choice-open/atomemo-plugin-schema/blob/main/src/schemas/README.md) 中的 `ToolDefinitionSchema`
