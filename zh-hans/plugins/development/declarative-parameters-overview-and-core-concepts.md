# 概述与核心概念

Atomemo 插件系统使用 **声明式** 方式定义工具参数。你只需编写 JSON/TypeScript 配置对象，系统会自动渲染对应的表单 UI。

```
Tool Definition
-- parameters: Property[]
    -- Property
        |-- name (标识符)
        |-- type (数据类型)
        |-- display_name (显示名称)
        |-- required (是否必填)
        |-- display (条件显隐)
        |-- ui (UI 组件)
        -- ...type-specific fields
```

**核心关系**：

| 概念               | 职责                                         | 类比        |
| ------------------ | -------------------------------------------- | ----------- |
| `Property`         | 定义参数的**数据模型**——类型、约束、默认值   | JSON Schema |
| `PropertyUI`       | 定义参数的**渲染方式**——用什么组件、什么样式 | UI Hint     |
| `DisplayCondition` | 定义参数的**显示条件**——何时显示/隐藏        | 条件表达式  |

一个 `Property` 通过 `type` 确定数据类型，通过 `ui` 指定渲染组件。**不同的 `type` 可用的 `ui` 组件不同。**
