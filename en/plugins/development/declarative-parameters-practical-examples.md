# Practical Examples

### 10.1 Basic: String Parameter

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

**User input example and corresponding invoke parameters**:

```typescript
// User enters URL
const params = {
  url: "https://example.com",
}

// tool.invoke({ args }) receives the parameters
invoke: async ({ args }) => {
  const { parameters } = args
  console.log(parameters.url) // "https://example.com"
  // Use parameters.url to call API
  return { success: true, content: "..." }
}
```

### 10.2 Enum Dropdown Selection

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

**User selection example and corresponding invoke parameters**:

```typescript
// User selects "html" from dropdown
const params = {
  format: "html",
}

// invoke receives the parameters
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

### 10.3 Nested Object + Collapsible Panel

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

**User input example and corresponding invoke parameters**:

```typescript
// User expands collapsible panel, selects country and enters language tags
const params = {
  location: {
    country: "CN",
    languages: ["Mandarin", "Cantonese", "English"],
  },
}

// invoke receives nested object
invoke: async ({ args }) => {
  const { parameters } = args
  const { country, languages } = parameters.location
  console.log(country) // "CN"
  console.log(languages) // ["Mandarin", "Cantonese", "English"]
  return { success: true }
}
```

### 10.4 Array + Key-Value Editor

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

**User adds key-value pairs example and corresponding invoke parameters**:

```typescript
// User adds multiple HTTP Headers in key-value editor
const params = {
  headers: [
    { key: "Authorization", value: "Bearer token123" },
    { key: "Content-Type", value: "application/json" },
    { key: "User-Agent", value: "MyApp/1.0" },
  ],
}

// invoke processes array
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

### 10.5 Discriminated Union — Switch Parameters by Selection

A complete real-world scenario: display different configurations based on scrape format.

```typescript
const formatsParameter: PropertyDiscriminatedUnion = {
  name: "output",
  type: "discriminated_union",
  display_name: t("OUTPUT_DISPLAY_NAME"),
  discriminator: "type",
  discriminator_ui: { component: "select" },
  any_of: [
    // Variant 1: Markdown
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
        // Markdown has no additional parameters
      ],
    },
    // Variant 2: JSON (Extract)
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
    // Variant 3: Screenshot
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

**User selects different variant invoke parameter examples**:

```typescript
// Variant 1: User selects "markdown" - no additional parameters
const params1 = {
  output: {
    type: "markdown",
  },
}

// Variant 2: User selects "extract" - includes schema and system_prompt
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

// Variant 3: User selects "screenshot" - includes full_page option
const params3 = {
  output: {
    type: "screenshot",
    full_page: true,
  },
}

// invoke switches logic based on type field
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

### 10.6 Conditional Display: Linked Parameters

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
  // Show only in Advanced mode
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
  // Show only in Advanced mode
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

**User selects different mode invoke parameter examples**:

```typescript
// Scenario 1: Simple mode - won't include custom_headers and retry_count
const paramsSimple = {
  mode: "simple",
}

// Scenario 2: Advanced mode - includes hidden fields
const paramsAdvanced = {
  mode: "advanced",
  custom_headers: {
    "X-Custom-Header": "value1",
    "X-Another-Header": "value2",
  },
  retry_count: 5,
}

// invoke logic
invoke: async ({ args }) => {
  const { parameters } = args
  if (parameters.mode === "simple") {
    // Use default configuration
    return { success: true, retry_count: 3 }
  } else {
    // Use user-defined advanced options
    return {
      success: true,
      headers: parameters.custom_headers,
      retry_count: parameters.retry_count,
    }
  }
}
```

### 10.7 Credential Parameters

```typescript
const credentialParameter: PropertyCredentialId = {
  name: "credential_id",
  type: "credential_id",
  display_name: t("CREDENTIAL_DISPLAY_NAME"),
  credential_name: "firecrawl",
  required: true,
}
```

**invoke receives credential ID example**:

```typescript
interface ToolArgs {
  parameters: { credential_id: string; url?: string }
  credentials: Record<string, { api_key: string }>
}

const params = {
  credential_id: "cred_65f3a2b9d8e1c4f7a9b2e5d1",
}

// invoke makes API call using credential
invoke: async ({ args }: { args: ToolArgs }) => {
  const { parameters, credentials } = args
  // Get credential by credential_id from credentials object
  const credentialId = parameters.credential_id
  const credential = credentials[credentialId]
  // credential = { api_key: "fc-xxxxx..." }

  // Use credential to call external API
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

### 10.8 Complete Tool Definition Example

Below is an example of a complete tool definition similar to Firecrawl Scrape:

```typescript
const scrapeTool: ToolDefinition = {
  name: "scrape-a-url",
  display_name: t("SCRAPE_TOOL_DISPLAY_NAME"),
  description: t("SCRAPE_TOOL_DESCRIPTION"),
  icon: "🔥",
  parameters: [
    // Credential
    {
      name: "credential_id",
      type: "credential_id",
      credential_name: "firecrawl",
      required: true,
    },
    // Basic parameter
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
    // Output formats (multi-select)
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
    // Advanced options (collapsible)
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
    // HTTP Headers (object with additional properties)
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
    // Actual call logic
    const { parameters, credentials } = args
    const { credential_id, url, formats, options, headers } = parameters

    // Build API request parameters
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

    // Get credential by credential_id from credentials, then call API
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

