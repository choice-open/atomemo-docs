# 默认 UI 行为

当不指定 `ui` 时，系统采用以下默认值：

| Property Type         | 默认 UI Component        | 说明                                      |
| --------------------- | ------------------------ | ----------------------------------------- |
| `string`              | `input`                  | 单行文本框                                |
| `number` / `integer`  | `number-input`           | 数字输入框                                |
| `boolean`             | `switch`                 | 开关                                      |
| `object`              | _(无容器)_               | 子字段平铺                                |
| `array`               | `array-section`          | 数组面板，自动选择简单/复合模式           |
| `credential_id`       | `credential-select`      | 凭证选择器                                |
| `encrypted_string`    | `encrypted-input`        | 密码输入框                                |
| `file_ref`            | `input`                  | 仅支持表达式输入，始终禁用 AI 覆盖能力    |
| `discriminated_union` | `select` (discriminator) | 选择器 + 变体面板                         |
| `resource_locator`    | 模式选择器 + 输入框      | list 模式：可搜索下拉框；url/id 模式：文本输入框 |
| `resource_mapper`     | 手动字段行               | 每个字段对应一个有类型的输入框；自动模式：JSON 编辑器 |

### Array Section 自动模式选择

当 `array` 类型不指定 UI 或使用 `array-section` 时：

- **Simple 模式**：`items` 为基础类型（string / number / boolean）
  - 每行一个输入框 + 删除按钮
  - 底部有 "添加" 按钮

- **Compound 模式**：`items` 为 object
  - 每项渲染为一个可折叠面板
  - 面板标题显示序号
  - 每项有独立的删除按钮
