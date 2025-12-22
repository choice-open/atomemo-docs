---
title: HTTP 请求工具节点
description: 为 AI Agent 提供调用外部 API 的能力，实现与第三方服务的集成
---

# HTTP 请求工具节点

HTTP 请求工具节点为 AI Agent 提供调用外部 API 的能力。与 HTTP Request Action 节点不同，Tool 版本由 AI 根据对话需求自主决定是否调用。

## 使用场景

### 典型应用
- **数据查询** - 查询天气、汇率、库存等实时信息
- **订单操作** - 创建、查询、更新订单状态
- **用户管理** - 查询用户信息、更新资料
- **第三方集成** - 调用支付、物流、短信等第三方服务
- **数据同步** - 向外部系统同步数据
- **智能决策** - AI 根据需要获取外部数据辅助决策

## Tool vs Action 的区别

| 特性 | HTTP Request Action | HTTP Request Tool |
|------|---------------------|-------------------|
| 执行方式 | 直接执行 | AI 按需调用 |
| 使用场景 | 固定的 API 调用流程 | AI Agent 需要时调用 |
| 调用时机 | 每次都执行 | AI 决定何时调用 |
| 参数传递 | 预先配置 | AI 从对话中提取参数 |

**示例对比**:
```
Action 方式 (固定流程):
用户输入 → 调用 API → 返回结果

Tool 方式 (智能交互):
用户: "今天北京天气怎么样?"
AI: (识别需要调用天气 API) → 调用工具查询天气 → 返回结果
用户: "现在的汇率是多少?"
AI: (识别需要调用汇率 API) → 调用工具查询汇率 → 返回结果
```

## 节点配置

### 基础设置(参数面板)

#### 工具名称 (toolName)

AI Agent 调用工具时使用的唯一标识符。

**字段属性**:
- 必填字段
- 在工作流中必须唯一
- 不支持表达式
- 格式要求:
  - 只能包含字母、数字、下划线和连字符
  - 必须以字母开头
  - 不能与工作流中其他工具节点的工具名称重复

**配置示例**:

```javascript
// 1. 简洁明确的工具名称
toolName: "queryWeather"

// 2. 描述性的工具名称
toolName: "createOrder"

// 3. 带前缀的工具名称
toolName: "apiProductSearch"
```

**命名建议**:
- **使用小驼峰或下划线**: `queryWeather` 或 `query_weather`
- **见名知意**: 名称要清楚表达工具的功能
- **避免过长**: 建议在 20 个字符以内
- **避免特殊字符**: 只使用字母、数字、下划线和连字符

**重要说明**:
- AI Agent 通过工具名称来识别和调用工具，而不是节点名称
- 工具名称在工作流中必须唯一，如果有重复会自动添加后缀
- 建议使用英文命名，以便与 AI 的调用保持一致

#### 工具描述 (toolDescription)

描述 API 的功能和使用场景，AI 根据描述决定何时调用。

**字段属性**:
- 必填字段
- 支持表达式

**配置示例**:

```javascript
// 1. 天气查询 API
"查询指定城市的天气信息。
输入参数：city (城市名称)
返回：temperature (温度), weather (天气状况), humidity (湿度)
适用场景：用户询问天气时调用。"

// 2. 产品库存查询
"查询产品当前库存数量。
输入参数：productId (产品ID)
返回：quantity (库存数量), available (是否有货), lastUpdated (最后更新时间)
适用场景：用户询问商品是否有货时调用。"

// 3. 订单创建
"创建新订单。
输入参数：items (商品列表), shippingAddress (收货地址), contactInfo (联系方式)
返回：orderId (订单号), status (订单状态), estimatedDelivery (预计送达时间)
适用场景：用户确认订单信息后创建订单。"

// 4. 用户信息查询
"根据用户ID查询用户详细信息。
输入参数：userId (用户ID)
返回：用户对象 (name, email, vipLevel, points)
适用场景：需要获取用户信息时调用，如个性化推荐、会员权益查询等。"
```

#### URL (url)

API 的完整地址。

**字段属性**:
- 必填字段
- 支持表达式
- 支持 HTTPS 和 HTTP 协议

**配置示例**:

```javascript
// 1. 固定 URL
"https://api.weather.com/v1/current"

// 2. 带路径参数 (AI 可以动态替换)
"https://api.example.com/users/{userId}/orders"

// 3. 动态 URL (使用表达式)
`https://api.example.com/${$('Config').apiVersion}/products`

