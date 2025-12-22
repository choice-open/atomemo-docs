---
title: HTTP 请求节点
description: 调用外部 API 和 Web 服务
---

# HTTP 请求节点

HTTP 请求节点用于在工作流中调用外部 API 和 Web 服务。它支持所有常见的 HTTP 方法、身份验证方式、自定义请求头和请求体，是连接第三方系统和服务的核心节点。

## 使用场景

### 典型应用
- **第三方 API 集成** - 调用 CRM、支付、物流等第三方服务
- **数据查询** - 从外部数据库或服务获取数据
- **数据提交** - 将处理结果发送到外部系统
- **Webhook 回调** - 向其他系统发送事件通知
- **微服务调用** - 在微服务架构中调用内部服务
- **文件上传下载** - 上传文件到云存储或下载资源
- **RESTful API 操作** - 执行 CRUD 操作

## 节点配置

### 基础设置（参数面板）

#### 请求 URL (url)

要请求的 API 地址。

**字段属性**:
- 必填字段
- 支持表达式
- 支持 HTTP 和 HTTPS 协议

**配置示例**:

```javascript
// 1. 静态 URL
"https://api.example.com/users"

// 2. 使用表达式构建 URL
`https://api.example.com/users/${$('实体识别').userId}`

// 3. 从配置中读取
$('配置节点').apiBaseUrl + "/orders"

// 4. 带查询参数（推荐使用查询参数配置）
`https://api.example.com/search?q=${$('聊天触发器').query}`
```

#### 请求方法 (method)

HTTP 请求方法。

**可选值**:
- `GET` - 获取资源（默认：读取数据）
- `POST` - 创建资源（发送数据到服务器）
- `PUT` - 更新资源（完整更新）
- `PATCH` - 部分更新资源
- `DELETE` - 删除资源
- `HEAD` - 获取资源头信息（不返回 body）

**默认值**: `POST`

**使用建议**:
```yaml
GET: 查询数据、获取列表
POST: 创建新记录、提交表单
PUT: 完整替换资源
PATCH: 部分更新字段
DELETE: 删除记录
HEAD: 检查资源是否存在
```

#### 身份验证 (authentication)

API 身份验证方式。

**可选值**:
- `none` - 无需身份验证（默认）
- `basic_auth` - Basic 认证（用户名密码）
- `jwt_auth` - JWT Token 认证
- `header_auth` - 自定义请求头认证（如 API Key）

**默认值**: `none`

#### 认证凭证 (credentials)

身份验证所需的凭证信息。

**字段属性**:
- 可选字段（当 authentication 不为 none 时需要）
- 支持表达式
- 根据认证类型格式不同

**配置示例**:

```javascript
// Basic Auth - 格式：username:password
"admin:password123"

// JWT Auth - JWT token
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

// Header Auth - 直接提供 token 值
$('配置节点').apiKey

// 从环境变量读取
$('环境变量').API_SECRET_KEY
```

#### 发送请求头 (sendHeaders)

是否在请求中包含自定义请求头。

**默认值**: `false`

#### 请求头格式 (specifyHeaders)

指定请求头的配置格式。

**可选值**:
- `keyValuePair` - 键值对形式（默认，可视化编辑）
- `json` - JSON 字符串形式

**默认值**: `keyValuePair`

#### 请求头 (headers)

自定义 HTTP 请求头。

**字段属性**:
- 根据 specifyHeaders 格式不同
- 支持表达式

**键值对格式示例**:

```javascript
// 配置多个请求头
[
  { name: "Content-Type", value: "application/json" },
  { name: "X-API-Key", value: $('配置').apiKey },
  { name: "X-Request-ID", value: $('Webhook触发器').requestId }
]
```

**JSON 格式示例**:

```javascript
// 使用 JSON 字符串
`{
  "Content-Type": "application/json",
  "Authorization": "Bearer ${$('配置').token}",
  "X-Custom-Header": "${$('数据').customValue}"
}`
```

#### 发送查询参数 (sendSearchParameters)

是否在 URL 中包含查询参数。

**默认值**: `false`

#### 查询参数格式 (specifySearchParameters)

指定查询参数的配置格式。

**可选值**:
- `keyValuePair` - 键值对形式（默认）
- `json` - JSON 字符串形式

**默认值**: `keyValuePair`

#### 查询参数 (queryParams)

URL 查询参数（Query String）。

**字段属性**:
- 根据 specifySearchParameters 格式不同
- 支持表达式
- 会自动进行 URL 编码

**键值对格式示例**:

```javascript
// 配置多个查询参数
[
  { name: "page", value: "1" },
  { name: "limit", value: "20" },
  { name: "category", value: $('AI分类器').class },
  { name: "keyword", value: $('聊天触发器').query }
]

