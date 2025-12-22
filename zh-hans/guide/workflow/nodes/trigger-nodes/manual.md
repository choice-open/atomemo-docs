---
title: Manual 触发器节点
description: 手动触发工作流执行，用于测试、调试和按需执行场景
---

# Manual 触发器节点

Manual 触发器节点允许手动触发工作流执行。这是最简单的触发器类型，主要用于测试、调试工作流，或需要人工介入触发的场景。

## 使用场景

### 典型应用
- **工作流测试** - 开发和测试工作流时手动触发执行
- **工作流调试** - 逐步调试工作流逻辑
- **按需执行** - 需要时人工触发特定任务
- **定期手动任务** - 不需要自动化但需要规范流程的任务
- **Demo 演示** - 演示工作流功能时手动触发

## 节点特点

### 基本特性
- **最简单的触发器** - 无需任何配置参数
- **手动控制** - 完全由用户主动触发
- **灵活测试** - 支持在开发过程中快速测试
- **可重复执行** - 可以多次手动触发同一工作流
- **即时反馈** - 触发后立即查看执行结果

### 触发方式

**在编辑器中**:
- 点击节点工具栏的"运行"按钮
- 使用快捷键触发 (如果配置)

**通过 API**:
- 调用工作流执行 API
- 传入必要的参数

## 节点配置

### 无参数配置

Manual 触发器非常简单，不需要配置任何参数。

### 高级设置(设置面板)

#### 节点描述 (nodeDescription)

唯一可配置项是为节点添加描述。

```yaml
nodeDescription: "数据报表生成 - 每周一手动触发"
```

## 输出数据

Manual 触发器本身不输出特定数据，但可以通过手动触发时传入数据：

```javascript
// 如果通过 API 触发并传入数据
$('Manual Trigger').inputData

// 示例: API 调用时传入
{
  "date": "2024-01-15",
  "reportType": "weekly",
  "userId": "user_123"
}

// 在工作流中访问
$('Manual Trigger').date
$('Manual Trigger').reportType
$('Manual Trigger').userId
```

## 工作流示例

### 示例 1: 简单测试工作流

```
Manual Trigger
  → Code Node
    Code: |
      return {
        message: "Hello, World!",
        timestamp: new Date().toISOString()
      };
  → HTTP Request Node
    URL: "https://api.example.com/log"
    Method: POST
    Body: $('Code').output

用途: 测试 HTTP Request 节点是否正确配置
触发: 点击 Manual Trigger 的"运行"按钮
```

### 示例 2: 数据报表生成

```
Manual Trigger
  → HTTP Request Node (查询数据)
    URL: "https://api.example.com/data/weekly"
    Method: GET
  → Code Node (处理数据)
    Code: |
      const data = $('HTTP Request').body;
      // 生成报表
      return {
        report: generateReport(data),
        generatedAt: new Date().toISOString()
      };
  → HTTP Request Node (发送报表)
    URL: "https://api.example.com/reports/send"
    Method: POST
    Body: $('Code').output

用途: 每周一手动触发生成周报
触发: 管理员点击"运行"按钮
```

### 示例 3: 数据同步任务

```
Manual Trigger
  → HTTP Request Node (从源系统获取数据)
    URL: "https://source-api.example.com/products"
    Method: GET
  → Code Node (转换数据格式)
    Code: |
      const source = $('HTTP Request').body;
      return {
        products: source.items.map(item => ({
          id: item.productId,
          name: item.productName,
          price: item.price / 100  // 分转元
        }))
      };
  → HTTP Request Node (同步到目标系统)
    URL: "https://target-api.example.com/sync"
    Method: POST
    Body: $('Code').output

用途: 定期手动同步产品数据
触发: 运营人员按需触发
```

### 示例 4: 批量处理任务

```
Manual Trigger
  → HTTP Request Node (获取待处理列表)
    URL: "https://api.example.com/pending-orders"
    Method: GET
  → Code Node (批量处理)
    Code: |
      const orders = $('HTTP Request').body.orders;
      const results = [];

      for (const order of orders) {
        // 处理每个订单
        const processed = processOrder(order);
        results.push(processed);
      }

      return {
        processed: results.length,
        success: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results: results
      };
  → HTTP Request Node (发送处理结果通知)
    URL: "https://api.example.com/notifications"
    Method: POST
    Body: $('Code').output

用途: 批量处理待处理订单
触发: 需要时手动触发批处理
```

### 示例 5: 开发测试工作流