// 4. 从上下文获取
$('System Config').apiBaseUrl + "/search"
```

#### HTTP 方法 (method)

HTTP 请求方法。

**字段属性**:
- 必选字段
- 默认值: `POST`

**可选值**:
- `GET` - 查询数据
- `POST` - 创建资源
- `PUT` - 完整更新资源
- `PATCH` - 部分更新资源
- `DELETE` - 删除资源
- `HEAD` - 获取响应头

**使用建议**:
```yaml
GET: 查询操作 (天气查询、库存查询、用户信息查询)
POST: 创建操作 (创建订单、提交表单、发送通知)
PUT: 完整更新 (更新用户全部信息)
PATCH: 部分更新 (只更新用户手机号)
DELETE: 删除操作 (取消订单、删除记录)
```

#### 认证方式 (authentication)

API 认证方式。

**字段属性**:
- 必选字段
- 默认值: `none`

**可选值**:
- `none` - 无认证
- `basic_auth` - Basic 认证 (用户名密码)
- `jwt_auth` - JWT Token 认证
- `header_auth` - 自定义 Header 认证 (如 API Key)

**配置示例**:

```javascript
// 1. Basic Auth
authentication: "basic_auth"
credentials: "username:password"

// 2. JWT Auth
authentication: "jwt_auth"
credentials: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

// 3. Header Auth (API Key)
authentication: "header_auth"
// 在 Headers 中添加: X-API-Key: your_api_key

// 4. 从环境变量获取
credentials: $('System Config').apiToken
```

#### 发送请求头 (sendHeaders)

是否发送自定义请求头。

**字段属性**:
- 布尔值
- 默认值: `false`

#### 请求头格式 (specifyHeaders)

请求头的配置方式。

**可选值**:
- `keyValuePair` - 键值对形式
- `json` - JSON 字符串形式

#### 请求头 (headers)

自定义 HTTP 请求头。

**配置示例**:

```javascript
// 键值对形式
headers: [
  { name: "Content-Type", value: "application/json" },
  { name: "X-API-Key", value: "your_api_key" },
  { name: "User-Agent", value: "{{PRODUCT_NAME}}/1.0" }
]

// JSON 形式
headers: `{
  "Content-Type": "application/json",
  "X-API-Key": "${$('Config').apiKey}",
  "X-Request-ID": "${$('Chat Trigger').sessionId}"
}`
```

#### 发送查询参数 (sendSearchParameters)

是否在 URL 中添加查询参数。

**字段属性**:
- 布尔值
- 默认值: `false`

#### 查询参数格式 (specifySearchParameters)

查询参数的配置方式。

**可选值**:
- `keyValuePair` - 键值对形式
- `json` - JSON 字符串形式

#### 查询参数 (queryParams)

URL 查询参数 (例如 `?key=value&page=1`)。

**配置示例**:

```javascript
// 键值对形式
queryParams: [
  { name: "city", value: "" },  // AI 从对话中提取
  { name: "units", value: "metric" },
  { name: "lang", value: "zh-CN" }
]

// JSON 形式
queryParams: `{
  "q": "${searchQuery}",
  "limit": 10,
  "offset": 0
}`

// 最终URL示例: https://api.weather.com/v1/current?city=Beijing&units=metric&lang=zh-CN
```

#### 发送请求体 (sendBody)

是否发送请求体 (通常用于 POST/PUT/PATCH)。

**字段属性**:
- 布尔值
- 默认值: `false`

#### 请求体内容类型 (bodyContentType)

请求体的 Content-Type。

**可选值**:
- `application/json` - JSON 格式 (默认且常用)

#### 请求体格式 (specifyBody)

请求体的配置方式。

**可选值**:
- `keyValuePair` - 键值对形式 (转换为 JSON)
- `json` - JSON 字符串形式

#### 请求体 (body)

HTTP 请求体内容。

**配置示例**:

```javascript
// JSON 字符串形式 (推荐)
body: `{
  "orderId": "12345",
  "items": [],
  "shippingAddress": "",
  "contactPhone": ""
}`

