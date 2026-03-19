# Defining Plugin Credentials

Credentials are used to define authentication information that users need to connect to third-party services, such as API Keys, Access Tokens, or Base URLs.

Credentials in the Atomemo plugin system have two main purposes:

1. **Model Authentication**: Used to configure LLM adapters (Adapter), enabling the system to call model services like OpenAI and Anthropic.
2. **Tool Authorization**: Passed to tools via `args.credentials`, enabling tools to call protected external APIs.

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

export const openaiCredential = {
  // Unique identifier for the credential
  name: "openai-api-key",

  // Display name and description
  display_name: { en_US: "OpenAI API Key" },
  description: { en_US: "OpenAI API credential for authentication" },

  // Icon
  icon: "🔑",

  // Define fields that users need to input
  parameters: [
    {
      name: "api_key",
      type: "string",
      required: true,
      display_name: { en_US: "API Key" },
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
      display_name: { en_US: "Base URL" },
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

When credentials are used for tools (Tool), the `authenticate` function **will not** be called. Credential data is passed to the tool's `invoke` function via `args.credentials`.

When defining tools, you can specify which credential types the tool requires.

```typescript
// Get credentials in the tool definition's invoke function
invoke: async ({ args }) => {
  const { parameters, credentials } = args

  // Access credential fields directly
  const credentialId = parameters.credential_id
  const apiKey = credentials?.[credentialId]?.api_key

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

## 5. OAuth2 Credential

If your plugin requires OAuth2 authentication (e.g., Google Drive, Slack), you can enable OAuth2 support by setting `oauth2: true`.

### Required Parameters

When `oauth2` is enabled, the `parameters` array **must** include the following fields:

- `access_token` (encrypted_string)
- `refresh_token` (encrypted_string)
- `expires_at` (integer)

### Required Functions

You also need to implement the following three functions to handle the OAuth2 flow:

1. **oauth2_build_authorize_url**: Constructs the authorization URL to redirect the user.
2. **oauth2_get_token**: Exchanges the authorization code for an access token.
3. **oauth2_refresh_token**: Refreshes the access token using the refresh token.

### Example

Here is an example of a Google Drive OAuth2 credential:

```typescript
import type { CredentialDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"

export const googleDriveOAuth2Credential = {
  name: "google-drive-oauth2",
  display_name: { en_US: "Google Drive OAuth2" },
  description: { en_US: "Google Drive integration" },
  icon: "link:google-drive",

  // Enable OAuth2 support
  oauth2: true,

  parameters: [
    {
      name: "client_id",
      type: "string",
      required: true,
      display_name: { en_US: "Client ID" },
      ui: {
        component: "input",
        placeholder: "Enter Client ID",
      },
    },
    {
      name: "client_secret",
      type: "encrypted_string",
      required: true,
      display_name: { en_US: "Client Secret" },
      ui: {
        component: "encrypted-input",
        placeholder: "Enter Client Secret",
      },
    },
    // Internal fields for storing tokens (hidden from UI usually, but required in definition)
    { name: "access_token", type: "encrypted_string" },
    { name: "refresh_token", type: "encrypted_string" },
    { name: "expires_at", type: "integer" },
  ],

  // 1. Build Authorization URL
  async oauth2_build_authorize_url({ args }) {
    const { client_id } = args.credential
    const { redirect_uri, state } = args

    const params = new URLSearchParams({
      client_id: client_id as string,
      redirect_uri,
      state,
      response_type: "code",
      scope: "https://www.googleapis.com/auth/drive.readonly",
      access_type: "offline", // Important for getting refresh_token
      prompt: "consent",
    })

    return {
      url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
    }
  },

  // 2. Exchange Code for Token
  async oauth2_get_token({ args }) {
    const { client_id, client_secret } = args.credential
    const { code, redirect_uri } = args

    // specific implementation to fetch token from provider...
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: client_id as string,
        client_secret: client_secret as string,
        code,
        redirect_uri,
        grant_type: "authorization_code",
      }),
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(`Failed to get token: ${data.error_description || data.error}`)
    }

    return {
      parameters_patch: {
        access_token: data.access_token,
        refresh_token: data.refresh_token, // Only returned on first consent if access_type=offline
        expires_at: Math.floor(Date.now() / 1000) + data.expires_in,
      },
    }
  },

  // 3. Refresh Token
  async oauth2_refresh_token({ args }) {
    const { client_id, client_secret, refresh_token } = args.credential

    // specific implementation to refresh token...
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: client_id as string,
        client_secret: client_secret as string,
        refresh_token: refresh_token as string,
        grant_type: "refresh_token",
      }),
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(`Failed to refresh token: ${data.error_description || data.error}`)
    }

    return {
      parameters_patch: {
        access_token: data.access_token,
        expires_at: Math.floor(Date.now() / 1000) + data.expires_in,
      },
    }
  },
} satisfies CredentialDefinition
```

## Reference

- **Type Definition**: [`@choiceopen/atomemo-plugin-schema/types`](https://github.com/choice-open/atomemo-plugin-schema/tree/main/src/types) for `CredentialDefinition`
- **Schema**: [`@choiceopen/atomemo-plugin-schema/schema`](https://github.com/choice-open/atomemo-plugin-schema/blob/main/src/schemas/README.md) for `CredentialDefinitionSchema`