// 最终 URL: https://api.example.com/search?page=1&limit=20&category=tech&keyword=hello
```

**JSON 格式示例**:

```javascript
`{
  "page": 1,
  "limit": 20,
  "status": "${$('表单').status}",
  "startDate": "${$('代码').formattedDate}"
}`
```

#### 发送请求体 (sendBody)

是否发送请求体（仅 POST、PUT、PATCH 有效）。

**默认值**: `false`

#### 请求体内容类型 (bodyContentType)

请求体的 Content-Type。

**可选值**:
- `application/json` - JSON 格式（目前唯一支持）

**默认值**: `application/json`

#### 请求体格式 (specifyBody)

指定请求体的配置格式。

**可选值**:
- `keyValuePair` - 键值对形式（默认）
- `json` - JSON 字符串形式

**默认值**: `keyValuePair`

#### 请求体 (body)

HTTP 请求体内容。

**字段属性**:
- 字符串类型
- 支持表达式
- 通常为 JSON 格式

**配置示例**:

```javascript
// 1. 简单 JSON 对象
`{
  "name": "${$('实体识别').name}",
  "email": "${$('实体识别').email}",
  "phone": "${$('实体识别').phone}"
}`

// 2. 嵌套结构
`{
  "customer": {
    "name": "${$('表单').name}",
    "contact": {
      "email": "${$('表单').email}",
      "phone": "${$('表单').phone}"
    }
  },
  "order": {
    "items": ${JSON.stringify($('代码').items)},
    "total": ${$('代码').totalAmount}
  },
  "metadata": {
    "source": "automation",
    "timestamp": "${new Date().toISOString()}"
  }
}`

// 3. 直接使用上游节点的数据
JSON.stringify($('实体识别'))

// 4. 数组格式
`[
  {"id": 1, "name": "${$('数据1').name}"},
  {"id": 2, "name": "${$('数据2').name}"}
]`
```

### 高级设置（设置面板）

#### 总是输出 (alwaysOutput)

当请求失败或无响应时，是否输出空项。

**默认值**: `false`

**用途**: 防止工作流在此节点终止。

#### 仅执行一次 (executeOnce)

是否仅使用第一个输入项执行一次。

**默认值**: `false`

#### 失败重试 (retryOnFail)

请求失败时是否自动重试。

**默认值**: `false`

**建议启用场景**:
- 网络不稳定
- 外部 API 偶发性失败
- 速率限制导致的 429 错误

#### 最大重试次数 (maxTries)

失败后的最大重试次数。

**默认值**: `3`

**前置条件**: `retryOnFail` 必须为 `true`

#### 重试等待时间 (waitBetweenTries)

每次重试之间的等待时间（毫秒）。

**默认值**: `1000` (1秒)

**前置条件**: `retryOnFail` 必须为 `true`

**建议值**:
```yaml
短暂故障: 500-1000ms
速率限制: 2000-5000ms
服务重启: 5000-10000ms
```

#### 错误处理 (onError)

请求失败时的处理方式。

**可选值**:
- `stopWorkflow` - 停止整个工作流（默认）
- `continueRegularOutput` - 继续执行，使用常规输出
- `continueErrorOutput` - 继续执行，使用错误输出

#### 节点描述 (nodeDescription)

为节点添加自定义描述。

```yaml
nodeDescription: "调用 CRM API 创建客户记录"
```

## 输出数据

HTTP 请求节点返回完整的响应信息。

```javascript
// HTTP 状态码
$('HTTP请求').statusCode

// 响应体（通常是 JSON 对象）
$('HTTP请求').body

// 响应头
$('HTTP请求').headers

