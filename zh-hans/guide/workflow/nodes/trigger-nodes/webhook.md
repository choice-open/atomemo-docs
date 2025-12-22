---
title: Webhook 触发器
description: 通过 HTTP 请求触发工作流执行
---

# Webhook 触发器

Webhook 触发器允许你的工作流通过 HTTP 请求被外部系统触发。这是最常用和最灵活的触发方式，适用于接收第三方服务的事件通知、API 集成和实时数据处理。

## 使用场景

### 典型应用
- **接收第三方事件** - GitHub webhook、Stripe 支付通知、Slack 事件等
- **API 集成** - 作为自定义 API 端点，接收外部系统请求
- **数据采集** - 收集来自前端、移动端的数据提交
- **实时通知** - 接收告警、监控系统的实时推送
- **AI Agent 触发** - 通过 HTTP 请求触发 AI 智能体执行任务

## 节点配置

### 基础设置（参数面板）

#### 1. Webhook URL

工作流发布后，系统会自动生成两种 Webhook URL：

**测试链接（Test URL）**
```
https://your-domain.com/api/test/{node-id}/{path}
```
用于开发和测试阶段，可以在编辑器中监听测试事件。

**生产链接（Production URL）**
```
https://your-domain.com/api/{node-id}/{path}
```
用于生产环境，工作流发布后可直接使用。

> **提示**：点击 URL 右侧的复制按钮即可复制链接。

#### 2. HTTP 方法

配置节点接受的 HTTP 请求方法：

**支持的方法**：
- `GET` - 适合简单的触发和参数传递
- `POST` - **推荐**，适合传输 JSON 数据
- `PUT` - 更新操作
- `DELETE` - 删除操作

**单选模式**（默认）：
- 只能选择一个 HTTP 方法
- 适合大多数场景

**多选模式**：
- 可以同时选择多个 HTTP 方法（如 `GET`, `POST`）
- 需要在设置面板中启用"允许多个 HTTP 方法"

**配置示例**：
```yaml
# 单选模式
methods: ["POST"]

# 多选模式（需启用设置）
methods: ["GET", "POST"]
```

#### 3. 路径

自定义 Webhook 的路径后缀，支持动态值。

**示例**：
```
路径: customer-signup
完整 URL: https://your-domain.com/api/{node-id}/customer-signup

路径: users/:userId
完整 URL: https://your-domain.com/api/{node-id}/users/123
```

> **提示**：路径字段支持表达式，可以使用动态变量。

#### 4. 认证方式

::: warning 功能开发中
认证功能目前正在开发中，暂不可用。当前版本中认证相关配置已被注释。
:::

计划支持的认证方式：
- **无** - 不需要认证（默认）
- **Basic Auth** - HTTP 基本认证
- **JWT Auth** - JWT 令牌认证
- **Header Auth** - 自定义请求头认证

#### 5. 响应方式

控制何时向 HTTP 请求发送响应：

**立即响应**（默认）
```yaml
respond: "immediately"
```
- 接收到请求后立即返回 200 响应
- 工作流在后台异步执行
- 适合不需要等待结果的场景

**最后一个节点完成时**
```yaml
respond: "last_node_finishes"
```
- 等待整个工作流执行完成后再响应
- 响应包含最后一个节点的输出数据
- 适合需要返回处理结果的场景

**使用 'Respond to Webhook' 节点**
```yaml
respond: "respond_to_webhook"
```
- 由工作流中的特定节点控制响应时机和内容
- 提供最大的灵活性
- 适合复杂的响应逻辑

### 高级设置（设置面板）

#### 允许多个 HTTP 方法

启用此选项后，可以在参数面板的 HTTP 方法字段中选择多个方法。

**配置**：
```yaml
allowMultipleHttpMethod: true  # 默认 false
```

#### 节点描述

为节点添加自定义描述，帮助团队成员理解节点用途。

## 测试与调试

### 使用内置测试工具

1. **监听测试事件**
   - 在左侧面板点击"监听测试事件"按钮
   - 系统会显示测试 URL 和需要发送的 HTTP 方法
   - 发送请求到测试 URL
   - 工作流会自动执行并显示结果

2. **停止监听**
   - 点击"停止监听"按钮即可停止接收测试事件

3. **切换测试/生产 URL**
   - 在参数面板顶部使用标签页切换
   - 测试 URL：用于开发测试
   - 生产 URL：用于实际部署

### 使用 cURL 测试

```bash
# 基础 POST 请求
curl -X POST https://your-domain.com/api/test/{node-id} \
  -H "Content-Type: application/json" \
  -d '{"userId": "usr_001", "action": "signup"}'

# 带路径参数
curl -X POST https://your-domain.com/api/test/{node-id}/customer-signup \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "name": "张三"}'

# GET 请求带查询参数
curl -X GET "https://your-domain.com/api/test/{node-id}?source=test&debug=true"
```

