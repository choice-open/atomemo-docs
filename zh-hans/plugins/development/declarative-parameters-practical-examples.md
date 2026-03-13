# 实战示例

### 10.1 基础：字符串参数

```typescript
const urlParameter: PropertyString = {
  name: "url",
  type: "string",
  display_name: { en_US: "URL", zh_Hans: "URL" },
  required: true,
  ui: {
    component: "input",
    placeholder: { en_US: "https://example.com", zh_Hans: "https://example.com" },
    hint: { en_US: "The URL of the web page to scrape", zh_Hans: "要抓取的网页 URL" },
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
  display_name: { en_US: "Format", zh_Hans: "格式" },
  enum: ["markdown", "html", "rawHtml", "screenshot", "links"],
  default: "markdown",
  ui: {
    component: "select",
    searchable: true,
    options: [
      { label: { en_US: "Markdown", zh_Hans: "Markdown" }, value: "markdown" },
      { label: { en_US: "HTML", zh_Hans: "HTML" }, value: "html" },
      { label: { en_US: "Raw HTML", zh_Hans: "原始 HTML" }, value: "rawHtml" },
      { label: { en_US: "Screenshot", zh_Hans: "截图" }, value: "screenshot" },
      { label: { en_US: "Links", zh_Hans: "链接" }, value: "links" },
    ],
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
  display_name: { en_US: "Location", zh_Hans: "位置" },
  ui: {
    component: "collapsible-panel",
    default_collapsed: true,
  },
  properties: [
    {
      name: "country",
      type: "string",
      display_name: { en_US: "Country", zh_Hans: "国家" },
      default: "US",
      ui: {
        component: "select",
        options: [
          { label: { en_US: "United States", zh_Hans: "美国" }, value: "US" },
          { label: { en_US: "China", zh_Hans: "中国" }, value: "CN" },
          { label: { en_US: "Japan", zh_Hans: "日本" }, value: "JP" },
        ],
      },
      enum: ["US", "CN", "JP"],
    },
    {
      name: "languages",
      type: "array",
      display_name: { en_US: "Languages", zh_Hans: "语言" },
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
  display_name: { en_US: "Headers", zh_Hans: "请求头" },
  items: {
    name: "header",
    type: "object",
    properties: [
      {
        name: "key",
        type: "string",
        display_name: { en_US: "Key", zh_Hans: "键" },
      },
      {
        name: "value",
        type: "string",
        display_name: { en_US: "Value", zh_Hans: "值" },
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
  display_name: { en_US: "Output", zh_Hans: "输出" },
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
          display_name: { en_US: "Markdown", zh_Hans: "Markdown" },
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
          display_name: { en_US: "Structured Extract", zh_Hans: "结构化提取" },
        },
        {
          name: "schema",
          type: "object",
          display_name: { en_US: "Schema", zh_Hans: "数据结构" },
          ui: { component: "code-editor", language: "json" },
          properties: [],
        },
        {
          name: "system_prompt",
          type: "string",
          display_name: { en_US: "System Prompt", zh_Hans: "系统提示" },
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
          display_name: { en_US: "Screenshot", zh_Hans: "截图" },
        },
        {
          name: "full_page",
          type: "boolean",
          display_name: { en_US: "Full Page", zh_Hans: "全页" },
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
    display_name: { en_US: "Mode", zh_Hans: "模式" },
    enum: ["simple", "advanced"],
    default: "simple",
    ui: { component: "radio-group" },
  },
  // 仅在 Advanced 模式下显示
  {
    name: "custom_headers",
    type: "object",
    display_name: { en_US: "Custom Headers", zh_Hans: "自定义请求头" },
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
    display_name: { en_US: "Retry Count", zh_Hans: "重试次数" },
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
  display_name: { en_US: "Credential", zh_Hans: "凭证" },
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
  display_name: { en_US: "Scrape", zh_Hans: "网页抓取" },
  description: { en_US: "Scrape web pages and extract content", zh_Hans: "抓取网页并提取内容" },
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
      display_name: { en_US: "URL", zh_Hans: "URL" },
      required: true,
      ui: {
        component: "input",
        placeholder: { en_US: "https://example.com", zh_Hans: "https://example.com" },
      },
    },
    // 输出格式（多选）
    {
      name: "formats",
      type: "array",
      display_name: { en_US: "Formats", zh_Hans: "格式" },
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
      display_name: { en_US: "Options", zh_Hans: "选项" },
      ui: {
        component: "collapsible-panel",
        default_collapsed: true,
      },
      properties: [
        {
          name: "include_tags",
          type: "array",
          display_name: { en_US: "Include Tags", zh_Hans: "包含标签" },
          items: { name: "tag", type: "string" },
          ui: { component: "tag-input" },
          ai: { llm_description: "HTML tags to include in the output" },
        },
        {
          name: "exclude_tags",
          type: "array",
          display_name: { en_US: "Exclude Tags", zh_Hans: "排除标签" },
          items: { name: "tag", type: "string" },
          ui: { component: "tag-input" },
        },
        {
          name: "wait_for",
          type: "integer",
          display_name: { en_US: "Wait For", zh_Hans: "等待时间" },
          default: 0,
          minimum: 0,
          ui: {
            hint: { en_US: "Wait time in milliseconds before scraping", zh_Hans: "抓取前的等待时间（毫秒）" },
          },
        },
        {
          name: "timeout",
          type: "integer",
          display_name: { en_US: "Timeout", zh_Hans: "超时" },
          default: 30000,
        },
        {
          name: "only_main_content",
          type: "boolean",
          display_name: { en_US: "Only Main Content", zh_Hans: "仅主要内容" },
          default: true,
          ui: { component: "switch" },
        },
      ],
    },
    // HTTP Headers（带额外属性的对象）
    {
      name: "headers",
      type: "object",
      display_name: { en_US: "Headers", zh_Hans: "请求头" },
      additional_properties: true,
      properties: [],
      ui: {
        component: "collapsible-panel",
        default_collapsed: true,
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

### 10.9 文件引用参数

```typescript
const fileParameter: PropertyFileReference = {
  name: "file",
  type: "file_ref",
  display_name: { en_US: "File", zh_Hans: "文件" },
  required: true,
}
```

**用户输入示例及对应的 invoke 行为**：

```typescript
// 用户在上游节点（例如「文件上传」节点）中产生文件引用
const params = {
  file: $('File Upload').file, // 表达式解析后得到 file_ref 值
}

invoke: async ({ args, context }) => {
  const { parameters } = args

  // 将 parameters.file 视为不透明引用，通过 context.files 解析
  const fileRef = context.files.parseFileRef(parameters.file)
  const downloaded = await context.files.download(fileRef)

  // 访问元数据
  const filename = downloaded.filename
  const mimeType = downloaded.mime_type

  // 原始字节以 base64 编码形式存储在 downloaded.content 中
  const bytes = Buffer.from(downloaded.content ?? "", "base64")

  // ...使用 bytes 调用外部 API 或做文件处理
  return { success: true, filename, mimeType }
}
```

