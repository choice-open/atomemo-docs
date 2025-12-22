---
title: Chat 触发器节点
description: 通过聊天对话触发工作流，实现对话式交互体验
---

# Chat 触发器节点

Chat 触发器节点用于通过聊天对话触发工作流执行。这是构建对话式 AI Agent 的核心节点，每个工作流只能有一个 Chat 触发器。

## 使用场景

### 典型应用
- **智能客服** - 用户发送消息触发客服响应流程
- **对话式助手** - 构建类似 ChatGPT 的对话助手
- **问答系统** - 基于用户问题触发答案生成
- **任务执行** - 通过自然语言指令触发任务
- **信息收集** - 对话式表单，通过聊天收集信息
- **交互式查询** - 自然语言查询数据库或 API

## 节点特点

### 基本特性
- **每个工作流唯一** - 一个工作流只能有一个 Chat 触发器
- **工作流入口** - 作为对话式工作流的起点
- **实时交互** - 支持用户与 AI 的实时对话
- **会话保持** - 自动维护对话上下文和会话状态
- **自定义变量** - 可以收集用户提供的额外信息

### 内置输出字段

Chat 触发器自动提供以下输出字段：

```javascript
// 基础字段
$('Chat Trigger').message      // 用户发送的消息内容
$('Chat Trigger').userId       // 用户ID
$('Chat Trigger').sessionId    // 会话ID (用于区分不同对话)
$('Chat Trigger').timestamp    // 消息时间戳

// 会话上下文
$('Chat Trigger').conversationHistory  // 对话历史记录
$('Chat Trigger').previousMessages     // 之前的消息列表
```

## 节点配置

### 基础设置(参数面板)

#### 自定义变量 (customVariables)

除了内置字段外，还可以定义自定义变量来收集额外信息。

**字段属性**:
- 可选配置
- 数组类型
- 每个变量包含：label(标签), variable(变量名), type(类型), required(是否必填)

**变量配置示例**:

```javascript
customVariables: [
  {
    label: "用户名",
    variable: "userName",
    type: "string",
    required: true,
    maxLength: 50
  },
  {
    label: "年龄",
    variable: "age",
    type: "number",
    required: false
  },
  {
    label: "城市",
    variable: "city",
    type: "string",
    required: false,
    maxLength: 30
  }
]

// 访问自定义变量
$('Chat Trigger').userName
$('Chat Trigger').age
$('Chat Trigger').city
```

**变量类型**:
- `string` - 字符串类型，可设置 maxLength
- `number` - 数字类型

**变量属性**:
- `label` - 显示给用户的标签文字 (最多30字符)
- `variable` - 变量名 (用于在表达式中引用)
- `type` - 数据类型 (string 或 number)
- `required` - 是否必填 (true/false)
- `maxLength` - 字符串最大长度 (仅 string 类型)
- `hidden` - 是否隐藏 (可选)

### 高级设置(设置面板)

#### 节点描述 (nodeDescription)

为节点添加自定义描述，帮助团队理解此触发器的用途。

```yaml
nodeDescription: "客服对话触发器 - 用户咨询时触发"
```

## 输出数据

### 内置输出字段

```javascript
// 1. 用户消息
$('Chat Trigger').message
// 示例: "今天天气怎么样?"

// 2. 用户身份
$('Chat Trigger').userId
// 示例: "user_12345"

// 3. 会话ID
$('Chat Trigger').sessionId
// 示例: "session_abc123"

// 4. 时间戳
$('Chat Trigger').timestamp
// 示例: "2024-01-15T10:30:00Z"

// 5. 对话历史
$('Chat Trigger').conversationHistory
// 示例: [
//   {role: "user", content: "你好"},
//   {role: "assistant", content: "您好！有什么可以帮您？"},
//   {role: "user", content: "今天天气怎么样?"}
// ]
```

### 自定义变量输出

```javascript
// 访问自定义变量
$('Chat Trigger').customVariableName

// 示例: 如果配置了 userName 变量
$('Chat Trigger').userName

// 在条件分支中使用
if ($('Chat Trigger').userName) {
  // 用户已提供姓名
}
```

## 工作流示例

### 示例 1: 简单问答机器人

```
Chat Trigger
  → LLM Node
    System Prompt: "你是一个友好的客服助手。"
    User Prompts: [$('Chat Trigger').message]
  → Answer Node
    Answer: $('LLM').output

用户对话:
用户: "你好"
AI: "您好！有什么可以帮您？"

用户: "你们几点营业?"
AI: "我们的营业时间是每天 9:00-21:00。"
```

