# 高级模式与最佳实践

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
  // Section 的数据结构与普通 object 一致，但 UI 渲染也不同
  console.log(`Selected country: ${country}`)
  console.log(`Languages available: ${languages.join(", ")}`)
  return { success: true }
}
```

