# Developing Tools

Tools are third-party services or local functions that can be invoked by Atomemo applications, providing complete API implementation capabilities. For example, you can add online search, image generation, and other additional features.

In this guide, we'll use a `demo tool` as an example to demonstrate how to develop a tool plugin.

## Directory Structure

Tools are typically located in the `src/tools/` directory of your plugin project.

```
my-plugin/
  src/
    tools/
      demo.ts
      search.ts
```

## Developing Tools

To create a tool, you need to define an object that satisfies the `ToolDefinition` interface.

### 1. Import Dependencies

First, import the necessary types and utilities.

```typescript
import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
```

### 2. Define the Tool

A tool definition requires the following key properties:

- **name**: Unique identifier for the tool (e.g., "demo-tool"). Must be unique within the plugin.
- **display_name**: Name displayed to users (supports i18n).
- **description**: Brief description of the tool's functionality (supports i18n).
- **icon**: Emoji or image URL representing this tool.
- **parameters**: List of input parameters required by the tool.
- **invoke**: Asynchronous function that executes the tool's logic.

### 3. Parameters

Parameters are defined using a `parameters` array. Each parameter describes an input field that users can configure or that AI can fill in.

```typescript
parameters: [
  {
    name: "location",
    type: "string",
    required: true, // Whether the parameter is required
    display_name: t("LOCATION_DISPLAY_NAME"),
    ui: {
      component: "input", // UI component type (e.g., input, select, textarea)
      hint: t("LOCATION_HINT"),
      placeholder: t("LOCATION_PLACEHOLDER"),
      support_expression: true, // Allow using variables/expressions
      width: "full",
    },
  },
]
```

> **For a comprehensive guide** on defining parameters with full control over types, UI components, and validation rules, see the [Declarative Parameter Definition Reference](./declarative-parameters.md).

### 4. Implementation (Invoke)

The `invoke` function is where your logic lives. It receives parameters passed by the application and returns a JSON-serializable result.

```typescript
async invoke({ args }) {
  // Access parameters via args.parameters
  const location = args.parameters.location;

  // Perform your logic here (e.g., API calls, calculations)

  // Return a JSON-serializable object
  return {
    message: `Testing the plugin with location: ${location}`,
  }
}
```

## Complete Example

Here's the complete code for `src/tools/demo.ts`:

```typescript
import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

export const demoTool = {
  name: "demo-tool",
  display_name: t("DEMO_TOOL_DISPLAY_NAME"),
  description: t("DEMO_TOOL_DESCRIPTION"),
  icon: "🧰",
  parameters: [
    {
      name: "location",
      type: "string",
      required: true,
      display_name: t("LOCATION_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("LOCATION_HINT"),
        placeholder: t("LOCATION_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    return {
      message: `Testing the plugin with location: ${args.parameters.location}`,
    }
  },
} satisfies ToolDefinition
```

## Register Tools

After defining your tool, you need to register it in your plugin's main entry file (usually `src/index.ts`).

```typescript
import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import { demoTool } from "./tools/demo"

// ... Initialize plugin
const plugin = await createPlugin({
  // ...
})

// Register tool
plugin.addTool(demoTool)

// Run plugin
plugin.run()
```

## Reference

- **Type Definition**: [`@choiceopen/atomemo-plugin-schema/types`](https://github.com/choice-open/atomemo-plugin-schema/tree/main/src/types) for `ToolDefinition`
- **Schema**: [`@choiceopen/atomemo-plugin-schema/schema`](https://github.com/choice-open/atomemo-plugin-schema/blob/main/src/schemas/README.md) for `ToolDefinitionSchema`
