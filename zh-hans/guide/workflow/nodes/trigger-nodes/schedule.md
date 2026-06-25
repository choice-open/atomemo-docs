---
title: Schedule 触发器
description: 使用 Cron 表达式按定期计划自动触发工作流执行
---

# Schedule 触发器

Schedule 触发器允许工作流按照 Cron 表达式定义的定期计划自动执行。这是实现定时自动化任务的理想选择，适用于日报生成、数据同步、定期维护等场景。

## 使用场景

### 典型应用
- **定时报表** - 每日、每周或每月自动生成并发送报表
- **数据同步** - 定期在系统之间同步数据
- **定期维护** - 清理过期记录、刷新缓存、归档日志
- **周期性检查** - 监控系统健康状态、检查过期项目
- **批量处理** - 按固定间隔处理队列中的项目
- **知识库更新** - 按计划刷新知识库内容

## 节点特点

### 基本特性
- **自动执行** - 配置后无需人工干预
- **Cron 表达式调度** - 使用标准 Cron 表达式灵活定义执行计划
- **每个工作流唯一** - 每个工作流仅允许一个 Schedule 触发器
- **应用级时区** - 按照应用配置的时区执行
- **手动测试** - 支持通过"运行"按钮即时触发（忽略计划）

### 内置输出字段

Schedule 触发器仅提供一个输出端口（`Head`）。输出数据默认为空 —— 该触发器纯粹作为工作流的入口节点使用。

## 节点配置

### 基础设置（参数面板）

#### Cron 表达式

核心配置项是一个 Cron 表达式，用于定义工作流的执行计划。

**格式**：扩展的 crontab 语法，使用 6 或 7 个字段：

```
second minute hour day month weekday year
```

- 各字段以空格分隔
- 字段从左到右依次为：秒、分、时、日、月、周、年
- `year`（年）字段为可选，省略后为 6 字段

> **⚠️ 重要**：系统**始终从左侧第一字段开始解析为「秒」**。如果你只写了 5 个字段，它们会被解析为 `秒 分 时 日 月`（而非 Linux crontab 的 `分 时 日 月 周`）。例如 `0 6 * * *` **不是**"每天 6:00"，而是"每小时的第 6 分钟"！请始终使用 6 个字段来避免歧义。

**支持的语法**：

| 功能 | 示例 | 说明 |
| --- | --- | --- |
| 精确值 | `0 0 9 * * *` | 每天 9:00 |
| 通配符 `*` | `0 * * * * *` | 每分钟（第 0 秒触发） |
| 步长 `/` | `0 */15 * * * *` | 每 15 分钟 |
| 范围 `-` | `0 0 9-17 * * *` | 9 点到 17 点之间的每个整点 |
| 列表 `,` | `0 0 9,12,18 * * *` | 9:00、12:00 和 18:00 |
| 特殊 `@` | `@daily` | 每天午夜 |

**特殊表达式**：

| 表达式 | 等效写法 | 说明 |
| --- | --- | --- |
| `@yearly` / `@annually` | `0 0 0 1 1 *` | 每年 1 月 1 日午夜 |
| `@monthly` | `0 0 0 1 * *` | 每月 1 日午夜 |
| `@weekly` | `0 0 0 * * 0` | 每周日午夜 |
| `@daily` / `@midnight` | `0 0 0 * * *` | 每天午夜 |
| `@hourly` | `0 0 * * * *` | 每小时整点 |
| `@minutely` | `0 * * * * *` | 每分钟 |
| `@secondly` | `* * * * * *` | 每秒 |

> **注意**：`@reboot` **不被支持**。

**常用示例**：

| 表达式 | 说明 |
| --- | --- |
| `0 0 9 * * 1` | 每周一上午 9:00 |
| `0 0 8,18 * * 1-5` | 每个工作日 8:00 和 18:00 |
| `0 */5 * * * *` | 每 5 分钟 |
| `0 0 9-17 * * 1-5` | 工作日 9:00–17:00 每个整点 |
| `0 0 0 1,15 * *` | 每月 1 日和 15 日午夜 |
| `0 0 6 * * *` | 每天早上 6:00 |
| `@daily` | 每天午夜一次 |

