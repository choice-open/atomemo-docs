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

## 参考

- **类型定义**: [`@choiceopen/atomemo-plugin-schema/types`](https://github.com/choice-open/atomemo-plugin-schema/tree/main/src/types) 中的 `CredentialDefinition`
- **Schema**: [`@choiceopen/atomemo-plugin-schema/schema`](https://github.com/choice-open/atomemo-plugin-schema/blob/main/src/schemas/README.md) 中的 `CredentialDefinitionSchema`
