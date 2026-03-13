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
  display_name: { en_US: "Credential" },
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

### 7.3 PropertyFileReference

Reference to a file managed by Atomemo's file storage system (for example, a file produced by an upstream node or previously uploaded into the workspace).

```typescript
interface PropertyFileReference extends PropertyBase {
  type: "file_ref"
}
```

In the Automation client UI, this property:

- **Always renders as an expression-only text input**
- **Forces `ui.component` to `input`**, `support_expression = true`, and **disables AI override** (the model cannot fabricate file refs).
- **Does not have a default value** (unless you explicitly set one in the definition); clearing the field sets the value to `null`.

At runtime, you should treat the value as an opaque file reference and resolve it using the `context.files` APIs to download or inspect the underlying file bytes/metadata.

**Example** (from the official Google Drive plugin):

```typescript
const parameters: Array<Property> = [
  {
    name: "file",
    type: "file_ref",
    required: true,
    display_name: { en_US: "File" },
  },
]
```