> **注意**：Cron 输入框不支持行内注释（如 `# 注释`），只能输入表达式本身。

> **参考**：完整 Cron 表达式语法见 [Crontab HexDocs](https://hexdocs.pm/crontab/cron_notation.html)

#### 时区

Schedule 触发器使用**应用级时区**设置。如果应用未配置时区，默认使用你所在地的时区。

### 高级设置（设置面板）

#### 节点描述

为节点添加自定义描述，帮助团队成员理解触发器用途：

```yaml
nodeDescription: "每日报表生成 - 每个工作日上午 9 点执行"
```

## 测试与调试

### 手动运行（Dry Run）

Schedule 触发器工具栏提供了**运行**按钮，用于即时手动执行：

1. 点击 Schedule 触发器节点上的**运行**按钮
2. 工作流立即执行，**忽略 Cron 表达式计划**
3. 查看执行结果，验证工作流逻辑

适用场景：
- 在工作流按计划执行前进行测试
- 需要在计划外临时触发执行

> **提示**：手动运行不会影响 Cron 计划 —— 下一次计划执行照常进行。

## 工作流示例

### 示例 1：每日报表

```
Schedule Trigger
  Cron: 0 0 9 * * 1-5 (工作日上午 9 点)
  → HTTP Request Node
    URL: "https://api.example.com/reports/daily"
    Method: POST
  → Answer Node
    Answer: "日报已生成并发送"
```

### 示例 2：每 30 分钟同步数据

```
Schedule Trigger
  Cron: 0 */30 * * * * (每 30 分钟)
  → HTTP Request Node
    URL: "https://source-api.example.com/data"
    Method: GET
  → Code Node (转换数据)
    Code: |
      const source = $('HTTP Request').body;
      return source.items.map(item => ({
        id: item.uid,
        name: item.title,
        updated: item.modifiedAt
      }));
  → HTTP Request Node (同步到目标)
    URL: "https://target-api.example.com/bulk-import"
    Method: POST
    Body: $('Code').output
```

### 示例 3：每周更新知识库

```
Schedule Trigger
  Cron: @weekly (每周日午夜)
  → HTTP Request Node (获取最新文档)
    URL: "https://api.example.com/docs/latest"
    Method: GET
  → Knowledge Ingestion Node
    Document: $('HTTP Request').body
  → Answer Node
    Answer: "本周知识库已更新"
```

### 示例 4：月底清理任务

```
Schedule Trigger
  Cron: 0 0 0 28-31 * * (每月最后几天)
  → Code Node (判断是否为最后一天)
    Code: |
      const today = new Date();
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      return { isLastDay: today.getDate() === lastDay };
  → Conditional Branch
    Condition: $('Code').isLastDay === true
    → [是] → HTTP Request Node (执行清理)
      URL: "https://api.example.com/maintenance/cleanup"
      Method: POST
    → [否] → 结束
```

## 最佳实践

### 1. 重命名节点以清晰标识

Cron 输入框只接受表达式本身 —— 行内注释（如 `# 每周一`）**不被支持**，会导致解析错误。请直接**重命名节点**，在画布上一目了然：

```
# 不好的实践 — 名称无意义，不清楚干什么用
[Schedule Trigger]

# 好的实践 — 重命名为有意义的描述
[每周一 9:00 — 生成周报]
```

双击节点标题即可重命名。新名称会显示在画布和执行日志中，让每个触发器的用途一目了然。

### 2. 发布前充分测试

始终使用**手动运行**测试工作流，确认无误后再依赖定时计划：

```
1. 配置 Cron 表达式
2. 点击"运行"按钮手动测试
3. 确认所有节点正确执行
4. 发布工作流
5. 监控首次计划执行
```

### 3. 添加错误处理

```
Schedule Trigger
  → Try/Catch
    → 主要工作流逻辑
    → [错误] → 发送通知给管理员
```

### 4. 注意时区设置

确保应用级时区设置正确，尤其对于时间敏感的任务：

- 工作时间报表 → 使用对应业务时区
- 午夜任务 → 明确是哪里的午夜

### 5. 避免执行重叠

对于耗时较长的工作流，需考虑上一次执行是否可能在下次触发前完成：

```yaml
# 如果工作流需要 10 分钟，不要设置每 5 分钟执行一次
cron: "0 */5 * * * *"   # ⚠️ 可能与上次执行重叠

# 留出足够间隔
cron: "0 */30 * * * *"  # ✓ 10 分钟的工作流安全
```

> **注意**：上面 `#` 注释仅作为文档说明 —— 请勿粘贴到 Cron 输入框中。

## 常见问题

### Q: 一个工作流可以有几个 Schedule 触发器？

**A**：每个工作流最多 **一个** Schedule 触发器。如果需要对同一逻辑设置多个执行计划，请创建多个工作流。

### Q: 如果计划时间点系统宕机，错过的执行会补跑吗？

**A**：不会。Cron 调度器不会追溯执行错过的运行。如果系统在计划时间点不可用，该次执行会被跳过，下一次计划执行照常进行。

**建议**：对于关键任务，建议添加监控工作流或外部健康检查。

### Q: 能否手动跳过一次计划执行？

**A**：不能。Schedule 触发器严格按照 Cron 表达式执行。如需跳过某次执行，可在计划时间前暂时停用工作流，之后重新启用。

### Q: 如何测试 Schedule 触发器工作流？

**A**：使用节点工具栏中的**运行**按钮（手动运行）。它会立即执行工作流，绕过 Cron 计划，无需等待即可验证逻辑和输出。

### Q: Schedule 触发器会输出数据吗？

**A**：目前 Schedule 触发器不输出数据，纯粹作为工作流入口使用。如需时间戳信息，可在工作流中使用 Code 节点调用 `new Date()`。

### Q: Schedule 触发器使用哪个时区？

**A**：使用**应用级时区**设置。如果未配置，默认使用你所在地的时区。请检查应用设置以确保时区正确。

### Q: Schedule 触发器 vs 外部 Cron（如 Linux crontab + Webhook）？

**A**：

| 特性 | Schedule 触发器 | 外部 Cron + Webhook |
| --- | --- | --- |
| 配置 | 内置，无需外部系统 | 需配置 Cron 和 API 调用 |
| 监控 | 集成在应用日志中 | 需单独监控 |
| 时区 | 应用级时区 | 系统时区 |
| 安全性 | 内部执行 | 暴露 Webhook 端点 |
| 手动测试 | 内置运行按钮 | 手动执行 curl 命令 |

**建议**：优先使用 Schedule 触发器处理 {{PRODUCT_NAME}} 内的周期性任务。仅在需要跨系统编排时才使用外部 Cron + Webhook。

### Q: 为什么我写的 `0 6 * * *` 变成了每小时执行一次？

**A**：{{PRODUCT_NAME}} 使用扩展 crontab 语法，始终从左到右按 `秒 分 时 日 月 周 年` 解析。你写了 5 个字段，系统解析为：

| 字段 | 值 | 含义 |
| --- | --- | --- |
| 秒 | `0` | 第 0 秒 |
| 分 | `6` | 第 6 分 |
| 时 | `*` | 每小时 |
| 日 | `*` | 每天 |
| 月 | `*` | 每月 |

结果：**每小时的第 6 分钟**触发。

**修复**：始终写 6 个字段。如果你想每天 6:00 执行，请写 `0 0 6 * * *`（秒=0 分=0 时=6）。

## 下一步

- [Webhook 触发器](/zh-hans/guide/workflow/nodes/trigger-nodes/webhook) - 了解 HTTP 触发方式
- [节点操作基础](/zh-hans/guide/working-with-nodes) - 学习工作流设计基础
- [表达式语法](/zh-hans/guide/expressions) - 学习如何在节点中使用表达式

## 相关资源

- [HTTP 请求节点](/zh-hans/guide/workflow/nodes/action-nodes/http-request) - 在工作流中发送 HTTP 请求
- [Wait 节点](/zh-hans/guide/workflow/nodes/action-nodes/wait) - 在工作流步骤间添加延迟
- [Crontab HexDocs](https://hexdocs.pm/crontab/cron_notation.html) - 完整 Cron 表达式参考
