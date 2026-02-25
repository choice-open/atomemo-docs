# Property Type Overview

| `type` Value            | TypeScript Type              | Description          | Default UI                  |
| ----------------------- | ---------------------------- | -------------------- | --------------------------- |
| `"string"`              | `PropertyString`             | String               | `input` (single-line input) |
| `"number"`              | `PropertyNumber`             | Number (decimal)     | `number-input`              |
| `"integer"`             | `PropertyNumber`             | Integer              | `number-input`              |
| `"boolean"`             | `PropertyBoolean`            | Boolean              | `switch`                    |
| `"object"`              | `PropertyObject`             | Nested object        | Flat child fields           |
| `"array"`               | `PropertyArray`              | Array                | `array-section` (panel)     |
| `"credential_id"`       | `PropertyCredentialId`       | Credential reference | `credential-select`         |
| `"encrypted_string"`    | `PropertyEncryptedString`    | Encrypted string     | `encrypted-input`           |
| `"discriminated_union"` | `PropertyDiscriminatedUnion` | Discriminated union  | Selector + variant panel    |