// AI 会自动填充这些字段的值
```

### 高级设置(设置面板)

#### 总是输出 (alwaysOutput)
请求失败时是否也输出空项。**默认**: `false`

#### 仅执行一次 (executeOnce)
是否仅使用第一个输入项执行一次。**默认**: `false`

#### 失败重试 (retryOnFail)
请求失败时是否自动重试。**默认**: `false`

#### 最大重试次数 (maxTries)
失败后最多重试几次。**默认**: `3`

#### 重试间隔 (waitBetweenTries)
重试之间的等待时间(毫秒)。**默认**: `1000`

## 输出数据

返回 API 的响应数据,通常包含:

```javascript
// 访问响应数据
$('HTTP Request Tool').statusCode  // HTTP 状态码
$('HTTP Request Tool').body       // 响应体
$('HTTP Request Tool').headers    // 响应头

// 访问具体字段 (如果响应是 JSON)
$('HTTP Request Tool').body.data
$('HTTP Request Tool').body.temperature
$('HTTP Request Tool').body.results[0]
```

## 工作流示例

### 示例 1: 天气查询助手

```
Chat Trigger
  → AI Agent Node
    System Prompt: "你是智能助手,可以查询天气信息。"

    Tools: [HTTP Request Tool]
      Tool Description: "查询指定城市的天气。输入: city (城市名)。返回: temperature, weather, humidity。"
      URL: "https://api.weather.com/v1/current"
      Method: GET
      Send Search Parameters: true
      Query Params: [
        { name: "city", value: "" },     // AI 会填充
        { name: "units", value: "metric" },
        { name: "appid", value: $('Config').weatherApiKey }
      ]
  → Answer Node

对话示例:
用户: "今天北京天气怎么样?"
AI: (调用天气API,city="Beijing")
响应: {temperature: 15, weather: "晴", humidity: 45}
AI: "北京今天天气晴,气温15°C,湿度45%。"
```

### 示例 2: 订单管理助手

```
Chat Trigger
  → AI Agent Node
    System Prompt: "你是订单管理助手,可以查询和创建订单。"

    Tools: [
      Tool 1 - HTTP Request Tool (查询订单)
        Tool Description: "根据订单号查询订单详情。输入: orderId。返回: 订单对象。"
        URL: "https://api.example.com/orders/{orderId}"
        Method: GET

      Tool 2 - HTTP Request Tool (创建订单)
        Tool Description: "创建新订单。输入: items, address, phone。返回: orderId, status。"
        URL: "https://api.example.com/orders"
        Method: POST
        Send Body: true
        Body: `{
          "items": [],
          "shippingAddress": "",
          "contactPhone": ""
        }`
    ]
  → Answer Node

对话流程:
用户: "我的订单 #12345 到哪了?"
AI: (调用Tool 1查询订单)
AI: "您的订单已发货,预计明天送达。"

用户: "我要订2份宫保鸡丁,送到xx路,电话138xxx"
AI: (调用Tool 2创建订单)
AI: "订单已创建,订单号 #67890,预计30分钟送达。"
```

### 示例 3: 智能产品推荐

```
Chat Trigger
  → AI Agent Node
    System Prompt: "你是产品顾问,根据用户需求推荐合适产品。"

    Tools: [
      Tool 1 - Entity Recognition Tool
        Tool Description: "提取用户需求信息:category, priceRange, features。"

      Tool 2 - HTTP Request Tool
        Tool Description: "搜索符合条件的产品。输入: category, minPrice, maxPrice, features。返回: 产品列表。"
        URL: "https://api.example.com/products/search"
        Method: POST
        Send Body: true
        Body: `{
          "category": "",
          "minPrice": 0,
          "maxPrice": 0,
          "features": []
        }`
    ]
  → Answer Node

用户: "我想买个笔记本电脑,预算8000左右,要轻薄的"
AI: (先调用Tool 1提取需求)
提取: {category: "笔记本电脑", priceRange: [7000, 9000], features: ["轻薄"]}
AI: (调用Tool 2搜索产品)
API 返回: [{name: "XX Pro", price: 7999, ...}, ...]
AI: "根据您的需求,我推荐以下几款..."
```

### 示例 4: 多API协作 - 完整业务流程

```
Chat Trigger
  → AI Agent Node
    System Prompt: "你是购物助手,帮助用户完成购物流程。"

    Tools: [
      Tool 1 - HTTP Request Tool (库存检查)
        Tool Description: "检查商品库存。输入: productId。返回: available, quantity。"
        URL: "https://api.example.com/inventory/check"
        Method: GET

      Tool 2 - HTTP Request Tool (价格计算)
        Tool Description: "计算订单总价。输入: items, couponCode。返回: totalPrice, discount。"
        URL: "https://api.example.com/calculate-price"
        Method: POST

      Tool 3 - HTTP Request Tool (创建订单)
        Tool Description: "确认后创建订单。输入: 订单信息。返回: orderId。"
        URL: "https://api.example.com/orders"
        Method: POST

      Tool 4 - HTTP Request Tool (发送通知)
        Tool Description: "向用户发送订单通知。输入: phone, message。"
        URL: "https://api.example.com/sms/send"
        Method: POST
    ]
  → Answer Node

