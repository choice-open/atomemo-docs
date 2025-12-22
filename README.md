# Autoamtion Documentation

This is the documentation site for the Autoamtion workflow platform, built with VitePress.

## Structure

```
packages/docs/
├── .vitepress/
│   └── config.ts          # VitePress configuration with i18n
├── zh-hans/               # 简体中文文档
│   ├── getting-started/
│   ├── guide/
│   ├── plugins/
│   ├── development/
│   ├── policies/
│   └── index.md
├── en/                    # English documentation
│   ├── getting-started/
│   ├── guide/
│   ├── plugins/
│   ├── development/
│   ├── policies/
│   └── index.md
```

## Languages

- **简体中文**: Available at `/zh-hans/`
- **English**: Available at `/en/`

## Development

```bash
# Start dev server
pnpm docs:dev

# Build
pnpm docs:build

# Preview build
pnpm docs:preview
```

## Adding Content

### Chinese
Add files to the `/zh-hans/` subdirectories:
- `/zh-hans/getting-started/` - 开始使用
- `/zh-hans/guide/` - 用户指南
- `/zh-hans/plugins/` - 插件
- `/zh-hans/development/` - 开发文档
- `/zh-hans/policies/` - 政策条款

### English
Add files to the `/en/` subdirectories:
- `/en/getting-started/` - Getting Started
- `/en/guide/` - Guide
- `/en/plugins/` - Plugins
- `/en/development/` - Development
- `/en/policies/` - Policies

## URL Structure

- Chinese: `http://localhost:5173/zh-hans/` (Introduction as homepage)
- English: `http://localhost:5173/en/` (Introduction as homepage)

VitePress automatically handles language switching in the UI.
