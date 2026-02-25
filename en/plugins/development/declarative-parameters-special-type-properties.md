# Special Type Properties

### 7.1 PropertyCredentialId

Reference to pre-configured external service credentials.

```typescript
interface PropertyCredentialId extends PropertyBase {
  type: "credential_id"

  /** Credential type name. System filters available credentials by this type. */
  credential_name: string

  /** UI configuration. */
  ui?: PropertyUICredentialId
}
```

Renders as a credential selector dropdown containing:

- List of available credentials (filtered by `credential_name`)
- "New Credential" button
- Prompt when not configured

**Example**:

```typescript
{
  name: "credential_id",
  type: "credential_id",
  display_name: t("CREDENTIAL_DISPLAY_NAME"),
  credential_name: "firecrawl",
  required: true
}
```

### 7.2 PropertyEncryptedString

For storing sensitive information (passwords, tokens, etc.), automatically masked on input.

```typescript
interface PropertyEncryptedString extends PropertyBase {
  type: "encrypted_string"
}
```

Renders as a password input field (`encrypted-input`), encrypted when stored.