对话流程:
用户: "SKU-123 还有货吗?"
AI: (调用Tool 1检查库存) → "有货,库存充足。"

用户: "那我要2件,有优惠码 VIP20"
AI: (调用Tool 2计算价格) → "原价199元,使用优惠码后159元。"

用户: "好的,下单,地址xx,电话138xxx"
AI: (调用Tool 3创建订单) → "订单已创建,订单号#11111"
AI: (调用Tool 4发送通知) → "已发送订单确认短信。"
```

## 最佳实践

### 1. 编写清晰的工具描述

```javascript
// 好的描述
toolDescription: `查询城市天气信息。

API 功能：
- 输入参数：city (城市名称,必填)
- 返回数据：temperature (温度), weather (天气状况), humidity (湿度)

使用场景：
- 用户询问"xx天气怎么样"
- 用户询问"今天/明天温度"
- 用户需要天气信息时

示例：
用户: "北京今天天气?"
AI 调用: {city: "北京"}
返回: {temperature: 15, weather: "晴"}`
```

### 2. 合理设置 HTTP 方法

```javascript
// 查询操作用 GET
method: "GET"
url: "https://api.example.com/products"
queryParams: [{name: "id", value: ""}]

// 创建操作用 POST
method: "POST"
url: "https://api.example.com/orders"
body: "{...}"

// 更新操作用 PUT 或 PATCH
method: "PATCH"
url: "https://api.example.com/users/{id}"
body: "{...}"

// 删除操作用 DELETE
method: "DELETE"
url: "https://api.example.com/orders/{id}"
```

### 3. 处理 API 错误

```
Chat Trigger
  → AI Agent (调用 HTTP Request Tool)
  → Code Node (检查响应)
    Code: |
      const response = $('HTTP Request Tool');

      // 检查 HTTP 状态码
      if (response.statusCode >= 400) {
        return {
          success: false,
          error: `API 错误: ${response.statusCode}`,
          message: response.body.message || '未知错误'
        };
      }

      // 检查业务状态码
      if (response.body.code !== 0) {
        return {
          success: false,
          error: response.body.message
        };
      }

      return {
        success: true,
        data: response.body.data
      };
  → Conditional Branch
    → [success] → AI 返回结果
    → [error] → AI 说明错误
```

### 4. 安全处理敏感信息

```javascript
// 不要在代码中硬编码密钥
// ❌ 错误
headers: [
  {name: "X-API-Key", value: "sk-1234567890abcdef"}
]

// ✅ 正确 - 从配置获取
headers: [
  {name: "X-API-Key", value: $('System Config').apiKey}
]

// ✅ 正确 - 使用认证方式
authentication: "jwt_auth"
credentials: $('System Config').jwtToken
```

### 5. 优化 API 调用效率

```javascript
// 1. 使用缓存 (在 Code Tool 中实现)
System Prompt: `在调用API前,先检查是否有缓存数据。
缓存策略:
- 天气数据: 缓存30分钟
- 汇率数据: 缓存1小时
- 用户数据: 不缓存 (实时)`

// 2. 批量查询
// 如果API支持,一次查询多个
body: `{
  "productIds": ["SKU-1", "SKU-2", "SKU-3"]
}`

// 3. 设置合理的超时和重试
retryOnFail: true
maxTries: 2  // 不要重试太多次
waitBetweenTries: 500  // 快速重试
```

### 6. 记录和监控

```
Chat Trigger
  → AI Agent (调用 HTTP Request Tool)
  → Code Node (记录调用日志)
    Code: |
      return {
        timestamp: new Date().toISOString(),
        tool: 'HTTP Request',
        url: $('HTTP Request Tool').url,
        statusCode: $('HTTP Request Tool').statusCode,
        duration: $('HTTP Request Tool').duration,
        success: $('HTTP Request Tool').statusCode < 400
      };
  → HTTP Request (发送到日志系统)
