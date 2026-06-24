---
title: Form 触发器
description: 创建表单供用户填写提交，触发工作流执行，支持自定义字段和响应方式
---

# Form 触发器

Form 触发器创建一个面向用户的表单页面，用户提交后触发工作流执行。适用于收集结构化用户数据——如反馈、支持请求、注册信息等——并通过工作流自动处理。

## 使用场景

### 典型应用
- **反馈收集** - 收集用户反馈或问卷，自动处理回复
- **工单提交** - 让用户提交结构化的支持请求
- **注册表单** - 收集注册信息并触发入职流程
- **订单受理** - 通过自定义表单接收订单或预约
- **数据补充** - 收集额外的用户信息用于下游处理
- **线索获取** - 捕获潜在客户并自动录入 CRM

## 节点特点

### 基本特性
- **面向用户** - 生成独立 URL，用户可直接访问填写提交
- **自定义字段** - 定义表单字段，支持标签、类型和验证规则
- **灵活响应** - 配置提交后的反馈方式（文本提示或页面跳转）
- **测试与生产链接** - 开发和线上使用独立的表单 URL
- **品牌控制** - 可选择显示或隐藏品牌标识

### 内置输出字段

表单提交后，通过节点名称访问用户输入：

```javascript
$('Form Trigger').fieldName    // 通过变量名访问字段值
$('Form Trigger').email        // 示例：用户输入的邮箱
$('Form Trigger').feedback     // 示例：用户输入的反馈内容
```

## 节点配置

### 基础设置（参数面板）

#### 表单链接

配置触发器后，系统会生成两个表单 URL：

**测试链接**
```
https://your-domain.com/forms/test/{app-id}/{trigger-id}
```
用于开发阶段。提交测试表单后在编辑器中查看执行结果。

**生产链接**
```
https://your-domain.com/forms/{app-id}/{trigger-id}
```
发布后用于生产环境。将此链接分享给终端用户。

> **提示**：点击链接旁的复制按钮即可复制。

#### 表单标题

显示在表单顶部的标题。

```yaml
formTitle: "客户反馈"
```

- 可选，留空则不显示标题
- 建议简洁明确

#### 表单描述

标题下方的辅助说明文字，解释表单用途。

```yaml
formDescription: "请分享您的使用体验，帮助我们做得更好。"
```

- 可选，支持多行文本
- 适合放置填写说明或背景信息

#### 表单字段

定义用户需要填写的输入字段。点击**添加表单字段**创建后配置：

| 属性 | 说明 | 可选值 |
| --- | --- | --- |
| **标签（Label）** | 字段的显示名称 | 如 "您的邮箱" |
| **变量名（Variable）** | 表达式中访问该值的名称 | 如 `email` |
| **类型（Type）** | 输入数据类型（详见下方） | `string`、`number`、`file`、`array[file]`、`date`、`single_select`、`multiple_select` |
| **必填（Required）** | 是否必须填写 | `true` / `false` |
| **最大长度（Max Length）** | 最大字符数（`string`）或最大文件数（`array[file]`） | 默认 40 |
| **隐藏（Hidden）** | 在表单中隐藏该字段 | `true` / `false` |

#### 字段类型详解

| 类型 | UI 显示 | 说明 | 输出值 | 额外属性 |
| --- | --- | --- | --- | --- |
| `string` | 文本 | 单行文本输入 | `string` | `maxLength`（最大字符数） |
| `number` | 数字 | 数字输入 | `number` | — |
| `date` | 日期 | 日期选择器 | `string`（ISO 日期格式） | — |
| `file` | 单个文件 | 单个文件上传 | `FileRef`（对象） | `fileTypes`、`fileExtensions`、`fileUploadMethods` |
| `array[file]` | 文件列表 | 多个文件上传 | `FileRef[]`（数组） | `fileTypes`、`fileExtensions`、`fileUploadMethods`、`maxLength`（最大文件数） |
| `single_select` | 单选 | 下拉单选 | `string` | `options`（选项标签数组，**必填**） |
| `multiple_select` | 多选 | 下拉多选 | `string[]` | `options`（选项标签数组，**必填**） |

**文件上传相关属性**：

| 属性 | 说明 | 可选值 |
| --- | --- | --- |
| `fileTypes` | 允许的文件类别 | `document`（文档）、`image`（图片）、`custom`（自定义） |
| `fileExtensions` | 自定义文件扩展名（`fileTypes` 含 `custom` 时生效） | 如 `[".pdf", ".csv"]` |
| `fileUploadMethods` | 文件上传方式 | `local_file`（本地上传）、`remote_url`（远程 URL） |