### 示例 2: 带上下文的对话

```
Chat Trigger
  → LLM Node
    System Prompt: "你是智能助手，根据对话历史提供连贯的回答。"
    User Prompts: $('Chat Trigger').conversationHistory
  → Answer Node
    Answer: $('LLM').output

用户对话:
用户: "我想买个笔记本"
AI: "好的，您的预算是多少呢？"

用户: "8000左右"  // AI 记得上文是要买笔记本
AI: "明白了，8000元预算的笔记本，我推荐以下几款..."
```

### 示例 3: 使用自定义变量

```
Chat Trigger
  Custom Variables:
    - label: "会员等级", variable: "vipLevel", type: "string"
    - label: "积分", variable: "points", type: "number"

  → LLM Node
    System Prompt: `你是客服助手。
用户信息:
- 会员等级: ${$('Chat Trigger').vipLevel}
- 积分: ${$('Chat Trigger').points}

根据用户等级提供个性化服务。`
    User Prompts: [$('Chat Trigger').message]
  → Answer Node

用户: "有什么优惠吗?"
AI: (知道用户是VIP) "您是我们的VIP会员，目前有专属9折优惠..."
```

### 示例 4: AI Agent 对话助手

```
Chat Trigger
  → AI Agent Node
    System Prompt: "你是智能助手，可以帮助用户查询信息和执行任务。"

    Tools: [
      Tool 1 - HTTP Request Tool (查询天气)
      Tool 2 - HTTP Request Tool (查询订单)
      Tool 3 - Code Tool (计算器)
    ]

    Conversation History: $('Chat Trigger').conversationHistory
  → Answer Node

用户对话:
用户: "今天北京天气怎么样?"
AI: (调用天气API) "北京今天晴，15°C。"

用户: "那我的订单到哪了?"
AI: (调用订单API) "您的订单已发货，预计明天送达。"

用户: "帮我算一下 123 + 456"
AI: (调用计算器工具) "123 + 456 = 579"
```

### 示例 5: 多轮信息收集

```
Chat Trigger
  → AI Agent Node
    System Prompt: `你是预订助手，需要收集以下信息:
- 姓名
- 电话
- 入住日期
- 房间类型

逐步询问用户，直到收集完所有信息。`

    Tools: [
      Entity Recognition Tool
        Tool Description: "从对话中提取预订信息: name, phone, checkInDate, roomType"
    ]
  → Code Node (检查信息是否完整)
    Code: |
      const info = $('Entity Recognition Tool');
      const required = ['name', 'phone', 'checkInDate', 'roomType'];
      const missing = required.filter(field => !info[field]);

      return {
        complete: missing.length === 0,
        missing: missing,
        info: info
      };
  → Conditional Branch
    → [complete] → HTTP Request (创建预订) → Answer "预订成功"
    → [incomplete] → Answer "还需要提供: {missing fields}"

用户对话:
用户: "我想订房"
AI: "好的，请问您的姓名？"

用户: "张三"
AI: "张三先生/女士，请问您的联系电话？"

用户: "13800138000"
AI: "请问您计划什么时候入住？"

用户: "下周五"
AI: "请问您需要什么类型的房间？"

用户: "标准间"
AI: (信息收集完整，创建预订) "预订成功！已为您预订下周五的标准间..."
```

### 示例 6: 情感感知响应

```
Chat Trigger
  → Sentiment Analysis Node
    Input: $('Chat Trigger').message
  → LLM Node
    System Prompt: `你是客服助手。

当前用户情绪: ${$('Sentiment Analysis').sentiment}
情绪强度: ${$('Sentiment Analysis').score}

根据用户情绪调整回复风格:
- 如果用户生气或沮丧，表示理解和歉意
- 如果用户高兴，分享他们的喜悦
- 如果用户困惑，耐心解释`

    User Prompts: [$('Chat Trigger').message]
  → Answer Node

用户: "你们的服务太差了！" (负面情绪)
AI: (检测到负面情绪) "非常抱歉给您带来不好的体验，请告诉我具体是什么问题，我会尽力帮您解决。"

用户: "太好了，问题解决了！" (正面情绪)
AI: (检测到正面情绪) "太好了！很高兴能帮到您，还有其他需要帮助的吗？"
```

