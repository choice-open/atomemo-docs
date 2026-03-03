# Defining Plugin Credentials

Credentials are used to define authentication information that users need to connect to third-party services, such as API Keys, Access Tokens, or Base URLs.

Credentials in the Atomemo plugin system have two main purposes:

1. **Model Authentication**: Used to configure LLM adapters (Adapter), enabling the system to call model services like OpenAI and Anthropic.
2. **Tool Authorization**: Passed as parameters to tools (Tool), enabling tools to call protected external APIs.

## 1. File Structure

It's recommended to place credential definition files in the `src/credentials` directory.

```text
src/
  credentials/
    openai-api.ts    # Credential definition file
  index.ts           # Plugin entry point
```

## 2. Implement Credential Definition

You need to create an object that implements the `CredentialDefinition` interface.

Here's a complete example defining an OpenAI API Key credential:

```typescript
import type { CredentialDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

export const openaiCredential = {
  // Unique identifier for the credential
  name: "openai-api-key",

  // Display name and description
  display_name: t("OPENAI_API_KEY_DISPLAY_NAME"),
  description: t("OPENAI_API_KEY_DESCRIPTION"),

  // Icon
  icon: "🔑",

  // Define fields that users need to input
  parameters: [
    {
      name: "api_key",
      type: "string",
      required: true,
      display_name: t("API_KEY_LABEL"),
      ui: {
        component: "input",
        placeholder: "sk-...",
        sensitive: true, // Mark as sensitive field, displayed as password input in UI
        width: "full",
      },
    },
    {
      name: "base_url",
      type: "string",
      required: false,
      display_name: t("BASE_URL_LABEL"),
      default: "https://api.openai.com/v1",
      ui: {
        component: "input",
        width: "full",
      },
    },
  ],

  // Authentication function (only for models)
  // Note: If used for tools, this function will not be called
  async authenticate({ args: { credential, extra } }) {
    // Get the current model name from extra (if any)
    const model = extra.model ?? "gpt-4"

    // Return adapter configuration
    return {
      // Specify which built-in adapter to use: openai | anthropic | google_ai | deepseek
      adapter: "openai",

      // API key
      api_key: credential.api_key ?? "",

      // API endpoint
      endpoint: credential.base_url || "https://api.openai.com/v1",

      // Request header configuration
      headers: {
        Authorization: `Bearer ${credential.api_key}`,
      },
    }
  },
} satisfies CredentialDefinition
```

### Key Sections Explained

#### Parameters (Parameter Definition)

Define form fields through the `parameters` array. Each field is a `PropertyScalar` object supporting UI component configuration (like `input`, `select`), required state, and sensitivity marking (`sensitive: true`).

#### Authenticate (Authentication Function)

The `authenticate` function **only executes when credentials are used for model calls**. Its purpose is to convert user-input credentials into the configuration needed by the underlying LLM adapter.

- **Input**:
  - `credential`: Parameters filled by users (like `api_key`).
  - `extra`: Context information, such as the current `model` name.
- **Output**:
  - `adapter`: Specifies the underlying protocol adapter to use.
  - `api_key`: The API key (required).
  - `endpoint`: API address.
  - `headers`: HTTP request headers (typically used for Authorization).

## 3. Using Credentials in Tools

When credentials are used for tools (Tool), the `authenticate` function **will not** be called. Credential data is passed directly to the tool's `invoke` function as parameters.

When defining tools, you can specify which credential types the tool requires.

```typescript
// Get credentials in the tool definition's invoke function
invoke: async ({ args }) => {
  const { parameters, credentials } = args

  // Access credential fields directly
  const apiKey = credentials?.api_key

  // Use credentials to call external APIs
  // ...
}
```

## 4. Register Credentials

Finally, register the credential in your plugin's entry file:

```typescript
import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import { openaiCredential } from "./credentials/openai-api"

const plugin = await createPlugin({
  /* ... */
})

// Register credential
plugin.addCredential(openaiCredential)

plugin.run()
```

## Reference

- **Type Definition**: [`@choiceopen/atomemo-plugin-schema/types`](https://github.com/choice-open/atomemo-plugin-schema/tree/main/src/types) for `CredentialDefinition`
- **Schema**: [`@choiceopen/atomemo-plugin-schema/schema`](https://github.com/choice-open/atomemo-plugin-schema/blob/main/src/schemas/README.md) for `CredentialDefinitionSchema`
