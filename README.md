# Atomemo Documentation

Documentation site for the Atomemo workflow platform, built with VitePress.

## Structure

```
├── .vitepress/
│   ├── config.ts          # VitePress configuration with i18n
│   └── theme/             # Custom theme
├── zh-hans/               # Simplified Chinese
│   ├── getting-started/
│   ├── guide/
│   ├── plugins/
│   ├── development/
│   ├── policies/
│   └── index.md
├── en/                    # English
│   ├── getting-started/
│   ├── guide/
│   ├── plugins/
│   ├── development/
│   ├── policies/
│   └── index.md
```

## Languages

- **Simplified Chinese**: `/zh-hans/`
- **English**: `/en/`

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build
pnpm build

# Preview build
pnpm preview
```

## Adding Content

### Chinese (`/zh-hans/`)
- `/zh-hans/getting-started/` - Getting Started
- `/zh-hans/guide/` - User Guide
- `/zh-hans/plugins/` - Plugins
- `/zh-hans/development/` - Development
- `/zh-hans/policies/` - Policies

### English (`/en/`)
- `/en/getting-started/` - Getting Started
- `/en/guide/` - User Guide
- `/en/plugins/` - Plugins
- `/en/development/` - Development
- `/en/policies/` - Policies

## Features

- Multi-language support (Chinese/English)
- Mermaid diagram support
- Environment variable replacement in markdown
- Local search