```
Manual Trigger
  → AI Classifier Node
    Input: "测试分类器: 这是一个关于产品价格的咨询"
    Classes: ["产品咨询", "价格咨询", "售后咨询", "其他"]
  → Entity Recognition Node
    Input: "测试实体识别: 我想买2个苹果，单价5元"
    JSON Schema: {
      properties: {
        product: {type: "string"},
        quantity: {type: "number"},
        price: {type: "number"}
      }
    }
  → Code Node (汇总测试结果)
    Code: |
      return {
        classifier: {
          input: "这是一个关于产品价格的咨询",
          result: $('AI Classifier').class
        },
        entityRecognition: {
          input: "我想买2个苹果，单价5元",
          result: $('Entity Recognition')
        },
        testPassed: $('AI Classifier').class === "价格咨询" &&
                    $('Entity Recognition').product === "苹果"
      };
  → Answer Node (输出测试结果)
    Answer: $('Code').testPassed ? "测试通过 ✓" : "测试失败 ✗"

用途: 测试 AI 节点是否正常工作
触发: 开发时频繁手动触发测试
```

## 最佳实践

### 1. 添加清晰的节点描述

```yaml
# 好的实践
nodeDescription: "周报生成任务 - 每周一上午执行，生成上周数据报表"

# 不好的实践
nodeDescription: ""  # 空描述，团队成员不清楚用途
```

### 2. 在开发时使用 Manual Trigger

```
开发流程:
1. 创建工作流，使用 Manual Trigger
2. 逐步添加节点，每次添加后手动触发测试
3. 确认所有节点工作正常
4. 开发完成后，替换为合适的触发器 (Chat/Webhook)
```

### 3. 测试数据准备

```javascript
// 在第一个节点准备测试数据
Code Node (紧接 Manual Trigger)
  Code: |
    // 模拟真实数据结构
    return {
      userId: "test_user_123",
      message: "测试消息",
      timestamp: new Date().toISOString(),
      metadata: {
        source: "manual_test"
      }
    };

// 后续节点使用测试数据
$('Code').userId
$('Code').message
```

### 4. 记录手动执行

```javascript
Code Node
  Code: |
    return {
      executionType: "manual",
      triggeredBy: "admin_user",  // 记录谁触发的
      triggeredAt: new Date().toISOString(),
      purpose: "weekly_report"
    };

HTTP Request Node
  URL: "https://api.example.com/execution-logs"
  Method: POST
  Body: $('Code').output
```

### 5. 添加执行确认

```javascript
// 在关键操作前确认
Code Node
  Code: |
    const action = "delete_old_records";
    const recordCount = 1000;

    // 返回警告信息
    return {
      action: action,
      warning: `即将删除 ${recordCount} 条记录，请确认`,
      proceed: true  // 实际应用中可能需要外部确认
    };

Conditional Branch
  Condition: $('Code').proceed === true
  → [True] → 执行删除操作
  → [False] → 中止执行
```

### 6. 调试时输出详细日志

```javascript
Code Node
  Code: |
    const trigger = $('Manual Trigger');
    const prevNode = $('Previous Node');

    console.log('===== DEBUG INFO =====');
    console.log('Trigger data:', JSON.stringify(trigger, null, 2));
    console.log('Previous node output:', JSON.stringify(prevNode, null, 2));
    console.log('======================');

    return {
      debug: {
        trigger,
        prevNode,
        timestamp: new Date().toISOString()
      }
    };
```

## 常见问题

### Q1: Manual Trigger 和其他触发器有什么区别？

**A**:

| 特性 | Manual Trigger | Chat Trigger | Webhook Trigger |
|------|---------------|--------------|-----------------|
| 触发方式 | 手动点击运行 | 用户发送消息 | HTTP 请求 |
| 自动化程度 | 无自动化 | 自动响应用户 | 自动接收请求 |
| 使用场景 | 测试、按需任务 | 对话交互 | API 集成 |
| 数据输入 | 通过 API 传入 | 用户消息 | HTTP 请求体 |

### Q2: 如何传入参数给 Manual Trigger？

**A**:

**方法 1: 通过 API 触发**
```bash
curl -X POST https://api.example.com/workflows/run \
  -H "Content-Type: application/json" \
  -d '{
    "workflowId": "wf_123",
    "data": {
      "param1": "value1",
      "param2": "value2"
    }
  }'
```

**方法 2: 在工作流中设置默认值**
```javascript
Code Node (第一个节点)
  Code: |
    // 如果没有输入数据，使用默认值
    const trigger = $('Manual Trigger');
    return {
      date: trigger.date || new Date().toISOString(),
      type: trigger.type || 'daily',
      userId: trigger.userId || 'default_user'
    };
```

### Q3: Manual Trigger 可以定时触发吗？

**A**:
不可以。Manual Trigger 只能手动触发。如果需要定时触发，应该：

