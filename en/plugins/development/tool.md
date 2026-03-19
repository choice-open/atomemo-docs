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
```

### 2. Define the Tool

A tool definition requires the following key properties:

- **name**: Unique identifier for the tool (e.g., "demo-tool"). Must be unique within the plugin.
- **display_name**: Name displayed to users (supports i18n).
- **description**: Brief description of the tool's functionality (supports i18n).
- **icon**: Emoji or image URL representing this tool.
- **parameters**: List of input parameters required by the tool.
- **invoke**: Asynchronous function that executes the tool's logic.
- **skill**: Description of the tool's input and output (string, optional, recommended to use Markdown format).

### 3. Parameters

Parameters are defined using a `parameters` array. Each parameter describes an input field that users can configure or that AI can fill in.

```typescript
parameters: [
  {
    name: "location",
    type: "string",
    required: true, // Whether the parameter is required
    display_name: { en_US: "Location" },
    ui: {
      component: "input", // UI component type (e.g., input, select, textarea)
      hint: { en_US: "Enter a city, region, or country" },
      placeholder: { en_US: "New York" },
      support_expression: true, // Allow using variables/expressions
      width: "full",
    },
  },
]
```

> **For a comprehensive guide** on defining parameters with full control over types, UI components, and validation rules, see the [Declarative Parameter Definition Reference](./declarative-parameters.md).

### 4. Implementation (Invoke)

The `invoke` function is where your logic lives. It receives the invocation inputs together with a runtime context object injected by the SDK, and returns a JSON-serializable result.

> **Note:** If you want the node to show an error status, you must throw a JavaScript `Error` inside `invoke` (for example: `throw new Error('failed')`). Returning an object like `{ error: "lorem" }` will not mark the node as errored.

The full runtime signature in the current SDK/schema is:

```typescript
async invoke({ args, context }) {
  // ...
}
```

- **`args`**: the inputs for this invocation
  - `args.parameters`: resolved parameter values matching your `parameters` definitions
  - `args.credentials`: credential data keyed by the selected credential ID value from your `credential_id` parameter
- **`context`**: a typed runtime helper injected by the SDK; currently exposes `files` helpers for safely working with Atomemo file references

A basic example:

```typescript
async invoke({ args, context }) {
  // Access parameters via args.parameters
  const location = args.parameters.location

  // context.files is available when you need file helpers (see next section)

  // Return a JSON-serializable object
  return {
    message: `Testing the plugin with location: ${location}`,
  }
}
```

### 5. Working with `context.files`

When your tool accepts a `file_ref` parameter or returns a file as its result, use the `context.files` helpers instead of treating file references as plain objects.

The current SDK exposes the following methods on `context.files`:

- `context.files.parseFileRef(input)`: validates unknown input and narrows it to a typed `file_ref`
- `context.files.download(fileRef)`: downloads an OSS/remote file into memory, returning a `file_ref` with `content`
- `context.files.attachRemoteUrl(fileRef)`: resolves a downloadable URL for an OSS-backed file reference
- `context.files.upload(fileRef, { prefixKey? })`: uploads an in-memory file and returns an OSS-backed `file_ref` with `res_key`

#### 5.1 Reading a File from Parameters

The official Google Drive upload tool (`google-drive-upload-file`) receives a `file_ref` parameter and downloads its content like this:

```typescript
const fileRef = context.files.parseFileRef(args.parameters.file)
const downloaded = await context.files.download(fileRef)

const originalFilename = downloaded.filename
const bytes = new Uint8Array(
  Buffer.from(downloaded.content ?? "", "base64"),
)
```

Key points:

- **Always call `parseFileRef` first** — it validates that the input actually conforms to the `file_ref` schema.
- **Then call `download`** — it fetches the real file content (base64-encoded) while preserving type safety.

In your own tools, the same pattern applies:

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

#### 5.2 Producing a File and Returning It

If your tool generates a file in memory and you want Atomemo to manage it, construct a `file_ref` with `source: "mem"` and upload it via the context.

The official Google Drive download tool (`google-drive-download-file`) does exactly this:

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

In your own tools, follow the same structure:

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

  // Hand the in-memory file to Atomemo and return a persistent file_ref
  return await context.files.upload(fileRef, { prefixKey: "reports/" })
}
```

> **Practical tip**: When your tool needs to handle files (as input or output), refer to the official Google Drive plugin's `upload-a-file` and `download-a-file` implementations. Following the same patterns ensures you benefit from Atomemo's built-in file storage and permission system.

## Complete Example

Here's the complete code for `src/tools/demo.ts`:

```typescript
import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"

export const demoTool = {
  name: "demo-tool",
  display_name: { en_US: "Demo Tool" },
  description: { en_US: "A demo tool for testing" },
  icon: "🧰",
  parameters: [
    {
      name: "location",
      type: "string",
      required: true,
      display_name: { en_US: "Location" },
      ui: {
        component: "input",
        hint: { en_US: "Enter a city, region, or country" },
        placeholder: { en_US: "New York" },
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