**字段配置示例**：

```yaml
formFields:
  - label: "您的姓名"
    variable: "name"
    type: "string"
    required: true
    maxLength: 50
  - label: "邮箱地址"
    variable: "email"
    type: "string"
    required: true
    maxLength: 100
  - label: "评分 (1-5)"
    variable: "rating"
    type: "number"
    required: false
  - label: "补充说明"
    variable: "comments"
    type: "string"
    required: false
    maxLength: 500
```

> **注意**：同一个表单中，字段标签和变量名均不可重复。

#### 提交按钮标签

表单提交按钮上显示的文字。

```yaml
submitButtonLabel: "发送反馈"
```

- 默认值：`"Submit"`（英文）/ `"提交"`（中文）
- 可根据场景自定义，如"立即注册"、"提交工单"、"预约"

#### 显示品牌标识

控制是否在表单上显示 {{PRODUCT_NAME}} 品牌标识。

```yaml
showBranding: true   # 显示品牌标识（默认）
showBranding: false  # 隐藏品牌标识
```

- 开启时显示"Powered by"徽章，可点击跳转官网
- 关闭可获得无品牌体验

#### 反馈时机

控制用户提交后**何时**看到反馈：

| 模式 | 行为 |
| --- | --- |
| `lastNode` | 等待工作流完全执行完毕后再显示反馈（默认） |
| `onReceived` | 收到提交后立即显示反馈 |

```yaml
responseMode: "lastNode"    # 默认 — 等待工作流完成
responseMode: "onReceived"  # 即时反馈，工作流后台执行
```

**选择建议**：
- `lastNode` — 当你需要向用户展示工作流处理结果时（如"您的订单已确认，编号 #12345"）
- `onReceived` — 工作流耗时较长时快速确认（如"我们已收到您的请求，将尽快处理"）

#### 反馈内容

选择用户提交后看到的内容：

**文本反馈**（默认）：

```yaml
respondWith:
  type: "text"
  text: "感谢您的反馈！我们已收到。"
```

- 默认文案：`"Your response has been recorded"`（英文）/ `"您的反馈已被记录"`（中文）
- 支持多行文本

**重定向链接**：

```yaml
respondWith:
  type: "redirect"
  url: "https://example.com/thank-you"
```

- 必须是有效的 HTTP/HTTPS URL
- 表单提交后用户将被重定向至该链接

### 高级设置（设置面板）

#### 节点描述

添加描述文字，帮助团队成员识别表单用途。

## 测试与调试

### 监听测试事件

1. 在左侧面板点击**监听测试事件**
2. 测试表单会在新浏览器标签页中打开
3. 填写并提交测试表单
4. 工作流自动执行并在编辑器中显示结果
5. 点击**停止监听**停止接收测试提交

> **提示**：完成构建后，直接使用生产链接分享表单，无需点击"监听"——每次提交都会自动运行工作流。

### 手动测试

1. 在浏览器中打开测试链接
2. 填写表单字段
3. 提交表单
4. 在编辑器中查看执行结果

## 数据访问

### 访问表单数据

在后续节点中通过 `$('节点名称').变量名` 访问表单字段：

```javascript
// 访问单个字段
$('Form Trigger').name
$('Form Trigger').email
$('Form Trigger').rating

// 在 Code 节点中使用
const name = $('Form Trigger').name;
const email = $('Form Trigger').email;
return {
  greeting: `你好，${name}！`,
  recipient: email
};
```

## 工作流示例

### 示例 1：简单反馈收集

```
Form Trigger
  表单标题: "分享您的反馈"
  字段:
    - 姓名 (string, 必填)
    - 评分 (number, 1-5)
    - 意见 (string)
  → HTTP Request Node
    URL: "https://api.example.com/feedback"
    Method: POST
    Body: {
      name: $('Form Trigger').name,
      rating: $('Form Trigger').rating,
      comments: $('Form Trigger').意见
    }
```

### 示例 2：AI 智能工单

```
Form Trigger
  表单标题: "提交支持请求"
  字段:
    - 姓名 (string, 必填)
    - 邮箱 (string, 必填)
    - 问题描述 (string, 必填)
    - 优先级 (number, 1-3)
  → AI Classifier Node
    Input: $('Form Trigger').问题描述
    Classes: ["Bug", "功能请求", "使用咨询", "其他"]
  → HTTP Request Node (创建工单)
    URL: "https://api.example.com/tickets"
    Method: POST
    Body: {
      name: $('Form Trigger').姓名,
      email: $('Form Trigger').邮箱,
      issue: $('Form Trigger').问题描述,
      priority: $('Form Trigger').优先级,
      category: $('AI Classifier').class
    }
```

