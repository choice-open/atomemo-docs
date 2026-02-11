---
title: 快速上手插件开发
description: 十分钟跟练教程，从零构建一个完整可用的插件。
---

# 快速上手插件开发

::: info 十分钟，能做什么？
跟随本教程开发一个**查询指定地区天气**的工具插件。你将学会从环境准备、项目创建到本地调试的完整流程。
:::

## 准备工作

在开始之前，请确保你的开发环境满足以下要求：

- **基础知识**：了解 TypeScript/JavaScript 基础。
- **运行环境**：Node.js v20+ (推荐使用 Bun v1.0+ 以获得最佳体验)。
- **工具**：Git v2+，现代代码编辑器 (推荐 VS Code)。
- **账号**：已注册 {{ PRODUCT_NAME }} 账号。

## 第一步：安装命令行工具

打开终端，安装 {{ PRODUCT_NAME }} 官方插件开发工具：

```bash
$ npm install @choiceopen/atomemo-plugin-cli --global
```

::: tip 验证安装
安装完成后，可以通过以下命令验证是否成功：

```bash
$ atomemo --version
```

:::

## 第二步：初始化项目

不要手动创建文件夹——使用 CLI 可以一键生成符合规范的项目骨架。

### 1. 登录账号

在使用 CLI 创建项目之前，你需要先登录你的账号以同步开发者信息：

```bash
$ atomemo auth login
```

_终端将提示通过浏览器打开登录页面，授权成功后即可关闭窗口。_

### 2. 创建项目

运行初始化命令，CLI 会通过交互式问答引导你完成配置：

```bash
$ atomemo plugin init
```

::: details 交互式配置示例

- **Plugin Name**: `weather-lookup`
- **Description**: `Get current weather for a specific location`
- **Language**: `TypeScript`
  :::

### 3. 项目结构概览

创建完成后，生成的目录结构如下：

```text
/weather-lookup
  ├── src/
  │    └── index.ts        # 插件入口文件
  ├── package.json         # 依赖管理
  ├── tsconfig.json        # TypeScript 配置
  ├── .env                 # 环境变量（自动生成）
  └── README.md
```

## 第三步：连接与调试

### 1. 获取调试凭证

为了连接到 Hub 进行调试，你需要生成一个临时的开发密钥。新版 CLI 提供了快捷命令来自动更新 `.env` 文件：

```bash
$ cd weather-lookup
$ atomemo plugin refresh-key
```

::: warning 凭证有效期
开发密钥 (`DEVELOPMENT_KEY`) 有效期为 **24小时**。如果调试时提示认证失败或过期，只需再次运行 `refresh-key` 命令即可。
:::

### 2. 启动开发服务器

安装依赖并启动本地开发服务（推荐使用 bun）：

```bash
# 安装依赖
$ bun install

# 启动服务，插件内容将实时打包到 dist 目录
$ bun run dev
```

### 3. 连接到 Hub

构建完成后，运行以下命令将本地插件连接到调试服务器：

```bash
$ bun run ./dist
```

::: tip 实时反馈
终端将显示连接状态与交互日志，这是你验证插件行为的主要窗口。
:::

#### 连接成功

当看到如下 `ok` 响应时，说明连接建立成功，插件已准备好接收调试指令：

```log
RECEIVE ok debug_plugin:notion phx_reply (8) {
  status: "ok",
  response: {
    success: true,
  },
}
```

#### 连接失败

如果遇到 `ZodError`，通常意味着 `manifest` 配置不符合规范。例如下所示的错误提示 `name` 字段包含非法字符：

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

此时请检查 `package.json` 中的配置项是否满足命名规范（如仅允许英文字母、数字、下划线和连字符，且不以数字开头）。

## 下一步

你已经成功搭建了开发环境，接下来可以深入了解：

- **[核心概念](./core-concepts.md)**：了解插件的 Manifest 结构与生命周期。
- **[开发插件工具](./tool.md)**：掌握工具型插件的开发方法与最佳实践。
- **[开发插件模型](./model.md)**：学习如何集成 AI 模型功能到插件中。
- **[开发插件凭证](./credential.md)**：管理敏感信息与第三方服务密钥。
- **[发布插件](./publish.md)**：将你的插件分享给社区。