// 访问响应体中的字段
$('HTTP请求').body.id
$('HTTP请求').body.data.users
$('HTTP请求').body.result[0].name

// 响应头示例
$('HTTP请求').headers['content-type']
$('HTTP请求').headers['x-rate-limit-remaining']
```

## 工作流示例

### 示例 1: 创建客户记录

```
实体识别节点（提取客户信息）
  → HTTP 请求节点
    URL: "https://api.crm.com/customers"
    方法: POST
    身份验证: header_auth
    凭证: $('配置').crmApiKey
    发送请求头: true
    请求头:
      - name: "Authorization"
        value: `Bearer ${$('配置').crmApiKey}`
      - name: "Content-Type"
        value: "application/json"
    发送请求体: true
    请求体:
      `{
        "name": "${$('实体识别').name}",
        "email": "${$('实体识别').email}",
        "phone": "${$('实体识别').phone}",
        "source": "chatbot",
        "tags": ["lead", "automation"]
      }`
  → 条件分支
    → [成功: statusCode === 201] → 回答（创建成功）
    → [失败] → 回答（创建失败，请稍后重试）
```

### 示例 2: 查询订单状态

```
聊天触发器
  → 实体识别节点（提取订单号）
  → HTTP 请求节点
    URL: `https://api.shop.com/orders/${$('实体识别').orderId}`
    方法: GET
    身份验证: header_auth
    发送请求头: true
    请求头:
      - name: "X-API-Key"
        value: $('配置').shopApiKey
    发送查询参数: false
  → 代码节点（格式化订单信息）
  → 回答节点
```

### 示例 3: 批量更新数据

```
数据库查询节点（获取待更新记录）
  → HTTP 请求节点
    URL: "https://api.service.com/batch-update"
    方法: POST
    发送请求体: true
    请求体:
      `{
        "records": ${JSON.stringify($('数据库查询').results)},
        "updateFields": ["status", "updatedAt"],
        "batchSize": 100
      }`
    设置:
      retryOnFail: true
      maxTries: 3
      waitBetweenTries: 2000
  → 条件分支
    → [成功] → 日志记录
    → [失败] → 告警通知
```

### 示例 4: 文件上传

```
Webhook触发器（接收文件）
  → HTTP 请求节点
    URL: "https://storage.example.com/upload"
    方法: POST
    发送请求头: true
    请求头:
      - name: "Content-Type"
        value: "multipart/form-data"
      - name: "Authorization"
        value: `Bearer ${$('配置').storageToken}`
    发送请求体: true
    请求体:
      `{
        "file": "${$('Webhook触发器').body.fileBase64}",
        "filename": "${$('Webhook触发器').body.filename}",
        "folder": "uploads/chatbot"
      }`
  → 回答节点
    回答: `文件上传成功！访问链接：${$('HTTP请求').body.url}`
```

### 示例 5: 微服务链式调用

```
聊天触发器
  → HTTP 请求节点 A（用户服务 - 获取用户信息）
    URL: `https://user-service.internal/users/${$('聊天触发器').userId}`
    方法: GET
  → HTTP 请求节点 B（订单服务 - 获取订单列表）
    URL: "https://order-service.internal/orders"
    方法: GET
    查询参数:
      - name: "userId"
        value: $('HTTP请求节点A').body.id
      - name: "status"
        value: "active"
  → HTTP 请求节点 C（推荐服务 - 获取推荐商品）
    URL: "https://recommendation-service.internal/recommend"
    方法: POST
    请求体:
      `{
        "userId": "${$('HTTP请求节点A').body.id}",
        "orderHistory": ${JSON.stringify($('HTTP请求节点B').body.orders)},
        "limit": 5
      }`
  → LLM 节点（生成个性化回复）
  → 回答节点
```

### 示例 6: Webhook 通知

```
工作流完成节点
  → HTTP 请求节点
    URL: $('配置').webhookUrl
    方法: POST
    发送请求头: true
    请求头:
      - name: "Content-Type"
        value: "application/json"
      - name: "X-Webhook-Signature"
        value: $('代码').signature
    发送请求体: true
    请求体:
      `{
        "event": "workflow.completed",
        "workflowId": "${$('工作流信息').id}",
        "status": "success",
        "result": ${JSON.stringify($('最终结果'))},
        "timestamp": "${new Date().toISOString()}"
      }`
    设置:
      retryOnFail: true
      maxTries: 5
      onError: continueRegularOutput
