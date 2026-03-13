# Property Type Overview

| `type` Value            | TypeScript Type              | Description             | Default UI                               |
| ----------------------- | ---------------------------- | ----------------------- | ---------------------------------------- |
| `"string"`              | `PropertyString`             | String                  | `input` (single-line input)              |
| `"number"`              | `PropertyNumber`             | Number (decimal)        | `number-input`                           |
| `"integer"`             | `PropertyNumber`             | Integer                 | `number-input`                           |
| `"boolean"`             | `PropertyBoolean`            | Boolean                 | `switch`                                 |
| `"object"`              | `PropertyObject`             | Nested object           | Flat child fields                        |
| `"array"`               | `PropertyArray`              | Array                   | `array-section` (panel)                  |
| `"credential_id"`       | `PropertyCredentialId`       | Credential reference    | `credential-select`                      |
| `"encrypted_string"`    | `PropertyEncryptedString`    | Encrypted string        | `encrypted-input`                        |
| `"file_ref"`            | `PropertyFileReference`      | File reference (opaque) | `input` (expression-only, no AI override) |
| `"discriminated_union"` | `PropertyDiscriminatedUnion` | Discriminated union     | Selector + variant panel                 |

**Support by plugin type:**

- **Tool**: All types except `encrypted_string` and `discriminated_union`.
- **Credential**: `string`, `number`, `integer`, `boolean`, `encrypted_string`.