**方案 1: 使用外部定时任务**
```bash
# Linux Crontab
0 9 * * 1 curl -X POST https://api.example.com/workflows/wf_123/run
# 每周一上午9点触发工作流
```

**方案 2: 未来可能支持的 Schedule Trigger**
```
(未来可能添加 Schedule Trigger 节点)
Schedule Trigger
  Schedule: "0 9 * * 1"  # Cron 表达式
  → ...
```

### Q4: 如何在 Manual Trigger 中模拟 Chat Trigger 的数据？

**A**:

```javascript
Code Node (紧接 Manual Trigger)
  Code: |
    // 模拟 Chat Trigger 的输出结构
    return {
      message: "这是测试消息",
      userId: "test_user_123",
      sessionId: "test_session_abc",
      timestamp: new Date().toISOString(),
      conversationHistory: [
        {role: "user", content: "你好"},
        {role: "assistant", content: "您好！"},
        {role: "user", content: "这是测试消息"}
      ]
    };

// 后续节点可以像使用 Chat Trigger 一样使用数据
LLM Node
  User Prompts: $('Code').conversationHistory
```

### Q5: Manual Trigger 适合生产环境吗？

**A**:
视情况而定：

**适合的场景**:
- 定期人工操作 (周报、月报生成)
- 按需执行的任务 (数据同步、批量处理)
- 需要人工审核后触发的流程
- 应急操作 (系统修复、数据清理)

**不适合的场景**:
- 需要自动响应用户的场景 (应用 Chat Trigger)
- 需要实时处理的场景 (应用 Webhook Trigger)
- 高频执行的场景 (应用定时触发)

**生产环境使用建议**:
```javascript
// 添加权限检查
Code Node
  Code: |
    const allowedUsers = ['admin_001', 'admin_002'];
    const currentUser = $('Manual Trigger').triggeredBy;

    if (!allowedUsers.includes(currentUser)) {
      throw new Error('无权限执行此工作流');
    }

    return {authorized: true, user: currentUser};
```

### Q6: 如何在团队中管理 Manual Trigger 工作流？

**A**:

**1. 添加清晰的文档**
```yaml
nodeDescription: "【重要】数据清理工作流
执行频率: 每月1号
执行人: 数据管理员
注意事项:
- 确认上月数据已备份
- 执行前通知相关团队
- 执行后验证数据完整性"
```

**2. 添加执行日志**
```javascript
HTTP Request Node
  URL: "https://api.example.com/workflow-logs"
  Method: POST
  Body: {
    workflowId: "wf_123",
    workflowName: "数据清理",
    executedBy: $('Manual Trigger').triggeredBy,
    executedAt: new Date().toISOString(),
    result: "success"
  }
```

**3. 添加通知**
```javascript
// 执行完成后发送通知
HTTP Request Node
  URL: "https://api.example.com/notifications"
  Method: POST
  Body: {
    channel: "slack",
    message: `工作流"数据清理"执行完成
执行人: ${$('Manual Trigger').triggeredBy}
时间: ${new Date().toISOString()}
结果: 成功`
  }
```

### Q7: 如何调试 Manual Trigger 工作流？

**A**:

**策略 1: 逐步执行**
```
1. 只保留前几个节点
2. 手动触发，查看输出
3. 逐步添加后续节点
4. 每次添加后重新触发测试
```

**策略 2: 添加断点节点**
```
Manual Trigger
  → Code Node 1 (处理数据)
  → Code Node 2 (断点 - 输出调试信息)
    Code: |
      const prev = $('Code Node 1');
      console.log('===== BREAKPOINT =====');
      console.log(JSON.stringify(prev, null, 2));
      return prev;
  → Code Node 3 (继续处理)
```

**策略 3: 使用条件分支跳过某些节点**
```
Manual Trigger
  → Code Node (设置调试标志)
    Code: |
      return {
        debugMode: true,  // 调试时设为 true
        data: {...}
      };
  → Conditional Branch
    Condition: $('Code').debugMode === false
    → [True] → 执行完整流程
    → [False] → 跳过某些节点，快速测试
```

## 下一步

- [Chat Trigger 节点](/zh-hans/guide/workflow/nodes/trigger-nodes/chat) - 了解对话触发
- [Webhook Trigger 节点](/zh-hans/guide/workflow/nodes/trigger-nodes/webhook) - 了解 API 触发
- [工作流基础](/zh-hans/guide/working-with-nodes) - 学习工作流设计

## 相关资源

- [表达式语法](/zh-hans/guide/expressions/) - 学习如何在节点中使用表达式
- [Code 节点](/zh-hans/guide/workflow/nodes/action-nodes/code) - 添加自定义逻辑