### 使用 Postman/Insomnia

1. 创建新请求
2. 从编辑器复制 Webhook URL
3. 选择对应的 HTTP 方法
4. 添加请求头和 Body（如需要）
5. 发送请求并查看结果

## 数据访问

### 请求数据结构

Webhook 触发后，可以通过 `$json` 访问请求数据：

```javascript
{
  // HTTP 方法
  "method": "POST",

  // 请求头
  "headers": {
    "content-type": "application/json",
    "user-agent": "Mozilla/5.0..."
  },

  // 请求体
  "body": {
    "userId": "usr_12345",
    "email": "user@example.com",
    "name": "张三"
  },

  // URL 查询参数
  "query": {
    "source": "mobile_app",
    "version": "2.1.0"
  },

  // 路径参数（如果使用了动态路径）
  "params": {
    "userId": "123"
  }
}
```

### 常用表达式

在后续节点中访问 Webhook 数据：

```javascript
// 访问请求体字段（需要指定节点名称）
$('Webhook触发器').body.email
$('Webhook触发器').body.userId

// 访问 URL 参数
$('Webhook触发器').query.source
$('Webhook触发器').query.page

// 访问请求头
$('Webhook触发器').headers['content-type']
$('Webhook触发器').headers['user-agent']

// 访问 HTTP 方法
$('Webhook触发器').method
```

## 工作流设计建议

### 1. 数据验证

在处理 Webhook 数据前，建议先验证数据格式：

```
Webhook 触发器
  → 条件分支（验证必填字段）
    → [是] 处理数据
    → [否] 返回错误响应
```

### 2. 错误处理

为 Webhook 工作流添加错误处理机制：

```
Webhook 触发器
  → Try/Catch
    → 主要处理逻辑
    → [失败] 记录错误日志
    → [失败] 发送告警通知
```

### 3. 异步处理长任务

对于耗时较长的操作，建议使用"立即响应"模式：

```yaml
respond: "immediately"
```

这样可以快速返回响应，避免客户端超时。

## 常见问题

### Q1: Webhook URL 会变化吗？

**A**: 每个节点的 ID 是固定的，因此 Webhook URL 在工作流创建后保持不变。但以下情况会导致 URL 变化：
- 删除并重新创建节点
- 复制节点到其他工作流

**建议**：使用环境变量或配置文件存储 Webhook URL，便于管理。

### Q2: 如何处理大量并发请求？

**A**: {{PRODUCT_NAME}} 基于 Elixir 构建，天然支持高并发：
- 单节点可处理 10,000+ 并发请求
- 自动队列和背压机制
- 可通过 K8s 水平扩展

对于极高并发场景，建议：
- 使用"立即响应"模式
- 在前端添加负载均衡
- 监控系统性能指标

### Q3: 测试 URL 和生产 URL 有什么区别？

**A**:
- **测试 URL**（`/api/test/{node-id}`）：
  - 仅在编辑器中监听时有效
  - 用于开发和调试
  - 可以实时查看执行结果

- **生产 URL**（`/api/{node-id}`）：
  - 工作流发布后即可使用
  - 无需在编辑器中监听
  - 用于实际生产环境

### Q4: 如何保护 Webhook 安全？

**A**: 当前版本推荐的安全措施：

1. **使用 HTTPS**
   - Webhook URL 默认使用 HTTPS 加密传输

2. **限制访问源**
   - 在网关层配置 IP 白名单
   - 使用防火墙规则限制访问

3. **验证请求数据**
   - 在工作流中添加数据验证逻辑
   - 使用条件分支检查必填字段

4. **监控异常请求**
   - 记录所有请求日志
   - 设置告警规则

> **提示**：认证功能正在开发中，未来版本将支持更完善的安全机制。

### Q5: 如何实现幂等性？

**A**: 可以在工作流中实现幂等性检查：

```
Webhook 触发器
  → 提取幂等性键（如订单ID）
  → 检查是否已处理
    → [是] 返回已处理响应
    → [否] 继续处理
      → 标记为已处理
```

## 下一步

- [表达式语法](/zh-hans/guide/expressions) - 学习如何处理 Webhook 数据
- [Action 节点](/zh-hans/guide/workflow/nodes/action-nodes/ai-agent) - 了解如何处理接收到的数据
- [条件分支节点](/zh-hans/guide/workflow/nodes/action-nodes/if) - 实现条件逻辑

## 相关资源

- [HTTP 请求节点](/zh-hans/guide/workflow/nodes/action-nodes/http-request) - 发送 HTTP 请求
- [表达式方法](/zh-hans/guide/expressions) - 完整表达式语法