```

## 最佳实践

### 1. 安全处理敏感信息

**不要硬编码 API 密钥**
```javascript
// 不要这样做
credentials: "sk-1234567890abcdef"

// 应该使用配置节点或环境变量
credentials: $('配置').apiKey
credentials: $('环境变量').API_SECRET_KEY
```

**使用适当的身份验证方式**
```yaml
# 根据 API 要求选择
Basic Auth: 传统 API，用户名密码
JWT: 现代 Web 应用，token 认证
Header Auth: RESTful API，API Key
```

### 2. 错误处理和重试

**合理配置重试策略**
```yaml
# 网络请求
retryOnFail: true
maxTries: 3
waitBetweenTries: 1000

# 关键业务操作
retryOnFail: true
maxTries: 5
waitBetweenTries: 2000
onError: continueErrorOutput  # 记录错误但继续
```

**检查响应状态**
```javascript
// 使用条件分支检查状态码
条件: $('HTTP请求').statusCode >= 200 && $('HTTP请求').statusCode < 300

// 检查业务状态
条件: $('HTTP请求').body.success === true

// 处理不同错误
条件: $('HTTP请求').statusCode === 404
  → 回答: "未找到相关记录"
条件: $('HTTP请求').statusCode === 429
  → 回答: "请求过于频繁，请稍后重试"
条件: $('HTTP请求').statusCode >= 500
  → 回答: "服务暂时不可用，请稍后重试"
```

### 3. 性能优化

**使用 executeOnce 避免重复请求**
```yaml
# 当上游返回多个项但只需请求一次时
executeOnce: true
```

**合理设置超时时间**
```javascript
// 在请求头中设置超时
headers: [
  { name: "X-Timeout", value: "5000" }
]
```

**批量操作优化**
```javascript
// 不好：循环调用多次 API
每个用户 → HTTP 请求节点

// 好：批量处理
代码节点（聚合数据）→ HTTP 请求节点（批量 API）
```

### 4. 数据格式处理

**正确构建 JSON 请求体**
```javascript
// 简单对象
`{
  "name": "${$('节点').name}",
  "age": ${$('节点').age}
}`

// 包含数组
`{
  "items": ${JSON.stringify($('节点').items)}
}`

// 转义特殊字符
`{
  "description": "${$('节点').text.replace(/"/g, '\\"')}"
}`
```

**处理查询参数编码**
```javascript
// 系统会自动进行 URL 编码
queryParams: [
  { name: "search", value: "hello world" }  // 自动编码为 hello%20world
]
```

### 5. 请求头最佳实践

**设置合适的 Content-Type**
```javascript
headers: [
  { name: "Content-Type", value: "application/json" },
  { name: "Accept", value: "application/json" }
]
```

**添加跟踪标识**
```javascript
headers: [
  { name: "X-Request-ID", value: $('Webhook触发器').requestId },
  { name: "X-Source", value: "automation-workflow" }
]
```

### 6. 调试技巧

**记录请求详情**
```
HTTP 请求节点
  → 代码节点（记录日志）
    代码:
      function main({request, response}) {
          console.log('请求 URL:', request.url)
          console.log('状态码:', response.statusCode)
          console.log('响应体:', JSON.stringify(response.body))
          return {logged: true}
      }
```

**使用测试端点**
```javascript
// 开发环境使用测试 URL
url: $('环境变量').ENV === 'production'
  ? 'https://api.example.com/v1'
  : 'https://api-dev.example.com/v1'
