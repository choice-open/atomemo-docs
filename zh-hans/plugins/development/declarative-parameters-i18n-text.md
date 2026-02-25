# I18nText — 国际化文本

所有面向用户的文本（显示名称、提示、占位符等）均使用 `I18nText` 类型：

```typescript
type I18nText = {
  en_US: string // 英文 (必填)
  zh_Hans?: string // 简体中文 (可选)
  [locale: string]: string // 其他语言
}
```

**示例**：

```typescript
{
  display_name: {
    en_US: "API Key",
    zh_Hans: "API 密钥"
  }
}
```

> **规则**：`en_US` 始终必填，未提供当前语言时回退到 `en_US`。

