# Advanced Patterns and Best Practices

### Shared Parameters Pattern

When multiple tools share the same parameters (e.g., credentials, pagination, sorting), extract them as shared constants:

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
    // ... other parameters
  ],
  invoke: async ({
    args,
  }: {
    args: { parameters: { [key: string]: any }; credentials: Record<string, { api_key: string }> }
  }) => {
    const { parameters, credentials } = args
    const credential = credentials[parameters.credential_id]
    // Use credential to call Notion API
    return await notionApi.createPage(parameters, credential)
  },
}
```

### Expression Support

Allow users to input dynamic expressions (reference upstream node data):

```typescript
{
  name: "message",
  type: "string",
  ui: {
    component: "textarea",
    support_expression: true  // Enable expression mode
  }
}
```

**invoke parameter example** (expression values already parsed):

```typescript
// User input expression: {{upstream_node.content}}
// System auto-parses expression, invoke receives actual value

const params = {
  message: "Hello, the page title is: Example Page",
}

invoke: async ({ args }) => {
  const { parameters } = args
  // parameters.message contains parsed content
  console.log(parameters.message)
  return { sent: true }
}
```

### Constant Fields

Set field as read-only fixed value, commonly used in discriminated union:

```typescript
{
  name: "type",
  type: "string",
  constant: "webhook",      // Value fixed as "webhook"
  display_name: t("WEBHOOK_DISPLAY_NAME")
}
```

When `constant` is set:

- Field displays as read-only
- Value auto-populated on initialization
- Cannot be modified by user

### Nested Discriminated Union

Support multi-level nested discriminated unions:

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
        // click has its own child discriminated union
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

**invoke parameter example (nested discrimination)**:

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

// Or

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

### Array Elements as Discriminated Union

Each array item can be different object forms:

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

**invoke parameter example (mixed types in array)**:

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

### Section UI Layout

Use `section` to display object name with underline at top, rendering child properties from top to bottom with indentation:

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

**invoke parameter example**:

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
  // Data structure is identical to normal object, but UI display is different
  console.log(`Selected country: ${country}`)
  console.log(`Languages available: ${languages.join(", ")}`)
  return { success: true }
}
```

