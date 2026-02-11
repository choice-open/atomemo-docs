---
title: Quick Start with Plugin Development
description: A ten-minute hands-on tutorial to build a complete, functional plugin from scratch.
---

# Quick Start with Plugin Development

::: info What Can You Do in 10 Minutes?
Follow this tutorial to develop a **weather lookup tool plugin**. You'll learn the complete workflow from environment setup, project creation, to local debugging.
:::

## Prerequisites

Before you begin, ensure your development environment meets the following requirements:

- **Basic Knowledge**: Familiarity with TypeScript/JavaScript basics.
- **Runtime**: Node.js v20+ (Bun v1.0+ recommended for best experience).
- **Tools**: Git v2+, modern code editor (VS Code recommended).
- **Account**: Registered {{ PRODUCT_NAME }} account.

## Step 1: Install the Command Line Tool

Open your terminal and install the official {{ PRODUCT_NAME }} plugin development tool:

```bash
$ npm install @choiceopen/atomemo-plugin-cli --global
```

::: tip Verify Installation
After installation, verify success with:

```bash
$ atomemo --version
```

:::

## Step 2: Initialize Your Project

Don't create folders manually—use the CLI to generate a standards-compliant project scaffold in one command.

### 1. Login to Your Account

Before creating a project with the CLI, log in to sync your developer information:

```bash
$ atomemo auth login
```

_The terminal will prompt you to open a login page in your browser. You can close the window after authorization succeeds._

### 2. Create Your Project

Run the initialization command, and the CLI will guide you through interactive configuration:

```bash
$ atomemo plugin init
```

::: details Interactive Configuration Example

- **Plugin Name**: `weather-lookup`
- **Description**: `Get current weather for a specific location`
- **Language**: `TypeScript`
  :::

### 3. Project Structure Overview

After creation, your directory structure will look like this:

```text
/weather-lookup
  ├── src/
  │    └── index.ts        # Plugin entry point
  ├── package.json         # Dependency management
  ├── tsconfig.json        # TypeScript configuration
  ├── .env                 # Environment variables (auto-generated)
  └── README.md
```

## Step 3: Connect and Debug

### 1. Get Debug Credentials

To connect to Hub for debugging, you need to generate a temporary development key. The new CLI provides a quick command to auto-update your `.env` file:

```bash
$ cd weather-lookup
$ atomemo plugin refresh-key
```

::: warning Credential Validity
The development key (`DEVELOPMENT_KEY`) is valid for **24 hours**. If debugging shows authentication failure or expiration, simply run `refresh-key` again.
:::

### 2. Start the Development Server

Install dependencies and start the local development service (Bun recommended):

```bash
# Install dependencies
$ bun install

# Start the service, plugin content will be bundled to dist directory in real-time
$ bun run dev
```

### 3. Connect to Hub

After building, run the following command to connect your local plugin to the debug server:

```bash
$ bun run ./dist
```

::: tip Real-time Feedback
The terminal will display connection status and interaction logs, which is your main window for verifying plugin behavior.
:::

#### Successful Connection

When you see an `ok` response like below, the connection is established and your plugin is ready to receive debug commands:

```log
RECEIVE ok debug_plugin:notion phx_reply (8) {
  status: "ok",
  response: {
    success: true,
  },
}
```

#### Connection Failed

If you encounter a `ZodError`, it usually means the `manifest` configuration doesn't meet specifications. For example, the error below indicates the `name` field contains illegal characters:

```json
ZodError: [
  {
    "origin": "string",
    "code": "invalid_format",
    "format": "regex",
    "pattern": "/^[a-zA-Z](?:(?![_-]{2,})[a-zA-Z0-9_-]){3,63}[a-zA-Z0-9]$/",
    "path": [
      "name"
    ],
    "message": "Invalid name, should match the following rules: 1. only English letters, numbers, _ and - 2. start with English letter, end with English letter or number 3. _ and - cannot appear consecutively more than twice 4. minimum length 4, maximum length 64"
  }
]
```

Check your `package.json` configuration to ensure it meets naming conventions (e.g., only English letters, numbers, underscores, and hyphens, not starting with a number).

## Next Steps

You've successfully set up your development environment. Next, you can dive deeper into:

- **[Core Concepts](./core-concepts.md)**: Understand the plugin Manifest structure and lifecycle.
- **[Developing Plugin Tools](./tool.md)**: Master tool plugin development methods and best practices.
- **[Developing Plugin Models](./model.md)**: Learn how to integrate AI model functionality into plugins.
- **[Defining Plugin Credentials](./credential.md)**: Manage sensitive information and third-party API keys.
- **[Publishing Your Plugin](./publishing.md)**: Share your plugin with the community.
