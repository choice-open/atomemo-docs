# 开发凭证

凭证（Credential）用于定义用户连接第三方服务所需的身份验证信息，例如 API Key、Access Token 或 Base URL。

凭证在 Atomemo 插件系统中主要有两个用途：

1.  **模型鉴权**：用于配置 LLM 适配器（Adapter），使系统能够调用 OpenAI、Anthropic 等模型服务。
2.  **工具授权**：作为参数传递给工具（Tool），使工具能够调用受保护的外部 API。

## 1. 文件结构

建议将凭证定义文件放置在 `src/credentials` 目录下。

```text
src/
  credentials/
    openai-api.ts    # 凭证定义文件
  index.ts           # 插件入口
```

## 2. 实现凭证定义

你需要创建一个对象来实现 `CredentialDefinition` 接口。

以下是一个定义 OpenAI API Key 凭证的完整示例：

```typescript
import type { CredentialDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"

export const openaiCredential = {
  // 凭证的唯一标识符
  name: "openai-api-key",

  // 显示名称和描述
  display_name: { en_US: "OpenAI API Key", zh_Hans: "OpenAI API 密钥" },
  description: {
    en_US: "OpenAI API credential for authentication",
    zh_Hans: "用于身份验证的 OpenAI API 凭证",
  },

  // 图标
  icon: "🔑",

  // 定义用户需要输入的字段
  parameters: [
    {
      name: "api_key",
      type: "string",
      required: true,
      display_name: { en_US: "API Key", zh_Hans: "API 密钥" },
      ui: {
        component: "input",
        placeholder: "sk-...",
        sensitive: true, // 标记为敏感字段，UI 上会显示为密码框
        width: "full",
      },
    },
    {
      name: "base_url",
      type: "string",
      required: false,
      display_name: { en_US: "Base URL", zh_Hans: "基础 URL" },
      default: "https://api.openai.com/v1",
      ui: {
        component: "input",
        width: "full",
      },
    },
  ],

  // 鉴权函数（仅用于模型）
  // 注意：如果是用于工具，此函数不会被调用
  async authenticate({ args: { credential, extra } }) {
    // 从 extra 中获取当前调用的模型名称（如果有）
    const model = extra.model ?? "gpt-4"

    // 返回适配器配置
    return {
      // 指定使用哪个内置适配器：openai | anthropic | google_ai | deepseek
      adapter: "openai",

      // API 密钥
      api_key: credential.api_key ?? "",

      // API 端点
      endpoint: credential.base_url || "https://api.openai.com/v1",

      // 请求头配置
      headers: {
        Authorization: `Bearer ${credential.api_key}`,
      },
    }
  },
} satisfies CredentialDefinition
```

### 关键部分详解

#### Parameters (参数定义)

通过 `parameters` 数组定义表单字段。每个字段是一个 `PropertyScalar` 对象，支持配置 UI 组件（如 `input`, `select`）、是否必填以及是否敏感（`sensitive: true`）。

#### Authenticate (鉴权函数)

`authenticate` 函数**仅在凭证用于模型调用时**执行。它的作用是将用户输入的凭证转换为底层 LLM 适配器所需的配置。

- **输入**:
  - `credential`: 用户填写的参数对象（如 `api_key`）。
  - `extra`: 包含上下文信息，如当前使用的 `model` 名称。
- **输出**:
  - `adapter`: 指定使用的底层协议适配器。
  - `api_key`: API 密钥（必填）。
  - `endpoint`: API 地址。
  - `headers`: HTTP 请求头（通常用于设置 Authorization）。

## 3. 在工具中使用凭证

当凭证用于工具（Tool）时，`authenticate` 函数**不会**被调用。凭证数据会直接作为参数传递给工具的 `invoke` 函数。

在定义工具时，你可以指定该工具需要使用的凭证类型。

```typescript
// 在工具定义的 invoke 函数中获取凭证
invoke: async ({ args }) => {
  const { parameters, credentials } = args

  // 直接访问凭证字段
  const apiKey = credentials?.api_key

  // 使用凭证调用外部 API
  // ...
}
```

## 4. 注册凭证

