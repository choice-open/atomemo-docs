# I18nText — Internationalized Text

All user-facing text (display names, hints, placeholders, etc.) uses the `I18nText` type:

```typescript
type I18nText = {
  en_US: string // English (required)
  zh_Hans?: string // Simplified Chinese (optional)
  [locale: string]: string // Other languages
}
```

**Example**:

```typescript
{
  display_name: {
    en_US: "API Key",
    zh_Hans: "API 密钥"
  }
}
```

> **Rule**: `en_US` is always required. When the current language is not provided, it falls back to `en_US`.