### 示例 3：活动报名（带跳转）

```
Form Trigger
  表单标题: "活动报名"
  字段:
    - 姓名 (string, 必填)
    - 邮箱 (string, 必填)
    - 公司 (string)
  反馈时机: lastNode
  反馈内容: 重定向至 "https://example.com/registered"
  → Code Node
    Code: |
      return {
        name: $('Form Trigger').姓名,
        email: $('Form Trigger').邮箱,
        company: $('Form Trigger').公司
      };
  → HTTP Request Node (报名)
    URL: "https://api.example.com/events/register"
    Method: POST
    Body: $('Code').output
  → Answer Node
    Answer: "报名确认，正在跳转..."
```

## 最佳实践

### 1. 重命名节点

双击节点标题，将默认的"表单提交时"改为有意义的名称：

```
# 不好的实践 — 不清楚用途
[表单提交时]

# 好的实践 — 一目了然
[客户反馈表单]
```

### 2. 保持表单简洁

只收集必要信息：

```yaml
# 好的实践 — 聚焦，3-4 个核心字段
formFields:
  - {label: "姓名", variable: "name", required: true}
  - {label: "邮箱", variable: "email", required: true}
  - {label: "留言", variable: "message", required: true}

# 不好的实践 — 字段过多，用户可能放弃
formFields:
  - # 12 个字段，包含大量非必要信息...
```

### 3. 使用有意义的变量名

```yaml
# 好的实践 — 自描述，一眼看懂
variable: "customerEmail"

# 不好的实践 — 含义不明
variable: "f1"
```

### 4. 选择合适的反馈时机

- **快速确认**：使用 `onReceived` 立即告知已收到
- **展示结果**：使用 `lastNode` 将工作流输出展示给用户

### 5. 在工作流中验证数据

即使在表单层设置了必填，也建议在工作流中添加验证：

```javascript
// Code 节点 — 额外验证
const email = $('Form Trigger').email;
const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

if (!isValid) {
  throw new Error("邮箱地址格式不正确");
}

return { email };
```

## 常见问题

### Q: 一个工作流可以有几个 Form 触发器？

**A**：没有固定数量限制。但每个 Form 触发器会生成独立的 URL，建议确保同一工作流内的多个表单逻辑上协调一致。

### Q: 可以自定义表单样式吗？

**A**：表单使用内置模板。你可以自定义标题、描述、按钮文字以及品牌标识的显示/隐藏。不支持高级 CSS 自定义。

### Q: 必填字段为空会怎样？

**A**：表单提交前会在客户端进行必填验证。用户会看到内联错误提示，未填完所有必填字段前无法提交。

### Q: 表单提交如何保障安全？

**A**：表单 URL 使用 HTTPS 加密。如需额外安全措施，可以：
- 添加 CAPTCHA 验证步骤（通过额外的工作流调用）
- 在网关层配置频率限制
- 在工作流中验证所有输入数据

### Q: 能否将表单嵌入我的网站？

**A**：表单通过独立 URL 访问。你可以通过链接分享，或使用 `<iframe>` 嵌入到你的网站中。

### Q: Form 触发器 vs Webhook 触发器用于数据采集？

**A**：

| 特性 | Form 触发器 | Webhook 触发器 |
| --- | --- | --- |
| 配置方式 | 无代码表单构建器 | 需要 HTTP 客户端 |
| 面向用户 | 非技术用户 | 开发者 / API |
| 访问入口 | 自动生成的表单页面 | API 端点 |
| 验证方式 | 内置字段验证 | 工作流中手动验证 |
| 反馈方式 | 文本提示或页面跳转 | HTTP 响应体 |

**建议**：面向普通用户的数据采集使用 Form 触发器，系统间集成使用 Webhook 触发器。

## 下一步

- [Webhook 触发器](/zh-hans/guide/workflow/nodes/trigger-nodes/webhook) - 了解 HTTP 触发方式
- [AI 分类器节点](/zh-hans/guide/workflow/nodes/action-nodes/ai-classifier) - 对表单提交内容自动分类
- [节点操作基础](/zh-hans/guide/working-with-nodes) - 学习工作流设计基础

## 相关资源

- [HTTP 请求节点](/zh-hans/guide/workflow/nodes/action-nodes/http-request) - 将表单数据发送到外部 API
- [Code 节点](/zh-hans/guide/workflow/nodes/action-nodes/code) - 添加自定义逻辑处理表单提交
- [Schedule 触发器](/zh-hans/guide/workflow/nodes/trigger-nodes/schedule) - 按计划定时触发工作流