```

## 常见问题

### Q1: 支持哪些 HTTP 方法？

**A**: 支持所有常见 HTTP 方法：
- **GET** - 获取资源
- **POST** - 创建资源
- **PUT** - 完整更新资源
- **PATCH** - 部分更新资源
- **DELETE** - 删除资源
- **HEAD** - 获取头信息

### Q2: 如何处理 API 速率限制？

**A**: 处理速率限制的方法：

1. **检查响应头**
   ```javascript
   $('HTTP请求').headers['x-rate-limit-remaining']
   $('HTTP请求').headers['x-rate-limit-reset']
   ```

2. **配置重试策略**
   ```yaml
   retryOnFail: true
   maxTries: 3
   waitBetweenTries: 5000  # 等待 5 秒
   ```

3. **使用条件分支**
   ```javascript
   条件: $('HTTP请求').statusCode === 429
     → 等待节点（延迟执行）
     → 重新请求
   ```

### Q3: 如何处理大文件上传？

**A**: 大文件上传建议：

1. **分块上传**
   ```javascript
   // 使用代码节点分割文件
   // 多次调用 HTTP 请求节点上传分块
   ```

2. **使用预签名 URL**
   ```javascript
   // 先获取预签名 URL
   HTTP 请求节点 A（获取上传 URL）
   // 直接上传到云存储
   → HTTP 请求节点 B（上传文件）
   ```

3. **考虑超时设置**
   - 增加重试等待时间
   - 使用流式上传（如果 API 支持）

### Q4: 如何发送 multipart/form-data 请求？

**A**: 当前版本主要支持 JSON 格式。对于 multipart/form-data：

```javascript
// 方法 1: 使用 base64 编码
body: `{
  "file": "${$('节点').fileBase64}",
  "filename": "${$('节点').filename}"
}`

// 方法 2: 使用代码节点构建
代码节点（构建 multipart 数据）
  → HTTP 请求节点
```

### Q5: 响应不是 JSON 格式怎么办？

**A**: HTTP 请求节点主要针对 JSON API 优化。对于其他格式：

```javascript
// 文本响应
$('HTTP请求').body  // 字符串形式

// 在代码节点中处理
function main({response}) {
    // XML 解析
    const parser = new DOMParser()
    const xml = parser.parseFromString(response.body, 'text/xml')

    // CSV 解析
    const rows = response.body.split('\n')

    return {parsed: data}
}
```

### Q6: 如何处理跨域 (CORS) 问题？

**A**: CORS 通常是浏览器限制：

1. **服务端到服务端请求**
   - 工作流在服务端执行，不受 CORS 限制

2. **如果确实遇到 CORS**
   - 检查目标 API 的 CORS 配置
   - 联系 API 提供方添加允许来源
   - 使用代理服务

### Q7: 如何调试 HTTP 请求？

**A**: 调试技巧：

1. **使用 webhook.site 测试**
   ```javascript
   url: "https://webhook.site/your-unique-url"
   // 查看完整的请求详情
   ```

2. **记录请求响应**
   ```javascript
   HTTP 请求节点
     → 代码节点
       function main({response}) {
           console.log('Status:', response.statusCode)
           console.log('Body:', response.body)
           console.log('Headers:', response.headers)
           return {debug: true}
       }
   ```

3. **使用条件分支检查状态**
   ```javascript
   条件: $('HTTP请求').statusCode !== 200
     → 回答节点（显示错误信息）
   ```

### Q8: 支持自签名证书吗？

**A**: 通常需要在运行环境配置：
- 生产环境应使用有效的 SSL 证书
- 开发环境可在服务器配置中允许自签名证书
- 不建议在工作流中忽略证书验证

### Q9: 如何实现请求缓存？

**A**: 实现缓存的方式：

```javascript
// 使用条件分支检查缓存
条件: $('缓存检查').exists === false
  → HTTP 请求节点
    → 代码节点（存储到缓存）

// 或使用 HTTP 头
headers: [
  { name: "Cache-Control", value: "max-age=3600" }
]
```

## 下一步

- [代码节点](/zh-hans/guide/workflow/nodes/action-nodes/code) - 处理 HTTP 响应数据
- [条件分支](/zh-hans/guide/workflow/nodes/action-nodes/if) - 根据响应状态进行分支
- [Webhook 触发器](/zh-hans/guide/workflow/nodes/trigger-nodes/webhook) - 接收外部 HTTP 请求

## 相关资源

- [实体识别节点](/zh-hans/guide/workflow/nodes/action-nodes/entity-recognition) - 处理 API 返回的数据
- [回答节点](/zh-hans/guide/workflow/nodes/action-nodes/answer) - 向用户返回 API 结果
- [表达式语法](/zh-hans/guide/expressions/) - 学习如何构建动态请求