最后，在插件入口文件中注册该凭证：

```typescript
import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import { openaiCredential } from "./credentials/openai-api"

const plugin = await createPlugin({
  /* ... */
})

// 注册凭证
plugin.addCredential(openaiCredential)

plugin.run()
```

## 5. OAuth2 凭证

如果你的插件需要 OAuth2 认证（例如 Google Drive, Slack），可以通过设置 `oauth2: true` 来启用 OAuth2 支持。

### 必需参数

当启用了 `oauth2` 时，`parameters` 数组**必须**包含以下字段：

- `client_id` (string, 必需)
- `client_secret` (encrypted_string, 必需)
- `access_token` (encrypted_string)
- `refresh_token` (encrypted_string)
- `expires_at` (integer)

### 必需函数

你还需要实现以下三个函数来处理 OAuth2 流程：

1. **oauth2_build_authorize_url**: 构建授权 URL 以重定向用户。
2. **oauth2_get_token**: 使用授权码换取访问令牌。
3. **oauth2_refresh_token**: 使用刷新令牌刷新访问令牌。

### 示例

以下是一个 Google Drive OAuth2 凭证的示例：

```typescript
import type { CredentialDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"

export const googleDriveOAuth2Credential = {
  name: "google-drive-oauth2",
  display_name: { en_US: "Google Drive OAuth2", zh_Hans: "Google Drive OAuth2" },
  description: { en_US: "Google Drive integration", zh_Hans: "Google Drive 集成" },
  icon: "link:google-drive",

  // 启用 OAuth2 支持
  oauth2: true,

  parameters: [
    {
      name: "client_id",
      type: "string",
      required: true,
      display_name: { en_US: "Client ID", zh_Hans: "客户端 ID" },
      ui: {
        component: "input",
        placeholder: "输入 Client ID",
      },
    },
    {
      name: "client_secret",
      type: "encrypted_string",
      required: true,
      display_name: { en_US: "Client Secret", zh_Hans: "客户端密钥" },
      ui: {
        component: "encrypted-input",
        placeholder: "输入 Client Secret",
      },
    },
    // 内部字段用于存储令牌（通常在 UI 中隐藏，但在定义中必须存在）
    { name: "access_token", type: "encrypted_string" },
    { name: "refresh_token", type: "encrypted_string" },
    { name: "expires_at", type: "integer" },
  ],

  // 1. 构建授权 URL
  async oauth2_build_authorize_url({ args }) {
    const { client_id } = args.credential
    const { redirect_uri, state } = args

    const params = new URLSearchParams({
      client_id: client_id as string,
      redirect_uri,
      state,
      response_type: "code",
      scope: "https://www.googleapis.com/auth/drive.readonly",
      access_type: "offline", // 获取 refresh_token 所必需
      prompt: "consent",
    })

    return {
      url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
    }
  },

  // 2. 使用 Code 换取 Token
  async oauth2_get_token({ args }) {
    const { client_id, client_secret } = args.credential
    const { code, redirect_uri } = args

    // 调用提供商 API 获取 token 的具体实现...
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
        throw new Error(`获取 Token 失败: ${data.error_description || data.error}`)
    }

    return {
      parameters_patch: {
        access_token: data.access_token,
        refresh_token: data.refresh_token, // 仅在 access_type=offline 且首次授权时返回
        expires_at: Math.floor(Date.now() / 1000) + data.expires_in,
      },
    }
  },

  // 3. 刷新 Token
  async oauth2_refresh_token({ args }) {
    const { client_id, client_secret, refresh_token } = args.credential

    // 刷新 token 的具体实现...
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
        throw new Error(`刷新 Token 失败: ${data.error_description || data.error}`)
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

## 参考

- **类型定义**: [`@choiceopen/atomemo-plugin-schema/types`](https://github.com/choice-open/atomemo-plugin-schema/tree/main/src/types) 中的 `CredentialDefinition`
- **Schema**: [`@choiceopen/atomemo-plugin-schema/schema`](https://github.com/choice-open/atomemo-plugin-schema/blob/main/src/schemas/README.md) 中的 `CredentialDefinitionSchema`
