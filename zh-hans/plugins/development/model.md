# 开发模型

本指南将介绍如何在插件中开发和添加一个新的模型（Model）。模型定义描述了 LLM 的基本属性、能力、定价以及参数配置。

## 准备工作

在开始之前，请确保你已经：

1. 初始化了插件项目。
2. 安装了 `@choiceopen/atomemo-plugin-sdk-js` 依赖。

## 1. 文件结构

建议将模型定义文件放置在 `src/models` 目录下，以便于管理。

```text
src/
  models/
    my-model.ts    # 模型定义文件
  index.ts         # 插件入口
```

## 2. 实现模型定义

你需要创建一个对象来实现 `ModelDefinition` 接口。这个接口定义了模型的所有元数据。

以下是一个实现 OpenAI GPT-4 模型的完整示例：

```typescript
import type { ModelDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

export const openaiGpt4 = {
  // 模型的唯一标识符
  // 建议使用 "provider/model_name" 的格式，例如 "openai/gpt-4"
  // 规则：只能包含英文字母、数字、下划线、中划线和斜杠，且长度在 4-64 之间
  name: "openai/gpt-4",

  // 模型的简短描述（支持多语言）
  description: t("OPENAI_GPT4_DESCRIPTION"),

  // 模型的显示名称（支持多语言）
  display_name: t("OPENAI_GPT4_DISPLAY_NAME"),

  // 模型图标，支持 Emoji 或图片 URL
  icon: "🔷",

  // 模型类型，目前固定为 "llm"
  model_type: "llm",

  // 支持的输入类型：text (文本), image (图片), file (文件)
  input_modalities: ["text", "image"],

  // 支持的输出类型
  output_modalities: ["text"],

  // 参数覆盖配置
  // 可以在这里自定义模型的默认参数、最大值和最小值
  override_parameters: {
    temperature: {
      default: 1.0,
      maximum: 2.0,
      minimum: 0.0,
    },
  },

  // 定价配置（可选）
  // 用于估算模型调用的成本
  pricing: {
    currency: "USD", // 货币单位
    input: 0.03, // 输入每 1K token 价格
    output: 0.06, // 输出每 1K token 价格
  },

  // 不支持的参数列表
  // 在此列出的参数将不会在用户界面的配置面板中显示
  unsupported_parameters: ["seed", "verbosity"],
} satisfies ModelDefinition
```

### 关键字段详解

- **name**: 必须唯一。插件系统通过此名称识别模型。
- **input_modalities**: 定义模型能处理的内容类型。如果模型支持视觉能力，请包含 `"image"`。
- **pricing**: 如果不提供，默认视为免费。所有价格单位通常基于 token 或请求次数。
- **unsupported_parameters**: Atomemo 提供了一套通用的 LLM 参数（如 `temperature`, `stream` 等）。如果你的模型不支持某些参数，请在此声明。

## 3. 注册模型

定义完成后，你需要在插件的主入口文件（通常是 `src/index.ts`）中注册该模型。

```typescript
import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import { openaiGpt4 } from "./models/openai-gpt4"

// ... 初始化插件
const plugin = await createPlugin({
  // ...
})

// 注册模型
plugin.addModel(openaiGpt4)

// 运行插件
plugin.run()
```

## 参考

- **类型定义**: [`@choiceopen/atomemo-plugin-schema/types`](https://github.com/choice-open/atomemo-plugin-schema/tree/main/src/types) 中的 `ModelDefinition`
- **Schema**: [`@choiceopen/atomemo-plugin-schema/schema`](https://github.com/choice-open/atomemo-plugin-schema/tree/main/src/schemas) 中的 `ModelDefinitionSchema`
