# Property 类型总览

| `type` 值               | TypeScript 类型              | 说明                  | 默认 UI                              |
| ----------------------- | ---------------------------- | --------------------- | ------------------------------------ |
| `"string"`              | `PropertyString`             | 字符串                | `input` (单行输入框)                 |
| `"number"`              | `PropertyNumber`             | 数字（含小数）        | `number-input` (数字输入框)          |
| `"integer"`             | `PropertyNumber`             | 整数                  | `number-input`                       |
| `"boolean"`             | `PropertyBoolean`            | 布尔值                | `switch` (开关)                      |
| `"object"`              | `PropertyObject`             | 嵌套对象              | 平铺子字段                           |
| `"array"`               | `PropertyArray`              | 数组                  | `array-section` (数组面板)           |
| `"credential_id"`       | `PropertyCredentialId`       | 凭证引用              | `credential-select`                  |
| `"encrypted_string"`    | `PropertyEncryptedString`    | 加密字符串            | `encrypted-input`                    |
| `"file_ref"`            | `PropertyFileReference`      | 文件引用（不透明值）  | `input` (仅表达式，不支持 AI 覆盖)  |
| `"discriminated_union"` | `PropertyDiscriminatedUnion` | 判别联合              | 选择器 + 变体面板                    |

**按功能类型的支持范围：**

- **Tool（工具）**：支持除 `encrypted_string`、`discriminated_union` 外的所有类型。
- **Credential（凭证）**：支持 `string`、`number`、`integer`、`boolean`、`encrypted_string`。
