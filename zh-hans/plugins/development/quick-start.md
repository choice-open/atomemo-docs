---
title: 快速上手插件开发
description: 十分钟跟练教程，快速开发一个完整可用的工具插件。
---

# 快速上手

::: info 十分钟，能做什么？
跟随本教程一步一步开发一个可查询指定地区天气情况的工具插件，只需花费十分钟就可以得到一个完整可用的插件。
:::

在开始此教程之前请务必确保你的系统满足以下环境需求：

::: code-group

```plain:line-numbers [TypeScript]
Node.js v20+ 或者 Bun v1.3+(推荐)
兼容上述运行时环境的依赖管理工具（推荐 Pnpm 用于 Node.js）
现代代码编辑器（如 VSCode）或 IDE（获得良好开发体验）
Git v2+
```

```plain:line-numbers [Elixir]
Elixir 1.19.4 (compiled with Erlang/OTP 28)
现代代码编辑器（如 VSCode）或 IDE（获得良好开发体验）
Git v2+
```

:::

## 第一步：安装命令行工具

首先打开终端并使用以下命令安装命令行工具：

```shell
$ npm install @choice-open/automation-plugin-cli --global
```

::: tip 其他安装命令行工具的方法
上例假定用户使用 `npm` 全局安装命令行工具，但除此之外我们还提供了多种安装方式以符合你的本地环境。请查看 [命令行工具 - 安装](./cli#installation) 一节了解详情。
:::

接着用命令行工具新建一个插件项目，这条命令会通过一些交互向你收集创建插件项目必要的基本信息：

```shell
$ automation plugin init
```

::: tip 简短命令
如果觉得 `automation` 命令太长或是和你系统里的其他命令有冲突，也可以将其换成 `apc`（Automation Plugin CLI 的缩写）。

另外使用 `help` 子命令可以获得帮助，例如：`apc help`
:::

## 第二步：在本地运行（调试）插件项目

在新插件项目的根目录下有一个 `.env.example` 文件，复制一份重命名为 `.env` 并填上 `DEVELOPMENT_KEY` 的值，该值是每一个插件在开发时专用的，可以在 {{ PRODUCT_NAME }} 的插件页面上获取到。

::: details 关于 DEVELOPMENT_KEY 的有效期
`DEVELOPMENT_KEY` 的有效期是（自生成后）24小时，失效后插件在连接 Hub 时会收到过期提醒的消息，此时需要重新生成并替换。

发布至生产环境的插件会自动忽略 `DEVELOPMENT_KEY`，开发者无需做任何处理。
:::

接着执行启动命令，插件会通过 SDK 自动寻找并连接到 Hub，成功之后就可以开始编写代码了：

::: code-group

```shell [TypeScript]
$ cd new-plugin
$ bun run dev
```

```shell [Elixir]
$ cd new-plugin
$ mix automation.dev
```

:::