```

## 常见问题

### Q1: AI 如何知道 API 需要什么参数?

**A**:
在工具描述中明确说明:

```javascript
toolDescription: `查询产品库存信息。

必需参数:
- productId: 产品ID (如 "SKU-123")

可选参数:
- warehouseId: 仓库ID (如果不指定,查询所有仓库)

返回数据:
- available: 是否有货 (boolean)
- quantity: 库存数量 (number)
- warehouses: 各仓库库存详情 (array)

AI 会从用户对话中提取 productId 并调用此 API。`
```

### Q2: 如何处理 API 认证?

**A**:

**方案 1: 使用内置认证**
```javascript
authentication: "header_auth"
headers: [
  {name: "Authorization", value: `Bearer ${$('Config').apiToken}`}
]
```

**方案 2: JWT Token**
```javascript
authentication: "jwt_auth"
credentials: $('Config').jwtToken
```

**方案 3: API Key**
```javascript
headers: [
  {name: "X-API-Key", value: $('Config').apiKey}
]
```

### Q3: 如何处理动态 URL?

**A**:

```javascript
// 方法 1: 路径参数 (AI 会自动替换)
url: "https://api.example.com/users/{userId}/orders"
// AI 会将 {userId} 替换为实际值

// 方法 2: 使用表达式
url: `https://api.example.com/users/${$('Chat Trigger').userId}/orders`

// 方法 3: 查询参数
url: "https://api.example.com/search"
queryParams: [
  {name: "q", value: ""},      // AI 填充
  {name: "type", value: "product"}
]
```

### Q4: 如何处理 API 返回的复杂数据?

**A**:

使用 Code Tool 处理:

```
Chat Trigger
  → AI Agent
    Tools: [HTTP Request Tool]
  → Code Tool
    Tool Description: "处理 API 返回的产品列表,提取关键信息。"
    Code: |
      const response = $('HTTP Request Tool').body;

      // 提取和转换数据
      const products = response.data.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price / 100,  // 分转元
        inStock: p.quantity > 0,
        discounted: p.discount > 0
      }));

      // 排序
      products.sort((a, b) => b.price - a.price);

      return {
        products: products.slice(0, 5),  // 只返回前5个
        total: products.length
      };
```

### Q5: 如何调试 API 调用?

**A**:

**1. 查看完整请求和响应**
```javascript
System Prompt: `在调用 API 后,向我展示:
- 请求 URL
- 请求参数
- 响应状态码
- 响应数据

这样我可以检查是否正确。`
```

**2. 记录到 Code Node**
```javascript
Code Node:
  const req = $('HTTP Request Tool');
  console.log('URL:', req.url);
  console.log('Status:', req.statusCode);
  console.log('Body:', JSON.stringify(req.body, null, 2));
  return req;
```

**3. 测试模式**
```javascript
// 在 Code Tool 中模拟 API 响应
if ($('Config').testMode) {
  return {
    body: {
      temperature: 15,
      weather: "晴"
    }
  };
}
```

### Q6: API 请求超时怎么办?

**A**:

```javascript
// 配置重试策略
Settings:
  retryOnFail: true
  maxTries: 2
  waitBetweenTries: 500

// AI 处理超时
System Prompt: `如果 API 调用失败或超时:
1. 向用户说明情况
2. 询问是否重试
3. 或提供备选方案`
```

### Q7: 可以并发调用多个 API 吗?

**A**:
AI Agent 可以智能决定调用顺序:

```
用户: "帮我查一下北京和上海的天气"

AI 的决策:
1. 识别需要调用两次天气 API
2. 第一次调用: {city: "北京"}
3. 第二次调用: {city: "上海"}
4. 汇总结果返回给用户

或者使用一个支持批量查询的 API:
body: `{
  "cities": ["北京", "上海"]
}`
```

## 下一步

- [AI Agent 节点](/zh-hans/guide/workflow/nodes/action-nodes/ai-agent) - 了解如何配置 AI Agent
- [Code Tool 节点](/zh-hans/guide/workflow/nodes/tool-nodes/code) - 处理 API 响应数据
- [Entity Recognition Tool 节点](/zh-hans/guide/workflow/nodes/tool-nodes/entity-recognition) - 从对话提取 API 参数

## 相关资源

- [HTTP Request Action 节点](/zh-hans/guide/workflow/nodes/action-nodes/http-request) - 了解 Action 版本
- [表达式语法](/zh-hans/guide/expressions/) - 学习如何在配置中使用表达式
