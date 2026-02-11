# 开发工具

工具是指可由 Atomemo 应用调用的第三方服务或本地函数，提供完整的 API 实现能力。例如，添加在线搜索、图像生成等额外功能。

在本指南中，我们将使用 `演示工具` 作为示例来演示如何开发工具插件。

## 目录结构

工具通常位于插件项目的 `src/tools/` 目录中。

```
my-plugin/
  src/
    tools/
      demo.ts
      search.ts
```

## 开发工具

要创建工具，需要定义一个满足 `ToolDefinition` 接口的对象。

### 1. 导入依赖

首先，导入必要的类型和实用工具。

```typescript
import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
```

### 2. 定义工具

工具定义需要以下几个关键属性：

- **name**: 工具的唯一标识符（例如 "demo-tool"）。必须在插件内唯一。
- **display_name**: 向用户显示的名称（支持 i18n）。
- **description**: 工具功能的简要描述（支持 i18n）。
- **icon**: 代表该工具的表情符号或图像 URL。
- **parameters**: 工具所需的输入参数列表。
- **invoke**: 执行工具逻辑的异步函数。

### 3. 参数

参数使用 `parameters` 数组定义。每个参数描述一个用户可以配置的输入字段或 AI 可以填充的字段。

```typescript
parameters: [
  {
    name: "location",
    type: "string",
    required: true, // 参数是否为必需
    display_name: t("LOCATION_DISPLAY_NAME"),
    ui: {
      component: "input", // UI 组件类型（例如 input、select、textarea）
      hint: t("LOCATION_HINT"),
      placeholder: t("LOCATION_PLACEHOLDER"),
      support_expression: true, // 允许使用变量/表达式
      width: "full",
    },
  },
]
```

> **完整指南** ：有关使用不同类型的字段、UI 组件和验证规则定义参数，请参见 [声明式参数定义参考文档](./declarative-parameters.md)。

### 4. 实现（Invoke）

`invoke` 函数是逻辑所在的地方。它接收应用传递的参数并返回一个 JSON 可序列化的结果。

```typescript
async invoke({ args }) {
  // 通过 args.parameters 访问参数
  const location = args.parameters.location;

  // 在此执行逻辑（例如 API 调用、计算）

  // 返回一个 JSON 可序列化的对象
  return {
    message: `Testing the plugin with location: ${location}`,
  }
}
```

## 完整示例

以下是 `src/tools/demo.ts` 的完整代码：

```typescript
import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

export const demoTool = {
  name: "demo-tool",
  display_name: t("DEMO_TOOL_DISPLAY_NAME"),
  description: t("DEMO_TOOL_DESCRIPTION"),
  icon: "🧰",
  parameters: [
    {
      name: "location",
      type: "string",
      required: true,
      display_name: t("LOCATION_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("LOCATION_HINT"),
        placeholder: t("LOCATION_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    return {
      message: `Testing the plugin with location: ${args.parameters.location}`,
    }
  },
} satisfies ToolDefinition
```

## 注册工具

定义完成后，你需要在插件的主入口文件（通常是 `src/index.ts`）中注册该工具。

```typescript
import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import { demoTool } from "./tools/demo"

// ... 初始化插件
const plugin = await createPlugin({
  // ...
})

// 注册工具
plugin.addTool(demoTool)

// 运行插件
plugin.run()
```

## 参考

- **类型定义**: [`@choiceopen/atomemo-plugin-schema/types`](https://github.com/choice-open/atomemo-plugin-schema/tree/main/src/types) 中的 `ToolDefinition`
- **Schema**: [`@choiceopen/atomemo-plugin-schema/schema`](https://github.com/choice-open/atomemo-plugin-schema/tree/main/src/schemas) 中的 `ToolDefinitionSchema`
