# 特殊类型 Property

### 7.1 PropertyCredentialId

引用已配置的外部服务凭证。

```typescript
interface PropertyCredentialId extends PropertyBase {
  type: "credential_id"

  /** 凭证类型名称。系统会过滤出该类型的已有凭证供选择。 */
  credential_name: string

  /** UI 配置。 */
  ui?: PropertyUICredentialId
}
```

渲染为凭证选择器下拉框，包含：

- 已有凭证列表（按 `credential_name` 过滤）
- 「新建凭证」按钮
- 未配置时的提示信息

**示例**：

```typescript
{
  name: "credential_id",
  type: "credential_id",
  display_name: { en_US: "Credential", zh_Hans: "凭证" },
  credential_name: "firecrawl",
  required: true
}
```

### 7.2 PropertyEncryptedString

用于存储敏感信息（密码、Token 等），输入时自动掩码显示。

```typescript
interface PropertyEncryptedString extends PropertyBase {
  type: "encrypted_string"
}
```

渲染为密码输入框（`encrypted-input`），存储时加密处理。

### 7.3 PropertyFileReference

引用由 Atomemo 文件存储系统管理的文件（例如由上游节点产出的文件，或之前上传到工作空间中的文件）。

```typescript
interface PropertyFileReference extends PropertyBase {
  type: "file_ref"
}
```

在自动化客户端 UI 中，该类型字段会：

- **始终渲染为仅支持表达式模式的文本输入框**。
- **强制将 `ui.component` 设为 `input`**，并开启 `support_expression = true`，同时 **禁用 AI 覆盖**（模型无法直接生成合法的文件引用值）。
- **默认没有初始值**（除非在定义中显式指定）；清空输入时，值会被设置为 `null`。

在运行时，你应当将该字段值视为一个不透明的文件引用，通过 `context.files` 相关 API 解析并下载真实文件内容或查看文件元数据。