## 最佳实践

### 1. 合理设计自定义变量

```javascript
// 好的实践 - 必要的变量
customVariables: [
  {
    label: "会员ID",
    variable: "memberId",
    type: "string",
    required: true
  },
  {
    label: "订单号",
    variable: "orderId",
    type: "string",
    required: false,
    maxLength: 20
  }
]

// 不好的实践 - 变量过多
customVariables: [
  // 10+ 个变量...
  // 用户体验差，应该通过对话或工具获取
]
```

### 2. 利用对话历史

```javascript
LLM Node
  System Prompt: "你是智能助手，提供连贯的对话体验。"
  User Prompts: $('Chat Trigger').conversationHistory

// 而不是只传当前消息
// User Prompts: [$('Chat Trigger').message]  // 丢失上下文
```

### 3. 用户身份识别

```javascript
// 根据用户ID获取用户信息
HTTP Request Node
  URL: `https://api.example.com/users/${$('Chat Trigger').userId}`
  Method: GET

// 然后在 LLM 中使用
LLM Node
  System Prompt: `用户信息: ${$('HTTP Request').body}
根据用户信息提供个性化服务。`
```

### 4. 会话状态管理

```javascript
// 使用 sessionId 追踪会话
Code Node
  Code: |
    return {
      sessionId: $('Chat Trigger').sessionId,
      userId: $('Chat Trigger').userId,
      message: $('Chat Trigger').message,
      timestamp: $('Chat Trigger').timestamp,
      metadata: {
        // 可以添加自定义会话元数据
      }
    };

// 保存到数据库或缓存
HTTP Request Node
  URL: "https://api.example.com/sessions"
  Method: POST
  Body: $('Code').output
```

### 5. 处理多语言

```javascript
Chat Trigger
  → AI Classifier Node
    Input: $('Chat Trigger').message
    Classes: ["中文", "英文", "日文", "韩文"]
  → LLM Node
    System Prompt: `使用 ${$('AI Classifier').class} 回复用户。`
    User Prompts: [$('Chat Trigger').message]
  → Answer Node
```

### 6. 错误处理

```javascript
Chat Trigger
  → LLM Node
    Settings:
      retryOnFail: true
      maxTries: 2
      onError: continueErrorOutput
  → Conditional Branch
    Condition: $('LLM').output
    → [Success] → Answer Node
    → [Error] → Answer Node
      Answer: "抱歉，系统暂时繁忙，请稍后再试。"
```

## 常见问题

### Q1: Chat Trigger 和 Webhook Trigger 有什么区别？

**A**:

| 特性 | Chat Trigger | Webhook Trigger |
|------|-------------|-----------------|
| 触发方式 | 用户发送聊天消息 | HTTP 请求调用 |
| 使用场景 | 对话式交互 | API 集成、自动化 |
| 会话管理 | 自动维护对话上下文 | 无会话概念 |
| 响应方式 | 通过 Answer 节点回复 | 返回 HTTP 响应 |
| 每个工作流数量 | 最多1个 | 可以有多个 |

**选择建议**:
- **Chat Trigger**: 需要对话交互、AI Agent、客服系统
- **Webhook Trigger**: API 服务、自动化任务、第三方集成

### Q2: 对话历史保存多久？

**A**:
对话历史由系统自动管理：
- 单次会话内，所有历史消息都可访问
- 会话结束后，历史记录可能被清理 (取决于系统配置)
- 如需长期保存，应该在工作流中主动保存到数据库

```javascript
// 保存对话历史
Code Node
  Code: |
    return {
      sessionId: $('Chat Trigger').sessionId,
      history: $('Chat Trigger').conversationHistory,
      savedAt: new Date().toISOString()
    };

HTTP Request Node
  URL: "https://api.example.com/conversation-logs"
  Method: POST
  Body: $('Code').output
```

### Q3: 如何处理大量并发对话？

**A**:

**优化策略**:
```javascript
// 1. 使用异步处理
// 快速响应用户，后台处理复杂逻辑

// 2. 设置合理的超时
LLM Node
  Settings:
    maxTries: 2
    waitBetweenTries: 500  // 快速重试

// 3. 缓存常见问题答案
Code Node
  Code: |
    const cache = {
      "营业时间": "我们的营业时间是 9:00-21:00",
      "联系方式": "客服电话: 400-xxx-xxxx"
    };

    const message = $('Chat Trigger').message;
    if (cache[message]) {
      return {cached: true, answer: cache[message]};
    }
    return {cached: false};

