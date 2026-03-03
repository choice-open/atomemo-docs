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

