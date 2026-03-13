# Default UI Behavior

When `ui` is not specified, the system uses these defaults:

| Property Type         | Default UI Component     | Description                                        |
| --------------------- | ------------------------ | -------------------------------------------------- |
| `string`              | `input`                  | Single-line text box                               |
| `number` / `integer`  | `number-input`           | Number input box                                   |
| `boolean`             | `switch`                 | Toggle switch                                      |
| `object`              | _(no container)_         | Child fields laid out flat                         |
| `array`               | `array-section`          | Array panel, auto mode detection                   |
| `credential_id`       | `credential-select`      | Credential selector                                |
| `encrypted_string`    | `encrypted-input`        | Password input box                                 |
| `file_ref`            | `input`                  | Expression-only input, AI override always disabled |
| `discriminated_union` | `select` (discriminator) | Selector + variant panel                           |

### Array Section Auto Mode Selection

When array type has no UI specified or uses `array-section`:

- **Simple mode**: `items` is basic type (string / number / boolean)
  - One input per row + delete button
  - "Add" button at bottom

- **Compound mode**: `items` is object
  - Each item renders as collapsible panel
  - Panel title shows sequence number
  - Each item has independent delete button