Conditional Branch
  → [cached] → Answer (直接返回缓存答案)
  → [not cached] → LLM Node (调用AI)
```

### Q4: 自定义变量如何获取值？

**A**:
自定义变量的值通常由系统在触发时提供，来源可能是:

1. **从前端传入** - 用户客户端在发送消息时携带
2. **从会话上下文** - 从用户会话信息中提取
3. **从用户资料** - 从用户数据库查询

```javascript
// 如果自定义变量为空，可以在工作流中获取
HTTP Request Node
  URL: `https://api.example.com/users/${$('Chat Trigger').userId}`

Code Node
  Code: |
    const trigger = $('Chat Trigger');
    const userInfo = $('HTTP Request').body;

    return {
      userName: trigger.userName || userInfo.name,
      vipLevel: trigger.vipLevel || userInfo.vipLevel
    };
```

### Q5: 如何实现多轮对话？

**A**:
使用 `conversationHistory`:

```javascript
LLM Node
  System Prompt: "你是助手，根据对话历史提供连贯回答。"
  User Prompts: $('Chat Trigger').conversationHistory
  // 包含所有历史消息，AI 自动理解上下文

// 示例:
// conversationHistory = [
//   {role: "user", content: "我想买笔记本"},
//   {role: "assistant", content: "好的，预算多少？"},
//   {role: "user", content: "8000元"}  // 当前消息
// ]
// AI 知道"8000元"是指笔记本的预算
```

### Q6: 如何限制用户消息长度？

**A**:

```javascript
Code Node
  Code: |
    const message = $('Chat Trigger').message;
    const maxLength = 500;

    if (message.length > maxLength) {
      return {
        valid: false,
        error: `消息太长，最多 ${maxLength} 字符`
      };
    }

    return {valid: true, message: message};

Conditional Branch
  → [valid] → 继续处理
  → [invalid] → Answer Node
    Answer: $('Code').error
```

### Q7: Chat Trigger 能获取用户的地理位置吗？

**A**:
Chat Trigger 本身不直接提供地理位置，但可以：

1. **通过自定义变量** - 前端传入
```javascript
customVariables: [
  {label: "城市", variable: "city", type: "string"}
]
```

2. **从对话中提取** - 使用 Entity Recognition
```javascript
Entity Recognition Node
  Input: $('Chat Trigger').message
  Instructions: "提取用户提到的地理位置"
```

3. **从用户资料查询** - 通过 userId 查询
```javascript
HTTP Request Node
  URL: `https://api.example.com/users/${$('Chat Trigger').userId}/location`
```

### Q8: 如何测试 Chat Trigger 工作流？

**A**:

**方法 1: 使用工具栏的运行按钮**
- Chat Trigger 节点工具栏有"运行"按钮
- 点击后可以输入测试消息
- 查看工作流执行结果

**方法 2: 设置测试用户**
```javascript
Code Node
  Code: |
    // 在开发环境使用测试数据
    if (process.env.NODE_ENV === 'development') {
      return {
        userId: 'test_user_123',
        userName: '测试用户',
        vipLevel: 'Gold',
        message: $('Chat Trigger').message
      };
    }
    return $('Chat Trigger');
```

**方法 3: 查看日志**
```javascript
Code Node
  Code: |
    const trigger = $('Chat Trigger');
    console.log('Trigger data:', JSON.stringify(trigger, null, 2));
    return trigger;
```

## 下一步

- [Manual Trigger 节点](/zh-hans/guide/workflow/nodes/trigger-nodes/manual) - 了解手动触发方式
- [AI Agent 节点](/zh-hans/guide/workflow/nodes/action-nodes/ai-agent) - 构建智能对话助手
- [Answer 节点](/zh-hans/guide/workflow/nodes/action-nodes/answer) - 回复用户消息

## 相关资源

- [LLM 节点](/zh-hans/guide/workflow/nodes/action-nodes/llm) - 生成 AI 回复
- [Sentiment Analysis 节点](/zh-hans/guide/workflow/nodes/action-nodes/sentiment-analysis) - 分析用户情绪
- [Entity Recognition 节点](/zh-hans/guide/workflow/nodes/action-nodes/entity-recognition) - 从消息中提取信息
